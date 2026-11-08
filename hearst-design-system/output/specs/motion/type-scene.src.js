// Type metrics standard (UI-TYPE-001 · Rev A) → motion film, ~76 s.
// Pure function of time: render(t) rebuilds every live group from t alone.
// A 0–7 problem · B 7–19 anatomy of a line · C 19–31 size ramp · D 31–40 tracking and figures
// E 40–52 story card · F 52–64 reader · G 64–76 sheet tour.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEET = __SHEET__;
const HF = "'Schibsted Grotesk'", BF = 'Inter';

/* ---------- helpers (markup strings) ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);
const T = (x, y, s, cls, ex) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls || 'dt'}" ${ex || ''}>${esc(s)}</text>`;
const Rc = (x, y, w, h, cls, ex) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" class="${cls}" ${ex || ''}/>`;
const Ln = (x1, y1, x2, y2, cls, ex) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${ex || ''}/>`;
const op = a => `opacity="${clamp01(a).toFixed(3)}"`;
const G = (a, inner) => a <= 0 ? '' : `<g ${op(a)}>${inner}</g>`;
const font = (fam, wt, fs, ls, ex) => `style="font-family:${fam};font-weight:${wt};font-size:${f1(fs)}px;letter-spacing:${(ls || 0).toFixed(2)}px;${ex || ''}"`;
function DV(y1, y2, x, label, side, cls) {
  const small = y2 - y1 < 22, l = side === 'l';
  let s = small
    ? Ln(x, y1 - 12, x, y1, 'dl', 'marker-end="url(#ta)"') + Ln(x, y2 + 12, x, y2, 'dl', 'marker-end="url(#ta)"') + Ln(x, y1, x, y2, 'dl')
    : Ln(x, y1, x, y2, 'dl', 'marker-start="url(#ta)" marker-end="url(#ta)"');
  s += Ln(x - 7, y1, x + 7, y1, 'ext') + Ln(x - 7, y2, x + 7, y2, 'ext');
  return s + T(l ? x - 12 : x + 12, (y1 + y2) / 2 + 5, label, cls || 'dt', `text-anchor="${l ? 'end' : 'start'}"`);
}
function DH(x1, x2, y, label, cls) {
  return Ln(x1, y, x2, y, 'dl', 'marker-start="url(#ta)" marker-end="url(#ta)"') + Ln(x1, y - 7, x1, y + 7, 'ext') + Ln(x2, y - 7, x2, y + 7, 'ext') + T((x1 + x2) / 2, y - 9, label, cls || 'dt', 'text-anchor="middle"');
}

/* ---------- font metrics (cached once the face is loaded) ---------- */
const cv = document.createElement('canvas').getContext('2d'); const MC = {};
function met(fam, wt, fs) {
  const key = fam + wt + fs; if (MC[key]) return MC[key];
  const f = wt + ' ' + fs + 'px ' + fam; cv.font = f;
  const m = cv.measureText('Hxgp'), H = cv.measureText('H'), x = cv.measureText('x'), g = cv.measureText('gp');
  const r = { asc: m.fontBoundingBoxAscent, desc: m.fontBoundingBoxDescent, cap: H.actualBoundingBoxAscent, xh: x.actualBoundingBoxAscent, dsc: g.actualBoundingBoxDescent };
  if (document.fonts.check(f)) MC[key] = r; return r;
}
const baseOf = (top, lh, m) => top + (lh - (m.asc + m.desc)) / 2 + m.asc;
/* one scaled line: line box, baseline, text */
function typeLine(x, top, w, k, fam, wt, fs, lh, str, o) {
  o = o || {}; const m = met(fam, wt, fs), b = baseOf(0, lh, m);
  let s = Rc(x, top, w, lh * k, o.box === false ? 'lboxe' : 'lbox');
  if (o.base !== false) s += Ln(x, top + b * k, x + w, top + b * k, o.baseCls || 'base');
  s += `<text x="${f1(x)}" y="${f1(top + b * k)}" class="${o.cls || 'ink'}" ${font(fam, wt, fs * k, (o.ls || 0) * k, (o.caps ? 'text-transform:uppercase;' : '') + (o.tab ? 'font-variant-numeric:tabular-nums;' : ''))}>${esc(str)}</text>`;
  return { s, base: top + b * k, m };
}
function keyed(K, t) { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) { const [a, va] = K[i], [b, vb] = K[i + 1]; if (t <= b) return lerp(va, vb, eio(seg(t, a, b))); } return K[K.length - 1][1]; }
const win = (t, a, b, fi, fo) => Math.min(eo(seg(t, a, a + (fi || .5))), 1 - eo(seg(t, b - (fo || .5), b)));
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };

