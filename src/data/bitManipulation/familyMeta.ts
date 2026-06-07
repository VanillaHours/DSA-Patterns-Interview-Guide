import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'basic-bit-operations': {
    tagline: 'Fundamental bit manipulation techniques: single bits, multiple bits, counting, and shifting.',
    keywords: ['set bit', 'clear bit', 'toggle bit', 'check bit', 'bit shifting', 'lsb', 'msb', 'bit count'],
    budget: ['single bit', 'multiple bits', 'bit count', 'shifting'],
  },
  'bit-manipulation-apps': {
    tagline: 'Common use cases: math operations, XOR applications, AND/OR patterns, state representation.',
    keywords: ['xor', 'bit math', 'bit masking', 'gray code', 'bit vector', 'bit flags', 'range and', 'range or'],
    budget: ['math', 'xor', 'and-or', 'state rep'],
  },
  'bitwise-dp': {
    tagline: 'DP problems using bit manipulation: bitmask DP, state compression, and binary search + bits.',
    keywords: ['bitmask dp', 'state compression', 'tsp bitmask', 'subset dp', 'binary search bits'],
    budget: ['bitmask dp', 'state compression', 'bs bits'],
  },
  'bit-tricks': {
    tagline: 'Clever bit manipulation: bit hacks, advanced techniques, and bit ops in other algorithms.',
    keywords: ['brian kernighan', 'power of two', 'bit hacks', 'fast multiplication', 'integer log'],
    budget: ['hacks', 'advanced', 'in algorithms'],
  },
}
