/* Versions d’une carte, côté page publique (view.html et stores/view.html).
   - Lien de la carte (sans ?ver) : affiche la version active du moment.
   - Lien fixe d’une version (?ver=k:id ; sur GoBiz : nextap.ca/c/CODE/v/…) : affiche toujours cette version,
     même si le titulaire en active une autre. Ce lien est celui que le visiteur garde (contact, partage, écran d’accueil).
   - Version supprimée : selon le choix du titulaire, page « plus disponible », autre version du même type, ou version active.
   - Version en pause : page « temporairement indisponible ».
   - ?owner=1 : barre « Version active » en haut à droite (titulaire seulement ; sur GoBiz, titulaire connecté). */
(function () {
  'use strict';
  const NFC = (window.NFC = window.NFC || {});
  const reg = () => { try { return JSON.parse(localStorage.getItem('nextap-pages') || 'null'); } catch (e) { return null; } };
  const en = () => (document.documentElement.lang || '').startsWith('en') || /[?&]lang=en/.test(location.search);
  const T = (fr, eng) => (en() ? eng : fr);

  function page(title, text) {
    return `<div class="vc vc-susp"><div class="vc-susp-in"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><h1>${title}</h1><p>${text}</p></div></div>`;
  }

  /* kind : 'cards' ou 'stores' ; renvoie { redirect } | { page } | { id, key } */
  NFC.pfResolve = (kind, q) => {
    const R = reg();
    if (!R) return {};
    const other = kind === 'cards' ? 'stores/view.html' : '../view.html';
    let key = q.get('ver');
    const seen = new Set();
    while (key && R.gone && R.gone[key] && !seen.has(key)) {
      seen.add(key);
      const g = R.gone[key];
      if (g.mode === 'redirect' && g.to) key = g.to;
      else if (g.mode === 'active') key = null;
      else return { page: page(T('Cette page n’est plus disponible', 'This page is no longer available'), T('Ce contenu a été retiré par son propriétaire.', 'This content has been removed by its owner.')) };
    }
    if (key && (R.paused || []).includes(key)) return { page: page(T('Temporairement indisponible', 'Temporarily unavailable'), T('Cette page reviendra bientôt.', 'This page will be back soon.')) };
    if (key && !(R.list || []).some((x) => `${x.k}:${x.id}` === key)) key = null;
    const t = key ? { k: key.split(':')[0], id: key.split(':').slice(1).join(':') } : R.live;
    if (!t || !t.k) return {};
    if (t.k !== kind) {
      const p = new URLSearchParams(q);
      if (key) p.set('ver', key);
      return { redirect: other + (p.toString() ? '?' + p : '') };
    }
    return { id: t.id, key: `${t.k}:${t.id}` };
  };

  /* Barre du titulaire : choisir la version active juste avant de taper la carte */
  NFC.pfOwnerBar = (kind, q) => {
    if (q.get('owner') !== '1') return;
    const R = reg();
    if (!R || !(R.list || []).length) return;
    const paused = R.paused || [], live = R.live || {};
    const list = R.list.filter((x) => !paused.includes(`${x.k}:${x.id}`));
    if (list.length < 2) return;
    const lab = (x) => `${x.name} · ${x.k === 'cards' ? T('Carte de visite', 'Business card') : T('Boutique', 'Store')}`;
    const bar = document.createElement('div');
    bar.className = 'own-bar';
    bar.innerHTML = `<span class="own-l">${T('Version active', 'Active version')}</span><select aria-label="${T('Version active de ma carte', 'My card’s active version')}">${list.map((x) => `<option value="${x.k}:${x.id}" ${x.k === live.k && x.id === live.id ? 'selected' : ''}>${lab(x).replace(/</g, '&lt;')}</option>`).join('')}</select><small>${T('Visible par vous seulement', 'Only visible to you')}</small>`;
    bar.querySelector('select').addEventListener('change', (e) => {
      const [k, ...rest] = e.target.value.split(':');
      const r = reg() || R;
      r.live = { k, id: rest.join(':') };
      try { localStorage.setItem('nextap-pages', JSON.stringify(r)); } catch (err) { /* rien */ }
      const other = kind === 'cards' ? 'stores/view.html' : '../view.html';
      location.replace((k === kind ? location.pathname : other) + '?owner=1');
    });
    document.body.prepend(bar);
  };
})();
