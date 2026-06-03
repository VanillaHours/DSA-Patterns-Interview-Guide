import type { TaxonomyNode } from '../../types'
import { decision, branch } from './helpers'
import {
  kthLeaf, kFreqLeaf, kWayMergeLeaf, medianLeaf,
  taskSchedLeaf, meetingLeaf, eventSimLeaf,
  dijkstraLeaf, mstLeaf, matrixPriorityLeaf,
  customCmpLeaf, lazyDeleteLeaf, multiHeapLeaf,
} from './leaves'

// ── Top-K Family (step 2) ────────────────────────────────────────

const topKFamily = decision('topk-step2', 'Identify the Top-K Pattern', 'purple', 2,
  'Need top-K selection, K-way merge, or streaming median?',
  [
    branch(['topK'], 'Kth Largest / Smallest',
      'You need to find the kth largest or kth smallest element; or k closest points.',
      kthLeaf),
    branch(['kFreq'], 'K Frequent',
      'You need the k most frequent elements.',
      kFreqLeaf),
    branch(['kWayMerge'], 'K-Way Merge',
      'You need to merge k sorted arrays or lists, or find kth smallest in sorted matrix.',
      kWayMergeLeaf),
    branch(['median'], 'Continuous Median',
      'You need the median of a streaming data stream or sliding window.',
      medianLeaf),
  ],
)

// ── Scheduling Family (step 3) ───────────────────────────────────

const schedulingFamily = decision('scheduling-step2', 'Identify the Scheduling Pattern', 'amber', 2,
  'Need task scheduling, interval management, or event simulation?',
  [
    branch(['taskSchedule', 'greedy'], 'Task Scheduling',
      'CPU task scheduling, process tasks with cooldown or priority.',
      taskSchedLeaf),
    branch(['intervalSchedule'], 'Meeting & Intervals',
      'Meeting room allocation, car pooling, or interval overlap.',
      meetingLeaf),
    branch(['eventSim'], 'Event-Based Simulation',
      'Time-based events: card grouping, eating apples before rot day.',
      eventSimLeaf),
  ],
)

// ── Graph Family (step 4) ────────────────────────────────────────

const graphFamily = decision('graph-step2', 'Identify the Graph Heap Pattern', 'green', 2,
  'Need Dijkstra, MST, or priority matrix traversal?',
  [
    branch(['dijkstra', 'graphShortest'], 'Dijkstra / Shortest Path',
      'Weighted graph shortest path; minimum effort path in grid.',
      dijkstraLeaf),
    branch(['mst'], 'Minimum Spanning Tree',
      'Connect all points with minimum total cost (Prim\'s algorithm).',
      mstLeaf),
    branch(['matrixTraversal'], 'Matrix Priority Traversal',
      'Swim in rising water; path with max-min value.',
      matrixPriorityLeaf),
  ],
)

// ── Advanced Family (step 5) ─────────────────────────────────────

const advancedFamily = decision('advanced-step2', 'Identify Advanced Heap Technique', 'blue', 2,
  'Custom comparison, lazy deletion, or multi-heap coordination?',
  [
    branch(['customCmp'], 'Custom Comparison',
      'Custom comparator or ordering logic: last stone weight, max average pass ratio.',
      customCmpLeaf),
    branch(['lazyDelete'], 'Lazy Deletion',
      'Orders backlog with stale entries needing lazy heap deletion.',
      lazyDeleteLeaf),
    branch(['multiHeap'], 'Multi-Heap Coordination',
      'Minimize deviation, longest subarray with absolute diff limit.',
      multiHeapLeaf),
  ],
)

// ── Root Decision (step 1) ───────────────────────────────────────

export const HEAP_TREE: TaxonomyNode = decision('heap-step1', 'When to use a Heap / Priority Queue?', 'purple', 1,
  'Is the problem asking for top K elements, scheduling, shortest paths, or custom priority?',
  [
    branch(['topK', 'kFreq', 'kWayMerge', 'median', 'streaming', 'oNLogK'],
      'Top-K / Streaming Selection',
      'Select the kth largest/smallest element, k frequent items, k-way merge, or streaming median.',
      topKFamily),
    branch(['taskSchedule', 'intervalSchedule', 'eventSim', 'greedy'],
      'Scheduling / Simulation',
      'Schedule tasks with cooldown, allocate meeting rooms, or simulate time-based events.',
      schedulingFamily),
    branch(['dijkstra', 'mst', 'graphShortest', 'matrixTraversal'],
      'Graph / Matrix Traversal',
      'Shortest path in weighted graph, minimum spanning tree, or priority matrix traversal.',
      graphFamily),
    branch(['customCmp', 'lazyDelete', 'multiHeap'],
      'Advanced / Custom Heap',
      'Custom comparator logic, lazy deletion of stale entries, or multi-heap coordination.',
      advancedFamily),
  ],
  //{ ascii: 'HEAP' },
)
