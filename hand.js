/* ============================================================================
   THE HAND — one shared, properly-drawn SVG hand for every station.

   buildHand(el, { cuff: '#7c3aed' })  — renders a flat-illustration style hand
   (back of hand, fingers up, sleeve cuff in the station's colour) into el.

   Keeps the exact skeleton the stations already use:
     .finger.f-index / .f-middle / .f-ring / .f-pinky / .thumb
     .active  = glowing gold "press with THIS finger" cue
     .tap     = quick press dip
   so station game code needs no changes.

   Every visit the hand dresses up a little differently: sometimes nail polish,
   sometimes a ring, sometimes a beaded bracelet, different cuff patterns.
   ============================================================================ */
(function () {
  const SKIN = '#f6c79a', SKIN2 = '#f0bd8f', NAIL = '#f8d5ae';
  const POLISH = ['#ff6b9d', '#a78bfa', '#2dd4bf', '#ff924c', '#f43f5e', '#ffd23f'];
  const BEADS  = ['#ff6b9d', '#ffd23f', '#2dd4bf', '#a78bfa', '#ff924c'];

  // finger geometry (viewBox 0 0 200 300) — slim, gently fanned; ang = splay,
  // (bx,by) = knuckle pivot the splay rotates around
  const F = [
    { cls: 'f-index',  x: 67,    y: 74, w: 16,   h: 94,  ang: -4, bx: 75,  by: 158 },
    { cls: 'f-middle', x: 88,    y: 60, w: 16.5, h: 108, ang: -1, bx: 96,  by: 158 },
    { cls: 'f-ring',   x: 109.5, y: 70, w: 15.5, h: 98,  ang: 3,  bx: 117, by: 158 },
    { cls: 'f-pinky',  x: 130,   y: 90, w: 13.5, h: 84,  ang: 8,  bx: 137, by: 158 },
  ];

  let cssDone = false;
  function injectCSS() {
    if (cssDone) return; cssDone = true;
    const s = document.createElement('style');
    s.textContent = `
      .svghand { display:block; width:100%; height:100%; overflow:visible; }
      .svghand .skin { fill:${SKIN}; }
      .svghand .thumb .skin { fill:${SKIN2}; }
      .svghand .finger { transition: transform .1s; }
      .svghand .finger.thumb { transform: none; animation: none; }  /* legacy div-hand CSS rotates .thumb — undo */
      .svghand .finger.active .skin { fill:#ffd23f; }
      .svghand .finger.active .nail { fill:#ffe89a; }
      .svghand .finger.active {
        filter: drop-shadow(0 0 6px rgba(255,210,63,.95)) drop-shadow(0 0 16px rgba(255,210,63,.55));
        animation: svgwig 1.4s ease-in-out infinite;
      }
      .svghand .finger.tap { animation: svgtap .12s ease-out; }
      @keyframes svgwig { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      @keyframes svgtap { 0%,100%{transform:translateY(0)} 50%{transform:translateY(11px)} }
    `;
    document.head.appendChild(s);
  }

  function shade(hex, amt) {           // lighten (+) / darken (-) a #rrggbb
    const n = parseInt(hex.slice(1), 16);
    const c = v => Math.max(0, Math.min(255, v + amt));
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => c(v).toString(16).padStart(2, '0')).join('');
  }
  const pick = a => a[(Math.random() * a.length) | 0];

  window.buildHand = function (el, opts = {}) {
    injectCSS();
    const cuff = opts.cuff || '#7c3aed';
    const cuffLite = 'rgba(255,255,255,.35)';
    // today's outfit
    const polish   = Math.random() < 0.45 ? pick(POLISH) : null;
    const ringOn   = Math.random() < 0.35 ? pick(['f-index', 'f-middle', 'f-ring']) : null;
    const bracelet = Math.random() < 0.40;
    const pattern  = pick(['plain', 'stripes', 'dots', 'wave']);

    const fingers = F.map(f => {
      const cx = f.x + f.w / 2;
      const nail = `<ellipse class="nail" cx="${cx}" cy="${f.y + f.w * 0.6}" rx="${f.w * 0.28}" ry="${f.w * 0.34}"
        fill="${polish || NAIL}"/>` +
        (polish ? `<circle cx="${cx - f.w * 0.13}" cy="${f.y + f.w * 0.46}" r="1.4" fill="rgba(255,255,255,.85)"/>` : '');
      const band = ringOn === f.cls
        ? `<rect x="${f.x - 1.2}" y="${f.y + f.h * 0.52}" width="${f.w + 2.4}" height="7" rx="3.5" fill="#ffd23f"/>
           <circle cx="${cx}" cy="${f.y + f.h * 0.52}" r="3.2" fill="#ff6b9d"/>
           <circle cx="${cx - 1}" cy="${f.y + f.h * 0.52 - 1}" r="0.9" fill="rgba(255,255,255,.9)"/>`
        : '';
      // outer g owns the splay (attribute transform); inner g takes the CSS glow/tap
      return `<g transform="rotate(${f.ang} ${f.bx} ${f.by})"><g class="finger ${f.cls}">
        <rect class="skin" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.w / 2}"/>
        ${nail}${band}</g></g>`;
    }).join('');

    // thumb is rooted INSIDE the palm (pivot 86,206 — mid-palm) and emerges through
    // the left silhouette, so it always reads as attached
    const thumb = `<g transform="rotate(-40 86 206)"><g class="finger thumb">
      <rect class="skin" x="77.5" y="132" width="17" height="80" rx="8.5"/>
    </g></g>`;

    // palm: wide at the knuckles, tapering gracefully into the wrist
    const palm = `<path class="skin" d="M66 152 Q56 196 72 216 L72 240 L128 240 L128 216 Q146 196 144 152 Q100 141 66 152 Z"/>`;

    let deco = '';
    if (pattern === 'stripes') deco = [252, 264, 276].map(y =>
      `<rect x="72" y="${y}" width="56" height="4" rx="2" fill="${cuffLite}"/>`).join('');
    else if (pattern === 'dots') deco = [80, 100, 120].map((x, i) =>
      `<circle cx="${x}" cy="${i % 2 ? 272 : 258}" r="3.6" fill="${cuffLite}"/>`).join('');
    else if (pattern === 'wave') deco =
      `<path d="M74 256 q8 -6 17 0 t17 0 t18 0" stroke="${cuffLite}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
       <path d="M74 270 q8 -6 17 0 t17 0 t18 0" stroke="${cuffLite}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

    const beads = bracelet
      ? Array.from({ length: 7 }, (_, i) =>
        `<circle cx="${76 + i * 8}" cy="237" r="4" fill="${BEADS[i % BEADS.length]}"/>`).join('')
      : '';

    el.innerHTML = `<svg class="svghand" viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      ${thumb}${fingers}
      ${palm}
      <g class="cuff">
        <rect x="66" y="238" width="68" height="58" rx="12" fill="${cuff}"/>
        <rect x="66" y="238" width="68" height="9" rx="4.5" fill="${shade(cuff, -25)}"/>
        ${deco}
      </g>
      ${beads}
    </svg>`;
  };
})();
