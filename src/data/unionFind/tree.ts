import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Basic Union Find Operations (step 2) ───────────────────────

const initialization: TaxonomyNode = decision(
  'init-step3',
  'Initialization — how to set up the DSU?',
  'teal',
  3,
  'Setting up disjoint sets. What representation?',
  [
    branch(
      ['"parent array"', '"array representation"', 'int parent[N]'],
      'Array Representation',
      'Classic: parent[i] initialized to i; integer elements 0..n-1.',
      L.arrayRepLeaf,
    ),
    branch(
      ['"tree"', '"node"', '"object"', '"explicit tree"', 'Node* parent'],
      'Tree Representation',
      'Explicit node objects with parent pointers; flexible for dynamic sets.',
      L.treeRepLeaf,
    ),
    branch(
      ['"map"', '"string"', '"non-integer"', '"custom element"', '"unordered_map"'],
      'Custom Element Mapping',
      'Map non-integer elements to indices; then use array DSU.',
      L.customMapLeaf,
    ),
  ],
)

const findOp: TaxonomyNode = decision(
  'find-step3',
  'Find Operation — how to find the set representative?',
  'blue',
  3,
  'Finding the root/representative of an element. Which variant?',
  [
    branch(
      ['"basic find"', '"simple find"', '"while loop"', 'parent[x] != x'],
      'Basic Find',
      'Iteratively follow parent pointers until root found.',
      L.basicFindLeaf,
      ['path compression'],
    ),
    branch(
      ['"path compression"', '"recursive find"', '"flatten tree"', 'optimized find'],
      'Path Compression',
      'During find, set each node\'s parent to root. Near-constant time.',
      L.pathCompressionLeaf,
    ),
    branch(
      ['"path splitting"', '"path halving"', '"iterative compression"', 'alternative'],
      'Path Splitting / Halving',
      'Iterative techniques: each node points to grandparent. Avoids recursion.',
      L.pathSplittingLeaf,
    ),
  ],
)

const unionOp: TaxonomyNode = decision(
  'union-step3',
  'Union Operation — how to merge two sets?',
  'green',
  3,
  'Merging two disjoint sets. Which union strategy?',
  [
    branch(
      ['"basic union"', '"simple union"', 'parent[ra] = rb'],
      'Basic Union',
      'Set one root as parent of the other. No balancing.',
      L.basicUnionLeaf,
      ['union by rank'],
    ),
    branch(
      ['"union by rank"', '"union by size"', '"balanced union"', '"optimized union"'],
      'Union by Rank / Size',
      'Attach smaller tree under larger; maintains O(log n) height.',
      L.unionByRankLeaf,
    ),
    branch(
      ['"custom criteria"', '"custom union"', '"weighted"', '"conditional union"'],
      'Union by Custom Criteria',
      'Problem-specific merge logic: e.g., merge by value priority.',
      L.unionCustomLeaf,
    ),
  ],
)

const dataStructOpt: TaxonomyNode = decision(
  'data-struct-opt-step3',
  'Data Structure Optimizations — how to improve DSU performance?',
  'purple',
  3,
  'Optimizing the DSU for near-constant operations. Which technique?',
  [
    branch(
      ['"path compression + union by rank"', '"fully optimized"', '"both optimizations"'],
      'Path Compression + Union by Rank',
      'Combine both for inverse-Ackermann amortized time O(α(n)).',
      L.pcRankedLeaf,
    ),
    branch(
      ['"size tracking"', '"component size"', '"largest component"', 'sz[root]'],
      'Size Tracking',
      'Maintain size per root; union by size; query component sizes.',
      L.sizeTrackingLeaf,
    ),
    branch(
      ['"dynamic"', '"add element"', '"on the fly"', '"resize"', '"incremental"'],
      'Dynamic Element Addition',
      'Add new elements at runtime by resizing parent/rank vectors.',
      L.dynamicAddLeaf,
    ),
  ],
)

