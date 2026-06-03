import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <climits>
using namespace std;

`

export const basicConnectivityLeaf = leaf('basic-connectivity', 'Basic Connectivity', 'green', {
  template: `${CPP_HEADER}void dfs(vector<vector<int>>& grid, int i, int j, vector<vector<bool>>& vis) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0 || vis[i][j]) return;
    vis[i][j] = true;
    dfs(grid, i+1, j, vis);
    dfs(grid, i-1, j, vis);
    dfs(grid, i, j+1, vis);
    dfs(grid, i, j-1, vis);
}

int numIslands(vector<vector<int>>& grid) {
    int m = (int)grid.size(), n = (int)grid[0].size(), ans = 0;
    vector<vector<bool>> vis(m, vector<bool>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1 && !vis[i][j]) { ans++; dfs(grid, i, j, vis); }
    return ans;
}`,
  problems: [
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 10-18: as-is (grid DFS counting components).' },
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Use adjacency matrix; DFS on each unvisited city.', variationCode: 'void dfs(int u, vector<vector<int>>& M, vector<bool>& vis) { vis[u]=true; for(int v=0;v<M.size();v++) if(M[u][v]&&!vis[v]) dfs(v,M,vis); }' },
  ],
  pitfalls: ['❌ Using BFS when adjacency list is static — DFS stack is simpler.', '❌ Forgetting visited check before DFS call leads to infinite recursion.'],
  edgeCases: [{ input: 'empty grid (0x0)', breaks: 'm==0 || n==0 — early return 0' }, { input: 'single cell island', breaks: 'visited sets correctly' }],
  interviewTip: '💡 "Count islands/provinces" → DFS component count with visited set.',
})

export const componentSizeLeaf = leaf('component-size', 'Component Size Analysis', 'green', {
  template: `${CPP_HEADER}int dfs(vector<vector<int>>& grid, int i, int j, vector<vector<bool>>& vis) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0 || vis[i][j]) return 0;
    vis[i][j] = true;
    return 1 + dfs(grid, i+1, j, vis) + dfs(grid, i-1, j, vis)
           + dfs(grid, i, j+1, vis) + dfs(grid, i, j-1, vis);
}

int maxAreaOfIsland(vector<vector<int>>& grid) {
    int m = (int)grid.size(), n = (int)grid[0].size(), best = 0;
    vector<vector<bool>> vis(m, vector<bool>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1 && !vis[i][j])
                best = max(best, dfs(grid, i, j, vis));
    return best;
}`,
  problems: [
    { id: 695, title: 'Max Area of Island', slug: 'max-area-of-island', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Line 6-7: return 1 + sum of four directions (return size, not just mark).' },
    { id: 1254, title: 'Number of Closed Islands', slug: 'number-of-closed-islands', companies: ['GOOGLE'], lineChanges: 'First mark edge-connected land via DFS; then count inner components.', variationCode: '// 1) DFS all edge land -> water. 2) Count remaining components as closed.' },
  ],
  pitfalls: ['❌ Not summing the recursive return values — counting 1 for visited instead of total area.', '❌ For closed islands: forgetting to zero out edge-connected land first.'],
  edgeCases: [{ input: 'entire grid water', breaks: 'return 0' }, { input: 'entire grid land', breaks: 'max area = m*n, closed = 0' }],
  interviewTip: '💡 "Max area / closed islands" → DFS that returns component size, track max or filter edge-touching.',
})

export const undirectedCycleLeaf = leaf('undirected-cycle', 'Undirected Cycle Detection', 'green', {
  template: `${CPP_HEADER}bool dfs(int u, int parent, vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) { if (dfs(v, u, adj, vis)) return true; }
        else if (v != parent) return true;
    }
    return false;
}

