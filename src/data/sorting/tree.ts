import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Comparison Sorts ─────────────────────────────────────────────

const comparisonNode: TaxonomyNode = decision(
  'comparison-step2',
  'Comparison Sorts — merge, partition, or custom comparator?',
  'blue',
  2,
  'Sort by comparing elements pairwise:',
  [
    branch(
      [
        '"sort an array" / sort list (merge sort)',
        '"reverse pairs" count',
        'LC 912, 148, 493',
      ],
      'Merge-Oriented Sorting',
      'Divide into halves, sort recursively, merge with two-pointer.',
      L.mergeSortLeaf,
      ['partition-based quick sort', 'bucket sort'],
    ),
    branch(
      [
        '"sort an array" (quick sort)',
        '"kth largest" / quickselect',
        '"k closest points" / nth_element',
        'LC 912, 215, 973',
      ],
      'Partition-Oriented Sorting',
      'Partition around pivot; recurse on both halves (sort) or one side (select).',
      L.quickSortLeaf,
      ['merge sort', 'counting sort for bounded values'],
    ),
    branch(
      [
        '"largest number" by concatenation',
        '"queue reconstruction by height"',
        '"reorder log files" by custom rules',
        'LC 179, 406, 937',
      ],
      'Comparator-Driven Ordering',
      'Custom lambda comparator passed to std::sort / stable_sort.',
      L.comparatorOrderLeaf,
      ['standard ascending order', 'in-place partitioning'],
    ),
  ],
)

// ── Non-Comparison Sorts ─────────────────────────────────────────

const nonComparisonNode: TaxonomyNode = decision(
  'non-comparison-step2',
  'Non-Comparison Sorts — counting or radix/bucket?',
  'green',
  2,
  'Sort without comparing elements — exploit value ranges:',
  [
    branch(
      [
        '"sort colors" (0, 1, 2)',
        '"sort characters by frequency"',
        '"relative sort array" by arr2 order',
        'LC 75, 451, 1122',
      ],
      'Counting-Based Techniques',
      'Count frequencies, then write back in sorted order.',
      L.countingLeaf,
      ['general comparison sort'],
    ),
    branch(
      [
        '"maximum gap" between consecutive sorted',
        '"rank teams by votes"',
        '"remove letter to equalize frequency"',
        'LC 164, 1366, 2423',
      ],
      'Radix & Bucket Schemes',
      'Distribute into buckets by range or digit; compute per-bucket aggregate.',
      L.radixBucketLeaf,
      ['standard comparison sort'],
    ),
  ],
)

// ── Partial Sorting & Selection ──────────────────────────────────

const partialSortNode: TaxonomyNode = decision(
  'partial-sort-step2',
  'Partial Sorting & Selection — quickselect, median, or heap?',
  'purple',
  2,
  'Find order statistics or partially sort for top-K:',
  [
    branch(
      [
        '"kth largest element" / quickselect',
        '"top k frequent" by count',
        'LC 215, 347',
      ],
      'Quickselect & Order Statistics',
      'Partition and recurse on the side containing the kth element.',
      L.quickselectLeaf,
      ['full sort required', 'median stream'],
    ),
    branch(
      [
        '"find median from data stream"',
        '"sliding window median"',
        'LC 295, 480',
      ],
      'Streaming Median Maintenance',
      'Two heaps: max-heap for lower half, min-heap for upper half.',
      L.medianStreamLeaf,
      ['static array', 'top-K selection'],
    ),
    branch(
      [
        '"kth smallest in sorted matrix"',
        '"top k frequent words"',
        'LC 378, 692',
      ],
      'Heap-Based Selection',
      'Min-heap or max-heap of size k; pop when over capacity.',
      L.heapSelectLeaf,
      ['quickselect O(n) average'],
    ),
  ],
)

// ── Sorting as a Subroutine ──────────────────────────────────────

