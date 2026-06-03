import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

/* ──────────────────────────────────────────
   1D State DP sub-nodes
   ────────────────────────────────────────── */

const linearSequenceDpNode: TaxonomyNode = decision(
  'linear-sequence-dp',
  'Linear Sequence DP',
  'lime',
  3,
  'Solutions built left-to-right. Classic sequence pattern or Kadane-style running state?',
  [
    branch(
      [
        '"climbing stairs" — ways to reach step n',
        '"house robber" — max sum no adjacent',
        '"word break" — can segment at indices',
        'dp[i] depends on dp[i-1], dp[i-2], or earlier splits',
      ],
      'Classic Problems',
      'Standard dp[i] = f(dp[i-1], dp[i-2], …). Linear O(n) with O(1) or O(n) space.',
      L.classicLinearDpLeaf,
      ['Kadane running max subarray', 'Fibonacci-style recurrence only'],
    ),
    branch(
      [
        '"maximum subarray" — Kadane',
        '"maximum product subarray" — track both min/max',
        'running state updated per element, no dp array needed',
      ],
      "Kadane's Algorithm",
      'Running cur = max(x, cur + x) for sum; track curMax/curMin for product.',
      L.kadaneDpLeaf,
      ['standard multi-step dp[i]', 'house robber non-adjacent constraint'],
    ),
  ],
)

const decisionMakingDpNode: TaxonomyNode = decision(
  'decision-making-dp',
  'Decision Making',
  'teal',
  3,
  'Optimal choice at each position. Stock trading or game theory?',
  [
    branch(
      [
        '"best time to buy/sell stock" I, II, III',
        'at most k transactions',
        'cooldown / transaction fee',
      ],
      'Buy / Sell Stock Problems',
      'Hold/sell DP: dp[i][k][hold]. Transactions limited (III) or unlimited (II).',
      L.buySellStockDpLeaf,
      ['two-player game theory', 'single transaction only'],
    ),
    branch(
      [
        '"stone game" — optimal play',
        '"stone game III" — pick 1..3 piles',
        'two players, both optimal, score difference',
      ],
      'Game Theory',
      'Minimax DP: score = max(pick - oppBest). Memoize on state (l,r) or (i).',
      L.gameTheoryDpLeaf,
      ['stock trading with k transactions', 'single player maximize'],
    ),
  ],
)

const oneDimStateDpNode: TaxonomyNode = decision(
  '1d-state-dp',
  '1D State DP',
  'green',
  2,
  'Single state variable. Match the sub-pattern: linear sequence, decision making, or Fibonacci recurrence?',
  [
    branch(
      [
        '"climbing stairs" / "house robber"',
        '"word break" / "maximum subarray"',
        'dp[i] depends on dp[i-1], dp[i-2], or running state',
        'solutions built left to right',
      ],
      'Linear Sequence DP',
      'dp[i] = f(dp[i-1], dp[i-2], …) or Kadane running state. O(n) time.',
      linearSequenceDpNode,
      ['stock decisions with hold/sell states', 'game theory two players'],
    ),
    branch(
      [
        '"best time to buy/sell" with states',
        '"stone game" optimal play',
        'multiple states per position (hold, sold, cooldown)',
        'minimax score difference',
      ],
      'Decision Making',
      'Multiple states per index (hold/cash). Game theory with minimax recursion.',
      decisionMakingDpNode,
      ['single-state recurrence like Fibonacci', 'Kadane running max'],
    ),
    branch(
      [
        '"fibonacci number" — classic recurrence',
        '"n-th tribonacci"',
        '"decode ways" — dp[i] = dp[i-1] + dp[i-2] …',
        'next depends on last K states, no complex choices',
      ],
      'Fibonacci-Style DP',
      'dp[i] = sum of dp[i-1], dp[i-2], …, dp[i-k]. Simple recurrence, O(n) / O(k) space.',
      L.fibonacciStyleDpLeaf,
      ['decision-based DP with multiple states', 'house robber max/min choice'],
    ),
  ],
)

/* ──────────────────────────────────────────
   Substring / Subsequence DP
   ────────────────────────────────────────── */

