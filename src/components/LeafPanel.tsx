import type { TaxonomyNode } from '../types'
import { CodeBlock } from './CodeBlock'
import './LeafPanel.css'

const lcUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`

export function LeafPanel({
  node,
  parentTemplate,
}: {
  node: TaxonomyNode
  parentTemplate?: string
}) {
  const base = node.template ?? parentTemplate
  const hasProblems = node.problems && node.problems.length > 0

  if (!hasProblems && !node.template) return null

  return (
    <div className={`leaf-panel hue-${node.hue}`}>
      <div className="leaf-banner">
        <span className="leaf-icon">🍃</span>
        <strong>One template — change 1–2 lines</strong>
      </div>

      {base && (
        <CodeBlock code={base} caption={node.templateCaption ?? 'Base template'} />
      )}

      {node.problems?.map((p) => (
        <details key={p.id} className="problem-card">
          <summary>
            <span className="lc-id">LC {p.id}</span>
            <span className="lc-title">{p.title}</span>
            {p.mustKnow && <span className="badge must">MUST-KNOW</span>}
            <span className="companies">
              {p.companies.map((c) => (
                <span key={c} className="co">
                  {c}
                </span>
              ))}
            </span>
          </summary>
          <div className="problem-body">
            <p className="line-change">
              <span className="label">What changes (line #):</span> {p.lineChanges}
            </p>
            {p.variationCode && (
              <div className="variation-code">
                <span className="label">Variation code:</span>
                <pre>{p.variationCode}</pre>
              </div>
            )}
            <a
              href={lcUrl(p.slug)}
              target="_blank"
              rel="noreferrer"
              className="lc-link"
            >
              Open on LeetCode →
            </a>
          </div>
        </details>
      ))}

      {node.edgeCases && node.edgeCases.length > 0 && (
        <details className="meta-block">
          <summary>⚠️ Edge cases</summary>
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>What breaks</th>
              </tr>
            </thead>
            <tbody>
              {node.edgeCases.map((e) => (
                <tr key={e.input}>
                  <td>{e.input}</td>
                  <td>{e.breaks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}

      {node.pitfalls && node.pitfalls.length > 0 && (
        <details className="meta-block" open>
          <summary>Interview pitfalls</summary>
          <ul>
            {node.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </details>
      )}

      {node.interviewTip && (
        <p className="interview-tip">{node.interviewTip}</p>
      )}
    </div>
  )
}
