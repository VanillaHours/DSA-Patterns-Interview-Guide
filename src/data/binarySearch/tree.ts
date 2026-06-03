import type { TaxonomyNode } from '../../types'
import { decision, branch } from './helpers'
import {
  exactMatchLeaf, boundaryLeaf, positionLeaf,
  rotatedMinLeaf, rotatedSearchLeaf, mountainLeaf, unknownSizeLeaf,
  minimizeMaxLeaf, maximizeMinLeaf, mathCountingLeaf,
  matrixSearchLeaf, parallelBSLeaf,
} from './leaves'

// ── Classic Index Search (step 2) ────────────────────────────────

const classicFamily = decision('classic-step2', 'Identify the Classic BS Variant', 'teal', 2,
  'Is it exact match, boundary detection, or position-based?',
  [
    branch(['exactMatch'], 'Exact Match Search',
      'Find a specific target value in a sorted array.',
      exactMatchLeaf),
    branch(['firstLast'], 'Boundary Detection',
      'Find the first and last occurrence of a target in a sorted array.',
      boundaryLeaf),
    branch(['insertPos'], 'Position-Based',
      'Find the insertion position, closest element, or guess the number.',
      positionLeaf),
  ],
)

// ── Modified Search Space (step 2) ───────────────────────────────

const modifiedFamily = decision('modified-step2', 'Identify the Modified Search Space', 'purple', 2,
  'Is the array rotated, mountain-shaped, or of unknown size?',
  [
    branch(['rotatedArray', 'sortedInput'], 'Rotated — Find Min',
      'Find the minimum element in a rotated sorted array.',
      rotatedMinLeaf),
    branch(['rotatedArray'], 'Rotated — Search Target',
      'Search for a target in a rotated sorted array.',
      rotatedSearchLeaf),
    branch(['mountainArray', 'peakElement'], 'Mountain / Bitonic',
      'Find peak element or search in a mountain array.',
      mountainLeaf),
    branch(['unknownSize'], 'Unknown Size',
      'Search in a sorted array of unknown or infinite size.',
      unknownSizeLeaf),
  ],
)

// ── Answer Space (step 2) ───────────────────────────────────────

const answerFamily = decision('answer-step2', 'Identify the Answer Space Problem', 'orange', 2,
  'Is it minimize max, maximize min, or kth/math counting?',
  [
    branch(['minMax', 'feasibility'], 'Minimize a Maximum',
      'Find the smallest possible maximum value (capacity, speed, split sum).',
      minimizeMaxLeaf),
    branch(['maxMin', 'feasibility'], 'Maximize a Minimum',
      'Find the largest possible minimum distance/value.',
      maximizeMinLeaf),
    branch(['kthSearch', 'monotonic'], 'Math / Counting',
      'Kth smallest element in sorted matrix or median of two sorted arrays.',
      mathCountingLeaf),
  ],
)

// ── Specialized Variants (step 2) ───────────────────────────────

const specializedFamily = decision('specialized-step2', 'Identify the Specialized Variant', 'teal', 2,
  'Is it a 2D matrix search or a parallel/multi-constraint BS?',
  [
    branch(['matrixSearch', 'sortedInput'], '2D Matrix Search',
      'Search for a target in a row-and-column sorted matrix.',
      matrixSearchLeaf),
    branch(['parallelBS'], 'Parallel Binary Search',
      'Compound feasibility predicate: minimum days to make m bouquets.',
      parallelBSLeaf),
  ],
)

// ── Root Decision (step 1) ──────────────────────────────────────

export const BS_TREE: TaxonomyNode = decision('bs-step1', 'Which Binary Search pattern?', 'teal', 1,
  'Is the problem classic index search, modified search space, answer space, or a specialized variant?',
  [
    branch(['exactMatch', 'firstLast', 'insertPos', 'sortedInput', 'logN'],
      'Classic Index Search',
      'Standard BS on array indices: exact match, boundaries, or position.',
      classicFamily),
    branch(['rotatedArray', 'mountainArray', 'unknownSize', 'peakElement'],
      'Modified Search Space',
      'Rotated arrays, mountain/bitonic arrays, or unknown-size arrays.',
      modifiedFamily),
    branch(['minMax', 'maxMin', 'kthSearch', 'feasibility', 'monotonic'],
      'Answer Space',
      'BS on the answer/range: minimize max, maximize min, or kth counting.',
      answerFamily),
    branch(['matrixSearch', 'parallelBS'],
      'Specialized Variants',
      '2D matrix search or parallel/multi-constraint binary search.',
      specializedFamily),
  ],
  //{ ascii: 'BS' },
)
