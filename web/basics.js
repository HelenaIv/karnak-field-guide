// "The big picture": background pages with original drawings.
// Content: content/features/basics.json. Drawings are original schematics made for this guide.
function bsData() { return (D.features || []).find(f => f.id === 'basics'); }
function bsEra(id) { return (bsData()?.eras || []).find(e => e.id === id) || { colour: '#888', label: id }; }
function bsKing(id) { return D.reading?.names?.kings?.find(k => k.id === id); }
const bsState = { view: 'main', step: 0, lost: true, sel: null };

// ---------- Plan geometry (metres, west = left, north = up; schematic) ----------
const BR = (x1, y1, x2, y2, cls = '') => `<rect class="s ${cls}" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`;
const BPY = (x1, x2, h, gap = 3.5, label = '', ly = 0) => BR(x1, -h, x2, -gap) + BR(x1, gap, x2, h) + (label ? `<text class="bp-num${x2 - x1 < 9 ? ' sm' : ''}" x="${(x1 + x2) / 2}" y="${ly}">${label}</text>` : '');
const BPYS = (y1, y2, x1, x2, label = '', cx = 197) => BR(x1, y1, cx - 3, y2) + BR(cx + 3, y1, x2, y2) + (label ? `<text class="bp-num" x="${cx}" y="${(y1 + y2) / 2 + 3}">${label}</text>` : '');
const BDOT = (x, y, r = 2.2) => `<circle class="s" cx="${x}" cy="${y}" r="${r}"/>`;
function bsHypoCols() { let s = ''; for (let i = 0; i < 6; i++) { const x = 126 + i * 10; s += BDOT(x, -6, 2.6) + BDOT(x, 6, 2.6); } for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) { const x = 122 + i * 7, y = 14 + j * 5.5; s += BDOT(x, y, 1.5) + BDOT(x, -y, 1.5); } return s; }
const BS_GEO = {
  'mk-temple': () => BR(270, -19, 308, 19, 'fill') + `<text class="bp-lab inv" x="289" y="-2" data-uk="Храм">Senusret I</text><text class="bp-lab inv" x="289" y="6" data-uk="Сенусерта I">temple</text>`,
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
  const f = bsData(), g = f.growth, steps = g.steps, n = steps.length;
  if (stepArg !== undefined && stepArg !== '' && !isNaN(+stepArg)) bsState.step = Math.max(0, Math.min(n, +stepArg));
  // One track of steps, coloured by era; the last button shows everything together.
  const dots = steps.map((st, i) => `<button class="bp-dot" data-bp-step="${i}" style="--c:${bsEra(st.era).colour}" aria-label="${esc(st.label)}, ${esc(st.date)}" title="${esc(st.label)}, ${esc(st.date)}"><span>${i + 1}</span></button>`).join('')
    + `<button class="bp-dot bp-all" data-bp-step="${n}" aria-label="All together" title="All together"><span>All</span></button>`;
  const eras = f.eras.map(e => { const first = steps.findIndex(st => st.era === e.id); return first < 0 ? '' : `<button class="bp-era" data-bp-jump="${first}" style="--c:${e.colour}"><i></i><b>${esc(e.short)}</b><span>${esc(e.years || '')}</span></button>`; }).join('');
  return `${bsHead('How the temple grew', g.intro)}
  <section class="section bs bp2" style="padding-top:0">
   <div class="bp-stage">
    <div class="bp-stagebar"><div class="bp-seg"><button data-bp-view="main">Main temple</button><button data-bp-view="whole">Whole precinct</button></div><span class="bp-now"></span></div>
    <div class="bp-svg-wrap">${bsPlanSvg()}</div>
    <div class="bp-track"><button class="bp-arrow" data-bp-move="-1" aria-label="Previous step">←</button><div class="bp-dots">${dots}</div><button class="bp-arrow" data-bp-move="1" aria-label="Next step">→</button></div>
   </div>
   <div class="bp-panel">
    <div class="bp-steptext" aria-live="polite"><span class="bp-date"></span><h2 class="bp-steptitle"></h2><p class="bp-stepdesc"></p><div class="bp-changes"></div></div>
    <div class="bp-info"><p class="micro">Tap a building on the plan to see who built it and what is left of it.</p></div>
    <div class="bp-key"><span><i class="k-new"></i>New in this step</span><span><i class="k-old"></i>Already standing</span><span><i class="k-gone"></i>Removed or lost</span><span><i class="k-future"></i>Built later</span></div>
    <label class="bp-lost"><input type="checkbox" data-bp-lost ${bsState.lost ? 'checked' : ''}> Show buildings that are gone</label>
    <h3 class="bp-erahead">Colour shows who built it</h3><div class="bp-eras">${eras}</div>
    <p class="micro">${esc(g.note)} Inspired by the many colour-coded builders’ plans of Karnak; redrawn from published plans and descriptions, not copied.</p>
    ${sourcesBlock(g.citations)}
   </div>
  </section>`;
}
function bsRenderPlan() {
  const wrap = document.querySelector('.bp-svg-wrap'); if (!wrap || !wrap.querySelector) return;
  const g = bsData().growth, n = g.steps.length, all = bsState.step >= n, s = all ? n - 1 : bsState.step;
  document.querySelectorAll('[data-bp-view]').forEach(b => b.classList.toggle('on', b.dataset.bpView === bsState.view));
  wrap.querySelector('svg').setAttribute('viewBox', BS_VIEWS[bsState.view]);
  const added = [], removed = [];
  wrap.querySelectorAll('.el').forEach(el => {
    const id = el.dataset.el, e = g.elements[id];
    const standing = e.from <= s && (e.to == null || e.to > s) && !(all && e.gone);
    const isNew = !all && e.from === s, isRemoved = !all && e.to === s;
    const lostNow = (e.to != null && e.to < s) || (all && (e.gone || e.to != null));
    if (isNew) added.push(id); if (isRemoved) removed.push(id);
    el.classList.toggle('on', standing);
    el.classList.toggle('new', isNew);
    el.classList.toggle('removed', isRemoved);
    el.classList.toggle('ghost', lostNow && bsState.lost && !standing);
    el.classList.toggle('future', !all && e.from > s);
    el.classList.toggle('sel', bsState.sel === id);
  });
  document.querySelectorAll('[data-bp-step]').forEach(b => { const i = +b.dataset.bpStep; b.classList.toggle('on', i === bsState.step); b.classList.toggle('past', i < bsState.step); });
  document.querySelector('.bp-dot.on')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  const chip = id => `<button class="bp-chipel" data-el="${id}" style="--c:${bsEra(g.elements[id].era).colour}">${esc(g.elements[id].name)}</button>`;
  if (all) {
    document.querySelector('.bp-date').textContent = g.steps[0].date + ' – ' + g.steps[n - 1].date;
    document.querySelector('.bp-steptitle').textContent = 'All together';
    document.querySelector('.bp-stepdesc').innerHTML = fmt(g.builtIntro);
    document.querySelector('.bp-changes').innerHTML = '';
    document.querySelector('.bp-now').textContent = 'All periods';
  } else {
    const st = g.steps[s], era = bsEra(st.era);
    document.querySelector('.bp-date').innerHTML = `${esc(st.date)} · <b style="color:${era.colour}">${esc(era.label)}</b>`;
    document.querySelector('.bp-steptitle').textContent = st.label;
    document.querySelector('.bp-stepdesc').innerHTML = fmt(st.text);
    document.querySelector('.bp-changes').innerHTML = (added.length ? `<p><b>New:</b> ${added.map(chip).join('')}</p>` : '') + (removed.length ? `<p><b>Removed:</b> ${removed.map(chip).join('')}</p>` : '');
    document.querySelector('.bp-now').innerHTML = `<i style="background:${era.colour}"></i>${s + 1}/${n} · ${esc(st.date)}`;
  }
}
function bsInfo(id) {
  const g = bsData().growth, e = g.elements[id]; if (!e) return;
  bsState.sel = id; const era = bsEra(e.era), st = g.steps[e.from], gone = e.to != null ? g.steps[e.to] : null;
  const link = e.hall ? `<a href="#hall">Open the Hall guide →</a>` : (e.link && records[e.link] ? `<a href="#entry/${esc(e.link)}">More about this place →</a>` : '');
  document.querySelector('.bp-info').innerHTML = `<h3><i style="background:${era.colour}"></i>${esc(e.name)}</h3><p><b>Built:</b> ${esc(st.label)}, ${esc(st.date)} (${esc(era.label)}). <button class="bp-go" data-bp-step="${e.from}">Show this step</button></p>${gone ? `<p><b>Removed:</b> ${esc(gone.label)}, ${esc(gone.date)}.</p>` : ''}<p><b>Today:</b> ${esc(e.today)}</p>${link}`;
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
  const f = bsData(); const pic = { plan: 'karnak-aerial-from-south', timeline: 'basics-th1-obelisk', gods: 'basics-amun-mut-dyad', building: 'basics-unfinished-obelisk', thebes: 'basics-sphinx-road', rituals: 'basics-bark-shrine-relief', life: 'basics-bark-shrine-relief', universe: 'hypostyle-central-nave', after: 'basics-description-view' };
  return `<div class="page-head"><span class="eyebrow">Background</span><h1>${esc(f.title)}</h1><p>${fmt(f.dek)}</p></div>
  ${bsMap()}<section class="section" style="padding-top:0"><h2 class="bsm-all">All topics</h2><div class="bs-cards">${f.pages.map(p => { const m = media[pic[p.id]]; const g = bsGroupOf(p.id); return `<a class="bs-card" href="${p.link || '#basics/' + p.id}" style="--c:${g ? g.colour : '#b58a4d'}">${m ? `<span class="bs-card-img"><img src="${esc(m.webPath || m.path)}" alt="" loading="lazy"><span class="bs-badge">${bsIcon(p.id)}</span></span>` : ''}<b>${esc(p.title)}</b><span>${esc(p.teaser)}</span></a>`; }).join('')}</div></section>`;
}
function bsTimeline() {
  // WHEN and WHO: Egypt's history periods and the kings who built at Karnak. The plan page shows WHERE.
  const t = bsData().timeline, min = -2150, max = 400, span = max - min;
  const yr = y => y < 0 ? `${-y} BC` : `AD ${y}`;
  const strip = t.periods.map(p => `<button class="tl-seg" data-scroll="tl-${p.id}" data-tl="${p.id}" style="flex-grow:${p.to - p.from};--c:${bsEra(p.era).colour}" aria-label="${esc(p.label)}, ${yr(p.from)} – ${yr(p.to)}"><span>${esc(p.label)}</span></button>`).join('');
  const ticks = [-2000, -1500, -1000, -500, 1].map(y => `<span style="left:${((y - min) / span * 100).toFixed(1)}%">${y === 1 ? 'AD 1' : yr(y)}</span>`).join('');
  const card = k => { const kg = bsKing(k.king) || { name: k.king }; const m = k.mediaId && media[k.mediaId];
    return `<li class="tl-king" id="tl-k-${esc(k.king)}"><span class="tl-kdate">${esc(k.date)}</span><div class="tl-kbody">${m ? `<button class="tl-img" data-zoom="${esc(m.id)}" aria-label="Enlarge image"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" loading="lazy"></button>` : ''}<div><h3>${esc(kg.name)}</h3>${kg.birth ? `<div class="tl-cart">${cartouche(kg.birth)}</div>` : ''}<p><b>Built at Karnak:</b> ${esc(k.built)}</p><a class="tl-plan" href="#basics/plan/${k.step}">Show on the plan →</a>${m ? credit(m) : ''}</div></div></li>`; };
  return `${bsHead('Timeline and kings', t.intro)}
  <section class="section bs tl2" style="padding-top:0">
   <div class="tl-sticky"><div class="tl-strip">${strip}</div><div class="tl-ticks2">${ticks}</div><p class="tl-now micro"></p></div>
   ${t.periods.map(p => { const ks = t.kings.filter(k => k.period === p.id); return `<section class="tl-period" id="tl-${p.id}" data-tl="${p.id}" style="--c:${bsEra(p.era).colour}"><div class="tl-phead"><span class="tl-years">${yr(p.from)} – ${yr(p.to)}</span><h2>${esc(p.label)}</h2><p>${fmt(p.text)}</p></div>${ks.length ? `<ol class="tl-kings2">${ks.map(card).join('')}</ol>` : `<p class="micro tl-none">No builder from this period is featured in this guide.</p>`}</section>`; }).join('')}
   <p class="micro">Dates are approximate and follow the Digital Karnak project; other books give slightly different reign dates. Cartouches show each king’s birth name; see <a href="#read/names" style="text-decoration:underline">Royal names</a> for both names.</p>
   ${sourcesBlock(t.citations)}</section>`;
}
function bsTimelineWatch() {
  const secs = [...document.querySelectorAll('.tl-period')]; if (!secs.length || typeof IntersectionObserver === 'undefined') return;
  const t = bsData().timeline, yr = y => y < 0 ? `${-y} BC` : `AD ${y}`;
  const range = p => window.KARNAK_LANG === 'uk' ? (p.to < 0 ? `${-p.from}–${-p.to} до н. е.` : `${-p.from} до н. е. – ${p.to} н. е.`) : `${yr(p.from)} – ${yr(p.to)}`;
  const set = id => { const p = t.periods.find(x => x.id === id); if (!p) return; document.querySelectorAll('.tl-seg').forEach(b => b.classList.toggle('on', b.dataset.tl === id)); const n = document.querySelector('.tl-now'); if (n) n.innerHTML = `<b>${esc(p.label)}</b><span> · ${range(p)}</span>`; };
  set(secs[0].dataset.tl);
  const io = new IntersectionObserver(es => { es.filter(e => e.isIntersecting).forEach(e => set(e.target.dataset.tl)); }, { rootMargin: '-35% 0px -60% 0px' });
  secs.forEach(s => io.observe(s));
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
  return `${bsHead('After the pharaohs', a.intro)}<section class="section bs" style="padding-top:0"><ol class="bs-after">${a.events.map(e => `<li><span class="bs-after-date">${esc(e.date)}</span><div><p>${fmt(e.text)}</p>${e.mediaId ? bsFig(e.mediaId) : ''}${e.videoId ? videoFig(media[e.videoId]) : ''}</div></li>`).join('')}</ol>${sourcesBlock(a.citations)}</section>`;
}
// ---------- Rituals and festivals ----------
const BS_FEST_COL = { newyear: '#3f6b8a', mut: '#9a4f6b', opet: '#b07a2e', khoiak: '#4f7a4a', valley: '#7a5c99' };
function bsDayClockSvg(services) {
  // Sun path over one day, with the three services marked.
  const pt = a => [200 + 160 * Math.cos(Math.PI - a), 190 - 140 * Math.sin(Math.PI - a)];
  const at = [0.12, 0.72, 0.97].map(f => f * Math.PI);
  const mk = (a, i) => { const [x, y] = pt(a); const big = i === 0; return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big ? 15 : 10}" fill="${big ? '#b07a2e' : '#d9b77a'}" stroke="#5d4a2c" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y + (big ? 5 : 4)).toFixed(1)}" text-anchor="middle" class="bs-map-q strong" style="font-size:${big ? 13 : 11}px;fill:#fff">${i + 1}</text><text x="${x.toFixed(1)}" y="${(y - (big ? 24 : 18)).toFixed(1)}" text-anchor="middle" class="bs-map-m">${esc(services[i].time)}</text></g>`; };
  return `<svg viewBox="0 0 400 240" role="img" aria-label="The sun’s path through one day, with the morning service at dawn and two shorter rites in the afternoon and evening">
  <rect width="400" height="240" fill="#f3ead6"/><rect y="190" width="400" height="50" fill="#2f3b45"/>
  <path d="M40 190A160 140 0 0 1 360 190" fill="none" stroke="#c9a46a" stroke-width="2" stroke-dasharray="3 5"/>
  <text x="200" y="222" text-anchor="middle" class="bs-map-l" style="fill:#d8dde0">night: the shrine stays sealed</text>
  <text x="30" y="208" class="bs-map-l" style="fill:#d8dde0">sunrise</text><text x="370" y="208" text-anchor="end" class="bs-map-l" style="fill:#d8dde0">sunset</text>
  ${at.map(mk).join('')}</svg>`;
}
function bsShrineSvg() {
  // Morning service in the sanctuary, step by step.
  const priest = (x, kneel) => kneel
    ? `<circle cx="${x}" cy="196" r="9" fill="#5d4a2c"/><path d="M${x} 205l-4 22h-20M${x} 210l18 6" stroke="#5d4a2c" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${x}" cy="160" r="9" fill="#5d4a2c"/><path d="M${x} 169v40l-8 28M${x} 209l8 28M${x} 180l20 8" stroke="#5d4a2c" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 420 270" role="img" aria-label="A priest before the god’s shrine in the dark sanctuary">
  <rect width="420" height="270" fill="#26302a"/><rect y="238" width="420" height="32" fill="#3a463d"/>
  <g class="layer" data-l="light"><path d="M300 0L250 238H350Z" fill="#f3d98f" opacity=".18"/></g>
  <rect x="250" y="120" width="100" height="118" fill="#8b6a3e" stroke="#e6cf9a" stroke-width="2"/><path d="M246 120h108l-8-14h-92Z" fill="#a5834f" stroke="#e6cf9a"/>
  <g class="layer" data-l="closed"><rect x="256" y="128" width="44" height="104" fill="#6e5330" stroke="#e6cf9a"/><rect x="300" y="128" width="44" height="104" fill="#6e5330" stroke="#e6cf9a"/><circle cx="300" cy="180" r="6" fill="#b8564a"/><text x="300" y="258" text-anchor="middle" class="bs-map-l" style="fill:#e6cf9a">sealed doors</text></g>
  <g class="layer" data-l="open"><rect x="256" y="128" width="88" height="104" fill="#3b2e1c"/><path d="M256 128l-26 10v88l26 6M344 128l26 10v88l-26 6" fill="#6e5330" stroke="#e6cf9a"/>
   <g fill="#e2b84a"><circle cx="300" cy="150" r="8"/><path d="M291 160h18l3 50h-24Z"/><path d="M296 140l4-16 4 16" /></g><text x="300" y="258" text-anchor="middle" class="bs-map-l" style="fill:#e6cf9a">the god’s statue</text></g>
  <g class="layer" data-l="cloth"><path d="M290 166h20l3 30h-26Z" fill="#f4f1e6"/></g>
  <g class="layer" data-l="table"><rect x="190" y="208" width="44" height="30" fill="#a5834f"/><circle cx="200" cy="202" r="7" fill="#c9a46a"/><circle cx="214" cy="200" r="8" fill="#b8564a"/><circle cx="226" cy="203" r="6" fill="#4f7a4a"/></g>
  <g class="layer" data-l="torch"><path d="M120 150v70" stroke="#a5834f" stroke-width="5"/><path d="M120 150c-10-12 2-24 0-34 10 10 10 22 0 34Z" fill="#f0a640"/><path d="M150 140c6-10-4-16 2-26M160 140c6-10-4-16 2-26" stroke="#c9c2b0" stroke-width="2" fill="none"/></g>
  <g class="layer" data-l="stand">${priest(170, false)}</g>
  <g class="layer" data-l="kneel">${priest(186, true)}</g>
  <g class="layer" data-l="sweep">${priest(90, false)}<path d="M98 225l40 10M60 240c12-4 24-2 34 0" stroke="#c9a46a" stroke-width="3" fill="none"/><text x="60" y="262" class="bs-map-l" style="fill:#e6cf9a">footprints swept away</text></g>
  </svg>`;
}
function bsYearWheelSvg(y) {
  // The civil year: 12 months of 30 days in three seasons, plus 5 extra days; festivals on the outer ring.
  const C = 210, ang = d => (d / 365) * 2 * Math.PI - Math.PI / 2, P = (r, d) => [C + r * Math.cos(ang(d)), C + r * Math.sin(ang(d))];
  const arc = (r1, r2, d1, d2, fill, extra = '') => { const [a, b] = P(r2, d1), [c, e] = P(r2, d2), [f, g] = P(r1, d2), [h, k] = P(r1, d1), L = d2 - d1 > 182.5 ? 1 : 0; return `<path d="M${a.toFixed(1)} ${b.toFixed(1)}A${r2} ${r2} 0 ${L} 1 ${c.toFixed(1)} ${e.toFixed(1)}L${f.toFixed(1)} ${g.toFixed(1)}A${r1} ${r1} 0 ${L} 0 ${h.toFixed(1)} ${k.toFixed(1)}Z" fill="${fill}" ${extra}/>`; };
  const seasons = [['Flood', 'Akhet', '#9fc1cf'], ['Growing', 'Peret', '#a9c79a'], ['Harvest', 'Shemu', '#e3c98d']];
  let s = '';
  seasons.forEach(([n, eg, col], i) => { s += arc(92, 150, i * 120, i * 120 + 120, col, 'stroke="#f3ead6" stroke-width="2"'); for (let m = 0; m < 4; m++) { const d = i * 120 + m * 30; s += arc(150, 168, d, d + 30, '#fbf6ea', 'stroke="#d9cfb7"'); const [x, yy] = P(159, d + 15); s += `<text x="${x.toFixed(1)}" y="${(yy + 4).toFixed(1)}" text-anchor="middle" class="bs-map-m" style="font-size:10px">${['I', 'II', 'III', 'IV'][m]}</text>`; } const [tx, ty] = P(121, i * 120 + 60); s += `<text x="${tx.toFixed(1)}" y="${(ty - 2).toFixed(1)}" text-anchor="middle" class="bs-map-q strong" style="font-size:12px">${n}</text><text x="${tx.toFixed(1)}" y="${(ty + 12).toFixed(1)}" text-anchor="middle" class="bs-map-l" style="font-size:10px">${eg}</text>`; });
  s += arc(92, 168, 360, 365, '#c9b48a', 'stroke="#f3ead6"');
  const [ex, ey] = P(168, 362.5); s += `<path d="M${ex.toFixed(1)} ${ey.toFixed(1)}L${C - 52} 30H${C - 70}" fill="none" stroke="#8b7a55"/><text x="${C - 74}" y="33" text-anchor="end" class="bs-map-l">${esc(y.extra)}</text>`;
  y.festivals.forEach((f, i) => { const d = (f.month - 1) * 30 + f.day - 1, col = BS_FEST_COL[f.id] || '#5d4a2c'; if (f.len > 1) s += arc(172, 182, d, d + f.len, col, `opacity=".85"`); const [x, yy] = P(f.len > 1 ? 196 : 186, d + Math.max(f.len, 1) / 2); s += `<g data-scroll="fest-${esc(f.id)}" style="cursor:pointer"><circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="11" fill="${col}" stroke="#fff" stroke-width="2"/><text x="${x.toFixed(1)}" y="${(yy + 4).toFixed(1)}" text-anchor="middle" style="font:bold 11px Arial,sans-serif;fill:#fff">${i + 1}</text></g>`; });
  return `<svg viewBox="0 0 420 420" role="img" aria-label="The Egyptian year as a wheel: twelve months in three seasons and five extra days, with the main festivals of Thebes marked">
  <rect width="420" height="420" fill="#f3ead6"/>${s}<circle cx="${C}" cy="${C}" r="88" fill="#f3ead6"/><text x="${C}" y="${C - 4}" text-anchor="middle" class="bs-map-q strong">365 days</text><text x="${C}" y="${C + 14}" text-anchor="middle" class="bs-map-l">12 × 30 + 5</text>
  <path d="M${C - 14} ${C - 52}A60 60 0 0 1 ${C + 22} ${C - 50}" fill="none" stroke="#8b7a55" stroke-width="1.5"/><path d="M${C + 22} ${C - 50}l-8-5M${C + 22} ${C - 50}l-9 3" stroke="#8b7a55" stroke-width="1.5"/><text x="${C}" y="${C - 60}" text-anchor="middle" class="bs-map-l">year starts at the top</text></svg>`;
}
function bsRoutesSvg() {
  // Schematic map of the festival routes (not to scale). Each route can be highlighted.
  const st = [[318, 178], [314, 214], [306, 250], [298, 286], [290, 322], [282, 352]];
  return `<svg viewBox="0 0 420 470" role="img" aria-label="Schematic map of the festival routes between Karnak, Luxor Temple and the west bank" class="rt-svg" data-route="">
  <rect width="420" height="470" fill="#f3ead6"/><path d="M0 0H120C104 140 132 300 110 470H0Z" fill="#e3d2ac"/>
  <path d="M212 0C196 120 236 230 210 330S236 420 222 470" fill="none" stroke="#9fc1cf" stroke-width="40"/><text x="224" y="250" class="bs-map-l" transform="rotate(-82 224 250)">Nile</text>
  <rect x="290" y="56" width="70" height="56" fill="#c9a46a" stroke="#5d4a2c" stroke-width="2"/><text x="314" y="88" text-anchor="middle" class="bs-map-q strong" style="font-size:12px">Karnak</text>
  <rect x="343" y="62" width="14" height="22" fill="#a5834f"/><text x="348" y="50" text-anchor="middle" class="bs-map-l" style="font-size:9px">Akhmenu</text>
  <rect x="304" y="134" width="40" height="32" fill="#e6d6b2" stroke="#5d4a2c"/><text x="350" y="154" class="bs-map-m">Mut</text>
  <rect x="262" y="362" width="56" height="34" fill="#c9a46a" stroke="#5d4a2c" stroke-width="2"/><text x="290" y="414" text-anchor="middle" class="bs-map-q" style="font-size:12px">Luxor Temple</text>
  ${[['Deir el-Bahari', 66, 74, 40, 100], ['Ramesseum', 92, 224, 8, 250], ['Medinet Habu', 74, 338, 8, 368]].map(([n, x, y, lx, ly]) => `<circle cx="${x}" cy="${y}" r="7" fill="#8b6a3e"/><text x="${lx}" y="${ly}" class="bs-map-m">${n}</text>`).join('')}
  <g class="rt rt-opet"><path d="M324 112C322 140 324 160 318 178S294 320 286 362" fill="none" stroke="#b07a2e" stroke-width="4" stroke-dasharray="7 5"/>${st.map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="#fff" stroke="#b07a2e" stroke-width="2"/>`).join('')}
   <path d="M262 378C236 360 238 300 226 240S232 120 252 98" fill="none" stroke="#b07a2e" stroke-width="3"/><path d="M252 98l-10 4M252 98l-2 10" stroke="#b07a2e" stroke-width="3"/><text x="248" y="190" class="bs-map-l" style="fill:#8a5c1e" transform="rotate(-84 248 190)">back by river</text><text x="312" y="300" class="bs-map-l" style="fill:#8a5c1e">sphinx road</text><text x="312" y="314" class="bs-map-l" style="fill:#8a5c1e">bark stations</text></g>
  <g class="rt rt-valley"><path d="M290 90C250 92 220 90 196 90S110 84 72 76" fill="none" stroke="#7a5c99" stroke-width="4"/><path d="M150 88C130 140 110 190 96 220M130 120C110 220 92 290 78 332" fill="none" stroke="#7a5c99" stroke-width="2" stroke-dasharray="3 4"/></g>
  <g class="rt rt-wehem"><path d="M348 84C372 110 360 140 344 150" fill="none" stroke="#4f7a4a" stroke-width="4"/><path d="M344 150l4-10M344 150l10-2" stroke="#4f7a4a" stroke-width="3"/></g>
  <g class="rt rt-decade"><path d="M262 386C200 392 140 372 82 342" fill="none" stroke="#3f6b8a" stroke-width="4" stroke-dasharray="1 6" stroke-linecap="round"/></g>
  <text x="14" y="456" class="bs-map-l">WEST BANK</text><text x="300" y="456" class="bs-map-l">EAST BANK</text>
  <path d="M30 16v24M30 16l-5 10M30 16l5 10" stroke="#273a30" stroke-width="2"/><text x="26" y="54" class="bs-map-l">N</text></svg>`;
}
function bsBarkSvg() {
  const man = x => `<circle cx="${x}" cy="150" r="7" fill="#5d4a2c"/><path d="M${x} 157v28l-6 22M${x} 185l6 22M${x} 164l-8-18M${x} 164l8-18" stroke="#5d4a2c" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 420 230" role="img" aria-label="A sacred bark carried on poles by priests, with the shrine that hides the god’s statue">
  <rect width="420" height="230" fill="#f3ead6"/><rect y="207" width="420" height="23" fill="#e3d2ac"/>
  <path d="M60 108h300" stroke="#8b6a3e" stroke-width="6"/><path d="M60 122h300" stroke="#8b6a3e" stroke-width="6"/>
  <path d="M70 96C120 112 300 112 350 96L340 84C290 98 130 98 80 84Z" fill="#d6a84e" stroke="#5d4a2c" stroke-width="2"/>
  <circle cx="74" cy="80" r="10" fill="#d6a84e" stroke="#5d4a2c" stroke-width="2"/><circle cx="346" cy="80" r="10" fill="#d6a84e" stroke="#5d4a2c" stroke-width="2"/>
  <rect x="180" y="52" width="60" height="40" fill="#f4f1e6" stroke="#5d4a2c" stroke-width="2"/><path d="M174 52h72l-6-10h-60Z" fill="#c9a46a" stroke="#5d4a2c"/>
  ${[100, 145, 190, 235, 280, 325].map(man).join('')}
  <text x="210" y="30" text-anchor="middle" class="bs-map-m">shrine: the statue is hidden inside</text><path d="M210 34v8" stroke="#5d4a2c"/>
  <text x="14" y="56" class="bs-map-m">ram head</text><text x="410" y="140" text-anchor="end" class="bs-map-m">carrying poles</text><text x="210" y="225" text-anchor="middle" class="bs-map-l">priests</text></svg>`;
}
function bsPuritySvg() {
  // A priest made pure: numbers match the list "Every day on duty".
  const m = (n, x, y, tx, ty) => `<path d="M${x} ${y}L${tx} ${ty}" stroke="#26302a" stroke-width="1.5"/><rect x="${x - 12}" y="${y - 12}" width="24" height="24" rx="3" fill="#26302a"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" style="font:700 13px system-ui,sans-serif;fill:#fff">${n}</text>`;
  return `<svg viewBox="0 0 360 300" role="img" aria-label="A shaven priest in white linen, with water poured over him">
  <rect width="360" height="300" fill="#f3ead6"/><rect y="280" width="360" height="20" fill="#e3d2ac"/>
  <g transform="translate(-6 22) rotate(38 132 30)"><path d="M118 12h28l4 10v20c0 7-7 11-18 11s-18-4-18-11V22Z" fill="#a5834f" stroke="#5d4a2c" stroke-width="2"/></g>
  <g fill="none" stroke="#5f9fc4" stroke-width="3" stroke-linecap="round"><path d="M146 60Q166 52 174 54" stroke-dasharray="5 4"/><path d="M148 66Q172 58 184 54" stroke-dasharray="5 4"/></g>
  <circle cx="180" cy="74" r="22" fill="#b07a4f"/><circle cx="189" cy="70" r="2.2" fill="#26302a"/><path d="M190 84h9" stroke="#5d3b22" stroke-width="2" stroke-linecap="round"/><circle cx="170" cy="74" r="4" fill="#9c6a43"/>
  <path d="M172 94h16v8h-16Z" fill="#b07a4f"/><path d="M156 102h48l6 42h-60Z" fill="#b07a4f"/>
  <path d="M158 108l-14 38M202 108l14 38" stroke="#b07a4f" stroke-width="10" stroke-linecap="round"/>
  <path d="M152 142h56l16 122h-88Z" fill="#fbfaf4" stroke="#c9b48a" stroke-width="2"/><path d="M168 150l-8 110M180 150v110M192 150l8 110" stroke="#e6dcc4" stroke-width="1.5"/>
  <path d="M168 264v14M192 264v14" stroke="#b07a4f" stroke-width="8"/><path d="M156 280h20M184 280h22" stroke="#c9a46a" stroke-width="5" stroke-linecap="round"/>
  ${m(1, 250, 46, 198, 60)}${m(2, 86, 88, 128, 70)}${m(3, 250, 100, 200, 84)}${m(4, 264, 210, 220, 210)}</svg>`;
}
function bsWomenSvg() {
  // Three roles of women in Amun's temple; numbers match the cards.
  const fig = (x, extra) => `<path d="M${x - 15} 92q0-20 17-19q10 1 9 9l-14 6v28h-12Z" fill="#26302a"/><circle cx="${x + 3}" cy="96" r="12" fill="#b07a4f"/><circle cx="${x + 9}" cy="93" r="1.8" fill="#26302a"/><path d="M${x - 12} 112h24l12 128h-48Z" fill="#fbfaf4" stroke="#c9b48a" stroke-width="2"/>${extra}`;
  const m = (n, x) => `<rect x="${x - 12}" y="258" width="24" height="24" rx="3" fill="#26302a"/><text x="${x}" y="274.5" text-anchor="middle" style="font:700 13px system-ui,sans-serif;fill:#fff">${n}</text>`;
  return `<svg viewBox="0 0 420 290" role="img" aria-label="Three women serving in the temple: a God’s Wife with a tall crown, a singer with a rattle, and a dancer">
  <rect width="420" height="290" fill="#f3ead6"/><rect y="244" width="420" height="46" fill="#e3d2ac"/>
  ${fig(80, `<path d="M72 82l4-38h8l4 38Z" fill="#c9a46a" stroke="#5d4a2c"/><path d="M80 44v-30M86 44v-28" stroke="#5d4a2c" stroke-width="3"/><path d="M92 128l26 8" stroke="#b07a4f" stroke-width="7" stroke-linecap="round"/><circle cx="122" cy="137" r="5" fill="#e2b84a"/>`)}
  ${fig(210, `<path d="M222 126l18-26" stroke="#b07a4f" stroke-width="7" stroke-linecap="round"/><path d="M240 100v-26" stroke="#8b6a3e" stroke-width="3"/><path d="M232 74q8-18 16 0v14h-16Z" fill="none" stroke="#c9a46a" stroke-width="4"/><path d="M233 80h14M233 86h14" stroke="#8b6a3e" stroke-width="2"/>`)}
  <g transform="rotate(-18 340 170)">${fig(340, `<path d="M330 122l-24-30M350 122l26-28" stroke="#b07a4f" stroke-width="7" stroke-linecap="round"/>`)}</g>
  ${m(1, 80)}${m(2, 210)}${m(3, 340)}</svg>`;
}
function bsRituals() {
  const f = bsData(), r = f.rituals, l = f.life, pu = r.purity, wo = r.women, y = r.year, p = r.processions, w = r.walls;
  BS_STEPPERS.shrine = l.ritual.steps.map((t, i) => ({ label: ['Enter', 'Open', 'Greet', 'Dress', 'Feed', 'Leave'][i] || String(i + 1), text: t, layers: [['light', 'closed', 'torch', 'stand'], ['light', 'open', 'stand'], ['light', 'open', 'kneel'], ['light', 'open', 'cloth', 'stand'], ['light', 'open', 'cloth', 'table', 'kneel'], ['closed', 'sweep']][i] || [] }));
  const goLink = s => s.link ? `<a class="mu-stop" href="${esc(s.link)}">${s.link.startsWith('#hall/') ? 'Go to the stop →' : 'More about this place →'}</a>` : '';
  const scene = s => { const m = s.mediaId && media[s.mediaId]; return `<article class="rt-scene">${m ? `<button class="rt-scene-img" data-zoom="${esc(m.id)}" aria-label="Enlarge image: ${esc(m.caption)}"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" loading="lazy"></button>` : ''}<div><span class="micro">${esc(s.where)}</span><h3>${esc(s.title)}</h3><p>${fmt(s.text)}</p>${goLink(s)}${m ? credit(m) : ''}${s.citations ? sourcesBlock(s.citations) : ''}</div></article>`; };
  const stations = ['central-bark-shrine', 'red-chapel', 'amenhotep-i-calcite', 'sety-ii-shrine', 'ramesses-iii-temple', 'hakoris-chapel'].filter(id => records[id]);
  return `${bsHead('Rituals and festivals', r.intro)}<section class="section bs" style="padding-top:0">
  <div class="rt-rhythms">${r.rhythms.map(x => `<a class="rt-rhythm" href="#" data-scroll="rt-${esc(x.id)}"><b>${esc(x.label)}</b><span>${esc(x.text)}</span></a>`).join('')}</div>
  <div class="bs-sec" id="rt-day"><div class="bs-sec-text"><h2>${esc(r.daily.heading)}</h2>${r.daily.text.map(t => `<p>${fmt(t)}</p>`).join('')}<ol class="rt-services">${r.daily.services.map(s => `<li><b>${esc(s.label)}</b> · ${esc(s.time)}<br><span>${esc(s.text)}</span></li>`).join('')}</ol><p>${fmt(l.ritual.note)}</p><p>${fmt(r.daily.after)}</p>${sourcesBlock(r.daily.citations)}</div>
  <div class="bs-sec-art"><figure class="bs-draw">${bsDayClockSvg(r.daily.services)}<figcaption class="micro">Original schematic, not a clock: the times are approximate.</figcaption></figure>${bsStepper('shrine', bsShrineSvg(), BS_STEPPERS.shrine)}</div></div>
  <div class="bs-sec" id="rt-pure"><div class="bs-sec-text"><h2>${esc(pu.heading)}</h2><p>${fmt(pu.intro)}</p><div class="rt-pure">${pu.groups.map(g => `<div class="rt-pure-g"><h3>${esc(g.label)}</h3><${g.numbered ? 'ol' : 'ul'}>${g.items.map((t, i) => `<li>${g.numbered ? `<span class="rt-n">${i + 1}</span>` : ''}<span>${fmt(t)}</span></li>`).join('')}</${g.numbered ? 'ol' : 'ul'}>${sourcesBlock(g.citations)}</div>`).join('')}</div><p>${fmt(pu.oil)}</p>${sourcesBlock(pu.oilCitations)}<p class="micro">${fmt(pu.note)}</p></div>
  <div class="bs-sec-art"><figure class="bs-draw">${bsPuritySvg()}<figcaption class="micro">Original drawing. The numbers match the list “Every day on duty”.</figcaption></figure><div class="rt-pure-links"><p>${fmt(pu.lake)} <a class="mu-stop" href="#entry/sacred-lake">More about this place →</a></p><p>${fmt(pu.wall)} <a class="mu-stop" href="#hall/purification">Go to the stop →</a></p></div></div></div>
  <div class="bs-sec" id="rt-women"><div class="bs-sec-text"><h2>${esc(wo.heading)}</h2><p>${fmt(wo.intro)}</p><div class="rt-women">${wo.roles.map((x, i) => `<article class="rt-woman"><span class="rt-n">${i + 1}</span><div><h3>${esc(x.name)}</h3><p>${fmt(x.text)}</p>${sourcesBlock(x.citations)}</div></article>`).join('')}</div><p class="micro">${fmt(wo.note)}</p>${sourcesBlock(wo.noteCitations)}</div>
  <div class="bs-sec-art"><figure class="bs-draw">${bsWomenSvg()}<figcaption class="micro">Original drawing. The numbers match the cards.</figcaption></figure><div class="rt-pure-links"><h3>${esc(wo.see)}</h3>${wo.places.map(x => `<p>${fmt(x.text)}${x.link ? ` <a class="mu-stop" href="${esc(x.link)}">More about this place →</a>` : ''}</p>`).join('')}<h3>${esc(wo.photos)}</h3><ul class="rt-ext">${wo.external.map(x => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.text)} ↗</a></li>`).join('')}</ul></div></div></div>
  <div class="bs-sec" id="rt-month"><div class="bs-sec-text"><h2>${esc(r.monthly.heading)}</h2>${r.monthly.text.map(t => `<p>${fmt(t)}</p>`).join('')}${sourcesBlock(r.monthly.citations)}</div><div class="bs-sec-art">${bsFig('basics-bark-shrine-relief', 'The king before Amun, on the granite boat shrine at the heart of the temple.')}</div></div>
  <div class="bs-sec" id="rt-year"><div class="bs-sec-text"><h2>${esc(y.heading)}</h2><p>${fmt(y.intro)}</p><div class="rt-fests">${y.festivals.map((x, i) => `<article class="rt-fest" id="fest-${esc(x.id)}" style="--c:${BS_FEST_COL[x.id] || '#5d4a2c'}"><span class="rt-num">${i + 1}</span><div><h3>${esc(x.name)}</h3><span class="micro">${esc(x.when)}</span><p>${fmt(x.text)}</p>${sourcesBlock(x.citations)}</div></article>`).join('')}</div></div>
  <div class="bs-sec-art"><figure class="bs-draw">${bsYearWheelSvg(y)}<figcaption class="micro">Original schematic of the civil year. Tap a number to read about the festival. Festival positions follow the ancient calendar dates; the new-moon festivals moved from year to year.</figcaption></figure></div></div>
  <div class="bs-sec" id="rt-reign"><div class="bs-sec-text"><h2>${esc(r.jubilee.heading)}</h2>${r.jubilee.text.map(t => `<p>${fmt(t)}</p>`).join('')}${sourcesBlock(r.jubilee.citations)}<p><a class="mu-stop" href="#read/sign/hebsed">The jubilee sign in Read the walls →</a></p></div><div class="bs-sec-art">${bsFig('white-chapel-heh', 'The god Heh, “millions”, on Senusret I’s jubilee chapel.')}</div></div>
  <div class="bs-sec" id="rt-proc"><div class="bs-sec-text"><h2>${esc(p.heading)}</h2>${p.text.map(t => `<p>${fmt(t)}</p>`).join('')}<div class="rt-legend">${p.routes.map(x => `<button data-rt="${esc(x.id)}" class="rt-key rt-key-${esc(x.id)}"><b>${esc(x.name)}</b><span>${esc(x.text)}</span></button>`).join('')}</div>${sourcesBlock(p.citations)}
  <h3 style="margin-top:22px">${esc(p.stations)}</h3><ul class="rt-stations">${stations.map(id => `<li><a href="#entry/${esc(id)}">${esc(records[id].title)} →</a></li>`).join('')}</ul></div>
  <div class="bs-sec-art"><figure class="bs-draw">${bsRoutesSvg()}<figcaption class="micro">Original schematic map, not to scale. Tap a festival to highlight its route; routes changed over the centuries.</figcaption></figure><figure class="bs-draw">${bsBarkSvg()}<figcaption class="micro">Original drawing. Barks differed for each god: Amun’s has ram heads.</figcaption></figure></div></div>
  <div id="rt-walls"><h2>${esc(w.heading)}</h2><p class="micro" style="max-width:720px">${fmt(w.intro)}</p><div class="rt-scenes">${w.scenes.map(scene).join('')}</div></div>
  <div class="mu-sec"><div><h2>${esc(l.estate.heading)}</h2>${l.estate.text.map(t => `<p>${fmt(t)}</p>`).join('')}${sourcesBlock(l.estate.citations)}</div></div></section>`;
}
function basicsRoute(sub, arg) {
  if (!bsData()) return '<div class="page-head"><h1>This section is not in this build.</h1></div>';
  if (sub === 'plan') return bsPlanPage(arg) + bsRelated('plan');
  const fn = { timeline: bsTimeline, gods: bsGods, building: bsBuilding, thebes: bsThebes, life: bsRituals, rituals: bsRituals, after: bsAfter }[sub];
  return fn ? fn() + bsRelated(sub === 'life' ? 'rituals' : sub) : bsHome();
}
function basicsAfterRender() {
  if (document.querySelector('.bp-svg-wrap')) bsRenderPlan();
  if (document.querySelector('.tl2')) bsTimelineWatch();
  document.querySelectorAll('.bs-stepper').forEach(b => bsSetStep(b, 0));
  if (document.querySelector('.bsm')) { bsMapPanel(); setTimeout(bsMapDraw, 30); }
}
function basicsInteract(e) {
  const t = e.target;
  const bn = t.closest('[data-bsnode]'); if (bn) { bsMapSelect(bn.dataset.bsnode); return true; }
  const mv = t.closest('[data-bp-move]'); if (mv) { bsState.step = Math.max(0, Math.min(bsData().growth.steps.length, bsState.step + +mv.dataset.bpMove)); bsRenderPlan(); return true; }
  const sp = t.closest('[data-bp-step]'); if (sp) { bsState.step = +sp.dataset.bpStep; bsRenderPlan(); if (sp.classList.contains('bp-go')) document.querySelector('.bp-stage')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return true; }
  const jp = t.closest('[data-bp-jump]'); if (jp) { bsState.step = +jp.dataset.bpJump; bsRenderPlan(); document.querySelector('.bp-stage')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return true; }
  const v = t.closest('[data-bp-view]'); if (v) { bsState.view = v.dataset.bpView; bsRenderPlan(); return true; }
  const el = t.closest('[data-el]'); if (el) { bsInfo(el.dataset.el); return true; }
  const rt = t.closest('[data-rt]'); if (rt) { const svg = document.querySelector('.rt-svg'); const on = svg.dataset.route === rt.dataset.rt; svg.dataset.route = on ? '' : rt.dataset.rt; document.querySelectorAll('[data-rt]').forEach(b => b.classList.toggle('on', !on && b === rt)); return true; }
  const st = t.closest('[data-bsstep]'); if (st) { bsSetStep(st.closest('.bs-stepper'), +st.dataset.bsstep); return true; }
  return false;
}
function basicsInput(e) {
  if (e.target.matches('[data-bp-lost]')) { bsState.lost = e.target.checked; bsRenderPlan(); }
}

// ---------- Connection map (big picture home) and "How this connects" strips ----------
const bsMapState = { sel: '' };
function bsConn() { return bsData()?.connections; }
function bsPageOf(id) { return bsData().pages.find(p => p.id === id); }
function bsHrefOf(id) { const p = bsPageOf(id); return p ? (p.link || '#basics/' + p.id) : '#basics'; }
function bsLinksOf(id) { const c = bsConn(); return c ? c.links.filter(l => l.a === id || l.b === id).map(l => ({ other: l.a === id ? l.b : l.a, text: l.text })) : []; }
function bsGroupOf(id) { return bsConn()?.groups.find(g => g.pages.includes(id)); }
function bsMap() {
  const c = bsConn(); if (!c) return '';
  const node = id => { const p = bsPageOf(id), g = bsGroupOf(id); return p ? `<button class="bsm-node" data-bsnode="${esc(id)}" style="--c:${g.colour}" aria-pressed="false">${bsIcon(id)}<b>${esc(p.title)}</b></button>` : ''; };
  const group = g => `<div class="bsm-group" style="--c:${g.colour}"><span class="bsm-glabel">${esc(g.label)}</span><div class="bsm-gnodes">${g.pages.map(node).join('')}</div></div>`;
  const [g1, g2, g3, g4] = c.groups;
  return `<section class="section bsm-wrap" style="padding-top:0"><p class="bsm-intro">${esc(c.intro)}</p>
  <div class="bsm"><svg class="bsm-lines" aria-hidden="true"></svg>
   <div class="bsm-row">${group(g1)}${group(g2)}</div>
   <div class="bsm-centre"><span>${esc(c.centre)}</span></div>
   <div class="bsm-row bsm-low">${group(g3)}${group(g4)}</div></div>
  <div class="bsm-panel" aria-live="polite"></div></section>`;
}
function bsMapPanel() {
  const panel = document.querySelector('.bsm-panel'); if (!panel) return;
  const id = bsMapState.sel, p = id && bsPageOf(id);
  if (!p) { panel.innerHTML = ''; return; }
  const g = bsGroupOf(id);
  panel.innerHTML = `<div class="bsm-card" style="--c:${g.colour}"><span class="eyebrow">${esc(g.label)}</span><h3>${bsIcon(id, 'bs-ico bs-ico-lg')}${esc(p.title)}</h3><p>${esc(p.teaser)}</p><a class="mu-stop" href="${bsHrefOf(id)}">Open the page →</a>
   <h4>How this connects</h4><ul class="bsm-links">${bsLinksOf(id).map(l => `<li><button data-bsnode="${esc(l.other)}" style="--c:${bsGroupOf(l.other).colour}">${bsIcon(l.other)}<b>${esc(bsPageOf(l.other).title)}</b></button><span>${esc(l.text)}</span></li>`).join('')}</ul></div>`;
}
function bsMapDraw() {
  const wrap = document.querySelector('.bsm'); if (!wrap || typeof wrap.querySelector !== 'function' || typeof wrap.getBoundingClientRect !== 'function') return; const svg = wrap.querySelector('.bsm-lines'); if (!svg) return;
  const box = wrap.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  const mid = el => { const r = el.getBoundingClientRect(); return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2, r]; };
  const centre = wrap.querySelector('.bsm-centre span'), sel = bsMapState.sel;
  const nodes = [...wrap.querySelectorAll('.bsm-node')];
  nodes.forEach(n => { const on = n.dataset.bsnode === sel, rel = sel && bsLinksOf(sel).some(l => l.other === n.dataset.bsnode); n.classList.toggle('on', on); n.classList.toggle('rel', !!rel); n.classList.toggle('dim', !!sel && !on && !rel); n.setAttribute('aria-pressed', on); });
  const c = mid(centre), band = c[1];
  const anchor = el => { const [x, y, r] = mid(el); return [x, y < band ? r.bottom - box.top : r.top - box.top]; };
  const curve = (a, b) => `M${a[0]} ${a[1]}C${a[0]} ${band},${b[0]} ${band},${b[0]} ${b[1]}`;
  let out = '';
  if (innerWidth <= 700) {
    const bow = (a, b) => { const dx = Math.max(36, Math.abs(a[1] - b[1]) * .25), side = a[0] < box.width / 2 ? -1 : 1; return `M${a[0]} ${a[1]}C${a[0] + side * dx} ${a[1]},${b[0] + side * dx} ${b[1]},${b[0]} ${b[1]}`; };
    if (!sel) { const last = mid(nodes[nodes.length - 1]); out = `<path class="bsm-spoke" d="M${c[0]} ${c[1]}V${last[1]}"/>`; }
    else { const s = wrap.querySelector(`.bsm-node[data-bsnode="${sel}"]`); if (s) { const a = mid(s); out = bsLinksOf(sel).map(l => { const t = wrap.querySelector(`.bsm-node[data-bsnode="${l.other}"]`); return t ? `<path class="bsm-link" style="stroke:${bsGroupOf(l.other).colour}" d="${bow(a, mid(t))}"/>` : ''; }).join(''); } }
  } else {
    if (!sel) out = nodes.map(n => { const a = anchor(n); return `<path class="bsm-spoke" d="M${a[0]} ${a[1]}C${a[0]} ${band},${c[0]} ${band},${c[0]} ${band}"/>`; }).join('');
    else { const s = wrap.querySelector(`.bsm-node[data-bsnode="${sel}"]`); if (s) { const a = anchor(s); out = bsLinksOf(sel).map(l => { const t = wrap.querySelector(`.bsm-node[data-bsnode="${l.other}"]`); return t ? `<path class="bsm-link" style="stroke:${bsGroupOf(l.other).colour}" d="${curve(a, anchor(t))}"/>` : ''; }).join(''); } }
  }
  svg.innerHTML = out;
}
function bsMapSelect(id) { bsMapState.sel = bsMapState.sel === id ? '' : id; bsMapPanel(); bsMapDraw(); if (bsMapState.sel && innerWidth <= 700) document.querySelector('.bsm-card')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
function bsRelated(id) {
  const ls = bsLinksOf(id); if (!ls.length) return '';
  return `<section class="section bs-related" style="padding-top:10px"><h2>How this connects</h2><div class="bsr-grid">${ls.map(l => { const p = bsPageOf(l.other), g = bsGroupOf(l.other); return p ? `<a class="bsr-card" href="${bsHrefOf(l.other)}" style="--c:${g.colour}"><span class="bsr-top">${bsIcon(l.other)}<span class="eyebrow">${esc(g.label)}</span></span><b>${esc(p.title)}</b><span>${esc(l.text)}</span></a>` : ''; }).join('')}</div><p class="micro"><a href="#basics" style="text-decoration:underline">See how all the big-picture topics fit together</a></p></section>`;
}
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('resize', () => { if (document.querySelector('.bsm')) bsMapDraw(); });

// ---------- Small Egyptian-style topic icons (original line drawings) ----------
const BS_ICONS = {
  timeline: '<rect x="7" y="2.5" width="10" height="17" rx="5"/><path d="M5.5 21.5h13M12 6.5v2M10 10.5h4M12 12.5v3"/>',
  plan: '<path d="M2.5 21V7l6-2v16M21.5 21V7l-6-2v16M8.5 21v-7h7v7M2 21h20M8.5 9h7"/>',
  gods: '<circle cx="12" cy="6" r="3.2"/><path d="M12 9.2V22M6.5 12.5h11"/>',
  universe: '<circle cx="12" cy="9.5" r="3.5"/><path d="M2 20h20M3.5 20 8 13.5M20.5 20 16 13.5M12 3V1.5M5.5 9.5H4M20 9.5h-1.5"/>',
  building: '<path d="M10 21V5.5L12 2l2 3.5V21M7 21h10M8 17.5h8"/><path d="M5 21l-2.5 1M19 21l2.5 1" opacity=".6"/>',
  rituals: '<path d="M2.5 15c3 3.5 16 3.5 19 0M2.5 15 1.5 11.5M21.5 15l1-3.5M9 14.5V10h6v4.5M12 10V7"/><circle cx="12" cy="5.5" r="1.5"/>',
  thebes: '<path d="M2 18c2-1.5 4 1.5 6 0s4 1.5 6 0 4 1.5 6 0M12 15V6M12 6c-2.5-1-4-3-4.5-4.5M12 6c2.5-1 4-3 4.5-4.5M12 6V2"/>',
  after: '<path d="M7 21V9.5l2-1.5M11 21v-7M15 21V7l2-1.5V21M3 21h18M9.5 14l3-1.5"/><path d="M13 4.5h4M12.5 3h5" opacity=".6"/>'
};
function bsIcon(id, cls = 'bs-ico') { const p = BS_ICONS[id]; return p ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>` : ''; }
