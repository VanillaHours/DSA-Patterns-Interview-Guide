import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <algorithm>
#include <climits>
using namespace std;

`

// ── Direct Lookup ──────────────────────────────────────────────────

export const elementPresenceLeaf = leaf('elem-presence', 'Element Presence', 'blue', {
  template: `${CPP_HEADER}bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}`,
  problems: [
    { id: 217, title: 'Contains Duplicate', slug: 'contains-duplicate', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (set insert + count).' },
    { id: 219, title: 'Contains Duplicate II', slug: 'contains-duplicate-ii', companies: ['GOOGLE', 'META'], lineChanges: 'Line 5: if seen.count(x) && i-seen[x]<=k.', variationCode: 'if (seen.count(nums[i]) && i - seen[nums[i]] <= k) return true; seen[nums[i]] = i;' },
    { id: 1, title: 'Two Sum', slug: 'two-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 5: complement = target - nums[i]; if seen.count(complement) return indices.', variationCode: 'int need = target - nums[i]; if (seen.count(need)) return {seen[need], i}; seen[nums[i]] = i;' },
  ],
  pitfalls: ['❌ Using hash map on sorted input when opposite pointers would work (LC 167).', '❌ Forgetting to check indices for LC 219 (must be within k).'],
  edgeCases: [{ input: 'single element array', breaks: 'loop runs once, never seen before — OK' }, { input: 'duplicate at end', breaks: 'scans entire array — still O(n)' }],
  interviewTip: '💡 "Contains duplicate" → unordered_set. "Two sum unsorted" → unordered_map complement.',
})

export const charFreqLeaf = leaf('char-freq', 'Character Frequency', 'teal', {
  template: `${CPP_HEADER}bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;
    for (char c : t) if (--freq[c] < 0) return false;
    return true;
}`,
  problems: [
    { id: 242, title: 'Valid Anagram', slug: 'valid-anagram', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (freq inc/dec).' },
    { id: 383, title: 'Ransom Note', slug: 'ransom-note', companies: ['AMAZON', 'APPLE'], lineChanges: 'Line 5: count chars in magazine; line 6: decrement for ransom, fail if <0.', variationCode: 'for (char c : magazine) freq[c]++; for (char c : ransomNote) if (--freq[c] < 0) return false;' },
    { id: 49, title: 'Group Anagrams', slug: 'group-anagrams', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 5: key = sorted string or char count signature; value = list of anagrams.', variationCode: 'string key = s; sort(key.begin(), key.end()); groups[key].push_back(s);' },
  ],
  pitfalls: ['❌ Using unordered_map when array of 26 works for lowercase letters.', '❌ Sorting strings for group-anagrams key — char count tuple is O(n·L) instead of O(n·L log L).'],
  edgeCases: [{ input: 'empty strings', breaks: 'equal length 0 → true' }, { input: 'different case', breaks: 'tolower if case-insensitive' }],
  interviewTip: '💡 "Anagram" → char frequency array or sorted string key.',
})

export const freqBucketingLeaf = leaf('freq-bucket', 'Frequency Bucketing', 'blue', {
  template: `${CPP_HEADER}vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [num, count] : freq) buckets[count].push_back(num);
    vector<int> out;
    for (int i = (int)buckets.size()-1; i >= 0 && (int)out.size() < k; i--)
        for (int x : buckets[i]) { out.push_back(x); if ((int)out.size() == k) break; }
    return out;
}`,
  problems: [
    { id: 347, title: 'Top K Frequent', slug: 'top-k-frequent-elements', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (bucket sort by frequency).' },
    { id: 451, title: 'Sort By Frequency', slug: 'sort-characters-by-frequency', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line 8: build string from buckets, repeated char count times.', variationCode: 'string out; for (int i = buckets.size()-1; i >= 0; i--) for (char c : buckets[i]) out.append(i, c);' },
    { id: 1394, title: 'Lucky Integer', slug: 'find-lucky-integer-in-an-array', companies: ['GOOGLE'], lineChanges: 'Line 7: check freq[x]==x (lucky number).', variationCode: 'int ans = -1; for (auto& [num, cnt] : freq) if (num == cnt) ans = max(ans, num);' },
  ],
  pitfalls: ['❌ Using sort O(n log n) when bucket sort O(n) works.', '❌ Off-by-one: buckets size = nums.size()+1 for count up to n.'],
  interviewTip: '💡 "Top K frequent" → freq map + bucket sort (count as index).',
})

export const heavyHittersLeaf = leaf('heavy-hitters', 'Heavy Hitters', 'teal', {
  template: `${CPP_HEADER}int majorityElement(vector<int>& nums) {
    int cand = nums[0], count = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] == cand) count++;
        else if (--count == 0) { cand = nums[i]; count = 1; }
    }
    return cand;
}`,
  problems: [
    { id: 169, title: 'Majority Element', slug: 'majority-element', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (Boyer-Moore voting — O(1) space, no hash map needed!).', variationCode: '// Boyer-Moore: cancel pairs, majority survives' },
    { id: 229, title: 'Majority Element II', slug: 'majority-element-ii', companies: ['GOOGLE', 'META'], lineChanges: 'Line: two candidates; count both; verify counts pass n/3.', variationCode: 'int c1=0,c2=0,ct1=0,ct2=0; for (int x:nums){ if(x==c1)ct1++; else if(x==c2)ct2++; else if(!ct1)c1=x,ct1=1; else if(!ct2)c2=x,ct2=1; else ct1--,ct2--; }' },
  ],
  pitfalls: ['❌ Using hash map when Boyer-Moore majority vote gives O(1) space.', '❌ Forgetting to verify candidate counts in majority element II.'],
  interviewTip: '💡 "Majority element (>n/2)" → Boyer-Moore voting, O(1) space.',
})

export const sumBasedLeaf = leaf('sum-based', 'Sum-Based Matching', 'blue', {
  template: `${CPP_HEADER}vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
  problems: [
    { id: 1, title: 'Two Sum', slug: 'two-sum', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–8: as-is (complement lookup).' },
    { id: 560, title: 'Subarray Sum K', slug: 'subarray-sum-equals-k', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: prefix sum + map[prefixSum - target] count; map[0]=1 init.', variationCode: 'unordered_map<int,int> seen; seen[0]=1; int sum=0,ans=0; for(int x:nums){ sum+=x; ans+=seen[sum-k]; seen[sum]++; }' },
    { id: 523, title: 'Cont Subarray Sum', slug: 'continuous-subarray-sum', companies: ['META', 'GOOGLE'], lineChanges: 'Line: store remainder mod k; if same remainder reappears with gap≥2.', variationCode: 'int rem = sum % k; if (seen.count(rem)) { if (i - seen[rem] >= 2) return true; } else seen[rem] = i;' },
  ],
  pitfalls: ['❌ Using map when array is sorted — use opposite pointers (LC 167) instead.', '❌ LC 560: forgetting to increment seen[sum] after checking, and initializing seen[0]=1.'],
  edgeCases: [{ input: 'target zero / k=0', breaks: 'prefix same; need sum==0 check or mod k for k=0' }],
  interviewTip: '💡 "Two sum unsorted" → complement map. "Subarray sum k" → prefix sum map.',
})

