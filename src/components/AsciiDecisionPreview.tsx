import type { TaxonomyNode } from '../types'
import { buildAsciiDecisionTree } from '../utils/asciiDecisionTree'
import './AsciiDecisionPreview.css'

export function AsciiDecisionPreview({ node }: { node: TaxonomyNode }) {
  if (!node.branches?.length) return null
  const ascii = buildAsciiDecisionTree(node)

  return (
    <details className="ascii-decision">
      <summary>ASCII decision tree (this node only)</summary>
      <pre className="ascii-decision-pre">{ascii}</pre>
    </details>
  )
}
