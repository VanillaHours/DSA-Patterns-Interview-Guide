import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const islandRegionNode: TaxonomyNode = decision(
  'island-region-step3',
  'Island/Region Problems — count, modify, or mark?',
  'blue',
  3,
  'Grid of chars/ints; connected regions. Match the goal:',
  [
    branch(
      [
        '"number of islands" / count connected regions',
        '"max area" of contiguous island',
        'grid of \'0\' and \'1\' chars',
      ],
      'Connected Region Counting',
      'DFS sink each \'1\'; count how many times you start a DFS.',
      L.islandCountLeaf,
    ),
    branch(
      [
        '"surrounded regions" / flip O surrounded by X',
        '"pacific atlantic" water flow from both oceans',
        'border-connected cells should NOT be flipped',
      ],
      'Region Modification',
      'DFS from border cells first; then flip interior.',
      L.regionModifyLeaf,
    ),
  ],
)

const pathRouteNode: TaxonomyNode = decision(
  'path-route-step3',
  'Path & Route Finding — track path or count paths?',
  'teal',
  3,
  'Find a path string or count number of paths on grid:',
  [
    branch(
      [
        '"word search" / find sequence of chars adjacency',
        'DFS backtrack with visited mark',
        'match string path on grid',
      ],
      'Backtracking Path Search',
      'DFS from each cell; backtrack when mismatch.',
      L.backtrackPathLeaf,
      ['only count paths, not enumerate'],
    ),
    branch(
      [
        '"unique paths" / count ways from top-left to bottom-right',
        'robot moving down/right',
        '"unique paths III" walk all cells exactly once',
      ],
      'Unique Path Counting',
      'DFS + memo for count; DFS backtrack for Hamiltonian.',
      L.uniquePathLeaf,
      ['find string path on grid'],
    ),
  ],
)

const floodFillNode: TaxonomyNode = decision(
  'flood-fill-step3',
  'Flood Fill — what gets replaced?',
  'blue',
  3,
  'Start from (sr, sc); replace connected cells of same color:',
  [
    branch(
      [
        '"flood fill" / replace adjacent same-color pixels',
        'painting tool metaphor (image editor)',
        'DFS change all connected same color',
      ],
      'Standard Flood Fill',
      'DFS replace orig color with new color; guard same->same.',
      L.floodFillLeaf,
    ),
  ],
)

const gridDfsNode: TaxonomyNode = decision(
  'grid-dfs-step2',
  '2D Grid DFS — what is the goal on this grid?',
  'blue',
  2,
  'Grid input; you can move in 4 directions. Which category?',
  [
    branch(
      [
        '"island" / "region" / connected components',
        'count or flip connected cells',
      ],
      'Island/Region Problems',
      'DFS or BFS to explore connected cells; sink or mark.',
      islandRegionNode,
      ['word path search', 'count unique paths'],
    ),
    branch(
      [
        '"word search" on grid',
        '"unique paths" in grid',
        'find or count routes through cells',
      ],
      'Path & Route Finding',
      'DFS backtrack for string match; DFS+memo for counting.',
      pathRouteNode,
      ['flood fill region', 'island counting'],
    ),
    branch(
      [
        '"flood fill" / paint bucket',
        'replace connected same-color region with new color',
      ],
      'Flood Fill',
      'DFS replace color; early return if same color.',
      floodFillNode,
      ['island counting', 'word search'],
    ),
  ],
)

const shortestPathNode: TaxonomyNode = decision(
  'shortest-path-step3',
  'Shortest Path — any constraints on movement?',
  'green',
  3,
  'BFS on grid for shortest path. Check movement rules:',
  [
    branch(
      [
        '"shortest path in binary matrix" (8-dir or 4-dir)',
        '"nearest exit from entrance" in maze',
        'BFS with distance counter; no special constraints',
      ],
      'Basic Grid BFS',
      'Level-order BFS; mark visited on enqueue.',
      L.gridBfsShortestLeaf,
      ['obstacle elimination / k removals'],
    ),
    branch(
      [
        '"shortest path with obstacle elimination"',
        'at most k obstacles can be removed',
        'BFS with state dimension for remaining removals',
      ],
      'Constrained Movement',
      'BFS with (i,j,kLeft) state; skip if k<0.',
      L.gridBfsConstrainedLeaf,
      ['standard BFS without removals'],
    ),
  ],
)

