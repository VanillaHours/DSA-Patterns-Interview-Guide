import { leaf } from './helpers'

const CPP = `#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

`

// ── Basic Trie Operations Leaves ──────────────────────────────────

export const charByCharLeaf = leaf('char-by-char-insert', 'Char-by-Char Insertion', 'lime', {
  template: `${CPP}class Trie {
    struct Node {
        Node* next[26];
        bool isEnd;
        Node() : isEnd(false) { fill(begin(next), end(next), nullptr); }
    };
    Node* root;
public:
    Trie() : root(new Node()) {}
    void insert(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) cur->next[i] = new Node();
            cur = cur->next[i];
        }
        cur->isEnd = true;
    }
    bool search(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return cur->isEnd;
    }
    bool startsWith(string prefix) {
        Node* cur = root;
        for (char c : prefix) {
            int i = c - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return true;
    }
};`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-37: as-is (standard trie with insert/search/startsWith).' },
    { id: 1804, title: 'Implement Trie II', slug: 'implement-trie-ii-prefix-tree', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Add wordCount and prefixCount to Node; increment on insert; decrement on erase.', variationCode: `struct Node { Node* next[26]; int wordCount = 0, prefixCount = 0; Node() { fill(begin(next), end(next), nullptr); } };` },
  ],
  pitfalls: ['❌ Forgetting to mark isEnd after insert — search returns false for inserted words.', '❌ Not initializing children array to nullptr — leads to undefined behavior.'],
  edgeCases: [{ input: 'empty string', breaks: 'should be handled as valid word if inserted' }, { input: 'insert same word twice', breaks: 'Trie II needs count tracking' }],
  interviewTip: '💡 Standard trie: each node has 26 children + isEnd flag. Insert = walk + create, Search = walk + check isEnd.',
})

