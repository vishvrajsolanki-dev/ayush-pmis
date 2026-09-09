# Phase 4 — database session (async SQLAlchemy)
# LOCAL/TEST: uses SQLite if DATABASE_URL absent (intentional for tests)
# PRODUCTION: requires DATABASE_URL from environment; fails closed if missing
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
import os

LOCAL_SQLITE = "sqlite+aiosqlite:///./alloc.db"
DATABASE_URL = os.environ.get("DATABASE_URL")

# Render sets RENDER=true; explicit ENV=production also qualifies
_IS_PRODUCTION = os.environ.get("ENV") == "production" or os.environ.get("RENDER") == "true"
if DATABASE_URL is None and _IS_PRODUCTION:
    raise RuntimeError("DATABASE_URL required in production; set DATABASE_URL environment variable")
if DATABASE_URL is None:
    DATABASE_URL = LOCAL_SQLITE


# Async driver fix: production PostgreSQL URL must use asyncpg for create_async_engine
# Sync Alembic/sqlite paths kept intact; no credentials exposed
if DATABASE_URL and DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