bool hasCycle(vector<vector<int>>& adj, int n) {
    vector<bool> vis(n);
    for (int i = 0; i < n; i++)
        if (!vis[i] && dfs(i, -1, adj, vis)) return true;
    return false;
}`,
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Build DSU as edges added; first edge connecting already-connected nodes is redundant.', variationCode: 'DSU dsu(n); for(auto& e: edges) { if(dsu.find(e[0])==dsu.find(e[1])) return {e[0],e[1]}; dsu.unite(e[0],e[1]); }' },
  ],
  pitfalls: ['❌ Not passing parent to DFS — will detect false positive cycle (neighbor equals parent).', '❌ Undirected: must handle connected components individually.'],
  edgeCases: [{ input: 'self-loop edge [i,i]', breaks: 'v==u check catches it via v!=parent' }, { input: 'multi-graph parallel edges', breaks: 'DSU catches first redundant' }],
  interviewTip: '💡 "Undirected cycle" → DFS with parent tracking OR DSU (Kruskal-style).',
})

export const directedCycleLeaf = leaf('directed-cycle', 'Directed Cycle Detection', 'green', {
  template: `${CPP_HEADER}bool dfs(int u, vector<vector<int>>& adj, vector<int>& state) {
    if (state[u] == 1) return true;  // visiting -> cycle
    if (state[u] == 2) return false; // done
    state[u] = 1;
    for (int v : adj[u]) if (dfs(v, adj, state)) return true;
    state[u] = 2;
    return false;
}

bool canFinish(int n, vector<vector<int>>& prereqs) {
    vector<vector<int>> adj(n);
    for (auto& p : prereqs) adj[p[1]].push_back(p[0]);
    vector<int> state(n);
    for (int i = 0; i < n; i++)
        if (state[i] == 0 && dfs(i, adj, state)) return false;
    return true;
}`,
  problems: [
    { id: 207, title: 'Course Schedule', slug: 'course-schedule', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-12: as-is (3-state DFS for directed cycle).' },
    { id: 802, title: 'Find Eventual Safe States', slug: 'find-eventual-safe-states', companies: ['GOOGLE'], lineChanges: 'Return nodes with state==2 (no cycle reachable).', variationCode: 'vector<int> res; for(int i=0;i<n;i++) if(dfs(i,adj,state)==2) res.push_back(i); return res;' },
  ],
  pitfalls: ['❌ Using only visited (2-state) for directed cycles — need 3-state (unvisited/visiting/done).', '❌ Confusing adjacency direction — prereq direction depends on problem statement.'],
  edgeCases: [{ input: 'DAG with many nodes', breaks: 'no cycle — all reach 2 (done)' }, { input: 'single node self-prereq', breaks: 'state==1 caught on first neighbor' }],
  interviewTip: '💡 "Directed cycle" / "prerequisite schedule" → 3-state DFS (0=unvisited,1=visiting,2=done).',
})

export const allPathsLeaf = leaf('all-paths', 'All Paths From Source to Target', 'green', {
  template: `${CPP_HEADER}void dfs(int u, int target, vector<vector<int>>& adj, vector<int>& path, vector<vector<int>>& res) {
    path.push_back(u);
    if (u == target) { res.push_back(path); }
    else for (int v : adj[u]) dfs(v, target, adj, path, res);
    path.pop_back();
}

vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
    vector<vector<int>> res;
    vector<int> path;
    dfs(0, (int)graph.size()-1, graph, path, res);
    return res;
}`,
  problems: [
    { id: 797, title: 'All Paths From Source to Target', slug: 'all-paths-from-source-to-target', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (backtracking DFS on DAG).' },
  ],
  pitfalls: ['❌ Copying path at every node (wasteful) — push before, pop after.', '❌ Infinite loop if graph has cycles — this only works on DAG.'],
  edgeCases: [{ input: 'single node graph [[ ]]', breaks: 'path=[0], res=[[0]]' }, { input: 'DAG with two parallel paths', breaks: 'both paths collected' }],
  interviewTip: '💡 "All paths" → backtracking DFS, push before exploring, pop after. Works only on DAG.',
})

export const pathExistenceLeaf = leaf('path-existence', 'Path Existence', 'green', {
  template: `${CPP_HEADER}bool dfs(int u, int target, vector<vector<int>>& adj, vector<bool>& vis) {
    if (u == target) return true;
    vis[u] = true;
    for (int v : adj[u])
        if (!vis[v] && dfs(v, target, adj, vis)) return true;
    return false;
}

