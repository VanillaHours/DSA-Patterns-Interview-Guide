import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Interval Processing (step 2) ─────────────────────────────────

const intervalScheduling: TaxonomyNode = decision(
  'interval-scheduling-step3',
  'Interval Scheduling — what kind of interval problem?',
  'amber',
  3,
  'You have intervals with start/end. Read the operation required:',
  [
    branch(
      ['"non-overlapping"', '"minimum arrows"', '"minimum taps"'],
      'Activity Selection',
      'Sort by end; greedy pick earliest-ending non-overlapping.',
      L.activitySelectLeaf,
      ['merge intervals', 'sweep line events'],
    ),
    branch(
      ['"merge intervals"', '"interval list intersections"', '"video stitching"'],
      'Interval Merging',
      'Sort by start; merge touching/overlapping ranges.',
      L.intervalMergeLeaf,
    ),
    branch(
      ['"remove covered"', '"partition labels"', '"video stitching" coverage'],
      'Interval Coverage',
      'Sort by start descending end; track farthest reach.',
      L.intervalCoverageLeaf,
    ),
    branch(
      ['"skyline"', '"meeting rooms II"', '"employee free time"'],
      'Skyline & Sweep Line',
      'Event points: +1 at start, -1 at end; sweep in order.',
      L.skylineSweepLeaf,
    ),
  ],
)

const mstFamily: TaxonomyNode = decision(
  'mst-step3',
  'Minimum Spanning Tree — which approach?',
  'lime',
  3,
  'You need to connect all points/nodes with minimum total cost:',
  [
    branch(
      ['"min cost connect points"', '"critical edges in MST"'],
      "Kruskal's Algorithm",
      'Sort edges by weight; union-find to add edges without cycles.',
      L.kruskalsLeaf,
      ['dense graph', 'need Prim O(n²)'],
    ),
    branch(
      ['"connecting cities"', '"optimize water distribution"'],
      "Prim's Algorithm",
      'Start from any node; always add the cheapest frontier edge.',
      L.primsLeaf,
      ['sparse graph', 'need edge list sorted'],
    ),
  ],
)

const intervalProcessing: TaxonomyNode = decision(
  'interval-step2',
  'Interval Processing',
  'green',
  2,
  'Prompt mentions intervals, ranges, or connecting points. Pick ONE:',
  [
    branch(
      ['"intervals"', '"non-overlapping"', '"merge"', '"skyline"', '"sweep line"', '"meeting rooms"'],
      'Interval Scheduling',
      'Sort intervals by end; greedy pick/merge/cover.',
      intervalScheduling,
      ['connect all points with min cost'],
    ),
    branch(
      ['"connect all points"', '"minimum cost to connect"', '"mst"', '"spanning tree"'],
      'Minimum Spanning Tree',
      'Connect all nodes with minimum total edge weight.',
      mstFamily,
      ['interval scheduling', 'non-overlapping'],
    ),
  ],
)

// ── Selection Problems (step 2) ──────────────────────────────────

const selectionProblems: TaxonomyNode = decision(
  'selection-step2',
  'Selection Problems',
  'blue',
  2,
  'You need to pick/choose elements to optimize a result. Match ONE:',
  [
    branch(
      ['"majority element"', '"task scheduler"', '"largest values from labels"', 'frequency / count based'],
      'Frequency-Based Selection',
      'Use element frequencies to decide which to keep or schedule.',
      L.frequencySelectLeaf,
    ),
    branch(
      ['"assign cookies"', '"two city scheduling"', '"last stone weight"', 'value / cost comparison'],
      'Value-Based Selection',
      'Pick elements based on direct value comparisons.',
      L.valueSelectLeaf,
    ),
    branch(
      ['"boats to save people"', '"broken calculator"', '"gas station"', 'value/weight ratio or feasibility'],
      'Ratio-Based Selection',
      'Sort by ratio or adjust greedily toward a target.',
      L.ratioSelectLeaf,
    ),
    branch(
      ['"connect sticks"', '"make rope colorful"', '"advantage shuffle"', 'construct result stepwise'],
      'Iterative Construction',
      'Build result one element at a time using greedy choice.',
      L.iterativeConstructionLeaf,
    ),
  ],
)

// ── Greedy Path & Search (step 2) ────────────────────────────────

