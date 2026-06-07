import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'bitwiseOps', label: 'Bitwise operations (|, &, ^, ~, <<, >>)', group: 'structure' },
  { id: 'singleBit', label: 'Single bit manipulation (set/clear/toggle/check)', group: 'goal' },
  { id: 'xorProperties', label: 'XOR properties (a^a=0, a^0=a, a^b^a=b)', group: 'structure' },
  { id: 'bitMasking', label: 'Bit masking / flag representation', group: 'structure' },
  { id: 'bitShift', label: 'Bit shifting (left/right, arithmetic vs logical)', group: 'structure' },
  { id: 'lsbOps', label: 'LSB operations (n&-n, n&(n-1))', group: 'structure' },
  { id: 'oddEven', label: 'Even/odd / divisibility checks via bits', group: 'goal' },
  { id: 'bitCounting', label: 'Bit counting / set bit population', group: 'goal' },
  { id: 'bitDp', label: 'Bitmask DP (state as bitmask)', group: 'structure' },
  { id: 'trieBit', label: 'Binary trie / bitwise trie', group: 'structure' },
  { id: 'grayCode', label: 'Gray code / binary-reflected code', group: 'structure' },
  { id: 'powerOfTwo', label: 'Power-of-two checks / operations', group: 'goal' },
  { id: 'bitReversal', label: 'Bit reversal / byte swapping', group: 'goal' },
  { id: 'bitHack', label: 'Bit hacks (Brian Kernighan, etc.)', group: 'structure' },
  { id: 'stateCompression', label: 'State compression via bitmask', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
