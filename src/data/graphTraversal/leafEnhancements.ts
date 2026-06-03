import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'basic-connectivity': e({
    xray: [
      { text: 'Given an **m x n grid** of 0s and 1s, return the number of **islands**', kind: 'goal' },
      { text: 'There are **n cities**, some connected — count **provinces**', kind: 'goal' },
    ],
    budget: ['connected', 'grid'],
    slottedTemplate: `void dfs({{GRAPH_TYPE}}& g, int i, int j, vector<vector<bool>>& vis) {
    int m = g.size(), n = g[0].size();
    if (i<0||i>=m||j<0||j>=n||{{SKIP_COND}}||vis[i][j]) return;
    vis[i][j] = true;
    {{DIRECTION_LOOP}}
}
int countComponents({{GRAPH_TYPE}}& g) {
    int m = g.size(), n = g[0].size(), ans = 0;
    vector<vector<bool>> vis(m, vector<bool>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if ({{START_COND}}) { ans++; dfs(g, i, j, vis); }
    return ans;
}`,
    slots: [
      { id: 'GRAPH_TYPE', label: 'Graph container', hint: 'vector<vector<int>> for grid' },
      { id: 'SKIP_COND', label: 'Skip cell', hint: 'grid[i][j]==0 for islands' },
      { id: 'DIRECTION_LOOP', label: 'DFS neighbor loop', hint: '4-direction or adjacency list' },
      { id: 'START_COND', label: 'Start DFS condition', hint: 'grid[i][j]==1 && !vis[i][j]' },
    ],
    slotFills: {
      200: { GRAPH_TYPE: 'vector<vector<int>>', SKIP_COND: 'grid[i][j]==0', DIRECTION_LOOP: 'dfs(grid,i+1,j,vis); dfs(grid,i-1,j,vis); dfs(grid,i,j+1,vis); dfs(grid,i,j-1,vis);', START_COND: 'grid[i][j]==1 && !vis[i][j]' },
      547: { GRAPH_TYPE: 'int', SKIP_COND: '!M[u][v]', DIRECTION_LOOP: 'for(int v=0;v<M.size();v++) if(M[u][v]&&!vis[v]) dfs(v,M,vis);', START_COND: '!vis[i]' },
    },
    helixOrder: [200, 547],
    helixDelta: {
      200: 'Grid DFS — 4-direction island counting',
      547: 'Adj matrix DFS — adjacency from M[i][j]==1',
    },
    autopsies: [
      {
        cause: 'Forgetting visited check before recursive call',
        wrong: 'for each neighbor: dfs(v, adj, vis) // no visited guard',
        testCase: 'Complete graph with cycle',
        fix: 'if (!vis[v]) dfs(v, adj, vis);',
      },
      {
        cause: 'Using int for visited on grid — easier with bool[][]',
        wrong: 'vector<vector<int>> vis; vis[i][j] = 1;',
        testCase: 'Large grid',
        fix: 'vector<vector<bool>> vis(m, vector<bool>(n));',
      },
    ],
    sayIt: [
      'DFS component count: iterate unvisited cells, run DFS, increment count.',
      'Grid: 4-direction. Adj matrix: loop over neighbors.',
    ],
  }),

  'component-size': e({
    xray: [
      { text: 'Return the **maximum area** of an island in grid', kind: 'goal' },
      { text: 'Return the number of **closed islands**', kind: 'goal' },
    ],
    budget: ['connected', 'grid'],
    slottedTemplate: `int dfs({{GRAPH_TYPE}}& g, int i, int j, vector<vector<bool>>& vis) {
    if ({{OUT_OF_BOUNDS}}||{{SKIP_COND}}||vis[i][j]) return 0;
    vis[i][j] = true;
    return 1 + {{SUM_NEIGHBORS}};
}`,
    slots: [
      { id: 'OUT_OF_BOUNDS', label: 'Bounds check' },
      { id: 'SUM_NEIGHBORS', label: 'Sum of neighbor DFS returns' },
    ],
    slotFills: {
      695: { OUT_OF_BOUNDS: 'i<0||i>=m||j<0||j>=n', SKIP_COND: 'grid[i][j]==0', SUM_NEIGHBORS: 'dfs(grid,i+1,j,vis)+dfs(grid,i-1,j,vis)+dfs(grid,i,j+1,vis)+dfs(grid,i,j-1,vis)' },
      1254: { OUT_OF_BOUNDS: 'i<0||i>=m||j<0||j>=n', SKIP_COND: 'grid[i][j]==1', SUM_NEIGHBORS: 'dfs(grid,i+1,j,vis)+dfs(grid,i-1,j,vis)+dfs(grid,i,j+1,vis)+dfs(grid,i,j-1,vis)' },
    },
    helixOrder: [695, 1254],
    helixDelta: {
      695: 'DFS returns size — track max',
      1254: 'First mark edge-land, then count inner components',
    },
    autopsies: [
      {
        cause: 'Not returning sum of recursive calls',
        wrong: 'dfs returns void; global counter incremented',
        testCase: 'Multiple branches of island',
        fix: 'return 1 + recursive sums',
      },
    ],
    sayIt: [
      'DFS that returns 1 + sum of neighbor DFS results.',
      '695: max area. 1254: first zero out edge-land, then count.',
    ],
  }),

  'undirected-cycle': e({
    xray: [
      { text: 'Find the **redundant edge** that creates a cycle', kind: 'goal' },
    ],
    budget: ['cycles', 'undirected'],
    slottedTemplate: `bool dfs(int u, int parent, vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) { if (dfs(v, u, adj, vis)) return true; }
        else if (v != parent) return true;
    }
    return false;
}`,
    slots: [],
    slotFills: { 684: {} },
    helixDelta: { 684: 'DSU is easier — union until false return' },
    autopsies: [
      {
        cause: 'Not passing parent to DFS',
        wrong: 'if (vis[v]) return true // false positive on parent',
        testCase: 'Two nodes with one edge (0-1)',
        fix: 'else if (v != parent) return true;',
      },
    ],
    sayIt: [
      'Undirected cycle: DFS with parent tracking. DSU alternative: union edges until false.',
    ],
  }),

  'directed-cycle': e({
    xray: [
      { text: 'Return **true** if all courses can be finished (no cycle)', kind: 'goal' },
      { text: 'Return list of **safe nodes** (no cycle reachable)', kind: 'goal' },
    ],
    budget: ['cycles', 'directed'],
    slottedTemplate: `bool dfs(int u, vector<vector<int>>& adj, vector<int>& state) {
    if (state[u] == 1) return true;
    if (state[u] == 2) return false;
    state[u] = 1;
    for (int v : adj[u]) if (dfs(v, adj, state)) return true;
    state[u] = 2;
    return false;
}`,
    slots: [],
    slotFills: {
      207: {},
      802: {},
    },
    helixDelta: {
      207: '3-state DFS — cycle detection',
      802: 'Collect nodes with state == 2 (safe)',
    },
    autopsies: [
      {
        cause: 'Using just visited (2-state) for directed cycles',
        wrong: 'if (vis[v]) cycle // wrong for directed graph',
        testCase: 'DAG with cross edge: 0→1, 0→2, 1→2',
        fix: '3-state: 0=unvisited, 1=visiting, 2=done',
      },
    ],
    sayIt: [
      'Directed cycle: 3-state DFS (unvisited/visiting/done).',
      'State 1 means back edge → cycle.',
    ],
  }),

  'all-paths': e({
    xray: [
      { text: 'Return **all paths** from node 0 to node n-1 in DAG', kind: 'goal' },
    ],
    budget: ['reachability', 'dag'],
    slottedTemplate: `void dfs(int u, int target, vector<vector<int>>& adj, vector<int>& path, vector<vector<int>>& res) {
    path.push_back(u);
    if (u == target) res.push_back(path);
    else for (int v : adj[u]) dfs(v, target, adj, path, res);
    path.pop_back();
}`,
    slots: [],
    slotFills: { 797: {} },
    helixDelta: { 797: 'Backtracking DFS on DAG' },
    autopsies: [
      {
        cause: 'Push all neighbors then pop all at once',
        wrong: 'path.push_back(u); for(v) dfs(v); path.pop_back(); // nothing wrong but subtle',
        testCase: 'Long path',
        fix: 'Push u before loop, pop after. Path captures node when at target.',
      },
    ],
    sayIt: [
      'Backtracking: push current node, recurse, pop. Copy path only at target.',
      'For DAG only — cycles cause infinite recursion.',
    ],
  }),

  'path-existence': e({
    xray: [
      { text: 'Return **true** if a path exists from source to destination', kind: 'goal' },
    ],
    budget: ['reachability'],
    slottedTemplate: `bool dfs(int u, int target, vector<vector<int>>& adj, vector<bool>& vis) {
    if (u == target) return true;
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v] && dfs(v, target, adj, vis)) return true;
    return false;
}`,
    slots: [],
    slotFills: { 1971: {} },
    helixDelta: { 1971: 'Simple reachability DFS/BFS' },
    autopsies: [
      {
        cause: 'Forgetting undirected graph needs bidirectional edges',
        wrong: 'adj[e[0]].push_back(e[1]); // no reverse edge',
        testCase: 'Edge 0-1 in undirected graph',
        fix: 'adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]);',
      },
    ],
    sayIt: [
      'Path existence: DFS from src to dest with visited set.',
      'Undirected: build both directions. BFS works too.',
    ],
  }),

  'topological-dfs': e({
    xray: [
      { text: 'Return the **ordering of courses** to finish all', kind: 'goal' },
      { text: 'Return the **order of letters** in alien dictionary', kind: 'goal' },
    ],
    budget: ['topological', 'dag'],
    slottedTemplate: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& vis, stack<int>& st) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v, adj, vis, st);
    st.push(u);
}`,
    slots: [],
    slotFills: {
      210: {},
      269: {},
    },
    helixDelta: {
      210: 'Standard DFS topological sort — postorder onto stack',
      269: 'Build edges from adjacent word pairs, then DFS topo sort',
    },
    autopsies: [
      {
        cause: 'Not checking for cycle in topo sort',
        wrong: 'No 3-state — just pushes to stack',
        testCase: 'Graph with cycle',
        fix: 'Add 3-state cycle detection during DFS',
      },
    ],
    sayIt: [
      'DFS topological sort: push node onto stack AFTER visiting all neighbors.',
      'Finally pop entire stack for order.',
    ],
  }),

  'bfs-shortest': e({
    xray: [
      { text: '**Shortest path** in binary matrix (8-dir, clear cells only)', kind: 'goal' },
      { text: '**Minutes** until all oranges rot (multi-source BFS)', kind: 'goal' },
      { text: '**Shortest transformation** from beginWord to endWord', kind: 'goal' },
    ],
    budget: ['shortestPath'],
    slottedTemplate: `queue<{{NODE_TYPE}}> q;
