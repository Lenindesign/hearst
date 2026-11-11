// Agentic design system (HP-SYS-001 · Rev A) → motion film, ~82 s: how the vault, rules, skills, agents and the repo fit, and how a change moves.
// Pure function of time. Counts measured in the repo on 2026-11-11; build-system-scene.mjs embeds the two drawing sheets.
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

const CH = [0, 14, 24, 34, 44, 58, 66, 76, 88];
const END = CH[CH.length - 1];
const CAPS = [
  [0, 'THE AGENTIC DESIGN SYSTEM', 'Six layers. What we know sits at the bottom; what ships sits at the top.'],
  [7, 'KNOWLEDGE DOWN · EVIDENCE UP', 'Guidance flows from the vault to the code. Proof flows back up with every change.'],
  [14, 'THE VAULT · DESIGN BRAIN', '208 Markdown notes in 7 sections. Markdown is canonical; canvases and prototypes point back to it.'],
  [24, 'THE REPO · FIVE LAYERS', 'Token JSON → generated files → UI primitives → modules → two page archetypes.'],
  [29, 'GENERATED FILES', 'brands.ts and tokens.css are written by the build. Nobody edits them by hand.'],
  [34, 'ROUTING', 'Every request goes to the narrowest agent that can do it. Others only support.'],
  [44, 'THE LOOP', 'Request → classify → preflight → edit → build → QA → evidence → release.'],
  [50, 'STOP CONDITIONS', 'A renamed token key, a brand tokens can’t express, a broken .pen, an unasked deploy: stop and ask.'],
  [54, 'QA FAILS', 'The change goes back to the agent that owns the files, never to whoever is nearest.'],
  [58, 'SOURCES OF TRUTH', 'Git holds values, the vault holds guidance, code holds behavior. Figma and Pencil only receive.'],
  [66, 'WORKFLOWS', 'Token change, new publication, shared component, publication audit. Each step has one owner.'],
  [76, 'THE DRAWING · SHEET 1', 'Structure: the stack, the repo layers, the vault sections, the routing matrix and counts.'],
  [82, 'THE DRAWING · SHEET 2', 'Logic: the loop and its gate, stop conditions, sources of truth, workflows and evidence.'],
];