const basicUnionFind: TaxonomyNode = decision(
  'basic-uf-step2',
  'Basic Union Find Operations',
  'teal',
  2,
  'Core DSU operations: initialization, find, union, or optimizations. Pick ONE:',
  [
    branch(
      ['"init"', '"initialize"', '"parent array"', '"make set"', '"new element"', '"set up"'],
      '→ Initialization',
      'Set up the DSU with appropriate representation.',
      initialization,
    ),
    branch(
      ['"find"', '"root"', '"representative"', '"which set"', '"belongs to"'],
      '→ Find Operation',
      'Find which set an element belongs to.',
      findOp,
    ),
    branch(
      ['"union"', '"merge"', '"join"', '"connect"', '"combine"'],
      '→ Union Operation',
      'Merge two sets together.',
      unionOp,
    ),
    branch(
      ['"optimize"', '"path compression"', '"rank"', '"size"', '"dynamic"', '"performance"'],
      '→ Data Structure Optimizations',
      'Optimize DSU for speed or dynamic elements.',
      dataStructOpt,
    ),
  ],
)

// ── Graph Problems (step 2) ─────────────────────────────────────

const connectedComponents: TaxonomyNode = decision(
  'connected-comps-step3',
  'Connected Components — find or count connected parts of a graph?',
  'blue',
  3,
  'Working with connected components. Which aspect?',
  [
    branch(
      ['"count"', '"number of"', '"how many"', '"components count"'],
      'Counting Components',
      'Count distinct connected components. Decrement on each successful union.',
      L.countingComponentsLeaf,
    ),
    branch(
      ['"size"', '"largest"', '"property"', '"component size"', '"biggest"'],
      'Component Properties',
      'Track size, sum, or other properties per component.',
      L.componentPropsLeaf,
    ),
    branch(
      ['"dynamic connectivity"', '"online"', '"incremental"', '"query"', '"live"'],
      'Dynamic Connectivity',
      'Answer connectivity queries as edges are added over time.',
      L.dynamicConnectivityLeaf,
    ),
  ],
)

const cycleDetection: TaxonomyNode = decision(
  'cycle-det-step3',
  'Cycle Detection — find cycles in graphs using DSU?',
  'green',
  3,
  'Detecting cycles with union-find. What type of graph?',
  [
    branch(
      ['"undirected"', '"simple cycle"', '"tree"', '"redundant"'],
      'Undirected Graph Cycles',
      'In undirected graph, edge forms cycle if both endpoints already in same component.',
      L.undirectedCycleLeaf,
    ),
    branch(
      ['"directed"', '"digraph"', '"redundant ii"', '"two parents"'],
      'Directed Graph Cycles',
      'Directed case: combine DSU with in-degree tracking for conflict detection.',
      L.directedCycleLeaf,
      ['undirected cycle detection'],
    ),
    branch(
      ['"grid"', '"2d"', '"matrix"', '"classify"', '"grid cycle"'],
      'Cycle Classification',
      'Detect cycles in 2D grids by flattening coordinates and unioning adjacent cells.',
      L.cycleClassifyLeaf,
    ),
  ],
)

const mst: TaxonomyNode = decision(
  'mst-step3',
  'Minimum Spanning Tree — find MST using DSU?',
  'purple',
  3,
  'Building minimum spanning trees. Which aspect?',
  [
    branch(
      ['"kruskal"', '"mst"', '"minimum spanning"', '"sort edges"', '"connect all points"'],
      "Kruskal's Algorithm",
      'Sort edges by weight; greedily add edges that don\'t form cycles using DSU.',
      L.kruskalLeaf,
    ),
    branch(
      ['"critical"', '"pseudo-critical"', '"bridge"', '"essential edges"', '"mst analysis"'],
      'Critical Edges',
      'Classify MST edges: critical (in all) vs pseudo-critical (in at least one).',
      L.criticalEdgesLeaf,
    ),
  ],
)

