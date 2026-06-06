import type { DecisionEnhancement, PatternGateEnhancement } from '../types/decisionEnhancement'
import type { FamilyMeta, LeafEnhancement } from '../types/leafEnhancement'
import type { ConstraintDef } from '../types/constraint'

// Two Pointers
import {
  getDecisionEnhancement as getTPDecision,
  getPatternGate as getTPGate,
} from './twoPointers/decisionEnhancements'
import { getEnhancement as getTPLeaf } from './twoPointers/leafEnhancements'
import { FAMILY_META as TP_FAMILIES } from './twoPointers/familyMeta'
import { CONSTRAINTS as TP_CONSTRAINTS, CONSTRAINT_MAP as TP_CONSTRAINT_MAP } from './twoPointers/constraints'

// Hash Map
import {
  getDecisionEnhancement as getHMDecision,
  getPatternGate as getHMGate,
} from './hashMap/decisionEnhancements'
import { getEnhancement as getHMLeaf } from './hashMap/leafEnhancements'
import { FAMILY_META as HM_FAMILIES } from './hashMap/familyMeta'
import { CONSTRAINTS as HM_CONSTRAINTS, CONSTRAINT_MAP as HM_CONSTRAINT_MAP } from './hashMap/constraints'

// Stack & Queue
import {
  getDecisionEnhancement as getSQDecision,
  getPatternGate as getSQGate,
} from './stackQueue/decisionEnhancements'
import { getEnhancement as getSQLeaf } from './stackQueue/leafEnhancements'
import { FAMILY_META as SQ_FAMILIES } from './stackQueue/familyMeta'
import { CONSTRAINTS as SQ_CONSTRAINTS, CONSTRAINT_MAP as SQ_CONSTRAINT_MAP } from './stackQueue/constraints'

// Linked List
import {
  getDecisionEnhancement as getLLDecision,
  getPatternGate as getLLGate,
} from './linkedList/decisionEnhancements'
import { getEnhancement as getLLLeaf } from './linkedList/leafEnhancements'
import { FAMILY_META as LL_FAMILIES } from './linkedList/familyMeta'
import { CONSTRAINTS as LL_CONSTRAINTS, CONSTRAINT_MAP as LL_CONSTRAINT_MAP } from './linkedList/constraints'

// Sorting
import {
  getDecisionEnhancement as getSDecision,
  getPatternGate as getSGate,
} from './sorting/decisionEnhancements'
import { getEnhancement as getSLeaf } from './sorting/leafEnhancements'
import { FAMILY_META as S_FAMILIES } from './sorting/familyMeta'
import { CONSTRAINTS as S_CONSTRAINTS, CONSTRAINT_MAP as S_CONSTRAINT_MAP } from './sorting/constraints'

// Prefix Sum
import {
  getDecisionEnhancement as getPSDecision,
  getPatternGate as getPSGate,
} from './prefixSum/decisionEnhancements'
import { getEnhancement as getPSLeaf } from './prefixSum/leafEnhancements'
import { FAMILY_META as PS_FAMILIES } from './prefixSum/familyMeta'
import { CONSTRAINTS as PS_CONSTRAINTS, CONSTRAINT_MAP as PS_CONSTRAINT_MAP } from './prefixSum/constraints'

// Heap / Priority Queue
import {
  getDecisionEnhancement as getHeapDecision,
  getPatternGate as getHeapGate,
} from './heap/decisionEnhancements'
import { getEnhancement as getHeapLeaf } from './heap/leafEnhancements'
import { FAMILY_META as HEAP_FAMILIES } from './heap/familyMeta'
import { CONSTRAINTS as HEAP_CONSTRAINTS, CONSTRAINT_MAP as HEAP_CONSTRAINT_MAP } from './heap/constraints'

// Binary Search
import {
  getDecisionEnhancement as getBSDecision,
  getPatternGate as getBSGate,
} from './binarySearch/decisionEnhancements'
import { getEnhancement as getBSLeaf } from './binarySearch/leafEnhancements'
import { FAMILY_META as BS_FAMILIES } from './binarySearch/familyMeta'
import { CONSTRAINTS as BS_CONSTRAINTS, CONSTRAINT_MAP as BS_CONSTRAINT_MAP } from './binarySearch/constraints'

// Tree Traversal
import {
  getDecisionEnhancement as getTTDecision,
  getPatternGate as getTTGate,
} from './treeTraversal/decisionEnhancements'
import { getEnhancement as getTTLeaf } from './treeTraversal/leafEnhancements'
import { FAMILY_META as TT_FAMILIES } from './treeTraversal/familyMeta'
import { CONSTRAINTS as TT_CONSTRAINTS, CONSTRAINT_MAP as TT_CONSTRAINT_MAP } from './treeTraversal/constraints'

