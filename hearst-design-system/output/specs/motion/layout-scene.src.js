// Breakpoints and grid (UI-LAYOUT-001 · Rev A) → motion film.
// Pure function of time: render(t) sets everything from t alone.
// Part 1 river sweep 0–24 s · part 2 reader 24–36 s · part 3 block grid 36–46 s · part 4 sheet tour 46–60 s.
// Column formulas are the measured ones from layout-drawing.html.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEET = __SHEET__;
const S = 0.8, X0 = 192, FY = 300, FH = 440; // frame scale, left edge, top, height
const GY = 812, GH = 170, GW = 950;           // graph top, height, value range

/* ---------- measured layout formulas ---------- */
const pad = v => v >= 1280 ? 48 : v >= 768 ? 24 : 16;
function river(v) {
  const cw = Math.min(v, 1360), m = (v - cw) / 2, p = pad(v), inner = cw - 2 * p;
  if (v < 768) return { m, p, cols: [['RV', 'RIVER · FILL', inner, 'rv']] };
  if (v < 1024) return { m, p, cols: [['RV', 'RIVER · FLEX', inner - 316, 'rv'], ['G1', '', 16, 'gap'], ['RR', 'R RAIL', 300, 'rail']] };
  const ll = Math.max(240, Math.min(300, 0.24 * v));
  return { m, p, cols: [['LL', 'L RAIL', ll, 'rail'], ['G1', '', 16, 'gap'], ['RV', 'RIVER · FLEX', inner - ll - 332, 'rv'], ['G1', '', 16, 'gap'], ['RR', 'R RAIL', 300, 'rail']] };
}
function reader(v) {
  const cw = v >= 768 ? Math.min(v - 48, 1360) : v, m = (v - cw) / 2, p = v >= 1024 ? 40 : v >= 640 ? 32 : 16, inner = cw - 2 * p;
  if (v < 1024) return { m, p, surf: v >= 768, cols: [['AR', 'ARTICLE · FILL', inner, 'rv']] };
  if (v < 1280) return { m, p, surf: true, cols: [['AR', 'ARTICLE · FLEX', inner - 318, 'rv'], ['G2', '', 18, 'gap'], ['AD', 'AD RAIL', 300, 'rail']] };
  return { m, p, surf: true, cols: [['RC', 'CONTEXT', 280, 'rail'], ['G2', '', 18, 'gap'], ['AR', 'ARTICLE · FLEX', inner - 616, 'rv'], ['G2', '', 18, 'gap'], ['AD', 'AD RAIL', 300, 'rail']] };
}
function blocks(c) {
  const n = c >= 1100 ? 4 : c >= 820 ? 3 : c >= 540 ? 2 : 1, w = (c - (n - 1) * 20) / n;
  const cols = []; for (let i = 0; i < n; i++) { if (i) cols.push(['G3', '', 20, 'gap']); cols.push([i ? '' : 'CARD', 'CARD', w, 'rv']); }
  return { m: 0, p: 0, cols };
}
const rvOf = v => river(v).cols.find(c => c[0] === 'RV')[2];
const arOf = v => reader(v).cols.find(c => c[0] === 'AR')[2];
const cardOf = c => blocks(c).cols[0][2];

