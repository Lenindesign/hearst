// Blocks (HP-BLOCKS-SPEC · Rev B) → motion film, ~108 s: how blocks hold cards.
// Pure function of time. Geometry is measured from the Building Blocks Library
// (/hearst-plus/blocks/library/) at inner block widths 326 · 664 · 978 · 1138; build-blocks-scene.mjs embeds it.
// I 0–9 a block = pattern + cards · P1–P8 9–97 (11 s each) · Z 97–108 the rules.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const DATA = __DATA__;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);
const T = (x, y, s, cls, ex) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls || 'kdt'}" ${ex || ''}>${esc(s)}</text>`;
const Rc = (x, y, w, h, cls, ex) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" class="${cls}" ${ex || ''}/>`;
const Ln = (x1, y1, x2, y2, cls, ex) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${ex || ''}/>`;
const op = a => `opacity="${clamp01(a).toFixed(3)}"`;
const G = (a, inner) => a <= 0.001 ? '' : `<g ${op(a)}>${inner}</g>`;
const win = (t, a, b, fi, fo) => Math.min(eo(seg(t, a, a + (fi || .5))), 1 - eo(seg(t, b - (fo || .5), b)));
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };
function DH(x1, x2, y, label, cls) {
  const small = x2 - x1 < 26;
  const s = small
    ? Ln(x1 - 12, y, x1, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x2 + 12, y, x2, y, 'kdl', 'marker-end="url(#ka)"') + Ln(x1, y, x2, y, 'kdl')
    : Ln(x1, y, x2, y, 'kdl', 'marker-start="url(#ka)" marker-end="url(#ka)"');
  return s + Ln(x1, y - 7, x1, y + 7, 'kext') + Ln(x2, y - 7, x2, y + 7, 'kext') + (label ? T((x1 + x2) / 2, y - 10, label, cls || 'kdt', 'text-anchor="middle"') : '');
}
const xs = (x, y, w, h) => `<path d="M${f1(x)},${f1(y)} L${f1(x + w)},${f1(y + h)} M${f1(x + w)},${f1(y)} L${f1(x)},${f1(y + h)}" class="kph"/>`;

/* ---------- one card, drawn by kind, at display scale (x, y, w, h already scaled; k = scale) ---------- */
function part(kind, x, y, w, h, k, a) {
  if (a <= .001 || w < 2 || h < 2) return '';
  const p = Math.max(4, (w > 340 * k ? 20 : 16) * k);
  let s = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.max(2, 8 * k))}" class="kobj"/>`;
  const bars = (bx, by, bw, n, lh, cls) => { let q = ''; for (let i = 0; i < n; i++) q += Rc(bx, by + i * lh, bw * (i === n - 1 && n > 1 ? .72 : 1), lh * .62, cls); return q; };
  if (kind === 'list') {
    const mw = w * .28;
    s += Rc(x, y, mw, h, 'kwell', `rx="${f1(Math.max(2, 8 * k))}"`) + xs(x, y, mw, h);
    const tx = x + mw + p, tw = w - mw - 2 * p;
    s += Rc(tx, y + p, Math.min(tw * .4, 150 * k), 12 * k, 'khug') + bars(tx, y + p + 26 * k, tw, 2, 26 * k, 'kbar') + bars(tx, y + p + 86 * k, tw, 1, 20 * k, 'kbar2');
  } else if (kind === 'rail') {
    s += Rc(x + p, y + p, w * .45, 12 * k, 'khug');
    const rows = 4, rh = (h - 3 * p) / rows;
    for (let i = 0; i < rows; i++) { const ry = y + 2.4 * p + i * rh; s += Rc(x + p, ry, rh * .7, rh * .7, 'kwell') + bars(x + p + rh * .7 + 10 * k, ry + 2 * k, w - 2 * p - rh * .7 - 10 * k, 2, 18 * k, 'kbar'); if (i) s += Ln(x + p, ry - 8 * k, x + w - p, ry - 8 * k, 'kgrid'); }
    if (w > 120) s += T(x + w - p, y + p + 11 * k, 'WIDGET RAIL', 'ksl', 'text-anchor="end"');
  } else if (kind === 'ad') {
    s += Rc(x + p, y + p, w - 2 * p, h - 2 * p, 'kwell') + xs(x + p, y + p, w - 2 * p, h - 2 * p) + (w > 90 ? T(x + w / 2, y + h / 2 + 5, 'AD SLOT', 'ksl', 'text-anchor="middle"') : '');
  } else {
    const ratio = kind === 'compact' ? 3 / 4 : 9 / 16, mh = Math.min(w * ratio, h * .78);
    s += `<path d="M${f1(x)},${f1(y + mh)} V${f1(y + 8 * k)} Q${f1(x)},${f1(y)} ${f1(x + 8 * k)},${f1(y)} H${f1(x + w - 8 * k)} Q${f1(x + w)},${f1(y)} ${f1(x + w)},${f1(y + 8 * k)} V${f1(y + mh)} Z" class="kwell"/>` + xs(x, y, w, mh);
    if (kind === 'video') { const r = Math.min(28 * k, mh / 4); s += `<circle cx="${f1(x + w / 2)}" cy="${f1(y + mh / 2)}" r="${f1(r)}" class="kfill"/><path d="M${f1(x + w / 2 - r * .3)},${f1(y + mh / 2 - r * .45)} l${f1(r * .75)},${f1(r * .45)} l${f1(-r * .75)},${f1(r * .45)} z" fill="#fff"/>`; }
    const ty = y + mh + p, tw = w - 2 * p, room = y + h - p - ty;
    if (room > 20 * k) { s += Rc(x + p, ty, Math.min(tw * .45, 160 * k), 12 * k, 'khug'); const hl = (w > 500 * k ? 28 : 24) * k; s += bars(x + p, ty + 22 * k, tw, kind === 'compact' ? 3 : 2, hl, 'kbar'); if (kind !== 'compact' && room > 120 * k) s += bars(x + p, ty + 22 * k + 2 * hl + 8 * k, tw, 1, 22 * k, 'kbar2'); }
  }
  return G(a, s);
}

