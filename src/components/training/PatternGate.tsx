import type { ConstraintDef } from '../../types/constraint'
import type { PatternGateEnhancement } from '../../types/decisionEnhancement'
import type { TaxonomyNode } from '../../types'
import { DecisionGuide } from './DecisionGuide'
import './PatternGate.css'

export function PatternGate({ root, gate, constraintMap, patternTitle }: { root: TaxonomyNode; gate: PatternGateEnhancement; constraintMap: Record<string, ConstraintDef>; patternTitle: string }) {

  return (
    <section id="pattern-gate" className="pattern-gate">
      <header className="gate-head">
        <span className="gate-step">Step 0</span>
        <h2>Is this even {patternTitle}?</h2>
        <p className="gate-sub">
          Before any template — read the prompt once and decide if this pattern applies.
          If not, stop here.
        </p>
      </header>

      <div className="yes-signals">
        <span className="gate-label">Yes — likely {patternTitle.toLowerCase()} if</span>
        <ul>
          {gate.yesSignals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <DecisionGuide node={root} enhancement={gate} constraintMap={constraintMap} />

      {gate.notThisPattern && gate.notThisPattern.length > 0 && (
        <div className="not-pattern">
          <span className="gate-label warn">Not {patternTitle.toLowerCase()} — redirect</span>
          <table>
            <thead>
              <tr>
                <th>Prompt smell</th>
                <th>Actually use</th>
              </tr>
            </thead>
            <tbody>
              {gate.notThisPattern.map((row) => (
                <tr key={row.signal}>
                  <td>{row.signal}</td>
                  <td>{row.actually}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
