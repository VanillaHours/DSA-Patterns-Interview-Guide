import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'parentheses', label: 'Parentheses / bracket matching', group: 'structure' },
  { id: 'monotonic', label: 'Monotonic stack property', group: 'structure' },
  { id: 'expression', label: 'Expression evaluation', group: 'structure' },
  { id: 'treeStack', label: 'Tree traversal (iterative stack)', group: 'structure' },
  { id: 'graphStack', label: 'Graph DFS with stack', group: 'structure' },
  { id: 'bfs', label: 'BFS / level order', group: 'structure' },
  { id: 'multiSource', label: 'Multi-source BFS', group: 'structure' },
  { id: 'deque', label: 'Deque / double-ended queue', group: 'structure' },
  { id: 'priorityQueue', label: 'Priority queue / heap', group: 'input' },
  { id: 'circularQueue', label: 'Circular queue design', group: 'structure' },
  { id: 'reconstruction', label: 'Queue reconstruction', group: 'structure' },
  { id: 'stackDesign', label: 'Stack design (min/max)', group: 'structure' },
  { id: 'queueDesign', label: 'Queue design patterns', group: 'structure' },
  { id: 'taskSchedule', label: 'Task scheduling / processing', group: 'goal' },
  { id: 'slidingWindow', label: 'Sliding window', group: 'structure' },
  { id: 'rangeQuery', label: 'Range min / max query', group: 'goal' },
  { id: 'topK', label: 'Top K / Kth selection', group: 'goal' },
  { id: 'greedy', label: 'Greedy scheduling', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
