import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'direct-step2': {
    tagline: 'Hash map for O(1) existence, counting, or matching',
    keywords: ['contains', 'frequency', 'two sum', 'complement', 'count'],
    budget: ['unsorted', 'frequency', 'complement', 'targetSum'],
  },
  'bijection-step2': {
    tagline: 'One-to-one mapping between two data sets',
    keywords: ['isomorphic', 'bijection', 'one-to-one', 'mapping'],
    budget: ['bijection', 'stringInput'],
  },
  'structure-step2': {
    tagline: 'Hash map for grouping, prefix sums, or multi-map structures',
    keywords: ['group', 'classify', 'prefix sum', 'key-value', 'multi-map'],
    budget: ['grouping', 'prefixSum', 'enumerate'],
  },
  'index-step2': {
    tagline: 'Array index as hash key — O(1) space hash',
    keywords: ['index hashing', 'in-place', 'O(1) space', 'constant space'],
    budget: ['o1Space', 'unsorted'],
  },
  'specialized-step2': {
    tagline: 'Design data structures with hash map internals',
    keywords: ['LRU', 'LFU', 'design', 'cache', 'HashMap'],
    budget: ['cache', 'listNode'],
  },
  'multipass-step2': {
    tagline: 'Two or more passes over data with hash map state',
    keywords: ['multi-pass', 'clone', 'serialize', 'repeated'],
    budget: ['frequency', 'listNode', 'oNTime'],
  },
  'string-step2': {
    tagline: 'String-specific hashing — rolling hash, signatures, patterns',
    keywords: ['rolling hash', 'anagram', 'signature', 'substring', 'pattern'],
    budget: ['rollingHash', 'stringInput', 'frequency'],
  },
}