vector<vector<int>> dist({{DIMS}}, -1);
{{INIT_SOURCES}}
while (!q.empty()) {
    auto cur = q.front(); q.pop();
    {{EXPAND_NEIGHBORS}}
}`,
    slots: [
      { id: 'NODE_TYPE', label: 'Node type', hint: 'pair<int,int> or string' },
      { id: 'DIMS', label: 'Distance dimensions', hint: 'm, vector<int>(n)' },
      { id: 'INIT_SOURCES', label: 'Initialize sources', hint: 'push start(s); dist=0' },
      { id: 'EXPAND_NEIGHBORS', label: 'Neighbor expansion', hint: 'for directions, push if unvisited' },
    ],
    slotFills: {
      1091: { NODE_TYPE: 'pair<int,int>', DIMS: 'm, vector<int>(n)', INIT_SOURCES: 'q.push({0,0}); dist[0][0]=0;', EXPAND_NEIGHBORS: 'for 8 dirs: if grid[nr][nc]==0&&dist[nr][nc]==-1 { dist[nr][nc]=dist[r][c]+1; q.push({nr,nc}); }' },
      994: { NODE_TYPE: 'pair<int,int>', DIMS: 'm, vector<int>(n)', INIT_SOURCES: 'for each rotten (i,j): q.push({i,j});', EXPAND_NEIGHBORS: 'for 4 dirs: if fresh { rot it; fresh--; q.push; }' },
      127: { NODE_TYPE: 'string', DIMS: '1', INIT_SOURCES: 'q.push(beginWord); dist[beginWord]=1;', EXPAND_NEIGHBORS: 'for each char: try a..z; if in dict && !visited { dist[neigh]=dist[cur]+1; q.push(neigh); }' },
    },
    helixOrder: [1091, 994, 127],
    helixDelta: {
      1091: 'Single-source BFS on grid (8-dir)',
      994: 'Multi-source BFS with fresh counter',
      127: 'Implicit graph BFS — word neighbors',
    },
    autopsies: [
      {
        cause: 'DFS instead of BFS for shortest path',
        wrong: 'DFS returns first found path, not shortest',
        testCase: 'Grid with multiple paths of different lengths',
        fix: 'Use BFS — first time node visited is shortest distance',
      },
    ],
    sayIt: [
      'Shortest path in unweighted graph → BFS.',
      'Grid: BFS with distance matrix. Word ladder: BFS on implicit graph.',
    ],
  }),

  'bfs-level': e({
    xray: [
      { text: 'Return a matrix of **distances to nearest 0**', kind: 'goal' },
      { text: 'Find the **farthest cell** from any land', kind: 'goal' },
    ],
    budget: ['shortestPath', 'multiSource'],
    slottedTemplate: `queue<pair<int,int>> q;
vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        if ({{SOURCE_COND}}) { dist[i][j] = 0; q.push({i,j}); }
while (!q.empty()) {
    auto [r,c] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
        int nr = r + dirs[d], nc = c + dirs[d+1];
        if (nr>=0 && nr<m && nc>=0 && nc<n && dist[nr][nc] > dist[r][c] + 1) {
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr,nc});
        }
    }
}`,
    slots: [
      { id: 'SOURCE_COND', label: 'Source condition', hint: 'mat[i][j]==0 for 01 matrix' },
    ],
    slotFills: {
      542: { SOURCE_COND: 'mat[i][j] == 0' },
      1162: { SOURCE_COND: 'grid[i][j] == 1' },
    },
    helixDelta: {
      542: 'Multi-source from all zeros',
      1162: 'Multi-source from all land, track max distance',
    },
    autopsies: [
      {
        cause: 'Single-source BFS for 01 matrix',
        wrong: 'BFS from each 1 individually — O(n²) extra',
        testCase: 'Large matrix',
        fix: 'Push ALL sources initially — one BFS pass O(mn)',
      },
    ],
    sayIt: [
      'Multi-source BFS for distance from nearest source.',
      'Init dist=0 for all source cells; queue them all; BFS outward.',
    ],
  }),

  'multi-source-simul': e({
    xray: [
      { text: 'Return **minutes** until all oranges rot', kind: 'goal' },
    ],
    budget: ['multiSource', 'shortestPath'],
    slottedTemplate: `int sz = q.size();
