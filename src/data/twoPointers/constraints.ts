import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'sorted', label: 'Sorted / non-decreasing', group: 'input' },
  { id: 'unsorted', label: 'Unsorted (sort first OK)', group: 'input' },
  { id: 'listNode', label: 'ListNode* / linked list', group: 'input' },
  { id: 'twoInputs', label: 'Two arrays / lists / strings', group: 'input' },
  { id: 'string', label: 'String processing', group: 'input' },
  { id: 'inPlace', label: 'In-place O(1) extra space', group: 'space' },
  { id: 'o1Space', label: 'O(1) memory required', group: 'space' },
  { id: 'contiguous', label: 'Contiguous subarray/substring', group: 'structure' },
  { id: 'fixedK', label: 'Fixed window size k', group: 'structure' },
  { id: 'opposite', label: 'Pair from both ends', group: 'structure' },
  { id: 'values012', label: 'Values only 0, 1, 2', group: 'input' },
  { id: 'maximize', label: 'Maximize (area, length, …)', group: 'goal' },
  { id: 'minimize', label: 'Minimize (length, boats, …)', group: 'goal' },
  { id: 'targetSum', label: 'Sum / target matching', group: 'goal' },
  { id: 'enumerate', label: 'Find all tuples / count', group: 'goal' },
  { id: 'kth', label: 'Kth largest / select', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
