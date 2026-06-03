import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <queue>
#include <algorithm>
#include <climits>
#include <cstring>
using namespace std;

`

const DIRS_4 = `int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};`

export const islandCountLeaf = leaf('island-count', 'Connected Region Counting', 'blue', {
  template: `${CPP_HEADER}${DIRS_4}

void dfs(vector<vector<char>>& grid, int i, int j) {
    if (i < 0 || i >= (int)grid.size() || j < 0 || j >= (int)grid[0].size() || grid[i][j] != '1') return;
    grid[i][j] = '0';
    for (auto& d : dirs) dfs(grid, i + d[0], j + d[1]);
}

int numIslands(vector<vector<char>>& grid) {
    int cnt = 0;
    for (int i = 0; i < (int)grid.size(); i++)
        for (int j = 0; j < (int)grid[0].size(); j++)
            if (grid[i][j] == '1') { cnt++; dfs(grid, i, j); }
    return cnt;
}`,
  problems: [
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (standard DFS island sink).' },
    { id: 695, title: 'Max Area of Island', slug: 'max-area-of-island', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Line 6: return area count from dfs; track max.', variationCode: 'int dfs(vector<vector<int>>& g, int i, int j) { if(...) return 0; g[i][j]=0; int a=1; for(auto& d:dirs) a+=dfs(g,i+d[0],j+d[1]); return a; }' },
  ],
  pitfalls: ['❌ Missing bounds check before grid access — segfault.', '❌ Modifying grid while iterating (sink island technique avoids visited set overhead).'],
  edgeCases: [{ input: 'empty grid', breaks: 'grid[0].size() on empty — check rows==0 first' }, { input: 'single cell', breaks: 'works; check if \'1\' → count 1' }],
  interviewTip: '💡 "Number of islands" → DFS sink every \'1\' you find.',
})

export const regionModifyLeaf = leaf('region-modify', 'Region Modification', 'teal', {
  template: `${CPP_HEADER}void dfs(vector<vector<char>>& board, int i, int j) {
    if (i < 0 || i >= (int)board.size() || j < 0 || j >= (int)board[0].size() || board[i][j] != 'O') return;
    board[i][j] = '#';
    dfs(board, i+1, j); dfs(board, i-1, j);
    dfs(board, i, j+1); dfs(board, i, j-1);
}

void solve(vector<vector<char>>& board) {
    int m = (int)board.size(), n = (int)board[0].size();
    for (int i = 0; i < m; i++) { dfs(board, i, 0); dfs(board, i, n-1); }
    for (int j = 0; j < n; j++) { dfs(board, 0, j); dfs(board, m-1, j); }
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (board[i][j] == 'O') board[i][j] = 'X';
            else if (board[i][j] == '#') board[i][j] = 'O';
}`,
  problems: [
    { id: 130, title: 'Surrounded Regions', slug: 'surrounded-regions', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–17: as-is (border DFS mark, flip interior).' },
    { id: 417, title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'DFS from both oceans; cells reachable by both = answer.', variationCode: 'vector<vector<bool>> pac, atl; for(i) { dfs(heights, i, 0, pac); dfs(heights, i, n-1, atl); } for(j) { dfs(heights, 0, j, pac); dfs(heights, m-1, j, atl); } // cells where pac[i][j]&&atl[i][j]' },
  ],
  pitfalls: ['❌ Forgetting to mark border-connected cells before flipping interior O→X.', '❌ Using BFS when DFS is simpler for marking connectivity.'],
  edgeCases: [{ input: 'single row/col', breaks: 'border DFS covers entire grid' }],
  interviewTip: '💡 "Surrounded regions" → DFS from border cells first, then flip remaining O→X.',
})

export const backtrackPathLeaf = leaf('backtrack-path', 'Backtracking Path Search', 'blue', {
  template: `${CPP_HEADER}${DIRS_4}

