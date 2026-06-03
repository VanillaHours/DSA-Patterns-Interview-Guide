/** Mirrors github.com/Yassir-aykhlf/DSA-Taxonomies Traversal Algorithms.md — Tree Traversals section */
export const TREE_ASCII = `Tree Traversals
│
├── Depth-First Search (DFS) Variants
│   ├── Recursive DFS
│   │   ├── Preorder (Root→Left→Right) → LC 144, 589, 257
│   │   ├── Inorder (Left→Root→Right) → LC 94, 98, 230
│   │   ├── Postorder (Left→Right→Root) → LC 145, 590, 124
│   │   └── Path-Based DFS
│   │       ├── Root-to-Leaf Paths → LC 112, 113
│   │       ├── Any Path (Node-to-Node) → LC 437, 687
│   │       └── Ancestor-Descendant → LC 236, 1644
│   ├── Iterative DFS (Stack-based)
│   │   ├── Explicit Stack Traversals → LC 94, 144, 145
│   │   └── State-Tracking DFS → LC 331, 1008
│   └── Morris Traversal (O(1) Space)
│       ├── Morris Inorder → LC 94, 99
│       └── Morris Preorder → LC 144
│
├── Breadth-First Search (BFS) Variants
│   ├── Level-Order Traversals
│   │   ├── Standard Level Order → LC 102, 107, 429
│   │   ├── Level-Wise Processing → LC 199, 515, 116
│   │   └── Depth-Based Analysis → LC 104, 111, 662
│   ├── Multi-Source BFS → LC 1161, 1302
│   └── Bidirectional BFS → LC 863
│
├── Specialized Tree Traversals
│   ├── Boundary Traversals → LC 545
│   ├── Vertical Traversals → LC 987
│   ├── Spiral / Zigzag Patterns → LC 103
│   └── View-Based Traversals
│       ├── Side Views → LC 199
│       └── Top / Bottom Views → LC 314
│
└── Tree Construction via Traversals
    ├── From Multiple Traversals → LC 105, 106
    └── Serialization / Deserialization → LC 297, 449`
