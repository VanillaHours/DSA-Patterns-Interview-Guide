import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'classic-dc': {
    tagline: 'Core D&C: sorting, binary search, selection, mathematical algorithms.',
    keywords: ['merge sort', 'quick sort', 'binary search', 'quickselect', 'pow', 'matrix'],
    budget: ['sorting', 'binarySearch', 'selection', 'mathDc'],
  },
  'array-string-dc': {
    tagline: 'D&C on arrays and strings: subarray, palindrome, range queries, geometry.',
    keywords: ['maximum subarray', 'reverse pairs', 'palindrome', 'segment tree', 'BIT', 'closest pair', 'convex hull', 'intersection', 'string matching'],
    budget: ['subarray', 'stringManip', 'rangeQuery', 'geometry'],
  },
  'tree-graph-dc': {
    tagline: 'D&C on trees and graphs: construction, properties, LCA, connectivity, parallel.',
    keywords: ['tree construction', 'tree property', 'lca', 'bst', 'segment tree', 'centroid', 'graph connectivity', 'johnson', 'dp optimization', 'map reduce', 'parallel sort'],
    budget: ['treeProblems', 'graphAlgos', 'parallelComputing'],
  },
}
