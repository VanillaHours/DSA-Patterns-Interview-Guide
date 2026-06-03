import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <unordered_set>
using namespace std;

`

/* ──────────────────────────────────────────────────────────────
   Combinatorial Generation
   ────────────────────────────────────────────────────────────── */

export const basicSubsetLeaf = leaf('basic-subset-gen', 'Basic Subset Generation', 'lime', {
  template: `${CPP_HEADER}vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> cur;
    function<void(int)> dfs = [&](int i) {
        if (i == (int)nums.size()) { ans.push_back(cur); return; }
        cur.push_back(nums[i]);
        dfs(i + 1);
        cur.pop_back();
        dfs(i + 1);
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–10: choose/not-choose recursion for each element.' },
    { id: 90, title: 'Subsets II', slug: 'subsets-ii', companies: ['AMAZON', 'META', 'GOOGLE'], lineChanges: 'Sort nums; skip dup: if (i > start && nums[i] == nums[i-1]) continue.', variationCode: 'sort(nums.begin(), nums.end()); function<void(int)> dfs = [&](int start) { ans.push_back(cur); for (int i = start; i < n; i++) { if (i > start && nums[i] == nums[i-1]) continue; cur.push_back(nums[i]); dfs(i + 1); cur.pop_back(); } };' },
    { id: 77, title: 'Combinations', slug: 'combinations', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 7: for (int i = start; i <= n; i++) — iterate range; push + recurse + pop.', variationCode: 'function<void(int)> dfs = [&](int start) { if (cur.size() == k) { ans.push_back(cur); return; } for (int i = start; i <= n; i++) { cur.push_back(i); dfs(i + 1); cur.pop_back(); } };' },
  ],
  pitfalls: ['❌ Including empty set multiple times — base case adds at every leaf, not only at end.', '❌ For Subsets II: forgetting to sort first before skipping duplicates.'],
  edgeCases: [{ input: 'empty array (LC 78)', breaks: 'ans = [[]]; works — base case fires immediately' }, { input: 'k > n (LC 77)', breaks: 'no combos generated; ans stays empty; correct' }],
  interviewTip: '💡 Subsets/Combinations: choose/not-choose pattern. For subsets with dups: sort + skip consecutive equal elements.',
})

