import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'onePass', label: 'Single pass / linear scan', group: 'structure' },
  { id: 'twoPointer', label: 'Two pointers in same/opposite direction', group: 'structure' },
  { id: 'slidingWindow', label: 'Sliding / expanding window', group: 'structure' },
  { id: 'binarySearch', label: 'Binary search / halving', group: 'structure' },
  { id: 'multiDim', label: '2D matrix / multidimensional', group: 'input' },
  { id: 'sorted', label: 'Sorted or partially sorted', group: 'input' },
  { id: 'unsorted', label: 'Unsorted (sort first OK)', group: 'input' },
  { id: 'inPlace', label: 'In-place O(1) extra space', group: 'space' },
  { id: 'contiguous', label: 'Contiguous subarray/substring', group: 'structure' },
  { id: 'fixedK', label: 'Fixed window size k', group: 'structure' },
  { id: 'rotated', label: 'Rotated / mountain array', group: 'input' },
  { id: 'answerSpace', label: 'Answer in monotonic range', group: 'structure' },
  { id: 'maximize', label: 'Maximize (profit, length, …)', group: 'goal' },
  { id: 'minimize', label: 'Minimize (length, capacity, …)', group: 'goal' },
  { id: 'targetSum', label: 'Sum / target matching', group: 'goal' },
  { id: 'enumerate', label: 'Find all / count', group: 'goal' },
  { id: 'jump', label: 'Jump / reachability', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
