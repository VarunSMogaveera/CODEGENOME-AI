# CodeChronicle AI

CodeChronicle AI is an AI-assisted engineering intelligence platform for analyzing Git repositories, visualizing code evolution, and explaining technical debt and risk.

## Project structure

- frontend/: Next.js dashboard
- backend/: FastAPI API and services
- ml/: machine learning models and training scripts
- parsers/: source parsing helpers
- git_analyzer/: Git history extraction utilities
- tree_parser/: AST and dependency parsing
- ai_service/: AI explanation integration
- database/: schema and migration helpers
- docker/: deployment assets
- docs/: product and architecture documentation

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## MVP scope

- Repository import from Git URL
- Git history extraction
- Repository analytics
- Dependency graph exploration
- Technical debt scoring
- AI-generated engineering explanation
- Bug risk prediction
