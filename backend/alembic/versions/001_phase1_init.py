"""Phase 1 manual migration. Verified DATA_MODEL.md. Alembic CLI unavailable, Gate 4 deferred."""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table("users", sa.Column("id", sa.String(36), primary_key=True), sa.Column("email", sa.String(), nullable=False, unique=True), sa.Column("role", sa.String(50), nullable=False))
    op.create_table("students", sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id"), primary_key=True), sa.Column("tiebreak_key", sa.Float(), nullable=False))
    op.create_table("institutions", sa.Column("id", sa.String(36), primary_key=True), sa.Column("status", sa.String(50), server_default="PENDING"))
    op.create_table("companies", sa.Column("id", sa.String(36), primary_key=True))
def downgrade(): pass
