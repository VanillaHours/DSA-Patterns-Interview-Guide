import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'cacheDesign', label: 'Cache / eviction policy (LRU, LFU, TTL)', group: 'structure' },
  { id: 'hashDesign', label: 'Custom hash table / set / random access', group: 'structure' },
  { id: 'collectionDesign', label: 'Specialized collections (stack, queue, priority)', group: 'structure' },
  { id: 'treeDesign', label: 'Tree / trie / BST design', group: 'structure' },
  { id: 'graphDesign', label: 'Graph representation (adj list/matrix)', group: 'structure' },
  { id: 'searchIndex', label: 'Search / autocomplete / sparse vector', group: 'structure' },
  { id: 'fileSystem', label: 'File system / directory hierarchy', group: 'structure' },
  { id: 'rateLimiter', label: 'Rate limiter / hit counter / logger', group: 'goal' },
  { id: 'memoryMgmt', label: 'Memory / pool allocator / connection pool', group: 'structure' },
  { id: 'reservation', label: 'Calendar / booking / scheduling system', group: 'goal' },
  { id: 'gameDesign', label: 'Game / tic-tac-toe / snake / underground', group: 'goal' },
  { id: 'uiNavigation', label: 'UI / browser history / navigation', group: 'goal' },
  { id: 'creationalPattern', label: 'Creational design pattern (factory, singleton, builder)', group: 'structure' },
  { id: 'structuralPattern', label: 'Structural design pattern (adapter, decorator, composite)', group: 'structure' },
  { id: 'behavioralPattern', label: 'Behavioral design pattern (iterator, observer, strategy)', group: 'structure' },
  { id: 'oopDesign', label: 'OOP / class design / interface design', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
