import type { TaxonomyNode } from '../../types'
import { leaf } from './helpers'

const CPP = `#include <vector>
#include <numeric>
#include <functional>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

`

const hue = 'teal'

// ── Initialization ─────────────────────────────────────────────

export const arrayRepLeaf: TaxonomyNode = leaf('array-rep-uf', 'Array Representation', hue, {
  template: `${CPP}int parent[N];
iota(parent, parent + N, 0);
int find(int x) {
    while (parent[x] != x) x = parent[x];
    return x;
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = rb;
}`,
  problems: [
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Standard array DSU on adjacency matrix.' },
  ],
  pitfalls: ['❌ No path compression — O(n) find leads to TLE on large inputs.', '❌ Forgetting iota initialization — parent[i] must equal i for roots.'],
  edgeCases: [
    { input: 'n = 1', breaks: 'single element, find returns 0 immediately' },
    { input: 'all nodes already connected', breaks: 'no unions needed, components = 1' },
  ],
  interviewTip: 'Start with array DSU for clarity, then mention path compression + union by rank as optimizations.',
})

export const treeRepLeaf: TaxonomyNode = leaf('tree-rep-uf', 'Tree Representation', hue, {
  template: `${CPP}struct Node {
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
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Standard DSU with tree/array representation on edge list.' },
  ],
  pitfalls: ['❌ Memory leaks from dynamic Node allocation — prefer array DSU where possible.', '❌ Not setting parent to self in constructor — find returns garbage pointer.'],
  edgeCases: [
    { input: 'empty graph (0 nodes)', breaks: 'no edges to process' },
    { input: 'multiple disconnected edges', breaks: 'no cycle found, returns empty' },
  ],
  interviewTip: 'Tree representation is more flexible but array-based DSU is preferred in interviews for simplicity and performance.',
})

export const customMapLeaf: TaxonomyNode = leaf('custom-map-uf', 'Custom Element Mapping', hue, {
  template: `${CPP}unordered_map<string, int> id;
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
    if (ra != rb) parent[ra] = rb;
}`,
  problems: [
    { id: 721, title: 'Accounts Merge', slug: 'accounts-merge', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Map emails to indices; dynamic parent vector; group by root after unions.' },
  ],
  pitfalls: ['❌ Not growing parent vector when new element mapped — out-of-bounds access.', '❌ Forgetting to call find() on each element when collecting groups — stale roots.'],
  edgeCases: [
    { input: 'single email per account', breaks: 'no unions needed; each email is its own group' },
    { input: 'empty email list', breaks: 'return empty accounts list' },
  ],
  interviewTip: 'Custom mapping: unordered_map<string, int> + dynamic parent vector. Discover elements on first encounter.',
})

// ── Find Operation ─────────────────────────────────────────────

export const basicFindLeaf: TaxonomyNode = leaf('basic-find-uf', 'Basic Find', hue, {
  template: `${CPP}int find(int x) {
    while (parent[x] != x) x = parent[x];
    return x;
}`,
  problems: [
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'META'], lineChanges: 'Basic find in adjacency matrix DSU.' },
  ],
  pitfalls: ['❌ Recursive find without path compression causes stack overflow on deep chains.', '❌ Infinite loop if root not self-referencing (parent[root] != root).'],
  edgeCases: [
    { input: 'chain of n elements', breaks: 'O(n) find — worst case' },
    { input: 'single element', breaks: 'find returns immediately (parent[x] == x)' },
  ],
  interviewTip: 'Basic find is O(n) worst-case. Immediately mention path compression as the optimization.',
})

export const pathCompressionLeaf: TaxonomyNode = leaf('path-compression-uf', 'Path Compression', hue, {
  template: `${CPP}int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}`,
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Path-compressed find for O(α(n)) cycle detection.' },
    { id: 128, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'DSU on consecutive numbers: union(num, num+1); track component sizes.' },
  ],
  pitfalls: ['❌ Forgetting to return the compressed parent — find returns stale parent.', '❌ Using iterative find when recursive path compression is expected.'],
  edgeCases: [
    { input: 'find on root', breaks: 'returns immediately, no change needed' },
    { input: 'find on deeply nested element', breaks: 'path compression flattens to O(1) for subsequent calls' },
  ],
  interviewTip: 'Path compression alone gives amortized near-constant time. Always combine with union by rank for optimal DSU.',
})

export const pathSplittingLeaf: TaxonomyNode = leaf('path-splitting-uf', 'Path Splitting / Halving', hue, {
  template: `${CPP}// Path Halving
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
// Path Splitting
int find(int x) {
    while (parent[x] != x) {
        int nxt = parent[x];
        parent[x] = parent[parent[x]];
        x = nxt;
    }
    return x;
}`,
  problems: [
    { id: 0, title: 'Concept', slug: 'path-splitting', companies: ['GOOGLE'], lineChanges: 'Theoretical alternatives to recursive path compression; same O(α(n)) amortized bounds.' },
  ],
  pitfalls: ['❌ Confusing halving (skip every other) with splitting (every node points to grandparent).', '❌ Using splitting when path compression + rank is simpler and equally efficient.'],
  edgeCases: [
    { input: 'chain of 2 elements', breaks: 'no grandparent exists; behaves like basic find' },
    { input: 'root node', breaks: 'loop exits immediately' },
  ],
  interviewTip: 'Path splitting/halving are iterative alternatives to recursive path compression, useful in languages with recursion limits.',
})

// ── Union Operation ────────────────────────────────────────────

export const basicUnionLeaf: TaxonomyNode = leaf('basic-union-uf', 'Basic Union', hue, {
  template: `${CPP}void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = rb;
}`,
  problems: [
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'META'], lineChanges: 'Basic union in adjacency matrix DSU.' },
  ],
  pitfalls: ['❌ Calling parent[a] = b directly instead of parent[find(a)] = find(b).', '❌ Not checking ra == rb — decrementing component count for same-set union.'],
  edgeCases: [
    { input: 'union of same element', breaks: 'ra == rb, no-op' },
    { input: 'union of already connected elements', breaks: 'skipped, count unchanged' },
  ],
  interviewTip: 'Always call find on both arguments first. Without balancing, basic union can create O(n) deep trees.',
})

export const unionByRankLeaf: TaxonomyNode = leaf('union-rank-uf', 'Union by Rank / Size', hue, {
  template: `${CPP}vector<int> parent, sz;
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;
    sz[ra] += sz[rb];
}`,
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Union by rank for balanced tree in cycle detection.' },
    { id: 1202, title: 'Smallest String With Swaps', slug: 'smallest-string-with-swaps', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Union by size; group indices then sort characters per group.' },
  ],
  pitfalls: ['❌ Swapping on equal rank (<= instead of <) causes unnecessary swaps.', '❌ Not incrementing rank when ranks are equal — tree height grows faster.'],
  edgeCases: [
    { input: 'two singletons with equal rank', breaks: 'rank increases by 1 after union' },
    { input: 'large tree absorbs small tree', breaks: 'rank unchanged, size updates' },
  ],
  interviewTip: 'Union by rank ensures O(log n) height. Union by size also works and gives component size info for free.',
})

export const unionCustomLeaf: TaxonomyNode = leaf('union-custom-uf', 'Union by Custom Criteria', hue, {
  template: `${CPP}void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (ra > rb) swap(ra, rb);
    parent[rb] = ra;
}`,
  problems: [
    { id: 1632, title: 'Rank Transform of a Matrix', slug: 'rank-transform-of-a-matrix', companies: ['GOOGLE'], lineChanges: 'Custom union by lower index for same-value matrix cell grouping.' },
  ],
  pitfalls: ['❌ Non-deterministic tie-breaking — different runs produce different DSU structures.', '❌ Union order affecting equivalence semantics — custom criteria must be consistent.'],
  edgeCases: [
    { input: 'equal priority elements', breaks: 'deterministic fallback (e.g., lower index)' },
    { input: 'cyclic merge criteria', breaks: 'infinite loop or undefined behavior' },
  ],
  interviewTip: 'Custom union is rare. Only use when the problem specifically needs it (e.g., matrix rank transform).',
})

// ── Data Structure Optimizations ───────────────────────────────

export const pcRankedLeaf: TaxonomyNode = leaf('pc-ranked-uf', 'Path Compression + Union by Rank', hue, {
  template: `${CPP}vector<int> parent, rank;
