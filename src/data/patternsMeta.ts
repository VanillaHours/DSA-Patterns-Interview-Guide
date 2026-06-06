import type { PatternMeta } from '../types'
import { twoPointersRoot } from './twoPointers/index'
import { hashMapRoot } from './hashMap/index'
import { stackQueueRoot } from './stackQueue/index'
import { linkedListRoot } from './linkedList/index'
import { sortingRoot } from './sorting/index'
import { prefixSumRoot } from './prefixSum/index'
import { heapRoot } from './heap/index'
import { bsRoot } from './binarySearch/index'
import { ttRoot } from './treeTraversal/index'
import { graphRoot } from './graphTraversal/index'
import { matrixRoot } from './matrixTraversal/index'
import { stringRoot } from './stringTraversal/index'
import { arrayRoot } from './arrayTraversal/index'
import { greedyRoot } from './greedy/index'
import { backtrackingRoot } from './backtracking/index'
import { dpRoot } from './dynamicProgramming/index'
import { trieRoot } from './trie/index'

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
  {
    id: 'binary-search',
    title: 'Binary Search',
    order: 4,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/7.%20Binary%20Search.md`,
    tagline: 'Classic index BS, rotated/mountain arrays, answer space, and specialized — one template per sub-pattern.',
    root: bsRoot,
  },
  {
    id: 'prefix-sum',
    title: 'Prefix Sum',
    order: 5,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/9.%20Prefix%20Sum.md`,
    tagline: '1D/2D prefix sums, subarray hash map, difference array, and advanced — one template per sub-pattern.',
    root: prefixSumRoot,
  },
  {
    id: 'hash-map',
    title: 'Hash Map / Set',
    order: 6,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/2.%20Hash%20Table.md`,
    tagline: 'O(1) lookup, counting, grouping — one template per sub-pattern.',
    root: hashMapRoot,
  },
  {
    id: 'stack-queue',
    title: 'Stack & Queue',
    order: 7,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/3.%20Stack%20%26%20Queue.md`,
    tagline: 'LIFO, FIFO, monotonic, BFS, deque — one template per sub-pattern.',
    root: stackQueueRoot,
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    order: 8,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/8.%20Heap.md`,
    tagline: 'Top-K, Scheduling, Graph (Dijkstra/MST), and Advanced — one template per sub-pattern.',
    root: heapRoot,
  },
  {
    id: 'tree-traversal',
    title: 'Tree Traversal',
    order: 9,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/6.%20Traversal%20Algorithms.md`,
    tagline: 'DFS (pre/in/post/path), BFS (level/process/width), specialized (zigzag/vertical), and construction — one template per sub-pattern.',
    root: ttRoot,
  },
  {
    id: 'graph-traversal',
    title: 'Graph Traversal',
    order: 10,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/11.%20Graph%20Traversals.md`,
    tagline: 'DFS, BFS, DSU, Dijkstra, Bellman-Ford, Floyd-Warshall, MST — one template per sub-pattern.',
    root: graphRoot,
  },
  {
    id: 'matrix-traversal',
    title: 'Matrix Traversal',
    order: 11,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/12.%20Matrix%20Traversals.md`,
    tagline: 'Grid DFS, BFS, spiral, diagonal, shape-based — one template per sub-pattern.',
    root: matrixRoot,
  },
  {
    id: 'string-traversal',
    title: 'String Traversal',
    order: 12,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/13.%20String%20Traversals.md`,
    tagline: 'Linear scan, recursive backtracking, trie-based — one template per sub-pattern.',
    root: stringRoot,
  },
  {
    id: 'array-traversal',
    title: 'Array Traversal',
    order: 13,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/14.%20Array%20Traversals.md`,
    tagline: 'One-pass, two-pointer, sliding window, binary search, multi-dim — one template per sub-pattern.',
    root: arrayRoot,
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    order: 14,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/10.%20Greedy%20Algorithms.md`,
    tagline: 'Interval processing, selection, path building, prefix optimization, incremental construction — one template per sub-pattern.',
    root: greedyRoot,
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    order: 15,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/11.%20Backtracking.md`,
    tagline: 'Combinatorial generation, constraint satisfaction, graph exploration, optimization — one template per sub-pattern.',
    root: backtrackingRoot,
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    order: 16,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/12.%20Dynamic%20Programming.md`,
    tagline: '1D state, substring/subsequence, 2D/multi-dim, state compression, DP optimization — one template per sub-pattern.',
    root: dpRoot,
  },
  {
    id: 'trie',
    title: 'Trie',
    order: 17,
    available: true,
    githubPath: `${GITHUB}/blob/main/Taxonomies/14.%20Trie.md`,
    tagline: 'Basic trie ops, dictionary apps, auto-complete, pattern matching, advanced structures, optimization — one template per sub-pattern.',
    root: trieRoot,
  },
  PLACEHOLDER(18, 'Union Find'),
  PLACEHOLDER(19, 'Bitmask'),
  PLACEHOLDER(20, 'Monotonic Stack'),
  PLACEHOLDER(21, 'Interval'),
  PLACEHOLDER(22, 'Math / Number Theory'),
  PLACEHOLDER(23, 'Bit Manipulation'),
]

export const REPO_URL = GITHUB
