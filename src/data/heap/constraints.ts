import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'topK', label: 'Top-K / kth selection', group: 'goal' },
  { id: 'kFreq', label: 'K frequent elements', group: 'goal' },
  { id: 'kWayMerge', label: 'K-way merge of sorted structures', group: 'structure' },
  { id: 'median', label: 'Median / two-heap balance', group: 'structure' },
  { id: 'taskSchedule', label: 'Task scheduling / CPU processing', group: 'goal' },
  { id: 'intervalSchedule', label: 'Interval scheduling / meeting rooms', group: 'goal' },
  { id: 'eventSim', label: 'Event-based simulation', group: 'structure' },
  { id: 'dijkstra', label: 'Dijkstra / shortest path', group: 'structure' },
  { id: 'mst', label: 'Minimum spanning tree', group: 'structure' },
  { id: 'matrixTraversal', label: 'Matrix traversal with priority', group: 'structure' },
  { id: 'customCmp', label: 'Custom comparator / ordering', group: 'input' },
  { id: 'lazyDelete', label: 'Lazy deletion from heap', group: 'structure' },
  { id: 'multiHeap', label: 'Multi-heap coordination', group: 'structure' },
  { id: 'streaming', label: 'Streaming / online data', group: 'input' },
  { id: 'greedy', label: 'Greedy with priority', group: 'goal' },
  { id: 'oNLogK', label: 'O(n log k) time constraint', group: 'goal' },
  { id: 'graphShortest', label: 'Graph shortest path', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
