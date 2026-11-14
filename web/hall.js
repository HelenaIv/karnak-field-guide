'use strict';
// Great Hypostyle Hall guided study: plan, manual orientation, stops and explanatory schematics.
// Loaded before app.js; shares its globals (D, media, sources, esc, credit, sourceNote, diagram).
const HALL_ID = 'great-hypostyle-hall';
const hallState = { last: null };
const ZONES = { 'interior': 'Inside the Hall', 'north-exterior': 'North exterior wall', 'south-exterior': 'South exterior wall' };
const FACING = { east: 0, south: 90, west: 180, north: 270 };
const CERTAINTY_LABEL = { established: 'Established', interpretation: 'Scholarly interpretation', disputed: 'Disputed', unknown: 'Unknown' };
function hallGuide() { return (D.guides || []).find(g => g.id === HALL_ID); }
function glossaryTerm(id) { return (D.glossary?.terms || []).find(t => t.id === id); }
// Escape text, then turn [[term-id]] or [[term-id|label]] into glossary links.
function fmt(t = '') { return esc(t).replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, label) => { const g = glossaryTerm(id); return `<a class="term" href="#glossary/${id}" data-term="${id}">${label || (g ? g.term.toLowerCase() : id)}</a>`; }); }
function plain(t = '') { return String(t).replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, label) => label || glossaryTerm(id)?.term.toLowerCase() || id); }
function citeList(list) { const seen = new Set(); return list.filter(c => { const k = c.sourceId + c.locator; if (seen.has(k)) return false; seen.add(k); return true; }).map(c => { const so = sources[c.sourceId]; return `<li><a href="${esc(so?.url || '#')}" target="_blank" rel="noopener">${esc(so?.title || c.sourceId)}</a>${so?.publisher ? ' · ' + esc(so.publisher) : ''} — ${esc(c.locator)}</li>`; }).join(''); }
function simpleFigure(id, caption) { const m = media[id]; if (!m) return ''; return `<figure class="hall-figure"><div class="ann-wrap"><button data-zoom="${esc(m.id)}" aria-label="Enlarge image: ${esc(m.caption)}"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}"></button></div><figcaption><span>${esc(caption || m.caption)}</span>${credit(m)}</figcaption></figure>`; }

// ---------- Plan ----------
function hallColumns() {
  let out = '';
  const sx = j => 128 + j * 58;
  const row = (y, inner) => { for (let j = 0; j < 9; j++) { if (inner && (j === 0 || j === 8)) continue; out += `<circle cx="${sx(j)}" cy="${y}" r="6.5" class="col-small"/>`; } };
  for (let i = 0; i < 7; i++) row(132 + i * 31, i === 6);
  for (let i = 0; i < 7; i++) row(502 + i * 31, i === 0);
  for (const y of [368, 452]) for (let k = 0; k < 6; k++) out += `<circle cx="${140 + k * 85}" cy="${y}" r="13" class="col-large"/>`;
  return out;
}
function hallPlan(g, current, compact = false) {
  const stops = g.stops;
  const cur = stops.find(s => s.id === current);
  const start = hallState.last && stops.find(s => s.id === hallState.last) || cur;
  const pins = stops.map(s => `<a href="#hall/${esc(s.id)}" class="pin${s.id === current ? ' current' : ''}" aria-label="Stop ${s.number}: ${esc(s.title)}"><circle cx="${s.position.x}" cy="${s.position.y}" r="22"/><text x="${s.position.x}" y="${s.position.y + 8}">${s.number}</text></a>`).join('');
  const marker = cur ? `<g id="hall-marker" class="marker" data-x="${cur.position.x}" data-y="${cur.position.y}" data-r="${FACING[cur.facing] ?? 0}" data-jump="${start && start.zone !== cur.zone ? 1 : 0}" style="transform:translate(${start.position.x}px,${start.position.y}px)"><g class="marker-dir" style="transform:rotate(${FACING[start.facing] ?? 0}deg)"><path d="M0 0L58 -24A62 62 0 0 1 58 24Z" class="view-cone"/></g><circle r="9" class="you"/></g>` : '';
  return `<figure class="hall-plan${compact ? ' compact' : ''}"><svg viewBox="0 0 720 820" role="img" aria-label="Schematic plan of the Great Hypostyle Hall with ${stops.length} numbered viewing areas${cur ? '; current stop ' + cur.number + ', facing ' + cur.facing : ''}">
  <rect x="0" y="0" width="720" height="820" class="plan-ground"/>
  <text x="24" y="410" class="plan-label" transform="rotate(-90 24 410)">GREAT COURT</text>
  <path d="M52 20h40v358h-40zM52 442h40v358h-40z" class="pylon"/><text x="72" y="14" class="plan-label" text-anchor="middle">SECOND PYLON</text>
  <path d="M620 60h40v325h-40zM620 435h40v325h-40z" class="pylon"/><text x="640" y="54" class="plan-label" text-anchor="middle">THIRD PYLON</text>
  <path d="M92 96h248v10H92zM372 96h248v10H372zM92 714h248v10H92zM372 714h248v10H372z" class="wall"/>
  <rect x="92" y="106" width="528" height="608" class="hall-floor"/>
  <path d="M92 410H620" class="axis"/><path d="M356 106V714" class="axis"/>
  ${hallColumns()}
  <text x="356" y="88" class="plan-label" text-anchor="middle">NORTH DOOR</text><text x="356" y="740" class="plan-label" text-anchor="middle">SOUTH DOOR</text>
  <text x="700" y="250" class="plan-label" transform="rotate(90 700 250)">NORTH WING</text><text x="700" y="575" class="plan-label" transform="rotate(90 700 575)">SOUTH WING</text>
  <g class="compass" transform="translate(28 790)"><path d="M0 -16L6 6L0 2L-6 6Z"/><text y="22" text-anchor="middle">N</text></g>
  ${marker}${pins}
  </svg><figcaption class="micro">${esc(g.planNote)}</figcaption></figure>`;
}
function hallAfterRender() {
  const m = document.getElementById('hall-marker');
  if (!m || typeof requestAnimationFrame !== 'function') return;
  const go = () => { m.style.transform = `translate(${m.dataset.x}px,${m.dataset.y}px)`; m.querySelector('.marker-dir').style.transform = `rotate(${m.dataset.r}deg)`; };
  if (m.dataset.jump === '1') { m.classList.add('jump'); go(); return; }
  requestAnimationFrame(() => requestAnimationFrame(go));
}

