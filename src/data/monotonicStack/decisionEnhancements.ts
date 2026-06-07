import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Finding next greater/smaller element in a sequence',
    'Finding previous greater/smaller element in a sequence',
    'Monotonic property: stack entries in increasing/decreasing order',
    'Single-pass O(n) solution for element comparison queries',
  ],
  whenAtThisStep: 'Confirm monotonic stack fits: need next/previous greater/smaller element queries in a sequence, O(n) single-pass algorithm.',
  xray: [
    { text: '**next greater/smaller** — find first larger/smaller to the right', kind: 'signal' },
    { text: '**previous greater/smaller** — find first larger/smaller to the left', kind: 'signal' },
    { text: '**monotonic order** — stack maintains increasing or decreasing elements', kind: 'signal' },
    { text: '**store indices** — stack holds indices, not values, for distance calculation', kind: 'constraint' },
    { text: '**O(n)** — each element pushed and popped at most once', kind: 'constraint' },
  ],
  budget: ['monotonic stack', 'nge', 'pge', 'next greater', 'previous greater', 'single pass'],
  sayIt: [
    'Do we need to find the next/previous greater/smaller element for each position?',
    'Can we maintain a monotonic stack of indices as we scan once?',
    'Is the problem about element comparison in a sequence with O(n) time?',
  ],
  branchGuides: {
    'ms-fund-step2': {
      proceed: 'WHEN: core monotonic stack — increasing/decreasing stacks, next/previous element queries',
    },
  },
  notThisPattern: [
    { signal: 'Need to find nearest element by value, but sequence is not linear', actually: 'Consider segment tree or binary indexed tree' },
    { signal: 'Simple stack usage without monotonic property', actually: 'Use Stack & Queue pattern for basic LIFO' },
  ],
  misidentify: [
    {
      cause: 'Using monotonic stack when binary search suffices',
      wrong: 'Build and maintain stack for sorted array NGE',
      testCase: 'Sorted array — next greater is the next index',
      fix: 'Sorted arrays: just check next element O(1) instead of monotonic stack O(n)',
    },
    {
      cause: 'Confusing increasing vs decreasing stack for NGE vs PGE',
      wrong: 'Use increasing stack for Next Greater Element',
      testCase: 'nums = [2, 1, 3]; increasing stack pops 1 (1 < 2); NGE fails',
      fix: 'NGE needs decreasing stack: pop when current > stack top',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'ms-root': d({
    whenAtThisStep: 'You identified monotonic stack as the approach. Choose the operation domain.',
    xray: [
      { text: '**increasing stack**: maintain ascending order, find smaller elements', kind: 'signal' },
      { text: '**decreasing stack**: maintain descending order, find greater elements', kind: 'signal' },
      { text: '**next greater/smaller**: find element to the right', kind: 'signal' },
      { text: '**previous greater/smaller**: find element to the left', kind: 'signal' },
    ],
    budget: ['increasing', 'decreasing', 'next', 'previous'],
    sayIt: ['Increasing stack, decreasing stack, next element, or previous element queries?'],
    branchGuides: {
      'ms-fund-step2': { proceed: 'yes — core monotonic stack: variants and queries' },
    },
    notThisPattern: [
      { signal: 'Simple stack, no monotonic property', actually: 'Use Stack & Queue pattern' },
    ],
  }),

  'ms-fund-step2': d({
    whenAtThisStep: 'Core monotonic stack. Which category?',
    xray: [
      { text: '**increasing stack**: pop on <= (strict) or < (non-dec)', kind: 'signal' },
      { text: '**decreasing stack**: pop on >= (strict) or > (non-inc)', kind: 'signal' },
      { text: '**next greater/smaller**: NGE, NSE, circular array', kind: 'signal' },
      { text: '**previous greater/smaller**: PGE, PSE, subarray ranges', kind: 'signal' },
    ],
    budget: ['increasing', 'decreasing', 'next', 'previous'],
    sayIt: ['Increasing stack, decreasing stack, next element queries, or previous element queries?'],
    branchGuides: {
      'ms-inc-step3': { proceed: 'yes — increasing stack (strict/non-decreasing)' },
      'ms-dec-step3': { proceed: 'yes — decreasing stack (strict/non-increasing)' },
      'ms-nge-step3': { proceed: 'yes — next greater/smaller element to the right' },
      'ms-pge-step3': { proceed: 'yes — previous greater/smaller element to the left' },
    },
    notThisPattern: [
      { signal: 'No monotonic order needed', actually: 'Use basic stack' },
    ],
  }),

  'ms-inc-step3': d({
    whenAtThisStep: 'Increasing stack. Which strictness?',
    xray: [
      { text: '**strictly increasing**: pop on <=, no equal values in stack', kind: 'signal' },
      { text: '**non-decreasing**: pop on <, equal values kept', kind: 'signal' },
    ],
    budget: ['strict', 'non-decreasing'],
    sayIt: ['Strictly increasing (no equals) or non-decreasing (equals allowed)?'],
    branchGuides: {
      'ms-strict-inc': { proceed: 'strict: pop on <= — NGE/Daily Temperatures' },
      'ms-non-dec': { proceed: 'non-decreasing: pop on < — Final Prices' },
    },
    notThisPattern: [
      { signal: 'Need decreasing order', actually: 'Use decreasing stack' },
    ],
  }),

  'ms-dec-step3': d({
    whenAtThisStep: 'Decreasing stack. Which strictness?',
    xray: [
      { text: '**strictly decreasing**: pop on >=, no equal values', kind: 'signal' },
      { text: '**non-increasing**: pop on >, equal values kept', kind: 'signal' },
    ],
    budget: ['strict', 'non-increasing'],
    sayIt: ['Strictly decreasing (no equals) or non-increasing (equals allowed)?'],
    branchGuides: {
      'ms-strict-dec': { proceed: 'strict: pop on >= — NGE II circular' },
      'ms-non-inc': { proceed: 'non-increasing: pop on >' },
    },
    notThisPattern: [
      { signal: 'Need increasing order', actually: 'Use increasing stack' },
    ],
  }),

  'ms-nge-step3': d({
    whenAtThisStep: 'Next greater/smaller element. Which direction?',
    xray: [
      { text: '**NGE**: next greater to right — decreasing stack, pop on >', kind: 'signal' },
      { text: '**NSE**: next smaller to right — increasing stack, pop on <', kind: 'signal' },
      { text: '**circular**: 2n virtual iterations for wrap-around', kind: 'signal' },
    ],
    budget: ['nge', 'nse', 'circular'],
    sayIt: ['Next greater element, next smaller element, or circular array NGE?'],
    branchGuides: {
      'ms-nge': { proceed: 'NGE: next greater to the right' },
      'ms-nse': { proceed: 'NSE: next smaller to the right' },
      'ms-nge-circular': { proceed: 'circular: NGE with wrap-around' },
    },
    notThisPattern: [
      { signal: 'Need previous element, not next', actually: 'Use previous greater/smaller' },
    ],
  }),

  'ms-pge-step3': d({
    whenAtThisStep: 'Previous greater/smaller element. Which direction?',
    xray: [
      { text: '**PGE**: previous greater to left — decreasing stack, pop on >=', kind: 'signal' },
      { text: '**PSE**: previous smaller to left — increasing stack, pop on <=', kind: 'signal' },
      { text: '**subarray ranges**: min+max contribution via PSE/NSE + PGE/NGE', kind: 'signal' },
    ],
    budget: ['pge', 'pse', 'subarray ranges'],
    sayIt: ['Previous greater element, previous smaller element, or subarray range contribution?'],
    branchGuides: {
      'ms-pge': { proceed: 'PGE: previous greater to the left' },
      'ms-pse': { proceed: 'PSE: previous smaller to the left' },
      'ms-subarray-ranges': { proceed: 'ranges: subarray min/max contributions' },
    },
    notThisPattern: [
      { signal: 'Need next element, not previous', actually: 'Use next greater/smaller' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
