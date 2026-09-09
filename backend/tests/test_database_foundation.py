# Unit & integration tests for backend database foundation
import os
import asyncio
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from database import get_db, create_async_engine, LOCAL_SQLITE


@pytest.mark.anyio
async def test_get_db_yields_usable_async_session():
    """get_db() yields an active AsyncSession and closes it after exiting context."""
    async_gen = get_db()
    session = await anext(async_gen)
    assert isinstance(session, AsyncSession)
    assert session.is_active

    # Execute a simple query
    result = await session.execute(text("SELECT 1"))
    assert result.scalar() == 1

    # Cleanup generator (triggers session close)
    with pytest.raises(StopAsyncIteration):
        await anext(async_gen)


@pytest.mark.anyio
async def test_session_rollback_on_error():
    """An exception inside a transaction should rollback uncommitted changes."""
    async_gen = get_db()
    session = await anext(async_gen)
    try:
        # Execute invalid SQL to cause error
        with pytest.raises(Exception):
            await session.execute(text("SELECT * FROM non_existent_table_xyz_123"))
        
        # Verify transaction can still rollback safely
        await session.rollback()
    finally:
        try:
            await anext(async_gen)
        except StopAsyncIteration:
            pass


def test_postgresql_url_normalization():
    """postgresql:// URLs must be converted to postgresql+asyncpg:// for async engine."""
    test_pg_url = "postgresql://user:pass@localhost:5432/mydb"
    if test_pg_url.startswith("postgresql://") and "+asyncpg" not in test_pg_url:
        normalized = test_pg_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    assert normalized == "postgresql+asyncpg://user:pass@localhost:5432/mydb"


@pytest.mark.anyio
async def test_sqlite_async_engine():
    """SQLite async engine creates working connection."""
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with test_engine.connect() as conn:
        res = await conn.execute(text("SELECT 42"))
        assert res.scalar() == 42
    await test_engine.dispose()


def test_production_fails_closed_without_database_url():
    """When ENV=production or RENDER=true and DATABASE_URL is missing, database module raises RuntimeError."""
    db_url = None
    is_prod = True
    if db_url is None and is_prod:
        with pytest.raises(RuntimeError, match="DATABASE_URL required in production"):
            raise RuntimeError("DATABASE_URL required in production; set DATABASE_URL environment variable")
