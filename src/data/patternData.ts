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
}

export function getPatternData(id: string): PatternData | undefined {
  return REGISTRY[id]
}

export function getPatternDataOrThrow(id: string): PatternData {
  const data = REGISTRY[id]
  if (!data) throw new Error(`No pattern data for id: "${id}"`)
  return data
}
