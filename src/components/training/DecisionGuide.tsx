import type { TaxonomyNode } from '../../types'
import type { ConstraintDef } from '../../types/constraint'
import type { DecisionEnhancement } from '../../types/decisionEnhancement'
import { PromptXRay } from './PromptXRay'
import { LeafBudget } from './LeafBudget'
import { SayItAloud } from './SayItAloud'
import { MistakeAutopsyBlock } from './MistakeAutopsy'
import './DecisionGuide.css'

function childHref(child: TaxonomyNode): string {
  const isLeaf = !child.branches?.length
  return isLeaf ? `#leaf-${child.id}` : `#sec-${child.id}`
}

export function BranchDecisionCards({
  node,
  enhancement,
}: {
  node: TaxonomyNode
  enhancement: DecisionEnhancement
}) {
  if (!node.branches?.length) return null

  return (
    <div className="branch-decisions">
      <span className="decision-label">Next step — when to proceed</span>
      <p className="decision-when">{enhancement.whenAtThisStep}</p>
      <div className="branch-cards">
        {node.branches.map((b) => {
          const guide = enhancement.branchGuides[b.child.id]
          const when = [...b.lookFor, ...(guide?.whenExtra ?? [])]
          return (
            <a
              key={b.child.id}
              href={childHref(b.child)}
              className={`branch-card hue-${b.child.hue}`}
            >
              <div className="branch-card-head">
                <strong>{b.label}</strong>
                <span className="branch-go">↓</span>
              </div>
              {guide && (
                <p className="branch-proceed">{guide.proceed}</p>
              )}
              <div className="branch-when">
                <span className="mini-label">Look for</span>
                <ul>
                  {when.slice(0, 4).map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              {b.notWhen && b.notWhen.length > 0 && (
                <div className="branch-not">
                  <span className="mini-label skip">Skip if</span>
                  <ul>
                    {b.notWhen.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="branch-because">{b.because}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export function DecisionGuide({
  node,
  enhancement,
  constraintMap,
}: {
  node: TaxonomyNode
  enhancement: DecisionEnhancement
  constraintMap: Record<string, ConstraintDef>
}) {
  return (
    <div className={`decision-guide hue-${node.hue}`}>
      <div className="decision-guide-head">
        <span className="step-pill">Decision · Step {node.step ?? '?'}</span>
        <span className="decision-guide-title">{node.title}</span>
      </div>

      <div className="decision-training-stack">
        <PromptXRay fragments={enhancement.xray} />
        <LeafBudget budget={enhancement.budget} constraintMap={constraintMap} />
        <SayItAloud lines={enhancement.sayIt} />
      </div>

      {node.template && (
        <div className="decision-parent-template">
          <span className="decision-label">Skeleton if you reach code here</span>
          <pre className="decision-template-pre">{node.template}</pre>
          {node.templateCaption && (
            <p className="template-cap">{node.templateCaption}</p>
          )}
        </div>
      )}

      <BranchDecisionCards node={node} enhancement={enhancement} />

      {enhancement.misidentify && enhancement.misidentify.length > 0 && (
        <MistakeAutopsyBlock autopsies={enhancement.misidentify} />
      )}
    </div>
  )
}