export const propertyMatchLeaf = leaf('property-match', 'Property-Based Matching', 'teal', {
  template: `${CPP_HEADER}int findPairs(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    int ans = 0;
    for (auto& [num, count] : freq) {
        if (k == 0) { if (count > 1) ans++; }
        else if (freq.count(num + k)) ans++;
    }
    return ans;
}`,
  problems: [
    { id: 532, title: 'K-diff Pairs', slug: 'k-diff-pairs-in-an-array', companies: ['AMAZON'], lineChanges: 'Lines 5–9: as-is (freq map handles duplicates + two-pointer would need sort).' },
    { id: 2006, title: 'Count K-diff Absolute', slug: 'count-number-of-pairs-with-absolute-difference-k', companies: ['AMAZON'], lineChanges: 'Line: same freq map; count freq[x]*freq[x+k] pairs.', variationCode: 'if (freq.count(num+k)) ans += freq[num] * freq[num+k]; // each pair counted once' },
  ],
  pitfalls: ['❌ Sorting + two pointers when hash map is simpler for unsorted property pairs.', '❌ Double-counting when k != 0 — only count num + k, not both directions.'],
  interviewTip: '💡 "Count pairs with property" → freq map, check num+k existence.',
})

// ── Bijection ─────────────────────────────────────────────────────

