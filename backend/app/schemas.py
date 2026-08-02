from pydantic import BaseModel


class RepositoryImportRequest(BaseModel):
    repository_url: str


class RepositoryImportResponse(BaseModel):
    status: str
    repository: dict
