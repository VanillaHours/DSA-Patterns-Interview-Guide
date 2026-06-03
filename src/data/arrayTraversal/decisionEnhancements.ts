import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Array Traversal? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Single or multiple indices walking an array',
    'O(n) scan, O(log n) binary search, or O(mn) matrix traversal expected',
    'Prompt hints at scanning, window, halving, or 2D traversal',
    'Often: sorted input, contiguous constraint, matrix, or jump/reach',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem need array traversal at all?',
  xray: [
    { text: 'Given an integer array nums, find the **maximum subarray** …', kind: 'signal' },
    { text: 'You must write an algorithm that runs in **O(n)** time', kind: 'constraint' },
    { text: 'You may assume the input array is **sorted**', kind: 'constraint' },
    { text: 'Given an **m x n** matrix, return the **transpose**', kind: 'signal' },
    { text: 'You are given an array of integers, return the **minimum number of jumps**', kind: 'goal' },
  ],
  budget: ['onePass', 'twoPointer', 'slidingWindow', 'binarySearch', 'multiDim', 'sorted', 'contiguous'],
  sayIt: [
    'Before any template: what is the TRAVERSAL strategy? Single pass, halving, or multi-dimensional?',
    'If linear scan with running state → one-pass.',
    'If two indices coordinate → two-pointer or sliding window.',
    'If sorted + halving → binary search.',
    'If 2D matrix → nested loops or coordinated passes.',
  ],
  branchGuides: {
    'linear-scanning': {
      proceed: 'WHEN: one-direction scan, two-pointer, or window over contiguous elements',
      whenExtra: ['subarray', 'in-place compact', 'remove duplicates', 'window constraint'],
    },
    'binary-search-traversal': {
      proceed: 'WHEN: sorted array and halving search, or monotonic predicate on answer space',
      whenExtra: ['sorted', 'rotated', 'minimum capacity / max time', 'search insert'],
    },
    'multi-dim-traversal': {
      proceed: 'WHEN: 2D matrix, coordinate marking, or jump/reach across array indices',
      whenExtra: ['matrix', 'transpose', 'set zeroes', 'jump game'],
    },
  },
  notThisPattern: [
    { signal: '"linked list cycle" / "middle of list"', actually: 'Linked List pattern — pointer chasing on list nodes, not array traversal' },
    { signal: '"subarray sum equals k" (any order, count subarrays)', actually: 'Prefix Sum + hash map — not traversal, need cumulative frequency' },
    { signal: '"shortest path in grid" with obstacles', actually: 'BFS / DFS graph traversal — not simple coordinated matrix scan' },
    { signal: '"anagrams" / character frequency', actually: 'Hash map / fixed window — see Two Pointers or Hash Map patterns' },
  ],
  misidentify: [
    {
      cause: 'Array traversal vs two pointers — overlapping but different framing',
      wrong: 'Jump to Two Pointers pattern for all two-index problems',
      testCase: 'LC 26 Remove Duplicates (in-place compact)',
      fix: 'Array Traversal frames it as "same-direction read/write scan". Both patterns work; pick the framing that helps you explain.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'at-root': PATTERN_GATE,

  'linear-scanning': d({
    whenAtThisStep: 'You confirmed single-direction traversal. Now pick the sub-style.',
    xray: [
      { text: 'running **max subarray** / **max profit**', kind: 'goal' },
      { text: 'two **indices** coordinated', kind: 'signal' },
      { text: '**contiguous** subarray / **window** constraint', kind: 'constraint' },
    ],
    budget: ['onePass', 'twoPointer', 'slidingWindow', 'contiguous'],
    sayIt: [
      'One-pass: running state, no second index.',
      'Two-pointer: two indices, same direction (read/write) or opposite ends.',
      'Sliding window: expand right, shrink left on constraint.',
    ],
    branchGuides: {
      'one-pass': { proceed: 'WHEN: single scan, track running min/max/prefix' },
      'two-pointer-array': { proceed: 'WHEN: two indices coordinate — same or opposite direction' },
      'sliding-window-array': { proceed: 'WHEN: contiguous window with constraint' },
    },
  }),

  'two-pointer-array': d({
    whenAtThisStep: 'Two indices traverse the array — same direction or opposite ends.',
    xray: [
      { text: '**in-place** remove / filter / compact', kind: 'constraint' },
      { text: '**two sum** on sorted | **3Sum**', kind: 'goal' },
      { text: 'move **zeroes** / sort by **parity**', kind: 'goal' },
    ],
    budget: ['twoPointer', 'inPlace', 'sorted'],
    sayIt: [
      'Same direction: r scans, w writes (read/write pointers).',
      'Opposite direction: l=0, r=n-1, move based on sum / comparison.',
    ],
    branchGuides: {
      'same-dir': { proceed: 'WHEN: in-place filter — remove dupes, move zeroes, return new length' },
      'opposite-dir': { proceed: 'WHEN: sorted + pair from both ends — sum target, container area' },
    },
  }),

  'sliding-window-array': d({
    whenAtThisStep: 'Window over contiguous elements — fixed or variable size.',
    xray: [
      { text: 'subarray of exactly **k** length', kind: 'constraint' },
      { text: '**longest** / **shortest** with constraint', kind: 'goal' },
    ],
    budget: ['slidingWindow', 'contiguous'],
    sayIt: [
      'Fixed k: no shrink loop — add right, subtract left, update.',
      'Variable: expand until invalid, shrink while invalid, track max/min.',
    ],
    branchGuides: {
      'fixed-window': { proceed: 'WHEN: exactly k length — slide with add/subtract' },
      'variable-window': { proceed: 'WHEN: variable length — longest (expand/shrink) or shortest (shrink while valid)' },
    },
  }),

  'binary-search-traversal': d({
    whenAtThisStep: 'Halving search — index BS or answer space BS.',
    xray: [
      { text: 'Array is **sorted** in ascending order', kind: 'constraint' },
      { text: 'Return the **index** of target / **insert position**', kind: 'goal' },
      { text: 'Search in **rotated** sorted array', kind: 'signal' },
      { text: 'Find the **minimum capacity** / **maximum time** such that …', kind: 'goal' },
    ],
    budget: ['binarySearch', 'sorted', 'rotated', 'answerSpace'],
    sayIt: [
      'Sorted + find index → standard BS.',
      'Rotated → compare mid with left to find sorted half.',
      'Monotonic predicate → answer space BS.',
    ],
    branchGuides: {
      'standard-bs': { proceed: 'WHEN: classic BS on sorted array — index of target or insertion point' },
      'rotated-bs': { proceed: 'WHEN: rotated/pivot array — search or find min' },
      'answer-space-bs': { proceed: 'WHEN: find min X such that f(X) is feasible — predicate BS' },
    },
  }),

  'multi-dim-traversal': d({
    whenAtThisStep: '2D matrix or coordinate jumping — nested loops, coordinated passes, or BFS/greedy.',
    xray: [
      { text: 'Given an **m x n** matrix', kind: 'signal' },
      { text: '**Transpose** / **rotate** the matrix', kind: 'goal' },
      { text: '**Set zeroes** in-place with O(1) space', kind: 'goal' },
      { text: '**Jump** to last index / **minimum jumps**', kind: 'goal' },
    ],
    budget: ['multiDim', 'jump'],
    sayIt: [
      'Matrix → nested loops or coordinated marker passes.',
      'Jump → greedy reach (I/II) or BFS on index graph (IV).',
    ],
    branchGuides: {
      'nested-loop': { proceed: 'WHEN: standard i/j loops — transpose, rotate, spiral' },
      coordinated: { proceed: 'WHEN: two-pass marking — set zeroes, game of life' },
      'jump-pattern': { proceed: 'WHEN: reach/jump across indices — greedy or BFS' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
