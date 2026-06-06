import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Basic Trie Operations (step 2) ────────────────────────────────

const trieConstruction: TaxonomyNode = decision(
  'trie-construction-step3',
  'Trie Construction — how are words inserted?',
  'lime',
  3,
  'You need to insert words into a trie. Consider the insertion pattern:',
  [
    branch(
      ['"implement trie"', '"prefix tree"', '"insert(word)"'],
      'Character-by-Character Insertion',
      'Standard trie: insert one character at a time, node per char.',
      L.charByCharLeaf,
      ['batch insert with value tracking'],
    ),
    branch(
      ['"longest word in dictionary"', '"map sum pairs"', 'batch / array of words'],
      'Batch Insertion',
      'Insert multiple words or key-value pairs; may need to aggregate values.',
      L.batchInsertionLeaf,
    ),
    branch(
      ['"replace words"', '"magic dictionary"', '"camelcase"', 'specialized lookup'],
      'Specialized Trie Structures',
      'Trie with modified operations: replace roots, allow one mismatch, case matching.',
      L.specializedTrieLeaf,
    ),
  ],
)

const searchOperations: TaxonomyNode = decision(
  'search-ops-step3',
  'Search Operations — what kind of lookup?',
  'teal',
  3,
  'You need to search in a trie. What search variant?',
  [
    branch(
      ['"search"', '"exact match"', '"word exists"', '"implement trie" search'],
      'Exact Match Search',
      'Walk characters; check isEnd at the final node.',
      L.exactMatchLeaf,
      ['startsWith/prefix query'],
    ),
    branch(
      ['"startsWith"', '"prefix"', '"starting with"', '"count words starting with"'],
      'Prefix Search',
      'Walk prefix characters; return true if path exists.',
      L.prefixSearchLeaf,
      ['exact match', 'wildcard'],
    ),
    branch(
      ['"."', '"wildcard"', '"dot"', '"pattern"', '"camelcase matching"', 'regex-like'],
      'Wildcard Search',
      'DFS/backtracking when . matches all 26 children.',
      L.wildcardSearchLeaf,
    ),
  ],
)

const deletionModification: TaxonomyNode = decision(
  'deletion-mod-step3',
  'Deletion & Modification — changing trie contents?',
  'pink',
  3,
  'You need to modify or delete from a trie. What operation?',
  [
    branch(
      ['"erase"', '"delete"', '"remove word"'],
      'Single Word Deletion',
      'Decrement counts along the word path; optional physical node cleanup.',
      L.singleWordDeletionLeaf,
      ['modify value', 'prune nodes'],
    ),
    branch(
      ['"map sum"', '"prefix suffix search"', 'update / modify value'],
      'Trie Modification',
      'Update values stored at trie nodes; re-insert with new data.',
      L.trieModificationLeaf,
    ),
    branch(
      ['"stream of characters"', '"prune"', '"active frontier"', 'suffix matching'],
      'Trie Pruning',
      'Maintain active node set; prune dead branches to limit memory growth.',
      L.triePruningLeaf,
    ),
  ],
)

const trieTraversal: TaxonomyNode = decision(
  'trie-traversal-step3',
  'Trie Traversal — how to move through the trie?',
  'blue',
  3,
  'You need to traverse the trie. Which traversal order?',
  [
    branch(
      ['"DFS"', '"depth-first"', '"longest word"', '"search suggestions"'],
      'Depth-First Traversal',
      'Recursive traversal: explore children in alphabetical order.',
      L.dfsTraversalLeaf,
      ['level-order / BFS'],
    ),
    branch(
      ['"BFS"', '"level-order"', '"breadth"', '"trie width"'],
      'Level-Order Traversal',
      'Queue-based traversal: process nodes level by level.',
      L.levelOrderTraversalLeaf,
      ['dfs / depth-first'],
    ),
    branch(
      ['"lexicographic"', '"sorted order"', '"alphabetical"', '"autocomplete"'],
      'Lexicographic Traversal',
      'DFS children in alphabetical order; natural lexicographic output.',
      L.lexicographicTraversalLeaf,
    ),
  ],
)

const basicTrieOps: TaxonomyNode = decision(
  'basic-trie-ops-step2',
  'Basic Trie Operations',
  'green',
  2,
  'Core trie operations: construction, search, modification, or traversal. Pick ONE:',
  [
    branch(
      ['"insert"', '"build"', '"construct"', '"longest word"', '"map sum"', '"replace words"'],
      '→ Trie Construction',
      'Insert words into trie; may batch insert or use specialized structures.',
      trieConstruction,
    ),
    branch(
      ['"search"', '"find"', '"lookup"', '"startsWith"', '"prefix"', '"wildcard"', '"dot"'],
      '→ Search Operations',
      'Word lookup, prefix validation, or wildcard search with backtracking.',
      searchOperations,
      ['modify value in trie'],
    ),
    branch(
      ['"erase"', '"delete"', '"remove"', '"modify"', '"prune"', '"stream suffix"'],
      '→ Deletion & Modification',
      'Remove words, update node values, or maintain active frontier for stream matching.',
      deletionModification,
    ),
    branch(
      ['"DFS"', '"BFS"', '"level-order"', '"traverse"', '"sorted"', '"search suggestions"'],
      '→ Trie Traversal',
      'DFS, BFS, or lexicographic walk through trie nodes.',
      trieTraversal,
    ),
  ],
)

