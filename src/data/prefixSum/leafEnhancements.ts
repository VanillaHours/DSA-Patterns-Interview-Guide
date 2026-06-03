import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'basic-range': e({
    xray: [
      { text: 'Given an array, answer **range sum queries** in O(1)', kind: 'goal' },
      { text: 'Return the **running sum** of an array', kind: 'goal' },
      { text: '**Shift letters** by cumulative position', kind: 'goal' },
    ],
    budget: ['rangeSum', 'prefixSum'],
    slottedTemplate: `vector<int> pref(n + 1, 0);
for (int i = 0; i < n; i++)
    pref[i + 1] = pref[i] + nums[i];
// query: pref[r+1] - pref[l]`,
    slots: [],
    slotFills: { 303: {}, 1480: {}, 848: {} },
    helixDelta: { 303: 'Range sum — pref[r+1] - pref[l]', 1480: 'Running sum — pref[i] = pref[i-1] + nums[i]', 848: 'Suffix sum — cumulative shift from end' },
    autopsies: [
      {
        cause: 'Off-by-one on prefix indices',
        wrong: 'pref[r] - pref[l-1]',
        testCase: 'l=0',
        fix: 'pref[r+1] - pref[l] — pref[i] = sum of first i elements.',
      },
    ],
    sayIt: ['Range sum: pref[i+1] = pref[i] + nums[i]; query: pref[r+1] - pref[l].'],
  }),

  pivot: e({
    xray: [
      { text: 'Find **pivot index** where left sum == right sum', kind: 'goal' },
      { text: 'Count ways to make array **fair** (even/odd parity)', kind: 'goal' },
    ],
    budget: ['equilibrium', 'prefixSum'],
    slottedTemplate: `int total = accumulate(nums.begin(), nums.end(), 0);
int left = 0;
for (int i = 0; i < n; i++) {
    if (left == total - left - nums[i]) return i;
    left += nums[i];
}`,
    slots: [],
    slotFills: { 724: {}, 1991: {}, 1664: {} },
    helixDelta: { 724: 'Pivot: left == total - left - nums[i]', 1991: 'Same as 724', 1664: 'Parity tracking — even/odd prefix sums, swap on removal' },
    autopsies: [
      {
        cause: 'LC 1664: forgetting that after index removal, right side even/odd flips',
        wrong: 'treat right side same parity as before',
        testCase: '[2,1,6,4]',
        fix: 'After removing i, right starts at i+1; odd becomes even, even becomes odd.',
      },
    ],
    sayIt: ['Pivot: total - left - nums[i] == left.', 'Fair array: track even/odd prefix; after removal, swap parity on right.'],
  }),

  'prefix-product': e({
    xray: [
      { text: 'Return array where each element is the **product of all except self** (no division)', kind: 'goal' },
    ],
    budget: ['prefixProduct'],
    slottedTemplate: `vector<int> out(n, 1);
int left = 1;
for (int i = 0; i < n; i++) {
    out[i] = left;
    left *= nums[i];
}
int right = 1;
for (int i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
}`,
    slots: [],
    slotFills: { 238: {} },
    helixDelta: { 238: 'Two-pass: left prefix product, right suffix product' },
    autopsies: [
      {
        cause: 'Using division (not allowed — possible zero in array)',
        wrong: 'int p = product of all nums; ans[i] = p / nums[i]',
        testCase: 'nums contains 0',
        fix: 'Two-pass prefix/suffix product — no division needed.',
      },
    ],
    sayIt: ['Product except self: left-to-right prefix, then right-to-left suffix, multiply.'],
  }),

  'target-subarray': e({
    xray: [
      { text: 'Count subarrays where **sum = k**', kind: 'goal' },
      { text: 'Count subarrays where sum **divisible by k**', kind: 'goal' },
      { text: 'Check if subarray with sum **multiple of k** and size ≥ 2 exists', kind: 'goal' },
    ],
    budget: ['subarraySum', 'prefixMap', 'remainder'],
    slottedTemplate: `unordered_map<int,int> m; m[0] = 1;
int sum = 0, ans = 0;
for (int x : nums) {
    sum += x;
    ans += m[{{TARGET}}];
    m[sum]++;
}`,
    slots: [
      { id: 'TARGET', label: 'Target expression' },
    ],
    slotFills: {
      560: { TARGET: 'sum - k' },
    },
    helixDelta: { 560: 'sum - k map count', 974: 'Remainder tracking with modulo adjustment', 523: 'First occurrence of remainder; check gap >= 2' },
    autopsies: [
      {
        cause: 'LC 974: negative modulo in C++',
        wrong: 'int rem = sum % k; // negative for negative sum',
        testCase: 'sum = -3, k = 5',
        fix: 'int rem = ((sum % k) + k) % k;',
      },
    ],
    sayIt: ['Subarray sum = k: prefix sum + map[sum-k]; m[0] = 1 initial.'],
  }),

  'max-subarray': e({
    xray: [
      { text: 'Find **maximum subarray sum** (Kadane)', kind: 'goal' },
      { text: 'Find **minimum start value** to keep step-by-step sum positive', kind: 'goal' },
    ],
    budget: ['kadane'],
    slottedTemplate: `int ans = nums[0], cur = nums[0];
for (int i = 1; i < n; i++) {
    cur = max(nums[i], cur + nums[i]);
    ans = max(ans, cur);
}`,
    slots: [],
    slotFills: { 53: {}, 1413: {} },
    helixDelta: { 53: 'Kadane: cur = max(num, cur+num)', 1413: 'Track min prefix sum; answer = 1 - minSum' },
    autopsies: [
      {
        cause: 'Kadane: initializing ans = 0 fails for all negative arrays',
        wrong: 'int ans = 0, cur = 0',
        testCase: '[-2, -1]',
        fix: 'int ans = nums[0], cur = nums[0]',
      },
    ],
    sayIt: ['Kadane: cur = max(num, cur + num); ans = max(ans, cur).'],
  }),

  'longest-balanced': e({
    xray: [
      { text: 'Find **longest subarray** with equal number of 0s and 1s', kind: 'goal' },
      { text: 'Find **maximum size** subarray sum equals k', kind: 'goal' },
      { text: 'Find **longest well-performing interval**', kind: 'goal' },
    ],
    budget: ['prefixMap', 'subarraySum'],
    slottedTemplate: `unordered_map<int,int> m; m[0] = -1;
int sum = 0, ans = 0;
for (int i = 0; i < n; i++) {
    sum += {{DELTA}};
    if (m.count(sum)) ans = max(ans, i - m[sum]);
    else m[sum] = i;
}`,
    slots: [
      { id: 'DELTA', label: 'Per-element delta' },
    ],
    slotFills: {
      525: { DELTA: 'nums[i] == 0 ? -1 : 1' },
      325: { DELTA: 'nums[i]' },
    },
    helixDelta: { 525: '0→-1, 1→1; longest with same prefix sum', 325: 'First occurrence of each sum; max gap when sum-k seen', 1124: 'Score >8 = 1, else -1; longest positive sum' },
    autopsies: [
      {
        cause: 'LC 525: using count instead of first occurrence',
        wrong: 'm[sum]++ then ans += m[sum] // counts, not longest',
        testCase: 'long gap between same sums',
        fix: 'Store first index only; ans = max(ans, i - m[sum])',
      },
    ],
    sayIt: ['Longest with property: map first occurrence of prefix sum; ans = max(ans, i - first[sum]).'],
  }),

  'nice-array': e({
    xray: [
      { text: 'Count subarrays with **exactly k odd** numbers', kind: 'goal' },
      { text: 'Count binary subarrays with **sum = goal**', kind: 'goal' },
    ],
    budget: ['prefixMap', 'binarySubarray'],
    slottedTemplate: `unordered_map<int,int> m; m[0] = 1;
int sum = 0, ans = 0;
for (int x : nums) {
    sum += {{DELTA}};
    ans += m[sum - k];
    m[sum]++;
}`,
    slots: [
      { id: 'DELTA', label: 'Per-element delta' },
    ],
    slotFills: {
      1248: { DELTA: 'x % 2' },
      930: { DELTA: 'x' },
    },
    helixDelta: { 1248: 'Odd=1, even=0; count prefix sums with diff = k', 930: 'Binary array, same as 560' },
    autopsies: [
      {
        cause: 'LC 1248: treating odds as sum, not handling even=0 correctly',
        wrong: 'sum += x % 2 == 0 ? -1 : 1 // unnecessary complexity',
        testCase: 'k=2, [1,1,1]',
        fix: 'sum += x % 2 (odd=1, even=0); count sum - k off the map.',
      },
    ],
    sayIt: ['Nice array: convert to 0/1 binary, prefix sum + hash map count.'],
  }),

  'rect-sum': e({
    xray: [
      { text: 'Answer **rectangle sum** queries on an immutable 2D matrix in O(1)', kind: 'goal' },
      { text: 'Compute **matrix block sum** for each cell', kind: 'goal' },
    ],
    budget: ['rectSum', 'prefixSum'],
    slottedTemplate: `vector<vector<int>> pref(R+1, vector<int>(C+1, 0));
for (int i = 0; i < R; i++)
    for (int j = 0; j < C; j++)
        pref[i+1][j+1] = pref[i][j+1] + pref[i+1][j] - pref[i][j] + m[i][j];
// query: pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1]`,
    slots: [],
    slotFills: { 304: {}, 1314: {} },
    helixDelta: { 304: '2D prefix sum + inclusion-exclusion query', 1314: 'Clamped block sum using 2D prefix' },
    autopsies: [
      {
        cause: 'Wrong inclusion-exclusion in query',
        wrong: 'pref[r2][c2] - pref[r1][c1]',
        testCase: 'r1=c1=0',
        fix: 'pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1]',
      },
    ],
    sayIt: ['2D prefix: pref[i+1][j+1] = val + top + left - diag.', 'Query: inclusion-exclusion with four corners.'],
  }),

  submatrix: e({
    xray: [
      { text: 'Count submatrices that **sum to target**', kind: 'goal' },
      { text: 'Find **max sum rectangle** no larger than K', kind: 'goal' },
    ],
    budget: ['submatrix', 'prefixMap'],
    slottedTemplate: `for (int r1 = 0; r1 < R; r1++) {
    vector<int> colSum(C, 0);
    for (int r2 = r1; r2 < R; r2++) {
        for (int c = 0; c < C; c++) colSum[c] += m[r2][c];
        // 1D prefix sum + hash map on colSum
    }
}`,
    slots: [],
    slotFills: { 1074: {}, 363: {} },
    helixDelta: { 1074: 'Row-range compression + 1D subarray sum with hash map', 363: 'Row-range compression + set for lower_bound on prefix' },
    autopsies: [
      {
        cause: 'Not transposing when R >> C',
        wrong: 'O(R^2 * C) where R >> C',
        testCase: 'R=1000, C=5',
        fix: 'Transpose matrix so outer loop is over smaller dimension.',
      },
    ],
    sayIt: ['Submatrix: row-range compression, then 1D prefix sum + hash map.'],
  }),

  'count-squares': e({
    xray: [
      { text: 'Count **square submatrices** with all 1s', kind: 'goal' },
      { text: 'Count submatrices with **all 1s** (rectangles)', kind: 'goal' },
    ],
    budget: ['countSquares'],
    slottedTemplate: `vector<vector<int>> dp(R, vector<int>(C, 0));
int ans = 0;
for (int i = 0; i < R; i++)
    for (int j = 0; j < C; j++) {
        if (i == 0 || j == 0) dp[i][j] = m[i][j];
        else if (m[i][j])
            dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
        ans += dp[i][j];
    }`,
    slots: [],
    slotFills: { 1277: {}, 1504: {} },
    helixDelta: { 1277: 'DP: min(top, left, diag) + 1 = max square ending here', 1504: 'Histogram per row + monotonic stack for all-1 submatrices' },
    autopsies: [
      {
        cause: 'Forgetting dp[i][j] = 0 when m[i][j] == 0',
        wrong: 'dp[i][j] = min(...) + 1 // even when m[i][j] is 0',
        testCase: '[[0,0],[0,0]]',
        fix: 'Only compute dp when m[i][j] == 1; else dp[i][j] = 0.',
      },
    ],
    sayIt: ['Count squares: DP where dp[i][j] = size of largest square ending at (i,j). Sum all dp.'],
  }),

  'diff-array': e({
    xray: [
      { text: 'Apply **range addition** queries and output final array', kind: 'goal' },
      { text: 'Check if **car pooling** capacity holds for all trips', kind: 'goal' },
    ],
    budget: ['diffArray'],
    slottedTemplate: `vector<int> diff(n + 1, 0);
for (auto& q : queries) {
    diff[q[0]] += q[2];
    diff[q[1]] -= q[2];
}
int cur = 0;
for (int i = 0; i < n; i++) {
    cur += diff[i];
    ans[i] = cur;
}`,
    slots: [],
    slotFills: { 370: {}, 1109: {}, 1094: {} },
    helixDelta: { 370: 'diff[l] += val, diff[r+1] -= val', 1109: '1-indexed: diff[first-1] += seats, diff[last] -= seats', 1094: 'Capacity check on prefix sum of diff' },
    autopsies: [
      {
        cause: 'Off-by-one on r+1 for diff marking',
        wrong: 'diff[l] += val; diff[r] -= val; // wrong, should be r+1',
        testCase: 'l=0, r=n-1',
        fix: 'diff[l] += val; diff[r+1] -= val; prefix sum to reconstruct.',
      },
    ],
    sayIt: ['Difference array: diff[l] += v, diff[r+1] -= v; prefix sum to reconstruct.'],
  }),

  'diff-2d': e({
    xray: [
      { text: '**Increment submatrices** by one with range update queries', kind: 'goal' },
    ],
    budget: ['diffArray'],
    slottedTemplate: `diff[r1][c1] += 1;
diff[r1][c2 + 1] -= 1;
diff[r2 + 1][c1] -= 1;
diff[r2 + 1][c2 + 1] += 1;
// then 2D prefix sum to reconstruct`,
    slots: [],
    slotFills: { 2536: {} },
    helixDelta: { 2536: 'Four-corner 2D diff marking + 2D prefix sum reconstruction' },
    autopsies: [
      {
        cause: 'Missing one of the four 2D diff corners',
        wrong: 'only mark top-left and bottom-right',
        testCase: 'submatrix from (0,0) to (1,1)',
        fix: 'Mark all four: (r1,c1)+, (r1,c2+1)-, (r2+1,c1)-, (r2+1,c2+1)+',
      },
    ],
    sayIt: ['2D diff: four-corner marking; 2D prefix to reconstruct.'],
  }),

  'line-sweep': e({
    xray: [
      { text: 'Find the **skyline** formed by overlapping buildings', kind: 'goal' },
    ],
    budget: ['lineSweep'],
    slottedTemplate: `vector<pair<int,int>> events;
for (auto& b : buildings) {
    events.emplace_back(b[0], -b[2]); // start
    events.emplace_back(b[1], b[2]);  // end
}
sort(events.begin(), events.end());
multiset<int> h; h.insert(0);
int prev = 0;
for (auto& [x, hgt] : events) {
    if (hgt < 0) h.insert(-hgt);
    else h.erase(h.find(hgt));
    int cur = *h.rbegin();
    if (cur != prev) { output.push_back({x, cur}); prev = cur; }
}`,
    slots: [],
    slotFills: { 218: {} },
    helixDelta: { 218: 'Events (x, ±h), multiset of active heights, output on max change' },
    autopsies: [
      {
        cause: 'Using h.erase(hgt) which erases ALL copies in multiset',
        wrong: 'h.erase(hgt); // removes all elements equal to hgt',
        testCase: 'duplicate heights',
        fix: 'h.erase(h.find(hgt)); // removes only one element',
      },
    ],
    sayIt: ['Skyline: building start = -h, end = +h; multiset tracks active heights; output when max changes.'],
  }),

  'prefix-xor': e({
    xray: [
      { text: 'Answer **XOR queries** of subarrays in O(1)', kind: 'goal' },
      { text: 'Count **triplets** where XOR of i..j and j+1..k are equal', kind: 'goal' },
    ],
    budget: ['prefixXor'],
    slottedTemplate: `vector<int> pref(n + 1, 0);
for (int i = 0; i < n; i++)
    pref[i + 1] = pref[i] ^ nums[i];
// query: pref[r+1] ^ pref[l]`,
    slots: [],
    slotFills: { 1310: {}, 1442: {} },
    helixDelta: { 1310: 'XOR pref: query pref[r+1] ^ pref[l]', 1442: 'Triplets where pref[i] == pref[k+1]; sum k-i-1 for each pair' },
    autopsies: [
      {
        cause: 'Treating XOR like addition for range queries',
        wrong: 'pref[r] - pref[l-1] // subtraction, not XOR',
        testCase: 'range XOR',
        fix: 'XOR: pref[r+1] ^ pref[l] — XOR is its own inverse.',
      },
    ],
    sayIt: ['Prefix XOR: pref[i+1] = pref[i] ^ nums[i]; query: pref[r+1] ^ pref[l].'],
  }),

  'prefix-minmax': e({
    xray: [
      { text: '**Constrained subsequence sum** with max from last k elements', kind: 'goal' },
      { text: '**Jump game V** with dp on sorted heights', kind: 'goal' },
    ],
    budget: ['prefixMinMax'],
    slottedTemplate: `deque<int> dq;
vector<int> dp(n);
for (int i = 0; i < n; i++) {
    dp[i] = nums[i] + (dq.empty() ? 0 : max(0, dp[dq.front()]));
    while (!dq.empty() && dp[dq.back()] <= dp[i]) dq.pop_back();
    dq.push_back(i);
    if (dq.front() == i - k) dq.pop_front();
}`,
    slots: [],
    slotFills: { 1425: {}, 1340: {} },
    helixDelta: { 1425: 'DP + monotonic deque for max in window of size k', 1340: 'Sort by height, DP with range max query for jumps' },
    autopsies: [
      {
        cause: 'LC 1425: forgetting max(0, ...) — we can skip negative contributions',
        wrong: 'dp[i] = nums[i] + dp[dq.front()] // may add negative',
        testCase: 'all negative',
        fix: 'dp[i] = nums[i] + max(0, dp[dq.front()])',
      },
    ],
    sayIt: ['Constrained subsequence: DP + deque of max dp in sliding window.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
