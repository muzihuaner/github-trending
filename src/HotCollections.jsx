import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faMinus, faBookBookmark } from '@fortawesome/free-solid-svg-icons'

function formatNumber(num) {
  const n = Number(num)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function RankChange({ change }) {
  const n = Number(change)
  if (!change || isNaN(n) || n === 0) {
    return <span className="rank-change stable"><FontAwesomeIcon icon={faMinus} /></span>
  }
  if (n > 0) {
    return <span className="rank-change up"><FontAwesomeIcon icon={faArrowUp} /> {n}</span>
  }
  return <span className="rank-change down"><FontAwesomeIcon icon={faArrowDown} /> {Math.abs(n)}</span>
}

function getTimelineItemType(rank) {
  if (rank <= 3) return 'success'
  if (rank <= 10) return 'warning'
  return 'info'
}

export default function HotCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCollections = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/v1/collections/hot/', { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      const rows = data.data?.rows ?? []
      const sorted = rows.sort((a, b) => a.repo_current_period_rank - b.repo_current_period_rank)
      const map = {}
      sorted.forEach((item) => {
        if (map[item.name]) {
          map[item.name].items.push(item)
        } else {
          map[item.name] = { name: item.name, repos: item.repos, items: [item] }
        }
      })
      setCollections(Object.values(map))
    } catch (err) {
      setError(err.message || 'Failed to fetch collections')
      console.error('Error fetching collections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCollections() }, [])

  const content = loading ? (
    <div className="loading">
      <div className="spinner" />
      <p>加载热门收藏...</p>
    </div>
  ) : error ? (
    <div className="error-state">
      <p>{error}</p>
      <button className="retry-btn" onClick={fetchCollections}>重试</button>
    </div>
  ) : (
    <>
      <header className="header">
        <h1 className="title"><FontAwesomeIcon icon={faBookBookmark} /> 热门收藏</h1>
        <p className="subtitle">
          对于技术领域的每月和历史排名以及趋势进行深入分析，借助精心挑选的仓库列表提供排名。
        </p>
      </header>

      <div className="collection-list">
        {collections.map((collection) => (
          <article key={collection.name} className="collection-card">
            <div className="collection-header">
              <h3 className="collection-name">{collection.name}</h3>
              <span className="collection-count">{formatNumber(collection.repos)} repositories</span>
            </div>
            <ol className="collection-items">
              {collection.items.slice(0, 5).map((item) => (
                <li key={item.repo_name} className="collection-item">
                  <span className={`item-rank rank-${getTimelineItemType(item.repo_current_period_rank)}`}>
                    {item.repo_current_period_rank}
                  </span>
                  <a
                    className="item-repo"
                    href={`https://github.com/${item.repo_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.repo_name}
                  </a>
                  <RankChange change={item.repo_rank_changes} />
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </>
  )

  return (
    <section className="collections-section">
      <div className="app-container">
        {content}
      </div>
    </section>
  )
}