const substringSubseqDpNode: TaxonomyNode = decision(
  'substring-subsequence-dp',
  'Substring / Subsequence Problems',
  'blue',
  2,
  'Work with portions of sequences. Which pattern? LIS, LCS, edit distance, or palindromes?',
  [
    branch(
      [
        '"longest increasing subsequence"',
        '"number of longest increasing subseq"',
        '"longest string chain" — LIS variant',
        'one sequence, pick/not-pick elements in order',
      ],
      'LIS',
      'dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i]. O(n²) or O(n log n) with patience.',
      L.lisDpLeaf,
      ['two sequences LCS', 'edit distance operations'],
    ),
    branch(
      [
        '"longest common subsequence"',
        '"delete operation for two strings"',
        '"shortest common supersequence"',
        'two sequences, match or skip',
      ],
      'LCS',
      'dp[i][j] = match? 1+dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1]). O(mn).',
      L.lcsDpLeaf,
      ['single sequence LIS', 'edit distance insert/delete/replace'],
    ),
    branch(
      [
        '"edit distance" — insert, delete, replace',
        '"distinct subsequences" — count matches',
        'transform one string into another',
      ],
      'Edit Distance',
      'dp[i][j] = if match: dp[i-1][j-1] else 1+min(ins, del, rep).',
      L.editDistanceDpLeaf,
      ['LCS compare without edits', 'palindrome subsequence'],
    ),
    branch(
      [
        '"longest palindromic subsequence"',
        '"minimum insertions to make palindrome"',
        'expand or shrink from both ends of sequence',
      ],
      'Palindromic Subsequences',
      'dp[i][j] = if s[i]==s[j] then 2+dp[i+1][j-1] else max(dp[i+1][j], dp[i][j-1]).',
      L.palindromicDpLeaf,
      ['LCS between two strings', 'subarray not subsequence'],
    ),
  ],
)

/* ──────────────────────────────────────────
   2D / Multi-Dimensional DP sub-nodes
   ────────────────────────────────────────── */

const gridBasedDpNode: TaxonomyNode = decision(
  'grid-based-dp',
  'Grid-Based DP',
  'lime',
  3,
  'Problems on 2D matrices. What kind of grid problem?',
  [
    branch(
      [
        '"unique paths" — ways from corner to corner',
        '"minimum path sum" — min cost path',
        '"unique paths II" — with obstacles',
        'robot moving right/down in grid',
      ],
      'Path Problems',
      'dp[i][j] = dp[i-1][j] + dp[i][j-1] (ways) or min/max. O(mn).',
      L.gridPathDpLeaf,
      ['maximal square of ones', 'triangle min path sum'],
    ),
    branch(
      [
        '"maximal square" of all 1s',
        '"maximal rectangle" of all 1s',
        '"count square submatrices" of all 1s',
        'find largest region meeting condition',
      ],
      'Region Problems',
      'dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for squares. Histogram approach for rectangles.',
      L.gridRegionDpLeaf,
      ['path counting/sum from top-left', 'triangle min path sum'],
    ),
    branch(
      [
        '"triangle" minimum path sum',
        '"minimum falling path sum"',
        'variable movement directions, not just right/down',
      ],
      'Grid Traversal with Constraints',
      'dp[row][col] = value + min(dp[row+1][col], dp[row+1][col+1], …). Traverse bottom-up.',
      L.gridTraversalConstrainedDpLeaf,
      ['fixed right/down moves', 'maximal square region'],
    ),
  ],
)

