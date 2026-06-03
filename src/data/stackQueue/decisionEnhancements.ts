import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement {
  return partial
}

/** Step 0 — Is this even Stack & Queue? */
export const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'LIFO or FIFO access pattern — not random access',
    'Nesting, bracket matching, or undo/redo behavior',
    'Expression evaluation (infix, postfix) or function call tracking',
    'BFS / level-order traversal or shortest path in unweighted graph',
    'Monotonic property — next greater/smaller element in a sequence',
    'Sliding window with deque for O(n) max/min tracking',
  ],
  whenAtThisStep:
    'You have not chosen a sub-pattern yet. First ask: does the problem benefit from controlled-access sequential processing (stack or queue)?',
  xray: [
    { text: 'Given a string containing just the characters **( ) { } [ ]** …', kind: 'signal' },
    { text: 'You must implement an algorithm that runs in **O(n)** time and **O(n)** extra space', kind: 'constraint' },
    { text: 'Find the **next greater** element for each array element', kind: 'goal' },
    { text: 'Return the **level order** traversal of a binary tree', kind: 'goal' },
    { text: 'Design a **stack** that supports push, pop, top, and **getMin** in O(1)', kind: 'signal' },
  ],
  budget: ['parentheses', 'monotonic', 'expression', 'bfs', 'deque'],
  sayIt: [
    'Before any template: does the problem need LIFO (stack), FIFO (queue), or a specialized variant?',
    'If yes — bracket matching, monotonic property, expression, BFS, sliding window, or design?',
    'If random access / sort / hash map is the key — probably not stack or queue.',
  ],
  branchGuides: {
    'stack-apps-step2': {
      proceed: 'WHEN: nesting, monotonic order, or expression parsing',
      whenExtra: ['valid parentheses', 'next greater', 'calculator'],
    },
    'stack-traversal-step2': {
      proceed: 'WHEN: iterative tree/graph traversal with explicit stack',
      whenExtra: ['inorder traversal', 'clone graph with stack'],
    },
    'queue-apps-step2': {
      proceed: 'WHEN: BFS, level order, sliding window, or multi-source expansion',
      whenExtra: ['level order', 'number of islands', 'sliding window max'],
    },
    'task-step2': {
      proceed: 'WHEN: task scheduling with cooldown or rate-limiting',
      whenExtra: ['task scheduler', 'recent calls', 'snake game'],
    },
    'specialized-queue-step2': {
      proceed: 'WHEN: deque, priority queue (heap), or circular queue',
      whenExtra: ['sliding window max (deque)', 'kth largest (heap)', 'circular queue'],
    },
    'recon-step2': {
      proceed: 'WHEN: reconstruct order from positional or voting constraints',
      whenExtra: ['queue reconstruction by height', 'dota senate'],
    },
    'design-step2': {
      proceed: 'WHEN: design custom data structures using stacks and queues',
      whenExtra: ['min stack', 'queue with stacks', 'max freq stack'],
    },
  },
  notThisPattern: [
    { signal: '"unsorted array" + "find pair with sum"', actually: 'Hash map (complement lookup). Not stack.' },
    { signal: '"sort the array" / "kth largest" with O(n) avg', actually: 'Quickselect or heap — not stack. But heap is under Priority Queue if explicitly asked.' },
    { signal: '"shortest path in weighted graph"', actually: 'Dijkstra (priority queue). Not plain queue.' },
  ],
  misidentify: [
    {
      cause: 'Stack for level order (should be queue)',
      wrong: 'Use stack for tree level order',
      testCase: 'LC 102 — need FIFO order per level',
      fix: 'Queue for BFS/level order. Stack for DFS/tree traversal.',
    },
  ],
}

