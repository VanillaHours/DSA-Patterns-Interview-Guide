import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <stack>
#include <queue>
#include <deque>
#include <algorithm>
#include <climits>
#include <cctype>
using namespace std;

`

// ── Stack Applications ────────────────────────────────────────────

export const basicParenLeaf = leaf('basic-paren', 'Basic Validation', 'blue', {
  template: `${CPP_HEADER}bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) return false;
        }
    }
    return st.empty();
}`,
  problems: [
    { id: 20, title: 'Valid Parentheses', slug: 'valid-parentheses', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–13: as-is (push openers, pop + match closers).' },
    { id: 1003, title: 'Valid Substitutions', slug: 'check-if-word-is-valid-after-substitutions', companies: ['GOOGLE'], lineChanges: 'Line: push chars; if top-2 form "abc", pop 3.', variationCode: 'st.push(c); if (st.size()>=3) { string t; for i:0..2 { t+=st.top(); st.pop(); } reverse(t); if(t!="abc"){ for(char x:t) st.push(x); } }' },
    { id: 591, title: 'Tag Validator', slug: 'tag-validator', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Full parser: push/pop tags, handle cdata, check nesting rules.', variationCode: '// complex state machine with stack<string> for tag names' },
  ],
  pitfalls: ['❌ Checking all three bracket types with if-else chain — forget to check empty stack.', '❌ Using map<char,char> for matching is cleaner but slower.'],
  interviewTip: '💡 "Valid parentheses" → stack push openers, pop + match closers; empty check at end.',
})

export const advancedParenLeaf = leaf('advanced-paren', 'Advanced Matching', 'teal', {
  template: `${CPP_HEADER}int longestValidParentheses(string s) {
    stack<int> st; st.push(-1);
    int ans = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] == '(') st.push(i);
        else {
            st.pop();
            if (st.empty()) st.push(i);
            else ans = max(ans, i - st.top());
        }
    }
    return ans;
}`,
  problems: [
    { id: 32, title: 'Longest Valid Parens', slug: 'longest-valid-parentheses', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–11: as-is (push idx of ( ; pop on ) and compute length).' },
      { id: 856, title: 'Score of Parens', slug: 'score-of-parentheses', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: stack<int> scores; push 0; on ( push 0; on ) pop and double/scoring.', variationCode: "if (s[i]=='(') st.push(0); else { int cur=st.top(); st.pop(); st.top() += max(2*cur,1); }" },
      { id: 1249, title: 'Min Remove Valid', slug: 'minimum-remove-to-make-valid-parentheses', companies: ['META', 'MICROSOFT'], lineChanges: 'Track unmatched ( indices in stack; mark ) when stack empty.', variationCode: "stack<int> open; set<int> remove; for i,c: if(c=='(') open.push(i); else if(c==')') { if(open.empty()) remove.insert(i); else open.pop(); } while(!open.empty()){remove.insert(open.top()); open.pop();}" },
  ],
  pitfalls: ['❌ LC 32: forgetting to push latest unmatched ) as new base index.', '❌ LC 1249: forgetting to add remaining ( indices to remove set.'],
  interviewTip: '💡 "Longest valid / min remove" → stack of indices, track unmatched positions.',
})

export const nextGreaterLeaf = leaf('next-greater', 'Next Greater / Smaller', 'blue', {
  template: `${CPP_HEADER}vector<int> dailyTemperatures(vector<int>& t) {
    int n = (int)t.size();
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && t[i] > t[st.top()]) {
            ans[st.top()] = i - st.top();
            st.pop();
        }
        st.push(i);
    }
    return ans;
}`,
  problems: [
    { id: 496, title: 'Next Greater I', slug: 'next-greater-element-i', companies: ['AMAZON', 'META'], lineChanges: 'Line: monotonic stack on nums2; map next-greater for each.', variationCode: 'unordered_map<int,int> nge; stack<int> st; for(int x:nums2){ while(!st.empty()&&x>st.top()){ nge[st.top()]=x; st.pop(); } st.push(x); }' },
    { id: 503, title: 'Next Greater II', slug: 'next-greater-element-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: traverse 2*n-1 with i%n for circular wrap.', variationCode: 'for (int i = 0; i < 2*n; i++) { while(!st.empty()&&nums[i%n]>nums[st.top()]){ ans[st.top()]=nums[i%n]; st.pop(); } if(i<n) st.push(i); }' },
    { id: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–11: as-is (store indices, compute gap).' },
  ],
  pitfalls: ['❌ Brute force O(n²) when monotonic stack O(n) exists.', '❌ Circular array (503): forgetting to iterate 2*n-1.'],
  interviewTip: '💡 "Next greater element" → monotonic decreasing stack of indices.',
})

export const histogramLeaf = leaf('histogram', 'Histogram & Area', 'teal', {
  template: `${CPP_HEADER}int largestRectangleArea(vector<int>& h) {
    h.push_back(0);
    stack<int> st;
    int ans = 0;
    for (int i = 0; i < (int)h.size(); i++) {
        while (!st.empty() && h[i] < h[st.top()]) {
            int height = h[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();
            ans = max(ans, height * (i - left - 1));
        }
        st.push(i);
    }
    return ans;
}`,
  problems: [
    { id: 84, title: 'Largest Rectangle', slug: 'largest-rectangle-in-histogram', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–13: as-is (monotonic increasing stack + sentinel 0).' },
      { id: 85, title: 'Maximal Rectangle', slug: 'maximal-rectangle', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: build histogram per row (1+prev if char==1), run LC 84 per row.', variationCode: "for each row: update heights[j] = matrix[i][j]=='1' ? heights[j]+1 : 0; ans = max(ans, largestRectangleArea(heights));" },
    { id: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: monotonic stack — pop when rising, add trapped water.', variationCode: 'while(!st.empty()&&h[i]>h[st.top()]){ int bot=st.top(); st.pop(); if(st.empty()) break; int left=st.top(); ans+=(min(h[left],h[i])-h[bot])*(i-left-1); } st.push(i);' },
  ],
  pitfalls: ['❌ LC 84: forgetting sentinel 0 at end to flush stack.', '❌ LC 85: forgetting to reset height on 0 row.'],
  interviewTip: '💡 "Largest rectangle / trap water" → monotonic stack with index and height tracking.',
})

export const rangeOptLeaf = leaf('range-opt', 'Range Optimization', 'teal', {
  template: `${CPP_HEADER}int maxSumMinProduct(vector<int>& nums) {
    int n = (int)nums.size();
    vector<long> pref(n+1,0);
    for (int i=0;i<n;i++) pref[i+1]=pref[i]+nums[i];
    stack<int> st;
    long ans = 0;
    for (int i=0;i<=n;i++) {
        int cur = i<n ? nums[i] : 0;
        while (!st.empty() && cur < nums[st.top()]) {
            int idx = st.top(); st.pop();
            int l = st.empty() ? 0 : st.top()+1;
            int r = i-1;
            ans = max(ans, (pref[r+1]-pref[l]) * nums[idx]);
        }
        st.push(i);
    }
    return (int)(ans % 1000000007);
}`,
  problems: [
    { id: 1856, title: 'Max Min-Product', slug: 'maximum-subarray-min-product', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 6–16: as-is (monotonic + prefix sum for subarray sum on each popped min).' },
    { id: 907, title: 'Sum Subarray Mins', slug: 'sum-of-subarray-minimums', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: for each pop, count subarrays where element is min = (i - idx) * (idx - left) * val.', variationCode: 'ans = (ans + (i-idx) * (idx - (st.empty()?-1:st.top())) * nums[idx]) % mod;' },
  ],
  pitfalls: ['❌ Integer overflow with prefix sums and multiplications — use long.', '❌ Off-by-one on left/right bounds when computing subarray count.'],
  interviewTip: '💡 "Subarray min-product / sum of mins" → monotonic stack + prefix sum + contribution formula.',
})

export const infixCalcLeaf = leaf('infix-calc', 'Infix Calculation', 'blue', {
  template: `${CPP_HEADER}int calculate(string s) {
    stack<int> nums;
    stack<char> ops;
    auto apply = [&]{ int b=nums.top(); nums.pop(); int a=nums.top(); nums.pop(); char op=ops.top(); ops.pop(); if(op=='+') nums.push(a+b); else nums.push(a-b); };
    for (int i=0;i<(int)s.size();i++) {
        if (isdigit(s[i])) { int n=0; while(i<(int)s.size()&&isdigit(s[i])) n=n*10+s[i++]-'0'; i--; nums.push(n); }
        else if (s[i]=='(') ops.push('(');
        else if (s[i]==')') { while(ops.top()!='(') apply(); ops.pop(); }
        else if (s[i]=='+'||s[i]=='-') { while(!ops.empty()&&ops.top()!='(') apply(); ops.push(s[i]); }
    }
    while(!ops.empty()) apply();
    return nums.top();
}`,
  problems: [
    { id: 224, title: 'Basic Calculator', slug: 'basic-calculator', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–14: as-is (+/- with parentheses).' },
    { id: 227, title: 'Calculator II', slug: 'basic-calculator-ii', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line: process * / immediately, store +/- values in stack, sum at end.', variationCode: "if (op=='+') st.push(n); else if (op=='-') st.push(-n); else if (op=='*'||op=='/') { int prev=st.top(); st.pop(); st.push(op=='*'?prev*n:prev/n); }" },
    { id: 772, title: 'Calculator III', slug: 'basic-calculator-iii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Combines I + II: +/-/*// with parentheses.', variationCode: '// recursive or stack: precedence handling + parens' },
  ],
  pitfalls: ['❌ Operator precedence: * / before + -.', '❌ Handling negative numbers and consecutive operators.'],
  interviewTip: '💡 "Calculator" → two stacks (nums + ops) or single stack with running value and sign.',
})

export const postfixLeaf = leaf('postfix', 'Postfix / Prefix Processing', 'teal', {
  template: `${CPP_HEADER}int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for (string& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (t == "+") st.push(a+b);
            else if (t == "-") st.push(a-b);
            else if (t == "*") st.push(a*b);
            else st.push(a/b);
        } else st.push(stoi(t));
    }
    return st.top();
}`,
  problems: [
    { id: 150, title: 'Evaluate RPN', slug: 'evaluate-reverse-polish-notation', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–13: as-is (stack push/pop for postfix eval).' },
    { id: 636, title: 'Exclusive Time', slug: 'exclusive-time-of-functions', companies: ['META', 'GOOGLE', 'AMAZON'], lineChanges: 'Line: stack of function ids; track prev timestamp; on end pop and add duration.', variationCode: "stack<int> fn; vector<int> ans(n,0); int prev=0; for(auto& log:logs){ int id,ts; char type[10]; sscanf(log.c_str(),\"%d:%[^:]:%d\",&id,type,&ts); if(type[0]=='s'){ if(!fn.empty()) ans[fn.top()]+=ts-prev; fn.push(id); prev=ts; } else { ans[fn.top()]+=ts-prev+1; fn.pop(); prev=ts+1; } }" },
  ],
  pitfalls: ['❌ Reversing a and b in subtraction/division — order matters!', '❌ LC 636: off-by-one on timestamp boundary (end timestamp is exclusive vs inclusive).'],
  interviewTip: '💡 "Postfix / RPN" → push operands, pop two on operator, push result.',
})

// ── Stack for Traversal ───────────────────────────────────────────

export const treeTraversalLeaf = leaf('tree-traversal', 'Tree Traversal (Iterative)', 'green', {
  template: `struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x): val(x), left(nullptr), right(nullptr) {} };