const knapsackProblemsNode: TaxonomyNode = decision(
  'knapsack-problems',
  'Knapsack Problems',
  'orange',
  3,
  'Resource allocation with constraints. Which knapsack variant?',
  [
    branch(
      [
        '"partition equal subset sum"',
        '"target sum" — assign + or -',
        '"ones and zeroes" — 2D knapsack',
        'each item taken at most once (take or leave)',
      ],
      '0/1 Knapsack',
      'dp[capacity] = dp[capacity] || dp[capacity - w[i]] (feasibility). For each item, iterate capacity descending.',
      L.knapsack01Leaf,
      ['unlimited reuse of each item', 'multiple constraints'],
    ),
    branch(
      [
        '"coin change" — fewest coins to amount',
        '"coin change 2" — number of combos',
        '"combination sum IV" — number of permutations',
        'each item can be used unlimited times',
      ],
      'Unbounded Knapsack',
      'dp[amount] = min(dp[amount], dp[amount - coin] + 1) for min coins. For combinations, iterate coins outer, amount inner.',
      L.knapsackUnboundedLeaf,
      ['each item at most once', 'multi-constraint knapsack'],
    ),
    branch(
      [
        '"number of dice rolls with target sum"',
        'multiple dice, each die has k faces',
        'multiple constraints — dice count + sum target',
      ],
      'Multi-Constraint Knapsack',
      'dp[roll][sum] = sum dp[roll-1][sum - face] over face 1..k. 2D state (count, sum).',
      L.knapsackMultiConstraintLeaf,
      ['single-constraint 0/1 or unbounded'],
    ),
  ],
)

const twoDimMultiDimDpNode: TaxonomyNode = decision(
  '2d-multi-dim-dp',
  '2D / Multi-Dimensional DP',
  'teal',
  2,
  'Multiple state variables. Grid-based DP, interval DP, or knapsack resource allocation?',
  [
    branch(
      [
        '"unique paths" / "minimum path sum"',
        '"maximal square" / "maximal rectangle"',
        '"triangle" / "falling path sum"',
        '2D grid with cell-by-cell DP',
      ],
      'Grid-Based DP',
      'dp on grid coordinates — path count, min/max sum, or region detection.',
      gridBasedDpNode,
      ['interval merging', 'knapsack capacity constraint'],
    ),
    branch(
      [
        '"burst balloons" — maximize coins',
        '"minimum score triangulation"',
        '"minimum cost to cut a stick"',
        'problem involves ranges / intervals of an array',
      ],
      'Interval DP',
      'dp[l][r] = max/min over k in (l,r) of combining left[l..k] and right[k+1..r]. Length outer loop.',
      L.intervalDpLeaf,
      ['grid path problem', 'knapsack item selection'],
    ),
    branch(
      [
        '"partition equal subset sum"',
        '"coin change" / "coin change 2"',
        '"ones and zeroes" / "dice rolls"',
        'select items subject to capacity / count constraints',
      ],
      'Knapsack Problems',
      'Item selection with capacity constraint. 0/1, unbounded, or multi-constraint variants.',
      knapsackProblemsNode,
      ['grid-based coordinate DP', 'interval range DP'],
    ),
  ],
)

/* ──────────────────────────────────────────
   State Compression DP
   ────────────────────────────────────────── */

const stateCompressionDpNode: TaxonomyNode = decision(
  'state-compression-dp',
  'State Compression DP',
  'purple',
  2,
  'Use bits to represent state. Bitmask subset enumeration or TSP path covering?',
  [
    branch(
      [
        '"subsets" — iterate over all subsets',
        '"maximum students taking exam" — seat arrangement',
        '"partition to k equal sum subsets"',
        'state is a bitmask representing which items are used',
      ],
      'Bitmask DP',
      'dp[mask] = result for subset represented by mask. Iterate over masks, transition by adding one element.',
      L.bitmaskDpLeaf,
      ['TSP path covering all nodes', 'no state compression needed'],
    ),
    branch(
      [
        '"find shortest superstring" — overlap',
        '"unique paths III" — visit all cells exactly once',
        'find optimal path visiting all nodes / cells',
        'Held-Karp: dp[mask][last] = min cost to visit mask ending at last',
      ],
      'TSP (Traveling Salesman)',
      'dp[mask][last] = min(dp[mask without last][prev] + cost(prev, last)). O(2^n * n²).',
      L.tspDpLeaf,
      ['simple bitmask subset enumeration', 'no path ordering constraint'],
    ),
  ],
)

/* ──────────────────────────────────────────
   DP Optimization Techniques
   ────────────────────────────────────────── */

