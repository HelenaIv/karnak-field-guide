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
  return `<figure class="crop-fig"><button class="crop" data-zoom="${esc(m.id)}" aria-label="Enlarge the full photograph: ${esc(m.caption)}" style="aspect-ratio:${ratio.toFixed(3)};background-image:url('${esc(m.webPath)}');background-size:${(10000 / cw).toFixed(1)}% auto;background-position:${sx.toFixed(1)}% ${sy.toFixed(1)}%"><span class="crop-mark" style="${box}"></span></button><figcaption>${label ? esc(label) + ' (outlined) · ' : ''}Detail of a photograph. Tap to see the whole image.${credit(m)}</figcaption></figure>`;
}
function readHead(title, intro, back = true) {
  return `${back ? '<div class="reader-top"><a href="#read">← Read the walls</a><span></span></div>' : ''}<div class="page-head read-head"><span class="eyebrow">Read the walls</span><h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ''}</div>`;
}
function sourcesBlock(c) { return (c || []).length ? `<details class="source-note read-src"><summary>Sources</summary><ul>${citeList(c)}</ul></details>` : ''; }
function stopLinks(ids) { const g = hallGuide(); return (ids || []).map(id => { if (id === 'names') return `<a href="#read/names">Royal names →</a>`; const s = g?.stops.find(x => x.id === id); return s ? `<a href="#hall/${esc(s.id)}">See it at stop ${s.number}: ${esc(s.title)} →</a>` : ''; }).filter(Boolean).join(''); }

