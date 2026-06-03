import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  '1d-state-dp': {
    tagline: 'Single state variable — build solutions left to right from previous states.',
    keywords: ['linear sequence', 'decision making', 'fibonacci', 'house robber', 'kadane'],
    budget: ['dp[n]', 'prev state', 'state transition', 'max/min accumulation'],
  },
  'substring-subsequence-dp': {
    tagline: 'Work with portions of sequences — LIS, LCS, edit distance, palindromes.',
    keywords: ['subsequence', 'substring', 'LIS', 'LCS', 'edit distance', 'palindrome'],
    budget: ['2D table', 'matching', 'gap tracking', 'palindrome expansion'],
  },
  '2d-multi-dim-dp': {
    tagline: 'Multiple state variables — grids, intervals, knapsack resource allocation.',
    keywords: ['grid', 'matrix', 'interval', 'knapsack', 'path sum', 'maximal square'],
    budget: ['2D DP', 'interval DP', 'knapsack DP', 'resource constraint'],
  },
  'state-compression-dp': {
    tagline: 'Use bitmasks or subset enumeration to represent state.',
    keywords: ['bitmask', 'subset dp', 'tsp', 'traveling salesman', 'state compression'],
    budget: ['bitmask state', 'enumeration over subsets', 'Held-Karp'],
  },
  'dp-optimization': {
    tagline: 'Reduce memory or time complexity with advanced techniques.',
    keywords: ['space optimization', 'rolling array', 'divide and conquer dp', 'monotonic queue'],
    budget: ['O(1) space', 'D&C DP', 'convex hull trick', 'monotonic queue'],
  },
}
