import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const basics: TaxonomyNode = decision(
  'bm-basics-step3',
  'Bitmask Basics — how to represent subsets as integers?',
  'blue',
  3,
  'Representing sets with bitmasks. Which aspect?',
  [
    branch(
      ['"represent subset"', '"subset as integer"', '"bitmask"', '"bits represent"', '"include/exclude"'],
      'Representing Subsets as Integers',
      'Each bit i = 1 means element i is in the set. Mask ranges 0..2^n-1.',
      L.subsetIntLeaf,
    ),
    branch(
      ['"empty mask"', '"full mask"', '"single mask"', '"all bits"', '"one bit set"'],
      'Empty / Full / Single Masks',
      'empty=0, full=(1<<n)-1, single=1<<i.',
      L.emptyFullSingleLeaf,
    ),
    branch(
      ['"is subset"', '"mask property"', '"test bit"', '"popcount"', '"size"'],
      'Mask Properties',
      'isSubset, isEmpty, isFull, size via popcount.',
      L.maskPropsLeaf,
    ),
  ],
)

const bitOps: TaxonomyNode = decision(
  'bm-ops-step3',
  'Bit Operations on Masks — how to modify or query a bit?',
  'green',
  3,
  'Setting, clearing, toggling, or checking individual bits. Which operation?',
  [
    branch(
      ['"set bit"', '"turn on"', '"enable bit"', '1 << i'],
      'Set a Bit',
      'Set bit i to 1: mask | (1 << i).',
      L.setBitLeaf,
    ),
    branch(
      ['"unset bit"', '"clear bit"', '"turn off"', '"remove bit"'],
      'Unset a Bit',
      'Clear bit i to 0: mask & ~(1 << i).',
      L.unsetBitLeaf,
    ),
    branch(
      ['"toggle"', '"flip"', '"xor bit"', '"invert bit"'],
      'Toggle a Bit',
      'Flip bit i: mask ^ (1 << i).',
      L.toggleBitLeaf,
    ),
    branch(
      ['"check"', '"test"', '"has bit"', '"is set"', '"membership"'],
      'Check Membership',
      'Test if bit i is set: (mask >> i) & 1.',
      L.checkBitLeaf,
    ),
  ],
)

const iteration: TaxonomyNode = decision(
  'bm-iter-step3',
  'Mask Iteration — how to enumerate subsets or supersets?',
  'teal',
  3,
  'Iterating over subsets/supersets of a mask. Which pattern?',
  [
    branch(
      ['"all subsets"', '"enumerate all"', '"every subset"', '"power set"', '2^n'],
      'Enumerate All Subsets',
      'for mask = 0..(1<<n)-1. O(2^n).',
      L.enumSubsetsLeaf,
    ),
    branch(
      ['"submask"', '"enumerate submasks"', '"sub = (sub-1) & mask"'],
      'Enumerate Submasks',
      'for sub = mask; sub; sub = (sub-1) & mask. O(3^n) total.',
      L.enumSubmasksLeaf,
    ),
    branch(
      ['"superset"', '"super mask"', '"enumerate supersets"', '(sup+1) | mask'],
      'Enumerate Supersets',
      'for sup = mask; sup <= full; sup = (sup+1) | mask.',
      L.enumSupersetsLeaf,
    ),
    branch(
      ['"gosper"', '"k-sized"', '"k subsets"', '"combinations"', 'next combination'],
      "Gosper's Hack",
      'Iterate all k-sized subsets in lexicographic order.',
      L.gosperLeaf,
    ),
  ],
)

const bitFunctions: TaxonomyNode = decision(
  'bm-funcs-step3',
  'Built-in Bit Functions — what bit manipulation utilities are available?',
  'purple',
  3,
  'Using built-in or manual bit functions. Which function?',
  [
    branch(
      ['"popcount"', '"count bits"', '"bit count"', '"number of 1s"', '"hamming weight"'],
      'Popcount (Bit Count)',
      'Count number of 1 bits. Built-in or Brian Kernighan.',
      L.popcountLeaf,
    ),
    branch(
      ['"lowbit"', '"lsb"', '"lowest bit"', '"least significant"', 'x & -x'],
      'Lowbit (LSB)',
      'Isolate lowest set bit: x & -x.',
      L.lowbitLeaf,
    ),
    branch(
      ['"leading zeros"', '"trailing zeros"', '"clz"', '"ctz"', '"count zeros"'],
      'Leading / Trailing Zeros',
      'Built-in: __builtin_clz, __builtin_ctz.',
      L.leadingTrailingLeaf,
    ),
    branch(
      ['"bit width"', '"msb"', '"most significant"', '"highest bit"', '"floor log2"'],
      'Bit Width',
      'Number of bits needed to represent x: 32 - clz(x).',
      L.bitWidthLeaf,
    ),
  ],
)

const fundamentals: TaxonomyNode = decision(
  'bm-fund-step2',
  'Fundamentals & Operations',
  'slate',
  2,
  'Core bitmask operations: representation, bit ops, iteration, or built-in functions. Pick ONE:',
  [
    branch(
      ['"represent"', '"subset"', '"bitmask basics"', '"set"', '"bit i means"'],
      '→ Bitmask Basics',
      'Representing subsets as integers, empty/full masks, mask properties.',
      basics,
    ),
    branch(
      ['"set"', '"unset"', '"toggle"', '"check"', '"bit op"', '"modify bit"', '"query bit"'],
      '→ Bit Operations on Masks',
      'Set, unset, toggle, and check individual bits.',
      bitOps,
    ),
    branch(
      ['"iterate"', '"enumerate"', '"submask"', '"superset"', '"gosper"', '"k subset"'],
      '→ Mask Iteration',
      'Enumerate subsets, submasks, supersets, and k-sized combinations.',
      iteration,
    ),
    branch(
      ['"popcount"', '"lowbit"', '"clz"', '"ctz"', '"width"', '"built-in"', '"bit function"'],
      '→ Built-in Bit Functions',
      'Popcount, lowbit, leading/trailing zeros, bit width.',
      bitFunctions,
    ),
  ],
)

export const bmRoot: TaxonomyNode = decision(
  'bm-root',
  'Bitmask Pattern',
  'slate',
  1,
  'Bitmask: represent subsets as integers for efficient manipulation and iteration. Which domain?',
  [
    branch(
      ['"fundamental"', '"operation"', '"basics"', '"represent"', '"bit op"', '"iterate"', '"popcount"', '"lowbit"', '"mask"'],
      '→ Fundamentals & Operations',
      'Core bitmask: representation, bit ops, iteration, and built-in functions.',
      fundamentals,
    ),
  ],
)
