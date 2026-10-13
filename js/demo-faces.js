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
  /* Démo au féminin quand la photo est celle d’une femme : seulement si le nom est encore celui de la démo */
  const FEM = {
    conseil: { 'Michael Bennett': ['Michelle Bennett', { 'Attaché commercial': 'Conseillère financière', 'Financial advisor': 'Financial advisor' }] },
    archi: { 'Daniel Brooks': ['Danielle Brooks', {}], 'Tom Barrett': ['Tess Barrett', { 'Jardinier': 'Jardinière' }], 'Victor Lane': ['Victoria Lane', {}],
      'Mike Donovan': ['Mia Donovan', { 'Entrepreneur général': 'Entrepreneure générale' }], 'Ryan Calloway': ['Rachel Calloway', { 'Concepteur de piscines': 'Conceptrice de piscines' }],
      'Graham Pierce': ['Grace Pierce', { 'Ingénieur en structure': 'Ingénieure en structure' }] },
    prestige: { 'Alexandre Valmont': ['Alexandra Valmont', { 'Investisseur et mécène': 'Investisseuse et mécène', 'Investor & patron of the arts': 'Investor & patron of the arts' }] },
  };
  const R0 = V.render;
  V.render = (m) => {
    const f = faceFor(m);
    if (!f) return R0(m);
    let card = m.card;
    /* Beauté sans métier choisi : la démo de base est un barbier → on prend la démo du salon de coiffure */
    if (m.sec.id === 'beaute' && !m.sec.profile && (card.identity || {}).name === 'Jason Reid') {
      const pc = (m.sec.profiles || []).find((x) => x.id === 'coiffure');
      if (pc) card = (m.lang === 'en' || (card.blocks.about || {}).text === ((m.sec.demoEn || {}).blocks || {}).about.text ? pc.demoEn : pc.demo) || card;
    }
    m = Object.assign({}, m, { card });
    const id = Object.assign({}, card.identity, { photo: f });
    const fm = (FEM[m.sec.id] || {})[id.name];
    if (fm) { id.name = fm[0]; if (fm[1][id.role]) id.role = fm[1][id.role]; }
    return R0(Object.assign({}, m, { card: Object.assign({}, m.card, { identity: id }) }));
  };
  NFC.demoFace = faceFor;
})();