const equivRelations: TaxonomyNode = decision(
  'equiv-rel-step3',
  'Equivalence Relationships — group equivalent elements?',
  'teal',
  3,
  'Grouping elements by equivalence relations. Which type?',
  [
    branch(
      ['"string"', '"account"', '"email"', '"group strings"', '"merge accounts"'],
      'String / Account Grouping',
      'Group strings or emails that belong to the same entity.',
      L.stringGroupingLeaf,
    ),
    branch(
      ['"equation"', '"equality"', '"satisfiability"', '"== and !="', '"constraints"'],
      'Equation Satisfaction',
      'Check feasibility of equality/inequality constraints.',
      L.equationSatLeaf,
    ),
    branch(
      ['"similar"', '"classify"', '"group by similarity"', '"similar string"'],
      'Node Classification',
      'Classify nodes based on similarity criteria.',
      L.nodeClassifyLeaf,
    ),
  ],
)

const graphProblems: TaxonomyNode = decision(
  'graph-probs-uf-step2',
  'Graph Problems',
  'blue',
  2,
  'Graph problems solved with DSU: components, cycles, MST, equivalence. Pick ONE:',
  [
    branch(
      ['"component"', '"connected"', '"count components"', '"islands"', '"dynamic connectivity"'],
      '→ Connected Components',
      'Find, count, or track properties of connected components.',
      connectedComponents,
    ),
    branch(
      ['"cycle"', '"redundant"', '"tree"', '"graph valid tree"', '"detect cycle"'],
      '→ Cycle Detection',
      'Detect cycles in undirected, directed, or grid graphs.',
      cycleDetection,
    ),
    branch(
      ['"mst"', '"kruskal"', '"minimum spanning"', '"connect cities"', '"min cost"'],
      '→ Minimum Spanning Tree',
      'Build MST using Kruskal\'s algorithm with DSU.',
      mst,
    ),
    branch(
      ['"equivalence"', '"equation"', '"similar"', '"account merge"', '"group"'],
      '→ Equivalence Relationships',
      'Group elements by equivalence or similarity relations.',
      equivRelations,
    ),
  ],
)

// ── Advanced Applications (step 2) ──────────────────────────────

const dynamicGraph: TaxonomyNode = decision(
  'dynamic-graph-step3',
  'Dynamic Graph Problems — graphs that change over time?',
  'orange',
  3,
  'Graph problems with dynamic changes. Which scenario?',
  [
    branch(
      ['"online query"', '"offline query"', '"limited path"', '"sort threshold"'],
      'Online Queries',
      'Answer queries by sorting them with edges and processing incrementally.',
      L.onlineQueriesLeaf,
    ),
    branch(
      ['"edge addition"', '"edge removal"', '"reverse"', '"malware"', '"traversable"'],
      'Edge Addition / Removal',
      'Handle edge removals by reversing operations (additions become unions).',
      L.edgeAddRemLeaf,
    ),
    branch(
      ['"time"', '"timestamp"', '"version"', '"time-based"', '"active time"'],
      'Time-Based Connectivity',
      'Edges have time-to-live; answer time-specific connectivity queries.',
      L.timeConnectivityLeaf,
    ),
  ],
)

const gridProblems: TaxonomyNode = decision(
  'grid-step3',
  'Grid-Based Problems — 2D matrix applications of DSU?',
  'lime',
  3,
  'Solving grid problems with DSU. Which type?',
  [
    branch(
      ['"island"', '"number of islands"', '"land"', '"water"', '"grid islands"'],
      'Island Problems',
      'Count or track islands in a grid. Flatten 2D to 1D indices.',
      L.islandLeaf,
    ),
    branch(
      ['"grid connectivity"', '"same value"', '"region"', '"closed island"'],
      'Grid Connectivity',
      'Check connectivity or detect regions in a grid.',
      L.gridConnectivityLeaf,
    ),
    branch(
      ['"percolation"', '"valid path"', '"street"', '"grid path"', '"flow"'],
      'Percolation',
      'Determine if a valid path exists through connected grid cells.',
      L.percolationLeaf,
    ),
  ],
)

