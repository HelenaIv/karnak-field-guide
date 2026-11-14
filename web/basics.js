// "The big picture": background pages with original drawings.
// Content: content/features/basics.json. Drawings are original schematics made for this guide.
function bsData() { return (D.features || []).find(f => f.id === 'basics'); }
function bsEra(id) { return (bsData()?.eras || []).find(e => e.id === id) || { colour: '#888', label: id }; }
function bsKing(id) { return D.reading?.names?.kings?.find(k => k.id === id); }
const bsState = { mode: 'grow', view: 'main', step: 0, lost: true, sel: null };

// ---------- Plan geometry (metres, west = left, north = up; schematic) ----------
const BR = (x1, y1, x2, y2, cls = '') => `<rect class="s ${cls}" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`;
const BPY = (x1, x2, h, gap = 3.5, label = '', ly = 0) => BR(x1, -h, x2, -gap) + BR(x1, gap, x2, h) + (label ? `<text class="bp-num${x2 - x1 < 9 ? ' sm' : ''}" x="${(x1 + x2) / 2}" y="${ly}">${label}</text>` : '');
const BPYS = (y1, y2, x1, x2, label = '', cx = 197) => BR(x1, y1, cx - 3, y2) + BR(cx + 3, y1, x2, y2) + (label ? `<text class="bp-num" x="${cx}" y="${(y1 + y2) / 2 + 3}">${label}</text>` : '');
const BDOT = (x, y, r = 2.2) => `<circle class="s" cx="${x}" cy="${y}" r="${r}"/>`;
function bsHypoCols() { let s = ''; for (let i = 0; i < 6; i++) { const x = 126 + i * 10; s += BDOT(x, -6, 2.6) + BDOT(x, 6, 2.6); } for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) { const x = 122 + i * 7, y = 14 + j * 5.5; s += BDOT(x, y, 1.5) + BDOT(x, -y, 1.5); } return s; }
const BS_GEO = {
  'mk-temple': () => BR(270, -19, 308, 19, 'fill') + `<text class="bp-lab inv" x="289" y="-2">Senusret I</text><text class="bp-lab inv" x="289" y="6">temple</text>`,
  'white-chapel': () => BR(228, 32, 235, 39, 'fill'),
  'am1-gate': () => BR(204, -22, 209, 22, 'fill'),
  'am1-shrine': () => BR(250, -3, 257, 3, 'fill'),
  'am1-chapels': () => BR(240, -27, 266, -23, 'fill') + BR(240, 23, 266, 27, 'fill'),
  'pylon4': () => BPY(203, 210, 38, 3, 'IV', 22),
  'pylon5': () => BPY(222, 227, 28, 3, 'V', 18),
  'wadjet': () => BR(210, -30, 222, 30, 'light'),
  'th1-walls': () => BR(210, -38, 308, 38, 'line'),
  'th1-obelisks': () => BDOT(199, -6, 1.8) + BDOT(199, 6, 1.8),
  'th2-pylon': () => BPY(175, 181, 40, 3) + `<path class="s line" d="M181 -40H203M181 40H203"/>`,
  'th2-obelisks': () => BDOT(186.5, -6, 1.8) + BDOT(186.5, 6, 1.8),
  'hat-obelisks': () => BDOT(216, -11, 2) + BDOT(216, 11, 2),
  'hat-palace': () => BR(237, -20, 268, 20, 'light'),
  'red-chapel': () => BR(248, -4, 259, 4, 'fill'),
  'hat-east-obelisks': () => BDOT(363.5, -12, 2) + BDOT(363.5, 12, 2),
  'pylon8': () => BPYS(168, 175, 176, 218, 'VIII'),
  'akhmenu': () => BR(312, -50, 352, 36, 'fill') + (() => { let s = ''; for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) s += BDOT(318 + i * 7, -10 + j * 14, 1.4); return s; })() + `<text class="bp-lab inv" x="332" y="26">Akhmenu</text>`,
  'th3-walls': () => BR(205, -58, 358, 58, 'line'),
  'contra': () => BR(360, -6, 367, 6, 'fill'),
  'pylon6': () => BPY(233, 237, 22, 3, 'VI', 16),
  'th3-chapels': () => BR(240, -27, 266, -23, 'fill') + BR(240, 23, 266, 27, 'fill'),
  'th3-shrine': () => BR(248, -4, 259, 4, 'fill'),
  'th3-obelisks': () => BDOT(194.5, -6, 1.8) + BDOT(194.5, 6, 1.8),
  'pylon7': () => BPYS(100, 106, 172, 222, 'VII'),
  'lake': () => BR(232, 72, 346, 146, 'water') + `<text class="bp-lab" x="289" y="112">Sacred Lake</text>`,
  'pylon3': () => BPY(182, 191, 52, 3.5, 'III', 30),
  'pylon10': () => BPYS(312, 319, 174, 220, 'X'),
  'gem-pa-aten': () => BR(585, -60, 665, 60, 'fill') + `<text class="bp-lab inv" x="625" y="3">Gem-pa-Aten</text>`,
  'pylon2': () => BPY(105, 118, 52, 3.5, 'II', 30),
  'pylon9': () => BPYS(238, 245, 172, 222, 'IX'),
  'hypostyle': () => BR(118, -51, 182, 51, 'light') + bsHypoCols(),
  'r2-east': () => BR(380, -10, 400, 10, 'fill'),
  'sety2-shrine': () => BR(22, -46, 34, -34, 'fill'),
  'r3-temple': () => BR(52, 30, 76, 92, 'fill') + BR(50, 28, 78, 34, 'fill'),
  'khonsu': () => BR(40, 205, 68, 283, 'fill') + BR(36, 283, 72, 290, 'fill') + `<text class="bp-lab inv" x="54" y="245">Khonsu</text>`,
  'great-court': () => BR(15, -52, 105, 52, 'line') + (() => { let s = ''; for (let x = 22; x <= 100; x += 7) s += BDOT(x, -47, 1.4) + BDOT(x, 47, 1.4); return s; })(),
  'bubastite': () => BR(97, 49, 104, 55, 'fill'),
  'kiosk': () => [45, 55, 65, 75, 85].map(x => BDOT(x, -7, 2.2) + BDOT(x, 7, 2.2)).join(''),
  'edifice': () => BR(232, 58, 247, 69, 'fill'),
  'pylon1': () => BPY(0, 15, 57, 4, 'I', 34),
  'enclosure': () => `<path class="s wall" d="M-2 -232L515 -262L532 350L-2 300Z"/>`,
  'philip-shrine': () => BR(248, -4, 259, 4, 'fill'),
  'bab-el-amara': () => BR(48, 299, 60, 309, 'fill'),
  'opet': () => BR(10, 225, 36, 262, 'fill') + `<text class="bp-lab inv" x="23" y="246">Opet</text>`,
};
const BS_VIEWS = { main: '-14 -70 425 140', whole: '-60 -285 750 670' };

