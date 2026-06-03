import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'classic-step2': {
    tagline: 'Classic binary search on sorted array indices',
    keywords: ['exact match', 'first occurrence', 'last occurrence', 'insert position', 'sorted array'],
    budget: ['exactMatch', 'firstLast', 'insertPos', 'sortedInput', 'logN'],
  },
  'modified-step2': {
    tagline: 'Binary search on rotated, mountain, or unknown-size arrays',
    keywords: ['rotated array', 'bitonic', 'mountain', 'peak', 'unknown size', 'infinite'],
    budget: ['rotatedArray', 'mountainArray', 'unknownSize', 'peakElement'],
  },
  'answer-step2': {
    tagline: 'Binary search on the answer space — feasibility via predicate',
    keywords: ['minimize max', 'maximize min', 'feasibility', 'predicate', 'kth smallest'],
    budget: ['minMax', 'maxMin', 'kthSearch', 'feasibility', 'monotonic'],
  },
  'specialized-step2': {
    tagline: 'Matrix search and parallel / multi-constraint binary search',
    keywords: ['2D matrix', 'sorted matrix', 'parallel', 'multi-constraint', 'days'],
    budget: ['matrixSearch', 'parallelBS', 'sortedInput'],
  },
}
