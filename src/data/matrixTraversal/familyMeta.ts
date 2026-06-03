import type { FamilyMeta } from '../../types/leafEnhancement'

export const FAMILY_META: Record<string, FamilyMeta> = {
  'grid-dfs-step2': {
    tagline: 'DFS on 2D grid — explore connected cells recursively',
    keywords: ['DFS', 'grid', 'island', 'flood fill', 'backtrack', 'region'],
    budget: ['grid2d', 'dfsGrid', 'island', 'backtrack'],
  },
  'grid-bfs-step2': {
    tagline: 'BFS on 2D grid — shortest path or multi-source spread',
    keywords: ['BFS', 'grid', 'shortest path', 'queue', 'multi-source'],
    budget: ['grid2d', 'bfsGrid', 'shortestPath', 'multiSource'],
  },
  'specialized-step2': {
    tagline: 'Specialized matrix traversals — diagonal, spiral, rotation',
    keywords: ['diagonal', 'spiral', 'rotate', 'matrix', 'cyclic'],
    budget: ['grid2d', 'diagonal', 'spiral', 'rotate'],
  },
}