vector<int> inorderTraversal(TreeNode* root) {
    vector<int> out;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        out.push_back(cur->val);
        cur = cur->right;
    }
    return out;
}`,
  problems: [
    { id: 94, title: 'Inorder Traversal', slug: 'binary-tree-inorder-traversal', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–14: as-is (stack for left-chain, pop visit, go right).' },
    { id: 144, title: 'Preorder Traversal', slug: 'binary-tree-preorder-traversal', companies: ['AMAZON', 'META'], lineChanges: 'Line: visit root before pushing children; push right then left.', variationCode: 'st.push(root); while(!st.empty()){ auto* n=st.top(); st.pop(); out.push_back(n->val); if(n->right) st.push(n->right); if(n->left) st.push(n->left); }' },
    { id: 145, title: 'Postorder Traversal', slug: 'binary-tree-postorder-traversal', companies: ['AMAZON'], lineChanges: 'Line: root→right→left (modified preorder) then reverse.', variationCode: 'st.push(root); while(!st.empty()){ auto* n=st.top(); st.pop(); out.push_back(n->val); if(n->left) st.push(n->left); if(n->right) st.push(n->right); } reverse(out);' },
  ],
  pitfalls: ['❌ Inorder: forgetting the inner while loop to push all left children.', '❌ Postorder: using two-stack technique when reverse-preorder is simpler.'],
  interviewTip: '💡 "Iterative tree traversal" → stack simulates call stack; preorder push right then left.',
})

export const graphTraversalLeaf = leaf('graph-traversal', 'Graph Traversal (Stack)', 'lime', {
  template: `// DFS with explicit stack (clone graph example)
