import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  kth: e({
    xray: [
      { text: 'Return the **kth largest** element in an array', kind: 'goal' },
      { text: 'Return the **kth largest** from a data stream', kind: 'goal' },
      { text: 'Find **k closest points** to origin (by Euclidean distance)', kind: 'goal' },
    ],
    budget: ['topK', 'oNLogK'],
    slottedTemplate: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();
    }
    return pq.top();
}`,
    slots: [],
    slotFills: { 215: {}, 703: {}, 973: {} },
    helixDelta: {
      215: 'Min-heap of size k, return top — kth largest',
      703: 'Min-heap of size k; add returns top after maintaining size',
      973: 'Max-heap of size k by distance, keeps closest points',
    },
    autopsies: [
      {
        cause: 'Kth largest uses min-heap, not max-heap',
        wrong: 'priority_queue<int> pq (max-heap) — pops largest first',
        testCase: 'k=2, [3,2,1,5,6,4]',
        fix: 'priority_queue<int, vector<int>, greater<int>> — min-heap; keeps the k largest, pops the smallest of those.',
      },
      {
        cause: 'LC 973: using min-heap instead of max-heap for k closest',
        wrong: 'min-heap stores all points, pops k smallest — O(n log n)',
        testCase: 'k=2, large n',
        fix: 'Max-heap of size k by distance; pop farthest when over capacity.',
      },
    ],
    sayIt: ['Kth largest: min-heap of size k. Kth smallest: max-heap of size k.', 'K closest: max-heap of size k by distance.'],
  }),

  'k-freq': e({
    xray: [
      { text: 'Return the **k most frequent** elements', kind: 'goal' },
      { text: 'Return the **k most frequent** words (tie-break lexicographically)', kind: 'goal' },
      { text: '**Reduce array size by half** — remove most frequent elements first', kind: 'goal' },
    ],
    budget: ['kFreq', 'oNLogK'],
    slottedTemplate: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> f;
    for (int x : nums) f[x]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    for (auto& [n,c] : f) {
        pq.push({c, n});
        if ((int)pq.size() > k) pq.pop();
    }
    vector<int> out;
    while (!pq.empty()) { out.push_back(pq.top().second); pq.pop(); }
    return out;
}`,
    slots: [],
    slotFills: { 347: {}, 692: {}, 1338: {} },
    helixDelta: {
      347: 'Freq map + min-heap of size k by count; reverse output',
      692: 'Custom comparator: lower count first; same count → larger word first',
      1338: 'Max-heap of frequencies; greedily remove most frequent until half removed',
    },
    autopsies: [
      {
        cause: 'LC 692: not handling lexicographic tie-break correctly',
        wrong: 'min-heap by count only; words with same freq pop alphabetically first',
        testCase: '["a","a","b","b"], k=1 — expect "a"',
        fix: 'Comparator: a.second != b.second ? a.second < b.second : a.first > b.first',
      },
    ],
    sayIt: ['Top K frequent: freq map + min-heap of size k by count.', 'Top K words: custom cmp for count asc, word desc tie-break.'],
  }),

  'k-way-merge': e({
    xray: [
      { text: '**Merge k sorted** linked lists into one sorted list', kind: 'goal' },
      { text: 'Find the **kth smallest element** in a sorted matrix', kind: 'goal' },
      { text: 'Find the **smallest range** that includes at least one number from each list', kind: 'goal' },
    ],
    budget: ['kWayMerge', 'oNLogK'],
    slottedTemplate: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto* l : lists) if (l) pq.push(l);
    ListNode dummy(0), *cur = &dummy;
    while (!pq.empty()) {
        auto* n = pq.top(); pq.pop();
        cur->next = n; cur = n;
        if (n->next) pq.push(n->next);
    }
    return dummy.next;
}`,
    slots: [],
    slotFills: { 23: {}, 378: {}, 632: {} },
    helixDelta: {
      23: 'Min-heap of ListNode* by val; pop min, push next; classic K-way merge',
      378: 'Min-heap of (val, row, col); push first col of each row; pop k times',
      632: 'Min-heap of (val, listIdx, idx) + track max; range = max - min on each pop',
    },
    autopsies: [
      {
        cause: 'LC 23: forgetting to check null lists before pushing to heap',
        wrong: 'pq.push(l) without checking if (l)',
        testCase: 'lists = [null, ListNode(1)]',
        fix: 'if (l) pq.push(l); — null pointers crash the comparator.',
      },
      {
        cause: 'LC 632: not tracking max separately',
        wrong: 'only maintain min-heap without knowing current max in window',
        testCase: '[[1,10],[2,11],[3,12]]',
        fix: 'Track curMax = max(curMax, val) on each push; range = curMax - minHeap.top().val.',
      },
    ],
    sayIt: ['K-way merge: min-heap of k heads; pop min, push next from same source.', 'LC 632: track max separately; range = max - min.'],
  }),

  median: e({
    xray: [
      { text: 'Find **median** from a continuous data stream', kind: 'goal' },
      { text: 'Find **median** in a sliding window', kind: 'goal' },
    ],
    budget: ['median', 'streaming'],
    slottedTemplate: `class MedianFinder {
    priority_queue<int> lo;
    priority_queue<int, vector<int>, greater<int>> hi;
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
    slots: [],
    slotFills: { 295: {}, 480: {} },
    helixDelta: {
      295: 'Max-heap lower + min-heap upper; balance so lo.size() >= hi.size()',
      480: 'Two heaps + lazy deletion + balance on each add/remove; O(n log n)',
    },
    autopsies: [
      {
        cause: 'Wrong balance invariant — hi has more elements than lo',
        wrong: 'lo.size() < hi.size() is the rebalance condition',
        testCase: 'addNum(1), addNum(2), findMedian()',
        fix: 'lo (max-heap) always has >= items than hi (min-heap).',
      },
      {
        cause: 'LC 480: removing from heap directly is O(n)',
        wrong: 'erase from heap or use multiset without tracking stale',
        testCase: 'windowing requires removing oldest element',
        fix: 'Use lazy deletion: hash map of stale entries; skip stale on pop.',
      },
    ],
    sayIt: ['Streaming median: max-heap lower half, min-heap upper half; lo.size() >= hi.size().'],
  }),

  'task-sched': e({
    xray: [
      { text: '**Schedule tasks** with cooldown n between same tasks', kind: 'goal' },
      { text: '**Single-threaded CPU** — process shortest job first', kind: 'goal' },
      { text: '**Assign tasks to servers** — pick best available server', kind: 'goal' },
    ],
    budget: ['taskSchedule', 'greedy'],
    slottedTemplate: `int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {0};
    for (char c : tasks) freq[c-'A']++;
    priority_queue<int> pq;
    for (int f : freq) if (f) pq.push(f);
    int time = 0;
    while (!pq.empty()) {
        vector<int> batch;
        for (int i = 0; i <= n && !pq.empty(); i++) {
            batch.push_back(pq.top()); pq.pop();
        }
        for (int& f : batch)
            if (--f > 0) pq.push(f);
        time += pq.empty() ? batch.size() : n + 1;
    }
    return time;
}`,
    slots: [],
    slotFills: { 621: {}, 1834: {}, 1882: {} },
    helixDelta: {
      621: 'Max-heap of frequencies; batch n+1 per cycle; O(26 log 26) each cycle',
      1834: 'Sort by enqueue; min-heap of (processingTime, index); advance time = max(t, nextEnqueue)',
      1882: 'Two heaps: available by (weight, idx), busy by freeTime; assign best available',
    },
    autopsies: [
      {
        cause: 'LC 621: empty batch handling',
        wrong: 'always add n+1 even when heap empties mid-batch',
        testCase: 'only unique tasks',
        fix: 'time += pq.empty() ? batch.size() : n + 1',
      },
      {
        cause: 'LC 1834: not advancing time when heap empty',
        wrong: 'while (!pq.empty()) { ... } but tasks arrive later',
        testCase: 'tasks coming after current time',
        fix: 'if (pq.empty()) t = tasks[i][0]; // jump to next available task',
      },
    ],
    sayIt: ['Task scheduler: max-heap of freq, batch n+1 tasks per cycle.', 'CPU: sort by enqueue, min-heap by duration, advance time.'],
  }),

  meeting: e({
    xray: [
      { text: 'Find minimum **meeting rooms** needed for all meetings', kind: 'goal' },
      { text: '**Car pooling** — can vehicle capacity handle all trips?', kind: 'goal' },
    ],
    budget: ['intervalSchedule'],
    slottedTemplate: `int minMeetingRooms(vector<vector<int>>& is) {
    sort(is.begin(), is.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    pq.push(is[0][1]);
    for (int i = 1; i < (int)is.size(); i++) {
        if (pq.top() <= is[i][0]) pq.pop();
        pq.push(is[i][1]);
    }
    return (int)pq.size();
}`,
    slots: [],
    slotFills: { 253: {}, 1094: {} },
    helixDelta: {
      253: 'Sort by start; min-heap of end times; push each end, pop finished',
      1094: 'Min-heap of (dropOff, passengers) or diff array; track current passengers vs capacity',
    },
    autopsies: [
      {
        cause: 'Sorting by end time instead of start time',
        wrong: 'sort(is.begin(), is.end(), [](auto& a, auto& b) { return a[1] < b[1]; })',
        testCase: '[(0,5), (5,10), (6,7)] — needs 2 rooms',
        fix: 'Sort by start time; min-heap of end times tracks overlapping meetings.',
      },
    ],
    sayIt: ['Meeting rooms: sort by start, min-heap of end times.', 'Car pooling: diff array or event heap with ongoing passenger count.'],
  }),

  'event-sim': e({
    xray: [
      { text: 'Check if **hand of straights** can be grouped', kind: 'goal' },
      { text: '**Max apples eaten** before they rot each day', kind: 'goal' },
    ],
    budget: ['eventSim'],
    slottedTemplate: `bool isNStraightHand(vector<int>& hand, int gs) {
    if ((int)hand.size() % gs) return false;
    map<int,int> m;
    for (int x : hand) m[x]++;
    for (auto& [card, cnt] : m) {
        if (cnt == 0) continue;
        for (int i = 0; i < gs; i++) {
            if ((m[card + i] -= cnt) < 0) return false;
        }
    }
    return true;
}`,
    slots: [],
    slotFills: { 846: {}, 1705: {} },
    helixDelta: {
      846: 'Ordered map; for each card consume group of size gs',
      1705: 'Min-heap of (rotDay, count); each day pop rotten, push new, eat one',
    },
    autopsies: [
      {
        cause: 'LC 846: not checking group size divisibility upfront',
        wrong: 'start grouping without checking if hand.size() % gs == 0',
        testCase: 'hand=[1,2,3], gs=2',
        fix: 'if ((int)hand.size() % gs) return false; at start.',
      },
    ],
    sayIt: ['Straights: ordered map, consume groups of size gs.', 'Apples: min-heap by rot day; pop rotten, eat fresh, continue until heap empty.'],
  }),

  dijkstra: e({
    xray: [
      { text: '**Network delay** — shortest time from node K to all nodes', kind: 'goal' },
      { text: '**Path with minimum effort** — min max elevation diff in grid', kind: 'goal' },
    ],
    budget: ['dijkstra', 'graphShortest'],
    slottedTemplate: `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n+1);
    for (auto& t : times) g[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n+1, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[k] = 0; pq.push({0, k});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& [v, w] : g[u])
            if (dist[v] > d + w) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    int ans = 0;
    for (int i = 1; i <= n; i++) ans = max(ans, dist[i]);
    return ans == INT_MAX ? -1 : ans;
}`,
    slots: [],
    slotFills: { 743: {}, 1631: {} },
    helixDelta: {
      743: 'Standard Dijkstra: min-heap of (dist, node); O((V+E) log V)',
      1631: 'Grid Dijkstra: edge weight = |h1-h2|; dist = max effort along path',
    },
    autopsies: [
      {
        cause: 'Not skipping stale heap entries',
        wrong: 'no "if (d > dist[u]) continue;" — processes stale entries',
        testCase: 'node relaxed multiple times, heap grows to O(E)',
        fix: 'Skip stale: if (d > dist[u]) continue; before relaxing neighbors.',
      },
    ],
    sayIt: ['Dijkstra: min-heap (dist, node); skip stale; relax lighter neighbors.'],
  }),

  mst: e({
    xray: [
      { text: '**Min cost to connect** all points — Manhattan distance MST', kind: 'goal' },
      { text: '**Connecting cities** with minimum total cost', kind: 'goal' },
    ],
    budget: ['mst'],
    slottedTemplate: `int minCostConnectPoints(vector<vector<int>>& pts) {
    int n = (int)pts.size(), ans = 0;
    vector<bool> vis(n, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, 0});
    int edges = 0;
    while (edges < n) {
        auto [w, u] = pq.top(); pq.pop();
        if (vis[u]) continue;
        vis[u] = true; ans += w; edges++;
        for (int v = 0; v < n; v++) {
            if (!vis[v]) {
                int d = abs(pts[u][0]-pts[v][0]) + abs(pts[u][1]-pts[v][1]);
                pq.push({d, v});
            }
        }
    }
    return ans;
}`,
    slots: [],
    slotFills: { 1584: {}, 1135: {} },
    helixDelta: {
      1584: 'Prim\'s: min-heap of (cost, node); add nearest unvisited; all-pairs distance',
      1135: 'Prim\'s (min-heap + adj list) or Kruskal\'s (sort edges + DSU)',
    },
    autopsies: [
      {
        cause: 'Prim\'s: not skipping visited nodes — processes stale entries',
        wrong: 'while (!pq.empty()) { pop; if (vis[u]) continue; }',
        testCase: 'dense graph with many stale heap entries',
        fix: 'Skip visited: if (vis[u]) continue; after pop, before processing.',
      },
    ],
    sayIt: ['Prim\'s MST: min-heap (cost, node); mark visited; add all unvisited neighbors.'],
  }),

  'matrix-priority': e({
    xray: [
      { text: '**Swim in rising water** — min time to reach bottom-right', kind: 'goal' },
      { text: '**Path with maximum minimum value** — maximize min along path', kind: 'goal' },
    ],
    budget: ['matrixTraversal'],
    slottedTemplate: `int swimInWater(vector<vector<int>>& grid) {
    int n = (int)grid.size(), ans = 0;
    vector<vector<bool>> vis(n, vector<bool>(n, false));
    auto cmp = [](array<int,3>& a, array<int,3>& b) { return a[0] > b[0]; };
    priority_queue<array<int,3>, vector<array<int,3>>, decltype(cmp)> pq(cmp);
    pq.push({grid[0][0], 0, 0}); vis[0][0] = true;
    int dirs[5] = {0,1,0,-1,0};
    while (!pq.empty()) {
        auto [h, r, c] = pq.top(); pq.pop();
        ans = max(ans, h);
        if (r == n-1 && c == n-1) return ans;
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d], nc = c + dirs[d+1];
            if (nr>=0 && nr<n && nc>=0 && nc<n && !vis[nr][nc]) {
                vis[nr][nc] = true;
                pq.push({grid[nr][nc], nr, nc});
            }
        }
    }
    return -1;
}`,
    slots: [],
    slotFills: { 778: {}, 1102: {} },
    helixDelta: {
      778: 'Min-heap of (height, r, c); ans = max height seen; return when reach target',
      1102: 'Max-heap of (minVal, r, c); ans = min along path; maximize it',
    },
    autopsies: [
      {
        cause: 'LC 778: not tracking max height along path',
        wrong: 'return last popped height — ignores higher cells visited earlier',
        testCase: 'path goes through a high cell then down to target',
        fix: 'ans = max(ans, h) on each pop; return ans when target reached.',
      },
    ],
    sayIt: ['Swim / matrix priority: Dijkstra-like min-heap of cell values; ans = max height seen.'],
  }),

  'custom-cmp': e({
    xray: [
      { text: '**Last stone weight** — smash two heaviest stones each turn', kind: 'goal' },
      { text: '**Maximum average pass ratio** — add students to maximize pass ratio', kind: 'goal' },
    ],
    budget: ['customCmp'],
    slottedTemplate: `int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        if (a != b) pq.push(a - b);
    }
    return pq.empty() ? 0 : pq.top();
}`,
    slots: [],
    slotFills: { 1046: {}, 1792: {} },
    helixDelta: {
      1046: 'Max-heap default; pop two heaviest, push difference if non-zero',
      1792: 'Max-heap of delta pass ratio improvement; always add to class with max delta',
    },
    autopsies: [
      {
        cause: 'LC 1046: not handling equal stones (both destroyed)',
        wrong: 'push(abs(a-b)) — 0 pushes into heap',
        testCase: '[1,1] → expect 0',
        fix: 'if (a != b) pq.push(a - b); equal stones → nothing pushed.',
      },
    ],
    sayIt: ['Custom comparison: define comparator lambda for heap ordering.', 'LC 1792: delta = (pass+1)/(total+1) - pass/total; max-heap by delta.'],
  }),

  'lazy-delete': e({
    xray: [
      { text: '**Number of orders in backlog** — match buy/sell orders; stale after fill', kind: 'goal' },
    ],
    budget: ['lazyDelete'],
    slottedTemplate: `// Lazy deletion: heap + hash map of stale counts
class LazyHeap {
    priority_queue<pair<int,int>> pq;
    unordered_map<int,int> stale;
public:
    void push(int v, int id) { pq.push({v, id}); }
    int pop() {
        while (!pq.empty() && stale[pq.top().second]) {
            stale[pq.top().second]--;
            pq.pop();
        }
        auto [v, id] = pq.top(); pq.pop();
        return v;
    }
    void remove(int id) { stale[id]++; }
};`,
    slots: [],
    slotFills: { 1801: {} },
    helixDelta: {
      1801: 'Two heaps (buy max, sell min); match opposite orders; lazy delete filled quantities',
    },
    autopsies: [
      {
        cause: 'Not skipping stale entries — heap pop returns already-matched orders',
        wrong: 'pop from heap without checking stale map',
        testCase: 'order matched partially then remaining quantity re-pushed',
        fix: 'Before pop, check stale[id]; if stale, decrement and skip.',
      },
    ],
    sayIt: ['Lazy deletion: push freely; mark stale in map; skip stale entries on pop.'],
  }),

  'multi-heap': e({
    xray: [
      { text: '**Minimize deviation** in array — odd can double, even can halve', kind: 'goal' },
      { text: '**Longest subarray** with absolute diff <= limit', kind: 'goal' },
    ],
    budget: ['multiHeap'],
    slottedTemplate: `int smallestRangeII(vector<int>& nums, int k) {
    priority_queue<int> pq;
    int mn = INT_MAX;
    for (int x : nums) {
        int v = x % 2 ? x * 2 : x;
        pq.push(v); mn = min(mn, v);
    }
    int ans = pq.top() - mn;
    while (pq.top() % 2 == 0) {
        int x = pq.top(); pq.pop();
        pq.push(x / 2); mn = min(mn, x / 2);
        ans = min(ans, pq.top() - mn);
    }
    return ans;
}`,
    slots: [],
    slotFills: { 1675: {}, 1438: {} },
    helixDelta: {
      1675: 'Max-heap; multiply odds to max (x*2); decrease max when even; track min; minimize range',
      1438: 'Two heaps (max + min) with lazy deletion + sliding window; shrink when diff > limit',
    },
    autopsies: [
      {
        cause: 'LC 1675: not making all odds even first',
        wrong: 'process odds and evens differently during the loop',
        testCase: 'odd number can only increase (×2)',
        fix: 'Pre-process: if (x % 2) x *= 2; then only decrease evens.',
      },
    ],
    sayIt: ['Multi-heap: coordinate two heaps (max + min) with lazy deletion.', 'LC 1675: odds → even first, then reduce max even; track overall min.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
