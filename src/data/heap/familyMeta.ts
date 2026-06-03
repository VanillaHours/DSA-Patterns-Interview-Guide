import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'topk-step2': {
    tagline: 'Select top-K elements, K-way merge, or maintain streaming median',
    keywords: ['kth largest', 'top k', 'frequent', 'merge k', 'median', 'k closest'],
    budget: ['topK', 'kFreq', 'kWayMerge', 'median'],
  },
  'scheduling-step2': {
    tagline: 'Schedule tasks, manage intervals, or simulate time-based events',
    keywords: ['task scheduler', 'cpu', 'meeting rooms', 'car pooling', 'event', 'simulation'],
    budget: ['taskSchedule', 'intervalSchedule', 'eventSim', 'greedy'],
  },
  'graph-step2': {
    tagline: 'Dijkstra, MST (Prim\'s), and priority-ordered matrix traversal',
    keywords: ['dijkstra', 'shortest path', 'minimum spanning tree', 'prim', 'swim', 'matrix'],
    budget: ['dijkstra', 'mst', 'graphShortest', 'matrixTraversal'],
  },
  'advanced-step2': {
    tagline: 'Custom comparators, lazy deletion, and multi-heap coordination',
    keywords: ['custom comparator', 'lazy deletion', 'multi-heap', 'minimize deviation'],
    budget: ['customCmp', 'lazyDelete', 'multiHeap'],
  },
}
