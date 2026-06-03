import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const subsetsCombosNode: TaxonomyNode = decision(
  'subsets-combos',
  'Subsets / Combinations',
  'lime',
  3,
  'Generate subsets or combinations. Is the input distinct or with duplicates?',
  [
    branch(
      [
        '"subsets" with distinct integers',
        '"combinations" of size k from 1..n',
        'no duplicates in input',
      ],
      'Basic Subset Generation',
      'Standard choose/not-choose per element — O(2^n).',
      L.basicSubsetLeaf,
      ['duplicates in input', 'combination sum with target'],
    ),
    branch(
      [
        '"combination sum" with target',
        '"combo sum II" — each used once',
        '"combo sum III" — k numbers sum to n',
        'input may have duplicates, target sum constraint',
      ],
      'Combinations with Constraints',
      'Sort + skip dupes; prune when sum exceeds target.',
      L.combosWithConstraintsLeaf,
      ['distinct input no sum constraint', 'exact size combinations'],
    ),
  ],
)

const permutationsNode: TaxonomyNode = decision(
  'permutations',
  'Permutations',
  'teal',
  3,
  'Generate all arrangements. Are there duplicates or special ordering?',
  [
    branch(
      [
        '"permutations" of distinct integers',
        '"permutations II" with duplicates',
        'all n! arrangements',
      ],
      'Basic Permutation Generation',
      'Swap-based (no extra space) or used[] array — O(n!).',
      L.basicPermLeaf,
      ['next permutation only', 'circular arrangement'],
    ),
    branch(
      [
        '"next permutation" — in-place, lexicographically next',
        'only one arrangement needed, not all',
      ],
      'Circular / Special Permutations',
      'Scan from right; find first decreasing element; swap + reverse.',
      L.circularPermLeaf,
      ['all permutations', 'permutations with duplicates'],
    ),
  ],
)

const stringGenNode: TaxonomyNode = decision(
  'string-generation',
  'String Generation',
  'blue',
  3,
  'Generate strings by mapping or building from patterns. What drives the generation?',
  [
    branch(
      [
        '"letter combinations of phone number"',
        '"letter case permutation"',
        'each digit/char maps to a fixed set of chars',
      ],
      'Character-Based Generation',
      'Mapping table + recursive build per position.',
      L.charBasedGenLeaf,
      ['parentheses generation', 'restore IP addresses'],
    ),
    branch(
      [
        '"generate parentheses" — well-formed pairs',
        '"restore IP addresses" — valid IP from digits',
        'string structure enforced by rules (balance, range)',
      ],
      'Word-Based Generation',
      'Track open/close count (parentheses) or segment rules (IP).',
      L.wordBasedGenLeaf,
      ['digit-to-letter mapping', 'letter case permutation'],
    ),
  ],
)

const combinatorialGenNode: TaxonomyNode = decision(
  'combinatorial-generation',
  'Combinatorial Generation',
  'green',
  2,
  'Generating all possible combinations, permutations, or strings. Which category?',
  [
    branch(
      [
        '"subsets" / "combinations"',
        '"combination sum" with target',
        'choose or skip elements',
      ],
      'Subsets / Combinations',
      'Choose/not-choose per element; sort+prune for sum constraints.',
      subsetsCombosNode,
      ['permutations (ordering matters)', 'string generation', 'partition problems'],
    ),
    branch(
      [
        '"permutations" of array elements',
        '"next permutation" lexicographically',
        'arrangements where order matters',
      ],
      'Permutations',
      'Swap positions or track used indices — O(n!).',
      permutationsNode,
      ['subsets/combinations (order does not matter)', 'string generation'],
    ),
    branch(
      [
        '"letter combos of phone number"',
        '"generate parentheses"',
        '"restore IP addresses"',
        'build valid strings from templates or rules',
      ],
      'String Generation',
      'Map digits to chars, or enforce structural rules (balance, octets).',
      stringGenNode,
      ['numeric subsets', 'permutations of integers', 'partition numbers'],
    ),
    branch(
      [
        '"palindrome partitioning"',
        '"partition to k equal sum subsets"',
        '"split array into fibonacci sequence"',
        'divide a sequence into valid pieces',
      ],
      'Partition Problems',
      'Explore split points; check validity at each prefix.',
      L.partitionLeaf,
      ['subset sum without partition order', 'board filling constraints'],
    ),
  ],
)

