import { useState, useEffect } from 'react'
import { patterns, REPO_URL } from './data/patternsMeta'
import { getTopicComplete } from './components/training/TopicReceipt'
import { PatternPage } from './components/PatternPage'
import './App.css'

function App() {
  const [activeId, setActiveId] = useState('two-pointers')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const active = patterns.find((p) => p.id === activeId) ?? patterns[0]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href={REPO_URL} target="_blank" rel="noreferrer">
          <span className="brand-icon">◇</span>
          <div>
            <strong>DSA Cheatsheet</strong>
            <small>Interview revision</small>
          </div>
        </a>
        <p className="sidebar-note">
          Interview revision cheatsheets from{' '}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            DSA-Taxonomies
          </a>
        </p>
        {active.available && active.root && (
          <div className="pattern-toc">
            <span className="toc-label">Jump to</span>
            <a href="#pattern-gate">Step 0 · Is {active.title}?</a>
            <a href="#must-know">★ Must-know</a>
            {active.root.branches?.map((b) => (
              <a key={b.child.id} href={`#sec-${b.child.id}`}>
                {b.label.replace(/^→\s*/, '')}
              </a>
            ))}
          </div>
        )}
        <nav>
          {patterns.map((p) => {
            const complete = p.available && getTopicComplete(p.id)
            return (
              <button
                key={p.id}
                type="button"
                className={`nav-item ${p.id === activeId ? 'active' : ''} ${!p.available ? 'locked' : ''} ${complete ? 'complete' : ''}`}
                onClick={() => setActiveId(p.id)}
              >
                <span className="nav-order">{complete ? '✓' : p.order}</span>
                <span className="nav-title">{p.title}</span>
                {!p.available && <span className="soon">soon</span>}
                {p.available && !complete && <span className="live">live</span>}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <span className="icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </aside>

      <main className="main">
        <PatternPage pattern={active} />
      </main>
    </div>
  )
}

export default App
