import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Hash Map? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Need O(1) lookup, insertion, or deletion of elements',
    'Unsorted input where complement / target matching is needed',
    'Frequency counting, grouping, or classification of elements',
    'One-to-one mapping between two data sets (bijection)',
    'Prefix sum tracking with hash map for O(n) subarray queries',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does this problem benefit from a hash-based access structure?',
  xray: [
    { text: 'Given an **unsorted** array of integers, return indices of two numbers …', kind: 'signal' },
    { text: 'Your algorithm should run in **O(n)** time using **O(n)** extra space', kind: 'constraint' },
    { text: 'Return the **frequency** of each character / element', kind: 'goal' },
    { text: 'Design a data structure that supports **get** and **put** in O(1)', kind: 'signal' },
    { text: 'Group all **anagrams** / classify items by a **property**', kind: 'goal' },
  ],
  budget: ['unsorted', 'frequency', 'complement', 'grouping', 'targetSum'],
  sayIt: [
    'Before any template: does the problem benefit from fast lookup / counting / mapping?',
    'If yes — direct lookup, bijection, grouping, prefix, index hash, specialized, or string hash?',
    'If sorted + complement from ends suggests two pointers — not hash map.',
  ],
  branchGuides: {
    'direct-step2': {
      proceed: 'WHEN: checking existence, counting frequency, or matching pairs',
      whenExtra: ['contains duplicate', 'anagram', 'two sum unsorted', 'count pairs'],
    },
    'bijection-step2': {
      proceed: 'WHEN: one-to-one mapping — isomorphic strings, word pattern, bijection check',
      whenExtra: ['isomorphic', 'word pattern', 'strobogrammatic'],
    },
    'structure-step2': {
      proceed: 'WHEN: grouping by key, prefix sum with map, or multi-map (time-based)',
      whenExtra: ['group anagrams', 'subarray sum k', 'time map'],
    },
    'index-step2': {
      proceed: 'WHEN: O(1) space auxiliary — index as hash via negation or swap',
      whenExtra: ['first missing positive', 'find duplicates O(1) space'],
    },
    'specialized-step2': {
      proceed: 'WHEN: design a cache, hash map, or trie-based dictionary',
      whenExtra: ['LRU cache', 'design hash map', 'add and search word'],
    },
    'multipass-step2': {
      proceed: 'WHEN: two-pass algorithm — clone graph, copy random list, repeated DNA',
      whenExtra: ['clone graph', 'copy list with random', 'repeated DNA'],
    },
    'string-step2': {
      proceed: 'WHEN: rolling hash, character signatures, or pattern-based string hashing',
      whenExtra: ['Rabin-Karp', 'anagram signature', 'number of atoms'],
    },
  },
  notThisPattern: [
    { signal: '"sorted array" + "find pair with sum"', actually: 'Two Pointers (opposite direction) — not hash map' },
    { signal: '"search in sorted array"', actually: 'Binary search — one pointer, not hash' },
    { signal: '"find median / majority with O(1) space"', actually: 'Boyer-Moore voting — not hash map' },
  ],
  misidentify: [
    {
      cause: 'Hash map on sorted input when opposite pointers work',
      wrong: 'unordered_map for two-sum on sorted array',
      testCase: 'LC 167 (sorted) — need O(1) space',
      fix: 'Sorted → opposite pointers. Unsorted → hash map (LC 1).',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'ht-root': PATTERN_GATE,

  'direct-step2': d({
    whenAtThisStep: 'You need fast element access — existence, counting, or pair matching.',
    xray: [
      { text: 'Check if an element **exists** / **contains duplicate**', kind: 'goal' },
      { text: '**Frequency** of characters or elements', kind: 'goal' },
      { text: 'Find a **pair** with given sum / property in unsorted array', kind: 'goal' },
    ],
    budget: ['unsorted', 'frequency', 'complement'],
    sayIt: [
      'Direct lookup: existence check, frequency count, or pair matching.',
      'Next: presence check, frequency bucketing, or pair property?',
    ],
    branchGuides: {
      'existence-step3': { proceed: 'WHEN: element presence or character frequency' },
      'counting-step3': { proceed: 'WHEN: top-K frequency or heavy hitters' },
      'pair-step3': { proceed: 'WHEN: sum-based or property-based pair matching' },
    },
  }),

  'existence-step3': d({
    whenAtThisStep: 'Pure existence or membership check.',
    xray: [
      { text: 'Does the array contain **duplicates**?', kind: 'goal' },
      { text: 'Are two strings **anagrams**?', kind: 'goal' },
    ],
    budget: ['unsorted', 'frequency'],
    sayIt: ['Element presence → unordered_set. Character frequency → freq array/map.'],
    branchGuides: {
      'elem-presence': { proceed: 'WHEN: check if element exists / duplicate found' },
      'char-freq': { proceed: 'WHEN: compare character frequencies (anagram, ransom)' },
    },
  }),

  'counting-step3': d({
    whenAtThisStep: 'Count occurrences and extract by frequency.',
    xray: [
      { text: '**Top K** most frequent elements', kind: 'goal' },
      { text: '**Majority** element (appears > n/2)', kind: 'goal' },
    ],
    budget: ['frequency', 'topK'],
    sayIt: ['Frequency map + bucket sort for top-K. Boyer-Moore for majority.'],
    branchGuides: {
      'freq-bucket': { proceed: 'WHEN: top-K frequent or sort by frequency' },
      'heavy-hitters': { proceed: 'WHEN: majority element (> n/2 or > n/3)' },
    },
  }),

  'pair-step3': d({
    whenAtThisStep: 'Find pairs matching a sum or property.',
    xray: [
      { text: 'Find two numbers that add up to **target**', kind: 'goal' },
      { text: '**Subarray sum** equals k', kind: 'goal' },
      { text: 'Count pairs with **difference** k', kind: 'goal' },
    ],
    budget: ['unsorted', 'complement', 'targetSum'],
    sayIt: ['Complement map for two-sum. Prefix sum map for subarray sum.'],
    branchGuides: {
      'sum-based': { proceed: 'WHEN: two sum, subarray sum k, continuous subarray sum' },
      'property-match': { proceed: 'WHEN: k-diff pairs, absolute difference k (hash map)' },
    },
  }),

  'bijection-step2': d({
    whenAtThisStep: 'One-to-one mapping between two data sets.',
    xray: [
      { text: 'Are strings **isomorphic**?', kind: 'goal' },
      { text: 'Does **word pattern** match?', kind: 'goal' },
    ],
    budget: ['bijection', 'stringInput'],
    sayIt: ['Dual maps for bijection: map s→t and t→s simultaneously.'],
    branchGuides: {
      bijection: { proceed: 'WHEN: isomorphic strings, word pattern, strobogrammatic' },
    },
  }),

  'structure-step2': d({
    whenAtThisStep: 'Hash map for grouping, prefix sums, or multi-map.',
    xray: [
      { text: '**Group** items by a normalized key (anagrams, shifted strings)', kind: 'goal' },
      { text: '**Subarray sum** / contiguous array with prefix map', kind: 'goal' },
      { text: '**Multi-map** / time-based key-value store', kind: 'goal' },
    ],
    budget: ['grouping', 'prefixSum'],
    sayIt: ['Grouping by key, prefix sum map for subarray, or multi-map for time series.'],
    branchGuides: {
      grouping: { proceed: 'WHEN: classify/group by normalized key' },
      'prefix-sum-map': { proceed: 'WHEN: subarray sum, balance 0/1, nice subarrays' },
      'multi-map': { proceed: 'WHEN: multi-map, time-based key-value, visit patterns' },
    },
  }),

  'index-step2': d({
    whenAtThisStep: 'Array index doubles as hash key — O(1) space.',
    xray: [
      { text: '**O(n) time, O(1) space** on an array of integers', kind: 'constraint' },
      { text: '**First missing positive** integer', kind: 'goal' },
      { text: 'Find **duplicates** without extra space', kind: 'goal' },
    ],
    budget: ['o1Space', 'unsorted'],
    sayIt: ['Index as hash key: negate, swap, or use set to detect runs.'],
    branchGuides: {
      'index-hash': { proceed: 'WHEN: longest consecutive, first missing positive, find duplicates' },
    },
  }),

  'specialized-step2': d({
    whenAtThisStep: 'Design a data structure with hash map internals.',
    xray: [
      { text: 'Design a **LRU / LFU cache**', kind: 'goal' },
      { text: 'Design a **hash map / hash set** from scratch', kind: 'goal' },
      { text: 'Design a **searchable dictionary** with wildcards', kind: 'goal' },
    ],
    budget: ['cache', 'listNode'],
    sayIt: ['LRU → doubly-linked list + map. HashMap → bucket array. Dictionary → Trie.'],
    branchGuides: {
      'lru-cache': { proceed: 'WHEN: LRU or LFU cache design' },
      'design-hashmap': { proceed: 'WHEN: implement hash map / set from scratch' },
      'specialized-dict': { proceed: 'WHEN: dictionary with wildcard search, in-memory file system' },
    },
  }),

  'multipass-step2': d({
    whenAtThisStep: 'Two or more passes over data building hash map state.',
    xray: [
      { text: 'Find **repeated** sequences in DNA', kind: 'goal' },
      { text: '**Deep copy** a linked list with random pointer', kind: 'goal' },
      { text: '**Clone** an undirected graph', kind: 'goal' },
    ],
    budget: ['frequency', 'listNode'],
    sayIt: ['Pass 1: build map (old→new). Pass 2: wire connections via map.'],
    branchGuides: {
      'multi-pass': { proceed: 'WHEN: repeated sequences, deep copy with random, clone graph' },
    },
  }),

  'string-step2': d({
    whenAtThisStep: 'String-specific hashing techniques.',
    xray: [
      { text: 'Find substring occurrence / **Rabin-Karp**', kind: 'goal' },
      { text: '**Character signature** for anagrams', kind: 'goal' },
      { text: '**Pattern** matching / formula parsing', kind: 'goal' },
    ],
    budget: ['rollingHash', 'stringInput', 'frequency'],
    sayIt: ['Rolling hash for substring. Char freq array for signatures. Stack maps for formulas.'],
    branchGuides: {
      'rolling-hash': { proceed: 'WHEN: substring search, longest duplicate substring, repeated subarray' },
      'char-sig': { proceed: 'WHEN: anagram detection, character frequency signatures' },
      'pattern-hash': { proceed: 'WHEN: formula parsing, spellchecker, DNA patterns' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
