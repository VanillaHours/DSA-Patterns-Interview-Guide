import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even a Linked List problem? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Data is stored in nodes connected by pointers (next, prev, random)',
    'Operations are O(n) traversal with O(1) insert/delete once at position',
    'No random access — must traverse to reach an index',
    'Pointer rewiring (next reassignment) is the core operation',
    'Fast/slow or offset pointer techniques could apply',
    'Problem mentions "linked list", "list node", or "pointer"',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does the problem involve nodes connected by pointers with no random access?',
  xray: [
    { text: 'Given the **head** of a singly linked list …', kind: 'signal' },
    { text: 'You are given a **ListNode** defined as **val** + **next**', kind: 'signal' },
    { text: 'Do it in **O(n)** time and **O(1)** extra space', kind: 'constraint' },
    { text: 'Modify the list **in-place**', kind: 'constraint' },
    { text: 'Return the **head** of the modified list', kind: 'output' },
  ],
  budget: ['traversal', 'inPlace', 'dummy'],
  sayIt: [
    'Before any template: is this a linked list problem — nodes with next pointers, no random access?',
    'If yes — are we traversing, reversing, two-pointer, merging, sorting, cloning, or using a structural variant?',
    'If random access by index or array-based — probably not linked list.',
  ],
  branchGuides: {
    'core-manip-step2': {
      proceed: 'WHEN: basic traversal, insertion, deletion, or reordering',
      whenExtra: ['remove elements', 'design linked list', 'swap pairs'],
    },
    'reversal-step2': {
      proceed: 'WHEN: reverse whole list, sublist, or swap kth positions',
      whenExtra: ['reverse list', 'k-group', 'swap nodes'],
    },
    'two-pointer-step2': {
      proceed: 'WHEN: cycle detection, offset pointer, or palindrome check',
      whenExtra: ['cycle', 'middle', 'nth from end', 'palindrome'],
    },
    'merge-part-step2': {
      proceed: 'WHEN: merge sorted lists or partition/split by value',
      whenExtra: ['merge two sorted', 'merge k', 'partition'],
    },
    'sorting-step2': {
      proceed: 'WHEN: sort an unsorted linked list or rearrange by position',
      whenExtra: ['sort list', 'insertion sort', 'odd even'],
    },
    'clone-step2': {
      proceed: 'WHEN: deep copy a list with random/arbitrary pointers',
      whenExtra: ['copy list with random'],
    },
    'struct-variants-step2': {
      proceed: 'WHEN: doubly-linked, multi-level, or circular list variant',
      whenExtra: ['flatten multilevel', 'circular insert', 'browser history'],
    },
    'list-backed-step2': {
      proceed: 'WHEN: design LRU/LFU cache or list-backed stack/queue',
      whenExtra: ['LRU cache', 'min stack', 'circular queue'],
    },
  },
  notThisPattern: [
    { signal: '"array" + "index-based access"', actually: 'Array / sliding window / two pointers on array. Not linked list.' },
    { signal: '"random access by index" in O(1)', actually: 'Array or vector — linked list needs O(k) traversal.' },
  ],
  misidentify: [
    {
      cause: 'Cycle detection on graph instead of linked list',
      wrong: 'Use DFS visited set for linked list cycle',
      testCase: 'LC 141',
      fix: 'Fast/slow ptrs — O(1) space, no set needed.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'll-root': PATTERN_GATE,

  'core-manip-step2': d({
    whenAtThisStep: 'Traversal with prev/cur, insertion/deletion, or reordering.',
    xray: [
      { text: '**Remove** all nodes with a given value', kind: 'goal' },
      { text: '**Design** a linked list with get/add/delete', kind: 'goal' },
      { text: '**Swap** nodes in pairs / **rotate** list', kind: 'goal' },
    ],
    budget: ['traversal', 'deletion', 'insertion'],
    sayIt: ['Core: dummy node + prev/cur. Insert: wire new→next first. Delete: prev→next = cur→next.'],
    branchGuides: {
      'traversal-step3': { proceed: 'WHEN: simple iteration with cleanup or reordering' },
    },
  }),

  'reversal-step2': d({
    whenAtThisStep: 'Reverse whole list, sublist range, or swap positions.',
    xray: [
      { text: '**Reverse** the entire linked list', kind: 'goal' },
      { text: '**Reverse** nodes from position **left** to **right**', kind: 'goal' },
      { text: '**Reverse** nodes in **k-group**', kind: 'goal' },
    ],
    budget: ['reversal', 'inPlace'],
    sayIt: ['Full reverse: prev/cur/next triple. Sublist: prev stays fixed, cur moves + t inserted after prev.'],
    branchGuides: {
      'whole-reverse': { proceed: 'WHEN: reverse entire list' },
      'sublist-reverse': { proceed: 'WHEN: reverse range or k-group' },
      'position-swap': { proceed: 'WHEN: swap kth from start with kth from end' },
    },
  }),

  'two-pointer-step2': d({
    whenAtThisStep: 'Fast/slow, offset, or palindrome symmetry check.',
    xray: [
      { text: 'Detect a **cycle** in the linked list', kind: 'goal' },
      { text: 'Find the **middle** of the linked list', kind: 'goal' },
      { text: 'Remove the **nth node from end**', kind: 'goal' },
      { text: 'Check if linked list is **palindrome**', kind: 'goal' },
    ],
    budget: ['fastSlow', 'relativePos', 'palindrome'],
    sayIt: ['Fast/slow: f 2x, s 1x. Offset: advance f n, then both 1x. Palindrome: mid + reverse + compare.'],
    branchGuides: {
      'fast-slow': { proceed: 'WHEN: cycle detection or middle element' },
      'relative-pos': { proceed: 'WHEN: nth from end, delete middle' },
      palindrome: { proceed: 'WHEN: palindrome or symmetry check' },
    },
  }),

  'merge-part-step2': d({
    whenAtThisStep: 'Merge sorted lists or partition/split by value.',
    xray: [
      { text: '**Merge** two sorted linked lists', kind: 'goal' },
      { text: '**Merge k** sorted linked lists', kind: 'goal' },
      { text: '**Partition** list around value x', kind: 'goal' },
    ],
    budget: ['merge', 'partition'],
    sayIt: ['Merge: dummy + compare heads. K lists: min-heap. Partition: two dummy chains (less/ge).'],
    branchGuides: {
      'merge-ops': { proceed: 'WHEN: merge two or k sorted lists' },
      'partition-split': { proceed: 'WHEN: partition by value or split into parts' },
    },
  }),

  'sorting-step2': d({
    whenAtThisStep: 'Sort unsorted linked list or rearrange by position.',
    xray: [
      { text: '**Sort** an unsorted linked list in O(n log n)', kind: 'goal' },
      { text: '**Insertion sort** a linked list', kind: 'goal' },
      { text: '**Odd even** linked list reorder', kind: 'goal' },
    ],
    budget: ['sort', 'inPlace'],
    sayIt: ['Sort: merge sort (find mid + merge halves). Insertion sort: dummy + scan insertion.'],
    branchGuides: {
      sort: { proceed: 'WHEN: sort unsorted list or odd-even reorder' },
    },
  }),

  'clone-step2': d({
    whenAtThisStep: 'Deep copy with random pointers.',
    xray: [
      { text: '**Deep copy** a linked list with **random** pointers', kind: 'goal' },
    ],
    budget: ['clone', 'inPlace'],
    sayIt: ['Clone with random: three passes — interleave, wire random, restore + extract.'],
    branchGuides: {
      clone: { proceed: 'WHEN: copy list with random pointer' },
    },
  }),

  'struct-variants-step2': d({
    whenAtThisStep: 'Doubly-linked, multi-level, or circular list variant.',
    xray: [
      { text: '**Flatten** a multilevel doubly linked list', kind: 'goal' },
      { text: '**Insert** into a sorted **circular** linked list', kind: 'goal' },
    ],
    budget: ['doubly', 'circular'],
    sayIt: ['DLL: DFS flatten child, splice. Circular: find insert point by value, handle wrap.'],
    branchGuides: {
      doubly: { proceed: 'WHEN: multilevel DLL, browser history' },
      circular: { proceed: 'WHEN: circular list insert, circular game' },
    },
  }),

  'list-backed-step2': d({
    whenAtThisStep: 'Design cache or ADT using linked list as backing.',
    xray: [
      { text: 'Design **LRU cache** with O(1) get and put', kind: 'goal' },
      { text: 'Design **min stack** with O(1) getMin', kind: 'goal' },
    ],
    budget: ['cache'],
    sayIt: ['LRU: DLL + hash map. LFU: + freq map + per-freq DLL.', 'Min stack: pair (val, current min).'],
    branchGuides: {
      'min-stack': { proceed: 'WHEN: min/max stack or circular queue design' },
      cache: { proceed: 'WHEN: LRU or LFU cache design' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
