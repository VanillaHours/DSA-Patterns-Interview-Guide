import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'directed', label: 'Directed graph', group: 'input' },
  { id: 'undirected', label: 'Undirected graph', group: 'input' },
  { id: 'weighted', label: 'Weighted edges', group: 'input' },
  { id: 'grid', label: 'Grid / matrix (2D)', group: 'input' },
  { id: 'adjList', label: 'Adjacency list given/built', group: 'input' },
  { id: 'dag', label: 'DAG (directed acyclic)', group: 'input' },
  { id: 'denseGraph', label: 'Dense graph (many edges)', group: 'input' },
  { id: 'sparseGraph', label: 'Sparse graph (few edges)', group: 'input' },
  { id: 'connected', label: 'Connected components', group: 'structure' },
  { id: 'cycles', label: 'Cycle detection', group: 'structure' },
  { id: 'shortestPath', label: 'Shortest path / min distance', group: 'goal' },
  { id: 'topological', label: 'Topological ordering', group: 'goal' },
  { id: 'reachability', label: 'Reachability / path existence', group: 'goal' },
  { id: 'stronglyConnected', label: 'Strongly connected / SCC', group: 'structure' },
  { id: 'mst', label: 'Minimum spanning tree', group: 'goal' },
  { id: 'kConstraints', label: 'K-step / K-stop constraint', group: 'goal' },
  { id: 'negativeWeights', label: 'Negative weight edges', group: 'input' },
  { id: 'multiSource', label: 'Multiple sources', group: 'input' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
