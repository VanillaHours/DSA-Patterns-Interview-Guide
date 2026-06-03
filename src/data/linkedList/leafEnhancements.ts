import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'traversal-cleanup': e({
    xray: [
      { text: 'Remove all nodes with a given **value** from linked list', kind: 'goal' },
      { text: '**Delete** a node given only that node reference', kind: 'goal' },
    ],
    budget: ['traversal', 'deletion', 'dummy'],
    slottedTemplate: `ListNode dummy(0); dummy.next = head;
ListNode* prev = &dummy, *cur = head;
while (cur) {
    if (cur->val == val) prev->next = cur->next;
    else prev = cur;
    cur = cur->next;
}
return dummy.next;`,
    slots: [],
    slotFills: { 203: {}, 237: {} },
    helixDelta: { 203: 'Prev/cur + dummy for head-safe deletion', 237: 'Copy next node into current (no prev needed)' },
    autopsies: [
      {
        cause: 'No dummy node before head',
        wrong: 'prev = nullptr, special-case head',
        testCase: 'remove head node',
        fix: 'ListNode dummy(0); dummy.next = head;',
      },
    ],
    sayIt: ['Traversal cleanup: dummy node + prev/cur pointers.', 'LC 237: copy next node value + pointer into current.'],
  }),

  'insert-del': e({
    xray: [
      { text: '**Design** a linked list with get, addAtHead/Tail/Index, deleteAtIndex', kind: 'goal' },
      { text: '**Delete N nodes** after M nodes', kind: 'goal' },
      { text: '**Merge** list2 in between nodes a and b of list1', kind: 'goal' },
    ],
    budget: ['insertion', 'deletion', 'traversal'],
    slottedTemplate: `// Dummy + size tracking
int sz = 0;
ListNode *head = nullptr;
void addAtIndex(int i, int v) {
    if (i > sz) return;
    ListNode dummy(0); dummy.next = head;
    ListNode* cur = &dummy;
    while (i--) cur = cur->next;
    ListNode* n = new ListNode(v);
    n->next = cur->next;
    cur->next = n;
    sz++;
    head = dummy.next;
}`,
    slots: [],
    slotFills: { 707: {}, 1474: {}, 1669: {} },
    helixDelta: { 707: 'Full LL design with index + size', 1474: 'Skip M, delete N, relink', 1669: 'Find a-1, save b+1, splice list2' },
    autopsies: [
      {
        cause: 'Forgetting to update head when inserting at index 0',
        wrong: 'insert at front but head not updated',
        testCase: 'addAtIndex(0, val)',
        fix: 'head = dummy.next after any mutation',
      },
    ],
    sayIt: ['Insert: wire new→next first, then prev→next = new.', 'Design: dummy node + size field simplifies all edges.'],
  }),

  reorder: e({
    xray: [
      { text: '**Swap** every two adjacent nodes', kind: 'goal' },
      { text: '**Rotate** list to the right by k places', kind: 'goal' },
      { text: '**Reorder** list as L0→Ln→L1→Ln-1→...', kind: 'goal' },
    ],
    budget: ['reorder', 'inPlace', 'dummy'],
    slottedTemplate: `ListNode dummy(0); dummy.next = head;
ListNode* prev = &dummy;
while (prev->next && prev->next->next) {
    ListNode *a = prev->next, *b = a->next;
    a->next = b->next;
    b->next = a;
    prev->next = b;
    prev = a;
}
return dummy.next;`,
    slots: [],
    slotFills: { 24: {}, 61: {}, 143: {} },
    helixDelta: { 24: 'Pair swap — prev stays, a/b rewire', 61: 'Close cycle, traverse to len-k, break', 143: 'Mid + reverse + interleave merge' },
    autopsies: [
      {
        cause: 'LC 61: not handling k > len',
        wrong: 'rotate by k without k %= len',
        testCase: 'len=3, k=5',
        fix: 'k %= len before rotating',
      },
    ],
    sayIt: ['Swap pairs: dummy + prev, a/b rewire.', 'Rotate: make circular, break at len-k.', 'Reorder: mid + reverse second half + interleave.'],
  }),

  'whole-reverse': e({
    xray: [
      { text: '**Reverse** a singly linked list', kind: 'goal' },
    ],
    budget: ['reversal', 'inPlace'],
    slottedTemplate: `ListNode* prev = nullptr, *cur = head;
while (cur) {
    ListNode* next = cur->next;
    cur->next = prev;
    prev = cur;
    cur = next;
}
return prev;`,
    slots: [],
    slotFills: { 206: {} },
    helixDelta: { 206: 'Triple pointer (prev/cur/next) — canonical LL reversal' },
    autopsies: [
      {
        cause: 'Losing next pointer before rewiring',
        wrong: 'cur->next = prev; cur = cur->next; // lost original next',
        testCase: 'any list',
        fix: 'Save next first: ListNode* next = cur->next;',
      },
    ],
    sayIt: ['Reverse: save next, rewire cur→next = prev, advance.'],
  }),

  'sublist-reverse': e({
    xray: [
      { text: '**Reverse** nodes from position **left** to **right**', kind: 'goal' },
      { text: '**Reverse** nodes in **k-group**', kind: 'goal' },
      { text: '**Reverse** even length groups', kind: 'goal' },
    ],
    budget: ['reversal', 'inPlace', 'dummy'],
    slottedTemplate: `ListNode dummy(0); dummy.next = head;
ListNode* prev = &dummy;
for (int i = 1; i < left; i++) prev = prev->next;
ListNode* cur = prev->next;
for (int i = left; i < right; i++) {
    ListNode* t = cur->next;
    cur->next = t->next;
    t->next = prev->next;
    prev->next = t;
}
return dummy.next;`,
    slots: [
      { id: 'left', label: 'Left start position' },
      { id: 'right', label: 'Right end position' },
    ],
    slotFills: {
      92: { left: 'l', right: 'r' },
    },
    helixDelta: { 92: 'Fixed-range reversal (prev stationary)', 25: 'K-group: count + recursive reverse', 2074: 'Even-length groups: traverse + conditional reverse' },
    autopsies: [
      {
        cause: 'Off-by-one on left/right positions (1-indexed)',
        wrong: 'loop i=0; i<left; or i<=left',
        testCase: 'left=1, right=2',
        fix: 'prev moves left-1 steps; cur = prev->next; inner loop right-left times',
      },
    ],
    sayIt: ['Sublist reverse: prev stays before range; cur moves; each step, t = cur->next, wire t after prev.'],
  }),

  'position-swap': e({
    xray: [
      { text: '**Swap** the kth node from start with kth from end', kind: 'goal' },
    ],
    budget: ['reversal', 'inPlace'],
    slottedTemplate: `ListNode *a = head, *b = head, *c = head;
for (int i = 1; i < k; i++) c = c->next;
a = c;
while (c->next) { b = b->next; c = c->next; }
swap(a->val, b->val);
return head;`,
    slots: [],
    slotFills: { 1721: {} },
    helixDelta: { 1721: 'Offset pointer trick — no length computation needed' },
    autopsies: [
      {
        cause: 'Computing length instead of offset pointer',
        wrong: 'int len=0; for... len++; kthFromEnd = len - k + 1;',
        testCase: 'large list',
        fix: 'Move c k steps; then a=start, b=head; advance all three until c hits end.',
      },
    ],
    sayIt: ['Swap position: advance one pointer k, then offset second from head, advance both.'],
  }),

  'fast-slow': e({
    xray: [
      { text: 'Detect a **cycle** in the linked list', kind: 'goal' },
      { text: 'Return the node where **cycle begins**', kind: 'goal' },
      { text: 'Find the **middle** of the linked list', kind: 'goal' },
    ],
    budget: ['fastSlow', 'cycleDetect'],
    slottedTemplate: `ListNode *s = head, *f = head;
while (f && f->next) {
    s = s->next;
    f = f->next->next;
    if (s == f) return true;
}
return false;`,
    slots: [],
    slotFills: { 141: {}, 142: {}, 876: {} },
    helixDelta: { 141: 'Cycle detection — basic fast/slow', 142: 'Reset slow to head then both 1x for entry node', 876: 'Middle — return slow when fast ends' },
    autopsies: [
      {
        cause: 'LC 141: not checking f->next before f->next->next',
        wrong: 'while (f) { f = f->next->next } // NPE if f->next null',
        testCase: 'list of length 1',
        fix: 'while (f && f->next)',
      },
    ],
    sayIt: ['Fast/slow: f=2x, s=1x. Meet → cycle. Reset → entry.', 'Middle: return slow when fast reaches end.'],
  }),

  'relative-pos': e({
    xray: [
      { text: 'Remove the **nth node from the end** of the list', kind: 'goal' },
      { text: '**Delete the middle** node of the linked list', kind: 'goal' },
    ],
    budget: ['relativePos', 'dummy'],
    slottedTemplate: `ListNode dummy(0); dummy.next = head;
ListNode *f = &dummy, *s = &dummy;
for (int i = 0; i <= n; i++) f = f->next;
while (f) { f = f->next; s = s->next; }
ListNode* del = s->next;
s->next = del->next;
delete del;
return dummy.next;`,
    slots: [
      { id: 'n', label: 'Offset from end' },
    ],
    slotFills: {
      19: { n: 'n' },
    },
    helixDelta: { 19: 'Offset pointer: f advances n+1, s lags', 2095: 'Fast/slow + prev to find middle for deletion' },
    autopsies: [
      {
        cause: 'LC 19: advancing f by n instead of n+1 steps',
        wrong: 'for i<n: f = f->next // s ends at target, not before it',
        testCase: 'n=1, [1,2]',
        fix: 'for i<=n: f = f->next (so s stops before the node to remove)',
      },
    ],
    sayIt: ['Nth from end: advance f n+1, then both 1x until f hits end.', 'Delete middle: fast/slow + prev.'],
  }),

  palindrome: e({
    xray: [
      { text: 'Check if a singly linked list is a **palindrome**', kind: 'goal' },
    ],
    budget: ['palindrome', 'inPlace'],
    slottedTemplate: `ListNode *s = head, *f = head;
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
return true;`,
    slots: [],
    slotFills: { 234: {} },
    helixDelta: { 234: 'Mid + reverse second half + compare' },
    autopsies: [
      {
        cause: 'Using O(n) array instead of O(1) reverse',
        wrong: 'vector<int> vals; for cur: vals.push_back(cur->val); two-pointer',
        testCase: 'O(1) space constraint',
        fix: 'Find mid, reverse second half, compare in-place',
      },
    ],
    sayIt: ['Palindrome: mid (fast/slow), reverse second half, compare halves.'],
  }),

  'merge-ops': e({
    xray: [
      { text: '**Merge** two sorted linked lists into one sorted list', kind: 'goal' },
      { text: '**Merge k** sorted linked lists', kind: 'goal' },
    ],
    budget: ['merge', 'dummy'],
    slottedTemplate: `ListNode dummy(0), *cur = &dummy;
while (a && b) {
    if (a->val < b->val) { cur->next = a; a = a->next; }
    else { cur->next = b; b = b->next; }
    cur = cur->next;
}
cur->next = a ? a : b;
return dummy.next;`,
    slots: [],
    slotFills: { 21: {}, 23: {}, 1669: {} },
    helixDelta: { 21: 'Two sorted — dummy + compare', 23: 'K sorted — min-heap of ListNode*', 1669: 'Splice list2 between two positions' },
    autopsies: [
      {
        cause: 'LC 23: O(nk) comparison instead of heap',
        wrong: 'for each step: scan all k heads for min',
        testCase: 'k large',
        fix: 'Min-heap of (value, node*) — O(n log k)',
      },
    ],
    sayIt: ['Merge two: dummy + compare heads + attach remaining.', 'Merge k: min-heap of k list heads.'],
  }),

  'partition-split': e({
    xray: [
      { text: '**Partition** list so all nodes < x come before nodes ≥ x', kind: 'goal' },
      { text: '**Split** linked list into k consecutive parts', kind: 'goal' },
    ],
    budget: ['partition', 'dummy'],
    slottedTemplate: `ListNode lD(0), rD(0), *l = &lD, *r = &rD;
while (head) {
    if (head->val < x) { l->next = head; l = head; }
    else { r->next = head; r = head; }
    head = head->next;
}
r->next = nullptr;
l->next = rD.next;
return lD.next;`,
    slots: [],
    slotFills: { 86: {}, 725: {} },
    helixDelta: { 86: 'Two dummy chains (less/ge) + merge at end', 725: 'Part-size compute + cut and advance' },
    autopsies: [
      {
        cause: 'LC 86: cycle in result from not null-terminating right chain',
        wrong: 'forget r->next = nullptr',
        testCase: 'last node of right chain points back',
        fix: 'r->next = nullptr before merging chains',
      },
    ],
    sayIt: ['Partition: two dummy chains (less, ge). Null-terminate right chain.', 'Split: compute size per part, cut with nullptr, advance.'],
  }),

  sort: e({
    xray: [
      { text: '**Sort** an unsorted linked list in O(n log n) time', kind: 'goal' },
      { text: '**Insertion sort** a linked list', kind: 'goal' },
      { text: '**Odd even** linked list — group odd-indexed then even', kind: 'goal' },
    ],
    budget: ['sort', 'inPlace'],
    slottedTemplate: `// Merge sort
if (!head || !head->next) return head;
ListNode *s = head, *f = head->next;
while (f && f->next) { s = s->next; f = f->next->next; }
ListNode* r = sortList(s->next);
s->next = nullptr;
return mergeTwoLists(sortList(head), r);`,
    slots: [],
    slotFills: { 148: {}, 147: {}, 328: {} },
    helixDelta: { 148: 'Merge sort: mid + sort halves + merge', 147: 'Insertion sort: dummy + linear scan insert', 328: 'Odd-even: two chains, connect evens after odds' },
    autopsies: [
      {
        cause: 'LC 148: f starts at head instead of head->next',
        wrong: 'ListNode *s=head,*f=head; // even length: wrong mid',
        testCase: 'even length list',
        fix: 'f = head->next for correct mid in even-length lists',
      },
    ],
    sayIt: ['Sort: merge sort — find mid (f=head->next), sort halves, merge.', 'Odd-even: two separate chains, link evens after odds.'],
  }),

  clone: e({
    xray: [
      { text: '**Deep copy** a linked list where each node has a **random** pointer', kind: 'goal' },
    ],
    budget: ['clone', 'inPlace'],
    slottedTemplate: `// Pass 1: interleave copies
ListNode* cur = head;
while (cur) {
    ListNode* n = new ListNode(cur->val);
    n->next = cur->next;
    cur->next = n;
    cur = n->next;
}
// Pass 2: wire random
cur = head;
while (cur) {
    if (cur->random) cur->next->random = cur->random->next;
    cur = cur->next->next;
}
// Pass 3: restore + extract`,
    slots: [],
    slotFills: { 138: {} },
    helixDelta: { 138: 'Three-pass interleave for O(1) space clone' },
    autopsies: [
      {
        cause: 'Using hash map (O(n) space) instead of interleave',
        wrong: 'unordered_map<Node*,Node*> old2new',
        testCase: 'O(1) space constraint',
        fix: 'Interleave copies in original list, wire random via .next, restore and extract',
      },
    ],
    sayIt: ['Clone with random: interleave (A→A\'→B→B\'), wire random via .next, restore + extract.'],
  }),

  doubly: e({
    xray: [
      { text: '**Flatten** a multilevel doubly linked list', kind: 'goal' },
      { text: '**Design browser history** — back/forward navigation', kind: 'goal' },
    ],
    budget: ['doubly'],
    slottedTemplate: `Node* flatten(Node* head) {
    Node* cur = head;
    while (cur) {
        if (cur->child) {
            Node* nxt = cur->next;
            Node* child = flatten(cur->child);
            cur->next = child; child->prev = cur;
            cur->child = nullptr;
            while (cur->next) cur = cur->next;
            if (nxt) { cur->next = nxt; nxt->prev = cur; }
        }
        cur = cur->next;
    }
    return head;
}`,
    slots: [],
    slotFills: { 430: {}, 1472: {} },
    helixDelta: { 430: 'DFS flatten: splice child, traverse to tail, relink', 1472: 'DLL or vector-based browser history navigation' },
    autopsies: [
      {
        cause: 'LC 430: not nullifying child after flatten (infinite loop)',
        wrong: 'cur->child retains reference',
        testCase: 'child exists, flatten, visit again',
        fix: 'cur->child = nullptr after splicing',
      },
    ],
    sayIt: ['Flatten DLL: DFS child, splice, traverse to tail, relink to next.', 'Browser history: DLL or vector + position.'],
  }),

  circular: e({
    xray: [
      { text: '**Insert** into a sorted **circular** linked list', kind: 'goal' },
      { text: '**Find winner** of circular elimination game', kind: 'goal' },
    ],
    budget: ['circular'],
    slottedTemplate: `if (!head) { Node* n = new Node(v); n->next = n; return n; }
Node* cur = head;
while (cur->next != head && cur->next->val < v) cur = cur->next;
Node* n = new Node(v);
n->next = cur->next;
cur->next = n;
return head;`,
    slots: [],
    slotFills: { 708: {}, 1823: {} },
    helixDelta: { 708: 'Find insert point by value in circular list', 1823: 'Queue simulation or Josephus O(n) formula' },
    autopsies: [
      {
        cause: 'LC 708: not handling the case where v is between max and min (wrap)',
        wrong: 'while cur->next != head && cur->next->val < v',
        testCase: 'v > all values (should insert after max before min)',
        fix: 'Traverse until cur->next == head or cur->next->val >= v, then insert; find max node first if needed',
      },
    ],
    sayIt: ['Circular insert: traverse until wrap or find position by value.', 'Circular game: queue simulation (or Josephus formula).'],
  }),

  'min-stack': e({
    xray: [
      { text: 'Design a **min stack** with O(1) getMin', kind: 'goal' },
      { text: 'Design a **circular queue**', kind: 'goal' },
    ],
    budget: ['cache'],
    slottedTemplate: `stack<pair<int,int>> st;
void push(int v) {
    int m = st.empty() ? v : min(v, st.top().second);
    st.push({v, m});
}
int getMin() { return st.top().second; }`,
    slots: [],
    slotFills: { 155: {}, 622: {} },
    helixDelta: { 155: 'Pair (value, current min) per element', 622: 'Circular buffer with head/tail modulo' },
    autopsies: [
      {
        cause: 'MinStack with global min breaks on pop',
        wrong: 'int minV = INT_MAX; // not per-state',
        testCase: 'push 2, push 1, pop, getMin',
        fix: 'Store (val, currentMin) pair per stack element',
      },
    ],
    sayIt: ['Min stack: pair (value, current min) per element.', 'Circular queue: array + head/tail modulo + size.'],
  }),

  cache: e({
    xray: [
      { text: 'Design **LRU cache** with O(1) get and put', kind: 'goal' },
      { text: 'Design **LFU cache** with frequency eviction', kind: 'goal' },
    ],
    budget: ['cache'],
    slottedTemplate: `// DLL + hash map
struct Node { int k,v; Node *prev,*next; };
unordered_map<int,Node*> m;
int cap;
void moveToHead(Node* n) {
    n->prev->next = n->next;
    n->next->prev = n->prev;
    n->next = head->next;
    n->next->prev = n;
    head->next = n;
    n->prev = head;
}`,
    slots: [],
    slotFills: { 146: {}, 460: {} },
    helixDelta: { 146: 'LRU: DLL + map; move-to-head on access', 460: 'LFU: + freq map + per-freq DLL + minFreq' },
    autopsies: [
      {
        cause: 'LRU: pointer surgery order — must wire new node before updating head->next',
        wrong: 'head->next = n; n->next = head->next; // n->next points to itself',
        testCase: 'insert first node',
        fix: 'n->next = head->next; head->next->prev = n; head->next = n; n->prev = head;',
      },
    ],
    sayIt: ['LRU: DLL + hash map; move-to-front on get/put.', 'LFU: + frequency map + per-frequency DLL + track minFreq.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