// ---------- Figures with numbered annotations ----------
function hallFigure(f) {
  const m = media[f.mediaId]; if (!m) return '';
  const marks = (f.annotations || []).map(a => `<span class="ann" style="left:${+a.x}%;top:${+a.y}%">${esc(a.label)}</span>`).join('');
  return `<figure class="hall-figure"><div class="ann-wrap"><button data-zoom="${esc(m.id)}" aria-label="Enlarge image: ${esc(m.caption)}"><img src="${esc(m.webPath || m.path)}" alt="${esc(m.alt)}" loading="lazy"></button>${marks}</div><figcaption><span>${esc(f.caption)}</span>${credit(m)}</figcaption></figure>`;
}

// ---------- Explanatory schematics ----------
const ankh = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" class="ankh"><ellipse cx="0" cy="-9" rx="5" ry="7"/><path d="M-9 0H9M0 -2V18"/></g>`;
function person(x, y, h = 120, cls = 'fig') { return `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${h * 0.09}"/><path d="M${x} ${y + h * 0.09}V${y + h * 0.62}M${x - h * 0.16} ${y + h * 0.3}H${x + h * 0.16}M${x} ${y + h * 0.62}L${x - h * 0.13} ${y + h}M${x} ${y + h * 0.62}L${x + h * 0.13} ${y + h}"/></g>`; }
function demo(kind, title, svg, note, controls = '') {
  return `<div class="demo hall-demo" id="demo-${kind}"><div class="demo-controls"><strong>${title}</strong>${controls}</div>${svg}<p>${note}</p></div>`;
}
function hallDiagram(kind) {
  const L = (x, y, t, a = 'start') => `<text x="${x}" y="${y}" class="demo-label" text-anchor="${a}">${t}</text>`;
  switch (kind) {
  case 'context': return demo(kind, 'The sequence of spaces, west to east', `<svg viewBox="0 0 720 210" role="img" aria-label="Schematic west-to-east sequence: Great Court, Second Pylon, Hypostyle Hall, Third Pylon">
    <rect x="20" y="70" width="140" height="70" class="open"/><rect x="170" y="40" width="34" height="130" class="stone"/><rect x="214" y="60" width="330" height="90" class="stone light"/><rect x="554" y="40" width="34" height="130" class="stone"/><rect x="598" y="70" width="100" height="70" class="open"/>
    ${[0,1,2,3,4,5].map(k=>`<circle cx="${250+k*52}" cy="95" r="7" class="dot"/><circle cx="${250+k*52}" cy="115" r="7" class="dot"/>`).join('')}
    <path d="M30 192H690" class="arrow-line" marker-end="url(#arr)"/><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#5b6658"/></marker></defs>
    ${L(90,62,'GREAT COURT','middle')}${L(187,30,'SECOND PYLON','middle')}${L(379,52,'GREAT HYPOSTYLE HALL','middle')}${L(571,30,'THIRD PYLON','middle')}${L(648,62,'TEMPLE CORE','middle')}
    ${L(187,186,'Horemheb (Dyn. 18)','middle')}${L(379,168,'built by Sety I; decoration finished and changed by Ramesses II (Dyn. 19)','middle')}${L(571,186,'Amenhotep III (Dyn. 18)','middle')}
  </svg>`, 'Original schematic of the order of spaces along the main axis. Not to scale. The Hall was inserted between two pylons that already existed.');
  case 'section': return demo(kind, 'Two column types, two roof levels', `<svg viewBox="0 0 720 300" role="img" aria-label="Schematic north-south section: taller open-capital nave columns and lower closed-bud side columns, with a clerestory between the roof levels">
    <g class="stone-g">${[70,170,550,650].map(x=>`<path d="M${x-14} 285V150H${x+14}V285Z"/><path d="M${x-14} 150Q${x} 112 ${x+14} 150Z"/><rect x="${x-20}" y="122" width="40" height="10"/>`).join('')}
    ${[300,420].map(x=>`<path d="M${x-18} 285V80H${x+18}V285Z"/><path d="M${x-18} 80L${x-46} 46H${x+46}L${x+18} 80Z"/><rect x="${x-26}" y="36" width="52" height="10"/>`).join('')}
    <path d="M40 112H250V122H40ZM470 112H680V122H470ZM250 26H470V36H250Z" class="slab"/>
    <path d="M250 36V112M470 36V112" class="grille"/></g>
    <path d="M232 70L260 70M488 70L460 70" class="ray"/>
    ${L(360,18,'HIGHER CENTRAL ROOF','middle')}${L(140,105,'LOWER SIDE ROOF','middle')}${L(580,105,'LOWER SIDE ROOF','middle')}
    ${L(205,62,'clerestory','end')}${L(360,140,'open papyrus capitals','middle')}${L(170,175,'closed bud','middle')}${L(170,188,'capitals','middle')}
    ${L(700,285,'heights simplified; often rounded to c. 20 m and c. 14 m','end')}
  </svg>`, 'Original explanatory section, north–south through the nave. Column numbers, spacing and exact heights are simplified.');
  case 'roof': {
    const parts=[['shaft','M330 290V150H390V290Z'],['capital','M330 150Q360 104 390 150Z'],['abacus','M338 92H382V104H338Z'],['architrave','M200 72H520V92H200Z'],['roof slabs','M180 50H540V72H180Z']];
    return demo(kind, 'Build the support from the ground up', `<svg viewBox="0 0 720 300" role="img" aria-label="Five stacked parts: shaft, capital, abacus, architrave and roof slabs">
    ${parts.map(([n,d],i)=>`<g class="layer${i===0?' on':''}" data-step="${i+1}"><path d="${d}" class="stone-p"/><path d="M560 ${270-i*50}H${i<3?400:545}" class="leader"/>${L(570,274-i*50,(i+1)+'. '+n.toUpperCase())}</g>`).join('')}
    </svg>`, 'Original schematic. Shaft → capital → abacus (squared block) → architrave (beam) → roof slabs. Use the button to add each part.', `<button data-hall="roof-step" data-step="1">Add the next part</button>`); }
  case 'relief': return diagram('relief');
  case 'names': return demo(kind, 'Anatomy of a cartouche', `<svg viewBox="0 0 720 230" role="img" aria-label="Two empty cartouche frames labelled throne name and birth name, with the rope outline and closing bar marked">
    ${[[60,'THRONE NAME (PRENOMEN)','e.g. Usermaatre-setepenre'],[390,'BIRTH NAME (NOMEN)','e.g. Ramesses, with an epithet']].map(([x,a,b])=>`<rect x="${x}" y="70" width="230" height="74" rx="37" class="cart"/><path d="M${x+238} 66V148" class="cart-bar"/>${[0,1,2].map(k=>`<rect x="${x+30+k*60}" y="88" width="48" height="38" class="slot"/>`).join('')}${L(x+115,52,a,'middle')}${L(x+115,170,b,'middle')}`).join('')}
    <path d="M300 107L330 200" class="leader"/>${L(335,214,'closing bar at the end')}<path d="M80 136L60 205" class="leader"/>${L(30,220,'rope-like oval outline')}
    ${L(690,214,'dashed boxes: sign groups (not drawn)','end')}
  </svg>`, 'The oval and bar mark a royal name. Inside, signs sit in balanced groups; a god’s name (such as the sun disk for Re) can be written first out of respect even when spoken later. The signs are deliberately not drawn: this is a frame diagram, not a facsimile.');
  case 'ritual': return demo(kind, 'How the four-jar scene is composed', `<svg viewBox="0 0 720 270" role="img" aria-label="Composition: performer at left, four streams arcing to the recipient at right, who holds an ankh">
    ${person(170,70,170)}${person(530,70,170,'fig recipient')}${ankh(578,150,1.4)}
    ${[0,1,2,3].map(k=>`<path d="M${210} ${95+k*4}Q${360} ${-10+k*22} ${505} ${80+k*6}" class="stream" style="animation-delay:${k*0.25}s"/>`).join('')}
    <g class="num">${[[150,62,1],[360,30,2],[545,62,3],[600,140,4]].map(([x,y,n])=>`<circle cx="${x}" cy="${y}" r="11"/><text x="${x}" y="${y+4}">${n}</text>`).join('')}</g>
    ${L(170,262,'1 performer: Ramesses II','middle')}${L(360,262,'2 four streams of water','middle')}${L(560,262,'3 recipient: statue of Sety I · 4 ankh','middle')}
  </svg>`, 'Composition schematic of B92 matching the photograph’s numbered markers. Figures are abstract placeholders, not a drawing of the relief.', `<button data-hall="replay" data-target="demo-ritual">Trace the streams again</button>`);
  case 'grammar': return demo(kind, 'Separate the text groups', `<svg viewBox="0 0 720 290" role="img" aria-label="Scene layout with four boxed text groups and reading-direction arrows">
    <rect x="20" y="10" width="680" height="200" class="frame"/>${person(200,80,120,'fig faint')}${person(520,80,120,'fig faint')}
    <rect x="250" y="140" width="220" height="30" class="tgroup"/><rect x="120" y="24" width="160" height="40" class="tgroup"/><rect x="440" y="24" width="160" height="40" class="tgroup"/><rect x="630" y="24" width="50" height="170" class="tgroup"/>
    <g class="num">${[[360,155,1],[200,44,2],[520,44,3],[655,110,4]].map(([x,y,n])=>`<circle cx="${x}" cy="${y}" r="11"/><text x="${x}" y="${y+4}">${n}</text>`).join('')}</g>
    ${L(20,232,'1 action label · 2 Ramesses II’s names · 3 Sety I’s names (Menmaatre) · 4 a column of text, read top to bottom')}
    <g transform="translate(40 252)">${[0,1,2].map(k=>`<g transform="translate(${k*34} 0)" class="bird"><circle cx="8" cy="8" r="7"/><path d="M1 8L-7 11L1 13Z"/></g>`).join('')}<path d="M0 30H120" class="arrow-line" marker-end="url(#arr2)"/></g>
    <defs><marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#5b6658"/></marker></defs>
    ${L(185,266,'Signs face left → begin at the left and read toward their backs.')}
  </svg>`, 'Layout schematic numbered like the B92 photograph. The bird shapes are abstract direction markers, not hieroglyphs. Each text group has its own direction.');
  case 'purification': {
    let st=''; for (const side of [-1,1]) for (let t=0.08;t<0.95;t+=0.11){ const x0=360+side*170,y0=70,cx=360+side*70,cy=-10,x1=360+side*8,y1=78; const x=(1-t)**2*x0+2*(1-t)*t*cx+t*t*x1,y=(1-t)**2*y0+2*(1-t)*t*cy+t*t*y1; st+=ankh(x.toFixed(1),y.toFixed(1),0.8); }
    return demo(kind, 'Streams written as signs', `<svg viewBox="0 0 720 270" role="img" aria-label="King between two gods; the streams poured over him are rows of ankh signs">
    ${person(190,70,160,'fig')}${person(360,90,140,'fig king')}${person(530,70,160,'fig')}${st}
    ${L(190,262,'Horus','middle')}${L(360,262,'Sety I','middle')}${L(530,262,'Seth','middle')}${L(360,22,'each stream = repeated ankh “life” signs','middle')}
  </svg>`, 'Composition schematic of B230 (plate 148) as described in the edition. It is a finding aid, not a facsimile: no matched reusable photograph has been acquired yet.'); }
  case 'bark': return demo(kind, 'Parts of a portable bark', `<svg viewBox="0 0 720 270" role="img" aria-label="Side view of a portable bark: hull, ram-headed end ornaments, central shrine under a canopy, carrying poles">
    <path d="M120 150Q360 210 600 150L585 175Q360 225 135 175Z" class="stone-p"/><circle cx="112" cy="135" r="18" class="ram"/><circle cx="608" cy="135" r="18" class="ram"/>
    <rect x="315" y="95" width="90" height="62" class="shrine"/><path d="M295 95H425L410 70H310Z" class="canopy"/><path d="M80 205H640" class="pole"/>
    ${[170,250,470,550].map(x=>`<path d="M${x} 205V240" class="leader"/>`).join('')}
    ${L(112,98,'ram-headed ends: Amun','middle')}${L(360,58,'canopy','middle')}${L(430,130,'shrine for the divine image')}${L(360,262,'carrying poles: a boat carried by priests, not sailed','middle')}${L(220,140,'hull','middle')}
  </svg>`, 'Generic functional schematic of a sacred bark for B291–92 (plate 197). Proportions and ornament are simplified.');
  case 'recut': return demo(kind, 'An altered royal figure', `<svg viewBox="0 0 720 280" role="img" aria-label="Two overlaid abstract postures: an earlier upright figure and a later bowing figure">
    <g class="phase1"><circle cx="330" cy="62" r="18"/><path d="M330 80V170M300 115H372M330 170L305 260M330 170L360 260"/></g>
    <g class="phase2"><circle cx="372" cy="84" r="18"/><path d="M362 100L338 172M350 128L408 140M338 172L318 260M338 172L372 260"/><rect x="398" y="120" width="34" height="34" class="model"/></g>
    ${L(470,70,'dashed: first design, upright (nemes and beard)')}${L(470,92,'solid: final design, bowing (long wig, no beard)')}${L(470,140,'presents a model of the temple')}${L(470,240,'double contours where old outlines survive')}
  </svg>`, 'Abstract posture schematic for B280g–i (plate 187). It shows the principle of overlapping phases only. The original short kilt is not reconstructed because the traces do not establish it.', `<button data-hall="phase" data-show="1">First design</button><button data-hall="phase" data-show="2">Final design</button><button data-hall="phase" data-show="both">Both</button>`);
  case 'registers': return demo(kind, 'Reading the north wall from outside', `<svg viewBox="0 0 720 270" role="img" aria-label="Elevation of the north exterior wall seen facing south: east wing on the left, doorway in the middle, west wing on the right, divided into horizontal registers">
    <rect x="20" y="30" width="300" height="180" class="stone light"/><rect x="400" y="30" width="300" height="180" class="stone light"/><rect x="330" y="70" width="60" height="140" class="door"/>
    ${[90,150].map(y=>`<path d="M20 ${y}H320M400 ${y}H700" class="reg"/>`).join('')}
    <rect x="60" y="100" width="40" height="44" class="king"/>${[0,1,2,3,4].map(k=>`<rect x="${120+k*22}" y="${128-((k%2)*10)}" width="14" height="16" class="enemy"/>`).join('')}
    ${L(170,22,'EAST WING (on your left)','middle')}${L(550,22,'WEST WING (on your right)','middle')}${L(360,228,'north door','middle')}
    ${L(20,250,'Facing south outside the north wall, east is on your left. Read one register and one campaign group at a time.')}${L(130,170,'scale = rank, not size','start')}
  </svg>`, 'Original elevation schematic. The number of registers and scene sizes are simplified; use the H-number references below to find specific panels.');
  case 'geography': return demo(kind, 'A frontier drawn as an argument', `<svg viewBox="0 0 720 260" role="img" aria-label="Schematic strip: the king's return passes forts and crosses a waterway with crocodiles at the frontier">
    <path d="M430 20Q445 130 430 240L470 240Q485 130 470 20Z" class="water"/>${[60,120,180].map(y=>`<path d="M440 ${y}h22l6 3l-6 3h-22z" class="croc"/>`).join('')}
    ${[[110,90],[250,140],[560,110]].map(([x,y])=>`<rect x="${x}" y="${y}" width="42" height="34" class="fort"/><path d="M${x} ${y}v-8h8v8h8v-8h8v8h8v-8h10v8" class="fort-top"/>`).join('')}
    <path id="geo-path" d="M60 200Q260 220 360 180T650 160" class="route"/><circle r="9" class="you geo-dot"><animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#geo-path"/></animateMotion></circle>
    ${L(450,256,'waterway with crocodiles','middle')}${L(130,82,'labelled fortified places','middle')}${L(60,232,'royal movement (direction simplified)')}
  </svg>`, 'Original schematic of the elements to look for in H20 (OIP 107 plate 6). Not a scale map: spacing serves the relief’s composition, not measured distance.');
  case 'campaigns': {
    const groups=[['Kadesh (Sety I)',[['H2','assault on Kadesh','pl. 23']]],['Libyan campaign',[['H3','attack on Libyans','pl. 28'],['H3a','king kills a Libyan chief','pl. 29'],['H4','return','pl. 31'],['H5','presentation of booty','pl. 32']]],['Hittite campaign',[['H7','battle','pl. 34'],['H8–9','return and offering','pl. 35–36']]],['Triumph',[['H6','triumph scene','pl. 17']]]];
    return `<div class="demo hall-demo campaign-chart" id="demo-campaigns"><div class="demo-controls"><strong>West wing: group the panels</strong></div>${groups.map(([n,items])=>`<div class="campaign"><span class="micro">${esc(n)}</span><ol>${items.map(([h,t,p])=>`<li><b>${h}</b> ${esc(t)} <span class="micro">OIP 107 ${p}</span></li>`).join('')}</ol></div>`).join('')}<p>Sequence chart built from the project index cited for this stop. It groups battle → return → gift to the gods; it does not show the panels’ positions on the wall.</p></div>`; }
  case 'palimpsest': return demo(kind, 'Two designs on one wall', `<svg viewBox="0 0 720 270" role="img" aria-label="Layer schematic: an earlier battle design with a soldier and river lines, overlaid by a later design with a seated god">
    <g class="layer-early"><path d="M80 200q30 -14 60 0t60 0t60 0t60 0t60 0M80 225q30 -14 60 0t60 0t60 0t60 0t60 0" class="river"/>${person(300,70,130,'fig early')}${L(80,252,'earlier: Kadesh battle, Orontes river lines')}</g>
    <g class="layer-late"><rect x="250" y="80" width="110" height="20" class="seat"/><rect x="262" y="40" width="70" height="62" class="god"/><path d="M262 100V170H350" class="god-line"/>${[0,1,2].map(k=>`<rect x="${470+k*55}" y="${120}" width="34" height="40" rx="17" class="ring"/><circle cx="${487+k*55}" cy="108" r="9" class="captive"/>`).join('')}${L(400,252,'later: seated Amun; captives over place-name rings')}</g>
  </svg>`, 'Layer schematic of the principle the project documents; it does not reproduce the actual surviving geometry. Note the place-name rings: they are not royal cartouches.', `<label class="micro">earlier <input type="range" min="0" max="100" value="50" data-hall="layers" aria-label="Balance between earlier and later design"> later</label>`);
  default: return '';
  }
}

