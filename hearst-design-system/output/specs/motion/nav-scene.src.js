// Main navigation (HP-NAV-001 · Rev A) → motion film, ~146 s: how the Hearst+ header is built and how it behaves.
// Pure function of time. Geometry is measured in the running app (2026-11-09, viewports 390–1440);
// build-nav-scene.mjs embeds the two drawing sheets for the closing tour.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEETS = __SHEETS__;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);
const T = (x, y, s, cls, ex) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls || 'kdt'}" ${ex || ''}>${esc(s)}</text>`;
const Rc = (x, y, w, h, cls, ex) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" class="${cls}" ${ex || ''}/>`;
const Ln = (x1, y1, x2, y2, cls, ex) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${ex || ''}/>`;
const op = a => `opacity="${clamp01(a).toFixed(3)}"`;
const G = (a, inner) => a <= 0.001 ? '' : `<g ${op(a)}>${inner}</g>`;
const win = (t, a, b, fi, fo) => Math.min(eo(seg(t, a, a + (fi || .5))), 1 - eo(seg(t, b - (fo || .5), b)));
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };
const rx = r => `rx="${f1(r)}"`;
function DH(x1, x2, y, label, cls) {
  const small = x2 - x1 < 26;
  const s = small
    ? Ln(x1 - 12, y, x1, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x2 + 12, y, x2, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x1, y, x2, y, 'kdl')
    : Ln(x1, y, x2, y, 'kdl', 'marker-start="url(#ka)" marker-end="url(#ka)"');
  return s + Ln(x1, y - 7, x1, y + 7, 'kext') + Ln(x2, y - 7, x2, y + 7, 'kext') + (label ? T((x1 + x2) / 2, y - 10, label, cls || 'kdt', 'text-anchor="middle"') : '');
}
function DV(y1, y2, x, label, side) {
  const small = y2 - y1 < 26;
  const s = small
    ? Ln(x, y1 - 12, x, y1, 'kdl', 'marker-end="url(#ka)"') + Ln(x, y2 + 12, x, y2, 'kdl', 'marker-end="url(#ka)"') + Ln(x, y1, x, y2, 'kdl')
    : Ln(x, y1, x, y2, 'kdl', 'marker-start="url(#ka)" marker-end="url(#ka)"');
  const r = side !== 'l';
  return s + Ln(x - 7, y1, x + 7, y1, 'kext') + Ln(x - 7, y2, x + 7, y2, 'kext') + (label ? T(x + (r ? 12 : -12), (y1 + y2) / 2 + 6, label, 'kdt', `text-anchor="${r ? 'start' : 'end'}"`) : '');
}
const ptr = (x, y, a, down) => G(a, (down ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 + 10 * down)}" class="kring" ${op(1 - down)}/>` : '') +
  `<path d="M${f1(x)},${f1(y)} l0,26 l7,-6 l5,11 l5,-2 l-5,-11 l9,-1 z" fill="#111" stroke="#fff" stroke-width="1.5"/>`);
const key = (x, y, l, a) => G(a, Rc(x, y, 30 + l.length * 13, 40, 'kkey', rx(6)) + T(x + (30 + l.length * 13) / 2, y + 27, l, 'kkt', 'text-anchor="middle"'));
const focusRing = (x, y, w, h, r, a) => G(a, Rc(x - 4, y - 4, w + 8, h + 8, 'kfocus', rx((r || 0) + 4)));

/* ---------- measured geometry (CSS px) ---------- */
const PILL_SM = [31, 64, 48.7, 113.6, 139.9, 82, 79.3, 86.4], PILL_XS = [29.8, 60, 46, 105.5, 129.6, 76.5, 74, 80.5];
const LINKS = [37.3, 58.7, 51.5, 34.8, 111.9, 49.6, 1, 48.3, 79.8, 50.1];
const LOFF = (() => { let x = 0; return LINKS.map(w => { const o = x; x += w + 24; return o; }); })(); // offsets, total 739
const LTOT = 739;
const S1 = vw => vw < 768 ? 16 : vw < 1280 ? 24 : 48;
const bannerH = vw => vw / (vw < 640 ? 5 : 11.54);
const mastH = (vw, v) => v === 'brand' ? 32 + (vw < 640 ? 80 : 96) : 32 + bannerH(vw);
const rowH = vw => vw < 768 ? 41 : 39;

/* ---------- one header, drawn at viewport width vw, scale k, origin (x, y) ----------
   o: { v:'home'|'brand', scroll, compact (0..1), active, fill (bar fill 0..1), rowScroll (phone), hover (pill index), sticky } */
