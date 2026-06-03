import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even String Traversal? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'One or more strings as primary input',
    'Character-by-character processing, substring, or pattern search',
    'Generate or decompose strings recursively',
    'Dictionary-backed prefix lookup (trie)',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: is the core operation string traversal?',
  xray: [
    { text: 'Given a string **s**, determine if it is a **palindrome**', kind: 'signal' },
    { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
    { text: 'Find the **index of first occurrence** of needle in haystack', kind: 'goal' },
    { text: 'Return all **letter combinations** that the number could represent', kind: 'goal' },
    { text: '**Implement a trie** with insert, search, startsWith', kind: 'goal' },
  ],
  budget: ['string', 'contiguous', 'recursive', 'trie'],
  sayIt: [
    'Before any template: is this a string traversal problem?',
    'If yes — linear scan, recursive generation/decomposition, or trie?',
    'Linear: single pass char-by-char, window, or pattern matching.',
    'Recursive: generate combinations or partition expression.',
    'Trie: prefix tree for dictionary lookups.',
  ],
  branchGuides: {
    'linear-str': {
      proceed: 'WHEN: one string scanned left-to-right — palindrome, window, or search pattern',
      whenExtra: ['valid palindrome', 'longest substring', 'needle in haystack'],
    },
    'recursive-str': {
      proceed: 'WHEN: generate/decompose strings recursively — backtracking or partition',
      whenExtra: ['letter combinations', 'generate parentheses', 'restore IP'],
    },
    'trie-str': {
      proceed: 'WHEN: dictionary-backed prefix lookups — implement trie or word search',
      whenExtra: ['implement trie', 'word search in board'],
    },
  },
  notThisPattern: [
    { signal: '"two sum" / "three sum"', actually: 'Two Pointers — numeric pair matching, not string traversal' },
    { signal: '"reverse linked list"', actually: 'Linked List — pointer rewiring, not string scanning' },
    { signal: '"merge intervals"', actually: 'Interval / Greedy — sorting + merging ranges' },
  ],
  misidentify: [
    {
      cause: 'Tagged "string" on LeetCode but uses hash map for pattern',
      wrong: 'Two-pointer char-by-char when unordered_map needed',
      testCase: 'Contains Duplicate II — hash map of indices',
      fix: 'Read carefully: need exact frequency/complement? Use map. Need char compare? Two pointers.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'str-root': PATTERN_GATE,

  'linear-str': d({
    whenAtThisStep: 'Single string scanned left-to-right (or two ends).',
    xray: [
      { text: 'A phrase is a **palindrome** if it reads same forward and backward', kind: 'signal' },
      { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
      { text: 'Find the **first occurrence** of needle in haystack', kind: 'goal' },
    ],
    budget: ['string', 'contiguous'],
    sayIt: [
      'Linear scan: opposite ends (palindrome), sliding window, or pattern match.',
      'Next: which operation — char compare, window constraint, or pattern search?',
    ],
    branchGuides: {
      'char-by-char': {
        proceed: 'WHEN: compare characters from both ends (palindrome, reverse)',
      },
      'window-scan': {
        proceed: 'WHEN: substring constraint — longest/shortest/at most K',
      },
      'pattern-match': {
        proceed: 'WHEN: find pattern in text — KMP, rolling hash, or naive',
      },
    },
  }),

  'char-by-char': d({
    whenAtThisStep: 'Opposite ends, skip junk, compare case-insensitively.',
    xray: [
      { text: 'A phrase is a **palindrome** if reads same forward and backward', kind: 'signal' },
      { text: 'considering only **alphanumeric** characters and ignoring cases', kind: 'constraint' },
    ],
    budget: ['string', 'charCompare'],
    sayIt: ['Palindrome → opposite ends inward; skip non-alnum; compare lowercase.'],
    branchGuides: {
      'char-by-char': { proceed: 'WHEN: valid palindrome / reverse string' },
    },
  }),

  'window-scan': d({
    whenAtThisStep: 'Substring constraint — window size may be fixed or variable.',
    xray: [
      { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
      { text: 'Find the **minimum window** substring containing all of t', kind: 'goal' },
    ],
    budget: ['string', 'contiguous', 'maximize', 'minimize'],
    sayIt: ['Sliding window: expand r, shrink l when constraint breaks.'],
    branchGuides: {
      'window-scan': { proceed: 'WHEN: longest valid window OR shortest containing window' },
    },
  }),

  'pattern-match': d({
    whenAtThisStep: 'Find pattern in text — naive scan or optimized string search.',
    xray: [
      { text: 'Return the **index** of the first occurrence of needle in haystack', kind: 'goal' },
      { text: 'Check if **b is a substring** of a repeated k times', kind: 'goal' },
    ],
    budget: ['string', 'pattern'],
    sayIt: ['Pattern match: naive O(n*m) ok for small; KMP/rolling hash for large.'],
    branchGuides: {
      'pattern-match': { proceed: 'WHEN: find substring — strStr / repeated string match' },
    },
  }),

  'recursive-str': d({
    whenAtThisStep: 'Strings built or broken via recursion and backtracking.',
    xray: [
      { text: 'Return all **letter combinations** the number can represent', kind: 'goal' },
      { text: 'Generate all well-formed **parentheses**', kind: 'goal' },
      { text: 'Return all possible **IP addresses** from string', kind: 'goal' },
    ],
    budget: ['string', 'recursive', 'enumerate'],
    sayIt: [
      'Recursive: generate (backtracking) or decompose (partition).',
      'Backtracking: build string char by char, undo on backtrack.',
      'Decomposition: split at valid points, recurse on parts.',
    ],
    branchGuides: {
      'backtrack-str': {
        proceed: 'WHEN: generate all valid strings — backtrack with prune',
      },
      'string-decompose': {
        proceed: 'WHEN: partition string into valid segments — recursion on splits',
      },
    },
  }),

  'backtrack-str': d({
    whenAtThisStep: 'Recursively build string candidates, pruning invalid branches.',
    xray: [
      { text: 'Return all **letter combinations** the number represents', kind: 'goal' },
      { text: 'Generate all well-formed **parentheses**', kind: 'goal' },
    ],
    budget: ['string', 'recursive', 'enumerate'],
    sayIt: ['Backtrack: build, recurse, undo; prune when invalid (close>open).'],
    branchGuides: {
      'backtrack-str': { proceed: 'WHEN: letter combinations or generate parentheses' },
    },
  }),

  'string-decompose': d({
    whenAtThisStep: 'Partition string at split points, validate segments recursively.',
    xray: [
      { text: 'Return all valid **IP addresses** by inserting dots', kind: 'goal' },
      { text: 'Return all **ways to compute** expression by splitting on operators', kind: 'goal' },
    ],
    budget: ['string', 'recursive', 'enumerate'],
    sayIt: ['Decompose: split at positions, validate parts, combine results.'],
    branchGuides: {
      'string-decompose': { proceed: 'WHEN: restore IP or different ways to compute expression' },
    },
  }),

  'trie-str': d({
    whenAtThisStep: 'Dictionary-backed prefix lookups or traversal with trie.',
    xray: [
      { text: '**Implement a trie** with insert, search, and startsWith', kind: 'goal' },
      { text: 'Return all words from dictionary **found on board**', kind: 'goal' },
      { text: '**Replace words** in sentence with shortest root prefix', kind: 'goal' },
    ],
    budget: ['string', 'trie', 'dictionary'],
    sayIt: [
      'Trie: prefix tree — insert O(L), search O(L).',
      'Wildcard: DFS all children on dot.',
      'Board word search: trie + DFS backtracking.',
    ],
    branchGuides: {
      'prefix-match': {
        proceed: 'WHEN: implement trie, prefix queries, or wildcard search',
      },
      'word-dict': {
        proceed: 'WHEN: board word search or replace words with dictionary roots',
      },
    },
  }),

  'prefix-match': d({
    whenAtThisStep: 'Trie insert/search/startsWith or wildcard dot traversal.',
    xray: [
      { text: '**Implement a trie** — insert, search, startsWith', kind: 'goal' },
      { text: 'Design a data structure that supports **wildcard dot** (.)', kind: 'constraint' },
    ],
    budget: ['string', 'trie', 'prefixQuery'],
    sayIt: ['Trie: 26-ary tree; search with dot → DFS children.'],
    branchGuides: {
      'prefix-match': { proceed: 'WHEN: implement trie or add+search with wildcard' },
    },
  }),

  'word-dict': d({
    whenAtThisStep: 'Dictionary of words to find in board or replace in text.',
    xray: [
      { text: 'Find all words from **dictionary** in a **board** of letters', kind: 'goal' },
      { text: '**Replace** words in sentence with their root from dictionary', kind: 'goal' },
    ],
    budget: ['string', 'trie', 'dictionary', 'boardDFS'],
    sayIt: ['Word search: build trie from dict; DFS board; mark visited with #.'],
    branchGuides: {
      'word-dict': { proceed: 'WHEN: word search II or replace words with roots' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
