import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const linearStringNode: TaxonomyNode = decision(
  'linear-str',
  'Linear String Traversal — how do you scan the string?',
  'green',
  2,
  'String is processed left-to-right (or with two indices). Which scanning strategy?',
  [
    branch(
      [
        '"valid palindrome" / character-by-character compare',
        '"reverse string" / compare from both ends',
        'skip non-alphanumeric characters',
      ],
      'Character-by-Character',
      'Opposite pointers check symmetry; single pass O(n).',
      L.charByCharLeaf,
      ['substring window', 'pattern matching KMP'],
    ),
    branch(
      [
        '"longest substring without repeating"',
        '"minimum window substring" / sliding window',
        '"at most K distinct characters"',
      ],
      'Window-Based Scanning',
      'Expand right, shrink left when constraint breaks.',
      L.windowScanLeaf,
      ['palindrome check', 'pattern matching'],
    ),
    branch(
      [
        '"needle in a haystack" / find first occurrence',
        '"repeated string match" / KMP pattern search',
        '"strStr" / index of pattern in text',
      ],
      'Pattern Matching',
      'Linear scan with KMP or rolling hash for O(n+m).',
      L.patternMatchLeaf,
      ['character-by-character compare'],
    ),
  ],
)

const recursiveStringNode: TaxonomyNode = decision(
  'recursive-str',
  'Recursive String Traversal — explore string as a space?',
  'blue',
  2,
  'String is explored recursively: generate combinations or partition/parse expressions.',
  [
    branch(
      [
        '"letter combinations" of a phone number',
        '"generate parentheses" / well-formed',
        'backtracking on string choices',
      ],
      'Backtracking on Strings',
      'Recursively build candidates; prune invalid branches.',
      L.backtrackStringLeaf,
      ['expression parsing with operators'],
    ),
    branch(
      [
        '"restore IP addresses" / valid dot placements',
        '"different ways to add parentheses" / expression evaluation',
        'partition string into valid substrings',
      ],
      'String Decomposition',
      'Partition string at split points; recurse on each part.',
      L.stringDecomposeLeaf,
      ['simple backtracking on char choices'],
    ),
  ],
)

const trieStringNode: TaxonomyNode = decision(
  'trie-str',
  'Trie-Based String Traversal — prefix tree navigation?',
  'purple',
  2,
  'Multiple string lookups or prefix-based search across a dictionary.',
  [
    branch(
      [
        '"implement a trie" / insert / search / startsWith',
        '"add and search word" with wildcard dot',
        'prefix matching multiple queries',
      ],
      'Prefix Matching',
      'Navigate trie nodes by character; wildcard forces DFS.',
      L.prefixMatchLeaf,
      ['find words in board', 'replace words in sentence'],
    ),
    branch(
      [
        '"word search II" / find words in a board',
        '"replace words" in a sentence with root from dict',
        'trie + DFS traversal of grid or string',
      ],
      'Word Dictionary',
      'Build trie from dict; traverse input with trie pointers.',
      L.wordDictLeaf,
      ['simple prefix query on single word'],
    ),
  ],
)

export const stringRoot: TaxonomyNode = decision(
  'str-root',
  'String Traversal',
  'slate',
  1,
  'Read the problem: what string operation is needed?',
  [
    branch(
      [
        '"valid palindrome" / "longest substring" / "find pattern"',
        'single string scanned left-to-right',
        'sliding window, KMP, or two-pointer char compare',
      ],
      '→ Linear String Traversal',
      'Scan forward, window, or match pattern in O(n).',
      linearStringNode,
      ['recursive generation', 'trie / prefix tree'],
    ),
    branch(
      [
        '"letter combinations" / "generate parentheses"',
        '"restore IP" / "different ways to compute"',
        'build strings recursively with backtracking',
      ],
      '→ Recursive String Traversal',
      'Explore search space through recursion and pruning.',
      recursiveStringNode,
      ['linear scan only', 'trie dictionary'],
    ),
    branch(
      [
        '"implement trie" / prefix tree',
        '"word search" in board / "replace words"',
        'dictionary of words, prefix lookups',
      ],
      '→ Trie-Based String Traversal',
      'Trie compresses common prefixes; traverse by character.',
      trieStringNode,
      ['single string linear scan', 'recursive generation without dict'],
    ),
  ],
  {
    explanation:
      'Choose by the operation: linear scan for character/window/pattern ops; recursion for generating or decomposing strings; trie for dictionary-backed prefix traversal.',
  },
)
