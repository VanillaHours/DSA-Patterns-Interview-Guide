import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Graph Traversal? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Graph / adjacency list / matrix given (or buildable)',
    'Nodes and edges — connectivity, shortest path, cycles',
    'Often: grid (2D), course prerequisites, social network',
    'Algorithms: DFS, BFS, DSU, Dijkstra, Bellman-Ford, MST',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem involve graph connectivity, traversal, or path finding?',
  xray: [
    { text: 'Given an **m x n grid** of 0s and 1s … count **islands**', kind: 'signal' },
    { text: 'Find the **shortest path** from source to destination', kind: 'goal' },
    { text: '**n courses** labeled from 0 to n-1, **prerequisites** list', kind: 'signal' },
    { text: 'Return the ordering of courses you should take to **finish all courses**', kind: 'goal' },
    { text: 'Find the **minimum cost** to connect all points', kind: 'goal' },
  ],
  budget: ['adjList', 'grid', 'shortestPath', 'connected', 'cycles', 'topological'],
  sayIt: [
    'Before any template: is this a graph problem? Look for nodes, edges, connectivity.',
    'If yes — DFS, BFS, or advanced (DSU/shortest weight/MST)?',
    'If no tree or single array — probably not graph traversal.',
  ],
  branchGuides: {
    'dfs-graph': {
      proceed: 'WHEN: explore deep paths, connected components, cycle detection, topological sort',
      whenExtra: ['islands', 'DFS on grid', 'prerequisite all paths'],
    },
    'bfs-graph': {
      proceed: 'WHEN: shortest path (unweighted), level-order, multi-source, Kahn\'s topological sort',
      whenExtra: ['shortest path in matrix', 'rotting oranges', 'word ladder'],
    },
    'advanced-graph': {
      proceed: 'WHEN: DSU/union-find, weighted shortest paths, MST',
      whenExtra: ['union find', 'Dijkstra', 'minimum spanning tree'],
    },
  },
  notThisPattern: [
    { signal: '"binary tree / BST"', actually: 'Tree traversal — different structure, simpler than general graph' },
    { signal: '"linked list cycle"', actually: 'Two pointers (Floyd) — not general graph' },
    { signal: '"largest rectangle in histogram"', actually: 'Monotonic stack — not graph traversal' },
  ],
  misidentify: [
    {
      cause: 'Confusing tree DFS with graph DFS',
      wrong: 'No visited array on graph — infinite loop',
      testCase: 'Cycle in undirected graph',
      fix: 'Always track visited; pass parent for undirected cycles.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'graph-root': PATTERN_GATE,

  'dfs-graph': d({
    whenAtThisStep: 'You confirmed graph traversal AND need Depth-First Search.',
    xray: [
      { text: 'Count **connected components** / **islands**', kind: 'goal' },
      { text: 'Detect **cycle** in graph', kind: 'goal' },
      { text: 'Find **all paths** from source to target', kind: 'goal' },
      { text: 'Return **topological order** of courses', kind: 'goal' },
    ],
    budget: ['adjList', 'connected', 'cycles', 'reachability'],
    sayIt: [
      'DFS: explore deep. Need: connected components, cycle, paths, or topo sort?',
    ],
    branchGuides: {
      'connected-components': {
        proceed: 'WHEN: count, size, or analyze connected components',
      },
      'cycle-detection': {
        proceed: 'WHEN: detect cycle — undirected (parent) vs directed (3-state)',
      },
      'path-finding': {
        proceed: 'WHEN: all paths (backtracking) or path existence (visited-set)',
      },
      'topological-dfs': {
        proceed: 'WHEN: linear order respecting dependencies (DAG)',
      },
    },
  }),

  'connected-components': d({
    whenAtThisStep: 'DFS tracking component boundaries.',
    xray: [
      { text: '**Number of islands** — count 1-components in grid', kind: 'goal' },
      { text: '**Number of provinces** — count friend circles', kind: 'goal' },
      { text: '**Max area** of island', kind: 'goal' },
    ],
    budget: ['connected', 'grid'],
    sayIt: ['DFS per unvisited node; increment counter. For size, return sum from DFS.'],
    branchGuides: {
      'basic-connectivity': { proceed: 'WHEN: count components (islands/provinces)' },
      'component-size': { proceed: 'WHEN: return size / max area of components' },
    },
  }),

  'cycle-detection': d({
    whenAtThisStep: 'Check existence of cycle — directed or undirected.',
    xray: [
      { text: '**Redundant connection** — edge that creates a cycle', kind: 'goal' },
      { text: '**Course schedule** — detect if cycle in prerequisites', kind: 'goal' },
      { text: '**Eventual safe states** — nodes not part of cycle', kind: 'goal' },
    ],
    budget: ['cycles'],
    sayIt: ['Undirected → parent-tracking DFS. Directed → 3-state (0/1/2).'],
    branchGuides: {
      'undirected-cycle': { proceed: 'WHEN: undirected graph; pass parent to avoid false positive' },
      'directed-cycle': { proceed: 'WHEN: directed graph; 3-state DFS (visiting/done)' },
    },
  }),

  'path-finding': d({
    whenAtThisStep: 'Find path(s) between two nodes.',
    xray: [
      { text: 'Return **all paths** from source to target', kind: 'goal' },
      { text: 'Check if **valid path** exists between src and dest', kind: 'goal' },
    ],
    budget: ['reachability'],
    sayIt: ['All paths → backtracking DFS. Exists → visited-set DFS/BFS.'],
    branchGuides: {
      'all-paths': { proceed: 'WHEN: enumerate every path (DAG only — push/pop backtracking)' },
      'path-existence': { proceed: 'WHEN: just check if reachable (DFS or DSU)' },
    },
  }),

  'topological-dfs': d({
    whenAtThisStep: 'Need linear ordering of DAG nodes.',
    xray: [
      { text: 'Return **course order** respecting prerequisites', kind: 'goal' },
      { text: '**Alien dictionary** — order of letters from word list', kind: 'goal' },
    ],
    budget: ['topological', 'dag'],
    sayIt: ['DFS postorder → push u onto stack after visiting all neighbors → reverse.'],
    branchGuides: {
      'topological-dfs': { proceed: 'WHEN: DFS-based topological sort with postorder stack' },
    },
  }),

  'bfs-graph': d({
    whenAtThisStep: 'BFS exploration — shortest path, multi-source, bidirectional, or Kahn\'s.',
    xray: [
      { text: '**Shortest path** in binary matrix / grid', kind: 'goal' },
      { text: 'Multi-source BFS: **rotting oranges**, **01 matrix**', kind: 'signal' },
      { text: '**Bidirectional** BFS: word ladder, open lock', kind: 'signal' },
      { text: '**Kahn\'s algorithm** for topological sort', kind: 'signal' },
    ],
    budget: ['shortestPath', 'topological', 'multiSource'],
    sayIt: [
      'BFS: level-by-level. Shortest path, multi-source, bidirectional, or Kahn\'s?',
    ],
    branchGuides: {
      'shortest-path': {
        proceed: 'WHEN: single-source shortest path or level-by-level distance',
      },
      'multi-source-bfs': {
        proceed: 'WHEN: BFS starts from multiple sources simultaneously or from boundary',
      },
      'bidirectional-bfs': {
        proceed: 'WHEN: two-ended search — expand smaller frontier, check intersection',
      },
      'kahns-topo': {
        proceed: 'WHEN: indegree-based topological sort (queue or priority_queue)',
      },
    },
  }),

  'shortest-path': d({
    whenAtThisStep: 'BFS for shortest path in unweighted graph.',
    xray: [
      { text: '**Shortest path** in binary matrix (8-dir movement)', kind: 'goal' },
      { text: '**Rotting oranges** — minutes to rot all', kind: 'goal' },
      { text: '**Word ladder** — shortest transformation sequence', kind: 'goal' },
    ],
    budget: ['shortestPath'],
    sayIt: ['Single-source BFS with distance grid. Multi-source if all sources start at distance 0.'],
    branchGuides: {
      'bfs-shortest': { proceed: 'WHEN: single or multi-source BFS with distance array' },
      'bfs-level': { proceed: 'WHEN: level-by-level distance from all sources (01 matrix)' },
    },
  }),

  'multi-source-bfs': d({
    whenAtThisStep: 'Multiple BFS sources — simultaneous or boundary-initiated.',
    xray: [
      { text: '**Rotting oranges** — all rotten start simultaneously', kind: 'goal' },
      { text: '**Surrounded regions** — boundary O cells are safe', kind: 'goal' },
    ],
    budget: ['multiSource'],
    sayIt: ['Push all sources; BFS outward. Boundary: start from edges.'],
    branchGuides: {
      'multi-source-simul': { proceed: 'WHEN: all sources active at time 0, BFS outward' },
      'multi-source-boundary': { proceed: 'WHEN: start from boundary cells only' },
    },
  }),

  'bidirectional-bfs': d({
    whenAtThisStep: 'BFS from both source and target — meet-in-the-middle.',
    xray: [
      { text: '**Word ladder** with bidirectional optimization', kind: 'goal' },
      { text: '**Open the lock** minimum turns', kind: 'goal' },
    ],
    budget: ['shortestPath', 'multiSource'],
    sayIt: ['Two frontiers; always expand the smaller one; check intersection.'],
    branchGuides: {
      'bidirectional-bfs': { proceed: 'WHEN: meet-in-the-middle BFS halves state space' },
    },
  }),

  'kahns-topo': d({
    whenAtThisStep: 'Topological sort using Kahn\'s algorithm (BFS with indegree).',
    xray: [
      { text: '**Course schedule II** — return order', kind: 'goal' },
      { text: '**Minimum height trees** — peel leaves', kind: 'goal' },
      { text: '**Lexicographically smallest** topological order', kind: 'goal' },
    ],
    budget: ['topological'],
    sayIt: ['Queue + indegree. Standard or lexicographic (priority_queue).'],
    branchGuides: {
      kahns: { proceed: 'WHEN: standard Kahn\'s with queue (any valid order)' },
      'kahns-lex': { proceed: 'WHEN: lexicographically smallest order (min-heap priority_queue)' },
    },
  }),

  'advanced-graph': d({
    whenAtThisStep: 'Advanced graph algorithms — DSU, weighted shortest paths, MST.',
    xray: [
      { text: '**Union find** / DSU — dynamic connectivity', kind: 'signal' },
      { text: '**Dijkstra** — shortest path with non-negative weights', kind: 'signal' },
      { text: '**Bellman-Ford** — shortest path with K stops or negative', kind: 'signal' },
      { text: '**Minimum spanning tree** — connect all points min cost', kind: 'goal' },
    ],
    budget: ['weighted', 'negativeWeights', 'mst'],
    sayIt: [
      'Advanced: DSU for components, Dijkstra/Bellman-Ford/Floyd for weighted shortest path, Prim/Kruskal for MST.',
    ],
    branchGuides: {
      'union-find-dsu': {
        proceed: 'WHEN: DSU — path compression + rank, or dynamic connectivity merge',
      },
      'weighted-shortest': {
        proceed: 'WHEN: weighted edges — Dijkstra, Floyd-Warshall, or Bellman-Ford',
      },
      'mst-node': {
        proceed: 'WHEN: connect all nodes with minimum total edge weight',
      },
    },
  }),

  'union-find-dsu': d({
    whenAtThisStep: 'Disjoint Set Union — union and find operations.',
    xray: [
      { text: '**Number of provinces** / friend circles via DSU', kind: 'goal' },
      { text: '**Redundant connection** — DSU finds cycle', kind: 'goal' },
      { text: '**Accounts merge** — merge accounts sharing emails', kind: 'goal' },
    ],
    budget: ['connected'],
    sayIt: ['DSU find with path compression; unite with rank. Map attributes to indices.'],
    branchGuides: {
      'union-find': { proceed: 'WHEN: basic DSU for connectivity or cycle detection' },
      'dynamic-connectivity': { proceed: 'WHEN: merge components by shared attributes (accounts merge)' },
    },
  }),

  'weighted-shortest': d({
    whenAtThisStep: 'Shortest path with weighted edges — pick algorithm.',
    xray: [
      { text: '**Network delay time** — Dijkstra from single source', kind: 'goal' },
      { text: '**Find the city** — all-pairs shortest paths', kind: 'goal' },
      { text: '**Cheapest flights within K stops** — Bellman-Ford', kind: 'goal' },
    ],
    budget: ['weighted', 'negativeWeights', 'shortestPath'],
    sayIt: ['Dijkstra (non-negative), Floyd-Warshall (all-pairs), Bellman-Ford (K stops/negative).'],
    branchGuides: {
      dijkstra: { proceed: 'WHEN: non-negative weights, single source, O((V+E) log V)' },
      'floyd-warshall': { proceed: 'WHEN: all-pairs shortest, V ≤ 500, O(n³)' },
      'bellman-ford': { proceed: 'WHEN: K stops limit or negative weights, O(K*E)' },
    },
  }),

  'mst-node': d({
    whenAtThisStep: 'Connect all nodes with minimum total cost.',
    xray: [
      { text: '**Min cost to connect all points** (Manhattan distance)', kind: 'goal' },
    ],
    budget: ['mst'],
    sayIt: ['Prim (dense, O(n²)) or Kruskal (sparse, O(E log E)).'],
    branchGuides: {
      mst: { proceed: 'WHEN: minimum spanning tree — Prim or Kruskal' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
