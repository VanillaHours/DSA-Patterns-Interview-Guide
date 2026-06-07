import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Classic D&C: Sorting Algorithms (step 3) ─────────────────────

const sortingAlgorithms: TaxonomyNode = decision(
  'sorting-step3',
  'Sorting Algorithms — which D&C sort?',
  'amber',
  3,
  'Divide and conquer sorting: divide array, sort halves, combine. Which approach?',
  [
    branch(
      ['"merge sort"', '"stable sort"', '"O(n log n)"', '"divide and conquer sort"', '"sort list"'],
      'Merge Sort',
      'Divide at mid, sort left & right, merge sorted halves.',
      L.mergeSortLeaf,
      ['in-place sort', 'quick sort'],
    ),
    branch(
      ['"quick sort"', '"partition"', '"pivot"', '"in-place sort"', '"randomized"', '"selection"'],
      'Quick Sort',
      'Pick pivot, partition, recursively sort left & right partitions.',
      L.quickSortLeaf,
      ['stable sort required'],
    ),
    branch(
      ['"external"', '"large file"', '"memory"', '"k-way merge"', '"disk"', '"too big for memory"'],
      'External Sorting',
      'Split into memory-sized chunks, sort each, k-way merge with min-heap.',
      L.externalSortLeaf,
    ),
  ],
)

// ── Classic D&C: Binary Search (step 3) ──────────────────────────

const binarySearchDivision: TaxonomyNode = decision(
  'binary-search-step3',
  'Binary Search — what type of search space?',
  'teal',
  3,
  'Binary search on sorted data. What kind of search space?',
  [
    branch(
      ['"sorted array"', '"standard"', '"search insert"', '"classic binary search"'],
      'Basic Binary Search',
      'Standard binary search on a sorted 1D array.',
      L.basicBSLeaf,
      ['rotated array', 'matrix'],
    ),
    branch(
      ['"rotated"', '"circular"', '"pivot"', '"minimum rotated"', '"unknown rotation"'],
      'Rotated Array Search',
      'Binary search on rotated array: check which half is sorted.',
      L.rotatedBSLeaf,
    ),
    branch(
      ['"matrix"', '"2D"', '"grid"', '"flatten"', '"row and column sorted"'],
      'Matrix Binary Search',
      'Flatten 2D index or top-right elimination for 2D search.',
      L.matrixBSLeaf,
    ),
  ],
)

// ── Classic D&C: Selection Algorithms (step 3) ───────────────────

const selectionAlgorithms: TaxonomyNode = decision(
  'selection-step3',
  'Selection Algorithms — how to find Kth element?',
  'lime',
  3,
  'Find Kth smallest/largest element. Which selection method?',
  [
    branch(
      ['"Kth largest"', '"Kth smallest"', '"quickselect"', '"top K"', '"K closest"', '"215"', '"973"'],
      'Quickselect',
      'Partition like quick sort, recurse only into the half with Kth element.',
      L.quickselectLeaf,
      ['worst-case O(n) required'],
    ),
    branch(
      ['"deterministic"', '"worst-case"', '"guaranteed O(n)"', '"median of medians"', '"groups of 5"'],
      'Median of Medians',
      'Deterministic O(n) selection: groups of 5, median pivoting, 30% reduction.',
      L.medianOfMediansLeaf,
    ),
  ],
)

// ── Classic D&C: Mathematical (step 3) ────────────────────────────

const mathematicalDC: TaxonomyNode = decision(
  'math-step3',
  'Mathematical D&C — which computation?',
  'orange',
  3,
  'Mathematical divide and conquer algorithms for numeric computation.',
  [
    branch(
      ['"multiplication"', '"karatsuba"', '"FFT"', '"polynomial"', '"big integer"', '"convolution"'],
      'Integer Multiplication',
      'Karatsuba O(n^1.585) or FFT O(n log n) for large integer/polynomial multiplication.',
      L.intMultiplicationLeaf,
    ),
    branch(
      ['"matrix"', '"strassen"', '"exponentiation"', '"fibonacci"', '"linear recurrence"', '"509"', '"70"'],
      'Matrix Operations',
      'Strassen multiplication or matrix exponentiation for linear recurrences.',
      L.matrixOpsLeaf,
    ),
    branch(
      ['"pow"', '"power"', '"exponent"', '"binary exponentiation"', '"modular"', '"50"', '"372"'],
      'Fast Exponentiation',
      'Binary exponentiation: square base, multiply when bit set. O(log n).',
      L.fastExpLeaf,
    ),
  ],
)

