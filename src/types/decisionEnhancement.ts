import type { XRayFragment, MistakeAutopsy } from './leafEnhancement'

export interface DecisionBranchGuide {
  /** One-line: when to pick this branch */
  proceed: string
  /** Extra when signals beyond tree lookFor */
  whenExtra?: string[]
}

export interface NotPatternSignal {
  signal: string
  actually: string
}

export interface DecisionEnhancement {
  xray: XRayFragment[]
  budget: string[]
  sayIt: string[]
  /** When you should be making this decision */
  whenAtThisStep: string
  /** Keyed by child node id */
  branchGuides: Record<string, DecisionBranchGuide>
  /** Only on pattern gate — smells like 2ptr but isn't */
  notThisPattern?: NotPatternSignal[]
  /** Wrong fork at this level */
  misidentify?: MistakeAutopsy[]
}

export interface PatternGateEnhancement extends DecisionEnhancement {
  /** Positive signals that suggest two pointers at all */
  yesSignals: string[]
}