const boardFillingNode: TaxonomyNode = decision(
  'board-filling',
  'Board Filling',
  'purple',
  3,
  'Place items on a board subject to constraints. Which type of board problem?',
  [
    branch(
      [
        '"n-queens" / "n-queens II"',
        '"sudoku solver"',
        'standard constraint satisfaction on NxN board',
      ],
      'Classic Board Problems',
      'Place queens row by row, check diag/col; for Sudoku fill empty cells with valid digits.',
      L.classicBoardLeaf,
      ['game board with scoring', 'valid sudoku check only'],
    ),
    branch(
      [
        '"valid sudoku" — check not solve',
        '"path with maximum gold"',
        'scoring or validity on a game board',
      ],
      'Game Board Explorations',
      'Validate rules or explore all moves for max score.',
      L.gameBoardLeaf,
      ['full constraint satisfaction solution'],
    ),
  ],
)

const constraintSatNode: TaxonomyNode = decision(
  'constraint-satisfaction',
  'Constraint Satisfaction',
  'blue',
  2,
  'Find arrangements that satisfy requirements. What type of constraint?',
  [
    branch(
      [
        '"n-queens" / "sudoku solver"',
        '"valid sudoku" / "path with max gold"',
        'board-based constraints — rows, columns, boxes, or grid moves',
      ],
      'Board Filling',
      'Place items on board with backtrack + constraint propagation.',
      boardFillingNode,
      ['pattern matching in strings', 'resource assignment'],
    ),
    branch(
      [
        '"word search" on grid',
        '"word search II" with trie',
        '"word pattern" bijection mapping',
      ],
      'Word Pattern Matching',
      'DFS on grid or bijection map between pattern and words.',
      L.wordPatternLeaf,
      ['board filling placement', 'graph coloring problem'],
    ),
    branch(
      [
        '"minimum incompatibility"',
        '"number of squareful arrays"',
        'assign/distribute items with pairwise constraints',
      ],
      'Assignment Problems',
      'Backtrack with state bitmask; prune with constraint checks.',
      L.assignmentLeaf,
      ['board filling', 'pattern matching in strings'],
    ),
  ],
)

const pathFindingNode: TaxonomyNode = decision(
  'path-finding',
  'Path Finding',
  'lime',
  3,
  'Find routes between nodes. All possible paths or constrained paths?',
  [
    branch(
      [
        '"all paths from source to target"',
        '"critical connections in a network"',
        'enumerate every route or find bridge edges',
      ],
      'All Possible Paths',
      'DFS from source to target, track visited nodes.',
      L.allPathsLeaf,
      ['path with obstacle/unvisited constraint', 'single shortest path'],
    ),
    branch(
      [
        '"unique paths III" — walk all empty cells',
        '"robot room cleaner" — unknown grid',
        'must visit all cells or clean entire room',
      ],
      'Path with Constraints',
      'Backtrack with full exploration + obstacle rules.',
      L.pathConstraintsLeaf,
      ['simple path enumeration', 'shortest path ignoring obstacles'],
    ),
  ],
)

