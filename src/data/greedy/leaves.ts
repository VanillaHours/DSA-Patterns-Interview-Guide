import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <climits>
#include <unordered_map>
#include <set>
using namespace std;

`

// ── Interval Processing Leaves ───────────────────────────────────

export const activitySelectLeaf = leaf('activity-select', 'Activity Selection', 'amber', {
  template: `${CPP_HEADER}int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });
    int keep = 0, end = INT_MIN;
    for (auto& iv : intervals) {
        if (iv[0] >= end) { keep++; end = iv[1]; }
    }
    return (int)intervals.size() - keep;
}`,
  problems: [
    { id: 435, title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 5: sort by end; lines 6-8: count non-overlapping; return total-keep.' },
    { id: 452, title: 'Min Arrows', slug: 'minimum-number-of-arrows-to-burst-balloons', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Line 6-7: shrink end=min(end,iv[1]); count arrows when iv[0]>end.', variationCode: 'if (iv[0] > end) { arrows++; end = iv[1]; } else end = min(end, iv[1]);' },
    { id: 1326, title: 'Min Taps', slug: 'minimum-number-of-taps-to-open-to-water-a-garden', companies: ['GOOGLE'], lineChanges: 'Build intervals [i-range,i+range]; sort by start; greedy cover [0,n].', variationCode: 'sort(ivs); int i=0,ans=0,far=0,nextFar=0; while(i<n&&far<n){ while(i<n&&ivs[i][0]<=far) nextFar=max(nextFar,ivs[i++][1]); if(nextFar<=far) return -1; far=nextFar; ans++; }' },
  ],
  pitfalls: ['❌ Sorting by start instead of end — wrong for max non-overlapping.', '❌ Forgetting intervals can touch (end==next.start counts as non-overlapping).'],
  edgeCases: [{ input: 'single interval', breaks: 'keep=1, return 0' }, { input: 'all overlapping', breaks: 'keep=1, delete all but one' }],
  interviewTip: '💡 "Non-overlapping intervals" → sort by END, greedy pick earliest finishing.',
})

export const intervalMergeLeaf = leaf('interval-merge', 'Interval Merging', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> out;
    for (auto& iv : intervals) {
        if (out.empty() || out.back()[1] < iv[0]) out.push_back(iv);
        else out.back()[1] = max(out.back()[1], iv[1]);
    }
    return out;
}`,
  problems: [
    { id: 56, title: 'Merge Intervals', slug: 'merge-intervals', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5-8: as-is (sort by start; extend or push).' },
    { id: 986, title: 'Interval Intersections', slug: 'interval-list-intersections', companies: ['GOOGLE', 'META'], mustKnow: true, lineChanges: 'Two-pointer on two sorted lists; push overlap [max(s1,s2), min(e1,e2)]; advance smaller end.', variationCode: 'while(i<n&&j<m){ int lo=max(A[i][0],B[j][0]),hi=min(A[i][1],B[j][1]); if(lo<=hi) out.push_back({lo,hi}); if(A[i][1]<B[j][1]) i++; else j++; }' },
    { id: 1024, title: 'Video Stitching', slug: 'video-stitching', companies: ['AMAZON', 'MICROSOFT'], lineChanges: 'Sort by start; greedy farthest reach; count segments required.', variationCode: 'sort(clips); int end=0,far=0,i=0,ans=0,n=clips.size(); while(end<T){ while(i<n&&clips[i][0]<=end) far=max(far,clips[i++][1]); if(far<=end) return -1; end=far; ans++; }' },
  ],
  pitfalls: ['❌ Not sorting by start first — merging only works on sorted input.', '❌ Interval list intersections: advancing both when lists have different pacing.'],
  edgeCases: [{ input: 'no intervals', breaks: 'returns empty' }, { input: 'one interval covers all', breaks: 'single merged result' }],
  interviewTip: '💡 "Merge intervals" → sort by START, combine when overlapping.',
})

