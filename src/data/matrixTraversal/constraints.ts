import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'grid2d', label: '2D grid / matrix input', group: 'input' },
  { id: 'island', label: 'Island / region connectivity', group: 'structure' },
  { id: 'shortestPath', label: 'Shortest path in grid', group: 'goal' },
  { id: 'colorFill', label: 'Flood fill / color replacement', group: 'goal' },
  { id: 'rotate', label: 'In-place rotation', group: 'structure' },
  { id: 'spiral', label: 'Spiral order traversal', group: 'structure' },
  { id: 'diagonal', label: 'Diagonal traversal', group: 'structure' },
  { id: 'bfsGrid', label: 'BFS on grid', group: 'structure' },
  { id: 'dfsGrid', label: 'DFS on grid', group: 'structure' },
  { id: 'multiSource', label: 'Multi-source propagation', group: 'structure' },
  { id: 'backtrack', label: 'Backtracking on grid', group: 'structure' },
  { id: 'obstacle', label: 'Obstacles / constrained movement', group: 'input' },
  { id: 'memoGrid', label: 'Memoization on grid paths', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
