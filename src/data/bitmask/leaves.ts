import type { TaxonomyNode } from '../../types'
import { leaf } from './helpers'

const CPP = `#include <vector>
#include <string>
#include <algorithm>
#include <functional>
#include <numeric>
#include <bitset>
using namespace std;

`

// ── Bitmask Basics ─────────────────────────────────────────────

export const subsetIntLeaf: TaxonomyNode = leaf('bm-subset-int', 'Representing Subsets as Integers', 'blue', {
  template: `${CPP}int mask = 0; // empty set
// bit i = 1 means element i is in the set
// n elements → mask in [0, 2^n - 1]`,
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Use bitmask 0..2^n-1 to enumerate all subsets.' },
  ],
  pitfalls: ['❌ For n > 31 (or 63 for long long), integer overflow — use bitset or big integer.', '❌ Off-by-one: masks range from 0 (empty) to (1<<n)-1 (full).'],
  edgeCases: [
    { input: 'n=0', breaks: 'only empty subset (mask 0)' },
    { input: 'n > 31 for 32-bit int', breaks: 'overflow when shifting 1<<n' },
  ],
  interviewTip: 'Bitmask i represents subset of {0..n-1}. Bit i set = element i included. Range: 0 to (1<<n)-1.',
})

export const emptyFullSingleLeaf: TaxonomyNode = leaf('bm-empty-full', 'Empty / Full / Single Masks', 'blue', {
  template: `${CPP}int empty = 0;
int full = (1 << n) - 1;
int single = 1 << i; // {i}`,
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Build full mask for bitmask iteration.' },
  ],
  pitfalls: ['❌ (1<<n) - 1 requires n < bit-width; (1LL<<n) - 1 for n up to 63.', '❌ Empty mask = 0 (no bits set).'],
  edgeCases: [
    { input: 'i >= n', breaks: '1 << i shifts beyond valid bits' },
    { input: 'n = 31 (32-bit)', breaks: '1<<31 = INT_MIN, not a valid mask' },
  ],
  interviewTip: 'Full = (1<<n)-1, Single = 1<<i, Empty = 0. Memorize the full mask formula.',
})

export const maskPropsLeaf: TaxonomyNode = leaf('bm-mask-props', 'Mask Properties', 'blue', {
  template: `${CPP}bool isEmpty(int m) { return m == 0; }
bool isFull(int m, int n) { return m == (1 << n) - 1; }
bool isSubset(int a, int b) { return (a & b) == a; }
int size(int m) { return __builtin_popcount(m); }`,
  problems: [
    { id: 0, title: 'Concept', slug: 'mask-properties', companies: [], lineChanges: 'Concept: isSubset, isEmpty, size via popcount.' },
  ],
  pitfalls: ['❌ isSubset(a,b) checks if a ⊆ b: (a & b) == a, not (a & b) == b.', '❌ popcount is built-in in C++ (GCC/Clang); in other languages use lookup table.'],
  edgeCases: [
    { input: 'empty subset check', breaks: 'isSubset(0, any) == true' },
    { input: 'full set check', breaks: 'isSubset(full, full) == true' },
  ],
  interviewTip: 'Mask properties: isSubset(a,b) = ((a & b) == a). Common trick for inclusion-exclusion.',
})

// ── Bit Operations on Masks ────────────────────────────────────

