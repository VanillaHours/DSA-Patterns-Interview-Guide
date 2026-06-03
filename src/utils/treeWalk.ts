import type { TaxonomyNode } from '../types'

export interface LeafEntry {
  node: TaxonomyNode
  path: string[]
  parentTemplate?: string
}

export interface SectionEntry {
  id: string
  title: string
  depth: number
  node: TaxonomyNode
  children: SectionEntry[]
  leaves: LeafEntry[]
}

function isDecision(node: TaxonomyNode): boolean {
  return Boolean(node.branches && node.branches.length > 0)
}

function findTemplate(node: TaxonomyNode, ancestors: TaxonomyNode[]): string | undefined {
  if (node.template) return node.template
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].template) return ancestors[i].template
  }
  return undefined
}

/** Build a revision-friendly section tree from the decision taxonomy */
export function buildSectionTree(
  node: TaxonomyNode,
  ancestors: TaxonomyNode[] = [],
  pathTitles: string[] = []
): SectionEntry {
  const chain = [...ancestors, node]
  const titlePath = [...pathTitles, node.title]
  const leaves: LeafEntry[] = []
  const children: SectionEntry[] = []

  if (isDecision(node)) {
    for (const b of node.branches!) {
      const child = b.child
      if (isDecision(child)) {
        children.push(buildSectionTree(child, chain, titlePath))
      } else {
        leaves.push({
          node: child,
          path: [...titlePath, child.title],
          parentTemplate: findTemplate(child, chain),
        })
      }
    }
  }

  return { id: node.id, title: node.title, depth: pathTitles.length, node, children, leaves }
}

/** Flat list of all leaves for TOC / must-know aggregation */
export function collectAllLeaves(section: SectionEntry): LeafEntry[] {
  const out: LeafEntry[] = [...section.leaves]
  for (const c of section.children) out.push(...collectAllLeaves(c))
  return out
}

/** Top-level sections (skip root wrapper if step 1) */
export function getTopSections(root: TaxonomyNode): SectionEntry[] {
  const tree = buildSectionTree(root)
  if (tree.node.branches) {
    return tree.node.branches.map((b) =>
      isDecision(b.child)
        ? buildSectionTree(b.child, [root], [root.title, b.label])
        : {
            id: b.child.id,
            title: b.label,
            depth: 1,
            node: b.child,
            children: [],
            leaves: [{
              node: b.child,
              path: [root.title, b.label],
              parentTemplate: root.template,
            }],
          }
    )
  }
  return [tree]
}

export function countProblems(section: SectionEntry): number {
  let n = section.leaves.reduce((s, l) => s + (l.node.problems?.length ?? 0), 0)
  for (const c of section.children) n += countProblems(c)
  return n
}

export function countMustKnow(section: SectionEntry): number {
  let n = section.leaves.reduce(
    (s, l) => s + (l.node.problems?.filter((p) => p.mustKnow).length ?? 0),
    0
  )
  for (const c of section.children) n += countMustKnow(c)
  return n
}

export interface MustKnowRow {
  id: number
  title: string
  slug: string
  companies: string[]
  path: string
  lineChanges: string
}

export function collectMustKnow(section: SectionEntry): MustKnowRow[] {
  const seen = new Set<number>()
  const rows: MustKnowRow[] = []
  for (const leaf of collectAllLeaves(section)) {
    for (const p of leaf.node.problems ?? []) {
      if (p.mustKnow && !seen.has(p.id)) {
        seen.add(p.id)
        rows.push({
          id: p.id,
          title: p.title,
          slug: p.slug,
          companies: p.companies,
          path: leaf.path.join(' › '),
          lineChanges: p.lineChanges,
        })
      }
    }
  }
  return rows.sort((a, b) => a.id - b.id)
}
