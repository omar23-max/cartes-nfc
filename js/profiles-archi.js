/* Métiers du secteur « Architecture et conception d’espaces » (10 métiers). Même principe que profiles.js.
   Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/archi/';
  const im = (id) => F + id + '.jpg';

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: im(M.portrait), cover: im(M.cover), logo: '' });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: L.wa ? phone : '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, L.so || { instagram: 'https://instagram.com/', linkedin: 'https://linkedin.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.projets, { on: true, title: L.projTitle || '', items: L.proj.map(([t, dd], i) => ({ t, d: dd, p: '', img: im(M.gal[i]), url: '' })) });
    Object.assign(b.demarche, { on: true, title: L.stepsTitle || '', items: L.steps.map(([t, dd]) => ({ t, d: dd, p: '' })) });
    Object.assign(b.gallery, { on: true, title: L.galTitle, images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    Object.assign(b.services, { on: true, title: L.servTitle || '', items: L.serv.map(([t, dd, p]) => ({ t, d: dd, p })) });
    Object.assign(b.projet, { on: true, title: L.formTitle || '', email, text: L.form, photos: true, files: true });
    Object.assign(b.video, { on: true, url: '', src: F + 'v' + M.video + '.mp4', cover: im(M.video), cap: L.vid });
    Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    if (b.booking) b.booking.email = email;
    return d;
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.gal.slice(0, 3).map(im),
    video: { src: F + 'v' + M.video + '.mp4', poster: im(M.video), cap: L.vid },
  });

  const ARCHI = [
    { id: 'interieur', icon: 'sofa', keep: true, n: ['Architecte d’intérieur', 'Interior architect'], ex: ['Rénovation, plans 3D, suivi de chantier', 'Renovation, 3D plans, site follow-up'] },

    { id: 'paysagiste', icon: 'trees', rec: 'd3',
      n: ['Paysagiste', 'Landscape designer'], ex: ['Conception de jardins, aménagement extérieur', 'Garden design, outdoor spaces'],
      pal: [pal('Vert forêt', '#166534', '#bef264'), pal('Olivier', '#5b6b2f', '#d9c27a'), pal('Terre', '#7c4a24', '#e9b872'), pal('Sauge', '#52705f', '#cfe0cf'), pal('Pierre', '#6b6259', '#e3dacd'), pal('Bleu lac', '#155e75', '#a5f3fc')],
      M: { portrait: 46092, cover: 18741, gal: [32941, 44970, 4205, 40656, 3000, 43708], video: 32941 },
      fr: { id: ['Hazel Monroe', 'Paysagiste conceptrice', 'Jardins · Terrasses · Plantations', 'Monroe Paysage'], ct: ['+1 450 555-0185', 'bonjour@monroepaysage.ca', 'monroepaysage.ca'],
        about: ['L’atelier', 'Nous concevons des jardins qui vivent toute l’année : plantes indigènes résistantes à l’hiver québécois, terrasses, sentiers et éclairage. Du plan 3D à la plantation, un seul interlocuteur.'],
        projTitle: 'Projets récents', proj: [['Jardin de vivaces', 'Boucherville · 2 500 pi² · plantes indigènes'], ['Allée paysagère', 'Saint-Bruno · pavé et arbres fruitiers'], ['Cour arrière au soleil couchant', 'Longueuil · terrasse et éclairage']],
        stepsTitle: 'Notre démarche', steps: [['Visite du terrain', 'Sol, ensoleillement, vos envies'], ['Plan d’aménagement 3D', 'Vous voyez le jardin avant les travaux'], ['Réalisation', 'Plantation et finitions par notre équipe']],
        galTitle: 'Nos jardins', gal: ['Jardin fleuri', 'Allée de cerisiers', 'Jardin au crépuscule', 'Sentier paysager', 'Floraison d’été', 'Plantes en pépinière'],
        servTitle: 'Services et tarifs', serv: [['Consultation sur place', '1 h 30 · recommandations écrites', '250 $'], ['Plan d’aménagement 3D', 'Cour avant ou arrière', 'dès 1 800 $'], ['Réalisation clé en main', 'Plantation, pavé, éclairage', 'Sur soumission']],
        formTitle: 'Parlons de votre jardin', form: 'Taille du terrain, budget, photos de votre cour : décrivez votre projet, je vous rappelle sous 48 h.',
        vid: 'Un jardin au printemps',
        rev: [['Famille Lavoie', 'Cour arrière', 'Notre cour est devenue notre pièce préférée l’été.'], ['Sophie M.', 'Jardin de vivaces', 'Fleuri d’avril à octobre, et si facile d’entretien.']] },
      en: { id: ['Hazel Monroe', 'Landscape designer', 'Gardens · Patios · Plantings', 'Monroe Landscapes'], ct: ['+1 503 555-0185', 'hello@monroelandscapes.com', 'monroelandscapes.com'],
        about: ['The studio', 'We design gardens that live all year: native, climate-ready plants, patios, paths and lighting. From 3D plan to planting, one point of contact.'],
        projTitle: 'Recent projects', proj: [['Perennial garden', 'Lake Oswego · 2,500 sq ft · native plants'], ['Garden walkway', 'Beaverton · pavers and fruit trees'], ['Sunset backyard', 'Portland · patio and lighting']],
        stepsTitle: 'Our process', steps: [['Site visit', 'Soil, sun, your wishes'], ['3D landscape plan', 'See the garden before work starts'], ['Installation', 'Planting and finishing by our crew']],
        galTitle: 'Our gardens', gal: ['Flower garden', 'Cherry tree path', 'Garden at dusk', 'Landscaped trail', 'Summer bloom', 'Nursery plants'],
        servTitle: 'Services & pricing', serv: [['On-site consultation', '90 min · written recommendations', '$250'], ['3D landscape plan', 'Front or backyard', 'from $1,800'], ['Turnkey installation', 'Planting, pavers, lighting', 'Custom quote']],
        formTitle: 'Let’s talk about your garden', form: 'Lot size, budget, photos of your yard: describe your project and I’ll call you back within 48 hours.',
        vid: 'A garden in spring',
        rev: [['The Lawson family', 'Backyard', 'Our backyard became our favorite room all summer.'], ['Sophie M.', 'Perennial garden', 'In bloom from April to October, and so easy to care for.']] } },

    { id: 'jardinier', icon: 'shovel', rec: 'd1',
      n: ['Jardinier', 'Gardener'], ex: ['Entretien, tonte, taille, plantations', 'Lawn care, pruning, planting'],
      pal: [pal('Vert potager', '#3f6212', '#f59e0b'), pal('Vert pomme', '#4d7c0f', '#d9f99d'), pal('Terre', '#7c4a24', '#e9b872'), pal('Vert sapin', '#1f4d3a', '#bef264'), pal('Graphite', '#27272a', '#a3e635'), pal('Miel', '#a16207', '#fde68a')],
      M: { portrait: 43702, cover: 10472, gal: [47172, 4776, 43697, 964, 25222, 47080], video: 10472 },
      fr: { id: ['Tom Barrett', 'Jardinier', 'Tonte · Taille · Plantations', 'Barrett Entretien paysager'], ct: ['+1 418 555-0191', 'info@barrettjardin.ca', 'barrettjardin.ca'], wa: true,
        about: ['Qui suis-je ?', 'Jardinier depuis 14 ans, j’entretiens les terrains résidentiels de Québec et des environs : tonte, taille des haies, plates-bandes, potagers et fermeture de saison. Contrats saisonniers ou visites ponctuelles.'],
        projTitle: 'Réalisations', proj: [['Entretien saisonnier', 'Sainte-Foy · tonte hebdomadaire'], ['Potager surélevé', 'Charlesbourg · bacs en cèdre'], ['Plates-bandes', 'Beauport · vivaces et paillis']],
        stepsTitle: 'Comment ça marche', steps: [['Visite gratuite', 'J’évalue votre terrain'], ['Soumission claire', 'Prix fixe pour la saison'], ['Entretien régulier', 'Même équipe à chaque visite']],
        galTitle: 'Au travail', gal: ['Coupe-bordure', 'Arrosage', 'Plantation', 'Taille douce', 'Potager', 'Semis'],
        servTitle: 'Tarifs', serv: [['Contrat de tonte', 'Mai à octobre · chaque semaine', 'dès 45 $ / visite'], ['Taille de haies', 'Haie de cèdres', 'dès 180 $'], ['Ouverture et fermeture', 'Nettoyage du printemps et de l’automne', '220 $']],
        formTitle: 'Demander une soumission', form: 'Adresse, superficie approximative, services souhaités : je passe évaluer gratuitement.',
        vid: 'Entretien d’un terrain',
        rev: [['Gaétan B.', 'Contrat de tonte', 'Ponctuel et soigneux, ma pelouse n’a jamais été aussi belle.'], ['Lise P.', 'Potager', 'Des conseils précieux et un potager qui produit tout l’été.']] },
      en: { id: ['Tom Barrett', 'Gardener', 'Mowing · Pruning · Planting', 'Barrett Lawn & Garden'], ct: ['+1 704 555-0191', 'info@barrettgarden.com', 'barrettgarden.com'], wa: true,
        about: ['About me', 'A gardener for 14 years, I care for residential yards around Charlotte: mowing, hedge trimming, flower beds, vegetable gardens and seasonal cleanups. Seasonal contracts or one-time visits.'],
        projTitle: 'Our work', proj: [['Seasonal maintenance', 'Myers Park · weekly mowing'], ['Raised vegetable beds', 'Dilworth · cedar planters'], ['Flower beds', 'NoDa · perennials and mulch']],
        stepsTitle: 'How it works', steps: [['Free visit', 'I assess your yard'], ['Clear quote', 'Fixed price for the season'], ['Regular care', 'Same crew every visit']],
        galTitle: 'At work', gal: ['String trimmer', 'Watering', 'Planting', 'Pruning', 'Vegetable garden', 'Seeding'],
        servTitle: 'Pricing', serv: [['Mowing contract', 'April to October · weekly', 'from $45 / visit'], ['Hedge trimming', 'Standard hedge', 'from $180'], ['Spring & fall cleanup', 'Leaves, beds, edging', '$220']],
        formTitle: 'Request a quote', form: 'Address, approximate yard size, services you need: I’ll come by for a free estimate.',
        vid: 'Yard maintenance',
        rev: [['Gary B.', 'Mowing contract', 'On time and careful, my lawn has never looked better.'], ['Lisa P.', 'Vegetable garden', 'Great advice and a garden that produces all summer.']] } },

    { id: 'architecte', icon: 'drafting-compass', rec: 'd2',
      n: ['Architecte', 'Architect'], ex: ['Maisons, agrandissements, permis', 'Homes, additions, permits'],
      pal: [pal('Marine & or', '#1b2a4a', '#c8a24a'), pal('Béton', '#3a3a3a', '#c2b8a3'), pal('Bleu nuit', '#1f2a44', '#d4b483'), pal('Terracotta', '#a4512e', '#f0c29e'), pal('Vert sapin', '#1f4d3a', '#b8a26a'), pal('Ardoise', '#2f3a45', '#8fb0cc')],
      M: { portrait: 21228, cover: 36893, gal: [21220, 36909, 36920, 34274, 21226, 4648], video: 21226 },
      fr: { id: ['Victor Lane', 'Architecte', 'Maisons neuves · Agrandissements · Permis', 'Lane Architecture'], ct: ['+1 514 555-0114', 'info@lanearchitecture.ca', 'lanearchitecture.ca'],
        so: { linkedin: 'https://linkedin.com/', instagram: 'https://instagram.com/' },
        about: ['L’atelier', 'Membre de l’Ordre des architectes du Québec, je conçois maisons neuves, agrandissements et transformations de plex. De l’esquisse au permis de construire, puis à la surveillance de chantier.'],
        projTitle: 'Projets', proj: [['Maison passive', 'Laurentides · 2 200 pi² · bois et béton'], ['Agrandissement arrière', 'Ahuntsic · cuisine et verrière'], ['Transformation de duplex', 'Verdun · deux logements en un']],
        stepsTitle: 'Notre démarche', steps: [['Esquisse', 'Vos besoins, votre budget, votre terrain'], ['Plans et permis', 'Dossier complet pour la ville'], ['Surveillance de chantier', 'Conformité et qualité']],
        galTitle: 'À l’atelier', gal: ['Plans de travail', 'Atelier de conception', 'Revue de projet', 'Détails au crayon', 'Maquette', 'Visite de chantier'],
        servTitle: 'Honoraires', serv: [['Étude de faisabilité', 'Zonage et potentiel du terrain', '950 $'], ['Plans pour permis', 'Agrandissement ou maison', 'dès 6 500 $'], ['Mission complète', 'Conception et surveillance', '8 à 12 % des travaux']],
        formTitle: 'Parlons de votre projet', form: 'Adresse du terrain, type de projet, budget : joignez vos photos ou plans existants.',
        vid: 'Maquette d’un projet',
        rev: [['Annie & Marc', 'Maison neuve', 'Un design qui nous ressemble, livré dans le budget.'], ['Pierre-Luc T.', 'Agrandissement', 'Permis obtenu rapidement grâce à un dossier impeccable.']] },
      en: { id: ['Victor Lane', 'Architect, AIA', 'New homes · Additions · Permits', 'Lane Architecture'], ct: ['+1 720 555-0114', 'info@lanearchitecture.com', 'lanearchitecture.com'],
        so: { linkedin: 'https://linkedin.com/', instagram: 'https://instagram.com/' },
        about: ['The studio', 'A licensed architect, I design new homes, additions and remodels. From first sketch to building permit, then construction administration.'],
        projTitle: 'Projects', proj: [['Passive house', 'Boulder · 2,200 sq ft · wood and concrete'], ['Rear addition', 'Highlands · kitchen and sunroom'], ['Duplex conversion', 'Baker · two units into one']],
        stepsTitle: 'Our process', steps: [['Schematic design', 'Your needs, budget and lot'], ['Plans & permits', 'Complete city submittal'], ['Construction administration', 'Compliance and quality']],
        galTitle: 'In the studio', gal: ['Working drawings', 'Design studio', 'Project review', 'Pencil details', 'Scale model', 'Site visit'],
        servTitle: 'Fees', serv: [['Feasibility study', 'Zoning and lot potential', '$950'], ['Permit drawings', 'Addition or new home', 'from $6,500'], ['Full service', 'Design and administration', '8–12% of construction']],
        formTitle: 'Let’s talk about your project', form: 'Lot address, project type, budget: attach photos or existing plans.',
        vid: 'A project model',
        rev: [['Annie & Mark', 'New home', 'A design that feels like us, delivered on budget.'], ['Paul T.', 'Addition', 'Permit approved quickly thanks to a flawless submittal.']] } },

    { id: 'deco', icon: 'lamp', rec: 'd10',
      n: ['Décoratrice d’intérieur', 'Interior decorator'], ex: ['Couleurs, mobilier, ambiance', 'Colors, furniture, styling'],
      pal: [pal('Terracotta', '#a4512e', '#f0c29e'), pal('Vert sauge', '#4f6b58', '#c9d6c3'), pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Bleu nuit', '#1f2a44', '#d4b483'), pal('Blush', '#a8556b', '#f5d0d8'), pal('Lin', '#57534e', '#d6cfc2')],
      M: { portrait: 6366, cover: 3090, gal: [9149, 3091, 3110, 4029, 41185, 13225], video: 9149 },
      fr: { id: ['Chloe Bennington', 'Décoratrice d’intérieur', 'Couleurs · Mobilier · Ambiance', 'Studio Bennington'], ct: ['+1 514 555-0197', 'bonjour@studiobennington.ca', 'studiobennington.ca'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['Le studio', 'Je transforme vos pièces sans gros travaux : palette de couleurs, choix du mobilier, éclairage et objets. Planche d’ambiance, liste d’achats et installation le jour J.'],
        projTitle: 'Projets récents', proj: [['Salon lumineux', 'Plateau · bois clair et lin'], ['Salle à manger', 'Villeray · ambiance scandinave'], ['Condo locatif', 'Griffintown · décor complet']],
        stepsTitle: 'Comment ça marche', steps: [['Rencontre chez vous', 'Vos goûts, votre budget'], ['Planche d’ambiance', 'Couleurs, mobilier, textiles'], ['Installation', 'On place tout, vous profitez']],
        galTitle: 'Inspirations', gal: ['Atelier créatif', 'Salle à manger', 'Salon moderne', 'Chambre cosy', 'Idées sur tablette', 'Choix des matières'],
        servTitle: 'Forfaits', serv: [['Consultation déco', '2 h · conseils et palette', '275 $'], ['Planche d’ambiance', 'Une pièce · liste d’achats', '650 $'], ['Décor clé en main', 'Achats et installation', 'Sur soumission']],
        formTitle: 'Parlons de votre pièce', form: 'Pièce à transformer, photos, budget : je vous propose un premier concept.',
        vid: 'Atelier de décoration',
        rev: [['Mélanie L.', 'Salon', 'Je ne reconnais plus mon salon, en mieux !'], ['Jonathan K.', 'Condo locatif', 'Loué en une semaine grâce au nouveau décor.']] },
      en: { id: ['Chloe Bennington', 'Interior decorator', 'Colors · Furniture · Styling', 'Bennington Studio'], ct: ['+1 404 555-0197', 'hello@benningtonstudio.com', 'benningtonstudio.com'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['The studio', 'I transform your rooms without major work: color palette, furniture, lighting and decor. Mood board, shopping list and install day included.'],
        projTitle: 'Recent projects', proj: [['Bright living room', 'Inman Park · light wood and linen'], ['Dining room', 'Virginia-Highland · Scandinavian feel'], ['Rental condo', 'Midtown · full styling']],
        stepsTitle: 'How it works', steps: [['In-home meeting', 'Your taste, your budget'], ['Mood board', 'Colors, furniture, textiles'], ['Install day', 'We place everything, you enjoy']],
        galTitle: 'Inspiration', gal: ['Creative studio', 'Dining room', 'Modern living room', 'Cozy bedroom', 'Ideas on tablet', 'Choosing materials'],
        servTitle: 'Packages', serv: [['Design consultation', '2 hrs · advice and palette', '$275'], ['Mood board', 'One room · shopping list', '$650'], ['Turnkey styling', 'Shopping and install', 'Custom quote']],
        formTitle: 'Let’s talk about your room', form: 'Room to transform, photos, budget: I’ll send you a first concept.',
        vid: 'Design workshop',
        rev: [['Melanie L.', 'Living room', 'I don’t recognize my living room, in the best way!'], ['Jonathan K.', 'Rental condo', 'Rented in a week thanks to the new look.']] } },

    { id: 'renovation', icon: 'hammer', rec: 'd8',
      n: ['Entrepreneur en rénovation', 'Remodeling contractor'], ex: ['Cuisines, salles de bain, agrandissements', 'Kitchens, baths, additions'],
      pal: [pal('Orange sécurité', '#c2410c', '#fbbf24'), pal('Bleu acier', '#1f3a5f', '#f97316'), pal('Graphite', '#18181b', '#eab308'), pal('Rouge brique', '#9f1239', '#fb923c'), pal('Vert atelier', '#166534', '#eab308'), pal('Béton', '#3a3a3a', '#c2b8a3')],
      M: { portrait: 1459, cover: 31473, gal: [20874, 25480, 23511, 9686, 1437, 14729], video: 9686 },
      fr: { id: ['Mike Donovan', 'Entrepreneur général', 'Rénovation · Agrandissement · Clé en main', 'Rénovations Donovan'], ct: ['+1 450 555-0118', 'info@renovationsdonovan.ca', 'renovationsdonovan.ca'], wa: true,
        about: ['L’entreprise', 'Entrepreneur général licencié RBQ, nous rénovons cuisines, salles de bain et sous-sols, et réalisons des agrandissements. Une équipe stable, un échéancier clair et un chantier propre chaque soir.'],
        projTitle: 'Chantiers récents', proj: [['Mur de briques', 'Terrebonne · façade restaurée'], ['Charpente d’agrandissement', 'Blainville · 600 pi²'], ['Suivi de chantier', 'Mirabel · maison neuve']],
        stepsTitle: 'Notre façon de faire', steps: [['Visite et soumission', 'Gratuite et détaillée'], ['Échéancier', 'Dates fixées par écrit'], ['Garantie', 'Garantie de construction résidentielle']],
        galTitle: 'Sur nos chantiers', gal: ['Maçonnerie', 'Structure', 'Revue des plans', 'Grand chantier', 'Matériaux', 'Coulée de béton'],
        servTitle: 'Prix indicatifs', serv: [['Salle de bain complète', 'Démolition à finition', 'dès 18 000 $'], ['Cuisine', 'Armoires, comptoirs, plomberie', 'dès 32 000 $'], ['Sous-sol', 'Finition complète', 'dès 45 $ / pi²']],
        formTitle: 'Demander une soumission', form: 'Type de travaux, superficie, budget et photos : nous vous rappelons sous 24 h.',
        vid: 'Un chantier en accéléré',
        rev: [['Famille Bélanger', 'Cuisine', 'Livré à la date prévue, au prix prévu. Rare !'], ['Karine D.', 'Salle de bain', 'Équipe propre et respectueuse, résultat magnifique.']] },
      en: { id: ['Mike Donovan', 'General contractor', 'Remodels · Additions · Turnkey', 'Donovan Remodeling'], ct: ['+1 480 555-0118', 'info@donovanremodeling.com', 'donovanremodeling.com'], wa: true,
        about: ['The company', 'A licensed and insured general contractor, we remodel kitchens, bathrooms and basements and build additions. A steady crew, a clear schedule and a clean site every night.'],
        projTitle: 'Recent jobs', proj: [['Brick wall', 'Mesa · restored facade'], ['Addition framing', 'Gilbert · 600 sq ft'], ['Job site management', 'Chandler · new home']],
        stepsTitle: 'How we work', steps: [['Visit & estimate', 'Free and detailed'], ['Schedule', 'Dates in writing'], ['Warranty', '2-year workmanship warranty']],
        galTitle: 'On our job sites', gal: ['Masonry', 'Structure', 'Plan review', 'Large build', 'Materials', 'Concrete pour'],
        servTitle: 'Typical pricing', serv: [['Full bathroom remodel', 'Demo to finish', 'from $18,000'], ['Kitchen remodel', 'Cabinets, counters, plumbing', 'from $32,000'], ['Basement finish', 'Complete', 'from $45 / sq ft']],
        formTitle: 'Request an estimate', form: 'Type of work, square footage, budget and photos: we’ll call you back within 24 hours.',
        vid: 'A build in time-lapse',
        rev: [['The Bell family', 'Kitchen', 'Finished on the date promised, at the price promised. Rare!'], ['Karen D.', 'Bathroom', 'Clean, respectful crew and a beautiful result.']] } },

    { id: 'staging', icon: 'house', rec: 'd6',
      n: ['Home staging', 'Home staging'], ex: ['Mise en valeur pour la vente', 'Styling homes to sell'],
      pal: [pal('Lin', '#57534e', '#d6cfc2'), pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Bleu ardoise', '#1e3a5f', '#e0a458'), pal('Sauge', '#52705f', '#cfe0cf'), pal('Noir chic', '#1a1a1a', '#c5a572'), pal('Blush', '#a8556b', '#f5d0d8')],
      M: { portrait: 25395, cover: 4196, gal: [4031, 4198, 34613, 4019, 3112, 3109], video: 4196 },
      fr: { id: ['Paige Sullivan-Reed', 'Spécialiste en home staging', 'Mise en valeur · Photos · Vente rapide', 'Staging Signature'], ct: ['+1 514 555-0168', 'bonjour@stagingsignature.ca', 'stagingsignature.ca'],
        about: ['Mon métier', 'Je prépare votre propriété pour qu’elle se vende plus vite et plus cher : désencombrement, mobilier de location, éclairage et accessoires, prêts pour la séance photo de votre courtier.'],
        projTitle: 'Avant la vente', proj: [['Condo au centre-ville', 'Vendu en 9 jours'], ['Chambre principale', 'Ambiance hôtel'], ['Corridor d’immeuble', 'Mise en valeur des aires communes']],
        stepsTitle: 'Le déroulement', steps: [['Visite conseil', 'Ce qu’il faut garder, ranger, ajouter'], ['Installation', 'Mobilier et accessoires en une journée'], ['Retrait après la vente', 'On récupère tout']],
        galTitle: 'Nos mises en scène', gal: ['Salon chaleureux', 'Chambre lumineuse', 'Aires communes', 'Chambre classique', 'Chambre d’amis', 'Petit espace'],
        servTitle: 'Tarifs', serv: [['Consultation', '2 h · rapport de recommandations', '250 $'], ['Staging occupé', 'Avec vos meubles', 'dès 900 $'], ['Staging vacant', 'Mobilier de location · 1er mois', 'dès 2 400 $']],
        formTitle: 'Préparer ma vente', form: 'Adresse, nombre de pièces, date de mise en vente : je vous propose un plan de mise en valeur.',
        vid: 'Une chambre mise en valeur',
        rev: [['Martin & Julie', 'Vendeurs', 'Vendu au-dessus du prix demandé en une semaine.'], ['Isabelle R.', 'Courtière', 'Mes inscriptions avec Paige se démarquent sur les photos.']] },
      en: { id: ['Paige Sullivan-Reed', 'Home stager', 'Staging · Photos · Faster sales', 'Signature Staging'], ct: ['+1 469 555-0168', 'hello@signaturestaging.com', 'signaturestaging.com'],
        about: ['What I do', 'I get your property ready to sell faster and for more: decluttering, rental furniture, lighting and accessories, ready for your agent’s photo shoot.'],
        projTitle: 'Before the sale', proj: [['Downtown condo', 'Sold in 9 days'], ['Primary bedroom', 'Hotel-style feel'], ['Building hallway', 'Common areas refreshed']],
        stepsTitle: 'The process', steps: [['Consultation', 'What to keep, store or add'], ['Install', 'Furniture and decor in one day'], ['Removal after the sale', 'We pick everything up']],
        galTitle: 'Our staging', gal: ['Warm living room', 'Bright bedroom', 'Common areas', 'Classic bedroom', 'Guest room', 'Small space'],
        servTitle: 'Pricing', serv: [['Consultation', '2 hrs · written report', '$250'], ['Occupied staging', 'Using your furniture', 'from $900'], ['Vacant staging', 'Rental furniture · first month', 'from $2,400']],
        formTitle: 'Get my home ready', form: 'Address, number of rooms, listing date: I’ll send you a staging plan.',
        vid: 'A staged bedroom',
        rev: [['Martin & Julie', 'Sellers', 'Sold over asking in a week.'], ['Isabel R.', 'Realtor', 'My listings with Paige stand out in the photos.']] } },

    { id: 'piscine', icon: 'waves', rec: 'd3',
      n: ['Concepteur de piscines', 'Pool designer'], ex: ['Piscines, spas, cours arrière', 'Pools, hot tubs, backyards'],
      pal: [pal('Bleu piscine', '#0e7490', '#fcd34d'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Bleu azur', '#0369a1', '#fbbf24'), pal('Sable', '#7a5c3e', '#e6d3b3'), pal('Graphite', '#27272a', '#38bdf8'), pal('Bleu nuit', '#1e3a8a', '#fde68a')],
      M: { portrait: 27543, cover: 4045, gal: [3105, 43076, 1265, 1280, 27543, 24945], video: 4045 },
      fr: { id: ['Ryan Calloway', 'Concepteur de piscines', 'Piscines creusées · Spas · Cours arrière', 'Calloway Piscines & Jardins'], ct: ['+1 450 555-0129', 'info@callowaypiscines.ca', 'callowaypiscines.ca'], wa: true,
        about: ['L’entreprise', 'Nous concevons et construisons piscines creusées, spas et aménagements de cours arrière, pensés pour l’été québécois et faciles à fermer l’hiver. Plan 3D, permis et installation clé en main.'],
        projTitle: 'Réalisations', proj: [['Piscine à débordement', 'Lac-Brome · vue sur le lac'], ['Piscine et terrasse', 'Brossard · béton et bois'], ['Spa encastré', 'Saint-Lambert · éclairage DEL']],
        stepsTitle: 'Notre démarche', steps: [['Visite et plan 3D', 'Implantation sur votre terrain'], ['Permis', 'Nous préparons le dossier'], ['Construction', '3 à 5 semaines selon le projet']],
        galTitle: 'Nos piscines', gal: ['Terrasse au bord de l’eau', 'Eau cristalline', 'Reflets', 'Mosaïque', 'Maison contemporaine', 'Quartier résidentiel'],
        servTitle: 'Prix indicatifs', serv: [['Piscine creusée', 'Béton ou fibre de verre', 'dès 65 000 $'], ['Spa', 'Encastré ou hors terre', 'dès 14 000 $'], ['Ouverture et fermeture', 'Service saisonnier', '350 $']],
        formTitle: 'Parlons de votre cour', form: 'Dimensions de la cour, type de piscine souhaité, budget : joignez une photo de votre terrain.',
        vid: 'Une piscine au soleil',
        rev: [['Famille Gagnon', 'Piscine creusée', 'Notre cour est devenue un vrai coin de vacances.'], ['Daniel L.', 'Spa', 'Installation rapide et soignée, on en profite tout l’hiver.']] },
      en: { id: ['Ryan Calloway', 'Pool designer & builder', 'Inground pools · Hot tubs · Backyards', 'Calloway Pools & Patios'], ct: ['+1 602 555-0129', 'info@callowaypools.com', 'callowaypools.com'], wa: true,
        about: ['The company', 'We design and build inground pools, hot tubs and backyard living spaces made for desert summers. 3D design, permits and turnkey installation.'],
        projTitle: 'Our work', proj: [['Infinity-edge pool', 'Paradise Valley · mountain view'], ['Pool & patio', 'Scottsdale · travertine and pergola'], ['Built-in hot tub', 'Tempe · LED lighting']],
        stepsTitle: 'Our process', steps: [['Visit & 3D design', 'Placement on your lot'], ['Permits', 'We handle the paperwork'], ['Construction', '6 to 10 weeks depending on the project']],
        galTitle: 'Our pools', gal: ['Poolside lounge', 'Crystal-clear water', 'Reflections', 'Pool tile', 'Modern home', 'Neighborhood'],
        servTitle: 'Typical pricing', serv: [['Inground pool', 'Gunite or fiberglass', 'from $65,000'], ['Hot tub', 'Built-in or freestanding', 'from $14,000'], ['Weekly pool service', 'Cleaning and chemicals', '$180 / mo']],
        formTitle: 'Let’s talk about your backyard', form: 'Yard dimensions, pool type, budget: attach a photo of your lot.',
        vid: 'A pool in the sun',
        rev: [['The Garcia family', 'Inground pool', 'Our backyard became a real vacation spot.'], ['Dan L.', 'Hot tub', 'Fast, careful install. We use it all year.']] } },

    { id: 'bureaux', icon: 'building-2', rec: 'd7',
      n: ['Designer de bureaux et commerces', 'Commercial interior designer'], ex: ['Bureaux, boutiques, restaurants', 'Offices, retail, restaurants'],
      pal: [pal('Graphite', '#27272a', '#a1a1aa'), pal('Bleu roi', '#1d3fa8', '#7aa2ff'), pal('Vert sapin', '#1f4d3a', '#86efac'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Terracotta', '#a4512e', '#f0c29e'), pal('Ardoise', '#334155', '#94a3b8')],
      M: { portrait: 11569, cover: 12924, gal: [11570, 11571, 13224, 13225, 13218, 36897], video: 11571 },
      fr: { id: ['Isabel Crane', 'Designer d’intérieur commercial', 'Bureaux · Commerces · Restaurants', 'Crane Design Studio'], ct: ['+1 514 555-0136', 'info@cranedesign.ca', 'cranedesign.ca'],
        so: { linkedin: 'https://linkedin.com/', instagram: 'https://instagram.com/' },
        about: ['Le studio', 'Nous concevons des espaces de travail et des commerces qui servent votre image de marque et le bien-être de vos équipes : plan d’aménagement, mobilier, acoustique et gestion des travaux jusqu’à l’ouverture.'],
        projTitle: 'Projets', proj: [['Siège social', 'Centre-ville · 12 000 pi²'], ['Espace collaboratif', 'Mile-Ex · bureaux flexibles'], ['Salle de réunion', 'Vieux-Montréal · acoustique soignée']],
        stepsTitle: 'Notre méthode', steps: [['Programme', 'Besoins, effectifs, image'], ['Concept et plans', 'Rendus 3D et choix des matériaux'], ['Gestion des travaux', 'Jusqu’à l’emménagement']],
        galTitle: 'Nos espaces', gal: ['Bureaux ouverts', 'Poste de travail', 'Atelier de design', 'Réunion d’équipe', 'Plateau à aménager', 'Visite de chantier'],
        servTitle: 'Honoraires', serv: [['Plan d’aménagement', 'Bureaux ou commerce', 'dès 3 500 $'], ['Conception complète', 'Concept, plans, matériaux', 'dès 9 $ / pi²'], ['Gestion de projet', 'Coordination des travaux', 'Sur soumission']],
        formTitle: 'Parlons de votre espace', form: 'Type d’espace, superficie, date d’emménagement : joignez vos plans actuels.',
        vid: 'Un espace de travail',
        rev: [['Agence Nordique', 'Siège social', 'Nos équipes adorent revenir au bureau.'], ['Café Racine', 'Commerce', 'Un lieu qui nous ressemble, ouvert à temps.']] },
      en: { id: ['Isabel Crane', 'Commercial interior designer', 'Offices · Retail · Restaurants', 'Crane Design Studio'], ct: ['+1 312 555-0136', 'info@cranedesign.com', 'cranedesign.com'],
        so: { linkedin: 'https://linkedin.com/', instagram: 'https://instagram.com/' },
        about: ['The studio', 'We design workplaces and stores that serve your brand and your team’s well-being: space planning, furniture, acoustics and project management through opening day.'],
        projTitle: 'Projects', proj: [['Headquarters', 'The Loop · 12,000 sq ft'], ['Collaborative space', 'Fulton Market · flexible offices'], ['Boardroom', 'River North · tuned acoustics']],
        stepsTitle: 'Our method', steps: [['Programming', 'Needs, headcount, brand'], ['Concept & plans', '3D renderings and materials'], ['Project management', 'Through move-in']],
        galTitle: 'Our spaces', gal: ['Open office', 'Workstation', 'Design studio', 'Team meeting', 'Raw floor plate', 'Site walk'],
        servTitle: 'Fees', serv: [['Space plan', 'Office or retail', 'from $3,500'], ['Full design', 'Concept, plans, materials', 'from $9 / sq ft'], ['Project management', 'Construction coordination', 'Custom quote']],
        formTitle: 'Let’s talk about your space', form: 'Type of space, square footage, move-in date: attach your current plans.',
        vid: 'A workplace',
        rev: [['Nordic Agency', 'Headquarters', 'Our teams love coming back to the office.'], ['Root Café', 'Retail', 'A place that feels like us, opened on time.']] } },

    { id: 'ingenieur', icon: 'hard-hat', rec: 'd1',
      n: ['Ingénieur en structure', 'Structural engineer'], ex: ['Calculs, inspections, plans', 'Calculations, inspections, drawings'],
      pal: [pal('Bleu acier', '#1f3a5f', '#f97316'), pal('Graphite', '#27272a', '#facc15'), pal('Bleu roi', '#1d4ed8', '#93c5fd'), pal('Béton', '#3a3a3a', '#c2b8a3'), pal('Vert sapin', '#1f4d3a', '#bef264'), pal('Rouge brique', '#9f1239', '#fb923c')],
      M: { portrait: 23758, cover: 21230, gal: [23170, 23406, 21963, 23734, 14758, 1439], video: 23170 },
      fr: { id: ['Graham Pierce', 'Ingénieur en structure', 'Calculs · Inspections · Plans', 'Pierce Structures'], ct: ['+1 418 555-0108', 'info@piercestructures.ca', 'piercestructures.ca'],
        so: { linkedin: 'https://linkedin.com/' },
        about: ['Le bureau', 'Membre de l’Ordre des ingénieurs du Québec, je réalise les calculs de structure, plans scellés et inspections pour vos rénovations, agrandissements et bâtiments neufs : ouverture de mur porteur, fondations, charpente.'],
        projTitle: 'Mandats récents', proj: [['Immeuble résidentiel', 'Limoilou · structure de 6 étages'], ['Entrepôt', 'Lévis · charpente d’acier'], ['Ouverture de mur porteur', 'Sillery · poutre d’acier']],
        stepsTitle: 'Notre démarche', steps: [['Visite et relevés', 'État de la structure existante'], ['Calculs et plans scellés', 'Pour votre permis'], ['Inspection', 'Validation pendant les travaux']],
        galTitle: 'Sur le terrain', gal: ['Visite de chantier', 'Inspection d’entrepôt', 'Revue des plans', 'Coordination', 'Plans et matériaux', 'Annotations'],
        servTitle: 'Honoraires', serv: [['Ouverture de mur porteur', 'Calcul et plan scellé', 'dès 850 $'], ['Inspection structurale', 'Rapport écrit', 'dès 650 $'], ['Bâtiment neuf', 'Plans complets', 'Sur soumission']],
        formTitle: 'Décrire votre projet', form: 'Type de travaux, adresse, plans existants : joignez vos documents.',
        vid: 'Sur le chantier',
        rev: [['Construction Lévesque', 'Entrepreneur', 'Plans clairs, livrés rapidement, toujours disponible au chantier.'], ['Jean D.', 'Propriétaire', 'Mon mur porteur ouvert en toute sécurité.']] },
      en: { id: ['Graham Pierce', 'Structural engineer, PE', 'Calculations · Inspections · Drawings', 'Pierce Structural'], ct: ['+1 503 555-0108', 'info@piercestructural.com', 'piercestructural.com'],
        so: { linkedin: 'https://linkedin.com/' },
        about: ['The firm', 'A licensed professional engineer, I provide structural calculations, stamped drawings and inspections for remodels, additions and new buildings: load-bearing wall removal, foundations, framing.'],
        projTitle: 'Recent work', proj: [['Residential building', 'Pearl District · 6-story structure'], ['Warehouse', 'Tigard · steel framing'], ['Load-bearing wall removal', 'Sellwood · steel beam']],
        stepsTitle: 'Our process', steps: [['Site visit', 'Existing structure assessment'], ['Calcs & stamped drawings', 'For your permit'], ['Inspection', 'Sign-off during construction']],
        galTitle: 'In the field', gal: ['Site visit', 'Warehouse inspection', 'Plan review', 'Coordination', 'Plans & materials', 'Markups'],
        servTitle: 'Fees', serv: [['Load-bearing wall removal', 'Calcs and stamped drawing', 'from $850'], ['Structural inspection', 'Written report', 'from $650'], ['New building', 'Full drawings', 'Custom quote']],
        formTitle: 'Describe your project', form: 'Type of work, address, existing plans: attach your documents.',
        vid: 'On the job site',
        rev: [['Levesque Builders', 'Contractor', 'Clear drawings, fast turnaround, always available on site.'], ['John D.', 'Homeowner', 'My load-bearing wall came out safely.']] } },
  ];

  const archi = NFC.SECTORS.find((s) => s.id === 'archi');
  if (archi && archi.demo) {
    const keepMedia = NFC.MEDIA.archi;
    archi.profiles = ARCHI.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: archi.demo, demoEn: archi.demoEn, palettes: archi.palettes, rec: archi.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
        demo: build(archi.demo, p.M, p.fr), demoEn: build(archi.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    archi.ex = 'Architecte, décoratrice, paysagiste, jardinier…';
  }
})();