export const combosWithConstraintsLeaf = leaf('combos-with-constraints', 'Combinations with Constraints', 'green', {
  template: `${CPP_HEADER}vector<vector<int>> combinationSum(vector<int>& cand, int target) {
    vector<vector<int>> ans;
    vector<int> cur;
    function<void(int,int)> dfs = [&](int i, int sum) {
        if (sum == target) { ans.push_back(cur); return; }
        if (i == (int)cand.size() || sum > target) return;
        cur.push_back(cand[i]);
        dfs(i, sum + cand[i]);
        cur.pop_back();
        dfs(i + 1, sum);
    };
    sort(cand.begin(), cand.end());
    dfs(0, 0);
    return ans;
}`,
  problems: [
    { id: 39, title: 'Combination Sum', slug: 'combination-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 7–11: allow reuse of same element (dfs(i, ...)) vs skip (dfs(i+1, ...)).' },
    { id: 40, title: 'Combination Sum II', slug: 'combination-sum-ii', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Sort + skip dup: if (i > start && cand[i] == cand[i-1]) continue; each used once.', variationCode: 'function<void(int,int)> dfs = [&](int start, int sum) { if (sum == target) { ans.push_back(cur); return; } for (int i = start; i < n && sum + cand[i] <= target; i++) { if (i > start && cand[i] == cand[i-1]) continue; cur.push_back(cand[i]); dfs(i + 1, sum + cand[i]); cur.pop_back(); } };' },
    { id: 216, title: 'Combination Sum III', slug: 'combination-sum-iii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'For loop 1..9; track count k; prune if cur.size() > k.', variationCode: 'function<void(int,int,int)> dfs = [&](int start, int sum, int cnt) { if (sum == n && cnt == k) { ans.push_back(cur); return; } if (cnt >= k || sum > n) return; for (int i = start; i <= 9; i++) { cur.push_back(i); dfs(i + 1, sum + i, cnt + 1); cur.pop_back(); } };' },
  ],
  pitfalls: ['❌ Not sorting for Combination Sum II — duplicates must be adjacent to skip.', '❌ Allowing reuse in II (dfs(i)) vs not allowing reuse (dfs(i+1)) confusion.'],
  edgeCases: [{ input: 'target < smallest candidate', breaks: 'sum > target prunes all branches; returns []' }, { input: 'k > 9 (LC 216)', breaks: 'cnt >= k prunes; no valid combos' }],
  interviewTip: '💡 Combination Sum I: same element reused (i). II: each used once (i+1). III: fixed count k with 1..9 range.',
})

export const basicPermLeaf = leaf('basic-perm-gen', 'Basic Permutation Generation', 'teal', {
  template: `${CPP_HEADER}vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> ans;
    function<void(int)> dfs = [&](int start) {
        if (start == (int)nums.size()) { ans.push_back(nums); return; }
        for (int i = start; i < (int)nums.size(); i++) {
            swap(nums[start], nums[i]);
            dfs(start + 1);
            swap(nums[start], nums[i]);
        }
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 46, title: 'Permutations', slug: 'permutations', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–10: swap each element into position start, recurse, swap back.' },
    { id: 47, title: 'Permutations II', slug: 'permutations-ii', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Sort + used[] + skip if (i > 0 && nums[i] == nums[i-1] && !used[i-1]).', variationCode: 'sort(nums.begin(), nums.end()); vector<bool> used(n); function<void()> dfs = [&]() { if (cur.size() == n) { ans.push_back(cur); return; } for (int i = 0; i < n; i++) { if (used[i] || (i > 0 && nums[i] == nums[i-1] && !used[i-1])) continue; used[i] = true; cur.push_back(nums[i]); dfs(); cur.pop_back(); used[i] = false; } };' },
  ],
  pitfalls: ['❌ Permutations II: using set to de-dupe is O(n!) memory; sort + used-array is better.', '❌ Swap-based for distinct works; used[]-based for duplicates handles ordering.'],
  edgeCases: [{ input: 'single element', breaks: 'dfs(0) fires base case; ans = [[x]]' }, { input: 'all duplicates (LC 47)', breaks: 'skip logic prevents any swap variation; ans = [[]] would be wrong — but used[] + skip produces [nums] once' }],
  interviewTip: '💡 Permutations: swap-based (O(1) extra, distinct) or used[]-based (handles duplicates).',
})

export const circularPermLeaf = leaf('circular-perm', 'Circular / Special Permutations', 'pink', {
  template: `${CPP_HEADER}void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}`,
  problems: [
    { id: 31, title: 'Next Permutation', slug: 'next-permutation', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3–9: find first decreasing from right; swap with next larger; reverse suffix.' },
  ],
  pitfalls: ['❌ Reversing entire array instead of suffix (i+1..end) — only the suffix after the pivot is in descending order.', '❌ Not handling the all-descending case: while loop reaches i=-1; reverse entire array (next is first permutation).'],
  edgeCases: [{ input: '[3,2,1] (last permutation)', breaks: 'i = -1; reverse entire array → [1,2,3]; correct' }, { input: '[1] (single element)', breaks: 'while loop skipped; reverse on i+1=0...n-1 does nothing; correct' }],
  interviewTip: '💡 Next Permutation: find pivot (first decrease from right), swap with next larger, reverse suffix. O(n).',
})

export const charBasedGenLeaf = leaf('char-based-gen', 'Character-Based Generation', 'blue', {
  template: `${CPP_HEADER}vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> ans;
    string cur;
    vector<string> map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    function<void(int)> dfs = [&](int i) {
        if (i == (int)digits.size()) { ans.push_back(cur); return; }
        for (char c : map[digits[i] - '0']) {
            cur.push_back(c);
            dfs(i + 1);
            cur.pop_back();
        }
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 17, title: 'Letter Combinations of Phone Number', slug: 'letter-combinations-of-a-phone-number', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 8–12: map digit to letters; for-each char, push, recurse, pop.' },
    { id: 784, title: 'Letter Case Permutation', slug: 'letter-case-permutation', companies: ['META', 'GOOGLE'], lineChanges: 'If char is letter: push lower and upper; if digit: push and continue.', variationCode: 'function<void(int)> dfs = [&](int i) { if (i == s.size()) { ans.push_back(s); return; } if (isalpha(s[i])) { s[i] = tolower(s[i]); dfs(i + 1); s[i] = toupper(s[i]); dfs(i + 1); } else { dfs(i + 1); } };' },
  ],
  pitfalls: ['❌ Empty input: LC 17 expects [] (not [""]).', '❌ Phone number: not all digits map to 4 chars (7→pqrs, 9→wxyz); 0 and 1 map to empty string.'],
  edgeCases: [{ input: 'empty string (LC 17)', breaks: 'early return {}' }, { input: 'digits with 0 or 1', breaks: 'map[0] and map[1] are ""; inner loop iterates 0 times — no paths generated' }],
  interviewTip: '💡 Character generation: map digits to letters, or branch on case. Each position multiplies possibilities.',
})

export const wordBasedGenLeaf = leaf('word-based-gen', 'Word-Based Generation', 'lime', {
  template: `${CPP_HEADER}vector<string> generateParenthesis(int n) {
    vector<string> ans;
    string cur;
    function<void(int,int)> dfs = [&](int open, int close) {
        if (open == n && close == n) { ans.push_back(cur); return; }
        if (open < n) { cur.push_back('('); dfs(open + 1, close); cur.pop_back(); }
        if (close < open) { cur.push_back(')'); dfs(open, close + 1); cur.pop_back(); }
    };
    dfs(0, 0);
    return ans;
}`,
  problems: [
    { id: 22, title: 'Generate Parentheses', slug: 'generate-parentheses', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–8: add open if open < n; add close if close < open — balance invariant.' },
    { id: 93, title: 'Restore IP Addresses', slug: 'restore-ip-addresses', companies: ['AMAZON', 'META', 'GOOGLE'], lineChanges: 'Track segment start and count; for len 1..3; validate no leading zero and ≤ 255.', variationCode: `function<void(int,int)> dfs = [&](int start, int seg) { if (seg == 4 && start == n) { ans.push_back(cur); return; } if (seg == 4 || start == n) return; for (int len = 1; len <= 3 && start + len <= n; len++) { string part = s.substr(start, len); if ((part.size() > 1 && part[0] == '0') || stoi(part) > 255) continue; string prev = cur; if (seg > 0) cur += "."; cur += part; dfs(start + len, seg + 1); cur = prev; } };` },
  ],
  pitfalls: ['❌ Parentheses: allowing close == open (invalid — must have a matching open).', '❌ IP: leading zeros invalid ("01.2.3.4") even though stoi("01")==1.'],
  edgeCases: [{ input: 'n = 0 (LC 22)', breaks: 'base case triggers immediately with ""; ans = [""]' }, { input: 's.length() > 12 (LC 93)', breaks: 'more than 12 chars cannot be a valid IP; returns []' }],
  interviewTip: '💡 Parentheses: open < n to add "(", close < open to add ")". IP: for each segment try len 1..3, check leading zero + ≤ 255.',
})

export const partitionLeaf = leaf('partition-problems', 'Partition Problems', 'pink', {
  template: `${CPP_HEADER}vector<vector<string>> partition(string s) {
    vector<vector<string>> ans;
    vector<string> cur;
    function<void(int)> dfs = [&](int start) {
        if (start == (int)s.size()) { ans.push_back(cur); return; }
        for (int end = start; end < (int)s.size(); end++) {
            string sub = s.substr(start, end - start + 1);
            if (equal(sub.begin(), sub.end(), sub.rbegin())) {
                cur.push_back(sub);
                dfs(end + 1);
                cur.pop_back();
            }
        }
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 131, title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 7–13: for each end, check palindrome; push, recurse from end+1, pop.' },
    { id: 698, title: 'Partition to K Equal Sum Subsets', slug: 'partition-to-k-equal-sum-subsets', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Sort desc; fill k buckets with target sum; prune if bucket exceeds target.', variationCode: 'int target = accumulate(nums.begin(), nums.end(), 0) / k; if (target * k != total) return false; sort(nums.rbegin(), nums.rend()); if (nums[0] > target) return false; vector<int> buckets(k, 0); function<bool(int)> dfs = [&](int i) { if (i == n) return true; for (int j = 0; j < k; j++) { if (buckets[j] + nums[i] > target || (j > 0 && buckets[j] == buckets[j-1])) continue; buckets[j] += nums[i]; if (dfs(i+1)) return true; buckets[j] -= nums[i]; } return false; }; return dfs(0);' },
    { id: 842, title: 'Split Array into Fibonacci', slug: 'split-array-into-fibonacci-sequence', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'For first two numbers, ensure valid (no leading zeros, < 2^31-1); next must equal sum of prev two.', variationCode: `function<bool(int)> dfs = [&](int start) { if (start == n && cur.size() >= 3) return true; long limit = (1LL << 31) - 1; for (int len = 1; len <= 10 && start + len <= n; len++) { string part = s.substr(start, len); if ((part.size() > 1 && part[0] == '0') || stol(part) > limit) break; long val = stol(part); if (cur.size() < 2 || (long)cur[cur.size()-1] + (long)cur[cur.size()-2] == val) { cur.push_back(val); if (dfs(start + len)) return true; cur.pop_back(); } } return false; }; return dfs(0);` },
  ],
  pitfalls: ['❌ Partition to K Equal Sum: not sorting descending — pruning with larger numbers first reduces branching.', '❌ Fibonacci: exceeding 32-bit int bound (2^31-1).'],
  edgeCases: [{ input: 'single char palindrome (LC 131)', breaks: 'ans = [[s]]; works' }, { input: 'fibo: "123456579"', breaks: 'only one valid split; works if early termination used' }],
  interviewTip: '💡 Partition problems: explore split points with for-loop. Palindrome: check at each split. K subsets: sort desc + bucket fill. Fibonacci: track prev two values.',
})

/* ──────────────────────────────────────────────────────────────
   Constraint Satisfaction
   ────────────────────────────────────────────────────────────── */

export const classicBoardLeaf = leaf('classic-board', 'Classic Board Problems', 'purple', {
  template: `${CPP_HEADER}vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> ans;
    vector<string> board(n, string(n, '.'));
    vector<bool> cols(n), diag1(2*n-1), diag2(2*n-1);
    function<void(int)> dfs = [&](int r) {
        if (r == n) { ans.push_back(board); return; }
        for (int c = 0; c < n; c++) {
            if (cols[c] || diag1[r+c] || diag2[r-c+n-1]) continue;
            board[r][c] = 'Q';
            cols[c] = diag1[r+c] = diag2[r-c+n-1] = true;
            dfs(r + 1);
            board[r][c] = '.';
            cols[c] = diag1[r+c] = diag2[r-c+n-1] = false;
        }
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 51, title: 'N-Queens', slug: 'n-queens', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 8–15: place queen row by row; check col, diag1 (r+c), diag2 (r-c+n-1).' },
    { id: 52, title: 'N-Queens II', slug: 'n-queens-ii', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Same as N-Queens but increment counter instead of building board.', variationCode: 'int count = 0; ... if (r == n) { count++; return; } ...' },
    { id: 37, title: 'Sudoku Solver', slug: 'sudoku-solver', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'For each empty cell, try 1..9; check row/col/box constraints; recursive fill.', variationCode: 'bool rows[9][9]={}, cols[9][9]={}, boxes[9][9]={}; for (i,j) if (board[i][j]!=\'.\') { int v=board[i][j]-\'1\'; rows[i][v]=cols[j][v]=boxes[i/3*3+j/3][v]=true; } function<bool()> dfs = [&]() { for (i,j) if (board[i][j]==\'.\') { for (v=0;v<9;v++) { int b=i/3*3+j/3; if (!rows[i][v] && !cols[j][v] && !boxes[b][v]) { board[i][j]=v+\'1\'; rows[i][v]=cols[j][v]=boxes[b][v]=true; if (dfs()) return true; board[i][j]=\'.\'; rows[i][v]=cols[j][v]=boxes[b][v]=false; } } return false; } return true; }; dfs();' },
  ],
  pitfalls: ['❌ N-Queens: not using diag1/diag2 arrays — O(n) check per cell wastes time.', '❌ Sudoku: forgetting to pre-fill constraint tracking arrays before starting DFS.'],
  edgeCases: [{ input: 'n = 1 (N-Queens)', breaks: 'placing queen at (0,0) works; one solution' }, { input: 'n = 2,3 (N-Queens)', breaks: 'no solution; returns []' }],
  interviewTip: '💡 N-Queens: cols[], diag1[r+c], diag2[r-c+n-1] for O(1) conflict check. Sudoku: pre-load row/col/box state then recursive fill.',
})

export const gameBoardLeaf = leaf('game-board', 'Game Board Explorations', 'pink', {
  template: `${CPP_HEADER}int getMaximumGold(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), best = 0;
    vector<vector<bool>> vis(m, vector<bool>(n));
    int dirs[5] = {-1,0,1,0,-1};
    function<void(int,int,int)> dfs = [&](int r, int c, int sum) {
        best = max(best, sum);
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (grid[nr][nc] == 0 || vis[nr][nc]) continue;
            vis[nr][nc] = true;
            dfs(nr, nc, sum + grid[nr][nc]);
            vis[nr][nc] = false;
        }
    };
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j]) { vis[i][j] = true; dfs(i, j, grid[i][j]); vis[i][j] = false; }
    return best;
}`,
  problems: [
    { id: 1219, title: 'Path with Maximum Gold', slug: 'path-with-maximum-gold', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Lines 12–17: DFS from each gold cell; track visited; update best sum.' },
    { id: 36, title: 'Valid Sudoku', slug: 'valid-sudoku', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Check row/col/box constraints with bool arrays; no backtracking needed.', variationCode: 'bool rows[9][9]={}, cols[9][9]={}, boxes[9][9]={}; for (i,j) if (board[i][j]!=\'.\') { int v=board[i][j]-\'1\'; int b=i/3*3+j/3; if (rows[i][v]||cols[j][v]||boxes[b][v]) return false; rows[i][v]=cols[j][v]=boxes[b][v]=true; } return true;' },
  ],
  pitfalls: ['❌ Not resetting visited after exploration — each start path must have its own visited state.', '❌ Valid Sudoku: not a backtracking problem — just validation. But included here as board sanity check.'],
  edgeCases: [{ input: 'grid no gold', breaks: 'best = 0; correct' }, { input: 'single gold cell', breaks: 'DFS from it; best = gold value; correct' }],
  interviewTip: '💡 Path with Max Gold: DFS from every gold cell with visited state. Valid Sudoku: validate row/col/box with bool[9][9].',
})

export const wordPatternLeaf = leaf('word-pattern-matching', 'Word Pattern Matching', 'pink', {
  template: `${CPP_HEADER}bool exist(vector<vector<char>>& board, string word) {
    int m = board.size(), n = board[0].size();
    int dirs[5] = {-1,0,1,0,-1};
    function<bool(int,int,int)> dfs = [&](int r, int c, int i) {
        if (i == (int)word.size()) return true;
        if (r < 0 || r >= m || c < 0 || c >= n) return false;
        if (board[r][c] != word[i]) return false;
        char tmp = board[r][c]; board[r][c] = '#';
        for (int d = 0; d < 4; d++)
            if (dfs(r + dirs[d], c + dirs[d+1], i + 1)) return true;
        board[r][c] = tmp;
        return false;
    };
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (dfs(i, j, 0)) return true;
    return false;
}`,
  problems: [
    { id: 79, title: 'Word Search', slug: 'word-search', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–15: DFS from each cell; mark visited with placeholder; unmark on backtrack.' },
    { id: 212, title: 'Word Search II', slug: 'word-search-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Build Trie from words; DFS board with trie node; collect matches.', variationCode: 'struct Trie { Trie* next[26]; string* word; Trie() { fill(next,next+26,nullptr); word=nullptr; } }; ... build trie; for each cell: dfs(board, i, j, trieRoot); ...' },
    { id: 290, title: 'Word Pattern', slug: 'word-pattern', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Bijection map: pattern char → word, and word → pattern char.', variationCode: 'unordered_map<char,string> c2w; unordered_map<string,char> w2c; istringstream ss(s); for (char c : pattern) { string w; if (!(ss >> w)) return false; if ((c2w.count(c) && c2w[c]!=w) || (w2c.count(w) && w2c[w]!=c)) return false; c2w[c]=w; w2c[w]=c; } return !(ss >> ws);' },
  ],
  pitfalls: ['❌ Word Search: not unmarking visited cells — other branches fail to use those cells.', '❌ Word Search II: brute-force per word (O(4^k) each) vs Trie (share prefix search).'],
  edgeCases: [{ input: 'word longer than total cells (LC 79)', breaks: 'DFS returns false; correct' }, { input: 'empty board (LC 79)', breaks: 'm=0; loops skip; returns false' }],
  interviewTip: '💡 Word Search: DFS with temp mark/unmark. Word Search II: Trie to share prefix search across words. Word Pattern: two-way map.',
})

export const assignmentLeaf = leaf('assignment-problems', 'Assignment Problems', 'orange', {
  template: `${CPP_HEADER}int numSquarefulPerms(vector<int>& nums) {
    int n = nums.size(), ans = 0;
    sort(nums.begin(), nums.end());
    vector<bool> used(n);
    function<void(int,int)> dfs = [&](int prev, int cnt) {
        if (cnt == n) { ans++; return; }
        for (int i = 0; i < n; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
            int s = prev + nums[i];
            int r = (int)sqrt(s);
            if (r * r != s) continue;
            used[i] = true;
            dfs(nums[i], cnt + 1);
            used[i] = false;
        }
    };
    for (int i = 0; i < n; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        used[i] = true;
        dfs(nums[i], 1);
        used[i] = false;
    }
    return ans;
}`,
  problems: [
    { id: 996, title: 'Number of Squareful Arrays', slug: 'number-of-squareful-arrays', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 9–14: check if prev + nums[i] is a perfect square; sort + skip dup for uniqueness.' },
    { id: 1681, title: 'Minimum Incompatibility', slug: 'minimum-incompatibility', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Assign n/k elements to each subset; track min incompatibility per subset with backtrack + pruning.', variationCode: 'sort(nums.begin(), nums.end()); vector<int> assign(n/k, -1); int ans = INT_MAX; function<void(int)> dfs = [&](int i) { if (i == n) { int sum = 0; for each subset: sum += max-min; ans = min(ans, sum); return; } for each subset { if (subset size == n/k) continue; if (subset has nums[i]) continue; // no duplicate in subset add nums[i]; dfs(i+1); remove nums[i]; if (subset empty) break; } };' },
  ],
  pitfalls: ['❌ Squareful Arrays: forgetting to sort + skip duplicates — results in duplicate permutations counted.', '❌ Minimum Incompatibility: not pruning when current sum already exceeds best answer.'],
  edgeCases: [{ input: 'no squareful pair (LC 996)', breaks: 'never hits perfect square; ans = 0' }, { input: 'k = n (LC 1681)', breaks: 'each subset has 1 element; incompatibility = 0; works' }],
  interviewTip: '💡 Squareful Arrays: perfect square check with sqrt. Minimum Incompatibility: assign items to subsets with no-duplicate constraint.',
})

/* ──────────────────────────────────────────────────────────────
   Graph Exploration
   ────────────────────────────────────────────────────────────── */

export const allPathsLeaf = leaf('all-possible-paths', 'All Possible Paths', 'green', {
  template: `${CPP_HEADER}vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
    vector<vector<int>> ans;
    vector<int> cur = {0};
    function<void(int)> dfs = [&](int u) {
        if (u == (int)graph.size() - 1) { ans.push_back(cur); return; }
        for (int v : graph[u]) {
            cur.push_back(v);
            dfs(v);
            cur.pop_back();
        }
    };
    dfs(0);
    return ans;
}`,
  problems: [
    { id: 797, title: 'All Paths From Source to Target', slug: 'all-paths-from-source-to-target', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 6–11: DFS from 0 to n-1; push neighbor, recurse, pop.' },
    { id: 1192, title: 'Critical Connections in a Network', slug: 'critical-connections-in-a-network', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Tarjan DFS: track disc[] and low[] times; edge is critical if low[v] > disc[u].', variationCode: 'vector<int> disc(n,-1), low(n,0); int time = 0; function<void(int,int)> dfs = [&](int u, int p) { disc[u] = low[u] = time++; for (int v : graph[u]) { if (v == p) continue; if (disc[v] == -1) { dfs(v, u); low[u] = min(low[u], low[v]); if (low[v] > disc[u]) ans.push_back({u,v}); } else { low[u] = min(low[u], disc[v]); } } };' },
  ],
  pitfalls: ['❌ All Paths: not tracking visited in DAG — works because graph is a DAG (no cycles). For general graphs, must track visited.', '❌ Critical Connections: confusing low[u] (earliest reachable) with disc[u] (discovery time).'],
  edgeCases: [{ input: 'single node graph (LC 797)', breaks: 'cur = [0]; base case fires immediately; ans = [[0]]' }, { input: 'two-node graph (LC 1192)', breaks: 'single edge is critical; disc[0]=0, low[1]>disc[0]' }],
  interviewTip: '💡 All Paths: DFS + backtrack. Critical Connections: Tarjan (disc, low) — edge u-v is bridge if low[v] > disc[u].',
})

export const pathConstraintsLeaf = leaf('path-with-constraints', 'Path with Constraints', 'purple', {
  template: `${CPP_HEADER}int uniquePathsIII(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), sr, sc, empty = 0, ans = 0;
    int dirs[5] = {-1,0,1,0,-1};
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1) { sr = i; sc = j; }
            else if (grid[i][j] == 0) empty++;
    function<void(int,int,int)> dfs = [&](int r, int c, int walked) {
        if (r < 0 || r >= m || c < 0 || c >= n) return;
        if (grid[r][c] == -1) return;
        if (grid[r][c] == 2) { if (walked == empty + 1) ans++; return; }
        grid[r][c] = -1;
        for (int d = 0; d < 4; d++)
            dfs(r + dirs[d], c + dirs[d+1], walked + 1);
        grid[r][c] = 0;
    };
    dfs(sr, sc, 0);
    return ans;
}`,
  problems: [
    { id: 980, title: 'Unique Paths III', slug: 'unique-paths-iii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 12–19: DFS that must walk every empty cell exactly once to reach goal.' },
    { id: 489, title: 'Robot Room Cleaner', slug: 'robot-room-cleaner', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'DFS on unknown grid; track visited in set; try all 4 dirs; backtrack with turn + move.', variationCode: 'set<pair<int,int>> visited; int dirs[5]={-1,0,1,0,-1}; function<void(int,int,int)> dfs = [&](int r, int c, int d) { visited.insert({r,c}); robot.clean(); for (int i = 0; i < 4; i++) { int nd = (d + i) % 4; int nr = r + dirs[nd], nc = c + dirs[nd+1]; if (!visited.count({nr,nc}) && robot.move()) { dfs(nr, nc, nd); robot.turnRight(); robot.turnRight(); robot.move(); robot.turnRight(); robot.turnRight(); } robot.turnRight(); } }; dfs(0,0,0);' },
  ],
  pitfalls: ['❌ Unique Paths III: counting empty cells wrong (start cell counted? start is 1 not 0).', '❌ Robot Room Cleaner: forgetting to back out of dead end (turn around, move back, turn back).'],
  edgeCases: [{ input: 'grid with no empty cells (LC 980)', breaks: 'empty=0; walked==0+1? start==goal? if start and goal adjacent, ans=1; else 0' }, { input: 'robot already at goal', breaks: 'visited contains start; no moves; correct' }],
  interviewTip: '💡 Unique Paths III: must traverse ALL empty cells exactly once. Robot Cleaner: DFS with unknown grid + backtrack by reversing moves.',
})

export const graphColoringLeaf = leaf('graph-coloring', 'Graph Coloring', 'teal', {
  template: `${CPP_HEADER}bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1);
    for (int i = 0; i < n; i++) {
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
    return true;
}`,
  problems: [
    { id: 785, title: 'Is Graph Bipartite?', slug: 'is-graph-bipartite', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–19: BFS/DFS with two-color assignment; on conflict return false.' },
    { id: 886, title: 'Possible Bipartition', slug: 'possible-bipartition', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Build adjacency from dislikes first, then same bipartite check as 785.', variationCode: 'vector<vector<int>> graph(n+1); for (auto& d : dislikes) { graph[d[0]].push_back(d[1]); graph[d[1]].push_back(d[0]); } // then same bipartite check' },
  ],
  pitfalls: ['❌ Not coloring multiple components — graph may be disconnected; must loop over all nodes.', '❌ Possible Bipartition: forgetting to build the adjacency list from the dislike edges.'],
  edgeCases: [{ input: 'empty graph', breaks: 'no nodes; returns true' }, { input: 'single node no edges', breaks: 'colored as component; returns true' }],
  interviewTip: '💡 Bipartite: two-color (0/1) with BFS/DFS. Check all components. Conflict = not bipartite.',
})

export const matrixExplorationLeaf = leaf('matrix-exploration', 'Matrix Exploration', 'lime', {
  template: `${CPP_HEADER}int longestIncreasingPath(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size(), ans = 0;
    vector<vector<int>> memo(m, vector<int>(n, 0));
    int dirs[5] = {-1,0,1,0,-1};
    function<int(int,int)> dfs = [&](int r, int c) {
        if (memo[r][c]) return memo[r][c];
        int best = 1;
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c])
                best = max(best, 1 + dfs(nr, nc));
        }
        return memo[r][c] = best;
    };
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            ans = max(ans, dfs(i, j));
    return ans;
}`,
  problems: [
    { id: 329, title: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–15: DFS + memoization; each cell returns longest increasing path starting from it.' },
    { id: 688, title: 'Knight Probability in Chessboard', slug: 'knight-probability-in-chessboard', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'DFS with memo on (r,c,moves); sum probabilities of staying on board for each of 8 moves.', variationCode: 'vector<vector<vector<double>>> memo(n, vector<vector<double>>(n, vector<double>(k+1, -1))); int dirs[8][2] = {{-2,-1},{-2,1},{-1,-2},{-1,2},{1,-2},{1,2},{2,-1},{2,1}}; function<double(int,int,int)> dfs = [&](int r, int c, int m) { if (r<0||r>=n||c<0||c>=n) return 0.0; if (m == 0) return 1.0; if (memo[r][c][m] != -1) return memo[r][c][m]; double prob = 0; for (auto& d : dirs) prob += dfs(r+d[0], c+d[1], m-1) / 8.0; return memo[r][c][m] = prob; };' },
  ],
  pitfalls: ['❌ Not using memoization for LIP — DFS without cache is exponential.', '❌ Knight Probability: not dividing by 8 each step — each transition has 1/8 probability.'],
  edgeCases: [{ input: 'single cell matrix (LC 329)', breaks: 'memo[0][0]=1; ans=1; correct' }, { input: 'k=0 (LC 688)', breaks: 'm=0 returns 1.0; probability = 1; correct' }],
  interviewTip: '💡 LIP: DFS + memo (DP on grid). Knight Probability: memo on (r,c,remaining) — probability = average of 8 moves.',
})

/* ──────────────────────────────────────────────────────────────
   Optimization with Backtracking
   ────────────────────────────────────────────────────────────── */

export const branchBoundLeaf = leaf('branch-and-bound', 'Branch and Bound', 'orange', {
  template: `${CPP_HEADER}int maxLength(vector<string>& arr) {
    int n = arr.size(), ans = 0;
    vector<int> masks(n);
    for (int i = 0; i < n; i++) {
        int m = 0;
        for (char c : arr[i]) {
            if (m & (1 << (c - 'a'))) { m = -1; break; }
            m |= (1 << (c - 'a'));
        }
        masks[i] = m;
    }
    function<void(int,int)> dfs = [&](int i, int mask) {
        if (i == n) { ans = max(ans, __builtin_popcount(mask)); return; }
        if ((mask & masks[i]) == 0) dfs(i + 1, mask | masks[i]);
        if (__builtin_popcount(mask | masks[i]) > ans) dfs(i + 1, mask);
    };
    dfs(0, 0);
    return ans;
}`,
  problems: [
    { id: 1239, title: 'Max Length Concatenated Unique Chars', slug: 'maximum-length-of-a-concatenated-string-with-unique-characters', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 9–14: skip strings with internal dups; bitmask for char tracking; prune with bound.' },
    { id: 1774, title: 'Closest Dessert Cost', slug: 'closest-dessert-cost', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Choose 0/1/2 of each topping + exactly one base; prune if overshooting target too far.', variationCode: 'int ans = INT_MAX; function<void(int,int)> dfs = [&](int i, int cur) { if (i == toppings.size()) { ans = (abs(cur-target) < abs(ans-target) || (abs(cur-target)==abs(ans-target) && cur<ans)) ? cur : ans; return; } for (int k = 0; k <= 2; k++) dfs(i+1, cur + k*toppings[i]); }; for (int base : bases) dfs(0, base);' },
  ],
  pitfalls: ['❌ Concatenated String: not pruning with popcount before exploring skip branch.', '❌ Dessert Cost: not considering base separately from toppings (each base is mandatory starting point).'],
  edgeCases: [{ input: 'all strings have internal dups (LC 1239)', breaks: 'masks[i] = -1; skip all; ans = 0' }, { input: 'target exactly matches base + toppings (LC 1774)', breaks: 'ans = target; correct' }],
  interviewTip: '💡 Branch and bound: maintain current best; prune branches that cannot beat it. Bitmask for uniqueness checks.',
})

export const memoizationLeaf = leaf('memoization-backtrack', 'Memoization + Backtracking', 'blue', {
  template: `${CPP_HEADER}bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n = s.size();
    vector<int> memo(n, -1);
    function<bool(int)> dfs = [&](int start) {
        if (start == n) return true;
        if (memo[start] != -1) return (bool)memo[start];
        for (int end = start + 1; end <= n; end++) {
            if (dict.count(s.substr(start, end - start)) && dfs(end))
                return memo[start] = true;
        }
        return memo[start] = false;
    };
    return dfs(0);
}`,
  problems: [
    { id: 139, title: 'Word Break', slug: 'word-break', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–14: memoized DFS from each index; return true if any prefix in dict leads to end.' },
    { id: 140, title: 'Word Break II', slug: 'word-break-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Same as 139 but collect all sentences; memo map from index to list of sentences.', variationCode: 'unordered_set<string> dict(wordDict.begin(), wordDict.end()); unordered_map<int,vector<string>> memo; function<vector<string>(int)> dfs = [&](int start) -> vector<string> { if (start == n) return {""}; if (memo.count(start)) return memo[start]; vector<string> ans; for (int end = start+1; end <= n; end++) { string w = s.substr(start, end-start); if (dict.count(w)) { for (string& tail : dfs(end)) ans.push_back(w + (tail.empty() ? "" : " " + tail)); } } return memo[start] = ans; }; return dfs(0);' },
  ],
  pitfalls: ['❌ Not memoizing — exponential branching without cache.', '❌ Word Break II: storing full sentences without memo leads to memory explosion; memo BY INDEX is key.'],
  edgeCases: [{ input: 'empty string (LC 139)', breaks: 'start==n → returns true; correct' }, { input: 'no words in dict match prefix', breaks: 'memo[0]=false; returns false' }],
  interviewTip: '💡 Word Break I: DP / memoized DFS — cache results by start index. II: memo map from index to list of sentences.',
})

export const minimaxLeaf = leaf('minimax-game-theory', 'Minimax (Game Theory)', 'orange', {
  template: `${CPP_HEADER}bool predictTheWinner(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> memo(n, vector<int>(n, -1));
    function<int(int,int)> dfs = [&](int l, int r) {
        if (l == r) return nums[l];
        if (memo[l][r] != -1) return memo[l][r];
        int pickLeft = nums[l] - dfs(l + 1, r);
        int pickRight = nums[r] - dfs(l, r - 1);
        return memo[l][r] = max(pickLeft, pickRight);
    };
    return dfs(0, n - 1) >= 0;
}`,
  problems: [
    { id: 486, title: 'Predict the Winner', slug: 'predict-the-winner', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–10: minimax — score difference = max(pickLeft - oppScore, pickRight - oppScore).' },
    { id: 1140, title: 'Stone Game II', slug: 'stone-game-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'DFS with memo on (i, M); Alice can take 1..2M piles; maximize her total.', variationCode: 'int n = piles.size(); vector<vector<int>> memo(n, vector<int>(n, -1)); vector<int> suf(n+1, 0); for (int i = n-1; i >= 0; i--) suf[i] = suf[i+1] + piles[i]; function<int(int,int)> dfs = [&](int i, int M) { if (i >= n) return 0; if (memo[i][M] != -1) return memo[i][M]; int best = 0; for (int x = 1; x <= 2*M && i+x <= n; x++) best = max(best, suf[i] - dfs(i+x, max(M, x))); return memo[i][M] = best; }; return dfs(0, 1);' },
  ],
  pitfalls: ['❌ Not using minimax (score diff) — player A maximizes A-B, player B minimizes A-B.', '❌ Predict Winner: returning bool instead of score diff — need diff >= 0 for win/tie.'],
  edgeCases: [{ input: 'single element (LC 486)', breaks: 'l==r, returns nums[0]; dfs >=0 if nums[0] >= 0' }, { input: 'all piles equal (LC 1140)', breaks: 'Alice takes max allowed by M; both players optimal' }],
  interviewTip: '💡 Minimax: score difference = myScore - opponentScore; both play optimally. Memoize on (l,r) or (i,M).',
})
