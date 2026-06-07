import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const singleBitOpsStep3: TaxonomyNode = decision(
  'single-bit-ops-step3',
  'Single Bit Operations',
  'teal',
  3,
  'Manipulate individual bits. Which operation?',
  [
    branch(
      ['"set bit"', '"set"', '| (1 << i)', '"masked or"'],
      'Set a Bit',
      'Set bit i to 1: num | (1 << i).',
      L.setBit,
    ),
    branch(
      ['"clear bit"', '"clear"', '& ~(1 << i)', '"unset"'],
      'Clear a Bit',
      'Clear bit i to 0: num & ~(1 << i).',
      L.clearBit,
    ),
    branch(
      ['"toggle bit"', '"toggle"', '^ (1 << i)', '"flip"', '"xor bit"'],
      'Toggle a Bit',
      'Flip bit i: num ^ (1 << i).',
      L.toggleBit,
    ),
    branch(
      ['"check bit"', '"check"', '>> i & 1', '"test bit"', '"get bit"'],
      'Check a Bit',
      'Check if bit i is set: (num >> i) & 1.',
      L.checkBit,
    ),
  ],
)

const multipleBitOpsStep3: TaxonomyNode = decision(
  'multiple-bit-ops-step3',
  'Multiple Bit Operations',
  'teal',
  3,
  'Operate on ranges or patterns of bits. Which technique?',
  [
    branch(
      ['"clear rmsb"', '"clear rightmost"', 'n & (n-1)', '"strip lsb"'],
      'Clear Rightmost Set Bit',
      'Remove the lowest set bit: n & (n - 1).',
      L.clearRmsb,
    ),
    branch(
      ['"extract rmsb"', '"extract rightmost"', 'n & -n', '"isolate lsb"'],
      'Extract Rightmost Set Bit',
      'Isolate the lowest set bit: n & -n.',
      L.extractRmsb,
    ),
    branch(
      ['"clear lsb to i"', '"clear range"', '& ~((1 << (i+1)) - 1)', '"clear lower"'],
      'Clear Bits LSB to ith',
      'Clear all bits from position 0 to i: n & ~((1 << (i+1)) - 1).',
      L.clearLsbToI,
    ),
  ],
)

const bitCountingStep3: TaxonomyNode = decision(
  'bit-counting-step3',
  'Bit Counting & Manipulation',
  'teal',
  3,
  'Count, check parity, or reverse bits. Which operation?',
  [
    branch(
      ['"count set bits"', '"popcount"', '"number of 1s"', '"count bits"'],
      'Count Set Bits',
      'Iteratively count 1 bits using n & 1; or use builtin popcount.',
      L.countSetBits,
    ),
    branch(
      ['"parity"', '"even odd"', '"parity check"', '"xor parity"'],
      'Parity Checking',
      'Return 1 if odd number of set bits, 0 if even.',
      L.parityCheck,
    ),
    branch(
      ['"reverse bits"', '"bit reversal"', '"reverse"', '"mirror bits"'],
      'Bit Reversal',
      'Reverse the bit order of an integer (usually 32-bit).',
      L.bitReversal,
    ),
  ],
)

const bitShiftingStep3: TaxonomyNode = decision(
  'bit-shifting-step3',
  'Bit Shifting Techniques',
  'teal',
  3,
  'Shift, multiply/divide by powers of two, or rotate. Which technique?',
  [
    branch(
      ['"logical shift"', '"left shift"', '"right shift"', '<<', '>>', '"unsigned shift"'],
      'Logical Shifts',
      'Left shift (<<) and unsigned right shift (>>). Signed vs unsigned matter.',
      L.logicalShifts,
    ),
    branch(
      ['"mul by pow2"', '"div by pow2"', '"multiply"', '"divide"', '"shift mul"'],
      'Multiplication/Division by Powers of 2',
      'x << k multiplies by 2^k; x >> k divides (use unsigned for safety).',
      L.mulDivPow2,
    ),
    branch(
      ['"rotate"', '"rotation"', '"circular shift"', '"rol"', '"ror"'],
      'Bit Rotation',
      'Circular shift: rotate bits left or right by d positions.',
      L.bitRotation,
    ),
  ],
)

