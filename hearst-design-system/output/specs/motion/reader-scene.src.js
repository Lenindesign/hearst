// Content reader (HP-READ-001 · Rev A) → motion film, ~126 s: how the Hearst+ story reader is built and how it behaves.
// Pure function of time. Geometry measured in the running app (2026-11-11, viewports 390–1440);
// build-reader-scene.mjs embeds the two drawing sheets for the closing tour.
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
const INSET = vw => vw < 640 ? 0 : 24;
const SHELLW = vw => Math.min(vw - 2 * INSET(vw), 1360);
const ROWH = vw => vw < 640 ? 69 : 64, FILTH = 46, MASTH = vw => ROWH(vw) + FILTH + 1;
const PADX = vw => vw < 768 ? 16 : vw < 1280 ? 24 : 48, PADY = 24;
const APAD = vw => vw < 640 ? 20 : 28;
const Z = vw => vw < 640 ? 44 : 28;
const cols = vw => {
  const iw = SHELLW(vw) - 2 * PADX(vw), rail = vw >= 1280, ad = vw >= 1024;
  const mid = rail ? iw - 316 : iw, art = ad ? mid - 316 : mid;
  return { iw, rail, ad, art, x0: PADX(vw), ax: PADX(vw) + (rail ? 316 : 0) };
};
const headLH = vw => vw < 768 ? 36 : 52;
/* one story, laid out in shell coordinates from top ty; returns parts and height */
function storyBox(vw, ty, n) {
  const c = cols(vw), p = APAD(vw), iw = c.art - 2 * p, ih = iw * 9 / 16, cw = Math.min(iw, 768), cx = c.ax + p + (iw - cw) / 2;
  const kY = ty + p + ih + 24, hY = kY + 28, bY = hY + 2 * headLH(vw) + 24, barH = vw < 640 ? 146 : 54, bodyY = bY + barH + 24;
  const bodyH = 1500 + (n % 2) * 300, comY = bodyY + bodyH + 32, h = comY + 260 + p - ty;
  return { c, p, iw, ih, cw, cx, ty, kY, hY, bY, barH, bodyY, bodyH, comY, h };
}
const UPNEXT = 96;
/* reader drawn at viewport (vw, vh), scale k, origin (x, y)
   o: { scroll, scrim (0..1), open (0..1 shell grow), stories (count), focus: [x,y,w,h,r] in shell px, active, labels } */
