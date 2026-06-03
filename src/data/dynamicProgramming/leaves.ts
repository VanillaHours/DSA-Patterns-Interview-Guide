import { leaf } from './helpers'

const CPP = `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <cstring>
#include <queue>
#include <deque>
using namespace std;

`

/* ──────────────────────────────────────────
   1D State DP Leaves
   ────────────────────────────────────────── */

export const classicLinearDpLeaf = leaf('classic-linear-dp', 'Classic Problems', 'lime', {
  template: `${CPP}int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < n; i++) {
        int cur = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
  problems: [
    { id: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–8: dp[i] = dp[i-1] + dp[i-2]; rolling vars: prev2=1, prev1=2.', variationCode: 'if (n <= 2) return n; int a=1,b=2; for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;} return b;' },
    { id: 198, title: 'House Robber', slug: 'house-robber', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–8: cur = max(prev1, prev2 + nums[i]) — take or skip.' },
    { id: 139, title: 'Word Break', slug: 'word-break', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'dp[i] = true if dp[j] && dict.count(s[j..i]) for any j < i; O(n²).', variationCode: 'unordered_set<string> dict(wordDict.bg(),wordDict.end()); int n=s.size(); vector<bool> dp(n+1); dp[0]=true; for(int i=1;i<=n;i++) for(int j=0;j<i;j++) if(dp[j]&&dict.count(s.substr(j,i-j))){dp[i]=true;break;} return dp[n];' },
  ],
  pitfalls: ['❌ House Robber: resetting prev2/prev1 in wrong order after update.', '❌ Word Break: O(n³) if substr copies on each iteration — share suffix/prefix.'],
  edgeCases: [{ input: 'n=0 (LC 70/198)', breaks: 'early return 0 handles empty' }, { input: 'empty string (LC 139)', breaks: 'dp[0]=true; returns true' }],
  interviewTip: '💡 Linear DP: rolling variables for O(1) space. Word Break: dp[i] = any valid split j→i.',
})

export const kadaneDpLeaf = leaf('kadane-dp', "Kadane's Algorithm", 'green', {
  template: `${CPP}int maxSubArray(vector<int>& nums) {
    int best = INT_MIN, cur = 0;
    for (int x : nums) {
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    return best;
}`,
  problems: [
    { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–5: Kadane — cur = max(x, cur + x); best = max(best, cur).' },
    { id: 152, title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Track both curMax and curMin; swap on negative.', variationCode: 'int best = INT_MIN, curMax = 1, curMin = 1; for (int x : nums) { if (x < 0) swap(curMax, curMin); curMax = max(x, curMax * x); curMin = min(x, curMin * x); best = max(best, curMax); } return best;' },
  ],
  pitfalls: ['❌ Resetting cur to 0 on every negative — Kadane only resets if cur+x < x.', '❌ Product: forgetting to swap curMax/curMin when x is negative.'],
  edgeCases: [{ input: 'all negatives', breaks: 'Kadane: cur picks least negative; best still correct' }, { input: 'single element', breaks: 'returns that element' }],
  interviewTip: '💡 Kadane: cur = max(x, cur + x). Product: both max and min, swap on negative.',
})

export const buySellStockDpLeaf = leaf('buy-sell-stock-dp', 'Buy / Sell Stock Problems', 'teal', {
  template: `${CPP}int maxProfit(vector<int>& prices) {
    int hold = INT_MIN, cash = 0;
    for (int p : prices) {
        int prevCash = cash;
        cash = max(cash, hold + p);
        hold = max(hold, -p);
    }
    return cash;
}`,
  problems: [
    { id: 121, title: 'Best Time to Buy/Sell Stock', slug: 'best-time-to-buy-and-sell-stock', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–7: hold = max(hold, -p); cash = max(cash, hold + p).', variationCode: 'int minP = INT_MAX, best = 0; for (int p : prices) { minP = min(minP, p); best = max(best, p - minP); } return best;' },
    { id: 122, title: 'Best Time to Buy/Sell II', slug: 'best-time-to-buy-and-sell-stock-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Same as 121 but hold can reuse cash: hold = max(hold, cash - p).', variationCode: 'int cash=0, hold=INT_MIN; for(int p:prices){ int prev=cash; cash=max(cash,hold+p); hold=max(hold,prev-p); } return cash;' },
    { id: 123, title: 'Best Time to Buy/Sell III', slug: 'best-time-to-buy-and-sell-stock-iii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Extend to k transactions (here k=2): dp[k][hold] states.', variationCode: 'vector<int> cash(3,0), hold(3,INT_MIN); for(int p:prices) for(int k=1;k<=2;k++){ cash[k]=max(cash[k],hold[k]+p); hold[k]=max(hold[k],cash[k-1]-p); } return cash[2];' },
  ],
  pitfalls: ['❌ Buying and selling same price — transactions should give profit > 0.', '❌ For k transactions: reducing dimension from n*k*2 → k*2 using state machine.'],
  edgeCases: [{ input: 'descending prices', breaks: 'best = 0 (no profit); cash = 0; correct' }, { input: 'single price', breaks: 'no transaction possible; returns 0' }],
  interviewTip: '💡 Stock DP state machine: hold[i]=max(hold[i-1], cash[i-1]-p); cash[i]=max(cash[i-1], hold[i-1]+p).',
})

export const gameTheoryDpLeaf = leaf('game-theory-dp', 'Game Theory', 'orange', {
  template: `${CPP}bool stoneGame(vector<int>& piles) {
    int n = piles.size();
    vector<vector<int>> memo(n, vector<int>(n, -1));
    function<int(int,int)> dfs = [&](int l, int r) {
        if (l == r) return piles[l];
        if (memo[l][r] != -1) return memo[l][r];
        int left = piles[l] - dfs(l + 1, r);
        int right = piles[r] - dfs(l, r - 1);
        return memo[l][r] = max(left, right);
    };
    return dfs(0, n - 1) > 0;
}`,
  problems: [
    { id: 877, title: 'Stone Game', slug: 'stone-game', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–9: minimax — score diff = max(pickLeft - oppScore, pickRight - oppScore).' },
    { id: 1406, title: 'Stone Game III', slug: 'stone-game-iii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Alice can take 1..3 piles; dp[i] = max(total[i]-dp[i+1], total[i]-dp[i+2], total[i]-dp[i+3]).', variationCode: 'int n = stoneValue.size(); vector<int> dp(n+1,0), suf(n+1,0); for(int i=n-1;i>=0;i--) suf[i]=suf[i+1]+stoneValue[i]; for(int i=n-1;i>=0;i--){ int best=INT_MIN; for(int k=1;k<=3&&i+k<=n;k++) best=max(best,suf[i]-dp[i+k]); dp[i]=best; } return dp[0]>suf[0]-dp[0];' },
  ],
  pitfalls: ['❌ Returning absolute score instead of score difference — Alice maximizes A-B, not just A.', '❌ Stone Game III: must consider that Alice can force a win (Alice > Bob).'],
  edgeCases: [{ input: 'single pile', breaks: 'l==r returns pile; diff > 0 if positive' }, { input: 'all equal piles', breaks: 'Alice wins if she goes first with optimal play' }],
  interviewTip: '💡 Game theory DP: score diff = myPick - opponentBest. Both play optimally.',
})

export const fibonacciStyleDpLeaf = leaf('fibonacci-style-dp', 'Fibonacci-Style DP', 'teal', {
  template: `${CPP}int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`,
  problems: [
    { id: 509, title: 'Fibonacci Number', slug: 'fibonacci-number', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 5–8: dp[i] = dp[i-1] + dp[i-2]; rolling vars a, b.' },
    { id: 1137, title: 'N-th Tribonacci Number', slug: 'n-th-tribonacci-number', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'dp[i] = dp[i-1] + dp[i-2] + dp[i-3]; rolling 3 vars.', variationCode: 'if (n==0) return 0; if (n<=2) return 1; int a=0,b=1,c=1; for(int i=3;i<=n;i++){int d=a+b+c;a=b;b=c;c=d;} return c;' },
    { id: 91, title: 'Decode Ways', slug: 'decode-ways', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'dp[i] = dp[i-1] (if s[i-1]!=\'0\') + dp[i-2] (if s[i-2..i-1] valid 10..26).', variationCode: 'int n=s.size(); if(n==0||s[0]==\'0\') return 0; int a=1,b=1; for(int i=1;i<n;i++){ int cur=0; if(s[i]!=\'0\') cur+=b; int two=stoi(s.substr(i-1,2)); if(two>=10&&two<=26) cur+=a; a=b; b=cur; } return b;' },
  ],
  pitfalls: ['❌ Decode Ways: leading zeros ("0", "01", "30") — need to check both single and two-digit validity.', '❌ Tribonacci: base cases for n=0,1,2 differ from Fibonacci.'],
  edgeCases: [{ input: 'n=0 (LC 509)', breaks: 'returns 0; correct' }, { input: 'string starting with 0 (LC 91)', breaks: 'returns 0; no valid decoding' }],
  interviewTip: '💡 Fibonacci-style: dp[i] = sum of dp[i-k…i-1]. Rolling array for O(1) space. Decode Ways: check 1-digit and 2-digit validity.',
})

/* ──────────────────────────────────────────
   Substring / Subsequence Leaves
   ────────────────────────────────────────── */

export const lisDpLeaf = leaf('lis-dp', 'Longest Increasing Subsequence (LIS)', 'blue', {
  template: `${CPP}int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}`,
  problems: [
    { id: 300, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 6–9: dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i]. O(n²).' },
    { id: 673, title: 'Number of LIS', slug: 'number-of-longest-increasing-subsequence', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Track both length dp[i] and count cnt[i]; if dp[j]+1 > dp[i] reset cnt, if equal add.', variationCode: 'vector<int> dp(n,1), cnt(n,1); for(int i=0;i<n;i++) for(int j=0;j<i;j++) if(nums[j]<nums[i]){ if(dp[j]+1>dp[i]){dp[i]=dp[j]+1;cnt[i]=cnt[j];} else if(dp[j]+1==dp[i]) cnt[i]+=cnt[j]; }' },
    { id: 1048, title: 'Longest String Chain', slug: 'longest-string-chain', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Sort by length; dp[word] = 1 + max(dp[predecessor]) for each possible predecessor.', variationCode: 'sort(words.begin(),words.end(),[](auto&a,auto&b){return a.size()<b.size();}); unordered_map<string,int> dp; int ans=1; for(string& w:words){ int best=1; for(int i=0;i<w.size();i++){ string pred=w.substr(0,i)+w.substr(i+1); if(dp.count(pred)) best=max(best,dp[pred]+1); } dp[w]=best; ans=max(ans,best); } return ans;' },
  ],
  pitfalls: ['❌ LIS: O(n²) may TLE — use patience sorting (tails array) for O(n log n).', '❌ LIS counts subsequence (not subarray) — elements need not be contiguous.'],
  edgeCases: [{ input: 'single element', breaks: 'dp=[1]; ans=1' }, { input: 'all decreasing', breaks: 'dp all 1; ans=1' }],
  interviewTip: '💡 LIS: dp[i] = 1 + max dp[j] for nums[j] < nums[i]. O(n log n): tails[k] = smallest tail of length-k IS.',
})

export const lcsDpLeaf = leaf('lcs-dp', 'Longest Common Subsequence (LCS)', 'purple', {
  template: `${CPP}int longestCommonSubsequence(string a, string b) {
    int m = a.size(), n = b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a[i-1] == b[j-1])
                dp[i][j] = 1 + dp[i-1][j-1];
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
  problems: [
    { id: 1143, title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–10: match → 1+dp[i-1][j-1]; skip → max(dp[i-1][j], dp[i][j-1]).' },
    { id: 583, title: 'Delete Operation for Two Strings', slug: 'delete-operation-for-two-strings', companies: ['GOOGLE', 'META'], lineChanges: 'Result = m + n - 2 * LCS length.', variationCode: 'int lcs = longestCommonSubsequence(w1,w2); return w1.size()+w2.size()-2*lcs;' },
    { id: 1092, title: 'Shortest Common Supersequence', slug: 'shortest-common-supersequence', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Build LCS dp table; backtrack to construct SCS = a + b - LCS.', variationCode: 'string scs = ""; int i=m,j=n; while(i>0||j>0){ if(i==0) scs+=b[--j]; else if(j==0) scs+=a[--i]; else if(a[i-1]==b[j-1]){scs+=a[--i];--j;} else if(dp[i-1][j]>dp[i][j-1]) scs+=a[--i]; else scs+=b[--j]; } reverse(scs.begin(),scs.end()); return scs;' },
  ],
  pitfalls: ['❌ Using m or n as dp size instead of m+1, n+1 — off-by-one aligning indices.', '❌ SCS: constructing string while traversing dp table can be tricky — reverse at end.'],
  edgeCases: [{ input: 'empty string', breaks: 'dp[0][j]=0, dp[i][0]=0; result 0 or other string length' }, { input: 'identical strings', breaks: 'LCS = min(m,n); SCS = m (or n)' }],
  interviewTip: '💡 LCS: match → 1 + diag; skip → max(left, up). SCS: result = a + b - LCS (construct by backtracking).',
})

export const editDistanceDpLeaf = leaf('edit-distance-dp', 'Edit Distance', 'pink', {
  template: `${CPP}int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        }
    }
    return dp[m][n];
}`,
  problems: [
    { id: 72, title: 'Edit Distance', slug: 'edit-distance', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–11: init base; match → diag; mismatch → 1 + min(del, ins, rep).' },
    { id: 115, title: 'Distinct Subsequences', slug: 'distinct-subsequences', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'dp[i][j] = dp[i-1][j] + (if match: dp[i-1][j-1]). Count ways, not min edits.', variationCode: 'vector<vector<unsigned int>> dp(m+1,vector<unsigned int>(n+1)); for(int i=0;i<=m;i++) dp[i][0]=1; for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){ dp[i][j]=dp[i-1][j]; if(s[i-1]==t[j-1]) dp[i][j]+=dp[i-1][j-1]; } return dp[m][n];' },
  ],
  pitfalls: ['❌ Forgetting base cases: dp[i][0] = i (deletions), dp[0][j] = j (insertions).', '❌ Distinct Subsequences: 32-bit overflow — use unsigned int/ll.'],
  edgeCases: [{ input: 'one empty string', breaks: 'dp[i][0]=i or dp[0][j]=j; correct' }, { input: 'identical strings', breaks: 'dp[i][i]=0; no edits needed' }],
  interviewTip: '💡 Edit Distance: match → diag; mismatch → 1 + min(del, ins, rep). Distinct Subseq: skip + (if match) use previous match count.',
})

export const palindromicDpLeaf = leaf('palindromic-dp', 'Palindromic Subsequences', 'pink', {
  template: `${CPP}int longestPalindromeSubseq(string s) {
    int n = s.size();
    vector<vector<int>> dp(n, vector<int>(n));
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++) {
            if (s[i] == s[j])
                dp[i][j] = 2 + dp[i+1][j-1];
            else
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
        }
    }
    return dp[0][n-1];
}`,
  problems: [
    { id: 516, title: 'Longest Palindromic Subsequence', slug: 'longest-palindromic-subsequence', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–11: i descending, j ascending; match → 2+dp[i+1][j-1]; skip → max(i+1,j), (i,j-1).' },
    { id: 1312, title: 'Min Insertions to Make Palindrome', slug: 'minimum-insertion-steps-to-make-a-string-palindrome', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Result = n - LPS length (insert = delete to make palindrome).', variationCode: 'return n - longestPalindromeSubseq(s);' },
  ],
  pitfalls: ['❌ Iterating i from 0 to n and j from i+1 — needs dp[i+1][j-1] which is below, so iterate i descending.', '❌ LPS returns subsequence (not substring) — elements need not be contiguous.'],
  edgeCases: [{ input: 'single char', breaks: 'dp[i][i]=1; ans=1' }, { input: 'two same chars', breaks: 's[i]==s[j] → dp[i][j]=2+dp[i+1][j-1]; dp[i+1][j-1]=0 since i+1>j-1' }],
  interviewTip: '💡 LPS: i descending, j ascending. match → 2+dp[i+1][j-1]; skip → max. Min insertions = n - LPS.',
})

/* ──────────────────────────────────────────
   2D / Multi-Dimensional DP Leaves
   ────────────────────────────────────────── */

export const gridPathDpLeaf = leaf('grid-path-dp', 'Path Problems', 'lime', {
  template: `${CPP}int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}`,
  problems: [
    { id: 62, title: 'Unique Paths', slug: 'unique-paths', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–6: dp[j] = dp[j] + dp[j-1]; 1D rolling array O(mn) time, O(n) space.' },
    { id: 64, title: 'Minimum Path Sum', slug: 'minimum-path-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'dp[j] = grid[i][j] + min(dp[j], dp[j-1]); init dp[0] cumulative.', variationCode: 'vector<int> dp(n,0); dp[0]=grid[0][0]; for(j=1;j<n;j++) dp[j]=grid[0][j]+dp[j-1]; for(i=1;i<m;i++){ dp[0]+=grid[i][0]; for(j=1;j<n;j++) dp[j]=grid[i][j]+min(dp[j],dp[j-1]); } return dp[n-1];' },
    { id: 63, title: 'Unique Paths II', slug: 'unique-paths-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'If obstacleGrid[i][j] == 1: dp[j] = 0; else same as 62.', variationCode: 'vector<long> dp(n,0); dp[0]=obstacleGrid[0][0]?0:1; for(j=1;j<n;j++) dp[j]=obstacleGrid[0][j]?0:dp[j-1]; for(i=1;i<m;i++){ dp[0]=obstacleGrid[i][0]?0:dp[0]; for(j=1;j<n;j++) dp[j]=obstacleGrid[i][j]?0:dp[j]+dp[j-1]; } return dp[n-1];' },
  ],
  pitfalls: ['❌ Unique Paths II: resetting dp[0] correctly for each row when there are obstacles.', '❌ Minimum Path Sum: dp[0] must propagate first column cumulatively.'],
  edgeCases: [{ input: '1x1 grid', breaks: 'loop skipped; dp[0] = 1 or grid[0][0]' }, { input: 'obstacle at start (LC 63)', breaks: 'dp[0]=0; returns 0' }],
  interviewTip: '💡 Grid path: dp[j] = dp[j] + dp[j-1] (ways) or val + min(dp[j], dp[j-1]) (min sum). 1D rolling array.',
})

export const gridRegionDpLeaf = leaf('grid-region-dp', 'Region Problems', 'teal', {
  template: `${CPP}int maximalSquare(vector<vector<char>>& matrix) {
    int m = matrix.size(), n = matrix[0].size(), ans = 0;
    vector<int> dp(n + 1, 0), prev(n + 1, 0);
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == '1') {
                dp[j+1] = 1 + min({prev[j+1], dp[j], prev[j]});
                ans = max(ans, dp[j+1]);
            } else dp[j+1] = 0;
        }
        swap(dp, prev);
    }
    return ans * ans;
}`,
  problems: [
    { id: 221, title: 'Maximal Square', slug: 'maximal-square', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–11: dp[j+1] = 1 + min(up, left, diag); area = ans².' },
    { id: 85, title: 'Maximal Rectangle', slug: 'maximal-rectangle', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Histogram per row: heights[j] = matrix[i][j]==\'1\' ? heights[j]+1 : 0; then largestRectangleArea.', variationCode: `vector<int> h(n,0); int ans=0; for(i=0;i<m;i++){ for(j=0;j<n;j++) h[j]=(matrix[i][j]=='1')?h[j]+1:0; stack<int> st; for(j=0;j<=n;j++){ while(!st.empty()&&(j==n||h[st.top()]>h[j])){ int ht=h[st.top()]; st.pop(); int w=st.empty()?j:j-st.top()-1; ans=max(ans,ht*w); } st.push(j); } } return ans;` },
    { id: 1277, title: 'Count Square Submatrices', slug: 'count-square-submatrices-with-all-ones', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Same dp as maximal square but sum all dp values instead of tracking max.', variationCode: `int ans=0; for(i=0;i<m;i++) for(j=0;j<n;j++) if(matrix[i][j]=='1'){ if(i&&j) matrix[i][j]='1'+min({matrix[i-1][j]-'0',matrix[i][j-1]-'0',matrix[i-1][j-1]-'0'}); ans+=matrix[i][j]-'0'; } return ans;` },
  ],
  pitfalls: ['❌ Maximal Rectangle: must use stack-based histogram — DP alone does not track arbitrary rectangles.', '❌ Count squares: sum all dp values, not just max. Use in-place modification to save space.'],
  edgeCases: [{ input: 'no 1s', breaks: 'ans = 0; correct' }, { input: 'single row', breaks: 'histogram approach for rectangle works; square dp also works' }],
  interviewTip: '💡 Maximal Square: side = 1 + min(up, left, diag). Maximal Rectangle: histogram per row + stack. Count squares: sum all dp values.',
})

export const gridTraversalConstrainedDpLeaf = leaf('grid-traversal-constrained-dp', 'Grid Traversal with Constraints', 'green', {
  template: `${CPP}int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp = triangle.back();
    for (int i = n - 2; i >= 0; i--)
        for (int j = 0; j <= i; j++)
            dp[j] = triangle[i][j] + min(dp[j], dp[j+1]);
    return dp[0];
}`,
  problems: [
    { id: 120, title: 'Triangle', slug: 'triangle', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–7: bottom-up dp[j] = val + min(dp[j], dp[j+1]); O(1) extra space.' },
    { id: 931, title: 'Minimum Falling Path Sum', slug: 'minimum-falling-path-sum', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'dp[j] = A[i][j] + min(dp[j], dp[j+1], dp[j-1]); handle edges with only 2 options.', variationCode: 'int n = A.size(); vector<int> dp = A[0]; for(int i=1;i<n;i++){ vector<int> ndp(n); for(int j=0;j<n;j++){ int best=dp[j]; if(j>0) best=min(best,dp[j-1]); if(j<n-1) best=min(best,dp[j+1]); ndp[j]=A[i][j]+best; } dp=ndp; } return *min_element(dp.begin(),dp.end());' },
  ],
  pitfalls: ['❌ Triangle: top-down needs O(n²) space; bottom-up O(n) space is cleaner.', '❌ Falling Path: edge cells have only 2 neighbors — handle separately.'],
  edgeCases: [{ input: 'single row triangle', breaks: 'dp = triangle.back(); no loop; returns dp[0]' }, { input: '1x1 falling path', breaks: 'dp[0]=A[0][0]; min element is that value' }],
  interviewTip: '💡 Triangle: bottom-up DP, dp[j] = val + min(dp[j], dp[j+1]). Falling path: dp[j] = val + min(left, center, right) with edge handling.',
})

export const intervalDpLeaf = leaf('interval-dp', 'Interval DP', 'blue', {
  template: `${CPP}int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> arr(n + 2, 1);
    for (int i = 0; i < n; i++) arr[i+1] = nums[i];
    vector<vector<int>> dp(n + 2, vector<int>(n + 2));
    for (int len = 1; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            for (int k = l; k <= r; k++)
                dp[l][r] = max(dp[l][r],
                    arr[l-1]*arr[k]*arr[r+1] + dp[l][k-1] + dp[k+1][r]);
        }
    }
    return dp[1][n];
}`,
  problems: [
    { id: 312, title: 'Burst Balloons', slug: 'burst-balloons', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 7–12: iter len then l; k splits range; add arr[l-1]*arr[k]*arr[r+1] + left + right.' },
    { id: 1039, title: 'Min Score Triangulation of Polygon', slug: 'minimum-score-triangulation-of-polygon', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Similar to burst balloons: dp[i][j] = min over k of A[i]*A[k]*A[j] + dp[i][k] + dp[k][j].', variationCode: 'int n = A.size(); vector<vector<int>> dp(n,vector<int>(n)); for(int len=2;len<n;len++) for(int i=0;i+len<n;i++){ int j=i+len; dp[i][j]=INT_MAX; for(int k=i+1;k<j;k++) dp[i][j]=min(dp[i][j], A[i]*A[k]*A[j]+dp[i][k]+dp[k][j]); } return dp[0][n-1];' },
    { id: 1547, title: 'Min Cost to Cut a Stick', slug: 'minimum-cost-to-cut-a-stick', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Add 0 and n to cuts, sort; dp[i][j] = cost(cuts[i],cuts[j]) + min over k of dp[i][k]+dp[k][j].', variationCode: 'cuts.push_back(0); cuts.push_back(n); sort(cuts.begin(),cuts.end()); int m=cuts.size(); vector<vector<int>> dp(m,vector<int>(m)); for(int len=2;len<m;len++) for(int i=0;i+len<m;i++){ int j=i+len; dp[i][j]=INT_MAX; for(int k=i+1;k<j;k++) dp[i][j]=min(dp[i][j], cuts[j]-cuts[i]+dp[i][k]+dp[k][j]); } return dp[0][m-1];' },
  ],
  pitfalls: ['❌ Interval DP order: iterate by LENGTH, then left index. Not i then j.', '❌ Burst Balloons: padding with 1s at boundaries simplifies but careful with indices.'],
  edgeCases: [{ input: 'single balloon', breaks: 'len=1, l=1,r=1,k=1; dp[1][1]=arr[0]*arr[1]*arr[2]' }, { input: 'no cuts (LC 1547)', breaks: 'cuts = [0,n]; m=2; no len>=2; dp[0][m-1]=0' }],
  interviewTip: '💡 Interval DP: outer loop = length, inner = left; k splits range into left + right + combine. Always len-outer, l-inner.',
})

export const knapsack01Leaf = leaf('knapsack-0-1', '0/1 Knapsack', 'purple', {
  template: `${CPP}bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total & 1) return false;
    int target = total / 2;
    vector<bool> dp(target + 1);
    dp[0] = true;
    for (int x : nums)
        for (int s = target; s >= x; s--)
            if (dp[s - x]) dp[s] = true;
    return dp[target];
}`,
  problems: [
    { id: 416, title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–9: for each num, iterate capacity descending; dp[s] = dp[s] || dp[s-x].' },
    { id: 494, title: 'Target Sum', slug: 'target-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Let sum(P) - sum(N) = target; sum(P) = (total + target) / 2; subset sum same as 416.', variationCode: 'int total=accumulate(nums.begin(),nums.end(),0); if(total<abs(target)||(total+target)%2) return 0; int s=(total+target)/2; vector<int> dp(s+1); dp[0]=1; for(int x:nums) for(int i=s;i>=x;i--) dp[i]+=dp[i-x]; return dp[s];' },
    { id: 474, title: 'Ones and Zeroes', slug: 'ones-and-zeroes', companies: ['GOOGLE', 'META', 'AMAZON'], lineChanges: '2D 0/1 knapsack: dp[z][o] = max(dp[z][o], 1+dp[z-c0][o-c1]). Iterate m..0 and n..0 desc.', variationCode: `vector<vector<int>> dp(m+1,vector<int>(n+1)); for(string& s:strs){ int c0=count(s.begin(),s.end(),'0'),c1=s.size()-c0; for(int i=m;i>=c0;i--) for(int j=n;j>=c1;j--) dp[i][j]=max(dp[i][j],1+dp[i-c0][j-c1]); } return dp[m][n];` },
  ],
  pitfalls: ['❌ 0/1 Knapsack: iterate capacity DESCENDING to prevent reuse of same item (vs unbounded asc).', '❌ Target Sum: check (total+target) is even and total >= abs(target) before DP.'],
  edgeCases: [{ input: 'total < target (LC 494)', breaks: 'early check returns 0' }, { input: 'single element equals target', breaks: 'dp[0]=true; loop sets dp[x]=true; correct' }],
  interviewTip: '💡 0/1 Knapsack: iterate capacity descending. Subset sum: dp[s] = dp[s] || dp[s-x]. Ones and Zeroes: 2D 0/1 knapsack.',
})

export const knapsackUnboundedLeaf = leaf('knapsack-unbounded', 'Unbounded Knapsack', 'orange', {
  template: `${CPP}int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int coin : coins)
        for (int s = coin; s <= amount; s++)
            dp[s] = min(dp[s], 1 + dp[s - coin]);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  problems: [
    { id: 322, title: 'Coin Change', slug: 'coin-change', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–6: iterate coin outer, amount ascending; dp[s] = min(dp[s], 1+dp[s-coin]).' },
    { id: 518, title: 'Coin Change 2', slug: 'coin-change-2', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Same loop but dp[s] += dp[s-coin] (count combos). Amount outer → permutations; coin outer → combinations.', variationCode: 'vector<unsigned int> dp(amount+1); dp[0]=1; for(int coin:coins) for(int s=coin;s<=amount;s++) dp[s]+=dp[s-coin]; return dp[amount];' },
    { id: 377, title: 'Combination Sum IV', slug: 'combination-sum-iv', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Amount outer, coins inner → counts permutations (not combinations). Order matters.', variationCode: 'vector<unsigned int> dp(target+1); dp[0]=1; for(int s=1;s<=target;s++) for(int x:nums) if(s>=x) dp[s]+=dp[s-x]; return dp[target];' },
  ],
  pitfalls: ['❌ Unbounded: iterate capacity ASCENDING to allow reuse (opposite of 0/1).', '❌ Coin Change 2 (combos) vs Combination Sum IV (permutations): coin outer vs amount outer.'],
  edgeCases: [{ input: 'amount = 0', breaks: 'dp[0] = 0 or 1; return 0 (fewest coins) or 1 (ways)' }, { input: 'no coins make amount', breaks: 'dp[amount] stays INF; return -1 or 0' }],
  interviewTip: '💡 Unbounded: asc loop. Min coins: dp[s] = min(dp[s], 1+dp[s-coin]). Combos: coin outer. Permutations: amount outer.',
})

export const knapsackMultiConstraintLeaf = leaf('knapsack-multi-constraint', 'Multi-Constraint Knapsack', 'pink', {
  template: `${CPP}int numRollsToTarget(int n, int k, int target) {
    vector<vector<long>> dp(n + 1, vector<long>(target + 1, 0));
    dp[0][0] = 1;
    for (int dice = 1; dice <= n; dice++)
        for (int sum = 1; sum <= target; sum++) {
            for (int face = 1; face <= k && face <= sum; face++)
                dp[dice][sum] = (dp[dice][sum] + dp[dice-1][sum - face]) % 1000000007;
        }
    return dp[n][target];
}`,
  problems: [
    { id: 1155, title: 'Number of Dice Rolls With Target Sum', slug: 'number-of-dice-rolls-with-target-sum', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Lines 5–8: dp[dice][sum] = sum over face 1..k of dp[dice-1][sum-face]; O(n*k*target).' },
  ],
  pitfalls: ['❌ Wrong loop order: dice outer, sum inner, face innermost — need dp[dice-1] computed before dp[dice].', '❌ Overflow: use mod 1e9+7 and long intermediate.'],
  edgeCases: [{ input: 'target > n*k impossible', breaks: 'dp stays 0; returns 0' }, { input: 'target == n (all ones)', breaks: 'only one way: all dice show 1; dp = 1' }],
  interviewTip: '💡 Multi-constraint knapsack: 2D DP over (count, sum). Iterate dice then sum then face choices.',
})

/* ──────────────────────────────────────────
   State Compression DP Leaves
   ────────────────────────────────────────── */

export const bitmaskDpLeaf = leaf('bitmask-dp', 'Bitmask DP', 'purple', {
  template: `${CPP}int maxStudents(vector<vector<char>>& seats) {
    int m = seats.size(), n = seats[0].size();
    vector<int> valid(m);
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (seats[i][j] == '.') valid[i] |= (1 << j);
    vector<int> dp(1 << n, -1);
    dp[0] = 0;
    for (int i = 0; i < m; i++) {
        vector<int> ndp(1 << n, -1);
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] < 0) continue;
            for (int cur = valid[i]; ; cur = (cur - 1) & valid[i]) {
                if (cur & (cur << 1)) { if (!cur) break; continue; }
                if (mask & (cur << 1) || mask & (cur >> 1)) { if (!cur) break; continue; }
                ndp[cur] = max(ndp[cur], dp[mask] + __builtin_popcount(cur));
                if (!cur) break;
            }
        }
        dp = ndp;
    }
    return *max_element(dp.begin(), dp.end());
}`,
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Iterate mask 0..(1<<n)-1; for each bit j if (mask>>j & 1) include nums[j].', variationCode: 'vector<vector<int>> ans; int n=nums.size(); for(int mask=0;mask<(1<<n);mask++){ vector<int> cur; for(int j=0;j<n;j++) if(mask>>j&1) cur.push_back(nums[j]); ans.push_back(cur); } return ans;' },
    { id: 1349, title: 'Maximum Students Taking Exam', slug: 'maximum-students-taking-exam', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'DP by row with bitmask; prev row mask cannot have adjacent conflicts with current row mask.' },
    { id: 698, title: 'Partition to K Equal Sum Subsets', slug: 'partition-to-k-equal-sum-subsets', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'dp[mask] = remainder after filling subsets; if remainder == 0 start new subset.', variationCode: 'int total=accumulate(nums.begin(),nums.end(),0); if(total%k) return false; int target=total/k; vector<int> dp(1<<n,-1); dp[0]=0; for(int mask=0;mask<(1<<n);mask++){ if(dp[mask]==-1) continue; for(int i=0;i<n;i++) if(!(mask>>i&1)){ int nmask=mask|(1<<i); int rem=dp[mask]+nums[i]; if(rem<=target) dp[nmask]=rem==target?0:rem; } } return dp[(1<<n)-1]==0;' },
  ],
  pitfalls: ['❌ Bitmask DP: O(2^n * n) or worse — n must be ≤ 20 typically.', '❌ Subsets: bitmask iterates all subsets — for n=20, 1M masks; for n=30, 1B — too slow.'],
  edgeCases: [{ input: 'n=0 (LC 78)', breaks: 'ans = [[]]; mask loop runs once (mask=0)' }, { input: 'k=1 (LC 698)', breaks: 'single subset = entire array; always true' }],
  interviewTip: '💡 Bitmask DP: state = mask of used elements. dp[mask] = result for subset. Transition: add one element at a time.',
})

export const tspDpLeaf = leaf('tsp-dp', 'TSP (Traveling Salesman)', 'blue', {
  template: `${CPP}int shortestSuperstring(vector<string>& A) {
    int n = A.size();
    vector<vector<int>> cost(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (i != j) {
                int ov = 0;
                for (int k = 1; k <= (int)A[i].size() && k <= (int)A[j].size(); k++)
                    if (A[i].substr(A[i].size()-k) == A[j].substr(0, k)) ov = k;
                cost[i][j] = (int)A[j].size() - ov;
            }
    vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX / 2));
    for (int i = 0; i < n; i++) dp[1 << i][i] = (int)A[i].size();
    for (int mask = 1; mask < (1 << n); mask++)
        for (int last = 0; last < n; last++)
            if (dp[mask][last] < INT_MAX / 2)
                for (int nxt = 0; nxt < n; nxt++)
                    if (!(mask & (1 << nxt)))
                        dp[mask | (1 << nxt)][nxt] = min(dp[mask | (1 << nxt)][nxt], dp[mask][last] + cost[last][nxt]);
    int best = INT_MAX;
    for (int i = 0; i < n; i++) best = min(best, dp[(1 << n) - 1][i]);
    return best;
}`,
  problems: [
    { id: 943, title: 'Find the Shortest Superstring', slug: 'find-the-shortest-superstring', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Held-Karp: dp[mask][last] = min length to visit mask ending at last; transition by prepending nxt.' },
    { id: 980, title: 'Unique Paths III', slug: 'unique-paths-iii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'DP over mask of visited cells + current position = count of paths visiting all empty cells exactly once.', variationCode: 'int m=grid.size(),n=grid[0].size(),sr,sc,empty=0; for(i,j) if(grid[i][j]==1){sr=i;sc=j;} else if(grid[i][j]==0) empty++; int total=1<<empty; vector<vector<int>> dp(total,vector<int>(empty,0)); // map each empty cell to index, dp[mask][last] = ways to reach mask ending at last' },
  ],
  pitfalls: ['❌ TSP: O(2^n * n²) — only works for n ≤ 15-20.', '❌ Held-Karp: mask must track visited set and last node. Transition by adding unvisited node.'],
  edgeCases: [{ input: 'single string superstring', breaks: 'mask has 1 bit; dp[mask][0] = A[0].size()' }, { input: 'no empty cells 980', breaks: 'total=1; dp[0][0]=1 or 0 depending on start==end' }],
  interviewTip: '💡 TSP: dp[mask][last] = min cost to visit mask ending at last. Held-Karp: O(2^n * n²). Bit for each node.',
})

/* ──────────────────────────────────────────
   DP Optimization Leaves
   ────────────────────────────────────────── */

export const spaceOptimizationDpLeaf = leaf('space-optimization-dp', 'Space Optimization', 'orange', {
  template: `${CPP}int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`,
  problems: [
    { id: 70, title: 'Climbing Stairs (Space Optimized)', slug: 'climbing-stairs', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Rolling array: O(1) space instead of O(n). a=dp[i-2], b=dp[i-1].' },
    { id: 121, title: 'Best Time to Buy/Sell (Space Optimized)', slug: 'best-time-to-buy-and-sell-stock', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'State reduction: single pass tracking min price and max profit — O(1) space.', variationCode: 'int minP=INT_MAX,best=0; for(int p:prices){ minP=min(minP,p); best=max(best,p-minP); } return best;' },
  ],
  pitfalls: ['❌ Rolling array wrong order: must save prev values before overwriting.', '❌ State reduction: combining dimensions loses intermediate state — only works when only prev matters.'],
  edgeCases: [{ input: 'n=0 (LC 70)', breaks: 'early return handles it' }, { input: 'single price (LC 121)', breaks: 'no transaction; returns 0' }],
  interviewTip: '💡 Space optimization: rolling array for Fibonacci-like (O(1)), state reduction for single-pass. Only keep what next step needs.',
})

export const divideConquerDpLeaf = leaf('divide-conquer-dp', 'Divide & Conquer DP', 'purple', {
  template: `${CPP}int minDifficulty(vector<int>& job, int d) {
    int n = job.size();
    if (n < d) return -1;
    vector<int> dp(n), ndp(n);
    for (int i = 0, mx = 0; i < n; i++) dp[i] = mx = max(mx, job[i]);
    for (int day = 2; day <= d; day++) {
        fill(ndp.begin(), ndp.end(), INT_MAX);
        for (int i = day - 1; i < n; i++) {
            int mx = 0;
            for (int j = i; j >= day - 1; j--) {
                mx = max(mx, job[j]);
                ndp[i] = min(ndp[i], (j > 0 ? dp[j-1] : 0) + mx);
            }
        }
        dp = ndp;
    }
    return dp[n-1];
}`,
  problems: [
    { id: 1335, title: 'Minimum Difficulty of Job Schedule', slug: 'minimum-difficulty-of-job-schedule', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'dp[i][d] = min over j of dp[j-1][d-1] + max(job[j..i]). Base: dp[i][1] = max(job[0..i]).' },
  ],
  pitfalls: ['❌ Not all problems with min over range transition are D&C DP optimizable — need monotonicity of decision points.', '❌ Base case: dp[i][1] = max of first i+1 jobs (can also compute on the fly).'],
  edgeCases: [{ input: 'n < d (more days than jobs)', breaks: 'return -1; impossible' }, { input: 'd = 1', breaks: 'just max of all jobs; dp initialized as that' }],
  interviewTip: '💡 D&C DP: when dp[i][k] = min(dp[j-1][k-1] + cost(j,i)), and decision point moves monotonically. O(n²) or O(n log n).',
})

export const monotonicQueueDpLeaf = leaf('monotonic-queue-dp', 'Monotonic Queue / Stack Optimization', 'teal', {
  template: `${CPP}int constrainedSubsetSum(vector<int>& nums, int k) {
    int n = nums.size(), ans = nums[0];
    vector<int> dp(n);
    deque<int> dq;
    for (int i = 0; i < n; i++) {
        dp[i] = nums[i];
        if (!dq.empty()) dp[i] = max(dp[i], dp[dq.front()] + nums[i]);
        while (!dq.empty() && dp[i] >= dp[dq.back()]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() <= i - k) dq.pop_front();
        ans = max(ans, dp[i]);
    }
    return ans;
}`,
  problems: [
    { id: 1425, title: 'Constrained Subsequence Sum', slug: 'constrained-subsequence-sum', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'dp[i] = max(nums[i], max(dp[j]) for j in [i-k, i-1] + nums[i]). Deque maintains max dp in window O(n).' },
  ],
  pitfalls: ['❌ Using priority queue instead of deque — O(n log n) vs O(n) for range max query.', '❌ Off-by-one: window size constraint i - j <= k, not k+1.'],
  edgeCases: [{ input: 'k is large (>= n)', breaks: 'deque never pops front by index; still correct' }, { input: 'all negatives', breaks: 'dp[i] = nums[i] (negatives), ans picks max negative' }],
  interviewTip: '💡 Monotonic queue optimization: when dp[i] = nums[i] + max(dp[j]) for j in [i-k, i-1]. Deque stores decreasing dp values.',
})
