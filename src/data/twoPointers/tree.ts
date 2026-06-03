import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const conditionMatchingNode: TaxonomyNode = decision(
  'condition-matching',
  'Condition Matching — what must hold at both ends?',
  'blue',
  3,
  'You have sorted (or sortable) data and l=0, r=n−1. What condition are you checking?',
  [
    branch(
      [
        '"find pair/triplet with sum = target"',
        '"two numbers add up to …" on sorted input',
        '"return indices" for sum condition',
        'LC style: Two Sum II, 3Sum, 4Sum',
      ],
      'Target Sum Variants',
      'Moving l or r fixes whether sum is too small or too large.',
      L.targetSumLeaf,
      ['only palindrome check', 'maximize area'],
    ),
    branch(
      [
        '"palindrome" / "reads the same forward and backward"',
        'compare characters from both ends of a string',
        '"at most one character can be removed" (680)',
      ],
      'Palindrome Detection',
      'Skip junk chars inward; mismatch → false or one skip.',
      L.palindromeLeaf,
      ['numeric sum target on array'],
    ),
    branch(
      [
        '"a² + b² = c" / sum of square numbers',
        '"how many triangles" / triplets satisfying triangle inequality',
        'after sorting, count pairs with a+b>c',
      ],
      'Numeric Constraints',
      'Sort first; opposite pointers on values or counts.',
      L.numericLeaf,
    ),
  ],
)

const optimalPairingNode: TaxonomyNode = decision(
  'optimal-pairing',
  'Optimal Pairing & Balance — what are you optimizing?',
  'teal',
  3,
  'Sorted array, pair elements from both ends. Read the optimization goal:',
  [
    branch(
      [
        '"maximum area" between vertical lines',
        '"trap rainwater" / water above bars',
        'heights[] and you maximize something between two indices',
      ],
      'Volume Optimization',
      'Greedy: always drop the shorter line — it cannot help later.',
      L.volumeLeaf,
      ['exact sum target', 'palindrome'],
    ),
    branch(
      [
        '"minimum boats" / pair people with weight limit',
        '"minimize maximum pair sum" after pairing',
        'sort + pair lightest with heaviest',
      ],
      'Greedy Pairing',
      'Sort once; pair ends and move inward.',
      L.greedyPairLeaf,
    ),
    branch(
      [
        '"pairs with difference exactly k"',
        'count pairs (i,j) with |a[i]-a[j]| = k on sorted nums',
      ],
      'Difference Control (K-diff)',
      'Sorted + sliding left when diff too large.',
      L.kDiffLeaf,
    ),
  ],
)

const multiElementNode: TaxonomyNode = decision(
  'multi-element',
  'Multi-Element Extensions — how many numbers in the tuple?',
  'blue',
  3,
  'You need triplets, quadruplets, or counts with duplicates:',
  [
    branch(
      [
        '"find all unique triplets/quadruplets" summing to target',
        '"3Sum" / "4Sum" / closest sum to target',
      ],
      'N-Sum Problems',
      'Outer loop fixes prefix; inner opposite template.',
      L.nsumLeaf,
      ['only count multiplicity with mod', 'pair sum only'],
    ),
    branch(
      [
        '"count tuples" / multiplicity / modulo 10⁹+7',
        '3Sum but count occurrences, not list triplets',
      ],
      'Multiplicity Counting',
      'On match, multiply run-length combinations.',
      L.multiplicityLeaf,
    ),
  ],
)

const oppositeInner: TaxonomyNode = decision(
  'opposite-step2',
  'Opposite Direction Pointers',
  'blue',
  2,
  'You already know: sorted (or sortable) array, pointers at both ends. Which family matches?',
  [
    branch(
      [
        '"sum = target" / "two sum" on sorted array',
        '"palindrome" / compare chars from both ends',
        'square numbers / triangle inequality',
      ],
      'Condition Matching',
      'Check a rule at both ends — sum, symmetry, or numeric constraint.',
      conditionMatchingNode,
      ['maximize area/volume', 'k-sum enumeration only'],
    ),
    branch(
      [
        '"maximum area" / "trap water"',
        '"minimum boats" / pair people by weight',
        '"pairs with difference k"',
      ],
      'Optimal Pairing & Balance',
      'Greedy pairing or counting from sorted ends.',
      optimalPairingNode,
      ['exact sum target', 'palindrome string'],
    ),
    branch(
      [
        '"find all triplets/quadruplets"',
        '"3Sum closest" / "4Sum"',
        'count tuples with multiplicity',
      ],
      'Multi-Element Extensions',
      'Fix outer indices; inner opposite pointers.',
      multiElementNode,
      ['simple pair sum only'],
    ),
  ],
  {
    template: `int l = 0, r = n - 1;
while (l < r) {
    long cur = (long)nums[l] + nums[r];  // LINE 1: change metric here
    if (cur == target) { /* record */ }  // LINE 2: record / count / skip dups
    else if (cur < target) l++;
    else r--;
}`,
    templateCaption: 'Parent template — children change LINE 1 (metric) and LINE 2 (what you do on match).',
  },
)