// Graph Traversal
import {
  getDecisionEnhancement as getGTDecision,
  getPatternGate as getGTGate,
} from './graphTraversal/decisionEnhancements'
import { getEnhancement as getGTLeaf } from './graphTraversal/leafEnhancements'
import { FAMILY_META as GT_FAMILIES } from './graphTraversal/familyMeta'
import { CONSTRAINTS as GT_CONSTRAINTS, CONSTRAINT_MAP as GT_CONSTRAINT_MAP } from './graphTraversal/constraints'

// Matrix Traversal
import {
  getDecisionEnhancement as getMTDecision,
  getPatternGate as getMTGate,
} from './matrixTraversal/decisionEnhancements'
import { getEnhancement as getMTLeaf } from './matrixTraversal/leafEnhancements'
import { FAMILY_META as MT_FAMILIES } from './matrixTraversal/familyMeta'
import { CONSTRAINTS as MT_CONSTRAINTS, CONSTRAINT_MAP as MT_CONSTRAINT_MAP } from './matrixTraversal/constraints'

// String Traversal
import {
  getDecisionEnhancement as getSTDecision,
  getPatternGate as getSTGate,
} from './stringTraversal/decisionEnhancements'
import { getEnhancement as getSTLeaf } from './stringTraversal/leafEnhancements'
import { FAMILY_META as ST_FAMILIES } from './stringTraversal/familyMeta'
import { CONSTRAINTS as ST_CONSTRAINTS, CONSTRAINT_MAP as ST_CONSTRAINT_MAP } from './stringTraversal/constraints'

// Array Traversal
import {
  getDecisionEnhancement as getATDecision,
  getPatternGate as getATGate,
} from './arrayTraversal/decisionEnhancements'
import { getEnhancement as getATLeaf } from './arrayTraversal/leafEnhancements'
import { FAMILY_META as AT_FAMILIES } from './arrayTraversal/familyMeta'
import { CONSTRAINTS as AT_CONSTRAINTS, CONSTRAINT_MAP as AT_CONSTRAINT_MAP } from './arrayTraversal/constraints'

// Greedy
import {
  getDecisionEnhancement as getGDecision,
  getPatternGate as getGGate,
} from './greedy/decisionEnhancements'
import { getEnhancement as getGLeaf } from './greedy/leafEnhancements'
import { FAMILY_META as G_FAMILIES } from './greedy/familyMeta'
import { CONSTRAINTS as G_CONSTRAINTS, CONSTRAINT_MAP as G_CONSTRAINT_MAP } from './greedy/constraints'

// Backtracking
import {
  getDecisionEnhancement as getBTDecision,
  getPatternGate as getBTGate,
} from './backtracking/decisionEnhancements'
import { getEnhancement as getBTLeaf } from './backtracking/leafEnhancements'
import { FAMILY_META as BT_FAMILIES } from './backtracking/familyMeta'
import { CONSTRAINTS as BT_CONSTRAINTS, CONSTRAINT_MAP as BT_CONSTRAINT_MAP } from './backtracking/constraints'

// Dynamic Programming
import {
  getDecisionEnhancement as getDPDecision,
  getPatternGate as getDPGate,
} from './dynamicProgramming/decisionEnhancements'
import { getEnhancement as getDPLeaf } from './dynamicProgramming/leafEnhancements'
import { FAMILY_META as DP_FAMILIES } from './dynamicProgramming/familyMeta'
import { CONSTRAINTS as DP_CONSTRAINTS, CONSTRAINT_MAP as DP_CONSTRAINT_MAP } from './dynamicProgramming/constraints'

// Trie
import {
  getDecisionEnhancement as getTrieDecision,
  getPatternGate as getTrieGate,
} from './trie/decisionEnhancements'
import { getEnhancement as getTrieLeaf } from './trie/leafEnhancements'
import { FAMILY_META as TRIE_FAMILIES } from './trie/familyMeta'
import { CONSTRAINTS as TRIE_CONSTRAINTS, CONSTRAINT_MAP as TRIE_CONSTRAINT_MAP } from './trie/constraints'

export interface PatternData {
  getDecisionEnhancement: (id: string) => DecisionEnhancement | undefined
  getPatternGate: () => PatternGateEnhancement
  getLeafEnhancement: (id: string) => LeafEnhancement | undefined
  familyMeta: Record<string, FamilyMeta>
  constraints: ConstraintDef[]
  constraintMap: Record<string, ConstraintDef>
}

