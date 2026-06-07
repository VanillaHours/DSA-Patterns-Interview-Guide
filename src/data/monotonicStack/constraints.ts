import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'monotonicStack', label: 'Monotonic stack (increasing / decreasing)', group: 'structure' },
  { id: 'nextGreater', label: 'Next greater element / next smaller element', group: 'goal' },
  { id: 'previousGreater', label: 'Previous greater element / previous smaller element', group: 'goal' },
  { id: 'stackMaintenance', label: 'Sequential element processing with stack', group: 'structure' },
  { id: 'arrayScan', label: 'Single-pass array/sequence scan', group: 'input' },
  { id: 'indexStack', label: 'Store indices (not values) in stack', group: 'structure' },
  { id: 'circularArray', label: 'Circular array handling (2n virtual)', group: 'input' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
