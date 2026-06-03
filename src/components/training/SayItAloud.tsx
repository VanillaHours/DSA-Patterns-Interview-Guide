import { useState } from 'react'
import './SayItAloud.css'

export function SayItAloud({ lines }: { lines: string[] }) {
  const [practice, setPractice] = useState(false)
  const [revealed, setRevealed] = useState(0)

  const revealNext = () => setRevealed((r) => Math.min(r + 1, lines.length))
  const reset = () => {
    setRevealed(0)
    setPractice(false)
  }

  return (
    <div className="say-it-aloud">
      <div className="say-head">
        <span className="say-label">⑥ Say it out loud</span>
        {!practice ? (
          <button type="button" className="say-practice-btn" onClick={() => { setPractice(true); setRevealed(0) }}>
            Practice (15s)
          </button>
        ) : (
          <div className="say-controls">
            <button type="button" onClick={revealNext}>Reveal line</button>
            <button type="button" onClick={reset}>Done</button>
          </div>
        )}
      </div>
      <ol className="say-lines">
        {lines.map((line, i) => (
          <li key={i} className={practice && i >= revealed ? 'hidden-line' : ''}>
            {line}
          </li>
        ))}
      </ol>
    </div>
  )
}
