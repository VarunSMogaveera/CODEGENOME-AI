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
# Linux / macOS
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8010 --reload

# Windows (PowerShell)
cd backend
python -m venv .venv
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8010 --reload
```

### Frontend

```bash
cd frontend
npm install
# dev server (local)
npm run dev -- --hostname 127.0.0.1 --port 3000

# To build for production
npm run build
npm start
```

### Playwright E2E test

With the backend running on `http://127.0.0.1:8010`, run the frontend test in a separate terminal:

```powershell
cd C:\Users\HP\Desktop\CodeGenome-AI\frontend
npx playwright install --with-deps
npx playwright test
```

If Playwright is already installed once, you can simply run:

```powershell
cd C:\Users\HP\Desktop\CodeGenome-AI\frontend
npx playwright test
```

The test will automatically start the frontend app and exercise the repository import flow headlessly.

## Run & restart tips

- If you change backend code and see stale responses, restart the backend server. On Windows you can find the process using:

```powershell
netstat -ano | findstr :8010
taskkill /F /PID <pid>
# then restart as above
```

- The frontend uses `NEXT_PUBLIC_API_URL` to call the backend. To point the frontend at a running local backend, set this in your environment before starting the dev server:

```bash
export NEXT_PUBLIC_API_URL=http://127.0.0.1:8010   # macOS / Linux
setx NEXT_PUBLIC_API_URL "http://127.0.0.1:8010"  # Windows (persist)
```

- If `8010` is already used, start the backend on a different port and update `NEXT_PUBLIC_API_URL` accordingly.

- Quick API test (from backend folder):

```bash
.venv\Scripts\python.exe -c "import json,urllib.request; data=json.dumps({'repository_url':'https://github.com/owner/repo'}).encode(); req=urllib.request.Request('http://127.0.0.1:8010/repository/import', data=data, headers={'Content-Type':'application/json'}); print(urllib.request.urlopen(req).read().decode())"
```

## MVP scope

- Repository import from Git URL
- Git history extraction
- Repository analytics
- Dependency graph exploration
- Technical debt scoring
- AI-generated engineering explanation
- Bug risk prediction