function reader(x, y, vw, vh, k, o) {
  o = o || {}; const s = o.scroll || 0, op1 = o.open == null ? 1 : o.open;
  const id = 'kc' + (CLIP++), X = px => x + px * k, Y = py => y + py * k;
  const ins = INSET(vw), sw = SHELLW(vw), sx = (vw - sw) / 2, sy = ins, sh = vh - 2 * ins;
  let q = '';
  // page behind + scrim
  q += Rc(X(0), Y(0), vw * k, vh * k, 'kwell');
  for (let i = 0; i < 6; i++) q += Rc(X(24 + (i % 3) * (vw - 48) / 3 + 8), Y(40 + Math.floor(i / 3) * 300), ((vw - 48) / 3 - 16) * k, 260 * k, 'kcard', rx(8 * k));
  q += Rc(X(0), Y(0), vw * k, vh * k, 'kscrim', op(.55 * (o.scrim == null ? 1 : o.scrim)));
  if (op1 > 0) {
    const g = lerp(.94, 1, eo(op1)), gw = sw * g, gh = sh * g, gx = sx + (sw - gw) / 2, gy = sy + (sh - gh) / 2;
    const sid = 'ks' + (CLIP++), SX = px => X(gx) + px * k * g, SY = py => Y(gy) + py * k * g, kk = k * g;
    let c = '';
    c += Rc(SX(0), SY(0), gw * k, gh * k, 'kshell');
    const n = o.stories || 1; let ty = MASTH(vw) + PADY - s; const boxes = [];
    for (let i = 0; i < n; i++) { const b = storyBox(vw, ty, i); boxes.push(b); ty += b.h + UPNEXT; }
    const C = boxes[0].c;
    boxes.forEach((b, i) => {
      if (i > 0) { const uy = b.ty - UPNEXT / 2; c += Ln(SX(C.ax), SY(uy), SX(C.ax + C.art / 2 - 50), SY(uy), 'kthin') + Ln(SX(C.ax + C.art / 2 + 50), SY(uy), SX(C.ax + C.art), SY(uy), 'kthin') + T(SX(C.ax + C.art / 2), SY(uy) + 5, 'UP NEXT', 'ksl', 'text-anchor="middle"'); }
      if (b.ty > sh + 200 || b.ty + b.h < -200) return;
      c += Rc(SX(C.ax), SY(b.ty), C.art * kk, b.h * kk, 'kobj', rx(8 * kk));
      c += Rc(SX(C.ax + b.p), SY(b.ty + b.p), b.iw * kk, b.ih * kk, 'kwell', rx(4 * kk)) + `<path d="M${f1(SX(C.ax + b.p))},${f1(SY(b.ty + b.p))} l${f1(b.iw * kk)},${f1(b.ih * kk)} m0,${f1(-b.ih * kk)} l${f1(-b.iw * kk)},${f1(b.ih * kk)}" class="kph"/>`;
      c += Rc(SX(b.cx), SY(b.kY), 110 * kk, 14 * kk, 'khug') + Rc(SX(b.cx), SY(b.hY), b.cw * .92 * kk, (headLH(vw) - 8) * kk, 'khug') + Rc(SX(b.cx), SY(b.hY + headLH(vw)), b.cw * .6 * kk, (headLH(vw) - 8) * kk, 'khug');
      c += Ln(SX(b.cx), SY(b.bY), SX(b.cx + b.cw), SY(b.bY), 'kthin') + Ln(SX(b.cx), SY(b.bY + b.barH), SX(b.cx + b.cw), SY(b.bY + b.barH), 'kthin');
      for (let j = 0; j < 3; j++) { const zz = Z(vw), bx = b.cx + b.cw - (3 - j) * (zz + 8) + 8; c += `<circle cx="${f1(SX(bx + zz / 2))}" cy="${f1(SY(b.bY + b.barH - 13 - zz / 2 + (vw < 640 ? -10 : 0)))}" r="${f1(zz / 2 * kk)}" class="kctl"/>`; }
      for (let yy = b.bodyY; yy < b.bodyY + b.bodyH; yy += 28) { if (yy - s * 0 > sh + 400) break; const para = Math.floor((yy - b.bodyY) / 196); if (((yy - b.bodyY) % 196) >= 168) continue; c += Rc(SX(b.cx), SY(yy + 8), b.cw * ((yy / 28) % 7 === 6 ? .55 : 1) * kk, 10 * kk, 'kbar'); }
      c += Rc(SX(b.cx), SY(b.comY), b.cw * kk, 260 * kk, 'kwell', rx(8 * kk)) + T(SX(b.cx + b.cw / 2), SY(b.comY + 130), 'COMMENTS', 'ksl', 'text-anchor="middle"');
      b.sx = SX; b.sy = SY;
    });
    // rails (sticky 128 inside the scroller)
    const top0 = MASTH(vw) + PADY, rt = Math.max(top0 - s, 128);
    if (C.rail) { [[0, 577, 'TRENDING'], [593, 395, 'SAVED · SUGGESTED']].forEach(([o2, h, l]) => { c += Rc(SX(C.x0), SY(rt + o2), 296 * kk, h * kk, 'kobj', rx(8 * kk)) + T(SX(C.x0 + 148), SY(rt + o2 + 24), l, 'ksl', 'text-anchor="middle"'); for (let j = 0; j < 4 && !o2; j++) c += Rc(SX(C.x0 + 16), SY(rt + 48 + j * 110), 72 * kk, 72 * kk, 'kwell', rx(4 * kk)) + Rc(SX(C.x0 + 100), SY(rt + 52 + j * 110), 170 * kk, 12 * kk, 'kbar'); }); }
    if (C.ad) { const ax = C.ax + C.art + 16; c += Rc(SX(ax), SY(rt), 300 * kk, 600 * kk, 'kobj', rx(8 * kk)) + Rc(SX(ax), SY(rt), 300 * kk, 268 * kk, 'kwell') + T(SX(ax + 150), SY(rt + 140), 'AD', 'ksl', 'text-anchor="middle"') + Rc(SX(ax + 24), SY(rt + 300), 200 * kk, 16 * kk, 'khug') + Rc(SX(ax + 24), SY(rt + 520), 252 * kk, 40 * kk, 'khug', rx(4 * kk)); }
    // masthead (sticky top 0)
    const rh = ROWH(vw), zz = Z(vw);
    c += Rc(SX(0), SY(0), sw * kk, MASTH(vw) * kk, 'kobj') + Ln(SX(0), SY(rh), SX(sw), SY(rh), 'kthin');
    const lp = vw < 640 ? 16 : 24;
    c += Rc(SX(lp), SY((rh - 28) / 2), Math.min(230, sw * .4) * kk, 28 * kk, 'kslot') + T(SX(lp + Math.min(230, sw * .4) / 2), SY(rh / 2) + 4, 'LOGO', 'ksl', 'text-anchor="middle"');
    if (vw >= 1024) c += Rc(SX(sw / 2 + 20), SY((rh - 26) / 2), (sw / 2 - lp - zz - 40) * .7 * kk, 26 * kk, 'kslot') + T(SX(sw / 2 + 20 + (sw / 2 - lp - zz - 40) * .35), SY(rh / 2) + 4, 'DESTINATIONS', 'ksl', 'text-anchor="middle"');
    const clx = sw - lp - zz, cly = vw < 640 ? 12 : (rh - zz) / 2;
    c += `<circle cx="${f1(SX(clx + zz / 2))}" cy="${f1(SY(cly + zz / 2))}" r="${f1(zz / 2 * kk)}" class="kctl"/>` + Ln(SX(clx + zz / 2 - 5), SY(cly + zz / 2 - 5), SX(clx + zz / 2 + 5), SY(cly + zz / 2 + 5), 'kthin') + Ln(SX(clx + zz / 2 + 5), SY(cly + zz / 2 - 5), SX(clx + zz / 2 - 5), SY(cly + zz / 2 + 5), 'kthin');
    const fw = Math.min(582, sw - 2 * lp), fx = vw < 640 ? lp : (sw - fw) / 2;
    for (let j = 0; j < 8; j++) { const wj = [55, 53, 65, 37, 37, 75, 63, 29][j], xj = fx + [0, 79, 156, 246, 306, 367, 466, 553][j]; if (xj + wj > sw) break; c += Rc(SX(xj), SY(rh + 15), wj * kk, 14 * kk, j === (o.active || 0) ? 'khug' : 'kslot'); if (j === (o.active || 0)) c += Rc(SX(xj), SY(rh + FILTH - 3), wj * kk, 2 * kk, 'kfill'); }
    // back to top
    if (s > 320) { const bz = vw < 640 ? 44 : 28; c += G(eo(clamp01((s - 320) / 80)), `<circle cx="${f1(SX(sw - 32 - bz / 2))}" cy="${f1(SY(sh - 32 - bz / 2))}" r="${f1(bz / 2 * kk)}" class="kctl"/>` + T(SX(sw - 32 - bz / 2), SY(sh - 32 - bz / 2) + 5, '↑', 'kdt', 'text-anchor="middle"')); }
    if (o.focus) { const f = o.focus; c += focusRing(SX(f[0]), SY(f[1]), f[2] * kk, f[3] * kk, f[4] || 0, 1); }
    if (o.over) c += o.over(SX, SY, kk, boxes, { sw, sh, clx, cly, zz });
    o.geo = { SX, SY, kk, sw, sh, sx: gx, sy: gy, boxes, clx, cly, zz, rh };
    q += G(eo(clamp01(op1 * 1.6)), `<clipPath id="${sid}"><rect x="${f1(SX(0))}" y="${f1(SY(0))}" width="${f1(gw * k)}" height="${f1(gh * k)}" ${rx(8 * kk * (ins ? 1 : 0))}/></clipPath><g clip-path="url(#${sid})">${c}</g>` + Rc(SX(0), SY(0), gw * k, gh * k, 'kframe2', rx(8 * kk * (ins ? 1 : 0))));
  }
  return `<clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(vw * k)}" height="${f1(vh * k)}"/></clipPath><g clip-path="url(#${id})">${q}</g>` + Rc(x, y, vw * k, vh * k, 'kframe');
}
let CLIP = 0;

