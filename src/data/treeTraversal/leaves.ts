import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <unordered_map>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <sstream>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};

`

// ═══════════════════════════════════════════════════════════════
// Recursive DFS — Preorder
// ═══════════════════════════════════════════════════════════════

export const preorderLeaf = leaf('preorder', 'Preorder Traversal (Root→Left→Right)', 'lime', {
  template: `${CPP_HEADER}vector<int> preorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> dfs = [&](TreeNode* r) {
        if (!r) return;
        out.push_back(r->val);
        dfs(r->left);
        dfs(r->right);
    };
    dfs(root);
    return out;
}`,
  problems: [
    { id: 144, title: 'Binary Tree Preorder', slug: 'binary-tree-preorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (standard recursive preorder).' },
    { id: 589, title: 'N-ary Preorder', slug: 'n-ary-tree-preorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Iterate children vector instead of left/right.', variationCode: 'out.push_back(r->val); for (auto* c : r->children) dfs(c);' },
    { id: 257, title: 'Binary Tree Paths', slug: 'binary-tree-paths', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Preorder with path string; add to ans at leaf; backtrack after recursion.', variationCode: 'if (!r) return; path += to_string(r->val); if (!r->left && !r->right) ans.push_back(path); else { path += "->"; dfs(r->left, path, ans); dfs(r->right, path, ans); path.pop_back(); }' },
  ],
  pitfalls: ['❌ LC 257: path string mutation — backtrack (pop) after recursive call.', '❌ N-ary: for loop over children, not left/right.'],
  interviewTip: '💡 Preorder = process root first, then recurse children. Clone trees, serialize, prefix expression.',
})

// ═══════════════════════════════════════════════════════════════
// Recursive DFS — Inorder
// ═══════════════════════════════════════════════════════════════

export const inorderLeaf = leaf('inorder', 'Inorder Traversal (Left→Root→Right)', 'lime', {
  template: `${CPP_HEADER}vector<int> inorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> dfs = [&](TreeNode* r) {
        if (!r) return;
        dfs(r->left);
        out.push_back(r->val);
        dfs(r->right);
    };
    dfs(root);
    return out;
}`,
  problems: [
    { id: 94, title: 'Inorder Traversal', slug: 'binary-tree-inorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (standard recursive inorder: left, root, right).' },
    { id: 98, title: 'Validate BST', slug: 'validate-binary-search-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Track prev node during inorder; prev->val >= root->val → invalid.', variationCode: 'TreeNode* prev = nullptr; bool ok = true; function<void(TreeNode*)> dfs = [&](TreeNode* r) { if (!r || !ok) return; dfs(r->left); if (prev && prev->val >= r->val) ok = false; prev = r; dfs(r->right); }; dfs(root); return ok;' },
    { id: 230, title: 'Kth Smallest BST', slug: 'kth-smallest-element-in-a-bst', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Inorder until k == 0; capture val and return.', variationCode: 'int ans = 0, cnt = 0; function<void(TreeNode*)> dfs = [&](TreeNode* r) { if (!r) return; dfs(r->left); if (++cnt == k) { ans = r->val; return; } dfs(r->right); }; dfs(root); return ans;' },
  ],
  pitfalls: ['❌ LC 98: prev must be the immediately previous node in inorder sequence — not parent.', '❌ LC 230: inorder of BST = sorted order; kth smallest = kth inorder element.'],
  interviewTip: '💡 Inorder of BST = sorted order. Validate: prev >= curr → invalid. Kth: count inorder nodes.',
})

// ═══════════════════════════════════════════════════════════════
// Recursive DFS — Postorder
// ═══════════════════════════════════════════════════════════════

export const postorderLeaf = leaf('postorder', 'Postorder Traversal (Left→Right→Root)', 'lime', {
  template: `${CPP_HEADER}vector<int> postorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> dfs = [&](TreeNode* r) {
        if (!r) return;
        dfs(r->left);
        dfs(r->right);
        out.push_back(r->val);
    };
    dfs(root);
    return out;
}`,
  problems: [
    { id: 145, title: 'Postorder Traversal', slug: 'binary-tree-postorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (standard recursive postorder: left, right, root).' },
    { id: 590, title: 'N-ary Postorder', slug: 'n-ary-tree-postorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Iterate children then push root val.', variationCode: 'for (auto* c : r->children) dfs(c); out.push_back(r->val);' },
    { id: 124, title: 'Max Path Sum', slug: 'binary-tree-maximum-path-sum', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Postorder DP: max(0, left) + max(0, right) + val; update global ans.', variationCode: 'int ans = INT_MIN; function<int(TreeNode*)> dfs = [&](TreeNode* r) { if (!r) return 0; int l = max(0, dfs(r->left)), ri = max(0, dfs(r->right)); ans = max(ans, l + ri + r->val); return r->val + max(l, ri); }; dfs(root); return ans;' },
  ],
  pitfalls: ['❌ LC 124: max(0, childSum) — skip negative contributions.', '❌ Local max through node = left + right + val; return = val + max(left,right) for parent.'],
  interviewTip: '💡 Postorder = process children first, then root. Used for tree DP, delete tree, max path sum.',
})

// ═══════════════════════════════════════════════════════════════
// Path-Based DFS — Root-to-Leaf Paths
// ═══════════════════════════════════════════════════════════════

export const pathSumLeaf = leaf('path-sum', 'Path Sum (Root-to-Leaf)', 'lime', {
  template: `${CPP_HEADER}bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    target -= root->val;
    if (!root->left && !root->right) return target == 0;
    return hasPathSum(root->left, target) ||
           hasPathSum(root->right, target);
}`,
  problems: [
    { id: 112, title: 'Path Sum', slug: 'path-sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (subtract-on-entry pattern; check target==0 at leaf).' },
  ],
  pitfalls: ['❌ subtracting value from target on the way down (not accumulating sum).'],
  interviewTip: '💡 Path Sum = subtract val on entry, check == 0 at leaf.',
})

export const pathSumIILeaf = leaf('path-sum-ii', 'Path Sum II (Collect Paths)', 'lime', {
  template: `${CPP_HEADER}vector<vector<int>> pathSum(TreeNode* root, int target) {
    vector<vector<int>> ans;
    vector<int> path;
    function<void(TreeNode*,int)> dfs = [&](TreeNode* r, int t) {
        if (!r) return;
        path.push_back(r->val);
        if (!r->left && !r->right && t == r->val)
            ans.push_back(path);
        dfs(r->left, t - r->val);
        dfs(r->right, t - r->val);
        path.pop_back();
    };
    dfs(root, target);
    return ans;
}`,
  problems: [
    { id: 113, title: 'Path Sum II', slug: 'path-sum-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (collect path vector; push to ans at leaf; backtrack on return).' },
  ],
  pitfalls: ['❌ Not backtracking the path vector after recursive call — path keeps growing.', '❌ Pass target - val, not accumulating sum.'],
  interviewTip: '💡 Path Sum II = preorder + path vector + backtrack at leaf.',
})

// ═══════════════════════════════════════════════════════════════
// Path-Based DFS — Any Path (Node-to-Node)
// ═══════════════════════════════════════════════════════════════

export const pathSumIIILeaf = leaf('path-sum-iii', 'Path Sum III (Any Path)', 'lime', {
  template: `${CPP_HEADER}int pathSum(TreeNode* root, int target) {
    unordered_map<long, int> m;
    m[0] = 1;
    int ans = 0;
    function<void(TreeNode*, long)> dfs = [&](TreeNode* r, long cur) {
        if (!r) return;
        cur += r->val;
        ans += m[cur - target];
        m[cur]++;
        dfs(r->left, cur);
        dfs(r->right, cur);
        m[cur]--;
    };
    dfs(root, 0);
    return ans;
}`,
  problems: [
    { id: 437, title: 'Path Sum III', slug: 'path-sum-iii', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (prefix sum map during DFS; count cur - target in map; backtrack).' },
  ],
  pitfalls: ['❌ Not resetting map count after processing subtree — counts persist for siblings.', '❌ Use long for prefix sum to avoid overflow.'],
  interviewTip: '💡 Path Sum III = prefix sum map + DFS + backtrack. Counts paths starting anywhere.',
})

export const univalueLeaf = leaf('univalue', 'Longest Univalue Path', 'lime', {
  template: `${CPP_HEADER}int longestUnivaluePath(TreeNode* root) {
    int ans = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* r) {
        if (!r) return 0;
        int l = dfs(r->left), ri = dfs(r->right);
        int lx = (r->left && r->left->val == r->val) ? l + 1 : 0;
        int rx = (r->right && r->right->val == r->val) ? ri + 1 : 0;
        ans = max(ans, lx + rx);
        return max(lx, rx);
    };
    dfs(root);
    return ans;
}`,
  problems: [
    { id: 687, title: 'Longest Univalue Path', slug: 'longest-univalue-path', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (postorder; extend when child value matches parent; track max edges).' },
  ],
  pitfalls: ['❌ Counting nodes instead of edges — path length = number of edges, not nodes.', '❌ Only extend when child value == parent value; can\'t skip intermediate nodes.'],
  interviewTip: '💡 Univalue Path = postorder + match check. Return max extension, ans = lx + rx.',
})

// ═══════════════════════════════════════════════════════════════
// Path-Based DFS — Ancestor-Descendant
// ═══════════════════════════════════════════════════════════════

export const lcaLeaf = leaf('lca', 'Lowest Common Ancestor', 'lime', {
  template: `${CPP_HEADER}TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    auto* l = lowestCommonAncestor(root->left, p, q);
    auto* r = lowestCommonAncestor(root->right, p, q);
    if (l && r) return root;
    return l ? l : r;
}`,
  problems: [
    { id: 236, title: 'LCA', slug: 'lowest-common-ancestor-of-a-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'As-is (postorder; if both sides non-null, node is LCA).' },
  ],
  pitfalls: ['❌ LCA works by postorder — if both left and right return non-null, current node is LCA.', '❌ Doesn\'t check existence of p and q — assumes both are in tree.'],
  interviewTip: '💡 LCA = postorder. If both sides non-null, current is LCA.',
})

export const lcaIILeaf = leaf('lca-ii', 'LCA with Existence Check', 'lime', {
  template: `${CPP_HEADER}TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    int count = 0;
    function<TreeNode*(TreeNode*)> dfs = [&](TreeNode* r) {
        if (!r) return (TreeNode*)nullptr;
        auto* l = dfs(r->left);
        auto* ri = dfs(r->right);
        if (r == p || r == q) { count++; return r; }
        if (l && ri) return r;
        return l ? l : ri;
    };
    auto* ans = dfs(root);
    return count == 2 ? ans : nullptr;
}`,
  problems: [
    { id: 1644, title: 'LCA II', slug: 'lowest-common-ancestor-of-a-binary-tree-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (wrap LCA with count; return null if count < 2).' },
  ],
  pitfalls: ['❌ p and q might not exist — must verify both were found (count == 2).'],
  interviewTip: '💡 LCA II = standard LCA + existence counter. Return null if either node missing.',
})

// ═══════════════════════════════════════════════════════════════
// Iterative DFS — Explicit Stack Traversals
// ═══════════════════════════════════════════════════════════════

export const explicitStackLeaf = leaf('explicit-stack', 'Explicit Stack Traversals', 'lime', {
  template: `${CPP_HEADER}vector<int> inorderTraversal(TreeNode* root) {
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
    { id: 94, title: 'Inorder Iterative', slug: 'binary-tree-inorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (push-all-left, pop, process, go right).' },
    { id: 144, title: 'Preorder Iterative', slug: 'binary-tree-preorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Push root → pop → push right → push left.', variationCode: 'stack<TreeNode*> st; st.push(root); while (!st.empty()) { auto* n = st.top(); st.pop(); out.push_back(n->val); if (n->right) st.push(n->right); if (n->left) st.push(n->left); }' },
    { id: 145, title: 'Postorder Iterative', slug: 'binary-tree-postorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Two-stack: push root to s1, pop to s2, push L→R to s1; drain s2.', variationCode: 'stack<TreeNode*> s1, s2; s1.push(root); while (!s1.empty()) { auto* n = s1.top(); s1.pop(); s2.push(n); if (n->left) s1.push(n->left); if (n->right) s1.push(n->right); } while (!s2.empty()) { out.push_back(s2.top()->val); s2.pop(); }' },
  ],
  pitfalls: ['❌ LC 145: postorder needs two stacks or a reverse-preorder trick (push R→L, collect to second stack).'],
  interviewTip: '💡 Iterative DFS: preorder = stack push R→L. Inorder = push-all-left. Postorder = two-stack.',
})