export const batchInsertionLeaf = leaf('batch-insertion', 'Batch Insertion', 'lime', {
  template: `${CPP}class MapSum {
    struct Node {
        Node* next[26];
        int val;
        Node() : val(0) { fill(begin(next), end(next), nullptr); }
    };
    Node* root;
    unordered_map<string,int> map;
public:
    MapSum() : root(new Node()) {}
    void insert(string key, int v) {
        int delta = v - map[key];
        map[key] = v;
        Node* cur = root;
        for (char c : key) {
            int i = c - 'a';
            if (!cur->next[i]) cur->next[i] = new Node();
            cur = cur->next[i];
            cur->val += delta;
        }
    }
    int sum(string prefix) {
        Node* cur = root;
        for (char c : prefix) {
            int i = c - 'a';
            if (!cur->next[i]) return 0;
            cur = cur->next[i];
        }
        return cur->val;
    }
};`,
  problems: [
    { id: 720, title: 'Longest Word', slug: 'longest-word-in-dictionary', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Insert all words into trie with isEnd; DFS/BFS to find longest word where every prefix is a word.', variationCode: 'same insert as 208; then BFS: queue<Node*>, track depth and word; return longest at deepest level that has isEnd on every prefix.' },
    { id: 677, title: 'Map Sum Pairs', slug: 'map-sum-pairs', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Lines 1-32: as-is (store delta on insert; prefix sum via node val).' },
  ],
  pitfalls: ['❌ Map Sum: not tracking delta on re-insert — value incorrectly accumulates.', '❌ Longest Word: not checking that all prefixes are valid words (isEnd on every ancestor).'],
  edgeCases: [{ input: 'empty dictionary', breaks: 'return empty string' }, { input: 'duplicate key with different value', breaks: 'delta handles the diff' }],
  interviewTip: '💡 Map Sum: trie with value at each node + hash map for delta tracking. Longest Word: BFS/DFS with prefix validation.',
})

export const specializedTrieLeaf = leaf('specialized-trie-structures', 'Specialized Trie Structures', 'lime', {
  template: `${CPP}class MagicDictionary {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    MagicDictionary() : root(new Node()) {}
    void buildDict(vector<string> dict) {
        for (auto& w : dict) {
            Node* cur = root;
            for (char c : w) {
                int i = c - 'a';
                if (!cur->next[i]) cur->next[i] = new Node();
                cur = cur->next[i];
            }
            cur->isEnd = true;
        }
    }
    bool search(string word) {
        Node* cur = root;
        for (int j = 0; j < (int)word.size(); j++) {
            for (int k = 0; k < 26; k++) {
                if (word[j] - 'a' == k) continue;
                if (!cur->next[k]) continue;
                Node* nxt = cur->next[word[j] - 'a'];
                cur = cur->next[k];
                for (int l = j + 1; l < (int)word.size(); l++) {
                    int i = word[l] - 'a';
                    if (!cur->next[i]) { cur = nullptr; break; }
                    cur = cur->next[i];
                }
                if (cur && cur->isEnd) return true;
                cur = nxt;
            }
        }
        return false;
    }
};`,
  problems: [
    { id: 648, title: 'Replace Words', slug: 'replace-words', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Insert roots into trie; for each word, replace with shortest prefix root found in trie.', variationCode: `string replaceWords(vector<string>& dict, string s) {
    Trie t; for (auto& r : dict) t.insert(r);
    string ans, word; istringstream iss(s);
    while (iss >> word) {
        string prefix; Node* cur = t.root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) break;
            cur = cur->next[i]; prefix += c;
            if (cur->isEnd) break;
        }
        ans += (cur->isEnd ? prefix : word) + " ";
    }
    if (!ans.empty()) ans.pop_back(); return ans;
}` },
    { id: 676, title: 'Magic Dictionary', slug: 'implement-magic-dictionary', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-35: as-is (build trie; search with exactly one character changed).' },
  ],
  pitfalls: ['❌ Replace Words: forgetting space-delimited output — adding trailing space.', '❌ Magic Dictionary: using BFS/DFS incorrectly when exactly one char mismatch is required.'],
  edgeCases: [{ input: 'sentence with one word', breaks: 'just replace that word' }, { input: 'no match in dictionary', breaks: 'return original word unchanged' }],
  interviewTip: '💡 Replace Words: trie + shortest root replace. Magic Dictionary: iterate each position, try all 25 other chars.',
})

export const exactMatchLeaf = leaf('exact-match-search', 'Exact Match Search', 'teal', {
  template: `${CPP}class Trie {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    Trie() : root(new Node()) {}
    void insert(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) cur->next[i] = new Node();
            cur = cur->next[i];
        }
        cur->isEnd = true;
    }
    bool search(string word) {
        Node* cur = root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return cur->isEnd;
    }
};`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'search() method: walk children; return cur->isEnd at the end.' },
    { id: 1804, title: 'Trie II Count', slug: 'implement-trie-ii-prefix-tree', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'countWordsEqualTo: walk then return cur->wordCount instead of isEnd.', variationCode: `int countWordsEqualTo(string w) {
    Node* cur = root;
    for (char c : w) { int i = c - 'a'; if (!cur->next[i]) return 0; cur = cur->next[i]; }
    return cur->wordCount;
}` },
  ],
  pitfalls: ['❌ Returning true before reaching the end of the word — premature match.', '❌ Not handling duplicate inserts in count-based trie.'],
  edgeCases: [{ input: 'search in empty trie', breaks: 'return false/0' }, { input: 'search for prefix that exists but not as full word', breaks: 'isEnd false, return false' }],
  interviewTip: '💡 Trie search always walks char-by-char; exact match checks cur->isEnd at the last character.',
})

export const prefixSearchLeaf = leaf('prefix-search', 'Prefix Search', 'teal', {
  template: `${CPP}bool startsWith(string prefix) {
    Node* cur = root;
    for (char c : prefix) {
        int i = c - 'a';
        if (!cur->next[i]) return false;
        cur = cur->next[i];
    }
    return true;
}`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'startsWith: walk prefix chars; return true if all found (no isEnd check).' },
    { id: 1804, title: 'Trie II Prefix', slug: 'implement-trie-ii-prefix-tree', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'countWordsStartingWith: walk prefix, return cur->prefixCount.', variationCode: `int countWordsStartingWith(string p) {
    Node* cur = root;
    for (char c : p) { int i = c - 'a'; if (!cur->next[i]) return 0; cur = cur->next[i]; }
    return cur->prefixCount;
}` },
  ],
  pitfalls: ['❌ Using isEnd check in startsWith — by definition prefix only needs path to exist, not full word.', '❌ Case sensitivity: mixing uppercase/lowercase in ASCII-only trie.'],
  edgeCases: [{ input: 'empty prefix', breaks: 'all words start with empty prefix, return true' }, { input: 'prefix longer than any word', breaks: 'walk fails early, return false' }],
  interviewTip: '💡 Prefix search only needs the path to exist — no isEnd check required.',
})

export const wildcardSearchLeaf = leaf('wildcard-search', 'Wildcard Search', 'teal', {
  template: `${CPP}class WordDictionary {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    bool dfs(string& w, int pos, Node* cur) {
        if (pos == (int)w.size()) return cur->isEnd;
        if (w[pos] != '.') {
            int i = w[pos] - 'a';
            return cur->next[i] && dfs(w, pos + 1, cur->next[i]);
        }
        for (int i = 0; i < 26; i++)
            if (cur->next[i] && dfs(w, pos + 1, cur->next[i]))
                return true;
        return false;
    }
public:
    WordDictionary() : root(new Node()) {}
    void addWord(string w) {
        Node* cur = root;
        for (char c : w) {
            int i = c - 'a';
            if (!cur->next[i]) cur->next[i] = new Node();
            cur = cur->next[i];
        }
        cur->isEnd = true;
    }
    bool search(string w) { return dfs(w, 0, root); }
};`,
  problems: [
    { id: 211, title: 'Add and Search Word', slug: 'design-add-and-search-words-data-structure', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2-24: as-is (DFS search with . wildcard branching over all 26 children).' },
    { id: 1023, title: 'Camelcase Matching', slug: 'camelcase-matching', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Use trie of patterns or two-pointer: scan query, match uppercase in pattern, skip lowercase in query.', variationCode: `vector<bool> camelMatch(vector<string>& qs, string p) {
    vector<bool> ans;
    for (auto& q : qs) {
        int i = 0, j = 0;
        while (i < q.size() && j < p.size()) {
            if (q[i] == p[j]) { i++; j++; }
            else if (isupper(q[i])) break;
            else i++;
        }
        ans.push_back(j == p.size() && none_of(q.begin()+i, q.end(), ::isupper));
    }
    return ans;
}` },
  ],
  pitfalls: ['❌ Wildcard: BFS instead of DFS — can work but DFS is more natural.', '❌ Camelcase: forgetting to check remaining query chars for unexpected uppercase letters.'],
  edgeCases: [{ input: 'all dots', breaks: 'DFS explores exponentially but bounded by 26^len' }, { input: 'empty string', breaks: 'return root->isEnd' }],
  interviewTip: '💡 Wildcard trie: DFS with . branching to all 26 children. Camelcase: skip lowercase, match uppercase against pattern.',
})

export const singleWordDeletionLeaf = leaf('single-word-deletion', 'Single Word Deletion', 'pink', {
  template: `${CPP}void erase(string w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->next[i]) return;
        cur = cur->next[i];
        cur->prefixCount--;
    }
    cur->wordCount--;
}`,
  problems: [
    { id: 1804, title: 'Trie II Erase', slug: 'implement-trie-ii-prefix-tree', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Decrement prefixCount on each node along path; decrement wordCount on terminal node.' },
  ],
  pitfalls: ['❌ Physically deleting nodes from trie — not needed unless memory-critical (just decrement counts).', '❌ Forgetting to check if word exists before erasing — prefix decrement can go negative.'],
  edgeCases: [{ input: 'erase word not in trie', breaks: 'should be no-op' }, { input: 'erase same word twice', breaks: 'count should track duplicates separately' }],
  interviewTip: '💡 Trie deletion: decrement prefixCount on each node; decrement wordCount at terminal. No physical node removal needed.',
})

export const trieModificationLeaf = leaf('trie-modification', 'Trie Modification', 'pink', {
  template: `${CPP}class WordFilter {
    struct Node { Node* next[27]; int idx; Node() : idx(-1) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    WordFilter(vector<string>& words) : root(new Node()) {
        for (int k = 0; k < (int)words.size(); k++) {
            string w = words[k] + '{';
            for (int i = 0; i < (int)w.size(); i++) {
                Node* cur = root;
                cur->idx = k;
                for (int j = i; j < 2 * (int)w.size() - 1; j++) {
                    int c = w[j % w.size()] - 'a';
                    if (!cur->next[c]) cur->next[c] = new Node();
                    cur = cur->next[c];
                    cur->idx = k;
                }
            }
        }
    }
    int f(string pref, string suff) {
        string key = suff + '{' + pref;
        Node* cur = root;
        for (char c : key) {
            int i = c - 'a';
            if (!cur->next[i]) return -1;
            cur = cur->next[i];
        }
        return cur->idx;
    }
};`,
  problems: [
    { id: 677, title: 'Map Sum Pairs', slug: 'map-sum-pairs', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Modify value directly: update delta on insert; store cumulative sum at each node.' },
    { id: 745, title: 'Prefix and Suffix Search', slug: 'prefix-and-suffix-search', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-34: as-is (insert word+suffix{+prefix combinations; store max index at each node).' },
  ],
  pitfalls: ['❌ Prefix/Suffix Search: not inserting all suffix+prefix combos — O(n * L^2) time but fastest lookup.', '❌ Map Sum: memory leak if not delta-tracking values correctly on re-insert.'],
  edgeCases: [{ input: 'f with no matching prefix+suffix', breaks: 'return -1' }, { input: 'duplicate words at different indices', breaks: 'store max index' }],
  interviewTip: '💡 Prefix/Suffix Search: encode as suffix + { + prefix in a single trie. Map Sum: cumulative value per node with delta.',
})

export const triePruningLeaf = leaf('trie-pruning', 'Trie Pruning', 'pink', {
  template: `${CPP}class StreamChecker {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    vector<Node*> active;
public:
    StreamChecker(vector<string>& words) : root(new Node()) {
        for (auto& w : words) {
            Node* cur = root;
            for (char c : w) { int i = c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
            cur->isEnd = true;
        }
    }
    bool query(char letter) {
        int i = letter - 'a';
        vector<Node*> nxt = {root};
        bool found = false;
        for (auto* cur : active) {
            if (cur->next[i]) {
                if (cur->next[i]->isEnd) found = true;
                nxt.push_back(cur->next[i]);
            }
        }
        if (root->next[i]) { nxt.push_back(root->next[i]); if (root->next[i]->isEnd) found = true; }
        active = move(nxt);
        return found;
    }
};`,
  problems: [
    { id: 1032, title: 'Stream of Characters', slug: 'stream-of-characters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-28: as-is (reverse words, insert into trie; track active nodes; query traverses active frontier).' },
  ],
  pitfalls: ['❌ Stream of Characters: not pruning active nodes — memory grows unbounded with stream length.', '❌ Building trie on original words vs reversed words — suffix matching requires reversal.'],
  edgeCases: [{ input: 'empty stream', breaks: 'no active nodes, no matches' }, { input: 'single char words', breaks: 'query returns true immediately' }],
  interviewTip: '💡 Stream of Characters: insert words reversed; maintain active node set; each query advances active frontier.',
})

export const dfsTraversalLeaf = leaf('dfs-traversal', 'DFS Traversal', 'blue', {
  template: `${CPP}string longestWord(vector<string>& words) {
    Trie t;
    for (auto& w : words) t.insert(w);
    string ans;
    function<void(Node*,string)> dfs = [&](Node* cur, string s) {
        if (cur->isEnd && (s.size() > ans.size() || (s.size() == ans.size() && s < ans))) ans = s;
        for (int i = 0; i < 26; i++) {
            if (cur->next[i] && cur->next[i]->isEnd)
                dfs(cur->next[i], s + char('a' + i));
        }
    };
    dfs(t.root, "");
    return ans;
}`,
  problems: [
    { id: 720, title: 'Longest Word', slug: 'longest-word-in-dictionary', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'DFS: only explore nodes where isEnd is true (every prefix must be a word).' },
    { id: 1268, title: 'Search Suggestions', slug: 'search-suggestions-system', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'DFS from prefix node: collect up to 3 lexicographically smallest words.', variationCode: `vector<string> dfs(Node* cur, string& pref) {
    vector<string> res;
    if (cur->isEnd) res.push_back(pref);
    for (int i = 0; i < 26 && (int)res.size() < 3; i++)
        if (cur->next[i]) { pref.push_back('a'+i); auto sub = dfs(cur->next[i], pref); res.insert(res.end(), sub.begin(), sub.end()); pref.pop_back(); }
    return res;
}` },
  ],
  pitfalls: ['❌ DFS on trie: forgetting to pop_back after recursion — accumulating wrong characters.', '❌ Longest Word: not enforcing that every prefix must be a valid word (isEnd on all ancestors).'],
  edgeCases: [{ input: 'no words found', breaks: 'return empty string / empty list' }, { input: 'single character words', breaks: 'DFS finds them immediately' }],
  interviewTip: '💡 Trie DFS: visit children in alphabetical order for lexicographic output; track prefix string as we go.',
})

export const levelOrderTraversalLeaf = leaf('level-order-traversal', 'Level-Order Traversal', 'blue', {
  template: `${CPP}void bfsTraverse(Node* root) {
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        while (sz--) {
            Node* cur = q.front(); q.pop();
            for (int i = 0; i < 26; i++)
                if (cur->next[i]) q.push(cur->next[i]);
        }
    }
}`,
  problems: [],
  pitfalls: ['❌ Not processing nodes level-by-level, mixing depths in level-order problem.', '❌ Forgetting to track depth separately if needed.'],
  edgeCases: [{ input: 'empty trie (root only)', breaks: 'queue has one element' }],
  interviewTip: '💡 Trie BFS: level-order uses queue; process level-by-level for width/depth analysis.',
})

export const lexicographicTraversalLeaf = leaf('lexicographic-traversal', 'Lexicographic Traversal', 'blue', {
  template: `${CPP}class AutocompleteSystem {
    struct Node { Node* next[27]; int hot; Node() : hot(0) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    string cur;
    void dfs(Node* n, string& s, vector<pair<int,string>>& res) {
        if (n->hot) res.push_back({-n->hot, s});
        for (int i = 0; i < 27; i++)
            if (n->next[i]) { s.push_back(i == 26 ? ' ' : 'a' + i); dfs(n->next[i], s, res); s.pop_back(); }
    }
public:
    AutocompleteSystem(vector<string>& s, vector<int>& t) : root(new Node()) {
        for (int i = 0; i < (int)s.size(); i++) {
            insert(s[i], t[i]);
        }
    }
    void insert(string& w, int hot) {
        Node* cur = root;
        for (char c : w) { int i = c == ' ' ? 26 : c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
        cur->hot = hot;
    }
    vector<string> input(char c) {
        if (c == '#') { insert(cur, 1); cur.clear(); return {}; }
        cur += c;
        Node* n = root;
        for (char ch : cur) { int i = ch == ' ' ? 26 : ch - 'a'; if (!n->next[i]) return {}; n = n->next[i]; }
        vector<pair<int,string>> res;
        string tmp = cur;
        dfs(n, tmp, res);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
};`,
  problems: [
    { id: 1268, title: 'Search Suggestions', slug: 'search-suggestions-system', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'DFS from prefix node in alphabetical order; collect 3 results max.' },
    { id: 642, title: 'Design Autocomplete', slug: 'design-search-autocomplete-system', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Lines 1-42: as-is (trie with hot/cold scores; DFS collect top 3 by -hot, then lexicographic).' },
  ],
  pitfalls: ['❌ Autocomplete: not handling spaces in sentences — need 27th child for space character.', '❌ Search Suggestions: collecting more than 3 results — early termination at 3.'],
  edgeCases: [{ input: 'no matches for prefix', breaks: 'return empty list' }, { input: 'empty input (just #)', breaks: 'insert sentence, clear buffer' }],
  interviewTip: '💡 Lexicographic traversal: DFS children in alphabetical order (0..25); for autocomplete, also sort by frequency (hotness).',
})

// ── Trie Applications Leaves ─────────────────────────────────────

export const wordLookupLeaf = leaf('word-lookup', 'Word Lookup', 'green', {
  template: `${CPP}class Trie {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    Trie() : root(new Node()) {}
    void insert(string word) {
        Node* cur = root;
        for (char c : word) { int i = c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
        cur->isEnd = true;
    }
    bool search(string word) {
        Node* cur = root;
        for (char c : word) { int i = c - 'a'; if (!cur->next[i]) return false; cur = cur->next[i]; }
        return cur->isEnd;
    }
    bool startsWith(string prefix) {
        Node* cur = root;
        for (char c : prefix) { int i = c - 'a'; if (!cur->next[i]) return false; cur = cur->next[i]; }
        return true;
    }
};`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Standard trie with search/startsWith for dictionary lookup.' },
    { id: 1268, title: 'Search Suggestions', slug: 'search-suggestions-system', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'For each prefix typed, traverse to node; DFS/backtracking to get 3 lexicographically smallest words.' },
  ],
  pitfalls: ['❌ Using hash set instead of trie when prefix search is needed — hash set cannot do startsWith.', '❌ Not sharing prefix storage across words — trie saves memory on common prefixes.'],
  edgeCases: [{ input: 'word not in dictionary', breaks: 'return false' }, { input: 'search with empty string', breaks: 'root->isEnd should be false unless empty string inserted' }],
  interviewTip: '💡 Trie dictionary: insert all words once; O(L) per search/startsWith. Preferred over hash set when prefix queries are needed.',
})

export const wordReplacementLeaf = leaf('word-replacement', 'Word Replacement', 'green', {
  template: `${CPP}string replaceWords(vector<string>& dict, string sentence) {
    Trie t;
    for (auto& r : dict) t.insert(r);
    string ans, word;
    istringstream iss(sentence);
    while (iss >> word) {
        string prefix;
        Node* cur = t.root;
        for (char c : word) {
            int i = c - 'a';
            if (!cur->next[i]) break;
            cur = cur->next[i]; prefix += c;
            if (cur->isEnd) break;
        }
        ans += (cur->isEnd ? prefix : word) + " ";
    }
    if (!ans.empty()) ans.pop_back();
    return ans;
}`,
  problems: [
    { id: 648, title: 'Replace Words', slug: 'replace-words', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-24: as-is (insert roots; for each word, find shortest matching root in trie; replace).' },
    { id: 1858, title: 'Longest Word With All Prefixes', slug: 'longest-word-with-all-prefixes', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Insert all words; DFS/BFS to find longest word where every prefix node has isEnd=true.', variationCode: `string ans;
    function<void(Node*,string)> dfs = [&](Node* cur, string s) {
        if (!cur->isEnd) return;
        if (s.size() > ans.size() || (s.size() == ans.size() && s < ans)) ans = s;
        for (int i = 0; i < 26; i++) if (cur->next[i]) dfs(cur->next[i], s + char('a' + i));
    };
    dfs(t.root, ""); return ans;` },
  ],
  pitfalls: ['❌ Replace Words: not using shortest root — using the first matched root (which is same as shortest in trie).', '❌ Longest Word All Prefixes: not enforcing isEnd on every prefix ancestor.'],
  edgeCases: [{ input: 'empty dictionary', breaks: 'all words stay unchanged' }, { input: 'sentence has no match', breaks: 'append original word unchanged' }],
  interviewTip: '💡 Replace Words: trie of roots; for each word, walk until isEnd found => shortest root replacement.',
})

export const dictFeatureLeaf = leaf('dict-feature', 'Dictionary Feature', 'green', {
  template: `${CPP}class WordDictionary {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    bool dfs(string& w, int pos, Node* cur) {
        if (pos == (int)w.size()) return cur->isEnd;
        if (w[pos] != '.') {
            int i = w[pos] - 'a';
            return cur->next[i] && dfs(w, pos + 1, cur->next[i]);
        }
        for (int i = 0; i < 26; i++)
            if (cur->next[i] && dfs(w, pos + 1, cur->next[i]))
                return true;
        return false;
    }
public:
    WordDictionary() : root(new Node()) {}
    void addWord(string w) {
        Node* cur = root;
        for (char c : w) { int i = c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
        cur->isEnd = true;
    }
    bool search(string w) { return dfs(w, 0, root); }
};`,
  problems: [
    { id: 211, title: 'Add and Search', slug: 'design-add-and-search-words-data-structure', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Trie with wildcard DFS: . matches all 26 children at that position.' },
    { id: 642, title: 'Design Autocomplete', slug: 'design-search-autocomplete-system', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Trie with hot counts; on each char input, DFS from prefix node, collect top 3 by hot + lexicographic.' },
  ],
  pitfalls: ['❌ Wildcard: BFS can work but DFS is simpler and bounded by 26^len worst-case.', '❌ Autocomplete: not persisting the sentence buffer across inputs.'],
  edgeCases: [{ input: 'wildcard only (all dots)', breaks: 'DFS explores full trie' }, { input: 'input history empty after #', breaks: 'buffer cleared, return empty' }],
  interviewTip: '💡 Wildcard dictionary: standard trie + DFS with . branching. Autocomplete: trie + hot count + DFS collect top 3.',
})

export const prefixCountingLeaf = leaf('prefix-counting', 'Prefix Counting', 'teal', {
  template: `${CPP}class Trie {
    struct Node { Node* next[26]; int wordCount, prefixCount; Node() : wordCount(0), prefixCount(0) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    Trie() : root(new Node()) {}
    void insert(string w) {
        Node* cur = root;
        for (char c : w) {
            int i = c - 'a';
            if (!cur->next[i]) cur->next[i] = new Node();
            cur = cur->next[i];
            cur->prefixCount++;
        }
        cur->wordCount++;
    }
    int countWordsEqualTo(string w) {
        Node* cur = root;
        for (char c : w) { int i = c - 'a'; if (!cur->next[i]) return 0; cur = cur->next[i]; }
        return cur->wordCount;
    }
    int countWordsStartingWith(string p) {
        Node* cur = root;
        for (char c : p) { int i = c - 'a'; if (!cur->next[i]) return 0; cur = cur->next[i]; }
        return cur->prefixCount;
    }
    void erase(string w) {
        Node* cur = root;
        for (char c : w) { int i = c - 'a'; if (!cur->next[i]) return; cur = cur->next[i]; cur->prefixCount--; }
        cur->wordCount--;
    }
};`,
  problems: [
    { id: 677, title: 'Map Sum Pairs', slug: 'map-sum-pairs', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Map sum not count: store cumulative val at each node; delta on re-insert.' },
    { id: 1804, title: 'Trie II Counting', slug: 'implement-trie-ii-prefix-tree', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 1-37: as-is (wordCount + prefixCount per node; insert increments both; erase decrements).' },
  ],
  pitfalls: ['❌ Confusing wordCount vs prefixCount: wordCount only at terminal, prefixCount on every node along the path.', '❌ Not incrementing prefixCount on root or first character node.'],
  edgeCases: [{ input: 'count before any insert', breaks: 'return 0' }, { input: 'insert same word then erase', breaks: 'wordCount goes to 0, prefixCount also decremented' }],
  interviewTip: '💡 Trie II: prefixCount increments on EVERY node along path; wordCount only at terminal node.',
})

export const prefixMatchingLeaf = leaf('prefix-matching', 'Prefix Matching', 'teal', {
  template: `${CPP}vector<bool> camelMatch(vector<string>& queries, string pattern) {
    vector<bool> ans;
    for (auto& q : queries) {
        int i = 0, j = 0;
        while (i < (int)q.size() && j < (int)pattern.size()) {
            if (q[i] == pattern[j]) { i++; j++; }
            else if (isupper(q[i])) break;
            else i++;
        }
        bool match = (j == (int)pattern.size());
        while (i < (int)q.size() && match) {
            if (isupper(q[i])) match = false;
            else i++;
        }
        ans.push_back(match);
    }
    return ans;
}`,
  problems: [
    { id: 1023, title: 'Camelcase Matching', slug: 'camelcase-matching', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-20: as-is (two-pointer: match pattern uppercase; skip query lowercase; fail on unexpected uppercase).' },
    { id: 745, title: 'Prefix and Suffix Search', slug: 'prefix-and-suffix-search', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Insert suffix + { + prefix combos into trie; search by walking that key.', variationCode: 'for each word: for i 0..L-1: insert(word.substr(i) + "{" + word); search: walk(suff + "{" + pref);' },
  ],
  pitfalls: ['❌ Camelcase: forgetting that remaining query chars must not contain uppercase.', '❌ Prefix/Suffix Search: building separate tries for prefix and suffix instead of combining.'],
  edgeCases: [{ input: 'pattern longer than query', breaks: 'return false' }, { input: 'empty pattern', breaks: 'match if query has no uppercase' }],
  interviewTip: '💡 Camelcase: match pattern uppercase against query uppercase; skip lowercase. Prefix/Suffix Search: combine into one key.',
})

export const longestCommonPrefixLeaf = leaf('longest-common-prefix', 'Longest Common Prefix', 'teal', {
  template: `${CPP}string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    for (int i = 0; i < (int)strs[0].size(); i++) {
        char c = strs[0][i];
        for (int j = 1; j < (int)strs.size(); j++)
            if (i >= (int)strs[j].size() || strs[j][i] != c)
                return strs[0].substr(0, i);
    }
    return strs[0];
}`,
  problems: [
    { id: 14, title: 'Longest Common Prefix', slug: 'longest-common-prefix', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Vertical scan: compare char by char across all strings; return prefix when mismatch or end found.' },
  ],
  pitfalls: ['❌ Horizontal scan (compare pairwise) is O(S) but vertical is O(S) too — vertical exits early on short strings.', '❌ Trie approach: build trie of all strings, find deepest node with single child. Both O(S) time.'],
  edgeCases: [{ input: 'empty array', breaks: 'return ""' }, { input: 'single string', breaks: 'return that string' }],
  interviewTip: '💡 LCP: vertical scan — compare char by char across all strings; trie approach: deepest node with single child.',
})

export const basicAutocompleteLeaf = leaf('basic-autocomplete', 'Basic Auto-complete', 'blue', {
  template: `${CPP}vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
    sort(products.begin(), products.end());
    Trie t;
    for (auto& p : products) t.insert(p);
    vector<vector<string>> ans;
    string prefix;
    Node* cur = t.root;
    for (char c : searchWord) {
        prefix += c;
        int i = c - 'a';
        if (cur) cur = cur->next[i];
        vector<string> row;
        if (cur) {
            string tmp = prefix;
            function<void(Node*)> dfs = [&](Node* n) {
                if ((int)row.size() == 3) return;
                if (n->isEnd) row.push_back(tmp);
                for (int j = 0; j < 26 && (int)row.size() < 3; j++)
                    if (n->next[j]) { tmp.push_back('a'+j); dfs(n->next[j]); tmp.pop_back(); }
            };
            dfs(cur);
        }
        ans.push_back(row);
    }
    return ans;
}`,
  problems: [
    { id: 1268, title: 'Search Suggestions', slug: 'search-suggestions-system', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-31: as-is (sort products first; trie + DFS for top 3 lexicographic suggestions per prefix).' },
  ],
  pitfalls: ['❌ Not sorting products before trie build — DFS visits alphabetically regardless, but sorting first is simpler.', '❌ Returning more than 3 suggestions — must stop DFS at 3.'],
  edgeCases: [{ input: 'no matching suggestions', breaks: 'return empty list for that prefix' }, { input: 'search word longer than any product', breaks: 'cur becomes null, return empty lists' }],
  interviewTip: '💡 Search Suggestions: sort lexicographically, build trie, DFS from each prefix node for top 3.',
})

export const topkSuggestionsLeaf = leaf('topk-suggestions', 'Top-K Suggestions', 'blue', {
  template: `${CPP}class AutocompleteSystem {
    struct Node { Node* next[27]; int hot; Node() : hot(0) { fill(begin(next), end(next), nullptr); } };
    Node* root; string cur;
    void dfs(Node* n, string& s, vector<pair<int,string>>& res) {
        if (n->hot) res.push_back({-n->hot, s});
        for (int i = 0; i < 27; i++)
            if (n->next[i]) { s.push_back(i == 26 ? ' ' : 'a' + i); dfs(n->next[i], s, res); s.pop_back(); }
    }
public:
    AutocompleteSystem(vector<string>& s, vector<int>& t) : root(new Node()) {
        for (int i = 0; i < (int)s.size(); i++) insert(s[i], t[i]);
    }
    void insert(string& w, int h) {
        Node* cur = root;
        for (char c : w) { int i = c == ' ' ? 26 : c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
        cur->hot += h;
    }
    vector<string> input(char c) {
        if (c == '#') { insert(cur, 1); cur.clear(); return {}; }
        cur += c;
        Node* n = root;
        for (char ch : cur) { int i = ch == ' ' ? 26 : ch - 'a'; if (!n->next[i]) return {}; n = n->next[i]; }
        vector<pair<int,string>> res;
        string tmp = cur;
        dfs(n, tmp, res);
        sort(res.begin(), res.end());
        vector<string> out;
        for (int i = 0; i < min(3, (int)res.size()); i++) out.push_back(res[i].second);
        return out;
    }
};`,
  problems: [
    { id: 642, title: 'Design Autocomplete', slug: 'design-search-autocomplete-system', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Lines 1-40: as-is (trie with hot count per sentence; sort by -hot then lexicographic; return top 3).' },
  ],
  pitfalls: ['❌ Not handling space character — need 27 children (a-z + space).', '❌ Hot count: incrementing on each # input rather than replacing for fresh input.'],
  edgeCases: [{ input: 'new sentence not in history', breaks: 'inserts with hot=1' }, { input: 'prefix with no matches', breaks: 'return empty list' }],
  interviewTip: '💡 Design Autocomplete: trie with hot count per sentence; sort by (-hot, sentence) for top 3; space = 26th child.',
})

export const realtimeSearchLeaf = leaf('realtime-search', 'Real-time Search', 'blue', {
  template: `${CPP}class StreamChecker {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    vector<Node*> active;
public:
    StreamChecker(vector<string>& words) {
        root = new Node();
        for (auto& w : words) {
            Node* cur = root;
            for (int i = (int)w.size() - 1; i >= 0; i--) {
                int c = w[i] - 'a';
                if (!cur->next[c]) cur->next[c] = new Node();
                cur = cur->next[c];
            }
            cur->isEnd = true;
        }
    }
    bool query(char letter) {
        int i = letter - 'a';
        vector<Node*> nxt = {root};
        bool found = false;
        for (auto* cur : active) {
            if (cur->next[i]) {
                if (cur->next[i]->isEnd) found = true;
                nxt.push_back(cur->next[i]);
            }
        }
        if (root->next[i]) { nxt.push_back(root->next[i]); if (root->next[i]->isEnd) found = true; }
        active = move(nxt);
        return found;
    }
};`,
  problems: [
    { id: 1032, title: 'Stream of Characters', slug: 'stream-of-characters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-37: as-is (reverse words, build trie; active nodes list tracks suffix state; each query advances frontier).' },
  ],
  pitfalls: ['❌ Building trie with original word order — need reversed for suffix matching as stream arrives.', '❌ Memory: active vector grows with stream length if not pruned; but each character adds at most one node.'],
  edgeCases: [{ input: 'long stream with no matches', breaks: 'active nodes bounded by max word length' }, { input: 'word appears after stream', breaks: 'query returns true when the sequence completes' }],
  interviewTip: '💡 Stream of Characters: insert words reversed; maintain active frontier of trie nodes; O(L) per query.',
})

export const multiplePatternSearchLeaf = leaf('multiple-pattern-search', 'Multiple Pattern Search', 'pink', {
  template: `${CPP}class Solution {
    struct Node { Node* next[26]; string* word; Node() : word(nullptr) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    vector<string> ans;
    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
    void build(vector<string>& words) {
        root = new Node();
        for (auto& w : words) {
            Node* cur = root;
            for (char c : w) { int i = c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i]; }
            cur->word = &w;
        }
    }
    void dfs(vector<vector<char>>& b, int i, int j, Node* cur) {
        if (i < 0 || i >= (int)b.size() || j < 0 || j >= (int)b[0].size()) return;
        char c = b[i][j];
        if (c == '#') return;
        Node* nxt = cur->next[c - 'a'];
        if (!nxt) return;
        if (nxt->word) { ans.push_back(*nxt->word); nxt->word = nullptr; }
        b[i][j] = '#';
        for (auto& d : dirs) dfs(b, i + d[0], j + d[1], nxt);
        b[i][j] = c;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        build(words);
        for (int i = 0; i < (int)board.size(); i++)
            for (int j = 0; j < (int)board[0].size(); j++)
                dfs(board, i, j, root);
        return ans;
    }
};`,
  problems: [
    { id: 212, title: 'Word Search II', slug: 'word-search-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 1-39: as-is (trie of all words; DFS with backtracking on board; mark visited with #; prune with trie).' },
  ],
  pitfalls: ['❌ Trie + Backtracking: forgetting to restore board cell after DFS — breaks subsequent paths.', '❌ Not deduplicating results if same word found multiple times — set nullptr after first find.'],
  edgeCases: [{ input: 'empty board', breaks: 'return empty' }, { input: 'board with single char', breaks: 'check if single-char words exist' }],
  interviewTip: '💡 Word Search II: build trie of words; DFS on board; prune when trie path dead-ends; mark visited with #.',
})

export const longestMatchingPrefixLeaf = leaf('longest-matching-prefix', 'Longest Matching Prefix', 'pink', {
  template: `${CPP}string longestWord(vector<string>& words) {
    unordered_set<string> dict(words.begin(), words.end());
    string ans;
    for (auto& w : words) {
        if (w.size() < ans.size() || (w.size() == ans.size() && w > ans)) continue;
        bool ok = true;
        for (int i = 1; i < (int)w.size(); i++) {
            if (!dict.count(w.substr(0, i))) { ok = false; break; }
        }
        if (ok) ans = w;
    }
    return ans;
}`,
  problems: [
    { id: 720, title: 'Longest Word', slug: 'longest-word-in-dictionary', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Hash set: sort by length desc then lexicographic; for each word check every prefix exists in set.' },
    { id: 1858, title: 'Longest Word All Prefixes', slug: 'longest-word-with-all-prefixes', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Trie approach: insert all; DFS only where isEnd is true for every prefix; return longest (and lexicographically smallest).', variationCode: 'same as longestWord but using trie DFS with isEnd validation on every prefix ancestor.' },
  ],
  pitfalls: ['❌ Hash set approach: O(W * L^2) — trie DFS is more efficient for large dictionaries.', '❌ Not checking all prefixes — must verify every prefix of the candidate word is valid.'],
  edgeCases: [{ input: 'single-char words', breaks: 'prefix check loop never runs, word is valid' }, { input: 'no word has all prefixes', breaks: 'return empty string' }],
  interviewTip: '💡 Longest Word: trie DFS with isEnd validation on all ancestors; or hash set checking every prefix.',
})

export const patternValidationLeaf = leaf('pattern-validation', 'Pattern Validation', 'pink', {
  template: `${CPP}vector<string> removeSubfolders(vector<string>& folder) {
    sort(folder.begin(), folder.end());
    vector<string> ans;
    for (auto& f : folder) {
        if (ans.empty() || f.find(ans.back() + "/") != 0)
            ans.push_back(f);
    }
    return ans;
}`,
  problems: [
    { id: 1032, title: 'Stream of Characters', slug: 'stream-of-characters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Pattern validation via suffix trie: insert reversed words; active frontier tracks current stream suffix as pattern.' },
    { id: 1233, title: 'Remove Sub-Folders', slug: 'remove-sub-folders-from-the-filesystem', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 1-9: as-is (sort folder paths; keep if not prefixed by last kept path + "/").' },
  ],
  pitfalls: ['❌ Remove Sub-Folders: not sorting lexicographically first — parent folder always comes before child.', '❌ Forgetting trailing slash in prefix check — "/a" is not a prefix of "/ab".'],
  edgeCases: [{ input: 'single folder', breaks: 'just return that folder' }, { input: 'all folders are sub-folders', breaks: 'return only root folders' }],
  interviewTip: '💡 Remove Sub-Folders: sort lexicographically; keep if not prefixed by previous kept + "/". O(N log N).',
})

// ── Advanced Trie Structures Leaves ───────────────────────────────

export const compressedTriesLeaf = leaf('compressed-tries', 'Compressed Tries', 'purple', {
  template: `${CPP}// PATRICIA Trie / Radix Tree
// Compress single-child nodes into one node with a string label.
// e.g., "abcd" stored as root->"abcd" instead of root->a->b->c->d
struct RadixNode {
    string label;
    unordered_map<char, RadixNode*> children;
    bool isEnd;
};`,
  problems: [],
  pitfalls: ['❌ Over-complicating: PATRICIA/Radix trees save memory but most LC problems do not need them — standard trie is sufficient.', '❌ Not handling shared prefixes when splitting nodes.'],
  edgeCases: [{ input: 'empty string in radix tree', breaks: 'special case at root' }, { input: 'all strings share long prefix', breaks: 'compressed trie uses minimal nodes' }],
  interviewTip: '💡 Compressed tries merge single-child chains into edges with string labels; reduces node count for dense tries.',
})

export const ternarySearchTriesLeaf = leaf('ternary-search-tries', 'Ternary Search Tries', 'purple', {
  template: `${CPP}// Ternary Search Trie (TST)
// Each node has 3 children: left (less), mid (equal), right (greater)
// Space-efficient alternative to R-way trie
struct TSTNode {
    char c;
    TSTNode *left, *mid, *right;
    bool isEnd;
};`,
  problems: [],
  pitfalls: ['❌ TSTs have O(log n) average lookup but O(n) worst-case if unbalanced.', '❌ TSTs support only character-by-character operations, not prefix-based bulk operations.'],
  edgeCases: [{ input: 'empty string', breaks: 'needs sentinel handling at root' }],
  interviewTip: '💡 TST: three-way branching (less/equal/greater); trades O(1) child array for O(log n) pointer traversal; less memory for sparse alphabets.',
})

export const suffixTriesLeaf = leaf('suffix-tries', 'Suffix Tries / Trees', 'purple', {
  template: `${CPP}// Suffix Tree (Ukkonen's Algorithm O(n))
// Stores all suffixes of a string in compressed trie form.
// Applications: longest repeated substring, longest common substring,
// pattern matching, shortest unique substring.
// Ukkonen's algorithm builds in O(n) time using active point + suffix links.`,
  problems: [],
  pitfalls: ['❌ Ukkonen algorithm is complex — most interviews ask suffix-related questions solved with simpler methods.', '❌ Generalized suffix tree for multiple strings needs terminators ($, #, etc.).'],
  edgeCases: [{ input: 'string of length 1', breaks: 'suffix tree has 1 leaf' }],
  interviewTip: '💡 Suffix trees solve advanced string problems in O(n): longest repeated substring, LCS, pattern searching. Ukkonen builds in O(n).',
})

export const bitLevelTriesLeaf = leaf('bit-level-tries', 'Bit-level Tries', 'purple', {
  template: `${CPP}class BinaryTrie {
    struct Node { Node* next[2]; Node() { next[0] = next[1] = nullptr; } };
    Node* root;
public:
    BinaryTrie() : root(new Node()) {}
    void insert(int x) {
        Node* cur = root;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1;
            if (!cur->next[b]) cur->next[b] = new Node();
            cur = cur->next[b];
        }
    }
    int maxXor(int x) {
        Node* cur = root;
        int ans = 0;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1;
            if (cur->next[b ^ 1]) { ans |= (1 << i); cur = cur->next[b ^ 1]; }
            else cur = cur->next[b];
        }
        return ans;
    }
};`,
  problems: [
    { id: 421, title: 'Max XOR Two Numbers', slug: 'maximum-xor-of-two-numbers-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 1-27: as-is (insert all numbers into binary trie; for each num, find max XOR by choosing opposite bit when possible).' },
    { id: 1707, title: 'Max XOR With Element From Array', slug: 'maximum-xor-with-an-element-from-array', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Sort queries by m; insert nums <= m into binary trie; query maxXor for each.', variationCode: `sort(nums); sort(queries by m); int i=0; for each q: { while(i<n&&nums[i]<=q[1]) bt.insert(nums[i++]); ans[q[2]]=i?bt.maxXor(q[0]):-1; }` },
  ],
  pitfalls: ['❌ Forgetting bit count (31 for int, not 32 — sign bit issues).', '❌ Binary trie: inserting negative numbers — handle sign bit or use unsigned.'],
  edgeCases: [{ input: 'single number', breaks: 'max XOR = 0 (XOR with itself)' }, { input: 'zero in array', breaks: 'binary trie works fine with 0' }],
  interviewTip: '💡 Binary Trie for max XOR: try to go to opposite bit at each level; if not available, go same bit. O(32N).',
})

// ── Trie Optimization Techniques Leaves ──────────────────────────

export const spaceOptimizationLeaf = leaf('space-optimization', 'Space Optimization', 'orange', {
  template: `${CPP}// 1. Array-based: Node* next[26] vs unordered_map<char,Node*>
//   Array: O(1) child access, 26*8 bytes per node (fixed)
//   HashMap: O(1) average child access, less memory for sparse nodes
// 2. Alphabet reduction: only store children for relevant characters
// 3. Path compression: merge single-child chains into one node`,
  problems: [],
  pitfalls: ['❌ Array-based wastes memory for sparse tries (e.g., few words with long paths).', '❌ HashMap-based adds pointer overhead but is memory-efficient for sparse nodes.'],
  edgeCases: [{ input: 'large alphabet (Unicode)', breaks: 'array-based trie not feasible; use hash map' }, { input: 'dense trie (many words)', breaks: 'array-based is faster' }],
  interviewTip: '💡 Array-based: O(1) child access, 26 pointers per node. HashMap: memory-efficient for sparse nodes. Choose based on alphabet size and density.',
})

export const performanceTuningLeaf = leaf('performance-tuning', 'Performance Tuning', 'orange', {
  template: `${CPP}// 1. isEnd flag: terminal marking for word boundaries
// 2. Count tracking: wordCount + prefixCount per node (Trie II)
// 3. Character skipping: skip common prefix segments
//    e.g., for "folder" sub-folder check, compare path components directly`,
  problems: [],
  pitfalls: ['❌ isEnd: not setting it after insert — search always returns false.', '❌ Count tracking: forgetting to increment prefixCount for root or first character.'],
  edgeCases: [{ input: 'large word count', breaks: 'count tracking adds 8 bytes per node' }],
  interviewTip: '💡 Performance: isEnd for exact match; count tracking for frequency queries; character skipping for prefix-based pruning.',
})

export const hybridApproachesLeaf = leaf('hybrid-approaches', 'Hybrid Approaches', 'orange', {
  template: `${CPP}int longestStrChain(vector<string>& words) {
    unordered_map<string, int> dp;
    sort(words.begin(), words.end(), [](auto& a, auto& b) { return a.size() < b.size(); });
    int ans = 0;
    for (auto& w : words) {
        int best = 0;
        for (int i = 0; i < (int)w.size(); i++) {
            string pre = w.substr(0, i) + w.substr(i + 1);
            best = max(best, dp[pre] + 1);
        }
        dp[w] = best;
        ans = max(ans, best);
    }
    return ans;
}`,
  problems: [
    { id: 1048, title: 'Longest String Chain', slug: 'longest-string-chain', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Lines 1-14: as-is (sort by length; DP: for each char removal, check if predecessor exists).' },
    { id: 212, title: 'Word Search II', slug: 'word-search-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Trie + Backtracking: trie prunes search space; DFS explores board cells.' },
    { id: 676, title: 'Magic Dictionary', slug: 'implement-magic-dictionary', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Trie + Hash: build trie; for each word, try one-character variations using hash set for O(1) lookup.', variationCode: 'build dict hash set; for each word, for each position, try all 25 other letters; check set' },
  ],
  pitfalls: ['❌ String Chain: using trie when hash map + DP is simpler (O(n * L^2)).', '❌ Word Search II: trie without pruning visits many dead-end board paths.'],
  edgeCases: [{ input: 'single word chain', breaks: 'length 1' }, { input: 'no chain', breaks: 'return 1 (each word is its own chain)' }],
  interviewTip: '💡 Hybrid: Trie + Backtracking for board search; Trie + Hash for dictionary features; Trie + DP for string chains.',
})
