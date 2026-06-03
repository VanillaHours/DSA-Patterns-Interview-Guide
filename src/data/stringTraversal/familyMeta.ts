import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'linear-str': {
    tagline: 'Left-to-right scan, window, or pattern match on a single string',
    keywords: ['palindrome', 'substring', 'sliding window', 'KMP', 'character compare'],
    budget: ['string', 'contiguous', 'maximize', 'minimize'],
  },
  'recursive-str': {
    tagline: 'Recursive exploration — generate strings or decompose at split points',
    keywords: ['backtracking', 'generate', 'partition', 'combinations', 'parentheses'],
    budget: ['string', 'recursive', 'enumerate'],
  },
  'trie-str': {
    tagline: 'Trie navigation for prefix queries and dictionary-backed traversal',
    keywords: ['trie', 'prefix', 'dictionary', 'word search', 'startsWith'],
    budget: ['string', 'trie', 'dictionary', 'prefixQuery'],
  },
}