bool dfs(vector<vector<char>>& board, const string& word, int i, int j, int idx) {
    if (idx == (int)word.size()) return true;
    if (i < 0 || i >= (int)board.size() || j < 0 || j >= (int)board[0].size() || board[i][j] != word[idx]) return false;
    char tmp = board[i][j]; board[i][j] = '#';
    for (auto& d : dirs)
        if (dfs(board, word, i + d[0], j + d[1], idx + 1)) { board[i][j] = tmp; return true; }
    board[i][j] = tmp;
    return false;
}

bool exist(vector<vector<char>>& board, string word) {
    for (int i = 0; i < (int)board.size(); i++)
        for (int j = 0; j < (int)board[0].size(); j++)
            if (dfs(board, word, i, j, 0)) return true;
    return false;
}`,
  problems: [
    { id: 79, title: 'Word Search', slug: 'word-search', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–15: as-is (DFS backtrack with temp mark).' },
    { id: 212, title: 'Word Search II', slug: 'word-search-ii', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Use Trie to prune search; only DFS paths in Trie.', variationCode: 'struct TrieNode { TrieNode* next[26]; string word; }; // insert all words; dfs(board, root)' },
  ],
  pitfalls: ['❌ Not restoring board after backtrack — breaks subsequent paths.', '❌ Using visited set instead of in-place mark — wastes O(n) space.'],
  edgeCases: [{ input: 'single char word', breaks: 'match found on first cell' }],
  interviewTip: '💡 "Word search" → DFS backtrack with in-place grid mark.',
})

export const uniquePathLeaf = leaf('unique-path', 'Unique Path Counting', 'teal', {
  template: `${CPP_HEADER}int memo[101][101];

int dfs(int i, int j, int m, int n) {
    if (i >= m || j >= n) return 0;
    if (i == m - 1 && j == n - 1) return 1;
    if (memo[i][j] != -1) return memo[i][j];
    return memo[i][j] = dfs(i + 1, j, m, n) + dfs(i, j + 1, m, n);
}

int uniquePaths(int m, int n) {
    memset(memo, -1, sizeof(memo));
    return dfs(0, 0, m, n);
}`,
  problems: [
    { id: 62, title: 'Unique Paths', slug: 'unique-paths', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3–11: as-is (DFS + memo or bottom-up DP).' },
    { id: 980, title: 'Unique Paths III', slug: 'unique-paths-iii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'DFS backtrack that visits ALL empty cells exactly once; count walks covering all zeros.', variationCode: 'int dfs(vector<vector<int>>& g, int i, int j, int left) { if (g[i][j]==2 && left==0) return 1; int tmp=g[i][j], cnt=0; g[i][j]=-1; for(auto& d:dirs) { int ni=i+d[0], nj=j+d[1]; if(ni>=0&&ni<m&&nj>=0&&nj<n&&g[ni][nj]!=-1) cnt+=dfs(g,ni,nj,left-1); } g[i][j]=tmp; return cnt; }' },
  ],
  pitfalls: ['❌ int overflow — paths can exceed 2³¹-1 for large m,n; use long or DP.', '❌ Forgetting memo — exponential TLE.'],
  edgeCases: [{ input: '1×1 grid', breaks: 'only 1 path (stay put)' }],
  interviewTip: '💡 "Unique paths" → DFS + memo or combinatorial formula (m+n-2 choose m-1).',
})

export const floodFillLeaf = leaf('flood-fill', 'Flood Fill', 'blue', {
  template: `${CPP_HEADER}void dfs(vector<vector<int>>& image, int i, int j, int color, int orig) {
    if (i < 0 || i >= (int)image.size() || j < 0 || j >= (int)image[0].size() || image[i][j] != orig) return;
    image[i][j] = color;
    dfs(image, i+1, j, color, orig); dfs(image, i-1, j, color, orig);
    dfs(image, i, j+1, color, orig); dfs(image, i, j-1, color, orig);
}

vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    if (image[sr][sc] == color) return image;
    dfs(image, sr, sc, color, image[sr][sc]);
    return image;
}`,
  problems: [
    { id: 733, title: 'Flood Fill', slug: 'flood-fill', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (DFS fill connected same-color cells).' },
    { id: 1034, title: 'Coloring A Border', slug: 'coloring-a-border', companies: ['GOOGLE'], lineChanges: 'Only color border cells of the connected component (grid edge or adjacent to different color).', variationCode: 'if (i==0||i==m-1||j==0||j==n-1||image[i+1][j]!=orig||image[i-1][j]!=orig||image[i][j+1]!=orig||image[i][j-1]!=orig) image[i][j]=color; else dfs(...)' },
  ],
  pitfalls: ['❌ Infinite recursion if target color == original color — check up front.', '❌ Recursion depth on large grid — use explicit stack or BFS.'],
  edgeCases: [{ input: 'target color == original', breaks: 'no change; early return' }],
  interviewTip: '💡 "Flood fill" → DFS replace connected cells; guard against same-color input.',
})

export const gridBfsShortestLeaf = leaf('grid-bfs-shortest', 'Basic Grid BFS', 'green', {
  template: `${CPP_HEADER}int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n = (int)grid.size();
    if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
    int dirs[8][2] = {{1,0},{-1,0},{0,1},{0,-1},{1,1},{1,-1},{-1,1},{-1,-1}};
    queue<pair<int,int>> q; q.push({0,0}); grid[0][0] = 1;
    int dist = 1;
    while (!q.empty()) {
        int sz = (int)q.size();
        while (sz--) {
            auto [i, j] = q.front(); q.pop();
            if (i == n-1 && j == n-1) return dist;
            for (auto& d : dirs) {
                int ni = i + d[0], nj = j + d[1];
                if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] == 0) {
                    grid[ni][nj] = 1; q.push({ni, nj});
                }
            }
        }
        dist++;
    }
    return -1;
}`,
  problems: [
    { id: 1091, title: 'Shortest Path in Binary Matrix', slug: 'shortest-path-in-binary-matrix', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 4–22: as-is (8-direction BFS).' },
    { id: 1926, title: 'Nearest Exit from Entrance', slug: 'nearest-exit-from-entrance-in-maze', companies: ['AMAZON', 'META'], lineChanges: 'BFS from entrance; stop at any border cell that is not entrance.', variationCode: 'queue<tuple<int,int,int>> q; q.push({si,sj,0}); visited[si][sj]=1; while(!q.empty()){ auto[i,j,d]=q.front();q.pop(); if((i==0||i==m-1||j==0||j==n-1)&&!(i==si&&j==sj)) return d; /* bfs 4-dir */ } return -1;' },
  ],
  pitfalls: ['❌ Forgetting to mark visited on enqueue — infinite loop.', '❌ 8-direction vs 4-direction confusion; read prompt carefully.'],
  edgeCases: [{ input: 'start == end', breaks: 'return 1 (single cell length)' }],
  interviewTip: '💡 "Shortest path in grid" → level-order BFS with visited on enqueue.',
})

export const gridBfsConstrainedLeaf = leaf('grid-bfs-constrained', 'Constrained Movement', 'lime', {
  template: `${CPP_HEADER}int shortestPath(vector<vector<int>>& grid, int k) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    if (m == 1 && n == 1) return 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    bool vis[41][41][1601] = {};
    queue<tuple<int,int,int,int>> q; // i, j, steps, kLeft
    q.push({0, 0, 0, k}); vis[0][0][k] = true;
    while (!q.empty()) {
        auto [i, j, d, rem] = q.front(); q.pop();
        for (auto& dir : dirs) {
            int ni = i + dir[0], nj = j + dir[1];
            if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
            int nk = rem - grid[ni][nj];
            if (nk < 0 || vis[ni][nj][nk]) continue;
            if (ni == m-1 && nj == n-1) return d + 1;
            vis[ni][nj][nk] = true; q.push({ni, nj, d+1, nk});
        }
    }
    return -1;
}`,
  problems: [
    { id: 1293, title: 'Shortest Path Obstacle Elimination', slug: 'shortest-path-in-a-grid-with-obstacles-elimination', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 4–22: as-is (BFS with remaining eliminations as state dimension).' },
  ],
  pitfalls: ['❌ Not tracking k in visited state — revisit with worse k.', '❌ Greedy DFS — BFS with state (i,j,k) is required.'],
  edgeCases: [{ input: 'k >= obstacles count', breaks: 'shortest path is Manhattan distance' }],
  interviewTip: '💡 "Obstacle elimination" → BFS with (row, col, kLeft) state; visit[][] dimensioned by k.',
})

export const gridMultiSourceLeaf = leaf('grid-multi-source', 'Simultaneous Spread', 'lime', {
  template: `${CPP_HEADER}int orangesRotting(vector<vector<int>>& grid) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0, dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 2) q.push({i, j});
            else if (grid[i][j] == 1) fresh++;
        }
    if (fresh == 0) return 0;
    int minutes = 0;
    while (!q.empty()) {
        int sz = (int)q.size();
        while (sz--) {
            auto [i, j] = q.front(); q.pop();
            for (auto& d : dirs) {
                int ni = i + d[0], nj = j + d[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                    grid[ni][nj] = 2; fresh--; q.push({ni, nj});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes - 1 : -1;
}`,
  problems: [
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–25: as-is (multi-source BFS with minute counter).' },
    { id: 1162, title: 'As Far from Land as Possible', slug: 'as-far-from-land-as-possible', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Multi-source BFS from all land cells; max distance recorded.', variationCode: 'queue from all lands; dist[][] initialized 0 for land, INT_MAX for water; bfs updating min dist to any land; return max dist or -1 if no water/land' },
  ],
  pitfalls: ['❌ Counting minutes off-by-one — start at -1 or return after loop?', '❌ Not handling case where fresh oranges remain unreachable.'],
  edgeCases: [{ input: 'no fresh oranges', breaks: 'return 0 before BFS' }, { input: 'no rotting oranges', breaks: 'return -1' }],
  interviewTip: '💡 "Rotting oranges / spread" → multi-source BFS, push all sources first.',
})

export const diagonalLeaf = leaf('diagonal', 'Diagonal Traversals', 'pink', {
  template: `${CPP_HEADER}vector<int> findDiagonalOrder(vector<vector<int>>& mat) {
    int m = (int)mat.size(), n = (int)mat[0].size();
    vector<int> out;
    for (int s = 0; s < m + n - 1; s++) {
        if (s % 2 == 0) {
            int i = min(s, m - 1), j = s - i;
            while (i >= 0 && j < n) out.push_back(mat[i--][j++]);
        } else {
            int j = min(s, n - 1), i = s - j;
            while (j >= 0 && i < m) out.push_back(mat[i++][j--]);
        }
    }
    return out;
}`,
  problems: [
    { id: 498, title: 'Diagonal Traverse', slug: 'diagonal-traverse', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3–14: as-is (alternate direction per diagonal sum s).' },
  ],
  pitfalls: ['❌ Direction flip — even sums go up-right, odd sums go down-left.', '❌ Off-by-one on m+n-2 vs m+n-1 diagonals.'],
  edgeCases: [{ input: 'single row or column', breaks: 'loop bounds adjust via clamp to min(s, m-1) / min(s, n-1)' }],
  interviewTip: '💡 "Diagonal traverse" → iterate s = i+j; alternate direction per s parity.',
})

export const spiralLeaf = leaf('spiral', 'Spiral Traversals', 'purple', {
  template: `${CPP_HEADER}vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> out;
    int t = 0, b = (int)matrix.size() - 1, l = 0, r = (int)matrix[0].size() - 1;
    while (t <= b && l <= r) {
        for (int j = l; j <= r; j++) out.push_back(matrix[t][j]); t++;
        for (int i = t; i <= b; i++) out.push_back(matrix[i][r]); r--;
        if (t <= b) for (int j = r; j >= l; j--) out.push_back(matrix[b][j]); b--;
        if (l <= r) for (int i = b; i >= t; i--) out.push_back(matrix[i][l]); l++;
    }
    return out;
}`,
  problems: [
    { id: 54, title: 'Spiral Matrix', slug: 'spiral-matrix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (shrink boundaries).' },
    { id: 59, title: 'Spiral Matrix II', slug: 'spiral-matrix-ii', companies: ['AMAZON'], lineChanges: 'Same boundary shrink, but write incrementing val instead of reading.', variationCode: 'int val = 1; while(...) { for(j) matrix[t][j]=val++; t++; ... }' },
  ],
  pitfalls: ['❌ Shrinking after last row/col — guard t<=b and l<=r after first two moves.', '❌ Forgetting matrix may not be square — handle non-square boundaries.'],
  edgeCases: [{ input: 'single element', breaks: 'loop runs once for each boundary' }, { input: 'single row', breaks: 'no down/up moves after right move' }],
  interviewTip: '💡 "Spiral matrix" → shrink t,b,l,r boundaries; guard each direction.',
})

export const rotateLeaf = leaf('rotate', 'Rotational', 'amber', {
  template: `${CPP_HEADER}void rotate(vector<vector<int>>& matrix) {
    int n = (int)matrix.size();
    for (int i = 0; i < n / 2; i++) {
        for (int j = i; j < n - 1 - i; j++) {
            int tmp = matrix[i][j];
            matrix[i][j] = matrix[n-1-j][i];
            matrix[n-1-j][i] = matrix[n-1-i][n-1-j];
            matrix[n-1-i][n-1-j] = matrix[j][n-1-i];
            matrix[j][n-1-i] = tmp;
        }
    }
}`,
  problems: [
    { id: 48, title: 'Rotate Image', slug: 'rotate-image', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3–11: as-is (4-way swap per layer).' },
  ],
  pitfalls: ['❌ Rotating in wrong direction — clockwise vs counter-clockwise.', '❌ Iterating entire matrix instead of layer boundaries — double rotation.'],
  edgeCases: [{ input: '1×1 matrix', breaks: 'loop never runs; no-op' }],
  interviewTip: '💡 "Rotate image 90°" → 4-way swap on each layer; only iterate n/2 layers.',
})

export const shapeBoundaryLeaf = leaf('shape-boundary', 'Boundary', 'orange', {
  template: `${CPP_HEADER}vector<vector<int>> rotateGrid(vector<vector<int>>& grid, int k) {
    int m = (int)grid.size(), n = (int)grid[0].size();
    int t = 0, b = m - 1, l = 0, r = n - 1;
    while (t < b && l < r) {
        vector<int> layer;
        for (int j = l; j < r; j++) layer.push_back(grid[t][j]);
        for (int i = t; i < b; i++) layer.push_back(grid[i][r]);
        for (int j = r; j > l; j--) layer.push_back(grid[b][j]);
        for (int i = b; i > t; i--) layer.push_back(grid[i][l]);
        int len = (int)layer.size(), rot = k % len;
        rotate(layer.begin(), layer.begin() + (len - rot), layer.end());
        int idx = 0;
        for (int j = l; j < r; j++) grid[t][j] = layer[idx++];
        for (int i = t; i < b; i++) grid[i][r] = layer[idx++];
        for (int j = r; j > l; j--) grid[b][j] = layer[idx++];
        for (int i = b; i > t; i--) grid[i][l] = layer[idx++];
        t++; b--; l++; r--;
    }
    return grid;
}`,
  problems: [
    { id: 1914, title: 'Cyclically Rotating a Grid', slug: 'cyclically-rotating-a-grid', companies: ['GOOGLE'], lineChanges: 'Lines 4–21: as-is (extract each layer ring, rotate, place back).' },
  ],
  pitfalls: ['❌ Extracting layer elements out of order — maintain clockwise order.', '❌ k may be larger than layer length — k %= len.'],
  edgeCases: [{ input: 'single row/col', breaks: 'while condition t<b && l<r prevents inner layers with no depth' }],
  interviewTip: '💡 "Cyclic rotation" → extract each boundary layer as a 1D array, rotate, write back.',
})
