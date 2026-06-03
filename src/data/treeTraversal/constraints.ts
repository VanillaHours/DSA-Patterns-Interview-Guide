import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'binaryTree', label: 'Binary tree data structure', group: 'input' },
  { id: 'naryTree', label: 'N-ary tree data structure', group: 'input' },
  { id: 'bst', label: 'Binary search tree', group: 'input' },
  { id: 'preorder', label: 'Preorder traversal (Root → Left → Right)', group: 'structure' },
  { id: 'inorder', label: 'Inorder traversal (Left → Root → Right)', group: 'structure' },
  { id: 'postorder', label: 'Postorder traversal (Left → Right → Root)', group: 'structure' },
  { id: 'pathSum', label: 'Path sum from root to leaf or any node', group: 'goal' },
  { id: 'lca', label: 'Lowest common ancestor of two nodes', group: 'goal' },
  { id: 'bstValidate', label: 'BST validation / property check', group: 'goal' },
  { id: 'kthBst', label: 'Kth smallest/largest in BST', group: 'goal' },
  { id: 'maxPathSum', label: 'Maximum path sum (any node to any node)', group: 'goal' },
  { id: 'levelOrder', label: 'Level-order traversal', group: 'structure' },
  { id: 'rightSide', label: 'Right/left side view of tree', group: 'goal' },
  { id: 'levelMax', label: 'Largest / average value per level', group: 'goal' },
  { id: 'nextRight', label: 'Populate next right pointers', group: 'goal' },
  { id: 'maxDepth', label: 'Maximum / minimum depth of tree', group: 'goal' },
  { id: 'maxWidth', label: 'Maximum width of binary tree', group: 'goal' },
  { id: 'zigzag', label: 'Zigzag / spiral level order', group: 'structure' },
  { id: 'vertical', label: 'Vertical order traversal by column', group: 'structure' },
  { id: 'boundary', label: 'Boundary traversal of tree', group: 'structure' },
  { id: 'sideView', label: 'Side view of tree (right / left)', group: 'goal' },
  { id: 'topView', label: 'Top / bottom view of tree', group: 'goal' },
  { id: 'multiSourceBfs', label: 'Multi-source BFS on tree', group: 'structure' },
  { id: 'bidirectionalBfs', label: 'Bidirectional BFS on tree', group: 'structure' },
  { id: 'constructTree', label: 'Build tree from traversal sequences', group: 'goal' },
  { id: 'serialize', label: 'Serialize / deserialize tree', group: 'goal' },
  { id: 'iterativeDfs', label: 'Iterative DFS with explicit stack', group: 'structure' },
  { id: 'stateTracking', label: 'State-tracking during traversal', group: 'structure' },
  { id: 'morris', label: 'Morris traversal (O(1) space, threaded tree)', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
