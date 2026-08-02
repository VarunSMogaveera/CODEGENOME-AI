import os
import subprocess
import tempfile
import unittest
from pathlib import Path

from app.services.repository_service import analyze_repository, analyze_repository_input, build_repository_summary


class RepositoryServiceTests(unittest.TestCase):
    def test_build_repository_summary_includes_health_score(self):
        summary = build_repository_summary(
            repository_name="demo-repo",
            language="Python",
            total_commits=240,
        )

        self.assertEqual(summary["repository_name"], "demo-repo")
        self.assertEqual(summary["language"], "Python")
        self.assertEqual(summary["total_commits"], 240)
        self.assertIn("health_score", summary)
        self.assertGreaterEqual(summary["health_score"], 0)
        self.assertLessEqual(summary["health_score"], 100)

    def test_analyze_repository_extracts_basic_metrics_from_local_repo(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo_path = Path(temp_dir) / "sample-repo"
            repo_path.mkdir()

            subprocess.run(["git", "init"], cwd=repo_path, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(["git", "config", "user.email", "tester@example.com"], cwd=repo_path, check=True)
            subprocess.run(["git", "config", "user.name", "Tester"], cwd=repo_path, check=True)
            (repo_path / "README.md").write_text("hello", encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo_path, check=True)
            subprocess.run(["git", "commit", "-m", "initial"], cwd=repo_path, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            summary = analyze_repository(str(repo_path))

            self.assertEqual(summary["repository_name"], "sample-repo")
            self.assertGreaterEqual(summary["total_commits"], 1)
            self.assertGreaterEqual(summary["file_count"], 1)
            self.assertIn("health_score", summary)

    def test_analyze_repository_input_accepts_relative_paths(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo_path = Path(temp_dir) / "sample-repo"
            repo_path.mkdir()

            subprocess.run(["git", "init"], cwd=repo_path, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(["git", "config", "user.email", "tester@example.com"], cwd=repo_path, check=True)
            subprocess.run(["git", "config", "user.name", "Tester"], cwd=repo_path, check=True)
            (repo_path / "README.md").write_text("hello", encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo_path, check=True)
            subprocess.run(["git", "commit", "-m", "initial"], cwd=repo_path, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            previous_cwd = os.getcwd()
            try:
                os.chdir(temp_dir)
                summary = analyze_repository_input("sample-repo")
            finally:
                os.chdir(previous_cwd)

            self.assertEqual(summary["repository_name"], "sample-repo")
            self.assertGreaterEqual(summary["total_commits"], 1)

    def test_analyze_repository_input_reports_non_git_directories(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            folder = Path(temp_dir) / "plain-folder"
            folder.mkdir()
            (folder / "notes.txt").write_text("hello", encoding="utf-8")

            summary = analyze_repository_input(str(folder))

            self.assertEqual(summary["repository_name"], "plain-folder")
            self.assertFalse(summary["is_git_repository"])
            self.assertIn("not a git repository", summary["message"].lower())


if __name__ == "__main__":
    unittest.main()