/* ---------- chapters ---------- */
const CH = [0, 10, 22, 34, 50, 64, 78, 94, 106, 114, 126];
const END = CH[CH.length - 1];
const CAPS = [
  [0, 'THE READER', 'Open any story and it reads in place: a modal shell over the page you came from.'],
  [5, 'THE READER', 'One dialog named Story reader. The page behind is dimmed, blurred and made inert.'],
  [10, 'THE SHELL', 'Phones: full screen, no radius. From 640: 24 px inside the viewport with an 8 px radius.'],
  [16, 'THE SHELL · 1360 MAX', 'Past 1408 the shell stops at 1360 and centers. The shell itself is the scroll container.'],
  [22, 'MASTHEAD · STICKY', 'Two rows that stay on top: logo, destinations and Close (64), then topic filters (46).'],
  [28, 'MASTHEAD · PHONE', 'Below 640 the row grows to 69 so Close can be a 44 px target. Filters scroll sideways.'],
  [34, 'COLUMNS', 'One article column on phones and tablets. The 300 ad rail joins at 1024, the context rail at 1280.'],
  [42, 'COLUMNS · WATCH THE ARTICLE', 'Each rail takes 316 px. At 1280 the article is 504 wide, its narrowest above 640.'],
  [50, 'ARTICLE', 'A bordered card: 16:9 lead media, kicker, headline, action bar, body, comments.'],
  [57, 'ARTICLE · TEXT COLUMN', 'Text stops at 768 and centers in the card. Body 18 / 28 with 24 between paragraphs.'],
  [64, 'SCROLLING', 'The masthead sticks to the top. Both rails stick 128 px down and follow the story.'],
  [71, 'BACK TO TOP', 'After 320 px of scroll a round Back to top button appears 32 px from the corner.'],
  [78, 'THE STORY QUEUE', 'The reader starts with one story. When the end is within 600 px, the next one mounts below.'],
  [84, 'ACTIVE STORY', 'The story under the reading anchor, 45% down (420 max), becomes active and sets the URL.'],
  [89, 'ACTIVE STORY · CONTEXT', 'The context rail and the ad follow the active story. The address bar is replaced, not pushed.'],
  [94, 'FOCUS', 'On open, focus moves to Close. Tab and Shift+Tab wrap inside the shell.'],
  [100, 'CLOSING', 'Escape, the scrim or Close shuts it. Focus returns to the card that opened it.'],
  [106, 'LAYERS', 'Nested gallery, back to top, masthead, rails, stories, shell, click catcher, scrim, page.'],
  [114, 'THE DRAWING · SHEET 1', 'Structure: plans at 1440 and 390, columns per breakpoint, details and variable tables.'],
  [120, 'THE DRAWING · SHEET 2', 'Logic: viewport placement, layers, story queue, active-story rules, focus and thresholds.'],
];

