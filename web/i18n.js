'use strict';
// Language switch (EN / УКР / NO) and interface translation for the non-English versions.
// Content text comes translated in data-<lang>.js; this file translates the interface strings
// that the page scripts render, using the dictionary in ui-<lang>.js (content/i18n/<lang>/ui.json).
(() => {
  const LANGS = ['uk', 'nb'];
  const L = LANGS.includes(window.KARNAK_LANG) ? window.KARNAK_LANG : 'en';
  const toggle = document.getElementById('lang-toggle');
  if (toggle && typeof toggle.querySelectorAll === 'function') {
    toggle.querySelectorAll('[data-lang]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === L));
      if (typeof b.addEventListener !== 'function') return;
      b.addEventListener('click', () => {
        const to = b.dataset.lang; if (to === L) return;
        try { localStorage.setItem('karnak-lang', to); } catch (e) { /* URL keeps the choice */ }
        const u = new URL(location.href); u.searchParams.delete('lang'); if (to !== 'en') u.searchParams.set('lang', to);
        if (u.href === location.href) location.reload(); else location.href = u.href;
      });
    });
  }
  if (L === 'en' || typeof MutationObserver === 'undefined') return;
  const U = window.KARNAK_UI || {};
  const exact = U.exact || {};
  const auto = U.auto || {};
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const word = k => has(exact, k) ? exact[k] : has(auto, k) ? auto[k] : null;
  // Plural forms [one, few, many] chosen by the number n. Ukrainian uses all three; Norwegian has one/other (few = many).
  const plural = L === 'uk'
    ? (n, f) => { n = Math.abs(parseInt(n, 10)) % 100; const d = n % 10; return (n > 10 && n < 20) ? f[2] : d === 1 ? f[0] : (d >= 2 && d <= 4) ? f[1] : f[2]; }
    : (n, f) => Math.abs(parseInt(n, 10)) === 1 ? f[0] : f[1];
  // Pattern entries: [regex, replacement] or [regex, [one, few, many], countGroup]. $n inserts a group,
  // itself translated when it is a known phrase; {p} inserts the plural form.
  const pats = (U.patterns || []).map(([r, v, g]) => [new RegExp('^' + r + '$'), v, g]);
  const tr = s => {
    const k = s.trim(); if (!k) return null;
    const w = word(k); if (w != null) return s.replace(k, w);
    for (const [r, v, g] of pats) {
      const m = k.match(r); if (!m) continue;
      const tpl = Array.isArray(v) ? v[3] || '$0' : v;
      const out = tpl.replace(/\{p\}/g, Array.isArray(v) ? plural(m[g || 1], v) : '').replace(/\$(\d)/g, (_, i) => { const x = m[+i] ?? ''; const t = word(x); return t != null ? t : x; });
      return s.replace(k, out);
    }
    return null;
  };
  const ATTR = ['aria-label', 'placeholder', 'title', 'alt'];
  const attrs = el => { for (const a of ATTR) { const v = el.getAttribute(a); if (v) { const n = tr(v); if (n != null && n !== v) el.setAttribute(a, n); } } };
  const walk = node => {
    if (node.nodeType === 3) {
      let v = node.nodeValue; const n = tr(v); if (n != null) v = n;
      if (L === 'uk') v = v.replace(/н\. е\.\./g, 'н. е.');   // a template full stop after a Ukrainian date that already ends in "е."
      if (L === 'nb') v = v.replace(/(f|e)\.Kr\.\./g, '$1.Kr.');
      if (v !== node.nodeValue) node.nodeValue = v; return;
    }
    if (node.nodeType !== 1 || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    // An element can carry its own translated text (data-uk, data-nb) where word order differs between lines (e.g. SVG labels).
    if (node.dataset && node.dataset[L] != null) { if (node.textContent !== node.dataset[L]) node.textContent = node.dataset[L]; return; }
    attrs(node);
    for (const c of node.childNodes) walk(c);
  };
  walk(document.body);
  const t = tr(document.title); if (t) document.title = t;
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === 'characterData') walk(m.target);
      else if (m.type === 'attributes') attrs(m.target);
      else m.addedNodes.forEach(walk);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
})();
