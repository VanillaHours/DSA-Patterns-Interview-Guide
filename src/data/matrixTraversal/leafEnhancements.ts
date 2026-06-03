import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'island-count': e({
    xray: [
      { text: 'Given an **m x n** grid of characters **\'0\'** and **\'1\'**', kind: 'constraint' },
      { text: 'Return the **number of islands** / **max area** of island', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'island'],
    slottedTemplate: `void dfs(vector<vector<char>>& g, int i, int j) {
    if ({{OUT_OF_BOUNDS}} || g[i][j] != '1') return;
    g[i][j] = '0';
    {{DFS_RECURSE}}
}
// main loop: iterate all cells, call dfs when '1'`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds check', hint: 'i<0||i>=m||j<0||j>=n' },
      { id: 'DFS_RECURSE', label: 'DFS recurse 4-dir', hint: 'dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)' },
    ],
    slotFills: {
      200: { OUT_OF_BOUNDS: 'i<0||i>=g.size()||j<0||j>=g[0].size()', DFS_RECURSE: 'dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1)' },
      695: { OUT_OF_BOUNDS: 'i<0||i>=g.size()||j<0||j>=g[0].size()', DFS_RECURSE: 'int a=1; for(auto& d:dirs) a+=dfs(g,i+d[0],j+d[1]); return a;' },
    },
    helixOrder: [200, 695],
    helixDelta: { 200: 'Count islands — sink each \'1\' found', 695: 'Return area from dfs; track max' },
    autopsies: [
      {
        cause: 'Using visited set instead of in-place sink',
        wrong: 'vector<vector<bool>> vis(m, vector<bool>(n,false));',
        testCase: 'large grid with many islands',
        fix: 'Set grid[i][j] = \'0\' on visit — O(1) space',
      },
      {
        cause: 'Missing bounds check in dfs',
        wrong: 'if (g[i][j] != \'1\') return; // crashes on edge',
        testCase: 'island touching grid boundary',
        fix: 'Check bounds before accessing g[i][j]',
      },
    ],
    sayIt: [
      'DFS on grid. Bounds check first, then process.',
      'Sink each visited cell to avoid revisiting.',
      'For max area: return 1 + sum of 4 neighbors.',
    ],
  }),

  'region-modify': e({
    xray: [
      { text: '**Surrounded regions** — capture all \'O\' surrounded by \'X\'', kind: 'goal' },
      { text: '**Pacific Atlantic** — cells that can flow to both oceans', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'island'],
    slottedTemplate: `void dfs(vector<vector<char>>& b, int i, int j) {
    if ({{OUT_OF_BOUNDS}} || b[i][j] != 'O') return;
    b[i][j] = '#';
    {{DFS_RECURSE}}
}
// 1) dfs from all border cells; 2) flip interior O→X; 3) restore #→O`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds check' },
      { id: 'DFS_RECURSE', label: '4-dir recurse' },
    ],
    slotFills: {
      130: { OUT_OF_BOUNDS: 'i<0||i>=b.size()||j<0||j>=b[0].size()', DFS_RECURSE: 'dfs(b,i+1,j);dfs(b,i-1,j);dfs(b,i,j+1);dfs(b,i,j-1)' },
      417: { OUT_OF_BOUNDS: 'i<0||i>=h.size()||j<0||j>=h[0].size()', DFS_RECURSE: 'dfs(h,i+1,j,prev);dfs(h,i-1,j,prev);dfs(h,i,j+1,prev);dfs(h,i,j-1,prev)' },
    },
    helixDelta: { 130: 'Border DFS → flip interior', 417: 'DFS from both oceans with height constraint' },
    autopsies: [
      {
        cause: 'Flipping O→X before border DFS completes',
        wrong: 'for (i,j) if (board[i][j]==\'O\') board[i][j]=\'X\';',
        testCase: 'O on border gets flipped',
        fix: 'Mark border O as # first, then flip remaining O→X, restore #→O',
      },
    ],
    sayIt: [
      'Surrounded regions: border DFS first, then flip interior.',
      'Pacific Atlantic: DFS from both oceans with non-increasing height condition.',
    ],
  }),

  'backtrack-path': e({
    xray: [
      { text: '**Word search** — check if word exists in grid', kind: 'goal' },
      { text: '**Word search II** — find all words from dictionary', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'backtrack'],
    slottedTemplate: `bool dfs(vector<vector<char>>& b, const string& w, int i, int j, int idx) {
    if (idx == w.size()) return true;
    if ({{OUT_OF_BOUNDS}} || b[i][j] != w[idx]) return false;
    char tmp = b[i][j]; b[i][j] = '#';
    {{BACKTRACK}}
    b[i][j] = tmp;
    return false;
}`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds check' },
      { id: 'BACKTRACK', label: '4-dir backtrack' },
    ],
    slotFills: {
      79: { OUT_OF_BOUNDS: 'i<0||i>=b.size()||j<0||j>=b[0].size()', BACKTRACK: 'for(auto& d:dirs) if(dfs(b,w,i+d[0],j+d[1],idx+1)) return true;' },
      212: { OUT_OF_BOUNDS: 'i<0||i>=b.size()||j<0||j>=b[0].size()', BACKTRACK: `if (node->next[c-'a']) { dfs(b, i+dx, j+dy, node->next[c-'a']); }` },
    },
    helixDelta: { 79: 'DFS backtrack on single word', 212: 'Trie prunes search space' },
    autopsies: [
      {
        cause: 'Not restoring cell after backtrack',
        wrong: 'b[i][j] = \'#\'; // never restored',
        testCase: 'word overlaps with itself via different paths',
        fix: 'Save cell val, mark, recurse, restore',
      },
    ],
    sayIt: [
      'Word search: DFS backtrack; mark cell, recurse 4-dir, restore.',
      'Word Search II: Trie prefixes to prune DFS.',
    ],
  }),

  'unique-path': e({
    xray: [
      { text: '**Unique paths** — robot from top-left to bottom-right', kind: 'goal' },
      { text: '**Unique paths III** — walk all empty cells exactly once', kind: 'goal' },
    ],
    budget: ['grid2d', 'memoGrid'],
    slottedTemplate: `int dfs(int i, int j) {
    if ({{OUT_OF_BOUNDS}}) return 0;
    if ({{GOAL}}) return 1;
    if (memo[i][j] != -1) return memo[i][j];
    return memo[i][j] = {{RECURSE}};
}`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds/obstacle' },
      { id: 'GOAL', label: 'Reached destination' },
      { id: 'RECURSE', label: 'Sum of subpaths' },
    ],
    slotFills: {
      62: { OUT_OF_BOUNDS: 'i>=m||j>=n', GOAL: 'i==m-1&&j==n-1', RECURSE: 'dfs(i+1,j)+dfs(i,j+1)' },
      980: { OUT_OF_BOUNDS: 'g[i][j]==-1', GOAL: 'g[i][j]==2&&left==0', RECURSE: 'dfs(i+1,j,left-1)+dfs(i-1,j,left-1)+dfs(i,j+1,left-1)+dfs(i,j-1,left-1)' },
    },
    helixDelta: { 62: 'Count paths down/right with memo', 980: 'Hamiltonian path count — visit all cells' },
    autopsies: [
      {
        cause: 'No memoization on 62',
        wrong: 'return dfs(i+1,j) + dfs(i,j+1); // no caching',
        testCase: 'm=n=20 — exponential blowup',
        fix: 'memo[i][j] = dfs(i+1,j) + dfs(i,j+1);',
      },
    ],
    sayIt: [
      'Unique paths: DFS + memo (down/right only).',
      'Unique paths III: DFS backtrack visiting ALL empty cells.',
    ],
  }),

  'flood-fill': e({
    xray: [
      { text: '**Flood fill** — replace same-color connected cells', kind: 'goal' },
    ],
    budget: ['grid2d', 'dfsGrid', 'colorFill'],
    slottedTemplate: `void dfs(vector<vector<int>>& img, int i, int j, int color, int orig) {
    if ({{OUT_OF_BOUNDS}} || img[i][j] != orig) return;
    img[i][j] = color;
    {{DFS_RECURSE}}
}`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds check' },
      { id: 'DFS_RECURSE', label: '4-dir recurse' },
    ],
    slotFills: {
      733: { OUT_OF_BOUNDS: 'i<0||i>=img.size()||j<0||j>=img[0].size()', DFS_RECURSE: 'dfs(img,i+1,j,color,orig);dfs(img,i-1,j,color,orig);dfs(img,i,j+1,color,orig);dfs(img,i,j-1,color,orig)' },
      1034: { OUT_OF_BOUNDS: 'i<0||i>=img.size()||j<0||j>=img[0].size()', DFS_RECURSE: 'if on border || adj diff color) img[i][j]=color; else dfs 4-dir' },
    },
    helixDelta: { 733: 'Standard flood fill', 1034: 'Only color border of component' },
    autopsies: [
      {
        cause: 'No check for same input color',
        wrong: 'dfs(img, sr, sc, color, orig); // infinite recursion if orig==color',
        testCase: 'image[sr][sc] already equals color',
        fix: 'if (image[sr][sc] == color) return image;',
      },
    ],
    sayIt: [
      'Flood fill: DFS replace connected same-color; guard same→same.',
      'Coloring border: only cells on grid edge or adjacent to different color get changed.',
    ],
  }),

  'grid-bfs-shortest': e({
    xray: [
      { text: '**Shortest path** in binary matrix (0=open, 1=blocked)', kind: 'goal' },
      { text: '**Nearest exit** from entrance in maze', kind: 'goal' },
    ],
    budget: ['grid2d', 'bfsGrid', 'shortestPath'],
    slottedTemplate: `queue<pair<int,int>> q; q.push({START});
grid[sr][sc] = 1; // mark visited
int dist = 0;
while (!q.empty()) {
    int sz = q.size();
    while (sz--) {
        auto [i,j] = q.front(); q.pop();
        if ({{GOAL}}) return dist;
        for (auto& d : dirs) {
            int ni=i+d[0], nj=j+d[1];
            if ({{IN_BOUNDS}} && grid[ni][nj] == 0) {
                grid[ni][nj] = 1; q.push({ni,nj});
            }
        }
    }
    dist++;
}
return -1;`,
    slots: [
      { id: 'START', label: 'Start cell' },
      { id: 'GOAL', label: 'Goal condition' },
      { id: 'IN_BOUNDS', label: 'Bounds check' },
    ],
    slotFills: {
      1091: { START: '{0,0}', GOAL: 'i==n-1&&j==n-1', IN_BOUNDS: 'ni>=0&&ni<n&&nj>=0&&nj<n' },
      1926: { START: '{si,sj}', GOAL: '(i==0||i==m-1||j==0||j==n-1)&&!(i==si&&j==sj)', IN_BOUNDS: 'ni>=0&&ni<m&&nj>=0&&nj<n' },
    },
    helixOrder: [1091, 1926],
    helixDelta: { 1091: '8-dir BFS, start=end returns 1', 1926: '4-dir BFS from entrance to border' },
    autopsies: [
      {
        cause: 'Not marking visited on enqueue',
        wrong: 'mark visited when popped from queue',
        testCase: 'two paths converge to same cell',
        fix: 'Mark visited when pushing to queue',
      },
    ],
    sayIt: [
      'BFS shortest path: level-order; mark visited on enqueue.',
      '1091: 8-direction. 1926: 4-direction, stop at border.',
    ],
  }),

  'grid-bfs-constrained': e({
    xray: [
      { text: 'Shortest path with **at most k** obstacle eliminations', kind: 'goal' },
    ],
    budget: ['grid2d', 'bfsGrid', 'shortestPath', 'obstacle'],
    slottedTemplate: `queue<tuple<int,int,int,int>> q; // i, j, steps, kLeft
vis[0][0][k] = true; q.push({0,0,0,k});
while (!q.empty()) {
    auto [i,j,d,rem] = q.front(); q.pop();
    for (auto& dir : dirs) {
        int ni=i+dir[0], nj=j+dir[1];
        if ({{OUT}}) continue;
        int nk = rem - grid[ni][nj];
        if (nk < 0 || vis[ni][nj][nk]) continue;
        if (ni==m-1 && nj==n-1) return d+1;
        vis[ni][nj][nk]=true; q.push({ni,nj,d+1,nk});
    }
}`,
    slots: [
      { id: 'OUT', label: 'Out of bounds' },
    ],
    slotFills: {
      1293: { OUT: 'ni<0||ni>=m||nj<0||nj>=n' },
    },
    helixDelta: { 1293: 'BFS with remaining removals as state' },
    autopsies: [
      {
        cause: 'Visited only by position, not by kLeft',
        wrong: 'bool vis[41][41] = {};',
        testCase: 'reach same cell with more remaining removals first',
        fix: 'vis[i][j][k] — include remaining eliminations in state',
      },
    ],
    sayIt: [
      'BFS with obstacle elimination: state = (i, j, kLeft).',
      'visited[i][j][k] prevents revisiting with same or fewer k.',
    ],
  }),

  'grid-multi-source': e({
    xray: [
      { text: '**Rotting oranges** — every minute fresh adjacent to rotten rots', kind: 'goal' },
      { text: '**As far from land** — max distance from any land cell', kind: 'goal' },
    ],
    budget: ['grid2d', 'bfsGrid', 'multiSource'],
    slottedTemplate: `queue<pair<int,int>> q;
{{INIT_SOURCES}}
int minutes = 0;
while (!q.empty()) {
    int sz = q.size();
    while (sz--) {
        auto [i,j] = q.front(); q.pop();
        for (auto& d : dirs) {
            int ni=i+d[0], nj=j+d[1];
            if ({{IN_BOUNDS}} && {{SPREAD_COND}}) {
                {{MARK}}; q.push({ni,nj});
            }
        }
    }
    minutes++;
}`,
    slots: [
      { id: 'INIT_SOURCES', label: 'Push all sources' },
      { id: 'IN_BOUNDS', label: 'Bounds check' },
      { id: 'SPREAD_COND', label: 'Spread condition' },
      { id: 'MARK', label: 'Mark as visited' },
    ],
    slotFills: {
      994: { INIT_SOURCES: 'for(i,j) if(grid[i][j]==2) q.push({i,j}); else if(grid[i][j]==1) fresh++;', IN_BOUNDS: 'ni>=0&&ni<m&&nj>=0&&nj<n', SPREAD_COND: 'grid[ni][nj]==1', MARK: 'grid[ni][nj]=2; fresh--' },
      1162: { INIT_SOURCES: 'for(i,j) if(grid[i][j]==1) { q.push({i,j}); dist[i][j]=0; } else dist[i][j]=INT_MAX;', IN_BOUNDS: 'ni>=0&&ni<m&&nj>=0&&nj<n', SPREAD_COND: 'dist[ni][nj] > dist[i][j]+1', MARK: 'dist[ni][nj]=dist[i][j]+1; q.push({ni,nj})' },
    },
    helixOrder: [994, 1162],
    helixDelta: { 994: 'Rot spread minute by minute', 1162: 'Max distance from nearest land' },
    autopsies: [
      {
        cause: 'Not tracking fresh count for early exit in 994',
        wrong: 'BFS without fresh count; always return minutes-1',
        testCase: 'oranges unreachable from rotten',
        fix: 'Track fresh count; if fresh>0 after BFS return -1',
      },
    ],
    sayIt: [
      'Multi-source BFS: push all sources initially.',
      '994: track fresh count; return -1 if unreachable.',
      '1162: level BFS from all lands, track max dist.',
    ],
  }),

  diagonal: e({
    xray: [
      { text: 'Return matrix elements in **diagonal order** (zigzag)', kind: 'goal' },
    ],
    budget: ['grid2d', 'diagonal'],
    slottedTemplate: `for (int s = 0; s < m + n - 1; s++) {
    if ({{DIR_COND}}) {
        int i = {{START_I}}, j = {{START_J}};
        while ({{BOUNDS}}) out.push_back(mat[i--][j++]);
    } else {
        int j = {{START_J2}}, i = {{START_I2}};
        while ({{BOUNDS2}}) out.push_back(mat[i++][j--]);
    }
}`,
    slots: [
      { id: 'DIR_COND', label: 'Direction (even/odd)' },
      { id: 'START_I', label: 'Start row for up-right' },
      { id: 'START_J', label: 'Start col for up-right' },
      { id: 'BOUNDS', label: 'Up-right bounds' },
    ],
    slotFills: {
      498: { DIR_COND: 's%2==0', START_I: 'min(s,m-1)', START_J: 's-i', BOUNDS: 'i>=0&&j<n' },
    },
    helixDelta: { 498: 'Alternating diagonal direction per sum parity' },
    autopsies: [
      {
        cause: 'Direction confusion — even vs odd sum',
        wrong: 'all diagonals traversed same direction',
        testCase: '3×3 matrix',
        fix: 'Even sum s: up-right (i--,j++). Odd sum s: down-left (i++,j--).',
      },
    ],
    sayIt: [
      'Diagonal traverse: s = i + j from 0 to m+n-2.',
      'Even s: up-right (i--,j++). Odd s: down-left (i++,j--).',
    ],
  }),

  spiral: e({
    xray: [
      { text: 'Return matrix elements in **spiral order**', kind: 'goal' },
      { text: 'Generate matrix in **spiral order** filling 1..n²', kind: 'goal' },
    ],
    budget: ['grid2d', 'spiral'],
    slottedTemplate: `int t=0, b=m-1, l=0, r=n-1;
while (t <= b && l <= r) {
    for (int j=l; j<=r; j++) {{RIGHT}}; t++;
    for (int i=t; i<=b; i++) {{DOWN}}; r--;
    if (t <= b) for (int j=r; j>=l; j--) {{LEFT}}; b--;
    if (l <= r) for (int i=b; i>=t; i--) {{UP}}; l++;
}`,
    slots: [
      { id: 'RIGHT', label: 'Right move' },
      { id: 'DOWN', label: 'Down move' },
      { id: 'LEFT', label: 'Left move' },
      { id: 'UP', label: 'Up move' },
    ],
    slotFills: {
      54: { RIGHT: 'out.push_back(matrix[t][j])', DOWN: 'out.push_back(matrix[i][r])', LEFT: 'out.push_back(matrix[b][j])', UP: 'out.push_back(matrix[i][l])' },
      59: { RIGHT: 'matrix[t][j]=val++', DOWN: 'matrix[i][r]=val++', LEFT: 'matrix[b][j]=val++', UP: 'matrix[i][l]=val++' },
    },
    helixOrder: [54, 59],
    helixDelta: { 54: 'Read spiral order', 59: 'Write spiral order' },
    autopsies: [
      {
        cause: 'No boundary guards after right+down moves',
        wrong: 'no if (t<=b) / if (l<=r) guards',
        testCase: 'single row or column matrix',
        fix: 'Guard left and up moves with if (t<=b) and if (l<=r)',
      },
    ],
    sayIt: [
      'Spiral: shrink t,b,l,r. Guard left/up moves after right/down.',
      '54: read elements. 59: write incrementing values.',
    ],
  }),

  rotate: e({
    xray: [
      { text: '**Rotate** the image 90° clockwise **in-place**', kind: 'goal' },
    ],
    budget: ['grid2d', 'rotate'],
    slottedTemplate: `for (int i = 0; i < n/2; i++) {
    for (int j = i; j < n-1-i; j++) {
        {{FOUR_WAY_SWAP}}
    }
}`,
    slots: [
      { id: 'FOUR_WAY_SWAP', label: '4-way cyclic swap' },
    ],
    slotFills: {
      48: { FOUR_WAY_SWAP: 'int tmp=matrix[i][j]; matrix[i][j]=matrix[n-1-j][i]; matrix[n-1-j][i]=matrix[n-1-i][n-1-j]; matrix[n-1-i][n-1-j]=matrix[j][n-1-i]; matrix[j][n-1-i]=tmp;' },
    },
    helixDelta: { 48: '4-way swap per layer' },
    autopsies: [
      {
        cause: 'Iterating all cells (not just layer boundary)',
        wrong: 'for(i=0;i<n;i++) for(j=0;j<n;j++) swap(...)',
        testCase: '4×4 matrix',
        fix: 'i iterates 0 to n/2-1; j iterates i to n-1-i',
      },
      {
        cause: 'Wrong direction (counter-clockwise)',
        wrong: 'wrong swap order',
        testCase: '2×2 matrix',
        fix: 'Trace 4-way swap clockwise: top→right→bottom→left→top',
      },
    ],
    sayIt: [
      'Rotate 90°: 4-way swap on each layer.',
      'i loops 0..n/2-1, j loops i..n-2-i.',
    ],
  }),

  'shape-boundary': e({
    xray: [
      { text: '**Cyclically rotate** each boundary layer of grid', kind: 'goal' },
    ],
    budget: ['grid2d', 'rotate'],
    slottedTemplate: `// Extract layer → rotate 1D → write back
vector<int> layer;
for (int j=l; j<r; j++) layer.push_back(grid[t][j]);
for (int i=t; i<b; i++) layer.push_back(grid[i][r]);
for (int j=r; j>l; j--) layer.push_back(grid[b][j]);
for (int i=b; i>t; i--) layer.push_back(grid[i][l]);
{{ROTATE_1D}}
// Write back from layer into grid perimeter`,
    slots: [
      { id: 'ROTATE_1D', label: '1D rotation of layer' },
    ],
    slotFills: {
      1914: { ROTATE_1D: 'int len=layer.size(), rot=k%len; rotate(layer.begin(), layer.begin()+(len-rot), layer.end());' },
    },
    helixDelta: { 1914: 'Extract boundary ring → rotate → write back' },
    autopsies: [
      {
        cause: 'Clockwise vs counter-clockwise rotation direction',
        wrong: 'rotating layer in wrong direction',
        testCase: '2×2 grid rotate 1',
        fix: 'Use (len - rot) for clockwise rotation offset',
      },
    ],
    sayIt: [
      'Cyclic rotation: extract perimeter as 1D array, rotate, write back.',
      'k may exceed layer size → k %= len.',
    ],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
