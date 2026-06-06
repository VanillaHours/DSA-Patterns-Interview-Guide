import type { ConstraintDef } from '../../types/constraint'

export const CONSTRAINTS: ConstraintDef[] = [
  { id: 'stringInput', label: 'String / word input', group: 'input' },
  { id: 'wordList', label: 'List of words / dictionary', group: 'input' },
  { id: 'prefixQuery', label: 'Prefix / startswith query', group: 'input' },
  { id: 'wildcard', label: 'Wildcard / dot character (. or *)', group: 'input' },
  { id: 'trieBuilt', label: 'Trie data structure built first', group: 'structure' },
  { id: 'countTracking', label: 'Count tracking (word/prefix frequency)', group: 'structure' },
  { id: 'deleteOp', label: 'Deletion / erase operation', group: 'structure' },
  { id: 'trieTraversal', label: 'DFS / BFS trie traversal', group: 'structure' },
  { id: 'bitLevel', label: 'Bit-level (binary trie / XOR)', group: 'structure' },
  { id: 'inPlace', label: 'In-place O(1) extra space', group: 'space' },
  { id: 'topK', label: 'Top-K / top frequent suggestions', group: 'goal' },
  { id: 'prefixMatch', label: 'Prefix match / starts with', group: 'goal' },
  { id: 'wordExist', label: 'Word existence / lookup', group: 'goal' },
  { id: 'maxXor', label: 'Maximum XOR / bitwise optimization', group: 'goal' },
  { id: 'autocomplete', label: 'Auto-complete / search suggestions', group: 'goal' },
  { id: 'patternMatch', label: 'Pattern matching / wildcard search', group: 'goal' },
]

export const CONSTRAINT_MAP = Object.fromEntries(
  CONSTRAINTS.map((c) => [c.id, c])
) as Record<string, ConstraintDef>
