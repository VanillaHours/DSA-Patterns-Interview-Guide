import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'arrayNums', label: 'Array of integers', group: 'input' },
  { id: 'arrayDistinct', label: 'Array of distinct integers', group: 'input' },
  { id: 'arrayDups', label: 'Array with duplicates', group: 'input' },
  { id: 'stringInput', label: 'String input', group: 'input' },
  { id: 'grid', label: 'Grid / matrix', group: 'input' },
  { id: 'graphEdges', label: 'Graph edges', group: 'input' },
  { id: 'subset', label: 'Generate subsets / combinations', group: 'goal' },
  { id: 'permute', label: 'Generate permutations', group: 'goal' },
  { id: 'partition', label: 'Partition into valid groups', group: 'goal' },
  { id: 'constraintSat', label: 'Constraint satisfaction (N-Queens, Sudoku)', group: 'goal' },
  { id: 'allPaths', label: 'Find all paths / solutions', group: 'goal' },
  { id: 'optimize', label: 'Optimize (max/min) with pruning', group: 'goal' },
  { id: 'memoization', label: 'Memoization / DP with backtracking', group: 'structure' },
  { id: 'pruning', label: 'Pruning / branch-and-bound', group: 'structure' },
  { id: 'visitedState', label: 'Visited / used state tracking', group: 'structure' },
  { id: 'board', label: 'NxN board / matrix constraint', group: 'input' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