function bsPlanSvg() {
  const g = bsData().growth;
  const els = Object.entries(g.elements).map(([id, e]) => BS_GEO[id] ? `<g class="el" data-el="${id}" style="--c:${bsEra(e.era).colour}" tabindex="0" role="button" aria-label="${esc(e.name)}">${BS_GEO[id]()}</g>` : '').join('');
  return `<svg viewBox="${BS_VIEWS[bsState.view]}" class="bp-svg" role="img" aria-label="Schematic plan of the temple of Amun-Ra at Karnak, west on the left">
  <rect x="-60" y="-285" width="750" height="670" class="bp-ground"/>
  <path class="bp-axis" d="M-40 0H560M197 40V330"/>
  <g class="bp-note"><text x="-10" y="-60">WEST</text><text x="-48" y="-150">Nile and quay ←</text><text x="408" y="-60" text-anchor="end">EAST →</text><text x="140" y="372">to the Mut precinct and Luxor ↓</text><text x="0" y="-250">↑ Montu precinct (north)</text><text x="540" y="-75">outside the wall</text></g>
  ${els}
  <g class="bp-compass" transform="translate(395 -52)"><path d="M0 -10L4 2H-4Z"/><text y="12">N</text></g>
  </svg>`;
}

function bsPlanPage(stepArg) {
  const f = bsData(), g = f.growth, steps = g.steps;
  if (stepArg !== undefined && stepArg !== '' && !isNaN(+stepArg)) { bsState.step = Math.max(0, Math.min(steps.length - 1, +stepArg)); bsState.mode = 'grow'; }
  const legend = f.eras.map(e => `<button class="bp-chip" data-bp-era="${e.id}" style="--c:${e.colour}"><i></i>${esc(e.short)}</button>`).join('');
  return `${bsHead('How the temple grew', g.intro)}
  <section class="section bs" style="padding-top:0">
   <div class="bp-tools"><div class="bp-seg"><button data-bp-mode="grow">Step by step</button><button data-bp-mode="built">Who built what</button></div>
   <div class="bp-seg"><button data-bp-view="main">Main temple</button><button data-bp-view="whole">Whole precinct</button></div></div>
   <div class="bp-grow"><div class="bp-stepbar"><button data-bp-move="-1" aria-label="Previous step">←</button><input type="range" min="0" max="${steps.length - 1}" value="${bsState.step}" data-bp-range aria-label="Choose a building phase"><button data-bp-move="1" aria-label="Next step">→</button></div>
   <div class="bp-steptext"><span class="bp-date"></span><h2 class="bp-steptitle"></h2><p class="bp-stepdesc"></p></div></div>
   <div class="bp-built"><p class="bp-builtintro">${esc(g.builtIntro)}</p><label class="bp-lost"><input type="checkbox" data-bp-lost checked> Show buildings that are gone</label></div>
   <p class="micro bp-swipe">Swipe sideways to see the whole plan.</p><div class="bp-svg-wrap">${bsPlanSvg()}</div>
   <div class="bp-legend">${legend}</div>
   <div class="bp-info" aria-live="polite"><p class="micro">Tap a building on the plan to see who built it and what is left of it.</p></div>
   <p class="micro">${esc(g.note)} Inspired by the many colour-coded builders’ plans of Karnak; redrawn from published plans and descriptions, not copied.</p>
   ${sourcesBlock(g.citations)}
  </section>`;
}
function bsRenderPlan() {
  const wrap = document.querySelector('.bp-svg-wrap'); if (!wrap || !wrap.querySelector) return;
  const g = bsData().growth, s = bsState.step, built = bsState.mode === 'built', last = g.steps.length - 1;
  document.querySelector('.bs')?.setAttribute('data-mode', bsState.mode);
  document.querySelectorAll('[data-bp-mode]').forEach(b => b.classList.toggle('on', b.dataset.bpMode === bsState.mode));
  document.querySelectorAll('[data-bp-view]').forEach(b => b.classList.toggle('on', b.dataset.bpView === bsState.view));
  wrap.querySelector('svg').setAttribute('viewBox', BS_VIEWS[bsState.view]);
  wrap.querySelectorAll('.el').forEach(el => {
    const e = g.elements[el.dataset.el]; const cur = built ? last : s;
    const alive = e.from <= cur && (e.to == null || e.to > cur);
    const removedNow = !built && e.to === s;
    const lost = built && (e.to != null || e.gone);
    el.classList.toggle('on', alive && !(built && e.gone));
    el.classList.toggle('new', !built && e.from === s);
    el.classList.toggle('removed', removedNow);
    el.classList.toggle('ghost', lost && bsState.lost);
    el.classList.toggle('sel', bsState.sel === el.dataset.el);
  });
  if (!built) {
    const st = g.steps[s];
    document.querySelector('.bp-date').textContent = st.date;
    document.querySelector('.bp-steptitle').textContent = st.label;
    document.querySelector('.bp-stepdesc').innerHTML = fmt(st.text);
    const r = document.querySelector('[data-bp-range]'); if (r) r.value = s;
  }
}
function bsInfo(id) {
  const g = bsData().growth, e = g.elements[id]; if (!e) return;
  bsState.sel = id; const era = bsEra(e.era), st = g.steps[e.from], gone = e.to != null ? g.steps[e.to] : null;
  const link = e.hall ? `<a href="#hall">Open the Hall guide →</a>` : (e.link && records[e.link] ? `<a href="#entry/${esc(e.link)}">More about this place →</a>` : '');
  document.querySelector('.bp-info').innerHTML = `<h3><i style="background:${era.colour}"></i>${esc(e.name)}</h3><p><b>Built:</b> ${esc(st.label)}, ${esc(st.date)}.${gone ? ` <b>Removed:</b> ${esc(gone.label)}, ${esc(gone.date)}.` : ''}</p><p><b>Today:</b> ${esc(e.today)}</p>${link}`;
  bsRenderPlan();
}

