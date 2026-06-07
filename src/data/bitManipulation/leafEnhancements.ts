import type { LeafEnhancement } from '../../types/leafEnhancement'

function e(partial: LeafEnhancement): LeafEnhancement { return partial }

const LEAF_ENHANCEMENTS: Record<string, LeafEnhancement> = {
  // ── Basic Bit Operations ─────────────────────────────────────────

  'set-bit': e({
    xray: [
      { text: '**num | (1 << i)** to set bit i to 1', kind: 'signal' },
      { text: 'O(1) constant time, **bitwise OR**', kind: 'constraint' },
    ],
    budget: ['singleBit', 'bitwiseOps'],
    slottedTemplate: `int setBit(int num, int i) {
    return num | (1 << i);
}`,
    slots: [
      { id: 'SHIFT_AMT', label: 'Shift amount for bit position', hint: '1 << i' },
    ],
    slotFills: {
      1486: { SHIFT_AMT: '1 << i' },
    },
    helixOrder: [1486],
    helixDelta: {
      1486: 'XOR Operation in an Array: set bit using OR with shifted 1. Understand bit positions are 0-indexed.',
    },
    autopsies: [
      {
        cause: 'Bit position off by one — using (1 << (i+1)) instead of (1 << i)',
        wrong: 'return num | (1 << (i + 1));',
        testCase: 'i=0 should set bit 0 (value 1), but sets bit 1 (value 2)',
        fix: 'return num | (1 << i);',
      },
    ],
    sayIt: [
      'Set bit: OR with (1 << i). Sets the i-th bit to 1 regardless of its previous value.',
    ],
  }),

  'clear-bit': e({
    xray: [
      { text: '**num & ~(1 << i)** to clear bit i to 0', kind: 'signal' },
      { text: 'Bitwise NOT **~** inverts mask, & clears', kind: 'constraint' },
    ],
    budget: ['singleBit', 'bitwiseOps'],
    slottedTemplate: `int clearBit(int num, int i) {
    return num & ~(1 << i);
}`,
    slots: [
      { id: 'CLEAR_MASK', label: 'Mask to clear bit', hint: '~(1 << i)' },
    ],
    slotFills: {
      1342: { CLEAR_MASK: '~(1 << i)' },
    },
    helixOrder: [1342],
    helixDelta: {
      1342: 'Number of Steps: clear LSB via n & n-1 or clear arbitrary bit with AND + NOT mask.',
    },
    autopsies: [
      {
        cause: 'Forgetting the bitwise NOT operator',
        wrong: 'return num & (1 << i); // keeps only bit i, clears everything else',
        testCase: 'num=0xFF, i=3 — expected 0xF7, got 0x08',
        fix: 'return num & ~(1 << i); // apply NOT to invert the mask',
      },
    ],
    sayIt: [
      'Clear bit: AND with NOT of (1 << i). Resets the i-th bit to 0.',
    ],
  }),

  'toggle-bit': e({
    xray: [
      { text: '**num ^ (1 << i)** to toggle bit i', kind: 'signal' },
      { text: 'XOR with 1 flips bit, XOR with 0 leaves unchanged', kind: 'constraint' },
    ],
    budget: ['singleBit', 'bitwiseOps', 'xorProperties'],
    slottedTemplate: `int toggleBit(int num, int i) {
    return num ^ (1 << i);
}`,
    slots: [
      { id: 'TOGGLE_XOR', label: 'XOR mask for toggling', hint: '(1 << i)' },
    ],
    slotFills: {
      1506: { TOGGLE_XOR: '1 << i' },
    },
    helixOrder: [1506],
    helixDelta: {
      1506: 'Find Root of N-Ary Tree: XOR toggles bits. Cumulative XOR of all nodes and edges isolates the root.',
    },
    autopsies: [
      {
        cause: 'Using OR instead of XOR for toggling',
        wrong: 'return num | (1 << i); // sets bit, does not toggle',
        testCase: 'num=0xFF, i=3 — expected 0xF7 (toggle off), got 0xFF (still set)',
        fix: 'return num ^ (1 << i); // XOR flips the bit',
      },
    ],
    sayIt: [
      'Toggle bit: XOR with (1 << i). Flips the i-th bit: 0→1, 1→0.',
    ],
  }),

  'check-bit': e({
    xray: [
      { text: '**(num >> i) & 1** to check if bit i is set', kind: 'signal' },
      { text: 'Right shift then AND with 1 extracts the bit', kind: 'constraint' },
    ],
    budget: ['singleBit', 'bitwiseOps', 'bitShift'],
    slottedTemplate: `bool checkBit(int num, int i) {
    return (num >> i) & 1;
}`,
    slots: [
      { id: 'CHECK_EXPR', label: 'Bit check expression', hint: '(num >> i) & 1' },
    ],
    slotFills: {
      191: { CHECK_EXPR: '(num >> i) & 1' },
      461: { CHECK_EXPR: '((x >> i) & 1) != ((y >> i) & 1)' },
    },
    helixOrder: [191, 461],
    helixDelta: {
      191: 'Number of 1 Bits: check each bit by shifting. Loop over all 32 bits and count ones.',
      461: 'Hamming Distance: XOR x and y, then count bits where checkBit differs.',
    },
    autopsies: [
      {
        cause: 'Using signed right shift — sign bit propagates for negative numbers',
        wrong: 'return (num >> i) & 1; // signed shift for negative num',
        testCase: 'num=-1 (all bits set), i=31 — arithmetic shift keeps sign extension',
        fix: 'return ((unsigned int)num >> i) & 1; // use unsigned shift',
      },
    ],
    sayIt: [
      'Check bit: right shift i positions then AND with 1. Returns 1 if bit i is set, 0 otherwise.',
    ],
  }),

  'clear-rmsb': e({
    xray: [
      { text: '**n & (n - 1)** clears the rightmost set bit', kind: 'signal' },
      { text: 'n-1 flips trailing zeros to 1 and rightmost 1 to 0', kind: 'constraint' },
    ],
    budget: ['lsbOps', 'bitHack', 'powerOfTwo'],
    slottedTemplate: `int clearRightmostSetBit(int n) {
    return n & (n - 1);
}`,
    slots: [
      { id: 'RMSB_EXPR', label: 'Rightmost set bit clearing expression', hint: 'n & (n - 1)' },
    ],
    slotFills: {
      231: { RMSB_EXPR: 'n & (n - 1)' },
    },
    helixOrder: [231],
    helixDelta: {
      231: 'Power of Two: n & (n-1) == 0 for powers of two (single bit). Must also check n > 0.',
    },
    autopsies: [
      {
        cause: 'Not handling n = 0 case — n-1 wraps to -1',
        wrong: 'return n & (n - 1); // 0 & -1 = 0, false positive for power of two',
        testCase: 'n=0 returns 0, which is incorrectly treated as power-of-two',
        fix: 'if (n == 0) return 0; or check n > 0 before power-of-two test',
      },
    ],
    sayIt: [
      'Clear rightmost set bit: n & (n-1). Subtracting 1 flips trailing zeros and the rightmost 1. AND clears that bit.',
    ],
  }),

  'extract-rmsb': e({
    xray: [
      { text: '**n & -n** isolates the rightmost set bit', kind: 'signal' },
      { text: 'Two\'s complement negation: -n = ~n + 1', kind: 'constraint' },
    ],
    budget: ['lsbOps', 'bitHack'],
    slottedTemplate: `int extractRightmostSetBit(int n) {
    return n & -n;
}`,
    slots: [
      { id: 'EXTRACT_RSB', label: 'Rightmost set bit extraction', hint: 'n & -n' },
    ],
    slotFills: {
      260: { EXTRACT_RSB: 'x & -x' },
      201: { EXTRACT_RSB: 'n/a — use n & (n-1) to strip LSB' },
    },
    helixOrder: [260, 201],
    helixDelta: {
      260: 'Single Number III: XOR all, extract rightmost set bit to partition array into two groups.',
      201: 'Bitwise AND of Range: strip LSB of r until l == r using r &= r-1.',
    },
    autopsies: [
      {
        cause: 'INT_MIN edge case: -INT_MIN overflows',
        wrong: 'return n & -n; // INT_MIN & -INT_MIN = INT_MIN (undefined behavior)',
        testCase: 'n = INT_MIN, -INT_MIN overflows in two\'s complement',
        fix: 'if (n == INT_MIN) return INT_MIN; or use unsigned: (unsigned int)n & -(unsigned int)n',
      },
    ],
    sayIt: [
      'Extract rightmost set bit: n & -n. Two\'s complement negation creates a mask isolating the lowest 1 bit.',
    ],
  }),

  'clear-lsb-to-i': e({
    xray: [
      { text: '**n & ~((1 << (i+1)) - 1)** clears bits 0..i', kind: 'signal' },
      { text: 'Create mask of i+1 ones, complement it', kind: 'constraint' },
    ],
    budget: ['bitwiseOps', 'bitMasking'],
    slottedTemplate: `int clearLsbToI(int n, int i) {
    return n & ~((1 << (i + 1)) - 1);
}`,
    slots: [
      { id: 'LSB_MASK', label: 'Mask to clear lower bits', hint: '~((1 << (i+1)) - 1)' },
    ],
    slotFills: {
      371: { LSB_MASK: '~((1 << (i+1)) - 1)' },
    },
    helixOrder: [371],
    helixDelta: {
      371: 'Sum of Two Integers: XOR for sum, AND+shift for carry. Clear lower bits isolates carry for next iteration.',
    },
    autopsies: [
      {
        cause: 'Overflow when i+1 >= 31 on 32-bit signed int',
        wrong: 'return n & ~((1 << (i+1)) - 1); // (1 << 32) undefined behavior',
        testCase: 'i = 31, (1 << 32) overflows on 32-bit int',
        fix: 'Use wider type like unsigned long long, or check i < 31 before shift.',
      },
    ],
    sayIt: [
      'Clear LSB to i: create mask of (i+1) ones, complement it, AND with n. Keeps only bits above position i.',
    ],
  }),

  'count-set-bits': e({
    xray: [
      { text: 'Loop: accumulate **n & 1**, shift **n >>= 1**', kind: 'signal' },
      { text: 'O(number of bits) naive; Kernel is O(number of set bits)', kind: 'constraint' },
    ],
    budget: ['bitCounting', 'bitwiseOps'],
    slottedTemplate: `int countSetBits(int n) {
    int cnt = 0;
    while (n) {
        cnt += n & 1;
        n >>= 1;
    }
    return cnt;
}`,
    slots: [
      { id: 'COUNT_EXPR', label: 'Bit counting expression', hint: 'n & 1' },
      { id: 'SHIFT_EXPR', label: 'Shift to next bit', hint: 'n >>= 1' },
    ],
    slotFills: {
      191: { COUNT_EXPR: 'n & 1', SHIFT_EXPR: 'n >>= 1' },
      338: { COUNT_EXPR: 'n/a — DP recurrence: ans[i] = ans[i>>1] + (i&1)', SHIFT_EXPR: 'n/a' },
    },
    helixOrder: [191, 338],
    helixDelta: {
      191: 'Number of 1 Bits: loop over all 32 bits counting ones. O(32) per number.',
      338: 'Counting Bits: DP with recurrence ans[i] = ans[i>>1] + (i&1). O(n) for all 0..n.',
    },
    autopsies: [
      {
        cause: 'Infinite loop on negative numbers due to arithmetic right shift',
        wrong: 'while (n) { cnt += n & 1; n >>= 1; } // signed shift preserves sign bit',
        testCase: 'n = -1, n >>= 1 keeps n = -1, loop never terminates',
        fix: 'Cast to unsigned: (unsigned int)n or use n = (unsigned int)n >> 1',
      },
    ],
    sayIt: [
      'Count set bits: loop checking LSB with AND 1, then shift right. Simple O(32) approach.',
    ],
  }),

  'parity-check': e({
    xray: [
      { text: '**XOR** all bits: parity = popcount mod 2', kind: 'signal' },
      { text: 'Return 1 for odd number of 1s, 0 for even', kind: 'output' },
    ],
    budget: ['bitCounting', 'xorProperties'],
    slottedTemplate: `int parity(int n) {
    int p = 0;
    while (n) {
        p ^= (n & 1);
        n >>= 1;
    }
    return p;
}`,
    slots: [
      { id: 'PARITY_EXPR', label: 'Parity accumulation', hint: 'p ^= (n & 1)' },
    ],
    slotFills: {
      1386: { PARITY_EXPR: 'p ^= (n & 1) // parity per row mask to check odd/even occupancy' },
    },
    helixOrder: [1386],
    helixDelta: {
      1386: 'Cinema Seat Allocation: use bitmask per row. Parity of bit counts checks odd occupancy constraints.',
    },
    autopsies: [
      {
        cause: 'Confusing parity with population count',
        wrong: 'int p = 0; while(n) { p += n & 1; n >>= 1; } return p % 2; // works but slower',
        testCase: 'Parity is popcount mod 2; XOR is more efficient',
        fix: 'Use XOR accumulation: p ^= (n & 1);',
      },
    ],
    sayIt: [
      'Parity: XOR all bits. Returns 1 if odd number of set bits, 0 if even. XOR is associative and efficient.',
    ],
  }),

  'bit-reversal-leaf': e({
    xray: [
      { text: '**unsigned** int to avoid sign extension', kind: 'constraint' },
      { text: 'Loop 32 times: rev = (rev << 1) | (n & 1)', kind: 'signal' },
    ],
    budget: ['bitReversal', 'bitwiseOps'],
    slottedTemplate: `unsigned int reverseBits(unsigned int n) {
    unsigned int rev = 0;
    for (int i = 0; i < 32; i++) {
        rev = (rev << 1) | (n & 1);
        n >>= 1;
    }
    return rev;
}`,
    slots: [
      { id: 'REV_STEP', label: 'Bit reversal step', hint: '(rev << 1) | (n & 1)' },
    ],
    slotFills: {
      190: { REV_STEP: '(rev << 1) | (n & 1)' },
      1009: { REV_STEP: 'n/a — complement: find mask with same bit length, return n ^ mask' },
    },
    helixOrder: [190, 1009],
    helixDelta: {
      190: 'Reverse Bits: iterative approach extracts LSB from n, builds rev from MSB side. Loop exactly 32 times.',
      1009: 'Complement of Base 10: find mask of same bit length, return n ^ mask. Edge case n=0 returns 1.',
    },
    autopsies: [
      {
        cause: 'Using signed int — right shift propagates sign bit',
        wrong: 'int rev = 0; for (int i = 0; i < 32; i++) { rev = (rev << 1) | (n & 1); n >>= 1; }',
        testCase: 'n with MSB set: signed shift fills with 1s, corrupts reversal',
        fix: 'Use unsigned int for both rev and n.',
      },
    ],
    sayIt: [
      'Bit reversal: for each of 32 bits, shift rev left, OR with LSB of n, shift n right. Use unsigned types.',
    ],
  }),

  'logical-shifts': e({
    xray: [
      { text: '**x << k** left shift (multiply by 2^k)', kind: 'signal' },
      { text: '**(unsigned)x >> k** logical right shift', kind: 'signal' },
    ],
    budget: ['bitShift', 'bitwiseOps'],
    slottedTemplate: `int leftShift(int x, int k) {
    return x << k;
}
int rightShift(int x, int k) {
    return (unsigned int)x >> k;
}`,
    slots: [
      { id: 'SHIFT_CAST', label: 'Cast for logical right shift', hint: '(unsigned int)' },
    ],
    slotFills: {
      29: { SHIFT_CAST: '(unsigned int) // used in division for positive divisor handling' },
      7: { SHIFT_CAST: 'n/a — reverse integer uses arithmetic ops, not bit shifts' },
    },
    helixOrder: [29, 7],
    helixDelta: {
      29: 'Divide Two Integers: use left shift for divisor multiplication, unsigned right shift for safety.',
      7: 'Reverse Integer: pop/push with overflow check. Not directly shift-based but related to digit extraction.',
    },
    autopsies: [
      {
        cause: 'Using signed right shift expecting logical shift behavior',
        wrong: 'return x >> k; // arithmetic right shift on signed int',
        testCase: 'x = -8, k = 1: -8 >> 1 = -4 (arithmetic), want 0x7FFFFFFC (logical)',
        fix: 'return (unsigned int)x >> k;',
      },
    ],
    sayIt: [
      'Logical shifts: left shift fills with zeros; right shift needs unsigned cast to avoid sign extension.',
    ],
  }),

  'mul-div-pow2': e({
    xray: [
      { text: '**x << k** = x * 2^k for positive x', kind: 'signal' },
      { text: '**x >> k** = floor(x / 2^k) for unsigned', kind: 'constraint' },
    ],
    budget: ['bitShift', 'bitwiseOps'],
    slottedTemplate: `int mulByPow2(int x, int k) {
    return x << k;
}
int divByPow2(int x, int k) {
    return x >> k;
}`,
    slots: [
      { id: 'DIV_SIGN', label: 'Signed vs unsigned division semantics', hint: 'use unsigned for logical' },
    ],
    slotFills: {
      50: { DIV_SIGN: 'n/a — pow(x,n) uses exponentiation by squaring, not direct shift' },
      372: { DIV_SIGN: 'n/a — super power uses modular exponentiation, shifts for bit iteration' },
    },
    helixOrder: [50, 372],
    helixDelta: {
      50: 'Pow(x,n): exponentiation by squaring. Iterate bits of exponent, square base each step.',
      372: 'Super Pow: modular exponentiation with large exponent as array. Use exponent mod phi(mod).',
    },
    autopsies: [
      {
        cause: 'Negative x with right shift is not truncation toward zero',
        wrong: 'return x >> k; // -5 >> 1 = -3, but -5/2 = -2 in C++ truncation',
        testCase: 'x = -5, k = 1: expected -2, got -3',
        fix: 'For exact division of signed ints, use x / (1 << k) or handle sign separately.',
      },
    ],
    sayIt: [
      'Mul/div by 2^k: left shift multiplies, right shift divides (floor for unsigned). Watch sign for negatives.',
    ],
  }),

  'bit-rotation': e({
    xray: [
      { text: '**Combine** two shifts with OR to wrap bits around', kind: 'signal' },
      { text: 'd must be < 32 for 32-bit rotation', kind: 'constraint' },
    ],
    budget: ['bitShift', 'bitwiseOps'],
    slottedTemplate: `unsigned int rotateLeft(unsigned int n, unsigned int d) {
    return (n << d) | (n >> (32 - d));
}
unsigned int rotateRight(unsigned int n, unsigned int d) {
    return (n >> d) | (n << (32 - d));
}`,
    slots: [
      { id: 'ROT_WRAP', label: 'Rotate wrap-around expression', hint: '(n << d) | (n >> (32-d))' },
    ],
    slotFills: {
      1238: { ROT_WRAP: '(n << d) | (n >> (32-d))' },
    },
    helixOrder: [1238],
    helixDelta: {
      1238: 'Circular Permutation: Gray code numbers generated using rotation. Adjacent values differ by one bit.',
    },
    autopsies: [
      {
        cause: 'd >= 32 causing undefined behavior for shift by full width',
        wrong: 'return (n << d) | (n >> (32 - d)); // d=32: shift by 32 UB, 32-d = 0',
        testCase: 'd = 32: (n << 32) is undefined, n >> 0 = n',
        fix: 'd %= 32; // reduce modulo bit width before rotating',
      },
    ],
    sayIt: [
      'Bit rotation: shift left by d, OR with shift right by (32-d). Wraps bits around without losing them.',
    ],
  }),

  // ── Bit Manipulation Applications ────────────────────────────────

  'add-without-plus': e({
    xray: [
      { text: '**XOR** = sum without carry, **AND** = carry', kind: 'signal' },
      { text: 'Loop until carry = 0: carry = a & b, a ^= b, b <<= 1', kind: 'goal' },
    ],
    budget: ['xorProperties', 'bitwiseOps'],
    slottedTemplate: `int add(int a, int b) {
    while (b) {
        int carry = a & b;
        a = a ^ b;
        b = carry << 1;
    }
    return a;
}`,
    slots: [
      { id: 'CARRY_CALC', label: 'Carry calculation expression', hint: 'a & b' },
      { id: 'SUM_CALC', label: 'Sum without carry', hint: 'a ^ b' },
    ],
    slotFills: {
      371: { CARRY_CALC: 'a & b', SUM_CALC: 'a ^ b' },
    },
    helixOrder: [371],
    helixDelta: {
      371: 'Sum of Two Integers: XOR adds bits, AND finds carries. Shift carry left and repeat until no carry.',
    },
    autopsies: [
      {
        cause: 'Infinite loop when carry never becomes zero',
        wrong: 'while (b) { a = a ^ b; b = (a & b) << 1; } // a modified before carry computation',
        testCase: 'a=1, b=1: a becomes 0, b = (0 & 1) << 1 = 0, loops once — correct by luck',
        fix: 'Save carry before modifying a: int carry = a & b; a ^= b; b = carry << 1;',
      },
    ],
    sayIt: [
      'Add without plus: XOR for bitwise sum, AND for carry. Loop shifting carry left until it becomes 0.',
    ],
  }),

  'sub-without-minus': e({
    xray: [
      { text: '**Borrow = (~a) & b**, then XOR and shift', kind: 'signal' },
      { text: 'Mirrors addition: borrow replaces carry, (~a) replaces a', kind: 'constraint' },
    ],
    budget: ['xorProperties', 'bitwiseOps'],
    slottedTemplate: `int sub(int a, int b) {
    while (b) {
        int borrow = (~a) & b;
        a = a ^ b;
        b = borrow << 1;
    }
    return a;
}`,
    slots: [
      { id: 'BORROW_CALC', label: 'Borrow calculation expression', hint: '(~a) & b' },
    ],
    slotFills: {
      371: { BORROW_CALC: '(~a) & b' },
    },
    helixOrder: [371],
    helixDelta: {
      371: 'Sum of Two Integers: subtraction via addition of two\'s complement. Borrow = (~a) & b isolates underflow bits.',
    },
    autopsies: [
      {
        cause: 'Using a & b (carry formula) instead of (~a) & b for borrow',
        wrong: 'int borrow = a & b; // this is carry for addition, not borrow for subtraction',
        testCase: 'a=10, b=5: a & b = 0 (no overlapping bits), but borrow needed at higher bits',
        fix: 'int borrow = (~a) & b; // bits where a has 0 and b has 1 require borrow',
      },
    ],
    sayIt: [
      'Subtract without minus: borrow = (~a) & b finds bits needing borrow. XOR for difference, shift borrow left.',
    ],
  }),

  'mul-div-bit': e({
    xray: [
      { text: '**Shift-and-add** multiplication', kind: 'signal' },
      { text: 'O(number of bits) — Russian peasant algorithm', kind: 'constraint' },
    ],
    budget: ['bitwiseOps', 'bitShift'],
    slottedTemplate: `int multiply(int a, int b) {
    int res = 0;
    while (b) {
        if (b & 1) res += a;
        a <<= 1;
        b >>= 1;
    }
    return res;
}`,
    slots: [
      { id: 'MUL_COND', label: 'Condition to add a to result', hint: 'b & 1' },
    ],
    slotFills: {
      29: { MUL_COND: 'b & 1' },
    },
    helixOrder: [29],
    helixDelta: {
      29: 'Divide Two Integers: use shift-and-subtract for division. Left shift divisor, compare with dividend.',
    },
    autopsies: [
      {
        cause: 'Not handling negative b — loop never executes for b = 0, but sign matters',
        wrong: 'while (b) { if (b & 1) res += a; a <<= 1; b >>= 1; } // b negative: b>>1 arithmetic',
        testCase: 'a=5, b=-3: signed right shift of negative b may never reach 0',
        fix: 'Handle sign separately: int sign = (a>0) == (b>0) ? 1 : -1; a=abs(a); b=abs(b);',
      },
    ],
    sayIt: [
      'Bitwise multiply: for each bit of b, if set add a to result. Double a, halve b each iteration.',
    ],
  }),

  'find-single-num': e({
    xray: [
      { text: '**XOR** all elements; duplicates cancel (a^a=0)', kind: 'signal' },
      { text: 'XOR is commutative and associative', kind: 'constraint' },
    ],
    budget: ['xorProperties', 'bitwiseOps'],
    slottedTemplate: `int singleNumber(vector<int>& nums) {
    int x = 0;
    for (int n : nums) x ^= n;
    return x;
}`,
    slots: [
      { id: 'XOR_ACCUM', label: 'XOR accumulation variable', hint: 'x ^= n' },
    ],
    slotFills: {
      136: { XOR_ACCUM: 'x ^= n' },
      137: { XOR_ACCUM: 'n/a — three-state machine: ones/twos bitmask' },
      260: { XOR_ACCUM: 'n/a — XOR all, extract rsb, partition and XOR each group' },
    },
    helixOrder: [136, 137, 260],
    helixDelta: {
      136: 'Single Number: XOR all elements. Every duplicate pair cancels (a^a=0). Remaining value is the unique element.',
      137: 'Single Number II: three-state machine. Track bits appearing 1 or 3 times using ones/twos masks.',
      260: 'Single Number III: XOR all → a^b. Extract rightmost set bit. Partition array into two groups. XOR each group.',
    },
    autopsies: [
      {
        cause: 'Initializing XOR variable to 1 instead of 0',
        wrong: 'int x = 1; // 1 ^ n changes the result',
        testCase: 'nums = [2,2,1]: expected 1, got 1^2^2^1 = 0',
        fix: 'int x = 0; // XOR identity: 0 ^ n = n',
      },
    ],
    sayIt: [
      'Find single number: XOR all elements. Duplicates cancel, leaving the unique element. O(n) time, O(1) space.',
    ],
  }),

  'find-missing-num': e({
    xray: [
      { text: '**XOR** index+1 with value; remaining = missing', kind: 'signal' },
      { text: 'XOR avoids overflow unlike sum-based approach', kind: 'constraint' },
    ],
    budget: ['xorProperties', 'bitwiseOps'],
    slottedTemplate: `int missingNumber(vector<int>& nums) {
    int x = 0, n = (int)nums.size();
    for (int i = 0; i < n; i++)
        x ^= (i + 1) ^ nums[i];
    return x;
}`,
    slots: [
      { id: 'MISSING_XOR', label: 'XOR expression for missing number', hint: '(i+1) ^ nums[i]' },
    ],
    slotFills: {
      268: { MISSING_XOR: '(i+1) ^ nums[i]' },
      389: { MISSING_XOR: 'n/a — XOR all chars of s and t, result is extra char' },
    },
    helixOrder: [268, 389],
    helixDelta: {
      268: 'Missing Number: XOR all indices+1 with values. Present numbers cancel, leaving the missing one.',
      389: 'Find the Difference: XOR all characters from both strings. Duplicates cancel, extra char remains.',
    },
    autopsies: [
      {
        cause: 'Using sum-based approach that may overflow for large arrays',
        wrong: 'int sum = n*(n+1)/2; for (int v : nums) sum -= v; return sum;',
        testCase: 'n = 100000, n*(n+1)/2 overflows 32-bit int',
        fix: 'Use XOR approach: avoids overflow entirely, O(1) extra space.',
      },
    ],
    sayIt: [
      'Find missing number: XOR all expected values with actual values. Missing number survives. No overflow risk.',
    ],
  }),

  'swap-values': e({
    xray: [
      { text: '**a ^= b; b ^= a; a ^= b** — no temp variable', kind: 'signal' },
      { text: 'Fails if a and b reference the **same** variable', kind: 'constraint' },
    ],
    budget: ['xorProperties'],
    slottedTemplate: `void xorSwap(int& a, int& b) {
    a ^= b;
    b ^= a;
    a ^= b;
}`,
    slots: [
      { id: 'SWAP_STEP', label: 'XOR swap step sequence', hint: 'a ^= b; b ^= a; a ^= b' },
    ],
    slotFills: {
      1720: { SWAP_STEP: 'a ^= b; b ^= a; a ^= b' },
    },
    helixOrder: [1720],
    helixDelta: {
      1720: 'Decode XORed Array: XOR properties reverse encoding. arr[i] = encoded[i] ^ arr[i-1] reconstructs original.',
    },
    autopsies: [
      {
        cause: 'Same variable aliased to both parameters',
        wrong: 'xorSwap(a, a); // a ^= a = 0; then 0 ^= 0 = 0; then 0 ^= 0 = 0',
        testCase: 'int a = 5; xorSwap(a, a); // a becomes 0',
        fix: 'Add guard: if (&a == &b) return; or use temp variable swap.',
      },
    ],
    sayIt: [
      'XOR swap: three XOR operations swap values without temporary storage. Self-swap bug: don\'t use on same reference.',
    ],
  }),

  'bit-masking': e({
    xray: [
      { text: '**AND** mask = extract; **OR** mask = set; **XOR** = toggle', kind: 'signal' },
      { text: 'Bitmask encodes boolean flags compactly', kind: 'constraint' },
    ],
    budget: ['bitMasking', 'bitwiseOps'],
    slottedTemplate: `int applyMask(int num, int mask) {
    return num & mask;
}
int setWithMask(int num, int mask) {
    return num | mask;
}
int toggleWithMask(int num, int mask) {
    return num ^ mask;
}`,
    slots: [
      { id: 'MASK_OP', label: 'Mask operation type', hint: 'AND to check, OR to set, XOR to toggle' },
    ],
    slotFills: {
      1178: { MASK_OP: '& mask // check if puzzle has required first letter bit' },
      187: { MASK_OP: '& mask || (mask << 2) // 20-bit rolling hash via bitmask' },
    },
    helixOrder: [1178, 187],
    helixDelta: {
      1178: 'Valid Words in Puzzle: encode letters as 26-bit mask. Check word mask is subset of puzzle mask with first char match.',
      187: 'Repeated DNA: encode 2 bits per nucleotide. Rolling 20-bit mask for 10-char windows. Track seen hashes.',
    },
    autopsies: [
      {
        cause: 'Confusing AND (extract) with OR (set) behavior',
        wrong: 'int result = num | mask; // intended to extract bits, but OR sets them',
        testCase: 'num=0x0F, mask=0xF0: AND gives 0x00 (extract), OR gives 0xFF (set all)',
        fix: 'Use & for extraction, | for setting, ^ for toggling.',
      },
    ],
    sayIt: [
      'Bit masking: AND extracts bits, OR sets bits, XOR toggles bits. Compact boolean encoding for sets of flags.',
    ],
  }),

  'range-ops': e({
    xray: [
      { text: '**Range AND**: find common prefix by shifting', kind: 'signal' },
      { text: 'At most **32 distinct OR values** per array position', kind: 'constraint' },
    ],
    budget: ['bitwiseOps', 'bitHack'],
    slottedTemplate: `int rangeBitwiseAnd(int l, int r) {
    int shift = 0;
    while (l < r) {
        l >>= 1;
        r >>= 1;
        shift++;
    }
    return l << shift;
}`,
    slots: [
      { id: 'RANGE_COND', label: 'Loop condition for range AND', hint: 'l < r' },
    ],
    slotFills: {
      201: { RANGE_COND: 'l < r' },
      898: { RANGE_COND: 'n/a — set-based DP: track unique OR values ending at each position' },
    },
    helixOrder: [201, 898],
    helixDelta: {
      201: 'Bitwise AND of Range: find common bit prefix of l and r. Lower differing bits become 0 in range AND.',
      898: 'Bitwise ORs of Subarrays: set-based DP. At most 32 distinct OR values per position. O(32n) time.',
    },
    autopsies: [
      {
        cause: 'Shifting bits off completely when l < r but no common prefix remains',
        wrong: 'while (l != r) { l >>= 1; r >>= 1; shift++; } // infinite if l and r share no prefix?',
        testCase: 'l=4(100), r=7(111): l<r, shift until both 0, l<<shift = 0 — correct: range AND = 0',
        fix: 'while (l < r) { l >>= 1; r >>= 1; shift++; } return l << shift;',
      },
    ],
    sayIt: [
      'Range AND: shift l and r right until equal. Common prefix shifted back left gives range bitwise AND.',
    ],
  }),

  'gray-code-leaf': e({
    xray: [
      { text: '**i ^ (i >> 1)** converts binary to Gray code', kind: 'signal' },
      { text: 'Adjacent Gray codes differ by exactly **one bit**', kind: 'goal' },
    ],
    budget: ['grayCode', 'xorProperties'],
    slottedTemplate: `vector<int> grayCode(int n) {
    vector<int> res;
    for (int i = 0; i < (1 << n); i++)
        res.push_back(i ^ (i >> 1));
    return res;
}`,
    slots: [
      { id: 'GRAY_FORMULA', label: 'Binary to Gray conversion', hint: 'i ^ (i >> 1)' },
    ],
    slotFills: {
      89: { GRAY_FORMULA: 'i ^ (i >> 1)' },
      1611: { GRAY_FORMULA: 'n/a — f(n) = 2*f(n-1) + 1 using Gray code relation' },
    },
    helixOrder: [89, 1611],
    helixDelta: {
      89: 'Gray Code: generate sequence where consecutive numbers differ by one bit. Formula: i ^ (i>>1).',
      1611: 'Min Operations: f(n) = 2*f(n-1)+1 for MSB. Operations to zero relate to Gray code bit flips.',
    },
    autopsies: [
      {
        cause: 'Misplaced parentheses in Gray code formula',
        wrong: 'res.push_back(i ^ i >> 1); // wrong precedence: (i ^ i) >> 1 = 0',
        testCase: 'n=2: expected [0,1,3,2], got [0,0,0,0]',
        fix: 'res.push_back(i ^ (i >> 1)); // ensure shift before XOR',
      },
    ],
    sayIt: [
      'Gray code: i ^ (i>>1) converts binary to Gray. Consecutive values differ in exactly one bit position.',
    ],
  }),

  'bit-vector': e({
    xray: [
      { text: '**Array of ints** storing bits; n bits in n/32 ints', kind: 'signal' },
      { text: '**Memory efficient**: 1 bit per flag vs 1 byte', kind: 'constraint' },
    ],
    budget: ['bitMasking', 'stateCompression'],
    slottedTemplate: `class BitVector {
    vector<int> bits;
public:
    BitVector(int n) : bits((n + 31) / 32, 0) {}
    void set(int i) { bits[i / 32] |= (1 << (i % 32)); }
    bool get(int i) { return (bits[i / 32] >> (i % 32)) & 1; }
    void clear(int i) { bits[i / 32] &= ~(1 << (i % 32)); }
};`,
    slots: [
      { id: 'VECTOR_IDX', label: 'Bit vector index calculation', hint: 'i/32 for word, i%32 for bit' },
    ],
    slotFills: {
      1461: { VECTOR_IDX: 'i/32 and i%32' },
      421: { VECTOR_IDX: 'n/a — Trie-based approach preferred for max XOR' },
    },
    helixOrder: [1461, 421],
    helixDelta: {
      1461: 'Check Binary Codes: bit vector tracks seen k-bit patterns. 2^k ≤ 2^20 fits in memory.',
      421: 'Max XOR of Two Numbers: Trie approach is more intuitive. Bit vector used for prefix set.',
    },
    autopsies: [
      {
        cause: 'Off-by-one in word index: using i/31 or i%31 instead of i/32 and i%32',
        wrong: 'bits[i / 32] |= (1 << (i / 32)); // wrong: index used for both word and bit',
        testCase: 'i=32: bits[1] |= (1 << 1) instead of bits[1] |= (1 << 0)',
        fix: 'bits[i / 32] |= (1 << (i % 32)); // separate word index from bit index',
      },
    ],
    sayIt: [
      'Bit vector: compact storage of n flags in n/32 integers. Set/get/clear using word and bit index.',
    ],
  }),

  'bit-flags': e({
    xray: [
      { text: '**Enumerate all subsets** via bitmask from 0 to 2^n-1', kind: 'signal' },
      { text: '1 << n overflows for n >= 31 — use long or prune', kind: 'constraint' },
    ],
    budget: ['stateCompression', 'bitMasking'],
    slottedTemplate: `vector<vector<int>> subsets(vector<int>& nums) {
    int n = (int)nums.size();
    vector<vector<int>> res;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> sub;
        for (int i = 0; i < n; i++)
            if (mask & (1 << i)) sub.push_back(nums[i]);
        res.push_back(sub);
    }
    return res;
}`,
    slots: [
      { id: 'FLAG_COND', label: 'Condition to include element i', hint: 'mask & (1 << i)' },
    ],
    slotFills: {
      78: { FLAG_COND: 'mask & (1 << i)' },
      1286: { FLAG_COND: 'n/a — generate next combination of size k using Gosper\'s hack' },
    },
    helixOrder: [78, 1286],
    helixDelta: {
      78: 'Subsets: enumerate all 2^n subsets via bitmask. Each mask bit determines inclusion of element i.',
      1286: 'Iterator for Combination: generate next combination of size k. Find rightmost 01→10 pattern.',
    },
    autopsies: [
      {
        cause: 'Integer overflow when (1 << n) for n >= 31',
        wrong: 'for (int mask = 0; mask < (1 << n); mask++) // UB for n >= 31',
        testCase: 'n = 32: (1 << 32) overflows, mask may never reach upper bound',
        fix: 'Use long long: for (long long mask = 0; mask < (1LL << n); mask++)',
      },
    ],
    sayIt: [
      'Bit flags: iterate mask from 0 to 2^n-1. Include element i when bit i of mask is set. Enumerates all subsets.',
    ],
  }),

  'bitmask-visited': e({
    xray: [
      { text: '**BFS state** = (node, visited bitmask)', kind: 'signal' },
      { text: 'State space = n * 2^n — feasible for n <= 12', kind: 'constraint' },
    ],
    budget: ['stateCompression', 'bitDp'],
    slottedTemplate: `int shortestPathAllNodes(vector<vector<int>>& graph) {
    int n = (int)graph.size(), full = (1 << n) - 1;
    vector<vector<int>> dist(n, vector<int>(1 << n, -1));
    queue<pair<int,int>> q;
    for (int i = 0; i < n; i++) {
        dist[i][1 << i] = 0;
        q.push({i, 1 << i});
    }
    while (!q.empty()) {
        auto [u, mask] = q.front(); q.pop();
        if (mask == full) return dist[u][mask];
        for (int v : graph[u]) {
            int nmask = mask | (1 << v);
            if (dist[v][nmask] == -1) {
                dist[v][nmask] = dist[u][mask] + 1;
                q.push({v, nmask});
            }
        }
    }
    return -1;
}`,
    slots: [
      { id: 'VISITED_MASK', label: 'Visited state mask update', hint: 'mask | (1 << v)' },
    ],
    slotFills: {
      847: { VISITED_MASK: 'mask | (1 << v)' },
    },
    helixOrder: [847],
    helixDelta: {
      847: 'Shortest Path All Nodes: BFS over (node, visited mask). Start from each node. Return when full mask reached.',
    },
    autopsies: [
      {
        cause: 'Not initializing all n starting positions',
        wrong: 'dist[0][1] = 0; q.push({0, 1}); // only start from node 0',
        testCase: 'Shortest path may start from any node, missing non-zero starts gives wrong answer',
        fix: 'for (int i = 0; i < n; i++) { dist[i][1<<i] = 0; q.push({i, 1<<i}); }',
      },
    ],
    sayIt: [
      'Bitmask visited: BFS state = (current node, bitmask of visited nodes). Returns steps when all nodes visited.',
    ],
  }),

  // ── Bitwise Dynamic Programming ──────────────────────────────────

  'subset-state-dp': e({
    xray: [
      { text: '**dp[mask]** = best value for subset represented by mask', kind: 'signal' },
      { text: 'Enumerate **submasks**: for(sub = mask; sub; sub = (sub-1) & mask)', kind: 'constraint' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `int minNumberOfSemesters(int n, vector<vector<int>>& relations, int k) {
    vector<int> prereq(n, 0);
    for (auto& r : relations)
        prereq[r[1] - 1] |= (1 << (r[0] - 1));
    vector<int> dp(1 << n, n); dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int avail = 0;
        for (int i = 0; i < n; i++)
            if (!(mask & (1 << i)) && (prereq[i] & mask) == prereq[i])
                avail |= (1 << i);
        for (int sub = avail; sub; sub = (sub - 1) & avail) {
            if (__builtin_popcount(sub) <= k)
                dp[mask | sub] = min(dp[mask | sub], dp[mask] + 1);
        }
    }
    return dp[(1 << n) - 1];
}`,
    slots: [
      { id: 'SUBMASK_ENUM', label: 'Submask enumeration pattern', hint: '(sub-1) & avail' },
    ],
    slotFills: {
      1125: { SUBMASK_ENUM: '(sub-1) & avail' },
      1494: { SUBMASK_ENUM: '(sub-1) & avail' },
    },
    helixOrder: [1125, 1494],
    helixDelta: {
      1125: 'Smallest Sufficient Team: dp[mask] = min people to cover skills. Submask enumeration of available skills.',
      1494: 'Parallel Courses II: dp[mask] = min semesters. Enumerate submasks of available courses ≤ k per semester.',
    },
    autopsies: [
      {
        cause: 'Incorrect submask enumeration loop condition',
        wrong: 'for (int sub = avail; sub >= 0; sub = (sub-1) & avail) // infinite for sub=0',
        testCase: 'sub hits 0, (0-1) & avail = avail, infinite loop',
        fix: 'for (int sub = avail; sub; sub = (sub-1) & avail) // stops when sub=0',
      },
    ],
    sayIt: [
      'Subset state DP: dp[mask] tracks optimal value for subset. Enumerate submasks to transition to supersets.',
    ],
  }),

  'tsp-bitmask': e({
    xray: [
      { text: '**dp[mask][last]** = min cost to visit set ending at last', kind: 'signal' },
      { text: 'O(n² * 2^n) — feasible for n <= 15-18', kind: 'constraint' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `int tsp(int n, vector<vector<int>>& dist) {
    vector<vector<int>> dp(1 << n, vector<int>(n, 1e9));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask += 2) {
        for (int u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue;
            for (int v = 0; v < n; v++) {
                if (mask & (1 << v)) continue;
                dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    int ans = 1e9;
    for (int i = 1; i < n; i++)
        ans = min(ans, dp[(1 << n) - 1][i] + dist[i][0]);
    return ans;
}`,
    slots: [
      { id: 'TSP_TRANSITION', label: 'TSP DP transition', hint: 'dp[mask|1<<v][v] = min(dp[mask][u] + dist[u][v])' },
    ],
    slotFills: {
      943: { TSP_TRANSITION: 'dp[mask | (1<<v)][v] = min(dp[mask][u] + overlap[u][v])' },
      847: { TSP_TRANSITION: 'n/a — BFS on (node,mask) space, not standard TSP DP' },
    },
    helixOrder: [943, 847],
    helixDelta: {
      943: 'Shortest Superstring: TSP DP over string overlaps. mask tracks which strings are used, last is the last string.',
      847: 'Shortest Path All Nodes: BFS on (node, visited mask) space, not TSP DP. Floyd-Warshall + DP alternative.',
    },
    autopsies: [
      {
        cause: 'Not fixing start city — mask should always include city 0 (start)',
        wrong: 'for (int mask = 1; mask < (1<<n); mask++) // not mask += 2 (odd masks only)',
        testCase: 'mask=2 (010) has city 0 not visited — dp[2][1] has no valid predecessor',
        fix: 'for (int mask = 1; mask < (1<<n); mask += 2) // only masks with bit 0 set',
      },
    ],
    sayIt: [
      'TSP bitmask: dp[mask][last] = min cost to visit mask ending at last. Fix city 0 as start. O(n² * 2^n).',
    ],
  }),

  'max-students-exam': e({
    xray: [
      { text: '**Row-by-row DP** with bitmask for seat selection', kind: 'signal' },
      { text: 'Check conflicts: (cur << 1), (prev << 1), (prev >> 1)', kind: 'constraint' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `int maxStudents(vector<vector<char>>& seats) {
    int m = (int)seats.size(), n = (int)seats[0].size();
    vector<int> valid(m, 0);
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (seats[i][j] == '.') valid[i] |= (1 << j);
    vector<vector<int>> dp(m + 1, vector<int>(1 << n, -1));
    dp[0][0] = 0;
    for (int i = 0; i < m; i++) {
        for (int cur = valid[i]; ; cur = (cur - 1) & valid[i]) {
            if (cur & (cur << 1) || cur & (cur >> 1)) { if (cur == 0) break; continue; }
            for (int prev = 0; prev < (1 << n); prev++) {
                if (dp[i][prev] == -1) continue;
                if (prev & (cur << 1) || prev & (cur >> 1)) continue;
                dp[i + 1][cur] = max(dp[i + 1][cur], dp[i][prev] + __builtin_popcount(cur));
            }
            if (cur == 0) break;
        }
    }
    return *max_element(dp[m].begin(), dp[m].end());
}`,
    slots: [
      { id: 'SEAT_CONFLICT', label: 'Seat conflict check condition', hint: 'prev & (cur << 1) || prev & (cur >> 1)' },
    ],
    slotFills: {
      1349: { SEAT_CONFLICT: 'prev & (cur << 1) || prev & (cur >> 1)' },
    },
    helixOrder: [1349],
    helixDelta: {
      1349: 'Max Students Exam: row DP with bitmasks. Valid seats encoded per row. Check same-row and cross-row conflicts.',
    },
    autopsies: [
      {
        cause: 'Not checking both left and right diagonal conflicts with previous row',
        wrong: 'if (prev & (cur << 1)) continue; // missing prev & (cur >> 1)',
        testCase: 'Student front-right of another student in next row — not detected',
        fix: 'if (prev & (cur << 1) || prev & (cur >> 1)) continue;',
      },
    ],
    sayIt: [
      'Max students exam: bitmask for each row\'s available seats. DP across rows checking same-row adjacent and cross-row diagonal conflicts.',
    ],
  }),

  'min-cost-connect-groups': e({
    xray: [
      { text: '**DP over group A mask**; each group B point connects once', kind: 'signal' },
      { text: '**minCost[j]** fallback when B point connects to any A', kind: 'constraint' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `int connectTwoGroups(vector<vector<int>>& cost) {
    int m = (int)cost.size(), n = (int)cost[0].size();
    vector<int> minCost(n, INT_MAX);
    for (int j = 0; j < n; j++)
        for (int i = 0; i < m; i++)
            minCost[j] = min(minCost[j], cost[i][j]);
    vector<int> dp(1 << m, INT_MAX); dp[0] = 0;
    for (int j = 0; j < n; j++) {
        vector<int> ndp(1 << m, INT_MAX);
        for (int mask = 0; mask < (1 << m); mask++) {
            if (dp[mask] == INT_MAX) continue;
            for (int i = 0; i < m; i++)
                ndp[mask | (1 << i)] = min(ndp[mask | (1 << i)], dp[mask] + cost[i][j]);
            ndp[mask] = min(ndp[mask], dp[mask] + minCost[j]);
        }
        dp = ndp;
    }
    return dp[(1 << m) - 1];
}`,
    slots: [
      { id: 'GROUP_MASK', label: 'Group A connection mask update', hint: 'mask | (1 << i)' },
    ],
    slotFills: {
      1595: { GROUP_MASK: 'mask | (1 << i)' },
    },
    helixOrder: [1595],
    helixDelta: {
      1595: 'Min Cost Connect Groups: DP over connections to group A. Each group B point connects to exactly one group A point.',
    },
    autopsies: [
      {
        cause: 'Forgetting the minCost fallback for group B points',
        wrong: 'for (int i = 0; i < m; i++) ndp[mask|1<<i] = min(ndp[...], dp[mask] + cost[i][j]); // no fallback',
        testCase: 'Group B point reuses an existing connection via minCost; without fallback, cost is overestimated',
        fix: 'ndp[mask] = min(ndp[mask], dp[mask] + minCost[j]); // connect to already-used A point at min cost',
      },
    ],
    sayIt: [
      'Min cost connect groups: DP over group A mask. Each group B point connects to one A point or reuses existing at min cost.',
    ],
  }),

  'ways-wear-hats': e({
    xray: [
      { text: '**Iterate hat types** from 1 to 40', kind: 'signal' },
      { text: '**dp[mask]** = ways to cover persons in mask', kind: 'goal' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `int numberWays(vector<vector<int>>& hats) {
    int n = (int)hats.size(), mod = 1e9 + 7;
    vector<vector<int>> hatToPerson(41);
    for (int i = 0; i < n; i++)
        for (int h : hats[i]) hatToPerson[h].push_back(i);
    vector<int> dp(1 << n, 0); dp[0] = 1;
    for (int h = 1; h <= 40; h++) {
        vector<int> ndp = dp;
        for (int mask = 0; mask < (1 << n); mask++) {
            for (int p : hatToPerson[h]) {
                if (mask & (1 << p)) continue;
                ndp[mask | (1 << p)] = (ndp[mask | (1 << p)] + dp[mask]) % mod;
            }
        }
        dp = ndp;
    }
    return dp[(1 << n) - 1];
}`,
    slots: [
      { id: 'HAT_ASSIGN', label: 'Hat to person assignment', hint: 'ndp[mask|1<<p] += dp[mask]' },
    ],
    slotFills: {
      1434: { HAT_ASSIGN: 'ndp[mask | (1 << p)]' },
    },
    helixOrder: [1434],
    helixDelta: {
      1434: 'Ways to Wear Hats: iterate hat types 1..40. dp[mask] = ways to assign hats to person subset. Each hat to one eligible uncovered person.',
    },
    autopsies: [
      {
        cause: 'Not copying dp to ndp (ways to skip current hat type)',
        wrong: 'vector<int> ndp(1<<n, 0); // missing ndp = dp initialization for unchanged masks',
        testCase: 'Masks that don\'t use current hat type lose their accumulated count',
        fix: 'vector<int> ndp = dp; // carries forward previous counts for masks that skip this hat',
      },
    ],
    sayIt: [
      'Ways to wear hats: process each hat type. dp[mask] counts ways to cover person subset. Assign each hat to an eligible person not yet covered.',
    ],
  }),

  'mysterious-function': e({
    xray: [
      { text: '**Set of AND values** ending at each position', kind: 'signal' },
      { text: 'At most **32 distinct AND values** per position', kind: 'constraint' },
    ],
    budget: ['bitwiseOps', 'bitHack'],
    slottedTemplate: `int closestToTarget(vector<int>& arr, int target) {
    int ans = INT_MAX;
    unordered_set<int> cur;
    for (int x : arr) {
        unordered_set<int> nxt;
        nxt.insert(x);
        for (int v : cur) nxt.insert(v & x);
        for (int v : nxt) ans = min(ans, abs(v - target));
        cur = nxt;
    }
    return ans;
}`,
    slots: [
      { id: 'AND_TRACK', label: 'Track AND values ending at i', hint: 'nxt.insert(v & x)' },
    ],
    slotFills: {
      1521: { AND_TRACK: 'nxt.insert(v & x)' },
    },
    helixOrder: [1521],
    helixDelta: {
      1521: 'Mysterious Function: track all possible AND values of subarrays ending at each position. At most 32 per position.',
    },
    autopsies: [
      {
        cause: 'Not including the single element x in nxt',
        wrong: 'for (int v : cur) nxt.insert(v & x); // missing nxt.insert(x)',
        testCase: 'subarray [x] (single element) not considered — its AND value is x',
        fix: 'nxt.insert(x); // start with the value ending at this position alone',
      },
    ],
    sayIt: [
      'Mysterious function: for each position, maintain set of AND values of subarrays ending there. At most 32 values.',
    ],
  }),

  'distribute-repeating': e({
    xray: [
      { text: '**DP over unique number frequencies** and customer quantity masks', kind: 'signal' },
      { text: '**Precompute sum[mask]** for each quantity subset', kind: 'goal' },
    ],
    budget: ['bitDp', 'stateCompression'],
    slottedTemplate: `bool canDistribute(vector<int>& nums, vector<int>& quantity) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<int> counts;
    for (auto& p : freq) counts.push_back(p.second);
    int m = (int)quantity.size();
    vector<int> sum(1 << m, 0);
    for (int mask = 0; mask < (1 << m); mask++)
        for (int i = 0; i < m; i++)
            if (mask & (1 << i)) sum[mask] += quantity[i];
    vector<vector<bool>> dp((int)counts.size() + 1, vector<bool>(1 << m, false));
    dp[0][0] = true;
    for (int i = 0; i < (int)counts.size(); i++) {
        for (int mask = 0; mask < (1 << m); mask++) {
            if (!dp[i][mask]) continue;
            int remain = ((1 << m) - 1) ^ mask;
            for (int sub = remain; sub; sub = (sub - 1) & remain) {
                if (sum[sub] <= counts[i])
                    dp[i + 1][mask | sub] = true;
            }
            dp[i + 1][mask] = true;
        }
    }
    return dp[(int)counts.size()][(1 << m) - 1];
}`,
    slots: [
      { id: 'QUANTITY_MASK', label: 'Quantity mask assignment', hint: 'dp[i+1][mask|sub] = true when sum[sub] <= counts[i]' },
    ],
    slotFills: {
      1655: { QUANTITY_MASK: 'sum[sub] <= counts[i]' },
    },
    helixOrder: [1655],
    helixDelta: {
      1655: 'Distribute Repeating: DP over unique number frequencies. Precompute subset sums of quantities. Assign satisfying subsets.',
    },
    autopsies: [
      {
        cause: 'Not precomputing subset sums — repeated summing in DP',
        wrong: 'if (sumQuantity(subset) <= counts[i]) // O(m) recompute each time',
        testCase: 'DP transition called many times; O(3^m) without precomputation',
        fix: 'Precompute sum[mask] for all quantity subsets before DP.',
      },
    ],
    sayIt: [
      'Distribute repeating integers: DP over frequency groups and customer masks. Precompute quantity subset sums for O(3^m) transitions.',
    ],
  }),

  'max-xor-array': e({
    xray: [
      { text: '**Greedy from MSB**: try to set each bit in answer', kind: 'signal' },
      { text: 'Check if two prefixes XOR to candidate using hash set', kind: 'goal' },
    ],
    budget: ['xorProperties', 'trieBit'],
    slottedTemplate: `int findMaximumXOR(vector<int>& nums) {
    int ans = 0, mask = 0;
    for (int i = 31; i >= 0; i--) {
        mask |= (1 << i);
        unordered_set<int> prefixes;
        for (int x : nums) prefixes.insert(x & mask);
        int candidate = ans | (1 << i);
        for (int p : prefixes) {
            if (prefixes.count(p ^ candidate)) {
                ans = candidate;
                break;
            }
        }
    }
    return ans;
}`,
    slots: [
      { id: 'XOR_PREFIX', label: 'Prefix XOR check for candidate', hint: 'prefixes.count(p ^ candidate)' },
    ],
    slotFills: {
      421: { XOR_PREFIX: 'prefixes.count(p ^ candidate)' },
    },
    helixOrder: [421],
    helixDelta: {
      421: 'Max XOR of Two Numbers: greedy bit-by-bit. Track prefixes under current mask. Check if candidate achievable via XOR of two prefixes.',
    },
    autopsies: [
      {
        cause: 'Checking candidate against nums directly instead of prefixes',
        wrong: 'for (int x : nums) { if (prefixes.count(x ^ candidate)) ... } // wrong scope',
        testCase: 'x ^ candidate may have different prefix bits outside current mask',
        fix: 'Ensure both numbers\' higher bits already match ans: use prefixes (nums & mask).',
      },
    ],
    sayIt: [
      'Max XOR of two numbers: greedy from MSB. Maintain prefixes under growing mask. Check if candidate XOR exists in prefix set.',
    ],
  }),

  // ── Bit Tricks & Optimizations ───────────────────────────────────

  'kernighan-count': e({
    xray: [
      { text: '**n &= n - 1** removes the rightmost set bit', kind: 'signal' },
      { text: 'Runs once per set bit — O(popcount) not O(bits)', kind: 'constraint' },
    ],
    budget: ['bitHack', 'bitCounting'],
    slottedTemplate: `int kernighanCount(int n) {
    int cnt = 0;
    while (n) {
        n &= (n - 1);
        cnt++;
    }
    return cnt;
}`,
    slots: [
      { id: 'KERNIGHAN_STEP', label: 'Kernighan bit removal step', hint: 'n &= (n - 1)' },
    ],
    slotFills: {
      338: { KERNIGHAN_STEP: 'n &= (n - 1)' },
    },
    helixOrder: [338],
    helixDelta: {
      338: 'Counting Bits: DP recurrence ans[i] = ans[i>>1] + (i&1) is O(n). Kernighan used per-number in brute force.',
    },
    autopsies: [
      {
        cause: 'Forgetting n = 0 edge case — loop never executes',
        wrong: 'while (n) { n &= n-1; cnt++; } // correct: returns 0 for n=0',
        testCase: 'n=0: loop skipped, cnt=0 — correct',
        fix: 'No fix needed — algorithm correctly returns 0 for n=0.',
      },
    ],
    sayIt: [
      'Kernighan count: repeatedly clear rightmost set bit via n &= n-1. Runs once per set bit, not once per total bits.',
    ],
  }),

  'power-of-two-leaf': e({
    xray: [
      { text: '**n > 0 && (n & n-1) == 0**', kind: 'signal' },
      { text: 'Powers of two have exactly one bit set', kind: 'constraint' },
    ],
    budget: ['powerOfTwo', 'lsbOps'],
    slottedTemplate: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
    slots: [
      { id: 'POW2_COND', label: 'Power of two condition', hint: 'n > 0 && (n & n-1) == 0' },
    ],
    slotFills: {
      231: { POW2_COND: 'n > 0 && (n & (n-1)) == 0' },
      342: { POW2_COND: 'n/a — extends to power of four with mask check' },
    },
    helixOrder: [231, 342],
    helixDelta: {
      231: 'Power of Two: n > 0 and n & (n-1) == 0. Single-bit numbers. Edge: n=INT_MIN fails n>0 check.',
      342: 'Power of Four: power of two AND (n & 0x55555555) != 0. 0x55555555 masks odd-positioned bits.',
    },
    autopsies: [
      {
        cause: 'Not checking n > 0 — n=0 gives false positive',
        wrong: 'return (n & (n-1)) == 0; // n=0: 0 & -1 = 0, returns true',
        testCase: 'n=0: not a power of two, but (0 & -1) == 0',
        fix: 'return n > 0 && (n & (n-1)) == 0;',
      },
    ],
    sayIt: [
      'Power of two: positive number with exactly one set bit. n & (n-1) == 0 clears the only set bit giving zero.',
    ],
  }),

  'power-of-four': e({
    xray: [
      { text: '**Power of two + (n & 0x55555555) != 0**', kind: 'signal' },
      { text: '0x55555555 = 0101...0101 — bits at odd positions', kind: 'constraint' },
    ],
    budget: ['powerOfTwo', 'bitMasking'],
    slottedTemplate: `bool isPowerOfFour(int n) {
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
}`,
    slots: [
      { id: 'POW4_MASK', label: 'Mask for power of four check', hint: '0x55555555' },
    ],
    slotFills: {
      342: { POW4_MASK: '0x55555555' },
    },
    helixOrder: [342],
    helixDelta: {
      342: 'Power of Four: additional constraint that the single 1 bit is at an odd position (even index 0,2,4...). 0x55555555 mask.',
    },
    autopsies: [
      {
        cause: 'Using (n & 0xAAAAAAAA) != 0 instead of 0x55555555',
        wrong: 'return n > 0 && (n & (n-1)) == 0 && (n & 0xAAAAAAAA) != 0;',
        testCase: '0xAAAAAAAA checks even positions (odd indices) — would fail for 4^0=1 (bit 0)',
        fix: 'return n > 0 && (n & (n-1)) == 0 && (n & 0x55555555) != 0; // odd bit positions',
      },
    ],
    sayIt: [
      'Power of four: power of two AND the single 1 bit is at an odd position (0-indexed even). Use 0x55555555 mask.',
    ],
  }),

  'fast-mul': e({
    xray: [
      { text: '**Russian peasant multiplication**: shift and add', kind: 'signal' },
      { text: 'O(log b) time, only bit operations', kind: 'constraint' },
    ],
    budget: ['bitwiseOps', 'bitShift'],
    slottedTemplate: `int fastMultiply(int a, int b) {
    int res = 0;
    while (b) {
        if (b & 1) res += a;
        a <<= 1;
        b >>= 1;
    }
    return res;
}`,
    slots: [
      { id: 'FAST_MUL_COND', label: 'Condition to add a to result', hint: 'b & 1' },
    ],
    slotFills: {
      29: { FAST_MUL_COND: 'b & 1' },
    },
    helixOrder: [29],
    helixDelta: {
      29: 'Divide Two Integers: use shift-and-subtract. Left shift divisor until ≤ dividend. Subtract and accumulate quotient bits.',
    },
    autopsies: [
      {
        cause: 'Overflow from left shift beyond type width',
        wrong: 'a <<= 1; // may overflow for large a near INT_MAX',
        testCase: 'a = INT_MAX, b = 2: a <<= 1 overflows before loop ends',
        fix: 'Use unsigned long long for intermediate values, or check for overflow before shifting.',
      },
    ],
    sayIt: [
      'Fast bitwise multiply: Russian peasant method. For each bit of b, if set add a; double a, halve b. O(log b) iterations.',
    ],
  }),

  'next-same-bits': e({
    xray: [
      { text: '**Gosper\'s hack**: find next number with same popcount', kind: 'signal' },
      { text: 'c = n & -n; r = n + c; return r | ((n ^ r) >> 2) / c', kind: 'constraint' },
    ],
    budget: ['bitHack', 'lsbOps'],
    slottedTemplate: `int nextHigherSameBits(int n) {
    int c = n & -n;
    int r = n + c;
    return r | (((n ^ r) >> 2) / c);
}`,
    slots: [
      { id: 'NEXT_SAME_STEP', label: 'Gosper\'s hack step sequence', hint: 'c = n&-n; r = n+c; return r | ((n^r)>>2)/c' },
    ],
    slotFills: {
      1611: { NEXT_SAME_STEP: 'n/a — Gray code based recursive formula f(n) = 2*f(n-1)+1' },
    },
    helixOrder: [1611],
    helixDelta: {
      1611: 'Min Operations: Gray code properties give recurrence. Not directly next-same-bits, but bit manipulation insight.',
    },
    autopsies: [
      {
        cause: 'Division by zero when c = 0 (n = 0)',
        wrong: 'int c = n & -n; int r = n + c; return r | (((n ^ r) >> 2) / c); // n=0: c=0, UB',
        testCase: 'n=0: c=0, division by zero',
        fix: 'if (n == 0) return 0; // handle zero before Gosper\'s hack',
      },
    ],
    sayIt: [
      'Next number same bits: isolate rightmost set bit, add to n, then rearrange trailing bits. Gosper\'s hack for combinations.',
    ],
  }),

  'int-log': e({
    xray: [
      { text: '**Floor(log2(n))** by counting right shifts', kind: 'signal' },
      { text: 'Returns 0 for n = 1, undefined for n = 0', kind: 'constraint' },
    ],
    budget: ['bitShift', 'bitHack'],
    slottedTemplate: `int intLog2(int n) {
    int res = 0;
    while (n >>= 1) res++;
    return res;
}`,
    slots: [
      { id: 'LOG_COND', label: 'Logarithm loop condition', hint: 'n >>= 1' },
    ],
    slotFills: {
      338: { LOG_COND: 'n/a — DP uses ans[i] = ans[i>>1] + (i&1), not explicit log' },
    },
    helixOrder: [338],
    helixDelta: {
      338: 'Counting Bits: DP recurrence ans[i] = ans[i>>1] + (i&1). The i>>1 part relates to floor(log2).',
    },
    autopsies: [
      {
        cause: 'n = 0 leads to infinite loop or incorrect result',
        wrong: 'int res = 0; while (n >>= 1) res++; return res; // n=0: loop never enters, returns 0',
        testCase: 'n=0: log2(0) is undefined, but function returns 0',
        fix: 'if (n <= 0) return -1; // or handle as error for undefined input',
      },
    ],
    sayIt: [
      'Integer log2: repeatedly right shift n until zero. Count iterations = floor(log2(n)). Returns 0 for n=1.',
    ],
  }),

  'bit-sorting': e({
    xray: [
      { text: '**Sort by popcount** then by value', kind: 'signal' },
      { text: 'Custom comparator with __builtin_popcount', kind: 'constraint' },
    ],
    budget: ['bitCounting'],
    slottedTemplate: `vector<int> sortByBits(vector<int>& arr) {
    sort(arr.begin(), arr.end(), [](int a, int b) {
        int ca = __builtin_popcount(a);
        int cb = __builtin_popcount(b);
        if (ca != cb) return ca < cb;
        return a < b;
    });
    return arr;
}`,
    slots: [
      { id: 'SORT_CMP', label: 'Sort comparator logic', hint: 'popcount first, then value' },
    ],
    slotFills: {
      1356: { SORT_CMP: 'sort by popcount asc, then value asc' },
    },
    helixOrder: [1356],
    helixDelta: {
      1356: 'Sort by Bits: custom comparator. Primary key = popcount, secondary key = value. GCC builtin for popcount.',
    },
    autopsies: [
      {
        cause: 'Comparator not satisfying strict weak ordering',
        wrong: 'return __builtin_popcount(a) <= __builtin_popcount(b); // not transitive',
        testCase: 'a=3(2), b=1(1), c=2(1): a<=b true, b<=c true, a<=c false — violates transitivity',
        fix: 'if (ca != cb) return ca < cb; return a < b; // strict weak ordering',
      },
    ],
    sayIt: [
      'Sort by bits: custom comparator ordering first by popcount (ascending), then by integer value (ascending).',
    ],
  }),

  'bit-hashing': e({
    xray: [
      { text: '**Encode 4 nucleotides** as 2 bits each', kind: 'signal' },
      { text: '**20-bit rolling hash** for 10-char DNA windows', kind: 'constraint' },
    ],
    budget: ['bitMasking', 'bitShift'],
    slottedTemplate: `vector<string> findRepeatedDna(string s) {
    if (s.size() < 10) return {};
    unordered_map<char,int> map{{'A',0},{'C',1},{'G',2},{'T',3}};
    unordered_map<int,int> seen;
    vector<string> ans;
    int hash = 0, mask = (1 << 20) - 1;
    for (int i = 0; i < 10; i++)
        hash = (hash << 2) | map[s[i]];
    seen[hash] = 1;
    for (int i = 10; i < (int)s.size(); i++) {
        hash = ((hash << 2) & mask) | map[s[i]];
        if (seen[hash] == 1) ans.push_back(s.substr(i - 9, 10));
        seen[hash]++;
    }
    return ans;
}`,
    slots: [
      { id: 'HASH_MASK', label: 'Rolling hash mask for 20 bits', hint: '(1 << 20) - 1' },
    ],
    slotFills: {
      187: { HASH_MASK: '(1 << 20) - 1' },
    },
    helixOrder: [187],
    helixDelta: {
      187: 'Repeated DNA: 2-bit encoding per nucleotide. Rolling 20-bit hash for 10-char windows. Track seen hashes to find repeats.',
    },
    autopsies: [
      {
        cause: 'Using wrong mask size — not resetting after removing oldest bits',
        wrong: 'hash = (hash << 2) | map[s[i]]; // no mask: hash grows unbounded',
        testCase: 'After 10+ chars, older bits remain in hash, causing collisions',
        fix: 'hash = ((hash << 2) & mask) | map[s[i]]; // keep only last 20 bits (10 chars)',
      },
    ],
    sayIt: [
      'Bit hashing for DNA: encode A/C/G/T as 2-bit values. Rolling 20-bit hash for 10-char sliding window. O(n) time.',
    ],
  }),

  'bit-trie': e({
    xray: [
      { text: '**Binary trie** (bitwise trie) stores numbers as bit paths', kind: 'signal' },
      { text: 'For max XOR, at each node try **opposite bit** first', kind: 'goal' },
    ],
    budget: ['trieBit', 'xorProperties'],
    slottedTemplate: `class BitTrie {
    BitTrie* next[2] = {};
public:
    void insert(int x) {
        BitTrie* cur = this;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1;
            if (!cur->next[b]) cur->next[b] = new BitTrie();
            cur = cur->next[b];
        }
    }
    int maxXor(int x) {
        BitTrie* cur = this;
        int res = 0;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1;
            if (cur->next[!b]) {
                res |= (1 << i);
                cur = cur->next[!b];
            } else {
                cur = cur->next[b];
            }
        }
        return res;
    }
    int findMaximumXOR(vector<int>& nums) {
        BitTrie trie;
        int ans = 0;
        for (int x : nums) {
            trie.insert(x);
            ans = max(ans, trie.maxXor(x));
        }
        return ans;
    }
};`,
    slots: [
      { id: 'TRIE_OPPOSITE', label: 'Try opposite bit for max XOR', hint: 'cur->next[!b]' },
    ],
    slotFills: {
      421: { TRIE_OPPOSITE: 'cur->next[!b]' },
    },
    helixOrder: [421],
    helixDelta: {
      421: 'Max XOR of Two Numbers: BitTrie. Insert numbers from MSB to LSB. Query each number: at each step, try opposite bit for max XOR result.',
    },
    autopsies: [
      {
        cause: 'Not inserting before query — trie must have at least one number',
        wrong: 'for (int x : nums) ans = max(ans, trie.maxXor(x)); trie.insert(x); // order wrong',
        testCase: 'First maxXor on empty trie returns 0, but also misses x XOR x possibility',
        fix: 'Insert first, then query: trie.insert(x); ans = max(ans, trie.maxXor(x));',
      },
    ],
    sayIt: [
      'Bit trie: binary tree from MSB to LSB. Insert each number. For max XOR, at each bit try the opposite branch first.',
    ],
  }),
}

export function getEnhancement(id: string): LeafEnhancement | undefined {
  return LEAF_ENHANCEMENTS[id]
}
