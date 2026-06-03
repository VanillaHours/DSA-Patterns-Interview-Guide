import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'dfs-variants': {
    tagline: 'Depth-First Search (DFS) — explore deep paths before backtracking',
    keywords: ['dfs', 'preorder', 'inorder', 'postorder', 'recursive', 'iterative stack', 'morris', 'path sum', 'lca', 'univalue'],
    budget: ['preorder', 'inorder', 'postorder', 'pathSum', 'lca', 'bstValidate', 'kthBst', 'maxPathSum', 'iterativeDfs', 'stateTracking', 'morris'],
  },
  'bfs-variants': {
    tagline: 'Breadth-First Search (BFS) — level by level using a queue',
    keywords: ['bfs', 'level order', 'queue', 'right side view', 'multi-source', 'bidirectional', 'depth', 'width'],
    budget: ['levelOrder', 'rightSide', 'levelMax', 'nextRight', 'maxDepth', 'maxWidth', 'multiSourceBfs', 'bidirectionalBfs'],
  },
  'specialized': {
    tagline: 'Specialized Tree Traversals — boundary, vertical, zigzag, and view-based',
    keywords: ['boundary', 'vertical order', 'zigzag', 'spiral', 'tree view', 'side view', 'top view'],
    budget: ['boundary', 'vertical', 'zigzag', 'sideView', 'topView'],
  },
  'construction': {
    tagline: 'Tree Construction via Traversals — build from sequences and serialize/deserialize',
    keywords: ['construct tree', 'preorder inorder', 'postorder inorder', 'serialize', 'deserialize'],
    budget: ['constructTree', 'serialize'],
  },
}
