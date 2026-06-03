import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'intervals', label: 'Intervals / ranges with start-end', group: 'input' },
  { id: 'unsortedIntervals', label: 'Intervals (may need sorting)', group: 'input' },
  { id: 'graphEdges', label: 'Graph edges with weights', group: 'input' },
  { id: 'arrayNums', label: 'Array of integers', group: 'input' },
  { id: 'stringInput', label: 'String processing', group: 'input' },
  { id: 'grid', label: 'Grid / matrix', group: 'input' },
  { id: 'freqCount', label: 'Frequency / count of elements', group: 'structure' },
  { id: 'valueWeight', label: 'Value / weight ratio', group: 'structure' },
  { id: 'prefixState', label: 'Prefix / running state', group: 'structure' },
  { id: 'twoPass', label: 'Two-pass (forward + backward)', group: 'structure' },
  { id: 'inPlace', label: 'In-place O(1) extra space', group: 'space' },
  { id: 'minimize', label: 'Minimize (overlaps, cost, removals)', group: 'goal' },
  { id: 'maximize', label: 'Maximize (profit, count, area)', group: 'goal' },
  { id: 'feasibility', label: 'Feasibility / can-reach decision', group: 'goal' },
  { id: 'nonOverlap', label: 'Non-overlapping / non-conflicting', group: 'goal' },
  { id: 'mst', label: 'Minimum spanning tree', group: 'goal' },
  { id: 'schedule', label: 'Scheduling / ordering', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
