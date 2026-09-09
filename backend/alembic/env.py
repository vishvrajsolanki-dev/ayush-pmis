from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context
import sys, os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from models.entities import Base
target_metadata = Base.metadata

def get_url():
    # Production: DATABASE_URL from environment; no hardcoded credentials
    url = os.environ.get("DATABASE_URL")
    if not url:
        # Local/dev/test: fall back to sqlite in alembic.ini
        return None
    return url.replace("sqlite+aiosqlite://", "sqlite://").replace("postgresql+asyncpg://", "postgresql://")

def run_migrations_online():
    config = context.config
    fileConfig(config.config_file_name)
    url = get_url()
    if url is None:
        # Fall back to ini config for local/dev migrations
        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )
    else:
        connectable = create_engine(url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        context.run_migrations()

def run_migrations_offline():
    url = get_url() or context.config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