while (sz--) {
    {{PROCESS_CELL}}
}
minutes++;`,
    slots: [
      { id: 'PROCESS_CELL', label: 'Process one cell at current level' },
    ],
    slotFills: {
      994: { PROCESS_CELL: 'for 4 dir: if grid[nr][nc]==1 { grid[nr][nc]=2; fresh--; q.push({nr,nc}); }' },
      542: { PROCESS_CELL: 'for 4 dir: if dist[nr][nc] > dist[r][c]+1 { dist[nr][nc]=dist[r][c]+1; q.push({nr,nc}); }' },
    },
    helixDelta: {
      994: 'Level-order multi-source with minutes counter',
      542: 'Same approach using distance grid',
    },
    autopsies: [
      {
        cause: 'Incrementing minutes per orange not per level',
        wrong: 'while(!q.empty()) { ... minutes++; }',
        testCase: 'Multiple oranges rot at same minute',
        fix: 'Level-order: int sz=q.size(); while(sz--) { ... } minutes++;',
      },
    ],
    sayIt: ['Multi-source level-order BFS. Track level boundary with sz = q.size().'],
  }),

  'multi-source-boundary': e({
    xray: [
      { text: 'Capture all **surrounded regions** (flip O that are not on boundary)', kind: 'goal' },
      { text: 'Return **number of enclaves** (land cells not reachable from boundary)', kind: 'goal' },
    ],
    budget: ['multiSource', 'grid'],
    slottedTemplate: `// Step 1: Push all boundary cells matching condition
for (int i = 0; i < m; i++)
    for (int j : {0, n-1}) if ({{BOUNDARY_COND}}) { mark(i,j); q.push({i,j}); }
for (int j = 0; j < n; j++)
    for (int i : {0, m-1}) if ({{BOUNDARY_COND}}) { mark(i,j); q.push({i,j}); }
