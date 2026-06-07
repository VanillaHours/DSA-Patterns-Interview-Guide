import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'data-structure-design': {
    tagline: 'Custom data structures: caches, hash structures, advanced collections, trees, graphs.',
    keywords: ['cache', 'lru', 'lfu', 'hashmap', 'hashset', 'trie', 'bst', 'stack', 'queue', 'graph', 'search'],
    budget: ['cache', 'hash', 'collections', 'tree-graph'],
  },
  'system-design-components': {
    tagline: 'Building blocks: file system, rate limiters, memory management, business logic.',
    keywords: ['file system', 'rate limiter', 'memory pool', 'calendar', 'booking', 'game', 'parking'],
    budget: ['file system', 'rate limiter', 'memory', 'business logic'],
  },
  'ui-components': {
    tagline: 'User interface interactions: navigation, text editors, autocomplete.',
    keywords: ['browser history', 'navigation', 'autocomplete', 'typeahead', 'text editor'],
    budget: ['navigation', 'editor', 'autocomplete'],
  },
  'design-patterns-principles': {
    tagline: 'GOF design patterns: creational, structural, and behavioral.',
    keywords: ['factory', 'singleton', 'builder', 'adapter', 'decorator', 'composite', 'iterator', 'observer', 'strategy'],
    budget: ['creational', 'structural', 'behavioral'],
  },
}
