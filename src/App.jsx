import { useState } from 'react'
import NavBar from './NavBar'
import TrendingRepos from './TrendingRepos'
import HotCollections from './HotCollections'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('trending')

  return (
    <>
      <NavBar activeSection={activeSection} onNavigate={setActiveSection} />
      {activeSection === 'trending' ? <TrendingRepos /> : <HotCollections />}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} <a href="https://huangetech.github.io" target="_blank" rel="noopener noreferrer">HuanGeTech</a>
          &nbsp;
        </p>
      </footer>
    </>
  )
}

export default App