// Step 2: BFS from boundary
while (!q.empty()) { /* standard BFS */ }
// Step 3: Process remaining cells`,
    slots: [
      { id: 'BOUNDARY_COND', label: 'Boundary cell condition', hint: 'board[i][j]==\'O\'' },
    ],
    slotFills: {
      130: { BOUNDARY_COND: 'board[i][j] == \'O\'' },
      1020: { BOUNDARY_COND: 'grid[i][j] == 1' },
    },
    helixDelta: {
      130: 'Mark boundary O as safe, flip inner O to X',
      1020: 'Mark boundary land, count inner land',
    },
    autopsies: [
      {
        cause: 'Skipping corner cells in boundary loop',
        wrong: 'Only check first/last row for first/last column — double counted',
        testCase: 'Cell (0,0) O',
        fix: 'Full perimeter: first/last row all columns, first/last column all rows',
      },
    ],
    sayIt: [
      'Boundary BFS: start from edge cells matching condition.',
      'Mark them temporarily, then process inner cells accordingly.',
    ],
  }),

  'bidirectional-bfs': e({
    xray: [
      { text: '**Word ladder** — bidirectional optimization for shortest transformation', kind: 'goal' },
      { text: '**Open the lock** — minimum turns to reach target combo', kind: 'goal' },
    ],
    budget: ['shortestPath', 'multiSource'],
    slottedTemplate: `unordered_set<string> fwd, bwd, *set1, *set2;
fwd.insert({{START}}); bwd.insert({{END}});
int steps = 2;
while (!fwd.empty() && !bwd.empty()) {
    if (fwd.size() > bwd.size()) swap(fwd, bwd);
    unordered_set<string> next;
    for (string w : fwd) {
        {{GENERATE_NEIGHBORS}}
        if (bwd.count(neigh)) return steps;
    }
    fwd = move(next);
    steps++;
}`,
    slots: [
      { id: 'START', label: 'Start node' },
      { id: 'END', label: 'Target node' },
      { id: 'GENERATE_NEIGHBORS', label: 'Neighbor generation', hint: 'change each char/position' },
    ],
    slotFills: {
      127: { START: 'beginWord', END: 'endWord', GENERATE_NEIGHBORS: 'for(int i=0;i<w.size();i++){ char orig=w[i]; for(c=\'a\';c<=\'z\';c++){ w[i]=c; if(dict.count(w)) next.insert(w); } w[i]=orig; }' },
      752: { START: '"0000"', END: 'target', GENERATE_NEIGHBORS: 'for each wheel: turn +/-1; if not deadend, add to next' },
    },
    helixDelta: {
      127: 'Bidirectional BFS on word graph',
      752: 'Same approach on 4-digit lock combinations',
    },
    autopsies: [
      {
        cause: 'Always expanding from one side instead of smaller',
        wrong: 'Only expand fwd set each iteration',
        testCase: 'Large state space',
        fix: 'Always expand the smaller set: if (fwd.size() > bwd.size()) swap(fwd, bwd);',
      },
    ],
    sayIt: [
      'Bidirectional BFS: expand smaller frontier, check intersection.',
      'Halves search space: O(b^(d/2)) vs O(b^d).',
    ],
  }),

  kahns: e({
    xray: [
      { text: 'Return the **ordering of courses** to take (Kahn\'s algorithm)', kind: 'goal' },
      { text: 'Find **minimum height trees** roots', kind: 'goal' },
    ],
    budget: ['topological'],
    slottedTemplate: `vector<int> indeg(n);
for (auto& e : edges) indeg[{{V}}]++;
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
vector<int> order;
while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
return order.size() == n ? order : vector<int>();`,
    slots: [
      { id: 'V', label: 'Destination node in edge', hint: 'p[0] for prereqs' },
    ],
    slotFills: {
      210: { V: 'p[0]' },
      310: { V: 'v' },
    },
    helixDelta: {
      210: 'Standard Kahn\'s — queue, indegree array',
      310: 'Peel leaves (indeg==1) layer by layer',
    },
    autopsies: [
      {
        cause: 'Not checking remaining nodes for cycle',
        wrong: 'Return order without checking size == n',
        testCase: 'Cycle in graph',
        fix: 'if (order.size() != n) return {};',
      },
    ],
    sayIt: [
      'Kahn\'s algorithm: count indegrees, push zero-indegree nodes, decrement neighbors.',
      'If not all nodes processed → cycle exists → return empty.',
    ],
  }),

  'kahns-lex': e({
    xray: [
      { text: 'Return **lexicographically smallest** topological order', kind: 'goal' },
      { text: '**Sort items by groups** respecting dependencies', kind: 'goal' },
    ],
    budget: ['topological'],
    slottedTemplate: `priority_queue<int, vector<int>, greater<int>> pq;
for (int i = 0; i < n; i++) if (indeg[i] == 0) pq.push(i);
while (!pq.empty()) {
    int u = pq.top(); pq.pop();
    order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) pq.push(v);
}`,
    slots: [],
    slotFills: { 1203: {} },
    helixDelta: { 1203: 'Two-level: groups then items, using min-heap' },
    autopsies: [
      {
        cause: 'Using queue instead of priority_queue for lexicographic order',
        wrong: 'queue<int> q; // gives any valid order',
        testCase: 'Multiple nodes with indegree 0 at same time',
        fix: 'priority_queue<int, vector<int>, greater<int>> — picks smallest first',
      },
    ],
    sayIt: ['Lexicographic topo sort: same as Kahn\'s but with min-heap (priority_queue).'],
  }),

  'union-find': e({
    xray: [
      { text: '**Number of provinces** — count friend circles via DSU', kind: 'goal' },
      { text: '**Redundant connection** — first edge that creates cycle', kind: 'goal' },
    ],
    budget: ['connected'],
    slottedTemplate: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) { for(int i=0;i<n;i++) parent[i]=i; }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[ry] < rank[rx]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
};`,
    slots: [],
    slotFills: {
      547: {},
      684: {},
    },
    helixDelta: {
      547: 'DSU count distinct roots',
      684: 'DSU unite edges; first false → redundant',
    },
    autopsies: [
      {
        cause: 'Forgetting path compression in find',
        wrong: 'int find(int x) { while(parent[x]!=x) x=parent[x]; return x; }',
        testCase: 'Deep chain, repeated find calls',
        fix: 'parent[x] = find(parent[x]) — path compression',
      },
    ],
    sayIt: [
      'DSU: find with path compression, unite with rank heuristic.',
      '547: count roots. 684: unite edges, first false → answer.',
    ],
  }),

  'dynamic-connectivity': e({
    xray: [
      { text: '**Accounts merge** — merge accounts sharing the same email', kind: 'goal' },
    ],
    budget: ['connected'],
    slottedTemplate: `unordered_map<string, int> emailToIdx;
