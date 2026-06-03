import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const connectedComponentsNode: TaxonomyNode = decision(
  'connected-components',
  'Connected Components — what are you counting or measuring?',
  'green',
  3,
  'Graph is split into islands/components. Match the goal:',
  [
    branch(
      ['"count islands/provinces"', '"number of connected components"', 'iterate with visited set'],
      'Basic Connectivity',
      'DFS/BFS each unvisited node; increment counter on each new component.',
      L.basicConnectivityLeaf,
    ),
    branch(
      ['"max area of island"', '"largest component size"', '"closed islands"'],
      'Component Size Analysis',
      'DFS returns component size; track max or filter edge-touching.',
      L.componentSizeLeaf,
    ),
  ],
)

const cycleDetectionNode: TaxonomyNode = decision(
  'cycle-detection',
  'Cycle Detection — directed or undirected?',
  'green',
  3,
  'Detect if a cycle exists in the graph. Read whether edges have direction:',
  [
    branch(
      ['"undirected graph"', '"redundant connection"', 'add edge until cycle forms'],
      'Undirected Cycles',
      'DFS with parent tracking; or DSU (Kruskal-style).',
      L.undirectedCycleLeaf,
      ['directed graph', 'prerequisite schedule'],
    ),
    branch(
      ['"course schedule" / prerequisites', '"directed graph"', '"find eventual safe states"'],
      'Directed Cycles',
      '3-state DFS (unvisited/visiting/done) detects back edges.',
      L.directedCycleLeaf,
      ['undirected graph', 'redundant connection'],
    ),
  ],
)

const pathFindingNode: TaxonomyNode = decision(
  'path-finding',
  'Path Finding & Exploration — what kind of path?',
  'green',
  3,
  'Find paths between nodes. Read whether you need all paths or just existence:',
  [
    branch(
      ['"all paths from source to target"', '"find all paths"', 'enumerate every route in DAG'],
      'All Paths',
      'Backtracking DFS: push before explore, pop after.',
      L.allPathsLeaf,
      ['just check if path exists'],
    ),
    branch(
      ['"find if path exists"', '"valid path"', '"reachability"'],
      'Path Existence',
      'DFS/BFS with visited set, or DSU for static edges.',
      L.pathExistenceLeaf,
      ['enumerate all paths'],
    ),
  ],
)

const topologicalDfsNode: TaxonomyNode = decision(
  'topological-dfs',
  'DFS-Based Topological Sort — what order?',
  'green',
  3,
  'Need a linear ordering respecting dependency edges (DAG required):',
  [
    branch(
      ['"course schedule II" / return order', '"alien dictionary" order of letters'],
      'Topological Sort (DFS)',
      'DFS with postorder push to stack; reverse for topological order.',
      L.topologicalDfsLeaf,
    ),
  ],
)

