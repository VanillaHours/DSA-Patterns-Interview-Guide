import type { TaxonomyNode } from '../../types'
import { leaf } from './helpers'

const CPP = `#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

`

// ── Increasing Stack ───────────────────────────────────────────

export const strictIncLeaf: TaxonomyNode = leaf('ms-strict-inc', 'Strictly Increasing Stack', 'teal', {
  template: `${CPP}stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] <= nums[st.top()]) {
        // pop — nums[i] breaks strict increase
        st.pop();
    }
    // ans: previous smaller element is nums[st.top()] (if st not empty)
    st.push(i);
}`,
  problems: [
    { id: 496, title: 'Next Greater Element I', slug: 'next-greater-element-i', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Strictly increasing stack for NGE lookup.' },
    { id: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'Strict stack: pop when temp[i] > st.top(). days = i - st.top().' },
  ],
  pitfalls: ['❌ Using <= vs <: strict increase pops on <=, non-decreasing pops on <.'],
  edgeCases: [
    { input: 'all equal values, strict increasing', breaks: 'every element pops the previous — stack only holds last' },
    { input: 'strictly decreasing input', breaks: 'no pop ever; stack grows to n' },
  ],
  interviewTip: 'Strictly increasing stack: pop while nums[i] <= st.top(). Stack indices map to smaller elements on left.',
})

export const nonDecLeaf: TaxonomyNode = leaf('ms-non-dec', 'Non-Decreasing Stack', 'teal', {
  template: `${CPP}stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] < nums[st.top()]) {
        // pop — nums[i] breaks non-decreasing order
        st.pop();
    }
    st.push(i);
}`,
  problems: [
    { id: 1475, title: 'Final Prices With a Special Discount in a Shop', slug: 'final-prices-with-a-special-discount-in-a-shop', companies: ['AMAZON'], lineChanges: 'Non-decreasing: pop while prices[i] < prices[st.top()]; discount = prices[st.top()] - prices[i].' },
  ],
  pitfalls: ['❌ Non-decreasing allows equal values (pop only on strict <).'],
  edgeCases: [
    { input: 'all equal values', breaks: 'no pop — stack keeps all indices' },
    { input: 'strictly decreasing input', breaks: 'every element pops — stack only holds current' },
  ],
  interviewTip: 'Non-decreasing: pop only when nums[i] < st.top(). Equal values stay in stack.',
})

// ── Decreasing Stack ───────────────────────────────────────────

export const strictDecLeaf: TaxonomyNode = leaf('ms-strict-dec', 'Strictly Decreasing Stack', 'green', {
  template: `${CPP}stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] >= nums[st.top()]) {
        // pop — nums[i] breaks strict decrease
        st.pop();
    }
    // ans: previous greater element is nums[st.top()] (if st not empty)
    st.push(i);
}`,
  problems: [
    { id: 503, title: 'Next Greater Element II', slug: 'next-greater-element-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Decreasing stack for circular NGE; iterate 2*n virtual array.' },
  ],
  pitfalls: ['❌ Strictly decreasing: pop on >=; non-increasing: pop on >.'],
  edgeCases: [
    { input: 'all equal values, strict decreasing', breaks: 'every element pops previous' },
    { input: 'strictly increasing input', breaks: 'no pop; stack grows to n' },
  ],
  interviewTip: 'Strictly decreasing stack: pop while nums[i] >= st.top(). Mirrors increasing stack logic.',
})

export const nonIncLeaf: TaxonomyNode = leaf('ms-non-inc', 'Non-Increasing Stack', 'green', {
  template: `${CPP}stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        // pop — nums[i] breaks non-increasing
        st.pop();
    }
    st.push(i);
}`,
  problems: [
    { id: 1475, title: 'Final Prices With a Special Discount in a Shop', slug: 'final-prices-with-a-special-discount-in-a-shop', companies: ['AMAZON'], lineChanges: 'Non-increasing variant: pop on strict >; equal values kept.' },
  ],
  pitfalls: ['❌ Confusing non-increasing (allows equals) with strictly decreasing.'],
  edgeCases: [
    { input: 'all equal', breaks: 'no pop — equal values kept' },
    { input: 'strictly increasing', breaks: 'every element pops previous' },
  ],
  interviewTip: 'Non-increasing: pop only when nums[i] > st.top(). Equal values stay.',
})

// ── Next Greater / Smaller ─────────────────────────────────────

export const ngeLeaf: TaxonomyNode = leaf('ms-nge', 'Next Greater Element', 'blue', {
  template: `${CPP}vector<int> nge(n, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        nge[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}`,
  problems: [
    { id: 496, title: 'Next Greater Element I', slug: 'next-greater-element-i', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Monotonic decreasing stack → pop when greater found.' },
    { id: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', companies: ['AMAZON', 'META', 'MICROSOFT', 'GOOGLE'], mustKnow: true, lineChanges: 'NGE variant: answer = days to wait = i - st.top().' },
  ],
  pitfalls: ['❌ NGE uses decreasing stack (pop on >), not increasing.', '❌ Default -1 means no greater element exists.'],
  edgeCases: [
    { input: 'strictly decreasing input', breaks: 'NGE = -1 for all' },
    { input: 'strictly increasing input', breaks: 'NGE = next element for all but last' },
  ],
  interviewTip: 'NGE: decreasing stack. Current > stack top → answer found. Pop, assign, continue.',
})

export const nseLeaf: TaxonomyNode = leaf('ms-nse', 'Next Smaller Element', 'blue', {
  template: `${CPP}vector<int> nse(n, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] < nums[st.top()]) {
        nse[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}`,
  problems: [
    { id: 503, title: 'Next Greater Element II', slug: 'next-greater-element-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'NSE mirrored from NGE: pop on <. Use monotonic increasing stack.' },
  ],
  pitfalls: ['❌ NSE uses increasing stack (pop on <), the inverse of NGE.', '❌ -1 default when no smaller element.'],
  edgeCases: [
    { input: 'strictly increasing input', breaks: 'NSE = -1 for all' },
    { input: 'strictly decreasing input', breaks: 'NSE = next element for all but last' },
  ],
  interviewTip: 'NSE: increasing stack. Current < stack top → answer found. Symmetric to NGE.',
})

export const circularNgeLeaf: TaxonomyNode = leaf('ms-nge-circular', 'Circular Array', 'blue', {
  template: `${CPP}vector<int> ans(n, -1);
stack<int> st;
for (int i = 0; i < 2 * n; i++) {
    int idx = i % n;
    while (!st.empty() && nums[idx] > nums[st.top()]) {
        ans[st.top()] = nums[idx];
        st.pop();
    }
    if (i < n) st.push(idx);
}`,
  problems: [
    { id: 503, title: 'Next Greater Element II', slug: 'next-greater-element-ii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Circular NGE: iterate 2*n virtual indices; mod n for actual values.' },
  ],
  pitfalls: ['❌ Push index only in first pass (i < n) to avoid infinite loop with duplicates.', '❌ 2n iterations are enough — any element would have been found after one full pass.'],
  edgeCases: [
    { input: 'all equal values', breaks: 'NGE = -1 for all (no greater element)' },
    { input: 'size 1', breaks: 'only one element; NGE = -1' },
  ],
  interviewTip: 'Circular: iterate i=0..2n-1, idx = i%n. Only push in first n iterations.',
})

// ── Previous Greater / Smaller ─────────────────────────────────

export const pgeLeaf: TaxonomyNode = leaf('ms-pge', 'Previous Greater Element', 'purple', {
  template: `${CPP}vector<int> pge(n, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] >= nums[st.top()]) st.pop();
    if (!st.empty()) pge[i] = nums[st.top()];
    st.push(i);
}`,
  problems: [
    { id: 1944, title: 'Number of Visible People in a Queue', slug: 'number-of-visible-people-in-a-queue', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'PGE via decreasing stack; pop on >=; count visible = stack size + 1.' },
  ],
  pitfalls: ['❌ PGE is computed on the fly (stack top before pushing current), not stored for popped elements.', '❌ Decreasing stack for PGE (pop on >=); increasing for PSE.'],
  edgeCases: [
    { input: 'strictly decreasing input', breaks: 'PGE = -1 for all; no greater element before' },
    { input: 'strictly increasing input', breaks: 'PGE = previous element for all but first' },
  ],
  interviewTip: 'PGE: decreasing stack. Before pushing i, stack top (if any) is the previous greater element.',
})

export const pseLeaf: TaxonomyNode = leaf('ms-pse', 'Previous Smaller Element', 'purple', {
  template: `${CPP}vector<int> pse(n, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] <= nums[st.top()]) st.pop();
    if (!st.empty()) pse[i] = nums[st.top()];
    st.push(i);
}`,
  problems: [
    { id: 2104, title: 'Sum of Subarray Ranges', slug: 'sum-of-subarray-ranges', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'PSE + NSE to count subarrays where element is min. Use increasing stack.' },
  ],
  pitfalls: ['❌ PSE uses increasing stack (pop on <=), the opposite of PGE.', '❌ Default -1 if no smaller element before.'],
  edgeCases: [
    { input: 'strictly increasing input', breaks: 'PSE = -1 for all' },
    { input: 'strictly decreasing', breaks: 'PSE = previous element for all but first' },
  ],
  interviewTip: 'PSE: increasing stack. Stack top before pushing is the previous smaller element.',
})

export const subarrayRangesLeaf: TaxonomyNode = leaf('ms-subarray-ranges', 'Subarray Ranges', 'purple', {
  template: `${CPP}long long subArrayRanges(vector<int>& nums) {
    int n = nums.size();
    stack<int> st;
    long long sum = 0;
    // contribution as min: using PSE + NSE
    for (int i = 0; i <= n; i++) {
        while (!st.empty() && (i == n || nums[i] < nums[st.top()])) {
            int mid = st.top(); st.pop();
            int left = st.empty() ? -1 : st.top();
            long long cnt = (mid - left) * (i - mid);
            sum -= nums[mid] * cnt; // subtract as min
        }
        st.push(i);
    }
    // repeat as max with > instead of <
    return sum;
}`,
  problems: [
    { id: 2104, title: 'Sum of Subarray Ranges', slug: 'sum-of-subarray-ranges', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Ranges = sum(max) - sum(min). Compute both via monotonic stack. O(n).' },
    { id: 907, title: 'Sum of Subarray Minimums', slug: 'sum-of-subarray-minimums', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Sum of mins via PSE + NSE. Contribution = nums[i] * left * right.' },
  ],
  pitfalls: ['❌ Contribution formula: (i - left) * (right - i) for number of subarrays where element is min/max.', '❌ Subtract min contribution, add max contribution to get range sum.'],
  edgeCases: [
    { input: 'single element', breaks: 'range = 0; contribution = element * 1 * 1' },
    { input: 'all equal values', breaks: 'strict pop (< or >) avoids double-counting; use <=/+ for one pass' },
  ],
  interviewTip: 'Subarray ranges: compute contribution of each element as min (using NSE+PSE) and as max (using NGE+PGE). O(n).',
})