const fastSlowInner: TaxonomyNode = decision(
  'fast-slow-step3',
  'Fast & Slow Pointers — what does the prompt ask?',
  'green',
  3,
  'Input is linked list (ListNode*) or implicit next-pointer array. Match the goal:',
  [
    branch(
      [
        '"detect cycle" / "has cycle"',
        '"find duplicate" in 1..n array with O(1) space',
        '"happy number" / repeated transformation',
      ],
      'Cycle Detection',
      'Fast moves 2×; meeting point proves cycle.',
      L.cycleLeaf,
    ),
    branch(
      [
        '"middle node" / "nth from end"',
        '"intersection of two lists"',
        'delete/remove node n positions from end',
      ],
      'Position Finding',
      'Offset fast ahead by n (or n+1), or walk A then B.',
      L.positionLeaf,
    ),
    branch(
      [
        '"palindrome linked list"',
        '"reorder list" L0→Ln→L1→…',
        'restructure list in O(1) space',
      ],
      'Structural Modifications',
      'Find mid → reverse half → merge/compare.',
      L.structuralLeaf,
    ),
  ],
  {
    template: `auto slow = head, fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}`,
  },
)

const variableWinNode: TaxonomyNode = decision(
  'variable-win',
  'Variable Size Windows — longest or shortest?',
  'lime',
  4,
  'Window size is not fixed. Read whether you maximize or minimize length:',
  [
    branch(
      [
        '"longest substring" / "longest subarray"',
        '"at most K distinct" / "at most 2 types" (baskets)',
        '"max consecutive 1s" with at most K flips',
      ],
      'Expansion-Based (Longest)',
      'Expand r; while invalid, remove from l; track max length.',
      L.expandWinLeaf,
      ['shortest/minimum length'],
    ),
    branch(
      [
        '"minimum window" / "shortest subarray"',
        '"smallest length" with sum ≥ target',
        'contains all characters of t',
      ],
      'Contraction-Based (Shortest)',
      'Expand until valid; then shrink l while still valid; minimize.',
      L.contractWinLeaf,
    ),
  ],
)

const slidingInner: TaxonomyNode = decision(
  'sliding-step3',
  'Sliding Window — what does the constraint say?',
  'green',
  3,
  'Prompt mentions contiguous subarray/substring. Read the optimization goal:',
  [
    branch(
      [
        '"subarray of size k" / "exactly k"',
        '"average of k consecutive" / fixed window length',
      ],
      'Fixed Size Windows',
      'No shrink loop — slide by adding r, removing l when size>k.',
      L.fixedWinLeaf,
      ['longest/shortest variable length'],
    ),
    branch(
      [
        '"longest" or "shortest" contiguous segment',
        '"at most K" / "minimum length" without fixed k',
      ],
      'Variable Size Windows',
      'Expand right; shrink left when rule breaks.',
      variableWinNode,
      ['exactly k length', 'anagram freq match'],
    ),
    branch(
      [
        '"anagram" / "permutation" of p in s',
        '"find all start indices" where window matches freq',
      ],
      'Frequency-Based Matching',
      'Fixed |p| window; compare char counts.',
      L.freqWinLeaf,
    ),
  ],
  {
    template: `int l = 0;
for (int r = 0; r < n; r++) {
    // add nums[r] to window state
    while (/* invalid */) { /* remove nums[l] */ l++; }  // LINE 1: invalid condition
    // update ans                                          // LINE 2: max vs min length
}`,
    templateCaption: 'Parent template — LINE 1 = when to shrink; LINE 2 = track max or min.',
  },
)

const readWriteInner: TaxonomyNode = decision(
  'rw-step3',
  'Read/write — what in-place change?',
  'green',
  3,
  'Prompt says modify array in-place, O(1) extra space, return new length or compact:',
  [
    branch(
      [
        '"remove duplicates" from sorted array',
        '"remove element" equal to val',
        'return k = count of elements to keep',
      ],
      'Removal Operations',
      'Write index w; copy only elements you keep.',
      L.removalLeaf,
    ),
    branch(
      [
        '"move zeroes" to end',
        '"sort by parity" in-place',
        'stable move of one value class',
      ],
      'Movement Operations',
      'Filter non-target to front; optional fill.',
      L.movementLeaf,
    ),
    branch(
      [
        '"reverse string" in-place',
        '"reverse vowels only"',
      ],
      'Transformation Operations',
      'Swap l/r — not read/write, but same scan family.',
      L.transformLeaf,
      ['remove duplicates', 'move zeroes'],
    ),
  ],
)

const subseqInner: TaxonomyNode = decision(
  'subseq-step3',
  'Subsequence — match type?',
  'green',
  3,
  'Two strings; check if one appears inside the other in order:',
  [
    branch(
      [
        '"is subsequence" / "words matching subsequence"',
        'advance pointer on target only when char matches',
      ],
      'Basic Subsequence',
      'Single pass; j only increases.',
      L.basicSubLeaf,
    ),
    branch(
      [
        '"camelcase matching"',
        '"word abbreviation" with numbers for skips',
      ],
      'Pattern Matching with Rules',
      'Parse skips/digits; match pattern chars.',
      L.patternSubLeaf,
    ),
  ],
)