// ── Trie Applications (step 2) ────────────────────────────────────

const wordDictionaryProblems: TaxonomyNode = decision(
  'word-dict-step3',
  'Word Dictionary Problems — what dictionary feature?',
  'green',
  3,
  'Dictionary-based application of tries. Which feature?',
  [
    branch(
      ['"search"', '"lookup"', '"word exist"', '"implement trie" dictionary'],
      'Word Lookup',
      'Check if a word exists in the dictionary; exact match or prefix search.',
      L.wordLookupLeaf,
      ['replace words with roots'],
    ),
    branch(
      ['"replace words"', '"root"', '"longest word all prefixes"', 'substitute / replace'],
      'Word Replacement',
      'Replace words with their shortest root from dictionary.',
      L.wordReplacementLeaf,
    ),
    branch(
      ['"magic dictionary"', '"add and search"', '"design autocomplete"', 'feature-rich dict'],
      'Dictionary Feature',
      'Specialized dictionary operations: wildcard search, autocomplete, one-edit lookup.',
      L.dictFeatureLeaf,
    ),
  ],
)

const prefixSuffixProcessing: TaxonomyNode = decision(
  'prefix-suffix-step3',
  'Prefix/Suffix Processing — how to handle prefix/suffix operations?',
  'teal',
  3,
  'Processing string prefixes or suffixes with a trie. Select operation:',
  [
    branch(
      ['"count"', '"cumulative"', '"map sum"', '"trie ii"', 'frequency / total count'],
      'Prefix Counting',
      'Count how many words match a prefix or get combined prefix value.',
      L.prefixCountingLeaf,
      ['existence check only'],
    ),
    branch(
      ['"camelcase"', '"prefix suffix search"', 'pattern with case / combined key'],
      'Prefix Matching',
      'Match pattern against prefix; may involve compound keys or case rules.',
      L.prefixMatchingLeaf,
    ),
    branch(
      ['"longest common prefix"', '"lcp"', '"shortest common prefix"'],
      'Longest Common Prefix',
      'Find the longest prefix shared by all strings in a set.',
      L.longestCommonPrefixLeaf,
    ),
  ],
)

const autocompleteSystems: TaxonomyNode = decision(
  'autocomplete-step3',
  'Auto-complete Systems — how to suggest completions?',
  'blue',
  3,
  'Suggest words as user types. What kind of suggestions?',
  [
    branch(
      ['"search suggestions"', '"suggested products"', '"type search"'],
      'Basic Auto-complete',
      'Return top K lexicographically smallest completions for a prefix.',
      L.basicAutocompleteLeaf,
      ['frequency / hotness based'],
    ),
    branch(
      ['"design autocomplete"', '"top k"', '"hot"', '"frequency"', '"sentence history"'],
      'Top-K Suggestions',
      'Return suggestions sorted by frequency/hotness, then lexicographic order.',
      L.topkSuggestionsLeaf,
    ),
    branch(
      ['"stream of characters"', '"realtime"', '"live search"', '"query as you type"'],
      'Real-time Search',
      'Maintain state across streamed characters; detect word completions live.',
      L.realtimeSearchLeaf,
    ),
  ],
)

const stringPatternMatching: TaxonomyNode = decision(
  'pattern-matching-step3',
  'String Pattern Matching — how to match patterns?',
  'pink',
  3,
  'Match patterns against strings using tries. Which variant?',
  [
    branch(
      ['"word search ii"', '"multiple patterns"', '"aho-corasick"', 'board / text with many patterns'],
      'Multiple Pattern Search',
      'Search for multiple patterns simultaneously; trie + backtracking on grid.',
      L.multiplePatternSearchLeaf,
    ),
    branch(
      ['"longest word"', '"all prefixes"', '"longest matching"'],
      'Longest Matching Prefix',
      'Find the longest word where every prefix is also valid.',
      L.longestMatchingPrefixLeaf,
    ),
    branch(
      ['"stream of characters"', '"validate"', '"sub-folder"', '"pattern detect"'],
      'Pattern Validation',
      'Validate if a pattern matches; detect sub-strings, sub-folders, or suffix patterns.',
      L.patternValidationLeaf,
    ),
  ],
)

