Develop By Allen Christian 
# AYUSH — Adaptive Allocation Engine

**Project**: Adaptive Allocation Engine for government internship placement. See [docs/00-product/PRODUCT_NARRATIVE.md](docs/00-product/PRODUCT_NARRATIVE.md) for the full narrative. Technical source: [docs/00-product/MASTER_DESIGN.md](docs/00-product/MASTER_DESIGN.md) and [docs/02-architecture/ARCHITECTURE.md](docs/02-architecture/ARCHITECTURE.md).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js / Vercel (separate — see [frontend/README.md](frontend/README.md)) |
| Backend | FastAPI / Render |
| Database | PostgreSQL + pgvector |
| Scheduler | APScheduler |

---

## Project Structure

```
AYUSH/
├── backend/              # FastAPI backend (Python, venv)
│   ├── alloc_core/         # Allocation Core module
│   ├── tests/
│   └── requirements.txt
├── frontend/             # Next.js frontend (placeholder)
├── docs/                 # All reference documentation (read-only)
│   ├── 00-product/
│   ├── 01-requirements/
│   ├── 02-architecture/
│   ├── 03-engineering-specs/
│   ├── 04-ux/
│   ├── 05-planning/
│   ├── 06-testing/
│   ├── 07-demo/
│   └── 08-audit/
├── .github/              # PR template, issue templates, CI
├── .gitignore
├── DECISIONS.md          # Project decision log
├── ROADMAP.md
├── CONTRACTS.md
├── DEBT_LEDGER.md
├── CONFLICT_LOG.md
├── STARK_TEAM_BRIEF.md
├── CODEOWNERS
└── CONTRIBUTING.md
```

---

## Quick Setup (Backend Only — For Now)

```bash
# Clone and navigate
cd backend/
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# OR: .venv\Scripts\activate  # Windows
pip install -r requirements.txt
pytest --version          # Verify setup
```

---

## Key Documents

- **Project Specification**: [docs/00-product/PRD.md](docs/00-product/PRD.md)
- **Implementation Plan**: [docs/05-planning/IMPLEMENTATION_PLAN.md](docs/05-planning/IMPLEMENTATION_PLAN.md)
- **Architecture**: [docs/02-architecture/ARCHITECTURE.md](docs/02-architecture/ARCHITECTURE.md)
- **Test Plan**: [docs/06-testing/TEST_PLAN.md](docs/06-testing/TEST_PLAN.md)

Full documentation is in the `docs/` tree — organized by category (product, requirements, architecture, specs, UX, planning, testing, demo, audit).
