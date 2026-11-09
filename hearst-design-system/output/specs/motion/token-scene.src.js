// Token architecture (UI-TOKEN-001 · Rev A) → motion film, ~156 s.
// Pure function of time: render(t) rebuilds each live group from t alone.
// A 0–10 one button, 29 brands · B 10–26 four tiers · C 26–38 name anatomy · D 38–58 resolving one token
// E 58–76 pipeline · F 76–90 scopes · G 90–100 guards · H 100–140 brand guides · I 140–156 sheet tour.
// Drawing beats are monochrome; the brand beats (A, D, H) show real brand colors and logos as data.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEET = __SHEET__;
const BRANDS = __BRANDS__;   // [{ slug, name, colors:[hex…], btn, label, radius, fontDefault, fontSecondary, fontHeadline, weight, section }]
const LOGOS = __LOGOS__;     // { slug: data URI }
const BY = Object.fromEntries(BRANDS.map(b => [b.slug, b]));

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);
const T = (x, y, s, cls, ex) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls || 'kdt'}" ${ex || ''}>${esc(s)}</text>`;
const Rc = (x, y, w, h, cls, ex) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" class="${cls}" ${ex || ''}/>`;
const Ln = (x1, y1, x2, y2, cls, ex) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${ex || ''}/>`;
const op = a => `opacity="${clamp01(a).toFixed(3)}"`;
const G = (a, inner) => a <= 0 ? '' : `<g ${op(a)}>${inner}</g>`;
const arrow = (x1, y1, x2, y2) => Ln(x1, y1, x2, y2, 'kdl', 'marker-end="url(#ka)"');
const win = (t, a, b, fi, fo) => Math.min(eo(seg(t, a, a + (fi || .5))), 1 - eo(seg(t, b - (fo || .5), b)));
const capAt = (list, t) => { let c = list[0]; for (const x of list) if (t >= x[0]) c = x; return c; };
const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const contrast = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + .05) / (l + .05); };
const mixHex = (a, b, p) => '#' + [1, 3, 5].map(i => Math.round(lerp(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), p)).toString(16).padStart(2, '0')).join('');
function button(x, y, w, h, bg, fg, r, label, fs) {
  return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(r, h / 2))}" fill="${bg}" stroke="${bg === '#ffffff' ? '#cfcfcf' : bg}"/>` +
    `<text x="${f1(x + w / 2)}" y="${f1(y + h / 2 + fs * .35)}" text-anchor="middle" fill="${fg}" style="font-family:Inter;font-weight:600;font-size:${fs}px">${esc(label)}</text>`;
}
function logo(slug, cx, cy, w, h) {
  const uri = LOGOS[slug];
  if (!uri) return T(cx, cy + 10, BY[slug]?.name ?? slug, 'klogoName', 'text-anchor="middle"');
  return `<image href="${uri}" x="${f1(cx - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="xMidYMid meet"/>`;
}

