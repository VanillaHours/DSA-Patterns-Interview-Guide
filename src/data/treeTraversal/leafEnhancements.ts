import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  preorder: e({
    xray: [
      { text: 'Return **preorder** traversal of a binary tree', kind: 'goal' },
      { text: 'Return **preorder** of an N-ary tree', kind: 'goal' },
      { text: 'Return all **root-to-leaf paths**', kind: 'goal' },
    ],
    budget: ['preorder', 'binaryTree'],
    slottedTemplate: `void dfs(TreeNode* r) {
    if (!r) return;
    {{PROCESS_ROOT}}
    dfs(r->left);
    dfs(r->right);
}`,
    slots: [{ id: 'PROCESS_ROOT', label: 'Process root value' }],
    slotFills: {
      144: { PROCESS_ROOT: 'out.push_back(r->val)' },
      589: { PROCESS_ROOT: 'out.push_back(r->val); for (auto* c : r->children) dfs(c);' },
      257: { PROCESS_ROOT: 'path += to_string(r->val); if (!r->left && !r->right) ans.push_back(path); path += "->"; dfs(r->left); dfs(r->right); path.pop_back();' },
    },
    helixDelta: { 144: 'Standard recursive preorder', 589: 'N-ary: iterate children', 257: 'Preorder + path string + backtrack' },
    autopsies: [{
      cause: 'LC 257: not backtracking path string',
      wrong: 'path += to_string(val); dfs(left); dfs(right); // path keeps growing',
      testCase: 'tree with two leaf siblings — second path includes first',
      fix: 'Backtrack: pop_back() after return, or pass by value.',
    }],
    sayIt: ['Preorder: root, then left, then right. Used for clone, paths, prefix expression.'],
  }),

  inorder: e({
    xray: [
      { text: 'Return **inorder** traversal of a binary tree', kind: 'goal' },
      { text: '**Validate** if a tree is a BST', kind: 'goal' },
      { text: 'Find **kth smallest** element in a BST', kind: 'goal' },
    ],
    budget: ['inorder', 'bst'],
    slottedTemplate: `void dfs(TreeNode* r) {
    if (!r) return;
    dfs(r->left);
    {{PROCESS_ROOT}}
    dfs(r->right);
}`,
    slots: [{ id: 'PROCESS_ROOT', label: 'Process root' }],
    slotFills: {
      94: { PROCESS_ROOT: 'out.push_back(r->val)' },
      98: { PROCESS_ROOT: 'if (prev && prev->val >= r->val) ok = false; prev = r;' },
      230: { PROCESS_ROOT: 'if (++cnt == k) ans = r->val;' },
    },
    helixDelta: { 94: 'Standard inorder', 98: 'Track prev node for BST validation', 230: 'Count nodes for kth smallest' },
    autopsies: [{
      cause: 'LC 98: only checking immediate parent',
      wrong: 'if (root->left && root->left->val >= root->val) return false;',
      testCase: '[5,1,4,null,null,3,6] — 3 is in right subtree of 5 but > 5',
      fix: 'Pass min/max range down (or use inorder prev pointer).',
    }],
    sayIt: ['Inorder of BST = sorted. Validate with prev pointer. Kth = count during inorder.'],
  }),

  postorder: e({
    xray: [
      { text: 'Return **postorder** traversal of a binary tree', kind: 'goal' },
      { text: 'Return **postorder** of an N-ary tree', kind: 'goal' },
      { text: 'Find **maximum path sum** (any node to any node)', kind: 'goal' },
    ],
    budget: ['postorder', 'binaryTree'],
    slottedTemplate: `void dfs(TreeNode* r) {
    if (!r) return;
    dfs(r->left);
    dfs(r->right);
    {{PROCESS_ROOT}}
}`,
    slots: [{ id: 'PROCESS_ROOT', label: 'Process root' }],
    slotFills: {
      145: { PROCESS_ROOT: 'out.push_back(r->val)' },
      590: { PROCESS_ROOT: 'for (auto* c : r->children) dfs(c); out.push_back(r->val);' },
      124: { PROCESS_ROOT: 'int l = max(0, dfs(r->left)), ri = max(0, dfs(r->right)); ans = max(ans, l + ri + r->val); return r->val + max(l, ri);' },
    },
    helixDelta: { 145: 'Standard postorder', 590: 'N-ary: iterate children then push', 124: 'Max path sum: max(0,child) + val; update global' },
    autopsies: [{
      cause: 'LC 124: including negative child contributions',
      wrong: 'int l = dfs(left); int r = dfs(right); ans = max(ans, l+r+val);',
      testCase: 'all negative values — path with single node is best',
      fix: 'int l = max(0, dfs(left)); int r = max(0, dfs(right)); // skip negatives',
    }],
    sayIt: ['Postorder: children first, then root. Used for tree DP, max path sum.'],
  }),

  'path-sum': e({
    xray: [
      { text: 'Check if **root-to-leaf path** sums to target', kind: 'goal' },
    ],
    budget: ['pathSum'],
    slottedTemplate: `bool dfs(TreeNode* r, int t) {
    if (!r) return false;
    t -= r->val;
    if (!r->left && !r->right) return {{LEAF_CHECK}};
    return dfs(r->left, t) || dfs(r->right, t);
}`,
    slots: [{ id: 'LEAF_CHECK', label: 'Leaf condition' }],
    slotFills: { 112: { LEAF_CHECK: 't == 0' } },
    helixDelta: { 112: 'Subtract-on-entry; check t == 0 at leaf' },
    autopsies: [{
      cause: 'Accumulating sum instead of subtracting',
      wrong: 'if (sum + val == target) // accumulating',
      testCase: 'path needing exact target',
      fix: 'target -= val; // subtract on way down, not accumulate',
    }],
    sayIt: ['Path Sum = subtract val on entry, check == 0 at leaf.'],
  }),

  'path-sum-ii': e({
    xray: [
      { text: 'Return all **root-to-leaf paths** that sum to target', kind: 'goal' },
    ],
    budget: ['pathSum'],
    slottedTemplate: `void dfs(TreeNode* r, int t) {
    if (!r) return;
    path.push_back(r->val);
    if (!r->left && !r->right && t == r->val) {{COLLECT}};
    dfs(r->left, t - r->val);
    dfs(r->right, t - r->val);
    {{BACKTRACK}};
}`,
    slots: [{ id: 'COLLECT', label: 'Collect path' }, { id: 'BACKTRACK', label: 'Backtrack' }],
    slotFills: { 113: { COLLECT: 'ans.push_back(path)', BACKTRACK: 'path.pop_back()' } },
    helixDelta: { 113: 'Preorder + path collection + backtrack' },
    autopsies: [{
      cause: 'Not backtracking the path vector',
      wrong: 'path.push_back(val); ... // no pop_back',
      testCase: 'sibling paths get contaminated',
      fix: 'path.pop_back() after recursive calls (or pass by value).',
    }],
    sayIt: ['Path Sum II = preorder + path vector + backtrack at leaf.'],
  }),

  'path-sum-iii': e({
    xray: [
      { text: 'Count paths (any start, any end) summing to target', kind: 'goal' },
    ],
    budget: ['pathSum'],
    slottedTemplate: `void dfs(TreeNode* r, long cur) {
    if (!r) return;
    cur += r->val;
    ans += m[cur - target];
    m[cur]++;
    dfs(r->left, cur);
    dfs(r->right, cur);
    {{BACKTRACK}};
}`,
    slots: [{ id: 'BACKTRACK', label: 'Backtrack map' }],
    slotFills: { 437: { BACKTRACK: 'm[cur]--' } },
    helixDelta: { 437: 'Prefix sum map + DFS + backtrack map count' },
    autopsies: [{
      cause: 'Not resetting map count after processing subtree',
      wrong: 'm[cur]++; dfs(left); dfs(right); // count persists for siblings',
      testCase: 'sibling paths shouldn\'t share prefix counts',
      fix: 'm[cur]-- after recursive calls (backtrack).',
    }],
    sayIt: ['Path Sum III = prefix sum map + DFS + backtrack. Counts paths starting anywhere.'],
  }),

  univalue: e({
    xray: [
      { text: 'Find **longest path** where all nodes have same value', kind: 'goal' },
    ],
    budget: ['pathSum'],
    slottedTemplate: `int dfs(TreeNode* r) {
    if (!r) return 0;
    int l = dfs(r->left), ri = dfs(r->right);
    int lx = (r->left && r->left->val == r->val) ? l + 1 : 0;
    int rx = (r->right && r->right->val == r->val) ? ri + 1 : 0;
    ans = max(ans, lx + rx);
    return {{RETURN}};
}`,
    slots: [{ id: 'RETURN', label: 'Return to parent' }],
    slotFills: { 687: { RETURN: 'max(lx, rx)' } },
    helixDelta: { 687: 'Postorder; extend when child matches; track max edges' },
    autopsies: [{
      cause: 'Counting nodes instead of edges',
      wrong: 'return 1 + max(lx, rx); ans = max(ans, 1 + lx + rx);',
      testCase: 'univalue path of length 2 (3 nodes) should be 2 edges',
      fix: 'ans = max(ans, lx + rx); return max(lx, rx);',
    }],
    sayIt: ['Univalue Path = postorder + match check. Ans = lx + rx, return = max(lx, rx).'],
  }),

  lca: e({
    xray: [
      { text: 'Find **lowest common ancestor** of two nodes', kind: 'goal' },
    ],
    budget: ['lca'],
    slottedTemplate: `TreeNode* dfs(TreeNode* r) {
    if (!r || r == p || r == q) return r;
    auto* l = dfs(r->left);
    auto* ri = dfs(r->right);
    if (l && ri) {{FOUND}};
    return {{RETURN}};
}`,
    slots: [{ id: 'FOUND', label: 'LCA found' }, { id: 'RETURN', label: 'Return' }],
    slotFills: { 236: { FOUND: 'return r', RETURN: 'l ? l : ri' } },
    helixDelta: { 236: 'Postorder LCA: if both sides non-null, node is LCA' },
    autopsies: [{
      cause: 'Not tracking which nodes were found',
      wrong: 'return r; // assumes both nodes exist in tree',
      testCase: 'p doesn\'t exist but q does — should return null',
      fix: 'Standard LCA assumes both exist. Use LC 1644 for existence check.',
    }],
    sayIt: ['LCA = postorder. If both sides non-null, current is LCA.'],
  }),

  'lca-ii': e({
    xray: [
      { text: 'Find **LCA** with existence check (nodes may not be in tree)', kind: 'goal' },
    ],
    budget: ['lca'],
    slottedTemplate: `TreeNode* dfs(TreeNode* r) {
    if (!r) return nullptr;
    auto* l = dfs(r->left);
    auto* ri = dfs(r->right);
    if (r == p || r == q) { count++; return r; }
    if (l && ri) return r;
    return {{RETURN}};
}`,
    slots: [{ id: 'RETURN', label: 'Return' }],
    slotFills: { 1644: { RETURN: 'l ? l : ri' } },
    helixDelta: { 1644: 'LCA with count; null if count < 2' },
    autopsies: [{
      cause: 'Assuming both nodes exist',
      wrong: 'return standard LCA result without checking existence',
      testCase: 'one node not in tree',
      fix: 'Count found nodes during DFS; if count < 2 return null.',
    }],
    sayIt: ['LCA II = standard LCA + existence counter. Return null if either node missing.'],
  }),

  'explicit-stack': e({
    xray: [
      { text: 'Iterative **inorder** using explicit stack', kind: 'goal' },
      { text: 'Iterative **preorder** using explicit stack', kind: 'goal' },
      { text: 'Iterative **postorder** using two stacks', kind: 'goal' },
    ],
    budget: ['iterativeDfs'],
    slottedTemplate: `// Inorder: push all left, pop, process, go right
// Preorder: push root, pop → push right → push left
// Postorder: two stacks (or reverse-preorder)`,
    slots: [],
    slotFills: { 94: {}, 144: {}, 145: {} },
    helixDelta: {
      94: 'Push all left, pop, process, go right',
      144: 'Push root → pop → push right → push left',
      145: 'Two-stack: root→s1, pop→s2, push L→R to s1; drain s2',
    },
    autopsies: [{
      cause: 'LC 145: single-stack postorder like preorder',
      wrong: 'single stack, pop and process — gives modified preorder',
      testCase: 'tree with depth > 1',
      fix: 'Two-stack method: s1 push root, pop to s2, push children L→R to s1; drain s2.',
    }],
    sayIt: ['Iterative DFS: preorder = push R→L. Inorder = push-all-left. Postorder = two-stack.'],
  }),

  'state-tracking': e({
    xray: [
      { text: '**Verify preorder serialization** using slot counting', kind: 'goal' },
      { text: '**Construct BST** from preorder traversal', kind: 'goal' },
    ],
    budget: ['stateTracking'],
    slottedTemplate: `// Slot counting: # consumes 1, non-# consumes 1 and produces 2
// BST construction: stack, pop when next > top, attach as right child`,
    slots: [],
    slotFills: { 331: {}, 1008: {} },
    helixDelta: { 331: 'Slot counting with stack', 1008: 'Monotonic stack for BST construction' },
    autopsies: [{
      cause: 'LC 331: not tracking slots correctly',
      wrong: 'push 1 for all tokens',
      testCase: '"9,3,4,#,#,1,#,#,2,#,6,#,#"',
      fix: 'Non-# consumes 1 and produces 2. # consumes 1. Stack empty at end = valid.',
    }],
    sayIt: ['Slot counting: each node starts with 1 slot, # consumes, non-# produces 2 more.'],
  }),

  'morris-inorder': e({
    xray: [
      { text: '**Inorder** traversal using **O(1) space**', kind: 'goal' },
      { text: '**Recover BST** — find two swapped nodes', kind: 'goal' },
    ],
    budget: ['morris'],
    slottedTemplate: `while (cur) {
    if (!cur->left) {
        {{VISIT}};
        cur = cur->right;
    } else {
        {{THREAD}};
    }
}`,
    slots: [{ id: 'VISIT', label: 'Visit' }, { id: 'THREAD', label: 'Thread logic' }],
    slotFills: {
      94: { VISIT: 'out.push_back(cur->val)', THREAD: 'create pred->right = cur; go left; or unthread, visit, go right' },
      99: { VISIT: 'if (prev && prev->val > cur->val) record swap; prev = cur', THREAD: 'same Morris thread logic' },
    },
    helixDelta: { 94: 'Morris inorder O(1) space threaded', 99: 'Morris inorder + prev tracking for recover BST' },
    autopsies: [{
      cause: 'Forgetting to unthread after visiting left subtree',
      wrong: 'create pred->right = cur but never set pred->right = nullptr',
      testCase: 'second pass through same node — infinite loop',
      fix: 'After visiting left subtree, set pred->right = nullptr (unthread).',
    }],
    sayIt: ['Morris Inorder = O(1) space threaded tree. Create/remove predecessor threads.'],
  }),

  'morris-preorder': e({
    xray: [
      { text: '**Preorder** traversal using O(1) space', kind: 'goal' },
    ],
    budget: ['morris'],
    slottedTemplate: `while (cur) {
    if (!cur->left) {
        {{VISIT}};
        cur = cur->right;
    } else {
        // push val when creating thread (before left)
    }
}`,
    slots: [{ id: 'VISIT', label: 'Visit' }],
    slotFills: { 144: { VISIT: 'out.push_back(cur->val)' } },
    helixDelta: { 144: 'Morris preorder: push val when creating thread (before left descent)' },
    autopsies: [{
      cause: 'Using inorder Morris for preorder',
      wrong: 'same as Morris inorder — visits after left subtree processed',
      testCase: 'root value should appear first in preorder',
      fix: 'Push val when creating thread (before going left), not after.',
    }],
    sayIt: ['Morris Preorder = push val when creating thread (before left descent), not after.'],
  }),

  'standard-level': e({
    xray: [
      { text: 'Return **level-order** traversal (top to bottom)', kind: 'goal' },
      { text: 'Return **bottom-up** level-order', kind: 'goal' },
      { text: 'Return N-ary **level-order**', kind: 'goal' },
    ],
    budget: ['levelOrder'],
    slottedTemplate: `while (!q.empty()) {
    int sz = q.size();
    vector<int> level;
    while (sz--) {
        auto* n = q.front(); q.pop();
        level.push_back(n->val);
        {{PUSH_CHILDREN}}
    }
    {{PROCESS_LEVEL}}
}`,
    slots: [{ id: 'PUSH_CHILDREN', label: 'Push children' }, { id: 'PROCESS_LEVEL', label: 'Process level' }],
    slotFills: {
      102: { PUSH_CHILDREN: 'if (n->left) q.push(n->left); if (n->right) q.push(n->right);', PROCESS_LEVEL: 'ans.push_back(level)' },
      107: { PUSH_CHILDREN: 'same', PROCESS_LEVEL: 'ans.push_back(level); reverse(ans.begin(), ans.end())' },
      429: { PUSH_CHILDREN: 'for (auto* c : n->children) if (c) q.push(c);', PROCESS_LEVEL: 'ans.push_back(level)' },
    },
    helixDelta: { 102: 'Standard BFS queue + per-level', 107: 'Reverse ans at end', 429: 'N-ary: iterate children' },
    autopsies: [{
      cause: 'Not saving queue size before inner loop',
      wrong: 'while (!q.empty()) { vector<int> level; ... q.pop(); q.push(children); }',
      testCase: 'pushing children changes q.size() mid-loop',
      fix: 'int sz = q.size(); then loop sz times.',
    }],
    sayIt: ['Level order: save queue size, one level per outer iteration.'],
  }),

  'level-wise': e({
    xray: [
      { text: 'Return **right side view** of binary tree', kind: 'goal' },
      { text: 'Find **largest value** in each tree row', kind: 'goal' },
      { text: '**Populate next right** pointers', kind: 'goal' },
    ],
    budget: ['rightSide', 'levelMax', 'nextRight'],
    slottedTemplate: `while (!q.empty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        auto* n = q.front(); q.pop();
        {{PER_LEVEL_ACTION}}
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
    {{AFTER_LEVEL}}
}`,
    slots: [{ id: 'PER_LEVEL_ACTION', label: 'Per-level action' }, { id: 'AFTER_LEVEL', label: 'After level' }],
    slotFills: {
      199: { PER_LEVEL_ACTION: 'if (i == sz - 1) ans.push_back(n->val)', AFTER_LEVEL: '' },
      515: { PER_LEVEL_ACTION: 'mx = max(mx, n->val)', AFTER_LEVEL: 'ans.push_back(mx)' },
      116: { PER_LEVEL_ACTION: 'if (i < sz - 1) n->next = q.front()', AFTER_LEVEL: '' },
    },
    helixDelta: { 199: 'Last node per level (right side)', 515: 'Max per level', 116: 'Link nodes within level' },
    autopsies: [{
      cause: 'LC 199: pushing first node instead of last',
      wrong: 'if (i == 0) ans.push_back(n->val); // left side',
      testCase: 'tree where rightmost node is not first in queue',
      fix: 'if (i == sz - 1) ans.push_back(n->val); // last = rightmost',
    }],
    sayIt: ['Level-wise: same BFS, compute per level (last, max, link).'],
  }),

  'depth-width': e({
    xray: [
      { text: 'Find **maximum depth** of binary tree', kind: 'goal' },
      { text: 'Find **minimum depth** of binary tree', kind: 'goal' },
      { text: 'Find **maximum width** of binary tree', kind: 'goal' },
    ],
    budget: ['maxDepth', 'maxWidth'],
    slottedTemplate: `// Max depth: 1 + max(left, right)
// Min depth: handle one-child case
// Width: BFS with index tracking`,
    slots: [],
    slotFills: { 104: {}, 111: {}, 662: {} },
    helixDelta: { 104: 'Recursive 1 + max children', 111: 'Min depth: handle one-child', 662: 'BFS with 2*idx, 2*idx+1' },
    autopsies: [{
      cause: 'LC 111: min depth requires leaf (both null)',
      wrong: 'return 1 + min(minDepth(left), minDepth(right));',
      testCase: '[2,null,3,null,4] — left is null, min(0, depth) = 0',
      fix: 'If only one child, depth = 1 + that child; min both only if both exist.',
    }],
    sayIt: ['Max depth = recursion. Min depth = handle one-child. Width = BFS with index.'],
  }),

  'multi-source-bfs': e({
    xray: [
      { text: 'Find **maximum level sum** in a binary tree', kind: 'goal' },
      { text: 'Return **sum of deepest leaves**', kind: 'goal' },
    ],
    budget: ['multiSourceBfs'],
    slottedTemplate: `while (!q.empty()) {
    int sz = q.size();
    {{RESET_AGGREGATE}}
    while (sz--) {
        auto* n = q.front(); q.pop();
        {{ACCUMULATE}}
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
    {{TRACK_BEST}}
}`,
    slots: [{ id: 'RESET_AGGREGATE', label: 'Reset' }, { id: 'ACCUMULATE', label: 'Accumulate' }, { id: 'TRACK_BEST', label: 'Track best' }],
    slotFills: {
      1161: { RESET_AGGREGATE: 'int sum = 0', ACCUMULATE: 'sum += n->val', TRACK_BEST: 'if (sum > maxSum) { maxSum = sum; maxLevel = level; } level++' },
      1302: { RESET_AGGREGATE: 'int sum = 0', ACCUMULATE: 'sum += n->val', TRACK_BEST: 'ans = sum' },
    },
    helixDelta: { 1161: 'Track max sum + level', 1302: 'Reset sum per level, last wins' },
    autopsies: [{
      cause: 'LC 1302: not resetting sum before each level',
      wrong: 'int sum = 0; // declared once before outer loop',
      testCase: 'multiple levels — sum accumulates',
      fix: 'int sum = 0; // reset at start of each level in outer loop',
    }],
    sayIt: ['Multi-source BFS: same skeleton, compute per-level aggregate (sum, max).'],
  }),

  'bidirectional-bfs': e({
    xray: [
      { text: 'Return all nodes **distance K** from target node', kind: 'goal' },
    ],
    budget: ['bidirectionalBfs'],
    slottedTemplate: `// 1) Build parent map via DFS
// 2) BFS from target, visited set, collect nodes at dist == K`,
    slots: [],
    slotFills: { 863: {} },
    helixDelta: { 863: 'Parent map + BFS from target; distance K = level K nodes' },
    autopsies: [{
      cause: 'No visited set — parent creates cycles',
      wrong: 'queue only, no visited tracking',
      testCase: 'BFS goes parent → child → parent (cycle)',
      fix: 'Use unordered_set for visited before enqueuing.',
    }],
    sayIt: ['Bidirectional BFS on tree: parent map + BFS from target. Distance K = level K.'],
  }),

  boundary: e({
    xray: [
      { text: 'Return **boundary** of binary tree', kind: 'goal' },
    ],
    budget: ['boundary'],
    slottedTemplate: `// 1) Left boundary top-down (skip leaves)
// 2) Leaves inorder
// 3) Right boundary bottom-up (skip leaves)`,
    slots: [],
    slotFills: { 545: {} },
    helixDelta: { 545: 'Three-phase: left edge + leaves + right edge' },
    autopsies: [{
      cause: 'Double-counting leaf nodes on boundary',
      wrong: 'leftB visits leaf, leaves visits leaf again',
      testCase: 'leaf on left edge — value appears twice',
      fix: 'leftB/rightB skip leaves (return if no children); leaves covers all.',
    }],
    sayIt: ['Boundary = left edge (top-down) + leaves (inorder) + right edge (bottom-up). Three phases.'],
  }),

  vertical: e({
    xray: [
      { text: 'Return **vertical order** traversal by column', kind: 'goal' },
    ],
    budget: ['vertical'],
    slottedTemplate: `map<int, map<int, multiset<int>>> m;
void dfs(TreeNode* r, int col, int row) {
    if (!r) return;
    m[col][row].insert(r->val);
    dfs(r->left, col - 1, row + 1);
    dfs(r->right, col + 1, row + 1);
}`,
    slots: [],
    slotFills: { 987: {} },
    helixDelta: { 987: 'DFS with (col,row); map<col, map<row, multiset>>' },
    autopsies: [{
      cause: 'Not using multiset for same (col,row) values',
      wrong: 'm[col][row].push_back(val); // not sorted',
      testCase: 'two nodes at same (col,row) need ascending sort',
      fix: 'm[col][row].insert(val); // multiset keeps sorted order',
    }],
    sayIt: ['Vertical: DFS with (col,row). Nested map sorts by col, row, value.'],
  }),

  zigzag: e({
    xray: [
      { text: 'Return **zigzag** level order (alternating direction)', kind: 'goal' },
    ],
    budget: ['zigzag'],
    slottedTemplate: `bool ltr = true;
while (!q.empty()) {
    int sz = q.size();
    vector<int> level(sz);
    for (int i = 0; i < sz; i++) {
        auto* n = q.front(); q.pop();
        int idx = {{FILL_DIRECTION}};
        level[idx] = n->val;
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
    ltr = !ltr;
}`,
    slots: [{ id: 'FILL_DIRECTION', label: 'Fill index' }],
    slotFills: { 103: { FILL_DIRECTION: 'ltr ? i : sz - 1 - i' } },
    helixDelta: { 103: 'Toggle leftToRight; fill from front or back' },
    autopsies: [{
      cause: 'Wrong index for right-to-left fill',
      wrong: 'int idx = ltr ? i : i; // same both directions',
      testCase: 'level of 3 nodes, R→L should be [n2, n1, n0]',
      fix: 'int idx = ltr ? i : sz - 1 - i;',
    }],
    sayIt: ['Zigzag: level order + toggle fill direction. Index = i or sz-1-i.'],
  }),

  'side-views': e({
    xray: [
      { text: 'Return **right side view** of binary tree', kind: 'goal' },
    ],
    budget: ['sideView'],
    slottedTemplate: `while (!q.empty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        auto* n = q.front(); q.pop();
        if (i == {{TARGET_INDEX}}) ans.push_back(n->val);
        if (n->left) q.push(n->left);
        if (n->right) q.push(n->right);
    }
}`,
    slots: [{ id: 'TARGET_INDEX', label: 'Target index' }],
    slotFills: { 199: { TARGET_INDEX: 'sz - 1' } },
    helixDelta: { 199: 'Last node per level = right side view (BFS)' },
    autopsies: [{
      cause: 'Pushing first instead of last node',
      wrong: 'if (i == 0) ans.push_back(n->val); // left side',
      testCase: 'rightmost node not at queue front',
      fix: 'if (i == sz - 1) ans.push_back(n->val); // last = rightmost',
    }],
    sayIt: ['Side views = BFS per-level. Right = last, Left = first node of each level.'],
  }),

  'top-bottom': e({
    xray: [
      { text: 'Return **vertical order** (BFS, no row sort)', kind: 'goal' },
    ],
    budget: ['topView'],
    slottedTemplate: `queue<pair<TreeNode*,int>> q;
q.push({root, 0});
while (!q.empty()) {
    auto [n, col] = q.front(); q.pop();
    m[col].push_back(n->val);
    if (n->left) q.push({n->left, col - 1});
    if (n->right) q.push({n->right, col + 1});
}`,
    slots: [],
    slotFills: { 314: {} },
    helixDelta: { 314: 'BFS with column index; no row sort needed' },
    autopsies: [{
      cause: 'Using DFS (requires row sorting) for BFS-based vertical order',
      wrong: 'DFS with (col,row) — overcomplicated for BFS',
      testCase: 'BFS naturally processes rows in order',
      fix: 'Use BFS (queue) — nodes already in row order by construction.',
    }],
    sayIt: ['Top view = first per column. Bottom = last per column. BFS ensures row order.'],
  }),

  'construct-tree': e({
    xray: [
      { text: '**Construct** binary tree from preorder and inorder', kind: 'goal' },
      { text: '**Construct** from inorder and postorder', kind: 'goal' },
    ],
    budget: ['constructTree'],
    slottedTemplate: `function<TreeNode*(int,int)> build = [&](int lo, int hi) {
    if (lo > hi) return nullptr;
    int val = {{GET_ROOT}};
    int mid = m[val];
    return new TreeNode(val, {{BUILD_LEFT}}, {{BUILD_RIGHT}});
};`,
    slots: [{ id: 'GET_ROOT', label: 'Get root' }, { id: 'BUILD_LEFT', label: 'Build left' }, { id: 'BUILD_RIGHT', label: 'Build right' }],
    slotFills: {
      105: { GET_ROOT: 'preorder[idx++]', BUILD_LEFT: 'build(lo, mid-1)', BUILD_RIGHT: 'build(mid+1, hi)' },
      106: { GET_ROOT: 'postorder[idx--]', BUILD_LEFT: 'build(lo, mid-1)', BUILD_RIGHT: 'build(mid+1, hi)' },
    },
    helixDelta: { 105: 'Pre+In: preorder gives root, inorder splits', 106: 'In+Post: postorder goes right-to-left, recurse right first' },
    autopsies: [{
      cause: 'LC 106: not recursing right subtree first',
      wrong: 'build(lo, mid-1) then build(mid+1, hi) // same as preorder',
      testCase: 'postorder processes children before parent',
      fix: 'Right subtree first: build(mid+1, hi), then build(lo, mid-1).',
    }],
    sayIt: ['Build: preorder gives root index, inorder splits left/right.'],
  }),

  serialize: e({
    xray: [
      { text: '**Serialize** a binary tree to a string', kind: 'goal' },
      { text: '**Deserialize** a string back to tree', kind: 'goal' },
    ],
    budget: ['serialize'],
    slottedTemplate: `// Serialize: preorder with "#" for null
string s(TreeNode* r) {
    if (!r) return "#";
    return to_string(r->val) + "," + s(r->left) + "," + s(r->right);
}
// Deserialize: read preorder, build recursively
TreeNode* d() {
    if (tok == "#") return nullptr;
    auto* n = new TreeNode(stoi(tok));
    n->left = d();
    n->right = d();
    return n;
}`,
    slots: [],
    slotFills: { 297: {}, 449: {} },
    helixDelta: { 297: 'Preorder + "#" null markers', 449: 'BST: no "#" — use val range for split' },
    autopsies: [{
      cause: 'Using a value that could collide with valid node values as null marker',
      wrong: 'if (tok == "null") return nullptr; // could be valid node value',
      testCase: 'node value happens to be "null" string',
      fix: 'Use "#" or another sentinel that cannot parse as integer.',
    }],
    sayIt: ['Serialize: preorder with null markers. Deserialize: read preorder, build recursively.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
