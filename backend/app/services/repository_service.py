import os
import subprocess
import tempfile
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse


def build_repository_summary(repository_name: str, language: str, total_commits: int) -> dict:
    """Create a simple repository summary for the MVP dashboard."""
    health_score = min(100, max(0, 85 + (total_commits // 100) - 5))

    return {
        "repository_name": repository_name,
        "language": language,
        "total_commits": total_commits,
        "health_score": health_score,
        "risk_level": "Low" if health_score >= 85 else "Medium" if health_score >= 70 else "High",
    }


def analyze_repository(repo_path: str) -> dict:
    """Analyze a local Git repository and extract basic engineering metrics."""
    repo = Path(repo_path).expanduser()
    if not repo.exists():
        raise FileNotFoundError(f"Repository path not found: {repo_path}")

    git_dir = repo / ".git"
    if not git_dir.exists():
        return {
            "repository_name": repo.name,
            "language": "Unknown",
            "total_commits": 0,
            "health_score": 0,
            "risk_level": "High",
            "file_count": len([path for path in repo.rglob("*") if path.is_file()]),
            "contributors": 0,
            "contributors_list": [],
            "recent_commits": [],
            "top_files": [],
            "risk_factors": ["Repository is not a Git repository"],
            "path": str(repo),
            "is_git_repository": False,
            "message": "This path is not a git repository. Please provide a repository folder or GitHub URL.",
        }

    total_commits = int(
        subprocess.check_output(["git", "rev-list", "--count", "HEAD"], cwd=repo, text=True).strip()
    )
    contributors_output = subprocess.check_output(["git", "shortlog", "-sne", "HEAD"], cwd=repo, text=True)
    contributor_lines = [line.strip() for line in contributors_output.splitlines() if line.strip()]
    contributors_list = []
    for line in contributor_lines:
        parts = line.split("\t")
        if len(parts) >= 2:
            name = parts[-1].split("<")[0].strip()
            contributors_list.append(name)
        elif parts:
            contributors_list.append(parts[0].strip())

    recent_commits_output = subprocess.check_output(
        ["git", "log", "-n", "5", "--pretty=format:%H%x09%an%x09%ad%x09%s", "--date=short"],
        cwd=repo,
        text=True,
    )
    recent_commits = []
    for line in recent_commits_output.splitlines():
        parts = line.split("\t")
        if len(parts) >= 4:
            recent_commits.append({
                "hash": parts[0][:7],
                "author": parts[1],
                "date": parts[2],
                "message": parts[3],
            })

    file_change_output = subprocess.check_output(
        ["git", "log", "--name-only", "--pretty=format:"],
        cwd=repo,
        text=True,
    )
    changed_files = [line.strip() for line in file_change_output.splitlines() if line.strip()]
    file_counter = Counter(changed_files)
    top_files = [path for path, _ in file_counter.most_common(5)]

    files = [path for path in repo.rglob("*") if path.is_file() and ".git" not in path.parts]

    file_count = len(files)
    language = "Unknown"
    language_breakdown = []
    language_counts = Counter()
    for path in files:
        suffix = path.suffix.lower()
        if suffix == ".py":
            language_counts["Python"] += 1
        elif suffix in {".js", ".jsx", ".ts", ".tsx"}:
            language_counts["JavaScript"] += 1
        elif suffix == ".java":
            language_counts["Java"] += 1
        elif suffix == ".cs":
            language_counts["C#"] += 1
        elif suffix == ".cpp" or suffix == ".cc" or suffix == ".cxx" or suffix == ".c":
            language_counts["C/C++"] += 1
        elif suffix == ".go":
            language_counts["Go"] += 1
        elif suffix == ".rb":
            language_counts["Ruby"] += 1
        elif suffix == ".php":
            language_counts["PHP"] += 1
        elif suffix == ".md":
            language_counts["Markdown"] += 1
        elif suffix == ".json":
            language_counts["JSON"] += 1
        elif suffix == ".yml" or suffix == ".yaml":
            language_counts["YAML"] += 1

    if language_counts:
        language_breakdown = [
            {"language": language_name, "file_count": count}
            for language_name, count in sorted(language_counts.items(), key=lambda item: item[1], reverse=True)
        ]
        if any(item["language"] == "Python" for item in language_breakdown):
            language = "Python"
        elif any(item["language"] == "Java" for item in language_breakdown):
            language = "Java"
        elif any(item["language"] == "JavaScript" for item in language_breakdown):
            language = "JavaScript"
        else:
            language = language_breakdown[0]["language"]

    risk_factors = []
    if total_commits < 10:
        risk_factors.append("Low commit history")
    if file_count > 200:
        risk_factors.append("Large file footprint")
    if len(contributors_list) < 2:
        risk_factors.append("Single-contributor signals")
    if not top_files:
        risk_factors.append("No history-based file hotspots")

    summary = build_repository_summary(
        repository_name=repo.name,
        language=language,
        total_commits=total_commits,
    )
    summary.update({
        "file_count": file_count,
        "contributors": len(contributors_list),
        "contributors_list": contributors_list,
        "recent_commits": recent_commits,
        "top_files": top_files,
        "risk_factors": risk_factors or ["Stable repository health"],
        "path": str(repo),
        "language_breakdown": language_breakdown,
        "is_git_repository": True,
        "message": "Repository analysis completed successfully.",
    })
    return summary


def analyze_repository_input(repository_input: str) -> dict:
    """Analyze a local repository path or a GitHub URL."""
    candidate = (repository_input or "").strip()
    if not candidate:
        raise ValueError("Repository input is empty")

    parsed = urlparse(candidate)
    if parsed.scheme in {"http", "https"} and parsed.netloc.endswith("github.com"):
        repo_path = parsed.path.strip("/").rstrip("/")
        if repo_path.count("/") == 1:
            repo_name = repo_path.split("/")[-1]
            with tempfile.TemporaryDirectory() as temp_dir:
                clone_path = Path(temp_dir) / repo_name
                subprocess.run(
                    ["git", "clone", candidate, str(clone_path)],
                    check=True,
                    capture_output=True,
                    text=True,
                )
                return analyze_repository(str(clone_path))

    normalized_path = Path(candidate).expanduser()
    if normalized_path.exists():
        return analyze_repository(str(normalized_path))

    cwd_path = (Path.cwd() / normalized_path).resolve()
    if cwd_path.exists():
        return analyze_repository(str(cwd_path))

    raise FileNotFoundError(f"Repository path not found: {candidate}")