export const intervalCoverageLeaf = leaf('interval-coverage', 'Interval Coverage', 'amber', {
  template: `${CPP_HEADER}int removeCoveredIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a[0] < b[0] || (a[0] == b[0] && a[1] > b[1]); });
    int remain = 0, far = 0;
    for (auto& iv : intervals) {
        if (iv[1] > far) { remain++; far = iv[1]; }
    }
    return remain;
}`,
  problems: [
    { id: 1288, title: 'Remove Covered Intervals', slug: 'remove-covered-intervals', companies: ['GOOGLE'], lineChanges: 'Line 5: sort start asc, end desc; lines 6-8: keep if end > current far.', variationCode: 'if (iv[1] > far) { remain++; far = iv[1]; }' },
    { id: 763, title: 'Partition Labels', slug: 'partition-labels', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Record last index of each char; scan, tracking max last seen; cut when i==last.', variationCode: `int last[26]; for i in 0..n-1 last[s[i]-'a']=i; int start=0,far=0; for i in 0..n-1 { far=max(far,last[s[i]-'a']); if(i==far){ out.push_back(i-start+1); start=i+1; } }` },
  ],
  pitfalls: ['❓ Covered intervals: forgetting to sort by end DESC for equal starts — longest range should be first.'],
  edgeCases: [{ input: 'all intervals same start', breaks: 'descending end sort ensures largest first' }],
  interviewTip: '💡 "Remove covered / partition labels" → sort by start, track farthest end seen.',
})

export const skylineSweepLeaf = leaf('skyline-sweep', 'Skyline & Sweep Line', 'amber', {
  template: `${CPP_HEADER}int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<pair<int,int>> events;
    for (auto& iv : intervals) {
        events.push_back({iv[0], 1});
        events.push_back({iv[1], -1});
    }
    sort(events.begin(), events.end());
    int cur = 0, ans = 0;
    for (auto& e : events) {
        cur += e.second;
        ans = max(ans, cur);
    }
    return ans;
}`,
  problems: [
    { id: 253, title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5-10: as-is (+1 at start, -1 at end); track max concurrent.' },
    { id: 218, title: 'Skyline Problem', slug: 'the-skyline-problem', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Push (-height, start) and (height, end); multiset of active heights; record when max height changes.', variationCode: 'events: (-h,l) and (h,r); sort; multiset<int> hs; hs.insert(0); for(auto& e:events){ if(e.second<0) hs.insert(-e.first); else hs.erase(hs.find(e.first)); int cur=*hs.rbegin(); if(cur!=prev) { out.push_back({e.first,cur}); prev=cur; } }' },
    { id: 759, title: 'Employee Free Time', slug: 'employee-free-time', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Merge all intervals; gaps between merged blocks are free time.', variationCode: 'merge all intervals; sort by start; for each if gap > 0 record [prev_end, start]' },
  ],
  pitfalls: ['❌ Skyline: using integer height ordering for events — start events sorted by -height DESC (tallest first).', '❌ Meeting rooms: forgetting that end event happens before start event at same time.'],
  edgeCases: [{ input: 'single meeting', breaks: 'max = 1' }, { input: 'back-to-back meetings', breaks: 'no overlap, max = 1' }],
  interviewTip: '💡 "Meeting rooms / skyline" → sweep line: +1 at start, -1 at end; track max concurrent.',
})

export const kruskalsLeaf = leaf('kruskals', "Kruskal's Algorithm", 'lime', {
  template: `${CPP_HEADER}struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

int minCostConnectPoints(vector<vector<int>>& points) {
    int n = (int)points.size();
    vector<array<int,3>> edges;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            edges.push_back({abs(points[i][0]-points[j][0])+abs(points[i][1]-points[j][1]), i, j});
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    int cost = 0;
    for (auto& [w, u, v] : edges) {
        if (dsu.unite(u, v)) cost += w;
    }
    return cost;
}`,
  problems: [
    { id: 1584, title: 'Min Cost Connect Points', slug: 'min-cost-to-connect-all-points', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 18-32: as-is (Kruskal with DSU, Manhattan distance).' },
    { id: 1489, title: 'Critical Edges in MST', slug: 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree', companies: ['GOOGLE'], lineChanges: 'For each edge: force include (unite before Kruskal) or force exclude (skip); compare MST weight.', variationCode: 'int mstWeight = kruskal(edges, n); for each e: { int with = kruskal(edges, n, forceInclude:e); int without = kruskal(edges, n, forceExclude:e); }' },
  ],
  pitfalls: ['❌ Not using path compression + union by rank — TLE on dense graphs.', '❌ Connecting cities: forgetting to build edges (complete graph for 1584).'],
  edgeCases: [{ input: 'single point', breaks: 'no edges, cost=0' }, { input: 'two points', breaks: 'just one edge' }],
  interviewTip: '💡 "Min cost to connect all points" → Kruskal: sort edges, union-find.',
})

export const primsLeaf = leaf('prims', "Prim's Algorithm", 'lime', {
  template: `${CPP_HEADER}int minCostConnectPoints(vector<vector<int>>& points) {
    int n = (int)points.size();
    vector<bool> vis(n, false);
    vector<int> minDist(n, INT_MAX);
    int cost = 0;
    minDist[0] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!vis[i] && (u == -1 || minDist[i] < minDist[u])) u = i;
        vis[u] = true;
        cost += minDist[u];
        for (int v = 0; v < n; v++)
            if (!vis[v]) {
                int d = abs(points[u][0]-points[v][0]) + abs(points[u][1]-points[v][1]);
                if (d < minDist[v]) minDist[v] = d;
            }
    }
    return cost;
}`,
  problems: [
    { id: 1135, title: 'Connecting Cities', slug: 'connecting-cities-with-minimum-cost', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 2-17: Prim O(n²) on adjacency cost matrix; edge list to matrix first.', variationCode: 'build adj matrix from edges; Prim O(n²); if not all vis return -1' },
    { id: 1168, title: 'Water Distribution', slug: 'optimize-water-distribution-in-a-village', companies: ['GOOGLE'], lineChanges: 'Add virtual node 0 with edges cost=well[i]; run Prim/Kruskal on n+1 nodes.', variationCode: 'for(int i=0;i<n;i++) edges.push_back({wells[i],0,i+1}); // virtual source' },
  ],
  pitfalls: ['❌ Using Kruskal O(E log E) when graph is dense — Prim O(n²) is better.', '❌ Water distribution: forget the virtual well node.'],
  edgeCases: [{ input: 'already connected component', breaks: 'MST weight = min of its edges' }],
  interviewTip: '💡 Dense graph MST → Prim O(n²). Water distribution → add virtual well node.',
})

// ── Selection Problems Leaves ────────────────────────────────────

export const frequencySelectLeaf = leaf('freq-select', 'Frequency-Based Selection', 'blue', {
  template: `${CPP_HEADER}int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) { candidate = x; count = 1; }
        else if (x == candidate) count++;
        else count--;
    }
    return candidate;
}`,
  problems: [
    { id: 169, title: 'Majority Element', slug: 'majority-element', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (Boyer-Moore voting).' },
    { id: 621, title: 'Task Scheduler', slug: 'task-scheduler', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Count freq; sort; maxFreq = freq[25]; idle = (maxFreq-1)*n; subtract other tasks from idle.', variationCode: 'sort(freq); int mx=freq[25]-1, idle=mx*n; for(int i=24;i>=0&&freq[i];i--) idle-=min(mx,freq[i]); return idle>0?idle+(int)tasks.size():tasks.size();' },
    { id: 1090, title: 'Largest Values From Labels', slug: 'largest-values-from-labels', companies: ['GOOGLE'], lineChanges: 'Sort by value desc; pick if label count < useLimit.', variationCode: 'sort by value desc; unordered_map<int,int> used; for each: if used[label] < useLimit { ans+=value; used[label]++; numWanted--; if(!numWanted) break; }' },
  ],
  pitfalls: ['❌ Task scheduler: forgetting that most frequent task determines minimum length, not the sum.', '❌ Majority element: Boyer-Moore only works when majority > n/2.'],
  edgeCases: [{ input: 'single element', breaks: 'Boyer-Moore returns it' }, { input: 'tasks with n=0', breaks: 'no idle needed, answer = tasks.size()' }],
  interviewTip: '💡 "Majority element" → Boyer-Moore voting O(n) O(1). "Task scheduler" → idle slots formula.',
})

export const valueSelectLeaf = leaf('value-select', 'Value-Based Selection', 'blue', {
  template: `${CPP_HEADER}int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    int i = 0;
    for (int cookie : s) {
        if (i < (int)g.size() && cookie >= g[i]) i++;
    }
    return i;
}`,
  problems: [
    { id: 455, title: 'Assign Cookies', slug: 'assign-cookies', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (sort both, match smallest sufficient cookie).' },
    { id: 1029, title: 'Two City Scheduling', slug: 'two-city-scheduling', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Sort by costA-costB (savings); first half to A, second to B.', variationCode: 'sort(begin(costs),end(costs),[](auto&a,auto&b){ return a[0]-a[1]<b[0]-b[1]; }); int n=costs.size()/2, ans=0; for i 0..n-1 ans+=costs[i][0]; for i n..2n-1 ans+=costs[i][1];' },
    { id: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Use max-heap; pop two largest, smash, push remainder.', variationCode: 'priority_queue<int> pq(begin(stones), end(stones)); while(pq.size()>1){ int a=pq.top(); pq.pop(); int b=pq.top(); pq.pop(); if(a!=b) pq.push(a-b); } return pq.empty()?0:pq.top();' },
  ],
  pitfalls: ['❌ Two city scheduling: not sorting by cost difference — wrong assignment.', '❌ Last stone weight: using max-heap is O(n log n), but brute force O(n²).'],
  edgeCases: [{ input: 'no cookies', breaks: 'return 0' }, { input: 'one stone', breaks: 'return that stone' }],
  interviewTip: '💡 "Two city scheduling" → sort by cost difference (savings of A over B).',
})

export const ratioSelectLeaf = leaf('ratio-select', 'Ratio-Based Selection', 'blue', {
  template: `${CPP_HEADER}int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int l = 0, r = (int)people.size() - 1, boats = 0;
    while (l <= r) {
        if (people[l] + people[r] <= limit) l++;
        r--;
        boats++;
    }
    return boats;
}`,
  problems: [
    { id: 881, title: 'Boats to Save People', slug: 'boats-to-save-people', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (lightest+heaviest pair if <= limit; else heaviest alone).' },
    { id: 991, title: 'Broken Calculator', slug: 'broken-calculator', companies: ['GOOGLE'], lineChanges: 'Work backward from target to startValue: if target even, divide by 2; else add 1.', variationCode: 'int ans=0; while(target>startValue){ if(target%2==0) target/=2; else target+=1; ans++; } return ans + (startValue-target);' },
    { id: 134, title: 'Gas Station', slug: 'gas-station', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Track total sum and running deficit; if sum < 0 at any point, start from next station.', variationCode: 'int sum=0,total=0,start=0; for i 0..n-1{ sum+=gas[i]-cost[i]; total+=gas[i]-cost[i]; if(sum<0){ sum=0; start=i+1; } } return total<0?-1:start;' },
  ],
  pitfalls: ['❌ Gas station: O(n²) simulation vs O(n) greedy with deficit tracking.', '❌ Broken calculator: working forward is exponential — work backward is O(log target).'],
  edgeCases: [{ input: 'single person over limit', breaks: 'one boat for him' }, { input: 'total gas < total cost', breaks: 'return -1' }],
  interviewTip: '💡 "Gas station" → total sum check + running deficit reset. "Broken calculator" → work backward.',
})

export const iterativeConstructionLeaf = leaf('iterative-construction', 'Iterative Construction', 'blue', {
  template: `${CPP_HEADER}int connectSticks(vector<int>& sticks) {
    priority_queue<int, vector<int>, greater<int>> pq(sticks.begin(), sticks.end());
    int cost = 0;
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        cost += a + b;
        pq.push(a + b);
    }
    return cost;
}`,
  problems: [
    { id: 1167, title: 'Min Cost Connect Sticks', slug: 'minimum-cost-to-connect-sticks', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-9: as-is (always combine the two smallest sticks).' },
    { id: 1578, title: 'Min Time Rope Colorful', slug: 'minimum-time-to-make-rope-colorful', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'For each group of same color, keep the max cost balloon; sum the rest.', variationCode: 'int ans=0; for each group of same color: int sum=0,mx=0; for each in group: sum+=cost[i]; mx=max(mx,cost[i]); ans+=sum-mx;' },
    { id: 870, title: 'Advantage Shuffle', slug: 'advantage-shuffle', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Sort both; use two-pointer: if A[i] > B[sorted] assign to that position, else assign to largest B.', variationCode: 'sort(A); sort(B); map<int,queue<int>> assign; for i..n-1: if A[l]>B[i] assign[B[i]].push(A[l++]); else assign[B[i]].push(A[r--]); for i..n-1: ans[i]=assign[B[i]].front(); assign[B[i]].pop();' },
  ],
  pitfalls: ['❌ Connect sticks: using sort repeatedly O(n² log n) vs min-heap O(n log n).', '❌ Advantage shuffle: not using deque/queue to map B values to assigned A values.'],
  edgeCases: [{ input: 'single stick', breaks: 'cost = 0' }, { input: 'all same color balloons', breaks: 'keep one max, remove rest' }],
  interviewTip: '💡 "Connect sticks" → min-heap, always merge smallest two.',
})

// ── Greedy Path & Search Leaves ──────────────────────────────────

export const pathBuildingLeaf = leaf('path-building', 'Path Building', 'teal', {
  template: `${CPP_HEADER}bool canJump(vector<int>& nums) {
    int far = 0;
    for (int i = 0; i <= far && i < (int)nums.size(); i++) {
        far = max(far, i + nums[i]);
        if (far >= (int)nums.size() - 1) return true;
    }
    return false;
}`,
  problems: [
    { id: 55, title: 'Jump Game', slug: 'jump-game', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-6: as-is (track farthest reachable index).' },
    { id: 45, title: 'Jump Game II', slug: 'jump-game-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Track currentEnd and farthest; when i == currentEnd, increment jumps.', variationCode: 'int far=0,end=0,jumps=0; for i 0..n-2{ far=max(far,i+nums[i]); if(i==end){ jumps++; end=far; } } return jumps;' },
    { id: 1306, title: 'Jump Game III', slug: 'jump-game-iii', companies: ['GOOGLE'], lineChanges: 'BFS/DFS from start index; visit i+arr[i] and i-arr[i]; stop at 0.', variationCode: 'queue<int> q; q.push(start); vis[start]=1; while(!q.empty()){ int i=q.front(); q.pop(); if(arr[i]==0) return true; for(int ni:{i+arr[i],i-arr[i]}) if(ni>=0&&ni<n&&!vis[ni]){vis[ni]=1;q.push(ni);} }' },
  ],
  pitfalls: ['❌ Jump Game II: BFS instead of greedy — overcomplicates O(n) solution.', '❌ Jump Game III: not checking bounds before accessing array.'],
  edgeCases: [{ input: 'single element 0', breaks: 'already at last index, return true' }, { input: 'all zeros except first', breaks: 'can only reach first' }],
  interviewTip: '💡 "Can reach end" → track max reachable index. "Min jumps" → BFS-like greedy tiers.',
})

export const graphExplorationLeaf = leaf('graph-exploration', 'Graph Exploration', 'teal', {
  template: `${CPP_HEADER}int minimumEffortPath(vector<vector<int>>& heights) {
    int n = (int)heights.size(), m = (int)heights[0].size();
    vector<vector<int>> dist(n, vector<int>(m, INT_MAX));
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> pq;
    dist[0][0] = 0;
    pq.push({0, 0, 0});
    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
    while (!pq.empty()) {
        auto [d, i, j] = pq.top(); pq.pop();
        if (d > dist[i][j]) continue;
        if (i == n-1 && j == m-1) return d;
        for (auto& dd : dirs) {
            int ni = i + dd[0], nj = j + dd[1];
            if (ni < 0 || ni >= n || nj < 0 || nj >= m) continue;
            int nd = max(d, abs(heights[i][j] - heights[ni][nj]));
            if (nd < dist[ni][nj]) { dist[ni][nj] = nd; pq.push({nd, ni, nj}); }
        }
    }
    return 0;
}`,
  problems: [
    { id: 1631, title: 'Path With Minimum Effort', slug: 'path-with-minimum-effort', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 2-17: as-is (Dijkstra on max-diff; minimize the maximum edge weight).' },
    { id: 1102, title: 'Max Min Value Path', slug: 'path-with-maximum-minimum-value', companies: ['GOOGLE'], lineChanges: 'Max-heap priority queue: always expand the cell with the highest minimum value so far.', variationCode: 'max-heap of {minVal,i,j}; dist[i][j] = min(dist[parent], grid[i][j]); return dist[n-1][m-1];' },
    { id: 778, title: 'Swim in Rising Water', slug: 'swim-in-rising-water', companies: ['GOOGLE'], lineChanges: 'Dijkstra on max-elevation; track the minimum elevation needed to reach each cell.', variationCode: 'priority_queue of {maxElevation,i,j}; dist[i][j]=max(dist[parent],grid[i][j]);' },
  ],
  pitfalls: ['❓ Dijkstra vs BFS: BFS works for uniform weight; use Dijkstra (priority queue) for min-max.'],
  edgeCases: [{ input: '1x1 grid', breaks: 'return 0' }, { input: 'flat terrain', breaks: 'effort = 0' }],
  interviewTip: '💡 "Path with min effort / max min value" → Dijkstra on edge weight = elevation diff.',
})

export const stringConstructionLeaf = leaf('string-construction', 'String Construction', 'teal', {
  template: `${CPP_HEADER}string reorganizeString(string s) {
    int freq[26] = {};
    for (char c : s) freq[c-'a']++;
    int maxIdx = 0;
    for (int i = 1; i < 26; i++)
        if (freq[i] > freq[maxIdx]) maxIdx = i;
    if (freq[maxIdx] > ((int)s.size() + 1) / 2) return "";
    string ans(s.size(), ' ');
    int pos = 0;
    for (int i = 0; i < 26; i++) {
        char c = (char)('a' + ((i == 0) ? maxIdx : 0));
        int idx = (i == 0) ? maxIdx : (i <= maxIdx ? i - 1 : i);
        while (freq[idx]--) {
            if (pos >= (int)s.size()) pos = 1;
            ans[pos] = (char)('a' + idx);
            pos += 2;
        }
    }
    return ans;
}`,
  problems: [
    { id: 767, title: 'Reorganize String', slug: 'reorganize-string', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2-10: check feasibility (most freq <= ceil(n/2)); lines 11-20: place in even then odd positions.' },
    { id: 1405, title: 'Longest Happy String', slug: 'longest-happy-string', companies: ['GOOGLE'], lineChanges: 'Always append the most frequent char that does not create "aaa" triplet.', variationCode: 'priority_queue of {freq,char}; while(pq.size()>1){ take top; if last two same, take second; append; push back if leftover; }' },
    { id: 484, title: 'Find Permutation', slug: 'find-permutation', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Start with smallest; for each "D" (decreasing), reverse a segment.', variationCode: `vector<int> ans(n), ptr=0; iota(ans); for i in 0..n-1: if s[i]=='D' && (i==n-1||s[i+1]=='I') reverse(ans.begin()+ptr,ans.begin()+i+1);` },
  ],
  pitfalls: ['❌ Reorganize string: forgetting feasibility check before construction.', '❌ Find permutation: understanding "DI" string pattern.'],
  edgeCases: [{ input: 'all same chars', breaks: 'impossible if count > ceil(n/2)' }, { input: 'single char', breaks: 'returns that char' }],
  interviewTip: '💡 "Reorganize string / happy string" → place most frequent first; check feasibility condition.',
})

// ── Prefix/Suffix Optimization Leaves ────────────────────────────

export const prefixSumLeaf = leaf('prefix-sum', 'Prefix Sum Application', 'orange', {
  template: `${CPP_HEADER}int maxSubArray(vector<int>& nums) {
    int cur = 0, best = INT_MIN;
    for (int x : nums) {
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    return best;
}`,
  problems: [
    { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-6: as-is (Kadane: drop negative prefix).' },
    { id: 121, title: 'Best Time to Buy/Sell', slug: 'best-time-to-buy-and-sell-stock', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Track min price so far; ans = max(ans, price-minPrice).', variationCode: 'int mn=INT_MAX,ans=0; for each p: mn=min(mn,p); ans=max(ans,p-mn);' },
    { id: 918, title: 'Max Sum Circular', slug: 'maximum-sum-circular-subarray', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Kadane for max non-circular + total - minSubarray (circular case).', variationCode: 'int curMax=0,bestMax=INT_MIN,curMin=0,bestMin=INT_MAX,total=0; for each: curMax=max(x,curMax+x); bestMax=max(bestMax,curMax); curMin=min(x,curMin+x); bestMin=min(bestMin,curMin); total+=x; return bestMax>0?max(bestMax,total-bestMin):bestMax;' },
    { id: 1423, title: 'Max Points from Cards', slug: 'maximum-points-you-can-obtain-from-cards', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Take k from ends = total sum - min subarray sum of length n-k.', variationCode: 'int n=cps.size(),win=n-k,sum=0; for i 0..win-1 sum+=cps[i]; int mn=sum; for i win..n-1{ sum+=cps[i]-cps[i-win]; mn=min(mn,sum); } return total-mn;' },
  ],
  pitfalls: ['❌ Kadane: resetting cur to 0 when negative — should set cur = max(x, cur + x).', '❌ Max sum circular: forgetting case where all nums are negative.'],
  edgeCases: [{ input: 'all negatives', breaks: 'Kadane returns the max (least negative) element' }],
  interviewTip: '💡 "Maximum subarray sum" → Kadane: drop negative prefix, track best.',
})

export const runningMinMaxLeaf = leaf('running-min-max', 'Running Minimum/Maximum', 'orange', {
  template: `${CPP_HEADER}int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, sum = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        total += gas[i] - cost[i];
        sum += gas[i] - cost[i];
        if (sum < 0) { sum = 0; start = i + 1; }
    }
    return total < 0 ? -1 : start;
}`,
  problems: [
    { id: 134, title: 'Gas Station', slug: 'gas-station', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (track total and running sum; reset when negative).' },
    { id: 659, title: 'Consecutive Subsequences', slug: 'split-array-into-consecutive-subsequences', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Count freq and needed tails; for each num, extend existing chain or start new chain.', variationCode: 'unordered_map<int,int> freq, need; for each x: freq[x]++; for each x: if(!freq[x]) continue; if(need[x]){ need[x]--; need[x+1]++; } else { int c=freq[x+1]&&freq[x+2]; if(!c) return false; freq[x+1]--; freq[x+2]--; need[x+3]++; } freq[x]--; return true;' },
    { id: 871, title: 'Min Refueling Stops', slug: 'minimum-number-of-refueling-stops', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Max-heap of gas stations passed; when fuel runs out, pop the largest gas and refuel.', variationCode: 'priority_queue<int> pq; int i=0,stops=0; long cur=startFuel; for target{ while(cur<stations[i][0]&&!pq.empty()){ cur+=pq.top(); pq.pop(); stops++; } if(cur<stations[i][0]) return -1; pq.push(stations[i][1]); }' },
  ],
  pitfalls: ['❓ Refueling stops: using DP O(n²) instead of max-heap O(n log n).', '❓ Consecutive subsequences: confusing "chain extension" vs "start new chain" logic.'],
  edgeCases: [{ input: 'startFuel reaches target', breaks: 'return 0' }, { input: 'gas station sum < cost', breaks: 'return -1' }],
  interviewTip: '💡 "Gas station" → total + running deficit. "Refueling stops" → max-heap of passed stations.',
})

export const twoPassLeaf = leaf('two-pass', 'Two-Pass Algorithms', 'orange', {
  template: `${CPP_HEADER}int trap(vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, ml = 0, mr = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) {
            if (h[l] >= ml) ml = h[l];
            else ans += ml - h[l];
            l++;
        } else {
            if (h[r] >= mr) mr = h[r];
            else ans += mr - h[r];
            r--;
        }
    }
    return ans;
}`,
  problems: [
    { id: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 2-13: as-is (two-pointer: water at i = min(maxL,maxR) - height[i]).' },
    { id: 135, title: 'Candy', slug: 'candy', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Forward: if ratings[i]>ratings[i-1], candies[i]=candies[i-1]+1. Backward: if ratings[i]>ratings[i+1], candies[i]=max(candies[i],candies[i+1]+1).', variationCode: 'vector<int> left(n,1),right(n,1); for i 1..n-1 if(ratings[i]>ratings[i-1]) left[i]=left[i-1]+1; for i n-2..0 if(ratings[i]>ratings[i+1]) right[i]=right[i+1]+1; int ans=0; for i 0..n-1 ans+=max(left[i],right[i]);' },
    { id: 1525, title: 'Good Ways to Split', slug: 'number-of-good-ways-to-split-a-string', companies: ['GOOGLE'], lineChanges: 'Prefix unique count + suffix unique count; count positions where prefix==suffix.', variationCode: 'int n=s.size(); vector<int> pre(n),suf(n); unordered_set<char> se; for i: se.insert(s[i]); pre[i]=se.size(); se.clear(); for i n-1..0: se.insert(s[i]); suf[i]=se.size(); int ans=0; for i 0..n-2 if(pre[i]==suf[i+1]) ans++; return ans;' },
  ],
  pitfalls: ['❌ Rain water: O(n²) brute vs O(n) two-pointer.', '❌ Candy: forward-only pass misses decreasing sequence — need backward pass too.'],
  edgeCases: [{ input: 'descending heights', breaks: 'no water trapped' }, { input: 'flat ratings', breaks: 'each child gets 1 candy' }],
  interviewTip: '💡 "Trapping rain water" → two-pointer: drop shorter side. "Candy" → forward then backward.',
})

// ── Incremental Construction Leaves ──────────────────────────────

export const digitCharConstructLeaf = leaf('digit-char-construct', 'Digit/Character Construction', 'purple', {
  template: `${CPP_HEADER}string removeKdigits(string num, int k) {
    string ans;
    for (char c : num) {
        while (!ans.empty() && k > 0 && ans.back() > c) {
            ans.pop_back();
            k--;
        }
        if (!ans.empty() || c != '0') ans.push_back(c);
    }
    while (k-- > 0 && !ans.empty()) ans.pop_back();
    return ans.empty() ? "0" : ans;
}`,
  problems: [
    { id: 402, title: 'Remove K Digits', slug: 'remove-k-digits', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-9: as-is (monotonic stack: remove larger peaks; skip leading zeros).' },
    { id: 316, title: 'Remove Duplicate Letters', slug: 'remove-duplicate-letters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Count freq; stack with visited set; while top > c && remaining freq > 0, pop.', variationCode: `vector<int> cnt(26),vis(26); for each c: cnt[c]++; string ans; for each c: { cnt[c]--; if(vis[c]) continue; while(!ans.empty() && ans.back()>c && cnt[ans.back()-'a']>0){ vis[ans.back()-'a']=0; ans.pop_back(); } ans.push_back(c); vis[c]=1; }` },
    { id: 321, title: 'Create Maximum Number', slug: 'create-maximum-number', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'For each split i (len=k): max number from first array of len i + max from second of len k-i; merge largest.', variationCode: 'auto maxNum=[](vector<int>& a,int k){ vector<int> s; int drop=a.size()-k; for x:a{ while(drop&&!s.empty()&&s.back()<x){ s.pop_back(); drop--; } s.push_back(x); } s.resize(k); return s; };' },
  ],
  pitfalls: ['❌ Remove K digits: forgetting to skip leading zeros — "0200" should become "200".', '❌ Remove duplicate letters: not checking remaining frequency before popping.'],
  edgeCases: [{ input: 'remove all digits', breaks: 'return "0"' }, { input: 'k=0', breaks: 'return original' }],
  interviewTip: '💡 "Remove K digits" → monotonic stack: remove larger left peaks. "Duplicate letters" → stack + freq check.',
})

export const greedyExchangeLeaf = leaf('greedy-exchange', 'Greedy Exchange Arguments', 'purple', {
  template: `${CPP_HEADER}int minDominoRotations(vector<int>& tops, vector<int>& bottoms) {
    int n = (int)tops.size();
    auto check = [&](int x) {
        int tRot = 0, bRot = 0;
        for (int i = 0; i < n; i++) {
            if (tops[i] != x && bottoms[i] != x) return n + 1;
            if (tops[i] != x) tRot++;
            if (bottoms[i] != x) bRot++;
        }
        return min(tRot, bRot);
    };
    int ans = min({check(tops[0]), check(bottoms[0])});
    return ans > n ? -1 : ans;
}`,
  problems: [
    { id: 1007, title: 'Min Domino Rotations', slug: 'minimum-domino-rotations-for-equal-row', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 2-13: check if all dominos can become all tops[0] or all bottoms[0].' },
    { id: 1247, title: 'Min Swaps Make Equal', slug: 'minimum-swaps-to-make-strings-equal', companies: ['GOOGLE'], lineChanges: 'Count x-y and y-x mismatches; if odd total, impossible; 2 mismatches = 1 swap (xx/yy patterns).', variationCode: `int xy=0,yx=0; for i: if(s1[i]!=s2[i]){ if(s1[i]=='x') xy++; else yx++; } return (xy+yx)%2 ? -1 : (xy/2+yx/2 + (xy%2)*2);` },
    { id: 670, title: 'Maximum Swap', slug: 'maximum-swap', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'For each position, find the largest digit to the right; swap leftmost with rightmost max.', variationCode: `string s=to_string(num); int n=s.size(); vector<int> last(10,-1); for i: last[s[i]-'0']=i; for i: for d 9..s[i]-'0'+1: if(last[d]>i){ swap(s[i],s[last[d]]); return stoi(s); } return num;` },
  ],
  pitfalls: ['❌ Domino rotations: assuming only tops[0] works — must check both candidates.', '❌ Maximum swap: swapping largest digit at the RIGHTMOST occurrence, not leftmost.'],
  edgeCases: [{ input: 'all same dominoes', breaks: '0 rotations' }, { input: 'already max swap', breaks: 'return num' }],
  interviewTip: '💡 "Domino rotations" → try both possible values. "Maximum swap" → rightmost max digit.',
})

export const prioritizedProcessingLeaf = leaf('prioritized-processing', 'Prioritized Processing', 'purple', {
  template: `${CPP_HEADER}int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n = (int)profits.size();
    vector<pair<int,int>> projects;
    for (int i = 0; i < n; i++)
        projects.push_back({capital[i], profits[i]});
    sort(projects.begin(), projects.end());
    priority_queue<int> pq;
    int i = 0;
    while (k--) {
        while (i < n && projects[i].first <= w)
            pq.push(projects[i++].second);
        if (pq.empty()) break;
        w += pq.top(); pq.pop();
    }
    return w;
}`,
  problems: [
    { id: 502, title: 'IPO', slug: 'ipo', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2-15: as-is (sort by capital; max-heap of available profits; pick best).' },
    { id: 358, title: 'Rearrange k Apart', slug: 'rearrange-string-k-distance-apart', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Count freq; max-heap by frequency; place most frequent then wait k steps before reusing.', variationCode: 'priority_queue<pair<int,char>> pq; queue< pair<int,pair<int,char>> > wait; for each freq: pq.push({freq,char}); while(!pq.empty()){ auto[f,c]=pq.top(); pq.pop(); ans.push_back(c); wait.push({f-1,{c,curIdx}}); if(wait.front().second.second <= curIdx-k+1){ auto& p=wait.front(); if(p.first>0) pq.push({p.first,p.second.first}); wait.pop(); } curIdx++; }' },
    { id: 1353, title: 'Max Events Attended', slug: 'maximum-number-of-events-that-can-be-attended', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Sort by start day; for each day, add available events to min-heap by end day; attend earliest-ending.', variationCode: 'sort(events); priority_queue<int,vector<int>,greater<>> pq; int i=0,ans=0; for d 1..100000: { while(i<n&&events[i][0]<=d) pq.push(events[i++][1]); while(!pq.empty()&&pq.top()<d) pq.pop(); if(!pq.empty()){ pq.pop(); ans++; } }' },
  ],
  pitfalls: ['❌ IPO: forgetting to sort by capital ascending before iterating.', '❌ Max events: iterating days 1..100000 is O(D log N) — ok for 10^5 range.'],
  edgeCases: [{ input: 'no projects affordable', breaks: 'return w' }, { input: 'k larger than affordable projects', breaks: 'stop when empty' }],
  interviewTip: '💡 "IPO" → sort by capital, max-heap of profits. "Max events" → min-heap by end day.',
})