const basicBitOpsStep2: TaxonomyNode = decision(
  'basic-bit-ops-step2',
  'Basic Bit Operations',
  'teal',
  2,
  'Fundamental bit manipulation operations. Which category?',
  [
    branch(
      ['"set bit"', '"clear bit"', '"toggle"', '"check bit"', '"single bit"'],
      'Single Bit Operations',
      'Set, clear, toggle, or check individual bits.',
      singleBitOpsStep3,
    ),
    branch(
      ['"clear rightmost"', '"extract rightmost"', '"clear lsb"', '"n & (n-1)"', '"n & -n"'],
      'Multiple Bit Operations',
      'Operate on ranges or specific patterns of bits.',
      multipleBitOpsStep3,
    ),
    branch(
      ['"count set bits"', '"popcount"', '"parity"', '"reverse bits"', '"bit count"'],
      'Bit Counting & Manipulation',
      'Count set bits, compute parity, or reverse bit order.',
      bitCountingStep3,
    ),
    branch(
      ['"shift"', '"left shift"', '"right shift"', '"rotate"', '"mul div pow2"'],
      'Bit Shifting Techniques',
      'Logical shifts, multiply/divide by powers of two, bit rotation.',
      bitShiftingStep3,
    ),
  ],
)

const bitMathStep3: TaxonomyNode = decision(
  'bit-math-step3',
  'Bit-Based Math Operations',
  'blue',
  3,
  'Arithmetic using bitwise operations. Which operation?',
  [
    branch(
      ['"add"', '"plus"', '"sum"', '"addition"', '"without +"'],
      'Addition without +',
      'Add two integers using XOR (sum) and AND+shift (carry).',
      L.addWithoutPlus,
    ),
    branch(
      ['"subtract"', '"minus"', '"sub"', '"subtraction"', '"without -"'],
      'Subtraction without -',
      'Subtract b from a using XOR and borrow = (~a) & b.',
      L.subWithoutMinus,
    ),
    branch(
      ['"multiply"', '"divide"', '"mul"', '"div"', '"bitwise mul/div"'],
      'Multiplication/Division (bitwise)',
      'Shift-and-add multiplication; repeated subtraction for division.',
      L.mulDivBit,
    ),
  ],
)

const xorAppsStep3: TaxonomyNode = decision(
  'xor-apps-step3',
  'XOR Applications',
  'blue',
  3,
  'XOR-based problem-solving patterns. Which pattern?',
  [
    branch(
      ['"single number"', '"find unique"', '"xor all"', '"cancels pair"', '"non-duplicate"'],
      'Finding Single Number',
      'XOR all elements; duplicates cancel (a ^ a = 0), leaving the unique element.',
      L.findSingleNum,
    ),
    branch(
      ['"missing number"', '"find missing"', '"xor with index"', '"missing"'],
      'Finding Missing Number',
      'XOR all indices+1 and values; the remaining value is the missing number.',
      L.findMissingNum,
    ),
    branch(
      ['"swap"', '"xor swap"', '"swap values"', '"no temp"', '"without temp"'],
      'Swapping Values (XOR swap)',
      'Swap two variables without a temporary: a ^= b; b ^= a; a ^= b.',
      L.swapValues,
    ),
  ],
)

const andOrAppsStep3: TaxonomyNode = decision(
  'and-or-apps-step3',
  'AND/OR Applications',
  'blue',
  3,
  'AND/OR patterns in problems. Which application?',
  [
    branch(
      ['"mask"', '"masking"', '"bitmask"', '"and mask"', '"or mask"'],
      'Bit Masking',
      'AND to extract bits, OR to set bits, XOR to toggle bits via masks.',
      L.bitMasking,
    ),
    branch(
      ['"range and"', '"range or"', '"range operation"', '"bitwise and range"'],
      'Range Operations (AND/OR)',
      'Compute bitwise AND/OR over a range [l, r] by finding common prefix.',
      L.rangeOps,
    ),
    branch(
      ['"gray code"', '"gray"', '"binary to gray"', 'i ^ (i>>1)'],
      'Gray Code',
      'Generate n-bit Gray code: i ^ (i >> 1) — adjacent values differ by one bit.',
      L.grayCode,
    ),
  ],
)