// ── Classic D&C Family (step 2) ─────────────────────────────────

const classicDcFamily: TaxonomyNode = decision(
  'classic-dc-step2',
  'Classic D&C Algorithms',
  'amber',
  2,
  'Core divide and conquer algorithms: sorting, binary search, selection, or math. Pick ONE:',
  [
    branch(
      ['"sort"', '"merge sort"', '"quick sort"', '"sort list"', '"external sort"', '"stable sort"'],
      '→ Sorting Algorithms',
      'Divide-and-conquer sorting: merge sort, quick sort, or external sorting.',
      sortingAlgorithms,
      ['search for element', 'selection'],
    ),
    branch(
      ['"binary search"', '"search"', '"find"', '"sorted"', '"rotated"', '"matrix search"'],
      '→ Binary Search',
      'Divide search space in half: basic, rotated, or matrix binary search.',
      binarySearchDivision,
      ['sort entire array', 'selection'],
    ),
    branch(
      ['"Kth"', '"largest"', '"smallest"', '"top K"', '"select"', '"quickselect"', '"median"'],
      '→ Selection Algorithms',
      'Find Kth element: quickselect (randomized) or median-of-medians.',
      selectionAlgorithms,
      ['search for element'],
    ),
    branch(
      ['"pow"', '"matrix multiply"', '"strassen"', '"exponent"', '"fibonacci"', '"FFT"', '"karatsuba"'],
      '→ Mathematical D&C',
      'Mathematical divide-and-conquer: exponentiation, matrix ops, multiplication.',
      mathematicalDC,
      ['sorting data', 'tree problems'],
    ),
  ],
)

// ── Array & String D&C: Subarray Problems (step 3) ───────────────

const subarrayProblems: TaxonomyNode = decision(
  'subarray-step3',
  'Subarray Problems — what property to find?',
  'green',
  3,
  'D&C on subarrays: max sum, closest pair, or counting pairs. Pick ONE:',
  [
    branch(
      ['"maximum subarray"', '"max sum"', '"Kadane"', '"53"', '"circular subarray"', '"918"'],
      'Maximum Subarray',
      'Find max sum subarray: combine left max, right max, or cross-mid sum.',
      L.maxSubarrayLeaf,
      ['count pairs with condition'],
    ),
    branch(
      ['"closest"', '"pair"', '"3sum"', '"16"', '"geometry"', '"minimum difference"'],
      'Closest Pair / 3Sum',
      'Closest pair of points with strip optimization, or 3Sum closest.',
      L.closestPairLeaf,
      ['subarray max sum'],
    ),
    branch(
      ['"count"', '"reverse pairs"', '"range sum"', '"315"', '"493"', '"327"', '"inversion"'],
      'Counting Problems',
      'Count pairs/combinations satisfying a condition using merge sort.',
      L.countingLeaf,
    ),
  ],
)

// ── Array & String D&C: String Manipulation (step 3) ─────────────

const stringDcSub: TaxonomyNode = decision(
  'string-dc-step3',
  'Divide and Conquer on Strings — what string property?',
  'pink',
  3,
  'Apply divide and conquer to strings. What operation?',
  [
    branch(
      ['"longest common prefix"', '"LCP"', '"common prefix"', '"strings"', '"14"', '"prefix"'],
      'Longest Common Prefix',
      'D&C on strings array: find LCP of left half and right half, return common prefix.',
      L.stringDCLeaf,
      ['string matching', 'palindrome'],
    ),
    branch(
      ['"rabin-karp"', '"string matching"', '"rolling hash"', '"pattern search"', '"substring"'],
      'String Matching (Rabin-Karp)',
      'Rabin-Karp: rolling hash for substring search; divide text and combine.',
      L.stringMatchingLeaf,
      ['prefix-based matching'],
    ),
    branch(
      ['"palindrome"', '"palindromic"', '"longest palindrome"', '"5"', '"647"', '"center expansion"'],
      'Palindrome Problems',
      'Expand from center or D&C: divide string, process halves, combine cross-mid.',
      L.palindromeDcLeaf,
    ),
  ],
)

