import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <cstddef>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

`

// ── Core Manipulation ─────────────────────────────────────────────

export const traversalCleanupLeaf = leaf('traversal-cleanup', 'Traversal & Cleanup', 'blue', {
  template: `${CPP_HEADER}ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy, *cur = head;
    while (cur) {
        if (cur->val == val) prev->next = cur->next;
        else prev = cur;
        cur = cur->next;
    }
    return dummy.next;
}`,
  problems: [
    { id: 203, title: 'Remove Linked List Elements', slug: 'remove-linked-list-elements', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 5–11: as-is (dummy node, prev/cur traversal).' },
    { id: 237, title: 'Delete Node in a LL', slug: 'delete-node-in-a-linked-list', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], lineChanges: 'Line: overwrite node val+next with next node&apos;s val+next (no prev).', variationCode: '*node = *(node->next);' },
  ],
  pitfalls: ['❌ Forgetting dummy node — need prev tracking for head deletion.', '❌ LC 237: not given head — only node ptr; copy next into current.'],
  interviewTip: '💡 "Traversal + cleanup" → dummy node simplifies head-edge cases; skip cur on match else advance prev.',
})

export const insertionDeletionLeaf = leaf('insert-del', 'Insertion & Deletion', 'teal', {
  template: `${CPP_HEADER}class MyLinkedList {
    struct Node { int val; Node *next; Node(int v): val(v), next(nullptr){} };
    Node *head; int sz;
public:
    MyLinkedList(): head(nullptr), sz(0) {}
    int get(int i) {
        if (i<0||i>=sz) return -1;
        Node* cur=head; while(i--) cur=cur->next;
        return cur->val;
    }
    void addAtHead(int v) { Node* n=new Node(v); n->next=head; head=n; sz++; }
    void addAtTail(int v) {
        Node* n=new Node(v);
        if(!head){head=n;sz++;return;}
        Node* cur=head; while(cur->next) cur=cur->next;
        cur->next=n; sz++;
    }
    void addAtIndex(int i, int v) {
        if(i>sz) return; if(i<=0){addAtHead(v);return;}
        Node* cur=head; while(--i) cur=cur->next;
        Node* n=new Node(v); n->next=cur->next; cur->next=n; sz++;
    }
    void deleteAtIndex(int i) {
        if(i<0||i>=sz) return; Node tmp(0); tmp.next=head;
        Node* cur=&tmp; while(i--) cur=cur->next;
        Node* del=cur->next; cur->next=del->next; delete del;
        head=tmp.next; sz--;
    }
};`,
  problems: [
    { id: 707, title: 'Design Linked List', slug: 'design-linked-list', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 7–25: as-is (singly linked with head + size tracking).' },
    { id: 1474, title: 'Delete N After M', slug: 'delete-n-nodes-after-m-nodes-of-a-linked-list', companies: ['GOOGLE'], lineChanges: 'Line: skip M nodes, delete N nodes, relink.', variationCode: 'ListNode* cur=head; while(cur){ for i..m-1&&cur: cur=cur->next; if(!cur) break; ListNode* t=cur->next; for i..n&&t: t=t->next; cur->next=t; cur=t; }' },
    { id: 1669, title: 'Merge In Between', slug: 'merge-in-between-linked-lists', companies: ['META'], lineChanges: 'Line: traverse to a-1, save b+1, relink list2, find tail, link b+1.', variationCode: 'ListNode *pa=head; for i..a-1: pa=pa->next; ListNode *pb=pa; for i..b-a+2: pb=pb->next; pa->next=list2; while(pa->next) pa=pa->next; pa->next=pb;' },
  ],
  pitfalls: ['❌ LC 707: off-by-one on get/addAtIndex index handling.', '❌ LC 1474: edge case M larger than remaining nodes.'],
  interviewTip: '💡 "Design linked list" → dummy node + size field. Insert: wire new->next first, then prev->next = new.',
})

export const reorderingLeaf = leaf('reorder', 'Reordering', 'blue', {
  template: `${CPP_HEADER}ListNode* swapPairs(ListNode* head) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    while (prev->next && prev->next->next) {
        ListNode *a = prev->next, *b = a->next;
        a->next = b->next;
        b->next = a;
        prev->next = b;
        prev = a;
    }
    return dummy.next;
}`,
  problems: [
    { id: 24, title: 'Swap Nodes in Pairs', slug: 'swap-nodes-in-pairs', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 5–12: as-is (dummy, rewire pairs via prev).' },
    { id: 61, title: 'Rotate List', slug: 'rotate-list', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], lineChanges: 'Line: get len, k%=len, tail->next=head, traverse to len-k, break.', variationCode: 'if(!head||!head->next||!k) return head; int n=1; ListNode* t=head; while(t->next){t=t->next;n++;} k%=n; t->next=head; for i..n-k: t=t->next; head=t->next; t->next=nullptr;' },
    { id: 143, title: 'Reorder List', slug: 'reorder-list', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: find mid, reverse second half, merge interleaving.', variationCode: 'ListNode *s=head,*f=head; while(f&&f->next){s=s->next;f=f->next->next;} ListNode* rev=reverse(s->next); s->next=nullptr; merge(head,rev);' },
  ],
  pitfalls: ['❌ LC 61: k > len case — k %= n first.', '❌ LC 143: forgetting to break first half link (s->next=nullptr).'],
  interviewTip: '💡 "Reorder/rotate/swap" → dummy + prev tracking for pair swaps; find mid + reverse for reorder.',
})

// ── Reversal Patterns ─────────────────────────────────────────────

export const wholeReverseLeaf = leaf('whole-reverse', 'Whole List Reversal', 'green', {
  template: `${CPP_HEADER}ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr, *cur = head;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
  problems: [
    { id: 206, title: 'Reverse Linked List', slug: 'reverse-linked-list', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (prev/cur/next triple pointer).' },
  ],
  pitfalls: ['❌ Losing reference to next node before rewiring — must save cur->next first.', '❌ Returning cur (null) instead of prev (new head).'],
  interviewTip: '💡 "Reverse whole list" → three pointers (prev, cur, next); prev becomes new head.',
})