function header(x, y, vw, k, o) {
  o = o || {}; const v = o.v || 'home', s = o.scroll || 0;
  const X = px => x + px * k, Y = py => y + py * k;
  const pad = S1(vw), cl = Math.max(0, (vw - 1360) / 2), inL = cl + pad, inR = cl + Math.min(vw, 1360) - pad;
  const mh = mastH(vw, v), rh = rowH(vw);
  let q = '';
  // masthead (scrolls)
  const my = -s;
  if (v === 'home') {
    q += Rc(X(0), Y(my), vw * k, mh * k, 'kwell') + `<path d="M${f1(X(0))},${f1(Y(my + 32))} L${f1(X(vw))},${f1(Y(my + mh))} M${f1(X(vw))},${f1(Y(my + 32))} L${f1(X(0))},${f1(Y(my + mh))}" class="kph"/>`;
    const lw = vw < 640 ? 160 : Math.min(500, vw * .35), lh = vw < 640 ? 24 : vw < 1024 ? 36 : 48;
    q += Rc(X(vw / 2 - lw / 2), Y(my + (32 + mh) / 2 - lh / 2), lw * k, lh * k, 'kslot') + (lw * k > 120 ? T(X(vw / 2), Y(my + (32 + mh) / 2) + 5, 'LOCKUP', 'ksl', 'text-anchor="middle"') : '');
  } else {
    q += Rc(X(0), Y(my + 32), vw * k, (mh - 32) * k, 'kobj');
    const lw = vw < 640 ? 150 : 280, lh = vw < 640 ? 22 : 34;
    q += Rc(X(vw / 2 - lw / 2), Y(my + 32 + (mh - 32 - lh) / 2), lw * k, lh * k, 'kslot') + T(X(vw / 2), Y(my + 32 + (mh - 32) / 2) + 5, 'BRAND LOGO', 'ksl', 'text-anchor="middle"');
  }
  // controls
  const Z = vw < 640 ? 44 : 28, cy = v === 'home' ? 44 : 32 + (mh - 32 - Z) / 2;
  const ctl = (cx) => Rc(X(cx), Y(my + cy), Z * k, Z * k, 'kctl', rx(4 * k)) + Rc(X(cx + Z / 2 - 7), Y(my + cy + Z / 2 - 7), 14 * k, 14 * k, 'kicon');
  if (vw < 640) q += ctl(inL); else for (let i = 0; i < 4; i++) q += ctl(inL + i * 32);
  q += ctl(inR - Z) + ctl(inR - 2 * Z - 8);
  o.ctl = { menu: [X(inL), Y(my + cy), Z * k], search: [X(inR - Z), Y(my + cy), Z * k] };
  // section row: sticky at 32 below md (destinations), static from md
  const rowTop = vw < 768 ? Math.max(32, mh - s) : mh - s;
  q += sectionRow(X, Y, vw, k, rowTop, rh, o, 1 - (vw >= 768 && o.compact > .5 ? 1 : 0));
  // compact nav (md+)
  if (vw >= 768 && o.compact > 0) q += G(o.compact, sectionRow(X, Y, vw, k, 32 - 8 * (1 - o.compact), 39, o, 1, true));
  // utility bar (sticky top 0)
  q += utilityBar(X, Y, vw, k, o);
  return q;
}
function sectionRow(X, Y, vw, k, top, rh, o, a, compact) {
  if (a <= 0) return '';
  const pad = S1(vw), md = vw >= 768, lh = md ? 22 : 32, ly = top + (md ? 8 : 4);
  let q = Rc(X(0), Y(top), vw * k, rh * k, 'kobj');
  const start = md ? vw / 2 - LTOT / 2 : pad - (o.rowScroll || 0);
  const L = pad, R = vw - pad;
  LINKS.forEach((w, i) => {
    let lx = start + LOFF[i], lw = w;
    if (!md) { if (lx + lw < L || lx > R) return; const a0 = Math.max(lx, L), a1 = Math.min(lx + lw, R); lx = a0; lw = a1 - a0; }
    if (w <= 1) { q += Ln(X(lx), Y(ly + lh / 2 - 8), X(lx), Y(ly + lh / 2 + 8), 'kthin'); return; }
    q += Rc(X(lx), Y(ly), lw * k, lh * k, 'kslot');
    if (i === (o.active ?? 0)) q += Rc(X(lx), Y(ly + lh) - 2 * k, lw * k, 2 * k, 'kfill');
  });
  if (!md) {
    const sl = o.rowScroll || 0, max = LTOT - (vw - 2 * pad);
    if (sl > 1) q += Rc(X(pad), Y(top + 8), 24 * k, 24 * k, '', 'fill="url(#khat)"');
    if (sl < max - 1) q += Rc(X(vw - pad - 24), Y(top + 8), 24 * k, 24 * k, '', 'fill="url(#khat)"');
  }
  return G(a, q);
}
function utilityBar(X, Y, vw, k, o) {
  const pad = S1(vw), cl = Math.max(0, (vw - 1360) / 2), inL = cl + pad, inR = cl + Math.min(vw, 1360) - pad;
  const gap = vw < 640 ? 8 : 12, wW = vw < 1024 ? 72 : 192, aW = vw < 640 ? 93 : 116.4, xs = vw < 640;
  const fill = o.fill ?? 1;
  let q = Rc(X(0), Y(0), vw * k, 32 * k, 'kbar', op(fill)) + Rc(X(0), Y(0), vw * k, 32 * k, 'kthin');
  q += Rc(X(inL), Y(3.7), wW * k, 24.5 * k, 'kslot') + (wW * k > 70 ? T(X(inL + wW / 2), Y(16) + 4, 'WEATHER', 'ksl', 'text-anchor="middle"') : '');
  const lw = xs ? PILL_XS : PILL_SM, content = lw.reduce((a, b) => a + b, 0) + 2 + 4 * 6 + 9;
  const avail = inR - inL - wW - aW - 2 * gap, pw = Math.min(content, avail);
  const px = vw >= 1280 ? vw / 2 - pw / 2 : inL + wW + gap + (avail - pw) / 2;
  const ph = xs ? 32 : 28, py = xs ? 0 : 2, lh = xs ? 28 : 24;
  q += Rc(X(px), Y(py), pw * k, ph * k, 'kpill', rx(ph / 2 * k));
  let cx = px - (o.pillScroll || 0); const pos = [];
  lw.forEach((w, i) => {
    if (i === 5) cx += 4;
    const lx = i === 0 ? px : cx;
    pos.push([lx, w]);
    if (i === 5 && lx - 6 > px + 31 && lx - 6 < px + pw) q += Ln(X(lx - 6), Y(py + ph / 2 - 8), X(lx - 6), Y(py + ph / 2 + 8), 'kthin');
    const a0 = Math.max(lx, i ? px + 31 : px), a1 = Math.min(lx + w, px + pw);
    if (a1 > a0) q += Rc(X(a0), Y(py + (ph - lh) / 2), (a1 - a0) * k, lh * k, i === 0 ? 'khug' : i === o.hover ? 'khov' : 'kslot', rx(lh / 2 * k));
    cx = (i === 0 ? px + 31 + 2 : lx + w + 4);
  });
  o.pill = { x: X(px), w: pw * k, pos: pos.map(([a, w]) => [X(a), w * k]), y: Y(py), h: ph * k };
  q += Rc(X(inR - aW), Y(xs ? 2 : 4), aW * k, (xs ? 28 : 24) * k, 'khug', rx(4 * k)) + (aW * k > 90 ? T(X(inR - aW / 2), Y(16) + 4, 'ACCOUNT', 'ksl', 'text-anchor="middle"') : '');
  return q;
}
/* page body below the header (river + rails), scrolled by s */
function body(X, Y, vw, k, top, s, vh) {
  const pad = S1(vw), cl = Math.max(0, (vw - 1360) / 2), inL = cl + pad, inR = cl + Math.min(vw, 1360) - pad, W = inR - inL;
  let q = ''; const y0 = top - s + 24;
  const cols = vw >= 1024 ? [[0, Math.min(300, Math.max(240, W * .2))], null, [W - 300, 300]] : vw >= 768 ? [null, [W - 300, 300]] : [];
  let rx0 = 0, rw = W;
  if (vw >= 1024) { rx0 = cols[0][1] + 24; rw = W - rx0 - 300 - 24; q += Rc(X(inL), Y(y0), cols[0][1] * k, 520 * k, 'kslot') + Rc(X(inL + W - 300), Y(y0), 300 * k, 250 * k, 'kslot'); }
  else if (vw >= 768) { rw = W - 300 - 24; q += Rc(X(inL + W - 300), Y(y0), 300 * k, 250 * k, 'kslot'); }
  for (let i = 0; i < 8; i++) { const cy = y0 + i * (rw * .56 + 160 + 16); if (cy - s > vh + 200) break; q += Rc(X(inL + rx0), Y(cy), rw * k, (rw * .56 + 160) * k, 'kcard', rx(8 * k)) + Rc(X(inL + rx0), Y(cy), rw * k, rw * .56 * k, 'kwell', rx(8 * k)); }
  return q;
}
/* viewport frame with clipped page */
let CLIP = 0;
function viewport(x, y, vw, vh, k, o) {
  const id = 'kc' + (CLIP++);
  const X = px => x + px * k, Y = py => y + py * k;
  const s = o.scroll || 0, mh = mastH(vw, o.v || 'home');
  const inner = body(X, Y, vw, k, mh + rowH(vw), s, vh) + header(x, y, vw, k, o) + (o.over ? o.over(X, Y) : '');
  return `<clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(vw * k)}" height="${f1(vh * k)}"/></clipPath><g clip-path="url(#${id})">${inner}</g>` + Rc(x, y, vw * k, vh * k, 'kframe2');
}
/* compact-nav hysteresis as a pure function of time: simulate from 0 */
function compactState(sFn, t) {
  let on = false, since = -9; const dt = 1 / 30;
  for (let u = 0; u <= t + 1e-6; u += dt) { const y = sFn(u); if (!on && y >= 96) { on = true; since = u; } else if (on && y <= 64) { on = false; since = u; } }
  const p = clamp01((t - since) / .25), e = 1 - Math.pow(1 - p, 3);
  return { on, p: on ? e : 1 - e };
}

