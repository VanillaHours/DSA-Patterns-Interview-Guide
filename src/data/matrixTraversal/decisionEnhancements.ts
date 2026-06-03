import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even a Matrix Traversal? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Input is a 2D grid/matrix (vector<vector<int>>, vector<vector<char>>)',
    'You need to explore, traverse, or transform cells in a grid',
    'Problem involves connectivity, paths, or regions on a grid',
    'Traversal order is non-standard (spiral, diagonal, rotating layers)',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does the problem traverse or transform a 2D grid?',
  xray: [
    { text: 'Given an **m x n grid** of characters / integers', kind: 'signal' },
    { text: 'Return the number of **islands** / connected regions', kind: 'goal' },
    { text: 'Find the **shortest path** from entrance to exit', kind: 'goal' },
    { text: 'Return elements in **spiral order**', kind: 'goal' },
    { text: '**Rotate** the image **in-place**', kind: 'goal' },
  ],
  budget: ['grid2d', 'dfsGrid', 'bfsGrid', 'shortestPath', 'spiral', 'rotate'],
  sayIt: [
    'Before any template: is this a 2D grid traversal?',
    'If yes — is it DFS (region/backtrack), BFS (shortest path/spread), or specialized (diagonal/spiral/rotate)?',
    'If single cell movement with distance counting, consider BFS.',
    'If exploring connected regions, consider DFS.',
    'If non-standard order (spiral, diagonal), pick specialized.',
  ],
  branchGuides: {
    'grid-dfs-step2': {
      proceed: 'WHEN: recursive exploration — islands, word search, flood fill, unique paths',
      whenExtra: ['island', 'word search', 'flood fill', 'unique paths'],
    },
    'grid-bfs-step2': {
      proceed: 'WHEN: level-order traversal, shortest distance, multi-source spread',
      whenExtra: ['shortest path', 'rotting oranges', 'nearest exit'],
    },
    'specialized-step2': {
      proceed: 'WHEN: non-standard order — diagonal, spiral, or in-place transform (rotate)',
      whenExtra: ['diagonal', 'spiral', 'rotate'],
    },
  },
  notThisPattern: [
    { signal: '"number of provinces" / graph adjacency matrix', actually: 'Graph traversal on adjacency matrix, not grid cell exploration' },
    { signal: '"matrix" of distances / DP table on grid', actually: 'Dynamic programming — tabulation, not traversal' },
    { signal: '"range sum query 2D"', actually: '2D prefix sum, not traversal' },
    { signal: '"search in 2D matrix" (sorted row/col)', actually: 'Binary search or divide-and-conquer on 2D matrix, not traversal' },
  ],
  misidentify: [
    {
      cause: 'Input is 2D array but problem is really about DP or prefix sum',
      wrong: 'Jump to DFS/BFS traversal',
      testCase: 'Min path sum / unique paths with DP',
      fix: 'Check if problem asks for optimal substructure (DP) — if so, it is not traversal.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'matrix-root': PATTERN_GATE,

  'grid-dfs-step2': d({
    whenAtThisStep: 'You confirmed grid traversal + recursive DFS cell exploration.',
    xray: [
      { text: 'Connected **islands** / regions', kind: 'goal' },
      { text: '**Word search** / string path on grid', kind: 'goal' },
      { text: '**Flood fill** / replace color region', kind: 'goal' },
      { text: '**Unique paths** / count routes', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid'],
    sayIt: [
      'DFS on grid: island sink, word backtrack, flood fill replace, or path count.',
    ],
    branchGuides: {
      'island-region-step3': { proceed: 'WHEN: count or modify connected regions (200, 695, 130, 417)' },
      'path-route-step3': { proceed: 'WHEN: find word path or count unique paths (79, 212, 62, 980)' },
      'flood-fill-step3': { proceed: 'WHEN: replace connected same-color region (733, 1034)' },
    },
  }),

  'island-region-step3': d({
    whenAtThisStep: 'Grid of chars — islands or region modification.',
    xray: [
      { text: '**Number of islands** / count \'1\' groups', kind: 'goal' },
      { text: '**Max area** of island', kind: 'goal' },
      { text: '**Surrounded regions** / flip O→X', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'island'],
    sayIt: ['Count islands → DFS sink. Region modify → border DFS first.'],
    branchGuides: {
      'island-count': { proceed: 'WHEN: count / max connected regions with same char' },
      'region-modify': { proceed: 'WHEN: modify regions based on border connectivity' },
    },
  }),

  'path-route-step3': d({
    whenAtThisStep: 'Find or count paths through grid cells.',
    xray: [
      { text: '**Word search** — does word exist?', kind: 'goal' },
      { text: '**Unique paths** — count ways from TL to BR', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'backtrack', 'memoGrid'],
    sayIt: ['Word search → DFS backtrack. Unique paths → DFS + memo.'],
    branchGuides: {
      'backtrack-path': { proceed: 'WHEN: find string path via backtrack (79, 212)' },
      'unique-path': { proceed: 'WHEN: count paths with memo (62, 980)' },
    },
  }),

  'flood-fill-step3': d({
    whenAtThisStep: 'Replace connected same-color region with new color.',
    xray: [
      { text: 'Perform a **flood fill** on the image', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'colorFill'],
    sayIt: ['Flood fill = DFS replace + early return for same color.'],
    branchGuides: {
      'flood-fill': { proceed: 'WHEN: standard paint bucket replacement (733)' },
    },
  }),

  'grid-bfs-step2': d({
    whenAtThisStep: 'Grid + queue-based BFS exploration.',
    xray: [
      { text: '**Shortest path** in binary matrix', kind: 'goal' },
      { text: '**Nearest exit** from entrance', kind: 'goal' },
      { text: '**Rotting oranges** / multi-source spread', kind: 'goal' },
    ],
    budget: ['grid2d', 'bfsGrid', 'shortestPath'],
    sayIt: ['BFS on grid: single source distance or multi-source spread.'],
    branchGuides: {
      'shortest-path-step3': { proceed: 'WHEN: single source → shortest distance (1091, 1926, 1293)' },
      'grid-multi-source': { proceed: 'WHEN: multiple sources simultaneously (994, 1162)' },
    },
  }),

  'shortest-path-step3': d({
    whenAtThisStep: 'Single source BFS for shortest distance in grid.',
    xray: [
      { text: '**Shortest path** in binary matrix (8-dir)', kind: 'goal' },
      { text: '**Obstacle elimination** — at most k removals', kind: 'constraint' },
    ],
    budget: ['bfsGrid', 'shortestPath'],
    sayIt: ['Standard BFS or BFS with state (k eliminations).'],
    branchGuides: {
      'grid-bfs-shortest': { proceed: 'WHEN: standard BFS (1091, 1926)' },
      'grid-bfs-constrained': { proceed: 'WHEN: obstacle elimination with k (1293)' },
    },
  }),

  'specialized-step2': d({
    whenAtThisStep: 'Non-traversal-order problem: diagonal, spiral, rotation.',
    xray: [
      { text: 'Return elements in **diagonal** order', kind: 'goal' },
      { text: 'Return matrix in **spiral** order', kind: 'goal' },
      { text: '**Rotate** matrix 90°', kind: 'goal' },
    ],
    budget: ['grid2d', 'diagonal', 'spiral', 'rotate'],
    sayIt: ['Diagonal → s=i+j. Spiral → shrink boundaries. Rotate → 4-way swap.'],
    branchGuides: {
      diagonal: { proceed: 'WHEN: alternating diagonal traversal (498)' },
      spiral: { proceed: 'WHEN: spiral order reading/writing (54, 59)' },
      'shape-based-step3': { proceed: 'WHEN: transform in-place — rotate or cyclic (48, 1914)' },
    },
  }),

  'shape-based-step3': d({
    whenAtThisStep: 'In-place matrix transformation.',
    xray: [
      { text: '**Rotate** matrix 90° clockwise in-place', kind: 'goal' },
      { text: '**Cyclically rotate** each boundary layer', kind: 'goal' },
    ],
    budget: ['grid2d', 'rotate'],
    sayIt: ['Rotate → 4-way swap. Cyclic → extract layer, rotate 1D, write back.'],
    branchGuides: {
      rotate: { proceed: 'WHEN: 90° rotation in-place (48)' },
      'shape-boundary': { proceed: 'WHEN: cyclic rotation of boundary layers (1914)' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
