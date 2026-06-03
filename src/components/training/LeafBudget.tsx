import type { ConstraintDef } from '../../types/constraint'
import './ConstraintBudget.css'

export function LeafBudget({ budget, constraintMap: map }: { budget: string[]; constraintMap: Record<string, ConstraintDef> }) {
  return (
    <div className="leaf-budget">
      <span className="budget-mini-label">② Constraints</span>
      <div className="budget-chips">
        {budget.map((id) => {
          const c = map[id]
          return (
            <span key={id} className={`budget-chip group-${c?.group ?? 'input'}`}>
              {c?.label ?? id}
            </span>
          )
        })}
      </div>
    </div>
  )
}
