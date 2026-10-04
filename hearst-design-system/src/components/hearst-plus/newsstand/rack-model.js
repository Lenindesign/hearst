// Procedural vintage newsstand rack (three.js). Named meshes/materials.
// Generated from "Magazine Rack.html" — same model, named meshes/materials.
// Titles with real cover photography in /images/newsstand/covers/<slug>.webp. Others get a logo cover.
export const COVER_SLUGS = new Set([
  'car_and_driver', 'cosmopolitan', 'country_living', 'elle', 'elle_decor', 'esquire', 'good_housekeeping', 'harpers_bazaar',
  'house_beautiful', 'mens_health', 'pioneer_woman', 'popular_mechanics', 'runners_world', 'town_and_country', 'veranda',
  'womans_day', 'womens_health',
]);

// Returns as soon as the geometry is built. Cover art streams in afterwards, so the rack never waits on images.
// skipSlots: magazine slots whose cover the caller replaces (featured titles), so their art is not fetched twice.
export async function buildRack(THREE, { skipSlots = new Set() } = {}) {
const rack = new THREE.Group(); rack.name = 'magazine_rack';
const M = (name, color, roughness, metalness = 0) =>
  Object.assign(new THREE.MeshStandardMaterial({ color, roughness, metalness }), { name });
const mat = {
  walnut:  M('walnut', 0x5b3a22, 0.55),
  brass:   M('brass', 0xd2ab55, 0.32, 0.35),
  enamel:  M('enamel_blue', 0x0099cc, 0.28),
  paper:   M('paper', 0xf6f4ee, 0.85),
  black:   M('ink_black', 0x111111, 0.6),
  blue:    M('ink_blue', 0x0099cc, 0.55),
  magenta: M('ink_magenta', 0xe1208d, 0.55),
  yellow:  M('ink_yellow', 0xffc42f, 0.55),
};
const css = { paper: '#f6f4ee', black: '#111111', blue: '#0099cc', magenta: '#e1208d', yellow: '#ffc42f' };
await document.fonts.load('700 80px "Helvetica Neue"');
// Official title logos (uploads/). Strip C2PA metadata, recolour the --primary fill, rasterise.
const logoSrc = new Map();
const logoImg = async (file, color) => {
  if (!logoSrc.has(file)) logoSrc.set(file, fetch('/images/newsstand/logos/' + file).then(r => r.text()));
  let s = (await logoSrc.get(file)).replace(/var\(--primary,\s*[^)]*\)/g, color);
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
  const w = 1600, h = Math.round(w * vb[3] / vb[2]);
  s = s.replace(/<svg\b/, `<svg width="${w}" height="${h}"`);
  if (!/<svg[^>]*style=/.test(s)) s = s.replace(/<svg\b/, `<svg style="fill:${color}"`);
  const img = new Image(); img.src = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
  await img.decode(); return img;
};
const hMark = new Image(); hMark.src = '/images/newsstand/hearst-h-white.png'; await hMark.decode();
const canvasTex = (w, h, draw) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const fitText = (ctx, text, font, maxW, maxH, cx, cy, spacing = 0) => {
  ctx.letterSpacing = spacing + 'px';
  let size = maxH; ctx.font = font(size);
  const w = ctx.measureText(text).width; if (w > maxW) { size *= maxW / w; ctx.font = font(size); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx, cy);
};
const add = (parent, name, geo, m, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x, y, z); parent.add(o); return o;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// ---- dimensions (m) ----
const W = 1.0, T = 0.025, WI = W - 2 * T;
const zFront = y => 0.30 - (y - 0.12) * 0.2568;      // slanted front line of the side frames
const ZB = -0.24;                                     // back line
const TOP = 1.60;

