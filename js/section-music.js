/* Section « Musique » pour les cartes de visite et les boutiques (v=369).
   Secteurs : musique, portfolio, influence, événementiel, beauté et bien-être, éducation, hébergement, tourisme ;
   boutiques : bar à cocktails, brasserie, café, mode, friperie, bijouterie.
   La section arrive désactivée et ne démarre jamais seule (le visiteur appuie sur lecture) ; le client peut
   l'activer, la renommer, choisir un morceau de la bibliothèque (libre de droits) ou envoyer le sien.
   Les invitations (studio Événements) ont leur propre section Musique (events/js/events.js). */
(function () {
  'use strict';
  const V = window.VC;
  if (!window.NFC || !V || !V.S) return;
  const EV = !!V.S.music; /* studio Événements : sa section Musique (un morceau) est déjà définie */
  const sub = /\/(stores|events)\//.test(location.pathname) ? '../' : '';
  const esc = V.esc, L2 = (fr, en) => V.L2(fr, en);

  /* Bibliothèque : les 8 morceaux libres de droits du studio Événements */
  const LIB = [['calme', 'Piano doux', 'Gentle piano'], ['romance', 'Piano romantique', 'Romantic piano'], ['jazz', 'Jazz de fête', 'Party jazz'], ['voyage', 'Entraînant', 'Upbeat'],
    ['fete', 'Joyeux anniversaire', 'Happy birthday'], ['berceuse', 'Berceuse', 'Lullaby'], ['noel', 'Jingle Bells', 'Jingle Bells'], ['halloween', 'Halloween', 'Halloween']];
  if (!NFC.EV_MUSIC) NFC.EV_MUSIC = LIB.map(([k, fr, en]) => ({ src: 'events/media/music/' + k + '.mp3', fr, en }));
  /* Adresse enregistrée depuis la racine du site : on l'ajuste pour les pages des sous-dossiers */
  const srcOf = (s) => { const v = V.vsrc ? V.vsrc(s) : s; return /^events\/media\//.test(v || '') ? sub + v : v; };

  const PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';
  const NOTE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  /* Plusieurs morceaux (« Mes créations », « Mes musiques préférées ») : une ligne par morceau, un seul joue à la fois */
  V.S.playlist = (def, b) => {
    const items = (b.items || []).filter((x) => x && srcOf(x.src));
    if (!items.length) return '';
    return `<div class="vc-pl" data-vol="${b.vol == null ? 70 : +b.vol}">${items.map((x, i) => `<div class="vc-pl-r"><button type="button" class="vc-play" data-vc="vc-pl" data-i="${i}" aria-label="${L2('Lire', 'Play')} ${esc(x.t || '')}">${PLAY}</button><div><b>${esc(x.t || L2('Morceau', 'Track') + ' ' + (i + 1))}</b>${x.by ? `<small>${esc(x.by)}</small>` : ''}</div><audio src="${esc(srcOf(x.src))}" preload="none"></audio></div>`).join('')}</div>`;
  };
  if (!EV) V.S.music = (def, b) => {
    const src = srcOf(b.src);
    if (!src) return '';
    return `<div class="vc-mus"><button type="button" class="vc-play" data-vc="vc-music" aria-label="${L2('Lire la musique', 'Play music')}">${PLAY}</button><div><b>${esc(b.track || L2('Musique', 'Music'))}</b><small>${L2('Appuyez pour écouter', 'Tap to listen')}</small></div>${NOTE}<audio src="${esc(src)}" preload="none" loop data-vol="${b.vol == null ? 70 : +b.vol}"></audio></div>`;
  };
  const prev = V.onAct;
  const stopAll = (except) => document.querySelectorAll('.vc-pl audio, .vc-mus audio').forEach((au) => { if (au !== except && !au.paused) { au.pause(); const bt = au.parentElement.querySelector('.vc-play'); if (bt) bt.innerHTML = PLAY; } });
  V.onAct = (a, t, e, m) => {
    if (a === 'vc-pl') {
      e.preventDefault();
      const row = t.closest('.vc-pl-r'), au = row && row.querySelector('audio'), box = t.closest('.vc-pl');
      if (!au) return true;
      if (au.paused) {
        stopAll(au);
        const v = +box.dataset.vol; au.volume = Math.max(0, Math.min(1, (isNaN(v) ? 70 : v) / 100));
        au.onended = () => { t.innerHTML = PLAY; const nx = row.nextElementSibling && row.nextElementSibling.querySelector('.vc-play'); if (nx) nx.click(); }; /* enchaîne le morceau suivant */
        au.play().then(() => { t.innerHTML = PAUSE; }).catch(() => {});
      } else { au.pause(); t.innerHTML = PLAY; }
      return true;
    }
    if (a === 'vc-music' && !EV) {
      e.preventDefault();
      const au = t.closest('.vc-mus') && t.closest('.vc-mus').querySelector('audio');
      if (!au) return true;
      if (au.paused) { const v = +au.dataset.vol; au.volume = Math.max(0, Math.min(1, (isNaN(v) ? 70 : v) / 100)); au.play().then(() => { t.innerHTML = PAUSE; }).catch(() => {}); }
      else { au.pause(); t.innerHTML = PLAY; }
      return true;
    }
    return prev ? prev(a, t, e, m) : false;
  };

  if (EV) { injectCss(); return; } /* invitations : seulement le lecteur de plusieurs morceaux */
  /* Ajout de la section aux secteurs et types de boutique concernés */
  const IDS = ['musique', 'portfolio', 'influence', 'evenementiel', 'beaute', 'education', 'hebergement', 'tourisme',
    'r-cocktail', 'r-brasserie', 'r-cafe', 'mode', 'friperie', 'bijoux'];
  const TRACK = { 'r-cocktail': 'jazz', 'r-brasserie': 'jazz', 'r-cafe': 'calme', beaute: 'calme', hebergement: 'calme', tourisme: 'voyage', musique: 'jazz', evenementiel: 'voyage', influence: 'voyage' };
  NFC.musicDefault = (sid) => { const k = TRACK[sid] || 'calme', x = LIB.find((z) => z[0] === k); return { on: false, src: 'events/media/music/' + k + '.mp3', track: x[1], vol: 70, auto: false }; };
  const addTo = (demo, sid, en) => { if (demo && demo.blocks && !demo.blocks.music) { const d = NFC.musicDefault(sid); if (en) d.track = (LIB.find((z) => 'events/media/music/' + z[0] + '.mp3' === d.src) || [])[2] || d.track; demo.blocks.music = d; } };
  (NFC.SECTORS || []).forEach((s) => {
    if (!IDS.includes(s.id) || !Array.isArray(s.blocks) || s.blocks.some((d) => d.type === 'music')) return;
    const def = { key: 'music', type: 'music', title: 'Musique', help: 'Un morceau à écouter : il ne démarre pas tout seul' };
    /* Avant « Nous écrire » / le formulaire de contact s'il y en a un, sinon à la fin */
    const i = s.blocks.findIndex((d) => d.type === 'contact' || d.type === 'form');
    if (i < 0) s.blocks.push(def); else s.blocks.splice(i, 0, def);
    addTo(s.demo, s.id); addTo(s.demoEn, s.id, true);
    (s.profiles || []).forEach((p) => { addTo(p.demo, s.id); addTo(p.demoEn, s.id, true); p._sec = null; });
  });
  /* Plusieurs morceaux : « Mes créations » pour les métiers de la musique (activée, avec 3 morceaux d'exemple),
     « Mes musiques préférées » pour l'éducation (étudiants, jeunes…), désactivée au départ */
  const lib = (k, en) => { const x = LIB.find((z) => z[0] === k); return { t: x[en ? 2 : 1], by: '', src: 'events/media/music/' + k + '.mp3' }; };
  const PL = { musique: ['tracks', 'Mes créations', true, ['jazz', 'romance', 'voyage']], evenementiel: ['tracks', 'Mes créations', false, ['voyage', 'jazz', 'fete']], education: ['favs', 'Mes musiques préférées', false, ['voyage', 'calme', 'jazz']] };
  const plDemo = (demo, sid, en) => { const P = PL[sid]; if (demo && demo.blocks && !demo.blocks[P[0]]) demo.blocks[P[0]] = { on: P[2], vol: 70, items: P[3].map((k) => Object.assign(lib(k, en), { by: en ? 'Demo track' : 'Morceau d’exemple' })) }; };
  NFC.playlistDefault = (sid, en) => { const P = PL[sid]; return P ? { on: false, vol: 70, items: [] } : null; };
  (NFC.SECTORS || []).forEach((s) => {
    const P = PL[s.id]; if (!P || !Array.isArray(s.blocks) || s.blocks.some((d) => d.key === P[0])) return;
    const def = { key: P[0], type: 'playlist', title: P[1], help: s.id === 'education' ? 'Les morceaux que vous aimez : vos visiteurs les écoutent en un clic' : 'Vos morceaux : vos visiteurs les écoutent en un clic' };
    const i = s.blocks.findIndex((d) => d.key === 'music');
    if (i < 0) s.blocks.push(def); else s.blocks.splice(i, 0, def);
    plDemo(s.demo, s.id); plDemo(s.demoEn, s.id, true);
    (s.profiles || []).forEach((p) => { plDemo(p.demo, s.id); plDemo(p.demoEn, s.id, true); p._sec = null; });
  });
  Object.assign(window.NFC_EN_UI, { 'Mes créations': 'My tracks', 'Mes musiques préférées': 'My favorite music', 'Vos morceaux : vos visiteurs les écoutent en un clic': 'Your tracks: visitors play them in one click', 'Les morceaux que vous aimez : vos visiteurs les écoutent en un clic': 'The tracks you love: visitors play them in one click' });
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), { 'Musique': 'Music', 'Un morceau à écouter : il ne démarre pas tout seul': 'A track to listen to: it never starts on its own' });

  injectCss();
  /* Style des lecteurs (mêmes couleurs que la carte) */
  function injectCss() {
  if (document.getElementById('vc-mus-css')) return;
  const st = document.createElement('style'); st.id = 'vc-mus-css';
  st.textContent = '.vc .vc-mus{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:999px;background:var(--sf);border:1px solid var(--ln)}'
    + '.vc .vc-mus>div{flex:1;min-width:0}.vc .vc-mus b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vc .vc-mus small{color:var(--mu);font-size:12px}'
    + '.vc .vc-mus>svg{color:var(--a);flex:none}.vc .vc-play{flex:none;display:grid;place-items:center;width:42px;height:42px;border:0;border-radius:50%;background:var(--p);color:#fff;cursor:pointer}'
    + '.vc .vc-pl{display:grid;gap:8px}.vc .vc-pl-r{display:flex;align-items:center;gap:12px;padding:8px 14px 8px 8px;border-radius:999px;background:var(--sf);border:1px solid var(--ln)}'
    + '.vc .vc-pl-r>div{flex:1;min-width:0}.vc .vc-pl-r b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px}.vc .vc-pl-r small{color:var(--mu);font-size:12px}.vc .vc-pl .vc-play{width:38px;height:38px}';
  document.head.appendChild(st);
  }
})();
