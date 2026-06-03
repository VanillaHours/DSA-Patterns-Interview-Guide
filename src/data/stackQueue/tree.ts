import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

// ── Stack Applications ────────────────────────────────────────────

const parenNode: TaxonomyNode = decision(
  'paren-step3',
  'Parentheses & Bracket Matching — basic validate or advanced?',
  'blue',
  3,
  'Manage nesting with a stack:',
  [
    branch(
      [
        'simple open/close bracket matching',
        '"valid parentheses" / tags / basic "abc" substitution',
        'LC 20, 1003, 591',
      ],
      'Basic Validation',
      'Push openers, pop + match closers. Empty check at end.',
      L.basicParenLeaf,
      ['scoring/nesting depth', 'longest valid sequence'],
    ),
    branch(
      [
        '"longest valid" / "score of parentheses"',
        '"minimum remove" to make valid',
        'LC 32, 856, 1249',
      ],
      'Advanced Matching',
      'Stack of indices or scores; track unmatched boundaries.',
      L.advancedParenLeaf,
      ['simple validity check only'],
    ),
  ],
)

const monotonicNode: TaxonomyNode = decision(
  'monotonic-step3',
  'Monotonic Stack — what are you computing?',
  'teal',
  3,
  'Maintain a monotonic order of values/indices. What is the goal?',
  [
    branch(
      [
        '"next greater element" / "next warmer temperature"',
        '"next greater in circular array"',
        'LC 496, 503, 739',
      ],
      'Next Greater / Smaller',
      'Monotonic decreasing stack of indices.',
      L.nextGreaterLeaf,
      ['largest rectangle', 'trap rain water'],
    ),
    branch(
      [
        '"largest rectangle in histogram"',
        '"maximal rectangle" of 1s in binary matrix',
        '"trapping rain water" (stack variant)',
        'LC 84, 85, 42',
      ],
      'Histogram & Area',
      'Pop when height drops; compute area using popped height as limiting bar.',
      L.histogramLeaf,
      ['next greater element only', 'range min-product'],
    ),
    branch(
      [
        '"maximum subarray min-product"',
        '"sum of subarray minimums"',
        'range queries with min as constraint',
        'LC 1856, 907',
      ],
      'Range Optimization',
      'Pop, compute contribution using prefix sum and index distances.',
      L.rangeOptLeaf,
      ['simple next greater'],
    ),
  ],
)

const exprNode: TaxonomyNode = decision(
  'expr-step3',
  'Expression Evaluation — infix or postfix?',
  'blue',
  3,
  'Parse and evaluate arithmetic expressions:',
  [
    branch(
      [
        'string arithmetic with + - ( )',
        '"basic calculator" I / II / III',
        'LC 224, 227, 772',
      ],
      'Infix Calculation',
      'Two stacks (nums + ops) or sign tracking for +/-.',
      L.infixCalcLeaf,
      ['postfix / RPN input'],
    ),
    branch(
      [
        '"evaluate reverse polish notation"',
        '"exclusive time of functions" / log parsing',
        'LC 150, 636',
      ],
      'Postfix / Prefix Processing',
      'Push operands; pop two on operator; push result.',
      L.postfixLeaf,
      ['infix with parentheses'],
    ),
  ],
)

const stackAppsNode: TaxonomyNode = decision(
  'stack-apps-step2',
  'Stack Applications — which class?',
  'blue',
  2,
  'LIFO structure for nesting, monotonic properties, or expression parsing:',
  [
    branch(
      [
        '"valid parentheses" / bracket matching',
        '"longest valid" / "score of parentheses"',
        'nested structure validation',
      ],
      'Parentheses & Bracket Matching',
      'Stack matches open/close; index-based for advanced variants.',
      parenNode,
      ['monotonic stack property', 'arithmetic expression'],
    ),
    branch(
      [
        '"next greater element" / daily temperatures',
        '"largest rectangle" / "trap rain water"',
        '"sum subarray minimums" / range queries',
      ],
      'Monotonic Stack',
      'Maintain increasing or decreasing order; pop when order breaks.',
      monotonicNode,
      ['bracket matching', 'expression evaluation'],
    ),
    branch(
      [
        '"basic calculator" with + - ( ) * /',
        '"evaluate reverse polish notation"',
        '"exclusive time" / function logs',
      ],
      'Expression Evaluation',
      'Two-stack infix eval or single-stack postfix.',
      exprNode,
      ['bracket validation only'],
    ),
  ],
)

