import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'disjointSets', label: 'Disjoint set / union-find data structure', group: 'structure' },
  { id: 'dynamicConnectivity', label: 'Dynamic connectivity / component merging', group: 'goal' },
  { id: 'cycleDetection', label: 'Cycle detection in undirected graph', group: 'goal' },
  { id: 'mst', label: 'Minimum spanning tree / Kruskal', group: 'goal' },
  { id: 'componentCount', label: 'Connected component counting', group: 'goal' },
  { id: 'pathCompression', label: 'Path compression (find optimization)', group: 'structure' },
  { id: 'unionByRank', label: 'Union by rank / size (union optimization)', group: 'structure' },
  { id: 'grid2d', label: '2D grid coordinate flattening', group: 'input' },
  { id: 'edgeList', label: 'Edge list input', group: 'input' },
  { id: 'onlineQueries', label: 'Online / streaming queries', group: 'input' },
  { id: 'equalityConstraints', label: 'Equality / inequality constraints', group: 'input' },
  { id: 'weightedEdges', label: 'Weighted edges / custom merge criteria', group: 'structure' },
  { id: 'sizeTracking', label: 'Size / count tracking per component', group: 'structure' },
  { id: 'reverseProcessing', label: 'Reverse processing (offline → online)', group: 'structure' },
  { id: 'elementMapping', label: 'Non-integer element mapping', group: 'input' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