// ── Array & String D&C: Range Query Problems (step 3) ──────────

const rangeQueryProblems: TaxonomyNode = decision(
  'range-query-step3',
  'Range Query Problems — what data structure?',
  'teal',
  3,
  'Efficient range queries with D&C data structures. Which approach?',
  [
    branch(
      ['"segment tree"', '"range sum"', '"307"', '"715"', '"range module"', '"mutable"'],
      'Segment Tree',
      'Recursive segment tree for range queries with point updates.',
      L.segTreeBasicsLeaf,
      ['BIT / Fenwick tree'],
    ),
    branch(
      ['"fenwick"', '"BIT"', '"binary indexed"', '"prefix sum tree"', '"315"'],
      'Binary Indexed Tree (Fenwick)',
      'BIT: O(log n) point update + prefix sum. 1-indexed internal representation.',
      L.binaryIndexedTreeLeaf,
    ),
  ],
)

// ── Array & String D&C: Computational Geometry (step 3) ─────────

const computationalGeometry: TaxonomyNode = decision(
  'geometry-step3',
  'Computational Geometry — which geometric problem?',
  'green',
  3,
  'D&C for geometric problems: points, hulls, intersections. Pick ONE:',
  [
    branch(
      ['"closest pair"', '"closest points"', '"2D"', '"plane"', '"strip"', '"minimum distance"'],
      'Closest Pair of Points',
      'Sort by x, divide at mid, find min in left & right, check strip for cross pairs.',
      L.closestPairLeaf,
      ['convex hull', 'intersection'],
    ),
    branch(
      ['"convex hull"', '"graham scan"', '"monotone chain"', '"andrew"', '"merge hull"'],
      'Convex Hull',
      'Smallest convex polygon containing all points. Graham scan or D&C merge hull.',
      L.convexHullLeaf,
    ),
    branch(
      ['"intersection"', '"line segment"', '"sweep line"', '"bentley-ottmann"', '"overlap"'],
      'Geometric Intersections',
      'Find all intersecting line segments. Plane sweep with D&C divide at median x.',
      L.geometricIntersectionsLeaf,
    ),
  ],
)

// ── Array & String D&C Family (step 2) ─────────────────────────

const arrayStringDcFamily: TaxonomyNode = decision(
  'array-string-dc-step2',
  'Array & String D&C',
  'green',
  2,
  'Divide and conquer applied to arrays, strings, range queries, and geometry. Pick ONE:',
  [
    branch(
      ['"subarray"', '"max sum"', '"max subarray"', '"closest pair"', '"count"', '"reverse pairs"'],
      '→ Subarray Problems',
      'D&C on subarrays: max sum, closest pair, counting inversions.',
      subarrayProblems,
      ['string manipulation', 'range queries', 'geometry'],
    ),
    branch(
      ['"string"', '"LCP"', '"longest common prefix"', '"palindrome"', '"pattern"', '"rabin-karp"'],
      '→ String Manipulation',
      'D&C on strings: LCP, string matching (Rabin-Karp), palindrome problems.',
      stringDcSub,
      ['numeric subarray problems'],
    ),
    branch(
      ['"segment tree"', '"BIT"', '"range sum"', '"fenwick"', '"range query"', '"307"', '"315"'],
      '→ Range Query Problems',
      'Segment tree or Binary Indexed Tree for efficient range queries.',
      rangeQueryProblems,
      ['string operations', 'geometry problems'],
    ),
    branch(
      ['"geometry"', '"closest pair"', '"convex hull"', '"intersection"', '"2D"', '"geometric"'],
      '→ Computational Geometry',
      'D&C for geometry: closest pair, convex hull, line segment intersections.',
      computationalGeometry,
      ['array problems', 'range queries'],
    ),
  ],
)

// ── Tree & Graph D&C: Tree Problems (step 3) ───────────────────