class Node { public: int val; vector<Node*> neighbors; Node(int v): val(v) {} };

Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node*,Node*> m;
    stack<Node*> st; st.push(node);
    m[node] = new Node(node->val);
    while (!st.empty()) {
        auto* cur = st.top(); st.pop();
        for (auto* nb : cur->neighbors) {
            if (!m.count(nb)) { m[nb] = new Node(nb->val); st.push(nb); }
            m[cur]->neighbors.push_back(m[nb]);
        }
    }
    return m[node];
}`,
  problems: [
    { id: 133, title: 'Clone Graph', slug: 'clone-graph', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–16: as-is (DFS stack + old→new map).' },
    { id: 341, title: 'Nested Iterator', slug: 'flatten-nested-list-iterator', companies: ['GOOGLE', 'META', 'AMAZON', 'APPLE'], lineChanges: 'Line: stack of iterators over nested lists; hasNext flattens on demand.', variationCode: 'stack<NestedInteger> st; NestedIterator(vector<NestedInteger>& list){ for(int i=list.size()-1;i>=0;i--) st.push(list[i]); } int next(){ int v=st.top().getInteger(); st.pop(); return v; }' },
  ],
  pitfalls: ['❌ 133: forgetting to mark visited — infinite loop on cycles.', '❌ 341: flattening everything in constructor instead of lazy hasNext.'],
  interviewTip: '💡 "Clone / DFS stack" → explicit stack + visited map avoids recursion depth issues.',
})

// ── Queue Applications ────────────────────────────────────────────

export const levelOrderLeaf = leaf('level-order', 'Tree Level Order', 'green', {
  template: `struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x): val(x), left(nullptr), right(nullptr) {} };

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> out;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            auto* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
    }
    return out;
}`,
  problems: [
    { id: 102, title: 'Level Order', slug: 'binary-tree-level-order-traversal', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 7–17: as-is (BFS with level-size loop).' },
    { id: 103, title: 'Zigzag Level Order', slug: 'binary-tree-zigzag-level-order-traversal', companies: ['META', 'AMAZON'], lineChanges: 'Line: toggle bool leftToRight; reverse level if needed.', variationCode: 'if (!l2r) reverse(level.begin(),level.end()); l2r = !l2r;' },
    { id: 116, title: 'Populate Next Right', slug: 'populating-next-right-pointers-in-each-node', companies: ['META', 'GOOGLE', 'AMAZON'], lineChanges: 'Line: connect level via prev pointer or parent->next->left pattern.', variationCode: 'for i 0..sz-1: if(i<sz-1) q.front()->next=q.back(); // or use parent next pointers' },
  ],
  pitfalls: ['❌ Forgetting to capture queue size before loop — queue size changes as you push children.', '❌ LC 116: using extra queue when O(1) space next-pointer walk is better.'],
  interviewTip: '💡 "Level order" → BFS queue, capture size before iterating the level.',
})

export const graphBfsLeaf = leaf('graph-bfs', 'Graph BFS', 'teal', {
  template: `int numIslands(vector<vector<char>>& grid) {
    int m = (int)grid.size(), n = (int)grid[0].size(), ans = 0;
    int dirs[5] = {0,1,0,-1,0};
    queue<pair<int,int>> q;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == '1') {
                ans++; q.push({i,j}); grid[i][j] = '0';
                while (!q.empty()) {
                    auto [x,y] = q.front(); q.pop();
                    for (int d = 0; d < 4; d++) {
                        int nx = x+dirs[d], ny = y+dirs[d+1];
                        if (nx>=0 && nx<m && ny>=0 && ny<n && grid[nx][ny]=='1') {
                            q.push({nx,ny}); grid[nx][ny] = '0';
                        }
                    }
                }
            }
    return ans;
}`,
  problems: [
    { id: 200, title: 'Number of Islands', slug: 'number-of-islands', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 6–20: as-is (BFS flood fill).' },
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: multi-source BFS from all rotten; count minutes.', variationCode: 'for i,j: if(grid[i][j]==2) q.push({i,j}); while(!q.empty()){ int sz=q.size(); for i 0..sz-1{ auto[x,y]=q.front(); q.pop(); for 4 dirs: if fresh: grid[nx][ny]=2; q.push({nx,ny}); } if(!q.empty()) minutes++; }' },
    { id: 127, title: 'Word Ladder', slug: 'word-ladder', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: BFS on word graph; replace each char a-z, check set.', variationCode: "unordered_set<string> dict(wordList.begin(),wordList.end()); queue<string> q; q.push(beginWord); int steps=1; while(!q.empty()){ int sz=q.size(); while(sz--){ string w=q.front(); q.pop(); for i..w.size(){ char orig=w[i]; for c 'a'..'z'{ w[i]=c; if(dict.count(w)){ if(w==endWord) return steps+1; q.push(w); dict.erase(w); } } w[i]=orig; } } steps++; }" },
  ],
  pitfalls: ['❌ LC 200: marking visited before pushing, not after popping (infinite loop).', '❌ LC 127: generating all words from set instead of transforming one char at a time.'],
  interviewTip: '💡 "Graph BFS" → queue + early visited marking + direction array.',
})

export const slidingWinQueueLeaf = leaf('sliding-win-queue', 'Sliding Window with Queue', 'lime', {
  template: `${CPP_HEADER}vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> out;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) out.push_back(nums[dq.front()]);
    }
    return out;
}`,
  problems: [
    { id: 239, title: 'Sliding Window Max', slug: 'sliding-window-maximum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–10: as-is (deque stores indices, monotonic decreasing values).' },
  ],
  pitfalls: ['❌ Using priority queue (O(n log k)) when deque is O(n).', '❌ Forgetting to pop out-of-window indices from front.'],
  interviewTip: '💡 "Sliding window max" → monotonic decreasing deque (indices, not values).',
})

export const multiSourceBfsLeaf = leaf('multi-source-bfs', 'Multi-Source BFS', 'teal', {
  template: `${CPP_HEADER}vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int m = (int)mat.size(), n = (int)mat[0].size();
    vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
    queue<pair<int,int>> q;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (mat[i][j] == 0) { dist[i][j] = 0; q.push({i,j}); }
    int dirs[5] = {0,1,0,-1,0};
    while (!q.empty()) {
        auto [x,y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x+dirs[d], ny = y+dirs[d+1];
            if (nx>=0 && nx<m && ny>=0 && ny<n && dist[nx][ny] > dist[x][y] + 1) {
                dist[nx][ny] = dist[x][y] + 1;
                q.push({nx,ny});
            }
        }
    }
    return dist;
}`,
  problems: [
    { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], lineChanges: 'Line: push all rotten oranges as sources; BFS layer = minute.', variationCode: 'for i,j: if(grid[i][j]==2) q.push({i,j}); // same multi-source BFS' },
    { id: 1162, title: 'As Far from Land', slug: 'as-far-from-land-as-possible', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Line: push all land cells as sources; BFS for max water distance.', variationCode: 'for i,j: if(grid[i][j]==1) { dist[i][j]=0; q.push({i,j}); }' },
    { id: 542, title: '01 Matrix', slug: '01-matrix', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–19: as-is (multi-source BFS from all zeros).' },
  ],
  pitfalls: ['❌ Running BFS from each source separately (O(n²)) instead of multi-source BFS (O(n)).', '❌ Not using dist[][] for both visited check and distance tracking.'],
  interviewTip: '💡 "Multi-source BFS" → push all initial sources into queue, BFS outward simultaneously.',
})

// ── Task Processing ───────────────────────────────────────────────

export const taskProcessingLeaf = leaf('task-processing', 'Task Processing', 'amber', {
  template: `${CPP_HEADER}int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {0};
    for (char c : tasks) freq[c-'A']++;
    sort(freq, freq+26);
    int maxF = freq[25], idle = (maxF-1) * n;
    for (int i = 24; i >= 0 && freq[i] > 0; i--)
        idle -= min(maxF-1, freq[i]);
    return idle > 0 ? (int)tasks.size() + idle : (int)tasks.size();
}`,
  problems: [
    { id: 621, title: 'Task Scheduler', slug: 'task-scheduler', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (greedy: maxFreq * (n+1) format with idle slots).' },
    { id: 933, title: 'Recent Calls', slug: 'number-of-recent-calls', companies: ['META'], lineChanges: 'Line: queue<int>; push t; while front < t-3000 pop; return size.', variationCode: 'queue<int> q; int ping(int t){ q.push(t); while(q.front()<t-3000) q.pop(); return q.size(); }' },
    { id: 353, title: 'Snake Game', slug: 'design-snake-game', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: deque for snake body; set for positions; move head push, check food, maybe pop tail.', variationCode: 'deque<pair<int,int>> snake; unordered_set<int> seen; // body positions as int key' },
  ],
  pitfalls: ['❌ LC 621: negative idle — if idle < 0, no idle needed.', '❌ LC 933: not using queue for time window.'],
  interviewTip: '💡 "Task scheduler" → max frequency determines minimum frames; idle = (maxF-1)*n.',
})

// ── Specialized Queue Variants ────────────────────────────────────

export const monotonicDequeLeaf = leaf('monotonic-deque', 'Monotonic Deque', 'purple', {
  template: `${CPP_HEADER}int longestSubarray(vector<int>& nums, int limit) {
    deque<int> maxD, minD;
    int l = 0, ans = 0;
    for (int r = 0; r < (int)nums.size(); r++) {
        while (!maxD.empty() && nums[maxD.back()] < nums[r]) maxD.pop_back();
        while (!minD.empty() && nums[minD.back()] > nums[r]) minD.pop_back();
        maxD.push_back(r); minD.push_back(r);
        while (nums[maxD.front()] - nums[minD.front()] > limit) {
            if (maxD.front() == l) maxD.pop_front();
            if (minD.front() == l) minD.pop_front();
            l++;
        }
        ans = max(ans, r - l + 1);
    }
    return ans;
}`,
  problems: [
    { id: 239, title: 'Sliding Window Max', slug: 'sliding-window-maximum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: monotonic decreasing deque; front = max of window.', variationCode: '// same as slidingWinQueueLeaf template' },
    { id: 1438, title: 'Abs Diff Limit', slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–15: as-is (maintain max+min deque, shrink l when diff > limit).' },
  ],
  pitfalls: ['❌ LC 1438: forgetting to pop from both deques when shrinking window.', '❌ Using multiset (O(n log n)) when deque gives O(n).'],
  interviewTip: '💡 "Sliding window with min/max" → two deques (max decreasing, min increasing).',
})

export const generalDequeLeaf = leaf('general-deque', 'General Deque Uses', 'pink', {
  template: `${CPP_HEADER}vector<int> deckRevealedIncreasing(vector<int>& deck) {
    sort(deck.begin(), deck.end());
    int n = (int)deck.size();
    deque<int> dq;
    for (int i = n-1; i >= 0; i--) {
        if (!dq.empty()) { dq.push_front(dq.back()); dq.pop_back(); }
        dq.push_front(deck[i]);
    }
    return vector<int>(dq.begin(), dq.end());
}`,
  problems: [
    { id: 950, title: 'Reveal Cards', slug: 'reveal-cards-in-increasing-order', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 5–9: as-is (reverse simulation with deque).' },
    { id: 641, title: 'Circular Deque', slug: 'design-circular-deque', companies: ['AMAZON'], lineChanges: 'Line: array + head/tail indices; insertFront/insertLast/deleteFront/deleteLast.', variationCode: 'int buf[K], head=0, tail=0, size=0, cap=K; bool insertFront(int v){ if(size==cap) return false; head=(head-1+cap)%cap; buf[head]=v; size++; return true; }' },
  ],
  pitfalls: ['❌ LC 950: not simulating correctly — skip then place is the key operation.', '❌ LC 641: off-by-one on circular index wrap-around.'],
  interviewTip: '💡 "Deque simulation / circular design" → push_front/pop_back pattern for queue simulation.',
})

export const topKSelectorLeaf = leaf('topk-select', 'Top-K Selection', 'purple', {
  template: `${CPP_HEADER}int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();
    }
    return pq.top();
}`,
  problems: [
    { id: 215, title: 'Kth Largest', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (min-heap of size k).' },
    { id: 347, title: 'Top K Frequent', slug: 'top-k-frequent-elements', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: freq map + min-heap of size k by frequency.', variationCode: 'unordered_map<int,int> f; for(int x:nums) f[x]++; priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq; for(auto& [n,c]:f){ pq.push({c,n}); if(pq.size()>k) pq.pop(); }' },
  ],
  pitfalls: ['❌ Using max-heap with all elements (O(n log n)) instead of min-heap of size k (O(n log k)).', '❌ LC 347: comparing by value, not frequency.'],
  interviewTip: '💡 "Kth largest / top K" → min-heap of size k keeps the k largest elements.',
})

export const greedySchedLeaf = leaf('greedy-sched', 'Greedy Scheduling', 'orange', {
  template: `${CPP_HEADER}int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        if (a != b) pq.push(a - b);
    }
    return pq.empty() ? 0 : pq.top();
}`,
  problems: [
    { id: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (max-heap, smash two largest).' },
    { id: 253, title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: sort by start; min-heap of end times; pop finished rooms.', variationCode: 'sort(intervals.begin(),intervals.end()); priority_queue<int,vector<int>,greater<>> pq; pq.push(intervals[0][1]); for i 1..n-1{ if(pq.top()<=intervals[i][0]) pq.pop(); pq.push(intervals[i][1]); } return pq.size();' },
  ],
  pitfalls: ['❌ LC 253: sorting by end instead of start — incorrect.', '❌ Min-heap tracks earliest ending, not maximum.'],
  interviewTip: '💡 "Meeting rooms / greedy scheduling" → sort by start, min-heap for end times.',
})

export const circularQueueLeaf = leaf('circular-queue', 'Circular Queue', 'pink', {
  template: `class MyCircularQueue {
    vector<int> buf;
    int head, tail, size, cap;
public:
    MyCircularQueue(int k) : buf(k), head(0), tail(0), size(0), cap(k) {}
    bool enQueue(int v) {
        if (isFull()) return false;
        buf[tail] = v;
        tail = (tail + 1) % cap;
        size++;
        return true;
    }
    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        size--;
        return true;
    }
    int Front() { return isEmpty() ? -1 : buf[head]; }
    int Rear() { return isEmpty() ? -1 : buf[(tail-1+cap)%cap]; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == cap; }
};`,
  problems: [
    { id: 622, title: 'Design Circular Queue', slug: 'design-circular-queue', companies: ['AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–23: as-is (circular buffer with head/tail tracking).' },
    { id: 1823, title: 'Circular Game', slug: 'find-the-winner-of-the-circular-game', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: queue simulation or Josephus formula O(n).', variationCode: 'queue<int> q; for i 1..n q.push(i); while(q.size()>1){ for i 0..k-2{ q.push(q.front()); q.pop(); } q.pop(); } return q.front();' },
  ],
  pitfalls: ['❌ Forgetting modulo wrap on tail/head indices.', '❌ Not handling empty/full states separately.'],
  interviewTip: '💡 "Circular queue" → fixed array + head/tail with modulo arithmetic.',
})

// ── Queue Reconstruction ──────────────────────────────────────────

export const queueReconLeaf = leaf('queue-recon', 'Queue Reconstruction', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
    sort(people.begin(), people.end(), [](auto& a, auto& b) {
        return a[0] != b[0] ? a[0] > b[0] : a[1] < b[1];
    });
    vector<vector<int>> out;
    for (auto& p : people) out.insert(out.begin() + p[1], p);
    return out;
}`,
  problems: [
    { id: 406, title: 'Queue Reconstruction', slug: 'queue-reconstruction-by-height', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (sort tall first, insert by k-index).' },
    { id: 649, title: 'Dota2 Senate', slug: 'dota2-senate', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: two queues for Radiant/Dire indices; compare front, smaller wins.', variationCode: 'queue<int> r,d; for i,c: if(c==\'R\') r.push(i); else d.push(i); while(!r.empty()&&!d.empty()){ int ri=r.front(),di=d.front(); r.pop(); d.pop(); if(ri<di) r.push(ri+n); else d.push(di+n); } return r.empty()?"Dire":"Radiant";' },
  ],
  pitfalls: ['❌ LC 406: not sorting height descending / k ascending.', '❌ LC 649: not accounting for round index offset (n) when comparing.'],
  interviewTip: '💡 "Queue reconstruction" → sort tallest first, insert by k-index. "Dota senate" → queue battle.',
})

