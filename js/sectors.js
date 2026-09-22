/* Les 16 autres secteurs du catalogue. Chaque entrée complète la fiche déclarée dans data.js (code, nom, icône). */
(function () {
  'use strict';

  /* ---------- Raccourcis ---------- */
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  /* Palette complète déduite d’une couleur principale et d’un accent */
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const B = (key, type, title, extra) => Object.assign({ key, type, title }, extra || {});
  const id = (name, role, specialty, company, cover, photo) => ({ name, role, specialty, company, photo: photo || 'ph:portrait', logo: '', cover: 'ph:cover|' + cover });
  const ct = (phone, email, website, whatsapp) => ({ phone, whatsapp: whatsapp || '', email, website });
  const so = (o) => Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, o || {});
  const text = (t, on = true) => ({ on, text: t });
  const list = (rows, on = true) => ({ on, items: rows.map(([t, d = '', p = '']) => ({ t, d, p })) });
  const cards = (rows, on = true) => ({ on, items: rows.map(([t, d = '', p = '', img]) => ({ t, d, p, img: 'ph:photo|' + (img || t), url: '' })) });
  const stats = (rows, on = true) => ({ on, items: rows.map(([v, l]) => ({ v, l })) });
  const gal = (caps, on = true) => ({ on, images: caps.map((c) => ({ src: 'ph:photo|' + c, cap: c })) });
  const hours = (rows, note = '', on = true) => ({ on, rows: rows.map(([d, h]) => ({ d, h })), note });
  const loc = (address, access = '', on = true) => ({ on, address, access });
  const act = (label, url, t = '', on = true) => ({ on, label, url, text: t });
  const form = (email, t, photos = false, on = true) => ({ on, email, text: t, photos });
  const tags = (t, extra = '', on = true) => ({ on, tags: t, text: extra });
  const links = (rows, on = true) => ({ on, items: rows.map(([label, url]) => ({ label, url })) });
  const vid = (on = false, url = '', cap = '') => ({ on, url, cap, cover: '' });
  const EX = 'https://example.com';

  const EXTRA = {};

  /* ---------- F02 Droit, finance et conseil ---------- */
  EXTRA.conseil = {
    rec: 'd2',
    palettes: [pal('Marine & or', '#1b2a4a', '#c8a24a'), pal('Vert sapin', '#1f4d3a', '#b8a26a'), pal('Bordeaux', '#6b1d2a', '#c9a26b'), pal('Ardoise', '#2f3a45', '#8fb0cc'), pal('Bleu roi', '#1d3fa8', '#7aa2ff')],
    blocks: [
      B('about', 'text', 'Présentation', { help: '150 à 250 mots conseillés' }),
      B('expertises', 'list', 'Domaines d’expertise'),
      B('stats', 'stats', 'En quelques chiffres'),
      B('parcours', 'list', 'Parcours'),
      B('booking', 'action', 'Premier rendez-vous', { cta: 'Prendre rendez-vous', icon: 'cal', help: 'Lien Calendly ou équivalent' }),
      B('location', 'location', 'Agence'),
      B('faq', 'list', 'Questions fréquentes'),
      B('docs', 'links', 'Documents', { help: 'Brochure, conditions, plaquette…' }),
      B('video', 'video', 'Vidéo de présentation'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Karim Bennani', 'Attaché commercial', 'Gestion de patrimoine', 'Banque Horizon', 'L’agence'),
      contact: ct('06 45 12 78 90', 'k.bennani@banque-horizon.fr', 'banque-horizon.fr'),
      socials: so({ linkedin: 'https://linkedin.com/' }),
      blocks: {
        about: text('J’accompagne les particuliers et les chefs d’entreprise dans la construction et la protection de leur patrimoine.\nÉpargne, placements, préparation de la retraite ou transmission : nous définissons ensemble une stratégie claire, adaptée à vos objectifs et à votre horizon.'),
        expertises: list([['Épargne et placements', 'Assurance vie, PEA, comptes à terme'], ['Préparation de la retraite', 'PER, revenus complémentaires'], ['Transmission', 'Donation, protection du conjoint'], ['Financement immobilier', 'Résidence principale, investissement locatif']]),
        stats: stats([['15 ans', 'd’expérience en banque privée'], ['350', 'clients accompagnés'], ['48 h', 'pour un premier rendez-vous']]),
        parcours: list([['Banque Horizon · depuis 2019', 'Attaché commercial, gestion de patrimoine'], ['Crédit Régional · 2011 – 2019', 'Conseiller clientèle professionnels'], ['Master Gestion de patrimoine', 'Université Lyon 3']], false),
        booking: act('Prendre rendez-vous', 'https://calendly.com/', 'Premier entretien de 45 minutes, en agence ou en visioconférence.'),
        location: loc('24 cours Lafayette, 69003 Lyon', 'Métro B – Place Guichard · Accès PMR'),
        faq: list([['Le premier rendez-vous est-il payant ?', 'Non, le premier bilan patrimonial est offert.'], ['Faut-il être client de la banque ?', 'Non, je reçois aussi les personnes non clientes.']], false),
        docs: links([['Plaquette gestion de patrimoine (PDF)', EX]], false),
        video: vid(),
      },
    },
  };

  /* ---------- F04 Freelance, IT ---------- */
  EXTRA.freelance = {
    rec: 'd2',
    palettes: [pal('Indigo', '#4338ca', '#67e8f9'), pal('Graphite', '#1f2937', '#34d399'), pal('Violet', '#6d28d9', '#f9a8d4'), pal('Bleu pétrole', '#0e5a6b', '#fbbf24'), pal('Corail', '#c2410c', '#fdba74')],
    blocks: [
      B('about', 'text', 'Présentation', { help: '150 à 250 mots conseillés' }),
      B('services', 'list', 'Services & forfaits', { price: true }),
      B('projects', 'cards', 'Projets récents', { price: false, help: '3 à 6 projets avec capture' }),
      B('skills', 'tags', 'Compétences', { icon: 'check' }),
      B('booking', 'action', 'Appel découverte', { cta: 'Réserver un appel découverte', icon: 'cal' }),
      B('brief', 'form', 'Envoyer un brief', { cta: 'Envoyer un brief' }),
      B('links', 'links', 'CV & profils', { help: 'CV, GitHub, Malt, portfolio…' }),
      B('video', 'video', 'Démonstration'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Léa Garnier', 'Développeuse web freelance', 'React · Next.js · Accessibilité', 'Studio Garnier', 'Espace de travail'),
      contact: ct('06 71 22 34 56', 'hello@leagarnier.dev', 'leagarnier.dev'),
      socials: so({ linkedin: 'https://linkedin.com/' }),
      blocks: {
        about: text('Développeuse front-end depuis 8 ans, je conçois des sites et applications web rapides, accessibles et faciles à faire évoluer.\nJ’interviens en mission ou au forfait, de la maquette à la mise en ligne, pour des startups comme pour des PME.'),
        services: list([['Site vitrine sur mesure', 'Design, développement, mise en ligne', 'dès 2 500 €'], ['Application web', 'React / Next.js, API, tableau de bord', 'Sur devis'], ['Audit d’accessibilité', 'Rapport RGAA et plan d’action', '900 €'], ['Régie', 'Mission longue durée', '550 € / jour']]),
        projects: cards([['Plateforme de réservation', 'Next.js · 40 000 utilisateurs'], ['Site e-commerce', 'Refonte et SEO · +35 % de ventes'], ['Tableau de bord RH', 'React · Données en temps réel']]),
        skills: tags('React, Next.js, TypeScript, Accessibilité, Figma, Node.js', 'Disponible à partir du 1er novembre, 3 jours par semaine.'),
        booking: act('Réserver un appel découverte', 'https://calendly.com/', '20 minutes pour parler de votre projet, sans engagement.'),
        brief: form('hello@leagarnier.dev', 'Décrivez votre projet, votre budget et vos délais : réponse sous 48 h.', false, false),
        links: links([['Mon CV (PDF)', EX], ['GitHub', 'https://github.com/'], ['Profil Malt', 'https://malt.fr/']]),
        video: vid(),
      },
    },
  };

  /* ---------- F05 Immobilier ---------- */
  EXTRA.immobilier = {
    rec: 'd3',
    palettes: [pal('Bleu ardoise', '#1e3a5f', '#e0a458'), pal('Vert olive', '#3f5a36', '#d9c27a'), pal('Terre', '#8a4b2a', '#f0c9a0'), pal('Noir chic', '#1a1a1a', '#c5a572'), pal('Bleu azur', '#0369a1', '#fbbf24')],
    blocks: [
      B('about', 'text', 'Présentation', { help: '100 à 180 mots conseillés' }),
      B('biens', 'cards', 'Biens à la vente', { price: true, help: 'Vos annonces du moment' }),
      B('stats', 'stats', 'Mes résultats'),
      B('secteur', 'tags', 'Mon secteur', { icon: 'pin', withText: true }),
      B('services', 'list', 'Services'),
      B('estimation', 'form', 'Estimer mon bien', { cta: 'Demander une estimation' }),
      B('visite', 'action', 'Visites', { cta: 'Demander une visite', icon: 'cal' }),
      B('video', 'video', 'Visite virtuelle'),
    ],
    demo: {
      primary: 'estimation',
      identity: id('Julie Fontaine', 'Conseillère immobilière', 'Lyon 6e · Ventes & estimations', 'Fontaine Immobilier', 'Appartement lumineux'),
      contact: ct('06 33 44 55 66', 'julie@fontaine-immo.fr', 'fontaine-immo.fr', '+33 6 33 44 55 66'),
      socials: so({ instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' }),
      blocks: {
        about: text('Installée dans le 6e arrondissement depuis 10 ans, je connais chaque rue, chaque copropriété et les prix réels du quartier.\nJe vous accompagne de l’estimation à la signature chez le notaire, avec un seul interlocuteur du début à la fin.'),
        biens: cards([['Appartement T3 · 72 m²', 'Lyon 6e · Balcon · 3e étage', '385 000 €'], ['Maison 5 pièces · 130 m²', 'Caluire · Jardin 400 m²', '640 000 €'], ['Studio · 24 m²', 'Lyon 6e · Idéal investisseur', '149 000 €']]),
        stats: stats([['48', 'biens vendus en 2025'], ['32 j', 'délai moyen de vente'], ['98 %', 'du prix affiché obtenu']]),
        secteur: tags('Lyon 6e, Lyon 3e, Caluire, Villeurbanne', 'Estimation offerte sous 48 h.'),
        services: list([['Estimation offerte', 'Rapport détaillé sous 48 h'], ['Accompagnement vente', 'Photos pro, visites, négociation'], ['Recherche sur mesure', 'Pour les acquéreurs pressés']], false),
        estimation: form('julie@fontaine-immo.fr', 'Indiquez l’adresse et la surface de votre bien : je vous rappelle pour fixer un rendez-vous d’estimation.', true),
        visite: act('Demander une visite', 'https://calendly.com/', 'Visites du lundi au samedi.', false),
        video: vid(),
      },
    },
  };

  /* ---------- F06 Architecture ---------- */
  EXTRA.archi = {
    rec: 'd3',
    palettes: [pal('Sable', '#7a5c3e', '#d9b99b'), pal('Vert sauge', '#4f6b58', '#c9d6c3'), pal('Béton', '#3a3a3a', '#c2b8a3'), pal('Terracotta', '#a4512e', '#f0c29e'), pal('Bleu nuit', '#1f2a44', '#d4b483')],
    blocks: [
      B('about', 'text', 'L’atelier', { help: '100 à 200 mots conseillés' }),
      B('projets', 'cards', 'Projets', { price: false, help: '3 à 6 projets' }),
      B('demarche', 'list', 'Notre démarche'),
      B('gallery', 'gallery', 'Avant / après', { help: '6 à 10 photos' }),
      B('services', 'list', 'Prestations', { price: true }),
      B('projet', 'form', 'Parlons de votre projet', { cta: 'Parler de mon projet' }),
      B('video', 'video', 'Visite d’un projet'),
    ],
    demo: {
      primary: 'projet',
      identity: id('Hugo Marchand', 'Architecte d’intérieur', 'Rénovation d’appartements anciens', 'Atelier Marchand', 'Séjour rénové'),
      contact: ct('06 82 14 25 36', 'contact@atelier-marchand.fr', 'atelier-marchand.fr'),
      socials: so({ instagram: 'https://instagram.com/', linkedin: 'https://linkedin.com/' }),
      blocks: {
        about: text('Nous redonnons vie aux appartements anciens en respectant leur caractère : moulures, parquets et volumes, avec des matériaux durables et un confort d’aujourd’hui.'),
        projets: cards([['Appartement haussmannien', 'Lyon 2e · 120 m² · Rénovation complète'], ['Maison de ville', 'Villeurbanne · Extension et cuisine'], ['Loft d’artiste', 'Croix-Rousse · Mezzanine sur mesure']]),
        demarche: list([['Visite et écoute', 'Nous découvrons votre lieu et vos envies'], ['Esquisses et plans 3D', 'Vous visualisez le projet avant les travaux'], ['Suivi de chantier', 'Coordination des artisans jusqu’à la livraison']]),
        gallery: gal(['Cuisine avant', 'Cuisine après', 'Salle de bain', 'Bibliothèque sur mesure'], false),
        services: list([['Conseil déco', 'Visite de 2 h et recommandations', '290 €'], ['Plans et 3D', 'Aménagement complet', 'dès 1 800 €'], ['Projet clé en main', 'Conception et suivi de chantier', 'Sur devis']]),
        projet: form('contact@atelier-marchand.fr', 'Surface, budget indicatif, délais : décrivez votre projet et joignez quelques photos.', true),
        video: vid(),
      },
    },
  };

  /* ---------- F08 Beauté et bien-être ---------- */
  EXTRA.beaute = {
    rec: 'd3',
    palettes: [pal('Rose poudré', '#9d4b62', '#f3c4cf'), pal('Nude', '#8a6752', '#e8cfc0'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Sauge', '#52705f', '#cfe0cf'), pal('Prune', '#5b2150', '#e9a8d9')],
    blocks: [
      B('about', 'text', 'Le salon', { help: '80 à 150 mots conseillés' }),
      B('prestations', 'list', 'Prestations & tarifs', { price: true }),
      B('gallery', 'gallery', 'Réalisations', { help: '6 à 10 photos' }),
      B('booking', 'action', 'Réservation', { cta: 'Réserver une prestation', icon: 'cal', help: 'Lien Planity, Treatwell…' }),
      B('team', 'cards', 'L’équipe', { price: false }),
      B('gift', 'action', 'Bons cadeaux', { cta: 'Offrir un bon cadeau', icon: 'bag' }),
      B('hours', 'hours', 'Horaires'),
      B('location', 'location', 'Le salon'),
      B('video', 'video', 'Vidéo'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Samir Haddad', 'Barbier coiffeur', 'Coupe · Barbe · Rasage à l’ancienne', 'Maison Haddad', 'Le salon'),
      contact: ct('04 78 55 66 77', 'bonjour@maison-haddad.fr', 'maison-haddad.fr', '+33 6 55 66 77 88'),
      socials: so({ instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/' }),
      blocks: {
        about: text('Un barbershop à l’ancienne où l’on prend le temps : diagnostic, coupe aux ciseaux ou à la tondeuse, taille de barbe et serviette chaude.'),
        prestations: list([['Coupe homme', '30 min', '25 €'], ['Taille de barbe', '20 min · serviette chaude', '18 €'], ['Coupe + barbe', '45 min', '38 €'], ['Rasage à l’ancienne', '30 min · au coupe-chou', '30 €']]),
        gallery: gal(['Coupe tendance', 'Taille de barbe', 'Contours précis', 'Le résultat', 'Nos outils', 'Dégradé']),
        booking: act('Réserver une prestation', 'https://www.planity.com/', 'Réservation en ligne 24h/24.'),
        team: cards([['Samir', 'Barbier · fondateur', '', 'Portrait Samir'], ['Lucas', 'Coiffeur · coloriste', '', 'Portrait Lucas']], false),
        gift: act('Offrir un bon cadeau', EX, 'Valable un an sur toutes les prestations.', false),
        hours: hours([['Mardi – Vendredi', '9h30 – 19h'], ['Samedi', '9h – 18h'], ['Dimanche – Lundi', 'Fermé']]),
        location: loc('5 rue Mercière, 69002 Lyon', 'Métro A – Cordeliers'),
        video: vid(),
      },
    },
  };

  /* ---------- F09 Coaching, sport et formation ---------- */
  EXTRA.coaching = {
    rec: 'd4',
    palettes: [pal('Énergie', '#dc2626', '#fbbf24'), pal('Bleu électrique', '#1d4ed8', '#67e8f9'), pal('Vert forêt', '#166534', '#bef264'), pal('Noir', '#111111', '#fb923c'), pal('Lavande', '#6d5aa8', '#f5c2e7')],
    blocks: [
      B('about', 'text', 'Qui suis-je ?', { help: '150 à 250 mots conseillés' }),
      B('programmes', 'list', 'Programmes & tarifs', { price: true }),
      B('methode', 'list', 'Ma méthode'),
      B('planning', 'hours', 'Cours collectifs'),
      B('booking', 'action', 'Séance découverte', { cta: 'Réserver une séance découverte', icon: 'cal' }),
      B('stats', 'stats', 'Résultats'),
      B('gallery', 'gallery', 'En séance'),
      B('location', 'location', 'Où s’entraîner'),
      B('video', 'video', 'Extrait de séance'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Thomas Leroy', 'Coach sportif diplômé d’État', 'Perte de poids · Remise en forme', '', 'Séance en extérieur'),
      contact: ct('06 10 20 30 40', 'thomas@leroy-coaching.fr', 'leroy-coaching.fr', '+33 6 10 20 30 40'),
      socials: so({ instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' }),
      blocks: {
        about: text('Ancien athlète, je coache depuis 9 ans des personnes qui veulent reprendre le sport sans se blesser.\nChaque programme part de votre niveau réel, de votre emploi du temps et de vos objectifs : perte de poids, renforcement ou préparation d’une course.'),
        programmes: list([['Séance individuelle', '1 h · à domicile ou en salle', '55 €'], ['Pack 10 séances', 'Suivi nutrition inclus', '490 €'], ['Small group', '4 personnes maximum', '20 € / pers.'], ['Programme en ligne', '12 semaines · appli + visio', '149 €']]),
        methode: list([['Bilan de forme', 'Mesures, mobilité, objectifs'], ['Programme personnalisé', 'Adapté à votre semaine'], ['Suivi et ajustements', 'Point chaque mois']]),
        planning: hours([['Lundi', 'Cross-training · 18h30'], ['Mercredi', 'Renforcement · 12h15'], ['Samedi', 'Running au parc · 9h']], '8 places par cours'),
        booking: act('Réserver une séance découverte', 'https://calendly.com/', 'Première séance offerte, sans engagement.'),
        stats: stats([['250+', 'personnes accompagnées'], ['-7 kg', 'en moyenne sur 3 mois']], false),
        gallery: gal(['Cross-training', 'Running', 'Renforcement'], false),
        location: loc('Parc de la Tête d’Or, 69006 Lyon', 'Rendez-vous à l’entrée Porte des Enfants du Rhône', false),
        video: vid(),
      },
    },
  };

  /* ---------- F11 Producteurs et commerces alimentaires ---------- */
  EXTRA.producteurs = {
    rec: 'd4', establishment: true,
    palettes: [pal('Vert potager', '#3f6212', '#f59e0b'), pal('Terre', '#7c4a24', '#e9b872'), pal('Tomate', '#b91c1c', '#a3e635'), pal('Miel', '#a16207', '#fde047'), pal('Lin', '#57534e', '#b5c99a')],
    blocks: [
      B('about', 'text', 'Qui sommes-nous ?', { help: '100 à 180 mots conseillés' }),
      B('produits', 'list', 'Nos produits', { price: true }),
      B('saison', 'tags', 'En ce moment', { icon: 'check', withText: true }),
      B('marches', 'hours', 'Où nous trouver'),
      B('order', 'action', 'Précommande', { cta: 'Précommander mon panier', icon: 'bag' }),
      B('gallery', 'gallery', 'La ferme', { help: '6 à 12 photos' }),
      B('location', 'location', 'Vente à la ferme'),
      B('video', 'video', 'Notre savoir-faire'),
    ],
    demo: {
      primary: 'order',
      identity: id('Ferme des Quatre Saisons', 'Maraîchers bio', 'Légumes de saison · Paniers hebdomadaires', 'Paul & Marie Roche', 'Les serres', 'ph:logo'),
      contact: ct('06 60 70 80 90', 'ferme@quatresaisons.fr', 'quatresaisons.fr'),
      socials: so({ facebook: 'https://facebook.com/', instagram: 'https://instagram.com/' }),
      blocks: {
        about: text('Sur 3 hectares au pied des Monts du Lyonnais, nous cultivons plus de 40 variétés de légumes en agriculture biologique.\nRécoltés la veille, vendus en direct : c’est notre promesse.'),
        produits: list([['Panier découverte', '4 à 5 légumes de saison', '15 €'], ['Panier famille', '7 à 8 légumes + œufs', '25 €'], ['Œufs plein air', 'Boîte de 6', '3,50 €'], ['Confitures maison', 'Pot de 350 g', '5 €']]),
        saison: tags('Courges, Poireaux, Choux, Pommes, Épinards', 'Liste mise à jour chaque semaine.'),
        marches: hours([['Mardi', 'Marché de la Croix-Rousse · 7h – 13h'], ['Vendredi', 'Vente à la ferme · 16h – 19h'], ['Samedi', 'Marché de Brignais · 8h – 12h']]),
        order: act('Précommander mon panier', EX, 'Commandez avant jeudi midi, retrait vendredi à la ferme.'),
        gallery: gal(['Les serres', 'Récolte du matin', 'Paniers', 'Le marché', 'Courges', 'Les poules']),
        location: loc('Lieu-dit Les Granges, 69440 Mornant', 'Parking à la ferme'),
        video: vid(),
      },
    },
  };

  /* ---------- F12 Mariage et événementiel ---------- */
  EXTRA.evenementiel = {
    rec: 'd3',
    palettes: [pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Blush', '#a8556b', '#f5d0d8'), pal('Eucalyptus', '#4b6b5d', '#cfe0d6'), pal('Bleu minuit', '#1e2a4a', '#d8b46a'), pal('Terracotta', '#b0563a', '#f2cda8')],
    blocks: [
      B('about', 'text', 'Mon approche', { help: '100 à 200 mots conseillés' }),
      B('gallery', 'gallery', 'Réalisations', { help: '8 à 12 photos' }),
      B('formules', 'list', 'Formules', { price: true }),
      B('demarche', 'list', 'Comment ça se passe'),
      B('dispo', 'form', 'Votre événement', { cta: 'Vérifier ma date' }),
      B('booking', 'action', 'Appel découverte', { cta: 'Réserver un appel découverte', icon: 'cal' }),
      B('stats', 'stats', 'En chiffres'),
      B('video', 'video', 'Film d’un mariage'),
    ],
    demo: {
      primary: 'dispo',
      identity: id('Camille Dubois', 'Wedding planner', 'Mariages sur mesure en Provence', 'Maison Dubois Events', 'Cérémonie laïque'),
      contact: ct('06 12 98 76 54', 'camille@dubois-events.fr', 'dubois-events.fr', '+33 6 12 98 76 54'),
      socials: so({ instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' }),
      blocks: {
        about: text('Je conçois des mariages qui vous ressemblent, du choix du lieu jusqu’au dernier slow.\nVous profitez de chaque étape ; je m’occupe des prestataires, du budget et du rétroplanning.'),
        gallery: gal(['Cérémonie laïque', 'Table d’honneur', 'Décor floral', 'Vin d’honneur', 'Mas provençal', 'Première danse']),
        formules: list([['Coordination du jour J', 'Présence de 10 h à minuit', 'dès 1 200 €'], ['Organisation partielle', 'Lieu, traiteur et décor', 'dès 2 800 €'], ['Organisation complète', 'De A à Z, sur 12 mois', 'Sur devis']]),
        demarche: list([['Rendez-vous découverte', 'Vos envies, votre budget, vos invités'], ['Proposition sur mesure', 'Univers, prestataires, planning'], ['Le grand jour', 'Je coordonne, vous profitez']], false),
        dispo: form('camille@dubois-events.fr', 'Indiquez la date, le lieu envisagé, le nombre d’invités et votre budget : je vous confirme ma disponibilité sous 48 h.'),
        booking: act('Réserver un appel découverte', 'https://calendly.com/', '30 minutes en visio, sans engagement.'),
        stats: stats([['120', 'mariages organisés'], ['8 ans', 'd’expérience']], false),
        video: vid(),
      },
    },
  };

  /* ---------- F13 Portfolio artistique et visuel ---------- */
  EXTRA.portfolio = {
    rec: 'd3',
    palettes: [pal('Encre', '#1f2937', '#fbbf24'), pal('Rouge galerie', '#9b1c1c', '#fca5a5'), pal('Bleu Klein', '#1e40af', '#93c5fd'), pal('Kaki', '#4d5b3a', '#d6c79a'), pal('Anthracite', '#27272a', '#d4d4d8')],
    blocks: [
      B('gallery', 'gallery', 'Sélection', { help: '8 à 16 images' }),
      B('about', 'text', 'Démarche', { help: '50 à 150 mots conseillés' }),
      B('series', 'cards', 'Séries', { price: false }),
      B('offres', 'list', 'Prestations', { price: true }),
      B('commande', 'form', 'Commande', { cta: 'Demander un devis' }),
      B('booking', 'action', 'Séance', { cta: 'Réserver une séance', icon: 'camera' }),
      B('links', 'links', 'Ailleurs', { help: 'Instagram, Behance, boutique…' }),
      B('video', 'video', 'Showreel'),
    ],
    demo: {
      primary: 'commande',
      identity: id('Élise Moreau', 'Photographe', 'Portrait · Mariage · Entreprise', '', 'Portrait en lumière naturelle'),
      contact: ct('06 23 45 67 89', 'studio@elisemoreau.fr', 'elisemoreau.fr'),
      socials: so({ instagram: 'https://instagram.com/' }),
      blocks: {
        gallery: gal(['Portrait', 'Mariage', 'Reportage', 'Corporate', 'Nature morte', 'Couple']),
        about: text('Je photographie les gens tels qu’ils sont, en lumière naturelle, sans poses figées. Des images sincères, pensées pour durer.'),
        series: cards([['Portraits d’artisans', 'Série personnelle · 2025'], ['Mariages', 'Reportages complets'], ['Entreprises', 'Équipes et locaux']], false),
        offres: list([['Séance portrait', '1 h · 10 photos retouchées', '180 €'], ['Photos d’équipe', 'Demi-journée sur site', '650 €'], ['Reportage mariage', 'Journée complète', 'dès 1 900 €']]),
        commande: form('studio@elisemoreau.fr', 'Parlez-moi de votre projet : type de séance, date, lieu.'),
        booking: act('Réserver une séance', 'https://calendly.com/', '', false),
        links: links([['Portfolio complet', EX], ['Behance', 'https://behance.net/']]),
        video: vid(),
      },
    },
  };

  /* ---------- F14 Musique et spectacle ---------- */
  EXTRA.musique = {
    rec: 'd5', establishment: true,
    palettes: [pal('Scène', '#7c3aed', '#f472b6'), pal('Vinyle', '#1c1917', '#f59e0b'), pal('Rouge velours', '#9f1239', '#fda4af'), pal('Bleu nuit', '#1e3a8a', '#fbbf24'), pal('Émeraude', '#065f46', '#6ee7b7')],
    blocks: [
      B('about', 'text', 'Le groupe', { help: '100 à 200 mots conseillés' }),
      B('video', 'video', 'En live'),
      B('ecouter', 'links', 'Écouter', { help: 'Spotify, Deezer, SoundCloud…' }),
      B('dates', 'hours', 'Prochaines dates'),
      B('formules', 'list', 'Formules', { price: true }),
      B('booking', 'form', 'Booking', { cta: 'Demander une date' }),
      B('gallery', 'gallery', 'Photos'),
      B('docs', 'links', 'Espace pro', { help: 'Dossier artistique, fiche technique' }),
    ],
    demo: {
      primary: 'booking',
      identity: id('Nova Trio', 'Jazz · Soul · Pop', 'Concerts, mariages et événements privés', '', 'Concert au Petit Salon', 'ph:logo'),
      contact: ct('06 77 88 99 00', 'booking@novatrio.fr', 'novatrio.fr'),
      socials: so({ instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' }),
      blocks: {
        about: text('Voix, piano et contrebasse : Nova Trio revisite les standards du jazz et de la soul, de Nina Simone à Amy Winehouse.\nUn répertoire qui s’adapte à votre soirée, du cocktail feutré à la piste de danse.'),
        video: vid(true, '', 'Live au Petit Salon · 2025'),
        ecouter: links([['Écouter sur Spotify', 'https://spotify.com/'], ['Écouter sur Deezer', 'https://deezer.com/']]),
        dates: hours([['12 oct.', 'Le Petit Salon, Lyon'], ['25 oct.', 'Festival Jazz à Vienne'], ['8 nov.', 'Péniche Loupika, Lyon']]),
        formules: list([['Cocktail', '2 sets de 45 min · acoustique', 'dès 1 200 €'], ['Soirée complète', 'Sono + DJ set en fin de soirée', 'dès 2 400 €']]),
        booking: form('booking@novatrio.fr', 'Date, lieu, type d’événement et nombre d’invités : nous revenons vers vous sous 48 h.'),
        gallery: gal(['Sur scène', 'Répétition', 'Mariage au domaine'], false),
        docs: links([['Dossier artistique (PDF)', EX], ['Fiche technique (PDF)', EX]], false),
      },
    },
  };

  /* ---------- F15 Influence et création de contenu ---------- */
  EXTRA.influence = {
    rec: 'd5',
    palettes: [pal('Rose fluo', '#db2777', '#fbcfe8'), pal('Violet', '#7c3aed', '#c4b5fd'), pal('Orange', '#ea580c', '#fed7aa'), pal('Menthe', '#0d9488', '#99f6e4'), pal('Noir & jaune', '#0a0a0a', '#facc15')],
    blocks: [
      B('about', 'text', 'Qui suis-je ?', { help: '50 à 150 mots conseillés' }),
      B('stats', 'stats', 'Audience'),
      B('contenus', 'cards', 'Contenus phares', { price: false, help: 'Vos meilleures vidéos, avec lien' }),
      B('collabs', 'list', 'Collaborations', { price: true }),
      B('marques', 'tags', 'Ils m’ont fait confiance', { icon: 'check' }),
      B('kit', 'links', 'Kit média'),
      B('partenariat', 'form', 'Partenariats', { cta: 'Proposer une collaboration' }),
      B('video', 'video', 'Dernière vidéo'),
    ],
    demo: {
      primary: 'partenariat',
      identity: id('Sarah Kem', 'Créatrice de contenu', 'Food & voyages', '', 'Tournage en cuisine'),
      contact: ct('', 'collab@sarahkem.fr', 'sarahkem.fr'),
      socials: so({ tiktok: 'https://tiktok.com/', instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' }),
      blocks: {
        about: text('Je partage des recettes simples et des carnets de voyage gourmands avec une communauté de passionnés de cuisine du quotidien.'),
        stats: stats([['180 k', 'abonnés TikTok'], ['95 k', 'abonnés Instagram'], ['6,2 %', 'taux d’engagement'], ['72 %', 'audience 18-34 ans']]),
        contenus: cards([['Pâtes en 10 minutes', '2,4 M de vues'], ['24 h à Lisbonne', '850 k vues'], ['Le meilleur couscous', '1,1 M de vues']]),
        collabs: list([['Vidéo TikTok dédiée', 'Création + publication', 'dès 900 €'], ['Story Instagram', 'Pack de 3 stories', 'dès 400 €'], ['Contenu UGC', 'Vidéo livrée, non publiée', 'dès 350 €']]),
        marques: tags('Picard, Air France, Le Creuset, Hellofresh'),
        kit: links([['Télécharger mon kit média (PDF)', EX]]),
        partenariat: form('collab@sarahkem.fr', 'Présentez votre marque, votre produit et votre calendrier.'),
        video: vid(true, '', 'Ma dernière recette'),
      },
    },
  };

  /* ---------- F16 Hébergement et lieux à louer ---------- */
  EXTRA.hebergement = {
    rec: 'd3', establishment: true,
    palettes: [pal('Olivier', '#5b6b2f', '#d9c27a'), pal('Lavande', '#6b5b95', '#d8c8f0'), pal('Pierre', '#8a7560', '#e6d5bf'), pal('Bleu piscine', '#0e7490', '#fcd34d'), pal('Terracotta', '#a0522d', '#f4c7a1')],
    blocks: [
      B('gallery', 'gallery', 'Le lieu', { help: '8 à 12 photos' }),
      B('about', 'text', 'Bienvenue', { help: '150 à 250 mots conseillés' }),
      B('chambres', 'cards', 'Chambres', { price: true }),
      B('equipements', 'tags', 'Équipements', { icon: 'check' }),
      B('booking', 'action', 'Réservation', { cta: 'Vérifier les disponibilités', icon: 'cal', help: 'Lien Booking, Airbnb ou votre moteur' }),
      B('infos', 'hours', 'Informations pratiques'),
      B('location', 'location', 'Accès'),
      B('video', 'video', 'Visite vidéo'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Le Mas des Oliviers', 'Maison d’hôtes · 5 chambres', 'Au cœur du Luberon', '', 'La piscine', 'ph:logo'),
      contact: ct('04 90 12 34 56', 'bonjour@masdesoliviers.fr', 'masdesoliviers.fr', '+33 6 12 34 56 00'),
      socials: so({ instagram: 'https://instagram.com/' }),
      blocks: {
        gallery: gal(['La piscine', 'Chambre Lavande', 'Petit-déjeuner', 'Le jardin', 'Terrasse', 'Vue sur Gordes']),
        about: text('Un mas du XVIIIe siècle restauré, entouré d’oliviers centenaires, à 5 minutes de Gordes.\nPetit-déjeuner maison servi sous la tonnelle, piscine chauffée et calme absolu.'),
        chambres: cards([['Chambre Lavande', '2 pers. · vue jardin', 'dès 120 € / nuit'], ['Suite Olivier', '4 pers. · terrasse privée', 'dès 190 € / nuit'], ['Chambre Garrigue', '2 pers. · rez-de-jardin', 'dès 110 € / nuit']]),
        equipements: tags('Piscine chauffée, Petit-déjeuner inclus, Wi-Fi, Parking privé, Climatisation'),
        booking: act('Vérifier les disponibilités', 'https://www.booking.com/', 'Réservation directe au meilleur prix.'),
        infos: hours([['Arrivée', '16h – 20h'], ['Départ', 'Avant 11h'], ['Ouverture', 'Avril à octobre']]),
        location: loc('Chemin des Oliviers, 84220 Gordes', 'Gare d’Avignon TGV à 40 min'),
        video: vid(),
      },
    },
  };

  /* ---------- F17 Tourisme et expériences ---------- */
  EXTRA.tourisme = {
    rec: 'd5',
    palettes: [pal('Méditerranée', '#0369a1', '#fbbf24'), pal('Turquoise', '#0f766e', '#fde68a'), pal('Coucher de soleil', '#c2410c', '#fcd34d'), pal('Garrigue', '#4d7c0f', '#fef08a'), pal('Nuit étoilée', '#1e3a8a', '#f9a8d4')],
    blocks: [
      B('about', 'text', 'Votre guide', { help: '100 à 200 mots conseillés' }),
      B('experiences', 'cards', 'Expériences', { price: true }),
      B('booking', 'action', 'Réservation', { cta: 'Réserver une activité', icon: 'cal' }),
      B('planning', 'hours', 'Départs'),
      B('inclus', 'list', 'Ce qui est inclus'),
      B('langues', 'tags', 'Langues', { icon: 'globe' }),
      B('gallery', 'gallery', 'En images'),
      B('surmesure', 'form', 'Sur mesure', { cta: 'Demander un circuit sur mesure' }),
      B('video', 'video', 'En vidéo'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Nadia Benali', 'Guide conférencière', 'Marseille & calanques', 'Azur Découvertes', 'Calanque de Sugiton'),
      contact: ct('06 44 55 66 77', 'nadia@azur-decouvertes.fr', 'azur-decouvertes.fr', '+33 6 44 55 66 77'),
      socials: so({ instagram: 'https://instagram.com/' }),
      blocks: {
        about: text('Marseillaise de naissance, je vous fais découvrir ma ville autrement : ruelles du Panier, cabanons cachés et criques accessibles seulement en bateau.'),
        experiences: cards([['Calanques en bateau', '3 h · dès 8 ans', '45 €'], ['Le Panier gourmand', '2 h 30 · dégustations', '39 €'], ['Randonnée à Sugiton', '4 h · niveau moyen', '35 €']]),
        booking: act('Réserver une activité', EX, 'Groupes de 12 personnes maximum.'),
        planning: hours([['Tous les jours', 'Calanques · 9h et 14h'], ['Mar., jeu., sam.', 'Le Panier · 10h']]),
        inclus: list([['Guide diplômée', ''], ['Dégustations', 'Pour la visite gourmande'], ['Photos souvenir', 'Envoyées après l’activité']], false),
        langues: tags('Français, Anglais, Espagnol, Arabe'),
        gallery: gal(['Calanques', 'Le Panier', 'Vieux-Port', 'Coucher de soleil']),
        surmesure: form('nadia@azur-decouvertes.fr', 'Groupe, séminaire ou séjour de plusieurs jours : décrivez votre projet.', false, false),
        video: vid(),
      },
    },
  };

  /* ---------- F18 Services aux animaux ---------- */
  EXTRA.animaux = {
    rec: 'd3',
    palettes: [pal('Turquoise', '#0e7490', '#fcd34d'), pal('Corail', '#be123c', '#fecdd3'), pal('Vert pomme', '#4d7c0f', '#fde047'), pal('Caramel', '#9a5b2c', '#f6d5a8'), pal('Bleu', '#1d4ed8', '#fda4af')],
    blocks: [
      B('about', 'text', 'Présentation', { help: '100 à 200 mots conseillés' }),
      B('services', 'list', 'Prestations & tarifs', { price: true }),
      B('gallery', 'gallery', 'Avant / après', { help: '6 à 10 photos' }),
      B('booking', 'action', 'Rendez-vous', { cta: 'Prendre rendez-vous', icon: 'cal' }),
      B('animaux', 'tags', 'Animaux accueillis', { icon: 'check' }),
      B('zone', 'tags', 'Zone desservie', { icon: 'pin', withText: true }),
      B('hours', 'hours', 'Horaires'),
      B('conditions', 'list', 'Bon à savoir'),
      B('video', 'video', 'Vidéo'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Chloé Petit', 'Toiletteuse canin & félin', 'Salon & toilettage à domicile', 'Poils & Pattes', 'Le salon'),
      contact: ct('06 51 52 53 54', 'bonjour@poilsetpattes.fr', 'poilsetpattes.fr', '+33 6 51 52 53 54'),
      socials: so({ instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' }),
      blocks: {
        about: text('Toiletteuse diplômée, je prends le temps d’habituer chaque animal : pas de cage, pas de précipitation, et des produits doux adaptés à chaque pelage.'),
        services: list([['Bain + séchage', 'Petit chien', 'dès 35 €'], ['Toilettage complet', 'Coupe aux ciseaux, griffes, oreilles', 'dès 55 €'], ['Chat', 'Bain et démêlage', 'dès 60 €'], ['Toilettage à domicile', 'Camion équipé', '+15 €']]),
        gallery: gal(['Caniche avant', 'Caniche après', 'Shih tzu', 'Chat persan', 'Golden', 'Le salon']),
        booking: act('Prendre rendez-vous', EX, 'Créneaux disponibles en ligne.'),
        animaux: tags('Chiens toutes tailles, Chats, Lapins'),
        zone: tags('Lyon, Villeurbanne, Bron, Vaulx-en-Velin', 'Toilettage à domicile dans un rayon de 15 km.', false),
        hours: hours([['Mardi – Samedi', '9h – 18h'], ['Dimanche – Lundi', 'Fermé']]),
        conditions: list([['Vaccins à jour', 'Carnet demandé au premier rendez-vous'], ['Durée', 'Comptez 1 h 30 à 3 h selon la race']], false),
        video: vid(),
      },
    },
  };

  /* ---------- F19 Boutiques, marques et artisanat ---------- */
  EXTRA.boutiques = {
    rec: 'd3', establishment: true,
    palettes: [pal('Argent', '#374151', '#cbd5e1'), pal('Or rose', '#9f5f5f', '#f1c6b8'), pal('Jade', '#0f5e4b', '#a7d7c5'), pal('Noir velours', '#18181b', '#d4af37'), pal('Bleu céramique', '#1e4f7a', '#f2d0a4')],
    blocks: [
      B('about', 'text', 'La marque', { help: '80 à 180 mots conseillés' }),
      B('collection', 'cards', 'Collection', { price: true, help: 'Vos produits phares' }),
      B('craft', 'text', 'Savoir-faire'),
      B('shop', 'action', 'Boutique en ligne', { cta: 'Visiter la boutique', icon: 'bag' }),
      B('surmesure', 'form', 'Sur mesure', { cta: 'Commander une pièce sur mesure' }),
      B('gallery', 'gallery', 'L’atelier'),
      B('location', 'location', 'Boutique'),
      B('hours', 'hours', 'Horaires'),
      B('video', 'video', 'Fabrication'),
    ],
    demo: {
      primary: 'shop',
      identity: id('Atelier Solène', 'Bijoux faits main', 'Argent recyclé · Pièces uniques', '', 'L’établi', 'ph:logo'),
      contact: ct('06 90 80 70 60', 'hello@atelier-solene.fr', 'atelier-solene.fr'),
      socials: so({ instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/' }),
      blocks: {
        about: text('Des bijoux sobres et durables, façonnés un à un dans mon atelier lyonnais à partir d’argent 100 % recyclé.'),
        collection: cards([['Bague Onde', 'Argent 925 recyclé', '68 €'], ['Créoles Lune', 'Martelées à la main', '85 €'], ['Collier Galet', 'Pièce unique', '120 €']]),
        craft: text('Chaque pièce est sciée, soudée et polie à la main. Comptez 2 à 4 heures de travail par bijou.', false),
        shop: act('Visiter la boutique', EX, 'Livraison offerte dès 60 €.'),
        surmesure: form('hello@atelier-solene.fr', 'Alliances, cadeaux, gravures : décrivez la pièce dont vous rêvez.', true, false),
        gallery: gal(['L’établi', 'Polissage', 'Bague Onde', 'Emballage'], false),
        location: loc('14 rue Burdeau, 69001 Lyon', 'Atelier-boutique sur les pentes de la Croix-Rousse'),
        hours: hours([['Mercredi – Samedi', '11h – 19h'], ['Dimanche – Mardi', 'Sur rendez-vous']]),
        video: vid(),
      },
    },
  };

  /* ---------- F20 Automobile et mobilité ---------- */
  EXTRA.auto = {
    rec: 'd1',
    palettes: [pal('Rouge course', '#b91c1c', '#fbbf24'), pal('Bleu mécanique', '#1e40af', '#f59e0b'), pal('Noir carbone', '#18181b', '#ef4444'), pal('Vert anglais', '#14532d', '#d4af37'), pal('Gris acier', '#374151', '#38bdf8')],
    blocks: [
      B('about', 'text', 'Le garage', { help: '100 à 180 mots conseillés' }),
      B('services', 'list', 'Prestations', { price: true }),
      B('booking', 'action', 'Atelier', { cta: 'Prendre rendez-vous atelier', icon: 'cal' }),
      B('devis', 'form', 'Demande de devis', { cta: 'Demander un devis' }),
      B('vehicules', 'cards', 'Véhicules à vendre', { price: true, help: 'Activez uniquement si vous vendez des véhicules' }),
      B('garanties', 'tags', 'Garanties', { icon: 'shield' }),
      B('hours', 'hours', 'Horaires'),
      B('location', 'location', 'Accès'),
      B('gallery', 'gallery', 'L’atelier'),
      B('video', 'video', 'Vidéo'),
    ],
    demo: {
      primary: 'booking',
      identity: id('Antoine Lopez', 'Garagiste', 'Entretien toutes marques · Carrosserie', 'Garage Lopez', 'L’atelier'),
      contact: ct('04 72 33 44 55', 'atelier@garage-lopez.fr', 'garage-lopez.fr', '+33 6 72 33 44 55'),
      socials: so({ facebook: 'https://facebook.com/' }),
      blocks: {
        about: text('Garage indépendant depuis 1998, nous entretenons et réparons toutes les marques avec des pièces d’origine ou équivalentes, au juste prix.'),
        services: list([['Vidange + filtres', 'Selon préconisations constructeur', 'dès 89 €'], ['Diagnostic électronique', 'Lecture et effacement des défauts', '49 €'], ['Pneumatiques', 'Montage et équilibrage', 'dès 15 € / pneu'], ['Carrosserie', 'Rayures, chocs, peinture', 'Sur devis']]),
        booking: act('Prendre rendez-vous atelier', EX, 'Véhicule de prêt sur réservation.'),
        devis: form('atelier@garage-lopez.fr', 'Indiquez votre véhicule, son immatriculation et la réparation souhaitée.', true),
        vehicules: cards([['Peugeot 308 · 2021', '45 000 km · Diesel', '17 900 €'], ['Renault Clio · 2020', '38 000 km · Essence', '12 500 €']], false),
        garanties: tags('Pièces garanties 2 ans, Devis gratuit, Véhicule de prêt'),
        hours: hours([['Lundi – Vendredi', '8h – 12h · 14h – 18h30'], ['Samedi', '8h – 12h']]),
        location: loc('32 avenue Jean Jaurès, 69007 Lyon', 'Parking clients devant le garage'),
        gallery: gal(['L’atelier', 'Carrosserie', 'Diagnostic'], false),
        video: vid(),
      },
    },
  };

  NFC.SECTORS = NFC.SECTORS.map((s) => (EXTRA[s.id] ? Object.assign({}, s, EXTRA[s.id], { active: true }) : s));
})();
