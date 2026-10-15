/* Modèles « Noir » (n1 Obsidian, n2 Graphite, n3 Onyx) : fond noir, sections en cartes arrondies en relief,
   carrousel tournant d’images inclinées, bandeau défilant. Chargé après js/render.js. */
(function () {
  'use strict';
  const V = window.VC;
  if (!V || !V.render) return;
  const esc = V.esc, ic = V.ic, L2 = (fr, en) => V.L2(fr, en);
  const NOIR = /^n[1-3]$/;
  const NOIR_DESIGNS = [
    { id: 'n1', name: 'Obsidian', desc: 'Fond noir, photo floutée, portrait carré et grand nom ; sections en cartes arrondies en relief, carrousel d’images inclinées.' },
    { id: 'n2', name: 'Graphite', desc: 'Noir profond, portrait rond, nom en dégradé métallisé ; cartes en relief et carrousel tournant.' },
    { id: 'n3', name: 'Onyx', desc: 'Grande photo dans une carte noire, nom en surimpression ; bandeau défilant et carrousel incliné.' },
  ];
  NFC.NOIR_DESIGNS = NOIR_DESIGNS;
  if (!(NFC.DESIGNS_ALL || []).some((d) => d.id === 'n1')) NFC.DESIGNS_ALL = (NFC.DESIGNS_ALL || NFC.DESIGNS || []).concat(NOIR_DESIGNS);

  /* ---------- 7 palettes propres aux modèles noirs : le noir reste, seule la couleur d’accent change ---------- */
  const NP = (name, p, a) => ({ name, p, a, bg: '#050506', sf: '#141418', tx: '#f4f4f5', mu: '#a1a1aa', ln: 'rgba(255,255,255,.08)', noir: true });
  const NOIR_PALS = [NP('Argent', '#e4e4e7', '#a1a1aa'), NP('Or', '#e8c170', '#b8862f'), NP('Champagne', '#ecc9b0', '#c79a7b'), NP('Émeraude', '#34d399', '#059669'),
    NP('Bleu électrique', '#60a5fa', '#2563eb'), NP('Rubis', '#fb7185', '#e11d48'), NP('Améthyste', '#c084fc', '#9333ea')];
  NFC.NOIR_PALS = NOIR_PALS;
  Object.assign(window.NFC_EN_APP || (window.NFC_EN_APP = {}), { 'Argent': 'Silver', 'Or': 'Gold', 'Champagne': 'Champagne', 'Émeraude': 'Emerald', 'Bleu électrique': 'Electric blue', 'Rubis': 'Ruby', 'Améthyste': 'Amethyst' });
  /* Studio : quand le modèle choisi est noir, l’étape Couleurs propose ces 7 palettes (NFC.curDesign posé par le studio) */
  const pals0 = NFC.palsOf;
  NFC.palsOfBase = pals0;
  NFC.palsOf = (s) => (NOIR.test(NFC.curDesign || '') ? NOIR_PALS : pals0 ? pals0(s) : (s && s.palettes) || []);

  /* ---------- Secteurs, types de boutique et événements qui proposent les modèles noirs ---------- */
  const TOP = ['portfolio', 'musique', 'influence', 'freelance', 'pro', 'prestige', 'auto', 'beaute', 'coaching', 'archi', 'immobilier', 'evenementiel'];
  const ALSO = ['conseil', 'hebergement', 'tourisme', 'artisans', 'mode', 'bijoux', 'r-cocktail', 'r-steak', 'r-brasserie', 'nouvelan', 'halloween', 'anniversaire', 'victoire'];
  (NFC.SECTORS || []).forEach((sx) => {
    if (TOP.includes(sx.id)) {
      /* En tête de liste, sans retirer les autres modèles */
      if (!sx.designsOnly) { sx.designs = (NFC.DESIGNS || []).concat(sx.designs || []); sx.designsOnly = true; }
      sx.designs = NOIR_DESIGNS.concat((sx.designs || []).filter((d) => !NOIR.test(d.id)));
    } else if (ALSO.includes(sx.id)) {
      sx.designs = (sx.designs || []).filter((d) => !NOIR.test(d.id)).concat(NOIR_DESIGNS);
    }
  });

  const parts = (m) => {
    const id = m.card.identity || {}, est = !!m.sec.establishment;
    const face = V.img(est ? (id.logo || id.photo || id.cover || 'ph:logo') : (id.photo || id.logo || 'ph:logo'), m);
    const cover = V.img(id.cover || id.photo || 'ph:cover|', m);
    const name = esc(id.name || 'Votre nom');
    const words = String(id.name || '').split(' ');
    const split = words.length > 1 ? `${esc(words.slice(0, -1).join(' '))}<br>${esc(words[words.length - 1])}` : name;
    return { face, cover, name, split, role: esc(id.role), spec: esc(id.specialty), co: esc(id.company) };
  };
  /* Bandeau défilant : accroche + entreprise, répétées */
  const marquee = (p) => {
    const t = [p.spec, p.co].filter(Boolean).join(' · ') || p.role;
    if (!t) return '';
    const run = `<span>${t}</span><i>✦</i>`.repeat(4);
    return `<div class="nx-card nx-mq" aria-hidden="true"><div class="nx-mq-in">${run}${run}</div></div>`;
  };
  const aboutBtn = `<a class="nx-btn" href="#" data-vc="nxabout">${L2('À propos', 'About me')}</a>`;
  const H = {
    n1: (m) => { const p = parts(m); return `<header class="hd"><div class="nx-bg"><img src="${p.cover}" alt=""></div>
      <div class="nx-card nx-hero">${p.role ? `<p class="nx-k">${p.role}</p>` : ''}<div class="nx-id"><img class="nx-av" src="${p.face}" alt=""><div><h1>${p.split}</h1>${p.co ? `<p class="nx-loc">${p.co}</p>` : ''}</div></div>${aboutBtn}</div>${marquee(p)}</header>`; },
    n2: (m) => { const p = parts(m); return `<header class="hd"><div class="nx-card nx-hero nx-c"><div class="nx-ring"><img class="nx-av" src="${p.face}" alt=""></div><h1 class="nx-metal">${p.name}</h1>${p.role ? `<p class="nx-k">${p.role}</p>` : ''}${p.co ? `<p class="nx-loc">${p.co}</p>` : ''}${aboutBtn}</div>${marquee(p)}</header>`; },
    n3: (m) => { const p = parts(m); return `<header class="hd"><div class="nx-card nx-photo"><img src="${p.face}" alt=""><div class="nx-shade"></div><div class="nx-over">${p.role ? `<p class="nx-k">${p.role}</p>` : ''}<h1>${p.name}</h1>${p.co ? `<p class="nx-loc">${p.co}</p>` : ''}</div></div>${marquee(p)}</header>`; },
  };
  V.HEADERS = Object.assign(V.HEADERS || {}, H);

  /* Carte : palette noire correspondant à la palette choisie (même numéro) */
  const R1 = V.render;
  V.render = (m) => {
    if (m && NOIR.test(m.d || '') && !(m.pal && m.pal.noir)) {
      const list = (NFC.palsOfBase ? NFC.palsOfBase(m.sec) : (m.sec && m.sec.palettes)) || [];
      const i = Math.max(0, list.findIndex((x) => x === m.pal || (x && m.pal && x.name === m.pal.name)));
      m = Object.assign({}, m, { pal: NOIR_PALS[i % NOIR_PALS.length] });
    }
    return R1(m);
  };
  /* Galerie en carrousel tournant : l’image du centre droite, les autres inclinées en éventail (5 places) */
  const gal0 = V.S.gallery;
  V.S.gallery = (def, b, m) => {
    if (!NOIR.test(m.d)) return gal0(def, b, m);
    const ims = (b.images || []).filter((x) => x.src);
    if (!ims.length) return '';
    const five = []; for (let i = 0; i < 5; i++) five.push(ims[i % ims.length]);
    return `<div class="nx-fan">${five.map((x, i) => `<button type="button" class="nx-fi" style="animation-delay:${-i * 3}s" data-vc="lb" data-i="${i % ims.length}"><img src="${V.img(x.src, m)}" alt="${esc(x.cap)}" loading="lazy"></button>`).join('')}</div>`;
  };
  /* « À propos » : descend jusqu’à la présentation */
  const act0 = V.onAct;
  V.onAct = (a, t, e, m) => {
    if (a === 'nxabout') { e.preventDefault(); const s = document.querySelector('.vc .sec-text, .vc [data-sec="about"]'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
    return act0 ? act0(a, t, e, m) : false;
  };
})();