const graphExplorationNode: TaxonomyNode = decision(
  'graph-exploration',
  'Graph Exploration',
  'teal',
  2,
  'Traverse graphs or color them with backtracking. Which operation?',
  [
    branch(
      [
        '"all paths from source to target"',
        '"critical connections" (Tarjan)',
        '"unique paths III" / "robot room cleaner"',
        'zero or constrained path exploration',
      ],
      'Path Finding',
      'DFS backtrack exploring all routes between nodes.',
      pathFindingNode,
      ['graph coloring / bipartite check', 'matrix traversal without graph'],
    ),
    branch(
      [
        '"is graph bipartite?"',
        '"possible bipartition"',
        'assign two colors to vertices such that no adjacent share color',
      ],
      'Graph Coloring',
      'BFS/DFS with two colors; backtrack on conflict.',
      L.graphColoringLeaf,
      ['enumerate all paths', 'matrix grid traversal'],
    ),
    branch(
      [
        '"word search" in 2D grid',
        '"longest increasing path in matrix"',
        '"knight probability" on chessboard',
        '2D grid with DFS + backtrack',
      ],
      'Matrix Exploration',
      'DFS on grid with direction deltas and visited state.',
      L.matrixExplorationLeaf,
      ['graph edge list input', 'board filling placement puzzle'],
    ),
  ],
)

const optimizationBacktrackNode: TaxonomyNode = decision(
  'optimization-backtrack',
  'Optimization with Backtracking',
  'orange',
  2,
  'Find the best solution with pruning or memoization. Which technique?',
  [
    branch(
      [
        '"max length concatenated unique chars"',
        '"closest dessert cost"',
        'pruning / branch-and-bound to cut non-optimal branches',
      ],
      'Branch and Bound',
      'Exhaustive search with bound pruning; skip branches worse than current best.',
      L.branchBoundLeaf,
      ['memoization caching results', 'adversarial game theory'],
    ),
    branch(
      [
        '"word break" — can segment?',
        '"word break II" — all segmentations',
        'subproblems repeat; cache results by index',
      ],
      'Memoization + Backtracking',
      'Backtrack with DP memoization: cache subproblem results (index-based).',
      L.memoizationLeaf,
      ['branch and bound pruning only', 'minimax decision making'],
    ),
    branch(
      [
        '"predict the winner"',
        '"stone game II"',
        'two players, optimal play, maximize/minimize score',
      ],
      'Minimax (Game Theory)',
      'Recursive minmax with memoization; each player maximizes own score.',
      L.minimaxLeaf,
      ['single-player optimization', 'simple branching without adversary'],
    ),
  ],
)

export const backtrackingRoot: TaxonomyNode = decision(
  'bt-root',
  'Backtracking',
  'slate',
  1,
  'Before coding: identify the PROBLEM TYPE. Combinatorial generation, constraint satisfaction, graph exploration, or optimization with pruning?',
  [
    branch(
      [
        '"subsets" / "permutations" / "combinations"',
        '"generate parentheses" / "letter combos"',
        '"palindrome partitioning"',
        'generate all arrangements',
      ],
      '→ Combinatorial Generation',
      'Generate all subsets, permutations, strings, or partitions. Explore all candidates.',
      combinatorialGenNode,
      ['satisfying constraints on board', 'optimal value pruning'],
    ),
    branch(
      [
        '"n-queens" / "sudoku solver"',
        '"word search" with specific pattern',
        '"assignment" with pairwise constraints',
        'find any/all valid arrangements meeting rules',
      ],
      '→ Constraint Satisfaction',
      'Place / assign items satisfying rules. Prune invalid placements early.',
      constraintSatNode,
      ['generate all permutations without board', 'optimization via branch-and-bound'],
    ),
    branch(
      [
        '"all paths source to target"',
        '"graph bipartite" coloring',
        '"longest increasing path" in matrix',
        'traverse graph or grid with backtracking',
      ],
      '→ Graph Exploration',
      'DFS backtrack on graphs, coloring, or matrix cells.',
      graphExplorationNode,
      ['combinatorial string generation', 'placement on empty board'],
    ),
    branch(
      [
        '"max length unique concatenation"',
        '"word break" with memoization',
        '"predict the winner" / "stone game"',
        'optimize score with branch-and-bound or memoization',
      ],
      '→ Optimization with Backtracking',
      'Prune with bounds or cache subproblem results. Adversarial for game theory.',
      optimizationBacktrackNode,
      ['enumerate all without optimization', 'simple DP without backtracking'],
    ),
  ],
)
