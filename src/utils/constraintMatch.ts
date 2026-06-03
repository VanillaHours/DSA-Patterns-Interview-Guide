import type { TaxonomyNode } from '../types'
import type { LeafEnhancement } from '../types/leafEnhancement'
import { collectAllLeaves, buildSectionTree } from './treeWalk'

export interface LeafMatch {
  leafId: string
  title: string
  path: string
  budget: string[]
}

type GetLeafEnhancement = (id: string) => LeafEnhancement | undefined

/** All leaves whose budget is subset of selected constraints (or overlap mode) */
export function matchLeavesByBudget(
  root: TaxonomyNode,
  selected: Set<string>,
  getLeafEnhancement: GetLeafEnhancement
): LeafMatch[] {
  if (selected.size === 0) return []
  const tree = buildSectionTree(root)
  const leaves = collectAllLeaves(tree)

  return leaves
    .map((l) => {
      const enh = getLeafEnhancement(l.node.id)
      if (!enh) return null
      const matches = enh.budget.every((b) => selected.has(b))
      if (!matches) return null
      return {
        leafId: l.node.id,
        title: l.node.title,
        path: l.path.join(' › '),
        budget: enh.budget,
      }
    })
    .filter(Boolean) as LeafMatch[]
}

/** Flat keyword → leaf id index */
export function buildKeywordIndex(root: TaxonomyNode, getLeafEnhancement: GetLeafEnhancement): { keyword: string; leafId: string; title: string }[] {
  const tree = buildSectionTree(root)
  const leaves = collectAllLeaves(tree)
  const index: { keyword: string; leafId: string; title: string }[] = []

  for (const l of leaves) {
    const enh = getLeafEnhancement(l.node.id)
    if (!enh) continue
    for (const frag of enh.xray) {
      const words = frag.text
        .replace(/\*\*/g, '')
        .split(/[\s,—]+/)
        .filter((w) => w.length > 4)
      for (const w of words.slice(0, 2)) {
        index.push({ keyword: w.toLowerCase(), leafId: l.node.id, title: l.node.title })
      }
    }
  }
  return index
}