const stateReprStep3: TaxonomyNode = decision(
  'state-repr-step3',
  'State Representation',
  'blue',
  3,
  'Represent state or sets with bits. Which technique?',
  [
    branch(
      ['"bit vector"', '"bitset"', '"boolean array"', '"compact"', '"memory"'],
      'Bit Vector',
      'Compact boolean array using integer bits — memory-efficient membership.',
      L.bitVector,
    ),
    branch(
      ['"bit flag"', '"subset"', '"enumeration"', '"mask flag"', '"bitmask subset"'],
      'Bit Flags',
      'Use bitmask to enumerate subsets or represent active/inactive flags.',
      L.bitFlags,
    ),
    branch(
      ['"visited bitmask"', '"state mask"', '"bfs mask"', '"shortest path mask"'],
      'Bitmask for Visited States',
      'Track visited nodes in graph search using a bitmask of visited set.',
      L.bitmaskVisited,
    ),
  ],
)

const bitManipAppsStep2: TaxonomyNode = decision(
  'bit-manip-apps-step2',
  'Bit Manipulation Applications',
  'blue',
  2,
  'Applied bit manipulation patterns. Which domain?',
  [
    branch(
      ['"add"', '"subtract"', '"multiply"', '"divide"', '"bit math"', '"arithmetic"'],
      'Bit-Based Math Operations',
      'Arithmetic using bitwise ops: add, subtract, multiply, divide.',
      bitMathStep3,
    ),
    branch(
      ['"xor"', '"xor app"', '"single number"', '"missing"', '"swap"'],
      'XOR Applications',
      'XOR-based patterns: find unique, missing numbers, swap values.',
      xorAppsStep3,
    ),
    branch(
      ['"and/or"', '"masking"', '"range"', '"gray code"', '"and or app"'],
      'AND/OR Applications',
      'AND/OR patterns: masking, range operations, Gray code.',
      andOrAppsStep3,
    ),
    branch(
      ['"state"', '"bit vector"', '"bit flag"', '"visited"', '"subset"', '"representation"'],
      'State Representation',
      'Represent sets or state compactly using bit vectors and flags.',
      stateReprStep3,
    ),
  ],
)

const bitmaskDpStep3: TaxonomyNode = decision(
  'bitmask-dp-step3',
  'Bitmask DP',
  'purple',
  3,
  'DP over subsets represented as bitmasks. Which variant?',
  [
    branch(
      ['"subset state"', '"subset dp"', '"mask dp"', '"smallest team"', '"dp[mask]"'],
      'Subset State Problems (Bitmask DP)',
      'dp[mask] = min/max over subsets; enumerate submasks for transitions.',
      L.subsetStateDp,
    ),
    branch(
      ['"tsp"', '"traveling salesman"', '"shortest superstring"', '"hamiltonian"'],
      'Traveling Salesman Problem',
      'dp[mask][last] = min cost to visit mask ending at node last.',
      L.tspBitmask,
    ),
  ],
)

const stateCompressionDpStep3: TaxonomyNode = decision(
  'state-compression-dp-step3',
  'State Compression DP',
  'purple',
  3,
  'Compress state into bitmask for DP. Which problem type?',
  [
    branch(
      ['"max students"', '"exam"', '"row dp"', '"seating"', '"adjacent"'],
      'Maximum Students Taking Exam',
      'Row-by-row DP with bitmask constraints: no adjacent students.',
      L.maxStudentsExam,
    ),
    branch(
      ['"connect groups"', '"min cost"', '"group mask"', '"two groups"'],
      'Minimum Cost to Connect Groups',
      'DP over first group mask; each second-group point connects to first.',
      L.minCostConnectGroups,
    ),
    branch(
      ['"hats"', '"ways wear"', '"ways hats"', '"person mask"'],
      'Ways to Wear Different Hats',
      'DP over hat types; dp[mask] = ways to cover person subset.',
      L.waysWearHats,
    ),
  ],
)

