import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'core-manip-step2': {
    tagline: 'Basic traversal, insertion, deletion, and reordering of list nodes',
    keywords: ['traversal', 'cleanup', 'insert', 'delete', 'reorder', 'rotate', 'swap'],
    budget: ['traversal', 'deletion', 'insertion', 'reorder'],
  },
  'reversal-step2': {
    tagline: 'Reverse entire list, sublists, or swap positions using pointer rewiring',
    keywords: ['reverse', 'sublist', 'k-group', 'swap nodes'],
    budget: ['reversal', 'inPlace'],
  },
  'two-pointer-step2': {
    tagline: 'Fast/slow, offset pointers, and palindrome symmetry detection',
    keywords: ['cycle', 'middle', 'nth from end', 'palindrome', 'fast slow'],
    budget: ['fastSlow', 'cycleDetect', 'relativePos', 'palindrome'],
  },
  'merge-part-step2': {
    tagline: 'Merge sorted lists, partition by value, and split into parts',
    keywords: ['merge', 'sorted', 'partition', 'split', 'divide'],
    budget: ['merge', 'partition'],
  },
  'sorting-step2': {
    tagline: 'Sort an unsorted linked list in O(n log n) time and O(1) space',
    keywords: ['sort', 'merge sort', 'insertion sort', 'odd even'],
    budget: ['sort', 'inPlace'],
  },
  'clone-step2': {
    tagline: 'Deep copy a linked list with arbitrary (random) pointers',
    keywords: ['clone', 'deep copy', 'random pointer'],
    budget: ['clone', 'inPlace'],
  },
  'struct-variants-step2': {
    tagline: 'Handle doubly-linked, multi-level, and circular list variants',
    keywords: ['doubly', 'multi-level', 'circular', 'flatten'],
    budget: ['doubly', 'circular'],
  },
  'list-backed-step2': {
    tagline: 'Design data structures using linked list as the backing store',
    keywords: ['cache', 'LRU', 'LFU', 'min stack', 'circular queue'],
    budget: ['cache'],
  },
}
