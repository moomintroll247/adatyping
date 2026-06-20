/* ============================================================================
   The Typing Forest — engine.
   Design rules (do not break):
     • NO speed, NO timer, NO WPM. Completion + accuracy only.
     • Wrong key = gentle nudge, never a penalty or red spam.
     • Success = an explosion of colour.
   ============================================================================ */

const SAVE_KEY = 'typing-forest:v1';

/* ---- progress (localStorage) ---- */
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || { done: [] }; }
  catch { return { done: [] }; }
}
function saveProgress(p) { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }

/* A station is unlocked if its own flag says so, OR the station before it is done. */
function isUnlocked(i, progress) {
  if (!STATIONS[i].locked) return true;
  const prev = STATIONS[i - 1];
  return prev && progress.done.includes(prev.id);
}

/* ---- views ---- */
const hub = document.getElementById('hub');
const lesson = document.getElementById('lesson');
function show(view) {
  hub.classList.add('hidden'); lesson.classList.add('hidden');
  view.classList.remove('hidden');
}

/* ---- HUB ---- */
function renderHub() {
  const progress = loadProgress();
  const map = document.getElementById('map');
  map.innerHTML = '';
  STATIONS.forEach((st, i) => {
    const unlocked = isUnlocked(i, progress);
    const done = progress.done.includes(st.id);
    const node = document.createElement('button');
    node.className = 'node' + (unlocked ? ' open' : ' locked') + (done ? ' done' : '');
    node.disabled = !unlocked;
    node.innerHTML =
      `<span class="node-icon">${unlocked ? st.icon : '🔒'}</span>` +
      `<span class="node-title">${st.title}</span>` +
      (done ? '<span class="tick">✓</span>' : '');
    if (unlocked) node.onclick = () => startStation(i);
    map.appendChild(node);
  });
  show(hub);
}

/* ---- guide speech ---- */
function setGuide(st, text) {
  const sprite = document.getElementById('guideSprite');
  const speech = document.getElementById('speech');
  if (st.guide.sprite) { sprite.src = st.guide.sprite; sprite.style.display = 'block'; sprite.alt = st.guide.name; }
  else { sprite.removeAttribute('src'); sprite.style.display = 'none'; }
  // emoji fallback shown in the speech header
  speech.innerHTML = `<span class="guide-emoji">${st.guide.emoji || ''}</span>${text}`;
}

/* ---- start a station ---- */
function startStation(i) {
  const st = STATIONS[i];
  document.getElementById('cheer').textContent = '';
  if (st.placeholder) {
    setGuide(st, `This place isn't built yet — you and Dad get to make it! What should be here?`);
    document.getElementById('tiles').innerHTML = '';
    show(lesson);
    return;
  }
  runLesson(st, 0);
  show(lesson);
}

/* ---- the typing lesson ---- */
let active = null;   // { st, step, target, idx }

function runLesson(st, stepIndex) {
  const step = st.steps[stepIndex];
  setGuide(st, step.prompt);
  document.getElementById('cheer').textContent = '';
  active = { st, stepIndex, target: step.target, idx: 0 };
  renderTiles(step.display, step.target, 0);
}

/* Draw the letter tiles. `display` is the pretty version, `target` what's typed.
   We map display chars to target chars, skipping spaces in display. */
function renderTiles(display, target, idx) {
  const tiles = document.getElementById('tiles');
  tiles.innerHTML = '';
  let t = 0; // index into target
  for (const ch of display) {
    if (ch === ' ') { tiles.appendChild(spacer()); continue; }
    const tile = document.createElement('div');
    const state = t < idx ? 'hit' : (t === idx ? 'now' : 'todo');
    tile.className = 'tile ' + state;
    tile.textContent = ch;
    tiles.appendChild(tile);
    t++;
  }
}
function spacer() { const s = document.createElement('div'); s.className = 'tile-gap'; return s; }

/* keystrokes */
document.addEventListener('keydown', (e) => {
  if (!active || lesson.classList.contains('hidden')) return;
  if (e.key.length !== 1) return;            // ignore Shift, arrows, etc. (no penalty)
  const expected = active.target[active.idx];
  if (e.key === expected) {
    active.idx++;
    const step = active.st.steps[active.stepIndex];
    renderTiles(step.display, step.target, active.idx);
    pop();
    if (active.idx >= active.target.length) stepComplete();
  } else {
    nudge();                                  // gentle: shake the current tile, no penalty
  }
});

function stepComplete() {
  const { st, stepIndex } = active;
  burst(0.6);                                 // little colour pop between steps
  if (stepIndex + 1 < st.steps.length) {
    document.getElementById('cheer').textContent = pickCheer();
    setTimeout(() => runLesson(st, stepIndex + 1), 1100);
  } else {
    finishStation(st);
  }
}

function finishStation(st) {
  const p = loadProgress();
  if (!p.done.includes(st.id)) { p.done.push(st.id); saveProgress(p); }
  setGuide(st, st.reward);
  document.getElementById('tiles').innerHTML = '';
  document.getElementById('cheer').textContent = '⭐️ ⭐️ ⭐️';
  bigExplosion();                             // THE explosion of colour
  active = null;
  setTimeout(renderHub, 4200);               // back to forest, new gate now open
}

/* ---- encouragement (never pressure) ---- */
const CHEERS = ['Yes!', 'Brilliant!', 'You did it!', 'Amazing, Ada!', 'Wow!', 'Perfect!'];
function pickCheer() { return CHEERS[Math.floor(Math.random() * CHEERS.length)]; }

/* gentle wrong-key feedback */
function nudge() {
  const now = document.querySelector('.tile.now');
  if (!now) return;
  now.classList.remove('shake'); void now.offsetWidth; now.classList.add('shake');
}
/* correct-key pop */
function pop() {
  const hit = [...document.querySelectorAll('.tile.hit')].pop();
  if (hit) { hit.classList.remove('pop'); void hit.offsetWidth; hit.classList.add('pop'); }
}

/* ---- confetti / colour explosion (canvas, no libraries) ---- */
const cv = document.getElementById('confetti');
const cx = cv.getContext('2d');
function fit() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', fit); fit();
let parts = [];
const COLOURS = ['#ff4d6d','#ffd23f','#3bceac','#3a86ff','#b15dff','#ff924c','#06d6a0','#ef476f'];
function spawn(n, power) {
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2, y: innerHeight * 0.45,
      vx: (Math.cos(i) + (i % 7) / 7 - 0.5) * 9 * power,
      vy: (-Math.random() * 11 - 4) * power,
      g: 0.32, r: 4 + Math.random() * 7,
      c: COLOURS[i % COLOURS.length], life: 90 + Math.random() * 40, t: 0,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    });
  }
  if (!raf) loop();
}
function burst(power = 1) { spawn(Math.round(70 * power), power); }
function bigExplosion() {
  burst(1); setTimeout(() => burst(1.2), 250); setTimeout(() => burst(1.4), 550);
}
let raf = null;
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => {
    p.t++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
    cx.fillStyle = p.c; cx.globalAlpha = Math.max(0, 1 - p.t / p.life);
    cx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); cx.restore();
  });
  parts = parts.filter(p => p.t < p.life && p.y < cv.height + 40);
  raf = parts.length ? requestAnimationFrame(loop) : null;
}

/* ---- wiring ---- */
document.getElementById('backBtn').onclick = () => { active = null; renderHub(); };
renderHub();
