import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'classic-linear-dp': e({
    xray: [
      { text: '**Climbing stairs** — number of ways', kind: 'goal' },
      { text: '**House robber** — max sum no adjacent', kind: 'goal' },
      { text: '**Word break** — can segment string?', kind: 'goal' },
    ],
    budget: ['dp[i]', 'recurrence'],
    slottedTemplate: `for (int i = 1; i < n; i++) {
    dp[i] = {{RECURRENCE}};
}`,
    slots: [{ id: 'RECURRENCE', label: 'DP recurrence', hint: 'e.g., max(prev1, prev2+val) or dp[i-1]+dp[i-2]' }],
    slotFills: {
      70: { RECURRENCE: 'dp[i-1] + dp[i-2]' },
      198: { RECURRENCE: 'max(dp[i-1], dp[i-2] + nums[i])' },
      139: { RECURRENCE: 'any j < i: dp[j] && dict.count(s.substr(j, i-j))' },
    },
    helixOrder: [70, 198, 139],
    helixDelta: { 70: 'Ways: dp[i] = dp[i-1] + dp[i-2]', 198: 'Max: dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 139: 'Feasibility: dp[i] = any true split from j' },
    autopsies: [
      { cause: 'Not using rolling variables for O(1) space', wrong: 'vector<int> dp(n) for simple recurrence', testCase: 'n large', fix: 'Only prev two values needed — use rolling vars' },
    ],
    sayIt: ['Classic linear DP: dp[i] depends on 1-2 previous states.', 'House Robber: max(prev1, prev2+val) — rolling O(1).'],
  }),

  'kadane-dp': e({
    xray: [
      { text: '**Maximum subarray** sum', kind: 'goal' },
      { text: '**Maximum product** subarray', kind: 'goal' },
    ],
    budget: ['running state'],
    slottedTemplate: `for (int x : nums) {
    cur = {{CUR_UPDATE}};
    best = max(best, cur);
}`,
    slots: [{ id: 'CUR_UPDATE', label: 'Running state update', hint: 'Kadane: max(x, cur + x); Product: max/min tracking' }],
    slotFills: {
      53: { CUR_UPDATE: 'max(x, cur + x)' },
      152: { CUR_UPDATE: 'curMax = max({x, curMax*x, curMin*x}); curMin = min({x, curMax*x, curMin*x})' },
    },
    helixOrder: [53, 152],
    helixDelta: { 53: 'Kadane: cur = max(x, cur + x)', 152: 'Product: track curMax and curMin, swap on negative' },
    autopsies: [
      { cause: 'Resetting cur to 0 on every negative', wrong: 'if (cur < 0) cur = 0; cur += x;', testCase: '[-2,1,-3,4]', fix: 'cur = max(x, cur + x) — let Kadane decide reset vs extend' },
    ],
    sayIt: ['Kadane: cur = max(x, cur + x).', 'Product: both curMax and curMin, swap when x < 0.'],
  }),

  'buy-sell-stock-dp': e({
    xray: [
      { text: '**Maximum profit** with at most k transactions', kind: 'goal' },
      { text: 'Infinite transactions with **cooldown/fee**', kind: 'goal' },
    ],
    budget: ['state machine'],
    slottedTemplate: `for (int p : prices) {
    int prevCash = cash;
    cash = max(cash, hold + p);
    hold = max(hold, {{BUY_ACTION}});
}`,
    slots: [{ id: 'BUY_ACTION', label: 'Buy action (spend cash)', hint: 'I: -p (buy once). II: prevCash - p. III: cash[k-1] - p' }],
    slotFills: {
      121: { BUY_ACTION: '-p' },
      122: { BUY_ACTION: 'prevCash - p' },
      123: { BUY_ACTION: 'cash[k-1] - p // k from 1..maxK' },
    },
    helixOrder: [121, 122, 123],
    helixDelta: { 121: 'Single transaction — buy once', 122: 'Unlimited — reuse cash to buy again', 123: 'At most 2 — track per-transaction state' },
    autopsies: [
      { cause: 'Buy/sell same price counts as transaction with 0 profit', wrong: 'hold = max(hold, cash - p) — buy at every dip', testCase: 'descending prices', fix: 'hold starts as -inf; cash stays 0; never buy' },
    ],
    sayIt: ['Stock DP: hold/cash state machine.', 'I: buy with -p. II: reuse cash. III: k-layer state.'],
  }),

  'game-theory-dp': e({
    xray: [
      { text: '**Stone game** — two player optimal play', kind: 'goal' },
      { text: '**Can player 1 win?** — predict the winner', kind: 'goal' },
    ],
    budget: ['minimax', 'memoization'],
    slottedTemplate: `function<int({{PARAMS}})> dfs = [&]({{ARGS}}) {
    if ({{BASE}}) return {{BASE_VAL}};
    if (memo[{{KEY}}] != -1) return memo[{{KEY}}];
    int pick = {{PICK}} - dfs({{NEXT}});
    return memo[{{KEY}}] = max(pick, {{OTHER}});
};`,
    slots: [
      { id: 'PARAMS', label: 'Params' },
      { id: 'ARGS', label: 'Args' },
      { id: 'BASE', label: 'Base case' },
      { id: 'BASE_VAL', label: 'Base value' },
      { id: 'KEY', label: 'Memo key' },
      { id: 'PICK', label: 'Pick value' },
      { id: 'NEXT', label: 'Next state' },
      { id: 'OTHER', label: 'Other option' },
    ],
    slotFills: {
      877: { PARAMS: 'int l, int r', ARGS: 'l, r', BASE: 'l == r', BASE_VAL: 'piles[l]', KEY: 'l][r', PICK: 'piles[l]', NEXT: 'l+1, r', OTHER: 'piles[r] - dfs(l, r-1)' },
      1406: { PARAMS: 'int i, int M', ARGS: 'i, M', BASE: 'i >= n', BASE_VAL: '0', KEY: 'i][M', PICK: 'suf[i] - dfs(i+x, max(M,x)) // for x in 1..2M', NEXT: 'i+x, max(M,x)', OTHER: '0' },
    },
    helixOrder: [877, 1406],
    helixDelta: { 877: 'Stone Game: minimax over ends of array', 1406: 'Stone Game III: pick 1..3 piles with state (i,M)' },
    autopsies: [
      { cause: 'Returning absolute score instead of score difference', wrong: 'return max(piles[l] + dfs(l+1, r), piles[r] + dfs(l, r-1))', testCase: 'LC 877', fix: 'Use difference: myPick - opponentBest' },
    ],
    sayIt: ['Minimax DP: score diff = myPick - opponentBest.', 'Both players optimal. Memoize on (l,r) or (i,M).'],
  }),

  'fibonacci-style-dp': e({
    xray: [
      { text: '**Fibonacci** number', kind: 'goal' },
      { text: '**Tribonacci** number', kind: 'goal' },
      { text: '**Decode ways** — count decodings', kind: 'goal' },
    ],
    budget: ['recurrence', 'rolling'],
    slottedTemplate: `for (int i = 2; i <= n; i++) {
    int c = {{RECURRENCE}};
    a = b; b = c;
}`,
    slots: [{ id: 'RECURRENCE', label: 'Recurrence', hint: 'a + b, or a + b + c, or two-term with condition' }],
    slotFills: {
      509: { RECURRENCE: 'a + b' },
      1137: { RECURRENCE: 'a + b + c' },
      91: { RECURRENCE: 'b (if s[i]!=\'0\') + a (if two-digit valid 10..26)' },
    },
    helixOrder: [509, 1137, 91],
    helixDelta: { 509: 'Fib: dp[i] = dp[i-1] + dp[i-2]', 1137: 'Trib: dp[i] = dp[i-1]+dp[i-2]+dp[i-3]', 91: 'Decode: dp[i] = dp[i-1] (+dp[i-2] if valid)' },
    autopsies: [
      { cause: 'Missing base cases for Decode Ways leading zeros', wrong: 'int two = stoi(s.substr(i-1,2)); if (two >= 10) cur += a;', testCase: '"01"', fix: 'Check s[i-1]!=\'0\' for single digit AND two-digit must be 10..26' },
    ],
    sayIt: ['Fibonacci: rolling 2 vars. Tribonacci: rolling 3 vars.', 'Decode Ways: add dp[i-2] when two-digit between 10 and 26.'],
  }),

  'lis-dp': e({
    xray: [
      { text: '**Longest increasing subsequence** in array', kind: 'goal' },
      { text: '**Number** of longest increasing subsequences', kind: 'goal' },
      { text: '**Longest string chain** — predecessor chain', kind: 'goal' },
    ],
    budget: ['subsequence', 'LIS'],
    slottedTemplate: `for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++)
        if ({{CONDITION}}) dp[i] = max(dp[i], dp[j] + 1);
    ans = max(ans, dp[i]);
}`,
    slots: [{ id: 'CONDITION', label: 'Predecessor condition', hint: 'nums[j] < nums[i] for LIS' }],
    slotFills: {
      300: { CONDITION: 'nums[j] < nums[i]' },
      673: { CONDITION: 'nums[j] < nums[i] // also track cnt[i]' },
      1048: { CONDITION: 'isPredecessor(words[j], words[i]) // length+1 and char diff 1' },
    },
    helixOrder: [300, 673, 1048],
    helixDelta: { 300: 'LIS: dp[i] = 1 + max(dp[j]) for j < i', 673: 'Count LIS: track len and count', 1048: 'String Chain: sort by length, check all predecessors' },
    autopsies: [
      { cause: 'O(n²) TLE for n=10⁵ — use patience sorting tails array', wrong: 'O(n²) DP when input is large', testCase: 'n=10⁵ sorted array', fix: 'tails[k] = smallest tail of length-k IS — O(n log n)' },
    ],
    sayIt: ['LIS: dp[i] = 1 + max(dp[j]) for nums[j] < nums[i]. O(n²) or O(n log n).', 'Count LIS: track both len and cnt per position.'],
  }),

  'lcs-dp': e({
    xray: [
      { text: '**Longest common subsequence** between two strings', kind: 'goal' },
      { text: '**Delete operation** to make them equal', kind: 'goal' },
      { text: '**Shortest common supersequence**', kind: 'goal' },
    ],
    budget: ['2D dp', 'matching'],
    slottedTemplate: `for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        if (a[i-1] == b[j-1]) dp[i][j] = {{MATCH}};
        else dp[i][j] = {{MISMATCH}};`,
    slots: [
      { id: 'MATCH', label: 'Match action' },
      { id: 'MISMATCH', label: 'Mismatch action' },
    ],
    slotFills: {
      1143: { MATCH: '1 + dp[i-1][j-1]', MISMATCH: 'max(dp[i-1][j], dp[i][j-1])' },
      583: { MATCH: '1 + dp[i-1][j-1]', MISMATCH: 'max(dp[i-1][j], dp[i][j-1])' },
      1092: { MATCH: '1 + dp[i-1][j-1]', MISMATCH: 'max(dp[i-1][j], dp[i][j-1])' },
    },
    helixOrder: [1143, 583, 1092],
    helixDelta: { 1143: 'LCS: match=1+diag, skip=max(left,up)', 583: 'Delete: m+n-2*LCS', 1092: 'SCS: backtrack to build a+b-LCS' },
    autopsies: [
      { cause: 'Using 1-indexed dp but forgetting to shift string indices', wrong: 'a[i] == b[j] instead of a[i-1] == b[j-1]', testCase: 'any strings', fix: 'a[i-1], b[j-1] since dp is 1-indexed, string is 0-indexed' },
    ],
    sayIt: ['LCS: 2D dp. match=1+diag; skip=max(left, up).', 'Delete ops = m + n - 2*LCS. SCS = a + b - LCS.'],
  }),

  'edit-distance-dp': e({
    xray: [
      { text: '**Edit distance** — min insert, delete, replace', kind: 'goal' },
      { text: '**Distinct subsequences** — count matches', kind: 'goal' },
    ],
    budget: ['2D dp', 'edit ops'],
    slottedTemplate: `for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        if (a[i-1] == b[j-1]) dp[i][j] = {{MATCH}};
        else dp[i][j] = {{MISMATCH}};`,
    slots: [
      { id: 'MATCH', label: 'Match action' },
      { id: 'MISMATCH', label: 'Mismatch action' },
    ],
    slotFills: {
      72: { MATCH: 'dp[i-1][j-1]', MISMATCH: '1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]})' },
      115: { MATCH: 'dp[i-1][j] + dp[i-1][j-1] // skip + match', MISMATCH: 'dp[i-1][j] // skip only' },
    },
    helixOrder: [72, 115],
    helixDelta: { 72: 'Edit Distance: match=diag; mismatch=1+min(del,ins,rep)', 115: 'Distinct Subseq: skip + (if match) add prev match count' },
    autopsies: [
      { cause: 'Forgetting base case dp[i][0] = i, dp[0][j] = j', wrong: 'all dp uninitialized', testCase: 'empty string', fix: 'Init: for(i) dp[i][0]=i; for(j) dp[0][j]=j' },
    ],
    sayIt: ['Edit Distance: base = row/col indices. match=diag; mismatch=1+min(del,ins,rep).', 'Distinct Subseq: skip + if match, add dp[i-1][j-1].'],
  }),

  'palindromic-dp': e({
    xray: [
      { text: '**Longest palindromic subsequence**', kind: 'goal' },
      { text: '**Minimum insertions** to make palindrome', kind: 'goal' },
    ],
    budget: ['range dp', 'palindrome'],
    slottedTemplate: `for (int i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (int j = i + 1; j < n; j++)
        if (s[i] == s[j]) dp[i][j] = {{MATCH}};
        else dp[i][j] = {{MISMATCH}};
}`,
    slots: [
      { id: 'MATCH', label: 'Match action' },
      { id: 'MISMATCH', label: 'Mismatch action' },
    ],
    slotFills: {
      516: { MATCH: '2 + dp[i+1][j-1]', MISMATCH: 'max(dp[i+1][j], dp[i][j-1])' },
      1312: { MATCH: 'dp[i+1][j-1]', MISMATCH: '1 + min(dp[i+1][j], dp[i][j-1])' },
    },
    helixOrder: [516, 1312],
    helixDelta: { 516: 'LPS: match=2+dp[i+1][j-1]; skip=max(i+1,j),(i,j-1)', 1312: 'Min Insert: n-LPS, or DP: match no-op, mismatch 1+min' },
    autopsies: [
      { cause: 'Iterating i ascending, j ascending — dp[i+1][j-1] not computed yet', wrong: 'for(int i=0;i<n;i++) for(int j=i+1;j<n;j++)', testCase: 'any palindrome', fix: 'i descending, j ascending' },
    ],
    sayIt: ['LPS: i desc, j asc. match=2+dp[i+1][j-1]; skip=max.', 'Min insertions = n - LPS (or 1+min DP for insert ops).'],
  }),

  'grid-path-dp': e({
    xray: [
      { text: '**Unique paths** from corner to corner', kind: 'goal' },
      { text: '**Minimum path sum** in grid', kind: 'goal' },
      { text: 'Unique paths with **obstacles**', kind: 'goal' },
    ],
    budget: ['grid', 'rolling array'],
    slottedTemplate: `for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        if ({{OBSTACLE}}) dp[j] = 0;
        else if (i == 0 && j == 0) dp[j] = 1;
        else dp[j] = {{UPDATE}};`,
    slots: [
      { id: 'OBSTACLE', label: 'Obstacle check' },
      { id: 'UPDATE', label: 'DP update' },
    ],
    slotFills: {
      62: { OBSTACLE: 'false', UPDATE: '(i>0?dp[j]:0) + (j>0?dp[j-1]:0)' },
      64: { OBSTACLE: 'false', UPDATE: 'grid[i][j] + min((i>0?dp[j]:INT_MAX), (j>0?dp[j-1]:INT_MAX))' },
      63: { OBSTACLE: 'obstacleGrid[i][j] == 1', UPDATE: '(i>0?dp[j]:0) + (j>0?dp[j-1]:0)' },
    },
    helixOrder: [62, 64, 63],
    helixDelta: { 62: 'Ways: dp[j] = dp[j] + dp[j-1]', 64: 'Min sum: val + min(up, left)', 63: 'Obstacles: dp=0 when blocked' },
    autopsies: [
      { cause: 'Not handling first row/col separately for obstacles', wrong: 'dp[j] = dp[j] + dp[j-1]; without checking obstacleGrid', testCase: 'obstacle at first row', fix: 'if obstructed, dp[j]=0; else standard' },
    ],
    sayIt: ['Grid paths: 1D rolling dp[j] = dp[j] + dp[j-1].', 'Min path: val + min(up, left). Obstacles: dp=0.'],
  }),

  'grid-region-dp': e({
    xray: [
      { text: '**Maximal square** of all 1s in binary matrix', kind: 'goal' },
      { text: '**Maximal rectangle** of all 1s', kind: 'goal' },
      { text: '**Count square submatrices** of all 1s', kind: 'goal' },
    ],
    budget: ['region', 'histogram'],
    slottedTemplate: `for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        if (matrix[i][j] == '1') {
            dp[j+1] = 1 + min({{UP}}, {{LEFT}}, {{DIAG}});
            ans = max(ans, dp[j+1]);
        } else dp[j+1] = 0;`,
    slots: [
      { id: 'UP', label: 'Up neighbor' },
      { id: 'LEFT', label: 'Left neighbor' },
      { id: 'DIAG', label: 'Diagonal neighbor' },
    ],
    slotFills: {
      221: { UP: 'prev[j+1]', LEFT: 'dp[j]', DIAG: 'prev[j]' },
      1277: { UP: 'prev[j+1]', LEFT: 'dp[j]', DIAG: 'prev[j]' },
    },
    helixOrder: [221, 85, 1277],
    helixDelta: { 221: 'Square: side = 1+min(up,left,diag)', 85: 'Rectangle: histogram + stack per row', 1277: 'Count squares: sum all dp values' },
    autopsies: [
      { cause: 'Only tracking max side but area = side²', wrong: 'ans = max(ans, dp[j+1]) but return ans (not ans²)', testCase: 'LC 221', fix: 'return ans * ans' },
    ],
    sayIt: ['Square: dp[j+1] = 1 + min(up, left, diag).', 'Rectangle: histogram heights + stack for max area.', 'Count squares: sum all dp values.'],
  }),

  'grid-traversal-constrained-dp': e({
    xray: [
      { text: '**Triangle** — minimum path sum from top to bottom', kind: 'goal' },
      { text: '**Minimum falling path sum** in matrix', kind: 'goal' },
    ],
    budget: ['bottom-up', 'variable moves'],
    slottedTemplate: `for (int i = n - 2; i >= 0; i--)
    for (int j = 0; j <= i; j++)
        dp[j] = triangle[i][j] + min({{OPTIONS}});`,
    slots: [{ id: 'OPTIONS', label: 'Neighbor options', hint: 'dp[j], dp[j+1] for triangle; dp[j-1], dp[j], dp[j+1] for falling' }],
    slotFills: {
      120: { OPTIONS: 'dp[j], dp[j+1]' },
      931: { OPTIONS: 'dp[max(0,j-1)], dp[j], dp[min(n-1,j+1)]' },
    },
    helixDelta: { 120: 'Triangle: bottom-up, 2 neighbors', 931: 'Falling: bottom row as base, 3 neighbors with edge handling' },
    autopsies: [
      { cause: 'Top-down O(n²) extra space vs bottom-up O(n)', wrong: 'vector<vector<int>> dp = triangle; top-down traversal', testCase: 'large triangle', fix: 'Bottom-up: start from last row, update in-place' },
    ],
    sayIt: ['Triangle: bottom-up, dp[j] = val + min(dp[j], dp[j+1]).', 'Falling path: from second row, min of up to 3 above cells.'],
  }),

  'interval-dp': e({
    xray: [
      { text: '**Burst balloons** — maximize coins', kind: 'goal' },
      { text: '**Min score triangulation** of polygon', kind: 'goal' },
      { text: '**Min cost to cut** a stick', kind: 'goal' },
    ],
    budget: ['interval', 'range'],
    slottedTemplate: `for (int len = 1; len <= n; len++)
    for (int l = 1; l + len - 1 <= n; l++) {
        int r = l + len - 1;
        for (int k = l; k <= r; k++)
            dp[l][r] = max(dp[l][r], {{COMBINE}});
    }`,
    slots: [{ id: 'COMBINE', label: 'Combine left + right + cost', hint: 'arr[l-1]*arr[k]*arr[r+1] + dp[l][k-1] + dp[k+1][r]' }],
    slotFills: {
      312: { COMBINE: 'arr[l-1]*arr[k]*arr[r+1] + dp[l][k-1] + dp[k+1][r]' },
      1039: { COMBINE: 'A[i]*A[k]*A[j] + dp[i][k] + dp[k][j]' },
      1547: { COMBINE: '(cuts[j] - cuts[i]) + dp[i][k] + dp[k][j]' },
    },
    helixOrder: [312, 1039, 1547],
    helixDelta: { 312: 'Burst balloons: len->l->k with padding', 1039: 'Triangulation: dp[i][j] = min over k of A[i]*A[k]*A[j]', 1547: 'Cut stick: add 0 and n, sort, dp over cuts' },
    autopsies: [
      { cause: 'Wrong loop order (i then j instead of len then l)', wrong: 'for(int i=1;i<=n;i++) for(int j=i+1;j<=n;j++)', testCase: 'interval dp', fix: 'for(int len=1;len<=n;len++) for(int l=1;l+len-1<=n;l++)' },
    ],
    sayIt: ['Interval DP: outer=length, inner=left, inner-most=k split.', 'Burst Balloons: pad with 1s, combine left+right+burst.'],
  }),

  'knapsack-0-1': e({
    xray: [
      { text: '**Partition** array into two equal-sum subsets', kind: 'goal' },
      { text: '**Target sum** — assign +/- to reach target', kind: 'goal' },
      { text: '**Ones and zeroes** — 2D capacity', kind: 'goal' },
    ],
    budget: ['subset sum', '0/1'],
    slottedTemplate: `for (int x : items)
    for (int s = capacity; s >= x; s--)
        dp[s] = {{UPDATE}};`,
    slots: [{ id: 'UPDATE', label: 'DP update', hint: 'dp[s] || dp[s-x] (feasibility) or max(dp[s], 1+dp[s-x]) (max count)' }],
    slotFills: {
      416: { UPDATE: 'dp[s] || dp[s - x]' },
      494: { UPDATE: 'dp[s] + dp[s - x]' },
      474: { UPDATE: 'max(dp[z][o], 1 + dp[z-c0][o-c1])' },
    },
    helixOrder: [416, 494, 474],
    helixDelta: { 416: 'Subset Sum: dp[s] = dp[s] || dp[s-x] — desc loop', 494: 'Target Sum: subset = (total+target)/2, then count', 474: 'Ones and Zeroes: 2D 0/1, desc both dimensions' },
    autopsies: [
      { cause: '0/1 knapsack with ascending loop allows reuse of same item', wrong: 'for (int s = x; s <= capacity; s++)', testCase: 'LC 416', fix: 'Descending loop prevents reuse: for (int s = capacity; s >= x; s--)' },
    ],
    sayIt: ['0/1 Knapsack: iterate capacity DESCENDING.', 'Subset sum: dp[s] = dp[s] || dp[s-x]. Target sum: count ways.'],
  }),

  'knapsack-unbounded': e({
    xray: [
      { text: '**Coin change** — fewest coins to make amount', kind: 'goal' },
      { text: '**Coin change 2** — number of combinations', kind: 'goal' },
      { text: '**Combination sum IV** — number of permutations', kind: 'goal' },
    ],
    budget: ['unbounded', 'combinations', 'permutations'],
    slottedTemplate: `for (int coin : coins)
    for (int s = coin; s <= amount; s++)
        dp[s] = {{UPDATE}};`,
    slots: [{ id: 'UPDATE', label: 'DP update', hint: 'min(dp[s], 1+dp[s-coin]) or dp[s] + dp[s-coin]' }],
    slotFills: {
      322: { UPDATE: 'min(dp[s], 1 + dp[s - coin])' },
      518: { UPDATE: 'dp[s] + dp[s - coin]' },
      377: { UPDATE: 'dp[s] + dp[s - coin]' },
    },
    helixOrder: [322, 518, 377],
    helixDelta: { 322: 'Min coins: coin outer, asc loop, dp = min(1+dp[s-coin])', 518: 'Combos: coin outer → coin order doesn\'t matter', 377: 'Permutations: amount outer → order matters' },
    autopsies: [
      { cause: 'Min coins loop order wrong (amount outer, coin inner) gives correct result but not optimal', wrong: 'for (int s = 1; s <= amount; s++) for (int coin : coins)', testCase: 'any', fix: 'Coin outer for combinations; amount outer only when order matters (permutations)' },
    ],
    sayIt: ['Unbounded: iterate amount ASCENDING.', 'Coin outer → combinations. Amount outer → permutations.'],
  }),

  'knapsack-multi-constraint': e({
    xray: [
      { text: '**Dice rolls** with target sum — 2 constraints', kind: 'goal' },
    ],
    budget: ['2D DP', 'multiple constraints'],
    slottedTemplate: `for (int i = 1; i <= N; i++)
    for (int s = 1; s <= target; s++)
        for (int k = 1; k <= K && k <= s; k++)
            dp[i][s] = (dp[i][s] + dp[i-1][s - k]) % MOD;`,
    slots: [],
    slotFills: {},
    helixOrder: [1155],
    helixDelta: { 1155: 'Dice Rolls: dp[d][s]=sum(dp[d-1][s-f]) for f in 1..k' },
    autopsies: [
      { cause: 'Missing mod (1e9+7) for counting problems', wrong: 'dp[i][s] += dp[i-1][s-k];', testCase: 'large n, k, target', fix: 'dp[i][s] = (dp[i][s] + dp[i-1][s-k]) % MOD' },
    ],
    sayIt: ['Multi-constraint: 2D DP over (count, sum).', 'Dice: each die adds 1..k faces. O(n*k*target).'],
  }),

  'bitmask-dp': e({
    xray: [
      { text: '**Subsets** — iterate over all subsets via bitmask', kind: 'goal' },
      { text: '**Max students** — seating with constraints', kind: 'goal' },
      { text: '**Partition to k subsets** — equal sum', kind: 'goal' },
    ],
    budget: ['bitmask', 'subset'],
    slottedTemplate: `for (int mask = 0; mask < (1 << n); mask++) {
    if (dp[mask] == -1) continue;
    for (int i = 0; i < n; i++) if (!(mask & (1 << i))) {
        int nmask = mask | (1 << i);
        dp[nmask] = {{TRANSITION}};
    }
}`,
    slots: [{ id: 'TRANSITION', label: 'Add element to mask', hint: 'dp[mask] + cost(i) or (rem+nums[i] ≤ target ? rem+nums[i] : -1)' }],
    slotFills: {
      78: { TRANSITION: '// push current subset and include nums[i]' },
      1349: { TRANSITION: 'max(dp[nmask], dp[mask] + __builtin_popcount(cur))' },
      698: { TRANSITION: 'dp[mask] + nums[i] > target ? -1 : dp[mask] + nums[i] == target ? 0 : dp[mask] + nums[i]' },
    },
    helixOrder: [78, 698, 1349],
    helixDelta: { 78: 'Subsets: iterate masks, collect bits', 698: 'K subsets: remainder DP over masks', 1349: 'Exam: DP by row with bitmask, check adjacent' },
    autopsies: [
      { cause: 'DP over masks but n too large (n > 20 → 2²⁰ = 1M is borderline)', wrong: 'using bitmask for n=30', testCase: 'n=30', fix: 'Only use bitmask when n ≤ 20; otherwise different approach' },
    ],
    sayIt: ['Bitmask DP: state = mask of used items. Add one element per transition.', 'O(2^n * n) or O(2^n * n²). n ≤ 20.'],
  }),

  'tsp-dp': e({
    xray: [
      { text: '**Shortest superstring** — overlap concatenation', kind: 'goal' },
      { text: '**Unique paths III** — visit all cells exactly once', kind: 'goal' },
    ],
    budget: ['tsp', 'held-karp'],
    slottedTemplate: `for (int mask = 1; mask < (1 << n); mask++)
    for (int last = 0; last < n; last++)
        if (dp[mask][last] < INF)
            for (int nxt = 0; nxt < n; nxt++)
                if (!(mask & (1 << nxt)))
                    dp[mask | (1 << nxt)][nxt] = min(
                        dp[mask | (1 << nxt)][nxt],
                        dp[mask][last] + cost[last][nxt]);`,
    slots: [],
    slotFills: {},
    helixOrder: [943, 980],
    helixDelta: { 943: 'Shortest Superstring: Held-Karp with overlap costs', 980: 'Unique Paths III: mask of visited empty cells' },
    autopsies: [
      { cause: 'Held-Karp initialization: starting from each node individually', wrong: 'dp[mask][last] only initialized for full mask', testCase: 'LC 943', fix: 'dp[1<<i][i] = cost of starting from node i' },
    ],
    sayIt: ['TSP: dp[mask][last] = min cost to visit mask ending at last.', 'Held-Karp: O(2^n * n²). Init each node alone.'],
  }),

  'space-optimization-dp': e({
    xray: [
      { text: 'Reduce O(n) DP to **O(1) space**', kind: 'goal' },
      { text: 'State reduction — combine dimensions', kind: 'goal' },
    ],
    budget: ['rolling', 'state reduction'],
    slottedTemplate: `// Before: vector<int> dp(n);
// After: int a = init1, b = init2;
for (int i = 2; i <= n; i++) {
    int c = {{RECURRENCE}};
    a = b; b = c;
}`,
    slots: [{ id: 'RECURRENCE', label: 'Recurrence with rolling vars' }],
    slotFills: {
      70: { RECURRENCE: 'a + b // a = dp[i-2], b = dp[i-1]' },
      121: { RECURRENCE: 'best = max(best, p - minP); minP = min(minP, p); // state reduction' },
    },
    helixOrder: [70, 121],
    helixDelta: { 70: 'Rolling array: O(1) space with 2 vars', 121: 'State reduction: single pass with min/max' },
    autopsies: [
      { cause: 'Overwriting prev value before using it in next iteration', wrong: 'int c = a + b; a = c; b = c;', testCase: 'Fibonacci', fix: 'int c = a + b; a = b; b = c; — save b first' },
    ],
    sayIt: ['Rolling array: only keep last K values.', 'State reduction: combine dimensions when intermediate states not needed.'],
  }),

  'divide-conquer-dp': e({
    xray: [
      { text: '**Minimum difficulty of job schedule**', kind: 'goal' },
      { text: 'DP with transition min over range with monotonic cost', kind: 'signal' },
    ],
    budget: ['divide conquer', 'dp optimization'],
    slottedTemplate: `for (int i = day - 1; i < n; i++) {
    int mx = 0;
    for (int j = i; j >= day - 1; j--) {
        mx = max(mx, job[j]);
        ndp[i] = min(ndp[i], (j > 0 ? dp[j-1] : 0) + mx);
    }
}`,
    slots: [],
    slotFills: {},
    helixOrder: [1335],
    helixDelta: { 1335: 'Job Schedule: dp over days, for each position try all splits' },
    autopsies: [
      { cause: 'Not using D&C optimization for O(n² log n) when O(n²) is fine', wrong: 'Premature optimization', testCase: 'moderate n', fix: 'D&C DP is for when decision point is monotonic and n is large' },
    ],
    sayIt: ['D&C DP: optimize dp[i][k] = min(dp[j-1][k-1] + cost(j,i)).', 'Works when decision point moves monotonically with i.'],
  }),

  'monotonic-queue-dp': e({
    xray: [
      { text: '**Constrained subsequence sum** — max sum with gap ≤ k', kind: 'goal' },
      { text: 'dp[i] = f(i) + max(dp[j]) over sliding window', kind: 'signal' },
    ],
    budget: ['deque', 'sliding window max'],
    slottedTemplate: `for (int i = 0; i < n; i++) {
    dp[i] = nums[i];
    if (!dq.empty()) dp[i] = max(dp[i], dp[dq.front()] + nums[i]);
    while (!dq.empty() && dp[i] >= dp[dq.back()]) dq.pop_back();
    dq.push_back(i);
    if (dq.front() <= i - k) dq.pop_front();
    ans = max(ans, dp[i]);
}`,
    slots: [],
    slotFills: {},
    helixOrder: [1425],
    helixDelta: { 1425: 'Constrained Sum: deque maintains decreasing dp values in window' },
    autopsies: [
      { cause: 'Using priority_queue instead of deque — O(n log n) vs O(n)', wrong: 'priority_queue for range max query', testCase: 'large n', fix: 'Deque with decreasing order — O(1) amortized front max' },
    ],
    sayIt: ['Monotonic queue: dp[i] = nums[i] + max(dp[j]) for j in [i-k, i-1].', 'Deque stores decreasing dp values, front is max.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
