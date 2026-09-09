"""Regression: every Alembic migration must declare revision/down_revision metadata."""
import glob, os, ast

VERSIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "alembic", "versions")

def test_all_migrations_have_revision_metadata():
    files = sorted(glob.glob(os.path.join(VERSIONS_DIR, "*.py")))
    files = [f for f in files if os.path.basename(f) != "__init__.py"]
    assert files, "no migration files found"
    for fpath in files:
        with open(fpath) as f: src = f.read()
        tree = ast.parse(src)
        names = {node.targets[0].id for node in ast.walk(tree)
                 if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name)}
        assert "revision" in names, f"{os.path.basename(fpath)} missing revision"
        assert "down_revision" in names, f"{os.path.basename(fpath)} missing down_revision"
