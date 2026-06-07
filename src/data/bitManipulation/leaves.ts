import { leaf } from './helpers'
import type { TaxonomyNode } from '../../types'

const CPP = `#include <vector>
#include <algorithm>
#include <functional>
#include <climits>
using namespace std;

`

// ── Family 1: Basic Bit Operations ─────────────────────────────────

export const setBit: TaxonomyNode = leaf('set-bit', 'Set a Bit', 'teal', {
  template: `${CPP}int setBit(int num, int i) {
    return num | (1 << i);
}`,
  problems: [
    { id: 1486, title: 'XOR Operation in an Array', slug: 'xor-operation-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 2: as-is (set bit with OR).' },
  ],
  pitfalls: [
    '❌ Bit positions are 0-indexed; setting bit 31 on a signed 32-bit int can overflow.',
    '❌ OR with (1 << i) leaves already-set bits unchanged — does not toggle.',
  ],
  edgeCases: [
    { input: 'num = 0, i = 0', breaks: '0 | 1 = 1 — correct, LSB set.' },
    { input: 'num = 5 (101), i = 1', breaks: '101 | 010 = 111 — bit already set, unchanged.' },
  ],
  interviewTip: '💡 "Set a bit" → num | (1 << i).',
})

export const clearBit: TaxonomyNode = leaf('clear-bit', 'Clear a Bit', 'teal', {
  template: `${CPP}int clearBit(int num, int i) {
    return num & ~(1 << i);
}`,
  problems: [
    { id: 1342, title: 'Number of Steps to Reduce a Number to Zero', slug: 'number-of-steps-to-reduce-a-number-to-zero', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'Line 2: as-is (clear bit with AND + complement).' },
  ],
  pitfalls: [
    '❌ Forgetting the bitwise NOT (~) — num & (1 << i) clears everything except bit i.',
    '❌ Using ~(1 << i) on a signed int may produce unexpected sign extension.',
  ],
  edgeCases: [
    { input: 'num = 0, i = 3', breaks: '0 & ~8 = 0 — correct, nothing to clear.' },
    { input: 'num = 8 (1000), i = 3', breaks: '1000 & ~1000 = 0 — correct, bit cleared.' },
  ],
  interviewTip: '💡 "Clear a bit" → num & ~(1 << i).',
})