/* ---------- data ---------- */
const TIERS = [['T1', 'CORE', 624, 'raw color, size, space, radius', 'palette.gray.11 = #1c1c1c'], ['T2', 'SEMANTIC', 412, 'roles: palette, type scale, space', 'palette.neutral.1000 → {_palette.gray.11}'], ['T3', 'COMPONENT', 398, 'button, card, chip, badge', 'button background → {palette.primary.1000}'], ['T4', 'BRAND', 607, '29 files, every token resolved', 'cosmopolitan.json → #d70000']];
const NAME = [['component', 'TIER'], ['button', 'COMPONENT'], ['background', 'PROPERTY'], ['primary', 'INTENT'], ['solid', 'VARIANT'], ['default', 'STATE']];
const CHAIN = [['T3', 'component.button.background.primary.solid-default', '{palette.primary.1000}'], ['T2', 'palette.primary.1000', '{palette.neutral.1000}'], ['T2', 'palette.neutral.1000', '{_palette.gray.11}'], ['T1', 'palette.gray.11', '#1C1C1C']];
const SWAP = ['cosmopolitan', 'esquire', 'car-and-driver', 'delish', 'mens-health', 'town-and-country', 'good-housekeeping', 'oprah-daily'].filter(s => BY[s]);
const CYCLE = ['cosmopolitan', 'esquire', 'car-and-driver', 'delish', 'elle', 'good-housekeeping', 'runners-world', 'town-and-country', 'womans-day', 'seventeen', 'popular-mechanics'].filter(s => BY[s]);
const PIPE = [['P1', 'SOURCE', ['tokens/core', 'tokens/semantic', 'tokens/brands', '_meta.json'], 'Values are authored once, as JSON in Git. Nothing downstream is edited by hand.'],
  ['P2', 'BUILD', ['npm run', 'build-tokens', 'resolve aliases', 'validate'], 'One build resolves every alias and validates the graph.'],
  ['P3', 'OUTPUT', ['brands.ts', 'tokens.css', '29 brands', '10,508 vars'], 'It writes typed brand data and a CSS file: the only generated artifacts.'],
  ['P4', 'RUNTIME', ['theme-options', 'brandToCssVars', '+7 sections', 'guards'], 'At runtime each theme becomes 282 CSS custom properties, then the guards run.'],
  ['P5', 'SCOPE', [':root', 'product', 'section', '[data-brand]'], 'The vars are set on nested wrappers; the nearest one wins.'],
  ['P6', 'MAP', ['@theme inline', 'bg-primary', '[data-slot]', 'component CSS'], 'Tailwind maps vars to utilities; component CSS reads component tokens.'],
  ['P7', 'RENDER', ['Button', 'Card · Badge', 'reader', 'river'], 'Components read tokens, never hex, so one Button works in every brand.']];
const SCOPES = [[':root', 'core defaults · tokens.css'], ['.hearst-plus-theme', 'product vars · --hp-*'], ['section wrapper', 'brandToCssVars(section)'], ['[data-brand] wrapper', 'brandToCssVars(publication)']];
const CAPS = [
  [0, 'ONE BUTTON, 29 BRANDS', 'The same Button component renders in every Hearst brand. Tokens are the reason it never needs brand code.'],
  [10, 'FOUR TIERS', 'Core holds raw values. Semantic names their roles. Component decides per component. Brand files resolve it all for one brand.'],
  [20, 'COMPONENTS READ T2 AND T3', 'A component never reads a core value or a hex code, so a brand can change a color without touching it.'],
  [26, 'ONE NAME, SIX PARTS', 'Every token name reads the same way: tier, component, property, intent, variant, state.'],
  [34, 'STATES', 'The last part changes with interaction: default, hover, active, disabled.'],
  [38, 'RESOLVING ONE TOKEN', 'The primary button background follows its aliases down to a core gray in the default theme.'],
  [45, 'THE BRAND TIER', 'Each brand file resolves the same name to its own value. Same token, different brand, different button.'],
  [58, 'THE PIPELINE', 'Seven stages take a value from Git to a rendered pixel.'],
  [76, 'SCOPES', 'CSS custom properties are set on nested wrappers. A component uses the nearest scope that defines the var.'],
  [84, 'PORTALS', 'Dialogs render outside the wrappers, so the portal root copies the nearest scope and keeps the brand.'],
  [90, 'GUARDS', 'After a brand is applied, the runtime checks contrast and fixes what would not be readable.'],
  [100, 'BRAND GUIDES', 'Logo, colors, type families, headline weight and button radius for every brand, read straight from the tokens.'],
  [140, 'THE DRAWING', 'UI-TOKEN-001 Rev A: the pipeline, tiers, alias chain, name anatomy, scopes and guards on one sheet.'],
];