const gridBfsNode: TaxonomyNode = decision(
  'grid-bfs-step2',
  '2D Grid BFS — single source or multi-source?',
  'green',
  2,
  'BFS on grid. Do you start from one cell or many?',
  [
    branch(
      [
        '"shortest path" from entrance to exit',
        '"shortest path in binary matrix"',
        'single start, single or multiple targets',
      ],
      'Shortest Path in Grid',
      'Standard BFS from single source with distance tracking.',
      shortestPathNode,
      ['multiple simultaneous sources'],
    ),
    branch(
      [
        '"rotting oranges" / spread from rotten',
        '"as far from land as possible"',
        'multiple simultaneous sources infect/propagate',
      ],
      'Multi-Source BFS',
      'Push all sources into queue initially; level-order spread.',
      L.gridMultiSourceLeaf,
      ['single source shortest path'],
    ),
  ],
)

const shapeBasedNode: TaxonomyNode = decision(
  'shape-based-step3',
  'Shape-Based — rotate or cycle the grid?',
  'amber',
  3,
  'Modify the grid shape in-place. Pick operation:',
  [
    branch(
      [
        '"rotate image" 90° clockwise',
        'in-place matrix rotation',
        'O(1) extra space, n×n matrix',
      ],
      'Rotational',
      '4-way swap per layer; iterate n/2 layers.',
      L.rotateLeaf,
      ['cyclic boundary rotation'],
    ),
    branch(
      [
        '"cyclically rotating a grid"',
        'rotate each boundary layer by k steps',
        'extract layer, rotate, place back',
      ],
      'Boundary',
      'Extract each perimeter ring into 1D, rotate C++ style, write back.',
      L.shapeBoundaryLeaf,
      ['in-place 90° rotation'],
    ),
  ],
)

const specializedNode: TaxonomyNode = decision(
  'specialized-step2',
  'Specialized Matrix Patterns — traversal or transformation?',
  'pink',
  2,
  'Matrix has a specific traversal order or transformation rule:',
  [
    branch(
      [
        '"diagonal traverse" / zigzag diagonal',
        'iterate matrix in diagonal order with alternating direction',
      ],
      'Diagonal Traversals',
      's=i+j loop; flip direction per s parity.',
      L.diagonalLeaf,
      ['spiral order', 'rotate'],
    ),
    branch(
      [
        '"spiral matrix" / print in clockwise spiral',
        '"spiral matrix II" / fill matrix spirally',
      ],
      'Spiral Traversals',
      'Shrink t,b,l,r boundaries; guard against double-read.',
      L.spiralLeaf,
      ['diagonal traverse', 'rotate'],
    ),
    branch(
      [
        '"rotate image" 90° in-place',
        '"cyclically rotating a grid" layer by layer',
        'transform matrix shape in-place',
      ],
      'Shape-Based Traversals',
      'In-place rotation or cyclic layer rotation.',
      shapeBasedNode,
      ['spiral/diagonal read-order only'],
    ),
  ],
)

export const matrixRoot: TaxonomyNode = decision(
  'matrix-root',
  'Matrix Traversals',
  'slate',
  1,
  'Input is a 2D grid/matrix. How do you move through it?',
  [
    branch(
      [
        '"island" / "word search" / "unique paths"',
        '"flood fill" / connected region',
        'DFS recursion on grid cells',
        '4-direction exploration',
      ],
      '2D Grid DFS',
      'Recursive depth-first cell exploration; stack/recursion-based.',
      gridDfsNode,
      ['shortest path BFS', 'diagonal/spiral order'],
    ),
    branch(
      [
        '"shortest path" / distance in steps',
        '"rotting oranges" / multi-source spread',
        'BFS level-order on grid',
        'queue-based traversal',
      ],
      '2D Grid BFS',
      'Level-order BFS; queue; shortest distance in unweighted grid.',
      gridBfsNode,
      ['DFS recursive exploration', 'specialized traversal order'],
    ),
    branch(
      [
        '"diagonal" traverse order',
        '"spiral" order / clockwise spiral',
        '"rotate" matrix in-place',
        'specific non-standard traversal pattern',
      ],
      'Specialized Matrix Patterns',
      'Non-recursive, non-BFS traversal order — diagonal, spiral, or transform.',
      specializedNode,
      ['island DFS', 'shortest path BFS'],
    ),
  ],
)