void init(int n) {
    parent.resize(n); rank.resize(n);
    iota(parent.begin(), parent.end(), 0);
}
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank[ra] < rank[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
}`,
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Fully optimized DSU for cycle detection — O(α(n)) per operation.' },
    { id: 1202, title: 'Smallest String With Swaps', slug: 'smallest-string-with-swaps', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Optimized DSU with size tracking for index grouping.' },
  ],
  pitfalls: ['❌ Forgetting rank increment on equal ranks — tree height doubles.', '❌ Using rank vs size inconsistently across find and union.'],
  edgeCases: [
    { input: 'single element', breaks: 'find returns immediately' },
    { input: 'n unions on n elements', breaks: 'O(n α(n)) total time' },
  ],
  interviewTip: 'Commit this implementation to memory. Combined path compression + union by rank gives inverse-Ackermann amortized time.',
})

export const sizeTrackingLeaf: TaxonomyNode = leaf('size-tracking-uf', 'Size Tracking', hue, {
  template: `${CPP}vector<int> parent, sz;
void init(int n) {
    parent.resize(n); sz.resize(n, 1);
    iota(parent.begin(), parent.end(), 0);
}
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;
    sz[ra] += sz[rb];
}`,
  problems: [
    { id: 323, title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', companies: ['AMAZON', 'META'], lineChanges: 'Track component count: decrement on successful union.' },
    { id: 952, title: 'Largest Component Size by Common Factor', slug: 'largest-component-size-by-common-factor', companies: ['GOOGLE'], lineChanges: 'Union by shared prime factors; track max component size.' },
  ],
  pitfalls: ['❌ Accessing sz[x] without calling find(x) first — stale size from non-root.', '❌ Not updating old root size after union — size stored at new root only.'],
  edgeCases: [
    { input: 'single element component', breaks: 'size = 1' },
    { input: 'all elements merge into one', breaks: 'sz[root] = n' },
  ],
  interviewTip: 'Size tracking serves double duty: balancing union AND answering "what is the largest component?" queries.',
})

export const dynamicAddLeaf: TaxonomyNode = leaf('dynamic-add-uf', 'Dynamic Element Addition', hue, {
  template: `${CPP}vector<int> parent, rank;
int addElement() {
    int idx = parent.size();
    parent.push_back(idx);
    rank.push_back(0);
    return idx;
}
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank[ra] < rank[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
}`,
  problems: [
    { id: 721, title: 'Accounts Merge', slug: 'accounts-merge', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Dynamic email addition: push_back on first encounter via unordered_map.' },
    { id: 1697, title: 'Checking Existence of Edge Length Limited Paths', slug: 'checking-existence-of-edge-length-limited-paths', companies: ['GOOGLE'], lineChanges: 'Nodes known upfront; edges processed dynamically by threshold.' },
  ],
  pitfalls: ['❌ New element initialized with wrong parent (e.g., parent 0) instead of self.', '❌ Not resizing rank vector alongside parent — mismatch causes undefined behavior.'],
  edgeCases: [
    { input: 'add elements after unions', breaks: 'new element is independent until unioned' },
    { input: 'duplicate element addition', breaks: 'duplicate index returned if not guarded' },
  ],
  interviewTip: 'Dynamic DSU: parent.push_back(idx) where idx == parent.size() before push. Essential for problems with unknown element count.',
})

// ── Connected Components ───────────────────────────────────────

export const countingComponentsLeaf: TaxonomyNode = leaf('counting-components-uf', 'Counting Components', hue, {
  template: `${CPP}int components = n;
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) { parent[ra] = rb; components--; }
}`,
  problems: [
    { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', companies: ['AMAZON', 'META'], mustKnow: true, lineChanges: 'Count friend circles via DSU on adjacency matrix.' },
    { id: 323, title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', companies: ['AMAZON', 'META'], mustKnow: true, lineChanges: 'Standard: init = n, decrement on each union.' },
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'Flatten grid to 1D; union adjacent land; count = initial land - successful unions.' },
  ],
  pitfalls: ['❌ Decrementing unconditionally (even when ra == rb) — count goes negative.', '❌ Not initializing component count before processing edges.'],
  edgeCases: [
    { input: 'fully disconnected graph', breaks: 'components = n' },
    { input: 'fully connected graph', breaks: 'components = 1 after n-1 unions' },
  ],
  interviewTip: 'Components = n - successful_unions. Elegant pattern: init count, decrement on ra != rb only.',
})

export const componentPropsLeaf: TaxonomyNode = leaf('component-props-uf', 'Component Properties', hue, {
  template: `${CPP}vector<int> parent, sz;
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;
    sz[ra] += sz[rb];
}`,
  problems: [
    { id: 952, title: 'Largest Component Size by Common Factor', slug: 'largest-component-size-by-common-factor', companies: ['GOOGLE'], lineChanges: 'Union by prime factor; track max sz[root] after all unions.' },
    { id: 1319, title: 'Number of Operations to Make Network Connected', slug: 'number-of-operations-to-make-network-connected', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Count extra edges (edges beyond n-1) vs components needed.' },
  ],
  pitfalls: ['❌ Merging property values into old root instead of new root after union.', '❌ Not re-finding root before reading property — property stored only at root.'],
  edgeCases: [
    { input: 'component property overflow', breaks: 'use long long for sums' },
    { input: 'negative property values', breaks: 'merge logic must handle sign correctly' },
  ],
  interviewTip: 'Property DSU: store any mergeable value at root. Common properties: size, sum, max, min. Update on union.',
})

export const dynamicConnectivityLeaf: TaxonomyNode = leaf('dynamic-connect-uf', 'Dynamic Connectivity', hue, {
  template: `${CPP}vector<int> parent, rank;
