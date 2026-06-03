export interface ProblemVariation {
  id: number
  title: string
  slug: string
  companies: string[]
  mustKnow?: boolean
  /** Which template line(s) differ — be specific */
  lineChanges: string
  /** Full solution snippet — only the 1–2 changed lines vs template */
  variationCode?: string
}

export interface EdgeCase {
  input: string
  breaks: string
}

/** One branch of a decision node — driven by problem-statement signals */
export interface DecisionBranch {
  lookFor: string[]
  notWhen?: string[]
  label: string
  because: string
  child: TaxonomyNode
}

export interface TaxonomyNode {
  id: string
  title: string
  hue: 'blue' | 'teal' | 'green' | 'lime' | 'amber' | 'orange' | 'purple' | 'pink' | 'slate'
  /** What to scan in the prompt before picking a branch */
  readProblem?: string
  step?: number
  explanation?: string
  /** Decision tree: pick the branch whose signals match the problem */
  branches?: DecisionBranch[]
  /** Leaf only */
  template?: string
  templateCaption?: string
  problems?: ProblemVariation[]
  pitfalls?: string[]
  edgeCases?: EdgeCase[]
  interviewTip?: string
}

export interface PatternMeta {
  id: string
  title: string
  order: number
  available: boolean
  githubPath?: string
  tagline: string
  root?: TaxonomyNode
}