/* ---------- data ---------- */
const TODAY = [[11, 16.5], [11, 20], [12, 16.2], [12, 20], [14, 24], [15.2, 24], [16, 28], [18, 32], [24, 30], [24, 33], [30, 37.5], [31.6, 34.13], [36, 37.8], [48, 50.4], [30, 30]];
const STD = [[11, 16], [12, 16], [14, 20], [16, 24], [18, 28], [20, 28]], HED = [[16, 20], [20, 24], [24, 28], [28, 32], [32, 36], [48, 52]];
const RAMP = [['K1', 'Eyebrow · caps', BF, 700, 11, 16, 1.1, 1], ['M1', 'Byline · date', BF, 600, 12, 16, .4], ['B2', 'UI text', BF, 400, 14, 20, .3], ['D2', 'Card deck', BF, 400, 16, 24, .2], ['B1', 'Article body', BF, 400, 18, 28, 0], ['D1', 'Reader deck', BF, 400, 20, 28, 0],
  ['T3', 'Card headline', HF, 800, 24, 28, 0], ['T4', 'Article subhead', HF, 800, 28, 32, 0], ['T2', 'Lead headline', HF, 800, 32, 36, 0], ['T1', 'Display headline', HF, 800, 48, 52, -.48]];
const CAPS = [
  [0, 'THE PROBLEM', 'Today: 42 line heights and 40 letter spacings, set one component at a time.'],
  [3.8, 'THE STANDARD', 'Two ramps replace them: one for text, one for headlines.'],
  [7, 'ANATOMY OF A LINE', 'Every line of type sits in a line box. Its height is the line height, LH.'],
  [9.4, 'METRICS', 'Glyphs hang from the baseline: x-height, cap height, descender.'],
  [11.2, 'CONTENT AREA', 'The font’s own box, C. Whatever LH adds splits evenly above and below: half-leading, HL.'],
  [14.6, 'THE RULE', 'LH = 4 · round(FS · R ÷ 4). Text uses the HDS ratio for its size, then snaps to the 4 px grid.'],
  [19, 'ONE RAMP', 'Small text needs air (ratio near 1.45). Big headlines need less (down to 1.08).'],
  [25.9, 'HEADLINES', 'Headlines use RH: 1.2 at 24, 1.125 at 32, 1.08 at 48. Every value lands on the 4 px grid.'],
  [31, 'TRACKING · CAPS', 'All-caps labels need air: +0.1em. Today’s +0.24em is too loose; 0 is too tight.'],
  [35, 'TRACKING · DISPLAY', 'Display headlines (40 px and up) tighten by −0.01em. Sentence case uses the HDS token.'],
  [37.6, 'FIGURES', 'Dates, times and counts use tabular figures so they keep one width.'],
  [40, 'STORY CARD', 'Meta, headline and deck, each in its own line box, 8 px apart.'],
  [43.6, 'STORY CARD · FIX', 'Headline 24/30 becomes 24/28; the deck 16/28 becomes 16/24. Same lines, tighter card.'],
  [52, 'READER', 'Eyebrow, display headline, deck, byline row and body, spaced on the 4 px grid.'],
  [55, 'READER · FIX', 'Headline 48/50.4 → 48/52. Body 18/32 → 18/28. Byline and date share one 16 px line box.'],
  [64, 'THE DRAWING', 'UI-TYPE-001 Rev A: every role, its line height, tracking and spacing on one sheet.'],
];

