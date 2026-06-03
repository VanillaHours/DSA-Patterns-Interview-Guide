export type XRayKind = 'signal' | 'constraint' | 'output' | 'goal'

export interface XRayFragment {
  text: string
  kind: XRayKind
}

export interface TemplateSlotDef {
  id: string
  label: string
  hint?: string
}

export interface MistakeAutopsy {
  cause: string
  wrong: string
  testCase: string
  fix: string
}

export interface LeafEnhancement {
  xray: XRayFragment[]
  /** Constraint budget chip ids — see constraints.ts */
  budget: string[]
  slottedTemplate: string
  slots: TemplateSlotDef[]
  /** LC id → slot id → fill value */
  slotFills: Record<number, Record<string, string>>
  /** Evolution order of LC ids for helix (defaults to problem list order) */
  helixOrder?: number[]
  /** LC id → one-line delta from previous in helix */
  helixDelta: Record<number, string>
  autopsies: MistakeAutopsy[]
  /** Lines for "Say it out loud" practice */
  sayIt: string[]
}

export interface FamilyMeta {
  tagline: string
  keywords: string[]
  budget: string[]
}
