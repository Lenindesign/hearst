// Featured story carousel (HP-CAR-001 · Rev A) → motion film, ~110 s: how the Hearst+ lead carousel is built and how it moves.
// Pure function of time. Geometry measured in the running app (2026-11-11, viewports 390–1440);
// build-carousel-scene.mjs embeds the two drawing sheets for the closing tour.
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

let CLIP = 0;
/* ---------- measured geometry ---------- */
const EASE = p => { // cubic-bezier(.2,0,0,1), solved numerically
  if (p <= 0) return 0; if (p >= 1) return 1; let lo = 0, hi = 1, u = .5;
  for (let i = 0; i < 20; i++) { u = (lo + hi) / 2; const x = 3 * (1 - u) * (1 - u) * u * .2 + u * u * u; if (x < p) lo = u; else hi = u; }
  return 3 * (1 - u) * u * u + u * u * u;
};
/* one slide at (x, y), width W css px, scale k.
   o: { phone, lines, photoDX (css px), cardDX (css px), active, ctl (show controls), clip (id) } */
function slideG(x, y, W, k, o) {
  o = o || {}; const ph = W * .6, mx = o.phone ? 6 : 18, ov = o.phone ? 40 : 48, ch = o.phone ? 224 : 240, px = o.phone ? 20 : 24, py = o.phone ? 10 : 12;
  const X = v => x + v * k, Y = v => y + v * k; let s = '';
  if (o.onlyCtl) return { s: ctlG(X, Y, W, k, o) };
  const id = 'kc' + (CLIP++);
  s += `<clipPath id="${id}"><rect x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(W * k)}" height="${f1(ph * k)}" ${rx(8 * k)}/></clipPath>`;
  const pdx = (o.photoDX || 0) - W * .05;
  s += `<g clip-path="url(#${id})">` + Rc(X(pdx), Y(0), W * 1.1 * k, ph * k, 'kwell') + `<path d="M${f1(X(pdx))},${f1(Y(0))} L${f1(X(pdx + W * 1.1))},${f1(Y(ph))} M${f1(X(pdx + W * 1.1))},${f1(Y(0))} L${f1(X(pdx))},${f1(Y(ph))}" class="kph"/>` +
    [.18, .5, .82].map(f => Ln(X(pdx + W * 1.1 * f), Y(0), X(pdx + W * 1.1 * f), Y(ph), 'kcl')).join('') + T(X(pdx + W * .55), Y(ph * .42), o.label || 'PHOTO', 'ksl', 'text-anchor="middle"') + '</g>' + Rc(X(0), Y(0), W * k, ph * k, 'kthin', rx(8 * k));
  const cx = mx + (o.cardDX || 0), cy = ph - ov, cw = W - 2 * mx;
  s += Rc(X(cx) + 3, Y(cy + ch) - 2, cw * k - 6, 8, 'khug', 'opacity=".5"') + Rc(X(cx), Y(cy), cw * k, ch * k, 'kcardb', rx(8 * k));
  const ix = cx + px, iw = cw - 2 * px; let yy = cy + py;
  s += Rc(X(ix), Y(yy + 6), 20 * k, 20 * k, 'kchip', rx(4 * k)) + Rc(X(ix + 28), Y(yy + 10), 80 * k, 12 * k, 'kchip');
  yy += 38; const hl = o.phone ? 28 : 36, n = o.lines ?? 2;
  for (let i = 0; i < n; i++) s += Rc(X(ix), Y(yy + i * hl + 4), iw * (i === n - 1 ? .62 : .96) * k, (hl - 10) * k, 'kchip');
  yy += n * hl + 12; if (!o.noSummary) for (let i = 0; i < 2; i++) s += Rc(X(ix), Y(yy + i * 20 + 4), iw * (i ? .7 : 1) * k, 10 * k, 'kchip2');
  if (o.ctl) s += ctlG(X, Y, W, k, o);
  return { s, ph, ch, ov, cy, mx, cw, h: ph - ov + ch };
}
function ctlG(X, Y, W, k, o) {
  let s = '';
  {
    s += Rc(X(20), Y(20), 147 * k, 24 * k, 'kpillb', rx(12 * k)) + T(X(93), Y(32) + 5 * k, o.pill || 'TODAY’S PICKS · 1 OF 5', 'kpt', `text-anchor="middle" style="font-size:${f1(10.5 * k)}px"`);
    if (o.phone) s += `<circle cx="${f1(X(W - 42))}" cy="${f1(Y(42))}" r="${f1(22 * k)}" class="kpillb"/>` + T(X(W - 42), Y(42) + 6, o.paused ? '▶' : 'II', 'kpt', 'text-anchor="middle"');
    else ['‹', o.paused ? '▶' : 'II', '›'].forEach((g, i) => { const c = W - 20 - 14 - (2 - i) * 34; s += `<circle cx="${f1(X(c))}" cy="${f1(Y(34))}" r="${f1(14 * k)}" class="kpillb"/>` + T(X(c), Y(34) + 5, g, 'kpt', 'text-anchor="middle"'); });
  }
  return s;
}
/* a strip of slides seen through a window of width W at track position p (float, visual index), photo position pp */
function strip(x, y, W, k, p, pp, o) {
  o = o || {}; const id = 'kc' + (CLIP++), labs = ['CLONE 5', 'STORY 1', 'STORY 2', 'STORY 3', 'STORY 4', 'STORY 5', 'CLONE 1'];
  let s = `<clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y - 4)}" width="${f1(W * k)}" height="${f1(700 * k)}"/></clipPath><g clip-path="url(#${id})">`;
  for (let v = 0; v < 7; v++) { const off = (v - p) * W; if (Math.abs(off) > W * 1.2) continue;
    const sl = slideG(x + off * k, y, W, k, { ...o, label: labs[v], photoDX: (pp - v) * W * .08 + (o.drag || 0) * -.08, cardDX: -((o.cp != null ? o.cp : p) - v) * 10, ctl: false }); s += sl.s; }
  s += '</g>';
  if (o.ctl !== false) s += slideG(x, y, W, k, { ...o, onlyCtl: true }).s;
  return s;
}