/* ---------- patterns ---------- */
const P = [
  { name: 'Featured + Row', id: '01 · FEATURED-FOUR', mode: 'mode featureFirstGrid', kinds: ['card'], th: [536, 812, 1088],
    rules: ['A full-width lead, then .hp-block-row.', 'Row: 1 → 2 → 3 → 4 columns.', 'At 3 columns the 4th card hides,', 'so a row is never partial.'],
    say: ['326 · Lead and row stack in one column.', '664 · The row splits in two: 2 × 324.', '978 · Three columns; the fourth card hides.', '1138 · Four columns of 273, gap 16.'] },
  { name: 'Card Row', id: '02 · FOUR-CARD-ROW', mode: 'mode cardGrid', kinds: ['compact'], th: [536, 812, 1088],
    rules: ['Compact cards: 4:3 media, p-3,', 'headline ≤ 3 lines, no summary.', 'One line of cards; extra cards hide', 'instead of wrapping.'],
    say: ['326 · One column.', '664 · Two columns: 2 × 324, gap 16.', '978 · Three columns; card 4 hides.', '1138 · Four columns: 4 × 273.'] },
  { name: 'Feature + Sidebar', id: '03 · FEATURE-SIDEBAR', mode: 'mode featureSidebar', kinds: ['card', 'list'], th: [820],
    rules: ['A lead card and a stack of four', 'list cards (media 28%).', 'From 820: 1.8fr | 1fr, gap 20.', 'The stack stretches to the lead.'],
    say: ['326 · Lead first, then the four list cards.', '664 · Still stacked below 820.', '978 · Side by side: 616 | 342.', '1138 · 719 | 399, four rows fill the lead height.'] },
  { name: 'River with Hero', id: '04 · HERO-THREE-HORIZONTAL', mode: 'mode riverWithHero', kinds: ['card', 'list'], th: [],
    rules: ['A hero card, then three', 'horizontal list cards.', 'One column at every width.', 'Media is 28% of the card width.'],
    say: ['326 · One column.', '664 · Still one column; list rows grow taller.', '978 · Rows grow with width: 237.', '1138 · Rows 271 tall: the media is 28% of W.'] },
  { name: 'Three-Column Feature Row', id: '05 · THREE-COLUMN-FEATURE', mode: 'library composition', kinds: ['rail', 'card', 'ad'], th: [820, 1100],
    rules: ['Widget rail · feature · ad.', 'Below 820: stacked.', '820–1099: rail + ad left, feature right.', 'From 1100: .75fr | 1.6fr | .75fr.'],
    say: ['326 · Rail, feature and ad stack.', '664 · Still stacked below 820.', '978 · Rail and ad share the left column.', '1138 · Three columns: 266 | 567 | 266.'] },
  { name: 'Featured Video + Four', id: '06 · FEATURED-VIDEO-FOUR', mode: 'library composition', kinds: ['video'], th: [536, 1088],
    rules: ['A featured playable video, then', 'four video cards in .hp-block-grid.', '1 → 2 → 4 columns. No 3-column', 'step, so rows always fill.'],
    say: ['326 · One column.', '664 · Two columns of video cards.', '978 · Still two: there is no 3-column step.', '1138 · Four video cards in one row.'] },
  { name: 'Grid', id: '07 · FOUR-CARD-GRID', mode: 'mode grid', kinds: ['card'], th: [536, 1088],
    rules: ['.hp-block-grid with any number', 'of standard cards (the library', 'shows 8). 1 → 2 → 4 columns.', 'Rows stretch to their tallest card.'],
    say: ['326 · One column of eight cards.', '664 · Two columns, four rows.', '978 · Still two columns: 481 each.', '1138 · Four columns, two rows.'] },
  { name: 'River', id: '08 · HORIZONTAL-STORY-LIST', mode: 'mode river', kinds: ['list'], th: [],
    rules: ['A list of horizontal cards.', 'One column at every width.', 'Media is 28% of the card width,', 'so rows grow taller as W grows.'],
    say: ['326 · Five list cards, 182–222 tall.', '664 · Rows 190.', '978 · Rows 237.', '1138 · Rows 271.'] },
];
const WIDTHS = [326, 664, 978, 1138];
P.forEach(p => {
  p.states = WIDTHS.map(w => { const r = DATA[p.name].find(x => x.w === w); return r.items.map((it, i) => ({ x: it[0], y: it[1], w: it[2], h: it[3], kind: kindOf(p, it, i, r.items) })); });
});
function kindOf(p, it, i, all) {
  if (p.name === 'Three-Column Feature Row') return it[4] === 's' ? 'rail' : i === all.length - 1 ? 'ad' : 'card';
  if (p.name === 'Featured Video + Four') return 'video';
  if (p.name === 'Card Row') return 'compact';
  if (p.name === 'River') return 'list';
  if ((p.name === 'Feature + Sidebar' || p.name === 'River with Hero') && i > 0) return 'list';
  return 'card';
}
const T0 = 9, PD = 11, TZ = T0 + 8 * PD, END = TZ + 11;

