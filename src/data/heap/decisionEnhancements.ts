import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Need to select top-K elements (kth largest, k closest, k frequent)',
    'K-way merge of sorted arrays / linked lists',
    'Streaming median or sliding window median',
    'Task scheduling with cooldown or CPU processing',
    'Weighted graph shortest path (Dijkstra) or MST (Prim\'s)',
    'Custom comparator / lazy deletion / multi-heap coordination',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. Ask: is the problem asking for top-K selection, scheduling with priority, Dijkstra/shortest path, or a custom heap technique?',
  xray: [
    { text: 'Given an array and k, return the **kth largest** element', kind: 'goal' },
    { text: 'Merge **k sorted linked lists** into one sorted list', kind: 'goal' },
    { text: 'Design a class to find the **median** from a data stream', kind: 'goal' },
    { text: 'Schedule tasks given a **cooldown n** between same tasks', kind: 'goal' },
    { text: 'Find the **shortest path** in a weighted graph (non-negative edges)', kind: 'signal' },
    { text: 'Always pick the **two heaviest stones** and smash them', kind: 'goal' },
  ],
  budget: ['topK', 'kFreq', 'kWayMerge', 'median', 'taskSchedule', 'dijkstra', 'mst', 'customCmp', 'lazyDelete', 'multiHeap'],
  sayIt: [
    'Before any template: does the problem need priority-based selection, scheduling, or shortest path?',
    'If yes — Top-K, Scheduling, Graph (Dijkstra/MST), or Advanced (custom cmp / lazy deletion)?',
  ],
  branchGuides: {
    'topk-step2': {
      proceed: 'WHEN: top-K, k-way merge, or streaming median needed',
      whenExtra: ['kth largest/smallest', 'k closest', 'k frequent', 'merge k sorted', 'median from stream'],
    },
    'scheduling-step2': {
      proceed: 'WHEN: task scheduling, interval management, or event simulation',
      whenExtra: ['task cooldown', 'meeting rooms', 'car pooling', 'event-based simulation'],
    },
    'graph-step2': {
      proceed: 'WHEN: weighted shortest path, MST, or priority matrix traversal',
      whenExtra: ['dijkstra', 'prim\'s algorithm', 'swim in rising water'],
    },
    'advanced-step2': {
      proceed: 'WHEN: custom comparator, lazy deletion, or multi-heap coordination',
      whenExtra: ['last stone weight', 'orders backlog', 'minimize deviation'],
    },
  },
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'heap-step1': PATTERN_GATE,

  'topk-step2': d({
    whenAtThisStep: 'Top-K, k-way merge, or streaming median.',
    xray: [
      { text: 'Return the **kth largest** element in an array', kind: 'goal' },
      { text: 'Return the **k most frequent** elements', kind: 'goal' },
      { text: '**Merge k sorted** linked lists', kind: 'goal' },
      { text: 'Return the **kth smallest** in a sorted matrix', kind: 'goal' },
      { text: 'Find the **median** from a data stream', kind: 'goal' },
    ],
    budget: ['topK', 'kFreq', 'kWayMerge', 'median'],
    sayIt: ['Kth => heap of size k. K frequent => freq map + heap. K-way merge => heap of heads. Median => two heaps.'],
    branchGuides: {
      kth: { proceed: 'WHEN: single kth selection or k closest' },
      'k-freq': { proceed: 'WHEN: frequency-based top K' },
      'k-way-merge': { proceed: 'WHEN: merging k sorted structures' },
      median: { proceed: 'WHEN: streaming median (two heaps)' },
    },
  }),

  'scheduling-step2': d({
    whenAtThisStep: 'Task scheduling, interval management, or event simulation.',
    xray: [
      { text: 'Schedule tasks with a **cooldown** between same tasks', kind: 'goal' },
      { text: 'Find minimum **meeting rooms** needed', kind: 'goal' },
      { text: '**Car pooling** — can capacity handle all trips?', kind: 'goal' },
      { text: 'Is it a **straight hand** of group size gs?', kind: 'goal' },
      { text: 'Max **apples eaten** before they rot', kind: 'goal' },
    ],
    budget: ['taskSchedule', 'intervalSchedule', 'eventSim', 'greedy'],
    sayIt: ['Task scheduler => max-heap of freq, batch of n+1. Meetings => sort + min-heap. Events => ordered map.'],
    branchGuides: {
      'task-sched': { proceed: 'WHEN: CPU scheduling or task cooldown' },
      meeting: { proceed: 'WHEN: interval overlap, meeting rooms' },
      'event-sim': { proceed: 'WHEN: time-based simulation' },
    },
  }),

  'graph-step2': d({
    whenAtThisStep: 'Dijkstra, MST, or priority matrix traversal.',
    xray: [
      { text: '**Network delay** — shortest path from K to all nodes', kind: 'goal' },
      { text: '**Path with minimum effort** — grid dijkstra variant', kind: 'goal' },
      { text: '**Min cost to connect** all points (MST)', kind: 'goal' },
      { text: '**Swim in rising water** — min-heap grid traversal', kind: 'goal' },
    ],
    budget: ['dijkstra', 'mst', 'graphShortest', 'matrixTraversal'],
    sayIt: ['Dijkstra => min-heap (dist, node). Prim => min-heap (cost, node). Matrix => min-heap (height, r, c).'],
    branchGuides: {
      dijkstra: { proceed: 'WHEN: non-negative weighted shortest path' },
      mst: { proceed: 'WHEN: minimum spanning tree (Prim\'s)' },
      'matrix-priority': { proceed: 'WHEN: priority-ordered matrix traversal' },
    },
  }),

  'advanced-step2': d({
    whenAtThisStep: 'Custom comparison, lazy deletion, or multi-heap coordination.',
    xray: [
      { text: '**Last stone weight** — always smash two heaviest', kind: 'goal' },
      { text: '**Maximum average pass ratio** — custom comparator', kind: 'goal' },
      { text: '**Number of orders in backlog** — lazy deletion', kind: 'goal' },
      { text: '**Minimize deviation** in array — multi-heap', kind: 'goal' },
      { text: '**Longest subarray** with absolute diff <= limit', kind: 'goal' },
    ],
    budget: ['customCmp', 'lazyDelete', 'multiHeap'],
    sayIt: ['Custom cmp => comparator lambda. Lazy deletion => map + skip stale. Multi-heap => coordinate two heaps.'],
    branchGuides: {
      'custom-cmp': { proceed: 'WHEN: custom comparator or ordering logic' },
      'lazy-delete': { proceed: 'WHEN: stale entries in heap' },
      'multi-heap': { proceed: 'WHEN: two heaps, deviate/balance' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
