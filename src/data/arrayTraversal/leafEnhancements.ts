import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'one-pass': e({
    xray: [
      { text: 'Find the **maximum subarray** sum', kind: 'goal' },
      { text: '**Best time** to buy and sell stock', kind: 'goal' },
      { text: '**Maximum product** subarray', kind: 'goal' },
    ],
    budget: ['onePass', 'contiguous'],
    slottedTemplate: `for (int x : nums) {
    cur = {{UPDATE_CUR}};
    best = max(best, cur);
}`,
    slots: [
      { id: 'UPDATE_CUR', label: 'Running state update', hint: 'Kadane: max(x, cur+x); BuySell: max/min tracking' },
    ],
    slotFills: {
      53: { UPDATE_CUR: 'max(x, cur + x)' },
      121: { UPDATE_CUR: 'minP = min(minP, x); cur = x - minP' },
      152: { UPDATE_CUR: 'curMax = max({x, curMax*x, curMin*x}); curMin = min({x, curMax*x, curMin*x})' },
    },
    helixOrder: [53, 121, 152],
    helixDelta: {
      53: 'Kadane baseline: cur = max(x, cur + x)',
      121: 'Track min price: profit = price - minPrice',
      152: 'Track both curMax and curMin (swap on negative)',
    },
    autopsies: [
      {
        cause: 'Resetting running sum on every negative in Kadane',
        wrong: 'if (cur < 0) cur = 0; cur += x;',
        testCase: '[-2,1,-3,4,-1,2,1,-5,4]',
        fix: 'cur = max(x, cur + x) — let Kadane decide reset vs extend',
      },
      {
        cause: 'Using long for product but forgetting sign swap',
        wrong: 'cur = max(cur * x, x) // ignores negative flip',
        testCase: '[-2,3,-4]',
        fix: 'Track both curMax and curMin; swap when x < 0',
      },
    ],
    sayIt: [
      'One-pass: running state update per element.',
      'Kadane: cur = max(x, cur + x); best = max(best, cur).',
      'Buy/Sell: track min price seen so far.',
      'Product: track both max and min (sign flip).',
    ],
  }),

  'same-dir': e({
    xray: [
      { text: 'Remove **duplicates in-place** from sorted array', kind: 'goal' },
      { text: 'Move all **zeros** to the end', kind: 'goal' },
      { text: 'Return **k** = number of kept elements', kind: 'output' },
    ],
    budget: ['twoPointer', 'inPlace', 'sorted'],
    slottedTemplate: `int w = {{W_INIT}};
for (int r = 0; r < n; r++)
    if ({{KEEP}}) nums[w++] = nums[r];
return w;`,
    slots: [
      { id: 'W_INIT', label: 'Write start index', hint: '0 or 1' },
      { id: 'KEEP', label: 'Keep condition' },
    ],
    slotFills: {
      26: { W_INIT: '1', KEEP: 'r==0 || nums[r] != nums[w-1]' },
      283: { W_INIT: '0', KEEP: 'nums[r] != 0' },
      27: { W_INIT: '0', KEEP: 'nums[r] != val' },
      80: { W_INIT: '1', KEEP: 'w < 2 || nums[r] != nums[w-2]' },
    },
    helixOrder: [26, 80, 27, 283],
    helixDelta: {
      26: 'Remove duplicates — compare with nums[w-1]',
      80: 'Allow up to 2 dupes — compare with nums[w-2]',
      27: 'Remove specific value — filter != val',
      283: 'Move zeroes — filter non-zero, then fill rest',
    },
    autopsies: [
      {
        cause: 'W start at 0 for remove duplicates',
        wrong: 'int w = 0;',
        testCase: '[1,1,2]',
        fix: 'w = 1 — first element always kept',
      },
      {
        cause: 'Zeroes: swapping breaks relative order',
        wrong: 'if (nums[r]==0) swap(nums[w++], nums[r]);',
        testCase: '[0,1,0,3,12]',
        fix: 'Filter non-zero to front; fill remaining with 0',
      },
    ],
    sayIt: [
      'Same-direction: r scans ahead, w writes only kept elements.',
      'Remove dupes: w starts at 1; compare nums[r] != nums[w-1].',
      'Move zeroes: filter non-zero, then fill zeros.',
    ],
  }),

  'opposite-dir': e({
    xray: [
      { text: 'Given array sorted in **non-decreasing order**', kind: 'constraint' },
      { text: 'Find two numbers that add to **target**', kind: 'goal' },
      { text: 'Find **maximum area** between two lines', kind: 'goal' },
    ],
    budget: ['twoPointer', 'sorted', 'targetSum', 'maximize'],
    slottedTemplate: `int l = 0, r = n - 1;
while (l < r) {
    {{COMPUTE}};
    if ({{MATCH}}) {{RECORD}};
    else if ({{MOVE_L}}) l++;
    else r--;
}`,
    slots: [
      { id: 'COMPUTE', label: 'Compute metric' },
      { id: 'MATCH', label: 'Match condition' },
      { id: 'MOVE_L', label: 'Move left when' },
      { id: 'RECORD', label: 'Record action' },
    ],
    slotFills: {
      167: { COMPUTE: 'long cur = nums[l] + nums[r]', MATCH: 'cur == target', RECORD: 'return {l+1,r+1}', MOVE_L: 'cur < target' },
      15: { COMPUTE: 'long s = nums[i] + nums[l] + nums[r]', MATCH: 's == 0', RECORD: 'push triplets; skip dup l,r', MOVE_L: 's < 0' },
      11: { COMPUTE: 'int area = min(h[l],h[r])*(r-l)', MATCH: '', RECORD: 'best = max(best, area)', MOVE_L: 'h[l] < h[r]' },
    },
    helixOrder: [167, 11, 15],
    helixDelta: {
      167: 'Classic two-sum on sorted input',
      11: 'Container area — move shorter side, track max',
      15: '3Sum: outer loop + opposite inner',
    },
    autopsies: [
      {
        cause: 'Move both pointers on every step',
        wrong: 'if (sum < target) l++; else if (sum > target) r--; else l++, r--;',
        testCase: 'sum match: you want to try all pairs, not skip both sides',
        fix: 'On match, advance both l and r (or one side depending on problem)',
      },
    ],
    sayIt: [
      'Opposite ends: l=0, r=n-1.',
      'Sum too small → l++; too large → r--.',
      'Container: move shorter height side.',
    ],
  }),

  'fixed-window': e({
    xray: [
      { text: 'Find the **maximum average** subarray of length **k**', kind: 'goal' },
      { text: 'Subarrays of size **k** with average ≥ threshold', kind: 'goal' },
    ],
    budget: ['slidingWindow', 'contiguous', 'fixedK'],
    slottedTemplate: `int sum = accumulate(nums.begin(), nums.begin()+k, 0);
int best = sum;
for (int r = k; r < n; r++) {
    sum += nums[r] - nums[r - k];
    {{UPDATE}};
}`,
    slots: [{ id: 'UPDATE', label: 'When window slides', hint: 'best = max(best, sum) or if (sum >= t*k) count++' }],
    slotFills: {
      643: { UPDATE: 'best = max(best, sum)' },
      1343: { UPDATE: 'if (sum >= threshold * k) ans++' },
    },
    helixDelta: { 643: 'Track max avg', 1343: 'Count windows meeting threshold' },
    autopsies: [
      {
        cause: 'Using while-shrink loop for fixed k',
        wrong: 'while (r-l+1 > k) l++;',
        testCase: 'k=3, n=100000',
        fix: 'No shrink loop — subtract nums[r-k] directly',
      },
    ],
    sayIt: ['Fixed k: slide by adding rightmost, subtracting leftmost.', 'No shrink loop needed.'],
  }),

  'variable-window': e({
    xray: [
      { text: '**Longest substring** without repeating characters', kind: 'goal' },
      { text: '**Minimum size** subarray sum ≥ target', kind: 'goal' },
      { text: '**Minimum window** substring containing all of t', kind: 'goal' },
    ],
    budget: ['slidingWindow', 'contiguous', 'maximize', 'minimize'],
    slottedTemplate: `for (int r = 0; r < n; r++) {
    {{ADD_R}}
    while ({{CONDITION}}) { {{REMOVE_L}} l++; }
    ans = {{UPDATE}};
}`,
    slots: [
      { id: 'ADD_R', label: 'Add nums[r] to window' },
      { id: 'CONDITION', label: 'Shrink while' },
      { id: 'REMOVE_L', label: 'Remove nums[l]' },
      { id: 'UPDATE', label: 'Update answer' },
    ],
    slotFills: {
      3: { ADD_R: 'check lastPos[s[r]]', CONDITION: 'lastPos[s[r]] >= l', REMOVE_L: 'l = lastPos[s[r]]+1', UPDATE: 'max(ans, r-l+1)' },
      209: { ADD_R: 'sum += nums[r]', CONDITION: 'sum >= target', REMOVE_L: 'sum -= nums[l]', UPDATE: 'min(ans, r-l+1)' },
      76: { ADD_R: 'add s[r] to freq', CONDITION: 'window covers all of t', REMOVE_L: 'remove s[l] from freq', UPDATE: 'min(ans, r-l+1)' },
    },
    helixOrder: [3, 209, 76],
    helixDelta: {
      3: 'Longest — shrink when dup found; track max',
      209: 'Shortest — shrink while sum >= target; track min',
      76: 'Shortest with freq — shrink while all chars covered; track min',
    },
    autopsies: [
      {
        cause: 'Shrinking while invalid for longest problem',
        wrong: 'while (!valid) l++; // wrong direction for longest',
        testCase: 'LC 3 longest substring',
        fix: 'Longest: shrink only when necessary (while invalid). Shortest: shrink WHILE valid.',
      },
    ],
    sayIt: [
      'Variable window: expand r, decide shrink logic.',
      'Longest (max): shrink while INVALID, track max.',
      'Shortest (min): shrink while VALID, track min.',
    ],
  }),

  'standard-bs': e({
    xray: [
      { text: 'Given an array of integers **sorted** in ascending order', kind: 'constraint' },
      { text: 'Return the **index** of target, or **-1** if not found', kind: 'goal' },
      { text: 'Return the **insert position** if target is not found', kind: 'goal' },
    ],
    budget: ['binarySearch', 'sorted'],
    slottedTemplate: `int l = 0, r = {{R_INIT}};
while ({{LOOP_COND}}) {
    int m = l + (r - l) / 2;
    if (nums[m] == target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
}
return {{FALLBACK}};`,
    slots: [
      { id: 'R_INIT', label: 'Right bound' },
      { id: 'LOOP_COND', label: 'Loop while' },
      { id: 'FALLBACK', label: 'Fallback return' },
    ],
    slotFills: {
      704: { R_INIT: 'n - 1', LOOP_COND: 'l <= r', FALLBACK: '-1' },
      35: { R_INIT: 'n', LOOP_COND: 'l < r', FALLBACK: 'l' },
    },
    helixDelta: { 704: 'Standard BS return index or -1', 35: 'Return l (insertion point) when not found' },
    autopsies: [
      {
        cause: 'Integer overflow in mid calculation',
        wrong: 'int m = (l + r) / 2;',
        testCase: 'l=1e9, r=2e9',
        fix: 'int m = l + (r - l) / 2;',
      },
    ],
    sayIt: ['Sorted array → binary search. Mid = l + (r-l)/2.', '704: return index or -1. 35: return l for insertion point.'],
  }),

  'rotated-bs': e({
    xray: [
      { text: 'Array was **rotated** at some pivot', kind: 'constraint' },
      { text: 'Search for target in **rotated** sorted array', kind: 'goal' },
      { text: 'Find the **minimum** element in a rotated array', kind: 'goal' },
    ],
    budget: ['binarySearch', 'rotated', 'sorted'],
    slottedTemplate: `while (l <= r) {
    int m = l + (r - l) / 2;
    if (nums[m] == target) return m;
    if (nums[l] <= nums[m]) { // left sorted
        {{LEFT_HALF}}
    } else { // right sorted
        {{RIGHT_HALF}}
    }
}`,
    slots: [
      { id: 'LEFT_HALF', label: 'Target in left sorted half?' },
      { id: 'RIGHT_HALF', label: 'Target in right sorted half?' },
    ],
    slotFills: {
      33: { LEFT_HALF: 'if (nums[l]<=target && target<nums[m]) r=m-1; else l=m+1', RIGHT_HALF: 'if (nums[m]<target && target<=nums[r]) l=m+1; else r=m-1' },
      153: { LEFT_HALF: 'r = m; // min is in left half', RIGHT_HALF: 'l = m+1; // min is in right half' },
    },
    helixDelta: { 33: 'Search in rotated — determine which half is sorted', 153: 'Find min — no target compare; track half with min' },
    autopsies: [
      {
        cause: 'Using standard BS on rotated array',
        wrong: 'while (l <= r) { m = ...; if (nums[m] < target) l=m+1; else r=m-1; }',
        testCase: '[4,5,6,7,0,1,2] target=0',
        fix: 'First determine which half is sorted, then check if target lies in it',
      },
    ],
    sayIt: ['Rotated BS: compare nums[l] with nums[m] to find sorted half.', 'Search sorted half for target, or continue to the other half.'],
  }),

  'answer-space-bs': e({
    xray: [
      { text: 'Find the **minimum** capacity / speed / divisor such that …', kind: 'goal' },
      { text: 'All values within a **monotonic** range', kind: 'constraint' },
    ],
    budget: ['binarySearch', 'answerSpace'],
    slottedTemplate: `auto can = [&](int X) {
    // return true if feasible with capacity/speed X
};
int l = {{L_BOUND}}, r = {{R_BOUND}};
while (l < r) {
    int m = l + (r - l) / 2;
    if (can(m)) r = m;
    else l = m + 1;
}
return l;`,
    slots: [
      { id: 'L_BOUND', label: 'Lower bound' },
      { id: 'R_BOUND', label: 'Upper bound' },
    ],
    slotFills: {
      1011: { L_BOUND: '*max_element(...)', R_BOUND: 'accumulate(...)' },
      875: { L_BOUND: '1', R_BOUND: '*max_element(...)' },
      410: { L_BOUND: '*max_element(...)', R_BOUND: 'accumulate(...)' },
    },
    helixDelta: { 1011: 'Ship packages: capacity between max weight and sum', 875: 'Koko: speed between 1 and max pile', 410: 'Split array: largest sum between max and total' },
    autopsies: [
      {
        cause: 'Index BS applied to answer space problems',
        wrong: 'Binary search on array indices, not value range',
        testCase: 'LC 1011 — need min capacity value',
        fix: 'Define predicate can(X) over the answer range, not array indices',
      },
    ],
    sayIt: ['Answer space BS: binary search the VALUE, not the index.', 'Define monotonic predicate can(X), then standard l < r loop.'],
  }),

  'nested-loop': e({
    xray: [
      { text: 'Return the **transpose** of a matrix', kind: 'goal' },
      { text: '**Rotate** the image 90 degrees in-place', kind: 'goal' },
      { text: 'Return all elements in **spiral** order', kind: 'goal' },
    ],
    budget: ['multiDim', 'enumerate'],
    slottedTemplate: `for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        {{VISIT}}`,
    slots: [{ id: 'VISIT', label: 'Visit / assign cell' }],
    slotFills: {
      867: { VISIT: 'T[j][i] = A[i][j]' },
      48: { VISIT: 'swap four positions in layer OR reverse + transpose' },
      54: { VISIT: 'boundary-based spiral walk — four for-loops' },
    },
    helixDelta: { 867: 'Transpose: swap row/col indices', 48: 'Rotate: reverse + transpose or four-way swap', 54: 'Spiral: boundary walk with top/bottom/left/right' },
    autopsies: [
      {
        cause: 'Transpose on square matrix in-place without temp',
        wrong: 'swap(A[i][j], A[j][i]) // double-swaps later',
        testCase: '3×3 matrix',
        fix: 'Only swap for j > i, or use full temp matrix',
      },
    ],
    sayIt: ['Nested loops for standard matrix traversal.', 'Transpose: T[j][i] = A[i][j]. Rotate: reverse + transpose.'],
  }),

  coordinated: e({
    xray: [
      { text: '**Set matrix zeroes** in-place with O(1) extra space', kind: 'goal' },
      { text: '**Game of Life** — in-place state update with encoding', kind: 'goal' },
    ],
    budget: ['multiDim', 'inPlace'],
    slottedTemplate: `// Pass 1: {{MARK}}
// Pass 2: {{PROPAGATE}}`,
    slots: [
      { id: 'MARK', label: 'Mark boundaries' },
      { id: 'PROPAGATE', label: 'Propagate' },
    ],
    slotFills: {
      73: { MARK: 'if cell==0: mark first row/col, track firstRow/firstCol flags', PROPAGATE: 'for i>=1,j>=1: if matrix[i][0]==0||matrix[0][j]==0: set zero; handle first row/col flags' },
      289: { MARK: 'encode state: 0→2 (dead→alive), 1→-1 (alive→dead)', PROPAGATE: 'second pass: -1→0, 2→1' },
    },
    helixDelta: { 73: 'Two-pass zero marking using first row/col', 289: 'Encode transitions in-place, decode second pass' },
    autopsies: [
      {
        cause: 'O(m+n) extra space for Set Zeroes',
        wrong: 'bool rowZero[m], colZero[n];',
        testCase: 'large matrix O(1) space constraint',
        fix: 'Use first row and first column as markers + two flags for (0,0)',
      },
    ],
    sayIt: ['Two-pass coordinated traversal.', 'Pass 1: mark boundary cells. Pass 2: propagate based on markers.'],
  }),

  'jump-pattern': e({
    xray: [
      { text: 'Determine if you can **reach the last index**', kind: 'goal' },
      { text: 'Return the **minimum number of jumps**', kind: 'goal' },
      { text: '**Minimum jumps** to reach end with same-value jumps (IV)', kind: 'goal' },
    ],
    budget: ['jump', 'onePass'],
    slottedTemplate: `// {{STRATEGY}}: greedy max reach / BFS on implicit graph
{{CODE}}`,
    slots: [
      { id: 'STRATEGY', label: 'Strategy' },
      { id: 'CODE', label: 'Implementation' },
    ],
    slotFills: {
      55: { STRATEGY: 'Greedy reach', CODE: 'int reach=0; for(i until reach) reach=max(reach,i+nums[i]); return reach>=n-1' },
      45: { STRATEGY: 'Greedy BFS (curEnd/farthest)', CODE: 'int jumps=0,curEnd=0,far=0; for(i){ far=max(far,i+nums[i]); if(i==curEnd){jumps++;curEnd=far;} }' },
      1345: { STRATEGY: 'BFS on index graph', CODE: 'queue<int> q; vector<int> dist(n,-1); pre-group same values; BFS with i-1,i+1,same[j] edges' },
    },
    helixDelta: {
      55: 'Greedy: max reach in one scan',
      45: 'BFS-greedy: count min jumps via curEnd/farthest',
      1345: 'BFS on graph: index neighbors + same-value jumps',
    },
    autopsies: [
      {
        cause: 'Jump Game I: DP O(n²) when greedy O(n) works',
        wrong: 'bool[] dp; for each i: for each j: dp[j] = true;',
        testCase: 'large n',
        fix: 'Single pass: max reach = max(reach, i+nums[i]) — greedy is sufficient',
      },
    ],
    sayIt: [
      'Jump I: greedy max reach.',
      'Jump II: track curEnd and farthest; count jumps at curEnd.',
      'Jump IV: BFS on index graph with same-value grouping.',
    ],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
