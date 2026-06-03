import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Sub-decisions under Direct Lookup ─────────────────────────────

const existenceNode: TaxonomyNode = decision(
  'existence-step3',
  'Existence & Membership — what are you checking?',
  'blue',
  3,
  'You need to check if something exists or compare frequencies:',
  [
    branch(
      [
        '"contains duplicate" / "appears at least twice"',
        'check if element already seen in array',
        'LC 217, 219 (index gap constraint)',
      ],
      'Element Presence',
      'Set for existence, map for index tracking.',
      L.elementPresenceLeaf,
      ['anagram comparison'],
    ),
    branch(
      [
        '"anagram" / same letters rearranged',
        '"ransom note" from magazine letters',
        'LC 242, 383, 49',
      ],
      'Character Frequency',
      'Count chars in first, decrement from second.',
      L.charFreqLeaf,
      ['exact pair sum', 'top K frequency'],
    ),
  ],
)

const countingNode: TaxonomyNode = decision(
  'counting-step3',
  'Counting & Frequency — extract by occurrence count?',
  'teal',
  3,
  'You have frequency data — are you extracting top-K or finding majority?',
  [
    branch(
      [
        '"top k most frequent" / "sort by frequency"',
        '"k most frequent elements" / "kth frequent"',
        'LC 347, 451',
      ],
      'Frequency Bucketing',
      'Freq map → bucket sort by count.',
      L.freqBucketingLeaf,
      ['majority element', 'single element count'],
    ),
    branch(
      [
        '"majority element" / appears more than n/2 or n/3',
        '"find element with count > threshold"',
        'LC 169, 229',
      ],
      'Heavy Hitters',
      'Boyer-Moore voting — cancel pairs.',
      L.heavyHittersLeaf,
      ['top K sorted by frequency'],
    ),
  ],
)

const pairNode: TaxonomyNode = decision(
  'pair-step3',
  'Pair Matching — sum or property?',
  'blue',
  3,
  'Unsorted input, find pairs by sum or property:',
  [
    branch(
      [
        '"two sum" / complement pairs',
        '"subarray sum equals k" / prefix sum',
        '"continuous subarray sum" multiple of k',
        'LC 1, 560, 523',
      ],
      'Sum-Based Matching',
      'Complement map or prefix sum map.',
      L.sumBasedLeaf,
      ['sorted input → two pointers', 'difference k pairs'],
    ),
    branch(
      [
        '"pairs with difference k" / "k-diff"',
        '"absolute difference k" count pairs',
        'LC 532, 2006',
      ],
      'Property-Based Matching',
      'Freq map, count x and x+k combinations.',
      L.propertyMatchLeaf,
      ['exact sum target', 'palindrome check'],
    ),
  ],
)

const directNode: TaxonomyNode = decision(
  'direct-step2',
  'Direct Lookup — what type of access?',
  'blue',
  2,
  'Hash map for O(1) access — existence, counting, or pair matching. Which fits?',
  [
    branch(
      [
        '"contains duplicate" / "contains" / "seen before"',
        '"anagram" / "same characters" / character frequency',
        'check if element exists in set',
      ],
      'Existence & Membership',
      'Set for presence; freq array/map for char comparison.',
      existenceNode,
      ['top K frequent elements'],
    ),
    branch(
      [
        '"top k frequent" / "most frequent"',
        '"majority element" / "heavy hitters"',
        'sort by frequency',
      ],
      'Counting & Frequency',
      'Freq map as primary structure; bucket sort or Boyer-Moore.',
      countingNode,
      ['plain existence check'],
    ),
    branch(
      [
        '"two sum" (unsorted) / complement lookup',
        '"subarray sum equals k" / prefix sum',
        '"pairs with difference k"',
      ],
      'Pair Matching',
      'Complement lookup or prefix sum map.',
      pairNode,
      ['sorted array + two sum', 'sorted + palindrome'],
    ),
  ],
)

// ── Bijection ─────────────────────────────────────────────────────