/* ---------- timelines: [t, value] keys, eased between, held when equal ---------- */
const RIVER_K = [[0, 320], [1.2, 320], [2.2, 390], [3.4, 390], [4.4, 640], [5.4, 640], [6.4, 768], [8.4, 768], [9.8, 1023], [10.8, 1023], [11.0, 1024], [13.0, 1024], [14.2, 1279], [14.8, 1279], [15.0, 1280], [16.8, 1280], [17.8, 1360], [19.0, 1360], [19.9, 1536], [20.7, 1536], [22.0, 1920], [24.0, 1920]];
const READER_K = [[24.0, 390], [25.4, 390], [26.6, 768], [27.4, 768], [28.4, 1023], [28.6, 1024], [30.2, 1024], [31.2, 1279], [31.4, 1280], [33.0, 1280], [34.0, 1440], [36.0, 1440]];
const BLOCK_K = [[36.0, 300], [37.2, 300], [38.2, 539], [38.4, 540], [39.8, 540], [40.8, 819], [41.0, 820], [42.4, 820], [43.4, 1099], [43.6, 1100], [45.0, 1100], [45.6, 1200], [46.4, 1200]];
function keyed(K, t) { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) { const [a, va] = K[i], [b, vb] = K[i + 1]; if (t <= b) return lerp(va, vb, eio(seg(t, a, b))); } return K[K.length - 1][1]; }
const CAPS = {
  river: [[0, 'BASE · PHONE', 'One column. Rails are hidden; the river fills the width inside P1 = 16.'],
    [4.0, 'BP1 · 640 · SM', 'No column change. sm only adjusts type and spacing.'],
    [6.2, 'BP2 · 768 · MD', 'The right rail joins at 300. Page padding grows to P2 = 24.'],
    [9.6, 'JUST BELOW BP3', 'Two columns at their widest: the river reaches 659.'],
    [10.9, 'BP3 · 1024 · LG', 'The left rail joins (clamp 240–300). The river drops to 398.'],
    [14.0, 'BP4 · 1280 · XL', 'Padding grows to P3 = 48; the left rail is at its 300 max.'],
    [17.4, 'MX · 1360', 'Content stops growing. The river holds at 632.'],
    [19.6, 'BP5 · 1536 · 2XL', 'No change: extra width becomes margin on both sides.']],
  reader: [[24.0, 'READER · BASE', 'One column. The article fills the panel.'],
    [26.4, 'READER · BP2', 'The panel insets 24 from the window; still one column.'],
    [28.5, 'READER · BP3', 'The 300 ad rail joins beside the article (gap 18).'],
    [31.3, 'READER · BP4', 'The 280 context rail joins on the left. Three columns.']],
  blocks: [[36.0, 'BLOCK GRID', 'Columns follow the block’s own width, not the window. Card minimum 260, gap 20.'],
    [38.3, 'Q2 · 540', 'Two cards fit: 2 · 260 + 20.'],
    [40.9, 'Q3 · 820', 'Three cards: 3 · 260 + 2 · 20.'],
    [43.5, 'Q4 · 1100', 'Four cards: 4 · 260 + 3 · 20. Rows never show a partial set.']],
};
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };

