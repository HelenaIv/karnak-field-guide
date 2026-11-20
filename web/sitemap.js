// "Explore places": one interactive map of the precinct of Amun that links every place entry.
// Uses the plan geometry from basics.js (BS_GEO). Positions of small monuments outside that plan are approximate.
const SM_AREAS = [
  ['western-entrance', '#b07a2e'], ['western-interior', '#8a5a2b'], ['central-temple', '#b5452c'], ['eastern-temple', '#7a5c99'],
  ['southern-axis', '#2e7048'], ['southern-ancillary', '#3f6fb0'], ['southwestern-temples', '#2f7f8f'], ['open-air-museum', '#c0587e'],
  ['northern-temples', '#8a9a2b'], ['northeastern-osiris', '#5d4a2c'], ['mut-precinct', '#9a4f6b']];
const SM_COL = Object.fromEntries(SM_AREAS);
const SM_GEO = {
  'first-pylon': ['pylon1'], 'great-court': ['great-court'], 'second-pylon': ['pylon2'], 'hypostyle-hall': ['hypostyle'], 'third-pylon': ['pylon3'],
  'fourth-pylon': ['pylon4'], 'wadjet-hall': ['wadjet'], 'fifth-pylon': ['pylon5'], 'sixth-pylon': ['pylon6'], 'central-bark-shrine': ['philip-shrine'],
  'middle-kingdom-court': ['mk-temple'], 'akhmenu': ['akhmenu'], 'contra-temple': ['contra'], 'seventh-pylon': ['pylon7'], 'eighth-pylon': ['pylon8'],
  'ninth-pylon': ['pylon9'], 'tenth-pylon': ['pylon10'], 'sacred-lake': ['lake'], 'khonsu-temple': ['khonsu'], 'opet-temple': ['opet'],
  'bab-el-amara': ['bab-el-amara'], 'ramesses-iii-temple': ['r3-temple'], 'sety-ii-shrine': ['sety2-shrine'], 'taharqo-kiosk': ['kiosk'],
  'bubastite-portal': ['bubastite'], 'hatshepsut-obelisks': ['hat-obelisks'], 'aten-temples': ['gem-pa-aten']
};
// Approximate shapes for places that the plan does not draw (x, y, w, h); flagged as approximate on the map.
const SM_APPROX = {
  'open-air-museum': [20, -136, 60, 44], 'red-chapel': [24, -132, 22, 14], 'white-chapel': [52, -132, 16, 14], 'amenhotep-i-calcite': [24, -110, 16, 12], 'thutmose-iv-peristyle': [48, -110, 28, 14],
  'ptah-temple': [262, -228, 34, 18], 'osiris-sector': [420, -200, 54, 44], 'osiris-catacombs': [430, -190, 34, 24], 'hakoris-chapel': [-40, -16, 12, 10]
};
const smState = { area: '', sel: '', view: 'whole' };
// Small monuments covered as sections of a bigger place's article: [parent place, section id].
const SM_IN = { 'sety-ii-shrine': ['great-court', 'shrines'], 'taharqo-kiosk': ['great-court', 'kiosk'], 'ramesses-iii-temple': ['great-court', 'shrines'], 'bubastite-portal': ['great-court', 'portal'], 'hakoris-chapel': ['first-pylon', 'hakoris'],
  'fourth-pylon': ['temple-core', 'fourth'], 'wadjet-hall': ['temple-core', 'wadjet'], 'hatshepsut-obelisks': ['temple-core', null], 'fifth-pylon': ['temple-core', 'pylons'],
  'sixth-pylon': ['temple-core', 'pylons'], 'central-bark-shrine': ['temple-core', 'shrine'], 'middle-kingdom-court': ['temple-core', 'mk'],
  'seventh-pylon': ['southern-axis', 'seventh'], 'eighth-pylon': ['southern-axis', 'eighth'], 'ninth-pylon': ['southern-axis', 'ninth'], 'tenth-pylon': ['southern-axis', 'tenth'],
  'white-chapel': ['open-air-museum', 'white'], 'amenhotep-i-calcite': ['open-air-museum', 'calcite'], 'red-chapel': ['open-air-museum', 'red'], 'thutmose-iv-peristyle': ['open-air-museum', 'peristyle'], 'osiris-catacombs': ['osiris-sector', 'coptite'],
  'opet-temple': ['khonsu-temple', 'opet'], 'bab-el-amara': ['khonsu-temple', 'gate'] };
