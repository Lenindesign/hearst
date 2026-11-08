// Action button (UI-BTN-001 · Rev A) dimensional drawing → motion film.
// Adapted from the dimensional-drawing-motion reference scene. Pure function of time:
// render(t) sets every property from t alone. Sheet geometry is copied from
// ../button-drawing.html and offset 100px right inside a 1900 × 1060 stage.
const { seg, lerp, eo, eio, clamp01 } = kit;
const DW_NS = 'http://www.w3.org/2000/svg';
const OX = 100; // sheet → stage x offset
// Camera keys (scene seconds; render() scales real time by DW_SPEED).
const DW_CAM = [
  { t: 0, cx: 1012, cy: 214, z: 4.3 }, { t: 2.3, cx: 1016, cy: 214, z: 4.1 },
  { t: 4.2, cx: 945, cy: 240, z: 1.6 }, { t: 4.7, cx: 946, cy: 241, z: 1.58 },
  { t: 6.0, cx: 360, cy: 470, z: 2.0 }, { t: 7.3, cx: 362, cy: 472, z: 1.96 },
  { t: 9.3, cx: 950, cy: 530, z: 1.03 }, { t: 10.4, cx: 950, cy: 530, z: 1.02 },
  // Detail tour: each stop holds long enough to read its dimensions.
  { t: 11.6, cx: 1000, cy: 490, z: 1.9 }, { t: 13.0, cx: 1004, cy: 490, z: 1.86 }, // size ladder
  { t: 14.2, cx: 1060, cy: 720, z: 1.75 }, { t: 15.6, cx: 1064, cy: 720, z: 1.72 }, // icon-only sizes + hit area
  { t: 16.8, cx: 360, cy: 866, z: 2.5 }, { t: 19.8, cx: 363, cy: 868, z: 2.45 }, // loading + Detail C draws in
  { t: 21.0, cx: 1000, cy: 930, z: 2.0 }, { t: 22.4, cx: 1004, cy: 930, z: 1.97 }, // states
  { t: 23.6, cx: 1600, cy: 300, z: 2.0 }, { t: 25.0, cx: 1604, cy: 302, z: 1.97 }, // variable tables
  { t: 26.8, cx: 950, cy: 530, z: 1.03 }, { t: 29.5, cx: 950, cy: 530, z: 1.015 }];
// Real seconds per scene second (1 = the timeline above plays at its own pace).
const DW_SPEED = 1;

