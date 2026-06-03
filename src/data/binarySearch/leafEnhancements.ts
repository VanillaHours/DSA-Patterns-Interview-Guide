import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'exact-match': e({
    xray: [
      { text: 'Given a **sorted** array and target, return the **index**', kind: 'goal' },
      { text: 'Compute integer **square root** of x', kind: 'goal' },
    ],
    budget: ['exactMatch', 'sortedInput', 'logN'],
    slottedTemplate: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    slots: [],
    slotFills: { 704: {}, 69: {} },
    helixDelta: {
      704: 'Standard BS: lo<=hi, mid compare, 3 branches (==, <, >)',
      69: 'BS on answer: lo=0, hi=x; right-biased mid for lo=mid pattern',
    },
    autopsies: [
      {
        cause: 'Integer overflow for large arrays',
        wrong: 'int mid = (lo + hi) / 2;',
        testCase: 'lo=1e9, hi=2e9 — sum exceeds INT_MAX',
        fix: 'int mid = lo + (hi - lo) / 2; — no overflow.',
      },
      {
        cause: 'LC 69: infinite loop with lo < hi and lo = mid',
        wrong: 'int mid = lo + (hi - lo) / 2; // left-biased, never advances',
        testCase: 'lo=0, hi=1, mid=0 — lo stays 0 forever',
        fix: 'int mid = lo + (hi - lo + 1) / 2; // right-biased for lo=mid',
      },
    ],
    sayIt: ['Classic BS: lo <= hi, mid compare. Sqrt: BS on answer with right-biased mid.'],
  }),

  boundary: e({
    xray: [
      { text: 'Find **first and last** occurrence of a target in sorted array', kind: 'goal' },
    ],
    budget: ['firstLast', 'sortedInput', 'logN'],
    slottedTemplate: `vector<int> searchRange(vector<int>& nums, int target) {
    auto lb = lower_bound(nums.begin(), nums.end(), target);
    if (lb == nums.end() || *lb != target) return {-1, -1};
    auto ub = upper_bound(nums.begin(), nums.end(), target);
    return {(int)(lb - nums.begin()), (int)(ub - nums.begin() - 1)};
}`,
    slots: [],
    slotFills: { 34: {} },
    helixDelta: {
      34: 'lower_bound for first, upper_bound-1 for last',
    },
    autopsies: [
      {
        cause: 'Not checking lower_bound validity before accessing',
        wrong: 'int first = lb - nums.begin(); // lb might be end()',
        testCase: 'target not in array',
        fix: 'Check if (lb == nums.end() || *lb != target) return {-1,-1}.',
      },
    ],
    sayIt: ['First and last: lower_bound for first, upper_bound-1 for last.'],
  }),

  position: e({
    xray: [
      { text: 'Find **insert position** for target in sorted array', kind: 'goal' },
      { text: '**Guess number** higher or lower', kind: 'goal' },
    ],
    budget: ['insertPos', 'sortedInput', 'logN'],
    slottedTemplate: `int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 35: {}, 374: {} },
    helixDelta: {
      35: 'Lower_bound: lo < hi, hi = mid, return lo',
      374: 'BS on [1, n] with guess() API returning -1/0/1',
    },
    autopsies: [
      {
        cause: 'LC 35: using hi = n-1 instead of hi = n',
        wrong: 'int hi = nums.size() - 1; // misses insert-at-end case',
        testCase: 'nums=[1], target=2 — should return 1',
        fix: 'int hi = nums.size(); // exclusive upper bound for insert position.',
      },
    ],
    sayIt: ['Insert position: lower_bound pattern (lo < hi, hi = mid, lo = mid+1).'],
  }),

  'rotated-min': e({
    xray: [
      { text: 'Find **minimum** in a **rotated sorted** array', kind: 'goal' },
      { text: 'Find min in rotated array **with duplicates**', kind: 'goal' },
    ],
    budget: ['rotatedArray', 'sortedInput', 'logN'],
    slottedTemplate: `int findMin(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
    slots: [],
    slotFills: { 153: {}, 154: {} },
    helixDelta: {
      153: 'Compare mid vs hi; if mid > hi → min is right, else left',
      154: 'With duplicates: if nums[mid]==nums[hi], hi-- to shrink',
    },
    autopsies: [
      {
        cause: 'Comparing mid vs lo instead of hi',
        wrong: 'if (nums[mid] > nums[lo]) lo = mid + 1;',
        testCase: 'nums=[2,1] — mid=0, lo=0, nums[0]=2 > nums[0]=2 false, lo never advances',
        fix: 'Compare nums[mid] vs nums[hi]; pivot is always to the right of mid when mid > hi.',
      },
    ],
    sayIt: ['Rotated min: compare mid vs hi; if mid > hi → pivot right, else left.'],
  }),

  'rotated-search': e({
    xray: [
      { text: '**Search** target in a **rotated sorted** array', kind: 'goal' },
      { text: 'Search in rotated array **with duplicates**', kind: 'goal' },
    ],
    budget: ['rotatedArray', 'sortedInput', 'logN'],
    slottedTemplate: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    slots: [],
    slotFills: { 33: {}, 81: {} },
    helixDelta: {
      33: 'Determine sorted half; check if target in that half; narrow',
      81: 'With duplicates: if nums[lo]==nums[mid]==nums[hi], shrink both ends',
    },
    autopsies: [
      {
        cause: 'Using < instead of <= for left half check',
        wrong: 'if (nums[lo] < nums[mid]) // fails for two-element arrays',
        testCase: 'nums=[3,1], lo=0, mid=0 — nums[0] < nums[0] is false',
        fix: 'if (nums[lo] <= nums[mid]) — handles single-element sorted half.',
      },
    ],
    sayIt: ['Rotated search: find sorted half, check if target lies in it, else go to other half.'],
  }),

  mountain: e({
    xray: [
      { text: 'Find **peak index** in a mountain array', kind: 'goal' },
      { text: 'Find a **peak element** in any array', kind: 'goal' },
      { text: '**Find target** in a mountain array', kind: 'goal' },
    ],
    budget: ['mountainArray', 'peakElement', 'logN'],
    slottedTemplate: `int peakIndexInMountainArray(vector<int>& arr) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 852: {}, 162: {}, 1095: {} },
    helixDelta: {
      852: 'Compare mid vs mid+1; climb toward higher neighbor',
      162: 'Same as 852 — works for any array with adjacent unequal',
      1095: 'Find peak, then BS left (ascending), then BS right (descending)',
    },
    autopsies: [
      {
        cause: 'LC 1095: not searching ascending side first',
        wrong: 'search descending side first — may return wrong index',
        testCase: 'target exists on both sides of peak',
        fix: 'Always search left (ascending) side first; only search right if not found.',
      },
    ],
    sayIt: ['Peak: compare mid vs mid+1; if asc(lo=mid+1) else desc(hi=mid).'],
  }),

  'unknown-size': e({
    xray: [
      { text: '**Search** target in a sorted array of **unknown size**', kind: 'goal' },
    ],
    budget: ['unknownSize', 'sortedInput', 'logN'],
    slottedTemplate: `int search(const ArrayReader& reader, int target) {
    int lo = 0, hi = 1;
    while (reader.get(hi) < target) {
        lo = hi;
        hi *= 2;
    }
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = reader.get(mid);
        if (val == target) return mid;
        else if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    slots: [],
    slotFills: { 702: {} },
    helixDelta: {
      702: 'Exponential search for bounds, then standard BS',
    },
    autopsies: [
      {
        cause: 'Exponential search without OOB handling',
        wrong: 'reader.get(hi) may return INT_MAX for out-of-bounds',
        testCase: 'reader.get() returns 2^31-1 for indices beyond length',
        fix: 'Compare while reader.get(hi) < target and not OOB (INT_MAX sentinel).',
      },
    ],
    sayIt: ['Unknown size: exponential bounds (double hi), then standard BS.'],
  }),

  'minimize-max': e({
    xray: [
      { text: '**Minimum capacity** to ship packages within D days', kind: 'goal' },
      { text: '**Koko** — minimum speed to eat all bananas within H hours', kind: 'goal' },
      { text: '**Split array** — minimize largest subarray sum', kind: 'goal' },
      { text: '**Minimize max difference** of pairs', kind: 'goal' },
    ],
    budget: ['minMax', 'feasibility', 'monotonic'],
    slottedTemplate: `int shipWithinDays(vector<int>& weights, int days) {
    auto can = [&](int cap) {
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    };
    int lo = *max_element(weights.begin(), weights.end());
    int hi = accumulate(weights.begin(), weights.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 1011: {}, 875: {}, 410: {}, 2616: {} },
    helixDelta: {
      1011: 'Feasibility: can ship within days with capacity mid?',
      875: 'Feasibility: sum ceil(piles[i]/speed) <= h',
      410: 'Feasibility: split into <= m subarrays with sum <= mid',
      2616: 'Feasibility: count pairs with diff <= mid >= p',
    },
    autopsies: [
      {
        cause: 'Wrong bounds — lo should be max element not 0',
        wrong: 'int lo = 0; // a package larger than cap can never be shipped',
        testCase: 'weights=[100], days=1 — answer=100',
        fix: 'int lo = *max_element(...); // minimum feasible capacity is the largest item.',
      },
    ],
    sayIt: ['Minimize max: BS on answer, feasibility predicate, can(mid)? hi=mid else lo=mid+1.'],
  }),

  'maximize-min': e({
    xray: [
      { text: '**Maximize minimum distance** between magnets', kind: 'goal' },
      { text: '**Minimum speed** to arrive on time', kind: 'goal' },
    ],
    budget: ['maxMin', 'feasibility', 'monotonic'],
    slottedTemplate: `int maxDistance(vector<int>& position, int m) {
    sort(position.begin(), position.end());
    auto can = [&](int minDist) {
        int cnt = 1, last = position[0];
        for (int i = 1; i < (int)position.size(); i++) {
            if (position[i] - last >= minDist) {
                cnt++; last = position[i];
            }
        }
        return cnt >= m;
    };
    int lo = 1, hi = position.back() - position[0];
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;
        if (can(mid)) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 1552: {}, 1870: {} },
    helixDelta: {
      1552: 'Place m balls with min dist >= mid; can(mid)? lo=mid else hi=mid-1',
      1870: 'Speed predicate: sum ceil(dist/speed) <= hour (last partial hour)',
    },
    autopsies: [
      {
        cause: 'Using left-biased mid for lo=mid pattern (infinite loop)',
        wrong: 'int mid = lo + (hi - lo) / 2; // left-biased, lo never advances',
        testCase: 'lo=1, hi=2, mid=1, can(1)=true → lo=1 forever',
        fix: 'int mid = lo + (hi - lo + 1) / 2; // right-biased for lo=mid',
      },
    ],
    sayIt: ['Maximize min: right-biased mid (lo+hi+1)/2; lo=mid when feasible.'],
  }),

  'math-counting': e({
    xray: [
      { text: 'Find **kth smallest** in a row-and-column sorted matrix', kind: 'goal' },
      { text: 'Find **median** of two sorted arrays', kind: 'goal' },
    ],
    budget: ['kthSearch', 'monotonic', 'logN'],
    slottedTemplate: `int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = (int)matrix.size();
    int lo = matrix[0][0], hi = matrix[n-1][n-1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int cnt = 0;
        for (int r = 0; r < n; r++)
            cnt += upper_bound(matrix[r].begin(), matrix[r].end(), mid) - matrix[r].begin();
        if (cnt < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 378: {}, 4: {} },
    helixDelta: {
      378: 'BS on value; count <= mid per row with upper_bound',
      4: 'Partition-based BS on smaller array; O(log min(n,m))',
    },
    autopsies: [
      {
        cause: 'LC 378: counting < mid instead of <= mid',
        wrong: 'cnt += lower_bound(...) - ...begin(); // counts < mid not <= mid',
        testCase: 'mid is the answer — count < answer fails to reach k',
        fix: 'cnt += upper_bound(...) - ...begin(); // counts elements <= mid.',
      },
    ],
    sayIt: ['Kth via BS on value: count ≤ mid; if cnt < k → lo=mid+1 else hi=mid.'],
  }),

  'matrix-search': e({
    xray: [
      { text: '**Search** target in a row-major sorted 2D matrix', kind: 'goal' },
      { text: '**Search** target in row-and-column sorted matrix', kind: 'goal' },
    ],
    budget: ['matrixSearch', 'sortedInput'],
    slottedTemplate: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int r = 0, c = (int)matrix[0].size() - 1;
    while (r < (int)matrix.size() && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] < target) r++;
        else c--;
    }
    return false;
}`,
    slots: [],
    slotFills: { 74: {}, 240: {} },
    helixDelta: {
      74: '1D BS on flat index: matrix[mid/n][mid%n]',
      240: 'Top-right elimination: if < target → r++, else c--',
    },
    autopsies: [
      {
        cause: 'LC 240: starting from wrong corner',
        wrong: 'r=0, c=0 (top-left) — both directions decrease',
        testCase: 'target at bottom-right',
        fix: 'Start from top-right (r=0, c=n-1); one direction increases, other decreases.',
      },
    ],
    sayIt: ['Matrix search: 74 → 1D BS. 240 → top-right elimination (O(m+n)).'],
  }),

  'parallel-bs': e({
    xray: [
      { text: '**Minimum days** to make m bouquets from blooming flowers', kind: 'goal' },
    ],
    budget: ['parallelBS', 'feasibility', 'monotonic'],
    slottedTemplate: `int minDays(vector<int>& bloomDay, int m, int k) {
    auto can = [&](int day) {
        int bouquets = 0, flowers = 0;
        for (int b : bloomDay) {
            flowers = (b <= day) ? flowers + 1 : 0;
            if (flowers == k) { bouquets++; flowers = 0; }
        }
        return bouquets >= m;
    };
    int lo = 1, hi = *max_element(bloomDay.begin(), bloomDay.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    slots: [],
    slotFills: { 1482: {} },
    helixDelta: {
      1482: 'Compound predicate: contiguous bloomed flowers + bouquets count',
    },
    autopsies: [
      {
        cause: 'Not checking if total flowers < m*k',
        wrong: 'start BS without early failure check',
        testCase: 'n < m*k — impossible regardless of day',
        fix: 'if ((long long)m * k > bloomDay.size()) return -1; // early exit.',
      },
    ],
    sayIt: ['Parallel BS: compound feasibility predicate + standard minimize-max BS.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