const binarySearchBitStep3: TaxonomyNode = decision(
  'binary-search-bit-step3',
  'Binary Search + Bit Manipulation',
  'purple',
  3,
  'Combine binary search or greedy with bit operations. Which pattern?',
  [
    branch(
      ['"mysterious"', '"closest target"', '"and values"', '"bit and set"'],
      'Mysterious Function Closest to Target',
      'Track all possible AND values ending at each index; at most 32 distinct.',
      L.mysteriousFunction,
    ),
    branch(
      ['"distribute"', '"repeating"', '"quantity"', '"customer"', '"freq mask"'],
      'Distribute Repeating Integers',
      'DP over unique number frequencies and customer quantity masks.',
      L.distributeRepeating,
    ),
    branch(
      ['"max xor"', '"maximum xor"', '"greedy xor"', '"prefix xor"', '"xor pair"'],
      'Maximum XOR of Two Numbers',
      'Greedy from MSB: maintain prefix set; check if candidate XOR prefix exists.',
      L.maxXorArray,
    ),
  ],
)

const bitwiseDpStep2: TaxonomyNode = decision(
  'bitwise-dp-step2',
  'Bitwise Dynamic Programming',
  'purple',
  2,
  'DP problems using bitmasks for state. Which category?',
  [
    branch(
      ['"bitmask dp"', '"subset dp"', '"dp[mask]"', '"mask dp"', '"submask"'],
      'Bitmask DP',
      'DP over subsets: dp[mask] for subset enumeration, TSP with bitmask.',
      bitmaskDpStep3,
    ),
    branch(
      ['"state compression"', '"row dp"', '"compression"', '"compact state"'],
      'State Compression DP',
      'Compress row/group state into bitmask: seating, connections, hats.',
      stateCompressionDpStep3,
    ),
    branch(
      ['"binary search"', '"greedy xor"', '"and set"', '"distribute"', '"max xor array"'],
      'Binary Search + Bit Manipulation',
      'Merge binary search or greedy with bitwise operations for optimal results.',
      binarySearchBitStep3,
    ),
  ],
)

const bitHacksStep3: TaxonomyNode = decision(
  'bit-hacks-step3',
  'Bit Hacks',
  'amber',
  3,
  'Classic bit-level tricks. Which hack?',
  [
    branch(
      ['"kernighan"', '"brian"', '"n & n-1"', '"popcount"', '"set bits count"'],
      "Brian Kernighan's Algorithm",
      'Count set bits by repeatedly clearing rightmost set bit: n &= n - 1.',
      L.kernighanCount,
    ),
    branch(
      ['"power of two"', '"is power 2"', '"n & n-1 == 0"', '"pow2"'],
      'Check if Power of Two',
      'n > 0 && (n & (n - 1)) == 0 — only one bit set.',
      L.powerOfTwo,
    ),
    branch(
      ['"power of four"', '"is power 4"', '"0x55555555"', '"pow4"'],
      'Check if Power of Four',
      'Power of two AND (n & 0x55555555) != 0 — bit at odd position.',
      L.powerOfFour,
    ),
  ],
)

