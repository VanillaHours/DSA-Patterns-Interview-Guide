import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const preorderLeaf: TaxonomyNode = L.preorderLeaf
const inorderLeaf: TaxonomyNode = L.inorderLeaf
const postorderLeaf: TaxonomyNode = L.postorderLeaf

const pathRootToLeafNode: TaxonomyNode = decision(
  'path-root-to-leaf',
  'Root-to-Leaf Paths',
  'lime',
  4,
  'Find paths starting at root and ending at a leaf node.',
  [
    branch(['path sum check (root to leaf)'], 'Path Sum Check',
      'Subtract val on entry; check target==0 at leaf.',
      L.pathSumLeaf),
    branch(['collect all root-to-leaf paths with sum target'], 'Path Sum II',
      'Preorder with vector collection; backtrack after recursion.',
      L.pathSumIILeaf),
  ],
)

const pathAnyNode: TaxonomyNode = decision(
  'path-any-node',
  'Any Path (Node-to-Node)',
  'lime',
  4,
  'Paths can start and end anywhere — not necessarily root or leaf.',
  [
    branch(['count paths starting anywhere summing to target'], 'Path Sum III',
      'Prefix sum map during DFS; count cur - target in map.',
      L.pathSumIIILeaf),
    branch(['longest path where all nodes have same value'], 'Univalue Path',
      'Postorder; extend when child matches; track max edges.',
      L.univalueLeaf),
  ],
)

const ancestorNode: TaxonomyNode = decision(
  'path-ancestor',
  'Ancestor-Descendant Relationships',
  'lime',
  4,
  'Find relationships between two nodes — LCA queries.',
  [
    branch(['LCA of two nodes in binary tree'], 'LCA of Binary Tree',
      'Postorder; if both sides non-null, node is LCA.',
      L.lcaLeaf),
    branch(['LCA with existence check'], 'LCA II',
      'Wrap LCA with count; return null if both not found.',
      L.lcaIILeaf),
  ],
)

const pathBasedDfsNode: TaxonomyNode = decision(
  'path-based-dfs',
  'Path-Based DFS',
  'lime',
  3,
  'Path sum variants, LCA, univalue path — which sub-type?',
  [
    branch(['root to leaf path sum'], 'Root-to-Leaf Paths',
      'Subtract-on-entry; check at leaf.',
      pathRootToLeafNode),
    branch(['any node to any node path counting'], 'Any Path (Node-to-Node)',
      'Prefix sum map or postorder extend.',
      pathAnyNode),
    branch(['lowest common ancestor'], 'Ancestor-Descendant',
      'Postorder LCA with optional existence check.',
      ancestorNode),
  ],
)

const recursiveDfsNode: TaxonomyNode = decision(
  'recursive-dfs',
  'Recursive DFS',
  'lime',
  3,
  'Preorder, inorder, postorder, or path-based recursive traversal?',
  [
    branch(['preorder traversal'], 'Preorder (Root→Left→Right)',
      'Process root before children — clone, paths, prefix expression.',
      preorderLeaf),
    branch(['inorder traversal', 'BST validate', 'kth smallest'], 'Inorder (Left→Root→Right)',
      'Process left, root, right — BST validation, kth smallest, sorted order.',
      inorderLeaf),
    branch(['postorder traversal'], 'Postorder (Left→Right→Root)',
      'Process children before root — tree DP, max path sum, delete tree.',
      postorderLeaf),
    branch(['path sum', 'lowest common ancestor', 'univalue path'], 'Path-Based DFS',
      'Root-to-leaf path sum, any-path counting, LCA, univalue paths.',
      pathBasedDfsNode),
  ],
)

const explicitStackNode: TaxonomyNode = L.explicitStackLeaf
const stateTrackingNode: TaxonomyNode = L.stateTrackingLeaf

const iterativeDfsNode: TaxonomyNode = decision(
  'iterative-dfs',
  'Iterative DFS (Stack-based)',
  'lime',
  3,
  'Explicit stack for pre/in/post order, or state-tracking for serialization/construction?',
  [
    branch(['iterative inorder', 'iterative preorder', 'iterative postorder'], 'Explicit Stack Traversals',
      'Push-all-left for inorder; push R→L for preorder; two-stack for postorder.',
      explicitStackNode),
    branch(['verify preorder serialization', 'construct BST from preorder'], 'State-Tracking DFS',
      'Slot counting, monotonic stack for construction from traversal order.',
      stateTrackingNode),
  ],
)

