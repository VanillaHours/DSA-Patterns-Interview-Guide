import { TWO_POINTERS_ASCII } from '../data/twoPointers/asciiTree'
import './TaxonomyAsciiTree.css'

export function TaxonomyAsciiTree() {
  return (
    <details className="ascii-tree-block">
      <summary>
        <span className="tree-icon">🌳</span>
        Full taxonomy map (from GitHub — every path)
      </summary>
      <p className="ascii-note">
        This mirrors{' '}
        <a
          href="https://github.com/Yassir-aykhlf/DSA-Taxonomies/blob/main/Taxonomies/1.%20Two%20Pointers.md"
          target="_blank"
          rel="noreferrer"
        >
          the official Two Pointers taxonomy
        </a>
        . Use the interactive tree below to drill into any leaf.
      </p>
      <pre className="ascii-tree">{TWO_POINTERS_ASCII}</pre>
    </details>
  )
}
