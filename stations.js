/* ============================================================================
   LESSONS — build-as-we-go, and NO READING REQUIRED.

   A lesson is just a sequence of letters. Each letter becomes a jiggling
   character that Ada presses; it slots into place; the next one arrives.
   No text, no instructions — the moving letter IS the instruction.

   To add a lesson later (home row, a new word, whatever she's into):
     copy a block, give it an id and a `letters` array. That's it.

   NB on capitals: caps need the Shift key, which is a separate thing to teach a
   non-reader visually — deliberately left out of the first lesson so the
   jiggle→slot→explode loop is dead simple. We add caps once she loves the basics.
   ============================================================================ */

const LESSONS = [
  { id: 'name', letters: ['a', 'd', 'a'] },   // Ada's name, lower-case, one hand
];

// which lesson runs right now (MVP: the first one)
const CURRENT_LESSON = 0;