export const setBitLeaf: TaxonomyNode = leaf('bm-set-bit', 'Set a Bit', 'green', {
  template: `${CPP}int setBit(int mask, int i) { return mask | (1 << i); }`,
  problems: [
    { id: 318, title: 'Maximum Product of Word Lengths', slug: 'maximum-product-of-word-lengths', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Build bitmask per word: mask |= 1 << (c - \'a\').' },
  ],
  pitfalls: ['❌ OR with 1<<i adds the bit (set to 1), regardless of current value.', '❌ Ensure i is in range: 0 <= i < bit_width.'],
  edgeCases: [
    { input: 'bit already set', breaks: 'setBit is idempotent — OR with 1 leaves it as 1' },
    { input: 'i = 31 on 32-bit int', breaks: '1<<31 is INT_MIN' },
  ],
  interviewTip: 'Set bit: mask | (1<<i). Works regardless of current bit state.',
})

export const unsetBitLeaf: TaxonomyNode = leaf('bm-unset-bit', 'Unset a Bit', 'green', {
  template: `${CPP}int unsetBit(int mask, int i) { return mask & ~(1 << i); }`,
  problems: [
    { id: 0, title: 'Concept', slug: 'unset-bit', companies: [], lineChanges: 'Concept: clear bit i to 0 via AND with inverted mask.' },
  ],
  pitfalls: ['❌ Using XOR (^) instead of AND with ~ to clear — XOR toggles, does not guarantee 0.', '❌ Forgetting parentheses: ~(1<<i) != ~1<<i.'],
  edgeCases: [
    { input: 'bit already 0', breaks: 'unsetBit is idempotent' },
    { input: 'clear all bits', breaks: 'mask & ~full == 0' },
  ],
  interviewTip: 'Unset bit: mask & ~(1<<i). Use AND with inverted bit mask.',
})

export const toggleBitLeaf: TaxonomyNode = leaf('bm-toggle-bit', 'Toggle a Bit', 'green', {
  template: `${CPP}int toggleBit(int mask, int i) { return mask ^ (1 << i); }`,
  problems: [
    { id: 0, title: 'Concept', slug: 'toggle-bit', companies: [], lineChanges: 'Concept: flip bit i via XOR with 1<<i.' },
  ],
  pitfalls: ['❌ XOR toggles: 0→1, 1→0. If you mean "set to 1", use OR.', '❌ Double toggle: toggleBit(toggleBit(mask, i), i) == mask.'],
  edgeCases: [
    { input: 'toggle all bits', breaks: 'mask ^ full == ~mask (bitwise NOT)' },
  ],
  interviewTip: 'Toggle bit: mask ^ (1<<i). XOR is its own inverse.',
})

export const checkBitLeaf: TaxonomyNode = leaf('bm-check-mem', 'Check Membership', 'green', {
  template: `${CPP}bool hasBit(int mask, int i) { return (mask >> i) & 1; }
// or: return mask & (1 << i);`,
  problems: [
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'Check each bit: (n>>i)&1, count 1s.' },
    { id: 318, title: 'Maximum Product of Word Lengths', slug: 'maximum-product-of-word-lengths', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Check word pair overlap: (mask[a] & mask[b]) == 0.' },
  ],
  pitfalls: ['❌ mask & (1<<i) returns non-zero (not necessarily 1); cast to bool.', '❌ Right-shift first: (mask>>i)&1 always yields 0 or 1.'],
  edgeCases: [
    { input: 'i out of range', breaks: '(mask>>i) becomes 0 for large i' },
    { input: 'check bit 0', breaks: '(mask & 1) checks LSB; (mask>>0)&1 same' },
  ],
  interviewTip: 'Bit check: (mask >> i) & 1. Use to check if bit i is set.',
})

// ── Mask Iteration ─────────────────────────────────────────────

export const enumSubsetsLeaf: TaxonomyNode = leaf('bm-enum-subsets', 'Enumerate All Subsets', 'teal', {
  template: `${CPP}for (int mask = 0; mask < (1 << n); mask++) {
    // process subset represented by mask
}`,
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'O(n * 2^n) enumeration of all subsets via bitmask.' },
  ],
  pitfalls: ['❌ Overflow: (1<<n) for n >= 31 on 32-bit int → UB.', '❌ O(2^n) is exponential — only feasible for n <= 20.'],
  edgeCases: [
    { input: 'n=0', breaks: 'only mask 0 in loop' },
    { input: 'n=20', breaks: '~1 million iterations, O(2^n) starts to be slow' },
  ],
  interviewTip: 'All subsets: for mask = 0..(1<<n)-1. O(2^n). Extract elements where bit i is set.',
})

export const enumSubmasksLeaf: TaxonomyNode = leaf('bm-enum-submasks', 'Enumerate Submasks', 'teal', {
  template: `${CPP}for (int sub = mask; sub; sub = (sub - 1) & mask) {
    // process submask
}
// also handle sub = 0 case separately`,
  problems: [
    { id: 2392, title: 'Build a Matrix With Conditions', slug: 'build-a-matrix-with-conditions', companies: ['GOOGLE'], lineChanges: 'Submask enumeration for topological order subsets.' },
  ],
  pitfalls: ['❌ Loop skips sub=0 — handle empty submask separately if needed.', '❌ Trick: sub = (sub - 1) & mask enumerates all submasks in decreasing order.'],
  edgeCases: [
    { input: 'mask=0', breaks: 'loop body never executes; only submask is 0' },
    { input: 'mask=1<<k (single bit)', breaks: 'only sub = mask, then 0' },
  ],
  interviewTip: 'Submask enumeration: for(int sub=mask; sub; sub=(sub-1)&mask). O(3^n) total for all masks.',
})

export const enumSupersetsLeaf: TaxonomyNode = leaf('bm-enum-super', 'Enumerate Supersets', 'teal', {
  template: `${CPP}int full = (1 << n) - 1;
for (int sup = mask; sup <= full; sup = (sup + 1) | mask) {
    // process superset
}`,
  problems: [
    { id: 0, title: 'Concept', slug: 'enumerate-supersets', companies: [], lineChanges: 'Concept: iterate over all sets containing mask as a subset.' },
  ],
  pitfalls: ['❌ Formula: sup = (sup + 1) | mask flips lowest 0 below mask to 1.', '❌ Ensure full mask does not overflow.'],
  edgeCases: [
    { input: 'mask = full', breaks: 'only one superset (full itself)' },
    { input: 'mask = 0', breaks: 'enumerate all 2^n subsets' },
  ],
  interviewTip: 'Superset enumeration: (sup + 1) | mask. Symmetric to submask enumeration.',
})