kit.scene('reader', {
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
      '.kn .kkey{fill:#fff;stroke:#111;stroke-width:1.6}.kn .kkt{font-size:17px;font-weight:700;fill:#111;letter-spacing:.06em}.kn .kshell{fill:#f6f6f6;stroke:none}.kn .kcl{stroke:#999;stroke-width:1;stroke-dasharray:16 4 3 4}');
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
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-READ-001 · CONTENT READER', 'kcap', 'text-anchor="end"');
  },

  /* A · open */
  A(t) {
    const a = win(t, 0, CH[1] + .1, .3, .5); if (a <= 0) return '';
    const vw = 1440, vh = 900, k = .82, x = (1920 - vw * k) / 2, y = 190;
    const open = eio(seg(t, 2.2, 3.2));
    let s = reader(x, y, vw, vh, k, { scrim: open, open, focus: null });
    // pointer on a card before opening
    const cx = x + (24 + (vw - 48) / 3 + 8 + 120) * k, cy = y + 160 * k;
    s += ptr(cx, cy, win(t, .4, 2.6, .3, .3), clamp01((t - 1.6) / .4));
    if (t < 2.2) s += focusRing(x + (24 + (vw - 48) / 3 + 8) * k, y + 40 * k, ((vw - 48) / 3 - 16) * k, 260 * k, 8, win(t, .8, 2.3, .2, .2));
    s += G(eo(seg(t, 4, 4.6)), T(1700, 1010, 'SCRIM 55% + BLUR 8 · FIXED · Z 200', 'kdts', 'text-anchor="end"'));
    return G(a, s);
  },

  /* B · shell placement */
  B(t) {
    const lt = t - CH[1]; const a = win(lt, 0, CH[2] - CH[1] + .1, .4, .5); if (a <= 0) return '';
    const stops = [390, 390, 820, 1300, 1600, 1600], D = CH[2] - CH[1];
    const u = clamp01((lt - .6) / (D - 2)), n = stops.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), vw = lerp(stops[i], stops[i + 1], eio(f - i));
    const vh = 900, k = Math.min(.78, 1600 / vw), x = (1920 - vw * k) / 2, y = 190;
    let s = reader(x, y, vw, vh, k, {});
    const ins = INSET(vw), sw = SHELLW(vw), sx = (vw - sw) / 2;
    s += DH(x + sx * k, x + (sx + sw) * k, y - 24, 'SHELL ' + Math.round(sw) + (sw >= 1360 ? ' · MAX' : ''));
    if (ins) s += DV(y, y + ins * k, x + vw * k + 26, 'I1 24');
    s += T(960, 1040, Math.round(vw) + ' PX VIEWPORT · INSET ' + ins + ' · RADIUS ' + (ins ? 8 : 0), 'krule', 'text-anchor="middle"');
    return G(a, s);
  },

  /* C · masthead */
  C(t) {
    const lt = t - CH[2]; const a = win(lt, 0, CH[3] - CH[2] + .1, .4, .5); if (a <= 0) return '';
    const phone = lt > 6, vw = phone ? 390 : 1440, vh = phone ? 844 : 900, k = phone ? 1.45 : 1.15;
    const x = phone ? 600 : 960 - 720 * k, y = phone ? 190 : 260;
    const o = { active: 1 }; let s = '';
    const pa = phone ? win(lt, 6, 12.2, .4, .5) : win(lt, 0, 6.1, .2, .4);
    s += G(pa, reader(x, y, vw, phone ? 520 : 330, k, o));
    const g = o.geo; if (!g) return G(a, s);
    const SX = g.SX, SY = g.SY, kk = g.kk, rh = g.rh;
    if (!phone) {
      s += G(pa * eo(seg(lt, .8, 1.4)), DV(SY(0), SY(rh), SX(0) - 30, 'H1 64', 'l') + DV(SY(rh), SY(rh + FILTH), SX(0) - 30, 'H2 46', 'l'));
      s += G(pa * eo(seg(lt, 1.6, 2.2)), DH(SX(g.clx), SX(g.clx + g.zz), SY(0) - 22, 'Z1 28') + T(SX(g.clx + g.zz), y + 330 * k + 46, 'CLOSE · ROUND · FOCUSED ON OPEN', 'kdts', 'text-anchor="end"'));
      s += G(pa * eo(seg(lt, 2.6, 3.2)), T(SX(24), y + 330 * k + 46, 'LOGO 230 MAX · DESTINATIONS 1024+ · FILTERS CENTERED · ACTIVE 2 PX UNDERLINE', 'kdts'));
    } else {
      s += G(pa * eo(seg(lt, 6.8, 7.4)), DV(SY(0), SY(rh), SX(0) - 30, 'H1 69', 'l') + DH(SX(g.clx), SX(g.clx + g.zz), SY(0) - 22, 'Z1 44'));
      s += G(pa * eo(seg(lt, 7.8, 8.4)), T(1260, 420, 'FILTERS SCROLL SIDEWAYS', 'kvt') + T(1260, 456, 'Gutter 16 · no destinations row', 'krule') + T(1260, 492, 'Shell = the full viewport', 'krule'));
    }
    return G(a, s);
  },

  /* D · columns by breakpoint */
  D(t) {
    const lt = t - CH[3]; const a = win(lt, 0, CH[4] - CH[3] + .1, .4, .5); if (a <= 0) return '';
    const stops = [390, 700, 1000, 1030, 1270, 1290, 1440], D = CH[4] - CH[3];
    const u = clamp01((lt - .6) / (D - 3)), n = stops.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), vw = lerp(stops[i], stops[i + 1], eio(f - i));
    const vh = 900, k = Math.min(.72, 1500 / vw), x = (1920 - vw * k) / 2, y = 180;
    const o = {}; let s = reader(x, y, vw, vh, k, o);
    const c = cols(vw), g = o.geo;
    s += DH(g.SX(c.ax), g.SX(c.ax + c.art), y + vh * k + 30, 'A ' + Math.round(c.art));
    const RX = 300, RW = 1320, RY = 1010, V = v => RX + (v - 390) / (1440 - 390) * RW;
    s += Ln(RX, RY, RX + RW, RY, 'kthin');
    [[640, 'SM 640'], [768, 'MD 768'], [1024, 'LG 1024 · AD'], [1280, 'XL 1280 · RAIL']].forEach(([v, l], j) => { const on = vw >= v; s += Ln(V(v), RY - 10, V(v), RY + 10, on ? 'kthick' : 'kthin') + T(V(v), RY - 18, l, on ? 'kdt' : 'kdts', 'text-anchor="middle"'); });
    s += `<path d="M${f1(V(vw))},${RY + 14} l-9,16 h18 z" class="kfill"/>`;
    if (lt > 9) s += G(eo(seg(lt, 9, 9.6)), T(1820, 300, 'A AT 1024 = 612', 'kvt', 'text-anchor="end"') + T(1820, 336, 'A AT 1280 = 504', 'kvt', 'text-anchor="end"') + T(1820, 372, 'A AT 1440 = 632', 'kvt', 'text-anchor="end"'));
    return G(a, s);
  },

  /* E · article anatomy */
  E(t) {
    const lt = t - CH[4]; const a = win(lt, 0, CH[5] - CH[4] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1440, k = 1.05, b = storyBox(vw, 0, 0), x = 960 - (b.c.art / 2) * k - 200, y = 170 - (lt > 7 ? lerp(0, 380, eio(seg(lt, 7, 8.5))) * k : 0);
    const X = px => x + (px - b.c.ax) * k, Y = py => y + py * k;
    let s = `<clipPath id="kce"><rect x="0" y="160" width="1920" height="920"/></clipPath><g clip-path="url(#kce)">`;
    s += Rc(X(b.c.ax), Y(0), b.c.art * k, 1400 * k, 'kobj', rx(8 * k));
    s += G(eo(seg(lt, .3, .9)), Rc(X(b.c.ax + b.p), Y(b.p), b.iw * k, b.ih * k, 'kwell', rx(4 * k)) + T(X(b.c.ax + b.p + b.iw / 2), Y(b.p + b.ih / 2), 'LEAD MEDIA · 16:9 · R 4', 'ksl', 'text-anchor="middle"'));
    s += G(eo(seg(lt, 1.2, 1.8)), Rc(X(b.cx), Y(b.kY), 110 * k, 16 * k, 'khug') + T(X(b.cx + 120), Y(b.kY + 13), 'KICKER · BRAND · FOLLOW', 'ksl'));
    s += G(eo(seg(lt, 1.8, 2.4)), Rc(X(b.cx), Y(b.hY), b.cw * k, 104 * k, 'kslot') + T(X(b.cx + b.cw / 2), Y(b.hY + 58), 'HEADLINE · T1 48 / 52 · 32 / 36 BELOW 768', 'ksl', 'text-anchor="middle"'));
    s += G(eo(seg(lt, 2.6, 3.2)), Ln(X(b.cx), Y(b.bY), X(b.cx + b.cw), Y(b.bY), 'kthin') + Ln(X(b.cx), Y(b.bY + 54), X(b.cx + b.cw), Y(b.bY + 54), 'kthin') + Rc(X(b.cx), Y(b.bY + 12), 200 * k, 30 * k, 'kslot') + T(X(b.cx + 100), Y(b.bY + 32), 'BYLINE · FLEX', 'ksl', 'text-anchor="middle"') + [0, 1, 2].map(j => `<circle cx="${f1(X(b.cx + b.cw - (3 - j) * 36 + 22))}" cy="${f1(Y(b.bY + 27))}" r="${f1(14 * k)}" class="kctl"/>`).join(''));
    s += G(eo(seg(lt, 3.6, 4.2)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(j => Rc(X(b.cx), Y(b.bodyY + j * 28 + Math.floor(j / 3) * 24 + 8), b.cw * (j % 3 === 2 ? .6 : 1) * k, 10 * k, 'kbar')).join(''));
    // dims
    s += G(eo(seg(lt, .9, 1.4)), DH(X(b.c.ax), X(b.c.ax + b.p), Y(0) - 24, 'P 28') + DH(X(b.c.ax + b.p), X(b.c.ax + b.p + b.iw), Y(0) - 24, 'FILL ' + Math.round(b.iw)));
    s += G(eo(seg(lt, 1.4, 2)), DV(Y(b.p + b.ih), Y(b.kY), X(b.c.ax + b.c.art) + 30, 'S3 24') + DV(Y(b.kY + 16), Y(b.hY), X(b.c.ax + b.c.art) + 30, 'S4 12'));
    s += G(eo(seg(lt, 3, 3.5)), DV(Y(b.bY), Y(b.bY + 54), X(b.c.ax + b.c.art) + 30, 'H3 54 · PAD 12'));
    s += G(eo(seg(lt, 4.4, 5)), DV(Y(b.bodyY + 8 + 28 * 3 - 18), Y(b.bodyY + 8 + 28 * 3 + 6), X(b.c.ax + b.c.art) + 30, '24'));
    s += '</g>';
    const RX = 1420;
    s += G(eo(seg(lt, 5, 5.6)), T(RX, 320, 'CARD', 'kvt') + T(RX, 352, 'Border 1 · radius 8', 'krule') + T(RX, 382, 'Pad 28 · 20 on phones', 'krule'));
    s += G(eo(seg(lt, 7, 7.6)), T(RX, 460, 'TEXT COLUMN', 'kvt') + T(RX, 492, 'Max 768, centered', 'krule') + T(RX, 522, 'Body 18 / 28', 'krule') + T(RX, 552, 'Subheads 28 / 32 · 22 / 28', 'krule'));
    s += G(eo(seg(lt, 9.4, 10)), T(RX, 630, 'ACTIONS', 'kvt') + T(RX, 662, 'Ambient · save · comments', 'krule') + T(RX, 692, '28 round · 44 on phones', 'krule'));
    s += G(eo(seg(lt, 11, 11.6)), T(RX, 770, 'COMMENTS', 'kvt') + T(RX, 802, '32 below the body · pad 20', 'krule'));
    return G(a, s);
  },

  /* F · scrolling */
  F(t) {
    const lt = t - CH[5]; const a = win(lt, 0, CH[6] - CH[5] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1440, vh = 900, k = .82, x = (1920 - vw * k) / 2 - 80, y = 190;
    const sc = lerp(0, 1400, eio(seg(lt, .8, 6.5))) + lerp(0, 400, eio(seg(lt, 8, 11)));
    let s = reader(x, y, vw, vh, k, { scroll: sc });
    const RX = x + vw * k + 40;
    s += T(RX, 300, 'SCROLL', 'kdts') + T(RX, 336, Math.round(sc) + ' PX', 'kread');
    s += G(eo(seg(lt, 3, 3.6)), T(RX, 430, 'MASTHEAD', 'kvt') + T(RX, 462, 'sticky · top 0', 'krule'));
    s += G(eo(seg(lt, 4, 4.6)), T(RX, 530, 'RAILS', 'kvt') + T(RX, 562, 'sticky · top 128', 'krule'));
    s += G(clamp01((sc - 320) / 80), T(RX, 630, 'BACK TO TOP', 'kvt') + T(RX, 662, 'after 320', 'krule'));
    return G(a, s);
  },

  /* G · story queue */
  G2(t) {
    const lt = t - CH[6]; const a = win(lt, 0, CH[7] - CH[6] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1440, vh = 900, k = .28, b0 = storyBox(vw, 0, 0), b1 = storyBox(vw, 0, 1);
    const docH = MASTH(vw) + PADY + b0.h + UPNEXT + b1.h + UPNEXT + 2000;
    const sc = lerp(0, b0.h + UPNEXT + 400, eio(seg(lt, 1, 12)));
    const ends0 = MASTH(vw) + PADY + b0.h - sc; const n = ends0 - vh < 600 ? 2 : 1;
    const ends1 = ends0 + UPNEXT + b1.h; const n2 = n === 2 && ends1 - vh < 600 ? 3 : n;
    const x = 760, y = 160;
    // document strip on the left: whole queue, with the viewport window moving
    const dk = .085, DX = 220, DY = 180;
    let s = Rc(DX, DY, 300, 840, 'kwell');
    const by0 = DY + (MASTH(vw) + PADY) * dk; s += Rc(DX + 40, by0, 220, b0.h * dk, 'kobj', rx(4)) + T(DX + 150, by0 + 40, 'STORY 1', 'ksl', 'text-anchor="middle"');
    if (n >= 2) s += Rc(DX + 40, by0 + (b0.h + UPNEXT) * dk, 220, b1.h * dk, 'kobj', rx(4)) + T(DX + 150, by0 + (b0.h + UPNEXT) * dk + 40, 'STORY 2', 'ksl', 'text-anchor="middle"');
    if (n2 >= 3) s += Rc(DX + 40, by0 + (b0.h + b1.h + 2 * UPNEXT) * dk, 220, 120, 'kslot', rx(4)) + T(DX + 150, by0 + (b0.h + b1.h + 2 * UPNEXT) * dk + 40, 'STORY 3', 'ksl', 'text-anchor="middle"');
    s += Rc(DX - 10, DY + sc * dk, 320, vh * dk, 'kframe2');
    s += T(DX + 150, DY + 870, 'THE WHOLE QUEUE', 'kdts', 'text-anchor="middle"');
    // reader view
    const o = { scroll: sc, stories: n2 }; s += reader(x, y, vw, vh, .62, o);
    const g = o.geo, anc = Math.min(vh * .45, 420);
    s += Ln(x - 20, y + anc * .62, x + vw * .62 + 20, y + anc * .62, 'kthick') + T(x + vw * .62 + 28, y + anc * .62 + 6, 'READING ANCHOR', 'kdts');
    // which is active
    const act = (MASTH(vw) + PADY + b0.h - sc) < anc ? 2 : 1;
    s += T(x, y + vh * .62 + 60, 'ACTIVE · STORY ' + act, 'kvt') + T(x, y + vh * .62 + 96, '/read/' + (act === 1 ? 'story-one' : 'story-two') + '/', 'krule');
    s += G(n >= 2 ? 1 : 0, T(x + vw * .62, y + vh * .62 + 60, 'NEXT STORY MOUNTED · 600 EARLY', 'kdts', 'text-anchor="end"'));
    return G(a, s);
  },

  /* H · focus */
  H(t) {
    const lt = t - CH[7]; const a = win(lt, 0, CH[8] - CH[7] + .1, .4, .5); if (a <= 0) return '';
    const vw = 1440, vh = 900, k = .82, x = (1920 - vw * k) / 2 - 120, y = 190;
    const closed = lt > 8.2, open = closed ? 1 - eio(seg(lt, 8.2, 8.8)) : 1;
    const o = { scrim: open, open }; let s = reader(x, y, vw, vh, k, o);
    const g = o.geo;
    if (!closed && g) {
      const b = g.boxes[0], seq = [[g.clx, g.cly, g.zz, g.zz, g.zz / 2]];
      for (let j = 0; j < 3; j++) { const bx = b.cx + b.cw - (3 - j) * 36 + 8; seq.push([bx, b.bY + 13, 28, 28, 14]); }
      let fi = 0; if (lt > 2) fi = Math.floor((lt - 2) / .55) % (seq.length); 
      const f = seq[fi]; s += focusRing(g.SX(f[0]), g.SY(f[1]), f[2] * g.kk, f[3] * g.kk, f[4] * g.kk, lt > .6 ? 1 : 0);
    }
    if (closed) s += focusRing(x + (24 + (vw - 48) / 3 + 8) * k, y + 40 * k, ((vw - 48) / 3 - 16) * k, 260 * k, 8, win(lt, 8.8, 12.4, .3, .3));
    const RX = x + vw * k + 40;
    s += key(RX, 320, 'TAB', win(lt, 2, 7, .2, .2)) + key(RX + 90, 320, '⇧ TAB', win(lt, 4.2, 7, .2, .2)) + key(RX, 320, 'ESC', win(lt, 7.6, 9, .2, .2));
    s += G(eo(seg(lt, .6, 1.2)), T(RX, 440, 'Focus on Close', 'krule'));
    s += G(eo(seg(lt, 2.2, 2.8)), T(RX, 480, 'Tab wraps inside', 'krule'));
    s += G(eo(seg(lt, 8.8, 9.4)), T(RX, 560, 'Back to the opener', 'krule') + T(RX, 596, 'live → label → carousel', 'kdts') + T(RX, 624, 'retries 50 ms · 3 s', 'kdts'));
    return G(a, s);
  },

  /* I · layers */
  I(t) {
    const lt = t - CH[8]; const a = win(lt, 0, CH[9] - CH[8] + .1, .4, .5); if (a <= 0) return '';
    const L = [['NESTED GALLERY · AMBIENT', 'own dialog · reader pauses its keys'], ['BACK TO TOP', 'absolute · z 120 · after 320'], ['MASTHEAD', 'sticky · top 0 · z 110'], ['RAILS', 'sticky · top 128'], ['STORIES', 'scroll inside the shell'], ['SHELL', 'inset 0 · 24 from 640 · max 1360'], ['CLICK CATCHER', 'closes on click'], ['SCRIM', 'fixed · z 200 · 55% + blur 8'], ['PAGE', 'inert while open']];
    let s = '';
    L.forEach(([h, d], i) => {
      const j = L.length - 1 - i, e = eio(seg(lt, .3 + j * .32, 1 + j * .32)), yy = lerp(960, 200 + i * 86, e);
      const x = 360, w = 520, dx = 80, hh = 52;
      s += G(e, `<path d="M${x + dx},${f1(yy)} H${x + dx + w} L${x + w},${f1(yy + hh)} H${x} Z" class="${i === 8 ? 'kwell' : i === 0 ? 'khug' : 'kobj'}"/>` + Ln(x + dx + w + 10, yy + hh / 2, x + dx + w + 60, yy + hh / 2, 'kcl') + T(x + dx + w + 76, yy + hh / 2 - 2, h, 'kvt') + T(x + dx + w + 76, yy + hh / 2 + 26, d, 'krule'));
    });
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
