import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'arrayNums', label: 'Array of integers', group: 'input' },
  { id: 'stringInput', label: 'String input', group: 'input' },
  { id: 'grid', label: '2D grid / matrix', group: 'input' },
  { id: 'targetSum', label: 'Target sum / value', group: 'input' },
  { id: 'maximize', label: 'Maximize / minimize output', group: 'goal' },
  { id: 'countWays', label: 'Count number of ways', group: 'goal' },
  { id: 'checkFeasible', label: 'Check feasibility (true/false)', group: 'goal' },
  { id: 'subsequence', label: 'Subsequence / substring constraint', group: 'structure' },
  { id: 'adjacentDep', label: 'Adjacent / previous-state dependency', group: 'structure' },
  { id: 'multiState', label: 'Multi-dimensional state (2D+, knapsack)', group: 'structure' },
  { id: 'bitmask', label: 'Bitmask / state compression', group: 'structure' },
  { id: 'optimization', label: 'Optimization technique (space, D&C, queue)', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
