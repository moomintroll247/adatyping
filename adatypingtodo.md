# AdaTyping — todo & station map

## Todo
- [x] seal bark for each star *(done 5 Jul — seal.mp3 per star, seal_cheer.mp3 on graduation)*
- [x] mark completed stations *(done 5 Jul — progress persists in localStorage; gold star crowns graduated portals in the forest)*
- [x] changes for the next arc *(done 5 Jul)*
  - [x] Can't access the new arc without stars — STAR GATE arch across the path at z=-50; 7 sockets fill as stations graduate; all 7 = arch turns gold and Arc 2 opens
  - [x] new squishies — Arc 2 celebrates with spinning STARS & HEARTS, bouncier physics
  - [x] new tones — Arc 2 uses a warm marimba on a pentatonic scale (different per station)
- [x] Arc 2 built past the gate *(done 5 Jul — braid, juggle, giraffe, tightrope at z -58..-66)*
- [x] Improve the greeters in Arc 2 *(done 5 Jul — unicorn with rainbow braid, juggling fox with orbiting balls, full giraffe with spots/ossicones, chibi elephant in a tutu on a rope)*
- [x] Pink semicircle behind the elephant — gone *(was a CSS tutu blob in tightrope.html; removed 5 Jul)*

## Parent controls (don't tell Ada)

- `index.html?grant` — marks all 7 Arc-1 stations graduated on THIS browser (opens gate 1, for testing/demo)
- `index.html?grant2` — marks Arc 1 + Arc 2 graduated (opens both gates)
- `index.html?reset` — wipes all progress on this browser
- Progress is per-browser (localStorage): stars earned on the laptop don't show on another device.

## Stations

Every station: gentle shake on a wrong key, rising tones, pips count the presses,
squishy burst on stage complete. **Three full rounds ⭐⭐⭐ = graduate** (trophy, fanfare,
the forest button glows).

### Built

| # | Station | Theme | Keys | Sequence (one round) |
|---|---------|-------|------|----------------------|
| 0 | **Name lesson** (`name.html`) | Type your own name | a d + Shift | `ada` → `ADA` (Shift) → `Ada` |
| 1 | **j & k glade** (`jk.html`) | Squishy burst party | j k (right index/middle) | `jjjjjjjj` → `kkkkkkkk` → `jkjkjkjk` → `jjkkjjkk×2` → random 16 |
| 2 | **d & f glade** (`df.html`) | Fidget cascade | d f (left index/middle) | `ffffffff` → `dddddddd` → `fdfdfdfd` → `ffddffdd×2` → random 16 |
| 3 | **💎 Earring Studio** (`earrings.html`) | Hang dangly charms on the gold bar | l (right ring) | 4 → 6 → 8 earrings |
| 4 | **🐌 Snail Spa** (`snail.html`) | Paint swirls on the shell | s (left ring) | 4 → 6 → 8 swirls |
| 5 | **🐜 Ant Parade** (`ants.html`) | March ants in tiny hats | a (left pinky) | 4 → 6 → 8 ants |
| 6 | **😉 The Wink** (`wink.html`) | Wink at the animal friends | ; (right pinky) | 4 → 6 → 8 winks |
| 7 | **🦋 Butterfly Wings** (`butterfly.html`) | Fly up to the hedgehog's flower | a ↔ ; (both pinkies) | `a;a;a;a;` → `aa;;aa;;aa;;` → random 16 |
| 8 | **💇 Hair Braider** (`braid.html`) | Weave the unicorn's braid, bow on | a s d f (left-hand rolls) | `asdf` → `fdsa` → `asdffdsa` → random 8 |
| 9 | **🦊 Juggling Fox** (`juggle.html`) | Toss the circus fox's four balls | j k l ; (right-hand rolls) | `jkl;` → `;lkj` → `jkl;;lkj` → random 8 |
| 10 | **🦒 Stretchy Giraffes** (`giraffe.html`) | Index reaches stretch necks to meet | g & h | `ghghgh` → `gghhgghh` → random 10 |
| 11 | **🤸 Tightrope** (`tightrope.html`) | Tutu elephant crosses the wire | f↔j, d↔k, s↔l, a↔; | 8 steps per pair, all four pairs |
| 12 | **🎹 Piano Paws** (`piano.html`) | Home row = piano; play real tunes, then hear them back | all 8 | Hot Cross Buns → Mary's Lamb → Twinkle |
| 13 | **🪩 Dance Party** (`dance.html`) | Every key is a dance move; routine replays | all 8 | random 6 → 8 → 10 |
| 14 | **🫧 Bubble Fashion Show** (`fashion.html`) | Pop the bubble-letter, dress the model, catwalk | all 8 | random 5 → 6 → 8 |
| 15 | **🧸 Squishy Factory** (`factory.html`) | 3 presses: inflate → paint → face; shelf tips! | all 8 (×3 each) | 3 → 4 → 5 squishies |
| 16 | **🌙 Firefly Jars** (`fireflies.html`) | Catch glowing letters into the jar; lantern finale | all 8 | random 5 → 6 → 8 (wind-down) |

### Planned (design in STATIONS.md)

| # | Station | Theme | Keys |
|---|---------|-------|------|
| 17 | 🦔 Hedgehog Hairstyles | Copy the colour pattern (Simon) | 2–4 key patterns |
| 18 | 🐣 Word Nest | First CVC words (picture + voice) | dad sad lad fad had gal jag |
| 19 | 🎪 Circus Grand Finale | 30-second medley + fireworks | everything |
