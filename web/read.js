'use strict';
// "Read the walls": signs, royal names, phrases, scene rules and practice.
// Loaded before app.js; uses its globals (D, media, sources, esc, credit) and fmt/citeList from hall.js.
const RD = () => D.reading || { signs: { groups: [], signs: [] }, names: { kings: [] }, phrases: { phrases: [] }, scene: { rules: [] }, practice: { items: [] } };
const glyphs = (list, cls = 'glyph') => (list || []).length ? `<span class="${cls}" lang="egy">${list.map(esc).join('')}</span>` : '';
const signById = id => RD().signs.signs.find(s => s.id === id);

function cropBox(p, label) {
  const m = media[p.mediaId]; if (!m || !m.width) return '';
  // Show a wider context window around the sign and outline the sign itself.
  const minW = 38, minH = 38 * m.width / m.height * 0.75;
  let cw = Math.min(100, Math.max(p.w * 2.2, minW)), ch = Math.min(100, Math.max(p.h * 2.2, minH));
  let cx = Math.min(Math.max(p.x + p.w / 2 - cw / 2, 0), 100 - cw), cy = Math.min(Math.max(p.y + p.h / 2 - ch / 2, 0), 100 - ch);
  const ratio = (m.width * cw) / (m.height * ch);
  const sx = cw >= 100 ? 0 : (cx / (100 - cw)) * 100, sy = ch >= 100 ? 0 : (cy / (100 - ch)) * 100;
  const box = `left:${((p.x - cx) / cw * 100).toFixed(1)}%;top:${((p.y - cy) / ch * 100).toFixed(1)}%;width:${(p.w / cw * 100).toFixed(1)}%;height:${(p.h / ch * 100).toFixed(1)}%`;
  return `<figure class="crop-fig"><button class="crop" data-zoom="${esc(m.id)}" aria-label="Enlarge the full photograph: ${esc(m.caption)}" style="aspect-ratio:${ratio.toFixed(3)};background-image:url('${esc(m.webPath)}');background-size:${(10000 / cw).toFixed(1)}% auto;background-position:${sx.toFixed(1)}% ${sy.toFixed(1)}%"><span class="crop-mark" style="${box}"></span></button><figcaption>${label ? esc(label) + ' (outlined) · ' : ''}Detail of a photograph from the Hall. Tap to see the whole image.${credit(m)}</figcaption></figure>`;
}
function readHead(title, intro, back = true) {
  return `${back ? '<div class="reader-top"><a href="#read">← Read the walls</a><span></span></div>' : ''}<div class="page-head read-head"><span class="eyebrow">Read the walls</span><h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ''}</div>`;
}
function sourcesBlock(c) { return (c || []).length ? `<details class="source-note read-src"><summary>Sources</summary><ul>${citeList(c)}</ul></details>` : ''; }
function stopLinks(ids) { const g = hallGuide(); return (ids || []).map(id => { if (id === 'names') return `<a href="#read/names">Royal names →</a>`; const s = g?.stops.find(x => x.id === id); return s ? `<a href="#hall/${esc(s.id)}">See it at stop ${s.number}: ${esc(s.title)} →</a>` : ''; }).filter(Boolean).join(''); }

