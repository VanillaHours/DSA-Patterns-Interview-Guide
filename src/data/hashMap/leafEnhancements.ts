import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement {
  return partial
}

export const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  'elem-presence': e({
    xray: [
      { text: 'Given an integer array **nums**, return **true** if any value appears **at least twice**', kind: 'goal' },
      { text: 'Given an array and an integer **k**, check if **nums[i]==nums[j]** and **|i-j|≤k**', kind: 'goal' },
      { text: 'Return **indices** of two numbers that add up to **target**', kind: 'goal' },
    ],
    budget: ['unsorted', 'frequency'],
    slottedTemplate: `unordered_{{SET_OR_MAP}}<{{KEY_TYPE}}, {{VAL_TYPE}}> seen;
for (int i = 0; i < n; i++) {
    {{CHECK}};
    {{INSERT}};
}`,
    slots: [
      { id: 'SET_OR_MAP', label: 'Set or map' },
      { id: 'KEY_TYPE', label: 'Key type' },
      { id: 'VAL_TYPE', label: 'Value type' },
      { id: 'CHECK', label: 'Check condition' },
      { id: 'INSERT', label: 'Insert logic' },
    ],
    slotFills: {
      217: { SET_OR_MAP: 'set', KEY_TYPE: 'int', VAL_TYPE: '', CHECK: 'if (seen.count(x)) return true', INSERT: 'seen.insert(x)' },
      219: { SET_OR_MAP: 'map', KEY_TYPE: 'int', VAL_TYPE: 'int', CHECK: 'if (seen.count(x) && i-seen[x]<=k) return true', INSERT: 'seen[x] = i' },
      1: { SET_OR_MAP: 'map', KEY_TYPE: 'int', VAL_TYPE: 'int', CHECK: 'int need = target - x; if (seen.count(need)) return {seen[need], i}', INSERT: 'seen[x] = i' },
    },
    helixOrder: [217, 219, 1],
    helixDelta: {
      217: 'Baseline — detect any duplicate',
      219: '+ window constraint k on index gap',
      1: 'Complement lookup instead of duplicate check',
    },
    autopsies: [
      {
        cause: 'Hash map on sorted array',
        wrong: 'unordered_map for two-sum on sorted input',
        testCase: 'LC 167 sorted array',
        fix: 'If sorted, use opposite pointers. Hash map = unsorted only.',
      },
    ],
    sayIt: [
      'Element presence → set insert + count.',
      'Two sum unsorted → complement lookup via map.',
      'LC 219: index must be ≤ k apart.',
    ],
  }),

  'char-freq': e({
    xray: [
      { text: 'Given two strings, check if one is an **anagram** of the other', kind: 'goal' },
      { text: 'Given a **ransom note** and **magazine**, can note be formed?', kind: 'goal' },
    ],
    budget: ['stringInput', 'frequency'],
    slottedTemplate: `unordered_map<char, int> freq;
for (char c : {{SOURCE}}) freq[c]++;
for (char c : {{TARGET}}) if (--freq[c] < 0) return false;
return true;`,
    slots: [
      { id: 'SOURCE', label: 'Source string' },
      { id: 'TARGET', label: 'Target string' },
    ],
    slotFills: {
      242: { SOURCE: 's', TARGET: 't' },
      383: { SOURCE: 'magazine', TARGET: 'ransomNote' },
      49: { SOURCE: '(each string)', TARGET: '(sorted key)' },
    },
    helixDelta: { 242: 'Anagram: inc one, dec other', 383: 'Ransom: magazine inc, note dec', 49: 'Group: sorted key as hash' },
    autopsies: [
      {
        cause: 'Using map when array[26] suffices',
        wrong: 'unordered_map<char,int> freq; // 26 keys only',
        testCase: 'lowercase only',
        fix: 'int freq[26] = {0}; — faster and simpler',
      },
    ],
    sayIt: ['Anagram → count chars from both strings and compare.', 'Ransom note → magazine must have >= each char.'],
  }),

  'freq-bucket': e({
    xray: [
      { text: 'Return the **k most frequent** elements in any order', kind: 'goal' },
      { text: 'Sort string by **frequency** of characters', kind: 'goal' },
    ],
    budget: ['frequency', 'topK'],
    slottedTemplate: `unordered_map<int, int> freq;
for (int x : nums) freq[x]++;
vector<vector<int>> buckets(nums.size() + 1);
for (auto& [num, cnt] : freq) buckets[cnt].push_back(num);
{{EXTRACT}}`,
    slots: [
      { id: 'EXTRACT', label: 'Extract from buckets' },
    ],
    slotFills: {
      347: { EXTRACT: 'for i from n down to 0: for x in buckets[i]: out.push_back(x); if out.size()==k return out' },
      451: { EXTRACT: 'for i from n down to 0: for c in buckets[i]: out.append(i, c)' },
      1394: { EXTRACT: 'int ans = -1; for (auto& [num, cnt] : freq) if (num == cnt) ans = max(ans, num)' },
    },
    helixDelta: { 347: 'Top K frequent', 451: 'Sort by frequency string', 1394: 'Lucky integer (num==freq)' },
    autopsies: [
      {
        cause: 'Using sort O(n log n) instead of bucket sort O(n)',
        wrong: 'sort by freq descending',
        testCase: 'all elements same freq',
        fix: 'Bucket sort: count as index O(n)',
      },
    ],
    sayIt: ['Top K → freq map + bucket sort (count as index).'],
  }),

  'heavy-hitters': e({
    xray: [
      { text: 'Find the **majority element** that appears more than **n/2** times', kind: 'goal' },
      { text: 'Find all elements that appear **more than n/3** times', kind: 'goal' },
    ],
    budget: ['frequency', 'o1Space'],
    slottedTemplate: `int cand = 0, cnt = 0;
for (int x : nums) {
    if (cnt == 0) { cand = x; cnt = 1; }
    else if (x == cand) cnt++;
    else cnt--;
}`,
    slots: [],
    slotFills: { 169: {}, 229: {} },
    helixDelta: { 169: 'Boyer-Moore single candidate', 229: 'Two candidates, verify counts > n/3' },
    autopsies: [
      {
        cause: 'Using hash map for majority',
        wrong: 'unordered_map<int,int> freq; for... if(freq[x]>n/2) return x;',
        testCase: 'O(1) space constraint',
        fix: 'Boyer-Moore voting — cancel pairs, O(1) space',
      },
    ],
    sayIt: ['Majority element → Boyer-Moore voting (pair cancellation).', '> n/3 → two candidates, verify counts.'],
  }),

  'sum-based': e({
    xray: [
      { text: 'Given an **unsorted** array, return indices of two numbers adding to **target**', kind: 'goal' },
      { text: 'Number of **subarrays** summing to **k**', kind: 'goal' },
      { text: 'Check if a subarray of **size ≥2** sums to multiple of **k**', kind: 'goal' },
    ],
    budget: ['unsorted', 'complement', 'targetSum'],
    slottedTemplate: `unordered_map<int, int> seen;
{{INIT}}
{{LOOP}}`,
    slots: [
      { id: 'INIT', label: 'Initial state' },
      { id: 'LOOP', label: 'Loop logic' },
    ],
    slotFills: {
      1: { INIT: '', LOOP: 'for i,n: need=target-nums[i]; if seen.count(need) return {seen[need],i}; seen[nums[i]]=i' },
      560: { INIT: 'seen[0]=1; sum=0; ans=0;', LOOP: 'for x: sum+=x; ans+=seen[sum-k]; seen[sum]++' },
      523: { INIT: 'seen[0]=-1; sum=0;', LOOP: 'for i,x: sum+=x; rem=sum%k; if seen.count(rem){ if i-seen[rem]>=2 return true; } else seen[rem]=i' },
    },
    helixOrder: [1, 560, 523],
    helixDelta: { 1: 'Two-sum complement', 560: 'Prefix sum + seen count', 523: 'Prefix remainder + index gap' },
    autopsies: [
      {
        cause: 'Forgetting seen[0]=1 for subarray sum',
        wrong: 'seen initialized empty',
        testCase: 'subarray starting at index 0 sums to k',
        fix: 'seen[0] = 1 (or seen[0] = -1 for LC 523)',
      },
    ],
    sayIt: ['Two sum → complement map. Subarray sum → prefix sum map with seen[0]=1.'],
  }),

  'property-match': e({
    xray: [
      { text: 'Count **unique pairs** with absolute difference **k**', kind: 'goal' },
      { text: 'Count number of pairs with **|a-b| == k**', kind: 'goal' },
    ],
    budget: ['unsorted', 'complement'],
    slottedTemplate: `unordered_map<int,int> freq;
for (int x : nums) freq[x]++;
int ans = 0;
for (auto [num, cnt] : freq) {
    {{COUNT_LOGIC}}
}`,
    slots: [{ id: 'COUNT_LOGIC', label: 'Count pairs' }],
    slotFills: {
      532: { COUNT_LOGIC: 'if (k==0) { if(cnt>1) ans++; } else if (freq.count(num+k)) ans++;' },
      2006: { COUNT_LOGIC: 'if (freq.count(num+k)) ans += cnt * freq[num+k];' },
    },
    helixDelta: { 532: 'Unique k-diff pairs', 2006: 'Count all (x, x+k) pairs' },
    autopsies: [
      {
        cause: 'Double-counting pairs in both directions',
        wrong: 'ans += freq[num+k] + freq[num-k]',
        testCase: 'k=2, array [1,3]',
        fix: 'Only count num+k (or num-k) — not both',
      },
    ],
    sayIt: ['Property pairs → freq map, count num+k existence.', 'K=0: check count > 1. K>0: skip duplicates.'],
  }),

  bijection: e({
    xray: [
      { text: 'Determine if two strings s and t are **isomorphic**', kind: 'goal' },
      { text: 'Given a **pattern** and a string s, check word matching', kind: 'goal' },
    ],
    budget: ['bijection', 'stringInput'],
    slottedTemplate: `unordered_map<char, char> s2t, t2s;
for (int i = 0; i < n; i++) {
    char a = {{A}}, b = {{B}};
    if (s2t.count(a) && s2t[a] != b) return false;
    if (t2s.count(b) && t2s[b] != a) return false;
    s2t[a] = b; t2s[b] = a;
}
return true;`,
    slots: [
      { id: 'A', label: 'Char from source' },
      { id: 'B', label: 'Char from target' },
    ],
    slotFills: {
      205: { A: 's[i]', B: 't[i]' },
      290: { A: 'pattern[i]', B: 'word from stream' },
      246: { A: 's[l]', B: 's[r]; mirror map' },
    },
    helixDelta: { 205: 'Char-to-char isomorphism', 290: 'Char-to-word pattern', 246: 'Digit rotation mirror' },
    autopsies: [
      {
        cause: 'Single map without reverse check',
        wrong: 'unordered_map s2t only',
        testCase: 's="foo", t="bar"',
        fix: 'Dual maps: s2t AND t2s to enforce bijection',
      },
    ],
    sayIt: ['Bijection → two maps: source→target and target→source.'],
  }),

  grouping: e({
    xray: [
      { text: '**Group** strings that are anagrams of each other', kind: 'goal' },
      { text: 'Group strings by **cyclic shift** property', kind: 'goal' },
    ],
    budget: ['grouping', 'stringInput'],
    slottedTemplate: `unordered_map<string, vector<string>> groups;
for (auto& item : input) {
    string key = {{KEY_FN}};
    groups[key].push_back(item);
}`,
    slots: [{ id: 'KEY_FN', label: 'Key function' }],
    slotFills: {
      49: { KEY_FN: 's; sort(key.begin(),key.end())' },
      249: { KEY_FN: 'cyclic diff tuple: for i: key+=to_string(([i]-[i-1]+26)%26)+","' },
      1282: { KEY_FN: 'to_string(groupSize[i])' },
    },
    helixDelta: { 49: 'Sorted string key', 249: 'Cyclic shift diff key', 1282: 'Group size key' },
    autopsies: [
      {
        cause: 'Using sorted string key (O(L log L)) instead of char count (O(L))',
        wrong: 'sort(s) as key',
        testCase: 'very long strings',
        fix: 'Char count tuple: string key(26,0); for c: key[c-\'a\']++',
      },
    ],
    sayIt: ['Group by normalized key → hash map from key to list.', 'Anagram: sorted string or char count as key.'],
  }),

  'prefix-sum-map': e({
    xray: [
      { text: 'Number of subarrays summing to **k**', kind: 'goal' },
      { text: 'Find longest subarray with **equal 0s and 1s**', kind: 'goal' },
      { text: 'Count subarrays with **k odd numbers**', kind: 'goal' },
    ],
    budget: ['prefixSum', 'targetSum'],
    slottedTemplate: `int sum = 0, ans = 0;
unordered_map<int,int> seen;
seen[0] = 1;
for (int x : nums) {
    sum += {{DELTA}};
    ans += seen[sum - {{TARGET}}];
    seen[sum]++;
}`,
    slots: [
      { id: 'DELTA', label: 'Delta per element' },
      { id: 'TARGET', label: 'Target value' },
    ],
    slotFills: {
      560: { DELTA: 'x', TARGET: 'k' },
      525: { DELTA: 'x == 0 ? -1 : 1', TARGET: '0 (same prefix)' },
      1248: { DELTA: 'x % 2 == 1 ? 1 : 0', TARGET: 'k' },
    },
    helixOrder: [560, 525, 1248],
    helixDelta: { 560: 'Subarray sum k', 525: '0/1 balance → longest gap', 1248: 'Odd count as sum' },
    autopsies: [
      {
        cause: 'LC 525: counting instead of tracking longest',
        wrong: 'ans += seen[sum]; // count, not max',
        testCase: '[0,1,0]',
        fix: 'Store first occurrence index; ans = max(ans, i - first[sum])',
      },
    ],
    sayIt: ['Prefix sum + map: seen[0]=1; for each x: sum+=x; ans+=seen[sum-k].'],
  }),

  'multi-map': e({
    xray: [
      { text: 'Count **subdomain** visits from domain+count pairs', kind: 'goal' },
      { text: 'Design a **time-based key-value store**', kind: 'goal' },
    ],
    budget: ['grouping', 'prefixSum'],
    slottedTemplate: `unordered_map<string, {{VAL_TYPE}}> map;
{{LOGIC}}`,
    slots: [
      { id: 'VAL_TYPE', label: 'Value type' },
      { id: 'LOGIC', label: 'Logic' },
    ],
    slotFills: {
      811: { VAL_TYPE: 'int', LOGIC: 'for each entry: parse count & domain; for each subdomain: map[sub] += count' },
      981: { VAL_TYPE: 'vector<pair<int,string>>', LOGIC: 'set: map[key].push_back({timestamp,val}); get: binary search timestamp' },
      1152: { VAL_TYPE: 'vector<pair<int,string>>', LOGIC: 'group by user, sort by time, generate 3-page combos' },
    },
    helixDelta: { 811: 'Subdomain accumulation', 981: 'Time map + binary search', 1152: 'User visit patterns' },
    autopsies: [
      {
        cause: 'LC 981: O(n) scan for get() instead of binary search',
        wrong: 'for(int i=0;i<v.size();i++) if(v[i].first<=t) result=v[i].second;',
        testCase: 'many set() calls',
        fix: 'upper_bound then prev — O(log n) per get()',
      },
    ],
    sayIt: ['Multi-map: map to vector/accumulator.', 'Time map: binary search on timestamp vector.'],
  }),

  'index-hash': e({
    xray: [
      { text: 'Find **longest consecutive sequence** in O(n)', kind: 'goal' },
      { text: 'Find **first missing positive** integer in O(1) space', kind: 'goal' },
      { text: 'Find **all duplicates** in array without extra space', kind: 'goal' },
    ],
    budget: ['o1Space', 'unsorted'],
    slottedTemplate: `// Index as hash key technique
{{TECHNIQUE}}`,
    slots: [{ id: 'TECHNIQUE', label: 'Technique' }],
    slotFills: {
      128: { TECHNIQUE: 'unordered_set s(nums); for x: if !s.count(x-1): len=1; while s.count(x+len) len++; best=max(best,len)' },
      41: { TECHNIQUE: 'for i: while nums[i]>0 && nums[i]<=n && nums[nums[i]-1]!=nums[i]: swap(nums[i],nums[nums[i]-1]); for i: if nums[i]!=i+1 return i+1' },
      442: { TECHNIQUE: 'for i: idx=abs(nums[i])-1; if nums[idx]<0: out.push_back(idx+1); nums[idx]*=-1' },
    },
    helixDelta: { 128: 'Set + count from start', 41: 'Swap to correct index', 442: 'Negate at index' },
    autopsies: [
      {
        cause: 'LC 41: not using index hashing',
        wrong: 'sort + scan',
        testCase: 'O(n) time constraint',
        fix: 'Swap each x to index x-1 in one pass',
      },
    ],
    sayIt: ['Index as hash: swap x to nums[x-1] (41), negate nums[abs(x)-1] (442), set for consecutive (128).'],
  }),

  'lru-cache': e({
    xray: [
      { text: 'Design a data structure that supports **get** and **put** in O(1)', kind: 'goal' },
      { text: 'When the cache reaches capacity, evict the **least recently used** item', kind: 'constraint' },
    ],
    budget: ['cache', 'oNTime'],
    slottedTemplate: `// Doubly-linked list + unordered_map
{{CORE_LOGIC}}`,
    slots: [{ id: 'CORE_LOGIC', label: 'Core logic' }],
    slotFills: {
      146: { CORE_LOGIC: 'Node struct {key,val,prev,next}; map<int,Node*>; head/tail sentinels; moveToHead(node); popTail()' },
      460: { CORE_LOGIC: 'Plus: unordered_map<int,int> keyFreq; unordered_map<int,list<int>> freqKeys; int minFreq' },
    },
    helixDelta: { 146: 'LRU: singly used list', 460: 'LFU: + frequency map per key' },
    autopsies: [
      {
        cause: 'Using STL list (splice is O(1) but interview expects manual DLL)',
        wrong: 'list<pair<int,int>> lst;',
        testCase: 'interview asks manual implementation',
        fix: 'Implement Node struct with prev/next pointers',
      },
    ],
    sayIt: ['LRU: doubly-linked list for O(1) remove + map for O(1) get.'],
  }),

  'design-hashmap': e({
    xray: [
      { text: 'Design a **hash map** from scratch without built-in libraries', kind: 'goal' },
    ],
    budget: ['cache', 'oNTime'],
    slottedTemplate: `vector<list<pair<int,int>>> buckets;
int hash(int key) { return key % size; }
{{METHODS}}`,
    slots: [{ id: 'METHODS', label: 'Methods' }],
    slotFills: {
      706: { METHODS: 'put: iterate chain; if key exists update else push; get: iterate chain return val or -1; remove: iterate chain erase' },
      705: { METHODS: 'add: if !contains push; remove: erase from chain; contains: iterate chain' },
    },
    helixDelta: { 705: 'HashSet (bool)', 706: 'HashMap (int→int)' },
    autopsies: [
      {
        cause: 'Not handling collisions',
        wrong: 'array of (key,val) pairs without chaining',
        testCase: 'colliding keys',
        fix: 'Array of buckets — each bucket is a linked list chain',
      },
    ],
    sayIt: ['Design hash map → bucket array + chaining (list per bucket).'],
  }),

  'specialized-dict': e({
    xray: [
      { text: 'Design a data structure that supports **addWord** and **search** with **.** wildcard', kind: 'goal' },
    ],
    budget: ['cache', 'stringInput'],
    slottedTemplate: `struct TrieNode { TrieNode* next[26]; bool isWord; };
{{TRIE_IMPL}}`,
    slots: [{ id: 'TRIE_IMPL', label: 'Trie logic' }],
    slotFills: {
      211: { TRIE_IMPL: 'addWord: traverse/create nodes; search: DFS with . wildcard (try all 26 children)' },
      588: { TRIE_IMPL: 'Dir struct with map<string,Dir*> dirs and map<string,string> files; ls, mkdir, addContentToFile, readContentFromFile' },
    },
    helixDelta: { 211: 'Trie + wildcard DFS', 588: 'File system trie' },
    autopsies: [
      {
        cause: 'Not handling . wildcard in search',
        wrong: 'simple char-by-char traversal without backtracking',
        testCase: 'search "c.t"',
        fix: 'For dot, DFS all 26 children at that position',
      },
    ],
    sayIt: ['Wildcard search → Trie + DFS. File system → map-based tree.'],
  }),

  'multi-pass': e({
    xray: [
      { text: 'Find all **10-letter repeated sequences** in DNA', kind: 'goal' },
      { text: '**Deep copy** a linked list where each node has a **random pointer**', kind: 'goal' },
      { text: '**Clone** an undirected graph with neighbors list', kind: 'goal' },
    ],
    budget: ['frequency', 'listNode'],
    slottedTemplate: `// Pass 1: {{PASS1}}
// Pass 2: {{PASS2}}`,
    slots: [
      { id: 'PASS1', label: 'Pass 1' },
      { id: 'PASS2', label: 'Pass 2' },
    ],
    slotFills: {
      187: { PASS1: 'seen.insert(substr(i,10))', PASS2: 'if seen.count(sub) → repeated.insert(sub)' },
      138: { PASS1: 'map old->new: for cur: m[cur]=new Node(cur->val)', PASS2: 'for cur: m[cur]->next=m[cur->next]; m[cur]->random=m[cur->random]' },
      133: { PASS1: 'DFS: if(!n) return null; if(m.count(n)) return m[n]; create copy; recurse neighbors', PASS2: '(handled in DFS recursion)' },
    },
    helixDelta: { 187: 'Two-set pass', 138: 'Old→new map + wire', 133: 'DFS with cache' },
    autopsies: [
      {
        cause: 'LC 138: shallow copy — shared references instead of deep copy',
        wrong: 'newNode = oldNode; // pointer copy',
        testCase: 'modifying original affects copy',
        fix: 'Deep copy all nodes in pass 1, wire connections in pass 2',
      },
    ],
    sayIt: ['Multi-pass: build map first, then use it.', 'Clone graph/list: pass 1 create nodes, pass 2 wire edges.'],
  }),

  'rolling-hash': e({
    xray: [
      { text: 'Find index of first occurrence of **needle** in **haystack**', kind: 'goal' },
      { text: 'Find **longest duplicate substring** in a string', kind: 'goal' },
    ],
    budget: ['rollingHash', 'stringInput'],
    slottedTemplate: `long base = 31, mod = 1e9+7, pow = 1, h = 0, need = 0;
{{INIT}}
for (int i = m; i < n; i++) {
    h = (h * base - haystack[i-m] * pow % mod + mod) % mod;
    h = (h + haystack[i]) % mod;
    if (h == need) {{MATCH}};
}`,
    slots: [
      { id: 'INIT', label: 'Init needle hash' },
      { id: 'MATCH', label: 'Match action' },
    ],
    slotFills: {
      28: { INIT: 'for i<m: need=(need*base+needle[i])%mod; h=(h*base+haystack[i])%mod; pow=(pow*base)%mod', MATCH: 'if check full equality return i-m+1' },
      1044: { INIT: '(binary search on length) for each len: compute rolling hash of first len chars', MATCH: 'seen.count(h) → record candidate' },
      718: { INIT: '(binary search) rolling hash on both arrays', MATCH: 'hash appears in both' },
    },
    helixDelta: { 28: 'Rabin-Karp substring', 1044: 'Binary search + rolling hash', 718: 'Binary search on both arrays' },
    autopsies: [
      {
        cause: 'Hash collision without verification',
        wrong: 'return true immediately on hash match',
        testCase: 'colliding strings',
        fix: 'Verify with direct equality after hash match (or double hash)',
      },
    ],
    sayIt: ['Rolling hash: h = h*base + char, slide window O(1).', 'Handle collisions with direct compare on hash match.'],
  }),

  'char-sig': e({
    xray: [
      { text: 'Check if two strings are **anagrams**', kind: 'goal' },
      { text: 'Find all start indices of **anagrams** of p in s', kind: 'goal' },
    ],
    budget: ['stringInput', 'frequency'],
    slottedTemplate: `vector<int> freq(26, 0);
{{SIGNATURE_LOGIC}}`,
    slots: [{ id: 'SIGNATURE_LOGIC', label: 'Logic' }],
    slotFills: {
      242: { SIGNATURE_LOGIC: 'for c in s: freq[c-\'a\']++; for c in t: freq[c-\'a\']--; if any !=0 return false; return true' },
      49: { SIGNATURE_LOGIC: 'string key(26,0); for c in s: key[c-\'a\']++; groups[key].push_back(s)' },
      438: { SIGNATURE_LOGIC: 'for c in p: need[c-\'a\']++; for r in s: have[s[r]-\'a\']++; if r>=|p|: have[s[r-|p|]-\'a\']--; if have==need: push start' },
    },
    helixDelta: { 242: 'Simple anagram compare', 49: 'Group via signature key', 438: 'Sliding window anagram' },
    autopsies: [
      {
        cause: 'Using map instead of int[26] for lowercase',
        wrong: 'unordered_map<char,int>',
        testCase: '26 keys only',
        fix: 'int freq[26] = {0}; — array is faster',
      },
    ],
    sayIt: ['Char signature → freq array of 26 as hash key.', 'Anagram in string → fixed window + freq compare.'],
  }),

  'pattern-hash': e({
    xray: [
      { text: 'Given a chemical **formula**, count each atom with nesting', kind: 'goal' },
      { text: 'Return list of corrected spellings using **vowel normalization**', kind: 'goal' },
    ],
    budget: ['stringInput', 'frequency'],
    slottedTemplate: `{{PATTERN_HASH_LOGIC}}`,
    slots: [{ id: 'PATTERN_HASH_LOGIC', label: 'Logic' }],
    slotFills: {
      726: { PATTERN_HASH_LOGIC: 'stack<unordered_map<string,int>>; push on (, pop on ) merging counts; parse elem name + digits' },
      966: { PATTERN_HASH_LOGIC: 'three maps: exact(wordlist), lower(wordlist), vowel(wildcard vowel mask)' },
      187: { PATTERN_HASH_LOGIC: 'unordered_map<string,int> freq; for i to n-10: freq[s.substr(i,10)]++; collect where >=2' },
    },
    helixDelta: { 726: 'Stack of maps for nesting', 966: 'Multi-map normalization', 187: 'Substring frequency' },
    autopsies: [
      {
        cause: 'LC 726: not handling multi-digit counts',
        wrong: 'int num = formula[i] - \'0\'; // single digit',
        testCase: 'H2O (2 is single, but Mg12 needs multi)',
        fix: 'while(isdigit) num = num*10 + c - \'0\'',
      },
    ],
    sayIt: ['Formula parsing → stack of hash maps for nesting.', 'Spellcheck → multiple normalization layers.'],
  }),
}

export function getEnhancement(leafId: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[leafId]
}
