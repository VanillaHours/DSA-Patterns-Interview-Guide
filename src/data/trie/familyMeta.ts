import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'basic-trie-ops': {
    tagline: 'Core trie construction, search, deletion, and traversal operations.',
    keywords: ['trie', 'insert', 'search', 'startsWith', 'delete', 'traverse', 'wildcard'],
    budget: ['insert', 'search', 'prefixSearch', 'dfs', 'bfs'],
  },
  'trie-apps': {
    tagline: 'Dictionary, prefix/suffix processing, auto-complete, and pattern matching.',
    keywords: ['dictionary', 'prefix', 'suffix', 'autocomplete', 'pattern', 'replacement'],
    budget: ['wordDict', 'prefixCount', 'autocomplete', 'patternMatch'],
  },
  'adv-trie': {
    tagline: 'Compressed, ternary, suffix, and bit-level trie variants.',
    keywords: ['compressed', 'radix', 'ternary', 'suffix', 'binary trie', 'xor'],
    budget: ['radix', 'ternary', 'suffix', 'binaryTrie'],
  },
  'trie-opt': {
    tagline: 'Space optimization, performance tuning, and hybrid approaches.',
    keywords: ['space', 'memory', 'performance', 'hybrid', 'array-based', 'compression'],
    budget: ['spaceOpt', 'perfTuning', 'hybrid'],
  },
}