// ---- side frames: slanted profile with a cut-out window ----
const side = new THREE.Shape();
side.moveTo(ZB, 0.10);
side.lineTo(zFront(0.10), 0.10);
side.lineTo(zFront(TOP - 0.04), TOP - 0.04);
side.quadraticCurveTo(zFront(TOP - 0.04) - 0.005, TOP, zFront(TOP) - 0.05, TOP);
side.lineTo(ZB + 0.03, TOP);
side.quadraticCurveTo(ZB, TOP, ZB, TOP - 0.03);
side.lineTo(ZB, 0.10);
const hole = new THREE.Path();
const hy0 = 0.26, hy1 = 1.46, hb = ZB + 0.065, r = 0.04;
hole.moveTo(hb, hy0 + r);
hole.quadraticCurveTo(hb, hy0, hb + r, hy0);
hole.lineTo(zFront(hy0) - 0.065 - r, hy0);
hole.quadraticCurveTo(zFront(hy0) - 0.065, hy0, zFront(hy0 + r) - 0.065, hy0 + r);
hole.lineTo(zFront(hy1 - r) - 0.065, hy1 - r);
hole.quadraticCurveTo(zFront(hy1) - 0.065, hy1, zFront(hy1) - 0.065 - r, hy1);
hole.lineTo(hb + r, hy1);
hole.quadraticCurveTo(hb, hy1, hb, hy1 - r);
hole.lineTo(hb, hy0 + r);
side.holes.push(hole);
const sideGeo = new THREE.ExtrudeGeometry(side, { depth: T - 0.006, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 16 });
for (const [n, x] of [['side_right', W / 2 - 0.003], ['side_left', -W / 2 + T - 0.003]]) {
  add(rack, n, sideGeo, mat.walnut, x).rotation.y = -Math.PI / 2;
}

// ---- legs with brass ferrules ----
const legGeo = new THREE.CylinderGeometry(0.022, 0.016, 0.085, 32);
const ferGeo = new THREE.CylinderGeometry(0.0175, 0.0175, 0.018, 32);
[[1, 0.25], [1, -0.20], [-1, 0.25], [-1, -0.20]].forEach(([sx, z], i) => {
  const x = sx * (W / 2 - T / 2);
  add(rack, `leg_${i + 1}`, legGeo, mat.walnut, x, 0.018 + 0.0425 + 0.001, z);
  add(rack, `leg_${i + 1}_ferrule`, ferGeo, mat.brass, x, 0.009, z);
});

// ---- carcass: bottom shelf, kick rail, back board ----
const shelfD = zFront(0.10) - 0.01 - (ZB + 0.005);
add(rack, 'bottom_shelf', box(WI, 0.025, shelfD), mat.walnut, 0, 0.1125, (zFront(0.10) - 0.01 + ZB + 0.005) / 2);
add(rack, 'kick_rail', box(WI, 0.07, 0.02), mat.walnut, 0, 0.16, zFront(0.16) - 0.02);
add(rack, 'kick_rail_trim', new THREE.CylinderGeometry(0.004, 0.004, WI, 24), mat.brass, 0, 0.19, zFront(0.19) - 0.008).rotation.z = Math.PI / 2;
add(rack, 'back_board', box(WI, TOP - 0.13, 0.012), mat.walnut, 0, 0.125 + (TOP - 0.13) / 2, ZB + 0.008);