void init(int n) { parent.resize(n); rank.resize(n); iota(parent.begin(), parent.end(), 0); }
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
void unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank[ra] < rank[rb]) swap(ra, rb);
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
}`,
  problems: [
    { id: 305, title: 'Number of Islands II', slug: 'number-of-islands-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Add land cells one by one; union with adjacent land; track component count.' },
    { id: 1627, title: 'Graph Connectivity With Threshold', slug: 'graph-connectivity-with-threshold', companies: ['GOOGLE'], lineChanges: 'Sieve-based: connect multiples of divisors > threshold; answer connectivity queries.' },
  ],
  pitfalls: ['❌ Processing all edges before answering queries — must interleave edge additions and queries.', '❌ Not sorting queries by threshold alongside edges for offline processing.'],
  edgeCases: [
    { input: 'query before any edges', breaks: 'each node is its own component' },
    { input: 'no queries but edges added', breaks: 'just build DSU state' },
  ],
  interviewTip: 'Dynamic connectivity = lockstep processing. Sort edges/queries by threshold. Union as threshold increases.',
})

// ── Cycle Detection ────────────────────────────────────────────

export const undirectedCycleLeaf: TaxonomyNode = leaf('undirected-cycle-uf', 'Undirected Graph Cycles', hue, {
  template: `${CPP}bool formsCycle(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return true;
    parent[ra] = rb;
    return false;
}`,
  problems: [
    { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'First edge where find(u) == find(v) is the redundant edge.' },
    { id: 261, title: 'Graph Valid Tree', slug: 'graph-valid-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Check: exactly n-1 edges AND no cycles via DSU.' },
  ],
  pitfalls: ['❌ Not detecting self-loops (a == b) — would be missed by DSU alone.', '❌ Using DSU for directed graphs — only works for undirected.'],
  edgeCases: [
    { input: 'self-loop', breaks: 'a == b, forms cycle immediately' },
    { input: 'multi-edge between same pair', breaks: 'second edge forms cycle' },
  ],
  interviewTip: 'DSU cycle detection: if find(u) == find(v) before union, edge completes a cycle. Only for undirected graphs.',
})

export const directedCycleLeaf: TaxonomyNode = leaf('directed-cycle-uf', 'Directed Graph Cycles', hue, {
  template: `${CPP}// DSU + indegree tracking for directed graphs
vector<int> parent, indegree;
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
bool unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false; // cycle
    parent[ra] = rb;
    return true;
}`,
  problems: [
    { id: 685, title: 'Redundant Connection II', slug: 'redundant-connection-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Combine DSU with indegree tracking. Two cases: 2-parent conflict and cycle.' },
  ],
  pitfalls: ['❌ Using DSU alone — directed cycles need indegree/DFS analysis alongside DSU.', '❌ Not handling the two-parent conflict case separately from cycle detection.'],
  edgeCases: [
    { input: 'node with two incoming edges', breaks: 'one of the two is the extra edge' },
    { input: 'directed cycle without 2-parent', breaks: 'DSU detects cycle when find(u)==find(v)' },
  ],
  interviewTip: 'Directed Redundant Connection: two conflict types. Check 2-parent candidate first, then DSU cycle detection.',
})

export const cycleClassifyLeaf: TaxonomyNode = leaf('cycle-classify-uf', 'Cycle Classification', hue, {
  template: `${CPP}int idx(int r, int c, int cols) { return r * cols + c; }
vector<int> parent;
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
bool unionSet(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return true; // cycle
    parent[ra] = rb;
    return false;
}`,
  problems: [
    { id: 1559, title: 'Detect Cycles in 2D Grid', slug: 'detect-cycles-in-2d-grid', companies: ['GOOGLE'], lineChanges: 'Flatten grid to 1D; union adjacent same-value cells; cycle on find equality.' },
  ],
  pitfalls: ['❌ Wrong flattening formula (r + c*R vs r*C + c) — row-major order.', '❌ Checking all 4 neighbors instead of 2 (top+left) — redundant unions.'],
  edgeCases: [
    { input: 'single cell grid', breaks: 'no adjacent cells, no possible cycle' },
    { input: 'grid with all same values', breaks: 'cycle detected when diamond pattern closes' },
  ],
  interviewTip: 'Grid flatten: idx = r * C + c. Union top and left same-value cells. Cycle when same component found.',
})

// ── Minimum Spanning Tree ──────────────────────────────────────

export const kruskalLeaf: TaxonomyNode = leaf('kruskal-uf', "Kruskal's Algorithm", hue, {
  template: `${CPP}struct Edge { int u, v, w; };
int kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a.w < b.w; });
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); };
    int cost = 0, cnt = 0;
    for (auto& e : edges) {
        int ru = find(e.u), rv = find(e.v);
        if (ru != rv) { parent[ru] = rv; cost += e.w; if (++cnt == n - 1) break; }
    }
    return cnt == n - 1 ? cost : -1;
}`,
  problems: [
    { id: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Compute all O(n²) Manhattan distances; Kruskal for MST.' },
    { id: 1135, title: 'Connecting Cities With Minimum Cost', slug: 'connecting-cities-with-minimum-cost', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Standard Kruskal on pre-defined weighted edges.' },
  ],
  pitfalls: ['❌ Not breaking early after n-1 edges — wasted iterations on dense graphs.', '❌ Sorting in descending order — Kruskal requires ascending edge weights.'],
  edgeCases: [
    { input: 'disconnected graph', breaks: 'MST impossible, return -1' },
    { input: 'single node', breaks: 'MST cost = 0, break immediately' },
  ],
  interviewTip: 'Kruskal: sort edges ascending → DSU union if no cycle → stop at n-1 edges. O(E log E) from sorting.',
})

export const criticalEdgesLeaf: TaxonomyNode = leaf('critical-edges-uf', 'Critical Edges in MST', hue, {
  template: `${CPP}int mstWeight = kruskal(n, edges, -1);