for (int i = 0; i < n; i++)
    for (int j = 1; j < accounts[i].size(); j++) {
        if (emailToIdx.count(accounts[i][j]))
            dsu.unite(i, emailToIdx[accounts[i][j]]);
        else emailToIdx[accounts[i][j]] = i;
    }`,
    slots: [],
    slotFills: { 721: {} },
    helixDelta: { 721: 'Map email → first account index; DSU merge on conflict' },
    autopsies: [
      {
        cause: 'Merging by email string instead of account index',
        wrong: 'unordered_set<string> merging emails directly',
        testCase: 'Multiple accounts same name different emails',
        fix: 'DSU on account indices; map email → first account index',
      },
    ],
    sayIt: [
      'Map each email to first account index that contains it.',
      'DSU unites account indices when email appears in multiple accounts.',
    ],
  }),

  dijkstra: e({
    xray: [
      { text: '**Network delay time** — time for signal to reach all nodes', kind: 'goal' },
      { text: '**Path with minimum effort** — minimize max absolute height difference', kind: 'goal' },
    ],
    budget: ['weighted', 'shortestPath'],
    slottedTemplate: `vector<vector<pair<int,int>>> adj(n);
for (auto& e : edges) adj[e[0]].push_back({e[1], e[2]});
vector<int> dist(n, INT_MAX);
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
dist[src] = 0; pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d != dist[u]) continue;
    for (auto [v, w] : adj[u]) {
        if (dist[v] > dist[u] + w) { dist[v] = dist[u] + w; pq.push({dist[v], v}); }
    }
}`,
    slots: [],
    slotFills: {
      743: {},
      1631: {},
    },
    helixDelta: {
      743: 'Standard Dijkstra — sum of weights',
      1631: 'Minimize max edge: dist[v] = max(dist[u], |h[v]-h[u]|)',
    },
    autopsies: [
      {
        cause: 'Using queue instead of priority_queue',
        wrong: 'queue<pair<int,int>> — BFS on weighted graph',
        testCase: 'Graph with varying edge weights',
        fix: 'priority_queue with min-heap (greater) for Dijkstra',
      },
    ],
    sayIt: [
      'Dijkstra: min-heap priority_queue, distance array, skip stale entries.',
      'Non-negative weights only. O((V+E) log V).',
    ],
  }),

  'floyd-warshall': e({
    xray: [
      { text: 'Find the **city with smallest number of neighbors** within distance threshold', kind: 'goal' },
    ],
    budget: ['weighted', 'shortestPath', 'denseGraph'],
    slottedTemplate: `for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (dist[i][j] > dist[i][k] + dist[k][j])
                dist[i][j] = dist[i][k] + dist[k][j];`,
    slots: [],
    slotFills: { 1334: {} },
    helixDelta: { 1334: 'All-pairs shortest, V ≤ 500' },
    autopsies: [
      {
        cause: 'Wrong loop order — k must be outermost',
        wrong: 'for(i) for(j) for(k) // wrong — i,j before k',
        testCase: 'Graph with intermediate node optimization',
        fix: 'k (intermediate) MUST be outermost loop',
      },
    ],
    sayIt: [
      'Floyd-Warshall: DP over intermediate node k. Triple loop: k, i, j.',
      'O(n³). Use for V ≤ 500 or all-pairs needed.',
    ],
  }),

  'bellman-ford': e({
    xray: [
      { text: '**Cheapest flights within K stops** — Bellman-Ford limited iterations', kind: 'goal' },
    ],
    budget: ['weighted', 'shortestPath', 'kConstraints'],
    slottedTemplate: `vector<int> dist(n, INT_MAX);
