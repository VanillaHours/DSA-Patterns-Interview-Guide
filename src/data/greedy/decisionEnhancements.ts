import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Optimization problem: maximize or minimize',
    'Can sort or heap- order elements',
    'Local choice does not need undoing',
    'Exchange argument or greedy stays ahead',
  ],
  whenAtThisStep: 'Confirm the problem needs a greedy approach — locally optimal choices leading to global optimum.',
  xray: [
    { text: 'make the **locally optimal** choice at each step', kind: 'signal' },
    { text: 'sorting or priority queue often required', kind: 'constraint' },
    { text: '**no future decisions** affect past choices (no backtracking)', kind: 'signal' },
    { text: 'optimization problem: maximize or minimize', kind: 'goal' },
    { text: 'proof: exchange argument, staying ahead, or greedy stays ahead', kind: 'signal' },
  ],
  budget: ['locally optimal', 'no backtrack', 'greedy choice property', 'optimal substructure'],
  sayIt: [
    'Is the globally optimal solution built from locally optimal choices?',
    'Can we sort / heap / prioritize, then pick the best each step?',
    'Do previous choices never need to be undone?',
  ],
  branchGuides: {
    'interval-step2': {
      proceed: 'WHEN: there are intervals, ranges, or connecting points with min cost',
    },
    'selection-step2': {
      proceed: 'WHEN: picking/choosing elements by frequency, value, or ratio',
    },
    'path-search-step2': {
      proceed: 'WHEN: movement through space, jump games, or graph exploration',
    },
    'prefix-suffix-step2': {
      proceed: 'WHEN: running prefix sums, extrema, or two-pass combine',
    },
    'incremental-step2': {
      proceed: 'WHEN: building result digit-by-digit, swaps, or priority ordering',
    },
  },
  notThisPattern: [
    { signal: 'Need to explore all possibilities (backtracking/DP)', actually: 'Use DP or backtracking pattern — greedy cannot revisit' },
    { signal: 'Future decisions undo past choices', actually: 'Greedy requires no backtrack — use search or DP' },
  ],
  misidentify: [
    {
      cause: 'DP problems that look greedy but need full state exploration',
      wrong: 'Pick locally optimal without considering future',
      testCase: '0/1 knapsack: greedy picks highest value/weight but misses optimal combination',
      fix: 'Use DP (Knapsack DP) instead of greedy',
    },
    {
      cause: 'Sorting + two-pointer problems where order is the only mechanism',
      wrong: 'Label as greedy because sorted',
      testCase: 'Two sum on sorted array — sorted helps two pointers, not greedy',
      fix: 'Use two-pointers pattern instead',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'greedy-root': d({
    whenAtThisStep: 'You think the problem needs a greedy approach. Now narrow down the domain.',
    xray: [
      { text: '**intervals** or **ranges** with start/end', kind: 'signal' },
      { text: '**pick/select** K elements by some criteria', kind: 'signal' },
      { text: '**jump / path / traverse** with reachability', kind: 'signal' },
      { text: '**prefix / running** state while iterating', kind: 'signal' },
      { text: '**build incrementally** with monotonic stack or heap', kind: 'signal' },
    ],
    budget: ['interval processing', 'selection', 'path search', 'prefix suffix', 'incremental construction'],
    sayIt: [
      'What is the domain: intervals, selection, path-building, prefix optimization, or incremental construction?',
    ],
    branchGuides: {
      'interval-step2': { proceed: 'yes — there are intervals, ranges, or connecting points with min cost' },
      'selection-step2': { proceed: 'yes — picking/choosing elements by frequency, value, or ratio' },
      'path-search-step2': { proceed: 'yes — movement through space, jump games, or graph exploration' },
      'prefix-suffix-step2': { proceed: 'yes — running prefix sums, extrema, or two-pass combine' },
      'incremental-step2': { proceed: 'yes — building result digit-by-digit, swaps, or priority ordering' },
    },
    notThisPattern: [
      { signal: 'Interval-like without greedy (DP on intervals)', actually: 'Use interval DP if greedy optimal substructure is not proven' },
    ],
  }),

  'interval-step2': d({
    whenAtThisStep: 'You confirmed intervals or point-connection problems. Which style?',
    xray: [
      { text: '**non-overlapping** / schedule / merge intervals', kind: 'signal' },
      { text: '**sweep line** / event counting', kind: 'signal' },
      { text: '**connect all points** with min total weight (MST)', kind: 'goal' },
    ],
    budget: ['interval scheduling', 'sweep line', 'minimum spanning tree'],
    sayIt: [
      'Are these intervals to schedule/merge/cover, or nodes to connect with min cost?',
    ],
    branchGuides: {
      'interval-scheduling-step3': { proceed: 'yes — intervals with start/end: schedule, merge, cover, or sweep line' },
      'mst-step3': { proceed: 'yes — connect all points/nodes with minimum total weight' },
    },
    notThisPattern: [
      { signal: 'Sorting-based only', actually: 'Use sorting pattern' },
    ],
  }),

  'interval-scheduling-step3': d({
    whenAtThisStep: 'You have intervals to schedule, merge, cover, or sweep. Pick the operation:',
    xray: [
      { text: '**non-overlapping** / pick maximum count', kind: 'goal' },
      { text: '**merge** overlapping intervals into union', kind: 'goal' },
      { text: '**cover** a target range with fewest intervals', kind: 'goal' },
      { text: '**events** at start/end times, count concurrent', kind: 'signal' },
    ],
    budget: ['activity selection', 'merge intervals', 'interval coverage', 'sweep line'],
    sayIt: [
      'Sort by end → greedy pick non-overlapping.',
      'Sort by start → merge overlapping ranges.',
      'Cover target: sort by start, extend farthest reach.',
      'Sweep line: +1 start, -1 end, track max concurrent.',
    ],
    branchGuides: {
      'activity-select': { proceed: 'select max non-overlapping intervals -> sort by END' },
      'interval-merge': { proceed: 'merge overlapping -> sort by START' },
      'interval-coverage': { proceed: 'cover a range -> sort by START, track farthest reach' },
      'skyline-sweep': { proceed: 'event counting / concurrent max -> +1 at start, -1 at end' },
    },
    notThisPattern: [
      { signal: 'Simple list of numbers without intervals', actually: 'Not an interval problem' },
    ],
  }),

  'mst-step3': d({
    whenAtThisStep: 'You need to connect all nodes with minimum cost. Pick algorithm:',
    xray: [
      { text: '**complete graph** with all-pairs edges', kind: 'signal' },
      { text: '**sparse** edge list', kind: 'constraint' },
      { text: '**union-find** for cycle detection', kind: 'signal' },
      { text: '**priority queue** to pick cheapest frontier', kind: 'signal' },
    ],
    budget: ["Kruskal's", "Prim's"],
    sayIt: [
      'Dense graph -> Prim O(n^2). Sparse graph -> Kruskal O(E log E).',
      'Kruskal: sort edges, DSU unite, O(E log E).',
      'Prim: start anywhere, always add cheapest edge to visited set.',
    ],
    branchGuides: {
      kruskals: { proceed: 'edge list sorted by weight + union-find' },
      prims: { proceed: 'dense graph, O(n^2) adjacency iteration' },
    },
    notThisPattern: [
      { signal: 'Shortest path between two nodes', actually: 'Use Dijkstra pattern' },
    ],
  }),

  'selection-step2': d({
    whenAtThisStep: 'You need to select elements. Which selection criteria?',
    xray: [
      { text: '**frequency** or **count** based', kind: 'signal' },
      { text: '**value** or **cost** comparison', kind: 'signal' },
      { text: '**ratio** based: value/weight or efficiency', kind: 'signal' },
      { text: '**build** result stepwise with heap', kind: 'signal' },
    ],
    budget: ['freq select', 'value select', 'ratio select', 'iterative construct'],
    sayIt: [
      'Frequency: majority voting, task scheduling slots.',
      'Value: sort and pick based on direct comparison.',
      'Ratio: sort by ratio or efficiency metric.',
      'Iterative: use heap to always pick the best next element.',
    ],
    branchGuides: {
      'freq-select': { proceed: 'element frequency drives decision: voting, scheduling' },
      'value-select': { proceed: 'direct value comparisons: cookies, city cost, stone weight' },
      'ratio-select': { proceed: 'value/weight ratio: boats, calculator, gas station feasibility' },
      'iterative-construction': { proceed: 'stepwise build with heap: connect sticks, rope colorful' },
    },
    notThisPattern: [
      { signal: 'Intervals or path building', actually: 'Use interval or path sub-pattern' },
    ],
  }),

  'path-search-step2': d({
    whenAtThisStep: 'You navigate through a space. What kind of movement?',
    xray: [
      { text: '**jump game**: max reachable index / min jumps', kind: 'signal' },
      { text: '**grid with weights**: minimize max edge weight', kind: 'signal' },
      { text: '**string**: build valid string with adjacency constraints', kind: 'signal' },
    ],
    budget: ['jump game', 'graph exploration', 'string construction'],
    sayIt: [
      'Jump game: track farthest reachable. Jump game II: count BFS-like tiers.',
      'Graph exploration: Dijkstra-like PQ on min-max effort.',
      'String construction: most frequent char first, avoid triplets.',
    ],
    branchGuides: {
      'path-building': { proceed: 'array jumps: reachability or min jumps' },
      'graph-exploration': { proceed: 'grid with weights: min max edge, max min path' },
      'string-construction': { proceed: 'build valid string: reorganize, happy string' },
    },
    notThisPattern: [
      { signal: 'Standard shortest path with sum weights', actually: 'Use Dijkstra pattern' },
    ],
  }),

  'prefix-suffix-step2': d({
    whenAtThisStep: 'Running calculations during iteration. Which technique?',
    xray: [
      { text: '**prefix sum** or **Kadane** running max', kind: 'signal' },
      { text: '**running min/max** / deficit tracking', kind: 'signal' },
      { text: '**two-pass**: forward then backward combine', kind: 'signal' },
    ],
    budget: ['prefix sum', 'running min max', 'two-pass'],
    sayIt: [
      'Prefix sum/Kadane: cumulative computation, drop negative prefix.',
      'Running min/max: track state as you iterate, reset on negative.',
      'Two-pass: forward builds left state, backward builds right, combine.',
    ],
    branchGuides: {
      'prefix-sum': { proceed: 'Kadane, stock buy/sell, circular max sum, cards from ends' },
      'running-min-max': { proceed: 'gas station deficit, consecutive subsequences, refueling stops' },
      'two-pass': { proceed: 'rain water, candy distribution, good splits' },
    },
    notThisPattern: [
      { signal: 'Actual interval problems with start/end points', actually: 'Use interval processing sub-pattern' },
    ],
  }),

  'incremental-step2': d({
    whenAtThisStep: 'Building result piece by piece. Which mechanism?',
    xray: [
      { text: '**remove** digits / letters with **monotonic stack**', kind: 'signal' },
      { text: '**swap** / **exchange** arguments', kind: 'signal' },
      { text: '**priority queue** for ordering', kind: 'signal' },
    ],
    budget: ['digit/char construction', 'exchange arguments', 'prioritized processing'],
    sayIt: [
      'Digit construction: monotonic stack removes larger peaks.',
      'Exchange arguments: prove that local swaps lead to global optimum.',
      'Prioritized processing: heap always picks the best next candidate.',
    ],
    branchGuides: {
      'digit-char-construct': { proceed: 'monotonic stack: remove K digits, duplicate letters' },
      'greedy-exchange': { proceed: 'swap/exchange: domino rotations, max swap' },
      'prioritized-processing': { proceed: 'heap ordering: IPO, rearrange k apart, max events' },
    },
    notThisPattern: [
      { signal: 'Just sorting — need more than order', actually: 'Use sorting pattern' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
