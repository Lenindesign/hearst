// Story card (HP-CARD-001 · Rev D) → long motion film, ~124 s.
// Pure function of time: render(t) rebuilds every live group from t alone.
// A 0–8 the card · B 8–20 anatomy · C 20–34 vertical rhythm · D 34–46 lines and height
// E 46–60 meta row · F 60–74 breakpoints · G 74–86 layers · H 86–96 shadow and radius
// I 96–106 states · J 106–116 in a row · K 116–126 sheet tour.
// Film classes are prefixed with k so the embedded sheet's own CSS never restyles them.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEET = __SHEET__;

/* ---------- helpers (markup strings) ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);
const T = (x, y, s, cls, ex) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls || 'kdt'}" ${ex || ''}>${esc(s)}</text>`;
const Rc = (x, y, w, h, cls, ex) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" class="${cls}" ${ex || ''}/>`;
const Ln = (x1, y1, x2, y2, cls, ex) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${ex || ''}/>`;
const op = a => `opacity="${clamp01(a).toFixed(3)}"`;
const G = (a, inner) => a <= 0.001 ? '' : `<g ${op(a)}>${inner}</g>`;
const drawn = p => `pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="${f1(1 - clamp01(p))}"`;
const win = (t, a, b, fi, fo) => Math.min(eo(seg(t, a, a + (fi || .5))), 1 - eo(seg(t, b - (fo || .5), b)));
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };
const keyed = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) { const [a, va] = K[i], [b, vb] = K[i + 1]; if (t <= b) return lerp(va, vb, eio(seg(t, a, b))); } return K[K.length - 1][1]; };
function DV(y1, y2, x, label, side, cls) {
  const small = y2 - y1 < 24, l = side === 'l';
  let s = small
    ? Ln(x, y1 - 12, x, y1, 'kdl', 'marker-end="url(#ka)"') + Ln(x, y2 + 12, x, y2, 'kdl', 'marker-end="url(#ka)"') + Ln(x, y1, x, y2, 'kdl')
    : Ln(x, y1, x, y2, 'kdl', 'marker-start="url(#ka)" marker-end="url(#ka)"');
  s += Ln(x - 7, y1, x + 7, y1, 'kext') + Ln(x - 7, y2, x + 7, y2, 'kext');
  return label ? s + T(l ? x - 14 : x + 14, (y1 + y2) / 2 + 6, label, cls || 'kdt', `text-anchor="${l ? 'end' : 'start'}"`) : s;
}
function DH(x1, x2, y, label, cls, below) {
  const small = x2 - x1 < 26;
  let s = small
    ? Ln(x1 - 12, y, x1, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x2 + 12, y, x2, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x1, y, x2, y, 'kdl')
    : Ln(x1, y, x2, y, 'kdl', 'marker-start="url(#ka)" marker-end="url(#ka)"');
  return s + Ln(x1, y - 7, x1, y + 7, 'kext') + Ln(x2, y - 7, x2, y + 7, 'kext') + (label ? T((x1 + x2) / 2, below ? y + 26 : y - 10, label, cls || 'kdt', 'text-anchor="middle"') : '');
}
const xbox = (x, y, w, h, cls) => Rc(x, y, w, h, cls || 'kthin') + `<path d="M${f1(x)},${f1(y)} L${f1(x + w)},${f1(y + h)} M${f1(x + w)},${f1(y)} L${f1(x)},${f1(y + h)}" class="kthin"/>`;
const topRound = (x, y, w, h, r) => `M${f1(x)},${f1(y + h)} L${f1(x)},${f1(y + r)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + r)},${f1(y)} L${f1(x + w - r)},${f1(y)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + w)},${f1(y + r)} L${f1(x + w)},${f1(y + h)} Z`;
const bookmark = (cx, cy, k, fill) => `<path d="M${f1(cx - 5 * k)},${f1(cy - 7 * k)} h${f1(10 * k)} v${f1(14 * k)} l${f1(-5 * k)},${f1(-4 * k)} l${f1(-5 * k)},${f1(4 * k)} z" class="${fill ? 'kfill' : 'kthin'}"/>`;
const leader = (px, py, ex, ey, l, sub, dir) => {
  const s = dir || (ex >= px ? 1 : -1);
  return `<circle cx="${f1(px)}" cy="${f1(py)}" r="3" class="kdot"/>` + `<polyline points="${f1(px)},${f1(py)} ${f1(ex)},${f1(ey)} ${f1(ex + s * 16)},${f1(ey)}" class="klead"/>` +
    T(ex + s * 24, ey + 6, l, 'kvt', `text-anchor="${s > 0 ? 'start' : 'end'}"`) + (sub ? T(ex + s * 24, ey + 30, sub, 'kdts', `text-anchor="${s > 0 ? 'start' : 'end'}"`) : '');
};

/* ---------- the card, as geometry (CSS px) ---------- */
// o: W, S1, meta, H5, n, H6, m (n and m may be fractional while they animate)
function geo(o) {
  const HM = o.W * 9 / 16; let y = HM + o.S1;
  const meta = { y, h: o.meta }; y += o.meta + 8;
  const head = { y, h: o.n * o.H5 }; y += head.h + 8;
  const sum = { y, h: o.m * o.H6 }; y += sum.h + o.S1;
  return { HM, meta, head, sum, H: y };
}
// v: opacity / progress per part (box, media, meta, head, sum, save, byline, lines)
function card(X0, Y0, k, o, v) {
  v = v || {}; const g = geo(o), W = o.W, P = o.S1, HMd = o.cut || g.HM;
  const X = x => X0 + x * k, Y = y => Y0 + (y <= g.HM ? y * HMd / g.HM : y - g.HM + HMd) * k;
  const vis = n => v[n] === undefined ? 1 : v[n];
  let s = '';
  if (vis('box') > 0) s += `<rect x="${f1(X(0))}" y="${f1(Y(0))}" width="${f1(W * k)}" height="${f1(Y(g.H) - Y0)}" rx="${f1(8 * k)}" class="kobj" ${drawn(vis('box'))}/>`;
  const brk = o.cut ? (() => { const yb = Y(g.HM / 2), zz = []; for (let x = 0; x <= W * k; x += 24) zz.push(f1(X0 + x) + ',' + f1(yb + ((x / 24) % 2 ? -6 : 6)));
    return `<rect x="${f1(X0 - 2)}" y="${f1(yb - 9)}" width="${f1(W * k + 4)}" height="18" fill="#fff"/><polyline points="${zz.join(' ')}" class="kthin" transform="translate(0,-9)"/><polyline points="${zz.join(' ')}" class="kthin" transform="translate(0,9)"/>` + T(X(W) - 12, yb + 5, 'BREAK · HM NOT TO SCALE', 'ksl', 'text-anchor="end"'); })() : '';
  s += G(vis('media'), `<path d="${topRound(X(0), Y(0), W * k, HMd * k, 8 * k)}" class="kwell"/>` +
    `<path d="M${f1(X(0))},${f1(Y(0))} L${f1(X(W))},${f1(Y(g.HM))} M${f1(X(W))},${f1(Y(0))} L${f1(X(0))},${f1(Y(g.HM))}" class="kph"/>` + Ln(X(0), Y(g.HM), X(W), Y(g.HM), 'kthin') + brk +
    (v.mediaLabel ? T(X(W / 2), Y(g.HM / 2) + 6, v.mediaLabel, 'ksl', 'text-anchor="middle"') : ''));
  // meta row: icon 16 · 6 · source (flex) · 8 · byline (hug) · save (Z2, end)
  {
    const cy = g.meta.y + g.meta.h / 2, iw = 16, save = o.save ? 32 : 0, rowW = W - 2 * P;
    const byW = o.byline === false || rowW < 320 ? 0 : 96, srcW = Math.max(30, rowW - iw - 6 - (byW ? byW + 8 : 0) - (save ? save + 8 : 0));
    let m = xbox(X(P), Y(cy - 8), iw * k, 16 * k) + Rc(X(P + 22), Y(cy - 8), srcW * k, 16 * k, 'kslot');
    if (srcW * k > 120) m += T(X(P + 22) + 8, Y(cy) + 5, 'SOURCE · FLEX', 'ksl');
    if (byW) m += G(vis('byline'), Rc(X(P + 22 + srcW + 8), Y(cy - 8), byW * k, 16 * k, 'kph') + (k > .5 ? T(X(P + 22 + srcW + 8 + byW / 2), Y(cy) + 5, 'BYLINE', 'ksl', 'text-anchor="middle"') : ''));
    if (save) { const sx = P + rowW - save; m += G(vis('save'), `<rect x="${f1(X(sx))}" y="${f1(Y(cy - 16))}" width="${f1(32 * k)}" height="${f1(32 * k)}" rx="${f1(4 * k)}" class="khug"/>` + bookmark(X(sx + 16), Y(cy), k, v.saved) + (g.meta.h > 40 ? Rc(X(sx - 6), Y(cy - 22), 44 * k, 44 * k, 'kph') : '')); }
    s += G(vis('meta'), m);
  }
  // headline and summary slots, with one line box per rendered line
  const lines = (box, lh, n, label, a) => {
    let q = Rc(X(P), Y(box.y), (W - 2 * P) * k, box.h * k, 'kslot');
    for (let i = 1; i < Math.ceil(n - 1e-6); i++) q += Ln(X(P), Y(box.y + i * lh), X(W - P), Y(box.y + i * lh), 'kgrid');
    if (label && k > .45) q += T(X(P) + 10, Y(box.y + Math.min(lh, box.h) / 2) + 5, label, 'ksl');
    return G(a, q);
  };
  s += lines(g.head, o.H5, o.n, v.headLabel === undefined ? 'HEADLINE SLOT' : v.headLabel, vis('head'));
  s += lines(g.sum, o.H6, o.m, v.sumLabel === undefined ? 'SUMMARY SLOT' : v.sumLabel, vis('sum'));
  return { s, g, X, Y };
}
const MD = { W: 672, S1: 20, meta: 16, H5: 28, n: 1, H6: 24, m: 1 };

