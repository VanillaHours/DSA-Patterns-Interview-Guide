import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <cmath>
using namespace std;

`

export const onePassLeaf = leaf('one-pass', 'One-Pass Traversal', 'lime', {
  template: `${CPP_HEADER}int maxSubArray(vector<int>& nums) {
    int best = INT_MIN, cur = 0;
    for (int x : nums) {
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    return best;
}`,
  problems: [
    { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–6: Kadane — cur = max(x, cur + x); best = max(best, cur).' },
    { id: 121, title: 'Best Time to Buy/Sell Stock', slug: 'best-time-to-buy-and-sell-stock', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 4: track minPrice = min(minPrice, p); best = max(best, p - minPrice).', variationCode: 'int minP = INT_MAX, best = 0; for (int p : prices) { minP = min(minP, p); best = max(best, p - minP); }' },
    { id: 152, title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line 4: track curMin/curMax (swap on negative).', variationCode: 'int curMax = x, curMin = x; for each x: if (x<0) swap(curMax,curMin); curMax=max(x, curMax*x); curMin=min(x,curMin*x); best=max(best,curMax);' },
  ],
  pitfalls: ['❌ Resetting running sum on every negative — Kadane only resets if cur+x < x.', '❌ Misreading problem: subarray (contiguous) vs subsequence (non-contiguous).'],
  edgeCases: [{ input: 'all negatives', breaks: 'Kadane: cur picks the least negative; best still works' }, { input: 'single element', breaks: 'Loop runs once — returns that element' }],
  interviewTip: '💡 One-pass Kadane: "cur = max(x, cur + x)" — that is the whole pattern.',
})

export const sameDirLeaf = leaf('same-dir', 'Same Direction (Read/Write)', 'green', {
  template: `${CPP_HEADER}int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int w = 1;
    for (int r = 1; r < (int)nums.size(); r++)
        if (nums[r] != nums[w - 1]) nums[w++] = nums[r];
    return w;
}`,
  problems: [
    { id: 26, title: 'Remove Duplicates', slug: 'remove-duplicates-from-sorted-array', companies: ['AMAZON', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: keep if nums[r] != nums[w-1]; w starts at 1.' },
    { id: 283, title: 'Move Zeroes', slug: 'move-zeroes', companies: ['META', 'AMAZON', 'APPLE'], mustKnow: true, lineChanges: 'Line 3–4: overwrite with non-zero; fill remaining with 0.', variationCode: 'int w = 0; for (int r = 0; r < n; r++) if (nums[r]) nums[w++] = nums[r]; while (w < n) nums[w++] = 0;' },
    { id: 27, title: 'Remove Element', slug: 'remove-element', companies: ['AMAZON'], lineChanges: 'Line 4: keep if nums[r] != val.', variationCode: 'if (nums[r] != val) nums[w++] = nums[r];' },
    { id: 80, title: 'Remove Dup II', slug: 'remove-duplicates-from-sorted-array-ii', companies: ['GOOGLE'], lineChanges: 'Line 5: keep if w < 2 || nums[r] != nums[w-2].', variationCode: 'if (w < 2 || nums[r] != nums[w-2]) nums[w++] = nums[r];' },
  ],
  pitfalls: ['❌ Using extra array for filter — O(1) space means write index only.', '❌ Move zeroes: swapping can break relative order; filter-then-fill is stable.'],
  edgeCases: [{ input: 'no duplicates', breaks: 'w == n; everything kept — still works' }, { input: 'all zeroes', breaks: 'w stays 0; fill entire array' }],
  interviewTip: '💡 Same-direction pointers: one reads ahead (r), one writes (w). Compact in one pass.',
})

export const oppositeDirLeaf = leaf('opposite-dir', 'Opposite Direction (Ends-Inward)', 'blue', {
  template: `${CPP_HEADER}vector<int> twoSum(vector<int>& nums, int target) {
    int l = 0, r = (int)nums.size() - 1;
    while (l < r) {
        long sum = (long)nums[l] + nums[r];
        if (sum == target) return {l + 1, r + 1};
        if (sum < target) l++;
        else r--;
    }
    return {};
}`,
  problems: [
    { id: 167, title: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 5–8: classic opposite template.' },
    { id: 15, title: '3Sum', slug: '3sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Add outer for(i); inner opposite on i+1..n-1; skip dup i.', variationCode: 'sort(nums); for (int i = 0; i < n; i++) { if (i && nums[i]==nums[i-1]) continue; int l=i+1,r=n-1,need=-nums[i]; while(l<r){ long s=(long)nums[i]+nums[l]+nums[r]; if(s==0){/*record*/; /*skip dup l,r*/} else if(s<0)l++; else r--; } }' },
    { id: 11, title: 'Container With Most Water', slug: 'container-with-most-water', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line 5: best = max(best, min(h[l],h[r])*(r-l)); move shorter side.', variationCode: 'best = max(best, min(h[l],h[r])*(r-l)); if (h[l] < h[r]) l++; else r--;' },
  ],
  pitfalls: ['❌ Hash map when input is sorted — wastes O(n) two-pointer win.', '❌ int overflow on sum — use long for large inputs.'],
  edgeCases: [{ input: 'duplicates in 3Sum', breaks: 'needs skip-dup on outer index and inner l/r' }, { input: 'all negatives', breaks: 'sum may underflow int — use long' }],
  interviewTip: '💡 Sorted + sum target → opposite pointers. Move left if sum too small, right if too large.',
})

export const fixedWindowLeaf = leaf('fixed-window', 'Fixed-Size Window', 'green', {
  template: `${CPP_HEADER}double findMaxAverage(vector<int>& nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int best = sum;
    for (int r = k; r < (int)nums.size(); r++) {
        sum += nums[r] - nums[r - k];
        best = max(best, sum);
    }
    return best / (double)k;
}`,
  problems: [
    { id: 643, title: 'Max Avg Subarray I', slug: 'maximum-average-subarray-i', companies: ['META', 'AMAZON'], lineChanges: 'Lines 5–7: slide — add nums[r], subtract nums[r-k].' },
    { id: 1343, title: 'Subarray Size K Threshold', slug: 'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold', companies: ['AMAZON'], lineChanges: 'Line 7: count++ when sum >= threshold * k.', variationCode: 'if (sum >= threshold * k) ans++;' },
  ],
  pitfalls: ['❌ Using while (r-l+1 > k) shrink loop — not needed for fixed k.'],
  edgeCases: [{ input: 'k == n', breaks: 'single window; loop runs zero times for slide' }],
  interviewTip: '💡 Fixed-size window → no shrink loop. Add right, subtract left, update answer.',
})

export const variableWindowLeaf = leaf('variable-window', 'Variable-Size Window', 'lime', {
  template: `${CPP_HEADER}int lengthOfLongestSubstring(string s) {
    int l = 0, ans = 0;
    int last[128]; fill(begin(last), end(last), -1);
    for (int r = 0; r < (int)s.size(); r++) {
        if (last[(unsigned char)s[r]] >= l) l = last[(unsigned char)s[r]] + 1;
        last[(unsigned char)s[r]] = r;
        ans = max(ans, r - l + 1);
    }
    return ans;
}`,
  problems: [
    { id: 3, title: 'Longest Substring No Repeat', slug: 'longest-substring-without-repeating-characters', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: shrink when char seen in window.' },
    { id: 209, title: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', companies: ['META', 'AMAZON'], lineChanges: 'Line 5: while sum >= target, shrink l and track min length.', variationCode: 'int sum = 0, l = 0, ans = INT_MAX; for (int r = 0; r < n; r++) { sum += nums[r]; while (sum >= target) { ans = min(ans, r-l+1); sum -= nums[l++]; } } return ans == INT_MAX ? 0 : ans;' },
    { id: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: shrink while window covers all chars of t.', variationCode: 'while (formed == required) { ans = min(ans, r-l+1); remove s[l]; l++; }' },
    { id: 904, title: 'Fruit Into Baskets', slug: 'fruit-into-baskets', companies: ['GOOGLE'], lineChanges: 'Line 5: shrink while map.size() > 2.', variationCode: 'while (freq.size() > 2) { freq[nums[l]]--; if (!freq[nums[l]]) freq.erase(nums[l]); l++; }' },
  ],
  pitfalls: ['❌ Shrinking while invalid for LONGEST vs while valid for SHORTEST — opposite logic.', '❌ Off-by-one: for shortest, update ans BEFORE removing left element.'],
  edgeCases: [{ input: 'empty string (LC 3)', breaks: 'ans=0; loop never runs' }, { input: 'target=0 (LC 209)', breaks: 'returns 1 (single element meets) — handle with target > 0 if needed' }],
  interviewTip: '💡 Variable window: expand r, shrink l when constraint violated. Longest → max; Shortest → min.',
})

export const standardBsLeaf = leaf('standard-bs', 'Standard Binary Search', 'blue', {
  template: `${CPP_HEADER}int search(vector<int>& nums, int target) {
    int l = 0, r = (int)nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
  problems: [
    { id: 704, title: 'Binary Search', slug: 'binary-search', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (classic BS).' },
    { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Line 9: return l (not -1) — insertion point.', variationCode: 'while (l <= r) { ... } return l; // insertion index' },
    { id: 74, title: 'Search 2D Matrix', slug: 'search-a-2d-matrix', companies: ['AMAZON', 'META'], lineChanges: 'Treat as 1D: m = l + (r-l)/2; row = m/n, col = m%n.', variationCode: 'int nCols = matrix[0].size(); int row = m / nCols, col = m % nCols;' },
  ],
  pitfalls: ['❌ Infinite loop: l = m (not m+1) when l < r — use l <= r with l = m+1, r = m-1.', '❌ Overflow: (l+r)/2 on large ints — use l + (r-l)/2.'],
  edgeCases: [{ input: 'empty array', breaks: 'loop skipped; returns -1 or 0' }, { input: 'target at ends', breaks: 'works — l=0 or r=n-1 checked' }],
  interviewTip: '💡 "Sorted array + find index" → binary search. Know the three return variants: index, -1, or l.',
})

export const rotatedBsLeaf = leaf('rotated-bs', 'Rotated / Modified Arrays', 'teal', {
  template: `${CPP_HEADER}int search(vector<int>& nums, int target) {
    int l = 0, r = (int)nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[l] <= nums[m]) {
            if (nums[l] <= target && target < nums[m]) r = m - 1;
            else l = m + 1;
        } else {
            if (nums[m] < target && target <= nums[r]) l = m + 1;
            else r = m - 1;
        }
    }
    return -1;
}`,
  problems: [
    { id: 33, title: 'Search Rotated', slug: 'search-in-rotated-sorted-array', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–12: check which side is sorted; search in the eligible half.' },
    { id: 153, title: 'Find Min Rotated', slug: 'find-minimum-in-rotated-sorted-array', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: if nums[m] > nums[r] l = m+1 else r = m (no target compare).', variationCode: 'while (l < r) { int m = l+(r-l)/2; if (nums[m] > nums[r]) l = m+1; else r = m; } return nums[l];' },
    { id: 81, title: 'Search Rotated II', slug: 'search-in-rotated-sorted-array-ii', companies: ['AMAZON'], lineChanges: 'Add: if (nums[l]==nums[m] && nums[m]==nums[r]) { l++; r--; } to handle duplicates.', variationCode: 'if (nums[l] == nums[m] && nums[m] == nums[r]) { l++; r--; } else { /* normal rotated logic */ }' },
  ],
  pitfalls: ['❌ Not handling nums[l] == nums[m] when duplicates exist.', '❌ Min rotated: using l <= r with r=m-1 can skip the min.'],
  edgeCases: [{ input: 'not rotated (fully sorted)', breaks: 'still works — left half sorted case always true' }, { input: 'two elements', breaks: 'works; l+(r-l)/2 == l' }],
  interviewTip: '💡 Rotated BS: compare nums[l] to nums[m] to know which half is sorted. Then check if target lies in it.',
})

export const answerSpaceBsLeaf = leaf('answer-space-bs', 'Answer Space Binary Search', 'teal', {
  template: `${CPP_HEADER}int shipWithinDays(vector<int>& weights, int days) {
    auto can = [&](int cap) {
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    };
    int l = *max_element(weights.begin(), weights.end());
    int r = accumulate(weights.begin(), weights.end(), 0);
    while (l < r) {
        int m = l + (r - l) / 2;
        if (can(m)) r = m;
        else l = m + 1;
    }
    return l;
}`,
  problems: [
    { id: 1011, title: 'Capacity To Ship', slug: 'capacity-to-ship-packages-within-d-days', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 2–9: predicate + binary search on capacity range.' },
    { id: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 5: hours = ceil(pile / speed); predicate: hours <= H.', variationCode: 'auto can = [&](int k) { long h = 0; for (int p : piles) h += (p + k - 1) / k; return h <= H; };' },
    { id: 410, title: 'Split Array Largest Sum', slug: 'split-array-largest-sum', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Same as shipWithinDays — predicate: pieces <= k with max sum <= cap.', variationCode: 'auto can = [&](int cap) { int pieces=1,cur=0; for(int x:nums){ if(cur+x>cap){pieces++;cur=0;} cur+=x; } return pieces<=k; };' },
    { id: 1283, title: 'Smallest Divisor', slug: 'find-the-smallest-divisor-given-a-threshold', companies: ['AMAZON'], lineChanges: 'Line 5: sum += ceil(num / divisor); predicate: sum <= threshold.', variationCode: 'for each num: sum += (num + divisor - 1) / divisor;' },
  ],
  pitfalls: ['❌ Using index BS when answer space BS is needed — if the answer is a value, not an index.', '❌ Forgetting to set bounds: l = min feasible, r = max possible.'],
  edgeCases: [{ input: 'days = 1', breaks: 'capacity = sum(weights); only one iteration' }, { input: 'days = n', breaks: 'capacity = max(weights); lower bound' }],
  interviewTip: '💡 "Find min X such that f(X) is feasible" → binary search the answer space. Define predicate, then standard BS.',
})

export const nestedLoopLeaf = leaf('nested-loop', 'Nested Loops (Matrix Scan)', 'purple', {
  template: `${CPP_HEADER}vector<vector<int>> transpose(vector<vector<int>>& A) {
    int m = A.size(), n = A[0].size();
    vector<vector<int>> T(n, vector<int>(m));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            T[j][i] = A[i][j];
    return T;
}`,
  problems: [
    { id: 867, title: 'Transpose Matrix', slug: 'transpose-matrix', companies: ['AMAZON'], lineChanges: 'Lines 5–6: T[j][i] = A[i][j] — standard transpose.' },
    { id: 48, title: 'Rotate Image', slug: 'rotate-image', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: reverse then transpose in-place OR four-way swap per layer.', variationCode: 'reverse(A.begin(), A.end()); for (i) for (j>i) swap(A[i][j], A[j][i]);' },
    { id: 54, title: 'Spiral Matrix', slug: 'spiral-matrix', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–6: maintain boundaries (top,bottom,left,right); traverse in spiral order.', variationCode: 'int t=0,b=m-1,l=0,r=n-1; while(t<=b&&l<=r){ /* four for-loops */ }' },
  ],
  pitfalls: ['❌ Conflicting dimensions: m×n becomes n×m after transpose.', '❌ Rotate: doing transpose before reverse vs after — sequence matters.'],
  edgeCases: [{ input: 'single row or column matrix', breaks: 'transpose flips dimensions correctly' }, { input: 'square matrix rotate', breaks: 'in-place rotation needs temp or reverse + transpose' }],
  interviewTip: '💡 Matrix traversal: standard nested loops for transpose; boundary walk for spiral; reverse+transpose for rotate.',
})

export const coordinatedLeaf = leaf('coordinated', 'Coordinated Traversal', 'purple', {
  template: `${CPP_HEADER}void setZeroes(vector<vector<int>>& matrix) {
    bool firstRow = false, firstCol = false;
    int m = matrix.size(), n = matrix[0].size();
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == 0) {
                if (i == 0) firstRow = true;
                if (j == 0) firstCol = true;
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
                matrix[i][j] = 0;
    if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}`,
  problems: [
    { id: 73, title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–12: mark first row/col; lines 14–17: propagate; lines 19–20: clear first row/col.' },
    { id: 289, title: 'Game of Life', slug: 'game-of-life', companies: ['GOOGLE', 'META', 'AMAZON'], lineChanges: 'Use encoded states (0→2 for dead→alive, 1→-1 for alive→dead); second pass decodes.', variationCode: 'for (i,j) { count live neighbors; if (live<2||live>3) encode -1; if (dead&&live==3) encode 2; } second pass: if (board[i][j]==-1)=>0; if (board[i][j]==2)=>1;' },
    { id: 36, title: 'Valid Sudoku', slug: 'valid-sudoku', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Line 5: track seen sets per row, col, and 3×3 box (boxIdx = (i/3)*3 + j/3).', variationCode: 'bool rows[9][9]={}, cols[9][9]={}, boxes[9][9]={}; for each cell: if (board[i][j]!=\'.\'){ int v=board[i][j]-\'1\'; int b=i/3*3+j/3; if(rows[i][v]||cols[j][v]||boxes[b][v]) return false; rows[i][v]=cols[j][v]=boxes[b][v]=true; }' },
  ],
  pitfalls: ['❌ Using O(m+n) extra space for separate row/col arrays — use first row/col as markers for O(1).', '❌ Game of Life: updating in-place without encoding — need to distinguish original vs updated state.'],
  edgeCases: [{ input: 'first cell (0,0) is zero', breaks: 'handled by firstRow/firstCol flags' }, { input: '1×1 matrix', breaks: 'loops still work; flags handle single cell' }],
  interviewTip: '💡 Two-pass coordinated: first pass marks boundaries; second pass propagates. O(1) space by using first row/col as markers.',
})

export const jumpPatternLeaf = leaf('jump-pattern', 'Jump Patterns', 'pink', {
  template: `${CPP_HEADER}bool canJump(vector<int>& nums) {
    int reach = 0;
    for (int i = 0; i < (int)nums.size() && i <= reach; i++)
        reach = max(reach, i + nums[i]);
    return reach >= (int)nums.size() - 1;
}`,
  problems: [
    { id: 55, title: 'Jump Game', slug: 'jump-game', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3–4: greedy — max reach = max(reach, i + nums[i]).' },
    { id: 45, title: 'Jump Game II', slug: 'jump-game-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 3: track curEnd and farthest; increment jumps when i == curEnd.', variationCode: 'int jumps=0,curEnd=0,far=0; for(int i=0;i<n-1;i++){ far=max(far,i+nums[i]); if(i==curEnd){jumps++;curEnd=far;} } return jumps;' },
    { id: 1345, title: 'Jump Game IV', slug: 'jump-game-iv', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line 3: BFS on index graph with level grouping of same-value indices.', variationCode: 'unordered_map<int,vector<int>> same; for(i) same[arr[i]].push_back(i); queue<int> q; vector<int> dist(n,-1); q.push(0); dist[0]=0; while(!q.empty()){ int i=q.front(); q.pop(); /* i-1, i+1, same[arr[i]] */ }' },
  ],
  pitfalls: ['❌ DP O(n²) when greedy O(n) works — Jump Game I needs only max reach check.', '❌ Jump Game II: BFS from both ends can speed up, but standard greedy (curEnd/farthest) is O(n).'],
  edgeCases: [{ input: 'single element', breaks: 'i==0, reach>=0, returns true' }, { input: 'zero in middle blocking', breaks: 'reach stays behind zero; loop stops; returns false' }],
  interviewTip: '💡 Jump problems: greedy max reach (I) or BFS on index graph (IV). Jump II: track curEnd + farthest.',
})
