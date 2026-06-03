import type { MistakeAutopsy } from '../../types/leafEnhancement'
import './MistakeAutopsy.css'

export function MistakeAutopsyBlock({ autopsies }: { autopsies: MistakeAutopsy[] }) {
  if (autopsies.length === 0) return null

  return (
    <div className="mistake-autopsy">
      <span className="autopsy-label">⑤ Mistake autopsy</span>
      {autopsies.map((a, i) => (
        <div key={i} className="autopsy-card">
          <div className="autopsy-cause">Cause of death: {a.cause}</div>
          <div className="autopsy-grid">
            <div className="autopsy-col">
              <span className="autopsy-head">What you wrote</span>
              <pre>{a.wrong}</pre>
            </div>
            <div className="autopsy-col">
              <span className="autopsy-head">Killing test</span>
              <code>{a.testCase}</code>
            </div>
            <div className="autopsy-col fix">
              <span className="autopsy-head">One-line fix</span>
              <p>{a.fix}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