// ---------- Pages ----------
function hallOverview() {
  const g = hallGuide(); if (!g) return '<div class="page-head"><h1>The Hall guide is not in this build.</h1></div>';
  hallState.last = null;
  const zones = Object.keys(ZONES).map(z => { const list = g.stops.filter(s => s.zone === z); return list.length ? `<h3 class="zone-head">${ZONES[z]}</h3><ol class="stop-list">${list.map(s => `<li value="${s.number}"><a href="#hall/${esc(s.id)}"><b>${esc(s.title)}</b><span>${esc(s.location)}</span></a></li>`).join('')}</ol>` : ''; }).join('');
  const c = g.completion || {};
  const lst = (t, a) => a?.length ? `<div><strong>${t}</strong><ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
  return `<div class="page-head"><span class="eyebrow">Guided study · ${g.stops.length} stops</span><h1>${esc(g.title)}</h1><p>${esc(g.scope)}. Choose a numbered stop on the plan or start at stop 1. Each stop tells you where to stand, what to look at, and what the evidence says.</p><p class="notice-inline">${esc(g.accessNote)}</p><a class="primary" href="#hall/${esc(g.stops[0].id)}">Start at stop 1 <span>→</span></a>${universeTeaser()}</div>
  <section class="section hall-intro-media">${figure('own-hall-central-aisle')}${videoFig(media['own-video-hall-walk'])}</section><section class="section hall-overview" style="padding-top:10px"><div>${hallPlan(g, null)}${sourceNote(g.planCitations || [])}</div><div>${zones}<details class="notice"><summary>What is ready and what is still open</summary><div class="completion">${lst('Ready to review', c.readyExamples)}${lst('Still open', c.open)}${lst('Not implemented', c.notImplemented)}</div></details></div></section>`;
}
const MU_STOPS = ['entrance', 'columns', 'roof'];
function hallStopV2(g, s, prev, next, nav, plan) {
  const figs = (s.figures || []).map(hallFigure).join('');
  const allCites = [...(s.story || []), s.lookCloser, s.readIt, ...(s.more || [])].filter(Boolean).flatMap(x => x.citations || []);
  return `<div class="reader-top"><a href="#hall">← Hall plan & all stops</a><span>Stop ${s.number} of ${g.stops.length} · ${esc(ZONES[s.zone] || s.zone)}</span></div>
  <div class="hall-stop"><aside class="hall-side">${plan}<p class="facing">Stop ${s.number}. Face <b>${esc(s.facing)}</b>.</p><p class="micro">Positions are approximate. Choose stops yourself; the plan does not track you.</p></aside>
  <article class="prose hall-prose v2"><span class="eyebrow">Stop ${s.number}</span><h1>${esc(s.title)}</h1><p class="location">${esc(s.location)}</p>
  <section class="stand"><h2>Where to stand</h2><p>${fmt(s.stand)}</p></section>
  <section><h2>What to look at</h2><ol class="look">${s.look.map(t => `<li>${fmt(t)}</li>`).join('')}</ol></section>
  ${figs}
  <section><h2>What it is and why it is here</h2>${s.story.map(b => `<p>${fmt(b.text)}</p>`).join('')}</section>
  ${MU_STOPS.includes(s.id) ? universeTeaser() : ''}
  ${s.diagram ? hallDiagram(s.diagram) : ''}
  ${s.lookCloser ? `<section class="callout"><h2>Look closer: ${esc(s.lookCloser.heading)}</h2><p>${fmt(s.lookCloser.text)}</p></section>` : ''}
  ${s.readIt ? `<section class="callout read-it"><h2>Read it yourself: ${esc(s.readIt.heading)}</h2><p>${fmt(s.readIt.text)}</p><p class="links"><a href="#read/signs">More signs to learn →</a><a href="#read/names">Royal names →</a></p></section>` : ''}
  ${(s.more || []).length ? `<section class="more"><h2>More</h2>${s.more.map(m => `<details><summary>${esc(m.heading)}</summary>${m.mediaId ? simpleFigure(m.mediaId) : ''}<p>${fmt(m.text)}</p></details>`).join('')}</section>` : ''}
  <details class="sources"><summary>Sources for this stop</summary><ul>${citeList(allCites)}</ul></details>
  <div class="transition"><strong>${next ? 'Next' : 'End of the study'}</strong><p>${fmt(s.transition)}</p></div>${nav}</article></div>`;
}
function hallStop(id) {
  const g = hallGuide(); const i = g ? g.stops.findIndex(s => s.id === id) : -1; if (i < 0) return hallOverview();
  const s = g.stops[i], prev = g.stops[i - 1], next = g.stops[i + 1];
  const nav = `<div class="stop-nav">${prev ? `<a href="#hall/${esc(prev.id)}" rel="prev">← ${prev.number}. ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="#hall/${esc(next.id)}" rel="next">${next.number}. ${esc(next.title)} →</a>` : `<a href="#hall">Back to the plan →</a>`}</div>`;
  const plan = hallPlan(g, s.id, true);
  hallState.last = s.id;
  if (s.format === 2) { return hallStopV2(g, s, prev, next, nav, plan); }
  const figs = s.figures?.length ? s.figures.map(hallFigure).join('') : '<p class="notice">No securely matched, reusable photograph of this panel yet. Use the drawing below and the published scene reference to find it.</p>';
  return `<div class="reader-top"><a href="#hall">← Hall plan & all stops</a><span>Stop ${s.number} of ${g.stops.length} · ${esc(ZONES[s.zone] || s.zone)}</span></div>
  <div class="hall-stop"><aside class="hall-side">${plan}<p class="facing">You are at stop ${s.number}. Face <b>${esc(s.facing)}</b>.</p><p class="micro">Select stops yourself; the plan does not track your position.</p><p class="micro">Keyboard: ← → for previous / next stop.</p></aside>
  <article class="prose hall-prose"><span class="eyebrow">Stop ${s.number} · face ${esc(s.facing)}</span><h1>${esc(s.title)}</h1><p class="location">${esc(s.location)}</p>
  <section class="stand"><h2>Where to stand</h2><p>${esc(s.stand)}</p></section>
  <section><h2>Look for</h2><ol class="look">${s.look.map(t => `<li>${esc(t)}</li>`).join('')}</ol></section>
  ${figs}${hallDiagram(s.diagram)}
  ${s.blocks.map(b => `<section><h2>${esc(b.heading)}</h2><p>${esc(b.text)}</p><span class="certainty c-${esc(b.certainty)}">${esc(CERTAINTY_LABEL[b.certainty] || b.certainty)}</span>${sourceNote(b.citations || [])}</section>`).join('')}
  ${MU_STOPS.includes(s.id) ? universeTeaser() : ''}
  <details class="source-note"><summary>All sources for this stop</summary>${(s.citations || []).map(c => { const so = sources[c.sourceId]; return `<p><a href="${esc(so?.url || '#')}" target="_blank" rel="noopener">${esc(so?.title || c.sourceId)}</a> — ${esc(c.locator)}</p>`; }).join('')}</details>
  <div class="transition"><strong>${next ? 'On to the next stop' : 'End of the study'}</strong><p>${esc(s.transition)}</p></div>${nav}</article></div>`;
}
function hallSearch(q) {
  const g = hallGuide(); if (!g || !q) return [];
  return g.stops.filter(s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));
}
function hallInteract(e) {
  const b = e.target.closest('[data-hall]'); if (!b) return false;
  const kind = b.dataset.hall;
  if (kind === 'roof-step') { const svg = b.closest('.demo').querySelector('svg'); const n = +b.dataset.step % 5 + 1; b.dataset.step = n; svg.querySelectorAll('.layer').forEach(l => l.classList.toggle('on', +l.dataset.step <= n)); b.textContent = n === 5 ? 'Start again' : 'Add the next part'; return true; }
  if (kind === 'replay') { const d = document.getElementById(b.dataset.target); d.classList.remove('play'); void d.offsetWidth; d.classList.add('play'); return true; }
  if (kind === 'phase') { const d = b.closest('.demo'); d.dataset.show = b.dataset.show; return true; }
  return false;
}
function hallInput(e) { if (e.target.dataset?.hall === 'layers') { const d = e.target.closest('.demo'); d.style.setProperty('--late', e.target.value / 100); } }
function hallKey(e) {
  if (!location.hash.startsWith('#hall/') || e.altKey || e.ctrlKey || e.metaKey || /input|select|textarea/i.test(e.target.tagName)) return;
  const rel = e.key === 'ArrowRight' ? 'next' : e.key === 'ArrowLeft' ? 'prev' : ''; if (!rel) return;
  const a = document.querySelector(`.stop-nav a[rel="${rel}"]`); if (a) location.hash = a.getAttribute('href');
}

// ---------- Glossary ----------
function glossaryPage(focus) {
  const terms = [...(D.glossary?.terms || [])].sort((a, b) => a.term.localeCompare(b.term));
  return `<div class="page-head"><span class="eyebrow">Glossary</span><h1>Words you will meet in the temple.</h1><p>Short explanations of the terms used in the guide. Tap a highlighted word in any stop to see its meaning.</p></div>
  <section class="section glossary" style="padding-top:0"><dl>${terms.map(t => `<div class="gl-item${t.id === focus ? ' focus' : ''}" id="term-${t.id}"><dt>${esc(t.term)}</dt><dd>${fmt(t.definition)}<details class="source-note"><summary>Source</summary><ul>${citeList(t.citations || [])}</ul></details></dd></div>`).join('')}</dl></section>`;
}
function termPopover(e) {
  const a = e.target.closest('a.term'); if (!a) return false;
  const t = glossaryTerm(a.dataset.term); if (!t) return false;
  e.preventDefault();
  let pop = document.getElementById('term-pop');
  if (!pop) { pop = document.createElement('div'); pop.id = 'term-pop'; pop.setAttribute('role', 'dialog'); document.body.appendChild(pop); }
  pop.innerHTML = `<button class="close" aria-label="Close">✕</button><strong>${esc(t.term)}</strong><p>${esc(plain(t.definition))}</p><a href="#glossary/${esc(t.id)}">Open the glossary →</a>`;
  pop.hidden = false; pop.querySelector('.close').onclick = () => { pop.hidden = true; }; pop.querySelector('a').onclick = () => { pop.hidden = true; };
  return true;
}