// ---- header sign ----
const sign = new THREE.Group(); sign.name = 'header_sign'; rack.add(sign);
const sz = (ZB + zFront(TOP) - 0.05) / 2;
sign.position.set(0, TOP + 0.11, sz + 0.01);
add(sign, 'sign_frame', box(W + 0.02, 0.22, 0.045), mat.walnut);
add(sign, 'sign_enamel', box(W - 0.05, 0.16, 0.006), mat.enamel, 0, 0, 0.0255);
const signTex = canvasTex(1900, 320, ctx => {
  ctx.fillStyle = css.blue; ctx.fillRect(0, 0, 1900, 320);
  ctx.strokeStyle = css.paper; ctx.lineWidth = 8; ctx.strokeRect(40, 40, 1820, 240);
  const hh = 170, hw = hh * (hMark.width / hMark.height);
  for (const x of [190, 1710]) ctx.drawImage(hMark, x - hw / 2, 160 - hh / 2, hw, hh);
  ctx.fillStyle = css.paper;
  fitText(ctx, 'HEARST MAGAZINES', s => `700 ${s}px "Helvetica Neue", Arial, sans-serif`, 1200, 96, 950, 165, 22);
});
const signFace = Object.assign(new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.28 }), { name: 'sign_face' });
add(sign, 'sign_face', new THREE.PlaneGeometry(W - 0.05, 0.16), signFace, 0, 0, 0.0286);
const capGeo = new THREE.SphereGeometry(0.022, 32, 16);
add(sign, 'finial_left', capGeo, mat.brass, -W / 2 - 0.002, 0.13, 0);
add(sign, 'finial_right', capGeo, mat.brass, W / 2 + 0.002, 0.13, 0);
const rivGeo = new THREE.SphereGeometry(0.006, 16, 8);
[[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([a, b], i) =>
  add(sign, `sign_rivet_${i + 1}`, rivGeo, mat.brass, a * (W / 2 - 0.045), b * 0.06, 0.0285));

// ---- covers: foundational colour + one process-ink accent each ----
const palettes = [
  ['paper', 'black', 'magenta'], ['blue', 'paper', 'black'], ['black', 'paper', 'yellow'],
  ['paper', 'blue', 'black'], ['yellow', 'black', 'paper'], ['paper', 'magenta', 'black'],
  ['magenta', 'paper', 'black'], ['paper', 'black', 'blue'],
];
const MW = 0.21, MH = 0.275;
const titles = [   // first 16 fill the rack; the rest go to the shelf stacks
  ['logo.20861e6.svg', 'esquire'], ['cosmo.svg', 'cosmopolitan'], ['harpers.svg', 'harpers_bazaar'], ['logo.2856426.svg', 'elle'],
  ['good-housekeeping.svg', 'good_housekeeping'], ['town.svg', 'town_and_country'], ['mens.svg', 'mens_health'], ['womenshealth.svg', 'womens_health'],
  ['caranddriver.svg', 'car_and_driver'], ['popular.svg', 'popular_mechanics'], ['runners.svg', 'runners_world'], ['house.svg', 'house_beautiful'],
  ['elle-decor.svg', 'elle_decor'], ['veranda.svg', 'veranda'], ['country.svg', 'country_living'], ['delish.svg', 'delish'],
  ['oprah.svg', 'oprah_daily'], ['prevention.svg', 'prevention'], ['redbook.svg', 'redbook'], ['roadandtrack.svg', 'road_and_track'],
  ['seventeen.svg', 'seventeen'], ['womans.svg', 'womans_day'], ['pioneer.svg', 'pioneer_woman'], ['logo.063cc2c.svg', 'bicycling'],
  ['autoweek.svg', 'autoweek'], ['bestproducts.svg', 'best_products'], ['biography.svg', 'biography'],
];
// Delish is digital-only (no print cover), so Woman's Day takes its rack slot.
// place the five featured brands across the rack: t4s2, t3s3, t2s1, t2s4, t1s2
for (const [a, b] of [[1, 8], [4, 2], [7, 2], [10, 8], [13, 0], [15, 21]]) [titles[a], titles[b]] = [titles[b], titles[a]];
const coverCache = new Map();
function coverMaterial(t, pal, layout, skip) {
  const key = `${t}|${pal}|${layout}|${skip}`;
  if (coverCache.has(key)) return coverCache.get(key);
  const [file, slug] = titles[t];
  const [bg, mast, img] = pal.map(k => css[k]);
  let cctx;
  const tex = canvasTex(420, 550, ctx => {
    cctx = ctx;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 420, 550);
    ctx.fillStyle = img;
    if (layout === 0) ctx.fillRect(40, 185, 340, 320);
    else if (layout === 1) ctx.fillRect(0, 140, 420, 410);
    else { ctx.beginPath(); ctx.arc(234, 335, 136, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = layout === 1 ? bg : mast;
    const ly = layout === 1 ? 335 : 195;
    for (let k = 0; k < 3; k++) ctx.fillRect(30, ly + k * 32 - 7, k === 0 ? 120 : 90, 14);
  });
  // Real cover photo when available; otherwise the logo cover. Not awaited: textures update when art arrives.
  const photoSrc = !skip && COVER_SLUGS.has(slug) ? '/images/newsstand/covers/' + slug + '.webp' : null;
  if (!skip) new Promise(res => { if (!photoSrc) return res(null); const p = new Image(); p.decoding = 'async'; p.onload = () => res(p); p.onerror = () => res(null); p.src = photoSrc; }).then(photo => {
    if (photo) { cctx.drawImage(photo, 0, 0, 420, 550); tex.needsUpdate = true; return; }
    return logoImg(file, mast).then(im => {
    const maxW = layout === 0 ? 340 : 380, maxH = 92, cy = layout === 1 ? 70 : 76;
    const s = Math.min(maxW / im.width, maxH / im.height), w = im.width * s, h = im.height * s;
    cctx.drawImage(im, 210 - w / 2, cy - h / 2, w, h);
    tex.needsUpdate = true;
  });
  }).catch(e => console.warn('cover failed', file, e));
  const m = Object.assign(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 }), { name: `cover_${slug}_${coverCache.size + 1}` });
  coverCache.set(key, m); return m;
}
function magazine(name, pal, layout, thick, t) {
  const g = new THREE.Group(); g.name = name; g.userData.slug = titles[t][1];
  add(g, `${name}_pages`, box(MW, MH, thick), mat.paper, 0, 0, -thick / 2);
  add(g, `${name}_cover`, new THREE.PlaneGeometry(MW, MH), coverMaterial(t, pal, layout, skipSlots.has(name)), 0, 0, 0.0004);
  return g;
}