function readHome() {
  const r = RD(); const starters = ['ankh', 'was', 'djed', 'ka', 're', 'maat', 'nswt', 'sa'].map(signById).filter(Boolean);
  const tiles = [
    ['signs', 'Signs', `${r.signs.signs.length} signs you will see again and again, grouped by what they do.`],
    ['names', 'Royal names', `How to read a cartouche, and the names of ${r.names.kings.length} kings you can find at Karnak.`],
    ['phrases', 'Phrases', `${r.phrases.phrases.length} set phrases that make up most temple texts.`],
    ['alphabet', 'The alphabet', 'The 25 one-sound signs, and write your own name in hieroglyphs.'],
    ['columns', 'Columns: layers of names', 'Step through who carved what on the Hall’s columns, over 200 years.'],
    ['scene', 'How a scene works', 'Which way to read, who is speaking, and what is being given.'],
    ['practice', 'Try it', `${RD().practice.items.length} guided exercises on real photos from Karnak.`]];
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
function quads(qs) {
  return (qs || []).map(q => { const n = q.length, big = Math.max(...q.map(r => r.length)); const fs = n > 1 || big > 1 ? Math.max(0.42, 1 / Math.max(n, big) * 1.05) : 1;
    return `<span class="q" style="font-size:${fs.toFixed(2)}em">${q.map(r => `<span class="qr">${r.map(esc).join('')}</span>`).join('')}</span>`; }).join('');
}
function cartouche(n) { return n.quads?.length ? `<span class="cartouche" lang="egy" role="img" aria-label="Cartouche: ${esc(n.name)}">${quads(n.quads)}</span>` : (n.glyphs?.length ? `<span class="cartouche" lang="egy">${n.glyphs.map(esc).join('')}</span>` : '<span class="micro">No standard printed spelling available</span>'); }
function nameBlock(label, n) {
  return `<div class="name-block"><span class="micro">${label}</span>${cartouche(n)}<b>${esc(n.name)}</b><em>“${esc(n.meaning)}”</em>${n.look ? `<p>${esc(n.look)}</p>` : ''}</div>`;
}
function placeLinks(ids) { return (ids || []).map(id => records[id] ? `<a href="#entry/${esc(id)}">${esc(records[id].title)} →</a>` : '').filter(Boolean).join(''); }
function kingCard(k) {
  return `<article class="king" id="king-${esc(k.id)}"><header><h2>${esc(k.name)}</h2><span class="micro">${esc(k.reign)} · ${esc(k.dynasty)}</span></header><p>${esc(k.role)}</p>
   <div class="name-pair">${nameBlock('Throne name', k.throne)}${nameBlock('Birth name', k.birth)}</div>
   ${k.early ? `<p class="note">${esc(k.early)}</p>` : ''}<p class="spot"><b>Where to look:</b> ${esc(k.spot)}</p>
   ${(k.photos || []).length ? `<div class="photo-row">${k.photos.map(p => cropBox(p, p.label)).join('')}</div>` : ''}
   <p class="links">${stopLinks(k.stops)}${placeLinks(k.places)}</p>${sourcesBlock(k.citations)}</article>`;
}
function namesPage() {
  const r = RD().names, hall = r.kings.filter(k => k.inHall), other = r.kings.filter(k => !k.inHall);
  const chips = list => list.map(k => `<a href="#read/names" data-jump="king-${esc(k.id)}">${esc(k.name)}</a>`).join('');
  return `${readHead('Royal names', r.intro)}
  <section class="section" style="padding-top:0"><div class="name-key"><div><span class="glyph" lang="egy">${['M23', 'X1', 'L2', 'X1'].map(c => esc(RD().glyphMap?.[c] || '')).join('')}</span><b>King of Upper and Lower Egypt</b><span>comes before the throne name</span></div><div><span class="glyph" lang="egy">${['G39', 'N5'].map(c => esc(RD().glyphMap?.[c] || '')).join('')}</span><b>Son of Re</b><span>comes before the birth name</span></div></div>
  <nav class="king-index"><b>In the Hypostyle Hall</b>${chips(hall)}<b>Elsewhere at Karnak</b>${chips(other)}</nav>
  <h2 class="group-head">Names in the Hypostyle Hall</h2>${hall.map(kingCard).join('')}
  <h2 class="group-head">Elsewhere at Karnak</h2><p class="group-intro">Kings who built or decorated other parts of the temple, in date order.</p>${other.map(kingCard).join('')}</section>`;
}
function alphabetPage() {
  const a = RD().alphabet; if (!a) return readHome();
  return `${readHead('The alphabet', a.intro)}<section class="section" style="padding-top:0">
  <div class="alpha-grid">${a.letters.map(l => `<div class="alpha"><span class="glyph" lang="egy">${l.glyphs.map(esc).join('')}</span><b>${esc(l.say)}</b><span class="tr">${esc(l.translit)}</span><span class="obj">${esc(l.object)}</span><span class="snd">${esc(l.sound)}</span>${l.note ? `<span class="micro">${esc(l.note)}</span>` : ''}</div>`).join('')}</div>
  ${a.extra.map(l => `<div class="alpha-extra"><span class="glyph" lang="egy">${l.glyphs.map(esc).join('')}</span><p><b>${esc(l.object)} — ${esc(l.say)}.</b> ${esc(l.note)}</p></div>`).join('')}
  <div class="name-tool"><h2>Write a name in hieroglyphs</h2><p class="micro">${esc(a.nameTool.note)}</p><label for="name-input">Your name</label><input id="name-input" type="text" maxlength="24" placeholder="e.g. Helena" autocomplete="off"><div id="name-out" class="name-out" aria-live="polite"></div></div>
  ${sourcesBlock(a.citations)}</section>`;
}
function writeName(v) {
  const a = RD().alphabet, map = a.nameTool.glyphs, s = (v || '').toLowerCase().replace(/[^a-z]/g, ''); const out = [];
  for (let i = 0; i < s.length;) { const two = s.slice(i, i + 2); if (map[two]) { out.push(map[two].join('')); i += 2; } else { if (map[s[i]]) out.push(map[s[i]].join('')); i += 1; } }
  return out.length ? `<span class="cartouche" lang="egy">${out.map(esc).join('')}</span>` : '';
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
  if (arg === 'alphabet') return alphabetPage();
  if (arg === 'columns') return columnsPage();
  if (arg === 'practice') return practicePage(sub);
  return readHome();
}
function readInteract(e) {
  if (columnsInteract(e)) return true;
  const j = e.target.closest('[data-jump]'); if (j) { e.preventDefault(); document.getElementById(j.dataset.jump)?.scrollIntoView({ behavior: 'smooth' }); return true; }
  const b = e.target.closest('.ann.tap'); if (!b) return false;
  const li = document.querySelector(`.practice-steps li[data-step="${b.dataset.step}"]`); if (li) { li.hidden = false; b.classList.add('done'); }
  return true;
}
function readInput(e) { if (e.target.id === 'name-input') { const o = document.getElementById('name-out'); if (o) o.innerHTML = writeName(e.target.value); } }