const REGISTRY: Record<string, PatternData> = {
  'two-pointers': {
    getDecisionEnhancement: getTPDecision,
    getPatternGate: getTPGate,
    getLeafEnhancement: getTPLeaf,
    familyMeta: TP_FAMILIES,
    constraints: TP_CONSTRAINTS,
    constraintMap: TP_CONSTRAINT_MAP,
  },
  'hash-map': {
    getDecisionEnhancement: getHMDecision,
    getPatternGate: getHMGate,
    getLeafEnhancement: getHMLeaf,
    familyMeta: HM_FAMILIES,
    constraints: HM_CONSTRAINTS,
    constraintMap: HM_CONSTRAINT_MAP,
  },
  'stack-queue': {
    getDecisionEnhancement: getSQDecision,
    getPatternGate: getSQGate,
    getLeafEnhancement: getSQLeaf,
    familyMeta: SQ_FAMILIES,
    constraints: SQ_CONSTRAINTS,
    constraintMap: SQ_CONSTRAINT_MAP,
  },
  'linked-list': {
    getDecisionEnhancement: getLLDecision,
    getPatternGate: getLLGate,
    getLeafEnhancement: getLLLeaf,
    familyMeta: LL_FAMILIES,
    constraints: LL_CONSTRAINTS,
    constraintMap: LL_CONSTRAINT_MAP,
  },
  sorting: {
    getDecisionEnhancement: getSDecision,
    getPatternGate: getSGate,
    getLeafEnhancement: getSLeaf,
    familyMeta: S_FAMILIES,
    constraints: S_CONSTRAINTS,
    constraintMap: S_CONSTRAINT_MAP,
  },
  'prefix-sum': {
    getDecisionEnhancement: getPSDecision,
    getPatternGate: getPSGate,
    getLeafEnhancement: getPSLeaf,
    familyMeta: PS_FAMILIES,
    constraints: PS_CONSTRAINTS,
    constraintMap: PS_CONSTRAINT_MAP,
  },
  'heap-priority-queue': {
    getDecisionEnhancement: getHeapDecision,
    getPatternGate: getHeapGate,
    getLeafEnhancement: getHeapLeaf,
    familyMeta: HEAP_FAMILIES,
    constraints: HEAP_CONSTRAINTS,
    constraintMap: HEAP_CONSTRAINT_MAP,
  },
  'binary-search': {
    getDecisionEnhancement: getBSDecision,
    getPatternGate: getBSGate,
    getLeafEnhancement: getBSLeaf,
    familyMeta: BS_FAMILIES,
    constraints: BS_CONSTRAINTS,
    constraintMap: BS_CONSTRAINT_MAP,
  },
  'tree-traversal': {
    getDecisionEnhancement: getTTDecision,
    getPatternGate: getTTGate,
    getLeafEnhancement: getTTLeaf,
    familyMeta: TT_FAMILIES,
    constraints: TT_CONSTRAINTS,
    constraintMap: TT_CONSTRAINT_MAP,
  },
  'graph-traversal': {
    getDecisionEnhancement: getGTDecision,
    getPatternGate: getGTGate,
    getLeafEnhancement: getGTLeaf,
    familyMeta: GT_FAMILIES,
    constraints: GT_CONSTRAINTS,
    constraintMap: GT_CONSTRAINT_MAP,
  },
  'matrix-traversal': {
    getDecisionEnhancement: getMTDecision,
    getPatternGate: getMTGate,
    getLeafEnhancement: getMTLeaf,
    familyMeta: MT_FAMILIES,
    constraints: MT_CONSTRAINTS,
    constraintMap: MT_CONSTRAINT_MAP,
  },
  'string-traversal': {
    getDecisionEnhancement: getSTDecision,
    getPatternGate: getSTGate,
    getLeafEnhancement: getSTLeaf,
    familyMeta: ST_FAMILIES,
    constraints: ST_CONSTRAINTS,
    constraintMap: ST_CONSTRAINT_MAP,
  },
  'array-traversal': {
    getDecisionEnhancement: getATDecision,
    getPatternGate: getATGate,
    getLeafEnhancement: getATLeaf,
    familyMeta: AT_FAMILIES,
    constraints: AT_CONSTRAINTS,
    constraintMap: AT_CONSTRAINT_MAP,
  },
  greedy: {
    getDecisionEnhancement: getGDecision,
    getPatternGate: getGGate,
    getLeafEnhancement: getGLeaf,
    familyMeta: G_FAMILIES,
    constraints: G_CONSTRAINTS,
    constraintMap: G_CONSTRAINT_MAP,
  },
  backtracking: {
    getDecisionEnhancement: getBTDecision,
    getPatternGate: getBTGate,
    getLeafEnhancement: getBTLeaf,
    familyMeta: BT_FAMILIES,
    constraints: BT_CONSTRAINTS,
    constraintMap: BT_CONSTRAINT_MAP,
  },
  'dynamic-programming': {
    getDecisionEnhancement: getDPDecision,
    getPatternGate: getDPGate,
    getLeafEnhancement: getDPLeaf,
    familyMeta: DP_FAMILIES,
    constraints: DP_CONSTRAINTS,
    constraintMap: DP_CONSTRAINT_MAP,
  },
  trie: {
    getDecisionEnhancement: getTrieDecision,
    getPatternGate: getTrieGate,
    getLeafEnhancement: getTrieLeaf,
    familyMeta: TRIE_FAMILIES,
    constraints: TRIE_CONSTRAINTS,
    constraintMap: TRIE_CONSTRAINT_MAP,
  },
}

export function getPatternData(id: string): PatternData | undefined {
  return REGISTRY[id]
}

export function getPatternDataOrThrow(id: string): PatternData {
  const data = REGISTRY[id]
  if (!data) throw new Error(`No pattern data for id: "${id}"`)
  return data
}