const subroutineNode: TaxonomyNode = decision(
  'subroutine-step2',
  'Sorting as a Subroutine — intervals, greedy, or custom ordering?',
  'amber',
  2,
  'Sort is a preprocessing step for the real algorithm:',
  [
    branch(
      [
        '"merge intervals" / "insert interval"',
        '"meeting rooms II" min rooms',
        'LC 56, 57, 253',
      ],
      'Interval & Timeline Ordering',
      'Sort by start time; then merge / heap for overlaps.',
      L.intervalLeaf,
      ['greedy assignment after sort'],
    ),
    branch(
      [
        '"assign cookies" to kids',
        '"two city scheduling" minimize cost',
        '"boats to save people" two-pointer',
        'LC 455, 1029, 881',
      ],
      'Greedy Optimization After Sort',
      'Sort enables greedy choice; exchange argument proves optimality.',
      L.greedyAfterSortLeaf,
      ['interval merging', 'general sorting'],
    ),
    branch(
      [
        '"sort integers by number of 1 bits"',
        '"custom sort string" by order',
        'LC 1356, 791',
      ],
      'Custom Comparator Problems',
      'Lambda comparator for multi-key sort, or count+reconstruct for order-preserving.',
      L.customSortLeaf,
      ['standard ascending comparison'],
    ),
  ],
)

// ── Advanced Execution Models ─────────────────────────────────────

const advancedExecNode: TaxonomyNode = decision(
  'advanced-exec-step2',
  'Advanced Execution Models — external or parallel?',
  'slate',
  2,
  'Sorting under memory constraints or distributed systems:',
  [
    branch(
      [
        'dataset larger than RAM',
        'k-way merge with min-heap',
        'chunk → sort → merge pipeline',
      ],
      'External Sorting Pipelines',
      'Chunk, sort each chunk in RAM, k-way merge with heap.',
      L.externalSortLeaf,
      ['parallel / distributed sorting'],
    ),
    branch(
      [
        'multi-node or GPU sorting',
        'partition data, sort locally, merge',
        'sample sort / bitonic sort',
      ],
      'Parallel & Distributed Sorting',
      'Partition across nodes, sort locally, merge results.',
      L.parallelSortLeaf,
      ['single-machine external sort'],
    ),
  ],
)

// ── Root ──────────────────────────────────────────────────────────

export const sortingRoot: TaxonomyNode = decision(
  'sort-root',
  'Sorting',
  'slate',
  1,
  'Before coding: what kind of sort — comparison, non-comparison, partial, subroutine, or advanced execution?',
  [
    branch(
      [
        '"sort an array" / "sort list"',
        '"reverse pairs" count / "largest number"',
        '"kth largest" via quickselect',
      ],
      '→ Comparison Sorts',
      'Compare elements pairwise — merge sort, quick sort, or custom comparator.',
      comparisonNode,
      ['counting / bucket sort for bounded range', 'external / parallel'],
    ),
    branch(
      [
        '"sort colors" (0/1/2)',
        '"sort characters by frequency"',
        '"maximum gap" consecutive diff',
        '"relative sort array" by order',
      ],
      '→ Non-Comparison Sorts',
      'Counting, radix, or bucket sort — linear time for bounded integer ranges.',
      nonComparisonNode,
      ['general comparison sort', 'partial sort / top-K'],
    ),
    branch(
      [
        '"kth largest" (quickselect)',
        '"top k frequent" / "top k words"',
        '"find median from data stream"',
        '"kth smallest in sorted matrix"',
      ],
      '→ Partial Sorting & Selection',
      'Quickselect, two-heap median, or heap of size k for order statistics.',
      partialSortNode,
      ['full sort (all elements)', 'simple top-K via sort + take'],
    ),
    branch(
      [
        '"merge intervals" / "insert interval"',
        '"meeting rooms II" / "assign cookies"',
        '"custom sort string" / "sort by bits"',
      ],
      '→ Sorting as a Subroutine',
      'Sort is preprocessing for intervals, greedy, or custom ordering.',
      subroutineNode,
      ['sort is the main challenge'],
    ),
    branch(
      [
        'dataset larger than RAM',
        'distributed / multi-node sorting',
        'GPU parallel sorting',
      ],
      '→ Advanced Execution Models',
      'External sorting (chunk + k-way merge) or parallel/distributed strategies.',
      advancedExecNode,
      ['standard in-memory sorting'],
    ),
  ],
  {
    explanation:
      'Identify the sort type: comparison (merge/quick/comparator), non-comparison (counting/bucket/radix), partial (quickselect/median/heap), subroutine (interval/greedy/custom), or advanced (external/parallel). Each branch owns a specific sorting strategy.',
  },
)
