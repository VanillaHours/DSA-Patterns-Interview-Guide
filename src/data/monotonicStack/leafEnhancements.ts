import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Increasing Stack ──────────────────────────────────────

  'ms-strict-inc': e({
    xray: [
      { text: '**Strictly increasing**: pop while nums[i] <= st.top()', kind: 'signal' },
      { text: 'Each element pushed once, popped once — **O(n)**', kind: 'constraint' },
    ],
    budget: ['strict increase', 'pop on <='],
    slottedTemplate: `stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] <= nums[st.top()]) {
        // nums[i] breaks strict increase
        st.pop();
    }
    // now st.top() is previous smaller (if any)
    st.push(/* SLOT: push */);
}`,
    slots: [
      { id: 'PUSH', label: 'What to push onto stack', hint: 'i (index)' },
    ],
    slotFills: {
      496: { PUSH: 'i' },
      739: { PUSH: 'i' },
    },
    helixOrder: [496, 739],
    helixDelta: {
      496: 'NGE I: strict increasing stack. Pop on <=. Map nums2 values to their NGE.',
      739: 'Daily Temperatures: strict increasing. Pop when warmer found. days = i - st.top().',
    },
    autopsies: [
      {
        cause: 'Using < instead of <= for strict increase',
        wrong: 'while (!st.empty() && nums[i] < nums[st.top()])',
        testCase: 'nums = [2, 2] → equal values don\'t pop → stack has [2, 2] (not strict)',
        fix: 'Strict increase: pop on <=. Equal values should pop.',
      },
    ],
    sayIt: [
      'Strictly increasing: pop while nums[i] <= st.top(). Equal values are popped.',
    ],
  }),

  'ms-non-dec': e({
    xray: [
      { text: '**Non-decreasing**: pop while nums[i] < st.top()', kind: 'signal' },
      { text: 'Allows **equal values** to stay in stack', kind: 'goal' },
    ],
    budget: ['non-decreasing', 'allow equals'],
    slottedTemplate: `stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] < nums[st.top()]) {
        st.pop();
    }
    st.push(/* SLOT: pushIdx */);
}`,
    slots: [
      { id: 'PUSH_IDX', label: 'Index to push', hint: 'i' },
    ],
    slotFills: {
      1475: { PUSH_IDX: 'i' },
    },
    helixOrder: [1475],
    helixDelta: {
      1475: 'Final Prices: non-decreasing stack. Pop when prices[i] < st.top(). Discount = prices[i].',
    },
    autopsies: [
      {
        cause: 'Using <= (strict) instead of < (non-decreasing)',
        wrong: 'nums[i] <= nums[st.top()] // pops equal values',
        testCase: 'Equal prices should stay in stack for discount lookup',
        fix: 'Non-decreasing: pop on < only. Equal values remain.',
      },
    ],
    sayIt: [
      'Non-decreasing: pop on < only. Equal values remain in stack for later matching.',
    ],
  }),

  // ── Decreasing Stack ──────────────────────────────────────

  'ms-strict-dec': e({
    xray: [
      { text: '**Strictly decreasing**: pop while nums[i] >= st.top()', kind: 'signal' },
    ],
    budget: ['strict decrease', 'pop on >='],
    slottedTemplate: `stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] >= nums[st.top()]) {
        st.pop();
    }
    st.push(/* SLOT: pushIdx */);
}`,
    slots: [
      { id: 'PUSH_IDX', label: 'Index to push', hint: 'i' },
    ],
    slotFills: {
      503: { PUSH_IDX: 'i' },
    },
    helixOrder: [503],
    helixDelta: {
      503: 'NGE II: strict decreasing stack for circular NGE. Pop on >=.',
    },
    autopsies: [
      {
        cause: 'Confusing decreasing with increasing stack logic',
        wrong: 'nums[i] <= nums[st.top()] // increasing stack condition',
        testCase: 'NGE needs decreasing: pop when current is GREATER than top',
        fix: 'Decreasing: pop while nums[i] >= st.top(). Current is greater → pop.',
      },
    ],
    sayIt: [
      'Strictly decreasing: pop while nums[i] >= st.top(). Used for NGE.',
    ],
  }),

  'ms-non-inc': e({
    xray: [
      { text: '**Non-increasing**: pop while nums[i] > st.top()', kind: 'signal' },
      { text: 'Equal values stay in stack', kind: 'goal' },
    ],
    budget: ['non-increasing', 'pop on >'],
    slottedTemplate: `stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        st.pop();
    }
    st.push(/* SLOT: pushIdx */);
}`,
    slots: [
      { id: 'PUSH_IDX', label: 'Index to push', hint: 'i' },
    ],
    slotFills: {
      1475: { PUSH_IDX: 'i' },
    },
    helixOrder: [1475],
    helixDelta: {
      1475: 'Non-increasing variant: pop on > only. Equal values kept for later discount matching.',
    },
    autopsies: [
      {
        cause: 'Using >= instead of >',
        wrong: 'nums[i] >= nums[st.top()] // removes equal values',
        testCase: 'Equal values should stay for non-increasing',
        fix: 'Pop on > only. Equal values: do not pop.',
      },
    ],
    sayIt: [
      'Non-increasing: pop on > only. Equal values remain — useful for discount problems.',
    ],
  }),

  // ── Next Greater / Smaller ────────────────────────────────

  'ms-nge': e({
    xray: [
      { text: '**Decreasing stack**: pop while nums[i] > st.top()', kind: 'signal' },
      { text: 'Assign ans[st.top()] = nums[i] when popped', kind: 'goal' },
    ],
    budget: ['nge', 'decreasing stack'],
    slottedTemplate: `vector<int> nge(/* SLOT: size */, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        nge[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}`,
    slots: [
      { id: 'SIZE', label: 'Number of elements', hint: 'n' },
    ],
    slotFills: {
      496: { SIZE: 'n' },
      739: { SIZE: 'temperatures.size()' },
    },
    helixOrder: [496, 739],
    helixDelta: {
      496: 'NGE I: decreasing stack, pop on >. Map subset nums1 to their NGE from nums2.',
      739: 'Daily Temperatures: NGE variant. Answer = i - st.top() (days to wait).',
    },
    autopsies: [
      {
        cause: 'Using increasing stack for NGE',
        wrong: 'nums[i] < nums[st.top()] // would keep larger element in stack',
        testCase: 'nums = [1, 3, 2] → increasing stack keeps 1 on top, 3 never pops 1',
        fix: 'NGE needs decreasing: pop when current > stack top, so larger element is answer',
      },
    ],
    sayIt: [
      'NGE: decreasing stack. When current > top, pop and assign ans = current. Default -1 if no greater element.',
    ],
  }),

  'ms-nse': e({
    xray: [
      { text: '**Increasing stack**: pop while nums[i] < st.top()', kind: 'signal' },
    ],
    budget: ['nse', 'increasing stack'],
    slottedTemplate: `vector<int> nse(/* SLOT: size */, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] < nums[st.top()]) {
        nse[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}`,
    slots: [
      { id: 'SIZE', label: 'Number of elements', hint: 'n' },
    ],
    slotFills: {
      503: { SIZE: 'n' },
    },
    helixOrder: [503],
    helixDelta: {
      503: 'NSE: increasing stack, pop on <. Mirrors NGE logic with opposite comparison.',
    },
    autopsies: [
      {
        cause: 'Using decreasing stack for NSE (mirror of NGE error)',
        wrong: 'nums[i] > nums[st.top()] // decreasing, pop on >',
        testCase: 'NSE needs smaller element — use increasing stack, pop on <',
        fix: 'NSE: increasing stack. Pop when current < top. Smaller element found.',
      },
    ],
    sayIt: [
      'NSE: increasing stack. Pop when current < top. Symmetric to NGE.',
    ],
  }),

  'ms-nge-circular': e({
    xray: [
      { text: 'Iterate **2*n** virtual indices; idx = i % n', kind: 'signal' },
      { text: 'Only push indices during **first n** iterations', kind: 'constraint' },
    ],
    budget: ['circular', '2n pass'],
    slottedTemplate: `int n = nums.size();
vector<int> ans(n, -1);
stack<int> st;
for (int i = 0; i < 2 * n; i++) {
    int idx = i % /* SLOT: mod */;
    while (!st.empty() && nums[idx] > nums[st.top()]) {
        ans[st.top()] = nums[idx];
        st.pop();
    }
    if (i < n) st.push(idx);
}`,
    slots: [
      { id: 'MOD', label: 'Modulo for circular index', hint: 'n' },
    ],
    slotFills: {
      503: { MOD: 'n' },
    },
    helixOrder: [503],
    helixDelta: {
      503: 'Circular NGE: 2n pass. Only push first n. Second pass resolves wrap-around NGE.',
    },
    autopsies: [
      {
        cause: 'Pushing all 2n indices instead of only n',
        wrong: 'st.push(idx) // unconditionally — never stops',
        testCase: 'All equal values — stack grows to 2n; infinite-like behavior',
        fix: 'Only push indices during first n iterations (if i < n).',
      },
    ],
    sayIt: [
      'Circular NGE: pass 2n times, push only first n. Second pass finds wrap-around greater elements.',
    ],
  }),

  // ── Previous Greater / Smaller ────────────────────────────

  'ms-pge': e({
    xray: [
      { text: '**Decreasing stack**: pop on >=, then stack top is PGE', kind: 'signal' },
      { text: 'Answer before pushing current index', kind: 'goal' },
    ],
    budget: ['pge', 'decreasing stack left'],
    slottedTemplate: `vector<int> pge(/* SLOT: size */, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] >= nums[st.top()]) st.pop();
    if (!st.empty()) pge[i] = nums[st.top()];
    st.push(i);
}`,
    slots: [
      { id: 'SIZE', label: 'Number of elements', hint: 'n' },
    ],
    slotFills: {
      1944: { SIZE: 'heights.size()' },
    },
    helixOrder: [1944],
    helixDelta: {
      1944: 'Visible People: PGE via decreasing stack. Visible = stack size before push + 1.',
    },
    autopsies: [
      {
        cause: 'Assigning to popped element instead of current',
        wrong: 'pge[st.top()] = nums[i] // that\'s NGE, not PGE',
        testCase: 'PGE is for current element, not the popped one',
        fix: 'PGE: stack top (after pop) is the previous greater for current i. Assign pge[i].',
      },
    ],
    sayIt: [
      'PGE: decreasing stack, pop on >=. After popping, stack top is the previous greater element.',
    ],
  }),

  'ms-pse': e({
    xray: [
      { text: '**Increasing stack**: pop on <=, then stack top is PSE', kind: 'signal' },
    ],
    budget: ['pse', 'increasing stack left'],
    slottedTemplate: `vector<int> pse(/* SLOT: size */, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] <= nums[st.top()]) st.pop();
    if (!st.empty()) pse[i] = nums[st.top()];
    st.push(i);
}`,
    slots: [
      { id: 'SIZE', label: 'Number of elements', hint: 'n' },
    ],
    slotFills: {
      2104: { SIZE: 'nums.size()' },
    },
    helixOrder: [2104],
    helixDelta: {
      2104: 'PSE: increasing stack, pop on <=. Stack top after pop is previous smaller element.',
    },
    autopsies: [
      {
        cause: 'Confusing PSE with PGE comparison direction',
        wrong: 'nums[i] >= nums[st.top()] // decreasing stack logic',
        testCase: 'PSE needs smaller element before — use increasing stack',
        fix: 'PSE: increasing stack, pop on <=. Smaller elements push out larger ones.',
      },
    ],
    sayIt: [
      'PSE: increasing stack, pop on <=. After pops, stack top is previous smaller element.',
    ],
  }),

  'ms-subarray-ranges': e({
    xray: [
      { text: '**Contribution**: nums[i] * (i - left) * (right - i)', kind: 'signal' },
      { text: 'Subtract as **min**, add as **max** → range sum', kind: 'goal' },
    ],
    budget: ['contribution', 'min max subtraction'],
    slottedTemplate: `long long subArrayRanges(vector<int>& nums) {
    int n = nums.size();
    stack<int> st;
    long long sum = 0;
    // contribution as min
    for (int i = 0; i <= n; i++) {
        while (!st.empty() && (i == n || nums[i] < nums[st.top()])) {
            int mid = st.top(); st.pop();
            int left = st.empty() ? -1 : st.top();
            int right = i;
            sum -= (long long)nums[mid] * (mid - left) * (right - mid);
        }
        st.push(i);
    }
    // repeat for max with > instead of <
    return /* SLOT: result */;
}`,
    slots: [
      { id: 'RESULT', label: 'Return expression', hint: 'abs(sum)' },
    ],
    slotFills: {
      2104: { RESULT: 'abs(sum)' },
      907: { RESULT: 'sum (already negative from subtraction)' },
    },
    helixOrder: [2104, 907],
    helixDelta: {
      2104: 'Sum of Subarray Ranges: sum(max) - sum(min) via two-pass monotonic stack.',
      907: 'Sum of Subarray Minimums: single pass for min contribution. Use (i-left)*(right-i).',
    },
    autopsies: [
      {
        cause: 'Integer overflow in contribution multiplication',
        wrong: 'nums[mid] * (mid - left) * (right - mid) // int overflow',
        testCase: 'n=10^5, values up to 10^5 → product > 2^31',
        fix: 'Cast to long long: (long long)nums[mid] * (mid-left) * (right-mid)',
      },
    ],
    sayIt: [
      'Subarray ranges: contribution = value * left_options * right_options. Sum mins subtract, maxes add.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