const bijectionNode: TaxonomyNode = decision(
  'bijection-step2',
  'Bijection & Mapping Integrity',
  'teal',
  2,
  'One-to-one mapping between two data sets. Read the mapping rule:',
  [
    branch(
      [
        '"isomorphic" / one-to-one character mapping',
        '"word pattern" / pattern to string bijection',
        '"strobogrammatic" / digit rotation symmetry',
        'LC 205, 290, 246',
      ],
      'Bijection & Mapping Integrity',
      'Dual maps (s→t and t→s) enforce bijection.',
      L.bijectionLeaf,
      ['contains duplicate', 'group anagrams'],
    ),
  ],
)

// ── Hash Map for Structure ────────────────────────────────────────

const structureNode: TaxonomyNode = decision(
  'structure-step2',
  'Hash Map for Structure — grouping, prefix, or multi-map?',
  'green',
  2,
  'Hash map to build ordered/structural relationships:',
  [
    branch(
      [
        '"group anagrams" / "group shifted strings"',
        '"group people by group size" / classification',
        'LC 49, 249, 1282',
      ],
      'Grouping & Classification',
      'Normalized form as key, list of items as value.',
      L.groupingLeaf,
      ['frequency counting'],
    ),
    branch(
      [
        '"subarray sum equals k" (prefix)',
        '"contiguous array" with equal 0/1',
        '"count nice subarrays" with k odds',
        'LC 560, 525, 1248',
      ],
      'Prefix Sums with Hash Map',
      'Running total + map for O(n) subarray queries.',
      L.prefixSumLeaf,
      ['two sum basic', 'exact pair matching'],
    ),
    branch(
      [
        '"subdomain visit count" / accumulate subdomains',
        '"time-based key-value store" / timestamp queries',
        '"analyze user website patterns"',
        'LC 811, 981, 1152',
      ],
      'Multi-Map Applications',
      'Map to vector or accumulator with search logic.',
      L.multiMapLeaf,
    ),
  ],
)

// ── Index as Hash Key ─────────────────────────────────────────────

const indexNode: TaxonomyNode = decision(
  'index-step2',
  'Index as Hash Key',
  'amber',
  2,
  'O(1) space auxiliary — array index doubles as hash slot:',
  [
    branch(
      [
        '"longest consecutive sequence" O(n)',
        '"first missing positive" O(1) space',
        '"find all duplicates" without extra space',
        'LC 128, 41, 442',
      ],
      'Index as Hash Key',
      'Swap to correct index, negate, or set-based run detection.',
      L.indexHashLeaf,
      ['hash map with extra space allowed', 'sorting allowed'],
    ),
  ],
)

// ── Specialized Hash Structures ───────────────────────────────────

const specializedNode: TaxonomyNode = decision(
  'specialized-step2',
  'Specialized Hash Structures — design problem?',
  'purple',
  2,
  'Design a data structure backed by hash maps:',
  [
    branch(
      [
        '"LRU cache" / evict least recently used',
        '"LFU cache" / evict least frequently used',
        'LC 146, 460',
      ],
      'LRU & LFU Caches',
      'Doubly-linked list + map for O(1) get/put.',
      L.lruCacheLeaf,
      ['trie-based dictionary'],
    ),
    branch(
      [
        '"design hash map" / "design hash set"',
        'implement from scratch without built-in libs',
        'LC 705, 706',
      ],
      'Design HashMap / HashSet',
      'Bucket array with chaining.',
      L.designHashMapLeaf,
      ['LRU cache with ordering'],
    ),
    branch(
      [
        '"design in-memory file system"',
        '"add and search word" with wildcard .',
        'LC 588, 211',
      ],
      'Specialized Dictionaries',
      'Trie or map-based tree structure.',
      L.specializedDictLeaf,
    ),
  ],
)

// ── Multi-Pass Hashing ────────────────────────────────────────────

const multiPassNode: TaxonomyNode = decision(
  'multipass-step2',
  'Multi-Pass Hashing — two-pass algorithm?',
  'orange',
  2,
  'Multiple passes over data, building hash map state between passes:',
  [
    branch(
      [
        '"repeated DNA sequences" / 10-letter substrings',
        '"copy list with random pointer" / deep copy',
        '"clone graph" / deep copy with neighbors',
        'LC 187, 138, 133',
      ],
      'Multi-Pass Hashing',
      'Pass 1: build map. Pass 2: wire connections via map.',
      L.multiPassLeaf,
      ['single pass algorithm', 'in-place modification'],
    ),
  ],
)

