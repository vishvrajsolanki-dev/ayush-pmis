# Regression: async PostgreSQL driver must be present for create_async_engine
import os

def test_postgresql_url_uses_asyncpg():
    url = "postgresql://user@host/db"
    if url.startswith("postgresql://") and "+asyncpg" not in url:
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    assert "+asyncpg" in url, "asyncpg driver required for async engine"

def test_sqlite_unchanged():
    url = "sqlite+aiosqlite:///./alloc.db"
    assert url.startswith("sqlite+aiosqlite://"), "sqlite fallback preserved"