const dpOptimizationNode: TaxonomyNode = decision(
  'dp-optimization',
  'DP Optimization Techniques',
  'orange',
  2,
  'Reduce time or space complexity. Space optimization, D&C, or monotonic data structures?',
  [
    branch(
      [
        '"climbing stairs" — O(1) space with rolling vars',
        '"best time to buy/sell" — O(1) with state reduction',
        'only last K states needed, not full array',
      ],
      'Space Optimization',
      'Rolling array (2 variables instead of n) or state reduction (combine dimensions).',
      L.spaceOptimizationDpLeaf,
      ['divide and conquer DP optimization', 'monotonic queue optimization'],
    ),
    branch(
      [
        '"minimum difficulty of job schedule"',
        'dp[i][k] = min over j of dp[j-1][k-1] + max(j..i)',
        'optimizing DP where transition is min over a range — use D&C DP for O(n log n) or O(n²)',
      ],
      'Divide & Conquer DP',
      'Recursively compute DP with divide-and-conquer when transition cost is monotonic. Knuth or divide-conquer optimization.',
      L.divideConquerDpLeaf,
      ['space reduction only', 'monotonic queue sliding window'],
    ),
    branch(
      [
        '"constrained subsequence sum" — max sum with gap constraint',
        'dp[i] = nums[i] + max(dp[j]) for j in [i-k, i-1]',
        'need max over sliding window of dp values',
      ],
      'Monotonic Queue / Stack Optimization',
      'Maintain deque of dp values in decreasing order. O(n) for problems that need range max/min queries.',
      L.monotonicQueueDpLeaf,
      ['D&C DP for range min transition'],
    ),
  ],
)

/* ──────────────────────────────────────────
   Root
   ────────────────────────────────────────── */

export const dpRoot: TaxonomyNode = decision(
  'dp-root',
  'Dynamic Programming',
  'slate',
  1,
  'Before coding: identify the DP DIMENSION. One state variable, substring/subsequence, 2D/multi-dimensional, state compression, or need optimization technique?',
  [
    branch(
      [
        '"climbing stairs" / "house robber"',
        '"maximum subarray" / "fibonacci"',
        '"best time to buy/sell stock"',
        'single state variable dp[i]',
      ],
      '→ 1D State DP',
      'Single index i; dp[i] depends on previous 1..K states. Sequence or running state.',
      oneDimStateDpNode,
      ['2D table for subsequence matching', 'grid with two indices', 'bitmask state'],
    ),
    branch(
      [
        '"longest increasing subsequence"',
        '"longest common subsequence"',
        '"edit distance" / "palindromic subseq"',
        'compare portions of one or two sequences',
      ],
      '→ Substring / Subsequence Problems',
      '2D DP table comparing prefixes or ranges. Match/skip logic.',
      substringSubseqDpNode,
      ['single-array 1D DP', 'grid-based path DP', 'interval DP on array'],
    ),
    branch(
      [
        '"unique paths" in grid',
        '"burst balloons" — interval',
        '"coin change" — knapsack',
        'two or more state dimensions (i, j, capacity)',
      ],
      '→ 2D / Multi-Dimensional DP',
      'Grid coordinates, interval ranges, or resource capacity. Multi-dimensional table.',
      twoDimMultiDimDpNode,
      ['single-state recurrence', 'bitmask state compression'],
    ),
    branch(
      [
        '"subsets" with bitmask',
        '"shortest superstring" TSP',
        'state must track which elements are used',
        'n ≤ 20 typically',
      ],
      '→ State Compression DP',
      'dp[mask][last] = cost to reach state (mask, last). Enumerate over bitmasks.',
      stateCompressionDpNode,
      ['full O(n²) DP without mask', 'grid-based DP without compression'],
    ),
    branch(
      [
        'existing DP needs space reduction',
        '"job schedule" D&C DP',
        '"constrained sum" monotonic queue',
        'improve time or space with advanced technique',
      ],
      '→ DP Optimization Techniques',
      'Reduce space (rolling array), D&C DP for certain transitions, or monotonic queue for range max/min queries.',
      dpOptimizationNode,
      ['first implementation of DP without optimization'],
    ),
  ],
)
