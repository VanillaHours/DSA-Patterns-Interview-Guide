import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Sorting ───────────────────────────────────────────────────

  'merge-sort': e({
    xray: [
      { text: '**Divide** at mid, recursively sort halves, **merge** sorted halves', kind: 'signal' },
      { text: '**Stable** O(n log n), O(n) extra space', kind: 'constraint' },
    ],
    budget: ['divide', 'merge', 'temp array'],
    slottedTemplate: `void merge(vector<int>& a, int l, int m, int r) {
    vector<int> t(r - l + 1);
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) t[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= m) t[k++] = a[i++];
    while (j <= r) t[k++] = a[j++];
    for (int p = 0; p < (int)t.size(); p++) a[l + p] = t[p];
}
void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}`,
    slots: [
      { id: 'MERGE_COND', label: 'Merge comparison condition', hint: '<= for stable vs <' },
    ],
    slotFills: {
      912: { MERGE_COND: 'a[i] <= a[j]  // stable sort' },
      148: { MERGE_COND: 'use merge of two lists; val comparison' },
    },
    helixOrder: [912, 148],
    helixDelta: {
      912: 'Standard merge sort on array. O(n log n) stable.',
      148: 'Sort List: find mid via slow/fast; merge two sorted lists.',
    },
    autopsies: [
      {
        cause: 'Temp array not sized correctly',
        wrong: 'int t[r - l + 1]; // VLA not standard C++',
        testCase: 'large array — stack overflow on VLA',
        fix: 'use vector<int> t(r - l + 1);',
      },
    ],
    sayIt: [
      'Merge sort: divide at mid, sort halves, merge sorted halves. O(n log n) stable, O(n) space.',
      'Sort List: slow/fast pointer to find mid; merge without extra array.',
    ],
  }),

  'quick-sort': e({
    xray: [
      { text: '**Partition** around pivot, recursively sort left and right partitions', kind: 'signal' },
      { text: 'O(n log n) average, O(n²) worst-case', kind: 'constraint' },
    ],
    budget: ['partition', 'pivot', 'in-place'],
    slottedTemplate: `int partition(vector<int>& a, int l, int r) {
    int p = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] <= p) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}
void quickSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int p = partition(a, l, r);
    quickSort(a, l, p - 1);
    quickSort(a, p + 1, r);
}`,
    slots: [
      { id: 'PIVOT', label: 'Pivot selection strategy', hint: 'last element (Lomuto) vs random vs median-of-three' },
    ],
    slotFills: {
      912: { PIVOT: 'a[r] (Lomuto) — simple, O(n²) worst for sorted' },
      215: { PIVOT: 'a[r] (Lomuto) — quickselect uses same partition' },
    },
    helixOrder: [912, 215],
    helixDelta: {
      912: 'Full quicksort: partition then recurse both halves.',
      215: 'Quickselect: partition then recurse ONLY the half with Kth element.',
    },
    autopsies: [
      {
        cause: 'Lomuto O(n²) on sorted input',
        wrong: 'pivot = a[r]; array already sorted — unbalanced partitions',
        testCase: '[1,2,3,4,5] — n partitions of size (0, n-1)',
        fix: 'shuffle input or use random pivot / Hoare partition',
      },
    ],
    sayIt: [
      'Quick sort: pick pivot, partition, recurse. Quickselect: only recurse into half with Kth.',
    ],
  }),

  'external-sort': e({
    xray: [
      { text: 'Data too large for memory — **external** storage sorting', kind: 'signal' },
      { text: '**k-way merge** of sorted chunks using min-heap', kind: 'constraint' },
    ],
    budget: ['chunks', 'k-way merge', 'min-heap'],
    slottedTemplate: `// External Sorting:
// 1. Split into memory-sized chunks
// 2. Sort each chunk (quick sort / std::sort)
// 3. k-way merge: min-heap of (value, chunk_idx)`,
    slots: [
      { id: 'CHUNK_SIZE', label: 'Chunk size strategy', hint: 'RAM / element size' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'I/O not optimized: random reads instead of sequential',
        wrong: 'fseek back and forth for each merge step',
        testCase: 'large data — thrashing disk',
        fix: 'read/write sequentially; buffer per chunk',
      },
    ],
    sayIt: [
      'External sort: chunk, sort each, k-way merge with min-heap. I/O bound, not CPU.',
    ],
  }),

  // ── Binary Search ─────────────────────────────────────────────

  'basic-bs': e({
    xray: [
      { text: '**Halve** search space each iteration using mid', kind: 'signal' },
      { text: 'O(log n) on sorted input', kind: 'constraint' },
    ],
    budget: ['mid', 'halve', 'sorted'],
    slottedTemplate: `int search(vector<int>& a, int t) {
    int l = 0, r = (int)a.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        if (a[m] < t) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
    slots: [
      { id: 'RETURN_NOT_FOUND', label: 'What to return when not found', hint: '-1 vs l (insert position) vs r' },
    ],
    slotFills: {
      704: { RETURN_NOT_FOUND: '-1' },
      35: { RETURN_NOT_FOUND: 'l // insert position' },
    },
    helixOrder: [704, 35],
    helixDelta: {
      704: 'Standard BS: return index or -1/not found.',
      35: 'Insert position: return l (the point where search terminates).',
    },
    autopsies: [
      {
        cause: 'Integer overflow: (l + r) / 2',
        wrong: 'int m = (l + r) / 2;',
        testCase: 'l = 2^30, r = 2^30 — overflow past INT_MAX',
        fix: 'int m = l + (r - l) / 2;',
      },
    ],
    sayIt: [
      'Binary search: halve space each iteration. Insert position = final l value.',
    ],
  }),

  'rotated-bs': e({
    xray: [
      { text: 'Array **rotated** at unknown pivot, but still sorted segments', kind: 'signal' },
      { text: 'Check which half is sorted, then search within it', kind: 'constraint' },
    ],
    budget: ['rotation check', 'sorted half', 'pivot'],
    slottedTemplate: `int search(vector<int>& a, int t) {
    int l = 0, r = (int)a.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        if (a[l] <= a[m]) {
            if (a[l] <= t && t < a[m]) r = m - 1;
            else l = m + 1;
        } else {
            if (a[m] < t && t <= a[r]) l = m + 1;
            else r = m - 1;
        }
    }
    return -1;
}`,
    slots: [
      { id: 'DUPLICATE_HANDLING', label: 'Handle duplicates?', hint: 'when a[l]==a[m], increment l' },
    ],
    slotFills: {
      33: { DUPLICATE_HANDLING: 'no duplicates — standard comparison works' },
      153: { DUPLICATE_HANDLING: 'find min: if a[m] < a[r], go left; else go right' },
    },
    helixOrder: [33, 153],
    helixDelta: {
      33: 'Search rotated: check sorted half; search there.',
      153: 'Find min rotated: compare mid vs right; min is in unsorted half.',
    },
    autopsies: [
      {
        cause: 'Not handling a[l] <= a[m] correctly for all cases',
        wrong: 'if (a[l] < a[m]) // strict less — fails when l==m',
        testCase: 'array of size 2: [2,1] — l=0, m=0, a[l]==a[m]',
        fix: 'use <= not < for sorted half detection: if (a[l] <= a[m])',
      },
    ],
    sayIt: [
      'Rotated search: a[l] <= a[m] determines left sorted. Find min: a[m] < a[r] = min left.',
    ],
  }),

  'matrix-bs': e({
    xray: [
      { text: '2D matrix with **sorted rows and columns**', kind: 'signal' },
      { text: '**Flatten** index (74) or **top-right** elimination (240)', kind: 'constraint' },
    ],
    budget: ['flatten', 'top-right', 'elimination'],
    slottedTemplate: `int searchMatrix(vector<vector<int>>& a, int t) {
    int n = a.size(), m = a[0].size();
    int l = 0, r = n * m - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        int x = a[mid / m][mid % m];
        if (x == t) return true;
        if (x < t) l = mid + 1;
        else r = mid - 1;
    }
    return false;
}`,
    slots: [
      { id: 'MATRIX_STRAT', label: 'Matrix search strategy', hint: 'flatten (74) vs top-right (240)' },
    ],
    slotFills: {
      74: { MATRIX_STRAT: 'flatten: each row strictly greater than previous' },
      240: { MATRIX_STRAT: 'top-right: < t go down, > t go left' },
    },
    helixOrder: [74, 240],
    helixDelta: {
      74: 'Flatten 2D to 1D: mid/m, mid%m. Requires sorted rows AND row transitions.',
      240: 'Top-right elimination: O(m+n). Works when rows and cols separately sorted.',
    },
    autopsies: [
      {
        cause: 'Row transition not monotonic in LC 240',
        wrong: 'flatten index search on 240 — rows are sorted but last col not < next row first',
        testCase: '[[1,4],[2,5]] flatten BS fails for t=2',
        fix: 'use top-right elimination for individually sorted rows/cols',
      },
    ],
    sayIt: [
      'Matrix BS: flatten for row+col sorted (74); top-right for row/col sorted separately (240).',
    ],
  }),

  // ── Selection ─────────────────────────────────────────────────

  'quickselect': e({
    xray: [
      { text: '**Partition** like quicksort, recurse into **one** half', kind: 'signal' },
      { text: 'O(n) average, O(n²) worst', kind: 'constraint' },
    ],
    budget: ['partition', 'select half', 'kth'],
    slottedTemplate: `int partition(vector<int>& a, int l, int r) {
    int p = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] <= p) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}
