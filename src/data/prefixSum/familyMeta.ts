import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  '1d-range-step2': {
    tagline: 'Basic 1D prefix sum — range queries, equilibrium, and prefix product',
    keywords: ['range sum', 'running sum', 'prefix product', 'pivot', 'equilibrium'],
    budget: ['rangeSum', 'prefixSum', 'equilibrium', 'prefixProduct'],
  },
  'subarray-map-step2': {
    tagline: 'Subarray sum problems solved with prefix sum + hash map',
    keywords: ['subarray sum', 'hash map', 'target', 'longest', 'nice array', 'balanced'],
    budget: ['subarraySum', 'prefixMap', 'kadane', 'remainder', 'binarySubarray'],
  },
  '2d-prefix-step2': {
    tagline: '2D prefix sum for rectangle queries, submatrix target, and square counting',
    keywords: ['2D', 'rectangle sum', 'matrix block', 'submatrix', 'square'],
    budget: ['rectSum', 'submatrix', 'countSquares'],
  },
  'diff-array-step2': {
    tagline: 'Difference array for range updates and line sweep',
    keywords: ['difference array', 'range update', 'line sweep', 'car pooling', 'skyline'],
    budget: ['diffArray', 'lineSweep'],
  },
  'advanced-prefix-step2': {
    tagline: 'Prefix XOR, GCD, min/max — non-additive prefix operations',
    keywords: ['prefix XOR', 'prefix min', 'prefix max', 'prefix gcd'],
    budget: ['prefixXor', 'prefixMinMax'],
  },
}
