import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'mergeSort', label: 'Merge sort / divide & conquer', group: 'structure' },
  { id: 'quickSort', label: 'Quick sort / partition-based', group: 'structure' },
  { id: 'customComparator', label: 'Custom comparator ordering', group: 'input' },
  { id: 'countingSort', label: 'Counting sort / frequency', group: 'structure' },
  { id: 'radixSort', label: 'Radix / bucket sort', group: 'structure' },
  { id: 'quickSelect', label: 'Quickselect / order statistics', group: 'goal' },
  { id: 'medianHeap', label: 'Two-heap median maintenance', group: 'structure' },
  { id: 'heapSort', label: 'Heap-based selection', group: 'structure' },
  { id: 'intervalSort', label: 'Interval / timeline ordering', group: 'input' },
  { id: 'greedySort', label: 'Greedy after sort', group: 'goal' },
  { id: 'inPlace', label: 'In-place sorting', group: 'structure' },
  { id: 'stable', label: 'Stable sort requirement', group: 'input' },
  { id: 'oNLogN', label: 'O(n log n) time constraint', group: 'goal' },
  { id: 'oN', label: 'O(n) linear time constraint', group: 'goal' },
  { id: 'o1Space', label: 'O(1) extra space constraint', group: 'space' },
  { id: 'external', label: 'External / memory-constrained', group: 'space' },
  { id: 'parallel', label: 'Parallel / distributed sorting', group: 'structure' },
  { id: 'partialSort', label: 'Partial sorting / top K', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
