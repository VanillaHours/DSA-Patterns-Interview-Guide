import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <algorithm>
#include <cstdlib>
#include <queue>
#include <climits>
#include <string>
#include <sstream>
#include <map>
using namespace std;

`

// ── Comparison Sorts ──────────────────────────────────────────────

export const mergeSortLeaf = leaf('merge-sort', 'Merge-Oriented Sorting', 'blue', {
  template: `${CPP_HEADER}vector<int> mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return {};
    if (r - l == 1) return {a[l]};
    int m = l + (r - l) / 2;
    auto left = mergeSort(a, l, m);
    auto right = mergeSort(a, m, r);
    vector<int> out;
    int i = 0, j = 0;
    while (i < (int)left.size() && j < (int)right.size())
        out.push_back(left[i] < right[j] ? left[i++] : right[j++]);
    while (i < (int)left.size()) out.push_back(left[i++]);
    while (j < (int)right.size()) out.push_back(right[j++]);
    return out;
}`,
  problems: [
    { id: 912, title: 'Sort an Array', slug: 'sort-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–19: as-is (standard merge sort).' },
    { id: 148, title: 'Sort List', slug: 'sort-list', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: merge sort on linked list — find mid, sort halves, merge.', variationCode: '// see linked list leaf — same merge sort adapted for ListNode' },
    { id: 493, title: 'Reverse Pairs', slug: 'reverse-pairs', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: merge sort with count during merge — if left[i] > 2*right[j], count += mid - i.', variationCode: 'int cnt = 0; while (i <= m) { while (j <= r && (long)a[i] > 2L*a[j]) j++; cnt += j - (m+1); i++; }' },
  ],
  pitfalls: ['❌ Off-by-one on mid index — m = l + (r-l)/2 for array.', '❌ LC 493: long cast to avoid overflow when computing 2 * val.'],
  interviewTip: '💡 "Merge sort" → divide at mid, recursively sort halves, merge with two-pointer.',
})

export const quickSortLeaf = leaf('quick-sort', 'Partition-Oriented Sorting', 'teal', {
  template: `${CPP_HEADER}int partition(vector<int>& a, int l, int r) {
    int p = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] < p) swap(a[i++], a[j]);
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
    { id: 912, title: 'Sort an Array', slug: 'sort-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–15: as-is (Lomuto partition).' },
    { id: 215, title: 'Kth Largest', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: quickselect — partition, recurse on side containing k.', variationCode: 'int quickSelect(vector<int>& a, int l, int r, int k){ if(l>=r) return a[l]; int p=partition(a,l,r); int rightLen=r-p; if(k<=rightLen) return quickSelect(a,p+1,r,k); else return quickSelect(a,l,p-1,k-rightLen-1); }' },
    { id: 973, title: 'K Closest Points', slug: 'k-closest-points-to-origin', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: nth_element or quickselect by distance squared.', variationCode: 'nth_element(points.begin(), points.begin()+k, points.end(), [](auto& a,auto& b){ return a[0]*a[0]+a[1]*a[1] < b[0]*b[0]+b[1]*b[1]; });' },
  ],
  pitfalls: ['❌ Lomuto vs Hoare partition — Lomuto easier, Hoare faster with fewer swaps.', '❌ Worst-case O(n²) on sorted input — random pivot helps.'],
  interviewTip: '💡 "Quick sort/select" → partition around pivot, recurse on needed side for quickselect.',
})

