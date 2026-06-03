import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'target-sum': e({
    xray: [
      { text: 'Given a **1-indexed** array of integers **already sorted**', kind: 'constraint' },
      { text: 'find two numbers such that they add up to a specific **target**', kind: 'goal' },
      { text: 'Return the indices in **increasing order**', kind: 'output' },
    ],
    budget: ['sorted', 'opposite', 'targetSum'],
    slottedTemplate: `int l = 0, r = n - 1;
while (l < r) {
    long cur = {{METRIC}};
    if ({{ON_MATCH}}) { {{RECORD}}; }
    else if (cur < target) l++;
    else r--;
}`,
    slots: [
      { id: 'METRIC', label: 'Pair metric', hint: 'Usually nums[l]+nums[r]' },
      { id: 'ON_MATCH', label: 'Match condition', hint: 'cur == target' },
      { id: 'RECORD', label: 'On match', hint: 'return / push / count' },
    ],
    slotFills: {
      167: { METRIC: 'nums[l] + nums[r]', ON_MATCH: 'cur == target', RECORD: 'return {l+1,r+1}' },
      1099: { METRIC: 'nums[l] + nums[r]', ON_MATCH: 'cur < k', RECORD: 'ans=max(ans,cur); l++' },
      15: { METRIC: 'nums[l]+nums[r] (inner)', ON_MATCH: 's==0', RECORD: 'push; skip dup l,r' },
      18: { METRIC: 'same as 3Sum', ON_MATCH: 's==target', RECORD: 'push; + outer j loop' },
    },
    helixOrder: [167, 1099, 15, 18],
    helixDelta: {
      167: 'Baseline template',
      1099: 'Line 6: if sum<k update; always l++',
      15: '+ outer i; skip duplicate i',
      18: '+ outer j between i and inner',
    },
    autopsies: [
      {
        cause: 'Hash map on sorted input',
        wrong: 'unordered_map<int,int> seen; // O(n) but ignores order',
        testCase: '[1,2,3,4,5] target=9',
        fix: 'Use opposite pointers — sorted order gives O(n) elimination',
      },
      {
        cause: 'Duplicate triplets in 3Sum output',
        wrong: 'for (i...) { l=i+1; r=n-1; ... } // no skip dup i',
        testCase: '[-1,0,1,2,-1,-4]',
        fix: 'if (i && nums[i]==nums[i-1]) continue;',
      },
    ],
    sayIt: [
      'Sorted array → opposite pointers at both ends.',
      'Sum too small → move left. Too big → move right.',
      'Use long for sum. k-sum: fix outer index, skip duplicates.',
    ],
  }),

  palindrome: e({
    xray: [
      { text: 'A phrase is a **palindrome** if reads the same forward and backward', kind: 'signal' },
      { text: 'considering only **alphanumeric** and ignoring cases', kind: 'constraint' },
      { text: '**at most one** character can be removed (680)', kind: 'constraint' },
    ],
    budget: ['string', 'opposite'],
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
      125: { SKIP_JUNK: 'skip !isalnum at l,r', COMPARE: 'tolower(s[l])!=tolower(s[r])' },
      680: { SKIP_JUNK: 'same as 125', COMPARE: 'mismatch → try skip l or r once' },
    },
    helixDelta: { 125: 'Baseline', 680: 'One allowed skip on mismatch' },
    autopsies: [
      {
        cause: 'Case-sensitive compare',
        wrong: 'if (s[l] != s[r]) return false;',
        testCase: '"Aa" with alnum filter',
        fix: 'tolower(s[l]) != tolower(s[r])',
      },
    ],
    sayIt: [
      'Palindrome → opposite ends inward.',
      'Skip spaces/punctuation; compare lowercase.',
      '680: one mismatch allowed — try skipping left or right.',
    ],
  }),

  numeric: e({
    xray: [
      { text: 'Determine if a number c can be written as **a² + b²**', kind: 'goal' },
      { text: 'Return the number of **valid triangles**', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'enumerate'],
    slottedTemplate: `// sort if needed
int l = 0, r = {{R_BOUND}};
while (l {{OP}} r) {
    long cur = {{METRIC}};
    if ({{MATCH}}) {{ACTION}};
    else if (cur < target) l++; else r--;
}`,
    slots: [
      { id: 'METRIC', label: 'Metric' },
      { id: 'MATCH', label: 'Match' },
      { id: 'ACTION', label: 'Action' },
    ],
    slotFills: {
      633: { METRIC: 'l*l + r*r', MATCH: 'cur == c', ACTION: 'return true' },
      611: { METRIC: 'nums[l]+nums[r] vs nums[k]', MATCH: 'sum > nums[k]', ACTION: 'count += r-l; r--' },
    },
    helixDelta: { 633: 'Square sum compare', 611: 'Fix k from right; count pairs' },
    autopsies: [
      {
        cause: 'int overflow on squares',
        wrong: 'int sq = l*l + r*r;',
        testCase: 'c near INT_MAX',
        fix: 'Use long for sq and pointers',
      },
    ],
    sayIt: ['Numeric rules on sorted array → opposite pointers.', '633: compare squares. 611: fix largest side, count pairs.'],
  }),

  volume: e({
    xray: [
      { text: 'Find two lines that together with the x-axis form a container with **maximum water**', kind: 'goal' },
      { text: 'Compute how much **water can be trapped** after raining', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'maximize'],
    slottedTemplate: `while (l < r) {
    best = max(best, {{AREA}});
    if ({{MOVE_RULE}}) l++; else r--;
}`,
    slots: [
      { id: 'AREA', label: 'Area formula' },
      { id: 'MOVE_RULE', label: 'Who moves' },
    ],
    slotFills: {
      11: { AREA: 'min(h[l],h[r])*(r-l)', MOVE_RULE: 'h[l] < h[r]' },
      42: { AREA: 'min(maxL,maxR)-h[i] per side', MOVE_RULE: 'maxL < maxR → l++' },
    },
    helixDelta: { 11: 'Baseline greedy area', 42: 'Track maxL/maxR or two-pointer trap' },
    autopsies: [
      {
        cause: 'Moving both pointers',
        wrong: 'l++; r--; // every iteration',
        testCase: '[1,2,4,3]',
        fix: 'Move only the shorter height side',
      },
    ],
    sayIt: ['Max area / trap water → opposite ends.', 'Always drop the shorter line — it cannot improve area.'],
  }),

  'greedy-pair': e({
    xray: [
      { text: 'Pair people with **minimum boats**; limit per boat', kind: 'goal' },
      { text: '**Minimize the maximum** pair sum after pairing', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'minimize'],
    slottedTemplate: `sort(nums);
while (l <= r) {
    {{PAIR_LOGIC}}
    l++; r--; // or r-- only
}`,
    slots: [{ id: 'PAIR_LOGIC', label: 'Pair rule' }],
    slotFills: {
      881: { PAIR_LOGIC: 'if (people[l]+people[r]<=limit) l++; r--; boats++' },
      1877: { PAIR_LOGIC: 'ans=max(ans,nums[l]+nums[r]); both++' },
    },
    helixDelta: { 1877: 'Always pair ends', 881: 'Greedy: light+heavy if fit' },
    autopsies: [
      {
        cause: 'Forgot to sort',
        wrong: 'pair from unsorted array',
        testCase: 'random weights',
        fix: 'sort first — greedy pairing needs order',
      },
    ],
    sayIt: ['Sort + pair lightest with heaviest from both ends.', '881: if both fit one boat, l++; always r--.'],
  }),

  'k-diff': e({
    xray: [
      { text: 'Count **unique pairs** with difference exactly **k**', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite'],
    slottedTemplate: `while (r < n) {
    while (l < r && nums[r]-nums[l] > k) l++;
    if (l < r && nums[r]-nums[l] == k) ans++;
    r++;
}`,
    slots: [],
    slotFills: { 532: {} },
    helixDelta: { 532: 'Sliding l when diff too large' },
    autopsies: [
      {
        cause: 'Unsorted two-pointer',
        wrong: 'two pointers without sort',
        testCase: 'random order',
        fix: 'sort(nums) first',
      },
    ],
    sayIt: ['K-diff pairs → sort, r scans, l catches up when diff>k.'],
  }),

  nsum: e({
    xray: [
      { text: 'Find **all unique triplets** in the array which give sum **zero**', kind: 'goal' },
      { text: 'Find the triplet such that the sum is **closest** to target', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'enumerate', 'targetSum'],
    slottedTemplate: `for (int i = 0; i < n; i++) {
    {{SKIP_I}}
    int l = i+1, r = n-1;
    while (l < r) { /* opposite sum template */ }
}`,
    slots: [{ id: 'SKIP_I', label: 'Dup skip' }],
    slotFills: {
      15: { SKIP_I: 'if (i && nums[i]==nums[i-1]) continue;' },
      16: { SKIP_I: 'same; track closest |s-target|' },
      18: { SKIP_I: '+ for j loop; skip dup j' },
    },
    helixOrder: [15, 16, 18],
    helixDelta: { 15: 'Baseline 3Sum', 16: 'Track closest not zero', 18: 'Add outer j for 4Sum' },
    autopsies: [
      {
        cause: 'Missing duplicate skip on i',
        wrong: 'for (i) { l=i+1; r=n-1; ...}',
        testCase: '[0,0,0,0]',
        fix: 'Skip duplicate nums[i] on outer loop',
      },
    ],
    sayIt: ['k-sum: outer loops fix prefix, inner is two-sum II.', 'Skip duplicates on each outer index.'],
  }),

  multiplicity: e({
    xray: [
      { text: 'Return the number of tuples **modulo 10⁹+7**', kind: 'output' },
      { text: 'Count with **multiplicity** not list triplets', kind: 'goal' },
    ],
    budget: ['sorted', 'opposite', 'enumerate'],
    slottedTemplate: `if (s == target) {
    {{COUNT_COMBOS}}  // not push_back triplets
}`,
    slots: [{ id: 'COUNT_COMBOS', label: 'Combo math' }],
    slotFills: {
      923: { COUNT_COMBOS: 'ans += lc * rc; mod 1e9+7; handle l==r run' },
    },
    helixDelta: { 923: 'Multiply run lengths on match' },
    autopsies: [
      {
        cause: 'Listing triplets instead of counting',
        wrong: 'out.push_back({...})',
        testCase: 'large array with many dupes',
        fix: 'Combo count: lc*rc or nC2 for equal runs',
      },
    ],
    sayIt: ['Same 3Sum loop but count combinations, do not enumerate triplets.'],
  }),

  cycle: e({
    xray: [
      { text: 'Given head, determine if the linked list has a **cycle**', kind: 'goal' },
      { text: 'Find the **duplicate** in nums (1..n) with O(1) space', kind: 'goal' },
      { text: '**Happy number** — detect cycle in transformation', kind: 'signal' },
    ],
    budget: ['listNode', 'o1Space'],
    slottedTemplate: `slow = fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if ({{STOP}}) return {{RESULT}};
}`,
    slots: [
      { id: 'STOP', label: 'Stop when' },
      { id: 'RESULT', label: 'Return' },
    ],
    slotFills: {
      141: { STOP: 'slow == fast', RESULT: 'true' },
      142: { STOP: 'slow == fast', RESULT: 'reset slow=head; walk 1x' },
      287: { STOP: 'slow == fast', RESULT: 'nums as linked list' },
      202: { STOP: 'slow == fast', RESULT: 'digit-square map' },
    },
    helixOrder: [141, 142, 287, 202],
    helixDelta: {
      141: 'Detect cycle exists',
      142: 'Find cycle start node',
      287: 'Index as next pointer',
      202: 'Floyd on int map',
    },
    autopsies: [
      {
        cause: 'Wrong cycle start after Floyd',
        wrong: 'return slow immediately after meet',
        testCase: 'cycle not at head',
        fix: 'slow=head; advance both 1x until meet',
      },
    ],
    sayIt: ['Cycle or duplicate with O(1) space → Floyd tortoise & hare.', '142: after meet, reset slow to head.'],
  }),

  position: e({
    xray: [
      { text: 'Return the **middle** node of linked list', kind: 'goal' },
      { text: 'Remove the **nth node from the end**', kind: 'goal' },
      { text: 'Find **intersection** of two linked lists', kind: 'goal' },
    ],
    budget: ['listNode', 'o1Space'],
    slottedTemplate: `slow = fast = {{START}};
while ({{FAST_COND}}) {
    slow = slow->next;
    fast = fast->next->next; // or fast=fast->next
}`,
    slots: [
      { id: 'START', label: 'Start nodes' },
      { id: 'FAST_COND', label: 'Fast loop' },
    ],
    slotFills: {
      876: { START: 'head', FAST_COND: 'fast && fast->next' },
      19: { START: 'dummy; fast n+1 ahead', FAST_COND: 'fast' },
      160: { START: 'headA/headB switch', FAST_COND: 'a != b' },
    },
    helixDelta: { 876: 'Middle', 19: 'Gap n+1', 160: 'A+B length walk' },
    autopsies: [
      {
        cause: 'Off-by-one on nth from end',
        wrong: 'fast n ahead not n+1',
        testCase: 'remove last node n=1',
        fix: 'fast n+1 ahead with dummy node',
      },
    ],
    sayIt: ['Middle → fast 2x. Nth from end → fast n+1 ahead. Intersection → walk A then B.'],
  }),

  structural: e({
    xray: [
      { text: 'Check if linked list is **palindrome**', kind: 'goal' },
      { text: '**Reorder** list L0→Ln→L1→Ln-1…', kind: 'goal' },
    ],
    budget: ['listNode', 'o1Space'],
    slottedTemplate: `// 1) mid = fast/slow  2) reverse 2nd half  3) {{MERGE_OR_COMPARE}}`,
    slots: [{ id: 'MERGE_OR_COMPARE', label: 'Step 3' }],
    slotFills: {
      234: { MERGE_OR_COMPARE: 'compare first half vs reversed' },
      143: { MERGE_OR_COMPARE: 'weave alternate nodes' },
    },
    helixDelta: { 234: 'Palindrome check', 143: 'Reorder weave' },
    autopsies: [
      {
        cause: 'Forgot to reverse second half',
        wrong: 'compare head with mid directly',
        testCase: '1→2→2→1',
        fix: 'reverse list from mid first',
      },
    ],
    sayIt: ['Restructure list → find mid, reverse half, then merge or compare.'],
  }),

  'fixed-win': e({
    xray: [
      { text: 'Find the **maximum average** subarray of length **k**', kind: 'goal' },
      { text: 'Sub-arrays of size **k** with average ≥ threshold', kind: 'goal' },
    ],
    budget: ['contiguous', 'fixedK'],
    slottedTemplate: `for (r = 0; r < n; r++) {
    sum += nums[r];
    if (r >= k-1) {
        {{UPDATE}};
        sum -= nums[r-k+1]; // slide
    }
}`,
    slots: [{ id: 'UPDATE', label: 'When window full' }],
    slotFills: {
      643: { UPDATE: 'best = max(best, sum)' },
      1343: { UPDATE: 'if (sum >= t*k) count++' },
    },
    helixDelta: { 643: 'Track max avg', 1343: 'Count windows' },
    autopsies: [
      {
        cause: 'Using shrink while loop for fixed k',
        wrong: 'while (r-l+1 > k) l++;',
        testCase: 'fixed k=3',
        fix: 'No shrink loop — slide by subtract nums[r-k+1]',
      },
    ],
    sayIt: ['Exactly k length → fixed window, slide without while-shrink.'],
  }),

  'expand-win': e({
    xray: [
      { text: 'Find the **longest substring** without repeating characters', kind: 'goal' },
      { text: '**At most K distinct** characters / **2 types** of fruits', kind: 'constraint' },
      { text: '**Max consecutive 1s** with at most K flips', kind: 'goal' },
    ],
    budget: ['contiguous', 'maximize'],
    slottedTemplate: `for (r = 0; r < n; r++) {
    {{ADD_R}}
    while ({{INVALID}}) { {{REMOVE_L}} l++; }
    ans = max(ans, r - l + 1);
}`,
    slots: [
      { id: 'INVALID', label: 'Invalid when' },
      { id: 'REMOVE_L', label: 'Remove from left' },
    ],
    slotFills: {
      3: { INVALID: 'char seen in window', REMOVE_L: 'advance l past last index' },
      904: { INVALID: 'map.size() > 2', REMOVE_L: 'dec freq nums[l]' },
      340: { INVALID: 'distinct > k', REMOVE_L: 'shrink map' },
      1004: { INVALID: 'zeros > k', REMOVE_L: 'dec zero count' },
    },
    helixOrder: [3, 904, 340, 1004],
    helixDelta: { 3: 'Dup char invalid', 904: '>2 types', 340: '>k distinct', 1004: '>k zeros' },
    autopsies: [
      {
        cause: 'Forgetting to update ans inside loop',
        wrong: 'return r-l+1 after loop only once',
        testCase: 'long string multiple windows',
        fix: 'ans = max(ans, r-l+1) each valid step',
      },
    ],
    sayIt: ['Longest valid window → expand r, shrink l while invalid, track max.'],
  }),

  'contract-win': e({
    xray: [
      { text: 'Find the **minimum window** substring containing all characters of t', kind: 'goal' },
      { text: '**Minimum size** subarray sum ≥ target', kind: 'goal' },
    ],
    budget: ['contiguous', 'minimize'],
    slottedTemplate: `for (r = 0; r < n; r++) {
    {{ADD_R}}
    while ({{VALID}}) {
        ans = min(ans, r - l + 1);
        {{REMOVE_L}} l++;
    }
}`,
    slots: [
      { id: 'VALID', label: 'Valid while' },
      { id: 'REMOVE_L', label: 'Shrink' },
    ],
    slotFills: {
      76: { VALID: 'window has all of t', REMOVE_L: 'remove s[l] from freq' },
      209: { VALID: 'sum >= target', REMOVE_L: 'sum -= nums[l]' },
      1234: { VALID: 'window balances excess', REMOVE_L: 'shrink l' },
    },
    helixOrder: [209, 76, 1234],
    helixDelta: { 209: 'Sum threshold', 76: 'Freq cover all chars', 1234: 'Balance counts' },
    autopsies: [
      {
        cause: 'Shrinking while invalid instead of while valid',
        wrong: 'while (!valid) l++;',
        testCase: 'min window substring',
        fix: 'Expand until valid, then shrink WHILE still valid',
      },
    ],
    sayIt: ['Shortest window → expand until valid, shrink while valid, minimize length.'],
  }),

  'freq-win': e({
    xray: [
      { text: 'Find all **anagrams** of p in s', kind: 'goal' },
      { text: 'Check if s2 contains a **permutation** of s1', kind: 'goal' },
    ],
    budget: ['contiguous', 'fixedK', 'string'],
    slottedTemplate: `window size = |p|;
if ({{FREQ_MATCH}}) record index;`,
    slots: [{ id: 'FREQ_MATCH', label: 'Freq match' }],
    slotFills: {
      438: { FREQ_MATCH: 'have == need (26 chars)' },
      567: { FREQ_MATCH: 'same; return true on first hit' },
      1100: { FREQ_MATCH: 'fixed k; all freq <= 1' },
    },
    helixDelta: { 438: 'All anagram indices', 567: 'First permutation', 1100: 'No repeat in k-window' },
    autopsies: [
      {
        cause: 'Variable window for anagram',
        wrong: 'while invalid shrink for anagram',
        testCase: 'find anagrams',
        fix: 'Fixed |p| window only — slide and compare freq',
      },
    ],
    sayIt: ['Anagram/permutation → fixed window length |p|, compare frequency arrays.'],
  }),

  removal: e({
    xray: [
      { text: 'Remove **duplicates in-place** from sorted array', kind: 'goal' },
      { text: 'Remove all instances of **val** in-place', kind: 'goal' },
      { text: 'Return **k** = new length', kind: 'output' },
    ],
    budget: ['inPlace', 'sorted'],
    slottedTemplate: `int w = 0;
for (int r = 0; r < n; r++)
    if ({{KEEP}}) nums[w++] = nums[r];
return w;`,
    slots: [{ id: 'KEEP', label: 'Keep condition' }],
    slotFills: {
      26: { KEEP: 'r==0 || nums[r]!=nums[r-1]' },
      80: { KEEP: 'w<2 || nums[r]!=nums[w-2]' },
      27: { KEEP: 'nums[r] != val' },
    },
    helixOrder: [26, 80, 27],
    helixDelta: { 26: 'Keep if != prev', 80: 'Allow 2 dupes', 27: 'Filter != val' },
    autopsies: [
      {
        cause: 'Using extra array',
        wrong: 'vector<int> out; push_back...',
        testCase: 'in-place constraint',
        fix: 'Write index w only — O(1) space',
      },
    ],
    sayIt: ['In-place remove → read r, write w, keep condition only.'],
  }),

  movement: e({
    xray: [
      { text: 'Move all **0s** to the end while maintaining order', kind: 'goal' },
      { text: 'Sort array by **parity** in-place', kind: 'goal' },
    ],
    budget: ['inPlace'],
    slottedTemplate: `for (r) if ({{KEEP}}) nums[w++] = nums[r];
{{FILL}}`,
    slots: [
      { id: 'KEEP', label: 'Keep' },
      { id: 'FILL', label: 'Optional fill' },
    ],
    slotFills: {
      283: { KEEP: 'nums[r]!=0', FILL: 'fill rest with 0' },
      905: { KEEP: 'nums[r]%2==0', FILL: 'swap evens forward' },
    },
    helixDelta: { 283: 'Filter nonzero + fill', 905: 'Evens to front' },
    autopsies: [
      {
        cause: 'Swapping breaks stable order for zeroes',
        wrong: 'swap on every zero',
        testCase: '[0,1,0,3,12]',
        fix: 'Filter nonzeros first, then fill zeros',
      },
    ],
    sayIt: ['Move zeroes / parity → filter with w, optional fill or swap.'],
  }),

  transform: e({
    xray: [
      { text: 'Reverse string **in-place**', kind: 'goal' },
      { text: 'Reverse only **vowels**', kind: 'goal' },
    ],
    budget: ['string', 'inPlace', 'opposite'],
    slottedTemplate: `while (l < r) {
    {{SKIP}}
    swap(s[l++], s[r--]);
}`,
    slots: [{ id: 'SKIP', label: 'Before swap' }],
    slotFills: {
      344: { SKIP: 'nothing' },
      345: { SKIP: 'skip non-vowel at l,r' },
    },
    helixDelta: { 344: 'Swap all', 345: 'Skip consonants' },
    autopsies: [
      {
        cause: 'Using extra string',
        wrong: 'string rev = s; reverse(rev)',
        testCase: 'O(1) space ask',
        fix: 'Opposite pointer swap in-place',
      },
    ],
    sayIt: ['Reverse in-place → l/r swap; vowels: skip non-vowel first.'],
  }),

  'basic-sub': e({
    xray: [
      { text: 'Check if s is a **subsequence** of t', kind: 'goal' },
      { text: 'Return number of words that are **subsequence** of s', kind: 'goal' },
    ],
    budget: ['string'],
    slottedTemplate: `int j = 0;
for (char c : s) if (c == t[j]) j++;
return j == t.size();`,
    slots: [],
    slotFills: {
      392: {},
      792: {},
    },
    helixDelta: { 392: 'Single scan', 792: 'Bucket by first char' },
    autopsies: [
      {
        cause: 'Advancing wrong pointer',
        wrong: 'i++ on every mismatch on s',
        testCase: 's=abc t=ahbgdc',
        fix: 'Only j++ when chars match; i scans s',
      },
    ],
    sayIt: ['Subsequence → one pointer on target, scan source, match in order.'],
  }),

  'pattern-sub': e({
    xray: [
      { text: '**Camelcase** matching with pattern', kind: 'signal' },
      { text: '**Word abbreviation** with digit skips', kind: 'signal' },
    ],
    budget: ['string'],
    slottedTemplate: `// dual pointers + {{PARSE_RULES}}`,
    slots: [{ id: 'PARSE_RULES', label: 'Parse rules' }],
    slotFills: {
      1023: { PARSE_RULES: 'uppercase must match pattern; skip lower in query' },
      408: { PARSE_RULES: 'parse multi-digit skip count in abbr' },
    },
    helixDelta: { 1023: 'Camel rules', 408: 'Digit skip counts' },
    autopsies: [
      {
        cause: 'Single-digit skip only',
        wrong: 'i += abbr[j]-\'0\' // one digit',
        testCase: 'abbr "10" skip 10 chars',
        fix: 'Parse full multi-digit number',
      },
    ],
    sayIt: ['Pattern with skips → parse digits; camel → match uppercase only in pattern.'],
  }),

  dnf: e({
    xray: [
      { text: 'Array contains only **0, 1, 2** — sort in-place', kind: 'constraint' },
      { text: 'One pass, **O(n)** time', kind: 'constraint' },
    ],
    budget: ['values012', 'inPlace'],
    slottedTemplate: `lo=0, mid=0, hi=n-1;
while (mid <= hi) {
    if (nums[mid]==0) swap lo++, mid++;
    else if (nums[mid]==1) mid++;
    else swap(mid, hi--);
}`,
    slots: [],
    slotFills: { 75: {} },
    helixDelta: { 75: 'Dutch flag 3-way' },
    autopsies: [
      {
        cause: 'mid++ after swapping 2 with hi',
        wrong: 'swap(mid,hi); mid++;',
        testCase: 'nums[mid]==2',
        fix: 'Do not mid++ after swap with hi — unprocessed element',
      },
    ],
    sayIt: ['Only 0,1,2 → Dutch flag: lo/mid/hi three pointers.'],
  }),

  'quick-part': e({
    xray: [
      { text: 'Find the **kth largest** element', kind: 'goal' },
      { text: 'Sort an array (**quicksort**)', kind: 'goal' },
    ],
    budget: ['kth', 'inPlace'],
    slottedTemplate: `int p = partition(a, lo, hi);
if (p == k) return a[p];
{{RECURSE_ONE_OR_BOTH}}`,
    slots: [{ id: 'RECURSE_ONE_OR_BOTH', label: 'Recurse' }],
    slotFills: {
      215: { RECURSE_ONE_OR_BOTH: 'recurse lo..p-1 or p+1..hi only' },
      912: { RECURSE_ONE_OR_BOTH: 'recurse both sides' },
    },
    helixDelta: { 215: 'Quickselect one side', 912: 'Full quicksort' },
    autopsies: [
      {
        cause: 'Full sort for kth',
        wrong: 'sort entire array; return a[n-k]',
        testCase: 'large n, small k',
        fix: 'Partition and recurse one side — O(n) average',
      },
    ],
    sayIt: ['Kth largest → partition, recurse only the side containing k.'],
  }),

  merge: e({
    xray: [
      { text: 'Merge two **sorted** lists / arrays', kind: 'constraint' },
      { text: 'Merge **k** sorted lists', kind: 'goal' },
    ],
    budget: ['twoInputs', 'sorted'],
    slottedTemplate: `while (i < n && j < m) {
    pick smaller from {{A_OR_B}};
    advance that pointer;
}`,
    slots: [{ id: 'A_OR_B', label: 'Pick rule' }],
    slotFills: {
      21: { A_OR_B: 'list heads a,b' },
      88: { A_OR_B: 'nums1[i] vs nums2[j] from end' },
      23: { A_OR_B: 'min-heap of k heads' },
    },
    helixOrder: [88, 21, 23],
    helixDelta: { 88: 'Fill from end', 21: 'Two lists dummy head', 23: 'K-way heap' },
    autopsies: [
      {
        cause: 'Merge forward in nums1',
        wrong: 'fill nums1 from index 0',
        testCase: 'nums1 has room at end',
        fix: 'Merge from tail indices m+n-1',
      },
    ],
    sayIt: ['Two sorted inputs → one pointer each, pick smaller, advance.'],
  }),

  intersect: e({
    xray: [
      { text: '**Intersection** of two arrays', kind: 'goal' },
      { text: '**Interval list** intersections', kind: 'goal' },
    ],
    budget: ['twoInputs', 'sorted'],
    slottedTemplate: `while (i < n && j < m) {
    if (equal) { record; i++; j++; }
    else if (a[i] < b[j]) i++; else j++;
}`,
    slots: [],
    slotFills: {
      349: {},
      350: {},
      986: {},
    },
    helixDelta: { 349: 'Unique intersection', 350: 'Multiplicity', 986: 'Interval overlap' },
    autopsies: [
      {
        cause: 'Not advancing after match on intervals',
        wrong: 'always i++',
        testCase: 'overlapping intervals',
        fix: 'Advance list with smaller end',
      },
    ],
    sayIt: ['Sorted intersection → two pointers, advance smaller on mismatch.'],
  }),

  'compare-scan': e({
    xray: [
      { text: 'Compare **version numbers**', kind: 'goal' },
      { text: 'Compare strings with **backspace** (#)', kind: 'goal' },
    ],
    budget: ['string', 'twoInputs'],
    slottedTemplate: `// simulate or parse {{SEGMENT_RULE}}`,
    slots: [{ id: 'SEGMENT_RULE', label: 'Parse rule' }],
    slotFills: {
      165: { SEGMENT_RULE: 'dot-separated int segments' },
      844: { SEGMENT_RULE: 'from end skip # counts' },
    },
    helixDelta: { 165: 'Parse version segments', 844: 'Backspace from end O(1) space' },
    autopsies: [
      {
        cause: 'Building full strings with backspaces',
        wrong: 'stack push/pop all chars',
        testCase: 'long strings O(1) space ask',
        fix: 'Two pointers from end with skip counts',
      },
    ],
    sayIt: ['Compare streams → parse segments or simulate from end.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