export const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'sq-root': PATTERN_GATE,

  'stack-apps-step2': d({
    whenAtThisStep: 'LIFO — nesting, monotonic, or expression parsing.',
    xray: [
      { text: 'String of **brackets** — valid or longest valid?', kind: 'signal' },
      { text: '**Next greater** temperature / element', kind: 'goal' },
      { text: '**Evaluate** arithmetic expression', kind: 'goal' },
    ],
    budget: ['parentheses', 'monotonic', 'expression'],
    sayIt: ['Stack for nesting (parens), monotonic order (next greater), or expression eval.'],
    branchGuides: {
      'paren-step3': { proceed: 'WHEN: bracket matching / nesting' },
      'monotonic-step3': { proceed: 'WHEN: next greater, histogram, or range min-product' },
      'expr-step3': { proceed: 'WHEN: infix calculator or postfix RPN' },
    },
  }),

  'paren-step3': d({
    whenAtThisStep: 'Parentheses / bracket matching — basic or advanced.',
    xray: [
      { text: 'Valid **parentheses** / bracket pairs', kind: 'goal' },
      { text: '**Longest valid** parentheses substring', kind: 'goal' },
      { text: '**Score** of parentheses based on nesting', kind: 'goal' },
    ],
    budget: ['parentheses'],
    sayIt: ['Basic: push openers, pop match. Advanced: stack of indices or scores.'],
    branchGuides: {
      'basic-paren': { proceed: 'WHEN: simple validity check (push/pop/match)' },
      'advanced-paren': { proceed: 'WHEN: longest valid, score, min remove' },
    },
  }),

  'monotonic-step3': d({
    whenAtThisStep: 'Monotonic stack — next greater, histogram, or range.',
    xray: [
      { text: '**Next greater** / warmer temperature', kind: 'goal' },
      { text: '**Largest rectangle** in histogram', kind: 'goal' },
      { text: '**Sum of subarray minimums**', kind: 'goal' },
    ],
    budget: ['monotonic'],
    sayIt: ['Monotonic: pop when order breaks, compute on pop. Index-based (not value).'],
    branchGuides: {
      'next-greater': { proceed: 'WHEN: next greater/smaller element' },
      histogram: { proceed: 'WHEN: largest rectangle, maximal rect, trap water (stack)' },
      'range-opt': { proceed: 'WHEN: subarray min-product, sum of minimums' },
    },
  }),

  'expr-step3': d({
    whenAtThisStep: 'Expression — infix or postfix.',
    xray: [
      { text: '**Evaluate** string expression with + - ( ) * /', kind: 'goal' },
      { text: 'Evaluate **reverse polish notation**', kind: 'goal' },
    ],
    budget: ['expression'],
    sayIt: ['Infix: two stacks (nums + ops) or sign tracking. Postfix: stack push/pop.'],
    branchGuides: {
      'infix-calc': { proceed: 'WHEN: infix arithmetic with ( ) and operators' },
      postfix: { proceed: 'WHEN: RPN / postfix tokens or function time logs' },
    },
  }),

  'stack-traversal-step2': d({
    whenAtThisStep: 'Explicit stack for tree/graph traversal.',
    xray: [
      { text: '**Inorder / preorder / postorder** iterative', kind: 'goal' },
      { text: '**Clone** graph with explicit stack', kind: 'goal' },
    ],
    budget: ['treeStack', 'graphStack'],
    sayIt: ['Stack simulates recursion. Tree: push left chain. Graph: DFS + visited map.'],
    branchGuides: {
      'tree-traversal': { proceed: 'WHEN: iterative binary tree traversal (in/pre/post)' },
      'graph-traversal': { proceed: 'WHEN: graph DFS, clone with stack, nested iterator' },
    },
  }),

  'queue-apps-step2': d({
    whenAtThisStep: 'FIFO — BFS, sliding window, or multi-source.',
    xray: [
      { text: '**Level order** traversal of binary tree', kind: 'goal' },
      { text: '**Number of islands** / **word ladder**', kind: 'goal' },
      { text: '**Sliding window maximum**', kind: 'goal' },
    ],
    budget: ['bfs', 'slidingWindow', 'multiSource'],
    sayIt: ['BFS: queue + level-size. Sliding window: deque. Multi-source: push all sources.'],
    branchGuides: {
      'bfs-step3': { proceed: 'WHEN: BFS level order or graph BFS' },
      'sliding-win-queue': { proceed: 'WHEN: sliding window max via deque' },
      'multi-source-bfs': { proceed: 'WHEN: multi-source BFS from all initial nodes' },
    },
  }),

  'bfs-step3': d({
    whenAtThisStep: 'BFS — tree level order or graph traversal.',
    xray: [
      { text: '**Level order** / **zigzag** traversal', kind: 'goal' },
      { text: '**Number of islands** / **rotting oranges**', kind: 'goal' },
    ],
    budget: ['bfs'],
    sayIt: ['Tree: capture level size. Graph: mark visited on push.'],
    branchGuides: {
      'level-order': { proceed: 'WHEN: tree level order, zigzag, populate next right' },
      'graph-bfs': { proceed: 'WHEN: grid BFS, rotting oranges, word ladder' },
    },
  }),

  'task-step2': d({
    whenAtThisStep: 'Task scheduling with ordering constraints.',
    xray: [
      { text: '**Task scheduler** — cooldown between same tasks', kind: 'goal' },
      { text: '**Recent calls** in time window [t-3000, t]', kind: 'goal' },
    ],
    budget: ['taskSchedule'],
    sayIt: ['Greedy: maxFreq * (n+1) + remaining. Queue for time window.'],
    branchGuides: {
      'task-processing': { proceed: 'WHEN: task scheduler, recent calls, snake game' },
    },
  }),

  'specialized-queue-step2': d({
    whenAtThisStep: 'Deque, priority queue, or circular queue.',
    xray: [
      { text: '**Sliding window maximum** with deque', kind: 'goal' },
      { text: '**Kth largest** / **top K frequent**', kind: 'goal' },
      { text: '**Design circular queue**', kind: 'goal' },
    ],
    budget: ['deque', 'priorityQueue', 'circularQueue'],
    sayIt: ['Deque: monotonic for window. PQ: min-heap of size k for top-K. Circular: modulo buffer.'],
    branchGuides: {
      'deque-step3': { proceed: 'WHEN: monotonic deque or general deque simulation' },
      'pq-step3': { proceed: 'WHEN: heap-based selection or greedy scheduling' },
      'circular-queue': { proceed: 'WHEN: fixed-size circular buffer design' },
    },
  }),

  'deque-step3': d({
    whenAtThisStep: 'Deque — monotonic window or general simulation.',
    xray: [
      { text: '**Sliding window maximum** O(n)', kind: 'goal' },
      { text: '**Longest subarray with absolute diff ≤ limit**', kind: 'goal' },
    ],
    budget: ['deque'],
    sayIt: ['Monotonic: maintain max/min deques. General: push_front/pop_back for simulation.'],
    branchGuides: {
      'monotonic-deque': { proceed: 'WHEN: sliding window min/max with two deques' },
      'general-deque': { proceed: 'WHEN: deque simulation or circular deque design' },
    },
  }),

  'pq-step3': d({
    whenAtThisStep: 'Priority queue — top-K or greedy.',
    xray: [
      { text: '**Kth largest** element in array', kind: 'goal' },
      { text: '**Top K frequent** elements', kind: 'goal' },
      { text: '**Last stone weight** / smash two heaviest', kind: 'goal' },
    ],
    budget: ['priorityQueue', 'topK'],
    sayIt: ['Top-K: min-heap of size k. Greedy: max-heap or min-heap of end times.'],
    branchGuides: {
      'topk-select': { proceed: 'WHEN: kth largest, top k frequent' },
      'greedy-sched': { proceed: 'WHEN: last stone weight, meeting rooms II' },
    },
  }),

  'recon-step2': d({
    whenAtThisStep: 'Reconstruct order from constraints.',
    xray: [
      { text: '**Reconstruct queue** by height and k-index', kind: 'goal' },
      { text: '**Dota2 senate** — who wins voting rounds', kind: 'goal' },
    ],
    budget: ['reconstruction'],
    sayIt: ['Sort tall first, insert by k. Or queue front/back elimination.'],
    branchGuides: {
      'queue-recon': { proceed: 'WHEN: reconstruct queue by height or dota senate' },
    },
  }),

  'design-step2': d({
    whenAtThisStep: 'Design stack/queue data structures.',
    xray: [
      { text: 'Design a **min stack** with O(1) getMin', kind: 'goal' },
      { text: '**Implement queue using stacks**', kind: 'goal' },
      { text: '**Maximum frequency stack**', kind: 'goal' },
    ],
    budget: ['stackDesign', 'queueDesign'],
    sayIt: ['Stack: store (value,min) pair. Queue: two stacks transfer. Freq: map + stack-per-freq.'],
    branchGuides: {
      'stack-design': { proceed: 'WHEN: min/max stack, queue via stacks' },
      'queue-design': { proceed: 'WHEN: stack via queues, circular deque, first unique' },
      'combined-struct': { proceed: 'WHEN: freq stack, browser history, combined design' },
    },
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
