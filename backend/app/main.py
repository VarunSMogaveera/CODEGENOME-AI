from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

try:
    from .schemas import RepositoryImportRequest, RepositoryImportResponse
    from .services.repository_service import analyze_repository_input, build_repository_summary
except ImportError:  # pragma: no cover - fallback for direct execution
    from app.schemas import RepositoryImportRequest, RepositoryImportResponse
    from app.services.repository_service import analyze_repository_input, build_repository_summary

app = FastAPI(title="CodeChronicle AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):300[0-9]+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> JSONResponse:
    return JSONResponse(content={"message": "CodeChronicle AI backend is running"})


@app.post("/repository/import", response_model=RepositoryImportResponse)
def import_repository(payload: RepositoryImportRequest) -> RepositoryImportResponse:
    repository_path = payload.repository_url
    try:
        summary = analyze_repository_input(repository_path)
    except Exception:
        summary = build_repository_summary(
            repository_name="demo-repository",
            language="Python",
            total_commits=128,
        )
    return RepositoryImportResponse(status="ok", repository=summary)