const greedyPathSearch: TaxonomyNode = decision(
  'path-search-step2',
  'Greedy Path & Search',
  'teal',
  2,
  'Problem involves moving through a path, graph, or string. Match ONE:',
  [
    branch(
      ['"jump game"', '"jump game II"', '"jump game III"', 'reach index / min jumps'],
      'Path Building',
      'Track max reachable index; greedy jump when exhausted.',
      L.pathBuildingLeaf,
      ['weighted graph', 'Dijkstra path'],
    ),
    branch(
      ['"path with min effort"', '"path with max min value"', '"swim in rising water"', 'grid with elevation'],
      'Graph Exploration',
      'Priority-queue BFS: expand the most promising frontier edge.',
      L.graphExplorationLeaf,
    ),
    branch(
      ['"find permutation"', '"reorganize string"', '"longest happy string"', 'build string with constraints'],
      'String Construction',
      'Place most frequent char next; avoid triple repeats.',
      L.stringConstructionLeaf,
    ),
  ],
)

// ── Prefix/Suffix Optimization (step 2) ──────────────────────────

const prefixSuffixOpt: TaxonomyNode = decision(
  'prefix-suffix-step2',
  'Prefix/Suffix Optimization',
  'orange',
  2,
  'Running calculations while iterating — prefix sums, extrema, or two-pass. Match ONE:',
  [
    branch(
      ['"best time to buy/sell"', '"max sum circular subarray"', '"max points from cards"', 'prefix sum / kadane'],
      'Prefix Sum Application',
      'Compute cumulative sums or Kadane running max/min.',
      L.prefixSumLeaf,
      ['only running min/max with no prefix sum'],
    ),
    branch(
      ['"gas station"', '"consecutive subsequences"', '"minimum refueling stops"', 'running balance / min encounters'],
      'Running Minimum/Maximum',
      'Track running sum/min/max during a single pass.',
      L.runningMinMaxLeaf,
    ),
    branch(
      ['"trapping rain water"', '"candy distribution"', '"good ways to split string"', 'forward then backward pass'],
      'Two-Pass Algorithms',
      'First pass builds left state; second pass builds right; combine.',
      L.twoPassLeaf,
    ),
  ],
)

// ── Incremental Construction (step 2) ────────────────────────────

const incrementalConstruction: TaxonomyNode = decision(
  'incremental-step2',
  'Incremental Construction',
  'purple',
  2,
  'Build the result piece by piece — digits, swaps, or priority ordering. Match ONE:',
  [
    branch(
      ['"remove k digits"', '"remove duplicate letters"', '"create maximum number"', 'build from left using stack'],
      'Digit/Character Construction',
      'Monotonic stack: remove larger peaks to make smallest/biggest.',
      L.digitCharConstructLeaf,
    ),
    branch(
      ['"minimum swaps to make equal"', '"min domino rotations"', '"maximum swap"', 'swap / exchange elements'],
      'Greedy Exchange Arguments',
      'Prove optimality via exchange: local swaps achieve global optimum.',
      L.greedyExchangeLeaf,
    ),
    branch(
      ['"rearrange string k apart"', '"ipo"', '"max events attended"', 'priority queue ordering'],
      'Prioritized Processing',
      'Use heap to get the best element at each step.',
      L.prioritizedProcessingLeaf,
    ),
  ],
)

// ── Root Decision (step 1) ───────────────────────────────────────

export const greedyRoot: TaxonomyNode = decision(
  'greedy-root',
  'Greedy Algorithms',
  'slate',
  1,
  'Greedy: make the locally optimal choice at each step. Which domain does the problem operate in?',
  [
    branch(
      ['interval', 'range', 'non-overlapping', 'merge intervals', 'sweep line', 'mst', 'connect points with min cost'],
      '→ Interval Processing',
      'Sort by end or weight; greedy pick/merge/connect.',
      intervalProcessing,
      ['pick K elements by value or frequency'],
    ),
    branch(
      ['pick', 'select', 'assign', 'schedule tasks', 'frequency', 'majority', 'cookie'],
      '→ Selection Problems',
      'Choose elements based on frequency, value, ratio, or priority.',
      selectionProblems,
      ['intervals with start/end', 'running prefix only'],
    ),
    branch(
      ['jump', 'reach', 'path', 'graph', 'traverse grid', 'reorganize string'],
      '→ Greedy Path & Search',
      'Move through space: max reach, priority frontier, or string building.',
      greedyPathSearch,
      ['interval scheduling', 'prefix sum'],
    ),
    branch(
      ['prefix sum', 'running minimum', 'running maximum', 'two-pass', 'forward backward', 'kadane'],
      '→ Prefix/Suffix Optimization',
      'Single-pass running calculations or two-pass combine.',
      prefixSuffixOpt,
      ['select elements by value'],
    ),
    branch(
      ['remove k', 'remove duplicate', 'create number', 'swap', 'exchange', 'priority', 'heap order'],
      '→ Incremental Construction',
      'Build result stepwise; monotonic stack or priority queue.',
      incrementalConstruction,
      ['interval processing'],
    ),
  ],
)
