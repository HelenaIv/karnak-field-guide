// The temple as a model of the world: original schematic drawings and step-through text.
// Content lives in content/features/model-universe.json; drawings are drawn here, not copied.
function muFeature() { return (D.features || []).find(f => f.id === 'model-universe'); }

// Which drawing layers are visible at each step.
const MU_LAYERS = {
  creation: [
    ['dark', 'water-full', 'l-nun'],
    ['dark', 'water-full', 'atum-asleep', 'l-atum'],
    ['dark', 'water-low', 'mound', 'sun-up', 'l-mound'],
    ['dark', 'air', 'water-low', 'mound', 'sun-up', 'shu', 'tefnut', 'l-shu'],
    ['dark', 'air', 'water-low', 'geb', 'mound', 'sun-up', 'nut', 'l-geb']
  ],
  temple: [['hl-pylon'], ['hl-court'], ['hl-hall'], ['hl-sanctuary']]
};

function waves(y0, y1, cls) {
  let d = '';
  for (let y = y0; y <= y1; y += 18) {
    const o = (y / 18) % 2 ? 0 : 20;
    d += `M${-40 + o} ${y}` + Array.from({ length: 18 }, (_, i) => ` q 20 -7 40 0`).join('');
  }
  return `<path class="${cls}" d="${d}"/>`;
}