kit.scene('token-architecture', {
  init(kit) {
    kit.css('.tk{position:absolute;inset:0;background:#fff}.tk svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.tk .kcap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.tk .ksub{font-size:24px;fill:#333}' +
      '.tk .kdt{font-size:17px;fill:#111}.tk .kdts{font-size:13px;letter-spacing:.08em;fill:#555;text-transform:uppercase}.tk .ksl{font-size:13px;letter-spacing:.1em;fill:#555;text-transform:uppercase}' +
      '.tk .kbig{font-size:44px;fill:#111;letter-spacing:.02em}.tk .kread2{font-size:20px;fill:#444;letter-spacing:.08em;text-transform:uppercase}.tk .kvt{font-size:22px;letter-spacing:.12em;fill:#111;text-transform:uppercase}' +
      '.tk .kmono{font-family:"Geist Mono",ui-monospace,Menlo,monospace;fill:#111}.tk .klogoName{font-size:28px;font-weight:700;fill:#111}' +
      '.tk .kobj{fill:#fff;stroke:#111;stroke-width:2}.tk .kwell{fill:#f1f1f1;stroke:#111;stroke-width:1.2}.tk .khug{fill:#e2e2e2;stroke:#111;stroke-width:1.2}.tk .kon{fill:#111;stroke:#111}' +
      '.tk .kslot{fill:none;stroke:#555;stroke-width:1.2;stroke-dasharray:7 5}.tk .kdl{stroke:#111;stroke-width:1.4;fill:none}.tk .kext{stroke:#111;stroke-width:.9}.tk .kcard{fill:#fff;stroke:#d8d8d8;stroke-width:1.2}');
    const root = kit.h('<div class="tk"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = '<defs><marker id="ka" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,1.7 L10,5 L0,8.3 z" fill="#111"/></marker>' +
      '<clipPath id="kwipe"><rect id="kwr" x="0" y="-20" width="0" height="1100"/></clipPath></defs>';
    const g = id => { const e = document.createElementNS(NS, 'g'); e.id = id; svg.appendChild(e); return e; };
    this.head = g('kh'); this.L = g('kl');
    const wrap = g('ks'); this.cam = document.createElementNS(NS, 'g'); wrap.appendChild(this.cam);
    const holder = document.createElementNS(NS, 'g'); holder.setAttribute('transform', 'translate(110,10)'); holder.setAttribute('clip-path', 'url(#kwipe)'); this.cam.appendChild(holder);
    holder.appendChild(document.importNode(new DOMParser().parseFromString(SHEET, 'image/svg+xml').documentElement, true));
    this.sheet = wrap; this.wipe = svg.querySelector('#kwr');
    ['400 20px "Geist Mono"', '600 20px Inter', '400 12px Arimo'].forEach(f => document.fonts.load(f));
  },

  header(t) {
    const c = capAt(CAPS, t), a = eo(seg(t, c[0], c[0] + .45));
    this.head.innerHTML = T(120, 92, c[1], 'kcap', op(a)) + T(120, 128, c[2], 'ksub', op(a)) + T(1800, 92, 'UI-TOKEN-001 · TOKEN ARCHITECTURE', 'kcap', 'text-anchor="end"');
  },

  /* A · one button, many brands */
  beatA(t) {
    const a = win(t, 0, 10.2, .6, .7); if (a <= 0) return '';
    const p = clamp01((t - 1.4) / 8.2) * (CYCLE.length - 1), i = Math.floor(p), fr = eio(clamp01((p - i) * 2.2));
    const A = BY[CYCLE[i]], B = BY[CYCLE[Math.min(i + 1, CYCLE.length - 1)]];
    const bg = mixHex(A.btn, B.btn, fr), fg = fr < .5 ? A.label : B.label, r = lerp(A.radius, B.radius, fr), cur = fr < .5 ? A : B;
    let s = button(660, 430, 600, 130, bg, fg, r * 2.2, 'Read the story', 44);
    s += G(1, logo(cur.slug, 960, 330, 420, 90));
    s += T(960, 640, `${cur.name.toUpperCase()} · ${bg.toUpperCase()} · RADIUS ${Math.round(r)} PX`, 'kread2', 'text-anchor="middle"');
    s += T(960, 760, '<Button size="touch">Read the story</Button>', 'kmono', 'text-anchor="middle" style="font-size:26px"');
    s += T(960, 800, 'SAME CODE IN EVERY BRAND', 'ksl', 'text-anchor="middle"');
    return G(a, s);
  },

  /* B · tiers */
  beatB(t) {
    const a = win(t, 10, 26.2, .6, .7); if (a <= 0) return '';
    let s = ''; const cx = 960, w = 1000, sk = 70, h = 118;
    TIERS.forEach(([code, name, n, desc, ex], i) => {
      const y = 820 - i * 165, at = 10.6 + i * 1.8, p = eo(seg(t, at, at + .8));
      if (p <= 0) return;
      const dim = t > 20.4 && (i === 0 || i === 3) ? .45 : 1, hot = t > 20.4 && (i === 1 || i === 2);
      const shift = (1 - p) * 40;
      const path = `M${cx - w / 2 + sk},${y - h + shift} L${cx + w / 2 + sk},${y - h + shift} L${cx + w / 2 - sk},${y + shift} L${cx - w / 2 - sk},${y + shift} Z`;
      const count = Math.round(n * eo(seg(t, at + .2, at + 1.6)));
      s += G(p * dim, `<path d="${path}" class="${hot ? 'khug' : 'kwell'}" ${hot ? 'style="stroke-width:3"' : ''}/>` +
        T(cx - w / 2 - sk - 24, y - h / 2 + 8 + shift, code, 'kbig', 'text-anchor="end"') +
        T(cx, y - h / 2 - 12 + shift, name, 'kvt', 'text-anchor="middle" style="font-size:28px"') +
        T(cx, y - h / 2 + 22 + shift, (i === 3 ? `29 × ${count}` : count) + ' · ' + desc.toUpperCase(), 'ksl', 'text-anchor="middle" style="font-size:16px"') +
        T(cx, y - h / 2 + 50 + shift, ex, 'kmono', 'text-anchor="middle" style="font-size:18px;fill:#555"'));
      if (i > 0) s += G(p * dim, arrow(cx + 560, y + shift, cx + 560, y + 40 + shift) + T(cx + 580, y + 26 + shift, 'ALIASES INTO', 'ksl'));
    });
    return G(a, s);
  },

  /* C · name anatomy */
  beatC(t) {
    const a = win(t, 26, 38.2, .6, .7); if (a <= 0) return '';
    const fs = 44, y = 520; let s = '';
    const cv = this.cv ??= document.createElement('canvas').getContext('2d'); cv.font = `400 ${fs}px "Geist Mono", ui-monospace, monospace`;
    const states = ['default', 'hover', 'active', 'disabled'], st = t < 34 ? 0 : Math.min(3, Math.floor((t - 34) / 1));
    const parts = NAME.map(([p, l], i) => [i === 5 ? states[st] : p, l]);
    const widths = parts.map(([p]) => cv.measureText(p).width + 36), total = widths.reduce((x, y2) => x + y2, 0) + 5 * 14;
    let x = 960 - total / 2;
    parts.forEach(([p, l], i) => {
      const at = 26.6 + i * .9, q = eo(seg(t, at, at + .6)); const w = widths[i];
      s += G(q, Rc(x, y - 70, w, 96, i % 2 ? 'kwell' : 'khug', 'rx="8"') + T(x + 18, y - 8, p, 'kmono', `style="font-size:${fs}px"`) +
        Ln(x, y + 60, x + w, y + 60, 'kdl') + Ln(x, y + 48, x, y + 72, 'kext') + Ln(x + w, y + 48, x + w, y + 72, 'kext') +
        T(x + w / 2, y + 104, l, 'kread2', 'text-anchor="middle"'));
      x += w + 14;
    });
    s += G(eo(seg(t, 32.4, 33)), T(960, 760, `--component-button-background-primary-solid-${states[st]}`, 'kmono', 'text-anchor="middle" style="font-size:28px;fill:#555"'));
    return G(a, s);
  },

  /* D · resolving one token, then brand swap */
  beatD(t) {
    const a = win(t, 38, 58.2, .6, .7); if (a <= 0) return '';
    let s = ''; const x = 200, w = 1520, rh = 70, y0 = 200;
    CHAIN.forEach(([c, n, v], i) => {
      const y = y0 + i * (rh + 26), q = eo(seg(t, 38.6 + i * 1.3, 39.2 + i * 1.3));
      s += G(q, Rc(x, y, w, rh, i === 3 ? 'khug' : 'kwell', 'rx="8"') + T(x + 24, y + 45, c, 'kbig', 'style="font-size:30px"') +
        T(x + 110, y + 46, n, 'kmono', 'style="font-size:28px"') + T(x + w - 24, y + 46, v, 'kmono', 'text-anchor="end" style="font-size:28px"') +
        (i < 3 ? arrow(x + w / 2, y + rh + 2, x + w / 2, y + rh + 24) : ''));
    });
    s += G(eo(seg(t, 43.6, 44.2)), `<rect x="${x + w - 230}" y="${y0 + 3 * (rh + 26) + 12}" width="46" height="46" rx="6" fill="#1c1c1c"/>`);
    const bq = eo(seg(t, 45, 45.6));
    if (bq > 0) {
      const i = Math.min(SWAP.length - 1, Math.max(0, Math.floor((t - 46) / 1.45))), B = BY[SWAP[i]];
      const y = y0 + 4 * (rh + 26) + 20;
      s += G(bq, Rc(x, y, w, rh, 'kobj', 'rx="8" style="stroke-width:3"') + T(x + 24, y + 45, 'T4', 'kbig', 'style="font-size:30px"') +
        T(x + 110, y + 46, `brands/${B.slug}.json · same token name`, 'kmono', 'style="font-size:26px"') +
        `<rect x="${x + w - 310}" y="${y + 12}" width="46" height="46" rx="6" fill="${B.btn}" stroke="#ccc"/>` +
        T(x + w - 24, y + 46, B.btn.toUpperCase(), 'kmono', 'text-anchor="end" style="font-size:28px"') +
        button(x, y + 120, 420, 90, B.btn, B.label, B.radius * 1.6, 'Read the story', 30) +
        logo(B.slug, x + 760, y + 165, 360, 64) +
        T(x + w, y + 175, `RADIUS ${B.radius} PX · LABEL ${B.label.toUpperCase()}`, 'kread2', 'text-anchor="end"'));
    }
    return G(a, s);
  },

  /* E · pipeline */
  beatE(t) {
    const a = win(t, 58, 76.2, .6, .7); if (a <= 0) return '';
    let s = ''; const w = 222, g = 30, x0 = (1920 - (7 * w + 6 * g)) / 2, y = 330, h = 300;
    const k = clamp01((t - 59) / 15.5) * 7, cur = Math.min(6, Math.floor(k));
    PIPE.forEach(([c, n, lines], i) => {
      const x = x0 + i * (w + g), q = eo(seg(t, 58.4 + i * .25, 58.9 + i * .25)), on = i <= cur;
      s += G(q, Rc(x, y, w, h, on ? 'kobj' : 'kwell', 'rx="10"' + (i === cur ? ' style="stroke-width:4"' : '')) +
        Rc(x, y, w, 46, i === cur ? 'on' : 'khug', 'rx="10"') + T(x + w / 2, y + 31, n, 'kvt', `text-anchor="middle" ${i === cur ? 'style="fill:#fff"' : ''}`) +
        lines.map((l, j) => T(x + 18, y + 92 + j * 40, l, 'kmono', 'style="font-size:21px"')).join('') +
        T(x + w / 2, y + h + 34, c, 'kread2', 'text-anchor="middle"') + (i < 6 ? arrow(x + w + 3, y + h / 2, x + w + g - 3, y + h / 2) : ''));
    });
    const px = x0 + Math.min(6.999, k) * (w + g) - g / 2 + (k < 1 ? g / 2 : 0);
    s += `<circle cx="${f1(Math.max(x0, px))}" cy="${y + h + 70}" r="10" fill="#111"/>` + Ln(x0, y + h + 70, x0 + 7 * w + 6 * g, y + h + 70, 'kdl', 'opacity=".35"');
    s += T(960, 820, PIPE[cur][3], 'ksub', 'text-anchor="middle" style="font-size:28px;fill:#111"');
    return G(a, s);
  },

  /* F · scopes */
  beatF(t) {
    const a = win(t, 76, 90.2, .6, .7); if (a <= 0) return '';
    let s = ''; const x = 160, y = 220;
    SCOPES.forEach(([n, d], i) => {
      const q = eo(seg(t, 76.4 + i * .8, 77 + i * .8)); const ix = x + i * 36, iy = y + i * 90, w = 900 - i * 72, hh = 640 - i * 150;
      s += G(q, Rc(ix, iy, w, hh, i === 3 ? 'khug' : i === 0 ? 'kobj' : 'kwell', 'rx="12"' + (t > 80.5 && t < 84 && i === 3 ? ' style="stroke-width:4"' : '')) +
        T(ix + 22, iy + 40, n, 'kmono', 'style="font-size:26px"') + T(ix + 22, iy + 70, d.toUpperCase(), 'ksl', 'style="font-size:15px"'));
    });
    const lq = eo(seg(t, 80, 80.6));
    if (lq > 0) {
      const found = t > 81.6;
      s += G(lq, T(1160, 300, 'var(--component-button-background-primary-solid-default)', 'kmono', 'style="font-size:22px"') +
        ['[data-brand] wrapper', 'section wrapper', '.hearst-plus-theme', ':root'].map((n, i) => T(1180, 360 + i * 44, (i === 0 ? (found ? '✓ ' : '· ') : '  ') + n + (i === 0 && found ? ' → #D70000' : ''), 'kmono', `style="font-size:22px;fill:${i === 0 ? '#111' : '#999'}"`)).join('') +
        (found ? T(1180, 560, 'NEAREST SCOPE WINS · LOOKUP STOPS HERE', 'kread2') : ''));
    }
    const pq = eo(seg(t, 84.4, 85));
    if (pq > 0) {
      const copied = t > 86.6;
      s += G(pq, Rc(1160, 640, 560, 200, 'kslot', 'rx="12"') + T(1182, 680, 'portal root (dialog in <body>)', 'kmono', 'style="font-size:22px"') +
        T(1182, 710, copied ? 'USEINHERITEDTHEMESCOPE COPIED THE VARS' : 'OUTSIDE EVERY WRAPPER · NO BRAND VARS', 'ksl', 'style="font-size:15px"') +
        button(1182, 740, 300, 70, copied ? BY.cosmopolitan.btn : '#ffffff', copied ? '#ffffff' : '#111111', 0, 'Sign in', 26) +
        `<path d="M${x + 760},${y + 470} C${x + 900},${y + 520} 1060,700 1156,720" class="kdl" marker-end="url(#ka)" ${op(copied ? 1 : .25)}/>`);
    }
    return G(a, s);
  },

  /* G · guards */
  beatG(t) {
    const a = win(t, 90, 100.2, .6, .7); if (a <= 0) return '';
    let s = ''; const aw = BY.autoweek?.colors[0] ?? '#ffc84e';
    const fixed = t > 93.2, fg = fixed ? '#121212' : '#ffffff', cr = contrast(aw, fg);
    s += T(260, 300, 'G1 · BUTTON LABEL ≥ 4.5:1', 'kvt') + button(260, 340, 560, 140, aw, fg, 0, 'Read the story', 46) +
      T(260, 540, `${aw.toUpperCase()} WITH ${fg.toUpperCase()} · ${cr.toFixed(1)}:1 ${cr >= 4.5 ? '✓ PASSES' : '✗ FAILS'}`, 'kread2') +
      T(260, 580, fixed ? 'GUARD PICKED THE FIRST LABEL THAT PASSES' : 'A THEME SETS A LIGHT BUTTON WITH A WHITE LABEL', 'ksl', 'style="font-size:15px"');
    const ve = BY.veranda?.btn ?? '#f3ead9', falls = t > 96.6, hc = falls ? '#121212' : ve, hr = contrast(hc, '#ffffff');
    const gq = eo(seg(t, 94.6, 95.2));
    s += G(gq, T(1060, 300, 'G2 · AD HEADLINE ≥ 3:1', 'kvt') + Rc(1060, 340, 600, 300, 'kcard', 'rx="10"') +
      T(1090, 420, 'Find Your Place', '', `style="font-family:'Schibsted Grotesk';font-weight:800;font-size:48px;fill:${hc}"`) +
      T(1090, 470, 'Advertisement headline in the CTA color', '', 'style="font-family:Inter;font-size:22px;fill:#555"') +
      button(1090, 520, 260, 70, ve, '#121212', 0, 'Explore', 24) +
      T(1060, 690, `${hc.toUpperCase()} ON WHITE · ${hr.toFixed(1)}:1 ${hr >= 3 ? '✓' : '✗'}`, 'kread2') +
      T(1060, 730, falls ? 'FELL BACK TO THE TEXT COLOR' : 'VERANDA’S CTA COLOR IS TOO LIGHT FOR TEXT', 'ksl', 'style="font-size:15px"'));
    return G(a, s);
  },

  /* H · brand guides, 6 per page */
  beatH(t) {
    const a = win(t, 100, 140.2, .6, .7); if (a <= 0) return '';
    const page = Math.min(4, Math.floor((t - 100) / 8)), pt = t - 100 - page * 8;
    const list = BRANDS.slice(page * 6, page * 6 + 6);
    const pa = Math.min(eo(seg(pt, 0, .5)), page === 4 ? 1 : 1 - eo(seg(pt, 7.5, 8)));
    let s = ''; const cw = 540, ch = 360, gx = 36, gy = 30, x0 = (1920 - (3 * cw + 2 * gx)) / 2, y0 = 190;
    list.forEach((b, i) => {
      const x = x0 + (i % 3) * (cw + gx), y = y0 + Math.floor(i / 3) * (ch + gy), q = eo(seg(pt, .1 + i * .12, .6 + i * .12));
      let c = Rc(x, y, cw, ch, 'kcard', 'rx="12"') + Ln(x, y + 104, x + cw, y + 104, 'kext', 'style="stroke:#e2e2e2"') + logo(b.slug, x + cw / 2, y + 52, 380, 58);
      c += T(x + 24, y + 140, b.name, '', 'style="font-family:Inter;font-weight:700;font-size:22px;fill:#111"') + T(x + cw - 24, y + 140, b.section.toUpperCase(), 'ksl', 'text-anchor="end"');
      b.colors.slice(0, 6).forEach((hex, j) => { const sx = x + 24 + j * 82; c += `<rect x="${sx}" y="${y + 160}" width="70" height="42" rx="5" fill="${hex}" stroke="#d6d6d6"/>` + T(sx, y + 222, hex.toUpperCase(), 'kmono', 'style="font-size:13px;fill:#555"'); });
      c += T(x + 24, y + 260, `HEADLINE  ${b.fontHeadline} · ${b.weight}`, 'ksl', 'style="font-size:14px;fill:#333"') + T(x + 24, y + 284, `SECONDARY  ${b.fontSecondary}`, 'ksl', 'style="font-size:14px;fill:#333"') + T(x + 24, y + 308, `BODY  ${b.fontDefault}`, 'ksl', 'style="font-size:14px;fill:#333"');
      c += button(x + cw - 214, y + 268, 190, 52, b.btn, b.label, b.radius, 'Read', 20) + T(x + cw - 24, y + 342, `RADIUS ${b.radius}`, 'ksl', 'text-anchor="end"');
      s += G(q, c);
    });
    s += T(1800, 1010, `${Math.min(BRANDS.length, page * 6 + list.length)} OF ${BRANDS.length}`, 'kread2', 'text-anchor="end"');
    return G(a * pa, s);
  },

  render(t) {
    this.header(t);
    this.L.innerHTML = this.beatA(t) + this.beatB(t) + this.beatC(t) + this.beatD(t) + this.beatE(t) + this.beatF(t) + this.beatG(t) + this.beatH(t);
    const on = t >= 139.8; this.sheet.style.display = on ? '' : 'none';
    if (on) {
      this.wipe.setAttribute('width', 1700 * eio(seg(t, 140, 142.2)));
      const K = [[140, 960, 540, 1], [142.6, 960, 540, 1], [143.8, 1045, 190, 1.9], [145, 1047, 192, 1.88], [145.8, 380, 490, 2.0], [146.8, 382, 492, 1.98], [147.6, 870, 580, 1.75], [148.8, 872, 582, 1.73], [149.6, 1350, 640, 1.9], [150.6, 1352, 642, 1.88], [151.4, 870, 860, 1.9], [152.2, 872, 862, 1.88], [153, 1660, 320, 1.8], [153.8, 1662, 322, 1.78], [154.8, 960, 540, 1], [156, 960, 540, .99]];
      let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
      const a = K[i], b = K[i + 1], p = eio(seg(t, a[0], b[0]));
      const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)), cx = lerp(a[1], b[1], p), cy = lerp(a[2], b[2], p);
      this.cam.setAttribute('transform', 'translate(' + (960 - cx * z) + ',' + (540 - cy * z) + ') scale(' + z + ')');
      this.head.style.display = t > 140.4 ? 'none' : '';
    } else this.head.style.display = '';
  },
});
