import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'interval-processing': {
    tagline: 'Sort intervals by start/end; pick overlaps or merge ranges.',
    keywords: ['intervals', 'schedule', 'merge', 'sweep line', 'mst'],
    budget: ['sortByEnd', 'greedySelect', 'overlapCheck'],
  },
  'selection-problems': {
    tagline: 'Pick elements based on frequency, value, ratio, or stepwise build.',
    keywords: ['frequency', 'value', 'ratio', 'priority', 'selection'],
    budget: ['countSort', 'heap', 'greedyPick'],
  },
  'greedy-path-search': {
    tagline: 'Make locally optimal moves toward a destination or valid state.',
    keywords: ['jump game', 'path', 'graph', 'string construction'],
    budget: ['reachability', 'maxReach', 'priorityBfs'],
  },
  'prefix-suffix-opt': {
    tagline: 'Running calculations: prefix sums, min/max tracking, two-pass.',
    keywords: ['prefix sum', 'running min', 'running max', 'two-pass', 'cumulative'],
    budget: ['prefix', 'runningExtrema', 'forwardBackward'],
  },
  'incremental-construction': {
    tagline: 'Build result step-by-step, prioritizing the optimal next element.',
    keywords: ['remove k digits', 'monotonic stack', 'exchange argument', 'priority'],
    budget: ['monotonic', 'greedyBuild', 'priorityProcessing'],
  },
}
