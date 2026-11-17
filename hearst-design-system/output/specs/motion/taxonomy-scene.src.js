// Reader taxonomy proposal (HP-TAX-001 · Draft) → motion film, ~81 s: the layer stack, today's cohort names, the regroup, the interests, the lookups, routes and phases, then the two drawing sheets.
// Pure function of time. Counts from the 2026-11-17 feed snapshot; build-taxonomy-scene.mjs embeds the two drawing sheets.
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
const box = (x, y, w, h, t, s, cls, a) => G(a == null ? 1 : a, Rc(x, y, w, h, cls || 'kobj', rx(6)) + T(x + w / 2, y + h / 2 + (s ? -4 : 7), t, 'kvt', 'text-anchor="middle"') + (s ? T(x + w / 2, y + h / 2 + 22, s, 'kdts', 'text-anchor="middle"') : ''));
const arrow = (x1, y1, x2, y2, a) => G(a == null ? 1 : a, Ln(x1, y1, x2, y2, 'kdl', 'marker-end="url(#ka)"'));
const plate = (x, y, w, d, cls) => `<path d="M${f1(x + d)},${f1(y)} H${f1(x + d + w)} L${f1(x + w)},${f1(y + d * .55)} H${f1(x)} Z" class="${cls}"/>`;


const CH = [0, 11, 22, 35, 46, 57, 68, 81];
const END = CH[CH.length - 1];
const CAPS = [
  [0, 'THE READER TAXONOMY · A PROPOSAL', 'Six layers. Stories sit at the bottom; what readers navigate sits at the top.'],
  [6, 'THE HIDDEN LAYERS', 'Stories and sales cohorts stay. Ads, analytics and ingestion keep using the cohort.'],
  [11, 'TODAY · FOUR COHORT NAMES', 'The utility bar shows how sales organizes audiences, not what readers come for.'],
  [17, 'THE READER MASTHEAD', 'Only the live-text descriptor changes. The lockup geometry stays the same.'],
  [22, 'REGROUP · 29 BRANDS', 'From four sales cohorts to five reader families. Each brand sits in one family.'],
  [28, 'FIVE BRANDS MOVE', 'Cosmopolitan, Seventeen and Prevention leave Lifestyle. Elle Décor and Veranda join Home & Food.'],
  [35, 'EIGHT INTERESTS', 'Stories grouped by what they are about, across every brand. Counts from today’s feed.'],
  [41, 'INTERESTS LEAD THE NAV', 'The utility bar, the masthead and onboarding all use the same eight words.'],
  [46, 'THREE LOOKUPS', 'The cohort for ads and analytics, the interest for navigation, the family for the brand list.'],
  [52, 'THE TOPIC MAP', '39 feed topic strings map to eight interests. Every auto-cohort story is Cars.'],
  [57, 'ROUTES · ONE MIGRATION', 'Group routes redirect to the closest interest. Brand pages move to /brands/{slug}/ once.'],
  [63, 'THREE PHASES', 'Split and rename, add interests, retire the group routes. Stop after phase 1 and you have option A.'],
  [68, 'THE DRAWING · SHEET 1', 'Structure: the stack, the utility bar, the masthead and the regroup matrix.'],
  [74.5, 'THE DRAWING · SHEET 2', 'Logic: the three lookups, the topic map, route migration, phases and open decisions.'],
];

