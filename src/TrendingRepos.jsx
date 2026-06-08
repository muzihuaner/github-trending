import { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCodeFork, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'

const LANGUAGES = [
  'All', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C++',
  'PHP', 'C#', 'Ruby', 'Go', 'Swift', 'Rust',
  'Kotlin', 'Dart', 'Vue', 'React',
]

const PERIODS = [
  { value: 'past_24_hours', label: '过去一天' },
  { value: 'past_week', label: '过去一周' },
  { value: 'past_month', label: '过去一个月' },
  { value: 'past_3_months', label: '过去三个月' },
]

function getLanguageType(language) {
  const types = {
    JavaScript: 'var(--lang-js)',
    Python: 'var(--lang-py)',
    Java: 'var(--lang-java)',
    TypeScript: 'var(--lang-ts)',
    'C++': 'var(--lang-cpp)',
    Go: 'var(--lang-go)',
    Rust: 'var(--lang-rust)',
    Swift: 'var(--lang-swift)',
    Kotlin: 'var(--lang-kt)',
  }
  return types[language] || 'var(--lang-default)'
}

function formatNumber(num) {
  const n = Number(num)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export default function TrendingRepos() {
  const [selectedPeriod, setSelectedPeriod] = useState('past_month')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  const fetchRepos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = `/api/v1/trends/repos/?period=${selectedPeriod}&language=${selectedLanguage}`
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) })

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.message || `Request failed (${res.status})`
        throw new Error(msg)
      }

      const data = await res.json()
      setRepos(data.data?.rows ?? [])
    } catch (err) {
      if (err.name === 'TimeoutError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(err.message || 'Failed to fetch data. Please try again later.')
      }
      console.error('Error fetching repos:', err)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod, selectedLanguage])

  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  function handleFilterChange() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(fetchRepos, 300)
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-section">
          <h1 className="title">🔥 热门仓库</h1>
          <p className="subtitle">我们将所有仓库根据得分进行排名。总得分 = 星标得分 + 分支得分 + 基础得分。</p>
        </div>
      </header>

      <div className="filters">
        <select
          className="filter-select"
          value={selectedPeriod}
          onChange={(e) => { setSelectedPeriod(e.target.value); handleFilterChange() }}
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedLanguage}
          onChange={(e) => { setSelectedLanguage(e.target.value); handleFilterChange() }}
        >
          <option value="All">所有语言</option>
          {LANGUAGES.filter((l) => l !== 'All').map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <main className="content">
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Loading trending repositories...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchRepos}>Try Again</button>
          </div>
        ) : (
          <div className="repo-list">
            {repos.map((repo, i) => (
              <article key={repo.repo_name ?? i} className="repo-card">
                <div className="repo-rank">{i + 1}</div>
                <div className="repo-header">
                  <h2 className="repo-name">
                    <a href={`https://github.com/${repo.repo_name}`} target="_blank" rel="noopener noreferrer">
                      {repo.repo_name}
                    </a>
                  </h2>
                  {repo.primary_language && (
                    <span
                      className="lang-badge"
                      style={{ '--badge-color': getLanguageType(repo.primary_language) }}
                    >
                      <span className="lang-dot" style={{ background: getLanguageType(repo.primary_language) }} />
                      {repo.primary_language}
                    </span>
                  )}
                </div>
                {repo.description && <p className="repo-desc">{repo.description}</p>}
                <div className="repo-meta">
                  <span className="meta-item">
                    <FontAwesomeIcon icon={faStar} className="meta-icon star" />
                    {formatNumber(repo.stars ?? repo.stargazers_count ?? 0)}
                  </span>
                  <span className="meta-item">
                    <FontAwesomeIcon icon={faCodeFork} className="meta-icon" />
                    {formatNumber(repo.forks ?? repo.forks_count ?? 0)}
                  </span>
                  <span className="meta-item trend">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="meta-icon trend-icon" />
                    +{formatNumber(repo.total_score ?? 0)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