// ═══════════════════════════════════════════════════════════════
// Iterative DFS — State-Tracking
// ═══════════════════════════════════════════════════════════════

export const stateTrackingLeaf = leaf('state-tracking', 'State-Tracking DFS', 'lime', {
  template: `${CPP_HEADER}bool isValidSerialization(string preorder) {
    stringstream ss(preorder);
    string tok;
    stack<int> st;
    st.push(1);
    while (getline(ss, tok, ',')) {
        if (st.empty()) return false;
        if (tok == "#") {
            st.top()--;
            if (st.top() == 0) st.pop();
        } else {
            st.top()--;
            if (st.top() == 0) st.pop();
            st.push(2);
        }
    }
    return st.empty();
}`,
  problems: [
    { id: 331, title: 'Verify Preorder Serialization', slug: 'verify-preorder-serialization-of-a-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (slot counting: # consumes 1 slot, non-# consumes 1 and produces 2).' },
    { id: 1008, title: 'Construct BST from Preorder', slug: 'construct-binary-search-tree-from-preorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Iterative stack; push nodes, pop when next > stack top, attach as right child.', variationCode: 'stack<TreeNode*> st; TreeNode* root = new TreeNode(preorder[0]); st.push(root); for (int i = 1; i < n; i++) { TreeNode* node = new TreeNode(preorder[i]); TreeNode* parent = nullptr; while (!st.empty() && st.top()->val < preorder[i]) { parent = st.top(); st.pop(); } if (parent) parent->right = node; else st.top()->left = node; st.push(node); } return root;' },
  ],
  pitfalls: ['❌ LC 331: not tracking slots correctly — # consumes 1, non-# consumes 1 and produces 2.', '❌ LC 1008: BST property — pop from stack while next preorder value > stack top.'],
  interviewTip: '💡 Slot counting: each node starts with 1 slot, # consumes, non-# produces 2 more.',
})

