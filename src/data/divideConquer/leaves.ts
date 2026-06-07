import { leaf } from './helpers'

const CPP = `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <unordered_map>
using namespace std;

`

// ── Classic D&C: Sorting Leaves ──────────────────────────────────

export const mergeSortLeaf = leaf('merge-sort', 'Merge Sort', 'amber', {
  template: `${CPP}void merge(vector<int>& a, int l, int m, int r) {
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
  problems: [
    { id: 912, title: 'Sort an Array', slug: 'sort-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-17: as-is (standard merge sort O(n log n)).' },
    { id: 148, title: 'Sort List', slug: 'sort-list', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Find mid (slow/fast); split; recursively sort each half; merge two sorted lists.', variationCode: `ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode *slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* mid = slow->next; slow->next = nullptr;
    return merge(sortList(head), sortList(mid));
}` },
    { id: 315, title: 'Count of Smaller After Self', slug: 'count-of-smaller-numbers-after-self', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Merge sort with index tracking; when taking from right half, increment count for all remaining left elements.', variationCode: `void merge(vector<pair<int,int>>& a, int l, int m, int r, vector<int>& ans) {
    vector<pair<int,int>> t; int i = l, j = m + 1;
    while (i <= m && j <= r) {
        if (a[i].first <= a[j].first) { ans[a[i].second] += j - (m + 1); t.push_back(a[i++]); }
        else t.push_back(a[j++]);
    }
    while (i <= m) { ans[a[i].second] += j - (m + 1); t.push_back(a[i++]); }
    while (j <= r) t.push_back(a[j++]);
    for (int p = 0; p < (int)t.size(); p++) a[l + p] = t[p];
}` },
  ],
  pitfalls: ['Merge sort: not allocating temp array correctly.', 'Sort List: forgetting to set slow->next = nullptr to split the list.'],
  edgeCases: [{ input: 'single element', breaks: 'l >= r, return immediately' }, { input: 'already sorted', breaks: 'O(n log n) regardless' }],
  interviewTip: 'Merge sort: divide at mid, sort halves, merge sorted halves. O(n log n) stable.',
})

export const quickSortLeaf = leaf('quick-sort', 'Quick Sort', 'amber', {
  template: `${CPP}int partition(vector<int>& a, int l, int r) {
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
  problems: [
    { id: 912, title: 'Sort an Array', slug: 'sort-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-13: as-is (Lomuto partition; O(n log n) average, O(n²) worst).' },
    { id: 215, title: 'Kth Largest Element', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Quickselect: after partition, recurse only into the side containing the kth element.', variationCode: `int quickSelect(vector<int>& a, int l, int r, int k) {
    int p = partition(a, l, r);
    if (p == k) return a[p];
    return p > k ? quickSelect(a, l, p - 1, k) : quickSelect(a, p + 1, r, k);
}` },
  ],
  pitfalls: ['Lomuto partition: O(n²) on already sorted input.', 'Quickselect: confusing kth largest (n-k) vs kth smallest (k-1) index.'],
  edgeCases: [{ input: 'all equal elements', breaks: 'Lomuto partition degrades' }, { input: 'k=1 or k=n', breaks: 'one partition side is empty' }],
  interviewTip: 'Quick sort: pick pivot, partition, recurse. Quickselect: only recurse into the side with kth element.',
})

export const externalSortLeaf = leaf('external-sort', 'External Sorting', 'amber', {
  template: `${CPP}// External Sorting: sorting data too large for memory
// 1. Split large file into chunks that fit in RAM
// 2. Sort each chunk in memory (e.g., quick sort)
// 3. Multi-way merge: read sorted chunks concurrently, output smallest
// Technique: k-way merge using min-heap`,
  problems: [],
  pitfalls: ['Not all chunks the same size — need balanced division.', 'I/O bottleneck: sequential reads/writes matter more than comparison count.'],
  edgeCases: [{ input: 'data larger than disk', breaks: 'requires external storage hierarchy' }],
  interviewTip: 'External sorting: divide into memory-sized chunks, sort each, k-way merge with min-heap.',
})

// ── Classic D&C: Binary Search Leaves ────────────────────────────

export const basicBSLeaf = leaf('basic-bs', 'Basic Binary Search', 'teal', {
  template: `${CPP}int search(vector<int>& a, int t) {
    int l = 0, r = (int)a.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        if (a[m] < t) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
  problems: [
    { id: 704, title: 'Binary Search', slug: 'binary-search', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-10: as-is (standard binary search on sorted array).' },
    { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Return l (insert position) instead of -1 when not found.', variationCode: `while (l <= r) { int m = l + (r - l) / 2; if (a[m] == t) return m; if (a[m] < t) l = m + 1; else r = m - 1; } return l;` },
  ],
  pitfalls: ['Integer overflow: (l + r) / 2 instead of l + (r - l) / 2.', 'Off-by-one: while l < r vs while l <= r.'],
  edgeCases: [{ input: 'empty array', breaks: 'return -1' }, { input: 'single element', breaks: 'check mid' }],
  interviewTip: 'Binary search: halve search space each iteration. Insert position = l when loop exits with l > r.',
})

export const rotatedBSLeaf = leaf('rotated-bs', 'Rotated Array Search', 'teal', {
  template: `${CPP}int search(vector<int>& a, int t) {
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
  problems: [
    { id: 33, title: 'Search Rotated Sorted', slug: 'search-in-rotated-sorted-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-16: as-is (check which half is sorted).' },
    { id: 153, title: 'Find Minimum Rotated', slug: 'find-minimum-in-rotated-sorted-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'If a[m] < a[r], min is in left half; else right half.', variationCode: `while (l < r) { int m = l + (r - l) / 2; if (a[m] < a[r]) r = m; else l = m + 1; } return a[l];` },
  ],
  pitfalls: ['Not checking mid == target before checking sorted halves.', 'Duplicate values: a[l] == a[m] case breaks comparison.'],
  edgeCases: [{ input: 'not rotated', breaks: 'algorithm still works' }, { input: 'single element', breaks: 'return that element' }],
  interviewTip: 'Rotated search: a[l] <= a[m] determines sorted half; search there.',
})

export const matrixBSLeaf = leaf('matrix-bs', 'Matrix Binary Search', 'teal', {
  template: `${CPP}bool searchMatrix(vector<vector<int>>& a, int t) {
    int n = (int)a.size(), m = (int)a[0].size();
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
  problems: [
    { id: 74, title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-13: as-is (flatten 2D to 1D index).' },
    { id: 240, title: 'Search 2D Matrix II', slug: 'search-a-2d-matrix-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Start from top-right; if < target go down; if > target go left.', variationCode: `int i = 0, j = m - 1; while (i < n && j >= 0) { if (a[i][j] == t) return true; if (a[i][j] < t) i++; else j--; } return false;` },
  ],
  pitfalls: ['2D matrix I: flattened index = row*m + col.', '2D matrix II: only top-right works for guaranteed elimination.'],
  edgeCases: [{ input: 'single cell', breaks: 'check and return' }, { input: 'target outside range', breaks: 'returns false' }],
  interviewTip: 'Matrix search: flatten for strictly sorted (74); top-right elimination for row/col sorted (240).',
})

// ── Classic D&C: Selection Leaves ──────────────────────────────

export const quickselectLeaf = leaf('quickselect', 'Quickselect', 'lime', {
  template: `${CPP}int partition(vector<int>& a, int l, int r) {
    int p = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] <= p) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}
int findKthLargest(vector<int>& a, int k) {
    int l = 0, r = (int)a.size() - 1, target = a.size() - k;
    while (l <= r) {
        int p = partition(a, l, r);
        if (p == target) return a[p];
        if (p < target) l = p + 1;
        else r = p - 1;
    }
    return -1;
}`,
  problems: [
    { id: 215, title: 'Kth Largest Element', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-19: as-is (quickselect).' },
    { id: 973, title: 'K Closest Points', slug: 'k-closest-points-to-origin', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Partition by squared distance instead of value.', variationCode: `auto dist = [&](int i) { return points[i][0]*points[i][0]+points[i][1]*points[i][1]; };
int partition(int l, int r) { int p = dist(r), i = l; for (int j = l; j < r; j++) if (dist(j) <= p) swap(points[i++], points[j]); swap(points[i], points[r]); return i; }` },
  ],
  pitfalls: ['Kth largest: target = n - k. Kth smallest: target = k - 1.', 'Quickselect worst-case O(n²).'],
  edgeCases: [{ input: 'k = 1 (largest)', breaks: 'target = n-1' }, { input: 'k = n (smallest)', breaks: 'target = 0' }],
  interviewTip: 'Quickselect: partition then recurse into the half with kth element. O(n) average.',
})

export const medianOfMediansLeaf = leaf('median-of-medians', 'Median of Medians', 'lime', {
  template: `${CPP}// Median of Medians: worst-case O(n) selection
// 1. Divide array into groups of 5
// 2. Find median of each group (sort each 5-element group)
// 3. Recursively find median of the medians
// 4. Partition around this pivot (guarantees 30% reduction)
// 5. Recurse on appropriate side`,
  problems: [],
  pitfalls: ['Groups of 5 is minimum for 30% guarantee.', 'Over-engineered for most interviews: random quickselect is sufficient.'],
  edgeCases: [{ input: 'less than 5 elements', breaks: 'sort and pick median directly' }],
  interviewTip: 'Median of Medians: deterministic O(n) selection. Groups of 5, 30% reduction per recursion.',
})

// ── Classic D&C: Mathematical Leaves ───────────────────────────

export const intMultiplicationLeaf = leaf('int-mult', 'Integer Multiplication', 'orange', {
  template: `${CPP}// Karatsuba Multiplication: O(n^1.585)
// Multiply two n-digit numbers:
//   a = a1*B^m + a0,  b = b1*B^m + b0
//   z0 = a0*b0
//   z2 = a1*b1
//   z1 = (a1+a0)*(b1+b0) - z0 - z2
//   result = z2*B^2m + z1*B^m + z0
//
// Fast Fourier Transform: O(n log n)
// Evaluate polynomials at nth roots of unity,
// multiply pointwise, interpolate back.`,
  problems: [],
  pitfalls: ['Karatsuba: base case for small numbers is critical.', 'FFT: floating point precision issues.'],
  edgeCases: [{ input: 'different length numbers', breaks: 'pad with leading zeros' }],
  interviewTip: 'Karatsuba: 3 multiplications instead of 4. FFT: O(n log n) polynomial multiplication.',
})

export const matrixOpsLeaf = leaf('matrix-ops', 'Matrix Operations', 'orange', {
  template: `${CPP}// Strassen's Matrix Multiplication: O(n^2.807)
// Divide each n×n matrix into 4 (n/2)×(n/2) blocks
// Compute 7 products recursively, combine with additions
//
// Matrix Exponentiation: O(n^3 log k)
// Fast way to compute A^k for linear recurrences
// Used for Fibonacci (LC 509) and Climbing Stairs (LC 70):
//   [[1,1],[1,0]]^n gives F(n+1), F(n)`,
  problems: [
    { id: 509, title: 'Fibonacci Number', slug: 'fibonacci-number', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Matrix exponentiation: [[1,1],[1,0]]^n; return [0][1] entry.', variationCode: `vector<vector<long>> mul(vector<vector<long>>& a, vector<vector<long>>& b) {
    int n = a.size(); vector<vector<long>> c(n, vector<long>(n));
    for (int i = 0; i < n; i++) for (int k = 0; k < n; k++) for (int j = 0; j < n; j++) c[i][j] += a[i][k] * b[k][j];
    return c;
}` },
    { id: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Same matrix exponentiation as Fibonacci; f(1)=1, f(2)=2.', variationCode: 'matrix [[1,1],[1,0]]^(n-1); result = matrix[0][0]*1 + matrix[0][1]*1' },
  ],
  pitfalls: ['Strassen: high constant factor — only for large matrices (n > 1000).', 'Matrix exponentiation: forgetting identity matrix for power 0.'],
  edgeCases: [{ input: 'n = 0 for exponent', breaks: 'return identity matrix' }, { input: 'n = 1', breaks: 'return matrix itself' }],
  interviewTip: 'Matrix exponentiation: O(log n) for linear recurrences. Strassen: fewer multiplications, more additions.',
})

export const fastExpLeaf = leaf('fast-exp', 'Fast Exponentiation', 'orange', {
  template: `${CPP}double myPow(double x, long n) {
    if (n < 0) { x = 1 / x; n = -n; }
    double ans = 1;
    while (n) {
        if (n & 1) ans *= x;
        x *= x;
        n >>= 1;
    }
    return ans;
}`,
  problems: [
    { id: 50, title: 'Pow(x, n)', slug: 'powx-n', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-11: as-is (binary exponentiation O(log n)).' },
    { id: 372, title: 'Super Pow', slug: 'super-pow', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Recurse on large exponent array: (a^b) % m where b is an array.', variationCode: `int superPow(int a, vector<int>& b) {
    if (b.empty()) return 1;
    int last = b.back(); b.pop_back();
    int part1 = modPow(a, last, 1337);
    int part2 = modPow(superPow(a, b), 10, 1337);
    return (part1 * part2) % 1337;
}` },
  ],
  pitfalls: ['Negative exponent: INT_MIN overflow when negating.', 'Modular exponentiation: always mod after each multiplication.'],
  edgeCases: [{ input: 'x = 0, n < 0', breaks: 'division by zero' }, { input: 'n = 0', breaks: 'return 1' }],
  interviewTip: 'Binary exponentiation: square base each iteration; multiply when bit is set. O(log n).',
})

// ── Array & String D&C: Subarray Leaves ──────────────────────────

export const maxSubarrayLeaf = leaf('max-subarray', 'Maximum Subarray', 'green', {
  template: `${CPP}int maxSubArray(vector<int>& a) {
    return dc(a, 0, (int)a.size() - 1);
}
int dc(vector<int>& a, int l, int r) {
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
  problems: [
    { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-17: as-is (D&C: max of left, right, or cross mid).' },
    { id: 918, title: 'Max Sum Circular', slug: 'maximum-sum-circular-subarray', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Kadane for max + total - min subarray.', variationCode: 'int curMax=0,bestMax=INT_MIN,curMin=0,bestMin=INT_MAX,total=0; for each: curMax=max(x,curMax+x); bestMax=max(bestMax,curMax); curMin=min(x,curMin+x); bestMin=min(bestMin,curMin); total+=x; return bestMax>0?max(bestMax,total-bestMin):bestMax;' },
  ],
  pitfalls: ['D&C cross sum must include last of left half and first of right half.', 'Circular: if all negative, max is the max element.'],
  edgeCases: [{ input: 'all negative', breaks: 'returns max (least negative)' }, { input: 'single element', breaks: 'returns that element' }],
  interviewTip: 'D&C max subarray: divide at mid; combine = max(left, right, cross). Kadane is O(n) alternative.',
})

export const closestPairLeaf = leaf('closest-pair', 'Closest Pair', 'green', {
  template: `${CPP}// Closest Pair of Points (2D): O(n log n)
// 1. Sort points by x-coordinate
// 2. Divide at mid, find min distance in left and right halves
// 3. Take min of left and right distances = d
// 4. Strip: points within d of mid-line, sorted by y
// 5. For each point in strip, compare with next 7 (at most)
// 6. Return min(d, stripMin)
//
// 3Sum Closest (LC 16): sort array; fix one element, two-pointer for rest`,
  problems: [
    { id: 16, title: '3Sum Closest', slug: '3sum-closest', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Sort; for each i, two-pointer l=i+1, r=n-1; track closest sum.', variationCode: `sort(a); int best = a[0]+a[1]+a[2]; for i 0..n-3: { int l=i+1,r=n-1; while(l<r){ int s=a[i]+a[l]+a[r]; if(abs(s-t)<abs(best-t)) best=s; if(s<t) l++; else r--; } } return best;` },
  ],
  pitfalls: ['Strip comparison is O(n) not O(n²) — at most 7 points in the 2d×d rectangle.', '3Sum Closest: update best even when equal to target.'],
  edgeCases: [{ input: 'two points only', breaks: 'return the only pair distance' }],
  interviewTip: 'Closest pair: sort by x, divide, combine with strip. 3Sum Closest: sort + two-pointer O(n²).',
})

export const countingLeaf = leaf('counting-problems', 'Counting Problems', 'green', {
  template: `${CPP}int reversePairs(vector<int>& a) {
    return mergeSort(a, 0, (int)a.size() - 1);
}
int mergeSort(vector<int>& a, int l, int r) {
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
  problems: [
    { id: 315, title: 'Count Smaller After Self', slug: 'count-of-smaller-numbers-after-self', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Merge sort with (value, index) pairs; count right elements before each left.' },
    { id: 493, title: 'Reverse Pairs', slug: 'reverse-pairs', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 1-24: as-is (count i<j where a[i] > 2*a[j]).' },
    { id: 327, title: 'Count Range Sum', slug: 'count-of-range-sum', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Prefix sums + merge sort: count pairs with sum in [lower,upper].', variationCode: 'merge sort on prefix sums; for each left, find range of right sums in [lower,upper]' },
  ],
  pitfalls: ['Reverse pairs: use long for 2*a[j] overflow.', 'Range sum: prefix sums overflow int.'],
  edgeCases: [{ input: 'no reverse pairs', breaks: 'return 0' }, { input: 'all equal', breaks: 'no reverse pairs' }],
  interviewTip: 'Counting via merge sort: while merging, count right elements satisfying condition. O(n log n).',
})
// ── Array & String D&C: String Leaves ────────────────────────────

export const stringDCLeaf = leaf('string-dc', 'Divide and Conquer on Strings', 'pink', {
  template: `${CPP}// Divide and Conquer on Strings
//
// Longest Common Prefix: divide array of strings,
// find LCP of left half and right half, return common part.
//
// Longest Palindromic Substring (D&C-ish extension check):
// Expand from center — conceptually mirrors D&C tree-building.`,
  problems: [
    { id: 14, title: 'Longest Common Prefix', slug: 'longest-common-prefix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'D&C: split strings into halves; find LCP of each; return common prefix of both.', variationCode: `string dc(vector<string>& s, int l, int r) {
    if (l == r) return s[l];
    int m = l + (r - l) / 2;
    string left = dc(s, l, m), right = dc(s, m + 1, r);
    int i = 0; while (i < (int)left.size() && i < (int)right.size() && left[i] == right[i]) i++;
    return left.substr(0, i);
}` },
  ],
  pitfalls: ['D&C LCP: return empty string when no common prefix.', 'Not all string problems benefit from D&C — many are better with scanning.'],
  edgeCases: [{ input: 'empty array', breaks: 'return empty string' }, { input: 'single string', breaks: 'return that string' }],
  interviewTip: 'D&C on strings: divide list of strings, combine by common prefix between two results.',
})

// ── Tree & Graph D&C: Binary Tree Leaves ─────────────────────────

export const treeRecursionLeaf = leaf('tree-recursion', 'Binary Tree Recursion', 'purple', {
  template: `${CPP}int maxDepth(TreeNode* r) {
    if (!r) return 0;
    return 1 + max(maxDepth(r->left), maxDepth(r->right));
}
bool isBalanced(TreeNode* r) {
    return check(r) != -1;
}
int check(TreeNode* r) {
    if (!r) return 0;
    int l = check(r->left);
    if (l == -1) return -1;
    int rgt = check(r->right);
    if (rgt == -1) return -1;
    if (abs(l - rgt) > 1) return -1;
    return 1 + max(l, rgt);
}`,
  problems: [
    { id: 104, title: 'Max Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-4: as-is (D&C: divide into left and right subtrees).' },
    { id: 110, title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5-15: as-is (check height diff; return -1 if unbalanced).' },
    { id: 543, title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Post-order: max depth of left + max depth of right at each node.', variationCode: `int dia = 0;
int dfs(TreeNode* r) { if (!r) return 0; int l = dfs(r->left), rgt = dfs(r->right); dia = max(dia, l + rgt); return 1 + max(l, rgt); }` },
    { id: 226, title: 'Invert Binary Tree', slug: 'invert-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Divide: invert left and right subtrees; combine: swap them.', variationCode: `if (!r) return nullptr; swap(r->left, r->right); invertTree(r->left); invertTree(r->right); return r;` },
  ],
  pitfalls: ['Diameter: not necessarily through root — need to track max at each node.', 'Balanced: compute height and check balance in same traversal.'],
  edgeCases: [{ input: 'empty tree', breaks: 'return 0/nullptr' }, { input: 'single node', breaks: 'height 0, diameter 0, balanced' }],
  interviewTip: 'Divide and conquer on trees: solve for left and right subtrees, combine results at root. Post-order is most natural.',
})

// ── Tree & Graph D&C: BST Leaves ─────────────────────────────────

export const bstDCLeaf = leaf('bst-dc', 'BST Divide and Conquer', 'purple', {
  template: `${CPP}TreeNode* sortedArrayToBST(vector<int>& a, int l, int r) {
    if (l > r) return nullptr;
    int m = l + (r - l) / 2;
    TreeNode* root = new TreeNode(a[m]);
    root->left = sortedArrayToBST(a, l, m - 1);
    root->right = sortedArrayToBST(a, m + 1, r);
    return root;
}
TreeNode* buildTree(vector<int>& pre, int& idx, int bound) {
    if (idx >= (int)pre.size() || pre[idx] > bound) return nullptr;
    TreeNode* r = new TreeNode(pre[idx++]);
    r->left = buildTree(pre, idx, r->val);
    r->right = buildTree(pre, idx, bound);
    return r;
}`,
  problems: [
    { id: 108, title: 'Sorted Array to BST', slug: 'convert-sorted-array-to-binary-search-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-9: as-is (pick mid as root, recursively build left and right).' },
    { id: 1008, title: 'BST from Preorder', slug: 'construct-binary-search-tree-from-preorder-traversal', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 10-17: as-is (uses bound to enforce BST property).' },
  ],
  pitfalls: ['Sorted Array to BST: root is mid of current range.', 'BST from Preorder: using bound eliminates need for sort/range search.'],
  edgeCases: [{ input: 'empty array', breaks: 'return nullptr' }, { input: 'single element', breaks: 'return single node' }],
  interviewTip: 'BST D&C: recursively pick mid element for balanced tree; use bound for preorder build.',
})

// ── Tree & Graph D&C: Segment Tree Leaves ────────────────────────

export const segTreeBasicsLeaf = leaf('seg-tree-basics', 'Segment Tree — Basics', 'purple', {
  template: `${CPP}class SegTree {
    vector<int> t; int n;
public:
    SegTree(vector<int>& a) : n(a.size()) {
        t.resize(4 * n);
        build(a, 1, 0, n - 1);
    }
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
  problems: [
    { id: 307, title: 'Range Sum Query', slug: 'range-sum-query-mutable', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-31: as-is (segment tree for range sum with point updates).' },
    { id: 303, title: 'Range Sum Query Immutable', slug: 'range-sum-query-immutable', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Use prefix sum instead; simpler but no point updates.', variationCode: 'vector<int> p; NumArray(vector<int>& a): p(a.size()+1,0){ for i=0..n-1: p[i+1]=p[i]+a[i]; } int sumRange(int l,int r){ return p[r+1]-p[l]; }' },
  ],
  pitfalls: ['Segment tree array must be 4×n size.', 'Query: return 0/element for out of range vs full overlap.'],
  edgeCases: [{ input: 'n=0', breaks: 'handle empty array' }, { input: 'single element', breaks: 'leaf node only' }],
  interviewTip: 'Segment tree: build recursively, query by splitting interval, update by leaf path. 4n space, O(log n) ops.',
})

export const segTreeAdvancedLeaf = leaf('seg-tree-advanced', 'Segment Tree — Advanced', 'purple', {
  template: `${CPP}class SegTreeLazy {
    vector<int> t, lazy; int n;
public:
    SegTreeLazy(vector<int>& a) : n(a.size()) {
        t.resize(4 * n); lazy.resize(4 * n, 0);
        build(a, 1, 0, n - 1);
    }
    void build(vector<int>& a, int v, int l, int r) {
        if (l == r) { t[v] = a[l]; return; }
        int m = l + (r - l) / 2;
        build(a, 2*v, l, m);
        build(a, 2*v+1, m+1, r);
        t[v] = t[2*v] + t[2*v+1];
    }
    void push(int v, int l, int r) {
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
    }
    int query(int v, int l, int r, int ql, int qr) {
        push(v, l, r);
        if (ql > r || qr < l) return 0;
        if (ql <= l && r <= qr) return t[v];
        int m = l + (r - l) / 2;
        return query(2*v, l, m, ql, qr) + query(2*v+1, m+1, r, ql, qr);
    }
};`,
  problems: [
    { id: 370, title: 'Range Addition', slug: 'range-addition', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line 31-34: range update with val. Difference array simpler for this.', variationCode: 'vector<int> d(n,0); for each: d[l]+=val; if(r+1<n) d[r+1]-=val; partial_sum for result.' },
    { id: 731, title: 'My Calendar II', slug: 'my-calendar-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line 31-34: range update by +1; query max in range < 3.', variationCode: 'segment tree with max query and range add updates' },
  ],
  pitfalls: ['Lazy propagation: push before recursing to children.', 'Range sum lazy: t[v] += lazy * (r-l+1), NOT just lazy.'],
  edgeCases: [{ input: 'n=0', breaks: 'handle empty array' }, { input: 'out-of-order updates', breaks: 'lazy ensures correctness' }],
  interviewTip: 'Lazy segment tree: defer range updates to children until needed. O(log n) for both update and query.',
})

export const mergeSortTreeLeaf = leaf('merge-sort-tree', 'Merge Sort Tree', 'purple', {
  template: `${CPP}// Merge Sort Tree: each segment tree node stores
// a sorted vector of its range elements
// Used for range queries like "count elements <= k in [l, r]"
//
// Build: merge sorted vectors from children (like merge sort)
// Query: O(log² n) — binary search on O(log n) nodes
//
// Alternate: Fenwick Tree of order-statistic trees (PBDS)`,
  problems: [
    { id: 315, title: 'Count Smaller After Self', slug: 'count-of-smaller-numbers-after-self', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Merge sort tree: query right half for counts; or use merge sort (D&C) approach.' },
  ],
  pitfalls: ['Merge sort tree: O(n log n) build + O(log² n) query.', 'Space: O(n log n).'],
  edgeCases: [{ input: 'n=0', breaks: 'empty tree' }],
  interviewTip: 'Merge sort tree: segment tree where each node stores sorted subarray. Good for range counting queries.',
})

// ── Tree & Graph D&C: Advanced D&C on Trees ─────────────────────

export const centroidDecompLeaf = leaf('centroid-decomp', 'Centroid Decomposition', 'purple', {
  template: `${CPP}// Centroid Decomposition of a Tree: O(n log n)
// 1. Find centroid (node whose removal splits into ≤ n/2 subtrees)
// 2. Make centroid the root of current decomposition
// 3. Remove centroid, recurse on each remaining subtree
//
// Used for: tree distance queries, path counting problems
// Each path in the original tree is counted exactly once
// by processing through the centroid that first splits it`,
  problems: [],
  pitfalls: ['Centroid: find subtree sizes first (DFS), then find centroid.', 'Recursion depth: O(log n) levels.'],
  edgeCases: [{ input: 'single node', breaks: 'node is its own centroid' }],
  interviewTip: 'Centroid decomposition: recursively find centroid, remove, recurse on components. O(n log n) for path queries.',
})

export const treeDPLeaf = leaf('tree-dp', 'D&C on Trees (Tree DP)', 'purple', {
  template: `${CPP}// Tree DP via Divide and Conquer
//
// House Robber III: for each node, return {rob, notRob}
//   rob = node->val + notRob(left) + notRob(right)
//   notRob = max(rob(left), notRob(left)) + max(rob(right), notRob(right))
//
// Binary Tree Cameras: return state for each subtree
//   0 = covered, 1 = has camera, 2 = not covered
//
// Binary Tree Maximum Path Sum:
//   max path = max(leftGain, 0) + node->val + max(rightGain, 0)`,
  problems: [
    { id: 124, title: 'Max Path Sum', slug: 'binary-tree-maximum-path-sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Post-order: compute max gain from left and right subtrees; update answer.', variationCode: `int ans = INT_MIN;
int dfs(TreeNode* r) { if (!r) return 0; int l = max(0, dfs(r->left)), rgt = max(0, dfs(r->right)); ans = max(ans, l + r->val + rgt); return r->val + max(l, rgt); }` },
    { id: 337, title: 'House Robber III', slug: 'house-robber-iii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Return pair {rob, notRob} from recursion; combine at parent.', variationCode: `pair<int,int> dfs(TreeNode* r) { if(!r) return {0,0}; auto l=dfs(r->left), rgt=dfs(r->right); return {r->val+l.second+rgt.second, max(l.first,l.second)+max(rgt.first,rgt.second)}; }` },
    { id: 968, title: 'Binary Tree Cameras', slug: 'binary-tree-cameras', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Post-order: 0=covered, 1=camera, 2=not covered; count cameras when 2.', variationCode: `int cams = 0;
int dfs(TreeNode* r) { if (!r) return 0; int l=dfs(r->left), rgt=dfs(r->right); if (l==2 || rgt==2) { cams++; return 1; } return l==1 || rgt==1 ? 0 : 2; }` },
  ],
  pitfalls: ['Max Path Sum: max(0, gain) to allow paths that start/end at any node.', 'Tree DP: combine child states carefully based on problem semantics.'],
  edgeCases: [{ input: 'single node', breaks: 'return node value / state' }, { input: 'all negative', breaks: 'max path sum picks least negative' }],
  interviewTip: 'Tree DP: post-order D&C; return computed state from each subtree; combine at parent. O(n).',
})

// ── String Manipulation (NEW) ─────────────────────────────────────

export const stringMatchingLeaf = leaf('string-matching', 'String Matching (Rabin-Karp)', 'pink', {
  template: `${CPP}// Rabin-Karp with D&C: divide text, search pattern in halves, combine
// Rolling hash: hash(text[l..r]) = hash(text[l..r-1])*base + text[r]
// O(n+m) average, O(nm) worst
//
// String Matching with D&C:
// 1. Divide text into halves
// 2. Search pattern in left half
// 3. Search pattern in right half (shifted by mid)
// 4. Combine: pattern crossing the mid boundary
// More conceptual: usually KMP or rolling hash is preferred`,
  problems: [],
  pitfalls: ['Rolling hash modulo collisions.', 'D&C for string matching is mostly conceptual — KMP/built-in find is practical.'],
  edgeCases: [{ input: 'empty text or pattern', breaks: 'return 0 or -1' }],
  interviewTip: 'String matching D&C: divide text, search in halves, handle cross-mid pattern. Rolling hash O(n+m).',
})

export const palindromeDcLeaf = leaf('palindrome-dc', 'Palindrome Problems', 'pink', {
  template: `${CPP}int countSubstrings(string s) {
    int n = s.size(), ans = 0;
    for (int i = 0; i < n; i++) {
        ans += expand(s, i, i);     // odd length
        ans += expand(s, i, i + 1); // even length
    }
    return ans;
}
int expand(string& s, int l, int r) {
    int cnt = 0;
    while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; cnt++; }
    return cnt;
}`,
  problems: [
    { id: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Expand from center; track max length substring.', variationCode: `int start=0, maxLen=0; for (int i=0;i<n;i++){ auto [l1,r1]=expand(s,i,i); auto [l2,r2]=expand(s,i,i+1); /* update start&maxLen */ } return s.substr(start,maxLen);` },
    { id: 647, title: 'Palindromic Substrings', slug: 'palindromic-substrings', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-12: as-is (count all palindromes via center expansion).' },
  ],
  pitfalls: ['Center expansion: O(n²) time, O(1) space.', 'D&C: split string, check palindrome in halves, combine cross-mid.'],
  edgeCases: [{ input: 'single character', breaks: 'odd expansion handles it' }, { input: 'empty string', breaks: 'return 0' }],
  interviewTip: 'Palindrome: expand from center O(n²). D&C approach: divide string, combine cross-mid palindromes.',
})

// ── Range Query Problems (NEW) ────────────────────────────────────

export const binaryIndexedTreeLeaf = leaf('binary-indexed-tree', 'Binary Indexed Tree (Fenwick)', 'teal', {
  template: `${CPP}class BIT {
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
}`,
  problems: [
    { id: 315, title: 'Count Smaller After Self', slug: 'count-of-smaller-numbers-after-self', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Coordinate compress nums; traverse right-to-left: query count of smaller, then add current.', variationCode: `vector<int> ans(n); for (int i=n-1;i>=0;i--){ ans[i]=bit.sum(comp[nums[i]]-1); bit.add(comp[nums[i]],1); }` },
  ],
  pitfalls: ['BIT is 1-indexed internally.', 'Coordinate compression required for large values.'],
  edgeCases: [{ input: 'empty array', breaks: 'return empty' }, { input: 'all equal', breaks: 'all counts are 0' }],
  interviewTip: 'BIT: O(log n) point update + prefix sum. Useful for counting inversions/reverse pairs.',
})

// ── Computational Geometry (NEW) ──────────────────────────────────

export const convexHullLeaf = leaf('convex-hull', 'Convex Hull (Graham Scan)', 'green', {
  template: `${CPP}// Convex Hull via D&C (Merge Hull):
// 1. Sort points by x-coordinate
// 2. Divide into left and right halves
// 3. Recursively find hull of each half
// 4. Merge: find upper and lower tangents
// O(n log n)
//
// Graham Scan (non-D&C): sort by polar angle, O(n log n)
// Monotone Chain: Andrew's algorithm, sort by x then y`,
  problems: [],
  pitfalls: ['Collinear points on hull edges — may need to include/exclude based on requirements.', 'Divide and conquer hull: finding tangents is O(n) per merge.'],
  edgeCases: [{ input: '3 or fewer points', breaks: 'hull = all points' }, { input: 'all collinear', breaks: 'hull is line segment' }],
  interviewTip: 'Convex Hull: Andrew\'s monotone chain (sort by x,y) is simpler than D&C merge hull for interviews.',
})

export const geometricIntersectionsLeaf = leaf('geometric-intersections', 'Geometric Intersections', 'green', {
  template: `${CPP}// Line Segment Intersection via D&C (Sweep Line):
// 1. Sort endpoints by x-coordinate
// 2. Divide set at median x
// 3. Recursively find intersections in left and right halves
// 4. Combine: find intersections crossing the dividing line
// Use plane sweep for O((n+k) log n) where k = intersections`,
  problems: [],
  pitfalls: ['Finding cross-mid intersections requires sweep line.', 'Vertical lines need special handling.'],
  edgeCases: [{ input: 'parallel lines', breaks: 'no intersection' }, { input: 'overlapping segments', breaks: 'infinite intersection points' }],
  interviewTip: 'Geometric intersections: plane sweep is more practical than D&C. Bentley-Ottmann O((n+k) log n).',
})

// ── Tree Construction (NEW) ───────────────────────────────────────

export const treeConstructionLeaf = leaf('tree-construction', 'Tree Construction from Traversals', 'purple', {
  template: `${CPP}TreeNode* build(vector<int>& pre, int& idx, int l, int r, unordered_map<int,int>& inMap) {
    if (l > r) return nullptr;
    int val = pre[idx++];
    TreeNode* root = new TreeNode(val);
    int pos = inMap[val];
    root->left = build(pre, idx, l, pos - 1, inMap);
    root->right = build(pre, idx, pos + 1, r, inMap);
    return root;
}`,
  problems: [
    { id: 105, title: 'Build from Preorder & Inorder', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-10: as-is (pre[0]=root, find in inorder, recurse left and right subranges).' },
    { id: 106, title: 'Build from Inorder & Postorder', slug: 'construct-binary-tree-from-inorder-and-postorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Postorder last element is root; recurse right then left.', variationCode: `TreeNode* build(vector<int>& post, int& idx, int l, int r, auto& inMap) {
    if (l > r) return nullptr;
    int val = post[idx--];
    TreeNode* root = new TreeNode(val);
    int pos = inMap[val];
    root->right = build(post, idx, pos + 1, r, inMap);
    root->left = build(post, idx, l, pos - 1, inMap);
    return root;
}` },
    { id: 889, title: 'Build from Preorder & Postorder', slug: 'construct-binary-tree-from-preorder-and-postorder-traversal', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Pre[0]=root; next element pre[1] is left child root; find in postorder to split.', variationCode: `TreeNode* build(vector<int>& pre, vector<int>& post) {
    if (pre.empty()) return nullptr;
    TreeNode* r = new TreeNode(pre[0]);
    if (pre.size() == 1) return r;
    int L = pre[1], idx = find(post.begin(), post.end(), L) - post.begin() + 1;
    r->left = {pre[1..idx]}, r->right = {pre[idx..]};
}` },
  ],
  pitfalls: ['105/106: build map from value to inorder index for O(1) lookup.', '889: pre[1] is left child root — find split point in post.'],
  edgeCases: [{ input: 'single node', breaks: 'return that node' }, { input: 'empty traversals', breaks: 'return nullptr' }],
  interviewTip: 'Tree construction: first element of preorder (or last of postorder) is root. Split inorder at root index.',
})

// ── Lowest Common Ancestor (NEW) ─────────────────────────────────

export const lcaLeaf = leaf('lca', 'Lowest Common Ancestor', 'purple', {
  template: `${CPP}TreeNode* lca(TreeNode* r, TreeNode* p, TreeNode* q) {
    if (!r || r == p || r == q) return r;
    auto* left = lca(r->left, p, q);
    auto* rgt = lca(r->right, p, q);
    if (left && rgt) return r;
    return left ? left : rgt;
}`,
  problems: [
    { id: 236, title: 'LCA of Binary Tree', slug: 'lowest-common-ancestor-of-a-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-7: as-is (post-order: if both children return non-null, current is LCA).' },
    { id: 1644, title: 'LCA II (with parent pointers)', slug: 'lowest-common-ancestor-of-a-binary-tree-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Nodes may not exist; track found count; if not both found return null.', variationCode: `TreeNode* lca(TreeNode* r, TreeNode* p, TreeNode* q, int& cnt) {
    if (!r) return nullptr;
    auto* l = lca(r->left, p, q, cnt);
    auto* rt = lca(r->right, p, q, cnt);
    if (r == p || r == q) { cnt++; return r; }
    return l && rt ? r : (l ? l : rt);
}` },
  ],
  pitfalls: ['236: assumes both nodes exist in tree.', '1644: nodes might be missing — track count and return null if not both found.'],
  edgeCases: [{ input: 'p == q', breaks: 'return p/q' }, { input: 'p is ancestor of q', breaks: 'return p at first match' }],
  interviewTip: 'LCA: post-order D&C. If both sides find a node, current is LCA. Otherwise return the non-null side.',
})

// ── Tree Property (NEW) ──────────────────────────────────────────

export const treePropertyAdvancedLeaf = leaf('tree-property-advanced', 'Advanced Tree Properties', 'purple', {
  template: `${CPP}struct Info { bool isBST; int sz, mn, mx, sum; };
Info dfs(TreeNode* r, int& best) {
    if (!r) return {true, 0, INT_MAX, INT_MIN, 0};
    auto l = dfs(r->left, best), rt = dfs(r->right, best);
    if (l.isBST && rt.isBST && l.mx < r->val && r->val < rt.mn) {
        int sz = 1 + l.sz + rt.sz;
        int sum = r->val + l.sum + rt.sum;
        best = max(best, sum);
        return {true, sz, min(l.mn, r->val), max(rt.mx, r->val), sum};
    }
    return {false, 0, 0, 0, 0};
}`,
  problems: [
    { id: 1373, title: 'Max Sum BST', slug: 'maximum-sum-bst-in-binary-tree', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-14: as-is (post-order: track isBST, min, max, sum; update best when valid BST).' },
  ],
  pitfalls: ['Empty child handling: null returns {true, 0, INT_MAX, INT_MIN, 0}.', 'Min/max from null must be opposite extremes for parent comparison.'],
  edgeCases: [{ input: 'single node', breaks: 'isBST=true, sum=val' }, { input: 'all negative', breaks: 'BST with negative max sum' }],
  interviewTip: 'Post-order D&C: return isBST, min, max, sum from each subtree; combine at root.',
})

// ── Graph Algorithms (NEW) ───────────────────────────────────────

export const graphConnectivityLeaf = leaf('graph-connectivity', 'Graph Connectivity (Bridges & Articulation)', 'purple', {
  template: `${CPP}void dfs(int u, int p, vector<int>& tin, vector<int>& low, int& timer, vector<vector<int>>& g, vector<vector<int>>& bridges) {
    tin[u] = low[u] = ++timer;
    for (int v : g[u]) {
        if (v == p) continue;
        if (tin[v]) { low[u] = min(low[u], tin[v]); continue; }
        dfs(v, u, tin, low, timer, g, bridges);
        low[u] = min(low[u], low[v]);
        if (low[v] > tin[u]) bridges.push_back({u, v}); // bridge
    }
}`,
  problems: [],
  pitfalls: ['Bridge condition: low[v] > tin[u] (strictly greater).', 'Articulation point: root with 2+ children OR tin[u] <= low[v] for non-root.'],
  edgeCases: [{ input: 'disconnected graph', breaks: 'DFS each component' }, { input: 'single node', breaks: 'no bridges' }],
  interviewTip: 'Tarjan: tin (discovery time) + low (lowest reachable). Bridge = low[child] > tin[node].',
})

export const shortestPathJohnsonLeaf = leaf('shortest-path-johnson', 'Shortest Path (Johnson\'s Algorithm)', 'purple', {
  template: `${CPP}// Johnson's Algorithm: All-Pairs Shortest Path on sparse graphs
// 1. Add a new source vertex q with 0-weight edges to all vertices
// 2. Run Bellman-Ford from q to detect negative cycles → h[v] = δ(q, v)
// 3. Reweight edges: w'(u,v) = w(u,v) + h[u] - h[v]
// 4. Run Dijkstra from each vertex using reweighted edges
// 5. Convert distances back: d(u,v) = d'(u,v) - h[u] + h[v]
// O(V^2 log V + VE) — better than Floyd-Warshall for sparse graphs`,
  problems: [],
  pitfalls: ['Bellman-Ford step must detect negative cycles.', 'Reweighting must preserve shortest paths (non-negative weights for Dijkstra).'],
  edgeCases: [{ input: 'negative cycle', breaks: 'Bellman-Ford detects; algorithm stops' }, { input: 'all non-negative', breaks: 'just run Dijkstra from each vertex' }],
  interviewTip: 'Johnson\'s: Bellman-Ford to reweight, then Dijkstra per vertex. O(V^2 log V + VE) for all-pairs.',
})

export const dcDpOptimizationLeaf = leaf('dc-dp-optimization', 'D&C DP Optimization', 'purple', {
  template: `${CPP}// Divide and Conquer DP Optimization
// Condition: DP transition opt[i][j] = min over k (dp[i-1][k] + cost(k, j))
// where opt[i][j] is monotonic in j (opt[i][j] <= opt[i][j+1])
//
// Divide(l, r, optL, optR): compute dp[i][mid], recurse left and right
// void solve(int i, int l, int r, int optL, int optR) {
//     if (l > r) return;
//     int mid = l + (r - l) / 2;
//     int bestK = optL, bestVal = INF;
//     for (int k = optL; k <= min(mid, optR); k++)
//         if (dp[i-1][k] + cost(k, mid) < bestVal) bestVal = ..., bestK = k;
//     dp[i][mid] = bestVal;
//     solve(i, l, mid - 1, optL, bestK);
//     solve(i, mid + 1, r, bestK, optR);
// }`,
  problems: [
    { id: 1335, title: 'Min Difficulty Job Schedule', slug: 'minimum-difficulty-of-a-job-schedule', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'D&C DP opt: dp[d][i] = min_{j< i} dp[d-1][j] + max(j+1..i); monotonic opt for each d.', variationCode: `for each d: solve(dp, d, 0, n-1, 0, n-1); // D&C DP optimization` },
  ],
  pitfalls: ['Monotonicity of opt must hold for D&C DP optimization to be valid.', 'D&C DP is O(kn log n) vs O(kn²) naive.'],
  edgeCases: [{ input: 'more days than jobs', breaks: 'return -1' }],
  interviewTip: 'D&C DP opt: when opt[i][j] is monotonic in j, use divide-and-conquer to reduce O(kn²) to O(kn log n).',
})

// ── D&C in Parallel Computing (NEW) ───────────────────────────────

export const mapReduceLeaf = leaf('map-reduce', 'Map-Reduce Paradigm', 'amber', {
  template: `${CPP}// Map-Reduce with D&C:
// Map Phase: split data into chunks, process each independently (map function)
// Shuffle Phase: group intermediate results by key
// Reduce Phase: combine grouped results (reduce function)
//
// D&C connection: map = divide + solve, reduce = combine
// Embarrassingly parallel when subproblems are truly independent`,
  problems: [],
  pitfalls: ['Straggler tasks: slow map/reduce slows entire job.', 'Data skew: some keys dominate reducing phase.'],
  edgeCases: [{ input: 'empty dataset', breaks: 'no map/reduce needed' }],
  interviewTip: 'Map-Reduce: map = parallel D&C on chunks, reduce = combine results by key. O(N/P + shuffle) with P processors.',
})

export const parallelSortingLeaf = leaf('parallel-sorting', 'Parallel Sorting', 'amber', {
  template: `${CPP}// Parallel Merge Sort:
// 1. Divide array into P chunks
// 2. Sort each chunk in parallel (std::sort / quick sort)
// 3. Multi-way merge sorted chunks
// O((n log n)/P + n) with P processors
//
// Parallel Quick Sort:
// 1. Pick pivot, partition in parallel
// 2. Recurse on left and right partitions in parallel
// O((n log n)/P + n) average-case`,
  problems: [],
  pitfalls: ['Amdahl\'s law: serial merge/partition limits speedup.', 'Load imbalance: uneven partition sizes waste parallelism.'],
  edgeCases: [{ input: 'single processor', breaks: 'degenerates to sequential sort' }],
  interviewTip: 'Parallel sorting: divide among processors, sort independently, merge results. Speedup limited by merge step.',
})
