import type { TaxonomyNode } from '../../types'
import { leaf } from './helpers'

const CPP = `#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <string>
#include <list>
using namespace std;

`

// ── Cache Design (teal) ──────────────────────────────────────────

export const lruCache: TaxonomyNode = leaf('lru-cache', 'LRU Cache', 'teal', {
  template: `${CPP}class LRUCache {
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
            delete d;
        }
    }
};`,
  problems: [
    { id: 146, title: 'LRU Cache', slug: 'lru-cache', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–38: as-is (DLL + hash map; move-to-front on access).' },
    { id: 460, title: 'LFU Cache', slug: 'lfu-cache', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: add freq map + per-freq DLL; evict from lowest freq.', variationCode: 'unordered_map<int,int> keyFreq; unordered_map<int,list<int>> freqKeys; int minFreq;' },
  ],
  pitfalls: ['❌ Forgetting to update tail sentinel when evicting the last node.', '❌ Manual DLL pointer surgery — must wire new node before updating head->next.'],
  edgeCases: [
    { input: 'capacity = 1, put(1,1), put(2,2), get(1) → -1', breaks: 'Evicts the only node; get must return -1.' },
    { input: 'get on empty cache (no puts)', breaks: 'Must return -1 without crashing on nullptr.' },
  ],
  interviewTip: '💡 "LRU Cache" → doubly-linked list (order) + hash map (O(1) lookup); move accessed node to head.',
})

export const lfuCache: TaxonomyNode = leaf('lfu-cache', 'LFU Cache', 'teal', {
  template: `${CPP}class LFUCache {
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
            int evict = freqKeys[minFreq].back();
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
};`,
  problems: [
    { id: 460, title: 'LFU Cache', slug: 'lfu-cache', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 7–37: as-is (freq map + per-freq DLL; evict from lowest freq).' },
  ],
  pitfalls: ['❌ minFreq must be updated when the last key at minFreq is evicted.', '❌ Cannot store all keys in one DLL — need separate list per frequency.'],
  edgeCases: [
    { input: 'capacity = 0', breaks: 'Must handle gracefully without allocating.' },
    { input: 'put same key multiple times repeatedly', breaks: 'Frequency grows; must not leak memory or crash on overflow.' },
  ],
  interviewTip: '💡 "LFU" → hash map of (key → freq) + hash map of (freq → list of keys); evict from minFreq list tail.',
})

export const timeBasedCaching: TaxonomyNode = leaf('time-based-caching', 'Time-Based Caching', 'teal', {
  template: `${CPP}class TimeMap {
    unordered_map<string, vector<pair<int, string>>> m;
public:
    void set(string key, string value, int timestamp) {
        m[key].push_back({timestamp, value});
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
};`,
  problems: [
    { id: 981, title: 'Time Based KV Store', slug: 'time-based-key-value-store', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–18: as-is (map of key → sorted list of {timestamp, value}; binary search).' },
  ],
  pitfalls: ['❌ LC 981: vector stores pairs in chronological order; binary search with upper_bound to find prev timestamp.', '❌ Must return empty string if no timestamp ≤ given timestamp.'],
  edgeCases: [
    { input: 'get with timestamp before any set', breaks: 'Returns empty string.' },
    { input: 'set two values at same timestamp for same key', breaks: 'Vector stores both; binary search picks correct one via upper_bound.' },
  ],
  interviewTip: '💡 "Time-based KV" → unordered_map<string, vector<pair<int, string>>>; binary search for prev timestamp.',
})

// ── Custom Hash Structures (teal) ─────────────────────────────────

export const hashmapImpl: TaxonomyNode = leaf('hashmap-impl', 'HashMap Implementation', 'teal', {
  template: `${CPP}class MyHashMap {
    vector<list<pair<int,int>>> buckets;
    int size;
    int hash(int k) { return k % size; }
public:
    MyHashMap(): size(1000), buckets(size) {}
    void put(int k, int v) {
        auto& b = buckets[hash(k)];
        for (auto& [key, val] : b) {
            if (key == k) { val = v; return; }
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
};`,
  problems: [
    { id: 706, title: 'Design HashMap', slug: 'design-hashmap', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–25: as-is (chaining with vector of lists).' },
    { id: 1146, title: 'Snapshot Array', slug: 'snapshot-array', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: vector of maps (snap_id → value) per index; binary search per get.', variationCode: 'vector<map<int,int>> arr; int snapId = 0; SnapshotArray(int l) { arr.resize(l); for i..l-1: arr[i][0]=0; } void set(int i,int v) { arr[i][snapId]=v; } int snap() { return snapId++; } int get(int i,int s) { return prev(arr[i].upper_bound(s))->second; }' },
  ],
  pitfalls: ['❌ Bucket size choice: too small → collisions; too large → memory waste.', '❌ Cannot store key-value with default vector indexing — need chaining or open addressing.'],
  edgeCases: [
    { input: 'put/get on many colliding keys (same hash mod)', breaks: 'Chain must handle O(n) traversal.' },
    { input: 'remove non-existent key', breaks: 'Must not crash; list remove_if handles it.' },
  ],
  interviewTip: '💡 "Design HashMap" → vector of buckets; each bucket is a list of (key, value) pairs for chaining.',
})

export const hashsetImpl: TaxonomyNode = leaf('hashset-impl', 'HashSet Implementation', 'teal', {
  template: `${CPP}class MyHashSet {
    vector<list<int>> buckets;
    int size;
    int hash(int k) { return k % size; }
public:
    MyHashSet(): size(1000), buckets(size) {}
    void add(int k) {
        auto& b = buckets[hash(k)];
        for (int x : b) if (x == k) return;
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
};`,
  problems: [
    { id: 705, title: 'Design HashSet', slug: 'design-hashset', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–21: as-is (chaining with vector of lists).' },
  ],
  pitfalls: ['❌ remove() on non-existent key must not crash (list::remove is safe).', '❌ Hash function quality matters — poor distribution causes O(n) operations.'],
  edgeCases: [
    { input: 'add duplicate element', breaks: 'Must silently ignore (no-op).' },
    { input: 'contains on empty set', breaks: 'Returns false.' },
  ],
  interviewTip: '💡 "Design HashSet" → same as HashMap but without values; vector of lists for chaining.',
})

export const specializedHash: TaxonomyNode = leaf('specialized-hash', 'Specialized Hash Structures', 'teal', {
  template: `${CPP}class RandomizedSet {
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
        return v[rand() % v.size()];
    }
};`,
  problems: [
    { id: 380, title: 'Insert Delete GetRandom O(1)', slug: 'insert-delete-getrandom-o1', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–26: as-is (hash map + vector; swap with last on remove).' },
    { id: 381, title: 'Insert Delete GetRandom O(1) Dups', slug: 'insert-delete-getrandom-o1-duplicates-allowed', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: map int → unordered_set<int> of indices; swap with last, update all affected indices.', variationCode: 'unordered_map<int, unordered_set<int>> m; vector<int> v; // each val maps to set of indices in v' },
  ],
  pitfalls: ['❌ LC 380: when removing, update m[last] to idx after swap, not before.', '❌ LC 381: erasing from unordered_set may invalidate iterator; copy before erase.'],
  edgeCases: [
    { input: 'remove from empty set', breaks: 'Returns false.' },
    { input: 'getRandom on single element', breaks: 'Must return that element always.' },
  ],
  interviewTip: '💡 "O(1) getRandom" → hash map + vector; removing: swap with last, pop back, update map.',
})

// ── Advanced Collections (teal) ───────────────────────────────────

export const multiLevelDs: TaxonomyNode = leaf('multi-level-ds', 'Multi-level Data Structures', 'teal', {
  template: `${CPP}class NestedIterator {
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
            return advance();
        }
        return cur != nullptr;
    }
public:
    NestedIterator(vector<NestedInteger>& d): data(d), idx(0), cur(nullptr) {}
    int next() { return cur ? cur->next() : data[idx++].getInteger(); }
    bool hasNext() { return advance(); }
};`,
  problems: [
    { id: 341, title: 'Flatten Nested Iterator', slug: 'flatten-nested-list-iterator', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–22: as-is (recursive iterator with lazy flattening).' },
    { id: 432, title: 'All O(1) Data Structure', slug: 'all-oone-data-structure', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: map of key → count + map of count → doubly-linked list of keys; similar to LFU.', variationCode: 'unordered_map<string, int> keyCount; map<int, unordered_set<string>> countKeys; // O(log n) for min/max' },
  ],
  pitfalls: ['❌ LC 341: recursive iterator; must handle empty inner lists correctly.', '❌ LC 432: increment/decrement key count must move key between count buckets.'],
  edgeCases: [
    { input: 'nested list with empty inner lists: [[]]', breaks: 'hasNext must skip empty lists.' },
    { input: 'deeply nested: [[[[1]]]]', breaks: 'Recursion depth proportional to nesting.' },
  ],
  interviewTip: '💡 "Nested iterator" → lazy DFS; maintain a stack of iterators; advance past empty lists.',
})

export const stackQueueVariants: TaxonomyNode = leaf('stack-queue-variants', 'Stack & Queue Variants', 'teal', {
  template: `${CPP}class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int v) {
        int m = st.empty() ? v : min(v, st.top().second);
        st.push({v, m});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,
  problems: [
    { id: 155, title: 'Min Stack', slug: 'min-stack', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (stack of {value, currentMin} pairs).' },
    { id: 232, title: 'Queue Using Stacks', slug: 'implement-queue-using-stacks', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: two stacks (in/out); amortized O(1) per operation.', variationCode: 'stack<int> in, out; void push(int x) { in.push(x); } int pop() { if(out.empty()) while(!in.empty()){ out.push(in.top()); in.pop(); } int t=out.top(); out.pop(); return t; }' },
    { id: 622, title: 'Circular Queue', slug: 'design-circular-queue', companies: ['AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: fixed array + head/tail pointers with modulo wrap.', variationCode: 'int q[1000], h=0, t=0, sz=0, cap; MyCircularQueue(int k): cap(k) {} bool enQueue(int v) { if(sz==cap) return false; q[t%cap]=v; t++; sz++; return true; } bool deQueue() { if(!sz) return false; h++; sz--; return true; }' },
  ],
  pitfalls: ['❌ MinStack: storing global min fails on pop; must store per-element running min.', '❌ Queue via stacks: out stack must be drained fully before refilling from in.'],
  edgeCases: [
    { input: 'pop/peek on empty stack/queue', breaks: 'Undefined behavior or exception.' },
    { input: 'single element operations repeated', breaks: 'Must correctly toggle between in/out stacks.' },
  ],
  interviewTip: '💡 "MinStack" → store (value, current_min) pairs. "Queue via stacks" → in/out; amortized O(1).',
})

export const customPriority: TaxonomyNode = leaf('custom-priority', 'Custom Priority Structures', 'teal', {
  template: `${CPP}class SeatManager {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.push(i);
    }
    int reserve() {
        int s = pq.top(); pq.pop();
        return s;
    }
    void unreserve(int s) {
        pq.push(s);
    }
};`,
  problems: [
    { id: 1845, title: 'Seat Manager', slug: 'seat-reservation-manager', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 4–14: as-is (min-heap of available seats).' },
    { id: 895, title: 'Max Frequency Stack', slug: 'maximum-frequency-stack', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: map freq → stack; track maxFreq; push/pop maintain frequency lists.', variationCode: 'unordered_map<int,int> freq; unordered_map<int,stack<int>> group; int maxFreq=0; void push(int v) { int f=++freq[v]; group[f].push(v); maxFreq=max(maxFreq,f); } int pop() { int v=group[maxFreq].top(); group[maxFreq].pop(); freq[v]--; if(group[maxFreq].empty()) maxFreq--; return v; }' },
  ],
  pitfalls: ['❌ LC 1845: large n (10^5) — push all on init is O(n log n), fine.', '❌ LC 895: on pop, decrement freq; if freq stack empties, decrement maxFreq.'],
  edgeCases: [
    { input: 'reserve more than available seats', breaks: 'Undefined — assume n sufficient.' },
    { input: 'unreserve a seat never reserved', breaks: 'Heap now has duplicate seat; reserve returns it.' },
  ],
  interviewTip: '💡 "Seat manager" → min-heap. "Freq stack" → map<int, stack<int>> per freq + maxFreq tracker.',
})

// ── Tree-Based Designs (teal) ─────────────────────────────────────

export const trieImpl: TaxonomyNode = leaf('trie-impl', 'Trie Implementation', 'teal', {
  template: `${CPP}class Trie {
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
        cur->end = true;
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
};`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–30: as-is (array of 26 pointers per node).' },
    { id: 211, title: 'Add & Search Word', slug: 'design-add-and-search-words-data-structure', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: search with wildcard — DFS on all children when char is .', variationCode: 'bool search(string w, int i, Node* cur) { if(i==w.size()) return cur->end; if(w[i]==\'.\') { for(Node* c:cur->next) if(c&&search(w,i+1,c)) return true; return false; } Node* n=cur->next[w[i]-\'a\']; return n&&search(w,i+1,n); }' },
    { id: 1166, title: 'File System', slug: 'design-file-system', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: trie of path segments; createPath inserts, get returns value.', variationCode: '// see Directory Structure leaf for trie-based file system design' },
  ],
  pitfalls: ['❌ LC 208: array[26] initialization — must zero-initialize or use fill().', '❌ LC 211: wildcard . must match any character; DFS all 26 children.'],
  edgeCases: [
    { input: 'empty string insertion', breaks: 'Root->end = true; search("") returns true.' },
    { input: 'overlapping prefixes (e.g., "a" and "ab")', breaks: 'Each insert creates nodes as needed; no collision.' },
  ],
  interviewTip: '💡 "Trie" → array[26] of Node* per node; insert/search/startsWith O(L) time.',
})

export const bst: TaxonomyNode = leaf('bst', 'Binary Search Tree', 'teal', {
  template: `${CPP}class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* r) {
        while (r) { st.push(r); r = r->left; }
    }
public:
    BSTIterator(TreeNode* r) { pushLeft(r); }
    int next() {
        TreeNode* n = st.top(); st.pop();
        pushLeft(n->right);
        return n->val;
    }
    bool hasNext() { return !st.empty(); }
};`,
  problems: [
    { id: 173, title: 'BST Iterator', slug: 'binary-search-tree-iterator', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–16: as-is (stack-based iterative inorder; push all left).' },
    { id: 1586, title: 'BST Iterator II', slug: 'binary-search-tree-iterator-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: add prev pointer stack for O(1) hasPrev; extend with tracked history.', variationCode: '// add stack of visited for prev() support; or store vector of inorder traversal' },
  ],
  pitfalls: ['❌ LC 173: pushLeft must be called in constructor and after each next() on the right child.', '❌ Forgetting hasNext() returns false when stack is empty.'],
  edgeCases: [
    { input: 'empty tree (root = nullptr)', breaks: 'hasNext returns false immediately; next() must not be called.' },
    { input: 'tree with only right children', breaks: 'pushLeft pushes only root; next pops it, pushesLeft on right.' },
  ],
  interviewTip: '💡 "BST Iterator" → stack of nodes; push all left in constructor/after each next on right child.',
})

export const advancedTree: TaxonomyNode = leaf('advanced-tree', 'Advanced Tree Structures', 'teal', {
  template: `${CPP}class Codec {
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
        n->right = dfs(d, i);
        return n;
    }
};`,
  problems: [
    { id: 297, title: 'Serialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–21: as-is (preorder recursion with # for nulls).' },
    { id: 355, title: 'Design Twitter', slug: 'design-twitter', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: user → set of followees + list of tweets; getNewsFeed merges k most recent.', variationCode: 'unordered_map<int, unordered_set<int>> follows; unordered_map<int, vector<pair<int,int>>> tweets; int time=0; void postTweet(int u,int t) { tweets[u].push_back({time++,t}); } vector<int> getNewsFeed(int u) { priority_queue<pair<int,int>> pq; for(int f:follows[u]) for(auto& t:tweets[f]) pq.push(t); for(auto& t:tweets[u]) pq.push(t); vector<int> feed; while(!pq.empty()&&feed.size()<10){ feed.push_back(pq.top().second); pq.pop(); } return feed; }' },
  ],
  pitfalls: ['❌ LC 297: must handle negative numbers in tokens correctly.', '❌ LC 355: getNewsFeed must merge k latest tweets from user + followees, not all.'],
  edgeCases: [
    { input: 'tree with only null children (single node)', breaks: 'serialize = "val,#,#" ; deserialize returns singe node.' },
    { input: 'deeply skewed tree (1000 nodes on one side)', breaks: 'Recursion depth O(n) may stack overflow.' },
  ],
  interviewTip: '💡 "Serialize" → preorder DFS with # for nulls. "Twitter" → map of userId → (followees, tweets); merge k latest.',
})

// ── Graph-Based Designs (teal) ────────────────────────────────────

export const basicGraphImpl: TaxonomyNode = leaf('basic-graph-impl', 'Basic Graph Implementations', 'teal', {
  template: `${CPP}class Graph {
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
};`,
  problems: [
    { id: 997, title: 'Find the Town Judge', slug: 'find-the-town-judge', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–22: as-is (adj list or degree array for trust relationships).' },
    { id: 0, title: 'Adj List vs Matrix Tradeoffs', slug: 'graph-representation', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Concept', variationCode: '// Adj list: O(V+E) space, fast neighbor iteration. Adj matrix: O(V^2) space, O(1) edge lookup.' },
  ],
  pitfalls: ['❌ Using adjacency matrix for sparse graphs wastes memory (O(V²)).', '❌ Directed vs undirected: add both directions for undirected.'],
  edgeCases: [
    { input: 'graph with no edges', breaks: 'Adj list vector is empty; iteration is fine.' },
    { input: 'self-loop (u == v)', breaks: 'Must handle if graph type allows loops.' },
  ],
  interviewTip: '💡 "Graph representation" → adj list for sparse (most problems), adj matrix for dense / O(1) edge lookup.',
})

export const specializedGraph: TaxonomyNode = leaf('specialized-graph', 'Specialized Graph Structures', 'teal', {
  template: `${CPP}class Twitter {
    unordered_map<int, unordered_set<int>> follows;
    unordered_map<int, vector<pair<int,int>>> tweets;
    int time;
public:
    Twitter(): time(0) {}
    void postTweet(int u, int t) {
        tweets[u].push_back({time++, t});
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
};`,
  problems: [
    { id: 355, title: 'Design Twitter', slug: 'design-twitter', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–30: as-is (user follows set + tweet list; merge k latest by time).' },
    { id: 1136, title: 'Parallel Courses', slug: 'parallel-courses', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: topological sort with level tracking; graph as in-degree array + adj list.', variationCode: 'vector<int> indeg(n+1); vector<vector<int>> g(n+1); for(auto& r:relations){ g[r[0]].push_back(r[1]); indeg[r[1]]++; } queue<int> q; for i..n: if(!indeg[i]) q.push(i); int sem=0, taken=0; while(!q.empty()){ int sz=q.size(); taken+=sz; sem++; while(sz--){ int u=q.front(); q.pop(); for(int v:g[u]) if(--indeg[v]==0) q.push(v); } } return taken==n ? sem : -1;' },
  ],
  pitfalls: ['❌ LC 355: getNewsFeed must include user\'s own tweets if they follow themselves.', '❌ LC 1136: cycle detection — if not all courses taken, return -1.'],
  edgeCases: [
    { input: 'user with no tweets and no followees', breaks: 'getNewsFeed returns empty vector.' },
    { input: 'uncourseable prerequisites (cycle)', breaks: 'Return -1; topological sort detects cycle.' },
  ],
  interviewTip: '💡 "Twitter" → map of userId → (set of followees, list of tweets with timestamps).',
})

// ── Search & Index Structures (teal) ──────────────────────────────

export const searchEngine: TaxonomyNode = leaf('search-engine', 'Search Engine Design', 'teal', {
  template: `${CPP}struct TrieNode {
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
        dfs(curNode, path, res);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
};`,
  problems: [
    { id: 642, title: 'Autocomplete System', slug: 'design-search-autocomplete-system', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 7–36: as-is (trie with hot count; DFS for top 3 results).' },
  ],
  pitfalls: ['❌ After receiving #, reset query string and insert the full sentence with +1 hot count.', '❌ DFS must sort results by -hot (descending) then lexicographic.'],
  edgeCases: [
    { input: 'no results match current prefix', breaks: 'Return empty vector.' },
    { input: 'empty input (# immediately)', breaks: 'Insert empty sentence? Typically ignored.' },
  ],
  interviewTip: '💡 "Autocomplete" → trie of sentences with hot count; DFS from prefix node; sort by hot desc, then lexico.',
})

export const databaseIndex: TaxonomyNode = leaf('database-index', 'Database Index Design', 'teal', {
  template: `${CPP}class SnapshotArray {
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
        auto it = arr[i].upper_bound(s);
        return prev(it)->second;
    }
};`,
  problems: [
    { id: 1146, title: 'Snapshot Array', slug: 'snapshot-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–17: as-is (vector of maps; binary search by snap ID).' },
    { id: 1570, title: 'Dot Product Sparse', slug: 'dot-product-of-two-sparse-vectors', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Line: store (index, value) pairs; two-pointer cross product.', variationCode: 'vector<pair<int,int>> v; SparseVector(vector<int>& a) { for(int i=0;i<a.size();i++) if(a[i]) v.push_back({i,a[i]}); } int dot(SparseVector& o) { int i=0,j=0,sum=0; while(i<v.size()&&j<o.v.size()){ if(v[i].first<o.v[j].first) i++; else if(v[i].first>o.v[j].first) j++; else sum+=v[i++].second*o.v[j++].second; } return sum; }' },
  ],
  pitfalls: ['❌ LC 1146: using linear scan instead of binary search (upper_bound) is O(n) vs O(log n).', '❌ LC 1570: brute-force O(n^2) dot product fails for large sparse vectors.'],
  edgeCases: [
    { input: 'get on snap ID that does not exist', breaks: 'upper_bound returns iterator past it; prev(it) gives correct earlier snap.' },
    { input: 'two sparse vectors with no overlapping indices', breaks: 'Dot product = 0.' },
  ],
  interviewTip: '💡 "Snapshot Array" → vector of maps; upper_bound + prev for O(log k) get. "Sparse dot" → two-pointer on index-value pairs.',
})

// ── File System Design (blue) ─────────────────────────────────────

export const directoryStructure: TaxonomyNode = leaf('directory-structure', 'Directory Structure', 'blue', {
  template: `${CPP}class FileSystem {
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
            if (!cur->children.count(p)) return -1;
            cur = cur->children[p];
        }
        return cur->val;
    }
};`,
  problems: [
    { id: 1166, title: 'Design File System', slug: 'design-file-system', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–39: as-is (trie of path segments with values).' },
    { id: 588, title: 'In-Memory File System', slug: 'design-in-memory-file-system', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: add file content, ls, mkdir; Node stores type + content + sorted children.', variationCode: '// Node: string name, bool isFile, string content, map<string,Node*> children; ls returns sorted keys' },
  ],
  pitfalls: ['❌ LC 1166: createPath must create parent dirs only if they exist; returns false if intermediate missing.', '❌ LC 588: ls on file returns [filename]; ls on dir returns sorted children.'],
  edgeCases: [
    { input: 'createPath with path "/" (root only)', breaks: 'No components to split; root.val = v.' },
    { input: 'get on non-existent path', breaks: 'Returns -1.' },
  ],
  interviewTip: '💡 "File System" → trie of path segments; each node: name, isFile, content, children map.',
})

export const fileOperations: TaxonomyNode = leaf('file-operations', 'File Operations', 'blue', {
  template: `${CPP}class FileSharing {
    int nextId;
    set<int> available;
    unordered_map<int, vector<int>> chunks;
    unordered_map<int, set<int>> chunkOwners;
public:
    FileSharing() : nextId(1) {}
    int join(vector<int> owned) {
        int id = available.empty() ? nextId++ : *available.begin();
        if (!available.empty()) available.erase(available.begin());
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
};`,
  problems: [
    { id: 1500, title: 'Design File Sharing', slug: 'design-file-sharing-system', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–30: as-is (user ↔ chunks mapping; recycling IDs).' },
  ],
  pitfalls: ['❌ Recycled IDs must be smallest available (min-heap or set).', '❌ Leave must clean up chunk ownership maps and recycle user ID.'],
  edgeCases: [
    { input: 'join after all IDs exhausted (int overflow scenario)', breaks: 'Assume IDs fit in int; handle nextId overflow gracefully.' },
    { input: 'request chunk owned by multiple users', breaks: 'Return all owners; add chunk to requesting user.' },
  ],
  interviewTip: '💡 "File Sharing" → map userId→chunks, map chunkId→set of owners; use min-heap for recycled IDs.',
})

// ── Rate Limiters (blue) ──────────────────────────────────────────

export const windowBasedLimiters: TaxonomyNode = leaf('window-based-limiters', 'Window-Based Limiters', 'blue', {
  template: `${CPP}class Logger {
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
        while (!q.empty() && q.front() <= t - 300) q.pop();
        return (int)q.size();
    }
};`,
  problems: [
    { id: 359, title: 'Logger Rate Limiter', slug: 'logger-rate-limiter', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3–9: as-is (hash map of msg → next allowed timestamp).' },
    { id: 362, title: 'Hit Counter', slug: 'design-hit-counter', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 11–21: as-is (queue of timestamps; pop expired).' },
  ],
  pitfalls: ['❌ LC 359: do not store all timestamps per message — just next allowed time is enough.', '❌ LC 362: queue may grow large with high-frequency hits; use bucket array for O(1).'],
  edgeCases: [
    { input: 'messages arriving out of order (timestamp not monotonic)', breaks: 'LC 359 guarantees increasing timestamps; no reordering.' },
    { input: 'getHits within 300s of no hits', breaks: 'Queue empty; returns 0.' },
  ],
  interviewTip: '💡 "Logger" → map message→nextAllowedTimestamp. "HitCounter" → queue of timestamps or circular bucket array.',
})

export const tokenBucket: TaxonomyNode = leaf('token-bucket', 'Token Bucket Limiters', 'blue', {
  template: `${CPP}class TokenBucket {
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
};`,
  problems: [
    { id: 0, title: 'Token Bucket Rate Limiter', slug: 'token-bucket-rate-limiter', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], lineChanges: 'Concept', variationCode: '// Tokens refill at rate r per second; burst limited to capacity. Allow if tokens >= 1.' },
  ],
  pitfalls: ['❌ Refill must be called before every allow() to avoid stale token counts.', '❌ Floating-point drift over time — use double and cap at capacity.'],
  edgeCases: [
    { input: 'long idle period (hours between requests)', breaks: 'Tokens cap at capacity; refill calculation must not overflow.' },
    { input: 'rate = 0 (block all)', breaks: 'Tokens never refill beyond initial; allow() returns false immediately.' },
  ],
  interviewTip: '💡 "Token Bucket" → tokens refill at rate r; allow if tokens >= 1; burst limited to capacity.',
})

// ── Memory Management (blue) ──────────────────────────────────────

export const poolAllocators: TaxonomyNode = leaf('pool-allocators', 'Pool Allocators', 'blue', {
  template: `${CPP}class SeatManager {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.push(i);
    }
    int reserve() {
        int s = pq.top(); pq.pop();
        return s;
    }
    void unreserve(int s) {
        pq.push(s);
    }
};`,
  problems: [
    { id: 1845, title: 'Seat Reservation Manager', slug: 'seat-reservation-manager', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–14: as-is (min-heap pool of available resources).' },
  ],
  pitfalls: ['❌ Pre-filling heap with all resources is O(n); for n = 10^5 this is acceptable.', '❌ Must not push duplicate resources on unreserve if already available.'],
  edgeCases: [
    { input: 'reserve on empty pool', breaks: 'Undefined — callers must not exceed initial pool size.' },
    { input: 'unreserve an already unreserved resource', breaks: 'Duplicate in heap; reserve returns same resource twice.' },
  ],
  interviewTip: '💡 "Pool Allocator" → min-heap of available resource IDs; pop to allocate, push to free.',
})

export const memoryEfficient: TaxonomyNode = leaf('memory-efficient', 'Memory Efficient Structures', 'blue', {
  template: `${CPP}class SparseVector {
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
            else sum += v[i++].second * o.v[j++].second;
        }
        return sum;
    }
};`,
  problems: [
    { id: 1570, title: 'Dot Product of Sparse Vectors', slug: 'dot-product-of-two-sparse-vectors', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–16: as-is (store (index, value) pairs; two-pointer dot product).' },
    { id: 1244, title: 'Leaderboard', slug: 'design-a-leaderboard', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: map of playerId → score; top() uses max-heap or sorted container.', variationCode: 'unordered_map<int,int> scores; void addScore(int i,int s) { scores[i]+=s; } int top(int k) { priority_queue<int> pq; for(auto& [id,s]:scores) pq.push(s); int sum=0; while(k--) { sum+=pq.top(); pq.pop(); } return sum; } void reset(int i) { scores.erase(i); }' },
  ],
  pitfalls: ['❌ LC 1570: skip zero values; two-pointer only works if pairs are sorted by index.', '❌ LC 1244: top(K) can be O(n log n) with heap; faster with quickselect or sorted container.'],
  edgeCases: [
    { input: 'two sparse vectors with no overlapping indices', breaks: 'Dot product = 0.' },
    { input: 'leaderboard reset on player not in map', breaks: 'Erase non-existent key is safe (no-op).' },
  ],
  interviewTip: '💡 "Sparse Vector" → store only non-zero (index, value) pairs; two-pointer for dot product.',
})

// ── Calendar Systems (blue) ───────────────────────────────────────

export const calendarSystems: TaxonomyNode = leaf('calendar-systems', 'Calendar Systems', 'blue', {
  template: `${CPP}class MyCalendar {
    set<pair<int,int>> books;
public:
    bool book(int s, int e) {
        auto it = books.lower_bound({s, e});
        if (it != books.end() && it->first < e) return false;
        if (it != books.begin() && prev(it)->second > s) return false;
        books.insert({s, e});
        return true;
    }
};`,
  problems: [
    { id: 729, title: 'My Calendar I', slug: 'my-calendar-i', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (sorted set; check overlap with neighbors).' },
    { id: 731, title: 'My Calendar II', slug: 'my-calendar-ii', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: maintain primary + double-booking list; check against both.', variationCode: 'vector<pair<int,int>> books, overlaps; bool book(int s,int e){ for(auto& o:overlaps) if(max(s,o.first)<min(e,o.second)) return false; for(auto& b:books) if(max(s,b.first)<min(e,b.second)) overlaps.push_back({max(s,b.first),min(e,b.second)}); books.push_back({s,e}); return true; }' },
    { id: 732, title: 'My Calendar III', slug: 'my-calendar-iii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: difference array map; sweep line for max concurrent bookings.', variationCode: 'map<int,int> diff; int book(int s,int e){ diff[s]++; diff[e]--; int cur=0,k=0; for(auto& [t,c]:diff){ cur+=c; k=max(k,cur); } return k; }' },
  ],
  pitfalls: ['❌ LC 729: lower_bound on start; check overlap with it and prev(it).', '❌ LC 732: difference array (sweep line) is O(n log n) per booking for kth max.'],
  edgeCases: [
    { input: 'book event with s == e (zero duration)', breaks: 'Typically defined as no overlap; check if allowed.' },
    { input: 'book events in non-chronological order', breaks: 'Sorted set handles any order; lower_bound works regardless.' },
  ],
  interviewTip: '💡 "Calendar" → sorted set of intervals; check overlap with lower_bound and prev. Sweep line for max concurrency.',
})

export const resourceBooking: TaxonomyNode = leaf('resource-booking', 'Resource Booking', 'blue', {
  template: `${CPP}class MyCalendarTwo {
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
};`,
  problems: [
    { id: 731, title: 'My Calendar II', slug: 'my-calendar-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–14: as-is (check double-booking list; add new overlaps).' },
    { id: 1229, title: 'Meeting Scheduler', slug: 'meeting-scheduler', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: two-pointer on sorted slots; find intersection of length >= duration.', variationCode: 'sort(s1.begin(),s1.end()); sort(s2.begin(),s2.end()); int i=0,j=0; while(i<s1.size()&&j<s2.size()){ int s=max(s1[i][0],s2[j][0]), e=min(s1[i][1],s2[j][1]); if(e-s>=duration) return {s,s+duration}; if(s1[i][1]<s2[j][1]) i++; else j++; } return {};' },
    { id: 1845, title: 'Seat Reservation Manager', slug: 'seat-reservation-manager', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: min-heap of seat IDs; reserve = pop min, unreserve = push.', variationCode: '// see Pool Allocators leaf for SeatManager template' },
  ],
  pitfalls: ['❌ LC 731: triple booking check — only check if interval forms triple (not double).', '❌ LC 1229: sort both schedules; two-pointer only works if sorted by start time.'],
  edgeCases: [
    { input: 'book event that triple-books existing', breaks: 'Returns false; no modification to state.' },
    { input: 'no overlapping slots in meeting scheduler', breaks: 'Return empty vector.' },
  ],
  interviewTip: '💡 "Calendar II" → maintain primary + double-booking list; reject if overlaps with double list.',
})

// ── Parking System (blue) ─────────────────────────────────────────

export const parkingSystem: TaxonomyNode = leaf('parking-system', 'Design Parking System', 'blue', {
  template: `${CPP}class ParkingSystem {
    int spaces[3];
public:
    ParkingSystem(int b, int m, int s) {
        spaces[0] = b; spaces[1] = m; spaces[2] = s;
    }
    bool addCar(int t) {
        if (spaces[t - 1] > 0) {
            spaces[t - 1]--;
            return true;
        }
        return false;
    }
};`,
  problems: [
    { id: 1603, title: 'Design Parking System', slug: 'design-parking-system', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–13: as-is (counter per car type; decrement on entry).' },
  ],
  pitfalls: ['❌ LC 1603: car type is 1-indexed; array access is t-1.', '❌ Returning false when no space is correct behavior, not an exception.'],
  edgeCases: [
    { input: 'addCar of type beyond 1-3', breaks: 'Index out of bounds — assume input is valid (1, 2, or 3).' },
    { input: 'all spaces full for a type', breaks: 'Returns false repeatedly.' },
  ],
  interviewTip: '💡 "Parking System" → counter array of size 3; decrement on add; return false when full.',
})

// ── Board Games (blue) ────────────────────────────────────────────

export const boardGames: TaxonomyNode = leaf('board-games', 'Board Games', 'blue', {
  template: `${CPP}class TicTacToe {
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
            return p;
        return 0;
    }
};`,
  problems: [
    { id: 348, title: 'Tic-Tac-Toe', slug: 'design-tic-tac-toe', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–15: as-is (row/col/diag/anti counters; O(1) per move).' },
    { id: 1275, title: 'Tic-Tac-Toe Winner', slug: 'find-winner-on-a-tic-tac-toe-game', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: check all rows, cols, diags for 3-in-a-row; return winner or Draw/Pending.', variationCode: 'for i..2{ if(board[i][0]!=\' \'&&board[i][0]==board[i][1]&&board[i][1]==board[i][2]) return board[i][0]; if(board[0][i]!=\' \'&&board[0][i]==board[1][i]&&board[1][i]==board[2][i]) return board[0][i]; } if(board[0][0]!=\' \'&&board[0][0]==board[1][1]&&board[1][1]==board[2][2]) return board[0][0]; if(board[0][2]!=\' \'&&board[0][2]==board[1][1]&&board[1][1]==board[2][0]) return board[0][2]; return moves==9 ? "Draw" : "Pending";' },
  ],
  pitfalls: ['❌ LC 348: use +1/-1 for players; abs == n indicates win.', '❌ LC 1275: must distinguish Draw (board full) vs Pending (moves remain).'],
  edgeCases: [
    { input: 'win on last possible move (board fills exactly on win)', breaks: 'Return winner immediately; not Draw.' },
    { input: 'multiple winning lines from same move (impossible in TicTacToe)', breaks: 'One move can only complete one line at a time.' },
  ],
  interviewTip: '💡 "Tic-Tac-Toe" → row/col/diag/anti counters (+1/-1); win when abs(counter) == n.',
})

export const otherGames: TaxonomyNode = leaf('other-games', 'Other Games', 'blue', {
  template: `${CPP}class SnakeGame {
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
        return idx;
    }
};`,
  problems: [
    { id: 353, title: 'Snake Game', slug: 'design-snake-game', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–30: as-is (deque for body, set for O(1) collision; grow on food).' },
    { id: 1396, title: 'Design Underground System', slug: 'design-underground-system', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: map id → (station, time) for checkIn; map (start, end) → (total, count) for avg.', variationCode: 'unordered_map<int,pair<string,int>> in; unordered_map<string,pair<long long,int>> avg; void checkIn(int id,string s,int t){ in[id]={s,t}; } void checkOut(int id,string e,int t){ auto [s,st]=in[id]; in.erase(id); string key=s+","+e; avg[key].first+=t-st; avg[key].second++; } double getAvg(string s,string e){ auto& p=avg[s+","+e]; return (double)p.first/p.second; }' },
  ],
  pitfalls: ['❌ LC 353: remove tail before checking head collision (since tail moves).', '❌ LC 1396: use pair of (start, end) as key for average calculation.'],
  edgeCases: [
    { input: 'snake hits itself', breaks: 'Return -1; body set tracks occupied cells.' },
    { input: 'underground checkOut without checkIn', breaks: 'Assume valid sequence; handle missing entry gracefully.' },
  ],
  interviewTip: '💡 "Snake" → deque for body, set for collision; remove tail before checking head collision.',
})

// ── User Interface Components (green) ─────────────────────────────

export const browserHistory: TaxonomyNode = leaf('browser-history', 'Browser History', 'green', {
  template: `${CPP}class BrowserHistory {
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
};`,
  problems: [
    { id: 1472, title: 'Design Browser History', slug: 'design-browser-history', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–18: as-is (vector with index; truncate forward on visit).' },
  ],
  pitfalls: ['❌ visit() must truncate forward history (resize to cur + 1) before pushing.', '❌ back/forward must clamp to bounds, not exceed history size.'],
  edgeCases: [
    { input: 'back on first page (index 0)', breaks: 'Stays at index 0.' },
    { input: 'forward at latest page', breaks: 'Stays at last index.' },
  ],
  interviewTip: '💡 "Browser History" → vector + index; visit truncates forward; back/forward clamp to [0, size-1].',
})

export const menuNavigation: TaxonomyNode = leaf('menu-navigation', 'Menu Navigation', 'green', {
  template: `${CPP}class Menu {
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
    void goBack() { if (cur->parent) cur = cur->parent; }
};`,
  problems: [
    { id: 0, title: 'Nested Menu Navigation', slug: 'nested-menu-navigation', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Tree of menu items; each node has label + children; navigate with select/back.' },
  ],
  pitfalls: ['❌ Circular references — menu items must not create cycles.', '❌ Stack-based navigation is simpler than recursive tree if breadcrumbs needed.'],
  edgeCases: [
    { input: 'select on leaf item (no children)', breaks: 'Subsequent getOptions returns empty vector.' },
    { input: 'goBack at root level', breaks: 'Stays at root (parent is nullptr).' },
  ],
  interviewTip: '💡 "Menu Navigation" → tree of items; current node pointer; select moves deeper, goBack moves up.',
})

export const textEditor: TaxonomyNode = leaf('text-editor', 'Text Editors', 'green', {
  template: `${CPP}class TextEditor {
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
        while (n-- && it != text.begin()) s.push_back(*prev(it--));
        reverse(s.begin(), s.end());
        return s;
    }
};`,
  problems: [
    { id: 2296, title: 'Design a Text Editor', slug: 'design-a-text-editor', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–29: as-is (list<char> + cursor iterator; O(n) per operation).' },
  ],
  pitfalls: ['❌ insert before cursor: use list::insert(it, c) which inserts before the given iterator.', '❌ cursorLeft/Right must return up to min(10, chars before cursor).'],
  edgeCases: [
    { input: 'deleteText at beginning of text', breaks: 'Nothing to delete; returns 0.' },
    { input: 'cursorRight at end of text', breaks: 'Stays at text.end(); lastChars() returns empty.' },
  ],
  interviewTip: '💡 "Text Editor" → list<char> + iterator cursor; insert/delete O(1) at cursor position.',
})

export const autocompleteSystem: TaxonomyNode = leaf('autocomplete-system', 'Typeahead & Autocomplete', 'green', {
  template: `${CPP}class AutocompleteSystem {
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
        collect(curNode, path, res);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
};`,
  problems: [
    { id: 642, title: 'Autocomplete System', slug: 'design-search-autocomplete-system', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 6–42: as-is (trie + DFS + sort by hot count).' },
  ],
  pitfalls: ['❌ After #, must reset current query and insert the complete sentence.', '❌ Collect must DFS all descendants and sort by -hot then lexicographic.'],
  edgeCases: [
    { input: 'no suggestions match prefix', breaks: 'curNode becomes nullptr; all subsequent input returns empty until #.' },
    { input: 'consecutive # without text', breaks: 'Inserts empty string — should handle gracefully.' },
  ],
  interviewTip: '💡 "Autocomplete" → trie with hot count; DFS prefix node; return top 3 sorted by hot desc, then lexico.',
})

// ── Creational Patterns (purple) ──────────────────────────────────

export const factoryMethod: TaxonomyNode = leaf('factory-method', 'Factory Method', 'purple', {
  template: `${CPP}class Product {
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
};`,
  problems: [
    { id: 0, title: 'Factory Method Pattern', slug: 'factory-method-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Define Creator base with virtual factoryMethod; subclasses decide concrete type.' },
  ],
  pitfalls: ['❌ Overusing factory method when simple constructor suffices (YAGNI).', '❌ Forgetting virtual destructor in base Product class (undefined behavior).'],
  edgeCases: [
    { input: 'factory method returns nullptr', breaks: 'Caller must handle null product gracefully.' },
    { input: 'product has complex initialization parameters', breaks: 'Factory method signature becomes rigid; consider Builder instead.' },
  ],
  interviewTip: '💡 "Factory Method" → virtual constructor in base class; subclasses override to create specific products.',
})

export const singleton: TaxonomyNode = leaf('singleton', 'Singleton', 'purple', {
  template: `${CPP}class Singleton {
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
};`,
  problems: [
    { id: 0, title: 'Singleton Pattern', slug: 'singleton-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], lineChanges: 'Concept', variationCode: '// Meyer\'s Singleton: static local variable (C++11 thread-safe). Delete copy ctor and assignment.' },
  ],
  pitfalls: ['❌ Non-thread-safe double-checked locking without proper memory barriers.', '❌ Using singleton as a global variable in disguise — testability suffers.'],
  edgeCases: [
    { input: 'singleton used in multithreaded context', breaks: 'Racy initialization without C++11 static or mutex.' },
    { input: 'singleton with resource cleanup on shutdown', breaks: 'Static destruction order may cause use-after-free.' },
  ],
  interviewTip: '💡 "Singleton" → Meyer\'s (static local) for thread-safe C++11; delete copy ctor and assignment operator.',
})

export const builder: TaxonomyNode = leaf('builder', 'Builder Pattern', 'purple', {
  template: `${CPP}class Product {
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
        builder->buildPartC();
        return builder->getResult();
    }
};`,
  problems: [
    { id: 0, title: 'Builder Pattern', slug: 'builder-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Separate construction from representation; Director orchestrates step-by-step building.' },
  ],
  pitfalls: ['❌ Missing parts in builder (incomplete product) — mandate all required steps.', '❌ Not providing a getResult method to extract the built product.'],
  edgeCases: [
    { input: 'builder used without calling all build steps', breaks: 'Product may be partially constructed (invalid state).' },
    { input: 'reusing builder after getResult', breaks: 'Must reset builder state or create new instance.' },
  ],
  interviewTip: '💡 "Builder" → separate construction from representation; Director calls step-by-step methods; getResult returns product.',
})

// ── Structural Patterns (purple) ──────────────────────────────────

export const adapter: TaxonomyNode = leaf('adapter', 'Adapter Pattern', 'purple', {
  template: `${CPP}class Target {
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
};`,
  problems: [
    { id: 0, title: 'Adapter Pattern', slug: 'adapter-pattern', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Wraps Adaptee to conform to Target interface; translates calls.' },
  ],
  pitfalls: ['❌ Object adapter vs class adapter (multiple inheritance) — prefer object adapter.', '❌ Overusing adapter when refactoring the Adaptee would be cleaner.'],
  edgeCases: [
    { input: 'adaptee is nullptr', breaks: 'Must guard against null pointer dereference.' },
    { input: 'adaptee interface changes', breaks: 'Adapter must be updated to match new interface.' },
  ],
  interviewTip: '💡 "Adapter" → wraps an incompatible interface into the target interface the client expects.',
})

export const decorator: TaxonomyNode = leaf('decorator', 'Decorator Pattern', 'purple', {
  template: `${CPP}class Component {
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
};`,
  problems: [
    { id: 0, title: 'Decorator Pattern', slug: 'decorator-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Wraps a component to add behavior dynamically; stackable wrappers.' },
  ],
  pitfalls: ['❌ Removing decorators at runtime is tricky — need reverse chain traversal.', '❌ Too many small decorator classes can overwhelm design; use with restraint.'],
  edgeCases: [
    { input: 'decorating a null component', breaks: 'Null dereference in base operation().' },
    { input: 'deeply nested decorators (100+ layers)', breaks: 'toString becomes O(n) with deep recursion.' },
  ],
  interviewTip: '💡 "Decorator" → wrap component with same interface; add behavior before/after delegating to wrapped component.',
})

export const composite: TaxonomyNode = leaf('composite', 'Composite Pattern', 'purple', {
  template: `${CPP}class Component {
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
};`,
  problems: [
    { id: 0, title: 'Composite Pattern', slug: 'composite-pattern', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Treat individual objects and compositions uniformly; tree structure.' },
  ],
  pitfalls: ['❌ Leaf nodes should throw or no-op on add/remove (design by contract).', '❌ Removing child by pointer — use remove-erase idiom or smart pointers.'],
  edgeCases: [
    { input: 'composite with no children', breaks: 'operation() loop is a no-op (empty iteration).' },
    { input: 'circular composition (A contains B contains A)', breaks: 'Infinite recursion in operation().' },
  ],
  interviewTip: '💡 "Composite" → tree structure where Leaf and Composite share the same interface; operations recurse over children.',
})

// ── Behavioral Patterns (purple) ──────────────────────────────────

export const iteratorPattern: TaxonomyNode = leaf('iterator-pattern', 'Iterator Pattern', 'purple', {
  template: `${CPP}template<typename T>
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
};`,
  problems: [
    { id: 284, title: 'Peeking Iterator', slug: 'peeking-iterator', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 18–32: as-is (cache next value for O(1) peek).' },
    { id: 341, title: 'Flatten Nested Iterator', slug: 'flatten-nested-list-iterator', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: stack of iterators; lazy DFS flattening.', variationCode: '// see Multi-level Data Structures leaf for NestedIterator' },
  ],
  pitfalls: ['❌ LC 284: must cache first value in constructor; advance on next().', '❌ LC 341: empty inner lists must be skipped; stack may have multiple empty iterators.'],
  edgeCases: [
    { input: 'peeking on empty iterator', breaks: 'hasNext returns false before next(); peek would be undefined.' },
    { input: 'deeply nested empty structures', breaks: 'All levels must be skipped to find next element.' },
  ],
  interviewTip: '💡 "Peeking Iterator" → cache next value; peek returns cached, next advances. "Nested Iterator" → DFS via stack of iterators.',
})

export const observer: TaxonomyNode = leaf('observer', 'Observer Pattern', 'purple', {
  template: `${CPP}class Observer {
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
};`,
  problems: [
    { id: 0, title: 'Observer Pattern', slug: 'observer-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], lineChanges: 'Concept', variationCode: '// Subject maintains list of observers; notify() broadcasts to all attached observers.' },
  ],
  pitfalls: ['❌ Observer holds reference to Subject that may be destroyed (dangling pointer).', '❌ Notification loops if observer modifies subject during update (reentrancy).'],
  edgeCases: [
    { input: 'detach observer during notification', breaks: 'Use copy of list for iteration; defer removals.' },
    { input: 'no observers attached', breaks: 'notify() is a no-op (empty loop).' },
  ],
  interviewTip: '💡 "Observer" → Subject maintains observer list; notify() broadcasts update() to all; common in event-driven systems.',
})

export const strategy: TaxonomyNode = leaf('strategy', 'Strategy Pattern', 'purple', {
  template: `${CPP}class Strategy {
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
};`,
  problems: [
    { id: 0, title: 'Strategy Pattern', slug: 'strategy-pattern', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], lineChanges: 'Concept', variationCode: '// Define family of algorithms; Context delegates to strategy at runtime.' },
  ],
  pitfalls: ['❌ Strategy objects must be stateless or carefully manage shared state.', '❌ Overusing strategy for simple conditional logic (premature abstraction).'],
  edgeCases: [
    { input: 'strategy is nullptr in context', breaks: 'Undefined behavior when executeStrategy is called.' },
    { input: 'strategy with side effects on shared data', breaks: 'State leaks between different contexts using same strategy instance.' },
  ],
  interviewTip: '💡 "Strategy" → family of interchangeable algorithms; Context delegates to a strategy interface, swappable at runtime.',
})
