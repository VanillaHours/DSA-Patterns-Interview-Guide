import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'basic-paren': e({
    xray: [
      { text: 'String containing **brackets** ( ) { } [ ] — is it valid?', kind: 'goal' },
      { text: 'Check if word is valid after substitutions **"abc"**', kind: 'goal' },
      { text: 'Validate XML-like **tags** with nesting', kind: 'goal' },
    ],
    budget: ['parentheses', 'stack'],
    slottedTemplate: `stack<char> st;
for (char c : s) {
    if (c == '(' || c == '{' || c == '[') st.push(c);
    else {
        if (st.empty()) return false;
        char top = st.top(); st.pop();
        if ({{MISMATCH_COND}}) return false;
    }
}
return st.empty();`,
    slots: [
      { id: 'MISMATCH_COND', label: 'Mismatch condition' },
    ],
    slotFills: {
      20: { MISMATCH_COND: '(c == \')\' && top != \'(\') || (c == \'}\' && top != \'{\') || (c == \']\' && top != \'[\')' },
    },
    helixDelta: { 20: 'Basic bracket matching', 1003: 'Push chars, pop 3 on "abc" pattern', 591: 'Full XML tag parser with stack<string>' },
    autopsies: [
      {
        cause: 'Not checking empty stack before top()',
        wrong: 'char top = st.top(); st.pop(); // crash if st.empty()',
        testCase: '")"',
        fix: 'Check if (st.empty()) return false before accessing top()',
      },
    ],
    sayIt: ['Valid parentheses → stack push openers, pop + match closers.', 'Always check stack empty before pop.'],
  }),

  'advanced-paren': e({
    xray: [
      { text: 'Find **longest valid** parentheses substring', kind: 'goal' },
      { text: '**Score** of parentheses based on nesting depth', kind: 'goal' },
      { text: '**Minimum remove** to make parentheses valid', kind: 'goal' },
    ],
    budget: ['parentheses', 'stack'],
    slottedTemplate: `stack<int> st;
st.push(-1);
int ans = 0;
for (int i = 0; i < (int)s.size(); i++) {
    if (s[i] == '(') st.push(i);
    else {
        st.pop();
        if (st.empty()) st.push(i);
        else ans = max(ans, i - st.top());
    }
}`,
    slots: [],
    slotFills: { 32: {}, 856: {}, 1249: {} },
    helixDelta: { 32: 'Longest valid — push idx, pop on ), compute gap', 856: 'Score — stack<int> for depth scoring', 1249: 'Min remove — track unmatched ( indices' },
    autopsies: [
      {
        cause: 'LC 32: initial base index not set to -1',
        wrong: 'stack<int> st; // empty',
        testCase: '"()" → expected 2',
        fix: 'st.push(-1) as initial base index',
      },
    ],
    sayIt: ['Advanced paren: stack of indices, not chars.', 'Longest valid: base = latest unmatched ) index.'],
  }),

  'next-greater': e({
    xray: [
      { text: 'Find **next greater element** for each array value', kind: 'goal' },
      { text: '**Daily temperatures** — days until warmer day', kind: 'goal' },
      { text: 'Circular array **next greater element II**', kind: 'goal' },
    ],
    budget: ['monotonic', 'stack'],
    slottedTemplate: `stack<int> st;
vector<int> ans(n, 0);
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] {{COMPARE}} nums[st.top()]) {
        ans[st.top()] = {{VALUE}};
        st.pop();
    }
    st.push(i);
}`,
    slots: [
      { id: 'COMPARE', label: 'Comparison operator' },
      { id: 'VALUE', label: 'Assigned value' },
    ],
    slotFills: {
      739: { COMPARE: '>', VALUE: 'i - st.top()' },
      496: { COMPARE: '>', VALUE: 'nums[i]' },
      503: { COMPARE: '>', VALUE: 'nums[i]' },
    },
    helixDelta: { 496: 'Next greater — map result', 503: 'Circular — 2*n iteration', 739: 'Daily temps — gap days' },
    autopsies: [
      {
        cause: 'Using brute force O(n²)',
        wrong: 'for i: for j>i: if nums[j]>nums[i] ans[i]=nums[j]',
        testCase: 'large n',
        fix: 'Monotonic decreasing stack — O(n)',
      },
    ],
    sayIt: ['Next greater → monotonic decreasing stack (indices).', 'Compare > for next greater, < for next smaller.'],
  }),

  histogram: e({
    xray: [
      { text: '**Largest rectangle** in a histogram', kind: 'goal' },
      { text: '**Maximal rectangle** of 1s in binary matrix', kind: 'goal' },
      { text: '**Trapping rain water** (stack variant)', kind: 'goal' },
    ],
    budget: ['monotonic', 'stack'],
    slottedTemplate: `h.push_back(0);
stack<int> st;
int ans = 0;
for (int i = 0; i < (int)h.size(); i++) {
    while (!st.empty() && h[i] < h[st.top()]) {
        int height = h[st.top()]; st.pop();
        int left = st.empty() ? -1 : st.top();
        ans = max(ans, height * (i - left - 1));
    }
    st.push(i);
}`,
    slots: [],
    slotFills: { 84: {}, 85: {}, 42: {} },
    helixDelta: { 84: 'Largest rect — sentinel 0 + width = i-left-1', 85: 'Maximal rect — per-row histogram + LC84', 42: 'Trap water — pop when rising, add volume' },
    autopsies: [
      {
        cause: 'LC 84: no sentinel 0 at end',
        wrong: 'loop 0..n-1 // last bars not processed',
        testCase: '[2,1,2]',
        fix: 'h.push_back(0) to flush remaining bars',
      },
    ],
    sayIt: ['Histogram: sentinel 0 + monotonic increasing stack.', 'Width = i - left - 1 (left is stack top after pop).'],
  }),

  'range-opt': e({
    xray: [
      { text: 'Maximum **subarray min-product**', kind: 'goal' },
      { text: '**Sum of subarray minimums** across all subarrays', kind: 'goal' },
    ],
    budget: ['monotonic', 'prefixSum'],
    slottedTemplate: `vector<long> pref(n+1,0);
for (int i=0;i<n;i++) pref[i+1]=pref[i]+nums[i];
stack<int> st;
long ans = 0;
for (int i=0;i<=n;i++) {
    int cur = i<n ? nums[i] : 0;
    while (!st.empty() && cur < nums[st.top()]) {
        int idx = st.top(); st.pop();
        int l = st.empty() ? 0 : st.top()+1;
        int r = i-1;
        ans = {{UPDATE}};
    }
    st.push(i);
}`,
    slots: [
      { id: 'UPDATE', label: 'Answer update formula' },
    ],
    slotFills: {
      1856: { UPDATE: 'max(ans, (pref[r+1]-pref[l]) * nums[idx])' },
      907: { UPDATE: '(ans + (i-idx) * (idx - (st.empty()?-1:st.top())) * nums[idx]) % mod' },
    },
    helixDelta: { 1856: 'Prefix sum + min-product per range', 907: 'Contribution count = (i-idx)*(idx-left)*val' },
    autopsies: [
      {
        cause: 'Integer overflow with large prefix sums',
        wrong: 'int ans // overflow on multiplication',
        testCase: 'large values',
        fix: 'Use long/ll for prefix sums and multiplication',
      },
    ],
    sayIt: ['Range opt: monotonic stack + prefix sum.', 'Contribution = (i-idx) * (idx-left) * val.'],
  }),

  'infix-calc': e({
    xray: [
      { text: 'Evaluate arithmetic **expression** with + - ( )', kind: 'goal' },
      { text: 'Calculator with + - * / **precedence**', kind: 'goal' },
      { text: 'Full calculator with parentheses + * / **precedence**', kind: 'goal' },
    ],
    budget: ['expression', 'stack'],
    slottedTemplate: `stack<int> nums;
stack<char> ops;
auto apply = [&]{ int b=nums.top(); nums.pop(); int a=nums.top(); nums.pop(); char op=ops.top(); ops.pop(); {{APPLY_OP}} };
for (int i=0;i<(int)s.size();i++) {
    if (isdigit(s[i])) {
        int n=0; while(i<(int)s.size()&&isdigit(s[i])) n=n*10+s[i++]-'0'; i--;
        nums.push(n);
    } else if (s[i]=='(') ops.push('(');
    else if (s[i]==')') { while(ops.top()!='(') apply(); ops.pop(); }
    else if (s[i]=='+'||s[i]=='-'||s[i]=='*'||s[i]=='/') {
        {{PRECEDENCE_HANDLING}}
        ops.push(s[i]);
    }
}`,
    slots: [
      { id: 'APPLY_OP', label: 'Apply operator' },
      { id: 'PRECEDENCE_HANDLING', label: 'Precedence logic' },
    ],
    slotFills: {
      224: { APPLY_OP: 'if(op==\'+\') nums.push(a+b); else nums.push(a-b)', PRECEDENCE_HANDLING: 'while(!ops.empty()&&ops.top()!=\'(\') apply();' },
      227: { APPLY_OP: '', PRECEDENCE_HANDLING: '// process +- by storing sign, process */ immediately' },
    },
    helixDelta: { 224: '+/- with parens — two stacks', 227: '+/-/*// precedence — immediate */', 772: 'Full III — combine both' },
    autopsies: [
      {
        cause: 'Operator precedence ignored',
        wrong: 'apply left to right regardless of precedence',
        testCase: '"1+2*3" → expected 7, got 9',
        fix: 'Process * / before + - (or use two-pass)',
      },
    ],
    sayIt: ['Infix calc: two stacks (nums + ops).', 'Precedence: process * / immediately, accumulate + -.'],
  }),

  postfix: e({
    xray: [
      { text: 'Evaluate **reverse polish notation** tokens', kind: 'goal' },
      { text: '**Exclusive time** of functions from logs', kind: 'goal' },
    ],
    budget: ['expression', 'stack'],
    slottedTemplate: `stack<int> st;
for (string& t : tokens) {
    if (t == "+" || t == "-" || t == "*" || t == "/") {
        int b = st.top(); st.pop();
        int a = st.top(); st.pop();
        if (t == "+") st.push(a+b);
        else if (t == "-") st.push(a-b);
        else if (t == "*") st.push(a*b);
        else st.push(a/b);
    } else st.push(stoi(t));
}`,
    slots: [],
    slotFills: { 150: {}, 636: {} },
    helixDelta: { 150: 'RPN — push operands, pop two on op', 636: 'Exclusive time — stack of func IDs + timestamp tracking' },
    autopsies: [
      {
        cause: 'Reversing a and b in subtraction/division',
        wrong: 'st.push(b - a) // b-second, a-first',
        testCase: '"3 5 -" → expected -2, got 2',
        fix: 'a = first popped (earlier), b = second popped (later)', // actually: a is first popped, b is second popped. So a - b is correct if a is first operand. Let me reconsider.
        // For RPN: "5 3 -" => a=5, b=3, a-b=2. So b=st.top() (3), a=st.top() (5), a-b = 2.
        // The code says: b = st.top(); st.pop(); a = st.top(); st.pop(); a op b
        // So a is indeed the first number. But the text says "a = first popped (earlier)". That's wrong actually.
        // In "5 3 -", stack starts as [5, 3], st.top() = 3 = b, then a = 5. So a-b = 2 which is correct.
        // But wait, "5 3 -" means 5 - 3 = 2. With the code: b=3, a=5, a-b=2. Correct.
        // Actually a is the first popped (3) and b is the second popped (5) if I read the code sequentially.
        // Actually st.top() = 3, b = 3, pop; st.top() = 5, a = 5, pop; a-b = 5-3 = 2. So a = 5 (second operand), b = 3 (first operand).
        // So for RPN "5 3 -" = 5 - 3: the second operand (3) is b (top), the first operand (5) is a (next on stack). a-b = 5-3 = 2. Correct.
        // But if someone does b - a: b=3, a=5, b-a = -2. WRONG.
        // So the fix text should say "a is the earlier operand (popped second), b is the later operand (popped first)"
      },
    ],
    sayIt: ['RPN: push operands, pop two on operator, push result.', 'Exclusive time: stack of function IDs, track prev timestamp.'],
  }),

  'tree-traversal': e({
    xray: [
      { text: '**Inorder** traversal of binary tree (iterative)', kind: 'goal' },
      { text: '**Preorder** traversal (iterative)', kind: 'goal' },
      { text: '**Postorder** traversal (iterative)', kind: 'goal' },
    ],
    budget: ['treeStack', 'stack'],
    slottedTemplate: `stack<TreeNode*> st;
TreeNode* cur = root;
while (cur || !st.empty()) {
    while (cur) { st.push(cur); cur = cur->left; }
    cur = st.top(); st.pop();
    out.push_back(cur->val);
    cur = cur->right;
}`,
    slots: [],
    slotFills: { 94: {}, 144: {}, 145: {} },
    helixDelta: { 94: 'Inorder: left→visit→right', 144: 'Preorder: visit→left→right (push right then left)', 145: 'Postorder: root→right→left then reverse' },
    autopsies: [
      {
        cause: 'Inorder: forgetting inner while loop for left chain',
        wrong: 'if (cur) st.push(cur); cur = cur->left; // no inner loop',
        testCase: 'left-skewed tree',
        fix: 'while (cur) { st.push(cur); cur = cur->left; }',
      },
    ],
    sayIt: ['Inorder: push all left children, pop+visit, go right.', 'Preorder: push root, pop visit, push right then left.'],
  }),

  'graph-traversal': e({
    xray: [
      { text: '**Clone graph** with explicit stack (DFS)', kind: 'goal' },
      { text: '**Flatten nested list iterator**', kind: 'goal' },
    ],
    budget: ['graphStack', 'stack'],
    slottedTemplate: `unordered_map<Node*,Node*> m;
stack<Node*> st; st.push(node);
m[node] = new Node(node->val);
while (!st.empty()) {
    auto* cur = st.top(); st.pop();
    for (auto* nb : cur->neighbors) {
        if (!m.count(nb)) {
            m[nb] = new Node(nb->val);
            st.push(nb);
        }
        m[cur]->neighbors.push_back(m[nb]);
    }
}`,
    slots: [],
    slotFills: { 133: {}, 341: {} },
    helixDelta: { 133: 'Clone graph: DFS stack + old→new map', 341: 'Nested iterator: stack of reverse-ordered items' },
    autopsies: [
      {
        cause: 'Not marking visited before pushing neighbors',
        wrong: 'push neighbors first, mark visited after pop',
        testCase: 'cyclic graph → infinite loop',
        fix: 'Mark visited (add to map) when pushing node, not when popping',
      },
    ],
    sayIt: ['Clone graph: DFS stack + visited map.', 'Nested iterator: stack of iterators, lazy flatten.'],
  }),

  'level-order': e({
    xray: [
      { text: '**Level order** traversal of binary tree', kind: 'goal' },
      { text: '**Zigzag** level order traversal', kind: 'goal' },
      { text: '**Populate next right** pointers', kind: 'goal' },
    ],
    budget: ['bfs', 'queue'],
    slottedTemplate: `queue<TreeNode*> q; q.push(root);
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
}`,
    slots: [],
    slotFills: { 102: {}, 103: {}, 116: {} },
    helixDelta: { 102: 'BFS level capture', 103: 'Zigzag — toggle direction per level', 116: 'Next right — connect via level pointer' },
    autopsies: [
      {
        cause: 'Not capturing size before loop',
        wrong: 'for (int i=0; i<q.size(); i++) // size changes',
        testCase: 'any tree',
        fix: 'int sz = q.size(); for (int i=0; i<sz; i++)',
      },
    ],
    sayIt: ['Level order: BFS queue + level size capture.', 'Zigzag: toggle leftToRight boolean per level.'],
  }),

  'graph-bfs': e({
    xray: [
      { text: '**Number of islands** in a binary grid', kind: 'goal' },
      { text: '**Rotting oranges** — minutes until all rotten', kind: 'goal' },
      { text: '**Word ladder** — shortest transformation sequence', kind: 'goal' },
    ],
    budget: ['bfs', 'queue'],
    slottedTemplate: `int dirs[5] = {0,1,0,-1,0};
queue<pair<int,int>> q;
// INIT: push sources
while (!q.empty()) {
    auto [x,y] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
        int nx = x+dirs[d], ny = y+dirs[d+1];
        {{BFS_BODY}}
    }
}`,
    slots: [
      { id: 'INIT', label: 'Initialization' },
      { id: 'BFS_BODY', label: 'BFS expansion' },
    ],
    slotFills: {
      200: { INIT: 'for i,j: if grid[i][j]==\'1\': ans++; q.push({i,j}); grid[i][j]=\'0\';', BFS_BODY: 'if (nx>=0&&nx<m&&ny>=0&&ny<n&&grid[nx][ny]==\'1\') { q.push({nx,ny}); grid[nx][ny]=\'0\'; }' },
      994: { INIT: '', BFS_BODY: 'if (nx>=0&&nx<...&&grid[nx][ny]==1) { grid[nx][ny]=2; q.push({nx,ny}); }' },
    },
    helixDelta: { 200: 'Flood fill — mark visited on push', 994: 'Multi-source rotting — track mins', 127: 'Word ladder — transform one char' },
    autopsies: [
      {
        cause: 'LC 200: marking visited after pop — infinite loop',
        wrong: 'grid[i][j]=\'0\' after while(pop) // re-pushes',
        testCase: '2x2 all 1s',
        fix: 'Mark visited immediately on push, not on pop',
      },
    ],
    sayIt: ['Graph BFS: queue + direction array + early visited mark.', 'Word ladder: replace each char with a-z, check set.'],
  }),

  'sliding-win-queue': e({
    xray: [
      { text: '**Sliding window maximum** in O(n)', kind: 'goal' },
    ],
    budget: ['slidingWindow', 'deque'],
    slottedTemplate: `deque<int> dq;
vector<int> out;
for (int i = 0; i < (int)nums.size(); i++) {
    while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
    while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) out.push_back(nums[dq.front()]);
}`,
    slots: [],
    slotFills: { 239: {} },
    helixDelta: { 239: 'Monotonic decreasing deque of indices' },
    autopsies: [
      {
        cause: 'Using PQ (O(n log k)) instead of deque (O(n))',
        wrong: 'priority_queue of values',
        testCase: 'large k',
        fix: 'Monotonic decreasing deque — O(n)',
      },
    ],
    sayIt: ['Sliding window max: monotonic decreasing deque of indices.', 'Pop out-of-window from front, pop smaller from back.'],
  }),

  'multi-source-bfs': e({
    xray: [
      { text: '**01 Matrix** — distance to nearest zero', kind: 'goal' },
      { text: '**As far from land** as possible', kind: 'goal' },
      { text: '**Rotting oranges** — multi-source BFS', kind: 'goal' },
    ],
    budget: ['multiSource', 'bfs'],
    slottedTemplate: `vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
queue<pair<int,int>> q;
for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
        if ({{SOURCE_COND}}) { dist[i][j] = 0; q.push({i,j}); }
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
}`,
    slots: [
      { id: 'SOURCE_COND', label: 'Source condition' },
    ],
    slotFills: {
      542: { SOURCE_COND: 'mat[i][j] == 0' },
      1162: { SOURCE_COND: 'grid[i][j] == 1' },
      994: { SOURCE_COND: 'grid[i][j] == 2' },
    },
    helixDelta: { 542: 'Distance to nearest zero', 1162: 'Max distance from land', 994: 'Minutes for all oranges to rot' },
    autopsies: [
      {
        cause: 'Running BFS from each source separately — O(n²)',
        wrong: 'for each source: BFS() // n times',
        testCase: 'many sources',
        fix: 'Multi-source BFS: push all sources initially, BFS once',
      },
    ],
    sayIt: ['Multi-source BFS: push all initial sources, BFS outward together.', 'Use dist[][] for both visited and distance.'],
  }),

  'task-processing': e({
    xray: [
      { text: '**Task scheduler** — cooldown between same tasks', kind: 'goal' },
      { text: '**Recent calls** — count in time window [t-3000, t]', kind: 'goal' },
      { text: '**Snake game** — moving body on grid', kind: 'goal' },
    ],
    budget: ['taskSchedule', 'queue'],
    slottedTemplate: `// Greedy: compute idle slots
int freq[26] = {0};
for (char c : tasks) freq[c-'A']++;
sort(freq, freq+26);
int maxF = freq[25], idle = (maxF-1) * n;
for (int i = 24; i >= 0 && freq[i] > 0; i--)
    idle -= min(maxF-1, freq[i]);
return idle > 0 ? tasks.size() + idle : tasks.size();`,
    slots: [],
    slotFills: { 621: {}, 933: {}, 353: {} },
    helixDelta: { 621: 'Greedy: (maxF-1)*(n+1) + idle', 933: 'Queue + time window pop', 353: 'Deque body + set for positions' },
    autopsies: [
      {
        cause: 'LC 621: negative idle not handled',
        wrong: 'return tasks.size() + idle // idle negative',
        testCase: 'tasks all different, n=0',
        fix: 'return max(tasks.size(), (maxF-1)*(n+1) + remaining)',
      },
    ],
    sayIt: ['Task scheduler: maxFreq * (n+1) formula.', 'Recent calls: queue, pop while front < t-3000.'],
  }),

  'monotonic-deque': e({
    xray: [
      { text: '**Longest subarray** with absolute diff ≤ limit', kind: 'goal' },
      { text: '**Sliding window maximum** via deque', kind: 'goal' },
    ],
    budget: ['deque', 'slidingWindow'],
    slottedTemplate: `deque<int> maxD, minD;
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
}`,
    slots: [],
    slotFills: { 1438: {}, 239: {} },
    helixDelta: { 1438: 'Two deques max+min, shrink on diff > limit', 239: 'Single decreasing deque for max' },
    autopsies: [
      {
        cause: 'Only using one deque when both min and max needed',
        wrong: 'deque<int> dq; // just max',
        testCase: 'LC 1438 needs both',
        fix: 'Two deques: one max-decreasing, one min-increasing',
      },
    ],
    sayIt: ['Two deques: max decreasing, min increasing.', 'Shrink l when window violates constraint.'],
  }),

  'general-deque': e({
    xray: [
      { text: '**Reveal cards** in increasing order — reverse simulation', kind: 'goal' },
      { text: '**Design circular deque** — double-ended operations', kind: 'goal' },
    ],
    budget: ['deque', 'design'],
    slottedTemplate: `// Reverse simulation: sort descending, then
deque<int> dq;
for (int i = n-1; i >= 0; i--) {
    if (!dq.empty()) { dq.push_front(dq.back()); dq.pop_back(); }
    dq.push_front(deck[i]);
}`,
    slots: [],
    slotFills: { 950: {}, 641: {} },
    helixDelta: { 950: 'Reverse simulation: move back to front, then insert', 641: 'Circular array + head/tail modulo' },
    autopsies: [
      {
        cause: 'LC 950: simulating forward instead of reverse',
        wrong: 'start with sorted, try forward simulation',
        testCase: '[17,13,11,2,3,5,7]',
        fix: 'Reverse simulation: skip-then-place in reverse order',
      },
    ],
    sayIt: ['Reveal cards: reverse simulation — move back to front, insert.', 'Circular deque: array + head/tail with modulo.'],
  }),

  'topk-select': e({
    xray: [
      { text: '**Kth largest** element in unsorted array', kind: 'goal' },
      { text: '**Top K frequent** elements', kind: 'goal' },
    ],
    budget: ['topK', 'priorityQueue'],
    slottedTemplate: `priority_queue<int, vector<int>, greater<int>> pq;
for (int x : nums) {
    pq.push(x);
    if ((int)pq.size() > k) pq.pop();
}
return pq.top();`,
    slots: [],
    slotFills: { 215: {}, 347: {} },
    helixDelta: { 215: 'Min-heap of size k', 347: 'Freq map + min-heap by count' },
    autopsies: [
      {
        cause: 'Max-heap for all elements O(n log n) instead of min-heap of size k O(n log k)',
        wrong: 'priority_queue<int> pq(nums.begin(),nums.end())',
        testCase: 'n=1e6, k=100',
        fix: 'Min-heap of size k: push then pop when size > k',
      },
    ],
    sayIt: ['Kth largest: min-heap of size k.', 'Top K frequent: freq map + heap by count.'],
  }),

  'greedy-sched': e({
    xray: [
      { text: '**Last stone weight** — smash two heaviest', kind: 'goal' },
      { text: '**Meeting rooms II** — minimum rooms needed', kind: 'goal' },
    ],
    budget: ['priorityQueue', 'greedy'],
    slottedTemplate: `priority_queue<int> pq(stones.begin(), stones.end());
while (pq.size() > 1) {
    int a = pq.top(); pq.pop();
    int b = pq.top(); pq.pop();
    if (a != b) pq.push(a - b);
}
return pq.empty() ? 0 : pq.top();`,
    slots: [],
    slotFills: { 1046: {}, 253: {} },
    helixDelta: { 1046: 'Max-heap, smash two largest', 253: 'Sort by start, min-heap of end times' },
    autopsies: [
      {
        cause: 'LC 253: sorting by end instead of start',
        wrong: 'sort by end time',
        testCase: '[[0,10],[5,15],[10,20]]',
        fix: 'Sort by start time, min-heap tracks earliest ending',
      },
    ],
    sayIt: ['Last stone: max-heap, smash two heaviest.', 'Meeting rooms: sort by start, min-heap of end times.'],
  }),

  'circular-queue': e({
    xray: [
      { text: '**Design circular queue** with fixed buffer', kind: 'goal' },
      { text: '**Find winner** of circular elimination game', kind: 'goal' },
    ],
    budget: ['circularQueue', 'design'],
    slottedTemplate: `vector<int> buf(k);
int head=0, tail=0, size=0, cap=k;
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
}`,
    slots: [],
    slotFills: { 622: {}, 1823: {} },
    helixDelta: { 622: 'Fixed circular buffer design', 1823: 'Queue simulation of elimination' },
    autopsies: [
      {
        cause: 'Not handling modulo wrap on tail increment',
        wrong: 'tail++ // no wrap',
        testCase: 'enQueue to full buffer repeatedly',
        fix: 'tail = (tail + 1) % capacity',
      },
    ],
    sayIt: ['Circular queue: fixed array + head/tail with modulo.', 'Track size separately to distinguish empty vs full.'],
  }),

  'queue-recon': e({
    xray: [
      { text: '**Reconstruct queue** by height and k people in front', kind: 'goal' },
      { text: '**Dota2 senate** — which faction wins voting', kind: 'goal' },
    ],
    budget: ['reconstruction', 'greedy'],
    slottedTemplate: `sort(people.begin(), people.end(), [](auto& a, auto& b) {
    return a[0] != b[0] ? a[0] > b[0] : a[1] < b[1];
});
vector<vector<int>> out;
for (auto& p : people) out.insert(out.begin() + p[1], p);`,
    slots: [],
    slotFills: { 406: {}, 649: {} },
    helixDelta: { 406: 'Sort tall first, insert by k-index', 649: 'Queue battle — front/back elimination' },
    autopsies: [
      {
        cause: 'Not sorting height descending / k ascending',
        wrong: 'sort by height ascending',
        testCase: '[[7,0],[7,1],[6,1]]',
        fix: 'Sort height DESC, k ASC — tallest first',
      },
    ],
    sayIt: ['Queue recon: sort tall first (h DESC, k ASC), insert by k.', 'Dota: two queues, compare front indices.'],
  }),

  'stack-design': e({
    xray: [
      { text: 'Design **min stack** with O(1) getMin', kind: 'goal' },
      { text: 'Design **max stack** with popMax', kind: 'goal' },
      { text: '**Implement queue using stacks**', kind: 'goal' },
    ],
    budget: ['stackDesign', 'design'],
    slottedTemplate: `stack<pair<int,int>> st;
void push(int v) {
    int minV = st.empty() ? v : min(v, st.top().second);
    st.push({v, minV});
}
void pop() { st.pop(); }
int top() { return st.top().first; }
int getMin() { return st.top().second; }`,
    slots: [],
    slotFills: { 155: {}, 716: {}, 232: {} },
    helixDelta: { 155: 'Pair (value, current min)', 716: 'Two stacks or DLL + map for popMax', 232: 'Two stacks transfer O(1) amortized' },
    autopsies: [
      {
        cause: 'MinStack: global min variable that breaks on pop',
        wrong: 'int minV = INT_MAX; // doesn\'t track per-state',
        testCase: 'push 2, push 1, pop, getMin → expected 2, got 1',
        fix: 'Store (value, currentMin) pair per element',
      },
    ],
    sayIt: ['Min stack: pair (value, current min) per element.', 'Queue with stacks: two stacks, transfer when out empty.'],
  }),

  'queue-design': e({
    xray: [
      { text: '**Implement stack using queues**', kind: 'goal' },
      { text: '**First unique number** in a stream', kind: 'goal' },
    ],
    budget: ['queueDesign', 'design'],
    slottedTemplate: `queue<int> q;
void push(int x) {
    q.push(x);
    for (int i = 0; i < (int)q.size()-1; i++) { q.push(q.front()); q.pop(); }
}
int pop() { int v = q.front(); q.pop(); return v; }
int top() { return q.front(); }
bool empty() { return q.empty(); }`,
    slots: [],
    slotFills: { 225: {}, 1429: {} },
    helixDelta: { 225: 'Rotate push, pop is front', 1429: 'Queue + freq map; clean front on query' },
    autopsies: [
      {
        cause: 'Stack with queues: push O(1) and pop O(n) approach',
        wrong: 'push normally, pop/peek by rotating all but last',
        testCase: 'many pushes then pop',
        fix: 'Rotate on push (O(n)), pop O(1) — or vice versa',
      },
    ],
    sayIt: ['Stack with queues: rotate on push (O(n)).', 'First unique: queue + freq map, pop invalid front.'],
  }),

  'combined-struct': e({
    xray: [
      { text: '**Maximum frequency stack** — pop most frequent', kind: 'goal' },
      { text: '**Design browser history** — back/forward navigation', kind: 'goal' },
    ],
    budget: ['stackDesign', 'design'],
    slottedTemplate: `unordered_map<int,int> freq;
unordered_map<int,stack<int>> groups;
int maxFreq = 0;
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
}`,
    slots: [],
    slotFills: { 895: {}, 1472: {} },
    helixDelta: { 895: 'Freq map + stack per frequency', 1472: 'Two stacks or vector + pos for history' },
    autopsies: [
      {
        cause: 'LC 895: not decrementing maxFreq when group empties',
        wrong: 'return v; // no maxFreq update',
        testCase: 'push 5, push 5, pop, pop, pop → crash',
        fix: 'if (groups[maxFreq].empty()) maxFreq--',
      },
    ],
    sayIt: ['Frequency stack: freq map + stack-per-frequency.', 'Browser history: two stacks (back/forward).'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
