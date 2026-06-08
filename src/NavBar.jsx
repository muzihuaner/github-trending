import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faBookBookmark } from '@fortawesome/free-solid-svg-icons'

export default function NavBar({ activeSection, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); onNavigate('trending') }}>
          <FontAwesomeIcon icon={faFire} className="brand-icon" />
          快点开源软件趋势
        </a>
        <div className="navbar-links">
          <button
            className={`nav-link ${activeSection === 'trending' ? 'active' : ''}`}
            onClick={() => onNavigate('trending')}
          >
            <FontAwesomeIcon icon={faFire} />
            热门仓库
          </button>
          <button
            className={`nav-link ${activeSection === 'collections' ? 'active' : ''}`}
            onClick={() => onNavigate('collections')}
          >
            <FontAwesomeIcon icon={faBookBookmark} />
            热门收藏
          </button>
        </div>
      </div>
    </nav>
  )
}