const advBitwiseStep3: TaxonomyNode = decision(
  'adv-bitwise-step3',
  'Advanced Bitwise Techniques',
  'amber',
  3,
  'Advanced bitwise algorithms. Which technique?',
  [
    branch(
      ['"fast multiply"', '"fast mul"', '"russian peasant"', '"bit mul"', '"shift add"'],
      'Fast Multiplication (bitwise)',
      'Russian peasant multiplication: shift and add for each bit.',
      L.fastMul,
    ),
    branch(
      ['"next same bits"', '"gosper"', '"same popcount"', '"next higher"', '"next combination"'],
      'Next Higher/Lower with Same Bit Count',
      "Gosper's hack: find next number with same number of set bits.",
      L.nextSameBits,
    ),
    branch(
      ['"integer log"', '"log2"', '"floor log"', '"bit length"', '"msb position"'],
      'Integer Logarithm',
      'Compute floor(log2(n)) by repeated right shift.',
      L.intLog,
    ),
  ],
)

const bitOtherStep3: TaxonomyNode = decision(
  'bit-other-step3',
  'Bit Manipulation in Other Algorithms',
  'amber',
  3,
  'Bit manipulation applied in other algorithmic domains. Which area?',
  [
    branch(
      ['"sort by bits"', '"bit sort"', '"popcount sort"', '"custom sort"'],
      'Bit Manipulation in Sorting',
      'Sort elements by number of set bits or using bit-level comparators.',
      L.bitSorting,
    ),
    branch(
      ['"bit hash"', '"rolling hash"', '"dna"', '"encoding"', '"2-bit encode"'],
      'Bit Manipulation in Hashing',
      'Encode data as bits for rolling hash (e.g., 2-bit DNA encoding).',
      L.bitHashing,
    ),
    branch(
      ['"bit trie"', '"binary trie"', '"xor trie"', '"max xor trie"'],
      'Bit Manipulation in Trie',
      'Insert numbers into a binary trie bit by bit for max XOR queries.',
      L.bitTrie,
    ),
  ],
)

const bitTricksStep2: TaxonomyNode = decision(
  'bit-tricks-step2',
  'Bit Tricks & Optimizations',
  'amber',
  2,
  'Optimization tricks and clever bit-level patterns. Which category?',
  [
    branch(
      ['"bit hack"', '"kernighan"', '"power of two"', '"power of four"', '"trick"'],
      'Bit Hacks',
      'Classic bit tricks: count set bits, power-of-two/four checks.',
      bitHacksStep3,
    ),
    branch(
      ['"fast mul"', '"next same"', '"gosper"', '"log2"', '"msb"', '"advanced bit"'],
      'Advanced Bitwise Techniques',
      'Fast multiplication, next number with same popcount, integer log.',
      advBitwiseStep3,
    ),
    branch(
      ['"sort bits"', '"bit hash"', '"bit trie"', '"xor trie"', '"other algo"'],
      'Bit Manipulation in Other Algorithms',
      'Apply bit manipulation to sorting, hashing, and trie data structures.',
      bitOtherStep3,
    ),
  ],
)

export const bmRoot: TaxonomyNode = decision(
  'bm-root',
  'Bit Manipulation Pattern',
  'slate',
  1,
  'Bit manipulation uses bitwise operators for efficient computation. Which domain?',
  [
    branch(
      ['"bit"', '"set"', '"clear"', '"toggle"', '"shift"', '"lsb"', '"mask"'],
      'Basic Bit Operations',
      'Fundamental bit ops: set, clear, toggle, shift, mask individual bits.',
      basicBitOpsStep2,
    ),
    branch(
      ['"xor"', '"xor app"', '"bit math"', '"gray code"', '"masking"', '"and/or"'],
      'Bit Manipulation Applications',
      'Applied bit patterns: math with bits, XOR tricks, masking, Gray code.',
      bitManipAppsStep2,
    ),
    branch(
      ['"bitmask dp"', '"state compression"', '"subset dp"', '"tsp"', '"dp bit"'],
      'Bitwise Dynamic Programming',
      'DP with bitmask state: subset DP, TSP, state compression problems.',
      bitwiseDpStep2,
    ),
    branch(
      ['"bit hack"', '"kernighan"', '"power of two"', '"brian"', '"bit trick"'],
      'Bit Tricks & Optimizations',
      'Clever bit hacks: Kernighan, power checks, fast mul, bit trie.',
      bitTricksStep2,
    ),
  ],
)
