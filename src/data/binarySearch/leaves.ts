import { leaf } from './helpers'

const CPP = `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

`

// ── Classic Index Search ─────────────────────────────────────────

export const exactMatchLeaf = leaf('exact-match', 'Exact Match Search', 'teal', {
  template: `${CPP}int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
  problems: [
    { id: 704, title: 'Binary Search', slug: 'binary-search', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–11: as-is (standard BS: lo <= hi, mid compare).' },
    { id: 69, title: 'Sqrt(x)', slug: 'sqrtx', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: BS on answer space [0, x]; condition mid*mid <= x.', variationCode: 'int lo=0,hi=x; while(lo<hi){ long mid=lo+(hi-lo+1)/2; if(mid*mid<=x) lo=mid; else hi=mid-1; } return lo;' },
  ],
  pitfalls: ['❌ Overflow: mid = (lo+hi)/2 for large ints — use lo + (hi-lo)/2.', '❌ LC 69: right-biased mid (hi-lo+1)/2 when condition is lo=mid.'],
  interviewTip: '💡 Classic BS: lo=0, hi=n-1, while(lo<=hi), mid compare. O(log n).',
})

export const boundaryLeaf = leaf('boundary', 'Boundary Detection', 'teal', {
  template: `${CPP}vector<int> searchRange(vector<int>& nums, int target) {
    auto lb = lower_bound(nums.begin(), nums.end(), target);
    if (lb == nums.end() || *lb != target) return {-1, -1};
    auto ub = upper_bound(nums.begin(), nums.end(), target);
    return {(int)(lb - nums.begin()), (int)(ub - nums.begin() - 1)};
}`,
  problems: [
    { id: 34, title: 'First/Last Position', slug: 'find-first-and-last-position-of-element-in-sorted-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3–6: as-is (lower_bound + upper_bound).' },
  ],
  pitfalls: ['❌ Not checking if lower_bound is end() or value mismatch before accessing.', '❌ C++: upper_bound returns first > target — subtract 1 for last occurrence.'],
  interviewTip: '💡 "First and last" → lower_bound for first, upper_bound-1 for last.',
})

export const positionLeaf = leaf('position', 'Position-Based', 'teal', {
  template: `${CPP}int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
  problems: [
    { id: 35, title: 'Search Insert', slug: 'search-insert-position', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (lower_bound manual: lo < hi, hi = mid).' },
    { id: 374, title: 'Guess Number', slug: 'guess-number-higher-or-lower', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line: BS on [1, n]; condition guess(mid) == 0.', variationCode: 'int lo=1,hi=n; while(lo<=hi){ int mid=lo+(hi-lo)/2; int g=guess(mid); if(g==0) return mid; else if(g==-1) hi=mid-1; else lo=mid+1; } return -1;' },
  ],
  pitfalls: ['❌ LC 35: hi = nums.size() (not size-1) — insert position can be at end.', '❌ LC 374: ternary API returns -1/0/1 — mid comparison differs from classic.'],
  interviewTip: '💡 "Insert position" → lower_bound pattern with lo < hi, hi = mid.',
})

// ── Modified Search Space ────────────────────────────────────────

export const rotatedMinLeaf = leaf('rotated-min', 'Rotated Array — Find Min', 'purple', {
  template: `${CPP}int findMin(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
  problems: [
    { id: 153, title: 'Find Min Rotated', slug: 'find-minimum-in-rotated-sorted-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (compare mid vs hi; lo=mid+1 or hi=mid).' },
    { id: 154, title: 'Find Min Rotated II', slug: 'find-minimum-in-rotated-sorted-array-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: when nums[mid]==nums[hi], decrement hi (duplicates).', variationCode: 'if(nums[mid]==nums[hi]) hi--; else if(nums[mid]>nums[hi]) lo=mid+1; else hi=mid;' },
  ],
  pitfalls: ['❌ LC 153: compare with hi, not lo — pivot is on the right side.', '❌ LC 154: duplicates break the strict comparison — hi-- when equal.'],
  interviewTip: '💡 "Min in rotated" → compare mid vs hi; if mid > hi → pivot in right, else in left.',
})

export const rotatedSearchLeaf = leaf('rotated-search', 'Rotated Array — Search', 'purple', {
  template: `${CPP}int search(vector<int>& nums, int target) {
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
  problems: [
    { id: 33, title: 'Search Rotated', slug: 'search-in-rotated-sorted-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 6–13: as-is (check which half is sorted; narrow by target range).' },
    { id: 81, title: 'Search Rotated II', slug: 'search-in-rotated-sorted-array-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: when nums[lo]==nums[mid]==nums[hi], increment lo and decrement hi.', variationCode: 'if(nums[lo]==nums[mid]&&nums[mid]==nums[hi]){ lo++; hi--; } else if(nums[lo]<=nums[mid]){ ... } else { ... }' },
  ],
  pitfalls: ['❌ LC 33: nums[lo] <= nums[mid] (use <= not <) — handles two-element case.', '❌ LC 81: worst-case O(n) when all duplicates — must shrink both ends.'],
  interviewTip: '💡 "Search rotated" → determine sorted half (left or right), then check if target lies in it.',
})

export const mountainLeaf = leaf('mountain', 'Mountain / Bitonic Array', 'teal', {
  template: `${CPP}int peakIndexInMountainArray(vector<int>& arr) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
  problems: [
    { id: 852, title: 'Peak Mountain', slug: 'peak-index-in-a-mountain-array', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (compare mid vs mid+1; climb up).' },
    { id: 162, title: 'Find Peak', slug: 'find-peak-element', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Same as 852 — works for any array with adjacent unequal.', variationCode: '// same template — works for any array where adjacent elements differ' },
    { id: 1095, title: 'Mountain Array', slug: 'find-in-mountain-array', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: find peak, then BS on left (ascending) then right (descending).', variationCode: 'int peak=peakIndexInMountainArray(arr); int l=bs(arr,target,0,peak,true); return l!=-1?l:bs(arr,target,peak,n-1,false);' },
  ],
  pitfalls: ['❌ LC 162: peek find works for any array with adjacent unequal — no mountain needed.', '❌ LC 1095: search ascending side first (left of peak), then descending (right).'],
  interviewTip: '💡 "Peak / mountain" → compare mid vs mid+1; if arr[mid] < arr[mid+1] → peak is right, else left.',
})

export const unknownSizeLeaf = leaf('unknown-size', 'Unknown Size / Infinite Array', 'teal', {
  template: `// Binary search on array of unknown size
// 1. Find bounds by exponential expansion
// 2. Standard BS within [lo, hi]
int search(const ArrayReader& reader, int target) {
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
  problems: [
    { id: 702, title: 'Search Unknown Size', slug: 'search-in-a-sorted-array-of-unknown-size', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 6–18: as-is (exponential find bounds, then BS).' },
  ],
  pitfalls: ['❌ Not handling out-of-bounds — reader.get() returns 2^31-1 for OOB.', '❌ Exponential bounds: start hi=1, double until reader.get(hi) >= target or OOB.'],
  interviewTip: '💡 "Unknown size" → exponential search for bounds (double hi), then standard BS.',
})

// ── Answer Space ─────────────────────────────────────────────────

export const minimizeMaxLeaf = leaf('minimize-max', 'Minimize Maximum', 'orange', {
  template: `${CPP}int shipWithinDays(vector<int>& weights, int days) {
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
  problems: [
    { id: 1011, title: 'Ship Packages', slug: 'capacity-to-ship-packages-within-d-days', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3–14: as-is (feasibility predicate + BS on capacity).' },
    { id: 875, title: 'Koko Bananas', slug: 'koko-eating-bananas', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: speed predicate — sum ceil(piles[i]/speed) <= h.', variationCode: 'auto can=[&](int s){ long h=0; for(int p:piles) h+=(p+s-1)/s; return h<=H; }; int lo=1,hi=*max_element(piles.begin(),piles.end());' },
    { id: 410, title: 'Split Array', slug: 'split-array-largest-sum', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: same template; can(mid) splits into <= m subarrays.', variationCode: '// same as 1011: can(mid) checks if subarrays with sum<=mid <= m' },
    { id: 2616, title: 'Min Pair Diff', slug: 'minimize-the-maximum-difference-of-pairs', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: BS on max diff; can(mid) counts pairs with diff <= mid.', variationCode: 'auto can=[&](int m){ int cnt=0; for(int i=0;i<n-1&&cnt<p;i++) if(nums[i+1]-nums[i]<=m){ cnt++; i++; } return cnt>=p; };' },
  ],
  pitfalls: ['❌ Lo bound: often max element (min feasible capacity/speed).', '❌ Feasibility function is the key — BS on answer space is just boilerplate.'],
  interviewTip: '💡 "Minimize max" → BS on answer; feasibility predicate: can(mid)? hi=mid else lo=mid+1.',
})

export const maximizeMinLeaf = leaf('maximize-min', 'Maximize Minimum', 'orange', {
  template: `${CPP}int maxDistance(vector<int>& position, int m) {
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
  problems: [
    { id: 1552, title: 'Magnetic Force', slug: 'magnetic-force-between-two-balls', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–17: as-is (BS on min distance; can place m balls with gap >= mid).' },
    { id: 1870, title: 'Min Speed', slug: 'minimum-speed-to-arrive-on-time', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: speed predicate — sum ceil(dist[i]/speed) <= hour.', variationCode: 'auto can=[&](int s){ double t=0; for(int i=0;i<n-1;i++) t+=(dist[i]+s-1)/s; t+=(double)dist.back()/s; return t<=hour; }; int lo=1,hi=1e7;' },
  ],
  pitfalls: ['❌ "Maximize min" uses left-biased mid (lo+hi+1)/2 with lo=mid pattern.', '❌ LC 1870: last element is partial hour (double division), not ceiling.'],
  interviewTip: '💡 "Maximize min" → BS on answer; right-biased mid; lo=mid when feasible.',
})

export const mathCountingLeaf = leaf('math-counting', 'Math / Counting', 'blue', {
  template: `${CPP}int kthSmallest(vector<vector<int>>& matrix, int k) {
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
  problems: [
    { id: 378, title: 'Kth Sorted Matrix', slug: 'kth-smallest-element-in-a-sorted-matrix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–12: as-is (BS on value; count <= mid using upper_bound per row).' },
    { id: 4, title: 'Median Sorted Arrays', slug: 'median-of-two-sorted-arrays', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: partition-based BS on smaller array; O(log min(n,m)).', variationCode: '// Partition A and B: i = kth in A, j = k-i; ensure A[i-1]<=B[j] && B[j-1]<=A[i]' },
  ],
  pitfalls: ['❌ LC 378: counting ≤ mid, not < mid — affects binary search direction.', '❌ LC 4: partition lengths must sum to (m+n+1)/2; handle edges with INT_MIN/INT_MAX.'],
  interviewTip: '💡 "Kth via BS on value" → count elements ≤ mid; if cnt < k → lo=mid+1 else hi=mid.',
})

// ── Specialized Variants ─────────────────────────────────────────

export const matrixSearchLeaf = leaf('matrix-search', '2D Matrix Search', 'teal', {
  template: `${CPP}bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int r = 0, c = (int)matrix[0].size() - 1;
    while (r < (int)matrix.size() && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] < target) r++;
        else c--;
    }
    return false;
}`,
  problems: [
    { id: 74, title: 'Search 2D Matrix', slug: 'search-a-2d-matrix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: treat as 1D array — BS on index with matrix[mid/n][mid%n].', variationCode: 'int lo=0,hi=m*n-1;while(lo<=hi){int mid=lo+(hi-lo)/2;int val=matrix[mid/n][mid%n];if(val==target)return true;else if(val<target)lo=mid+1;else hi=mid-1;}return false;' },
    { id: 240, title: 'Search 2D Matrix II', slug: 'search-a-2d-matrix-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (top-right corner elimination: O(m+n)).' },
  ],
  pitfalls: ['❌ LC 74: use 1D BS only for strictly row-major sorted matrix.', '❌ LC 240: start from top-right; decrease column or increase row (not BS).'],
  interviewTip: '💡 "Matrix search" → 74: 1D BS on flat index. 240: top-right elimination O(m+n).',
})

export const parallelBSLeaf = leaf('parallel-bs', 'Parallel Binary Search', 'teal', {
  template: `${CPP}int minDays(vector<int>& bloomDay, int m, int k) {
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
  problems: [
    { id: 1482, title: 'M Bouquets', slug: 'minimum-number-of-days-to-make-m-bouquets', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3–14: as-is (BS on day; count consecutive bloomed flowers for bouquets).' },
  ],
  pitfalls: ['❌ Not resetting flower count when a flower hasn\'t bloomed (b > day).', '❌ Overflow: m*k could exceed n, return -1 early.'],
  interviewTip: '💡 "Parallel/multi-constraint BS" → standard minimize-max pattern with compound predicate.',
})