const COHORTS = ['LIFESTYLE', 'AUTOS', 'FASHION & LUXURY', 'ENTHUSIAST & WELLNESS'];
const FAMILIES = ['HOME & FOOD', 'STYLE & CULTURE', 'HEALTH & FITNESS', 'CARS', 'TECH & GEAR'];
/* [brand, cohort index, family index] in cohort order */
const BRANDS = [
  ['Cosmopolitan', 0, 1], ['Country Living', 0, 0], ['Delish', 0, 0], ['Good Housekeeping', 0, 0], ['House Beautiful', 0, 0],
  ['The Pioneer Woman', 0, 0], ['Prevention', 0, 2], ['Redbook', 0, 0], ['Seventeen', 0, 1], ['Woman’s Day', 0, 0],
  ['Autoweek', 1, 3], ['Bring a Trailer', 1, 3], ['Car and Driver', 1, 3], ['HOT ROD', 1, 3], ['MotorTrend', 1, 3], ['Road & Track', 1, 3],
  ['Elle', 2, 1], ['Elle Décor', 2, 0], ['Esquire', 2, 1], ['Harper’s Bazaar', 2, 1], ['Town & Country', 2, 1], ['Veranda', 2, 0],
  ['Best Products', 3, 4], ['Bicycling', 3, 2], ['Men’s Health', 3, 2], ['Oprah Daily', 3, 2], ['Popular Mechanics', 3, 4], ['Runner’s World', 3, 2], ['Women’s Health', 3, 2],
];
const HOME = [0, 3, 1, 2]; // cohort → its own family (C4's Tech & Gear brands do not count as moves)
const MOVED = b => b[2] !== HOME[b[1]] && !(b[1] === 3 && b[2] === 4);
const INTERESTS = [['FOOD', 70], ['HOME & DESIGN', 86], ['STYLE & BEAUTY', 93], ['HEALTH & FITNESS', 145], ['CARS', 200], ['CULTURE', 147], ['SHOPPING', 56], ['TECH & GEAR', 62]];