// ── Stack for Traversal ───────────────────────────────────────────

const stackTraversalNode: TaxonomyNode = decision(
  'stack-traversal-step2',
  'Stack for Traversal — tree or graph?',
  'green',
  2,
  'Explicit stack replaces recursion for trees and graphs:',
  [
    branch(
      [
        '"inorder / preorder / postorder traversal" (iterative)',
        'binary tree traversal without recursion',
        'LC 94, 144, 145',
      ],
      'Tree Traversal',
      'Stack simulates recursion; push left chain, visit, go right.',
      L.treeTraversalLeaf,
      ['graph DFS / clone'],
    ),
    branch(
      [
        '"clone graph" / deep copy with DFS stack',
        '"flatten nested list iterator"',
        'LC 133, 341',
      ],
      'Graph Traversal (Stack)',
      'DFS stack + visited map for graphs; flatten lazy iterator.',
      L.graphTraversalLeaf,
      ['tree traversal'],
    ),
  ],
)

// ── Queue Applications ────────────────────────────────────────────

const bfsNode: TaxonomyNode = decision(
  'bfs-step3',
  'BFS Implementation — tree or graph?',
  'green',
  3,
  'Queue expands level by level:',
  [
    branch(
      [
        '"level order traversal" of binary tree',
        '"zigzag" / "populate next right"',
        'LC 102, 103, 116',
      ],
      'Tree Level Order',
      'Queue captures level size before processing.',
      L.levelOrderLeaf,
      ['graph BFS / islands'],
    ),
    branch(
      [
        '"number of islands" / BFS flood fill',
        '"rotting oranges" / BFS spread',
        '"word ladder" / shortest transformation',
        'LC 200, 994, 127',
      ],
      'Graph BFS',
      'Queue pushed with visited marking on push.',
      L.graphBfsLeaf,
      ['tree level order', 'multi-source BFS'],
    ),
  ],
)

const queueAppsNode: TaxonomyNode = decision(
  'queue-apps-step2',
  'Queue Applications — BFS, sliding window, or multi-source?',
  'teal',
  2,
  'FIFO structure for breadth-first expansion or windowed access:',
  [
    branch(
      [
        '"level order" / "zigzag" of binary tree',
        '"number of islands" / "rotting oranges"',
        '"word ladder" / shortest sequence',
      ],
      'BFS Implementation',
      'Standard BFS with level-size loop or visited marking.',
      bfsNode,
      ['monotonic queue | deque'],
    ),
    branch(
      [
        '"sliding window maximum"',
        'maintain window max with deque',
        'LC 239',
      ],
      'Sliding Window with Queue',
      'Monotonic decreasing deque of indices.',
      L.slidingWinQueueLeaf,
      ['BFS / level order'],
    ),
    branch(
      [
        '"01 matrix" distance to zero',
        '"as far from land" as possible',
        '"rotting oranges" multi-source',
        'LC 542, 1162, 994',
      ],
      'Multi-Source BFS',
      'Push all sources initially; BFS outward simultaneously.',
      L.multiSourceBfsLeaf,
      ['single source BFS', 'tree level order'],
    ),
  ],
)

// ── Task Processing ───────────────────────────────────────────────

