import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>
#include <numeric>
using namespace std;

`

// ── 1D Range & Equilibrium ───────────────────────────────────────

export const basicRangeLeaf = leaf('basic-range', 'Basic Range Sum', 'blue', {
  template: `${CPP_HEADER}class NumArray {
    vector<int> pref;
public:
    NumArray(vector<int>& nums) {
        pref.resize(nums.size() + 1, 0);
        for (int i = 0; i < (int)nums.size(); i++)
            pref[i + 1] = pref[i] + nums[i];
    }
    int sumRange(int l, int r) {
        return pref[r + 1] - pref[l];
    }
};`,
  problems: [
    { id: 303, title: 'Range Sum Query', slug: 'range-sum-query-immutable', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–13: as-is (prefix array of size n+1).' },
    { id: 1480, title: 'Running Sum', slug: 'running-sum-of-1d-array', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: cumulative sum in-place: for i=1..n-1: nums[i] += nums[i-1].', variationCode: 'for (int i = 1; i < n; i++) nums[i] += nums[i-1]; return nums;' },
    { id: 848, title: 'Shifting Letters', slug: 'shifting-letters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: suffix sum of shifts; apply cumulative shift to each char.', variationCode: 'long sum = 0; for (int i = n-1; i >= 0; i--) { sum = (sum + shifts[i]) % 26; s[i] = (s[i] - \'a\' + sum) % 26 + \'a\'; }' },
  ],
  pitfalls: ['❌ Off-by-one: pref[r+1] - pref[l] not pref[r] - pref[l-1].', '❌ LC 848: large shift values — use long and modulo 26.'],
  interviewTip: '💡 "Range sum" → pref[i+1] = pref[i] + nums[i]; query: pref[r+1] - pref[l].',
})

export const pivotLeaf = leaf('pivot', 'Pivot & Equilibrium', 'teal', {
  template: `${CPP_HEADER}int pivotIndex(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    int left = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}`,
  problems: [
    { id: 724, title: 'Find Pivot Index', slug: 'find-pivot-index', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (left sum = total - left - nums[i]).' },
    { id: 1991, title: 'Middle Index', slug: 'find-the-middle-index-in-array', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Same as 724 — identical logic.', variationCode: '// Same approach as pivotIndex' },
    { id: 1664, title: 'Ways to Make Fair', slug: 'ways-to-make-a-fair-array', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: track even/odd prefix sums; after removal, swap parity.', variationCode: 'int even=0,odd=0; for(i..n-1){if(i%2) odd+=nums[i]; else even+=nums[i];} int pe=0,po=0,ans=0; for(i..n-1){if(i%2) odd-=nums[i]; else even-=nums[i]; if(pe+odd==po+even) ans++; if(i%2) po+=nums[i]; else pe+=nums[i];}' },
  ],
  pitfalls: ['❌ LC 1664: parity swap — after removing index i, right side even becomes odd and vice versa.', '❌ Not using long for total sum — may overflow.'],
  interviewTip: '💡 "Pivot index" → total sum, left running sum; right = total - left - nums[i].',
})

export const prefixProductLeaf = leaf('prefix-product', 'Prefix Product', 'blue', {
  template: `${CPP_HEADER}vector<int> productExceptSelf(vector<int>& nums) {
    int n = (int)nums.size();
    vector<int> out(n, 1);
    int left = 1;
    for (int i = 0; i < n; i++) {
        out[i] = left;
        left *= nums[i];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        out[i] *= right;
        right *= nums[i];
    }
    return out;
}`,
  problems: [
    { id: 238, title: 'Product Except Self', slug: 'product-of-array-except-self', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–15: as-is (prefix product left-to-right, suffix product right-to-left).' },
  ],
  pitfalls: ['❌ Using division (not allowed — zeros)', '❌ Forgetting to include self in running product before assigning output.'],
  interviewTip: '💡 "Product except self" → left-to-right prefix product, then right-to-left suffix product multiply.',
})

// ── Subarray Sum with Hash Map ───────────────────────────────────

export const targetSubarrayLeaf = leaf('target-subarray', 'Target Sum Counting', 'purple', {
  template: `${CPP_HEADER}int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> m; m[0] = 1;
    int sum = 0, ans = 0;
    for (int x : nums) {
        sum += x;
        ans += m[sum - k];
        m[sum]++;
    }
    return ans;
}`,
  problems: [
    { id: 560, title: 'Subarray Sum K', slug: 'subarray-sum-equals-k', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (prefix sum + hash map count).' },
    { id: 974, title: 'Divisible by K', slug: 'subarray-sums-divisible-by-k', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: track remainder of prefix sum modulo k; handle negative rem.', variationCode: 'vector<int> cnt(k,0); cnt[0]=1; int sum=0,ans=0; for(int x:nums){ sum=((sum+x)%k+k)%k; ans+=cnt[sum]; cnt[sum]++; }' },
    { id: 523, title: 'Continuous Subarray', slug: 'continuous-subarray-sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: map of remainder → first index; if same rem reappears and gap >= 2, true.', variationCode: 'unordered_map<int,int> m; m[0]=-1; int sum=0; for i..n-1: sum+=nums[i]; int r=sum%k; if(k!=0) r=(r+k)%k; if(m.count(r)){ if(i-m[r]>=2) return true; } else m[r]=i;' },
  ],
  pitfalls: ['❌ LC 560: m[0]=1 for prefix sums that equal k from index 0.', '❌ LC 974: negative modulo in C++ — adjust: ((sum % k) + k) % k.'],
  interviewTip: '💡 "Subarray sum = k" → prefix sum + hash map of (sum → count); ans += map[sum - k].',
})

export const maxSubarrayLeaf = leaf('max-subarray', 'Maximum Subarray', 'orange', {
  template: `${CPP_HEADER}int maxSubArray(vector<int>& nums) {
    int ans = nums[0], cur = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        ans = max(ans, cur);
    }
    return ans;
}`,
  problems: [
    { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (Kadane: max ending here = max(num, cur+num)).' },
    { id: 1413, title: 'Min Start Value', slug: 'minimum-value-to-get-positive-step-by-step-sum', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: track min prefix sum; answer = max(1, 1 - minPref).', variationCode: 'int sum=0,minSum=0; for(int x:nums){ sum+=x; minSum=min(minSum,sum); } return 1-minSum;' },
  ],
  pitfalls: ['❌ Kadane: initialize ans = nums[0], not 0 (if all negative).', '❌ LC 1413: start value must be at least 1.'],
  interviewTip: '💡 "Max subarray" → Kadane: cur = max(num, cur + num); ans = max(ans, cur).',
})

export const longestBalancedLeaf = leaf('longest-balanced', 'Longest Balanced Subarray', 'purple', {
  template: `${CPP_HEADER}int findMaxLength(vector<int>& nums) {
    unordered_map<int,int> m; m[0] = -1;
    int sum = 0, ans = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += nums[i] == 0 ? -1 : 1;
        if (m.count(sum)) ans = max(ans, i - m[sum]);
        else m[sum] = i;
    }
    return ans;
}`,
  problems: [
    { id: 525, title: 'Contiguous Array', slug: 'contiguous-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (treat 0 as -1, find longest same prefix sum gap).' },
    { id: 325, title: 'Max Size Subarray K', slug: 'maximum-size-subarray-sum-equals-k', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: map of first occurrence of each prefix sum; when sum-k seen, compute length.', variationCode: 'unordered_map<int,int> m; m[0]=-1; int sum=0,ans=0; for i..n-1: sum+=nums[i]; if(m.count(sum-k)) ans=max(ans,i-m[sum-k]); if(!m.count(sum)) m[sum]=i;' },
    { id: 1124, title: 'Longest Well-Perf', slug: 'longest-well-performing-interval', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: tiring(>8)=1 else -1; find longest with positive prefix sum.', variationCode: 'int score=0,ans=0; unordered_map<int,int> m; for i..n-1: score+=hours[i]>8?1:-1; if(score>0) ans=i+1; else { if(!m.count(score)) m[score]=i; if(m.count(score-1)) ans=max(ans,i-m[score-1]); }' },
  ],
  pitfalls: ['❌ LC 525: treat 0 as -1, not as 0 (need balance detection).', '❌ LC 325: store first occurrence only (not count) for max length.'],
  interviewTip: '💡 "Longest balanced" → prefix sum + first occurrence map; 0→-1, 1→1; same sum = balanced from next index.',
})

export const niceArrayLeaf = leaf('nice-array', 'Nice Array Counting', 'pink', {
  template: `${CPP_HEADER}int numberOfSubarrays(vector<int>& nums, int k) {
    unordered_map<int,int> m; m[0] = 1;
    int sum = 0, ans = 0;
    for (int x : nums) {
        sum += x % 2;
        ans += m[sum - k];
        m[sum]++;
    }
    return ans;
}`,
  problems: [
    { id: 1248, title: 'Count Nice Subarrays', slug: 'count-number-of-nice-subarrays', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (treat odd as 1, even as 0; sum of odds = prefix sum).' },
    { id: 930, title: 'Binary Subarrays Sum', slug: 'binary-subarrays-with-sum', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: same as 560 — prefix sum of binary array, count sum - goal.', variationCode: '// Same template as subarraySum; goal replaces k' },
  ],
  pitfalls: ['❌ LC 1248: treat odd=1, even=0; subarray with k odds → prefix sum diff = k.', '❌ Using sliding window for k odds (variable window works too).'],
  interviewTip: '💡 "Nice array / binary sum" → convert to 0/1, prefix sum + hash map count.',
})

// ── 2D Prefix Sum ────────────────────────────────────────────────

export const rectSumLeaf = leaf('rect-sum', 'Rectangle Sum Query', 'green', {
  template: `${CPP_HEADER}class NumMatrix {
    vector<vector<int>> pref;
public:
    NumMatrix(vector<vector<int>>& m) {
        int R = (int)m.size(), C = (int)m[0].size();
        pref.resize(R + 1, vector<int>(C + 1, 0));
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++)
                pref[i+1][j+1] = pref[i][j+1] + pref[i+1][j] - pref[i][j] + m[i][j];
    }
    int sumRegion(int r1, int c1, int r2, int c2) {
        return pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1];
    }
};`,
  problems: [
    { id: 304, title: 'Range Sum 2D', slug: 'range-sum-query-2d-immutable', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–15: as-is (2D prefix sum with inclusion-exclusion).' },
    { id: 1314, title: 'Matrix Block Sum', slug: 'matrix-block-sum', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: use 2D prefix sum; for each cell sum submatrix [i-K][j-K] to [i+K][j+K] clamped.', variationCode: 'int m=mat.size(),n=mat[0].size(); auto pref=NumMatrix(mat); vector<vector<int>> ans(m,vector<int>(n)); for i..m-1: for j..n-1: int r1=max(0,i-K),c1=max(0,j-K),r2=min(m-1,i+K),c2=min(n-1,j+K); ans[i][j]=pref.sumRegion(r1,c1,r2,c2);' },
  ],
  pitfalls: ['❌ Inclusion-exclusion: pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1].', '❌ Building pref: pref[i+1][j+1] = cur cell + top + left - diagonal.'],
  interviewTip: '💡 "2D range sum" → pref[i+1][j+1] = val + top + left - diag. Query with inclusion-exclusion.',
})

export const submatrixLeaf = leaf('submatrix', 'Submatrix Target', 'teal', {
  template: `${CPP_HEADER}int numSubmatrixSumTarget(vector<vector<int>>& m, int t) {
    int R = (int)m.size(), C = (int)m[0].size(), ans = 0;
    for (int r1 = 0; r1 < R; r1++) {
        vector<int> colSum(C, 0);
        for (int r2 = r1; r2 < R; r2++) {
            for (int c = 0; c < C; c++) colSum[c] += m[r2][c];
            unordered_map<int,int> mp; mp[0] = 1;
            int sum = 0;
            for (int x : colSum) {
                sum += x;
                ans += mp[sum - t];
                mp[sum]++;
            }
        }
    }
    return ans;
}`,
  problems: [
    { id: 1074, title: 'Submatrix Sum Target', slug: 'number-of-submatrices-that-sum-to-target', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–16: as-is (row-range compression + 1D prefix sum + hash map).' },
    { id: 363, title: 'Max Sum ≤ K', slug: 'max-sum-of-rectangle-no-larger-than-k', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: same row-range compression; use set for lower_bound traversal.', variationCode: '// For each pair of rows, compute col prefix sums; for each suffix, use set to find smallest prefix >= sum - k' },
  ],
  pitfalls: ['❌ LC 1074: O(R² · C) — can be slow if R >> C; transpose to minimize.', '❌ Row-range compression: colSum accumulates per column for rows r1..r2.'],
  interviewTip: '💡 "Submatrix sum target" → compress rows, then 1D prefix sum + hash map on column sums.',
})

export const countSquaresLeaf = leaf('count-squares', 'Count Squares', 'green', {
  template: `${CPP_HEADER}int countSquares(vector<vector<int>>& m) {
    int R = (int)m.size(), C = (int)m[0].size(), ans = 0;
    vector<vector<int>> dp(R, vector<int>(C, 0));
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (i == 0 || j == 0) dp[i][j] = m[i][j];
            else if (m[i][j])
                dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
            ans += dp[i][j];
        }
    return ans;
}`,
  problems: [
    { id: 1277, title: 'Count Square Submatrices', slug: 'count-square-submatrices-with-all-ones', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (DP: smallest of top/left/diag + 1).' },
    { id: 1504, title: 'Count Submatrices All Ones', slug: 'count-submatrices-with-all-ones', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: for each row, track consecutive 1s per col; for each col, count submatrices with stack.', variationCode: 'vector<int> h(C,0); int ans=0; for each row: for each col: h[col]=m[i][col]?h[col]+1:0; // then for each col, use monotonic stack to count submatrices' },
  ],
  pitfalls: ['❌ LC 1277: dp[i][j] = size of largest square ending at (i,j); ans = sum of all dp.', '❌ LC 1504: O(R·C) per row with stack is tricky — histogram technique.'],
  interviewTip: '💡 "Count squares" → DP: dp[i][j] = min(top, left, diag) + 1, sum all dp values.',
})

// ── Difference Array ──────────────────────────────────────────────

export const diffArrayLeaf = leaf('diff-array', '1D Range Updates', 'amber', {
  template: `${CPP_HEADER}vector<int> corpFlightBookings(vector<vector<int>>& b, int n) {
    vector<int> diff(n + 1, 0);
    for (auto& x : b) {
        diff[x[0] - 1] += x[2];
        diff[x[1]] -= x[2];
    }
    vector<int> ans(n);
    int cur = 0;
    for (int i = 0; i < n; i++) {
        cur += diff[i];
        ans[i] = cur;
    }
    return ans;
}`,
  problems: [
    { id: 370, title: 'Range Addition', slug: 'range-addition', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (diff[l] += val, diff[r+1] -= val; prefix sum to reconstruct).' },
    { id: 1109, title: 'Flight Bookings', slug: 'corporate-flight-bookings', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (1-indexed: diff[first-1] += seats, diff[last] -= seats).' },
    { id: 1094, title: 'Car Pooling', slug: 'car-pooling', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: diff array of size 1001; diff[from] += num, diff[to] -= num; check max < capacity.', variationCode: 'int diff[1001]={0}; for(auto& t:trips){ diff[t[1]]+=t[0]; diff[t[2]]-=t[0]; } int cur=0; for(int i=0;i<=1000;i++){ cur+=diff[i]; if(cur>capacity) return false; } return true;' },
  ],
  pitfalls: ['❌ Off-by-one: diff[l] += val, diff[r+1] -= val (1D).', '❌ LC 1094: last drop-off is exclusive — diff[to] -= num, not diff[to+1].'],
  interviewTip: '💡 "Difference array" → diff[l] += v, diff[r+1] -= v; prefix sum to reconstruct. O(1) per update.',
})

export const diffArray2dLeaf = leaf('diff-2d', '2D Difference Array', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> rangeAddQueries(int n, vector<vector<int>>& q) {
    vector<vector<int>> diff(n + 1, vector<int>(n + 1, 0));
    for (auto& x : q) {
        int r1 = x[0], c1 = x[1], r2 = x[2], c2 = x[3];
        diff[r1][c1] += 1;
        diff[r1][c2 + 1] -= 1;
        diff[r2 + 1][c1] -= 1;
        diff[r2 + 1][c2 + 1] += 1;
    }
    vector<vector<int>> ans(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int top = i > 0 ? ans[i-1][j] : 0;
            int left = j > 0 ? ans[i][j-1] : 0;
            int diag = i > 0 && j > 0 ? ans[i-1][j-1] : 0;
            ans[i][j] = diff[i][j] + top + left - diag;
        }
    }
    return ans;
}`,
  problems: [
    { id: 2536, title: 'Increment Submatrices', slug: 'increment-submatrices-by-one', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 5–16: as-is (2D diff: four corners, then 2D prefix sum to reconstruct).' },
  ],
  pitfalls: ['❌ 2D diff: mark diff[r1][c1]++, diff[r1][c2+1]--, diff[r2+1][c1]--, diff[r2+1][c2+1]++.', '❌ Reconstruct: ans[i][j] = diff[i][j] + top + left - diag.'],
  interviewTip: '💡 "2D difference" → four-corner marking; prefix sum for reconstruction.',
})

