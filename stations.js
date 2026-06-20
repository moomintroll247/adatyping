/* ============================================================================
   STATIONS — the whole forest lives here. This is the "build-as-we-go" file.

   To add a new place (a glade, cabin, tunnel...) when Ada's into something new:
     1. Copy one of the blocks below.
     2. Give it a new `id`, a `title`, an emoji `icon`, and a `guide` character.
     3. Write the `steps` — each step is { prompt, target, display }.
            target  = exactly what she types (e.g. "ada")
            display = how it looks on screen (e.g. "a d a")
     4. Leave `locked: true`. It unlocks automatically when she finishes the
        station before it (order = the order in this list).
   That's it. No other file needs touching.

   Swapping in Ada's own art: drop an image in /assets and point `guide.sprite`
   at it (e.g. "assets/axie.png"). Until then a friendly emoji stands in.
   ============================================================================ */

const STATIONS = [
  {
    id: 'first-glade',
    title: 'The First Glade',
    icon: '🌿',
    locked: false,                 // the only one open to start
    guide: { name: 'Axie the Axolotl', emoji: '🦎', sprite: '' },
    reward: "You typed your whole name, Ada! You're a real typist now! 🌈",
    steps: [
      { prompt: "Hi Ada! I'm Axie. Let's type your name with ONE hand. Tap: a, then d, then a.",
        target: 'ada',  display: 'a d a' },
      { prompt: "Brilliant! Now BIG letters. Hold the Shift key and tap them: A, D, A.",
        target: 'ADA',  display: 'A D A' },
      { prompt: "Last one — a real name! A big A, then little d and a.",
        target: 'Ada',  display: 'A d a' },
    ],
  },

  /* --- Everything below is LOCKED and waiting to be built WITH Ada. ---
     These are placeholders so she can see the forest stretching ahead.
     When she picks one, we fill in its `steps` and flip `placeholder` off. */

  { id: 'axolotl-pool', title: 'The Axolotl Pool', icon: '💧', locked: true,
    placeholder: true, guide: { name: 'Axie', emoji: '🦎', sprite: '' } },

  { id: 'lilo-cabin', title: "Lilo's Cabin", icon: '🛖', locked: true,
    placeholder: true, guide: { name: 'Lilo', emoji: '🧸', sprite: '' } },

  { id: 'coraline-tunnel', title: 'The Secret Tunnel', icon: '🚪', locked: true,
    placeholder: true, guide: { name: 'the Other Guide', emoji: '🔮', sprite: '' } },

  { id: 'squishy-glade', title: 'The Squishy Glade', icon: '🎨', locked: true,
    placeholder: true, guide: { name: 'Squish', emoji: '🫧', sprite: '' } },
];