// ═══════════════════════════════════════════════════════════════
// Morris Traversal — Inorder
// ═══════════════════════════════════════════════════════════════

export const morrisInorderLeaf = leaf('morris-inorder', 'Morris Inorder (O(1) Space)', 'lime', {
  template: `${CPP_HEADER}vector<int> inorderTraversal(TreeNode* root) {
    vector<int> out;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            out.push_back(cur->val);
            cur = cur->right;
        } else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur)
                pred = pred->right;
            if (!pred->right) {
                pred->right = cur;
                cur = cur->left;
            } else {
                pred->right = nullptr;
                out.push_back(cur->val);
                cur = cur->right;
            }
        }
    }
    return out;
}`,
  problems: [
    { id: 94, title: 'Morris Inorder', slug: 'binary-tree-inorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (O(1) space — threaded tree: create/remove predecessor thread).' },
    { id: 99, title: 'Recover BST', slug: 'recover-binary-search-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Morris inorder + prev tracking; when prev->val > cur->val, record swapped nodes.', variationCode: 'TreeNode *prev = nullptr, *x = nullptr, *y = nullptr; // same Morris traversal; if (prev && prev->val > cur->val) { if (!x) x = prev; y = cur; } prev = cur; swap(x->val, y->val);' },
  ],
  pitfalls: ['❌ Morris modifies the tree (temporary threads) — must unthread after visiting.', '❌ LC 99: two-pass to find both swapped nodes.'],
  interviewTip: '💡 Morris Inorder = O(1) space. Find predecessor, create/remove thread for each node.',
})