export const comparatorOrderLeaf = leaf('comparator-order', 'Comparator-Driven Ordering', 'purple', {
  template: `${CPP_HEADER}string largestNumber(vector<int>& nums) {
    vector<string> s;
    for (int x : nums) s.push_back(to_string(x));
    sort(s.begin(), s.end(), [](string& a, string& b) {
        return a + b > b + a;
    });
    if (s[0] == "0") return "0";
    string out;
    for (auto& x : s) out += x;
    return out;
}`,
  problems: [
    { id: 179, title: 'Largest Number', slug: 'largest-number', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–12: as-is (custom comparator a+b > b+a).' },
    { id: 406, title: 'Queue Reconstruction', slug: 'queue-reconstruction-by-height', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: sort height DESC, k ASC; insert by k into result.', variationCode: 'sort(p.begin(),p.end(),[](auto& a,auto& b){ return a[0]!=b[0]?a[0]>b[0]:a[1]<b[1]; }); for(auto& p:people) out.insert(out.begin()+p[1],p);' },
    { id: 937, title: 'Reorder Log Files', slug: 'reorder-data-in-log-files', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: stable_sort with custom comparator — letter-logs before digit-logs.', variationCode: "stable_sort(logs.begin(),logs.end(),[](string& a,string& b){ int i=a.find(' '),j=b.find(' '); bool la=isalpha(a[i+1]),lb=isalpha(b[j+1]); if(la!=lb) return la; if(!la) return false; string sa=a.substr(i+1),sb=b.substr(j+1); if(sa!=sb) return sa<sb; return a.substr(0,i)<b.substr(0,j); });" },
  ],
  pitfalls: ['❌ LC 179: leading zero case — if first string is "0", whole number is 0.', '❌ LC 937: stable_sort required to preserve relative order of digit-logs.'],
  interviewTip: '💡 "Custom comparator" → sort with lambda; a+b > b+a for largest number; stable_sort for log files.',
})

// ── Non-Comparison Sorts ─────────────────────────────────────────

export const countingLeaf = leaf('counting', 'Counting-Based Techniques', 'green', {
  template: `${CPP_HEADER}void sortColors(vector<int>& nums) {
    int cnt[3] = {0};
    for (int x : nums) cnt[x]++;
    int i = 0;
    for (int v = 0; v < 3; v++)
        for (int j = 0; j < cnt[v]; j++)
            nums[i++] = v;
}`,
  problems: [
    { id: 75, title: 'Sort Colors', slug: 'sort-colors', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (counting sort for 3 values).' },
    { id: 451, title: 'Sort by Frequency', slug: 'sort-characters-by-frequency', companies: ['META', 'GOOGLE', 'AMAZON'], lineChanges: 'Line: freq map + bucket sort (index = count).', variationCode: 'unordered_map<char,int> f; for(char c:s) f[c]++; vector<string> buckets(s.size()+1); for(auto& [c,n]:f) buckets[n].append(n,c); string out; for i=s.size();i>=0;i--) out+=buckets[i];' },
    { id: 1122, title: 'Relative Sort', slug: 'relative-sort-array', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Line: count freq in arr1; output arr2 order, then remaining sorted.', variationCode: 'int cnt[1001]={0}; for(int x:arr1) cnt[x]++; int i=0; for(int x:arr2) while(cnt[x]-->0) arr1[i++]=x; for(x=0;x<=1000;x++) while(cnt[x]-->0) arr1[i++]=x;' },
  ],
  pitfalls: ['❌ LC 75: Dutch national flag (3-way partition) is O(1) space alternative.', '❌ LC 1122: bound of values (1000) — counting sort works for bounded ranges.'],
  interviewTip: '💡 "Counting sort" → freq array, then write back in order. O(n + range). Valid for bounded integer values.',
})

export const radixBucketLeaf = leaf('radix-bucket', 'Radix & Bucket Schemes', 'teal', {
  template: `${CPP_HEADER}int maximumGap(vector<int>& nums) {
    int n = (int)nums.size();
    if (n < 2) return 0;
    int mn = *min_element(nums.begin(),nums.end());
    int mx = *max_element(nums.begin(),nums.end());
    int bucketSize = max(1, (mx - mn) / (n - 1));
    int bucketCount = (mx - mn) / bucketSize + 1;
    vector<int> bMin(bucketCount, INT_MAX), bMax(bucketCount, INT_MIN);
    for (int x : nums) {
        int i = (x - mn) / bucketSize;
        bMin[i] = min(bMin[i], x);
        bMax[i] = max(bMax[i], x);
    }
    int ans = 0, prev = bMax[0];
    for (int i = 1; i < bucketCount; i++) {
        if (bMin[i] == INT_MAX) continue;
        ans = max(ans, bMin[i] - prev);
        prev = bMax[i];
    }
    return ans;
}`,
  problems: [
    { id: 164, title: 'Maximum Gap', slug: 'maximum-gap', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 6–20: as-is (bucket sort — min/max per bucket, then compare consecutive bucket gaps).' },
    { id: 1366, title: 'Rank Teams', slug: 'rank-teams-by-votes', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: vote matrix per team; sort by vote counts per position.', variationCode: 'vector<vector<int>> rank(26,vector<int>(27,0)); for(auto& v:votes) for i..v.size(): rank[v[i]-\'A\'][i]++, rank[v[i]-\'A\'][26]=v[i]; sort(rank.begin(),rank.end(),greater<vector<int>>()); string out; for(auto& r:rank) if(r[26]) out+=char(r[26]);' },
    { id: 2423, title: 'Remove Letter Equalize', slug: 'remove-letter-to-equalize-frequency', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: count frequencies, bucket-tune — check if removing one occurrence makes all equal.', variationCode: 'int cnt[26]={0}; for(char c:word) cnt[c-\'a\']++; unordered_map<int,int> freq; for(int i=0;i<26;i++) if(cnt[i]) freq[cnt[i]]++; // then check conditions' },
  ],
  pitfalls: ['❌ LC 164: bucket size formula — max(1, (max-min)/(n-1)) avoids empty bucket edge cases.', '❌ Bucket sort assumes uniform-ish distribution; worst case all in one bucket O(n²).'],
  interviewTip: '💡 "Bucket/radix sort" → distribute into buckets by range, compute result from bucket aggregates.',
})

// ── Partial Sorting & Selection ──────────────────────────────────

export const quickselectLeaf = leaf('quickselect', 'Quickselect & Order Statistics', 'purple', {
  template: `${CPP_HEADER}int findKthLargest(vector<int>& nums, int k) {
    nth_element(nums.begin(), nums.begin()+k-1, nums.end(), greater<int>());
    return nums[k-1];
}`,
  problems: [
    { id: 215, title: 'Kth Largest', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–5: as-is (nth_element with greater for kth largest).' },
    { id: 347, title: 'Top K Frequent', slug: 'top-k-frequent-elements', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: freq map + bucket sort or nth_element by frequency.', variationCode: 'unordered_map<int,int> f; for(int x:nums) f[x]++; vector<pair<int,int>> v(f.begin(),f.end()); nth_element(v.begin(),v.begin()+k,v.end(),[](auto& a,auto& b){ return a.second>b.second; });' },
  ],
  pitfalls: ['❌ nth_element is O(n) average but O(n²) worst — introselect fixes this.', '❌ LC 347: must pair (value, freq) for partial sort by frequency.'],
  interviewTip: '💡 "Quickselect" → partition and recurse on one side; nth_element in C++ does this directly.',
})

export const medianStreamLeaf = leaf('median-stream', 'Streaming Median Maintenance', 'pink', {
  template: `${CPP_HEADER}class MedianFinder {
    priority_queue<int> lo; // max-heap
    priority_queue<int, vector<int>, greater<int>> hi; // min-heap
public:
    void addNum(int v) {
        lo.push(v);
        hi.push(lo.top()); lo.pop();
        if (lo.size() < hi.size()) { lo.push(hi.top()); hi.pop(); }
    }
    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
    }
};`,
  problems: [
    { id: 295, title: 'Median from Stream', slug: 'find-median-from-data-stream', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (two-heap: max-heap for lower half, min-heap for upper).' },
    { id: 480, title: 'Sliding Window Median', slug: 'sliding-window-median', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: two heaps + lazy deletion (balance heaps as window slides).', variationCode: '// multiset or two heaps with delayed removal; maintain balance after each add/remove' },
  ],
  pitfalls: ['❌ LC 295: balancing — ensure lo (max-heap) is always >= hi in size.', '❌ LC 480: lazy deletion requires tracking stale entries.'],
  interviewTip: '💡 "Streaming median" → two heaps: max-heap for lower half, min-heap for upper; balance sizes.',
})

export const heapSelectLeaf = leaf('heap-select', 'Heap-Based Selection', 'orange', {
  template: `${CPP_HEADER}int kthSmallest(vector<vector<int>>& matrix, int k) {
    priority_queue<int> pq;
    for (auto& row : matrix)
        for (int x : row) {
            pq.push(x);
            if ((int)pq.size() > k) pq.pop();
        }
    return pq.top();
}`,
  problems: [
    { id: 378, title: 'Kth Smallest Sorted Matrix', slug: 'kth-smallest-element-in-a-sorted-matrix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–9: as-is (max-heap of size k).' },
    { id: 692, title: 'Top K Frequent Words', slug: 'top-k-frequent-words', companies: ['AMAZON', 'GOOGLE', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: freq map + min-heap of size k by count, then by lexicographic order.', variationCode: 'unordered_map<string,int> f; for(auto& w:words) f[w]++; auto cmp=[](auto& a,auto& b){ return a.second!=b.second?a.second>b.second:a.first<b.first; }; priority_queue pq(cmp); for(auto& [w,c]:f){ pq.push({w,c}); if(pq.size()>k) pq.pop(); }' },
  ],
  pitfalls: ['❌ LC 378: O(n² log k) — binary search O(n log max) is better for sorted matrix.', '❌ LC 692: tie-breaking — if same frequency, lexicographic order.'],
  interviewTip: '💡 "Heap selection" → min-heap or max-heap of size k; pop when over capacity.',
})

// ── Sorting as a Subroutine ───────────────────────────────────────

export const intervalLeaf = leaf('interval', 'Interval & Timeline Ordering', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> merge(vector<vector<int>>& is) {
    sort(is.begin(), is.end());
    vector<vector<int>> out;
    for (auto& i : is) {
        if (out.empty() || out.back()[1] < i[0]) out.push_back(i);
        else out.back()[1] = max(out.back()[1], i[1]);
    }
    return out;
}`,
  problems: [
    { id: 56, title: 'Merge Intervals', slug: 'merge-intervals', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (sort by start, merge overlapping).' },
    { id: 57, title: 'Insert Interval', slug: 'insert-interval', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: find insert position, merge overlapping, collect remaining.', variationCode: 'vector<vector<int>> out; int i=0,n=intervals.size(); while(i<n&&intervals[i][1]<newInterval[0]) out.push_back(intervals[i++]); while(i<n&&intervals[i][0]<=newInterval[1]){ newInterval[0]=min(newInterval[0],intervals[i][0]); newInterval[1]=max(newInterval[1],intervals[i++][1]); } out.push_back(newInterval); while(i<n) out.push_back(intervals[i++]);' },
    { id: 253, title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: sort by start; min-heap of end times; pop finished.', variationCode: 'sort(intervals.begin(),intervals.end()); priority_queue<int,vector<int>,greater<>> pq; pq.push(intervals[0][1]); for i 1..n-1{ if(pq.top()<=intervals[i][0]) pq.pop(); pq.push(intervals[i][1]); } return pq.size();' },
  ],
  pitfalls: ['❌ LC 56: not sorting first — intervals must be sorted by start.', '❌ LC 57: three phases — before overlap, merge, after overlap.'],
  interviewTip: '💡 "Intervals" → sort by start, then merge (overlap) or use heap (rooms).',
})

export const greedyAfterSortLeaf = leaf('greedy-after-sort', 'Greedy Optimization After Sort', 'amber', {
  template: `${CPP_HEADER}int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    int i = 0, j = 0;
    while (i < (int)g.size() && j < (int)s.size()) {
        if (s[j] >= g[i]) i++;
        j++;
    }
    return i;
}`,
  problems: [
    { id: 455, title: 'Assign Cookies', slug: 'assign-cookies', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (greedy: assign smallest sufficient cookie).' },
    { id: 1029, title: 'Two City Scheduling', slug: 'two-city-scheduling', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: sort by cost diff (go to A minus go to B); first half to A, second to B.', variationCode: 'sort(costs.begin(),costs.end(),[](auto& a,auto& b){ return a[0]-a[1] < b[0]-b[1]; }); int n=costs.size()/2, ans=0; for i 0..n-1: ans+=costs[i][0]+costs[i+n][1];' },
    { id: 881, title: 'Boats to Save People', slug: 'boats-to-save-people', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: sort by weight; two-pointer (lightest + heaviest ≤ limit).', variationCode: 'sort(people.begin(),people.end()); int i=0,j=people.size()-1,boats=0; while(i<=j){ if(people[i]+people[j]<=limit) i++; j--; boats++; }' },
  ],
  pitfalls: ['❌ LC 1029: sorting by difference ensures optimal assignment via exchange argument.', '❌ LC 881: two-pointer after sort — pair lightest with heaviest if possible.'],
  interviewTip: '💡 "Greedy after sort" → sort first enables greedy choice; exchange argument proves optimality.',
})

export const customSortLeaf = leaf('custom-sort', 'Custom Comparator Problems', 'teal', {
  template: `${CPP_HEADER}vector<int> sortByBits(vector<int>& arr) {
    sort(arr.begin(), arr.end(), [](int a, int b) {
        int ba = __builtin_popcount(a), bb = __builtin_popcount(b);
        return ba != bb ? ba < bb : a < b;
    });
    return arr;
}`,
  problems: [
    { id: 1356, title: 'Sort by 1 Bits', slug: 'sort-integers-by-the-number-of-1-bits', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (custom comparator: bit count, then value).' },
    { id: 791, title: 'Custom Sort String', slug: 'custom-sort-string', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: count freq of chars in s; output in order, remaining at end.', variationCode: 'int cnt[26]={0}; for(char c:s) cnt[c-\'a\']++; string out; for(char c:order) while(cnt[c-\'a\']-->0) out+=c; for c..26 while(cnt[c]-->0) out+=char(c+\'a\');' },
  ],
  pitfalls: ['❌ LC 791: must handle characters in s that are not in order — append at end.', '❌ LC 1356: __builtin_popcount is GCC/Clang; portability concern.'],
   interviewTip: '💡 "Custom sort" → lambda comparator for multi-key sorting; count + reconstruction for order-preserving.',
})

// ── Advanced Execution Models ─────────────────────────────────────

export const externalSortLeaf = leaf('external-sort', 'External Sorting Pipelines', 'slate', {
  template: `// External sort: dataset larger than RAM
// Phase 1 — Split & sort individual chunks:
//   read M records at a time, sort in memory, write to temp file.
// Phase 2 — Multi-way merge:
//   open all temp files; min-heap of (value, file idx);
//   pop smallest, write to output, push next from same file.
// Time: O(n log n)  |  Space: O(M + k) (M = chunk size, k = #files)`,
  problems: [
    { id: 0, title: 'External Sort Design', slug: '', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Not a coding problem — discuss chunk sort + k-way merge with heap.' },
  ],
  pitfalls: ['❌ Not accounting for I/O cost — random disk seeks are expensive; use buffered reads/writes.', '❌ Heap must store (value, fileIdx) to track which file to read next.'],
  interviewTip: '💡 "External sort" → chunk → sort → k-way merge with min-heap; minimize I/O with buffering.',
})

export const parallelSortLeaf = leaf('parallel-sort', 'Parallel & Distributed Sorting', 'slate', {
  template: `// Parallel / distributed sorting:
// 1. Partition data across nodes (range or hash partitioning)
// 2. Each node sorts locally (quick sort / merge sort)
// 3. Merge results (gather + merge for single output, or merge on each node)
//
// Sample sort: O(n/p log n) + O(p log p) communication
// Bitonic sort on GPU: O(log² n) parallel steps
//
// Key concerns: load balancing, network I/O, fault tolerance`,
  problems: [
    { id: 0, title: 'Parallel Sort Design', slug: '', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'System design question — discuss partitioning, local sort, merge strategy.' },
  ],
  pitfalls: ['❌ Not considering network overhead and data skew in partitioning.', '❌ Over-partitioning creates too many small chunks — merges become bottleneck.'],
  interviewTip: '💡 "Parallel sorting" → partition data, sort locally, merge; balance compute and I/O.',
})