kit.scene('layout-breakpoints', {
  init(kit) {
    kit.css('.lb{position:absolute;inset:0;background:#fff;font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.lb svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.lb .big{font-size:46px;letter-spacing:.04em;fill:#111}.lb .cap{font-size:15px;letter-spacing:.12em;fill:#111;text-transform:uppercase}' +
      '.lb .sub{font-size:20px;fill:#444}.lb .sl{font-size:12px;letter-spacing:.1em;fill:#444;text-transform:uppercase}' +
      '.lb .dt{font-size:14px;fill:#111;paint-order:stroke;stroke:#fff;stroke-width:4px}.lb .dts{font-size:11.5px;letter-spacing:.08em;fill:#555;text-transform:uppercase}' +
      '.lb .obj{fill:#fff;stroke:#111;stroke-width:2}.lb .slot{fill:none;stroke:#444;stroke-width:1;stroke-dasharray:5 4}.lb .well{fill:#f0f0f0;stroke:#111;stroke-width:1.2}' +
      '.lb .hug{fill:#e4e4e4;stroke:#111;stroke-width:1}.lb .ph{fill:none;stroke:#888;stroke-width:1;stroke-dasharray:16 4 3 4}.lb .thin{fill:none;stroke:#111;stroke-width:1}' +
      '.lb .dl{stroke:#111;stroke-width:.9;fill:none}.lb .tick{stroke:#111;stroke-width:1}.lb .cell{fill:#f3f3f3;stroke:#111;stroke-width:.8}.lb .on{fill:#dcdcdc}' +
      '.lb .play{stroke:#111;stroke-width:1.6}.lb .trail{fill:none;stroke:#111;stroke-width:2.2}.lb .ghost{fill:none;stroke:#bbb;stroke-width:1.2;stroke-dasharray:6 4}');
    const root = kit.h('<div class="lb"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    const tx = (x, y, s, c, a, p) => { const e = mk('text', Object.assign({ x, y, class: c }, a || {}), p); e.textContent = s; return e; };
    const defs = mk('defs', {}); const m = mk('marker', { id: 'la', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, defs); mk('path', { d: 'M0,1.7 L10,5 L0,8.3 z', fill: '#111' }, m);
    const hat = mk('pattern', { id: 'lh', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs); mk('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#999', 'stroke-width': .8 }, hat);
    this.mk = mk; this.tx = tx;

    /* live layer */
    const live = this.live = mk('g', {});
    // headline readout
    this.vwText = tx(X0, 92, '', 'big', {}, live);
    this.capText = tx(X0 + 360, 76, '', 'cap', {}, live);
    this.subText = tx(X0 + 360, 104, '', 'sub', {}, live);
    this.modeText = tx(1728, 76, '', 'cap', { 'text-anchor': 'end' }, live);
    // ruler
    const RY = 170; this.RY = RY;
    mk('line', { x1: X0, y1: RY, x2: X0 + 1920 * S, y2: RY, class: 'tick' }, live);
    this.ticks = mk('g', {}, live);
    this.rows = mk('g', {}, live);
    this.play = mk('line', { x1: 0, y1: RY - 30, x2: 0, y2: FY + FH + 20, class: 'play' }, live);
    // frame
    this.margL = mk('rect', { y: FY, height: FH, fill: 'url(#lh)', stroke: 'none' }, live);
    this.margR = mk('rect', { y: FY, height: FH, fill: 'url(#lh)', stroke: 'none' }, live);
    this.frame = mk('rect', { x: X0, y: FY, height: FH, class: 'obj', fill: 'none' }, live); this.frame.style.fill = 'none';
    this.surf = mk('rect', { y: FY + 8, height: FH - 16, class: 'ph' }, live);
    this.mast = mk('rect', { y: FY + 2, height: 34, class: 'hug' }, live);
    this.mastT = tx(0, FY + 24, 'MASTHEAD · FILL', 'sl', { 'text-anchor': 'middle' }, live);
    this.colG = mk('g', {}, live); this.colEls = [];
    for (let i = 0; i < 7; i++) {
      const r = mk('rect', { y: FY + 54, height: FH - 70 }, this.colG), l = tx(0, FY + FH / 2 + 20, '', 'sl', { 'text-anchor': 'middle' }, this.colG),
        d = mk('line', { y1: FY - 16, y2: FY - 16, class: 'dl', 'marker-start': 'url(#la)', 'marker-end': 'url(#la)' }, this.colG), dl = tx(0, FY - 22, '', 'dt', { 'text-anchor': 'middle' }, this.colG);
      this.colEls.push({ r, l, d, dl });
    }
    this.padD = mk('line', { y1: FY + FH + 16, y2: FY + FH + 16, class: 'dl', 'marker-start': 'url(#la)', 'marker-end': 'url(#la)' }, live);
    this.padT = tx(0, FY + FH + 34, '', 'dt', { 'text-anchor': 'middle' }, live);
    // graph
    mk('line', { x1: X0, y1: GY + GH, x2: X0 + 1920 * S, y2: GY + GH, class: 'thin' }, live);
    this.gGrid = mk('g', {}, live);
    this.ghost = mk('path', { class: 'ghost' }, live);
    this.trail = mk('path', { class: 'trail' }, live);
    this.dot = mk('circle', { r: 6, fill: '#111' }, live);
    this.dotT = tx(0, 0, '', 'dt', {}, live);
    this.gTitle = tx(X0, GY - 12, '', 'dts', {}, live);
    this.ghostT = tx(X0 + 1920 * S, GY - 12, 'dashed = left rail at BP4 (recommended)', 'dts', { 'text-anchor': 'end' }, live);

    /* sheet layer */
    const camWrap = this.sheetWrap = mk('g', {});
    const cam = this.cam = mk('g', {}, camWrap);
    const holder = mk('g', { transform: 'translate(110,10)' }, cam);
    const doc = new DOMParser().parseFromString(SHEET, 'image/svg+xml');
    const sh = document.importNode(doc.documentElement, true); sh.setAttribute('x', 0); sh.setAttribute('y', 0); holder.appendChild(sh);
    const clip = mk('clipPath', { id: 'wipe' }, defs); this.wipe = mk('rect', { x: 110, y: 0, width: 0, height: 1080 }, clip);
    holder.setAttribute('clip-path', 'url(#wipe)');
    this.mode = null;
  },

  setMode(mode) {
    if (this.mode === mode) return; this.mode = mode;
    const S2 = mode === 'blocks' ? S : S;
    this.ticks.innerHTML = ''; this.rows.innerHTML = ''; this.gGrid.innerHTML = '';
    const RY = this.RY, mk = this.mk, tx = this.tx;
    const marks = mode === 'blocks' ? [[0, '0', ''], [260, '260', 'CM'], [540, '540', 'Q2'], [820, '820', 'Q3'], [1100, '1100', 'Q4'], [1200, '1200', '']]
      : [[0, '0', 'BASE'], [640, '640', 'BP1'], [768, '768', 'BP2'], [1024, '1024', 'BP3'], [1280, '1280', 'BP4'], [1360, '1360', 'MX'], [1536, '1536', 'BP5'], [1920, '1920', '']];
    marks.forEach(([v, n, c]) => { const x = X0 + v * S2; mk('line', { x1: x, y1: RY - 6, x2: x, y2: RY + 70, class: v ? 'ph' : 'tick' }, this.ticks); tx(x, RY - 30, n, 'dt', { 'text-anchor': 'middle' }, this.ticks); if (c) tx(x, RY - 12, c, 'dts', { 'text-anchor': 'middle' }, this.ticks); });
    const cells = mode === 'river' ? [[0, 768, '1 COL'], [768, 1024, '2 COL · +RR'], [1024, 1920, '3 COL · +LL']]
      : mode === 'reader' ? [[0, 1024, '1 COL'], [1024, 1280, '2 · +AD'], [1280, 1920, '3 · +RC']]
        : [[0, 540, '1 COL'], [540, 820, '2'], [820, 1100, '3'], [1100, 1200, '4']];
    this.cellEls = cells.map(([a, b, l]) => { const r = mk('rect', { x: X0 + a * S2, y: RY + 14, width: (b - a) * S2, height: 22, class: 'cell' }, this.rows); tx(X0 + a * S2 + 8, RY + 29, l, 'sl', { 'text-anchor': 'start' }, this.rows); return { r, a, b }; });
    const vmax = mode === 'blocks' ? 1200 : 1920, f = mode === 'river' ? rvOf : mode === 'reader' ? arOf : cardOf, gmax = mode === 'blocks' ? 600 : GW;
    this.gf = f; this.gmax = gmax; this.vmin = mode === 'blocks' ? 300 : mode === 'reader' ? 390 : 320;
    [0, mode === 'blocks' ? 260 : 400, mode === 'blocks' ? 520 : 800].forEach(w => { const y = GY + GH - w / gmax * GH; mk('line', { x1: X0, y1: y, x2: X0 + vmax * S2, y2: y, class: w ? 'ph' : 'thin' }, this.gGrid); tx(X0 - 10, y + 4, String(w), 'dts', { 'text-anchor': 'end' }, this.gGrid); });
    this.gTitle.textContent = mode === 'river' ? 'RV · river width vs window width' : mode === 'reader' ? 'AR · article width vs window width' : 'card width vs block width';
    // ghost of the recommended river (left rail at BP4)
    if (mode === 'river') { const g = v => v < 768 ? v - 32 : v < 1280 ? v - 364 : Math.min(v - 96, 1264) - 632; this.ghost.setAttribute('d', this.path(g, 320, 1920, gmax)); } else this.ghost.setAttribute('d', '');
  },

  path(f, a, b, gmax) { let d = ''; const pt = v => (X0 + v * S).toFixed(1) + ',' + (GY + GH - f(v) / gmax * GH).toFixed(1); for (let v = a; v < b; v += 4) d += (d ? ' L' : 'M') + pt(v); return d + (d ? ' L' : 'M') + pt(b); },

  layout(lay, v, mode) {
    const x0 = X0, W = v * S;
    this.frame.setAttribute('width', W);
    const mx = x0 + lay.m * S, cwpx = W - 2 * lay.m * S;
    this.margL.setAttribute('x', x0); this.margL.setAttribute('width', Math.max(0, lay.m * S));
    this.margR.setAttribute('x', x0 + W - lay.m * S); this.margR.setAttribute('width', Math.max(0, lay.m * S));
    const showSurf = mode === 'reader' ? lay.surf : (mode === 'river' && lay.m > 0);
    this.surf.style.display = showSurf ? '' : 'none'; this.surf.setAttribute('x', mx); this.surf.setAttribute('width', cwpx);
    const mastShow = mode !== 'blocks'; this.mast.style.display = this.mastT.style.display = mastShow ? '' : 'none';
    this.mast.setAttribute('x', x0 + 2); this.mast.setAttribute('width', W - 4); this.mastT.setAttribute('x', x0 + W / 2);
    let cur = mx + lay.p * S; let k = 0;
    lay.cols.forEach(([code, label, w, kind]) => {
      const px = w * S; if (kind === 'gap') { cur += px; return; }
      const e = this.colEls[k++]; e.r.style.display = e.l.style.display = e.d.style.display = e.dl.style.display = '';
      e.r.setAttribute('x', cur); e.r.setAttribute('width', px); e.r.setAttribute('class', kind === 'rv' ? 'slot' : 'well');
      e.l.setAttribute('x', cur + px / 2); e.l.textContent = px > 110 ? label : px > 60 ? label.split(' ')[0] : '';
      e.d.setAttribute('x1', cur + 1); e.d.setAttribute('x2', cur + px - 1);
      e.dl.setAttribute('x', cur + px / 2); e.dl.textContent = code ? code + ' ' + Math.round(w) : '';
      cur += px;
    });
    for (; k < this.colEls.length; k++) { const e = this.colEls[k]; e.r.style.display = e.l.style.display = e.d.style.display = e.dl.style.display = 'none'; }
    const showPad = lay.p > 0; this.padD.style.display = this.padT.style.display = showPad ? '' : 'none';
    this.padD.setAttribute('x1', mx); this.padD.setAttribute('x2', mx + lay.p * S); this.padT.setAttribute('x', mx + lay.p * S + 30);
    this.padT.textContent = mode === 'reader' ? 'RP ' + lay.p : 'P ' + lay.p;
  },

  render(t) {
    const inSheet = t >= 46;
    const liveOp = t < 45.4 ? (t < 0.6 ? eo(seg(t, 0, .6)) : 1) : 1 - eo(seg(t, 45.4, 46.4));
    this.live.style.opacity = liveOp; this.live.style.display = liveOp <= 0 ? 'none' : '';
    // mode cross-fades at 24 and 36
    const mode = t < 24 ? 'river' : t < 36 ? 'reader' : 'blocks';
    const swap = Math.min(Math.abs(t - 24), Math.abs(t - 36));
    if (liveOp > 0) {
      this.setMode(mode);
      const fade = swap < .35 ? swap / .35 : 1; this.colG.style.opacity = this.trail.style.opacity = fade;
      const v = mode === 'river' ? keyed(RIVER_K, t) : mode === 'reader' ? keyed(READER_K, t) : keyed(BLOCK_K, t);
      const vi = Math.round(v);
      const lay = mode === 'river' ? river(vi) : mode === 'reader' ? reader(vi) : blocks(vi);
      this.layout(lay, vi, mode);
      const px = X0 + vi * S; this.play.setAttribute('x1', px); this.play.setAttribute('x2', px);
      this.cellEls.forEach(c => c.r.setAttribute('class', 'cell' + (vi >= c.a && vi < c.b ? ' on' : '')));
      this.vwText.textContent = (mode === 'blocks' ? 'CW ' : 'VW ') + vi;
      const cap = capAt(CAPS[mode], t); this.capText.textContent = cap[1]; this.subText.textContent = cap[2];
      const capIn = eo(seg(t, cap[0], cap[0] + .4)); this.capText.style.opacity = this.subText.style.opacity = capIn;
      this.modeText.textContent = mode === 'river' ? 'HOMEPAGE RIVER' : mode === 'reader' ? 'STORY READER' : 'BLOCK SECTION · CONTAINER QUERY';
      // graph trail
      const w = this.gf(vi); this.trail.setAttribute('d', this.path(this.gf, this.vmin, Math.max(this.vmin, vi), this.gmax));
      const gy = GY + GH - w / this.gmax * GH; this.dot.setAttribute('cx', px); this.dot.setAttribute('cy', gy);
      this.dotT.setAttribute('x', px + 12); this.dotT.setAttribute('y', gy - 10); this.dotT.textContent = Math.round(w);
      this.ghost.style.opacity = this.ghostT.style.opacity = mode === 'river' ? eo(seg(t, 10.9, 11.8)) : 0;
    }
    // sheet
    this.sheetWrap.style.display = t < 45.6 ? 'none' : '';
    if (t >= 45.6) {
      this.wipe.setAttribute('width', 1700 * eio(seg(t, 45.8, 48.2)));
      const K = [[46, 960, 540, 1], [48.6, 960, 540, 1], [50.0, 360, 440, 2.3], [52.4, 364, 442, 2.25], [53.8, 930, 410, 1.7], [56.0, 940, 412, 1.68], [57.2, 900, 740, 1.75], [59.0, 906, 742, 1.72], [60.4, 1640, 380, 1.9], [62.2, 1644, 382, 1.88], [63.8, 960, 540, 1], [66, 960, 540, 0.99]];
      let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
      const a = K[i], b = K[i + 1], p = eio(seg(t, a[0], b[0]));
      const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)), cx = lerp(a[1], b[1], p), cy = lerp(a[2], b[2], p);
      this.cam.setAttribute('transform', 'translate(' + (960 - cx * z) + ',' + (540 - cy * z) + ') scale(' + z + ')');
    }
  },
});
