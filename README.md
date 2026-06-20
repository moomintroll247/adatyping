# The Typing Forest 🌲

A bespoke, no-pressure typing tutor for Ada (8). A Memory-Palace-style walk-through:
explore the forest, unlock one station at a time, learn to touch type. Built to grow
*with* her — her shifting interests are the content.

## Design rules (the whole point — don't break these)
- **No speed, no timer, no WPM.** Completion + accuracy only.
- **Wrong key = gentle nudge**, never a penalty or red error-spam.
- **Success = an explosion of colour.**
- Stations unlock one at a time; only the first is open to start.

## Run it
- **Quick test:** double-click `index.html` (works in any browser).
- **Proper PWA test (installable/offline)** once we deploy: serve it —
  `cd ~/AdaTyping && python3 -m http.server 8000` → open `http://localhost:8000`.

Progress saves automatically in the browser (localStorage).

## Add a new place (build-as-we-go)
Everything lives in **`stations.js`** — see the comments at the top. To add, say, a
proper Axolotl Pool lesson: find its block, set `locked: true` stays, remove
`placeholder: true`, and add `steps`:
```js
steps: [
  { prompt: "Axie says: tap the home row! f and j have little bumps.",
    target: 'fj', display: 'f j' },
]
```
Order in the list = unlock order. No other file changes needed.

## Swap in Ada's own art
Drop an image into `assets/` (e.g. a cut-out photo of her axolotl stuffy → `assets/axie.png`)
and set the station's `guide.sprite` to `"assets/axie.png"`. Until then a friendly emoji
stands in. Backgrounds/themes per station come next.

## Status
MVP: the forest hub, locked gates, and **Station 1 — type your name** (`a d a` →
`A D A` → `A d a`) with the colour explosion. Everything else is a locked placeholder
waiting to be built with Ada.
