/* Catalogue : 20 secteurs × 5 designs. Seuls les secteurs `active: true` sont remplis dans le site test. */
window.NFC = window.NFC || {};

(function () {
  const pal = (name, p, a, bg, sf, tx, mu, ln) => ({ name, p, a, bg, sf, tx, mu, ln });

  const GENERIC = [
    pal('Marine', '#1e3a8a', '#3b82f6', '#f4f6fa', '#ffffff', '#0f172a', '#5b6477', '#e2e8f0'),
    pal('Anthracite', '#27272a', '#a1a1aa', '#f5f5f5', '#ffffff', '#18181b', '#65656d', '#e5e5e5'),
    pal('Émeraude', '#065f46', '#34d399', '#f2f8f5', '#ffffff', '#0b1f18', '#55706a', '#dbebe4'),
    pal('Bordeaux', '#831843', '#f472b6', '#faf4f7', '#ffffff', '#23101a', '#705c66', '#efdde6'),
    pal('Indigo', '#3730a3', '#818cf8', '#f5f5fc', '#ffffff', '#15143a', '#626181', '#e3e3f5'),
  ];

  const DESIGNS = [
    { id: 'd1', name: 'Essentiel', desc: 'Compact, boutons visibles immédiatement, lecture rapide.' },
    { id: 'd2', name: 'Éditorial', desc: 'Grands titres, sections aérées : met en valeur l’expertise.' },
    { id: 'd3', name: 'Visuel', desc: 'Grande photo d’ouverture et galerie dominante.' },
    { id: 'd4', name: 'Humain', desc: 'Portrait mis en avant, blocs arrondis, ton personnel.' },
    { id: 'd5', name: 'Immersif', desc: 'Ouverture plein écran, ambiance sombre et narrative.' },
    { id: 'd6', name: 'Carte', desc: 'Une fiche posée sur la couverture, comme une vraie carte de visite.' },
    { id: 'd7', name: 'Minimal', desc: 'Noir et blanc, typographie forte, aucun superflu.' },
    { id: 'd8', name: 'Mosaïque', desc: 'Tuiles façon bento : photo, portrait et accroche d’un coup d’œil.' },
    { id: 'd9', name: 'Vague', desc: 'En-tête en dégradé coloré, portrait centré, ton chaleureux.' },
    { id: 'd10', name: 'Prestige', desc: 'Ivoire, typographie classique, portrait en arche : haut de gamme.' },
  ];

  const hours = (rows, note = '') => ({ on: true, rows: rows.map(([d, h]) => ({ d, h })), note });

  /* ---------- F07 Artisans ---------- */
  const artisans = {
    id: 'artisans', code: 'F07', name: 'Artisans et travaux', icon: 'hammer', active: true, rec: 'd1',
    ex: 'Plombier, électricien, maçon, peintre, couvreur…',
    palettes: [
      pal('Bleu chantier', '#1d4ed8', '#f59e0b', '#f3f6fb', '#ffffff', '#0f172a', '#5b6477', '#e2e8f0'),
      pal('Orange sécurité', '#c2410c', '#fbbf24', '#fbf6f1', '#ffffff', '#1c1917', '#6b635c', '#eee3d8'),
      pal('Vert atelier', '#166534', '#eab308', '#f3f7f2', '#ffffff', '#132016', '#5a6b5d', '#dfe9dd'),
      pal('Graphite', '#18181b', '#eab308', '#f4f4f5', '#ffffff', '#18181b', '#63636b', '#e4e4e7'),
      pal('Rouge brique', '#9f1239', '#fb923c', '#faf5f5', '#ffffff', '#1f1315', '#6e5b5f', '#efdfe2'),
    ],
    blocks: [
      { key: 'about', type: 'text', title: 'Présentation', help: '100 à 200 mots conseillés' },
      { key: 'services', type: 'list', title: 'Prestations', price: true, help: 'Vos services et, si vous le souhaitez, vos prix' },
      { key: 'zone', type: 'tags', title: 'Zone d’intervention', icon: 'pin', withText: true, help: 'Villes ou quartiers desservis' },
      { key: 'gallery', type: 'gallery', title: 'Réalisations', help: '4 à 8 photos, idéalement avant / après' },
      { key: 'quote', type: 'form', title: 'Demande de devis', cta: 'Demander un devis', help: 'Formulaire envoyé à votre adresse email' },
      { key: 'hours', type: 'hours', title: 'Horaires' },
      { key: 'qualif', type: 'tags', title: 'Qualifications & garanties', icon: 'shield' },
      { key: 'video', type: 'video', title: 'Vidéo', help: 'Présentation ou démonstration (facultatif)' },
    ],
    demo: {
      primary: 'call',
      identity: { name: 'Yanis Morel', role: 'Plombier chauffagiste', specialty: 'Dépannage 7j/7 · Rénovation de salles de bain', company: 'Morel Plomberie', photo: 'ph:portrait', logo: '', cover: 'ph:cover|Chantier en cours' },
      contact: { phone: '06 12 34 56 78', whatsapp: '+33 6 12 34 56 78', email: 'contact@morel-plomberie.fr', website: 'morel-plomberie.fr' },
      socials: { linkedin: '', instagram: '', facebook: 'https://facebook.com/', tiktok: '', youtube: '' },
      blocks: {
        about: { on: true, text: 'Artisan plombier depuis 12 ans, j’interviens rapidement pour vos fuites, débouchages et pannes de chauffe-eau.\nJe réalise aussi vos rénovations de salles de bain, de la conception à la pose. Devis gratuit, travail soigné et chantier laissé propre.' },
        services: { on: true, items: [
          { t: 'Dépannage & recherche de fuite', d: 'Intervention en moins de 2 h en cas d’urgence', p: 'dès 89 €' },
          { t: 'Débouchage de canalisations', d: 'Évier, WC, colonne ; inspection caméra si besoin', p: 'dès 120 €' },
          { t: 'Chauffe-eau & chaudière', d: 'Remplacement, entretien annuel, mise en service', p: 'Sur devis' },
          { t: 'Rénovation de salle de bain', d: 'Douche à l’italienne, accès PMR, clé en main', p: 'Sur devis' },
        ] },
        zone: { on: true, tags: 'Lyon, Villeurbanne, Vénissieux, Bron, Caluire', text: 'Déplacement offert dans un rayon de 20 km.' },
        gallery: { on: true, images: [
          { src: 'ph:photo|Salle de bain rénovée', cap: 'Salle de bain rénovée' },
          { src: 'ph:photo|Douche à l’italienne', cap: 'Douche à l’italienne' },
          { src: 'ph:photo|Chauffe-eau', cap: 'Pose d’un chauffe-eau' },
          { src: 'ph:photo|Cuisine', cap: 'Raccordement cuisine' },
          { src: 'ph:photo|Avant / après', cap: 'Avant / après' },
          { src: 'ph:photo|Chaufferie', cap: 'Chaufferie' },
        ] },
        quote: { on: true, email: 'contact@morel-plomberie.fr', text: 'Décrivez votre besoin : je vous rappelle sous 24 h avec un devis gratuit.', photos: true },
        hours: hours([['Lundi – Vendredi', '8h – 19h'], ['Samedi', '9h – 13h'], ['Dimanche', 'Urgences uniquement']], 'Urgences 24h/24, 7j/7'),
        qualif: { on: true, tags: 'Assurance décennale, Certifié RGE, Qualibat, Devis gratuit', text: '' },
        video: { on: false, url: '', cap: 'Présentation en vidéo', cover: '' },
      },
    },
  };

  /* ---------- F01 Santé ---------- */
  const sante = {
    id: 'sante', code: 'F01', name: 'Santé et consultations', icon: 'stethoscope', active: true, rec: 'd1',
    ex: 'Médecin, dentiste, kiné, psychologue, ostéopathe…',
    palettes: [
      pal('Bleu clinique', '#0369a1', '#38bdf8', '#f2f7fa', '#ffffff', '#0c1d2a', '#557080', '#dde9f0'),
      pal('Menthe', '#0f766e', '#5eead4', '#f1f8f6', '#ffffff', '#0d201d', '#56716c', '#d9ece7'),
      pal('Lavande', '#6d28d9', '#c4b5fd', '#f7f5fc', '#ffffff', '#1b1530', '#6a6280', '#e7e1f5'),
      pal('Bleu nuit', '#1e3a8a', '#93c5fd', '#f3f5fa', '#ffffff', '#0f172a', '#5b6477', '#e0e6f2'),
      pal('Sable', '#92600a', '#e9c46a', '#faf7f0', '#ffffff', '#231c0f', '#6f6653', '#ece4d2'),
    ],
    blocks: [
      { key: 'about', type: 'text', title: 'Présentation', help: '100 à 200 mots conseillés' },
      { key: 'services', type: 'list', title: 'Soins & spécialités', price: false },
      { key: 'booking', type: 'action', title: 'Rendez-vous', cta: 'Prendre rendez-vous', icon: 'cal', help: 'Lien vers votre agenda (Doctolib, Calendly…)' },
      { key: 'location', type: 'location', title: 'Cabinet & accès' },
      { key: 'hours', type: 'hours', title: 'Horaires' },
      { key: 'gallery', type: 'gallery', title: 'Le cabinet', help: '1 à 3 photos' },
      { key: 'languages', type: 'tags', title: 'Langues parlées', icon: 'globe' },
      { key: 'docs', type: 'links', title: 'Préparer votre consultation', help: 'Documents ou liens utiles' },
      { key: 'video', type: 'video', title: 'Vidéo de présentation' },
    ],
    demo: {
      primary: 'booking',
      identity: { name: 'Dr Claire Martin', role: 'Chirurgien-dentiste', specialty: 'Implantologie · Soins esthétiques', company: 'Cabinet dentaire des Tilleuls', photo: 'ph:portrait', logo: '', cover: 'ph:cover|Le cabinet' },
      contact: { phone: '04 78 12 34 56', whatsapp: '', email: 'cabinet@dentiste-tilleuls.fr', website: 'dentiste-tilleuls.fr' },
      socials: { linkedin: 'https://linkedin.com/', instagram: '', facebook: '', tiktok: '', youtube: '' },
      blocks: {
        about: { on: true, text: 'Diplômée de la faculté de Lyon, j’exerce depuis 2011 une dentisterie douce et attentive.\nLe cabinet est équipé d’une radiologie numérique et accueille adultes et enfants. Chaque plan de traitement vous est expliqué et chiffré avant de commencer.' },
        services: { on: true, items: [
          { t: 'Soins conservateurs', d: 'Caries, dévitalisations, détartrage', p: '' },
          { t: 'Implantologie', d: 'Pose et suivi d’implants dentaires', p: '' },
          { t: 'Esthétique du sourire', d: 'Blanchiment, facettes', p: '' },
          { t: 'Soins des enfants', d: 'Accueil dès 3 ans, prévention', p: '' },
        ] },
        booking: { on: true, label: 'Prendre rendez-vous', url: 'https://www.doctolib.fr/', text: 'Réservation en ligne 24h/24. En cas d’urgence, appelez le cabinet.' },
        location: { on: true, address: '12 avenue des Tilleuls, 69003 Lyon', access: 'Métro D – Garibaldi · Parking à 50 m · Cabinet accessible PMR' },
        hours: hours([['Lundi – Vendredi', '9h – 19h'], ['Samedi', '9h – 12h'], ['Dimanche', 'Fermé']]),
        gallery: { on: true, images: [
          { src: 'ph:photo|Salle d’attente', cap: 'Salle d’attente' },
          { src: 'ph:photo|Salle de soins', cap: 'Salle de soins' },
          { src: 'ph:photo|Accueil', cap: 'Accueil' },
        ] },
        languages: { on: true, tags: 'Français, Anglais, Arabe', text: '' },
        docs: { on: false, items: [{ label: 'Questionnaire médical', url: 'https://example.com' }, { label: 'Consignes après une extraction', url: 'https://example.com' }] },
        video: { on: false, url: '', cap: '', cover: '' },
      },
    },
  };

  /* ---------- F10 Restaurant ---------- */
  const restaurant = {
    id: 'restaurant', code: 'F10', name: 'Restaurant, café et bar', icon: 'utensils-crossed', active: true, rec: 'd3', establishment: true,
    ex: 'Restaurant, café, bar, brasserie, food truck…',
    palettes: [
      pal('Bordeaux', '#7f1d1d', '#d4a373', '#faf6f1', '#ffffff', '#23140f', '#6d5c55', '#ecdfd4'),
      pal('Olive', '#4d5b16', '#d9a441', '#f6f6ee', '#ffffff', '#1d2010', '#63664f', '#e3e4d2'),
      pal('Terracotta', '#b4441b', '#f2c14e', '#fbf4ee', '#ffffff', '#2a160c', '#76604f', '#f0dfd0'),
      pal('Noir & or', '#1c1917', '#c9a227', '#f7f4ee', '#ffffff', '#1c1917', '#6b645a', '#e8e1d4'),
      pal('Bleu méditerranée', '#1e4f8a', '#e9b44c', '#f3f6f9', '#ffffff', '#0f1c2c', '#5a6776', '#dde5ee'),
    ],
    blocks: [
      { key: 'about', type: 'text', title: 'Notre maison', help: '50 à 120 mots conseillés' },
      { key: 'menu', type: 'menu', title: 'La carte' },
      { key: 'gallery', type: 'gallery', title: 'Ambiance & plats', help: '5 à 10 photos' },
      { key: 'booking', type: 'action', title: 'Réservation', cta: 'Réserver une table', icon: 'utensils', help: 'Lien TheFork, Zenchef, Google…' },
      { key: 'order', type: 'action', title: 'À emporter', cta: 'Commander', icon: 'bag', help: 'Lien de commande ou de livraison' },
      { key: 'hours', type: 'hours', title: 'Horaires' },
      { key: 'location', type: 'location', title: 'Nous trouver' },
      { key: 'video', type: 'video', title: 'Vidéo d’ambiance' },
    ],
    demo: {
      primary: 'booking',
      identity: { name: 'Le Comptoir des Halles', role: 'Bistrot · Cuisine du marché', specialty: 'Fait maison, produits de saison', company: '', photo: 'ph:logo', logo: '', cover: 'ph:cover|La salle' },
      contact: { phone: '04 72 00 11 22', whatsapp: '', email: 'bonjour@comptoir-halles.fr', website: 'comptoir-halles.fr' },
      socials: { linkedin: '', instagram: 'https://instagram.com/', facebook: 'https://facebook.com/', tiktok: '', youtube: '' },
      blocks: {
        about: { on: true, text: 'Une cuisine de bistrot généreuse, pensée chaque matin selon le marché. Midi et soir, dans une salle chaleureuse de 40 couverts et sur notre terrasse aux beaux jours.' },
        menu: { on: true, cats: [
          { name: 'Entrées', items: [
            { t: 'Œuf parfait', d: 'Crème de champignons, croûtons', p: '9 €' },
            { t: 'Velouté de potimarron', d: 'Noisettes torréfiées', p: '8 €' },
            { t: 'Burrata crémeuse', d: 'Tomates anciennes, basilic', p: '12 €' },
          ] },
          { name: 'Plats', items: [
            { t: 'Joue de bœuf braisée', d: 'Purée maison, jus corsé', p: '22 €' },
            { t: 'Filet de dorade', d: 'Légumes de saison, beurre citronné', p: '21 €' },
            { t: 'Risotto aux cèpes', d: 'Parmesan affiné 24 mois', p: '19 €' },
          ] },
          { name: 'Desserts', items: [
            { t: 'Tarte fine aux pommes', d: 'Glace vanille', p: '8 €' },
            { t: 'Mousse au chocolat noir', d: '', p: '7 €' },
            { t: 'Café gourmand', d: '', p: '9 €' },
          ] },
        ] },
        gallery: { on: true, images: [
          { src: 'ph:photo|Joue de bœuf', cap: 'Joue de bœuf braisée' },
          { src: 'ph:photo|La terrasse', cap: 'La terrasse' },
          { src: 'ph:photo|Dessert du jour', cap: 'Dessert du jour' },
          { src: 'ph:photo|Le bar', cap: 'Le bar' },
          { src: 'ph:photo|Burrata', cap: 'Burrata' },
          { src: 'ph:photo|La salle', cap: 'La salle' },
        ] },
        booking: { on: true, label: 'Réserver une table', url: 'https://www.thefork.fr/', text: 'Réservation en ligne ou par téléphone. Groupes jusqu’à 20 personnes.' },
        order: { on: false, label: 'Commander à emporter', url: '', text: 'Retrait sur place du mardi au samedi.' },
        hours: hours([['Lundi', 'Fermé'], ['Mardi – Vendredi', '12h – 14h30 · 19h – 22h30'], ['Samedi', '19h – 23h'], ['Dimanche', '12h – 15h']]),
        location: { on: true, address: '8 rue des Halles, 69002 Lyon', access: 'Terrasse · Accès PMR · Parking Saint-Antoine' },
        video: { on: false, url: '', cap: '', cover: '' },
      },
    },
  };

  /* ---------- F03 Carte pro ---------- */
  const pro = {
    id: 'pro', code: 'F03', name: 'Carte professionnelle et réseautage', icon: 'contact', active: true, rec: 'd1',
    ex: 'Dirigeant, commercial, manager, salarié, recruteur…',
    palettes: GENERIC,
    blocks: [
      { key: 'about', type: 'text', title: 'À propos', help: '40 à 100 mots conseillés' },
      { key: 'links', type: 'links', title: 'Documents & liens', help: 'Brochure, site, références…' },
      { key: 'booking', type: 'action', title: 'Rendez-vous', cta: 'Planifier un rendez-vous', icon: 'cal', help: 'Lien Calendly ou équivalent' },
      { key: 'location', type: 'location', title: 'Adresse' },
      { key: 'video', type: 'video', title: 'Présentation vidéo' },
    ],
    demo: {
      primary: 'save',
      identity: { name: 'Sophie Laurent', role: 'Directrice commerciale', specialty: 'Solutions logistiques B2B', company: 'Nordlink Logistics', photo: 'ph:portrait', logo: '', cover: 'ph:cover|Entrepôt Nordlink' },
      contact: { phone: '06 98 76 54 32', whatsapp: '', email: 's.laurent@nordlink.fr', website: 'nordlink.fr' },
      socials: { linkedin: 'https://linkedin.com/', instagram: '', facebook: '', tiktok: '', youtube: '' },
      blocks: {
        about: { on: true, text: 'J’accompagne les distributeurs et e-commerçants dans l’optimisation de leur chaîne logistique : entreposage, transport et préparation de commandes. Parlons de vos volumes et de vos délais.' },
        links: { on: true, items: [
          { label: 'Brochure Nordlink (PDF)', url: 'https://example.com' },
          { label: 'Nos références clients', url: 'https://example.com' },
        ] },
        booking: { on: false, label: 'Planifier un rendez-vous', url: 'https://calendly.com/', text: 'Choisissez un créneau de 30 minutes.' },
        location: { on: false, address: 'Parc des Berges, 59000 Lille', access: '' },
        video: { on: false, url: '', cap: '', cover: '' },
      },
    },
  };

  const soon = (code, id, name, icon, ex) => ({ id, code, name, icon, ex, active: false, palettes: GENERIC, blocks: [] });

  const SECTORS = [
    sante,
    soon('F02', 'conseil', 'Droit, finance et conseil', 'scale', 'Avocat, notaire, banquier, conseiller en patrimoine…'),
    pro,
    soon('F04', 'freelance', 'Freelance, IT et prestations intellectuelles', 'laptop', 'Développeur, consultant, traducteur, rédacteur…'),
    soon('F05', 'immobilier', 'Immobilier', 'house', 'Agent immobilier, mandataire, promoteur…'),
    soon('F06', 'archi', 'Architecture et conception d’espaces', 'drafting-compass', 'Architecte, décorateur, paysagiste, cuisiniste…'),
    artisans,
    soon('F08', 'beaute', 'Beauté et bien-être', 'sparkles', 'Coiffeur, barbier, esthéticienne, spa…'),
    soon('F09', 'coaching', 'Coaching, sport et formation', 'dumbbell', 'Coach sportif, yoga, formateur, musique…'),
    restaurant,
    soon('F11', 'producteurs', 'Producteurs et commerces alimentaires', 'wheat', 'Maraîcher, boulanger, fromager, viticulteur…'),
    soon('F12', 'evenementiel', 'Mariage et événementiel', 'party-popper', 'Wedding planner, traiteur, décorateur…'),
    soon('F13', 'portfolio', 'Portfolio artistique et visuel', 'camera', 'Photographe, graphiste, illustrateur, tatoueur…'),
    soon('F14', 'musique', 'Musique et spectacle', 'music', 'Musicien, DJ, comédien, magicien…'),
    soon('F15', 'influence', 'Influence et création de contenu', 'video', 'Influenceur, YouTubeur, créateur UGC…'),
    soon('F16', 'hebergement', 'Hébergement et lieux à louer', 'bed-double', 'Hôtel, gîte, salle de réception, coworking…'),
    soon('F17', 'tourisme', 'Tourisme et expériences', 'map', 'Guide, excursions, agence de voyages…'),
    soon('F18', 'animaux', 'Services aux animaux', 'paw-print', 'Toiletteur, éducateur canin, pet sitter…'),
    soon('F19', 'boutiques', 'Boutiques, marques et artisanat', 'shopping-bag', 'Boutique de mode, bijoutier, céramiste…'),
    soon('F20', 'auto', 'Automobile et mobilité', 'car', 'Garagiste, carrossier, VTC, loueur…'),
  ];

  /* « Je ne trouve pas mon secteur » : on oriente par l’action attendue du visiteur. */
  const OTHER = [
    { label: 'M’appeler ou me demander un devis', icon: 'phone', sector: 'artisans' },
    { label: 'Prendre rendez-vous avec moi', icon: 'calendar', sector: 'sante' },
    { label: 'Réserver une table, une chambre ou une activité', icon: 'calendar-check', sector: 'hebergement' },
    { label: 'Commander ou acheter mes produits', icon: 'shopping-bag', sector: 'boutiques' },
    { label: 'Voir mes réalisations en photos', icon: 'images', sector: 'portfolio' },
    { label: 'Me proposer une mission ou une collaboration', icon: 'briefcase', sector: 'freelance' },
    { label: 'Enregistrer mes coordonnées', icon: 'contact', sector: 'pro' },
  ];

  Object.assign(window.NFC, { DESIGNS, SECTORS, OTHER });
})();