/* ---------- captions ---------- */
const CAPS = [
  [0, 'THE STORY CARD', 'The Article card type: one card for every story in the river.'],
  [3.6, 'FOUR SLOTS', 'Media, meta row, headline and summary, inside one rounded container.'],
  [8, 'ANATOMY · MEDIA', 'Media fills the card width at 16:9. The container radius clips its top corners.'],
  [11, 'ANATOMY · META ROW', 'Brand icon, source, byline and an optional save button.'],
  [14, 'ANATOMY · TEXT', 'The headline clamps at 3 lines, the summary at 2.'],
  [17, 'ANATOMY · HIT AREA', 'An invisible button covers the whole card. The meta row sits above it, so its links get their own clicks.'],
  [20, 'VERTICAL RHYTHM', 'Every gap is a token on the 4 px grid. Read the card top to bottom.'],
  [27.5, 'THE HEIGHT FORMULA', 'H = W·9/16 + 2·S1 + H4 + S2 + n·H5 + S3 + m·H6. No fixed height: the card hugs its content.'],
  [34, 'HEADLINE LINES', 'Each headline line adds H5 = 28. The fourth line never renders: line-clamp-3.'],
  [40, 'SUMMARY LINES', 'Each summary line adds H6 = 24, up to 2 lines.'],
  [46, 'META ROW · DETAIL', 'Scale 2.3:1. Icon Z1 16, gap S5 6, source takes the remaining space and truncates.'],
  [50.5, 'META ROW · SAVE', 'The bookmark save button: Z2 32, icon centered. Below 640 its hit area grows to the 44 px touch minimum.'],
  [55, 'META ROW · NARROW', 'The meta row is a container. Under 20rem (320 px) the byline hides and the source truncates.'],
  [60, 'BREAKPOINTS · BASE < 640', 'Padding 16 · headline 20/24 · meta row 44 with save.'],
  [64.6, 'BREAKPOINTS · SM 640–767', 'Padding steps to 20. The save hit area returns to 32.'],
  [69.2, 'BREAKPOINTS · MD ≥ 768', 'The headline steps to 24/28. Summary stays 16/24 everywhere.'],
  [74, 'LAYERS', 'Six layers from the canvas up, in z order from the code.'],
  [80.6, 'LAYERS · CLICKS', 'The hit area (z-10) opens the story. Meta controls (z-20) sit above it.'],
  [86, 'SHADOW ENVELOPE', 'No border. --hp-shadow-card (0 2 6 0) and the surface separate the card from the page.'],
  [91, 'RADIUS', 'R1 8 on the card and media clip · R2 3 on the brand icon · R3 4 on the save button.'],
  [96, 'STATES', 'Rest: shadow only. Hover: headline underline and media ×1.025 over 250 ms.'],
  [101, 'STATES · FOCUS AND SAVED', 'Focus-visible: a 2 px inset ring. Saved: the bookmark fills. Reduced motion: no media scale.'],
  [106, 'IN A ROW', 'Columns follow the block width: 1 → 2 → 3 → 4 at 536, 812 and 1088 (260 min card + 16 gap).'],
  [111.5, 'IN A ROW · HEIGHTS', 'Cards in a row stretch to the tallest. Content stays top-aligned; spare height collects at the bottom.'],
  [116, 'THE DRAWING', 'HP-CARD-001 Rev D: every slot, gap, radius and layer on one sheet.'],
];
const END = 126.5;

