/* NFC Card Studio – Stores : exemples des autres types de boutique (FR = Québec, EN = États-Unis).
   Chaque type remplace sa tuile « Bientôt » dans la liste. Photos : Unsplash (licence gratuite). */
(function () {
  'use strict';

  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = ([name, p, a]) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const U = (id, w = 640) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
  const hours = (rows, note) => ({ on: true, rows: rows.map(([d, h]) => ({ d, h })), note });
  const HOURS = {
    fr: [['Lundi – Mercredi', '10 h – 18 h'], ['Jeudi – Vendredi', '10 h – 20 h'], ['Samedi', '10 h – 17 h'], ['Dimanche', '12 h – 17 h']],
    en: [['Monday – Wednesday', '10 am – 6 pm'], ['Thursday – Friday', '10 am – 8 pm'], ['Saturday', '10 am – 5 pm'], ['Sunday', '12 pm – 5 pm']],
  };

  /* Produit : [nom, description, prix, prix soldé, badge, photo, n° de catégorie, options, description longue] — textes en [fr, en] */
  /* Construit un type de boutique complet à partir d’une fiche compacte */
  function T(c) {
    const L = (k) => (k === 'en' ? 1 : 0);
    const demo = (lg) => {
      const x = c[lg], i = L(lg);
      const cats = c.cats.map((z) => z[i]);
      return {
        primary: 'shop',
        identity: { name: c.biz, role: x.role, specialty: x.spec, company: '', photo: 'ph:logo', logo: '', cover: U(c.cover, 1200) },
        contact: { phone: x.phone, whatsapp: x.wa, email: x.email, website: x.web },
        socials: { linkedin: '', instagram: 'https://instagram.com/' + c.handle, facebook: 'https://facebook.com/' + c.handle, tiktok: '', youtube: '' },
        blocks: {
          shop: {
            on: true, label: '', text: x.text, cats: cats.join(', '),
            items: c.prods.map((p) => ({ t: p[0][i], d: p[1][i], l: p[8] ? p[8][i] : '', p: p[2], sp: p[3] || '', b: p[4] ? p[4][i] : '', img: U(p[5]), cat: cats[p[6]], o: p[7] ? (Array.isArray(p[7]) ? p[7][i] : p[7]) : '', on: true, tx: (lg === 'en' ? '' : p[9]) || c.txAll || '' })),
            order: c.order || 'sms', phone: '', wa: '', email: '', payUrl: '',
            pay: c.pay ? Object.assign({}, c.pay, lg === 'en' ? { interac: false, etr: false, zelle: true } : {}) : (lg === 'en' ? { cash: true, card: true, zelle: true } : { cash: true, card: true, interac: true, etr: true }),
            payLinks: {}, payInfo: lg === 'en' ? { zelle: x.email } : { interac: x.email }, dinein: !!c.dinein, food: !!c.food,
            pickup: true, delivery: true, fee: c.fee, freeFrom: c.freeFrom || '', zone: x.zone, tax: lg === 'en' ? 'us' : (c.tax || 'qc'), rate: lg === 'en' ? x.rate : '',
          },
          about: { on: true, text: x.about },
          gallery: { on: true, images: c.gallery.map((g) => ({ src: U(g[0]), cap: g[1 + i] })) },
          hours: hours(x.hours || HOURS[lg], x.hoursNote),
          location: { on: true, map: true, address: x.addr, access: x.access },
          google: { on: true, rating: lg === 'en' ? String(c.rating[0]) : String(c.rating[0]).replace('.', ','), count: String(c.rating[1]), reviewUrl: 'https://g.page/r/example/review', mapsUrl: lg === 'en' ? 'https://maps.app.goo.gl/example' : 'https://maps.app.goo.gl/exemple', text: lg === 'en' ? 'Your review helps us grow. Thank you!' : 'Votre avis nous aide à grandir. Merci !' },
          reviews: { on: true, items: c.reviews.map((r) => ({ n: r[0], r: r[1][i], t: r[2][i], s: 5 })) },
          policies: { on: true, items: x.policies.map(([t, d]) => ({ t, d })) },
        },
      };
    };
    return {
      id: c.id, code: c.code, name: c.name, icon: c.icon, ex: c.ex, active: true, rec: c.rec, establishment: true,
      palettes: c.pal.map(pal),
      blocks: [
        { key: 'shop', type: 'shop', title: c.shopTitle, cta: c.cta, help: 'Vos produits, catégories, prix et la façon de commander' },
        { key: 'about', type: 'text', title: c.aboutTitle || 'Notre histoire', help: '50 à 120 mots conseillés' },
        { key: 'gallery', type: 'gallery', title: c.galTitle || 'En boutique', help: '4 à 6 photos de votre magasin' },
        { key: 'hours', type: 'hours', title: 'Heures d’ouverture' },
        { key: 'location', type: 'location', title: 'Nous trouver' },
        { key: 'google', type: 'greviews', title: 'Avis Google', help: 'Votre note Google et un bouton pour laisser un avis' },
        { key: 'reviews', type: 'reviews', title: 'Ce que disent nos clients' },
        { key: 'policies', type: 'list', title: c.polTitle || 'Livraison, échanges et retours', help: 'Vos conditions, en quelques lignes' },
      ],
      demo: demo('fr'), demoEn: demo('en'),
    };
  }

  const TYPES = [];

  /* ---------- Friperie et seconde main ---------- */
  TYPES.push(T({
    id: 'friperie', code: 'B02', name: 'Friperie et seconde main', icon: 'recycle', ex: 'Friperie, vintage, dépôt-vente…', rec: 'd8',
    biz: 'Seconde Vie', handle: 'secondevie', shopTitle: 'Arrivages de la semaine', cta: 'Voir les arrivages', fee: '8', freeFrom: '75',
    pal: [['Moutarde', '#5a4a1f', '#e0b84f'], ['Vert forêt', '#264d36', '#d9a441'], ['Brique', '#8c3b2a', '#f2b880'], ['Denim', '#2c4560', '#e8c07a'], ['Prune', '#5b2a4a', '#e7a6c0'], ['Charbon', '#232323', '#f0c75e']],
    cover: '1759630814559-f9fffe187384', rating: [4.8, 203],
    cats: [['Vêtements', 'Clothing'], ['Accessoires', 'Accessories'], ['Objets vintage', 'Vintage finds']],
    prods: [
      [['Veste en cuir années 80', '80s leather jacket'], ['Cuir noir, très bon état', 'Black leather, great condition'], '85', '', ['Pièce unique', 'One of a kind'], '1727515546577-f7d82a47b51d', 0, 'M',
        ['Veste en cuir véritable des années 80, doublure intacte, fermeture éclair d’origine. Lavée et inspectée.', 'Genuine 80s leather jacket, lining intact, original zipper. Cleaned and inspected.']],
      [['Veste en jean délavée', 'Washed denim jacket'], ['Denim vintage, coupe droite', 'Vintage denim, straight fit'], '45', '', '', '1611312449408-fcece27cdbb7', 0, 'L'],
      [['Robe vintage', 'Vintage dress'], ['Années 70, imprimé fleuri', '70s, floral print'], '38', '', ['Pièce unique', 'One of a kind'], '1678935908871-a72d8380baaa', 0, 'S'],
      [['Chandail en tricot', 'Knit sweater'], ['Laine, motif rayé', 'Wool, striped'], '28', '22', ['Solde', 'Sale'], '1611911813383-67769b37a149', 0, 'M'],
      [['Bottes en cuir', 'Leather boots'], ['Cuir brun, ressemelées', 'Brown leather, resoled'], '55', '', '', '1550998358-08b4f83dc345', 1, ['Pointure 9', 'Size 9']],
      [['Lunettes rétro', 'Retro sunglasses'], ['Monture dorée', 'Gold frame'], '18', '', '', '1511499767150-a48a237f0083', 1, ''],
      [['Disques vinyles', 'Vinyl records'], ['Rock, jazz, francophone', 'Rock, jazz, soul'], '15', '', ['Nouveau', 'New'], '1602848597941-0d3d3a2c1241', 2, ''],
      [['Appareil photo argentique', 'Film camera'], ['Testé, fonctionne', 'Tested, works'], '120', '', ['Pièce unique', 'One of a kind'], '1510127034890-ba27508e9f1c', 2, ''],
    ],
    gallery: [['1582719188393-bb71ca45dbb9', 'Les tricots', 'Knitwear'], ['1521335629791-ce4aec67dd15', 'Les couleurs', 'Colors'], ['1520006403909-838d6b92c22e', 'Le tri', 'Sorting'], ['1695054982746-e3e16923c048', 'La vitrine', 'Storefront']],
    reviews: [['Sarah B.', ['Veste en cuir', 'Leather jacket'], ['Des trouvailles incroyables et des prix honnêtes. J’y passe chaque semaine !', 'Amazing finds and fair prices. I stop by every week!']], ['Kevin M.', ['Vinyles', 'Vinyl records'], ['Belle sélection de vinyles, et on m’a mis de côté un disque par texto.', 'Great vinyl selection, and they held a record for me by text.']]],
    fr: { role: 'Friperie et vintage', spec: 'Vêtements de seconde main triés à la main · Plateau', phone: '514 555-0177', wa: '+1 514 555-0177', email: 'bonjour@secondevie.ca', web: 'secondevie.ca',
      text: 'Chaque pièce est unique, lavée et vérifiée. Réservez par texto, venez essayer en boutique.', zone: 'Montréal (Plateau, Rosemont, Villeray)',
      about: 'Seconde Vie, c’est une friperie de quartier qui croit à la mode circulaire.\nNous trions chaque arrivage à la main pour ne garder que les belles pièces. Vous pouvez aussi nous apporter vos vêtements en dépôt-vente.',
      addr: '1875, avenue du Mont-Royal Est, Montréal (Québec) H2H 1J1', access: 'Métro Mont-Royal · Vélo : station BIXI devant la boutique',
      policies: [['Pièces uniques', 'Chaque article n’existe qu’en un exemplaire : premier arrivé, premier servi.'], ['Réservation', 'Réservé 48 h par texto, puis remis en vente.'], ['Échanges', '14 jours en crédit boutique, pas de remboursement.']] },
    en: { role: 'Thrift & vintage store', spec: 'Hand-picked second-hand clothing · South Congress', phone: '(512) 555-0177', wa: '+1 512 555-0177', email: 'hello@secondevie.com', web: 'secondevie.com',
      text: 'Every piece is one of a kind, cleaned and checked. Reserve by text, try it on in store.', zone: 'Central Austin', rate: '8.25',
      about: 'Seconde Vie is a neighborhood thrift store that believes in circular fashion.\nWe sort every drop by hand and keep only the good stuff. You can also bring us your clothes on consignment.',
      addr: '1508 S Congress Ave, Austin, TX 78704', access: 'Bus 1 · Street parking on Congress',
      policies: [['One-of-a-kind items', 'Each item exists only once: first come, first served.'], ['Holds', 'Held for 48 hours by text, then back on the rack.'], ['Exchanges', '14 days for store credit, no refunds.']] },
  }));

  /* ---------- Bijouterie ---------- */
  TYPES.push(T({
    id: 'bijoux', code: 'B03', name: 'Bijouterie', icon: 'gem', ex: 'Bijoutier, joaillier, créateur de bijoux…', rec: 'd10',
    biz: 'Atelier Or & Perle', handle: 'orperle', shopTitle: 'Nos bijoux', cta: 'Voir les bijoux', fee: '0', pay: { card: true, interac: true, etr: true },
    pal: [['Ivoire & or', '#3a2f22', '#c9a227'], ['Noir & or', '#151515', '#d4af37'], ['Bleu nuit', '#1c2a44', '#c9a96e'], ['Rose gold', '#6e3b3b', '#e0a899'], ['Émeraude', '#11473a', '#d4af37'], ['Argent', '#3b4250', '#c0c7d1']],
    cover: '1660860547079-fd4845880af9', rating: [4.9, 141],
    cats: [['Bagues', 'Rings'], ['Colliers', 'Necklaces'], ['Boucles d’oreilles', 'Earrings'], ['Bracelets', 'Bracelets'], ['Montres', 'Watches']],
    prods: [
      [['Bague de fiançailles', 'Engagement ring'], ['Or 14 carats, diamant 0,5 ct', '14k gold, 0.5 ct diamond'], '1890', '', ['Coup de cœur', 'Favorite'], '1633934542430-0905ccb5f050', 0, '5, 5½, 6, 6½, 7, 7½, 8',
        ['Solitaire en or jaune 14 carats, diamant certifié de 0,5 carat. Ajustement de taille offert. Livrée dans son écrin.', '14k yellow gold solitaire with a certified 0.5 carat diamond. Free resizing. Comes in a gift box.']],
      [['Alliances entrelacées', 'Interlocking wedding bands'], ['Or 14 carats, la paire', '14k gold, set of two'], '690', '', '', '1622398925373-3f91b1e275f5', 0, '5, 6, 7, 8, 9, 10'],
      [['Collier de perles', 'Pearl necklace'], ['Perles d’eau douce, fermoir or', 'Freshwater pearls, gold clasp'], '245', '', '', '1611652022419-a9419f74343d', 1, ''],
      [['Pendentif en or', 'Gold pendant'], ['Chaîne 45 cm incluse', '18" chain included'], '380', '320', ['Solde', 'Sale'], '1705326452390-3ecf6070595f', 1, ''],
      [['Boucles en argent', 'Silver earrings'], ['Argent sterling recyclé', 'Recycled sterling silver'], '120', '', ['Nouveau', 'New'], '1693212793204-bcea856c75fe', 2, ''],
      [['Bracelet maille or', 'Gold chain bracelet'], ['Or 10 carats, 19 cm', '10k gold, 7.5"'], '420', '', '', '1602173574767-37ac01994b2a', 3, ''],
      [['Montre classique', 'Classic watch'], ['Acier et or, mouvement suisse', 'Steel and gold, Swiss movement'], '1250', '', '', '1600003014755-ba31aa59c4b6', 4, ''],
    ],
    gallery: [['1744369382892-eb5b6a2fdc6f', 'Haute joaillerie', 'Fine jewelry'], ['1629212093109-354efe3fc541', 'Pendentifs', 'Pendants'], ['1631982690223-8aa4be0a2497', 'Écrins', 'Gift boxes'], ['1604306354577-68136efdf03b', 'La boutique', 'The store']],
    reviews: [['Daniel R.', ['Bague de fiançailles', 'Engagement ring'], ['Conseils précieux et une bague magnifique. Elle a dit oui !', 'Great advice and a beautiful ring. She said yes!']], ['Megan P.', ['Collier de perles', 'Pearl necklace'], ['Emballage superbe, parfait pour offrir.', 'Gorgeous packaging, perfect as a gift.']]],
    fr: { role: 'Bijouterie et joaillerie', spec: 'Bijoux en or et argent · Gravure sur place', phone: '418 555-0133', wa: '', email: 'bonjour@orperle.ca', web: 'orperle.ca',
      text: 'Payez par carte en boutique ou par virement Interac, puis récupérez votre bijou ou recevez-le par la poste, assuré.', zone: 'Partout au Québec (envoi assuré)',
      about: 'Atelier Or & Perle est une bijouterie familiale du quartier Montcalm depuis 1998.\nNous créons et ajustons vos bijoux sur place, et nous gravons gratuitement vos alliances.',
      addr: '845, avenue Cartier, Québec (Québec) G1R 2R6', access: 'Stationnement gratuit 1 h derrière la boutique',
      policies: [['Ajustement de taille', 'Offert sur toutes les bagues, prêt en 5 jours ouvrables.'], ['Livraison assurée', 'Gratuite partout au Québec, avec signature à la réception.'], ['Garantie', '2 ans sur la fabrication. Échange possible 30 jours (sauf gravure).']] },
    en: { role: 'Jewelry store', spec: 'Gold & silver jewelry · Engraving on site', phone: '(617) 555-0133', wa: '', email: 'hello@orperle.com', web: 'orperle.com',
      text: 'Pay by card in store, then pick up your piece or get it shipped, fully insured.', zone: 'Nationwide (insured shipping)', rate: '6.25',
      about: 'Atelier Or & Perle has been a family jewelry store on Newbury Street since 1998.\nWe design and resize your jewelry on site, and engrave wedding bands for free.',
      addr: '312 Newbury St, Boston, MA 02115', access: 'Green Line – Hynes Convention Center',
      policies: [['Resizing', 'Free on all rings, ready in 5 business days.'], ['Insured shipping', 'Free nationwide, signature required on delivery.'], ['Warranty', '2 years on craftsmanship. Exchanges within 30 days (except engraved items).']] },
  }));

  /* ---------- Fleuriste ---------- */
  TYPES.push(T({
    id: 'fleuriste', code: 'B04', name: 'Fleuriste', icon: 'flower-2', ex: 'Bouquets, plantes, événements…', rec: 'd9',
    biz: 'Fleurs de Saison', handle: 'fleursdesaison', shopTitle: 'Nos bouquets', cta: 'Commander un bouquet', fee: '12', freeFrom: '100', order: 'sms',
    pal: [['Rose pivoine', '#8e3b5a', '#f4b6c2'], ['Vert feuillage', '#2f5d3a', '#f2c6d0'], ['Lavande', '#5b4a8a', '#cbb8f0'], ['Corail', '#b5523b', '#ffd2a8'], ['Crème', '#5c4b3b', '#e8cfa6'], ['Bordeaux', '#6b1d2a', '#f0b8c0']],
    cover: '1639696194673-67b86204b885', rating: [4.9, 318],
    cats: [['Bouquets', 'Bouquets'], ['Plantes', 'Plants'], ['Fleurs séchées', 'Dried flowers'], ['Mariage', 'Weddings']],
    prods: [
      [['Bouquet de roses', 'Rose bouquet'], ['Roses roses de saison', 'Seasonal pink roses'], '55', '', ['Meilleure vente', 'Best seller'], '1582794543139-8ac9cb0f7b11', 0, [['Petit', 'Moyen', 'Grand'].join(', '), 'Small, Medium, Large'],
        ['Roses fraîches de saison, emballées dans du papier kraft avec un petit mot. Le format moyen compte une douzaine de roses.', 'Fresh seasonal roses, wrapped in kraft paper with a handwritten note. The medium size has a dozen roses.']],
      [['Tulipes du printemps', 'Spring tulips'], ['Une botte de 15 tiges', 'A bunch of 15 stems'], '39', '', ['Nouveau', 'New'], '1586968295564-92fd7572718b', 0, ''],
      [['Bouquet de pivoines', 'Peony bouquet'], ['En saison de mai à juillet', 'In season May to July'], '65', '', '', '1539622230226-3d4eb483b3f2', 0, ['Moyen, Grand', 'Medium, Large']],
      [['Tournesols', 'Sunflowers'], ['Bouquet joyeux de 7 tiges', 'A cheerful bunch of 7 stems'], '45', '', '', '1455659817273-f96807779a8a', 0, ''],
      [['Orchidée blanche', 'White orchid'], ['En pot céramique', 'In a ceramic pot'], '42', '', '', '1605996370592-b6f7a81e382e', 1, ''],
      [['Bonsaï', 'Bonsai'], ['Ficus, avec soucoupe', 'Ficus, with saucer'], '75', '', '', '1520412099551-62b6bafeb5bb', 1, ''],
      [['Bouquet de fleurs séchées', 'Dried flower bouquet'], ['Dure plus d’un an', 'Lasts over a year'], '48', '40', ['Solde', 'Sale'], '1622658641558-235f26dd270b', 2, ''],
      [['Bouquet de mariée', 'Bridal bouquet'], ['Sur mesure, avec consultation', 'Custom, with consultation'], '180', '', '', '1487530811176-3780de880c2d', 3, ''],
    ],
    gallery: [['1589244159943-460088ed5c92', 'Arrivage du matin', 'Morning delivery'], ['1531058240690-006c446962d8', 'L’atelier', 'The workshop'], ['1622658641561-fe2ca339b039', 'Compositions', 'Arrangements'], ['1616614992443-72324b4f83c6', 'La boutique', 'The shop']],
    reviews: [['Emily S.', ['Bouquet de roses', 'Rose bouquet'], ['Commandé par texto à midi, livré au bureau à 15 h. Magnifique !', 'Ordered by text at noon, delivered to the office by 3 pm. Gorgeous!']], ['Jason K.', ['Bouquet de mariée', 'Bridal bouquet'], ['Ils ont réalisé toutes les fleurs de notre mariage. Un travail superbe.', 'They did all the flowers for our wedding. Stunning work.']]],
    fr: { role: 'Fleuriste', spec: 'Bouquets frais, plantes et mariages · Livraison le jour même', phone: '819 555-0164', wa: '+1 819 555-0164', email: 'bonjour@fleursdesaison.ca', web: 'fleursdesaison.ca',
      text: 'Commandez avant 13 h : livraison le jour même à Sherbrooke. Ajoutez votre petit mot dans la commande.', zone: 'Sherbrooke, Magog et North Hatley',
      about: 'Fleurs de Saison travaille avec des producteurs des Cantons-de-l’Est dès que la saison le permet.\nBouquets du quotidien, deuil, anniversaires ou mariages : nous composons chaque bouquet à la main, le jour même.',
      addr: '210, rue Wellington Nord, Sherbrooke (Québec) J1H 5C5', access: 'Stationnement Wellington Nord, 2 min à pied',
      hours: [['Lundi – Vendredi', '9 h – 18 h'], ['Samedi', '9 h – 17 h'], ['Dimanche', '10 h – 15 h']], hoursNote: 'Livraison le jour même pour toute commande avant 13 h',
      policies: [['Livraison le jour même', 'Pour toute commande passée avant 13 h, du lundi au samedi.'], ['Fraîcheur garantie', 'Si vos fleurs fanent en moins de 5 jours, nous les remplaçons.'], ['Mariages et événements', 'Consultation gratuite, réservez 2 mois à l’avance.']] },
    en: { role: 'Florist', spec: 'Fresh bouquets, plants & weddings · Same-day delivery', phone: '(206) 555-0164', wa: '+1 206 555-0164', email: 'hello@fleursdesaison.com', web: 'fleursdesaison.com',
      text: 'Order before 1 pm for same-day delivery in Seattle. Add your note to the order.', zone: 'Seattle and Bellevue', rate: '10.35',
      about: 'Fleurs de Saison works with local Pacific Northwest growers whenever the season allows.\nEveryday bouquets, sympathy, birthdays or weddings: every bouquet is made by hand, the same day.',
      addr: '1420 Pike Pl, Seattle, WA 98101', access: 'Pike Place Market · Public Market parking',
      hours: [['Monday – Friday', '9 am – 6 pm'], ['Saturday', '9 am – 5 pm'], ['Sunday', '10 am – 3 pm']], hoursNote: 'Same-day delivery on orders before 1 pm',
      policies: [['Same-day delivery', 'On orders placed before 1 pm, Monday to Saturday.'], ['Freshness guarantee', 'If your flowers wilt within 5 days, we replace them.'], ['Weddings & events', 'Free consultation, book 2 months ahead.']] },
  }));

  /* ---------- Décoration et mobilier ---------- */
  TYPES.push(T({
    id: 'deco', code: 'B05', name: 'Décoration et mobilier', icon: 'sofa', ex: 'Meubles, décoration, luminaires…', rec: 'd2',
    biz: 'Atelier Nord', handle: 'ateliernord', shopTitle: 'Le catalogue', cta: 'Voir le catalogue', fee: '49', freeFrom: '500', order: 'email',
    pal: [['Lin', '#4a4137', '#c8b49a'], ['Noyer', '#3d2b1f', '#d9a066'], ['Sauge', '#46584a', '#c9d3b8'], ['Bleu ardoise', '#2f3e4e', '#a9bccf'], ['Terracotta', '#93432c', '#efc19a'], ['Graphite', '#222222', '#d6c3a3']],
    cover: '1687180498602-5a1046defaa4', rating: [4.7, 96],
    cats: [['Mobilier', 'Furniture'], ['Luminaires', 'Lighting'], ['Décoration', 'Decor'], ['Textiles', 'Textiles']],
    prods: [
      [['Fauteuil en bouclé', 'Bouclé armchair'], ['Structure en chêne massif', 'Solid oak frame'], '649', '549', ['Solde', 'Sale'], '1580480055273-228ff5388ef8', 0, [['Gris', 'Crème'].join(', '), 'Grey, Cream'],
        ['Fauteuil enveloppant en tissu bouclé, structure en chêne massif fabriquée au Québec. 76 × 80 × 78 cm.', 'Enveloping bouclé armchair with a solid oak frame. 30 × 31.5 × 30.5 in.']],
      [['Table basse en bois', 'Wooden coffee table'], ['Frêne huilé, 110 cm', 'Oiled ash, 43"'], '429', '', '', '1600623050499-84929aad17c9', 0, ''],
      [['Lampe de table', 'Table lamp'], ['Pied céramique, abat-jour lin', 'Ceramic base, linen shade'], '159', '', ['Nouveau', 'New'], '1517991104123-1d56a6e81ed9', 1, ''],
      [['Miroir arrondi', 'Arched mirror'], ['Cadre laiton, 60 × 90 cm', 'Brass frame, 24 × 35"'], '189', '', '', '1688650963441-a4ce8fa08d50', 2, ''],
      [['Vases en terre cuite', 'Terracotta vases'], ['Lot de 3, faits main', 'Set of 3, handmade'], '68', '', '', '1631125915902-d8abe9225ff2', 2, ''],
      [['Bougie parfumée', 'Scented candle'], ['Cire de soja, 50 h', 'Soy wax, 50 hours'], '28', '', ['Meilleure vente', 'Best seller'], '1561212856-44e9bae482aa', 2, [['Bois de cèdre', 'Figue', 'Thé blanc'].join(', '), 'Cedarwood, Fig, White tea']],
      [['Coussin en lin', 'Linen cushion'], ['50 × 50 cm, housse lavable', '20 × 20", washable cover'], '39', '', '', '1629949009765-40fc74c9ec21', 3, [['Naturel', 'Blanc', 'Gris'].join(', '), 'Natural, White, Grey']],
    ],
    gallery: [['1583847268964-b28dc8f51f92', 'Salon', 'Living room'], ['1631679706909-1844bbd07221', 'Ambiance', 'Mood'], ['1616047006789-b7af5afb8c20', 'Canapés', 'Sofas'], ['1618220179428-22790b461013', 'Détails', 'Details']],
    reviews: [['Laura W.', ['Fauteuil en bouclé', 'Bouclé armchair'], ['Livré et monté chez moi en 4 jours. Qualité impeccable.', 'Delivered and assembled at home in 4 days. Flawless quality.']], ['Chris D.', ['Lampe de table', 'Table lamp'], ['Conseils déco gratuits et vraiment utiles. Je recommande.', 'Free decor advice that actually helped. Highly recommend.']]],
    fr: { role: 'Décoration et mobilier', spec: 'Meubles fabriqués au Québec · Conseils déco offerts', phone: '450 555-0128', wa: '', email: 'bonjour@ateliernord.ca', web: 'ateliernord.ca',
      text: 'Envoyez votre commande par courriel : nous confirmons la disponibilité et la date de livraison sous 24 h.', zone: 'Grand Montréal, Laval et Rive-Nord',
      about: 'Atelier Nord sélectionne du mobilier durable, souvent fabriqué au Québec, et des objets de décoration faits main.\nPrenez rendez-vous pour un conseil déco gratuit en boutique ou chez vous.',
      addr: '2350, boulevard Le Carrefour, Laval (Québec) H7T 2K7', access: 'Métro Montmorency puis bus 61 · Grand stationnement gratuit',
      policies: [['Livraison et montage', '49 $ dans le Grand Montréal, gratuits dès 500 $ d’achat.'], ['Retours', '30 jours, article non utilisé, dans son emballage.'], ['Sur commande', 'Tissus et finitions au choix : comptez 6 à 8 semaines.']] },
    en: { role: 'Home decor & furniture', spec: 'Locally made furniture · Free design advice', phone: '(303) 555-0128', wa: '', email: 'hello@ateliernord.com', web: 'ateliernord.com',
      text: 'Email us your order: we confirm availability and delivery date within 24 hours.', zone: 'Denver metro area', rate: '8.81',
      about: 'Atelier Nord curates durable, often locally made furniture and handmade decor.\nBook a free design consultation in store or at home.',
      addr: '2955 E 3rd Ave, Denver, CO 80206', access: 'Cherry Creek North · Free parking behind the store',
      policies: [['Delivery & assembly', '$49 in the Denver metro area, free on orders over $500.'], ['Returns', '30 days, unused item in original packaging.'], ['Made to order', 'Choose fabrics and finishes: allow 6 to 8 weeks.']] },
  }));

  /* ---------- Librairie et papeterie ---------- */
  TYPES.push(T({
    id: 'librairie', code: 'B06', name: 'Librairie et papeterie', icon: 'book-open', ex: 'Livres, papeterie, cartes…', rec: 'd2',
    biz: 'Librairie du Quartier', handle: 'librairieduquartier', shopTitle: 'Nos suggestions', cta: 'Voir les suggestions', fee: '6', freeFrom: '50', order: 'sms',
    pal: [['Encre', '#1f2a44', '#e3b448'], ['Vert bouteille', '#1f4a3a', '#e6c27a'], ['Bordeaux', '#5e1f2b', '#e8b07a'], ['Papier kraft', '#5a4632', '#d7b98e'], ['Bleu canard', '#1d4f5c', '#f2b5a0'], ['Noir', '#1a1a1a', '#e9c46a']],
    cover: '1760106782590-bb02f861cbc7', rating: [4.9, 174],
    cats: [['Livres', 'Books'], ['Jeunesse', 'Kids'], ['Papeterie', 'Stationery'], ['Cartes et cadeaux', 'Cards & gifts']],
    prods: [
      [['Le coup de cœur du mois', 'Book of the month'], ['Roman choisi par l’équipe', 'A novel picked by our staff'], '27.95', '', ['Coup de cœur', 'Staff pick'], '1610116306796-6fea9f4fae38', 0, '',
        ['Chaque mois, l’équipe choisit un roman qu’elle a adoré. Demandez-nous le titre par texto, ou laissez-vous surprendre : il arrive avec un signet offert.', 'Every month our team picks a novel they loved. Text us for the title, or let us surprise you: it comes with a free bookmark.'], 'tps'],
      [['Albums jeunesse', 'Picture books'], ['Sélection 3 à 6 ans', 'Selection for ages 3 to 6'], '19.95', '', '', '1497633762265-9d179a990aa6', 1, '', null, 'tps'],
      [['Carnet ligné', 'Lined notebook'], ['Couverture rigide, 192 pages', 'Hardcover, 192 pages'], '18', '', ['Nouveau', 'New'], '1531346878377-a5be20888e57', 2, [['Ligné', 'Quadrillé', 'Uni'].join(', '), 'Lined, Grid, Blank']],
      [['Stylo plume', 'Fountain pen'], ['Plume moyenne, cartouches incluses', 'Medium nib, cartridges included'], '45', '', '', '1471107340929-a87cd0f5b5f3', 2, ''],
      [['Agenda 2027', '2027 planner'], ['Semaine sur deux pages', 'Weekly spread'], '32', '26', ['Solde', 'Sale'], '1435527173128-983b87201f4d', 2, ''],
      [['Signets illustrés', 'Illustrated bookmarks'], ['Lot de 4', 'Set of 4'], '8', '', '', '1553060146-71667aa3f223', 3, ''],
      [['Cartes de souhaits', 'Greeting cards'], ['Avec enveloppe kraft', 'With kraft envelope'], '6.50', '', '', '1566125882500-87e10f726cdc', 3, [['Anniversaire', 'Merci', 'Félicitations'].join(', '), 'Birthday, Thank you, Congratulations']],
    ],
    gallery: [['1569728723358-d1a317aa7fba', 'Les rayons', 'The shelves'], ['1481415004805-b5b5c1e19e9f', 'Le coin lecture', 'Reading nook'], ['1699443817739-cf2f7cbcd18d', 'Nouveautés', 'New releases'], ['1645714735006-4d7cb0d2559b', 'Les rencontres', 'Author events']],
    reviews: [['Rachel H.', ['Coup de cœur du mois', 'Book of the month'], ['Leurs suggestions ne m’ont jamais déçue. Une vraie librairie de quartier.', 'Their picks never disappoint. A true neighborhood bookstore.']], ['Tom G.', ['Stylo plume', 'Fountain pen'], ['Livre commandé par texto, prêt le lendemain. Service parfait.', 'Ordered a book by text, ready the next day. Perfect service.']]],
    fr: { role: 'Librairie indépendante', spec: 'Livres, jeunesse et papeterie · Commandes spéciales en 48 h', phone: '819 555-0119', wa: '', email: 'bonjour@librairieduquartier.ca', web: 'librairieduquartier.ca',
      text: 'Un titre en tête ? Écrivez-le dans la note de votre commande : nous le commandons pour vous, prêt en 48 h.', zone: 'Gatineau et Ottawa',
      about: 'La Librairie du Quartier est une librairie indépendante agréée, ouverte depuis 2009.\nNotre équipe lit beaucoup et conseille avec plaisir. Rencontres d’auteurs un jeudi par mois.',
      addr: '120, rue Principale, Gatineau (Québec) J9H 3M3', access: 'Stationnement gratuit rue Principale · Autobus 49',
      policies: [['Commandes spéciales', 'N’importe quel livre disponible au Québec, prêt en 48 h, sans frais.'], ['Livraison', '6 $ à Gatineau, gratuite dès 50 $.'], ['Échanges', '15 jours avec la facture, livre en parfait état.']] },
    en: { role: 'Independent bookstore', spec: 'Books, kids & stationery · Special orders in 48 h', phone: '(312) 555-0119', wa: '', email: 'hello@neighborhoodbooks.com', web: 'neighborhoodbooks.com',
      text: 'Have a title in mind? Add it to your order note: we’ll order it for you, ready in 48 hours.', zone: 'Chicago (Wicker Park, Bucktown, Logan Square)', rate: '10.25',
      about: 'Librairie du Quartier is an independent bookstore, open since 2009.\nOur team reads a lot and loves to recommend. Author events one Thursday a month.',
      addr: '1534 N Milwaukee Ave, Chicago, IL 60622', access: 'Blue Line – Damen · Street parking',
      policies: [['Special orders', 'Any book in print, ready in 48 hours, no extra fee.'], ['Delivery', '$6 in Chicago, free on orders over $50.'], ['Exchanges', '15 days with receipt, book in perfect condition.']] },
  }));

  /* Le constructeur sert aussi aux types suivants (stores-types-2.js) */
  NFC.storeType = T;

  /* Remplace les tuiles « Bientôt » correspondantes */
  TYPES.forEach((t) => {
    const i = NFC.SECTORS.findIndex((s) => s.id === t.id);
    if (i >= 0) { t.kw = NFC.SECTORS[i].kw; NFC.SECTORS[i] = t; } else NFC.SECTORS.push(t);
  });

  /* Titres de sections en anglais (carte) */
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), {
    'Arrivages de la semaine': 'This week’s finds', 'Voir les arrivages': 'See new arrivals', 'Nos bijoux': 'Our jewelry', 'Voir les bijoux': 'Shop jewelry',
    'Nos bouquets': 'Our bouquets', 'Commander un bouquet': 'Order a bouquet', 'Le catalogue': 'The catalog', 'Voir le catalogue': 'Browse the catalog',
    'Nos suggestions': 'Our picks', 'Voir les suggestions': 'See our picks',
  });
})();