const partitionProblems: TaxonomyNode = decision(
  'partition-step3',
  'Partition Problems — divide elements into groups?',
  'pink',
  3,
  'Partitioning elements into sets. Which type?',
  [
    branch(
      ['"set partition"', '"swaps"', '"partition"', '"group elements"', '"smallest string"'],
      'Set Partitioning',
      'Partition elements based on grouping constraints.',
      L.setPartitioningLeaf,
    ),
    branch(
      ['"bipartite"', '"graph coloring"', '"two color"', '"odd cycle"'],
      'Graph Coloring',
      'Check bipartiteness by expanding DSU to 2n nodes.',
      L.graphColoringLeaf,
    ),
    branch(
      ['"network"', '"malware"', '"infection"', '"spread"', '"partition network"'],
      'Network Partition',
      'Minimize spread in a network by analyzing component infection counts.',
      L.networkPartitionLeaf,
    ),
  ],
)

const mathApplications: TaxonomyNode = decision(
  'math-step3',
  'Mathematical Applications — DSU for math problems?',
  'amber',
  3,
  'Mathematical uses of DSU. Which domain?',
  [
    branch(
      ['"number theory"', '"factor"', '"gcd"', '"prime"', '"common factor"', '"threshold"'],
      'Number Theory Applications',
      'Union numbers sharing common prime factors; sieve-based DSU.',
      L.numberTheoryLeaf,
    ),
    branch(
      ['"matrix"', '"rank"', '"transform"', '"matrix rank"'],
      'Matrix Operations',
      'Assign ranks to matrix cells by grouping same-value cells in rows/cols.',
      L.matrixOpsLeaf,
    ),
    branch(
      ['"equation system"', '"division"', '"ratio"', '"weighted equation"'],
      'Equation System Solving',
      'Solve systems of ratio equations using weighted DSU.',
      L.equationSystemLeaf,
    ),
  ],
)

const advancedApplications: TaxonomyNode = decision(
  'adv-apps-uf-step2',
  'Advanced Applications',
  'orange',
  2,
  'Advanced DSU applications: dynamic graphs, grids, partitions, math. Pick ONE:',
  [
    branch(
      ['"dynamic graph"', '"online"', '"offline"', '"time"', '"edge addition"', '"reverse"'],
      '→ Dynamic Graph Problems',
      'Graphs that change: online queries, edge removal, time-based.',
      dynamicGraph,
    ),
    branch(
      ['"grid"', '"island"', '"matrix"', '"2d"', '"connected grid"', '"percolation"'],
      '→ Grid-Based Problems',
      '2D grid problems using DSU with coordinate flattening.',
      gridProblems,
    ),
    branch(
      ['"partition"', '"set"', '"bipartite"', '"coloring"', '"network"', '"malware"'],
      '→ Partition Problems',
      'Partition elements: set partitioning, graph coloring, network analysis.',
      partitionProblems,
    ),
    branch(
      ['"number theory"', '"factor"', '"matrix rank"', '"equation"', '"division"', '"math"'],
      '→ Mathematical Applications',
      'DSU applied to number theory, matrix operations, and equation systems.',
      mathApplications,
    ),
  ],
)

// ── Union Find Variations (step 2) ──────────────────────────────

const weightedUnion: TaxonomyNode = decision(
  'weighted-step3',
  'Weighted Union Find — associate weights with elements/edges?',
  'green',
  3,
  'Weighted DSU variants. Which weight-tracking strategy?',
  [
    branch(
      ['"edge weight"', '"weight tracking"', '"distance"', '"limited path"'],
      'Edge Weight Tracking',
      'Track additive or multiplicative weights along edges in DSU.',
      L.edgeWeightLeaf,
    ),
    branch(
      ['"union by weight"', '"sort by weight"', '"min effort"', '"min max"'],
      'Union by Weight',
      'Sort edges by weight; union incrementally for min-max path problems.',
      L.unionByWeightLeaf,
    ),
    branch(
      ['"path weight"', '"ratio"', '"division"', '"cumulative"', '"path value"'],
      'Path Weights',
      'Track cumulative weight/ratio from node to root during find.',
      L.pathWeightsLeaf,
    ),
  ],
)