function readHome() {
  const r = RD(); const starters = ['ankh', 'was', 'djed', 're', 'maat', 'nswt', 'sa', 'neb'].map(signById).filter(Boolean);
  const tiles = [
    ['signs', 'Signs', `${r.signs.signs.length} signs you will see again and again, grouped by what they do.`],
    ['names', 'Royal names', `How to read a cartouche, and how to tell ${r.names.kings.length} kings apart in the Hall.`],
    ['phrases', 'Phrases', `${r.phrases.phrases.length} set phrases that make up most temple texts.`],
    ['scene', 'How a scene works', 'Which way to read, who is speaking, and what is being given.'],
    ['practice', 'Try it', 'Read a real royal name and a real scene from the Hall, step by step.']];
  return `${readHead('Read the walls', 'You do not need to learn a language to read a lot of what is carved here. A few dozen signs, a handful of set phrases and the royal names cover much of what you see in the Hall. Start with the eight signs below.', false)}
  <section class="section" style="padding-top:0"><div class="starter">${starters.map(s => `<a class="sign-tile" href="#read/sign/${esc(s.id)}">${glyphs(s.glyphs)}<b>${esc(s.name)}</b><span>${esc(s.meaning)}</span></a>`).join('')}</div>
  <div class="read-tiles">${tiles.map(([id, t, d]) => `<a class="read-tile" href="#read/${id}"><h2>${t}</h2><p>${esc(d)}</p><span>Open →</span></a>`).join('')}</div></section>`;
}
function signsPage() {
  const r = RD().signs;
  return `${readHead('Signs', 'Tap a sign to see what it means, why it is on the wall and where to find it in the Hall.')}
  <section class="section" style="padding-top:0">${r.groups.map(g => { const list = r.signs.filter(s => s.group === g.id); return list.length ? `<h2 class="group-head">${esc(g.title)}</h2><p class="group-intro">${esc(g.intro)}</p><div class="sign-grid">${list.map(s => `<a class="sign-tile" href="#read/sign/${esc(s.id)}">${glyphs(s.glyphs)}<b>${esc(s.name)}</b><span>${esc(s.meaning)}</span></a>`).join('')}</div>` : ''; }).join('')}</section>`;
}
function signPage(id) {
  const r = RD().signs, s = signById(id); if (!s) return signsPage();
  const i = r.signs.indexOf(s), prev = r.signs[i - 1], next = r.signs[i + 1];
  const grp = r.groups.find(g => g.id === s.group);
  return `<div class="reader-top"><a href="#read/signs">← All signs</a><span>${esc(grp?.title || '')}</span></div>
  <article class="sign-page"><div class="sign-hero">${glyphs(s.glyphs, 'glyph big')}<div><span class="eyebrow">${esc(s.code)} · read “${esc(s.reading)}”</span><h1>${esc(s.name)}</h1><p class="sign-meaning">${esc(s.meaning)}</p></div></div>
  <div class="prose sign-body"><h2>Why it is on the wall</h2><p>${esc(s.why)}</p><h2>Where to see it</h2><p>${esc(s.where)}</p>
  ${s.photo ? cropBox(s.photo, s.name) : ''}<p class="links">${stopLinks(s.stops)}</p>${sourcesBlock(s.citations)}
  <div class="stop-nav">${prev ? `<a href="#read/sign/${esc(prev.id)}" rel="prev">← ${esc(prev.name)}</a>` : '<span></span>'}${next ? `<a href="#read/sign/${esc(next.id)}" rel="next">${esc(next.name)} →</a>` : '<a href="#read/signs">All signs →</a>'}</div></div></article>`;
}
function nameBlock(label, n) {
  return `<div class="name-block"><span class="micro">${label}</span>${n.glyphs?.length ? `<span class="cartouche" lang="egy">${n.glyphs.map(esc).join('')}</span>` : ''}<b>${esc(n.name)}</b><em>“${esc(n.meaning)}”</em><p>${esc(n.look)}</p>${n.glyphsNote ? `<p class="micro">${esc(n.glyphsNote)}</p>` : ''}</div>`;
}
function namesPage() {
  const r = RD().names;
  return `${readHead('Royal names', r.intro)}
  <section class="section" style="padding-top:0"><div class="name-key"><div><span class="glyph" lang="egy">${['M23', 'X1', 'L2', 'X1'].map(c => esc(RD().glyphMap?.[c] || '')).join('')}</span><b>King of Upper and Lower Egypt</b><span>comes before the throne name</span></div><div><span class="glyph" lang="egy">${['G39', 'N5'].map(c => esc(RD().glyphMap?.[c] || '')).join('')}</span><b>Son of Re</b><span>comes before the birth name</span></div></div>
  ${r.kings.map(k => `<article class="king" id="king-${esc(k.id)}"><header><h2>${esc(k.name)}</h2><span class="micro">${esc(k.reign)} · ${esc(k.dynasty)}</span></header><p>${esc(k.role)}</p>
   <div class="name-pair">${nameBlock('Throne name', k.throne)}${nameBlock('Birth name', k.birth)}</div>
   ${k.early ? `<p class="note">${esc(k.early)}</p>` : ''}<p class="spot"><b>How to spot it:</b> ${esc(k.spot)}</p>
   ${k.photo ? cropBox(k.photo, k.name) : ''}<p class="links">${stopLinks((k.stops || []).filter(x => x !== 'names'))}</p>${sourcesBlock(k.citations)}</article>`).join('')}</section>`;
}
function phrasesPage() {
  const r = RD().phrases;
  return `${readHead('Phrases', r.intro)}<section class="section" style="padding-top:0"><div class="phrase-list">${r.phrases.map(p => `<article class="phrase">${glyphs(p.glyphs, 'glyph row')}<div><h2>${esc(p.text)}</h2><span class="micro">${esc(p.translit)}</span><p><b>${esc(p.meaning)}</b> ${esc(p.tells)}</p><p class="micro">${esc(p.where)}</p>${sourcesBlock(p.citations)}</div></article>`).join('')}</div></section>`;
}
function scenePage() {
  const r = RD().scene;
  return `${readHead('How a scene works', 'Eight rules that make any wall in the Hall easier to read.')}<section class="section" style="padding-top:0"><ol class="rules">${r.rules.map(x => `<li><h2>${esc(x.title)}</h2><p>${esc(x.text)}</p>${x.photo ? cropBox(x.photo) : ''}${sourcesBlock(x.citations)}</li>`).join('')}</ol></section>`;
}
function practicePage(id) {
  const items = RD().practice.items; const it = items.find(x => x.id === id) || items[0]; if (!it) return readHome();
  const m = media[it.mediaId];
  return `${readHead('Try it', 'Tap the numbers one by one, then check the answer.')}
  <section class="section practice" style="padding-top:0"><div class="tabs">${items.map(x => `<a href="#read/practice/${esc(x.id)}" class="${x.id === it.id ? 'active' : ''}">${esc(x.title)}</a>`).join('')}</div>
  <h2>${esc(it.title)}</h2><div class="practice-wrap"><div class="ann-wrap"><img src="${esc(m.webPath)}" alt="${esc(m.alt)}">${it.steps.map((s, i) => `<button class="ann tap" data-step="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="Step ${esc(s.label)}">${esc(s.label)}</button>`).join('')}</div>
  <ol class="practice-steps">${it.steps.map((s, i) => `<li data-step="${i}" hidden>${esc(s.text)}</li>`).join('')}</ol>
  <details class="answer"><summary>Show the answer</summary><p>${esc(it.answer)}</p>${it.stop ? `<p class="links">${stopLinks([it.stop])}</p>` : ''}</details>${credit(m)}${sourcesBlock(it.citations)}</div></section>`;
}
function readRoute(arg, sub) {
  if (arg === 'signs') return signsPage();
  if (arg === 'sign') return signPage(sub);
  if (arg === 'names') return namesPage();
  if (arg === 'phrases') return phrasesPage();
  if (arg === 'scene') return scenePage();
  if (arg === 'practice') return practicePage(sub);
  return readHome();
}
function readInteract(e) {
  const b = e.target.closest('.ann.tap'); if (!b) return false;
  const li = document.querySelector(`.practice-steps li[data-step="${b.dataset.step}"]`); if (li) { li.hidden = false; b.classList.add('done'); }
  return true;
}
