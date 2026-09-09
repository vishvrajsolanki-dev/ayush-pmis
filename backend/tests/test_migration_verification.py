# Disposable local database migration verification test
import os
import tempfile
import pytest
from alembic.config import Config
from alembic import command
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import text


@pytest.mark.anyio
async def test_fresh_sqlite_migration_and_persistence():
    """Verify fresh database creation, alembic upgrade head, table inspection, and async persistence."""
    # Create temporary database file
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp_db:
        tmp_db_path = tmp_db.name

    try:
        sync_url = f"sqlite:///{tmp_db_path}"
        async_url = f"sqlite+aiosqlite:///{tmp_db_path}"

        # 1 & 2. Run alembic upgrade head on fresh database
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        alembic_ini_path = os.path.join(backend_dir, "alembic.ini")
        alembic_cfg = Config(alembic_ini_path)
        alembic_cfg.set_main_option("sqlalchemy.url", sync_url)
        alembic_cfg.set_main_option("script_location", os.path.join(backend_dir, "alembic"))

        command.upgrade(alembic_cfg, "head")

        # 3 & 4. Inspect actual tables created via async engine
        engine = create_async_engine(async_url, echo=False)
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
            tables = {row[0] for row in res.fetchall()}
            
            # Revision 001 creates users, students, institutions, companies, and alembic_version
            assert "users" in tables
            assert "students" in tables
            assert "institutions" in tables
            assert "companies" in tables
            assert "alembic_version" in tables

            # Verify columns on users table
            res_cols = await conn.execute(text("PRAGMA table_info(users);"))
            col_names = {row[1] for row in res_cols.fetchall()}
            assert "id" in col_names
            assert "email" in col_names
            assert "role" in col_names

        # 5 & 6. Connect through AsyncSession and perform minimal persistence operation
        SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with SessionLocal() as session:
            await session.execute(
                text("INSERT INTO users (id, email, role) VALUES (:id, :email, :role)"),
                {"id": "usr-test-123", "email": "migtest@example.com", "role": "STUDENT"}
            )
            await session.commit()

            # Read back
            res_user = await session.execute(
                text("SELECT email, role FROM users WHERE id = :id"),
                {"id": "usr-test-123"}
            )
            user_row = res_user.fetchone()
            assert user_row is not None
            assert user_row[0] == "migtest@example.com"
            assert user_row[1] == "STUDENT"

        # 7. Cleanup session & engine
        await engine.dispose()

    finally:
        if os.path.exists(tmp_db_path):
            os.remove(tmp_db_path)
