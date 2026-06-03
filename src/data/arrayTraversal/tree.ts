import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const twoPointerInArrayNode: TaxonomyNode = decision(
  'two-pointer-array',
  'Two-Pointer Technique — same or opposite direction?',
  'green',
  3,
  'Two indices traverse the array. Read their starting positions and movement:',
  [
    branch(
      [
        '"remove duplicates" from sorted in-place',
        '"move zeroes" / filter to front',
        'both start at index 0; one reads, one writes',
      ],
      'Same Direction (Read/Write)',
      'R scans ahead; W writes only kept elements — O(n), O(1) space.',
      L.sameDirLeaf,
      ['opposite ends', 'pair sum from ends'],
    ),
    branch(
      [
        '"two sum" on sorted input',
        '"find triplets" with sum target',
        'l=0, r=n-1 moving toward each other',
      ],
      'Opposite Direction (Ends-Inward)',
      'Sorted order lets you eliminate half the pairs by moving l or r each step.',
      L.oppositeDirLeaf,
      ['in-place filter', 'read/write pointer'],
    ),
  ],
  {
    template: `int l = 0, r = n - 1;
while (l < r) {
    // decide which direction to move
}`,
    templateCaption: 'Two-pointer traversal — children fill in direction rule and action.',
  },
)

const slidingWindowInArrayNode: TaxonomyNode = decision(
  'sliding-window-array',
  'Sliding Window — fixed or variable size?',
  'lime',
  3,
  'Window over contiguous elements. Is the window length fixed or variable?',
  [
    branch(
      [
        '"subarray of size k" / "exactly k"',
        '"maximum average" of k consecutive',
      ],
      'Fixed-Size Window',
      'Slide by adding rightmost, removing leftmost. No shrink loop needed.',
      L.fixedWindowLeaf,
      ['variable length longest/shortest'],
    ),
    branch(
      [
        '"longest substring without repeating"',
        '"minimum subarray sum ≥ target"',
        'window grows and shrinks based on constraint',
      ],
      'Variable-Size Window',
      'Expand r until invalid, shrink l while invalid — track max or min length.',
      L.variableWindowLeaf,
      ['exactly k length', 'fixed window no shrink'],
    ),
  ],
  {
    template: `int l = 0;
for (int r = 0; r < n; r++) {
    // add nums[r] to window
    while (/* invalid */) { /* remove nums[l] */ l++; }
    // update ans (max or min)
}`,
    templateCaption: 'Variable window — LINE 1 = shrink condition; LINE 2 = max vs min.',
  },
)

const linearScanningNode: TaxonomyNode = decision(
  'linear-scanning',
  'Linear Array Scanning',
  'green',
  2,
  'Single pass through the array. Match the traversal style from the constraints:',
  [
    branch(
      [
        '"maximum subarray" (Kadane)',
        '"best time to buy/sell stock"',
        '"maximum difference" / running min or max',
        'single scan, no nested loops, O(n)',
      ],
      'One-Pass Traversal',
      'Running state: track min/max/prefix in one forward pass.',
      L.onePassLeaf,
      ['two pointers', 'subarray window', 'binary search'],
    ),
    branch(
      [
        '"in-place" O(1) space modify array',
        '"two sum" on sorted / "remove duplicates"',
        '"pair from ends" or read/write index',
        'two indices coordinate movement',
      ],
      'Two-Pointer Technique',
      'Same direction (read/write) or opposite ends (sum/pair).',
      twoPointerInArrayNode,
      ['Kadane single pass', 'binary search half-interval'],
    ),
    branch(
      [
        '"contiguous subarray" with constraint',
        '"longest" / "shortest" window',
        '"at most K" / fixed size k',
      ],
      'Sliding Window',
      'Expand right; shrink left on constraint violation.',
      slidingWindowInArrayNode,
      ['single pass running sum only'],
    ),
  ],
)