bool validPath(int n, vector<vector<int>>& edges, int src, int dest) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
    vector<bool> vis(n);
    return dfs(src, dest, adj, vis);
}`,
  problems: [
    { id: 1971, title: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph', companies: ['AMAZON', 'META'], lineChanges: 'Lines 10-16: as-is (build adj list, DFS from src to dest).' },
  ],
  pitfalls: ['❌ Forgetting undirected graphs need both directions in adjacency list.', '❌ Stack overflow on deep linear graph — iterative DFS avoids this.'],
  edgeCases: [{ input: 'src==dest', breaks: 'return true immediately' }, { input: 'disconnected graph', breaks: 'DFS returns false' }],
  interviewTip: '💡 "Path exists" → DFS (recursive or iterative) with visited set; or DSU for static edges.',
})

export const topologicalDfsLeaf = leaf('topological-dfs', 'DFS-Based Topological Sort', 'green', {
  template: `${CPP_HEADER}void dfs(int u, vector<vector<int>>& adj, vector<bool>& vis, stack<int>& st) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v, adj, vis, st);
    st.push(u);
}

vector<int> findOrder(int n, vector<vector<int>>& prereqs) {
    vector<vector<int>> adj(n);
    for (auto& p : prereqs) adj[p[1]].push_back(p[0]);
    vector<bool> vis(n);
    stack<int> st;
    for (int i = 0; i < n; i++) if (!vis[i]) dfs(i, adj, vis, st);
    vector<int> order;
    while (!st.empty()) { order.push_back(st.top()); st.pop(); }
    return order;
}`,
  problems: [
    { id: 210, title: 'Course Schedule II', slug: 'course-schedule-ii', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-12: as-is (DFS with postorder push to stack).' },
    { id: 269, title: 'Alien Dictionary', slug: 'alien-dictionary', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Build edges by comparing adjacent words; then topological sort.', variationCode: `for(int i=0;i<words.size()-1;i++) { string w1=words[i], w2=words[i+1]; for(int j=0;j<min(w1.size(),w2.size());j++) if(w1[j]!=w2[j]) { adj[w1[j]-'a'].push_back(w2[j]-'a'); break; } }` },
  ],
  pitfalls: ['❌ Not checking for cycle when doing DFS-based topo sort.', '❌ Alien dictionary: invalid when w1 is prefix of w2 but longer.'],
  edgeCases: [{ input: 'empty prerequisites', breaks: 'order is 0..n-1' }, { input: 'cycle in prereqs', breaks: 'need cycle detection + return empty' }],
  interviewTip: '💡 "Topological order" → DFS postorder onto stack + reverse. Or Kahn\'s (BFS).',
})

export const bfsShortestPathLeaf = leaf('bfs-shortest', 'BFS Shortest Path (Unweighted)', 'teal', {
  template: `${CPP_HEADER}int bfs(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, -1));
    queue<pair<int,int>> q;
    q.push(start); dist[start.first][start.second] = 0;
    int dirs[] = {-1,0,1,0,-1};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        if (r == end.first && c == end.second) return dist[r][c];
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc]==0 && dist[nr][nc]==-1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr,nc});
            }
        }
    }
    return -1;
}`,
  problems: [
    { id: 1091, title: 'Shortest Path in Binary Matrix', slug: 'shortest-path-in-binary-matrix', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-20: as-is (BFS on grid with 8-dir; grid[0][0]==0 start).' },
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Multi-source BFS; track fresh count; return minutes (distance-1 level).', variationCode: 'queue<tuple<int,int,int>> q; for each rotten push (i,j,0); while level < minutes; return fresh==0 ? minutes : -1;' },
    { id: 127, title: 'Word Ladder', slug: 'word-ladder', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'BFS on implicit graph (words as nodes, edge if diff by 1 char).', variationCode: 'unordered_set<string> dict(wordList.begin(),wordList.end()); queue<string> q; q.push(beginWord); int steps=1; while(!q.empty()) { for(size sz=q.size();sz--;) { string w=q.front(); q.pop(); for each neighbor } steps++; }' },
  ],
  pitfalls: ['❌ Using DFS for shortest path — BFS guarantees minimum steps in unweighted.', '❌ Not tracking visited distance (or visiting via -1 init) causes revisits.'],
  edgeCases: [{ input: 'start == end', breaks: 'return 0 (or 1 for word ladder)' }, { input: 'no path / unreachable', breaks: 'return -1' }],
  interviewTip: '💡 "Shortest path" in unweighted graph → BFS with distance array (or distance grid for matrix).',
})

export const bfsLevelByLevelLeaf = leaf('bfs-level', 'BFS Level-by-Level', 'teal', {
  template: `${CPP_HEADER}vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int m = (int)mat.size(), n = (int)mat[0].size();
    vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
    queue<pair<int,int>> q;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (mat[i][j] == 0) { dist[i][j] = 0; q.push({i,j}); }
    int dirs[] = {-1,0,1,0,-1};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr>=0 && nr<m && nc>=0 && nc<n && dist[nr][nc] > dist[r][c] + 1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr,nc});
            }
        }
    }
    return dist;
}`,
  problems: [
    { id: 542, title: '01 Matrix', slug: '01-matrix', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 5-22: as-is (multi-source BFS from all zeros).' },
    { id: 1162, title: 'As Far from Land as Possible', slug: 'as-far-from-land-as-possible', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Multi-source BFS from all land cells; track max distance.', variationCode: 'int ans = 0; for each cell ans = max(ans, dist[i][j]); return ans == 0 || ans == INT_MAX ? -1 : ans;' },
  ],
  pitfalls: ['❌ Not resetting distance to INT_MAX before BFS — first BFS visit may not be shortest.', '❌ Single-source BFS instead of multi-source — O(m²n²) vs O(mn).'],
  edgeCases: [{ input: 'all zeros', breaks: 'dist all 0' }, { input: 'all land / all ones', breaks: 'dist all INT_MAX (no zero source)' }],
  interviewTip: '💡 "Distance to nearest zero/land" → multi-source BFS with dist grid initialized from all sources.',
})

export const multiSourceSimultaneousLeaf = leaf('multi-source-simul', 'Multi-Source Simultaneous BFS', 'teal', {
  template: `${CPP_HEADER}int orangesRotting(vector<vector<int>>& grid) {
    int m = (int)grid.size(), n = (int)grid[0].size(), fresh = 0, mins = 0;
    queue<pair<int,int>> q;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 2) q.push({i,j});
            else if (grid[i][j] == 1) fresh++;
    int dirs[] = {-1,0,1,0,-1};
    while (!q.empty() && fresh) {
        int sz = (int)q.size();
        while (sz--) {
            auto [r,c] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r + dirs[d], nc = c + dirs[d+1];
                if (nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc]==1) {
                    grid[nr][nc] = 2; fresh--;
                    q.push({nr,nc});
                }
            }
        }
        mins++;
    }
    return fresh ? -1 : mins;
}`,
  problems: [
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-27: as-is (level-order multi-source BFS with fresh counter).' },
    { id: 542, title: '01 Matrix', slug: '01-matrix', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Same multi-source BFS; track distance in separate grid instead of minutes counter.', variationCode: 'dist[nr][nc] = dist[r][c] + 1; // distance grid, no level counter' },
  ],
  pitfalls: ['❌ Level counting: increment mins after each full level, not per orange.', '❌ Forgetting fresh count — cannot detect -1 without tracking unreachable fresh.'],
  edgeCases: [{ input: 'no rotten oranges initially', breaks: 'q empty, fresh>0 → return -1; fresh==0 → return 0' }, { input: 'all oranges rotten', breaks: 'return 0' }],
  interviewTip: '💡 "Rotting oranges / 01 matrix" → multi-source BFS from all initial sources simultaneously.',
})

export const multiSourceBoundaryLeaf = leaf('multi-source-boundary', 'Multi-Source Boundary BFS', 'teal', {
  template: `${CPP_HEADER}void solve(vector<vector<char>>& board) {
    int m = (int)board.size(), n = (int)board[0].size();
    queue<pair<int,int>> q;
    for (int i = 0; i < m; i++)
        for (int j : {0, n-1})
            if (board[i][j] == 'O') { board[i][j] = 'E'; q.push({i,j}); }
    for (int j = 0; j < n; j++)
        for (int i : {0, m-1})
            if (board[i][j] == 'O') { board[i][j] = 'E'; q.push({i,j}); }
    int dirs[] = {-1,0,1,0,-1};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr>=0 && nr<m && nc>=0 && nc<n && board[nr][nc]=='O')
                { board[nr][nc]='E'; q.push({nr,nc}); }
        }
    }
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (board[i][j] == 'O') board[i][j] = 'X';
            else if (board[i][j] == 'E') board[i][j] = 'O';
}`,
  problems: [
    { id: 1020, title: 'Number of Enclaves', slug: 'number-of-enclaves', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Mark boundary-connected land; count remaining land cells.', variationCode: 'int ans=0; for each cell: if(grid[i][j]==1 && !boundaryVisited) ans++; return ans;' },
    { id: 130, title: 'Surrounded Regions', slug: 'surrounded-regions', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-32: as-is (flag boundary O as E, flip inner O to X, restore E).' },
  ],
  pitfalls: ['❌ Confusing row/col boundary loops — must check first AND last column for each row, first AND last row for each column.', '❌ Modifying board while BFS — using temporary marker (E) avoids double processing.'],
  edgeCases: [{ input: 'no border O cells', breaks: 'all inner O become X' }, { input: 'all border O', breaks: 'all cells marked E, no X flip' }],
  interviewTip: '💡 "Surrounded regions / enclaves" → start BFS/DFS from all O on boundary; mark those as safe.',
})

export const bidirectionalBfsLeaf = leaf('bidirectional-bfs', 'Bidirectional BFS', 'teal', {
  template: `${CPP_HEADER}int bidirectionalBFS(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (!dict.count(endWord)) return 0;
    unordered_set<string> fwd, bwd, *set1, *set2;
    fwd.insert(beginWord); bwd.insert(endWord);
    int steps = 2;
    while (!fwd.empty() && !bwd.empty()) {
        if (fwd.size() > bwd.size()) swap(fwd, bwd);
        unordered_set<string> next;
        for (string w : fwd) {
            for (int i = 0; i < (int)w.size(); i++) {
                char orig = w[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    w[i] = c;
                    if (bwd.count(w)) return steps;
                    if (dict.count(w)) { next.insert(w); dict.erase(w); }
                }
                w[i] = orig;
            }
        }
        fwd = move(next);
        steps++;
    }
    return 0;
}`,
  problems: [
    { id: 127, title: 'Word Ladder', slug: 'word-ladder', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-30: as-is (bidirectional BFS on word graph, returns shortest transformation length).' },
    { id: 752, title: 'Open the Lock', slug: 'open-the-lock', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Bidirectional BFS on 4-digit wheel combinations; deadends as removed dict.', variationCode: 'unordered_set<string> dead(deadends.begin(),deadends.end()); // same bidirectional BFS on 0000..9999; each turn rotates one wheel +/-1' },
  ],
  pitfalls: ['❌ Not erasing from dict when visited — leads to cycles and exponential blowup.', '❌ Swap sets when one is larger to minimize expansion (always expand smaller).'],
  edgeCases: [{ input: 'start == end', breaks: 'return 1 (or 0 depending on definition)' }, { input: 'no path possible', breaks: 'return 0' }],
  interviewTip: '💡 "Word ladder / open the lock" → bidirectional BFS meets-in-middle, 2× faster than standard BFS.',
})

export const kahnsLeaf = leaf('kahns', "Kahn's Algorithm (Indegree-Based)", 'teal', {
  template: `${CPP_HEADER}vector<int> findOrder(int n, vector<vector<int>>& prereqs) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n);
    for (auto& p : prereqs) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>();
}`,
  problems: [
    { id: 210, title: 'Course Schedule II', slug: 'course-schedule-ii', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-14: as-is (Kahn\'s BFS with indegree array).' },
    { id: 310, title: 'Minimum Height Trees', slug: 'minimum-height-trees', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Peel leaves (indeg==1 nodes) layer by layer; last 1-2 nodes are roots.', variationCode: 'queue<int> leaves; for each node if(indeg==1) leaves.push(node); while(n>2) { int sz=leaves.size(); n-=sz; while(sz--) { int u=leaves.front(); leaves.pop(); for v: adj[u] if(--indeg[v]==1) leaves.push(v); } }' },
  ],
  pitfalls: ['❌ Not checking if all nodes processed — remaining indegree>0 means cycle.', '❌ Kahn\'s gives lexicographic order only if priority_queue is used instead of queue.'],
  edgeCases: [{ input: 'empty prerequisites (no edges)', breaks: 'all nodes indegree 0 → return 0..n-1' }, { input: 'cycle in graph', breaks: 'order.size() < n → return empty' }],
  interviewTip: '💡 "Kahn\'s algorithm" → BFS with indegree array, push nodes with indegree==0, decrement neighbors.',
})

export const kahnsLexicographicLeaf = leaf('kahns-lex', "Kahn's Algorithm (Lexicographic)", 'teal', {
  template: `${CPP_HEADER}vector<int> topoSortLex(vector<vector<int>>& adj, int n) {
    vector<int> indeg(n);
    for (int u = 0; u < n; u++)
        for (int v : adj[u]) indeg[v]++;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) pq.push(i);
    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) pq.push(v);
    }
    return order.size() == n ? order : vector<int>();
}`,
  problems: [
    { id: 1203, title: 'Sort Items by Groups', slug: 'sort-items-by-groups', companies: ['GOOGLE'], lineChanges: 'Two-level topological sort: sort groups first, then items within groups lexicographically.', variationCode: '// 1) topo sort groups. 2) For each group in order, topo sort its items with lexicographic PQ.' },
  ],
  pitfalls: ['❌ Using queue instead of priority_queue — plain queue gives any valid order, not lexicographic smallest.', '❌ Two-level sort: must handle -1 (no group) items separately.'],
  edgeCases: [{ input: 'cycle in graph', breaks: 'return empty vector' }, { input: 'single node', breaks: 'return {0}' }],
  interviewTip: '💡 "Lexicographically smallest topological order" → Kahn\'s with priority_queue (min-heap).',
})

const DSU_CPP = `#include <vector>
using namespace std;

