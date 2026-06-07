import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Bit manipulation using |, &, ^, ~, <<, >> operators',
    'Checking, setting, clearing, or toggling individual bits',
    'Efficient state representation using bitmasks',
    'XOR properties (a^a=0, a^0=a) for duplicate/missing number problems',
    'Bit-level hacks for optimization (popcount, power-of-two checks, etc.)',
  ],
  whenAtThisStep: 'Confirm bit manipulation fits: bitwise operators as core mechanism, efficient bit-level computation.',
  xray: [
    { text: '**single-bit ops** — set, clear, toggle, check individual bits', kind: 'signal' },
    { text: '**multiple-bit ops** — clear/extract rightmost set bit, clear ranges', kind: 'signal' },
    { text: '**bit counting** — popcount, parity, bit reversal', kind: 'signal' },
    { text: '**shifting** — logical shifts, mul/div by powers of two, rotation', kind: 'signal' },
    { text: '**XOR tricks** — find unique/missing, swap, cancel pairs', kind: 'signal' },
    { text: '**AND/OR masking** — extract, set, toggle via masks; range ops', kind: 'signal' },
    { text: '**bitmask DP** — subset state, TSP, state compression', kind: 'signal' },
    { text: '**bit hacks** — Kernighan, power checks, Gosper, fast mul', kind: 'constraint' },
    { text: '**bit trie** — insert by bits, max XOR queries', kind: 'constraint' },
  ],
  budget: ['bitwise ops', 'single bit', 'xor', 'masking', 'shift', 'lsb ops', 'popcount', 'bitmask dp', 'bit trie'],
  sayIt: [
    'Are we manipulating individual bits using |, &, ^, ~, <<, >>?',
    'Do we need to represent state compactly using bitmasks?',
    'Could XOR properties (a^a=0, a^0=a) help find a unique or missing element?',
    'Is this about bit-level hacks for efficiency: popcount, power checks, bit reversal?',
    'Are we doing DP over subsets using bitmask state representation?',
  ],
  branchGuides: {
    'basic-bit-ops-step2': {
      proceed: 'WHEN: fundamental bit operations — set, clear, toggle, check, shift, count, and simple patterns',
    },
    'bit-manip-apps-step2': {
      proceed: 'WHEN: applied bit manipulation — math with bits, XOR tricks, masking, Gray code, state repr',
    },
    'bitwise-dp-step2': {
      proceed: 'WHEN: DP over bitmask states — subset DP, TSP, state compression, binary search + bits',
    },
    'bit-tricks-step2': {
      proceed: 'WHEN: clever bit hacks — Kernighan, power checks, fast mul, Gosper, bit trie, bit sorting',
    },
  },
  notThisPattern: [
    { signal: 'Regular arithmetic without bitwise tricks', actually: 'Use standard arithmetic — bitwise is unnecessary overhead' },
    { signal: 'DP without state compression requirement', actually: 'Use regular DP — bitmask not needed if n is large' },
  ],
  misidentify: [
    {
      cause: 'Using bit manipulation where simple arithmetic or data structures suffice',
      wrong: 'Implement XOR-based solution for simple addition',
      testCase: 'Add two numbers — regular + operator works',
      fix: 'Use the + operator unless the problem explicitly bans it',
    },
    {
      cause: 'Over-engineering with bitmask DP when problem size is too large',
      wrong: 'Use 2^n bitmask DP for n=30+ elements',
      testCase: 'Subset sum with 100 elements',
      fix: 'Use meet-in-the-middle or greedy; bitmask DP is for n <= 20 typically',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'bm-root': d({
    whenAtThisStep: 'You identified bit manipulation as the tool. Now narrow down the domain.',
    xray: [
      { text: '**basic bit operations**: set, clear, toggle, check, shift, count bits', kind: 'signal' },
      { text: '**bit manipulation applications**: math with bits, XOR, AND/OR, state repr', kind: 'signal' },
      { text: '**bitwise dynamic programming**: subset DP, TSP, state compression', kind: 'signal' },
      { text: '**bit tricks & optimizations**: Kernighan, power checks, fast mul, bit trie', kind: 'signal' },
    ],
    budget: ['basic ops', 'applications', 'bitmask dp', 'bit tricks'],
    sayIt: ['Basic bit operations, applied bit manipulation, bitmask DP, or clever bit tricks?'],
    branchGuides: {
      'basic-bit-ops-step2': { proceed: 'yes — fundamental bit ops: set, clear, toggle, check, shift, count' },
      'bit-manip-apps-step2': { proceed: 'yes — applied: bit math, XOR tricks, AND/OR, state representation' },
      'bitwise-dp-step2': { proceed: 'yes — DP with bitmask state: subsets, TSP, state compression' },
      'bit-tricks-step2': { proceed: 'yes — clever hacks: Kernighan, power checks, fast mul, bit trie' },
    },
    notThisPattern: [
      { signal: 'Regular data structures or algorithms without bit-level operations', actually: 'Use appropriate data structure without bit manipulation' },
    ],
  }),

  'basic-bit-ops-step2': d({
    whenAtThisStep: 'Fundamental bit operations. Which category?',
    xray: [
      { text: '**single bit ops**: set, clear, toggle, check a specific bit', kind: 'signal' },
      { text: '**multiple bit ops**: clear/extract rightmost set bit, clear ranges', kind: 'signal' },
      { text: '**bit counting**: popcount, parity checking, bit reversal', kind: 'signal' },
      { text: '**bit shifting**: logical shifts, mul/div by 2^k, rotation', kind: 'signal' },
    ],
    budget: ['single bit', 'multiple bit', 'bit counting', 'shifting'],
    sayIt: ['Single bit operations, multiple bit patterns, bit counting, or shifting techniques?'],
    branchGuides: {
      'single-bit-ops-step3': { proceed: 'yes — set, clear, toggle, or check an individual bit' },
      'multiple-bit-ops-step3': { proceed: 'yes — clear/extract rightmost set bit, clear LSB range' },
      'bit-counting-step3': { proceed: 'yes — count set bits, parity, or reverse bit order' },
      'bit-shifting-step3': { proceed: 'yes — logical shifts, mul/div by powers of two, rotation' },
    },
    notThisPattern: [
      { signal: 'Applied bit manipulation, not basic ops', actually: 'Use bit manipulation applications family' },
    ],
  }),

  'single-bit-ops-step3': d({
    whenAtThisStep: 'Manipulating an individual bit. Which operation?',
    xray: [
      { text: '**set**: num | (1 << i) — force bit i to 1', kind: 'signal' },
      { text: '**clear**: num & ~(1 << i) — force bit i to 0', kind: 'signal' },
      { text: '**toggle**: num ^ (1 << i) — flip bit i', kind: 'signal' },
      { text: '**check**: (num >> i) & 1 — test if bit i is set', kind: 'signal' },
    ],
    budget: ['set bit', 'clear bit', 'toggle bit', 'check bit'],
    sayIt: ['Set a bit to 1, clear to 0, toggle (flip), or check if a bit is set?'],
    branchGuides: {
      'set-bit': { proceed: 'set: num | (1 << i) — force bit to 1 (LC 1486)' },
      'clear-bit': { proceed: 'clear: num & ~(1 << i) — force bit to 0 (LC 1342)' },
      'toggle-bit': { proceed: 'toggle: num ^ (1 << i) — flip bit value (LC 1506)' },
      'check-bit': { proceed: 'check: (num >> i) & 1 — test if set (LC 191, 461)' },
    },
    notThisPattern: [
      { signal: 'Need to operate on multiple bits', actually: 'Use multiple bit operations' },
    ],
  }),

  'multiple-bit-ops-step3': d({
    whenAtThisStep: 'Operating on ranges or patterns of bits. Which technique?',
    xray: [
      { text: '**clear rightmost set bit**: n & (n - 1) — strip LSB', kind: 'signal' },
      { text: '**extract rightmost set bit**: n & -n — isolate LSB', kind: 'signal' },
      { text: '**clear LSB to i**: n & ~((1 << (i+1)) - 1) — clear lower bits', kind: 'signal' },
    ],
    budget: ['clear rmsb', 'extract rmsb', 'clear lsb range'],
    sayIt: ['Clear rightmost set bit, extract rightmost set bit, or clear all bits from LSB to position i?'],
    branchGuides: {
      'clear-rmsb': { proceed: 'clear rmsb: n & (n-1) — strip lowest set bit (LC 231)' },
      'extract-rmsb': { proceed: 'extract rmsb: n & -n — isolate lowest set bit (LC 260, 201)' },
      'clear-lsb-to-i': { proceed: 'clear LSB to i: n & ~((1 << (i+1)) - 1) — clear lower bits (LC 371)' },
    },
    notThisPattern: [
      { signal: 'Need single bit operation', actually: 'Use single bit operations' },
    ],
  }),

  'bit-counting-step3': d({
    whenAtThisStep: 'Bit counting or manipulation of all bits. Which operation?',
    xray: [
      { text: '**popcount**: count number of 1 bits (loop or builtin)', kind: 'signal' },
      { text: '**parity**: 1 if odd number of set bits, 0 if even', kind: 'signal' },
      { text: '**bit reversal**: reverse the bit order of an integer', kind: 'signal' },
    ],
    budget: ['popcount', 'parity', 'bit reversal'],
    sayIt: ['Count set bits, compute parity (odd/even count), or reverse bit order?'],
    branchGuides: {
      'count-set-bits': { proceed: 'popcount: count 1 bits via loop or builtin (LC 191, 338)' },
      'parity-check': { proceed: 'parity: XOR of all bits — 1 for odd, 0 for even (LC 1386)' },
      'bit-reversal-leaf': { proceed: 'reverse: reverse 32-bit bit order (LC 190, 1009)' },
    },
    notThisPattern: [
      { signal: 'Need to set/clear/toggle specific bits', actually: 'Use single or multiple bit operations' },
    ],
  }),

  'bit-shifting-step3': d({
    whenAtThisStep: 'Bit shifting techniques. Which operation?',
    xray: [
      { text: '**logical shifts**: << left, >> right (signed vs unsigned)', kind: 'signal' },
      { text: '**mul/div by 2^k**: x << k multiplies, x >> k divides', kind: 'signal' },
      { text: '**bit rotation**: circular shift left or right by d', kind: 'signal' },
    ],
    budget: ['logical shift', 'mul div pow2', 'rotation'],
    sayIt: ['Logical shifts, multiply/divide by powers of two, or circular bit rotation?'],
    branchGuides: {
      'logical-shifts': { proceed: 'logical: << left, >> right — signed vs unsigned matters (LC 29, 7)' },
      'mul-div-pow2': { proceed: 'mul/div: x << k multiply, x >> k divide by 2^k (LC 50, 372)' },
      'bit-rotation': { proceed: 'rotate: (n << d) | (n >> (32-d)) — circular shift (LC 1238)' },
    },
    notThisPattern: [
      { signal: 'Need bit counting, not shifting', actually: 'Use bit counting category' },
    ],
  }),

  'bit-manip-apps-step2': d({
    whenAtThisStep: 'Applied bit manipulation. Which domain?',
    xray: [
      { text: '**bit math**: add/sub/mul/div using bitwise operators', kind: 'signal' },
      { text: '**XOR applications**: find unique, missing, swap values', kind: 'signal' },
      { text: '**AND/OR applications**: masking, range operations, Gray code', kind: 'signal' },
      { text: '**state representation**: bit vectors, flags, visited masks', kind: 'signal' },
    ],
    budget: ['bit math', 'xor apps', 'and/or apps', 'state repr'],
    sayIt: ['Bit-based arithmetic, XOR tricks, AND/OR patterns, or state representation with bits?'],
    branchGuides: {
      'bit-math-step3': { proceed: 'yes — bitwise arithmetic: add, subtract, multiply, divide without +/-/*/' },
      'xor-apps-step3': { proceed: 'yes — XOR patterns: single number, missing number, swap' },
      'and-or-apps-step3': { proceed: 'yes — AND/OR: masking, range operations, Gray code' },
      'state-repr-step3': { proceed: 'yes — state representation: bit vector, flags, visited mask' },
    },
    notThisPattern: [
      { signal: 'Basic set/clear/toggle operations', actually: 'Use basic bit operations family' },
    ],
  }),

  'bit-math-step3': d({
    whenAtThisStep: 'Bit-based arithmetic. Which operation?',
    xray: [
      { text: '**addition**: XOR for sum, AND+shift for carry', kind: 'signal' },
      { text: '**subtraction**: XOR with borrow = (~a) & b', kind: 'signal' },
      { text: '**multiplication/division**: shift-and-add, repeated subtraction', kind: 'signal' },
    ],
    budget: ['add', 'subtract', 'mul div'],
    sayIt: ['Addition without +, subtraction without -, or bitwise multiplication/division?'],
    branchGuides: {
      'add-without-plus': { proceed: 'add: XOR sum + AND carry shift (LC 371)' },
      'sub-without-minus': { proceed: 'sub: XOR with borrow = (~a) & b (LC 371)' },
      'mul-div-bit': { proceed: 'mul/div: shift-and-add, repeated subtraction (LC 29)' },
    },
    notThisPattern: [
      { signal: 'Standard arithmetic with +, -, *, / is allowed', actually: 'Use regular operators — simpler and safer' },
    ],
  }),

  'xor-apps-step3': d({
    whenAtThisStep: 'XOR-based problem-solving. Which pattern?',
    xray: [
      { text: '**single number**: XOR all; duplicates cancel', kind: 'signal' },
      { text: '**missing number**: XOR indices+1 with values', kind: 'signal' },
      { text: '**XOR swap**: a ^= b; b ^= a; a ^= b — no temp', kind: 'signal' },
    ],
    budget: ['single number', 'missing number', 'xor swap'],
    sayIt: ['Find unique element (duplicates cancel), find missing number, or swap using XOR?'],
    branchGuides: {
      'find-single-num': { proceed: 'single number: XOR all — duplicates cancel to 0 (LC 136, 137, 260)' },
      'find-missing-num': { proceed: 'missing: XOR index+1 with values (LC 268, 389)' },
      'swap-values': { proceed: 'swap: a^=b; b^=a; a^=b — no temporary (LC 1720)' },
    },
    notThisPattern: [
      { signal: 'Need AND/OR operations, not XOR', actually: 'Use AND/OR applications' },
    ],
  }),

  'and-or-apps-step3': d({
    whenAtThisStep: 'AND/OR patterns. Which application?',
    xray: [
      { text: '**bit masking**: AND to extract, OR to set, XOR to toggle', kind: 'signal' },
      { text: '**range AND/OR**: find common prefix for [l, r] range', kind: 'signal' },
      { text: '**Gray code**: i ^ (i >> 1) — adjacent differ by one bit', kind: 'signal' },
    ],
    budget: ['masking', 'range ops', 'gray code'],
    sayIt: ['Bit masking with AND/OR, range AND/OR operations, or Gray code generation?'],
    branchGuides: {
      'bit-masking': { proceed: 'masking: AND extract, OR set, XOR toggle via masks (LC 1178, 187)' },
      'range-ops': { proceed: 'range: bitwise AND/OR over [l, r] find common prefix (LC 201, 898)' },
      'gray-code-leaf': { proceed: 'Gray code: i ^ (i >> 1) — one bit changes per step (LC 89, 1611)' },
    },
    notThisPattern: [
      { signal: 'Need XOR-based single number pattern', actually: 'Use XOR applications' },
    ],
  }),

  'state-repr-step3': d({
    whenAtThisStep: 'Representing state with bits. Which technique?',
    xray: [
      { text: '**bit vector**: compact boolean array using int bits', kind: 'signal' },
      { text: '**bit flags**: enumerate subsets via bitmask', kind: 'signal' },
      { text: '**visited bitmask**: track visited nodes in BFS/DFS', kind: 'signal' },
    ],
    budget: ['bit vector', 'bit flags', 'visited mask'],
    sayIt: ['Bit vector as compact boolean array, bit flags for subset enumeration, or bitmask for visited states in graph search?'],
    branchGuides: {
      'bit-vector': { proceed: 'bit vector: compact boolean array (LC 1461, 421)' },
      'bit-flags': { proceed: 'bit flags: subset enumeration via mask (LC 78, 1286)' },
      'bitmask-visited': { proceed: 'visited mask: BFS/DFS over (node, mask) states (LC 847)' },
    },
    notThisPattern: [
      { signal: 'Simple visited tracking with bool array', actually: 'Use a plain boolean array — simpler for small n' },
    ],
  }),

  'bitwise-dp-step2': d({
    whenAtThisStep: 'DP with bitmask state. Which category?',
    xray: [
      { text: '**bitmask DP**: dp[mask] over subsets, TSP with bitmask', kind: 'signal' },
      { text: '**state compression DP**: compress row/group state into bitmask', kind: 'signal' },
      { text: '**binary search + bits**: merge BS or greedy with bitwise ops', kind: 'signal' },
    ],
    budget: ['bitmask dp', 'state compression', 'binary search bit'],
    sayIt: ['Subset DP/TSP with bitmask, row/group state compression, or binary search/greedy combined with bit operations?'],
    branchGuides: {
      'bitmask-dp-step3': { proceed: 'yes — bitmask DP: subset state, TSP with mask' },
      'state-compression-dp-step3': { proceed: 'yes — state compression: seating, connections, hats' },
      'binary-search-bit-step3': { proceed: 'yes — binary search/greedy + bit ops: AND sets, max XOR, distribute' },
    },
    notThisPattern: [
      { signal: 'No DP involved, just bit manipulation', actually: 'Use basic bit ops or applications family' },
    ],
  }),

  'bitmask-dp-step3': d({
    whenAtThisStep: 'DP over subsets. Which variant?',
    xray: [
      { text: '**subset state**: dp[mask] = min/max over subsets', kind: 'signal' },
      { text: '**TSP**: dp[mask][last] = min cost to visit mask ending at last', kind: 'signal' },
    ],
    budget: ['subset dp', 'tsp'],
    sayIt: ['General subset DP (smallest team, parallel courses) or TSP bitmask (shortest superstring, visit all nodes)?'],
    branchGuides: {
      'subset-state-dp': { proceed: 'subset DP: dp[mask] min/max over subsets (LC 1125, 1494)' },
      'tsp-bitmask': { proceed: 'TSP: dp[mask][last] min tour cost (LC 943, 847)' },
    },
    notThisPattern: [
      { signal: 'Row-by-row state compression, not subset DP', actually: 'Use state compression DP' },
    ],
  }),

  'state-compression-dp-step3': d({
    whenAtThisStep: 'State compression DP. Which problem type?',
    xray: [
      { text: '**max students exam**: row DP with adjacent constraints', kind: 'signal' },
      { text: '**min cost connect groups**: DP over first group mask', kind: 'signal' },
      { text: '**ways to wear hats**: DP over hat types, person mask', kind: 'signal' },
    ],
    budget: ['max students', 'connect groups', 'ways hats'],
    sayIt: ['Maximum students in exam hall, minimum cost to connect two groups, or ways to assign hats to people?'],
    branchGuides: {
      'max-students-exam': { proceed: 'max students: row DP with bitmask adjacency constraints (LC 1349)' },
      'min-cost-connect-groups': { proceed: 'connect groups: DP over mask of first group (LC 1595)' },
      'ways-wear-hats': { proceed: 'ways hats: DP over hat types with person mask (LC 1434)' },
    },
    notThisPattern: [
      { signal: 'General subset DP without row/group structure', actually: 'Use bitmask DP family' },
    ],
  }),

  'binary-search-bit-step3': d({
    whenAtThisStep: 'Binary search or greedy with bit ops. Which pattern?',
    xray: [
      { text: '**mysterious function**: track AND values ending at each index', kind: 'signal' },
      { text: '**distribute repeating**: DP over frequencies and quantity masks', kind: 'signal' },
      { text: '**max XOR**: greedy from MSB with prefix set', kind: 'signal' },
    ],
    budget: ['mysterious', 'distribute', 'max xor'],
    sayIt: ['Track AND values closest to target, distribute quantities with bitmask DP, or find max XOR of two numbers?'],
    branchGuides: {
      'mysterious-function': { proceed: 'mysterious: track AND values ending at each index (LC 1521)' },
      'distribute-repeating': { proceed: 'distribute: DP over frequencies, quantity masks (LC 1655)' },
      'max-xor-array': { proceed: 'max XOR: greedy from MSB with prefix set (LC 421)' },
    },
    notThisPattern: [
      { signal: 'Pure DP without binary search or greedy bits', actually: 'Use bitmask DP or state compression DP' },
    ],
  }),

  'bit-tricks-step2': d({
    whenAtThisStep: 'Clever bit tricks and optimizations. Which category?',
    xray: [
      { text: '**bit hacks**: Kernighan count, power-of-two/four checks', kind: 'signal' },
      { text: '**advanced bitwise**: fast mul, Gosper next same bits, int log', kind: 'signal' },
      { text: '**bit in other algos**: sorting by bits, hashing with bits, bit trie', kind: 'signal' },
    ],
    budget: ['bit hacks', 'advanced bitwise', 'bit other'],
    sayIt: ['Classic bit tricks, advanced bitwise techniques, or bit manipulation in other algorithm domains?'],
    branchGuides: {
      'bit-hacks-step3': { proceed: 'yes — bit hacks: Kernighan, power of two/four checks' },
      'adv-bitwise-step3': { proceed: 'yes — advanced: fast mul, Gosper hack, integer log' },
      'bit-other-step3': { proceed: 'yes — other algos: sorting, hashing, trie with bits' },
    },
    notThisPattern: [
      { signal: 'Not a trick or optimization, just basic bit ops', actually: 'Use basic bit operations family' },
    ],
  }),

  'bit-hacks-step3': d({
    whenAtThisStep: 'Classic bit-level tricks. Which hack?',
    xray: [
      { text: "**Kernighan's**: n &= n - 1 — clear lowest set bit per iteration", kind: 'signal' },
      { text: '**power of two**: n > 0 && (n & (n-1)) == 0', kind: 'signal' },
      { text: '**power of four**: power of two && (n & 0x55555555) != 0', kind: 'signal' },
    ],
    budget: ['kernighan', 'power of two', 'power of four'],
    sayIt: ["Brian Kernighan's popcount, power-of-two check, or power-of-four check?"],
    branchGuides: {
      'kernighan-count': { proceed: "Kernighan: n &= n-1 — count set bits efficiently (LC 338)" },
      'power-of-two-leaf': { proceed: 'power of two: n > 0 && (n & (n-1)) == 0 (LC 231, 342)' },
      'power-of-four': { proceed: 'power of four: pow2 && (n & 0x55555555) != 0 (LC 342)' },
    },
    notThisPattern: [
      { signal: 'Need population count via loop, not Kernighan', actually: 'Use bit counting category' },
    ],
  }),

  'adv-bitwise-step3': d({
    whenAtThisStep: 'Advanced bitwise techniques. Which technique?',
    xray: [
      { text: '**fast multiplication**: Russian peasant — shift and add', kind: 'signal' },
      { text: "**Gosper's hack**: next number with same popcount", kind: 'signal' },
      { text: '**integer log**: floor(log2(n)) by repeated right shift', kind: 'signal' },
    ],
    budget: ['fast mul', 'gosper', 'int log'],
    sayIt: ["Fast bitwise multiplication, Gosper's next same bit count, or integer logarithm floor(log2(n))?"],
    branchGuides: {
      'fast-mul': { proceed: 'fast mul: Russian peasant shift-and-add (LC 29)' },
      'next-same-bits': { proceed: "Gosper: next number with same popcount (LC 1611)" },
      'int-log': { proceed: 'int log: floor(log2(n)) via right shift (LC 338)' },
    },
    notThisPattern: [
      { signal: 'Need basic bit hacks like power-of-two checks', actually: 'Use bit hacks category' },
    ],
  }),

  'bit-other-step3': d({
    whenAtThisStep: 'Bit manipulation in other algorithms. Which area?',
    xray: [
      { text: '**sorting**: sort by number of set bits', kind: 'signal' },
      { text: '**hashing**: encode data as bits for rolling hash', kind: 'signal' },
      { text: '**trie**: binary trie for max XOR queries', kind: 'signal' },
    ],
    budget: ['sorting', 'hashing', 'trie'],
    sayIt: ['Sorting by bit count, rolling bit hash, or binary trie for max XOR?'],
    branchGuides: {
      'bit-sorting': { proceed: 'sorting: custom comparator using popcount (LC 1356)' },
      'bit-hashing': { proceed: 'hashing: encode chars as bits for rolling hash (LC 187)' },
      'bit-trie': { proceed: 'trie: binary trie insert, max XOR query (LC 421)' },
    },
    notThisPattern: [
      { signal: 'Pure bit manipulation without other data structures', actually: 'Use bit hacks or advanced bitwise category' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
