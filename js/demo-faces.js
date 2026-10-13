/* Photos d’exemple : dans la moitié des modèles de certains secteurs, la personne de la démo est remplacée par
   une des 9 photos de femmes fournies par l’utilisateur (droits confirmés, media/immobilier/der1–der9.jpg).
   Seulement tant que la photo est une photo d’exemple du site (chemin media/…) : une photo du client n’est jamais remplacée.
   Chargé après js/render.js. */
(function () {
  'use strict';
  const V = window.VC;
  if (!V || !V.render) return;
  const SECTORS = { conseil: 0, archi: 3, beaute: 6, prestige: 1 }; /* décalage : pas la même photo en tête partout */
  const FACES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => 'media/immobilier/der' + n + '.jpg');
  const listOf = (s) => ((s.designs && s.designs.length ? s.designs : NFC.DESIGNS) || []).map((d) => d.id);
  function faceFor(m) {
    const s = m && m.sec, off = s && SECTORS[s.id];
    if (off == null || m.sec.establishment) return '';
    if (m.sec.profile && m.sec.profile.id === 'barbier') return ''; /* barbier : on garde la démo masculine */
    const p = ((m.card || {}).identity || {}).photo;
    if (p && !/^media\//.test(p)) return '';
    const i = listOf(s).indexOf(m.d || s.rec);
    if (i < 0 || i % 2) return ''; /* un modèle sur deux */
    return FACES[(i / 2 + off) % FACES.length];
  }
  /* Démo au féminin quand la photo est celle d’une femme, au masculin sinon : nom, métier et textes de la démo.
     Seulement si ce sont encore ceux de la démo (dans un sens comme dans l’autre). */
  const G = {
    conseil: { n: ['Michael Bennett', 'Michelle Bennett'], r: [['Attaché commercial', 'Conseillère financière']] },
    archi: { n: [['Daniel Brooks', 'Danielle Brooks'], ['Tom Barrett', 'Tess Barrett'], ['Victor Lane', 'Victoria Lane'], ['Mike Donovan', 'Mia Donovan'], ['Ryan Calloway', 'Rachel Calloway'], ['Graham Pierce', 'Grace Pierce']],
      r: [['Jardinier', 'Jardinière'], ['Entrepreneur général', 'Entrepreneure générale'], ['Concepteur de piscines', 'Conceptrice de piscines'], ['Ingénieur en structure', 'Ingénieure en structure']],
      t: [['Jardinier depuis 14 ans', 'Jardinière depuis 14 ans'], ['Entrepreneur général licencié RBQ', 'Entrepreneure générale licenciée RBQ']] },
    prestige: { n: ['Alexandre Valmont', 'Alexandra Valmont'], r: [['Investisseur et mécène', 'Investisseuse et mécène']],
      t: [['Entrepreneur et investisseur depuis', 'Entrepreneure et investisseuse depuis'], ['Passionné d’art', 'Passionnée d’art']] },
  };
  const pairs = (x) => (Array.isArray(x[0]) ? x : [x]);
  /* Renvoie une copie de la carte au féminin (fem = true) ou au masculin */
  function gender(card, sid, fem) {
    const g = G[sid];
    if (!g || !card || !card.identity) return card;
    const id = card.identity, from = fem ? 0 : 1, to = fem ? 1 : 0;
    const pn = pairs(g.n).find((x) => x[from] === id.name || x[to] === id.name);
    if (!pn) return card; /* nom personnalisé : on ne touche à rien */
    const c = Object.assign({}, card, { identity: Object.assign({}, id, { name: pn[to] }) });
    const pr = (g.r || []).find((x) => x[from] === id.role);
    if (pr) c.identity.role = pr[to];
    if (g.t && card.blocks) {
      const bl = {};
      Object.entries(card.blocks).forEach(([k, v]) => {
        if (v && typeof v.text === 'string') { let t = v.text; g.t.forEach((x) => { t = t.split(x[from]).join(x[to]); }); bl[k] = t === v.text ? v : Object.assign({}, v, { text: t }); } else bl[k] = v;
      });
      c.blocks = bl;
    }
    return c;
  }
  const R0 = V.render;
  V.render = (m) => {
    if (!m || !m.sec || !G[m.sec.id] && m.sec.id !== 'beaute') return R0(m);
    const f = faceFor(m);
    let card = m.card;
    /* Beauté sans métier choisi : la démo de base est un barbier → on prend la démo du salon de coiffure */
    if (f && m.sec.id === 'beaute' && !m.sec.profile && (card.identity || {}).name === 'Jason Reid') {
      const pc = (m.sec.profiles || []).find((x) => x.id === 'coiffure');
      if (pc) card = (m.lang === 'en' || (card.blocks.about || {}).text === ((m.sec.demoEn || {}).blocks || {}).about.text ? pc.demoEn : pc.demo) || card;
    }
    card = gender(card, m.sec.id, !!f);
    if (f) card = Object.assign({}, card, { identity: Object.assign({}, card.identity, { photo: f }) });
    return R0(Object.assign({}, m, { card }));
  };
  /* Studio : l’éditeur montre le même nom, métier et texte que l’aperçu du modèle choisi */
  NFC.demoSync = (card, sec, d) => {
    if (!card || !sec || !G[sec.id]) return;
    const c = gender(card, sec.id, !!faceFor({ sec, d, card }));
    if (c === card) return;
    card.identity = c.identity; card.blocks = c.blocks;
  };
  NFC.demoFace = faceFor;
})();