const trieApplications: TaxonomyNode = decision(
  'trie-apps-step2',
  'Trie Applications',
  'blue',
  2,
  'Trie used for practical applications: dictionary, prefix/suffix, auto-complete, pattern matching. Pick ONE:',
  [
    branch(
      ['"dictionary"', '"word lookup"', '"replace words"', '"magic dictionary"', 'word-based dict'],
      '→ Word Dictionary Problems',
      'Dictionary with lookups, wildcards, root replacements, or feature-rich search.',
      wordDictionaryProblems,
      ['prefix/suffix combination'],
    ),
    branch(
      ['"prefix count"', '"suffix"', '"map sum"', '"camelcase"', '"longest common prefix"'],
      '→ Prefix/Suffix Processing',
      'Count, match, or find common prefixes/suffixes using trie.',
      prefixSuffixProcessing,
      ['autocomplete with frequency'],
    ),
    branch(
      ['"autocomplete"', '"suggest"', '"search suggestions"', '"stream"', '"realtime query"'],
      '→ Auto-complete Systems',
      'Suggest completions as user types; frequency-based or lexicographic.',
      autocompleteSystems,
    ),
    branch(
      ['"word search ii"', '"pattern match"', '"validate"', '"aho-corasick"', 'multiple patterns'],
      '→ String Pattern Matching',
      'Match one or more patterns; grid-based search with trie pruning.',
      stringPatternMatching,
      ['basic dictionary lookup'],
    ),
  ],
)

// ── Advanced Trie Structures (step 2) ─────────────────────────────

const advancedTrieStructures: TaxonomyNode = decision(
  'adv-trie-step2',
  'Advanced Trie Structures',
  'purple',
  2,
  'Specialized trie variants: compressed, ternary, suffix, or bit-level. Pick ONE:',
  [
    branch(
      ['"patricia"', '"radix"', '"compressed"', '"compact"', 'merge single-child nodes'],
      '→ Compressed Tries',
      'Merge single-child chains into edges with string labels; PATRICIA / Radix trees.',
      L.compressedTriesLeaf,
    ),
    branch(
      ['"ternary"', '"tst"', '"three-way"', '"left mid right"', 'space-efficient trie'],
      '→ Ternary Search Tries',
      'Three-way branching: left (less), mid (equal), right (greater); memory-efficient.',
      L.ternarySearchTriesLeaf,
    ),
    branch(
      ['"suffix"', '"ukkonen"', '"generalized suffix"', '"all suffixes"', 'string suffix tree'],
      '→ Suffix Tries / Trees',
      'Compressed trie of all suffixes; Ukkonen O(n) construction.',
      L.suffixTriesLeaf,
    ),
    branch(
      ['"xor"', '"binary"', '"bit"', '"max xor"', '"ip routing"', 'bit-level operations'],
      '→ Bit-level Tries',
      'Binary trie on bits; max XOR pair, IP CIDR matching.',
      L.bitLevelTriesLeaf,
    ),
  ],
)

// ── Trie Optimization Techniques (step 2) ─────────────────────────

const trieOptimization: TaxonomyNode = decision(
  'trie-opt-step2',
  'Trie Optimization Techniques',
  'orange',
  2,
  'Optimizing trie performance: space, speed, or hybrid approaches. Pick ONE:',
  [
    branch(
      ['"space"', '"memory"', '"array-based"', '"alphabet reduction"', '"path compression"'],
      '→ Space Optimization',
      'Reduce memory: array vs hash map children, alphabet reduction, path compression.',
      L.spaceOptimizationLeaf,
    ),
    branch(
      ['"isEnd"', '"count"', '"prefixCount"', '"performance"', '"speed"', '"character skipping"'],
      '→ Performance Tuning',
      'Improve speed: terminal marking, count tracking, character skipping.',
      L.performanceTuningLeaf,
    ),
    branch(
      ['"dp"', '"backtracking"', '"hash table"', '"hybrid"', '"string chain"', '"word search"'],
      '→ Hybrid Approaches',
      'Combine trie with DP, backtracking, or hash tables for enhanced capabilities.',
      L.hybridApproachesLeaf,
    ),
  ],
)

// ── Root Decision (step 1) ───────────────────────────────────────

export const trieRoot: TaxonomyNode = decision(
  'trie-root',
  'Trie Pattern',
  'slate',
  1,
  'Trie (prefix tree): efficient string lookup and prefix operations. Which domain?',
  [
    branch(
      ['"trie"', '"prefix tree"', '"insert"', '"search"', '"startsWith"', '"wildcard"', '"erase"', '"traverse"'],
      '→ Basic Trie Operations',
      'Core trie: construction, search, deletion/modification, and traversal.',
      basicTrieOps,
      ['dictionary replacement', 'autocomplete system'],
    ),
    branch(
      ['"dictionary"', '"replace words"', '"autocomplete"', '"suggest"', '"prefix suffix"', '"pattern"', '"search suggestions"'],
      '→ Trie Applications',
      'Practical trie applications: dictionaries, auto-complete, pattern matching.',
      trieApplications,
      ['basic insert/search only'],
    ),
    branch(
      ['"compressed"', '"radix"', '"ternary"', '"suffix tree"', '"binary trie"', '"xor"', '"ukkonen"'],
      '→ Advanced Trie Structures',
      'Specialized trie variants: compressed, ternary, suffix, bit-level.',
      advancedTrieStructures,
      ['standard trie operations'],
    ),
    branch(
      ['"optimize"', '"space"', '"memory"', '"performance"', '"hybrid"', '"array-based"', '"speed"'],
      '→ Trie Optimization Techniques',
      'Optimize trie: space reduction, speed tuning, or hybrid approaches.',
      trieOptimization,
    ),
  ],
)