/* ---------- chapters ---------- */
const CH = [0, 10, 22, 36, 48, 62, 78, 90, 104, 116, 126, 134, 146];
const END = CH[CH.length - 1];
const CAPS = [
  [0, 'THE HEADER', 'Three bands, top to bottom: utility bar, masthead, section row.'],
  [5, 'THE HEADER', 'Only the utility bar stays on screen. The rest scrolls, then hands over to a compact copy.'],
  [10, 'UTILITY BAR · H1 32', 'Weather, the destination pill and the account button, inside the page container.'],
  [16, 'UTILITY BAR · PHONE', 'Below 640 the pill takes the remaining width and scrolls sideways inside itself.'],
  [22, 'MEGA MENU', 'Pointing at a destination, or tabbing to it, opens its brand menu 8 px below the bar.'],
  [27, 'MEGA MENU · PLACEMENT', 'Width = min(Wmax, bar − 24). Left = the trigger, clamped 12 px inside both edges.'],
  [31, 'MEGA MENU · CLOSING', 'Leaving the menu or the bar, pressing outside or Escape closes it. Click or Enter follows the link.'],
  [36, 'MASTHEAD', 'Destinations show a banner; brand pages show a logo row. Controls sit 12 px under the bar.'],
  [42, 'MASTHEAD · BELOW 640', 'Controls grow from 28 to 44 for touch. The layout toggle gives way to a menu button.'],
  [48, 'SECTION ROW', 'From 768 the topics are centered, 24 px apart. The active one is semibold with a 2 px underline.'],
  [54, 'SECTION ROW · PHONE', 'Below 768 the row scrolls. The active topic is kept in view, 16 px from the edge.'],
  [62, 'SCROLLING · 768 AND UP', 'The masthead and section row scroll away with the page.'],
  [65.5, 'COMPACT NAV ON AT 96', 'At scroll 96 a compact section row slides in under the bar: 8 px down, fading in over 250 ms.'],
  [70, 'BETWEEN 64 AND 96 NOTHING CHANGES', 'Hysteresis: it stays on until scroll is back to 64 or less, so it never flickers.'],
  [74, 'COMPACT NAV OFF AT 64', 'Back near the top, the compact row fades out and the original row is visible again.'],
  [78, 'SCROLLING · BELOW 768', 'No compact copy on phones. The section row itself sticks 32 px from the top, under the bar.'],
  [84, 'THE BAR ON THE HOME PAGE', 'On the Hearst+ home the bar is clear over the banner at the top, and fills as soon as the page moves.'],
  [90, 'BREAKPOINTS', 'One header from 360 to 1440. Watch what changes at each step.'],
  [104, 'PHONE DRAWER · BELOW 640', 'The menu button opens a modal drawer over a 45% scrim. Focus starts on Close.'],
  [108, 'PHONE DRAWER · KEYBOARD', 'Tab cycles inside the drawer. Escape closes it and focus returns to the menu button.'],
  [112, 'PHONE DRAWER · SIZE', 'Width min(91vw, 400). Header 80. Tiles 44 tall, 8 apart, radius 8.'],
  [116, 'SEARCH', 'Search opens a modal at every width: 672 wide at most, 96 from the top (64 on phones).'],
  [120, 'SEARCH · KEYBOARD', 'Focus lands in the input. Arrows move through results, Enter opens one, Escape closes and returns focus.'],
  [126, 'LAYERS', 'What sits on top of what: overlays, then the bar and its menu, the compact row, the sticky row, the page.'],
  [134, 'THE DRAWING · SHEET 1', 'Structure: plans at 1280 and 390, breakpoints, layers, details and variable tables.'],
  [140, 'THE DRAWING · SHEET 2', 'Logic: scroll states, menu placement, drawer, search, row alignment, thresholds and focus.'],
];

