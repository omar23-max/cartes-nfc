/* Métiers du secteur « Restaurant, café et bar » (10 métiers). Même principe que profiles.js.
   Le secteur reçoit trois sections de plus : Le chef (photo + parcours), Animations et soirées, L’équipe,
   et chaque métier un carrousel vidéo. Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/restaurant/';
  const im = (id) => F + id + '.jpg';
  const vd = (id) => F + 'v' + id + '.mp4';

  const resto = NFC.SECTORS.find((s) => s.id === 'restaurant');
  if (!resto || !resto.demo) return;

  /* ---------- Nouvelles sections du secteur ---------- */
  const at = (key) => resto.blocks.findIndex((b) => b.key === key) + 1;
  resto.blocks.splice(at('menu'), 0, { key: 'chef', type: 'chef', title: 'Le chef', help: 'Photo, présentation et parcours' });
  resto.blocks.splice(at('gallery'), 0, { key: 'events', type: 'cards', title: 'Animations et soirées', price: true, help: 'Concerts, soirées à thème : la date s’affiche sur la photo' });
  resto.blocks.splice(at('order'), 0, { key: 'team', type: 'cards', title: 'L’équipe', price: false });

  /* Applique les données propres à une langue (chef, soirées, équipe, vidéos) */
  function extras(d, M, L) {
    const b = d.blocks;
    b.chef = { on: true, title: L.chef[0], photo: im(M.chef), name: L.chef[1], role: L.chef[2], text: L.chef[3], items: L.chef[4].map(([t, dd]) => ({ t, d: dd, p: '' })) };
    b.events = { on: true, title: L.evTitle, items: L.ev.map(([t, dd, p], i) => ({ t, d: dd, p, img: im(M.ev[i]), url: '' })) };
    b.team = { on: true, title: L.teamTitle || '', items: L.team.map(([t, dd], i) => ({ t, d: dd, p: '', img: im(M.team[i]), url: '' })) };
    d.custom = [{ cid: 'restovid', type: 'vidcar', title: L.vidTitle, on: true, videos: M.vids.map((id, i) => ({ url: '', src: vd(id), cover: im(id), cap: L.vids[i] })) }];
    d.order = ['b:about', 'b:menu', 'b:chef', 'c:restovid', 'b:gallery', 'b:events', 'b:booking', 'b:order', 'b:team', 'b:reviews', 'b:hours', 'b:location', 'b:video', 'b:contact'];
    return d;
  }

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty] = L.id;
    Object.assign(d.identity, { name, role, specialty, company: '', photo: im(M.portrait), cover: im(M.cover), logo: '', coverType: 'video', coverVideo: vd(M.vids[0]) });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/', tiktok: L.tiktok ? 'https://tiktok.com/' : '' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    b.menu = { on: true, title: L.menuTitle || '', note: L.note, cats: L.menu.map(([nm, desc, items]) => ({ name: nm, desc, items: items.map(([t, dd, p, bd]) => ({ t, d: dd, p, b: bd || '' })) })) };
    Object.assign(b.gallery, { on: true, title: L.galTitle || '', images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    const [provider, url, label, text] = L.book;
    Object.assign(b.booking, { on: true, mode: 'tool', provider, url, label, text, email });
    Object.assign(b.order, { on: !!L.order, label: L.order ? L.order[0] : '', url: L.order ? L.order[1] : '', text: L.order ? L.order[2] : '' });
    Object.assign(b.hours, { on: true, rows: L.hours.map(([dd, h]) => ({ d: dd, h })), note: L.hoursNote || '' });
    Object.assign(b.location, { on: true, title: L.locTitle || '', address: L.loc[0], access: L.loc[1] });
    Object.assign(b.video, { on: false, url: '', src: vd(M.vids[1]), cover: im(M.vids[1]), cap: L.vids[1] });
    Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    return extras(d, M, L);
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.team.map(im),
    video: { src: vd(M.vids[0]), poster: im(M.vids[0]), cap: L.vids[0] },
  });

  /* ---------- Le bistro d’origine reçoit aussi le chef, les soirées, l’équipe et les vidéos ---------- */
  const BISTRO_M = { chef: 39535, ev: [646, 50326], team: [24405, 15875], vids: [39535, 4672] };
  extras(resto.demo, BISTRO_M, {
    chef: ['Le chef', 'Ethan Brooks', 'Chef propriétaire', 'Formé dans les cuisines de Montréal et de Lyon, Ethan cuisine le marché du jour avec une seule règle : le produit d’abord.', [['2012', 'Diplômé de l’ITHQ'], ['2014 – 2017', 'Second de cuisine, bistro étoilé à Lyon'], ['2019', 'Ouverture du Comptoir des Halles'], ['2024', 'Coup de cœur du guide Montréal Gourmand']]],
    evTitle: 'Animations et soirées', ev: [['Jeudis jazz', 'Trio en salle, menu du marché', 'Jeu. 19 h'], ['Soirée chanson québécoise', 'Une voix, une guitare, la terrasse', 'Sam. 20 h']],
    team: [['Léa', 'Maître d’hôtel'], ['La brigade', 'Six passionnés en cuisine']],
    vidTitle: 'En cuisine', vids: ['Le chef au passe', 'Service en salle'],
  });
  extras(resto.demoEn, BISTRO_M, {
    chef: ['The chef', 'Ethan Brooks', 'Chef & owner', 'Trained in kitchens in Montreal and Lyon, Ethan cooks the day’s market with one rule: ingredients first.', [['2012', 'Culinary school graduate'], ['2014 – 2017', 'Sous-chef at a Michelin-starred bistro in Lyon'], ['2019', 'Opened Le Comptoir des Halles'], ['2024', 'Featured in the city’s best new bistros list']]],
    evTitle: 'Events & live music', ev: [['Jazz Thursdays', 'Live trio, market menu', 'Thu 7 p.m.'], ['Acoustic night', 'One voice, one guitar, on the patio', 'Sat 8 p.m.']],
    team: [['Leah', 'Maître d’'], ['The kitchen crew', 'Six passionate cooks']],
    vidTitle: 'In the kitchen', vids: ['The chef at the pass', 'Dinner service'],
  });

  const RESTO = [
    { id: 'bistro', icon: 'utensils-crossed', keep: true, n: ['Bistro', 'Bistro'], ex: ['Cuisine du marché, terrasse', 'Market cuisine, patio'] },

    { id: 'gastro', icon: 'chef-hat', rec: 'd10',
      n: ['Restaurant gastronomique', 'Fine dining'], ex: ['Menu dégustation, accords mets-vins', 'Tasting menu, wine pairing'],
      pal: [pal('Noir & or', '#1c1917', '#c9a227'), pal('Bordeaux', '#6b1d2a', '#e8c39e'), pal('Bleu minuit', '#1e2a4a', '#d8b46a'), pal('Vert sapin', '#1f4d3a', '#e6d3a3'), pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Encre', '#1f2937', '#fbbf24')],
      M: { portrait: 2430, cover: 4118, gal: [26573, 47410, 45725, 12932, 15788, 22746], chef: 39535, ev: [50307, 43744], team: [13070, 22314], vids: [4118, 15788] },
      fr: { id: ['Maison Laurier', 'Restaurant gastronomique', 'Menu dégustation · Accords mets-vins'], ct: ['+1 418 555-0102', 'reservations@maisonlaurier.ca', 'maisonlaurier.ca'],
        about: ['La maison', 'Douze tables, une cuisine ouverte et un menu dégustation qui change avec les saisons québécoises. Notre sommelière compose un accord pour chaque service.'],
        menuTitle: 'Menu dégustation', note: 'Menu servi à toute la table. Avisez-nous de vos allergies lors de la réservation.',
        menu: [['Menu en sept services', 'Selon l’arrivage du jour', [['Huître de l’Île-du-Prince-Édouard', 'Granité de concombre, aneth', '', 'Signature'], ['Pétoncle des Îles-de-la-Madeleine', 'Beurre noisette, chou-fleur rôti', ''], ['Agneau de Charlevoix', 'Jus réduit, panais, ail noir', ''], ['Sphère au chocolat', 'Cerises de terre, crème fumée', '', 'Signature']]], ['Prix', '', [['Menu dégustation', 'Sept services', '165 $'], ['Accord mets-vins', 'Sélection de notre sommelière', '95 $'], ['Accord sans alcool', 'Infusions et jus pressés', '55 $', 'Sans alcool']]]],
        chef: ['Le chef', 'Benjamin Hale', 'Chef exécutif', 'Benjamin travaille les produits de petits producteurs du Québec avec une précision classique et une touche nordique.', [['2008', 'Commis, restaurant trois étoiles à Paris'], ['2013', 'Chef de cuisine à Toronto'], ['2018', 'Ouverture de Maison Laurier'], ['2025', 'Meilleur restaurant gastronomique de Québec']]],
        evTitle: 'Soirées et événements', ev: [['Soirée vins nature', 'Rencontre avec un vigneron', 'Ven. 19 h'], ['Dîner au piano', 'Menu spécial et pianiste', 'Sam. 19 h 30']],
        team: [['Charlotte', 'Sommelière'], ['Le service', 'Maître d’hôtel et équipe de salle']],
        gal: ['Dressage', 'Découpe', 'Pièce maîtresse', 'Accueil', 'Le vin', 'Vins et fromages'],
        vidTitle: 'Derrière le passe', vids: ['Cuisine au feu', 'Le service du vin'],
        book: ['opentable', 'https://www.opentable.ca/r/maison-laurier-quebec', 'Réserver une table', 'Réservation recommandée trois semaines à l’avance.'],
        hours: [['Mercredi – samedi', '18 h – 22 h'], ['Dimanche – mardi', 'Fermé']],
        locTitle: 'Nous trouver', loc: ['45, rue Saint-Paul, Québec (Québec) G1K 3V8', 'Vieux-Port · Service de voiturier'],
        rev: [['Valérie D.', 'Anniversaire', 'Chaque service était une surprise, un souvenir inoubliable.'], ['Marc-Antoine L.', 'Dîner d’affaires', 'Accords parfaits, service d’une grande élégance.']] },
      en: { id: ['Laurel House', 'Fine dining restaurant', 'Tasting menu · Wine pairing'], ct: ['+1 843 555-0102', 'reservations@laurelhouse.com', 'laurelhouse.com'],
        about: ['The house', 'Twelve tables, an open kitchen and a tasting menu that follows the Lowcountry seasons. Our sommelier builds a pairing for every course.'],
        menuTitle: 'Tasting menu', note: 'Served to the whole table. Please share any allergies when booking.',
        menu: [['Seven-course menu', 'Based on the day’s catch and harvest', [['Bulls Bay oyster', 'Cucumber granita, dill', '', 'Signature'], ['Seared scallop', 'Brown butter, roasted cauliflower', ''], ['Heritage lamb', 'Reduced jus, parsnip, black garlic', ''], ['Chocolate sphere', 'Ground cherries, smoked cream', '', 'Signature']]], ['Pricing', '', [['Tasting menu', 'Seven courses', '$175'], ['Wine pairing', 'Selected by our sommelier', '$110'], ['Zero-proof pairing', 'Infusions and pressed juices', '$60', 'Zero-proof']]]],
        chef: ['The chef', 'Benjamin Hale', 'Executive chef', 'Benjamin cooks with small Southern farms and fishermen, with classic precision and a modern touch.', [['2008', 'Commis at a three-star restaurant in Paris'], ['2013', 'Chef de cuisine in New York'], ['2018', 'Opened Laurel House'], ['2025', 'Named best fine dining in Charleston']]],
        evTitle: 'Evenings & events', ev: [['Natural wine night', 'Meet the winemaker', 'Fri 7 p.m.'], ['Piano dinner', 'Special menu and pianist', 'Sat 7:30 p.m.']],
        team: [['Charlotte', 'Sommelier'], ['Front of house', 'Maître d’ and dining room team']],
        gal: ['Plating', 'Carving', 'The centerpiece', 'Welcome', 'The wine', 'Wine & cheese'],
        vidTitle: 'Behind the pass', vids: ['Cooking with fire', 'Wine service'],
        book: ['resy', 'https://resy.com/cities/chs/laurel-house', 'Book a table', 'We recommend booking three weeks ahead.'],
        hours: [['Wednesday – Saturday', '6 p.m. – 10 p.m.'], ['Sunday – Tuesday', 'Closed']],
        locTitle: 'Find us', loc: ['76 Queen Street, Charleston, SC 29401', 'French Quarter · Valet parking'],
        rev: [['Valerie D.', 'Anniversary', 'Every course was a surprise, an unforgettable night.'], ['Mark L.', 'Business dinner', 'Perfect pairings, very elegant service.']] } },

    { id: 'wok', icon: 'flame', rec: 'd5',
      n: ['Cuisine asiatique et wok', 'Asian kitchen & wok'], ex: ['Wok, nouilles, dumplings', 'Wok, noodles, dumplings'],
      pal: [pal('Rouge laque', '#b91c1c', '#fbbf24'), pal('Noir et rouge', '#0a0a0a', '#ef4444'), pal('Vert jade', '#0f5e4b', '#a7d7c5'), pal('Orange', '#ea580c', '#fed7aa'), pal('Encre', '#1f2937', '#f472b6'), pal('Noir & or', '#1c1917', '#c9a227')],
      M: { portrait: 9286, cover: 26213, gal: [45172, 45038, 32105, 48802, 46401, 3084], chef: 9338, ev: [50326, 646], team: [24405, 15875], vids: [9338, 47555] },
      fr: { id: ['Dragon Wok', 'Cuisine asiatique', 'Wok · Nouilles · Dumplings'], ct: ['+1 514 555-0188', 'bonjour@dragonwok.ca', 'dragonwok.ca'], tiktok: true,
        about: ['Notre cuisine', 'Le wok chauffé à blanc, les flammes qui montent, les légumes qui croquent : tout est cuit à la minute devant vous. Nouilles tirées à la main et dumplings pliés chaque matin.'],
        menuTitle: 'La carte', note: 'Plats préparés dans une cuisine qui utilise arachides, sésame et soya.',
        menu: [['Du wok', 'Cuit à la minute, à feu vif', [['Bœuf au poivre noir', 'Oignons, poivrons, sauce maison', '19 $', 'Signature'], ['Poulet général Tao', 'Sésame, riz jasmin', '17 $'], ['Tofu croustillant aux légumes', 'Sauce gingembre', '16 $', 'Végé']]], ['Nouilles et dumplings', '', [['Ramen tonkotsu', 'Bouillon 12 h, œuf mariné', '18 $'], ['Dumplings arc-en-ciel', 'Six pièces, porc ou légumes', '12 $'], ['Nouilles sautées dan dan', 'Épicées, porc haché', '17 $', 'Épicé']]]],
        chef: ['Le chef', 'Kevin Lam', 'Chef au wok', 'Kevin a appris le wok à 15 ans dans le restaurant familial, puis à Hong Kong. Il maîtrise le « souffle du wok », ce goût fumé si recherché.', [['2009', 'Restaurant familial, Quartier chinois'], ['2015', 'Cuisinier à Hong Kong'], ['2020', 'Ouverture de Dragon Wok']]],
        evTitle: 'Soirées', ev: [['Karaoké du vendredi', 'Salle privée sur réservation', 'Ven. 21 h'], ['Nouvel An lunaire', 'Danse du lion et menu spécial', 'Février']],
        team: [['Amy', 'Gérante de salle'], ['La cuisine', 'Quatre woks, cinq cuisiniers']],
        gal: ['Nouilles sautées', 'Légumes au wok', 'Dumplings maison', 'Dumplings vapeur', 'Ramen', 'Ramen à l’œuf'],
        vidTitle: 'Le wok en flammes', vids: ['Le souffle du wok', 'Sauté de légumes à feu vif'],
        book: ['opentable', 'https://www.opentable.ca/r/dragon-wok-montreal', 'Réserver une table', 'Groupes jusqu’à 30 personnes.'],
        order: ['Commander pour emporter', 'https://example.com', 'Commande en ligne, prête en 20 minutes.'],
        hours: [['Lundi – jeudi', '11 h 30 – 22 h'], ['Vendredi – samedi', '11 h 30 – 23 h'], ['Dimanche', '12 h – 21 h']],
        locTitle: 'Nous trouver', loc: ['1050, boulevard Saint-Laurent, Montréal (Québec) H2Z 1J4', 'Quartier chinois · Métro Place-d’Armes'],
        rev: [['Jonathan P.', 'Souper entre amis', 'Le bœuf au poivre noir est incroyable, on voit les flammes du comptoir.'], ['Sarah T.', 'Pour emporter', 'Les meilleurs dumplings en ville, et prêts en 20 minutes.']] },
      en: { id: ['Dragon Wok', 'Asian kitchen', 'Wok · Noodles · Dumplings'], ct: ['+1 713 555-0188', 'hello@dragonwok.com', 'dragonwok.com'], tiktok: true,
        about: ['Our kitchen', 'A white-hot wok, flames rising, vegetables that still crunch: everything is cooked to order in front of you. Hand-pulled noodles and dumplings folded every morning.'],
        menuTitle: 'Menu', note: 'Our kitchen uses peanuts, sesame and soy.',
        menu: [['From the wok', 'Cooked to order over high heat', [['Black pepper beef', 'Onions, peppers, house sauce', '$19', 'Signature'], ['General Tso’s chicken', 'Sesame, jasmine rice', '$17'], ['Crispy tofu & vegetables', 'Ginger sauce', '$16', 'Veggie']]], ['Noodles & dumplings', '', [['Tonkotsu ramen', '12-hour broth, marinated egg', '$18'], ['Rainbow dumplings', 'Six pieces, pork or veggie', '$12'], ['Dan dan noodles', 'Spicy, ground pork', '$17', 'Spicy']]]],
        chef: ['The chef', 'Kevin Lam', 'Wok chef', 'Kevin learned the wok at 15 in his family’s restaurant, then in Hong Kong. He masters “wok hei”, that prized smoky flavor.', [['2009', 'Family restaurant, Chinatown'], ['2015', 'Line cook in Hong Kong'], ['2020', 'Opened Dragon Wok']]],
        evTitle: 'Events', ev: [['Friday karaoke', 'Private room by reservation', 'Fri 9 p.m.'], ['Lunar New Year', 'Lion dance and special menu', 'February']],
        team: [['Amy', 'Front of house manager'], ['The kitchen', 'Four woks, five cooks']],
        gal: ['Stir-fried noodles', 'Wok vegetables', 'Handmade dumplings', 'Steamed dumplings', 'Ramen', 'Ramen with egg'],
        vidTitle: 'The wok on fire', vids: ['Wok hei', 'High-heat vegetable stir-fry'],
        book: ['opentable', 'https://www.opentable.com/r/dragon-wok-houston', 'Book a table', 'Groups up to 30 people.'],
        order: ['Order takeout', 'https://example.com', 'Order online, ready in 20 minutes.'],
        hours: [['Monday – Thursday', '11:30 a.m. – 10 p.m.'], ['Friday – Saturday', '11:30 a.m. – 11 p.m.'], ['Sunday', 'noon – 9 p.m.']],
        locTitle: 'Find us', loc: ['9750 Bellaire Boulevard, Houston, TX 77036', 'Chinatown · Free parking'],
        rev: [['Jonathan P.', 'Dinner with friends', 'The black pepper beef is amazing, you can see the flames from the counter.'], ['Sarah T.', 'Takeout', 'Best dumplings in town, ready in 20 minutes.']] } },

    { id: 'sushi', icon: 'fish', rec: 'd7',
      n: ['Bar à sushis', 'Sushi bar'], ex: ['Omakase, makis, sashimis', 'Omakase, rolls, sashimi'],
      pal: [pal('Noir chic', '#1a1a1a', '#ef4444'), pal('Vert jade', '#0f5e4b', '#a7d7c5'), pal('Bois', '#7c4a24', '#e9b872'), pal('Rouge laque', '#b91c1c', '#f8fafc'), pal('Bleu nuit', '#1e2a4a', '#fca5a5'), pal('Ardoise', '#334155', '#fbbf24')],
      M: { portrait: 45920, cover: 46020, gal: [46019, 46008, 21879, 12014, 32518, 26259], chef: 45920, ev: [43744, 50307], team: [26259, 13070], vids: [46008, 46019] },
      fr: { id: ['Sushi Kaze', 'Bar à sushis', 'Omakase · Makis · Sashimis'], ct: ['+1 514 555-0153', 'bonjour@sushikaze.ca', 'sushikaze.ca'],
        about: ['Le comptoir', 'Dix places au comptoir face au chef, du poisson arrivé le matin même et un riz vinaigré selon la tradition. Laissez-vous guider par l’omakase ou composez votre plateau.'],
        menuTitle: 'La carte', note: 'Poisson cru : demandez nos options cuites et végétariennes.',
        menu: [['Omakase', 'Le choix du chef, au comptoir', [['Omakase 12 pièces', 'Nigiris de saison', '78 $', 'Signature'], ['Omakase 18 pièces', 'Avec temaki et dessert', '115 $']]], ['À la carte', '', [['Maki dragon', 'Crevette tempura, avocat, anguille', '19 $'], ['Sashimi de saumon', 'Huit tranches', '18 $'], ['Maki concombre et avocat', 'Six pièces', '9 $', 'Végé']]]],
        chef: ['Le chef', 'Daniel Mori', 'Itamae', 'Daniel s’est formé sept ans à Tokyo avant d’ouvrir son comptoir. Pour lui, le sushi parfait tient en trois choses : le riz, le poisson et le geste.', [['2010', 'Apprenti dans un comptoir de Ginza, Tokyo'], ['2017', 'Chef sushi à Vancouver'], ['2021', 'Ouverture de Sushi Kaze']]],
        evTitle: 'Soirées', ev: [['Soirée saké', 'Dégustation de cinq sakés', 'Jeu. 19 h'], ['Atelier makis', 'Apprenez avec le chef', 'Sam. 14 h']],
        team: [['Yuki', 'Hôtesse et sommelière saké'], ['Le comptoir', 'Trois chefs sushi']],
        gal: ['Dressage', 'Roulage du maki', 'Grand plateau', 'Maki dragon', 'Nigiris au saumon', 'Au comptoir'],
        vidTitle: 'Au comptoir', vids: ['Le maki se roule', 'Dressage au gingembre et wasabi'],
        book: ['libro', 'https://www.libroreserve.com/sushi-kaze', 'Réserver au comptoir', 'Omakase sur réservation seulement.'],
        order: ['Commander des plateaux', 'https://example.com', 'Plateaux pour emporter, commandés la veille.'],
        hours: [['Mardi – samedi', '17 h 30 – 22 h 30'], ['Dimanche – lundi', 'Fermé']],
        locTitle: 'Nous trouver', loc: ['4410, rue Saint-Denis, Montréal (Québec) H2J 2L1', 'Plateau · Métro Mont-Royal'],
        rev: [['Alexandre G.', 'Omakase', 'Une expérience unique, chaque nigiri fond en bouche.'], ['Camille F.', 'Atelier makis', 'Le chef explique tout avec patience, super soirée.']] },
      en: { id: ['Sushi Kaze', 'Sushi bar', 'Omakase · Rolls · Sashimi'], ct: ['+1 213 555-0153', 'hello@sushikaze.com', 'sushikaze.com'],
        about: ['The counter', 'Ten seats at the counter facing the chef, fish that arrived that morning and rice seasoned the traditional way. Trust the omakase or build your own platter.'],
        menuTitle: 'Menu', note: 'Raw fish: ask about our cooked and vegetarian options.',
        menu: [['Omakase', 'Chef’s choice, at the counter', [['12-piece omakase', 'Seasonal nigiri', '$85', 'Signature'], ['18-piece omakase', 'With hand roll and dessert', '$125']]], ['À la carte', '', [['Dragon roll', 'Shrimp tempura, avocado, eel', '$19'], ['Salmon sashimi', 'Eight slices', '$18'], ['Cucumber avocado roll', 'Six pieces', '$9', 'Veggie']]]],
        chef: ['The chef', 'Daniel Mori', 'Itamae', 'Daniel trained for seven years in Tokyo before opening his counter. To him, perfect sushi comes down to three things: rice, fish and touch.', [['2010', 'Apprentice at a Ginza sushi counter, Tokyo'], ['2017', 'Sushi chef in Vancouver'], ['2021', 'Opened Sushi Kaze']]],
        evTitle: 'Events', ev: [['Sake night', 'Tasting of five sakes', 'Thu 7 p.m.'], ['Sushi-making class', 'Learn with the chef', 'Sat 2 p.m.']],
        team: [['Yuki', 'Host & sake sommelier'], ['The counter', 'Three sushi chefs']],
        gal: ['Plating', 'Rolling', 'Large platter', 'Dragon roll', 'Salmon nigiri', 'At the counter'],
        vidTitle: 'At the counter', vids: ['Rolling a maki', 'Plating with ginger and wasabi'],
        book: ['tock', 'https://www.exploretock.com/sushikaze', 'Book the counter', 'Omakase by reservation only.'],
        order: ['Order platters', 'https://example.com', 'Takeout platters, ordered the day before.'],
        hours: [['Tuesday – Saturday', '5:30 p.m. – 10:30 p.m.'], ['Sunday – Monday', 'Closed']],
        locTitle: 'Find us', loc: ['350 East 1st Street, Los Angeles, CA 90012', 'Little Tokyo · Validated parking'],
        rev: [['Alex G.', 'Omakase', 'A unique experience, every nigiri melts in your mouth.'], ['Camille F.', 'Sushi class', 'The chef explains everything patiently, great evening.']] } },

    { id: 'pizzeria', icon: 'pizza', rec: 'd3',
      n: ['Pizzeria', 'Pizzeria'], ex: ['Four à bois, pâte maison', 'Wood-fired oven, house dough'],
      pal: [pal('Rouge tomate', '#b91c1c', '#fde68a'), pal('Vert basilic', '#166534', '#fca5a5'), pal('Terracotta', '#a4512e', '#f0c29e'), pal('Noir et rouge', '#0a0a0a', '#ef4444'), pal('Crème', '#7a5c3e', '#fde68a'), pal('Bleu marine', '#1e3a8a', '#fbbf24')],
      M: { portrait: 42469, cover: 42481, gal: [42484, 44008, 1666, 44007, 42480, 44003], chef: 42472, ev: [3294, 24162], team: [44019, 44003], vids: [42472, 42480] },
      fr: { id: ['Pizzeria Fuoco', 'Pizzeria napolitaine', 'Four à bois · Pâte 48 h'], ct: ['+1 450 555-0175', 'ciao@pizzeriafuoco.ca', 'pizzeriafuoco.ca'], tiktok: true,
        about: ['Notre pizzeria', 'Une pâte qui lève 48 heures, des tomates San Marzano et un four à bois à 450 °C : 90 secondes de cuisson pour une pizza napolitaine comme à Naples.'],
        menuTitle: 'Nos pizzas', note: 'Croûte sans gluten disponible (+4 $). Pâte faite maison chaque jour.',
        menu: [['Les classiques', '', [['Margherita', 'Tomate, fior di latte, basilic', '17 $', 'Signature'], ['Pepperoni', 'Tomate, mozzarella, pepperoni', '19 $'], ['Quattro formaggi', 'Quatre fromages, miel', '21 $', 'Végé']]], ['Les créations', '', [['Diavola', 'Salami piquant, piment', '20 $', 'Épicé'], ['Prosciutto e rucola', 'Jambon de Parme, roquette, parmesan', '23 $']]]],
        chef: ['Le pizzaiolo', 'Luca Bennett', 'Pizzaiolo', 'Luca a appris son métier à Naples et a remporté deux concours de pizza acrobatique. Venez le voir faire tourner la pâte !', [['2012', 'Formation de pizzaiolo, Naples'], ['2016', 'Champion de pizza acrobatique'], ['2019', 'Ouverture de Pizzeria Fuoco']]],
        evTitle: 'Soirées', ev: [['Soirée rock', 'Groupe local en salle', 'Ven. 21 h'], ['Concert en terrasse', 'Musique live et pizza à volonté', 'Sam. 20 h']],
        team: [['Gina', 'Gérante'], ['Marco', 'Service en salle']],
        gal: ['Sortie du four', 'Service en salle', 'La découpe', 'À partager', 'Au four à bois', 'Margherita'],
        vidTitle: 'Le show du pizzaiolo', vids: ['Pizza acrobatique', 'Dans le four à bois'],
        book: ['libro', 'https://www.libroreserve.com/pizzeria-fuoco', 'Réserver une table', 'Groupes et fêtes d’enfants bienvenus.'],
        order: ['Commander pour emporter', 'https://example.com', 'Livraison et pour emporter, 7 jours sur 7.'],
        hours: [['Lundi – jeudi', '11 h 30 – 22 h'], ['Vendredi – samedi', '11 h 30 – 23 h 30'], ['Dimanche', '12 h – 21 h']],
        locTitle: 'Nous trouver', loc: ['1745, boulevard Saint-Martin Ouest, Laval (Québec) H7S 1N2', 'Stationnement gratuit · Terrasse l’été'],
        rev: [['Patrick L.', 'Souper en famille', 'La meilleure pizza à l’extérieur de Naples, les enfants adorent le spectacle.'], ['Audrey M.', 'Pour emporter', 'Croûte parfaite, encore chaude à la maison.']] },
      en: { id: ['Fuoco Pizzeria', 'Neapolitan pizzeria', 'Wood-fired · 48-hour dough'], ct: ['+1 718 555-0175', 'ciao@fuocopizzeria.com', 'fuocopizzeria.com'], tiktok: true,
        about: ['Our pizzeria', 'Dough that rises for 48 hours, San Marzano tomatoes and a wood-fired oven at 850 °F: 90 seconds for a Neapolitan pie just like in Naples.'],
        menuTitle: 'Our pizzas', note: 'Gluten-free crust available (+$4). Dough made fresh daily.',
        menu: [['The classics', '', [['Margherita', 'Tomato, fior di latte, basil', '$17', 'Signature'], ['Pepperoni', 'Tomato, mozzarella, pepperoni', '$19'], ['Quattro formaggi', 'Four cheeses, honey', '$21', 'Veggie']]], ['House creations', '', [['Diavola', 'Spicy salami, chili', '$20', 'Spicy'], ['Prosciutto e rucola', 'Prosciutto, arugula, parmesan', '$23']]]],
        chef: ['The pizzaiolo', 'Luca Bennett', 'Pizzaiolo', 'Luca learned his craft in Naples and won two acrobatic pizza contests. Come watch him spin the dough!', [['2012', 'Pizzaiolo training, Naples'], ['2016', 'Acrobatic pizza champion'], ['2019', 'Opened Fuoco Pizzeria']]],
        evTitle: 'Events', ev: [['Rock night', 'Local band in the dining room', 'Fri 9 p.m.'], ['Patio concert', 'Live music and all-you-can-eat pizza', 'Sat 8 p.m.']],
        team: [['Gina', 'Manager'], ['Marco', 'Server']],
        gal: ['Out of the oven', 'Table service', 'The slice', 'To share', 'Wood-fired oven', 'Margherita'],
        vidTitle: 'The pizzaiolo show', vids: ['Acrobatic pizza', 'In the wood-fired oven'],
        book: ['resy', 'https://resy.com/cities/ny/fuoco-pizzeria', 'Book a table', 'Groups and kids’ parties welcome.'],
        order: ['Order takeout', 'https://example.com', 'Delivery and takeout, 7 days a week.'],
        hours: [['Monday – Thursday', '11:30 a.m. – 10 p.m.'], ['Friday – Saturday', '11:30 a.m. – 11:30 p.m.'], ['Sunday', 'noon – 9 p.m.']],
        locTitle: 'Find us', loc: ['280 Bedford Avenue, Brooklyn, NY 11249', 'Williamsburg · Backyard patio in summer'],
        rev: [['Pat L.', 'Family dinner', 'Best pizza outside Naples, the kids love the show.'], ['Audrey M.', 'Takeout', 'Perfect crust, still hot when we got home.']] } },

    { id: 'steak', icon: 'beef', rec: 'd5',
      n: ['Steakhouse et grill', 'Steakhouse & grill'], ex: ['Bœuf vieilli, grillades, cave à vin', 'Dry-aged beef, grill, wine cellar'],
      pal: [pal('Noir carbone', '#18181b', '#ef4444'), pal('Bordeaux', '#6b1d2a', '#e8c39e'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Brun cuir', '#7c4a24', '#e9b872'), pal('Vert anglais', '#14532d', '#d4af37'), pal('Gris acier', '#374151', '#f97316')],
      M: { portrait: 46670, cover: 45723, gal: [45726, 45725, 46660, 22768, 45722, 45727], chef: 46670, ev: [646, 43744], team: [15788, 12932], vids: [45723, 46661] },
      fr: { id: ['Le Boucher Grill', 'Steakhouse', 'Bœuf vieilli · Grill au charbon · Cave à vin'], ct: ['+1 418 555-0179', 'reservations@boucher-grill.ca', 'boucher-grill.ca'],
        about: ['La maison', 'Du bœuf québécois vieilli 40 jours dans notre chambre de maturation, saisi sur un grill au charbon de bois. Une cave de 300 étiquettes pour l’accompagner.'],
        menuTitle: 'La carte', note: 'Toutes nos viandes sont servies avec un accompagnement au choix. Cuisson à votre goût.',
        menu: [['Les pièces', 'Vieillies à sec 40 jours', [['Faux-filet 14 oz', 'Grillé au charbon', '58 $', 'Signature'], ['Côte de bœuf 32 oz', 'Pour deux', '135 $'], ['Filet mignon 8 oz', 'Beurre aux fines herbes', '62 $']]], ['Accompagnements', '', [['Frites à la graisse de canard', '', '9 $'], ['Asperges grillées', 'Citron, parmesan', '11 $', 'Végé'], ['Gratin dauphinois', '', '10 $']]]],
        chef: ['Le chef', 'Jack Morrison', 'Chef et maître grilleur', 'Jack choisit lui-même chaque carcasse chez des éleveurs de Charlevoix et surveille la maturation au jour près.', [['2007', 'Boucher-charcutier de formation'], ['2012', 'Chef grilleur à Chicago'], ['2018', 'Ouverture du Boucher Grill']]],
        evTitle: 'Soirées', ev: [['Jazz et whisky', 'Saxophone et dégustation', 'Jeu. 20 h'], ['Soirée côte de bœuf', 'Menu pour deux et trio jazz', 'Sam. 19 h']],
        team: [['Olivier', 'Sommelier'], ['Sophie', 'Maître d’hôtel']],
        gal: ['La découpe', 'Bien saisi', 'Sur le grill', 'Retourné au feu', 'Faux-filet', 'À partager'],
        vidTitle: 'Le grill', vids: ['Saisi sur le grill', 'Assaisonné sur les flammes'],
        book: ['opentable', 'https://www.opentable.ca/r/le-boucher-grill-quebec', 'Réserver une table', 'Salon privé pour 16 personnes.'],
        hours: [['Mardi – samedi', '17 h – 23 h'], ['Dimanche – lundi', 'Fermé']],
        locTitle: 'Nous trouver', loc: ['1125, avenue Cartier, Québec (Québec) G1R 2S6', 'Montcalm · Voiturier le soir'],
        rev: [['Martin B.', 'Souper d’affaires', 'Le meilleur steak que j’ai mangé, cuisson parfaite.'], ['Josée R.', 'Anniversaire', 'Côte de bœuf mémorable et superbe choix de vins.']] },
      en: { id: ['The Butcher Grill', 'Steakhouse', 'Dry-aged beef · Charcoal grill · Wine cellar'], ct: ['+1 214 555-0179', 'reservations@butchergrill.com', 'butchergrill.com'],
        about: ['The house', 'Texas beef dry-aged 40 days in our aging room, seared over a charcoal grill. A 300-label cellar to go with it.'],
        menuTitle: 'Menu', note: 'All steaks come with one side. Cooked to your liking.',
        menu: [['The cuts', 'Dry-aged 40 days', [['14 oz New York strip', 'Charcoal-grilled', '$58', 'Signature'], ['32 oz tomahawk', 'For two', '$135'], ['8 oz filet mignon', 'Herb butter', '$62']]], ['Sides', '', [['Duck fat fries', '', '$9'], ['Grilled asparagus', 'Lemon, parmesan', '$11', 'Veggie'], ['Potato gratin', '', '$10']]]],
        chef: ['The chef', 'Jack Morrison', 'Chef & grill master', 'Jack picks every carcass himself from Texas ranchers and watches the aging day by day.', [['2007', 'Trained as a butcher'], ['2012', 'Grill chef in Chicago'], ['2018', 'Opened The Butcher Grill']]],
        evTitle: 'Evenings', ev: [['Jazz & whiskey', 'Saxophone and tasting', 'Thu 8 p.m.'], ['Tomahawk night', 'Dinner for two and jazz trio', 'Sat 7 p.m.']],
        team: [['Oliver', 'Sommelier'], ['Sophie', 'Maître d’']],
        gal: ['The cut', 'Perfect sear', 'On the grill', 'Flipped over the fire', 'Strip steak', 'To share'],
        vidTitle: 'The grill', vids: ['Seared on the grill', 'Seasoned over the flames'],
        book: ['opentable', 'https://www.opentable.com/r/the-butcher-grill-dallas', 'Book a table', 'Private room for 16 guests.'],
        hours: [['Tuesday – Saturday', '5 p.m. – 11 p.m.'], ['Sunday – Monday', 'Closed']],
        locTitle: 'Find us', loc: ['2800 Routh Street, Dallas, TX 75201', 'Uptown · Evening valet'],
        rev: [['Martin B.', 'Business dinner', 'Best steak I’ve ever had, cooked perfectly.'], ['Josie R.', 'Anniversary', 'Memorable tomahawk and a great wine list.']] } },

    { id: 'cafe', icon: 'coffee', rec: 'd4',
      n: ['Café et pâtisserie', 'Café & bakery'], ex: ['Café de spécialité, viennoiseries', 'Specialty coffee, pastries'],
      pal: [pal('Café', '#6f4e37', '#e9c9a3'), pal('Crème', '#8a6752', '#f5e6d3'), pal('Vert sauge', '#4f6b58', '#c9d6c3'), pal('Rose poudré', '#9d4b62', '#f3c4cf'), pal('Bleu ardoise', '#1e3a5f', '#e0a458'), pal('Noir chic', '#1a1a1a', '#c5a572')],
      M: { portrait: 41856, cover: 4350, gal: [810, 3576, 50017, 29330, 41860, 41222], chef: 50017, ev: [50330, 50326], team: [41860, 222], vids: [810, 50017] },
      fr: { id: ['Café Grain d’Or', 'Café et pâtisserie', 'Café de spécialité · Viennoiseries maison'], ct: ['+1 819 555-0124', 'bonjour@graindor.ca', 'graindor.ca'],
        about: ['Le café', 'Un café de quartier où l’on torréfie nos grains sur place et où les croissants sortent du four à 7 h. Places au comptoir, grande table pour travailler et terrasse ensoleillée.'],
        menuTitle: 'Au comptoir', note: 'Lait d’avoine et d’amande sans frais. Options sans gluten chaque jour.',
        menu: [['Cafés', 'Grains torréfiés sur place', [['Espresso', 'Assemblage maison', '3,25 $'], ['Latte', 'Art latte compris', '5,25 $', 'Signature'], ['Café filtre du jour', 'Origine unique', '3,75 $']]], ['Pâtisseries', 'Faites maison chaque matin', [['Croissant au beurre', '', '3,75 $'], ['Chausson aux pommes du Québec', '', '4,50 $'], ['Gâteau du jour', 'La part', '6,50 $', 'Végé']]]],
        chef: ['La cheffe pâtissière', 'Emma Collins', 'Cheffe pâtissière', 'Emma prépare chaque nuit les viennoiseries et les gâteaux, avec du beurre du Québec et des fruits de saison.', [['2014', 'Diplôme en pâtisserie'], ['2017', 'Boulangerie artisanale à Paris'], ['2021', 'Cofondatrice du Café Grain d’Or']]],
        evTitle: 'Animations', ev: [['Dimanche musical', 'Piano au café', 'Dim. 11 h'], ['Atelier latte art', 'Apprenez avec nos baristas', 'Sam. 15 h']],
        team: [['Noah', 'Barista en chef'], ['Lily', 'Accueil et comptoir']],
        gal: ['Latte art', 'Mousse de lait', 'Gâteau maison', 'Viennoiseries', 'Le cappuccino', 'Au comptoir'],
        vidTitle: 'Au comptoir', vids: ['Le latte art', 'Le glaçage du gâteau'],
        book: ['square', 'https://book.squareup.com/appointments/cafe-grain-dor', 'Réserver la grande table', 'Pour les groupes et les ateliers.'],
        order: ['Commander un gâteau', 'https://example.com', 'Gâteaux d’anniversaire sur commande, 48 h à l’avance.'],
        hours: [['Lundi – vendredi', '7 h – 17 h'], ['Samedi – dimanche', '8 h – 16 h']],
        locTitle: 'Nous trouver', loc: ['85, rue Wellington Nord, Sherbrooke (Québec) J1H 5A9', 'Centre-ville · Wi-Fi gratuit'],
        rev: [['Mathilde C.', 'Habituée', 'Le meilleur latte de Sherbrooke et des croissants incroyables.'], ['Antoine R.', 'Gâteau d’anniversaire', 'Magnifique et délicieux, tout le monde en a redemandé.']] },
      en: { id: ['Golden Bean Café', 'Café & bakery', 'Specialty coffee · House-made pastries'], ct: ['+1 503 555-0124', 'hello@goldenbeancafe.com', 'goldenbeancafe.com'],
        about: ['The café', 'A neighborhood café where we roast our beans in-house and croissants come out of the oven at 7 a.m. Counter seats, a big work table and a sunny patio.'],
        menuTitle: 'At the counter', note: 'Oat and almond milk at no charge. Gluten-free options every day.',
        menu: [['Coffee', 'Roasted in-house', [['Espresso', 'House blend', '$3.25'], ['Latte', 'With latte art', '$5.25', 'Signature'], ['Drip of the day', 'Single origin', '$3.75']]], ['Pastries', 'Baked fresh every morning', [['Butter croissant', '', '$3.75'], ['Apple turnover', '', '$4.50'], ['Cake of the day', 'Per slice', '$6.50', 'Veggie']]]],
        chef: ['The pastry chef', 'Emma Collins', 'Pastry chef', 'Emma bakes every pastry and cake overnight, with local butter and seasonal fruit.', [['2014', 'Pastry arts diploma'], ['2017', 'Artisan bakery in Paris'], ['2021', 'Co-founded Golden Bean Café']]],
        evTitle: 'Events', ev: [['Music Sunday', 'Piano at the café', 'Sun 11 a.m.'], ['Latte art class', 'Learn with our baristas', 'Sat 3 p.m.']],
        team: [['Noah', 'Head barista'], ['Lily', 'Front counter']],
        gal: ['Latte art', 'Milk foam', 'House cake', 'Pastries', 'Cappuccino', 'At the counter'],
        vidTitle: 'At the counter', vids: ['Latte art', 'Icing the cake'],
        book: ['square', 'https://book.squareup.com/appointments/golden-bean-cafe', 'Reserve the big table', 'For groups and classes.'],
        order: ['Order a cake', 'https://example.com', 'Birthday cakes to order, 48 hours ahead.'],
        hours: [['Monday – Friday', '7 a.m. – 5 p.m.'], ['Saturday – Sunday', '8 a.m. – 4 p.m.']],
        locTitle: 'Find us', loc: ['1200 SE Division Street, Portland, OR 97202', 'Division · Free Wi-Fi'],
        rev: [['Maddie C.', 'Regular', 'The best latte in Portland and amazing croissants.'], ['Anthony R.', 'Birthday cake', 'Beautiful and delicious, everyone wanted seconds.']] } },

    { id: 'cocktail', icon: 'martini', rec: 'd5',
      n: ['Bar à cocktails et musique live', 'Cocktail bar & live music'], ex: ['Mixologie, jazz, concerts', 'Mixology, jazz, live shows'],
      pal: [pal('Noir & or', '#1c1917', '#c9a227'), pal('Violet néon', '#4c1d95', '#a78bfa'), pal('Bleu nuit', '#1e2a4a', '#f472b6'), pal('Émeraude', '#065f46', '#6ee7b7'), pal('Rouge velours', '#9f1239', '#fda4af'), pal('Bronze', '#7c4a24', '#fbbf24')],
      M: { portrait: 15171, cover: 4043, gal: [4172, 22850, 43964, 4295, 5144, 25459], chef: 15171, ev: [50307, 43744], team: [43976, 43984], vids: [4172, 50307] },
      fr: { id: ['Le Velours', 'Bar à cocktails', 'Mixologie · Jazz · Concerts'], ct: ['+1 514 555-0161', 'bonjour@levelours.ca', 'levelours.ca'], tiktok: true,
        about: ['Le bar', 'Un bar feutré aux banquettes de velours, des cocktails de signature créés avec des spiritueux du Québec et de la musique live cinq soirs par semaine.'],
        menuTitle: 'La carte des cocktails', note: 'Cocktails sans alcool disponibles. Pièce d’identité exigée.',
        menu: [['Signatures', 'Créations de notre mixologue', [['Velours fumé', 'Whisky, érable, fumée de cerisier', '17 $', 'Signature'], ['Jardin de nuit', 'Gin du Québec, concombre, sureau', '16 $'], ['Negroni d’ici', 'Gin, amer local, orange', '15 $']]], ['Sans alcool', '', [['Faux mojito', 'Lime, menthe, soda', '9 $', 'Sans alcool'], ['Spritz de canneberge', '', '9 $', 'Sans alcool']]]],
        chef: ['Le mixologue', 'Nathan Pryce', 'Chef barman', 'Nathan a représenté le Canada dans deux concours internationaux de mixologie. Chaque cocktail de la carte est sa création.', [['2013', 'Barman à Toronto'], ['2018', 'Finaliste mondial de mixologie'], ['2022', 'Ouverture du Velours']]],
        evTitle: 'Concerts et soirées', ev: [['Jazz live', 'Quartet en salle', 'Mer. au sam. 21 h'], ['Soirée saxophone', 'Grands standards', 'Jeu. 22 h']],
        team: [['Zoé', 'Barmaid'], ['Le service', 'Toute l’équipe du bar']],
        gal: ['Cocktail moléculaire', 'Cocktail fumé', 'Old fashioned', 'Préparation au shaker', 'Negroni', 'Les cocktails'],
        vidTitle: 'Au bar', vids: ['Création d’un cocktail', 'Concert jazz'],
        book: ['sevenrooms', 'https://www.sevenrooms.com/reservations/levelours', 'Réserver une banquette', 'Banquettes réservées jusqu’à 21 h.'],
        hours: [['Mercredi – samedi', '17 h – 2 h'], ['Dimanche', '17 h – 23 h'], ['Lundi – mardi', 'Fermé']],
        locTitle: 'Nous trouver', loc: ['1234, rue Crescent, Montréal (Québec) H3G 2A9', 'Centre-ville · Métro Peel'],
        rev: [['Isabelle T.', 'Soirée jazz', 'Ambiance magique, cocktails parfaits, on reviendra.'], ['David K.', 'Anniversaire', 'Le Velours fumé est une œuvre d’art.']] },
      en: { id: ['The Velvet Room', 'Cocktail bar', 'Mixology · Jazz · Live shows'], ct: ['+1 504 555-0161', 'hello@velvetroombar.com', 'velvetroombar.com'], tiktok: true,
        about: ['The bar', 'A low-lit bar with velvet booths, signature cocktails crafted with local spirits and live music five nights a week.'],
        menuTitle: 'Cocktail menu', note: 'Zero-proof cocktails available. ID required.',
        menu: [['Signatures', 'Created by our head bartender', [['Smoked Velvet', 'Bourbon, maple, cherrywood smoke', '$16', 'Signature'], ['Night Garden', 'Gin, cucumber, elderflower', '$15'], ['House Negroni', 'Gin, local amaro, orange', '$14']]], ['Zero-proof', '', [['Virgin mojito', 'Lime, mint, soda', '$9', 'Zero-proof'], ['Cranberry spritz', '', '$9', 'Zero-proof']]]],
        chef: ['The mixologist', 'Nathan Pryce', 'Head bartender', 'Nathan has competed in two international mixology finals. Every cocktail on the menu is his creation.', [['2013', 'Bartender in New York'], ['2018', 'World mixology finalist'], ['2022', 'Opened The Velvet Room']]],
        evTitle: 'Live music & events', ev: [['Live jazz', 'Quartet in the room', 'Wed–Sat 9 p.m.'], ['Sax night', 'The great standards', 'Thu 10 p.m.']],
        team: [['Zoe', 'Bartender'], ['The crew', 'Our whole bar team']],
        gal: ['Molecular cocktail', 'Smoked cocktail', 'Old fashioned', 'Shaken', 'Negroni', 'Cocktails'],
        vidTitle: 'At the bar', vids: ['Crafting a cocktail', 'Jazz show'],
        book: ['sevenrooms', 'https://www.sevenrooms.com/reservations/velvetroom', 'Reserve a booth', 'Booths held until 9 p.m.'],
        hours: [['Wednesday – Saturday', '5 p.m. – 2 a.m.'], ['Sunday', '5 p.m. – 11 p.m.'], ['Monday – Tuesday', 'Closed']],
        locTitle: 'Find us', loc: ['626 Frenchmen Street, New Orleans, LA 70116', 'Marigny · Live music district'],
        rev: [['Isabel T.', 'Jazz night', 'Magical vibe, perfect cocktails, we’ll be back.'], ['David K.', 'Birthday', 'The Smoked Velvet is a work of art.']] } },

    { id: 'brasserie', icon: 'beer', rec: 'd8',
      n: ['Microbrasserie et pub', 'Brewpub'], ex: ['Bières maison, concerts', 'House beers, live music'],
      pal: [pal('Ambre', '#b45309', '#fde68a'), pal('Noir stout', '#1c1917', '#f59e0b'), pal('Vert houblon', '#3f6212', '#d9f99d'), pal('Brique', '#9f1239', '#fdba74'), pal('Bleu marine', '#1e3a8a', '#fbbf24'), pal('Bois', '#7c4a24', '#e9b872')],
      M: { portrait: 40482, cover: 1427, gal: [1421, 40483, 24839, 8711, 1404, 1412], chef: 1411, ev: [24162, 41310], team: [8709, 8710], vids: [1421, 24162] },
      fr: { id: ['Brasserie du Fleuve', 'Microbrasserie et pub', 'Bières maison · Pub · Concerts'], ct: ['+1 819 555-0147', 'sante@brasseriedufleuve.ca', 'brasseriedufleuve.ca'], tiktok: true,
        about: ['La brasserie', 'Nous brassons sur place douze bières en fût, de la blonde légère à la stout à l’érable. Cuisine de pub généreuse et concerts tous les vendredis.'],
        menuTitle: 'En fût', note: 'Planchette de dégustation de quatre bières au choix : 14 $.',
        menu: [['Nos bières', 'Brassées sur place', [['La Riveraine', 'Blonde légère · 4,5 %', '7 $'], ['IPA du Fleuve', 'Agrumes et pin · 6,5 %', '8 $', 'Signature'], ['Stout à l’érable', 'Noire et onctueuse · 7 %', '8 $']]], ['À grignoter', '', [['Burger du brasseur', 'Bœuf, cheddar fort, oignons à la bière', '19 $'], ['Ailes de poulet', 'Sauce à l’IPA', '16 $'], ['Poutine végé', 'Sauce aux champignons', '14 $', 'Végé']]]],
        chef: ['Le maître brasseur', 'Ryan Fletcher', 'Maître brasseur', 'Ryan brasse depuis 12 ans et a remporté trois médailles au Mondial de la bière. Il fait goûter les brassins en cours tous les samedis.', [['2013', 'Brasseur amateur passionné'], ['2017', 'Médaille d’or, stout'], ['2019', 'Ouverture de la Brasserie du Fleuve']]],
        evTitle: 'Concerts', ev: [['Vendredi rock', 'Groupes de la région', 'Ven. 21 h'], ['Soirée blues', 'Guitare et harmonica', 'Sam. 21 h']],
        team: [['Mélanie', 'Gérante du pub'], ['Le bar', 'Service en fût']],
        gal: ['Directement de la cuve', 'L’ambiance', 'Santé !', 'Le pub', 'Planchette de dégustation', 'Le brassage'],
        vidTitle: 'À la brasserie', vids: ['Tirée de la cuve', 'Concert du vendredi'],
        book: ['libro', 'https://www.libroreserve.com/brasserie-du-fleuve', 'Réserver une table', 'Groupes et 5 à 7 d’entreprise.'],
        order: ['Acheter nos canettes', 'https://example.com', 'Boutique en ligne, cueillette sur place.'],
        hours: [['Mardi – jeudi', '15 h – 23 h'], ['Vendredi – samedi', '12 h – 1 h'], ['Dimanche', '12 h – 21 h']],
        locTitle: 'Nous trouver', loc: ['1450, rue Notre-Dame Centre, Trois-Rivières (Québec) G9A 4X4', 'Vue sur le fleuve · Terrasse l’été'],
        rev: [['Jérôme L.', 'Habitué', 'La stout à l’érable est la meilleure du Québec.'], ['Valérie N.', 'Concert du vendredi', 'Ambiance du tonnerre, bonne bouffe, bons groupes.']] },
      en: { id: ['River Brewing Co.', 'Brewpub', 'House beers · Pub · Live music'], ct: ['+1 303 555-0147', 'cheers@riverbrewing.com', 'riverbrewing.com'], tiktok: true,
        about: ['The brewery', 'We brew twelve taps on site, from a light blonde to a maple stout. Hearty pub food and live music every Friday.'],
        menuTitle: 'On tap', note: 'Flight of any four beers: $14.',
        menu: [['Our beers', 'Brewed on site', [['River Blonde', 'Light blonde · 4.5%', '$7'], ['River IPA', 'Citrus and pine · 6.5%', '$8', 'Signature'], ['Maple Stout', 'Dark and smooth · 7%', '$8']]], ['Bites', '', [['Brewer’s burger', 'Beef, sharp cheddar, beer onions', '$18'], ['Chicken wings', 'IPA sauce', '$15'], ['Veggie loaded fries', 'Mushroom gravy', '$13', 'Veggie']]]],
        chef: ['The head brewer', 'Ryan Fletcher', 'Head brewer', 'Ryan has brewed for 12 years and won three medals at the Great American Beer Festival. He pours tastings of new batches every Saturday.', [['2013', 'Passionate homebrewer'], ['2017', 'Gold medal, stout'], ['2019', 'Opened River Brewing Co.']]],
        evTitle: 'Live music', ev: [['Rock Friday', 'Local bands', 'Fri 9 p.m.'], ['Blues night', 'Guitar and harmonica', 'Sat 9 p.m.']],
        team: [['Melanie', 'Pub manager'], ['The bar', 'Pouring from the taps']],
        gal: ['Straight from the tank', 'The vibe', 'Cheers!', 'The pub', 'Tasting flight', 'Brewing'],
        vidTitle: 'At the brewery', vids: ['Poured from the tank', 'Friday show'],
        book: ['opentable', 'https://www.opentable.com/r/river-brewing-denver', 'Book a table', 'Groups and company happy hours.'],
        order: ['Buy our cans', 'https://example.com', 'Online shop, pick up on site.'],
        hours: [['Tuesday – Thursday', '3 p.m. – 11 p.m.'], ['Friday – Saturday', 'noon – 1 a.m.'], ['Sunday', 'noon – 9 p.m.']],
        locTitle: 'Find us', loc: ['2600 Walnut Street, Denver, CO 80205', 'RiNo · Patio in summer'],
        rev: [['Jerome L.', 'Regular', 'The maple stout is the best in Colorado.'], ['Valerie N.', 'Friday show', 'Great vibe, good food, good bands.']] } },

    { id: 'taqueria', icon: 'sandwich', rec: 'd9',
      n: ['Taqueria', 'Taqueria'], ex: ['Tacos, margaritas, cuisine mexicaine', 'Tacos, margaritas, Mexican food'],
      pal: [pal('Corail', '#c2410c', '#fde68a'), pal('Vert lime', '#4d7c0f', '#fde047'), pal('Rose fluo', '#db2777', '#fbcfe8'), pal('Turquoise', '#0f766e', '#fde68a'), pal('Rouge piment', '#b91c1c', '#fdba74'), pal('Noir et jaune', '#0a0a0a', '#facc15')],
      M: { portrait: 25300, cover: 22895, gal: [3089, 16541, 22897, 48436, 38767, 16411], chef: 25299, ev: [3294, 41310], team: [24405, 44008], vids: [25299, 22902] },
      fr: { id: ['Taqueria La Lima', 'Taqueria', 'Tacos · Margaritas · Cuisine mexicaine'], ct: ['+1 819 555-0193', 'hola@lalima.ca', 'lalima.ca'], tiktok: true,
        about: ['La taqueria', 'Des tortillas de maïs pressées à la minute, des salsas maison et des margaritas au vrai jus de lime. Ambiance colorée et musique latine le week-end.'],
        menuTitle: 'La carte', note: 'Tortillas de maïs sans gluten. Demandez notre salsa la plus piquante… à vos risques !',
        menu: [['Tacos', 'Trois par portion', [['Al pastor', 'Porc mariné, ananas grillé', '15 $', 'Signature'], ['Poisson Baja', 'Poisson pané, chou, crème de lime', '16 $'], ['Champignons et fromage', 'Salsa verde', '14 $', 'Végé']]], ['À boire', '', [['Margarita classique', 'Tequila, lime, sel', '12 $'], ['Margarita mangue piment', '', '13 $', 'Épicé'], ['Horchata maison', '', '6 $', 'Sans alcool']]]],
        chef: ['Le chef', 'Carlos Whitaker', 'Chef taquero', 'Carlos a grandi entre Guadalajara et Gatineau. Ses recettes viennent de sa grand-mère, ses tortillas de maïs bleu du Mexique.', [['2011', 'Cuisinier à Guadalajara'], ['2016', 'Chef d’un food truck à Ottawa'], ['2020', 'Ouverture de La Lima']]],
        evTitle: 'Soirées', ev: [['Mariachis du samedi', 'Musique live et margaritas', 'Sam. 20 h'], ['Mardi tacos', 'Tacos à 3 $ et groupe latin', 'Mar. 19 h']],
        team: [['Sofia', 'Gérante'], ['Diego', 'Service et margaritas']],
        gal: ['Tacos et bière', 'Tacos végés', 'Tacos au poulet', 'Panier de tacos', 'Tacos du chef', 'Tacos de poisson'],
        vidTitle: 'En cuisine', vids: ['Garnir les tacos', 'Tacos au poulet en accéléré'],
        book: ['libro', 'https://www.libroreserve.com/taqueria-la-lima', 'Réserver une table', 'Fêtes et groupes jusqu’à 25 personnes.'],
        order: ['Commander pour emporter', 'https://example.com', 'Prêt en 15 minutes.'],
        hours: [['Mardi – jeudi', '11 h 30 – 22 h'], ['Vendredi – samedi', '11 h 30 – 23 h'], ['Dimanche – lundi', '12 h – 21 h']],
        locTitle: 'Nous trouver', loc: ['75, rue Laval, Gatineau (Québec) J8X 3H3', 'Vieux-Hull · Terrasse l’été'],
        rev: [['Émilie B.', 'Mardi tacos', 'Les al pastor sont à tomber, et quelle ambiance !'], ['Kevin L.', 'Pour emporter', 'Rapide, frais et généreux.']] },
      en: { id: ['La Lima Taqueria', 'Taqueria', 'Tacos · Margaritas · Mexican food'], ct: ['+1 512 555-0193', 'hola@lalimataqueria.com', 'lalimataqueria.com'], tiktok: true,
        about: ['The taqueria', 'Corn tortillas pressed to order, house salsas and margaritas with real lime juice. Colorful vibe and Latin music on weekends.'],
        menuTitle: 'Menu', note: 'Corn tortillas are gluten-free. Ask for our hottest salsa… at your own risk!',
        menu: [['Tacos', 'Three per order', [['Al pastor', 'Marinated pork, grilled pineapple', '$13', 'Signature'], ['Baja fish', 'Battered fish, cabbage, lime crema', '$14'], ['Mushroom & cheese', 'Salsa verde', '$12', 'Veggie']]], ['Drinks', '', [['Classic margarita', 'Tequila, lime, salt', '$11'], ['Mango chili margarita', '', '$12', 'Spicy'], ['House horchata', '', '$5', 'Zero-proof']]]],
        chef: ['The chef', 'Carlos Whitaker', 'Taquero', 'Carlos grew up between Guadalajara and Austin. His recipes come from his grandmother, his blue corn tortillas from Mexico.', [['2011', 'Line cook in Guadalajara'], ['2016', 'Food truck chef in Austin'], ['2020', 'Opened La Lima']]],
        evTitle: 'Events', ev: [['Mariachi Saturdays', 'Live music and margaritas', 'Sat 8 p.m.'], ['Taco Tuesday', '$3 tacos and a Latin band', 'Tue 7 p.m.']],
        team: [['Sofia', 'Manager'], ['Diego', 'Service & margaritas']],
        gal: ['Tacos & beer', 'Veggie tacos', 'Chicken tacos', 'Taco basket', 'Chef’s tacos', 'Fish tacos'],
        vidTitle: 'In the kitchen', vids: ['Building the tacos', 'Chicken tacos time-lapse'],
        book: ['opentable', 'https://www.opentable.com/r/la-lima-taqueria-austin', 'Book a table', 'Parties and groups up to 25.'],
        order: ['Order takeout', 'https://example.com', 'Ready in 15 minutes.'],
        hours: [['Tuesday – Thursday', '11:30 a.m. – 10 p.m.'], ['Friday – Saturday', '11:30 a.m. – 11 p.m.'], ['Sunday – Monday', 'noon – 9 p.m.']],
        locTitle: 'Find us', loc: ['1500 East 6th Street, Austin, TX 78702', 'East Austin · Patio'],
        rev: [['Emily B.', 'Taco Tuesday', 'The al pastor is incredible, and what a vibe!'], ['Kevin L.', 'Takeout', 'Fast, fresh and generous.']] } },
  ];

  const keepMedia = NFC.MEDIA.restaurant;
  resto.profiles = RESTO.map((p) => {
    if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: resto.demo, demoEn: resto.demoEn, palettes: resto.palettes, rec: resto.rec, media: keepMedia };
    return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
      demo: build(resto.demo, p.M, p.fr), demoEn: build(resto.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
  });
  resto.ex = 'Bistro, sushis, pizzeria, café, bar, microbrasserie…';
})();