vector<int> crit, pseudo;
for each edge i:
    int without = kruskal(n, edges, i);
    if (without > mstWeight) crit.push_back(i);
    else {
        int with = kruskalForce(n, edges, i);
        if (with == mstWeight) pseudo.push_back(i);
    }`,
  problems: [
    { id: 1489, title: 'Find Critical and Pseudo-Critical Edges in MST', slug: 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree', companies: ['GOOGLE'], lineChanges: 'Force-exclude and force-include each edge; compare resulting MST weights.' },
  ],
  pitfalls: ['❌ Confusing definitions: critical = not in ANY MST; pseudo = in at least one.', '❌ Not comparing against MST weight computed without edge modifications.'],
  edgeCases: [
    { input: 'all edges critical', breaks: 'edges that form unique MST' },
    { input: 'graph with multiple equal-weight MSTs', breaks: 'many edges may be pseudo-critical' },
  ],
  interviewTip: 'Critical: exclusion increases weight. Pseudo-critical: forced inclusion gives same weight. Test both per edge.',
})

// ── Equivalence Relationships ───────────────────────────────────

export const stringGroupingLeaf: TaxonomyNode = leaf('string-grouping-uf', 'String / Account Grouping', hue, {
  template: `${CPP}unordered_map<string, int> id;
vector<int> parent;
int get(const string& s) {
    if (!id.count(s)) { id[s] = parent.size(); parent.push_back(parent.size()); }
    return id[s];
}
int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
void unionSet(const string& a, const string& b) {
    int ra = find(get(a)), rb = find(get(b));
    if (ra != rb) parent[ra] = rb;
}
unordered_map<int, vector<string>> groups;
for (auto& [s,_] : id) groups[find(get(s))].push_back(s);`,
  problems: [
    { id: 721, title: 'Accounts Merge', slug: 'accounts-merge', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Map emails; union per account; collect sorted groups with name.' },
    { id: 737, title: 'Sentence Similarity II', slug: 'sentence-similarity-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Union similar word pairs; check if both sentences are equivalent via DSU.' },
  ],
  pitfalls: ['❌ Not sorting within each group after collection — output must be sorted.', '❌ Forgetting to include account name as first element of each result group.'],
  edgeCases: [
    { input: 'single email per account', breaks: 'no unions, each account stays separate' },
    { input: 'transitive grouping chain', breaks: 'a=b, b=c, but a and c never directly unioned' },
  ],
  interviewTip: 'String grouping pattern: map → union → collect by root → sort each group. Handles transitive relationships.',
})

export const equationSatLeaf: TaxonomyNode = leaf('equation-sat-uf', 'Equation Satisfaction', hue, {
  template: `${CPP}bool equationsPossible(vector<string>& eqs) {
    vector<int> parent(26); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (auto& e : eqs) if (e[1] == '=') parent[find(e[0]-'a')] = find(e[3]-'a');
    for (auto& e : eqs) if (e[1] == '!') if (find(e[0]-'a') == find(e[3]-'a')) return false;
    return true;
}`,
  problems: [
    { id: 990, title: 'Satisfiability of Equality Equations', slug: 'satisfiability-of-equality-equations', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Two-pass: union == then check != for conflicts.' },
    { id: 1579, title: 'Remove Max Number of Edges to Keep Graph Fully Traversable', slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', companies: ['GOOGLE'], lineChanges: 'Multi-DSU: process type-3 shared edges first, then type-1/type-2.' },
  ],
  pitfalls: ['❌ Processing != before == — transitive equality hasn\'t been established yet.', '❌ Using unweighted DSU when problem requires weighted (ratio-based) constraints.'],
  edgeCases: [
    { input: 'no == equations, only !=', breaks: 'no unions needed, just check distinctness' },
    { input: 'contradiction: a==b and a!=b', breaks: 'conflict detected in second pass' },
  ],
  interviewTip: 'Two-pass DSU: first pass unions all equalities. Second pass checks all inequalities against the DSU state.',
})

export const nodeClassifyLeaf: TaxonomyNode = leaf('node-classify-uf', 'Node Classification', hue, {
  template: `${CPP}int numSimilarGroups(vector<string>& strs) {
    int n = strs.size();
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            if (similar(strs[i], strs[j])) parent[find(i)] = find(j);
    int groups = 0;
    for (int i = 0; i < n; i++) if (find(i) == i) groups++;
    return groups;
}`,
  problems: [
    { id: 839, title: 'Similar String Groups', slug: 'similar-string-groups', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'O(n²) pair comparison; union if ≤2 characters differ.' },
  ],
  pitfalls: ['❌ O(n² * L) TLE for large n — may need optimization like canonical form.', '❌ Not calling find(i) in group count loop — stale parent gives wrong count.'],
  edgeCases: [
    { input: 'all identical strings', breaks: 'one group' },
    { input: 'no two strings similar', breaks: 'n groups' },
  ],
  interviewTip: 'Node classification via DSU: compare all pairs O(n²), union similar. Count roots for group count.',
})

// ── Dynamic Graph Problems ─────────────────────────────────────

export const onlineQueriesLeaf: TaxonomyNode = leaf('online-queries-uf', 'Online Queries', hue, {
  template: `${CPP}struct Query { int u, v, threshold, idx; };
vector<bool> answerQueries(int n, vector<vector<int>>& edges, vector<Query>& qs) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });
    sort(qs.begin(), qs.end(), [](auto& a, auto& b) { return a.threshold < b.threshold; });
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    vector<bool> ans(qs.size());
    int e = 0;
    for (auto& q : qs) {
        while (e < edges.size() && edges[e][2] < q.threshold) {
            parent[find(edges[e][0])] = find(edges[e][1]); e++;
        }
        ans[q.idx] = find(q.u) == find(q.v);
    }
    return ans;
}`,
  problems: [
    { id: 1697, title: 'Checking Existence of Edge Length Limited Paths', slug: 'checking-existence-of-edge-length-limited-paths', companies: ['GOOGLE'], lineChanges: 'Sort edges and queries by threshold; incremental DSU.' },
    { id: 305, title: 'Number of Islands II', slug: 'number-of-islands-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Sequential position addition; track island count per step.' },
  ],
  pitfalls: ['❌ Using <= vs < for threshold comparison — depends on problem statement (strict vs inclusive).', '❌ Not resetting DSU for each test case — stale parent array from previous run.'],
  edgeCases: [
    { input: 'query threshold lower than min edge weight', breaks: 'no edges processed, each node isolated' },
    { input: 'multiple queries with same threshold', breaks: 'processed consecutively with same edge state' },
  ],
  interviewTip: 'Offline DSU: align queries and edges by threshold. Sort both, advance pointer through edges as threshold rises.',
})

export const edgeAddRemLeaf: TaxonomyNode = leaf('edge-add-rem-uf', 'Edge Addition / Removal', hue, {
  template: `${CPP}// Process operations in reverse:
