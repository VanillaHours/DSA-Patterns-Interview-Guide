import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'string', label: 'String processing', group: 'input' },
  { id: 'charCompare', label: 'Character-by-character compare', group: 'input' },
  { id: 'contiguous', label: 'Contiguous substring / window', group: 'structure' },
  { id: 'dictionary', label: 'Dictionary / word list', group: 'input' },
  { id: 'pattern', label: 'Pattern matching (KMP / rolling hash)', group: 'input' },
  { id: 'recursive', label: 'Recursive generation / decomposition', group: 'structure' },
  { id: 'trie', label: 'Trie / prefix tree', group: 'structure' },
  { id: 'wildcard', label: 'Wildcard . / regex-like search', group: 'input' },
  { id: 'spaceO1', label: 'O(1) extra space', group: 'space' },
  { id: 'maximize', label: 'Maximize (length, area, …)', group: 'goal' },
  { id: 'minimize', label: 'Minimize (window, operations, …)', group: 'goal' },
  { id: 'enumerate', label: 'Enumerate all valid strings', group: 'goal' },
  { id: 'prefixQuery', label: 'Query prefix / startswith', group: 'goal' },
  { id: 'boardDFS', label: 'DFS on grid / matrix', group: 'structure' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
