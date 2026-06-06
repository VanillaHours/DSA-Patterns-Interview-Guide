import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'String prefix / startswith queries',
    'Multple word dictionary with common prefixes',
    'Insert and search word repeatedly',
    'Auto-complete or search suggestions',
    'Maximum XOR pair — binary trie',
  ],
  whenAtThisStep: 'Confirm the problem benefits from a trie — storing strings in a tree-of-characters for efficient prefix operations.',
  xray: [
    { text: 'string/word repeated **insert** and **search** operations', kind: 'signal' },
    { text: '**prefix** / startswith queries', kind: 'signal' },
    { text: '**wildcard** / dot character matching', kind: 'signal' },
    { text: 'multiple strings share **common prefixes**', kind: 'signal' },
    { text: '**auto-complete** or search suggestions', kind: 'signal' },
    { text: '**maximum XOR** pair in array (binary trie)', kind: 'signal' },
    { text: '**dictionary** with insert/search/startsWith', kind: 'goal' },
    { text: 'O(L) per operation', kind: 'constraint' },
  ],
  budget: ['trie', 'prefix tree', 'binary trie', 'insert', 'search', 'startsWith'],
  sayIt: [
    'Are there repeated insert/search/startsWith operations on strings?',
    'Do words share common prefixes where path sharing saves memory/time?',
    'Is it a dictionary with word existence and/or prefix queries?',
    'Could it be a binary trie for XOR bit-level operations?',
  ],
  branchGuides: {
    'basic-trie-ops-step2': {
      proceed: 'WHEN: core trie operations — insert, search, startsWith, delete, traverse',
    },
    'trie-apps-step2': {
      proceed: 'WHEN: practical applications — dictionaries, auto-complete, pattern matching',
    },
    'adv-trie-step2': {
      proceed: 'WHEN: specialized variants — compressed, ternary, suffix, bit-level tries',
    },
    'trie-opt-step2': {
      proceed: 'WHEN: optimizing space, performance, or hybrid trie combinations',
    },
  },
  notThisPattern: [
    { signal: 'Simple string match without prefix queries', actually: 'Use string/hash pattern — hash set is sufficient' },
    { signal: 'Sorting strings lexicographically only', actually: 'Use sorting pattern — sort once, no trie needed' },
  ],
  misidentify: [
    {
      cause: 'Hash-based problems that only need existence lookup',
      wrong: 'Build whole trie for one-time search',
      testCase: 'Check if word exists in dictionary — hash set O(1) wins',
      fix: 'Use hash set for simple existence checks without prefix',
    },
    {
      cause: 'Using trie where sorting + two-pointer works',
      wrong: 'Build trie for longest common prefix of all strings',
      testCase: 'LCP of ["flower","flow","flight"] — vertical scan is simpler',
      fix: 'Use vertical character scan or sort + compare first/last',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'trie-root': d({
    whenAtThisStep: 'You think a trie is needed. Now narrow down which domain.',
    xray: [
      { text: '**basic operations**: insert / search / startsWith / delete / traverse', kind: 'signal' },
      { text: '**applications**: dictionary, autocomplete, pattern matching, prefix/suffix', kind: 'signal' },
      { text: '**advanced structures**: compressed, ternary, suffix, binary trie', kind: 'signal' },
      { text: '**optimization**: space, performance tuning, hybrid', kind: 'signal' },
    ],
    budget: ['basic trie ops', 'trie applications', 'advanced trie', 'trie optimization'],
    sayIt: ['Core ops, dictionary app, advanced structure, or optimization technique?'],
    branchGuides: {
      'basic-trie-ops-step2': { proceed: 'yes — core operations: build, search, modify, traverse' },
      'trie-apps-step2': { proceed: 'yes — practical application: dictionary, autocomplete, pattern matching' },
      'adv-trie-step2': { proceed: 'yes — advanced variant: compressed, ternary, suffix, bit-level' },
      'trie-opt-step2': { proceed: 'yes — optimize: space, performance, hybrid approaches' },
    },
    notThisPattern: [
      { signal: 'Single string search without prefix reuse', actually: 'Use string matching pattern' },
    ],
  }),

  'basic-trie-ops-step2': d({
    whenAtThisStep: 'You confirmed basic trie operations. Which operation category?',
    xray: [
      { text: '**construction**: insert characters, batch load, specialized build', kind: 'signal' },
      { text: '**search**: exact match, prefix, wildcard', kind: 'signal' },
      { text: '**deletion / modification**: erase, update value, prune', kind: 'signal' },
      { text: '**traversal**: DFS, BFS, lexicographic order', kind: 'signal' },
    ],
    budget: ['construction', 'search', 'deletion', 'traversal'],
    sayIt: ['Building the trie, searching it, modifying it, or walking through it?'],
    branchGuides: {
      'trie-construction-step3': { proceed: 'yes — inserting words into trie' },
      'search-ops-step3': { proceed: 'yes — searching/looking up in trie' },
      'deletion-mod-step3': { proceed: 'yes — deleting or modifying trie contents' },
      'trie-traversal-step3': { proceed: 'yes — traversing through trie nodes' },
    },
    notThisPattern: [
      { signal: 'Not trie-based, just string operations', actually: 'Use string traversal pattern' },
    ],
  }),

  'trie-construction-step3': d({
    whenAtThisStep: 'Inserting words into trie. Which insertion pattern?',
    xray: [
      { text: '**char-by-char**: standard trie insert (208, 1804)', kind: 'signal' },
      { text: '**batch**: multiple words or key-value pairs (720, 677)', kind: 'signal' },
      { text: '**specialized**: modified structure (648, 676)', kind: 'signal' },
    ],
    budget: ['char insert', 'batch insert', 'specialized trie'],
    sayIt: ['Insert one word at a time, batch multiple, or with specialized modifications?'],
    branchGuides: {
      'char-by-char-insert': { proceed: 'standard char-by-char trie insert (LC 208, 1804)' },
      'batch-insertion': { proceed: 'batch insert or key-value with aggregates (LC 720, 677)' },
      'specialized-trie-structures': { proceed: 'specialized trie: replace roots, one-edit search (LC 648, 676)' },
    },
    notThisPattern: [
      { signal: 'Only search, no insert', actually: 'Use search operations' },
    ],
  }),

  'search-ops-step3': d({
    whenAtThisStep: 'Searching in a trie. What kind of search?',
    xray: [
      { text: '**exact match**: full word lookup with isEnd check', kind: 'signal' },
      { text: '**prefix search**: startsWith query, no isEnd needed', kind: 'signal' },
      { text: '**wildcard search**: . matches any character, DFS backtracking', kind: 'signal' },
    ],
    budget: ['exact match', 'prefix search', 'wildcard search'],
    sayIt: ['Exact word match, prefix startsWith, or wildcard/dot matching?'],
    branchGuides: {
      'exact-match-search': { proceed: 'exact word match: walk & check isEnd (LC 208, 1804)' },
      'prefix-search': { proceed: 'prefix / startswith: walk & return true (LC 208, 1804)' },
      'wildcard-search': { proceed: 'wildcard: DFS with . branching (LC 211, 1023)' },
    },
    notThisPattern: [
      { signal: 'Not a search operation', actually: 'Use construction or traversal' },
    ],
  }),

  'deletion-mod-step3': d({
    whenAtThisStep: 'Modifying trie contents. What change?',
    xray: [
      { text: '**delete**: erase word, decrement counts (1804)', kind: 'signal' },
      { text: '**modify**: update value at nodes (677, 745)', kind: 'signal' },
      { text: '**prune**: active frontier, stream matching (1032)', kind: 'signal' },
    ],
    budget: ['delete', 'modify', 'prune'],
    sayIt: ['Remove word, update value, or prune/maintain active state?'],
    branchGuides: {
      'single-word-deletion': { proceed: 'delete word: decrement counts (LC 1804)' },
      'trie-modification': { proceed: 'modify values: map sum, prefix+suffix (LC 677, 745)' },
      'trie-pruning': { proceed: 'prune / active frontier: stream of characters (LC 1032)' },
    },
    notThisPattern: [
      { signal: 'Read-only trie, no modification', actually: 'Use search or construction' },
    ],
  }),

  'trie-traversal-step3': d({
    whenAtThisStep: 'Traversing through trie nodes. Which order?',
    xray: [
      { text: '**DFS**: depth-first, explore deep before wide (720, 1268)', kind: 'signal' },
      { text: '**BFS/level-order**: queue-based, level by level', kind: 'signal' },
      { text: '**lexicographic**: alphabetical DFS output (1268, 642)', kind: 'signal' },
    ],
    budget: ['dfs', 'bfs', 'lexicographic'],
    sayIt: ['DFS recursive, BFS level-order, or lexicographic alphabetical output?'],
    branchGuides: {
      'dfs-traversal': { proceed: 'DFS: deepest path, prefix validation (LC 720, 1268)' },
      'level-order-traversal': { proceed: 'level-order BFS: width, depth analysis' },
      'lexicographic-traversal': { proceed: 'lexicographic: alphabetical DFS, top-K (LC 1268, 642)' },
    },
    notThisPattern: [
      { signal: 'Only need word existence, not full traversal', actually: 'Use search operations' },
    ],
  }),

  'trie-apps-step2': d({
    whenAtThisStep: 'You need a trie application. Which type?',
    xray: [
      { text: '**dictionary**: lookup, replace words, wildcard dict', kind: 'signal' },
      { text: '**prefix/suffix**: counting, matching, LCP', kind: 'signal' },
      { text: '**auto-complete**: search suggestions, hotness', kind: 'signal' },
      { text: '**pattern matching**: multiple patterns, word search', kind: 'signal' },
    ],
    budget: ['word dict', 'prefix/suffix', 'autocomplete', 'pattern match'],
    sayIt: ['Dictionary feature, prefix/suffix, auto-complete, or pattern matching?'],
    branchGuides: {
      'word-dict-step3': { proceed: 'yes — dictionary lookup, replacement, or features' },
      'prefix-suffix-step3': { proceed: 'yes — prefix/suffix counting, matching, or LCP' },
      'autocomplete-step3': { proceed: 'yes — auto-complete suggestions or real-time search' },
      'pattern-matching-step3': { proceed: 'yes — pattern matching or validation' },
    },
    notThisPattern: [
      { signal: 'Basic trie operations only', actually: 'Use basic trie ops' },
    ],
  }),

  'word-dict-step3': d({
    whenAtThisStep: 'Dictionary-based trie application. Which feature?',
    xray: [
      { text: '**lookup**: search word existence (208, 1268)', kind: 'signal' },
      { text: '**replacement**: replace with dict root (648, 1858)', kind: 'signal' },
      { text: '**feature**: wildcard or autocomplete (211, 642)', kind: 'signal' },
    ],
    budget: ['lookup', 'replacement', 'feature'],
    sayIt: ['Dictionary lookup, word replacement, or feature-rich dictionary?'],
    branchGuides: {
      'word-lookup': { proceed: 'word lookup: exact or prefix (LC 208, 1268)' },
      'word-replacement': { proceed: 'replacement: shortest root replace (LC 648, 1858)' },
      'dict-feature': { proceed: 'dictionary features: wildcard, autocomplete (LC 211, 642)' },
    },
    notThisPattern: [
      { signal: 'Counting prefix occurrences', actually: 'Use prefix counting' },
    ],
  }),

  'prefix-suffix-step3': d({
    whenAtThisStep: 'Prefix/suffix processing with trie. Which operation?',
    xray: [
      { text: '**count**: prefix value/count aggregation (677, 1804)', kind: 'signal' },
      { text: '**match**: pattern matching with case or combined keys (1023, 745)', kind: 'signal' },
      { text: '**LCP**: longest common prefix among strings (14)', kind: 'signal' },
    ],
    budget: ['count', 'match', 'lcp'],
    sayIt: ['Count by prefix, match patterns, or find longest common prefix?'],
    branchGuides: {
      'prefix-counting': { proceed: 'prefix counting: cumulative values (LC 677, 1804)' },
      'prefix-matching': { proceed: 'prefix matching: camelcase, combined keys (LC 1023, 745)' },
      'longest-common-prefix': { proceed: 'longest common prefix: LCP (LC 14)' },
    },
    notThisPattern: [
      { signal: 'Suggesting completions', actually: 'Use auto-complete' },
    ],
  }),

  'autocomplete-step3': d({
    whenAtThisStep: 'Auto-complete system. Which type of suggestions?',
    xray: [
      { text: '**basic**: top K lexicographic suggestions (1268)', kind: 'signal' },
      { text: '**top-K**: sorted by hotness/frequency (642)', kind: 'signal' },
      { text: '**realtime**: stream-based matching (1032)', kind: 'signal' },
    ],
    budget: ['basic autocomplete', 'top-k suggestions', 'realtime search'],
    sayIt: ['Lexicographic suggestions, frequency-based top-K, or real-time stream detection?'],
    branchGuides: {
      'basic-autocomplete': { proceed: 'basic: top K lexicographic (LC 1268)' },
      'topk-suggestions': { proceed: 'top-K: frequency sorted (LC 642)' },
      'realtime-search': { proceed: 'realtime: stream suffix matching (LC 1032)' },
    },
    notThisPattern: [
      { signal: 'Single word dictionary, no suggestions', actually: 'Use word dictionary' },
    ],
  }),

  'pattern-matching-step3': d({
    whenAtThisStep: 'Pattern matching with trie. Which variant?',
    xray: [
      { text: '**multiple patterns**: search board for many words (212)', kind: 'signal' },
      { text: '**longest prefix**: find longest word with all prefixes (720, 1858)', kind: 'signal' },
      { text: '**validation**: sub-folder, suffix detect (1032, 1233)', kind: 'signal' },
    ],
    budget: ['multiple patterns', 'longest prefix', 'validation'],
    sayIt: ['Search for many patterns, find longest valid prefix, or validate patterns?'],
    branchGuides: {
      'multiple-pattern-search': { proceed: 'multiple patterns: board search (LC 212, Aho-Corasick)' },
      'longest-matching-prefix': { proceed: 'longest prefix: every prefix valid (LC 720, 1858)' },
      'pattern-validation': { proceed: 'validation: sub-folder, suffix check (LC 1032, 1233)' },
    },
    notThisPattern: [
      { signal: 'Count by prefix', actually: 'Use prefix counting' },
    ],
  }),

  'adv-trie-step2': d({
    whenAtThisStep: 'You need an advanced trie variant. Which type?',
    xray: [
      { text: '**compressed**: PATRICIA, Radix — merge single-child nodes', kind: 'signal' },
      { text: '**ternary**: three-way branching, memory-efficient', kind: 'signal' },
      { text: '**suffix**: all suffixes compressed, Ukkonen O(n)', kind: 'signal' },
      { text: '**bit-level**: binary trie on bits, max XOR, IP routing', kind: 'signal' },
    ],
    budget: ['compressed', 'ternary', 'suffix', 'bit-level'],
    sayIt: ['Compressed/Radix, Ternary Search Trie, Suffix Tree, or Binary Trie for bits?'],
    branchGuides: {
      'compressed-tries': { proceed: 'compressed: PATRICIA, Radix tree — path compression' },
      'ternary-search-tries': { proceed: 'ternary: three-way branching (less/equal/greater)' },
      'suffix-tries': { proceed: 'suffix: all suffixes, Ukkonen O(n) construction' },
      'bit-level-tries': { proceed: 'bit-level: binary trie for max XOR (LC 421, 1707)' },
    },
    notThisPattern: [
      { signal: 'Standard trie operations only', actually: 'Use basic trie operations' },
    ],
  }),

  'trie-opt-step2': d({
    whenAtThisStep: 'Optimizing trie performance. Which focus area?',
    xray: [
      { text: '**space**: memory reduction, array vs hash, compression', kind: 'signal' },
      { text: '**performance**: speed, isEnd, count tracking, skipping', kind: 'signal' },
      { text: '**hybrid**: trie + DP, trie + backtracking, trie + hash', kind: 'signal' },
    ],
    budget: ['space', 'performance', 'hybrid'],
    sayIt: ['Reduce memory, improve performance, or combine trie with other techniques?'],
    branchGuides: {
      'space-optimization': { proceed: 'space: array-based, alphabet reduction, path compression' },
      'performance-tuning': { proceed: 'performance: isEnd, count tracking, character skipping' },
      'hybrid-approaches': { proceed: 'hybrid: trie + DP (1048), trie + backtracking (212), trie + hash (676)' },
    },
    notThisPattern: [
      { signal: 'Need actual trie, not optimizing', actually: 'Use basic trie operations' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
