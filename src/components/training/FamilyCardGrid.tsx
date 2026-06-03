import type { FamilyMeta } from '../../types/leafEnhancement'
import type { SectionEntry } from '../../utils/treeWalk'
import { countMustKnow, countProblems } from '../../utils/treeWalk'
import './FamilyCardGrid.css'

export function FamilyCardGrid({
  sections,
  onJump,
  familyMeta,
}: {
  sections: SectionEntry[]
  onJump: (id: string) => void
  familyMeta: Record<string, FamilyMeta>
}) {
  return (
    <div className="family-grid">
      {sections.map((sec) => {
        const meta = familyMeta[sec.id]
        const probCount = countProblems(sec)
        const mkCount = countMustKnow(sec)
        return (
          <button
            key={sec.id}
            type="button"
            className={`family-card hue-${sec.node.hue}`}
            onClick={() => onJump(sec.id)}
          >
            <h3>{sec.title.replace(/^→\s*/, '')}</h3>
            <p className="family-tagline">{meta?.tagline ?? sec.node.readProblem}</p>
            <div className="family-kws">
              {(meta?.keywords ?? []).slice(0, 4).map((k) => (
                <span key={k} className="kw-chip">
                  {k}
                </span>
              ))}
            </div>
            <div className="family-stats">
              <span>{probCount} LC</span>
              <span>★ {mkCount}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
