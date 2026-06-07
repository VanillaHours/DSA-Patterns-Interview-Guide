import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'recursive', label: 'Recursive / divide and conquer approach', group: 'structure' },
  { id: 'mergeCombine', label: 'Merge / combine step after recursion', group: 'structure' },
  { id: 'arrayInput', label: 'Array / list input', group: 'input' },
  { id: 'treeInput', label: 'Tree / binary tree input', group: 'input' },
  { id: 'stringInput', label: 'String input', group: 'input' },
  { id: 'matrixInput', label: 'Matrix / 2D grid input', group: 'input' },
  { id: 'sorting', label: 'Sorting via D&C (merge sort, quick sort)', group: 'goal' },
  { id: 'binarySearch', label: 'Binary search on sorted data', group: 'goal' },
  { id: 'subarray', label: 'Subarray with max/min/count properties', group: 'goal' },
  { id: 'palindrome', label: 'Palindrome detection / expansion', group: 'goal' },
  { id: 'rangeQuery', label: 'Range query / segment tree', group: 'goal' },
  { id: 'treeConstruction', label: 'Build tree from traversal sequences', group: 'goal' },
  { id: 'treeProperty', label: 'Compute tree property (diameter, path sum, BST)', group: 'goal' },
  { id: 'lca', label: 'Lowest common ancestor', group: 'goal' },
  { id: 'selection', label: 'Select Kth / top-K element', group: 'goal' },
  { id: 'exponentiation', label: 'Fast exponentiation / power calculation', group: 'goal' },
  { id: 'parallel', label: 'Parallelizable / independent subproblems', group: 'structure' },
  { id: 'geometry', label: 'Geometric / closest pair / convex hull', group: 'goal' },
  { id: 'graphConn', label: 'Graph connectivity / bridges / articulation', group: 'goal' },
  { id: 'inPlace', label: 'In-place O(1) extra space', group: 'space' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
