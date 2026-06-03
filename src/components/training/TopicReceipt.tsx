import { useMemo, useState } from 'react'
import type { TaxonomyNode } from '../../types'
import type { LeafEnhancement } from '../../types/leafEnhancement'
import {
  buildSectionTree,
  collectAllLeaves,
  collectMustKnow,
  countProblems,
} from '../../utils/treeWalk'
import './TopicReceipt.css'

const STORAGE_KEY = 'dsa-topic-complete'

export function getTopicComplete(patternId: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    return JSON.parse(raw).includes(patternId)
  } catch {
    return false
  }
}

function setTopicComplete(patternId: string, done: boolean) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    const next = done
      ? [...new Set([...list, patternId])]
      : list.filter((id) => id !== patternId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function TopicReceipt({
  patternId,
  patternTitle,
  root,
  getLeafEnhancement,
}: {
  patternId: string
  patternTitle: string
  root: TaxonomyNode
  getLeafEnhancement: (id: string) => LeafEnhancement | undefined
}) {
  const [done, setDone] = useState(() => getTopicComplete(patternId))
  const [showReceipt, setShowReceipt] = useState(false)

  const stats = useMemo(() => {
    const tree = buildSectionTree(root)
    const leaves = collectAllLeaves(tree)
    const mustKnow = collectMustKnow(tree)
    const keywords = new Set<string>()
    const mistakes: string[] = []
    for (const l of leaves) {
      const enh = getLeafEnhancement(l.node.id)
      if (!enh) continue
      enh.budget.forEach((b) => keywords.add(b))
      enh.autopsies.slice(0, 1).forEach((a) => mistakes.push(a.cause))
    }
    return {
      families: root.branches?.length ?? 0,
      leaves: leaves.length,
      problems: countProblems(tree),
      mustKnow: mustKnow.length,
      keywords: [...keywords].slice(0, 8),
      mistakes: mistakes.slice(0, 5),
    }
  }, [root])

  const markDone = () => {
    setDone(true)
    setTopicComplete(patternId, true)
    setShowReceipt(true)
  }

  const exportSheet = () => {
    const lines = [
      `${patternTitle.toUpperCase()} — REVISION RECEIPT`,
      '─'.repeat(40),
      `${stats.families} families · ${stats.leaves} templates · ${stats.problems} problems`,
      `★ ${stats.mustKnow} must-know`,
      '─'.repeat(40),
      `KEYWORDS: ${stats.keywords.join(' | ')}`,
      `TOP MISTAKES: ${stats.mistakes.join(' | ')}`,
      '─'.repeat(40),
      'Generated from DSA Cheatsheet',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patternId}-receipt.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="topic-receipt-block">
      <div className="receipt-prompt">
        <h2>⑦ Topic receipt</h2>
        <p>Finished studying {patternTitle}? Mark complete and get your 1-page summary.</p>
        {!done ? (
          <button type="button" className="mark-done-btn" onClick={markDone}>
            Mark {patternTitle} complete
          </button>
        ) : (
          <span className="done-badge">Completed</span>
        )}
      </div>

      {(showReceipt || done) && (
        <div className="thermal-receipt">
          <div className="receipt-title">{patternTitle.toUpperCase()}</div>
          <div className="receipt-divider">────────────────────────</div>
          <div className="receipt-line">{stats.families} families learned</div>
          <div className="receipt-line">{stats.leaves} templates locked</div>
          <div className="receipt-line">{stats.problems} problems mapped</div>
          <div className="receipt-line highlight">★ {stats.mustKnow} must-know</div>
          <div className="receipt-divider">────────────────────────</div>
          <div className="receipt-section">TOP KEYWORDS</div>
          <div className="receipt-line small">{stats.keywords.join(' · ')}</div>
          <div className="receipt-section">TOP MISTAKES</div>
          {stats.mistakes.map((m) => (
            <div key={m} className="receipt-line small">× {m}</div>
          ))}
          <div className="receipt-divider">────────────────────────</div>
          <button type="button" className="export-btn" onClick={exportSheet}>
            Export 1-page sheet
          </button>
        </div>
      )}
    </section>
  )
}
