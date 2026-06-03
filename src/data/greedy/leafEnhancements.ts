import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Interval Processing ──────────────────────────────────────────

  'activity-select': e({
    xray: [
      { text: 'Sort intervals by **end** time', kind: 'signal' },
      { text: 'Greedy: pick interval with earliest finish that does not overlap', kind: 'goal' },
    ],
    budget: ['sort by end', 'non-overlapping count'],
    slottedTemplate: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });
    int keep = 0, end = INT_MIN;
    for (auto& iv : intervals) {
        if (/* SLOT: pickCondition */) { keep++; end = iv[1]; }
    }
    return (int)intervals.size() - keep;
}`,
    slots: [
      { id: 'PICK_CONDITION', label: 'When to pick this interval', hint: 'iv[0] >= end vs iv[0] > end' },
    ],
    slotFills: {
      435: { PICK_CONDITION: 'iv[0] >= end' },
      452: { PICK_CONDITION: 'iv[0] > end; end = min(end, iv[1])' },
      1326: { PICK_CONDITION: 'iv[0] <= far; nextFar = max(nextFar, iv[1])' },
    },
    helixOrder: [435, 452, 1326],
    helixDelta: {
      435: 'Classic: count non-overlapping intervals to delete.',
      452: 'Balloon burst: end = min(end, iv[1]), count arrows.',
      1326: 'Cover [0,n]: sort by start, track farthest reach; return -1 if gap.',
    },
    autopsies: [
      {
        cause: 'Sorting by start instead of end for max count',
        wrong: 'sort(intervals.begin(), intervals.end()); // sorts by start',
        testCase: '[[1,10],[2,3],[4,5]] — by start picks [1,10], by end picks [2,3],[4,5]',
        fix: 'sort by a[1] < b[1] (end time) for max non-overlapping count',
      },
      {
        cause: 'Using > vs >= for touch detection',
        wrong: 'if (iv[0] > end) // treats [1,2] and [2,3] as overlapping',
        testCase: 'intervals that touch at endpoint — should be allowed',
        fix: 'use >= for non-overlapping (touch is OK), > for arrows (burst at same point)',
      },
    ],
    sayIt: [
      'Activity selection: sort by END, pick if start >= last end.',
      'Arrows: pop balloons by merging overlapping; sort by END.',
      'Min taps: transform to intervals, greedy cover [0,n] with BFS-like tiers.',
    ],
  }),

  'interval-merge': e({
    xray: [
      { text: 'Sort intervals by **start**', kind: 'signal' },
      { text: 'Extend last end if overlapping, else push', kind: 'goal' },
    ],
    budget: ['sort by start', 'merge overlapping'],
    slottedTemplate: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> out;
    for (auto& iv : intervals) {
        if (/* SLOT: mergeCondition */) out.push_back(iv);
        else out.back()[1] = max(out.back()[1], iv[1]);
    }
    return out;
}`,
    slots: [
      { id: 'MERGE_CONDITION', label: 'When to start a new interval', hint: 'out.empty() || out.back()[1] < iv[0]' },
    ],
    slotFills: {
      56: { MERGE_CONDITION: 'out.empty() || out.back()[1] < iv[0]' },
      986: { MERGE_CONDITION: 'lo = max(A[i][0], B[j][0]); hi = min(A[i][1], B[j][1]); if (lo <= hi) push' },
      1024: { MERGE_CONDITION: 'iv[0] <= end; extend far = max(far, iv[1])' },
    },
    helixOrder: [56, 986, 1024],
    helixDelta: {
      56: 'Combine touching/overlapping ranges into union.',
      986: 'Two sorted lists: compare interval endpoints, advance smaller end.',
      1024: 'Greedy farthest reach; count segments to cover target.',
    },
    autopsies: [
      {
        cause: 'Not sorting by start first',
        wrong: 'for loop on unsorted intervals',
        testCase: '[[2,3],[1,4]] — output should be [[1,4]]',
        fix: 'sort(intervals.begin(), intervals.end()) by start',
      },
    ],
    sayIt: [
      'Merge: sort by START, extend last or push new.',
      'Intersections: two-pointer on sorted lists, take overlap.',
      'Video stitching: greedy farthest reach sort by start.',
    ],
  }),

  'interval-coverage': e({
    xray: [
      { text: 'Sort by start ascending, end **descending** for covered intervals', kind: 'signal' },
      { text: 'Partition labels: track **last occurrence** of each char', kind: 'signal' },
    ],
    budget: ['cover range', 'partition labels'],
    slottedTemplate: `int removeCoveredIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return /* SLOT: sortKey */; });
    int remain = 0, far = 0;
    for (auto& iv : intervals) {
        if (iv[1] > far) { remain++; far = iv[1]; }
    }
    return remain;
}`,
    slots: [
      { id: 'SORT_KEY', label: 'Sort comparator for intervals', hint: 'start asc, end desc vs start desc' },
    ],
    slotFills: {
      1288: { SORT_KEY: 'a[0] < b[0] || (a[0] == b[0] && a[1] > b[1])' },
      763: { SORT_KEY: 'n/a — use last-occurrence array instead of intervals' },
    },
    helixOrder: [1288, 763],
    helixDelta: {
      1288: 'Sort start asc, end desc; keep if extends beyond current end.',
      763: 'Record last index each char. Scan, update end. When i == end, cut.',
    },
    autopsies: [
      {
        cause: 'Remove covered: sorting start asc, end asc',
        wrong: 'sort by start then end asc — smaller interval may be first',
        testCase: '[[1,4],[1,2]] — [1,2] appears before [1,4]',
        fix: 'sort by start asc, end DESC so larger intervals come first for equal start',
      },
    ],
    sayIt: [
      'Covered: sort by start asc, end desc; keep if extends farther.',
      'Partition labels: last-index array, max end, cut when i == maxEnd.',
    ],
  }),

  'skyline-sweep': e({
    xray: [
      { text: 'Event points: **+1** at start, **-1** at end', kind: 'signal' },
      { text: 'Skyline: multiset of active heights', kind: 'signal' },
    ],
    budget: ['events +1/-1', 'track max concurrent'],
    slottedTemplate: `int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<pair<int,int>> events;
    for (auto& iv : intervals) {
        events.push_back({iv[0], /* SLOT: startVal */});
        events.push_back({iv[1], /* SLOT: endVal */});
    }
    sort(events.begin(), events.end());
    int cur = 0, ans = 0;
    for (auto& e : events) {
        cur += e.second;
        ans = max(ans, cur);
    }
    return ans;
}`,
    slots: [
      { id: 'START_VAL', label: 'Value added at interval start', hint: '+1 for meeting rooms' },
      { id: 'END_VAL', label: 'Value at interval end', hint: '-1 for meeting rooms' },
    ],
    slotFills: {
      253: { START_VAL: '1', END_VAL: '-1' },
      218: { START_VAL: '-height (so tallest processed first)', END_VAL: 'height' },
      759: { START_VAL: '1', END_VAL: '-1' },
    },
    helixOrder: [253, 218, 759],
    helixDelta: {
      253: 'Simple +1/-1; track max concurrent meetings.',
      218: 'Skyline: multiset of heights; record when max height changes.',
      759: 'Merge all employee intervals; gaps between merged blocks = free time.',
    },
    autopsies: [
      {
        cause: 'Skyline: not sorting by start before height for equal-x events',
        wrong: 'sort events by x only',
        testCase: 'start and end at same x — start should come before end',
        fix: 'sort by (x, type) where start before end, or encode start as negative height',
      },
    ],
    sayIt: [
      'Meeting rooms: sweep line +1/-1, track peak.',
      'Skyline: multiset of heights, push/erase, record when max changes.',
      'Free time: merge intervals, gaps = free.',
    ],
  }),

  kruskals: e({
    xray: [
      { text: 'Sort **edges** by weight ascending', kind: 'signal' },
      { text: 'Union-find to skip edges that create a cycle', kind: 'signal' },
    ],
    budget: ['sort edges', 'DSU', 'cycle detection'],
    slottedTemplate: `int kruskal(vector<array<int,3>>& edges, int n) {
    sort(edges.begin(), edges.end());
    DSU dsu(n);
    int cost = 0;
    for (auto& [w, u, v] : edges) {
        if (/* SLOT: uniteCondition */) cost += w;
    }
    return cost;
}`,
    slots: [
      { id: 'UNITE_CONDITION', label: 'When to include this edge', hint: 'dsu.unite(u, v)' },
    ],
    slotFills: {
      1584: { UNITE_CONDITION: 'dsu.unite(u, v)' },
      1489: { UNITE_CONDITION: 'forceInclude || dsu.unite(u, v); forceExclude -> skip' },
    },
    helixOrder: [1584, 1489],
    helixDelta: {
      1584: 'Standard Kruskal: generate all edges, sort, DSU unite.',
      1489: 'For each edge: test critical (skipping makes weight bigger) vs pseudo-critical.',
    },
    autopsies: [
      {
        cause: 'Not using path compression in find()',
        wrong: 'int find(int x) { while (parent[x] != x) x = parent[x]; return x; }',
        testCase: 'deep chain of unions — O(n) per find',
        fix: 'add path compression: if (parent[x] != x) parent[x] = find(parent[x]);',
      },
    ],
    sayIt: [
      'Kruskal: sort all edges by weight; union-find to detect cycles.',
      'Critical edges: force include or exclude each edge; compare MST weight.',
    ],
  }),

  prims: e({
    xray: [
      { text: 'Start from **any** node', kind: 'signal' },
      { text: 'Always add **cheapest** edge connecting visited to unvisited', kind: 'goal' },
    ],
    budget: ['O(n²) dense', 'priority queue', 'minDist array'],
    slottedTemplate: `int prims(int n, vector<vector<int>>& adj) {
    vector<bool> vis(n, false);
    vector<int> minDist(n, INT_MAX);
    int cost = 0;
    minDist[0] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = /* SLOT: findMin */;
        vis[u] = true;
        cost += minDist[u];
        for (int v = 0; v < n; v++)
            if (!vis[v]) minDist[v] = min(minDist[v], /* SLOT: edgeWeight(u,v) */);
    }
    return cost;
}`,
    slots: [
      { id: 'FIND_MIN', label: 'Find unvisited node with smallest distance', hint: 'linear scan O(n) or PQ' },
      { id: 'EDGE_WEIGHT', label: 'Cost between u and v', hint: 'weight[u][v]' },
    ],
    slotFills: {
      1135: { FIND_MIN: 'loop to find !vis[i] with smallest minDist[i]', EDGE_WEIGHT: 'cost[u][i]' },
      1168: { FIND_MIN: 'same linear scan O(n)', EDGE_WEIGHT: 'cost[i] for virtual node' },
    },
    helixOrder: [1135, 1168],
    helixDelta: {
      1135: 'Standard Prim on adjacency matrix from edge list.',
      1168: 'Add virtual node 0 with edges cost = well[i]; Prim on n+1 nodes.',
    },
    autopsies: [
      {
        cause: 'Prim: not initializing minDist[0]=0',
        wrong: 'vector<int> minDist(n, INT_MAX); // all INF',
        testCase: 'first iteration picks wrong node',
        fix: 'minDist[0] = 0 before loop',
      },
    ],
    sayIt: [
      'Prim: O(n²) for dense graphs; always pick cheapest frontier edge.',
      'Water distribution: add virtual well node, run MST on n+1 nodes.',
    ],
  }),

  // ── Selection Problems ───────────────────────────────────────────

  'freq-select': e({
    xray: [
      { text: 'Frequency / **count** of each element drives decision', kind: 'signal' },
      { text: 'Task scheduler: idle slots formula', kind: 'signal' },
    ],
    budget: ['boyer-moore', 'freq sort', 'idle formula'],
    slottedTemplate: `int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) { candidate = x; count = 1; }
        else if (x == candidate) count++;
        else /* SLOT: decrementOrReset */;
    }
    return candidate;
}`,
    slots: [
      { id: 'DECREMENT', label: 'When candidate != current', hint: 'count--' },
    ],
    slotFills: {
      169: { DECREMENT: 'count--' },
      621: { DECREMENT: 'n/a — use freq sort and idle formula' },
      1090: { DECREMENT: 'n/a — sort by value, track used per label' },
    },
    helixOrder: [169, 621, 1090],
    helixDelta: {
      169: 'Boyer-Moore voting: cancel pairs, remaining is majority.',
      621: 'Idle slots = (maxFreq-1)*n; subtract other tasks.',
      1090: 'Sort by value descending; take if label count under limit.',
    },
    autopsies: [
      {
        cause: 'Task scheduler: not using max frequency formula',
        wrong: 'simulate each time unit O(n * time)',
        testCase: 'tasks = ["A","A","A","B","B","B"], n=2',
        fix: '(maxFreq-1)*n + count of tasks with maxFreq',
      },
    ],
    sayIt: [
      'Majority: Boyer-Moore O(n) O(1) cancel pairs.',
      'Task scheduler: max freq determines idle slots.',
    ],
  }),

  'value-select': e({
    xray: [
      { text: 'Compare values directly to make selection', kind: 'signal' },
      { text: 'Sort by cost difference for two-city', kind: 'signal' },
    ],
    budget: ['sort and match', 'cost difference'],
    slottedTemplate: `int twoCitySchedCost(vector<vector<int>>& costs) {
    sort(costs.begin(), costs.end(),
         [](auto& a, auto& b) { return /* SLOT: sortKey */; });
    int n = (int)costs.size() / 2, ans = 0;
    for (int i = 0; i < n; i++) ans += costs[i][0];
    for (int i = n; i < 2*n; i++) ans += costs[i][1];
    return ans;
}`,
    slots: [
      { id: 'SORT_KEY', label: 'Sort comparator for selection', hint: 'cost difference' },
    ],
    slotFills: {
      1029: { SORT_KEY: 'a[0]-a[1] < b[0]-b[1]' },
      455: { SORT_KEY: 'n/a — sort greed g and cookies s, match' },
      1046: { SORT_KEY: 'n/a — use max-heap' },
    },
    helixOrder: [455, 1029, 1046],
    helixDelta: {
      455: 'Sort both appetite and cookie sizes; greedy match smallest sufficient.',
      1029: 'Sort by costA-costB (savings); first half fly to A.',
      1046: 'Max-heap: smash two largest stones repeatedly.',
    },
    autopsies: [
      {
        cause: 'Two city: not sorting by difference',
        wrong: 'sort by costA then costB',
        testCase: '[[400,200],[100,500]] — should send person 1 to B, person 2 to A',
        fix: 'sort by costA - costB (savings of choosing A over B)',
      },
    ],
    sayIt: [
      'Cookies: sort both; match smallest satisfying greed.',
      'Two city: sort by savings (costA - costB); first half to A.',
      'Stone weight: max-heap, smash two largest.',
    ],
  }),

  'ratio-select': e({
    xray: [
      { text: 'Value/**weight** ratio or efficiency metric', kind: 'signal' },
      { text: 'Work **backward** for broken calculator', kind: 'signal' },
      { text: 'Gas station: **running deficit** tracking', kind: 'signal' },
    ],
    budget: ['two-pointer', 'work backward', 'running sum'],
    slottedTemplate: `int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int l = 0, r = (int)people.size() - 1, boats = 0;
    while (l <= r) {
        if (/* SLOT: pairCondition */) l++;
        r--; boats++;
    }
    return boats;
}`,
    slots: [
      { id: 'PAIR_CONDITION', label: 'When to pair light+heavy', hint: 'people[l] + people[r] <= limit' },
    ],
    slotFills: {
      881: { PAIR_CONDITION: 'people[l] + people[r] <= limit' },
      991: { PAIR_CONDITION: 'n/a — while target > startValue: if even /2 else +1' },
      134: { PAIR_CONDITION: 'n/a — total sum + running deficit reset' },
    },
    helixOrder: [881, 991, 134],
    helixDelta: {
      881: 'Lightest + heaviest pair if fit; else heaviest alone.',
      991: 'Work backward: if target even, divide by 2; else add 1.',
      134: 'Track total and running sum; reset start when deficit.',
    },
    autopsies: [
      {
        cause: 'Broken calculator: working forward instead of backward',
        wrong: 'while (startValue < target) startValue *= 2, startValue--, ...',
        testCase: 'startValue=3, target=10 — forward is exponential',
        fix: 'while target > startValue: if even target/=2 else target+=1',
      },
    ],
    sayIt: [
      'Boats: sort, pair lightest+heaviest if fit.',
      'Broken calculator: work BACKWARD from target.',
      'Gas station: total sum + running deficit reset = O(n) O(1).',
    ],
  }),

  'iterative-construction': e({
    xray: [
      { text: 'Build result one step at a time with **heap**', kind: 'signal' },
      { text: 'Always combine/choose the **smallest** or **best** current option', kind: 'goal' },
    ],
    budget: ['min-heap', 'greedy combine'],
    slottedTemplate: `int connectSticks(vector<int>& sticks) {
    priority_queue<int, vector<int>, greater<int>> pq(sticks.begin(), sticks.end());
    int cost = 0;
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        cost += /* SLOT: combineCost */;
        pq.push(/* SLOT: combinedStick */);
    }
    return cost;
}`,
    slots: [
      { id: 'COMBINE_COST', label: 'Cost of combining two elements', hint: 'a + b' },
      { id: 'COMBINED_STICK', label: 'Result after combining', hint: 'a + b' },
    ],
    slotFills: {
      1167: { COMBINE_COST: 'a + b', COMBINED_STICK: 'a + b' },
      1578: { COMBINE_COST: 'n/a — for each color group, keep max cost, remove rest' },
      870: { COMBINE_COST: 'n/a — sort both; assign smallest > B[i] or largest A to biggest B' },
    },
    helixOrder: [1167, 1578, 870],
    helixDelta: {
      1167: 'Always combine the two smallest sticks; O(n log n).',
      1578: 'Group same color; keep max cost balloon, sum the rest.',
      870: 'Sort A and B; greedy assign A[i] > B[j] or sacrifice largest A.',
    },
    autopsies: [
      {
        cause: 'Connect sticks: re-sorting every iteration',
        wrong: 'while (sticks.size()>1) { sort(sticks.begin(), sticks.end()); ... }',
        testCase: '4 sticks — O(n² log n)',
        fix: 'use min-heap O(n log n)',
      },
    ],
    sayIt: [
      'Connect sticks: min-heap, always combine two smallest.',
      'Rope colorful: keep max per color group, remove rest.',
      'Advantage shuffle: sort, use two-pointer assignment.',
    ],
  }),

  // ── Greedy Path & Search ─────────────────────────────────────────

  'path-building': e({
    xray: [
      { text: 'Track **max reachable** index in array', kind: 'signal' },
      { text: 'Jump Game II: count **tiers** (BFS-like)', kind: 'signal' },
    ],
    budget: ['max reach', 'tier counting', 'bfs jumps'],
    slottedTemplate: `bool canJump(vector<int>& nums) {
    int far = 0;
    for (int i = 0; i <= far && i < (int)nums.size(); i++) {
        far = max(far, i + nums[i]);
        if (far >= (int)nums.size() - 1) return true;
    }
    return false;
}`,
    slots: [
      { id: 'JUMP_LOGIC', label: 'Per-element logic beyond tracking farthest', hint: 'none for basic' },
    ],
    slotFills: {
      55: { JUMP_LOGIC: 'none — simple farthest reach check' },
      45: { JUMP_LOGIC: 'when i == end: jumps++, end = far' },
      1306: { JUMP_LOGIC: 'BFS/DFS from start to index with arr[i]==0' },
    },
    helixOrder: [55, 45, 1306],
    helixDelta: {
      55: 'Track max reachable index; return true if reach end.',
      45: 'BFS tiers: increment jumps when current tier ends.',
      1306: 'BFS/DFS from start to any 0-valued index.',
    },
    autopsies: [
      {
        cause: 'Jump Game II: BFS instead of greedy tier counting',
        wrong: 'BFS on all reachable states O(n²)',
        testCase: 'large array with many jumps',
        fix: 'greedy: track currentEnd and farthest; inc jumps when i==currentEnd',
      },
    ],
    sayIt: [
      'Jump Game: one pass, farthest reachable.',
      'Jump Game II: greedy tier counting for min jumps.',
      'Jump Game III: BFS/DFS to find zero.',
    ],
  }),

  'graph-exploration': e({
    xray: [
      { text: '**Dijkstra-like** priority queue on grid', kind: 'signal' },
      { text: 'Edge weight = **max** diff between adjacent cells', kind: 'signal' },
    ],
    budget: ['priority queue', 'min-max path', 'max-min path'],
    slottedTemplate: `int minimumEffortPath(vector<vector<int>>& heights) {
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
            int nd = /* SLOT: newDist */;
            if (nd < dist[ni][nj]) { dist[ni][nj] = nd; pq.push({nd, ni, nj}); }
        }
    }
    return 0;
}`,
    slots: [
      { id: 'NEW_DIST', label: 'New distance to neighbor', hint: 'max(d, abs(h[i][j]-h[ni][nj]))' },
    ],
    slotFills: {
      1631: { NEW_DIST: 'max(d, abs(heights[i][j] - heights[ni][nj]))' },
      1102: { NEW_DIST: 'min(d, grid[ni][nj]) // using max-heap' },
      778: { NEW_DIST: 'max(d, grid[ni][nj])' },
    },
    helixOrder: [1631, 1102, 778],
    helixDelta: {
      1631: 'Minimize max diff: Dijkstra on elevation change.',
      1102: 'Maximize min value: max-heap PQ, track min so far.',
      778: 'Minimize max elevation: Dijkstra on cell value.',
    },
    autopsies: [
      {
        cause: 'Using BFS instead of Dijkstra for min-max path',
        wrong: 'queue (BFS) — assumes uniform edge weight',
        testCase: 'grid with varying elevation diffs',
        fix: 'use priority_queue (Dijkstra) since edge weights vary',
      },
    ],
    sayIt: [
      'Min effort: Dijkstra, weight = max diff between cells.',
      'Max min value: max-heap, track min value along path.',
      'Swim: Dijkstra on elevation, return min needed to reach end.',
    ],
  }),

  'string-construction': e({
    xray: [
      { text: '**Frequency** of each character constraint', kind: 'signal' },
      { text: 'If most frequent > ceil(n/2), **impossible**', kind: 'constraint' },
    ],
    budget: ['feasibility check', 'even/odd placement', 'max-heap freq'],
    slottedTemplate: `string reorganizeString(string s) {
    int freq[26] = {};
    for (char c : s) freq[c-'a']++;
    int maxIdx = /* SLOT: findMaxFreq */;
    if (freq[maxIdx] > ((int)s.size() + 1) / 2) return "";
    string ans(s.size(), ' ');
    int pos = 0;
    for (int i = 0; i < 26; i++) {
        int idx = (i == 0) ? maxIdx : (i <= maxIdx ? i - 1 : i);
        while (freq[idx]--) {
            if (pos >= (int)s.size()) pos = 1;
            ans[pos] = (char)('a' + idx);
            pos += 2;
        }
    }
    return ans;
}`,
    slots: [
      { id: 'FIND_MAX_FREQ', label: 'Index of most frequent character', hint: 'loop 1..25' },
    ],
    slotFills: {
      767: { FIND_MAX_FREQ: 'loop 1..25 if (freq[i] > freq[maxIdx]) maxIdx = i' },
      1405: { FIND_MAX_FREQ: 'use max-heap of {freq, char}' },
      484: { FIND_MAX_FREQ: 'n/a — start with 1..n, reverse D segments' },
    },
    helixOrder: [767, 1405, 484],
    helixDelta: {
      767: 'Place most frequent in even positions, rest in odd positions.',
      1405: 'Always append most frequent char that avoids triple same.',
      484: 'Start with increasing; reverse each D (decreasing) segment.',
    },
    autopsies: [
      {
        cause: 'Reorganize string: not checking feasibility first',
        wrong: 'start placing chars without checking max freq',
        testCase: '"aaab" — a appears 3 > ceil(4/2)=2',
        fix: 'if (maxFreq > (n+1)/2) return ""',
      },
    ],
    sayIt: [
      'Reorganize: check feasibility, place odd then even positions.',
      'Happy string: max-heap, avoid triple same.',
      'Permutation: DI string, reverse segments on D.',
    ],
  }),

  // ── Prefix/Suffix Optimization ──────────────────────────────────

  'prefix-sum': e({
    xray: [
      { text: '**Kadane** algorithm: drop negative prefix', kind: 'signal' },
      { text: 'Prefix sum for subarray range sum', kind: 'signal' },
    ],
    budget: ['kadane', 'min prefix', 'prefix sum'],
    slottedTemplate: `int maxSubArray(vector<int>& nums) {
    int cur = 0, best = INT_MIN;
    for (int x : nums) {
        cur = /* SLOT: updateCur */;
        best = max(best, cur);
    }
    return best;
}`,
    slots: [
      { id: 'UPDATE_CUR', label: 'Update running sum', hint: 'max(x, cur + x)' },
    ],
    slotFills: {
      53: { UPDATE_CUR: 'max(x, cur + x)' },
      121: { UPDATE_CUR: 'minPrice = min(minPrice, x); ans = max(ans, x - minPrice)' },
      918: { UPDATE_CUR: 'curMax = max(x, curMax + x); curMin = min(x, curMin + x)' },
      1423: { UPDATE_CUR: 'n/a — sliding window of size n-k to find min subarray sum' },
    },
    helixOrder: [53, 121, 918, 1423],
    helixDelta: {
      53: 'Kadane: cur = max(x, cur+x); track best.',
      121: 'Track min price seen so far; ans = max(ans, price - min).',
      918: 'Circular: max of (Kadane max) or (total - min subarray sum).',
      1423: 'Total - min subarray sum of length n-k (sliding window).',
    },
    autopsies: [
      {
        cause: 'Kadane: resetting cur to 0 when negative',
        wrong: 'cur = max(0, cur + x)',
        testCase: '[-2,-1] — resets to 0 instead of returning -1',
        fix: 'cur = max(x, cur + x)',
      },
    ],
    sayIt: [
      'Kadane: cur = max(x, cur + x); best = max(best, cur).',
      'Stock: track min price, max profit = price - min.',
      'Circular: max(non-circular, total - min subarray).',
    ],
  }),

  'running-min-max': e({
    xray: [
      { text: 'Track **running sum** or **deficit**', kind: 'signal' },
      { text: 'Reset on negative (gas station style)', kind: 'signal' },
    ],
    budget: ['running total', 'deficit reset', 'max-heap refuel'],
    slottedTemplate: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, sum = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        total += gas[i] - cost[i];
        sum += gas[i] - cost[i];
        if (/* SLOT: resetCondition */) { sum = 0; start = i + 1; }
    }
    return total < 0 ? -1 : start;
}`,
    slots: [
      { id: 'RESET_CONDITION', label: 'When to reset start point', hint: 'sum < 0' },
    ],
    slotFills: {
      134: { RESET_CONDITION: 'sum < 0' },
      659: { RESET_CONDITION: 'n/a — track freq and need map for consecutive chains' },
      871: { RESET_CONDITION: 'n/a — max-heap of passed stations, pop when fuel empty' },
    },
    helixOrder: [134, 659, 871],
    helixDelta: {
      134: 'Track total and running sum; reset start when sum negative.',
      659: 'Greedy chain extension: freq map + need map for consecutive subsequences.',
      871: 'Max-heap of passed stations; refuel with largest when empty.',
    },
    autopsies: [
      {
        cause: 'Gas station: O(n²) simulation',
        wrong: 'for i 0..n-1 { simulate from i; if reach start return i; }',
        testCase: 'large n, one valid start',
        fix: 'O(n): total sum + running deficit reset',
      },
    ],
    sayIt: [
      'Gas station: total sum + running deficit → start candidate.',
      'Consecutive subsequences: freq + need tracking.',
      'Refueling: max-heap of stations passed; pop when fuel runs out.',
    ],
  }),

  'two-pass': e({
    xray: [
      { text: '**Two-pass**: forward then backward combine', kind: 'signal' },
      { text: 'Candy: left pass handles increasing, right pass handles decreasing', kind: 'signal' },
    ],
    budget: ['forward pass', 'backward pass', 'combine'],
    slottedTemplate: `int candy(vector<int>& ratings) {
    int n = (int)ratings.size();
    vector<int> left(n, 1), right(n, 1);
    for (int i = 1; i < n; i++)
        /* SLOT: forwardPass */;
    for (int i = n - 2; i >= 0; i--)
        /* SLOT: backwardPass */;
    int ans = 0;
    for (int i = 0; i < n; i++) ans += max(left[i], right[i]);
    return ans;
}`,
    slots: [
      { id: 'FORWARD_PASS', label: 'Forward scan logic', hint: 'if(ratings[i]>ratings[i-1]) left[i]=left[i-1]+1' },
      { id: 'BACKWARD_PASS', label: 'Backward scan logic', hint: 'if(ratings[i]>ratings[i+1]) right[i]=right[i+1]+1' },
    ],
    slotFills: {
      42: { FORWARD_PASS: 'n/a — two-pointer in one pass', BACKWARD_PASS: 'n/a' },
      135: { FORWARD_PASS: 'if(ratings[i]>ratings[i-1]) left[i]=left[i-1]+1', BACKWARD_PASS: 'if(ratings[i]>ratings[i+1]) right[i]=right[i+1]+1' },
      1525: { FORWARD_PASS: 'insert s[i] into set; pre[i]=set.size()', BACKWARD_PASS: 'insert s[i] into set; suf[i]=set.size()' },
    },
    helixOrder: [42, 135, 1525],
    helixDelta: {
      42: 'Two-pointer: drop shorter side, add trapped water.',
      135: 'Forward: increasing. Backward: decreasing. Combine via max.',
      1525: 'Prefix unique count + suffix unique count; count equal splits.',
    },
    autopsies: [
      {
        cause: 'Candy: forward pass only',
        wrong: 'only one pass left-to-right',
        testCase: '[5,4,3] descending — left pass gives [1,1,1]',
        fix: 'forward + backward pass; take max at each position',
      },
    ],
    sayIt: [
      'Rain water: two-pointer, drop shorter side.',
      'Candy: forward pass + backward pass; take max.',
      'Split string: prefix + suffix unique counts: count matches.',
    ],
  }),

  // ── Incremental Construction ─────────────────────────────────────

  'digit-char-construct': e({
    xray: [
      { text: '**Monotonic stack**: remove larger/out-of-order elements', kind: 'signal' },
      { text: 'Skip leading zeros after construction', kind: 'constraint' },
    ],
    budget: ['monotonic stack', 'remaining count check'],
    slottedTemplate: `string removeKdigits(string num, int k) {
    string ans;
    for (char c : num) {
        while (!ans.empty() && k > 0 && /* SLOT: popCondition */) {
            ans.pop_back(); k--;
        }
        if (!ans.empty() || c != '0') ans.push_back(c);
    }
    while (k-- > 0 && !ans.empty()) ans.pop_back();
    return ans.empty() ? "0" : ans;
}`,
    slots: [
      { id: 'POP_CONDITION', label: 'When to pop the last character', hint: 'ans.back() > c' },
    ],
    slotFills: {
      402: { POP_CONDITION: 'ans.back() > c' },
      316: { POP_CONDITION: `ans.back() > c && cnt[ans.back()-'a'] > 0` },
      321: { POP_CONDITION: 'ans.back() < x (keeping larger digits) && drop > 0' },
    },
    helixOrder: [402, 316, 321],
    helixDelta: {
      402: 'Remove larger peaks to make smallest number; drop k digits.',
      316: 'Remove larger letters if more remain later; smallest lexicographic.',
      321: 'Pick largest number: merge two max-number subsequences.',
    },
    autopsies: [
      {
        cause: 'Remove K digits: not skipping leading zeros',
        wrong: 'ans.push_back(c) even when ans empty and c == 0',
        testCase: 'num="10200", k=1 → ans="0200" instead of "200"',
        fix: `if (!ans.empty() || c != '0') ans.push_back(c)`,
      },
      {
        cause: 'Remove duplicate letters: not checking remaining freq before popping',
        wrong: 'pop unconditionally when ans.back() > c',
        testCase: '"bcabc" — pops b even if no more b left',
        fix: `check cnt[ans.back()-'a'] > 0 before popping`,
      },
    ],
    sayIt: [
      'Remove K digits: monotonic stack, remove larger peaks.',
      'Duplicate letters: stack + visited + freq check.',
      'Max number: max-number per subsequence, merge largest.',
    ],
  }),

  'greedy-exchange': e({
    xray: [
      { text: '**Exchange argument**: if a swap improves, the optimal has no inversions', kind: 'signal' },
      { text: 'Domino rotations: try both candidate values', kind: 'signal' },
    ],
    budget: ['try both', 'count mismatches', 'rightmost max'],
    slottedTemplate: `int minDominoRotations(vector<int>& tops, vector<int>& bottoms) {
    int n = (int)tops.size();
    auto check = [&](int x) {
        int tRot = 0, bRot = 0;
        for (int i = 0; i < n; i++) {
            if (/* SLOT: impossibleCondition */) return n + 1;
            if (tops[i] != x) tRot++;
            if (bottoms[i] != x) bRot++;
        }
        return min(tRot, bRot);
    };
    int ans = min(check(tops[0]), check(bottoms[0]));
    return ans > n ? -1 : ans;
}`,
    slots: [
      { id: 'IMPOSSIBLE_CONDITION', label: 'When value x cannot appear at position i', hint: 'tops[i] != x && bottoms[i] != x' },
    ],
    slotFills: {
      1007: { IMPOSSIBLE_CONDITION: 'tops[i] != x && bottoms[i] != x' },
      1247: { IMPOSSIBLE_CONDITION: 'n/a — count xy and yx mismatches' },
      670: { IMPOSSIBLE_CONDITION: 'n/a — find rightmost largest digit to swap' },
    },
    helixOrder: [1007, 1247, 670],
    helixDelta: {
      1007: 'Try both possible values; return min rotations or -1.',
      1247: 'Count x→y and y→x mismatches; xy+yx odd = impossible.',
      670: 'Find rightmost max digit; swap with leftmost smaller digit.',
    },
    autopsies: [
      {
        cause: 'Domino rotations: only check tops[0]',
        wrong: 'int ans = check(tops[0]);',
        testCase: 'tops=[2,1,2], bottoms=[1,2,1] — tops[0]=2 impossible, bottoms[0]=1 works',
        fix: 'ans = min(check(tops[0]), check(bottoms[0]))',
      },
    ],
    sayIt: [
      'Domino: try both possible values, return min rotations.',
      'Swap strings: count xy and yx mismatches.',
      'Max swap: rightmost max digit; swap left-to-right.',
    ],
  }),

  'prioritized-processing': e({
    xray: [
      { text: '**Sort by capital**, then use **max-heap** for profits', kind: 'signal' },
      { text: 'Events: **min-heap by end day** for earliest ending available', kind: 'signal' },
    ],
    budget: ['sort + max-heap', 'min-heap by end', 'count'],
    slottedTemplate: `int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n = (int)profits.size();
    vector<pair<int,int>> projects;
    for (int i = 0; i < n; i++)
        projects.push_back({capital[i], profits[i]});
    sort(projects.begin(), projects.end());
    priority_queue<int> pq;
    int i = 0;
    while (/* SLOT: loopCondition */) {
        while (i < n && projects[i].first <= w)
            pq.push(projects[i++].second);
        if (pq.empty()) break;
        w += pq.top(); pq.pop();
    }
    return w;
}`,
    slots: [
      { id: 'LOOP_CONDITION', label: 'When to continue', hint: 'k-- > 0' },
    ],
    slotFills: {
      502: { LOOP_CONDITION: 'k-- > 0' },
      358: { LOOP_CONDITION: '!pq.empty() && ans.size() < s.size()' },
      1353: { LOOP_CONDITION: 'n/a — for each day 1..100000, process events' },
    },
    helixOrder: [502, 358, 1353],
    helixDelta: {
      502: 'Sort by capital; max-heap of affordable profits.',
      358: 'Max-heap by freq; cooldown k steps before reusing a char.',
      1353: 'Sort by start; for each day, min-heap of available events by end.',
    },
    autopsies: [
      {
        cause: 'IPO: not sorting by capital first',
        wrong: 'push all to heap and pop k times ignoring capital constraint',
        testCase: 'k=1,w=0,profits=[5],capital=[10] — should not take project',
        fix: 'sort by capital; while loop adds affordable projects to heap',
      },
    ],
    sayIt: [
      'IPO: sort by capital, max-heap of profits, pick best affordable.',
      'K apart: max-heap freq, cooldown queue, place most frequent.',
      'Max events: sort by start, min-heap by end, attend earliest ending.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