// ═══════════════════════════════════════════════════════════════
// Morris Traversal — Preorder
// ═══════════════════════════════════════════════════════════════

export const morrisPreorderLeaf = leaf('morris-preorder', 'Morris Preorder (O(1) Space)', 'lime', {
  template: `${CPP_HEADER}vector<int> preorderTraversal(TreeNode* root) {
    vector<int> out;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            out.push_back(cur->val);
            cur = cur->right;
        } else {
            TreeNode* pred = cur->left;
            while (pred->right && pred->right != cur)
                pred = pred->right;
            if (!pred->right) {
                out.push_back(cur->val);
                pred->right = cur;
                cur = cur->left;
            } else {
                pred->right = nullptr;
                cur = cur->right;
            }
        }
    }
    return out;
}`,
  problems: [
    { id: 144, title: 'Morris Preorder', slug: 'binary-tree-preorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (push val when creating thread (before going left) instead of after).' },
  ],
  pitfalls: ['❌ Same as Morris inorder — must unthread (restore tree) after visiting left subtree.'],
  interviewTip: '💡 Morris Preorder = push val when creating thread (before left descent), not after.',
})

// ═══════════════════════════════════════════════════════════════
// BFS — Standard Level Order
// ═══════════════════════════════════════════════════════════════

export const standardLevelLeaf = leaf('standard-level', 'Standard Level Order', 'amber', {
  template: `${CPP_HEADER}vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> ans;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        while (sz--) {
            auto* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        ans.push_back(level);
    }
    return ans;
}`,
  problems: [
    { id: 102, title: 'Level Order', slug: 'binary-tree-level-order-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (queue + per-level processing).' },
    { id: 107, title: 'Level Order II', slug: 'binary-tree-level-order-traversal-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Reverse ans at end.', variationCode: 'reverse(ans.begin(), ans.end());' },
    { id: 429, title: 'N-ary Level Order', slug: 'n-ary-tree-level-order-traversal', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Iterate children vector instead of left/right.', variationCode: 'for (auto* c : n->children) if (c) q.push(c);' },
  ],
  pitfalls: ['❌ Forgetting to save queue size before inner loop (sz changes as we push children).'],
  interviewTip: '💡 Level order = queue, save size, loop over current level. O(n) time, O(w) space.',
})

// ═══════════════════════════════════════════════════════════════
// BFS — Level-Wise Processing
// ═══════════════════════════════════════════════════════════════

export const levelWiseLeaf = leaf('level-wise', 'Level-Wise Processing', 'amber', {
  template: `${CPP_HEADER}vector<int> rightSideView(TreeNode* root) {
    if (!root) return {};
    vector<int> ans;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        for (int i = 0; i < sz; i++) {
            auto* n = q.front(); q.pop();
            if (i == sz - 1) ans.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return ans;
}`,
  problems: [
    { id: 199, title: 'Right Side View', slug: 'binary-tree-right-side-view', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'As-is (last node of each level → right side view).' },
    { id: 515, title: 'Largest Row Value', slug: 'find-largest-value-in-each-tree-row', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Track max per level instead of last element.', variationCode: 'int mx = INT_MIN; for (int i = 0; i < sz; i++) { ... mx = max(mx, n->val); } ans.push_back(mx);' },
    { id: 116, title: 'Next Right Pointers', slug: 'populating-next-right-pointers-in-each-node', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Link nodes within level: n->next = q.front() for i < sz-1.', variationCode: 'for (int i = 0; i < sz; i++) { auto* n = q.front(); q.pop(); if (i < sz - 1) n->next = q.front(); if (n->left) q.push(n->left); if (n->right) q.push(n->right); }' },
  ],
  pitfalls: ['❌ LC 199: push last node of level (i == sz-1), not first.', '❌ LC 116: O(1) space uses parent level next pointers — trickier but more efficient.'],
  interviewTip: '💡 Level-wise processing: same BFS skeleton, but compute per level (last, max, link).',
})

// ═══════════════════════════════════════════════════════════════
// BFS — Depth-Based Analysis
// ═══════════════════════════════════════════════════════════════

export const depthWidthLeaf = leaf('depth-width', 'Depth-Based Analysis', 'amber', {
  template: `${CPP_HEADER}int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left),
                   maxDepth(root->right));
}`,
  problems: [
    { id: 104, title: 'Max Depth', slug: 'maximum-depth-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (recursive: 1 + max of children).' },
    { id: 111, title: 'Min Depth', slug: 'minimum-depth-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Handle one-child case; if only one child, depth = 1 + that child.', variationCode: 'if (!root) return 0; if (!root->left) return 1 + minDepth(root->right); if (!root->right) return 1 + minDepth(root->left); return 1 + min(minDepth(root->left), minDepth(root->right));' },
    { id: 662, title: 'Max Width', slug: 'maximum-width-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'BFS with index (2*idx for left, 2*idx+1 for right); width = last-first+1 per level.', variationCode: 'queue<pair<TreeNode*, unsigned long long>> q; q.push({root, 0}); unsigned long long ans = 0; while (!q.empty()) { int sz = q.size(); auto [l, first] = q.front(); auto [r, last] = q.back(); ans = max(ans, last - first + 1); for (int i = 0; i < sz; i++) { auto [n, id] = q.front(); q.pop(); if (n->left) q.push({n->left, id * 2}); if (n->right) q.push({n->right, id * 2 + 1}); } } return ans;' },
  ],
  pitfalls: ['❌ LC 111: min depth requires a leaf (both children null) — not just min of children.', '❌ LC 662: index overflow for deep trees — use unsigned long long.'],
  interviewTip: '💡 Depth = 1 + max/min of children. Width = BFS with index tracking (2*i, 2*i+1).',
})

// ═══════════════════════════════════════════════════════════════
// BFS — Multi-Source
// ═══════════════════════════════════════════════════════════════

export const multiSourceBfsLeaf = leaf('multi-source-bfs', 'Multi-Source BFS', 'amber', {
  template: `${CPP_HEADER}int maxLevelSum(TreeNode* root) {
    if (!root) return 0;
    queue<TreeNode*> q; q.push(root);
    int maxSum = INT_MIN, maxLevel = 1, level = 0;
    while (!q.empty()) {
        int sz = (int)q.size(), sum = 0;
        level++;
        while (sz--) {
            auto* n = q.front(); q.pop();
            sum += n->val;
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        if (sum > maxSum) { maxSum = sum; maxLevel = level; }
    }
    return maxLevel;
}`,
  problems: [
    { id: 1161, title: 'Max Level Sum', slug: 'maximum-level-sum-of-a-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (BFS with per-level sum tracking).' },
    { id: 1302, title: 'Deepest Leaves Sum', slug: 'deepest-leaves-sum', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Reset sum each level; return last level sum.', variationCode: 'int sum = 0; while (!q.empty()) { int sz = q.size(); sum = 0; while (sz--) { ... sum += n->val; ... } } return sum;' },
  ],
  pitfalls: ['❌ LC 1161: track both maxSum and the level where it occurs.', '❌ LC 1302: reset sum at start of each level.'],
  interviewTip: '💡 Multi-source BFS on trees: same BFS skeleton, compute per-level aggregates.',
})

// ═══════════════════════════════════════════════════════════════
// BFS — Bidirectional
// ═══════════════════════════════════════════════════════════════

export const bidirectionalBfsLeaf = leaf('bidirectional-bfs', 'Bidirectional BFS', 'amber', {
  template: `${CPP_HEADER}vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<TreeNode*, TreeNode*> parent;
    function<void(TreeNode*,TreeNode*)> dfs = [&](TreeNode* r, TreeNode* p) {
        if (!r) return;
        parent[r] = p;
        dfs(r->left, r);
        dfs(r->right, r);
    };
    dfs(root, nullptr);
    queue<TreeNode*> q; q.push(target);
    unordered_set<TreeNode*> seen; seen.insert(target);
    int dist = 0;
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        while (sz--) {
            auto* n = q.front(); q.pop();
            level.push_back(n->val);
            for (auto* next : {n->left, n->right, parent[n]}) {
                if (next && !seen.count(next)) {
                    seen.insert(next);
                    q.push(next);
                }
            }
        }
        if (dist == k) return level;
        dist++;
    }
    return {};
}`,
  problems: [
    { id: 863, title: 'All Nodes Distance K', slug: 'all-nodes-distance-k-in-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (build parent map via DFS, then BFS from target; collect nodes at distance K).' },
  ],
  pitfalls: ['❌ Forgetting visited set — parent pointers create cycles in undirected view.', '❌ Building parent map with DFS before BFS — O(n) prep.'],
  interviewTip: '💡 Bidirectional BFS on tree: parent map + BFS from target. Distance K = level K nodes.',
})

// ═══════════════════════════════════════════════════════════════
// Specialized — Boundary
// ═══════════════════════════════════════════════════════════════

export const boundaryLeaf = leaf('boundary', 'Boundary Traversal', 'pink', {
  template: `${CPP_HEADER}vector<int> boundaryOfBinaryTree(TreeNode* root) {
    if (!root) return {};
    vector<int> ans = {root->val};
    function<void(TreeNode*,bool)> leftB = [&](TreeNode* r, bool isB) {
        if (!r || (!r->left && !r->right)) return;
        if (isB) ans.push_back(r->val);
        leftB(r->left, isB);
        leftB(r->right, isB && !r->left);
    };
    function<void(TreeNode*)> leaves = [&](TreeNode* r) {
        if (!r) return;
        leaves(r->left);
        if (!r->left && !r->right) ans.push_back(r->val);
        leaves(r->right);
    };
    function<void(TreeNode*,bool)> rightB = [&](TreeNode* r, bool isB) {
        if (!r || (!r->left && !r->right)) return;
        rightB(r->right, isB);
        rightB(r->left, isB && !r->right);
        if (isB) ans.push_back(r->val);
    };
    leftB(root->left, true);
    leaves(root->left);
    leaves(root->right);
    rightB(root->right, true);
    return ans;
}`,
  problems: [
    { id: 545, title: 'Boundary of Binary Tree', slug: 'boundary-of-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'As-is (three phases: left boundary top-down, leaves inorder, right boundary bottom-up).' },
  ],
  pitfalls: ['❌ Double-counting leaf nodes — left boundary phase skips leaves.', '❌ Right boundary collected in reverse (postorder-style).'],
  interviewTip: '💡 Boundary = left edge (top-down) + leaves (inorder) + right edge (bottom-up). Three phases.',
})

// ═══════════════════════════════════════════════════════════════
// Specialized — Vertical
// ═══════════════════════════════════════════════════════════════

export const verticalLeaf = leaf('vertical', 'Vertical Traversal', 'pink', {
  template: `${CPP_HEADER}vector<vector<int>> verticalTraversal(TreeNode* root) {
    map<int, map<int, multiset<int>>> m;
    function<void(TreeNode*,int,int)> dfs = [&](TreeNode* r, int col, int row) {
        if (!r) return;
        m[col][row].insert(r->val);
        dfs(r->left, col - 1, row + 1);
        dfs(r->right, col + 1, row + 1);
    };
    dfs(root, 0, 0);
    vector<vector<int>> ans;
    for (auto& [col, rows] : m) {
        vector<int> colVals;
        for (auto& [row, vals] : rows)
            colVals.insert(colVals.end(), vals.begin(), vals.end());
        ans.push_back(colVals);
    }
    return ans;
}`,
  problems: [
    { id: 987, title: 'Vertical Order', slug: 'vertical-order-traversal-of-a-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (DFS with col,row; map<col, map<row, multiset>> for sorted output).' },
  ],
  pitfalls: ['❌ Same (col,row) nodes need ascending sort — use multiset, not vector.', '❌ Column decreases left, increases right; root at col=0.'],
  interviewTip: '💡 Vertical: DFS with (col,row) tracking. Nested map sorts by col, then row, then value.',
})

// ═══════════════════════════════════════════════════════════════
// Specialized — Zigzag
// ═══════════════════════════════════════════════════════════════

export const zigzagLeaf = leaf('zigzag', 'Spiral / Zigzag Pattern', 'pink', {
  template: `${CPP_HEADER}vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> ans;
    queue<TreeNode*> q; q.push(root);
    bool leftToRight = true;
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level(sz);
        for (int i = 0; i < sz; i++) {
            auto* n = q.front(); q.pop();
            int idx = leftToRight ? i : sz - 1 - i;
            level[idx] = n->val;
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        leftToRight = !leftToRight;
        ans.push_back(level);
    }
    return ans;
}`,
  problems: [
    { id: 103, title: 'Zigzag Level Order', slug: 'binary-tree-zigzag-level-order-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'As-is (toggle leftToRight; fill level from front or back).' },
  ],
  pitfalls: ['❌ idx = leftToRight ? i : sz-1-i — fill from correct end.', '❌ Reset leftToRight after each level, not per node.'],
  interviewTip: '💡 Zigzag = level order + toggle fill direction per level. Index = i or sz-1-i.',
})

// ═══════════════════════════════════════════════════════════════
// Specialized — View-Based: Side Views
// ═══════════════════════════════════════════════════════════════

export const sideViewsLeaf = leaf('side-views', 'Side Views', 'pink', {
  template: `${CPP_HEADER}vector<int> rightSideView(TreeNode* root) {
    if (!root) return {};
    vector<int> ans;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        for (int i = 0; i < sz; i++) {
            auto* n = q.front(); q.pop();
            if (i == sz - 1) ans.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return ans;
}`,
  problems: [
    { id: 199, title: 'Right Side View', slug: 'binary-tree-right-side-view', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'As-is (last node of each level → right side view via BFS).' },
  ],
  pitfalls: ['❌ Push last node of level (i == sz-1), not first.', '❌ Left side view = push first node (i == 0) instead of last.'],
  interviewTip: '💡 Side views = BFS per-level. Right = last, Left = first node of each level.',
})

// ═══════════════════════════════════════════════════════════════
// Specialized — View-Based: Top/Bottom Views
// ═══════════════════════════════════════════════════════════════

export const topBottomLeaf = leaf('top-bottom', 'Top / Bottom Views', 'pink', {
  template: `${CPP_HEADER}vector<vector<int>> verticalOrder(TreeNode* root) {
    if (!root) return {};
    map<int, vector<int>> m;
    queue<pair<TreeNode*,int>> q; q.push({root, 0});
    while (!q.empty()) {
        auto [n, col] = q.front(); q.pop();
        m[col].push_back(n->val);
        if (n->left) q.push({n->left, col - 1});
        if (n->right) q.push({n->right, col + 1});
    }
    vector<vector<int>> ans;
    for (auto& [c, v] : m) ans.push_back(v);
    return ans;
}`,
  problems: [
    { id: 314, title: 'Vertical Order BFS', slug: 'binary-tree-vertical-order-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (BFS with column index; map<col, vector>; BFS ensures row order, no row sort needed).' },
  ],
  pitfalls: ['❌ Using DFS for BFS-based vertical order — DFS requires row sorting, BFS naturally gives row order.', '❌ Root at col=0; left decrements, right increments.'],
  interviewTip: '💡 Top view = first node per column (BFS). Bottom view = last node per column (BFS).',
})

// ═══════════════════════════════════════════════════════════════
// Construction — From Multiple Traversals
// ═══════════════════════════════════════════════════════════════

export const constructTreeLeaf = leaf('construct-tree', 'From Multiple Traversals', 'purple', {
  template: `${CPP_HEADER}TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    int n = (int)preorder.size(), idx = 0;
    unordered_map<int,int> m;
    for (int i = 0; i < n; i++) m[inorder[i]] = i;
    function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* {
        if (lo > hi) return nullptr;
        int val = preorder[idx++];
        int mid = m[val];
        return new TreeNode(val, build(lo, mid - 1), build(mid + 1, hi));
    };
    return build(0, n - 1);
}`,
  problems: [
    { id: 105, title: 'Build from Pre+In', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'As-is (preorder[0] = root, split inorder by root, recurse).' },
    { id: 106, title: 'Build from In+Post', slug: 'construct-binary-tree-from-inorder-and-postorder-traversal', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Postorder root = postorder[--idx]; recurse right subtree first.', variationCode: 'int idx = n - 1; function<TreeNode*(int,int)> build = [&](int lo, int hi) -> TreeNode* { if (lo > hi) return nullptr; int val = postorder[idx--]; int mid = m[val]; return new TreeNode(val, build(mid+1, hi), build(lo, mid-1)); };' },
  ],
  pitfalls: ['❌ LC 105: preorder index is global — increment as we consume each root.', '❌ LC 106: postorder goes right-to-left; recurse right subtree first.'],
  interviewTip: '💡 Pre+In: preorder gives root, inorder gives left/right split. Post+In: process right-to-left.',
})

// ═══════════════════════════════════════════════════════════════
// Construction — Serialization
// ═══════════════════════════════════════════════════════════════

export const serializeLeaf = leaf('serialize', 'Serialization / Deserialization', 'purple', {
  template: `${CPP_HEADER}string serialize(TreeNode* root) {
    if (!root) return "#";
    return to_string(root->val) + "," +
           serialize(root->left) + "," +
           serialize(root->right);
}

TreeNode* deserialize(string data) {
    stringstream ss(data); string tok;
    function<TreeNode*()> dfs = [&]() -> TreeNode* {
        if (!getline(ss, tok, ',')) return nullptr;
        if (tok == "#") return nullptr;
        auto* n = new TreeNode(stoi(tok));
        n->left = dfs();
        n->right = dfs();
        return n;
    };
    return dfs();
}`,
  problems: [
    { id: 297, title: 'Serialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'As-is (preorder with "#" null markers; comma-separated string).' },
    { id: 449, title: 'Serialize BST', slug: 'serialize-and-deserialize-bst', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'No "#" markers; use BST val range (lo,hi) to split during deserialize.', variationCode: '// BST: deserialize by val range (lo, hi) instead of "#" markers; more compact encoding' },
  ],
  pitfalls: ['❌ Not handling empty tree — serialized as "#".', '❌ Using null terminators that could collide with valid values (always use sentinel like "#").'],
  interviewTip: '💡 Serialize: preorder with null markers. Deserialize: read preorder, build recursively.',
})
