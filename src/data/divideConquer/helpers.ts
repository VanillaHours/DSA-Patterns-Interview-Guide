import type { DecisionBranch, TaxonomyNode } from '../../types'

export function branch(
  lookFor: string[],
  label: string,
  because: string,
  child: TaxonomyNode,
  notWhen?: string[]
): DecisionBranch {
  return { lookFor, notWhen, label, because, child }
}

export function decision(
  id: string,
  title: string,
  hue: TaxonomyNode['hue'],
  step: number,
  readProblem: string,
  branches: DecisionBranch[],
  extra?: Partial<TaxonomyNode>
): TaxonomyNode {
  return { id, title, hue, step, readProblem, branches, ...extra }
}

export function leaf(
  id: string,
  title: string,
  hue: TaxonomyNode['hue'],
  data: Omit<TaxonomyNode, 'id' | 'title' | 'hue' | 'branches'>
): TaxonomyNode {
  return { id, title, hue, ...data }
}