// [parent, null] = shown under the parent but has its own article.
// Places whose full article lives on another route.
const SM_LINK = { 'hypostyle-hall': '#hall' };
function smHref(id) { return SM_IN[id]?.[1] ? `#entry/${SM_IN[id][0]}/${SM_IN[id][1]}` : (SM_LINK[id] || `#entry/${id}`); }
function smKids(id) { return SM_WALK.filter(k => SM_IN[k]?.[0] === id); }
const SM_WALK = ['first-pylon', 'hakoris-chapel', 'great-court', 'sety-ii-shrine', 'taharqo-kiosk', 'ramesses-iii-temple', 'bubastite-portal', 'second-pylon', 'hypostyle-hall', 'third-pylon', 'temple-core',
  'fourth-pylon', 'wadjet-hall', 'hatshepsut-obelisks', 'fifth-pylon', 'sixth-pylon', 'central-bark-shrine', 'middle-kingdom-court', 'akhmenu', 'contra-temple', 'aten-temples',
  'southern-axis', 'seventh-pylon', 'eighth-pylon', 'ninth-pylon', 'tenth-pylon', 'sacred-lake', 'khonsu-temple', 'opet-temple', 'bab-el-amara', 'open-air-museum', 'white-chapel', 'amenhotep-i-calcite', 'red-chapel', 'thutmose-iv-peristyle', 'osiris-sector', 'osiris-catacombs'];
