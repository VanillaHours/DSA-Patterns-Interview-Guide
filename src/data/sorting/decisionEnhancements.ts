import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even a Sorting problem? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Data must be arranged in some specific order (ascending, descending, custom)',
    'Problem explicitly asks to "sort" or "order" elements',
    'Need to arrange data as preprocessing for a downstream algorithm',
    'Finding order statistics (kth largest/smallest, median)',
    'Stable vs unstable sort is a constraint',
    'Time complexity requirement like O(n log n) or O(n)',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. Ask: does the problem require arranging data in order or finding order statistics?',
  xray: [
    { text: '**Sort** the array in **ascending** order …', kind: 'goal' },
    { text: 'Return the **kth largest** element', kind: 'goal' },
    { text: '**Merge** the intervals after sorting by start time', kind: 'signal' },
    { text: 'Must run in **O(n log n)** time', kind: 'constraint' },
    { text: 'Must run in **O(n)** time with **O(1)** extra space', kind: 'constraint' },
  ],
  budget: ['mergeSort', 'quickSort', 'quickSelect', 'partialSort'],
  sayIt: [
    'Before any template: does this problem require sorting, or is sort a preprocessing step?',
    'If yes — comparison sort, non-comparison (counting/bucket), partial (quickselect/heap), or subroutine?',
    'If no sorting needed at all — probably not a Sorting pattern problem.',
  ],
  branchGuides: {
    'comparison-step2': {
      proceed: 'WHEN: general comparison-based sort (merge, quick, or custom comparator)',
      whenExtra: ['sort an array', 'sort list', 'largest number', 'kth largest via partition'],
    },
    'non-comparison-step2': {
      proceed: 'WHEN: bounded integer range, frequency-based, or bucket distribution',
      whenExtra: ['sort colors', 'sort by frequency', 'maximum gap'],
    },
    'partial-sort-step2': {
      proceed: 'WHEN: find kth / top-K / median without sorting everything',
      whenExtra: ['kth largest', 'median from stream', 'top k frequent'],
    },
    'subroutine-step2': {
      proceed: 'WHEN: sort is preprocessing for intervals, greedy, or custom order',
      whenExtra: ['merge intervals', 'assign cookies', 'custom sort string'],
    },
    'advanced-exec-step2': {
      proceed: 'WHEN: dataset exceeds memory or distributed sorting needed',
      whenExtra: ['external sort', 'parallel sort'],
    },
  },
  notThisPattern: [
    { signal: '"find an element" without sorting', actually: 'Binary search or hash map — sort not needed.' },
    { signal: '"built-in sort" as trivial solution (e.g. sort + take k)', actually: 'The challenge is something else. Identify the real pattern.' },
  ],
  misidentify: [
    {
      cause: 'Sorting when counting sort (O(n)) is possible',
      wrong: 'general sort O(n log n)',
      testCase: 'bounded range [0, 1000]',
      fix: 'Counting sort: freq array + write back in order — O(n + range).',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'sort-root': PATTERN_GATE,

  'comparison-step2': d({
    whenAtThisStep: 'General comparison-based sort: merge, partition, or custom comparator.',
    xray: [
      { text: '**Sort** an array of integers', kind: 'goal' },
      { text: 'Count **reverse pairs** where i<j and a[i] > 2*a[j]', kind: 'goal' },
      { text: 'Arrange numbers to form **largest concatenation**', kind: 'goal' },
    ],
    budget: ['mergeSort', 'quickSort', 'customComparator'],
    sayIt: ['Merge sort: divide, sort halves, merge. Quick sort: partition around pivot, recurse.', 'Custom comparator: sort with lambda (a+b > b+a for largest number).'],
    branchGuides: {
      'merge-sort': { proceed: 'WHEN: stable O(n log n) divide & conquer, or count inversions' },
      'quick-sort': { proceed: 'WHEN: in-place partition, or quickselect for kth' },
      'comparator-order': { proceed: 'WHEN: custom ordering rule via comparator lambda' },
    },
  }),

  'non-comparison-step2': d({
    whenAtThisStep: 'Non-comparison sort for bounded or frequency-based data.',
    xray: [
      { text: '**Sort colors** (0, 1, 2 only)', kind: 'goal' },
      { text: '**Sort by frequency** of characters', kind: 'goal' },
      { text: '**Maximum gap** between consecutive sorted values', kind: 'goal' },
    ],
    budget: ['countingSort', 'radixSort', 'oN'],
    sayIt: ['Counting: freq array + write back. Bucket: distribute into buckets, per-bucket aggregate.'],
    branchGuides: {
      counting: { proceed: 'WHEN: small bounded range, frequency-based' },
      'radix-bucket': { proceed: 'WHEN: uniform distribution, gap problems' },
    },
  }),

  'partial-sort-step2': d({
    whenAtThisStep: 'Find order statistics without full sort.',
    xray: [
      { text: '**Kth largest** element in array', kind: 'goal' },
      { text: '**Median** from a data stream', kind: 'goal' },
      { text: '**Top K frequent** words / elements', kind: 'goal' },
    ],
    budget: ['quickSelect', 'medianHeap', 'heapSort', 'partialSort'],
    sayIt: ['Quickselect: partition + recurse one side. Two-heap median: max-heap lower, min-heap upper.', 'Heap selection: min-heap of size k for top-K.'],
    branchGuides: {
      quickselect: { proceed: 'WHEN: kth largest / smallest via partition' },
      'median-stream': { proceed: 'WHEN: streaming median with two heaps' },
      'heap-select': { proceed: 'WHEN: top-K via heap of size k' },
    },
  }),

  'subroutine-step2': d({
    whenAtThisStep: 'Sort is preprocessing — intervals, greedy, or custom ordering.',
    xray: [
      { text: '**Merge** overlapping intervals', kind: 'goal' },
      { text: '**Assign cookies** to maximize content children', kind: 'goal' },
      { text: '**Custom sort** string by given order', kind: 'goal' },
    ],
    budget: ['intervalSort', 'greedySort', 'customComparator'],
    sayIt: ['Intervals: sort by start, then merge/heap. Greedy: sort enables greedy choice.', 'Custom: comparator lambda or count+reconstruct.'],
    branchGuides: {
      interval: { proceed: 'WHEN: merge/insert intervals or count rooms' },
      'greedy-after-sort': { proceed: 'WHEN: greedy assignment after sorting' },
      'custom-sort': { proceed: 'WHEN: multi-key comparator or count+reconstruct' },
    },
  }),

  'advanced-exec-step2': d({
    whenAtThisStep: 'External or parallel sorting.',
    xray: [
      { text: 'Dataset is **larger than available RAM**', kind: 'constraint' },
      { text: '**Distributed** environment with multiple nodes', kind: 'constraint' },
    ],
    budget: ['external', 'parallel'],
    sayIt: ['External sort: chunk → sort → k-way merge with heap.', 'Parallel sort: partition across nodes, local sort, merge.'],
    branchGuides: {
      'external-sort': { proceed: 'WHEN: data exceeds RAM; chunk + merge' },
      'parallel-sort': { proceed: 'WHEN: multi-node or GPU sorting' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
