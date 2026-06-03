import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Binary tree, N-ary tree, or BST data structure',
    'Need to visit nodes in a specific order (pre/in/post)',
    'Level-by-level processing or depth-based analysis',
    'Path finding from root-to-leaf or between nodes',
    'Tree construction from traversal arrays',
    'Serialize/deserialize a tree to/from a string',
  ],
  whenAtThisStep:
    'Does the problem work with a tree structure and require visiting nodes? Pick the family: DFS, BFS, specialized, or construction.',
  xray: [
    { text: 'Traverse a **binary tree** in **preorder/inorder/postorder**', kind: 'goal' },
    { text: 'Return the **level-order** traversal of a binary tree', kind: 'goal' },
    { text: 'Find the **maximum depth** of a binary tree', kind: 'goal' },
    { text: 'Find the **lowest common ancestor** of two nodes', kind: 'goal' },
    { text: '**Construct** a binary tree from traversal arrays', kind: 'goal' },
    { text: '**Serialize / deserialize** a binary tree', kind: 'goal' },
    { text: '**Boundary / vertical / zigzag** traversal', kind: 'goal' },
  ],
  budget: ['binaryTree', 'preorder', 'inorder', 'postorder', 'levelOrder', 'boundary', 'vertical', 'zigzag', 'constructTree', 'serialize'],
  sayIt: [
    'Tree problem? Pick: DFS (recursive, iterative, morris), BFS (level, multi-source, bidirectional), specialized, or construction.',
  ],
  branchGuides: {
    'dfs-variants': { proceed: 'WHEN: DFS — preorder, inorder, postorder, path, or Morris', whenExtra: ['preorder traversal', 'inorder', 'postorder', 'path sum', 'lca', 'morris'] },
    'bfs-variants': { proceed: 'WHEN: BFS — level order, multi-source, or bidirectional', whenExtra: ['level order', 'right side view', 'max depth', 'distance K'] },
    'specialized': { proceed: 'WHEN: boundary, vertical, zigzag, or view-based', whenExtra: ['boundary of tree', 'vertical order', 'zigzag', 'side view'] },
    'construction': { proceed: 'WHEN: build from traversal sequences or serialize', whenExtra: ['construct from preorder+inorder', 'serialize binary tree'] },
  },
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'tree-root': PATTERN_GATE,

  'dfs-variants': d({
    whenAtThisStep: 'Explore deep paths — recursive, iterative stack, or Morris O(1) space?',
    xray: [
      { text: 'Return **preorder / inorder / postorder** traversal', kind: 'goal' },
      { text: '**Path sum** from root to leaf or any node', kind: 'goal' },
      { text: '**Lowest common ancestor** of two nodes', kind: 'goal' },
      { text: 'Iterative **stack-based** traversal (no recursion)', kind: 'goal' },
      { text: '**O(1) space** Morris traversal via threaded tree', kind: 'goal' },
    ],
    budget: ['preorder', 'inorder', 'postorder', 'pathSum', 'lca', 'iterativeDfs', 'stateTracking', 'morris'],
    sayIt: [
      'DFS: recursive (pre/in/post/path), iterative stack, or Morris O(1) threaded.',
    ],
    branchGuides: {
      'recursive-dfs': { proceed: 'WHEN: recursive — preorder, inorder, postorder, or path-based DFS' },
      'iterative-dfs': { proceed: 'WHEN: explicit stack — in/pre/post, or state-tracking for construction' },
      'morris': { proceed: 'WHEN: O(1) space threaded tree — inorder or preorder' },
    },
  }),

  'bfs-variants': d({
    whenAtThisStep: 'Level by level — standard level order, multi-source, or bidirectional?',
    xray: [
      { text: 'Return **level-order** traversal (top to bottom)', kind: 'goal' },
      { text: 'Return **right side view** of binary tree', kind: 'goal' },
      { text: '**Maximum depth / width** of binary tree', kind: 'goal' },
      { text: '**Maximum level sum** or **deepest leaves sum**', kind: 'goal' },
      { text: 'Nodes at **distance K** from target node', kind: 'goal' },
    ],
    budget: ['levelOrder', 'rightSide', 'levelMax', 'nextRight', 'maxDepth', 'maxWidth', 'multiSourceBfs', 'bidirectionalBfs'],
    sayIt: ['Level-order: queue + per-level loop. Multi-source: per-level aggregate. Bidirectional: parent map + BFS.'],
    branchGuides: {
      'level-order-traversals': { proceed: 'WHEN: standard level order, level-wise, or depth/width analysis' },
      'multi-source-bfs': { proceed: 'WHEN: per-level aggregates (max level sum, deepest leaves sum)' },
      'bidirectional-bfs': { proceed: 'WHEN: nodes distance K from target — parent map + BFS from target' },
    },
  }),

  'specialized': d({
    whenAtThisStep: 'Boundary, vertical, spiral/zigzag, or view-based traversal?',
    xray: [
      { text: 'Return **boundary** of binary tree', kind: 'goal' },
      { text: 'Return **vertical order** traversal by column', kind: 'goal' },
      { text: 'Return **zigzag** level order (alternating direction)', kind: 'goal' },
      { text: 'Return **side view** or **top/bottom view**', kind: 'goal' },
    ],
    budget: ['boundary', 'vertical', 'zigzag', 'sideView', 'topView'],
    sayIt: ['Boundary = 3 phases. Vertical = DFS with col/row. Zigzag = toggle fill. View = BFS per-level.'],
    branchGuides: {
      boundary: { proceed: 'WHEN: boundary of binary tree (left edge + leaves + right edge)' },
      vertical: { proceed: 'WHEN: vertical order by column (DFS with col, row)' },
      zigzag: { proceed: 'WHEN: alternating left-to-right and right-to-left per level' },
      'view-based': { proceed: 'WHEN: side views or top/bottom views via BFS' },
    },
  }),

  'construction': d({
    whenAtThisStep: 'Build tree from traversal sequences or serialize/deserialize.',
    xray: [
      { text: '**Construct** binary tree from preorder+inorder', kind: 'goal' },
      { text: '**Construct** from inorder+postorder', kind: 'goal' },
      { text: '**Serialize** a binary tree to string', kind: 'goal' },
      { text: '**Deserialize** string back to tree', kind: 'goal' },
    ],
    budget: ['constructTree', 'serialize'],
    sayIt: ['Build: preorder gives root, inorder splits. Serialize: preorder with null markers.'],
    branchGuides: {
      'construct-tree': { proceed: 'WHEN: build from traversal sequences (pre+in or in+post)' },
      'serialize': { proceed: 'WHEN: convert tree to/from string' },
    },
  }),

  'recursive-dfs': d({
    whenAtThisStep: 'Recursive DFS — preorder, inorder, postorder, or path-based?',
    xray: [
      { text: 'Return **preorder** (root→left→right) traversal', kind: 'goal' },
      { text: 'Return **inorder** (left→root→right) traversal', kind: 'goal' },
      { text: 'Return **postorder** (left→right→root) traversal', kind: 'goal' },
      { text: '**Path sum** / **LCA** / **univalue path**', kind: 'goal' },
    ],
    budget: ['preorder', 'inorder', 'postorder', 'pathSum', 'lca'],
    sayIt: ['Preorder = root first. Inorder = BST sorted. Postorder = children first (tree DP). Path = sums + LCA.'],
    branchGuides: {
      preorder: { proceed: 'WHEN: root before children — clone, paths, prefix expression' },
      inorder: { proceed: 'WHEN: left, root, right — BST sorted order, validate, kth' },
      postorder: { proceed: 'WHEN: children before root — tree DP, max path sum' },
      'path-based-dfs': { proceed: 'WHEN: path sum variants, LCA, univalue path' },
    },
  }),

  'iterative-dfs': d({
    whenAtThisStep: 'Explicit stack — standard traversals or state-tracking?',
    xray: [
      { text: 'Iterative **inorder / preorder / postorder** via stack', kind: 'goal' },
      { text: '**Verify preorder serialization** via slot counting', kind: 'goal' },
      { text: '**Construct BST** from preorder traversal', kind: 'goal' },
    ],
    budget: ['iterativeDfs', 'stateTracking'],
    sayIt: ['Explicit stack: inorder = push-all-left. Preorder = push R→L. Postorder = two-stack. State: slot counting.'],
    branchGuides: {
      'explicit-stack': { proceed: 'WHEN: iterative in/pre/post order with explicit stack' },
      'state-tracking': { proceed: 'WHEN: slot counting or BST construction from preorder' },
    },
  }),

  'morris': d({
    whenAtThisStep: 'Morris O(1) space — inorder or preorder?',
    xray: [
      { text: '**Inorder** using **O(1) space** threaded tree', kind: 'goal' },
      { text: '**Preorder** using O(1) space', kind: 'goal' },
      { text: '**Recover BST** — find swapped nodes', kind: 'goal' },
    ],
    budget: ['morris'],
    sayIt: ['Morris: threaded tree — create/remove predecessor threads. Inorder first, preorder second.'],
    branchGuides: {
      'morris-inorder': { proceed: 'WHEN: inorder (or recover BST) with O(1) space' },
      'morris-preorder': { proceed: 'WHEN: preorder with O(1) space' },
    },
  }),

  'path-based-dfs': d({
    whenAtThisStep: 'Path-based — root-to-leaf, any path (node-to-node), or ancestor relationships?',
    xray: [
      { text: '**Root-to-leaf** path sum check or collect', kind: 'goal' },
      { text: '**Any path** starting anywhere, summing to target', kind: 'goal' },
      { text: '**Longest univalue path** (edges with same value)', kind: 'goal' },
      { text: '**Lowest common ancestor** of two nodes', kind: 'goal' },
    ],
    budget: ['pathSum', 'lca'],
    sayIt: ['Root-to-leaf: subtract on entry. Any path: prefix sum map. LCA: postorder. Univalue: postorder + match.'],
    branchGuides: {
      'path-root-to-leaf': { proceed: 'WHEN: path from root to leaf (sum check or collect)' },
      'path-any-node': { proceed: 'WHEN: path can start anywhere (prefix sum or univalue)' },
      'path-ancestor': { proceed: 'WHEN: LCA of two nodes (with optional existence check)' },
    },
  }),

  'level-order-traversals': d({
    whenAtThisStep: 'Standard level order, level-wise processing, or depth/width analysis?',
    xray: [
      { text: 'Return **level-order** traversal (top to bottom)', kind: 'goal' },
      { text: 'Return **right side view** of binary tree', kind: 'goal' },
      { text: '**Maximum depth / width** of binary tree', kind: 'goal' },
    ],
    budget: ['levelOrder', 'rightSide', 'levelMax', 'nextRight', 'maxDepth', 'maxWidth'],
    sayIt: ['Standard = save size, one level at a time. Level-wise = per level (last, max). Depth/width = recursion or BFS.'],
    branchGuides: {
      'standard-level': { proceed: 'WHEN: standard level-by-level traversal' },
      'level-wise': { proceed: 'WHEN: process per level — right side, max, next pointers' },
      'depth-width': { proceed: 'WHEN: depth (max/min) or width (index tracking)' },
    },
  }),

  'view-based': d({
    whenAtThisStep: 'Side views or top/bottom views?',
    xray: [
      { text: 'Return **right side view** of binary tree', kind: 'goal' },
      { text: 'Return **vertical order** (BFS, no row sort)', kind: 'goal' },
    ],
    budget: ['sideView', 'topView'],
    sayIt: ['Side views = last/first of each level. Top/bottom = BFS with column tracking.'],
    branchGuides: {
      'side-views': { proceed: 'WHEN: right or left side view via BFS per-level' },
      'top-bottom': { proceed: 'WHEN: top/bottom view via BFS with column index' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
