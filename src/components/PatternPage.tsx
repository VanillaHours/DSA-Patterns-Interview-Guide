import type { PatternMeta } from '../types'
import { CheatsheetBrowser } from './CheatsheetBrowser'
import './PatternPage.css'

export function PatternPage({ pattern }: { pattern: PatternMeta }) {
  if (!pattern.available || !pattern.root) {
    return (
      <div className="pattern-empty">
        <h2>{pattern.title}</h2>
        <p>Coming soon — same training sheet format as Two Pointers.</p>
        {pattern.githubPath && (
          <a href={pattern.githubPath} target="_blank" rel="noreferrer">
            View taxonomy on GitHub →
          </a>
        )}
      </div>
    )
  }

  return (
    <article className="pattern-page">
      <header className="pattern-hero">
        <div className="hero-text">
          <span className="pattern-num">Pattern {pattern.order}</span>
          <h1>{pattern.title}</h1>
          <p className="tagline">{pattern.tagline}</p>
          <p className="core-message">
            Step 0: confirm the pattern. Each decision step: when to proceed.
            Each leaf: one template, 1–2 line diffs.
          </p>
          <a
            className="github-ref"
            href={pattern.githubPath}
            target="_blank"
            rel="noreferrer"
          >
            Source taxonomy →
          </a>
        </div>
      </header>

      <CheatsheetBrowser
        root={pattern.root}
        patternId={pattern.id}
        patternTitle={pattern.title}
      />
    </article>
  )
}
