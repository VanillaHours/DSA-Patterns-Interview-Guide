import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'rangeSum', label: 'Range sum query (immutable)', group: 'goal' },
  { id: 'subarraySum', label: 'Subarray sum equals target', group: 'goal' },
  { id: 'prefixSum', label: 'Prefix sum preprocessing', group: 'structure' },
  { id: 'prefixMap', label: 'Prefix sum + hash map', group: 'structure' },
  { id: 'equilibrium', label: 'Equilibrium / pivot index', group: 'goal' },
  { id: 'prefixProduct', label: 'Prefix product', group: 'structure' },
  { id: 'kadane', label: 'Kadane / max subarray', group: 'structure' },
  { id: 'rectSum', label: '2D rectangle sum', group: 'goal' },
  { id: 'submatrix', label: 'Submatrix sum / target', group: 'goal' },
  { id: 'countSquares', label: 'Count square submatrices', group: 'goal' },
  { id: 'diffArray', label: 'Difference array / range update', group: 'structure' },
  { id: 'lineSweep', label: 'Line sweep with events', group: 'structure' },
  { id: 'prefixXor', label: 'Prefix XOR', group: 'structure' },
  { id: 'prefixMinMax', label: 'Prefix min / max', group: 'structure' },
  { id: 'o1Query', label: 'O(1) range query', group: 'goal' },
  { id: 'mutable', label: 'Mutable array (segment tree better)', group: 'input' },
  { id: 'remainder', label: 'Modulo / remainder tracking', group: 'goal' },
  { id: 'binarySubarray', label: 'Binary array subarray', group: 'input' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
