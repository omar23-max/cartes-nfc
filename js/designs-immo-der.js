/* Immobilier : 10 nouveaux modèles DER01 à DER10 (en-têtes). Chargé après js/render.js.
   Les anciens modèles i1–i10 restent disponibles. Photos d’exemple : fournies par l’utilisateur (droits confirmés) et Pexels. */
(function () {
  'use strict';
  const V = window.VC;
  if (!V) return;
  const esc = V.esc, ic = V.ic, L2 = (fr, en) => V.L2(fr, en);
  const MI = 'media/immobilier/';
  /* Photo d’exemple propre à chaque modèle, tant que la personne garde la photo de démonstration */
  const FACE = { der1: 'der1', der2: 'der6', der3: 'der4', der4: 'der5', der5: 'der8', der6: 'der7', der7: 'der3', der8: 'der1', der9: 'der2', der10: 'der9' };
  const ROOM = { der1: 'px7166645', der2: 'px7174113', der3: 'px29012619', der5: 'px276746', der8: 'px39829574', der9: 'px4119832' };
  const demoOf = () => (NFC.MEDIA && NFC.MEDIA.immobilier) || {};
  function face(m) {
    const p = (m.card.identity || {}).photo;
    return !p || p === demoOf().portrait ? MI + FACE[m.d] + '.jpg' : V.img(p, m);
  }
  function room(m) {
    const id = m.card.identity || {}, c = id.cover;
    return (!c || c === demoOf().cover) && ROOM[m.d] ? MI + ROOM[m.d] + '.jpg' : V.img(c || id.photo || 'ph:cover|', m);
  }
  const parts = (m) => {
    const id = m.card.identity || {}, ct = m.card.contact || {};
    const role = esc(id.role), co = esc(id.company), spec = esc(id.specialty);
    const rows = [[ct.phone, 'phone', 'tel:' + String(ct.phone || '').replace(/[^\d+]/g, '')], [ct.email, 'mail', 'mailto:' + (ct.email || '')], [ct.website, 'globe', V.url ? V.url(ct.website || '') : ct.website]]
      .filter((r) => r[0]).map(([v, i, h]) => `<a class="dr-row" href="${esc(h)}"${i === 'globe' ? ' target="_blank" rel="noopener"' : ''}>${ic(i, 16)}<span>${esc(v)}</span></a>`).join('');
    return { name: esc(id.name || 'Votre nom'), first: esc(String(id.name || '').split(' ')[0] || ''), role, co, spec,
      roleP: role ? `<p class="role">${role}</p>` : '', coP: co ? `<p class="co">${co}</p>` : '', specP: spec ? `<p class="spec">${spec}</p>` : '',
      rows: rows ? `<div class="dr-rows">${rows}</div>` : '' };
  };
  const H = {
    /* DER01 : « Nous avons vendu la maison de votre voisin », photo de cuisine, portrait détouré */
    der1: (m) => { const p = parts(m); return `<header class="hd"><div class="r1-top"><img class="r1-room" src="${room(m)}" alt=""><img class="r1-face" src="${face(m)}" alt=""></div>
      <div class="r1-txt"><p class="r1-sc">${L2('Nous venons de vendre', 'We just sold your')}</p><p class="r1-big">${L2('la maison de votre voisin', 'neighbor’s house')}</p><p class="r1-it">${L2('Je peux vendre la vôtre aussi !', 'I can sell yours too!')}</p></div>
      <div class="r1-id"><h1>${p.name}</h1>${p.roleP}${p.coP}</div>${p.specP}</header>`; },
    /* DER02 : « Curieux ? » dans un cadre sombre sur la photo, la vraie valeur de votre maison */
    der2: (m) => { const p = parts(m); return `<header class="hd"><div class="r2-top"><img src="${room(m)}" alt=""><span class="r2-box">${L2('Curieux ?', 'Curious?')}</span></div>
      <p class="r2-q">${L2('de ce que vaut', 'about what your home is')} <em>${L2('vraiment', 'really')}</em> ${L2('votre maison ?', 'worth?')}</p>${p.specP}
      <div class="r2-ag"><img src="${face(m)}" alt=""><div><p class="r2-call">${L2('Appelez-moi pour une évaluation gratuite !', 'Call me for a free home evaluation!')}</p><h1>${p.name}</h1>${p.roleP}${p.coP}</div></div></header>`; },
    /* DER03 : « bonjour, je suis » en cursive, nom en capitales, bandeau sable */
    der3: (m) => { const p = parts(m); return `<header class="hd"><div class="r3-ph"><img src="${face(m)}" alt=""></div><p class="r3-hi">${L2('bonjour, je suis', 'hello, I am')}</p><h1>${p.name}</h1>
      ${p.role ? `<p class="r3-band">${p.role}</p>` : ''}${p.specP}<p class="r3-sc">${L2('écrivez-moi', 'contact me today')}</p>${p.rows}${p.co ? `<p class="r3-co">${p.co}</p>` : ''}</header>`; },
    /* DER04 : grand portrait plein cadre, nom en grandes capitales fines */
    der4: (m) => { const p = parts(m); return `<header class="hd"><div class="r4-ph"><img src="${face(m)}" alt=""><div class="r4-fade"></div></div><div class="r4-id"><h1>${p.name}</h1>${p.roleP}${p.rows}${p.co ? `<p class="r4-co">${p.co}</p>` : ''}</div>${p.specP}</header>`; },
    /* DER05 : portrait en médaillon sur une photo d’intérieur, nom manuscrit */
    der5: (m) => { const p = parts(m); return `<header class="hd"><div class="r5-top"><img src="${room(m)}" alt=""></div><div class="r5-av"><img src="${face(m)}" alt=""></div><h1>${p.name}</h1>${p.roleP}${p.rows}${p.specP}${p.co ? `<p class="r5-band">${p.co}</p>` : ''}</header>`; },
    /* DER06 : carte de visite blanche, portrait cerclé, signature manuscrite, bandeau gris de l’agence */
    der6: (m) => { const p = parts(m); return `<header class="hd"><div class="r6-av"><img src="${face(m)}" alt=""></div><h1>${p.name}</h1>${p.roleP}${p.rows}${p.specP}${p.co ? `<p class="r6-band">${ic('house', 15)}<span>${p.co}</span></p>` : ''}</header>`; },
    /* DER07 : logo maison et agence, dôme gris derrière le portrait, contacts alignés */
    der7: (m) => { const p = parts(m); return `<header class="hd"><p class="r7-lg">${ic('house', 26)}<span>${p.co || 'Votre agence'}</span></p><div class="r7-dome"><img src="${face(m)}" alt=""></div><h1>${p.name}</h1>${p.roleP}${p.rows}${p.specP}</header>`; },
    /* DER08 : suivi de visite libre, bandeau noir avec l’adresse, « Merci » en grand */
    der8: (m) => { const p = parts(m); return `<header class="hd"><div class="r8-top"><img src="${room(m)}" alt="">${p.spec ? `<span class="r8-addr">${p.spec}</span>` : ''}</div>
      <p class="r8-t">${L2('Merci', 'Thank you')}</p><p class="r8-s">${L2('d’être venu à la visite libre', 'for stopping by our open house')}</p>
      <div class="r8-ag"><img src="${face(m)}" alt=""><div><p class="r8-sc">${L2('Ravie de vous avoir rencontré !', 'Nice to meet you!')}</p><h1>${p.name}</h1>${p.roleP}${p.coP}</div></div></header>`; },
    /* DER09 : « merci » manuscrit dans un cadre noir posé sur la photo */
    der9: (m) => { const p = parts(m); return `<header class="hd"><div class="r9-top"><img src="${room(m)}" alt=""><span class="r9-box">${L2('merci', 'thank you')}</span></div><p class="r9-s">${L2('d’être venu à ma visite libre !', 'for coming to our open house!')}</p>
      ${p.spec ? `<p class="r9-frame">${p.spec}</p>` : ''}<div class="r9-ag"><div><h1>${p.name}</h1>${p.roleP}${p.coP}</div><img src="${face(m)}" alt=""></div></header>`; },
    /* DER10 : fond anthracite, « Vous pensez vendre ? », « Je peux vous aider ! » en cursive */
    der10: (m) => { const p = parts(m); return `<header class="hd"><p class="r10-q">${L2('Vous pensez vendre votre maison ?', 'Thinking of selling your home?')}</p><p class="r10-n">${L2('C’est le moment.', 'Now is the time.')}</p><p class="r10-sc">${L2('Je peux vous aider !', 'I can help!')}</p>
      <div class="r10-av"><img src="${face(m)}" alt=""></div><h1>${p.name}</h1>${p.roleP}${p.coP}${p.specP}</header>`; },
  };
  V.HEADERS = Object.assign(V.HEADERS || {}, H);
})();
