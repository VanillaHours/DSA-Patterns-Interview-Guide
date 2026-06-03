import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'dfs-graph': {
    tagline: 'DFS on graph — explore deep before wide, track visited',
    keywords: ['DFS', 'connected components', 'cycle detection', 'topological sort', 'path finding'],
    budget: ['adjList', 'connected', 'cycles', 'reachability'],
  },
  'bfs-graph': {
    tagline: 'BFS on graph — explore level by level, shortest path in unweighted',
    keywords: ['BFS', 'shortest path', 'level order', 'multi-source', 'Kahn\'s'],
    budget: ['shortestPath', 'topological', 'multiSource'],
  },
  'advanced-graph': {
    tagline: 'Advanced graph algorithms — DSU, weighted shortest paths, MST',
    keywords: ['DSU', 'union find', 'Dijkstra', 'Floyd-Warshall', 'Bellman-Ford', 'MST', 'Prim', 'Kruskal'],
    budget: ['weighted', 'negativeWeights', 'mst', 'shortestPath'],
  },
}
