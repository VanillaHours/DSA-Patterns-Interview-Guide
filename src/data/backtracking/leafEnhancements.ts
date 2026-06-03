import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'basic-subset-gen': e({
    xray: [
      { text: 'Return all possible **subsets** (the power set)', kind: 'goal' },
      { text: 'Return all **combinations** of k numbers out of 1..n', kind: 'goal' },
      { text: 'Subsets may contain **duplicates** in input', kind: 'constraint' },
    ],
    budget: ['subsets', 'choose', 'enumerate'],
    slottedTemplate: `function<void(int)> dfs = [&](int i) {
    if ({{BASE_COND}}) { ans.push_back(cur); return; }
    // choose
    cur.push_back(nums[i]);
    dfs({{CHOOSE_NEXT}});
    cur.pop_back();
    // skip
    dfs({{SKIP_NEXT}});
};`,
    slots: [
      { id: 'BASE_COND', label: 'Base case condition' },
      { id: 'CHOOSE_NEXT', label: 'Next index after choose' },
      { id: 'SKIP_NEXT', label: 'Next index after skip' },
    ],
    slotFills: {
      78: { BASE_COND: 'i == n', CHOOSE_NEXT: 'i + 1', SKIP_NEXT: 'i + 1' },
      90: { BASE_COND: 'i == n', CHOOSE_NEXT: 'i + 1', SKIP_NEXT: 'i + 1 // sort + skip dup at for-loop level' },
      77: { BASE_COND: 'cur.size() == k', CHOOSE_NEXT: 'i + 1 // for-loop over start..n' },
    },
    helixOrder: [78, 77, 90],
    helixDelta: {
      78: 'Subsets I: choose/not-choose — no dedup needed',
      77: 'Combinations: for-loop with start index tracking k size',
      90: 'Subsets II: sort + skip consecutive duplicates',
    },
    autopsies: [
      {
        cause: 'Including empty set multiple times in subsets',
        wrong: 'if (i == n) ans.push_back(cur);',
        testCase: 'LC 78 [1,2,3]',
        fix: 'Base case fires exactly once per path — correct as written.',
      },
    ],
    sayIt: [
      'Subsets: choose/not-choose per element.',
      'Combinations: for-loop from start to n, track cur.size() == k.',
      'With duplicates: sort + skip consecutive equals.',
    ],
  }),

  'combos-with-constraints': e({
    xray: [
      { text: 'Find all unique **combination sums** that sum to target', kind: 'goal' },
      { text: 'Each number may be used **unlimited** times (I)', kind: 'constraint' },
      { text: 'Each number may be used **once** (II)', kind: 'constraint' },
    ],
    budget: ['targetSum', 'combinations', 'pruning'],
    slottedTemplate: `function<void(int,int)> dfs = [&](int i, int sum) {
    if (sum == target) { ans.push_back(cur); return; }
    if ({{PRUNE}}) return;
    for (int j = i; j < n; j++) {
        {{DUP_CHECK}}
        cur.push_back(cand[j]);
        dfs({{NEXT_INDEX}}, sum + cand[j]);
        cur.pop_back();
    }
};`,
    slots: [
      { id: 'PRUNE', label: 'Prune condition' },
      { id: 'DUP_CHECK', label: 'Duplicate check' },
      { id: 'NEXT_INDEX', label: 'Next start index' },
    ],
    slotFills: {
      39: { PRUNE: 'sum > target', DUP_CHECK: '', NEXT_INDEX: 'j' },
      40: { PRUNE: 'sum > target', DUP_CHECK: 'if (j > i && cand[j] == cand[j-1]) continue', NEXT_INDEX: 'j + 1' },
      216: { PRUNE: 'sum > n || cur.size() >= k', DUP_CHECK: '', NEXT_INDEX: 'j + 1' },
    },
    helixOrder: [39, 40, 216],
    helixDelta: {
      39: 'Unlimited reuse — dfs(j)',
      40: 'Each used once — dfs(j+1); sort + skip dup',
      216: 'Fixed count k — prune on cur.size() >= k',
    },
    autopsies: [
      {
        cause: 'Allowing reuse in Combination Sum II (should use each once)',
        wrong: 'dfs(j, sum + cand[j])  // reuse same index',
        testCase: 'LC 40 cand=[10,1,2,7,6,1,5] target=8',
        fix: 'dfs(j+1, sum + cand[j]) — move to next index after picking',
      },
    ],
    sayIt: [
      'Combination Sum I: dfs(j) — same element can be reused.',
      'Combination Sum II: dfs(j+1) — each used once; sort + skip dup.',
      'Combination Sum III: dfs(j+1) with k count pruning.',
    ],
  }),

  'basic-perm-gen': e({
    xray: [
      { text: 'Return all **permutations** of distinct integers', kind: 'goal' },
      { text: 'Return **all unique** permutations of possible duplicates', kind: 'goal' },
    ],
    budget: ['permutations', 'swap', 'usedArray'],
    slottedTemplate: `function<void(int)> dfs = [&](int start) {
    if (start == n) { ans.push_back({{STATE}}); return; }
    for (int i = start; i < n; i++) {
        {{DUP_CHECK}}
        swap({{A}}, {{B}});
        dfs(start + 1);
        swap({{A}}, {{B}});
    }
};`,
    slots: [
      { id: 'STATE', label: 'State to record' },
      { id: 'DUP_CHECK', label: 'Duplicate skip' },
      { id: 'A', label: 'First swap arg' },
      { id: 'B', label: 'Second swap arg' },
    ],
    slotFills: {
      46: { STATE: 'nums', DUP_CHECK: '', A: 'nums[start]', B: 'nums[i]' },
      47: { STATE: 'cur', DUP_CHECK: 'if (used[i] || (i>0 && nums[i]==nums[i-1] && !used[i-1])) continue', A: '', B: '// used[] array approach' },
    },
    helixOrder: [46, 47],
    helixDelta: {
      46: 'Distinct: swap-based O(n!) no extra space',
      47: 'Duplicates: sort + used[] array + skip condition',
    },
    autopsies: [
      {
        cause: 'Swap-based on duplicates produces duplicate permutations',
        wrong: 'swap(nums[start], nums[i]); dfs(start+1); swap back;',
        testCase: 'LC 47 [1,1,2]',
        fix: 'Use used[] array for duplicates: sort + skip if used[i-1] is false and same value',
      },
    ],
    sayIt: [
      'Distinct permutations: swap-based — O(1) space.',
      'Duplicates: sort + used[] + skip if prev equal and not used.',
    ],
  }),

  'circular-perm': e({
    xray: [
      { text: 'Return the **next lexicographic permutation** in-place', kind: 'goal' },
    ],
    budget: ['permutations', 'nextPermutation'],
    slottedTemplate: `int i = n - 2;
while (i >= 0 && nums[i] {{COMPARE}} nums[i + 1]) i--;
if (i >= 0) {
    int j = n - 1;
    while (nums[j] {{COMPARE2}} nums[i]) j--;
    swap(nums[i], nums[j]);
}
reverse(nums.begin() + i + 1, nums.end());`,
    slots: [
      { id: 'COMPARE', label: 'Compare condition (decreasing)' },
      { id: 'COMPARE2', label: 'Compare condition (find larger)' },
    ],
    slotFills: {
      31: { COMPARE: '>=', COMPARE2: '<=' },
    },
    helixOrder: [31],
    helixDelta: { 31: 'Next Permutation: pivot + swap + reverse suffix' },
    autopsies: [
      {
        cause: 'Reversing entire array instead of suffix',
        wrong: 'reverse(nums.begin(), nums.end());',
        testCase: '[1,3,2] -> next is [2,1,3]; not [3,2,1]',
        fix: 'reverse only the suffix after the pivot: reverse(nums.begin() + i + 1, nums.end())',
      },
    ],
    sayIt: [
      'Find pivot (first decrease from right).',
      'Swap with next larger element on right.',
      'Reverse the suffix after pivot.',
    ],
  }),

  'char-based-gen': e({
    xray: [
      { text: 'Return all **letter combinations** a phone number can represent', kind: 'goal' },
      { text: 'Return all **case permutations** of a string', kind: 'goal' },
    ],
    budget: ['stringGen', 'mapping'],
    slottedTemplate: `function<void(int)> dfs = [&](int i) {
    if (i == {{LIMIT}}) { ans.push_back(cur); return; }
    for (char c : {{CHARS}}) {
        cur.push_back(c);
        dfs(i + 1);
        cur.pop_back();
    }
};`,
    slots: [
      { id: 'LIMIT', label: 'Recursion limit' },
      { id: 'CHARS', label: 'Character set for this position' },
    ],
    slotFills: {
      17: { LIMIT: 'digits.size()', CHARS: 'map[digits[i] - \'0\']' },
      784: { LIMIT: 's.size()', CHARS: 'isalpha(s[i]) ? lower/upper : s[i] // branch on case' },
    },
    helixOrder: [17, 784],
    helixDelta: {
      17: 'Phone number: map digit to chars, for-each branch',
      784: 'Letter case: branch on lower vs upper for each alpha char',
    },
    autopsies: [
      {
        cause: 'Empty input returns [""] instead of []',
        wrong: 'base case fires: ans = [""]',
        testCase: 'LC 17 digits=""',
        fix: 'Early return empty vector if input empty',
      },
    ],
    sayIt: [
      'Phone number: mapping array + recursive for-each.',
      'Letter case: if alpha, branch lower/upper; else just continue.',
    ],
  }),

  'word-based-gen': e({
    xray: [
      { text: 'Generate all well-formed **parentheses** pairs', kind: 'goal' },
      { text: '**Restore** valid IP addresses from digits', kind: 'goal' },
    ],
    budget: ['stringGen', 'structuralRules'],
    slottedTemplate: `function<void({{PARAMS}})> dfs = [&]({{ARGS}}) {
    if ({{BASE}}) { ans.push_back(cur); return; }
    {{BRANCH_LOGIC}}
};`,
    slots: [
      { id: 'PARAMS', label: 'Function parameters' },
      { id: 'ARGS', label: 'Arguments passed' },
      { id: 'BASE', label: 'Base case' },
      { id: 'BRANCH_LOGIC', label: 'Branching logic with structural rules' },
    ],
    slotFills: {
      22: { PARAMS: 'int open, int close', ARGS: 'open, close', BASE: 'open == n && close == n', BRANCH_LOGIC: 'if (open < n) { cur.push_back(\'(\'); dfs(open+1, close); cur.pop_back(); } if (close < open) { cur.push_back(\')\'); dfs(open, close+1); cur.pop_back(); }' },
      93: { PARAMS: 'int start, int seg', ARGS: 'start, seg', BASE: 'seg == 4 && start == n', BRANCH_LOGIC: 'for (int len = 1; len <= 3 && start+len <= n; len++) { string part = s.substr(start, len); if ((part.size()>1 && part[0]==\'0\') || stoi(part)>255) continue; cur += (seg>0 ? "." : "") + part; dfs(start+len, seg+1); cur.resize(cur.size() - (seg>0 ? 1+part.size() : part.size())); }' },
    },
    helixOrder: [22, 93],
    helixDelta: {
      22: 'Parentheses: track open/close count; close < open invariant',
      93: 'IP: for each segment try 1..3 chars, check leading zero + ≤255',
    },
    autopsies: [
      {
        cause: 'Parentheses: allowing close == open (invalid)',
        wrong: 'if (close < n) push ")"',
        testCase: 'LC 22 n=3',
        fix: 'close < open — only close when there is a matching open',
      },
    ],
    sayIt: [
      'Parentheses: open < n -> push "("; close < open -> push ")".',
      'IP: try 1..3 char segments; no leading zero; ≤255.',
    ],
  }),

  'partition-problems': e({
    xray: [
      { text: 'Return all possible **palindrome partitioning** of a string', kind: 'goal' },
      { text: 'Partition into **k equal sum** subsets', kind: 'goal' },
      { text: 'Split array into **Fibonacci sequence**', kind: 'goal' },
    ],
    budget: ['partition', 'backtrack', 'pruning'],
    slottedTemplate: `function<void({{PARAMS}})> dfs = [&]({{ARGS}}) {
    if ({{BASE}}) { ans.push_back(cur); return; }
    {{EXPLORE}}
};`,
    slots: [
      { id: 'PARAMS', label: 'Function parameters' },
      { id: 'ARGS', label: 'Arguments passed' },
      { id: 'BASE', label: 'Base case condition' },
      { id: 'EXPLORE', label: 'Branching logic' },
    ],
    slotFills: {
      131: { PARAMS: 'int start', ARGS: 'start', BASE: 'start == n', EXPLORE: 'for (int end = start; end < n; end++) { string sub = s.substr(start, end-start+1); if (isPalindrome(sub)) { cur.push_back(sub); dfs(end+1); cur.pop_back(); } }' },
      698: { PARAMS: 'int i', ARGS: 'i', BASE: 'i == n', EXPLORE: 'for (int j = 0; j < k; j++) { if (buckets[j] + nums[i] > target) continue; if (j > 0 && buckets[j] == buckets[j-1]) continue; buckets[j] += nums[i]; if (dfs(i+1)) return true; buckets[j] -= nums[i]; } return false;' },
      842: { PARAMS: 'int start', ARGS: 'start', BASE: 'start == n && cur.size() >= 3', EXPLORE: 'for (int len = 1; len <= 10 && start+len <= n; len++) { string part = s.substr(start, len); long val = stol(part); if (val > INT_MAX || (part.size()>1 && part[0]==\'0\')) break; if (cur.size() < 2 || (long)cur[cur.size()-1]+(long)cur[cur.size()-2] == val) { cur.push_back(val); if (dfs(start+len)) return true; cur.pop_back(); } } return false;' },
    },
    helixOrder: [131, 698, 842],
    helixDelta: {
      131: 'Palindrome: for-loop on end, check palindrome at each split',
      698: 'K subsets: sort desc, fill buckets, prune with bucket equality skip',
      842: 'Fibonacci: track prev two values, check leading zero + overflow',
    },
    autopsies: [
      {
        cause: '698: not sorting descending — more branching with small numbers first',
        wrong: 'sort(nums.begin(), nums.end());',
        testCase: 'LC 698 large numbers',
        fix: 'sort(rbegin(), rend()) — larger numbers first reduce branching factor',
      },
    ],
    sayIt: [
      'Palindrome: for each end, check palindrome, recurse from end+1.',
      'K subsets: sort desc, fill k buckets, prune target exceeded.',
      'Fibonacci: track prev two, validate each candidate.',
    ],
  }),

  'classic-board': e({
    xray: [
      { text: 'Return all distinct solutions to **N-Queens**', kind: 'goal' },
      { text: '**Solve** a given Sudoku puzzle', kind: 'goal' },
    ],
    budget: ['constraintSat', 'board', 'pruning'],
    slottedTemplate: `function<void(int)> dfs = [&](int row) {
    if (row == n) { ans.push_back(board); return; }
    for (int col = 0; col < n; col++) {
        if ({{CONFLICT}}) continue;
        {{PLACE}}
        dfs(row + 1);
        {{REMOVE}}
    }
};`,
    slots: [
      { id: 'CONFLICT', label: 'Conflict check' },
      { id: 'PLACE', label: 'Place piece' },
      { id: 'REMOVE', label: 'Remove piece' },
    ],
    slotFills: {
      51: { CONFLICT: 'cols[col] || diag1[row+col] || diag2[row-col+n-1]', PLACE: "board[row][col]='Q'; cols[col]=diag1[row+col]=diag2[row-col+n-1]=true;", REMOVE: "board[row][col]='.'; cols[col]=diag1[row+col]=diag2[row-col+n-1]=false;" },
      37: { CONFLICT: 'rows[row][v] || cols[col][v] || boxes[b][v]', PLACE: "board[row][col]=v+'1'; rows[row][v]=cols[col][v]=boxes[b][v]=true;", REMOVE: "board[row][col]='.'; rows[row][v]=cols[col][v]=boxes[b][v]=false;" },
    },
    helixOrder: [51, 52, 37],
    helixDelta: {
      51: 'N-Queens: row by row, O(1) conflict check with col/diag arrays',
      52: 'N-Queens II: same as 51 but count solutions instead of building boards',
      37: 'Sudoku: find empty cell, try 1..9, check row/col/box constraints',
    },
    autopsies: [
      {
        cause: 'N-Queens: checking conflicts with O(n) loop instead of arrays',
        wrong: 'for (int i = 0; i < row; i++) if (board[i][col] == \'Q\') ...',
        testCase: 'LC 51 n=8',
        fix: 'Use cols[], diag1[row+col], diag2[row-col+n-1] — O(1) check',
      },
    ],
    sayIt: [
      'N-Queens: cols, diag1 (r+c), diag2 (r-c+n-1) for O(1) conflict check.',
      'Sudoku: pre-load row/col/box states; try 1..9 in each empty cell.',
    ],
  }),

  'game-board': e({
    xray: [
      { text: 'Collect **maximum gold** in a grid path', kind: 'goal' },
      { text: 'Determine if a **Sudoku board** is valid', kind: 'goal' },
    ],
    budget: ['board', 'dfs', 'maximize'],
    slottedTemplate: `function<void(int,int,int)> dfs = [&](int r, int c, int sum) {
    best = max(best, sum);
    for (int d = 0; d < 4; d++) {
        int nr = r + dirs[d], nc = c + dirs[d+1];
        {{VISIT_CHECK}}
    }
};`,
    slots: [
      { id: 'VISIT_CHECK', label: 'Visit check and recurse' },
    ],
    slotFills: {
      1219: { VISIT_CHECK: 'if (nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc] && !vis[nr][nc]) { vis[nr][nc]=true; dfs(nr,nc,sum+grid[nr][nc]); vis[nr][nc]=false; }' },
      36: { VISIT_CHECK: '// Valid Sudoku: no DFS needed — validation with row/col/box bool arrays' },
    },
    helixOrder: [1219, 36],
    helixDelta: {
      1219: 'Max gold: DFS from each gold cell, track visited, update best',
      36: 'Valid Sudoku: validate constraints with row/col/box tracking',
    },
    autopsies: [
      {
        cause: 'Not resetting visited state when exploring from different start cells',
        wrong: 'vis[i][j] never reset after the first start cell',
        testCase: 'grid where paths overlap',
        fix: 'Reset visited for each start cell: vis[i][j]=false after dfs returns',
      },
    ],
    sayIt: [
      'Max gold: DFS from each gold cell; reset visited per start.',
      'Valid Sudoku: check row/col/box with bool[9][9]; no backtracking.',
    ],
  }),

  'word-pattern-matching': e({
    xray: [
      { text: '**Word search** exists in a 2D grid', kind: 'goal' },
      { text: 'Return all **words from dictionary** found on board', kind: 'goal' },
      { text: '**Word pattern** — bijection between pattern and words', kind: 'goal' },
    ],
    budget: ['pattern', 'dfs', 'grid', 'string'],
    slottedTemplate: `function<bool(int,int,int)> dfs = [&](int r, int c, int i) {
    if (i == word.size()) return true;
    if ({{BOUNDS}}) return false;
    if (board[r][c] != word[i]) return false;
    char tmp = board[r][c]; board[r][c] = '#';
    for (int d = 0; d < 4; d++)
        if (dfs(r + dirs[d], c + dirs[d+1], i + 1)) return true;
    board[r][c] = tmp;
    return false;
};`,
    slots: [
      { id: 'BOUNDS', label: 'Bounds check' },
    ],
    slotFills: {
      79: { BOUNDS: 'r < 0 || r >= m || c < 0 || c >= n' },
      212: { BOUNDS: 'r < 0 || r >= m || c < 0 || c >= n // additionally prune if no trie path' },
      290: { BOUNDS: '// bijection map — no grid needed' },
    },
    helixOrder: [79, 212, 290],
    helixDelta: {
      79: 'Word Search: DFS + temp mark on grid',
      212: 'Word Search II: Trie + DFS — share prefix search across words',
      290: 'Word Pattern: two-way hash map (char→word, word→char)',
    },
    autopsies: [
      {
        cause: 'Not restoring board state after DFS in Word Search',
        wrong: 'board[r][c] = \'#\'; // never reset back',
        testCase: 'word paths that overlap',
        fix: 'Save char, set marker, DFS, restore char on backtrack',
      },
    ],
    sayIt: [
      'Word Search: DFS with temp placeholder; unmark on backtrack.',
      'Word Search II: build Trie from words, traverse board with trie node.',
      'Word Pattern: two-way bijection map.',
    ],
  }),

  'assignment-problems': e({
    xray: [
      { text: 'Count the number of **squareful arrays**', kind: 'goal' },
      { text: '**Minimum incompatibility** distributing items', kind: 'goal' },
    ],
    budget: ['assignment', 'backtrack', 'pruning', 'bitmask'],
    slottedTemplate: `function<void({{PARAMS}})> dfs = [&]({{ARGS}}) {
    if ({{BASE}}) { {{RECORD}}; return; }
    for (int i = 0; i < n; i++) {
        if (used[i]) continue;
        {{DUP_SKIP}}
        if ({{CONSTRAINT}}) continue;
        used[i] = true;
        dfs({{NEXT}});
        used[i] = false;
    }
};`,
    slots: [
      { id: 'PARAMS', label: 'Function params' },
      { id: 'ARGS', label: 'Arguments' },
      { id: 'BASE', label: 'Base case' },
      { id: 'RECORD', label: 'Record result' },
      { id: 'DUP_SKIP', label: 'Duplicate skip' },
      { id: 'CONSTRAINT', label: 'Pairwise constraint' },
      { id: 'NEXT', label: 'Next call args' },
    ],
    slotFills: {
      996: { PARAMS: 'int prev, int cnt', ARGS: 'prev, cnt', BASE: 'cnt == n', RECORD: 'ans++', DUP_SKIP: 'if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue', CONSTRAINT: 'int s = prev + nums[i]; int r = (int)sqrt(s); if (r * r != s) continue', NEXT: 'nums[i], cnt + 1' },
    },
    helixOrder: [996, 1681],
    helixDelta: {
      996: 'Squareful: perfect square check + skip duplicate permutations',
      1681: 'Min Incompatibility: assign items to k subsets, each no dups, track min diff',
    },
    autopsies: [
      {
        cause: 'Counting duplicate permutations in squareful arrays',
        wrong: 'no duplicate skip on same-value elements',
        testCase: 'LC 996 [1,1,8]',
        fix: 'sort + skip if (i > 0 && nums[i] == nums[i-1] && !used[i-1])',
      },
    ],
    sayIt: [
      'Squareful Arrays: perfect square adjacency check; sort + skip dup.',
      'Min Incompatibility: assign n/k to each subset, no dups per subset.',
    ],
  }),

  'all-possible-paths': e({
    xray: [
      { text: 'Return **all paths** from source to target in DAG', kind: 'goal' },
      { text: 'Find **critical connections** (bridges) in network', kind: 'goal' },
    ],
    budget: ['graph', 'dfs', 'pathEnumeration'],
    slottedTemplate: `function<void(int)> dfs = [&](int u) {
    if (u == target) { ans.push_back(cur); return; }
    for (int v : graph[u]) {
        cur.push_back(v);
        dfs(v);
        cur.pop_back();
    }
};`,
    slots: [
      { id: 'target', label: 'Target node' },
    ],
    slotFills: {
      797: { target: '(int)graph.size() - 1' },
    },
    helixOrder: [797, 1192],
    helixDelta: {
      797: 'All Paths: DFS on DAG from source to target',
      1192: 'Critical Connections: Tarjan with discovery and low times',
    },
    autopsies: [
      {
        cause: 'Not tracking visited in general graph (non-DAG)',
        wrong: 'no visited set — infinite recursion on cycles',
        testCase: 'graph with cycle from v back to u',
        fix: 'For non-DAG, track visited set; for DAG (LC 797), no visited needed',
      },
    ],
    sayIt: [
      'All Paths: DFS + backtrack, cur tracks path.',
      'Critical Connections: disc[] and low[] times.',
    ],
  }),

  'path-with-constraints': e({
    xray: [
      { text: 'Walk **every empty cell** exactly once in a grid', kind: 'goal' },
      { text: '**Robot** clean entire unknown room', kind: 'goal' },
    ],
    budget: ['graph', 'dfs', 'fullCoverage'],
    slottedTemplate: `function<void(int,int,int)> dfs = [&](int r, int c, int walked) {
    if (grid[r][c] == 2) { if (walked == total) ans++; return; }
    grid[r][c] = -1;
    for (int d = 0; d < 4; d++)
        dfs(r + dirs[d], c + dirs[d+1], walked + 1);
    grid[r][c] = 0;
};`,
    slots: [
      { id: 'total', label: 'Total cells to visit' },
    ],
    slotFills: {
      980: { total: 'empty + 1 // start cell counts as visited' },
      489: { total: '// unknown — visited set tracks explored cells' },
    },
    helixOrder: [980, 489],
    helixDelta: {
      980: 'Unique Paths III: must walk every empty cell exactly once',
      489: 'Robot Cleaner: DFS on unknown grid; reverse moves on backtrack',
    },
    autopsies: [
      {
        cause: 'Not counting start cell as visited in Unique Paths III',
        wrong: 'walked == empty (without +1)',
        testCase: 'grid with start at (0,0) and goal at (0,1)',
        fix: 'walked == empty + 1 — start cell is counted as visited',
      },
    ],
    sayIt: [
      'Unique Paths III: DFS must visit all empty cells + start.',
      'Robot Cleaner: DFS + turn back on backtrack (reverse + move + reverse).',
    ],
  }),

  'graph-coloring': e({
    xray: [
      { text: 'Determine if graph is **bipartite**', kind: 'goal' },
      { text: '**Possible bipartition** given dislike pairs', kind: 'goal' },
    ],
    budget: ['graph', 'bipartite', 'coloring'],
    slottedTemplate: `for (int i = 0; i < n; i++) {
    if (color[i] != -1) continue;
    color[i] = 0;
    queue<int> q; q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : graph[u]) {
            if (color[v] == color[u]) return false;
            if (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }
        }
    }
}
return true;`,
    slots: [],
    slotFills: {},
    helixOrder: [785, 886],
    helixDelta: {
      785: 'Bipartite: two-color with BFS/DFS over all components',
      886: 'Possible Bipartition: build adjacency from dislikes, then same bipartite check',
    },
    autopsies: [
      {
        cause: 'Not checking all components in disconnected graph',
        wrong: 'for-loop only starts from node 0 assuming connected',
        testCase: 'two disconnected components each bipartite',
        fix: 'Loop over all nodes; start BFS/DFS only if uncolored',
      },
    ],
    sayIt: [
      'Bipartite: two-color with BFS. Check all components.',
      'On conflict (same color adjacent) → not bipartite.',
    ],
  }),

  'matrix-exploration': e({
    xray: [
      { text: '**Longest increasing path** in a matrix', kind: 'goal' },
      { text: '**Knight probability** on chessboard', kind: 'goal' },
    ],
    budget: ['matrix', 'dfs', 'memoization', 'dp'],
    slottedTemplate: `function<int(int,int)> dfs = [&](int r, int c) {
    if (memo[r][c]) return memo[r][c];
    int best = 1;
    for (int d = 0; d < 4; d++) {
        int nr = r + dirs[d], nc = c + dirs[d+1];
        if ({{VALID}}) best = max(best, 1 + dfs(nr, nc));
    }
    return memo[r][c] = best;
};`,
    slots: [
      { id: 'VALID', label: 'Move check' },
    ],
    slotFills: {
      329: { VALID: 'nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c]' },
      688: { VALID: '// 8-directional knight moves with memo on (r,c,moves)' },
    },
    helixOrder: [329, 688],
    helixDelta: {
      329: 'LIP: DFS + memo — each cell returns longest path from it',
      688: 'Knight: memo on (r,c,k) — sum of move probabilities / 8',
    },
    autopsies: [
      {
        cause: 'Not using memoization for Longest Increasing Path',
        wrong: 'plain DFS without cache — exponential branching',
        testCase: 'large matrix',
        fix: 'DP memo[r][c] = 1 + max(valid neighbors) — O(mn)',
      },
    ],
    sayIt: [
      'LIP: DFS + memo — returns longest path from current cell.',
      'Knight: memo on state (r, c, moves); probability = avg of 8 moves.',
    ],
  }),

  'branch-and-bound': e({
    xray: [
      { text: '**Maximum length** concatenated string with unique chars', kind: 'goal' },
      { text: '**Closest dessert cost** to target', kind: 'goal' },
    ],
    budget: ['pruning', 'optimization', 'bitmask'],
    slottedTemplate: `function<void(int,{{STATE}})> dfs = [&](int i, {{STATE}}) {
    if (i == n) { ans = {{UPDATE}}; return; }
    // branch 1: take (if compatible)
    if ({{COMPATIBLE}}) dfs(i + 1, {{STATE_AFTER_TAKE}});
    // branch 2: skip (prune if can beat best)
    if ({{BOUND_COND}}) dfs(i + 1, {{STATE_AFTER_SKIP}});
};`,
    slots: [
      { id: 'STATE', label: 'State type' },
      { id: 'UPDATE', label: 'Update best' },
      { id: 'COMPATIBLE', label: 'Compatibility check' },
      { id: 'STATE_AFTER_TAKE', label: 'State after taking' },
      { id: 'BOUND_COND', label: 'Prune bound condition' },
      { id: 'STATE_AFTER_SKIP', label: 'State after skipping' },
    ],
    slotFills: {
      1239: { STATE: 'int mask', UPDATE: 'ans = max(ans, __builtin_popcount(mask))', COMPATIBLE: '(mask & masks[i]) == 0', STATE_AFTER_TAKE: 'mask | masks[i]', BOUND_COND: '// always try skip', STATE_AFTER_SKIP: 'mask' },
      1774: { STATE: 'int cur', UPDATE: 'better of abs(cur-target) vs abs(ans-target)', COMPATIBLE: '// always explore', STATE_AFTER_TAKE: 'cur + k*toppings[i] // k in 0..2', BOUND_COND: '// prune if too far', STATE_AFTER_SKIP: 'cur' },
    },
    helixOrder: [1239, 1774],
    helixDelta: {
      1239: 'Concat string: bitmask for uniqueness check; prune with popcount bound',
      1774: 'Dessert: 0/1/2 of each topping + one base; prune on distance bound',
    },
    autopsies: [
      {
        cause: 'Not pruning when current + remaining cannot beat best',
        wrong: 'exploring skip branch even when impossible to improve',
        testCase: 'LC 1239 with many incompatible strings',
        fix: 'Check popcount(mask | remaining_mask) <= ans before skip branch',
      },
    ],
    sayIt: [
      'Bitmask for character uniqueness.',
      'Prune when current branch cannot beat best known.',
    ],
  }),

  'memoization-backtrack': e({
    xray: [
      { text: '**Word break** — can string be segmented?', kind: 'goal' },
      { text: 'Return **all sentence segmentations** of string', kind: 'goal' },
    ],
    budget: ['memoization', 'dfs', 'dp'],
    slottedTemplate: `function<bool(int)> dfs = [&](int start) {
    if (start == n) return true;
    if (memo[start] != -1) return memo[start];
    for (int end = start + 1; end <= n; end++) {
        if (dict.count(s.substr(start, end - start)) && dfs(end))
            return memo[start] = true;
    }
    return memo[start] = false;
};`,
    slots: [],
    slotFills: {},
    helixOrder: [139, 140],
    helixDelta: {
      139: 'Word Break: memoized DFS by start index',
      140: 'Word Break II: memo map from index to list of sentences',
    },
    autopsies: [
      {
        cause: 'Not memoizing — exponential without cache',
        wrong: 'dfs(start) without memo array',
        testCase: 'LC 139 long string',
        fix: 'memo[start] = -1 (uncomputed), 0 (false), 1 (true)',
      },
    ],
    sayIt: [
      'Word Break I: memoized DFS — cache bool result by start index.',
      'Word Break II: memo map<int, vector<string>> — cache sentences by start index.',
    ],
  }),

  'minimax-game-theory': e({
    xray: [
      { text: '**Predict the winner** — can player 1 win?', kind: 'goal' },
      { text: '**Stone Game II** — maximize piles Alice can take', kind: 'goal' },
    ],
    budget: ['minimax', 'gameTheory', 'memoization'],
    slottedTemplate: `function<int(int,int)> dfs = [&](int l, int r) {
    if (l == r) return nums[l];
    if (memo[l][r] != -1) return memo[l][r];
    int pickLeft = nums[l] - dfs(l + 1, r);
    int pickRight = nums[r] - dfs(l, r - 1);
    return memo[l][r] = max(pickLeft, pickRight);
};`,
    slots: [],
    slotFills: {},
    helixOrder: [486, 1140],
    helixDelta: {
      486: 'Predict Winner: score difference > 0 for win; memo (l,r)',
      1140: 'Stone Game II: memo (i,M); Alice can take 1..2M piles; suf sum for remaining',
    },
    autopsies: [
      {
        cause: 'Returning score instead of score difference',
        wrong: 'return max(nums[l] + dfs(l+1,r), nums[r] + dfs(l,r-1))',
        testCase: 'LC 486 scores',
        fix: 'Use difference: pickLeft = nums[l] - dfs(l+1, r); pickRight = nums[r] - dfs(l, r-1)',
      },
    ],
    sayIt: [
      'Minimax: score difference = myPick - opponentBest.',
      'Both players optimal — opponent minimizes my advantage.',
      'Memoize on (l,r) or (i,M).',
    ],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