kit.scene('system', {
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
    this.head.innerHTML = G(a, T(120, 92, c[1], 'kcap') + T(120, 128, c[2], 'ksub')) + T(1800, 92, 'HP-SYS-001 · AGENTIC DESIGN SYSTEM', 'kcap', 'text-anchor="end"');
  },

  /* A · the stack */
  A(t) {
    const a = win(t, 0, CH[1] + .1, .3, .5); if (a <= 0) return '';
    const L = [['6 · OUTPUTS', 'app · Storybook · Figma · Pencil · spec pages', 'kobj'], ['5 · DESIGN SYSTEM REPO', '29 brands · 148 components · 59 stories', 'kobj'], ['4 · AGENTS', '9 roles, each owning a file boundary', 'kobj'], ['3 · SKILLS', '8 role skills · repo and personal skills', 'kobj'], ['2 · RULES', 'HDS Constitution · agent charter · runbooks', 'kobj'], ['1 · VAULT', 'Design Brain · 208 notes · 7 sections', 'kwell']];
    let s = ''; const X = 420, W = 900, D = 180;
    L.forEach(([h, d, c], i) => { const j = 5 - i, e = eio(seg(t, .3 + j * .5, 1.1 + j * .5)), y = lerp(980, 190 + i * 128, e);
      s += G(e, plate(X, y, W, D, c) + T(X + (W + D) / 2, y + 42, h, 'kvt', 'text-anchor="middle"') + T(X + (W + D) / 2, y + 74, d, 'krule', 'text-anchor="middle"')); });
    const e2 = eo(seg(t, 7.2, 8));
    s += G(e2, Ln(X - 40, 900, X - 40, 210, 'kthick', 'marker-end="url(#ka)"') + T(X - 60, 560, 'KNOWLEDGE', 'kdts', `text-anchor="middle" transform="rotate(-90 ${X - 60} 560)"`));
    s += G(eo(seg(t, 8.4, 9.2)), Ln(X + W + D + 40, 210, X + W + D + 40, 900, 'kthick', 'marker-end="url(#ka)"') + T(X + W + D + 60, 560, 'EVIDENCE', 'kdts', `text-anchor="middle" transform="rotate(90 ${X + W + D + 60} 560)"`));
    return G(a, s);
  },

  /* B · vault */
  B(t) {
    const lt = t - CH[1]; const a = win(lt, 0, CH[2] - CH[1] + .1, .4, .5); if (a <= 0) return '';
    const S = [['00', 'START HERE', 14, 'READY'], ['01', 'CONSTITUTION', 45, 'READY'], ['02', 'DESIGN SYSTEM', 21, 'IN REVIEW'], ['03', 'FEATURE REASONING', 5, 'IN REVIEW'], ['04', 'EDITORIAL', 9, 'DEPRECATED'], ['05', 'BRAND PLAYBOOKS', 110, 'IN REVIEW'], ['06', 'PROTOTYPE', 4, 'READY']];
    let s = '';
    S.forEach(([n, l, c, st], i) => { const e = eo(seg(lt, .4 + i * .35, 1 + i * .35)), y = 240 + i * 84;
      s += G(e, T(360, y + 34, n, 'kread2') + T(440, y + 34, l, 'kvt') + Rc(800, y + 10, c / 110 * 700 * e, 40, st === 'DEPRECATED' ? 'kslot' : 'khug') + T(800 + c / 110 * 700 * e + 16, y + 38, c + ' · ' + st, 'kdts')); });
    s += G(eo(seg(lt, 4.6, 5.2)), T(960, 880, 'Must = required · Should = default · May = optional', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* C · repo layers */
  C(t) {
    const lt = t - CH[2]; const a = win(lt, 0, CH[3] - CH[2] + .1, .4, .5); if (a <= 0) return '';
    const L = [['1 · TOKEN JSON', '29 brands · core · semantic · publications.json', 'khug'], ['2 · GENERATED', 'brands.ts · tokens.css', 'kslot'], ['3 · UI PRIMITIVES', 'src/components/ui', 'kobj'], ['4 · GLOBAL MODULES', 'src/components/hearst-plus · 148 files · 28 metadata', 'kobj'], ['5 · PAGE ARCHETYPES', 'Home + index · article + detail', 'kobj']];
    let s = ''; const X = 560, W = 800;
    L.forEach(([h, d, c], i) => { const e = eo(seg(lt, .3 + i * .5, .9 + i * .5)), y = 210 + i * 150; s += G(e, Rc(X, y, W, 100, c, rx(8)) + T(X + 30, y + 44, h, 'kvt') + T(X + 30, y + 76, d, 'krule')); if (i < 4) s += arrow(X + W / 2, y + 100, X + W / 2, y + 148, e); });
    const hz = eo(seg(lt, 5, 5.6)); s += G(hz, Rc(X + W - 120, 360, 120, 100, 'kwell') + `<rect x="${X + W - 120}" y="360" width="120" height="100" fill="url(#khat)"/>` + T(X + W + 30, 400, 'BUILD SCRIPTS ONLY', 'kvt') + T(X + W + 30, 432, 'npm run build-tokens', 'krule'));
    return G(a, s);
  },

  /* D · routing matrix */
  D(t) {
    const lt = t - CH[3]; const a = win(lt, 0, CH[4] - CH[3] + .1, .4, .5); if (a <= 0) return '';
    const A = ['TOKEN', 'STYLIST', 'COMPONENT', 'GRID', 'STORYBOOK', 'FIGMA', 'PENCIL', 'QA', 'RELEASE'];
    const R = [['Token values', { 0: 'P', 7: 'S' }], ['New publication', { 0: 'P', 1: 'S', 7: 'S', 5: 'S', 6: 'S' }], ['Component styling', { 2: 'P', 3: 'S', 4: 'S', 7: 'S' }], ['Layout · columns', { 3: 'P', 2: 'S', 7: 'S' }], ['Stories · docs', { 4: 'P', 2: 'S', 7: 'S' }], ['Figma variables', { 5: 'P', 7: 'S' }], ['Pencil specs', { 6: 'P', 7: 'S' }], ['Deploy · release', { 8: 'P', 7: 'S' }], ['Cross-brand review', { 7: 'P', 0: 'S', 2: 'S' }]];
    const X = 200, Y = 250, lw = 340, cw = 150, rh = 66; let s = '';
    const hi = Math.min(8, Math.floor(Math.max(0, lt - 1) / .9));
    s += G(eo(seg(lt, .2, .8)), A.map((h, j) => T(X + lw + j * cw + cw / 2, Y - 20, h, 'kdts', 'text-anchor="middle"')).join(''));
    R.forEach(([l, m], i) => { const y = Y + i * rh, on = i === hi && lt > 1; s += G(eo(seg(lt, .3 + i * .08, .8 + i * .08)), T(X, y + 42, l, on ? 'kvt' : 'krule') + A.map((_, j) => { const v = m[j]; return Rc(X + lw + j * cw, y, cw, rh, v === 'P' ? (on ? 'kfill' : 'khug') : 'kthin') + (v ? T(X + lw + j * cw + cw / 2, y + 42, v, on && v === 'P' ? 'kkt2' : 'kvt', 'text-anchor="middle"') : ''); }).join('')); });
    return G(a, s);
  },

  /* E · the loop */
  E(t) {
    const lt = t - CH[4]; const a = win(lt, 0, CH[5] - CH[4] + .1, .4, .5); if (a <= 0) return '';
    const S = [['REQUEST', 'plain English'], ['CLASSIFY', 'routing'], ['PREFLIGHT', 'status · owners'], ['EDIT', 'owned files'], ['BUILD', 'validate'], ['QA', '3+ brands'], ['EVIDENCE', 'PR · handoff'], ['RELEASE', 'deploy · sync']];
    const w = 176, g = 26, X = 960 - (8 * w + 7 * g) / 2, Y = 300; let s = '';
    S.forEach(([h, d], i) => { const x = X + i * (w + g); s += box(x, Y, w, 110, h, d, i === 0 || i === 7 ? 'khug' : 'kobj', eo(seg(lt, .2 + i * .2, .7 + i * .2))); if (i < 7) s += arrow(x + w, Y + 55, x + w + g, Y + 55, eo(seg(lt, .4 + i * .2, .9 + i * .2))); });
    // token travelling
    const path = [0, 1, 2, 3, 3.6, 3, 4, 5, 3, 3, 4, 5, 6, 7]; const tt = clamp01((lt - 2) / 11) * (path.length - 1), i0 = Math.floor(tt), f = eio(tt - i0), p = lerp(path[Math.min(i0, path.length - 1)], path[Math.min(i0 + 1, path.length - 1)], f);
    const onGate = p > 3.2 && p < 3.9, cx = X + Math.min(p, 7) * (w + g) + w / 2;
    // gate
    const gx = X + 3 * (w + g) + w / 2; s += G(eo(seg(lt, 3.5, 4)), `<path d="M${gx},${Y + 200} l110,60 l-110,60 l-110,-60 z" class="kobj"/>` + T(gx, Y + 266, 'STOP CONDITION?', 'kdts', 'text-anchor="middle"') + arrow(gx, Y + 110, gx, Y + 198) + arrow(gx + 110, Y + 260, gx + 260, Y + 260) + box(gx + 262, Y + 222, 260, 76, 'ASK THE OWNER', 'no guessing', 'khug'));
    s += G(eo(seg(lt, 9.5, 10)), `<path d="M${X + 5 * (w + g) + w / 2},${Y} V${Y - 60} H${gx} V${Y - 4}" class="kdl" fill="none" marker-end="url(#ka)"/>` + T((X + 5 * (w + g) + w / 2 + gx) / 2, Y - 74, 'QA FAILS → BACK TO THE OWNER', 'kdts', 'text-anchor="middle"'));
    if (lt > 2) s += `<circle cx="${f1(onGate ? gx : cx)}" cy="${f1(onGate ? Y + 260 : Y + 150)}" r="14" class="kfill"/>`;
    return G(a, s);
  },

  /* F · sources of truth */
  F(t) {
    const lt = t - CH[5]; const a = win(lt, 0, CH[6] - CH[5] + .1, .4, .5); if (a <= 0) return '';
    let s = '';
    s += box(300, 260, 360, 110, 'VAULT · MARKDOWN', 'guidance', 'kwell', eo(seg(lt, .2, .7))) + box(300, 560, 360, 110, 'GIT · TOKEN JSON', 'values', 'khug', eo(seg(lt, .5, 1)));
    s += box(900, 400, 380, 110, 'COMPONENT CODE', 'behavior', 'kobj', eo(seg(lt, .9, 1.4))) + box(1460, 400, 340, 110, 'APP · STORYBOOK', 'rendered', 'kobj', eo(seg(lt, 1.6, 2.1)));
    s += arrow(660, 315, 900, 440, eo(seg(lt, 1.2, 1.7))) + arrow(660, 615, 900, 480, eo(seg(lt, 1.2, 1.7))) + arrow(1280, 455, 1460, 455, eo(seg(lt, 2, 2.5)));
    s += box(260, 820, 220, 90, 'FIGMA', 'variables', 'kslot', eo(seg(lt, 3, 3.5))) + box(540, 820, 220, 90, 'PENCIL', '.pen specs', 'kslot', eo(seg(lt, 3.2, 3.7)));
    s += arrow(420, 670, 370, 818, eo(seg(lt, 3.6, 4.1))) + arrow(520, 670, 640, 818, eo(seg(lt, 3.6, 4.1)));
    s += G(eo(seg(lt, 4.4, 5)), T(1200, 860, 'One way: Git → Figma / Pencil. Never back.', 'krule', 'text-anchor="middle"'));
    return G(a, s);
  },

  /* G · workflows */
  G2(t) {
    const lt = t - CH[6]; const a = win(lt, 0, CH[7] - CH[6] + .1, .4, .5); if (a <= 0) return '';
    const W = [['TOKEN CHANGE', ['Token', 'Build', 'QA × 3', 'PR', 'Sync']], ['NEW PUBLICATION', ['Stylist', 'Token', 'Component', 'Storybook', 'QA', 'Release']], ['SHARED COMPONENT', ['Component', 'Metadata', 'Storybook', 'QA']], ['PUBLICATION AUDIT', ['QA', 'Findings', 'Small PRs']]];
    let s = '';
    W.forEach(([n, st], i) => { const y = 250 + i * 170, e = eo(seg(lt, .3 + i * 1.6, .8 + i * 1.6)); s += G(e, T(160, y + 52, n, 'kvt'));
      st.forEach((x, j) => { const xx = 560 + j * 210, ej = eo(seg(lt, .5 + i * 1.6 + j * .2, 1 + i * 1.6 + j * .2)); s += G(ej, Rc(xx, y, 180, 84, 'kobj', rx(6)) + T(xx + 90, y + 50, x, 'krule', 'text-anchor="middle"')); if (j < st.length - 1) s += arrow(xx + 180, y + 42, xx + 210, y + 42, ej); }); });
    return G(a, s);
  },

  /* H · sheet tour */
  H(t) {
    const lt = t - CH[7]; const a = win(lt, 0, CH[8] - CH[7] + .5, .5, .8); if (a <= 0) return '';
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
    this.live.innerHTML = [this.A(t), this.B(t), this.C(t), this.D(t), this.E(t), this.F(t), this.G2(t), this.H(t)].join('');
  },
});