const taskNode: TaxonomyNode = decision(
  'task-step2',
  'Task Processing',
  'amber',
  2,
  'Schedule or process tasks with ordering constraints:',
  [
    branch(
      [
        '"task scheduler" / cooldown between same tasks',
        '"number of recent calls" in time window',
        '"design snake game" / moving body',
        'LC 621, 933, 353',
      ],
      'Task Processing',
      'Greedy formula (maxFreq-1)*(n+1) + remaining, or queue for window.',
      L.taskProcessingLeaf,
    ),
  ],
)

// ── Specialized Queue Variants ────────────────────────────────────

const dequeNode: TaxonomyNode = decision(
  'deque-step3',
  'Deque — monotonic or general purpose?',
  'purple',
  3,
  'Double-ended queue for window optimization or simulation:',
  [
    branch(
      [
        '"sliding window maximum" (deque variant)',
        '"longest subarray with absolute diff ≤ limit"',
        'maintain min + max in sliding window',
        'LC 239, 1438',
      ],
      'Monotonic Deque',
      'Two deques (max decreasing, min increasing).',
      L.monotonicDequeLeaf,
      ['general deque simulation'],
    ),
    branch(
      [
        '"reveal cards in increasing order"',
        '"design circular deque"',
        'deque simulation or design',
        'LC 950, 641',
      ],
      'General Deque Uses',
      'push_front/pop_back simulation or circular array design.',
      L.generalDequeLeaf,
      ['monotonic window'],
    ),
  ],
)

const pqNode: TaxonomyNode = decision(
  'pq-step3',
  'Priority Queue — top-K or greedy scheduling?',
  'purple',
  3,
  'Heap for priority-based extraction:',
  [
    branch(
      [
        '"kth largest element" / "top k frequent"',
        'min-heap or max-heap of size k',
        'LC 215, 347',
      ],
      'Top-K Selection',
      'Min-heap of size k keeps the k largest.',
      L.topKSelectorLeaf,
      ['greedy merging / scheduling'],
    ),
    branch(
      [
        '"last stone weight" / smash two heaviest',
        '"meeting rooms II" / minimum rooms',
        'greedy processing with priority',
        'LC 1046, 253',
      ],
      'Greedy Scheduling',
      'Max-heap for smashing; min-heap of end times for rooms.',
      L.greedySchedLeaf,
      ['top-k selection by frequency'],
    ),
  ],
)

const specializedQueueNode: TaxonomyNode = decision(
  'specialized-queue-step2',
  'Specialized Queue Variants',
  'purple',
  2,
  'Deque, priority queue, or circular queue specialization:',
  [
    branch(
      [
        '"sliding window maximum" with deque',
        '"longest subarray with absolute diff ≤ limit"',
        '"reveal cards / circular deque design"',
      ],
      'Deque (Double-Ended)',
      'Monotonic maintenance or push_front/pop_back simulation.',
      dequeNode,
      ['priority queue / heap only'],
    ),
    branch(
      [
        '"kth largest" / "top k frequent"',
        '"last stone weight" / "meeting rooms II"',
        'heap-based extraction',
      ],
      'Priority Queue',
      'Min-heap of size k or max-heap for greedy processing.',
      pqNode,
      ['deque / window problem'],
    ),
    branch(
      [
        '"design circular queue" / fixed buffer',
        '"find winner of circular game"',
        'fixed-size circular buffer',
        'LC 622, 1823',
      ],
      'Circular Queue',
      'Fixed array + head/tail modulo indices.',
      L.circularQueueLeaf,
    ),
  ],
)

// ── Queue Reconstruction ──────────────────────────────────────────

const reconNode: TaxonomyNode = decision(
  'recon-step2',
  'Queue Reconstruction',
  'amber',
  2,
  'Reconstruct order from relative position or voting constraints:',
  [
    branch(
      [
        '"reconstruct queue by height" / sort + insert by k',
        '"dota2 senate" / voting rounds',
        'LC 406, 649',
      ],
      'Queue Reconstruction',
      'Sort tall first, insert by k-index; or queue-based voting.',
      L.queueReconLeaf,
    ),
  ],
)

// ── Stack & Queue Design ──────────────────────────────────────────

