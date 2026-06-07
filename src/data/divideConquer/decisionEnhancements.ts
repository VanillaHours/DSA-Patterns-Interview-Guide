import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Problem can be split into independent subproblems',
    'Recursive divide-and-conquer approach is natural',
    'Combine results from subproblem solutions',
    'Binary search on sorted or structured data',
    'Merge sort or quick sort paradigm',
  ],
  whenAtThisStep: 'Confirm the problem benefits from divide and conquer — splitting into independent subproblems, solving recursively, and combining results.',
  xray: [
    { text: '**divide** the problem into smaller independent subproblems', kind: 'signal' },
    { text: '**recurse** / solve each subproblem independently', kind: 'signal' },
    { text: '**combine** / merge results from subproblems', kind: 'signal' },
    { text: '**binary search** halving the search space', kind: 'signal' },
    { text: '**merge sort** or **quick sort** paradigm', kind: 'signal' },
    { text: '**post-order** tree traversal (left + right + root)', kind: 'signal' },
    { text: 'Subproblems are **independent** (not overlapping like DP)', kind: 'constraint' },
    { text: 'Split until base case, then combine', kind: 'goal' },
  ],
  budget: ['divide', 'conquer', 'recurse', 'combine', 'split', 'merge'],
  sayIt: [
    'Can you split the problem into smaller independent subproblems?',
    'Do you solve the subproblems recursively and then combine?',
    'Is it a binary search on sorted/structured data?',
    'Is it a merge sort or quick sort style algorithm?',
    'Is it post-order tree processing (left, right, root)?',
  ],
  branchGuides: {
    'classic-dc-step2': {
      proceed: 'WHEN: core D&C — sorting, binary search, selection, math',
    },
    'array-string-dc-step2': {
      proceed: 'WHEN: arrays / strings — subarrays, counting, LCP',
    },
    'tree-graph-dc-step2': {
      proceed: 'WHEN: trees/graphs — tree recursion, segment tree, centroid decomposition',
    },
  },
  notThisPattern: [
    { signal: 'Subproblems overlap (share sub-subproblems)', actually: 'Use Dynamic Programming — memoize overlapping subproblems' },
    { signal: 'Single pass through data without splitting', actually: 'Use array/string traversal pattern' },
  ],
  misidentify: [
    {
      cause: 'Overlapping subproblems mistaken for independent',
      wrong: 'Apply D&C to DP problem (e.g., recursive Fibonacci without memo)',
      testCase: 'fib(50) — exponential recomputation',
      fix: 'Add memoization — use Dynamic Programming instead',
    },
    {
      cause: 'Linear scan problem thought to need D&C',
      wrong: 'Apply merge sort to find max element in array',
      testCase: 'largest element in [3,1,4,1,5] — linear scan is O(n)',
      fix: 'Use simple linear scan for problems without combine step',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'divide-conquer-root': d({
    whenAtThisStep: 'You think D&C is needed. Now narrow down which domain.',
    xray: [
      { text: '**classic D&C**: sorting, binary search, selection, math', kind: 'signal' },
      { text: '**array/string D&C**: subarrays, strings, range queries, geometry', kind: 'signal' },
      { text: '**tree/graph D&C**: trees, graphs, parallel computing', kind: 'signal' },
    ],
    budget: ['classic D&C', 'array/string D&C', 'tree/graph D&C'],
    sayIt: ['Classic (sorting/search/math), array/string (subarray/string/range/geometry), or tree/graph/parallel D&C?'],
    branchGuides: {
      'classic-dc-step2': { proceed: 'yes — sorting, binary search, selection, or mathematical D&C' },
      'array-string-dc-step2': { proceed: 'yes — subarray, string, range query, or geometry D&C' },
      'tree-graph-dc-step2': { proceed: 'yes — tree, graph, or parallel computing D&C' },
    },
    notThisPattern: [
      { signal: 'No recursive splitting, just iteration', actually: 'Use iteration pattern' },
    ],
  }),

  'classic-dc-step2': d({
    whenAtThisStep: 'You confirmed classic D&C. Which category?',
    xray: [
      { text: '**sorting**: merge sort, quick sort, external sort', kind: 'signal' },
      { text: '**binary search**: basic, rotated, matrix', kind: 'signal' },
      { text: '**selection**: quickselect, median of medians', kind: 'signal' },
      { text: '**mathematical**: pow, matrix multiply, Strassen', kind: 'signal' },
    ],
    budget: ['sorting', 'binary search', 'selection', 'mathematical'],
    sayIt: ['Sorting, binary search, selection (Kth), or mathematical (pow/matrix) D&C?'],
    branchGuides: {
      'sorting-step3': { proceed: 'yes — sorting: merge sort, quick sort, external' },
      'binary-search-step3': { proceed: 'yes — binary search: basic, rotated, matrix' },
      'selection-step3': { proceed: 'yes — selection: quickselect, median of medians' },
      'math-step3': { proceed: 'yes — mathematical: pow, matrix ops, multiplication' },
    },
    notThisPattern: [
      { signal: 'Array/string specific problem', actually: 'Use array & string D&C family' },
    ],
  }),

  'sorting-step3': d({
    whenAtThisStep: 'D&C sorting. Which algorithm?',
    xray: [
      { text: '**merge sort**: stable O(n log n), extra space O(n)', kind: 'signal' },
      { text: '**quick sort**: in-place O(n log n), O(n²) worst, unstable', kind: 'signal' },
      { text: '**external sort**: memory-constrained, k-way merge', kind: 'signal' },
    ],
    budget: ['merge sort', 'quick sort', 'external sort'],
    sayIt: ['Merge sort (stable, O(n) space), quick sort (in-place, O(log n) space), or external (disk)?'],
    branchGuides: {
      'merge-sort': { proceed: 'merge sort: stable, O(n log n), extra space' },
      'quick-sort': { proceed: 'quick sort: in-place, O(n log n) average' },
      'external-sort': { proceed: 'external sort: memory-constrained, k-way merge' },
    },
    notThisPattern: [
      { signal: 'Search, not sort', actually: 'Use binary search' },
    ],
  }),

  'binary-search-step3': d({
    whenAtThisStep: 'Binary search. What search space type?',
    xray: [
      { text: '**sorted array**: classic binary search (704, 35)', kind: 'signal' },
      { text: '**rotated**: rotated sorted array (33, 153)', kind: 'signal' },
      { text: '**matrix**: 2D sorted matrix (74, 240)', kind: 'signal' },
    ],
    budget: ['basic BS', 'rotated BS', 'matrix BS'],
    sayIt: ['Sorted array (standard), rotated (circular), or matrix (2D) binary search?'],
    branchGuides: {
      'basic-bs': { proceed: 'standard BS: sorted array (LC 704, 35)' },
      'rotated-bs': { proceed: 'rotated array: pivot search (LC 33, 153)' },
      'matrix-bs': { proceed: 'matrix: 2D sorted search (LC 74, 240)' },
    },
    notThisPattern: [
      { signal: 'Sorting, not searching', actually: 'Use sorting D&C' },
    ],
  }),

  'selection-step3': d({
    whenAtThisStep: 'Selection algorithm. Which method?',
    xray: [
      { text: '**quickselect**: randomized O(n) average, O(n²) worst', kind: 'signal' },
      { text: '**median of medians**: deterministic O(n), high constant', kind: 'signal' },
    ],
    budget: ['quickselect', 'median of medians'],
    sayIt: ['Quickselect (randomized, simpler) or Median of Medians (deterministic)?'],
    branchGuides: {
      'quickselect': { proceed: 'quickselect: O(n) average, simple partition (LC 215, 973)' },
      'median-of-medians': { proceed: 'median of medians: O(n) worst-case, theoretical' },
    },
    notThisPattern: [
      { signal: 'Sorting entire array', actually: 'Use sorting D&C' },
    ],
  }),

  'math-step3': d({
    whenAtThisStep: 'Mathematical D&C. Which computation?',
    xray: [
      { text: '**exponentiation**: fast pow, binary exponent (50, 372)', kind: 'signal' },
      { text: '**matrix**: Strassen, matrix exponentiation (509, 70)', kind: 'signal' },
      { text: '**multiplication**: Karatsuba, FFT', kind: 'signal' },
    ],
    budget: ['exponentiation', 'matrix', 'multiplication'],
    sayIt: ['Fast exponentiation (pow), matrix operations, or integer multiplication?'],
    branchGuides: {
      'fast-exp': { proceed: 'fast exponentiation: binary exponent (LC 50, 372)' },
      'matrix-ops': { proceed: 'matrix: Strassen / exponentiation (LC 509, 70)' },
      'int-mult': { proceed: 'integer multiplication: Karatsuba, FFT' },
    },
    notThisPattern: [
      { signal: 'Sorting numbers', actually: 'Use sorting D&C' },
    ],
  }),

  'array-string-dc-step2': d({
    whenAtThisStep: 'Array/string D&C. Which category?',
    xray: [
      { text: '**subarray**: max sum, closest pair, counting pairs', kind: 'signal' },
      { text: '**string**: LCP, palindrome, string matching', kind: 'signal' },
      { text: '**range query**: segment tree, BIT / Fenwick', kind: 'signal' },
      { text: '**geometry**: closest pair, convex hull, intersections', kind: 'signal' },
    ],
    budget: ['subarray', 'string', 'range query', 'geometry'],
    sayIt: ['Subarray (max/count), string (LCP/palindrome), range query (seg tree/BIT), or geometry (hull/intersect)?'],
    branchGuides: {
      'subarray-step3': { proceed: 'yes — subarray problems: max, pair, count' },
      'string-dc-step3': { proceed: 'yes — string D&C: LCP, matching, palindrome' },
      'range-query-step3': { proceed: 'yes — range query: segment tree, BIT' },
      'geometry-step3': { proceed: 'yes — computational geometry: hull, intersections' },
    },
    notThisPattern: [
      { signal: 'Sorting an array', actually: 'Use classic D&C sorting' },
    ],
  }),

  'subarray-step3': d({
    whenAtThisStep: 'Subarray D&C. Which property?',
    xray: [
      { text: '**max sum**: max subarray, circular (53, 918)', kind: 'signal' },
      { text: '**closest pair**: 3sum closest, geometric (16)', kind: 'signal' },
      { text: '**counting**: reverse pairs, range sum (315, 493, 327)', kind: 'signal' },
    ],
    budget: ['max sum', 'closest pair', 'counting'],
    sayIt: ['Maximum subarray, closest pair, or counting pairs/combinations?'],
    branchGuides: {
      'max-subarray': { proceed: 'max subarray: combine left, right, cross (LC 53, 918)' },
      'closest-pair': { proceed: 'closest pair: strip optimization / 3sum closest (LC 16)' },
      'counting-problems': { proceed: 'counting: merge sort based (LC 315, 493, 327)' },
    },
    notThisPattern: [
      { signal: 'String manipulation', actually: 'Use string D&C' },
    ],
  }),

  'string-dc-step3': d({
    whenAtThisStep: 'String D&C. Which operation?',
    xray: [
      { text: '**LCP**: longest common prefix via divide/conquer (14)', kind: 'signal' },
      { text: '**matching**: Rabin-Karp rolling hash substring search', kind: 'signal' },
      { text: '**palindrome**: expand from center (5, 647)', kind: 'signal' },
    ],
    budget: ['LCP', 'string matching', 'palindrome'],
    sayIt: ['Longest common prefix, string matching (Rabin-Karp), or palindrome detection?'],
    branchGuides: {
      'string-dc': { proceed: 'LCP: D&C on string array (LC 14)' },
      'string-matching': { proceed: 'string matching: Rabin-Karp rolling hash' },
      'palindrome-dc': { proceed: 'palindrome: center expansion (LC 5, 647)' },
    },
    notThisPattern: [
      { signal: 'Single string operations', actually: 'Use string traversal pattern' },
    ],
  }),

  'tree-graph-dc-step2': d({
    whenAtThisStep: 'Tree/graph/parallel D&C. Which category?',
    xray: [
      { text: '**tree problems**: recursion, construction, LCA, BST, segment tree, centroid, tree DP', kind: 'signal' },
      { text: '**graph algorithms**: connectivity, shortest path, DP optimization', kind: 'signal' },
      { text: '**parallel computing**: map-reduce, parallel sorting', kind: 'signal' },
    ],
    budget: ['tree problems', 'graph algorithms', 'parallel computing'],
    sayIt: ['Tree problems (construction/LCA/segment tree/centroid), graph algorithms (connectivity/Johnson/DP opt), or parallel computing (map-reduce/sort)?'],
    branchGuides: {
      'tree-step3': { proceed: 'yes — tree D&C: construction, LCA, BST, segment trees, centroid, tree DP' },
      'graph-step3': { proceed: 'yes — graph algorithms: connectivity, Johnson, D&C DP opt' },
      'parallel-step3': { proceed: 'yes — parallel computing: map-reduce, parallel sorting' },
    },
    notThisPattern: [
      { signal: 'Array/string D&C problem', actually: 'Use array & string D&C family' },
    ],
  }),

  'tree-step3': d({
    whenAtThisStep: 'Tree D&C. Which category of tree problem?',
    xray: [
      { text: '**tree recursion**: max depth, balanced, diameter, invert (104, 110, 543, 226)', kind: 'signal' },
      { text: '**tree construction**: from inorder/preorder/postorder (105, 106, 889)', kind: 'signal' },
      { text: '**LCA**: lowest common ancestor (236, 1644)', kind: 'signal' },
      { text: '**tree property**: max sum BST (1373)', kind: 'signal' },
      { text: '**BST**: sorted array to BST, preorder to BST (108, 1008)', kind: 'signal' },
      { text: '**segment tree basic**: range sum with point updates (307)', kind: 'signal' },
      { text: '**segment tree advanced**: lazy propagation, range updates (370, 731)', kind: 'signal' },
      { text: '**merge sort tree**: range counting queries', kind: 'signal' },
      { text: '**centroid decomp**: path queries on trees', kind: 'signal' },
      { text: '**tree DP**: max path sum, robber, cameras (124, 337, 968)', kind: 'signal' },
    ],
    budget: ['tree recursion', 'tree construction', 'LCA', 'BST', 'segment tree', 'merge sort tree', 'centroid', 'tree DP'],
    sayIt: ['Tree recursion, construction, LCA, BST, segment tree, merge sort tree, centroid decomposition, or tree DP?'],
    branchGuides: {
      'tree-recursion': { proceed: 'tree recursion: post-order D&C (LC 104, 110, 543, 226)' },
      'tree-construction': { proceed: 'tree construction: from traversals (LC 105, 106, 889)' },
      'lca': { proceed: 'LCA: lowest common ancestor (LC 236, 1644)' },
      'tree-property-advanced': { proceed: 'advanced: max sum BST, tree properties (LC 1373)' },
      'bst-dc': { proceed: 'BST: sorted array / preorder construction (LC 108, 1008)' },
      'seg-tree-basics': { proceed: 'segment tree basic: range sum, point updates (LC 307)' },
      'seg-tree-advanced': { proceed: 'segment tree advanced: lazy propagation (LC 370, 731)' },
      'merge-sort-tree': { proceed: 'merge sort tree: range counting queries' },
      'centroid-decomp': { proceed: 'centroid decomposition: tree path queries' },
      'tree-dp': { proceed: 'tree DP: post-order state propagation (LC 124, 337, 968)' },
    },
    notThisPattern: [
      { signal: 'Not a tree problem', actually: 'Use a different D&C family' },
    ],
  }),

  'range-query-step3': d({
    whenAtThisStep: 'Range query problems. Which data structure?',
    xray: [
      { text: '**segment tree**: recursive, range sum with point updates (307)', kind: 'signal' },
      { text: '**BIT**: Binary Indexed Tree, prefix sums, 1-indexed (315)', kind: 'signal' },
    ],
    budget: ['segment tree', 'BIT'],
    sayIt: ['Segment tree (recursive, O(log n) query) or Binary Indexed Tree (compact, prefix sums)?'],
    branchGuides: {
      'seg-tree-basics': { proceed: 'segment tree: range sum with dynamic updates (LC 307, 715)' },
      'binary-indexed-tree': { proceed: 'BIT: prefix sums, 1-indexed (LC 315 coordinate compress)' },
    },
    notThisPattern: [
      { signal: 'Immutable array — no updates', actually: 'Use prefix sum pattern (prefix sums) instead' },
    ],
  }),

  'geometry-step3': d({
    whenAtThisStep: 'Computational geometry. Which geometric problem?',
    xray: [
      { text: '**closest pair**: minimum distance between 2D points', kind: 'signal' },
      { text: '**convex hull**: smallest convex polygon (Graham scan / merge hull)', kind: 'signal' },
      { text: '**intersections**: line segment intersection (sweep line)', kind: 'signal' },
    ],
    budget: ['closest pair', 'convex hull', 'intersections'],
    sayIt: ['Closest pair of points, convex hull, or geometric intersections?'],
    branchGuides: {
      'closest-pair': { proceed: 'closest pair: divide by x, strip check (2D)' },
      'convex-hull': { proceed: 'convex hull: Andrew\'s monotone chain / merge hull' },
      'geometric-intersections': { proceed: 'intersections: plane sweep, Bentley-Ottmann' },
    },
    notThisPattern: [
      { signal: 'Numeric array problem', actually: 'Use subarray or classic D&C' },
    ],
  }),

  'graph-step3': d({
    whenAtThisStep: 'Graph algorithms with D&C. Which problem?',
    xray: [
      { text: '**connectivity**: bridges, articulation points (Tarjan)', kind: 'signal' },
      { text: '**shortest path**: Johnson\'s all-pairs on sparse graphs', kind: 'signal' },
      { text: '**D&C DP opt**: monotonic DP transition optimization (1335)', kind: 'signal' },
    ],
    budget: ['connectivity', 'shortest path', 'DC DP opt'],
    sayIt: ['Graph connectivity (Tarjan), shortest paths (Johnson), or D&C DP optimization (monotonic transitions)?'],
    branchGuides: {
      'graph-connectivity': { proceed: 'connectivity: bridges, articulation (Tarjan\'s algorithm)' },
      'shortest-path-johnson': { proceed: 'shortest path: Johnson\'s, all-pairs (Bellman-Ford + Dijkstra)' },
      'dc-dp-optimization': { proceed: 'D&C DP opt: monotonic transitions (LC 1335)' },
    },
    notThisPattern: [
      { signal: 'Single-source shortest path', actually: 'Use Dijkstra / Bellman-Ford directly' },
    ],
  }),

  'parallel-step3': d({
    whenAtThisStep: 'Parallel computing with D&C. Which paradigm?',
    xray: [
      { text: '**map-reduce**: map = divide + solve, reduce = combine by key', kind: 'signal' },
      { text: '**parallel sort**: multi-threaded merge/quick sort', kind: 'signal' },
    ],
    budget: ['map-reduce', 'parallel sort'],
    sayIt: ['Map-Reduce (big data processing) or parallel sorting (multi-threaded merge/quick sort)?'],
    branchGuides: {
      'map-reduce': { proceed: 'map-reduce: parallel D&C on chunks, combine by key' },
      'parallel-sorting': { proceed: 'parallel sort: multi-threaded merge/quick sort' },
    },
    notThisPattern: [
      { signal: 'Single-threaded computation', actually: 'Use classic D&C' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