const dfsGraphNode: TaxonomyNode = decision(
  'dfs-graph',
  'Depth-First Search (DFS) on Graphs',
  'green',
  2,
  'You need graph traversal — do you need connected components, cycle detection, path finding, or topological sort?',
  [
    branch(
      ['"number of islands/provinces"', '"connected components"', '"max area of island"'],
      'Connected Components',
      'Count or measure DFS-visited clusters.',
      connectedComponentsNode,
    ),
    branch(
      ['"cycle" in graph', '"redundant connection"', '"course schedule" detect cycle'],
      'Cycle Detection',
      'Undirected: parent-tracking. Directed: 3-state.',
      cycleDetectionNode,
    ),
    branch(
      ['"all paths"', '"path exists"', '"reachability"', '"valid path"'],
      'Path Finding & Exploration',
      'Backtracking for all paths; visited-set for existence.',
      pathFindingNode,
    ),
    branch(
      ['"topological order"', '"course schedule II"', '"alien dictionary"'],
      'Topological Sort',
      'DFS postorder onto stack.',
      topologicalDfsNode,
    ),
  ],
  {
    template: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v, adj, vis);
}`,
    templateCaption: 'DFS graph template — children specialize with state tracking, return values, or postorder.',
  },
)

const shortestPathNode: TaxonomyNode = decision(
  'shortest-path',
  'Shortest Path (Unweighted) — single source or level-by-level?',
  'teal',
  3,
  'BFS gives shortest distance in unweighted graph. Match the problem structure:',
  [
    branch(
      ['"shortest path in binary matrix"', '"shortest transformation" / word ladder', '"rotting oranges" minutes'],
      'Single Source BFS',
      'Queue + distance array from one start; expand level by level.',
      L.bfsShortestPathLeaf,
    ),
    branch(
      ['"01 matrix" distance to nearest zero', '"as far from land" max distance'],
      'Level-by-Level (Multi-Source)',
      'BFS from ALL sources simultaneously; distance grid tracks per-cell distance.',
      L.bfsLevelByLevelLeaf,
    ),
  ],
)

const multiSourceBfsNode: TaxonomyNode = decision(
  'multi-source-bfs',
  'Multi-Source BFS — simultaneous or boundary?',
  'teal',
  3,
  'BFS starts from multiple initial nodes. Read whether all sources start together or from boundary:',
  [
    branch(
      ['"rotting oranges" minutes from rotten', '"01 matrix" distance to nearest zero', 'all sources active at once'],
      'Simultaneous Multi-Source',
      'Push all sources initially; BFS outward; track distances/minutes.',
      L.multiSourceSimultaneousLeaf,
    ),
    branch(
      ['"surrounded regions"', '"number of enclaves"', 'boundary-connected O cells'],
      'Boundary BFS',
      'Start BFS from all boundary cells matching a condition; mark interior vs boundary-connected.',
      L.multiSourceBoundaryLeaf,
    ),
  ],
)

const bidirectionalBfsNode: TaxonomyNode = decision(
  'bidirectional-bfs',
  'Bidirectional BFS — meet in the middle?',
  'teal',
  3,
  'Two-ended search — expand from both source and target simultaneously:',
  [
    branch(
      ['"word ladder" shortest transformation', '"open the lock" minimum turns', 'two-ended search halves state space'],
      'Meet-in-the-Middle',
      'Alternate expanding smaller frontier; check intersection each step.',
      L.bidirectionalBfsLeaf,
    ),
  ],
)

const kahnsTopoNode: TaxonomyNode = decision(
  'kahns-topo',
  "Kahn's Algorithm — indegree-based or lexicographic?",
  'teal',
  3,
  'Topological sort via BFS counting indegrees. Read if you need any valid order or lexicographically smallest:',
  [
    branch(
      ['"course schedule II" return order', '"minimum height trees" peel leaves', 'any valid topological order'],
      'Indegree-Based (Standard)',
      'Queue + indegree array; push nodes with indegree==0.',
      L.kahnsLeaf,
    ),
    branch(
      ['"lexicographically smallest" order', '"sort items by groups"', 'smallest-on-top requirement'],
      'Lexicographic Topological Sort',
      'Priority_queue (min-heap) instead of queue; pick smallest indegree-0 node.',
      L.kahnsLexicographicLeaf,
    ),
  ],
)

const bfsGraphNode: TaxonomyNode = decision(
  'bfs-graph',
  'Breadth-First Search (BFS) on Graphs',
  'teal',
  2,
  'Need shortest path (unweighted), level exploration, or Kahn\'s topological sort?',
  [
    branch(
      ['"shortest path" in grid/matrix', '"minimum steps / distance" unweighted', '"word ladder" transformation steps'],
      'Shortest Path (Unweighted)',
      'BFS from source(s); distance array.',
      shortestPathNode,
    ),
    branch(
      ['all sources rot/orange simultaneously', '"multi-source" BFS'],
      'Multi-Source BFS',
      'Push all initial sources; BFS outward level by level.',
      multiSourceBfsNode,
    ),
    branch(
      ['"bidirectional" / "meet in the middle"', '"word ladder" with optimized search'],
      'Bidirectional BFS',
      'Two frontiers; expand smaller one; check intersection.',
      bidirectionalBfsNode,
    ),
    branch(
      ['"topological sort" BFS / Kahn\'s', '"course schedule II"', '"minimum height trees"'],
      "Topological Sort (Kahn's)",
      'Indegree array + queue; peel nodes with indegree==0.',
      kahnsTopoNode,
    ),
  ],
  {
    template: `queue<int> q;