// ── String Hashing ────────────────────────────────────────────────

const stringNode: TaxonomyNode = decision(
  'string-step2',
  'String Hashing — which technique?',
  'pink',
  2,
  'String-specific hashing: rolling hash, signatures, or patterns:',
  [
    branch(
      [
        '"find substring" / Rabin-Karp',
        '"longest duplicate substring" / rolling hash',
        '"maximum length of repeated subarray"',
        'LC 28, 1044, 718',
      ],
      'Rolling Hash',
      'Window hash O(1) slide; binary search for longest.',
      L.rollingHashLeaf,
      ['anagram detection (signature)'],
    ),
    branch(
      [
        '"valid anagram" / "group anagrams" by signature',
        '"find all anagrams" in a string',
        'LC 242, 49, 438',
      ],
      'Character Signatures',
      'Freq array of 26 as hash key.',
      L.charSigLeaf,
      ['rolling hash substring'],
    ),
    branch(
      [
        '"number of atoms" / chemical formula parsing',
        '"vowel spellchecker" / normalization maps',
        '"repeated DNA" / pattern frequency',
        'LC 726, 966, 187',
      ],
      'Pattern Hashing',
      'Stack of maps, multi-map normalization, or substring freq.',
      L.patternHashLeaf,
    ),
  ],
)

// ── Root ──────────────────────────────────────────────────────────

export const hashMapRoot: TaxonomyNode = decision(
  'ht-root',
  'Hash Map / Set',
  'slate',
  1,
  'Before coding: does the problem need fast access without sorting? Which box below matches?',
  [
    branch(
      [
        '"contains duplicate" / check element exists',
        '"anagram" / character frequency comparison',
        '"two sum" on unsorted input / complement lookup',
        '"top k frequent" / frequency bucketing',
      ],
      '→ Direct Lookup',
      'Fast existence, counting, or pair matching.',
      directNode,
      ['bijection one-to-one', 'prefix sum subarray', 'design cache'],
    ),
    branch(
      [
        '"isomorphic" / one-to-one character mapping',
        '"word pattern" / pattern to string mapping',
        'bijection / two-way mapping integrity',
      ],
      '→ Bijection & Mapping Integrity',
      'Dual maps enforce strict one-to-one mapping.',
      bijectionNode,
      ['simple frequency count', 'group anagrams'],
    ),
    branch(
      [
        '"group anagrams" / classify by normalized key',
        '"subarray sum equals k" / prefix sum map',
        '"time-based key-value store" / multi-map',
        'LC 560 prefix sum family',
      ],
      '→ Hash Map for Structure',
      'Grouping, prefix sum, or multi-map relationships.',
      structureNode,
      ['two sum simple pair', 'existence check only'],
    ),
    branch(
      [
        '"first missing positive" / O(1) space only',
        '"longest consecutive sequence" in O(n)',
        '"find all duplicates" no extra memory',
      ],
      '→ Index as Hash Key',
      'Array index doubles as hash slot — no extra map.',
      indexNode,
      ['hash map with O(n) space allowed'],
    ),
    branch(
      [
        '"LRU cache" / "LFU cache" design',
        '"design hash map" from scratch',
        '"add and search word" with wildcard',
      ],
      '→ Specialized Hash Structures',
      'Design data structure with hash internals.',
      specializedNode,
      ['standard problem solving (non-design)'],
    ),
    branch(
      [
        '"copy list with random pointer" / deep copy',
        '"clone graph" / DFS with cache',
        '"repeated DNA" / multi-pass substring set',
      ],
      '→ Multi-Pass Hashing',
      'Build map in pass 1, use in pass 2.',
      multiPassNode,
      ['single pass enough'],
    ),
    branch(
      [
        '"finding substring" / Rabin-Karp / rolling hash',
        '"group anagrams by signature" / freq key',
        '"chemical formula" / stack of atom maps',
        'string-based hashing techniques',
      ],
      '→ String Hashing',
      'Rolling hash, character signatures, or pattern maps.',
      stringNode,
      ['numeric array (non-string) problem'],
    ),
  ],
  {
    explanation:
      'Do not pick by topic name — match the highlighted constraints in the prompt. Hash map fits unsorted data needing fast lookup; for sorted arrays prefer two pointers.',
  },
)