function creationSvg() {
  const stars = [[120, 70], [180, 48], [250, 38], [330, 34], [410, 38], [480, 48], [540, 70], [210, 80], [450, 80], [300, 62], [370, 60]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y + 22}" r="2.2"/>`).join('');
  return `<svg viewBox="0 0 640 360" role="img" aria-label="Schematic drawing of the Egyptian creation story in five steps: endless water, the creator asleep in it, the first mound rising with the sun on it, air and moisture, and finally earth below and the sky goddess arching above.">
  <defs>
    <linearGradient id="mu-air" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e6c4"/><stop offset="1" stop-color="#cfdcd2"/></linearGradient>
    <radialGradient id="mu-glow"><stop offset="0" stop-color="#f6d27a" stop-opacity=".9"/><stop offset="1" stop-color="#f6d27a" stop-opacity="0"/></radialGradient>
    <clipPath id="mu-frame"><rect width="640" height="360"/></clipPath>
  </defs>
  <g clip-path="url(#mu-frame)">
  <rect class="mu-l on" data-l="dark" width="640" height="360" fill="#1e3437"/>
  <rect class="mu-l" data-l="air" width="640" height="360" fill="url(#mu-air)"/>
  <g class="mu-l" data-l="water-full"><rect width="640" height="360" fill="#24444a"/>${waves(20, 350, 'mu-wave')}</g>
  <g class="mu-l" data-l="water-low"><rect y="268" width="640" height="92" fill="#2c5257"/>${waves(282, 350, 'mu-wave')}</g>
  <g class="mu-l" data-l="atum-asleep"><circle cx="320" cy="205" r="70" fill="url(#mu-glow)" opacity=".45"/><circle cx="320" cy="205" r="26" fill="#b58a4d" opacity=".55"/><path d="M308 205q6 5 12 0M322 205q6 5 12 0" stroke="#3a3420" stroke-width="2" fill="none" opacity=".7"/><text x="352" y="170" class="mu-z">z</text><text x="364" y="154" class="mu-z small">z</text></g>
  <g class="mu-l" data-l="geb"><path d="M0 286C120 270 200 280 320 276S520 268 640 284V360H0Z" fill="#6f7f4a"/><path d="M40 284v-14M46 284l6-12M90 280v-12M520 276v-14M526 276l7-11M590 282v-12" stroke="#4d5b32" stroke-width="2"/></g>
  <g class="mu-l" data-l="mound"><path d="M200 290C240 236 280 214 320 212S400 236 440 290Z" fill="#a98c5a" stroke="#7b6438" stroke-width="2"/><path d="M226 284c18 -4 30 -14 40 -26M410 284c-16 -5 -28 -14 -38 -28" stroke="#7b6438" stroke-width="1.5" fill="none"/><path d="M212 290v-22M218 290l6-18M224 290v-16M416 290v-20M422 290l-6-18M428 290v-14" stroke="#5f7a4e" stroke-width="2.4"/></g>
  <g class="mu-l" data-l="sun-up"><circle cx="320" cy="168" r="70" fill="url(#mu-glow)"/><circle cx="320" cy="168" r="26" fill="#e1b04f" stroke="#a6782c" stroke-width="2"/>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<path d="M${320 + 34 * c} ${168 + 34 * s}L${320 + 46 * c} ${168 + 46 * s}" stroke="#c8963e" stroke-width="3" stroke-linecap="round"/>`; }).join('')}</g>
  <g class="mu-l" data-l="shu"><path d="M60 120q60 -24 120 0t120 0M340 110q60 -24 120 0t120 0M120 70q50 -20 100 0M430 64q50 -20 100 0" stroke="#7d9aa0" stroke-width="3" fill="none" stroke-linecap="round"/></g>
  <g class="mu-l" data-l="tefnut">${[[90, 180], [140, 214], [520, 178], [560, 214], [470, 220], [180, 172]].map(([x, y]) => `<path d="M${x} ${y}q-7 11 0 15q7 -4 0 -15Z" fill="#5f8f99"/>`).join('')}</g>
  <g class="mu-l" data-l="nut"><path d="M24 300C40 120 140 40 320 40S600 120 616 300" fill="none" stroke="#2b4f72" stroke-width="30" stroke-linecap="round"/><g fill="#f3e6c4">${stars}</g></g>
  <g class="mu-l" data-l="l-nun"><text x="320" y="190" class="mu-cap">Nun</text><text x="320" y="214" class="mu-sub">dark, endless water</text></g>
  <g class="mu-l" data-l="l-atum"><text x="320" y="275" class="mu-cap">Atum, asleep</text></g>
  <g class="mu-l" data-l="l-mound"><text x="320" y="330" class="mu-cap">the first mound</text><text x="320" y="96" class="mu-cap">Atum awake</text></g>
  <g class="mu-l" data-l="l-shu"><text x="120" y="102" class="mu-cap dark">Shu · air</text><text x="525" y="250" class="mu-cap dark">Tefnut · moisture</text></g>
  <g class="mu-l" data-l="l-geb"><text x="320" y="110" class="mu-cap dark">Nut · sky</text><text x="110" y="330" class="mu-cap">Geb · earth</text></g>
  </g></svg>`;
}

function templeSvg() {
  // Longitudinal section (top) and plan (bottom). x: pylon 30–150, court 150–330, hall 330–560, sanctuary 560–720.
  const floor = { court: 300, hall: 282, sanct: 258 };
  const cols = [360, 405, 450, 495, 540].map(x => `<rect x="${x - 7}" y="150" width="14" height="${floor.hall - 150}" class="mu-col"/><path d="M${x - 7} 150C${x - 22} 140 ${x - 22} 128 ${x - 18} 122H${x + 18}C${x + 22} 128 ${x + 22} 140 ${x + 7} 150Z" class="mu-cap-shape"/>`).join('');
  const courtCols = [175, 305].map(x => `<rect x="${x - 6}" y="200" width="12" height="100" class="mu-col faint"/>`).join('');
  const planHall = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) planHall.push(`<circle cx="${350 + i * 38}" cy="${398 + j * 16}" r="${j === 1 || j === 2 ? 5 : 3.5}" class="mu-pcol"/>`);
  const planCourt = [190, 215, 240, 265, 290].flatMap(x => [`<circle cx="${x}" cy="392" r="3.5" class="mu-pcol"/>`, `<circle cx="${x}" cy="452" r="3.5" class="mu-pcol"/>`]).join('');
  const zone = (id, x, w) => `<rect class="mu-hl" data-l="hl-${id}" x="${x}" y="22" width="${w}" height="452" rx="4"/>`;
  return `<svg viewBox="0 0 760 520" role="img" aria-label="Schematic section and plan of a typical Egyptian temple. From the gateway through the open court and the columned hall to the sanctuary, the floor steps up, the ceiling steps down and the light fades.">
  <defs>
    <linearGradient id="mu-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4e3b8"/><stop offset="1" stop-color="#f6efdc"/></linearGradient>
    <linearGradient id="mu-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4e3b8"/><stop offset=".45" stop-color="#b9a37a"/><stop offset="1" stop-color="#22302a"/></linearGradient>
    <linearGradient id="mu-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d27a" stop-opacity=".95"/><stop offset="1" stop-color="#f6d27a" stop-opacity=".25"/></linearGradient>
  </defs>
  <rect x="150" y="30" width="180" height="270" fill="url(#mu-sky)"/>
  <circle cx="240" cy="62" r="16" fill="#e1b04f"/>
  <path d="M206 92l-14 30M240 96v34M274 92l14 30" stroke="#e1b04f" stroke-width="2.5" opacity=".7"/>
  <!-- pylon (section through the gate) -->
  <path d="M40 300L62 40H128L150 300Z" class="mu-stone"/><rect x="72" y="190" width="46" height="110" fill="#f6efdc"/><text x="95" y="30" class="mu-lab">GATEWAY</text>
  ${courtCols}<text x="240" y="160" class="mu-lab">OPEN COURT</text>
  <!-- hall -->
  <rect x="330" y="112" width="232" height="${floor.hall - 112}" fill="#5d5a44" opacity=".28"/>
  <rect x="330" y="104" width="232" height="10" class="mu-stone"/>
  <g class="mu-grille"><rect x="346" y="114" width="200" height="8" fill="#f6efdc"/>${Array.from({ length: 21 }, (_, i) => `<rect x="${346 + i * 10}" y="114" width="3" height="8" class="mu-stone"/>`).join('')}</g>
  <path d="M360 122L330 288H400Z M470 122L440 288H510Z" fill="url(#mu-beam)" opacity=".38"/>
  ${cols}<text x="446" y="78" class="mu-lab">COLUMNED HALL</text><text x="446" y="96" class="mu-mini">clerestory windows ↓</text>
  <!-- sanctuary -->
  <rect x="562" y="190" width="160" height="${floor.sanct - 190}" fill="#1d2924" opacity=".88"/>
  <rect x="562" y="182" width="160" height="10" class="mu-stone"/>
  <path d="M600 ${floor.sanct}C618 232 640 222 660 222S702 232 716 ${floor.sanct}" fill="none" stroke="#b58a4d" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="655" y="182" width="8" height="10" fill="#f6d27a"/>
  <path d="M655 192L644 ${floor.sanct - 4}H676L663 192Z" fill="url(#mu-beam)"/>
  <rect x="640" y="206" width="40" height="${floor.sanct - 206}" fill="none" stroke="#b58a4d" stroke-width="1.5"/>
  <circle cx="660" cy="222" r="5" fill="#e1b04f"/><rect x="655" y="228" width="10" height="${floor.sanct - 232}" fill="#e1b04f"/>
  <text x="642" y="172" class="mu-lab">SANCTUARY</text><text x="632" y="226" class="mu-mini light" text-anchor="end">god’s statue</text><text x="642" y="${floor.sanct + 16}" class="mu-mini gold">↑ stands for the first mound</text>
  <!-- walls and floor -->
  <rect x="326" y="104" width="8" height="${floor.hall - 104}" class="mu-stone"/><rect x="558" y="104" width="8" height="${floor.hall - 104}" class="mu-stone"/><rect x="718" y="182" width="8" height="${floor.sanct - 182}" class="mu-stone"/>
  <path d="M20 300H330V${floor.hall}H562V${floor.sanct}H740V316H20Z" class="mu-ground"/>
  <!-- level lines -->
  <path d="M150 302H330V${floor.hall + 2}H562V${floor.sanct + 2}H726" class="mu-level"/>
  <path d="M330 100H562V178H726" class="mu-level"/>
  <text x="730" y="${floor.sanct + 4}" class="mu-mini gold" text-anchor="start">↑</text>
  <!-- trend bar -->
  <rect x="150" y="330" width="576" height="10" fill="url(#mu-fade)"/>
  <text x="150" y="358" class="mu-mini" text-anchor="start">bright</text><text x="726" y="358" class="mu-mini" text-anchor="end">dark</text>
  <text x="438" y="358" class="mu-mini">floor rises · ceiling lowers · light fades →</text>
  <!-- plan -->
  <text x="20" y="384" class="mu-mini" text-anchor="start">PLAN</text>
  <path d="M40 382H90V414H40ZM40 434H90V466H40Z M100 382H150V414H100ZM100 434H150V466H100Z" class="mu-stone"/>
  <path d="M90 392H100M90 456H100" stroke="#8d784f" stroke-width="2"/>
  <rect x="150" y="380" width="180" height="88" class="mu-pwall"/>${planCourt}
  <rect x="330" y="384" width="232" height="80" class="mu-pwall"/>${planHall.join('')}
  <rect x="562" y="394" width="160" height="60" class="mu-pwall dark"/><path d="M618 394V454M678 394V454M618 412H678" stroke="#8d784f" stroke-width="1.5"/><rect x="638" y="414" width="20" height="20" fill="#e1b04f"/>
  <path d="M20 424H740" stroke="#b58a4d" stroke-dasharray="6 6"/>
  <text x="744" y="428" class="mu-mini" text-anchor="start">→</text>
  ${zone('pylon', 26, 128)}${zone('court', 154, 178)}${zone('hall', 332, 230)}${zone('sanctuary', 562, 162)}
  </svg>`;
}

function akhetSvg() {
  return `<svg viewBox="0 0 520 200" role="img" aria-label="The hieroglyph akhet, horizon, beside a schematic front view of a pylon gateway with the sun between its towers.">
  <text x="110" y="150" class="mu-glyph" lang="egy">${String.fromCodePoint(0x1320C)}</text>
  <text x="110" y="190" class="mu-mini">akhet, “horizon” (sign N27)</text>
  <text x="250" y="110" class="mu-mini">≈</text>
  <circle cx="400" cy="70" r="20" fill="#e1b04f"/>
  <path d="M300 170L318 40H372L384 170Z M416 170L428 40H482L500 170Z" class="mu-stone"/>
  <rect x="380" y="100" width="40" height="70" class="mu-stone"/><rect x="390" y="122" width="20" height="48" fill="#f6efdc"/>
  <path d="M290 170H510" stroke="#8d784f" stroke-width="2"/>
  <text x="400" y="190" class="mu-mini">a pylon seen from the front</text></svg>`;
}

function muBlock(kind, svg, steps, intro) {
  return `<div class="mu-block" data-kind="${kind}"><div class="mu-wrap"><div class="mu-svg">${svg}</div><div class="mu-text"><p class="mu-intro">${fmt(intro)}</p><div class="col-steps">${steps.map((s, i) => `<button data-mustep="${i}" class="${i === 0 ? 'on' : ''}">${i + 1}. ${esc(s.label)}</button>`).join('')}</div><p class="col-note mu-note" aria-live="polite">${fmt(steps[0].text)}</p><div class="mu-nav"><button data-mumove="-1" aria-label="Previous step">←</button><button data-mumove="1" aria-label="Next step">Next →</button></div></div></div></div>`;
}

function universePage() {
  const f = muFeature(); if (!f) return '<div class="page-head"><h1>This page is not in this build.</h1></div>';
  const c = f.creation, t = f.temple, k = f.karnak;
  const section = x => `<div class="mu-sec${x.drawing ? ' with-drawing' : ''}" id="mu-${esc(x.id)}"><div><h2>${esc(x.heading)}</h2>${x.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(x.citations)}</div>${x.drawing === 'akhet' ? `<figure class="mu-akhet">${akhetSvg()}<figcaption class="micro">Original drawing. The hieroglyph is sign N27 in the standard sign list.</figcaption></figure>` : ''}</div>`;
  const part = (p, i) => { const m = p.mediaId && media[p.mediaId]; return `<article class="mu-part">${m ? `<button class="mu-part-img" data-zoom="${esc(m.id)}" aria-label="Enlarge image: ${esc(m.caption)}"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" ></button>` : '<div class="mu-part-img none">No photo yet</div>'}<div class="mu-part-body"><span class="mu-num">${i + 1}</span><h3>${esc(p.label)}</h3><p class="mu-role">${esc(p.role)}</p><p>${fmt(p.text)}</p>${p.link ? `<a class="mu-stop" href="${esc(p.link)}">${p.link === '#hall' ? 'Open the Hall guide' : 'More about this place'} →</a>` : ''}${m ? credit(m) : ''}</div></article>`; };
  return `<div class="page-head"><a class="micro" href="#basics">← The Context</a><span class="eyebrow" style="margin-top:18px">${esc(f.eyebrow)}</span><h1>${esc(f.title)}</h1><p>${fmt(f.dek)}</p></div>
  <section class="section mu" style="padding-top:0">
    <h2>${esc(c.heading)}</h2>${muBlock('creation', creationSvg(), c.steps, c.intro)}${sourcesBlock(c.citations)}
    <h2>${esc(t.heading)}</h2>${muBlock('temple', templeSvg(), t.steps, t.intro)}
    <p class="mu-summary">${fmt(t.summary)}</p>${sourcesBlock(t.citations)}
    ${(f.sections || []).map(section).join('')}
    <div class="mu-karnak"><h2>${esc(k.heading)}</h2><div class="mu-prose">${k.text.map(p => `<p>${fmt(p)}</p>`).join('')}</div>
    <div class="mu-aerial">${hallFigure(k.figure)}</div>
    <div class="mu-parts">${k.parts.map(part).join('')}</div>
    ${sourcesBlock(k.citations)}</div>
    <p class="micro">${esc(f.drawingNote)}</p>
  </section>`;
}

function setMuStep(block, n) {
  const kind = block.dataset.kind, f = muFeature(); if (!f) return;
  const steps = kind === 'creation' ? f.creation.steps : f.temple.steps;
  n = Math.max(0, Math.min(steps.length - 1, n)); block.dataset.step = n;
  const on = new Set(MU_LAYERS[kind][n]);
  block.querySelectorAll('[data-l]').forEach(g => { if (g.dataset.l === 'dark') return; g.classList.toggle('on', on.has(g.dataset.l)); });
  block.querySelectorAll('[data-mustep]').forEach(b => b.classList.toggle('on', +b.dataset.mustep === n));
  block.querySelector('.mu-note').innerHTML = fmt(steps[n].text);
  const next = block.querySelector('[data-mumove="1"]'); if (next) next.disabled = n === steps.length - 1;
  const prev = block.querySelector('[data-mumove="-1"]'); if (prev) prev.disabled = n === 0;
}
function universeAfterRender() { document.querySelectorAll('.mu-block').forEach(b => setMuStep(b, 0)); }
function universeInteract(e) {
  const s = e.target.closest('[data-mustep]'); if (s) { setMuStep(s.closest('.mu-block'), +s.dataset.mustep); return true; }
  const m = e.target.closest('[data-mumove]'); if (m) { const b = m.closest('.mu-block'); setMuStep(b, +(b.dataset.step || 0) + +m.dataset.mumove); return true; }
  return false;
}
// Small teaser card used on the home page, the Hall overview and stop 1.
function universeTeaser() {
  const f = muFeature(); if (!f) return '';
  return `<a class="mu-teaser" href="#universe"><span class="eyebrow">${esc(f.eyebrow)}</span><b>${esc(f.title)}</b><span>Why the floor rises, the roof drops and the light fades as you walk in. With step-by-step drawings. →</span></a>`;
}