/* ---------- chapters ---------- */
const CH = [0, 10, 22, 36, 48, 60, 72, 82, 90, 98, 110];
const END = CH[CH.length - 1];
const CAPS = [
  [0, 'THE FEATURED STORY CAROUSEL', 'The lead module on Hearst+: five stories, one at a time, with the story card over the photo.'],
  [5, 'THREE PARTS', 'A 5:3 photo, a black text card that overlaps it, and the controls in the top corners.'],
  [10, 'SIZES · 640 AND UP', 'The card sits 18 in from each side, overlaps the photo by 48 and is always 240 tall.'],
  [16, 'SIZES · PHONES', 'Below 640: inset 6, overlap 40, card 224. Previous and Next go away; Pause grows to 44.'],
  [22, 'THE TRACK', 'Five stories plus a clone at each end, side by side. The view shows one slide.'],
  [27, 'AUTOPLAY · EVERY 6.5 S', 'The track moves one slide in 300 ms with cubic-bezier(.2, 0, 0, 1).'],
  [31, 'THE LOOP', 'After story 5 it slides onto the clone of story 1, then snaps to the real one with no animation.'],
  [36, 'PARALLAX · SLOWED DOWN', 'One step at a tenth of the speed. The card leads by 10 px; the photo starts 16 ms late.'],
  [42, 'PARALLAX · THE PHOTO LAYER', 'The photo is 110% wide and shifts 8% of the slide against the motion, so it travels less.'],
  [48, 'SWIPE', 'On Today’s Picks you can drag. The slide follows the finger, up to 24% of its width.'],
  [53, 'SWIPE · THRESHOLD', 'Past min(64, 14% of the width), or a quick flick of 24 px, it moves on. Otherwise it springs back.'],
  [57, 'TRACKPAD', 'Two-finger swipes add up horizontal scroll; 55 px moves one slide, then it locks for 520 ms.'],
  [60, 'WHAT PAUSES AUTOPLAY', 'Pointer over the carousel, a drag, focus inside it, the Pause button, or reduced motion.'],
  [66, 'FOCUS PAUSES FOR GOOD', 'Once focus enters, rotation stays paused until the reader presses Resume.'],
  [72, 'FOCUS ORDER', 'Only the active slide is in the tab order: open story, comments, then Previous, Pause, Next.'],
  [77, 'THE OTHER SLIDES', 'Off-screen slides and the clones are aria-hidden and inert. A live region announces the story when paused.'],
  [82, 'LIST LAYOUT', 'In the river’s list mode each story is a row: 112 | 1fr at 184 tall, 38% | 1fr at 220 from 640.'],
  [90, 'FINDING · FULL-WIDTH HERO', 'With the left-to-right option the headline keeps a 33% cap. On a phone it is 102 wide and overflows the card.'],
  [98, 'THE DRAWING · SHEET 1', 'Structure: slides at 1440 and 390, the list layout, controls, card text and variable tables.'],
  [104, 'THE DRAWING · SHEET 2', 'Logic: the looping track, parallax timing, autoplay, swipe thresholds, semantics and focus.'],
];

