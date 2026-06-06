import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Trie Construction ──────────────────────────────────────────

  'char-by-char-insert': e({
    xray: [
      { text: 'Walk **char-by-char**; create nodes as needed', kind: 'signal' },
      { text: 'Mark **isEnd** at terminal node', kind: 'goal' },
    ],
    budget: ['node creation', 'isEnd marking'],
    slottedTemplate: `class Trie {
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
        cur->isEnd = /* SLOT: endMark */;
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
    slots: [
      { id: 'END_MARK', label: 'How to mark end of word', hint: 'true (boolean) vs wordCount++ (Trie II)' },
    ],
    slotFills: {
      208: { END_MARK: 'true' },
      1804: { END_MARK: 'cur->wordCount++ (and prefixCount++ along path)' },
    },
    helixOrder: [208, 1804],
    helixDelta: {
      208: 'Standard trie: isEnd boolean, O(L) insert/search/startsWith.',
      1804: 'Trie II: wordCount + prefixCount per node; supports count and erase.',
    },
    autopsies: [
      {
        cause: 'Forgetting to set isEnd on insert',
        wrong: 'cur->isEnd = isEnd; (never set to true)',
        testCase: 'insert("apple"); search("apple") returns false',
        fix: 'cur->isEnd = true after inserting all characters',
      },
    ],
    sayIt: [
      'Standard trie: create root, walk chars, create nodes as needed, mark isEnd.',
      'Trie II: add wordCount + prefixCount for counting and deletion.',
    ],
  }),

  'batch-insertion': e({
    xray: [
      { text: 'Insert **multiple** words or key-value pairs', kind: 'signal' },
      { text: 'May need **aggregate** values at nodes', kind: 'goal' },
    ],
    budget: ['batch insert', 'value aggregation'],
    slottedTemplate: `class MapSum {
    struct Node { Node* next[26]; int val; Node() : val(0) { fill(begin(next), end(next), nullptr); } };
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
            cur->val += /* SLOT: deltaOrValue */;
        }
    }
    int sum(string prefix) {
        Node* cur = root;
        for (char c : prefix) { int i = c - 'a'; if (!cur->next[i]) return 0; cur = cur->next[i]; }
        return cur->val;
    }
};`,
    slots: [
      { id: 'DELTA_OR_VALUE', label: 'Value added per node', hint: 'delta (MapSum) vs nothing (LongestWord)' },
    ],
    slotFills: {
      720: { DELTA_OR_VALUE: 'n/a — just set isEnd, no value tracking' },
      677: { DELTA_OR_VALUE: 'delta // cumulative sum at each node' },
    },
    helixOrder: [720, 677],
    helixDelta: {
      720: 'Longest Word: batch insert all words; BFS/DFS to find longest with all prefixes valid.',
      677: 'Map Sum: insert key + value; store cumulative sum at each node; delta on re-insert.',
    },
    autopsies: [
      {
        cause: 'Map Sum: not tracking delta on re-insert',
        wrong: 'cur->val += v; (accumulates on repeated insert)',
        testCase: 'insert("apple",3); insert("apple",2); sum("ap") = 3+2 = 5 but expected 2',
        fix: 'store map[key]=v; delta = v - oldValue; cur->val += delta',
      },
    ],
    sayIt: [
      'Batch insert: loop over words, standard trie insert for each.',
      'Map Sum: cumulative value per node + delta tracking for re-insert.',
    ],
  }),

  'specialized-trie-structures': e({
    xray: [
      { text: 'Trie with **modified** operations: replace, one-edit, case', kind: 'signal' },
      { text: 'Search with **constraints** beyond standard trie', kind: 'constraint' },
    ],
    budget: ['modify ops', 'constraint search'],
    slottedTemplate: `class MagicDictionary {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
public:
    MagicDictionary() : root(new Node()) {}
    void buildDict(vector<string> dict) {
        for (auto& w : dict) {
            Node* cur = root;
            for (char c : w) {
                int i = c - 'a'; if (!cur->next[i]) cur->next[i] = new Node(); cur = cur->next[i];
            }
            cur->isEnd = true;
        }
    }
    bool search(string word) {
        for (int j = 0; j < (int)word.size(); j++) {
            for (int k = 0; k < 26; k++) {
                if (word[j] - 'a' == k) continue;
                // try replacement at pos j, check rest via trie
            }
        }
        return false;
    }
};`,
    slots: [
      { id: 'SEARCH_LOGIC', label: 'Search constraint logic', hint: 'one-char diff (676) vs shortest root (648)' },
    ],
    slotFills: {
      648: { SEARCH_LOGIC: 'walk word in trie; if isEnd found before word ends, return that prefix as root' },
      676: { SEARCH_LOGIC: 'try each position j with all 25 other chars; walk remainder in trie; check isEnd' },
    },
    helixOrder: [648, 676],
    helixDelta: {
      648: 'Replace Words: trie of roots; for each word find shortest matching root.',
      676: 'Magic Dictionary: trie of words; search with exactly one char changed.',
    },
    autopsies: [
      {
        cause: 'Replace Words: not shortest root — any root match returns',
        wrong: 'walk all the way down even after finding a root',
        testCase: 'roots=["a","aa"], word="aaa" — should replace with "a", not "aa"',
        fix: 'break at first isEnd found during walk',
      },
    ],
    sayIt: [
      'Replace Words: insert roots; for each word, walk until isEnd = shortest root.',
      'Magic Dictionary: for each position, try all 25 other letters; check if path exists.',
    ],
  }),

  // ── Search Operations ─────────────────────────────────────────

  'exact-match-search': e({
    xray: [
      { text: 'Walk prefix **character by character**', kind: 'signal' },
      { text: 'Return **cur->isEnd** at the final node', kind: 'goal' },
    ],
    budget: ['walk path', 'isEnd check'],
    slottedTemplate: `bool search(string word) {
    Node* cur = root;
    for (char c : word) {
        int i = c - 'a';
        if (!cur->next[i]) return false;
        cur = cur->next[i];
    }
    return /* SLOT: endCondition */;
}`,
    slots: [
      { id: 'END_CONDITION', label: 'What to return at terminal node', hint: 'cur->isEnd vs cur->wordCount' },
    ],
    slotFills: {
      208: { END_CONDITION: 'cur->isEnd' },
      1804: { END_CONDITION: 'cur->wordCount > 0' },
    },
    helixOrder: [208, 1804],
    helixDelta: {
      208: 'Return cur->isEnd boolean for exact match.',
      1804: 'Return cur->wordCount — supports duplicate inserts.',
    },
    autopsies: [
      {
        cause: 'Using isEnd == false check as "no match" before last char',
        wrong: 'if (!cur->next[i] || !cur->next[i]->isEnd) return false; within loop',
        testCase: 'search("apple") on trie containing "app" — fails early',
        fix: 'only check isEnd at the final node, not during walk',
      },
    ],
    sayIt: [
      'Exact match: walk word characters, return isEnd at last node.',
      'Count: walk word characters, return wordCount at last node.',
    ],
  }),

  'prefix-search': e({
    xray: [
      { text: 'Walk **prefix** characters — no isEnd check needed', kind: 'signal' },
      { text: 'Return **true** if path exists', kind: 'goal' },
    ],
    budget: ['walk prefix', 'no isEnd'],
    slottedTemplate: `bool startsWith(string prefix) {
    Node* cur = root;
    for (char c : prefix) {
        int i = c - 'a';
        if (!cur->next[i]) return false;
        cur = cur->next[i];
    }
    return /* SLOT: returnValue */;
}`,
    slots: [
      { id: 'RETURN_VALUE', label: 'What to return after walking prefix', hint: 'true (boolean) vs prefixCount' },
    ],
    slotFills: {
      208: { RETURN_VALUE: 'true' },
      1804: { RETURN_VALUE: 'cur->prefixCount' },
    },
    helixOrder: [208, 1804],
    helixDelta: {
      208: 'Return true (path exists) for startsWith.',
      1804: 'Return cur->prefixCount — number of words with this prefix.',
    },
    autopsies: [
      {
        cause: 'Checking isEnd in prefix search',
        wrong: 'return cur->isEnd; after walking prefix',
        testCase: 'startsWith("app") on trie with "apple" only — returns false incorrectly',
        fix: 'prefix search only needs path to exist, return true',
      },
    ],
    sayIt: [
      'Prefix search: walk characters, return true if path exists (no isEnd check).',
      'Count: walk characters, return prefixCount at that node.',
    ],
  }),

  'wildcard-search': e({
    xray: [
      { text: '**.** matches any of 26 children — DFS recursive branching', kind: 'signal' },
      { text: 'Bounded by 26^(wildcards) worst case', kind: 'constraint' },
    ],
    budget: ['dfs', 'branching', 'wildcard'],
    slottedTemplate: `bool dfs(string& w, int pos, Node* cur) {
    if (pos == (int)w.size()) return cur->isEnd;
    if (w[pos] != '.') {
        int i = w[pos] - 'a';
        return cur->next[i] && dfs(w, pos + 1, cur->next[i]);
    }
    for (int i = 0; i < 26; i++)
        if (cur->next[i] && dfs(w, pos + 1, cur->next[i]))
            return true;
    return false;
}`,
    slots: [
      { id: 'DOT_LOGIC', label: 'How to handle . wildcard', hint: 'try all 26 children vs skip char' },
    ],
    slotFills: {
      211: { DOT_LOGIC: 'for i 0..25: if cur->next[i] && dfs(w, pos+1, cur->next[i]) return true' },
      1023: { DOT_LOGIC: 'n/a — two-pointer, not trie; match pattern uppercase, skip query lowercase' },
    },
    helixOrder: [211, 1023],
    helixDelta: {
      211: 'DFS with . branching to all 26 children; return at isEnd.',
      1023: 'Camelcase: two-pointer matching pattern uppercase in query; skip query lowercase.',
    },
    autopsies: [
      {
        cause: 'Wildcard search using BFS instead of DFS',
        wrong: 'queue-based level-order trying all combinations',
        testCase: 'word with 3 dots — BFS explores 26^3 nodes at once',
        fix: 'DFS with backtracking is simpler; use recursion and early exit',
      },
    ],
    sayIt: [
      'Wildcard: DFS — if char is ., try all 26 children; else walk directly.',
      'Camelcase: two-pointer, match uppercase in pattern, skip lowercase in query.',
    ],
  }),

  // ── Deletion & Modification ──────────────────────────────────

  'single-word-deletion': e({
    xray: [
      { text: '**Decrement** prefixCount on each node along path', kind: 'signal' },
      { text: 'Decrement wordCount at **terminal** node', kind: 'goal' },
    ],
    budget: ['decrement counts', 'no physical delete'],
    slottedTemplate: `void erase(string w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->next[i]) return;
        cur = cur->next[i];
        cur->prefixCount--;
    }
    cur->/* SLOT: terminalDec */;
}`,
    slots: [
      { id: 'TERMINAL_DEC', label: 'What to decrement at terminal node', hint: 'wordCount--' },
    ],
    slotFills: {
      1804: { TERMINAL_DEC: 'wordCount--' },
    },
    helixOrder: [1804],
    helixDelta: {
      1804: 'Erase: decrement prefixCount along path; decrement wordCount at terminal.',
    },
    autopsies: [
      {
        cause: 'Physically deleting trie nodes on erase',
        wrong: 'delete cur; cur = nullptr; — breaks other words sharing prefix',
        testCase: 'insert("apple"), insert("app"), erase("app") — delete node for "app" breaks "apple"',
        fix: 'just decrement counts; do not physically remove nodes',
      },
    ],
    sayIt: [
      'Trie deletion: decrement prefixCount on each node; decrement wordCount at terminal.',
    ],
  }),

  'trie-modification': e({
    xray: [
      { text: '**Update** value at trie nodes (not just boolean isEnd)', kind: 'signal' },
      { text: 'May need **delta** tracking for re-inserts', kind: 'constraint' },
    ],
    budget: ['value update', 'delta tracking'],
    slottedTemplate: `void insert(string key, int v) {
    int delta = v - map[key];
    map[key] = v;
    Node* cur = root;
    for (char c : key) {
        int i = c - 'a';
        if (!cur->next[i]) cur->next[i] = new Node();
        cur = cur->next[i];
        cur->val += /* SLOT: updateValue */;
    }
}`,
    slots: [
      { id: 'UPDATE_VALUE', label: 'Value to add to each node', hint: 'delta vs weight vs index' },
    ],
    slotFills: {
      677: { UPDATE_VALUE: 'delta' },
      745: { UPDATE_VALUE: 'max(idx, cur->idx)' },
    },
    helixOrder: [677, 745],
    helixDelta: {
      677: 'Map Sum: delta-cumulative value per node.',
      745: 'Prefix/Suffix Search: insert suffix+{+prefix combos; store max index at nodes.',
    },
    autopsies: [
      {
        cause: 'Prefix/Suffix Search: building separate prefix and suffix tries',
        wrong: 'two separate trie lookups and intersect results',
        testCase: 'f("ab","bc") — must find word with prefix "ab" AND suffix "bc"',
        fix: 'single trie with key = suffix + "{" + prefix; O(L) lookup',
      },
    ],
    sayIt: [
      'Map Sum: delta-cumulative values; re-insert tracks value difference.',
      'Prefix/Suffix Search: combined key suffix+{+prefix in one trie.',
    ],
  }),

  'trie-pruning': e({
    xray: [
      { text: '**Active frontier** of trie nodes from stream characters', kind: 'signal' },
      { text: 'Each query advances all active nodes by one character', kind: 'signal' },
    ],
    budget: ['active nodes', 'reverse trie', 'suffix matching'],
    slottedTemplate: `bool query(char letter) {
    int i = letter - 'a';
    vector<Node*> nxt = {root};
    bool found = false;
    for (auto* cur : active) {
        if (cur->next[i]) {
            if (cur->next[i]->isEnd) found = true;
            nxt.push_back(cur->next[i]);
        }
    }
    active = move(nxt);
    return found;
}`,
    slots: [
      { id: 'ACTIVE_INIT', label: 'Initial active nodes', hint: '{root} only vs root + prior states' },
    ],
    slotFills: {
      1032: { ACTIVE_INIT: 'vector<Node*> active = {root}; // start fresh' },
    },
    helixOrder: [1032],
    helixDelta: {
      1032: 'Stream of Characters: reversed words in trie; active frontier tracks all suffix states.',
    },
    autopsies: [
      {
        cause: 'Not reversing words before trie insert',
        wrong: 'insert words in original order; then match suffix from stream',
        testCase: 'stream "...xyz" should match word "xyz" — forward trie needs prefix, not suffix',
        fix: 'reverse each word before insert; stream suffix becomes trie prefix',
      },
    ],
    sayIt: [
      'Stream of Characters: reverse words in trie; maintain active node frontier; O(L) per query.',
    ],
  }),

  // ── Trie Traversal ───────────────────────────────────────────

  'dfs-traversal': e({
    xray: [
      { text: 'Recursive **DFS** through trie children', kind: 'signal' },
      { text: 'Visit children in **alphabetical** order for sorted output', kind: 'signal' },
    ],
    budget: ['dfs recursion', 'string building'],
    slottedTemplate: `void dfs(Node* cur, string& s) {
    if (cur->isEnd) { /* SLOT: processWord */ }
    for (int i = 0; i < 26; i++)
        if (cur->next[i]) {
            s.push_back('a' + i);
            dfs(cur->next[i], s);
            s.pop_back();
        }
}`,
    slots: [
      { id: 'PROCESS_WORD', label: 'What to do when word found', hint: 'update ans (720) vs collect top 3 (1268)' },
    ],
    slotFills: {
      720: { PROCESS_WORD: `if (s.size() > ans.size() || (s.size() == ans.size() && s < ans)) ans = s;` },
      1268: { PROCESS_WORD: `if ((int)row.size() < 3) row.push_back(s);` },
    },
    helixOrder: [720, 1268],
    helixDelta: {
      720: 'DFS with isEnd validation on every prefix; track longest lexicographically smallest.',
      1268: 'DFS from prefix node; collect up to 3 lexicographically smallest suggestions.',
    },
    autopsies: [
      {
        cause: 'DFS: forgetting to pop_back after recursion',
        wrong: `for (int i = 0; i < 26; i++) if (n->next[i]) { s.push_back('a'+i); dfs(n->next[i], s); } // no pop_back!`,
        testCase: 'after "a" branch, string still has "a" when exploring "b"',
        fix: 's.push_back(...); dfs(...); s.pop_back();',
      },
    ],
    sayIt: [
      'Trie DFS: recurse children in order; build string on way down; pop_back on way up.',
      'Longest Word: only descend if cur->isEnd (every prefix valid).',
      'Search Suggestions: from prefix node DFS alphabetically; stop at 3.',
    ],
  }),

  'level-order-traversal': e({
    xray: [
      { text: '**Queue**-based level-by-level trie traversal', kind: 'signal' },
      { text: 'Process all nodes at current depth before deeper', kind: 'signal' },
    ],
    budget: ['bfs', 'queue', 'level tracking'],
    slottedTemplate: `void bfs(Node* root) {
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            Node* cur = q.front(); q.pop();
            /* SLOT: process */
            for (int i = 0; i < 26; i++)
                if (cur->next[i]) q.push(cur->next[i]);
        }
    }
}`,
    slots: [
      { id: 'PROCESS', label: 'Process node during BFS', hint: 'count, print, or record' },
    ],
    slotFills: {
      0: { PROCESS: '// conceptual: process cur node (count nodes per level, find width, etc.)' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Not distinguishing levels when needed',
        wrong: 'single while loop without level-sized inner loop',
        testCase: 'need count per level — mixing levels together',
        fix: 'int sz = q.size(); for (int i = 0; i < sz; i++) { ... }',
      },
    ],
    sayIt: [
      'Trie BFS: queue-based level-order traversal; process level by level.',
    ],
  }),

  'lexicographic-traversal': e({
    xray: [
      { text: '**Alphabetical order** — DFS children 0..25', kind: 'signal' },
      { text: 'May need **top-K** by hotness then lexicographic', kind: 'goal' },
    ],
    budget: ['alphabetical dfs', 'top-k', 'hotness sort'],
    slottedTemplate: `void dfs(Node* n, string& s, vector<pair<int,string>>& res) {
    if (n->hot) res.push_back({-n->hot, s});
    for (int i = 0; i < 27; i++)
        if (n->next[i]) { s.push_back(i == 26 ? ' ' : 'a' + i); dfs(n->next[i], s, res); s.pop_back(); }
}`,
    slots: [
      { id: 'SORT_MODE', label: 'How to sort results', hint: 'lexicographic only (1268) vs -hot then lexicographic (642)' },
    ],
    slotFills: {
      1268: { SORT_MODE: 'DFS alphabetically; first 3 found = lexicographically smallest' },
      642: { SORT_MODE: 'collect all; sort by (-hot, word); top 3' },
    },
    helixOrder: [1268, 642],
    helixDelta: {
      1268: 'Lexicographic only: DFS children 0..25, collect top 3.',
      642: 'Hotness sort: DFS collect all matching; sort by (-hot, word); return top 3.',
    },
    autopsies: [
      {
        cause: 'Autocomplete: not including space character (27th child)',
        wrong: `for (int i = 0; i < 26; i++) if (n->next[i]) ... — misses " "`,
        testCase: 'input "hello world" — space breaks traversal',
        fix: 'use 27 children: 0-25 for a-z, 26 for space',
      },
    ],
    sayIt: [
      'Lexicographic: DFS children 0..26 (a-z + space); alphabetically sorted output.',
      'Autocomplete: collect all matches; sort by (-hotness, sentence); return top 3.',
    ],
  }),

  // ── Trie Applications ────────────────────────────────────────

  'word-lookup': e({
    xray: [
      { text: '**Dictionary** lookup with exact match or prefix', kind: 'signal' },
      { text: 'Multiple **lookups** with shared prefixes', kind: 'constraint' },
    ],
    budget: ['dict lookup', 'prefix search'],
    slottedTemplate: `bool search(string word) {
    Node* cur = root;
    for (char c : word) { int i = c - 'a'; if (!cur->next[i]) return false; cur = cur->next[i]; }
    return cur->isEnd;
}`,
    slots: [
      { id: 'LOOKUP_TYPE', label: 'Lookup variant', hint: 'search vs startsWith vs search suggestions' },
    ],
    slotFills: {
      208: { LOOKUP_TYPE: 'search: walk + isEnd check' },
      1268: { LOOKUP_TYPE: 'startsWith + DFS: walk to prefix node, collect top 3' },
    },
    helixOrder: [208, 1268],
    helixDelta: {
      208: 'Single word lookup: O(L) per search.',
      1268: 'Prefix lookup + DFS: walk to prefix node, then DFS for top 3 suggestions.',
    },
    autopsies: [
      {
        cause: 'Using hash set for prefix queries',
        wrong: `unordered_set<string> dict; for each prefix search, iterate all keys`,
        testCase: 'startsWith("app") on 10K words — O(N) per query',
        fix: 'use trie for O(L) startsWith queries',
      },
    ],
    sayIt: [
      'Word lookup: trie provides O(L) search and startsWith — better than hash set for prefix queries.',
    ],
  }),

  'word-replacement': e({
    xray: [
      { text: '**Replace** words with shortest dictionary root', kind: 'signal' },
      { text: '**Prefix validation**: every prefix of candidate must be a word', kind: 'constraint' },
    ],
    budget: ['shortest root', 'prefix validation'],
    slottedTemplate: `string replaceWords(vector<string>& dict, string sentence) {
    Trie t;
    for (auto& r : dict) t.insert(r);
    string ans, word;
    istringstream iss(sentence);
    while (iss >> word) {
        string prefix;
        Node* cur = t.root;
        for (char c : word) {
            int i = c - 'a'; if (!cur->next[i]) break;
            cur = cur->next[i]; prefix += c;
            if (cur->isEnd) break;
        }
        ans += (cur->isEnd ? prefix : word) + " ";
    }
    ans.pop_back();
    return ans;
}`,
    slots: [
      { id: 'REPLACE_LOGIC', label: 'What to replace with', hint: 'shortest root (648) vs word itself (1858)' },
    ],
    slotFills: {
      648: { REPLACE_LOGIC: 'if cur->isEnd: replace word with accumulated prefix' },
      1858: { REPLACE_LOGIC: 'n/a — find longest word where every prefix is also a word' },
    },
    helixOrder: [648, 1858],
    helixDelta: {
      648: 'Replace Words: shortest root replacement at isEnd boundary.',
      1858: 'Longest Word All Prefixes: isEnd on every prefix; longest such word.',
    },
    autopsies: [
      {
        cause: 'Replace Words: using longest instead of shortest root',
        wrong: `walk entire word then check isEnd — replaces with full root, not shortest`,
        testCase: `roots=["a","aa"], word="aaa" — should replace "aaa" with "a", not "aa"`,
        fix: 'break at first isEnd found during walk (shortest = first match)',
      },
    ],
    sayIt: [
      'Replace Words: first isEnd hit = shortest root. Replace with that prefix.',
      'All Prefixes: DFS only where every ancestor has isEnd true.',
    ],
  }),

  'dict-feature': e({
    xray: [
      { text: '**Feature-rich** dictionary: wildcards, autocomplete', kind: 'signal' },
      { text: 'Combine trie with **search constraints**', kind: 'constraint' },
    ],
    budget: ['wildcard', 'autocomplete', 'dictionary feature'],
    slottedTemplate: `class WordDictionary {
    struct Node { Node* next[26]; bool isEnd; Node() : isEnd(false) { fill(begin(next), end(next), nullptr); } };
    Node* root;
    bool dfs(string& w, int pos, Node* cur) {
        if (pos == (int)w.size()) return cur->isEnd;
        if (w[pos] != '.') { int i = w[pos] - 'a'; return cur->next[i] && dfs(w, pos+1, cur->next[i]); }
        for (int i = 0; i < 26; i++) if (cur->next[i] && dfs(w, pos+1, cur->next[i])) return true;
        return false;
    }
public:
    WordDictionary() : root(new Node()) {}
    void addWord(string w) { /* standard insert */ }
    bool search(string w) { return dfs(w, 0, root); }
};`,
    slots: [
      { id: 'FEATURE_MODE', label: 'Additional dictionary feature', hint: 'wildcard (211) vs autocomplete (642)' },
    ],
    slotFills: {
      211: { FEATURE_MODE: 'wildcard: . matches any single character via DFS branching' },
      642: { FEATURE_MODE: 'autocomplete: trie + hot count; DFS collect top 3 by (-hot, word)' },
    },
    helixOrder: [211, 642],
    helixDelta: {
      211: 'Wildcard dictionary: DFS with . matching all 26 children.',
      642: 'Autocomplete dictionary: hot count per sentence; sort by hotness then lexicographic.',
    },
    autopsies: [
      {
        cause: 'Autocomplete: not handling space character in trie',
        wrong: '26 children only — sentences with spaces break search',
        testCase: 'input("hello world") — space causes path to not exist',
        fix: 'use 27 children (index 26 = space)',
      },
    ],
    sayIt: [
      'Wildcard dict: standard trie insert; DFS search with . branching.',
      'Autocomplete: trie with hotness; sort results by frequency then lexicographic.',
    ],
  }),

  'prefix-counting': e({
    xray: [
      { text: '**prefixCount** at each node — how many words pass through', kind: 'signal' },
      { text: '**wordCount** at terminal — how many exact words end here', kind: 'goal' },
    ],
    budget: ['prefix count', 'word count', 'cumulative value'],
    slottedTemplate: `void insert(string w) {
    Node* cur = root;
    for (char c : w) {
        int i = c - 'a';
        if (!cur->next[i]) cur->next[i] = new Node();
        cur = cur->next[i];
        cur->prefixCount++;
    }
    cur->wordCount++;
}`,
    slots: [
      { id: 'COUNT_TYPE', label: 'What to count', hint: 'count of words (1804) vs cumulative value (677)' },
    ],
    slotFills: {
      677: { COUNT_TYPE: 'cumulative value: cur->val += delta; sum(prefix) = node.val' },
      1804: { COUNT_TYPE: 'word frequency: prefixCount++ per node; wordCount++ at terminal' },
    },
    helixOrder: [677, 1804],
    helixDelta: {
      677: 'Map Sum: cumulative value per node; prefix sum query = node.val.',
      1804: 'Trie II: wordCount (exact match) + prefixCount (prefix match) + erase.',
    },
    autopsies: [
      {
        cause: 'Incrementing prefixCount on root instead of first char node',
        wrong: 'root->prefixCount++ before loop',
        testCase: 'two unrelated words — root prefixCount is 2, should be 0',
        fix: 'increment prefixCount on child nodes, not root',
      },
    ],
    sayIt: [
      'Prefix counting: prefixCount on each node along path; wordCount only at terminal.',
      'Map Sum: cumulative node value = sum of all values with this prefix.',
    ],
  }),

  'prefix-matching': e({
    xray: [
      { text: '**Match** prefix against query string with constraints', kind: 'goal' },
      { text: 'May use **combined keys** (prefix+suffix in one trie)', kind: 'constraint' },
    ],
    budget: ['pattern match', 'two-pointer', 'combined key'],
    slottedTemplate: `vector<bool> camelMatch(vector<string>& queries, string pattern) {
    vector<bool> ans;
    for (auto& q : queries) {
        int i = 0, j = 0;
        while (i < q.size() && j < p.size()) {
            if (q[i] == p[j]) { i++; j++; }
            else if (isupper(q[i])) break;
            else i++;
        }
        bool match = (j == p.size());
        while (i < q.size() && match) { if (isupper(q[i])) match = false; else i++; }
        ans.push_back(match);
    }
    return ans;
}`,
    slots: [
      { id: 'MATCH_STRATEGY', label: 'Prefix matching strategy', hint: 'two-pointer (1023) vs combined trie key (745)' },
    ],
    slotFills: {
      1023: { MATCH_STRATEGY: 'two-pointer: match pattern uppercase; skip query lowercase; reject extra uppercase' },
      745: { MATCH_STRATEGY: 'combined key: insert suffix + "{" + prefix into trie; walk combined key for lookup' },
    },
    helixOrder: [1023, 745],
    helixDelta: {
      1023: 'Camelcase: two-pointer; match pattern uppercase, skip query lowercase.',
      745: 'Prefix/Suffix Search: suffix+{+prefix combined key in single trie; O(L) lookup.',
    },
    autopsies: [
      {
        cause: 'Camelcase: not checking remaining query for unexpected uppercase',
        wrong: 'only match pattern; ignore rest of query',
        testCase: 'q="FooBar", p="FB" — matches but has uppercase after: "o" uppercase "B"? Actually B is matched.',
        fix: 'after pattern matched, ensure no uppercase letters remain in query',
      },
    ],
    sayIt: [
      'Camelcase: two-pointer scan; skip lowercase in query; match uppercase against pattern.',
      'Prefix/Suffix: combined key suffix+{+prefix in one trie for O(L) queries.',
    ],
  }),

  'longest-common-prefix': e({
    xray: [
      { text: 'Find **longest prefix** shared by ALL strings', kind: 'goal' },
      { text: '**Vertical scan**: compare char by char across all strings', kind: 'signal' },
    ],
    budget: ['vertical scan', 'trie approach'],
    slottedTemplate: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    for (int i = 0; i < (int)strs[0].size(); i++) {
        char c = strs[0][i];
        for (int j = 1; j < (int)strs.size(); j++)
            if (i >= (int)strs[j].size() || strs[j][i] != c)
                return strs[0].substr(0, i);
    }
    return strs[0];
}`,
    slots: [
      { id: 'ALGORITHM', label: 'LCP algorithm', hint: 'vertical scan vs trie' },
    ],
    slotFills: {
      14: { ALGORITHM: 'vertical scan: O(S) time, O(1) space — simplest' },
    },
    helixOrder: [14],
    helixDelta: {
      14: 'LCP: compare char by char across all strings; return at first mismatch.',
    },
    autopsies: [
      {
        cause: 'Index out of bounds on shorter string',
        wrong: `if (strs[j][i] != c) ... — no bounds check on strs[j]`,
        testCase: '["ab", "a"] — i=1, strs[1] length=1',
        fix: 'check i >= strs[j].size() before accessing strs[j][i]',
      },
    ],
    sayIt: [
      'LCP: vertical scan — compare char by char across all strings; exit at first mismatch or end of first string.',
    ],
  }),

  // ── Auto-complete Systems ────────────────────────────────────

  'basic-autocomplete': e({
    xray: [
      { text: '**Top-3** lexicographically smallest suggestions', kind: 'goal' },
      { text: 'DFS from prefix node in **alphabetical** order', kind: 'signal' },
    ],
    budget: ['dfs collect', 'top k', 'lexicographic'],
    slottedTemplate: `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
    sort(products.begin(), products.end());
    // build trie
    Node* cur = t.root;
    for (char c : searchWord) {
        prefix += c;
        if (cur) cur = cur->next[c - 'a'];
        vector<string> row;
        if (cur) { /* SLOT: collectSuggestions */ }
        ans.push_back(row);
    }
    return ans;
}`,
    slots: [
      { id: 'COLLECT_SUGGESTIONS', label: 'How to collect suggestions', hint: 'DFS until 3 found' },
    ],
    slotFills: {
      1268: { COLLECT_SUGGESTIONS: 'dfs from cur collecting up to 3 words in alphabetical order' },
    },
    helixOrder: [1268],
    helixDelta: {
      1268: 'Search Suggestions: sort products; build trie; for each prefix char, DFS from node for top 3.',
    },
    autopsies: [
      {
        cause: 'Not sorting products before building trie',
        wrong: 'unsorted insert — DFS finds alphabetically anyway due to child order',
        testCase: '["b","a"] — trie stores both, DFS order is a->b, which gives correct alphabetical',
        fix: 'DFS visits children 0..25, so alphabetical order is automatic; sort is optional',
      },
    ],
    sayIt: [
      'Search Suggestions: build trie; for each prefix character, DFS from current node; collect top 3 alphabetically.',
    ],
  }),

  'topk-suggestions': e({
    xray: [
      { text: 'Sort suggestions by **hotness** descending, then lexicographic', kind: 'goal' },
      { text: 'DFS collect all; **sort** by (-hot, word)', kind: 'signal' },
    ],
    budget: ['hot count', 'sort by freq', 'top k'],
    slottedTemplate: `vector<string> input(char c) {
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
}`,
    slots: [
      { id: 'SENTINEL_CHAR', label: 'Sentence end sentinel char', hint: '#' },
    ],
    slotFills: {
      642: { SENTINEL_CHAR: '#' },
    },
    helixOrder: [642],
    helixDelta: {
      642: 'Design Autocomplete: trie with hot count; DFS collect all; sort by (-hot, string); top 3.',
    },
    autopsies: [
      {
        cause: 'Not including space in character set',
        wrong: 'Node* next[26] — no space handling',
        testCase: 'input("hello world") — space breaks navigation',
        fix: 'Node* next[27]; index 26 = space',
      },
    ],
    sayIt: [
      'Autocomplete: trie with hot count; 27 children (a-z + space); sort results by (-hot, word); top 3.',
    ],
  }),

  'realtime-search': e({
    xray: [
      { text: '**Streaming** characters; detect when a word is formed', kind: 'signal' },
      { text: '**Active frontier** tracks all possible suffix paths', kind: 'constraint' },
    ],
    budget: ['suffix matching', 'active frontier', 'reverse trie'],
    slottedTemplate: `class StreamChecker {
    struct Node { Node* next[26]; bool isEnd; /* ... */ };
    vector<Node*> active;
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
    slots: [
      { id: 'INSERT_DIRECTION', label: 'Word insert direction', hint: 'reversed for suffix matching' },
    ],
    slotFills: {
      1032: { INSERT_DIRECTION: 'reverse each word before insert; stream suffix matches as trie prefix' },
    },
    helixOrder: [1032],
    helixDelta: {
      1032: 'Stream of Characters: reversed-word trie; active frontier of up to (max word length) nodes.',
    },
    autopsies: [
      {
        cause: 'Frontier memory growing unbounded',
        wrong: 'appending to active without pruning',
        testCase: 'million-char stream — active contains all suffixes',
        fix: 'each query appends at most ONE new node (root->next[i]); frontier bounded by word length',
      },
    ],
    sayIt: [
      'Stream of Characters: reverse words; insert into trie; maintain active frontier; O(L) per query.',
    ],
  }),

  // ── String Pattern Matching ──────────────────────────────────

  'multiple-pattern-search': e({
    xray: [
      { text: 'Search for **multiple patterns** simultaneously', kind: 'signal' },
      { text: '**Prune** board search with trie — stop when path dead-ends', kind: 'constraint' },
    ],
    budget: ['trie prune', 'backtracking', 'board search'],
    slottedTemplate: `void dfs(vector<vector<char>>& b, int i, int j, Node* cur) {
    if (i < 0 || i >= b.size() || j < 0 || j >= b[0].size()) return;
    char c = b[i][j];
    if (c == '#') return;
    Node* nxt = cur->next[c - 'a'];
    if (!nxt) return;
    if (nxt->word) { ans.push_back(*nxt->word); nxt->word = nullptr; }
    b[i][j] = '#';
    for (auto& d : dirs) dfs(b, i + d[0], j + d[1], nxt);
    b[i][j] = c;
}`,
    slots: [
      { id: 'PRUNE_STRATEGY', label: 'How to prune search', hint: 'store word* at node (212) vs Aho-Corasick failure links' },
    ],
    slotFills: {
      212: { PRUNE_STRATEGY: 'store string* at terminal node; set to nullptr after first find (deduplicate)' },
      0: { PRUNE_STRATEGY: 'Aho-Corasick: add failure links for O(n+m) multi-pattern matching in text' },
    },
    helixOrder: [212],
    helixDelta: {
      212: 'Word Search II: trie + backtracking; store word pointer at terminal; prune when no children.',
    },
    autopsies: [
      {
        cause: 'Not marking visited cells — infinite recursion',
        wrong: 'dfs(b, i+1, j, nxt); dfs(b, i-1, j, nxt); ... — revisits cells',
        testCase: 'board with loop pattern — stack overflow',
        fix: 'set b[i][j] = "#" before recursing; restore after',
      },
    ],
    sayIt: [
      'Word Search II: trie of all words; DFS board with backtracking; prune when trie path dead-ends.',
      'Aho-Corasick: trie + failure links for linear-time multi-pattern search in text.',
    ],
  }),

  'longest-matching-prefix': e({
    xray: [
      { text: '**Every prefix** of the word must be in dictionary', kind: 'constraint' },
      { text: 'Longest such word (or lexicographically smallest tiebreak)', kind: 'goal' },
    ],
    budget: ['prefix validation', 'hash set', 'trie dfs'],
    slottedTemplate: `string longestWord(vector<string>& words) {
    unordered_set<string> dict(words.begin(), words.end());
    string ans;
    for (auto& w : words) {
        if (w.size() < ans.size() || (w.size() == ans.size() && w > ans)) continue;
        bool ok = true;
        for (int i = 1; i < (int)w.size(); i++)
            if (!dict.count(w.substr(0, i))) { ok = false; break; }
        if (ok) ans = w;
    }
    return ans;
}`,
    slots: [
      { id: 'VALIDATION', label: 'How to validate all prefixes', hint: 'hash set (720) vs trie DFS (1858)' },
    ],
    slotFills: {
      720: { VALIDATION: 'hash set: check each prefix of word exists in set O(L^2) per word' },
      1858: { VALIDATION: 'trie DFS: insert all; DFS only when cur->isEnd; longest = deepest valid path' },
    },
    helixOrder: [720, 1858],
    helixDelta: {
      720: 'Hash set: sort by length + lexicographic; check every prefix.',
      1858: 'Trie DFS: isEnd validation on all ancestors; track longest path.',
    },
    autopsies: [
      {
        cause: 'Not checking all prefixes — only first prefix check',
        wrong: 'if (dict.count(w.substr(0,1))) ok = true; — only checks first char',
        testCase: 'words=["a","ab","abc"] — "abc" needs "a" and "ab" valid',
        fix: 'loop from i=1 to w.size()-1; check each prefix',
      },
    ],
    sayIt: [
      'Longest Word: hash set approach checks every prefix O(L^2); trie DFS is more efficient.',
      'Longest Word All Prefixes: trie DFS with isEnd validation on every node in path.',
    ],
  }),

  'pattern-validation': e({
    xray: [
      { text: '**Validate** if input matches a pattern or condition', kind: 'goal' },
      { text: 'Sub-folder / suffix detection with **prefix-based** logic', kind: 'signal' },
    ],
    budget: ['sort validate', 'suffix detection'],
    slottedTemplate: `vector<string> removeSubfolders(vector<string>& folder) {
    sort(folder.begin(), folder.end());
    vector<string> ans;
    for (auto& f : folder) {
        if (ans.empty() || f.find(ans.back() + "/") != 0)
            ans.push_back(f);
    }
    return ans;
}`,
    slots: [
      { id: 'VALIDATE_MODE', label: 'Pattern validation strategy', hint: 'sort + prefix check (1233) vs suffix trie (1032)' },
    ],
    slotFills: {
      1032: { VALIDATE_MODE: 'suffix trie: reverse words; active frontier tracks stream suffix as pattern' },
      1233: { VALIDATE_MODE: 'sort + prefix: sort lexicographically; keep if not prefixed by last kept + "/"' },
    },
    helixOrder: [1032, 1233],
    helixDelta: {
      1032: 'Stream: suffix matching via reversed-word trie + active frontier.',
      1233: 'Sub-Folders: sort + prefix check; parent comes before child lexicographically.',
    },
    autopsies: [
      {
        cause: 'Sub-Folders: not sorting lexicographically first',
        wrong: 'without sort, parent may not come before child',
        testCase: '["/a/b","/a"] — "/a/b" processed before "/a"',
        fix: 'sort(folder.begin(), folder.end()) — parent always before child',
      },
    ],
    sayIt: [
      'Sub-Folders: sort lexicographically; keep if not prefixed by previous kept + "/".',
      'Stream: suffix validation via reversed-word trie with active frontier.',
    ],
  }),

  // ── Advanced Trie Structures ─────────────────────────────────

  'compressed-tries': e({
    xray: [
      { text: '**Compress** single-child chains into labeled edges', kind: 'signal' },
      { text: 'PATRICIA / Radix tree: memory-optimized trie', kind: 'constraint' },
    ],
    budget: ['path compression', 'string labels'],
    slottedTemplate: `struct RadixNode {
    string label;  // multiple chars per edge
    unordered_map<char, RadixNode*> children;
    bool isEnd;
};`,
    slots: [
      { id: 'COMPRESS_MODE', label: 'Compression approach', hint: 'PATRICIA vs Radix Tree' },
    ],
    slotFills: {
      0: { COMPRESS_MODE: 'PATRICIA: path-compressed; Radix: multi-char edge labels' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Over-engineering: using compressed trie when standard suffices',
        wrong: 'implement radix tree for simple insert/search',
        testCase: 'small dictionary — standard trie is faster to implement and debug',
        fix: 'start with standard trie; compress only if memory is critical',
      },
    ],
    sayIt: [
      'Compressed tries: merge single-child nodes into labeled edges; saves memory on dense tries.',
    ],
  }),

  'ternary-search-tries': e({
    xray: [
      { text: '**Three-way** branching: left, middle, right', kind: 'signal' },
      { text: 'Memory-efficient for **sparse** character sets', kind: 'constraint' },
    ],
    budget: ['ternary branching', 'memory efficient'],
    slottedTemplate: `struct TSTNode {
    char c;
    TSTNode *left, *mid, *right;
    bool isEnd;
};`,
    slots: [
      { id: 'BRANCH_ORDER', label: 'Branch ordering strategy', hint: 'left <, mid ==, right >' },
    ],
    slotFills: {
      0: { BRANCH_ORDER: 'char < node.c -> left; char == node.c -> mid; char > node.c -> right' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'TST: confusing mid pointer with eq/not-eq',
        wrong: 'only left/right pointers without mid',
        testCase: 'insert "a", search "a" — no equal branch to follow',
        fix: 'mid pointer for exact character match; left for less; right for greater',
      },
    ],
    sayIt: [
      'TST: three-way branching (less/equal/greater); memory-efficient for sparse alphabets.',
    ],
  }),

  'suffix-tries': e({
    xray: [
      { text: 'Stores **all suffixes** of a string in compressed trie', kind: 'signal' },
      { text: 'Ukkonen builds in **O(n)** time with suffix links', kind: 'constraint' },
    ],
    budget: ['suffix tree', 'ukkonen', 'generalized suffix'],
    slottedTemplate: `// Suffix Tree (Ukkonen O(n))
// Active point: (active_node, active_edge, active_length)
// Remainder: number of suffixes to insert
// Each phase adds one character, extends all existing suffixes`,
    slots: [
      { id: 'SUFFIX_TYPE', label: 'Suffix tree variant', hint: 'basic vs Ukkonen vs generalized' },
    ],
    slotFills: {
      0: { SUFFIX_TYPE: 'basic: O(n^2) naive; Ukkonen: O(n) with suffix links; generalized: terminators ($#)' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Implementing Ukkonen without understanding suffix links',
        wrong: 'skip suffix link updates — algorithm breaks',
        testCase: 'any string with repeated characters — O(n^2) instead of O(n)',
        fix: 'properly maintain active node via suffix link after each extension',
      },
    ],
    sayIt: [
      'Suffix Tree: compressed trie of all suffixes; Ukkonen O(n) construction; solves LCP, pattern search.',
    ],
  }),

  'bit-level-tries': e({
    xray: [
      { text: '**Binary trie** on 32-bit integers', kind: 'signal' },
      { text: 'Try **opposite bit** first for maximum XOR', kind: 'goal' },
    ],
    budget: ['binary trie', 'bit xor', 'max xor'],
    slottedTemplate: `class BinaryTrie {
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
    slots: [
      { id: 'BIT_RANGE', label: 'Bit range for trie', hint: '31..0 for int, 63..0 for long' },
    ],
    slotFills: {
      421: { BIT_RANGE: 'for (int i = 31; i >= 0; i--) // 32-bit signed int' },
      1707: { BIT_RANGE: 'for (int i = 31; i >= 0; i--)  // same; sort queries by m, insert nums <= m online' },
    },
    helixOrder: [421, 1707],
    helixDelta: {
      421: 'Max XOR: insert all nums; for each, greedily pick opposite bit at each level.',
      1707: 'Max XOR with constraint: sort queries by m; insert eligible nums online; query each.',
    },
    autopsies: [
      {
        cause: 'Binary trie: not using opposite bit first for max XOR',
        wrong: 'always go same bit — misses maximization',
        testCase: 'trie=[2(010)], query=1(001) — XOR=3(011) needs opposite bit path',
        fix: 'if cur->next[b ^ 1] exists, take it; else take cur->next[b]',
      },
    ],
    sayIt: [
      'Binary trie: insert numbers as 32-bit strings; max XOR = greedily pick opposite bit at each level.',
      'Max XOR query: sort queries; insert eligible nums online; O(32 * (N + Q)).',
    ],
  }),

  // ── Trie Optimization Techniques ─────────────────────────────

  'space-optimization': e({
    xray: [
      { text: '**Space** reduction: array vs hash map children', kind: 'constraint' },
      { text: '**Alphabet reduction**: store relevant chars only', kind: 'constraint' },
    ],
    budget: ['array vs hash', 'alphabet reduction', 'path compression'],
    slottedTemplate: `struct ArrayNode { Node* next[26]; bool isEnd; };   // O(1), 26*8=208 bytes
struct HashNode { unordered_map<char,Node*> next; }; // O(1) avg, less for sparse
struct RadixNode { string label; RadixNode *child; }; // path compressed`,
    slots: [
      { id: 'STORE_TYPE', label: 'Storage approach', hint: 'array vs hash vs path compressed' },
    ],
    slotFills: {
      0: { STORE_TYPE: 'array: dense alphabet, fixed overhead; hash: sparse, variable; radix: long common prefixes' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Using array-based for sparse Unicode characters',
        wrong: 'Node* next[65536] for full Unicode',
        testCase: 'insert 10 Unicode words — wastes millions of pointers',
        fix: 'use unordered_map<char, Node*> for sparse alphabets',
      },
    ],
    sayIt: [
      'Space optimization: array for dense (a-z), hash map for sparse, path compression for long prefixes.',
    ],
  }),

  'performance-tuning': e({
    xray: [
      { text: '**Performance**: isEnd flag, count tracking, char skipping', kind: 'signal' },
      { text: '**Terminal marking** for O(L) word existence', kind: 'goal' },
    ],
    budget: ['isEnd', 'count tracking', 'char skipping'],
    slottedTemplate: `// isEnd: bool terminal flag -> O(L) exact match
// wordCount: int for duplicate inserts
// prefixCount: int for prefix frequency queries
// Character skipping: compare path components directly
//   e.g., compare next folder segment instead of per-char`,
    slots: [
      { id: 'TUNE_MODE', label: 'Performance tuning approach', hint: 'speed vs memory tradeoff' },
    ],
    slotFills: {
      0: { TUNE_MODE: 'isEnd for exact match; wordCount+prefixCount for frequency; character skipping for prefix tree traversal' },
    },
    helixOrder: [],
    helixDelta: {},
    autopsies: [
      {
        cause: 'Not using isEnd — checking existence by comparing full path',
        wrong: `no terminal flag; walk all children to check if path is a word`,
        testCase: 'search("apple") where "apple" is prefix of "applesauce" — wrong match',
        fix: 'set isEnd = true on insert; check it on search',
      },
    ],
    sayIt: [
      'Performance: isEnd for exact match; count tracking for frequency; char skipping for path traversal.',
    ],
  }),

  'hybrid-approaches': e({
    xray: [
      { text: 'Combine trie with **DP**, **backtracking**, or **hash**', kind: 'signal' },
      { text: 'Each technique enhances trie for specific problems', kind: 'constraint' },
    ],
    budget: ['trie dp', 'trie backtrack', 'trie hash'],
    slottedTemplate: `// Trie + DP (1048): sort by length; dp[word] = max chain ending at word
// Trie + Backtracking (212): trie prunes board search; DFS explores cells
// Trie + Hash (676): hash set for O(1) existence + one-char variation search`,
    slots: [
      { id: 'HYBRID_TYPE', label: 'Hybrid technique', hint: 'trie+DP vs trie+backtrack vs trie+hash' },
    ],
    slotFills: {
      1048: { HYBRID_TYPE: 'DP: sort by length; dp[w] = 1 + max(dp[w without 1 char])' },
      212: { HYBRID_TYPE: 'backtracking: trie prunes path; DFS explores board; mark visited with #' },
      676: { HYBRID_TYPE: 'hash: build hash set; for each word, try removing/adding each char; check set' },
    },
    helixOrder: [1048, 212, 676],
    helixDelta: {
      1048: 'Longest String Chain: DP + hash map; for each char removal, check if predecessor exists.',
      212: 'Word Search II: trie + backtracking; trie prunes search space.',
      676: 'Magic Dictionary: hash set + one-char variation check; simpler than trie-only approach.',
    },
    autopsies: [
      {
        cause: 'String Chain: using trie when hash map is simpler',
        wrong: 'build trie of all words; for each word generate L predecessors',
        testCase: 'small N — hash map O(N * L^2) is fine; trie adds complexity',
        fix: 'use hash map for DP: dp[word] = 1 + max(dp[predecessor])',
      },
    ],
    sayIt: [
      'Hybrid approaches: trie + DP for string chains; trie + backtracking for board search; trie + hash for dictionary features.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