const treeProblems: TaxonomyNode = decision(
  'tree-step3',
  'Tree D&C Problems — what tree property / construction?',
  'purple',
  3,
  'D&C on trees: recursion, construction, properties, BST, LCA, segment tree, or tree DP.',
  [
    branch(
      ['"max depth"', '"balanced"', '"diameter"', '"invert"', '"104"', '"110"', '"543"', '"226"'],
      'Binary Tree Recursion',
      'Post-order D&C: solve left and right subtrees, combine at root.',
      L.treeRecursionLeaf,
      ['BST construction', 'segment tree'],
    ),
    branch(
      ['"tree construction"', '"preorder inorder"', '"105"', '"106"', '"889"', '"build tree"', '"traversal"'],
      'Tree Construction from Traversals',
      'Build binary tree from inorder + preorder/postorder traversals.',
      L.treeConstructionLeaf,
    ),
    branch(
      ['"lowest common ancestor"', '"LCA"', '"236"', '"1644"', '"ancestor"', '"common parent"'],
      'Lowest Common Ancestor',
      'Post-order: LCA of two nodes; handles missing nodes variant.',
      L.lcaLeaf,
    ),
    branch(
      ['"max sum BST"', '"1373"', '"BST property"', '"maximum sum"', '"bst in binary tree"'],
      'Advanced Tree Properties',
      'Post-order with aggregates: isBST, min, max, sum. Max Sum BST in Binary Tree.',
      L.treePropertyAdvancedLeaf,
    ),
    branch(
      ['"sorted array to BST"', '"108"', '"BST from preorder"', '"1008"', '"BST construction"'],
      'BST Divide and Conquer',
      'Build balanced BST: pick mid as root, recursively build left and right halves.',
      L.bstDCLeaf,
      ['generic tree property'],
    ),
    branch(
      ['"segment tree"', '"range sum"', '"307"', '"range update"', '"lazy"', '"370"'],
      'Segment Tree — Basics',
      'Recursive segment tree for range queries with point updates.',
      L.segTreeBasicsLeaf,
      ['lazy propagation needed'],
    ),
    branch(
      ['"lazy"', '"range add"', '"range update"', '"calendar"', '"731"', '"my calendar"'],
      'Segment Tree — Advanced',
      'Lazy propagation segment tree for range updates with deferred propagation.',
      L.segTreeAdvancedLeaf,
      ['point updates only'],
    ),
    branch(
      ['"merge sort tree"', '"order statistics"', '"range count"', '"sorted segments"'],
      'Merge Sort Tree',
      'Segment tree with sorted vectors at each node for range counting queries.',
      L.mergeSortTreeLeaf,
    ),
    branch(
      ['"centroid"', '"decomposition"', '"path queries"', '"tree distance"', '"divide conquer tree"'],
      'Centroid Decomposition',
      'Recursively find centroid, remove, recurse on components. O(n log n) for path queries.',
      L.centroidDecompLeaf,
    ),
    branch(
      ['"tree dp"', '"max path sum"', '"robber"', '"124"', '"337"', '"968"', '"tree camera"', '"post-order"'],
      'D&C on Trees (Tree DP)',
      'Post-order tree DP: return computed state from each subtree, combine at parent.',
      L.treeDPLeaf,
    ),
  ],
)

// ── Tree & Graph D&C: Graph Algorithms (step 3) ─────────────────

const graphAlgorithms: TaxonomyNode = decision(
  'graph-step3',
  'Graph Algorithms — which graph D&C problem?',
  'purple',
  3,
  'D&C strategies for graphs: connectivity, shortest paths, DP optimization. Pick ONE:',
  [
    branch(
      ['"bridge"', '"articulation"', '"tarjan"', '"connectivity"', '"cut vertex"', '"biconnected"'],
      'Graph Connectivity (Bridges & Articulation)',
      'Tarjan: DFS with tin/low to find bridges and articulation points.',
      L.graphConnectivityLeaf,
    ),
    branch(
      ['"johnson"', '"all pairs"', '"shortest path"', '"reweight"', '"bellman-ford"', '"dijkstra"'],
      'Shortest Path (Johnson\'s Algorithm)',
      'Bellman-Ford to reweight, then Dijkstra per vertex for all-pairs shortest paths.',
      L.shortestPathJohnsonLeaf,
    ),
    branch(
      ['"dc dp"', '"dp optimization"', '"1335"', '"divide dp"', '"monotonic"', '"job schedule"'],
      'D&C DP Optimization',
      'Divide and Conquer DP optimization for monotonic transition points.',
      L.dcDpOptimizationLeaf,
    ),
  ],
)