`

export const unionFindLeaf = leaf('union-find', 'Union-Find (DSU) Path Compression + Rank', 'purple', {
  template: `${DSU_CPP}struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
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
  problems: [
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'DSU on n cities; unite(i,j) if connected; count distinct roots.', variationCode: 'DSU dsu(n); for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(M[i][j]) dsu.unite(i,j); unordered_set<int> comps; for(int i=0;i<n;i++) comps.insert(dsu.find(i)); return comps.size();' },
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Unite each edge; first false return is the redundant edge.', variationCode: 'for(auto& e: edges) if(!dsu.unite(e[0],e[1])) return {e[0],e[1]}; return {};' },
  ],
  pitfalls: ['❌ Forgetting path compression (find recursion) leads to O(n) per find.', '❌ Not comparing rank before setting parent — union by rank keeps tree flat.'],
  edgeCases: [{ input: 'single node', breaks: 'parent[0]==0, rank[0]==0' }, { input: 'already connected edge', breaks: 'unite returns false' }],
  interviewTip: '💡 "Dynamic connectivity / redundant connection" → DSU with path compression + union by rank.',
})

export const dynamicConnectivityLeaf = leaf('dynamic-connectivity', 'Dynamic Connectivity (DSU Merge)', 'purple', {
  template: `${DSU_CPP}vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    int n = (int)accounts.size();
    DSU dsu(n);
    unordered_map<string, int> emailToIdx;
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < (int)accounts[i].size(); j++) {
            string& email = accounts[i][j];
            if (emailToIdx.count(email)) dsu.unite(i, emailToIdx[email]);
            else emailToIdx[email] = i;
        }
    }
    unordered_map<int, set<string>> merged;
    for (int i = 0; i < n; i++) {
        int root = dsu.find(i);
        for (int j = 1; j < (int)accounts[i].size(); j++)
            merged[root].insert(accounts[i][j]);
    }
    vector<vector<string>> res;
    for (auto& [root, emails] : merged) {
        vector<string> row = {accounts[root][0]};
        row.insert(row.end(), emails.begin(), emails.end());
        res.push_back(row);
    }
    return res;
}`,
  problems: [
    { id: 721, title: 'Accounts Merge', slug: 'accounts-merge', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-28: as-is (DSU merge on shared emails).' },
  ],
  pitfalls: ['❌ Merging by string value instead of by account index — DSU operates on indices, not emails.', '❌ Not using set for dedup emails — same email may appear in multiple merged accounts.'],
  edgeCases: [{ input: 'single account with one email', breaks: 'row = [name, email]' }, { input: 'no shared emails', breaks: 'each account stays separate' }],
  interviewTip: '💡 "Accounts merge / dynamic connectivity" → DSU on account indices; map email→first account index.',
})

const DIJK_CPP = `#include <vector>
#include <queue>
#include <climits>
using namespace std;

`

export const dijkstraLeaf = leaf('dijkstra', "Dijkstra's Algorithm", 'purple', {
  template: `${DIJK_CPP}int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> adj(n+1);
    for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n+1, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[k] = 0; pq.push({0, k});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : adj[u])
            if (dist[v] > dist[u] + w) { dist[v] = dist[u] + w; pq.push({dist[v], v}); }
    }
    int ans = 0;
    for (int i = 1; i <= n; i++) ans = max(ans, dist[i]);
    return ans == INT_MAX ? -1 : ans;
}`,
  problems: [
    { id: 743, title: 'Network Delay Time', slug: 'network-delay-time', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-18: as-is (standard Dijkstra on directed weighted graph).' },
    { id: 1631, title: 'Path With Minimum Effort', slug: 'path-with-minimum-effort', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Dijkstra on grid edges where weight = |height diff|; minimize max diff along path.', variationCode: 'dist[nr][nc] = max(dist[r][c], abs(heights[nr][nc]-heights[r][c])); // minimize max edge weight' },
  ],
  pitfalls: ['❌ Using queue (FIFO) instead of priority_queue — Dijkstra requires min-heap for correctness.', '❌ Not skipping stale entries (d != dist[u]) leads to O(2^E) worst case.'],
  edgeCases: [{ input: 'disconnected graph (some nodes unreachable)', breaks: 'return -1' }, { input: 'single node k=1', breaks: 'dist[1]=0, ans=0' }],
  interviewTip: '💡 "Shortest path with non-negative weights" → Dijkstra with min-heap (priority_queue).',
})

export const floydWarshallLeaf = leaf('floyd-warshall', 'Floyd-Warshall Algorithm', 'purple', {
  template: `${DIJK_CPP}int findTheCity(int n, vector<vector<int>>& edges, int distThresh) {
    vector<vector<int>> dist(n, vector<int>(n, 1e9));
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (auto& e : edges) { int u=e[0],v=e[1],w=e[2]; dist[u][v]=w; dist[v][u]=w; }
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][j] > dist[i][k] + dist[k][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    int bestCity = -1, minCnt = n+1;
    for (int i = 0; i < n; i++) {
        int cnt = 0;
        for (int j = 0; j < n; j++) if (dist[i][j] <= distThresh) cnt++;
        if (cnt <= minCnt) { minCnt = cnt; bestCity = i; }
    }
    return bestCity;
}`,
  problems: [
    { id: 1334, title: 'Find the City With the Smallest Number of Neighbors', slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 3-13: as-is (Floyd-Warshall all-pairs shortest path).' },
  ],
  pitfalls: ['❌ Using INT_MAX/2 overflow — use large but safe sentinel like 1e9.', '❌ Order of loops: k (intermediate) MUST be outermost, not innermost.'],
  edgeCases: [{ input: 'single node', breaks: 'dist[0][0]=0, cnt=1, bestCity=0' }, { input: 'no edges (disconnected)', breaks: 'dist[i][j]=1e9 for i!=j' }],
  interviewTip: '💡 "All-pairs shortest path" or "small-ish graph (≤500 nodes)" → Floyd-Warshall O(n³).',
})

export const bellmanFordLeaf = leaf('bellman-ford', 'Bellman-Ford Algorithm', 'purple', {
  template: `${DIJK_CPP}int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> dist(n, INT_MAX);
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
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}`,
  problems: [
    { id: 787, title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-12: as-is (Bellman-Ford limited to K iterations = K stops).' },
  ],
  pitfalls: ['❌ Relaxing within same iteration (updating dist in-place) — need ndist copy for accurate K-limit.', '❌ INT_MAX + w overflows — check dist[u] != INT_MAX before adding.'],
  edgeCases: [{ input: 'k=0 (direct flight only)', breaks: 'single relaxation pass' }, { input: 'no path within K stops', breaks: 'return -1' }],
  interviewTip: '💡 "Cheapest with at most K stops" → Bellman-Ford limited to K+1 iterations (relaxations).',
})

export const mstLeaf = leaf('mst', 'Minimum Spanning Tree (Prim\'s / Kruskal\'s)', 'purple', {
  template: `${DIJK_CPP}int minCostConnectPoints(vector<vector<int>>& points) {
    int n = (int)points.size();
    vector<bool> inMST(n);
    vector<int> minDist(n, INT_MAX);
    minDist[0] = 0;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int j = 0; j < n; j++)
            if (!inMST[j] && (u == -1 || minDist[j] < minDist[u])) u = j;
        inMST[u] = true;
        ans += minDist[u];
        for (int j = 0; j < n; j++) if (!inMST[j]) {
            int d = abs(points[u][0]-points[j][0]) + abs(points[u][1]-points[j][1]);
            minDist[j] = min(minDist[j], d);
        }
    }
    return ans;
}`,
  problems: [
    { id: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 3-18: as-is (Prim\'s algorithm O(n²) for dense complete graph).' },
  ],
  pitfalls: ['❌ Prim\'s: picking the wrong next node — must pick smallest minDist among non-MST nodes.', '❌ Kruskal\'s requires DSU + sorting all edges by weight (O(E log E)).'],
  edgeCases: [{ input: 'single point', breaks: 'ans = 0' }, { input: 'two points', breaks: 'ans = Manhattan distance' }],
  interviewTip: '💡 "Connect all points with min cost" → Prim\'s O(n²) for dense complete graph or Kruskal\'s + DSU for sparse.',
})