kit.scene('nav', {
  init(kit) {
    kit.css('.kn{position:absolute;inset:0;background:#fff}.kn svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.kn .kcap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.kn .ksub{font-size:24px;fill:#333}' +
      '.kn .kdt{font-size:17px;fill:#111;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.kn .kdts{font-size:14px;letter-spacing:.08em;fill:#555;text-transform:uppercase}' +
      '.kn .ksl{font-size:11px;letter-spacing:.1em;fill:#555;text-transform:uppercase}.kn .kvt{font-size:18px;letter-spacing:.1em;fill:#111;text-transform:uppercase}' +
      '.kn .kread{font-size:38px;fill:#111}.kn .kread2{font-size:19px;fill:#444;letter-spacing:.08em;text-transform:uppercase}.kn .krule{font-size:21px;fill:#222}' +
      '.kn .kobj{fill:#fff;stroke:#111;stroke-width:1.4}.kn .kwell{fill:#f1f1f1;stroke:#111;stroke-width:1}.kn .kslot{fill:none;stroke:#555;stroke-width:1;stroke-dasharray:6 4}' +
      '.kn .khug{fill:#d9d9d9;stroke:#111;stroke-width:1}.kn .khov{fill:#eee;stroke:#111;stroke-width:1.4}.kn .kfill{fill:#111}.kn .kbar{fill:#cfcfcf}.kn .kpill{fill:#e9e9e9;stroke:#111;stroke-width:1}' +
      '.kn .kctl{fill:#fff;stroke:#111;stroke-width:1.2}.kn .kicon{fill:none;stroke:#777;stroke-width:1;stroke-dasharray:3 2}.kn .kcard{fill:#fff;stroke:#bbb;stroke-width:1}' +
      '.kn .kph{fill:none;stroke:#aaa;stroke-width:.9;stroke-dasharray:16 5 3 5}.kn .kframe{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:6 5}.kn .kframe2{fill:none;stroke:#111;stroke-width:2}' +
      '.kn .kdl{stroke:#111;stroke-width:1.1;fill:none}.kn .kext{stroke:#111;stroke-width:.8}.kn .kthin{fill:none;stroke:#111;stroke-width:1.2}.kn .kthick{fill:none;stroke:#111;stroke-width:3}' +
      '.kn .kscrim{fill:#111}.kn .kmenu{fill:#fff;stroke:#111;stroke-width:1.6}.kn .kfocus{fill:none;stroke:#111;stroke-width:3;stroke-dasharray:none}.kn .kring{fill:none;stroke:#111;stroke-width:2}' +
      '.kn .kkey{fill:#fff;stroke:#111;stroke-width:1.6}.kn .kkt{font-size:17px;font-weight:700;fill:#111;letter-spacing:.06em}.kn .kcl{stroke:#999;stroke-width:1;stroke-dasharray:16 4 3 4}');
    const root = kit.h('<div class="kn"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = '<defs><marker id="ka" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#111"/></marker>' +
      '<pattern id="khat" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#444" stroke-width="1"/></pattern></defs>';
    const g = id => { const e = document.createElementNS(NS, 'g'); e.id = id; svg.appendChild(e); return e; };
    this.head = g('khead'); this.live = g('klive');
    ['400 12px Arimo', '700 12px Arimo'].forEach(f => document.fonts.load(f));
  },

  header(t) {
    const c = capAt(CAPS, t), a = eo(seg(t, c[0], c[0] + .45)) * (1 - eo(seg(t, END - .6, END)));
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-NAV-001 · MAIN NAVIGATION', 'kcap', 'text-anchor="end"');
  },

  /* A · the header */
  A(t) {
    const a = win(t, 0, CH[1] + .1, .3, .5); if (a <= 0) return '';
    const vw = 1440, k = 1.1, x = (1920 - vw * k) / 2, y = 250, o = { v: 'home', active: 0 };
    let s = G(eo(seg(t, .3, 1.6)), header(x, y, vw, k, o));
    const mh = mastH(vw, 'home'), rh = rowH(vw);
    const bands = [[0, 32, '1 · UTILITY BAR', 'Weather · destinations · account', 1.6], [32, mh, '2 · MASTHEAD', 'Banner or logo row · layout toggle · theme · search', 2.4], [mh, mh + rh, '3 · SECTION ROW', 'Topics of the current destination or brand', 3.2]];
    bands.forEach(([y0, y1, h, d, t0], i) => {
      const aa = eo(seg(t, t0, t0 + .6));
      s += G(aa, Ln(x - 16, y + y0 * k + 4, x - 16, y + y1 * k - 4, 'kthick') + T(x + 40 + i * 540, 620, h, 'kvt') + T(x + 40 + i * 540, 652, d, 'krule') + Ln(x + 40 + i * 540, 598, x + 40 + i * 540, y + (y0 + y1) / 2 * k, 'kcl'));
    });
    s += G(eo(seg(t, 5.2, 5.8)), T(x + 40, 760, 'STICKY · TOP 0 · Z 50', 'kread2') + T(x + 580, 760, 'SCROLLS AWAY', 'kread2') + T(x + 1120, 760, 'SCROLLS · OR STICKS BELOW 768', 'kread2'));
    s += G(eo(seg(t, 6.4, 7)), T(x + 40, 840, 'Measured on /hearst-plus/ at 1440 · content max 1360, centered · gutters 48', 'kdts'));
    return G(a, s);
  },

  /* B · utility bar */
  B(t) {
    const lt = t - CH[1]; const a = win(lt, 0, CH[2] - CH[1] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1280, k = 1.4, x = (1920 - vw * k) / 2, y = 330, o = { fill: 1 };
    const X = px => x + px * k, Y = py => y + py * k;
    let s = utilityBar(X, Y, vw, k, o);
    s += G(eo(seg(lt, .8, 1.4)), DH(X(0), X(48), Y(0) - 30, 'S1 48') + DH(X(1232), X(1280), Y(0) - 30, 'S1 48'));
    s += G(eo(seg(lt, 1.4, 2)), DH(X(48), X(240), Y(32) + 34, 'W1 192 · WEATHER'));
    s += G(win(lt, 2.2, 6, .4, .4), T(X(640), Y(32) + 70, '1FR | AUTO | 1FR · THE PILL STAYS CENTERED ON THE PAGE (XL)', 'kdt', 'text-anchor="middle"'));
    const P = o.pill;
    s += G(eo(seg(lt, 3, 3.6)), DV(P.y, P.y + P.h, P.x + P.w + 26, 'H2 28') + T(P.pos[0][0] + P.pos[0][1] / 2, Y(32) + 110, 'ACTIVE = WHITE FILL', 'kdts', 'text-anchor="middle"') + Ln(P.pos[0][0] + P.pos[0][1] / 2, Y(32) + 90, P.pos[0][0] + P.pos[0][1] / 2, P.y + P.h + 4, 'kcl'));
    s += G(eo(seg(lt, 4, 4.6)), T(P.pos[5][0] - 6, Y(32) + 150, 'DIVIDER · LOCAL NEWS, A&E, INTERNATIONAL AFTER IT', 'kdts', 'text-anchor="middle"') + Ln(P.pos[5][0] - 6 * k, Y(32) + 130, P.pos[5][0] - 6 * k, P.y + P.h + 4, 'kcl'));
    s += G(eo(seg(lt, 4.8, 5.4)), DH(X(1115.6), X(1232), Y(32) + 34, 'W2 HUG'));
    // phone bar
    const pa = eo(seg(lt, 6, 6.8)); if (pa > 0) {
      const pk = 2, pvw = 390, px = (1920 - pvw * pk) / 2, py = 640, po = { fill: 1, pillScroll: Math.max(0, Math.sin(Math.max(0, lt - 7) * .9)) * 240 };
      const PX = v => px + v * pk, PY = v => py + v * pk;
      s += G(pa, utilityBar(PX, PY, pvw, pk, po) + T(px, py - 24, 'BASE 390 · SCALE 2:1', 'kdts') +
        DH(PX(96), PX(273), PY(32) + 30, 'FLEX · SCROLLS INSIDE') + DH(PX(16), PX(88), PY(32) + 30, 'W1 72') + DV(PY(0), PY(32), PX(390) + 20, 'H2 32 · LINKS 28'));
      s += G(eo(seg(lt, 8, 8.6)), T(px, py + 180, 'Destination links stay at least 28 tall on phones · 24 from 640', 'krule'));
    }
    return G(a, s);
  },

  /* C · mega menu */
  C(t) {
    const lt = t - CH[2]; const a = win(lt, 0, CH[3] - CH[2] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1280, k = 1.25, x = (1920 - vw * k) / 2, y = 240, o = { fill: 1 };
    const X = px => x + px * k, Y = py => y + py * k;
    // pointer path
    const P0 = [X(700), Y(200)], Pl = [X(360), Y(16)], Pa = [X(312), Y(16)], Pout = [X(640), Y(560)];
    const m1 = eio(seg(lt, .6, 2)), m2 = eio(seg(lt, 5, 6)), m3 = eio(seg(lt, 9.2, 10.4));
    let px = lerp(P0[0], Pl[0], m1), py = lerp(P0[1], Pl[1], m1);
    if (lt > 5) { px = lerp(Pl[0], Pa[0], m2); py = lerp(Pl[1], Pa[1], m2); }
    if (lt > 9.2) { px = lerp(Pa[0], Pout[0], m3); py = lerp(Pa[1], Pout[1], m3); }
    const hover = lt < 2 ? -1 : lt < 5.4 ? 1 : lt < 10 ? 0 : -1;
    o.hover = hover === 1 ? 1 : undefined;
    let s = utilityBar(X, Y, vw, k, o);
    // menu
    const life = lt > 2 && lt < 5.4, all = lt >= 5.4 && lt < 10.1;
    const mw = all ? 1152 : 384, ml = all ? Math.min(1280 - 1152 - 12, Math.max(12, 297)) : 330.1, mh = all ? 420 : 300;
    const ma = life ? eo(seg(lt, 2, 2.3)) : all ? 1 - eo(seg(lt, 9.9, 10.1)) : 0;
    if (ma > 0) {
      let m = Rc(X(ml), Y(40), mw * k, mh * k, 'kmenu', rx(11.2 * k)) + Rc(X(ml + 20), Y(60), 200 * k, 14 * k, 'khug') + Ln(X(ml + 20), Y(88), X(ml + mw - 20), Y(88), 'kthin');
      const cols = all ? 4 : 1, cw = (mw - 40 - (cols - 1) * 20) / cols;
      for (let c = 0; c < cols; c++) { m += Rc(X(ml + 20 + c * (cw + 20)), Y(104), 110 * k, 10 * k, 'kslot'); for (let r = 0; r < (all ? 8 : 6); r++) m += Rc(X(ml + 20 + c * (cw + 20)), Y(124 + r * 34), 24 * k, 24 * k, 'kwell', rx(4)) + Rc(X(ml + 52 + c * (cw + 20)), Y(130 + r * 34), (cw - 50) * k * .7, 12 * k, 'kslot'); }
      s += G(ma, m);
      s += G(life ? eo(seg(lt, 2.8, 3.4)) : 0, DH(X(ml), X(ml + mw), Y(40 + mh) + 40, 'WD 384 · STARTS AT THE TRIGGER') + DV(Y(32), Y(40), X(ml) - 20, 'M2 8', 'l'));
      s += G(all ? eo(seg(lt, 6.2, 6.8)) : 0, DH(X(ml), X(ml + mw), Y(40 + mh) + 40, 'WA 1152 · min(1152, 1280 − 24)') + DH(X(ml + mw), X(1280), Y(-20), 'M1 12') + T(X(640), Y(40 + mh) + 100, 'LEFT = clamp(trigger, 12, 1280 − 1152 − 12) = 116', 'kdt', 'text-anchor="middle"'));
    }
    if (lt > 2 && lt < 5.4) s += focusRing(o.pill.pos[1][0], o.pill.y + 2 * k, o.pill.pos[1][1], 24 * k, 12 * k, 0);
    s += G(eo(seg(lt, 3.6, 4.2)) * (lt < 5.4 ? 1 : 0), T(X(1280), Y(40) + 60, 'MENU WIDTHS', 'kvt', 'text-anchor="end"') + ['ONE DESTINATION 384', 'A&E FAMILY 672', 'LOCAL NEWS 1024', 'ALL · INTERNATIONAL 1152'].map((l, i) => T(X(1280), Y(40) + 96 + i * 30, l, 'kdts', 'text-anchor="end"')).join(''));
    s += G(win(lt, 10.4, 14.2, .4, .3), T(X(640), Y(200), 'MENU CLOSED · POINTER LEFT THE BAR', 'kvt', 'text-anchor="middle"'));
    s += key(X(560), Y(260), 'ESC', win(lt, 11.4, 14.2, .3, .3)) + G(win(lt, 11.4, 14.2, .3, .3), T(X(560) + 90, Y(260) + 27, 'also closes it · so does a press outside', 'krule'));
    s += G(win(lt, 12.2, 14.2, .3, .3), T(X(640), Y(380), 'Hover or focus opens · click or Enter navigates to the destination', 'krule', 'text-anchor="middle"'));
    s += ptr(px, py, win(lt, .3, 13, .3, .4));
    return G(a, s);
  },

  /* D · masthead */
  D(t) {
    const lt = t - CH[3]; const a = win(lt, 0, CH[4] - CH[3] + .1, .4, .5); if (a <= 0) return '';
    const m = eio(seg(lt, 6, 9)), vw = lerp(1280, 390, m), k = lerp(1.05, 1.5, m);
    const w = vw * k, x1 = (1920 - w) / 2, x2 = x1, y = 250, y2 = y + (mastH(vw, 'home') + rowH(vw)) * k + 110;
    let s = header(x1, y, vw, k, { v: 'home', fill: 1 }) + header(x2, y2, vw, k, { v: 'brand', fill: 1 });
    const ha = eo(seg(lt, .8, 1.4)) * (1 - eo(seg(lt, 5.6, 6))), hb = eo(seg(lt, 9.2, 9.8));
    const mh1 = mastH(vw, 'home'), mh2 = mastH(vw, 'brand');
    s += T(x1, y - 22, 'DESTINATION · BANNER', 'kdts') + T(x2, y2 - 22, 'BRAND PAGE · LOGO ROW', 'kdts');
    s += G(ha, DV(y + 32 * k, y + mh1 * k, x1 - 20, 'H3 = W ÷ 11.54', 'l') + DV(y2 + 32 * k, y2 + mh2 * k, x2 + w + 20, 'H3B 96'));
    s += G(eo(seg(lt, 2.2, 2.8)) * (1 - eo(seg(lt, 5.6, 6))), DV(y + 32 * k, y + 44 * k, x1 + w + 20, 'S6 12') + DV(y + 44 * k, y + 72 * k, x1 + w + 20, '', 'r') + T(x1 + w, y + mh1 * k + rowH(vw) * k + 34, 'CONTROLS 28 · LAYOUT TOGGLE LEFT · THEME, SEARCH RIGHT', 'kdts', 'text-anchor="end"'));
    s += G(eo(seg(lt, 3.4, 4)) * (1 - eo(seg(lt, 5.6, 6))), T(x1, y2 + (mh2 + 39) * k + 60, 'On the Hearst+ home the banner starts under the bar (−32 margin), so the bar floats over it.', 'krule'));
    s += T(1800, 200, 'VIEWPORT ' + Math.round(vw), 'kread2', 'text-anchor="end"');
    s += G(hb, DV(y + 32 * k, y + mh1 * k, x1 - 20, 'W ÷ 5', 'l') + DV(y2 + 32 * k, y2 + mh2 * k, x2 + w + 20, '80') + DV(y + 44 * k, y + 88 * k, x1 + w + 20, 'Z1 44') +
      T(x1 + w + 20, y + (mh1 + 41) * k - 10, 'MENU BUTTON REPLACES THE TOGGLE', 'kdts') + T(x1 + w + 20, y + (mh1 + 41) * k + 14, 'PHONE BANNERS USE A 5:1 CROP', 'kdts') + T(x2 + w + 20, y2 + (mh2 + 41) * k - 10, 'BRAND PAGES GET THE MENU TOO', 'kdts'));
    return G(a, s);
  },

  /* E · section row */
  E(t) {
    const lt = t - CH[4]; const a = win(lt, 0, CH[5] - CH[4] + .1, .4, .5); if (a <= 0) return '';
    let s = '';
    const da = win(lt, 0, 6.2, .4, .4);
    if (da > 0) {
      const vw = 1280, k = 1.3, x = (1920 - vw * k) / 2 - 0, y = 340, X = px => x + px * k, Y = py => y + py * k;
      const act = lt < 1.6 ? 0 : lt < 2.6 ? 1 : lt < 3.6 ? 4 : 5;
      const o = { active: act };
      let q = sectionRow(X, Y, vw, k, 0, 39, o, 1) + Ln(X(640), Y(-30), X(640), Y(70), 'kcl');
      const L0 = vw / 2 - LTOT / 2;
      q += DH(X(L0), X(L0 + LTOT), Y(0) - 30, 'HUG 739 · CENTERED') + DH(X(L0 + LOFF[0] + LINKS[0]), X(L0 + LOFF[1]), Y(39) + 40, 'S9 24') + DV(Y(8), Y(30), X(L0 + LTOT) + 30, 'H5 22') + DV(Y(0), Y(39), X(L0) - 30, 'H4 39', 'l');
      q += T(960, Y(39) + 140, 'Active topic: semibold, 2 px underline in the primary color (B1). Others: regular weight.', 'krule', 'text-anchor="middle"');
      s += G(da, q);
    }
    const pa = win(lt, 6, CH[5] - CH[4] + .1, .5, .3);
    if (pa > 0) {
      const vw = 390, k = 2.4, x = (1920 - vw * k) / 2, y = 330, X = px => x + px * k, Y = py => y + py * k;
      const st = [[0, 0, 0], [7.4, 0, 0], [8.6, 1, 125.2], [10.2, 1, 125.2], [11.4, 5, 262.3], [CH[5], 5, 262.3]];
      let j = 0; while (j < st.length - 2 && lt > st[j + 1][0]) j++;
      const A0 = st[j], B0 = st[j + 1], q = eio(seg(lt, A0[0], B0[0])), sl = lerp(A0[2], B0[2], q), act = q > .2 ? B0[1] : A0[1];
      let r = Rc(X(0), Y(0), vw * k, 41 * k, 'kframe') + sectionRow(X, Y, vw, k, 0, 41, { active: act, rowScroll: sl }, 1);
      r += DH(X(16), X(374), Y(0) - 30, 'CW 358 · CONTENT 739 · SCROLLS');
      const prevOff = act > 0 ? LOFF[act - 1] : 0;
      if (act > 0) r += DH(X(16), X(16 + 16), Y(41) + 40, 'A1 16') + T(X(16 + prevOff - sl + LINKS[act - 1] / 2), Y(41) + 100, 'PREVIOUS TOPIC', 'kdts', 'text-anchor="middle"') + T(X(16 + LOFF[act] - sl + LINKS[act] / 2), Y(41) + 130, 'ACTIVE', 'kdts', 'text-anchor="middle"');
      r += T(960, 760, 'scroll = max(0, previous.left − 16) · keep the active end 16 from the right', 'kdt', 'text-anchor="middle"');
      r += T(960, 800, 'Hatched fades show only on the side with more topics · gone from 768', 'krule', 'text-anchor="middle"');
      r += T(960, 860, 'SCROLL LEFT ' + Math.round(sl), 'kread2', 'text-anchor="middle"');
      s += G(pa, r);
    }
    return G(a, s);
  },

  /* F · scrolling md+ */
  F(t) {
    const lt = t - CH[5]; const a = win(lt, 0, CH[6] - CH[5] + .1, .4, .5); if (a <= 0) return '';
    const sF = u => u < .8 ? 0 : u < 4.8 ? eio(seg(u, .8, 4.8)) * 160 : u < 8 ? 160 : u < 10 ? lerp(160, 80, eio(seg(u, 8, 10))) : u < 12 ? 80 : u < 13.6 ? lerp(80, 40, eio(seg(u, 12, 13.6))) : u < 14.6 ? 40 : lerp(40, 0, eio(seg(u, 14.6, 15.8)));
    const sc = sF(lt), cs = compactState(sF, lt);
    const vw = 1280, vh = 800, k = .7, x = 100, y = 220;
    let s = viewport(x, y, vw, vh, k, { v: 'home', scroll: sc, compact: cs.p, fill: 1, active: 0 });
    s += T(x, y + vh * k + 40, 'VIEWPORT 1280 × 800 · SCALE 0.7', 'kdts');
    // plot
    const PX = 1080, PY = 900, KX = 4.2, V = v => PX + v * KX;
    let p = Ln(PX, PY, PX + 720, PY, 'kthin') + Ln(PX, PY, PX, PY - 300, 'kthin') + T(PX + 720, PY + 34, 'SCROLL Y', 'kdts', 'text-anchor="end"') +
      T(PX - 14, PY - 236, 'ON', 'kdts', 'text-anchor="end"') + T(PX - 14, PY - 34, 'OFF', 'kdts', 'text-anchor="end"') +
      Rc(V(64), PY - 280, V(96) - V(64), 280, '', 'fill="url(#khat)" opacity=".35"') +
      `<polyline points="${PX},${PY - 40} ${V(96)},${PY - 40} ${V(96)},${PY - 240} ${V(165)},${PY - 240}" class="kthin"/><polyline points="${V(64)},${PY - 240} ${V(64)},${PY - 40}" class="kthin"/>` +
      Ln(V(96), PY - 6, V(96), PY + 6, 'kthick') + Ln(V(64), PY - 6, V(64), PY + 6, 'kthick') + T(V(96), PY + 34, '96', 'kdt', 'text-anchor="middle"') + T(V(64), PY + 34, '64', 'kdt', 'text-anchor="middle"');
    p += `<circle cx="${f1(V(sc))}" cy="${f1(PY - (cs.on ? 240 : 40))}" r="10" class="kfill"/>`;
    p += T(PX, 380, 'SCROLL Y  ' + Math.round(sc), 'kread') + T(PX, 430, cs.on ? 'COMPACT NAV · ON' : 'COMPACT NAV · OFF', 'kread2');
    s += G(eo(seg(lt, .4, 1)), p);
    s += G(eo(seg(lt, 3.6, 4.2)), T(PX, 480, 'Fixed at top 32 · z 40 · translate −8 → 0 · opacity 0 → 1', 'krule'));
    return G(a, s);
  },

  /* G · scrolling phone */
  Gs(t) {
    const lt = t - CH[6]; const a = win(lt, 0, CH[7] - CH[6] + .1, .4, .5); if (a <= 0) return '';
    const sF = u => u < .8 ? 0 : u < 4.6 ? eio(seg(u, .8, 4.6)) * 320 : u < 6 ? 320 : u < 7.4 ? lerp(320, 0, eio(seg(u, 6, 7.4))) : u < 8.4 ? 0 : u < 9.2 ? lerp(0, 4, eio(seg(u, 8.4, 9.2))) : 4;
    const sc = sF(lt), vw = 390, vh = 760, k = .9, x = 330, y = 210;
    const fill = sc > 0 ? 1 : 0;
    let s = viewport(x, y, vw, vh, k, { v: 'home', scroll: sc, fill, active: 0 });
    const top = Math.max(32, mastH(vw, 'home') - sc);
    s += G(eo(seg(lt, 2.4, 3)), DV(y, y + 32 * k, x + vw * k + 24, 'P1 TOP 0') + DV(y + 32 * k, y + top * k, x + vw * k + 24, '') + T(x + vw * k + 40, y + 70, top <= 32.5 ? 'P2 STUCK AT 32' : 'ROW TOP ' + Math.round(top), 'kdt'));
    const RX = 1000;
    s += T(RX, 330, 'SCROLL Y  ' + Math.round(sc), 'kread');
    s += G(eo(seg(lt, 1, 1.6)), T(RX, 400, 'Utility bar: sticky, top 0, z 50.', 'krule') + T(RX, 436, 'Section row: sticky, top 32, z 30 (destinations).', 'krule'));
    s += G(eo(seg(lt, 3.4, 4)), T(RX, 500, 'No compact copy below 768: the compact row is hidden.', 'krule'));
    s += G(eo(seg(lt, 6.4, 7)), T(RX, 600, 'HOME PAGE BAR', 'kvt') + T(RX, 636, 'Scroll 0: clear over the banner.', 'krule') + T(RX, 672, 'Scroll > 0: fills with the logo navy.', 'krule'));
    s += T(RX, 740, fill ? 'BAR · FILLED' : 'BAR · CLEAR', 'kread2');
    return G(a, s);
  },

  /* H · breakpoints */
  H(t) {
    const lt = t - CH[7]; const a = win(lt, 0, CH[8] - CH[7] + .1, .4, .5); if (a <= 0) return '';
    const stops = [360, 600, 700, 900, 1150, 1440], D = CH[8] - CH[7];
    const u = clamp01((lt - .6) / (D - 2.6)), vw = (() => { const n = stops.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), q = eio(f - i); return lerp(stops[i], stops[i + 1], q); })();
    const k = Math.min(1.5, 1680 / vw), x = (1920 - vw * k) / 2, y = 240;
    let s = header(x, y, vw, k, { v: 'home', fill: 1, active: 0, rowScroll: 0 });
    const RX = 200, RW = 1520, RY = 830, V = v => RX + (v - 320) / (1460 - 320) * RW;
    s += Ln(RX, RY, RX + RW, RY, 'kthin');
    [[640, 'SM 640'], [768, 'MD 768'], [1024, 'LG 1024'], [1280, 'XL 1280'], [1360, '1360']].forEach(([v, l], i) => { const on = vw >= v; s += Ln(V(v), RY - 12, V(v), RY + 12, on ? 'kthick' : 'kthin') + T(V(v), RY - 22 - (i % 2) * 22, l, on ? 'kdt' : 'kdts', 'text-anchor="middle"'); });
    s += `<path d="M${f1(V(vw))},${RY + 16} l-10,18 h20 z" class="kfill"/>` + T(V(vw), RY + 62, Math.round(vw) + ' PX', 'kdt', 'text-anchor="middle"');
    const band = vw < 640 ? 'BASE · controls 44 · menu button · pill scrolls · row scrolls and sticks · gutters 16' : vw < 768 ? 'SM · controls 28 · layout toggle · no drawer · banner W ÷ 11.54' : vw < 1024 ? 'MD · row static and centered · compact nav on scroll · fades off · gutters 24' : vw < 1280 ? 'LG · weather cell widens 72 → 192' : vw < 1360 ? 'XL · bar grid 1fr | auto | 1fr · gutters 48' : '≥ 1360 · content stops at 1360 and centers';
    s += T(960, 960, band, 'krule', 'text-anchor="middle"');
    return G(a, s);
  },

  /* I · phone drawer */
  I(t) {
    const lt = t - CH[8]; const a = win(lt, 0, CH[9] - CH[8] + .1, .4, .5); if (a <= 0) return '';
    const vw = 390, vh = 844, k = .84, x = 380, y = 200, X = px => x + px * k, Y = py => y + py * k;
    const open = lt > 1.2 && lt < 8.6;
    const o = { v: 'home', fill: 1 };
    const pw = Math.min(vw * .91, 400);
    const tiles = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) if (!(r === 3 && c === 1)) tiles.push([20 + c * 160.9, 132 + r * 52]);
    const over = () => {
      if (!open) return '';
      let d = Rc(X(0), Y(0), vw * k, vh * k, 'kscrim', 'opacity=".45"') + Rc(X(0), Y(0), pw * k, vh * k, 'kobj') + Ln(X(0), Y(80), X(pw), Y(80), 'kthin') + Ln(X(0), Y(vh - 69), X(pw), Y(vh - 69), 'kthin');
      d += Rc(X(20), Y(26), 140 * k, 28 * k, 'kslot') + Rc(X(pw - 20 - 44), Y(18), 44 * k, 44 * k, 'kctl', rx(4));
      tiles.forEach(([tx, ty]) => { d += Rc(X(tx), Y(ty), 152.9 * k, 44 * k, 'kslot', rx(8 * k)); });
      ['BRANDS', 'CONTINUE READING', 'JOIN GROUPS'].forEach((l, i) => { d += Rc(X(20), Y(370 + i * 132), (pw - 40) * k, 110 * k, 'kslot') + T(X(pw / 2), Y(370 + i * 132 + 60), l, 'ksl', 'text-anchor="middle"'); });
      d += Rc(X(20), Y(vh - 56), (pw - 40) * k, 44 * k, 'kslot', rx(8 * k)) + T(X(pw / 2), Y(vh - 30), 'THEME ACTION', 'ksl', 'text-anchor="middle"');
      // focus
      const seq = [[pw - 64, 18, 44, 44, 4], ...tiles.slice(0, 4).map(([a, b]) => [a, b, 152.9, 44, 8])];
      let fi = 0; if (lt > 4) fi = Math.min(seq.length - 1, Math.floor((lt - 4) / .45) + 1); if (lt > 6.4) fi = 0;
      const f = seq[fi]; d += focusRing(X(f[0]), Y(f[1]), f[2] * k, f[3] * k, f[4], lt > 1.8 ? 1 : 0);
      return d;
    };
    o.over = over;
    let s = viewport(x, y, vw, vh, k, o);
    const ctl = o.ctl.menu;
    s += ptr(ctl[0] + ctl[2] * .6, ctl[1] + ctl[2] * .6, win(lt, .2, 1.6, .3, .3), clamp01((lt - 1) / .4));
    if (lt > 8.9) s += focusRing(ctl[0], ctl[1], ctl[2], ctl[2], 4, win(lt, 8.9, 11.6, .2, .3));
    const RX = 860;
    s += G(eo(seg(lt, 1.8, 2.4)), T(RX, 330, 'OPEN', 'kvt') + T(RX, 366, 'Menu button → drawer + scrim. Focus on Close.', 'krule'));
    s += G(eo(seg(lt, 4, 4.6)), T(RX, 440, 'TAB', 'kvt') + T(RX, 476, 'Moves through the drawer and wraps at the end;', 'krule') + T(RX, 506, 'the page behind is isolated.', 'krule'));
    s += key(RX, 560, 'TAB', win(lt, 4, 6.8, .2, .2)) + key(RX, 560, 'ESC', win(lt, 8.2, 9.8, .2, .2));
    s += G(eo(seg(lt, 8.4, 9)), T(RX, 650, 'CLOSE', 'kvt') + T(RX, 686, 'Escape, Close or the scrim. Focus back on the menu button.', 'krule'));
    s += G(eo(seg(lt, 9, 9.6)), T(RX, 770, 'O1 = min(91vw, 400) · 355 at 390 · O2 header 80 · O3 tiles 44, gap 8, r 8', 'kdts') + T(RX, 800, 'Below 640 only · each target at least 44', 'kdts'));
    return G(a, s);
  },

  /* J · search */
  J(t) {
    const lt = t - CH[9]; const a = win(lt, 0, CH[10] - CH[9] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1440, vh = 900, k = .66, x = 120, y = 210, X = px => x + px * k, Y = py => y + py * k;
    const open = lt > 1.2 && lt < 7.4, o = { v: 'home', fill: 1 };
    const pl = (vw - 672) / 2, pt = 96;
    o.over = () => {
      if (!open) return '';
      let d = Rc(X(0), Y(0), vw * k, vh * k, 'kscrim', 'opacity=".5"') + Rc(X(pl), Y(pt), 672 * k, 600 * k, 'kmenu', rx(8 * k)) + Rc(X(pl), Y(pt), 672 * k, 4 * k, 'kfill');
      d += Rc(X(pl + 24), Y(pt + 20), 140 * k, 14 * k, 'khug') + Ln(X(pl), Y(pt + 77), X(pl + 672), Y(pt + 77), 'kthin') + Rc(X(pl + 590), Y(pt + 16), 44 * k, 44 * k, 'kctl', rx(4));
      d += Rc(X(pl + 24), Y(pt + 100), 624 * k, 40 * k, 'kobj', rx(6 * k));
      const typed = Math.max(0, Math.min(1, (lt - 2.2) / 1)); d += Rc(X(pl + 40), Y(pt + 114), 200 * typed * k, 12 * k, 'khug');
      d += focusRing(X(pl + 24), Y(pt + 100), 624 * k, 40 * k, 6, lt > 1.6 && lt < 4.2 ? 1 : 0);
      const ra = eo(seg(lt, 3, 3.5)), sel = lt < 4.2 ? -1 : Math.min(3, Math.floor((lt - 4.2) / .6));
      for (let i = 0; i < 4; i++) d += G(ra, Rc(X(pl + 24), Y(pt + 160 + i * 96), 624 * k, 84 * k, i === sel ? 'khov' : 'kslot', rx(8 * k)) + Rc(X(pl + 36), Y(pt + 170 + i * 96), 100 * k, 64 * k, 'kwell', rx(6 * k)));
      return d;
    };
    let s = viewport(x, y, vw, vh, k, o);
    const c = o.ctl.search;
    s += ptr(c[0] + c[2] * .6, c[1] + c[2] * .6, win(lt, .2, 1.6, .3, .3), clamp01((lt - 1) / .4));
    if (lt > 7.4) s += focusRing(c[0], c[1], c[2], c[2], 4, win(lt, 7.4, 10, .2, .3));
    if (open) s += G(eo(seg(lt, 1.4, 2)), DH(X(pl), X(pl + 672), Y(pt) - 22, 'O5 672') + DV(Y(0), Y(pt), X(pl) - 22, 'O6 96', 'l'));
    const RX = 1110;
    s += key(RX, 300, '↓', win(lt, 4.2, 6.6, .2, .2)) + key(RX + 60, 300, '↑', win(lt, 4.2, 6.6, .2, .2)) + key(RX, 300, 'ESC', win(lt, 6.9, 8.2, .2, .2));
    s += G(eo(seg(lt, 1.6, 2.2)), T(RX, 400, 'Focus goes straight into the input.', 'krule'));
    s += G(eo(seg(lt, 3, 3.6)), T(RX, 440, 'Results: title, brand, topic and tag matches.', 'krule'));
    s += G(eo(seg(lt, 4.2, 4.8)), T(RX, 480, 'Arrows move the highlight; Enter opens the story.', 'krule'));
    s += G(eo(seg(lt, 7.2, 7.8)), T(RX, 520, 'Escape closes · focus back on Search.', 'krule'));
    s += G(eo(seg(lt, 7.8, 8.4)), T(RX, 600, 'Phones: inset 12, top 64, 44 close target.', 'kdts'));
    return G(a, s);
  },

  /* K · layers */
  K(t) {
    const lt = t - CH[10]; const a = win(lt, 0, CH[11] - CH[10] + .1, .4, .5); if (a <= 0) return '';
    const L = [['DRAWER · SEARCH', 'fixed · z 50 · portaled, later in the DOM'], ['MEGA MENU', 'absolute · z 60, inside the bar'], ['UTILITY BAR', 'sticky · top 0 · z 50'], ['COMPACT NAV', 'fixed · top 32 · z 40 · 768 and up'], ['SECTION ROW', 'sticky · top 32 · z 30 · below 768'], ['MASTHEAD', 'static · scrolls away'], ['PAGE', 'river and rails']];
    let s = '';
    L.forEach(([h, d], i) => {
      const j = L.length - 1 - i, e = eio(seg(lt, .4 + j * .4, 1.2 + j * .4)), yy = lerp(860, 250 + i * 92, e);
      const x = 360, w = 520, dx = 80, hh = 56;
      s += G(e, `<path d="M${x + dx},${f1(yy)} H${x + dx + w} L${x + w},${f1(yy + hh)} H${x} Z" class="${i === 6 ? 'kwell' : i === 0 ? 'khug' : 'kobj'}"/>` + Ln(x + dx + w + 10, yy + hh / 2, x + dx + w + 60, yy + hh / 2, 'kcl') + T(x + dx + w + 76, yy + hh / 2 - 2, h, 'kvt') + T(x + dx + w + 76, yy + hh / 2 + 26, d, 'krule'));
    });
    s += G(eo(seg(lt, 4.4, 5)), T(1180, 980, 'The mega menu’s z 60 only counts inside the bar’s own z 50 layer.', 'kdts'));
    return G(a, s);
  },

  /* L · sheet tour */
  L(t) {
    const lt = t - CH[11]; const a = win(lt, 0, CH[12] - CH[11] + .5, .5, .8); if (a <= 0) return '';
    let s = '';
    [[0, 6.2], [6, 12.5]].forEach(([t0, t1], i) => {
      const aa = win(lt, t0, t1, .6, i ? .1 : .5); if (aa <= 0) return;
      const z = lerp(1, 1.05, seg(lt, t0, t1)), w = 1700 * .835 * z, h = 1060 * .835 * z;
      s += G(aa, `<image href="${SHEETS[i]}" x="${f1(960 - w / 2)}" y="${f1(165 + (900 - h) / 2)}" width="${f1(w)}" height="${f1(h)}"/>`);
    });
    return G(a, s);
  },

  render(t) {
    CLIP = 0;
    this.header(t);
    const parts = [this.A(t), this.B(t), this.C(t), this.D(t), this.E(t), this.F(t), this.Gs(t), this.H(t), this.I(t), this.J(t), this.K(t), this.L(t)];
    this.live.innerHTML = parts.join('');
  },
});
