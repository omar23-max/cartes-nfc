/* Sections « Suggérées pour vous » (étape Contenu) : propres à chaque secteur, métier, type de boutique et événement.
   Ordre = priorité ; on montre les 4 premières qui ne sont pas déjà sur la carte.
   Identifiants du catalogue (js/app.js) : text, services, faq, hours, location, cards, reviews, google, stats, tags,
   booking, form, products, action, links, gallery, imgcar, vidcar. Clé « secteur~métier » pour un métier précis. */
(function () {
  'use strict';
  const MEDIA = ['gallery', 'imgcar', 'vidcar'];
  const SHOP = ['imgcar', 'vidcar', 'faq', 'google', 'reviews', 'gallery', 'links'];
  const RESTO = ['imgcar', 'vidcar', 'booking', 'google', 'faq', 'gallery', 'reviews'];
  window.NFC = window.NFC || {};
  NFC.SEC_SUGGEST = {
    cards: {
      sante: ['booking', 'google', 'faq', 'hours', 'reviews', 'location', 'services', 'tags'],
      conseil: ['booking', 'services', 'faq', 'stats', 'google', 'reviews', 'form', 'links'],
      pro: ['links', 'stats', 'imgcar', 'vidcar', 'form', 'cards', 'text'],
      education: ['links', 'stats', 'cards', 'imgcar', 'vidcar', 'text', 'booking', 'faq'],
      'education~etudiant': ['links', 'stats', 'imgcar', 'vidcar', 'text', 'cards'],
      'education~stagiaire': ['links', 'stats', 'imgcar', 'vidcar', 'text', 'cards'],
      freelance: ['services', 'links', 'stats', 'reviews', 'form', 'imgcar', 'booking', 'faq'],
      immobilier: ['gallery', 'imgcar', 'google', 'reviews', 'stats', 'booking', 'form', 'vidcar'],
      archi: ['gallery', 'imgcar', 'vidcar', 'services', 'reviews', 'form', 'stats', 'booking'],
      artisans: ['gallery', 'services', 'google', 'reviews', 'form', 'faq', 'hours', 'location'],
      beaute: ['booking', 'services', 'gallery', 'google', 'reviews', 'hours', 'imgcar', 'location'],
      coaching: ['services', 'booking', 'vidcar', 'reviews', 'stats', 'gallery', 'faq', 'imgcar'],
      producteurs: ['products', 'hours', 'location', 'gallery', 'imgcar', 'google', 'faq', 'links'],
      evenementiel: ['gallery', 'vidcar', 'imgcar', 'services', 'reviews', 'form', 'faq', 'booking'],
      portfolio: ['gallery', 'imgcar', 'vidcar', 'links', 'services', 'form', 'reviews', 'text'],
      musique: ['vidcar', 'gallery', 'links', 'imgcar', 'cards', 'booking', 'form', 'text'],
      influence: ['vidcar', 'imgcar', 'links', 'stats', 'products', 'form', 'gallery', 'text'],
      hebergement: ['gallery', 'imgcar', 'booking', 'location', 'faq', 'google', 'services', 'vidcar'],
      tourisme: ['booking', 'gallery', 'vidcar', 'imgcar', 'services', 'google', 'faq', 'location'],
      animaux: ['booking', 'services', 'gallery', 'google', 'reviews', 'hours', 'location', 'faq'],
      boutiques: ['products', 'gallery', 'hours', 'location', 'google', 'imgcar', 'faq', 'links'],
      auto: ['services', 'booking', 'google', 'reviews', 'gallery', 'hours', 'location', 'imgcar'],
      'auto~collection': ['gallery', 'imgcar', 'vidcar', 'stats', 'text', 'links'],
      'auto~luxe': ['gallery', 'imgcar', 'vidcar', 'booking', 'google', 'reviews'],
      prestige: ['gallery', 'imgcar', 'vidcar', 'cards', 'text', 'links', 'stats', 'form'],
      restaurant: ['gallery', 'imgcar', 'vidcar', 'hours', 'google', 'location', 'booking', 'faq'],
      _: ['services', 'google', 'reviews', 'faq', 'hours', 'gallery', 'booking', 'location'],
    },
    stores: {
      fleuriste: ['imgcar', 'gallery', 'faq', 'google', 'vidcar', 'reviews'],
      librairie: ['imgcar', 'cards', 'faq', 'google', 'reviews', 'gallery'],
      velos: ['services', 'booking', 'imgcar', 'faq', 'google', 'reviews'],
      telephones: ['services', 'booking', 'faq', 'google', 'reviews', 'imgcar'],
      epicerie: ['imgcar', 'faq', 'google', 'links', 'reviews', 'gallery'],
      traiteur: ['imgcar', 'services', 'form', 'faq', 'google', 'vidcar'],
      animalerie: ['services', 'booking', 'imgcar', 'faq', 'google', 'reviews'],
      resto: RESTO,
      _: SHOP,
    },
    events: {
      mariage: ['imgcar', 'vidcar', 'gallery', 'cards', 'faq', 'links', 'text', 'location'],
      demande: MEDIA.concat(['text']),
      demoiselles: ['cards', 'imgcar', 'gallery', 'faq', 'links', 'vidcar'],
      naissance: MEDIA.concat(['text', 'links']),
      bapteme: MEDIA.concat(['cards', 'text', 'location']),
      babyshower: MEDIA.concat(['links', 'faq', 'text']),
      anniversaire: MEDIA.concat(['links', 'text', 'faq']),
      diplome: MEDIA.concat(['text', 'stats']),
      retraite: MEDIA.concat(['text', 'cards']),
      cremaillere: ['gallery', 'imgcar', 'location', 'faq', 'links', 'vidcar'],
      halloween: MEDIA.concat(['faq', 'text']),
      noel: MEDIA.concat(['text', 'links']),
      hanoukka: MEDIA.concat(['text']),
      nouvelan: ['vidcar', 'gallery', 'imgcar', 'faq', 'text'],
      valentin: MEDIA.concat(['text']),
      fetemeres: MEDIA.concat(['text']),
      fetesperes: MEDIA.concat(['text']),
      victoire: ['vidcar', 'gallery', 'imgcar', 'stats', 'text'],
      voyage: MEDIA.concat(['links', 'location', 'text']),
      divorce: ['text', 'gallery', 'links', 'imgcar'],
      remerciements: MEDIA.concat(['text']),
      hommage: MEDIA.concat(['text', 'links']),
      _: MEDIA.concat(['text', 'links', 'location', 'faq', 'cards']),
    },
  };
  /* Les restaurants de Stores (r-bistro, r-cafe…) */
  ['bistro', 'gastro', 'wok', 'sushi', 'pizzeria', 'steak', 'cafe', 'cocktail', 'brasserie', 'taqueria'].forEach((k) => { NFC.SEC_SUGGEST.stores['r-' + k] = RESTO; });
  /* Événements : sections d’entreprise retirées du catalogue (avis, produits, prise de rendez-vous) */
  NFC.SEC_HIDE = { events: ['google', 'reviews', 'products', 'booking'] };
})();
