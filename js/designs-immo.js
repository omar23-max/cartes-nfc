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
  const immo = (NFC.SECTORS || []).find((s) => s.id === 'immobilier');
  if (immo) {
    immo.designs = IMMO_DESIGNS.concat((NFC.DESIGNS || []).filter((x) => /^d(1[6-9]|20)$/.test(x.id)));
    immo.designsOnly = true; /* seuls ces modèles sont proposés pour l’immobilier */
    immo.rec = 'i1';
  }
  NFC.DESIGNS_ALL = (NFC.DESIGNS_ALL || NFC.DESIGNS || []).concat(IMMO_DESIGNS);
  NFC.IMMO_DESIGNS = IMMO_DESIGNS;
})();