// Edge removal becomes edge addition (union)
for (int i = ops.size()-1; i >= 0; i--) {
    if (ops[i] == REMOVE)
        unionSet(removed.u, removed.v);
    else if (ops[i] == QUERY)
        ans[i] = (find(q.u) == find(q.v));
}`,
  problems: [
    { id: 1579, title: 'Remove Max Number of Edges to Keep Graph Fully Traversable', slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', companies: ['GOOGLE'], lineChanges: 'Multi-DSU with edge-type ordering. Type-3 shared edges processed first.' },
    { id: 924, title: 'Minimize Malware Spread', slug: 'minimize-malware-spread', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Build DSU; count infections per component; remove single-infected largest.' },
  ],
  pitfalls: ['❌ Trying to process edge removal forward — DSU does not support deletion.', '❌ Forgetting to isolate final state before reverse processing.'],
  edgeCases: [
    { input: 'removing non-existent edge', breaks: 'no-op in reverse processing' },
    { input: 'all edges removed eventually', breaks: 'DSU returns to all-singletons state' },
  ],
  interviewTip: 'Reverse processing: start from final state. Go backwards; edge removals become unions. DSU handles additions natively.',
})

export const timeConnectivityLeaf: TaxonomyNode = leaf('time-connectivity-uf', 'Time-Based Connectivity', hue, {
  template: `${CPP}vector<tuple<int,int,int>> timeline;
for each edge (u,v,start,end):
    timeline.push_back({start, ADD, idx});
    timeline.push_back({end, REMOVE, idx});
for each query (u,v,time,idx):
    timeline.push_back({time, QUERY, idx});
sort(timeline.begin(), timeline.end());
// Process: ADD → union; QUERY → check; REMOVE needs persistent DSU`,
  problems: [
    { id: 1724, title: 'Checking Existence of Edge Length Limited Paths II', slug: 'checking-existence-of-edge-length-limited-paths-ii', companies: ['GOOGLE'], lineChanges: 'Online variant of 1697; edges have time windows; needs persistent DSU for queries.' },
  ],
  pitfalls: ['❌ Using standard DSU for problems requiring edge removal — need persistent/reversible DSU.', '❌ Not handling concurrent events at the same timestamp correctly.'],
  edgeCases: [
    { input: 'edge added and removed at same time', breaks: 'net effect is no change' },
    { input: 'query at time with no active edges', breaks: 'all nodes isolated' },
  ],
  interviewTip: 'Time-based DSU: build timeline of add/remove/query events. Sort by time. Process sequentially. Removal requires persistent DSU.',
})

// ── Grid-Based Problems ─────────────────────────────────────────

export const islandLeaf: TaxonomyNode = leaf('island-uf', 'Island Problems', hue, {
  template: `${CPP}int numIslands(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<int> parent(R*C); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); };
    int islands = 0;
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == '0') continue;
        islands++;
        int idx = r * C + c;
        if (r>0 && grid[r-1][c]=='1' && find(idx)!=find(idx-C)) { islands--; parent[find(idx)]=find(idx-C); }
        if (c>0 && grid[r][c-1]=='1' && find(idx)!=find(idx-1)) { islands--; parent[find(idx)]=find(idx-1); }
    }
    return islands;
}`,
  problems: [
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'DSU on flattened grid; union right/down land neighbors; decrement on union.' },
    { id: 305, title: 'Number of Islands II', slug: 'number-of-islands-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Dynamic DSU: add land positions incrementally; union existing neighbors.' },
  ],
  pitfalls: ['❌ Checking all 4 neighbors (causes double-union) vs only top and left.', '❌ Not initializing parent with -1 sentinel for dynamic island addition (305).'],
  edgeCases: [
    { input: 'grid with no land', breaks: '0 islands' },
    { input: 'single cell grid with land', breaks: '1 island' },
  ],
  interviewTip: 'Island DSU: flatten idx = r*C + c. Start with land count. Decrement on each successful adjacent union.',
})

export const gridConnectivityLeaf: TaxonomyNode = leaf('grid-connectivity-uf', 'Grid Connectivity', hue, {
  template: `${CPP}int idx(int r, int c, int cols) { return r * cols + c; }
void build(vector<vector<int>>& grid) {
    int R=grid.size(), C=grid[0].size();
    DSU dsu(R*C);
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        if (r+1<R && grid[r][c]==grid[r+1][c]) dsu.unionSet(idx(r,c,C), idx(r+1,c,C));
        if (c+1<C && grid[r][c]==grid[r][c+1]) dsu.unionSet(idx(r,c,C), idx(r,c+1,C));
    }
}`,
  problems: [
    { id: 1559, title: 'Detect Cycles in 2D Grid', slug: 'detect-cycles-in-2d-grid', companies: ['GOOGLE'], lineChanges: 'Union adjacent same-value cells; detect cycle when cells already in same component.' },
    { id: 1254, title: 'Number of Closed Islands', slug: 'number-of-closed-islands', companies: ['GOOGLE'], lineChanges: 'Union land (0) cells; islands touching grid edge are not closed.' },
  ],
  pitfalls: ['❌ Not checking same-value condition before union — different values wrongly merged.', '❌ Wrong flattening formula when rows and columns are confused.'],
  edgeCases: [
    { input: 'grid with alternating values (chessboard)', breaks: 'no two adjacent cells have same value' },
    { input: 'single row/column grid', breaks: 'only one direction to check' },
  ],
  interviewTip: 'Grid DSU: union adjacent cells with same value. Flatten to 1D for DSU indexing.',
})

export const percolationLeaf: TaxonomyNode = leaf('percolation-uf', 'Percolation', hue, {
  template: `${CPP}bool hasValidPath(vector<vector<int>>& grid) {
    int R=grid.size(), C=grid[0].size();
    DSU dsu(R*C);
    for (int r=0; r<R; r++) for (int c=0; c<C; c++) {
        int id = r*C+c, cur = grid[r][c];
        if (c+1<C && right[cur] && left[grid[r][c+1]]) dsu.unionSet(id, id+1);
        if (r+1<R && down[cur] && up[grid[r+1][c]]) dsu.unionSet(id, id+C);
    }
    return dsu.find(0) == dsu.find(R*C-1);
}`,
  problems: [
    { id: 1391, title: 'Check if There is a Valid Path in a Grid', slug: 'check-if-there-is-a-valid-path-in-a-grid', companies: ['GOOGLE'], lineChanges: 'DSU on street cells; union if street shapes connect (bidirectional check).' },
  ],
  pitfalls: ['❌ Checking only one-directional connectivity (must check both directions).', '❌ Not having correct direction arrays for all 6 street shapes.'],
  edgeCases: [
    { input: 'start or end cell isolated', breaks: 'no path possible' },
    { input: 'single cell grid', breaks: 'trivially connected' },
  ],
  interviewTip: 'Percolation DSU: union only if both cells have facing openings. Check start-to-end connectivity after all unions.',
})

