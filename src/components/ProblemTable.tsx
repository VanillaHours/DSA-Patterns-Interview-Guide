import type { ProblemVariation } from '../types'
import './ProblemTable.css'

const lcUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`

export function ProblemTable({
  problems,
  compact = false,
}: {
  problems: ProblemVariation[]
  compact?: boolean
}) {
  return (
    <div className={`problem-table-wrap ${compact ? 'compact' : ''}`}>
      <table className="problem-table">
        <thead>
          <tr>
            <th>LC</th>
            <th>Problem</th>
            <th>Companies</th>
            <th>What changes (1–2 lines)</th>
            {!compact && <th></th>}
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p.id} className={p.mustKnow ? 'must-know-row' : ''}>
              <td className="col-id">
                <a href={lcUrl(p.slug)} target="_blank" rel="noreferrer">
                  {p.id}
                </a>
                {p.mustKnow && <span className="mk">★</span>}
              </td>
              <td className="col-title">{p.title}</td>
              <td className="col-co">
                {p.companies.map((c) => (
                  <span key={c} className="co-tag">
                    {c}
                  </span>
                ))}
              </td>
              <td className="col-diff">{p.lineChanges}</td>
              {!compact && (
                <td className="col-var">
                  {p.variationCode ? (
                    <details>
                      <summary>snippet</summary>
                      <pre>{p.variationCode}</pre>
                    </details>
                  ) : (
                    '—'
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