const morrisInorderNode: TaxonomyNode = L.morrisInorderLeaf
const morrisPreorderNode: TaxonomyNode = L.morrisPreorderLeaf

const morrisNode: TaxonomyNode = decision(
  'morris',
  'Morris Traversal (O(1) Space)',
  'lime',
  3,
  'Threaded binary tree traversal using predecessor pointers — O(1) space, no stack.',
  [
    branch(['morris inorder'], 'Morris Inorder',
      'Create thread from predecessor to current; unthread after visiting left subtree.',
      morrisInorderNode),
    branch(['morris preorder'], 'Morris Preorder',
      'Push val when creating thread (before going left) instead of after.',
      morrisPreorderNode),
  ],
)

const dfsVariantsNode: TaxonomyNode = decision(
  'dfs-variants',
  'Depth-First Search (DFS) Variants',
  'lime',
  2,
  'Explore as far as possible along a branch before backtracking. Recursive, iterative stack, or Morris O(1) space?',
  [
    branch(['preorder', 'inorder', 'postorder', 'path sum', 'lca'], 'Recursive DFS',
      'Preorder, inorder, postorder, or path-based using function call stack.',
      recursiveDfsNode),
    branch(['iterative stack', 'explicit stack'], 'Iterative DFS (Stack-based)',
      'Explicit stack for pre/in/post order; state-tracking for serialization/construction.',
      iterativeDfsNode),
    branch(['morris', 'O(1) space', 'threaded tree'], 'Morris Traversal (O(1) Space)',
      'Threaded binary tree using predecessor pointers — O(1) space, no recursion, no stack.',
      morrisNode),
  ],
)

const standardLevelNode: TaxonomyNode = L.standardLevelLeaf
const levelWiseNode: TaxonomyNode = L.levelWiseLeaf
const depthWidthNode: TaxonomyNode = L.depthWidthLeaf

const levelOrderNode: TaxonomyNode = decision(
  'level-order-traversals',
  'Level-Order Traversals',
  'amber',
  3,
  'Processing nodes level by level — standard, level-wise, or depth/width analysis?',
  [
    branch(['level order traversal'], 'Standard Level Order',
      'Queue + per-level loop, one level at a time.',
      standardLevelNode),
    branch(['right side view', 'largest per row', 'next right pointers'], 'Level-Wise Processing',
      'Compute something per level (last node, max value, link pointers).',
      levelWiseNode),
    branch(['max depth', 'min depth', 'max width'], 'Depth-Based Analysis',
      'Recursive depth or BFS with index tracking for width.',
      depthWidthNode),
  ],
)

const multiSourceBfsNode: TaxonomyNode = L.multiSourceBfsLeaf
const bidirectionalBfsNode: TaxonomyNode = L.bidirectionalBfsLeaf

const bfsVariantsNode: TaxonomyNode = decision(
  'bfs-variants',
  'Breadth-First Search (BFS) Variants',
  'amber',
  2,
  'Level by level traversal using a queue — level-order, multi-source, or bidirectional?',
  [
    branch(['level order', 'right side view', 'max depth', 'tree width'], 'Level-Order Traversals',
      'Standard, level-wise processing, or depth/width analysis.',
      levelOrderNode),
    branch(['multi-source bfs', 'max level sum', 'deepest leaves sum'], 'Multi-Source BFS',
      'Starting BFS from multiple nodes; per-level aggregates.',
      multiSourceBfsNode),
    branch(['bidirectional bfs', 'distance K'], 'Bidirectional BFS',
      'BFS from both source and target; meeting-point search.',
      bidirectionalBfsNode),
  ],
)

const boundaryNode: TaxonomyNode = L.boundaryLeaf
const verticalNode: TaxonomyNode = L.verticalLeaf
const zigzagNode: TaxonomyNode = L.zigzagLeaf