function smPlaces() { const order = SM_AREAS.map(a => a[0]), w = id => { const i = SM_WALK.indexOf(id); return i < 0 ? 99 : i; }; return [...D.places].sort((a, b) => (order.indexOf(a.area) - order.indexOf(b.area)) || (w(a.id) - w(b.id)) || a.title.localeCompare(b.title)); }
function smNum(id) { if (SM_IN[id]) { const par = SM_IN[id][0]; return smNum(par) + 'abcdefghij'[smKids(par).indexOf(id)]; } return smPlaces().filter(p => !SM_IN[p.id]).findIndex(p => p.id === id) + 1; }
function smShape(p) {
  const c = SM_COL[p.area] || '#888';
  const inner = SM_GEO[p.id] ? SM_GEO[p.id].map(g => BS_GEO[g] ? BS_GEO[g]() : '').join('')
    : SM_APPROX[p.id] ? (() => { const [x, y, w, h] = SM_APPROX[p.id]; return `<rect class="s fill approx" x="${x}" y="${y}" width="${w}" height="${h}"/>`; })() : '';
  return inner ? `<g class="sm-pl" data-sm="${esc(p.id)}" data-area="${esc(p.area)}" style="--c:${c}" tabindex="0" role="button" aria-label="${esc(p.title)}">${inner}</g>` : '';
}
function smSvg(cls = '') {
  const ps = smPlaces();
  const zone = (x, y, w, h, t) => `<g class="sm-zone"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><text x="${x + w / 2}" y="${y - 4}">${t}</text></g>`;
  return `<svg viewBox="${BS_VIEWS.whole}" class="sm-svg ${cls}" role="img" aria-label="Map of the precinct of Amun at Karnak, west on the left">
  <rect x="-60" y="-285" width="750" height="670" class="bp-ground"/>
  <path class="sm-wall" d="M-2 -232L515 -262L532 350L-2 300Z"/><path class="bp-axis" d="M-60 0H560M197 40V385"/>
  <rect class="sm-water" x="-60" y="-285" width="20" height="670"/>
  ${zone(16, -146, 66, 50, 'Open Air Museum')}
  ${ps.map(smShape).join('')}
  <g class="sm-labels"><text x="-52" y="-150">Nile side</text><text x="200" y="378" text-anchor="middle">↓ to Mut and Luxor</text><text x="610" y="-75" text-anchor="middle">outside the wall</text><text x="270" y="-246" text-anchor="middle">north wall</text></g>
  <g class="sm-marks"></g>
  <g class="bp-compass" transform="translate(660 -250)"><path d="M0 -10L4 2H-4Z"/><text y="12">N</text></g></svg>`;
}
function exploreMap() {
  const ps = smPlaces();
  const chips = SM_AREAS.filter(([a]) => ps.some(p => p.area === a)).map(([a, c]) => `<button class="sm-area" data-sm-area="${a}" style="--c:${c}"><i></i>${esc(areaNames[a] || a)}</button>`).join('');
  const groups = SM_AREAS.map(([a, c]) => { const list = ps.filter(p => p.area === a); return list.length ? `<section class="sm-group" data-group="${a}" style="--c:${c}"><h3>${esc(areaNames[a] || a)}</h3><ol>${list.filter(p => !SM_IN[p.id]).map(p => `<li><button class="sm-item" data-sm-pick="${esc(p.id)}"><span class="sm-n">${smNum(p.id)}</span><b>${esc(p.title)}</b></button>${smSub(p.id)}</li>`).join('')}</ol></section>` : ''; }).join('');
  return `<div class="page-head"><span class="eyebrow">Explore Karnak</span><h1>Find your way around.</h1><p>The precinct of Amun on one map. Tap an area to zoom in, then a numbered place to see what it is. Smaller monuments are sections of the bigger place they stand in.</p></div>
  <section class="section sm" style="padding-top:0">
   <div class="sm-stage"><div class="sm-bar"><div class="bp-seg"><button data-sm-view="main">Main temple</button><button data-sm-view="whole">Whole precinct</button></div><span class="sm-where micro"></span></div>
    <div class="sm-wrap">${smSvg()}</div>
    <div class="sm-card" aria-live="polite"><p class="micro">Tap a building or an area on the map.</p></div></div>
   <div class="sm-side"><div class="sm-areas">${chips}</div><div class="sm-list">${groups}</div>
    <p class="micro">Schematic map, not to scale; west is on the left. The temple’s own west–east axis is drawn horizontally. Places marked with a dashed outline are shown in their approximate position only.</p></div>
  </section>`;
}
function smBox(svg, ids) {
  let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
  ids.forEach(id => { const g = svg.querySelector(`[data-sm="${id}"]`); if (!g) return; const b = g.getBBox(); x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height); });
  return x1 > x2 ? null : [x1, y1, x2 - x1, y2 - y1];
}
function smFit(svg, box, pad = 24, minW = 140) {
  if (!box) { svg.setAttribute('viewBox', BS_VIEWS.whole); return; }
  let [x, y, w, h] = box; const cx = x + w / 2, cy = y + h / 2; w = Math.max(w + pad * 2, minW); h = Math.max(h + pad * 2, minW * 0.62);
  const ar = 750 / 670; if (w / h > ar) h = w / ar; else w = h * ar;
  svg.setAttribute('viewBox', `${cx - w / 2} ${cy - h / 2} ${w} ${h}`);
}
function smMarks(svg, ids, scale) {
  const g = svg.querySelector('.sm-marks'); if (!g) return;
  g.innerHTML = ids.map((id, i) => { const b = smBox(svg, [id]); if (!b) return ''; const r = scale, cx = b[0] + b[2] / 2, cy = b[3] > r * 3 ? (i % 2 ? b[1] + b[3] - r * 1.1 : b[1] + r * 1.1) : b[1] + b[3] / 2; return `<g class="sm-mark${SM_IN[id] ? ' sub' : ''}" data-sm="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/><text x="${cx}" y="${cy + r * 0.42}" style="font-size:${r * 1.15}px">${smNum(id)}</text></g>`; }).join('');
}
function smSub(id) {
  const kids = smKids(id).filter(k => records[k]);
  if (kids.length) return `<ol class="sm-sub">${kids.map(k => `<li><button class="sm-item sub" data-sm-pick="${esc(k)}"><span class="sm-n">${smNum(k)}</span><span>${esc(records[k].title)}</span></button></li>`).join('')}</ol>`;
  return '';
}
function smRender() {
  const svg = document.querySelector('.sm .sm-svg'); if (!svg || !svg.getBBox) return;
  const ps = smPlaces(), a = smState.area, inArea = a ? ps.filter(p => p.area === a).map(p => p.id) : [];
  svg.querySelectorAll('.sm-pl').forEach(g => { g.classList.toggle('dim', !!a && g.dataset.area !== a); g.classList.toggle('sel', g.dataset.sm === smState.sel); });
  if (a) smFit(svg, smBox(svg, inArea)); else svg.setAttribute('viewBox', BS_VIEWS[smState.view]);
  const vb = svg.viewBox.baseVal, px = svg.getBoundingClientRect().width || 700; smMarks(svg, a ? inArea : [], 11 * vb.width / px);
  document.querySelectorAll('[data-sm-area]').forEach(b => b.classList.toggle('on', b.dataset.smArea === a));
  document.querySelectorAll('.sm-group').forEach(s => s.classList.toggle('dim', !!a && s.dataset.group !== a));
  document.querySelectorAll('[data-sm-pick]').forEach(b => b.classList.toggle('on', b.dataset.smPick === smState.sel));
  const w = document.querySelector('.sm-where'); if (w) w.textContent = a ? (areaNames[a] || a) : '';
  document.querySelectorAll('[data-sm-view]').forEach(b => b.classList.toggle('on', !a && b.dataset.smView === smState.view));
  const card = document.querySelector('.sm-card'), p = records[smState.sel];
  if (card) card.innerHTML = p ? `<span class="sm-n" style="background:${SM_COL[p.area]}">${smNum(p.id)}</span><div><span class="micro">${esc(areaNames[p.area] || '')}</span>${SM_APPROX[p.id] ? ' <span class="micro">· </span><span class="micro">position approximate</span>' : ''}<h3>${esc(p.title)}</h3><p>${esc(p.summary || '')}</p><a class="mu-stop" href="${smHref(p.id)}">${SM_IN[p.id]?.[1] ? 'Open its section in ' + esc(records[SM_IN[p.id][0]].title) + ' →' : 'Open the page →'}</a></div>`
    : a ? smAreaCard(a, ps.filter(p => p.area === a)) : `<p class="micro">Tap a building or an area on the map.</p>`;
  // A place with no shape on this map (e.g. the precinct of Mut, south of the drawing): say where it is.
  if (card && p && p.orientation && ![p.id, ...smKids(p.id)].some(k => svg.querySelector(`[data-sm="${k}"]`))) card.querySelector('div')?.insertAdjacentHTML('beforeend', `<div class="micro sm-off"><span>Outside this map.</span> ${esc(p.orientation)}</div>`);
}
// Area chosen but no place yet: name the area and list its places, so there is always a next step.
function smAreaCard(a, list) {
  const top = list.filter(p => !SM_IN[p.id]);
  return `<span class="sm-n" style="background:${SM_COL[a]}"></span><div><span class="micro">Area</span><h3>${esc(areaNames[a] || a)}</h3><div class="micro">Tap a number on the map, or choose a place:</div><ul class="sm-arealist">${top.map(p => `<li><button class="sm-item" data-sm-pick="${esc(p.id)}"><span class="sm-n" style="background:${SM_COL[a]}">${smNum(p.id)}</span><b>${esc(p.title)}</b></button></li>`).join('')}</ul></div>`;
}
function smPick(id) { const p = records[id]; if (!p) return; smState.sel = id; smState.area = p.area; smRender(); }
// Small "where is it" map at the top of a place page.
function placeLocator(r) {
  if (!SM_GEO[r.id] && !SM_APPROX[r.id] && r.id !== 'mut-precinct') return '';
  return `<section class="sm-loc"><div class="sm-loc-map" data-loc="${esc(r.id)}">${smSvg('loc')}</div><div><span class="eyebrow">Where it is</span><p>${esc(r.orientation || '')}</p><a class="mu-stop" href="#explore" data-sm-open="${esc(r.id)}">Open the map of Karnak →</a></div></section>`;
}
function sitemapAfterRender() {
  if (document.querySelector('.sm .sm-svg')) smRender();
  const loc = document.querySelector('.sm-loc-map'); if (!loc || !loc.dataset || !loc.querySelector) return;
  const id = loc.dataset.loc, svg = loc.querySelector('svg'); if (!svg?.getBBox) return;
  svg.querySelectorAll('.sm-pl').forEach(g => { g.classList.toggle('dim', g.dataset.sm !== id); g.classList.toggle('sel', g.dataset.sm === id); });
  const b = smBox(svg, [id]);
  if (id === 'mut-precinct') { svg.setAttribute('viewBox', BS_VIEWS.whole); return; }
  if (b) { svg.querySelector('.sm-marks').innerHTML = `<circle class="sm-ping" cx="${b[0] + b[2] / 2}" cy="${b[1] + b[3] / 2}" r="${Math.max(b[2], b[3]) / 2 + 14}"/>`; }
}
function sitemapInteract(e) {
  const t = e.target;
  const o = t.closest('[data-sm-open]'); if (o) { smState.sel = o.dataset.smOpen; smState.area = records[smState.sel]?.area || ''; return false; }
  if (!document.querySelector('.sm .sm-svg')) return false;
  const v = t.closest('[data-sm-view]'); if (v) { smState.view = v.dataset.smView; smState.area = ''; smRender(); return true; }
  const ar = t.closest('[data-sm-area]'); if (ar) { smState.area = ar.dataset.smArea; if (records[smState.sel]?.area !== smState.area) smState.sel = ''; smRender(); return true; }
  const pk = t.closest('[data-sm-pick]'); if (pk) { smPick(pk.dataset.smPick); document.querySelector('.sm-stage')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return true; }
  const sh = t.closest('.sm .sm-pl, .sm .sm-mark'); if (sh) { const id = sh.dataset.sm, p = records[id]; if (!smState.area || smState.area !== p.area) { smState.area = p.area; smState.sel = ''; } else smState.sel = id; smRender(); return true; }
  return false;
}
