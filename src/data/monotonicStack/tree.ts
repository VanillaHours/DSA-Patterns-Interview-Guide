import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const increasing: TaxonomyNode = decision(
  'ms-inc-step3',
  'Increasing Stack — maintain monotonic increasing order?',
  'teal',
  3,
  'Maintaining an increasing stack. Which variant?',
  [
    branch(
      ['"strictly increasing"', '"strict increase"', '"pop on <="', '"strict"'],
      'Strictly Increasing Stack',
      'Pop while nums[i] <= st.top(). No equal values allowed.',
      L.strictIncLeaf,
    ),
    branch(
      ['"non-decreasing"', '"allow equal"', '"pop on <"', '"non-decreasing stack"'],
      'Non-Decreasing Stack',
      'Pop while nums[i] < st.top(). Equal values stay.',
      L.nonDecLeaf,
    ),
  ],
)

const decreasing: TaxonomyNode = decision(
  'ms-dec-step3',
  'Decreasing Stack — maintain monotonic decreasing order?',
  'green',
  3,
  'Maintaining a decreasing stack. Which variant?',
  [
    branch(
      ['"strictly decreasing"', '"strict decrease"', '"pop on >="', '"strict dec"'],
      'Strictly Decreasing Stack',
      'Pop while nums[i] >= st.top(). No equal values allowed.',
      L.strictDecLeaf,
    ),
    branch(
      ['"non-increasing"', '"allow equal dec"', '"pop on >"', '"non-increasing stack"'],
      'Non-Increasing Stack',
      'Pop while nums[i] > st.top(). Equal values stay.',
      L.nonIncLeaf,
    ),
  ],
)

const nextGreaterSmaller: TaxonomyNode = decision(
  'ms-nge-step3',
  'Next Greater / Smaller — find next element greater or smaller?',
  'blue',
  3,
  'Finding the next greater or smaller element. Which query?',
  [
    branch(
      ['"next greater"', '"nge"', '"nge to right"', '"greater element"', '"warmer day"'],
      'Next Greater Element',
      'Find first greater element to the right. Decreasing stack, pop on >.',
      L.ngeLeaf,
    ),
    branch(
      ['"next smaller"', '"nse"', '"nse to right"', '"smaller element"'],
      'Next Smaller Element',
      'Find first smaller element to the right. Increasing stack, pop on <.',
      L.nseLeaf,
    ),
    branch(
      ['"circular"', '"nge ii"', '"circular array"', '"2n iteration"', '"wrap around"'],
      'Circular Array',
      'NGE in a circular array via 2n virtual iteration.',
      L.circularNgeLeaf,
    ),
  ],
)

const previousGreaterSmaller: TaxonomyNode = decision(
  'ms-pge-step3',
  'Previous Greater / Smaller — find previous element greater or smaller?',
  'purple',
  3,
  'Finding the previous greater or smaller element. Which query?',
  [
    branch(
      ['"previous greater"', '"pge"', '"pge to left"', '"greater on left"', '"visible people"'],
      'Previous Greater Element',
      'Find first greater element to the left. Decreasing stack, pop on >=.',
      L.pgeLeaf,
    ),
    branch(
      ['"previous smaller"', '"pse"', '"pse to left"', '"smaller on left"'],
      'Previous Smaller Element',
      'Find first smaller element to the left. Increasing stack, pop on <=.',
      L.pseLeaf,
    ),
    branch(
      ['"subarray range"', '"sum of mins"', '"range"', '"subarray min max"'],
      'Subarray Ranges',
      'Contribution of each element as min/max in all subarrays.',
      L.subarrayRangesLeaf,
    ),
  ],
)

const fundamentals: TaxonomyNode = decision(
  'ms-fund-step2',
  'Fundamentals',
  'slate',
  2,
  'Core monotonic stack techniques. Pick ONE: increasing/decreasing stack, next/previous element queries:',
  [
    branch(
      ['"increasing"', '"increase"', '"strict increase"', '"non-decreasing"', '"ascending"'],
      '→ Increasing Stack',
      'Maintain monotonic increasing order in the stack.',
      increasing,
    ),
    branch(
      ['"decreasing"', '"decrease"', '"strict decrease"', '"non-increasing"', '"descending"'],
      '→ Decreasing Stack',
      'Maintain monotonic decreasing order in the stack.',
      decreasing,
    ),
    branch(
      ['"next greater"', '"next smaller"', '"nge"', '"nse"', '"circular"', '"greater element"'],
      '→ Next Greater / Smaller',
      'Find next greater/smaller element to the right.',
      nextGreaterSmaller,
    ),
    branch(
      ['"previous greater"', '"previous smaller"', '"pge"', '"pse"', '"subarray range"', '"on left"'],
      '→ Previous Greater / Smaller',
      'Find previous greater/smaller element to the left.',
      previousGreaterSmaller,
    ),
  ],
)

export const msRoot: TaxonomyNode = decision(
  'ms-root',
  'Monotonic Stack Pattern',
  'slate',
  1,
  'Monotonic Stack: maintain ordered stack for element comparison queries. Which domain?',
  [
    branch(
      ['"fundamental"', '"increasing"', '"decreasing"', '"nge"', '"pge"', '"next greater"', '"previous"', '"stack"', '"monotonic"'],
      '→ Fundamentals',
      'Core monotonic stack: increasing/decreasing stacks, next/previous element queries.',
      fundamentals,
    ),
  ],
)