kit.scene('action-button', {
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


    function iconSlot(x, y, s, p) { rr(x, y, s, s, 0, 'hug', p); mk('path', { d: 'M' + x + ',' + y + ' l' + s + ',' + s + ' M' + (x + s) + ',' + y + ' l' + (-s) + ',' + s, class: 'thin' }, p); }
    function slot(x, y, w, h, l) { rr(x, y, w, h, 0, 'slot'); if (l) slotLabel(x, y, w, h, l); }
    function lbl(x, y, s) { tx(x, y, s, 'sl', { 'text-anchor': 'middle' }); }

    /* ================= 1 · close-up on the icon end, then the plan draws while pulling back ================= */
    { const k = 4, PX = 520, PY = 120, W = 115 * k, H = 44 * k;
      const lx = PX + 16 * k, ix2 = PX + W - 14 * k, ix1 = ix2 - 16 * k, lx2 = ix1 - 8 * k, ly = PY + (H - 20 * k) / 2, iy = PY + (H - 16 * k) / 2;
      at(-0.9, 0, 2.2); rr(PX, PY, W, H, 0, 'obj');
      at(-0.2, 0, 1.4); rr(PX + k, PY + k, W - 2 * k, H - 2 * k, 0, 'thin');
      at(0.35, 0, .6); iconSlot(ix1, iy, 16 * k);
      at(0.75, 0, .6); slot(lx, ly, lx2 - lx, 20 * k, 'LABEL SLOT · HUG');
      at(1.0, 0, .5); mk('line', { x1: PX - 14, y1: PY + H / 2, x2: PX + W + 14, y2: PY + H / 2, class: 'cl' });
      at(1.15, .1, .45); const ty = PY - 22; dimH(ix2, PX + W, ty, iy, PY, 'S4'); dimH(ix1, ix2, ty, null, iy, 'I1'); dimH(lx2, ix1, ty, ly, null, 'G3'); dimH(lx, lx2, ty, null, null, 'HUG', { c: 'dts' }); dimH(PX, lx, ty, PY, ly, 'S3');
      at(1.55, .08, .45); const rx = PX + W + 28; dimV(PY, ly, rx, PX + W, null, 'V1', { side: 'r' }); dimV(ly, ly + 20 * k, rx, null, null, 'LH', { side: 'r' }); dimV(ly + 20 * k, PY + H, rx, null, PX + W, 'V1', { side: 'r' });
      const rx2 = rx + 46; dimV(PY, iy, rx2, null, null, 'V2', { side: 'r' }); dimV(iy, iy + 16 * k, rx2, ix2, null, 'I1', { side: 'r' }); dimV(iy + 16 * k, PY + H, rx2, null, null, 'V2', { side: 'r' });
      at(2.0, .1, .35); nb(ix1 + 8, iy - 14, 2); nb(ix2 + 28, PY + H - 16, 3); nb(PX + W - 30, PY - 50, 4);
      at(2.3, .05, .5); detailRef(PX + W, PY, 22, 'DETAIL R', PX + W + 46, PY - 52); nb(lx + 18, ly - 14, 1);
      at(2.5, .04, .4); dimH(PX, PX + W, PY + H + 26, PY + H, PY + H, 'W · HUG', { below: true }); dimV(PY, PY + H, PX - 26, PX, PX, 'H5 · 44 MIN');
      at(2.9, .08, .4); callout(PX + 2, PY + H - 2, PX + 40, PY + H + 58, 'B = 1', 1); nb(PX + 124, PY + H + 54, 5);
      at(3.2, 0, .5); title(PX + W / 2, PY + H + 86, 'Plan · touch size, trailing icon', 'Scale 4:1 · size=touch · data-icon=inline-end · W ref 115'); }

    /* Detail R · radius (draws during the pull-back) */
    { const X = 1150, h = 64, w = 100; [[0, 'R1 = 0 · SQUARE'], [8, 'R1 = 4'], [h / 2, 'R1 = 64 → H/2']].forEach(([r, l], i) => { const y = 100 + i * 90;
        at(3.3 + i * .2, 0, .6); rr(X, y, w, h, r, 'obj'); at(3.5 + i * .2, 0, .4); slot(X, y + (h - 40) / 2, w - 20, 40, null);
        at(3.65 + i * .2, 0, .35); if (r) rad(X + w, y, r, 'tr', l, 16); else callout(X + w, y, X + w + 16, y - 12, l, 1); });
      at(4.0, 0, .4); title(X + w / 2 + 60, 374, 'Detail R · radius', 'Scale 2:1 · size=default · rendered R = min(R1, H/2)'); }

    /* ================= 2 · exploded layers: three layers lift off a flat stack ================= */
    const s = 1.2, BW = 115, BH = 44, TX = 318, TY = 560, ia = .94 * s, ib = .17 * s, ic = -.34 * s, id = .47 * s;
    const LIFT = this.lift = [];
    const lg = (z, a0) => { const g = mk('g', {}); g.style.opacity = 0; LIFT.push({ g: g, z: z, a: a0 }); return g; };
    this.iso = [ia, ib, ic, id, TX, TY];
    let q = lg(0, 4.4); noreg = 1; rr(-3, -3, BW + 6, BH + 6, 0, 'ph', q); noreg = 0;
    q = lg(62, 4.55); noreg = 1; rr(0, 0, BW, BH, 0, 'obj', q); noreg = 0;
    q = lg(124, 4.7); noreg = 1; rr(16, 12, 67, 20, 0, 'slot', q); rr(91, 14, 16, 16, 0, 'hug', q); noreg = 0;
    [[0, 'FOCUS RING · F1'], [62, 'SURFACE + BORDER · B · R1'], [124, 'CONTENT · LABEL + ICON SLOTS']].forEach(([z, l], i) => {
      const ax = TX + ic * (BH / 2), ay = TY - z + id * (BH / 2);
      at(6.1 + i * .18, 0, .5); mk('circle', { cx: ax, cy: ay, r: 1.8, class: 'dot' }); mk('polyline', { points: ax + ',' + ay + ' ' + (ax - 30) + ',' + (ay - 14) + ' 60,' + (ay - 14), class: 'lead' });
      at(6.3 + i * .18, 0, .4); tx(60, ay - 19, l, 'dts', { 'text-anchor': 'start' }); });
    at(6.8, 0, .45); title(240, 640, 'Exploded layer stack', 'Axonometric · not to scale');

    /* ================= 3 · pull back: sheet, notes, ladder, icon sizes, details, states, tables ================= */
    at(7.4, 0, 1.6); rr(20, 20, 1660, 1020, 16, 'border');
    at(7.8, .04, .4); notes([[1, 'LABEL SLOT HUGS ITS TEXT; WIDTH IS NEVER FIXED.'], [2, 'ICON SLOT IS OPTIONAL, LEADING OR TRAILING.'], [3, 'ICON SIDE TAKES S4 INSTEAD OF THE BASE PAD.'], [4, 'R1 IS A THEME TOKEN; RENDERED R = MIN(R1, H/2).'], [5, 'B IS ALWAYS 1; COLOR MAY BE TRANSPARENT.'], [0, 'NAVIGATION RENDERS A LINK STYLED BY THE SAME'], [0, 'VARIANTS; ACTIONS RENDER A BUTTON ELEMENT.'], [0, 'ICON-ONLY CONTROLS NEED AN ACCESSIBLE NAME.']]);
    { const cy = 480; let x = 500; [['XS', 'H1', 24, 8, 'S1'], ['SM', 'H2', 28, 10, 'S2'], ['DEFAULT', 'H3', 32, 10, 'S2'], ['LG', 'H4', 36, 10, 'S2'], ['TOUCH', 'H5', 44, 16, 'S3']].forEach(([n, hc, h, p, pc], i) => {
        const H = h * 2, P = p * 2, L = 56, W = 2 * P + L, y = cy - H / 2; at(7.95 + i * .1, .02, .4); rr(x, y, W, H, 0, 'obj'); slot(x + P, cy - 14, L, 28, null);
        dimV(y, y + H, x - 12, x, x, hc); dimH(x, x + P, y - 12, y, cy - 14, pc, { dy: -2 }); lbl(x + W / 2, y + H + 20, n); x += W + 64; });
      at(8.4, 0, .4); mk('line', { x1: 486, y1: cy, x2: x - 40, y2: cy, class: 'cl' }); title(940, 570, 'Size ladder · text buttons', 'Scale 2:1 · centers aligned · label slot schematic'); }
    { const cy = 690; let x = 500; [['ICON-XS', 'Z1', 24, 12], ['ICON-SM', 'Z2', 28, 16], ['ICON', 'Z3', 32, 16], ['ICON-LG', 'Z4', 36, 16], ['ICON-TOUCH', 'Z5', 44, 16]].forEach(([n, c, sz, i0], j) => {
        const S = sz * 2, I = i0 * 2, y = cy - S / 2; at(8.25 + j * .08, .02, .4); rr(x, y, S, S, 0, 'obj'); iconSlot(x + (S - I) / 2, cy - I / 2, I); dimH(x, x + S, y + S + 14, y + S, y + S, c, { below: true }); lbl(x + S / 2, y + S + 44, n);
        if (j === 4) { dimV(y, cy - I / 2, x + S + 14, x + S, null, 'V2', { side: 'r' }); dimV(cy - I / 2, cy + I / 2, x + S + 14, null, null, 'I1', { side: 'r' }); } x += S + 56; });
      at(8.7, 0, .4); title(760, 800, 'Icon-only sizes', 'Scale 2:1 · square · icon centered · V2 = (Z − I) / 2'); }
    { const X = 1130, cy = 690, T = 88, H = 64, W = 130; at(8.5, .05, .45); const hz = rr(X - 14, cy - T / 2, W + 28, T, 0, 'hs'); hz.setAttribute('fill', HAT); rr(X - 14, cy - T / 2, W + 28, T, 0, 'ph');
      rr(X, cy - H / 2, W, H, 0, 'obj'); slot(X + 20, cy - 14, W - 40, 28, null); dimV(cy - T / 2, cy + T / 2, X - 30, X - 14, X - 14, 'T1'); dimV(cy - H / 2, cy + H / 2, X + W + 30, X + W, X + W, 'H3');
      title(X + W / 2, 800, 'Detail T · hit area', 'Scale 2:1 · dense size inside a 44 target · hatched = hit area'); }
    { const X = 110, cy = 760, H = 64, S4 = 16, I = 32, G = 12, L = 90, P = 20, W = S4 + I + G + L + P, sx = X + S4; at(8.6, .04, .45); rr(X, cy - H / 2, W, H, 0, 'obj');
      mk('circle', { cx: sx + I / 2, cy: cy, r: I / 2 - 3, class: 'thin' }); mk('path', { d: 'M' + (sx + I / 2) + ',' + (cy - I / 2 + 3) + ' A' + (I / 2 - 3) + ',' + (I / 2 - 3) + ' 0 0 1 ' + (sx + I - 3) + ',' + cy, class: 'cut', fill: 'none' });
      slot(sx + I + G, cy - 20, L, 40, 'LOADING LABEL'); dimH(X, sx, cy - H / 2 - 12, cy - H / 2, cy - I / 2, 'S4', { dy: -2 }); dimH(sx, sx + I, cy - H / 2 - 12, null, null, 'I1'); dimH(sx + I, sx + I + G, cy - H / 2 - 12, null, null, 'G2', { dy: -2 }); dimH(sx + I + G + L, X + W, cy - H / 2 - 12, null, cy - H / 2, 'S2', { dy: -2 });
      title(X + W / 2, cy + H / 2 + 34, 'Detail L · loading', 'Scale 2:1 · spinner in the lead slot'); }
    { const H = 48, W = 110, cy = 930; let x = 500; ['DEFAULT', 'HOVER', 'ACTIVE · EXPANDED', 'FOCUS-VISIBLE', 'DISABLED', 'INVALID'].forEach((n, i) => { const y = cy - H / 2; at(8.8 + i * .09, .03, .4);
        if (i === 3) rr(x - 4.5, y - 4.5, W + 9, H + 9, 0, 'hug');
        const r = rr(x, y, W, H, 0, 'obj'); if (i === 1) r.style.fill = '#e6e6e6'; if (i === 2) r.style.fill = '#cfcfcf'; if (i === 3) r.style.strokeWidth = 2; if (i === 4) { r.style.stroke = '#9a9a9a'; } if (i === 5) { r.setAttribute('stroke-dasharray', '6 2'); r.style.strokeWidth = 2; }
        const sl = rr(x + 15, cy - 10, W - 30, 20, 0, 'slot'); if (i === 4) sl.style.stroke = '#bbb'; lbl(x + W / 2, y + H + 20, n); if (i === 3) dimH(x - 4.5, x, y - 14, y - 4.5, y, 'F1', { dy: -2 }); x += W + 30; });
      at(9.35, 0, .4); title(905, 1000, 'States · same geometry, token changes only', 'Scale 1.5:1 · gray = state fill, not a color value'); }
    /* Detail C · optical centering (draws during the tour stop on the bottom-left) */
    { const H = 66, W = 150, cy = 918, top = cy - H / 2, bot = cy + H / 2;
      [[60, 'DEFAULT · LINE BOX', -10, 4, 'VT', 'VB'], [250, 'CAP-ALIGNED · TRIM', -7, 7, 'V3', 'V3']].forEach(([X, n, c0, c1, a, b], i) => {
        const base = 17.1 + i * .9;
        at(base, 0, .6); rr(X, top, W, H, 0, 'obj');
        at(base + .3, .06, .4);
        if (!i) { slot(X + 40, cy - 15, 80, 30, null); mk('line', { x1: X + 36, y1: cy + 9, x2: X + 124, y2: cy + 9, class: 'ph' }); }
        rr(X + 46, cy + c0, 68, c1 - c0, 0, 'hug');
        mk('line', { x1: X + 34, y1: cy + c1, x2: X + 128, y2: cy + c1, class: 'cl' });
        tx(X + W - 6, cy + c1 + 3, 'BL', 'dts', { 'text-anchor': 'end' });
        at(base + .6, .08, .4); dimV(top, cy + c0, X + 14, null, null, a, { side: 'r' }); dimV(cy + c1, bot, X + 14, null, null, b, { side: 'r' });
        callout(X + (i ? 114 : 120), cy + (i ? c0 : -15), X + 128, top - 14, i ? 'CAP' : 'LH', 1, 'dts');
        lbl(X + W / 2, bot + 18, n); });
      at(19.0, 0, .45); title(230, 990, 'Detail C · optical centering', 'Scale 1.5:1 · trim to cap and baseline · V3 = (H − CAP) ÷ 2'); }
    at(8.4, .004, .25); { const ws = [40, 100, 88]; let y = 78;
      y = table(1436, y, 'Size', [['H1', 'h-6 · xs', '24'], ['H2', 'h-7 · sm', '28'], ['H3', 'h-8 · default', '32'], ['H4', 'h-9 · lg', '36'], ['H5', 'min-h-11 · touch', '44'], ['Z1–Z5', 'size-6…11 · icon-*', '24·28·32·36·44'], ['T1', 'touch target', '44'], ['W', 'content', 'HUG']], ws);
      y = table(1436, y, 'Spacing', [['S1', 'px-2 · xs', '8'], ['S2', 'px-2.5 · sm·def·lg', '10'], ['S3', 'px-4 · touch', '16'], ['S4', 'icon-side pad', '6·6·8·12·14'], ['G1', 'gap-1 · xs·sm', '4'], ['G2', 'gap-1.5 · def·lg', '6'], ['G3', 'gap-2 · touch', '8'], ['V1', '(H − LH) / 2', '12 @ touch'], ['V2', '(Z − I) / 2', '6·6·8·10·14']], ws);
      y = table(1436, y, 'Type · icon', [['TS', 'text-xs·.8rem·sm', '12·12.8·14'], ['LH', 'line-height', '16·19.2·20'], ['FW', 'font-medium', '500'], ['I1', 'size-4', '16'], ['I2', 'size-3.5 · sm', '14'], ['I3', 'size-3 · xs', '12'], ['CAP', 'cap height', '≈ .73 em'], ['V3', '(H − CAP) ÷ 2', 'trim: no g j p q y']], ws);
      y = table(1436, y, 'Border · radius', [['B', 'border', '1'], ['R1', 'button-radius token', '0 · 4 · 64'], ['R', 'min(R1, H/2)', '≤ H/2']], ws);
      table(1436, y, 'States', [['F1', 'ring-3 · ring/50', '3'], ['OP', 'disabled opacity', '50%'], ['—', 'variants', 'tokens only']], ws); }
  },

  render(t) {
    t = t / DW_SPEED;
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
    // Layers appear flat (z = 0) and lift to their height; strokes first, fills after.
    const I = this.iso;
    this.lift.forEach((m) => {
      const v = eio(seg(t, m.a + 0.3, m.a + 1.5));
      m.g.style.opacity = eo(seg(t, m.a, m.a + 0.45));
      const fo = eo(seg(t, m.a + 0.6, m.a + 1.3)); if (fo !== m.fo) { m.fo = fo; m.fills = m.fills || m.g.querySelectorAll('.obj,.hug'); m.fills.forEach(e => { e.style.fillOpacity = fo; }); }
      m.g.setAttribute('transform', 'matrix(' + [I[0], I[1], I[2], I[3], I[4], I[5] - m.z * v].join(',') + ')');
      m.g.style.setProperty('--u', 1 / Math.sqrt(Math.abs(I[0] * I[3] - I[1] * I[2])));
    });
  },
});