export const lineSweepLeaf = leaf('line-sweep', 'Line Sweep', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> getSkyline(vector<vector<int>>& b) {
    vector<pair<int,int>> events;
    for (auto& x : b) {
        events.emplace_back(x[0], -x[2]);
        events.emplace_back(x[1], x[2]);
    }
    sort(events.begin(), events.end());
    multiset<int> h; h.insert(0);
    vector<vector<int>> ans;
    int prev = 0;
    for (auto& [x, hgt] : events) {
        if (hgt < 0) h.insert(-hgt);
        else h.erase(h.find(hgt));
        int cur = *h.rbegin();
        if (cur != prev) { ans.push_back({x, cur}); prev = cur; }
    }
    return ans;
}`,
  problems: [
    { id: 218, title: 'Skyline Problem', slug: 'the-skyline-problem', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–17: as-is (events of (x, h) with -h for start, +h for end; multiset for active heights).' },
  ],
  pitfalls: ['❌ Multiset erase(h) erases all copies — use h.erase(h.find(hgt)) for one.', '❌ Sorting events: for tie at same x, start (-height) before end (+height).'],
  interviewTip: '💡 "Skyline" → building start = -h, end = +h; sort by x; multiset of active heights; output when max height changes.',
})

// ── Advanced Prefix ──────────────────────────────────────────────

export const prefixXorLeaf = leaf('prefix-xor', 'Prefix XOR', 'blue', {
  template: `${CPP_HEADER}vector<int> xorQueries(vector<int>& a, vector<vector<int>>& q) {
    int n = (int)a.size();
    vector<int> pref(n + 1, 0);
    for (int i = 0; i < n; i++) pref[i + 1] = pref[i] ^ a[i];
    vector<int> ans;
    for (auto& x : q) ans.push_back(pref[x[1]+1] ^ pref[x[0]]);
    return ans;
}`,
  problems: [
    { id: 1310, title: 'XOR Queries', slug: 'xor-queries-of-a-subarray', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (prefix XOR, query: pref[r+1] ^ pref[l]).' },
    { id: 1442, title: 'Count Triplet XOR', slug: 'count-triplets-that-can-form-two-arrays-of-equal-xor', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: triple count when pref[i] == pref[k+1]; j is any mid.', variationCode: 'int n=arr.size(),ans=0; vector<int> pref(n+1,0); for i..n-1: pref[i+1]=pref[i]^arr[i]; for i..n: for k..i+1..n: if(pref[i]==pref[k]) ans+=k-i-1;' },
  ],
  pitfalls: ['❌ XOR properties: x ^ x = 0, x ^ 0 = x; XOR prefix inverts the same way as sum prefix.', '❌ LC 1442: triple (i,j,k) count = sum of k-i-1 for each pair where pref[i]==pref[k].'],
  interviewTip: '💡 "Prefix XOR" → same as prefix sum but with XOR; pref[r+1] ^ pref[l] for range XOR.',
})

export const prefixMinMaxLeaf = leaf('prefix-minmax', 'Prefix Min / Max', 'teal', {
  template: `${CPP_HEADER}int constrainedSubsetSum(vector<int>& nums, int k) {
    int n = (int)nums.size(), ans = nums[0];
    deque<int> dq;
    vector<int> dp(n);
    for (int i = 0; i < n; i++) {
        dp[i] = nums[i] + (dq.empty() ? 0 : max(0, dp[dq.front()]));
        while (!dq.empty() && dp[dq.back()] <= dp[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() == i - k) dq.pop_front();
        ans = max(ans, dp[i]);
    }
    return ans;
}`,
  problems: [
    { id: 1425, title: 'Constrained Subseq Sum', slug: 'constrained-subsequence-sum', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–14: as-is (DP + deque of max dp in window of size k).' },
    { id: 1340, title: 'Jump Game V', slug: 'jump-game-v', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: sort by value, DP with prefix max over index window.', variationCode: '// sort indices by arr[i], then DP[i] = 1 + max over reachable j with higher value; use segment tree or monotonic stack' },
  ],
  pitfalls: ['❌ LC 1425: dp[i] = nums[i] + max(0, max dp in last k), not just max dp.', '❌ Deque maintains max dp values in window — standard monotonic deque pattern.'],
  interviewTip: '💡 "Constrained subsequence" → DP + deque of max dp in sliding window of size k.',
})