const designNode: TaxonomyNode = decision(
  'design-step2',
  'Stack & Queue Design',
  'pink',
  2,
  'Design data structures based on stacks, queues, or both:',
  [
    branch(
      [
        '"min stack" / "max stack"',
        '"implement queue using stacks"',
        'stack-based design patterns',
        'LC 155, 716, 232',
      ],
      'Stack Design Patterns',
      'Pair (value, min/max) or two stacks for queue behavior.',
      L.stackDesignLeaf,
      ['queue-based designs'],
    ),
    branch(
      [
        '"implement stack using queues"',
        '"design circular deque"',
        '"first unique number"',
        'LC 225, 641, 1429',
      ],
      'Queue Design Patterns',
      'Rotating push or queue + freq map.',
      L.queueDesignLeaf,
      ['stack-based designs'],
    ),
    branch(
      [
        '"maximum frequency stack" / freq + stack mapping',
        '"design browser history" / forward/back stacks',
        'LC 895, 1472',
      ],
      'Combined Structures',
      'Freq map + stack-per-freq, or two stacks for navigation.',
      L.combinedStructLeaf,
    ),
  ],
)

// ── Root ──────────────────────────────────────────────────────────

export const stackQueueRoot: TaxonomyNode = decision(
  'sq-root',
  'Stack & Queue',
  'slate',
  1,
  'Before coding: does the problem need LIFO (stack), FIFO (queue), or a specialized variant?',
  [
    branch(
      [
        '"valid parentheses" / bracket matching',
        '"monotonic stack" / next greater / histogram',
        '"calculator" / expression evaluation',
        '"function exclusive time" / log parsing',
      ],
      '→ Stack Applications',
      'LIFO for nesting, ordering, or expression parsing.',
      stackAppsNode,
      ['tree/graph traversal', 'BFS / level order'],
    ),
    branch(
      [
        '"inorder / preorder / postorder" iterative',
        '"clone graph" / DFS with explicit stack',
        '"flatten nested list iterator"',
      ],
      '→ Stack for Traversal',
      'Stack replaces recursion for trees and graphs.',
      stackTraversalNode,
      ['parentheses matching', 'monotonic stack'],
    ),
    branch(
      [
        '"level order" / BFS on tree',
        '"number of islands" / BFS on grid',
        '"word ladder" / shortest path unweighted',
        '"sliding window maximum" / deque',
      ],
      '→ Queue Applications',
      'FIFO for BFS, sliding window, or multi-source expansion.',
      queueAppsNode,
      ['stack / DFS traversal'],
    ),
    branch(
      [
        '"task scheduler" / cooldown constraint',
        '"number of recent calls" / time window',
        '"design snake game" / body movement',
      ],
      '→ Task Processing',
      'Queue for time window or greedy formula for scheduling.',
      taskNode,
      ['BFS / level order'],
    ),
    branch(
      [
        '"sliding window maximum" (deque)',
        '"kth largest" / "top k frequent"',
        '"design circular queue"',
      ],
      '→ Specialized Queue Variants',
      'Deque, priority queue (heap), or circular buffer.',
      specializedQueueNode,
      ['standard BFS FIFO'],
    ),
    branch(
      [
        '"queue reconstruction by height"',
        '"dota2 senate" / voting elimination',
      ],
      '→ Queue Reconstruction',
      'Insert by k-index after sorting tall first, or queue battle.',
      reconNode,
      ['standard stack / queue'],
    ),
    branch(
      [
        '"min stack" / "max stack"',
        '"implement queue using stacks"',
        '"maximum frequency stack"',
        '"design browser history"',
      ],
      '→ Stack & Queue Design',
      'Design custom structures using stacks and queues as building blocks.',
      designNode,
      ['standard algorithm problem'],
    ),
  ],
  {
    explanation:
      'Do not pick by topic name — match the access pattern: LIFO (stack), FIFO (queue), priority (heap), or specialized (deque, circular). Each branch explains why the constraint maps to that variant.',
  },
)