// ---------- Generic step-through drawing ----------
function bsStepper(id, svg, steps) {
  return `<div class="bs-stepper" data-stepper="${id}" data-step="0"><div class="bs-step-svg">${svg}</div><div class="bs-step-text"><div class="col-steps">${steps.map((s, i) => `<button data-bsstep="${i}" class="${i ? '' : 'on'}">${i + 1}. ${esc(s.label)}</button>`).join('')}</div><p class="col-note bs-note">${fmt(steps[0].text)}</p></div></div>`;
}
const BS_STEPPERS = {};
function bsSetStep(box, n) {
  const st = BS_STEPPERS[box.dataset.stepper]; if (!st) return;
  n = Math.max(0, Math.min(st.length - 1, n)); box.dataset.step = n;
  const on = new Set(st[n].layers);
  box.querySelectorAll('[data-l]').forEach(g => g.classList.toggle('on', on.has(g.dataset.l)));
  box.querySelectorAll('[data-bsstep]').forEach(b => b.classList.toggle('on', +b.dataset.bsstep === n));
  box.querySelector('.bs-note').innerHTML = fmt(st[n].text);
}

// ---------- Drawings ----------
function bsMaterialsSvg() {
  const pts = [['Tura', 'fine limestone', 70, '#d8cfb8'], ['Gebel Ahmar', 'red quartzite', 92, '#a8574a'], ['Hatnub', 'calcite (“alabaster”)', 190, '#efe8d6'], ['Thebes · Karnak', '', 300, null], ['Gebel el-Silsila', 'sandstone', 372, '#c9a46a'], ['Aswan', 'granite', 420, '#b9776b']];
  return `<svg viewBox="0 0 520 470" role="img" aria-label="Schematic map of the Nile valley with the quarries that supplied Karnak: Tura, Gebel Ahmar, Hatnub, Gebel el-Silsila and Aswan.">
  <rect width="520" height="470" fill="#f3ead6"/>
  <path d="M250 20C245 80 262 120 248 170S236 250 262 300S250 380 262 450" fill="none" stroke="#6f9aa5" stroke-width="9" stroke-linecap="round"/>
  <path d="M250 20C230 10 210 12 196 22M250 20C270 10 292 12 306 22" fill="none" stroke="#6f9aa5" stroke-width="5"/>
  <text x="300" y="34" class="bs-map-l">Mediterranean ↑</text><text x="282" y="62" class="bs-map-l">Cairo</text>
  ${pts.map(([n, m, y, col]) => { const x = 252 + (y > 280 && y < 320 ? 8 : 0); return col ? `<circle cx="${x}" cy="${y}" r="9" fill="${col}" stroke="#5d4a2c" stroke-width="2"/><text x="${x - 18}" y="${y + 4}" class="bs-map-q" text-anchor="end">${n}</text><text x="${x + 18}" y="${y + 4}" class="bs-map-m">${m}</text>` : `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="#273a30"/><text x="${x - 18}" y="${y + 5}" class="bs-map-q strong" text-anchor="end">${n}</text>`; }).join('')}
  <path d="M276 366C300 350 300 318 276 306" fill="none" stroke="#273a30" stroke-width="2" marker-end="url(#bs-arr)"/>
  <text x="304" y="342" class="bs-map-m">about 160 km by boat</text>
  <defs><marker id="bs-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#273a30"/></marker></defs>
  <text x="20" y="455" class="bs-map-l">Schematic, not to scale. Upstream (south) is at the bottom.</text></svg>`;
}
function bsPylonSvg() {
  // Cross-section of one pylon tower: casing blocks on both faces, fill in the core.
  const rows = (from, to) => { let s = ''; for (let i = from; i < to; i++) { const y = 300 - i * 18, inset = i * 4, x1 = 180 + inset, x2 = 360 - inset; s += `<rect class="bs-block" x="${x1}" y="${y}" width="34" height="18"/><rect class="bs-block" x="${x2 - 34}" y="${y}" width="34" height="18"/><rect x="${x1 + 34}" y="${y}" width="${x2 - x1 - 68}" height="18" fill="#cbb98f"/>`; for (let k = 0; k < 4; k++) s += `<circle cx="${x1 + 48 + k * ((x2 - x1 - 96) / 3)}" cy="${y + 9}" r="${3 + (k + i) % 3}" fill="#a99268"/>`; } return s; };
  const man = (x, y) => `<circle cx="${x}" cy="${y - 14}" r="4" fill="#5d4a2c"/><path d="M${x} ${y - 10}v12M${x} ${y}l-4 8M${x} ${y}l4 8M${x - 5} ${y - 6}h10" stroke="#5d4a2c" stroke-width="2"/>`;
  return `<svg viewBox="0 0 560 360" role="img" aria-label="Step drawing: sand-filled foundation trench, stone courses rising with a mud-brick ramp beside them, then the finished, smoothed tower.">
  <rect width="560" height="360" fill="#f6efdc"/><rect y="318" width="560" height="42" fill="#d9c8a3"/>
  <rect x="170" y="318" width="200" height="30" fill="#efe1b8" stroke="#8d784f"/>
  <g class="bs-l" data-l="tlab"><text x="270" y="338" class="bs-cap">trench filled with clean sand</text><text x="270" y="300" class="bs-cap">levelled stone courses go on top</text></g>
  <g class="bs-l" data-l="low">${rows(0, 4)}</g><g class="bs-l" data-l="mid">${rows(4, 9)}</g><g class="bs-l" data-l="top">${rows(9, 13)}</g>
  <g class="bs-l" data-l="clab"><path d="M300 210H420" stroke="#273a30"/><text x="424" y="206" class="bs-cap l">good stone only on</text><text x="424" y="220" class="bs-cap l">the faces; rubble or</text><text x="424" y="234" class="bs-cap l">old blocks in the core</text></g>
  <g class="bs-l" data-l="ramp1"><path d="M40 318L180 246H186V318Z" class="bs-brick"/>${man(150, 268)}${man(118, 290)}<rect x="158" y="236" width="22" height="12" fill="#c9a46a" stroke="#8d784f"/><text x="60" y="230" class="bs-cap l">mud-brick ramp</text></g>
  <g class="bs-l" data-l="ramp2"><path d="M20 318L196 156H202V318Z" class="bs-brick"/>${man(170, 190)}<text x="30" y="150" class="bs-cap l">ramp raised as the wall grows</text></g>
  <g class="bs-l" data-l="ramp3"><path d="M10 318L216 84H222V318Z" class="bs-brick"/>${man(196, 118)}</g>
  <g class="bs-l" data-l="smooth"><path d="M180 318L228 84H312L360 318Z" fill="#d8c08d" stroke="#8d784f" stroke-width="2"/><path d="M222 84H318L314 74H226Z" fill="#c9ab72"/><path d="M366 318V40" stroke="#6b4f2a" stroke-width="4"/><path d="M366 42l26 8-26 8" fill="#b5452c"/><text x="270" y="200" class="bs-cap">faces smoothed,</text><text x="270" y="216" class="bs-cap">then carved and painted</text><text x="400" y="100" class="bs-cap l">flagpole</text></g>
  </svg>`;
}
function bsColumnSvg() {
  let drums = ''; for (let i = 0; i < 9; i++) drums += `<rect x="96" y="${300 - i * 26}" width="68" height="26" class="bs-block"/>`;
  return `<svg viewBox="0 0 520 360" role="img" aria-label="Drawing of a column built from stacked stone drums, with the capital carved after stacking and a joint crossing the capital.">
  <rect width="520" height="360" fill="#f6efdc"/>
  <rect x="84" y="326" width="92" height="14" class="bs-block"/>${drums}
  <path d="M96 92C70 84 66 60 74 48H186C194 60 190 84 164 92Z" fill="#cdb68a" stroke="#8d784f"/>
  <path d="M74 66H186" stroke="#8d784f" stroke-dasharray="4 3"/>
  <rect x="78" y="34" width="104" height="14" class="bs-block"/>
  <path d="M130 30V340" stroke="#b5452c" stroke-width="1.2" stroke-dasharray="3 3"/><circle cx="130" cy="342" r="3" fill="#b5452c"/>
  <text x="200" y="44" class="bs-cap l">abacus: the block the beams rest on</text>
  <text x="200" y="70" class="bs-cap l">a joint runs through the capital: it was carved</text><text x="200" y="84" class="bs-cap l">after the stones were stacked</text>
  <text x="200" y="190" class="bs-cap l">shaft: stacked drums, centred with plumb lines</text>
  <text x="200" y="336" class="bs-cap l">base</text>
  <g transform="translate(372 230)"><rect x="-40" y="0" width="40" height="40" class="bs-block"/><rect x="0" y="0" width="40" height="40" class="bs-block"/><path d="M-12 14L12 14L6 20L12 26L-12 26L-6 20Z" fill="#8b6a3e"/><text x="0" y="62" class="bs-cap">dovetail cramp joining two blocks</text></g>
  </svg>`;
}
function bsObeliskSvg() {
  return `<svg viewBox="0 0 600 300" role="img" aria-label="Two theories for raising an obelisk: lowering it from a ramp into a sand-filled pit, or levering it up against a groove in its base.">
  <rect width="600" height="300" fill="#f6efdc"/><path d="M300 20V280" stroke="#d9cfb8"/>
  <text x="150" y="30" class="bs-cap strong">Idea 1: the sand pit</text>
  <path d="M10 250L150 160H240V250Z" class="bs-brick"/><path d="M178 160L196 250H214L232 160Z" fill="#efe1b8" stroke="#8d784f"/>
  <path d="M120 170L200 236L210 228L134 160Z" fill="#b9776b" stroke="#6b3b30"/>
  <rect x="190" y="246" width="30" height="8" fill="#8d784f"/>
  <text x="150" y="275" class="bs-cap">the base slides into a pit of sand above the pedestal;</text><text x="150" y="289" class="bs-cap">as sand is removed, it sinks and is pulled upright</text>
  <text x="450" y="30" class="bs-cap strong">Idea 2: levers and a groove</text>
  <path d="M330 250L430 220H440V250Z" class="bs-brick"/>
  <path d="M440 246L548 136L556 144L452 250Z" fill="#b9776b" stroke="#6b3b30"/>
  <rect x="436" y="246" width="34" height="8" fill="#8d784f"/><path d="M446 246h8" stroke="#273a30" stroke-width="3"/>
  <path d="M552 140L590 60" stroke="#5d4a2c" stroke-width="1.5"/><path d="M500 190l-30 -40" stroke="#6b4f2a" stroke-width="4"/>
  <text x="450" y="275" class="bs-cap">its edge sits in a groove in the pedestal; ropes and</text><text x="450" y="289" class="bs-cap">levers raise it bit by bit on timber packing</text></svg>`;
}
function bsReuseSvg() {
  let fill = ''; for (let r = 0; r < 9; r++) for (let k = 0; k < 7; k++) { const x = 110 + k * 26 + (r % 2) * 10, y = 82 + r * 24; if (x < 286) fill += `<rect x="${x}" y="${y}" width="22" height="18" fill="${(r + k) % 3 ? '#d9c79f' : '#e6d6b2'}" stroke="#8d784f" stroke-width=".8"/>`; }
  return `<svg viewBox="0 0 600 330" role="img" aria-label="Cut-away drawing of a pylon: an outer casing of good stone and a core packed with blocks from older buildings.">
  <rect width="600" height="330" fill="#f6efdc"/><rect y="300" width="600" height="30" fill="#d9c8a3"/>
  <path d="M60 300L100 60H300L340 300Z" fill="#c9b07e" stroke="#8d784f" stroke-width="2"/>
  <path d="M100 300L120 76H280L300 300Z" fill="#f2e6c9"/>${fill}
  <g fill="#b5452c"><rect x="136" y="130" width="22" height="18"/><rect x="214" y="202" width="22" height="18"/><rect x="162" y="250" width="22" height="18"/></g>
  <path d="M370 112L262 120" stroke="#273a30" marker-end="url(#bs-arr2)"/><text x="376" y="110" class="bs-cap l">core: blocks of</text><text x="376" y="124" class="bs-cap l">older chapels</text>
  <path d="M370 196L242 210" stroke="#b5452c" marker-end="url(#bs-arr2)"/><text x="376" y="194" class="bs-cap l">a decorated block,</text><text x="376" y="208" class="bs-cap l">its carving hidden inside</text>
  <path d="M370 270L326 270" stroke="#273a30" marker-end="url(#bs-arr2)"/><text x="376" y="266" class="bs-cap l">casing of good,</text><text x="376" y="280" class="bs-cap l">smoothed stone</text>
  <defs><marker id="bs-arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#273a30"/></marker></defs></svg>`;
}
function bsWallSvg() {
  const sec = (x, w, up) => { let s = `<rect x="${x}" y="60" width="${w}" height="196" fill="${up ? '#c4a679' : '#b99a6d'}"/>`; for (let i = 0; i < 10; i++) { const y = 250 - i * 20, b = up ? -14 : 14; s += `<path d="M${x} ${y}Q${x + w / 2} ${y + b} ${x + w} ${y}" fill="none" stroke="#6b4a28" stroke-width="2"/>`; } return s + `<path d="M${x} 60V256" stroke="#f6efdc" stroke-width="2"/>`; };
  return `<svg viewBox="0 0 560 310" role="img" aria-label="Drawing of a mud-brick wall built in sections whose brick courses curve alternately up and down, so the wall looks wavy.">
  <rect width="560" height="310" fill="#f6efdc"/><text x="280" y="40" class="bs-cap">four wall sections, side by side</text>
  ${sec(20, 130, false)}${sec(150, 130, true)}${sec(280, 130, false)}${sec(410, 130, true)}
  <path d="M20 156H540" stroke="#3b2a16" stroke-width="3" stroke-dasharray="10 6"/>
  <text x="280" y="280" class="bs-cap">brick courses laid on curved beds; dashed line: timber beams through the wall</text></svg>`;
}
function bsThebesSvg() {
  return `<svg viewBox="0 0 600 520" role="img" aria-label="Schematic map of ancient Thebes: Karnak and Luxor Temple on the east bank, the royal tombs and memorial temples on the west bank.">
  <rect width="600" height="520" fill="#f3ead6"/>
  <path d="M0 0H170C150 120 190 260 160 520H0Z" fill="#e3d2ac"/><text x="20" y="40" class="bs-map-l">Western desert hills</text>
  <path d="M250 0C232 120 280 240 250 330S280 450 266 520" fill="none" stroke="#6f9aa5" stroke-width="34"/>
  <text x="262" y="300" class="bs-map-l" transform="rotate(-80 262 300)">Nile</text>
  <g class="bs-pl">
   <rect x="400" y="90" width="80" height="70" fill="#c9a46a" stroke="#5d4a2c" stroke-width="2"/><text x="440" y="130" class="bs-map-q strong" text-anchor="middle">Amun-Ra</text>
   <rect x="415" y="50" width="40" height="34" fill="#e6d6b2" stroke="#5d4a2c"/><text x="435" y="72" class="bs-map-m" text-anchor="middle">Montu</text>
   <rect x="430" y="196" width="56" height="46" fill="#e6d6b2" stroke="#5d4a2c"/><text x="458" y="223" class="bs-map-m" text-anchor="middle">Mut</text>
   <rect x="500" y="96" width="60" height="40" fill="none" stroke="#5d4a2c" stroke-dasharray="4 3"/><text x="530" y="152" class="bs-map-m" text-anchor="middle">Aten (gone)</text>
   <text x="380" y="40" class="bs-map-q strong">KARNAK (Ipet-isut)</text>
   <path d="M452 242C440 300 400 360 360 420" fill="none" stroke="#8b6a3e" stroke-width="3" stroke-dasharray="2 5"/><text x="420" y="350" class="bs-map-m">sphinx avenue, about 2 km</text>
   <rect x="320" y="420" width="70" height="36" fill="#c9a46a" stroke="#5d4a2c" stroke-width="2"/><text x="355" y="476" class="bs-map-q" text-anchor="middle">Luxor Temple</text>
  </g>
  <g class="bs-pl">${[['Valley of the Kings', 40, 100], ['Deir el-Bahari', 100, 180], ['Ramesseum', 150, 290], ['Colossi of Memnon', 140, 360], ['Medinet Habu', 110, 420]].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#8b6a3e"/><text x="${x + 12}" y="${y + 4}" class="bs-map-m">${n}</text>`).join('')}</g>
  <text x="20" y="505" class="bs-map-l">WEST BANK: tombs and memorial temples of the kings</text><text x="330" y="505" class="bs-map-l">EAST BANK: temples of the gods</text>
  <path d="M570 20v24M570 20l-5 10M570 20l5 10" stroke="#273a30" stroke-width="2"/><text x="566" y="58" class="bs-map-l">N</text></svg>`;
}
function bsCrownsSvg() {
  const head = x => `<ellipse cx="${x}" cy="150" rx="30" ry="36" fill="#c9a46a"/><path d="M${x - 34} 230Q${x} 190 ${x + 34} 230" fill="#e6d6b2"/><path d="M${x - 12} 186V198H${x + 12}V186" fill="#c9a46a"/>`;
  const amun = x => `${head(x)}<path d="M${x - 32} 132Q${x} 104 ${x + 32} 132V120H${x - 32}Z" fill="#2f4f8f"/><rect x="${x - 26}" y="108" width="52" height="14" fill="#c9a46a" stroke="#8b6a3e"/><path d="M${x - 20} 108L${x - 14} 20H${x - 2}L${x - 4} 108Z" fill="#c0443a" stroke="#6b2a22"/><path d="M${x + 4} 108L${x + 2} 20H${x + 14}L${x + 20} 108Z" fill="#c0443a" stroke="#6b2a22"/>${[40, 60, 80].map(y => `<path d="M${x - 17} ${y}H${x - 3}M${x + 3} ${y}H${x + 17}" stroke="#6b2a22"/>`).join('')}<path d="M${x + 30} 128Q${x + 54} 160 ${x + 44} 214" stroke="#c0443a" stroke-width="5" fill="none"/>`;
  const mut = x => `${head(x)}<path d="M${x - 34} 160Q${x - 36} 112 ${x} 110Q${x + 36} 112 ${x + 34} 160L${x + 26} 166Q${x} 128 ${x - 26} 166Z" fill="#2f6f8f"/><path d="M${x - 6} 116Q${x} 104 ${x + 6} 116" stroke="#f3e6c4" stroke-width="3" fill="none"/><path d="M${x - 24} 112V72H${x - 8}V50L${x + 22} 40V112Z" fill="#c0443a" stroke="#6b2a22"/><path d="M${x - 14} 112V64Q${x - 4} 36 ${x + 8} 64V112Z" fill="#f3efe4" stroke="#8d784f"/><path d="M${x + 22} 46Q${x + 34} 30 ${x + 22} 22" stroke="#c0443a" stroke-width="3" fill="none"/>`;
  const khonsu = x => `${head(x)}<path d="M${x - 31} 140Q${x} 108 ${x + 31} 140V132Q${x} 102 ${x - 31} 132Z" fill="#5d4a2c"/><path d="M${x + 28} 140Q${x + 46} 170 ${x + 34} 206" stroke="#5d4a2c" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${x - 30} 70Q${x} 118 ${x + 30} 70Q${x} 98 ${x - 30} 70Z" fill="#d6b04a" stroke="#8b6a3e"/><circle cx="${x}" cy="66" r="20" fill="#e8c860" stroke="#a6782c"/>`;
  const lab = (x, n, t) => `<text x="${x}" y="258" class="bs-cap strong">${n}</text><text x="${x}" y="276" class="bs-cap">${t}</text>`;
  return `<svg viewBox="0 0 600 290" role="img" aria-label="Simplified drawings of the three headdresses: Amun’s two tall plumes, Mut’s vulture cap with the double crown, Khonsu’s moon disk in a crescent with a child’s side lock.">
  <rect width="600" height="290" fill="#f6efdc"/>${amun(100)}${mut(300)}${khonsu(500)}
  ${lab(100, 'Amun', 'two tall plumes')}${lab(300, 'Mut', 'vulture cap + double crown')}${lab(500, 'Khonsu', 'moon disk, side lock')}</svg>`;
}

