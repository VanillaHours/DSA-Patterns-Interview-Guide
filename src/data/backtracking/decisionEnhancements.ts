import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Backtracking? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Generate all / find all / enumerate all arrangements',
    'Try every possibility with prune on invalid',
    'Constraint satisfaction (N-Queens, Sudoku, Word Search)',
    'Optimization with branch-and-bound or memoized DFS',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem need backtracking at all?',
  xray: [
    { text: 'Return **all** possible subsets / permutations / combinations …', kind: 'signal' },
    { text: 'Place **n queens** on an n×n board such that no two attack …', kind: 'goal' },
    { text: 'Return the **maximum gold** you can collect in a path …', kind: 'goal' },
    { text: 'Find the **minimum incompatibility** after distributing …', kind: 'goal' },
  ],
  budget: ['enumerate', 'generate', 'constraintSat', 'pruning', 'memoization', 'minimax'],
  sayIt: [
    'Enumerate all → combinatorial generation.',
    'Satisfy constraints (board, pattern, assignment) → constraint satisfaction.',
    'Explore graph / matrix paths → graph exploration.',
    'Optimize with pruning or memo → optimization with backtracking.',
  ],
  branchGuides: {
    'combinatorial-generation': {
      proceed: 'WHEN: generate all subsets, permutations, strings, or partitions',
      whenExtra: ['subsets', 'combinations', 'permutations', 'parentheses', 'partition'],
    },
    'constraint-satisfaction': {
      proceed: 'WHEN: board placement, pattern matching, or assignment with constraints',
      whenExtra: ['n-queens', 'sudoku', 'word search', 'assignment'],
    },
    'graph-exploration': {
      proceed: 'WHEN: explore all graph paths, color graph vertices, or DFS on matrix',
      whenExtra: ['all paths', 'graph coloring', 'bipartite', 'matrix exploration'],
    },
    'optimization-backtrack': {
      proceed: 'WHEN: maximize/minimize with branch-and-bound, memoization, or minimax',
      whenExtra: ['branch and bound', 'word break', 'game theory', 'predict winner'],
    },
  },
  notThisPattern: [
    { signal: '"maximum subarray" (Kadane)', actually: 'Array Traversal — single pass, no enumeration needed' },
    { signal: '"shortest path in a graph" (Dijkstra)', actually: 'Graph Traversal — BFS / shortest path, not backtracking enumeration' },
    { signal: '"two sum" / "3sum"', actually: 'Two Pointers or Hash Map — not generating arrangements' },
    { signal: '"merge sort" / "quick sort"', actually: 'Sorting pattern — divide and conquer, not backtracking' },
  ],
  misidentify: [
    {
      cause: 'Memoization makes it DP, not backtracking',
      wrong: 'Jump to Dynamic Programming for memoized DFS problems',
      testCase: 'LC 139 Word Break',
      fix: 'Word Break uses DFS + memo, which is backtracking with caching — still a backtracking pattern.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'bt-root': PATTERN_GATE,

  'combinatorial-generation': d({
    whenAtThisStep: 'You need to generate all combinatorial arrangements. Which kind?',
    xray: [
      { text: 'Return all **subsets** / **combinations**', kind: 'goal' },
      { text: 'Return all **permutations**', kind: 'goal' },
      { text: 'Generate **letter combinations** / **parentheses**', kind: 'goal' },
      { text: '**Partition** into valid groups', kind: 'goal' },
    ],
    budget: ['subsets', 'permutations', 'stringGen', 'partition'],
    sayIt: [
      'Subsets/combinations: choose/not-choose or for-loop + recurse.',
      'Permutations: swap-based or used[] array.',
      'String generation: map digits or enforce structural rules.',
      'Partition: for-loop on split points.',
    ],
    branchGuides: {
      'subsets-combos': { proceed: 'WHEN: subsets or combinations — distinct or with sum constraint' },
      permutations: { proceed: 'WHEN: generate all arrangements of elements' },
      'string-generation': { proceed: 'WHEN: generate strings from character mapping or structural rules' },
      'partition-problems': { proceed: 'WHEN: divide sequence into valid pieces' },
    },
  }),

  'subsets-combos': d({
    whenAtThisStep: 'Subsets or combinations — distinct input or with sum/duplicate constraints.',
    xray: [
      { text: 'Return all possible **subsets** of distinct integers', kind: 'goal' },
      { text: 'Return all **combinations** of size k', kind: 'goal' },
      { text: 'Find all **combination sums** that add to target', kind: 'goal' },
    ],
    budget: ['subsets', 'combinations', 'targetSum'],
    sayIt: [
      'Subsets I: choose/not-choose per element.',
      'Combination Sum I: allow reuse (dfs i). II: each used once (dfs i+1).',
      'Combination Sum III: k elements from 1..9 summing to n.',
    ],
    branchGuides: {
      'basic-subset-gen': { proceed: 'WHEN: distinct input, standard subsets or size-k combinations' },
      'combos-with-constraints': { proceed: 'WHEN: sum target, duplicates possible, or k-element constraint' },
    },
  }),

  permutations: d({
    whenAtThisStep: 'All permutations or next permutation only.',
    xray: [
      { text: 'Return all **permutations** of distinct integers', kind: 'goal' },
      { text: 'Return the **next permutation** in lexicographic order', kind: 'goal' },
    ],
    budget: ['permutations'],
    sayIt: [
      'Permutations: swap-based for distinct; used[] + sort for duplicates.',
      'Next Permutation: pivot + swap + reverse.',
    ],
    branchGuides: {
      'basic-perm-gen': { proceed: 'WHEN: generate all n! permutations' },
      'circular-perm': { proceed: 'WHEN: next lexicographic permutation only' },
    },
  }),

  'string-generation': d({
    whenAtThisStep: 'Generate strings from character mappings or structural rules.',
    xray: [
      { text: 'Return **letter combinations** of a phone number', kind: 'goal' },
      { text: 'Return all **letter case permutations**', kind: 'goal' },
      { text: 'Generate all well-formed **parentheses**', kind: 'goal' },
    ],
    budget: ['stringGen'],
    sayIt: [
      'Character-based: map each position to set of possible chars.',
      'Word-based: enforce structural rules (balance, segment limits).',
    ],
    branchGuides: {
      'char-based-gen': { proceed: 'WHEN: each position maps to a set of chars — phone number, case perm' },
      'word-based-gen': { proceed: 'WHEN: structural rules — parentheses balance, IP segment validity' },
    },
  }),

  'constraint-satisfaction': d({
    whenAtThisStep: 'Find arrangements that satisfy constraints. Board, pattern, or assignment?',
    xray: [
      { text: 'Place **n queens** on an n×n board', kind: 'goal' },
      { text: '**Solve Sudoku** by filling empty cells', kind: 'goal' },
      { text: '**Word search** in a grid', kind: 'goal' },
    ],
    budget: ['board', 'pattern', 'assignment', 'constraintCheck'],
    sayIt: [
      'Board filling: place items with constraint checks (cols, diags, boxes).',
      'Word pattern: match patterns on grid or via bijection map.',
      'Assignment: distribute items with pairwise constraints + bitmask.',
    ],
    branchGuides: {
      'board-filling': { proceed: 'WHEN: N-Queens, Sudoku — place items on board with row/col/box constraints' },
      'word-pattern-matching': { proceed: 'WHEN: word search on grid, word pattern bijection' },
      'assignment-problems': { proceed: 'WHEN: distribute/assign items with pairwise constraints' },
    },
  }),

  'board-filling': d({
    whenAtThisStep: 'Board filling — classic constraint satisfaction (N-Queens, Sudoku) or game board exploration.',
    xray: [
      { text: 'Return **all distinct solutions** to the N-Queens problem', kind: 'goal' },
      { text: 'Fill empty cells of a **Sudoku** board', kind: 'goal' },
      { text: 'Return the **maximum gold** collectable in a path', kind: 'goal' },
    ],
    budget: ['board', 'constraintCheck'],
    sayIt: [
      'Classic: place queens row by row; fill Sudoku cell by cell.',
      'Game board: explore all moves from each start cell.',
    ],
    branchGuides: {
      'classic-board': { proceed: 'WHEN: N-Queens (row/col/diag), Sudoku (row/col/box) — full constraint satisfaction' },
      'game-board': { proceed: 'WHEN: game board exploration with scoring — path with max gold, valid sudoku check' },
    },
  }),

  'graph-exploration': d({
    whenAtThisStep: 'Explore graphs or matrices with backtracking. Paths, coloring, or matrix DFS?',
    xray: [
      { text: 'Return **all paths** from source to target', kind: 'goal' },
      { text: 'Determine if graph is **bipartite**', kind: 'goal' },
      { text: 'Find the **longest increasing path** in a matrix', kind: 'goal' },
    ],
    budget: ['graph', 'dfs', 'pathEnumeration', 'coloring'],
    sayIt: [
      'Path finding: DFS to enumerate routes or find critical edges.',
      'Graph coloring: two-color assignment with conflict detection.',
      'Matrix exploration: DFS on grid with memoization or visited state.',
    ],
    branchGuides: {
      'path-finding': { proceed: 'WHEN: enumerate all paths or find bridge edges in graph' },
      'graph-coloring': { proceed: 'WHEN: two-color bipartite check on graph' },
      'matrix-exploration': { proceed: 'WHEN: DFS on 2D grid — longest increasing path, knight probability' },
    },
  }),

  'path-finding': d({
    whenAtThisStep: 'Path finding — all possible paths or constrained path exploration.',
    xray: [
      { text: 'Return **all paths** from node 0 to node n-1', kind: 'goal' },
      { text: 'Find all **critical connections** (bridges)', kind: 'goal' },
      { text: 'Walk **every empty cell** exactly once to reach goal', kind: 'goal' },
    ],
    budget: ['graph', 'dfs', 'pathEnumeration'],
    sayIt: [
      'All paths: DFS from source, push neighbor, recurse, pop.',
      'Critical connections: Tarjan with disc/low times.',
      'Constrained paths: DFS must visit all cells or handle unknown grid.',
    ],
    branchGuides: {
      'all-possible-paths': { proceed: 'WHEN: enumerate all routes from source to target (DAG or visited-tracked)' },
      'path-with-constraints': { proceed: 'WHEN: path must visit all empty cells or explore unknown grid' },
    },
  }),

  'optimization-backtrack': d({
    whenAtThisStep: 'Optimize with branch-and-bound, memoization, or minimax adversarial search.',
    xray: [
      { text: '**Maximum length** concatenated string with unique characters', kind: 'goal' },
      { text: '**Word break** — can the string be segmented?', kind: 'goal' },
      { text: '**Predict the winner** — can player 1 win?', kind: 'goal' },
    ],
    budget: ['pruning', 'memoization', 'minimax', 'gameTheory'],
    sayIt: [
      'Branch and bound: prune when current branch cannot beat best.',
      'Memoization: cache subproblem results by state key.',
      'Minimax: each player maximizes own score; use difference scoring.',
    ],
    branchGuides: {
      'branch-and-bound': { proceed: 'WHEN: maximize/minimize with pruning bound — concatenated string, closest cost' },
      'memoization-backtrack': { proceed: 'WHEN: DFS with memo — word break, segmentation with caching' },
      'minimax-game-theory': { proceed: 'WHEN: two players, optimal play, score difference — predict winner, stone game' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
