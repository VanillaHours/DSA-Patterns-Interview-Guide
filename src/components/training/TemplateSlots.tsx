import type { TemplateSlotDef } from '../../types/leafEnhancement'
import type { ProblemVariation } from '../../types'
import './TemplateSlots.css'

function renderSlotted(template: string, slots: TemplateSlotDef[]) {
  const slotMap = Object.fromEntries(slots.map((s) => [s.id, s]))
  const parts = template.split(/\{\{(\w+)\}\}/g)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const slot = slotMap[part]
      return (
        <span key={i} className="slot-hole" title={slot?.hint}>
          {slot?.label ?? part}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function TemplateSlots({
  slottedTemplate,
  slots,
  problems,
  slotFills,
}: {
  slottedTemplate: string
  slots: TemplateSlotDef[]
  problems: ProblemVariation[]
  slotFills: Record<number, Record<string, string>>
}) {
  if (slots.length === 0) return null

  return (
    <div className="template-slots">
      <span className="slots-label">③ Template slots</span>
      <pre className="slotted-code">{renderSlotted(slottedTemplate, slots)}</pre>
      {slots.length > 0 && (
        <table className="slot-table">
          <thead>
            <tr>
              <th>LC</th>
              {slots.map((s) => (
                <th key={s.id}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id}>
                <td className="slot-lc">{p.id}</td>
                {slots.map((s) => (
                  <td key={s.id} className="slot-fill">
                    {slotFills[p.id]?.[s.id] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
