'use strict';
// Original explanatory diagrams: how the Hall's columns were decorated in layers.
// Based on the University of Memphis project's written descriptions. Not a survey or a facsimile.
const COL_KINGS = {
  r2a: { name: 'Ramesses II, first years (raised relief, later recut)', color: '#3d6fb6' },
  r2b: { name: 'Ramesses II, later additions (sunk relief)', color: '#c2412d' },
  s1: { name: 'Sety I', color: '#7a5aa6' },
  r4: { name: 'Ramesses IV', color: '#3d8a4f' },
  r6: { name: 'Ramesses VI (over Ramesses IV)', color: '#222' },
};
const COL_PHASES = {
  great: [
    { id: 'p1', label: 'First years of Ramesses II', layers: ['leaf', 'scenes', 'frieze', 'capital'], text: 'Sety I had left the twelve great columns undecorated. Early in Ramesses II’s reign they received a modest programme: a triangular leaf pattern at the base, two scenes halfway up the shaft, a frieze of cartouches and cobras near the top, and plant decoration with small cartouches on the capital.' },
    { id: 'p2', label: 'Later in Ramesses II’s reign', layers: ['bandeau', 'vcart'], text: 'Ramesses II added more: a band of text with a speech of Amun and his titles, and two huge vertical cartouches below the scenes, facing the processional route, marking the Hall as his.' },
    { id: 'p3', label: 'Ramesses IV', layers: ['r4base'], text: 'Some sixty years after Ramesses II’s death, Ramesses IV carved his own large cartouches and Horus names over the leaf pattern at the base. He changed the spelling of his names and recut them.' },
    { id: 'p4', label: 'Ramesses VI', layers: ['r6base'], text: 'Ramesses VI then put his own names into the same cartouches. Plaster hid each earlier version; now that it has fallen away, the signs of several kings overlap.' },
  ],
  small: [
    { id: 's1', label: 'Sety I and early Ramesses II', layers: ['sscenes', 'sfrieze'], text: 'The original scheme for the 122 smaller columns was simple: ritual scenes on the shaft and a band of royal names, like columns in other temples of the time. Sety I’s scenes survive in the north half.' },
    { id: 's2', label: 'Ramesses II', layers: ['srekhyt', 'sband'], text: 'At the base, rekhyt birds raise their arms to Ramesses II’s names: “all the people adore”. Later in his reign he inserted deeply carved bands of text on the lower shafts, probably for one of his jubilees.' },
    { id: 's3', label: 'Ramesses IV', layers: ['s4scenes', 's4friezes'], text: 'Ramesses IV filled the remaining blank spaces with two more ritual scenes and bands of repeated cartouches over the geometric patterns. He died before finishing: the south-west quarter of the Hall kept the earlier look.' },
  ],
};
function colLegend(keys) { return `<div class="col-legend">${keys.map(k => `<span><i style="background:${COL_KINGS[k].color}"></i>${esc(COL_KINGS[k].name)}</span>`).join('')}</div>`; }
function cartRow(x0, x1, y, h, color, n, cls) {
  let s = ''; const w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) s += `<rect x="${(x0 + i * w + w * 0.15).toFixed(1)}" y="${y}" width="${(w * 0.7).toFixed(1)}" height="${h}" rx="${(w * 0.35).toFixed(1)}" class="${cls}" style="stroke:${color}"/>`;
  return s;
}
function colFigure(x, y, h, color) { return `<g style="stroke:${color}" class="cfig"><circle cx="${x}" cy="${y + h * 0.1}" r="${h * 0.09}"/><path d="M${x} ${y + h * 0.19}V${y + h * 0.62}M${x - h * 0.17} ${y + h * 0.34}H${x + h * 0.17}M${x} ${y + h * 0.62}L${x - h * 0.12} ${y + h}M${x} ${y + h * 0.62}L${x + h * 0.12} ${y + h}"/></g>`; }
function greatColumnSvg() {
  const C = COL_KINGS, L = 150, R = 350;
  let leaf = ''; for (let i = 0; i < 8; i++) { const x = L + i * 25; leaf += `<path d="M${x} 640L${x + 12.5} 560L${x + 25} 640" style="stroke:${C.r2a.color}" class="cl"/>`; }
  const scenes = [200, 300].map(x => colFigure(x - 22, 330, 90, C.r2a.color) + colFigure(x + 22, 330, 90, C.r2a.color)).join('');
  return `<svg viewBox="0 0 500 700" role="img" aria-label="Schematic great column with decoration layers">
   <path d="M150 650V170H350V650Z" class="shaft"/><path d="M150 170Q90 120 60 70H440Q410 120 350 170Z" class="capital"/><rect x="190" y="40" width="120" height="30" class="abacus"/><rect x="120" y="650" width="260" height="22" class="base"/>
   <g class="layer" data-layer="capital">${cartRow(80, 420, 84, 26, C.r2a.color, 12, 'cc')}<path d="M90 120Q250 150 410 120" style="stroke:${C.r2a.color}" class="cl"/></g>
   <g class="layer" data-layer="frieze">${cartRow(L, R, 190, 40, C.r2a.color, 7, 'cc')}${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${L + 14 + i * 28.6} 186v-12" style="stroke:${C.r2a.color}" class="cl"/>`).join('')}</g>
   <g class="layer" data-layer="bandeau"><rect x="${L}" y="250" width="200" height="16" style="stroke:${C.r2b.color}" class="band"/>${[...Array(18)].map((_, i) => `<path d="M${L + 6 + i * 11} 254v8" style="stroke:${C.r2b.color}" class="cl"/>`).join('')}</g>
   <g class="layer" data-layer="scenes">${scenes}</g>
   <g class="layer" data-layer="vcart"><rect x="200" y="440" width="44" height="100" rx="22" style="stroke:${C.r2b.color}" class="cc big"/><rect x="256" y="440" width="44" height="100" rx="22" style="stroke:${C.r2b.color}" class="cc big"/></g>
   <g class="layer" data-layer="leaf">${leaf}</g>
   <g class="layer" data-layer="r4base"><rect x="170" y="565" width="40" height="70" rx="20" style="stroke:${C.r4.color}" class="cc big"/><rect x="290" y="565" width="40" height="70" rx="20" style="stroke:${C.r4.color}" class="cc big"/><rect x="225" y="565" width="50" height="70" style="stroke:${C.r4.color}" class="cc"/></g>
   <g class="layer" data-layer="r6base"><path d="M176 580l28 40M204 580l-28 40M296 580l28 40M324 580l-28 40" style="stroke:${C.r6.color}" class="cl thick"/></g>
   <text x="455" y="100" class="dl">capital</text><text x="365" y="214" class="dl">frieze</text><text x="365" y="262" class="dl">text band</text><text x="365" y="380" class="dl">scenes</text><text x="365" y="495" class="dl">vertical cartouches</text><text x="365" y="610" class="dl">base</text>
  </svg>`;
}
function smallColumnSvg() {
  const C = COL_KINGS, L = 175, R = 325;
  let rekhyt = ''; for (let i = 0; i < 4; i++) { const x = L + 18 + i * 38; rekhyt += `<g style="stroke:${C.r2b.color}" class="cl"><path d="M${x - 12} 640h24"/><circle cx="${x}" cy="610" r="9"/><path d="M${x - 8} 602l-6 -14M${x + 8} 602l6 -14"/></g>`; }
  return `<svg viewBox="0 0 500 700" role="img" aria-label="Schematic small column with decoration layers">
   <path d="M175 650V160H325V650Z" class="shaft"/><path d="M175 160Q150 110 200 70H300Q350 110 325 160Z" class="capital"/><rect x="205" y="45" width="90" height="25" class="abacus"/><rect x="150" y="650" width="200" height="22" class="base"/>
   <g class="layer" data-layer="sfrieze">${cartRow(L, R, 175, 34, C.s1.color, 5, 'cc')}</g>
   <g class="layer" data-layer="sscenes">${colFigure(225, 240, 90, C.s1.color)}${colFigure(275, 240, 90, C.s1.color)}</g>
   <g class="layer" data-layer="s4scenes">${colFigure(225, 360, 80, C.r4.color)}${colFigure(275, 360, 80, C.r4.color)}</g>
   <g class="layer" data-layer="s4friezes">${cartRow(L, R, 460, 30, C.r4.color, 6, 'cc')}${cartRow(L, R, 500, 30, C.r4.color, 6, 'cc')}</g>
   <g class="layer" data-layer="sband"><rect x="${L}" y="545" width="150" height="22" style="stroke:${C.r2b.color}" class="band"/>${[...Array(13)].map((_, i) => `<path d="M${L + 6 + i * 11} 550v12" style="stroke:${C.r2b.color}" class="cl"/>`).join('')}</g>
   <g class="layer" data-layer="srekhyt">${rekhyt}</g>
   <text x="340" y="196" class="dl">names frieze</text><text x="340" y="290" class="dl">scene</text><text x="340" y="405" class="dl">later scene</text><text x="340" y="490" class="dl">rows of cartouches</text><text x="340" y="560" class="dl">text band</text><text x="340" y="625" class="dl">rekhyt birds</text>
  </svg>`;
}
function columnsPage() {
  const block = (kind, title, svg, keys) => `<section class="col-block" data-kind="${kind}"><h2>${title}</h2><div class="col-wrap"><div class="col-svg" data-phase="0">${svg}</div><div class="col-text"><div class="col-steps">${COL_PHASES[kind].map((p, i) => `<button data-colstep="${i}" class="${i === 0 ? 'on' : ''}">${i + 1}. ${esc(p.label)}</button>`).join('')}</div><p class="col-note">${esc(COL_PHASES[kind][0].text)}</p>${colLegend(keys)}</div></div></section>`;
  return `${readHead('Columns: layers of names', 'Almost every column in the Hall was decorated more than once. Step through the layers to see who added what. Colours show the king; the drawing is a simplified explanation, not a copy of a particular column.')}
  <section class="section" style="padding-top:0">${block('great', 'One of the twelve great columns', greatColumnSvg(), ['r2a', 'r2b', 'r4', 'r6'])}${block('small', 'One of the 122 smaller columns', smallColumnSvg(), ['s1', 'r2b', 'r4'])}
  <p class="micro">Original schematic drawings based on the descriptions by the Karnak Great Hypostyle Hall Project (University of Memphis). Band positions and counts are simplified.</p>
  ${sourcesBlock([{ sourceId: 'hypostyle-project-columns', locator: 'The Great Columns: phases of decoration' }, { sourceId: 'memphis-small-columns', locator: 'The Smaller Columns: phases of decoration' }, { sourceId: 'memphis-marginal', locator: 'Ramesses IV and VI additions' }])}</section>`;
}
function columnsAfterRender() {
  document.querySelectorAll('.col-block').forEach(b => setColPhase(b, 0));
}
function setColPhase(block, n) {
  const kind = block.dataset.kind, phases = COL_PHASES[kind];
  const on = new Set(phases.slice(0, n + 1).flatMap(p => p.layers));
  block.querySelectorAll('.layer').forEach(g => g.classList.toggle('on', on.has(g.dataset.layer)));
  block.querySelectorAll('[data-colstep]').forEach(b => b.classList.toggle('on', +b.dataset.colstep <= n));
  block.querySelector('.col-note').textContent = phases[n].text;
}
function columnsInteract(e) {
  const b = e.target.closest('[data-colstep]'); if (!b) return false;
  setColPhase(b.closest('.col-block'), +b.dataset.colstep); return true;
}
