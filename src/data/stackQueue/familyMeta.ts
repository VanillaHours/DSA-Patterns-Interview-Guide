import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'stack-apps-step2': {
    tagline: 'LIFO — matching, monotonic properties, or expression parsing',
    keywords: ['parentheses', 'monotonic', 'expression', 'calculator', 'bracket'],
    budget: ['parentheses', 'monotonic', 'expression'],
  },
  'stack-traversal-step2': {
    tagline: 'Iterative DFS with explicit stack for trees and graphs',
    keywords: ['inorder', 'preorder', 'postorder', 'DFS', 'nested iterator'],
    budget: ['treeStack', 'graphStack'],
  },
  'queue-apps-step2': {
    tagline: 'FIFO — BFS, level order, sliding window, multi-source expansion',
    keywords: ['BFS', 'level order', 'sliding window', 'multi-source'],
    budget: ['bfs', 'slidingWindow', 'multiSource'],
  },
  'task-step2': {
    tagline: 'Task ordering with cooldowns or rate-limiting',
    keywords: ['scheduler', 'cooldown', 'recent calls', 'snake game'],
    budget: ['taskSchedule'],
  },
  'specialized-queue-step2': {
    tagline: 'Deque, priority queue, and circular queue specializations',
    keywords: ['deque', 'priority queue', 'heap', 'circular'],
    budget: ['deque', 'priorityQueue', 'circularQueue'],
  },
  'recon-step2': {
    tagline: 'Reconstruct order from relative position constraints',
    keywords: ['reconstruction', 'height', 'senate', 'position'],
    budget: ['reconstruction'],
  },
  'design-step2': {
    tagline: 'Design custom stacks, queues, and combined structures',
    keywords: ['min stack', 'max stack', 'queue with stacks', 'freq stack'],
    budget: ['stackDesign', 'queueDesign'],
  },
}
