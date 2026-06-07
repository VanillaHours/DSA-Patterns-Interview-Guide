import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'basic-union-find': {
    tagline: 'Core union-find operations: initialization, find, union, and data structure optimizations.',
    keywords: ['union find', 'disjoint set', 'dsu', 'find', 'union', 'path compression', 'union by rank'],
    budget: ['init', 'find', 'union', 'opt'],
  },
  'graph-problems-uf': {
    tagline: 'Graph applications of union-find: components, cycles, MST, equivalence relations.',
    keywords: ['connected components', 'cycle detection', 'minimum spanning tree', 'kruskal', 'equivalence'],
    budget: ['components', 'cycles', 'mst', 'equivalence'],
  },
  'advanced-apps-uf': {
    tagline: 'Advanced union-find: dynamic graphs, grid problems, partitioning, mathematical applications.',
    keywords: ['dynamic graph', 'grid', 'island', 'partition', 'bipartite', 'number theory'],
    budget: ['dynamic', 'grid', 'partition', 'math'],
  },
  'union-variations': {
    tagline: 'Union-find variations: weighted, incremental, and custom-logic DSU structures.',
    keywords: ['weighted union', 'incremental', 'persistent', 'reversible', 'custom dsu'],
    budget: ['weighted', 'incremental', 'custom'],
  },
}
