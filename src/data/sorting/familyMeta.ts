import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'comparison-step2': {
    tagline: 'Comparison-based sorts: merge, partition, or custom comparator',
    keywords: ['merge sort', 'quick sort', 'partition', 'comparator', 'divide and conquer'],
    budget: ['mergeSort', 'quickSort', 'customComparator'],
  },
  'non-comparison-step2': {
    tagline: 'Counting, radix, and bucket sorts — linear time for bounded ranges',
    keywords: ['counting', 'radix', 'bucket', 'frequency', 'linear time'],
    budget: ['countingSort', 'radixSort', 'oN'],
  },
  'partial-sort-step2': {
    tagline: 'Quickselect, median streaming, and heap-based top-K selection',
    keywords: ['quickselect', 'median', 'top k', 'kth largest', 'heap'],
    budget: ['quickSelect', 'medianHeap', 'heapSort', 'partialSort'],
  },
  'subroutine-step2': {
    tagline: 'Sort as preprocessing for intervals, greedy choices, or custom ordering',
    keywords: ['interval', 'greedy', 'custom sort', 'timeline', 'merge intervals'],
    budget: ['intervalSort', 'greedySort', 'customComparator'],
  },
  'advanced-exec-step2': {
    tagline: 'External and parallel sorting for large-scale or distributed data',
    keywords: ['external', 'parallel', 'distributed', 'chunk', 'merge'],
    budget: ['external', 'parallel'],
  },
}
