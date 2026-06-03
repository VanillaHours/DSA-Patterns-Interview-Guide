import { useState } from 'react'
import type { ProblemVariation } from '../../types'
import './VariationHelix.css'

const lcUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`

export function VariationHelix({
  problems,
  helixOrder,
  helixDelta,
}: {
  problems: ProblemVariation[]
  helixOrder?: number[]
  helixDelta: Record<number, string>
}) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const order = helixOrder ?? problems.map((p) => p.id)
  const byId = Object.fromEntries(problems.map((p) => [p.id, p]))
  const ordered = order.map((id) => byId[id]).filter(Boolean) as ProblemVariation[]

  if (ordered.length === 0) return null

  return (
    <div className="variation-helix">
      <span className="helix-label">④ Variation helix</span>
      <p className="helix-sub">Each node = one commit on the same branch. Only the delta changes.</p>
      <ol className="helix-chain">
        {ordered.map((p, i) => (
          <li
            key={p.id}
            className={`helix-node ${activeId === p.id ? 'active' : ''} ${p.mustKnow ? 'must' : ''}`}
          >
            <button
              type="button"
              className="helix-btn"
              onClick={() => setActiveId(activeId === p.id ? null : p.id)}
            >
              <span className="helix-num">{i + 1}</span>
              <span className="helix-prob">
                <a href={lcUrl(p.slug)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                  LC {p.id}
                </a>
                {' '}{p.title}
                {p.mustKnow && <span className="helix-star">★</span>}
              </span>
              <span className="helix-delta">{helixDelta[p.id] ?? p.lineChanges}</span>
            </button>
            {activeId === p.id && (
              <div className="helix-detail">
                <p>{p.lineChanges}</p>
                {p.variationCode && <pre>{p.variationCode}</pre>}
                <div className="helix-co">
                  {p.companies.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