const CAPS = [
  [0, 'BLOCKS', 'A home page section is a block: a pattern that places cards.'],
  [3.4, 'PATTERN + CARD TYPE', 'The pattern sets placement and columns. The card type sets what each slot shows.'],
  [6.2, 'CONTAINER, NOT VIEWPORT', 'Columns follow the block’s own width (@container hp-block), so a block behaves the same anywhere.'],
  ...P.map((p, i) => [T0 + i * PD, 'PATTERN ' + p.id.replace(' · ', ' · '), p.name + ' · ' + p.mode]),
  [TZ, 'THE RULES', 'Two sets of switches, both read from the block width.'],
];

kit.scene('blocks', {
  init(kit) {
    kit.css('.kb{position:absolute;inset:0;background:#fff}.kb svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.kb .kcap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.kb .ksub{font-size:24px;fill:#333}' +
      '.kb .kdt{font-size:17px;fill:#111;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.kb .kdts{font-size:14px;letter-spacing:.08em;fill:#555;text-transform:uppercase}' +
      '.kb .ksl{font-size:11px;letter-spacing:.1em;fill:#555;text-transform:uppercase}.kb .kvt{font-size:18px;letter-spacing:.1em;fill:#111;text-transform:uppercase}' +
      '.kb .kread{font-size:38px;fill:#111;letter-spacing:.02em}.kb .kread2{font-size:19px;fill:#444;letter-spacing:.08em;text-transform:uppercase}.kb .krule{font-size:21px;fill:#222}' +
      '.kb .kobj{fill:#fff;stroke:#111;stroke-width:1.6;stroke-linejoin:round}.kb .kwell{fill:#f1f1f1;stroke:#111;stroke-width:1}.kb .kslot{fill:none;stroke:#444;stroke-width:1.2;stroke-dasharray:7 5}' +
      '.kb .khug{fill:#d9d9d9}.kb .kbar{fill:#bdbdbd}.kb .kbar2{fill:#e2e2e2}.kb .kfill{fill:#111}' +
      '.kb .kph{fill:none;stroke:#aaa;stroke-width:.9;stroke-dasharray:16 5 3 5}.kb .kframe{fill:none;stroke:#999;stroke-width:1;stroke-dasharray:6 5}' +
      '.kb .kgrid{stroke:#ccc;stroke-width:1}.kb .kdl{stroke:#111;stroke-width:1.1;fill:none}.kb .kext{stroke:#111;stroke-width:.8}.kb .kthin{fill:none;stroke:#111;stroke-width:1.4}.kb .kcol{fill:#f4f4f4}');
    const root = kit.h('<div class="kb"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = '<defs><marker id="ka" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#111"/></marker>' +
      '<clipPath id="kview"><rect x="60" y="230" width="1260" height="810"/></clipPath>' +
      '<linearGradient id="kfade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>';
    const g = id => { const e = document.createElementNS(NS, 'g'); e.id = id; svg.appendChild(e); return e; };
    this.head = g('khead'); this.live = g('klive');
    ['400 12px Arimo', '700 12px Arimo'].forEach(f => document.fonts.load(f));
  },

  header(t) {
    const c = capAt(CAPS, t), a = eo(seg(t, c[0], c[0] + .45)) * (1 - eo(seg(t, END - .6, END)));
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-BLOCKS-SPEC · BLOCKS AND CARDS', 'kcap', 'text-anchor="end"');
  },

  /* I · a block = pattern + cards */
  intro(t) {
    const a = win(t, 0, T0 + .2, .3, .6); if (a <= 0) return '';
    const st = P[0].states[2], k = .62, X0 = 150, Y0 = 250;
    let s = Rc(X0, Y0 + 4 * k, 300 * k, 28 * k, 'khug', op(eo(seg(t, .4, 1)))) + T(X0 + 200, Y0 + 20, 'SECTION HEADING', 'ksl', op(eo(seg(t, .4, 1))));
    st.forEach((it, i) => {
      const x = X0 + it.x * k, y = Y0 + it.y * k, w = it.w * k, h = it.h * k;
      s += G(eo(seg(t, .6 + i * .25, 1.1 + i * .25)), Rc(x, y, w, h, 'kslot') + T(x + 12, y + 24, i ? 'SLOT ' + (i + 1) + ' · ROW' : 'SLOT 1 · LEAD', 'ksl'));
      s += part(it.kind, x, y, w, h, k, eo(seg(t, 3.6 + i * .35, 4.2 + i * .35)));
    });
    s += G(eo(seg(t, 2.2, 2.8)), T(X0, Y0 + 1160 * k + 50, 'PATTERN = PLACEMENT', 'kvt'));
    s += G(eo(seg(t, 4.2, 4.8)), T(X0 + 330, Y0 + 1160 * k + 50, 'CARD TYPE = CONTENT', 'kvt'));
    // right: the three parts
    const RX = 1250;
    [['PATTERN', 'Where cards go, how many, proportions, gaps.', 1.6], ['CARD TYPE', 'Article, video, list, community, event, ad.', 3.8], ['WIDGET', 'A sidebar module: rails such as Trending or Saved.', 5.2]].forEach(([h, d, t0], i) => {
      s += G(eo(seg(t, t0, t0 + .6)), T(RX, 320 + i * 120, h, 'kvt') + T(RX, 352 + i * 120, d, 'krule'));
    });
    s += G(eo(seg(t, 6.6, 7.2)), T(RX, 720, '@CONTAINER HP-BLOCK', 'kread2') + T(RX, 752, 'columns read the block width, not the screen', 'krule'));
    return G(a, s);
  },

  /* one pattern, morphing through the measured widths */
  pattern(i, lt) {
    const a = win(lt, 0, PD + .05, .45, .45); if (a <= 0) return '';
    const p = P[i], S = p.states;
    const K = [[0, 0], [2.2, 0], [3.2, 1], [4.8, 1], [5.8, 2], [7.4, 2], [8.4, 3], [PD, 3]];
    let j = 0; while (j < K.length - 2 && lt > K[j + 1][0]) j++;
    const A = K[j], B = K[j + 1], q = A[1] === B[1] ? 0 : eio(seg(lt, A[0], B[0]));
    const s0 = A[1], s1 = B[1], hold = A[1] === B[1] ? win(lt, A[0], B[0], .35, .25) : 0;
    const fit = st => { const w = WIDTHS[st], h = Math.max(...S[st].map(r => r.y + r.h)); return Math.min(1240 / w, 1.5, Math.max(790 / h, 700 / w)); };
    const k = Math.exp(lerp(Math.log(fit(s0)), Math.log(fit(s1)), q));
    const W = lerp(WIDTHS[s0], WIDTHS[s1], q);
    const X0 = 80 + (1240 - W * k) / 2, Y0 = 250;
    const Hc = lerp(Math.max(...S[s0].map(r => r.y + r.h)), Math.max(...S[s1].map(r => r.y + r.h)), q) * k;
    const n = Math.max(S[s0].length, S[s1].length);
    let body = '';
    // section heading row when the pattern has one (items start at y ≥ 44)
    if (Math.min(...S[s1].map(r => r.y)) >= 40) body += Rc(X0, Y0 + 4 * k, Math.min(W * k, 300 * k), 28 * k, 'khug');
    for (let m = 0; m < n; m++) {
      const r0 = S[s0][m], r1 = S[s1][m];
      const r = r0 && r1 ? { x: lerp(r0.x, r1.x, q), y: lerp(r0.y, r1.y, q), w: lerp(r0.w, r1.w, q), h: lerp(r0.h, r1.h, q), kind: r1.kind } : (r0 || r1);
      const al = r0 && r1 ? 1 : r0 ? 1 - eo(seg(q, 0, .5)) : eo(seg(q, .5, 1));
      body += part(r.kind, X0 + r.x * k, Y0 + r.y * k, r.w * k, r.h * k, k, al);
    }
    let s = `<g clip-path="url(#kview)">${body}</g>` + (Hc > 790 ? Rc(60, 940, 1260, 100, '', 'fill="url(#kfade)"') : '');
    s += Rc(X0 - 10, Y0 - 10, W * k + 20, Math.min(Hc, 790) + 20, 'kframe');
    s += DH(X0, X0 + W * k, Y0 - 34, 'BLOCK W = ' + W.toFixed(0));
    // dims on the widest row while holding
    if (hold > 0) {
      const st = S[s0], rows = {};
      st.forEach(r => { const key = Object.keys(rows).find(y => Math.abs(+y - r.y) < 60); (rows[key ?? r.y] ||= []).push(r); });
      const row = Object.values(rows).sort((u, v) => v.length - u.length || u[0].y - v[0].y)[0].sort((u, v) => u.x - v.x);
      let d = '';
      if (row.length > 1) {
        const r1 = row[0], r2 = row[1], yy = Y0 + r1.y * k + 26;
        d += DH(X0 + r1.x * k, X0 + (r1.x + r1.w) * k, yy, 'C ' + r1.w) + DH(X0 + (r1.x + r1.w) * k, X0 + r2.x * k, yy + 34, 'GAP ' + (r2.x - r1.x - r1.w));
      } else {
        const r1 = st[st.length > 1 ? 1 : 0];
        d += DH(X0 + r1.x * k, X0 + (r1.x + r1.w) * k, Y0 + r1.y * k + 26, 'C ' + r1.w);
      }
      s += G(hold, d);
    }
    // right panel
    const RX = 1380;
    s += T(RX, 300, 'PATTERN ' + p.id.split(' · ')[0], 'kread2') + T(RX, 350, p.name, 'kread', p.name.length > 18 ? 'style="font-size:30px"' : '') + T(RX, 382, p.mode.toUpperCase(), 'kdts');
    p.rules.forEach((l, m) => { s += T(RX, 440 + m * 30, l, 'krule'); });
    const cur = capAt(K.filter((x, z) => z % 2 === 0).map(x => [x[0], x[1]]), lt)[1];
    const ca = A[1] === B[1] ? eo(seg(lt, A[0], A[0] + .4)) : 0;
    s += G(ca, T(RX, 620, p.say[cur].split(' · ')[0] + ' PX', 'kread') + T(RX, 656, p.say[cur].split(' · ')[1], 'krule'));
    // ruler with this pattern's switches
    const RY = 780, RW = 460, V = v => RX + (v - 300) / (1200 - 300) * RW;
    s += Ln(RX, RY, RX + RW, RY, 'kthin');
    (p.th.length ? p.th : []).forEach((v, m) => { s += Ln(V(v), RY - 10, V(v), RY + 10, 'kthin') + T(V(v), RY + 32, String(v), 'kdts', 'text-anchor="middle"'); });
    if (!p.th.length) s += T(RX, RY + 32, 'NO SWITCHES · ONE COLUMN', 'kdts');
    s += `<path d="M${f1(V(W))},${RY - 14} l-9,-16 h18 z" class="kfill"/>`;
    s += T(RX, RY + 72, 'BLOCK WIDTH · PX', 'ksl');
    s += T(RX, 900, 'MEASURED IN THE BLOCKS LIBRARY · 2026-11-09', 'ksl');
    return G(a, s);
  },

  /* Z · the rules */
  outro(t) {
    const a = win(t, TZ, END + .5, .5, .8); if (a <= 0) return '';
    const RX = 200, RW = 1500, RY = 420, V = v => RX + (v - 300) / (1250 - 300) * RW;
    let s = Ln(RX, RY, RX + RW, RY, 'kthin') + T(RX, RY + 60, '300', 'kdts') + T(RX + RW, RY + 60, '1250 PX BLOCK WIDTH', 'kdts', 'text-anchor="end"');
    [[536, '536 = 2·260 + 16', 'up'], [812, '812 = 3·260 + 32', 'up'], [1088, '1088 = 4·260 + 48', 'up']].forEach(([v, l], m) => {
      const aa = eo(seg(t, TZ + .6 + m * .5, TZ + 1.1 + m * .5)); s += G(aa, Ln(V(v), RY - 70, V(v), RY, 'kthin') + T(V(v), RY - 82, l, 'kdt', 'text-anchor="middle"'));
    });
    [[820, '820'], [1100, '1100']].forEach(([v, l], m) => {
      const aa = eo(seg(t, TZ + 2.6 + m * .5, TZ + 3.1 + m * .5)); s += G(aa, Ln(V(v), RY, V(v), RY + 120, 'kph') + T(V(v), RY + 146, l, 'kdt', 'text-anchor="middle"'));
    });
    const L = [
      [TZ + 1.2, 'ROWS AND GRIDS', '.hp-block-row and .hp-block-grid switch at 536 · 812 · 1088: a 260 px minimum card plus the 16 px layout gap.'],
      [TZ + 3.4, 'SIDE-BY-SIDE LAYOUTS', 'Feature + Sidebar switches at 820. Three-Column switches at 820 and 1100, with a 20 px gap.'],
      [TZ + 5, 'RIVERS', 'River and River with Hero stay one column; their list cards grow with width (media 28%).'],
      [TZ + 6.4, 'EVERY ROW', 'Cards stretch to the tallest card in the row. Content stays top-aligned.'],
    ];
    L.forEach(([t0, h, d], m) => { s += G(eo(seg(t, t0, t0 + .6)), T(RX, 680 + m * 80, h, 'kvt') + T(RX + 360, 680 + m * 80, d, 'krule')); });
    return G(a, s);
  },

  render(t) {
    this.header(t);
    let s = this.intro(t);
    for (let i = 0; i < P.length; i++) { const lt = t - (T0 + i * PD); if (lt > -.1 && lt < PD + .2) s += this.pattern(i, lt); }
    s += this.outro(t);
    this.live.innerHTML = s;
  },
});
