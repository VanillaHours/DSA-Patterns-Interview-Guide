import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'combinatorial-generation': {
    tagline: 'Generate all permutations, subsets, combinations, or string arrangements.',
    keywords: ['subsets', 'combinations', 'permutations', 'string generation', 'partition'],
    budget: ['choose/not-choose', 'swap-based', 'valid prefix check'],
  },
  'constraint-satisfaction': {
    tagline: 'Place items on a board or match patterns subject to constraints.',
    keywords: ['n-queens', 'sudoku', 'word search', 'assignment', 'board filling'],
    budget: ['backtrack with constraint check', 'prune invalid', 'row/col/diag tracking'],
  },
  'graph-exploration': {
    tagline: 'Explore all paths, color graphs, or traverse grids with backtracking.',
    keywords: ['all paths', 'graph coloring', 'bipartite', 'matrix traversal', 'robot clean'],
    budget: ['visited set', 'DFS backtrack', 'path tracking'],
  },
  'optimization-backtrack': {
    tagline: 'Find optimal solution with branch-and-bound or memoized backtracking.',
    keywords: ['branch and bound', 'memoization', 'minimax', 'game theory', 'pruning'],
    budget: ['bound pruning', 'cache states', 'adversarial search'],
  },
}
