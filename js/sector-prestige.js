/* Secteur « Prestige & Art de vivre » : pour les personnes qui souhaitent offrir une image raffinée d’elles-mêmes
   (demeures, famille, collections, voyages, art, écurie, philanthropie, opéras…).
   5 modèles luxe dédiés (l1 à l5) + 10 modèles communs élégants = 15 modèles.
   Photos : Pexels, licence gratuite usage commercial. */
(function () {
  'use strict';
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const M = (f) => 'media/prestige/' + f + '.jpg';
  const B = (key, type, title, extra) => Object.assign({ key, type, title }, extra || {});

  const BLOCKS = [
    B('about', 'text', 'Mon univers', { help: '80 à 150 mots conseillés' }),
    B('demeures', 'gallery', 'Mes demeures', { help: 'Résidences, intérieurs, jardins' }),
    B('famille', 'gallery', 'Ma famille'),
    B('collection', 'cards', 'Ma collection', { help: 'Voitures, montres, vins, bateaux…' }),
    B('voyages', 'cards', 'Voyages'),
    B('art', 'gallery', 'Art & collections', { help: 'Tableaux, sculptures, objets d’art' }),
    B('ecurie', 'gallery', 'Écurie', { help: 'Chevaux, concours, courses' }),
    B('philanthropie', 'list', 'Engagements philanthropiques'),
    B('culture', 'list', 'Opéras & soirées', { help: 'Opéras, concerts, galas, expositions' }),
    B('video', 'video', 'En images'),
    B('contact', 'contact', 'Me contacter', { help: 'Messages envoyés à votre adresse courriel' }),
  ];

  const gal = (rows) => ({ on: true, images: rows.map(([f, cap]) => ({ src: M(f), cap })) });
  const cards = (rows) => ({ on: true, items: rows.map(([f, t, d]) => ({ t, d, p: '', img: M(f), url: '' })) });
  const list = (rows) => ({ on: true, items: rows.map(([t, d]) => ({ t, d, p: '' })) });

  const demo = (L) => ({
    primary: 'save',
    identity: { name: 'Alexandre Valmont', role: L.role, specialty: L.spec, company: 'Valmont Holdings', photo: M('portrait'), logo: '', cover: M('px37729825') },
    contact: { phone: '+1 514 555-0199', whatsapp: '+1 514 555-0199', email: 'alexandre@valmont.com', website: 'valmont.com' },
    socials: { linkedin: 'https://linkedin.com/', instagram: 'https://instagram.com/', facebook: '', tiktok: '', youtube: '' },
    blocks: {
      about: { on: true, text: L.about },
      demeures: gal(L.demeures),
      famille: gal(L.famille),
      collection: cards(L.collection),
      voyages: cards(L.voyages),
      art: gal(L.art),
      ecurie: gal(L.ecurie),
      philanthropie: list(L.phil),
      culture: list(L.culture),
      video: { on: false, url: '', cap: '', cover: '' },
      contact: { on: true, email: 'alexandre@valmont.com', text: L.contact, files: false },
    },
  });

  const FR = {
    role: 'Investisseur et mécène', spec: 'Montréal · Monaco · Genève',
    about: 'Entrepreneur et investisseur depuis vingt-cinq ans, je partage mon temps entre Montréal, Monaco et Genève.\nPassionné d’art, d’équitation et d’opéra, je soutiens l’éducation et la culture à travers la Fondation Valmont.',
    demeures: [['px37729825', 'Villa · Côte d’Azur'], ['px10923534', 'Résidence d’été'], ['px6957083', 'Le grand hall'], ['px33685860', 'Le salon'], ['px34496715', 'La suite']],
    famille: [['px18857314', 'En forêt'], ['px40065289', 'Notre fils'], ['px15293999', 'Noël en famille']],
    collection: [['px13044866', 'Rolls-Royce Phantom', 'Berline d’apparat'], ['px37871412', 'Mercedes 170 · 1936', 'Restaurée en 2022'], ['px19240616', 'McLaren 720S', 'Pour les circuits']],
    voyages: [['px3649755', 'Santorin', 'Chaque été en famille'], ['px35030752', 'Méditerranée', 'Croisières à la voile'], ['px5778470', 'Jet privé', 'Montréal · Genève · Monaco']],
    art: [['px7859041', 'Ma collection'], ['px13834911', 'Atelier d’un peintre'], ['px31052377', 'Huile sur toile']],
    ecurie: [['px32881093', 'Concours de saut'], ['px27740071', 'Au pré'], ['px27305789', 'Courses hippiques']],
    phil: [['Fondation Valmont pour l’éducation', 'Bourses pour 120 étudiants chaque année'], ['Hôpital pour enfants de Montréal', 'Membre du conseil · gala annuel'], ['Orchestre symphonique', 'Mécène principal depuis 2018']],
    culture: [['La Traviata', 'Opéra Garnier, Paris · 2025'], ['Tosca', 'Metropolitan Opera, New York · 2025'], ['Carmen', 'Opéra de Montréal · 2024'], ['Gala de la Fondation', 'Monaco · 2024']],
    contact: 'Pour toute demande, mon assistante vous répond dans les 24 heures.',
  };
  const EN = {
    role: 'Investor & patron of the arts', spec: 'Montreal · Monaco · Geneva',
    about: 'An entrepreneur and investor for twenty-five years, I split my time between Montreal, Monaco and Geneva.\nPassionate about art, horse riding and opera, I support education and culture through the Valmont Foundation.',
    demeures: [['px37729825', 'Villa · French Riviera'], ['px10923534', 'Summer residence'], ['px6957083', 'The grand hall'], ['px33685860', 'The living room'], ['px34496715', 'The suite']],
    famille: [['px18857314', 'In the woods'], ['px40065289', 'Our son'], ['px15293999', 'Christmas together']],
    collection: [['px13044866', 'Rolls-Royce Phantom', 'Formal sedan'], ['px37871412', 'Mercedes 170 · 1936', 'Restored in 2022'], ['px19240616', 'McLaren 720S', 'For track days']],
    voyages: [['px3649755', 'Santorini', 'Every summer with family'], ['px35030752', 'The Mediterranean', 'Sailing cruises'], ['px5778470', 'Private jet', 'Montreal · Geneva · Monaco']],
    art: [['px7859041', 'My collection'], ['px13834911', 'A painter’s studio'], ['px31052377', 'Oil on canvas']],
    ecurie: [['px32881093', 'Show jumping'], ['px27740071', 'In the pasture'], ['px27305789', 'Horse racing']],
    phil: [['Valmont Foundation for Education', 'Scholarships for 120 students every year'], ['Montreal Children’s Hospital', 'Board member · annual gala'], ['Symphony Orchestra', 'Principal patron since 2018']],
    culture: [['La Traviata', 'Opéra Garnier, Paris · 2025'], ['Tosca', 'Metropolitan Opera, New York · 2025'], ['Carmen', 'Opéra de Montréal · 2024'], ['Foundation Gala', 'Monaco · 2024']],
    contact: 'For any request, my assistant will get back to you within 24 hours.',
  };

  const LUXE_DESIGNS = [
    { id: 'l1', name: 'Gold', desc: 'Noir profond, cadre et nom dorés, portrait en médaillon : la signature du luxe.' },
    { id: 'l2', name: 'Marble', desc: 'Ivoire et veines de marbre, portrait en arche cerclée d’or : raffiné et lumineux.' },
    { id: 'l3', name: 'Emerald', desc: 'Vert émeraude et or, monogramme en blason : l’élégance des grandes maisons.' },
    { id: 'l4', name: 'Velvet', desc: 'Bordeaux velours, grand portrait, nom manuscrit doré : soirée et opéra.' },
    { id: 'l5', name: 'Riviera', desc: 'Votre demeure en grand, nom en capitales fines, portrait en médaillon : art de vivre.' },
  ];
  const ELEGANT = ['d2', 'd3', 'd5', 'd6', 'd7', 'd8', 'd10', 'd18', 'd19', 'd20'];

  const prestige = {
    id: 'prestige', code: 'F22', name: 'Prestige & Art de vivre', icon: 'gem', active: true, rec: 'l1',
    ex: 'Pour les personnes qui souhaitent offrir une image raffinée d’elles-mêmes : demeures, famille, collections, voyages, art, philanthropie…',
    palettes: [pal('Noir & or', '#16130f', '#c9a96e'), pal('Émeraude', '#0f3b2e', '#c9a96e'), pal('Bordeaux', '#5a0f1f', '#d4af7a'), pal('Marine', '#0f1f3d', '#c9a96e'), pal('Ivoire & or', '#3d342c', '#b8925a'), pal('Champagne', '#6b5a3e', '#e8d29f')],
    blocks: BLOCKS, demo: demo(FR), demoEn: demo(EN),
    designs: LUXE_DESIGNS.concat((NFC.DESIGNS || []).filter((d) => ELEGANT.includes(d.id))),
    designsOnly: true,
  };
  /* À la fin de la liste des secteurs */
  NFC.SECTORS.push(prestige);
  NFC.DESIGNS_ALL = (NFC.DESIGNS_ALL || NFC.DESIGNS || []).concat(LUXE_DESIGNS);
  NFC.MEDIA = NFC.MEDIA || {};
  NFC.MEDIA.prestige = { portrait: M('portrait'), cover: M('px37729825'), gallery: FR.demeures.map(([f, cap]) => ({ src: M(f), cap })), cards: FR.collection.map(([f]) => M(f)) };

  /* Anglais : nom du secteur, description, titres des sections */
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), {
    'Prestige & Art de vivre': 'Prestige & Lifestyle',
    'Pour les personnes qui souhaitent offrir une image raffinée d’elles-mêmes : demeures, famille, collections, voyages, art, philanthropie…': 'For people who want to present a refined image of themselves: homes, family, collections, travel, art, philanthropy…',
    'Mon univers': 'My world', 'Mes demeures': 'My residences', 'Ma famille': 'My family', 'Ma collection': 'My collection', 'Voyages': 'Travel',
    'Art & collections': 'Art & collections', 'Écurie': 'Stables', 'Engagements philanthropiques': 'Philanthropy', 'Opéras & soirées': 'Opera & evenings', 'En images': 'In pictures',
  });
})();
