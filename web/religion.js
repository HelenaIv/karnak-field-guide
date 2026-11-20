// "Main ideas of Egyptian religion": a page of The Context (route #basics/religion).
// Content lives in content/features/basics.json under "religion"; every drawing here is an original schematic.
const RL = { duty: 0, head: 0, joined: false, emerge: 0, fam: 'ra', phase: 0, play: null, part: 'ka', jstep: 0, gift: -1 };
function rlData() { return bsData().religion; }
function rlEl(id) { const e = document.getElementById(id); return e && e.classList ? e : null; }

// ---------- small line icons for the seven ideas (24×24) ----------
const RL_ICONS = {
  maat: '<path d="M12 22V9M12 9C8.6 8 7 4.8 8.2 2c2.6 1 4.6 3.4 3.8 7zM8.5 22h7"/>',
  gods: '<circle cx="5.5" cy="9" r="2.4"/><circle cx="12" cy="6.5" r="2.6"/><circle cx="18.5" cy="9" r="2.4"/><path d="M2.5 20c0-4.2 6-4.2 6 0M8.6 20c0-5.4 6.8-5.4 6.8 0M15.5 20c0-4.2 6-4.2 6 0"/>',
  creation: '<path d="M2 20c2.5-1.2 4 1 6.5 0s4 1.2 6.5 0 4 1.2 7 0M5 17.5c1.6-5.2 12.4-5.2 14 0"/><circle cx="12" cy="7.5" r="2.6"/><path d="M12 2.5v1.2M7 7.5h1.2M15.8 7.5H17M8.6 4.2l.8.8M15.4 4.2l-.8.8"/>',
  sun: '<circle cx="12" cy="8.5" r="3.6"/><path d="M2.5 15.5c3.2 3.4 15.8 3.4 19 0M2.5 15.5 1.5 12.5M21.5 15.5l1-3M7 15.8v-1.6M17 15.8v-1.6"/>',
  exchange: '<path d="M4 12.5h16M7 12.5V21M17 12.5V21M8.4 12.5c0-2.6 1.6-3.6 3.6-3.6s3.6 1 3.6 3.6M12 8.9V6M10 4.5 12 6l2-1.5"/>',
  person: '<path d="M5 13c0-3.6 3-5.6 6-5.6 3.6 0 6.2 2.4 8 5.6-2.6-.2-4.6.8-5.6 2.8H8.4C6.2 15.8 5 14.6 5 13z"/><circle cx="11.5" cy="4.6" r="2.2"/><path d="M9.5 15.8 8.5 20M12.5 15.8l1 4.2"/>',
  judgement: '<path d="M12 3v18M7 21h10M4 7h16M4 7l-2.5 6h5zM20 7l-2.5 6h5zM12 3l-1.5 1.5h3z"/>'
};
function rlIcon(id, cls = 'rl-ico') { return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${RL_ICONS[id] || ''}</svg>`; }

// ---------- god heads (40×40), schematic profiles ----------
const RL_HEADS = {
  falcon: '<path d="M12 34V20a9 9 0 0 1 16.5-5l6 3.4-6 1.8-1.8 3.8V34"/><circle cx="22.5" cy="16" r="1.4"/><path d="M21.5 18.5l-3.4 5.5"/>',
  lion: '<path d="M14 35V23c0-7 5-12 11.5-12 4 0 6.6 2.2 7.6 5.4l2.6 5.4-3.6 1v3.6l-3.2 1.2V35"/><circle cx="27" cy="17.5" r="1.3"/><path d="M15 15q-4 4-4.5 10M18 11.5q-6-.5-9 5M22 10q-5-4-11-1.5M13 22q-3 3-3 8"/>',
  cow: '<path d="M7 7q2.5 9.5 13 9.5T33 7"/><circle cx="20" cy="9.5" r="4.6"/><path d="M14 35v-8.5a6 6 0 0 1 12 0V35M14 23l-2.4-3.5M26 23l2.4-3.5"/>',
  ibis: '<path d="M13 35V22.5a6.5 6.5 0 0 1 12-3.4q6.2 6 11.4 15.4"/><circle cx="20.5" cy="20.5" r="1.3"/><path d="M13 27.5h-2"/>',
  jackal: '<path d="M13.5 35V20.5a7 7 0 0 1 12-4.8l9.5 5.2-9.5 2.2V35M14.5 17.5l1.8-13 4.6 9.8M22.4 14l3-10 1.4 12.5"/><circle cx="21" cy="19" r="1.2"/>',
  human: '<path d="M16.5 15V3l2.2 12M21.3 15V3l2.2 12M15 15h10v4.5H15zM15.5 19.5v6a4.5 4.5 0 0 0 9 0v-6M14 35l1.5-6M26 35l-1.5-6"/>'
};
function rlHead(id, cls = 'rl-head') { return `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true">${RL_HEADS[id] || ''}</svg>`; }

// ---------- page ----------
function bsReligion() {
  const r = rlData(); if (!r) return '<div class="page-head"><h1>This section is not in this build.</h1></div>';
  return `${bsHead(r.title, r.intro)}<section class="section rl" style="padding-top:0">${rlHub(r)}${sourcesBlock(r.introCitations)}
  ${rlBlock(1, 'maat', r.maat, rlMaat(r.maat))}
  ${rlBlock(2, 'gods', r.gods, rlGods(r.gods))}
  ${rlBlock(3, 'creation', r.creation, rlCreation(r.creation))}
  ${rlBlock(4, 'sun', r.sun, rlSun(r.sun))}
  ${rlBlock(5, 'exchange', r.exchange, rlExchange(r.exchange))}
  ${rlBlock(6, 'person', r.person, rlPerson(r.person))}
  ${rlBlock(7, 'judgement', r.judgement, rlJudgement(r.judgement))}</section>`;
}
function rlBlock(n, id, b, inner) {
  return `<article class="rl-block" id="rl-${id}"><div class="rl-head-row"><span class="rl-badge">${rlIcon(id)}</span><span class="rl-n">${String(n).padStart(2, '0')} / 07</span></div><h2>${esc(b.heading)}</h2><p class="rl-lead">${fmt(b.text)}</p>${inner}${b.deeper ? `<details class="rl-deeper"><summary>Look closer</summary><p>${fmt(b.deeper)}</p></details>` : ''}${b.karnak ? `<p class="rl-karnak">${fmt(b.karnak)}</p>` : ''}${sourcesBlock(b.citations)}<p class="rl-top"><button type="button" data-rl-go="hub">↑ All seven ideas</button></p></article>`;
}

// Hub: seven ideas around the feather of Maat
function rlHub(r) {
  const n = r.hub.length, cx = 300, cy = 190, R = 138;
  const pts = r.hub.map((h, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  const ring = pts.map((p, i) => { const q = pts[(i + 1) % n]; return `<path class="rl-hub-ring" d="M${p[0]} ${p[1]}L${q[0]} ${q[1]}"/>`; }).join('');
  const spokes = pts.map(p => `<path class="rl-hub-spoke" d="M${cx} ${cy}L${p[0]} ${p[1]}"/>`).join('');
  const nodes = r.hub.map((h, i) => { const [x, y] = pts[i], below = y > cy + 20; return `<g class="rl-hub-node" data-rl-go="${h.id}" tabindex="0" role="button" aria-label="${esc(h.label)}: ${esc(h.short)}"><circle cx="${x}" cy="${y}" r="31"/><g transform="translate(${x - 14} ${y - 14}) scale(1.17)">${RL_ICONS[h.id]}</g><text x="${x}" y="${below ? y + 50 : y - 42}">${esc(h.label)}</text></g>`; }).join('');
  return `<div class="rl-hub" id="rl-hub"><svg viewBox="0 0 600 385" class="rl-hub-svg" role="group" aria-label="The seven main ideas">${ring}${spokes}${nodes}<circle class="rl-hub-core" cx="${cx}" cy="${cy}" r="44"/><g class="rl-hub-feather" transform="translate(${cx - 18} ${cy - 22}) scale(1.5)">${RL_ICONS.maat}</g></svg>
  <ol class="rl-hub-list">${r.hub.map((h, i) => `<li><button type="button" data-rl-go="${h.id}"><span class="rl-hub-li-n">${String(i + 1).padStart(2, '0')}</span>${rlIcon(h.id)}<b>${esc(h.label)}</b><span>${esc(h.short)}</span></button></li>`).join('')}</ol></div>`;
}

// 1. Maat: the king's six duties around the feather
function rlMaat(m) {
  const n = m.duties.length, cx = 210, cy = 150, R = 112;
  const nodes = m.duties.map((d, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a); return `<g class="rl-duty" data-rl-duty="${i}" tabindex="0" role="button"><path class="rl-duty-ray" d="M${cx} ${cy}L${x} ${y}"/><circle cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y + 5}">${i + 1}</text></g>`; }).join('');
  return `<div class="rl-maat"><div class="rl-panel-l"><p class="rl-how">${esc(m.dutiesIntro)}</p><svg viewBox="0 0 420 300" class="rl-maat-svg" role="group" aria-label="${esc(m.dutiesIntro)}"><circle class="rl-maat-ring" cx="${cx}" cy="${cy}" r="${R}"/>${nodes}<circle class="rl-maat-core" cx="${cx}" cy="${cy}" r="46"/><g transform="translate(${cx - 24} ${cy - 30}) scale(2)" class="rl-maat-feather">${RL_ICONS.maat}</g></svg></div>
  <div class="rl-panel-r"><ol class="rl-duty-list">${m.duties.map((d, i) => `<li><button type="button" data-rl-duty="${i}"><span class="rl-dn">${i + 1}</span>${esc(d.label)}</button></li>`).join('')}</ol><div class="rl-card" id="rl-duty-card"></div></div></div>`;
}

// 2. Gods: heads and joining
function rlGods(g) {
  const f = g.fusion;
  return `<p class="rl-how">${esc(g.headsIntro)}</p><div class="rl-heads">${g.heads.map((h, i) => `<button type="button" class="rl-headbtn" data-rl-head="${i}">${rlHead(h.id)}<span>${esc(h.label)}</span></button>`).join('')}</div><div class="rl-headcard" id="rl-head-card"></div>
  <h3 class="rl-h3">${esc(f.heading)}</h3><div class="rl-fuse" id="rl-fuse"><svg viewBox="0 0 520 190" class="rl-fuse-svg" role="img" aria-label="${esc(f.a)} + ${esc(f.b)} = ${esc(f.ab)}">
   <g class="rl-fa"><circle cx="190" cy="92" r="70"/><text x="190" y="88" class="rl-fname">${esc(f.a)}</text><text x="190" y="110" class="rl-fsub">${esc(f.aText)}</text></g>
   <g class="rl-fb"><circle cx="330" cy="92" r="70"/><text x="330" y="88" class="rl-fname">${esc(f.b)}</text><text x="330" y="110" class="rl-fsub">${esc(f.bText)}</text></g>
   <g class="rl-fab"><text x="260" y="86" class="rl-fname big">${esc(f.ab)}</text><text x="260" y="110" class="rl-fsub">${esc(f.abText)}</text></g></svg>
   <button type="button" class="rl-btn" data-rl-fuse><span class="rl-fuse-join">Join them</span><span class="rl-fuse-split">Split them</span></button></div><p class="rl-note">${esc(f.split)}</p>`;
}

// 3. Creation
function rlCreation(c) {
  const sym = {
    water: '<path d="M4 14q4-4 8 0t8 0t8 0t8 0M4 22q4-4 8 0t8 0t8 0t8 0M4 30q4-4 8 0t8 0t8 0t8 0"/>',
    time: '<path d="M20 20c-4-6-12-6-12 0s8 6 12 0 12-6 12 0-8 6-12 0z"/>',
    dark: '<circle cx="20" cy="20" r="12" class="fill"/><circle cx="20" cy="20" r="15.5"/>',
    way: '<path d="M8 12l6 3-6 3M30 9l-5 5 1-6M12 30l5-4-6-1M31 29l-6-2 4 5M20 18v4M18 20h4"/>'
  };
  const fam = rlFamily(c.family);
  return `<h3 class="rl-h3">${esc(c.eightHeading)}</h3><p class="rl-how">${esc(c.eightIntro)}</p>
  <div class="rl-eight">${c.eight.map(p => `<button type="button" class="rl-pair" data-rl-pair="${p.id}"><svg viewBox="0 0 40 40" aria-hidden="true">${sym[p.id]}</svg><b>${esc(p.names)}</b><i>“${esc(p.word)}”</i><span>${esc(p.text)}</span></button>`).join('')}</div>
  <h3 class="rl-h3">${esc(c.emergeHeading)}</h3><p>${fmt(c.emergeText)}</p>
  <div class="rl-emerge"><svg viewBox="0 0 400 190" class="rl-emerge-svg" id="rl-emerge-svg" role="img" aria-label="${esc(c.emergeHeading)}">
   <rect width="400" height="190" class="rl-em-sky"/><circle cx="200" cy="66" r="22" class="rl-em-sun"/>
   <g class="rl-em-l" data-em="mound"><path d="M110 150c20-42 160-42 180 0z" class="rl-em-mound"/></g>
   <g class="rl-em-l" data-em="heron"><path d="M110 150c20-42 160-42 180 0z" class="rl-em-mound"/><path d="M190 120l-4 22M204 120l4 22" class="rl-em-line"/><ellipse cx="197" cy="112" rx="20" ry="11" class="rl-em-bird"/><path d="M214 108q8-16 0-30q-4-6 2-9l18 2-16 3q8 16-2 34" class="rl-em-bird"/><path d="M178 112l-14 8" class="rl-em-line"/></g>
   <g class="rl-em-l" data-em="lotus"><path d="M200 150c-14-10-16-30 0-44 16 14 14 34 0 44zM200 150c-20-4-34-18-34-34 16 2 28 16 34 34M200 150c20-4 34-18 34-34-16 2-28 16-34 34" class="rl-em-lotus"/></g>
   <path d="M0 158q25-8 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0V190H0z" class="rl-em-water"/><path d="M0 172q25-8 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0" class="rl-em-wave"/></svg>
   <div class="rl-em-side"><div class="rl-seg">${c.emerge.map((e, i) => `<button type="button" data-rl-emerge="${i}">${esc(e.label)}</button>`).join('')}</div><p class="rl-card" id="rl-emerge-card"></p></div></div>
  <h3 class="rl-h3">${esc(c.familyHeading)}</h3><p class="rl-how">${esc(c.familyIntro)}</p>
  <div class="rl-family">${fam}<div class="rl-card" id="rl-fam-card"></div></div><p class="rl-note">${fmt(c.familyNote)}</p>
  ${c.people ? `<div class="rl-aside"><span class="eyebrow">Where do people come from?</span><p>${fmt(c.people)}</p></div>` : ''}
  ${c.story ? `<div class="rl-story"><span class="eyebrow">A story</span><h3>${esc(c.story.heading)}</h3><p>${fmt(c.story.text)}</p></div>` : ''}
  <p class="rl-more"><a class="mu-stop" href="#universe">See creation built into the temple →</a></p>`;
}
const RL_FAM_POS = { ra: [300, 34], shu: [220, 104], tefnut: [380, 104], geb: [220, 174], nut: [380, 174], osiris: [90, 252], isis: [230, 252], seth: [370, 252], nephthys: [510, 252], horus: [160, 322] };
const RL_FAM_UP = { shu: ['ra'], tefnut: ['ra'], geb: ['shu', 'tefnut'], nut: ['shu', 'tefnut'], osiris: ['geb', 'nut'], isis: ['geb', 'nut'], seth: ['geb', 'nut'], nephthys: ['geb', 'nut'], horus: ['osiris', 'isis'] };
function rlFamily(list) {
  const P = RL_FAM_POS, pair = (a, b) => [(P[a][0] + P[b][0]) / 2, P[a][1]];
  const line = (d, k) => `<path class="rl-fl" data-fl="${k}" d="${d}"/>`;
  const [sx, sy] = pair('shu', 'tefnut'), [gx, gy] = pair('geb', 'nut'), [ox, oy] = pair('osiris', 'isis');
  const lines = line(`M300 50V${sy}`, 'shu tefnut') + line(`M${P.shu[0]} ${sy}H${P.tefnut[0]}`, 'shu tefnut') +
    line(`M${sx} ${sy}V${gy}M${P.geb[0]} ${gy}H${P.nut[0]}`, 'geb nut') +
    line(`M${gx} ${gy}V214H${P.osiris[0]}V236M${P.isis[0]} 214V236M${P.seth[0]} 214V236M${P.nephthys[0]} 214V236`, 'osiris isis seth nephthys') +
    line(`M${P.osiris[0]} ${oy}H${P.isis[0]}M${ox} ${oy}V306`, 'horus');
  const nodes = list.map(f => { const [x, y] = P[f.id] || [0, 0]; return `<g class="rl-fn" data-rl-fam="${f.id}" tabindex="0" role="button"><rect x="${x - 54}" y="${y - 16}" width="108" height="32" rx="16"/><text x="${x}" y="${y + 5}">${esc(f.name)}</text></g>`; }).join('');
  return `<svg viewBox="0 0 600 345" class="rl-fam-svg" role="group" aria-label="Family tree of the first gods">${lines}${nodes}</svg>`;
}

// 4. The sun's daily journey
function rlSunPos(a) { return [300 + 150 * Math.cos(a), 175 - 128 * Math.sin(a)]; }
function rlSun(s) {
  const serpent = 'M222 282q12-10 24 0t24 0t24 0t24 0t24 0';
  return `<div class="rl-sun"><svg viewBox="0 0 600 350" class="rl-sun-svg" id="rl-sun-svg" role="img" aria-label="${esc(s.heading)}">
   <defs><linearGradient id="rl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3df"/><stop offset="1" stop-color="#f1dfb6"/></linearGradient><linearGradient id="rl-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26364a"/><stop offset="1" stop-color="#121c29"/></linearGradient></defs>
   <rect width="600" height="175" fill="url(#rl-sky)"/><rect y="175" width="600" height="175" fill="url(#rl-under)"/>
   <path d="M0 175c40-14 70-14 100 0M500 175c30-14 60-14 100 0" class="rl-sun-hill"/><path d="M0 175H600" class="rl-sun-horizon"/>
   <ellipse cx="300" cy="175" rx="150" ry="128" class="rl-sun-path"/>
   <path d="${serpent}" class="rl-sun-snake"/><circle cx="342" cy="279" r="3" class="rl-sun-snake-eye"/>
   <text x="300" y="34" class="rl-sun-lbl">Sky</text><text x="300" y="336" class="rl-sun-lbl dark">Underworld</text>
   <text x="566" y="166" class="rl-sun-lbl end">East</text><text x="34" y="166" class="rl-sun-lbl start">West</text>
   <g id="rl-sun-boat"><path d="M-30 6c10 12 50 12 60 0l4-8M-30 6l-4-8" class="rl-sun-bark"/><circle cy="-12" r="15" class="rl-sun-disk"/></g></svg>
   <div class="rl-sun-side"><div class="rl-seg rl-seg-wrap">${s.phases.map((p, i) => `<button type="button" data-rl-phase="${i}">${esc(p.label)}</button>`).join('')}</div><button type="button" class="rl-btn" data-rl-play><span class="rl-play-on">▶ Play the day</span><span class="rl-play-off">❚❚ Pause</span></button><p class="rl-card" id="rl-sun-card"></p></div></div>`;
}

// 5. Exchange
function rlExchange(x) {
  return `<p class="rl-how">${esc(x.intro)}</p><div class="rl-ex"><div class="rl-ex-col"><span class="eyebrow">The king gives</span>${x.kingGives.map((g, i) => `<button type="button" class="rl-gift" data-rl-gift="${i}">${esc(g)}</button>`).join('')}</div>
  <div class="rl-ex-mid"><svg viewBox="0 0 240 200" class="rl-ex-svg" aria-hidden="true"><g class="rl-ex-king">${rlFig(40, 'human-king')}</g><g class="rl-ex-god">${rlFig(200, 'human')}</g><path d="M100 150h40M104 150v40M136 150v40M108 150c0-14 8-18 12-18s12 4 12 18" class="rl-ex-altar"/></svg><div class="rl-ex-track"><span class="rl-chip rl-chip-to" id="rl-chip-to"></span><span class="rl-chip rl-chip-back" id="rl-chip-back"></span></div></div>
  <div class="rl-ex-col"><span class="eyebrow">The gods give</span>${x.godGives.map((g, i) => `<div class="rl-ret" data-rl-ret="${i}">${esc(g)}</div>`).join('')}</div></div>
  <p class="rl-note">${esc(x.label)}</p>
  <h3 class="rl-h3">${esc(x.peopleHeading)}</h3><div class="rl-people">${x.people.map(p => `<div class="rl-pcard"><b>${esc(p.label)}</b><p>${esc(p.text)}</p></div>`).join('')}</div>
  <p class="rl-more"><a class="mu-stop" href="#basics/rituals">The rituals and festivals of Karnak →</a></p>`;
}
// Simple standing figures for the schematic scenes (x = centre line, feet at y=196).
function rlFig(x, head, y0 = 0) {
  const heads = { human: `<circle cx="${x}" cy="${y0 + 74}" r="11"/><path d="M${x - 5} ${y0 + 63}v-22l3 22M${x + 1} ${y0 + 63}v-22l3 22"/>`, 'human-king': `<path d="M${x - 9} ${y0 + 68}q9-20 18 0v6q-9 4-18 0z"/><circle cx="${x}" cy="${y0 + 78}" r="9"/>`,
    jackal: `<path d="M${x - 8} ${y0 + 86}v-12a8 8 0 0 1 12-6l12 6-12 3v9M${x - 6} ${y0 + 70}l2-14 5 10M${x + 2} ${y0 + 67}l3-12 1 14"/>`,
    ibis: `<path d="M${x - 8} ${y0 + 86}v-12a7 7 0 0 1 13-3q8 8 13 22"/>`, falcon: `<path d="M${x - 8} ${y0 + 86}v-12a9 9 0 0 1 16-5l6 4-6 2-2 4v7"/>` };
  return `<g class="rl-fig">${heads[head] || heads.human}<path d="M${x - 14} ${y0 + 92}h28l-4 50h-20zM${x - 10} ${y0 + 142}l-2 54M${x + 10} ${y0 + 142}l2 54M${x - 14} ${y0 + 96}l-12 28M${x + 14} ${y0 + 96}l12 28"/></g>`;
}

// 6. The person
function rlPerson(p) {
  const lbl = id => esc((p.parts.find(x => x.id === id) || {}).label || id);
  return `<div class="rl-person"><svg viewBox="0 0 420 330" class="rl-person-svg" role="group" aria-label="${esc(p.heading)}">
   <g class="rl-pp" data-rl-part="shadow" tabindex="0" role="button"><path d="M232 278l92 22 34 2-36-14-72-12z" class="rl-shadow-shape"/><text x="330" y="322">${lbl('shadow')}</text></g>
   <g class="rl-pp" data-rl-part="ka" tabindex="0" role="button"><g transform="translate(-82 0)" class="rl-ka-shape">${rlBody(210)}</g><text x="128" y="296">${lbl('ka')}</text></g>
   <g class="rl-pp" data-rl-part="body" tabindex="0" role="button"><g class="rl-body-shape">${rlBody(210)}</g><text x="196" y="300">${lbl('body')}</text></g>
   <g class="rl-pp" data-rl-part="heart" tabindex="0" role="button"><path d="M203 124h14M205 124c-6 4-9 10-8 17 1 8 6 13 13 13s12-5 13-13c1-7-2-13-8-17M201 131l-4-2M219 131l4-2" class="rl-heart-shape"/><text x="264" y="144" class="start">${lbl('heart')}</text><path d="M228 140h30" class="rl-pp-tick"/></g>
   <g class="rl-pp" data-rl-part="ba" tabindex="0" role="button"><g class="rl-ba-shape"><path d="M300 92c0-18 14-28 30-28 18 0 30 12 40 28-14-1-24 4-28 14h-30c-8 0-12-6-12-14z"/><circle cx="318" cy="52" r="10"/><path d="M314 106l-3 14M328 106l3 14"/></g><text x="336" y="140">${lbl('ba')}</text></g>
   <g class="rl-pp" data-rl-part="akh" tabindex="0" role="button"><g class="rl-akh-shape"><circle cx="78" cy="62" r="18"/><path d="M78 30v-12M78 106V94M46 62H34M122 62h-12M55 39l-8-8M101 39l8-8M55 85l-8 8M101 85l8 8"/></g><text x="78" y="128">${lbl('akh')}</text></g>
   </svg><div class="rl-person-side"><div class="rl-seg rl-seg-wrap">${p.parts.map(x => `<button type="button" data-rl-part="${x.id}">${esc(x.label)}</button>`).join('')}</div><p class="rl-card" id="rl-part-card"></p></div></div>`;
}
function rlBody(x) { return `<circle cx="${x}" cy="74" r="20"/><path d="M${x - 26} 102h52l-8 92h-36zM${x - 18} 194l-4 82M${x + 18} 194l4 82M${x - 26} 108l-18 62M${x + 26} 108l18 62"/>`; }

// 7. Judgement
function rlJudgement(j) {
  const S = j.steps.map(s => s.id);
  return `<div class="rl-judge"><svg viewBox="0 0 700 300" class="rl-judge-svg" id="rl-judge-svg" role="img" aria-label="${esc(j.heading)}">
   <path d="M0 268H700" class="rl-j-floor"/>
   <g class="rl-js" data-js="lead"><g transform="translate(0 72)">${rlFig(52, 'human')}${rlFig(110, 'jackal')}</g></g>
   <g class="rl-js" data-js="check weigh" id="rl-balance"><path d="M260 268V96M236 268h48M260 96l-6 8h12z" class="rl-j-post"/><g id="rl-beam" class="rl-j-beam"><path d="M180 104H340"/><path d="M180 104l-20 44h40zM340 104l-20 44h40z" class="rl-j-pan"/><path d="M175 128h10M176.5 128c-4 3-6 7-5.5 12 .6 5 4 8 9 8s8.4-3 9-8c.5-5-1.5-9-5.5-12" class="rl-j-heart"/><path d="M340 146v-28M340 118c-6-3-8-10-5-16 6 3 8 9 5 16" class="rl-j-feather"/></g></g>
   <g class="rl-js" data-js="check"><g transform="translate(0 110) scale(1 .8)">${rlFig(300, 'jackal')}</g></g>
   <g class="rl-js" data-js="ammit"><path d="M218 268c0-22 12-34 30-34h36c14 0 20 12 20 34z" class="rl-j-ammit"/><path d="M300 240l26 6-26 6" class="rl-j-ammit"/><text x="262" y="292" class="rl-j-lbl">Ammit</text></g>
   <g class="rl-js" data-js="thoth"><g transform="translate(0 72)">${rlFig(400, 'ibis')}</g><path d="M424 166h18v26h-18z" class="rl-j-palette"/></g>
   <g class="rl-js" data-js="osiris"><g transform="translate(0 72)">${rlFig(486, 'falcon')}</g><path d="M548 268V92h140v176M540 92h156M548 112h140" class="rl-j-shrine"/><path d="M572 268v-46h40v46M578 222v-62" class="rl-j-throne"/><g transform="translate(0 76) scale(1 .78)">${rlFig(596, 'human')}</g><g transform="translate(0 72)" opacity=".75">${rlFig(642, 'human')}${rlFig(668, 'human')}</g></g>
  </svg><div class="rl-judge-ctl"><button type="button" class="rl-btn ghost" data-rl-jmove="-1" aria-label="Previous step">←</button><div class="rl-seg rl-seg-wrap">${j.steps.map((s, i) => `<button type="button" data-rl-jstep="${i}">${i + 1}. ${esc(s.label)}</button>`).join('')}</div><button type="button" class="rl-btn ghost" data-rl-jmove="1" aria-label="Next step">→</button></div><p class="rl-card" id="rl-j-card"></p></div>`;
}

// ---------- state → screen ----------
function rlSet() {
  const r = rlData(); if (!r || !document.querySelector('.rl')?.classList) return;
  // maat
  document.querySelectorAll('[data-rl-duty]').forEach(b => b.classList.toggle('on', +b.dataset.rlDuty === RL.duty));
  const d = r.maat.duties[RL.duty], dc = rlEl('rl-duty-card'); if (dc && d) dc.innerHTML = `<b>${RL.duty + 1}. ${esc(d.label)}</b><p>${fmt(d.text)}</p>`;
  // heads
  document.querySelectorAll('[data-rl-head]').forEach(b => b.classList.toggle('on', +b.dataset.rlHead === RL.head));
  const h = r.gods.heads[RL.head], hc = rlEl('rl-head-card');
  if (hc && h) { const m = h.mediaId && media[h.mediaId]; hc.innerHTML = `<div class="rl-hc-text">${rlHead(h.id, 'rl-head big')}<div><b>${esc(h.label)}</b><p>${fmt(h.text)}</p></div></div>${m ? `<figure class="rl-hc-fig"><img src="${esc(m.webPath)}" alt="${esc(m.alt)}" loading="lazy">${credit(m)}</figure>` : ''}`; }
  rlEl('rl-fuse')?.classList.toggle('joined', RL.joined);
  // emerge
  document.querySelectorAll('[data-rl-emerge]').forEach(b => b.classList.toggle('on', +b.dataset.rlEmerge === RL.emerge));
  const e = r.creation.emerge[RL.emerge]; document.querySelectorAll('.rl-em-l').forEach(g => g.classList.toggle('on', g.dataset.em === e?.id));
  const ec = rlEl('rl-emerge-card'); if (ec && e) ec.innerHTML = `<b>${esc(e.label)}</b> ${fmt(e.text)}`;
  // family: the chosen god and the line back to the creator
  const up = new Set(); (function walk(id) { up.add(id); (RL_FAM_UP[id] || []).forEach(walk); })(RL.fam);
  document.querySelectorAll('[data-rl-fam]').forEach(g => { g.classList.toggle('on', g.dataset.rlFam === RL.fam); g.classList.toggle('line', up.has(g.dataset.rlFam)); });
  document.querySelectorAll('.rl-fl').forEach(l => l.classList.toggle('line', l.dataset.fl.split(' ').some(k => up.has(k))));
  const f = r.creation.family.find(x => x.id === RL.fam), fc = rlEl('rl-fam-card'); if (fc && f) fc.innerHTML = `<b>${esc(f.name)}</b><p>${fmt(f.text)}</p>`;
  // sun
  rlSunDraw(RL.play ? null : RL.phase);
  // person
  document.querySelectorAll('[data-rl-part]').forEach(g => g.classList.toggle('on', g.dataset.rlPart === RL.part));
  document.querySelector('.rl-person-svg')?.classList.toggle('picking', !!RL.part);
  const p = r.person.parts.find(x => x.id === RL.part), pc = rlEl('rl-part-card'); if (pc && p) pc.innerHTML = `<b>${esc(p.label)}</b> ${fmt(p.text)}`;
  // judgement
  const st = r.judgement.steps[RL.jstep], sv = rlEl('rl-judge-svg');
  if (sv && st) { sv.querySelectorAll('.rl-js').forEach(g => g.classList.toggle('on', g.dataset.js.split(' ').includes(st.id))); sv.classList.toggle('balanced', RL.jstep >= 2); }
  document.querySelectorAll('[data-rl-jstep]').forEach(b => b.classList.toggle('on', +b.dataset.rlJstep === RL.jstep));
  const jc = rlEl('rl-j-card'); if (jc && st) jc.innerHTML = `<b>${RL.jstep + 1}. ${esc(st.label)}</b> ${fmt(st.text)}`;
}
const RL_PHASE_ANGLE = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
function rlSunDraw(phase, angle) {
  const boat = rlEl('rl-sun-boat'); if (!boat) return;
  const a = angle != null ? angle : RL_PHASE_ANGLE[phase ?? 0], [x, y] = rlSunPos(a);
  boat.setAttribute('transform', `translate(${x} ${y})`);
  const night = Math.sin(a) < 0, ph = angle != null ? Math.round(((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 2)) % 4 : phase;
  rlEl('rl-sun-svg')?.classList.toggle('night', night);
  document.querySelectorAll('[data-rl-phase]').forEach(b => b.classList.toggle('on', +b.dataset.rlPhase === ph));
  const s = rlData().sun.phases[ph], c = rlEl('rl-sun-card'); if (c && s && c.dataset.ph !== String(ph)) { c.dataset.ph = ph; c.innerHTML = `<b>${esc(s.label)}</b> ${fmt(s.text)}`; }
}
function rlPlay(on) {
  cancelAnimationFrame(RL.play); RL.play = null; document.querySelector('.rl-sun')?.classList.toggle('playing', !!on);
  if (!on) { rlSunDraw(RL.phase); return; }
  const t0 = performance.now(), a0 = RL_PHASE_ANGLE[RL.phase];
  const tick = t => { if (!rlEl('rl-sun-boat')) { RL.play = null; return; } const a = a0 + (t - t0) / 16000 * 2 * Math.PI; rlSunDraw(null, a); RL.phase = Math.round((a % (2 * Math.PI)) / (Math.PI / 2)) % 4; RL.play = requestAnimationFrame(tick); };
  RL.play = requestAnimationFrame(tick);
}
function rlGive(i) {
  const r = rlData().exchange, to = rlEl('rl-chip-to'), back = rlEl('rl-chip-back'); if (!to) return;
  RL.gift = i; const ret = i % r.godGives.length;
  document.querySelectorAll('[data-rl-gift]').forEach(b => b.classList.toggle('on', +b.dataset.rlGift === i));
  document.querySelectorAll('[data-rl-ret]').forEach(b => b.classList.remove('on'));
  to.textContent = r.kingGives[i]; back.textContent = r.godGives[ret];
  [to, back].forEach(c => { c.classList.remove('go'); void c.offsetWidth; });
  to.classList.add('go'); setTimeout(() => { back.classList.add('go'); document.querySelector(`[data-rl-ret="${ret}"]`)?.classList.add('on'); }, 900);
}

function religionAfterRender() { if (!document.querySelector('.rl')) { if (RL.play) rlPlay(false); return; } RL.play = null; rlSet(); }
function rlInteract(e) {
  const t = e.target; if (!document.querySelector('.rl')) return false;
  const go = t.closest('[data-rl-go]'); if (go) { const el = rlEl(go.dataset.rlGo === 'hub' ? 'rl-hub' : 'rl-' + go.dataset.rlGo) || document.querySelector('.rl-hub'); el?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return true; }
  const k = (sel, fn) => { const b = t.closest(sel); if (b) { fn(b); rlSet(); return true; } return false; };
  return k('[data-rl-duty]', b => RL.duty = +b.dataset.rlDuty) || k('[data-rl-head]', b => RL.head = +b.dataset.rlHead) || k('[data-rl-fuse]', () => RL.joined = !RL.joined)
    || k('[data-rl-pair]', b => b.classList.toggle('open')) || k('[data-rl-emerge]', b => RL.emerge = +b.dataset.rlEmerge) || k('[data-rl-fam]', b => RL.fam = b.dataset.rlFam)
    || k('[data-rl-phase]', b => { rlPlay(false); RL.phase = +b.dataset.rlPhase; }) || k('[data-rl-play]', () => rlPlay(!RL.play))
    || k('[data-rl-gift]', b => rlGive(+b.dataset.rlGift)) || k('[data-rl-part]', b => RL.part = b.dataset.rlPart)
    || k('[data-rl-jstep]', b => RL.jstep = +b.dataset.rlJstep) || k('[data-rl-jmove]', b => RL.jstep = Math.max(0, Math.min(rlData().judgement.steps.length - 1, RL.jstep + +b.dataset.rlJmove)));
}
// Keyboard: Enter/Space on the SVG "buttons"
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest?.('.rl [role=button]')) { e.preventDefault(); rlInteract({ target: e.target }); } });
