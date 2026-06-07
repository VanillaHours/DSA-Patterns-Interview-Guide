import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Dynamic connectivity — merging components over time',
    'Find if two elements belong to the same set',
    'Cycle detection in undirected graphs',
    'Connected component counting',
    'Equation satisfaction with equality constraints',
  ],
  whenAtThisStep: 'Confirm DSU fits: managing disjoint sets with union/find, near-constant time per operation.',
  xray: [
    { text: '**dynamic connectivity** — add edges/relations, then answer queries', kind: 'signal' },
    { text: '**cycle detection** — merge edge endpoints; cycle if already same set', kind: 'signal' },
    { text: '**MST / Kruskal** — sort edges by weight; union if no cycle', kind: 'signal' },
    { text: '**grouping** — elements sharing a common property', kind: 'goal' },
    { text: '**path compression** and **union by rank** optimizations', kind: 'constraint' },
    { text: 'near **O(α(n))** per operation with optimizations', kind: 'constraint' },
  ],
  budget: ['union find', 'disjoint set', 'dsu', 'find', 'union', 'path compression', 'union by rank'],
  sayIt: [
    'Do we need dynamic connectivity (union/find on disjoint sets)?',
    'Is the problem about merging groups or detecting cycles in an undirected graph?',
    'Could this be solved with a union-find data structure for near-constant operations?',
    'Is it a minimum spanning tree or equation satisfaction problem?',
  ],
  branchGuides: {
    'basic-uf-step2': {
      proceed: 'WHEN: core DSU operations — initialization, find, union, optimizations',
    },
    'graph-probs-uf-step2': {
      proceed: 'WHEN: graph applications — components, cycles, MST, equivalence relations',
    },
    'adv-apps-uf-step2': {
      proceed: 'WHEN: advanced — dynamic graphs, grids, partitions, math',
    },
    'union-vars-step2': {
      proceed: 'WHEN: DSU variants — weighted, persistent, reversible, custom logic',
    },
  },
  notThisPattern: [
    { signal: 'DFS/BFS connectivity in static graph', actually: 'Use graph traversal pattern — DFS is simpler for static graphs' },
    { signal: 'Simple set membership without unions', actually: 'Use hash set — O(1) membership check without DSU overhead' },
  ],
  misidentify: [
    {
      cause: 'Using DSU where static DFS/BFS suffices',
      wrong: 'Build DSU for one-time connectivity check',
      testCase: 'Check if two nodes are connected in a static graph',
      fix: 'Use DFS/BFS for single connectivity queries in static graphs',
    },
    {
      cause: 'Over-engineering with weighted DSU for simple grouping',
      wrong: 'Implement ratio tracking for basic union of accounts',
      testCase: 'Accounts merge — just need basic union with element mapping',
      fix: 'Start with basic DSU; add weights only when ratio queries are needed',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'uf-root': d({
    whenAtThisStep: 'You identified DSU as the tool. Now narrow down the domain.',
    xray: [
      { text: '**basic operations**: init, find, union, path compression, union by rank', kind: 'signal' },
      { text: '**graph problems**: components, cycles, MST, equivalence', kind: 'signal' },
      { text: '**advanced applications**: dynamic graphs, grids, partitions, math', kind: 'signal' },
      { text: '**variations**: weighted, persistent, reversible, custom DSU', kind: 'signal' },
    ],
    budget: ['basic ops', 'graph problems', 'advanced apps', 'variations'],
    sayIt: ['Core operations, graph problems, advanced applications, or DSU variants?'],
    branchGuides: {
      'basic-uf-step2': { proceed: 'yes — core DSU: init, find, union, optimize' },
      'graph-probs-uf-step2': { proceed: 'yes — graph problem: components, cycles, MST, equivalence' },
      'adv-apps-uf-step2': { proceed: 'yes — advanced: dynamic graphs, grids, partitions, math' },
      'union-vars-step2': { proceed: 'yes — DSU variant: weighted, incremental, custom logic' },
    },
    notThisPattern: [
      { signal: 'Static connectivity, no updates', actually: 'Use DFS/BFS graph traversal' },
    ],
  }),

  'basic-uf-step2': d({
    whenAtThisStep: 'Core DSU operations. Which operation or optimization?',
    xray: [
      { text: '**initialization**: array, tree, or custom element mapping', kind: 'signal' },
      { text: '**find**: basic, path compression, path splitting/halving', kind: 'signal' },
      { text: '**union**: basic, union by rank/size, custom criteria', kind: 'signal' },
      { text: '**optimizations**: PC+rank, size tracking, dynamic addition', kind: 'signal' },
    ],
    budget: ['init', 'find', 'union', 'optimize'],
    sayIt: ['Setting up DSU, finding roots, merging sets, or optimizing performance?'],
    branchGuides: {
      'init-step3': { proceed: 'yes — set up the DSU representation' },
      'find-step3': { proceed: 'yes — find the set representative' },
      'union-step3': { proceed: 'yes — merge two sets' },
      'data-struct-opt-step3': { proceed: 'yes — optimize DSU performance' },
    },
    notThisPattern: [
      { signal: 'Graph-level problem, not DSU internals', actually: 'Use graph problems family' },
    ],
  }),

  'init-step3': d({
    whenAtThisStep: 'Setting up DSU. Which representation?',
    xray: [
      { text: '**array**: parent[i] = i, classic fixed-size DSU', kind: 'signal' },
      { text: '**tree**: explicit Node* objects, flexible', kind: 'signal' },
      { text: '**custom map**: strings → indices via unordered_map', kind: 'signal' },
    ],
    budget: ['array', 'tree', 'custom map'],
    sayIt: ['Simple array, explicit tree nodes, or custom element mapping via hash map?'],
    branchGuides: {
      'array-rep-uf': { proceed: 'array: parent[i] = i, fixed-size — most common (LC 547)' },
      'tree-rep-uf': { proceed: 'tree: explicit Node* objects for dynamic sets (LC 684)' },
      'custom-map-uf': { proceed: 'custom mapping: strings → indices (LC 721)' },
    },
    notThisPattern: [
      { signal: 'Already have a DSU, no init needed', actually: 'Use find/union operations' },
    ],
  }),

  'find-step3': d({
    whenAtThisStep: 'Finding set representative. Which find variant?',
    xray: [
      { text: '**basic**: iterative while parent[x] != x', kind: 'signal' },
      { text: '**path compression**: recursive, sets parent to root', kind: 'signal' },
      { text: '**path splitting/halving**: iterative compression', kind: 'signal' },
    ],
    budget: ['basic find', 'path compression', 'path splitting'],
    sayIt: ['Simple iterative find, recursive path compression, or iterative path splitting?'],
    branchGuides: {
      'basic-find-uf': { proceed: 'basic: while loop to root (LC 547)' },
      'path-compression-uf': { proceed: 'path compression: recursive, O(α(n)) (LC 684, 128)' },
      'path-splitting-uf': { proceed: 'path splitting: iterative alternative to recursion' },
    },
    notThisPattern: [
      { signal: 'Need to merge sets', actually: 'Use union operation' },
    ],
  }),

  'union-step3': d({
    whenAtThisStep: 'Merging sets. Which union strategy?',
    xray: [
      { text: '**basic**: parent[ra] = rb, no balancing', kind: 'signal' },
      { text: '**union by rank/size**: attach smaller under larger', kind: 'signal' },
      { text: '**custom criteria**: problem-specific merge logic', kind: 'signal' },
    ],
    budget: ['basic union', 'union by rank', 'custom union'],
    sayIt: ['Simple union, union by rank/size, or custom merge criteria?'],
    branchGuides: {
      'basic-union-uf': { proceed: 'basic: parent[ra] = rb — simple (LC 547)' },
      'union-rank-uf': { proceed: 'union by rank/size: balanced merge (LC 684, 1202)' },
      'union-custom-uf': { proceed: 'custom: problem-specific criteria (LC 1632)' },
    },
    notThisPattern: [
      { signal: 'Only finding roots', actually: 'Use find operation' },
    ],
  }),

  'data-struct-opt-step3': d({
    whenAtThisStep: 'Optimizing DSU. Which technique?',
    xray: [
      { text: '**PC + union by rank**: full optimization, O(α(n))', kind: 'signal' },
      { text: '**size tracking**: sz[root] for component queries', kind: 'signal' },
      { text: '**dynamic addition**: add elements at runtime', kind: 'signal' },
    ],
    budget: ['pc+rank', 'size tracking', 'dynamic add'],
    sayIt: ['Full path compression + rank, size tracking for component info, or dynamic element addition?'],
    branchGuides: {
      'pc-ranked-uf': { proceed: 'PC + rank: fully optimized (LC 684, 1202)' },
      'size-tracking-uf': { proceed: 'size tracking: component sizes (LC 323, 952)' },
      'dynamic-add-uf': { proceed: 'dynamic addition: resize at runtime (LC 721, 1697)' },
    },
    notThisPattern: [
      { signal: 'No optimization needed for small n', actually: 'Use basic DSU' },
    ],
  }),

  'graph-probs-uf-step2': d({
    whenAtThisStep: 'Graph problem solved with DSU. Which category?',
    xray: [
      { text: '**components**: count, track properties, dynamic connectivity', kind: 'signal' },
      { text: '**cycles**: detect in undirected/directed/grid graphs', kind: 'signal' },
      { text: '**MST**: Kruskal, critical edge classification', kind: 'signal' },
      { text: '**equivalence**: string grouping, equations, classification', kind: 'signal' },
    ],
    budget: ['components', 'cycles', 'mst', 'equivalence'],
    sayIt: ['Connected components, cycle detection, minimum spanning tree, or equivalence relations?'],
    branchGuides: {
      'connected-comps-step3': { proceed: 'yes — connected components' },
      'cycle-det-step3': { proceed: 'yes — cycle detection with DSU' },
      'mst-step3': { proceed: 'yes — minimum spanning tree (Kruskal)' },
      'equiv-rel-step3': { proceed: 'yes — equivalence relationships' },
    },
    notThisPattern: [
      { signal: 'Internal DSU setup, not graph problem', actually: 'Use basic DSU operations' },
    ],
  }),

  'connected-comps-step3': d({
    whenAtThisStep: 'Working with connected components. Which aspect?',
    xray: [
      { text: '**counting**: decrement counter per successful union', kind: 'signal' },
      { text: '**properties**: size, sum, max per component', kind: 'signal' },
      { text: '**dynamic**: incremental edges, query connectivity', kind: 'signal' },
    ],
    budget: ['count', 'properties', 'dynamic'],
    sayIt: ['Counting components, tracking component properties, or dynamic connectivity queries?'],
    branchGuides: {
      'counting-components-uf': { proceed: 'count: decrement on each union (LC 547, 323, 200)' },
      'component-props-uf': { proceed: 'properties: track size per root (LC 952, 1319)' },
      'dynamic-connect-uf': { proceed: 'dynamic: lockstep edge/query processing (LC 305, 1627)' },
    },
    notThisPattern: [
      { signal: 'Component counting via DFS/BFS', actually: 'Use graph traversal for static counting' },
    ],
  }),

  'cycle-det-step3': d({
    whenAtThisStep: 'Detecting cycles. Which graph type?',
    xray: [
      { text: '**undirected**: edge forms cycle if same component', kind: 'signal' },
      { text: '**directed**: DSU + in-degree tracking', kind: 'signal' },
      { text: '**grid**: flatten 2D coordinates, union adjacent', kind: 'signal' },
    ],
    budget: ['undirected', 'directed', 'grid'],
    sayIt: ['Undirected graph, directed graph (with in-degree), or grid-based cycle detection?'],
    branchGuides: {
      'undirected-cycle-uf': { proceed: 'undirected: simple DSU check (LC 684, 261)' },
      'directed-cycle-uf': { proceed: 'directed: DSU + in-degree (LC 685)' },
      'cycle-classify-uf': { proceed: 'grid: flattened coordinates (LC 1559)' },
    },
    notThisPattern: [
      { signal: 'No cycle, just need connectivity', actually: 'Use connected components' },
    ],
  }),

  'mst-step3': d({
    whenAtThisStep: 'Minimum spanning tree analysis. Which aspect?',
    xray: [
      { text: '**Kruskal**: sort edges by weight; union incrementally', kind: 'signal' },
      { text: '**critical edges**: classify as critical/pseudo-critical', kind: 'signal' },
    ],
    budget: ['kruskal', 'critical edges'],
    sayIt: ['Build MST with Kruskal, or classify edges as critical/pseudo-critical?'],
    branchGuides: {
      'kruskal-uf': { proceed: 'Kruskal: sort edges, union MST (LC 1584, 1135)' },
      'critical-edges-uf': { proceed: 'critical: force include/exclude each edge (LC 1489)' },
    },
    notThisPattern: [
      { signal: 'Not MST, just connectivity', actually: 'Use connected components' },
    ],
  }),

  'equiv-rel-step3': d({
    whenAtThisStep: 'Equivalence relations. Which type?',
    xray: [
      { text: '**string/account**: merge accounts by shared emails', kind: 'signal' },
      { text: '**equation**: == and != constraint feasibility', kind: 'signal' },
      { text: '**classification**: group by similarity criteria', kind: 'signal' },
    ],
    budget: ['string grouping', 'equation sat', 'classification'],
    sayIt: ['Account/string merging, equation satisfaction, or similarity-based classification?'],
    branchGuides: {
      'string-grouping-uf': { proceed: 'string: union by shared emails/strings (LC 721, 737)' },
      'equation-sat-uf': { proceed: 'equation: == then != feasibility (LC 990, 1579)' },
      'node-classify-uf': { proceed: 'classification: similarity-based grouping (LC 839)' },
    },
    notThisPattern: [
      { signal: 'Need component counting, not equivalence', actually: 'Use connected components' },
    ],
  }),

  'adv-apps-uf-step2': d({
    whenAtThisStep: 'Advanced DSU applications. Which domain?',
    xray: [
      { text: '**dynamic graphs**: online/offline queries, edge removal, time-based', kind: 'signal' },
      { text: '**grids**: islands, connectivity, percolation', kind: 'signal' },
      { text: '**partition**: set partitioning, bipartite, network', kind: 'signal' },
      { text: '**math**: number theory, matrix rank, equations', kind: 'signal' },
    ],
    budget: ['dynamic graph', 'grid', 'partition', 'math'],
    sayIt: ['Dynamic graph problems, grid-based DSU, partition problems, or mathematical applications?'],
    branchGuides: {
      'dynamic-graph-step3': { proceed: 'yes — dynamic graph: queries, removal, time' },
      'grid-step3': { proceed: 'yes — grid: islands, connectivity, percolation' },
      'partition-step3': { proceed: 'yes — partition: sets, bipartite, network' },
      'math-step3': { proceed: 'yes — math: number theory, matrix, equations' },
    },
    notThisPattern: [
      { signal: 'Simple component counting', actually: 'Use graph problems family' },
    ],
  }),

  'dynamic-graph-step3': d({
    whenAtThisStep: 'Dynamic graph problems. Which scenario?',
    xray: [
      { text: '**online queries**: sort by threshold, incremental union', kind: 'signal' },
      { text: '**edge addition/removal**: reverse processing for removals', kind: 'signal' },
      { text: '**time-based**: edges with time-to-live', kind: 'signal' },
    ],
    budget: ['online queries', 'edge add/rem', 'time-based'],
    sayIt: ['Offline queries sorted by threshold, reverse-processing for edge removal, or time-windowed connectivity?'],
    branchGuides: {
      'online-queries-uf': { proceed: 'online: sort queries + edges by threshold (LC 1697, 305)' },
      'edge-add-rem-uf': { proceed: 'edge add/rem: reverse process for removals (LC 1579, 924)' },
      'time-connectivity-uf': { proceed: 'time: edges with time windows (LC 1724)' },
    },
    notThisPattern: [
      { signal: 'Static graph, no dynamic changes', actually: 'Use graph problems > connected components' },
    ],
  }),

  'grid-step3': d({
    whenAtThisStep: 'Grid-based DSU problems. Which type?',
    xray: [
      { text: '**islands**: count via coordinate flattening', kind: 'signal' },
      { text: '**connectivity**: check connected same-value regions', kind: 'signal' },
      { text: '**percolation**: valid path through connected cells', kind: 'signal' },
    ],
    budget: ['islands', 'grid connectivity', 'percolation'],
    sayIt: ['Island counting, region connectivity checking, or path/percolation problems?'],
    branchGuides: {
      'island-uf': { proceed: 'islands: flatten 2D → 1D, union land (LC 200, 305)' },
      'grid-connectivity-uf': { proceed: 'connectivity: same-value regions (LC 1559, 1254)' },
      'percolation-uf': { proceed: 'percolation: valid street path (LC 1391)' },
    },
    notThisPattern: [
      { signal: 'Not grid-based', actually: 'Use other DSU domain' },
    ],
  }),

  'partition-step3': d({
    whenAtThisStep: 'Partition problems with DSU. Which type?',
    xray: [
      { text: '**set partitioning**: union then group by root', kind: 'signal' },
      { text: '**graph coloring**: bipartite via 2n DSU', kind: 'signal' },
      { text: '**network partition**: infection spread analysis', kind: 'signal' },
    ],
    budget: ['set partition', 'graph coloring', 'network partition'],
    sayIt: ['Set partitioning (union + group), bipartite graph coloring, or network infection analysis?'],
    branchGuides: {
      'set-partitioning-uf': { proceed: 'set: group by root after unions (LC 1202, 399)' },
      'graph-coloring-uf': { proceed: 'coloring: 2n DSU for bipartite (LC 785)' },
      'network-partition-uf': { proceed: 'network: infection count per component (LC 924)' },
    },
    notThisPattern: [
      { signal: 'Component counting, not partition analysis', actually: 'Use connected components' },
    ],
  }),

  'math-step3': d({
    whenAtThisStep: 'Mathematical DSU applications. Which domain?',
    xray: [
      { text: '**number theory**: union by shared prime factors', kind: 'signal' },
      { text: '**matrix**: rank transform via same-value grouping', kind: 'signal' },
      { text: '**equation systems**: weighted DSU for ratios', kind: 'signal' },
    ],
    budget: ['number theory', 'matrix', 'equation'],
    sayIt: ['Number theory (shared factors), matrix rank transform, or equation system solving?'],
    branchGuides: {
      'number-theory-uf': { proceed: 'number theory: union by prime factors (LC 952, 1627)' },
      'matrix-ops-uf': { proceed: 'matrix: DSU for rank transform (LC 1632)' },
      'equation-system-uf': { proceed: 'equation: weighted DSU for ratios (LC 990, 399)' },
    },
    notThisPattern: [
      { signal: 'Standard connectivity, not math', actually: 'Use graph problems' },
    ],
  }),

  'union-vars-step2': d({
    whenAtThisStep: 'DSU variants. Which variation?',
    xray: [
      { text: '**weighted**: edge weights, ratios, min-effort paths', kind: 'signal' },
      { text: '**incremental**: online, persistent, reversible DSU', kind: 'signal' },
      { text: '**custom logic**: multiple DSUs, lazy, level-based', kind: 'signal' },
    ],
    budget: ['weighted', 'incremental', 'custom'],
    sayIt: ['Weighted DSU (weights/ratios), incremental (persistent/undo), or custom logic (multi-DSU/lazy/level)?'],
    branchGuides: {
      'weighted-step3': { proceed: 'yes — weighted: edge weights, ratios, min-effort' },
      'incremental-step3': { proceed: 'yes — incremental: online, persistent, reversible' },
      'custom-logic-step3': { proceed: 'yes — custom: multi-DSU, lazy, level-based' },
    },
    notThisPattern: [
      { signal: 'Standard DSU operations', actually: 'Use basic union find operations' },
    ],
  }),

  'weighted-step3': d({
    whenAtThisStep: 'Weighted DSU. Which weight strategy?',
    xray: [
      { text: '**edge weight**: additive/multiplicative edge tracking', kind: 'signal' },
      { text: '**union by weight**: sort edges, incremental union', kind: 'signal' },
      { text: '**path weights**: cumulative ratio to root', kind: 'signal' },
    ],
    budget: ['edge weight', 'union by weight', 'path weights'],
    sayIt: ['Track edge weights, union by weight for min-max paths, or path ratio accumulation?'],
    branchGuides: {
      'edge-weight-uf': { proceed: 'edge weight: track distances/ratios (LC 1697, 1584)' },
      'union-weight-uf': { proceed: 'union by weight: sort edges (LC 1631)' },
      'path-weights-uf': { proceed: 'path weights: ratio to root (LC 399)' },
    },
    notThisPattern: [
      { signal: 'No weight tracking needed', actually: 'Use basic DSU' },
    ],
  }),

  'incremental-step3': d({
    whenAtThisStep: 'Incremental DSU. Which variant?',
    xray: [
      { text: '**online**: add elements one by one, track state', kind: 'signal' },
      { text: '**persistent**: maintain history for revisiting states', kind: 'signal' },
      { text: '**reversible**: full undo via operation stack', kind: 'signal' },
    ],
    budget: ['online', 'persistent', 'reversible'],
    sayIt: ['Online element addition, persistent DSU with history, or fully reversible DSU with undo?'],
    branchGuides: {
      'online-algorithm-uf': { proceed: 'online: add elements incrementally (LC 305)' },
      'persistent-uf': { proceed: 'persistent: maintain history for rollback' },
      'reversible-uf': { proceed: 'reversible: full undo via operation stack' },
    },
    notThisPattern: [
      { signal: 'No versioning or undo needed', actually: 'Use basic DSU' },
    ],
  }),

  'custom-logic-step3': d({
    whenAtThisStep: 'Custom DSU logic. Which approach?',
    xray: [
      { text: '**multiple DSUs**: separate instances per constraint type', kind: 'signal' },
      { text: '**lazy**: deferred construction until element discovery', kind: 'signal' },
      { text: '**level-based**: process edges sorted by threshold', kind: 'signal' },
    ],
    budget: ['multi-dsu', 'lazy', 'level-based'],
    sayIt: ['Multiple DSU instances for different constraints, lazy element creation, or level-based threshold processing?'],
    branchGuides: {
      'multi-uf-struct-uf': { proceed: 'multi-DSU: separate instances (LC 1579)' },
      'lazy-uf': { proceed: 'lazy: deferred construction (LC 721)' },
      'level-based-uf': { proceed: 'level: sort by threshold, union incrementally (LC 1631)' },
    },
    notThisPattern: [
      { signal: 'Standard single DSU is fine', actually: 'Use basic DSU operations' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