const incrementalUnion: TaxonomyNode = decision(
  'incremental-step3',
  'Incremental Union Find — add elements/edges over time?',
  'pink',
  3,
  'DSU that grows incrementally. Which variant?',
  [
    branch(
      ['"online"', '"incremental"', '"add positions"', '"islands ii"', '"live"'],
      'Online Algorithm',
      'Add elements one by one; track component count after each addition.',
      L.onlineAlgorithmLeaf,
    ),
    branch(
      ['"persistent"', '"version"', '"history"', '"snapshot"', '"time travel"'],
      'Persistent Union Find',
      'Maintain history of union operations for versioning/rollback.',
      L.persistentUfLeaf,
    ),
    branch(
      ['"reversible"', '"undo"', '"rollback"', '"revert"', '"backtrack"'],
      'Reversible Union Find',
      'Support full undo/rollback via operation stack.',
      L.reversibleUfLeaf,
    ),
  ],
)

const customLogic: TaxonomyNode = decision(
  'custom-logic-step3',
  'Union Find with Custom Logic — specialized DSU modifications?',
  'teal',
  3,
  'Custom modifications to standard DSU. Which approach?',
  [
    branch(
      ['"multiple"', '"two dsu"', '"alice bob"', '"separate instances"'],
      'Multiple Union Find Structures',
      'Maintain separate DSUs for different constraint types or players.',
      L.multiUfStructLeaf,
    ),
    branch(
      ['"lazy"', '"deferred"', '"delayed"', '"on demand"', '"accounts merge"'],
      'Lazy Union Find',
      'Defer DSU construction until elements are discovered dynamically.',
      L.lazyUfLeaf,
    ),
    branch(
      ['"level"', '"threshold"', '"effort"', '"min max"', '"level based"'],
      'Level-Based Union Find',
      'Process edges sorted by level/threshold; union until condition met.',
      L.levelBasedUfLeaf,
    ),
  ],
)

const unionVariations: TaxonomyNode = decision(
  'union-vars-step2',
  'Union Find Variations',
  'purple',
  2,
  'DSU variants: weighted, incremental, or custom logic. Pick ONE:',
  [
    branch(
      ['"weighted"', '"weight"', '"distance"', '"ratio"', '"edge weight"', '"min effort"'],
      '→ Weighted Union Find',
      'Track weights or ratios between elements in DSU.',
      weightedUnion,
    ),
    branch(
      ['"incremental"', '"online"', '"persistent"', '"reversible"', '"snapshot"', '"undo"'],
      '→ Incremental Union Find',
      'DSU with versioning, undo, or online element addition.',
      incrementalUnion,
    ),
    branch(
      ['"custom"', '"multiple dsu"', '"lazy"', '"level"', '"threshold"', '"specialized"'],
      '→ Union Find with Custom Logic',
      'Specialized DSU modifications for specific problem domains.',
      customLogic,
    ),
  ],
)

// ── Root Decision (step 1) ─────────────────────────────────────

export const ufRoot: TaxonomyNode = decision(
  'uf-root',
  'Union Find Pattern',
  'slate',
  1,
  'Union Find (Disjoint Set Union): dynamic connectivity with near-constant operations. Which domain?',
  [
    branch(
      ['"union find"', '"dsu"', '"disjoint set"', '"find"', '"union"', '"parent"', '"init"', '"path compression"'],
      '→ Basic Union Find Operations',
      'Core DSU: initialization, find, union, and optimizations.',
      basicUnionFind,
      ['graph applications', 'advanced dsu variants'],
    ),
    branch(
      ['"graph"', '"component"', '"cycle"', '"mst"', '"kruskal"', '"equivalence"', '"equation"', '"account merge"'],
      '→ Graph Problems',
      'Graph problems: components, cycles, MST, equivalence relations.',
      graphProblems,
    ),
    branch(
      ['"dynamic graph"', '"grid"', '"island"', '"partition"', '"bipartite"', '"number theory"', '"matrix"'],
      '→ Advanced Applications',
      'Advanced: dynamic graphs, grids, partitioning, mathematical applications.',
      advancedApplications,
      ['basic dsu setup'],
    ),
    branch(
      ['"weighted"', '"persistent"', '"reversible"', '"incremental"', '"custom dsu"', '"lazy"', '"level"'],
      '→ Union Find Variations',
      'DSU variants: weighted, incremental, persistent, or custom logic.',
      unionVariations,
    ),
  ],
)