export const sublistReverseLeaf = leaf('sublist-reverse', 'Sublist Reversal', 'teal', {
  template: `${CPP_HEADER}ListNode* reverseBetween(ListNode* head, int l, int r) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    for (int i = 1; i < l; i++) prev = prev->next;
    ListNode* cur = prev->next;
    for (int i = l; i < r; i++) {
        ListNode* t = cur->next;
        cur->next = t->next;
        t->next = prev->next;
        prev->next = t;
    }
    return dummy.next;
}`,
  problems: [
    { id: 92, title: 'Reverse LL II', slug: 'reverse-linked-list-ii', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–12: as-is (prev stays fixed, cur advances).' },
    { id: 25, title: 'Reverse K-Group', slug: 'reverse-nodes-in-k-group', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: count k nodes, reverse sublist, recurse or loop.', variationCode: 'ListNode* reverseKGroup(ListNode* h, int k){ ListNode* cur=h; int c=0; while(cur&&c<k){cur=cur->next;c++;} if(c<k) return h; ListNode* rev=reverseKGroup(cur,k); while(c--){ ListNode* n=h->next; h->next=rev; rev=h; h=n; } return rev; }' },
    { id: 2074, title: 'Reverse Even Groups', slug: 'reverse-nodes-in-even-length-groups', companies: ['META'], lineChanges: 'Line: traverse groups of increasing size; if group length even, reverse that segment.', variationCode: 'int group=1; ListNode* cur=head; while(cur){ int cnt=0; ListNode* start=cur; while(cur&&cnt<group){cur=cur->next;cnt++;} if(cnt%2==0) start=reverse(start); group++; }' },
  ],
  pitfalls: ['❌ LC 92: off-by-one on left/right positions (1-indexed).', '❌ LC 25: not handling when remaining nodes < k.'],
  interviewTip: '💡 "Sublist reverse" → prev stays at position left-1; cur moves, t = cur->next, wire t to front.',
})

export const positionSwapLeaf = leaf('position-swap', 'Position Swaps', 'green', {
  template: `${CPP_HEADER}ListNode* swapNodes(ListNode* head, int k) {
    ListNode *a = head, *b = head, *c = head;
    for (int i = 1; i < k; i++) c = c->next;
    a = c;
    while (c->next) { b = b->next; c = c->next; }
    swap(a->val, b->val);
    return head;
}`,
  problems: [
    { id: 1721, title: 'Swapping Nodes', slug: 'swapping-nodes-in-a-linked-list', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (kth from start + kth from end via offset pointer).' },
  ],
  pitfalls: ['❌ Forgetting that kth from end = len-k+1; use offset pointer trick instead of computing length.', '❌ Trying to swap nodes instead of values (more complex).'],
  interviewTip: '💡 "Swap positions" → move first pointer k steps; second pointer starts at head; advance both until first hits end.',
})

// ── Two-Pointer Strategies ────────────────────────────────────────

export const fastSlowLeaf = leaf('fast-slow', 'Fast & Slow Detection', 'purple', {
  template: `${CPP_HEADER}bool hasCycle(ListNode* head) {
    ListNode *s = head, *f = head;
    while (f && f->next) {
        s = s->next;
        f = f->next->next;
        if (s == f) return true;
    }
    return false;
}`,
  problems: [
    { id: 141, title: 'Linked List Cycle', slug: 'linked-list-cycle', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (fast/slow; f moves 2x, s moves 1x).' },
    { id: 142, title: 'Cycle II', slug: 'linked-list-cycle-ii', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: after detect, reset s to head; advance both 1x until meet = cycle start.', variationCode: 'if(!fast||!fast->next) return nullptr; while(fast!=slow){ if(!fast||!fast->next) return nullptr; slow=slow->next; fast=fast->next->next; } slow=head; while(slow!=fast){slow=slow->next;fast=fast->next;} return slow;' },
    { id: 876, title: 'Middle of LL', slug: 'middle-of-the-linked-list', companies: ['AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: while f&&f->next: s=s->next; f=f->next->next; return s.', variationCode: '// same fast/slow pattern but return slow' },
  ],
  pitfalls: ['❌ LC 141: missing f->next null check before f->next->next.', '❌ LC 142: forgetting to reset slow to head after detection.'],
  interviewTip: '💡 "Cycle detection" → fast moves 2 steps, slow moves 1; if they meet after head, cycle. Reset for cycle entry.',
})

export const relativePosLeaf = leaf('relative-pos', 'Relative Positioning', 'purple', {
  template: `${CPP_HEADER}ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0); dummy.next = head;
    ListNode *f = &dummy, *s = &dummy;
    for (int i = 0; i <= n; i++) f = f->next;
    while (f) { f = f->next; s = s->next; }
    ListNode* del = s->next; s->next = del->next; delete del;
    return dummy.next;
}`,
  problems: [
    { id: 19, title: 'Remove Nth From End', slug: 'remove-nth-node-from-end-of-list', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (offset pointer with dummy node).' },
    { id: 2095, title: 'Delete Middle', slug: 'delete-the-middle-node-of-a-linked-list', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: fast/slow to find middle; prev follows slow; delete slow when fast ends.', variationCode: 'ListNode *s=head,*f=head,*p=nullptr; while(f&&f->next){p=s;s=s->next;f=f->next->next;} p->next=s->next; delete s;' },
  ],
  pitfalls: ['❌ LC 19: f advances n+1 steps so s lags by n (to stop before target).', '❌ LC 2095: edge case single node — return nullptr.'],
  interviewTip: '💡 "Nth from end" → offset pointer: advance f by n, then advance both; s lands at node before target.',
})

export const palindromeLeaf = leaf('palindrome', 'Palindrome & Symmetry', 'pink', {
  template: `${CPP_HEADER}bool isPalindrome(ListNode* head) {
    ListNode *s = head, *f = head;
    while (f && f->next) { s = s->next; f = f->next->next; }
    ListNode* rev = nullptr;
    while (s) {
        ListNode* n = s->next;
        s->next = rev;
        rev = s;
        s = n;
    }
    while (rev) {
        if (head->val != rev->val) return false;
        head = head->next; rev = rev->next;
    }
    return true;
}`,
  problems: [
    { id: 234, title: 'Palindrome LL', slug: 'palindrome-linked-list', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–15: as-is (find mid, reverse second half, compare).' },
  ],
  pitfalls: ['❌ Using O(n) extra space (array) instead of O(1) reversal method.', '❌ Not handling odd-length case — slow is at middle for odd, second half starts after.'],
  interviewTip: '💡 "Palindrome" → find middle (slow), reverse second half, compare element-by-element.',
})

// ── Merge & Partition ─────────────────────────────────────────────

export const mergeOpsLeaf = leaf('merge-ops', 'Merge Operations', 'amber', {
  template: `${CPP_HEADER}ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *cur = &dummy;
    while (a && b) {
        if (a->val < b->val) { cur->next = a; a = a->next; }
        else { cur->next = b; b = b->next; }
        cur = cur->next;
    }
    cur->next = a ? a : b;
    return dummy.next;
}`,
  problems: [
    { id: 21, title: 'Merge Two Sorted', slug: 'merge-two-sorted-lists', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (dummy + two-pointer merge).' },
    { id: 23, title: 'Merge K Sorted', slug: 'merge-k-sorted-lists', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: priority queue of (val, ptr) or divide-and-conquer pairwise merge.', variationCode: 'auto cmp=[](ListNode* a,ListNode* b){return a->val>b->val;}; priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> pq(cmp); for(auto l:lists) if(l) pq.push(l); ListNode dummy,*cur=&dummy; while(!pq.empty()){ auto* n=pq.top(); pq.pop(); cur->next=n; cur=n; if(n->next) pq.push(n->next); }' },
    { id: 1669, title: 'Merge In Between', slug: 'merge-in-between-linked-lists', companies: ['META'], lineChanges: 'Same as insertionDeletionLeaf; use merge approach.', variationCode: '// see Insertion & Deletion leaf' },
  ],
  pitfalls: ['❌ LC 23: O(nk) comparison instead of O(n log k) heap.', '❌ LC 21: forgetting dummy node results in complex edge cases for head.'],
  interviewTip: '💡 "Merge sorted lists" → dummy node + compare heads. K lists: min-heap of list pointers.',
})

export const partitionSplitLeaf = leaf('partition-split', 'Partition & Split', 'amber', {
  template: `${CPP_HEADER}ListNode* partition(ListNode* head, int x) {
    ListNode lD(0), rD(0), *l = &lD, *r = &rD;
    while (head) {
        if (head->val < x) { l->next = head; l = head; }
        else { r->next = head; r = head; }
        head = head->next;
    }
    r->next = nullptr;
    l->next = rD.next;
    return lD.next;
}`,
  problems: [
    { id: 86, title: 'Partition List', slug: 'partition-list', companies: ['AMAZON', 'META', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (two separate chains, merge at end).' },
    { id: 725, title: 'Split LL in Parts', slug: 'split-linked-list-in-parts', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: n=len, partSize=n/k, extra=n%k; for each part, cut after partSize+(extra-->0?).', variationCode: 'int n=0; for(auto* cur=head;cur;cur=cur->next) n++; int sz=n/k,rem=n%k; vector<ListNode*> ans(k); auto* cur=head; for i 0..k-1{ ans[i]=cur; int len=sz+(rem-->0?1:0); for j 0..len-2: if(cur) cur=cur->next; if(cur){ auto* t=cur->next; cur->next=nullptr; cur=t; } }' },
  ],
  pitfalls: ['❌ LC 86: forgetting r->next = nullptr to avoid cycles.', '❌ LC 725: off-by-one when computing part length (use len-2 for move then cut).'],
  interviewTip: '💡 "Partition" → two dummy chains (less-than, greater-or-equal); cut the greater tail. "Split" → compute size per part, cut and advance.',
})

// ── Sorting & Ordering ────────────────────────────────────────────

export const sortingLeaf = leaf('sort', 'Sorting & Ordering', 'orange', {
  template: `${CPP_HEADER}ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode *s = head, *f = head->next;
    while (f && f->next) { s = s->next; f = f->next->next; }
    ListNode* r = sortList(s->next);
    s->next = nullptr;
    return mergeTwoLists(sortList(head), r);
}`,
  problems: [
    { id: 148, title: 'Sort List', slug: 'sort-list', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (merge sort: find mid, sort halves, merge).' },
    { id: 147, title: 'Insertion Sort List', slug: 'insertion-sort-list', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: dummy node; for each cur, find insert position from dummy each time.', variationCode: 'ListNode dummy(0); while(head){ ListNode* prev=&dummy; while(prev->next&&prev->next->val<head->val) prev=prev->next; ListNode* n=head->next; head->next=prev->next; prev->next=head; head=n; } return dummy.next;' },
    { id: 328, title: 'Odd Even LL', slug: 'odd-even-linked-list', companies: ['AMAZON', 'META', 'GOOGLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: two pointers (odd, even); connect evens after odds.', variationCode: 'if(!head) return head; ListNode *o=head, *e=head->next, *eH=e; while(e&&e->next){ o->next=e->next; o=o->next; e->next=o->next; e=e->next; } o->next=eH; return head;' },
  ],
  pitfalls: ['❌ LC 148: f starts at head->next (not head) for correct mid with even length.', '❌ LC 147: O(n²) — acceptable for insertion sort on LL but know tradeoff.'],
  interviewTip: '💡 "Sort list" → merge sort: find mid (fast starts head->next), sort halves, merge.',
})

// ── Copying & Cloning ─────────────────────────────────────────────

export const cloneLeaf = leaf('clone', 'Copying & Cloning', 'lime', {
  template: `${CPP_HEADER}class Node { public: int val; Node* next; Node* random; Node(int v): val(v), next(nullptr), random(nullptr) {} };

Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    // Pass 1: interleave copies
    Node* cur = head;
    while (cur) {
        Node* n = new Node(cur->val);
        n->next = cur->next;
        cur->next = n;
        cur = n->next;
    }
    // Pass 2: wire random pointers
    cur = head;
    while (cur) {
        if (cur->random) cur->next->random = cur->random->next;
        cur = cur->next->next;
    }
    // Pass 3: restore originals and extract copies
    Node dummy(0), *copy = &dummy;
    cur = head;
    while (cur) {
        copy->next = cur->next;
        copy = copy->next;
        cur->next = copy->next;
        cur = cur->next;
    }
    return dummy.next;
}`,
  problems: [
    { id: 138, title: 'Copy List w/ Random', slug: 'copy-list-with-random-pointer', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 9–32: as-is (interleave → wire random → restore + extract).' },
  ],
  pitfalls: ['❌ Third pass: must restore original list next pointers for valid output.', '❌ Using map (O(n) space) when interleave method is O(1) extra space.'],
  interviewTip: '💡 "Clone with random" → interleave copies (A→A\'→B→B\'), wire random via .next, then restore and extract.',
})

// ── Structural Variants ───────────────────────────────────────────

export const doublyLeaf = leaf('doubly', 'Doubly Linked Lists', 'blue', {
  template: `class Node { public: int val; Node* prev; Node* next; Node* child; Node(int v): val(v), prev(nullptr), next(nullptr), child(nullptr) {} };

Node* flatten(Node* head) {
    Node* cur = head;
    while (cur) {
        if (cur->child) {
            Node* nxt = cur->next;
            Node* child = flatten(cur->child);
            cur->next = child;
            child->prev = cur;
            cur->child = nullptr;
            while (cur->next) cur = cur->next;
            if (nxt) { cur->next = nxt; nxt->prev = cur; }
        }
        cur = cur->next;
    }
    return head;
}`,
  problems: [
    { id: 430, title: 'Flatten Multilevel DLL', slug: 'flatten-a-multilevel-doubly-linked-list', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 6–16: as-is (DFS flatten: recurse child, splice, skip to tail).' },
    { id: 1472, title: 'Browser History', slug: 'design-browser-history', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: doubly-linked list or vector + pos; back/forward navigation.', variationCode: 'struct Page{string url; Page *prev,*next;}; Page *cur; void visit(string u){ cur->next=new Page(u,cur,nullptr); cur=cur->next; } string back(int s){ while(s--&&cur->prev) cur=cur->prev; return cur->url; }' },
  ],
  pitfalls: ['❌ LC 430: forgetting to nullify child pointer after flattening (or infinite loop).', '❌ LC 1472: forgetting to clear forward history on new visit.'],
  interviewTip: '💡 "Flatten multilevel DLL" → DFS recursion: splice child in, traverse to tail, link back to next.',
})

export const circularLeaf = leaf('circular', 'Circular Linked Lists', 'teal', {
  template: `Node* insert(Node* head, int v) {
    if (!head) { Node* n = new Node(v); n->next = n; return n; }
    Node* cur = head;
    while (cur->next != head && cur->next->val < v) cur = cur->next;
    Node* n = new Node(v);
    n->next = cur->next;
    cur->next = n;
    return head;
}`,
  problems: [
    { id: 708, title: 'Insert into Sorted Circular', slug: 'insert-into-a-sorted-circular-linked-list', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3–9: as-is (find insert point, handle wrap-around).' },
    { id: 1823, title: 'Circular Game', slug: 'find-the-winner-of-the-circular-game', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: queue simulation or Josephus formula O(n).', variationCode: 'queue<int> q; for i 1..n q.push(i); while(q.size()>1){ for i 0..k-2{ q.push(q.front()); q.pop(); } q.pop(); } return q.front();' },
  ],
  pitfalls: ['❌ LC 708: handling empty list, single node, and duplicate values where prev > next wrap.', '❌ Not handling the case where v fits between tail and head (max value).'],
  interviewTip: '💡 "Circular list" → find insertion point where prev->val <= v <= cur->val; handle empty/single/global max.',
})

// ── List-Backed Data Structures ───────────────────────────────────

export const minStackLeaf = leaf('min-stack', 'Stack & Queue Implementations', 'pink', {
  template: `class MinStack {
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
    { id: 155, title: 'Min Stack', slug: 'min-stack', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (pair of value + current min).' },
    { id: 622, title: 'Design Circular Queue', slug: 'design-circular-queue', companies: ['AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: fixed array + head/tail modulo for O(1) operations.', variationCode: '// see circular queue leaf in stackQueue' },
  ],
  pitfalls: ['❌ MinStack: storing global min fails on pop; store per-element min pair.', '❌ Circular queue: modulo wrap on both enQueue and deQueue.'],
  interviewTip: '💡 "List-backed stack/queue" → linked list or array as underlying storage; wrap with stack/queue interface.',
})

export const cacheLeaf = leaf('cache', 'Cache Strategies', 'purple', {
  template: `class LRUCache {
    struct Node { int k,v; Node *prev,*next; Node(int key,int val):k(key),v(val){}};
    int cap;
    unordered_map<int,Node*> m;
    Node *head,*tail;
    void moveToHead(Node* n) {
        n->prev->next=n->next; n->next->prev=n->prev;
        n->next=head->next; n->next->prev=n; head->next=n; n->prev=head;
    }
public:
    LRUCache(int c): cap(c) {
        head=new Node(0,0); tail=new Node(0,0);
        head->next=tail; tail->prev=head;
    }
    int get(int k) {
        if(!m.count(k)) return -1;
        moveToHead(m[k]); return m[k]->v;
    }
    void put(int k, int v) {
        if(m.count(k)){ m[k]->v=v; moveToHead(m[k]); return; }
        Node* n=new Node(k,v);
        m[k]=n; n->next=head->next; n->next->prev=n; head->next=n; n->prev=head;
        if(m.size()>cap){ Node* d=tail->prev; tail->prev=d->prev; d->prev->next=tail; m.erase(d->k); delete d; }
    }
};`,
  problems: [
    { id: 146, title: 'LRU Cache', slug: 'lru-cache', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 6–27: as-is (DLL + hash map; move-to-front on access).' },
    { id: 460, title: 'LFU Cache', slug: 'lfu-cache', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: add frequency map + per-freq DLL; evict from lowest freq.', variationCode: '// unordered_map<int,int> keyFreq; unordered_map<int,list<int>> freqKeys; int minFreq;' },
  ],
  pitfalls: ['❌ LC 146: forgetting to update tail sentinel when evicting last node.', '❌ LC 146: manual DLL pointer surgery — order matters (wire new node, then head->next = n).'],
  interviewTip: '💡 "LRU Cache" → doubly-linked list (order) + hash map (O(1) lookup); move accessed node to head.',
})
