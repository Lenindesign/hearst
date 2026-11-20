// River logic (HP-RIVER-001 · Rev A) → motion film, ~56 s: a captioned camera tour of the logic sheet.
// Pure function of time. build-river-scene.mjs embeds ../river-drawing-sheet-1.jpg.
const { seg, lerp, eo, eio, clamp01 } = kit;
const NS = 'http://www.w3.org/2000/svg';
const SHEET = __SHEET__;

/* The sheet image is 1936 × 1233 px; the SVG's 1700 × 1060 units start at its top-left at 1936/1700 px per unit. */
const IW = 1936, IH = 1233, U = 1936 / 1700;
const STAGE = { x: 120, y: 170, w: 1680, h: 860 };

/* Beats: [start, caption title, caption line, region in sheet units [x, y, w, h]]. */
const BEATS = [
  [0, 'RIVER LOGIC', 'How the Hearst+ river and its trending modules choose stories, on one sheet.', [0, 0, 1700, 1060]],
  [5, 'PIPELINE', 'Once a day the server imports and validates the feed. Every visit, the browser runs seven steps.', [460, 60, 1120, 240]],
  [12, 'POOL', 'Three sources merge: the first 20 per group, up to 10 per brand, and the video feed.', [460, 300, 1000, 230]],
  [18, 'SCORE', 'Each story scores for the reader: popularity, recency, interests, time of day, visit history.', [40, 400, 440, 400]],
  [25, 'VARIETY', 'Sorted by score, then never three in a row from the same brand or topic.', [1080, 450, 520, 250]],
  [31, 'CADENCE', 'Videos and current stories interleave: five editorial, then one in every few.', [460, 470, 640, 160]],
  [37, 'MODULES', 'Today\'s Picks, Your Daily Habit and Trending take theirs first. Each story is used once.', [460, 620, 520, 360]],
  [44, 'GROW', 'Sixteen cards, then four more near the end. The order shown never changes during a visit.', [1080, 680, 500, 380]],
  [50, 'THE DRAWING', 'HP-RIVER-001 · today\'s selection is in the River logic chapter on /specs/.', [0, 0, 1700, 1060]],
];
const END = 56;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = v => (+v).toFixed(1);

function camFor(region) {
  const [x, y, w, h] = region;
  const z = Math.min(STAGE.w / (w * U), STAGE.h / (h * U));
  return { cx: (x + w / 2) * U, cy: (y + h / 2) * U, z };
}

kit.scene('river', {
  init(kit) {
    kit.css('.kr{position:absolute;inset:0;background:#fff}.kr svg text{font-family:Arimo,Helvetica,Arial,sans-serif}' +
      '.kr .kcap{font-size:16px;letter-spacing:.14em;fill:#111;text-transform:uppercase}.kr .ksub{font-size:24px;fill:#333}');
    const root = kit.h('<div class="kr"></div>'); kit.stage.append(root);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.setAttribute('width', '1920'); svg.setAttribute('height', '1080'); root.appendChild(svg);
    svg.innerHTML = `<defs><clipPath id="krclip"><rect x="0" y="150" width="1920" height="930"/></clipPath></defs>` +
      `<g clip-path="url(#krclip)"><g id="krcam"><image href="${SHEET}" x="0" y="0" width="${IW}" height="${IH}"/></g></g><g id="krhead"></g>`;
    this.cam = svg.querySelector('#krcam'); this.head = svg.querySelector('#krhead');
    ['400 12px Arimo'].forEach(f => document.fonts.load(f));
  },
  render(t) {
    // camera: ease from the previous beat's region to this one over the first 1.6 s of each beat
    let i = 0; for (let k = 0; k < BEATS.length; k++) if (t >= BEATS[k][0]) i = k;
    const cur = camFor(BEATS[i][3]), prev = camFor(BEATS[Math.max(0, i - 1)][3]);
    const p = i === 0 ? 1 : eio(seg(t, BEATS[i][0], BEATS[i][0] + 1.6));
    const z = Math.exp(lerp(Math.log(prev.z), Math.log(cur.z), p));
    const cx = lerp(prev.cx, cur.cx, p), cy = lerp(prev.cy, cur.cy, p);
    // slow push within the beat so the frame is never still
    const next = BEATS[i + 1] ? BEATS[i + 1][0] : END;
    const zz = z * lerp(1, 1.025, seg(t, BEATS[i][0] + 1.6, next));
    const sx = STAGE.x + STAGE.w / 2, sy = STAGE.y + STAGE.h / 2;
    this.cam.setAttribute('transform', `translate(${f1(sx - cx * zz)} ${f1(sy - cy * zz)}) scale(${zz.toFixed(4)})`);
    const fadeIn = eo(seg(t, BEATS[i][0], BEATS[i][0] + .45)), fadeOut = 1 - eo(seg(t, END - .6, END));
    const a = clamp01(Math.min(fadeIn, fadeOut));
    this.head.innerHTML = `<g opacity="${a.toFixed(3)}"><text x="120" y="92" class="kcap">${esc(BEATS[i][1])}</text><text x="120" y="128" class="ksub">${esc(BEATS[i][2])}</text></g>` +
      `<text x="1800" y="92" class="kcap" text-anchor="end">HP-RIVER-001 · RIVER LOGIC</text>`;
    this.cam.parentNode.setAttribute('opacity', (fadeOut * eo(seg(t, 0, .5))).toFixed(3));
  },
});
