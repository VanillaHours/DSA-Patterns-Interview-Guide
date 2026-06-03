import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'merge-sort': e({
    xray: [
      { text: '**Sort** an array of integers', kind: 'goal' },
      { text: '**Sort** a linked list in O(n log n)', kind: 'goal' },
      { text: 'Count **reverse pairs** i<j and nums[i] > 2*nums[j]', kind: 'goal' },
    ],
    budget: ['mergeSort', 'oNLogN'],
    slottedTemplate: `int m = l + (r - l) / 2;
auto left = mergeSort(a, l, m);
auto right = mergeSort(a, m, r);
vector<int> out;
int i = 0, j = 0;
while (i < left.size() && j < right.size())
    out.push_back(left[i] < right[j] ? left[i++] : right[j++]);
while (i < left.size()) out.push_back(left[i++]);
while (j < right.size()) out.push_back(right[j++]);
return out;`,
    slots: [],
    slotFills: { 912: {}, 148: {}, 493: {} },
    helixDelta: { 912: 'Basic merge sort for arrays', 148: 'Merge sort adapted for linked list (mid + merge)', 493: 'Count inversions in merge step with 2* check' },
    autopsies: [
      {
        cause: 'Off-by-one in mid calculation for even-length',
        wrong: 'int m = (l+r)/2; // potential overflow for large arrays',
        testCase: 'l=0, r=n',
        fix: 'int m = l + (r - l) / 2; // no overflow, correct even/odd',
      },
    ],
    sayIt: ['Merge sort: divide at mid, recursively sort halves, merge with two-pointer.'],
  }),

  'quick-sort': e({
    xray: [
      { text: '**Sort** an array using partition', kind: 'goal' },
      { text: 'Find **kth largest** element via quickselect', kind: 'goal' },
      { text: 'Find **k closest** points to origin', kind: 'goal' },
    ],
    budget: ['quickSort', 'quickSelect', 'inPlace'],
    slottedTemplate: `int partition(vector<int>& a, int l, int r) {
    int p = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] < p) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}`,
    slots: [],
    slotFills: { 912: {}, 215: {}, 973: {} },
    helixDelta: { 912: 'Full quicksort via Lomuto partition', 215: 'Quickselect — partition + recurse one side', 973: 'nth_element by distance squared' },
    autopsies: [
      {
        cause: 'Lomuto partition degrades on already sorted input',
        wrong: 'always picking last element as pivot',
        testCase: 'sorted array of 10^5 elements',
        fix: 'Random pivot: swap(a[r], a[l + rand() % (r-l+1)]) before partition',
      },
    ],
    sayIt: ['Quick sort: partition around pivot (Lomuto/Hoare), recurse halves.', 'Quickselect: partition + recurse only the side containing k.'],
  }),

  'comparator-order': e({
    xray: [
      { text: 'Arrange numbers to form **largest concatenated number**', kind: 'goal' },
      { text: '**Reconstruct queue** by height and k', kind: 'goal' },
      { text: '**Reorder log files** — letter before digit', kind: 'goal' },
    ],
    budget: ['customComparator', 'stable'],
    slottedTemplate: `sort(v.begin(), v.end(), [](auto& a, auto& b) {
    return {{COMPARATOR_EXPR}};
});`,
    slots: [
      { id: 'COMPARATOR_EXPR', label: 'Comparator expression' },
    ],
    slotFills: {
      179: { COMPARATOR_EXPR: 'a + b > b + a' },
      406: { COMPARATOR_EXPR: 'a[0] != b[0] ? a[0] > b[0] : a[1] < b[1]' },
    },
    helixDelta: { 179: 'a+b > b+a for largest concatenation', 406: 'Height DESC, k ASC for queue reconstruction', 937: 'stable_sort with letter vs digit check' },
    autopsies: [
      {
        cause: 'LC 937: using sort instead of stable_sort',
        wrong: 'sort(logs.begin(), ...) // relative order of digit-logs lost',
        testCase: 'digit logs with same input order',
        fix: 'Use stable_sort (or ensure comparator never returns true for equal elements)',
      },
    ],
    sayIt: ['Custom comparator: lambda that defines ordering. stable_sort preserves relative order.'],
  }),

  counting: e({
    xray: [
      { text: '**Sort colors** (0, 1, 2 only) in-place', kind: 'goal' },
      { text: '**Sort characters** by descending frequency', kind: 'goal' },
      { text: '**Relative sort** array1 by order of array2', kind: 'goal' },
    ],
    budget: ['countingSort', 'oN'],
    slottedTemplate: `int cnt[{{RANGE}}] = {0};
for ({{TYPE}} x : nums) cnt[x]++;
int i = 0;
for (int v = 0; v < {{RANGE}}; v++)
    while (cnt[v]-- > 0) nums[i++] = v;`,
    slots: [
      { id: 'RANGE', label: 'Value range' },
      { id: 'TYPE', label: 'Element type' },
    ],
    slotFills: {
      75: { RANGE: '3', TYPE: 'int' },
      1122: { RANGE: '1001', TYPE: 'int' },
    },
    helixDelta: { 75: '3-value counting (Dutch flag variant)', 451: 'Bucket by freq count index', 1122: 'Count + output in arr2 order + remaining sorted' },
    autopsies: [
      {
        cause: 'Counting sort on non-integer or unbounded values',
        wrong: 'int cnt[INT_MAX]; // not possible',
        testCase: 'range too large',
        fix: 'Counting sort is only valid for bounded integer ranges. Use comparison sort for general data.',
      },
    ],
    sayIt: ['Counting sort: freq array, write back in order. O(n + range). Valid for bounded values.'],
  }),

  'radix-bucket': e({
    xray: [
      { text: 'Find **maximum gap** between consecutive sorted elements in O(n)', kind: 'goal' },
      { text: '**Rank teams** by votes (position-based matrix)', kind: 'goal' },
    ],
    budget: ['radixSort', 'oN'],
    slottedTemplate: `int bucketSize = max(1, (mx - mn) / (n - 1));
int bucketCount = (mx - mn) / bucketSize + 1;
vector<int> bMin(bucketCount, INT_MAX);
vector<int> bMax(bucketCount, INT_MIN);
for (int x : nums) {
    int i = (x - mn) / bucketSize;
    bMin[i] = min(bMin[i], x);
    bMax[i] = max(bMax[i], x);
}`,
    slots: [],
    slotFills: { 164: {}, 1366: {}, 2423: {} },
    helixDelta: { 164: 'Bucket min/max per range, compare consecutive bucket gaps', 1366: 'Vote matrix per position, sort by positional votes', 2423: 'Freq bucket-tune — check equalling after one removal' },
    autopsies: [
      {
        cause: 'LC 164: empty bucket causes incorrect gap calculation',
        wrong: 'compare bucket i max to bucket i+1 min without checking if bucket i+1 is empty',
        testCase: 'large gap spans empty buckets',
        fix: 'Skip empty buckets: if (bMin[i] == INT_MAX) continue;',
      },
    ],
    sayIt: ['Bucket sort: distribute into buckets by range, compute from bucket aggregates.', 'Skip empty buckets when computing gaps.'],
  }),

  quickselect: e({
    xray: [
      { text: 'Find **kth largest** element in unsorted array', kind: 'goal' },
      { text: 'Find **top k frequent** elements', kind: 'goal' },
    ],
    budget: ['quickSelect', 'partialSort'],
    slottedTemplate: `nth_element(nums.begin(), nums.begin() + k - 1, nums.end(){{COMPARATOR}});
return nums[k - 1];`,
    slots: [
      { id: 'COMPARATOR', label: 'Comparator (optional)' },
    ],
    slotFills: {
      215: { COMPARATOR: ', greater<int>()' },
    },
    helixDelta: { 215: 'nth_element with greater for kth largest', 347: 'nth_element on (freq, value) pairs' },
    autopsies: [
      {
        cause: 'Using full sort instead of quickselect',
        wrong: 'sort(nums.begin(), nums.end(), greater<>()); return nums[k-1]; // O(n log n)',
        testCase: 'large n, O(n) expected',
        fix: 'nth_element or manual quickselect — O(n) average.',
      },
    ],
    sayIt: ['Quickselect: nth_element for kth order statistic. O(n) average.'],
  }),

  'median-stream': e({
    xray: [
      { text: 'Find **median** from a stream of integers', kind: 'goal' },
      { text: '**Sliding window median**', kind: 'goal' },
    ],
    budget: ['medianHeap'],
    slottedTemplate: `priority_queue<int> lo;
priority_queue<int, vector<int>, greater<int>> hi;
void addNum(int v) {
    lo.push(v);
    hi.push(lo.top()); lo.pop();
    if (lo.size() < hi.size()) { lo.push(hi.top()); hi.pop(); }
}`,
    slots: [],
    slotFills: { 295: {}, 480: {} },
    helixDelta: { 295: 'Two heaps: balance for median', 480: 'Lazy deletion + rebalance for sliding window' },
    autopsies: [
      {
        cause: 'Forgetting to rebalance heaps after each addNum',
        wrong: 'lo.push(v); hi.push(lo.top()); lo.pop(); // missing size check',
        testCase: 'add 1, add 2, add 3 — lo has 2 items, hi has 1',
        fix: 'if (lo.size() < hi.size()) { lo.push(hi.top()); hi.pop(); }',
      },
    ],
    sayIt: ['Two-heap median: max-heap lower half, min-heap upper half. Balance so lo.size() >= hi.size().'],
  }),

  'heap-select': e({
    xray: [
      { text: '**Kth smallest** in a sorted matrix', kind: 'goal' },
      { text: '**Top K frequent** words (lexicographically tied)', kind: 'goal' },
    ],
    budget: ['heapSort', 'partialSort'],
    slottedTemplate: `priority_queue<{{TYPE}}> pq;
for (auto& x : {{SOURCE}}) {
    pq.push(x);
    if ((int)pq.size() > k) pq.pop();
}
return pq.top();`,
    slots: [
      { id: 'TYPE', label: 'Value type' },
      { id: 'SOURCE', label: 'Source iteration' },
    ],
    slotFills: {
      378: { TYPE: 'int', SOURCE: 'row : matrix for x : row' },
    },
    helixDelta: { 378: 'Max-heap of size k for kth smallest', 692: 'Min-heap by (count, word) for top-K frequent words' },
    autopsies: [
      {
        cause: 'Confusing max-heap vs min-heap for kth smallest vs kth largest',
        wrong: 'min-heap for kth smallest (heap grows to all elements)',
        testCase: 'kth smallest — want max-heap of size k',
        fix: 'kth smallest → max-heap of size k (pop largest). kth largest → min-heap of size k (pop smallest).',
      },
    ],
    sayIt: ['Heap selection: heap of size k. kth smallest → max-heap. kth largest → min-heap.'],
  }),

  interval: e({
    xray: [
      { text: '**Merge** overlapping intervals', kind: 'goal' },
      { text: '**Insert** a new interval into sorted intervals', kind: 'goal' },
      { text: '**Minimum meeting rooms** required', kind: 'goal' },
    ],
    budget: ['intervalSort'],
    slottedTemplate: `sort(intervals.begin(), intervals.end());
vector<vector<int>> out;
for (auto& i : intervals) {
    if (out.empty() || out.back()[1] < i[0]) out.push_back(i);
    else out.back()[1] = max(out.back()[1], i[1]);
}`,
    slots: [],
    slotFills: { 56: {}, 57: {}, 253: {} },
    helixDelta: { 56: 'Sort by start, merge overlapping', 57: 'Three-phase insert: before, merge, after', 253: 'Sort by start + min-heap of end times' },
    autopsies: [
      {
        cause: 'LC 56: not sorting before merge',
        wrong: ' // skip sort — intervals assumed sorted',
        testCase: 'unsorted input',
        fix: 'Always sort by start time first.',
      },
    ],
    sayIt: ['Interval: sort by start, then merge (overlap) or heap (rooms).'],
  }),

  'greedy-after-sort': e({
    xray: [
      { text: '**Assign cookies** to maximize content children', kind: 'goal' },
      { text: '**Two city scheduling** to minimize cost', kind: 'goal' },
      { text: '**Boats to save people** (lightest + heaviest)', kind: 'goal' },
    ],
    budget: ['greedySort'],
    slottedTemplate: `sort({{A}}.begin(), {{A}}.end());
sort({{B}}.begin(), {{B}}.end());
{{GREEDY_LOOP}}`,
    slots: [
      { id: 'A', label: 'First collection' },
      { id: 'B', label: 'Second collection' },
      { id: 'GREEDY_LOOP', label: 'Greedy loop' },
    ],
    slotFills: {
      455: { A: 'g', B: 's', GREEDY_LOOP: 'int i=0,j=0; while(i<g.size()&&j<s.size()){ if(s[j]>=g[i]) i++; j++; } return i;' },
    },
    helixDelta: { 455: 'Assign smallest sufficient cookie', 1029: 'Sort by cost diff, first half to A', 881: 'Sort + two-pointer (lightest + heaviest)' },
    autopsies: [
      {
        cause: 'LC 881: forgetting two-pointer after sort',
        wrong: 'sort + assign from heaviest greedily without pairing',
        testCase: '[3,2,2,1], limit=3',
        fix: 'While i <= j: if people[i]+people[j] <= limit, pair them.',
      },
    ],
    sayIt: ['Greedy after sort: sort enables optimal greedy choices.', 'Exchange argument proves greedy produces optimal result.'],
  }),

  'custom-sort': e({
    xray: [
      { text: '**Sort integers** by number of 1 bits (popcount)', kind: 'goal' },
      { text: '**Custom sort string** by given character order', kind: 'goal' },
    ],
    budget: ['customComparator'],
    slottedTemplate: `sort(arr.begin(), arr.end(), [](int a, int b) {
    {{COMPARATOR_BODY}}
});`,
    slots: [
      { id: 'COMPARATOR_BODY', label: 'Comparator logic' },
    ],
    slotFills: {
      1356: { COMPARATOR_BODY: 'int ba = __builtin_popcount(a), bb = __builtin_popcount(b); return ba != bb ? ba < bb : a < b;' },
    },
    helixDelta: { 1356: 'Multi-key comparator: popcount then value', 791: 'Count + reconstruct in order for custom string sort' },
    autopsies: [
      {
        cause: 'LC 791: ignoring characters not in order string',
        wrong: 'only process chars in order, drop the rest',
        testCase: 's="abcd", order="cba"',
        fix: 'Count all chars in s; output order chars first, then remaining alphabetically.',
      },
    ],
    sayIt: ['Custom sort: lambda with multi-key logic, or count+reconstruct for order-preserving.'],
  }),

  'external-sort': e({
    xray: [
      { text: 'Dataset is **larger than available RAM**', kind: 'constraint' },
      { text: 'Sort using **limited memory**', kind: 'constraint' },
    ],
    budget: ['external', 'mergeSort'],
    slottedTemplate: `// Phase 1: Split & sort chunks
//   for each chunk of size M:
//     read M records, sort in-memory, write to temp file
// Phase 2: K-way merge
//   min-heap of (value, fileIdx)
//   pop smallest → write output → push next from same file`,
    slots: [],
    slotFills: { 0: {} },
    helixDelta: {},
    autopsies: [
      {
        cause: 'Not using buffered I/O — random disk seeks are slow',
        wrong: 'read/write one record at a time',
        testCase: 'large dataset on HDD',
        fix: 'Use large buffers (e.g., 4 MB) for sequential I/O.',
      },
    ],
    sayIt: ['External sort: chunk → sort → k-way merge with heap. Minimize I/O with buffering.'],
  }),

  'parallel-sort': e({
    xray: [
      { text: '**Distributed** sorting across multiple machines', kind: 'constraint' },
      { text: 'Sort on **GPU** with thousands of cores', kind: 'constraint' },
    ],
    budget: ['parallel', 'external'],
    slottedTemplate: `// 1. Partition data (range or hash)
// 2. Each node sorts locally
// 3. Merge results (gather + merge)
// Sample sort: O(n/p log n + p log p)`,
    slots: [],
    slotFills: { 0: {} },
    helixDelta: {},
    autopsies: [
      {
        cause: 'Not accounting for data skew in partitioning',
        wrong: 'equal-size partitions without range analysis',
        testCase: 'highly skewed data',
        fix: 'Sample the data first, determine partition boundaries from samples.',
      },
    ],
    sayIt: ['Parallel sort: partition → local sort → merge. Sample to avoid skew.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