// ---- four stepped tiers, four face-out slots each ----
const lean = THREE.MathUtils.degToRad(15);
const up = new THREE.Vector3(0, Math.cos(lean), -Math.sin(lean));
const nrm = new THREE.Vector3(0, Math.sin(lean), Math.cos(lean));
const slotX = [-1.5, -0.5, 0.5, 1.5].map(k => k * 0.232);
let n = 0;
for (let i = 0; i < 4; i++) {
  const y = 0.40 + i * 0.30, zf = zFront(y) - 0.005;
  const tier = new THREE.Group(); tier.name = `tier_${i + 1}`; rack.add(tier);
  add(tier, `tier_${i + 1}_ledge`, box(WI, 0.025, 0.075), mat.walnut, 0, y, zf - 0.0375);
  const rail = add(tier, `tier_${i + 1}_rail`, new THREE.CylinderGeometry(0.0055, 0.0055, WI, 24), mat.brass, 0, y + 0.055, zf - 0.006);
  rail.rotation.z = Math.PI / 2;
  const postGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.045, 16);
  for (const px of [-WI / 2 + 0.06, 0, WI / 2 - 0.06])
    add(tier, `tier_${i + 1}_rail_post`, postGeo, mat.brass, px, y + 0.0325, zf - 0.006);
  const pb = new THREE.Vector3(0, y + 0.0125, zf - 0.07);
  const panel = add(tier, `tier_${i + 1}_backrest`, box(WI, 0.30, 0.012), mat.walnut);
  panel.position.copy(pb.clone().addScaledVector(up, 0.15).addScaledVector(nrm, -0.006));
  panel.rotation.x = -lean;
  slotX.forEach((x, s) => {
    const thick = 0.006 + ((i * 7 + s * 3) % 4) * 0.004;
    const m = magazine(`magazine_t${i + 1}_s${s + 1}`, palettes[(n * 3 + i) % palettes.length], (n + i) % 3, thick, n);
    m.position.copy(pb.clone().addScaledVector(up, MH / 2 + 0.001).addScaledVector(nrm, thick + 0.0015));
    m.position.x = x;
    m.rotation.x = -lean;
    tier.add(m); n++;
  });
}

// ---- flat stacks on the bottom shelf ----
for (const [p, sx] of [[0, -0.22], [1, 0.2]]) {
  const stack = new THREE.Group(); stack.name = `shelf_stack_${p + 1}`; rack.add(stack);
  for (let k = 0; k < 7; k++) {
    const th = 0.008;
    const m = magazine(`shelf_stack_${p + 1}_copy_${k + 1}`, palettes[(k + p * 4) % palettes.length], (k + p) % 3, th, k + p * 7 < 11 ? 16 + k + p * 7 : (k + p * 7 - 11) * 3);
    m.rotation.set(-Math.PI / 2, 0, ((k * 37 + p * 11) % 9 - 4) * 0.012);
    m.position.set(sx + ((k * 5) % 3 - 1) * 0.004, 0.125 + (k + 1) * (th + 0.0012), 0.03);
    stack.add(m);
  }
}

return rack;
}
