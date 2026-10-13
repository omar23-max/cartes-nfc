/* Immobilier : 10 modèles propres au métier (i1 à i10). Ils remplacent les modèles communs pour ce secteur.
   Photos d’exemple : Pexels, licence gratuite usage commercial. */
(function () {
  'use strict';
  const IMMO_DESIGNS = [
    { id: 'i1', name: 'Neighbor', desc: 'Photo de cuisine en couverture, « Bonjour, voisin ! » en lettres manuscrites, portrait rond.' },
    { id: 'i2', name: 'Realtor', desc: 'Fond blanc, portrait cerclé, nom manuscrit, bandeau noir de l’agence : la carte de visite classique de l’agent.' },
    { id: 'i3', name: 'Bold', desc: 'En-tête noir, grand portrait rectangulaire, nom de l’agence à la verticale : affirmé et moderne.' },
    { id: 'i4', name: 'Arch', desc: 'Tons sable, portrait en arche, nom manuscrit : doux et élégant.' },
    { id: 'i5', name: 'Just Listed', desc: 'Le bien vedette en premier : grande photo, prix, adresse, chambres et superficie.' },
    { id: 'i6', name: 'Introduction', desc: '« Bonjour, je suis… », grand nom en capitales, portrait rond : pour se présenter au quartier.' },
    { id: 'i7', name: 'Portrait', desc: 'Grand portrait pleine largeur, nom en élégantes capitales : vous en premier.' },
    { id: 'i8', name: 'Market', desc: 'Vos chiffres clés dès l’ouverture (ventes, délai, prix obtenu) : l’agent qui rassure par les résultats.' },
    { id: 'i9', name: 'Estate', desc: 'Fond noir, filets dorés, portrait cerclé d’or : haut de gamme et prestige.' },
    { id: 'i10', name: 'Editorial', desc: 'Nom en capitales espacées, grand portrait façon magazine, tons ivoire.' },
  ];
  /* Nouveaux modèles DER01 à DER10 (en-têtes dans js/designs-immo-der.js), proposés en premier */
  const DER_DESIGNS = [
    { id: 'der1', name: 'DER01 Voisin', desc: '« Nous venons de vendre la maison de votre voisin » : photo de cuisine, portrait détouré, titre en capitales et cursive.' },
    { id: 'der2', name: 'DER02 Curieux', desc: '« Curieux ? » en cursive dans un cadre sombre sur la photo : la vraie valeur de votre maison.' },
    { id: 'der3', name: 'DER03 Bonjour', desc: '« bonjour, je suis » en cursive, grand nom en capitales, bandeau sable : pour se présenter.' },
    { id: 'der4', name: 'DER04 Portrait', desc: 'Grand portrait plein cadre qui se fond dans le blanc, nom en grandes capitales fines.' },
    { id: 'der5', name: 'DER05 Médaillon', desc: 'Portrait en médaillon sur une photo d’intérieur, nom manuscrit, contacts et bandeau de l’agence.' },
    { id: 'der6', name: 'DER06 Signature', desc: 'Carte de visite blanche, portrait cerclé, nom en signature manuscrite, bandeau gris de l’agence.' },
    { id: 'der7', name: 'DER07 Dôme', desc: 'Logo maison et agence en haut, dôme gris derrière le portrait, contacts alignés.' },
    { id: 'der8', name: 'DER08 Merci', desc: 'Suivi de visite libre : bandeau noir avec l’adresse, « Merci » en grand, « Ravie de vous avoir rencontré ! » en cursive.' },
    { id: 'der9', name: 'DER09 Merci cursive', desc: '« merci » manuscrit dans un cadre noir posé sur la photo, texte encadré, portrait.' },
    { id: 'der10', name: 'DER10 Je peux aider', desc: 'Fond anthracite, « Vous pensez vendre ? », « Je peux vous aider ! » en grande cursive, portrait cerclé.' },
  ];
  const immo = (NFC.SECTORS || []).find((s) => s.id === 'immobilier');
  if (immo) {
    immo.designs = DER_DESIGNS.concat(IMMO_DESIGNS).concat((NFC.DESIGNS || []).filter((x) => /^d(1[6-9]|20)$/.test(x.id)));
    immo.designsOnly = true; /* seuls ces modèles sont proposés pour l’immobilier */
    immo.rec = 'i1';
  }
  NFC.DESIGNS_ALL = (NFC.DESIGNS_ALL || NFC.DESIGNS || []).concat(DER_DESIGNS, IMMO_DESIGNS);
  NFC.IMMO_DESIGNS = IMMO_DESIGNS;
})();
