import { buildRack } from './rack-model.js';
import * as THREE from 'three';
const V = THREE.Vector3;
const clamp01 = x => Math.max(0, Math.min(1, x));
const MW = 0.21, MH = 0.275;   // magazine size, matching rack-model.js
const PULL_OUT = 0.1, PULL_UP = 0.025;   // how far a featured magazine slides out on its brand panel
const ss = x => x * x * (3 - 2 * x);
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
  [hemi, key, fill, rim, spot].forEach(l => l.layers.enableAll());
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
        stack: g.name.startsWith('shelf_stack_') ? Number(g.name[12]) - 1 : -1, hov: 0, sp: 0, landed: false });
  });
  all.sort((a, b) => b.pos.y - a.pos.y || a.pos.x - b.pos.x);

  // Bottom-shelf stacks fan out on click: each copy stands up, face-out and overlapping, across the shelf.
  const stacks = [0, 1].map(p => all.filter(m => m.stack === p).sort((a, b) => a.pos.y - b.pos.y));
  stacks.forEach(list => list.forEach((m, i) => {
    // Side by side with no overlap, so every masthead reads in full. Both piles share one scale.
    m.si = i;   // deal order: bottom of the pile goes out first
    const n = list.length, slot = 0.88 / 6;
    m.sscale = (slot - 0.012) / MW;
    m.spos = new V((i - (n - 1) / 2) * slot, 0.125 + (MH * m.sscale) / 2 + 0.012, 0.34);   // in front of the frame, clear of the tier ledge
    m.srot = new THREE.Euler(-0.2, 0, 0);
  }));
  const entryOf = new Map(all.map(m => [m.g, m]));
  let spread = -1, spreadAt = -1e9, lastSpread = -1, closeAt = -1e9;
  const setSpread = p => {
    if (p === spread) return;
    if (spread >= 0) { lastSpread = spread; closeAt = performance.now(); }
    spread = p; spreadAt = performance.now();
  };

  // Sign: starts unlit and flickers on once the rack is stocked.
  const signMat = rack.getObjectByName('sign_face').material;
  signMat.emissive = new THREE.Color(0xffffff); signMat.emissiveMap = signMat.map; signMat.emissiveIntensity = 0;

  // Hover sheen: one additive highlight band that sweeps across whichever cover is hovered.
  const sheenCanvas = document.createElement('canvas'); sheenCanvas.width = 768; sheenCanvas.height = 256;
  {
    const c = sheenCanvas.getContext('2d'), g = c.createLinearGradient(256, 0, 512, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(300, 0); c.lineTo(468, 0); c.lineTo(412, 256); c.lineTo(244, 256); c.closePath(); c.fill();
  }
  const sheenTex = new THREE.CanvasTexture(sheenCanvas);
  sheenTex.repeat.x = 1 / 3;   // window onto the strip: left third and right third are empty
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(MW, MH), new THREE.MeshBasicMaterial({
    map: sheenTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0.55,
  }));
  sheen.position.z = 0.0012; sheen.visible = false;
  let sheenAt = -1e9;

  // Focus pass: while a brand panel is up, the rest of the scene is rendered off-screen, blurred and darkened,
  // and the featured magazine (moved to layer 1) is drawn sharp on top.
  const bufSize = new THREE.Vector2();
  const rtOpts = { type: THREE.HalfFloatType, depthBuffer: true };
  const rtA = new THREE.WebGLRenderTarget(1, 1, rtOpts), rtB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
  const quadVert = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, dir: { value: new THREE.Vector2() } },
    vertexShader: quadVert,
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 dir; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(tDiffuse, vUv) * 0.227027;
        c += texture2D(tDiffuse, vUv + dir * 1.3846) * 0.3162162; c += texture2D(tDiffuse, vUv - dir * 1.3846) * 0.3162162;
        c += texture2D(tDiffuse, vUv + dir * 3.2308) * 0.0702703; c += texture2D(tDiffuse, vUv - dir * 3.2308) * 0.0702703;
        gl_FragColor = c;
      }`,
    depthTest: false, depthWrite: false, toneMapped: false,
  });
  // Composite: tone-map the scene the same way the direct render does, lay it over the page background,
  // then darken. Keeping the background out of tone mapping avoids a shade jump when focus starts.
  const compMat = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, dark: { value: 0 }, bg: { value: new THREE.Color(0xf4f4f5) } },
    vertexShader: quadVert,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float dark; uniform vec3 bg; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(tDiffuse, vUv);
        gl_FragColor = vec4(c.a > 0.0 ? c.rgb / c.a : vec3(0.0), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor = vec4(mix(bg, gl_FragColor.rgb, c.a) * (1.0 - dark), 1.0);
      }`,
    depthTest: false, depthWrite: false, toneMapped: true,
  });
  compMat.uniforms.bg.value.convertLinearToSRGB();   // compared against output-space colour
  const quadScene = new THREE.Scene(), quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat); quadScene.add(quad);
  let focusGroup = null;
  const setFocus = g => {
    if (g === focusGroup) return;
    focusGroup?.traverse(o => o.layers.set(0));
    g?.traverse(o => o.layers.set(1));
    focusGroup = g;
  };
  function renderFrame(focus) {
    if (focus < 0.003 || !focusGroup) { camera.layers.set(0); camera.layers.enable(1); renderer.render(scene, camera); return; }
    camera.layers.set(0);
    renderer.setClearColor(0xf4f4f5, 0);
    renderer.setRenderTarget(rtA); renderer.clear(); renderer.render(scene, camera);
    renderer.setClearColor(0xf4f4f5, 1);
    const radius = focus * 3.2 * renderer.getPixelRatio();
    quad.material = blurMat;
    for (let i = 0; i < 2; i++) {
      blurMat.uniforms.tDiffuse.value = rtA.texture; blurMat.uniforms.dir.value.set(radius / bufSize.x, 0);
      renderer.setRenderTarget(rtB); renderer.render(quadScene, quadCam);
      blurMat.uniforms.tDiffuse.value = rtB.texture; blurMat.uniforms.dir.value.set(0, radius / bufSize.y);
      renderer.setRenderTarget(rtA); renderer.render(quadScene, quadCam);
    }
    renderer.setRenderTarget(null);
    quad.material = compMat; compMat.uniforms.tDiffuse.value = rtA.texture; compMat.uniforms.dark.value = 0.5 * focus;
    renderer.render(quadScene, quadCam);
    renderer.autoClear = false; renderer.clearDepth();
    camera.layers.set(1); renderer.render(scene, camera);
    renderer.autoClear = true; camera.layers.set(0); camera.layers.enable(1);
  }

  // Desktop brand framing: choose the closest camera at which the pulled-out magazine is ~106% of the height
  // below the header (a slight, even crop top and bottom) without reaching the panel, centered vertically in that area and
  // horizontally in the free side of the screen.
  const fitCam = new THREE.PerspectiveCamera(), probe = new THREE.Object3D(), corner = new V(), ndcP = new V();
  function fitBrandPose(c, i, side) {
    fitCam.fov = camera.fov; fitCam.aspect = camera.aspect; fitCam.near = camera.near; fitCam.far = camera.far;
    fitCam.updateProjectionMatrix();
    probe.position.copy(c); probe.rotation.set(-lean + lean * 0.85, i % 2 ? 0.16 : -0.16, 0); probe.updateMatrixWorld(true);
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => probe.localToWorld(corner.set(x * MW / 2, y * MH / 2, 0)).clone());
    const avail = 1 - topInset / innerHeight;               // fraction of the viewport below the header
    const wantY = -topInset / innerHeight;                  // NDC y of the middle of that area
    const wantX = -0.42 * side;                             // NDC x: middle of the side the panel leaves free
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const place = d => {
      const tgt = c.clone(), pos = tgt.clone().addScaledVector(nrm, d).add(new V(-0.3 * side * d / 0.78, 0.03, 0));
      for (let it = 0; it < 3; it++) {                     // nudge until the magazine center lands where wanted
        fitCam.position.copy(pos); fitCam.lookAt(tgt); fitCam.updateMatrixWorld();
        ndcP.copy(c).project(fitCam);
        const dist = pos.distanceTo(c);
        const dx = (ndcP.x - wantX) * dist * tanH * camera.aspect, dy = (ndcP.y - wantY) * dist * tanH;
        tgt.x += dx; pos.x += dx; tgt.y += dy; pos.y += dy;
      }
      fitCam.position.copy(pos); fitCam.lookAt(tgt); fitCam.updateMatrixWorld();
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      corners.forEach(q => { ndcP.copy(q).project(fitCam); x0 = Math.min(x0, ndcP.x); x1 = Math.max(x1, ndcP.x); y0 = Math.min(y0, ndcP.y); y1 = Math.max(y1, ndcP.y); });
      return { pose: { tgt, pos }, h: (y1 - y0) / 2, w: (x1 - x0) / 2 };
    };
    let best = null;
    for (let d = 0.3; d <= 2.5; d += 0.01) {
      const r = place(d);
      best = r;
      if (r.h <= 1.06 * avail && r.w <= 0.44) break;
    }
    return best.pose;
  }

  let poses = [], wide;
  const P = (tgt, off, k = 1) => ({ tgt, pos: tgt.clone().addScaledVector(off, k) });
  function buildPoses() {
    const a = camera.aspect, mob = a < 0.8;
    const k = mob ? Math.max(1, 0.62 / a) : Math.max(1, 1.1 / a);
    const hero = mob ? P(new V(0, 1.6, 0), new V(0.9, -0.1, 5.4), k) : P(new V(-0.7, 0.95, 0), new V(2.0, 0.3, 4.2), k);
    wide = mob ? P(new V(0, 1.0, 0), new V(0.8, 0.3, 3.8), k) : P(new V(0, 0.92, 0), new V(1.2, 0.38, 4.0), k);
    const brands = mags.map((m, i) => {
      const side = i % 2 ? -1 : 1;                       // alternate: magazine left / panel right, then swap
      // Where the magazine sits once pulled out of its slot (not the empty slot).
      const c = m.world.clone().addScaledVector(nrm, PULL_OUT).add(new V(0, PULL_UP, 0));
      if (mob) {
        const tgt = c.clone().add(new V(0, -0.13, 0));
        const d = 1.1 * Math.max(1, 0.5 / a);
        const pose = { tgt, pos: tgt.clone().addScaledVector(nrm, d).add(new V(0.08, 0.03, 0)) };
        // Phones: the panel sits below, so drop the magazine a full header height clear of the sticky header.
        const fh = 2 * pose.pos.distanceTo(tgt) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const up = topInset / innerHeight * fh;
        pose.tgt.y += up; pose.pos.y += up;
        return pose;
      }
      return fitBrandPose(c, i, side);
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

  let topInset = 0;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // Only a pinned header covers the scene while scrolling; a header in normal flow scrolls away.
    const header = document.querySelector('header');
    const pinned = header && ['sticky', 'fixed'].includes(getComputedStyle(header).position);
    topInset = pinned ? header.getBoundingClientRect().height : 0;
    renderer.getDrawingBufferSize(bufSize);
    rtA.setSize(bufSize.x, bufSize.y); rtB.setSize(bufSize.x, bufSize.y);
    buildPoses();
  }
  resize();

  // cursor tilt
  const ptr = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  const onPtr = e => { if (e.pointerType === 'touch') return; ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1; };
  addEventListener('pointermove', onPtr, { passive: true });

  // Cover interaction: hover lifts and zooms a magazine; click opens its Hearst+ preview modal.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  ray.layers.enableAll();
  const covers = all.map(m => m.g.getObjectByName(`${m.g.name}_cover`)).filter(Boolean);
  let hovered = null, hoverStack = -1, hoverEntry = null, lastHoverAt = -1e9;
  const hitPoint = new V();   // world point under the cursor on the hovered cover
  // Returns the rack entry under the pointer. A closed stack acts as one target for the whole pile.
  const hit = e => {
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(covers, false)[0];
    if (h) hitPoint.copy(h.point);
    const g = h?.object.parent;
    return g ? entryOf.get(g) ?? null : null;
  };
  const closedStack = m => m && m.stack >= 0 && m.stack !== spread;
  const onMove = e => {
    const m = e.pointerType === 'touch' ? null : hit(e);
    canvas.style.cursor = m ? 'pointer' : '';
    hoverStack = closedStack(m) ? m.stack : -1;
    hovered = m && hoverStack < 0 ? m.g.userData.slug : null;
    const entry = hovered ? m : null;
    if (entry !== hoverEntry) {
      hoverEntry = entry;
      if (entry && !o.reducedMotion) { entry.g.add(sheen); sheenAt = performance.now(); }
    }
    const hint = hoverStack >= 0 ? `Browse ${stacks[hoverStack].length} more titles` : undefined;
    o.onHover?.(hovered ?? (hint ? '' : null), e.clientX, e.clientY, hint);
  };
  const onLeave = () => { hovered = null; hoverStack = -1; hoverEntry = null; canvas.style.cursor = ''; o.onHover?.(null, 0, 0); };
  const onClick = e => {
    const m = hit(e);
    if (!m) { setSpread(-1); return; }
    if (closedStack(m)) { setSpread(m.stack); onMove(e); return; }
    o.onPick?.(m.g.userData.slug);
  };
  canvas.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  let target = 0, cur = 0, raf, shuffleAt = -1e9, paused = false, lastRender = 0;
  let wob = 0, wobV = 0, stockedAt = Infinity;   // rack wobble spring, fed by each magazine landing
  let camZ = 0;                                   // roll-over camera zoom toward the hovered magazine
  let swayClock = 0, lastFrame = 0;               // sway time; paused while zoomed so covers hold under the cursor
  const zoomAt = new V(), zoomGoal = new V(), dolly = new V();
  const bgA = new THREE.Color(), bgB = new THREE.Color(), bg = new THREE.Color(0xf4f4f5);
  const t0 = performance.now(), sp = new V();
  // Intro: the empty rack makes one full turn while the canvas fades in. The magazines start dropping once the
  // spin begins to settle (~45% of its time, ~90% of the turn), so they land as the rack eases into place.
  const spinAt = t0 + 300, spinMs = 2000;
  const swayAt = spinAt + spinMs;
  const dropAt = o.reducedMotion ? -1e9 : spinAt + spinMs * 0.45;
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

    // Roll-over stand zoom: dolly the camera part of the way toward the hovered magazine. Moving along the ray
    // from the camera to that magazine keeps it under the cursor while the whole stand grows around it.
    // Zoom toward the exact point under the cursor so it stays put; hold briefly after leaving a cover so
    // crossing the gap between two covers doesn't pulse the zoom.
    if (hoverEntry) { lastHoverAt = now; zoomGoal.copy(hitPoint); }
    const wantZoom = motion && now - lastHoverAt < 400 && wmax < 0.5 ? 1 : 0;
    let zoomBusy = false;
    if (camZ < 1e-3) zoomAt.copy(zoomGoal); else zoomAt.lerp(zoomGoal, 0.12);   // glide between covers
    camZ += (wantZoom - camZ) * 0.08;
    if (camZ < 1e-4) camZ = 0;
    if (camZ > 0) {
      dolly.subVectors(zoomAt, camera.position).multiplyScalar(0.18 * ss(Math.min(1, camZ)) * (1 - wmax));
      camera.position.add(dolly); tt.add(dolly); camera.lookAt(tt);
      if (Math.abs(wantZoom - camZ) > 1e-3 || zoomAt.distanceToSquared(zoomGoal) > 1e-8) zoomBusy = true;
    }

    tilt.x += ((motion ? ptr.x : 0) - tilt.x) * 0.06; tilt.y += ((motion ? ptr.y : 0) - tilt.y) * 0.06;
    const ts = 1 - 0.7 * wmax;
    const hw = clamp01(1 - cur);
    // Ease-out (quartic): starts at full speed and settles into place.
    const spin = motion ? (1 - Math.pow(1 - clamp01((now - spinAt) / spinMs), 4)) * Math.PI * 2 : 0;
    if (now > swayAt) swayClock += Math.min(50, now - (lastFrame || now)) * (1 - Math.min(1, camZ * 1.5));
    lastFrame = now;
    const sway = o.heroSpin && motion ? Math.sin(swayClock / 1000 * 0.35) * 0.3 * hw : 0;
    rack.rotation.y = spin + sway + tilt.x * 0.09 * ts;
    wobV += -0.09 * wob - 0.14 * wobV; wob += wobV;
    rack.rotation.x = tilt.y * 0.025 * ts + wob;
    if (!dropH) {
      camera.updateMatrixWorld(); rack.updateMatrixWorld(true); dropH = dropHeight();
      stockedAt = dropAt + (all.length - 1) * 45 + 500 + 110 * dropH;
    }
    let busy = zoomBusy;   // anything still moving this frame? When not, skip the expensive render.

    all.forEach((m, j) => {
      if (m.stack >= 0) {
        // Deal out one at a time (bottom of the pile first); gather back in reverse order.
        const n = stacks[m.stack].length;
        const goal = spread === m.stack ? (now > spreadAt + m.si * 70 ? 1 : 0)
          : (lastSpread === m.stack && now < closeAt + (n - 1 - m.si) * 50 ? 1 : 0);
        m.sp += ((motion ? goal : spread === m.stack ? 1 : 0) - m.sp) * (motion ? 0.16 : 1);
        if (Math.abs((spread === m.stack ? 1 : 0) - m.sp) > 1e-3) busy = true;
        const k = ss(clamp01(m.sp));
        m.g.position.lerpVectors(m.pos, m.spos, k);
        m.g.rotation.set(m.rot.x + (m.srot.x - m.rot.x) * k, m.rot.y + (m.srot.y - m.rot.y) * k, m.rot.z + (m.srot.z - m.rot.z) * k);
        m.g.scale.setScalar(1 + (m.sscale - 1) * k);
        m.g.position.y += Math.sin(Math.PI * k) * 0.06;   // lift clear of the pile while dealing out
        if (hoverStack === m.stack) m.g.position.y += 0.006;
      } else { m.g.position.copy(m.pos); m.g.rotation.copy(m.rot); m.g.scale.setScalar(1); }
      // Drop-in: each magazine falls from above the top of the frame (hidden until its turn), accelerating like
      // paper under gravity, then bounces twice and settles. Each landing nudges the rack.
      const tDrop = now - dropAt - j * 45, total = 500 + 110 * dropH, fallMs = total * 0.7, dir = j % 2 ? 1 : -1;
      m.g.visible = tDrop > 0;
      if (tDrop < fallMs) {
        const f = clamp01(tDrop / fallMs);
        m.g.position.y += dropH * (1 - f * f); m.g.rotation.z += (1 - f) * 0.35 * dir;
        busy = true;
      } else if (tDrop < total) {
        if (!m.landed) { m.landed = true; wobV += m.tier ? 0.0022 : 0.0012; }
        const b = (tDrop - fallMs) / (total - fallMs);
        m.g.position.y += 0.03 * Math.abs(Math.sin(b * Math.PI * 2)) * (1 - b);
        m.g.rotation.z += 0.05 * Math.sin(b * Math.PI * 3) * (1 - b) * dir;
        busy = true;
      } else m.landed = true;
      const s = clamp01((now - shuffleAt - j * 30) / 900);
      if (s > 0 && s < 1) {
        busy = true;
        m.g.position.y += Math.sin(Math.PI * s) * 0.09;
        if (m.tier) m.g.rotation.y += ss(s) * Math.PI * 2;
        else m.g.rotation.z += Math.sin(Math.PI * s) * 0.25;
      }
      if (m.feat >= 0) {
        // On its brand panel the featured magazine slides out of the slot, stands up and turns to the camera.
        const f = w[m.feat];
        m.g.position.addScaledVector(nrm, PULL_OUT * f); m.g.position.y += PULL_UP * f;
        m.g.rotation.x += lean * 0.85 * f;
        m.g.rotation.y += (m.feat % 2 ? 0.16 : -0.16) * f;
      }
      const slug = m.g.userData.slug, ease = motion ? 0.18 : 1;
      m.hov += ((hovered === slug ? 1 : 0) - m.hov) * ease;
      if (Math.abs((hovered === slug ? 1 : 0) - m.hov) > 1e-3) busy = true;
      if (m.hov > 1e-3 && motion) { m.g.rotation.y += ptr.x * 0.12 * m.hov; m.g.rotation.x -= ptr.y * 0.06 * m.hov; }
      // Roll-over zoom: the hovered magazine grows ~1.4x and comes forward so it clears its neighbours.
      // Fades out on brand panels, where the featured magazine already fills the screen.
      const hz = ss(clamp01(m.hov)) * (1 - wmax);
      const lift = (0.012 + 0.07 * hz) * m.hov;
      if (m.tier || m.sp > 0.5) m.g.position.addScaledVector(nrm, lift);
      else m.g.position.y += lift * 0.6;
      if (hz > 1e-4) m.g.scale.multiplyScalar(1 + 0.4 * hz);
    });

    const dim = o.dim ? 1 - 0.12 * wmax : 1;
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
    // Sign: dim until stocked, then a quick flicker and on.
    const ts2 = motion ? now - stockedAt - 150 : Infinity;
    const lit = ts2 < 0 ? 0 : ts2 < 80 ? 1 : ts2 < 160 ? 0 : ts2 < 240 ? 1 : ts2 < 300 ? 0.2 : clamp01((ts2 - 300) / 250);
    signMat.color.setScalar(0.5 + 0.5 * lit); signMat.emissiveIntensity = 0.32 * lit;
    if (ts2 > -200 && ts2 < 600) busy = true;

    const sh = (now - sheenAt) / 700;
    sheen.visible = !!hoverEntry && sh < 1;
    if (sheen.visible) { sheenTex.offset.x = ss(clamp01(sh)) * (2 / 3); busy = true; }

    if (now < swayAt || Math.abs(target - cur) > 1e-4 || Math.abs(wob) + Math.abs(wobV) > 1e-5) busy = true;
    if (motion && hw > 1e-3) busy = true;   // hero sway is continuous
    if (Math.abs(ptr.x - tilt.x) + Math.abs(ptr.y - tilt.y) > 1e-3) busy = true;
    // Render when something moves, plus a slow heartbeat so late-arriving cover art still appears.
    setFocus(wi >= 0 && wmax > 0.003 ? mags[wi].g : null);
    if (busy || now - lastRender > 250) { renderFrame(wmax); lastRender = now; }
    raf = paused ? 0 : requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  const onVisibility = () => { if (!document.hidden && !paused && !raf) raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setProgress: p => { target = p; },
    setOptions: x => { Object.assign(o, x); if (!o.tints) renderer.setClearColor(0xf4f4f5); },
    shuffle: () => { if (!o.reducedMotion) shuffleAt = performance.now(); },
    // Stop the render loop entirely, e.g. while a modal covers the page or the tab is hidden.
    setPaused: v => {
      if (v === paused) return;
      paused = v;
      if (!paused && !raf) raf = requestAnimationFrame(frame);
    },
    resize,
    dispose: () => {
      paused = true; cancelAnimationFrame(raf); removeEventListener('pointermove', onPtr);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick);
      rtA.dispose(); rtB.dispose(); blurMat.dispose(); compMat.dispose(); renderer.dispose();
    },
  };
}