dist[src] = 0;
for (int i = 0; i <= k; i++) {
    vector<int> ndist = dist;
    for (auto& f : flights) {
        int u = f[0], v = f[1], w = f[2];
        if (dist[u] != INT_MAX && ndist[v] > dist[u] + w)
            ndist[v] = dist[u] + w;
    }
    dist = ndist;
}
return dist[dst] == INT_MAX ? -1 : dist[dst];`,
    slots: [],
    slotFills: { 787: {} },
    helixDelta: { 787: 'Bellman-Ford K+1 iterations for K stops' },
    autopsies: [
      {
        cause: 'Updating dist in-place per iteration (not using ndist copy)',
        wrong: 'for each flight: if(dist[v] > dist[u]+w) dist[v] = dist[u]+w',
        testCase: 'K=1, path needs 2+ edges (should not be found)',
        fix: 'Copy dist to ndist; update ndist from dist; swap',
      },
    ],
    sayIt: [
      'Bellman-Ford: relax all edges K times (K stops = K+1 edges).',
      'Must use ndist copy to respect iteration limit.',
    ],
  }),

  mst: e({
    xray: [
      { text: '**Min cost to connect all points** — minimum spanning tree of complete graph', kind: 'goal' },
    ],
    budget: ['mst'],
    slottedTemplate: `vector<bool> inMST(n);
vector<int> minDist(n, INT_MAX);
minDist[0] = 0;
int ans = 0;
for (int i = 0; i < n; i++) {
    int u = -1;
    for (int j = 0; j < n; j++)
        if (!inMST[j] && (u == -1 || minDist[j] < minDist[u])) u = j;
    inMST[u] = true;
    ans += minDist[u];
    for (int j = 0; j < n; j++) if (!inMST[j])
        minDist[j] = min(minDist[j], {{WEIGHT(u,j)}});
}`,
    slots: [
      { id: 'WEIGHT(u,j)', label: 'Edge weight function', hint: 'Manhattan |x1-x2|+|y1-y2|' },
    ],
    slotFills: {
      1584: { 'WEIGHT(u,j)': 'abs(points[u][0]-points[j][0])+abs(points[u][1]-points[j][1])' },
    },
    helixDelta: { 1584: "Prim's O(n²) for dense complete graph" },
    autopsies: [
      {
        cause: 'Picking any non-MST node instead of minDist',
        wrong: 'for(j) if(!inMST[j]) u=j; break;',
        testCase: 'Complete graph with varying weights',
        fix: 'Pick the non-MST node with smallest minDist value',
      },
    ],
    sayIt: [
      "Prim's: start from node 0, grow MST by adding minDist edge each step.",
      "For sparse graphs: Kruskal's (sort edges + DSU) is O(E log E).",
    ],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
