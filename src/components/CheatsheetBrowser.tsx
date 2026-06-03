import { useMemo, useState } from 'react'
import type { TaxonomyNode } from '../types'
import type { ConstraintDef } from '../types/constraint'
import type { DecisionEnhancement } from '../types/decisionEnhancement'
import type { LeafEnhancement } from '../types/leafEnhancement'
import type { SectionEntry } from '../utils/treeWalk'
import {
  buildSectionTree,
  collectMustKnow,
  countMustKnow,
  countProblems,
  getTopSections,
} from '../utils/treeWalk'
import { getPatternData } from '../data/patternData'
import { CheatsheetLeaf } from './CheatsheetLeaf'
import { ProblemTable } from './ProblemTable'
import { FamilyCardGrid } from './training/FamilyCardGrid'
import { ConstraintBudgetExplorer } from './training/ConstraintBudgetExplorer'
import { TopicReceipt } from './training/TopicReceipt'
import { PatternGate } from './training/PatternGate'
import { DecisionGuide } from './training/DecisionGuide'
import './CheatsheetBrowser.css'

function SectionBlock({
  section,
  defaultOpen,
  filterMustKnow,
  getDecisionEnhancement,
  getLeafEnhancement,
  constraintMap,
}: {
  section: SectionEntry
  defaultOpen: boolean
  filterMustKnow: boolean
  getDecisionEnhancement: (id: string) => DecisionEnhancement | undefined
  getLeafEnhancement: (id: string) => LeafEnhancement | undefined
  constraintMap: Record<string, ConstraintDef>
}) {
  const { node, children, leaves } = section
  const decisionEnh = getDecisionEnhancement(node.id)
  const isDecision = Boolean(node.branches?.length)

  const visibleLeaves = filterMustKnow
    ? leaves
        .map((l) => ({
          ...l,
          node: {
            ...l.node,
            problems: l.node.problems?.filter((p) => p.mustKnow),
          },
        }))
        .filter((l) => (l.node.problems?.length ?? 0) > 0)
    : leaves

  if (
    filterMustKnow &&
    visibleLeaves.length === 0 &&
    children.every((c) => countMustKnow(c) === 0) &&
    !decisionEnh
  ) {
    return null
  }

  return (
    <section
      id={`sec-${section.id}`}
      className={`cheat-section depth-${section.depth}`}
    >
      <details className="section-details" open={defaultOpen}>
        <summary className="section-summary">
          <span className="section-title">{section.title}</span>
          {isDecision && node.step != null && (
            <span className="section-step">Step {node.step}</span>
          )}
        </summary>

        <div className="section-body">
          {isDecision && decisionEnh ? (
            <DecisionGuide node={node} enhancement={decisionEnh} constraintMap={constraintMap} />
          ) : (
            node.readProblem && (
              <p className="section-hint">{node.readProblem}</p>
            )
          )}

          {children.map((child) => (
            <SectionBlock
              key={child.id}
              section={child}
              defaultOpen={section.depth < 2}
              filterMustKnow={filterMustKnow}
              getDecisionEnhancement={getDecisionEnhancement}
              getLeafEnhancement={getLeafEnhancement}
              constraintMap={constraintMap}
            />
          ))}

          {visibleLeaves.map((leaf) => (
            <CheatsheetLeaf key={leaf.node.id} leaf={leaf} getLeafEnhancement={getLeafEnhancement} constraintMap={constraintMap} />
          ))}
        </div>
      </details>
    </section>
  )
}

export function CheatsheetBrowser({
  root,
  patternId,
  patternTitle,
}: {
  root: TaxonomyNode
  patternId: string
  patternTitle: string
}) {
  const [filterMustKnow, setFilterMustKnow] = useState(false)
  const [expandAll, setExpandAll] = useState(true)

  const tree = useMemo(() => buildSectionTree(root), [root])
  const topSections = useMemo(() => getTopSections(root), [root])
  const mustKnow = useMemo(() => collectMustKnow(tree), [tree])
  const totalProblems = useMemo(() => countProblems(tree), [tree])
  const totalMustKnow = mustKnow.length
  const leafCount = useMemo(
    () => topSections.reduce((n, s) => n + countLeavesInSection(s), 0),
    [topSections]
  )

  const patternData = getPatternData(patternId)!

  const jumpToFamily = (id: string) => {
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="cheatsheet-browser">
      <div className="cheat-toolbar">
        <div className="cheat-stats">
          <span className="stat">
            <strong>{topSections.length}</strong> families
          </span>
          <span className="stat">
            <strong>{leafCount}</strong> templates
          </span>
          <span className="stat">
            <strong>{totalProblems}</strong> problems
          </span>
          <span className="stat highlight">
            <strong>{totalMustKnow}</strong> must-know
          </span>
        </div>
        <div className="cheat-filters">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filterMustKnow}
              onChange={(e) => setFilterMustKnow(e.target.checked)}
            />
            Must-know only
          </label>
          <button
            type="button"
            className="expand-btn"
            onClick={() => setExpandAll((v) => !v)}
          >
            {expandAll ? 'Collapse' : 'Expand all'}
          </button>
        </div>
      </div>

      <PatternGate root={root} gate={patternData.getPatternGate()} constraintMap={patternData.constraintMap} patternTitle={patternTitle} />

      <FamilyCardGrid sections={topSections} onJump={jumpToFamily} familyMeta={patternData.familyMeta} />

      <ConstraintBudgetExplorer root={root} constraints={patternData.constraints} getLeafEnhancement={patternData.getLeafEnhancement} />

      <section id="must-know" className="must-know-block">
        <h2>Must-know checklist</h2>
        <p className="must-know-sub">
          Scan before any interview — path, template family, and 1–2 line tweak.
        </p>
        <ProblemTable
          problems={mustKnow.map((m) => ({
            id: m.id,
            title: m.title,
            slug: m.slug,
            companies: m.companies,
            mustKnow: true,
            lineChanges: `${m.path} — ${m.lineChanges}`,
          }))}
          compact
        />
      </section>

      <section className="templates-block">
        <h2>Decision steps & training sheets</h2>
        <p className="templates-sub">
          Decision nodes: <strong>X-Ray → Constraints → Say it → When to proceed</strong>.
          Leaves unchanged: slots, helix, autopsy.
        </p>

        {topSections.map((sec) => (
          <SectionBlock
            key={`${sec.id}-${expandAll}`}
            section={sec}
            defaultOpen={expandAll}
            filterMustKnow={filterMustKnow}
            getDecisionEnhancement={patternData.getDecisionEnhancement}
            getLeafEnhancement={patternData.getLeafEnhancement}
            constraintMap={patternData.constraintMap}
          />
        ))}
      </section>

      <TopicReceipt
        patternId={patternId}
        patternTitle={patternTitle}
        root={root}
        getLeafEnhancement={patternData.getLeafEnhancement}
      />
    </div>
  )
}

function countLeavesInSection(s: SectionEntry): number {
  let n = s.leaves.length
  for (const c of s.children) n += countLeavesInSection(c)
  return n
}