const binarySearchTraversalNode: TaxonomyNode = decision(
  'binary-search-traversal',
  'Binary Search Traversal',
  'blue',
  2,
  'Array is sorted or answer space is monotonic — halve the search range. Match the type:',
  [
    branch(
      [
        'sorted array, "find index of target"',
        '"search insert position"',
        'exact match or insertion point',
      ],
      'Standard Binary Search',
      'Classic mid = l + (r-l)/2; narrow to one side.',
      L.standardBsLeaf,
      ['rotated array', 'predicate on answer space'],
    ),
    branch(
      [
        '"search in rotated sorted array"',
        '"find minimum in rotated"',
        'array was sorted then rotated at a pivot',
      ],
      'Rotated / Modified Arrays',
      'Compare mid with left boundary to determine which side is sorted.',
      L.rotatedBsLeaf,
      ['standard sorted search', 'floating-point answer'],
    ),
    branch(
      [
        '"capacity to ship packages" / "koko eating"',
        '"split array largest sum"',
        '"minimum time / distance" — predicate monotonic',
        'find minimum X such that f(X) is feasible',
      ],
      'Answer Space Binary Search',
      'Binary search the ANSWER (not the index). Predicate function returns T/F.',
      L.answerSpaceBsLeaf,
      ['index binary search on sorted array'],
    ),
  ],
  {
    template: `int l = 0, r = n - 1;
while (l <= r) {
    int m = l + (r - l) / 2;
    if (/* condition */) l = m + 1;
    else r = m - 1;
}`,
    templateCaption: 'Classic BS template — children define the condition on line 4.',
  },
)

const multiDimTraversalNode: TaxonomyNode = decision(
  'multi-dim-traversal',
  'Multidimensional Array Traversal',
  'purple',
  2,
  'Input is a 2D matrix or the traversal involves coordinated jumps. Match the pattern:',
  [
    branch(
      [
        '"transpose" a matrix',
        '"matrix" + nested loops',
        'swap / rearrange elements by position',
      ],
      'Nested Loops (Matrix Scan)',
      'Standard i/j loops visiting every cell exactly once.',
      L.nestedLoopLeaf,
      ['BFS/DFS grid path', 'set zeroes with markers'],
    ),
    branch(
      [
        '"set matrix zeroes"',
        '"game of life" / in-place state update',
        'mark rows/cols with flags, then update in second pass',
      ],
      'Coordinated Traversal',
      'First pass marks boundary cells; second pass propagates changes.',
      L.coordinatedLeaf,
      ['simple transpose', 'BFS/DFS matrix traversal'],
    ),
    branch(
      [
        '"jump game" / reach last index',
        '"jump game IV" / BFS on index graph',
        'min jumps / can reach end given step sizes',
      ],
      'Jump Patterns',
      'Greedy reach tracking or BFS on implicit graph (array as nodes).',
      L.jumpPatternLeaf,
      ['consecutive subarray', 'sorting needed'],
    ),
  ],
  {
    template: `// Traverse or mark cells — pattern depends on problem goal
for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        // visit / mark / update cell`,
    templateCaption: '2D traversal — children define the visit logic and secondary passes.',
  },
)

export const arrayRoot: TaxonomyNode = decision(
  'at-root',
  'Array Traversal',
  'slate',
  1,
  'Before coding: identify the TRAVERSAL type. Single pass, halving search, or multi-dimensional?',
  [
    branch(
      [
        'single-pass linear scan',
        '"maximum subarray" / "best time to buy"',
        '"remove duplicates" / "move zeroes"',
        'subarray / window constraint',
        '"two sum" on sorted',
      ],
      '→ Linear Array Scanning',
      'One direction, two pointers, or sliding window — indices move forward (or inward).',
      linearScanningNode,
      ['sorted + find index', 'rotated / mountain array', '2D matrix / grid'],
    ),
    branch(
      [
        'sorted or partially sorted array',
        '"find index of target" / "search insert"',
        '"search rotated" / "find min rotated"',
        'answer space is monotonic',
      ],
      '→ Binary Search Traversal',
      'Halve the search range each step — index BS or predicate BS on answer space.',
      binarySearchTraversalNode,
      ['unsorted array linear scan', '2D matrix traversal'],
    ),
    branch(
      [
        '2D matrix / grid input',
        '"transpose" / "rotate matrix"',
        '"set zeroes" / "game of life"',
        '"jump game" / reach index with steps',
      ],
      '→ Multidimensional / Jump Traversal',
      'Nested loops over 2D, coordinated marker passes, or greedy/BFS jump patterns.',
      multiDimTraversalNode,
      ['single array linear scan', 'sorted array binary search'],
    ),
  ],
  {
    explanation:
      'Do not pick by topic name — match the TRAVERSAL MECHANISM. Each branch describes how indices move through the data.',
  },
)
