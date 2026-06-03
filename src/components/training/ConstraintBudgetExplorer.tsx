import { useMemo, useState } from 'react'
import type { TaxonomyNode } from '../../types'
import type { ConstraintDef } from '../../types/constraint'
import type { LeafEnhancement } from '../../types/leafEnhancement'
import { matchLeavesByBudget } from '../../utils/constraintMatch'
import './ConstraintBudget.css'

export function ConstraintBudgetExplorer({
  root,
  constraints,
  getLeafEnhancement,
}: {
  root: TaxonomyNode
  constraints: ConstraintDef[]
  getLeafEnhancement: (id: string) => LeafEnhancement | undefined
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const matches = useMemo(
    () => matchLeavesByBudget(root, selected, getLeafEnhancement),
    [root, selected, getLeafEnhancement]
  )

  return (
    <section className="budget-explorer">
      <div className="budget-explorer-head">
        <h2>Constraint budget</h2>
        <p>
          Toggle what the prompt guarantees. Matching leaves narrow as you lock in
          constraints — like stat points picking your pattern class.
        </p>
      </div>
      <div className="budget-picker">
        {constraints.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`budget-pick group-${c.group} ${selected.has(c.id) ? 'on' : ''}`}
            onClick={() => toggle(c.id)}
          >
            {c.label}
          </button>
        ))}
        {selected.size > 0 && (
          <button type="button" className="budget-clear" onClick={() => setSelected(new Set())}>
            Clear
          </button>
        )}
      </div>
      {selected.size > 0 && (
        <div className="budget-matches">
          <span className="match-count">
            {matches.length} leaf{matches.length !== 1 ? 'ves' : ''} match
          </span>
          {matches.length === 0 ? (
            <p className="no-match">No exact match — relax a constraint or use Quick finder.</p>
          ) : (
            <ul>
              {matches.map((m) => (
                <li key={m.leafId}>
                  <a href={`#leaf-${m.leafId}`}>{m.title}</a>
                  <span className="match-path">{m.path}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