const sideViewsNode: TaxonomyNode = L.sideViewsLeaf
const topBottomNode: TaxonomyNode = L.topBottomLeaf

const viewBasedNode: TaxonomyNode = decision(
  'view-based',
  'View-Based Traversals',
  'pink',
  3,
  'What\'s visible from different perspectives — side views or top/bottom views?',
  [
    branch(['right side view', 'left side view'], 'Side Views',
      'Last (or first) node of each level via BFS.',
      sideViewsNode),
    branch(['vertical order bfs', 'top view', 'bottom view'], 'Top/Bottom Views',
      'BFS with column tracking; no row sort needed (BFS ensures row order).',
      topBottomNode),
  ],
)

const specializedNode: TaxonomyNode = decision(
  'specialized',
  'Specialized Tree Traversals',
  'pink',
  2,
  'Boundary, vertical, spiral/zigzag, or view-based traversal?',
  [
    branch(['boundary traversal'], 'Boundary Traversals',
      'Follow the outline — left edge, leaves, right edge (three phases).',
      boundaryNode),
    branch(['vertical order traversal'], 'Vertical Traversals',
      'Traverse by column (horizontal distance from root) with row and value sort.',
      verticalNode),
    branch(['zigzag', 'spiral level order'], 'Spiral / Zigzag Patterns',
      'Level order with alternating left-to-right and right-to-left per level.',
      zigzagNode),
    branch(['side view', 'top view', 'bottom view'], 'View-Based Traversals',
      'Side views (BFS per-level) or top/bottom views (BFS with column tracking).',
      viewBasedNode),
  ],
)

const constructTreeNodes: TaxonomyNode = L.constructTreeLeaf
const serializeNode: TaxonomyNode = L.serializeLeaf

const constructionNode: TaxonomyNode = decision(
  'construction',
  'Tree Construction via Traversals',
  'purple',
  2,
  'Building trees from traversal sequences or serialize/deserialize?',
  [
    branch(['construct from preorder and inorder', 'construct from inorder and postorder'], 'From Multiple Traversals',
      'Build binary tree from preorder+inorder or inorder+postorder.',
      constructTreeNodes),
    branch(['serialize binary tree', 'deserialize binary tree'], 'Serialization / Deserialization',
      'Convert tree to/from string representation (preorder with null markers).',
      serializeNode),
  ],
)

export const treeRoot: TaxonomyNode = decision(
  'tree-root',
  'Tree Traversals',
  'slate',
  1,
  'Before coding: is the input a tree structure? Which family of traversal matches?',
  [
    branch(
      [
        'preorder / inorder / postorder traversal',
        'recursive or iterative DFS',
        'path sum / LCA / univalue path',
        'morris O(1) space traversal',
      ],
      '→ Depth-First Search (DFS)',
      'Explore deep paths before backtracking — recursive, iterative stack, or Morris.',
      dfsVariantsNode,
      ['level order / bfs', 'boundary / vertical / zigzag'],
    ),
    branch(
      [
        'level order traversal',
        'right side view / tree row max',
        'max depth / min depth / max width',
        'nodes distance K from target',
      ],
      '→ Breadth-First Search (BFS)',
      'Level by level using a queue — standard, multi-source, or bidirectional.',
      bfsVariantsNode,
      ['inorder traversal', 'path sum'],
    ),
    branch(
      [
        'boundary of binary tree',
        'vertical order traversal',
        'zigzag / spiral level order',
        'side view / top view / bottom view',
      ],
      '→ Specialized Traversals',
      'Boundary, vertical, zigzag, or view-based — advanced traversal patterns.',
      specializedNode,
      ['standard dfs', 'standard bfs', 'tree construction'],
    ),
    branch(
      [
        'construct tree from preorder+inorder',
        'construct from inorder+postorder',
        'serialize / deserialize binary tree',
      ],
      '→ Tree Construction via Traversals',
      'Build tree from traversal sequences or serialize/deserialize.',
      constructionNode,
      ['traversal only', 'path sum'],
    ),
  ],
  {
    explanation:
      'Pick the family by what the problem asks: traversal order (DFS), level-by-level (BFS), boundary/vertical/zigzag (specialized), or build tree from arrays (construction).',
  },
)
