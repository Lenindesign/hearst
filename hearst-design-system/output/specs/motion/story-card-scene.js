// Story card (HP-CARD-001 · Rev C) dimensional drawing → motion film.
// Adapted from the dimensional-drawing-motion reference scene. Pure function of time:
// render(t) sets every property from t alone. Sheet geometry is copied from
// ../story-card-drawing.html and offset 100px right inside a 1900 × 1060 stage.
const { seg, lerp, eo, eio, clamp01 } = kit;
const DW_NS = 'http://www.w3.org/2000/svg';
const OX = 100; // sheet → stage x offset
// Camera keys (scene seconds; render() scales real time by 1/0.85).
const DW_CAM = [
  { t: 0, cx: 720, cy: 452, z: 4.4 }, { t: 2.3, cx: 728, cy: 456, z: 4.2 },
  { t: 4.2, cx: 872, cy: 346, z: 1.62 }, { t: 4.9, cx: 873, cy: 347, z: 1.6 },
  { t: 6.5, cx: 392, cy: 800, z: 1.46 }, { t: 7.4, cx: 394, cy: 802, z: 1.44 },
  { t: 9.4, cx: 950, cy: 530, z: 1.03 }, { t: 13.6, cx: 950, cy: 530, z: 1.02 }];

kit.scene('story-card', {
  init(kit) {
    kit.css('.dw-svg .dt{font-size:11px;fill:var(--main);paint-order:stroke;stroke:var(--ground);stroke-width:4px;stroke-linejoin:round}' +
      '.dw-svg .dts{font-size:9.5px;fill:color-mix(in srgb,var(--second) 75%,var(--ground));letter-spacing:.06em;paint-order:stroke;stroke:var(--ground);stroke-width:3px}' +
      '.dw-svg .sl{font-size:9px;fill:color-mix(in srgb,var(--second) 75%,var(--ground));letter-spacing:.08em}' +
      '.dw-svg .nt{font-size:11.5px;fill:var(--main);letter-spacing:.06em}.dw-svg .nth{font-size:13px;font-weight:700;fill:var(--main);letter-spacing:.06em}' +
      '.dw-svg .vt{font-size:12px;fill:var(--main);letter-spacing:.1em}.dw-svg .nbt{font-size:9.5px;fill:var(--main)}' +
      '.dw-svg .th{font-size:10.5px;fill:var(--main);letter-spacing:.05em}.dw-svg .tc{font-size:10.5px;fill:var(--main);text-transform:none}');
    const root = kit.h('<div class="ground"><div class="dw-cam"></div></div>');
    kit.stage.append(root);
    const camEl = root.querySelector('.dw-cam');
    this.cam = camEl.style;
    const svg = document.createElementNS(DW_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1900 1060'); svg.setAttribute('width', '1900'); svg.setAttribute('height', '1060'); svg.setAttribute('class', 'dw-svg');
    camEl.appendChild(svg);
    const REG = this.reg = []; let CUR = { a: 0, s: 0, d: .6, i: 0 }, noreg = 0;
    const at = (a, s, d) => { CUR = { a: a, s: s || 0, d: d || .6, i: 0 }; };
    const kind = (e, t) => { if (t === 'text') return 'f'; const c = ' ' + (e.getAttribute('class') || '') + ' ';
      if (/ (slot|ph|cl|env|hs) /.test(c) || (e.getAttribute('fill') || '').indexOf('url') === 0) return 'f'; return 'd'; };
    let sv = svg;
    function mk(t, a, p) { const e = document.createElementNS(DW_NS, t); for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]); (p || sv).appendChild(e);
      if (!noreg && t !== 'g') { const s = CUR.a + CUR.i * CUR.s; CUR.i++; const k = kind(e, t); if (k === 'd') e.setAttribute('pathLength', '1'); e.style.opacity = 0; REG.push({ e: e, a: s, b: s + CUR.d, k: k, last: -1 }); }
      return e; }
    function tx(x, y, s, c, a, p) { const t = mk('text', Object.assign({ x: x, y: y, class: c || 'dt' }, a || {}), p); t.textContent = s; return t; }
    noreg = 1; const d0 = mk('defs', {}); const m = mk('marker', { id: 'dwar', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, d0);
    mk('path', { d: 'M0,1.7 L10,5 L0,8.3 z', class: 'arrow' }, m);
    const pt = mk('pattern', { id: 'dwhat', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, d0); mk('line', { x1: 0, y1: 0, x2: 0, y2: 5, class: 'hl' }, pt);
    sv = mk('g', { transform: 'translate(' + OX + ',0)' }); noreg = 0;
    const A = 'url(#dwar)', HAT = 'url(#dwhat)';

    /* ---------- drawing kit (same geometry rules as the sheet) ---------- */
    function dimH(x1, x2, y, e1, e2, l, o) { o = o || {}; [[x1, e1], [x2, e2]].forEach(([x, e]) => { if (e == null) return; const s = Math.sign(y - e) || 1; mk('line', { x1: x, y1: e + s * 3, x2: x, y2: y + s * 5, class: 'ext' }); });
      if (x2 - x1 >= 28) mk('line', { x1: x1, y1: y, x2: x2, y2: y, class: 'dl', 'marker-start': A, 'marker-end': A }); else { mk('line', { x1: x1 - 13, y1: y, x2: x1, y2: y, class: 'dl', 'marker-end': A }); mk('line', { x1: x2 + 13, y1: y, x2: x2, y2: y, class: 'dl', 'marker-end': A }); }
      tx((x1 + x2) / 2 + (o.dx || 0), (o.below ? y + 13 : y - 4) + (o.dy || 0), l, o.c || 'dt', { 'text-anchor': 'middle' }); }
    function dimV(y1, y2, x, e1, e2, l, o) { o = o || {}; [[y1, e1], [y2, e2]].forEach(([y, e]) => { if (e == null) return; const s = Math.sign(x - e) || 1; mk('line', { x1: e + s * 3, y1: y, x2: x + s * 5, y2: y, class: 'ext' }); });
      if (y2 - y1 >= 28) mk('line', { x1: x, y1: y1, x2: x, y2: y2, class: 'dl', 'marker-start': A, 'marker-end': A }); else { mk('line', { x1: x, y1: y1 - 13, x2: x, y2: y1, class: 'dl', 'marker-end': A }); mk('line', { x1: x, y1: y2 + 13, x2: x, y2: y2, class: 'dl', 'marker-end': A }); }
      const c = (y1 + y2) / 2 + (o.dy || 0);
      if (o.side) { const r = o.side === 'r'; const lx = (r ? x + 6 : x - 6) + (o.dx || 0); if (o.dx) mk('line', { x1: x + (r ? 2 : -2), y1: (y1 + y2) / 2, x2: lx + (r ? -2 : 2), y2: c, class: 'lead' }); tx(lx, c + 4, l, o.c || 'dt', { 'text-anchor': r ? 'start' : 'end' }); }
      else tx(x - 5, c, l, o.c || 'dt', { 'text-anchor': 'middle', transform: 'rotate(-90 ' + (x - 5) + ' ' + c + ')' }); }
    function callout(px, py, ex, ey, l, dir, c) { const s = dir || (ex >= px ? 1 : -1); mk('circle', { cx: px, cy: py, r: 1.8, class: 'dot' }); mk('polyline', { points: px + ',' + py + ' ' + ex + ',' + ey + ' ' + (ex + s * 10) + ',' + ey, class: 'lead' }); tx(ex + s * 14, ey + 4, l, c || 'dt', { 'text-anchor': s > 0 ? 'start' : 'end' }); }
    function rad(cx, cy, r, c, l, L) { const sx = c.indexOf('l') > -1 ? -1 : 1, sy = c.indexOf('t') > -1 ? -1 : 1; const ox = cx - sx * r, oy = cy - sy * r; callout(ox + sx * r * Math.SQRT1_2, oy + sy * r * Math.SQRT1_2, ox + sx * r * Math.SQRT1_2 + sx * L, oy + sy * r * Math.SQRT1_2 + sy * L, l, sx); }
    function nb(x, y, n) { mk('rect', { x: x - 6, y: y - 6, width: 12, height: 12, class: 'nb' }); tx(x, y + 3.5, String(n), 'nbt', { 'text-anchor': 'middle' }); }
    function rr(x, y, w, h, r, c, p) { return mk('rect', { x: x, y: y, width: w, height: h, rx: r, class: c }, p); }
    function slotLabel(x, y, w, h, l, al, p) { tx(al === 'l' ? x + 6 : x + w / 2, y + h / 2 + 3.2, l, 'sl', { 'text-anchor': al === 'l' ? 'start' : 'middle' }, p); }
    function title(x, y, t, s) { tx(x, y, t, 'vt', { 'text-anchor': 'middle' }); if (s) tx(x, y + 14, s, 'dts', { 'text-anchor': 'middle' }); }
    function xbox(x, y, w, h, p) { mk('rect', { x: x, y: y, width: w, height: h, class: 'thin' }, p); mk('path', { d: 'M' + x + ',' + y + ' l' + w + ',' + h + ' M' + (x + w) + ',' + y + ' l' + (-w) + ',' + h, class: 'thin' }, p); }
    function detailRef(cx, cy, r, lbl, lx, ly) { mk('circle', { cx: cx, cy: cy, r: r, class: 'ph' }); const a = Math.atan2(ly - cy, lx - cx); mk('line', { x1: cx + r * Math.cos(a), y1: cy + r * Math.sin(a), x2: lx, y2: ly, class: 'lead' }); tx(lx + (lx < cx ? -4 : 4), ly + 4, lbl, 'dts', { 'text-anchor': lx < cx ? 'end' : 'start' }); }
    function table(x, y, ttl, rows, ws) { ws = ws || [42, 100, 88]; const rh = 17; tx(x, y - 8, ttl, 'vt');
      [ws.hdr || ['Code', 'Variable', 'Value']].concat(rows).forEach((r, i) => { let c2 = x; r.forEach((c, j) => { mk('rect', { x: c2, y: y + i * rh, width: ws[j], height: rh, class: 'thin' }); tx(c2 + (j ? ws[j] / 2 : 5), y + i * rh + 12, c, i ? 'tc' : 'th', { 'text-anchor': j ? 'middle' : 'start' }); c2 += ws[j]; }); });
      return y + (rows.length + 1) * rh + 34; }
    function notes(list) { tx(50, 58, 'Notes:', 'nth'); tx(112, 58, '(unless otherwise specified)', 'nt'); list.forEach(([n, t], i) => { const y = 88 + i * 22; if (n) { nb(56, y - 4, n); tx(72, y, t, 'nt'); } else tx(72, y, t, 'nt'); }); }
    // media slot: top-rounded well (clipped by R1) with dashed diagonals
    function media(x, y, w, h, r, p) { mk('path', { d: 'M' + x + ',' + (y + h) + ' L' + x + ',' + (y + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ',' + y + ' L' + (x + w - r) + ',' + y + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ',' + (y + r) + ' L' + (x + w) + ',' + (y + h) + ' Z', class: 'well' }, p);
      mk('path', { d: 'M' + (x + r * .3) + ',' + (y + r * .3) + ' L' + (x + w) + ',' + (y + h) + ' M' + (x + w - r * .3) + ',' + (y + r * .3) + ' L' + x + ',' + (y + h), class: 'ph' }, p); }

    /* measured geometry (CSS px) */
    const D = { W: 672, HM: 378, S1: 20, H4: 16.5, S2: 8, H5: 30, n: 2, S3: 8, H6: 24, m: 1, H: 534.5 };
    const MB = { W: 326, HM: 183.4, S1: 16, T1: 44, S2: 8, H5: 25, n: 3, S3: 8, H6: 24, H: 374.4 };

    /* ================= 1 · close-up on the meta row, then the plan draws while pulling back ================= */
    const k = .8, PX = 500, PY = 120, X = v => PX + v * k, Y = v => PY + v * k;
    const my = D.HM + D.S1, hy = my + D.H4 + D.S2, sy = hy + D.n * D.H5 + D.S3;
    at(-0.9, 0, 2.4); { const x0 = X(0), y0 = Y(0), w = D.W * k, h = D.H * k, q = 8 * k;
      mk('path', { d: 'M' + x0 + ',' + (y0 + h * .62) + ' V' + (y0 + q) + ' A' + q + ',' + q + ' 0 0 1 ' + (x0 + q) + ',' + y0 + ' H' + (x0 + w - q) + ' A' + q + ',' + q + ' 0 0 1 ' + (x0 + w) + ',' + (y0 + q) + ' V' + (y0 + h - q) + ' A' + q + ',' + q + ' 0 0 1 ' + (x0 + w - q) + ',' + (y0 + h) + ' H' + (x0 + q) + ' A' + q + ',' + q + ' 0 0 1 ' + x0 + ',' + (y0 + h - q) + ' Z', class: 'obj' }); }
    at(-0.5, .3, 1.1); media(X(0), Y(0), D.W * k, D.HM * k, 8 * k);
    at(0.25, 0, .55); mk('line', { x1: X(0), y1: Y(D.HM), x2: X(D.W), y2: Y(D.HM), class: 'thin' });
    at(0.55, .12, .5); xbox(X(20), Y(my), 16 * k, 16 * k);
    at(0.85, .14, .5); rr(X(42), Y(my), 250 * k, D.H4 * k, 1, 'slot'); slotLabel(X(42), Y(my), 250 * k, D.H4 * k, 'Source · flex · truncate', 'l');
    rr(X(300), Y(my), 110 * k, D.H4 * k, 1, 'ph'); slotLabel(X(300), Y(my), 110 * k, D.H4 * k, 'Byline');
    at(1.3, .14, .5); rr(X(20), Y(hy), 632 * k, D.n * D.H5 * k, 1, 'slot'); slotLabel(X(20), Y(hy), 632 * k, D.n * D.H5 * k, 'Headline slot · flex · ≤ 3 lines', 'l');
    rr(X(20), Y(sy), 632 * k, D.m * D.H6 * k, 1, 'slot'); slotLabel(X(20), Y(sy), 632 * k, D.m * D.H6 * k, 'Summary slot · fill · ≤ 3 lines', 'l');
    at(1.85, .08, .45); dimV(Y(D.HM), Y(D.H), X(-36), null, X(0), 'HUG', { c: 'dts' }); nb(X(-14), Y(my + 8), 2);
    // pull-back
    at(2.4, .03, .4); dimH(X(0), X(D.W), Y(-30), Y(-3), Y(-3), 'W'); tx(X(336), Y(-52), 'W = FILL · REF 672 (MAX-W-2XL)', 'dts', { 'text-anchor': 'middle' });
    at(2.55, 0, .5); slotLabel(X(0), Y(150), D.W * k, 20, 'Media slot · 16:9 · fill'); mk('line', { x1: X(336), y1: Y(-16), x2: X(336), y2: Y(D.H + 16), class: 'cl' });
    at(2.7, .012, .35); { const rx = X(D.W + 34); let y = D.HM;
      [[D.S1, 'S1', 0, 0], [D.H4, 'H4', 0, -2], [D.S2, 'S2', 30, 0], [D.n * D.H5, 'n·H5', 0, 0], [D.S3, 'S3', 30, -2], [D.m * D.H6, 'm·H6', 0, 2], [D.S1, 'S1', 0, 3]].forEach(([h, l, dx, dy]) => { dimV(Y(y), Y(y + h), rx, X(D.W), X(D.W), l, { side: 'r', dx: dx, dy: dy }); y += h; }); }
    at(3.0, .04, .4); { const by = Y(D.H + 28); dimH(X(0), X(20), by, Y(D.H), Y(sy + 24), 'S1', { below: true, dx: -10 }); dimH(X(20), X(652), by, null, Y(sy + 24), 'FILL', { below: true, c: 'dts' }); dimH(X(652), X(672), by, null, Y(D.H), 'S1', { below: true, dx: 10 }); }
    at(3.2, .05, .45); dimV(Y(0), Y(D.HM), X(-36), X(0), X(0), 'HM = W·9/16'); dimV(Y(0), Y(D.H), X(-78), X(-40), X(-40), '(REF 534.5)');
    at(3.45, .05, .4); rad(X(D.W), Y(0), 8 * k, 'tr', 'R1', 20); rad(X(0), Y(D.H), 8 * k, 'bl', 'R1', 20);
    at(3.6, .04, .35); nb(X(640), Y(28), 1); nb(X(D.W) + 10, Y(250), 3); nb(X(28), Y(28), 4); nb(X(640), Y(hy + 15), 5); nb(X(420), Y(my + 8), 6);
    at(3.8, .05, .45); detailRef(X(600), Y(my + 8), 22, 'DETAIL A', X(560), Y(my - 60));
    at(3.95, .1, .5); title(X(336), Y(D.H) + 64, 'Plan view · sm ≥ 640', 'Scale 0.8:1 · REF W 672 · n = 2, m = 1');

    /* ================= 2 · exploded view: static layers + layers that lift off the plan ================= */
    const sc = .34, TX = 270, TY = 850, gap = 40, ia = .94 * sc, ib = .17 * sc, ic = -.34 * sc, id = .47 * sc, W = D.W, H = D.H;
    const P = (x, y, z) => [TX + ia * x + ic * y, TY + ib * x + id * y - z];
    const uIso = 1 / Math.sqrt(ia * id - ib * ic);
    const G = z => { const g = mk('g', { transform: 'matrix(' + ia + ',' + ib + ',' + ic + ',' + id + ',' + TX + ',' + (TY - z) + ')' }); g.style.setProperty('--u', uIso); return g; };
    const MG = this.morph = [];
    const mg = (z, a0) => { const g2 = mk('g', {}); g2.style.opacity = 0; MG.push({ g: g2, z: z, a: a0 }); return g2; };
    at(5.55, .12, .8); let g = G(0); rr(-30, -30, W + 60, H + 60, 0, 'thin', g);
    g = G(gap); const shf = rr(0, 2, W, H, 8, 'hs', g); shf.setAttribute('fill', HAT);
    noreg = 1;
    let q = mg(gap * 2, 4.45); rr(0, 0, W, H, 8, 'obj', q); mk('line', { x1: 0, y1: 378, x2: W, y2: 378, class: 'thin' }, q);
    q = mg(gap * 3, 4.57); mk('path', { d: 'M0,378 L0,8 A8 8 0 0 1 8,0 L' + (W - 8) + ',0 A8 8 0 0 1 ' + W + ',8 L' + W + ',378 Z', class: 'well' }, q); rr(20, 422.5, 632, 60, 1, 'slot', q); rr(20, 490.5, 632, 24, 1, 'slot', q);
    noreg = 0;
    at(5.75, .08, .6); g = G(gap * 4); rr(0, 0, W, H, 8, 'ph', g); mk('line', { x1: 0, y1: 0, x2: W, y2: H, class: 'ph' }, g); mk('line', { x1: W, y1: 0, x2: 0, y2: H, class: 'ph' }, g);
    noreg = 1;
    q = mg(gap * 5, 4.69); xbox(20, 398, 16, 16, q); rr(42, 398, 360, 16.5, 1, 'slot', q); rr(612, 390, 40, 32, 4, 'hug', q);
    noreg = 0; this.iso = [ia, ib, ic, id, TX, TY]; this.flat = [k, 0, 0, k, PX, PY];
    at(6.0, .04, .45); [[0, 0], [W, 0], [W, H], [0, H]].forEach(([x, y]) => { const p1 = P(x, y, gap), p2 = P(x, y, gap * 5); mk('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: 'ph' }); });
    at(6.2, .07, .45); { const LX = 192;
      [[0, [-30, H + 30], 'L0 · Canvas', '--hp-background'], [gap, [0, H + 2], 'L1 · Shadow', '--hp-shadow-card'], [gap * 2, [0, H], 'L2 · Container', '--hp-surface · R1 · clip'], [gap * 3, [20, 514], 'L3 · Media + text', 'Image · headline · summary'], [gap * 4, [0, H], 'L4 · Hit area', 'Open button · z-10'], [gap * 5, [20, 414], 'L5 · Meta controls', 'Source link · save · z-20']].forEach(([z, [x, y], t, st]) => {
        const p1 = P(x, y, z); mk('circle', { cx: p1[0], cy: p1[1], r: 1.8, class: 'dot' }); mk('polyline', { points: p1[0] + ',' + p1[1] + ' ' + (LX + 10) + ',' + p1[1] + ' ' + LX + ',' + p1[1], class: 'lead' });
        tx(LX - 4, p1[1] - 2, t, 'vt', { 'text-anchor': 'end' }); tx(LX - 4, p1[1] + 11, st, 'dts', { 'text-anchor': 'end' }); }); }
    at(6.85, .1, .45); nb(P(W, 0, gap * 4)[0] + 12, P(W, 0, gap * 4)[1], 1); nb(P(W, 0, gap * 5)[0] + 12, P(W, 0, gap * 5)[1], 2);
    title(290, TY + 150, 'Exploded view', 'Axonometric · z order from code · gaps not to scale');

    /* ================= 3 · the rest of the sheet, drawn during the pull-back ================= */
    at(7.55, 0, 1.6); rr(20, 20, 1660, 1020, 16, 'border');
    at(8.05, .04, .4); notes([[1, 'FULL-CARD OPEN BUTTON: INSET 0, Z-10.'], [2, 'META ROW SITS AT Z-20, ABOVE THE HIT AREA.'], [3, 'B = 0. SHADOW + SURFACE SEPARATE THE CARD.'], [4, 'MEDIA FILLS W AT 16:9, CLIPPED BY R1.'], [5, 'HEADLINE AND SUMMARY CLAMP AT 3 LINES.'], [6, 'BYLINE HIDES WHEN META ROW < 20REM.'], [7, 'BASE < 640: S1 = 16, META ROW = T1 44.'], [8, 'BOOKMARK SAVE TRAIL RENDERS ONLY WITH onSave.'], [0, 'HEIGHT HUGS CONTENT. IN A ROW IT STRETCHES;'], [0, 'CONTENT-START KEEPS SLOTS TOP-ALIGNED.']]);
    // plan · base < 640
    at(8.2, .05, .45); { const k2 = .55, X2 = v => 1196 + v * k2, Y2 = v => 140 + v * k2, d = MB;
      rr(X2(0), Y2(0), d.W * k2, d.H * k2, 8 * k2, 'obj'); media(X2(0), Y2(0), d.W * k2, d.HM * k2, 8 * k2);
      mk('line', { x1: X2(0), y1: Y2(d.HM), x2: X2(d.W), y2: Y2(d.HM), class: 'thin' });
      const m2 = d.HM + d.S1; rr(X2(16), Y2(m2), 294 * k2, d.T1 * k2, 1, 'ph'); xbox(X2(16), Y2(m2 + 14), 16 * k2, 16 * k2); rr(X2(38), Y2(m2 + 14), 150 * k2, 16.5 * k2, 1, 'slot');
      const h2 = m2 + d.T1 + d.S2; rr(X2(16), Y2(h2), 294 * k2, d.n * d.H5 * k2, 1, 'slot'); slotLabel(X2(16), Y2(h2), 294 * k2, d.n * d.H5 * k2, 'Headline', 'l');
      const s2 = h2 + d.n * d.H5 + d.S3; rr(X2(16), Y2(s2), 294 * k2, d.H6 * k2, 1, 'slot');
      dimH(X2(0), X2(d.W), Y2(-26), Y2(-3), Y2(-3), 'W · REF 326');
      const rx2 = X2(d.W + 26); dimV(Y2(d.HM), Y2(m2), rx2, X2(d.W), X2(d.W), 'S1', { side: 'r', dy: -3 }); dimV(Y2(m2), Y2(m2 + d.T1), rx2, X2(d.W), X2(d.W), 'T1', { side: 'r' }); dimV(Y2(h2), Y2(h2 + d.n * d.H5), rx2, X2(d.W), X2(d.W), '3·H5', { side: 'r' });
      dimV(Y2(0), Y2(d.HM), X2(-22), X2(0), X2(0), 'HM'); nb(X2(250), Y2(m2 + 22), 7);
      title(X2(163), Y2(d.H) + 34, 'Plan · base < 640', 'Scale 0.55:1 · REF H 374.4'); }
    // detail C · headline row
    at(8.5, .06, .45); { const k3 = .38, X3 = v => 1180 + v * k3, Y3 = v => 470 + v * k3;
      mk('line', { x1: X3(0), y1: Y3(-24), x2: X3(0), y2: Y3(84), class: 'ph' }); mk('line', { x1: X3(632), y1: Y3(-24), x2: X3(632), y2: Y3(84), class: 'ph' });
      rr(X3(0), Y3(0), 522 * k3, 60 * k3, 1, 'slot'); slotLabel(X3(0), Y3(0), 522 * k3, 60 * k3, 'Headline · flex', 'l'); rr(X3(534), Y3(14), 98 * k3, 46 * k3, 3, 'hug');
      mk('line', { x1: X3(-10), y1: Y3(60), x2: X3(642), y2: Y3(60), class: 'cl' });
      const by = Y3(96); dimH(X3(0), X3(522), by, null, Y3(62), 'FLEX', { below: true, c: 'dts' }); dimH(X3(522), X3(534), by, null, Y3(62), 'S6', { below: true }); dimH(X3(534), X3(632), by, null, Y3(62), 'HUG', { below: true, c: 'dts', dx: 10 });
      title(X3(316), Y3(96) + 42, 'Detail C · headline row', 'Scale 0.38:1 · vehicle rating · items-end'); }
    // detail D · shadow envelope
    at(8.7, .05, .45); { const q4 = 4, CX = 150, CY = 360, L = 130, gp = 34, BY = CY + 70 + gp + 70, r = 8 * q4, E1 = 4 * q4, E2 = 6 * q4, E3 = 8 * q4, Yo = 2 * q4;
      mk('path', { d: 'M' + CX + ',' + (CY + 70) + ' L' + CX + ',' + (CY + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (CX + r) + ',' + CY + ' L' + (CX + L) + ',' + CY, class: 'obj', fill: 'none' });
      mk('path', { d: 'M' + CX + ',' + (CY + 70 + gp) + ' L' + CX + ',' + (BY - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + (CX + r) + ',' + BY + ' L' + (CX + L) + ',' + BY, class: 'obj', fill: 'none' });
      mk('path', { d: 'M' + CX + ',' + (BY - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + (CX + r) + ',' + BY + ' L' + (CX + L) + ',' + BY + ' L' + (CX + L) + ',' + (BY + Yo) + ' L' + (CX + r) + ',' + (BY + Yo) + ' A' + r + ' ' + r + ' 0 0 1 ' + CX + ',' + (BY - r + Yo) + ' Z', fill: HAT, class: 'hs' });
      mk('path', { d: 'M' + (CX - 10) + ',' + (CY + 70) + ' l20,0 M' + (CX - 10) + ',' + (CY + 70 + gp) + ' l20,0', class: 'thin' });
      mk('path', { d: 'M' + (CX + L) + ',' + (CY - E1) + ' L' + (CX - E2) + ',' + (CY - E1) + ' L' + (CX - E2) + ',' + (CY + 70) + ' M' + (CX - E2) + ',' + (CY + 70 + gp) + ' L' + (CX - E2) + ',' + (BY + E3) + ' L' + (CX + L) + ',' + (BY + E3), class: 'env' });
      dimV(CY - E1, CY, CX + L + 18, CX + L, CX + L, 'E1', { side: 'r' }); dimH(CX - E2, CX, CY + 40, null, null, 'E2', { dy: -6, dx: -14 });
      dimV(BY, BY + E3, CX + L + 18, CX + L, CX + L, 'E3', { side: 'r' }); dimV(BY, BY + Yo, CX + L + 60, CX + L, CX + L, 'Y', { side: 'r' });
      rad(CX, CY, r, 'tl', 'R1', 18); nb(CX + L - 14, CY + 28, 3); tx(CX + 40, CY + 58, 'CARD', 'sl'); tx(CX + 40, BY + E3 + 16, 'FOOTPRINT HATCHED', 'sl');
      title(CX + 70, BY + E3 + 48, 'Detail D · shadow envelope', 'Scale 4:1 · --hp-shadow-card · break not to scale'); }
    // detail A · meta row with heart save trail
    at(8.9, .025, .4); { const q5 = 2.5, X0 = 566, TOP = 700, Z2 = 32 * q5, rowC = TOP + Z2 / 2, icz = 16 * q5, s5 = 6 * q5, src = 120, byl = 80, s4 = 8 * q5;
      let x = X0; const lineH = 16.5 * q5, ly = rowC - lineH / 2;
      mk('line', { x1: X0 - 20, y1: rowC, x2: X0 + 400, y2: rowC, class: 'cl' });
      xbox(x, rowC - icz / 2, icz, icz); const xi = x; x += icz + s5;
      rr(x, ly, src, lineH, 2, 'slot'); slotLabel(x, ly, src, lineH, 'Source · flex', 'l'); const xs = x; x += src + 6;
      rr(x, ly, byl, lineH, 2, 'ph'); slotLabel(x, ly, byl, lineH, 'Byline'); const xb = x; x += byl;
      mk('path', { d: 'M' + (x + 6) + ',' + (ly - 6) + ' l6,' + (lineH / 2 + 6) + ' l-6,' + (lineH / 2 + 6), class: 'thin' }); x += 22;
      const xg = x; x += s4; const xz = x; rr(x, TOP, Z2, Z2, 4 * q5, 'hug'); const ii = 16 * q5; rr(x + (Z2 - ii) / 2, TOP + (Z2 - ii) / 2, ii, ii, 0, 'thin');
      { const hx = x + Z2 / 2, hy2 = TOP + Z2 / 2; mk('path', { d: 'M' + (hx - 10) + ',' + (hy2 - 14) + ' h20 v28 l-10,-8 l-10,8 z', class: 'thin' }); }
      const T1 = 44 * q5; rr(x - (T1 - Z2) / 2, TOP - (T1 - Z2) / 2, T1, T1, 0, 'ph');
      const ty = TOP - (T1 - Z2) / 2 - 14;
      dimH(xi, xi + icz, ty, rowC - icz / 2, null, 'Z1'); dimH(xi + icz, xs, ty, null, ly, 'S5', { dy: -12 }); dimH(xs, xs + src, ty, null, ly, 'FLEX', { c: 'dts' });
      dimH(xg, xz, ty, ly, TOP, 'S4', { dx: -14 }); dimH(xz, xz + Z2, ty, null, null, 'Z2', { dy: -10 });
      dimV(ly, ly + lineH, X0 - 28, X0, X0, 'H4', { side: 'l' }); dimV(TOP, TOP + Z2, xz + Z2 + (T1 - Z2) / 2 + 18, xz + Z2, xz + Z2, 'Z2', { side: 'r' });
      dimV(TOP - (T1 - Z2) / 2, TOP + Z2 + (T1 - Z2) / 2, xz + Z2 + (T1 - Z2) / 2 + 60, xz + Z2 + (T1 - Z2) / 2, xz + Z2 + (T1 - Z2) / 2, 'T1 · BASE', { side: 'r' });
      dimH(xz, xz + (Z2 - ii) / 2, TOP + Z2 + 28, TOP + Z2, TOP + Z2, '(Z2−I1)÷2', { below: true, dx: -34 }); rad(xz + Z2, TOP, 4 * q5, 'tr', 'R3', 14);
      nb(xb + byl - 8, ly - 12, 6); nb(xz - 10, TOP + Z2 + 12, 8); nb(X0 + icz / 2, TOP + Z2 + 12, 2);
      title(760, TOP + Z2 + 64, 'Detail A · meta row', 'Scale 2.5:1 · bookmark save trail · sm row height = Z2 when save renders, else H4'); }
    // states
    at(9.3, .03, .35); { const k6 = .125, Y0 = 878, w = D.W * k6, h = D.H * k6, xs = [540, 662, 784, 906];
      const mini = (x0, st) => { rr(x0, Y0, w, h, 1, 'obj'); media(x0, Y0, w, D.HM * k6, 1);
        rr(x0 + 3, Y0 + D.HM * k6 + 3, w * .4, 2, 0, 'hug'); rr(x0 + 3, Y0 + D.HM * k6 + 8, w - 6, 7, 0, 'slot'); rr(x0 + 3, Y0 + D.HM * k6 + 18, w - 6, 3, 0, 'slot');
        if (st === 'hover') { mk('line', { x1: x0 + 3, y1: Y0 + D.HM * k6 + 15.8, x2: x0 + w - 12, y2: Y0 + D.HM * k6 + 15.8, stroke: '#111', 'stroke-width': 1.2 }); rr(x0 - 1.2, Y0 - 1.2, w + 2.4, D.HM * k6 + 2.4, 1, 'ph'); }
        if (st === 'focus') { mk('rect', { x: x0 + 1.5, y: Y0 + 1.5, width: w - 3, height: h - 3, fill: 'none', stroke: '#111', 'stroke-width': 2 }); }
        if (st === 'saved') { rr(x0 + w - 9, Y0 + D.HM * k6 + 2, 6, 6, 0, 'thin'); mk('rect', { x: x0 + w - 8, y: Y0 + D.HM * k6 + 3, width: 4, height: 4, fill: '#111' }); }
        if (st === 'rest') rr(x0 + w - 9, Y0 + D.HM * k6 + 2, 6, 6, 0, 'thin'); };
      [['rest', 'Rest', 'Save outline'], ['hover', 'Hover', 'Underline · ×1.025'], ['focus', 'Focus-visible', 'Ring 2 inset'], ['saved', 'Saved', 'Bookmark fill']].forEach(([s, l, sub], i) => { mini(xs[i], s); tx(xs[i] + w / 2, Y0 + h + 16, l, 'sl', { 'text-anchor': 'middle' }); tx(xs[i] + w / 2, Y0 + h + 28, sub, 'dts', { 'text-anchor': 'middle' }); });
      title(760, 1012, 'States', 'Scale 0.125:1 · hover 250ms ease-out · none under reduced motion'); }
    // radius details
    at(9.6, .06, .45); { const q7 = 4, y0 = 760; [['R1', 'Card · media clip', 8], ['R2', 'Brand icon', 3], ['R3', 'Save · focus', 4]].forEach(([c, n, r], i) => { const x0 = 1092 + i * 116, L = 22, RP = (u, v) => [x0 + u * q7, y0 - v * q7];
        mk('path', { d: 'M' + RP(0, L) + ' L' + RP(0, r) + ' A' + r * q7 + ' ' + r * q7 + ' 0 0 0 ' + RP(r, 0) + ' L' + RP(L, 0), class: 'obj', fill: 'none' });
        const cc = RP(r, r); mk('path', { d: 'M' + (cc[0] - 5) + ',' + cc[1] + ' h10 M' + cc[0] + ',' + (cc[1] - 5) + ' v10', class: 'thin' });
        const a = 225 * Math.PI / 180; mk('line', { x1: cc[0], y1: cc[1], x2: cc[0] + r * q7 * Math.cos(a), y2: cc[1] - r * q7 * Math.sin(a), class: 'dl', 'marker-end': A });
        tx(x0 + L * q7 / 2 + 6, y0 - L * q7 + 16, c + ' = ' + r, 'dt'); tx(x0, y0 + 18, n, 'dts'); });
      title(1240, y0 + 44, 'Radius details', 'Scale 4:1'); }
    // tables
    at(8.6, .005, .25); { let y = table(1436, 86, 'Spacing', [['S1', '--spacing×5', '20 · 16'], ['S2', '--spacing×2 (mb-2)', '8'], ['S3', '--spacing×2 (mt-2)', '8'], ['S4', 'meta-row gap', '0.5rem = 8'], ['S5', '--spacing×1.5', '6'], ['S6', '--spacing×3', '12']]);
      y = table(1436, y, 'Size', [['W', 'FILL (max-w-2xl)', 'REF 672'], ['HM', 'aspect-video', 'W·9/16 = 378'], ['Z1', '--spacing×4', '16'], ['H4', '4xs × lh 1.5', '16.5'], ['T1', 'min-h-11', '44 · BASE'], ['Z2', 'save h-8 w-8', '32'], ['I1', 'size-4', '16'], ['H5', 'lh-tight 1.25', '30 · 25'], ['H6', 'leading-6', '24'], ['B', 'shadow-card rule', '0'], ['H', 'sum (see block)', '534.5 · 374.4']]);
      y = table(1436, y, 'Radius', [['R1', 'rounded-card', '8'], ['R2', 'rounded-[3px]', '3'], ['R3', 'rounded-[4px]', '4']]);
      y = table(1436, y, 'Shadow', [['X·Y', '--hp-shadow-card', '0 · 2'], ['BL', 'blur', '6'], ['SP', 'spread', '0'], ['E1', 'BL+SP−Y', '4'], ['E2', 'BL+SP', '6'], ['E3', 'BL+SP+Y', '8']]);
      table(1436, y, 'Type · size / line', [['TH', '--font-headline 800', '24/30 · 20/25'], ['TM', '--text-token-4xs', '11/16.5'], ['TS', '--hp-font-ui 400', '15.2/24 · 14/24']]); }
    at(9.85, .006, .25); { const ws = [64, 104, 104]; ws.hdr = ['Code', 'Base < 640', 'sm ≥ 640'];
      table(1072, 872, 'Breakpoints', [['S1', '16', '20'], ['META-H', 'T1 = 44', 'H4 = 16.5'], ['Z2 HIT', 'T1 = 44', '32'], ['TH', '20 / 25', '24 / 30'], ['TS', '14 / 24', '15.2 / 24'], ['H REF', '374.4 (n 3)', '534.5 (n 2)'], ['BYLINE', 'HIDDEN < 20REM', 'HIDDEN < 20REM']], ws); }
  },
  render(t) {
    t = t / 0.85;
    let i = 0; while (i < DW_CAM.length - 2 && t > DW_CAM[i + 1].t) i++;
    const c0 = DW_CAM[i], c1 = DW_CAM[i + 1], p = eio(seg(t, c0.t, c1.t));
    const z = Math.exp(lerp(Math.log(c0.z), Math.log(c1.z), p)), cx = lerp(c0.cx, c1.cx, p), cy = lerp(c0.cy, c1.cy, p);
    this.cam.transform = 'translate(' + (960 - cx * z) + 'px,' + (540 - cy * z) + 'px) scale(' + z + ')';
    for (const it of this.reg) {
      let v = clamp01((t - it.a) / (it.b - it.a)); v = Math.round(v * 400) / 400;
      if (v === it.last) continue; it.last = v; const s = it.e.style;
      if (it.k === 'f') { s.opacity = eo(v); continue; }
      const e = eio(v); s.opacity = Math.min(1, v * 6);
      if (v >= 1) { s.strokeDasharray = ''; s.strokeDashoffset = ''; } else { s.strokeDasharray = '1 2'; s.strokeDashoffset = 1 - e; }
      s.fillOpacity = eo(seg(v, .55, 1));
    }
    const F = this.flat, I = this.iso;
    this.morph.forEach((m) => {
      const v = eio(seg(t, m.a, m.a + 1.5)), M = F.map((f, n) => lerp(f, I[n], v));
      M[5] -= m.z * v;
      m.g.style.opacity = eo(seg(t, m.a + 0.05, m.a + 0.5));
      const fo = eo(seg(t, m.a + 0.55, m.a + 1.25)); if (fo !== m.fo) { m.fo = fo; m.fills = m.fills || m.g.querySelectorAll('.obj,.well,.hug'); m.fills.forEach(e => { e.style.fillOpacity = fo; }); }
      m.g.setAttribute('transform', 'matrix(' + M.join(',') + ')');
      m.g.style.setProperty('--u', 1 / Math.sqrt(Math.abs(M[0] * M[3] - M[1] * M[2])));
    });
  },
});