export const toggleBit: TaxonomyNode = leaf('toggle-bit', 'Toggle a Bit', 'teal', {
  template: `${CPP}int toggleBit(int num, int i) {
    return num ^ (1 << i);
}`,
  problems: [
    { id: 1506, title: 'Find Root of N-Ary Tree', slug: 'find-root-of-n-ary-tree', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Line 2: as-is (XOR toggles the bit).' },
  ],
  pitfalls: [
    '❌ XOR toggles but does not indicate previous state — use check first if needed.',
    '❌ Toggling bit 31 on signed int flips sign bit, may cause negative result.',
  ],
  edgeCases: [
    { input: 'num = 0, i = 0', breaks: '0 ^ 1 = 1 — 0 toggled to 1.' },
    { input: 'num = 1, i = 0', breaks: '1 ^ 1 = 0 — 1 toggled back to 0.' },
  ],
  interviewTip: '💡 "Toggle a bit" → num ^ (1 << i).',
})

export const checkBit: TaxonomyNode = leaf('check-bit', 'Check a Bit', 'teal', {
  template: `${CPP}bool checkBit(int num, int i) {
    return (num >> i) & 1;
}`,
  problems: [
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 2: as-is (right shift then AND 1).' },
    { id: 461, title: 'Hamming Distance', slug: 'hamming-distance', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: XOR then count bits where checkBit is 1.', variationCode: 'int hammingDistance(int x, int y) { int d=0; for(int i=0;i<31;i++) if(((x>>i)&1)!=((y>>i)&1)) d++; return d; }' },
  ],
  pitfalls: [
    '❌ (num >> i) & 1 works on unsigned; for signed, right shift may propagate sign bit.',
    '❌ (num & (1 << i)) != 0 is equivalent but reads differently.',
  ],
  edgeCases: [
    { input: 'num = 0, i = 5', breaks: '(0 >> 5) & 1 = 0 — correct.' },
    { input: 'num = -1, i = 0', breaks: '(-1 >> 0) & 1 = 1 — correct, all bits set.' },
  ],
  interviewTip: '💡 "Check a bit" → (num >> i) & 1.',
})

export const clearRmsb: TaxonomyNode = leaf('clear-rmsb', 'Clear Rightmost Set Bit', 'teal', {
  template: `${CPP}int clearRightmostSetBit(int n) {
    return n & (n - 1);
}`,
  problems: [
    { id: 231, title: 'Power of Two', slug: 'power-of-two', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 2: as-is (n & n-1 clears the only set bit → 0).' },
  ],
  pitfalls: [
    '❌ n & (n-1) is 0 for powers of two, but also for n = 0 — check n > 0 first.',
    '❌ For n = 0, n-1 wraps to -1, and 0 & -1 = 0, giving false positive.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: '0 & -1 = 0 — not a power of two but result is 0.' },
    { input: 'n = 8 (1000)', breaks: '1000 & 0111 = 0 — correct, clears the only set bit.' },
  ],
  interviewTip: '💡 "Clear rightmost set bit" → n & (n - 1).',
})

export const extractRmsb: TaxonomyNode = leaf('extract-rmsb', 'Extract Rightmost Set Bit', 'teal', {
  template: `${CPP}int extractRightmostSetBit(int n) {
    return n & -n;
}`,
  problems: [
    { id: 260, title: 'Single Number III', slug: 'single-number-iii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line 2: as-is (isolate rightmost set bit for partitioning).' },
    { id: 201, title: 'Bitwise AND of Numbers Range', slug: 'bitwise-and-of-numbers-range', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], lineChanges: 'Line: strip LSB bits until l == r using n & n-1.', variationCode: 'int rangeBitwiseAnd(int l, int r) { while(l<r) r&=r-1; return r; }' },
  ],
  pitfalls: [
    '❌ n & -n overflows for INT_MIN (-2^31) because -INT_MIN = INT_MIN.',
    '❌ For n = 0, 0 & 0 = 0 — no set bit to extract.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: '0 & 0 = 0 — no rightmost set bit.' },
    { input: 'n = 12 (1100)', breaks: '1100 & 0100 = 4 — extracts 100 (4).' },
  ],
  interviewTip: '💡 "Extract rightmost set bit" → n & -n.',
})

export const clearLsbToI: TaxonomyNode = leaf('clear-lsb-to-i', 'Clear All Bits From LSB to ith', 'teal', {
  template: `${CPP}int clearLsbToI(int n, int i) {
    return n & ~((1 << (i + 1)) - 1);
}`,
  problems: [
    { id: 371, title: 'Sum of Two Integers', slug: 'sum-of-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 2: as-is (clear lower bits for carry isolation).' },
  ],
  pitfalls: [
    '❌ (1 << (i+1)) overflows when i+1 >= 31 on 32-bit signed int.',
    '❌ ~((1 << (i+1)) - 1) on signed int flips sign bit.',
  ],
  edgeCases: [
    { input: 'n = 0xFFFF, i = 4', breaks: 'Clears bits 0-4, keeps bits 5-15.' },
    { input: 'n = 0, i = 3', breaks: '0 & ~15 = 0 — correct, no bits to keep.' },
  ],
  interviewTip: '💡 "Clear bits 0..i" → n & ~((1 << (i+1)) - 1).',
})

export const countSetBits: TaxonomyNode = leaf('count-set-bits', 'Count Set Bits', 'teal', {
  template: `${CPP}int countSetBits(int n) {
    int cnt = 0;
    while (n) {
        cnt += n & 1;
        n >>= 1;
    }
    return cnt;
}`,
  problems: [
    { id: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (loop over bits, count with AND 1).' },
    { id: 338, title: 'Counting Bits', slug: 'counting-bits', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Line: DP recurrence ans[i] = ans[i >> 1] + (i & 1).', variationCode: 'vector<int> countBits(int n) { vector<int> ans(n+1,0); for(int i=1;i<=n;i++) ans[i]=ans[i>>1]+(i&1); return ans; }' },
  ],
  pitfalls: [
    '❌ Loop-based approach is O(number of bits); Kernel approach is O(number of set bits).',
    '❌ Right shift on signed negative numbers propagates sign bit — use unsigned.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: '0 — no set bits, loop does not execute.' },
    { input: 'n = -1 (all bits set)', breaks: 'Sign extension on >> makes loop infinite; cast to unsigned.' },
  ],
  interviewTip: '💡 "Count set bits" → loop: cnt += n & 1; n >>= 1. Or use n & (n-1) for Kernighan.',
})

export const parityCheck: TaxonomyNode = leaf('parity-check', 'Parity Checking', 'teal', {
  template: `${CPP}int parity(int n) {
    int p = 0;
    while (n) {
        p ^= (n & 1);
        n >>= 1;
    }
    return p;
}`,
  problems: [
    { id: 1386, title: 'Cinema Seat Allocation', slug: 'cinema-seat-allocation', companies: ['AMAZON', 'GOOGLE'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (XOR reduces to parity; applied per row seat mask).' },
  ],
  pitfalls: [
    '❌ Parity is 1 for odd number of ones, 0 for even — not the same as population count mod 2.',
    '❌ Using XOR of nibbles/xors can be faster: n ^= n>>16; n ^= n>>8; n ^= n>>4; n &= 0xF;',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: '0 bits → parity 0 (even).' },
    { input: 'n = 7 (111)', breaks: '3 bits → parity 1 (odd).' },
  ],
  interviewTip: '💡 "Parity" → XOR of all bits; return 1 for odd count, 0 for even.',
})

export const bitReversal: TaxonomyNode = leaf('bit-reversal-leaf', 'Bit Reversal', 'teal', {
  template: `${CPP}unsigned int reverseBits(unsigned int n) {
    unsigned int rev = 0;
    for (int i = 0; i < 32; i++) {
        rev = (rev << 1) | (n & 1);
        n >>= 1;
    }
    return rev;
}`,
  problems: [
    { id: 190, title: 'Reverse Bits', slug: 'reverse-bits', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (iterative reversal).' },
    { id: 1009, title: 'Complement of Base 10 Integer', slug: 'complement-of-base-10-integer', companies: ['AMAZON', 'GOOGLE'], lineChanges: 'Line: bit mask with same bit length, then n ^ mask.', variationCode: 'int bitwiseComplement(int n) { if(n==0) return 1; int mask=1; while(mask<n) mask=(mask<<1)|1; return n^mask; }' },
  ],
  pitfalls: [
    '❌ Must use unsigned int — signed right shift fills with sign bit, breaking reversal.',
    '❌ Assumes 32-bit integers; for arbitrary width, loop over bit length of n.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'Reverse of 0 is 0.' },
    { input: 'n = 0x80000000 (MSB set)', breaks: 'Reverse becomes 1 (LSB set).' },
  ],
  interviewTip: '💡 "Reverse bits" → loop 32 times: rev = (rev << 1) | (n & 1); n >>= 1.',
})

export const logicalShifts: TaxonomyNode = leaf('logical-shifts', 'Logical Shifts', 'teal', {
  template: `${CPP}int leftShift(int x, int k) {
    return x << k;
}
int rightShift(int x, int k) {
    return (unsigned int)x >> k;
}`,
  problems: [
    { id: 29, title: 'Divide Two Integers', slug: 'divide-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: use unsigned right shift for positive divisor; left shift for multiplication.', variationCode: 'int divide(int a, int b) { if(a==INT_MIN&&b==-1) return INT_MAX; long la=labs(a), lb=labs(b), q=0; for(int i=31;i>=0;i--) if((lb<<i)<=la){ la-=lb<<i; q|=1LL<<i; } return (a>0)==(b>0)?q:-q; }' },
    { id: 7, title: 'Reverse Integer', slug: 'reverse-integer', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], lineChanges: 'Line: use pop and push with overflow check via shift.', variationCode: 'int reverse(int x) { int r=0; while(x){ if(r>INT_MAX/10||r<INT_MIN/10) return 0; r=r*10+x%10; x/=10; } return r; }' },
  ],
  pitfalls: [
    '❌ Right shift on signed int is implementation-defined (arithmetic on most compilers).',
    '❌ Left shift of signed negative values is undefined behavior.',
  ],
  edgeCases: [
    { input: 'x = -1, k = 1 (arithmetic right shift)', breaks: 'Arithmetic right shift of -1 gives -1, not INT_MAX.' },
    { input: 'x = INT_MIN, k = 1 (left shift)', breaks: 'Left shift of INT_MIN overflows — undefined behavior.' },
  ],
  interviewTip: '💡 "Logical shifts" → left: x << k; unsigned right: (unsigned int)x >> k.',
})

export const mulDivPow2: TaxonomyNode = leaf('mul-div-pow2', 'Multiplication/Division by Powers of 2', 'teal', {
  template: `${CPP}int mulByPow2(int x, int k) {
    return x << k;
}
int divByPow2(int x, int k) {
    return x >> k;
}`,
  problems: [
    { id: 50, title: 'Pow(x, n)', slug: 'powx-n', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line: exponentiation by squaring using bitwise shift and AND.', variationCode: 'double myPow(double x, int n) { long nn=labs(n); double r=1; while(nn){ if(nn&1) r*=x; x*=x; nn>>=1; } return n<0?1/r:r; }' },
    { id: 372, title: 'Super Pow', slug: 'super-pow', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: modular exponentiation with b % phi(m) for exponent reduction.', variationCode: 'int superPow(int a, vector<int>& b) { int mod=1337, r=1; a%=mod; for(int d:b) r=(powmod(r,10,mod)*powmod(a,d,mod))%mod; return r; }' },
  ],
  pitfalls: [
    '❌ x << k is only mul by 2^k for positive x; for negative, behavior is UB on overflow.',
    '❌ x >> k for negative x is not the same as floor division — rounds toward negative infinity.',
  ],
  edgeCases: [
    { input: 'x = -5, k = 1 (divide by 2)', breaks: '-5 >> 1 = -3, but -5/2 = -2 in truncation.' },
    { input: 'x = INT_MAX, k = 1 (mul by 2)', breaks: 'INT_MAX << 1 overflows — undefined behavior.' },
  ],
  interviewTip: '💡 "Mul/div by 2^k" → left: x << k; right: x >> k (unsigned for safety).',
})

export const bitRotation: TaxonomyNode = leaf('bit-rotation', 'Bit Rotation', 'teal', {
  template: `${CPP}unsigned int rotateLeft(unsigned int n, unsigned int d) {
    return (n << d) | (n >> (32 - d));
}
unsigned int rotateRight(unsigned int n, unsigned int d) {
    return (n >> d) | (n << (32 - d));
}`,
  problems: [
    { id: 1238, title: 'Circular Permutation in Binary Representation', slug: 'circular-permutation-in-binary-representation', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 2-4: as-is (rotation over 32 bits for circular shift).' },
  ],
  pitfalls: [
    '❌ d must be < 32; if d >= 32, reduce modulo 32 first.',
    '❌ Using signed int for rotation — sign extension corrupts the result.',
  ],
  edgeCases: [
    { input: 'n = 1, d = 1 (rotate left)', breaks: '(1 << 1) | (1 >> 31) = 2 — correct.' },
    { input: 'n = 0x80000000, d = 1 (rotate right)', breaks: 'MSB moves to bit 30, bit 31 becomes 0.' },
  ],
  interviewTip: '💡 "Rotate left" → (n << d) | (n >> (32-d)); "rotate right" → (n >> d) | (n << (32-d)).',
})

// ── Family 2: Bit Manipulation Applications ────────────────────────

export const addWithoutPlus: TaxonomyNode = leaf('add-without-plus', 'Addition without +', 'blue', {
  template: `${CPP}int add(int a, int b) {
    while (b) {
        int carry = a & b;
        a = a ^ b;
        b = carry << 1;
    }
    return a;
}`,
  problems: [
    { id: 371, title: 'Sum of Two Integers', slug: 'sum-of-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (XOR for sum, AND+shift for carry).' },
  ],
  pitfalls: [
    '❌ carry << 1 eventually becomes 0 for finite bits, but on overflow it wraps.',
    '❌ Signed integer overflow on carry << 1 is undefined behavior in C++.',
  ],
  edgeCases: [
    { input: 'a = 0, b = 0', breaks: 'While loop skipped, returns 0.' },
    { input: 'a = INT_MAX, b = 1', breaks: 'Overflow — result wraps to INT_MIN.' },
  ],
  interviewTip: '💡 "Add without +" → XOR = sum, AND = carry; loop until carry = 0.',
})

export const subWithoutMinus: TaxonomyNode = leaf('sub-without-minus', 'Subtraction without -', 'blue', {
  template: `${CPP}int sub(int a, int b) {
    while (b) {
        int borrow = (~a) & b;
        a = a ^ b;
        b = borrow << 1;
    }
    return a;
}`,
  problems: [
    { id: 371, title: 'Sum of Two Integers', slug: 'sum-of-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (invert a for borrow, XOR, shift borrow).' },
  ],
  pitfalls: [
    '❌ Borrow = (~a) & b, not a & b (which is carry for addition).',
    '❌ Negative numbers in two\'s complement: a - b = a + (~b + 1) = a + (-b).',
  ],
  edgeCases: [
    { input: 'a = 10, b = 10', breaks: 'Result 0 — borrow loop terminates.' },
    { input: 'a = 0, b = 1', breaks: 'Result -1 — borrow propagates through all bits.' },
  ],
  interviewTip: "💡 'Subtract without -' → borrow = (~a) & b; a ^= b; b = borrow << 1;.",
})

export const mulDivBit: TaxonomyNode = leaf('mul-div-bit', 'Multiplication/Division (bitwise)', 'blue', {
  template: `${CPP}int multiply(int a, int b) {
    int res = 0;
    while (b) {
        if (b & 1) res += a;
        a <<= 1;
        b >>= 1;
    }
    return res;
}`,
  problems: [
    { id: 29, title: 'Divide Two Integers', slug: 'divide-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (shift-and-add multiplication).' },
  ],
  pitfalls: [
    '❌ a <<= 1 may overflow before reaching final result.',
    '❌ Only works for non-negative b; for signed, handle sign separately.',
  ],
  edgeCases: [
    { input: 'a = 0, b = 100', breaks: '0 — loop skips additions, returns 0.' },
    { input: 'a = INT_MAX, b = 2', breaks: 'a <<= 1 overflows on last iteration.' },
  ],
  interviewTip: '💡 "Bitwise multiply" → shift-and-add: for each bit of b, shift a and add if bit set.',
})

export const findSingleNum: TaxonomyNode = leaf('find-single-num', 'Finding Single Number', 'blue', {
  template: `${CPP}int singleNumber(vector<int>& nums) {
    int x = 0;
    for (int n : nums) x ^= n;
    return x;
}`,
  problems: [
    { id: 136, title: 'Single Number', slug: 'single-number', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 2-4: as-is (XOR all elements).' },
    { id: 137, title: 'Single Number II', slug: 'single-number-ii', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: three-state machine with ones/twos bitmask.', variationCode: 'int singleNumber(vector<int>& nums) { int ones=0,twos=0; for(int n:nums){ ones=(ones^n)&~twos; twos=(twos^n)&~ones; } return ones; }' },
    { id: 260, title: 'Single Number III', slug: 'single-number-iii', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line: XOR all, extract rightmost set bit, partition.', variationCode: 'vector<int> singleNumber(vector<int>& nums) { long x=0; for(int n:nums) x^=n; int rsb=x&-x, a=0,b=0; for(int n:nums) if(n&rsb) a^=n; else b^=n; return {a,b}; }' },
  ],
  pitfalls: [
    '❌ XOR works only for even count duplicates; for thrice-appearing numbers, use state machine.',
    '❌ LC 260: need to handle INT_MIN for rsb extraction safely.',
  ],
  edgeCases: [
    { input: '[0]', breaks: '0 XOR 0 = 0 — correct, single element is 0.' },
    { input: '[INT_MIN, INT_MIN, INT_MAX]', breaks: 'XOR cancels INT_MIN pair, leaving INT_MAX.' },
  ],
  interviewTip: '💡 "Find single number" → XOR all; duplicates cancel (a ^ a = 0).',
})

export const findMissingNum: TaxonomyNode = leaf('find-missing-num', 'Finding Missing Number', 'blue', {
  template: `${CPP}int missingNumber(vector<int>& nums) {
    int x = 0, n = (int)nums.size();
    for (int i = 0; i < n; i++)
        x ^= (i + 1) ^ nums[i];
    return x;
}`,
  problems: [
    { id: 268, title: 'Missing Number', slug: 'missing-number', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-5: as-is (XOR index+1 with value).' },
    { id: 389, title: 'Find the Difference', slug: 'find-the-difference', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: XOR chars of s and t; result is extra char.', variationCode: 'char findTheDifference(string s, string t) { char c=0; for(char ch:s) c^=ch; for(char ch:t) c^=ch; return c; }' },
  ],
  pitfalls: [
    '❌ XOR approach cancels index^i for i present; remaining value is the missing number.',
    '❌ Sum-based approach can overflow; XOR avoids overflow entirely.',
  ],
  edgeCases: [
    { input: '[0]', breaks: 'i=0: (1)^0 = 1 — missing number 1.' },
    { input: '[1]', breaks: 'i=0: (1)^1 = 0 — missing number 0.' },
  ],
  interviewTip: '💡 "Find missing number" → XOR all indices+1 and values; duplicates cancel.',
})

export const swapValues: TaxonomyNode = leaf('swap-values', 'Swapping Values (XOR swap)', 'blue', {
  template: `${CPP}void xorSwap(int& a, int& b) {
    a ^= b;
    b ^= a;
    a ^= b;
}`,
  problems: [
    { id: 1720, title: 'Decode XORed Array', slug: 'decode-xored-array', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2-4: as-is (XOR swap used in decoding).' },
  ],
  pitfalls: [
    '❌ XOR swap fails if a and b reference the same variable (becomes 0).',
    '❌ Compiler optimizations make XOR swap slower than tmp swap on modern CPUs.',
  ],
  edgeCases: [
    { input: 'a = 5, b = 5 (same value, different refs)', breaks: '5^5=0, 0^5=5, 5^0=5 — correct, both become 5.' },
    { input: 'swap(a, a) — same reference', breaks: 'a^=a = 0; then 0^=0 = 0; then 0^=0 = 0 — loses the value!' },
  ],
  interviewTip: '💡 "XOR swap" → a ^= b; b ^= a; a ^= b; but avoid if a and b alias the same variable.',
})

export const bitMasking: TaxonomyNode = leaf('bit-masking', 'Bit Masking', 'blue', {
  template: `${CPP}int applyMask(int num, int mask) {
    return num & mask;
}
int setWithMask(int num, int mask) {
    return num | mask;
}
int toggleWithMask(int num, int mask) {
    return num ^ mask;
}`,
  problems: [
    { id: 1178, title: 'Number of Valid Words for Each Puzzle', slug: 'number-of-valid-words-for-each-puzzle', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 2-8: as-is (mask words/puzzles by bitmask of chars).' },
    { id: 187, title: 'Repeated DNA Sequences', slug: 'repeated-dna-sequences', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], lineChanges: 'Line: encode 10-char string as 20-bit mask, track seen masks.', variationCode: `vector<string> findRepeatedDnaSequences(string s) { unordered_map<char,int> m={{'A',0},{'C',1},{'G',2},{'T',3}}; unordered_map<int,int> seen; vector<string> ans; if(s.size()<10) return ans; int h=0, mask=(1<<20)-1; for(int i=0;i<10;i++) h=(h<<2)|m[s[i]]; seen[h]=1; for(int i=10;i<s.size();i++){ h=((h<<2)&mask)|m[s[i]]; if(seen[h]==1) ans.push_back(s.substr(i-9,10)); seen[h]++; } return ans; }` },
  ],
  pitfalls: [
    '❌ AND masks extract bits; OR masks set bits; XOR masks toggle bits.',
    '❌ For LC 1178, bitmask each word as int (26 bits), puzzle requires first char match.',
  ],
  edgeCases: [
    { input: 'num = 0xFF, mask = 0x0F (apply mask)', breaks: '0xFF & 0x0F = 0x0F — extracts lower 4 bits.' },
    { input: 'num = 0, mask = 0xF0 (set with mask)', breaks: '0 | 0xF0 = 0xF0 — sets upper 4 bits.' },
  ],
  interviewTip: '💡 "Bit masking" → AND to extract, OR to set, XOR to toggle specific bits.',
})

export const rangeOps: TaxonomyNode = leaf('range-ops', 'Range Operations (AND/OR)', 'blue', {
  template: `${CPP}int rangeBitwiseAnd(int l, int r) {
    int shift = 0;
    while (l < r) {
        l >>= 1;
        r >>= 1;
        shift++;
    }
    return l << shift;
}`,
  problems: [
    { id: 201, title: 'Bitwise AND of Numbers Range', slug: 'bitwise-and-of-numbers-range', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (find common prefix by shifting).' },
    { id: 898, title: 'Bitwise ORs of Subarrays', slug: 'bitwise-ors-of-subarrays', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: set-based DP tracking unique OR values of subarrays ending at i.', variationCode: 'int subarrayBitwiseORs(vector<int>& arr) { unordered_set<int> res, cur; for(int x:arr){ unordered_set<int> nxt; nxt.insert(x); for(int v:cur) nxt.insert(v|x); cur=nxt; res.insert(cur.begin(),cur.end()); } return res.size(); }' },
  ],
  pitfalls: [
    '❌ Range AND finds common prefix; the differing lower bits all become 0.',
    '❌ For LC 898, OR values can only increase; at most 32 distinct values per position.',
  ],
  edgeCases: [
    { input: 'l = 5, r = 7', breaks: '5(101) & 6(110) & 7(111) = 4(100) — common prefix 100.' },
    { input: 'l = 0, r = 0', breaks: 'While loop skipped, returns 0 << 0 = 0.' },
  ],
  interviewTip: '💡 "Range AND" → find common bit prefix by shifting l and r right until equal.',
})

export const grayCode: TaxonomyNode = leaf('gray-code-leaf', 'Gray Code', 'blue', {
  template: `${CPP}vector<int> grayCode(int n) {
    vector<int> res;
    for (int i = 0; i < (1 << n); i++)
        res.push_back(i ^ (i >> 1));
    return res;
}`,
  problems: [
    { id: 89, title: 'Gray Code', slug: 'gray-code', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-5: as-is (binary to Gray: i ^ (i>>1)).' },
    { id: 1611, title: 'Minimum One Bit Operations', slug: 'minimum-one-bit-operations-to-make-integers-zero', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: transform using Gray code relation: f(n) = 2*f(n-1) + 1.', variationCode: 'int minimumOneBitOperations(int n) { if(n==0) return 0; int m=1; while((m<<1)<=n) m<<=1; return 2*minimumOneBitOperations(n^m)+1; }' },
  ],
  pitfalls: [
    '❌ Gray code: i ^ (i>>1) — adjacent values differ by exactly one bit.',
    '❌ LC 1611: operations are symmetric; Gray code of n gives the operation count.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'Loop runs 1 time (1<<0=1), returns [0].' },
    { input: 'n = 2', breaks: 'Returns [0,1,3,2] — adjacent differ by 1 bit.' },
  ],
  interviewTip: '💡 "Gray code" → n-th Gray code = n ^ (n >> 1).',
})

export const bitVector: TaxonomyNode = leaf('bit-vector', 'Bit Vector', 'blue', {
  template: `${CPP}class BitVector {
    vector<int> bits;
public:
    BitVector(int n) : bits((n + 31) / 32, 0) {}
    void set(int i) { bits[i / 32] |= (1 << (i % 32)); }
    bool get(int i) { return (bits[i / 32] >> (i % 32)) & 1; }
    void clear(int i) { bits[i / 32] &= ~(1 << (i % 32)); }
};`,
  problems: [
    { id: 1461, title: 'Check Binary Codes Size K', slug: 'check-if-a-string-contains-all-binary-codes-of-size-k', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (bit vector for seen k-bit patterns).' },
    { id: 421, title: 'Maximum XOR of Two Numbers', slug: 'maximum-xor-of-two-numbers-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Line: Trie-based approach preferred over bit vector for this problem.', variationCode: '// See bit-trie leaf for the Trie-based solution' },
  ],
  pitfalls: [
    '❌ Bit vector saves memory vs bool array: n bits vs n bytes.',
    '❌ i/32 and i%32 for index computation — easy off-by-one with parentheses.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'Empty vector; no bits to set.' },
    { input: 'n = 33 (spans two ints)', breaks: 'Access i=32: bits[1] |= (1 << 0) — correct.' },
  ],
  interviewTip: '💡 "Bit vector" → array of ints; bits[i/32] |= 1<<(i%32) for set.',
})

export const bitFlags: TaxonomyNode = leaf('bit-flags', 'Bit Flags', 'blue', {
  template: `${CPP}vector<vector<int>> subsets(vector<int>& nums) {
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
  problems: [
    { id: 78, title: 'Subsets', slug: 'subsets', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 4-10: as-is (bitmask enumeration of all subsets).' },
    { id: 1286, title: 'Iterator for Combination', slug: 'iterator-for-combination', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: use bitmask to iterate combinations of size k.', variationCode: '// Generate next combination: find rightmost 01 -> 10, shift remaining 1s right' },
  ],
  pitfalls: [
    '❌ (1 << n) overflows for n >= 31 — use longer type or early exit.',
    '❌ For combination of size k, iterate masks with popcount == k to prune.',
  ],
  edgeCases: [
    { input: 'nums = []', breaks: '1<<0 = 1, mask=0: empty subset; result = [[]].' },
    { input: 'nums = [1]', breaks: 'masks 0 ([]) and 1 ([1]).' },
  ],
  interviewTip: '💡 "Subsets via bit flags" → for mask in 0..2^n-1: include nums[i] if mask bit i set.',
})

export const bitmaskVisited: TaxonomyNode = leaf('bitmask-visited', 'Bitmask for Visited States', 'blue', {
  template: `${CPP}int shortestPathAllNodes(vector<vector<int>>& graph) {
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
  problems: [
    { id: 847, title: 'Shortest Path Visiting All Nodes', slug: 'shortest-path-visiting-all-nodes', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-21: as-is (BFS over (node, visited mask) states).' },
    { id: 1392, title: 'Longest Happy Prefix', slug: 'longest-happy-prefix', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: KMP prefix function; not a bitmask visited problem.', variationCode: '// KMP prefix function: compute lps array for string' },
  ],
  pitfalls: [
    '❌ State space is n * 2^n — BFS may be slow for n > 12.',
    '❌ (1 << n) overflows for n >= 31; n is small in LC 847 (n <= 12).',
  ],
  edgeCases: [
    { input: 'single node graph [[0]]', breaks: 'BFS from node 0 with mask 1; returns 0.' },
    { input: 'disconnected graph', breaks: 'BFS never reaches full mask; returns -1.' },
  ],
  interviewTip: '💡 "Bitmask visited" → state = (node, mask); BFS until mask == (1<<n)-1.',
})

// ── Family 3: Bitwise Dynamic Programming ──────────────────────────

export const subsetStateDp: TaxonomyNode = leaf('subset-state-dp', 'Subset State Problems (Bitmask DP)', 'purple', {
  template: `${CPP}int minNumberOfSemesters(int n, vector<vector<int>>& relations, int k) {
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
  problems: [
    { id: 1125, title: 'Smallest Sufficient Team', slug: 'smallest-sufficient-team', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-17: as-is (bitmask DP over skill sets).' },
    { id: 1494, title: 'Parallel Courses II', slug: 'parallel-courses-ii', companies: ['GOOGLE', 'AMAZON'], lineChanges: 'Line: same template — prereq mask, subset enumeration.', variationCode: '// Same as template; prereq and k vary per instance' },
  ],
  pitfalls: [
    '❌ (1 << n) overflows for n > 30; typical n <= 15 in bitmask DP.',
    '❌ Subset enumeration: for (sub = avail; sub; sub = (sub-1) & avail) enumerates all non-empty subsets.',
  ],
  edgeCases: [
    { input: 'n = 1, k = 1, no relations', breaks: 'dp[0] = 0; avail has bit 0; dp[1] = min(dp[1], 0+1) = 1.' },
    { input: 'cycle in prerequisites', breaks: 'prereq[i] never satisfied; avail stays 0; no transition.' },
  ],
  interviewTip: '💡 "Subset state DP" → dp[mask] = min steps; enumerate submasks of available courses ≤ k.',
})

export const tspBitmask: TaxonomyNode = leaf('tsp-bitmask', 'Traveling Salesman Problem', 'purple', {
  template: `${CPP}int tsp(int n, vector<vector<int>>& dist) {
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
  problems: [
    { id: 943, title: 'Find the Shortest Superstring', slug: 'find-the-shortest-superstring', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-15: as-is (TSP DP over string overlaps).' },
    { id: 847, title: 'Shortest Path Visiting All Nodes', slug: 'shortest-path-visiting-all-nodes', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Line: Floyd-Warshall for all-pair distances, then TSP DP.', variationCode: '// Compute all-pair shortest path by BFS from each node; run TSP DP on dist matrix' },
  ],
  pitfalls: [
    '❌ mask starts at 1 and increments by 2 (node 0 always visited first).',
    '❌ dp size is 2^n * n — O(n^2 * 2^n) time, n <= 12-15 typically.',
  ],
  edgeCases: [
    { input: 'n = 2, dist = [[0,5],[5,0]]', breaks: 'dp[3][1] = dp[1][0] + dist[0][1] = 5; ans = 5 + dist[1][0] = 10.' },
    { input: 'n = 1, dist = [[0]]', breaks: 'dp[1][0] = 0; loop for i=1..n-1 none; ans = 1e9 (but should be 0).' },
  ],
  interviewTip: '💡 "TSP bitmask" → dp[mask][last] = min cost; transition: add unvisited node to mask.',
})

export const maxStudentsExam: TaxonomyNode = leaf('max-students-exam', 'Maximum Students Taking Exam', 'purple', {
  template: `${CPP}int maxStudents(vector<vector<char>>& seats) {
    int m = (int)seats.size(), n = (int)seats[0].size();
    vector<int> valid(m, 0);
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (seats[i][j] == '.') valid[i] |= (1 << j);
    vector<vector<int>> dp(m + 1, vector<int>(1 << n, -1));
    dp[0][0] = 0;
    for (int i = 0; i < m; i++) {
        for (int cur = valid[i]; ; cur = (cur - 1) & valid[i]) {
            if (cur & (cur << 1)) { if (cur == 0) break; continue; }
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
  problems: [
    { id: 1349, title: 'Maximum Students Taking Exam', slug: 'maximum-students-taking-exam', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-21: as-is (row-by-row DP with bitmask constraints).' },
  ],
  pitfalls: [
    '❌ cur & (cur << 1) checks adjacent seats in same row — must be 0.',
    '❌ prev & (cur << 1) checks front-left; prev & (cur >> 1) checks front-right.',
  ],
  edgeCases: [
    { input: 'seats = [["#"]]', breaks: 'valid[0] = 0; only cur=0 is valid; dp[1][0] = max dp row 0.' },
    { input: 'seats = [["."]]', breaks: 'valid[0] = 1; cur=1 (only); dp[1][1] = 1.' },
  ],
  interviewTip: '💡 "Max students exam" → row-by-row DP; each row mask must have no adjacent 1s and no conflicts with previous row.',
})

export const minCostConnectGroups: TaxonomyNode = leaf('min-cost-connect-groups', 'Minimum Cost to Connect Groups', 'purple', {
  template: `${CPP}int connectTwoGroups(vector<vector<int>>& cost) {
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
  problems: [
    { id: 1595, title: 'Minimum Cost Connect Groups', slug: 'minimum-cost-to-connect-two-groups-of-points', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-17: as-is (DP over group A mask, each group B point connects once).' },
  ],
  pitfalls: [
    '❌ Each point in group B must connect to at least one in A — minCost[j] ensures fallback.',
    '❌ dp[mask] where mask bits represent which group A points are connected.',
  ],
  edgeCases: [
    { input: 'cost = [[1]] (m=1,n=1)', breaks: 'dp[0]=0; j=0: ndp[1]=0+1=1; dp[1]=1.' },
    { input: 'cost = [[1,2],[3,4]] (m=2,n=2)', breaks: 'DP explores all connection combinations.' },
  ],
  interviewTip: "💡 'Min cost connect groups' → DP over first group's mask; for each second-group point, connect to one first-group point or reuse minimum.",
})

export const waysWearHats: TaxonomyNode = leaf('ways-wear-hats', 'Ways to Wear Different Hats', 'purple', {
  template: `${CPP}int numberWays(vector<vector<int>>& hats) {
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
  problems: [
    { id: 1434, title: 'Ways to Wear Hats', slug: 'number-of-ways-to-wear-different-hats-to-each-other', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-16: as-is (DP over hat types, track which persons have hats).' },
  ],
  pitfalls: [
    '❌ Hat to person mapping: iterate over hats assigned to each person, then reverse.',
    '❌ dp[mask] counts ways for subset of persons to have hats; mod after each addition.',
  ],
  edgeCases: [
    { input: 'hats = [[1]] (1 person, 1 hat)', breaks: 'h=1: p=0, mask=0: ndp[1] += dp[0] = 1; dp[1]=1.' },
    { input: 'hats = [[1],[1]] (2 persons, same hat)', breaks: 'Only one person can wear hat 1; dp[full] = 0.' },
  ],
  interviewTip: '💡 "Ways to wear hats" → iterate hat types; dp[mask] = ways to cover person subset; for each hat, assign to eligible person not yet covered.',
})

export const mysteriousFunction: TaxonomyNode = leaf('mysterious-function', 'Mysterious Function Closest to Target', 'purple', {
  template: `${CPP}int closestToTarget(vector<int>& arr, int target) {
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
  problems: [
    { id: 1521, title: 'Mysterious Function Closest Target', slug: 'find-a-value-of-a-mysterious-function-closest-to-target', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-11: as-is (set of AND values ending at each position).' },
  ],
  pitfalls: [
    '❌ AND values decrease monotonically; at most 32 distinct values per position.',
    '❌ Using set (not unordered_set) for O(32) per element still O(32n).',
  ],
  edgeCases: [
    { input: 'arr = [1], target = 5', breaks: 'nxt = {1}; ans = |1-5| = 4.' },
    { input: 'arr = [10, 20], target = 0', breaks: 'cur after 10: {10}; cur after 20: {20, 0}; ans = 0.' },
  ],
  interviewTip: '💡 "Mysterious function" → track all possible AND values ending at each index; at most 32 distinct values.',
})

export const distributeRepeating: TaxonomyNode = leaf('distribute-repeating', 'Distribute Repeating Integers', 'purple', {
  template: `${CPP}bool canDistribute(vector<int>& nums, vector<int>& quantity) {
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
  problems: [
    { id: 1655, title: 'Distribute Repeating Integers', slug: 'distribute-repeating-integers', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 3-23: as-is (DP over unique numbers and quantity masks).' },
  ],
  pitfalls: [
    '❌ Precompute sum[mask] for each subset of quantities to avoid repeated summing.',
    '❌ dp[i][mask] = can distribute to mask using first i number groups.',
  ],
  edgeCases: [
    { input: 'nums = [1], quantity = [1]', breaks: 'counts = [1]; sum[1]=1 <= 1; dp[1][1]=true.' },
    { input: 'nums = [1,1], quantity = [3]', breaks: 'counts = [2]; sum[1]=3 > 2; dp[1][1]=false.' },
  ],
  interviewTip: '💡 "Distribute repeating integers" → DP over unique number frequencies and customer quantity masks; precompute subset sums.',
})

export const maxXorArray: TaxonomyNode = leaf('max-xor-array', 'Maximum XOR of Two Numbers', 'purple', {
  template: `${CPP}int findMaximumXOR(vector<int>& nums) {
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
  problems: [
    { id: 421, title: 'Maximum XOR of Two Numbers', slug: 'maximum-xor-of-two-numbers-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-15: as-is (greedy building max XOR bit by bit with prefix set).' },
  ],
  pitfalls: [
    '❌ Greedy from MSB: candidate = ans | (1<<i); check if two prefixes XOR to candidate.',
    '❌ Alternative: Trie-based (bit-trie leaf) is more intuitive for some.',
  ],
  edgeCases: [
    { input: '[0]', breaks: 'Only one element; ans stays 0 (XOR with itself).' },
    { input: '[INT_MAX, 0]', breaks: 'INT_MAX ^ 0 = INT_MAX — checks all 31 bits.' },
  ],
  interviewTip: '💡 "Max XOR of two numbers" → greedy from MSB; maintain prefix set; check if (candidate XOR prefix) in set.',
})

// ── Family 4: Bit Tricks & Optimizations ───────────────────────────

export const kernighanCount: TaxonomyNode = leaf('kernighan-count', `Brian Kernighan's Algorithm`, 'amber', {
  template: `${CPP}int kernighanCount(int n) {
    int cnt = 0;
    while (n) {
        n &= (n - 1);
        cnt++;
    }
    return cnt;
}`,
  problems: [
    { id: 338, title: 'Counting Bits', slug: 'counting-bits', companies: ['GOOGLE', 'AMAZON', 'META', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-7: as-is (n & (n-1) removes one set bit per iteration).' },
  ],
  pitfalls: [
    '❌ Only efficient when number of set bits is small; worst case O(32) same as loop.',
    '❌ For n = 0, while loop never executes, cnt = 0 — correct.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'Loop not entered; returns 0.' },
    { input: 'n = INT_MIN (-2147483648)', breaks: 'n-1 overflows for INT_MIN (two\'s complement).' },
  ],
  interviewTip: '💡 "Kernighan count" → while(n) { n &= n-1; cnt++; } — runs once per set bit.',
})

export const powerOfTwo: TaxonomyNode = leaf('power-of-two-leaf', 'Check if Power of Two', 'amber', {
  template: `${CPP}bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
  problems: [
    { id: 231, title: 'Power of Two', slug: 'power-of-two', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Line 2: as-is (positive and n & n-1 == 0).' },
    { id: 342, title: 'Power of Four', slug: 'power-of-four', companies: ['GOOGLE', 'AMAZON', 'META'], lineChanges: 'Line: add check (n & 0x55555555) != 0 for power of four.', variationCode: 'bool isPowerOfFour(int n) { return n > 0 && (n & (n-1)) == 0 && (n & 0x55555555) != 0; }' },
  ],
  pitfalls: [
    '❌ n > 0 is required — n = 0 gives false positive for n & n-1 == 0.',
    '❌ INT_MIN: n-1 overflows but n > 0 check catches it first.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: '0 > 0 is false — returns false (correct).' },
    { input: 'n = 1 (2^0)', breaks: '1 > 0 && (1 & 0) == 0 → true.' },
  ],
  interviewTip: '💡 "Power of two" → n > 0 && (n & (n-1)) == 0.',
})

export const powerOfFour: TaxonomyNode = leaf('power-of-four', 'Check if Power of Four', 'amber', {
  template: `${CPP}bool isPowerOfFour(int n) {
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
}`,
  problems: [
    { id: 342, title: 'Power of Four', slug: 'power-of-four', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2: as-is (power of two + mask check for odd-positioned bit).' },
  ],
  pitfalls: [
    '❌ 0x55555555 = 0101...0101 — powers of four have their 1 bit at an odd position.',
    '❌ Also can check n % 3 == 1 (since 4^k % 3 == 1) as an alternative.',
  ],
  edgeCases: [
    { input: 'n = 1 (4^0)', breaks: '1 & 0x55555555 = 1 != 0 — true.' },
    { input: 'n = 2 (not power of 4)', breaks: 'n & n-1 = 0 (power of 2) but n & 0x55555555 = 0 — false.' },
  ],
  interviewTip: '💡 "Power of four" → power of two AND (n & 0x55555555) != 0.',
})

export const fastMul: TaxonomyNode = leaf('fast-mul', 'Fast Multiplication (bitwise)', 'amber', {
  template: `${CPP}int fastMultiply(int a, int b) {
    int res = 0;
    while (b) {
        if (b & 1) res += a;
        a <<= 1;
        b >>= 1;
    }
    return res;
}`,
  problems: [
    { id: 29, title: 'Divide Two Integers', slug: 'divide-two-integers', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (Russian peasant multiplication).' },
  ],
  pitfalls: [
    '❌ a <<= 1 may overflow; use unsigned or check bounds before shift.',
    '❌ Only non-negative b works; for signed, handle sign separately then convert.',
  ],
  edgeCases: [
    { input: 'a = 0, b = 100', breaks: 'res stays 0; returns 0.' },
    { input: 'a = 3, b = 5', breaks: 'res: 3 + 6 + 0 + 12 = 15 = 3*5.' },
  ],
  interviewTip: '💡 "Fast bitwise multiply" → for each bit of b: if set, add a; shift a left, b right.',
})

export const nextSameBits: TaxonomyNode = leaf('next-same-bits', 'Next Higher/Lower with Same Bit Count', 'amber', {
  template: `${CPP}int nextHigherSameBits(int n) {
    int c = n & -n;
    int r = n + c;
    return r | (((n ^ r) >> 2) / c);
}`,
  problems: [
    { id: 1611, title: 'Min One Bit Ops', slug: 'minimum-one-bit-operations-to-make-integers-zero', companies: ['GOOGLE', 'AMAZON'], mustKnow: true, lineChanges: 'Lines 2-4: as-is (Gosper\'s hack for next combination with same popcount).' },
  ],
  pitfalls: [
    '❌ c = n & -n (rightmost set bit); r = n + c (carry into next higher bit).',
    '❌ Division by c is safe because c is a power of two.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'c = 0; r = 0; division by zero on line 4.' },
    { input: 'n = INT_MAX (all bits set)', breaks: 'n + c overflows; no higher number with same bits.' },
  ],
  interviewTip: '💡 "Next number same bits" → c = n & -n; r = n + c; r | ((n ^ r) >> 2) / c.',
})

export const intLog: TaxonomyNode = leaf('int-log', 'Integer Logarithm', 'amber', {
  template: `${CPP}int intLog2(int n) {
    int res = 0;
    while (n >>= 1) res++;
    return res;
}`,
  problems: [
    { id: 338, title: 'Counting Bits', slug: 'counting-bits', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 2-5: as-is (floor(log2(n)) by repeated right shift).' },
  ],
  pitfalls: [
    '❌ Returns floor(log2(n)); for n = 0, loop never enters and returns 0 (wrong: log 0 is undefined).',
    '❌ For n = 1, n >>= 1 = 0, res = 0 — correct: log2(1) = 0.',
  ],
  edgeCases: [
    { input: 'n = 0', breaks: 'Loop never enters; returns 0 — but log2(0) is undefined.' },
    { input: 'n = 8', breaks: 'n=4->res=1, n=2->res=2, n=1->res=3, n=0 -> exit; returns 3 = log2(8).' },
  ],
  interviewTip: "💡 'Integer log2' → while(n >>= 1) res++; returns floor(log2(n)).",
})

export const bitSorting: TaxonomyNode = leaf('bit-sorting', 'Bit Manipulation in Sorting', 'amber', {
  template: `${CPP}vector<int> sortByBits(vector<int>& arr) {
    sort(arr.begin(), arr.end(), [](int a, int b) {
        int ca = __builtin_popcount(a);
        int cb = __builtin_popcount(b);
        if (ca != cb) return ca < cb;
        return a < b;
    });
    return arr;
}`,
  problems: [
    { id: 1356, title: 'Sort by Bits', slug: 'sort-integers-by-the-number-of-1-bits', companies: ['GOOGLE', 'AMAZON', 'META'], mustKnow: true, lineChanges: 'Lines 3-8: as-is (custom comparator using popcount).' },
  ],
  pitfalls: [
    '❌ __builtin_popcount is GCC/Clang specific; MSVC uses __popcnt.',
    '❌ Stable sort not needed; comparator must be strict weak ordering.',
  ],
  edgeCases: [
    { input: '[0, 1, 2, 3]', breaks: '0(0), 1(1), 2(1), 3(2) → [0,1,2,3] sorted by bit count.' },
    { input: '[7, 8]', breaks: '7(111=3), 8(1000=1) → [8,7].' },
  ],
  interviewTip: '💡 "Sort by bits" → custom comparator: compare popcount, then value.',
})

export const bitHashing: TaxonomyNode = leaf('bit-hashing', 'Bit Manipulation in Hashing', 'amber', {
  template: `${CPP}vector<string> findRepeatedDna(string s) {
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
  problems: [
    { id: 187, title: 'Repeated DNA Sequences', slug: 'repeated-dna-sequences', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-18: as-is (rolling bit hash for 10-char windows).' },
  ],
  pitfalls: [
    '❌ 2 bits per nucleotide: 10 chars = 20 bits fits in 32-bit int.',
    '❌ Mask = (1 << 20) - 1 keeps only the last 20 bits for sliding window.',
  ],
  edgeCases: [
    { input: 's = "AAAA" (len < 10)', breaks: 'Early return {}.' },
    { input: 's = "AAAAAAAAAAA" (11 As)', breaks: '10-char windows at 0 and 1; both hash = 0; detected as repeated.' },
  ],
  interviewTip: '💡 "Bit hashing" → encode chars as 2-bit values; rolling hash over 10-char window fits in 20 bits.',
})

export const bitTrie: TaxonomyNode = leaf('bit-trie', 'Bit Manipulation in Trie', 'amber', {
  template: `${CPP}class BitTrie {
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
  problems: [
    { id: 421, title: 'Maximum XOR of Two Numbers', slug: 'maximum-xor-of-two-numbers-in-an-array', companies: ['GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'APPLE'], mustKnow: true, lineChanges: 'Lines 3-33: as-is (bitwise trie for max XOR pair).' },
  ],
  pitfalls: [
    '❌ Memory: each insertion creates up to 31 nodes; for large arrays, use array-based trie.',
    '❌ Insert before query: ensures at least one existing number for XOR comparison.',
  ],
  edgeCases: [
    { input: 'nums = [0]', breaks: 'Insert 0; maxXor(0) = 0; ans = 0.' },
    { input: 'nums = [1, 2, 3]', breaks: '1^2=3, 1^3=2, 2^3=1; max = 3.' },
  ],
  interviewTip: '💡 "Bit trie" → insert numbers bit by bit from MSB; for max XOR, try opposite bit at each step.',
})
