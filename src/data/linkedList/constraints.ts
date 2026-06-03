import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'traversal', label: 'Traversal / iteration', group: 'structure' },
  { id: 'deletion', label: 'Deletion operations', group: 'structure' },
  { id: 'insertion', label: 'Insertion operations', group: 'structure' },
  { id: 'reversal', label: 'Reversal (whole / sublist)', group: 'structure' },
  { id: 'fastSlow', label: 'Fast & slow pointers', group: 'structure' },
  { id: 'relativePos', label: 'Relative positioning (nth from end)', group: 'goal' },
  { id: 'palindrome', label: 'Palindrome / symmetry check', group: 'goal' },
  { id: 'merge', label: 'Merge / combine lists', group: 'structure' },
  { id: 'partition', label: 'Partition / split lists', group: 'structure' },
  { id: 'sort', label: 'Sorting linked list', group: 'goal' },
  { id: 'clone', label: 'Deep copy / clone with random ptr', group: 'structure' },
  { id: 'doubly', label: 'Doubly linked list', group: 'structure' },
  { id: 'circular', label: 'Circular linked list', group: 'structure' },
  { id: 'cache', label: 'Cache (LRU / LFU) design', group: 'structure' },
  { id: 'reorder', label: 'Reorder / rotate / swap', group: 'structure' },
  { id: 'dummy', label: 'Dummy / sentinel node technique', group: 'structure' },
  { id: 'inPlace', label: 'In-place modification', group: 'structure' },
  { id: 'cycleDetect', label: 'Cycle detection', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