int findKthLargest(vector<int>& a, int k) {
    int l = 0, r = a.size() - 1, target = a.size() - k;
    while (l <= r) {
        int p = partition(a, l, r);
        if (p == target) return a[p];
        if (p < target) l = p + 1;
        else r = p - 1;
    }
    return -1;
}`,
    slots: [
      { id: 'KTH_INDEX', label: 'Target index for Kth element', hint: 'n-k (largest) vs k-1 (smallest)' },
    ],
    slotFills: {
      215: { KTH_INDEX: 'target = n - k  // Kth largest' },
      973: { KTH_INDEX: 'partition by squared distance, not value' },
    },
    helixOrder: [215, 973],
    helixDelta: {
      215: 'Kth largest: partition by value; target = n - k.',
      973: 'K closest: partition by squared distance; target = k.',
    },
    autopsies: [
      {
        cause: 'Confusing Kth largest vs Kth smallest index',
        wrong: 'target = k - 1 for Kth largest (should be n - k)',
        testCase: '[3,2,1,5,6,4], k=2 (largest=5) — target=1 returns 2',
        fix: 'target = n - k for Kth largest; target = k - 1 for Kth smallest',
      },
    ],
    sayIt: [
      'Quickselect: partition, then recurse into side containing Kth element. O(n) average.',
    ],
  }),

  'median-of-medians': e({
    xray: [
      { text: '**Deterministic** O(n) selection using groups of 5', kind: 'signal' },
      { text: '**30%** guaranteed reduction each recursion', kind: 'constraint' },
    ],
    budget: ['groups of 5', 'median pivot', 'deterministic'],
    slottedTemplate: `// Median of Medians:
