import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Cache Design ─────────────────────────────────────────────────

  'lru-cache': e({
    xray: [
      { text: '**doubly-linked list** + **hash map** for O(1) get/put', kind: 'signal' },
      { text: '**move to head** on access; **evict tail** on overflow', kind: 'goal' },
    ],
    budget: ['cacheDesign', 'oopDesign'],
    slottedTemplate: `class LRUCache {
    struct Node { int k, v; Node *prev, *next; Node(int key, int val): k(key), v(val) {} };
    int cap;
    unordered_map<int, Node*> m;
    Node *head, *tail;
    void moveToHead(Node* n) {
        n->prev->next = n->next;
        n->next->prev = n->prev;
        n->next = head->next;
        n->next->prev = n;
        head->next = n;
        n->prev = head;
    }
public:
    LRUCache(int c): cap(c) {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;
        tail->prev = head;
    }
    int get(int k) {
        if (!m.count(k)) return -1;
        moveToHead(m[k]);
        return m[k]->v;
    }
    void put(int k, int v) {
        if (m.count(k)) { m[k]->v = v; moveToHead(m[k]); return; }
        auto* n = new Node(k, v);
        m[k] = n;
        n->next = head->next;
        n->next->prev = n;
        head->next = n;
        n->prev = head;
        if (m.size() > cap) {
            auto* d = tail->prev;
            tail->prev = d->prev;
            d->prev->next = tail;
            m.erase(d->k);
            /* SLOT: deleteNode */
        }
    }
}`,
    slots: [
      { id: 'DELETE_NODE', label: 'Clean up evicted node', hint: 'delete d' },
    ],
    slotFills: {
      146: { DELETE_NODE: 'delete d' },
      460: { DELETE_NODE: 'delete d // LFU uses freq-based eviction instead' },
    },
    helixOrder: [146, 460],
    helixDelta: {
      146: 'LRU Cache: DLL + hash map. get() moves node to head. put() evicts tail on capacity exceeded.',
      460: 'LFU Cache: freq map + per-freq DLL. Evict from minFreq list. Same deletion pattern at tail.',
    },
    autopsies: [
      {
        cause: 'Forgetting to wire new node before updating head->next pointers',
        wrong: 'head->next = n; n->next = head->next; // n points to itself',
        testCase: 'DLL chain breaks — traversal enters infinite loop',
        fix: 'Set n->next = head->next first, then head->next = n.',
      },
      {
        cause: 'Not deleting evicted node causing memory leak',
        wrong: 'm.erase(d->k); // no delete d',
        testCase: 'Memory grows unbounded with repeated put operations',
        fix: 'delete d after removing from map.',
      },
    ],
    sayIt: [
      'LRU Cache: DLL (head sentinel ←→ ... ←→ tail sentinel) + hash map. Move to head on access. Evict tail on overflow.',
    ],
  }),

  'lfu-cache': e({
    xray: [
      { text: '**frequency map** (key→freq) + **per-freq DLL** (freq→keys)', kind: 'signal' },
      { text: 'Track **minFreq** for O(1) eviction target', kind: 'goal' },
    ],
    budget: ['cacheDesign', 'collectionDesign'],
    slottedTemplate: `class LFUCache {
    int cap, minFreq;
    unordered_map<int, int> keyVal, keyFreq;
    unordered_map<int, list<int>> freqKeys;
    unordered_map<int, list<int>::iterator> keyIter;
    void incrementFreq(int k) {
        int f = keyFreq[k];
        freqKeys[f].erase(keyIter[k]);
        if (freqKeys[f].empty() && f == minFreq) minFreq++;
        keyFreq[k] = f + 1;
        freqKeys[f + 1].push_front(k);
        keyIter[k] = freqKeys[f + 1].begin();
    }
public:
    LFUCache(int c): cap(c), minFreq(0) {}
    int get(int k) {
        if (!keyVal.count(k)) return -1;
        incrementFreq(k);
        return keyVal[k];
    }
    void put(int k, int v) {
        if (cap <= 0) return;
        if (keyVal.count(k)) { keyVal[k] = v; incrementFreq(k); return; }
        if (keyVal.size() >= cap) {
            int evict = /* SLOT: evictKey */;
            freqKeys[minFreq].pop_back();
            keyVal.erase(evict);
            keyFreq.erase(evict);
            keyIter.erase(evict);
        }
        keyVal[k] = v;
        keyFreq[k] = 1;
        minFreq = 1;
        freqKeys[1].push_front(k);
        keyIter[k] = freqKeys[1].begin();
    }
}`,
    slots: [
      { id: 'EVICT_KEY', label: 'Key to evict from minFreq list', hint: 'freqKeys[minFreq].back()' },
    ],
    slotFills: {
      460: { EVICT_KEY: 'freqKeys[minFreq].back()' },
    },
    helixOrder: [460],
    helixDelta: {
      460: 'LFU Cache: hash maps for key→val, key→freq, freq→list of keys. Evict from minFreq list.',
    },
    autopsies: [
      {
        cause: 'Not updating minFreq when last key at minFreq is evicted',
        wrong: 'minFreq remains unchanged after evicting from minFreq list that becomes empty',
        testCase: 'After eviction, minFreq points to empty list; next eviction is undefined',
        fix: 'minFreq stays; incrementFreq handles when list empties. New insert sets minFreq=1.',
      },
    ],
    sayIt: [
      'LFU Cache: key→freq map, freq→list map. incrementFreq moves key to next freq list. Evict from minFreq list back.',
    ],
  }),

  'time-based-caching': e({
    xray: [
      { text: '**map of key → sorted vector** of {timestamp, value}', kind: 'signal' },
      { text: '**upper_bound** for O(log n) get by timestamp', kind: 'constraint' },
    ],
    budget: ['cacheDesign', 'searchIndex'],
    slottedTemplate: `class TimeMap {
    unordered_map<string, vector<pair<int, string>>> m;
public:
    void set(string key, string value, int timestamp) {
        m[key].push_back({/* SLOT: tsVal */});
    }
    string get(string key, int timestamp) {
        if (!m.count(key)) return "";
        auto& v = m[key];
        auto it = upper_bound(v.begin(), v.end(), make_pair(timestamp, ""),
            [](const pair<int,string>& a, const pair<int,string>& b) {
                return a.first < b.first;
            });
        if (it == v.begin()) return "";
        return prev(it)->second;
    }
}`,
    slots: [
      { id: 'TS_VAL', label: 'Timestamp-value pair for set', hint: 'timestamp, value' },
    ],
    slotFills: {
      981: { TS_VAL: 'timestamp, value' },
    },
    helixOrder: [981],
    helixDelta: {
      981: 'Time-based KV: vector of {timestamp, value} per key, chronologically ordered. Binary search for get().',
    },
    autopsies: [
      {
        cause: 'Binary search on unsorted vector',
        wrong: 'no sort guarantee — timestamps may not be chronological',
        testCase: 'get returns wrong value because timestamps are out of order',
        fix: 'Problem guarantees chronological set() calls. Vector stays sorted by timestamp.',
      },
    ],
    sayIt: [
      'Time-based cache: map key→vector of {timestamp, value}. upper_bound binary search. O(log n) per get.',
    ],
  }),

  // ── Custom Hash Structures ───────────────────────────────────────

  'hashmap-impl': e({
    xray: [
      { text: '**vector of lists** for chaining collision resolution', kind: 'signal' },
      { text: '**hash(key) % size** to select bucket', kind: 'signal' },
    ],
    budget: ['hashDesign', 'oopDesign'],
    slottedTemplate: `class MyHashMap {
    vector<list<pair<int,int>>> buckets;
    int size;
    int hash(int k) { return k % size; }
public:
    MyHashMap(): size(1000), buckets(size) {}
    void put(int k, int v) {
        auto& b = buckets[hash(k)];
        for (auto& [key, val] : b) {
            if (key == k) { val = v; /* SLOT: earlyReturn */; }
        }
        b.push_back({k, v});
    }
    int get(int k) {
        auto& b = buckets[hash(k)];
        for (auto& [key, val] : b)
            if (key == k) return val;
        return -1;
    }
    void remove(int k) {
        auto& b = buckets[hash(k)];
        b.remove_if([k](const pair<int,int>& p) { return p.first == k; });
    }
}`,
    slots: [
      { id: 'EARLY_RETURN', label: 'Return after updating existing key', hint: 'return' },
    ],
    slotFills: {
      706: { EARLY_RETURN: 'return' },
      1146: { EARLY_RETURN: 'n/a — snapshot array uses map per index, not hash map' },
    },
    helixOrder: [706, 1146],
    helixDelta: {
      706: 'Design HashMap: vector of lists. put: scan bucket, update if exists, else push. get: scan and return.',
      1146: 'Snapshot Array: vector of maps (snapId→value). Binary search per get. No chaining needed.',
    },
    autopsies: [
      {
        cause: 'Not handling existing key update before push',
        wrong: 'b.push_back({k, v}); // unconditionally, creating duplicates',
        testCase: 'put same key twice — bucket has two entries for the same key',
        fix: 'Scan bucket first; update existing value and return, else push new pair.',
      },
    ],
    sayIt: [
      'HashMap chaining: vector of buckets (list of pairs). hash(key) % size selects bucket. Traverse list for get/put/remove.',
    ],
  }),

  'hashset-impl': e({
    xray: [
      { text: 'Same as HashMap but **no values**, only keys', kind: 'signal' },
      { text: '**add** checks for duplicate before insert', kind: 'signal' },
    ],
    budget: ['hashDesign', 'oopDesign'],
    slottedTemplate: `class MyHashSet {
    vector<list<int>> buckets;
    int size;
    int hash(int k) { return k % size; }
public:
    MyHashSet(): size(1000), buckets(size) {}
    void add(int k) {
        auto& b = buckets[hash(k)];
        for (int x : b) if (x == k) /* SLOT: dupReturn */;
        b.push_back(k);
    }
    void remove(int k) {
        auto& b = buckets[hash(k)];
        b.remove(k);
    }
    bool contains(int k) {
        auto& b = buckets[hash(k)];
        for (int x : b) if (x == k) return true;
        return false;
    }
}`,
    slots: [
      { id: 'DUP_RETURN', label: 'Return on duplicate found', hint: 'return' },
    ],
    slotFills: {
      705: { DUP_RETURN: 'return' },
    },
    helixOrder: [705],
    helixDelta: {
      705: 'Design HashSet: vector of list buckets. add: check for dup, push if new. remove: list::remove. contains: scan.',
    },
    autopsies: [
      {
        cause: 'Not checking for duplicates in add',
        wrong: 'b.push_back(k); // unconditionally',
        testCase: 'add same key twice — duplicate entries in bucket',
        fix: 'Scan bucket first; return if found, push only for new keys.',
      },
    ],
    sayIt: [
      'HashSet: same as HashMap without values. Chaining with vector of lists. add/remove/contains O(1) average.',
    ],
  }),

  'specialized-hash': e({
    xray: [
      { text: '**hash map + vector** for O(1) getRandom', kind: 'signal' },
      { text: '**swap with last** + pop_back for O(1) remove', kind: 'signal' },
    ],
    budget: ['hashDesign', 'collectionDesign'],
    slottedTemplate: `class RandomizedSet {
    unordered_map<int, int> m;
    vector<int> v;
public:
    bool insert(int val) {
        if (m.count(val)) return false;
        v.push_back(val);
        m[val] = (int)v.size() - 1;
        return true;
    }
    bool remove(int val) {
        if (!m.count(val)) return false;
        int idx = m[val];
        int last = v.back();
        v[idx] = last;
        m[last] = idx;
        v.pop_back();
        m.erase(val);
        return true;
    }
    int getRandom() {
        return v[/* SLOT: randomIdx */];
    }
}`,
    slots: [
      { id: 'RANDOM_IDX', label: 'Random index expression', hint: 'rand() % v.size()' },
    ],
    slotFills: {
      380: { RANDOM_IDX: 'rand() % v.size()' },
      381: { RANDOM_IDX: 'rand() % v.size()' },
    },
    helixOrder: [380, 381],
    helixDelta: {
      380: 'Insert/Delete/GetRandom O(1): hash map + vector. Remove: swap with last, pop_back, update map.',
      381: 'With duplicates: map val → set of indices. Remove: pick one index, swap with last, update all affected entries.',
    },
    autopsies: [
      {
        cause: 'Not updating m[last] to new index after swap',
        wrong: 'v[idx] = last; v.pop_back(); m.erase(val); // m[last] still has old index',
        testCase: 'getRandom returns stale index for last element',
        fix: 'm[last] = idx; // update moved element before erasing val',
      },
    ],
    sayIt: [
      'O(1) getRandom: hash map (value → index) + vector. Remove: copy last over target, pop_back, update map.',
    ],
  }),

  // ── Advanced Collections ─────────────────────────────────────────

  'multi-level-ds': e({
    xray: [
      { text: '**recursive iterator** with lazy flattening', kind: 'signal' },
      { text: 'Stack of iterators for **nested traversal**', kind: 'goal' },
    ],
    budget: ['collectionDesign', 'behavioralPattern'],
    slottedTemplate: `class NestedIterator {
    vector<NestedInteger> data;
    int idx;
    NestedIterator* cur;
    bool advance() {
        while (idx < (int)data.size() && cur == nullptr) {
            if (data[idx].isInteger()) return true;
            cur = new NestedIterator(data[idx].getList());
            idx++;
        }
        if (cur && !cur->advance()) {
            delete cur; cur = nullptr;
            return /* SLOT: recurseAdvance */;
        }
        return cur != nullptr;
    }
public:
    NestedIterator(vector<NestedInteger>& d): data(d), idx(0), cur(nullptr) {}
    int next() { return cur ? cur->next() : data[idx++].getInteger(); }
    bool hasNext() { return advance(); }
}`,
    slots: [
      { id: 'RECURSE_ADVANCE', label: 'Recursive advance call', hint: 'advance()' },
    ],
    slotFills: {
      341: { RECURSE_ADVANCE: 'advance()' },
      432: { RECURSE_ADVANCE: 'n/a — All O(1) uses map of count→keys, no nested iteration' },
    },
    helixOrder: [341, 432],
    helixDelta: {
      341: 'Flatten Nested Iterator: lazy DFS. Advance past empty lists recursively. O(1) next/hasNext amortized.',
      432: 'All O(1) DS: map key→count, map count→set of keys. min/max via map first/last. No flattening needed.',
    },
    autopsies: [
      {
        cause: 'Not handling empty inner lists in advance()',
        wrong: 'cur = new NestedIterator(data[idx].getList()); idx++; // assuming inner list has elements',
        testCase: '[[], 1] — empty inner list skipped incorrectly',
        fix: 'After creating inner iterator, call advance() on it; if false, delete and try next.',
      },
    ],
    sayIt: [
      'Nested iterator: lazy DFS with stack of iterators. Advance past empty lists recursively. O(1) per operation.',
    ],
  }),

  'stack-queue-variants': e({
    xray: [
      { text: '**stack of {value, currentMin}** pairs for O(1) min', kind: 'signal' },
      { text: '**two stacks (in/out)** for O(1) amortized queue', kind: 'goal' },
    ],
    budget: ['collectionDesign', 'oopDesign'],
    slottedTemplate: `class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int v) {
        int m = st.empty() ? v : min(v, st.top().second);
        st.push({v, /* SLOT: curMin */});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
}`,
    slots: [
      { id: 'CUR_MIN', label: 'Current minimum value', hint: 'm' },
    ],
    slotFills: {
      155: { CUR_MIN: 'm' },
      232: { CUR_MIN: 'n/a — queue via stacks uses in/out, no min tracking' },
      622: { CUR_MIN: 'n/a — circular queue uses array + head/tail, no min tracking' },
    },
    helixOrder: [155, 232, 622],
    helixDelta: {
      155: 'Min Stack: stack of {value, currentMin}. getMin returns top pair\'s second. O(1) all ops.',
      232: 'Queue via Stacks: in stack for push, out stack for pop/peek. Out refills from in when empty.',
      622: 'Circular Queue: fixed array + head/tail. Modulo wrap. O(1) enqueue/dequeue.',
    },
    autopsies: [
      {
        cause: 'Using global min instead of per-element min',
        wrong: 'int m = min(v, globalMin); globalMin = m; st.push(v);',
        testCase: 'After popping the min, global min is stale',
        fix: 'Store {value, currentMin} per element. Each element carries the min of all below it.',
      },
    ],
    sayIt: [
      'MinStack: store (value, currentMin) pairs. Queue via stacks: in/out, amortized O(1). Circular queue: array + modulo.',
    ],
  }),

  'custom-priority': e({
    xray: [
      { text: '**min-heap** of available resource IDs', kind: 'signal' },
      { text: '**map of freq → stack** for max-freq eviction', kind: 'goal' },
    ],
    budget: ['collectionDesign', 'memoryMgmt'],
    slottedTemplate: `class SeatManager {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.push(/* SLOT: seatId */);
    }
    int reserve() {
        int s = pq.top(); pq.pop();
        return s;
    }
    void unreserve(int s) {
        pq.push(s);
    }
}`,
    slots: [
      { id: 'SEAT_ID', label: 'Seat ID to push', hint: 'i' },
    ],
    slotFills: {
      1845: { SEAT_ID: 'i' },
      895: { SEAT_ID: 'n/a — freq stack uses map<int,stack<int>> + maxFreq tracker' },
    },
    helixOrder: [1845, 895],
    helixDelta: {
      1845: 'Seat Manager: min-heap of all seats. reserve = pop min. unreserve = push.',
      895: 'Max Frequency Stack: map freq→stack, track maxFreq. push: increment freq, push to group. pop: pop from maxFreq group.',
    },
    autopsies: [
      {
        cause: 'Pre-filling heap O(n log n) is acceptable but O(n) possible',
        wrong: 'Using O(n) bucket sort only for special cases',
        testCase: 'n=10^5, heap init O(n log n) = ~1.7M ops, acceptable in most contests',
        fix: 'iota-based init with make_heap is O(n), but O(n log n) push loop is also fine for 10^5.',
      },
    ],
    sayIt: [
      'Custom priority: min-heap for smallest-element priority. Freq stack: map<int,stack<int>> for frequency-order eviction.',
    ],
  }),

  // ── Tree-Based Designs ───────────────────────────────────────────

  'trie-impl': e({
    xray: [
      { text: '**array[26] of Node*** children per node', kind: 'signal' },
      { text: '**O(L)** for insert/search/startsWith', kind: 'constraint' },
    ],
    budget: ['treeDesign', 'searchIndex'],
    slottedTemplate: `class Trie {
    struct Node {
        Node* next[26];
        bool end = false;
        Node() { fill(begin(next), end(next), nullptr); }
    };
    Node* root;
public:
    Trie() { root = new Node(); }
    void insert(string w) {
        Node* cur = root;
        for (char c : w) {
            if (!cur->next[c - 'a']) cur->next[c - 'a'] = new Node();
            cur = cur->next[c - 'a'];
        }
        cur->end = /* SLOT: markEnd */;
    }
    bool search(string w) {
        Node* cur = root;
        for (char c : w) {
            if (!cur->next[c - 'a']) return false;
            cur = cur->next[c - 'a'];
        }
        return cur->end;
    }
    bool startsWith(string p) {
        Node* cur = root;
        for (char c : p) {
            if (!cur->next[c - 'a']) return false;
            cur = cur->next[c - 'a'];
        }
        return true;
    }
}`,
    slots: [
      { id: 'MARK_END', label: 'Mark end of word', hint: 'true' },
    ],
    slotFills: {
      208: { MARK_END: 'true' },
      211: { MARK_END: 'true' },
      1166: { MARK_END: 'n/a — file system uses value at node, not boolean end marker' },
    },
    helixOrder: [208, 211, 1166],
    helixDelta: {
      208: 'Trie: array[26] children. Insert creates missing nodes. search checks end flag. startsWith just traverses.',
      211: 'Add & Search Word: wildcard . triggers DFS on all children. Same trie structure with recursive search.',
      1166: 'File System: trie of path segments. createPath inserts, get returns node value. End marker is file check.',
    },
    autopsies: [
      {
        cause: 'Not zero-initializing array[26] in Node constructor',
        wrong: 'Node* next[26]; // uninitialized pointers',
        testCase: 'Checking cur->next[0] reads garbage, may falsely think child exists',
        fix: 'Node() { fill(begin(next), end(next), nullptr); }',
      },
    ],
    sayIt: [
      'Trie: array[26] per node. insert creates path, marks end. search follows path, checks end flag. startsWith checks path existence.',
    ],
  }),

  'bst': e({
    xray: [
      { text: '**stack-based iterative inorder** traversal', kind: 'signal' },
      { text: '**push all left** in constructor; **pushRight** on pop', kind: 'goal' },
    ],
    budget: ['treeDesign', 'behavioralPattern'],
    slottedTemplate: `class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* r) {
        while (r) { st.push(r); r = r->left; }
    }
public:
    BSTIterator(TreeNode* r) { pushLeft(r); }
    int next() {
        TreeNode* n = st.top(); st.pop();
        pushLeft(/* SLOT: nextBranch */);
        return n->val;
    }
    bool hasNext() { return !st.empty(); }
}`,
    slots: [
      { id: 'NEXT_BRANCH', label: 'Next branch to explore', hint: 'n->right' },
    ],
    slotFills: {
      173: { NEXT_BRANCH: 'n->right' },
      1586: { NEXT_BRANCH: 'n->right' },
    },
    helixOrder: [173, 1586],
    helixDelta: {
      173: 'BST Iterator: stack for iterative inorder. pushLeft in constructor. After pop, pushLeft on right child.',
      1586: 'BST Iterator II: extend with prev pointer stack or history vector for O(1) hasPrev.',
    },
    autopsies: [
      {
        cause: 'Forgetting to pushLeft in constructor',
        wrong: 'BSTIterator(TreeNode* r) { /* no pushLeft */ }',
        testCase: 'next() called on empty stack — crash',
        fix: 'Call pushLeft(root) in constructor to initialize stack with left spine.',
      },
    ],
    sayIt: [
      'BST Iterator: stack-based inorder. pushAllLeft(root) initializes stack. next(): pop, pushAllLeft(right), return val.',
    ],
  }),

  'advanced-tree': e({
    xray: [
      { text: '**preorder DFS** with # for null placeholders', kind: 'signal' },
      { text: '**recursive deserialize** consumes token stream', kind: 'goal' },
    ],
    budget: ['treeDesign', 'oopDesign'],
    slottedTemplate: `class Codec {
public:
    string serialize(TreeNode* r) {
        if (!r) return "#";
        return to_string(r->val) + "," + serialize(r->left) + "," + serialize(r->right);
    }
    TreeNode* deserialize(string d) {
        int i = 0;
        return dfs(d, i);
    }
    TreeNode* dfs(string& d, int& i) {
        if (d[i] == '#') { i += 2; return nullptr; }
        int j = i;
        while (d[j] != ',') j++;
        TreeNode* n = new TreeNode(stoi(d.substr(i, j - i)));
        i = j + 1;
        n->left = dfs(d, i);
        n->right = /* SLOT: deserializeRight */;
        return n;
    }
}`,
    slots: [
      { id: 'DESERIALIZE_RIGHT', label: 'Deserialize right child', hint: 'dfs(d, i)' },
    ],
    slotFills: {
      297: { DESERIALIZE_RIGHT: 'dfs(d, i)' },
      355: { DESERIALIZE_RIGHT: 'n/a — Twitter design uses follow/tweet maps, no tree serialization' },
    },
    helixOrder: [297, 355],
    helixDelta: {
      297: 'Serialize BT: preorder DFS. # for nulls. Deserialize: token stream, recursive construction.',
      355: 'Design Twitter: user→followees set, user→tweets list. getNewsFeed merges k latest from user + followees.',
    },
    autopsies: [
      {
        cause: 'Not handling negative numbers in serialization',
        wrong: 'while (d[j] != \',\') j++; // works for negative too since - is not ,',
        testCase: 'stoi("-5") returns -5 correctly',
        fix: 'Standard stoi handles optional leading minus sign. Token extraction by comma is safe.',
      },
    ],
    sayIt: [
      'Serialize BT: preorder DFS with # for nulls. Deserialize: recursive token consumption, rebuilds tree structure.',
    ],
  }),

  // ── Graph-Based Designs ──────────────────────────────────────────

  'basic-graph-impl': e({
    xray: [
      { text: '**adjacency list** (vector of vectors) vs **adj matrix**', kind: 'signal' },
      { text: '**O(V+E)** space for list; **O(V²)** for matrix', kind: 'constraint' },
    ],
    budget: ['graphDesign', 'structuralPattern'],
    slottedTemplate: `class Graph {
    int n;
    vector<vector<int>> adj;
    bool isMatrix;
public:
    Graph(int nodes, bool useMatrix): n(nodes), isMatrix(useMatrix) {
        if (useMatrix) adj.resize(n, vector<int>(n, 0));
        else adj.resize(n);
    }
    void addEdge(int u, int v) {
        if (isMatrix) adj[u][v] = 1;
        else adj[u].push_back(v);
    }
    bool hasEdge(int u, int v) {
        if (isMatrix) return adj[u][v] == 1;
        for (int x : adj[u]) if (x == v) return true;
        return false;
    }
    vector<int> neighbors(int u) {
        return adj[u];
    }
    // For undirected: also add (v,u) in addEdge
    void addUndirectedEdge(int u, int v) {
        addEdge(u, v);
        /* SLOT: addReverse */;
    }
}`,
    slots: [
      { id: 'ADD_REVERSE', label: 'Add reverse edge for undirected', hint: 'addEdge(v, u)' },
    ],
    slotFills: {
      997: { ADD_REVERSE: 'addEdge(v, u)' },
      0: { ADD_REVERSE: 'addEdge(v, u) // for undirected representation' },
    },
    helixOrder: [997, 0],
    helixDelta: {
      997: 'Town Judge: adjacency for trust. Judge trusts no one and is trusted by everyone else (indegree - outdegree = n-1).',
      0: 'Adj List vs Matrix: list uses O(V+E) space, good for sparse. Matrix uses O(V²), good for dense + O(1) edge tests.',
    },
    autopsies: [
      {
        cause: 'Forgetting to add both directions for undirected graphs',
        wrong: 'adj[u].push_back(v); // missing adj[v].push_back(u)',
        testCase: 'hasEdge(v,u) returns false even though edge (u,v) was added',
        fix: 'addEdge(u,v); addEdge(v,u); for undirected graphs.',
      },
    ],
    sayIt: [
      'Graph impl: adj list for sparse (most problems), adj matrix for dense + O(1) edge lookup. Undirected adds both directions.',
    ],
  }),

  'specialized-graph': e({
    xray: [
      { text: '**user → followees set** + **user → tweets** list', kind: 'signal' },
      { text: '**merge k latest** from user + followees', kind: 'goal' },
    ],
    budget: ['graphDesign', 'collectionDesign'],
    slottedTemplate: `class Twitter {
    unordered_map<int, unordered_set<int>> follows;
    unordered_map<int, vector<pair<int,int>>> tweets;
    int time;
public:
    Twitter(): time(0) {}
    void postTweet(int u, int t) {
        tweets[u].push_back({/* SLOT: tweetEntry */});
    }
    vector<int> getNewsFeed(int u) {
        priority_queue<pair<int,int>> pq;
        for (auto& p : tweets[u]) pq.push(p);
        if (follows[u].count(u) == 0) follows[u].insert(u);
        for (int f : follows[u])
            for (auto& p : tweets[f]) pq.push(p);
        vector<int> feed;
        for (int i = 0; i < 10 && !pq.empty(); i++) {
            feed.push_back(pq.top().second); pq.pop();
        }
        return feed;
    }
    void follow(int f, int id) { follows[f].insert(id); }
    void unfollow(int f, int id) { if (f != id) follows[f].erase(id); }
}`,
    slots: [
      { id: 'TWEET_ENTRY', label: 'Tweet entry with timestamp', hint: 'time++, t' },
    ],
    slotFills: {
      355: { TWEET_ENTRY: 'time++, t' },
      1136: { TWEET_ENTRY: 'n/a — parallel courses uses topological sort, not tweets' },
    },
    helixOrder: [355, 1136],
    helixDelta: {
      355: 'Design Twitter: postTweet stores (timestamp, tweetId). getNewsFeed merges 10 latest from user + followees via max-heap.',
      1136: 'Parallel Courses: topological sort with indegree array + adj list. Track semester count. Return -1 if cycle.',
    },
    autopsies: [
      {
        cause: 'Not including user\'s own tweets in feed if they don\'t follow themselves',
        wrong: 'getNewsFeed only follows[u] but user not in their own follow set',
        testCase: 'User posts tweet, gets empty feed',
        fix: 'If user not in follows[u], insert them; or include tweets[u] directly.',
      },
    ],
    sayIt: [
      'Twitter: user → followees set, user → tweet list with timestamp. getNewsFeed: max-heap merging k latest from user + followees.',
    ],
  }),

  // ── Search & Index Structures ────────────────────────────────────

  'search-engine': e({
    xray: [
      { text: '**trie with hot count** for autocomplete', kind: 'signal' },
      { text: '**DFS from prefix node** + sort by hot desc', kind: 'goal' },
    ],
    budget: ['searchIndex', 'treeDesign'],
    slottedTemplate: `struct TrieNode {
    unordered_map<char, TrieNode*> next;
    int hot;
};

class AutocompleteSystem {
    TrieNode* root;
    string cur;
    TrieNode* curNode;
    void insert(string& s, int times) {
        TrieNode* r = root;
        for (char c : s) {
            if (!r->next.count(c)) r->next[c] = new TrieNode();
            r = r->next[c];
        }
        r->hot += times;
    }
    void dfs(TrieNode* r, string& path, vector<pair<int,string>>& res) {
        if (r->hot) res.push_back({-r->hot, path});
        for (auto& [c, nxt] : r->next) {
            path.push_back(c);
            dfs(nxt, path, res);
            path.pop_back();
        }
    }
public:
    AutocompleteSystem(vector<string>& s, vector<int>& t) {
        root = new TrieNode(); curNode = root;
        for (int i = 0; i < (int)s.size(); i++) insert(s[i], t[i]);
    }
    vector<string> input(char c) {
        if (c == '#') { insert(cur, 1); cur.clear(); curNode = root; return {}; }
        cur.push_back(c);
        if (!curNode || !curNode->next.count(c)) { curNode = nullptr; return {}; }
        curNode = curNode->next[c];
        vector<pair<int,string>> res;
        string path = cur;
        dfs(/* SLOT: dfsArgs */);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
}`,
    slots: [
      { id: 'DFS_ARGS', label: 'DFS traversal arguments', hint: 'curNode, path, res' },
    ],
    slotFills: {
      642: { DFS_ARGS: 'curNode, path, res' },
    },
    helixOrder: [642],
    helixDelta: {
      642: 'Autocomplete: trie with hot count. prefix node → DFS for all completions → sort by -hot, lexico → return top 3.',
    },
    autopsies: [
      {
        cause: 'Resetting curNode on # without inserting current query',
        wrong: 'cur.clear(); curNode = root; return {}; // missing insert(cur, 1)',
        testCase: 'Sentence typed but never recorded — hot count never increments',
        fix: 'insert(cur, 1) before clearing on # character.',
      },
    ],
    sayIt: [
      'Autocomplete: trie with hot count per sentence. input(): traverse trie, DFS from prefix node, sort, return top 3.',
    ],
  }),

  'database-index': e({
    xray: [
      { text: '**vector of maps** (index → snapId → value)', kind: 'signal' },
      { text: '**upper_bound** binary search for O(log k) get', kind: 'constraint' },
    ],
    budget: ['searchIndex', 'memoryMgmt'],
    slottedTemplate: `class SnapshotArray {
    vector<map<int,int>> arr;
    int snapId;
public:
    SnapshotArray(int l): snapId(0) {
        arr.resize(l);
        for (int i = 0; i < l; i++) arr[i][0] = 0;
    }
    void set(int i, int v) { arr[i][snapId] = v; }
    int snap() { return snapId++; }
    int get(int i, int s) {
        auto it = arr[i]./* SLOT: searchMethod */(s);
        return prev(it)->second;
    }
}`,
    slots: [
      { id: 'SEARCH_METHOD', label: 'Binary search by snap ID', hint: 'upper_bound' },
    ],
    slotFills: {
      1146: { SEARCH_METHOD: 'upper_bound' },
      1570: { SEARCH_METHOD: 'n/a — sparse vector uses two-pointer dot product, not snapshots' },
    },
    helixOrder: [1146, 1570],
    helixDelta: {
      1146: 'Snapshot Array: vector of maps. set: arr[i][snapId]=v. get: upper_bound(snapId), prev(it) for correct version.',
      1570: 'Sparse Vector: store (index, value) pairs. Two-pointer dot product. O(n+m) for non-zero entries.',
    },
    autopsies: [
      {
        cause: 'Linear scan instead of binary search for get',
        wrong: 'for (auto& [s,v] : arr[i]) if (s <= snapId) ... // O(n) per get',
        testCase: 'Many snapshot versions — get becomes O(k) instead of O(log k)',
        fix: 'Use upper_bound(s) on the map, then prev(it). O(log k) per get.',
      },
    ],
    sayIt: [
      'Snapshot Array: vector<map<int,int>> per index. map stores snapId→value. upper_bound binary search for O(log k) get.',
    ],
  }),

  // ── File System Design ───────────────────────────────────────────

  'directory-structure': e({
    xray: [
      { text: '**trie of path segments** with values', kind: 'signal' },
      { text: '**split path by /** into segments', kind: 'signal' },
    ],
    budget: ['fileSystem', 'treeDesign'],
    slottedTemplate: `class FileSystem {
    struct Node {
        string name;
        int val;
        bool isFile;
        unordered_map<string, Node*> children;
    };
    Node* root;
    vector<string> split(string& path) {
        vector<string> parts;
        int i = 1, j;
        while (i < (int)path.size()) {
            j = path.find('/', i);
            if (j == string::npos) j = path.size();
            parts.push_back(path.substr(i, j - i));
            i = j + 1;
        }
        return parts;
    }
public:
    FileSystem() { root = new Node(); }
    bool createPath(string path, int v) {
        auto parts = split(path);
        Node* cur = root;
        for (int i = 0; i < (int)parts.size(); i++) {
            if (!cur->children.count(parts[i])) {
                if (i == (int)parts.size() - 1)
                    cur->children[parts[i]] = new Node();
                else return false;
            }
            cur = cur->children[parts[i]];
        }
        cur->val = v;
        cur->isFile = false;
        return true;
    }
    int get(string path) {
        auto parts = split(path);
        Node* cur = root;
        for (auto& p : parts) {
            if (!cur->children.count(p)) /* SLOT: notFound */;
            cur = cur->children[p];
        }
        return cur->val;
    }
}`,
    slots: [
      { id: 'NOT_FOUND', label: 'Return value when path not found', hint: 'return -1' },
    ],
    slotFills: {
      1166: { NOT_FOUND: 'return -1' },
      588: { NOT_FOUND: 'return {} // empty vector for ls, or return {} for getContent' },
    },
    helixOrder: [1166, 588],
    helixDelta: {
      1166: 'Design File System: trie of path segments. createPath creates leaf only if intermediate parents exist.',
      588: 'In-Memory File System: extended with file content, mkdir, ls. ls on dir returns sorted children; ls on file returns [filename].',
    },
    autopsies: [
      {
        cause: 'Creating intermediate directories when they don\'t exist',
        wrong: 'for (auto& p : parts) { if (!cur->children.count(p)) cur->children[p] = new Node(); cur = cur->children[p]; }',
        testCase: 'createPath("/a/b", 5) without "/a" — should fail but succeeds',
        fix: 'Only create node at the last segment; return false for missing intermediates.',
      },
    ],
    sayIt: [
      'File system trie: split path by /. Navigate segments. createPath creates only leaf; intermediate must exist. get returns -1 on miss.',
    ],
  }),

  'file-operations': e({
    xray: [
      { text: '**user → chunks** + **chunk → owners** maps', kind: 'signal' },
      { text: '**recycle IDs** with min-heap for smallest available', kind: 'goal' },
    ],
    budget: ['fileSystem', 'memoryMgmt'],
    slottedTemplate: `class FileSharing {
    int nextId;
    set<int> available;
    unordered_map<int, vector<int>> chunks;
    unordered_map<int, set<int>> chunkOwners;
public:
    FileSharing() : nextId(1) {}
    int join(vector<int> owned) {
        int id = available.empty() ? nextId++ : *available.begin();
        if (!available.empty()) available.erase(/* SLOT: eraseId */);
        chunks[id] = owned;
        for (int c : owned) chunkOwners[c].insert(id);
        return id;
    }
    void leave(int id) {
        for (int c : chunks[id]) {
            chunkOwners[c].erase(id);
            if (chunkOwners[c].empty()) chunkOwners.erase(c);
        }
        chunks.erase(id);
        available.insert(id);
    }
    vector<int> request(int id, int c) {
        vector<int> owners(chunkOwners[c].begin(), chunkOwners[c].end());
        for (int o : owners) chunks[o].push_back(c);
        return owners;
    }
}`,
    slots: [
      { id: 'ERASE_ID', label: 'Erase used ID from available set', hint: 'available.begin()' },
    ],
    slotFills: {
      1500: { ERASE_ID: 'available.begin()' },
    },
    helixOrder: [1500],
    helixDelta: {
      1500: 'File Sharing: user→chunks + chunk→owners maps. join: reuse smallest ID or create new. leave: cleanup and recycle ID.',
    },
    autopsies: [
      {
        cause: 'Not removing recycled ID from available set after use',
        wrong: 'int id = *available.begin(); // never erased',
        testCase: 'Same ID assigned twice — chunks[id] overwritten',
        fix: 'available.erase(available.begin()) after extracting id.',
      },
    ],
    sayIt: [
      'File Sharing: bidirectional maps (user→chunks, chunk→owners). Recycle IDs via sorted set. Leave cleans up all mappings.',
    ],
  }),

  // ── Rate Limiters ────────────────────────────────────────────────

  'window-based-limiters': e({
    xray: [
      { text: '**hash map** msg→nextAllowedTime for logger', kind: 'signal' },
      { text: '**queue of timestamps** for hit counter', kind: 'signal' },
    ],
    budget: ['rateLimiter', 'collectionDesign'],
    slottedTemplate: `class Logger {
    unordered_map<string, int> m;
public:
    bool shouldPrintMessage(int t, string msg) {
        if (!m.count(msg) || t >= m[msg]) {
            m[msg] = t + 10;
            return true;
        }
        return false;
    }
};

class HitCounter {
    queue<int> q;
public:
    void hit(int t) {
        q.push(t);
    }
    int getHits(int t) {
        while (!q.empty() && q.front() <= t - 300) /* SLOT: popExpired */;
        return (int)q.size();
    }
}`,
    slots: [
      { id: 'POP_EXPIRED', label: 'Remove expired timestamps', hint: 'q.pop()' },
    ],
    slotFills: {
      359: { POP_EXPIRED: 'q.pop()' },
      362: { POP_EXPIRED: 'q.pop()' },
    },
    helixOrder: [359, 362],
    helixDelta: {
      359: 'Logger Rate Limiter: map msg→nextAllowedTime. Each print sets time+10. O(1) check.',
      362: 'Hit Counter: queue of timestamps. getHits pops timestamps older than 300s. Returns queue size.',
    },
    autopsies: [
      {
        cause: 'Storing all timestamps per message instead of next allowed time',
        wrong: 'unordered_map<string, vector<int>> msgTimes; // O(n) per check',
        testCase: 'Checking same message many times — O(n) instead of O(1)',
        fix: 'Store only next allowed timestamp per message. O(1) memory per message.',
      },
    ],
    sayIt: [
      'Logger: map msg→nextAllowedTime, O(1). HitCounter: queue of timestamps, pop expired on getHits, O(window) memory.',
    ],
  }),

  'token-bucket': e({
    xray: [
      { text: '**refill rate r** tokens/sec, **capacity c** burst', kind: 'signal' },
      { text: '**lazy refill** on allow() call (not timer)', kind: 'goal' },
    ],
    budget: ['rateLimiter', 'memoryMgmt'],
    slottedTemplate: `class TokenBucket {
    double rate;
    int capacity;
    double tokens;
    long lastRefill;
    void refill(long now) {
        double add = rate * (now - lastRefill) / 1000.0;
        tokens = min((double)capacity, tokens + add);
        lastRefill = now;
    }
public:
    TokenBucket(double r, int cap): rate(r), capacity(cap), tokens(cap), lastRefill(0) {}
    bool allow(long now) {
        refill(now);
        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }
    // Variant: allow with cost
    bool allow(long now, int cost) {
        refill(now);
        if (/* SLOT: tokensCond */) {
            tokens -= cost;
            return true;
        }
        return false;
    }
}`,
    slots: [
      { id: 'TOKENS_COND', label: 'Sufficient tokens condition', hint: 'tokens >= cost' },
    ],
    slotFills: {
      0: { TOKENS_COND: 'tokens >= cost' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Refill not called before every allow() check',
        wrong: 'bool allow(long now) { if (tokens >= 1.0) { tokens -= 1.0; return true; } return false; }',
        testCase: 'Long idle period — tokens stale, many requests denied unnecessarily',
        fix: 'Call refill(now) at the start of every allow() to account for elapsed time.',
      },
    ],
    sayIt: [
      'Token Bucket: tokens refill at rate r/s. Lazy refill on allow(). Burst limited to capacity. O(1) per call.',
    ],
  }),

  // ── Memory Management ────────────────────────────────────────────

  'pool-allocators': e({
    xray: [
      { text: '**min-heap** of available resource IDs', kind: 'signal' },
      { text: '**pop** to allocate, **push** to free', kind: 'goal' },
    ],
    budget: ['memoryMgmt', 'collectionDesign'],
    slottedTemplate: `class SeatManager {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.push(i);
    }
    int reserve() {
        int s = pq.top(); pq.pop();
        return /* SLOT: returnSeat */;
    }
    void unreserve(int s) {
        pq.push(s);
    }
}`,
    slots: [
      { id: 'RETURN_SEAT', label: 'Return allocated seat ID', hint: 's' },
    ],
    slotFills: {
      1845: { RETURN_SEAT: 's' },
    },
    helixOrder: [1845],
    helixDelta: {
      1845: 'Seat Manager: min-heap pool. O(n log n) init. reserve O(log n), unreserve O(log n).',
    },
    autopsies: [
      {
        cause: 'Not using min-heap for smallest allocation',
        wrong: 'stack<int> available; // LIFO — not smallest-ID first',
        testCase: 'Reserved IDs are not minimal — problem requires smallest ID',
        fix: 'Use min-heap (priority_queue<int, vector<int>, greater<int>>) for smallest-ID allocation.',
      },
    ],
    sayIt: [
      'Pool allocator: min-heap of free IDs. reserve = pop min. unreserve = push. O(log n) per operation.',
    ],
  }),

  'memory-efficient': e({
    xray: [
      { text: '**store only non-zero** (index, value) pairs', kind: 'signal' },
      { text: '**two-pointer** merge for dot product', kind: 'goal' },
    ],
    budget: ['memoryMgmt', 'searchIndex'],
    slottedTemplate: `class SparseVector {
    vector<pair<int,int>> v;
public:
    SparseVector(vector<int>& a) {
        for (int i = 0; i < (int)a.size(); i++)
            if (a[i]) v.push_back({i, a[i]});
    }
    int dot(SparseVector& o) {
        int i = 0, j = 0, sum = 0;
        while (i < (int)v.size() && j < (int)o.v.size()) {
            if (v[i].first < o.v[j].first) i++;
            else if (v[i].first > o.v[j].first) j++;
            else sum += /* SLOT: dotProduct */;
        }
        return sum;
    }
}`,
    slots: [
      { id: 'DOT_PRODUCT', label: 'Dot product of matching indices', hint: 'v[i++].second * o.v[j++].second' },
    ],
    slotFills: {
      1570: { DOT_PRODUCT: 'v[i++].second * o.v[j++].second' },
      1244: { DOT_PRODUCT: 'n/a — leaderboard uses hash map + heap, not sparse vectors' },
    },
    helixOrder: [1570, 1244],
    helixDelta: {
      1570: 'Sparse Vector: store non-zero (index, value) pairs. Two-pointer for O(n+m) dot product.',
      1244: 'Leaderboard: map id→score. top(K): push all scores to max-heap, sum top K. reset: erase from map.',
    },
    autopsies: [
      {
        cause: 'Storing zero values in sparse vector',
        wrong: 'for (int x : a) v.push_back({i++, x}); // all values including zeros',
        testCase: 'Large sparse vector — O(n) memory instead of O(non-zero)',
        fix: 'Only push when a[i] != 0. Store (index, value) pairs.',
      },
    ],
    sayIt: [
      'Sparse vector: (index, value) pairs for non-zero entries. Two-pointer dot product. O(non-zero) memory and time.',
    ],
  }),

  // ── Calendar Systems ─────────────────────────────────────────────

  'calendar-systems': e({
    xray: [
      { text: '**sorted set** of intervals; **lower_bound** + **prev** check', kind: 'signal' },
      { text: '**sweep line / diff array** for max concurrent', kind: 'goal' },
    ],
    budget: ['reservation', 'collectionDesign'],
    slottedTemplate: `class MyCalendar {
    set<pair<int,int>> books;
public:
    bool book(int s, int e) {
        auto it = books.lower_bound({s, e});
        if (it != books.end() && it->first < e) return false;
        if (it != books.begin() && /* SLOT: overlapPrev */) return false;
        books.insert({s, e});
        return true;
    }
}`,
    slots: [
      { id: 'OVERLAP_PREV', label: 'Check overlap with previous interval', hint: 'prev(it)->second > s' },
    ],
    slotFills: {
      729: { OVERLAP_PREV: 'prev(it)->second > s' },
      731: { OVERLAP_PREV: 'n/a — Calendar II maintains double-booking list for triple-booking check' },
      732: { OVERLAP_PREV: 'n/a — Calendar III uses diff array (map<int,int>), no set of intervals' },
    },
    helixOrder: [729, 731, 732],
    helixDelta: {
      729: 'My Calendar I: sorted set of intervals. Check overlap with lower_bound and prev. O(log n) per book.',
      731: 'My Calendar II: maintain primary + double-booking lists. Reject if interval overlaps double-booking.',
      732: 'My Calendar III: sweep line via map<int,int> diff array. Track max concurrent k bookings.',
    },
    autopsies: [
      {
        cause: 'Using linear scan instead of lower_bound for overlap check',
        wrong: 'for (auto& [s2,e2] : books) if (max(s,s2) < min(e,e2)) return false;',
        testCase: 'Many events — O(n) per book instead of O(log n)',
        fix: 'Use lower_bound to find the first interval starting at or after s. Check it and prev(it).',
      },
    ],
    sayIt: [
      'Calendar I: sorted set of intervals. Lower_bound to find candidate. Check overlap with it and prev(it). O(log n).',
    ],
  }),

  'resource-booking': e({
    xray: [
      { text: '**two vectors**: primary list + double-booking list', kind: 'signal' },
      { text: '**check double list first**; if clear, add overlaps', kind: 'goal' },
    ],
    budget: ['reservation', 'collectionDesign'],
    slottedTemplate: `class MyCalendarTwo {
    vector<pair<int,int>> books;
    vector<pair<int,int>> overlaps;
public:
    bool book(int s, int e) {
        for (auto& o : overlaps)
            if (max(s, o.first) < min(e, o.second)) return false;
        for (auto& b : books)
            if (max(s, b.first) < min(e, b.second))
                overlaps.push_back({max(s, b.first), min(e, b.second)});
        books.push_back({s, e});
        return true;
    }
    // Variant: find first available slot of given duration
    pair<int,int> firstAvailable(int duration) {
        sort(books.begin(), books.end());
        int cur = 0;
        for (auto& [s, e] : books) {
            if (/* SLOT: gapCond */) return {cur, cur + duration};
            cur = max(cur, e);
        }
        return {cur, cur + duration};
    }
}`,
    slots: [
      { id: 'GAP_COND', label: 'Sufficient gap condition', hint: 's - cur >= duration' },
    ],
    slotFills: {
      731: { GAP_COND: 'n/a — Calendar II only checks triple-booking, no slot finding' },
      1229: { GAP_COND: 'max(s1[i][0], s2[j][0]) + duration <= min(s1[i][1], s2[j][1])' },
      1845: { GAP_COND: 'n/a — seat manager uses min-heap, not time intervals' },
    },
    helixOrder: [731, 1229, 1845],
    helixDelta: {
      731: 'My Calendar II: reject if overlaps double list. For each primary overlap, add to double list.',
      1229: 'Meeting Scheduler: two-pointer on sorted slots. Find intersection length >= duration.',
      1845: 'Seat Manager: min-heap of seats. reserve = pop min, unreserve = push. O(log n).',
    },
    autopsies: [
      {
        cause: 'Not checking double-booking list before adding to overlaps',
        wrong: 'for (auto& b : books) overlaps.push_back(overlap); // no double-booking check first',
        testCase: 'Triple booking is allowed — should be rejected',
        fix: 'First check all intervals in overlaps list for triple-booking; reject if any overlap.',
      },
    ],
    sayIt: [
      'Calendar II: maintain overlaps list. Reject if new interval overlaps any existing overlap. Add overlaps to list.',
    ],
  }),

  // ── Parking System ───────────────────────────────────────────────

  'parking-system': e({
    xray: [
      { text: '**counter array** per car type (big, medium, small)', kind: 'signal' },
      { text: '**decrement** on entry; return false if full', kind: 'goal' },
    ],
    budget: ['reservation', 'oopDesign'],
    slottedTemplate: `class ParkingSystem {
    int spaces[3];
public:
    ParkingSystem(int b, int m, int s) {
        spaces[0] = b; spaces[1] = m; spaces[2] = s;
    }
    bool addCar(int t) {
        if (spaces[t - 1] > 0) {
            /* SLOT: decrement */;
            return true;
        }
        return false;
    }
}`,
    slots: [
      { id: 'DECREMENT', label: 'Decrement space count', hint: 'spaces[t - 1]--' },
    ],
    slotFills: {
      1603: { DECREMENT: 'spaces[t - 1]--' },
    },
    helixOrder: [1603],
    helixDelta: {
      1603: 'Parking System: int[3] counter. addCar decrements if space available. O(1) per operation.',
    },
    autopsies: [
      {
        cause: 'Car type is 1-indexed but array access is 0-indexed',
        wrong: 'if (spaces[t] > 0) spaces[t]--;',
        testCase: 'Car type 1 accesses spaces[1] (small) instead of spaces[0] (big)',
        fix: 'Access spaces[t - 1] for 1-indexed car types.',
      },
    ],
    sayIt: [
      'Parking System: counter[3] for big/medium/small. addCar decrements if space > 0. O(1).',
    ],
  }),

  // ── Board Games ──────────────────────────────────────────────────

  'board-games': e({
    xray: [
      { text: '**row/col/diag/anti counters** for O(1) win check', kind: 'signal' },
      { text: '**+1/-1** for players; **abs == n** indicates win', kind: 'signal' },
    ],
    budget: ['gameDesign', 'oopDesign'],
    slottedTemplate: `class TicTacToe {
    vector<int> rows, cols;
    int diag, anti, n;
public:
    TicTacToe(int sz): n(sz), rows(sz, 0), cols(sz, 0), diag(0), anti(0) {}
    int move(int r, int c, int p) {
        int add = (p == 1) ? 1 : -1;
        rows[r] += add; cols[c] += add;
        if (r == c) diag += add;
        if (r + c == n - 1) anti += add;
        if (abs(rows[r]) == n || abs(cols[c]) == n || abs(diag) == n || abs(anti) == n)
            return /* SLOT: winner */;
        return 0;
    }
}`,
    slots: [
      { id: 'WINNER', label: 'Return winner ID', hint: 'p' },
    ],
    slotFills: {
      348: { WINNER: 'p' },
      1275: { WINNER: 'board[r][c] // return the player char' },
    },
    helixOrder: [348, 1275],
    helixDelta: {
      348: 'Tic-Tac-Toe: +1/-1 per player. Row/col/diag/anti counters. Win when abs(counter) == n.',
      1275: 'Find Winner: check all rows, cols, diags for 3-in-a-row. Return winner, Draw, or Pending.',
    },
    autopsies: [
      {
        cause: 'Not checking both diagonals for win condition',
        wrong: 'if (r == c) diag += add; if (abs(diag) == n) return p; // missing anti-diagonal',
        testCase: 'Win on anti-diagonal (e.g., (0,2), (1,1), (2,0)) not detected',
        fix: 'Track both diag (r==c) and anti (r+c==n-1). Check both for win.',
      },
    ],
    sayIt: [
      'Tic-Tac-Toe: row, col, diag, anti counters. Player 1 = +1, Player 2 = -1. abs(counter) == n means win.',
    ],
  }),

  'other-games': e({
    xray: [
      { text: '**deque for body** + **set for collision** detection', kind: 'signal' },
      { text: '**remove tail before checking head** collision', kind: 'signal' },
    ],
    budget: ['gameDesign', 'collectionDesign'],
    slottedTemplate: `class SnakeGame {
    set<pair<int,int>> body;
    deque<pair<int,int>> snake;
    vector<vector<int>> food;
    int w, h, idx;
public:
    SnakeGame(int ww, int hh, vector<vector<int>>& f): w(ww), h(hh), food(f), idx(0) {
        snake.push_back({0, 0});
        body.insert({0, 0});
    }
    int move(string dir) {
        auto [r, c] = snake.front();
        if (dir == "U") r--;
        else if (dir == "D") r++;
        else if (dir == "L") c--;
        else if (dir == "R") c++;
        if (r < 0 || r >= h || c < 0 || c >= w) return -1;
        auto tail = snake.back(); snake.pop_back(); body.erase(tail);
        if (body.count({r, c})) return -1;
        snake.push_front({r, c});
        body.insert({r, c});
        if (idx < (int)food.size() && r == food[idx][0] && c == food[idx][1]) {
            idx++;
            snake.push_back(tail);
            body.insert(tail);
        }
        return /* SLOT: returnScore */;
    }
}`,
    slots: [
      { id: 'RETURN_SCORE', label: 'Return current score', hint: 'idx' },
    ],
    slotFills: {
      353: { RETURN_SCORE: 'idx' },
      1396: { RETURN_SCORE: 'n/a — underground system tracks checkIn/checkOut averages, not scores' },
    },
    helixOrder: [353, 1396],
    helixDelta: {
      353: 'Snake Game: deque body + set for O(1) collision. Remove tail before checking head. Grow on food.',
      1396: 'Underground System: map id→(station,time) for checkIn. map (start,end)→(total,count) for average.',
    },
    autopsies: [
      {
        cause: 'Checking head collision before removing tail',
        wrong: 'if (body.count({r,c})) return -1; auto tail = snake.back(); snake.pop_back(); body.erase(tail);',
        testCase: 'Snake moving into tail position that will move — false positive collision',
        fix: 'Remove tail from body set first, then check head collision.',
      },
    ],
    sayIt: [
      'Snake: deque body + set for collision detection. Remove tail before head check. Grow on food by re-adding tail.',
    ],
  }),

  // ── User Interface Components ────────────────────────────────────

  'browser-history': e({
    xray: [
      { text: '**vector + index** for O(1) navigation', kind: 'signal' },
      { text: '**truncate forward history** on new visit', kind: 'goal' },
    ],
    budget: ['uiNavigation', 'oopDesign'],
    slottedTemplate: `class BrowserHistory {
    vector<string> history;
    int cur;
public:
    BrowserHistory(string hp) {
        history.push_back(hp); cur = 0;
    }
    void visit(string url) {
        history.resize(cur + 1);
        history.push_back(url); cur++;
    }
    string back(int s) {
        cur = max(0, cur - s);
        return history[cur];
    }
    string forward(int s) {
        cur = min((int)history.size() - 1, cur + s);
        return history[cur];
    }
    // Variant with history limit:
    void visitWithLimit(string url, int limit) {
        history.resize(cur + 1);
        history.push_back(url); cur++;
        if ((int)history.size() > limit) {
            history.erase(history.begin());
            /* SLOT: adjustCur */;
        }
    }
}`,
    slots: [
      { id: 'ADJUST_CUR', label: 'Adjust current index after removal', hint: 'cur--' },
    ],
    slotFills: {
      1472: { ADJUST_CUR: 'cur-- // shift index down after front removal' },
    },
    helixOrder: [1472],
    helixDelta: {
      1472: 'Browser History: vector + index. visit truncates forward, pushes new. back/forward clamp to bounds.',
    },
    autopsies: [
      {
        cause: 'Not truncating forward history on visit',
        wrong: 'history.push_back(url); cur++; // but history from cur+1 onward still exists',
        testCase: 'After goBack and visit, forward still has stale pages',
        fix: 'history.resize(cur + 1) before pushing new URL.',
      },
    ],
    sayIt: [
      'Browser History: vector<string> + cur index. visit resizes to cur+1, then pushes. back/forward clamp to [0, size-1].',
    ],
  }),

  'menu-navigation': e({
    xray: [
      { text: '**tree of menu items** with parent pointers', kind: 'signal' },
      { text: '**cur pointer** tracks current position; select/back navigate', kind: 'goal' },
    ],
    budget: ['uiNavigation', 'structuralPattern'],
    slottedTemplate: `class Menu {
    struct Item {
        string label;
        vector<Item> children;
        Item* parent;
        Item(string l, Item* p): label(l), parent(p) {}
    };
    Item* root;
    Item* cur;
public:
    Menu(): root(new Item("root", nullptr)), cur(root) {}
    void addItem(string path, string label) {
        Item* p = navigateTo(path);
        if (p) p->children.push_back(Item(label, p));
    }
    vector<string> getOptions() {
        vector<string> opts;
        for (auto& c : cur->children) opts.push_back(c.label);
        return opts;
    }
    bool select(int i) {
        if (i < 0 || i >= (int)cur->children.size()) return false;
        cur = &cur->children[i];
        return true;
    }
    void goBack() { if (/* SLOT: parentCond */) cur = cur->parent; }
}`,
    slots: [
      { id: 'PARENT_COND', label: 'Condition to go back', hint: 'cur->parent' },
    ],
    slotFills: {
      0: { PARENT_COND: 'cur->parent // back if not at root' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Select on leaf item with no children leads to dead end',
        wrong: 'select always succeeds; user stuck on leaf with no options',
        testCase: 'After selecting leaf, getOptions returns empty; no way forward',
        fix: 'select returns bool; caller checks getOptions().empty() and may goBack.',
      },
    ],
    sayIt: [
      'Menu navigation: tree of items with parent pointers. cur tracks position. select moves deeper, goBack moves to parent.',
    ],
  }),

  'text-editor': e({
    xray: [
      { text: '**list<char>** + **cursor iterator** for O(1) insert/delete', kind: 'signal' },
      { text: '**insert before cursor** via list::insert', kind: 'signal' },
    ],
    budget: ['uiNavigation', 'collectionDesign'],
    slottedTemplate: `class TextEditor {
    list<char> text;
    list<char>::iterator cur;
public:
    TextEditor() { cur = text.end(); }
    void addText(string s) {
        for (char c : s) text.insert(cur, c);
    }
    int deleteText(int k) {
        int cnt = 0;
        while (cnt < k && cur != text.begin()) {
            cur = prev(cur);
            cur = text.erase(cur);
            cnt++;
        }
        return cnt;
    }
    string cursorLeft(int k) {
        while (k-- && cur != text.begin()) cur--;
        return lastChars();
    }
    string cursorRight(int k) {
        while (k-- && cur != text.end()) cur++;
        return lastChars();
    }
    string lastChars() {
        auto it = cur;
        int n = 10;
        string s;
        while (n-- && it != text.begin()) s.push_back(/* SLOT: prevChar */);
        reverse(s.begin(), s.end());
        return s;
    }
}`,
    slots: [
      { id: 'PREV_CHAR', label: 'Character before current position', hint: '*prev(it--)' },
    ],
    slotFills: {
      2296: { PREV_CHAR: '*prev(it--)' },
    },
    helixOrder: [2296],
    helixDelta: {
      2296: 'Text Editor: list<char> with cursor. addText inserts before cursor. deleteText removes before cursor. O(n) per operation.',
    },
    autopsies: [
      {
        cause: 'Deleting characters after cursor instead of before',
        wrong: 'cur = text.erase(cur); // erases at cursor position (after) not before',
        testCase: 'deleteText removes char after cursor instead of before',
        fix: 'cur = prev(cur); cur = text.erase(cur); // erase before cursor',
      },
    ],
    sayIt: [
      'Text Editor: list<char> + cursor iterator. insert before cursor. delete removes before cursor. lastChars returns up to 10 prev chars.',
    ],
  }),

  'autocomplete-system': e({
    xray: [
      { text: '**trie with hot count** for search suggestions', kind: 'signal' },
      { text: '**DFS from prefix node** for completions', kind: 'goal' },
    ],
    budget: ['uiNavigation', 'searchIndex'],
    slottedTemplate: `class AutocompleteSystem {
    struct Node {
        unordered_map<char, Node*> next;
        int hot;
    };
    Node* root;
    string cur;
    Node* curNode;
    void insert(string& s, int t) {
        Node* r = root;
        for (char c : s) {
            if (!r->next.count(c)) r->next[c] = new Node();
            r = r->next[c];
        }
        r->hot += t;
    }
    void collect(Node* n, string& path, vector<pair<int,string>>& res) {
        if (n->hot) res.push_back({-n->hot, path});
        for (auto& [c, nxt] : n->next) {
            path.push_back(c);
            collect(nxt, path, res);
            path.pop_back();
        }
    }
public:
    AutocompleteSystem(vector<string>& s, vector<int>& t) {
        root = new Node(); curNode = root;
        for (int i = 0; i < (int)s.size(); i++) insert(s[i], t[i]);
    }
    vector<string> input(char c) {
        if (c == '#') { insert(cur, 1); cur.clear(); curNode = root; return {}; }
        cur.push_back(c);
        if (!curNode || !curNode->next.count(c)) { curNode = nullptr; return {}; }
        curNode = curNode->next[c];
        vector<pair<int,string>> res;
        string path = cur;
        collect(/* SLOT: collectArgs */);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
}`,
    slots: [
      { id: 'COLLECT_ARGS', label: 'Collect completions arguments', hint: 'curNode, path, res' },
    ],
    slotFills: {
      642: { COLLECT_ARGS: 'curNode, path, res' },
    },
    helixOrder: [642],
    helixDelta: {
      642: 'Autocomplete: trie + hot count. input char navigates trie. On #, insert sentence. DFS prefix, sort by hot, top 3.',
    },
    autopsies: [
      {
        cause: 'Not resetting query state after # input',
        wrong: 'if (c == \'#\') { insert(cur, 1); return {}; } // missing cur.clear() and curNode reset',
        testCase: 'After #, next char input continues from previous prefix',
        fix: 'On #: insert sentence, clear cur, reset curNode to root, return empty.',
      },
    ],
    sayIt: [
      'Autocomplete: trie with hot count per sentence. input chars navigate trie. DFS from prefix, sort, return top 3 matches.',
    ],
  }),

  // ── Creational Patterns ──────────────────────────────────────────

  'factory-method': e({
    xray: [
      { text: '**virtual factoryMethod** returns Product*', kind: 'signal' },
      { text: '**subclasses override** to create concrete products', kind: 'goal' },
    ],
    budget: ['creationalPattern', 'oopDesign'],
    slottedTemplate: `class Product {
public:
    virtual ~Product() = default;
    virtual void use() = 0;
};

class ConcreteProductA : public Product {
public:
    void use() override { /* A-specific logic */ }
};

class ConcreteProductB : public Product {
public:
    void use() override { /* B-specific logic */ }
};

class Creator {
public:
    virtual ~Creator() = default;
    virtual Product* factoryMethod() = 0;
    void operation() {
        Product* p = factoryMethod();
        p->use();
        delete p;
    }
};

class CreatorA : public Creator {
public:
    Product* factoryMethod() override { return new ConcreteProductA(); }
};

class CreatorB : public Creator {
public:
    Product* factoryMethod() override { return new ConcreteProductB(); }
    // Variant with parameterized factory:
    Product* factoryMethod(string type) {
        if (type == "A") return new ConcreteProductA();
        return /* SLOT: paramProduct */;
    }
}`,
    slots: [
      { id: 'PARAM_PRODUCT', label: 'Parameter-based product creation', hint: 'new ConcreteProductB()' },
    ],
    slotFills: {
      0: { PARAM_PRODUCT: 'new ConcreteProductB()' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Forgetting virtual destructor in base class',
        wrong: 'class Product { public: virtual void use() = 0; }; // no virtual ~Product()',
        testCase: 'delete through base pointer — undefined behavior, derived destructor not called',
        fix: 'Add virtual ~Product() = default; to base class.',
      },
    ],
    sayIt: [
      'Factory Method: Creator defines virtual factoryMethod(). Subclasses override to create specific products. Encapsulates object creation.',
    ],
  }),

  'singleton': e({
    xray: [
      { text: '**private constructor** + **static instance**', kind: 'signal' },
      { text: '**Meyer\'s singleton** (static local) is thread-safe in C++11', kind: 'signal' },
    ],
    budget: ['creationalPattern', 'oopDesign'],
    slottedTemplate: `class Singleton {
    static Singleton* instance;
    Singleton() {}
public:
    static Singleton* getInstance() {
        if (!instance) instance = new Singleton();
        return instance;
    }
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};

Singleton* Singleton::instance = nullptr;

// Thread-safe (C++11):
class SingletonSafe {
public:
    static SingletonSafe& getInstance() {
        static SingletonSafe instance;
        return instance;
    }
    SingletonSafe(const SingletonSafe&) = delete;
    SingletonSafe& operator=(const SingletonSafe&) = delete;
private:
    SingletonSafe() {}
    // Variant with template:
    static SingletonSafe& getInstanceWithParam(int arg) {
        static SingletonSafe instance;
        /* SLOT: initOnce */;
        return instance;
    }
}`,
    slots: [
      { id: 'INIT_ONCE', label: 'One-time initialization', hint: 'if (!initialized) { init(arg); initialized = true; }' },
    ],
    slotFills: {
      0: { INIT_ONCE: 'static bool init = (instance.init(arg), true); (void)init;' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Non-thread-safe double-checked locking without memory barrier',
        wrong: 'if (!instance) { lock_guard<mutex> lock(m); if (!instance) instance = new Singleton(); }',
        testCase: 'Compilers may reorder writes — instance assigned before Singleton fully constructed',
        fix: 'Use Meyer\'s Singleton (static local) which is guaranteed thread-safe in C++11.',
      },
    ],
    sayIt: [
      'Singleton: private ctor, static instance. Meyer\'s Singleton (static local) is inherently thread-safe in C++11.',
    ],
  }),

  'builder': e({
    xray: [
      { text: '**separate construction** from representation', kind: 'signal' },
      { text: '**Director** orchestrates step-by-step building', kind: 'goal' },
    ],
    budget: ['creationalPattern', 'oopDesign'],
    slottedTemplate: `class Product {
public:
    string partA, partB, partC;
};

class Builder {
public:
    virtual ~Builder() = default;
    virtual void buildPartA() = 0;
    virtual void buildPartB() = 0;
    virtual void buildPartC() = 0;
    virtual Product getResult() = 0;
};

class ConcreteBuilder : public Builder {
    Product p;
public:
    void buildPartA() override { p.partA = "A1"; }
    void buildPartB() override { p.partB = "B1"; }
    void buildPartC() override { p.partC = "C1"; }
    Product getResult() override { return p; }
};

class Director {
    Builder* builder;
public:
    Director(Builder* b): builder(b) {}
    Product construct() {
        builder->buildPartA();
        builder->buildPartB();
        /* SLOT: buildPartC */;
        return builder->getResult();
    }
}`,
    slots: [
      { id: 'BUILD_PART_C', label: 'Build final part', hint: 'builder->buildPartC()' },
    ],
    slotFills: {
      0: { BUILD_PART_C: 'builder->buildPartC()' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Calling getResult before all parts are built',
        wrong: 'Product construct() { builder->buildPartA(); return builder->getResult(); } // B and C not built',
        testCase: 'Product has default/uninitialized partB and partC',
        fix: 'Ensure all buildPart* methods are called before getResult.',
      },
    ],
    sayIt: [
      'Builder: separate construction from representation. Director calls step-by-step building methods. Builder produces final Product.',
    ],
  }),

  // ── Structural Patterns ──────────────────────────────────────────

  'adapter': e({
    xray: [
      { text: '**wraps Adaptee** to match Target interface', kind: 'signal' },
      { text: '**translates** incompatible method calls', kind: 'goal' },
    ],
    budget: ['structuralPattern', 'oopDesign'],
    slottedTemplate: `class Target {
public:
    virtual ~Target() = default;
    virtual string request() const {
        return "Target: default behavior";
    }
};

class Adaptee {
public:
    string specificRequest() const {
        return ".eetpadA eht fo roivaheb laicepS";
    }
};

class Adapter : public Target {
    Adaptee* adaptee;
public:
    Adapter(Adaptee* a) : adaptee(a) {}
    string request() const override {
        string s = adaptee->specificRequest();
        reverse(s.begin(), s.end());
        return s;
    }
    // Variant: class adapter via multiple inheritance
    string requestWithFormat(string format) {
        string s = adaptee->specificRequest();
        reverse(s.begin(), s.end());
        /* SLOT: formatApply */;
    }
}`,
    slots: [
      { id: 'FORMAT_APPLY', label: 'Apply formatting to result', hint: 'if (format == "json") return "{result: " + s + "}";' },
    ],
    slotFills: {
      0: { FORMAT_APPLY: 'return format == "reverse" ? s : adaptee->specificRequest();' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Null adaptee causing crash on method call',
        wrong: 'Adapter(nullptr) — no null guard in request()',
        testCase: 'request() called on adapter with null adaptee -> crash',
        fix: 'Guard against null: if (!adaptee) return ""; or require non-null in constructor.',
      },
    ],
    sayIt: [
      'Adapter: wraps incompatible Adaptee interface into Target interface. Translates method calls. Can be object or class adapter.',
    ],
  }),

  'decorator': e({
    xray: [
      { text: '**wraps component** to add behavior dynamically', kind: 'signal' },
      { text: '**stackable** — decorators can wrap decorators', kind: 'signal' },
    ],
    budget: ['structuralPattern', 'oopDesign'],
    slottedTemplate: `class Component {
public:
    virtual ~Component() = default;
    virtual string operation() const = 0;
};

class ConcreteComponent : public Component {
public:
    string operation() const override { return "ConcreteComponent"; }
};

class DecoratorBase : public Component {
protected:
    Component* component;
public:
    DecoratorBase(Component* c) : component(c) {}
    string operation() const override { return component->operation(); }
};

class DecoratorA : public DecoratorBase {
public:
    DecoratorA(Component* c) : DecoratorBase(c) {}
    string operation() const override {
        return "DecoratorA(" + DecoratorBase::operation() + ")";
    }
};

class DecoratorB : public DecoratorBase {
public:
    DecoratorB(Component* c) : DecoratorBase(c) {}
    string operation() const override {
        return "DecoratorB(" + DecoratorBase::operation() + ")";
    }
    // Variant: conditional decorator
    string operationConditional(bool flag) const override {
        if (flag) return "Wrapped(" + /* SLOT: baseOp */ + ")";
        return DecoratorBase::operation();
    }
}`,
    slots: [
      { id: 'BASE_OP', label: 'Base operation call', hint: 'DecoratorBase::operation()' },
    ],
    slotFills: {
      0: { BASE_OP: 'DecoratorBase::operation()' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Decorator wrapping null component',
        wrong: 'DecoratorA(nullptr);',
        testCase: 'Calling operation() on null component causes crash',
        fix: 'Check for null component or require non-null in constructor.',
      },
    ],
    sayIt: [
      'Decorator: wraps component with same interface. Adds behavior before/after delegating. Stackable for multiple enhancements.',
    ],
  }),

  'composite': e({
    xray: [
      { text: '**tree structure** of Leaf + Composite nodes', kind: 'signal' },
      { text: '**uniform operation** recurses over children', kind: 'goal' },
    ],
    budget: ['structuralPattern', 'treeDesign'],
    slottedTemplate: `class Component {
public:
    virtual ~Component() = default;
    virtual void operation() const = 0;
    virtual void add(Component*) {}
    virtual void remove(Component*) {}
};

class Leaf : public Component {
    string name;
public:
    Leaf(string n): name(n) {}
    void operation() const override { /* leaf behavior */ }
};

class Composite : public Component {
    vector<Component*> children;
public:
    void operation() const override {
        for (auto* c : children) c->operation();
    }
    void add(Component* c) override { children.push_back(c); }
    void remove(Component* c) override {
        children.erase(remove(children.begin(), children.end(), c), children.end());
    }
    // Variant: find child by name
    Component* findChild(string name) {
        for (auto* c : children) {
            if (/* SLOT: nameMatch */) return c;
        }
        return nullptr;
    }
}`,
    slots: [
      { id: 'NAME_MATCH', label: 'Check if child matches name', hint: 'auto* leaf = dynamic_cast<Leaf*>(c); if (leaf && leaf->name == name) return c;' },
    ],
    slotFills: {
      0: { NAME_MATCH: 'auto* lf = dynamic_cast<Leaf*>(c); if (lf && lf->name == name) return c;' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Circular composition causing infinite recursion',
        wrong: 'Composite* a = new Composite(); Composite* b = new Composite(); a->add(b); b->add(a);',
        testCase: 'operation() on a recursively calls b->operation() which calls a->operation() — stack overflow',
        fix: 'Ensure no cycles: each node should only have one parent (or use visited set in traversal).',
      },
    ],
    sayIt: [
      'Composite: tree of Leaf + Composite sharing same Component interface. Operations recurse uniformly over children.',
    ],
  }),

  // ── Behavioral Patterns ──────────────────────────────────────────

  'iterator-pattern': e({
    xray: [
      { text: '**Iterator interface** with next() and hasNext()', kind: 'signal' },
      { text: '**cache next** value for O(1) peek', kind: 'goal' },
    ],
    budget: ['behavioralPattern', 'oopDesign'],
    slottedTemplate: `template<typename T>
class Iterator {
public:
    virtual ~Iterator() = default;
    virtual T next() = 0;
    virtual bool hasNext() = 0;
};

template<typename T>
class VectorIterator : public Iterator<T> {
    vector<T>& data;
    size_t idx;
public:
    VectorIterator(vector<T>& d): data(d), idx(0) {}
    T next() override { return data[idx++]; }
    bool hasNext() override { return idx < data.size(); }
};

class PeekingIterator : public Iterator<int> {
    Iterator<int>* it;
    int nextVal;
    bool hasNextVal;
public:
    PeekingIterator(Iterator<int>* i): it(i), hasNextVal(false) {
        if (it->hasNext()) { nextVal = it->next(); hasNextVal = true; }
    }
    int peek() { return nextVal; }
    int next() override {
        int cur = nextVal;
        hasNextVal = it->hasNext();
        if (hasNextVal) nextVal = it->next();
        return cur;
    }
    bool hasNext() override { return hasNextVal; }
    // Variant: advance by k
    void advance(int k) {
        while (k-- && hasNext()) /* SLOT: consumeNext */;
    }
}`,
    slots: [
      { id: 'CONSUME_NEXT', label: 'Consume next element', hint: 'next()' },
    ],
    slotFills: {
      284: { CONSUME_NEXT: 'next()' },
      341: { CONSUME_NEXT: 'n/a — nested iterator uses recursive advance, not peek' },
    },
    helixOrder: [284, 341],
    helixDelta: {
      284: 'Peeking Iterator: cache next value. peek returns cached. next advances. hasNext checks cache validity.',
      341: 'Flatten Nested Iterator: stack of iterators. Lazy DFS flattening. Advance past empty lists recursively.',
    },
    autopsies: [
      {
        cause: 'Not caching first value in constructor',
        wrong: 'PeekingIterator(Iterator<int>* i): it(i), hasNextVal(false) {} // never peeks first',
        testCase: 'peek() immediately after construction returns undefined',
        fix: 'Call it->next() in constructor if hasNext(), storing first value in cache.',
      },
    ],
    sayIt: [
      'Iterator pattern: next() + hasNext(). PeekingIterator caches next value for O(1) peek. Constructor primes the cache.',
    ],
  }),

  'observer': e({
    xray: [
      { text: '**Subject** maintains list of **Observers**', kind: 'signal' },
      { text: '**notify()** broadcasts update() to all', kind: 'goal' },
    ],
    budget: ['behavioralPattern', 'oopDesign'],
    slottedTemplate: `class Observer {
public:
    virtual ~Observer() = default;
    virtual void update(string msg) = 0;
};

class Subject {
    vector<Observer*> observers;
public:
    void attach(Observer* o) { observers.push_back(o); }
    void detach(Observer* o) {
        observers.erase(remove(observers.begin(), observers.end(), o), observers.end());
    }
    void notify(string msg) {
        for (auto* o : observers) o->update(msg);
    }
};

class ConcreteObserver : public Observer {
    string name;
public:
    ConcreteObserver(string n): name(n) {}
    void update(string msg) override {
        // react to msg
    }
    // Variant: observer with priority
    void attachWithPriority(Subject& s, int priority) {
        /* SLOT: priorAttach */;
    }
}`,
    slots: [
      { id: 'PRIOR_ATTACH', label: 'Priority-based attachment', hint: 's.attach(this) // sorted vector by priority' },
    ],
    slotFills: {
      0: { PRIOR_ATTACH: 's.attach(this) // extend Subject with priority-sorted observer list' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Modifying observer list during notification',
        wrong: 'void notify(string msg) { for (auto* o : observers) { o->update(msg); if (o->shouldDetach()) detach(o); } }',
        testCase: 'Modifying vector during iteration causes undefined behavior',
        fix: 'Iterate over a copy of observers list, or defer removals.',
      },
    ],
    sayIt: [
      'Observer: Subject maintains observer list. notify() broadcasts update() to all. Decouples event source from handlers.',
    ],
  }),

  'strategy': e({
    xray: [
      { text: '**Strategy interface** with execute() method', kind: 'signal' },
      { text: '**Context** delegates to strategy at runtime', kind: 'goal' },
    ],
    budget: ['behavioralPattern', 'oopDesign'],
    slottedTemplate: `class Strategy {
public:
    virtual ~Strategy() = default;
    virtual int execute(int a, int b) const = 0;
};

class AddStrategy : public Strategy {
public:
    int execute(int a, int b) const override { return a + b; }
};

class SubtractStrategy : public Strategy {
public:
    int execute(int a, int b) const override { return a - b; }
};

class MultiplyStrategy : public Strategy {
public:
    int execute(int a, int b) const override { return a * b; }
};

class Context {
    Strategy* strategy;
public:
    Context(Strategy* s): strategy(s) {}
    void setStrategy(Strategy* s) { strategy = s; }
    int executeStrategy(int a, int b) const { return strategy->execute(a, b); }
    // Variant: combine multiple strategies
    int executeAll(vector<Strategy*> strategies, int a, int b) {
        int result = a;
        for (auto* s : strategies) {
            result = /* SLOT: chainExec */;
        }
        return result;
    }
}`,
    slots: [
      { id: 'CHAIN_EXEC', label: 'Chain strategy execution', hint: 's->execute(result, b)' },
    ],
    slotFills: {
      0: { CHAIN_EXEC: 's->execute(result, b)' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Null strategy in context causing crash',
        wrong: 'Context(nullptr)',
        testCase: 'executeStrategy called on null strategy — undefined behavior',
        fix: 'Default to a base strategy or check for null before delegating.',
      },
    ],
    sayIt: [
      'Strategy: family of interchangeable algorithms. Context delegates to strategy via interface. Swappable at runtime.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
