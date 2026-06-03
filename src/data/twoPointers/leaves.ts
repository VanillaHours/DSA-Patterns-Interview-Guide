import { leaf } from './helpers'

const CPP_HEADER = `#include <vector>
#include <string>
#include <algorithm>
#include <cctype>
#include <cmath>
#include <climits>
using namespace std;

`

export const targetSumLeaf = leaf('target-sum', 'Target Sum Variants', 'blue', {
  template: `${CPP_HEADER}vector<int> twoSumSorted(vector<int>& nums, int target) {
    int l = 0, r = (int)nums.size() - 1;
    while (l < r) {
        long sum = (long)nums[l] + nums[r];
        if (sum == target) return {l + 1, r + 1};
        if (sum < target) l++;
        else r--;
    }
    return {};
}`,
  problems: [
    { id: 167, title: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 5–7: as-is (classic template).' },
    { id: 15, title: '3Sum', slug: '3sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Add outer for(i); inner template on i+1..n-1; skip dup i.', variationCode: 'for (int i = 0; i < n; i++) { if (i && nums[i]==nums[i-1]) continue; int l=i+1,r=n-1,need=0-nums[i]; /* inner while */ }' },
    { id: 18, title: '4Sum', slug: '4sum', companies: ['AMAZON', 'META'], lineChanges: 'Line: add second outer loop j after i.', variationCode: 'for j in i+1..n-1 { skip dup j; inner l=j+1,r=n-1 }' },
    { id: 1099, title: 'Two Sum Less Than K', slug: 'two-sum-less-than-k', companies: ['GOOGLE'], lineChanges: 'Line 6: if (sum<k) ans=max(ans,sum); always l++ (both ends move in).', variationCode: 'if (sum < k) { ans = max(ans, (int)sum); l++; } else r--;' },
  ],
  pitfalls: ['❌ Hash map when array is already sorted — wastes the O(n) two-pointer win.', '❌ Forgetting to skip duplicate i in k-sum — duplicate triplets in output.', '❌ LeetCode trap: all-negative 3Sum — use long for sum.'],
  edgeCases: [{ input: 'all negatives', breaks: 'sum underflows int — use long' }, { input: 'duplicate values', breaks: 'k-sum needs skip-dup on outer index' }],
  interviewTip: '💡 When you see "sorted" + "sum" → say "opposite pointers" immediately.',
})

export const palindromeLeaf = leaf('palindrome', 'Palindrome Detection', 'teal', {
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
    { id: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', companies: ['META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–5: skip non-alphanumeric; line 6: tolower compare.' },
    { id: 680, title: 'Valid Palindrome II', slug: 'valid-palindrome-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line 6: on mismatch, try skip l OR skip r once (helper with bool used).', variationCode: 'auto check = [&](int l, int r, bool used) { ... on mismatch if (!used) return check(l+1,r,true)||check(l,r-1,true); };' },
  ],
  pitfalls: ['❌ Comparing without skipping spaces/punctuation.', '❌ Case-sensitive compare — use tolower.'],
  edgeCases: [{ input: 'empty string', breaks: 'loop never runs → true (valid)' }],
  interviewTip: '💡 "Palindrome" on string → opposite ends, skip junk chars.',
})

export const numericLeaf = leaf('numeric', 'Numeric Constraints', 'teal', {
  template: `${CPP_HEADER}bool judgeSquareSum(int c) {
    long l = 0, r = (long)sqrt(c);
    while (l <= r) {
        long sq = l*l + r*r;
        if (sq == c) return true;
        if (sq < c) l++;
        else r--;
    }
    return false;
}`,
  problems: [
    { id: 633, title: 'Sum of Square Numbers', slug: 'sum-of-square-numbers', companies: ['AMAZON'], lineChanges: 'Line 5: cur = l*l + r*r; line 6: compare to c.', variationCode: 'long sq = l*l + r*r; if (sq == c) return true;' },
    { id: 611, title: 'Valid Triangle Number', slug: 'valid-triangle-number', companies: ['GOOGLE'], lineChanges: 'Sort nums; fix k from right; l=0,r=k-1; count while nums[l]+nums[r]>nums[k].', variationCode: 'sort(nums); int ans=0; for(int k=n-1;k>=2;k--){ int l=0,r=k-1; while(l<r){ if(nums[l]+nums[r]>nums[k]){ ans+=r-l; r--; } else l++; } }' },
  ],
  pitfalls: ['❌ int overflow on l*l — use long.', '❌ Triangle: forget to sort first.'],
  edgeCases: [{ input: 'c = 0', breaks: '0+0=0 edge case' }],
  interviewTip: '💡 Square-sum or triangle count → sort + opposite pointers.',
})

export const volumeLeaf = leaf('volume', 'Volume Optimization', 'blue', {
  template: `${CPP_HEADER}int maxArea(vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, best = 0;
    while (l < r) {
        best = max(best, min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++;
        else r--;
    }
    return best;
}`,
  problems: [
    { id: 11, title: 'Container With Most Water', slug: 'container-with-most-water', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4–6: as-is.' },
    { id: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 4–6: track maxL/maxR OR two-pointer with l/r water formula.', variationCode: 'int l=0,r=n-1,ml=0,mr=0,ans=0; while(l<r){ ml=max(ml,h[l]); mr=max(mr,h[r]); ans+= ml<mr ? ml-h[l++] : mr-h[r--]; }' },
  ],
  pitfalls: ['❌ Moving both pointers — only move the shorter side.', '❌ Brute force O(n²) when greedy O(n) exists.'],
  edgeCases: [{ input: 'two elements', breaks: 'single iteration — still works' }],
  interviewTip: '💡 "Maximize area between lines" → drop shorter pointer.',
})

export const greedyPairLeaf = leaf('greedy-pair', 'Greedy Pairing', 'teal', {
  template: `${CPP_HEADER}int numBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int l = 0, r = (int)people.size() - 1, boats = 0;
    while (l <= r) {
        if (people[l] + people[r] <= limit) l++;
        r--;
        boats++;
    }
    return boats;
}`,
  problems: [
    { id: 1877, title: 'Minimize Maximum Pair Sum', slug: 'minimize-maximum-pair-sum-in-array', companies: ['AMAZON'], lineChanges: 'Line 5–6: always pair l with r; track max(nums[l]+nums[r]); both l++, r--.', variationCode: 'ans = max(ans, nums[l]+nums[r]); l++; r--;' },
    { id: 881, title: 'Boats to Save People', slug: 'boats-to-save-people', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 5–7: as-is (if light+heavy fit, l++).'},
  ],
  interviewTip: '💡 "Minimum boats / pair sum" → sort + pair from both ends.',
})

export const kDiffLeaf = leaf('k-diff', 'Difference Control (K-diff)', 'teal', {
  template: `${CPP_HEADER}int findPairs(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    int l = 0, r = 0, ans = 0;
    while (r < (int)nums.size()) {
        while (l < r && (long)nums[r] - nums[l] > k) l++;
        if (l < r && nums[r] - nums[l] == k) ans++;
        r++;
    }
    return ans;
}`,
  problems: [
    { id: 532, title: 'K-diff Pairs', slug: 'k-diff-pairs-in-an-array', companies: ['AMAZON'], lineChanges: 'Line 6: shrink l while diff>k; line 7: count when diff==k (watch duplicates).', variationCode: 'while (l < r && nums[r]-nums[l] > k) l++; if (l < r && nums[r]-nums[l]==k) ans++;' },
  ],
  pitfalls: ['❌ Forgetting to sort — two pointers need order.', '❌ Double-counting duplicate pairs.'],
  interviewTip: '💡 "Pairs with difference k" → sort + sliding l.',
})

export const nsumLeaf = leaf('nsum', 'N-Sum Problems', 'blue', {
  template: `${CPP_HEADER}vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> out;
    int n = (int)nums.size();
    for (int i = 0; i < n; i++) {
        if (i && nums[i] == nums[i-1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            long s = (long)nums[i] + nums[l] + nums[r];
            if (s == 0) { out.push_back({nums[i],nums[l],nums[r]}); while(l<r&&nums[l]==nums[l+1])l++; while(l<r&&nums[r]==nums[r-1])r--; l++; r--; }
            else if (s < 0) l++;
            else r--;
        }
    }
    return out;
}`,
  problems: [
    { id: 15, title: '3Sum', slug: '3sum', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 5–14: as-is.' },
    { id: 16, title: '3Sum Closest', slug: '3sum-closest', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line 10: track closest |s-target| instead of ==0.', variationCode: 'if (abs(s-target) < abs(best-target)) best = s;' },
    { id: 18, title: '4Sum', slug: '4sum', companies: ['AMAZON', 'META'], lineChanges: 'Add outer j loop between i and inner l,r.', variationCode: 'for (int j = i+1; j < n; j++) { skip dup j; inner l=j+1,r=n-1; }' },
  ],
  interviewTip: '💡 "Find all triplets/quadruplets" → fix outer + opposite inner.',
})

export const multiplicityLeaf = leaf('multiplicity', 'Multiplicity Counting', 'teal', {
  template: `${CPP_HEADER}int threeSumMulti(vector<int>& A, int target) {
    sort(A.begin(), A.end());
    long ans = 0;
    int n = (int)A.size();
    for (int i = 0; i < n; i++) {
        int l = i + 1, r = n - 1;
        while (l < r) {
            int s = A[i] + A[l] + A[r];
            if (s == target) {
                if (A[l] == A[r]) { long c = r-l+1; ans += c*(c-1)/2; break; }
                long lc = 1, rc = 1;
                while (l+1<r && A[l]==A[l+1]) { lc++; l++; }
                while (r-1>l && A[r]==A[r-1]) { rc++; r--; }
                ans = (ans + lc*rc) % 1000000007;
                l++; r--;
            } else if (s < target) l++;
            else r--;
        }
    }
    return (int)ans;
}`,
  problems: [
    { id: 923, title: '3Sum With Multiplicity', slug: '3sum-with-multiplicity', companies: ['GOOGLE'], lineChanges: 'Lines 10–16: multiply run-length combos on match (not list triplets).', variationCode: 'ans += lc * rc; // count combinations, mod 1e9+7' },
  ],
  pitfalls: ['❌ Listing triplets instead of counting — TLE.', '❌ Forgetting mod 10⁹+7.'],
  interviewTip: '💡 "Count tuples with multiplicity" → same 3Sum loop, combo math on match.',
})

export const cycleLeaf = leaf('cycle', 'Cycle Detection', 'green', {
  template: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };

bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
  problems: [
    { id: 141, title: 'Linked List Cycle', slug: 'linked-list-cycle', companies: ['AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 8: return slow==fast.' },
    { id: 142, title: 'Cycle II', slug: 'linked-list-cycle-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'After meet: slow=head; walk both 1× — meeting point is cycle start.', variationCode: 'slow = head; while (slow != fast) { slow = slow->next; fast = fast->next; } return slow;' },
    { id: 287, title: 'Find Duplicate', slug: 'find-the-duplicate-number', companies: ['GOOGLE', 'AMAZON', 'APPLE'], mustKnow: true, lineChanges: 'Treat index i as node i; next = nums[i] (Floyd on array).', variationCode: 'int slow=nums[0], fast=nums[0]; do { slow=nums[slow]; fast=nums[nums[fast]]; } while(slow!=fast);' },
    { id: 202, title: 'Happy Number', slug: 'happy-number', companies: ['GOOGLE'], lineChanges: 'Floyd on digit-square transformation map.', variationCode: 'auto next = [](int n){ int s=0; while(n){ s+=(n%10)*(n%10); n/=10; } return s; };' },
  ],
  interviewTip: '💡 "Cycle" or "duplicate 1..n O(1) space" → Floyd tortoise & hare.',
})

export const positionLeaf = leaf('position', 'Position Finding', 'lime', {
  template: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };

ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
  problems: [
    { id: 876, title: 'Middle of List', slug: 'middle-of-the-linked-list', companies: ['AMAZON', 'META'], lineChanges: 'Line 8: return slow (even length → second middle).' },
    { id: 19, title: 'Remove Nth From End', slug: 'remove-nth-node-from-end-of-list', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Start fast n+1 ahead; when fast null, slow->next = slow->next->next.', variationCode: 'ListNode dummy(0,&head); slow=fast=&dummy; for(int i=0;i<=n;i++) fast=fast->next; while(fast){ slow=slow->next; fast=fast->next; } slow->next=slow->next->next;' },
    { id: 160, title: 'Intersection', slug: 'intersection-of-two-linked-lists', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Walk A then B / B then A — pointers meet at intersection.', variationCode: 'ListNode *a=headA,*b=headB; while(a!=b){ a=a?a->next:headB; b=b?b->next:headA; } return a;' },
  ],
  interviewTip: '💡 "Nth from end" → fast n+1 ahead. "Intersection" → A+B walk.',
})

export const structuralLeaf = leaf('structural', 'Structural Modifications', 'lime', {
  template: `// 1) Find mid with fast/slow  2) Reverse second half  3) Merge or compare
struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };`,
  problems: [
    { id: 234, title: 'Palindrome List', slug: 'palindrome-linked-list', companies: ['META', 'AMAZON'], lineChanges: 'Mid + reverse 2nd half + compare vals with first half.', variationCode: 'auto mid = middleNode(head); auto rev = reverseList(mid); while(rev){ if(rev->val!=head->val) return false; rev=rev->next; head=head->next; }' },
    { id: 143, title: 'Reorder List', slug: 'reorder-list', companies: ['GOOGLE', 'META'], lineChanges: 'Mid + reverse 2nd half + weave L0,Ln,L1,Ln+1…', variationCode: 'ListNode *s=head,*f=head,*p=nullptr; /* find mid, reverse, merge alternate */' },
  ],
  interviewTip: '💡 "Reorder / palindrome list O(1) space" → find mid, reverse half, merge.',
})

export const fixedWinLeaf = leaf('fixed-win', 'Fixed Size Windows', 'green', {
  template: `${CPP_HEADER}double findMaxAverage(vector<int>& nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int best = sum;
    for (int r = k; r < (int)nums.size(); r++) {
        sum += nums[r] - nums[r - k];
        best = max(best, sum);
    }
    return best / (double)k;
}`,
  problems: [
    { id: 643, title: 'Max Avg Subarray I', slug: 'maximum-average-subarray-i', companies: ['META', 'AMAZON'], lineChanges: 'Lines 5–7: slide window — add nums[r], subtract nums[r-k].' },
    { id: 1343, title: 'Subarray Size K Threshold', slug: 'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold', companies: ['AMAZON'], lineChanges: 'Line 7: count++ when sum >= threshold*k.', variationCode: 'if (sum >= threshold * k) ans++;' },
  ],
  interviewTip: '💡 "Exactly k length" → fixed window, no while-shrink loop.',
})

export const expandWinLeaf = leaf('expand-win', 'Expansion-Based (Longest)', 'lime', {
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
    { id: 904, title: 'Fruit Into Baskets', slug: 'fruit-into-baskets', companies: ['GOOGLE'], lineChanges: 'Line 6: invalid = map.size()>2.', variationCode: 'while (freq.size() > 2) { freq[nums[l]]--; if(!freq[nums[l]]) freq.erase(nums[l]); l++; }' },
    { id: 340, title: 'At Most K Distinct', slug: 'longest-substring-with-at-most-k-distinct-characters', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line 6: invalid = map.size()>k.', variationCode: 'while ((int)cnt.size() > k) { /* shrink l */ }' },
    { id: 1004, title: 'Max Ones III', slug: 'max-consecutive-ones-iii', companies: ['GOOGLE', 'META'], lineChanges: 'Line 6: invalid = zeros in window > k.', variationCode: 'while (zeroCount > k) { if (!nums[l]) zeroCount--; l++; }' },
  ],
  interviewTip: '💡 "Longest subarray with at most K …" → expand r, shrink l when invalid.',
})

export const contractWinLeaf = leaf('contract-win', 'Contraction-Based (Shortest)', 'lime', {
  template: `${CPP_HEADER}int minSubArrayLen(int target, vector<int>& nums) {
    int l = 0, sum = 0, ans = INT_MAX;
    for (int r = 0; r < (int)nums.size(); r++) {
        sum += nums[r];
        while (sum >= target) {
            ans = min(ans, r - l + 1);
            sum -= nums[l++];
        }
    }
    return ans == INT_MAX ? 0 : ans;
}`,
  problems: [
    { id: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 6: valid = window contains all chars of t; shrink while valid.', variationCode: 'while (formed == required) { ans = min(ans, r-l+1); /* remove s[l] */ l++; }' },
    { id: 209, title: 'Min Subarray Sum', slug: 'minimum-size-subarray-sum', companies: ['META', 'AMAZON'], lineChanges: 'Lines 5–8: as-is (valid = sum>=target).' },
    { id: 1234, title: 'Balanced String', slug: 'replace-the-substring-for-balanced-string', companies: ['GOOGLE'], lineChanges: 'Line 6: valid = window has excess of every over-represented char.', variationCode: 'while (validWindow) { ans = min(ans, r-l+1); shrink l; }' },
  ],
  interviewTip: '💡 "Shortest containing all …" → expand until valid, shrink while valid.',
})

export const freqWinLeaf = leaf('freq-win', 'Frequency-Based Matching', 'green', {
  template: `${CPP_HEADER}vector<int> findAnagrams(string s, string p) {
    if (p.size() > s.size()) return {};
    vector<int> need(26), have(26), out;
    for (char c : p) need[c-'a']++;
    for (int r = 0; r < (int)s.size(); r++) {
        have[s[r]-'a']++;
        if (r >= (int)p.size()) have[s[r-p.size()]-'a']--;
        if (r >= (int)p.size()-1 && have == need) out.push_back(r - (int)p.size() + 1);
    }
    return out;
}`,
  problems: [
    { id: 438, title: 'Find Anagrams', slug: 'find-all-anagrams-in-a-string', companies: ['GOOGLE', 'META', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 7–9: fixed window |p|; compare freq vectors.' },
    { id: 567, title: 'Permutation in String', slug: 'permutation-in-string', companies: ['MICROSOFT', 'AMAZON'], lineChanges: 'Same template; return true on first freq match.', variationCode: 'if (have == need) return true; // early exit' },
    { id: 1100, title: 'K-Length No Repeat', slug: 'find-k-length-substrings-with-no-repeated-characters', companies: ['GOOGLE'], lineChanges: 'Fixed k window; valid = all freq<=1.', variationCode: 'while (r-l+1 > k) shrink; if (valid) out.push_back(l);' },
  ],
  interviewTip: '💡 "Anagram/permutation in s" → fixed |p| window + freq array.',
})

export const removalLeaf = leaf('removal', 'Removal Operations', 'green', {
  template: `${CPP_HEADER}int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int w = 1;
    for (int r = 1; r < (int)nums.size(); r++)
        if (nums[r] != nums[w-1]) nums[w++] = nums[r];
    return w;
}`,
  problems: [
    { id: 26, title: 'Remove Dup I', slug: 'remove-duplicates-from-sorted-array', companies: ['AMAZON', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line 5: keep if nums[r]!=nums[w-1].' },
    { id: 80, title: 'Remove Dup II', slug: 'remove-duplicates-from-sorted-array-ii', companies: ['GOOGLE'], lineChanges: 'Line 5: keep if w<2 OR nums[r]!=nums[w-2].', variationCode: 'if (w < 2 || nums[r] != nums[w-2]) nums[w++] = nums[r];' },
    { id: 27, title: 'Remove Element', slug: 'remove-element', companies: ['AMAZON'], lineChanges: 'Line 5: keep if nums[r]!=val.', variationCode: 'if (nums[r] != val) nums[w++] = nums[r];' },
  ],
  interviewTip: '💡 "Modify array in-place, return new length" → read/write pointers.',
})

export const movementLeaf = leaf('movement', 'Movement Operations', 'lime', {
  template: `${CPP_HEADER}void moveZeroes(vector<int>& nums) {
    int w = 0;
    for (int r = 0; r < (int)nums.size(); r++)
        if (nums[r] != 0) nums[w++] = nums[r];
    while (w < (int)nums.size()) nums[w++] = 0;
}`,
  problems: [
    { id: 283, title: 'Move Zeroes', slug: 'move-zeroes', companies: ['META', 'AMAZON', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3–5: filter non-zero; lines 5–6: fill zeros.' },
    { id: 905, title: 'Sort By Parity', slug: 'sort-array-by-parity', companies: ['GOOGLE'], lineChanges: 'Line 4: keep if nums[r]%2==0 (even to front).', variationCode: 'if (nums[r] % 2 == 0) swap(nums[w++], nums[r]); // or filter evens' },
  ],
  interviewTip: '💡 "Move zeroes / sort parity" → filter with w, optional fill.',
})

export const transformLeaf = leaf('transform', 'Transformation Operations', 'lime', {
  template: `${CPP_HEADER}void reverseString(vector<char>& s) {
    int l = 0, r = (int)s.size() - 1;
    while (l < r) swap(s[l++], s[r--]);
}`,
  problems: [
    { id: 344, title: 'Reverse String', slug: 'reverse-string', companies: ['AMAZON', 'MICROSOFT'], lineChanges: 'Line 3: swap s[l], s[r].' },
    { id: 345, title: 'Reverse Vowels', slug: 'reverse-vowels-of-a-string', companies: ['GOOGLE'], lineChanges: 'Lines 2–3: skip non-vowel before swap.', variationCode: 'while (l<r && !isVowel(s[l])) l++; while (l<r && !isVowel(s[r])) r--; swap(s[l++],s[r--]);' },
  ],
  interviewTip: '💡 "Reverse in-place" → opposite ends swap (not read/write).',
})

export const basicSubLeaf = leaf('basic-sub', 'Basic Subsequence', 'green', {
  template: `${CPP_HEADER}bool isSubsequence(string s, string t) {
    int j = 0;
    for (int i = 0; i < (int)s.size() && j < (int)t.size(); i++)
        if (s[i] == t[j]) j++;
    return j == (int)t.size();
}`,
  problems: [
    { id: 392, title: 'Is Subsequence', slug: 'is-subsequence', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Lines 3–4: advance j only on match.' },
    { id: 792, title: 'Matching Subsequences', slug: 'number-of-matching-subsequences', companies: ['GOOGLE'], lineChanges: 'Bucket words by first char; scan s once with per-word pointers.', variationCode: 'map<char, deque<pair<string,int>>> waiting; // advance on char match' },
  ],
  interviewTip: '💡 "Is subsequence" → one pointer on t, scan s.',
})

export const patternSubLeaf = leaf('pattern-sub', 'Pattern Matching with Rules', 'lime', {
  template: `${CPP_HEADER}bool camelMatch(string query, string pattern) {
    int qi = 0, pi = 0;
    while (qi < (int)query.size() && pi < (int)pattern.size()) {
        if (query[qi] == pattern[pi]) { qi++; pi++; }
        else if (isupper(query[qi])) return false;
        else qi++;
    }
    while (pi < (int)pattern.size() && islower(pattern[pi])) pi++;
    return pi == (int)pattern.size();
}`,
  problems: [
    { id: 1023, title: 'Camelcase Matching', slug: 'camelcase-matching', companies: ['GOOGLE'], lineChanges: 'Lines 5–7: uppercase must match pattern; lowercase skipped in query.', variationCode: 'else if (isupper(query[qi])) return false; else qi++;' },
    { id: 408, title: 'Valid Abbreviation', slug: 'valid-word-abbreviation', companies: ['GOOGLE', 'FACEBOOK'], lineChanges: 'Parse multi-digit skip counts in abbr; match word chars.', variationCode: 'if (isdigit(abbr[j])) { skip = skip*10 + (abbr[j]-\'0\'); j++; i += skip; }' },
  ],
  interviewTip: '💡 Pattern with skips/digits → dual pointers + parse rules.',
})

export const dnfLeaf = leaf('dnf', 'Dutch National Flag (3-way Partition)', 'amber', {
  template: `${CPP_HEADER}void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = (int)nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[hi--]);
    }
}`,
  problems: [
    { id: 75, title: 'Sort Colors', slug: 'sort-colors', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 4–7: as-is (0→lo, 1→mid, 2→hi).'},
  ],
  pitfalls: ['❌ Two-pointer swap when mid==2 — do not advance mid after swap with hi.'],
  interviewTip: '💡 "Array of 0,1,2 only" → Dutch national flag, 3 pointers.',
})

export const quickPartLeaf = leaf('quick-part', 'Quick Sort Partition (2-way)', 'orange', {
  template: `${CPP_HEADER}int partition(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}`,
  problems: [
    { id: 215, title: 'Kth Largest', slug: 'kth-largest-element-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Partition; recurse only side containing k (quickselect).', variationCode: 'int p = partition(a, lo, hi); if (p == k) return a[p]; if (p < k) lo = p+1; else hi = p-1;' },
    { id: 912, title: 'Sort Array', slug: 'sort-an-array', companies: ['AMAZON'], lineChanges: 'Recurse both sides of pivot (full quicksort).', variationCode: 'qsort(a, lo, p-1); qsort(a, p+1, hi);' },
  ],
  interviewTip: '💡 "Kth largest" → partition once, recurse one side.',
})

export const mergeLeaf = leaf('merge', 'Merge Operations', 'purple', {
  template: `struct ListNode { int val; ListNode *next; ListNode(int x): val(x), next(nullptr) {} };

ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}`,
  problems: [
    { id: 88, title: 'Merge Sorted Array', slug: 'merge-sorted-array', companies: ['AMAZON', 'MICROSOFT'], lineChanges: 'Fill nums1 from end (i=m+n-1) to avoid overwrite.', variationCode: 'int i=m+n-1; while(m>=0&&n>=0) nums1[i--]= nums1[m]>nums2[n]?nums1[m--]:nums2[n--];' },
    { id: 21, title: 'Merge Two Lists', slug: 'merge-two-sorted-lists', companies: ['AMAZON', 'GOOGLE', 'META'], mustKnow: true, lineChanges: 'Lines 6–10: as-is.' },
    { id: 23, title: 'Merge k Lists', slug: 'merge-k-sorted-lists', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Use min-heap of list heads OR divide-and-conquer merge.', variationCode: 'priority_queue<ListNode*, vector<ListNode*>, cmp> pq; // pop min, push next' },
  ],
  interviewTip: '💡 Two sorted inputs → one pointer each, pick smaller.',
})

export const intersectLeaf = leaf('intersect', 'Intersection & Union', 'pink', {
  template: `${CPP_HEADER}vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
    sort(nums1.begin(), nums1.end());
    sort(nums2.begin(), nums2.end());
    vector<int> out;
    int i = 0, j = 0;
    while (i < (int)nums1.size() && j < (int)nums2.size()) {
        if (nums1[i] == nums2[j]) { out.push_back(nums1[i]); i++; j++; }
        else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return out;
}`,
  problems: [
    { id: 349, title: 'Intersection I', slug: 'intersection-of-two-arrays', companies: ['META', 'AMAZON'], lineChanges: 'Line 8: on match push once; skip duplicates in both.', variationCode: 'while (i+1<n && nums1[i]==nums1[i+1]) i++; // unique only' },
    { id: 350, title: 'Intersection II', slug: 'intersection-of-two-arrays-ii', companies: ['AMAZON'], lineChanges: 'Line 8: keep all matches (no skip dup).'},
    { id: 986, title: 'Interval Intersections', slug: 'interval-list-intersections', companies: ['GOOGLE', 'META', 'FACEBOOK'], mustKnow: true, lineChanges: 'Compare interval ends; advance list with smaller end.', variationCode: 'lo = max(A[i][0], B[j][0]); hi = min(A[i][1], B[j][1]); if (lo<=hi) push; if (A[i][1]<B[j][1]) i++; else j++;' },
  ],
  interviewTip: '💡 Sorted intersection → two pointers, advance smaller.',
})

export const compareLeaf = leaf('compare-scan', 'Comparative Scanning', 'pink', {
  template: `${CPP_HEADER}bool backspaceCompare(string s, string t) {
    auto build = [](string& str) {
        string out;
        for (char c : str) {
            if (c == '#') { if (!out.empty()) out.pop_back(); }
            else out.push_back(c);
        }
        return out;
    };
    return build(s) == build(t);
}`,
  problems: [
    { id: 165, title: 'Compare Versions', slug: 'compare-version-numbers', companies: ['AMAZON', 'MICROSOFT'], lineChanges: 'Parse dot segments with two pointers; compare as integers.', variationCode: 'while (i<n || j<m) { int a=0,b=0; while(i<n&&v1[i]!=\'.\') a=a*10+v1[i++]-\'0\'; ... compare a,b; skip dots; }' },
    { id: 844, title: 'Backspace Compare', slug: 'backspace-string-compare', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Simulate from end with O(1) space OR stack (template uses stack).', variationCode: 'int i=s.size()-1,j=t.size()-1,bs=0,bt=0; while(i>=0||j>=0){ /* skip # counts */ }' },
  ],
  interviewTip: '💡 Two strings with parsing rules → simulate or two pointers from end.',
})