// ── Tree & Graph D&C: D&C in Parallel Computing (step 3) ────────

const parallelComputing: TaxonomyNode = decision(
  'parallel-step3',
  'D&C in Parallel Computing — which parallel strategy?',
  'amber',
  3,
  'Leverage D&C for parallelization: map-reduce or parallel sorting.',
  [
    branch(
      ['"map reduce"', '"mapreduce"', '"big data"', '"distributed"', '"map"', '"reduce"', '"shuffle"'],
      'Map-Reduce Paradigm',
      'Map = parallel D&C on chunks; Reduce = combine results by key.',
      L.mapReduceLeaf,
    ),
    branch(
      ['"parallel sort"', '"parallel merge"', '"multi-threaded"', '"parallel quick"', '"sorting"'],
      'Parallel Sorting',
      'Divide among processors, sort independently, merge results.',
      L.parallelSortingLeaf,
    ),
  ],
)

// ── Tree & Graph D&C Family (step 2) ──────────────────────────

const treeGraphDcFamily: TaxonomyNode = decision(
  'tree-graph-dc-step2',
  'Tree & Graph D&C',
  'purple',
  2,
  'Divide and conquer applied to trees, graphs, and parallel computing. Pick ONE:',
  [
    branch(
      ['"tree"', '"binary tree"', '"BST"', '"segment tree"', '"centroid"', '"tree dp"', '"LCA"', '"construction"', '"traversal"', '"property"'],
      '→ Tree Problems',
      'D&C on trees: recursion, construction, properties, LCA, BST, segment trees, centroid, tree DP.',
      treeProblems,
      ['graph algorithms', 'parallel computing'],
    ),
    branch(
      ['"graph"', '"connectivity"', '"bridge"', '"tarjan"', '"shortest path"', '"johnson"', '"dp optimization"', '"1335"'],
      '→ Graph Algorithms',
      'D&C for graphs: connectivity, shortest paths, DP optimization.',
      graphAlgorithms,
      ['tree problems', 'parallel sorting'],
    ),
    branch(
      ['"parallel"', '"map reduce"', '"mapreduce"', '"big data"', '"parallel sort"', '"distributed"'],
      '→ D&C in Parallel Computing',
      'Leverage D&C: map-reduce paradigm, parallel merge/quick sort.',
      parallelComputing,
    ),
  ],
)

// ── Root Decision (step 1) ─────────────────────────────────────

export const dcRoot: TaxonomyNode = decision(
  'divide-conquer-root',
  'Divide and Conquer Pattern',
  'slate',
  1,
  'Divide and Conquer: split problem into smaller subproblems, solve recursively, combine. Which domain?',
  [
    branch(
      ['"sort"', '"merge sort"', '"quick sort"', '"binary search"', '"selection"', '"pow"', '"scale"', '"matrix"', '"math"'],
      '→ Classic D&C Algorithms',
      'Core D&C: sorting, binary search, selection, mathematical (exponentiation, matrix).',
      classicDcFamily,
      ['array/string problems', 'tree/graph problems'],
    ),
    branch(
      ['"subarray"', '"maximum subarray"', '"reverse pairs"', '"range sum"', '"string"', '"LCP"', '"count"', '"segment tree"', '"geometry"', '"palindrome"'],
      '→ Array & String D&C',
      'D&C on arrays, strings, range queries, geometry: subarrays, counting, LCP, segment tree, convex hull.',
      arrayStringDcFamily,
      ['tree/graph problems', 'mathematical D&C'],
    ),
    branch(
      ['"tree"', '"binary tree"', '"BST"', '"segment tree"', '"centroid"', '"tree dp"', '"path sum"', '"graph"', '"bridge"', '"parallel"', '"LCA"', '"construction"'],
      '→ Tree & Graph D&C',
      'D&C on trees, graphs, and parallel computing: recursion, construction, LCA, segment trees, centroid, tree DP, connectivity, Johnson, map-reduce.',
      treeGraphDcFamily,
      ['sorting or searching arrays'],
    ),
  ],
)
