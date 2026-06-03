import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Need to answer range sum queries efficiently (O(1) after O(n) precompute)',
    'Subarray sum = k, divisible by k, or other prefix-derived property',
    'Cumulative tracking — running sum, product, XOR, or min/max',
    'Range updates (add v to [l, r]) with single final query',
    '2D rectangle sum queries or submatrix counting',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. Ask: can we precompute cumulative values to answer repeated range queries or subarray problems?',
  xray: [
    { text: 'Given an array **nums**, return the **running sum** …', kind: 'goal' },
    { text: 'Find the number of **subarrays** whose sum equals **k**', kind: 'goal' },
    { text: 'Implement **sumRegion(row1, col1, row2, col2)** in O(1)', kind: 'goal' },
    { text: 'You have multiple **range update** queries and one final query', kind: 'signal' },
    { text: '**XOR** of elements in range [l, r]', kind: 'goal' },
  ],
  budget: ['prefixSum', 'rangeSum', 'subarraySum', 'diffArray'],
  sayIt: [
    'Before any template: does the problem need cumulative sums for O(1) range queries or subarray analysis?',
    'If yes — 1D prefix sum, 2D prefix sum, difference array, or non-additive (XOR/min/max)?',
  ],
  branchGuides: {
    '1d-range-step2': {
      proceed: 'WHEN: basic range query, pivot, or prefix product',
      whenExtra: ['range sum query', 'running sum', 'pivot', 'product except self'],
    },
    'subarray-map-step2': {
      proceed: 'WHEN: subarray sum properties with hash map',
      whenExtra: ['subarray sum = k', 'contiguous 0/1', 'nice subarrays'],
    },
    '2d-prefix-step2': {
      proceed: 'WHEN: 2D rectangle queries or submatrix counting',
      whenExtra: ['2D range sum', 'matrix block', 'submatrix target'],
    },
    'diff-array-step2': {
      proceed: 'WHEN: range updates with single reconstruction or line sweep',
      whenExtra: ['range addition', 'flight bookings', 'car pooling', 'skyline'],
    },
    'advanced-prefix-step2': {
      proceed: 'WHEN: XOR, min/max, or GCD as the prefix operation',
      whenExtra: ['xor queries', 'constrained subsequence'],
    },
  },
  notThisPattern: [
    { signal: '"mutable array" + range sum', actually: 'Segment tree or BIT — not prefix sum (rebuilds on update).' },
    { signal: '"sliding window" subarray with monotonic property', actually: 'Consider sliding window pattern instead of prefix sum.' },
  ],
  misidentify: [
    {
      cause: 'Using prefix sum for mutable queries',
      wrong: 'precompute prefix sum but array values change',
      testCase: 'LC 307 (Range Sum Mutable)',
      fix: 'Use segment tree or Fenwick (BIT) for mutable range sum.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'ps-root': PATTERN_GATE,

  '1d-range-step2': d({
    whenAtThisStep: '1D prefix sum — range query, equilibrium, or product.',
    xray: [
      { text: '**Range sum** query from l to r (immutable)', kind: 'goal' },
      { text: '**Pivot index** where left sum = right sum', kind: 'goal' },
      { text: '**Product** of array except self (no division)', kind: 'goal' },
    ],
    budget: ['rangeSum', 'prefixSum', 'equilibrium', 'prefixProduct'],
    sayIt: ['Range: pref[r+1] - pref[l]. Pivot: total - left - nums[i] == left. Product: left * right suffix.'],
    branchGuides: {
      'basic-range': { proceed: 'WHEN: range sum or running sum' },
      pivot: { proceed: 'WHEN: equilibrium index, fair array' },
      'prefix-product': { proceed: 'WHEN: product except self (no division)' },
    },
  }),

  'subarray-map-step2': d({
    whenAtThisStep: 'Subarray sum solved with prefix + hash map.',
    xray: [
      { text: 'Count subarrays where **sum = k**', kind: 'goal' },
      { text: 'Find **max subarray sum** (Kadane)', kind: 'goal' },
      { text: '**Longest** subarray with **equal 0s and 1s**', kind: 'goal' },
    ],
    budget: ['subarraySum', 'prefixMap', 'kadane', 'remainder'],
    sayIt: ['Target: prefix sum + map[sum-k]. Max: Kadane. Longest: first occurrence map.'],
    branchGuides: {
      'target-subarray': { proceed: 'WHEN: count subarrays by sum/remainder' },
      'max-subarray': { proceed: 'WHEN: Kadane / max subarray sum' },
      'longest-balanced': { proceed: 'WHEN: longest with property (0→-1, 1→1)' },
      'nice-array': { proceed: 'WHEN: count with k odds / binary sum' },
    },
  }),

  '2d-prefix-step2': d({
    whenAtThisStep: '2D prefix sum for matrices.',
    xray: [
      { text: '**Rectangle sum** query on 2D matrix', kind: 'goal' },
      { text: 'Count submatrices that **sum to target**', kind: 'goal' },
      { text: '**Count squares** of all 1s', kind: 'goal' },
    ],
    budget: ['rectSum', 'submatrix', 'countSquares'],
    sayIt: ['Rectangle: inclusion-exclusion 2D prefix. Submatrix: row compression + 1D hash map. Squares: DP.'],
    branchGuides: {
      'rect-sum': { proceed: 'WHEN: static rectangle sum queries' },
      submatrix: { proceed: 'WHEN: count submatrices summing to target' },
      'count-squares': { proceed: 'WHEN: count all-1 squares via DP' },
    },
  }),

  'diff-array-step2': d({
    whenAtThisStep: 'Difference array for range updates.',
    xray: [
      { text: 'Apply **range additions** then query final array', kind: 'goal' },
      { text: '**Car pooling** — can capacity handle all trips?', kind: 'goal' },
      { text: '**Skyline** — outline of overlapping buildings', kind: 'goal' },
    ],
    budget: ['diffArray', 'lineSweep'],
    sayIt: ['Diff: diff[l]+=v, diff[r+1]-=v; prefix sum to reconstruct. Line sweep: events + multiset.'],
    branchGuides: {
      'diff-array': { proceed: 'WHEN: 1D range updates' },
      'diff-2d': { proceed: 'WHEN: 2D range updates (four corners)' },
      'line-sweep': { proceed: 'WHEN: overlapping intervals, skyline' },
    },
  }),

  'advanced-prefix-step2': d({
    whenAtThisStep: 'Non-additive prefix operations.',
    xray: [
      { text: '**XOR** of elements in subarray', kind: 'goal' },
      { text: '**Constrained subsequence sum** with max in window', kind: 'goal' },
    ],
    budget: ['prefixXor', 'prefixMinMax'],
    sayIt: ['XOR: pref[r+1] ^ pref[l]. Min/max: DP + deque or segment tree.'],
    branchGuides: {
      'prefix-xor': { proceed: 'WHEN: range XOR queries' },
      'prefix-minmax': { proceed: 'WHEN: prefix min/max with DP' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
