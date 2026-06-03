import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'char-by-char': e({
    xray: [
      { text: 'A phrase is a **palindrome** if reads same forward and backward', kind: 'signal' },
      { text: 'considering only **alphanumeric** and ignoring cases', kind: 'constraint' },
    ],
    budget: ['string', 'charCompare'],
    slottedTemplate: `while (l < r) {
    {{SKIP_JUNK}}
    if ({{COMPARE}}) return false;
    l++; r--;
}`,
    slots: [
      { id: 'SKIP_JUNK', label: 'Skip non-alnum' },
      { id: 'COMPARE', label: 'Char compare' },
    ],
    slotFills: {
      125: { SKIP_JUNK: 'while (l<r && !isalnum(s[l])) l++; while (l<r && !isalnum(s[r])) r--;', COMPARE: 'tolower(s[l]) != tolower(s[r])' },
    },
    helixDelta: { 125: 'Baseline palindrome template' },
    autopsies: [
      {
        cause: 'Case-sensitive compare',
        wrong: 'if (s[l] != s[r]) return false;',
        testCase: '"Aa" after alnum filter',
        fix: 'tolower(s[l]) != tolower(s[r])',
      },
    ],
    sayIt: [
      'Palindrome → opposite ends inward.',
      'Skip non-alphanumeric, compare lowercase.',
    ],
  }),

  'window-scan': e({
    xray: [
      { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
      { text: 'Find the **minimum window** substring containing all of t', kind: 'goal' },
    ],
    budget: ['string', 'contiguous', 'maximize', 'minimize'],
    slottedTemplate: `int l = 0, ans = {{INIT}};
for (int r = 0; r < n; r++) {
    {{ADD_R}}
    while ({{INVALID}}) { {{REMOVE_L}} l++; }
    {{UPDATE_ANS}}
}`,
    slots: [
      { id: 'INIT', label: 'Initial value for answer' },
      { id: 'ADD_R', label: 'Add s[r] to window' },
      { id: 'INVALID', label: 'Invalid condition' },
      { id: 'REMOVE_L', label: 'Remove from left' },
      { id: 'UPDATE_ANS', label: 'Update answer' },
    ],
    slotFills: {
      3: { INIT: '0', ADD_R: 'last[s[r]] = r', INVALID: 'last[s[r]] >= l', REMOVE_L: 'advance l past last index', UPDATE_ANS: 'ans = max(ans, r - l + 1)' },
      76: { INIT: 'INT_MAX', ADD_R: 'freq[s[r]]++', INVALID: 'formed == required', REMOVE_L: 'freq[s[l]]--; if (freq[s[l]] < need[s[l]]) formed--', UPDATE_ANS: 'ans = min(ans, r - l + 1)' },
    },
    helixOrder: [3, 76],
    helixDelta: { 3: 'Longest no-repeat — expand; shrink on dup', 76: 'Shortest covering all t — contract while valid' },
    autopsies: [
      {
        cause: 'Forgetting to update ans inside loop',
        wrong: 'return ans after loop only once',
        testCase: 'long string with multiple windows',
        fix: 'Update ans = max/min(ans, r-l+1) each iteration',
      },
    ],
    sayIt: [
      'Sliding window: expand right until invalid, shrink left while invalid.',
      'Longest → track max; Shortest → track min while valid.',
    ],
  }),

  'pattern-match': e({
    xray: [
      { text: 'Return the **index** of the **first occurrence** of needle in haystack', kind: 'goal' },
      { text: 'Given two strings a and b, find **minimum repeats** of a to contain b', kind: 'goal' },
    ],
    budget: ['string', 'pattern'],
    slottedTemplate: `for (int i = 0; i <= n - m; i++) {
    int j = 0;
    while (j < m && {{MATCH}}) j++;
    if (j == m) return i;
}`,
    slots: [
      { id: 'MATCH', label: 'Char match check' },
    ],
    slotFills: {
      28: { MATCH: 'haystack[i+j] == needle[j]' },
      686: { MATCH: 'repeated[i+j] == needle[j]' },
    },
    helixDelta: { 28: 'Naive strStr', 686: 'Repeat a until length >= b, then find' },
    autopsies: [
      {
        cause: 'O(n*m) when KMP expected',
        wrong: 'naive double loop for large input',
        testCase: 'long needle, long haystack',
        fix: 'Use KMP or rolling hash for O(n+m)',
      },
    ],
    sayIt: [
      'Pattern matching: naive O(n*m) or KMP O(n+m).',
      '686: repeat a enough times, then standard substring check.',
    ],
  }),

  'backtrack-str': e({
    xray: [
      { text: 'Return all possible **letter combinations** the number represents', kind: 'goal' },
      { text: 'Generate all well-formed **parentheses**', kind: 'goal' },
    ],
    budget: ['string', 'recursive', 'enumerate'],
    slottedTemplate: `void backtrack({{STATE}}) {
    if ({{BASE_COND}}) { {{RECORD}}; return; }
    for ({{CHOICE}} : {{CHOICES}}) {
        {{MAKE_CHOICE}}
        backtrack({{NEXT_STATE}});
        {{UNDO_CHOICE}}
    }
}`,
    slots: [
      { id: 'STATE', label: 'State parameters' },
      { id: 'BASE_COND', label: 'Base case condition' },
      { id: 'RECORD', label: 'Record result' },
      { id: 'CHOICES', label: 'Available choices' },
      { id: 'MAKE_CHOICE', label: 'Apply choice' },
      { id: 'UNDO_CHOICE', label: 'Undo choice' },
    ],
    slotFills: {
      17: { STATE: 'string &digits, int i, string &cur, vector<string> &out, vector<string> &map', BASE_COND: 'i == digits.size()', RECORD: 'out.push_back(cur)', CHOICES: 'letters = map[digits[i]-\'0\']', MAKE_CHOICE: 'cur.push_back(c)', UNDO_CHOICE: 'cur.pop_back()' },
      22: { STATE: 'vector<string> &ans, string cur, int open, int close, int n', BASE_COND: 'cur.size() == 2*n', RECORD: 'ans.push_back(cur)', CHOICES: 'open < n ? \'(\' : \'\'', MAKE_CHOICE: 'cur + \'(\'; open+1', UNDO_CHOICE: 'pop_back (or pass by value)' },
    },
    helixOrder: [17, 22],
    helixDelta: { 17: 'Digit→letters map', 22: 'Track open/close counts' },
    autopsies: [
      {
        cause: 'Mutable state not undone',
        wrong: 'cur.push_back(c); backtrack(...); // no pop_back',
        testCase: 'recursion tree > 2 levels',
        fix: 'cur.pop_back() after recursive call',
      },
    ],
    sayIt: [
      'Backtracking: build string, recurse, undo.',
      '17: map digit to letters. 22: track open/close count.',
    ],
  }),

  'string-decompose': e({
    xray: [
      { text: 'Return all valid **IP addresses** by inserting dots', kind: 'goal' },
      { text: 'Return all **ways to compute** expression by splitting on operators', kind: 'goal' },
    ],
    budget: ['string', 'recursive', 'enumerate'],
    slottedTemplate: `void dfs(int start, {{SEG_STATE}}) {
    if ({{DONE}}) { {{RECORD}}; return; }
    for (int len = {{MIN_LEN}}; len <= {{MAX_LEN}} && start+len <= n; len++) {
        string part = s.substr(start, len);
        if ({{VALID_PART}}) {
            {{ADD_SEGMENT}}
            dfs(start+len, {{NEXT_SEG}});
            {{REMOVE_SEGMENT}}
        }
    }
}`,
    slots: [
      { id: 'SEG_STATE', label: 'Segment state' },
      { id: 'DONE', label: 'Done condition' },
      { id: 'RECORD', label: 'Record result' },
      { id: 'MIN_LEN', label: 'Min segment length' },
      { id: 'MAX_LEN', label: 'Max segment length' },
      { id: 'VALID_PART', label: 'Segment validation' },
      { id: 'ADD_SEGMENT', label: 'Add segment to result' },
      { id: 'REMOVE_SEGMENT', label: 'Remove segment' },
    ],
    slotFills: {
      93: { SEG_STATE: 'int seg', DONE: 'seg == 4 && start == n', RECORD: 'out.push_back(cur)', MIN_LEN: '1', MAX_LEN: '3', VALID_PART: 'val <= 255 && !(part[0]==\'0\' && len>1)', ADD_SEGMENT: 'cur += (seg ? ".":"") + part', REMOVE_SEGMENT: 'restore cur length' },
      241: { SEG_STATE: 'none (returns vector<int>)', DONE: 'return all results', RECORD: 'base: single number', MIN_LEN: '1', MAX_LEN: 'n-start', VALID_PART: 'isdigit(expr[start]) ensuring number or split at op', ADD_SEGMENT: 'combine left + right results', REMOVE_SEGMENT: 'none (immutable)' },
    },
    helixDelta: { 93: 'Restore IP — 4 segments, validate 0-255', 241: 'Expression — split by operator, combine results' },
    autopsies: [
      {
        cause: 'Leading zero not rejected',
        wrong: 'stoi("01") == 1 → accepted',
        testCase: '"01" as IP segment',
        fix: 'if (part[0]==\'0\' && len>1) break;',
      },
    ],
    sayIt: [
      'Decompose: split string, validate each part, recurse.',
      '93: 4 segments, 0-255, no leading zeros.',
      '241: split at operators, compute left + right, combine.',
    ],
  }),

  'prefix-match': e({
    xray: [
      { text: '**Implement a trie** with insert, search, and startsWith', kind: 'goal' },
      { text: 'Design a data structure that supports **wildcard dot** (.)', kind: 'constraint' },
    ],
    budget: ['string', 'trie', 'prefixQuery'],
    slottedTemplate: `TrieNode* node = root;
for (char c : word) {
    int idx = c - 'a';
    if (!node->children[idx]) {{ON_MISS}};
    node = node->children[idx];
}
{{FINISH}}`,
    slots: [
      { id: 'ON_MISS', label: 'When child missing' },
      { id: 'FINISH', label: 'After traversal' },
    ],
    slotFills: {
      208: { ON_MISS: 'node->children[idx] = new TrieNode() // insert; return false // search', FINISH: 'node->isWord = true (insert); return node->isWord (search); return true (startsWith)' },
      211: { ON_MISS: 'return false // insert; DFS all 26 children if char==\'.\'', FINISH: 'return node->isWord (search); DFS on dot' },
    },
    helixDelta: { 208: 'Basic trie  insert/search/startsWith', 211: 'Add wildcard . — DFS all children' },
    autopsies: [
      {
        cause: 'Not marking end of word',
        wrong: 'insert sets children but not isWord',
        testCase: 'insert("apple"), search("apple")',
        fix: 'node->isWord = true after insert loop',
      },
    ],
    sayIt: [
      'Trie: 26 children per node; insert and search are O(L).',
      'Wildcard . → DFS all children recursively.',
    ],
  }),

  'word-dict': e({
    xray: [
      { text: 'Given a **board** of letters and a **dictionary**, find all words on board', kind: 'goal' },
      { text: '**Replace** words in a sentence with their **shortest root** from dictionary', kind: 'goal' },
    ],
    budget: ['string', 'trie', 'dictionary', 'boardDFS'],
    slottedTemplate: `void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node) {
    char ch = board[r][c];
    int idx = ch - 'a';
    if (ch == '#' || !node->children[idx]) return;
    node = node->children[idx];
    if (!node->word.empty()) { ans.push_back(node->word); node->word.clear(); }
    board[r][c] = '#';
    for (int d = 0; d < 4; d++)
        dfs(board, r+dirs[d], c+dirs[d+1], node);
    board[r][c] = ch;
}`,
    slots: [
      { id: 'ON_MATCH', label: 'When word found' },
      { id: 'MARK_VISITED', label: 'Mark visited' },
      { id: 'UNMARK', label: 'Restore cell' },
    ],
    slotFills: {
      212: { ON_MATCH: 'ans.push_back(node->word); node->word.clear()', MARK_VISITED: 'board[r][c] = \'#\'', UNMARK: 'board[r][c] = ch' },
      648: { ON_MATCH: 'replace word with root prefix', MARK_VISITED: 'N/A (sentence scan)', UNMARK: 'N/A' },
    },
    helixDelta: { 212: 'Trie + DFS on board — mark visited with #', 648: 'Replace words — scan sentence, shortest root match' },
    autopsies: [
      {
        cause: 'TLE from revisiting cells',
        wrong: 'no visited marking, infinite loop',
        testCase: 'board with cycles',
        fix: 'Mark board[r][c] = \'#\' before DFS neighbors, restore after',
      },
      {
        cause: 'Duplicate words in output',
        wrong: 'calling ans.push_back every time word is found',
        testCase: 'same word reachable via multiple paths',
        fix: 'node->word.clear() after collecting to dedupe',
      },
    ],
    sayIt: [
      'Word Search II: build trie from dict, DFS board with trie pointer.',
      'Mark visited cells with #, restore after backtrack.',
      '648: build trie of roots; scan sentence replacing with shortest root.',
    ],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
