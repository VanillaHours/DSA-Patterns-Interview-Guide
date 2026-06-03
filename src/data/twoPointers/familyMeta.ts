import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'opposite-step2': {
    tagline: 'l=0, r=n−1 on sorted or sortable data',
    keywords: ['sorted', 'two sum', 'palindrome', 'maximize area', 'pair from ends'],
    budget: ['sorted', 'opposite', 'targetSum', 'maximize'],
  },
  'same-step2': {
    tagline: 'Both pointers start left — expand, chase, or filter',
    keywords: ['ListNode', 'substring', 'window', 'in-place', 'subsequence'],
    budget: ['listNode', 'contiguous', 'inPlace', 'o1Space'],
  },
  'partition-step2': {
    tagline: 'Rearrange into groups in one pass',
    keywords: ['0,1,2', 'kth largest', 'pivot', 'partition'],
    budget: ['values012', 'inPlace', 'kth'],
  },
  'struct-step2': {
    tagline: 'One index per input — merge, intersect, compare',
    keywords: ['merge', 'intersection', 'two sorted', 'compare strings'],
    budget: ['twoInputs', 'sorted'],
  },
}
