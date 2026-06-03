import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Core Manipulation ─────────────────────────────────────────────

const traversalNode: TaxonomyNode = decision(
  'traversal-step3',
  'Traversal & Cleanup — simple iteration or deletion?',
  'blue',
  3,
  'Walk the list with prev/cur pointers:',
  [
    branch(
      [
        '"remove linked list elements" by value',
        '"delete node" given only that node ptr',
        'LC 203, 237',
      ],
      'Cleanup',
      'Dummy node + prev/cur; skip cur on match.',
      L.traversalCleanupLeaf,
      ['swap/rotate/reorder'],
    ),
    branch(
      [
        'swap nodes in pairs',
        'rotate list by k',
        'reorder list L0→Ln→L1→Ln-1...',
        'LC 24, 61, 143',
      ],
      'Reordering',
      'Dummy + pointer rewiring for swaps/rotations.',
      L.reorderingLeaf,
      ['simple removal only'],
    ),
  ],
)

const coreManipNode: TaxonomyNode = decision(
  'core-manip-step2',
  'Core Manipulation — traverse, insert/delete, or reorder?',
  'blue',
  2,
  'Basic pointer operations on singly linked lists:',
  [
    branch(
      [
        '"remove linked list elements" / "delete node"',
        'traverse and clean up by value',
        'LC 203, 237',
      ],
      'Traversal & Cleanup',
      'Standard prev/cur/dummy walk through the list.',
      traversalNode,
      ['insertion/deletion at position', 'reorder/rotate'],
    ),
    branch(
      [
        '"design linked list" / get/addAt/deleteAt',
        '"delete N nodes after M nodes"',
        '"merge in between" two lists',
        'LC 707, 1474, 1669',
      ],
      'Insertion & Deletion',
      'Size tracking + indexed access; dummy simplifies head ops.',
      L.insertionDeletionLeaf,
      ['simple traversal / cleanup', 'reordering without positional insert'],
    ),
    branch(
      [
        '"swap nodes in pairs"',
        '"rotate list" by k',
        '"reorder list" interleaving halves',
        'LC 24, 61, 143',
      ],
      'Reordering',
      'Fix prev→next, node A→next = B→next, B→next = A.',
      L.reorderingLeaf,
      ['straight traversal'],
    ),
  ],
)

// ── Reversal Patterns ─────────────────────────────────────────────

const reversalNode: TaxonomyNode = decision(
  'reversal-step2',
  'Reversal Patterns — whole list, sublist, or position swap?',
  'green',
  2,
  'Reverse pointers to change list order:',
  [
    branch(
      [
        '"reverse linked list" entirely',
        'LC 206',
      ],
      'Whole List',
      'Triple pointer (prev/cur/next); prev becomes new head.',
      L.wholeReverseLeaf,
      ['partial / sublist reverse'],
    ),
    branch(
      [
        '"reverse linked list II" (range [l,r])',
        '"reverse nodes in k-group"',
        '"reverse even length groups"',
        'LC 92, 25, 2074',
      ],
      'Sublist Reversal',
      'Prev stays fixed before range; cur moves; t = cur->next inserted after prev.',
      L.sublistReverseLeaf,
      ['full list reversal'],
    ),
    branch(
      [
        '"swap nodes" kth from start with kth from end',
        'LC 1721',
      ],
      'Position Swaps',
      'Move first to k, then offset second from start; advance both.',
      L.positionSwapLeaf,
      ['full reversal'],
    ),
  ],
)

// ── Two-Pointer Strategies ───────────────────────────────────────

