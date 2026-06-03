import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <climits>
using namespace std;

`

export const charByCharLeaf = leaf('char-by-char', 'Character-by-Character', 'green', {
  template: `${CPP_HEADER}bool isPalindrome(string s) {
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    }
    return true;
}`,
  problems: [
    { id: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', companies: ['META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–8: skip non-alnum, compare lowercase; classic two-pointer palindrome.' },
  ],
  pitfalls: ['❌ Comparing without skipping non-alphanumeric characters.', '❌ Case-sensitive compare — always use tolower/toupper.'],
  edgeCases: [{ input: 'empty string', breaks: 'loop never runs → true' }, { input: '" " (only spaces)', breaks: 'skip loops pass l>r early → true' }],
  interviewTip: '💡 Palindrome → opposite ends inward, skip junk chars, compare lowercase.',
})

export const windowScanLeaf = leaf('window-scan', 'Window-Based Scanning', 'lime', {
  template: `${CPP_HEADER}int lengthOfLongestSubstring(string s) {
    int l = 0, ans = 0;
    int last[256]; fill(begin(last), end(last), -1);
    for (int r = 0; r < (int)s.size(); r++) {
        if (last[(unsigned char)s[r]] >= l) l = last[(unsigned char)s[r]] + 1;
        last[(unsigned char)s[r]] = r;
        ans = max(ans, r - l + 1);
    }
    return ans;
}`,
  problems: [
    { id: 3, title: 'Longest Substring No Repeat', slug: 'longest-substring-without-repeating-characters', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 6: invalid = char seen in window (last[c]>=l).' },
    { id: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Expand r; shrink while window covers all t; track min length.', variationCode: 'while (formed == required) { ans = min(ans, r-l+1); /* remove s[l] */ l++; }' },
  ],
  pitfalls: ['❌ Variable-window when fixed k given — or vice versa.', '❌ Forgetting to update answer inside loop.'],
  edgeCases: [{ input: 's = "", t = "a"', breaks: 'empty s never covers t' }],
  interviewTip: '💡 Substring with constraint → sliding window: expand r, shrink l when broken.',
})

export const patternMatchLeaf = leaf('pattern-match', 'Pattern Matching', 'green', {
  template: `${CPP_HEADER}int strStr(string haystack, string needle) {
    int n = (int)haystack.size(), m = (int)needle.size();
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && haystack[i+j] == needle[j]) j++;
        if (j == m) return i;
    }
    return -1;
}`,
  problems: [
    { id: 28, title: 'Find First Occurrence', slug: 'find-the-index-of-the-first-occurrence-in-a-string', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–8: naive scan; KMP or rolling hash for O(n+m) on large input.', variationCode: '// KMP: compute lps; i scans text, j tracks prefix; O(n+m)' },
    { id: 686, title: 'Repeated String Match', slug: 'repeated-string-match', companies: ['GOOGLE'], lineChanges: 'Repeat a until length >= b; check if b is substring.', variationCode: 'while (repeated.size() < b.size()) repeated += a; if (repeated.find(b) != string::npos) return count;' },
  ],
  pitfalls: ['❌ O(n*m) naive when KMP or rolling hash is expected.', '❌ Off-by-one in bounds: i <= n-m not i < n.'],
  edgeCases: [{ input: 'needle = ""', breaks: 'return 0 per spec' }, { input: 'haystack shorter than needle', breaks: 'loop never runs → -1' }],
  interviewTip: '💡 "Find pattern in text" → KMP or rolling hash for O(n+m).',
})

export const backtrackStringLeaf = leaf('backtrack-str', 'Backtracking on Strings', 'blue', {
  template: `${CPP_HEADER}void backtrack(string &digits, int i, string &cur, vector<string> &out,
                vector<string> &map) {
    if (i == (int)digits.size()) { out.push_back(cur); return; }
    string letters = map[digits[i]-'0'];
    for (char c : letters) {
        cur.push_back(c);
        backtrack(digits, i+1, cur, out, map);
        cur.pop_back();
    }
}

vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    vector<string> out;
    string cur;
    backtrack(digits, 0, cur, out, map);
    return out;
}`,
  problems: [
    { id: 17, title: 'Letter Combinations', slug: 'letter-combinations-of-a-phone-number', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–11: backtrack for each digit; map digit→letters.' },
    { id: 22, title: 'Generate Parentheses', slug: 'generate-parentheses', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Track open/close counts; add ( if open<n, add ) if close<open.', variationCode: 'if (open < n) backtrack(ans, cur+"(", open+1, close, n); if (close < open) backtrack(ans, cur+")", open, close+1, n);' },
  ],
  pitfalls: ['❌ Forgetting to pop_back after recursion (mutable state).', '❌ Not pruning invalid branches early (e.g., close > open).'],
  edgeCases: [{ input: 'empty digits string (LC 17)', breaks: 'return [] not [""]' }, { input: 'n=0 parentheses', breaks: 'return [""]' }],
  interviewTip: '💡 Generate all strings → backtracking with recursion + undo.',
})

export const stringDecomposeLeaf = leaf('string-decompose', 'String Decomposition', 'teal', {
  template: `${CPP_HEADER}vector<string> restoreIpAddresses(string s) {
    vector<string> out;
    string cur;
    function<void(int,int)> dfs = [&](int start, int seg) {
        if (seg == 4 && start == (int)s.size()) { out.push_back(cur); return; }
        if (seg == 4 || start == (int)s.size()) return;
        for (int len = 1; len <= 3 && start+len <= (int)s.size(); len++) {
            string part = s.substr(start, len);
            int val = stoi(part);
            if (val > 255 || (part.size()>1 && part[0]=='0')) break;
            string prev = cur;
            cur += (seg ? "." : "") + part;
            dfs(start+len, seg+1);
            cur = prev;
        }
    };
    dfs(0, 0);
    return out;
}`,
  problems: [
    { id: 93, title: 'Restore IP Addresses', slug: 'restore-ip-addresses', companies: ['AMAZON', 'META'], lineChanges: 'Lines 8–17: partition into 4 segments, validate 0-255, no leading zeros.', variationCode: 'for (len 1..3) { part = s.substr(start, len); val = stoi(part); if (val>255 || leadingZero) break; }' },
    { id: 241, title: 'Different Ways to Add Parentheses', slug: 'different-ways-to-add-parentheses', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Split by operator; recursively compute left and right results; combine.', variationCode: 'for (i) if (!isdigit(expr[i])) { vector<int> L = diffWays(expr.substr(0,i)), R = diffWays(expr.substr(i+1)); for (a:L) for (b:R) res.push_back(op(a,b,expr[i])); }' },
  ],
  pitfalls: ['❌ Leading zero check in IP — "01" invalid even if val=1.', '❌ 241: not memoizing when same subexpression repeated.'],
  edgeCases: [{ input: '"0000"', breaks: 'valid IP "0.0.0.0" (four single zeros)' }],
  interviewTip: '💡 Decompose string at split points → recursion + combine results.',
})

export const prefixMatchLeaf = leaf('prefix-match', 'Prefix Matching', 'purple', {
  template: `struct TrieNode {
    TrieNode* children[26];
    bool isWord;
    TrieNode() : isWord(false) { fill(begin(children), end(children), nullptr); }
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isWord = true;
    }
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isWord;
    }
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }
};`,
  problems: [
    { id: 208, title: 'Implement Trie', slug: 'implement-trie-prefix-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3–33: full trie implementation.' },
    { id: 211, title: 'Add and Search Word', slug: 'design-add-and-search-words-data-structure', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'search: when char is \'.\', DFS all 26 children; otherwise normal trie walk.', variationCode: 'bool dfs(TrieNode* node, string& word, int i) { if (!node) return false; if (i==word.size()) return node->isWord; if (word[i]!=\'.\') return dfs(node->children[word[i]-\'a\'],word,i+1); for (int c=0;c<26;c++) if (dfs(node->children[c],word,i+1)) return true; return false; }' },
  ],
  pitfalls: ['❌ Forgetting to mark end-of-word in insert.', '❌ 211: \'.\' search must try all children recursively.'],
  edgeCases: [{ input: 'search "a" on empty trie', breaks: 'root not null but no child' }],
  interviewTip: '💡 Prefix queries → trie: O(L) per insert/search; wildcard → DFS all children.',
})

export const wordDictLeaf = leaf('word-dict', 'Word Dictionary', 'purple', {
  template: `${CPP_HEADER}class TrieNode {
public:
    TrieNode* children[26];
    string word;
    TrieNode() : word("") { fill(begin(children), end(children), nullptr); }
};

class Solution {
    vector<string> ans;
    vector<int> dirs = {0,1,0,-1,0};
    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node) {
        char ch = board[r][c];
        int idx = ch - 'a';
        if (ch == '#' || !node->children[idx]) return;
        node = node->children[idx];
        if (!node->word.empty()) { ans.push_back(node->word); node->word.clear(); }
        board[r][c] = '#';
        for (int d = 0; d < 4; d++)
            dfs(board, r+dirs[d], c+dirs[d+1], node);
        board[r][c] = ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        TrieNode* root = new TrieNode();
        for (string& w : words) {
            TrieNode* node = root;
            for (char c : w) {
                int i = c - 'a';
                if (!node->children[i]) node->children[i] = new TrieNode();
                node = node->children[i];
            }
            node->word = w;
        }
        for (int i = 0; i < (int)board.size(); i++)
            for (int j = 0; j < (int)board[0].size(); j++)
                dfs(board, i, j, root);
        return ans;
    }
};`,
  problems: [
    { id: 212, title: 'Word Search II', slug: 'word-search-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 20–35: build trie from words; DFS board with trie pointer; mark visited with #.', variationCode: '// Trie + DFS — prune when no child; collect words at terminal nodes.' },
    { id: 648, title: 'Replace Words', slug: 'replace-words', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Build trie of roots; scan sentence; replace with shortest root prefix.', variationCode: 'string replace = ""; TrieNode* node = root; for (char c : word) { int i = c-\'a\'; if (!node->children[i] || node->isWord) break; node = node->children[i]; } if (node->isWord) { /* replace with root */ }' },
  ],
  pitfalls: ['❌ TLE: visiting same cell multiple times (use # to mark visited).', '❌ Duplicate words in output when same word found multiple times.'],
  edgeCases: [{ input: 'empty board', breaks: 'no cells to DFS' }, { input: 'word longer than all board paths', breaks: 'DFS depth limited by board size' }],
  interviewTip: '💡 Dictionary words on board → trie + DFS backtracking; mark visited cells.',
})