kit.scene('type-metrics', {
  init(kit) {
    kit.css('.ty{position:absolute;inset:0;background:#fff}' +
      '.ty svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.ty .cap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.ty .sub{font-size:24px;fill:#333}.ty .big{font-size:40px;letter-spacing:.05em;fill:#111}' +
      '.ty .dt{font-size:17px;fill:#111;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.ty .dts{font-size:13px;letter-spacing:.08em;fill:#555;text-transform:uppercase}.ty .sl{font-size:12px;letter-spacing:.1em;fill:#555;text-transform:uppercase}' +
      '.ty .read{font-size:44px;fill:#111;letter-spacing:.02em}.ty .read2{font-size:20px;fill:#444;letter-spacing:.08em;text-transform:uppercase}' +
      '.ty .ink{fill:#111}.ty .ink2{fill:#5b6676}.ty .lbox{fill:#f1f1f1}.ty .lboxe{fill:none;stroke:#999;stroke-width:1}.ty .base{stroke:#111;stroke-width:1.4}.ty .base2{stroke:#888;stroke-width:1.2;stroke-dasharray:6 5}' +
      '.ty .metric{stroke:#888;stroke-width:1;stroke-dasharray:5 5}.ty .slot{fill:none;stroke:#444;stroke-width:1.2;stroke-dasharray:7 5}.ty .grid4{stroke:#e2e2e2;stroke-width:1}' +
      '.ty .dl{stroke:#111;stroke-width:1.1;fill:none}.ty .ext{stroke:#111;stroke-width:.8}.ty .thin{fill:none;stroke:#111;stroke-width:1.2}.ty .ph{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:18 5 4 5}' +
      '.ty .obj{fill:#fff;stroke:#111;stroke-width:2}.ty .odot{fill:#fff;stroke:#111;stroke-width:1.6}.ty .dot{fill:#111}.ty .ramp{fill:none;stroke:#111;stroke-width:2.6}.ty .rampd{fill:none;stroke:#111;stroke-width:2.6;stroke-dasharray:12 6}' +
      '.ty .hug{fill:#e4e4e4;stroke:#111;stroke-width:1}.ty .hl{fill:#111}');
    const root = kit.h('<div class="ty"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = '<defs><marker id="ta" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#111"/></marker>' +
      '<clipPath id="twipe"><rect id="twr" x="0" y="-20" width="0" height="1100"/></clipPath></defs>';
    const g = id => { const e = document.createElementNS(NS, 'g'); e.id = id; svg.appendChild(e); return e; };
    this.head = g('head'); this.A = g('bA'); this.B = g('bB'); this.C = g('bC'); this.D = g('bD'); this.E = g('bE'); this.F = g('bF');
    // sheet (its <style> also registers the embedded @font-face rules for the whole film)
    const wrap = g('sheet'); this.cam = document.createElementNS(NS, 'g'); wrap.appendChild(this.cam);
    const holder = document.createElementNS(NS, 'g'); holder.setAttribute('transform', 'translate(110,10)'); holder.setAttribute('clip-path', 'url(#twipe)'); this.cam.appendChild(holder);
    const doc = new DOMParser().parseFromString(SHEET, 'image/svg+xml'); holder.appendChild(document.importNode(doc.documentElement, true));
    this.sheet = wrap; this.wipe = svg.querySelector('#twr');
    ['400 18px Inter', '600 12px Inter', '700 11px Inter', "800 24px 'Schibsted Grotesk'", '400 12px Arimo'].forEach(f => document.fonts.load(f));
  },

  header(t) {
    const c = capAt(CAPS, t), a = eo(seg(t, c[0], c[0] + .45));
    const fade = t < 63.4 ? 1 : 1 - eo(seg(t, 63.4, 64.2)) + (t >= 64 ? eo(seg(t, 64.2, 65)) : 0);
    this.head.innerHTML = G(fade, T(120, 92, c[1], 'cap', op(a)) + T(120, 128, c[2], 'sub', op(a)) + T(1800, 92, 'UI-TYPE-001 · TYPE METRICS', 'cap', 'text-anchor="end"'));
  },

  /* A · problem: scatter of today's values, then the two ramps */
  beatA(t) {
    const a = win(t, 0, 7.2, .6, .7); if (a <= 0) return '';
    const gx = 420, gy = 230, gw = 1080, gh = 640; const X = v => gx + (v - 10) / 40 * gw, Y = r => gy + gh - (r - 1) / .9 * gh;
    let s = Ln(gx, gy + gh, gx + gw, gy + gh, 'thin') + Ln(gx, gy, gx, gy + gh, 'thin');
    [1.25, 1.5, 1.75].forEach(r => { s += Ln(gx, Y(r), gx + gw, Y(r), 'ph') + T(gx - 14, Y(r) + 5, r.toFixed(2), 'dts', 'text-anchor="end"'); });
    [12, 16, 20, 24, 32, 40, 48].forEach(v => { s += T(X(v), gy + gh + 26, v, 'dts', 'text-anchor="middle"'); });
    s += T(gx, gy - 16, 'LINE HEIGHT ÷ FONT SIZE', 'dts') + T(gx + gw, gy + gh + 52, 'FONT SIZE · PX', 'dts', 'text-anchor="end"');
    TODAY.forEach(([f, l], i) => { const p = eo(seg(t, .8 + i * .14, 1.2 + i * .14)); if (p > 0) s += `<circle cx="${f1(X(f))}" cy="${f1(Y(l / f))}" r="${f1(9 * p)}" class="odot" ${op(p * (1 - .55 * eo(seg(t, 4, 5))))}/>`; });
    const part = (pts, p) => { const n = pts.length - 1, q = p * n, i = Math.floor(q), fr = q - i; const out = pts.slice(0, i + 1).map(([f, l]) => [X(f), Y(l / f)]); if (i < n) { const [a1, b1] = pts[i], [a2, b2] = pts[i + 1]; out.push([lerp(X(a1), X(a2), fr), lerp(Y(b1 / a1), Y(b2 / a2), fr)]); } return 'M' + out.map(p => f1(p[0]) + ',' + f1(p[1])).join(' L'); };
    const p1 = eio(seg(t, 4, 5.6)), p2 = eio(seg(t, 4.8, 6.4));
    if (p1 > 0) { s += `<path d="${part(STD, p1)}" class="ramp"/>`; STD.forEach(([f, l], i) => { if (i / (STD.length - 1) <= p1) s += `<circle cx="${f1(X(f))}" cy="${f1(Y(l / f))}" r="6" class="dot"/>`; }); s += T(X(20) + 20, Y(1.4) - 18, 'TEXT · R', 'dts', op(p1)); }
    if (p2 > 0) { s += `<path d="${part(HED, p2)}" class="rampd"/>`; HED.forEach(([f, l], i) => { if (i / (HED.length - 1) <= p2) s += `<circle cx="${f1(X(f))}" cy="${f1(Y(l / f))}" r="6" class="dot"/>`; }); s += T(X(40), Y(1.1) - 22, 'HEADLINES · RH', 'dts', op(p2)); }
    const n = eo(seg(t, 1.4, 2.2)); s += G(n * (1 - eo(seg(t, 4, 4.6))), T(gx + gw, gy + 40, '42 LINE HEIGHTS', 'read', 'text-anchor="end"') + T(gx + gw, gy + 84, '40 LETTER SPACINGS', 'read', 'text-anchor="end"') + T(gx + gw, gy + 114, 'OPEN DOTS · 15 MEASURED IN THE APP', 'read2', 'text-anchor="end"'));
    return G(a, s);
  },

  /* B · anatomy of a line at 9:1 */
  beatB(t) {
    const a = win(t, 7, 19.2, .6, .7); if (a <= 0) return '';
    const k = 9, fs = 18, m = met(BF, 400, fs), x = 330, w = 1150, top = 300;
    const lhv = t < 15.2 ? 28 : keyed([[15.2, 26.1], [16.4, 26.1], [17.4, 28]], t);
    const lh = t < 15.2 ? 28 : lhv, b = baseOf(0, lh, m), ca = (lh - (m.asc + m.desc)) / 2, Y = v => top + v * k;
    let s = '';
    const gA = eo(seg(t, 14.8, 15.4));
    if (gA > 0) { let gl = ''; for (let i = -1; i <= 9; i++) gl += Ln(x - 40, top + i * 4 * k, x + w + 40, top + i * 4 * k, 'grid4'); s += G(gA, gl); }
    s += G(eo(seg(t, 7.3, 7.9)), Rc(x, top, w, lh * k, 'lbox'));
    s += G(eo(seg(t, 11.2, 11.8)), Rc(x, Y(ca), w, (m.asc + m.desc) * k, 'slot'));
    const gl = eo(seg(t, 8, 8.8)); s += `<text x="${x + 60}" y="${f1(Y(b))}" class="ink" ${font(BF, 400, fs * k, 0)} ${op(gl)}>Hxgp</text>`;
    s += G(eo(seg(t, 8.6, 9.2)), Ln(x - 10, Y(b), x + w + 10, Y(b), 'base') + T(x + w - 8, Y(b) - 10, 'BASELINE', 'sl', 'text-anchor="end"'));
    [[9.5, b - m.xh, 'X-HEIGHT  ' + f1(m.xh)], [9.9, b - m.cap, 'CAP HEIGHT  ' + f1(m.cap)], [10.3, b + m.dsc, 'DESCENDER  ' + f1(m.dsc)]].forEach(([at, v, l]) => { s += G(eo(seg(t, at, at + .5)), Ln(x, Y(v), x + w, Y(v), 'metric') + T(x + w - 8, Y(v) - 10, l, 'sl', 'text-anchor="end"')); });
    s += G(eo(seg(t, 11.6, 12.2)), DV(Y(ca), Y(ca + m.asc + m.desc), x + w + 40, 'C ' + f1(m.asc + m.desc)));
    s += G(eo(seg(t, 12.4, 13)), DV(top, Y(ca), x + w + 40, 'HL ' + f1(ca)) + DV(Y(ca + m.asc + m.desc), Y(lh), x + w + 40, 'HL ' + f1(ca)));
    s += G(eo(seg(t, 7.6, 8.2)), DV(top, Y(lh), x - 50, 'LH ' + (Math.abs(lh - Math.round(lh)) < .05 ? Math.round(lh) : f1(lh)), 'l'));
    const fA = eo(seg(t, 15, 15.6));
    if (fA > 0) {
      const snapped = t > 17.2;
      s += G(fA, T(x, 900, 'LH = 4 · round(FS · R ÷ 4)', 'read') + T(x, 950, 'B1 · 18 × 1.45 = 26.1  →  ÷ 4 = 6.53  →  round 7  →  × 4 = ' + (snapped ? '28' : '…'), 'read2') +
        T(x + w, 900, snapped ? '18 / 28 · ON THE 4 PX GRID' : '26.1 · OFF GRID', 'read2', 'text-anchor="end"'));
    }
    return G(a, s);
  },

  /* C · size ramp, every role at 2.5:1, with the ratio graph */
  beatC(t) {
    const a = win(t, 19, 31.2, .6, .7); if (a <= 0) return '';
    const T0 = 19.6, D = 1.12, k = 2.5;
    const fi = clamp01((t - T0) / D), idx = Math.min(RAMP.length - 1, Math.max(0, Math.floor((t - T0) / D)));
    const prev = RAMP[Math.max(0, idx - 1)], cur = RAMP[idx], p = idx === 0 ? 1 : eio(seg(t, T0 + idx * D, T0 + idx * D + .38));
    const fs = lerp(prev[4], cur[4], p), lh = lerp(prev[5], cur[5], p), fam = p < .5 ? prev[2] : cur[2], wt = p < .5 ? prev[3] : cur[3], ls = lerp(prev[6], cur[6], p);
    const x = 140, top = 300, w = 980; let s = '';
    let gl = ''; for (let i = 0; i <= 14; i++) gl += Ln(x - 20, top + i * 4 * k, x + w, top + i * 4 * k, 'grid4'); s += gl;
    const L = typeLine(x, top, w, k, fam, wt, fs, lh, cur[7] ? 'EYEBROW LABEL' : (fam === HF ? 'Headline type' : 'Sample text line'), { ls, caps: !!cur[7] && p >= .5 });
    s += L.s + DV(top, top + lh * k, x + w + 30, 'LH ' + Math.round(lh));
    s += T(x, 780, cur[0] + ' · ' + cur[1].toUpperCase(), 'read2') + T(x, 836, Math.round(fs) + ' / ' + Math.round(lh), 'read') + T(x + 230, 836, '× ' + (+(cur[5] / cur[4]).toFixed(3)), 'read') +
      T(x + 520, 836, 'TRACK ' + (cur[7] ? '+0.1em' : cur[6] < 0 ? '−0.01em' : cur[6] ? '+' + cur[6] + ' px' : '0'), 'read2');
    // graph
    const gx = 1240, gy = 300, gw = 540, gh = 420, X = v => gx + (v - 10) / 40 * gw, Y = r => gy + gh - (r - 1) / .6 * gh;
    s += Ln(gx, gy + gh, gx + gw, gy + gh, 'thin') + Ln(gx, gy, gx, gy + gh, 'thin');
    [1.2, 1.4].forEach(r => { s += Ln(gx, Y(r), gx + gw, Y(r), 'ph') + T(gx - 10, Y(r) + 5, r.toFixed(1), 'dts', 'text-anchor="end"'); });
    [12, 24, 36, 48].forEach(v => { s += T(X(v), gy + gh + 24, v, 'dts', 'text-anchor="middle"'); });
    const pl = pts => 'M' + pts.map(([f, l]) => f1(X(f)) + ',' + f1(Y(l / f))).join(' L');
    s += `<path d="${pl(STD)}" class="ramp" opacity=".35"/><path d="${pl(HED)}" class="rampd" opacity=".35"/>`;
    RAMP.forEach((r, i) => { if (i <= idx) s += `<circle cx="${f1(X(r[4]))}" cy="${f1(Y(r[5] / r[4]))}" r="${i === idx ? 9 : 5}" class="dot"/>` + (i === idx ? T(X(r[4]) + 14, Y(r[5] / r[4]) - 12, r[0], 'dt') : ''); });
    s += T(gx, gy - 16, 'LH ÷ FS', 'dts');
    return G(a, s);
  },

  /* D · tracking and figures */
  beatD(t) {
    const a = win(t, 31, 40.2, .6, .7); if (a <= 0) return '';
    let s = ''; const x = 160;
    const em = keyed([[31.4, 0], [32.2, 0], [33.2, .24], [33.8, .24], [34.6, .1]], t);
    const k = 5, capTop = 220;
    const L1 = typeLine(x, capTop, 1500, k, BF, 700, 11, 16, 'Advertisement', { ls: em * 11, caps: true });
    s += G(eo(seg(t, 31, 31.5)), L1.s + T(x + 1500, capTop - 14, em === 0 ? '0 · TOO TIGHT' : em > .2 ? 'TODAY +' + em.toFixed(2) + 'EM · TOO LOOSE' : 'K1 +' + em.toFixed(2) + 'EM', 'read2', 'text-anchor="end"'));
    const dem = keyed([[35.4, 0], [36.4, -.01]], t), k2 = 2.2;
    const L2 = typeLine(x, 400, 1500, k2, HF, 800, 48, 52, 'Display headline', { ls: dem * 48 });
    s += G(eo(seg(t, 35, 35.5)), L2.s + T(x + 1500, 386, 'T1 ' + (dem === 0 ? '0' : dem.toFixed(3) + 'EM'), 'read2', 'text-anchor="end"'));
    const L3 = typeLine(x, 560, 760, 4, BF, 600, 12, 16, 'Byline and date', { ls: .4 * 4 });
    s += G(eo(seg(t, 36.4, 36.9)), L3.s + T(x + 760, 546, 'M1 +0.4 PX · HDS 3XS', 'read2', 'text-anchor="end"'));
    // figures
    const fA = eo(seg(t, 37.6, 38.1));
    if (fA > 0) {
      const tab = t > 38.9, k3 = 4.5, fx = 1000;
      ['Nov 11, 2026', 'Nov 18, 2026'].forEach((str, i) => {
        const y = 640 + i * 90; s += G(fA, `<text x="${fx}" y="${y + 60}" class="ink" ${font(BF, 400, 12 * k3, .4 * k3, tab ? 'font-variant-numeric:tabular-nums;' : '')}>${str}</text>`);
      });
      cv.font = '400 ' + 12 * k3 + 'px Inter'; s += G(fA, T(fx, 620, tab ? 'TABULAR · SAME WIDTH' : 'PROPORTIONAL · WIDTHS DIFFER', 'read2'));
    }
    return G(a, s);
  },

  /* E · story card, today → standard */
  beatE(t) {
    const a = win(t, 40, 52.2, .6, .7); if (a <= 0) return '';
    const k = 2, x0 = 420, y0 = 210, W = 380, pad = 20, X = x0 + pad * k, w = (W - 2 * pad) * k;
    const hl = keyed([[44, 30], [45.4, 28]], t), dl = keyed([[46.4, 28], [47.8, 24]], t);
    const h = pad + 16 + 8 + 2 * hl + 8 + 2 * dl + pad;
    let s = Rc(x0, y0, W * k, h * k, 'obj', 'rx="20"'), y = y0 + pad * k; const R = x0 + W * k + 26, Lx = x0 - 26;
    const show = (at, inner) => G(eo(seg(t, at, at + .5)), inner);
    const m1 = typeLine(X, y, w, k, BF, 600, 12, 16, 'Brand · Section · Byline', { ls: .4, cls: 'ink2' }); s += show(40.4, m1.s + DV(y, y + 16 * k, R, 'M1 12/16')); y += 16 * k;
    s += show(41.6, DV(y, y + 8 * k, Lx, 'S1 8', 'l')); y += 8 * k;
    const h1 = typeLine(X, y, w, k, HF, 800, 24, hl, 'Headline line one sets', {}); const h2 = typeLine(X, y + hl * k, w, k, HF, 800, 24, hl, 'and balances a second', {});
    s += show(40.9, h1.s + h2.s + DV(y, y + hl * k, R, 'T3 24/' + (Math.abs(hl - Math.round(hl)) < .05 ? Math.round(hl) : f1(hl))) + DV(y + hl * k, y + 2 * hl * k, R, '')); y += 2 * hl * k;
    s += show(41.9, DV(y, y + 8 * k, Lx, 'S2 8', 'l')); y += 8 * k;
    const d1 = typeLine(X, y, w, k, BF, 400, 16, dl, 'Deck copy runs two lines at most', { ls: .2, cls: 'ink2' }); const d2 = typeLine(X, y + dl * k, w, k, BF, 400, 16, dl, 'and clamps after the second line', { ls: .2, cls: 'ink2' });
    s += show(41.4, d1.s + d2.s + DV(y, y + dl * k, R, 'D2 16/' + (Math.abs(dl - Math.round(dl)) < .05 ? Math.round(dl) : f1(dl))) + DV(y + dl * k, y + 2 * dl * k, R, ''));
    s += show(42.4, DH(x0, x0 + W * k, y0 + h * k + 40, 'CARD HEIGHT ' + Math.round(h)));
    s += G(eo(seg(t, 43.6, 44)), T(R + 210, y0 + 40, t < 45.4 ? 'TODAY' : 'STANDARD', 'read2'));
    return G(a, s);
  },

  /* F · reader, today → standard, with the byline row zoomed */
  beatF(t) {
    const a = win(t, 52, 63.6, .6, .7); if (a <= 0) return '';
    const p = eio(seg(t, 55.6, 57.6)), k = 1.25, x0 = 260, y0 = 190, W = 620;
    const H1 = lerp(50.4, 52, p), BL = lerp(32, 28, p);
    let s = '', y = y0; const R = x0 + W * k + 22, Lx = x0 - 22;
    const show = (at, inner) => G(eo(seg(t, at, at + .5)), inner);
    const lab = (c, v) => c + ' ' + (Math.abs(v - Math.round(v)) < .05 ? Math.round(v) : f1(v));
    const e = typeLine(x0, y, W * k, k, BF, 700, 11, 16, 'Eyebrow · Section', { ls: 1.1, caps: true }); s += show(52.3, e.s + DV(y, y + 16 * k, R, 'K1 11/16')); y += 16 * k;
    s += show(53, DV(y, y + 12 * k, Lx, 'S3 12', 'l')); y += 12 * k;
    const a1 = typeLine(x0, y, W * k, k, HF, 800, 48, H1, 'Display headline', { ls: -.48 }), a2 = typeLine(x0, y + H1 * k, W * k, k, HF, 800, 48, H1, 'in balanced lines', { ls: -.48 });
    s += show(52.6, a1.s + a2.s + DV(y, y + H1 * k, R, lab('T1 48/', H1)) + DV(y + H1 * k, y + 2 * H1 * k, R, '')); y += 2 * H1 * k;
    s += show(53.2, DV(y, y + 16 * k, Lx, 'S4 16', 'l')); y += 16 * k;
    const d1 = typeLine(x0, y, W * k, k, BF, 400, 20, 28, 'The reader deck runs at 20/28 and', { cls: 'ink2' }); s += show(52.9, d1.s + DV(y, y + 28 * k, R, 'D1 20/28')); y += 28 * k;
    s += show(53.4, DV(y, y + 16 * k, Lx, 'S5 16', 'l')); y += 16 * k;
    const rowH = lerp(20, 16, p);
    const r1 = typeLine(x0, y, 200, k, BF, 600, lerp(11, 12, p), lerp(16.5, 16, p), 'By Author Name', { ls: .4 }), r2 = typeLine(x0 + 220, y, 260, k, BF, 400, lerp(11, 12, p), rowH, 'Nov 8, 2026 · 6 min', { ls: .4, tab: true, cls: 'ink2' });
    s += show(53.2, r1.s + r2.s + DV(y, y + rowH * k, R, lab('M1 M2 12/', rowH))); y += rowH * k;
    s += show(53.6, DV(y, y + 24 * k, Lx, 'S6 24', 'l')); y += 24 * k;
    ['Body paragraphs set at 18/28 on a measure', 'of sixty to seventy-five characters, with', 'kerning on and no manual tracking.'].forEach((str, i) => { const b = typeLine(x0, y, W * k, k, BF, 400, 18, BL, str, {}); s += show(53.4 + i * .1, b.s + DV(y, y + BL * k, R, i ? '' : lab('B1 18/', BL))); y += BL * k; });
    s += G(eo(seg(t, 54.6, 55)), T(R + 160, y0 + 30, t < 57.6 ? 'TODAY' : 'STANDARD', 'read2'));
    // zoomed byline row at 6:1
    const zA = eo(seg(t, 58.2, 58.8));
    if (zA > 0) {
      const zk = 6, zx = 1320, zy = 520, q = eio(seg(t, 59.6, 61.2));
      const fsz = lerp(11, 12, q), la = lerp(16.5, 16, q), lb = lerp(20, 16, q);
      const zz1 = typeLine(zx, zy, 230, zk, BF, 600, fsz, la, 'Byline', { ls: .4, baseCls: 'base' }), zz2 = typeLine(zx + 250, zy, 230, zk, BF, 400, fsz, lb, 'Nov 8', { ls: .4, tab: true, cls: 'ink2', baseCls: 'base' });
      const d = (zz2.base - zz1.base) / zk;
      s += G(zA, Rc(zx - 30, zy - 70, 540, 300, 'lboxe') + T(zx - 30, zy - 84, 'BYLINE ROW · 6:1', 'read2') + zz1.s + zz2.s +
        (Math.abs(d) > .05 ? DV(Math.min(zz1.base, zz2.base), Math.max(zz1.base, zz2.base), zx + 500, 'Δ ' + d.toFixed(1)) : T(zx + 240, zy + 16 * zk + 36, 'ONE BASELINE · Δ 0', 'read2', 'text-anchor="middle"')));
    }
    return G(a, s);
  },

  render(t) {
    this.header(t);
    this.A.innerHTML = this.beatA(t); this.B.innerHTML = this.beatB(t); this.C.innerHTML = this.beatC(t);
    this.D.innerHTML = this.beatD(t); this.E.innerHTML = this.beatE(t); this.F.innerHTML = this.beatF(t);
    const on = t >= 63.8; this.sheet.style.display = on ? '' : 'none';
    if (on) {
      this.wipe.setAttribute('width', 1700 * eio(seg(t, 64, 66.2)));
      const K = [[64, 960, 540, 1], [66.6, 960, 540, 1], [67.8, 820, 150, 2.4], [69, 822, 152, 2.35], [69.8, 790, 400, 2.1], [70.8, 792, 402, 2.08], [71.6, 810, 770, 1.55], [72.6, 812, 772, 1.53], [73.4, 1290, 330, 1.6], [74.2, 1292, 332, 1.58], [74.9, 1640, 300, 1.75], [75.6, 1642, 302, 1.73], [76.6, 960, 540, 1], [78, 960, 540, .99]];
      let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
      const a = K[i], b = K[i + 1], p = eio(seg(t, a[0], b[0]));
      const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)), cx = lerp(a[1], b[1], p), cy = lerp(a[2], b[2], p);
      this.cam.setAttribute('transform', 'translate(' + (960 - cx * z) + ',' + (540 - cy * z) + ') scale(' + z + ')');
    }
  },
});