vector<int> dist(n, -1);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
        if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
}`,
    templateCaption: 'BFS graph template — children vary by source count, distance semantics, and frontier management.',
  },
)

const unionFindNode: TaxonomyNode = decision(
  'union-find-dsu',
  'Union-Find (DSU) — basic or dynamic?',
  'purple',
  3,
  'DSU manages connected components under edge additions. Match:',
  [
    branch(
      ['"number of provinces" DSU', '"redundant connection" cycle via DSU', 'path compression + union by rank'],
      'Path Compression + Rank',
      'DSU find() with path compression; unite() with rank heuristic.',
      L.unionFindLeaf,
    ),
    branch(
      ['"accounts merge" shared emails', 'merge components based on shared attributes'],
      'Dynamic Connectivity',
      'DSU on indices; map attributes to first index for merging.',
      L.dynamicConnectivityLeaf,
    ),
  ],
)

const weightedShortestPathNode: TaxonomyNode = decision(
  'weighted-shortest',
  'Shortest Path (Weighted) — which algorithm?',
  'purple',
  3,
  'Edges have weights. Read the constraint on V, E, and special requirements:',
  [
    branch(
      ['"network delay time" Dijkstra', '"minimum effort path" maximize min edge', 'non-negative weights'],
      "Dijkstra's Algorithm",
      'Priority queue + distance array; O((V+E) log V).',
      L.dijkstraLeaf,
      ['negative weights', 'at most K stops'],
    ),
    branch(
      ['"find the city" all-pairs distance', 'need all-pairs shortest paths', 'V ≤ 500 (O(n³) acceptable)'],
      'Floyd-Warshall',
      'DP over k intermediate nodes; O(n³).',
      L.floydWarshallLeaf,
    ),
    branch(
      ['"cheapest flights within K stops"', 'negative edge weights allowed', 'Bellman-Ford K iterations'],
      'Bellman-Ford',
      'Relax all edges K times; tracks distance updates per iteration.',
      L.bellmanFordLeaf,
    ),
  ],
)

const mstNode: TaxonomyNode = decision(
  'mst-node',
  'Minimum Spanning Tree',
  'purple',
  3,
  'Connect all nodes with minimum total edge weight:',
  [
    branch(
      ['"min cost to connect all points"', '"connect cities with min cost"', 'MST on complete/dense graph'],
      "Prim's / Kruskal's",
      'Prim (greedy pick minDist) or Kruskal (sort edges + DSU).',
      L.mstLeaf,
    ),
  ],
)

const advancedGraphNode: TaxonomyNode = decision(
  'advanced-graph',
  'Advanced Graph Traversal Patterns',
  'purple',
  2,
  'Beyond simple DFS/BFS — DSU, weighted shortest paths, or minimum spanning tree?',
  [
    branch(
      ['"union find" / "disjoint set"', '"DSU" / "dynamic connectivity"', '"accounts merge"'],
      'Union-Find (DSU)',
      'Path compression + union by rank for component management.',
      unionFindNode,
    ),
    branch(
      ['weighted graph shortest path', '"Dijkstra" / "Bellman-Ford"', '"all-pairs" shortest path'],
      'Shortest Path (Weighted)',
      'Dijkstra (non-negative), Floyd-Warshall (all-pairs), Bellman-Ford (K stops/neg).',
      weightedShortestPathNode,
    ),
    branch(
      ['"minimum spanning tree"', '"connect all points" min cost', '"Prim" / "Kruskal"'],
      'Minimum Spanning Tree',
      'Prim (dense) or Kruskal (sparse) for min-cost connection.',
      mstNode,
    ),
  ],
  {
    template: `// DSU, Dijkstra, Floyd-Warshall, Bellman-Ford, Prim — choose template from leaf`,
    templateCaption: 'Advanced graph algorithms — each leaf has its own complete template.',
  },
)

export const graphRoot: TaxonomyNode = decision(
  'graph-root',
  'Graph Traversal',
  'slate',
  1,
  'Read the problem: what kind of graph traversal or algorithm is required?',
  [
    branch(
      [
        '"DFS" on graph',
        '"connected components" / islands',
        '"cycle detection" in graph',
        '"all paths" / "path exists"',
        '"topological sort" DFS',
      ],
      'Depth-First Search (DFS)',
      'Explore deep; stack/recursion; track visited.',
      dfsGraphNode,
      ['shortest path unweighted', 'weighted graph algorithms'],
    ),
    branch(
      [
        '"BFS" on graph',
        '"shortest path" unweighted',
        '"level" / "multi-source" BFS',
        '"Kahn" topological sort',
      ],
      'Breadth-First Search (BFS)',
      'Explore level by level; queue; shortest path in unweighted.',
      bfsGraphNode,
      ['DFS / backtracking', 'weighted shortest path'],
    ),
    branch(
      [
        '"union find" / DSU',
        '"Dijkstra" / weighted', 
        '"Bellman-Ford" / negative',
        '"minimum spanning tree"',
        '"connect all points"',
      ],
      'Advanced Patterns',
      'DSU, weighted shortest paths, or MST for complex graph problems.',
      advancedGraphNode,
      ['simple DFS/BFS traversal'],
    ),
  ],
  {
    explanation:
      'Match the graph type (unweighted/weighted/directed/undirected) and the goal (shortest path, connectivity, cycle detection, topological order). Each branch leads to a specific algorithm family.',
  },
)
