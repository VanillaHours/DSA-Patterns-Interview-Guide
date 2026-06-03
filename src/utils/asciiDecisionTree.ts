import type { TaxonomyNode } from '../types'

function isDecision(node: TaxonomyNode): boolean {
  return Boolean(node.branches && node.branches.length > 0)
}

/** Compact ASCII decision tree for an internal node */
export function buildAsciiDecisionTree(node: TaxonomyNode): string {
  if (!isDecision(node)) {
    return `${node.title}\n    └── [leaf] ${node.problems?.map((p) => `LC ${p.id}`).join(', ') ?? ''}`
  }

  const lines: string[] = [
    `                    ${node.title}`,
    '                        |',
  ]

  const branches = node.branches!
  const n = branches.length

  branches.forEach((b, i) => {
    const isLast = i === n - 1
    const prefix = isLast ? '└── ' : '├── '
    const childLabel = b.label.replace(/^→\s*/, '')
    lines.push(`              ${prefix}${childLabel}`)
    if (b.lookFor[0]) {
      lines.push(`                  Signal: "${b.lookFor[0].slice(0, 40)}${b.lookFor[0].length > 40 ? '…' : ''}"`)
    }
    if (isDecision(b.child)) {
      lines.push(`                  → See: ${b.child.title}`)
    } else {
      const ids = b.child.problems?.map((p) => `LC ${p.id}`).join(', ') ?? b.child.title
      lines.push(`                  → ${ids}`)
    }
  })

  return lines.join('\n')
}