const sameDirNode: TaxonomyNode = decision(
  'same-step2',
  'Same Direction Pointers',
  'green',
  2,
  'Both pointers start on the left and only move right (or one chases the other). Match ONE:',
  [
    branch(
      [
        'Input type: ListNode* / linked list',
        '"cycle" / "middle" / "nth from end"',
        'O(1) space on linked structure',
      ],
      'Fast & Slow Pointers',
      'Chase pointer 2× speed or fixed gap.',
      fastSlowInner,
      ['array subarray', 'in-place array write'],
    ),
    branch(
      [
        '"substring" / "subarray" / "window"',
        '"contiguous" + "at most K" / "minimum length"',
        '"longest" or "shortest" contiguous segment',
      ],
      'Sliding Window',
      'Right expands; left shrinks when rule breaks.',
      slidingInner,
      ['ListNode input', 'remove duplicates in-place'],
    ),
    branch(
      [
        '"in-place" + "O(1) extra space" on array',
        '"remove" / "compact" / return new length',
        'write index without extra array',
      ],
      'Read & Write Pointers',
      'r scans; w only moves when keeping nums[r].',
      readWriteInner,
      ['substring window', 'linked list'],
    ),
    branch(
      [
        'check if string t is subsequence of s',
        'two strings, match pattern with skips',
      ],
      'Subsequence Matching',
      'One pointer per string; match in order.',
      subseqInner,
    ),
  ],
)

const partitionNode: TaxonomyNode = decision(
  'partition-step2',
  'Partitioning Pointers',
  'amber',
  2,
  'Reorder array into groups in one pass:',
  [
    branch(
      [
        'values are only 0, 1, 2',
        '"sort colors" / three-way partition',
      ],
      'Dutch National Flag (3-way Partition)',
      'lo/mid/hi partition 0|1|2.',
      L.dnfLeaf,
    ),
    branch(
      [
        '"kth largest" / "kth smallest"',
        'quicksort partition around pivot',
      ],
      'Quick Sort Partition (2-way)',
      'Partition; recurse one side only.',
      L.quickPartLeaf,
      ['only 0/1/2 values'],
    ),
  ],
)

const structuresNode: TaxonomyNode = decision(
  'struct-step2',
  'Pointers on Different Structures',
  'purple',
  2,
  'Two separate arrays/lists/strings given together:',
  [
    branch(
      [
        '"merge" sorted arrays/lists',
        '"merge k sorted lists"',
        'fill nums1 from end with nums2',
      ],
      'Merge Operations',
      'Pick smaller head each step.',
      L.mergeLeaf,
    ),
    branch(
      [
        '"intersection" of two arrays',
        '"interval list intersections"',
        'common elements in sorted order',
      ],
      'Intersection & Union',
      'Advance the smaller pointer.',
      L.intersectLeaf,
    ),
    branch(
      [
        '"compare version numbers"',
        '"backspace string compare"',
        'parse two streams with rules',
      ],
      'Comparative Scanning',
      'Simulate or parse segment by segment.',
      L.compareLeaf,
    ),
  ],
)

export const twoPointersRoot: TaxonomyNode = decision(
  'tp-root',
  'Two Pointers',
  'slate',
  1,
  'Before coding: read the problem statement and underline constraints. Which box below matches?',
  [
    branch(
      [
        '"sorted" / "non-decreasing" / "in ascending order"',
        'find two/three numbers with sum (or closest) to target',
        'palindrome check on string',
        'maximize area / pair from both ends after sorting',
      ],
      '→ Opposite direction (l=0, r=n−1)',
      'Order lets you eliminate half the pairs per step.',
      oppositeInner,
      [
        'ListNode* head',
        'substring/subarray window',
        'only in-place filter one array',
        'merge two input lists',
      ],
    ),
    branch(
      [
        'ListNode* / linked list',
        '"substring" / "subarray" / contiguous window',
        '"in-place" O(1) space modify array',
        'is subsequence of another string',
      ],
      '→ Same direction (both start left)',
      'Single pass: expand right, or fast chases slow, or read/write.',
      sameDirNode,
      [
        'explicitly sorted + pair sum from ends',
        'merge two sorted inputs',
        'partition 0/1/2 only',
      ],
    ),
    branch(
      [
        'array contains only 0, 1, 2',
        '"kth largest" without full sort',
        'partition around pivot',
      ],
      '→ Partitioning pointers',
      'Rearrange in O(n) with 2–3 pointers.',
      partitionNode,
      ['two separate sorted lists to merge'],
    ),
    branch(
      [
        'two arrays / two lists / two strings together',
        '"merge" / "intersection" / "interval lists"',
        'compare version strings with rules',
      ],
      '→ Two different structures',
      'One index per input; advance by comparison.',
      structuresNode,
      ['single array only', 'linked list cycle'],
    ),
  ],
  {
    explanation:
      'Do not pick by topic name — match the highlighted constraints in the prompt. Each branch explains why that constraint forces this pointer setup.',
  },
)
