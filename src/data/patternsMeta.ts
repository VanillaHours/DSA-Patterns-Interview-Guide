import type { PatternMeta } from '../types'
import { twoPointersRoot } from './twoPointers/index'
import { hashMapRoot } from './hashMap/index'
import { stackQueueRoot } from './stackQueue/index'
import { linkedListRoot } from './linkedList/index'
import { sortingRoot } from './sorting/index'
import { prefixSumRoot } from './prefixSum/index'
import { heapRoot } from './heap/index'

const GITHUB =
  'https://github.com/Yassir-aykhlf/DSA-Taxonomies'

const PLACEHOLDER = (n: number, title: string): PatternMeta => ({
  id: `pattern-${n}`,
  title,
  order: n,
  available: false,
  tagline: 'Coming soon — same one-template mind map format.',
})

export const patterns: PatternMeta[] = [
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    order: 1,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/1.%20Two%20Pointers.md`,
    tagline: 'Revision cheatsheet — one template per sub-pattern, 1–2 line changes per problem.',
    root: twoPointersRoot,
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    order: 2,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/4.%20Linked%20List.md`,
    tagline: 'Pointer rewiring, reversal, two-pointer, merge/sort, clone, and cache — one template per sub-pattern.',
    root: linkedListRoot,
  },
  {
    id: 'sorting',
    title: 'Sorting',
    order: 3,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/5.%20Sorting.md`,
    tagline: 'Comparison, non-comparison, partial, subroutine, and advanced — one template per sub-pattern.',
    root: sortingRoot,
  },
  PLACEHOLDER(4, 'Binary Search'),
  PLACEHOLDER(5, 'Sliding Window'),
  {
    id: 'prefix-sum',
    title: 'Prefix Sum',
    order: 6,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/9.%20Prefix%20Sum.md`,
    tagline: '1D/2D prefix sums, subarray hash map, difference array, and advanced — one template per sub-pattern.',
    root: prefixSumRoot,
  },
  {
    id: 'hash-map',
    title: 'Hash Map / Set',
    order: 7,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/2.%20Hash%20Table.md`,
    tagline: 'O(1) lookup, counting, grouping — one template per sub-pattern.',
    root: hashMapRoot,
  },
  {
    id: 'stack-queue',
    title: 'Stack & Queue',
    order: 8,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/3.%20Stack%20%26%20Queue.md`,
    tagline: 'LIFO, FIFO, monotonic, BFS, deque — one template per sub-pattern.',
    root: stackQueueRoot,
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    order: 9,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/8.%20Heap.md`,
    tagline: 'Top-K, Scheduling, Graph (Dijkstra/MST), and Advanced — one template per sub-pattern.',
    root: heapRoot,
  },
  PLACEHOLDER(10, 'Tree Traversal'),
  PLACEHOLDER(11, 'Graph Traversal'),
  PLACEHOLDER(12, 'Dynamic Programming'),
  PLACEHOLDER(13, 'Backtracking'),
  PLACEHOLDER(14, 'Greedy'),
  PLACEHOLDER(15, 'Union Find'),
  PLACEHOLDER(16, 'Trie'),
  PLACEHOLDER(17, 'Bitmask'),
  PLACEHOLDER(18, 'Monotonic Stack'),
  PLACEHOLDER(19, 'Interval'),
  PLACEHOLDER(20, 'Math / Number Theory'),
  PLACEHOLDER(21, 'Bit Manipulation'),
]

export const REPO_URL = GITHUB
