import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even DP? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Optimal substructure — solution built from sub-solutions',
    'Overlapping subproblems — same subproblem solved repeatedly',
    'Maximize / minimize / count ways / feasibility check',
    'State transition based on previous choices',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem need dynamic programming?',
  xray: [
    { text: 'Find the **maximum** / **minimum** / **number of ways** to …', kind: 'goal' },
    { text: 'dp[i] / dp[i][j] recurrence hinted', kind: 'signal' },
    { text: 'Return **true/false** if possible given constraints', kind: 'goal' },
    { text: 'Count **all** possible ways / sequences', kind: 'goal' },
    { text: 'Constraints ≤ 10³ (O(n²)) or ≤ 20 (bitmask)', kind: 'constraint' },
  ],
  budget: ['1D DP', '2D DP', 'subsequence', 'knapsack', 'bitmask', 'interval', 'optimization'],
  sayIt: [
    'One state variable → 1D State DP.',
    'Substring / subsequence matching → LIS, LCS, edit distance, palindrome.',
    'Two+ state dimensions → 2D / Grid / Interval / Knapsack.',
    'State is a set/subset → State Compression (bitmask, TSP).',
    'Need better time/space → DP Optimization techniques.',
  ],
  branchGuides: {
    '1d-state-dp': {
      proceed: 'WHEN: single index i, dp[i] depends on 1..K previous states — linear, decision, or Fibonacci',
      whenExtra: ['stairs', 'house robber', 'stock', 'kadane', 'fibonacci', 'decode ways'],
    },
    'substring-subsequence-dp': {
      proceed: 'WHEN: compare prefixes/ranges of one or two sequences — LIS, LCS, edit distance, palindrome',
      whenExtra: ['LIS', 'LCS', 'edit distance', 'palindrome', 'subsequence'],
    },
    '2d-multi-dim-dp': {
      proceed: 'WHEN: grid, interval, or knapsack — two or more state dimensions',
      whenExtra: ['grid path', 'square', 'interval dp', 'knapsack', 'coin change', 'burst balloons'],
    },
    'state-compression-dp': {
      proceed: 'WHEN: state is a subset — bitmask or TSP (n ≤ 20)',
      whenExtra: ['bitmask', 'tsp', 'subset dp', 'held-karp', 'students exam'],
    },
    'dp-optimization': {
      proceed: 'WHEN: need to reduce space or time — rolling array, D&C DP, monotonic queue',
      whenExtra: ['space optimize', 'divide and conquer dp', 'monotonic queue', 'knuth'],
    },
  },
  notThisPattern: [
    { signal: '"maximum subarray" (Kadane)', actually: 'Array Traversal — one-pass running state, not general DP' },
    { signal: '"shortest path" BFS / Dijkstra', actually: 'Graph Traversal — not DP (no overlapping subproblems at each vertex)' },
    { signal: '"generate parentheses" / "subsets"', actually: 'Backtracking — exhaustive enumeration, not optimal substructure' },
    { signal: '"two sum" / "valid anagram"', actually: 'Hash Map or Two Pointers — no recurrence needed' },
  ],
  misidentify: [
    {
      cause: 'Greedy when DP with overlapping subproblems needed',
      wrong: 'Pick locally optimal choice without checking future',
      testCase: 'LC 322 Coin Change (greedy fails for [1,3,4] amount=6)',
      fix: 'DP explores all combinations, not just the greedy choice.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'dp-root': PATTERN_GATE,

  '1d-state-dp': d({
    whenAtThisStep: 'Single state variable dp[i]. Linear sequence, decision making, or Fibonacci recurrence?',
    xray: [
      { text: 'dp[i] depends on dp[i-1], dp[i-2], …', kind: 'signal' },
      { text: '**Maximum** / **minimum** / **number of ways** to reach step i', kind: 'goal' },
      { text: 'dp[i] with multiple states per index (hold/cash)', kind: 'signal' },
    ],
    budget: ['linear', 'fibonacci', 'decision', 'rolling'],
    sayIt: [
      'Linear: dp[i] = f(dp[i-1], dp[i-2], …). Classic or Kadane.',
      'Decision: multiple states per position (stock hold/cash, game theory).',
      'Fibonacci: simple recurrence from last K states.',
    ],
    branchGuides: {
      'linear-sequence-dp': { proceed: 'WHEN: left-to-right sequence — classic climbing/house robber or Kadane running state' },
      'decision-making-dp': { proceed: 'WHEN: multi-state decisions — stock trading, game theory' },
      'fibonacci-style-dp': { proceed: 'WHEN: dependency on last K values only (no choice/comparison)' },
    },
  }),

  'linear-sequence-dp': d({
    whenAtThisStep: 'Left-to-right sequence. Classic recurrence or Kadane running state?',
    xray: [
      { text: 'Number of **ways** to climb stairs', kind: 'goal' },
      { text: '**Maximum** amount you can rob without alerting police', kind: 'goal' },
      { text: 'Can the string be **segmented** into dictionary words?', kind: 'goal' },
      { text: '**Maximum subarray** sum', kind: 'goal' },
    ],
    budget: ['dp[i]', 'recurrence', 'kadane'],
    sayIt: [
      'Classic: dp[i] = f(dp[i-1], dp[i-2], dp[j]). O(n) or O(n²).',
      'Kadane: cur = max(x, cur + x); global best = max(best, cur).',
    ],
    branchGuides: {
      'classic-linear-dp': { proceed: 'WHEN: standard recurrence dp[i] from previous states — stairs, house robber, word break' },
      'kadane-dp': { proceed: 'WHEN: running state per element — max subarray sum or product' },
    },
  }),

  'decision-making-dp': d({
    whenAtThisStep: 'Multiple states per index. Stock trading or game theory?',
    xray: [
      { text: '**Maximum profit** with at most k transactions', kind: 'goal' },
      { text: '**Stone game** — two players optimal play', kind: 'goal' },
    ],
    budget: ['state machine', 'minimax'],
    sayIt: [
      'Stock: hold/cash states per day. Track max profit for each transaction count.',
      'Game theory: minimax — score diff = myPick - opponentBest.',
    ],
    branchGuides: {
      'buy-sell-stock-dp': { proceed: 'WHEN: stock prices, hold+sell states — I, II, III with cooldown/fee' },
      'game-theory-dp': { proceed: 'WHEN: two players, optimal play, score difference — stone game' },
    },
  }),

  'substring-subsequence-dp': d({
    whenAtThisStep: 'Compare portions of sequences. LIS, LCS, edit distance, or palindrome?',
    xray: [
      { text: '**Longest increasing subsequence** in array', kind: 'goal' },
      { text: '**Longest common subsequence** between two strings', kind: 'goal' },
      { text: '**Edit distance** — minimum insert/delete/replace', kind: 'goal' },
      { text: '**Longest palindromic subsequence**', kind: 'goal' },
    ],
    budget: ['subsequence', 'substring', 'matching'],
    sayIt: [
      'LIS: one sequence, dp[i] = 1 + max(dp[j]) for j < i, nums[j] < nums[i].',
      'LCS: two sequences, 2D dp — match or skip.',
      'Edit Distance: two sequences, 2D dp — match or 1+min(ins,del,rep).',
      'Palindrome: 2D dp over ranges, i desc j asc.',
    ],
    branchGuides: {
      'lis-dp': { proceed: 'WHEN: one sequence, longest increasing subsequence' },
      'lcs-dp': { proceed: 'WHEN: two sequences, longest common subsequence or supersequence' },
      'edit-distance-dp': { proceed: 'WHEN: transform one string into another — edit ops or distinct subsequences' },
      'palindromic-dp': { proceed: 'WHEN: palindromic subsequence — longest or min insertions' },
    },
  }),

  '2d-multi-dim-dp': d({
    whenAtThisStep: 'Multiple state dimensions. Grid, interval, or knapsack?',
    xray: [
      { text: 'Number of **unique paths** in a grid', kind: 'goal' },
      { text: '**Maximal square** / rectangle of 1s', kind: 'goal' },
      { text: '**Burst balloons** — maximize coins', kind: 'goal' },
      { text: '**Coin change** — fewest coins to amount', kind: 'goal' },
    ],
    budget: ['grid', 'interval', 'knapsack'],
    sayIt: [
      'Grid: dp[i][j] = ways or min/max sum to reach (i,j).',
      'Interval: dp[l][r] over ranges, iterate by length.',
      'Knapsack: capacity constraint — 0/1, unbounded, or multi-constraint.',
    ],
    branchGuides: {
      'grid-based-dp': { proceed: 'WHEN: 2D grid — paths, regions (square/rectangle), or constrained traversal' },
      'interval-dp': { proceed: 'WHEN: ranges/intervals — burst balloons, triangulation, cut stick' },
      'knapsack-problems': { proceed: 'WHEN: resource capacity — 0/1, unbounded, or multi-constraint knapsack' },
    },
  }),

  'grid-based-dp': d({
    whenAtThisStep: 'Problems on 2D matrices. Path, region, or constrained traversal?',
    xray: [
      { text: '**Unique paths** from top-left to bottom-right', kind: 'goal' },
      { text: '**Maximal square** of all 1s', kind: 'goal' },
      { text: '**Triangle** minimum path sum', kind: 'goal' },
    ],
    budget: ['grid', 'dp[i][j]'],
    sayIt: [
      'Path: dp[i][j] = dp[i-1][j] + dp[i][j-1] (ways) or val+min(up,left).',
      'Region: square dp = 1+min(up,left,diag); rectangle = histogram per row.',
      'Constrained: bottom-up with edge handling for variable movement.',
    ],
    branchGuides: {
      'grid-path-dp': { proceed: 'WHEN: robot moving right/down — count paths or min path sum' },
      'grid-region-dp': { proceed: 'WHEN: find largest square/rectangle of 1s, or count all squares' },
      'grid-traversal-constrained-dp': { proceed: 'WHEN: variable movement — triangle min path, falling path' },
    },
  }),

  'knapsack-problems': d({
    whenAtThisStep: 'Resource allocation with constraints. 0/1, unbounded, or multi-constraint?',
    xray: [
      { text: '**Partition** array into two equal subsets', kind: 'goal' },
      { text: '**Coin change** — fewest coins or number of combos', kind: 'goal' },
      { text: '**Dice rolls** — number of ways with target sum and die count', kind: 'goal' },
    ],
    budget: ['knapsack', 'capacity', 'resource'],
    sayIt: [
      '0/1: each item once. Capacity outer loop DESCENDING.',
      'Unbounded: unlimited reuse. Capacity outer loop ASCENDING.',
      'Multi-constraint: 2D DP over (count, sum) or (weight, volume).',
    ],
    branchGuides: {
      'knapsack-0-1': { proceed: 'WHEN: each item taken at most once — partition, target sum, ones and zeroes' },
      'knapsack-unbounded': { proceed: 'WHEN: each item reusable — coin change, coin change 2, combination sum IV' },
      'knapsack-multi-constraint': { proceed: 'WHEN: multiple limiting factors — dice rolls with target sum' },
    },
  }),

  'state-compression-dp': d({
    whenAtThisStep: 'State represented as bitmask. Subset enumeration or TSP path covering?',
    xray: [
      { text: 'Iterate over all **subsets** using bitmask', kind: 'signal' },
      { text: '**Maximum students** — seating with adjacency constraint', kind: 'goal' },
      { text: '**Shortest superstring** — overlap concatenation', kind: 'goal' },
    ],
    budget: ['bitmask', 'subset', 'tsp'],
    sayIt: [
      'Bitmask: dp[mask] = result for subset. Iterate masks, add one element at a time.',
      'TSP: dp[mask][last] = cost to visit mask ending at last. O(2^n * n²).',
    ],
    branchGuides: {
      'bitmask-dp': { proceed: 'WHEN: state is which elements are used — subsets, exam seating, k-subset partition' },
      'tsp-dp': { proceed: 'WHEN: optimal path visiting all nodes — shortest superstring, unique paths III' },
    },
  }),

  'dp-optimization': d({
    whenAtThisStep: 'Improve time or space of existing DP. Space optimization, D&C DP, or monotonic structures?',
    xray: [
      { text: '**Reduce** O(n) space to O(1) with rolling array', kind: 'goal' },
      { text: '**Job schedule** — min difficulty with D&C DP optimization', kind: 'goal' },
      { text: '**Constrained subsequence sum** — range max query with deque', kind: 'goal' },
    ],
    budget: ['space', 'divideConquer', 'monotonic'],
    sayIt: [
      'Space: rolling array or state reduction — keep only what next step needs.',
      'D&C DP: optimize transitions that take min over a range with monotonic decision points.',
      'Monotonic queue: maintain decreasing deque for range max/min queries in sliding window.',
    ],
    branchGuides: {
      'space-optimization-dp': { proceed: 'WHEN: reduce O(n) to O(k) or O(1) — rolling array, state reduction' },
      'divide-conquer-dp': { proceed: 'WHEN: dp[i][k] = min(dp[j-1][k-1] + cost(j,i)) with monotonic decisions' },
      'monotonic-queue-dp': { proceed: 'WHEN: dp[i] = nums[i] + max(dp[j]) for j in [i-k, i-1] — sliding window range max' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
