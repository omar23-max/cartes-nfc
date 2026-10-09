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
    bar.innerHTML = `<span class="own-l">${T('Version active', 'Active version')}</span><select aria-label="${T('Version active de ma carte', 'My card’s active version')}">${list.map((x) => `<option value="${x.k}:${x.id}" ${x.k === live.k && x.id === live.id ? 'selected' : ''}>${lab(x).replace(/</g, '&lt;')}</option>`).join('')}</select><button type="button" class="own-home">${T('Mettre sur mon écran d’accueil', 'Add to my home screen')}</button><small>${T('Visible par vous seulement', 'Only visible to you')}</small>`;
    bar.querySelector('select').addEventListener('change', (e) => {
      const [k, ...rest] = e.target.value.split(':');
      const r = reg() || R;
      r.live = { k, id: rest.join(':') };
      try { localStorage.setItem('nextap-pages', JSON.stringify(r)); } catch (err) { /* rien */ }
      const other = kind === 'cards' ? 'stores/view.html' : '../view.html';
      location.replace((k === kind ? location.pathname : other) + '?owner=1');
    });
    document.body.prepend(bar);
    /* Le raccourci garde « ?owner=1 » : le titulaire retrouve sa barre à chaque ouverture */
    const t = document.querySelector('meta[name="apple-mobile-web-app-title"]') || Object.assign(document.createElement('meta'), { name: 'apple-mobile-web-app-title' });
    t.content = T('Ma carte', 'My card'); document.head.appendChild(t);
    bar.querySelector('.own-home').addEventListener('click', () => {
      const ua = navigator.userAgent || '', ios = /iPhone|iPad|iPod/i.test(ua), android = /Android/i.test(ua);
      const steps = ios ? [T('Touchez le bouton Partager en bas de Safari', 'Tap the Share button at the bottom of Safari'), T('Choisissez « Sur l’écran d’accueil »', 'Choose “Add to Home Screen”'), T('Touchez « Ajouter »', 'Tap “Add”')]
        : android ? [T('Touchez le menu ⋮ en haut à droite de Chrome', 'Tap the ⋮ menu at the top right of Chrome'), T('Choisissez « Ajouter à l’écran d’accueil »', 'Choose “Add to home screen”'), T('Confirmez', 'Confirm')]
        : [T('Ouvrez cette page sur votre téléphone', 'Open this page on your phone'), T('Puis ajoutez-la à l’écran d’accueil depuis le menu du navigateur', 'Then add it to the home screen from the browser menu')];
      const ov = document.createElement('div');
      ov.className = 'own-ov';
      ov.innerHTML = `<div class="own-box" role="dialog" aria-modal="true"><h3>${T('Votre carte sur votre écran d’accueil', 'Your card on your home screen')}</h3><p>${T('Une icône « Ma carte » sur votre téléphone : vous la touchez, vous choisissez la version active, puis vous tapez votre carte sur le téléphone de votre client.', 'A “My card” icon on your phone: tap it, choose the active version, then tap your card on your client’s phone.')}</p><ol>${steps.map((x) => `<li>${x}</li>`).join('')}</ol><p class="own-note">${T('Ce raccourci est pour vous seul : ne le partagez pas. Sur la version finale, il demande d’être connecté à votre compte.', 'This shortcut is for you only: do not share it. On the final version, it requires being signed in to your account.')}</p><button type="button" class="own-x">${T('J’ai compris', 'Got it')}</button></div>`;
      ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('.own-x')) ov.remove(); });
      document.body.appendChild(ov);
    });
  };
})();
