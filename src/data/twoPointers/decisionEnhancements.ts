import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Two Pointers? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Multiple indices walking an array/string/list',
    'O(n) or O(n log n) expected — not O(n²) brute force',
    'Prompt hints at sequential scan, pairing, or window',
    'Often: sorted input, in-place, or linked list',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem need multiple coordinated indices at all?',
  xray: [
    { text: 'Given an integer array nums, return all the **triplets** …', kind: 'signal' },
    { text: 'You must write an algorithm that runs in **O(n)** time', kind: 'constraint' },
    { text: 'Could you optimize your algorithm to use only **O(1)** extra space?', kind: 'constraint' },
    { text: 'Given the **head** of a linked list, detect if there is a **cycle**', kind: 'signal' },
    { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
  ],
  budget: ['sorted', 'listNode', 'contiguous', 'inPlace', 'twoInputs'],
  sayIt: [
    'Before any template: do I need two or more pointers moving in a rule-based way?',
    'If yes — opposite ends, same direction, partition, or two structures?',
    'If no sorted/window/list/in-place signal — probably not two pointers.',
  ],
  branchGuides: {
    'opposite-step2': {
      proceed: 'WHEN: sorted (or sortable) + pair/match/compare from BOTH ends',
      whenExtra: ['two sum on sorted', 'palindrome', 'max area between lines'],
    },
    'same-step2': {
      proceed: 'WHEN: one pass left→right, or fast chases slow, or in-place compact',
      whenExtra: ['ListNode', 'substring/window', 'remove duplicates in-place'],
    },
    'partition-step2': {
      proceed: 'WHEN: reorder array into groups (0/1/2) or kth element via pivot',
      whenExtra: ['only 0,1,2', 'kth largest without full sort'],
    },
    'struct-step2': {
      proceed: 'WHEN: TWO separate sequences given — merge, intersect, or compare',
      whenExtra: ['merge two lists', 'intersection of arrays'],
    },
  },
  notThisPattern: [
    { signal: '"subarray sum equals k" (any order, count subarrays)', actually: 'Prefix sum + hash map — not sliding window unless contiguous + variable window' },
    { signal: '"search in rotated sorted array"', actually: 'Binary search — one mid pointer, not two ends' },
    { signal: '"shortest path in grid"', actually: 'BFS / DFS — graph, not pointer scan' },
    { signal: '"maximum subarray sum" (Kadane)', actually: 'DP / Kadane — one running sum, not two pointers' },
  ],
  misidentify: [
    {
      cause: 'Tagged "Two Pointers" on LeetCode but needs hash map',
      wrong: 'Jump to opposite pointers on unsorted two-sum',
      testCase: 'Two Sum I (unsorted) — need complement lookup',
      fix: 'Unsorted + pair sum → hash map. Sorted → opposite pointers (LC 167).',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'tp-root': PATTERN_GATE,

  'opposite-step2': d({
    whenAtThisStep: 'You confirmed two pointers AND both indices start at opposite ends (or will after sort).',
    xray: [
      { text: 'Array is sorted **in non-decreasing order**', kind: 'constraint' },
      { text: 'Find two numbers such that they add up to **target**', kind: 'goal' },
      { text: 'Find the maximum amount of **water** a container can store', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite'],
    sayIt: [
      'Opposite ends: l=0, r=n-1.',
      'Next: matching a rule (sum/palindrome), optimizing volume, or k-sum?',
    ],
    branchGuides: {
      'condition-matching': {
        proceed: 'WHEN: check a RULE at both ends — sum target, palindrome, numeric identity',
      },
      'optimal-pairing': {
        proceed: 'WHEN: OPTIMIZE pairing from ends — max area, boats, pair sum, k-diff',
      },
      'multi-element': {
        proceed: 'WHEN: need 3+ indices worth (triplets, 4Sum, count with multiplicity)',
      },
    },
  }),

  'condition-matching': d({
    whenAtThisStep: 'Opposite pointers + you are checking whether a condition holds at (l,r).',
    xray: [
      { text: '**sum** to target / zero / less than k', kind: 'goal' },
      { text: 'valid **palindrome**', kind: 'goal' },
      { text: '**a² + b²** / triangle count', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'targetSum'],
    sayIt: ['Sum/palindrome/numeric rule → pick the matching leaf below.'],
    branchGuides: {
      'target-sum': { proceed: 'WHEN: exact/closest sum; pair or inner loop of k-sum' },
      palindrome: { proceed: 'WHEN: string symmetry from both ends' },
      numeric: { proceed: 'WHEN: squares, triangle inequality after sort' },
    },
  }),

  'optimal-pairing': d({
    whenAtThisStep: 'Opposite pointers + GREEDY pairing or counting from sorted ends.',
    xray: [
      { text: '**maximum** area / water', kind: 'goal' },
      { text: '**minimum** number of boats', kind: 'goal' },
      { text: 'pairs with **difference** k', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'maximize'],
    sayIt: ['Greedy from ends — volume, pairing people, or k-diff count.'],
    branchGuides: {
      volume: { proceed: 'WHEN: maximize something between two indices (area, rain)' },
      'greedy-pair': { proceed: 'WHEN: pair light+heavy after sort (boats, pair sum)' },
      'k-diff': { proceed: 'WHEN: count pairs with exact difference k' },
    },
  }),

  'multi-element': d({
    whenAtThisStep: 'Opposite inner loop + outer indices fix prefix elements.',
    xray: [
      { text: 'find all **triplets** / **quadruplets**', kind: 'goal' },
      { text: '**count** tuples modulo', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'enumerate'],
    sayIt: ['3+ elements → outer loop + opposite inner, or combo counting.'],
    branchGuides: {
      nsum: { proceed: 'WHEN: list all unique k-tuples summing to target' },
      multiplicity: { proceed: 'WHEN: count combinations with duplicate values (mod)' },
    },
  }),

  'same-step2': d({
    whenAtThisStep: 'Both pointers start left and move right (or fast/slow chase).',
    xray: [
      { text: 'Given **head** of linked list', kind: 'signal' },
      { text: '**substring** / **subarray** / window', kind: 'signal' },
      { text: 'Modify **in-place** with O(1) extra space', kind: 'constraint' },
    ],
    budget: ['listNode', 'contiguous', 'inPlace'],
    sayIt: [
      'Same direction: linked list chase, sliding window, read/write, or subsequence scan.',
    ],
    branchGuides: {
      'fast-slow-step3': { proceed: 'WHEN: ListNode — cycle, middle, nth from end' },
      'sliding-step3': { proceed: 'WHEN: contiguous subarray/substring constraint' },
      'rw-step3': { proceed: 'WHEN: filter/compacted array in-place, return new length' },
      'subseq-step3': { proceed: 'WHEN: two strings, match in order' },
    },
  }),

  'fast-slow-step3': d({
    whenAtThisStep: 'Linked list (or implicit next[]) — fast moves 2× or fixed gap.',
    xray: [
      { text: 'detect **cycle**', kind: 'goal' },
      { text: '**middle** node / **nth from end**', kind: 'goal' },
      { text: '**palindrome** list / **reorder** list', kind: 'goal' },
    ],
    budget: ['listNode', 'o1Space'],
    sayIt: ['Floyd cycle, gap pointer, or mid+reverse+merge.'],
    branchGuides: {
      cycle: { proceed: 'WHEN: cycle detection, duplicate number, happy number' },
      position: { proceed: 'WHEN: middle, nth from end, intersection of lists' },
      structural: { proceed: 'WHEN: restructure list — palindrome or reorder' },
    },
  }),

  'sliding-step3': d({
    whenAtThisStep: 'Contiguous window — right expands, left may shrink.',
    xray: [
      { text: 'subarray of size **k**', kind: 'constraint' },
      { text: '**longest** / **shortest** substring', kind: 'goal' },
      { text: '**anagram** / permutation in s', kind: 'goal' },
    ],
    budget: ['contiguous'],
    sayIt: ['Fixed k, variable longest, variable shortest, or freq match — pick one.'],
    branchGuides: {
      'fixed-win': { proceed: 'WHEN: exactly k length — slide, no shrink loop' },
      'variable-win': { proceed: 'WHEN: variable length — longest OR shortest' },
      'freq-win': { proceed: 'WHEN: window must match character frequency of p' },
    },
  }),

  'variable-win': d({
    whenAtThisStep: 'Window size not fixed — optimize length.',
    xray: [
      { text: '**longest** substring / at most K distinct', kind: 'goal' },
      { text: '**minimum** window / smallest subarray sum ≥ target', kind: 'goal' },
    ],
    budget: ['contiguous', 'maximize', 'minimize'],
    sayIt: ['Longest → expand & shrink when invalid. Shortest → shrink while valid.'],
    branchGuides: {
      'expand-win': { proceed: 'WHEN: maximize length (longest valid window)' },
      'contract-win': { proceed: 'WHEN: minimize length (shortest valid window)' },
    },
  }),

  'rw-step3': d({
    whenAtThisStep: 'Single array, in-place — read index scans, write index compacts.',
    xray: [
      { text: 'remove **duplicates** / element **in-place**', kind: 'goal' },
      { text: 'move **zeroes** / sort by **parity**', kind: 'goal' },
      { text: 'reverse string **in-place**', kind: 'goal' },
    ],
    budget: ['inPlace'],
    sayIt: ['Filter with w, move classes, or swap l/r for reverse.'],
    branchGuides: {
      removal: { proceed: 'WHEN: remove dupes or val, return new length' },
      movement: { proceed: 'WHEN: move zeroes or parity to one side' },
      transform: { proceed: 'WHEN: reverse chars or vowels in-place' },
    },
  }),

  'subseq-step3': d({
    whenAtThisStep: 'Two strings — match in order with rules.',
    xray: [
      { text: 'is **subsequence** of', kind: 'goal' },
      { text: '**camelcase** matching / **abbreviation**', kind: 'signal' },
    ],
    budget: ['string'],
    sayIt: ['Plain subsequence scan vs pattern with skip digits.'],
    branchGuides: {
      'basic-sub': { proceed: 'WHEN: simple in-order match' },
      'pattern-sub': { proceed: 'WHEN: camelCase or digit skip abbreviations' },
    },
  }),

  'partition-step2': d({
    whenAtThisStep: 'Reorder array by value class in O(n) — 2 or 3 pointers.',
    xray: [
      { text: 'array contains only **0, 1, 2**', kind: 'constraint' },
      { text: '**kth largest** element', kind: 'goal' },
    ],
    budget: ['values012', 'inPlace', 'kth'],
    sayIt: ['0/1/2 → Dutch flag. Kth → partition + recurse one side.'],
    branchGuides: {
      dnf: { proceed: 'WHEN: three-way partition 0|1|2' },
      'quick-part': { proceed: 'WHEN: kth largest or full quicksort partition' },
    },
  }),

  'struct-step2': d({
    whenAtThisStep: 'Two inputs — one pointer each, advance by comparison.',
    xray: [
      { text: '**merge** two sorted lists', kind: 'goal' },
      { text: '**intersection** of two arrays', kind: 'goal' },
      { text: '**compare** version / backspace strings', kind: 'goal' },
    ],
    budget: ['twoInputs', 'sorted'],
    sayIt: ['Merge, intersect sorted, or compare streams with rules.'],
    branchGuides: {
      merge: { proceed: 'WHEN: merge sorted sequences (2 or k lists)' },
      intersect: { proceed: 'WHEN: common elements or interval overlap' },
      'compare-scan': { proceed: 'WHEN: parse/compare two strings with rules' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