export const bijectionLeaf = leaf('bijection', 'Bijection & Mapping Integrity', 'teal', {
  template: `${CPP_HEADER}bool isIsomorphic(string s, string t) {
    unordered_map<char,char> s2t, t2s;
    for (int i = 0; i < (int)s.size(); i++) {
        char a = s[i], b = t[i];
        if (s2t.count(a) && s2t[a] != b) return false;
        if (t2s.count(b) && t2s[b] != a) return false;
        s2t[a] = b; t2s[b] = a;
    }
    return true;
}`,
  problems: [
    { id: 205, title: 'Isomorphic Strings', slug: 'isomorphic-strings', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (dual map for bijection).' },
    { id: 290, title: 'Word Pattern', slug: 'word-pattern', companies: ['AMAZON', 'META'], lineChanges: 'Line: same dual map, split string by spaces for t tokens.', variationCode: 'istringstream iss(t); string word; for(char c:pattern){ iss>>word; if(s2t.count(c)&&s2t[c]!=word||t2s.count(word)&&t2s[word]!=c) return false; s2t[c]=word; t2s[word]=c; }' },
      { id: 246, title: 'Strobogrammatic Number', slug: 'strobogrammatic-number', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Map: 0↔0, 1↔1, 6↔9, 8↔8; check symmetry from ends.', variationCode: "unordered_map<char,char> m={{'0','0'},{'1','1'},{'6','9'},{'8','8'},{'9','6'}}; int l=0,r=s.size()-1; while(l<=r){ if(!m.count(s[l])||m[s[l]]!=s[r]) return false; l++;r--; }" },
  ],
  pitfalls: ['❌ Single map (char→char) without reverse check — two chars mapping to same target char.', '❌ Word pattern: not splitting string correctly or missing word count match.'],
  interviewTip: '💡 "Isomorphic/pattern" → dual hash maps for one-to-one mapping integrity.',
})

// ── Hash Map for Structure ────────────────────────────────────────

export const groupingLeaf = leaf('grouping', 'Grouping & Classification', 'green', {
  template: `${CPP_HEADER}vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> out;
    for (auto& [k, v] : groups) out.push_back(v);
    return out;
}`,
  problems: [
    { id: 49, title: 'Group Anagrams', slug: 'group-anagrams', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–9: as-is (sorted string key → groups).' },
    { id: 249, title: 'Group Shifted Strings', slug: 'group-shifted-strings', companies: ['GOOGLE', 'META'], lineChanges: 'Line 5: key = cyclic difference tuple between chars.', variationCode: 'string key; for(int i=1;i<s.size();i++) key += to_string((s[i]-s[i-1]+26)%26) + ",";' },
    { id: 1282, title: 'Group People', slug: 'group-the-people-given-the-group-size-they-belong-to', companies: ['GOOGLE'], lineChanges: 'Line 5: map[groupSize] → vector of ids; when full push to result.', variationCode: 'unordered_map<int,vector<int>> g; for(int i=0;i<n;i++){ g[gs[i]].push_back(i); if(g[gs[i]].size()==gs[i]){ out.push_back(g[gs[i]]); g.erase(gs[i]); } }' },
  ],
  pitfalls: ['❌ Sorting each string O(L log L) — char count tuple key is faster O(L).', '❍ But sorting is simpler to code; optimize if asked.'],
  interviewTip: '💡 "Group by property" → hash key = normalized form, value = list of items.',
})

export const prefixSumLeaf = leaf('prefix-sum-map', 'Prefix Sums with Hash Map', 'lime', {
  template: `${CPP_HEADER}int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> seen;
    seen[0] = 1;
    int sum = 0, ans = 0;
    for (int x : nums) {
        sum += x;
        ans += seen[sum - k];
        seen[sum]++;
    }
    return ans;
}`,
  problems: [
    { id: 560, title: 'Subarray Sum K', slug: 'subarray-sum-equals-k', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–10: as-is (prefix sum map).' },
    { id: 525, title: 'Contiguous Array', slug: 'contiguous-array', companies: ['GOOGLE', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: treat 0 as -1; seek same prefix sum value (longest gap).', variationCode: 'int sum=0,ans=0; unordered_map<int,int> first; first[0]=-1; for(int i=0;i<n;i++){ sum+=nums[i]==0?-1:1; if(first.count(sum)) ans=max(ans,i-first[sum]); else first[sum]=i; }' },
    { id: 1248, title: 'Nice Subarrays', slug: 'count-number-of-nice-subarrays', companies: ['AMAZON'], lineChanges: 'Line: treat odd as 1, even as 0; same prefix sum approach as 560.', variationCode: 'for (int x : nums) { sum += (x % 2 == 1); ans += seen[sum - k]; seen[sum]++; }' },
  ],
  pitfalls: ['❌ Forgetting seen[0] = 1 initial prefix count.', '❌ LC 525: tracking longest (store first occurrence), not count.'],
  interviewTip: '💡 "Subarray sum / balance / nice" → prefix sum + hash map for O(n).',
})

export const multiMapLeaf = leaf('multi-map', 'Multi-Map Applications', 'lime', {
  template: `${CPP_HEADER}vector<string> subdomainVisits(vector<string>& cpdomains) {
    unordered_map<string, int> visits;
    for (string& entry : cpdomains) {
        int i = entry.find(' ');
        int count = stoi(entry.substr(0, i));
        string domain = entry.substr(i + 1);
        while (true) {
            visits[domain] += count;
            int dot = domain.find('.');
            if (dot == string::npos) break;
            domain = domain.substr(dot + 1);
        }
    }
    vector<string> out;
    for (auto& [d, c] : visits) out.push_back(to_string(c) + " " + d);
    return out;
}`,
  problems: [
    { id: 811, title: 'Subdomain Visit', slug: 'subdomain-visit-count', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 5–14: as-is (split domain, accumulate all subdomains).' },
    { id: 981, title: 'Time Map', slug: 'time-based-key-value-store', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Map<string, vector<pair<int,string>>> + binary search on timestamp for get().', variationCode: 'unordered_map<string, vector<pair<int,string>>> m; void set(string k,int t,string v){m[k].push_back({t,v});} string get(string k,int t){auto& v=m[k]; auto it=upper_bound(v.begin(),v.end(),pair<int,string>(t,"")); return it==v.begin()?"":prev(it)->second;}' },
    { id: 1152, title: 'User Visit Pattern', slug: 'analyze-user-website-visit-pattern', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Group by user, sort by timestamp, generate 3-pages combos, count.', variationCode: 'unordered_map<string,vector<pair<int,string>>> users; // user→(time,site)' },
  ],
  pitfalls: ['❌ Not using binary search for Time Map get() — O(n) scan is too slow.', '❌ Subdomain: missing the top-level domain loop termination.'],
  interviewTip: '💡 "Multi-map / time-based" → hash map of vectors, binary search on timestamp.',
})

// ── Index as Hash Key ─────────────────────────────────────────────

export const indexHashLeaf = leaf('index-hash', 'Index as Hash Key', 'amber', {
  template: `${CPP_HEADER}int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int best = 0;
    for (int x : s) {
        if (!s.count(x - 1)) {
            int len = 1;
            while (s.count(x + len)) len++;
            best = max(best, len);
        }
    }
    return best;
}`,
  problems: [
    { id: 128, title: 'Longest Consecutive', slug: 'longest-consecutive-sequence', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–11: as-is (set + count consecutive from start).' },
    { id: 41, title: 'First Missing Positive', slug: 'first-missing-positive', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: index sort — swap nums[i] with nums[nums[i]-1]; scan for first missing.', variationCode: 'for(int i=0;i<n;i++) while(nums[i]>0&&nums[i]<=n&&nums[nums[i]-1]!=nums[i]) swap(nums[i],nums[nums[i]-1]); for(int i=0;i<n;i++) if(nums[i]!=i+1) return i+1; return n+1;' },
    { id: 442, title: 'Find All Duplicates', slug: 'find-all-duplicates-in-an-array', companies: ['AMAZON', 'META'], lineChanges: 'Line: index → negate nums[abs(x)-1]; if already negative, it is duplicate.', variationCode: 'for(int i=0;i<n;i++){ int idx=abs(nums[i])-1; if(nums[idx]<0) out.push_back(idx+1); nums[idx]*=-1; }' },
  ],
  pitfalls: ['❌ Sorting for LC 128 when O(n) hash set scan works.', '❌ LC 41: not using index hashing (x belongs at index x-1).', '❌ LC 442: modifying array while iterating — use abs(x).'],
  interviewTip: '💡 "O(n) time, O(1) space on array" → index as hash key (negate or swap).',
})

// ── Specialized Hash Structures ───────────────────────────────────

export const lruCacheLeaf = leaf('lru-cache', 'LRU Cache', 'purple', {
  template: `struct Node { int key, val; Node *prev, *next; Node(int k,int v): key(k),val(v),prev(nullptr),next(nullptr){} };

class LRUCache {
    int cap;
    unordered_map<int, Node*> map;
    Node *head, *tail;
    void moveToHead(Node* n) {
        if (n == head) return;
        n->prev->next = n->next;
        if (n == tail) tail = n->prev;
        else n->next->prev = n->prev;
        n->next = head; head->prev = n; n->prev = nullptr; head = n;
    }
    void popTail() {
        map.erase(tail->key);
        tail = tail->prev; tail->next = nullptr;
    }
public:
    LRUCache(int c) : cap(c), head(nullptr), tail(nullptr) {}
    int get(int key) {
        if (!map.count(key)) return -1;
        auto n = map[key]; moveToHead(n); return n->val;
    }
    void put(int key, int val) {
        if (map.count(key)) {
            auto n = map[key]; n->val = val; moveToHead(n);
        } else {
            auto n = new Node(key, val);
            map[key] = n;
            if (!head) { head = tail = n; }
            else { n->next = head; head->prev = n; head = n; }
            if ((int)map.size() > cap) popTail();
        }
    }
};`,
  problems: [
    { id: 146, title: 'LRU Cache', slug: 'lru-cache', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Full class as above.' },
    { id: 460, title: 'LFU Cache', slug: 'lfu-cache', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], lineChanges: 'Add frequency map + minFreq tracker; evict least frequently used.', variationCode: 'unordered_map<int,int> keyFreq; unordered_map<int,list<int>> freqKeys; int minFreq = 0; // evict lowest freq, then LRU within that freq' },
  ],
  pitfalls: ['❌ Using STL list (O(1) splice is fine), but interview may ask manual doubly-linked list.', '❌ LFU: forgetting to update minFreq after eviction or get().'],
  interviewTip: '💡 "LRU Cache" → doubly-linked list (for O(1) remove) + hash map (for O(1) lookup).',
})

export const designHashMapLeaf = leaf('design-hashmap', 'Design HashMap / HashSet', 'pink', {
  template: `class MyHashMap {
    vector<list<pair<int,int>>> buckets;
    int size = 1000;
    int hash(int key) { return key % size; }
public:
    MyHashMap() : buckets(size) {}
    void put(int key, int val) {
        auto& chain = buckets[hash(key)];
        for (auto& [k,v] : chain) if (k == key) { v = val; return; }
        chain.push_back({key, val});
    }
    int get(int key) {
        auto& chain = buckets[hash(key)];
        for (auto& [k,v] : chain) if (k == key) return v;
        return -1;
    }
    void remove(int key) {
        auto& chain = buckets[hash(key)];
        chain.remove_if([key](auto& p){ return p.first == key; });
    }
};`,
  problems: [
    { id: 705, title: 'Design HashSet', slug: 'design-hashset', companies: ['AMAZON', 'META'], lineChanges: 'Similar: bool buckets; remove bool return, chain = list<int>.', variationCode: 'vector<list<int>> buckets; void add(int key) { if(!contains(key)) buckets[hash(key)].push_back(key); }' },
    { id: 706, title: 'Design HashMap', slug: 'design-hashmap', companies: ['AMAZON', 'META'], lineChanges: 'Lines 5–21: as-is.' },
  ],
  pitfalls: ['❌ Fixed bucket size with O(n) chaining — resize/rehash for scalability.', '❌ Not handling collisions (chaining or open addressing).'],
  interviewTip: '💡 "Design hash map" → array of buckets (list chains), hash function, chaining.',
})

export const specializedDictLeaf = leaf('specialized-dict', 'Specialized Dictionaries', 'pink', {
  template: `class TrieNode {
public:
    TrieNode* next[26];
    bool isWord;
    TrieNode() : isWord(false) { fill(begin(next), end(next), nullptr); }
    ~TrieNode() { for (auto* n : next) delete n; }
};

class WordDictionary {
    TrieNode* root;
    bool search(TrieNode* n, string& w, int i) {
        if (!n) return false;
        if (i == (int)w.size()) return n->isWord;
        if (w[i] != '.') return search(n->next[w[i]-'a'], w, i+1);
        for (int c = 0; c < 26; c++)
            if (search(n->next[c], w, i+1)) return true;
        return false;
    }
public:
    WordDictionary() : root(new TrieNode()) {}
    void addWord(string w) {
        TrieNode* cur = root;
        for (char c : w) { if (!cur->next[c-'a']) cur->next[c-'a']=new TrieNode(); cur=cur->next[c-'a']; }
        cur->isWord = true;
    }
    bool search(string w) { return search(root, w, 0); }
};`,
  problems: [
    { id: 588, title: 'In-Memory File System', slug: 'design-in-memory-file-system', companies: ['AMAZON', 'META', 'GOOGLE'], lineChanges: 'Trie-like dir/file tree; ls, mkdir, addContentToFile, readContentFromFile.', variationCode: 'struct Dir { map<string, Dir*> dirs; map<string, string> files; };' },
    { id: 211, title: 'Add & Search Word', slug: 'design-add-and-search-words-data-structure', companies: ['META', 'GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'As above (Trie with . wildcard DFS).' },
  ],
  pitfalls: ['❌ Not handling "." wildcard in Trie search — need DFS over all children.', '❌ File system: confusion between dirs and files at same path level.'],
  interviewTip: '💡 "Search with wildcard" → Trie + DFS for dot. "File system" → Trie-style tree.',
})

// ── Multi-Pass Hashing ────────────────────────────────────────────

export const multiPassLeaf = leaf('multi-pass', 'Multi-Pass Hashing', 'orange', {
  template: `${CPP_HEADER}vector<string> findRepeatedDna(string s) {
    unordered_set<string> seen, repeated;
    for (int i = 0; i + 10 <= (int)s.size(); i++) {
        string sub = s.substr(i, 10);
        if (seen.count(sub)) repeated.insert(sub);
        else seen.insert(sub);
    }
    return vector<string>(repeated.begin(), repeated.end());
}`,
  problems: [
    { id: 187, title: 'Repeated DNA', slug: 'repeated-dna-sequences', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Line 4–8: as-is (two-pass / rolling hash).' },
    { id: 138, title: 'Copy Random List', slug: 'copy-list-with-random-pointer', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Pass 1: map old→new node; Pass 2: wire next and random via map.', variationCode: 'unordered_map<Node*,Node*> m; auto* cur=head; while(cur){ m[cur]=new Node(cur->val); cur=cur->next; } cur=head; while(cur){ m[cur]->next=m[cur->next]; m[cur]->random=m[cur->random]; cur=cur->next; }' },
    { id: 133, title: 'Clone Graph', slug: 'clone-graph', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Same as 138: DFS/BFS + map old→new node.', variationCode: 'unordered_map<Node*,Node*> m; function<Node*(Node*)> dfs=[&](Node* n){ if(!n) return (Node*)nullptr; if(m.count(n)) return m[n]; auto* c=new Node(n->val); m[n]=c; for(auto* nb:n->neighbors) c->neighbors.push_back(dfs(nb)); return c; };' },
  ],
  pitfalls: ['❌ 138/133: deep clone without map → shared references between original and copy.', '❌ LC 187: O(n*10) is fine; rolling hash for O(n) if substring large.'],
  interviewTip: '💡 "Deep copy with random/neighbors" → pass 1 create all nodes, pass 2 wire connections via old→new map.',
})

// ── String Hashing ────────────────────────────────────────────────

export const rollingHashLeaf = leaf('rolling-hash', 'Rolling Hash', 'green', {
  template: `${CPP_HEADER}int strStr(string haystack, string needle) {
    int n = (int)haystack.size(), m = (int)needle.size();
    if (m > n) return -1;
    long h = 0, need = 0, pow = 1, base = 31, mod = 1e9+7;
    for (int i = 0; i < m; i++) {
        need = (need * base + needle[i]) % mod;
        h = (h * base + haystack[i]) % mod;
        pow = (pow * base) % mod;
    }
    if (h == need) return 0;
    for (int i = m; i < n; i++) {
        h = (h * base - haystack[i-m] * pow % mod + mod) % mod;
        h = (h + haystack[i]) % mod;
        if (h == need) return i - m + 1;
    }
    return -1;
}`,
  problems: [
    { id: 28, title: 'Find First Occurrence', slug: 'find-the-index-of-the-first-occurrence-in-a-string', companies: ['AMAZON', 'GOOGLE', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 5–16: as-is (Rabin-Karp rolling hash).' },
    { id: 1044, title: 'Longest Dup Substring', slug: 'longest-duplicate-substring', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Binary search on length + rolling hash set to find duplicate.', variationCode: 'unordered_set<long> seen; for (int i=0;i+len<=n;i++) { long h = rollingHash(s,i,len); if (seen.count(h)) { /* store candidate */ } seen.insert(h); }' },
    { id: 718, title: 'Max Length Repeated', slug: 'maximum-length-of-repeated-subarray', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Binary search on len + rolling hash on both arrays, check overlap.', variationCode: '// rolling hash on A and B, then check if any hash appears in both' },
  ],
  pitfalls: ['❌ Hash collisions — use double hash (two moduli) if needed.', '❌ Rabin-Karp: forgetting to add mod before % to avoid negative.'],
  interviewTip: '💡 "Find substring / repeated substring" → rolling hash (Rabin-Karp) for O(n).',
})

export const charSigLeaf = leaf('char-sig', 'Character Signatures', 'teal', {
  template: `${CPP_HEADER}vector<int> findAnagrams(string s, string p) {
    if (p.size() > s.size()) return {};
    vector<int> need(26), have(26), out;
    for (char c : p) need[c-'a']++;
    for (int r = 0; r < (int)s.size(); r++) {
        have[s[r]-'a']++;
        if (r >= (int)p.size()) have[s[r-p.size()]-'a']--;
        if (r >= (int)p.size()-1 && have == need) out.push_back(r-(int)p.size()+1);
    }
    return out;
}`,
  problems: [
    { id: 242, title: 'Valid Anagram', slug: 'valid-anagram', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 4–5: freq array[26]; inc s, dec t; check all zero.' },
    { id: 49, title: 'Group Anagrams', slug: 'group-anagrams', companies: ['AMAZON', 'GOOGLE', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Key = char frequency tuple (26 zeros).', variationCode: 'string key(26,0); for(char c:s) key[c-\'a\']++; groups[key].push_back(s);' },
    { id: 438, title: 'Find Anagrams', slug: 'find-all-anagrams-in-a-string', companies: ['GOOGLE', 'META', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 5–9: as-is (fixed window + freq compare).' },
  ],
  pitfalls: ['❌ Using map<char,int> instead of int[26] for lowercase — array is faster.', '❌ Group anagrams: using sorted string as key (O(L log L)) vs char count tuple (O(L)).'],
  interviewTip: '💡 "Anagram / signature" → char frequency array of 26 as hash key.',
})

export const patternHashLeaf = leaf('pattern-hash', 'Pattern Hashing', 'teal', {
  template: `${CPP_HEADER}string countOfAtoms(string formula) {
    int n = (int)formula.size();
    stack<unordered_map<string,int>> stk;
    stk.push({});
    for (int i = 0; i < n; ) {
        if (formula[i] == '(') { stk.push({}); i++; }
        else if (formula[i] == ')') {
            i++; int num = 0;
            while (i < n && isdigit(formula[i])) num = num*10 + formula[i++]-'0';
            auto top = stk.top(); stk.pop();
            for (auto& [elem, cnt] : top) stk.top()[elem] += cnt * max(num, 1);
        } else {
            string elem; elem += formula[i++];
            while (i < n && islower(formula[i])) elem += formula[i++];
            int num = 0;
            while (i < n && isdigit(formula[i])) num = num*10 + formula[i++]-'0';
            stk.top()[elem] += max(num, 1);
        }
    }
    map<string,int> sorted(stk.top().begin(), stk.top().end());
    string out;
    for (auto& [e,c] : sorted) { out += e; if (c>1) out += to_string(c); }
    return out;
}`,
  problems: [
    { id: 726, title: 'Number of Atoms', slug: 'number-of-atoms', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 5–20: as-is (stack of hash maps, parenthesized formula parsing).' },
    { id: 966, title: 'Vowel Spellchecker', slug: 'vowel-spellchecker', companies: ['GOOGLE'], lineChanges: 'Three maps: original, lowercased, vowel-normalized.', variationCode: 'unordered_set<string> exact(wordlist.begin(),wordlist.end()); unordered_map<string,string> lower, vowel; // build originals, mask vowels' },
    { id: 187, title: 'Repeated DNA', slug: 'repeated-dna-sequences', companies: ['AMAZON', 'GOOGLE', 'META'], lineChanges: 'Substring hash map with bit encoding or string key.', variationCode: 'unordered_map<string,int> seen; for i to n-10: string sub=s.substr(i,10); seen[sub]++; for each: if seen[sub]==2 add to result' },
  ],
  pitfalls: ['❌ LC 726: missing digit parsing after closing paren — default 1 counts.', '❌ LC 966: vowel normalization must replace all vowels with same placeholder.'],
  interviewTip: '💡 "Parse formula with nesting" → stack of hash maps. "Spellcheck" → multiple normalization maps.',
})
