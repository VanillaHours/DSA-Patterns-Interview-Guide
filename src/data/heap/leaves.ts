import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <queue>
#include <unordered_map>
#include <algorithm>
#include <climits>
#include <functional>
using namespace std;

`

// ── Top-K Pattern ────────────────────────────────────────────────

export const kthLeaf = leaf('kth', 'Kth Largest / Smallest', 'purple', {
  template: `${CPP_HEADER}int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();
    }
    return pq.top();
}`,
  problems: [
    { id: 215, title: 'Kth Largest', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (min-heap of size k).' },
    { id: 703, title: 'Kth Largest Stream', slug: 'kth-largest-element-in-a-stream', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Line: maintain min-heap of size k; add returns top.', variationCode: 'priority_queue<int,vector<int>,greater<int>> pq; int K; KthLargest(int k,vector<int>& n):K(k){ for(int x:n) add(x); } int add(int v){ pq.push(v); if(pq.size()>K) pq.pop(); return pq.top(); }' },
    { id: 973, title: 'K Closest Points', slug: 'k-closest-points-to-origin', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: max-heap of size k by distance; pop if new point closer.', variationCode: 'priority_queue<pair<int,int>> pq; for i..n-1: int d=points[i][0]*points[i][0]+points[i][1]*points[i][1]; pq.push({d,i}); if(pq.size()>k) pq.pop();' },
  ],
  pitfalls: ['❌ Kth largest = min-heap of size k (pop smallest when over capacity). Kth smallest = max-heap of size k.', '❌ LC 973: use max-heap to keep closest (smallest distance), pop farthest.'],
  interviewTip: '💡 "Kth largest" → min-heap of size k. "Kth smallest" → max-heap of size k. Heap tracks the k extreme elements.',
})

export const kFreqLeaf = leaf('k-freq', 'K Frequent Elements', 'purple', {
  template: `${CPP_HEADER}vector<int> topKFrequent(vector<int>& nums, int k) {
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
  problems: [
    { id: 347, title: 'Top K Frequent', slug: 'top-k-frequent-elements', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (freq map + min-heap of size k by count).' },
    { id: 692, title: 'Top K Frequent Words', slug: 'top-k-frequent-words', companies: ['AMAZON', 'GOOGLE', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: custom comparator for tie-breaking (same freq → lexicographic order).', variationCode: 'auto cmp=[](auto& a,auto& b){ return a.second!=b.second?a.second>b.second:a.first<b.first; }; priority_queue<pair<int,string>,vector<pair<int,string>>,decltype(cmp)> pq(cmp);' },
    { id: 1338, title: 'Reduce Array Half', slug: 'reduce-array-size-to-the-half', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: freq map + max-heap of counts; pop largest until removed >= n/2.', variationCode: 'unordered_map<int,int> f; for(int x:arr) f[x]++; priority_queue<int> pq; for(auto& [n,c]:f) pq.push(c); int sum=0, ans=0; while(sum*2<arr.size()){ sum+=pq.top(); pq.pop(); ans++; }' },
  ],
  pitfalls: ['❌ LC 692: min-heap by count ascending; when counts equal, lexicographically larger pops first.', '❌ LC 1338: greedy — always remove the most frequent element first.'],
  interviewTip: '💡 "Top K frequent" → freq map + min-heap of size k by frequency, then pop to output.',
})

export const kWayMergeLeaf = leaf('k-way-merge', 'K-Way Merge', 'purple', {
  template: `${CPP_HEADER}ListNode* mergeKLists(vector<ListNode*>& lists) {
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
  problems: [
    { id: 23, title: 'Merge K Sorted', slug: 'merge-k-sorted-lists', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–12: as-is (min-heap of ListNode* by value).' },
    { id: 378, title: 'Kth Smallest Sorted Matrix', slug: 'kth-smallest-element-in-a-sorted-matrix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: min-heap of (val, row, col); push first col of each row; pop k times.', variationCode: 'auto cmp=[](auto& a,auto& b){return a[0]>b[0];}; priority_queue<array<int,3>,vector<array<int,3>>,decltype(cmp)> pq(cmp); for i..n-1: pq.push({matrix[i][0],i,0}); for i..k-1: auto [v,r,c]=pq.top(); pq.pop(); if(c+1<n) pq.push({matrix[r][c+1],r,c+1}); return pq.top()[0];' },
    { id: 632, title: 'Smallest Range', slug: 'smallest-range-covering-elements-from-k-lists', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: min-heap of (val, listIdx, idx) + track max; range = max - min in heap.', variationCode: 'auto cmp=[](auto& a,auto& b){return a[0]>b[0];}; priority_queue<array<int,3>,vector<array<int,3>>,decltype(cmp)> pq; int mx=INT_MIN; for i..k-1: pq.push({nums[i][0],i,0}); mx=max(mx,nums[i][0]); int range=INT_MAX; while(true){ auto [v,r,c]=pq.top(); pq.pop(); if(mx-v<range){range=mx-v; ans={v,mx};} if(c+1==nums[r].size()) break; pq.push({nums[r][c+1],r,c+1}); mx=max(mx,nums[r][c+1]); }' },
  ],
  pitfalls: ['❌ LC 23: don\'t forget to check if (l) before pushing (null lists).', '❌ LC 632: track max in heap separately; pop min, update range, push next from same list.'],
  interviewTip: '💡 "K-way merge" → min-heap of k heads; pop min, push next from same source, track max for range.',
})

export const medianLeaf = leaf('median', 'Continuous Median', 'pink', {
  template: `${CPP_HEADER}class MedianFinder {
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
  problems: [
    { id: 295, title: 'Median from Stream', slug: 'find-median-from-data-stream', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (max-heap lower, min-heap upper, balance sizes).' },
    { id: 480, title: 'Sliding Window Median', slug: 'sliding-window-median', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: two heaps + lazy deletion; balance after each add and remove.', variationCode: '// multiset or two heaps with hash map tracking stale entries; rebalance on each window slide' },
  ],
  pitfalls: ['❌ LC 295: lo (max-heap) always has >= items than hi (min-heap); balance after each push.', '❌ LC 480: remove from heap is O(n) — use lazy deletion with hash map of stale counts.'],
  interviewTip: '💡 "Streaming median" → max-heap for lower half, min-heap for upper half; lo.size() >= hi.size() always.',
})

// ── Scheduling Pattern ───────────────────────────────────────────

export const taskSchedLeaf = leaf('task-sched', 'Task Scheduling', 'amber', {
  template: `${CPP_HEADER}int leastInterval(vector<char>& tasks, int n) {
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
  problems: [
    { id: 621, title: 'Task Scheduler', slug: 'task-scheduler', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–18: as-is (max-heap of freq, batch of n+1 per cycle).' },
    { id: 1834, title: 'Single-Threaded CPU', slug: 'single-threaded-cpu', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: sort by enqueue time; min-heap of (processingTime, index); pop and advance time.', variationCode: 'sort(tasks.begin(),tasks.end()); priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq; long t=0; int i=0; vector<int> ans; while(i<n||!pq.empty()){ while(i<n&&tasks[i][0]<=t) pq.push({tasks[i][1],tasks[i][2]}),i++; if(pq.empty()) t=tasks[i][0]; else{ auto [dur,idx]=pq.top(); pq.pop(); t+=dur; ans.push_back(idx); } }' },
    { id: 1882, title: 'Process Servers', slug: 'process-tasks-using-servers', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: two heaps (available servers by weight, busy servers by free time); assign task to best available.', variationCode: '// min-heap of (weight, idx) for available; min-heap of (freeTime, weight, idx) for busy' },
  ],
  pitfalls: ['❌ LC 621: simulation (batch) vs formula (maxF-1)*(n+1) + remaining — both work.', '❌ LC 1834: advance time = max(current, next enqueue) when heap is empty.'],
  interviewTip: '💡 "Task scheduler" → max-heap of frequencies; batch n+1 per cycle. "CPU" → sort + min-heap of duration.',
})

export const meetingLeaf = leaf('meeting', 'Meeting & Intervals', 'amber', {
  template: `${CPP_HEADER}int minMeetingRooms(vector<vector<int>>& is) {
    sort(is.begin(), is.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    pq.push(is[0][1]);
    for (int i = 1; i < (int)is.size(); i++) {
        if (pq.top() <= is[i][0]) pq.pop();
        pq.push(is[i][1]);
    }
    return (int)pq.size();
}`,
  problems: [
    { id: 253, title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (sort by start, min-heap of end times).' },
    { id: 1094, title: 'Car Pooling', slug: 'car-pooling', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: diff array of size 1001 or min-heap of (dropOff, passengers) with ongoing tracking.', variationCode: '// also solvable with difference array (see prefix sum pattern)' },
  ],
  pitfalls: ['❌ LC 253: sort by start time, not end time.', '❌ LC 1094: min-heap of (dropOffLocation, numPassengers); at each trip, pop finished drop-offs.'],
  interviewTip: '💡 "Meeting rooms" → sort by start, min-heap of end times. "Car pooling" → diff array or event-based heap.',
})

export const eventSimLeaf = leaf('event-sim', 'Event-Based Simulation', 'orange', {
  template: `${CPP_HEADER}bool isNStraightHand(vector<int>& hand, int gs) {
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
  problems: [
    { id: 846, title: 'Hand of Straights', slug: 'hand-of-straights', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–11: as-is (ordered map; for each card, consume group of size gs).' },
    { id: 1705, title: 'Eaten Apples', slug: 'maximum-number-of-eaten-apples', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: min-heap of (rotDay, count); each day pop rotten, push new apples, eat one.', variationCode: 'priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq; int day=0, ans=0; while(day<apples.size()||!pq.empty()){ if(day<apples.size()&&apples[day]) pq.push({day+apples[day]-1,apples[day]}); while(!pq.empty()&&pq.top().first<day) pq.pop(); if(!pq.empty()){ auto [rot,cnt]=pq.top(); pq.pop(); ans++; if(--cnt) pq.push({rot,cnt}); } day++; }' },
  ],
  pitfalls: ['❌ LC 846: reduce group count from current card — if negative, impossible.', '❌ LC 1705: must continue after apples array ends until heap empty.'],
  interviewTip: '💡 "Straights" → ordered map, consume groups of size gs. "Apples" → min-heap of rot day, eat before rotten.',
})

// ── Graph Applications ───────────────────────────────────────────

export const dijkstraLeaf = leaf('dijkstra', 'Dijkstra / Shortest Path', 'green', {
  template: `${CPP_HEADER}int networkDelayTime(vector<vector<int>>& times, int n, int k) {
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
  problems: [
    { id: 743, title: 'Network Delay', slug: 'network-delay-time', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–16: as-is (Dijkstra: min-heap of (dist, node), relax edges).' },
    { id: 1631, title: 'Min Effort Path', slug: 'path-with-minimum-effort', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: Dijkstra on grid — edge weight = abs diff; min-heap of (maxEffort, r, c).', variationCode: 'vector<vector<int>> dist(R,vector<int>(C,INT_MAX)); priority_queue<array<int,3>,vector<array<int,3>>,greater<>> pq; pq.push({0,0,0}); dist[0][0]=0; int dirs[5]={0,1,0,-1,0}; while(!pq.empty()){ auto [d,r,c]=pq.top(); pq.pop(); if(d>dist[r][c]) continue; if(r==R-1&&c==C-1) return d; for i..3: int nr=r+dirs[i],nc=c+dirs[i+1]; if(nr>=0&&nr<R&&nc>=0&&nc<C){ int nd=max(d,abs(heights[r][c]-heights[nr][nc])); if(dist[nr][nc]>nd){ dist[nr][nc]=nd; pq.push({nd,nr,nc}); } } }' },
  ],
  pitfalls: ['❌ Dijkstra: skip stale entries (if d > dist[u]) — otherwise O(n²) instead of O(E log V).', '❌ LC 1631: edge weight = |h1 - h2|; distance = max(effort along path).'],
  interviewTip: '💡 "Dijkstra" → min-heap of (distance, node); relax edges; skip stale heap entries.',
})

export const mstLeaf = leaf('mst', 'Minimum Spanning Tree', 'green', {
  template: `${CPP_HEADER}int minCostConnectPoints(vector<vector<int>>& pts) {
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
  problems: [
    { id: 1584, title: 'Min Cost Connect', slug: 'min-cost-to-connect-all-points', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–19: as-is (Prim\'s: min-heap of (dist, node), add nearest unvisited).' },
    { id: 1135, title: 'Connecting Cities', slug: 'connecting-cities-with-minimum-cost', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: Prim\'s or Kruskal\'s with DSU (Kruskal if edge list given).', variationCode: '// Prim\'s: same template. Kruskal\'s: sort edges by cost, DSU union until all connected.' },
  ],
  pitfalls: ['❌ Prim\'s: skip visited nodes (lazy heap may contain stale entries).', '❌ Kruskal\'s: DSU union-find required; O(E log E) sorting.'],
  interviewTip: '💡 "MST (Prim\'s)" → min-heap of (cost, node); add nearest unvisited node each iteration.',
})

export const matrixPriorityLeaf = leaf('matrix-priority', 'Matrix Priority Traversal', 'teal', {
  template: `${CPP_HEADER}int swimInWater(vector<vector<int>>& grid) {
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
  problems: [
    { id: 778, title: 'Swim in Rising Water', slug: 'swim-in-rising-water', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 7–22: as-is (min-heap of (height, r, c); track max height seen).' },
    { id: 1102, title: 'Path Max Min Value', slug: 'path-with-maximum-minimum-value', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: max-heap of (minVal, r, c); track min along path, maximize it.', variationCode: '// max-heap instead of min-heap; ans = min(ans, grid[nr][nc]) on pop' },
  ],
  pitfalls: ['❌ LC 778: ans = max height seen along path; pop min height each step (Dijkstra-like).', '❌ LC 1102: max-heap, track minimum value along each path.'],
  interviewTip: '💡 "Swim / matrix priority" → Dijkstra-like: min-heap of cell values; ans = max height seen.',
})

// ── Advanced Heap Techniques ─────────────────────────────────────

export const customCmpLeaf = leaf('custom-cmp', 'Custom Comparison', 'blue', {
  template: `${CPP_HEADER}int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        if (a != b) pq.push(a - b);
    }
    return pq.empty() ? 0 : pq.top();
}`,
  problems: [
    { id: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (max-heap, smash two heaviest).' },
    { id: 1792, title: 'Max Avg Pass Ratio', slug: 'maximum-average-pass-ratio', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: max-heap of improvement (delta pass ratio) from adding one student.', variationCode: 'auto cmp=[](auto& a,auto& b){ return (double)(a.first+1)/(a.second+1)-(double)a.first/a.second < (double)(b.first+1)/(b.second+1)-(double)b.first/b.second; }; priority_queue< pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);' },
  ],
  pitfalls: ['❌ LC 1046: if both stones same weight, both are destroyed (no push).', '❌ LC 1792: delta = (pass+1)/(total+1) - pass/total; always add to class with max delta.'],
  interviewTip: '💡 "Custom comparison" → define comparator lambda for heap ordering; max-heap = default, min-heap = greater<T>.',
})

export const lazyDeleteLeaf = leaf('lazy-delete', 'Lazy Deletion', 'pink', {
  template: `// Lazy deletion: mark stale, skip on pop
// Data structure: heap + hash map of stale counts
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
  problems: [
    { id: 1801, title: 'Orders Backlog', slug: 'number-of-orders-in-the-backlog', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: two heaps (buy max-heap, sell min-heap); match orders; lazy delete filled orders.', variationCode: 'priority_queue<array<int,2>> buy; priority_queue<array<int,2>,vector<array<int,2>>,greater<>> sell; for(auto& o:orders){ if(o[2]==0) buy.push({o[0],o[1]}); else sell.push({o[0],o[1]}); while(!buy.empty()&&!sell.empty()&&buy.top()[0]>=sell.top()[0]){ int amt=min(buy.top()[1],sell.top()[1]); // match } }' },
  ],
  pitfalls: ['❌ Not tracking stale entries — heap pop may return invalid (already removed) elements.', '❌ Lazy deletion with multiset: erase by iterator (O(1)) vs by value (O(log n) + multiple).'],
  interviewTip: '💡 "Lazy deletion" → push freely; mark stale in map; skip stale entries on pop.',
})

export const multiHeapLeaf = leaf('multi-heap', 'Multi-Heap Coordination', 'purple', {
  template: `${CPP_HEADER}int smallestRangeII(vector<int>& nums, int k) {
    // Note: LC 1675 is minimize deviation — different problem
    // This template shows two-heap coordination pattern
    priority_queue<int> mx; // max-heap
    priority_queue<int, vector<int>, greater<int>> mn; // min-heap
    for (int x : nums) { mx.push(x); mn.push(x); }
    int ans = mx.top() - mn.top();
    // ... coordination logic depends on problem
    return ans;
}`,
  problems: [
    { id: 1675, title: 'Minimize Deviation', slug: 'minimize-deviation-in-array', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line: max-heap; multiply odd numbers to max possible (x*2); decrease max when even; track min.', variationCode: 'priority_queue<int> pq; int mn=INT_MAX; for(int x:nums){ int v=x%2?x*2:x; pq.push(v); mn=min(mn,v); } int ans=pq.top()-mn; while(pq.top()%2==0){ int x=pq.top(); pq.pop(); pq.push(x/2); mn=min(mn,x/2); ans=min(ans,pq.top()-mn); } return ans;' },
    { id: 1438, title: 'Abs Diff Limit', slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line: two deques for max/min, or two heaps with lazy deletion + sliding window.', variationCode: '// two-heap variant: max-heap + min-heap with lazy deletion for sliding window; shrink when diff > limit' },
  ],
  pitfalls: ['❌ LC 1675: odd can only increase (×2), even can only decrease (/2). All odds become even first.', '❌ LC 1438: heap approach O(n log n); deque approach O(n) is better.'],
  interviewTip: '💡 "Multi-heap" → coordinate two heaps (max + min) with lazy deletion; shrink window or adjust values.',
})
