import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'exactMatch', label: 'Exact target value search', group: 'goal' },
  { id: 'firstLast', label: 'First / last occurrence of target', group: 'goal' },
  { id: 'insertPos', label: 'Insert position or closest element', group: 'goal' },
  { id: 'rotatedArray', label: 'Rotated sorted array', group: 'structure' },
  { id: 'mountainArray', label: 'Mountain / bitonic array', group: 'structure' },
  { id: 'unknownSize', label: 'Unknown or infinite array size', group: 'input' },
  { id: 'minMax', label: 'Minimize a maximum value', group: 'goal' },
  { id: 'maxMin', label: 'Maximize a minimum value', group: 'goal' },
  { id: 'kthSearch', label: 'Kth smallest / largest (BS on answer)', group: 'goal' },
  { id: 'feasibility', label: 'Feasibility check (can we? predicate)', group: 'structure' },
  { id: 'sortedInput', label: 'Sorted input array', group: 'input' },
  { id: 'logN', label: 'O(log n) time constraint', group: 'goal' },
  { id: 'monotonic', label: 'Monotonic predicate / function', group: 'input' },
  { id: 'matrixSearch', label: '2D sorted matrix search', group: 'structure' },
  { id: 'parallelBS', label: 'Parallel / multi-constraint BS', group: 'structure' },
  { id: 'peakElement', label: 'Peak element in array', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
