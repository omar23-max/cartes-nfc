/* NFC Card Studio – Stores : types 7 à 16 (FR = Québec, EN = États-Unis). Même constructeur que stores-types.js.
   Produit : [nom, description, prix, prix soldé, badge, photo, n° de catégorie, options, description longue] — textes en [fr, en].
   Photos : Unsplash (licence gratuite). */
(function () {
  'use strict';

  const T = NFC.storeType;
  const TYPES = [];
  const R = (n, p, t) => [n, p, t];

  /* ---------- Cadeaux et souvenirs ---------- */
  TYPES.push(T({
    id: 'cadeaux', code: 'B07', name: 'Cadeaux et souvenirs', icon: 'gift', ex: 'Boutique cadeaux, souvenirs, artisanat…', rec: 'd8',
    biz: 'Trésors du Nord', handle: 'tresorsdunord', shopTitle: 'Idées cadeaux', cta: 'Voir les idées cadeaux', fee: '9', freeFrom: '80',
    pal: [['Rouge érable', '#8f2d1f', '#f2b45a'], ['Sapin', '#1f4a33', '#e9c46a'], ['Bleu lac', '#1f4e6b', '#f4c27a'], ['Bois', '#5a3e2b', '#e0b07d'], ['Prune', '#4f2a4a', '#f0b6c9'], ['Ardoise', '#2e3440', '#ebcb8b']],
    cover: '1715889868942-b6df178c60b3', rating: [4.8, 231],
    cats: [['Saveurs d’ici', 'Local treats'], ['Maison', 'Home'], ['Enfants', 'Kids'], ['Coffrets et papeterie', 'Gift sets & stationery']],
    prods: [
      [['Coffret-cadeau découverte', 'Discovery gift box'], ['Sirop, miel, bougie et carte', 'Syrup, honey, candle and card'], '59', '', ['Meilleure vente', 'Best seller'], '1513201099705-a9746e1e201f', 3, '',
        ['Un coffret prêt à offrir : sirop d’érable, miel local, bougie parfumée et une carte écrite à la main. Emballage cadeau inclus.', 'A ready-to-give box: maple syrup, local honey, a scented candle and a handwritten card. Gift wrap included.']],
      [['Sirop d’érable', 'Maple syrup'], ['Bouteille feuille d’érable, 250 ml', 'Maple-leaf bottle, 8.5 oz'], '14', '', '', '1552587210-5cc4cd7d13c3', 0, ''],
      [['Miel local', 'Local honey'], ['Miel de fleurs sauvages, 500 g', 'Wildflower honey, 1 lb'], '12', '', '', '1587049352851-8d4e89133924', 0, ''],
      [['Bougie parfumée', 'Scented candle'], ['Cire de soja, coulée à la main', 'Hand-poured soy wax'], '26', '', ['Nouveau', 'New'], '1603905179139-db12ab535ca9', 1, [['Forêt boréale', 'Feu de camp', 'Pomme et cannelle'].join(', '), 'Boreal forest, Campfire, Apple cinnamon']],
      [['Tasse en céramique', 'Ceramic mug'], ['Faite par une potière locale', 'Made by a local potter'], '22', '', '', '1616241673111-508b4662c707', 1, ''],
      [['Sac fourre-tout', 'Canvas tote bag'], ['Coton bio imprimé', 'Printed organic cotton'], '24', '18', ['Solde', 'Sale'], '1544816155-12df9643f363', 1, ''],
      [['Ourson en peluche', 'Teddy bear'], ['Doux, lavable', 'Soft, washable'], '29', '', '', '1641085809270-71f722611ce1', 2, ''],
      [['Cartes postales vintage', 'Vintage postcards'], ['Illustrations d’ici', 'Local illustrations'], '3', '', '', '1742415888176-7de4e0b250cd', 3, ''],
    ],
    gallery: [['1689527612745-a90ea8805008', 'La vitrine', 'Window display'], ['1710794710424-3bda41ac54f1', 'Trouvailles', 'Finds'], ['1598305762558-328f599df683', 'Artisans d’ici', 'Local makers'], ['1777195595983-d9efde4c1223', 'La boutique', 'The shop']],
    reviews: [R('Ashley N.', ['Coffret-cadeau', 'Gift box'], ['Coffret commandé par texto, emballé à la perfection. Un cadeau parfait.', 'Ordered the gift box by text, perfectly wrapped. The perfect gift.']), R('Brian C.', ['Bougie parfumée', 'Scented candle'], ['Plein de produits d’artisans d’ici. On repart toujours avec quelque chose.', 'Full of local makers’ products. I always leave with something.'])],
    fr: { role: 'Boutique cadeaux et souvenirs', spec: 'Produits d’artisans du Québec · Emballage cadeau offert', phone: '418 555-0186', wa: '+1 418 555-0186', email: 'bonjour@tresorsdunord.ca', web: 'tresorsdunord.ca',
      text: 'Tous nos produits sont faits au Québec. Emballage cadeau offert : précisez-le dans votre commande.', zone: 'Québec, Lévis et environs',
      about: 'Trésors du Nord rassemble le travail de plus de 40 artisans et producteurs du Québec.\nSouvenirs, saveurs d’ici ou cadeaux d’affaires : nous vous aidons à trouver le présent qui fera plaisir.',
      addr: '58, rue du Petit-Champlain, Québec (Québec) G1K 4H5', access: 'Funiculaire du Vieux-Québec · Stationnement Dalhousie',
      policies: [['Emballage cadeau', 'Offert sur toutes les commandes, avec une carte écrite à la main.'], ['Cadeaux d’affaires', 'Coffrets personnalisés à votre logo dès 10 unités.'], ['Échanges', '30 jours avec la facture (sauf produits alimentaires).']] },
    en: { role: 'Gift & souvenir shop', spec: 'Locally made gifts · Free gift wrapping', phone: '(802) 555-0186', wa: '+1 802 555-0186', email: 'hello@tresorsdunord.com', web: 'tresorsdunord.com',
      text: 'Everything is locally made. Free gift wrapping: just mention it in your order.', zone: 'Burlington and Chittenden County', rate: '7',
      about: 'Trésors du Nord brings together the work of more than 40 local makers and producers.\nSouvenirs, local treats or corporate gifts: we help you find a present they’ll love.',
      addr: '85 Church St, Burlington, VT 05401', access: 'Church Street Marketplace · Public garage on Cherry St',
      policies: [['Gift wrapping', 'Free on every order, with a handwritten card.'], ['Corporate gifts', 'Custom boxes with your logo from 10 units.'], ['Exchanges', '30 days with receipt (except food items).']] },
  }));

  /* ---------- Vélos ---------- */
  TYPES.push(T({
    id: 'velos', code: 'B08', name: 'Vélos', icon: 'bike', ex: 'Vente, location et réparation de vélos…', rec: 'd5',
    biz: 'Cyclo Atelier', handle: 'cycloatelier', shopTitle: 'Vélos, location et atelier', cta: 'Voir les vélos', fee: '25', freeFrom: '500',
    pal: [['Vert piste', '#1f5130', '#c6e377'], ['Orange', '#b4461c', '#ffcf7a'], ['Bleu', '#1d3f72', '#7cc4ff'], ['Noir mat', '#161616', '#f2c94c'], ['Rouge', '#9b1c1c', '#fca5a5'], ['Acier', '#334155', '#a3e635']],
    cover: '1761634731562-c7a152d89849', rating: [4.8, 187],
    cats: [['Vélos', 'Bikes'], ['Location', 'Rentals'], ['Atelier', 'Repairs'], ['Pièces et accessoires', 'Parts & accessories']],
    prods: [
      [['Vélo de route', 'Road bike'], ['Cadre aluminium, 22 vitesses', 'Aluminum frame, 22 speeds'], '1499', '1299', ['Solde', 'Sale'], '1532298229144-0ec0c57515c7', 0, 'S, M, L, XL',
        ['Vélo de route léger, cadre aluminium et fourche carbone, groupe 22 vitesses. Ajustement à votre taille offert à l’achat.', 'Lightweight road bike, aluminum frame and carbon fork, 22-speed groupset. Free bike fit with purchase.']],
      [['Vélo de ville', 'City bike'], ['Panier, garde-boue, éclairage', 'Basket, fenders, lights'], '749', '', '', '1584278140365-2ab8bff2be82', 0, 'S, M, L'],
      [['Vélo électrique', 'E-bike'], ['Autonomie 80 km', '50-mile range'], '2499', '', ['Nouveau', 'New'], '1673969206245-7da3eb7cde76', 0, 'M, L'],
      [['Location à la journée', 'Day rental'], ['Vélo, casque et cadenas inclus', 'Bike, helmet and lock included'], '45', '', '', '1541625602330-2277a4c46182', 1, [['Vélo de ville', 'Vélo électrique'].join(', '), 'City bike, E-bike']],
      [['Mise au point', 'Tune-up'], ['Freins, vitesses, pneus, sécurité', 'Brakes, gears, tires, safety check'], '89', '', ['Populaire', 'Popular'], '1675798227643-da319f8ee8f7', 2, [['De base', 'Complète'].join(', '), 'Basic, Full']],
      [['Pneu de vélo', 'Bike tire'], ['Installation offerte', 'Free installation'], '45', '', '', '1523357585206-175e971f2ad9', 3, '700c, 26", 27,5", 29"'],
      [['Gants de vélo', 'Cycling gloves'], ['Paume rembourrée', 'Padded palm'], '35', '', '', '1645445470303-f96692cf1217', 3, 'S, M, L'],
    ],
    gallery: [['1562615193-cbeef074a501', 'L’atelier', 'The workshop'], ['1601067095185-b8b73ad7db10', 'En boutique', 'In store'], ['1605271864611-58dd08d10547', 'Nos mécanos', 'Our mechanics'], ['1541625602330-2277a4c46182', 'Sorties du dimanche', 'Sunday rides']],
    reviews: [R('Ryan F.', ['Mise au point', 'Tune-up'], ['Vélo prêt le jour même, travail impeccable et bons conseils.', 'Bike ready the same day, flawless work and great advice.']), R('Jessica L.', ['Vélo électrique', 'E-bike'], ['Ils m’ont laissé essayer trois modèles avant de choisir. Super service.', 'They let me try three models before choosing. Great service.'])],
    fr: { role: 'Boutique et atelier de vélos', spec: 'Vente, location et réparation · Mise au point en 48 h', phone: '514 555-0151', wa: '+1 514 555-0151', email: 'atelier@cycloatelier.ca', web: 'cycloatelier.ca',
      text: 'Réservez votre vélo ou votre mise au point par texto : nous confirmons l’heure de passage.', zone: 'Montréal (île)',
      about: 'Cyclo Atelier, ce sont des passionnés de vélo qui vendent, louent et réparent tous les types de vélos depuis 2012.\nVélos de route, de ville ou électriques : venez les essayer, on vous conseille sans pression.',
      addr: '5150, boulevard Saint-Laurent, Montréal (Québec) H2T 1R8', access: 'Métro Laurier · Piste cyclable Rachel à 5 min',
      hours: [['Lundi – Mercredi', '10 h – 18 h'], ['Jeudi – Vendredi', '10 h – 20 h'], ['Samedi', '9 h – 17 h'], ['Dimanche', '10 h – 16 h (avril à octobre)']], hoursNote: 'Atelier : mise au point en 48 h, urgences le jour même',
      policies: [['Essai gratuit', 'Essayez le vélo avant d’acheter, sur rendez-vous.'], ['Garantie', '1 an d’ajustements gratuits sur tout vélo neuf.'], ['Location', 'Pièce d’identité et carte de crédit demandées au départ.']] },
    en: { role: 'Bike shop & repair', spec: 'Sales, rentals and repairs · Tune-ups in 48 hours', phone: '(503) 555-0151', wa: '+1 503 555-0151', email: 'shop@cycloatelier.com', web: 'cycloatelier.com',
      text: 'Book your bike or tune-up by text: we’ll confirm your drop-off time.', zone: 'Portland metro area', rate: '0',
      about: 'Cyclo Atelier is a team of bike lovers who have been selling, renting and fixing all kinds of bikes since 2012.\nRoad, city or e-bikes: come try them out, no-pressure advice.',
      addr: '2025 SE Hawthorne Blvd, Portland, OR 97214', access: 'Bus 14 · Bike parking out front',
      hours: [['Monday – Wednesday', '10 am – 6 pm'], ['Thursday – Friday', '10 am – 8 pm'], ['Saturday', '9 am – 5 pm'], ['Sunday', '10 am – 4 pm']], hoursNote: 'Workshop: tune-ups in 48 hours, emergencies same day',
      policies: [['Free test ride', 'Try before you buy, by appointment.'], ['Warranty', '1 year of free adjustments on every new bike.'], ['Rentals', 'ID and credit card required at pickup.']] },
  }));

  /* ---------- Cosmétiques naturels ---------- */
  TYPES.push(T({
    id: 'cosmetiques', code: 'B09', name: 'Cosmétiques naturels', icon: 'leaf', ex: 'Savons, soins naturels, zéro déchet…', rec: 'd4',
    biz: 'Savonnerie Bohème', handle: 'savonnerieboheme', shopTitle: 'Nos soins naturels', cta: 'Voir les soins', fee: '7', freeFrom: '60',
    pal: [['Sauge', '#4a5d47', '#d8c9a8'], ['Lavande', '#5f4b8b', '#d7c6f2'], ['Argile', '#8a5a44', '#f1c9a5'], ['Miel', '#7a5a1e', '#f4d27a'], ['Menthe', '#2f6b5f', '#bfe8d9'], ['Rose', '#8c4a5d', '#f6c7d3']],
    cover: '1757800946096-b3f14edd6809', rating: [4.9, 152],
    cats: [['Savons et bain', 'Soaps & bath'], ['Soins', 'Skin care'], ['Zéro déchet', 'Zero waste']],
    prods: [
      [['Savon artisanal', 'Handmade soap'], ['Saponifié à froid, 110 g', 'Cold-process, 4 oz'], '9', '', ['Meilleure vente', 'Best seller'], '1474625121024-7595bfbc57ac', 0, [['Lavande', 'Avoine et miel', 'Menthe poivrée'].join(', '), 'Lavender, Oat & honey, Peppermint'],
        ['Savon fabriqué à la main dans notre atelier, à base d’huiles végétales et d’huiles essentielles. Sans parfum de synthèse, sans huile de palme.', 'Made by hand in our workshop with plant oils and essential oils. No synthetic fragrance, no palm oil.']],
      [['Bombes de bain', 'Bath bombs'], ['Lot de 3, effervescentes', 'Set of 3, fizzy'], '15', '', '', '1690583368332-c1931e70e53e', 0, ''],
      [['Beurre corporel', 'Body butter'], ['Karité et cacao, 200 ml', 'Shea and cocoa, 6.8 oz'], '24', '', '', '1762840192336-575fba31d28c', 1, ''],
      [['Huile essentielle', 'Essential oil'], ['Biologique, 15 ml', 'Organic, 0.5 oz'], '16', '', '', '1671493235081-5842463637cd', 1, [['Lavande', 'Eucalyptus', 'Orange douce'].join(', '), 'Lavender, Eucalyptus, Sweet orange']],
      [['Sérum visage', 'Face serum'], ['Huile de rose musquée', 'Rosehip oil'], '38', '32', ['Solde', 'Sale'], '1713768704571-6aeb0d0e5105', 1, ''],
      [['Baume à lèvres', 'Lip balm'], ['Cire d’abeille, sans plastique', 'Beeswax, plastic-free'], '7', '', ['Nouveau', 'New'], '1768983283321-8da0a5bed822', 2, ''],
      [['Brosse à dents en bambou', 'Bamboo toothbrush'], ['Compostable', 'Compostable'], '5', '', '', '1676897288522-e8a081e71430', 2, ''],
    ],
    gallery: [['1546552768-9e3a94b38a59', 'Nos savons', 'Our soaps'], ['1636846528145-46195929433c', 'Couleurs naturelles', 'Natural colors'], ['1776651993626-7cc836bf03aa', 'Remplissage en vrac', 'Bulk refills'], ['1760621393386-3906922b0b78', 'Conseils', 'Advice']],
    reviews: [R('Hannah W.', ['Savon artisanal', 'Handmade soap'], ['Mes mains ne sont plus sèches depuis que j’utilise leurs savons.', 'My hands haven’t been dry since I switched to their soaps.']), R('Nicole J.', ['Sérum visage', 'Face serum'], ['Produits simples, efficaces, et on peut rapporter ses pots.', 'Simple, effective products, and you can bring your jars back.'])],
    fr: { role: 'Savonnerie et cosmétiques naturels', spec: 'Fabriqués à la main à Trois-Rivières · Vrac et zéro déchet', phone: '819 555-0172', wa: '+1 819 555-0172', email: 'bonjour@savonnerieboheme.ca', web: 'savonnerieboheme.ca',
      text: 'Tous nos produits sont fabriqués à la main dans notre atelier. Rapportez vos pots vides : 1 $ de rabais chacun.', zone: 'Trois-Rivières et Cap-de-la-Madeleine',
      about: 'La Savonnerie Bohème fabrique ses savons et ses soins à la main, avec des ingrédients simples et le plus possible d’ici.\nVous pouvez remplir vos contenants en boutique : moins d’emballage, même qualité.',
      addr: '1420, rue Notre-Dame Centre, Trois-Rivières (Québec) G9A 4X3', access: 'Centre-ville · Stationnement Badeaux',
      policies: [['Vrac', 'Apportez vos contenants propres : on les remplit au poids.'], ['Retour des pots', '1 $ de rabais par pot rapporté.'], ['Satisfaction', 'Produit non adapté à votre peau ? On l’échange sous 30 jours.']] },
    en: { role: 'Natural soap & skincare shop', spec: 'Handmade in Asheville · Bulk & zero waste', phone: '(828) 555-0172', wa: '+1 828 555-0172', email: 'hello@savonnerieboheme.com', web: 'savonnerieboheme.com',
      text: 'Everything is handmade in our workshop. Bring back your empty jars: $1 off each.', zone: 'Asheville and Buncombe County', rate: '7',
      about: 'Savonnerie Bohème makes its soaps and skincare by hand, with simple, locally sourced ingredients whenever possible.\nRefill your own containers in store: less packaging, same quality.',
      addr: '42 Haywood St, Asheville, NC 28801', access: 'Downtown · Wall Street parking garage',
      policies: [['Bulk refills', 'Bring clean containers: we fill them by weight.'], ['Jar returns', '$1 off for every jar you bring back.'], ['Satisfaction', 'Not right for your skin? Exchange it within 30 days.']] },
  }));

  /* ---------- Réparation de téléphones ---------- */
  TYPES.push(T({
    id: 'telephones', code: 'B10', name: 'Réparation de téléphones', icon: 'smartphone', ex: 'Réparation, accessoires, reconditionnés…', rec: 'd7',
    biz: 'Répar Express', handle: 'reparexpress', shopTitle: 'Réparations et boutique', cta: 'Voir les tarifs', fee: '10', freeFrom: '100',
    pal: [['Bleu tech', '#1e3a8a', '#38bdf8'], ['Noir', '#111111', '#22d3ee'], ['Vert', '#065f46', '#4ade80'], ['Violet', '#4c1d95', '#c084fc'], ['Orange', '#9a3412', '#fdba74'], ['Graphite', '#27272a', '#facc15']],
    cover: '1761207850745-d41a776ef897', rating: [4.7, 402],
    cats: [['Réparations', 'Repairs'], ['Reconditionnés', 'Refurbished'], ['Accessoires', 'Accessories']],
    prods: [
      [['Remplacement d’écran', 'Screen replacement'], ['En 1 h, garantie 6 mois', 'In 1 hour, 6-month warranty'], '149', '', ['Populaire', 'Popular'], '1746006084492-24a8fd02710a', 0, ['iPhone, Samsung Galaxy, Google Pixel', 'iPhone, Samsung Galaxy, Google Pixel'],
        ['Écran cassé ou tactile qui ne répond plus ? Nous le remplaçons en 1 heure environ, avec une pièce de qualité et une garantie de 6 mois. Le prix final dépend du modèle : nous vous le confirmons par texto.', 'Cracked screen or unresponsive touch? We replace it in about an hour with a quality part and a 6-month warranty. Final price depends on the model: we confirm it by text.']],
      [['Remplacement de batterie', 'Battery replacement'], ['En 30 minutes', 'In 30 minutes'], '79', '', '', '1550041473-d296a3a8a18a', 0, ['iPhone, Samsung Galaxy, Google Pixel', 'iPhone, Samsung Galaxy, Google Pixel']],
      [['iPhone reconditionné', 'Refurbished iPhone'], ['Testé, garanti 1 an', 'Tested, 1-year warranty'], '449', '399', ['Solde', 'Sale'], '1616410011236-7a42121dd981', 1, ['128 Go, 256 Go', '128 GB, 256 GB']],
      [['iPad reconditionné', 'Refurbished iPad'], ['Écran 10,2 po, garanti 1 an', '10.2" display, 1-year warranty'], '329', '', '', '1561154464-82e9adf32764', 1, ''],
      [['Étui de protection', 'Protective case'], ['Antichoc, transparent', 'Shockproof, clear'], '25', '', '', '1535157412991-2ef801c1748b', 2, ''],
      [['Écouteurs sans fil', 'Wireless earbuds'], ['Réduction de bruit', 'Noise cancelling'], '69', '', ['Nouveau', 'New'], '1572569511254-d8f925fe2cbb', 2, ''],
      [['Câble USB-C', 'USB-C cable'], ['Tressé, 2 m', 'Braided, 6 ft'], '19', '', '', '1619459072761-496c0812331b', 2, ''],
    ],
    gallery: [['1611396000732-f8c9a933424f', 'L’atelier', 'The workshop'], ['1639776738932-956082f0b704', 'Réparation en direct', 'Repairs while you wait'], ['1697545806245-9795b6056141', 'Conseils', 'Advice'], ['1550041473-d296a3a8a18a', 'Pièces de qualité', 'Quality parts']],
    reviews: [R('Justin P.', ['Remplacement d’écran', 'Screen replacement'], ['Écran changé pendant que je prenais un café. Rapide et pas cher.', 'Screen replaced while I grabbed a coffee. Fast and affordable.']), R('Amanda K.', ['iPhone reconditionné', 'Refurbished iPhone'], ['Mon iPhone reconditionné marche comme un neuf depuis un an.', 'My refurbished iPhone has worked like new for a year.'])],
    fr: { role: 'Réparation de téléphones et tablettes', spec: 'Écran en 1 h · Reconditionnés garantis 1 an', phone: '450 555-0108', wa: '+1 450 555-0108', email: 'info@reparexpress.ca', web: 'reparexpress.ca',
      text: 'Choisissez votre réparation et votre modèle, nous vous confirmons le prix exact et l’heure par texto.', zone: 'Longueuil, Brossard et Saint-Lambert',
      about: 'Répar Express répare téléphones et tablettes de toutes marques, la plupart du temps en moins d’une heure.\nNous vendons aussi des appareils reconditionnés, testés et garantis : bon pour votre budget et pour la planète.',
      addr: '1150, chemin de Chambly, Longueuil (Québec) J4J 3X6', access: 'Métro Longueuil puis bus 8 · Stationnement gratuit',
      hours: [['Lundi – Vendredi', '9 h – 19 h'], ['Samedi', '10 h – 17 h'], ['Dimanche', 'Fermé']], hoursNote: 'Réparations sans rendez-vous, en 1 h la plupart du temps',
      policies: [['Diagnostic gratuit', 'On vérifie votre appareil sans frais, même sans réparation.'], ['Garantie', '6 mois sur les réparations, 1 an sur les reconditionnés.'], ['Données', 'Vos données restent sur l’appareil : rien n’est effacé sans votre accord.']] },
    en: { role: 'Phone & tablet repair', spec: 'Screens in 1 hour · Refurbished with 1-year warranty', phone: '(305) 555-0108', wa: '+1 305 555-0108', email: 'info@reparexpress.com', web: 'reparexpress.com',
      text: 'Pick your repair and model, and we’ll text you the exact price and time.', zone: 'Miami (Midtown, Wynwood, Edgewater)', rate: '7',
      about: 'Répar Express fixes phones and tablets of every brand, usually in under an hour.\nWe also sell refurbished devices, tested and guaranteed: good for your budget and the planet.',
      addr: '2301 Biscayne Blvd, Miami, FL 33137', access: 'Metromover – School Board · Free parking',
      hours: [['Monday – Friday', '9 am – 7 pm'], ['Saturday', '10 am – 5 pm'], ['Sunday', 'Closed']], hoursNote: 'Walk-in repairs, usually done in 1 hour',
      policies: [['Free diagnosis', 'We check your device for free, even without a repair.'], ['Warranty', '6 months on repairs, 1 year on refurbished devices.'], ['Your data', 'Your data stays on your device: nothing is erased without your consent.']] },
  }));

  /* ---------- Supermarché et épicerie ---------- */
  TYPES.push(T({
    id: 'epicerie', code: 'B11', name: 'Supermarché et épicerie', icon: 'shopping-basket', ex: 'Épicerie fine, dépanneur, marché…', rec: 'd1',
    biz: 'Épicerie Le Marché', handle: 'epicerielemarche', shopTitle: 'Commandez votre épicerie', cta: 'Faire mon épicerie', fee: '6', freeFrom: '75', tax: 'none',
    pal: [['Vert marché', '#2f6b2f', '#f4c542'], ['Tomate', '#a3261b', '#fbbf24'], ['Bleu', '#1d4f7a', '#facc15'], ['Terre', '#6b4a2b', '#a3d977'], ['Olive', '#4d5b16', '#f2b05e'], ['Noir', '#1c1c1c', '#7ed957']],
    cover: '1604719312566-8912e9227c6a', rating: [4.6, 289],
    cats: [['Fruits et légumes', 'Produce'], ['Boulangerie', 'Bakery'], ['Fromagerie', 'Cheese'], ['Épicerie fine', 'Pantry'], ['Frais', 'Fresh']],
    prods: [
      [['Panier de légumes de saison', 'Seasonal veggie box'], ['Produits de fermes d’ici', 'From local farms'], '25', '', ['Coup de cœur', 'Favorite'], '1566385101042-1a0aa0c1268c', 0, [['Pour 2', 'Familial'].join(', '), 'For 2, Family size'],
        ['Chaque semaine, une sélection de légumes de saison cultivés par des fermes de la région. Le contenu change selon les récoltes.', 'Every week, a selection of seasonal vegetables grown by local farms. Contents change with the harvest.']],
      [['Panier de fruits', 'Fruit basket'], ['Assortiment de saison', 'Seasonal assortment'], '35', '', '', '1619566636858-adf3ef46400b', 0, ''],
      [['Pain au levain', 'Sourdough bread'], ['Cuit ce matin', 'Baked this morning'], '7.50', '', '', '1608198093002-ad4e005484ec', 1, ''],
      [['Fromages d’ici', 'Local cheeses'], ['Assortiment de 3 fromages', 'Selection of 3 cheeses'], '32', '', '', '1589881133595-a3c085cb731d', 2, ''],
      [['Huile d’olive extra vierge', 'Extra virgin olive oil'], ['Première pression, 500 ml', 'First cold press, 17 oz'], '24', '19', ['Solde', 'Sale'], '1474979266404-7eaacbcd87c5', 3, ''],
      [['Café en grains', 'Whole bean coffee'], ['Torréfié localement, 340 g', 'Locally roasted, 12 oz'], '18', '', '', '1524350876685-274059332603', 3, [['Grains', 'Moulu'].join(', '), 'Whole bean, Ground']],
      [['Œufs de poules en liberté', 'Free-range eggs'], ['La douzaine', 'One dozen'], '6.50', '', '', '1506976785307-8732e854ad03', 4, ''],
    ],
    gallery: [['1488459716781-31db52582fe9', 'Le marché', 'The market'], ['1609780447631-05b93e5a88ea', 'Fruits frais', 'Fresh fruit'], ['1568254183919-78a4f43a2877', 'La boulangerie', 'The bakery'], ['1681276145283-dc19e0ffb8d1', 'La devanture', 'Storefront']],
    reviews: [R('Lauren M.', ['Panier de légumes', 'Veggie box'], ['Commande par texto le matin, livrée le soir. Les légumes sont superbes.', 'Ordered by text in the morning, delivered by evening. Beautiful produce.']), R('Eric S.', ['Pain au levain', 'Sourdough bread'], ['Une vraie épicerie de quartier, avec le sourire en prime.', 'A real neighborhood grocer, with a smile on top.'])],
    fr: { role: 'Épicerie de quartier', spec: 'Produits frais et locaux · Livraison le jour même', phone: '418 555-0124', wa: '+1 418 555-0124', email: 'commandes@epicerielemarche.ca', web: 'epicerielemarche.ca',
      text: 'Commandez avant 14 h : livraison le jour même à Rimouski. Les prix incluent les taxes lorsqu’elles s’appliquent.', zone: 'Rimouski et Le Bic',
      about: 'L’Épicerie Le Marché travaille avec une trentaine de producteurs du Bas-Saint-Laurent.\nFruits, légumes, pain, fromages et épicerie fine : tout pour bien manger, à deux pas de chez vous.',
      addr: '145, rue Saint-Germain Est, Rimouski (Québec) G5L 1A9', access: 'Centre-ville · Stationnement gratuit derrière l’épicerie',
      hours: [['Lundi – Vendredi', '8 h – 21 h'], ['Samedi – Dimanche', '8 h – 19 h']], hoursNote: 'Livraison le jour même pour toute commande avant 14 h',
      policies: [['Livraison', '6 $ à Rimouski, gratuite dès 75 $. Le jour même avant 14 h.'], ['Fraîcheur', 'Un produit ne vous convient pas ? On le remplace ou on le rembourse.'], ['Remplacements', 'Si un produit manque, on vous propose une alternative par texto.']] },
    en: { role: 'Neighborhood grocery', spec: 'Fresh, local food · Same-day delivery', phone: '(612) 555-0124', wa: '+1 612 555-0124', email: 'orders@lemarchegrocery.com', web: 'lemarchegrocery.com',
      text: 'Order before 2 pm for same-day delivery in Minneapolis.', zone: 'South Minneapolis', rate: '0',
      about: 'Épicerie Le Marché works with about thirty local farms and producers.\nProduce, bread, cheese and pantry staples: everything to eat well, right around the corner.',
      addr: '2421 Lyndale Ave S, Minneapolis, MN 55405', access: 'Bus 4 · Free parking behind the store',
      hours: [['Monday – Friday', '8 am – 9 pm'], ['Saturday – Sunday', '8 am – 7 pm']], hoursNote: 'Same-day delivery on orders before 2 pm',
      policies: [['Delivery', '$6 in Minneapolis, free over $75. Same day before 2 pm.'], ['Freshness', 'Not happy with an item? We replace or refund it.'], ['Substitutions', 'If something’s out of stock, we text you an alternative.']] },
  }));

  /* ---------- Traiteur ---------- */
  TYPES.push(T({
    id: 'traiteur', code: 'B12', name: 'Traiteur', icon: 'chef-hat', ex: 'Plats préparés, buffets, boîtes repas…', rec: 'd3', food: true,
    biz: 'Traiteur Bonne Table', handle: 'bonnetable', shopTitle: 'Plats et buffets', cta: 'Commander', fee: '15', freeFrom: '150',
    pal: [['Bordeaux', '#6b1d2a', '#e9b872'], ['Olive', '#4d5b16', '#f2c14e'], ['Cuivre', '#8a4b2a', '#f6c48f'], ['Noir & or', '#1c1917', '#d4a72c'], ['Bleu', '#1f3b57', '#f2b880'], ['Vert', '#2f5d3a', '#f4d06f']],
    cover: '1555244162-803834f70033', rating: [4.9, 164],
    cats: [['Plats cuisinés', 'Prepared meals'], ['Boîtes repas', 'Meal boxes'], ['Buffets', 'Platters'], ['Desserts', 'Desserts']],
    prods: [
      [['Lasagne maison', 'Homemade lasagna'], ['Pour 2 personnes', 'Serves 2'], '18', '', ['Meilleure vente', 'Best seller'], '1709429790175-b02bb1b19207', 0, [['Viande', 'Végétarienne'].join(', '), 'Meat, Vegetarian'],
        ['Notre lasagne cuisinée comme à la maison : sauce mijotée 4 heures, béchamel et fromage gratiné. Prête à réchauffer, 30 minutes au four.', 'Our lasagna made the home-style way: sauce simmered for 4 hours, béchamel and melted cheese. Ready to reheat, 30 minutes in the oven.']],
      [['Quiche du jour', 'Quiche of the day'], ['Entière, 6 portions', 'Whole, 6 servings'], '24', '', '', '1701197159530-80a188e34dfc', 0, ''],
      [['Bol santé', 'Power bowl'], ['Légumes, quinoa, vinaigrette', 'Veggies, quinoa, dressing'], '15', '', '', '1512621776951-a57141f2eefd', 0, ''],
      [['Boîtes repas de la semaine', 'Weekly meal boxes'], ['5 repas équilibrés', '5 balanced meals'], '65', '', ['Nouveau', 'New'], '1543352632-5a4b24e4d2a6', 1, ''],
      [['Soupe du jour', 'Soup of the day'], ['1 litre', '1 quart'], '9', '', '', '1476718406336-bb5a9690ee2a', 1, ''],
      [['Planche charcuteries et fromages', 'Charcuterie & cheese board'], ['Pour 8 à 10 personnes', 'Serves 8 to 10'], '85', '', '', '1557109965-b9bf442aeb97', 2, ''],
      [['Plateau de sandwichs', 'Sandwich platter'], ['24 bouchées', '24 pieces'], '75', '', '', '1676300184084-de35d56a9a70', 2, ''],
      [['Plateau de desserts', 'Dessert platter'], ['20 mignardises', '20 mini desserts'], '45', '', '', '1672571732174-af060bc8601c', 3, ''],
    ],
    gallery: [['1689774504345-6cf299b0b312', 'Buffets', 'Buffets'], ['1667499745120-f9bcef8f584e', 'Plateaux', 'Platters'], ['1769812344068-9e4b7d8a3eb0', 'Pâtisseries', 'Pastries'], ['1583338917496-7ea264c374ce', 'Service', 'Service']],
    reviews: [R('Michelle T.', ['Buffet', 'Platters'], ['Buffet pour notre fête de bureau : tout le monde a adoré, et livré à l’heure.', 'Buffet for our office party: everyone loved it, delivered right on time.']), R('Andrew B.', ['Boîtes repas', 'Meal boxes'], ['Les boîtes repas me sauvent la semaine. Bon et varié.', 'The meal boxes save my week. Tasty and varied.'])],
    fr: { role: 'Traiteur et plats cuisinés', spec: 'Fait maison · Buffets pour événements et bureaux', phone: '418 555-0159', wa: '+1 418 555-0159', email: 'commandes@bonnetable.ca', web: 'bonnetable.ca',
      text: 'Plats à emporter ou livrés. Buffets : commandez 48 h à l’avance et précisez la date dans la note.', zone: 'Lévis et Québec',
      about: 'Traiteur Bonne Table cuisine chaque jour des plats maison avec des produits du marché.\nRepas de la semaine, buffets de bureau ou réceptions : nous nous occupons de tout, de la cuisine à la livraison.',
      addr: '5880, rue Saint-Laurent, Lévis (Québec) G6V 3V6', access: 'Stationnement gratuit devant le comptoir',
      hours: [['Mardi – Vendredi', '10 h – 19 h'], ['Samedi', '10 h – 16 h'], ['Dimanche – Lundi', 'Fermé (événements sur réservation)']], hoursNote: 'Buffets : commande 48 h à l’avance',
      policies: [['Buffets', 'Commande au moins 48 h à l’avance, minimum 10 personnes.'], ['Allergies', 'Indiquez vos allergies dans la note : nous adaptons les plats.'], ['Livraison', '15 $ à Lévis et Québec, gratuite dès 150 $.']] },
    en: { role: 'Caterer & prepared meals', spec: 'Homemade · Buffets for events and offices', phone: '(215) 555-0159', wa: '+1 215 555-0159', email: 'orders@bonnetable.com', web: 'bonnetable.com',
      text: 'Takeout or delivery. Platters: order 48 hours ahead and add the date in the note.', zone: 'Philadelphia (Center City, South Philly)', rate: '8',
      about: 'Traiteur Bonne Table cooks homemade dishes every day with fresh market ingredients.\nWeekly meals, office lunches or receptions: we handle everything, from the kitchen to your door.',
      addr: '1622 South St, Philadelphia, PA 19146', access: 'Bus 40 · Street parking',
      hours: [['Tuesday – Friday', '10 am – 7 pm'], ['Saturday', '10 am – 4 pm'], ['Sunday – Monday', 'Closed (events by reservation)']], hoursNote: 'Platters: order 48 hours ahead',
      policies: [['Platters', 'Order at least 48 hours ahead, 10 people minimum.'], ['Allergies', 'Note any allergies: we’ll adapt the dishes.'], ['Delivery', '$15 in Philadelphia, free over $150.']] },
  }));

  /* ---------- Animalerie ---------- */
  TYPES.push(T({
    id: 'animalerie', code: 'B13', name: 'Animalerie', icon: 'paw-print', ex: 'Nourriture, accessoires, toilettage…', rec: 'd9',
    biz: 'Patte & Moustache', handle: 'patteetmoustache', shopTitle: 'Pour vos compagnons', cta: 'Voir la boutique', fee: '8', freeFrom: '80',
    pal: [['Turquoise', '#0f5e63', '#ffd166'], ['Orange', '#b45309', '#fde68a'], ['Bleu', '#1e40af', '#fca5a5'], ['Vert', '#166534', '#fcd34d'], ['Prune', '#6b2152', '#f9a8d4'], ['Brun', '#5b3a29', '#f6c177']],
    cover: '1788487638307-00c3fb38bf51', rating: [4.8, 246],
    cats: [['Chiens', 'Dogs'], ['Chats', 'Cats'], ['Poissons et oiseaux', 'Fish & birds'], ['Toilettage', 'Grooming']],
    prods: [
      [['Nourriture pour chien', 'Dog food'], ['Sans grains, saumon', 'Grain-free, salmon'], '64', '', ['Meilleure vente', 'Best seller'], '1714068691210-073dc52c6c1d', 0, ['5 kg, 12 kg', '11 lb, 26 lb'],
        ['Croquettes sans grains au saumon, pour chiens adultes de toutes races. Livrées chez vous, ou mises de côté pour le ramassage.', 'Grain-free salmon kibble for adult dogs of all breeds. Delivered to your door, or set aside for pickup.']],
      [['Laisse en nylon', 'Nylon leash'], ['1,8 m, poignée rembourrée', '6 ft, padded handle'], '28', '', '', '1708062270853-ee7c66b69f07', 0, ''],
      [['Lit pour chien', 'Dog bed'], ['Housse lavable', 'Washable cover'], '79', '65', ['Solde', 'Sale'], '1581888227599-779811939961', 0, 'S, M, L'],
      [['Arbre à chat', 'Cat tree'], ['Griffoir en sisal', 'Sisal scratching post'], '49', '', '', '1759165440303-40ef25cc6053', 1, ''],
      [['Poissons d’aquarium', 'Aquarium fish'], ['Poisson rouge, par unité', 'Goldfish, each'], '6', '', '', '1522069169874-c58ec4b76be5', 2, ''],
      [['Cage à oiseaux', 'Bird cage'], ['Acier, avec perchoirs', 'Steel, with perches'], '89', '', '', '1592487547379-5cfadfada28d', 2, ''],
      [['Toilettage complet', 'Full grooming'], ['Bain, coupe, griffes', 'Bath, haircut, nails'], '65', '', ['Sur rendez-vous', 'By appointment'], '1561037404-61cd46aa615b', 3, [['Petit chien', 'Moyen', 'Grand'].join(', '), 'Small dog, Medium, Large']],
    ],
    gallery: [['1548199973-03cce0bbc87b', 'Nos clients', 'Our customers'], ['1415369629372-26f2fe60c467', 'Coin des chats', 'Cat corner'], ['1789875688162-82e0231c3023', 'La mascotte', 'Our mascot'], ['1561037404-61cd46aa615b', 'Toilettage', 'Grooming']],
    reviews: [R('Kayla R.', ['Toilettage', 'Grooming'], ['Mon chien ressort toujours magnifique et détendu. Équipe adorable.', 'My dog always comes back gorgeous and relaxed. Lovely team.']), R('Matthew H.', ['Nourriture pour chien', 'Dog food'], ['Je commande ses croquettes par texto, livrées le lendemain.', 'I order his food by text, delivered the next day.'])],
    fr: { role: 'Animalerie et toilettage', spec: 'Nourriture, accessoires et toilettage · Conseils gratuits', phone: '819 555-0137', wa: '+1 819 555-0137', email: 'bonjour@patteetmoustache.ca', web: 'patteetmoustache.ca',
      text: 'Commandez la nourriture de votre animal par texto : livraison le lendemain ou mise de côté en boutique.', zone: 'Drummondville et environs',
      about: 'Patte & Moustache, c’est une animalerie de quartier où l’on prend le temps de vous conseiller.\nNourriture de qualité, accessoires et salon de toilettage : tout pour le bien-être de votre compagnon.',
      addr: '455, boulevard Saint-Joseph, Drummondville (Québec) J2C 2B6', access: 'Grand stationnement gratuit · Animaux bienvenus en boutique',
      policies: [['Livraison', '8 $ à Drummondville, gratuite dès 80 $, le lendemain.'], ['Toilettage', 'Sur rendez-vous : précisez le jour souhaité dans votre commande.'], ['Échanges', 'Sac de nourriture non ouvert échangé sous 30 jours.']] },
    en: { role: 'Pet store & grooming', spec: 'Food, supplies and grooming · Free advice', phone: '(602) 555-0137', wa: '+1 602 555-0137', email: 'hello@patteetmoustache.com', web: 'patteetmoustache.com',
      text: 'Order your pet’s food by text: next-day delivery or set aside in store.', zone: 'Central Phoenix', rate: '8.6',
      about: 'Patte & Moustache is a neighborhood pet store where we take the time to help you.\nQuality food, supplies and a grooming salon: everything for your companion’s well-being.',
      addr: '4801 N 7th St, Phoenix, AZ 85014', access: 'Free parking · Pets welcome in store',
      policies: [['Delivery', '$8 in Phoenix, free over $80, next day.'], ['Grooming', 'By appointment: add your preferred day to your order.'], ['Exchanges', 'Unopened food bags exchanged within 30 days.']] },
  }));

  /* ---------- Restaurant (pour emporter) ---------- */
  TYPES.push(T({
    id: 'resto', code: 'B14', name: 'Restaurant (pour emporter)', icon: 'utensils-crossed', ex: 'Commandes à emporter et livraison…', rec: 'd3', food: true, dinein: true,
    biz: 'Casse-croûte du Coin', handle: 'cassecrouteducoin', shopTitle: 'Notre menu', cta: 'Commander', fee: '5', freeFrom: '40',
    pal: [['Ketchup', '#b91c1c', '#facc15'], ['Diner', '#1e3a8a', '#f87171'], ['Noir', '#111111', '#f59e0b'], ['Vert', '#14532d', '#fbbf24'], ['Orange', '#c2410c', '#fde047'], ['Brun', '#4a2c1d', '#f4a259']],
    cover: '1652862729869-2f4e80c1849d', rating: [4.6, 512],
    cats: [['Poutines et burgers', 'Burgers & fries'], ['Pizzas', 'Pizzas'], ['Plats', 'Mains'], ['Desserts et boissons', 'Desserts & drinks']],
    prods: [
      [['Poutine classique', 'Classic poutine'], ['Frites, fromage en grains, sauce brune', 'Fries, cheese curds, gravy'], '12.50', '', ['Meilleure vente', 'Best seller'], '1684815495679-f6e6bc0634ec', 0, [['Régulière', 'Grande'].join(', '), 'Regular, Large'],
        ['Frites coupées chaque matin, fromage en grains frais du jour et notre sauce brune maison. Le vrai classique.', 'Fries cut fresh every morning, fresh cheese curds and our homemade gravy. The real classic.']],
      [['Burger maison', 'House burger'], ['Bœuf 6 oz, cheddar, sauce maison', '6 oz beef, cheddar, house sauce'], '16', '', '', '1568901346375-23c9450c58cd', 0, ''],
      [['Trio burger frites', 'Burger & fries combo'], ['Avec boisson', 'With a drink'], '19', '17', ['Spécial du midi', 'Lunch special'], '1561758033-d89a9ad46330', 0, ''],
      [['Pizza pepperoni', 'Pepperoni pizza'], ['12 pouces, pâte maison', '12-inch, homemade dough'], '22', '', '', '1534308983496-4fabb1a015ee', 1, ''],
      [['Tacos au bœuf', 'Beef tacos'], ['3 tacos, salsa maison', '3 tacos, house salsa'], '14', '', ['Nouveau', 'New'], '1599974579688-8dbdd335c77f', 2, ''],
      [['Poulet frit', 'Fried chicken'], ['5 morceaux, salade de chou', '5 pieces, coleslaw'], '17', '', '', '1569058242253-92a9c755a0ec', 2, ''],
      [['Milkshake', 'Milkshake'], ['Fait avec de la vraie crème glacée', 'Made with real ice cream'], '7', '', '', '1572490122747-3968b75cc699', 3, [['Chocolat', 'Vanille', 'Fraise'].join(', '), 'Chocolate, Vanilla, Strawberry']],
    ],
    gallery: [['1652862730784-bb2a6e862514', 'La salle', 'Dining room'], ['1648587456176-4969b0124b12', 'Pour emporter', 'To go'], ['1577715694662-6bcf16c06e29', 'Frites maison', 'Homemade fries'], ['1561758033-d89a9ad46330', 'Nos burgers', 'Our burgers']],
    reviews: [R('Tyler G.', ['Poutine classique', 'Classic poutine'], ['La meilleure poutine du Saguenay, et prête en 15 minutes.', 'The best poutine in town, ready in 15 minutes.']), R('Samantha D.', ['Trio burger frites', 'Burger combo'], ['Commande par texto, ramassée en passant. Toujours chaud !', 'Ordered by text, picked up on the way. Always hot!'])],
    fr: { role: 'Casse-croûte et mets pour emporter', spec: 'Sur place, à emporter ou livré · Prêt en 15 minutes', phone: '418 555-0193', wa: '+1 418 555-0193', email: 'commandes@cassecroute.ca', web: 'cassecroute.ca',
      text: 'Commandez ici : sur place, à emporter (prêt en 15 minutes) ou livré chez vous.', zone: 'Chicoutimi et Jonquière',
      about: 'Le Casse-croûte du Coin sert poutines, burgers et pizzas maison depuis 1994.\nFrites coupées chaque matin, sauces faites sur place : la recette n’a pas changé.',
      addr: '2345, rue Racine Est, Saguenay (Québec) G7H 1S3', access: 'Stationnement gratuit · Terrasse l’été',
      hours: [['Lundi – Jeudi', '11 h – 21 h'], ['Vendredi – Samedi', '11 h – 23 h'], ['Dimanche', '11 h – 21 h']], hoursNote: 'Commandes pour emporter prêtes en 15 minutes',
      policies: [['Délai', 'À emporter : prêt en 15 minutes. Livraison : 30 à 45 minutes.'], ['Livraison', '5 $, gratuite dès 40 $ à Chicoutimi et Jonquière.'], ['Allergies', 'Indiquez vos allergies dans la note de commande.']] },
    en: { role: 'Diner & takeout', spec: 'Dine in, takeout or delivery · Ready in 15 minutes', phone: '(615) 555-0193', wa: '+1 615 555-0193', email: 'orders@cornerdiner.com', web: 'cornerdiner.com',
      text: 'Order here: dine in, takeout (ready in 15 minutes) or delivered to your door.', zone: 'Nashville (Midtown, The Gulch)', rate: '9.25',
      about: 'Casse-croûte du Coin has been serving homemade burgers, pizzas and poutine since 1994.\nFries cut every morning, sauces made in house: the recipe hasn’t changed.',
      addr: '1010 Division St, Nashville, TN 37203', access: 'Free parking · Patio in summer',
      hours: [['Monday – Thursday', '11 am – 9 pm'], ['Friday – Saturday', '11 am – 11 pm'], ['Sunday', '11 am – 9 pm']], hoursNote: 'Takeout orders ready in 15 minutes',
      policies: [['Timing', 'Takeout: ready in 15 minutes. Delivery: 30 to 45 minutes.'], ['Delivery', '$5, free over $40 in Midtown and The Gulch.'], ['Allergies', 'Add any allergies to your order note.']] },
  }));

  /* ---------- Coiffure (produits) ---------- */
  TYPES.push(T({
    id: 'coiffure', code: 'B15', name: 'Coiffure (produits)', icon: 'scissors', ex: 'Shampoings, soins, coiffants…', rec: 'd4',
    biz: 'Studio Mèche', handle: 'studiomeche', shopTitle: 'Produits du salon', cta: 'Voir les produits', fee: '8', freeFrom: '75',
    pal: [['Noir & rose', '#1a1a1a', '#f4a6b8'], ['Champagne', '#5c4a3a', '#e9cfa7'], ['Bordeaux', '#5e1b2d', '#f0b7c4'], ['Vert sauge', '#3f5a4a', '#e7d3b0'], ['Bleu nuit', '#1e2a44', '#c9b6f2'], ['Terracotta', '#8f3f2b', '#f5c6a5']],
    cover: '1634449571010-02389ed0f9b0', rating: [4.9, 208],
    cats: [['Shampoings', 'Shampoos'], ['Soins', 'Treatments'], ['Coiffants', 'Styling'], ['Appareils et accessoires', 'Tools & accessories']],
    prods: [
      [['Shampoing professionnel', 'Professional shampoo'], ['Sans sulfate, 300 ml', 'Sulfate-free, 10 oz'], '28', '', ['Recommandé par nos coiffeurs', 'Stylist pick'], '1701992678972-d5a053ad0fb0', 0, [['Cheveux secs', 'Cheveux colorés', 'Cuir chevelu sensible'].join(', '), 'Dry hair, Color-treated, Sensitive scalp'],
        ['Le shampoing que nous utilisons au salon. Nettoie en douceur, sans sulfate, et respecte la couleur. Demandez-nous lequel convient à vos cheveux.', 'The shampoo we use in the salon. Gentle, sulfate-free and color-safe. Ask us which one suits your hair.']],
      [['Revitalisant', 'Conditioner'], ['Démêlant, 300 ml', 'Detangling, 10 oz'], '30', '', '', '1602143407151-7111542de6e8', 1, ''],
      [['Masque capillaire', 'Hair mask'], ['Réparation intense', 'Deep repair'], '36', '', '', '1732861612244-5704d12e9397', 1, ''],
      [['Huile capillaire', 'Hair oil'], ['Argan, brillance', 'Argan, shine'], '32', '26', ['Solde', 'Sale'], '1515377905703-c4788e51af15', 1, ''],
      [['Fixatif souple', 'Flexible hairspray'], ['Tenue légère', 'Light hold'], '24', '', '', '1556229165-8aa0ceaa93a7', 2, ''],
      [['Séchoir professionnel', 'Professional hair dryer'], ['Ionique, 2000 W', 'Ionic, 2000 W'], '159', '', ['Nouveau', 'New'], '1727364438136-6edc10ef0a52', 3, ''],
      [['Brosse démêlante', 'Detangling brush'], ['Poils souples', 'Soft bristles'], '22', '', '', '1595475884562-073c30d45670', 3, ''],
    ],
    gallery: [['1580618672591-eb180b1a973f', 'Le salon', 'The salon'], ['1695527081782-33e110235ade', 'Nos produits', 'Our products'], ['1610595426075-eed5a3f521ee', 'Coiffants', 'Styling'], ['1626379501846-0df4067b8bb9', 'Accueil', 'Welcome']],
    reviews: [R('Brittany S.', ['Shampoing professionnel', 'Professional shampoo'], ['Enfin le shampoing du salon à la maison, ma couleur tient beaucoup mieux.', 'Finally the salon shampoo at home, my color lasts so much longer.']), R('Olivia R.', ['Masque capillaire', 'Hair mask'], ['Commandé par texto, prêt à ma prochaine coupe. Pratique !', 'Ordered by text, ready at my next appointment. So handy!'])],
    fr: { role: 'Salon de coiffure', spec: 'Produits professionnels recommandés par nos coiffeurs', phone: '450 555-0145', wa: '+1 450 555-0145', email: 'bonjour@studiomeche.ca', web: 'studiomeche.ca',
      text: 'Les produits que nous utilisons au salon, à ramasser à votre prochain rendez-vous ou livrés chez vous.', zone: 'Saint-Jérôme et Laurentides',
      about: 'Au Studio Mèche, nous choisissons des produits professionnels que nous utilisons chaque jour au salon.\nPas sûre de ce qui convient à vos cheveux ? Écrivez-nous, on vous conseille.',
      addr: '210, rue De Martigny Ouest, Saint-Jérôme (Québec) J7Y 2G1', access: 'Stationnement gratuit · Gare de Saint-Jérôme à 5 min',
      policies: [['Ramassage', 'Gratuit au salon, ou à votre prochain rendez-vous.'], ['Conseil', 'Diagnostic de vos cheveux offert, en salon ou par texto.'], ['Échanges', 'Produit non ouvert échangé sous 30 jours.']] },
    en: { role: 'Hair salon', spec: 'Professional products picked by our stylists', phone: '(619) 555-0145', wa: '+1 619 555-0145', email: 'hello@studiomeche.com', web: 'studiomeche.com',
      text: 'The products we use in the salon: pick them up at your next appointment or get them delivered.', zone: 'San Diego (North Park, Hillcrest)', rate: '7.75',
      about: 'At Studio Mèche, we pick professional products we use every day in the salon.\nNot sure what suits your hair? Text us, we’ll help.',
      addr: '3812 Park Blvd, San Diego, CA 92103', access: 'Free parking behind the salon',
      policies: [['Pickup', 'Free at the salon, or at your next appointment.'], ['Advice', 'Free hair consultation, in salon or by text.'], ['Exchanges', 'Unopened products exchanged within 30 days.']] },
  }));

  /* ---------- Esthétique (produits de soin) ---------- */
  TYPES.push(T({
    id: 'esthetique', code: 'B16', name: 'Esthétique (produits de soin)', icon: 'sparkles', ex: 'Crèmes, sérums, maquillage…', rec: 'd10',
    biz: 'Institut Éclat', handle: 'instituteclat', shopTitle: 'Nos produits de soin', cta: 'Voir les soins', fee: '8', freeFrom: '75',
    pal: [['Nude', '#6d4c41', '#f3c9b5'], ['Rose poudré', '#8c4a5d', '#f8c8d4'], ['Blanc & or', '#3d3326', '#d4b06a'], ['Lilas', '#5b4a7a', '#e2d4f7'], ['Vert thé', '#3e5a48', '#d9e8c9'], ['Noir', '#141414', '#e8c4a0']],
    cover: '1736167442640-1988e440297c', rating: [4.9, 176],
    cats: [['Visage', 'Face'], ['Protection solaire', 'Sun care'], ['Maquillage', 'Makeup'], ['Bons cadeaux', 'Gift cards']],
    prods: [
      [['Crème hydratante', 'Moisturizing cream'], ['Acide hyaluronique, 50 ml', 'Hyaluronic acid, 1.7 oz'], '48', '', ['Meilleure vente', 'Best seller'], '1763503839418-2b45c3d7a3c3', 0, [['Peau sèche', 'Peau mixte', 'Peau sensible'].join(', '), 'Dry skin, Combination skin, Sensitive skin'],
        ['Notre crème la plus demandée : hydrate 24 h sans laisser de film gras. Choisissez la formule adaptée à votre peau, ou demandez conseil à nos esthéticiennes.', 'Our most requested cream: 24-hour hydration with no greasy film. Pick the formula for your skin type, or ask our estheticians.']],
      [['Sérum vitamine C', 'Vitamin C serum'], ['Éclat et teint uniforme', 'Radiance and even tone'], '62', '', '', '1710410815589-dd83514104d0', 0, ''],
      [['Masque purifiant', 'Purifying mask'], ['Argile, 75 ml', 'Clay, 2.5 oz'], '34', '28', ['Solde', 'Sale'], '1552046122-03184de85e08', 0, ''],
      [['Écran solaire FPS 50', 'SPF 50 sunscreen'], ['Fini invisible', 'Invisible finish'], '32', '', ['Nouveau', 'New'], '1594055103006-7871176f1a7e', 1, ''],
      [['Palette de maquillage', 'Makeup palette'], ['12 teintes', '12 shades'], '45', '', '', '1512496015851-a90fb38ba796', 2, ''],
      [['Pinceaux de maquillage', 'Makeup brushes'], ['Ensemble de 8', 'Set of 8'], '39', '', '', '1596462502278-27bfdc403348', 2, ''],
      [['Bon cadeau soin du visage', 'Facial gift card'], ['Soin de 60 minutes', '60-minute facial'], '95', '', '', '1643684391140-c5056cfd3436', 3, ''],
    ],
    gallery: [['1757800945999-ed0fa905d0f5', 'Nos marques', 'Our brands'], ['1570172619644-dfd03ed5d881', 'Soins en cabine', 'Treatments'], ['1748543668676-ea8241cb3886', 'Routines', 'Routines'], ['1600428853876-fb5a850b444f', 'Essentiels', 'Essentials']],
    reviews: [R('Victoria L.', ['Crème hydratante', 'Moisturizing cream'], ['On m’a conseillé la bonne crème pour ma peau sensible. Plus aucune rougeur.', 'They recommended the right cream for my sensitive skin. No more redness.']), R('Rebecca F.', ['Bon cadeau', 'Gift card'], ['Bon cadeau offert à ma mère, elle a adoré son soin.', 'Gave my mom a gift card, she loved her facial.'])],
    fr: { role: 'Institut d’esthétique', spec: 'Soins du visage et produits professionnels', phone: '450 555-0161', wa: '+1 450 555-0161', email: 'bonjour@instituteclat.ca', web: 'instituteclat.ca',
      text: 'Les produits utilisés en cabine par nos esthéticiennes. Diagnostic de peau offert sur demande.', zone: 'Brossard, Longueuil et La Prairie',
      about: 'L’Institut Éclat propose des soins du visage et des produits professionnels choisis pour leur efficacité.\nNos esthéticiennes vous aident à composer une routine simple, adaptée à votre peau.',
      addr: '7250, boulevard Taschereau, Brossard (Québec) J4W 1M9', access: 'Grand stationnement gratuit · REM Panama à 5 min',
      policies: [['Diagnostic de peau', 'Offert à l’achat de votre premier produit.'], ['Bons cadeaux', 'Valables 1 an, envoyés par courriel ou remis en boutique.'], ['Échanges', 'Produit non ouvert échangé sous 30 jours.']] },
    en: { role: 'Esthetics studio', spec: 'Facials and professional skincare', phone: '(404) 555-0161', wa: '+1 404 555-0161', email: 'hello@institut-eclat.com', web: 'institut-eclat.com',
      text: 'The products our estheticians use in treatments. Free skin consultation on request.', zone: 'Atlanta (West Midtown, Buckhead)', rate: '8.9',
      about: 'Institut Éclat offers facials and professional skincare chosen for results.\nOur estheticians help you build a simple routine that fits your skin.',
      addr: '1050 Howell Mill Rd, Atlanta, GA 30318', access: 'Free parking · West Midtown',
      policies: [['Skin consultation', 'Free with your first product purchase.'], ['Gift cards', 'Valid for 1 year, sent by email or picked up in store.'], ['Exchanges', 'Unopened products exchanged within 30 days.']] },
  }));

  TYPES.forEach((t) => {
    const i = NFC.SECTORS.findIndex((s) => s.id === t.id);
    if (i >= 0) NFC.SECTORS[i] = t; else NFC.SECTORS.push(t);
  });

  /* Titres de sections en anglais (carte) */
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), {
    'Idées cadeaux': 'Gift ideas', 'Voir les idées cadeaux': 'Browse gift ideas', 'Vélos, location et atelier': 'Bikes, rentals & repairs', 'Voir les vélos': 'Shop bikes',
    'Nos soins naturels': 'Our natural care', 'Voir les soins': 'Shop skincare', 'Réparations et boutique': 'Repairs & shop', 'Voir les tarifs': 'See prices',
    'Commandez votre épicerie': 'Order your groceries', 'Faire mon épicerie': 'Shop groceries', 'Plats et buffets': 'Meals & platters', 'Commander': 'Order now',
    'Pour vos compagnons': 'For your pets', 'Notre menu': 'Our menu', 'Produits du salon': 'Salon products', 'Voir les produits': 'Shop products', 'Nos produits de soin': 'Our skincare',
  });
})();
