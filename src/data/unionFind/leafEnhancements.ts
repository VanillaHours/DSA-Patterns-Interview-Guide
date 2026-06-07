import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Initialization ──────────────────────────────────────────────

  'array-rep-uf': e({
    xray: [
      { text: '**parent array** of size n, each i initialized to i', kind: 'signal' },
      { text: '**O(n)** setup, **O(1)** per element initialization', kind: 'constraint' },
    ],
    budget: ['parent array', 'iota', 'fixed size'],
    slottedTemplate: `int parent[N];
iota(parent, parent + N, 0);
int find(int x) {
    while (parent[x] != x) x = /* SLOT: findStep */;
    return x;
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = /* SLOT: unionAssign */;
}`,
    slots: [
      { id: 'FIND_STEP', label: 'How to move up the tree', hint: 'parent[x] for basic find' },
      { id: 'UNION_ASSIGN', label: 'Which root becomes child', hint: 'rb (parent[ra] = rb)' },
    ],
    slotFills: {
      547: { FIND_STEP: 'parent[x]', UNION_ASSIGN: 'rb' },
    },
    helixOrder: [547],
    helixDelta: {
      547: 'Basic array DSU: O(n) init, O(n) find without optimizations. Use path compression for efficiency.',
    },
    autopsies: [
      {
        cause: 'Missing iota initialization — parent not self-referencing',
        wrong: 'vector<int> parent(n); // not initialized',
        testCase: 'find(0) returns 0 by luck, fails for other indices',
        fix: 'iota(parent.begin(), parent.end(), 0)',
      },
    ],
    sayIt: [
      'Array DSU: parent[i] = i for 0..n-1. Basic find walks up the tree. Union merges roots.',
    ],
  }),

  'tree-rep-uf': e({
    xray: [
      { text: 'Explicit **Node** objects with parent pointer', kind: 'signal' },
      { text: 'Supports **non-contiguous** or **dynamic** elements', kind: 'goal' },
    ],
    budget: ['node objects', 'dynamic sets'],
    slottedTemplate: `struct Node {
    Node* parent;
    int rank;
    Node() : parent(this), rank(0) {}
};
Node* find(Node* x) {
    if (x->parent != x) x->parent = find(x->parent);
    return x->parent;
}
void unionSet(Node* a, Node* b) {
    Node* ra = find(a), *rb = find(b);
    if (ra == rb) return;
    if (ra->rank < rb->rank) swap(ra, rb);
    rb->parent = ra;
    if (ra->rank == rb->rank) ra->rank++;
}`,
    slots: [
      { id: 'FIND_TYPE', label: 'Find implementation', hint: 'recursive tree traversal' },
    ],
    slotFills: {
      684: { FIND_TYPE: 'recursive path compression: if (x->parent != x) x->parent = find(x->parent)' },
    },
    helixOrder: [684],
    helixDelta: {
      684: 'Tree representation: each node is a self-contained DSU element. Useful for edge-based cycle detection.',
    },
    autopsies: [
      {
        cause: 'Not initializing parent to self',
        wrong: 'Node() { rank = 0; } // missing parent = this',
        testCase: 'find on new node returns nullptr',
        fix: 'Node() : parent(this), rank(0) {}',
      },
    ],
    sayIt: [
      'Tree DSU: each Node is a set. Self-parent = root. Recursive find with path compression.',
    ],
  }),

  'custom-map-uf': e({
    xray: [
      { text: 'Map **non-integer** elements to integer indices', kind: 'signal' },
      { text: 'Use **unordered_map** for string → index mapping', kind: 'goal' },
    ],
    budget: ['element mapping', 'string to index'],
    slottedTemplate: `unordered_map<string, int> id;
vector<int> parent;
int getIdx(const string& s) {
    auto [it, ins] = id.try_emplace(s, parent.size());
    if (ins) parent.push_back(parent.size());
    return it->second;
}
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
void unionSet(const string& a, const string& b) {
    int ra = find(getIdx(a)), rb = find(getIdx(b));
    if (ra != rb) parent[ra] = /* SLOT: assignRoot */;
}`,
    slots: [
      { id: 'ASSIGN_ROOT', label: 'Which root becomes parent', hint: 'rb for standard' },
    ],
    slotFills: {
      721: { ASSIGN_ROOT: 'rb' },
    },
    helixOrder: [721],
    helixDelta: {
      721: 'Accounts Merge: map emails → indices. Dynamic parent vector grows with each new email.',
    },
    autopsies: [
      {
        cause: 'Not growing parent vector when new element mapped',
        wrong: 'id[s] = id.size() // but parent not resized',
        testCase: 'find(getIdx("new")) on uninited parent',
        fix: 'parent.push_back(parent.size()) alongside id assignment',
      },
    ],
    sayIt: [
      'Custom map DSU: discover elements on first encounter. Map to index, grow parent vector dynamically.',
    ],
  }),

  // ── Find Operation ─────────────────────────────────────────────

  'basic-find-uf': e({
    xray: [
      { text: 'Iterative **while loop** to find root', kind: 'signal' },
      { text: 'O(n) worst case for deep trees', kind: 'constraint' },
    ],
    budget: ['while loop', 'no compression'],
    slottedTemplate: `int find(int x) {
    while (/* SLOT: loopCond */) x = parent[x];
    return x;
}`,
    slots: [
      { id: 'LOOP_COND', label: 'Loop continuation condition', hint: 'parent[x] != x' },
    ],
    slotFills: {
      547: { LOOP_COND: 'parent[x] != x' },
    },
    helixOrder: [547],
    helixDelta: {
      547: 'Basic find: linear chain traversal. Acceptable for small n or single-use with path compression.',
    },
    autopsies: [
      {
        cause: 'Infinite loop when root not self-referencing',
        wrong: 'while (parent[x] != -1) // never terminates for valid roots',
        testCase: 'parent[0] = 0 → -1 never reached',
        fix: 'while (parent[x] != x) — roots always point to themselves',
      },
    ],
    sayIt: [
      'Basic find: follow parent pointers until reaching a self-loop (root). No optimization.',
    ],
  }),

  'path-compression-uf': e({
    xray: [
      { text: '**Recursive** find: set parent to root on way back', kind: 'signal' },
      { text: '**Amortized O(α(n))** per operation', kind: 'constraint' },
    ],
    budget: ['recursive', 'path compression'],
    slottedTemplate: `int find(int x) {
    if (parent[x] != x) parent[x] = /* SLOT: compressAction */;
    return parent[x];
}`,
    slots: [
      { id: 'COMPRESS_ACTION', label: 'Path compression expression', hint: 'find(parent[x])' },
    ],
    slotFills: {
      684: { COMPRESS_ACTION: 'find(parent[x])' },
      128: { COMPRESS_ACTION: 'find(parent[x])' },
    },
    helixOrder: [684, 128],
    helixDelta: {
      684: 'Redundant Connection: path-compressed find for cycle detection in edge list.',
      128: 'Longest Consecutive Sequence: DSU with path compression on consecutive numbers via union of num and num+1.',
    },
    autopsies: [
      {
        cause: 'Forgetting to return the compressed parent',
        wrong: 'if (parent[x] != x) find(parent[x]); // no assignment',
        testCase: 'find after multiple calls still O(n)',
        fix: 'if (parent[x] != x) parent[x] = find(parent[x]); return parent[x];',
      },
    ],
    sayIt: [
      'Path compression: recursive find that flattens the tree. Each visited node points directly to root.',
    ],
  }),

  'path-splitting-uf': e({
    xray: [
      { text: '**Iterative** — no recursion depth concerns', kind: 'signal' },
      { text: 'Each step sets node to **grandparent**', kind: 'signal' },
    ],
    budget: ['iterative', 'grandparent link'],
    slottedTemplate: `int find(int x) {
    while (parent[x] != x) {
        int nxt = parent[x];
        parent[x] = /* SLOT: compressTarget */;
        x = nxt;
    }
    return x;
}`,
    slots: [
      { id: 'COMPRESS_TARGET', label: 'Point to grandparent or parent', hint: 'parent[parent[x]] for splitting, parent[x] for halving' },
    ],
    slotFills: {
      0: { COMPRESS_TARGET: 'parent[parent[x]] // splitting: every node points to grandparent' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Path splitting vs halving confusion',
        wrong: 'parent[x] = parent[parent[x]] (standard splitting)',
        testCase: 'Both achieve O(α(n)) amortized; splitting is more aggressive',
        fix: 'Path splitting: parent[x] = parent[parent[x]]; halving: parent[x] = parent[parent[x]] then x = parent[x]',
      },
    ],
    sayIt: [
      'Path splitting: iterative, each node points to its grandparent. Avoids recursion for large datasets.',
    ],
  }),

  // ── Union Operation ────────────────────────────────────────────

  'basic-union-uf': e({
    xray: [
      { text: 'Merge by setting parent[ra] = **rb**', kind: 'signal' },
      { text: 'Can create **deep trees** without balancing', kind: 'constraint' },
    ],
    budget: ['no balancing', 'direct merge'],
    slottedTemplate: `void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = /* SLOT: setParent */;
}`,
    slots: [
      { id: 'SET_PARENT', label: 'New parent of ra', hint: 'rb' },
    ],
    slotFills: {
      547: { SET_PARENT: 'rb' },
    },
    helixOrder: [547],
    helixDelta: {
      547: 'Basic union: O(1) after find. No balancing — tree may become skewed.',
    },
    autopsies: [
      {
        cause: 'Union on a, b instead of find(a), find(b)',
        wrong: 'parent[a] = b; // directly, without finding roots',
        testCase: 'a and b in subtrees — parent link breaks tree structure',
        fix: 'Always call find(a) and find(b) first, then union roots.',
      },
    ],
    sayIt: [
      'Basic union: find both roots, set one as parent of the other. Simple but may create deep trees.',
    ],
  }),

  'union-rank-uf': e({
    xray: [
      { text: '**Rank** = upper bound on tree height', kind: 'signal' },
      { text: '**Size** = number of elements in set', kind: 'goal' },
      { text: 'Both ensure O(log n) tree height', kind: 'constraint' },
    ],
    budget: ['rank', 'size', 'balance'],
    slottedTemplate: `vector<int> parent, rankOrSize;
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rankOrSize[ra] < rankOrSize[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rankOrSize[ra] == rankOrSize[rb]) /* SLOT: updateRank */;
}`,
    slots: [
      { id: 'UPDATE_RANK', label: 'How to update rank/size', hint: 'rank[ra]++ (rank) vs sz[ra] += sz[rb] (size)' },
    ],
    slotFills: {
      684: { UPDATE_RANK: 'rank[ra]++ // union by rank' },
      1202: { UPDATE_RANK: 'sz[ra] += sz[rb] // union by size' },
    },
    helixOrder: [684, 1202],
    helixDelta: {
      684: 'Union by rank: attach lower rank under higher. Height ≤ log₂(n).',
      1202: 'Union by size: attach smaller component under larger. Size tracking enables group-based sorting.',
    },
    autopsies: [
      {
        cause: 'Swapping after equality check',
        wrong: 'if (rank[ra] <= rank[rb]) swap(ra, rb); // wrong: equal ranks swap',
        testCase: 'ra and rb equal rank — both get swapped, rank increment on wrong node',
        fix: 'if (rank[ra] < rank[rb]) swap(ra, rb); // only swap when strictly less',
      },
    ],
    sayIt: [
      'Union by rank/size: keep trees shallow. Rank = height bound; Size = element count. Both prevent deep trees.',
    ],
  }),

  'union-custom-uf': e({
    xray: [
      { text: 'Merge based on **problem-specific** criteria', kind: 'signal' },
      { text: 'Example: lower original value becomes root', kind: 'signal' },
    ],
    budget: ['custom criteria', 'problem-specific'],
    slottedTemplate: `void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (/* SLOT: customCond */) swap(ra, rb);
    parent[rb] = ra;
}`,
    slots: [
      { id: 'CUSTOM_COND', label: 'Custom merge condition', hint: 'ra > rb (lower index becomes root)' },
    ],
    slotFills: {
      1632: { CUSTOM_COND: 'ra > rb // lower index becomes root for matrix rank transform' },
    },
    helixOrder: [1632],
    helixDelta: {
      1632: 'Custom union: matrix cells with equal rank value are unioned; lower index becomes root for deterministic grouping.',
    },
    autopsies: [
      {
        cause: 'Non-deterministic tie-breaking in custom union',
        wrong: 'if (someHeuristic()) swap(ra, rb); // non-deterministic',
        testCase: 'Same input produces different DSU structure',
        fix: 'Use a deterministic condition based on element values or indices.',
      },
    ],
    sayIt: [
      'Custom union: problem-specific merge order. Common in matrix rank transform where same-value cells share a group.',
    ],
  }),

  // ── Data Structure Optimizations ───────────────────────────────

  'pc-ranked-uf': e({
    xray: [
      { text: 'Path compression + union by rank: **optimal DSU**', kind: 'signal' },
      { text: '**O(α(n))** amortized per operation', kind: 'constraint' },
    ],
    budget: ['full optimization', 'inverse ackermann'],
    slottedTemplate: `int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank[ra] < rank[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) /* SLOT: incRank */;
}`,
    slots: [
      { id: 'INC_RANK', label: 'Increment rank condition', hint: 'rank[ra]++' },
    ],
    slotFills: {
      684: { INC_RANK: 'rank[ra]++' },
      1202: { INC_RANK: 'rank[ra]++' },
    },
    helixOrder: [684, 1202],
    helixDelta: {
      684: 'Fully optimized DSU: near-constant find/union. Gold standard for DSU problems.',
      1202: 'Size-tracking variant: sz[root] gives component size for grouping problems.',
    },
    autopsies: [
      {
        cause: 'Missing rank increment on equal ranks',
        wrong: 'if (rank[ra] == rank[rb]) { /* no increment */ }',
        testCase: 'Multiple unions of equal-rank trees — height grows faster than expected',
        fix: 'if (rank[ra] == rank[rb]) rank[ra]++;',
      },
    ],
    sayIt: [
      'Gold-standard DSU: path compression with union by rank. Commit to memory — O(α(n)) per operation.',
    ],
  }),

  'size-tracking-uf': e({
    xray: [
      { text: '**sz[root]** = element count in component', kind: 'signal' },
      { text: 'Union by size keeps trees balanced', kind: 'goal' },
    ],
    budget: ['component size', 'union by size'],
    slottedTemplate: `vector<int> parent, sz;
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;
    sz[ra] += /* SLOT: sizeAdd */;
}`,
    slots: [
      { id: 'SIZE_ADD', label: 'Size update value', hint: 'sz[rb]' },
    ],
    slotFills: {
      323: { SIZE_ADD: 'sz[rb]' },
      952: { SIZE_ADD: 'sz[rb]' },
    },
    helixOrder: [323, 952],
    helixDelta: {
      323: 'Count components: total components = n - successful unions. Size tracks component membership.',
      952: 'Largest component by common factor: union numbers via prime factors; track max sz[root].',
    },
    autopsies: [
      {
        cause: 'Accessing sz[x] without calling find(x) first',
        wrong: 'int s = sz[x]; // x may not be root',
        testCase: 'After union, sz[non-root] returns stale size',
        fix: 'int s = sz[find(x)]; // always get root first',
      },
    ],
    sayIt: [
      'Size tracking: sz[root] = component element count. Union by size also balances trees efficiently.',
    ],
  }),

  'dynamic-add-uf': e({
    xray: [
      { text: '**Resize** parent/rank on element discovery', kind: 'signal' },
      { text: 'Essential for **online** problems', kind: 'goal' },
    ],
    budget: ['dynamic resize', 'online discovery'],
    slottedTemplate: `int addElement() {
    int idx = parent.size();
    parent.push_back(idx);
    rank.push_back(0);
    return /* SLOT: returnIdx */;
}`,
    slots: [
      { id: 'RETURN_IDX', label: 'Return value', hint: 'idx' },
    ],
    slotFills: {
      721: { RETURN_IDX: 'idx' },
      1697: { RETURN_IDX: 'idx' },
    },
    helixOrder: [721, 1697],
    helixDelta: {
      721: 'Accounts Merge: emails discovered during input parsing. Add to DSU on first encounter.',
      1697: 'Edge-limited paths: nodes are known upfront; edges sorted dynamically by weight threshold.',
    },
    autopsies: [
      {
        cause: 'Initializing new element with wrong parent',
        wrong: 'parent.push_back(0); // all new elements point to 0',
        testCase: 'find(newElem) returns 0, not itself',
        fix: 'parent.push_back(idx) where idx == parent.size() before push',
      },
    ],
    sayIt: [
      'Dynamic DSU: push_back(idx) for each new element. Critical when element universe is unknown upfront.',
    ],
  }),

  // ── Connected Components ───────────────────────────────────────

  'counting-components-uf': e({
    xray: [
      { text: '**Decrement** component count on successful union', kind: 'signal' },
      { text: 'Start with **components = n**', kind: 'goal' },
    ],
    budget: ['component count', 'decrement'],
    slottedTemplate: `int components = n;
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) { parent[ra] = rb; components--; }
}`,
    slots: [
      { id: 'INIT_COMPONENTS', label: 'Initial component count', hint: 'n (number of nodes)' },
    ],
    slotFills: {
      547: { INIT_COMPONENTS: 'n // city count' },
      323: { INIT_COMPONENTS: 'n // node count' },
      200: { INIT_COMPONENTS: 'number of land cells // discovered during scan' },
    },
    helixOrder: [547, 323, 200],
    helixDelta: {
      547: 'Number of Provinces: DSU on adjacency matrix; count distinct roots.',
      323: 'Connected Components: DSU on edge list; count = decrement on each union.',
      200: 'Number of Islands: union adjacent land cells; count remaining islands after all unions.',
    },
    autopsies: [
      {
        cause: 'Decrementing on every union attempt (even same component)',
        wrong: 'components--; // unconditionally',
        testCase: 'union same-set elements — count goes negative',
        fix: 'if (ra != rb) { parent[ra] = rb; components--; }',
      },
    ],
    sayIt: [
      'Component counting: init = n. Decrement only when ra != rb (successful union). Result = remaining components.',
    ],
  }),

  'component-props-uf': e({
    xray: [
      { text: 'Track **properties** (size, sum) per root', kind: 'signal' },
      { text: 'Property must be **mergeable**', kind: 'constraint' },
    ],
    budget: ['per-root properties', 'mergeable'],
    slottedTemplate: `void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;
    sz[ra] += /* SLOT: mergeProp */;
}`,
    slots: [
      { id: 'MERGE_PROP', label: 'Property merge expression', hint: 'sz[rb] for size' },
    ],
    slotFills: {
      952: { MERGE_PROP: 'sz[rb] // merge size; track max sz[root]' },
      1319: { MERGE_PROP: 'sz[rb] // same; extraEdges = totalEdges - (n - components)' },
    },
    helixOrder: [952, 1319],
    helixDelta: {
      952: 'Track largest component size after unioning numbers by common factors.',
      1319: 'Count extra edges (edges beyond n-1) vs components needed (components-1).',
    },
    autopsies: [
      {
        cause: 'Updating property on wrong root',
        wrong: 'sz[rb] += sz[ra]; // updating old root instead of new root',
        testCase: 'sz[find(a)] returns pre-union size',
        fix: 'sz[ra] += sz[rb]; // new root gets merged size',
      },
    ],
    sayIt: [
      'Component properties: store mergeable values at root. Common examples: size, sum, max, min.',
    ],
  }),

  'dynamic-connect-uf': e({
    xray: [
      { text: 'Process **edges in order**, union as we go', kind: 'signal' },
      { text: 'Answer **connectivity queries** at each step', kind: 'goal' },
    ],
    budget: ['incremental edges', 'connectivity queries'],
    slottedTemplate: `for step in steps:
    if step is edge addition:
        unionSet(/* SLOT: edgeEndpoints */);
    if step is query:
        ans = (find(u) == find(v));`,
    slots: [
      { id: 'EDGE_ENDPOINTS', label: 'Edge endpoints to union', hint: 'u, v' },
    ],
    slotFills: {
      305: { EDGE_ENDPOINTS: 'pos, neighbor // 4-directional grid' },
      1627: { EDGE_ENDPOINTS: 'i, j // where gcd(i,j) > threshold' },
    },
    helixOrder: [305, 1627],
    helixDelta: {
      305: 'Islands II: add land cells one at a time; union with adjacent land; track component count.',
      1627: 'Graph Connectivity: connect nodes sharing divisor > threshold via sieve; answer offline queries.',
    },
    autopsies: [
      {
        cause: 'Processing queries out of order with edge additions',
        wrong: 'answer all queries at end instead of interleaved',
        testCase: 'Query result depends on state at specific time',
        fix: 'Lockstep: process operations chronologically, answer queries when encountered.',
      },
    ],
    sayIt: [
      'Dynamic connectivity: timeline of edge additions + queries. Process chronologically, union and answer as you go.',
    ],
  }),

  // ── Cycle Detection ────────────────────────────────────────────

  'undirected-cycle-uf': e({
    xray: [
      { text: '**Edge forms cycle** if find(u) == find(v) before union', kind: 'signal' },
      { text: 'Only works for **undirected** graphs', kind: 'constraint' },
    ],
    budget: ['cycle detection', 'redundant edge'],
    slottedTemplate: `bool tryAddEdge(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == /* SLOT: cycleCond */) return true; // cycle!
    parent[ra] = rb;
    return false;
}`,
    slots: [
      { id: 'CYCLE_COND', label: 'Condition indicating cycle', hint: 'rb (same root)' },
    ],
    slotFills: {
      684: { CYCLE_COND: 'rb' },
      261: { CYCLE_COND: 'rb' },
    },
    helixOrder: [684, 261],
    helixDelta: {
      684: 'Redundant Connection: first edge with find(u)==find(v) is the answer.',
      261: 'Graph Valid Tree: must have exactly n-1 edges AND no cycles (all edges != same component).',
    },
    autopsies: [
      {
        cause: 'Missing self-loop detection',
        wrong: 'if (find(a) == find(b)) // misses a==b case',
        testCase: 'Edge [0,0] — self-loop, should detect cycle',
        fix: 'if (a == b || find(a) == find(b)) return true;',
      },
    ],
    sayIt: [
      'Undirected cycle: if find(u) == find(v) before union, the edge creates a cycle. O(α(n)) per edge.',
    ],
  }),

  'directed-cycle-uf': e({
    xray: [
      { text: 'Two cases: **2-parent** conflict or **cycle**', kind: 'signal' },
      { text: 'DSU handles cycle; **in-degree** tracks 2-parent', kind: 'constraint' },
    ],
    budget: ['two parents', 'directed cycle'],
    slottedTemplate: `// Track in-degree and DSU separately
vector<int> parent, indegree;
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
bool unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false; // cycle
    parent[ra] = rb;
    return true;
}
// Case 1: node with indegree 2 → one of its incoming edges is extra
// Case 2: detect cycle via unionSet returns false`,
    slots: [
      { id: 'DIRECTED_MODE', label: 'Directed cycle analysis mode', hint: '2-parent vs cycle' },
    ],
    slotFills: {
      685: { DIRECTED_MODE: 'find node with indegree 2; try removing each candidate edge; check for remaining cycle' },
    },
    helixOrder: [685],
    helixDelta: {
      685: 'Redundant Connection II: DSU + indegree. Try removing each 2-parent candidate; DSU detects cycle in remaining graph.',
    },
    autopsies: [
      {
        cause: 'Using DSU alone for directed cycles',
        wrong: 'parent[find(u)] = find(v); // doesn\'t detect directed cycle correctly',
        testCase: 'u→v, v→u — DSU merges them but directed cycle not captured',
        fix: 'Combine DSU for tree structure with indegree/DFS for directionality.',
      },
    ],
    sayIt: [
      'Directed cycle: DSU + indegree tracking. Check two conflict types: node with 2 parents, and directed cycle via DSU.',
    ],
  }),

  'cycle-classify-uf': e({
    xray: [
      { text: 'Flatten 2D **grid coordinates** to 1D', kind: 'signal' },
      { text: 'Union adjacent cells of **same value**', kind: 'goal' },
    ],
    budget: ['grid flatten', 'adjacent union'],
    slottedTemplate: `int idx(int r, int c) { return r * cols + c; }
bool hasCycle(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<int> parent(R*C); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) {
        return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (int r = 0; r < R; r++)
        for (int c = 0; c < C; c++) {
            if (r>0 && grid[r][c]==grid[r-1][c]) {
                if (find(idx(r,c))==find(idx(r-1,c))) return true;
                parent[find(idx(r,c))] = find(idx(r-1,c));
            }
            // same for left neighbor
        }
    return false;
}`,
    slots: [
      { id: 'FLATTEN_IDX', label: 'Grid flatten formula', hint: 'r * C + c' },
    ],
    slotFills: {
      1559: { FLATTEN_IDX: 'r * C + c' },
    },
    helixOrder: [1559],
    helixDelta: {
      1559: 'Detect Cycles in 2D Grid: flatten coordinates. If adjacent same-value cells already in same component, cycle exists.',
    },
    autopsies: [
      {
        cause: 'Incorrect flattening formula',
        wrong: 'int idx = r + c * R; // rows/cols swapped',
        testCase: 'Two cells map to same index or out of bounds',
        fix: 'int idx = r * C + c; // row-major flattening',
      },
    ],
    sayIt: [
      'Grid cycle: flatten (r,c) → r*C + c. Union same-value neighbors. If already connected, cycle found.',
    ],
  }),

  // ── Minimum Spanning Tree ──────────────────────────────────────

  'kruskal-uf': e({
    xray: [
      { text: '**Sort** edges by weight ascending', kind: 'signal' },
      { text: '**Union** if endpoints in different components', kind: 'goal' },
    ],
    budget: ['sort edges', 'greedy union'],
    slottedTemplate: `struct Edge { int u, v, w; };
int kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a.w < b.w; });
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    int cost = 0, cnt = 0;
    for (auto& e : edges) {
        if (find(e.u) != find(e.v)) {
            parent[find(e.u)] = find(e.v);
            cost += /* SLOT: edgeWeight */;
            if (++cnt == n-1) break;
        }
    }
    return cost;
}`,
    slots: [
      { id: 'EDGE_WEIGHT', label: 'Edge weight to add', hint: 'e.w' },
    ],
    slotFills: {
      1584: { EDGE_WEIGHT: 'abs(px-px2) + abs(py-py2) // Manhattan distance' },
      1135: { EDGE_WEIGHT: 'e.w // given edge cost' },
    },
    helixOrder: [1584, 1135],
    helixDelta: {
      1584: 'Min Cost to Connect All Points: compute all O(n²) Manhattan distances; Kruskal with DSU.',
      1135: 'Connecting Cities With Minimum Cost: standard Kruskal on weighted edges.',
    },
    autopsies: [
      {
        cause: 'Not stopping at n-1 edges',
        wrong: 'process all edges even after MST formed',
        testCase: 'n nodes, MST needs n-1 edges — processing extra edges is wasted work',
        fix: 'if (++cnt == n-1) break;',
      },
    ],
    sayIt: [
      'Kruskal: sort edges by weight. Greedily add edges if they don\'t create a cycle. Stop at n-1 edges.',
    ],
  }),

  'critical-edges-uf': e({
    xray: [
      { text: '**Critical**: not in any MST (exclusion increases weight)', kind: 'goal' },
      { text: '**Pseudo-critical**: in at least one MST (inclusion same weight)', kind: 'goal' },
    ],
    budget: ['force include', 'force exclude'],
    slottedTemplate: `int mstWeight = kruskal(n, edges, -1); // full MST
vector<int> crit, pseudo;
for each edge idx i:
    int without = kruskal(n, edges, i);  // skip i
    if (without > mstWeight) crit.push_back(i);
    else {
        int with = kruskalForce(n, edges, i); // force include i
        if (with == mstWeight) pseudo.push_back(i);
    }`,
    slots: [
      { id: 'FORCE_MODE', label: 'Force mode for edge analysis', hint: 'skip vs force-include' },
    ],
    slotFills: {
      1489: { FORCE_MODE: 'skip: exclude edge entirely; force: union edge first, then Kruskal normally' },
    },
    helixOrder: [1489],
    helixDelta: {
      1489: 'Critical edges: force-exclude → if weight increases, it\'s critical. Force-include → if same weight, pseudo-critical.',
    },
    autopsies: [
      {
        cause: 'Confusing critical vs pseudo-critical definitions',
        wrong: 'Edge that appears in all MSTs → pseudo-critical (should be critical)',
        testCase: 'Critical = not in ANY MST; Pseudo-critical = in at least one',
        fix: 'Critical: exclusion increases weight. Pseudo-critical: forced inclusion gives same weight as MST.',
      },
    ],
    sayIt: [
      'Critical edge analysis: force-exclude → weight increases = critical. Force-include → same weight = pseudo-critical.',
    ],
  }),

  // ── Equivalence Relationships ──────────────────────────────────

  'string-grouping-uf': e({
    xray: [
      { text: 'Map **strings** to indices, union related strings', kind: 'signal' },
      { text: '**Collect** by root, sort each group', kind: 'goal' },
    ],
    budget: ['string mapping', 'group collect'],
    slottedTemplate: `unordered_map<string, int> id;
vector<int> parent;
int get(const string& s) { /* map & push_back */ }
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
void unionSet(const string& a, const string& b) {
    int ra = find(get(a)), rb = find(get(b));
    if (ra != rb) parent[ra] = rb;
}
// collect groups:
unordered_map<int, vector<string>> groups;
for (auto& [s,_] : id) groups[find(get(s))].push_back(s);
for (auto& [_, v] : groups) sort(v.begin(), v.end());`,
    slots: [
      { id: 'GROUP_SORT', label: 'Sort each group after collection', hint: 'lexicographic order' },
    ],
    slotFills: {
      721: { GROUP_SORT: 'sort(v.begin(), v.end()) // accounts output sorted' },
      737: { GROUP_SORT: 'n/a — just check if find(a) == find(b)' },
    },
    helixOrder: [721, 737],
    helixDelta: {
      721: 'Accounts Merge: map emails → indices; union first emails of same account; collect sorted groups.',
      737: 'Sentence Similarity II: map words; union pairs; check if sentence words share roots.',
    },
    autopsies: [
      {
        cause: 'Not including account name in output',
        wrong: 'return vector of emails without the name',
        testCase: 'Output missing first element = account name',
        fix: 'Prepend name to each group vector after sorting emails.',
      },
    ],
    sayIt: [
      'String grouping: map strings → DSU indices. Union related strings. Collect per root. Sort. Done.',
    ],
  }),

  'equation-sat-uf': e({
    xray: [
      { text: 'Process **==** first (union), then **!=** (check)', kind: 'signal' },
      { text: '26 variables for lowercase letters', kind: 'constraint' },
    ],
    budget: ['two-pass', '== then !='],
    slottedTemplate: `bool equationsPossible(vector<string>& eqs) {
    vector<int> parent(26); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (auto& e : eqs) if (e[1] == '=')
        parent[find(e[0]-'a')] = find(e[3]-'a');
    for (auto& e : eqs) if (e[1] == '!')
        if (/* SLOT: conflictCond */) return false;
    return true;
}`,
    slots: [
      { id: 'CONFLICT_COND', label: 'Conflict detection condition', hint: 'find(e[0]-a) == find(e[3]-a)' },
    ],
    slotFills: {
      990: { CONFLICT_COND: 'find(e[0]-\'a\') == find(e[3]-\'a\') // = and != on same variables' },
      1579: { CONFLICT_COND: 'n/a — multi-DSU; process type-3 first, then type-1 and type-2' },
    },
    helixOrder: [990, 1579],
    helixDelta: {
      990: 'Equation satisfaction: two-pass. First union all ==, then check all != for conflicts.',
      1579: 'Traversable edges: multi-DSU approach with edge type ordering. Type-3 shared edges first.',
    },
    autopsies: [
      {
        cause: 'Processing != before ==',
        wrong: 'single pass: try to union == and != simultaneously',
        testCase: 'a==b, b==c, a!=c — conflict missed because a!=c checked before transitive equality',
        fix: 'First pass: union all ==. Second pass: check all !=.',
      },
    ],
    sayIt: [
      'Equation satisfaction: always process equality constraints first, then check inequality constraints.',
    ],
  }),

  'node-classify-uf': e({
    xray: [
      { text: '**Compare** all pairs; union if similar', kind: 'signal' },
      { text: 'O(n²) comparisons may need optimization', kind: 'constraint' },
    ],
    budget: ['pair comparison', 'similarity union'],
    slottedTemplate: `int similarGroups(vector<string>& strs) {
    int n = strs.size();
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            if (isSimilar(strs[i], strs[j]))
                parent[find(i)] = find(j);
    int groups = 0;
    for (int i = 0; i < n; i++) if (find(i) == i) groups++;
    return groups;
}`,
    slots: [
      { id: 'SIMILARITY', label: 'Similarity criterion', hint: 'diff ≤ 2' },
    ],
    slotFills: {
      839: { SIMILARITY: 'diff ≤ 2 // strings differ by at most 2 characters' },
    },
    helixOrder: [839],
    helixDelta: {
      839: 'Similar String Groups: O(n² * L) pair comparison. Union if similar. Count roots = groups.',
    },
    autopsies: [
      {
        cause: 'O(n²) TLE on large input',
        wrong: 'full pair comparison without pruning',
        testCase: 'n=10000, L=1000 — O(n²*L) too slow',
        fix: 'Use canonical form (e.g., swap-first-two for each position) to reduce pairs.',
      },
    ],
    sayIt: [
      'Node classification: compare all pairs; union similar items. Count distinct roots = number of groups.',
    ],
  }),

  // ── Dynamic Graph Problems ─────────────────────────────────────

  'online-queries-uf': e({
    xray: [
      { text: '**Sort** edges and queries by same threshold', kind: 'signal' },
      { text: '**Process** edges incrementally as threshold increases', kind: 'goal' },
    ],
    budget: ['offline processing', 'threshold sort'],
    slottedTemplate: `vector<bool> answerQueries(int n, vector<vector<int>>& edges, vector<Query>& qs) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });
    sort(qs.begin(), qs.end(), [](auto& a, auto& b) { return a.threshold < b.threshold; });
    DSU dsu(n);
    vector<bool> ans(qs.size());
    int e = 0;
    for (auto& q : qs) {
        while (/* SLOT: edgeCond */) { dsu.unionSet(edges[e][0], edges[e][1]); e++; }
        ans[q.idx] = dsu.find(q.u) == dsu.find(q.v);
    }
    return ans;
}`,
    slots: [
      { id: 'EDGE_COND', label: 'When to process next edge', hint: 'e < edges.size() && edges[e][2] < q.threshold' },
    ],
    slotFills: {
      1697: { EDGE_COND: 'e < edges.size() && edges[e][2] < q.threshold' },
      305: { EDGE_COND: 'n/a — positions processed in order, not sorted by threshold' },
    },
    helixOrder: [1697, 305],
    helixDelta: {
      1697: 'Edge-limited paths: sort queries by limit, edges by weight. Process eligible edges before each query.',
      305: 'Islands II: process positions sequentially. No sorting — each position is a time step.',
    },
    autopsies: [
      {
        cause: 'Using ≤ instead of < for threshold comparison',
        wrong: 'while (edges[e][2] <= q.threshold) // strict vs inclusive',
        testCase: 'Edge weight == threshold — should it be included? Depends on problem statement.',
        fix: 'Check problem: "strictly less" vs "less than or equal". Use < for strict, ≤ for inclusive.',
      },
    ],
    sayIt: [
      'Offline DSU: sort edges and queries by common key. Incrementally union edges as queries become answerable.',
    ],
  }),

  'edge-add-rem-uf': e({
    xray: [
      { text: '**Reverse** operations: removal becomes addition', kind: 'signal' },
      { text: 'Start from **final state**, go backwards', kind: 'goal' },
    ],
    budget: ['reverse processing', 'undo removal'],
    slottedTemplate: `// Start from final state (after all removals)
// Process operations in reverse:
// "remove edge" becomes "add edge" → union
for (int i = ops.size()-1; i >= 0; i--) {
    if (ops[i] == REMOVE) {
        // Now it's an addition
        unionSet(/* SLOT: edgeEndpoints */);
    } else {
        // query — answer from current DSU state
    }
}`,
    slots: [
      { id: 'EDGE_ENDPOINTS', label: 'Edge endpoints to union (reverse)', hint: 'removed edge u, v' },
    ],
    slotFills: {
      1579: { EDGE_ENDPOINTS: 'u-1, v-1 // type-3 edges processed first' },
      924: { EDGE_ENDPOINTS: 'u, v // graph adjacency' },
    },
    helixOrder: [1579, 924],
    helixDelta: {
      1579: 'Traversable: process type-3 edges first (both players), then type-1/2. Reverse not needed — just ordering.',
      924: 'Malware Spread: build DSU from graph edges. Analyze infection count per component.',
    },
    autopsies: [
      {
        cause: 'Processing removals forward',
        wrong: 'try to delete edges from DSU as they are removed',
        testCase: 'DSU doesn\'t support deletion natively',
        fix: 'Process operations in reverse: start from final state, go backward (removal → union).',
      },
    ],
    sayIt: [
      'Edge removal: reverse time. Start from the final graph state. Process operations backwards — removals become unions.',
    ],
  }),

  'time-connectivity-uf': e({
    xray: [
      { text: 'Edges have **time-to-live** or active windows', kind: 'signal' },
      { text: 'Process **timeline** of add/remove/query events', kind: 'goal' },
    ],
    budget: ['time windows', 'event timeline'],
    slottedTemplate: `// Edges active during [start, end) — each edge adds 2 events
vector<tuple<int,int,int>> events; // time, type, edgeIdx
// type: 0=add before queries, 1=query, 2=remove after queries
sort(events.begin(), events.end());
for (auto& [t, type, idx] : events) {
    if (type == 0) unionSet(edges[idx].first, edges[idx].second);
    else if (type == 1) ans[idx] = (find(q.u)==find(q.v));
    // removal would need persistent DSU or isn't supported
}`,
    slots: [
      { id: 'TIME_HANDLE', label: 'Time event handling', hint: 'add before queries, answer at query time' },
    ],
    slotFills: {
      1724: { TIME_HANDLE: 'online variant: pre-sort queries by threshold; incremental DSU with persistent frontier' },
    },
    helixOrder: [1724],
    helixDelta: {
      1724: 'Time-based connectivity: edges have weights as thresholds; queries at different limits need incremental DSU.',
    },
    autopsies: [
      {
        cause: 'Trying to handle removal with standard DSU',
        wrong: 'parent[ra] = something_else; // attempting direct parent reassignment',
        testCase: 'Path compression makes rollback of individual edges impossible',
        fix: 'Use persistent or reversible DSU, or avoid problems requiring edge removal.',
      },
    ],
    sayIt: [
      'Time-based DSU: sort events chronologically. Edge additions = union. Edge removals need persistent DSU.',
    ],
  }),

  // ── Grid-Based Problems ────────────────────────────────────────

  'island-uf': e({
    xray: [
      { text: 'Flatten (r,c) to **r*C + c**', kind: 'signal' },
      { text: 'Union **adjacent** land cells', kind: 'goal' },
    ],
    budget: ['coordinate flatten', 'adjacent union'],
    slottedTemplate: `int idx(int r, int c) { return r * /* SLOT: cols */ + c; }
// init: for each land cell, try union with top and left neighbors
for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
    if (grid[r][c] == '0') continue;
    islands++;
    if (r>0 && grid[r-1][c]=='1') unionIfDifferent(r,c,r-1,c);
    if (c>0 && grid[r][c-1]=='1') unionIfDifferent(r,c,r,c-1);
}`,
    slots: [
      { id: 'COLS', label: 'Number of columns', hint: 'C (grid[0].size())' },
    ],
    slotFills: {
      200: { COLS: 'C' },
      305: { COLS: 'n // given number of columns for grid' },
    },
    helixOrder: [200, 305],
    helixDelta: {
      200: 'Number of Islands: static grid DSU. Flatten 2D to 1D. Union right/down land neighbors.',
      305: 'Islands II: dynamic DSU. New land cells added one by one; union with existing adjacent land.',
    },
    autopsies: [
      {
        cause: 'Checking all 4 neighbors instead of 2',
        wrong: 'union with up, down, left, right // causes double-union',
        testCase: 'Each cell pairs unioned twice (right+down from current, left+up from neighbor)',
        fix: 'Only check top and left neighbors (or right and down). Avoids redundant unions.',
      },
    ],
    sayIt: [
      'Island DSU: flatten 2D → 1D. Start count = number of land cells. Union adjacent land; decrement on union.',
    ],
  }),

  'grid-connectivity-uf': e({
    xray: [
      { text: 'Union adjacent cells of **same value**', kind: 'signal' },
      { text: 'Answer: are (r1,c1) and (r2,c2) **connected**?', kind: 'goal' },
    ],
    budget: ['same-value union', 'region connectivity'],
    slottedTemplate: `int idx(int r, int c) { return r * C + c; }
void build(vector<vector<int>>& grid) {
    int R=grid.size(), C=grid[0].size();
    DSU dsu(R*C);
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        if (r+1<R && grid[r][c]==grid[r+1][c])
            dsu.unionSet(idx(r,c), idx(r+1,c));
        if (c+1<C && grid[r][c]==grid[r][c+1])
            dsu.unionSet(idx(r,c), idx(r,c+1));
    }
}
bool query(int r1,int c1,int r2,int c2) {
    return dsu.find(idx(r1,c1)) == dsu.find(idx(r2,c2));
}`,
    slots: [
      { id: 'SAME_VAL_COND', label: 'Condition for unioning cells', hint: 'grid[r][c] == grid[r+1][c]' },
    ],
    slotFills: {
      1559: { SAME_VAL_COND: 'grid[r][c] == grid[r-1][c] // cycle detection' },
      1254: { SAME_VAL_COND: 'grid[r][c] == 0 && grid[r+1][c] == 0 // closed island detection' },
    },
    helixOrder: [1559, 1254],
    helixDelta: {
      1559: 'Detect Cycles: union adjacent same-value cells. Cycle if already in same component.',
      1254: 'Closed Islands: union land cells (0). Islands touching edge are not closed.',
    },
    autopsies: [
      {
        cause: 'Not checking same-value condition before union',
        wrong: 'union(idx(r,c), idx(r+1,c)); // unconditionally',
        testCase: 'Different values get unioned into same component',
        fix: 'if (grid[r][c] == grid[r+1][c]) union(...);',
      },
    ],
    sayIt: [
      'Grid connectivity: flatten coordinates. Union adjacent same-value cells. Query via find equality.',
    ],
  }),

  'percolation-uf': e({
    xray: [
      { text: 'Union cells where **street shapes connect**', kind: 'signal' },
      { text: 'Check **bidirectional** connectivity', kind: 'constraint' },
    ],
    budget: ['street connection', 'bidirectional check'],
    slottedTemplate: `bool hasValidPath(vector<vector<int>>& grid) {
    int R=grid.size(), C=grid[0].size();
    DSU dsu(R*C);
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        int id = r*C+c, cur = grid[r][c];
        // right: if cur connects right AND right connects left
        if (c+1<C && right[cur] && left[grid[r][c+1]])
            dsu.unionSet(id, id+1);
        // down: if cur connects down AND down connects up
        if (r+1<R && down[cur] && up[grid[r+1][c]])
            dsu.unionSet(id, id+C);
    }
    return dsu.find(0) == dsu.find(R*C-1);
}`,
    slots: [
      { id: 'CONNECT_DIR', label: 'Connection direction arrays', hint: 'right/left/down/up bool per street type' },
    ],
    slotFills: {
      1391: { CONNECT_DIR: 'predefined arrays: right={1,4,6}, left={1,3,5}, up={2,3,4}, down={2,5,6}' },
    },
    helixOrder: [1391],
    helixDelta: {
      1391: 'Valid Path in Grid: DSU on street cells. Union if adjacent cells have matching openings. Check start→end.',
    },
    autopsies: [
      {
        cause: 'Checking only one-directional connectivity',
        wrong: 'if (right[cur]) union(id, id+1); // doesn\'t check if neighbor connects back',
        testCase: 'Curve pointing right but neighbor pointing up — no valid path, yet unioned',
        fix: 'Check both directions: right[cur] && left[neighbor]',
      },
    ],
    sayIt: [
      'Percolation DSU: union adjacent street cells only if their openings face each other. Check start-to-end connectivity.',
    ],
  }),

  // ── Partition Problems ─────────────────────────────────────────

  'set-partitioning-uf': e({
    xray: [
      { text: '**Union** elements that belong together', kind: 'signal' },
      { text: '**Group** by root after all unions', kind: 'goal' },
    ],
    budget: ['union grouping', 'partition by root'],
    slottedTemplate: `// After all unions:
unordered_map<int, vector<int>> groups;
for (int i = 0; i < n; i++)
    groups[find(i)].push_back(i);
// Process each group independently
for (auto& [root, members] : groups) {
    sort(members.begin(), members.end());
    // apply problem logic per group
}`,
    slots: [
      { id: 'GROUP_LOGIC', label: 'Per-group processing logic', hint: 'sort characters and assign back (1202) vs compute ratio (399)' },
    ],
    slotFills: {
      1202: { GROUP_LOGIC: 'sort chars in group; assign back to original positions in sorted order' },
      399: { GROUP_LOGIC: 'n/a — weighted DSU computes ratios; no explicit group iteration' },
    },
    helixOrder: [1202, 399],
    helixDelta: {
      1202: 'Smallest String With Swaps: union swappable indices; sort each group\'s characters; assign back.',
      399: 'Evaluate Division: weighted DSU stores ratio between variables; query = weight[a]/weight[b].',
    },
    autopsies: [
      {
        cause: 'Using stale roots after all unions without re-find',
        wrong: 'groups[parent[i]].push_back(i); // parent[i] may not be root',
        testCase: 'After unions without path compression, non-root nodes have stale parent',
        fix: 'groups[find(i)].push_back(i); // always find the current root',
      },
    ],
    sayIt: [
      'Set partitioning: union related elements. After all unions, call find(i) for each i to get current root. Group by root.',
    ],
  }),

  'graph-coloring-uf': e({
    xray: [
      { text: 'Expand DSU to **2n** nodes for two colors', kind: 'signal' },
      { text: 'Conflict if find(u) == find(v) for any edge', kind: 'goal' },
    ],
    budget: ['2n DSU', 'bipartite check'],
    slottedTemplate: `bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> parent(2*n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (int u = 0; u < n; u++)
        for (int v : graph[u]) {
            if (find(u) == find(v)) return false;
            parent[find(u)] = find(v + n);
            parent[find(u + n)] = find(v);
        }
    return true;
}`,
    slots: [
      { id: 'OPPOSITE_COLOR', label: 'Opposite color offset', hint: 'v + n' },
    ],
    slotFills: {
      785: { OPPOSITE_COLOR: 'v + n // color of v opposite to u' },
    },
    helixOrder: [785],
    helixDelta: {
      785: 'Is Graph Bipartite: DSU with 2n nodes. Union(u, v+n) and (u+n, v). Conflict = same color.',
    },
    autopsies: [
      {
        cause: 'Missing union of (u+n, v) — only one direction',
        wrong: 'parent[find(u)] = find(v+n); // missing the reverse',
        testCase: 'Transitive bipartite constraint fails',
        fix: 'Always union both: (u, v+n) AND (u+n, v).',
      },
    ],
    sayIt: [
      'Bipartite DSU: double the nodes (2n). For edge (u,v): union(u, v+n) and (u+n, v). Conflict when u and v in same set.',
    ],
  }),

  'network-partition-uf': e({
    xray: [
      { text: 'Track **infection count** per component', kind: 'signal' },
      { text: 'Removing from **single-infected** component saves all', kind: 'goal' },
    ],
    budget: ['infection analysis', 'single source'],
    slottedTemplate: `vector<int> parent, sz;
// build DSU from graph
vector<int> infected(n);
for (int x : initial) infected[find(x)]++;
int best = -1, ans = n;
for (int x : initial) {
    int r = find(x);
    int saved = (infected[r] == 1) ? sz[r] : 0;
    if (saved > best || (saved == best && x < ans)) {
        best = saved; ans = x;
    }
}`,
    slots: [
      { id: 'SAVE_COND', label: 'When removal saves all nodes in component', hint: 'infected[r] == 1' },
    ],
    slotFills: {
      924: { SAVE_COND: 'infected[r] == 1 // exactly one initially infected node in component' },
    },
    helixOrder: [924],
    helixDelta: {
      924: 'Minimize Malware Spread: DSU + infection counts. Best node = single infection source in largest component.',
    },
    autopsies: [
      {
        cause: 'Counting all infected nodes as removable',
        wrong: 'saved = sz[r] // even with multiple infections',
        testCase: '2 infected in component — removing one still leaves another infected',
        fix: 'Only save size when infected count == 1 in component.',
      },
    ],
    sayIt: [
      'Network partition: DSU component size + infection count. Remove node from single-infected largest component.',
    ],
  }),

  // ── Mathematical Applications ──────────────────────────────────

  'number-theory-uf': e({
    xray: [
      { text: 'Union numbers via **prime factor** connections', kind: 'signal' },
      { text: 'Sieve-based approach for all numbers', kind: 'goal' },
    ],
    budget: ['prime factors', 'sieve', 'gcd'],
    slottedTemplate: `int largestComponentSize(vector<int>& nums) {
    int maxVal = *max_element(nums.begin(), nums.end());
    DSU dsu(maxVal + 1);
    for (int x : nums) {
        for (int f = 2; f * f <= x; f++) {
            if (x % f == 0) {
                dsu.unionSet(x, f);
                dsu.unionSet(x, x / f);
            }
        }
    }
    unordered_map<int,int> cnt;
    int ans = 0;
    for (int x : nums) ans = max(ans, ++cnt[dsu.find(x)]);
    return ans;
}`,
    slots: [
      { id: 'FACTOR_LOOP', label: 'Factor enumeration loop', hint: 'f*f <= x' },
    ],
    slotFills: {
      952: { FACTOR_LOOP: 'for (int f = 2; f * f <= x; f++)' },
      1627: { FACTOR_LOOP: 'for (int f = threshold+1; f <= n; f++) // connect multiples of same divisor' },
    },
    helixOrder: [952, 1627],
    helixDelta: {
      952: 'Largest Component: union each number with its prime factors. Factor loop O(sqrt(x)) per number.',
      1627: 'Graph Connectivity: sieve-style — for each divisor > threshold, union all its multiples.',
    },
    autopsies: [
      {
        cause: 'Factorizing 1 incorrectly',
        wrong: 'for (int f = 2; f*f <= 1; f++) // no factors, OK',
        testCase: 'nums = [1] — should be component of size 1',
        fix: 'No special handling needed; 1 has no factors and stays in its own set.',
      },
    ],
    sayIt: [
      'Number theory DSU: union numbers through their prime factors. Factor each number (O(sqrt(x))) and union with each factor.',
    ],
  }),

  'matrix-ops-uf': e({
    xray: [
      { text: '**Group** same-value cells in same row/col', kind: 'signal' },
      { text: 'Assign **rank** = max(rowMax, colMax) + 1', kind: 'goal' },
    ],
    budget: ['same-value group', 'rank assignment'],
    slottedTemplate: `map<int, vector<pair<int,int>>> vals;
for (int r=0; r<R; r++) for (int c=0; c<C; c++) vals[mat[r][c]].push_back({r,c});
vector<int> rowMax(R), colMax(C);
for (auto& [val, cells] : vals) {
    DSU dsu(R+C);
    for (auto& [r,c] : cells) dsu.unionSet(r, c+R);
    unordered_map<int,int> rank;
    for (auto& [r,c] : cells) {
        int p = dsu.find(r);
        rank[p] = max(rank[p], max(rowMax[r], colMax[c]) + 1);
    }
    for (auto& [r,c] : cells) {
        int rnk = rank[dsu.find(r)];
        ans[r][c] = rnk;
        rowMax[r] = max(rowMax[r], rnk);
        colMax[c] = max(colMax[c], rnk);
    }
}`,
    slots: [
      { id: 'GROUP_DIM', label: 'DSU dimensions for grouping', hint: 'R+C (rows + columns as nodes)' },
    ],
    slotFills: {
      1632: { GROUP_DIM: 'R+C // union row r with column c+R for same-value cells' },
    },
    helixOrder: [1632],
    helixDelta: {
      1632: 'Matrix Rank Transform: group equal-value cells sharing rows/cols via DSU. Assign group rank = max(row/col) + 1.',
    },
    autopsies: [
      {
        cause: 'Not uniting same-value cells in same row/col',
        wrong: 'assign ranks individually without DSU groups',
        testCase: 'Same value in same row — they must share the rank',
        fix: 'Union all same-value cells sharing a row or column into a DSU group.',
      },
    ],
    sayIt: [
      'Matrix rank: DSU of R+C nodes (rows + cols). Union same-value cells sharing row/col. Group rank = max(prev) + 1.',
    ],
  }),

  'equation-system-uf': e({
    xray: [
      { text: '**Weighted DSU**: weight[x] = ratio to root', kind: 'signal' },
      { text: 'Path compression **updates** weight multiplicatively', kind: 'goal' },
    ],
    budget: ['weighted dsu', 'ratio tracking'],
    slottedTemplate: `vector<int> parent;
vector<double> weight; // w[x] = value(x)/value(root(x))
int find(int x) {
    if (parent[x] != x) {
        int p = find(parent[x]);
        weight[x] *= /* SLOT: weightUpdate */;
        parent[x] = p;
    }
    return parent[x];
}
void unionSet(int a, int b, double val) { // val = a/b
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    parent[ra] = rb;
    weight[ra] = weight[b] * val / weight[a];
}
double query(int a, int b) {
    if (find(a) != find(b)) return -1.0;
    return weight[a] / weight[b];
}`,
    slots: [
      { id: 'WEIGHT_UPDATE', label: 'Weight update during find', hint: 'weight[parent[x]]' },
    ],
    slotFills: {
      399: { WEIGHT_UPDATE: 'weight[parent[x]]' },
      990: { WEIGHT_UPDATE: 'n/a — unweighted DSU, no ratio' },
    },
    helixOrder: [399, 990],
    helixDelta: {
      399: 'Evaluate Division: weighted DSU. union(a,b,val) sets weight[a]/weight[b]=val. Query returns ratio.',
      990: 'Equation Satisfaction: unweighted DSU. Union ==, check !=. No ratios involved.',
    },
    autopsies: [
      {
        cause: 'Incorrect weight update formula in union',
        wrong: 'weight[ra] = val; // ignoring existing weights of a and b',
        testCase: 'Intermediate nodes have weights; new weight must account for both paths to root',
        fix: 'weight[ra] = weight[b] * val / weight[a];',
      },
    ],
    sayIt: [
      'Weighted DSU for ratios: weight[x] = value(x)/value(root). Path compression multiplies weights. Union calculates root-level ratio.',
    ],
  }),

  // ── Weighted Union Find ────────────────────────────────────────

  'edge-weight-uf': e({
    xray: [
      { text: 'Track **additive** or **multiplicative** weight to root', kind: 'signal' },
      { text: 'Root-level formula: dist[ra] = dist[b] + w - dist[a]', kind: 'constraint' },
    ],
    budget: ['additive weight', 'root formula'],
    slottedTemplate: `vector<int> parent;
vector<long long> dist; // dist[x] = value(x) - value(root(x))
int find(int x) {
    if (parent[x] != x) {
        int p = find(parent[x]);
        dist[x] += dist[parent[x]];
        parent[x] = p;
    }
    return parent[x];
}
void unionSet(int a, int b, long long w) { // w = a - b
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    parent[ra] = rb;
    dist[ra] = dist[b] + w - dist[a];
}`,
    slots: [
      { id: 'DELTA_FORMULA', label: 'Root-level delta formula', hint: 'dist[b] + w - dist[a]' },
    ],
    slotFills: {
      1697: { DELTA_FORMULA: 'n/a — edge weight used as threshold, not stored in DSU' },
      1584: { DELTA_FORMULA: 'n/a — Kruskal uses edge weight directly, no DSU weight tracking' },
    },
    helixOrder: [1697, 1584],
    helixDelta: {
      1697: 'Edge-limited paths: sort edges by weight threshold; union incrementally; no per-edge weight in DSU.',
      1584: 'Min Cost: Kruskal with edge weighting. Edge weight is Manhattan distance, used for MST cost calculation.',
    },
    autopsies: [
      {
        cause: 'Sign error in delta formula',
        wrong: 'dist[ra] = dist[a] + w - dist[b]; // signs reversed',
        testCase: 'Query returns negative of expected value',
        fix: 'dist[ra] = dist[b] + w - dist[a]; // derived from: a - b = w and a = dist[a] + rootA',
      },
    ],
    sayIt: [
      'Edge weight DSU: dist[x] = value relative to root. Union root-level formula: dist[ra] = dist[b] + w - dist[a].',
    ],
  }),

  'union-weight-uf': e({
    xray: [
      { text: 'Sort edges by **weight**; union incrementally', kind: 'signal' },
      { text: 'Stop when **start-end connection** established', kind: 'goal' },
    ],
    budget: ['weight sort', 'min max path'],
    slottedTemplate: `int minEffortPath(vector<vector<int>>& heights) {
    int R=heights.size(), C=heights[0].size();
    vector<array<int,3>> edges;
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        if (r+1<R) edges.push_back({abs(heights[r][c]-heights[r+1][c]), r*C+c, (r+1)*C+c});
        if (c+1<C) edges.push_back({abs(heights[r][c]-heights[r][c+1]), r*C+c, r*C+c+1});
    }
    sort(edges.begin(), edges.end());
    DSU dsu(R*C);
    for (auto& [w, u, v] : edges) {
        dsu.unionSet(u, v);
        if (dsu.find(0) == dsu.find(R*C-1)) return /* SLOT: returnWeight */;
    }
    return 0;
}`,
    slots: [
      { id: 'RETURN_WEIGHT', label: 'Return value when connected', hint: 'w (current edge weight)' },
    ],
    slotFills: {
      1631: { RETURN_WEIGHT: 'w // return the max edge weight used to connect start→end' },
    },
    helixOrder: [1631],
    helixDelta: {
      1631: 'Path With Minimum Effort: sort edges by height difference. Union incrementally. Return diff when start→end connects.',
    },
    autopsies: [
      {
        cause: 'Returning accumulated cost instead of current edge diff',
        wrong: 'return currentCost; // summing diffs',
        testCase: 'Path effort = max diff, not sum of diffs',
        fix: 'Return current edge\'s diff when start-end connection is first established.',
      },
    ],
    sayIt: [
      'Union by weight: sort edges by weight ascending. Union incrementally. Return current weight when endpoints connect.',
    ],
  }),

  'path-weights-uf': e({
    xray: [
      { text: '**Ratio** tracking: weight[x] = value(x)/value(root)', kind: 'signal' },
      { text: 'Path compression **multiplies** weights', kind: 'constraint' },
    ],
    budget: ['ratio tracking', 'multiplicative weight'],
    slottedTemplate: `vector<int> parent;
vector<double> mult; // mult[x] = val(x) / val(root(x))
int find(int x) {
    if (parent[x] != x) {
        int p = find(parent[x]);
        mult[x] *= mult[parent[x]];
        parent[x] = p;
    }
    return parent[x];
}
void unionSet(int a, int b, double val) { // val = a/b
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    parent[ra] = rb;
    mult[ra] = mult[b] * val / mult[a];
}
double query(int a, int b) {
    if (find(a) != find(b)) return -1.0;
    return mult[a] / mult[b];
}`,
    slots: [
      { id: 'MULT_FIND', label: 'Weight update during find', hint: 'mult[parent[x]]' },
    ],
    slotFills: {
      399: { MULT_FIND: 'mult[parent[x]]' },
    },
    helixOrder: [399],
    helixDelta: {
      399: 'Evaluate Division: weighted DSU with multiplicative ratios. Path compression keeps ratios consistent.',
    },
    autopsies: [
      {
        cause: 'Multiplicative cumulative error from path compression chain',
        wrong: 'Accumulating many multiplications without normalization',
        testCase: 'deep chain: mult[a] *= mult[parent[a]] * mult[parent[parent[a]]]...',
        fix: 'Path compression updates mult[x] to go directly to root; depth never exceeds log(n).',
      },
    ],
    sayIt: [
      'Path weights: mult[x] stores ratio to root. Path compression: mult[x] *= mult[parent[x]]. Query: mult[a]/mult[b].',
    ],
  }),

  // ── Incremental Union Find ─────────────────────────────────────

  'online-algorithm-uf': e({
    xray: [
      { text: 'Initialize with **parent = -1** (not added)', kind: 'signal' },
      { text: 'On first add: set **self-parent**, increment count', kind: 'goal' },
    ],
    budget: ['-1 sentinel', 'incremental add'],
    slottedTemplate: `vector<int> parent;
int components = 0;
void add(int idx) {
    if (parent[idx] != -1) return; // already added
    parent[idx] = idx;
    components++;
    for (each neighbor nbr of idx) {
        if (parent[nbr] != -1) { // neighbor exists
            int ri = find(idx), rn = find(nbr);
            if (ri != rn) { parent[ri] = rn; components--; }
        }
    }
}`,
    slots: [
      { id: 'SENTINEL', label: 'Sentinel value for uninitialized', hint: '-1' },
    ],
    slotFills: {
      305: { SENTINEL: '-1 // not yet a land cell' },
    },
    helixOrder: [305],
    helixDelta: {
      305: 'Islands II: parent initial = -1. add(): if not added, set self, increment count, union existing neighbors.',
    },
    autopsies: [
      {
        cause: 'Not checking for duplicate position additions',
        wrong: 'parent[idx] = idx; components++; // even if already added',
        testCase: 'Same position added twice → double count',
        fix: 'if (parent[idx] != -1) return; // skip duplicates',
      },
    ],
    sayIt: [
      'Online DSU: sentinel -1 = not added. First add: self-parent, increment count. Union neighbors: decrement on merge.',
    ],
  }),

  'persistent-uf': e({
    xray: [
      { text: '**No path compression** (preserves history)', kind: 'constraint' },
      { text: 'Store **changes** on stack for rollback', kind: 'signal' },
    ],
    budget: ['no compression', 'history stack'],
    slottedTemplate: `struct PersistentDSU {
    vector<int> parent, rank;
    vector<tuple<int,int,int,int>> hist; // (x, oldParent, y, oldRank)
    void init(int n) { parent.resize(n); rank.resize(n); iota(parent.begin(), parent.end(), 0); }
    int find(int x) { while (parent[x]!=x) x=parent[x]; return x; }
    void unionSet(int a, int b) {
        int ra=find(a), rb=find(b);
        if (ra==rb) { hist.push_back({-1,-1,-1,-1}); return; }
        if (rank[ra] < rank[rb]) swap(ra, rb);
        hist.push_back({rb, parent[rb], ra, rank[ra]});
        parent[rb] = ra;
        if (rank[ra]==rank[rb]) rank[ra]++;
    }
    void rollback() {
        auto [x,op, y,or_] = hist.back(); hist.pop_back();
        if (x!=-1) { parent[x]=op; rank[y]=or_; }
    }
};`,
    slots: [
      { id: 'ROLLBACK_MODE', label: 'Rollback strategy', hint: 'snapshot-based vs per-operation undo' },
    ],
    slotFills: {
      0: { ROLLBACK_MODE: 'per-operation undo: each union pushes one history entry; rollback() reverts last union' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Using path compression with persistence',
        wrong: 'find with path compression modifies parent of many nodes',
        testCase: 'History tracking explodes — O(n) entries per find',
        fix: 'Use iterative find without path compression. Only union operations modify history.',
      },
    ],
    sayIt: [
      'Persistent DSU: iterative find (no compression). Every union pushes changes to a stack. Rollback pops and restores.',
    ],
  }),

  'reversible-uf': e({
    xray: [
      { text: '**Operation stack** records all modifications', kind: 'signal' },
      { text: 'Snapshot-based **rollback** to any point', kind: 'goal' },
    ],
    budget: ['operation log', 'snapshot rollback'],
    slottedTemplate: `struct ReversibleDSU {
    vector<int> parent, sz;
    struct Op { int x, op, y, os; };
    vector<Op> ops;
    int find(int x) { while (parent[x]!=x) x=parent[x]; return x; }
    void unionSet(int a, int b) {
        int ra=find(a), rb=find(b);
        if (ra==rb) { ops.push_back({-1,-1,-1,-1}); return; }
        if (sz[ra] < sz[rb]) swap(ra, rb);
        ops.push_back({rb, parent[rb], ra, sz[ra]});
        parent[rb]=ra; sz[ra]+=sz[rb];
    }
    int snapshot() { return ops.size(); }
    void rollbackTo(int snap) {
        while ((int)ops.size() > snap) {
            auto [x,op,y,os] = ops.back(); ops.pop_back();
            if (x!=-1) { parent[x]=op; sz[y]=os; }
        }
    }
};`,
    slots: [
      { id: 'SNAPSHOT_USE', label: 'Snapshot usage pattern', hint: 'save before batch; rollback to revert batch' },
    ],
    slotFills: {
      0: { SNAPSHOT_USE: 'int snap = dsu.snapshot(); tryOperation(); if (fails) dsu.rollbackTo(snap);' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Rollback target beyond ops.size()',
        wrong: 'rollbackTo(5) when ops.size() == 3',
        testCase: 'Ops vector underflow',
        fix: 'Ensure rollback target ≤ ops.size(). Validate before loop.',
      },
    ],
    sayIt: [
      'Reversible DSU: save snapshot (int), perform operations, rollback to snapshot if needed. No path compression.',
    ],
  }),

  // ── Union Find with Custom Logic ───────────────────────────────

  'multi-uf-struct-uf': e({
    xray: [
      { text: '**Multiple DSU** instances for different constraints', kind: 'signal' },
      { text: 'Process **shared edges** first', kind: 'goal' },
    ],
    budget: ['multi-dsu', 'shared edges'],
    slottedTemplate: `struct DSU {
    vector<int> p; int comps;
    DSU(int n): comps(n), p(n) { iota(p.begin(),p.end(),0); }
    int find(int x) { return p[x]==x ? x : p[x]=find(p[x]); }
    bool unions(int a, int b) {
        int ra=find(a), rb=find(b);
        if (ra==rb) return false;
        p[ra]=rb; comps--;
        return true;
    }
};
int maxNumEdgesToRemove(int n, vector<vector<int>>& edges) {
    DSU alice(n), bob(n);
    int needed = 0;
    for (auto& e : edges) if (e[0]==3)
        needed += alice.unions(e[1]-1,e[2]-1) | bob.unions(e[1]-1,e[2]-1);
    for (auto& e : edges) if (e[0]==1)
        needed += alice.unions(e[1]-1,e[2]-1);
    for (auto& e : edges) if (e[0]==2)
        needed += bob.unions(e[1]-1,e[2]-1);
    return (alice.comps==1 && bob.comps==1) ? edges.size()-needed : -1;
}`,
    slots: [
      { id: 'EDGE_ORDER', label: 'Edge processing order', hint: 'type 3 → type 1 → type 2' },
    ],
    slotFills: {
      1579: { EDGE_ORDER: 'type-3 (shared) first; then type-1 (Alice); then type-2 (Bob)' },
    },
    helixOrder: [1579],
    helixDelta: {
      1579: 'Multi-DSU: Alice + Bob DSU instances. Process type-3 shared edges first; then type-1 and type-2.',
    },
    autopsies: [
      {
        cause: 'Processing type-1 and type-2 before type-3',
        wrong: 'for (auto& e : edges) { if (e[0]==1) ... if (e[0]==2) ... if (e[0]==3) ... }',
        testCase: 'Type-3 edge shared by both — could reduce needed edges for both',
        fix: 'Always process type-3 (shared) edges first; they benefit both DSUs.',
      },
    ],
    sayIt: [
      'Multi-DSU: create one DSU per constraint set. Process shared resources first that affect all DSUs.',
    ],
  }),

  'lazy-uf': e({
    xray: [
      { text: '**Deferred** DSU construction', kind: 'signal' },
      { text: 'Discover elements **on-the-fly** via map', kind: 'goal' },
    ],
    budget: ['deferred build', 'on-the-fly map'],
    slottedTemplate: `unordered_map<string, int> id;
vector<int> parent;
int get(const string& s) {
    if (!id.count(s)) {
        id[s] = parent.size();
        parent.push_back(parent.size());
    }
    return id[s];
}
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
void lazyUnion(const string& a, const string& b) {
    int ra = find(get(a)), rb = find(get(b));
    if (ra != rb) parent[ra] = rb;
}`,
    slots: [
      { id: 'LAZY_INIT', label: 'Lazy element discovery', hint: 'map string → idx, push_back parent' },
    ],
    slotFills: {
      721: { LAZY_INIT: 'map email → idx; parent grows on first encounter' },
    },
    helixOrder: [721],
    helixDelta: {
      721: 'Accounts Merge: lazily add emails to DSU as they appear. No upfront allocation needed.',
    },
    autopsies: [
      {
        cause: 'Not growing parent alongside id map',
        wrong: 'if (!id.count(s)) id[s] = id.size(); // misses parent.push_back',
        testCase: 'find(get("new")) on non-existent parent entry',
        fix: 'id[s] = parent.size(); parent.push_back(parent.size()); // synchronized',
      },
    ],
    sayIt: [
      'Lazy DSU: on first encounter, map element to index and grow parent vector. No pre-allocation.',
    ],
  }),

  'level-based-uf': e({
    xray: [
      { text: 'Sort edges by **level/diff** ascending', kind: 'signal' },
      { text: 'Union incrementally; stop when **condition met**', kind: 'goal' },
    ],
    budget: ['threshold sort', 'early stop'],
    slottedTemplate: `int minEffortPath(vector<vector<int>>& heights) {
    int R=heights.size(), C=heights[0].size();
    vector<array<int,3>> edges;
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        if (r+1<R) edges.push_back({abs(heights[r][c]-heights[r+1][c]), r*C+c, (r+1)*C+c});
        if (c+1<C) edges.push_back({abs(heights[r][c]-heights[r][c+1]), r*C+c, r*C+c+1});
    }
    sort(edges.begin(), edges.end());
    DSU dsu(R*C);
    for (auto& [diff, u, v] : edges) {
        dsu.unionSet(u, v);
        if (/* SLOT: stopCond */) return diff;
    }
    return 0;
}`,
    slots: [
      { id: 'STOP_COND', label: 'Early stop condition', hint: 'dsu.find(0) == dsu.find(R*C-1)' },
    ],
    slotFills: {
      1631: { STOP_COND: 'dsu.find(0) == dsu.find(R*C-1) // start→end connected' },
    },
    helixOrder: [1631],
    helixDelta: {
      1631: 'Path With Minimum Effort: level-based DSU. Sort edges by height difference. Union until start→end connected.',
    },
    autopsies: [
      {
        cause: 'Processing all edges even after condition met',
        wrong: 'for (auto& [d,u,v] : edges) { dsu.unionSet(u,v); } // no break',
        testCase: 'Returns last edge weight, not the one that first connected start→end',
        fix: 'Check condition inside loop; return current diff when met.',
      },
    ],
    sayIt: [
      'Level-based DSU: sort edges by threshold. Union incrementally. Stop and return current edge weight when condition satisfied.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
