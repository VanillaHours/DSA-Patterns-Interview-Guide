import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Representing subsets as integers (bitmasks)',
    'Efficient state enumeration for small sets',
    'Bit-level operations: set, unset, toggle, check',
    'DP with state compression (bitmask DP)',
  ],
  whenAtThisStep: 'Confirm bitmask fits: representing subsets as bits, O(1) bit operations, enumerating up to 2^n states.',
  xray: [
    { text: '**subset as integer** — bit i = element i is included', kind: 'signal' },
    { text: '**bit ops** — set (OR), unset (AND~), toggle (XOR), check (>>)', kind: 'signal' },
    { text: '**iteration** — all subsets 0..2^n-1, submasks via (sub-1)&mask', kind: 'signal' },
    { text: '**popcount/lowbit** — __builtin_popcount, x & -x', kind: 'constraint' },
    { text: '**n ≤ 20** for full enumeration, n ≤ 12 for O(3^n)', kind: 'constraint' },
  ],
  budget: ['bitmask', 'subset', 'bit op', 'popcount', 'lowbit', 'enumeration'],
  sayIt: [
    'Do we need to represent subsets or states as bitmasks?',
    'Is the problem about enumerating subsets or checking membership efficiently?',
    'Could state be compressed into an integer bitmask for DP?',
  ],
  branchGuides: {
    'bm-fund-step2': {
      proceed: 'WHEN: core bitmask operations — representation, bit ops, iteration, built-in functions',
    },
  },
  notThisPattern: [
    { signal: 'Arithmetic/logical operations on full integers (not subsets)', actually: 'Use Bit Manipulation pattern for XOR sums, bitwise math' },
    { signal: 'Large n > 30 with full enumeration', actually: 'Bitmask is O(2^n); consider greedy or DP with pruning' },
  ],
  misidentify: [
    {
      cause: 'Bitmask vs general bit manipulation confusion',
      wrong: 'Use bitmask for single-number XOR problems',
      testCase: 'Single number appears once, others twice — XOR all',
      fix: 'Bitmask is for subset representation; Bit Manipulation is for bitwise tricks on numbers',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'bm-root': d({
    whenAtThisStep: 'You identified bitmask as the approach. Choose the operation domain.',
    xray: [
      { text: '**representation**: subsets as integers, mask properties', kind: 'signal' },
      { text: '**bit ops**: set, unset, toggle, check membership', kind: 'signal' },
      { text: '**iteration**: enumerate subsets, submasks, supersets', kind: 'signal' },
      { text: '**built-in**: popcount, lowbit, clz/ctz, bit width', kind: 'signal' },
    ],
    budget: ['representation', 'bit ops', 'iteration', 'functions'],
    sayIt: ['Subset representation, bit operations, mask iteration, or built-in bit functions?'],
    branchGuides: {
      'bm-fund-step2': { proceed: 'yes — core bitmask: representation, ops, iteration, functions' },
    },
    notThisPattern: [
      { signal: 'Not subset-related, just bitwise arithmetic', actually: 'Use Bit Manipulation pattern' },
    ],
  }),

  'bm-fund-step2': d({
    whenAtThisStep: 'Core bitmask operations. Which category?',
    xray: [
      { text: '**bitmask basics**: subset as integer, empty/full mask, properties', kind: 'signal' },
      { text: '**bit ops**: set, unset, toggle, check — modify individual bits', kind: 'signal' },
      { text: '**mask iteration**: enumerate all subsets, submasks, supersets', kind: 'signal' },
      { text: '**built-in functions**: popcount, lowbit, leading/trailing zeros', kind: 'signal' },
    ],
    budget: ['basics', 'ops', 'iteration', 'functions'],
    sayIt: ['Learning bitmask representation, modifying bits, iterating over masks, or using built-in bit functions?'],
    branchGuides: {
      'bm-basics-step3': { proceed: 'yes — subset representation and mask properties' },
      'bm-ops-step3': { proceed: 'yes — set, unset, toggle, check individual bits' },
      'bm-iter-step3': { proceed: 'yes — enumerate subsets, submasks, supersets' },
      'bm-funcs-step3': { proceed: 'yes — built-in bit utilities like popcount and lowbit' },
    },
    notThisPattern: [
      { signal: 'Not bitmask-specific', actually: 'Consider general bit manipulation' },
    ],
  }),

  'bm-basics-step3': d({
    whenAtThisStep: 'Bitmask representation. Which concept?',
    xray: [
      { text: '**subset as int**: bit i = element i, range 0..2^n-1', kind: 'signal' },
      { text: '**common masks**: empty=0, full=(1<<n)-1, single=1<<i', kind: 'signal' },
      { text: '**mask properties**: isSubset, isEmpty, size via popcount', kind: 'signal' },
    ],
    budget: ['representation', 'common masks', 'properties'],
    sayIt: ['Subsets as integers, common mask values, or testing mask properties?'],
    branchGuides: {
      'bm-subset-int': { proceed: 'subset = integer, bit i = element i' },
      'bm-empty-full': { proceed: 'empty=0, full=(1<<n)-1, single=1<<i' },
      'bm-mask-props': { proceed: 'isSubset, isEmpty, size via popcount' },
    },
    notThisPattern: [
      { signal: 'Already have a mask, need to modify bits', actually: 'Use bit operations' },
    ],
  }),

  'bm-ops-step3': d({
    whenAtThisStep: 'Bit operations. Which modification?',
    xray: [
      { text: '**set**: mask | (1<<i) — turn bit on', kind: 'signal' },
      { text: '**unset**: mask & ~(1<<i) — turn bit off', kind: 'signal' },
      { text: '**toggle**: mask ^ (1<<i) — flip bit', kind: 'signal' },
      { text: '**check**: (mask>>i)&1 — test membership', kind: 'signal' },
    ],
    budget: ['set', 'unset', 'toggle', 'check'],
    sayIt: ['Setting a bit to 1, clearing to 0, flipping, or checking if a bit is set?'],
    branchGuides: {
      'bm-set-bit': { proceed: 'set: mask | (1<<i)' },
      'bm-unset-bit': { proceed: 'unset: mask & ~(1<<i)' },
      'bm-toggle-bit': { proceed: 'toggle: mask ^ (1<<i)' },
      'bm-check-mem': { proceed: 'check: (mask>>i)&1' },
    },
    notThisPattern: [
      { signal: 'Need to iterate over masks', actually: 'Use mask iteration' },
    ],
  }),

  'bm-iter-step3': d({
    whenAtThisStep: 'Mask iteration. Which enumeration pattern?',
    xray: [
      { text: '**all subsets**: for mask=0..(1<<n)-1', kind: 'signal' },
      { text: '**submasks**: for sub=mask; sub; sub=(sub-1)&mask', kind: 'signal' },
      { text: '**supersets**: for sup=mask; sup<=full; sup=(sup+1)|mask', kind: 'signal' },
      { text: '**k-sized**: Gosper\'s Hack or next_permutation', kind: 'signal' },
    ],
    budget: ['all subsets', 'submasks', 'supersets', 'k-sized'],
    sayIt: ['Enumerate all subsets, submasks of a given mask, supersets, or k-sized combinations?'],
    branchGuides: {
      'bm-enum-subsets': { proceed: 'all subsets: 0..(1<<n)-1' },
      'bm-enum-submasks': { proceed: 'submasks: (sub-1)&mask loop' },
      'bm-enum-super': { proceed: 'supersets: (sup+1)|mask loop' },
      'bm-gosper': { proceed: 'k-sized subsets: Gosper\'s Hack' },
    },
    notThisPattern: [
      { signal: 'Single mask operation, no iteration', actually: 'Use bit ops or basics' },
    ],
  }),

  'bm-funcs-step3': d({
    whenAtThisStep: 'Built-in bit functions. Which utility?',
    xray: [
      { text: '**popcount**: __builtin_popcount, Brian Kernighan', kind: 'signal' },
      { text: '**lowbit**: x & -x, isolate lowest set bit', kind: 'signal' },
      { text: '**clz/ctz**: __builtin_clz, __builtin_ctz', kind: 'signal' },
      { text: '**bit width**: 32 - clz(x), floor(log2(x)) + 1', kind: 'signal' },
    ],
    budget: ['popcount', 'lowbit', 'clz/ctz', 'width'],
    sayIt: ['Counting bits, isolating the lowest bit, counting leading/trailing zeros, or computing bit width?'],
    branchGuides: {
      'bm-popcount': { proceed: 'popcount: count 1 bits' },
      'bm-lowbit': { proceed: 'lowbit: isolate lowest set bit' },
      'bm-leading-trailing': { proceed: 'clz/ctz: leading/trailing zeros' },
      'bm-bit-width': { proceed: 'width: bits needed to represent x' },
    },
    notThisPattern: [
      { signal: 'Need to modify mask bits', actually: 'Use bit operations' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
