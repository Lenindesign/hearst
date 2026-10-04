import { buildRack } from './rack-model.js';
import * as THREE from 'three';
const V = THREE.Vector3;
const clamp01 = x => Math.max(0, Math.min(1, x));
const MW = 0.21, MH = 0.275;   // magazine size, matching rack-model.js
const ss = x => x * x * (3 - 2 * x);
const easeOut = x => 1 - Math.pow(1 - x, 3);
const C = { paper: '#f6f4ee', black: '#111111', blue: '#0099cc', magenta: '#e1208d', yellow: '#ffc42f', grey: '#5d6770', greyL: '#a7a8a9', white: '#ffffff' };

// Featured brands, in scroll order. The designed stand-in cover is used only if the photo fails to load.
const FEATURED = [
  { slot: 'magazine_t4_s2', slug: 'esquire', logo: 'logo.20861e6.svg', bg: C.black, ink: C.paper, dot: '#3a3a3a', accent: C.yellow,
    kicker: 'THE STYLE ISSUE', head: ['How to', 'Dress Now'], lines: ['The 50 best-dressed men', 'Fall\u2019s new essentials'],
    contents: ['The new rules of tailoring', 'A long lunch with a legend', 'Fall\u2019s best watches', 'Books worth your weekend'], feature: ['The Quiet', 'Return of', 'the Suit'] },
  { slot: 'magazine_t3_s3', slug: 'cosmopolitan', logo: 'cosmo.svg', bg: C.magenta, ink: C.white, dot: '#b8136f', accent: C.white,
    kicker: 'THE LOVE ISSUE', head: ['Date', 'Smarter'], lines: ['Beauty buys we swear by', 'Money moves for your 20s'],
    contents: ['Love, rewritten', 'The 10-minute glow-up', 'Ask for the raise', 'Your horoscope'], feature: ['Love,', 'Rewritten'] },
  { slot: 'magazine_t2_s1', slug: 'harpers_bazaar', logo: 'harpers.svg', bg: C.paper, ink: C.black, dot: '#cfcfcc', accent: C.black,
    kicker: 'FALL FASHION', head: ['The New', 'Elegance'], lines: ['Paris, Milan, New York', 'Art\u2019s next generation'],
    contents: ['The collections', 'In the studio', 'Beauty\u2019s new minimalism', 'Where to travel now'], feature: ['The New', 'Elegance'] },
  { slot: 'magazine_t2_s4', slug: 'good_housekeeping', logo: 'good-housekeeping.svg', bg: C.blue, ink: C.white, dot: '#0a7fa8', accent: C.yellow,
    kicker: 'TESTED & TRUSTED', head: ['Easy Fall', 'Dinners'], lines: ['Lab-tested cookware', 'A calmer, cleaner home'],
    contents: ['30-minute suppers', 'Institute-tested picks', 'Declutter in a weekend', 'Health, simplified'], feature: ['Dinner,', 'Done'] },
  { slot: 'magazine_t1_s2', slug: 'car_and_driver', logo: 'caranddriver.svg', bg: C.paper, ink: C.black, dot: '#b3dbe9', accent: C.blue,
    kicker: 'ROAD TEST', head: ['Sport Sedan', 'Showdown'], lines: ['Comparison: 3 family SUVs', 'First drive: new EVs'],
    contents: ['Sport sedan showdown', 'Long-term test update', 'Buyer\u2019s guide: EVs', 'Track day diaries'], feature: ['Sport Sedan', 'Showdown'] },
];

const logoCache = new Map();
async function logoImg(file, color) {
  if (!logoCache.has(file)) logoCache.set(file, fetch('/images/newsstand/logos/' + file).then(r => r.text()));
  let s = (await logoCache.get(file)).replace(/var\(--primary,\s*[^)]*\)/g, color);
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
  s = s.replace(/<svg\b/, `<svg width="1600" height="${Math.round(1600 * vb[3] / vb[2])}"`);
  if (!/<svg[^>]*style=/.test(s)) s = s.replace(/<svg\b/, `<svg style="fill:${color}"`);
  const img = new Image(); img.src = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
  await img.decode(); return img;
}
const tryImage = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

