/* NFC Card Studio – Stores : les 16 types de boutique. Remplace la liste des secteurs du studio.
   Étape 1 : seul « Mode » est rempli ; les autres types arrivent ensuite.
   Photos : Unsplash (licence gratuite), affichées depuis images.unsplash.com. */
(function () {
  'use strict';

  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const B = (key, type, title, extra) => Object.assign({ key, type, title }, extra || {});
  /* Photo Unsplash, recadrée à la bonne taille */
  const U = (id, w = 640) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
  const hours = (rows, note = '') => ({ on: true, rows: rows.map(([d, h]) => ({ d, h })), note });

  /* ---------- Mode et vêtements ---------- */
  const MODE_IMG = {
    cover: U('1441984904996-e0b6ba687e04', 1200),
    robe: U('1747396206869-75ea57b325ce'), trench: U('1592327877233-90b9bfd92e48'), pull: U('1631541909061-71e349d1f203'),
    veste: U('1611312449408-fcece27cdbb7'), tshirt: U('1581655353564-df123a1eb820'), jean: U('1721637286605-ae9be19d681f'),
    sac: U('1598532163257-ae3c6b2524b6'), baskets: U('1600269452121-4f2416e55c28'), echarpe: U('1609803384069-19f3e5a70e75'),
    g1: U('1540221652346-e5dd6b50f3e7'), g2: U('1489987707025-afc232f7ea0f'), g3: U('1603400521630-9f2de124b33b'), g4: U('1555529771-835f59fc5efe'),
  };
  const I = MODE_IMG;
  /* Produit : nom, description courte, description longue, prix, prix soldé, badge, photo, catégorie, options */
  const P = (t, d, l, p, sp, b, img, cat, o) => ({ t, d, l, p, sp, b, img, cat, o, on: true });

  const shopFr = {
    on: true, label: '', text: 'Pièces choisies avec soin, fabriquées au Canada quand c’est possible. Commandez ici, payez au ramassage ou à la livraison.',
    cats: 'Femme, Homme, Accessoires',
    items: [
      P('Robe en lin', 'Lin lavé, coupe ample', 'Robe midi en lin lavé, douce dès le premier jour. Poches côté, boutons en bois. Lavable en machine à 30 °C.', '89', '', 'Nouveau', I.robe, 'Femme', 'XS, S, M, L, XL'),
      P('Trench classique', 'Coton déperlant, ceinture', 'Le trench intemporel en gabardine de coton déperlant, avec ceinture et col à revers. Doublure légère.', '189', '149', 'Solde', I.trench, 'Femme', 'S, M, L'),
      P('Pull en tricot', 'Laine mérinos', 'Pull col rond en laine mérinos, chaud sans être épais. Fabriqué à Montréal.', '75', '', '', I.pull, 'Femme', 'S, M, L'),
      P('Veste en jean', 'Denim brut, coupe droite', 'Veste en denim 100 % coton, coupe droite, boutons métal. Se patine joliment avec le temps.', '98', '', '', I.veste, 'Homme', 'S, M, L, XL'),
      P('T-shirt coton bio', 'Coton biologique, col rond', 'Le basique parfait : coton biologique épais, coupe régulière, ne se déforme pas au lavage.', '32', '', 'Meilleure vente', I.tshirt, 'Homme', 'S, M, L, XL'),
      P('Jean droit', 'Denim stretch confort', 'Jean coupe droite en denim légèrement extensible, taille normale. Ourlet gratuit en boutique.', '110', '', '', I.jean, 'Homme', '28, 30, 32, 34, 36'),
      P('Sac en cuir', 'Cuir pleine fleur', 'Sac bandoulière en cuir pleine fleur, tannage végétal. Bandoulière réglable, poche intérieure zippée.', '145', '', '', I.sac, 'Accessoires', ''),
      P('Baskets blanches', 'Cuir, semelle naturelle', 'Baskets minimalistes en cuir blanc, semelle en caoutchouc naturel. Confortables toute la journée.', '120', '', '', I.baskets, 'Accessoires', '6, 7, 8, 9, 10, 11'),
      P('Écharpe en laine', 'Laine tissée, motif écossais', 'Grande écharpe en laine tissée, motif écossais, franges courtes. Idéale pour l’hiver québécois.', '45', '', '', I.echarpe, 'Accessoires', ''),
    ],
    order: 'sms', phone: '', wa: '', email: '', payUrl: '',
    pickup: true, delivery: true, fee: '10', freeFrom: '150', zone: 'Montréal et Laval', tax: 'qc', rate: '',
  };
  const shopEn = Object.assign({}, shopFr, {
    text: 'Carefully chosen pieces, made in Canada whenever possible. Order here, pay at pickup or on delivery.',
    cats: 'Women, Men, Accessories',
    items: [
      P('Linen dress', 'Washed linen, relaxed fit', 'Midi dress in washed linen, soft from day one. Side pockets, wooden buttons. Machine washable at 30 °C.', '89', '', 'New', I.robe, 'Women', 'XS, S, M, L, XL'),
      P('Classic trench coat', 'Water-repellent cotton, belted', 'The timeless trench in water-repellent cotton gabardine, with belt and lapel collar. Light lining.', '189', '149', 'Sale', I.trench, 'Women', 'S, M, L'),
      P('Knit sweater', 'Merino wool', 'Crew-neck sweater in merino wool, warm without the bulk. Made in Montreal.', '75', '', '', I.pull, 'Women', 'S, M, L'),
      P('Denim jacket', 'Raw denim, straight fit', '100% cotton denim jacket, straight fit, metal buttons. Ages beautifully over time.', '98', '', '', I.veste, 'Men', 'S, M, L, XL'),
      P('Organic cotton tee', 'Organic cotton, crew neck', 'The perfect basic: heavyweight organic cotton, regular fit, keeps its shape wash after wash.', '32', '', 'Best seller', I.tshirt, 'Men', 'S, M, L, XL'),
      P('Straight jeans', 'Comfort stretch denim', 'Straight-leg jeans in slightly stretchy denim, mid rise. Free hemming in store.', '110', '', '', I.jean, 'Men', '28, 30, 32, 34, 36'),
      P('Leather bag', 'Full-grain leather', 'Full-grain, vegetable-tanned leather crossbody bag. Adjustable strap, zipped inner pocket.', '145', '', '', I.sac, 'Accessories', ''),
      P('White sneakers', 'Leather, natural sole', 'Minimalist white leather sneakers with a natural rubber sole. Comfortable all day long.', '120', '', '', I.baskets, 'Accessories', '6, 7, 8, 9, 10, 11'),
      P('Wool scarf', 'Woven wool, plaid', 'Large woven wool scarf in a plaid pattern, short fringe. Made for real winters.', '45', '', '', I.echarpe, 'Accessories', ''),
    ],
    zone: 'Portland metro area', tax: 'us', rate: '0',
  });

  const mode = {
    id: 'mode', code: 'B01', name: 'Mode et vêtements', icon: 'shirt', active: true, rec: 'd3', establishment: true,
    ex: 'Boutique de vêtements, prêt-à-porter, chaussures…',
    palettes: [pal('Sable', '#3f3a34', '#c8a27a'), pal('Noir chic', '#18181b', '#d4a373'), pal('Rose poudré', '#9d4b5f', '#e8b4bc'), pal('Vert sauge', '#3f5a4a', '#b9c9a6'), pal('Bleu denim', '#1f3b5c', '#8fb3d9'), pal('Terracotta', '#a0472a', '#f0c27b')],
    blocks: [
      B('shop', 'shop', 'La boutique', { cta: 'Voir la boutique', help: 'Vos produits, catégories, prix et la façon de commander' }),
      B('about', 'text', 'Notre histoire', { help: '50 à 120 mots conseillés' }),
      B('gallery', 'gallery', 'En boutique', { help: '4 à 6 photos de votre magasin' }),
      B('hours', 'hours', 'Heures d’ouverture'),
      B('location', 'location', 'Nous trouver'),
      B('google', 'greviews', 'Avis Google', { help: 'Votre note Google et un bouton pour laisser un avis' }),
      B('reviews', 'reviews', 'Ce que disent nos clients'),
      B('policies', 'list', 'Livraison, échanges et retours', { help: 'Vos conditions, en quelques lignes' }),
    ],
    demo: {
      primary: 'shop',
      identity: { name: 'Maison Lumen', role: 'Boutique de mode', specialty: 'Vêtements et accessoires · Plateau-Mont-Royal', company: '', photo: 'ph:logo', logo: '', cover: I.cover },
      contact: { phone: '514 555-0142', whatsapp: '+1 514 555-0142', email: 'bonjour@maisonlumen.ca', website: 'maisonlumen.ca' },
      socials: { linkedin: '', instagram: 'https://instagram.com/maisonlumen', facebook: 'https://facebook.com/maisonlumen', tiktok: '', youtube: '' },
      blocks: {
        shop: shopFr,
        about: { on: true, text: 'Maison Lumen, c’est une petite boutique de quartier ouverte en 2016 sur le Plateau.\nNous choisissons des vêtements simples et durables, souvent fabriqués au Québec, et nous prenons le temps de vous conseiller.' },
        gallery: { on: true, images: [{ src: I.g1, cap: 'Nouvelle collection' }, { src: I.g2, cap: 'Chemises' }, { src: I.g3, cap: 'Tons neutres' }, { src: I.g4, cap: 'En boutique' }] },
        hours: hours([['Lundi – Mercredi', '10 h – 18 h'], ['Jeudi – Vendredi', '10 h – 21 h'], ['Samedi', '10 h – 17 h'], ['Dimanche', '12 h – 17 h']], 'Ramassage des commandes aux heures d’ouverture'),
        location: { on: true, map: true, address: '4321, boulevard Saint-Laurent, Montréal (Québec) H2W 1Z5', access: 'Métro Mont-Royal · Stationnement rue Rachel' },
        google: { on: true, rating: '4,8', count: '126', reviewUrl: 'https://g.page/r/exemple/review', mapsUrl: 'https://maps.google.com/', text: 'Votre avis nous aide à grandir. Merci !' },
        reviews: { on: true, items: [{ n: 'Julie T.', r: 'Robe en lin', t: 'Accueil super, on m’a aidée à trouver la bonne taille. La robe est magnifique !', s: 5 }, { n: 'Marc-André L.', r: 'Veste en jean', t: 'Commandé par texto le matin, ramassé le soir même. Très pratique.', s: 5 }] },
        policies: { on: true, items: [
          { t: 'Ramassage en boutique', d: 'Gratuit, prêt en 24 h. Nous vous écrivons quand c’est prêt.' },
          { t: 'Livraison locale', d: '10 $ à Montréal et Laval, gratuite dès 150 $ d’achat.' },
          { t: 'Échanges et retours', d: '30 jours avec la facture, articles non portés et étiquetés.' },
        ] },
      },
    },
  };
  mode.demoEn = {
    primary: 'shop',
    identity: { name: 'Maison Lumen', role: 'Clothing boutique', specialty: 'Clothing & accessories · Pearl District', company: '', photo: 'ph:logo', logo: '', cover: I.cover },
    contact: { phone: '(503) 555-0142', whatsapp: '+1 503 555-0142', email: 'hello@maisonlumen.com', website: 'maisonlumen.com' },
    socials: mode.demo.socials,
    blocks: {
      shop: shopEn,
      about: { on: true, text: 'Maison Lumen is a small neighborhood boutique, opened in 2016 in the Pearl District.\nWe pick simple, durable clothing, often locally made, and we take the time to help you find the right fit.' },
      gallery: { on: true, images: [{ src: I.g1, cap: 'New collection' }, { src: I.g2, cap: 'Shirts' }, { src: I.g3, cap: 'Neutral tones' }, { src: I.g4, cap: 'In store' }] },
      hours: hours([['Monday – Wednesday', '10 am – 6 pm'], ['Thursday – Friday', '10 am – 9 pm'], ['Saturday', '10 am – 5 pm'], ['Sunday', '12 pm – 5 pm']], 'Order pickup during opening hours'),
      location: { on: true, map: true, address: '1120 NW Couch St, Portland, OR 97209', access: 'Streetcar NW 11th & Couch · Street parking' },
      google: { on: true, rating: '4.8', count: '126', reviewUrl: 'https://g.page/r/example/review', mapsUrl: 'https://maps.google.com/', text: 'Your review helps us grow. Thank you!' },
      reviews: { on: true, items: [{ n: 'Julie T.', r: 'Linen dress', t: 'Lovely welcome, they helped me find the right size. The dress is beautiful!', s: 5 }, { n: 'Mark L.', r: 'Denim jacket', t: 'Ordered by text in the morning, picked up the same evening. So easy.', s: 5 }] },
      policies: { on: true, items: [
        { t: 'In-store pickup', d: 'Free, ready within 24 hours. We text you when it’s ready.' },
        { t: 'Local delivery', d: '$10 in the Portland metro area, free on orders over $150.' },
        { t: 'Exchanges & returns', d: '30 days with receipt, unworn items with tags.' },
      ] },
    },
  };

  /* Les 15 autres types : arrivent aux étapes suivantes */
  const soon = (code, id, name, icon, ex) => ({ id, code, name, icon, ex, active: false, blocks: [], palettes: [] });
  const SECTORS = [
    mode,
    soon('B02', 'friperie', 'Friperie et seconde main', 'recycle', 'Friperie, vintage, dépôt-vente…'),
    soon('B03', 'bijoux', 'Bijouterie', 'gem', 'Bijoutier, joaillier, créateur de bijoux…'),
    soon('B04', 'fleuriste', 'Fleuriste', 'flower-2', 'Bouquets, plantes, événements…'),
    soon('B05', 'deco', 'Décoration et mobilier', 'sofa', 'Meubles, décoration, luminaires…'),
    soon('B06', 'librairie', 'Librairie et papeterie', 'book-open', 'Livres, papeterie, cartes…'),
    soon('B07', 'cadeaux', 'Cadeaux et souvenirs', 'gift', 'Boutique cadeaux, souvenirs, artisanat…'),
    soon('B08', 'velos', 'Vélos', 'bike', 'Vente, location et réparation de vélos…'),
    soon('B09', 'cosmetiques', 'Cosmétiques naturels', 'leaf', 'Savons, soins naturels, zéro déchet…'),
    soon('B10', 'telephones', 'Réparation de téléphones', 'smartphone', 'Réparation, accessoires, reconditionnés…'),
    soon('B11', 'epicerie', 'Supermarché et épicerie', 'shopping-basket', 'Épicerie fine, dépanneur, marché…'),
    soon('B12', 'traiteur', 'Traiteur', 'chef-hat', 'Plats préparés, buffets, boîtes repas…'),
    soon('B13', 'animalerie', 'Animalerie', 'paw-print', 'Nourriture, accessoires, toilettage…'),
    soon('B14', 'resto', 'Restaurant (pour emporter)', 'utensils-crossed', 'Commandes à emporter et livraison…'),
    soon('B15', 'coiffure', 'Coiffure (produits)', 'scissors', 'Shampoings, soins, coiffants…'),
    soon('B16', 'esthetique', 'Esthétique (produits de soin)', 'sparkles', 'Crèmes, sérums, maquillage…'),
  ];
  NFC.SECTORS = SECTORS;
  NFC.OTHER = [];

  /* Noms des types en anglais (étape 1 du site en anglais) */
  Object.assign(window.NFC_EN_APP || (window.NFC_EN_APP = {}), {
    'Mode et vêtements': 'Fashion & clothing', 'Boutique de vêtements, prêt-à-porter, chaussures…': 'Clothing store, ready-to-wear, shoes…',
    'Friperie et seconde main': 'Thrift & second-hand', 'Friperie, vintage, dépôt-vente…': 'Thrift store, vintage, consignment…',
    'Bijouterie': 'Jewelry', 'Bijoutier, joaillier, créateur de bijoux…': 'Jeweler, jewelry designer…',
    'Fleuriste': 'Florist', 'Bouquets, plantes, événements…': 'Bouquets, plants, events…',
    'Décoration et mobilier': 'Home decor & furniture', 'Meubles, décoration, luminaires…': 'Furniture, decor, lighting…',
    'Librairie et papeterie': 'Books & stationery', 'Livres, papeterie, cartes…': 'Books, stationery, cards…',
    'Cadeaux et souvenirs': 'Gifts & souvenirs', 'Boutique cadeaux, souvenirs, artisanat…': 'Gift shop, souvenirs, crafts…',
    'Vélos': 'Bikes', 'Vente, location et réparation de vélos…': 'Bike sales, rentals and repairs…',
    'Cosmétiques naturels': 'Natural cosmetics', 'Savons, soins naturels, zéro déchet…': 'Soaps, natural skincare, zero waste…',
    'Réparation de téléphones': 'Phone repair', 'Réparation, accessoires, reconditionnés…': 'Repairs, accessories, refurbished…',
    'Supermarché et épicerie': 'Grocery & market', 'Épicerie fine, dépanneur, marché…': 'Fine foods, convenience store, market…',
    'Traiteur': 'Caterer', 'Plats préparés, buffets, boîtes repas…': 'Ready meals, buffets, meal boxes…',
    'Animalerie': 'Pet store', 'Nourriture, accessoires, toilettage…': 'Food, accessories, grooming…',
    'Restaurant (pour emporter)': 'Restaurant (takeout)', 'Commandes à emporter et livraison…': 'Takeout and delivery orders…',
    'Coiffure (produits)': 'Hair salon (products)', 'Shampoings, soins, coiffants…': 'Shampoos, treatments, styling…',
    'Esthétique (produits de soin)': 'Esthetics (skincare)', 'Crèmes, sérums, maquillage…': 'Creams, serums, makeup…',
    'Type de boutique': 'Store type', 'Changer de type de boutique': 'Change store type', 'Quel type de boutique avez-vous ?': 'What kind of store do you have?',
    'Choisissez le type le plus proche de votre commerce. Produits, prix, textes et sections restent entièrement personnalisables ensuite.': 'Pick the type closest to your store. Products, prices, texts and sections stay fully customizable afterwards.',
    'Studio Carte NFC – Boutiques': 'NFC Card Studio – Stores', 'Boutiques': 'Stores',
    'La boutique': 'The shop', 'Voir la boutique': 'Shop now', 'Notre histoire': 'Our story', 'En boutique': 'In store',
    'Heures d’ouverture': 'Opening hours', 'Nous trouver': 'Find us', 'Ce que disent nos clients': 'What our customers say',
    'Livraison, échanges et retours': 'Delivery, exchanges & returns', 'Vos produits, catégories, prix et la façon de commander': 'Your products, categories, prices and how customers order',
    '4 à 6 photos de votre magasin': '4 to 6 photos of your store', 'Vos conditions, en quelques lignes': 'Your terms, in a few lines',
  });
})();
