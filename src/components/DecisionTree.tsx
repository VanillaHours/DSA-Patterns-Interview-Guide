import { useEffect, useState } from 'react'
import type { DecisionBranch, TaxonomyNode } from '../types'
import { usePath } from '../context/PathContext'
import { CodeBlock } from './CodeBlock'
import { LeafPanel } from './LeafPanel'
import { AsciiDecisionPreview } from './AsciiDecisionPreview'
import './DecisionTree.css'

function isDecision(node: TaxonomyNode): boolean {
  return Boolean(node.branches && node.branches.length > 0)
}

function findTemplate(
  node: TaxonomyNode,
  ancestors: TaxonomyNode[]
): string | undefined {
  if (node.template) return node.template
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].template) return ancestors[i].template
  }
  return undefined
}

function BranchCard({
  branch: b,
  step,
  ancestors,
  parentId,
  siblingKey,
  isOpen,
  onToggle,
}: {
  branch: DecisionBranch
  step: number
  ancestors: TaxonomyNode[]
  parentId: string
  siblingKey: string
  isOpen: boolean
  onToggle: (key: string) => void
}) {
  const { setSegment } = usePath()
  const childIsDecision = isDecision(b.child)
  const segmentId = `${parentId}:${b.child.id}`

  useEffect(() => {
    if (isOpen) {
      setSegment(segmentId, {
        id: segmentId,
        title: b.child.title,
        step: step + 1,
      })
    } else {
      setSegment(segmentId, null)
    }
    return () => setSegment(segmentId, null)
  }, [isOpen, segmentId, b.child.title, step, setSegment])

  return (
    <div className={`branch-card hue-${b.child.hue} ${isOpen ? 'open' : ''}`}>
      <div className="branch-signals">
        <div className="signal-block look">
          <span className="signal-label">In the problem, look for</span>
          <ul>
            {b.lookFor.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {b.notWhen && b.notWhen.length > 0 && (
          <div className="signal-block skip">
            <span className="signal-label">Skip this branch if you see</span>
            <ul>
              {b.notWhen.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="branch-footer">
        <div className="branch-outcome">
          <span className="arrow">↓</span>
          <div>
            <strong>{b.label}</strong>
            <p className="because">{b.because}</p>
          </div>
        </div>
        <button
          type="button"
          className={`match-btn ${isOpen ? 'active' : ''}`}
          onClick={() => onToggle(siblingKey)}
        >
          {isOpen ? '✓ Matches — hide' : 'This matches my problem →'}
        </button>
      </div>

      {isOpen && (
        <div className="branch-child">
          {childIsDecision ? (
            <DecisionTree node={b.child} ancestors={ancestors} />
          ) : (
            <div className="leaf-zone">
              <p className="leaf-reached">
                Step {step + 1}: You reached the template. Code below — change 1–2
                lines per LC card.
              </p>
              <LeafPanel
                node={b.child}
                parentTemplate={findTemplate(b.child, ancestors)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function DecisionTree({
  node,
  ancestors = [],
}: {
  node: TaxonomyNode
  ancestors?: TaxonomyNode[]
}) {
  const step = node.step ?? 1
  const chain = [...ancestors, node]
  const [openKey, setOpenKey] = useState<string | null>(null)

  const handleToggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key))
  }

  if (!isDecision(node)) {
    return (
      <LeafPanel node={node} parentTemplate={findTemplate(node, ancestors)} />
    )
  }

  return (
    <div
      className={`decision-node hue-${node.hue}`}
      style={{ '--node-accent': `var(--hue-${node.hue})` } as React.CSSProperties}
    >
      <div className="decision-header">
        <span className="step-badge">Step {step}</span>
        <h3 className="decision-title">{node.title}</h3>
        {node.readProblem && (
          <p className="read-problem">
            <span className="read-icon">👀</span>
            {node.readProblem}
          </p>
        )}
      </div>

      {node.template && (
        <div className="decision-template">
          <p className="template-hint">
            If you reach this node, your code skeleton starts here (children only
            change 1–2 lines):
          </p>
          <CodeBlock code={node.template} caption={node.templateCaption} />
        </div>
      )}

      <AsciiDecisionPreview node={node} />

      <p className="branch-instruction">
        Read each branch’s <strong>look for</strong> list against your problem.
        Expand only the one that matches.
      </p>

      <div className="branches">
        {node.branches!.map((b) => {
          const key = b.child.id
          return (
            <BranchCard
              key={key + b.label}
              branch={b}
              step={step}
              ancestors={chain}
              parentId={node.id}
              siblingKey={key}
              isOpen={openKey === key}
              onToggle={handleToggle}
            />
          )
        })}
      </div>
    </div>
  )
}
