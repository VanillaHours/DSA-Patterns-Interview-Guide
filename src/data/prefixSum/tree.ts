import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── 1D Range & Equilibrium ───────────────────────────────────────

const oneDNode: TaxonomyNode = decision(
  '1d-range-step2',
  '1D Prefix Sum — basic range, equilibrium, or product?',
  'blue',
  2,
  'Cumulative sum in one-dimensional arrays:',
  [
    branch(
      [
        '"range sum query" immutable / running sum',
        '"shifting letters" suffix sum',
        'LC 303, 1480, 848',
      ],
      'Basic Range Sum',
      'pref[i+1] = pref[i] + nums[i]; query: pref[r+1] - pref[l].',
      L.basicRangeLeaf,
      ['pivot / equilibrium', 'prefix product'],
    ),
    branch(
      [
        '"find pivot index" / "middle index"',
        '"ways to make fair array"',
        'LC 724, 1991, 1664',
      ],
      'Pivot & Equilibrium',
      'Total sum + left running sum; parity tracking for fair array.',
      L.pivotLeaf,
      ['basic range queries'],
    ),
    branch(
      [
        '"product of array except self"',
        'prefix product (no division)',
        'LC 238',
      ],
      'Prefix Product',
      'Left-to-right prefix product, then right-to-left suffix product.',
      L.prefixProductLeaf,
      ['addition-based prefix sum'],
    ),
  ],
)

// ── Subarray Sum with Hash Map ───────────────────────────────────

const subarrayNode: TaxonomyNode = decision(
  'subarray-map-step2',
  'Subarray Sum — target, max, longest, or count?',
  'purple',
  2,
  'Prefix sum + hash map for subarray properties:',
  [
    branch(
      [
        '"subarray sum equals k" count',
        '"subarray divisible by k" count',
        '"continuous subarray" remainder ≥ 2',
        'LC 560, 974, 523',
      ],
      'Target Sum Counting',
      'Prefix sum + map of sum → count (or first index).',
      L.targetSubarrayLeaf,
      ['max subarray / Kadane', 'longest subarray'],
    ),
    branch(
      [
        '"maximum subarray" Kadane',
        '"minimum start value" from prefix',
        'LC 53, 1413',
      ],
      'Maximum Subarray',
      'Kadane: cur = max(num, cur + num); ans = max(ans, cur).',
      L.maxSubarrayLeaf,
      ['target sum counting'],
    ),
    branch(
      [
        '"contiguous array" equal 0/1',
        '"max size subarray sum = k"',
        '"longest well-performing interval"',
        'LC 525, 325, 1124',
      ],
      'Longest Balanced Subarray',
      'Map first occurrence of prefix sum; delta = length.',
      L.longestBalancedLeaf,
      ['count subarrays', 'max subarray'],
    ),
    branch(
      [
        '"count nice subarrays" k odds',
        '"binary subarrays with sum"',
        'LC 1248, 930',
      ],
      'Nice Array Counting',
      'Convert to 0/1, prefix sum + hash map count.',
      L.niceArrayLeaf,
      ['target sum with negatives'],
    ),
  ],
)

// ── 2D Prefix Sum ────────────────────────────────────────────────

const twoDNode: TaxonomyNode = decision(
  '2d-prefix-step2',
  '2D Prefix Sum — rectangle, submatrix, or squares?',
  'green',
  2,
  'Cumulative sums in two-dimensional matrices:',
  [
    branch(
      [
        '"range sum query 2D" immutable',
        '"matrix block sum" clamped K',
        'LC 304, 1314',
      ],
      'Rectangle Sum',
      'pref[i+1][j+1] = val + top + left - diag; inclusion-exclusion query.',
      L.rectSumLeaf,
      ['submatrix target', 'count squares'],
    ),
    branch(
      [
        '"number of submatrices sum to target"',
        '"max sum rectangle ≤ K"',
        'LC 1074, 363',
      ],
      'Submatrix Target',
      'Row-range compression + 1D prefix sum + hash map per row pair.',
      L.submatrixLeaf,
      ['fixed rectangle queries'],
    ),
    branch(
      [
        '"count square submatrices with all ones"',
        '"count submatrices with all ones"',
        'LC 1277, 1504',
      ],
      'Count Squares',
      'DP: dp[i][j] = min(top, left, diag) + 1; sum all dp values.',
      L.countSquaresLeaf,
      ['submatrix sum', 'rectangle query'],
    ),
  ],
)

