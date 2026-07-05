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

  // finger geometry (viewBox 0 0 200 240) — index..pinky left to right
  const F = [
    { cls: 'f-index',  x: 50,  y: 52, w: 25, h: 95 },
    { cls: 'f-middle', x: 79,  y: 34, w: 25, h: 113 },
    { cls: 'f-ring',   x: 108, y: 48, w: 25, h: 99 },
    { cls: 'f-pinky',  x: 137, y: 72, w: 21, h: 75 },
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
      const nail = `<ellipse class="nail" cx="${cx}" cy="${f.y + f.w * 0.62}" rx="${f.w * 0.3}" ry="${f.w * 0.36}"
        fill="${polish || NAIL}"/>` +
        (polish ? `<circle cx="${cx - f.w * 0.14}" cy="${f.y + f.w * 0.48}" r="1.8" fill="rgba(255,255,255,.85)"/>` : '');
      const band = ringOn === f.cls
        ? `<rect x="${f.x - 1.5}" y="${f.y + f.h * 0.56}" width="${f.w + 3}" height="9" rx="4.5" fill="#ffd23f"/>
           <circle cx="${cx}" cy="${f.y + f.h * 0.56}" r="4" fill="#ff6b9d"/>
           <circle cx="${cx - 1.3}" cy="${f.y + f.h * 0.56 - 1.3}" r="1.1" fill="rgba(255,255,255,.9)"/>`
        : '';
      return `<g class="finger ${f.cls}">
        <rect class="skin" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="${f.w / 2}"/>
        ${nail}${band}</g>`;
    }).join('');

    const thumb = `<g class="finger thumb">
      <rect class="skin" x="34" y="112" width="24" height="72" rx="12" transform="rotate(-32 46 184)"/>
    </g>`;

    // knuckle dimples — three tiny arcs along the top of the palm
    const dimples = [76, 104, 132].map(x =>
      `<path d="M${x - 6} 141 q6 -5 12 0" stroke="${shade(SKIN, -28)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    ).join('');

    let deco = '';
    if (pattern === 'stripes') deco = [208, 220, 232].map(y =>
      `<rect x="56" y="${y}" width="92" height="5" rx="2.5" fill="${cuffLite}"/>`).join('');
    else if (pattern === 'dots') deco = [66, 88, 110, 132].map((x, i) =>
      `<circle cx="${x}" cy="${i % 2 ? 226 : 214}" r="4.5" fill="${cuffLite}"/>`).join('');
    else if (pattern === 'wave') deco =
      `<path d="M58 216 q11 -8 23 0 t23 0 t23 0 t20 0" stroke="${cuffLite}" stroke-width="4" fill="none" stroke-linecap="round"/>
       <path d="M58 228 q11 -8 23 0 t23 0 t23 0 t20 0" stroke="${cuffLite}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

    const beads = bracelet
      ? Array.from({ length: 8 }, (_, i) =>
        `<circle cx="${56 + i * 13}" cy="200" r="5" fill="${BEADS[i % BEADS.length]}"/>`).join('')
      : '';

    el.innerHTML = `<svg class="svghand" viewBox="0 0 200 244" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      ${thumb}${fingers}
      <rect class="skin" x="46" y="128" width="112" height="82" rx="26"/>
      ${dimples}
      <g class="cuff">
        <rect x="52" y="202" width="100" height="42" rx="14" fill="${cuff}"/>
        <rect x="52" y="202" width="100" height="10" rx="5" fill="${shade(cuff, -25)}"/>
        ${deco}
      </g>
      ${beads}
    </svg>`;
  };
})();
