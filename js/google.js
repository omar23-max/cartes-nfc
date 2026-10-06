/* Section « Avis Google » : note, nombre d’avis, bouton « Laisser un avis » et lien vers la fiche Google.
   Ajoutée à tous les secteurs juste avant les avis clients. Désactivée par défaut pour les professions encadrées.
   Chargé avant les fichiers de métiers : chaque métier reçoit la section avec l’exemple de son secteur. */
(function () {
  'use strict';

  const OFF = ['sante', 'conseil'];
  /* Note d’exemple par secteur (note, nombre d’avis) */
  const NOTE = { artisans: [4.9, 87], beaute: [4.8, 214], restaurant: [4.7, 532], coaching: [4.9, 64], auto: [4.6, 158], archi: [4.9, 41],
    immobilier: [4.9, 73], producteurs: [4.8, 96], evenementiel: [5, 38], hebergement: [4.8, 187], tourisme: [4.9, 129], animaux: [4.9, 112], boutiques: [4.8, 66] };

  NFC.SECTORS.forEach((s) => {
    if (!s.demo || s.blocks.some((b) => b.type === 'greviews')) return;
    const i = s.blocks.findIndex((b) => b.type === 'reviews');
    s.blocks.splice(i < 0 ? s.blocks.length : i, 0, { key: 'google', type: 'greviews', title: 'Avis Google', help: 'Votre note Google et un bouton pour laisser un avis' });
    const [r, n] = NOTE[s.id] || [4.8, 52];
    const on = !OFF.includes(s.id);
    s.demo.blocks.google = { on, rating: String(r).replace('.', ','), count: String(n), reviewUrl: 'https://g.page/r/exemple/review', mapsUrl: 'https://maps.app.goo.gl/exemple', text: 'Votre avis nous aide à grandir. Merci !' };
    if (s.demoEn) s.demoEn.blocks.google = { on, rating: String(r), count: String(n), reviewUrl: 'https://g.page/r/example/review', mapsUrl: 'https://maps.app.goo.gl/example', text: 'Your review helps us grow. Thank you!' };
  });
})();