// ── Difference Array ─────────────────────────────────────────────

const diffNode: TaxonomyNode = decision(
  'diff-array-step2',
  'Difference Array — 1D updates, 2D updates, or line sweep?',
  'amber',
  2,
  'O(1) range updates via difference marking:',
  [
    branch(
      [
        '"range addition" / "corporate flight bookings"',
        '"car pooling" trips capacity',
        'LC 370, 1109, 1094',
      ],
      '1D Range Updates',
      'diff[l] += v, diff[r+1] -= v; prefix sum to reconstruct.',
      L.diffArrayLeaf,
      ['2D difference', 'line sweep'],
    ),
    branch(
      [
        '"increment submatrices by one"',
        '2D range updates',
        'LC 2536',
      ],
      '2D Difference Array',
      'Four-corner marking: top-left +, top-right -, bottom-left -, bottom-right +.',
      L.diffArray2dLeaf,
      ['1D difference array'],
    ),
    branch(
      [
        '"the skyline problem"',
        'building start/end events',
        'LC 218',
      ],
      'Line Sweep',
      'Events of (x, -h for start, +h for end); multiset of active heights.',
      L.lineSweepLeaf,
      ['simple range updates'],
    ),
  ],
)

// ── Advanced Prefix ──────────────────────────────────────────────

const advancedNode: TaxonomyNode = decision(
  'advanced-prefix-step2',
  'Advanced Prefix — XOR, min/max, or GCD?',
  'teal',
  2,
  'Non-additive prefix operations:',
  [
    branch(
      [
        '"xor queries of a subarray"',
        '"count triplets equal xor"',
        'LC 1310, 1442',
      ],
      'Prefix XOR',
      'pref[i+1] = pref[i] ^ nums[i]; query: pref[r+1] ^ pref[l].',
      L.prefixXorLeaf,
      ['prefix sum / product'],
    ),
    branch(
      [
        '"constrained subsequence sum"',
        '"jump game V" with prefix max',
        'LC 1425, 1340',
      ],
      'Prefix Min / Max',
      'DP + deque of max in sliding window, or segment tree for range max.',
      L.prefixMinMaxLeaf,
      ['XOR operations'],
    ),
  ],
)

// ── Root ──────────────────────────────────────────────────────────

export const prefixSumRoot: TaxonomyNode = decision(
  'ps-root',
  'Prefix Sum',
  'slate',
  1,
  'Before coding: does the problem involve cumulative sums — 1D, 2D, difference array, or non-additive prefix?',
  [
    branch(
      [
        '"range sum query" / "running sum"',
        '"find pivot index" / "product except self"',
      ],
      '→ 1D Range & Equilibrium',
      'Basic prefix sum for range queries, equilibrium, or prefix product.',
      oneDNode,
      ['subarray with hash map', '2D prefix'],
    ),
    branch(
      [
        '"subarray sum equals k" / "contiguous array"',
        '"maximum subarray" / "count nice subarrays"',
      ],
      '→ Subarray Sum with Hash Map',
      'Prefix sum + hash map for counting, max, or longest subarrays.',
      subarrayNode,
      ['basic range queries', '2D submatrix'],
    ),
    branch(
      [
        '"range sum query 2D" / "matrix block sum"',
        '"number of submatrices sum to target"',
        '"count square submatrices"',
      ],
      '→ 2D Prefix Sum',
      '2D prefix sum for rectangle queries, submatrix target, and square counting.',
      twoDNode,
      ['1D prefix sum', 'difference array'],
    ),
    branch(
      [
        '"range addition" / "corporate flight bookings"',
        '"car pooling" / "increment submatrices"',
        '"the skyline problem"',
      ],
      '→ Difference Array',
      'Difference marking for O(1) range updates; line sweep for overlapping intervals.',
      diffNode,
      ['prefix sum query', 'binary indexed tree'],
    ),
    branch(
      [
        '"xor queries of a subarray"',
        '"constrained subsequence sum"',
        '"jump game V" with prefix max',
      ],
      '→ Advanced Prefix',
      'XOR, min/max, or GCD as the prefix operation instead of addition.',
      advancedNode,
      ['standard prefix (addition-based)'],
    ),
  ],
  {
    explanation:
      'Prefix sum enables O(1) range queries. Choose: 1D (addition/product), 2D (matrix), difference array (range updates), or advanced (XOR/min/max).',
  },
)
