/* Ada's Typing Forest — engine. TEXTLESS by design.
   Rules: no words on screen ever; no speed/timer; wrong key = gentle wobble,
   never a penalty; each letter is a jiggling creature that slots into place;
   finishing = an explosion of colour. */

const stage   = document.getElementById('stage');
const socketsEl = document.getElementById('sockets');
const activeLayer = document.getElementById('active-layer');

const LETTERS = LESSONS[CURRENT_LESSON].letters;   // e.g. ['a','d','a']
let idx = 0;          // which letter we're on
let active = null;    // the current jiggling element
let busy = false;     // true while a letter is animating into its socket

/* ---------- living background ---------- */
(function bubbles() {
  const bg = document.getElementById('bg');
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 6 + Math.random() * 16;          // vmin
    b.style.width = b.style.height = size + 'vmin';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.setProperty('--drift', (Math.random() * 20 - 10) + 'vw');
    b.style.animationDuration = (14 + Math.random() * 14) + 's';
    b.style.animationDelay = (-Math.random() * 20) + 's';
    bg.appendChild(b);
  }
})();

/* ---------- build the empty sockets ---------- */
function buildSockets() {
  socketsEl.className = '';
  socketsEl.innerHTML = '';
  LETTERS.forEach(() => {
    const s = document.createElement('div');
    s.className = 'socket';
    socketsEl.appendChild(s);
  });
}

/* ---------- spawn the active jiggling letter ---------- */
function spawn() {
  const letter = LETTERS[idx];
  active = document.createElement('div');
  active.className = 'active';
  active.innerHTML =
    `<div class="glyph">${letter}` +
    `<span class="eye eye-l"></span><span class="eye eye-r"></span></div>`;
  activeLayer.appendChild(active);

  // enter from alternating sides (a from left, d from right, a from left…)
  const fromLeft = idx % 2 === 0;
  active.style.transition = 'none';
  active.style.transform = `translateX(${fromLeft ? -140 : 140}vw)`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    active.style.transition = '';
    active.style.transform = '';   // glide to centre; jiggle (on .glyph) runs
  }));
}

/* ---------- correct key: slot the letter into its socket ---------- */
function slot() {
  busy = true;
  const socket = socketsEl.children[idx];
  const glyph = active.querySelector('.glyph');
  glyph.style.animation = 'none';                 // stop jiggle so it settles

  const a = active.getBoundingClientRect();
  const s = socket.getBoundingClientRect();
  const dx = (s.left + s.width / 2) - (a.left + a.width / 2);
  const dy = (s.top + s.height / 2) - (a.top + a.height / 2);
  const scale = s.width / a.width;
  active.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

  const done = () => {
    active.removeEventListener('transitionend', done);
    active.remove(); active = null;
    socket.innerHTML = `<span class="filled">${LETTERS[idx]}</span>`;
    sparkle(s.left + s.width / 2, s.top + s.height / 2);   // little pop
    idx++;
    busy = false;
    if (idx < LETTERS.length) spawn();
    else finish();
  };
  active.addEventListener('transitionend', done);
}

/* ---------- finished the whole name ---------- */
function finish() {
  socketsEl.className = 'celebrate';
  bigExplosion();
  setTimeout(reset, 4500);     // loop so she can do it again (no pressure, just play)
}
function reset() { idx = 0; buildSockets(); spawn(); }

/* ---------- keys ---------- */
addEventListener('keydown', (e) => {
  if (busy || !active || e.key.length !== 1) return;
  if (e.key.toLowerCase() === LETTERS[idx]) {
    slot();
  } else {
    active.classList.remove('nope'); void active.offsetWidth; active.classList.add('nope');
  }
});

/* ---------- confetti / colour explosion (canvas, no libraries) ---------- */
const cv = document.getElementById('confetti'), cx = cv.getContext('2d');
function fit() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener('resize', fit); fit();
let parts = [], raf = null;
const COLOURS = ['#2dd4bf','#14b8a6','#5eead4','#ffd23f','#ff6b9d','#a78bfa','#ff924c','#fde68a'];
function add(n, x, y, power) {
  for (let i = 0; i < n; i++) parts.push({
    x, y,
    vx: (Math.random() - .5) * 18 * power,
    vy: (-Math.random() * 13 - 4) * power,
    g: .35, r: 5 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
    c: COLOURS[(Math.random() * COLOURS.length) | 0], t: 0, life: 90 + Math.random() * 50,
  });
  if (!raf) loop();
}
function sparkle(x, y) { add(18, x, y, .6); }
function bigExplosion() {
  const cxp = innerWidth / 2, cyp = innerHeight * 0.4;
  add(90, cxp, cyp, 1); setTimeout(() => add(90, cxp, cyp, 1.3), 250); setTimeout(() => add(110, cxp, cyp, 1.5), 550);
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => {
    p.t++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
    cx.globalAlpha = Math.max(0, 1 - p.t / p.life); cx.fillStyle = p.c;
    cx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); cx.restore();
  });
  parts = parts.filter(p => p.t < p.life && p.y < cv.height + 50);
  raf = parts.length ? requestAnimationFrame(loop) : null;
}

/* ---------- go ---------- */
buildSockets();
spawn();
