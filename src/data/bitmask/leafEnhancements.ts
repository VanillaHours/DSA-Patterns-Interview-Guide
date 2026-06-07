import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Bitmask Basics ─────────────────────────────────────────

  'bm-subset-int': e({
    xray: [
      { text: 'Each **bit i** = 1 means element i is in the set', kind: 'signal' },
      { text: '**n** elements → masks range 0..**2^n-1**', kind: 'constraint' },
    ],
    budget: ['bit = element', 'power set'],
    slottedTemplate: `int n = /* SLOT: elementCount */;
// mask = 0 (empty), mask = (1<<n)-1 (full), mask = 1<<i ({i})`,
    slots: [
      { id: 'ELEMENT_COUNT', label: 'Number of elements', hint: 'arr.size()' },
    ],
    slotFills: {
      78: { ELEMENT_COUNT: 'nums.size()' },
    },
    helixOrder: [78],
    helixDelta: {
      78: 'Bitmask subset enumeration: each bit = element. O(n * 2^n) total enumeration.',
    },
    autopsies: [
      {
        cause: 'Shifting beyond bit width',
        wrong: '(1 << n) for n = 32 on 32-bit int',
        testCase: 'Undefined behavior or INT_MIN',
        fix: 'Use 1LL << n for n up to 63, or use bitset for n > 30',
      },
    ],
    sayIt: [
      'Bitmask: bit i = element i. Masks from 0 (empty) to (1<<n)-1 (full).',
    ],
  }),

  'bm-empty-full': e({
    xray: [
      { text: '**empty** = 0, **full** = (1<<n)-1, **single** = 1<<i', kind: 'signal' },
    ],
    budget: ['empty', 'full', 'single'],
    slottedTemplate: `int empty = 0;
int full = (1 << /* SLOT: n */) - 1;
int single = 1 << /* SLOT: i */;`,
    slots: [
      { id: 'N', label: 'Number of elements', hint: 'n' },
      { id: 'I', label: 'Element index', hint: 'i' },
    ],
    slotFills: {
      78: { N: 'nums.size()', I: 'i // element index' },
    },
    helixOrder: [78],
    helixDelta: {
      78: 'Common masks: empty = 0, full = (1<<n)-1, single = 1<<i.',
    },
    autopsies: [
      {
        cause: 'Off-by-one in full mask',
        wrong: '(1 << n) // missing -1',
        testCase: 'n=3 → 1<<3 = 8, not 7 (111 binary)',
        fix: '(1 << n) - 1',
      },
    ],
    sayIt: [
      'Three common masks: empty (0), full (all bits), single (one bit).',
    ],
  }),

  'bm-mask-props': e({
    xray: [
      { text: '**isSubset(a,b)**: (a & b) == a', kind: 'signal' },
      { text: '**size(m)**: __builtin_popcount(m)', kind: 'signal' },
    ],
    budget: ['isSubset', 'popcount'],
    slottedTemplate: `bool isSubset(int a, int b) { return (a & b) == a; }
bool isEmpty(int m) { return m == 0; }
int size(int m) { return __builtin_popcount(/* SLOT: mask */); }`,
    slots: [
      { id: 'MASK', label: 'Mask to count bits in', hint: 'm' },
    ],
    slotFills: {
      0: { MASK: 'm' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Reversed isSubset arguments',
        wrong: '(a & b) == b // checking if b ⊆ a instead',
        testCase: 'isSubset({0,1}, {0}) returns false',
        fix: '(a & b) == a checks if a ⊆ b',
      },
    ],
    sayIt: [
      'Mask properties: isSubset(a,b) = (a&b)==a. Size via popcount.',
    ],
  }),

  // ── Bit Operations on Masks ───────────────────────────────

  'bm-set-bit': e({
    xray: [
      { text: '**mask | (1<<i)** — turn bit i on', kind: 'signal' },
    ],
    budget: ['OR', 'set bit'],
    slottedTemplate: `int setBit(int mask, int i) { return mask | (1 << /* SLOT: bit */); }`,
    slots: [
      { id: 'BIT', label: 'Bit position to set', hint: 'i' },
    ],
    slotFills: {
      318: { BIT: 'c - \'a\' // map char to 0..25' },
    },
    helixOrder: [318],
    helixDelta: {
      318: 'Set bit: mask |= 1<<(c-\'a\'). Build word bitmask for overlap check.',
    },
    autopsies: [
      {
        cause: 'Using XOR (^) to set a bit',
        wrong: 'mask ^ (1<<i) // toggles, does not guarantee 1',
        testCase: 'mask=0, i=0 → 0^1=1 ✅; mask=1, i=0 → 1^1=0 ❌',
        fix: 'mask | (1<<i) — OR always sets to 1',
      },
    ],
    sayIt: [
      'Set bit i: mask | (1<<i). OR guarantees the bit becomes 1.',
    ],
  }),

  'bm-unset-bit': e({
    xray: [
      { text: '**mask & ~(1<<i)** — turn bit i off', kind: 'signal' },
    ],
    budget: ['AND NOT', 'clear bit'],
    slottedTemplate: `int unsetBit(int mask, int i) { return mask & ~(1 << /* SLOT: bit */); }`,
    slots: [
      { id: 'BIT', label: 'Bit position to unset', hint: 'i' },
    ],
    slotFills: {
      0: { BIT: 'i' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Missing parentheses in ~(1<<i)',
        wrong: '~1 << i // computes ~1 = -2, then shifts left',
        testCase: '~1 << 2 = -8, not ~(1<<2) = ~4 = -5',
        fix: 'Always use ~(1 << i) with parentheses',
      },
    ],
    sayIt: [
      'Unset bit: mask & ~(1<<i). AND with inverted mask clears the bit.',
    ],
  }),

  'bm-toggle-bit': e({
    xray: [
      { text: '**mask ^ (1<<i)** — flip bit i', kind: 'signal' },
    ],
    budget: ['XOR', 'flip'],
    slottedTemplate: `int toggleBit(int mask, int i) { return mask ^ (1 << /* SLOT: bit */); }`,
    slots: [
      { id: 'BIT', label: 'Bit position to toggle', hint: 'i' },
    ],
    slotFills: {
      0: { BIT: 'i' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Using XOR to set a specific value',
        wrong: 'mask ^ (1<<i) // toggles instead of setting to 1/0',
        testCase: 'mask=1, i=0 → 1^1=0; expected 1',
        fix: 'Use OR for set-to-1, AND~ for set-to-0. XOR only for flip.',
      },
    ],
    sayIt: [
      'Toggle bit: mask ^ (1<<i). XOR is its own inverse — double toggle restores original.',
    ],
  }),

  'bm-check-mem': e({
    xray: [
      { text: '**(mask >> i) & 1** — check if bit i is set', kind: 'signal' },
      { text: '**mask & (1<<i)** — non-zero means set', kind: 'signal' },
    ],
    budget: ['right shift', 'AND'],
    slottedTemplate: `bool hasBit(int mask, int i) { return (mask >> i) & /* SLOT: one */; }
bool hasAny(int a, int b) { return a & b; } // non-zero = overlap`,
    slots: [
      { id: 'ONE', label: 'Check value', hint: '1' },
    ],
    slotFills: {
      191: { ONE: '1' },
      318: { ONE: '1' },
    },
    helixOrder: [191, 318],
    helixDelta: {
      191: 'Check each bit via (n>>i)&1. Count 1s for popcount.',
      318: 'Check word overlap: (mask[a] & mask[b]) == 0 → no common letters.',
    },
    autopsies: [
      {
        cause: 'Not converting to bool',
        wrong: 'if (mask & (1<<i)) // works in C++ but value is power of 2',
        testCase: 'mask & (1<<i) returns 1<<i, not 1',
        fix: 'Cast to bool or use (mask>>i)&1 for 0/1',
      },
    ],
    sayIt: [
      'Check bit: (mask >> i) & 1. For overlap: a & b != 0 means common bits.',
    ],
  }),

  // ── Mask Iteration ────────────────────────────────────────

  'bm-enum-subsets': e({
    xray: [
      { text: '**for mask = 0..(1<<n)-1** — all 2^n subsets', kind: 'signal' },
      { text: 'O(n * 2^n) with inner element extraction', kind: 'constraint' },
    ],
    budget: ['full enumeration', 'power set'],
    slottedTemplate: `int n = /* SLOT: n */;
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if (mask >> i & 1) {
            // element i is in this subset
        }
    }
}`,
    slots: [
      { id: 'N', label: 'Number of elements', hint: 'size' },
    ],
    slotFills: {
      78: { N: 'nums.size()' },
    },
    helixOrder: [78],
    helixDelta: {
      78: 'All subsets: for mask = 0..(1<<n)-1. Extract bits to get subset elements.',
    },
    autopsies: [
      {
        cause: 'Integer overflow for large n',
        wrong: '(1 << n) for n >= 31',
        testCase: 'n=31 → 1<<31 = INT_MIN; loop never ends',
        fix: 'Use long long for n up to 63, or check n <= 20 before using bitmask',
      },
    ],
    sayIt: [
      'All subsets: for mask = 0..(1<<n)-1. O(2^n). Extract bits to build subset.',
    ],
  }),

  'bm-enum-submasks': e({
    xray: [
      { text: '**(sub-1) & mask** trick enumerates all submasks', kind: 'signal' },
      { text: 'O(3^n) for all masks total', kind: 'constraint' },
    ],
    budget: ['submask', '(sub-1)&mask'],
    slottedTemplate: `for (int sub = /* SLOT: mask */; sub; sub = (sub - 1) & mask) {
    // process submask
}
// handle sub = 0 separately if needed`,
    slots: [
      { id: 'MASK', label: 'Original mask', hint: 'mask' },
    ],
    slotFills: {
      2392: { MASK: 'mask' },
    },
    helixOrder: [2392],
    helixDelta: {
      2392: 'Submask enumeration: (sub-1)&mask iterates all submasks. Handle empty separately.',
    },
    autopsies: [
      {
        cause: 'Missing empty submask (sub = 0)',
        wrong: 'loop body never executes when only submask is 0',
        testCase: 'mask = 0 → no iterations; empty submask missed',
        fix: 'Handle sub = 0 before/after the loop, or do-while pattern',
      },
    ],
    sayIt: [
      'Submask enumeration: for(sub=mask; sub; sub=(sub-1)&mask). O(3^n) total across all masks.',
    ],
  }),

  'bm-enum-super': e({
    xray: [
      { text: '**(sup+1) | mask** enumerates all supersets', kind: 'signal' },
    ],
    budget: ['superset', '(sup+1)|mask'],
    slottedTemplate: `int full = (1 << /* SLOT: n */) - 1;
for (int sup = mask; sup <= full; sup = (sup + 1) | mask) {
    // process superset
}`,
    slots: [
      { id: 'N', label: 'Number of elements', hint: 'n' },
    ],
    slotFills: {
      0: { N: 'n' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Wrong formula — missing | mask',
        wrong: 'sup++ // would not skip to next valid superset',
        testCase: 'mask=010, sup++ goes 010→011 (invalid superset of 010)',
        fix: 'sup = (sup + 1) | mask ensures only valid supersets',
      },
    ],
    sayIt: [
      'Superset enumeration: (sup+1)|mask. Symmetric to submask iteration.',
    ],
  }),

  'bm-gosper': e({
    xray: [
      { text: 'Iterates all **k-sized** subsets in lexicographic order', kind: 'signal' },
      { text: '**c = sub & -sub; r = sub + c; next = (((r ^ sub) >> 2) / c) | r**', kind: 'signal' },
    ],
    budget: ['k-sized', 'lexicographic'],
    slottedTemplate: `int k = /* SLOT: k */, n = /* SLOT: n */;
int sub = (1 << k) - 1;
while (sub < (1 << n)) {
    // process k-sized subset
    int c = sub & -sub;
    int r = sub + c;
    sub = (((r ^ sub) >> 2) / c) | r;
}`,
    slots: [
      { id: 'K', label: 'Subset size', hint: 'k' },
      { id: 'N', label: 'Total elements', hint: 'n' },
    ],
    slotFills: {
      0: { K: 'k', N: 'n' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Division by zero when c == 0',
        wrong: 'sub = 0, c = 0, division by zero',
        testCase: 'sub = 0 → sub & -sub = 0 → division by zero',
        fix: 'Guard: if (sub == 0) break; or start with sub = (1<<k)-1 > 0',
      },
    ],
    sayIt: [
      'Gosper\'s Hack: iterate all C(n,k) k-sized subsets. Complex to remember — use recursion as alternative.',
    ],
  }),

  // ── Built-in Bit Functions ────────────────────────────────

  'bm-popcount': e({
    xray: [
      { text: '**__builtin_popcount(x)** — GCC/Clang built-in', kind: 'signal' },
      { text: '**Brian Kernighan**: x &= x-1 clears lowest set bit', kind: 'signal' },
    ],
    budget: ['built-in', 'Brian Kernighan'],
    slottedTemplate: `int popcount(int x) {
    int c = 0;
    while (x) { x &= x - 1; /* SLOT: increment */ }
    return c;
}`,
    slots: [
      { id: 'INCREMENT', label: 'Increment counter', hint: 'c++' },
    ],
    slotFills: {
      191: { INCREMENT: 'c++' },
    },
    helixOrder: [191],
    helixDelta: {
      191: 'Brian Kernighan: x &= x-1 clears lowest set bit. Loop runs once per 1-bit.',
    },
    autopsies: [
      {
        cause: 'Infinite loop if condition wrong',
        wrong: 'while (x & (x-1)) // only runs while x has >1 bits',
        testCase: 'x = 8 (1000) → x&(x-1)=0 → loop never runs, c=0',
        fix: 'while (x) { x &= x-1; c++; } — correct Brian Kernighan',
      },
    ],
    sayIt: [
      'Popcount: while(x) { x &= x-1; c++; }. Runs once per 1-bit.',
    ],
  }),

  'bm-lowbit': e({
    xray: [
      { text: '**x & -x** — isolates the lowest set bit', kind: 'signal' },
      { text: '-x = ~x + 1 (two\'s complement)', kind: 'signal' },
    ],
    budget: ['x & -x', 'LSB'],
    slottedTemplate: `int lowbit(int x) { return x & -/* SLOT: x */; }
// returns 0 if x == 0
// returns 1 << trailingZeros(x) otherwise`,
    slots: [
      { id: 'X', label: 'Input value', hint: 'x' },
    ],
    slotFills: {
      231: { X: 'x' },
      191: { X: 'n' },
    },
    helixOrder: [231, 191],
    helixDelta: {
      231: 'Power of Two: x > 0 && (x & -x) == x. Only one bit set.',
      191: 'Lowbit used in Brian Kernighan: x & -x isolates the bit to clear.',
    },
    autopsies: [
      {
        cause: 'INT_MIN edge case',
        wrong: 'x = INT_MIN → -x overflows, x & -x = INT_MIN',
        testCase: 'INT_MIN = -2147483648; -INT_MIN = INT_MIN (overflow)',
        fix: 'Lowbit still works as expected in two\'s complement, but be aware of overflow in -x',
      },
    ],
    sayIt: [
      'Lowbit: x & -x. Isolates the lowest set bit. Returns 0 for x=0.',
    ],
  }),

  'bm-leading-trailing': e({
    xray: [
      { text: '**__builtin_clz(x)** — leading zeros (undefined for 0)', kind: 'signal' },
      { text: '**__builtin_ctz(x)** — trailing zeros (undefined for 0)', kind: 'signal' },
    ],
    budget: ['clz', 'ctz'],
    slottedTemplate: `int leadingZeros(int x) { return x ? __builtin_clz(/* SLOT: x */) : 32; }
int trailingZeros(int x) { return x ? __builtin_ctz(x) : 32; }`,
    slots: [
      { id: 'X', label: 'Input value', hint: 'x' },
    ],
    slotFills: {
      191: { X: 'n' },
    },
    helixOrder: [191],
    helixDelta: {
      191: 'clz/ctz: leading zeros and trailing zeros. Undefined for 0 — always guard.',
    },
    autopsies: [
      {
        cause: 'Calling clz/ctz on 0',
        wrong: '__builtin_clz(0) // undefined behavior',
        testCase: 'May crash or return garbage',
        fix: 'Always guard: x ? __builtin_clz(x) : bit_width',
      },
    ],
    sayIt: [
      'clz = leading zeros, ctz = trailing zeros. Always guard against x=0.',
    ],
  }),

  'bm-bit-width': e({
    xray: [
      { text: '**32 - clz(x)** = number of bits needed to represent x', kind: 'signal' },
    ],
    budget: ['bit width', 'msb position'],
    slottedTemplate: `int bitWidth(int x) {
    return x == 0 ? 0 : 32 - __builtin_clz(/* SLOT: x */);
}`,
    slots: [
      { id: 'X', label: 'Input value', hint: 'x' },
    ],
    slotFills: {
      0: { X: 'x' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Off-by-one in bit width',
        wrong: '31 - clz(x) // width = msb_index + 1',
        testCase: 'x=1 (binary 1) → clz=31 → 31-31=0 ❌',
        fix: '32 - clz(x) correct; x=1 → 32-31=1 ✅',
      },
    ],
    sayIt: [
      'Bit width = 32 - clz(x). Number of bits from MSB to LSB inclusive.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