const twoPointerNode: TaxonomyNode = decision(
  'two-pointer-step2',
  'Two-Pointer Strategies — cycle, offset, or palindrome?',
  'purple',
  2,
  'Two pointers moving at different speeds or positions:',
  [
    branch(
      [
        '"linked list cycle" detection',
        '"cycle II" return entry node',
        '"middle of linked list"',
        'LC 141, 142, 876',
      ],
      'Fast & Slow Detection',
      'Fast 2x, slow 1x; meet point = cycle exists. Reset for entry.',
      L.fastSlowLeaf,
      ['offset by N positions'],
    ),
    branch(
      [
        '"remove nth node from end"',
        '"delete middle node"',
        'LC 19, 2095',
      ],
      'Relative Positioning',
      'Offset pointer: advance fast N steps ahead, then both 1x.',
      L.relativePosLeaf,
      ['cycle detection'],
    ),
    branch(
      [
        '"palindrome linked list"',
        'LC 234',
      ],
      'Palindrome & Symmetry',
      'Find mid (fast/slow), reverse second half, compare.',
      L.palindromeLeaf,
      ['cycle detection', 'offset by N'],
    ),
  ],
)

// ── Merge & Partition ─────────────────────────────────────────────

const mergePartNode: TaxonomyNode = decision(
  'merge-part-step2',
  'Merge & Partition — merge sorted lists or partition/ split?',
  'amber',
  2,
  'Combine or divide lists by value:',
  [
    branch(
      [
        '"merge two sorted lists"',
        '"merge k sorted lists"',
        '"merge in between linked lists"',
        'LC 21, 23, 1669',
      ],
      'Merge Operations',
      'Dummy + compare heads. K lists: min-heap.',
      L.mergeOpsLeaf,
      ['partition by value'],
    ),
    branch(
      [
        '"partition list" around value x',
        '"split linked list in parts"',
        'LC 86, 725',
      ],
      'Partition & Split',
      'Two dummy chains (less / ge) or compute part sizes & cut.',
      L.partitionSplitLeaf,
      ['merge sorted lists'],
    ),
  ],
)

// ── Sorting & Ordering ────────────────────────────────────────────

const sortingNode: TaxonomyNode = decision(
  'sorting-step2',
  'Sorting & Ordering',
  'orange',
  2,
  'Sort an unsorted linked list or rearrange by position:',
  [
    branch(
      [
        '"sort list" (unsorted, O(n log n))',
        '"insertion sort list"',
        '"odd even linked list"',
        'LC 148, 147, 328',
      ],
      'Sorting & Ordering',
      'Merge sort (mid + merge) or insertion sort (dummy + scan).',
      L.sortingLeaf,
    ),
  ],
)

// ── Copying & Cloning ─────────────────────────────────────────────

const cloneNode: TaxonomyNode = decision(
  'clone-step2',
  'Copying & Cloning',
  'lime',
  2,
  'Deep copy a linked list with arbitrary / random pointers:',
  [
    branch(
      [
        '"copy list with random pointer"',
        'deep copy with next + random',
        'LC 138',
      ],
      'Copying & Cloning',
      'Three-pass interleave: copy nodes, wire random, restore + extract.',
      L.cloneLeaf,
    ),
  ],
)

// ── Structural Variants ───────────────────────────────────────────

const structVariantNode: TaxonomyNode = decision(
  'struct-variants-step2',
  'Structural Variants — doubly linked or circular?',
  'blue',
  2,
  'Special list structures with additional links or cycle properties:',
  [
    branch(
      [
        '"flatten multilevel doubly linked list"',
        '"design browser history"',
        'LC 430, 1472',
      ],
      'Doubly Linked Lists',
      'DFS flatten for child pointers; DLL for navigation history.',
      L.doublyLeaf,
      ['circular list insertion'],
    ),
    branch(
      [
        '"insert into sorted circular linked list"',
        '"find winner of circular game"',
        'LC 708, 1823',
      ],
      'Circular Linked Lists',
      'Traverse until back to head; find insertion point by value.',
      L.circularLeaf,
      ['doubly linked', 'simple traversal'],
    ),
  ],
)

// ── List-Backed Data Structures ───────────────────────────────────

