/* Commerces du secteur « Producteurs et commerces alimentaires » (10 commerces). Même principe que profiles.js.
   Photos et vidéos : Mixkit, licence gratuite usage commercial (dossier media/prod/). */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/prod/';
  const im = (id) => F + id + '.jpg';
  const vd = (id) => F + 'v' + id + '.mp4';

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: 'ph:logo', cover: im(M.cover), logo: '' });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.produits, { on: true, title: L.prodTitle, items: L.prod.map(([t, dd, p]) => ({ t, d: dd, p })) });
    Object.assign(b.saison, { on: true, title: L.sais[0], tags: L.sais[1], text: L.sais[2] });
    Object.assign(b.marches, { on: true, title: L.whereTitle, rows: L.where.map(([dd, h]) => ({ d: dd, h })), note: '' });
    Object.assign(b.order, { on: true, title: L.order[0], label: L.order[1], url: 'https://example.com', text: L.order[2] });
    Object.assign(b.gallery, { on: true, title: L.galTitle, images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    Object.assign(b.location, { on: true, title: L.locTitle, address: L.loc[0], access: L.loc[1] });
    Object.assign(b.video, { on: true, url: '', src: vd(M.video), cover: im(M.video), cap: L.vid });
    if (b.reviews) Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    if (b.booking) b.booking.email = email;
    return d;
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.cover), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.gal.slice(0, 3).map(im),
    video: { src: vd(M.video), poster: im(M.video), cap: L.vid },
  });

  const PROD = [
    { id: 'maraicher', icon: 'carrot', keep: true, tile: 'media/tiles/prod-maraicher.jpg', n: ['Légumes de saison', 'Seasonal vegetables'], ex: ['Maraîcher, paniers bio, kiosque', 'Vegetable farm, organic baskets'] },

    { id: 'bio', icon: 'leaf', rec: 'd4',
      n: ['Épicerie bio', 'Organic grocery'], ex: ['Fruits, légumes et vrac biologiques', 'Organic produce and bulk foods'],
      pal: [pal('Vert feuille', '#3f6212', '#fbbf24'), pal('Sauge', '#4d6b57', '#e7d7b5'), pal('Terre cuite', '#9a3412', '#fde68a'), pal('Kraft', '#7c5a3a', '#d9f99d'), pal('Menthe', '#0f766e', '#fde68a'), pal('Ardoise', '#334155', '#a3e635')],
      M: { cover: 6273, gal: [48351, 48350, 22692, 22705, 47538, 5903], video: 6273 },
      fr: { id: ['Le Panier Vert', 'Épicerie biologique', 'Fruits et légumes bio · Vrac · Produits locaux', 'Coopérative Le Panier Vert'], ct: ['+1 514 555-0172', 'bonjour@lepaniervert.ca', 'lepaniervert.ca'],
        about: ['L’épicerie', 'Plus de 1 500 produits certifiés biologiques, dont 60 % viennent de fermes québécoises. Apportez vos contenants : le vrac est pesé à la caisse.'],
        prodTitle: 'Nos incontournables', prod: [['Panier de la semaine', 'Fruits et légumes bio de saison', '35 $'], ['Vrac', 'Céréales, noix, légumineuses', 'au poids'], ['Pain au levain', 'Boulangerie du quartier', '7 $'], ['Livraison à domicile', 'Commande de 75 $ et plus', 'gratuite']],
        sais: ['Arrivages', 'Pommes Honeycrisp, Courges, Champignons, Chou kale, Canneberges', 'Arrivages des fermes le mardi et le vendredi.'],
        whereTitle: 'Heures d’ouverture', where: [['Lundi – vendredi', '9 h – 20 h'], ['Samedi', '9 h – 18 h'], ['Dimanche', '10 h – 17 h']],
        order: ['Commander en ligne', 'Commander mon épicerie', 'Prête en 2 heures, ou livrée le lendemain.'],
        galTitle: 'Dans nos allées', gal: ['Légumes frais', 'Tomates du Québec', 'Choisir ses pommes', 'Pommes en vrac', 'Tomates biologiques', 'Notre équipe'],
        locTitle: 'L’épicerie', loc: ['4280, rue Saint-Denis, Montréal (Québec) H2J 2K8', 'Métro Mont-Royal · Stationnement pour vélos'], vid: 'Les arrivages du matin',
        rev: [['Julie M.', 'Cliente fidèle', 'Des produits frais et une équipe qui connaît chaque producteur.'], ['Marc-André P.', 'Livraison', 'Ma commande arrive toujours impeccable.']] },
      en: { id: ['The Green Basket', 'Organic grocery', 'Organic produce · Bulk foods · Local goods', 'Green Basket Co-op'], ct: ['+1 802 555-0172', 'hello@greenbasketcoop.com', 'greenbasketcoop.com'],
        about: ['The store', 'Over 1,500 certified organic products, 60% from Vermont farms. Bring your own jars: bulk foods are weighed at the register.'],
        prodTitle: 'Our staples', prod: [['Weekly box', 'Seasonal organic produce', '$35'], ['Bulk aisle', 'Grains, nuts, beans', 'by weight'], ['Sourdough bread', 'From our neighborhood bakery', '$7'], ['Home delivery', 'Orders over $75', 'free']],
        sais: ['Just in', 'Honeycrisp apples, Squash, Mushrooms, Kale, Cranberries', 'Farm deliveries on Tuesdays and Fridays.'],
        whereTitle: 'Opening hours', where: [['Monday – Friday', '9 a.m. – 8 p.m.'], ['Saturday', '9 a.m. – 6 p.m.'], ['Sunday', '10 a.m. – 5 p.m.']],
        order: ['Order online', 'Order my groceries', 'Ready in 2 hours, or delivered the next day.'],
        galTitle: 'In our aisles', gal: ['Fresh vegetables', 'Local tomatoes', 'Picking apples', 'Apples in bulk', 'Organic tomatoes', 'Our team'],
        locTitle: 'The store', loc: ['82 Church Street, Burlington, VT 05401', 'Downtown · Bike parking'], vid: 'Morning deliveries',
        rev: [['Julie M.', 'Regular customer', 'Fresh products and a team that knows every farmer.'], ['Mark P.', 'Delivery', 'My order always arrives in perfect shape.']] } },

    { id: 'kiosque', icon: 'store', rec: 'd16',
      n: ['Kiosque à la ferme', 'Farm stand'], ex: ['Vente directe aux clients', 'Direct sales to customers'],
      pal: [pal('Tomate', '#b91c1c', '#fde68a'), pal('Vert champ', '#4d7c0f', '#fef08a'), pal('Bois de grange', '#7c2d12', '#fcd34d'), pal('Ciel', '#0369a1', '#fde68a'), pal('Fraise', '#be123c', '#bbf7d0'), pal('Paille', '#a16207', '#14532d')],
      M: { cover: 33476, gal: [993, 994, 32465, 46563, 985, 3795], video: 993 },
      fr: { id: ['Kiosque Gagnon', 'Vente directe à la ferme', 'Fruits, légumes et produits de la ferme', 'Famille Gagnon'], ct: ['+1 450 555-0128', 'kiosque@fermegagnon.ca', 'fermegagnon.ca'],
        about: ['Le kiosque', 'De la ferme à votre panier, sans intermédiaire. Fraises, maïs, tomates et petits fruits cueillis le matin même, vendus au juste prix.'],
        prodTitle: 'À vendre au kiosque', prod: [['Fraises d’été', 'Casseau de 1 litre', '6 $'], ['Maïs sucré', 'La douzaine', '8 $'], ['Tomates des champs', 'Panier de 2 litres', '7 $'], ['Autocueillette', 'Fraises et bleuets', '4 $ / lb']],
        sais: ['Au kiosque cette semaine', 'Fraises, Maïs sucré, Tomates, Concombres, Fines herbes', 'Suivez notre page pour les arrivages du jour.'],
        whereTitle: 'Ouvert', where: [['Tous les jours', '8 h – 19 h'], ['Autocueillette', '8 h – 12 h, selon la météo'], ['Saison', 'Juin à octobre']],
        order: ['Réserver', 'Réserver mon panier', 'Réservez la veille, votre panier vous attend au kiosque.'],
        galTitle: 'Au kiosque', gal: ['Choisir ses fruits', 'Fines herbes du jour', 'Étals colorés', 'Cueillette des tomates', 'Directement du jardin', 'Le déjeuner de la ferme'],
        locTitle: 'Le kiosque', loc: ['845, rang Saint-Joseph, Sainte-Anne-des-Plaines (Québec) J5N 1A3', 'Grand stationnement · Paiement par carte accepté'], vid: 'Une journée au kiosque',
        rev: [['Nathalie R.', 'Cliente du samedi', 'Le meilleur maïs de la région, et toujours un sourire.'], ['Yannick D.', 'Autocueillette', 'Une sortie parfaite avec les enfants.']] },
      en: { id: ['Gagnon Farm Stand', 'Direct farm sales', 'Fruit, vegetables and farm goods', 'The Gagnon family'], ct: ['+1 518 555-0128', 'stand@gagnonfarm.com', 'gagnonfarm.com'],
        about: ['The stand', 'From our fields to your basket, with no middleman. Strawberries, corn, tomatoes and berries picked that morning, sold at a fair price.'],
        prodTitle: 'At the stand', prod: [['Summer strawberries', '1-quart box', '$6'], ['Sweet corn', 'By the dozen', '$8'], ['Field tomatoes', '2-quart basket', '$7'], ['Pick your own', 'Strawberries and blueberries', '$4 / lb']],
        sais: ['At the stand this week', 'Strawberries, Sweet corn, Tomatoes, Cucumbers, Herbs', 'Follow our page for today’s harvest.'],
        whereTitle: 'Open', where: [['Every day', '8 a.m. – 7 p.m.'], ['Pick your own', '8 a.m. – noon, weather permitting'], ['Season', 'June to October']],
        order: ['Reserve', 'Reserve my basket', 'Reserve the day before, your basket waits at the stand.'],
        galTitle: 'At the stand', gal: ['Choosing fruit', 'Today’s herbs', 'Colorful displays', 'Picking tomatoes', 'Straight from the garden', 'Farm breakfast'],
        locTitle: 'The stand', loc: ['845 County Route 9, Saratoga Springs, NY 12866', 'Large parking lot · Cards accepted'], vid: 'A day at the stand',
        rev: [['Natalie R.', 'Saturday customer', 'The best corn around, always with a smile.'], ['Ian D.', 'Pick your own', 'A perfect outing with the kids.']] } },

    { id: 'vignoble', icon: 'wine', rec: 'd7', tile: 'media/tiles/prod-vignoble.jpg',
      n: ['Vignoble et vente de vins', 'Winery'], ex: ['Vins du domaine, dégustations', 'Estate wines, tastings'],
      pal: [pal('Bordeaux', '#7f1d1d', '#e8c39e'), pal('Raisin', '#581c87', '#e9d5ff'), pal('Vert vigne', '#3f6212', '#e8c39e'), pal('Rosé', '#be185d', '#fde2e4'), pal('Chêne', '#78350f', '#fcd34d'), pal('Nuit', '#1e1b4b', '#c4b5fd')],
      M: { cover: 29340, gal: [24754, 17782, 29341, 24768, 12963, 22745], video: 29340 },
      fr: { id: ['Domaine des Côteaux', 'Vignoble', 'Vins rouges, blancs et rosés · Dégustations', 'Famille Bergeron'], ct: ['+1 450 555-0137', 'info@domainedescoteaux.ca', 'domainedescoteaux.ca'],
        about: ['Le domaine', 'Sur les coteaux de Dunham, nos 12 hectares de vignes donnent des vins vifs et fruités. Vente directe à la boutique du domaine et dégustation sur la terrasse.'],
        prodTitle: 'Nos vins', prod: [['Rouge du Côteau', 'Marquette, fruits noirs', '24 $'], ['Blanc des Pierres', 'Vidal, agrumes et pomme verte', '21 $'], ['Rosé d’été', 'Frontenac gris, fraise', '19 $'], ['Dégustation guidée', '5 vins, 45 minutes', '15 $']],
        sais: ['En ce moment', 'Vendanges, Nouveau rosé, Vin de glace, Visites guidées', 'Les vendanges ont lieu de mi-septembre à octobre.'],
        whereTitle: 'Boutique et dégustations', where: [['Mercredi – dimanche', '10 h – 18 h'], ['Visites guidées', 'Samedi et dimanche, 14 h'], ['Hiver', 'Sur rendez-vous']],
        order: ['Boutique en ligne', 'Commander nos vins', 'Livraison partout au Québec, ou cueillette au domaine.'],
        galTitle: 'Au domaine', gal: ['Choisir les grappes', 'Raisins au lever du soleil', 'Les vendanges', 'Un verre au vignoble', 'Conseils à la boutique', 'Le bouchon saute'],
        locTitle: 'Le domaine', loc: ['3150, chemin Bruce, Dunham (Québec) J0E 1M0', 'Route des vins des Cantons-de-l’Est · Terrasse'], vid: 'Entre les rangs de vigne',
        rev: [['Sophie L.', 'Dégustation', 'Accueil chaleureux, le rosé est un coup de cœur.'], ['Daniel T.', 'Visite guidée', 'On apprend tout sur la vigne au Québec.']] },
      en: { id: ['Hillside Vineyards', 'Winery', 'Red, white and rosé wines · Tastings', 'The Bergeron family'], ct: ['+1 607 555-0137', 'info@hillsidevineyards.com', 'hillsidevineyards.com'],
        about: ['The estate', 'On the slopes above Seneca Lake, our 30 acres of vines make crisp, fruit-forward wines. Buy direct at the estate shop and taste on the terrace.'],
        prodTitle: 'Our wines', prod: [['Hillside Red', 'Cabernet franc, dark fruit', '$24'], ['Stone White', 'Riesling, citrus and green apple', '$21'], ['Summer Rosé', 'Pinot noir, strawberry', '$19'], ['Guided tasting', '5 wines, 45 minutes', '$15']],
        sais: ['Right now', 'Harvest, New rosé, Ice wine, Guided tours', 'Harvest runs from mid-September through October.'],
        whereTitle: 'Shop and tastings', where: [['Wednesday – Sunday', '10 a.m. – 6 p.m.'], ['Guided tours', 'Saturday and Sunday, 2 p.m.'], ['Winter', 'By appointment']],
        order: ['Online shop', 'Order our wines', 'Shipping to most states, or pick up at the estate.'],
        galTitle: 'At the estate', gal: ['Choosing the grapes', 'Grapes at sunrise', 'Harvest time', 'A glass in the vineyard', 'Advice in the shop', 'Pop the cork'],
        locTitle: 'The estate', loc: ['3150 State Route 14, Geneva, NY 14456', 'Seneca Lake Wine Trail · Terrace'], vid: 'Between the vine rows',
        rev: [['Sophie L.', 'Tasting', 'Warm welcome, the rosé is a favorite.'], ['Dan T.', 'Guided tour', 'We learned everything about Finger Lakes wine.']] } },

    { id: 'oeufs', icon: 'egg', rec: 'd2',
      n: ['Œufs fermiers', 'Farm-fresh eggs'], ex: ['Poules en liberté, vente directe', 'Free-range hens, direct sales'],
      pal: [pal('Jaune d’œuf', '#b45309', '#fef3c7'), pal('Vert pré', '#4d7c0f', '#fde68a'), pal('Rouge grange', '#991b1b', '#fef3c7'), pal('Bleu œuf', '#0e7490', '#fde68a'), pal('Paille', '#a16207', '#365314'), pal('Brun', '#78350f', '#fed7aa')],
      M: { cover: 46933, gal: [9422, 45326, 45542, 47368, 11225, 46054], video: 46933 },
      fr: { id: ['Ferme La Poulette', 'Œufs de poules en liberté', 'Œufs frais · Poules élevées au grand air', 'Famille Lévesque'], ct: ['+1 819 555-0119', 'oeufs@lapoulette.ca', 'lapoulette.ca'],
        about: ['La ferme', 'Nos 600 poules vivent au grand air et mangent des grains cultivés sur la ferme. Les œufs sont ramassés chaque matin et vendus dans les 48 heures.'],
        prodTitle: 'Nos œufs', prod: [['Douzaine', 'Gros œufs bruns', '7 $'], ['Plateau de 30', 'Pour les familles et la pâtisserie', '16 $'], ['Abonnement', '2 douzaines par semaine, livrées', '13 $ / sem.'], ['Poules pondeuses', 'Pour votre basse-cour', '25 $']],
        sais: ['Disponible', 'Œufs du jour, Plateaux de 30, Œufs de cane, Poulets de grain', 'Œufs de cane offerts au printemps seulement.'],
        whereTitle: 'Où acheter nos œufs', where: [['Libre-service à la ferme', 'Tous les jours, 7 h – 20 h'], ['Samedi', 'Marché de Sherbrooke · 8 h – 13 h'], ['Mercredi', 'Livraison des abonnements']],
        order: ['Abonnement', 'M’abonner aux œufs', 'Livraison chaque mercredi dans un rayon de 30 km.'],
        galTitle: 'À la ferme', gal: ['Des œufs bien frais', 'Nos poules', 'Au grand air', 'Le coq de la ferme', 'À l’abreuvoir', 'Tri des œufs'],
        locTitle: 'Le libre-service', loc: ['2210, chemin de la Rivière, Compton (Québec) J0B 1L0', 'Libre-service à l’entrée · Paiement comptant ou virement'], vid: 'La récolte du matin',
        rev: [['Chantal B.', 'Abonnée', 'Des jaunes bien orangés, on sent la différence.'], ['Éric P.', 'Libre-service', 'Pratique et toujours bien approvisionné.']] },
      en: { id: ['Little Hen Farm', 'Free-range eggs', 'Fresh eggs · Pasture-raised hens', 'The Levesque family'], ct: ['+1 207 555-0119', 'eggs@littlehenfarm.com', 'littlehenfarm.com'],
        about: ['The farm', 'Our 600 hens roam outdoors and eat grain grown on the farm. Eggs are gathered every morning and sold within 48 hours.'],
        prodTitle: 'Our eggs', prod: [['One dozen', 'Large brown eggs', '$7'], ['Flat of 30', 'For families and baking', '$16'], ['Subscription', '2 dozen a week, delivered', '$13 / wk'], ['Laying hens', 'For your backyard flock', '$25']],
        sais: ['Available', 'Today’s eggs, Flats of 30, Duck eggs, Grain-fed chicken', 'Duck eggs in spring only.'],
        whereTitle: 'Where to buy', where: [['Self-serve farm stand', 'Every day, 7 a.m. – 8 p.m.'], ['Saturday', 'Portland Farmers’ Market · 8 a.m. – 1 p.m.'], ['Wednesday', 'Subscription delivery']],
        order: ['Subscription', 'Subscribe to eggs', 'Delivered every Wednesday within 20 miles.'],
        galTitle: 'On the farm', gal: ['Fresh eggs', 'Our hens', 'Out in the open', 'The farm rooster', 'At the waterer', 'Sorting eggs'],
        locTitle: 'Self-serve stand', loc: ['2210 River Road, Freeport, ME 04032', 'Self-serve at the gate · Cash or Venmo'], vid: 'Morning collection',
        rev: [['Chantal B.', 'Subscriber', 'Deep orange yolks, you can taste the difference.'], ['Eric P.', 'Farm stand', 'Convenient and always well stocked.']] } },

    { id: 'charcuterie', icon: 'beef', rec: 'd9',
      n: ['Charcuterie et boucherie', 'Butcher & charcuterie'], ex: ['Saucisses, viandes fumées, boucherie', 'Sausages, smoked meats, butchery'],
      pal: [pal('Rouge boucher', '#991b1b', '#fde68a'), pal('Fumé', '#44403c', '#f59e0b'), pal('Bordeaux', '#7f1d1d', '#e8c39e'), pal('Vert sapin', '#14532d', '#fcd34d'), pal('Noir', '#18181b', '#ef4444'), pal('Cuivre', '#9a3412', '#fef3c7')],
      M: { cover: 47411, gal: [32383, 46669, 36198, 26368, 15488, 17530], video: 36198 },
      fr: { id: ['Boucherie Tremblay', 'Charcuterie artisanale', 'Saucisses maison · Viandes fumées · Coupes sur mesure', 'Maison Tremblay'], ct: ['+1 418 555-0151', 'info@boucherietremblay.ca', 'boucherietremblay.ca'],
        about: ['La maison', 'Viandes de fermes du Québec, découpées à la main. Nos saucisses, notre bacon et notre jambon sont fumés sur place au bois d’érable, selon les recettes de la famille.'],
        prodTitle: 'Au comptoir', prod: [['Saucisses maison', '12 saveurs, au kilo', '18 $ / kg'], ['Bacon fumé à l’érable', 'Tranché épais', '24 $ / kg'], ['Plateau de charcuteries', 'Pour 6 à 8 personnes', '65 $'], ['Boîte BBQ', 'Steaks, saucisses, côtes levées', '120 $']],
        sais: ['Cette semaine', 'Saucisses BBQ, Jambon fumé, Pâtés maison, Tourtières', 'Commandez vos tourtières des Fêtes avant le 15 décembre.'],
        whereTitle: 'Heures du comptoir', where: [['Mardi – mercredi', '9 h – 18 h'], ['Jeudi – vendredi', '9 h – 20 h'], ['Samedi', '8 h – 17 h']],
        order: ['Précommande', 'Commander mes viandes', 'Commandez en ligne, cueillette au comptoir le jour même.'],
        galTitle: 'Au comptoir', gal: ['Nos saucisses', 'Plateau de charcuteries', 'Coupe à la main', 'Saucisse fumée', 'Tranché minute', 'Sur le gril'],
        locTitle: 'La boucherie', loc: ['1075, avenue Cartier, Québec (Québec) G1R 2S6', 'Quartier Montcalm · Stationnement dans la rue'], vid: 'Le savoir-faire du boucher',
        rev: [['Patrick G.', 'Client du samedi', 'Les meilleures saucisses de Québec, sans hésiter.'], ['Annie L.', 'Plateau de charcuteries', 'Superbe présentation, tout le monde a adoré.']] },
      en: { id: ['Tremblay Butcher Shop', 'Artisan charcuterie', 'House sausages · Smoked meats · Custom cuts', 'Tremblay & Sons'], ct: ['+1 414 555-0151', 'info@tremblaybutcher.com', 'tremblaybutcher.com'],
        about: ['The shop', 'Meat from Wisconsin farms, cut by hand. Our sausages, bacon and ham are smoked in-house over maple wood, from family recipes.'],
        prodTitle: 'At the counter', prod: [['House sausages', '12 flavors, by the pound', '$8 / lb'], ['Maple-smoked bacon', 'Thick cut', '$11 / lb'], ['Charcuterie board', 'Serves 6 to 8', '$65'], ['BBQ box', 'Steaks, sausages, ribs', '$120']],
        sais: ['This week', 'BBQ sausages, Smoked ham, House pâtés, Meat pies', 'Order holiday hams before December 15.'],
        whereTitle: 'Counter hours', where: [['Tuesday – Wednesday', '9 a.m. – 6 p.m.'], ['Thursday – Friday', '9 a.m. – 8 p.m.'], ['Saturday', '8 a.m. – 5 p.m.']],
        order: ['Pre-order', 'Order my meats', 'Order online, same-day pickup at the counter.'],
        galTitle: 'At the counter', gal: ['Our sausages', 'Charcuterie board', 'Cut by hand', 'Smoked sausage', 'Sliced to order', 'On the grill'],
        locTitle: 'The shop', loc: ['1075 North Water Street, Milwaukee, WI 53202', 'Third Ward · Street parking'], vid: 'The butcher’s craft',
        rev: [['Patrick G.', 'Saturday regular', 'Best sausages in Milwaukee, hands down.'], ['Annie L.', 'Charcuterie board', 'Beautiful board, everyone loved it.']] } },

    { id: 'brasserie', icon: 'beer', rec: 'd5',
      n: ['Microbrasserie', 'Craft brewery'], ex: ['Bières brassées sur place, vente directe', 'Beer brewed on site, direct sales'],
      pal: [pal('Ambrée', '#b45309', '#fde68a'), pal('Houblon', '#3f6212', '#fcd34d'), pal('Stout', '#1c1917', '#f59e0b'), pal('Rousse', '#9a3412', '#fef3c7'), pal('Bleu malt', '#1e3a8a', '#fbbf24'), pal('Cuivre', '#7c2d12', '#fdba74')],
      M: { cover: 1433, gal: [1432, 1414, 1409, 1426, 1403, 1421], video: 1421 },
      fr: { id: ['Brasserie du Quai', 'Microbrasserie', 'Bières de micro brassées sur place · Salle de dégustation', 'Brasserie du Quai inc.'], ct: ['+1 418 555-0184', 'salut@brasserieduquai.ca', 'brasserieduquai.ca'],
        about: ['La brasserie', 'Nous brassons nos bières sur place avec de l’orge maltée et du houblon du Québec. Achetez nos canettes à la boutique ou goûtez-les fraîches, directement de la cuve.'],
        prodTitle: 'Nos bières', prod: [['Blonde du Quai', 'Légère et désaltérante, 4,5 %', '4 $'], ['IPA de la Baie', 'Houblonnée, agrumes, 6,2 %', '5 $'], ['Stout à l’érable', 'Ronde et torréfiée, 7 %', '5 $'], ['Caisse de 12', 'Choix du brasseur', '48 $']],
        sais: ['En fût en ce moment', 'Saison aux framboises, Lager d’automne, Stout à l’érable, IPA sèche', 'Nouvelle bière chaque mois.'],
        whereTitle: 'Boutique et salle de dégustation', where: [['Jeudi', '15 h – 22 h'], ['Vendredi – samedi', '12 h – minuit'], ['Dimanche', '12 h – 20 h']],
        order: ['Boutique en ligne', 'Commander nos bières', 'Cueillette à la brasserie ou livraison locale.'],
        galTitle: 'À la brasserie', gal: ['Nos malts', 'L’orge à la cuve', 'Le brasseur', 'Au robinet', 'Servie fraîche', 'Directement de la cuve'],
        locTitle: 'La brasserie', loc: ['90, rue du Quai, Rivière-du-Loup (Québec) G5R 1A6', 'Terrasse sur le fleuve · Vue sur le quai'], vid: 'De la cuve au verre',
        rev: [['Maxime T.', 'Salle de dégustation', 'La stout à l’érable vaut le détour.'], ['Isabelle C.', 'Visite de groupe', 'Accueil génial et vue magnifique sur le fleuve.']] },
      en: { id: ['Harbor Brewing Co.', 'Craft brewery', 'Beer brewed on site · Taproom', 'Harbor Brewing Company'], ct: ['+1 616 555-0184', 'hello@harborbrewing.com', 'harborbrewing.com'],
        about: ['The brewery', 'We brew on site with Michigan malted barley and hops. Buy our cans in the shop or taste them fresh, straight from the tank.'],
        prodTitle: 'Our beers', prod: [['Harbor Blonde', 'Light and refreshing, 4.5%', '$4'], ['Bay IPA', 'Hoppy, citrus, 6.2%', '$5'], ['Maple Stout', 'Smooth and roasty, 7%', '$5'], ['12-pack', 'Brewer’s choice', '$48']],
        sais: ['On tap now', 'Raspberry saison, Fall lager, Maple stout, Dry IPA', 'A new beer every month.'],
        whereTitle: 'Shop and taproom', where: [['Thursday', '3 p.m. – 10 p.m.'], ['Friday – Saturday', 'noon – midnight'], ['Sunday', 'noon – 8 p.m.']],
        order: ['Online shop', 'Order our beers', 'Pick up at the brewery or local delivery.'],
        galTitle: 'At the brewery', gal: ['Our malts', 'Barley in the tank', 'The brewer', 'On tap', 'Served fresh', 'Straight from the tank'],
        locTitle: 'The brewery', loc: ['90 Harbor Drive, Grand Haven, MI 49417', 'Patio on the lake · Harbor view'], vid: 'From tank to glass',
        rev: [['Max T.', 'Taproom', 'The maple stout is worth the trip.'], ['Isabel C.', 'Group tour', 'Great welcome and a beautiful lake view.']] } },

    { id: 'boulangerie', icon: 'croissant', rec: 'd16',
      n: ['Boulangerie artisanale', 'Artisan bakery'], ex: ['Pains au levain, viennoiseries', 'Sourdough bread, pastries'],
      pal: [pal('Croûte', '#92400e', '#fde68a'), pal('Farine', '#57534e', '#fcd34d'), pal('Blé', '#a16207', '#fef3c7'), pal('Chocolat', '#3f2a1d', '#f5d0a9'), pal('Bleu tablier', '#1e40af', '#fde68a'), pal('Vert olive', '#4d5b1f', '#fde68a')],
      M: { cover: 21927, gal: [19165, 43903, 42467, 42464, 4866, 21927], video: 42467 },
      fr: { id: ['Boulangerie Le Levain', 'Boulangerie artisanale', 'Pains au levain · Viennoiseries · Farines du Québec', 'Le Levain'], ct: ['+1 514 555-0166', 'bonjour@lelevain.ca', 'lelevain.ca'],
        about: ['La boulangerie', 'Nos pains fermentent 24 heures et cuisent sur la sole, avec des farines biologiques moulues sur pierre au Québec. Viennoiseries pur beurre tous les matins.'],
        prodTitle: 'Nos pains', prod: [['Miche au levain', '1 kg, croûte épaisse', '9 $'], ['Baguette de tradition', 'Cuite toutes les 2 heures', '4 $'], ['Croissant pur beurre', 'Feuilleté maison', '3,25 $'], ['Abonnement pain', 'Un pain par semaine', '30 $ / mois']],
        sais: ['Ce mois-ci', 'Pain aux noix, Brioche aux pommes, Pain de seigle, Chaussons', 'Pain du jour annoncé chaque matin sur notre page.'],
        whereTitle: 'Heures d’ouverture', where: [['Mardi – vendredi', '7 h – 18 h'], ['Samedi – dimanche', '7 h – 16 h'], ['Lundi', 'Fermé']],
        order: ['Commande', 'Réserver mon pain', 'Commandez la veille avant 16 h, votre pain est mis de côté.'],
        galTitle: 'Au fournil', gal: ['Le pain et le blé', 'Tranché pour vous', 'Pétrir à la main', 'La farine', 'Le déjeuner', 'Notre comptoir'],
        locTitle: 'La boulangerie', loc: ['5210, boulevard Saint-Laurent, Montréal (Québec) H2T 1S1', 'Mile End · Quelques places assises'], vid: 'Le pétrissage du matin',
        rev: [['Camille R.', 'Cliente du matin', 'La miche au levain est la meilleure du quartier.'], ['Hugo M.', 'Abonnement', 'Un pain parfait chaque semaine.']] },
      en: { id: ['The Rising Loaf', 'Artisan bakery', 'Sourdough breads · Pastries · Local flours', 'The Rising Loaf'], ct: ['+1 503 555-0166', 'hello@therisingloaf.com', 'therisingloaf.com'],
        about: ['The bakery', 'Our loaves ferment for 24 hours and bake on the hearth, with organic stone-ground flour from Oregon. All-butter pastries every morning.'],
        prodTitle: 'Our breads', prod: [['Sourdough country loaf', '2 lb, thick crust', '$9'], ['Baguette', 'Baked every 2 hours', '$4'], ['Butter croissant', 'Laminated in-house', '$3.75'], ['Bread subscription', 'One loaf a week', '$30 / month']],
        sais: ['This month', 'Walnut bread, Apple brioche, Rye bread, Turnovers', 'Daily bread posted every morning on our page.'],
        whereTitle: 'Opening hours', where: [['Tuesday – Friday', '7 a.m. – 6 p.m.'], ['Saturday – Sunday', '7 a.m. – 4 p.m.'], ['Monday', 'Closed']],
        order: ['Order', 'Reserve my bread', 'Order by 4 p.m. the day before, we set your loaf aside.'],
        galTitle: 'In the bakery', gal: ['Bread and wheat', 'Sliced for you', 'Kneaded by hand', 'The flour', 'Breakfast', 'Our counter'],
        locTitle: 'The bakery', loc: ['5210 SE Division Street, Portland, OR 97206', 'Division · A few seats inside'], vid: 'Morning kneading',
        rev: [['Camille R.', 'Morning regular', 'The sourdough is the best in the neighborhood.'], ['Hugo M.', 'Subscription', 'A perfect loaf every week.']] } },

    { id: 'fromagerie', icon: 'milk', rec: 'd2',
      n: ['Fromagerie', 'Cheese shop'], ex: ['Fromages fermiers, lait cru', 'Farmstead cheeses'],
      pal: [pal('Crème', '#a16207', '#fef3c7'), pal('Vert pâturage', '#3f6212', '#fde68a'), pal('Bleu fromager', '#1e3a8a', '#fef3c7'), pal('Croûte', '#92400e', '#fde68a'), pal('Ardoise', '#334155', '#fcd34d'), pal('Bordeaux', '#7f1d1d', '#fef3c7')],
      M: { cover: 22034, gal: [46488, 26639, 22743, 9421, 9396, 22746], video: 46488 },
      fr: { id: ['Fromagerie du Vieux Moulin', 'Fromagerie fermière', 'Fromages au lait cru · Affinage sur place', 'Famille Côté'], ct: ['+1 819 555-0143', 'info@vieuxmoulin.ca', 'fromagerievieuxmoulin.ca'],
        about: ['La fromagerie', 'Le lait de nos 40 vaches est transformé le jour même. Nos fromages s’affinent dans la cave du vieux moulin, de 2 à 24 mois.'],
        prodTitle: 'Nos fromages', prod: [['Le Meunier', 'Pâte ferme, affiné 6 mois', '42 $ / kg'], ['Le Doux Pré', 'Croûte fleurie, crémeux', '12 $ / 200 g'], ['Le Bleu du Moulin', 'Pâte persillée', '48 $ / kg'], ['Plateau découverte', '5 fromages, pour 6 personnes', '55 $']],
        sais: ['À la fromagerie', 'Fromage en grains frais, Cheddar 2 ans, Raclette, Beurre de baratte', 'Fromage en grains frais tous les jours à 11 h.'],
        whereTitle: 'Boutique de la fromagerie', where: [['Tous les jours', '9 h – 18 h'], ['Visite de la cave', 'Samedi, 11 h'], ['Marché de Saint-Hyacinthe', 'Samedi, 8 h – 13 h']],
        order: ['Commande', 'Commander nos fromages', 'Plateaux et paniers-cadeaux sur commande, 48 h à l’avance.'],
        galTitle: 'À la fromagerie', gal: ['La fabrication', 'Plateau de fromages', 'Vin et fromage', 'Fromage râpé', 'Le cheddar', 'Accords mets et vins'],
        locTitle: 'La fromagerie', loc: ['480, rang du Moulin, Warwick (Québec) J0A 1M0', 'Route des fromages · Grand stationnement'], vid: 'Le fromager à l’œuvre',
        rev: [['Geneviève H.', 'Visite de la cave', 'Passionnant, et le Meunier est délicieux.'], ['Robert L.', 'Plateau découverte', 'Parfait pour recevoir, très généreux.']] },
      en: { id: ['Old Mill Creamery', 'Farmstead creamery', 'Raw-milk cheeses · Aged on site', 'The Cote family'], ct: ['+1 802 555-0143', 'info@oldmillcreamery.com', 'oldmillcreamery.com'],
        about: ['The creamery', 'Milk from our 40 cows is made into cheese the same day. Our wheels age in the old mill cellar for 2 to 24 months.'],
        prodTitle: 'Our cheeses', prod: [['The Miller', 'Firm, aged 6 months', '$19 / lb'], ['Sweet Meadow', 'Bloomy rind, creamy', '$12 / 7 oz'], ['Mill Blue', 'Blue-veined', '$22 / lb'], ['Discovery board', '5 cheeses, serves 6', '$55']],
        sais: ['At the creamery', 'Fresh cheese curds, 2-year cheddar, Raclette, Cultured butter', 'Fresh curds every day at 11 a.m.'],
        whereTitle: 'Creamery shop', where: [['Every day', '9 a.m. – 6 p.m.'], ['Cellar tour', 'Saturday, 11 a.m.'], ['Burlington market', 'Saturday, 8 a.m. – 1 p.m.']],
        order: ['Order', 'Order our cheeses', 'Boards and gift baskets to order, 48 hours ahead.'],
        galTitle: 'At the creamery', gal: ['Making cheese', 'Cheese board', 'Wine and cheese', 'Grated cheese', 'The cheddar', 'Food and wine pairing'],
        locTitle: 'The creamery', loc: ['480 Mill Road, Shelburne, VT 05482', 'Vermont Cheese Trail · Large parking lot'], vid: 'The cheesemaker at work',
        rev: [['Jennifer H.', 'Cellar tour', 'Fascinating, and The Miller is delicious.'], ['Robert L.', 'Discovery board', 'Perfect for guests, very generous.']] } },

    { id: 'miel', icon: 'hexagon', rec: 'd4',
      n: ['Miellerie', 'Honey farm'], ex: ['Miel, ruches, produits de la ruche', 'Honey, hives, bee products'],
      pal: [pal('Miel doré', '#b45309', '#fef08a'), pal('Ruche', '#a16207', '#1c1917'), pal('Lavande', '#6d28d9', '#fde68a'), pal('Vert trèfle', '#3f6212', '#fde047'), pal('Cire', '#92400e', '#fef3c7'), pal('Noir abeille', '#18181b', '#facc15')],
      M: { cover: 8595, gal: [4777, 25173, 8596, 46375, 2801, 14749], video: 25146 },
      fr: { id: ['Miellerie des Prés', 'Apiculteurs', 'Miel brut · Rayons de miel · Visites des ruches', 'Famille Ouellet'], ct: ['+1 450 555-0158', 'miel@mielleriedespres.ca', 'mielleriedespres.ca'],
        about: ['La miellerie', 'Nos 300 ruches butinent les trèfles et les fleurs sauvages de la Montérégie. Notre miel est extrait à froid et mis en pot à la miellerie, sans aucun mélange.'],
        prodTitle: 'Nos produits', prod: [['Miel de trèfle', 'Pot de 500 g', '12 $'], ['Miel de fleurs sauvages', 'Pot de 500 g', '13 $'], ['Rayon de miel', 'Cadre de 400 g', '18 $'], ['Chandelles de cire', 'Lot de 2', '15 $']],
        sais: ['À la boutique', 'Miel crémeux, Miel de sarrasin, Propolis, Visite des ruches', 'Visites des ruches de juin à août.'],
        whereTitle: 'Boutique et visites', where: [['Jeudi – dimanche', '10 h – 17 h'], ['Visite des ruches', 'Samedi, 10 h et 14 h'], ['Hiver', 'Boutique en ligne seulement']],
        order: ['Boutique en ligne', 'Commander notre miel', 'Expédition partout au Canada en 3 jours.'],
        galTitle: 'Au rucher', gal: ['Nos abeilles', 'L’entrée de la ruche', 'Le rucher', 'Le rayon de miel', 'Miel à la cuillère', 'Mise en pot'],
        locTitle: 'La miellerie', loc: ['1520, rang des Prés, Saint-Paul-d’Abbotsford (Québec) J0E 1A0', 'Boutique à la ferme · Visites sur réservation'], vid: 'Au cœur de la ruche',
        rev: [['Mélanie F.', 'Visite des ruches', 'Les enfants ont adoré, et le miel est exceptionnel.'], ['Jacques B.', 'Client fidèle', 'Le miel de sarrasin est mon préféré.']] },
      en: { id: ['Meadow Honey Farm', 'Beekeepers', 'Raw honey · Honeycomb · Hive tours', 'The Ouellet family'], ct: ['+1 413 555-0158', 'honey@meadowhoneyfarm.com', 'meadowhoneyfarm.com'],
        about: ['The honey house', 'Our 300 hives forage clover and wildflowers across the Pioneer Valley. Our honey is cold-extracted and jarred on the farm, never blended.'],
        prodTitle: 'Our products', prod: [['Clover honey', '1 lb jar', '$12'], ['Wildflower honey', '1 lb jar', '$13'], ['Honeycomb', '14 oz frame', '$18'], ['Beeswax candles', 'Set of 2', '$15']],
        sais: ['In the shop', 'Creamed honey, Buckwheat honey, Propolis, Hive tours', 'Hive tours from June to August.'],
        whereTitle: 'Shop and tours', where: [['Thursday – Sunday', '10 a.m. – 5 p.m.'], ['Hive tours', 'Saturday, 10 a.m. and 2 p.m.'], ['Winter', 'Online shop only']],
        order: ['Online shop', 'Order our honey', 'Ships anywhere in the U.S. in 3 days.'],
        galTitle: 'At the apiary', gal: ['Our bees', 'The hive entrance', 'The apiary', 'Honeycomb', 'Honey on a spoon', 'Jarring'],
        locTitle: 'The honey house', loc: ['1520 Meadow Road, Amherst, MA 01002', 'Farm shop · Tours by reservation'], vid: 'Inside the hive',
        rev: [['Melanie F.', 'Hive tour', 'The kids loved it, and the honey is exceptional.'], ['Jack B.', 'Regular', 'The buckwheat honey is my favorite.']] } },
  ];

  const sec = NFC.SECTORS.find((s) => s.id === 'producteurs');
  if (sec && sec.demo) {
    const keepMedia = NFC.MEDIA.producteurs;
    sec.profiles = PROD.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, tile: p.tile, demo: sec.demo, demoEn: sec.demoEn, palettes: sec.palettes, rec: sec.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, tile: p.tile, rec: p.rec, palettes: p.pal,
        demo: build(sec.demo, p.M, p.fr), demoEn: build(sec.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    sec.ex = 'Maraîcher, épicerie bio, vignoble, œufs, charcuterie, miel…';
  }
})();