kit.scene('taxonomy', {
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
      '.kn .kkey{fill:#fff;stroke:#111;stroke-width:1.6}.kn .kkt{font-size:17px;font-weight:700;fill:#111;letter-spacing:.06em}.kn .kkt2{font-size:18px;font-weight:700;fill:#fff}.kn .kcl{stroke:#999;stroke-width:1;stroke-dasharray:16 4 3 4}');
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
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-TAX-001 · READER TAXONOMY · PROPOSAL', 'kcap', 'text-anchor="end"');
  },

  /* A · the stack */
  A(t) {
    const a = win(t, 0, CH[1] + .1, .3, .5); if (a <= 0) return '';
    const L = [['6 · READER SURFACES', 'utility bar · reader masthead · onboarding · search', 'kobj'], ['5 · INTERESTS · 8', 'Food · Home & Design · Style & Beauty · Health & Fitness · Cars · Culture …', 'kobj'], ['4 · BRAND FAMILIES · 5', 'brand directory headings · theme source', 'kobj'], ['3 · BRANDS · 29', 'publication pages · own theme · unchanged', 'kobj'], ['2 · SALES COHORTS · 4 · HIDDEN', 'ads · analytics · ingestion', 'kwell'], ['1 · STORIES · 859', '39 feed topic strings · four snapshot files', 'kwell']];
    let s = ''; const X = 420, W = 900, D = 180;
    L.forEach(([h, d, c], i) => { const j = 5 - i, e = eio(seg(t, .3 + j * .5, 1.1 + j * .5)), y = lerp(980, 190 + i * 128, e);
      s += G(e, plate(X, y, W, D, c) + T(X + (W + D) / 2, y + 42, h, 'kvt', 'text-anchor="middle"') + T(X + (W + D) / 2, y + 74, d, 'krule', 'text-anchor="middle"')); });
    s += G(eo(seg(t, 4.2, 5)), Ln(X - 40, 860, X - 40, 210, 'kthick', 'marker-end="url(#ka)"') + T(X - 60, 520, 'WHAT READERS SEE', 'kdts', `text-anchor="middle" transform="rotate(-90 ${X - 60} 520)"`));
    const hz = eo(seg(t, 6.2, 7));
    s += G(hz, Ln(X + W + D + 40, 702, X + W + D + 40, 950, 'kframe2') + Ln(X + W + D + 30, 702, X + W + D + 50, 702, 'kframe2') + Ln(X + W + D + 30, 950, X + W + D + 50, 950, 'kframe2') + T(X + W + D + 66, 834, 'HIDDEN · UNCHANGED', 'kdts'));
    return G(a, s);
  },

  /* B · today's bar and the masthead descriptor */
  B(t) {
    const lt = t - CH[1]; const a = win(lt, 0, CH[2] - CH[1] + .1, .4, .5); if (a <= 0) return '';
    let s = '';
    const items = ['ALL', ...COHORTS, 'LOCAL NEWS'], ws = [110, 210, 160, 300, 380, 200], X0 = 960 - (ws.reduce((p, c) => p + c, 0) + 5 * 12 + 24) / 2, Y = 250;
    s += G(eo(seg(lt, .2, .7)), Rc(X0 - 12, Y - 12, ws.reduce((p, c) => p + c, 0) + 5 * 12 + 24 + 24, 84, 'kpill', rx(42)));
    let x = X0; const hi = lt > 1.4 && lt < 6 ? 1 + Math.min(3, Math.floor((lt - 1.4) / .9)) : -1;
    items.forEach((it, i) => { if (i === 5) x += 24; const e = eo(seg(lt, .4 + i * .15, .9 + i * .15));
      s += G(e, Rc(x, Y, ws[i], 60, i === hi ? 'kobj' : (i === 0 ? 'khug' : 'kslot'), rx(30)) + T(x + ws[i] / 2, Y + 37, it, 'kvt', 'text-anchor="middle"')); x += ws[i] + 12; });
    s += G(eo(seg(lt, 1.2, 1.8)), DH(X0 + 122, X0 + 122 + 210 + 160 + 300 + 380 + 36, Y + 110, 'SALES COHORTS · HOW ADS AND MARKETING ORGANIZE AUDIENCES', 'kdts'));
    // masthead descriptor swap
    const m = eo(seg(lt, 6, 6.6)), MX = 520, MY = 560;
    let ms = Rc(MX, MY, 880, 200, 'kobj', rx(12)) + Rc(MX + 60, MY + 60, 280, 80, 'khug', rx(4)) + T(MX + 200, MY + 108, 'HEARST+ LOCKUP', 'kvt', 'text-anchor="middle"') + Ln(MX + 370, MY + 50, MX + 370, MY + 150, 'kthin');
    const sw = eio(seg(lt, 8.2, 9.2));
    ms += G(1 - sw, Rc(MX + 400, MY + 64, 420, 72, 'kslot', rx(4)) + T(MX + 610, MY + 110, 'ENTHUSIAST & WELLNESS', 'kread2', 'text-anchor="middle"'));
    ms += G(sw, Rc(MX + 400, MY + 64, 420, 72, 'kslot', rx(4)) + T(MX + 610, MY + 110, 'HEALTH & FITNESS', 'kread2', 'text-anchor="middle"'));
    ms += DH(MX + 400, MX + 820, MY + 182, 'DESCRIPTOR · LIVE TEXT · HUG', 'kdts');
    s += G(m, ms);
    s += G(eo(seg(lt, 9.4, 10)), T(960, 870, 'Same lockup and sizes. The descriptor names the story’s interest instead of its cohort.', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* C · regroup: chips travel from cohort columns to family columns */
  C(t) {
    const lt = t - CH[2]; const a = win(lt, 0, CH[3] - CH[2] + .1, .4, .5); if (a <= 0) return '';
    const cw = 320, gap = 24, ch = 44, rg = 8, Y0 = 290;
    const fromX = i => (1920 - (4 * cw + 3 * gap)) / 2 + i * (cw + gap), toX = i => (1920 - (5 * cw + 4 * gap)) / 2 + i * (cw + gap);
    const fromRow = {}, toRow = {}, rowF = {}, rowT = {};
    BRANDS.forEach((b, k) => { fromRow[k] = rowF[b[1]] = (rowF[b[1]] ?? -1) + 1; });
    const famOrder = BRANDS.map((b, k) => k).sort((p, q) => BRANDS[p][2] - BRANDS[q][2] || BRANDS[p][1] - BRANDS[q][1] || p - q);
    famOrder.forEach(k => { const f = BRANDS[k][2]; toRow[k] = rowT[f] = (rowT[f] ?? -1) + 1; });
    let s = '';
    const hA = 1 - eo(seg(lt, 2.6, 3.1)), hB = eo(seg(lt, 5.4, 6));
    s += G(hA * eo(seg(lt, .2, .7)), COHORTS.map((c, i) => T(fromX(i) + cw / 2, Y0 - 30, 'C' + (i + 1) + ' · ' + c, 'kdts', 'text-anchor="middle"')).join(''));
    s += G(hB, FAMILIES.map((f, i) => T(toX(i) + cw / 2, Y0 - 30, 'F' + (i + 1) + ' · ' + f, 'kdts', 'text-anchor="middle"')).join(''));
    BRANDS.forEach((b, k) => {
      const e = eo(seg(lt, .4 + k * .04, .9 + k * .04)), p = eio(seg(lt, 3 + (b[2] * .25) + toRow[k] * .03, 5.2 + (b[2] * .25) + toRow[k] * .03));
      const x = lerp(fromX(b[1]), toX(b[2]), p), y = lerp(Y0 + fromRow[k] * (ch + rg), Y0 + toRow[k] * (ch + rg), p);
      const mv = MOVED(b), hl = mv && lt > 6.2 ? 'khug' : 'kobj';
      s += G(e, Rc(x, y, cw, ch, hl, rx(6)) + T(x + 18, y + 29, b[0], 'krule') + (mv && lt > 6.2 ? T(x + cw - 16, y + 29, 'MOVES', 'kdts', 'text-anchor="end"') : ''));
    });
    s += G(eo(seg(lt, 9, 9.6)), T(960, 860, 'Popular Mechanics and Best Products form Tech & Gear. A brand changes family with one line and no redirect.', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* D · interests with counts, then the proposed bar */
  D(t) {
    const lt = t - CH[3]; const a = win(lt, 0, CH[4] - CH[3] + .1, .4, .5); if (a <= 0) return '';
    let s = ''; const X = 300, BX = 700, Y = 220, rh = 64, scale = 900 / 200;
    INTERESTS.forEach(([n, c], i) => { const e = eo(seg(lt, .3 + i * .25, .8 + i * .25)), g = eio(seg(lt, .5 + i * .25, 1.7 + i * .25)), y = Y + i * rh;
      s += G(e, T(X, y + 34, 'I' + (i + 1) + ' · ' + n, 'kvt') + Rc(BX, y + 8, c * scale * g, 36, i === 4 ? 'khug' : 'kwell') + T(BX + c * scale * g + 16, y + 34, String(Math.round(c * g)), 'kvt')); });
    s += G(eo(seg(lt, 3.2, 3.8)), T(BX, Y + 8 * rh + 30, 'STORIES IN THE 2026-11-17 SNAPSHOT · Σ = 859 · 0 UNMAPPED', 'kdts'));
    const p = eo(seg(lt, 6, 6.6)), PY = 860, items = ['ALL', 'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'LN'];
    let ps = Rc(300, PY, 1320, 72, 'kpill', rx(36)); const w = 116;
    items.forEach((it, i) => { const x = 316 + i * (w + 12) + (i === 9 ? 16 : 0); ps += Rc(x, PY + 10, w, 52, i === 0 ? 'khug' : (i === 1 + (Math.floor(Math.max(0, lt - 7) / .5) % 8) ? 'kobj' : 'kslot'), rx(26)) + T(x + w / 2, PY + 44, it, 'kvt', 'text-anchor="middle"'); });
    s += G(p, ps);
    return G(a, s);
  },

  /* E · three lookups and the topic map */
  E(t) {
    const lt = t - CH[4]; const a = win(lt, 0, CH[5] - CH[4] + .1, .4, .5); if (a <= 0) return '';
    let s = ''; const sx = 140, sy = 430;
    s += box(sx, sy, 220, 100, 'STORY', 'brand · topic', 'khug', eo(seg(lt, .2, .6)));
    const R = [[230, 'COHORT', 'C1–C4 · hidden', 'kwell', ['ADS', 'ANALYTICS', 'INGESTION']], [430, 'INTEREST', 'I1–I8', 'kobj', ['UTILITY BAR', 'MASTHEAD', 'ONBOARDING']], [630, 'FAMILY', 'F1–F5 · by brand', 'kobj', ['BROWSE BRANDS', 'THEME', 'BRAND PICKER']]];
    R.forEach(([y, h, d, c, outs], i) => { const e = eo(seg(lt, .6 + i * .5, 1.1 + i * .5));
      s += arrow(sx + 220, sy + 50, 560, y + 50, e) + box(560, y, 280, 100, h, d, c, e);
      outs.forEach((o, k) => { const ek = eo(seg(lt, 1.4 + i * .5 + k * .2, 1.9 + i * .5 + k * .2)); s += arrow(k ? 940 + k * 320 - 40 : 840, y + 50, 940 + k * 320, y + 50, ek) + box(940 + k * 320, y + 14, 260, 72, o, '', c, ek); }); });
    // a story dot travelling down each lookup in turn
    if (lt > 3 && lt < 9) { const k = Math.min(2, Math.floor((lt - 3) / 2)), f = eio(clamp01(((lt - 3) % 2) / 1.6)), y = R[k][0] + 50;
      const cx = f < .5 ? lerp(sx + 220, 560, f * 2) : lerp(840, 1780, (f - .5) * 2), cy = f < .5 ? lerp(sy + 50, y, f * 2) : y;
      s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="12" class="kfill"/>`; }
    s += G(eo(seg(lt, 6, 6.6)), T(140, 860, 'Match on keys, never on label strings. Ads follow the story’s cohort, not the page label.', 'krule'));
    s += G(eo(seg(lt, 7.2, 7.8)), T(140, 900, 'Topic map: 39 feed strings → 8 interests · “Food Cooking” → Food · “Design” → Home & Design · “Gear” → Tech & Gear.', 'krule'));
    return G(a, s);
  },

  /* F · routes and phases */
  F(t) {
    const lt = t - CH[5]; const a = win(lt, 0, CH[6] - CH[5] + .1, .4, .5); if (a <= 0) return '';
    const rows = [['/hearst-lifestyle/food/', '/hearst-plus/food/'], ['/hearst-autos/{category}/', '/hearst-plus/cars/{category}/'], ['/hearst-flux/style/', '/hearst-plus/style-and-beauty/'], ['/hearst-ew/fitness/', '/hearst-plus/health-and-fitness/'], ['/{cohort}/{brand}/', '/brands/{brand}/'], ['/autos/hot-rod/events/', '/brands/hot-rod/events/']];
    let s = G(eo(seg(lt, .2, .6)), T(200, 220, 'NOW', 'kdts') + T(1000, 220, 'PROPOSED · 301 [TBD]', 'kdts'));
    rows.forEach(([o, n], i) => { const y = 240 + i * 64, e = eo(seg(lt, .4 + i * .3, .9 + i * .3)), e2 = eo(seg(lt, .8 + i * .3, 1.3 + i * .3));
      s += G(e, Rc(180, y, 620, 52, 'kobj', rx(6)) + T(200, y + 34, o, 'krule')) + arrow(810, y + 26, 980, y + 26, e2) + G(e2, Rc(990, y, 720, 52, 'khug', rx(6)) + T(1010, y + 34, n, 'krule')); });
    const P = [['1 · SPLIT + RENAME', 'reader grouping beside the cohort'], ['2 · INTEREST LAYER', 'topic map · interest pages · nav'], ['3 · RETIRE GROUP ROUTES', 'redirects · vault · Storybook · specs']];
    P.forEach(([h, d], i) => { const x = 180 + i * 520, e = eo(seg(lt, 6 + i * .6, 6.6 + i * .6)); s += box(x, 720, 480, 110, h, d, i ? 'kobj' : 'khug', e); if (i < 2) s += arrow(x + 480, 775, x + 520, 775, e); });
    s += G(eo(seg(lt, 8.4, 9)), Ln(690, 700, 690, 860, 'kframe') + T(700, 890, 'STOP HERE = OPTION A', 'kdts'));
    return G(a, s);
  },

  /* H · sheet tour */
  H(t) {
    const lt = t - CH[6]; const a = win(lt, 0, CH[7] - CH[6] + .5, .5, .8); if (a <= 0) return '';
    let s = '';
    [[0, 6.8], [6.5, 13]].forEach(([t0, t1], i) => {
      const aa = win(lt, t0, t1, .6, i ? .1 : .5); if (aa <= 0) return;
      const z = lerp(1, 1.05, seg(lt, t0, t1)), w = 1700 * .835 * z, h = 1060 * .835 * z;
      s += G(aa, `<image href="${SHEETS[i]}" x="${f1(960 - w / 2)}" y="${f1(165 + (900 - h) / 2)}" width="${f1(w)}" height="${f1(h)}"/>`);
    });
    return G(a, s);
  },

  render(t) {
    CLIP = 0;
    this.header(t);
    this.live.innerHTML = [this.A(t), this.B(t), this.C(t), this.D(t), this.E(t), this.F(t), this.H(t)].join('');
  },
});
