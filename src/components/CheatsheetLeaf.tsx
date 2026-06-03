import type { ConstraintDef } from '../types/constraint'
import type { LeafEnhancement } from '../types/leafEnhancement'
import type { LeafEntry } from '../utils/treeWalk'
import { PromptXRay } from './training/PromptXRay'
import { LeafBudget } from './training/LeafBudget'
import { SayItAloud } from './training/SayItAloud'
import { TemplateSlots } from './training/TemplateSlots'
import { VariationHelix } from './training/VariationHelix'
import { MistakeAutopsyBlock } from './training/MistakeAutopsy'
import { CodeBlock } from './CodeBlock'
import './CheatsheetLeaf.css'

export function CheatsheetLeaf({ leaf, getLeafEnhancement, constraintMap }: { leaf: LeafEntry; getLeafEnhancement: (id: string) => LeafEnhancement | undefined; constraintMap: Record<string, ConstraintDef> }) {
  const { node, parentTemplate } = leaf
  const code = node.template ?? parentTemplate
  const problems = node.problems ?? []
  const enh = getLeafEnhancement(node.id)

  if (!code && problems.length === 0 && !enh) return null

  const useSlotted = enh && enh.slots.length > 0

  return (
    <article
      id={`leaf-${node.id}`}
      className={`cheatsheet-leaf hue-${node.hue}`}
    >
      <header className="leaf-head">
        <h4 className="leaf-title">{node.title}</h4>
        <span className="leaf-count">{problems.length} LC</span>
      </header>

      {enh && (
        <div className="leaf-training-stack">
          <PromptXRay fragments={enh.xray} />
          <LeafBudget budget={enh.budget} constraintMap={constraintMap} />
          <SayItAloud lines={enh.sayIt} />
        </div>
      )}

      {useSlotted && enh ? (
        <TemplateSlots
          slottedTemplate={enh.slottedTemplate}
          slots={enh.slots}
          problems={problems}
          slotFills={enh.slotFills}
        />
      ) : (
        code && (
          <div className="leaf-code-block">
            <span className="slots-label">③ Base template</span>
            <CodeBlock
              code={code}
              caption={node.templateCaption ?? 'Copy this — change 1–2 lines per problem'}
            />
          </div>
        )
      )}

      {enh && problems.length > 0 && (
        <VariationHelix
          problems={problems}
          helixOrder={enh.helixOrder}
          helixDelta={enh.helixDelta}
        />
      )}

      {enh && <MistakeAutopsyBlock autopsies={enh.autopsies} />}

      {!enh && node.interviewTip && (
        <p className="leaf-tip">{node.interviewTip}</p>
      )}
    </article>
  )
}