export const gosperLeaf: TaxonomyNode = leaf('bm-gosper', "Gosper's Hack", 'teal', {
  template: `${CPP}int sub = (1 << k) - 1; // smallest k-bit mask
while (sub < (1 << n)) {
    // process k-sized subset
    int c = sub & -sub;
    int r = sub + c;
    sub = (((r ^ sub) >> 2) / c) | r;
}`,
  problems: [
    { id: 0, title: 'Concept', slug: 'gosper-hack', companies: ['GOOGLE'], lineChanges: 'Concept: iterate all k-sized subsets in lexicographic order.' },
  ],
  pitfalls: ['❌ Complex to remember — use recursion or next_permutation for interview clarity.', '❌ Only works for n <= bit_width.'],
  edgeCases: [
    { input: 'k=0', breaks: 'sub starts as 0; loop condition sub < full fails' },
    { input: 'k=n', breaks: 'only one subset: full mask' },
  ],
  interviewTip: "Gosper's Hack: O(C(n,k)) for k-sized subsets. Alternative: recursion or next_permutation on bit array.",
})

// ── Built-in Bit Functions ─────────────────────────────────────

export const popcountLeaf: TaxonomyNode = leaf('bm-popcount', 'Popcount (Bit Count)', 'purple', {
  template: `${CPP}int cnt = __builtin_popcount(mask); // GCC/Clang
// or manual:
int popcount(int x) {
    int c = 0;
    while (x) { x &= x - 1; c++; }
    return c;
}`,
  problems: [
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'Built-in or Brian Kernighan: x &= x-1 until 0.' },
  ],
  pitfalls: ['❌ __builtin_popcount for unsigned: use __builtin_popcountl/ll for long.', '❌ Brian Kernighan: x &= x-1 clears lowest set bit — loop runs once per 1-bit.'],
  edgeCases: [
    { input: 'x=0', breaks: 'popcount = 0' },
    { input: 'x=-1 (all 1s)', breaks: 'popcount = 32 on 32-bit int' },
  ],
  interviewTip: 'Brian Kernighan: while(x) { x &= x-1; count++; }. Runs once per set bit.',
})

export const lowbitLeaf: TaxonomyNode = leaf('bm-lowbit', 'Lowbit (LSB)', 'purple', {
  template: `${CPP}int lowbit = x & -x; // lowest set bit value
// isolate lowest set 1 bit, or 0 if x == 0`,
  problems: [
    { id: 231, title: 'Power of Two', slug: 'power-of-two', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Power of two check: x > 0 && (x & -x) == x.' },
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lowbit used in Fenwick tree and Brian Kernighan algorithm.' },
  ],
  pitfalls: ['❌ x & -x for x=0 returns 0 — guard against infinite loops.', '❌ Two\'s complement: -x = ~x + 1. x & -x isolates the lowest 1-bit.'],
  edgeCases: [
    { input: 'x=0', breaks: 'lowbit = 0' },
    { input: 'x=INT_MIN', breaks: '-x overflows; x & -x == INT_MIN' },
  ],
  interviewTip: 'Lowbit = x & -x. Lowest set bit value. Used in Fenwick trees and Brian Kernighan.',
})

export const leadingTrailingLeaf: TaxonomyNode = leaf('bm-leading-trailing', 'Leading / Trailing Zeros', 'purple', {
  template: `${CPP}int lz = __builtin_clz(x); // leading zeros
int tz = __builtin_ctz(x); // trailing zeros
// undefined for x == 0`,
  problems: [
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Bit width = 32 - clz(x). Trailing zeros = ctz(x).' },
  ],
  pitfalls: ['❌ __builtin_clz(0) is undefined — guard against x==0.', '❌ ctz(x) = number of trailing zeros; clz(x) = leading zeros.'],
  edgeCases: [
    { input: 'x=0', breaks: 'clz/ctz undefined; handle separately' },
    { input: 'x=1', breaks: 'clz(1)=31, ctz(1)=0' },
  ],
  interviewTip: 'clz = leading zeros, ctz = trailing zeros. Bit width = 32 - clz(x).',
})

export const bitWidthLeaf: TaxonomyNode = leaf('bm-bit-width', 'Bit Width', 'purple', {
  template: `${CPP}int width = 32 - __builtin_clz(x); // bit width of x (msb position + 1)
// x=0 → undefined; guard with if(x==0) return 0;`,
  problems: [
    { id: 0, title: 'Concept', slug: 'bit-width', companies: [], lineChanges: 'Concept: number of bits needed to represent x.' },
  ],
  pitfalls: ['❌ clz(0) is UB — check x>0 before calling.', '❌ Width = floor(log2(x)) + 1 = 32 - clz(x).'],
  edgeCases: [
    { input: 'x=0', breaks: 'width = 0 (by convention)' },
    { input: 'x=1<<31 (32-bit)', breaks: 'clz = 0, width = 32' },
  ],
  interviewTip: 'Bit width = 32 - clz(x). Tells you how many bits are used to represent x.',
})