// ── Stack & Queue Design ──────────────────────────────────────────

export const stackDesignLeaf = leaf('stack-design', 'Stack Design Patterns', 'blue', {
  template: `class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int v) {
        int minV = st.empty() ? v : min(v, st.top().second);
        st.push({v, minV});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,
  problems: [
    { id: 155, title: 'Min Stack', slug: 'min-stack', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (pair of value + current min).' },
    { id: 716, title: 'Max Stack', slug: 'max-stack', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: two stacks (values + max) OR doubly-linked list + map for popMax().', variationCode: 'stack<int> vals, maxs; // push: maxs.push(max(maxs.top(),v)); popMax: use second stack to buffer' },
    { id: 232, title: 'Queue using Stacks', slug: 'implement-queue-using-stacks', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: two stacks (in/out); transfer in to out when out is empty.', variationCode: 'stack<int> in, out; void push(int x){in.push(x);} int pop(){ if(out.empty()) while(!in.empty()){ out.push(in.top()); in.pop(); } int v=out.top(); out.pop(); return v; }' },
  ],
  pitfalls: ['❌ MinStack: not updating min on pop — only store value, store min per state.', '❌ Queue with stacks: not transferring back — O(1) amortized.'],
  interviewTip: '💡 "Min/max stack" → store (value, current min/max) pair. "Queue with stacks" → two stacks.',
})

export const queueDesignLeaf = leaf('queue-design', 'Queue Design Patterns', 'teal', {
  template: `class MyStack {
    queue<int> q;
public:
    void push(int x) {
        q.push(x);
        for (int i = 0; i < (int)q.size()-1; i++) { q.push(q.front()); q.pop(); }
    }
    int pop() { int v = q.front(); q.pop(); return v; }
    int top() { return q.front(); }
    bool empty() { return q.empty(); }
};`,
  problems: [
    { id: 225, title: 'Stack using Queues', slug: 'implement-stack-using-queues', companies: ['AMAZON', 'META'], lineChanges: 'Lines 5–9: as-is (push rotates queue).' },
    { id: 641, title: 'Circular Deque', slug: 'design-circular-deque', companies: ['AMAZON'], lineChanges: 'Line: array + head/tail with modulo tracking.', variationCode: '// same as circular queue but with insertFront/deleteFront' },
    { id: 1429, title: 'First Unique', slug: 'first-unique-number', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: queue + map of counts; on showFirstUnique, pop invalid front.', variationCode: 'queue<int> q; unordered_map<int,int> cnt; int showFirstUnique(){ while(!q.empty()&&cnt[q.front()]>1) q.pop(); return q.empty()?-1:q.front(); }' },
  ],
  pitfalls: ['❌ Stack with queues: rotating on push is O(n) — expected, but pop should be O(1).', '❌ LC 1429: not cleaning up the queue front on each call.'],
  interviewTip: '💡 "Stack with queues" → push rotates, pop is front. "First unique" → queue + freq map.',
})

export const combinedStructLeaf = leaf('combined-struct', 'Combined Structures', 'pink', {
  template: `class FreqStack {
    unordered_map<int,int> freq;
    unordered_map<int,stack<int>> groups;
    int maxFreq = 0;
public:
    void push(int v) {
        int f = ++freq[v];
        maxFreq = max(maxFreq, f);
        groups[f].push(v);
    }
    int pop() {
        int v = groups[maxFreq].top(); groups[maxFreq].pop();
        freq[v]--;
        if (groups[maxFreq].empty()) maxFreq--;
        return v;
    }
};`,
  problems: [
    { id: 895, title: 'Max Freq Stack', slug: 'maximum-frequency-stack', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 5–16: as-is (freq map + stack-per-frequency).' },
    { id: 1472, title: 'Browser History', slug: 'design-browser-history', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: two stacks (back/forward) or doubly-linked list.', variationCode: 'vector<string> history; int pos=0; void visit(string url){ history.resize(++pos); history.push_back(url); } string back(int s){ pos=max(0,pos-s); return history[pos]; } string forward(int s){ pos=min((int)history.size()-1,pos+s); return history[pos]; }' },
  ],
  pitfalls: ['❌ LC 895: removing from groups[f] but groups[f] is a stack — LIFO within same freq.', '❌ LC 1472: not clearing forward history on new visit.'],
  interviewTip: '💡 "Frequency stack" → freq map + stack per frequency level. "Browser history" → two stacks.',
})