// ── Partition Problems ──────────────────────────────────────────

export const setPartitioningLeaf: TaxonomyNode = leaf('set-partitioning-uf', 'Set Partitioning', hue, {
  template: `${CPP}unordered_map<int, vector<int>> groups;
for (int i = 0; i < n; i++)
    groups[find(i)].push_back(i);
for (auto& [root, members] : groups) {
    sort(members.begin(), members.end());
    // process each group independently
}`,
  problems: [
    { id: 1202, title: 'Smallest String With Swaps', slug: 'smallest-string-with-swaps', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Union swappable indices; sort characters per group; assign back in order.' },
    { id: 399, title: 'Evaluate Division', slug: 'evaluate-division', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Weighted DSU: store ratio between variables; query = weight[a]/weight[b].' },
  ],
  pitfalls: ['❌ Using parent[i] instead of find(i) when collecting groups — stale parent reference.', '❌ Not sorting group members before processing — output order matters.'],
  edgeCases: [
    { input: 'no unions performed', breaks: 'each element is its own group' },
    { input: 'all elements in one group', breaks: 'single large partition' },
  ],
  interviewTip: 'Set partitioning: union then collect by root via find(i). Process each group independently.',
})

export const graphColoringLeaf: TaxonomyNode = leaf('graph-coloring-uf', 'Graph Coloring (Bipartite)', hue, {
  template: `${CPP}bool isBipartite(vector<vector<int>>& graph) {
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
  problems: [
    { id: 785, title: 'Is Graph Bipartite?', slug: 'is-graph-bipartite', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'DSU with 2n nodes: union(u, v+n) and (u+n, v). Conflict if u and v in same set.' },
  ],
  pitfalls: ['❌ Union only one direction (u, v+n) without the reverse (u+n, v).', '❌ Using BFS coloring when DSU approach is expected in problems hinting at DSU.'],
  edgeCases: [
    { input: 'empty graph (no edges)', breaks: 'trivially bipartite' },
    { input: 'odd-length cycle', breaks: 'find(u) == find(v) during processing' },
  ],
  interviewTip: 'Bipartite via DSU: create 2n nodes. For each edge, union opposite colors. Conflict when same color nodes are linked.',
})

export const networkPartitionLeaf: TaxonomyNode = leaf('network-partition-uf', 'Network Partition', hue, {
  template: `${CPP}vector<int> parent, sz;
vector<int> infected(n);
for (int x : initial) infected[find(x)]++;
int best = -1, ans = n;
for (int x : initial) {
    int r = find(x);
    int saved = (infected[r] == 1) ? sz[r] : 0;
    if (saved > best || (saved == best && x < ans)) { best = saved; ans = x; }
}`,
  problems: [
    { id: 924, title: 'Minimize Malware Spread', slug: 'minimize-malware-spread', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'DSU + infection count per component; remove from single-infected largest component.' },
  ],
  pitfalls: ['❌ Removing from multi-infected component — removal doesn\'t stop spread if other infected nodes remain.', '❌ Not re-finding root after all unions before counting infections.'],
  edgeCases: [
    { input: 'all nodes initially infected', breaks: 'no single infection source; pick smallest index' },
    { input: 'no connections between infected nodes', breaks: 'each component has exactly 1 infection' },
  ],
  interviewTip: 'Malware: component size + infection count. Remove node from single-infected component with largest size.',
})

// ── Mathematical Applications ──────────────────────────────────

export const numberTheoryLeaf: TaxonomyNode = leaf('number-theory-uf', 'Number Theory Applications', hue, {
  template: `${CPP}int largestComponentSize(vector<int>& nums) {
    int maxVal = *max_element(nums.begin(), nums.end());
    DSU dsu(maxVal + 1);
    for (int x : nums)
        for (int f = 2; f * f <= x; f++)
            if (x % f == 0) { dsu.unionSet(x, f); dsu.unionSet(x, x / f); }
    unordered_map<int,int> cnt;
    int ans = 0;
    for (int x : nums) ans = max(ans, ++cnt[dsu.find(x)]);
    return ans;
}`,
  problems: [
    { id: 952, title: 'Largest Component Size by Common Factor', slug: 'largest-component-size-by-common-factor', companies: ['GOOGLE'], lineChanges: 'For each number, union with its prime factors; track max component size.' },
    { id: 1627, title: 'Graph Connectivity With Threshold', slug: 'graph-connectivity-with-threshold', companies: ['GOOGLE'], lineChanges: 'Sieve: for divisor > threshold, union all multiples; answer connectivity queries.' },
  ],
  pitfalls: ['❌ Not handling number 1 (no factors, stays in own set).', '❌ Forgetting to union both (x, f) and (x, x/f) — factor may pair with complementary factor.'],
  edgeCases: [
    { input: 'array with only prime numbers', breaks: 'no shared factors, each in own set' },
    { input: 'array with number 1', breaks: '1 has no factors, stays in own set' },
  ],
  interviewTip: 'Number theory DSU: factor each number (O(sqrt(x))) and union with factors. Sieve approach connects shared-factor chains.',
})

export const matrixOpsLeaf: TaxonomyNode = leaf('matrix-ops-uf', 'Matrix Operations', hue, {
  template: `${CPP}map<int, vector<pair<int,int>>> vals;
for (int r=0; r<R; r++) for (int c=0; c<C; c++) vals[mat[r][c]].push_back({r,c});
vector<int> rowMax(R), colMax(C);
for (auto& [val, cells] : vals) {
    DSU dsu(R+C);
    for (auto& [r,c] : cells) dsu.unionSet(r, c+R);
    unordered_map<int,int> rank;
    for (auto& [r,c] : cells) { int p = dsu.find(r); rank[p] = max(rank[p], max(rowMax[r], colMax[c]) + 1); }
    for (auto& [r,c] : cells) { int rnk = rank[dsu.find(r)]; ans[r][c] = rnk; rowMax[r]=max(rowMax[r], rnk); colMax[c]=max(colMax[c], rnk); }
}`,
  problems: [
    { id: 1632, title: 'Rank Transform of a Matrix', slug: 'rank-transform-of-a-matrix', companies: ['GOOGLE'], lineChanges: 'Group same-value cells in same row/col via DSU; assign rank = max(rowMax, colMax) + 1.' },
  ],
  pitfalls: ['❌ Not grouping same-value cells that share rows/columns via DSU.', '❌ Assigning ranks individually without considering row/column max constraints.'],
  edgeCases: [
    { input: 'all cells same value', breaks: 'single DSU group for all cells' },
    { input: 'single row matrix', breaks: 'no column groups to merge' },
  ],
  interviewTip: 'Matrix rank DSU: same-value cells in same row/col share a rank group. DSU with R+C nodes (rows + columns).',
})

export const equationSystemLeaf: TaxonomyNode = leaf('equation-system-uf', 'Equation System Solving', hue, {
  template: `${CPP}vector<int> parent;
vector<double> weight;
int find(int x) {
    if (parent[x] != x) {
        int p = find(parent[x]);
        weight[x] *= weight[parent[x]];
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
  problems: [
    { id: 990, title: 'Satisfiability of Equality Equations', slug: 'satisfiability-of-equality-equations', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Unweighted DSU: process == first, check != second. No ratios.' },
    { id: 399, title: 'Evaluate Division', slug: 'evaluate-division', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Weighted DSU: weight[x] = ratio to root. Query returns weight[a]/weight[b].' },
  ],
  pitfalls: ['❌ Incorrect weight update formula on union — must account for both paths to root.', '❌ Floating point drift from multiplicative chain during path compression.'],
  edgeCases: [
    { input: 'unknown variable in query', breaks: 'find fails (not in DSU), return -1.0' },
    { input: 'division by zero', breaks: 'handle in ratio formula' },
  ],
  interviewTip: 'Weighted DSU for ratios: weight[x] = value(x)/value(root). Update during find (multiply) and union (root-level formula).',
})

// ── Weighted Union Find ─────────────────────────────────────────

export const edgeWeightLeaf: TaxonomyNode = leaf('edge-weight-uf', 'Edge Weight Tracking', hue, {
  template: `${CPP}vector<int> parent;
vector<long long> dist;
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
  problems: [
    { id: 1697, title: 'Checking Existence of Edge Length Limited Paths', slug: 'checking-existence-of-edge-length-limited-paths', companies: ['GOOGLE'], lineChanges: 'Edge weight as threshold (not stored in DSU); sort edges/queries by weight.' },
    { id: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Manhattan distance as edge weight in Kruskal MST.' },
  ],
  pitfalls: ['❌ Sign error in root-level delta formula — dist[ra] = dist[b] + w - dist[a] is correct.', '❌ Overflow with additive weights — use long long for sums.'],
  edgeCases: [
    { input: 'negative weights', breaks: 'handled same as positive' },
    { input: 'self-query (distance to self)', breaks: 'returns 0' },
  ],
  interviewTip: 'Weighted DSU: dist[x] = value relative to root. Root-level formula: dist[ra] = dist[b] + w - dist[a].',
})

export const unionByWeightLeaf: TaxonomyNode = leaf('union-weight-uf', 'Union by Weight', hue, {
  template: `${CPP}int minEffortPath(vector<vector<int>>& heights) {
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
        if (dsu.find(0) == dsu.find(R*C-1)) return w;
    }
    return 0;
}`,
  problems: [
    { id: 1631, title: 'Path With Minimum Effort', slug: 'path-with-minimum-effort', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Sort edges by diff; union incrementally; return diff when start→end connect.' },
  ],
  pitfalls: ['❌ Returning accumulated cost instead of current edge weight — "minimum of maximum" needs max per path, not sum.', '❌ Processing all edges after connectivity established — early exit saves time.'],
  edgeCases: [
    { input: 'single cell (start == end)', breaks: 'effort = 0' },
    { input: 'no path (guaranteed in problem)', breaks: 'but handle gracefully' },
  ],
  interviewTip: '"Minimize maximum" problems: sort edges by weight. Union incrementally. Return current edge weight when endpoints connect.',
})

export const pathWeightsLeaf: TaxonomyNode = leaf('path-weights-uf', 'Path Weights', hue, {
  template: `${CPP}vector<int> parent;
vector<double> mult; // mult[x] = val(x)/val(parent(x))
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
  problems: [
    { id: 399, title: 'Evaluate Division', slug: 'evaluate-division', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Multiplicative weight DSU: store ratio a/b on union; query returns weight[a]/weight[b].' },
  ],
  pitfalls: ['❌ Floating point error accumulation from multiplicative find chain.', '❌ Incorrect union formula — must be mult[ra] = mult[b] * val / mult[a].'],
  edgeCases: [
    { input: 'zero division value', breaks: 'handle NaN or INF' },
    { input: 'transitive ratio query', breaks: 'a→b→c via path compression handles correctly' },
  ],
  interviewTip: 'Path weights DSU: mult[x] = cumulative ratio to root. Path compression: mult[x] *= mult[parent[x]]. Query: mult[a]/mult[b].',
})

// ── Incremental Union Find ──────────────────────────────────────

export const onlineAlgorithmLeaf: TaxonomyNode = leaf('online-algorithm-uf', 'Online Algorithm', hue, {
  template: `${CPP}vector<int> parent;
int components = 0;
void addLand(int idx) {
    if (parent[idx] != -1) return;
    parent[idx] = idx; components++;
    for each neighbor nbr:
        if (parent[nbr] != -1) {
            if (find(idx) != find(nbr)) { parent[find(idx)] = find(nbr); components--; }
        }
}`,
  problems: [
    { id: 305, title: 'Number of Islands II', slug: 'number-of-islands-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Init parent = -1. On add: set self, count++, union neighbors, count--.' },
  ],
  pitfalls: ['❌ Not guarding against duplicate position additions.', '❌ Forgetting to check neighbor existence (parent[nbr] != -1) before union attempt.'],
  edgeCases: [
    { input: 'same position added multiple times', breaks: 'second addition ignored' },
    { input: 'adjacent positions added in sequence', breaks: 'merged into one component' },
  ],
  interviewTip: 'Online DSU: sentinel -1 = absent. Each addition: self-parent, increment, union with existing neighbors, decrement on merge.',
})

export const persistentUfLeaf: TaxonomyNode = leaf('persistent-uf', 'Persistent Union Find', hue, {
  template: `${CPP}struct PersistentDSU {
    vector<int> parent, rank;
    vector<tuple<int,int,int,int>> hist;
    int find(int x) { while (parent[x]!=x) x=parent[x]; return x; }
    void unionSet(int a, int b) {
        int ra=find(a), rb=find(b);
        if (ra==rb) { hist.push_back({-1,-1,-1,-1}); return; }
        if (rank[ra] < rank[rb]) swap(ra, rb);
        hist.push_back({rb, parent[rb], ra, rank[ra]});
        parent[rb] = ra;
        if (rank[ra]==rank[rb]) rank[ra]++;
    }
    void rollback() { auto [x,p,y,r]=hist.back(); hist.pop_back(); if (x!=-1) { parent[x]=p; rank[y]=r; } }
};`,
  problems: [
    { id: 0, title: 'Concept', slug: 'persistent-dsu', companies: ['GOOGLE'], lineChanges: 'No path compression; store union changes in stack for O(1) rollback.' },
  ],
  pitfalls: ['❌ Using path compression — modifies too many parent pointers for efficient history tracking.', '❌ Not handling null operations (union of same set) in history stack correctly.'],
  edgeCases: [
    { input: 'rollback on empty history', breaks: 'undefined behavior' },
    { input: 'multiple rollbacks in sequence', breaks: 'returns to successive prior states' },
  ],
  interviewTip: 'Persistent DSU: iterative find (no compression). Push modifications to stack on union. Pop to rollback. O(1) per undo.',
})

export const reversibleUfLeaf: TaxonomyNode = leaf('reversible-uf', 'Reversible Union Find', hue, {
  template: `${CPP}struct ReversibleDSU {
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
    void rollbackTo(int snap) { while ((int)ops.size() > snap) undo(); }
    void undo() { auto [x,p,y,s]=ops.back(); ops.pop_back(); if (x!=-1) { parent[x]=p; sz[y]=s; } }
};`,
  problems: [
    { id: 0, title: 'Concept', slug: 'reversible-dsu', companies: ['GOOGLE'], lineChanges: 'Full undo support via snapshot-based rollback. No path compression.' },
  ],
  pitfalls: ['❌ Rollback target beyond current operation count — validate snapshot.', '❌ Union by rank instead of size — rank is harder to restore correctly on undo.'],
  edgeCases: [
    { input: 'undo past initial state', breaks: 'check ops.size() > snap before loop' },
    { input: 'operations after snapshot', breaks: 'new ops appended after snapshot point' },
  ],
  interviewTip: 'Reversible DSU: save snapshot (op count), batch operations, rollback to snapshot. No path compression for rollability.',
})

// ── Union Find with Custom Logic ────────────────────────────────

export const multiUfStructLeaf: TaxonomyNode = leaf('multi-uf-struct-uf', 'Multiple Union Find Structures', hue, {
  template: `${CPP}struct DSU {
    vector<int> p; int comps;
    DSU(int n): comps(n), p(n) { iota(p.begin(),p.end(),0); }
    int find(int x) { return p[x]==x ? x : p[x]=find(p[x]); }
    bool unions(int a, int b) {
        int ra=find(a), rb=find(b);
        if (ra==rb) return false;
        p[ra]=rb; comps--; return true;
    }
};
int maxNumEdgesToRemove(int n, vector<vector<int>>& edges) {
    DSU alice(n), bob(n);
    int needed = 0;
    for (auto& e : edges) if (e[0]==3) needed += alice.unions(e[1]-1,e[2]-1) | bob.unions(e[1]-1,e[2]-1);
    for (auto& e : edges) if (e[0]==1) needed += alice.unions(e[1]-1,e[2]-1);
    for (auto& e : edges) if (e[0]==2) needed += bob.unions(e[1]-1,e[2]-1);
    return (alice.comps==1 && bob.comps==1) ? edges.size()-needed : -1;
}`,
  problems: [
    { id: 1579, title: 'Remove Max Number of Edges to Keep Graph Fully Traversable', slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', companies: ['GOOGLE'], lineChanges: 'Two DSU instances (Alice + Bob); process type-3 shared edges first.' },
  ],
  pitfalls: ['❌ Processing edge types in wrong order — shared edges (type-3) must come first.', '❌ Not using bitwise OR (|) to track if either DSU was modified by shared edge.'],
  edgeCases: [
    { input: 'edges only for one player', breaks: 'other player never gets connected' },
    { input: 'no type-3 edges', breaks: 'Alice and Bob DSUs are independent' },
  ],
  interviewTip: 'Multi-DSU: one instance per constraint set. Process shared resources (edges usable by all) first.',
})

export const lazyUfLeaf: TaxonomyNode = leaf('lazy-uf', 'Lazy Union Find', hue, {
  template: `${CPP}unordered_map<string, int> id;
vector<int> parent;
int get(const string& s) {
    if (!id.count(s)) { id[s] = parent.size(); parent.push_back(parent.size()); }
    return id[s];
}
int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
void lazyUnion(const string& a, const string& b) {
    int ra = find(get(a)), rb = find(get(b));
    if (ra != rb) parent[ra] = rb;
}`,
  problems: [
    { id: 721, title: 'Accounts Merge', slug: 'accounts-merge', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lazy DSU: discover emails on first encounter; union within same account.' },
  ],
  pitfalls: ['❌ Not synchronizing parent vector growth with id map.', '❌ Forgetting to call find() on each email when collecting groups after all unions.'],
  edgeCases: [
    { input: 'email appearing in multiple accounts', breaks: 'triggers account merge via shared email' },
    { input: 'empty email list per account', breaks: 'skip processing' },
  ],
  interviewTip: 'Lazy DSU: discover elements on first encounter. Map to index and grow vector simultaneously. No upfront allocation.',
})

export const levelBasedUfLeaf: TaxonomyNode = leaf('level-based-uf', 'Level-Based Union Find', hue, {
  template: `${CPP}int minEffortPath(vector<vector<int>>& heights) {
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
        if (dsu.find(0) == dsu.find(R*C-1)) return diff;
    }
    return 0;
}`,
  problems: [
    { id: 1631, title: 'Path With Minimum Effort', slug: 'path-with-minimum-effort', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Level-based: sort edges by height diff; union incrementally; return diff when connected.' },
  ],
  pitfalls: ['❌ Continuing loop after connectivity established — should early exit.', '❌ Mistaking "minimum of maximum" for "minimum sum" — return edge weight, not accumulated cost.'],
  edgeCases: [
    { input: 'start == end', breaks: 'effort = 0, no edges processed' },
    { input: 'constant height grid', breaks: 'all diffs = 0, first edge connects start→end, return 0' },
  ],
  interviewTip: 'Level-based DSU: sort edges by threshold. Incrementally union. Return current diff when start-end connectivity established.',
})