function tex(THREE, draw) {
  const c = document.createElement('canvas'); c.width = 840; c.height = 1100;
  const ctx = c.getContext('2d'); ctx.scale(2, 2); draw(ctx);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// Offset-print halftone "portrait": dot size follows a soft head-and-shoulders silhouette.
function halftone(ctx, x0, y0, w, h, color, cx, cy, s = 1) {
  ctx.fillStyle = color;
  const step = 8;
  for (let y = y0 + step / 2; y < y0 + h; y += step) for (let x = x0 + step / 2; x < x0 + w; x += step) {
    const head = 1 - Math.hypot((x - cx) / (62 * s), (y - cy) / (78 * s));
    const sh = 1 - Math.hypot((x - cx) / (150 * s), (y - (cy + 175 * s)) / (95 * s));
    const f = Math.max(0.12, Math.min(1, Math.max(head, sh) * 2.4));
    ctx.beginPath(); ctx.arc(x, y, 3.9 * f, 0, Math.PI * 2); ctx.fill();
  }
}
const font = (w, s) => `${w} ${s}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
function drawLogo(ctx, img, cx, cy, maxW, maxH) {
  const k = Math.min(maxW / img.width, maxH / img.height), w = img.width * k, h = img.height * k;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

// Returns a texture immediately (brand colour), then paints the cover photo, or the designed stand-in if it fails.
function featuredTextures(THREE, b) {
  let cctx;
  const cover = tex(THREE, ctx => { cctx = ctx; ctx.fillStyle = b.bg; ctx.fillRect(0, 0, 420, 550); });
  tryImage(`/images/newsstand/covers/${b.slug}@2x.webp`).then(async art => {
    if (art) cctx.drawImage(art, 0, 0, 420, 550);
    else drawStandIn(cctx, b, await logoImg(b.logo, b.ink));
    cover.needsUpdate = true;
  }).catch(e => console.warn('featured cover failed', b.slug, e));
  return { cover };
}

function drawStandIn(ctx, b, logo) {
  ctx.fillStyle = b.bg; ctx.fillRect(0, 0, 420, 550);
  halftone(ctx, 0, 120, 420, 430, b.dot, 270, 300);
  drawLogo(ctx, logo, 210, 66, 370, 86);
  ctx.fillStyle = b.ink; ctx.font = font(700, 11); ctx.textAlign = 'right'; ctx.letterSpacing = '2px';
  ctx.fillText('OCTOBER 2026', 400, 128);
  ctx.textAlign = 'left';
  ctx.fillStyle = b.accent; ctx.font = font(700, 13); ctx.fillText(b.kicker, 26, 360);
  ctx.fillStyle = b.ink; ctx.letterSpacing = '-1px'; ctx.font = font(700, 46);
  b.head.forEach((l, i) => ctx.fillText(l, 24, 408 + i * 46));
  ctx.letterSpacing = '0px'; ctx.font = font(700, 13);
  b.lines.forEach((l, i) => ctx.fillText(l, 26, 490 + i * 20));
  ctx.fillStyle = b.accent; ctx.fillRect(26, 172, 46, 4);
  ctx.fillStyle = b.ink; ctx.font = font(700, 12); ctx.fillText('PLUS', 26, 196);
  ctx.font = font(400, 12); ctx.fillText(b.contents[2], 26, 212);
}

export async function createRackScene(canvas, opts = {}) {
  const o = { reducedMotion: false, heroSpin: true, dim: true, tints: null, ...opts };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0xf4f4f5);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xcfc8bc, 1.5);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2.5, 4.5, 3.5);
  key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 2.2, bottom: -1, near: 0.5, far: 12 });
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
  const fill = new THREE.DirectionalLight(0xfff4e6, 0.7); fill.position.set(-3, 2, 2.5);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(-1, 3, -3);
  const spot = new THREE.SpotLight(0xffffff, 0, 4, 0.36, 0.7, 1.5);
  scene.add(hemi, key, fill, rim, spot, spot.target);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const rack = await buildRack(THREE, { skipSlots: new Set(FEATURED.map(b => b.slot)) });
  const lean = THREE.MathUtils.degToRad(15);
  const nrm = new V(0, Math.sin(lean), Math.cos(lean));

  // Featured magazines wear full-resolution cover photography (covers/<slug>@2x.webp, from hearst.com brand pages).
  const featTex = FEATURED.map(b => featuredTextures(THREE, b));
  const mags = FEATURED.map((b, i) => {
    const g = rack.getObjectByName(b.slot);
    const cover = g.getObjectByName(`${b.slot}_cover`);
    cover.material = Object.assign(new THREE.MeshStandardMaterial({ map: featTex[i].cover, roughness: 0.38 }), { name: `cover_${b.slug}_featured` });
    return { g, world: null };
  });

  rack.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  scene.add(rack);
  rack.updateMatrixWorld(true);
  mags.forEach(m => { m.world = m.g.getWorldPosition(new V()); });

  const all = [];
  rack.traverse(g => {
    if (/^magazine_t\d_s\d$/.test(g.name) || /^shelf_stack_\d_copy_\d+$/.test(g.name))
      all.push({ g, pos: g.position.clone(), rot: g.rotation.clone(), tier: g.name.startsWith('magazine_'), feat: mags.findIndex(m => m.g === g),
        stack: g.name.startsWith('shelf_stack_') ? Number(g.name[12]) - 1 : -1, pick: 0, hov: 0, sp: 0 });
  });
  all.sort((a, b) => b.pos.y - a.pos.y || a.pos.x - b.pos.x);

  // Bottom-shelf stacks fan out on click: each copy stands up, face-out and overlapping, across the shelf.
  const stacks = [0, 1].map(p => all.filter(m => m.stack === p).sort((a, b) => a.pos.y - b.pos.y));
  stacks.forEach(list => list.forEach((m, i) => {
    // Side by side with no overlap, so every masthead reads in full. Both piles share one scale.
    const n = list.length, slot = 0.88 / 6;
    m.sscale = (slot - 0.012) / MW;
    m.spos = new V((i - (n - 1) / 2) * slot, 0.125 + (MH * m.sscale) / 2 + 0.012, 0.34);   // in front of the frame, clear of the tier ledge
    m.srot = new THREE.Euler(-0.2, 0, 0);
  }));
  const entryOf = new Map(all.map(m => [m.g, m]));
  let spread = -1;

  let poses = [], wide;
  const P = (tgt, off, k = 1) => ({ tgt, pos: tgt.clone().addScaledVector(off, k) });
  function buildPoses() {
    const a = camera.aspect, mob = a < 0.8;
    const k = mob ? Math.max(1, 0.62 / a) : Math.max(1, 1.1 / a);
    const hero = mob ? P(new V(0, 1.6, 0), new V(0.9, -0.1, 5.4), k) : P(new V(-0.7, 0.95, 0), new V(2.0, 0.3, 4.2), k);
    wide = mob ? P(new V(0, 1.0, 0), new V(0.8, 0.3, 3.8), k) : P(new V(0, 0.92, 0), new V(1.2, 0.38, 4.0), k);
    const brands = mags.map((m, i) => {
      const side = i % 2 ? -1 : 1;                       // alternate: magazine left / panel right, then swap
      const tgt = m.world.clone().add(mob ? new V(0, -0.13, 0) : new V(0.15 * side, 0, 0));
      const d = mob ? 1.1 * Math.max(1, 0.5 / a) : 0.78 * k;
      return { tgt, pos: tgt.clone().addScaledVector(nrm, d).add(new V(mob ? 0.08 : -0.3 * side, 0.03, 0)) };
    });
    const outro = mob ? P(new V(0, 2.0, 0), new V(0, -0.5, 6.2), k) : P(new V(0, 1.95, 0), new V(0, -0.6, 6.4), k);
    poses = [hero, ...brands, outro];
  }

  const tp = new V(), tt = new V();
  const mix = (A, B, e) => { tp.lerpVectors(A.pos, B.pos, e); tt.lerpVectors(A.tgt, B.tgt, e); };
  function pose(p) {
    const last = poses.length - 1;
    p = Math.max(0, Math.min(last, p));
    const k = Math.min(Math.floor(p), last - 1), u = clamp01((p - k - 0.15) / 0.7);
    const A = poses[k], B = poses[k + 1];
    if (k >= 1 && k + 1 <= mags.length) { if (u < 0.5) mix(A, wide, ss(u * 2)); else mix(wide, B, ss(u * 2 - 1)); }
    else mix(A, B, ss(u));
    camera.position.copy(tp); camera.lookAt(tt);
  }

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    buildPoses();
  }
  resize();

  // cursor tilt
  const ptr = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  const onPtr = e => { if (e.pointerType === 'touch') return; ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1; };
  addEventListener('pointermove', onPtr, { passive: true });

  // Cover picking: hover lifts a magazine, click toggles it in the reader's newsstand.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const covers = all.map(m => m.g.getObjectByName(`${m.g.name}_cover`)).filter(Boolean);
  const picked = new Set();
  let hovered = null, hoverStack = -1;
  // Returns the rack entry under the pointer. A closed stack acts as one target for the whole pile.
  const hit = e => {
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const g = ray.intersectObjects(covers, false)[0]?.object.parent;
    return g ? entryOf.get(g) ?? null : null;
  };
  const closedStack = m => m && m.stack >= 0 && m.stack !== spread;
  const onMove = e => {
    const m = e.pointerType === 'touch' ? null : hit(e);
    canvas.style.cursor = m ? 'pointer' : '';
    hoverStack = closedStack(m) ? m.stack : -1;
    hovered = m && hoverStack < 0 ? m.g.userData.slug : null;
    const hint = hoverStack >= 0 ? `Browse ${stacks[hoverStack].length} more titles` : undefined;
    o.onHover?.(hovered ?? (hint ? '' : null), e.clientX, e.clientY, hint);
  };
  const onLeave = () => { hovered = null; hoverStack = -1; canvas.style.cursor = ''; o.onHover?.(null, 0, 0); };
  const onClick = e => {
    const m = hit(e);
    if (!m) { spread = -1; return; }
    if (closedStack(m)) { spread = m.stack; onMove(e); return; }
    o.onPick?.(m.g.userData.slug);
  };
  canvas.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  let target = 0, cur = 0, raf, shuffleAt = -1e9;
  const bgA = new THREE.Color(), bgB = new THREE.Color(), bg = new THREE.Color(0xf4f4f5);
  const t0 = performance.now(), sp = new V();
  const dropAt = o.reducedMotion ? -1e9 : t0 + 250;
  // Fall height that starts every magazine above the top of the current framing (taller on phones).
  let dropH = 0;
  const dropHeight = () => {
    const p = new V();
    let h = 0.9;
    for (const m of all) {
      for (;;) {
        p.copy(m.pos); p.y += h - MH / 2; rack.localToWorld(p); p.project(camera);
        if (p.y > 1.1 || h > 12) break;
        h += 0.2;
      }
    }
    return h;
  };
  function frame(now) {
    cur = o.reducedMotion ? Math.round(target) : cur + (target - cur) * 0.1;
    if (Math.abs(target - cur) < 1e-4) cur = target;
    pose(cur);

    const w = mags.map((_, i) => ss(clamp01(1 - Math.abs(cur - (i + 1)) / 0.45)));
    let wmax = 0, wi = -1;
    w.forEach((x, i) => { if (x > wmax) { wmax = x; wi = i; } });

    const motion = !o.reducedMotion;
    tilt.x += ((motion ? ptr.x : 0) - tilt.x) * 0.06; tilt.y += ((motion ? ptr.y : 0) - tilt.y) * 0.06;
    const ts = 1 - 0.7 * wmax;
    const hw = clamp01(1 - cur);
    rack.rotation.y = (o.heroSpin && motion ? Math.sin((now - t0) / 1000 * 0.35) * 0.3 * hw : 0) + tilt.x * 0.09 * ts;
    rack.rotation.x = tilt.y * 0.025 * ts;
    if (!dropH) { camera.updateMatrixWorld(); rack.updateMatrixWorld(true); dropH = dropHeight(); }

    all.forEach((m, j) => {
      if (m.stack >= 0) {
        m.sp += ((spread === m.stack ? 1 : 0) - m.sp) * (motion ? 0.12 : 1);
        const k = ss(clamp01(m.sp));
        m.g.position.lerpVectors(m.pos, m.spos, k);
        m.g.rotation.set(m.rot.x + (m.srot.x - m.rot.x) * k, m.rot.y + (m.srot.y - m.rot.y) * k, m.rot.z + (m.srot.z - m.rot.z) * k);
        m.g.scale.setScalar(1 + (m.sscale - 1) * k);
        m.g.position.y += Math.sin(Math.PI * k) * 0.06;   // lift clear of the pile while dealing out
        if (hoverStack === m.stack) m.g.position.y += 0.006;
      } else { m.g.position.copy(m.pos); m.g.rotation.copy(m.rot); }
      // Drop-in: each magazine falls from above the top of the frame and stays hidden until its turn.
      const tDrop = now - dropAt - j * 45;
      m.g.visible = tDrop > 0;
      const e = clamp01(tDrop / (500 + 110 * dropH));
      if (e < 1) { m.g.position.y += (1 - easeOut(e)) * dropH; m.g.rotation.z += (1 - easeOut(e)) * 0.35 * (j % 2 ? 1 : -1); }
      const s = clamp01((now - shuffleAt - j * 30) / 900);
      if (s > 0 && s < 1) {
        m.g.position.y += Math.sin(Math.PI * s) * 0.09;
        if (m.tier) m.g.rotation.y += ss(s) * Math.PI * 2;
        else m.g.rotation.z += Math.sin(Math.PI * s) * 0.25;
      }
      if (m.feat >= 0) {
        const f = w[m.feat];
        m.g.position.addScaledVector(nrm, 0.055 * f);
        m.g.rotation.x += 0.06 * f;
      }
      const slug = m.g.userData.slug, ease = motion ? 0.18 : 1;
      m.pick += ((picked.has(slug) ? 1 : 0) - m.pick) * ease;
      m.hov += ((hovered === slug ? 1 : 0) - m.hov) * ease;
      const lift = 0.03 * m.pick + 0.012 * m.hov;
      if (m.tier || m.sp > 0.5) m.g.position.addScaledVector(nrm, lift);
      else m.g.position.y += lift * 0.6;
    });

    const dim = o.dim ? 1 - 0.38 * wmax : 1;
    hemi.intensity = 1.5 * dim; key.intensity = 2.4 * dim; fill.intensity = 0.7 * dim;
    if (wi >= 0) {
      const m = mags[wi];
      spot.position.copy(m.world).addScaledVector(nrm, 1.1).add(sp.set(0.3, 0.5, 0));
      spot.target.position.copy(m.world);
      spot.intensity = 3.8 * wmax;
    } else spot.intensity = 0;
    if (o.tints) {   // backdrop drifts to each brand's tint as you scroll
      const t = o.tints, last = t.length - 1, c = Math.max(0, Math.min(last, cur));
      const k = Math.min(Math.floor(c), last - 1), e = ss(clamp01((c - k - 0.2) / 0.6));
      bg.copy(bgA.set(t[k])).lerp(bgB.set(t[k + 1]), e);
      renderer.setClearColor(bg);
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    setProgress: p => { target = p; },
    setOptions: x => { Object.assign(o, x); if (!o.tints) renderer.setClearColor(0xf4f4f5); },
    shuffle: () => { if (!o.reducedMotion) shuffleAt = performance.now(); },
    setPicked: slugs => { picked.clear(); slugs.forEach(x => picked.add(x)); },
    resize,
    dispose: () => {
      cancelAnimationFrame(raf); removeEventListener('pointermove', onPtr);
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick);
      renderer.dispose();
    },
  };
}
