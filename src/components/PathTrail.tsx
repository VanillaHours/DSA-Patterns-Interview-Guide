import { usePath } from '../context/PathContext'
import './PathTrail.css'

export function PathTrail() {
  const { path } = usePath()
  if (path.length === 0) return null

  return (
    <nav className="path-trail" aria-label="Your path through the decision tree">
      <span className="path-label">Your path</span>
      <ol className="path-steps">
        {path.map((seg, i) => (
          <li key={seg.id} className="path-step">
            {i > 0 && <span className="path-chevron">›</span>}
            <span className="path-step-num">Step {seg.step ?? i + 1}</span>
            <span className="path-step-title">{seg.title}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
