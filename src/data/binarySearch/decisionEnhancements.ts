import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Sorted input array or monotonic predicate function',
    'O(log n) time complexity required or hinted',
    'Searching for a target value, boundary, or insertion position',
    'Rotated sorted array — find min or search target',
    'Mountain / bitonic array — find peak',
    'Feasibility check that increases with the answer (monotonic)',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. Ask: is the problem searching in sorted data (index BS), searching a modified space (rotated/mountain), or checking feasibility on an answer range?',
  xray: [
    { text: 'Given a **sorted** array and target, return the **index**', kind: 'goal' },
    { text: 'Find the **first and last** position of target in sorted array', kind: 'goal' },
    { text: 'Find **minimum** in a **rotated** sorted array', kind: 'goal' },
    { text: 'Find the **peak** in a mountain array', kind: 'goal' },
    { text: 'Minimize **maximum capacity** to ship packages within D days', kind: 'goal' },
    { text: '**Search** in a row-and-column sorted **matrix**', kind: 'goal' },
  ],
  budget: ['exactMatch', 'firstLast', 'insertPos', 'rotatedArray', 'mountainArray', 'unknownSize', 'minMax', 'maxMin', 'kthSearch', 'feasibility', 'matrixSearch', 'parallelBS', 'peakElement'],
  sayIt: [
    'Before any template: is the array sorted or is there a monotonic predicate?',
    'If yes — index BS (classic), modified space (rotated/mountain), answer space (min/max), or specialized (matrix/parallel)?',
  ],
  branchGuides: {
    'classic-step2': {
      proceed: 'WHEN: sorted array, target/boundary/position search',
      whenExtra: ['binary search on index', 'sorted array exact match', 'first/last occurrence', 'insert position'],
    },
    'modified-step2': {
      proceed: 'WHEN: rotated array, mountain/bitonic, or unknown size',
      whenExtra: ['rotated sorted', 'find min in rotated', 'peak element', 'mountain array', 'unknown size'],
    },
    'answer-step2': {
      proceed: 'WHEN: feasibility predicate on answer range',
      whenExtra: ['minimize max capacity', 'maximize min distance', 'kth smallest via count'],
    },
    'specialized-step2': {
      proceed: 'WHEN: 2D matrix or parallel multi-constraint BS',
      whenExtra: ['search 2D matrix', 'row and column sorted', 'minimum days', 'bouquets'],
    },
  },
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'bs-step1': PATTERN_GATE,

  'classic-step2': d({
    whenAtThisStep: 'Classic index binary search on sorted array.',
    xray: [
      { text: 'Given a **sorted** array and target, return the **index**', kind: 'goal' },
      { text: 'Find **first and last** position of target', kind: 'goal' },
      { text: 'Find **insert position** or closest element', kind: 'goal' },
      { text: '**Guess number** higher or lower', kind: 'goal' },
    ],
    budget: ['exactMatch', 'firstLast', 'insertPos', 'logN'],
    sayIt: ['Exact match: lo<=hi, mid compare. Boundary: lower_bound & upper_bound. Insert: lo<hi, hi=mid.'],
    branchGuides: {
      'exact-match': { proceed: 'WHEN: find a specific target value' },
      boundary: { proceed: 'WHEN: first and last occurrence' },
      position: { proceed: 'WHEN: insert position or guess number' },
    },
  }),

  'modified-step2': d({
    whenAtThisStep: 'Binary search on rotated, mountain, or unknown-size arrays.',
    xray: [
      { text: 'Find **minimum** in a **rotated sorted** array', kind: 'goal' },
      { text: '**Search target** in a rotated sorted array', kind: 'goal' },
      { text: 'Find **peak index** in a mountain array', kind: 'goal' },
      { text: '**Search** in a sorted array of **unknown size**', kind: 'goal' },
    ],
    budget: ['rotatedArray', 'mountainArray', 'unknownSize', 'peakElement'],
    sayIt: ['Rotated min: compare mid vs hi. Rotated search: find sorted half. Peak: compare mid vs mid+1. Unknown: exponential bounds.'],
    branchGuides: {
      'rotated-min': { proceed: 'WHEN: find minimum in rotated sorted' },
      'rotated-search': { proceed: 'WHEN: search target in rotated sorted' },
      mountain: { proceed: 'WHEN: peak element or mountain array' },
      'unknown-size': { proceed: 'WHEN: unknown or infinite array size' },
    },
  }),

  'answer-step2': d({
    whenAtThisStep: 'Binary search on the answer space with a feasibility predicate.',
    xray: [
      { text: '**Minimum capacity** to ship packages within D days', kind: 'goal' },
      { text: '**Koko eating bananas** — minimum speed to finish in H hours', kind: 'goal' },
      { text: '**Maximum minimum distance** between magnets', kind: 'goal' },
      { text: '**Kth smallest** element in a sorted matrix', kind: 'goal' },
      { text: '**Median** of two sorted arrays', kind: 'goal' },
    ],
    budget: ['minMax', 'maxMin', 'kthSearch', 'feasibility', 'monotonic'],
    sayIt: ['Minimize max: lo=feasible, hi=infeasible; can(mid)? hi=mid else lo=mid+1.', 'Maximize min: right-biased mid; lo=mid when feasible.', 'Kth: count ≤ mid; if cnt < k → lo=mid+1 else hi=mid.'],
    branchGuides: {
      'minimize-max': { proceed: 'WHEN: smallest max value satisfying predicate' },
      'maximize-min': { proceed: 'WHEN: largest min value satisfying predicate' },
      'math-counting': { proceed: 'WHEN: kth smallest or median via counting' },
    },
  }),

  'specialized-step2': d({
    whenAtThisStep: 'Matrix search or parallel multi-constraint binary search.',
    xray: [
      { text: '**Search** for target in a **row-and-column sorted matrix**', kind: 'goal' },
      { text: '**Minimum days** to make m bouquets from blooming flowers', kind: 'goal' },
    ],
    budget: ['matrixSearch', 'parallelBS'],
    sayIt: ['Matrix: 74 → 1D BS, 240 → top-right elimination. Parallel: compound predicate + standard minimize-max BS.'],
    branchGuides: {
      'matrix-search': { proceed: 'WHEN: 2D sorted matrix search' },
      'parallel-bs': { proceed: 'WHEN: multi-constraint predicate (days, bouquets)' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
