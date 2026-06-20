/* ============================================================================
   THE NAME LESSON — three stages, NO READING REQUIRED.

   Each stage is a sequence of letters that become jiggling characters Ada
   presses; they slot into place; the next arrives. Capitals need the Shift key,
   so when a stage contains capitals an on-screen Shift key appears and glows
   when she holds the real Shift (her visual "you've got it" cue — no words).

   Build-as-we-go: add more stages here, or more lessons later. That's it.
   ============================================================================ */

const LESSON = {
  id: 'name',
  stages: [
    ['a', 'd', 'a'],   // 1. lower case, one hand
    ['A', 'D', 'A'],   // 2. all capitals (learn Shift)
    ['A', 'd', 'a'],   // 3. a real name: big A, little d, little a
  ],
};
