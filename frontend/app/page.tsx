"use client";

import { FormEvent, useState } from "react";

type RecentCommit = {
  hash?: string;
  author?: string;
  date?: string;
  message?: string;
};

type RepositorySummary = {
  repository_name?: string;
  language?: string;
  total_commits?: number;
  health_score?: number;
  risk_level?: string;
  file_count?: number;
  contributors?: number;
  contributors_list?: string[];
  recent_commits?: RecentCommit[];
  top_files?: string[];
  risk_factors?: string[];
  path?: string;
  is_git_repository?: boolean;
  message?: string;
};

type AnalysisResponse = {
  status?: string;
  repository?: RepositorySummary;
};

export default function HomePage() {
  const [repoPath, setRepoPath] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleRepos = [
    "https://github.com/VarunSMogaveera/Supply-Chain-Tracker",
    "https://github.com/vercel/next.js",
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8010";
    try {
      const response = await fetch(`${apiBaseUrl}/repository/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repository_url: repoPath }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as AnalysisResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const repository = result?.repository;
  const riskTone = (repository?.risk_level || "Medium").toLowerCase();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Engineering intelligence platform</p>
          <h1>Analyze any Git repository in seconds</h1>
          <p>
            Inspect commit history, contributor activity, file volume, language signals, and health risk in one polished dashboard.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setRepoPath(sampleRepos[0])}
            >
              Try the sample repo
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-chip">Git insights</div>
          <div className="panel-chip">Risk scoring</div>
          <div className="panel-chip">Contributor signals</div>
          <div className="panel-chip">Code health</div>
        </div>
      </section>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="repoPath">Repository URL or local path</label>
          <div className="input-row">
            <input
              id="repoPath"
              value={repoPath}
              onChange={(event) => setRepoPath(event.target.value)}
              placeholder="Example: https://github.com/owner/repo"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze repository"}
            </button>
          </div>

          <div className="example-row">
            {sampleRepos.map((example) => (
              <button key={example} type="button" className="example-pill" onClick={() => setRepoPath(example)}>
                {example.split("/").pop()}
              </button>
            ))}
          </div>
        </form>
      </section>

      {error && (
        <section className="status-card error-card">
          <h2>Request error</h2>
          <p>{error}</p>
        </section>
      )}

      {loading && (
        <section className="status-card loading-card">
          <h2>Analyzing repository...</h2>
          <p>Scanning history, files, and health signals for your repository.</p>
        </section>
      )}

      {repository && (
        <section className="summary-card">
          <div className="summary-header">
            <div>
              <p className="eyebrow">Repository summary</p>
              <h2>{repository.repository_name || "Repository"}</h2>
            </div>
            <div className="pill-row">
              <span className={`badge ${repository.is_git_repository ? "ok" : "warn"}`}>
                {repository.is_git_repository ? "Git repository detected" : "No git history detected"}
              </span>
              <span className={`badge risk-${riskTone}`}>
                {repository.risk_level || "Medium"}
              </span>
            </div>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-label">Commits</span>
              <strong>{repository.total_commits ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Files</span>
              <strong>{repository.file_count ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Contributors</span>
              <strong>{repository.contributors ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Health score</span>
              <strong>{repository.health_score ?? 0}</strong>
            </article>
          </div>

          <div className="signal-grid">
            <div className="signal-card">
              <h3>Engineering signals</h3>
              <ul>
                <li>Language: {repository.language || "Unknown"}</li>
                <li>Path: {repository.path || "Unavailable"}</li>
                <li>Status: {repository.message || "Analysis complete"}</li>
              </ul>
            </div>

            <div className="signal-card">
              <h3>Contributors</h3>
              <div className="chip-list">
                {(repository.contributors_list && repository.contributors_list.length > 0)
                  ? repository.contributors_list.map((name) => <span key={name} className="chip">{name}</span>)
                  : <span className="chip">No contributor data available</span>}
              </div>
            </div>

            <div className="signal-card">
              <h3>Recent commits</h3>
              <div className="list-stack">
                {(repository.recent_commits && repository.recent_commits.length > 0)
                  ? repository.recent_commits.map((entry) => (
                      <div key={entry.hash || entry.message} className="list-item">
                        <strong>{entry.message || "Commit"}</strong>
                        <span>
                          {entry.author || "Unknown author"} • {entry.date || "Unknown date"}
                        </span>
                      </div>
                    ))
                  : <p className="muted">No recent commit history available.</p>}
              </div>
            </div>

            <div className="signal-card">
              <h3>Top files</h3>
              <div className="list-stack">
                {(repository.top_files && repository.top_files.length > 0)
                  ? repository.top_files.map((file) => <div key={file} className="list-item"><span>{file}</span></div>)
                  : <p className="muted">No file hotspot data available.</p>}
              </div>
            </div>
          </div>

          <div className="signal-card risk-card">
            <h3>Technical debt & risk</h3>
            <div className="chip-list">
              {(repository.risk_factors && repository.risk_factors.length > 0)
                ? repository.risk_factors.map((factor) => <span key={factor} className="chip">{factor}</span>)
                : <span className="chip">No special risk signals detected</span>}
            </div>
            <p className="muted compact">
              This MVP highlights maintainability concerns, commit sparsity, and contributor concentration as early risk signals.
            </p>
          </div>

          <div className="signal-card">
            <h3>Commit activity</h3>
            <div className="activity-bars">
              {(repository.recent_commits && repository.recent_commits.length > 0)
                ? repository.recent_commits.map((entry, index) => (
                    <div key={entry.hash || `${entry.message}-${index}`} className="activity-row">
                      <div className="activity-bar" style={{ height: `${Math.max(36, 70 - index * 10)}px` }} />
                      <div className="activity-labels">
                        <strong>{entry.date || "n/a"}</strong>
                        <span>{entry.message || "Commit"}</span>
                      </div>
                    </div>
                  ))
                : <p className="muted">No activity data available.</p>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
