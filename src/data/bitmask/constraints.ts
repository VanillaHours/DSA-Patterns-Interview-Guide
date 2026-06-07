import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'bitmask', label: 'Bitmask / bit manipulation for state representation', group: 'structure' },
  { id: 'subsetEnum', label: 'Subset enumeration via bitmask', group: 'goal' },
  { id: 'bitOps', label: 'Bit operations (set, unset, toggle, check)', group: 'structure' },
  { id: 'popcount', label: 'Popcount / bit counting', group: 'structure' },
  { id: 'lowbit', label: 'Lowbit / least significant bit', group: 'structure' },
  { id: 'maskIteration', label: 'Mask iteration (submask, superset)', group: 'goal' },
  { id: 'intAsSet', label: 'Integer representation of a set (0..n-1)', group: 'input' },
  { id: 'stateCompression', label: 'State compression with bitmask', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