kit.scene('story-card', {
  init(kit) {
    kit.css('.kc{position:absolute;inset:0;background:#fff}' +
      '.kc svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.kc .kcap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.kc .ksub{font-size:24px;fill:#333}' +
      '.kc .kdt{font-size:17px;fill:#111;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.kc .kdts{font-size:13px;letter-spacing:.08em;fill:#555;text-transform:uppercase}' +
      '.kc .ksl{font-size:12px;letter-spacing:.1em;fill:#555;text-transform:uppercase}.kc .kvt{font-size:17px;letter-spacing:.1em;fill:#111;text-transform:uppercase}' +
      '.kc .kread{font-size:40px;fill:#111;letter-spacing:.02em}.kc .kread2{font-size:20px;fill:#444;letter-spacing:.08em;text-transform:uppercase}.kc .kmono{font-size:22px;fill:#111;letter-spacing:.04em}' +
      '.kc .kobj{fill:#fff;stroke:#111;stroke-width:2;stroke-linejoin:round}.kc .kwell{fill:#f1f1f1;stroke:#111;stroke-width:1.2}.kc .kslot{fill:none;stroke:#444;stroke-width:1.2;stroke-dasharray:7 5}' +
      '.kc .khug{fill:#e4e4e4;stroke:#111;stroke-width:1.2}.kc .kthin{fill:none;stroke:#111;stroke-width:1.2}.kc .kfill{fill:#111;stroke:#111;stroke-width:1.2}' +
      '.kc .kph{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:18 5 4 5}.kc .kcl{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:22 5 3 5}.kc .kenv{fill:none;stroke:#111;stroke-width:1.2;stroke-dasharray:14 4 3 4}' +
      '.kc .kgrid{stroke:#bbb;stroke-width:1;stroke-dasharray:3 4}.kc .kdl{stroke:#111;stroke-width:1.1;fill:none}.kc .kext{stroke:#111;stroke-width:.8}.kc .klead{fill:none;stroke:#111;stroke-width:1}.kc .kdot{fill:#111}' +
      '.kc .khs{stroke:#111;stroke-width:1}.kc .kring{fill:none;stroke:#111;stroke-width:4}.kc .kul{stroke:#111;stroke-width:3}.kc .kon{fill:#111}.kc .koff{fill:#fff;stroke:#111;stroke-width:1.2}.kc .kcol{fill:#f6f6f6;stroke:none}' +
      '.kc .klay{fill:none;stroke:#111;stroke-width:1.6;vector-effect:non-scaling-stroke}.kc .klayw{fill:#fff;stroke:#111;stroke-width:1.6;vector-effect:non-scaling-stroke}.kc .klayg{fill:#f1f1f1;stroke:#111;stroke-width:1.2;vector-effect:non-scaling-stroke}' +
      '.kc .klays{fill:none;stroke:#444;stroke-width:1.1;stroke-dasharray:7 5;vector-effect:non-scaling-stroke}.kc .klayp{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:18 5 4 5;vector-effect:non-scaling-stroke}.kc .klayh{stroke:#111;stroke-width:1;vector-effect:non-scaling-stroke}');
    const root = kit.h('<div class="kc"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = '<defs><marker id="ka" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#111"/></marker>' +
      '<pattern id="khat" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#111" stroke-width="1"/></pattern>' +
      '<clipPath id="kwipe"><rect id="kwr" x="0" y="-20" width="0" height="1100"/></clipPath></defs>';
    const g = id => { const e = document.createElementNS(NS, 'g'); e.id = id; svg.appendChild(e); return e; };
    this.head = g('khead'); this.live = g('klive');
    const wrap = g('ksheet'); this.cam = document.createElementNS(NS, 'g'); wrap.appendChild(this.cam);
    const holder = document.createElementNS(NS, 'g'); holder.setAttribute('transform', 'translate(110,10)'); holder.setAttribute('clip-path', 'url(#kwipe)'); this.cam.appendChild(holder);
    const doc = new DOMParser().parseFromString(SHEET, 'image/svg+xml'); holder.appendChild(document.importNode(doc.documentElement, true));
    this.sheet = wrap; this.wipe = svg.querySelector('#kwr');
    ['400 12px Arimo', '700 12px Arimo'].forEach(f => document.fonts.load(f));
  },

  header(t) {
    const c = capAt(CAPS, t), a = eo(seg(t, c[0], c[0] + .45)) * (1 - eo(seg(t, END - .6, END)));
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-CARD-001 · STORY CARD', 'kcap', 'text-anchor="end"');
  },

  /* A · the card draws itself */
  beatA(t) {
    const a = win(t, 0, 8.2, .3, .6); if (a <= 0) return '';
    const k = 1.3, X0 = 523, Y0 = 220;
    const c = card(X0, Y0, k, MD, { box: eio(seg(t, .2, 1.6)), media: eo(seg(t, 1.2, 1.9)), meta: eo(seg(t, 3.6, 4.2)), head: eo(seg(t, 4.3, 4.9)), sum: eo(seg(t, 5, 5.6)), mediaLabel: 'MEDIA SLOT · 16:9 · FILL' });
    let s = c.s;
    s += G(eo(seg(t, 2, 2.6)), DH(c.X(0), c.X(672), Y0 - 26, 'W = FILL · REF 672'));
    s += G(eo(seg(t, 6, 6.6)), DV(c.Y(0), c.Y(c.g.H), c.X(672) + 40, '(REF 502)'));
    s += G(eo(seg(t, 6.4, 7)), T(X0, c.Y(c.g.H) + 60, 'LIFESTYLERIVERCARD · HOME-PAGE.TSX', 'kdts'));
    return G(a, s);
  },

  /* B · anatomy: one part at a time, with a leader */
  beatB(t) {
    const a = win(t, 8, 20.2, .5, .6); if (a <= 0) return '';
    const k = 1.3, X0 = 523, Y0 = 220;
    const focus = (a0, b0) => .25 + .75 * win(t, a0, b0, .4, .4);
    const c = card(X0, Y0, k, MD, { media: focus(8, 11), meta: focus(11, 14), head: focus(14, 17), sum: focus(14, 17), byline: 1, mediaLabel: 'MEDIA SLOT · 16:9 · FILL' });
    let s = c.s;
    const L = X0 - 60;
    s += G(win(t, 8.3, 20.2), leader(c.X(60), c.Y(120), L, c.Y(120), 'Media', 'aspect-video · object-cover', -1));
    s += G(win(t, 9.2, 20.2), leader(c.X(8), c.Y(8), L, c.Y(-10), 'R1 = 8 clip', 'rounded-card · overflow-hidden', -1));
    s += G(win(t, 11.3, 20.2), leader(c.X(28), c.Y(c.g.meta.y + 8), L, c.Y(c.g.meta.y + 8), 'Meta row', 'type-m1 12/16 · z-20', -1));
    s += G(win(t, 14.3, 20.2), leader(c.X(40), c.Y(c.g.head.y + 14), L, c.Y(c.g.head.y + 50), 'Headline', 'type-t3 24/28 · ≤ 3 lines', -1));
    s += G(win(t, 15.2, 20.2), leader(c.X(40), c.Y(c.g.sum.y + 12), L, c.Y(c.g.sum.y + 92), 'Summary', 'type-d2 16/24 · ≤ 2 lines', -1));
    // hit area overlay
    const h = win(t, 17, 20.2, .5, .5);
    if (h > 0) s += G(h, `<rect x="${f1(c.X(4))}" y="${f1(c.Y(4))}" width="${f1(664 * k)}" height="${f1((c.g.H - 8) * k)}" rx="${f1(6 * k)}" class="kph"/>` +
      Ln(c.X(4), c.Y(4), c.X(668), c.Y(c.g.H - 4), 'kph') + Ln(c.X(668), c.Y(4), c.X(4), c.Y(c.g.H - 4), 'kph') +
      leader(c.X(668), c.Y(260), c.X(672) + 60, c.Y(260), 'Hit area', 'button · inset 0 · z-10') +
      leader(c.X(640), c.Y(c.g.meta.y + 8), c.X(672) + 60, c.Y(c.g.meta.y - 30), 'Above it', 'meta row · z-20'));
    return G(a, s);
  },

  /* C · vertical rhythm, then the height formula */
  beatC(t) {
    const a = win(t, 20, 34.2, .5, .6); if (a <= 0) return '';
    const k = 1.6, X0 = 90, Y0 = 280;
    const c = card(X0, Y0, k, Object.assign({ cut: 140 }, MD), {});
    let s = c.s;
    const g = c.g, rx = c.X(672) + 44;
    const chain = [[0, g.HM, 'HM = W·9/16', '378'], [g.HM, g.meta.y, 'S1', '20'], [g.meta.y, g.meta.y + g.meta.h, 'H4', '16'], [g.meta.y + 16, g.head.y, 'S2', '8'], [g.head.y, g.head.y + g.head.h, 'n·H5', '28'], [g.head.y + g.head.h, g.sum.y, 'S3', '8'], [g.sum.y, g.sum.y + g.sum.h, 'm·H6', '24'], [g.sum.y + g.sum.h, g.H, 'S1', '20']];
    const what = ['media', 'content padding · p-5', 'meta line · type-m1', 'mb-2', 'headline line · type-t3', 'mt-2', 'summary line · type-d2', 'content padding · p-5'];
    chain.forEach(([y1, y2, l], i) => {
      const p = eo(seg(t, 20.6 + i * .85, 21.1 + i * .85)); if (p <= 0) return;
      s += G(p, DV(c.Y(y1), c.Y(y2), rx, i ? '' : 'HM'));
      const hl = win(t, 20.6 + i * .85, 21.5 + i * .85, .25, .35);
      if (hl > 0 && i) s += G(hl, Rc(c.X(0) + 2, c.Y(y1), 672 * k - 4, (y2 - y1) * k, 'kcol', 'style="fill:#111;opacity:.08"') + Ln(rx + 8, (c.Y(y1) + c.Y(y2)) / 2, 1320, 290 + i * 52 - 7, 'klead'));
    });
    // table of terms on the right
    const TX = 1340, TY = 290;
    chain.forEach(([, , l, v], i) => {
      const p = eo(seg(t, 20.8 + i * .85, 21.4 + i * .85)); if (p <= 0) return;
      s += G(p, T(TX, TY + i * 52, l.replace(' = W·9/16', ''), 'kmono') + T(TX + 140, TY + i * 52, v, 'kmono', 'text-anchor="end"') + T(TX + 170, TY + i * 52, what[i], 'kdts'));
    });
    // formula
    const f = eo(seg(t, 28, 29));
    if (f > 0) {
      const vals = [378, 20, 16, 8, 28, 8, 24, 20]; let shown = 0;
      vals.forEach((v, i) => { if (t > 29 + i * .45) shown += v; });
      const full = t > 29 + 7 * .45 + .2;
      s += G(f, Ln(TX, TY + 8 * 52 - 20, TX + 520, TY + 8 * 52 - 20, 'kthin') + T(TX, TY + 8 * 52 + 22, 'H', 'kmono') + T(TX + 140, TY + 8 * 52 + 22, String(shown), 'kmono', 'text-anchor="end"') + T(TX + 170, TY + 8 * 52 + 22, full ? 'measured: 502 · exact' : 'adding…', 'kdts'));
      s += G(eo(seg(t, 32.6, 33.2)), T(c.X(0), c.Y(g.H) + 60, 'H = 502 · THE CARD HUGS ITS CONTENT', 'kread2'));
    }
    return G(a, s);
  },

  /* D · lines and height */
  beatD(t) {
    const a = win(t, 34, 46.2, .5, .6); if (a <= 0) return '';
    const n = keyed([[34.6, 1], [35.8, 2], [37.2, 2], [38.4, 3], [46, 3]], t);
    const m = keyed([[40.4, 1], [41.8, 2], [46, 2]], t);
    const k = 1.45, X0 = 150, Y0 = 300, o = Object.assign({ cut: 120 }, MD, { n, m });
    const c = card(X0, Y0, k, o, {});
    const g = c.g;
    let s = c.s;
    // ghost lines beyond the clamp
    const gh = win(t, 39, 40.4, .4, .4), gm = win(t, 43, 46, .4, .4);
    if (gh > 0) s += G(gh, Rc(c.X(20), c.Y(g.head.y + 3 * 28), 632 * k, 28 * k, 'kph') + T(c.X(672) + 60, c.Y(g.head.y + 3.5 * 28) + 6, 'LINE 4 · CLAMPED', 'kdts') + Ln(c.X(20), c.Y(g.head.y + 3.5 * 28), c.X(652), c.Y(g.head.y + 3.5 * 28), 'kthin'));
    if (gm > 0) s += G(gm, Rc(c.X(20), c.Y(g.sum.y + 2 * 24), 632 * k, 24 * k, 'kph') + T(c.X(672) + 60, c.Y(g.sum.y + 2.5 * 24) + 6, 'LINE 3 · CLAMPED', 'kdts') + Ln(c.X(20), c.Y(g.sum.y + 2.5 * 24), c.X(652), c.Y(g.sum.y + 2.5 * 24), 'kthin'));
    s += DV(c.Y(g.head.y), c.Y(g.head.y + g.head.h), c.X(0) - 34, 'n·H5', 'l') + DV(c.Y(g.sum.y), c.Y(g.sum.y + g.sum.h), c.X(0) - 34, 'm·H6', 'l');
    s += DV(c.Y(0), c.Y(g.H), c.X(672) + 40, '');
    const TX = 1300;
    s += T(TX, 330, 'n = ' + Math.round(n), 'kread') + T(TX + 200, 330, 'HEADLINE LINES', 'kread2');
    s += T(TX, 400, 'm = ' + Math.round(m), 'kread') + T(TX + 200, 400, 'SUMMARY LINES', 'kread2');
    s += T(TX, 500, 'H = ' + g.H.toFixed(0), 'kread');
    s += T(TX, 545, '378 + 72 + ' + Math.round(n) + '·28 + ' + Math.round(m) + '·24', 'kdts');
    s += T(TX, 640, 'n ≤ 3 · line-clamp-3', 'kmono') + T(TX, 680, 'm ≤ 2 · line-clamp-2', 'kmono') + T(TX, 760, 'WIDTH NEVER CHANGES WITH COPY.', 'kdts') + T(TX, 784, 'HEIGHT ALWAYS DOES.', 'kdts');
    return G(a, s);
  },

  /* E · meta row at 2.5:1 */
  beatE(t) {
    const a = win(t, 46, 60.2, .5, .6); if (a <= 0) return '';
    const q = 2.3, X0 = 150, TOP = 520;
    const rowW = keyed([[55.4, 632], [58.4, 280], [60, 280]], t);
    const base = eo(seg(t, 51.8, 52.6)) * (1 - eo(seg(t, 54.4, 55)));
    const Z2 = 32, T1 = 44, iw = 16, s5 = 6, s4 = 8, byW = 96;
    const byOn = rowW >= 320 ? 1 : 0, byA = clamp01((rowW - 300) / 20);
    const srcW = Math.max(40, rowW - iw - s5 - (byW + 8) * byA - (Z2 + s4));
    const X = v => X0 + v * q, cy = TOP + Z2 * q / 2;
    let s = Ln(X(-10), cy, X(rowW + 40), cy, 'kcl');
    s += xbox(X(0), cy - iw * q / 2, iw * q, iw * q) + Rc(X(iw + s5), cy - 8 * q, srcW * q, 16 * q, 'kslot') + T(X(iw + s5) + 14, cy + 6, srcW < 120 ? 'SOURCE…' : 'SOURCE · FLEX · TRUNCATE', 'ksl');
    const bx = iw + s5 + srcW + 8;
    s += G(byA, Rc(X(bx), cy - 8 * q, byW * q, 16 * q, 'kph') + T(X(bx + byW / 2), cy + 6, 'BYLINE', 'ksl', 'text-anchor="middle"'));
    const zx = rowW - Z2;
    s += `<rect x="${f1(X(zx))}" y="${f1(TOP)}" width="${f1(Z2 * q)}" height="${f1(Z2 * q)}" rx="${f1(4 * q)}" class="khug"/>` + Rc(X(zx + 8), TOP + 8 * q, 16 * q, 16 * q, 'kthin') + bookmark(X(zx + 16), cy, q * .9, false);
    // dims
    const ty = TOP - 60;
    s += G(eo(seg(t, 46.6, 47.2)), DH(X(0), X(iw), ty, 'Z1 16'));
    s += G(eo(seg(t, 47.2, 47.8)), DH(X(iw), X(iw + s5), ty - 44, 'S5 6'));
    s += G(eo(seg(t, 47.8, 48.4)), DH(X(iw + s5), X(iw + s5 + srcW), ty, 'FLEX', 'kdts'));
    s += G(eo(seg(t, 48.4, 49)) * byA, DH(X(bx), X(bx + byW), ty, 'HUG', 'kdts'));
    s += G(eo(seg(t, 49, 49.6)), DV(cy - 8 * q, cy + 8 * q, X(-10) - 20, 'H4 16', 'l'));
    s += G(eo(seg(t, 50.8, 51.4)), DH(X(zx - s4), X(zx), ty - 44, 'S4 8') + DH(X(zx), X(zx + Z2), ty, 'Z2 32') + DV(TOP, TOP + Z2 * q, X(rowW) + 40, 'Z2 32') + DH(X(zx), X(zx + 8), TOP + Z2 * q + 40, '(Z2 − I1) ÷ 2 = 8', 'kdts', true));
    if (base > 0) s += G(base, Rc(X(zx - 6), TOP - 6 * q, T1 * q, T1 * q, 'kph') + DV(TOP - 6 * q, TOP + (Z2 + 6) * q, X(rowW) + 150, 'T1 44') + T(X(zx - 6), TOP + (Z2 + 6) * q + 90, 'MIN-H-11 · TOUCH MINIMUM', 'kdts'));
    // narrowing
    const nA = eo(seg(t, 55, 55.6));
    if (nA > 0) {
      s += G(nA, Ln(X(320), TOP - 140, X(320), TOP + Z2 * q + 140, 'kph') + T(X(320) + 10, TOP - 150, '20REM = 320', 'kdts'));
      s += G(nA, DH(X(0), X(rowW), TOP + Z2 * q + 120, 'META ROW W = ' + rowW.toFixed(0)) + T(X0, TOP + Z2 * q + 210, byOn ? 'BYLINE SHOWS · ROW ≥ 20REM' : 'BYLINE HIDDEN · @CONTAINER STORY-META (MAX-WIDTH: 20REM)', 'kread2'));
    }
    s += T(X0, 960, 'SCALE 2.3:1 · .STORY-META-ROW · FLEX · ITEMS-CENTER · GAP 8', 'kdts');
    return G(a, s);
  },

  /* F · breakpoints: the same card through base, sm and md */
  beatF(t) {
    const a = win(t, 60, 74.2, .5, .6); if (a <= 0) return '';
    const p1 = eio(seg(t, 64.2, 65.6)), p2 = eio(seg(t, 68.8, 70.2));
    const W = lerp(lerp(326, 520, p1), 672, p2), S1 = lerp(16, 20, p1), meta = lerp(44, 32, p1), H5 = lerp(24, 28, p2);
    const fs = lerp(20, 24, p2);
    const o = { W, S1, meta, H5, n: 2, H6: 24, m: 2, save: true };
    const k = 1.08, X0 = 110, Y0 = 220;
    const c = card(X0, Y0, k, o, { headLabel: 'HEADLINE · ' + fs.toFixed(0) + ' / ' + H5.toFixed(0), sumLabel: 'SUMMARY · 16 / 24' });
    let s = c.s; const g = c.g;
    s += DH(c.X(0), c.X(W), Y0 - 24, p2 > .5 ? 'W · REF 672' : p1 < .5 ? 'W · REF 326' : 'W = FILL');
    s += DV(c.Y(g.HM), c.Y(g.meta.y), c.X(W) + 30, 'S1 ' + S1.toFixed(0)) + DV(c.Y(g.meta.y), c.Y(g.meta.y + g.meta.h), c.X(W) + 30, 'META ' + meta.toFixed(0)) + DV(c.Y(g.head.y), c.Y(g.head.y + g.head.h), c.X(W) + 30, '2·H5') + DV(c.Y(0), c.Y(g.H), c.X(W) + 140, 'H ' + g.H.toFixed(1));
    // viewport ruler and live table
    const RX = 1200, RW = 620, RY = 250, V = v => RX + (v - 320) / (1100 - 320) * RW;
    const vw = lerp(lerp(390, 700, p1), 1024, p2);
    s += Ln(RX, RY, RX + RW, RY, 'kthin');
    [[320, '320'], [640, 'SM 640'], [768, 'MD 768'], [1024, '1024']].forEach(([v, l]) => { s += Ln(V(v), RY - 10, V(v), RY + 10, 'kthin') + T(V(v), RY + 34, l, 'kdts', 'text-anchor="middle"'); });
    s += `<path d="M${f1(V(vw))},${RY - 14} l-9,-16 h18 z" class="kfill"/>` + T(V(vw), RY - 40, 'VIEWPORT ' + vw.toFixed(0), 'kdts', 'text-anchor="middle"');
    const rows = [['S1', '16', '20', '20'], ['META · SAVE', '44', '32', '32'], ['HEADLINE', '20/24', '20/24', '24/28'], ['SUMMARY', '16/24', '16/24', '16/24'], ['H · n2 m2', '371.4', '—', '570']];
    const col = p2 > .5 ? 3 : p1 > .5 ? 2 : 1, cw = [170, 150, 150, 150], TY = 360;
    let x = RX; const cx = [];
    cw.forEach(w => { cx.push(x); x += w; });
    s += Rc(cx[col], TY - 6, cw[col], 46 * (rows.length + 1) + 6, 'kcol');
    ['', 'BASE < 640', 'SM 640–767', 'MD ≥ 768'].forEach((h, j) => { s += T(cx[j] + (j ? cw[j] / 2 : 0), TY + 26, h, 'kdts', j ? 'text-anchor="middle"' : ''); });
    rows.forEach((r, i) => {  s += Ln(RX, TY + 46 * (i + 1) - 6, RX + 620, TY + 46 * (i + 1) - 6, 'kgrid'); r.forEach((v, j) => { s += T(cx[j] + (j ? cw[j] / 2 : 0), TY + 46 * (i + 1) + 26, v, j ? (j === col ? 'kmono' : 'kdts') : 'kdts', j ? 'text-anchor="middle"' : ''); }); });
    s += T(RX, TY + 46 * 7, 'PADDING STEPS AT SM. HEADLINE TYPE STEPS AT MD.', 'kdts') + T(RX, TY + 46 * 7 + 26, 'BETWEEN 640 AND 767: PADDING 20 WITH A 20/24 HEADLINE.', 'kdts');
    return G(a, s);
  },

  /* G · layers lift into an axonometric stack */
  beatG(t) {
    const a = win(t, 74, 86.2, .5, .6); if (a <= 0) return '';
    const W = 672, H = 502, p = eio(seg(t, 75, 77.6));
    const sc = .95, PX = 1010, PY = 600;
    const flat = [1.05, 0, 0, 1.05, 607, 250];
    const iso = [.94 * sc, .17 * sc, -.34 * sc, .47 * sc, PX, PY];
    const M = flat.map((v, i) => lerp(v, iso[i], p));
    const gap = 70 * p;
    const L = (z, inner, aa) => G(aa, `<g transform="matrix(${M.map(v => v.toFixed(4)).join(',')})" ><g transform="translate(0,${f1(-z / M[3])})">${inner}</g></g>`);
    const R2 = (x, y, w, h, r, cls, ex) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${cls}" ${ex || ''}/>`;
    const lay = [
      [0, R2(-40, -40, W + 80, H + 80, 0, 'klay'), 'L0 · CANVAS', '--hp-background'],
      [1, R2(0, 2, W, H, 8, 'klayh', 'fill="url(#khat)"'), 'L1 · SHADOW', '--hp-shadow-card'],
      [2, R2(0, 0, W, H, 8, 'klayw') + `<line x1="0" y1="378" x2="${W}" y2="378" class="klay"/>`, 'L2 · CONTAINER', '--hp-surface · R1 8 · clip'],
      [3, `<path d="${topRound(0, 0, W, 378, 8)}" class="klayg"/>` + R2(20, 422, 632, 28, 0, 'klays') + R2(20, 458, 632, 24, 0, 'klays'), 'L3 · MEDIA + TEXT', 'image · headline · summary'],
      [4, R2(0, 0, W, H, 8, 'klayp') + `<path d="M0,0 L${W},${H} M${W},0 L0,${H}" class="klayp"/>`, 'L4 · HIT AREA', 'open button · z-10'],
      [5, R2(20, 398, 16, 16, 0, 'klay') + R2(42, 398, 360, 16, 0, 'klays') + R2(620, 390, 32, 32, 4, 'klayg'), 'L5 · META CONTROLS', 'source link · save · z-20'],
    ];
    let s = '';
    lay.forEach(([i, inner]) => {
      const show = i < 2 ? 1 : 1; const z = gap * i;
      const hl = t > 80.6 && (i === 4 || i === 5) ? 1 : t > 80.6 ? .35 : 1;
      s += L(z, inner, show * hl);
    });
    // labels after the lift
    lay.forEach(([i, , l, sub]) => {
      const la = eo(seg(t, 77.8 + i * .35, 78.3 + i * .35)) * (t > 80.6 && i < 4 ? .4 : 1); if (la <= 0) return;
      const px = M[0] * 0 + M[2] * H + M[4], py = M[1] * 0 + M[3] * H + M[5] - gap * i;
      s += G(la, leader(px, py, 640, py, l, sub, -1));
    });
    s += G(eo(seg(t, 81, 81.6)), T(1100, 1010, 'A CLICK ON THE CARD OPENS THE STORY. A CLICK ON THE SOURCE OR SAVE DOES NOT.', 'kdts', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* H · shadow envelope and radii */
  beatH(t) {
    const a = win(t, 86, 96.2, .5, .6); if (a <= 0) return '';
    const q = 6, CX = 260, CY = 330, L = 420, r = 8 * q, E1 = 4 * q, E2 = 6 * q, E3 = 8 * q, Yo = 2 * q, gapB = 70;
    const BY = CY + 150 + gapB + 150;
    let s = '';
    const p = eio(seg(t, 86.4, 87.8));
    s += `<path d="M${CX},${CY + 150} L${CX},${CY + r} A${r} ${r} 0 0 1 ${CX + r},${CY} L${CX + L},${CY}" class="kobj" fill="none" ${drawn(p)}/>`;
    s += `<path d="M${CX},${CY + 150 + gapB} L${CX},${BY - r} A${r} ${r} 0 0 0 ${CX + r},${BY} L${CX + L},${BY}" class="kobj" fill="none" ${drawn(p)}/>`;
    s += G(eo(seg(t, 87.6, 88.2)), `<path d="M${CX},${BY - r} A${r} ${r} 0 0 0 ${CX + r},${BY} L${CX + L},${BY} L${CX + L},${BY + Yo} L${CX + r},${BY + Yo} A${r} ${r} 0 0 1 ${CX},${BY - r + Yo} Z" fill="url(#khat)" class="khs"/>`);
    s += G(eo(seg(t, 88.2, 88.8)), `<path d="M${CX + L},${CY - E1} L${CX - E2},${CY - E1} L${CX - E2},${CY + 150} M${CX - E2},${CY + 150 + gapB} L${CX - E2},${BY + E3} L${CX + L},${BY + E3}" class="kenv"/>`);
    s += G(eo(seg(t, 88.8, 89.4)), DV(CY - E1, CY, CX + L + 30, 'E1 = BL + SP − Y = 4') + DH(CX - E2, CX, CY + 110, 'E2 6') + DV(BY, BY + E3, CX + L + 30, 'E3 = BL + SP + Y = 8') + DV(BY, BY + Yo, CX + L + 330, 'Y 2'));
    s += G(eo(seg(t, 89, 89.6)), T(CX + 60, CY + 90, 'CARD', 'ksl') + T(CX + 60, BY + E3 + 34, 'SHADOW FOOTPRINT · HATCHED', 'ksl') + T(CX - E2, BY + E3 + 90, 'SCALE 6:1 · BREAK NOT TO SCALE', 'kdts'));
    s += G(eo(seg(t, 89.4, 90)), T(CX, 960, '--HP-SHADOW-CARD · 0 2PX 6PX RGB(15 23 42 / .05) · BORDER 0 !IMPORTANT', 'kdts'));
    // radii at 8:1
    const ra = eo(seg(t, 91, 91.6));
    if (ra > 0) {
      [['R1', 'CARD · MEDIA CLIP', 8], ['R2', 'BRAND ICON', 3], ['R3', 'SAVE · FOCUS', 4]].forEach(([c, n, rr], i) => {
        const qq = 8, x0 = 1180 + i * 230, y0 = 640, Lq = 22 * qq, rp = rr * qq, pp = eio(seg(t, 91.2 + i * .5, 92.2 + i * .5));
        const sx = x0, sy = y0;
        s += `<path d="M${sx},${sy - Lq} L${sx},${sy - rp} A${rp} ${rp} 0 0 0 ${sx + rp},${sy} L${sx + Lq},${sy}" class="kobj" fill="none" ${drawn(pp)}/>`;
        const ccx = sx + rp, ccy = sy - rp;
        s += G(pp, `<path d="M${ccx - 7},${ccy} h14 M${ccx},${ccy - 7} v14" class="kthin"/>` + Ln(ccx, ccy, ccx - rp * Math.SQRT1_2, ccy + rp * Math.SQRT1_2, 'kdl', 'marker-end="url(#ka)"') + T(sx + 40, sy - Lq + 30, c + ' = ' + rr, 'kread') + T(sx, sy + 34, n, 'kdts'));
      });
      s += G(ra, T(1180, 380, 'RADIUS DETAILS · 8:1', 'kread2') + T(1180, 420, 'ROUNDED-CARD → --HP-RADIUS-CARD', 'kdts'));
    }
    return G(a * 1, G(1 - .6 * eo(seg(t, 91, 91.6)) * 0, s));
  },

  /* I · states */
  beatI(t) {
    const a = win(t, 96, 106.2, .5, .6); if (a <= 0) return '';
    const k = .62, o = Object.assign({}, MD, { n: 2, save: true });
    const xs = [100, 548, 996, 1444], Y0 = 300;
    const sts = [['REST', 'shadow only', 96.4], ['HOVER', 'underline · media ×1.025', 97.8], ['FOCUS-VISIBLE', 'ring 2 inset · rounded 8', 101.2], ['SAVED', 'bookmark fills · aria-pressed', 102.8]];
    let s = '';
    sts.forEach(([l, sub, t0], i) => {
      const ap = eo(seg(t, t0, t0 + .6)); if (ap <= 0) return;
      const c = card(xs[i], Y0, k, o, { saved: i === 3, headLabel: '', sumLabel: '' });
      let q = c.s; const g = c.g;
      if (i === 1) { const pr = (Math.sin((t - 98.4) * 2.2) + 1) / 2, sc = 1 + .025 * pr; q += `<rect x="${f1(c.X(336 - 336 * sc))}" y="${f1(c.Y(189 - 189 * sc))}" width="${f1(672 * k * sc)}" height="${f1(378 * k * sc)}" class="kph"/>` + Ln(c.X(20), c.Y(g.head.y + 26), c.X(20 + 560 * eo(seg(t, 98.4, 99))), c.Y(g.head.y + 26), 'kul') + Ln(c.X(20), c.Y(g.head.y + 54), c.X(20 + 380 * eo(seg(t, 98.6, 99.2))), c.Y(g.head.y + 54), 'kul'); }
      if (i === 2) q += `<rect x="${f1(c.X(3))}" y="${f1(c.Y(3))}" width="${f1(666 * k)}" height="${f1((g.H - 6) * k)}" rx="${f1(8 * k)}" class="kring" ${op(eo(seg(t, 101.8, 102.2)))}/>`;
      s += G(ap, q + T(xs[i], Y0 + g.H * k + 50, l, 'kvt') + T(xs[i], Y0 + g.H * k + 78, sub, 'kdts'));
    });
    s += G(eo(seg(t, 103.6, 104.2)), T(100, 900, 'PREFERS-REDUCED-MOTION: THE MEDIA SCALE IS OFF. THE UNDERLINE STAYS.', 'kdts') + T(100, 930, 'SAVE RENDERS ONLY WHEN ONSAVE IS PASSED. NO IMAGE: THE SLOT FALLS BACK TO BG-MUTED.', 'kdts'));
    return G(a, s);
  },

  /* J · in a row */
  beatJ(t) {
    const a = win(t, 106, 116.2, .5, .6); if (a <= 0) return '';
    const BW = keyed([[106.6, 420], [110.4, 1200], [116, 1200]], t);
    const cols = BW >= 1088 ? 4 : BW >= 812 ? 3 : BW >= 536 ? 2 : 1;
    const k = 1.2, X0 = (1920 - BW * k) / 2, Y0 = 280, gap = 16;
    const cw = (BW - (cols - 1) * gap) / cols, ns = [2, 3, 1, 2], ms = [2, 1, 2, 1];
    const hs = ns.slice(0, cols).map((n, i) => geo({ W: cw, S1: 20, meta: 16, H5: 28, n, H6: 24, m: ms[i] }).H), Hmax = Math.max(...hs);
    const stretch = eo(seg(t, 111.8, 112.8));
    let s = Rc(X0 - 12, Y0 - 12, BW * k + 24, Hmax * k + 24, 'kph');
    for (let i = 0; i < cols; i++) {
      const x = X0 + i * (cw + gap) * k, o = { W: cw, S1: 20, meta: 16, H5: 28, n: ns[i], H6: 24, m: ms[i] };
      const c = card(x, Y0, k, o, { box: 0, headLabel: '', sumLabel: '' });
      const Hh = lerp(hs[i], Hmax, stretch);
      s += `<rect x="${f1(x)}" y="${f1(Y0)}" width="${f1(cw * k)}" height="${f1(Hh * k)}" rx="${f1(8 * k)}" class="kobj"/>` + c.s;
      if (stretch > 0 && Hh - hs[i] > 2) s += G(stretch, Rc(x + 6, Y0 + (hs[i] - 14) * k, cw * k - 12, (Hh - hs[i]) * k, 'kcol') + T(x + cw * k / 2, Y0 + ((hs[i] + Hh) / 2 - 14) * k + 5, 'SPARE', 'ksl', 'text-anchor="middle"'));
    }
    s += DH(X0, X0 + BW * k, Y0 - 50, 'BLOCK W = ' + BW.toFixed(0) + ' · ' + cols + (cols > 1 ? ' COLUMNS' : ' COLUMN'));
    const RY = 900, RX = 360, RW = 1200, V = v => RX + (v - 320) / (1300 - 320) * RW;
    s += Ln(RX, RY, RX + RW, RY, 'kthin');
    [[536, '536 = 2·260 + 16'], [812, '812 = 3·260 + 32'], [1088, '1088 = 4·260 + 48']].forEach(([v, l]) => { s += Ln(V(v), RY - 12, V(v), RY + 12, 'kthin') + T(V(v), RY + 40, l, 'kdts', 'text-anchor="middle"'); });
    s += `<path d="M${f1(V(BW))},${RY - 16} l-9,-16 h18 z" class="kfill"/>`;
    s += T(RX, RY + 90, '@CONTAINER HP-BLOCK · .HP-BLOCK-ROW / .HP-BLOCK-GRID · GAP --LAYOUT-GAP 16 · CONTENT-START', 'kdts');
    return G(a, s);
  },

  render(t) {
    this.header(t);
    this.live.innerHTML = this.beatA(t) + this.beatB(t) + this.beatC(t) + this.beatD(t) + this.beatE(t) + this.beatF(t) + this.beatG(t) + this.beatH(t) + this.beatI(t) + this.beatJ(t);
    const on = t >= 115.8; this.sheet.style.display = on ? '' : 'none';
    if (on) {
      this.wipe.setAttribute('width', 1700 * eio(seg(t, 116, 118)));
      // stage coords = sheet + (110, 10)
      const K = [[116, 960, 540, 1], [118.4, 960, 540, 1], [119.4, 880, 340, 1.75], [120.4, 882, 342, 1.72], [121.2, 1400, 260, 2.1], [122, 1402, 262, 2.08], [122.8, 870, 700, 1.9], [123.6, 872, 702, 1.88], [124.3, 1360, 935, 2.0], [125, 1362, 937, 1.98], [126, 960, 540, 1], [END, 960, 540, .99]];
      let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
      const A = K[i], B = K[i + 1], p = eio(seg(t, A[0], B[0]));
      const z = Math.exp(lerp(Math.log(A[3]), Math.log(B[3]), p)), cx = lerp(A[1], B[1], p), cy = lerp(A[2], B[2], p);
      this.cam.setAttribute('transform', 'translate(' + (960 - cx * z) + ',' + (540 - cy * z) + ') scale(' + z + ')');
      this.sheet.setAttribute('opacity', (1 - eo(seg(t, END - .4, END + .2))).toFixed(3));
    }
  },
});