kit.scene('carousel', {
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
      '.kn .kkey{fill:#fff;stroke:#111;stroke-width:1.6}.kn .kkt{font-size:17px;font-weight:700;fill:#111;letter-spacing:.06em}.kn .kcardb{fill:#111;stroke:none}.kn .kchip{fill:#fff;opacity:.9}.kn .kchip2{fill:#fff;opacity:.55}.kn .kpillb{fill:#111;opacity:.72}.kn .kpt{font-size:12px;font-weight:700;fill:#fff;letter-spacing:.04em}.kn .kcl{stroke:#999;stroke-width:1;stroke-dasharray:16 4 3 4}');
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
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-CAR-001 · FEATURED STORY CAROUSEL', 'kcap', 'text-anchor="end"');
  },

  /* A · the module */
  A(t) {
    const a = win(t, 0, CH[1] + .1, .3, .5); if (a <= 0) return '';
    const W = 632, k = 1.2, x = 960 - W * k / 2 - 120, y = 190;
    const sl = slideG(x, y, W, k, { ctl: true, lines: 2, label: 'PHOTO · 5:3' });
    let s = G(eo(seg(t, .3, 1.4)), sl.s);
    const RX = x + W * k + 60, parts = [[5.4, 'PHOTO', '5:3 · radius 8 · fills the column', y + 200], [6.2, 'TEXT CARD', 'black · overlaps the photo', y + (sl.cy + 100) * k], [7, 'CONTROLS', 'edition pill · previous · pause · next', y + 40]];
    parts.forEach(([t0, h, d, yy]) => { s += G(eo(seg(t, t0, t0 + .5)), T(RX, yy, h, 'kvt') + T(RX, yy + 32, d, 'krule') + Ln(RX - 50, yy - 6, RX - 10, yy - 6, 'kcl')); });
    return G(a, s);
  },

  /* B · sizes */
  B(t) {
    const lt = t - CH[1]; const a = win(lt, 0, CH[2] - CH[1] + .1, .4, .5); if (a <= 0) return '';
    const phone = lt > 6, W = phone ? 358 : 632, k = phone ? 1.45 : 1.15, x = phone ? 560 : 960 - W * k / 2 - 140, y = 190;
    const pa = phone ? win(lt, 6, 12.2, .4, .5) : win(lt, 0, 6.1, .2, .4);
    const sl = slideG(x, y, W, k, { ctl: true, phone, lines: phone ? 3 : 2, label: 'PHOTO' });
    let s = sl.s; const X = v => x + v * k, Y = v => y + v * k;
    const t0 = phone ? 6.6 : .6;
    s += G(eo(seg(lt, t0, t0 + .5)), DV(Y(0), Y(sl.ph), X(0) - 34, 'H1 = W × 0.6', 'l'));
    s += G(eo(seg(lt, t0 + .7, t0 + 1.2)), DV(Y(sl.cy), Y(sl.ph), X(W) + 34, 'O1 ' + sl.ov));
    s += G(eo(seg(lt, t0 + 1.4, t0 + 1.9)), DV(Y(sl.cy), Y(sl.cy + sl.ch), X(W) + 130, 'H2 ' + sl.ch));
    s += G(eo(seg(lt, t0 + 2.1, t0 + 2.6)), DH(X(0), X(sl.mx), Y(sl.cy + sl.ch) + 30, 'M1 ' + sl.mx));
    s += G(eo(seg(lt, t0 + 2.8, t0 + 3.3)), phone ? DH(X(W - 64), X(W - 20), Y(0) - 24, 'Z2 44') : DH(X(W - 20 - 96), X(W - 20), Y(0) - 24, '3 × 28 · GAP 6'));
    return G(a * pa, s);
  },

  /* C · track, autoplay, loop */
  C(t) {
    const lt = t - CH[2]; const a = win(lt, 0, CH[3] - CH[2] + .1, .4, .5); if (a <= 0) return '';
    const W = 632, k = .62, x = 960 - W * k / 2, y = 250;
    // steps at 5, 7.5, 10 (compressed autoplay), loop at 10 from 5 → clone 1 → snap
    const steps = [[2.4, 1, 2], [4.4, 2, 3], [6.4, 3, 4], [8.4, 4, 5], [9.4, 5, 6]];
    let p = 1; steps.forEach(([ts, f, to]) => { if (lt >= ts) p = lerp(f, to, EASE(seg(lt, ts, ts + .3))); });
    let snapped = false; if (lt >= 10.6) { p = 1; snapped = true; }
    // the whole strip, small, with the window
    const sk = .2, SX = 960 - 3.5 * W * sk, SY = 760;
    let s = '';
    for (let v = 0; v < 7; v++) s += Rc(SX + v * W * sk, SY, W * sk - 6, 571 * sk, v === 0 || v === 6 ? 'kslot' : 'kobj', rx(4)) + T(SX + v * W * sk + W * sk / 2 - 3, SY + 571 * sk / 2, v === 0 ? 'CLONE 5' : v === 6 ? 'CLONE 1' : 'STORY ' + v, 'ksl', 'text-anchor="middle"') + T(SX + v * W * sk + W * sk / 2 - 3, SY + 571 * sk + 22, 'INDEX ' + v, 'ksl', 'text-anchor="middle"');
    s += Rc(SX + p * W * sk - 6, SY - 6, W * sk + 6, 571 * sk + 12, 'kframe2', rx(6));
    if (lt > 10.2 && lt < 11.6) s += G(win(lt, 10.2, 11.6, .1, .3), T(960, SY - 24, 'SNAP · NO TRANSITION', 'kvt', 'text-anchor="middle"'));
    // main view
    s += strip(x, y, W, k, p, p, { lines: 2 });
    // timer ring
    const nextT = steps.find(st => st[0] > lt), prevT = [...steps].reverse().find(st => st[0] <= lt);
    if (lt > 1 && lt < 9.4) { const span = nextT ? nextT[0] - (prevT ? prevT[0] : 1) : 1, fr = nextT ? clamp01((lt - (prevT ? prevT[0] : 1)) / span) : 1, r = 26, cx = x + W * k + 90, cy = y + 60;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" class="kthin"/>` + `<path d="M${cx},${cy - r} A${r},${r} 0 ${fr > .5 ? 1 : 0},1 ${f1(cx + r * Math.sin(fr * 6.283))},${f1(cy - r * Math.cos(fr * 6.283))}" class="kthick"/>` + T(cx + 44, cy + 6, '6.5 S (SHOWN FASTER)', 'kdts'); }
    return G(a, s);
  },

  /* D · parallax slowed down */
  D(t) {
    const lt = t - CH[3]; const a = win(lt, 0, CH[4] - CH[3] + .1, .4, .5); if (a <= 0) return '';
    const W = 632, k = .95, x = 960 - W * k / 2 - 120, y = 210, slow = 10;
    const ms = clamp01((lt - 1.2) / 3) * 300 + (lt > 6.4 ? clamp01((lt - 6.4) / 3) * 300 : 0), stepN = lt > 6.4 ? 1 : 0, local = lt > 6.4 ? clamp01((lt - 6.4) / 3) * 300 : ms;
    const base = 1 + stepN, pTrack = base + EASE(local / 300) * (lt > 1.2 ? 1 : 0) - (lt > 6.4 ? 0 : 0);
    const pPhoto = base + EASE(clamp01((local - 16) / 284)) * (lt > 1.2 ? 1 : 0);
    let s = strip(x, y, W, k, Math.min(pTrack, 3), Math.min(pPhoto, 3), { lines: 2, ctl: false });
    // graph
    const GX = x + W * k + 50, GY = 300, GW = 300, GH = 200, V = m => GX + m / 300 * GW, P = q => GY + GH - q * GH;
    s += Rc(GX, GY, GW, GH, 'kthin');
    let p1 = '', p2 = ''; for (let m = 0; m <= Math.min(local, 300); m += 5) { p1 += V(m) + ',' + P(EASE(m / 300)) + ' '; p2 += V(m) + ',' + P(EASE(clamp01((m - 16) / 284))) + ' '; }
    if (lt > 1.2) s += `<polyline points="${p1}" class="kthick" fill="none"/>` + `<polyline points="${p2}" class="kcl" fill="none" stroke-width="3"/>`;
    s += T(GX, GY + GH + 30, 'TRACK + CARD 0 → 300 MS', 'kdts') + T(GX, GY + GH + 56, 'PHOTO 16 → 300 MS (DASHED)', 'kdts') + T(GX, GY - 16, Math.round(local) + ' MS', 'kvt');
    s += G(eo(seg(lt, 6, 6.6)), T(GX, GY + GH + 110, 'PHOTO SHIFT = 8% OF W, OPPOSITE', 'krule') + T(GX, GY + GH + 142, 'CARD SHIFT = 10 PX, AHEAD', 'krule'));
    return G(a, s);
  },

  /* E · swipe */
  E(t) {
    const lt = t - CH[4]; const a = win(lt, 0, CH[5] - CH[4] + .1, .4, .5); if (a <= 0) return '';
    const W = 358, k = 1.35, x = 560, y = 200, th = Math.min(64, W * .14), cap = W * .24;
    let drag = 0, p = 1;
    // try 1: short drag 30 → spring back (1–3.4); try 2: long drag 90 → advance (5–8)
    if (lt > 1 && lt < 2.6) drag = -30 * eo(seg(lt, 1, 2)); else if (lt >= 2.6 && lt < 3.2) drag = -30 * (1 - EASE(seg(lt, 2.6, 2.9)));
    if (lt > 5 && lt < 6.6) drag = -Math.min(cap, 110 * eo(seg(lt, 5, 6.4)));
    if (lt >= 6.6) { const q = EASE(seg(lt, 6.6, 6.9)); p = 1 + q * (1 + 0) ; drag = -cap * (1 - q) * 0; p = lerp(1 - (-cap / W) * 0 + cap / W * 0, 2, q); }
    const pv = p - drag / W;
    let s = strip(x, y, W, k, pv, pv, { phone: true, lines: 3, drag });
    const fx = x + W * k / 2 + drag * k * (lt < 6.6 ? 1 : 0), fy = y + 150 * k;
    s += G((lt > .8 && lt < 3.2) || (lt > 4.8 && lt < 6.8) ? 1 : 0, `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="22" class="kring"/>` + `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="9" class="kfill" opacity=".5"/>`);
    // threshold markers
    const mx = x + W * k / 2; s += Ln(mx, y - 20, mx, y + 380 * k, 'kcl') + Ln(mx - th * k, y - 20, mx - th * k, y + 380 * k, 'kthick') + T(mx - th * k - 8, y - 28, 'T1 = MIN(64, .14 W) = ' + Math.round(th), 'kdts', 'text-anchor="end"');
    s += Ln(mx - cap * k, y + 380 * k, mx - cap * k, y + 405 * k, 'kthick') + T(mx - cap * k - 8, y + 420 * k, 'CAP .24 W', 'kdts', 'text-anchor="end"');
    const RX = x + W * k + 60;
    s += G(eo(seg(lt, 2.4, 2.9)), T(RX, 320, '30 PX · SPRINGS BACK', 'kvt'));
    s += G(eo(seg(lt, 6.6, 7.1)), T(RX, 380, 'PAST T1 · NEXT STORY', 'kvt'));
    s += G(eo(seg(lt, 9, 9.5)), T(RX, 470, 'TRACKPAD', 'kvt') + T(RX, 504, 'Σ horizontal delta ≥ 55', 'krule') + T(RX, 536, 'then locked 520 ms', 'krule') + T(RX, 568, 'reset after a 180 ms gap', 'krule'));
    s += G(eo(seg(lt, 10.4, 10.9)), T(RX, 640, 'TODAY’S PICKS ONLY', 'kvt') + T(RX, 674, 'Other editions have no swipe', 'krule'));
    return G(a, s);
  },

  /* F · what pauses */
  F(t) {
    const lt = t - CH[5]; const a = win(lt, 0, CH[6] - CH[5] + .1, .4, .5); if (a <= 0) return '';
    const W = 632, k = .9, x = 260, y = 220;
    const paused = lt > 1 && lt < 3.4 || lt > 4.4;
    let s = slideG(x, y, W, k, { ctl: true, lines: 2, paused: lt > 8.4 }).s;
    // hover pointer then tab focus
    s += ptr(x + 300 * k, y + 180 * k, win(lt, .6, 3.4, .3, .3));
    if (lt > 4.4 && lt < 8.2) s += focusRing(x, y, W * k, (632 * .6 - 48 + 240) * k, 8, 1);
    if (lt > 8.2) s += focusRing(x + (W - 20 - 28 - 34) * k, y + 20 * k, 28 * k, 28 * k, 14, win(lt, 8.2, 12, .2, .3));
    const RX = x + W * k + 80, rows = [['HOVER', 'paused while the pointer is over it', .8], ['DRAG', 'paused while a finger is down', 2], ['FOCUS', 'paused when focus enters, and it stays paused', 4.4], ['PAUSE BUTTON', 'toggles pause / resume; focusing it does not pause', 8.2], ['REDUCED MOTION', 'never rotates; the button is disabled', 10]];
    rows.forEach(([h, d, t0], i) => { s += G(eo(seg(lt, t0, t0 + .5)), T(RX, 300 + i * 100, h, 'kvt') + T(RX, 334 + i * 100, d, 'krule')); });
    s += T(RX, 260, paused ? 'AUTOPLAY · PAUSED' : 'AUTOPLAY · PLAYING', 'kdts');
    return G(a, s);
  },

  /* G · focus order */
  G2(t) {
    const lt = t - CH[6]; const a = win(lt, 0, CH[7] - CH[6] + .1, .4, .5); if (a <= 0) return '';
    const W = 632, k = .9, x = 260, y = 220, ph = W * .6, cy = ph - 48;
    let s = slideG(x, y, W, k, { ctl: true, lines: 2, paused: true }).s;
    const seq = [[0, 0, W, ph - 48 + 240, 8, 'OPEN STORY · THE WHOLE SLIDE'], [42 + 28 + 30, cy + 12, 50, 32, 4, 'COMMENTS'], [W - 20 - 96, 20, 28, 28, 14, 'PREVIOUS'], [W - 20 - 62, 20, 28, 28, 14, 'PAUSE / RESUME'], [W - 48, 20, 28, 28, 14, 'NEXT']];
    const fi = Math.min(seq.length - 1, Math.max(0, Math.floor((lt - .8) / 1)));
    if (lt > .8) { const f = seq[fi]; s += focusRing(x + f[0] * k, y + f[1] * k, f[2] * k, f[3] * k, f[4], 1); }
    s += key(x + W * k + 80, 260, 'TAB', win(lt, .8, 5.6, .2, .2));
    seq.forEach((f, i) => { s += G(lt > .8 + i ? 1 : .25, T(x + W * k + 80, 360 + i * 40, (i + 1) + ' · ' + f[5], i === fi ? 'kvt' : 'kdts')); });
    s += G(eo(seg(lt, 5.4, 6)), Rc(x - 40, y + 640 * k * .0 + 600, W * k + 80, 120, 'kslot') + T(x + W * k / 2, y + 650, 'OTHER SLIDES · ARIA-HIDDEN · INERT', 'kvt', 'text-anchor="middle"') + T(x + W * k / 2, y + 684, 'Live region: “Story 2 of 5: …”, polite when paused', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* H · list layout */
  H(t) {
    const lt = t - CH[7]; const a = win(lt, 0, CH[8] - CH[7] + .1, .4, .5); if (a <= 0) return '';
    let s = ''; const k = 1.6;
    const row = (x, y, w, h, pw, lbl) => Rc(x, y, w * k, h * k, 'kobj', rx(8 * k)) + Rc(x, y, pw * k, h * k, 'kwell', rx(8 * k)) + Rc(x + (pw + 16) * k, y + 48 * k, (w - pw - 32) * .5 * k, 14 * k, 'khug') + [0, 1, 2].map(i => Rc(x + (pw + 16) * k, y + (76 + i * 26) * k, (w - pw - 32) * (i === 2 ? .6 : 1) * k, 18 * k, 'kslot')).join('') + T(x + w * k / 2, y + h * k + 36, lbl, 'kdts', 'text-anchor="middle"');
    s += G(eo(seg(lt, .4, 1)), row(180, 300, 358, 184, 112, 'BASE · 112 | 1FR · 184 TALL'));
    s += G(eo(seg(lt, 2, 2.6)), row(840, 270, 560, 220, 560 * .38, 'SM+ · 38% | 1FR · 220 TALL'));
    s += G(eo(seg(lt, 3.4, 4)), T(960, 840, 'Card surface, no photo overlap · headline T3, clamp 3 · controls move beside the photo', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* I · finding */
  I(t) {
    const lt = t - CH[8]; const a = win(lt, 0, CH[9] - CH[8] + .1, .4, .5); if (a <= 0) return '';
    const W = 358, k = 1.25, x = 420, y = 200, ph = W * .6;
    let s = slideG(x, y, W, k, { ctl: true, phone: true, lines: 0, noSummary: true }).s;
    const cy = ph - 40, hx = 6 + 20, hw = W * .333 - 10;
    const grow = eo(seg(lt, .8, 2.6));
    for (let i = 0; i < 8; i++) { const yy = cy + 48 + i * 28; if (i > grow * 8) break; s += Rc(x + hx * k, y + yy * k, hw * (i % 3 === 2 ? .7 : 1) * k, 20 * k, 'kchip'); }
    s += G(eo(seg(lt, 2.8, 3.4)), Rc(x + 6 * k, y + (cy + 224) * k, (W - 12) * k, 48 * k, 'kfocus') + T(x + W * k / 2, y + (cy + 224 + 30) * k, 'OVERFLOW · 272 IN A 224 CARD', 'kdt', 'text-anchor="middle"'));
    s += G(eo(seg(lt, 1.2, 1.8)), DH(x + hx * k, x + (hx + hw) * k, y + cy * k - 16, '102 · 33% CAP'));
    const RX = x + W * k + 100;
    s += G(eo(seg(lt, 3.6, 4.2)), T(RX, 360, 'WHY', 'kvt') + T(RX, 394, 'The 33% cap was for text over the photo.', 'krule') + T(RX, 426, 'Now the text sits in its own card.', 'krule'));
    s += G(eo(seg(lt, 5, 5.6)), T(RX, 500, 'FIX', 'kvt') + T(RX, 534, 'Drop the cap (or apply it from 1024 only)', 'krule') + T(RX, 566, 'and keep line-clamp 3 everywhere.', 'krule'));
    return G(a, s);
  },

  /* J · sheet tour */
  J(t) {
    const lt = t - CH[9]; const a = win(lt, 0, CH[10] - CH[9] + .5, .5, .8); if (a <= 0) return '';
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
    this.live.innerHTML = [this.A(t), this.B(t), this.C(t), this.D(t), this.E(t), this.F(t), this.G2(t), this.H(t), this.I(t), this.J(t)].join('');
  },
});
