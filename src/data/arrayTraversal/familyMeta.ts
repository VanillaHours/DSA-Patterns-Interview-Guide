import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'linear-scanning': {
    tagline: 'Single pass or coordinated indices — one-pass, two-pointer, or sliding window',
    keywords: ['subarray', 'contiguous', 'in-place', 'scan', 'window'],
    budget: ['onePass', 'twoPointer', 'slidingWindow', 'contiguous'],
  },
  'binary-search-traversal': {
    tagline: 'Halve the search space — classic BS, rotated, or predicate on answer space',
    keywords: ['sorted', 'binary search', 'rotated', 'answer space', 'predicate'],
    budget: ['binarySearch', 'sorted', 'rotated', 'answerSpace'],
  },
  'multi-dim-traversal': {
    tagline: '2D / multidimensional — nested loops, coordinated marking, or jump patterns',
    keywords: ['matrix', '2D', 'transpose', 'set zeroes', 'jump game'],
    budget: ['multiDim', 'jump', 'enumerate'],
  },
}