// ---------- Pages ----------
function bsHead(title, intro) { return `<div class="page-head"><a class="micro" href="#basics">← The big picture</a><span class="eyebrow" style="margin-top:18px">The big picture</span><h1>${esc(title)}</h1><p>${fmt(intro)}</p></div>`; }
function bsFig(id, caption) { return media[id] ? simpleFigure(id, caption) : ''; }
function bsHome() {
  const f = bsData(); const pic = { plan: 'karnak-aerial-from-south', timeline: 'basics-th1-obelisk', gods: 'basics-amun-mut-dyad', building: 'basics-unfinished-obelisk', thebes: 'basics-sphinx-road', life: 'basics-bark-shrine-relief', universe: 'hypostyle-central-nave', after: 'basics-description-view' };
  return `<div class="page-head"><span class="eyebrow">Background</span><h1>${esc(f.title)}</h1><p>${fmt(f.dek)}</p></div>
  <section class="section" style="padding-top:0"><div class="bs-cards">${f.pages.map(p => { const m = media[pic[p.id]]; return `<a class="bs-card" href="${p.link || '#basics/' + p.id}">${m ? `<span class="bs-card-img"><img src="${esc(m.webPath || m.path)}" alt="" loading="lazy"></span>` : ''}<b>${esc(p.title)}</b><span>${esc(p.teaser)}</span></a>`; }).join('')}</div></section>`;
}
function bsTimeline() {
  const t = bsData().timeline, min = -2150, max = 400, pct = y => ((y - min) / (max - min) * 100).toFixed(2);
  const yr = y => y < 0 ? `${-y} BC` : `AD ${y}`;
  const bar = t.periods.map(p => `<button class="tl-seg" data-scroll="tl-${p.id}" style="left:${pct(p.from)}%;width:${(pct(p.to) - pct(p.from)).toFixed(2)}%;--c:${bsEra(p.era).colour}" title="${esc(p.label)}"><span>${esc(p.label)}</span></button>`).join('');
  const ticks = [-2000, -1500, -1000, -500, 0, 400].map(y => `<span class="tl-tick" style="left:${pct(y)}%">${y === 0 ? '1 BC | AD 1' : yr(y)}</span>`).join('');
  const marks = t.kings.map(k => { const y = -parseInt(k.date); return `<a class="tl-mark" href="#tl-k-${esc(k.king)}" style="left:${pct(y)}%" title="${esc(bsKing(k.king)?.name || k.king)}"></a>`; }).join('');
  const card = k => { const kg = bsKing(k.king) || { name: k.king }; const m = k.mediaId && media[k.mediaId]; return `<article class="tl-king" id="tl-k-${esc(k.king)}">${m ? `<button class="tl-img" data-zoom="${esc(m.id)}" aria-label="Enlarge image"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" loading="lazy"></button>` : ''}<div><span class="micro">${esc(k.date)}</span><h3>${esc(kg.name)}</h3>${kg.birth ? `<div class="tl-cart">${cartouche(kg.birth)}</div>` : ''}<p>${esc(k.built)}</p><a class="mu-stop" href="#basics/plan/${k.step}">See it on the plan →</a>${m ? credit(m) : ''}</div></article>`; };
  return `${bsHead('Timeline and kings', t.intro)}
  <section class="section bs" style="padding-top:0"><div class="tl-bar">${bar}${marks}</div><div class="tl-ticks">${ticks}</div>
  ${t.periods.map(p => { const ks = t.kings.filter(k => k.period === p.id); return `<div class="tl-period" id="tl-${p.id}" style="--c:${bsEra(p.era).colour}"><div class="tl-phead"><span class="micro">${yr(p.from)} – ${yr(p.to)}</span><h2>${esc(p.label)}</h2><p>${fmt(p.text)}</p></div>${ks.length ? `<div class="tl-kings">${ks.map(card).join('')}</div>` : ''}</div>`; }).join('')}
  <p class="micro">Dates are approximate and follow the Digital Karnak project; other books give slightly different reign dates. Cartouches show each king’s birth name; see <a href="#read/names" style="text-decoration:underline">Royal names</a> for both names.</p>
  ${sourcesBlock(t.citations)}</section>`;
}
function bsGods() {
  const g = bsData().gods;
  return `${bsHead('Amun, Mut and Khonsu', g.intro)}
  <section class="section bs" style="padding-top:0"><h2>${esc(g.rise.heading)}</h2><ol class="bs-rise">${g.rise.steps.map(s => `<li><span class="micro">${esc(s.date)}</span><b>${esc(s.label)}</b><p>${fmt(s.text)}</p></li>`).join('')}</ol>${sourcesBlock(g.rise.citations)}
  <h2>How to recognise them</h2><figure class="bs-draw bs-crowns">${bsCrownsSvg()}<figcaption class="micro">Spot them by the headdress. Simplified original drawings, not copies of a particular relief.</figcaption></figure><div class="bs-gods">${g.gods.map(x => { const m = media[x.mediaId]; return `<article class="bs-god">${m ? `<button class="mu-part-img" data-zoom="${esc(m.id)}" aria-label="Enlarge image"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" loading="lazy"></button>` : ''}<div class="bs-god-body"><h3>${esc(x.name)}</h3><p class="mu-role">${esc(x.role)}</p><ul>${x.look.map(l => `<li>${esc(l)}</li>`).join('')}</ul><p><b>Home:</b> ${esc(x.home)}</p><p class="micro">${esc(x.caption)}</p>${m ? credit(m) : ''}</div></article>`; }).join('')}</div>
  ${sourcesBlock(g.citations)}
  <div class="mu-sec"><div><h2>${esc(g.family.heading)}</h2>${g.family.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(g.family.citations)}</div></div>
  <div class="bs-pair">${bsFig('basics-khonsu-temple', 'The temple of Khonsu, the son, in the south-west corner of the precinct.')}${bsFig('basics-sphinx-road', 'The sphinx road that linked the family’s temples with Luxor Temple.')}</div></section>`;
}
function bsBuilding() {
  const b = bsData().building; const draw = { materials: bsMaterialsSvg, column: bsColumnSvg, obelisk: bsObeliskSvg, reuse: bsReuseSvg, wall: bsWallSvg };
  BS_STEPPERS.pylon = [
    { label: 'Foundation', text: 'A trench is dug and partly filled with clean, dry sand, which spreads the weight. Levelled stone courses go on top.', layers: ['tlab'] },
    { label: 'First courses', text: 'Roughly shaped blocks arrive by boat and are fitted to their neighbours one course at a time. A mud-brick ramp starts beside the wall.', layers: ['low', 'ramp1'] },
    { label: 'Rising', text: 'As the wall grows, the ramp is raised with it, about a metre at a time. Only the outer face needs good stone; the core can be rubble or old blocks.', layers: ['low', 'mid', 'ramp2', 'clab'] },
    { label: 'Full height', text: 'At full height the ramp reaches the top. Blocks are still rough on the face.', layers: ['low', 'mid', 'top', 'ramp3'] },
    { label: 'Finished', text: 'The ramp is cleared away and the faces are smoothed, then carved and painted. Flagpoles from Lebanon stood in recesses on the front. At the First Pylon this last stage never happened, so the ramp remains are still there.', layers: ['smooth'] }];
  const sec = s => `<div class="bs-sec" id="b-${esc(s.id)}"><div class="bs-sec-text"><h2>${esc(s.heading)}</h2>${s.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(s.citations)}</div><div class="bs-sec-art">${s.drawing === 'pylon-steps' ? bsStepper('pylon', bsPylonSvg(), BS_STEPPERS.pylon) : `<figure class="bs-draw">${draw[s.drawing]()}<figcaption class="micro">Original drawing for this guide.</figcaption></figure>`}${(s.mediaIds || []).map(id => bsFig(id)).join('')}</div></div>`;
  return `${bsHead('How it was built', b.intro)}<section class="section bs" style="padding-top:0">${b.sections.map(sec).join('')}</section>`;
}
function bsThebes() {
  const t = bsData().thebes;
  return `${bsHead('Karnak in Thebes', t.intro)}<section class="section bs" style="padding-top:0"><div class="bs-sec"><div class="bs-sec-text">${t.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(t.citations)}</div><div class="bs-sec-art"><figure class="bs-draw">${bsThebesSvg()}<figcaption class="micro">Original schematic map, not to scale.</figcaption></figure></div></div>
  <div class="bs-pair">${bsFig('karnak-aerial-from-south', 'The Amun precinct from the air, looking north-west towards the Nile.')}${bsFig('basics-sphinx-road', 'The processional road from Karnak to Luxor Temple, with the bases of its sphinxes.')}${bsFig('basics-montu', 'The precinct of Montu, north of the wall (closed to visitors).')}${bsFig('basics-bab-el-amara', 'Bab el-Amara, the southern gate through the great wall to the Khonsu temple.')}</div></section>`;
}
function bsLife() {
  const l = bsData().life;
  return `${bsHead('A day and a year', l.intro)}<section class="section bs" style="padding-top:0">
  <div class="bs-sec"><div class="bs-sec-text"><h2>${esc(l.ritual.heading)}</h2><ol class="look">${l.ritual.steps.map(s => `<li>${fmt(s)}</li>`).join('')}</ol><p>${fmt(l.ritual.note)}</p>${sourcesBlock(l.ritual.citations)}<p><a class="mu-stop" href="#hall/four-jars">See the king serving the god in the Hall (stop 6) →</a></p></div><div class="bs-sec-art">${bsFig('basics-bark-shrine-relief', 'The king before Amun, on the granite boat shrine at the heart of the temple.')}</div></div>
  <div class="bs-sec"><div class="bs-sec-text"><h2>${esc(l.festivals.heading)}</h2>${l.festivals.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(l.festivals.citations)}<p><a class="mu-stop" href="#hall/barks">See Amun’s boat on the Hall walls (stop 9) →</a></p></div><div class="bs-sec-art">${bsFig('red-chapel-237864cd')}</div></div>
  <div class="mu-sec"><div><h2>${esc(l.estate.heading)}</h2>${l.estate.text.map(p => `<p>${fmt(p)}</p>`).join('')}${sourcesBlock(l.estate.citations)}</div></div></section>`;
}
function bsAfter() {
  const a = bsData().after;
  return `${bsHead('After the pharaohs', a.intro)}<section class="section bs" style="padding-top:0"><ol class="bs-after">${a.events.map(e => `<li><span class="bs-after-date">${esc(e.date)}</span><div><p>${fmt(e.text)}</p>${e.mediaId ? bsFig(e.mediaId) : ''}</div></li>`).join('')}</ol>${sourcesBlock(a.citations)}</section>`;
}
function basicsRoute(sub, arg) {
  if (!bsData()) return '<div class="page-head"><h1>This section is not in this build.</h1></div>';
  if (sub === 'plan') return bsPlanPage(arg);
  return ({ timeline: bsTimeline, gods: bsGods, building: bsBuilding, thebes: bsThebes, life: bsLife, after: bsAfter }[sub] || bsHome)();
}
function basicsAfterRender() {
  if (document.querySelector('.bp-svg-wrap')) bsRenderPlan();
  document.querySelectorAll('.bs-stepper').forEach(b => bsSetStep(b, 0));
}
function basicsInteract(e) {
  const t = e.target;
  const m = t.closest('[data-bp-mode]'); if (m) { bsState.mode = m.dataset.bpMode; bsRenderPlan(); return true; }
  const v = t.closest('[data-bp-view]'); if (v) { bsState.view = v.dataset.bpView; bsRenderPlan(); return true; }
  const mv = t.closest('[data-bp-move]'); if (mv) { bsState.step = Math.max(0, Math.min(bsData().growth.steps.length - 1, bsState.step + +mv.dataset.bpMove)); bsRenderPlan(); return true; }
  const el = t.closest('[data-el]'); if (el) { bsInfo(el.dataset.el); return true; }
  const er = t.closest('[data-bp-era]'); if (er) { const svg = document.querySelector('.bp-svg'); const on = svg.dataset.era === er.dataset.bpEra; svg.dataset.era = on ? '' : er.dataset.bpEra; document.querySelectorAll('.el').forEach(g => g.classList.toggle('dim', !on && bsData().growth.elements[g.dataset.el].era !== er.dataset.bpEra)); document.querySelectorAll('[data-bp-era]').forEach(b => b.classList.toggle('on', !on && b === er)); return true; }
  const st = t.closest('[data-bsstep]'); if (st) { bsSetStep(st.closest('.bs-stepper'), +st.dataset.bsstep); return true; }
  return false;
}
function basicsInput(e) {
  if (e.target.matches('[data-bp-range]')) { bsState.step = +e.target.value; bsRenderPlan(); }
  if (e.target.matches('[data-bp-lost]')) { bsState.lost = e.target.checked; bsRenderPlan(); }
}