const listBackedNode: TaxonomyNode = decision(
  'list-backed-step2',
  'List-Backed Data Structures — stack/queue or cache?',
  'pink',
  2,
  'Use linked list as underlying storage for abstract data types:',
  [
    branch(
      [
        '"min stack" or "max stack" design',
        '"design circular queue"',
        'LC 155, 622',
      ],
      'Stack & Queue Implementations',
      'Stack: pair (val, min). Queue: circular buffer or DLL.',
      L.minStackLeaf,
      ['LRU / LFU cache'],
    ),
    branch(
      [
        '"LRU cache" design',
        '"LFU cache" design',
        'LC 146, 460',
      ],
      'Cache Strategies',
      'DLL (LRU order) + hash map (O(1) access). LFU: + freq map.',
      L.cacheLeaf,
      ['min stack / circular queue'],
    ),
  ],
)

// ── Root ──────────────────────────────────────────────────────────

export const linkedListRoot: TaxonomyNode = decision(
  'll-root',
  'Linked List',
  'slate',
  1,
  'Before coding: what kind of list operation — manipulation, reversal, two-pointer, merge/sort, clone, variant, or list-backed design?',
  [
    branch(
      [
        '"remove elements" / "delete node"',
        '"design linked list" / addAt/deleteAt',
        '"swap pairs" / "rotate" / "reorder"',
      ],
      '→ Core Manipulation',
      'Basic traversal, insertion, deletion, and reordering.',
      coreManipNode,
      ['reversal', 'fast/slow', 'merge'],
    ),
    branch(
      [
        '"reverse linked list" (whole or sublist)',
        '"reverse k-group" / "swap nodes" (kth)',
      ],
      '→ Reversal Patterns',
      'Reverse entire list, sublist, or swap positions.',
      reversalNode,
      ['simple deletion', 'sorting'],
    ),
    branch(
      [
        '"linked list cycle" / cycle entry',
        '"middle of linked list"',
        '"remove nth from end"',
        '"palindrome linked list"',
      ],
      '→ Two-Pointer Strategies',
      'Fast/slow, offset, or two-end pointers.',
      twoPointerNode,
      ['merge / partition', 'sorting'],
    ),
    branch(
      [
        '"merge two sorted lists" / "merge k sorted"',
        '"partition list" around x',
        '"split linked list in parts"',
      ],
      '→ Merge & Partition',
      'Combine sorted lists or divide by value/position.',
      mergePartNode,
      ['two-pointer / cycle', 'sorting unsorted'],
    ),
    branch(
      [
        '"sort list" (unsorted)',
        '"insertion sort list"',
        '"odd even linked list"',
      ],
      '→ Sorting & Ordering',
      'Sort unsorted list with merge sort or rearrange by position.',
      sortingNode,
      ['simple traversal', 'merge sorted only'],
    ),
    branch(
      [
        '"copy list with random pointer"',
        'deep copy / clone with arbitrary ptrs',
      ],
      '→ Copying & Cloning',
      'Three-pass interleave for O(1) space deep copy.',
      cloneNode,
      ['simple traversal'],
    ),
    branch(
      [
        '"flatten multilevel doubly linked list"',
        '"insert into sorted circular list"',
        '"design browser history"',
      ],
      '→ Structural Variants',
      'Doubly-linked, multi-level, or circular variants.',
      structVariantNode,
      ['standard singly linked'],
    ),
    branch(
      [
        '"LRU cache" / "LFU cache" design',
        '"min stack" / "circular queue" design',
      ],
      '→ List-Backed Data Structures',
      'Linked list as backing storage for ADTs and caches.',
      listBackedNode,
      ['standard algorithm'],
    ),
  ],
  {
    explanation:
      'Identify the operation: traversal/manipulation, reversal patterns, two-pointer strategies, merge/partition, sorting, cloning, structural variants, or list-backed design. Each branch owns a specific pointer technique.',
  },
)