// 1. Divide into groups of 5
// 2. Sort each group, find its median
// 3. Recurse to find median of the medians
// 4. Use this as pivot for partition
// 5. Guarantees at least 30% reduction`,
    slots: [
      { id: 'GROUP_SIZE', label: 'Group size', hint: '5 minimum for 30% guarantee' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Group size less than 5 breaks guarantee',
        wrong: 'groups of 3 — only ~15% reduction worst case',
        testCase: 'large array — recursion depth O(n/k) bigger',
        fix: 'use groups of exactly 5; base case n < 5: sort directly',
      },
    ],
    sayIt: [
      'Median of Medians: groups of 5, find each median, recurse on medians for pivot. O(n) worst-case.',
    ],
  }),

  // ── Mathematical D&C ──────────────────────────────────────────

  'int-mult': e({
    xray: [
      { text: '**Karatsuba**: 3 mults instead of 4, O(n^1.585)', kind: 'signal' },
      { text: '**FFT**: O(n log n) via roots of unity', kind: 'signal' },
    ],
    budget: ['karatsuba', 'fft', 'multiplication'],
    slottedTemplate: `// Karatsuba: a*b = z2*B^2m + z1*B^m + z0
// z0 = a0*b0, z2 = a1*b1, z1 = (a1+a0)*(b1+b0) - z0 - z2
// FFT: evaluate, multiply pointwise, interpolate`,
    slots: [
      { id: 'MULT_ALGO', label: 'Multiplication algorithm', hint: 'Karatsuba vs FFT' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [],
    sayIt: [
      'Karatsuba: 3 multiplications O(n^1.585). FFT: O(n log n) polynomial mult.',
    ],
  }),

  'matrix-ops': e({
    xray: [
      { text: '**Strassen**: 7 mults instead of 8, O(n^2.807)', kind: 'signal' },
      { text: '**Matrix exponentiation**: O(n^3 log k) for recurrences', kind: 'constraint' },
    ],
    budget: ['strassen', 'matrix exponentiation', 'fibonacci'],
    slottedTemplate: `// Matrix exponentiation: [[1,1],[1,0]]^n gives [F(n+1), F(n)]
vector<vector<long>> matMul(vector<vector<long>>& a, vector<vector<long>>& b) {
    int n = a.size();
    vector<vector<long>> c(n, vector<long>(n));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++)
            for (int j = 0; j < n; j++)
                c[i][j] += a[i][k] * b[k][j];
    return c;
}`,
    slots: [
      { id: 'MAT_OP', label: 'Matrix operation', hint: 'exponentiation vs Strassen' },
    ],
    slotFills: {
      509: { MAT_OP: 'exponentiation: [[1,1],[1,0]]^n, return [0][1]' },
      70: { MAT_OP: 'exponentiation: [[1,1],[1,0]]^(n-1)' },
    },
    helixOrder: [509, 70],
    helixDelta: {
      509: 'Fibonacci via matrix exponentiation O(log n). Uses [[1,1],[1,0]].',
      70: 'Climbing Stairs: same matrix as Fibonacci. f(1)=1, f(2)=2.',
    },
    autopsies: [
      {
        cause: 'Matrix multiplication order wrong',
        wrong: 'naive i,j,k loops multiplying wrong indices',
        testCase: '[[1,0],[0,1]] * anything — identity gives wrong result',
        fix: 'i,k,j loops: c[i][j] += a[i][k] * b[k][j]',
      },
    ],
    sayIt: [
      'Matrix exponentiation: O(log n) for linear recurrences via [[1,1],[1,0]]^n.',
      'Strassen: 7 recursively multiplied submatrices.',
    ],
  }),

  'fast-exp': e({
    xray: [
      { text: '**Binary exponentiation**: square base each step', kind: 'signal' },
      { text: 'Multiply base when current **bit is set**', kind: 'goal' },
    ],
    budget: ['binary exponent', 'mod power', 'fast pow'],
    slottedTemplate: `double myPow(double x, long n) {
    if (n < 0) { x = 1 / x; n = -n; }
    double ans = 1;
    while (n) {
        if (n & 1) ans *= x;
        x *= x;
        n >>= 1;
    }
    return ans;
}`,
    slots: [
      { id: 'MOD_VAL', label: 'Modular value (if any)', hint: 'none (50) vs 1337 (372)' },
    ],
    slotFills: {
      50: { MOD_VAL: 'no mod — double result' },
      372: { MOD_VAL: 'mod = 1337; (a^b) % 1337 with array exponent' },
    },
    helixOrder: [50, 372],
    helixDelta: {
      50: 'Binary exponent: O(log n). Handle negative exponent via reciprocal.',
      372: 'Super Pow: recurse on exponent array; combine modPow results.',
    },
    autopsies: [
      {
        cause: 'INT_MIN negation overflow',
        wrong: 'n = -n; when n == INT_MIN (-2^31)',
        testCase: 'myPow(2, -2147483648) — overflow on negation',
        fix: 'use long for negation; if n < 0: x = 1/x, n = -(long)n',
      },
    ],
    sayIt: [
      'Binary exponentiation: square base each iteration; multiply when bit is set. O(log n).',
    ],
  }),

  // ── Subarray ──────────────────────────────────────────────────

  'max-subarray': e({
    xray: [
      { text: '**Divide** at mid; max of left, right, or **cross** mid', kind: 'signal' },
      { text: 'Cross sum = max suffix of left + max prefix of right', kind: 'constraint' },
    ],
    budget: ['cross sum', 'max prefix', 'max suffix'],
    slottedTemplate: `int dc(vector<int>& a, int l, int r) {
    if (l == r) return a[l];
    int m = l + (r - l) / 2;
    int left = dc(a, l, m);
    int right = dc(a, m + 1, r);
    int leftSum = INT_MIN, rightSum = INT_MIN, sum = 0;
    for (int i = m; i >= l; i--) { sum += a[i]; leftSum = max(leftSum, sum); }
    sum = 0;
    for (int i = m + 1; i <= r; i++) { sum += a[i]; rightSum = max(rightSum, sum); }
    return max({left, right, leftSum + rightSum});
}`,
    slots: [
      { id: 'COMBINE', label: 'Combine strategy for subarray', hint: 'max of left/right/cross' },
    ],
    slotFills: {
      53: { COMBINE: 'max({left, right, leftSum + rightSum})' },
      918: { COMBINE: 'Kadane max + total - min (circular) or D&C cross' },
    },
    helixOrder: [53, 918],
    helixDelta: {
      53: 'D&C max subarray: O(n log n). Combine = max(left, right, cross).',
      918: 'Circular: max of (Kadane max) and (total - Kadane min).',
    },
    autopsies: [
      {
        cause: 'Cross sum not extending from mid',
        wrong: 'compute cross sum from l to r (not adjacent to mid)',
        testCase: 'left sum includes elements not adjacent to mid',
        fix: 'cross sum MUST start at mid and extend outward (suffix of left + prefix of right)',
      },
    ],
    sayIt: [
      'Max subarray D&C: left max, right max, or cross-mid sum. Cross = max suffix of left + max prefix of right.',
    ],
  }),

  'closest-pair': e({
    xray: [
      { text: '**Closest pair** of points in 2D plane', kind: 'signal' },
      { text: '**Strip** optimization: only 7 comparisons per point', kind: 'constraint' },
    ],
    budget: ['dividing line', 'strip', '7-point check'],
    slottedTemplate: `// Closest Pair: sort by x; divide at mid; d = min(left, right)
// Strip: points within d of mid line, sorted by y
// For each point in strip, compare with next 7
// Return min(d, stripMin)`,
    slots: [
      { id: 'PROBLEM_TYPE', label: 'Geometric or array problem', hint: '2D points vs 3sum closest' },
    ],
    slotFills: {
      16: { PROBLEM_TYPE: '3Sum Closest: sort + two-pointer, not geometric' },
    },
    helixOrder: [16],
    helixDelta: {
      16: '3Sum Closest: sort, fix one element, two-pointer for the rest.',
    },
    autopsies: [
      {
        cause: 'Strip sort by y for every recursion — O(n log² n)',
        wrong: 'sort strip by y in each combine step',
        testCase: 'n=10^5 — O(n log² n) vs O(n log n)',
        fix: 'pre-sort points by y; filter sorted list into strip',
      },
    ],
    sayIt: [
      'Closest pair: sort by x, divide, combine with strip. Strip = O(n), 7 points max per comparison.',
    ],
  }),

  'counting-problems': e({
    xray: [
      { text: '**Count** pairs satisfying condition using merge sort', kind: 'signal' },
      { text: 'Count before merging: right pointer advances for each left', kind: 'constraint' },
    ],
    budget: ['merge count', 'two-pointer', 'prefix sums'],
    slottedTemplate: `int mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return 0;
    int m = l + (r - l) / 2;
    int cnt = mergeSort(a, l, m) + mergeSort(a, m + 1, r);
    int j = m + 1;
    for (int i = l; i <= m; i++) {
        while (j <= r && (long)a[i] > 2L * a[j]) j++;
        cnt += j - (m + 1);
    }
    vector<int> t; int i = l, k = m + 1;
    while (i <= m && k <= r) t.push_back(a[i] <= a[k] ? a[i++] : a[k++]);
    while (i <= m) t.push_back(a[i++]);
    while (k <= r) t.push_back(a[k++]);
    for (int p = 0; p < (int)t.size(); p++) a[l + p] = t[p];
    return cnt;
}`,
    slots: [
      { id: 'CONDITION', label: 'Count condition', hint: 'a[i] > 2*a[j] (493) vs a[i] > a[j] (315)' },
    ],
    slotFills: {
      315: { CONDITION: 'right count: for each i, while(j<=r && a[i] > a[j]) j++; cnt += j-(m+1)' },
      493: { CONDITION: 'while(j<=r && (long)a[i] > 2L*a[j]) j++; cnt += j-(m+1)' },
      327: { CONDITION: 'prefix sums: count pairs with sum in [lower,upper]' },
    },
    helixOrder: [315, 493, 327],
    helixDelta: {
      315: 'Count Smaller: count right-side elements < a[i] during merge.',
      493: 'Reverse Pairs: count if a[i] > 2*a[j]; use long for overflow.',
      327: 'Range Sum: prefix sums array; merge sort count pairs in range.',
    },
    autopsies: [
      {
        cause: 'Overflow: 2 * a[j] exceeds INT_MAX',
        wrong: 'while (j <= r && a[i] > 2 * a[j]) j++;',
        testCase: 'a[i]=1, a[j]=2^30 — 2*a[j] overflows INT_MAX',
        fix: 'use long: (long)a[i] > 2L * a[j]',
      },
    ],
    sayIt: [
      'Counting via merge sort: iterate each left element; advance right pointer; count valid right elements.',
    ],
  }),

  // ── String D&C ────────────────────────────────────────────────

  'string-dc': e({
    xray: [
      { text: '**Divide** array of strings; find LCP of halves', kind: 'signal' },
      { text: '**Combine**: common prefix of two LCP results', kind: 'goal' },
    ],
    budget: ['divide strings', 'common prefix combine'],
    slottedTemplate: `string dc(vector<string>& s, int l, int r) {
    if (l == r) return s[l];
    int m = l + (r - l) / 2;
    string left = dc(s, l, m), right = dc(s, m + 1, r);
    int i = 0;
    while (i < (int)left.size() && i < (int)right.size() && left[i] == right[i]) i++;
    return left.substr(0, i);
}`,
    slots: [
      { id: 'BASE_CASE', label: 'Base case for 1 string', hint: 'return the string itself' },
    ],
    slotFills: {
      14: { BASE_CASE: 'if (l == r) return s[l];' },
    },
    helixOrder: [14],
    helixDelta: {
      14: 'LCP via D&C: O(S) time, O(log n) recursion depth.',
    },
    autopsies: [
      {
        cause: 'Vertical scan simpler for LCP',
        wrong: 'D&C adds overhead for no benefit on LCP',
        testCase: '["flower","flow","flight"] — vertical scan O(S) is same',
        fix: 'use D&C when parallel execution is possible; vertical scan otherwise',
      },
    ],
    sayIt: [
      'String D&C: divide string array, find LCP of each half, combine by common prefix.',
    ],
  }),

  // ── Tree Recursion ───────────────────────────────────────────

  'tree-recursion': e({
    xray: [
      { text: '**Post-order**: solve left, solve right, **combine** at root', kind: 'signal' },
      { text: 'Each recursive call returns computed property of subtree', kind: 'constraint' },
    ],
    budget: ['post-order', 'combine children', 'tree property'],
    slottedTemplate: `int maxDepth(TreeNode* r) {
    if (!r) return 0;
    return 1 + max(maxDepth(r->left), maxDepth(r->right));
}`,
    slots: [
      { id: 'COMBINE_OP', label: 'Combining operation at root', hint: 'max vs sum vs swap vs check' },
    ],
    slotFills: {
      104: { COMBINE_OP: '1 + max(left, right)  // max depth' },
      110: { COMBINE_OP: 'check height diff <= 1; return -1 if unbalanced' },
      543: { COMBINE_OP: 'diameter = max(diameter, left + right); return 1 + max(left, right)' },
      226: { COMBINE_OP: 'swap(left, right); recurse on children' },
    },
    helixOrder: [104, 110, 543, 226],
    helixDelta: {
      104: 'Max depth: 1 + max(left, right). Base: return 0.',
      110: 'Balanced: check returns -1 if unbalanced; else height.',
      543: 'Diameter: track max(left+right) globally; return 1+max(left,right).',
      226: 'Invert: swap children, recurse. Post-order or pre-order both work.',
    },
    autopsies: [
      {
        cause: 'Diameter: not tracking global max',
        wrong: 'return 1 + max(left, right);  // never updates diameter',
        testCase: 'tree with diameter not through root — returns wrong value',
        fix: 'maintain int& dia or global variable; update with left+right at each node',
      },
    ],
    sayIt: [
      'Tree recursion: post-order D&C — solve child subtrees, combine at root. O(n) time.',
    ],
  }),

  'bst-dc': e({
    xray: [
      { text: '**Pick mid** as root for balanced BST from sorted array', kind: 'signal' },
      { text: '**BST from preorder**: use bound to reconstruct', kind: 'constraint' },
    ],
    budget: ['mid root', 'bound', 'balanced'],
    slottedTemplate: `TreeNode* sortedArrayToBST(vector<int>& a, int l, int r) {
    if (l > r) return nullptr;
    int m = l + (r - l) / 2;
    TreeNode* root = new TreeNode(a[m]);
    root->left = sortedArrayToBST(a, l, m - 1);
    root->right = sortedArrayToBST(a, m + 1, r);
    return root;
}`,
    slots: [
      { id: 'CONSTRUCT', label: 'Construction method', hint: 'sorted array (108) vs preorder (1008)' },
    ],
    slotFills: {
      108: { CONSTRUCT: 'pick mid as root; recursively build left and right halves' },
      1008: { CONSTRUCT: 'use bound; left subtree <= val < right subtree' },
    },
    helixOrder: [108, 1008],
    helixDelta: {
      108: 'Sorted array to BST: O(n). Always balanced: pick mid.',
      1008: 'BST from preorder: O(n). Use bound = current node val for left; bound = inf for right.',
    },
    autopsies: [
      {
        cause: 'Sorted array to BST: not building balanced tree',
        wrong: 'pick first element as root — degenerate tree O(n) height',
        testCase: 'sorted [1,2,3,4,5] — picking first gives chain',
        fix: 'always pick middle element (l + (r-l)/2) for balanced tree',
      },
    ],
    sayIt: [
      'Sorted Array to BST: pick mid for balanced tree. BST from Preorder: bound-based reconstruction.',
    ],
  }),

  // ── Segment Tree ─────────────────────────────────────────────

  'seg-tree-basics': e({
    xray: [
      { text: '**Recursive** segment tree: build, query, point-update', kind: 'signal' },
      { text: '**4*n** array size required', kind: 'constraint' },
    ],
    budget: ['build', 'query', 'point update', '4n space'],
    slottedTemplate: `class SegTree {
    vector<int> t; int n;
    void build(vector<int>& a, int v, int l, int r) {
        if (l == r) { t[v] = a[l]; return; }
        int m = l + (r - l) / 2;
        build(a, 2*v, l, m);
        build(a, 2*v+1, m+1, r);
        t[v] = t[2*v] + t[2*v+1];
    }
    int query(int v, int l, int r, int ql, int qr) {
        if (ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return t[v];
        int m = l + (r - l) / 2;
        return query(2*v, l, m, ql, qr) + query(2*v+1, m+1, r, ql, qr);
    }
    void update(int v, int l, int r, int pos, int val) {
        if (l == r) { t[v] = val; return; }
        int m = l + (r - l) / 2;
        if (pos <= m) update(2*v, l, m, pos, val);
        else update(2*v+1, m+1, r, pos, val);
        t[v] = t[2*v] + t[2*v+1];
    }
};`,
    slots: [
      { id: 'OP', label: 'Segment tree operation type', hint: 'sum vs min vs max' },
    ],
    slotFills: {
      307: { OP: 'sum: query returns left+right; update sets to val' },
      303: { OP: 'immutable: use prefix sums, no seg tree needed' },
    },
    helixOrder: [307, 303],
    helixDelta: {
      307: 'Range sum mutable: seg tree with point updates. O(log n) per op.',
      303: 'Range sum immutable: prefix sum array is simpler.',
    },
    autopsies: [
      {
        cause: 'Seg tree array too small',
        wrong: 't.resize(2 * n) — not enough for recursive tree',
        testCase: 'n=8, 2*n=16, but tree may need up to 4*n=32',
        fix: 't.resize(4 * n) — safe upper bound for 1-indexed tree',
      },
    ],
    sayIt: [
      'Segment tree: build O(n), query O(log n), update O(log n). 4n array space.',
    ],
  }),

  'seg-tree-advanced': e({
    xray: [
      { text: '**Lazy propagation**: pending updates stored in lazy array', kind: 'signal' },
      { text: '**Push** before recursing to children', kind: 'constraint' },
    ],
    budget: ['lazy', 'range update', 'push'],
    slottedTemplate: `void push(int v, int l, int r) {
    if (!lazy[v]) return;
    t[v] += lazy[v] * (r - l + 1);
    if (l != r) { lazy[2*v] += lazy[v]; lazy[2*v+1] += lazy[v]; }
    lazy[v] = 0;
}
void rangeUpdate(int v, int l, int r, int ql, int qr, int val) {
    push(v, l, r);
    if (ql > r || qr < l) return;
    if (ql <= l && r <= qr) { lazy[v] += val; push(v, l, r); return; }
    int m = l + (r - l) / 2;
    rangeUpdate(2*v, l, m, ql, qr, val);
    rangeUpdate(2*v+1, m+1, r, ql, qr, val);
    t[v] = t[2*v] + t[2*v+1];
}`,
    slots: [
      { id: 'LAZY_OP', label: 'Lazy operation', hint: 'add (range sum) vs set (range assign)' },
    ],
    slotFills: {
      370: { LAZY_OP: 'add: lazy[v] stores pending addition' },
      731: { LAZY_OP: 'add: track overlapping intervals; max cannot exceed 2' },
    },
    helixOrder: [370, 731],
    helixDelta: {
      370: 'Range addition: lazy add + range sum query.',
      731: 'Calendar II: lazy add + range max query; ensure no triple booking.',
    },
    autopsies: [
      {
        cause: 'Not pushing before reading children',
        wrong: 'recursively call rangeUpdate / query without push first',
        testCase: 'update range, then query child — child has stale value',
        fix: 'always call push(v, l, r) at start of update AND query',
      },
    ],
    sayIt: [
      'Lazy seg tree: push before recursing; t[v] = lazy * (r-l+1) for sum; O(log n) range update.',
    ],
  }),

  'merge-sort-tree': e({
    xray: [
      { text: '**Segment tree** where each node stores **sorted vector**', kind: 'signal' },
      { text: 'O(log² n) range counting queries', kind: 'constraint' },
    ],
    budget: ['sorted segments', 'range count', 'binary search'],
    slottedTemplate: `// Build: merge sorted children vectors
// Query: for each O(log n) node, binary search for count <= k
// Total: O(log² n) per range count query`,
    slots: [
      { id: 'QUERY_TYPE', label: 'Range query type', hint: 'count <= val vs count in range' },
    ],
    slotFills: {
      315: { QUERY_TYPE: 'count elements < val in range [l, r]' },
    },
    helixOrder: [315],
    helixDelta: {
      315: 'Merge sort tree: range counting O(log² n). Alternative: Fenwick + offline.',
    },
    autopsies: [],
    sayIt: [
      'Merge sort tree: segment tree of sorted vectors. O(log² n) for range counting queries.',
    ],
  }),

  'centroid-decomp': e({
    xray: [
      { text: '**Centroid**: node whose removal gives subtrees ≤ n/2 size', kind: 'constraint' },
      { text: '**Recurse** on each component after removing centroid', kind: 'signal' },
    ],
    budget: ['subtree size', 'centroid find', 'decompose'],
    slottedTemplate: `// Centroid Decomposition:
// 1. DFS to find subtree sizes
// 2. Find centroid (max child size <= total/2)
// 3. Make centroid root of level
// 4. Remove centroid, recurse on components
// Depth: O(log n) levels`,
    slots: [
      { id: 'PROBLEM', label: 'Problem type', hint: 'path counting vs distance queries' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [],
    sayIt: [
      'Centroid: remove to get ≤ n/2 components. O(n log n) for path queries.',
    ],
  }),

  'tree-dp': e({
    xray: [
      { text: '**Post-order** state propagation from children to parent', kind: 'signal' },
      { text: 'Each node returns **multiple values** representing states', kind: 'constraint' },
    ],
    budget: ['state pair', 'post-order', 'dp'],
    slottedTemplate: `pair<int,int> dfs(TreeNode* r) {
    if (!r) return {0, 0};
    auto l = dfs(r->left);
    auto rgt = dfs(r->right);
    int rob = r->val + l.second + rgt.second;
    int notRob = max(l.first, l.second) + max(rgt.first, rgt.second);
    return {rob, notRob};
}`,
    slots: [
      { id: 'STATE', label: 'States returned per node', hint: '{rob, notRob} vs {covered, camera, uncovered}' },
    ],
    slotFills: {
      124: { STATE: 'max gain from left and right; ans = max(ans, l + val + r); return val + max(l,r)' },
      337: { STATE: '{rob, notRob}; combine: rob=val+left.notRob+right.notRob; notRob=max(left)+max(right)' },
      968: { STATE: '0=covered, 1=hasCamera, 2=uncovered; if child uncovered -> place camera' },
    },
    helixOrder: [124, 337, 968],
    helixDelta: {
      124: 'Max Path Sum: track max gain; allow paths starting/ending anywhere.',
      337: 'House Robber III: return {rob, notRob} from each node; O(n).',
      968: 'Binary Tree Cameras: 3 states; place camera when child uncovered.',
    },
    autopsies: [
      {
        cause: 'Max Path Sum: not allowing negative path gains',
        wrong: 'int l = dfs(r->left); int rgt = dfs(r->right); // without max(0, gain)',
        testCase: 'all negative numbers — path sum picks max(0, gain) = 0 but should pick least negative',
        fix: 'int l = max(0, dfs(r->left)); int rgt = max(0, dfs(r->right));',
      },
    ],
    sayIt: [
      'Tree DP: post-order; return multiple states from each subtree; combine at parent. O(n).',
    ],
  }),

  // ── String Matching ─────────────────────────────────────────

  'string-matching': e({
    xray: [
      { text: '**Rolling hash**: compute hash of pattern, slide across text', kind: 'signal' },
      { text: 'D&C: **divide** text, search pattern in halves, **combine** cross-mid', kind: 'constraint' },
    ],
    budget: ['rolling hash', 'rabin-karp', 'divide search'],
    slottedTemplate: `// Rabin-Karp: hash(p) = (p[0]*B^{m-1} + ... + p[m-1]) % M
// Rolling hash: h(i+1) = (h(i) - text[i]*B^{m-1})*B + text[i+m]
// O(n + m) average
// D&C approach: divide text at mid, search pattern in each half`,
    slots: [
      { id: 'HASH_BASE', label: 'Hash base and modulus', hint: 'e.g., base=31, mod=1e9+7' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Hash collision causing false positive',
        wrong: 'single hash without double hashing',
        testCase: 'unlucky collision — matches wrong substring',
        fix: 'use double hash or verify match character-by-character',
      },
    ],
    sayIt: [
      'Rabin-Karp: rolling hash O(n+m) average. D&C: divide text, search in halves.',
    ],
  }),

  // ── Palindrome D&C ──────────────────────────────────────────

  'palindrome-dc': e({
    xray: [
      { text: '**Center expansion**: expand around each center (odd + even)', kind: 'signal' },
      { text: 'O(n²) time, O(1) space', kind: 'constraint' },
    ],
    budget: ['center expansion', 'odd/even'],
    slottedTemplate: `int expand(string& s, int l, int r) {
    while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }
    return r - l - 1;
}
string longestPalindrome(string s) {
    int start = 0, maxLen = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        int len1 = expand(s, i, i);
        int len2 = expand(s, i, i + 1);
        int len = max(len1, len2);
        if (len > maxLen) { maxLen = len; start = i - (len - 1) / 2; }
    }
    return s.substr(start, maxLen);
}`,
    slots: [
      { id: 'PAL_MODE', label: 'Palindrome mode', hint: 'longest (5) vs count (647)' },
    ],
    slotFills: {
      5: { PAL_MODE: 'longest: track maxLen and start; return s.substr(start, maxLen)' },
      647: { PAL_MODE: 'count: int ans = 0; for each center: ans += expand(s, i, i); ans += expand(s, i, i+1); return ans;' },
    },
    helixOrder: [5, 647],
    helixDelta: {
      5: 'Longest Palindromic Substring: track start+maxLen; center expansion O(n²).',
      647: 'Palindromic Substrings: count all palindromes via center expansion.',
    },
    autopsies: [
      {
        cause: 'Not handling even-length palindromes',
        wrong: 'expand(s, i, i) only — misses "abba" pattern',
        testCase: '"abba" — even palindrome returns 1 instead of 4',
        fix: 'check both odd (i,i) and even (i,i+1) centers',
      },
    ],
    sayIt: [
      'Palindrome: expand from center. Check odd + even centers. O(n²) time, O(1) space.',
    ],
  }),

  // ── Binary Indexed Tree ─────────────────────────────────────

  'binary-indexed-tree': e({
    xray: [
      { text: '**1-indexed** internal array, **i += i & -i** for add', kind: 'signal' },
      { text: 'O(log n) point update and prefix sum query', kind: 'constraint' },
    ],
    budget: ['1-indexed', 'lsb', 'prefix sum'],
    slottedTemplate: `class BIT {
    vector<int> t; int n;
public:
    BIT(int sz) : n(sz), t(sz + 1) {}
    void add(int i, int v) {
        while (i <= n) { t[i] += v; i += i & -i; }
    }
    int sum(int i) {
        int s = 0;
        while (i > 0) { s += t[i]; i -= i & -i; }
        return s;
    }
    int rangeSum(int l, int r) { return sum(r) - sum(l - 1); }
};`,
    slots: [
      { id: 'OP_TYPE', label: 'Fenwick operation type', hint: 'add (range sum) vs set (range max BIT variant)' },
    ],
    slotFills: {
      315: { OP_TYPE: 'add: coordinate compress -> BIT.add(comp, 1); BIT.sum(comp-1) for count' },
    },
    helixOrder: [315],
    helixDelta: {
      315: 'Count Smaller: compress values, traverse RTL: query count smaller, then BIT.add.',
    },
    autopsies: [
      {
        cause: 'Not converting to 1-indexed',
        wrong: '0-indexed access — BIT relies on i & -i which fails for i=0',
        testCase: 'add(0, 1) — infinite loop (i=0, i&-i=0)',
        fix: 'always use 1-indexed internally; add 1 to input index',
      },
    ],
    sayIt: [
      'BIT: O(log n) point update + prefix sum. 1-indexed. Coordinate compress for large values.',
    ],
  }),

  // ── Convex Hull ─────────────────────────────────────────────

  'convex-hull': e({
    xray: [
      { text: '**Smallest convex polygon** containing all points', kind: 'goal' },
      { text: 'Andrew\'s **monotone chain**: sort by x, build upper + lower hull', kind: 'signal' },
    ],
    budget: ['monotone chain', 'cross product', 'upper hull', 'lower hull'],
    slottedTemplate: `vector<vector<int>> convexHull(vector<vector<int>>& p) {
    sort(p.begin(), p.end());
    vector<vector<int>> hull;
    auto cross = [](auto& o, auto& a, auto& b) {
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
    };
    for (int phase = 0; phase < 2; phase++) {
        int start = hull.size();
        for (auto& pt : p) {
            while (hull.size() >= start + 2 && cross(hull[hull.size()-2], hull.back(), pt) <= 0)
                hull.pop_back();
            hull.push_back(pt);
        }
        hull.pop_back(); // remove last duplicate
        reverse(p.begin(), p.end());
    }
    return hull;
}`,
    slots: [
      { id: 'CROSS_COND', label: 'Cross product condition', hint: '<=0 for collinear exclude; <0 for include' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Cross product overflow with large coordinates',
        wrong: 'int cross = (ax-ox)*(by-oy) - (ay-oy)*(bx-ox);',
        testCase: 'coordinates near INT_MAX — overflow',
        fix: 'use long long for cross product computation',
      },
    ],
    sayIt: [
      'Convex hull: Andrew\'s monotone chain. Sort by x,y; build lower+upper hull via cross product.',
    ],
  }),

  // ── Geometric Intersections ─────────────────────────────────

  'geometric-intersections': e({
    xray: [
      { text: '**Line segment intersection** detection', kind: 'goal' },
      { text: '**Plane sweep**: sweep vertical line, active set of segments', kind: 'signal' },
    ],
    budget: ['sweep line', 'orientation', 'active set'],
    slottedTemplate: `// Bentley-Ottmann: O((n+k) log n)
// 1. Sort endpoints by x
// 2. Sweep line: maintain active segments in BST by y
// 3. When segments cross, swap their order in BST
// D&C alternative: divide at median x, find intersections
//   in left, right, and crossing the dividing line`,
    slots: [
      { id: 'INTERSECT_MODE', label: 'Intersection detection mode', hint: 'boolean vs all intersections' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [],
    sayIt: [
      'Geometric intersections: plane sweep with active segment BST. D&C: divide at median x.',
    ],
  }),

  // ── Tree Construction ──────────────────────────────────────

  'tree-construction': e({
    xray: [
      { text: '**Root** is first (preorder) or last (postorder) element', kind: 'signal' },
      { text: '**Split** inorder array at root position; recurse on left and right ranges', kind: 'constraint' },
    ],
    budget: ['inorder map', 'preorder index', 'recursive build'],
    slottedTemplate: `TreeNode* build(vector<int>& pre, int& idx, int l, int r, unordered_map<int,int>& inMap) {
    if (l > r) return nullptr;
    int val = pre[idx++];
    TreeNode* root = new TreeNode(val);
    int pos = inMap[val];
    root->left = build(pre, idx, l, pos - 1, inMap);
    root->right = build(pre, idx, pos + 1, r, inMap);
    return root;
}`,
    slots: [
      { id: 'TRAVERSAL_TYPE', label: 'Which traversals given?', hint: 'pre+in (105) vs in+post (106) vs pre+post (889)' },
    ],
    slotFills: {
      105: { TRAVERSAL_TYPE: 'pre+in: pre[0]=root; inorder splits left/right; recurse left then right' },
      106: { TRAVERSAL_TYPE: 'in+post: post[end]=root; inorder splits; recurse right then left' },
      889: { TRAVERSAL_TYPE: 'pre+post: pre[0]=root; pre[1]=left root; find in post to split' },
    },
    helixOrder: [105, 106, 889],
    helixDelta: {
      105: 'Pre+Inorder: root=pre[0], find in inorder. Left = inorder range before root.',
      106: 'In+Postorder: root=post[n-1], find in inorder. Right = inorder range after root.',
      889: 'Pre+Postorder: root=pre[0], pre[1]=left-root, split post at left-root index.',
    },
    autopsies: [
      {
        cause: 'Inorder position map not built upfront',
        wrong: 'linear search for root in inorder each recursion',
        testCase: 'n=1000 — O(n²) instead of O(n)',
        fix: 'unordered_map<int,int> inMap; for i 0..n-1: inMap[inorder[i]] = i;',
      },
    ],
    sayIt: [
      'Tree construction: pre[0] or post[n-1] is root. Split inorder at root. Recursively build children.',
    ],
  }),

  // ── LCA ─────────────────────────────────────────────────────

  'lca': e({
    xray: [
      { text: '**Post-order**: check left then right for p/q', kind: 'signal' },
      { text: 'If **both** children return non-null, current is LCA', kind: 'goal' },
    ],
    budget: ['post-order', 'p/q exist check'],
    slottedTemplate: `TreeNode* lca(TreeNode* r, TreeNode* p, TreeNode* q) {
    if (!r || r == p || r == q) return r;
    auto* left = lca(r->left, p, q);
    auto* rgt = lca(r->right, p, q);
    if (left && rgt) return r;
    return left ? left : rgt;
}`,
    slots: [
      { id: 'LCA_VARIANT', label: 'LCA variant', hint: 'both exist (236) vs may not exist (1644)' },
    ],
    slotFills: {
      236: { LCA_VARIANT: 'both p and q guaranteed in tree — standard algorithm' },
      1644: { LCA_VARIANT: 'p and q may not exist — track found count in recursion' },
    },
    helixOrder: [236, 1644],
    helixDelta: {
      236: 'LCA: post-order. If both sides return node, current is LCA.',
      1644: 'LCA II: track found count; return null if not both found.',
    },
    autopsies: [
      {
        cause: 'Not handling case where p is ancestor of q',
        wrong: 'continue recursing even after finding p',
        testCase: 'p=root, q=left — should return root early',
        fix: 'if (!r || r == p || r == q) return r; handles ancestor case',
      },
    ],
    sayIt: [
      'LCA: post-order. If both left and right return non-null, current = LCA. O(n).',
    ],
  }),

  // ── Tree Property Advanced ──────────────────────────────────

  'tree-property-advanced': e({
    xray: [
      { text: 'Post-order **aggregate** structure: isBST, min, max, sum', kind: 'signal' },
      { text: 'Null returns: {true, 0, INT_MAX, INT_MIN, 0}', kind: 'constraint' },
    ],
    budget: ['BST validation', 'min/max tracking', 'sum aggregation'],
    slottedTemplate: `struct Info { bool isBST; int sz, mn, mx, sum; };
Info dfs(TreeNode* r, int& best) {
    if (!r) return {true, 0, INT_MAX, INT_MIN, 0};
    auto l = dfs(r->left, best);
    auto rt = dfs(r->right, best);
    if (l.isBST && rt.isBST && l.mx < r->val && r->val < rt.mn) {
        int sum = r->val + l.sum + rt.sum;
        best = max(best, sum);
        return {true, 1+l.sz+rt.sz, min(l.mn, r->val), max(rt.mx, r->val), sum};
    }
    return {false, 0, 0, 0, 0};
}`,
    slots: [
      { id: 'AGG_PROP', label: 'Aggregate property to track', hint: 'sum (1373) vs size vs depth' },
    ],
    slotFills: {
      1373: { AGG_PROP: 'sum: best = max(best, sum) when valid BST subtree found' },
    },
    helixOrder: [1373],
    helixDelta: {
      1373: 'Max Sum BST: post-order isBST + min + max + sum. Track global max sum.',
    },
    autopsies: [
      {
        cause: 'Null child min/max set incorrectly',
        wrong: 'null returns {true, 0, 0, 0, 0} — parent comparison works on 0',
        testCase: 'left child null, r->val=5 — 0 < 5 is true, but should be INT_MAX (no constraint)',
        fix: 'null: min=INT_MAX, max=INT_MIN so parent value always valid',
      },
    ],
    sayIt: [
      'Post-order aggregate: isBST, min, max, sum. Null = {true, 0, INT_MAX, INT_MIN, 0}.',
    ],
  }),

  // ── Graph Connectivity ─────────────────────────────────────

  'graph-connectivity': e({
    xray: [
      { text: '**tin**: discovery time (entry time in DFS)', kind: 'signal' },
      { text: '**low**: earliest reachable vertex (back edges)', kind: 'constraint' },
    ],
    budget: ['tin', 'low', 'bridge', 'articulation'],
    slottedTemplate: `void dfs(int u, int p, vector<int>& tin, vector<int>& low, int& timer, vector<vector<int>>& g, vector<vector<int>>& bridges) {
    tin[u] = low[u] = ++timer;
    for (int v : g[u]) {
        if (v == p) continue;
        if (tin[v]) { low[u] = min(low[u], tin[v]); continue; }
        dfs(v, u, tin, low, timer, g, bridges);
        low[u] = min(low[u], low[v]);
        if (low[v] > tin[u]) bridges.push_back({u, v});
    }
}`,
    slots: [
      { id: 'TARJAN_MODE', label: 'Tarjan mode', hint: 'bridges vs articulation points' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Bridge condition vs articulation condition',
        wrong: 'use same condition for both (low[v] > tin[u] for articulation)',
        testCase: 'root with 2 children — all bridges but root IS articulation',
        fix: 'bridge: low[v] > tin[u]; articulation: (root && children>=2) || (tin[u] <= low[v])',
      },
    ],
    sayIt: [
      'Tarjan: tin = discovery time, low = earliest reachable. Bridge if low[child] > tin[node].',
    ],
  }),

  // ── Shortest Path (Johnson) ─────────────────────────────────

  'shortest-path-johnson': e({
    xray: [
      { text: '**Reweight** edges to eliminate negatives (Bellman-Ford)', kind: 'signal' },
      { text: '**Dijkstra** per vertex on reweighted non-negative graph', kind: 'constraint' },
    ],
    budget: ['bellman-ford', 'reweight', 'dijkstra all-pairs'],
    slottedTemplate: `// Johnson's Algorithm:
// 1. Add super-source q with 0-weight edges to all vertices
// 2. Bellman-Ford from q → h[v] (shortest distance from q)
// 3. Reweight: w'(u,v) = w(u,v) + h[u] - h[v]
// 4. Dijkstra from each vertex on G'
// 5. Convert: d(u,v) = d'(u,v) - h[u] + h[v]`,
    slots: [
      { id: 'REWEIGHT', label: 'Reweighting strategy', hint: 'h from Bellman-Ford' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [],
    sayIt: [
      'Johnson\'s: Bellman-Ford to reweight (O(VE)), then V×Dijkstra (O(V² log V)). All-pairs on sparse graphs.',
    ],
  }),

  // ── D&C DP Optimization ────────────────────────────────────

  'dc-dp-optimization': e({
    xray: [
      { text: '**Monotonic** opt[i][j]: optimal k for dp transition does not decrease as j increases', kind: 'constraint' },
      { text: '**Divide and conquer**: solve mid first, recurse on left and right halves', kind: 'signal' },
    ],
    budget: ['monotonic opt', 'dc dp', 'divide dp'],
    slottedTemplate: `void solve(int i, int l, int r, int optL, int optR) {
    if (l > r) return;
    int mid = l + (r - l) / 2;
    int bestK = optL, bestVal = INF;
    for (int k = optL; k <= min(mid, optR); k++)
        if (dp[i-1][k] + cost(k, mid) < bestVal)
            bestVal = cost(k, mid), bestK = k;
    dp[i][mid] = bestVal;
    solve(i, l, mid - 1, optL, bestK);
    solve(i, mid + 1, r, bestK, optR);
}`,
    slots: [
      { id: 'COST_FN', label: 'Cost function (k, mid)', hint: 'max(j+1, mid) for job scheduling' },
    ],
    slotFills: {
      1335: { COST_FN: 'maxDifficulty(j+1, mid): precompute segment maxs' },
    },
    helixOrder: [1335],
    helixDelta: {
      1335: 'D&C DP: dp[d][i] = min_{j<i} dp[d-1][j] + maxDifficulty(j+1,i). Monotonic opt for each d.',
    },
    autopsies: [
      {
        cause: 'Monotonicity does not hold — wrong algorithm',
        wrong: 'apply D&C DP opt without verifying opt[i][j] monotonicity',
        testCase: 'cost not quadrangle inequality — D&C DP gives wrong answer',
        fix: 'verify monotonicity with brute force first (O(kn²)) then apply D&C opt',
      },
    ],
    sayIt: [
      'D&C DP opt: O(kn log n) when opt is monotonic. Solve mid, recurse left and right with bounded opt range.',
    ],
  }),

  // ── Map-Reduce ─────────────────────────────────────────────

  'map-reduce': e({
    xray: [
      { text: '**Map** = apply function to each chunk (parallel D&C)', kind: 'signal' },
      { text: '**Reduce** = combine mapped results by key', kind: 'goal' },
    ],
    budget: ['map', 'shuffle', 'reduce', 'parallel'],
    slottedTemplate: `// MapReduce:
// Map(key1, value1) -> list(key2, value2)
// Shuffle: group by key2
// Reduce(key2, list(value2)) -> list(value3)
//
// D&C connection:
// Divide = map phase (split data + process independently)
// Combine = shuffle + reduce phase (group + aggregate)`,
    slots: [
      { id: 'MAP_FN', label: 'Map function logic', hint: 'extract key-value pairs from input' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [],
    sayIt: [
      'MapReduce: map = D&C divide + process; shuffle = group by key; reduce = combine results.',
    ],
  }),

  // ── Parallel Sorting ───────────────────────────────────────

  'parallel-sorting': e({
    xray: [
      { text: '**Divide** into P chunks, **sort** each in parallel', kind: 'signal' },
      { text: '**Multi-way merge** or parallel partition', kind: 'constraint' },
    ],
    budget: ['parallel sort', 'multi-way merge', 'load balance'],
    slottedTemplate: `// Parallel Merge Sort:
// 1. Divide array into P chunks
// 2. Sort each chunk in parallel (std::sort / quick sort)
// 3. Multi-way merge sorted chunks
// Speedup: Amdahl's law limits benefit of parallelism
//
// Parallel Quick Sort:
// 1. Parallel partition (prefix sums of comparison results)
// 2. Recurse on partitions in parallel`,
    slots: [
      { id: 'PAR_SORT', label: 'Parallel sort algorithm', hint: 'merge sort vs quick sort' },
    ],
    slotFills: {},
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Merge step not parallelized (Amdahl\'s law)',
        wrong: 'parallel sort only, serial merge — bottleneck',
        testCase: 'many processors — speedup limited by serial merge',
        fix: 'use parallel merge (e.g., merge paths algorithm) or parallel quick sort',
      },
    ],
    sayIt: [
      'Parallel sorting: divide into chunks, sort in parallel, merge. Parallel quick sort avoids merge bottleneck.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
