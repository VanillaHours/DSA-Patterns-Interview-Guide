import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'unsorted', label: 'Unsorted input array', group: 'input' },
  { id: 'stringInput', label: 'String / character input', group: 'input' },
  { id: 'listNode', label: 'ListNode* / linked list', group: 'input' },
  { id: 'twoInputs', label: 'Two inputs (arrays / strings)', group: 'input' },
  { id: 'o1Space', label: 'O(1) extra space required', group: 'space' },
  { id: 'oNTime', label: 'O(n) time expected', group: 'space' },
  { id: 'frequency', label: 'Frequency / count tracking', group: 'structure' },
  { id: 'complement', label: 'Complement / target lookup', group: 'structure' },
  { id: 'grouping', label: 'Grouping / classification', group: 'structure' },
  { id: 'bijection', label: 'One-to-one mapping / bijection', group: 'structure' },
  { id: 'prefixSum', label: 'Prefix sum / running total', group: 'structure' },
  { id: 'rollingHash', label: 'Rolling hash / substring', group: 'structure' },
  { id: 'targetSum', label: 'Sum / target matching', group: 'goal' },
  { id: 'maximize', label: 'Maximize (size, frequency, …)', group: 'goal' },
  { id: 'minimize', label: 'Minimize (distance, swaps, …)', group: 'goal' },
  { id: 'enumerate', label: 'Find all / count unique', group: 'goal' },
  { id: 'topK', label: 'Top K / most frequent', group: 'goal' },
  { id: 'cache', label: 'Cache / design data structure', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
