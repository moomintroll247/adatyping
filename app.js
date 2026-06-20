/* Ada's Typing Forest — engine. TEXTLESS by design.
   Rules: no words on screen ever; no speed/timer; wrong key = gentle wobble,
   never a penalty; each letter is a jiggling creature that slots into place;
   per-letter seal "ark"; finishing = colour explosion + the seal riot. */

const socketsEl   = document.getElementById('sockets');
const activeLayer  = document.getElementById('active-layer');
const shiftKey     = document.getElementById('shiftkey');

const STAGES = LESSON.stages;     // [['a','d','a'],['A','D','A'],['A','d','a']]
let stage = 0, idx = 0, active = null, busy = false;

const cur     = () => STAGES[stage];
const isUpper = c => c !== c.toLowerCase();
const hasCaps = arr => arr.some(isUpper);

/* ---------- living background ---------- */
(function bubbles() {
  const bg = document.getElementById('bg');
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 6 + Math.random() * 16;
    b.style.width = b.style.height = size + 'vmin';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.setProperty('--drift', (Math.random() * 20 - 10) + 'vw');
    b.style.animationDuration = (14 + Math.random() * 14) + 's';
    b.style.animationDelay = (-Math.random() * 20) + 's';
    bg.appendChild(b);
  }
})();

/* ---------- show/hide the Shift key for the current stage ---------- */
function updateShift() {
  if (hasCaps(cur())) shiftKey.classList.remove('hidden');
  else shiftKey.classList.add('hidden');
}

/* ---------- build the empty sockets for the current stage ---------- */
function buildSockets() {
  socketsEl.className = '';
  socketsEl.innerHTML = '';
  cur().forEach(() => {
    const s = document.createElement('div');
    s.className = 'socket';
    socketsEl.appendChild(s);
  });
}

/* ---------- spawn the active jiggling letter ---------- */
function spawn() {
  const letter = cur()[idx];
  active = document.createElement('div');
  active.className = 'active';
  active.innerHTML =
    `<div class="glyph">${letter}` +
    `<span class="eye eye-l"></span><span class="eye eye-r"></span></div>`;
  activeLayer.appendChild(active);
  const fromLeft = idx % 2 === 0;
  active.style.transition = 'none';
  active.style.transform = `translateX(${fromLeft ? -140 : 140}vw)`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    active.style.transition = '';
    active.style.transform = '';
  }));
}

/* ---------- correct key: slot into its socket ---------- */
function slot() {
  busy = true;
  arkSound();
  const socket = socketsEl.children[idx];
  const glyph = active.querySelector('.glyph');
  glyph.style.animation = 'none';
  const a = active.getBoundingClientRect(), s = socket.getBoundingClientRect();
  const dx = (s.left + s.width / 2) - (a.left + a.width / 2);
  const dy = (s.top + s.height / 2) - (a.top + a.height / 2);
  active.style.transform = `translate(${dx}px, ${dy}px) scale(${s.width / a.width})`;
  const letter = cur()[idx];
  const done = () => {
    active.removeEventListener('transitionend', done);
    active.remove(); active = null;
    socket.innerHTML = `<span class="filled">${letter}</span>`;
    sparkle(s.left + s.width / 2, s.top + s.height / 2);
    idx++;
    busy = false;
    if (idx < cur().length) spawn();
    else stageDone();
  };
  active.addEventListener('transitionend', done);
}

/* ---------- finished a stage ---------- */
function stageDone() {
  socketsEl.className = 'celebrate';
  if (stage < STAGES.length - 1) {
    // quick win, then on to the next stage (short, to keep momentum)
    add(50, innerWidth / 2, innerHeight * 0.4, 1);
    setTimeout(() => { stage++; idx = 0; updateShift(); buildSockets(); spawn(); }, 1700);
  } else {
    finishAll();
  }
}

/* ---------- finished the whole name (all three stages) ---------- */
function finishAll() {
  bigExplosion();
  arkTriple();     // the full ark-ark-ark riot
  swimSeal();      // 🦭 swims across
  setTimeout(() => { stage = 0; idx = 0; updateShift(); buildSockets(); spawn(); }, 5000);
}

/* ---------- keys ---------- */
addEventListener('keydown', (e) => {
  // live Shift feedback (glows the on-screen key)
  if (e.key === 'Shift') { shiftKey.classList.add('pressed'); return; }
  if (busy || !active || e.key.length !== 1) return;
  const want = cur()[idx];
  if (e.key === want) {
    slot();
  } else {
    active.classList.remove('nope'); void active.offsetWidth; active.classList.add('nope');
    // pressed the right letter but lower-case when a capital is needed → hint Shift
    if (isUpper(want) && e.key.toLowerCase() === want.toLowerCase()) {
      shiftKey.classList.remove('hint'); void shiftKey.offsetWidth; shiftKey.classList.add('hint');
    }
  }
});
addEventListener('keyup', (e) => { if (e.key === 'Shift') shiftKey.classList.remove('pressed'); });

/* ---------- seal bark (Web Audio synth fallback) ---------- */
let actx = null;
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function bark(detune = 0) {
  const ac = audio(), t = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(430 + detune, t);
  o.frequency.exponentialRampToValueAtTime(150 + detune, t + 0.16);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  const o2 = ac.createOscillator(), g2 = ac.createGain();
  o2.type = 'square';
  o2.frequency.setValueAtTime(200 + detune, t);
  o2.frequency.exponentialRampToValueAtTime(85 + detune, t + 0.16);
  g2.gain.setValueAtTime(0.0001, t);
  g2.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  o.connect(g).connect(ac.destination); o2.connect(g2).connect(ac.destination);
  o.start(t); o2.start(t); o.stop(t + 0.25); o2.stop(t + 0.25);
}
function tripleBark() { bark(0); setTimeout(() => bark(50), 200); setTimeout(() => bark(-40), 410); }

/* real recordings if present: assets/seal.mp3 (single) + assets/seal_cheer.mp3 (full) */
let sealAudio = null, useRealSeal = false, cheerAudio = null;
(function loadSeal() {
  const cands = ['assets/seal.mp3', 'assets/seal.ogg', 'assets/seal.wav', 'assets/seal.m4a'];
  let i = 0;
  (function tryNext() {
    if (i >= cands.length) return;
    const a = new Audio(); a.preload = 'auto'; a.src = cands[i];
    a.addEventListener('canplaythrough', () => { sealAudio = a; useRealSeal = true; }, { once: true });
    a.addEventListener('error', () => { i++; tryNext(); }, { once: true });
  })();
})();
(function loadCheer() {
  const a = new Audio(); a.preload = 'auto'; a.src = 'assets/seal_cheer.mp3';
  a.addEventListener('canplaythrough', () => { cheerAudio = a; }, { once: true });
})();
function arkSound() {
  if (useRealSeal && sealAudio) { const a = sealAudio.cloneNode(); a.play().catch(() => {}); }
  else bark();
}
function arkTriple() {
  if (cheerAudio) { const a = cheerAudio.cloneNode(); a.play().catch(() => {}); return; }
  if (useRealSeal && sealAudio) { [0, 200, 410].forEach(d => setTimeout(() => { const a = sealAudio.cloneNode(); a.play().catch(() => {}); }, d)); return; }
  tripleBark();
}

/* ---------- the swimming seal ---------- */
function swimSeal() {
  const seal = document.createElement('div');
  seal.className = 'seal'; seal.textContent = '🦭';
  document.body.appendChild(seal);
  setTimeout(() => seal.remove(), 3400);
}

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
updateShift();
buildSockets();
spawn();
