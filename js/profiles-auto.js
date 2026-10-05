/* Métiers du secteur « Automobile et mobilité » (10 métiers). Même principe que profiles.js.
   Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/auto/';
  const im = (id) => F + id + '.jpg';

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: im(M.portrait), cover: im(M.cover), logo: '' });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: L.wa ? phone : '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, L.so || { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.services, { on: true, title: L.servTitle || '', items: L.serv.map(([t, dd, p]) => ({ t, d: dd, p })) });
    const [provider, url, label, text] = L.book;
    Object.assign(b.booking, { on: true, mode: 'tool', provider, url, label, text, email });
    Object.assign(b.devis, { on: true, title: L.formTitle || '', email, text: L.form, photos: true, files: true });
    Object.assign(b.vehicules, { on: !!L.cars, title: L.carsTitle || '', items: (L.cars || []).map(([t, dd, p], i) => ({ t, d: dd, p, img: im(M.cars[i]), url: '' })) });
    Object.assign(b.garanties, { on: true, title: L.tagsTitle || '', tags: L.tags, text: '' });
    Object.assign(b.gallery, { on: true, title: L.galTitle || '', images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    Object.assign(b.hours, { on: true, rows: L.hours.map(([dd, h]) => ({ d: dd, h })), note: '' });
    Object.assign(b.location, { on: true, title: L.locTitle || '', address: L.loc[0], access: L.loc[1] });
    Object.assign(b.video, { on: true, url: '', src: F + 'v' + M.video + '.mp4', cover: im(M.video), cap: L.vid });
    Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    return d;
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: (M.cars || M.gal).slice(0, 3).map(im),
    video: { src: F + 'v' + M.video + '.mp4', poster: im(M.video), cap: L.vid },
  });

  const AUTO = [
    { id: 'garage', icon: 'wrench', keep: true, n: ['Garagiste', 'Auto repair shop'], ex: ['Entretien, réparation, pneus', 'Maintenance, repairs, tires'] },

    { id: 'collection', icon: 'car', rec: 'd10',
      n: ['Collectionneur de voitures de collection', 'Classic car collector'], ex: ['Vente, restauration, expositions', 'Sales, restoration, shows'],
      pal: [pal('Vert anglais', '#14532d', '#d4af37'), pal('Rouge course', '#b91c1c', '#f5e6d3'), pal('Bleu ciel', '#0284c7', '#fde68a'), pal('Crème', '#7a5c3e', '#f5e6d3'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Bordeaux', '#6b1d2a', '#e8c39e')],
      M: { portrait: 4189, cover: 4191, gal: [4190, 5017, 28995, 28992, 64, 4191], cars: [4191, 4190, 5017], video: 4189 },
      fr: { id: ['Harold Whitmore', 'Collectionneur et marchand', 'Voitures de collection · Restauration · Expositions', 'Whitmore Classiques'], ct: ['+1 450 555-0156', 'info@whitmoreclassiques.ca', 'whitmoreclassiques.ca'],
        about: ['La collection', 'Passionné depuis 30 ans, je déniche, restaure et vends des voitures de collection américaines et européennes des années 1950 à 1980. Chaque véhicule est documenté, inspecté et prêt à rouler.'],
        servTitle: 'Services', serv: [['Achat et vente', 'Estimation et dépôt-vente', 'Commission 8 %'], ['Restauration', 'Mécanique, carrosserie, sellerie', 'Sur soumission'], ['Recherche sur mesure', 'Le modèle de vos rêves, trouvé pour vous', '1 500 $'], ['Location pour tournages', 'Films, publicités, mariages', 'dès 450 $ / jour']],
        carsTitle: 'Voitures à vendre', cars: [['Chevrolet Bel Air · 1957', 'Bleu ciel · moteur V8 refait', '68 500 $'], ['Ford Fairlane · 1956', 'Deux tons · restauration complète', '54 900 $'], ['Alfa Romeo Spider · 1972', 'Rouge · cabriolet', '42 000 $']],
        tagsTitle: 'Engagements', tags: 'Historique documenté, Inspection mécanique, Livraison partout au Canada, Garde en entrepôt chauffé',
        formTitle: 'Vendre ou trouver une voiture', form: 'Modèle, année, état, photos : décrivez la voiture que vous vendez ou celle que vous cherchez.',
        galTitle: 'Dans le garage', gal: ['Classique cubaine', 'Coupé sport rouge', 'Balade en forêt', 'Sur la route', 'Tableau de bord', 'Chevrolet Bel Air'],
        book: ['calendly', 'https://calendly.com/whitmoreclassiques/visite', 'Prendre rendez-vous', 'Visite de la collection sur rendez-vous.'],
        hours: [['Jeudi – samedi', '10 h – 17 h'], ['Autres jours', 'Sur rendez-vous']],
        locTitle: 'La salle d’exposition', loc: ['2150, boulevard des Laurentides, Laval (Québec) H7K 2J2', 'Entrepôt chauffé · Stationnement gratuit'], vid: 'Au volant d’une décapotable',
        rev: [['Michel R.', 'Achat d’une Bel Air', 'Voiture exactement comme décrite, Harold connaît chaque boulon.'], ['Caroline T.', 'Location mariage', 'La Fairlane a fait sensation à notre mariage.']] },
      en: { id: ['Harold Whitmore', 'Collector & dealer', 'Classic cars · Restoration · Shows', 'Whitmore Classics'], ct: ['+1 615 555-0156', 'info@whitmoreclassics.com', 'whitmoreclassics.com'],
        about: ['The collection', 'A passionate collector for 30 years, I find, restore and sell American and European classics from the 1950s to the 1980s. Every car is documented, inspected and road-ready.'],
        servTitle: 'Services', serv: [['Buy & sell', 'Appraisal and consignment', '8% commission'], ['Restoration', 'Mechanical, body, upholstery', 'Custom quote'], ['Car search', 'Your dream model, found for you', '$1,500'], ['Film & event rental', 'Movies, ads, weddings', 'from $450 / day']],
        carsTitle: 'Cars for sale', cars: [['Chevrolet Bel Air · 1957', 'Sky blue · rebuilt V8', '$68,500'], ['Ford Fairlane · 1956', 'Two-tone · full restoration', '$54,900'], ['Alfa Romeo Spider · 1972', 'Red · convertible', '$42,000']],
        tagsTitle: 'Our promise', tags: 'Documented history, Mechanical inspection, Nationwide shipping, Climate-controlled storage',
        formTitle: 'Sell or find a car', form: 'Model, year, condition, photos: describe the car you’re selling or the one you’re looking for.',
        galTitle: 'In the garage', gal: ['Cuban classic', 'Red sports coupe', 'Forest drive', 'On the road', 'Dashboard', 'Chevrolet Bel Air'],
        book: ['calendly', 'https://calendly.com/whitmoreclassics/visit', 'Book a visit', 'Showroom visits by appointment.'],
        hours: [['Thursday – Saturday', '10 a.m. – 5 p.m.'], ['Other days', 'By appointment']],
        locTitle: 'The showroom', loc: ['1100 Fatherland Street, Nashville, TN 37206', 'Climate-controlled warehouse · Free parking'], vid: 'Behind the wheel of a convertible',
        rev: [['Mike R.', 'Bought a Bel Air', 'Exactly as described, Harold knows every bolt.'], ['Carol T.', 'Wedding rental', 'The Fairlane was the star of our wedding.']] } },

    { id: 'occasion', icon: 'badge-dollar-sign', rec: 'd8',
      n: ['Vendeur de véhicules d’occasion', 'Used car dealer'], ex: ['Inventaire, financement, échanges', 'Inventory, financing, trade-ins'],
      pal: [pal('Bleu roi', '#1d4ed8', '#fbbf24'), pal('Rouge course', '#b91c1c', '#f8fafc'), pal('Noir carbone', '#18181b', '#22c55e'), pal('Vert pomme', '#4d7c0f', '#fde047'), pal('Orange', '#ea580c', '#1f2937'), pal('Graphite', '#27272a', '#38bdf8')],
      M: { portrait: 23989, cover: 47958, gal: [23476, 47957, 53, 71, 69, 72], cars: [53, 69, 71], video: 23476 },
      fr: { id: ['Brandon Hayes', 'Conseiller en vente', 'Véhicules d’occasion inspectés · Financement', 'Autos Hayes'], ct: ['+1 819 555-0177', 'ventes@autoshayes.ca', 'autoshayes.ca'], wa: true,
        about: ['Le concessionnaire', 'Plus de 120 véhicules d’occasion inspectés en 150 points, avec historique Carfax. Financement pour tous les dossiers, échange de votre véhicule et garantie prolongée disponible.'],
        servTitle: 'Nos services', serv: [['Financement', 'Approbation en 24 h, tous dossiers', 'Dès 4,99 %'], ['Échange', 'Évaluation gratuite de votre véhicule', 'Gratuit'], ['Garantie prolongée', 'Jusqu’à 5 ans', 'Sur demande'], ['Livraison', 'À votre porte au Québec', 'Gratuite à moins de 100 km']],
        carsTitle: 'Véhicules à vendre', cars: [['Ford Mustang · 2019', '62 000 km · V8 · Manuelle', '32 900 $'], ['Chevrolet Camaro SS · 2018', '71 000 km · Automatique', '34 500 $'], ['Dodge Charger · 2020', '48 000 km · Toit ouvrant', '29 900 $']],
        tagsTitle: 'Nos garanties', tags: 'Inspection 150 points, Rapport Carfax inclus, Essai routier à domicile, 30 jours ou 2 000 km d’échange',
        formTitle: 'Évaluer mon échange', form: 'Marque, modèle, année, kilométrage : recevez une offre pour votre véhicule actuel.',
        galTitle: 'Le lot', gal: ['Remise des clés', 'Notre inventaire', 'Sportive', 'Muscle car', 'Coupé noir', 'Essai routier'],
        book: ['calendly', 'https://calendly.com/autoshayes/essai', 'Réserver un essai routier', 'Essai routier sur rendez-vous, 7 jours sur 7.'],
        hours: [['Lundi – jeudi', '9 h – 21 h'], ['Vendredi', '9 h – 18 h'], ['Samedi', '10 h – 16 h']],
        locTitle: 'Le concessionnaire', loc: ['4500, boulevard Bourque, Sherbrooke (Québec) J1N 1S3', 'Stationnement clients · Salle d’attente avec café'], vid: 'Une famille repart avec sa voiture',
        rev: [['Jessica M.', 'Premier achat', 'Financement accepté le jour même, aucune pression.'], ['Olivier P.', 'Échange', 'Bon prix pour mon ancien véhicule, transaction rapide.']] },
      en: { id: ['Brandon Hayes', 'Sales consultant', 'Inspected pre-owned vehicles · Financing', 'Hayes Auto Sales'], ct: ['+1 404 555-0177', 'sales@hayesauto.com', 'hayesauto.com'], wa: true,
        about: ['The dealership', 'Over 120 pre-owned vehicles with a 150-point inspection and a Carfax report. Financing for all credit, trade-ins welcome and extended warranties available.'],
        servTitle: 'Our services', serv: [['Financing', 'Approval in 24 hours, all credit', 'From 4.99% APR'], ['Trade-in', 'Free vehicle appraisal', 'Free'], ['Extended warranty', 'Up to 5 years', 'On request'], ['Home delivery', 'Right to your door', 'Free within 60 miles']],
        carsTitle: 'Vehicles for sale', cars: [['Ford Mustang · 2019', '38,000 mi · V8 · Manual', '$27,900'], ['Chevrolet Camaro SS · 2018', '44,000 mi · Automatic', '$29,500'], ['Dodge Charger · 2020', '30,000 mi · Sunroof', '$25,900']],
        tagsTitle: 'Our guarantees', tags: '150-point inspection, Carfax report included, Test drive at home, 30-day exchange',
        formTitle: 'Value my trade', form: 'Make, model, year, mileage: get an offer on your current vehicle.',
        galTitle: 'The lot', gal: ['Handing over the keys', 'Our inventory', 'Sports car', 'Muscle car', 'Black coupe', 'Test drive'],
        book: ['calendly', 'https://calendly.com/hayesauto/test-drive', 'Book a test drive', 'Test drives by appointment, 7 days a week.'],
        hours: [['Monday – Thursday', '9 a.m. – 9 p.m.'], ['Friday', '9 a.m. – 6 p.m.'], ['Saturday', '10 a.m. – 4 p.m.']],
        locTitle: 'The dealership', loc: ['3200 Peachtree Industrial Boulevard, Duluth, GA 30096', 'Customer parking · Lounge with coffee'], vid: 'A family drives off in their new car',
        rev: [['Jessica M.', 'First car', 'Financing approved the same day, zero pressure.'], ['Oliver P.', 'Trade-in', 'Fair price for my old car, quick deal.']] } },

    { id: 'esthetique', icon: 'sparkles', rec: 'd3',
      n: ['Esthétique automobile', 'Auto detailing'], ex: ['Lavage, polissage, céramique', 'Wash, polish, ceramic coating'],
      pal: [pal('Bleu électrique', '#1d4ed8', '#67e8f9'), pal('Noir carbone', '#18181b', '#38bdf8'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Rouge course', '#b91c1c', '#fecaca'), pal('Argent', '#374151', '#cbd5e1'), pal('Violet', '#6d28d9', '#c4b5fd')],
      M: { portrait: 47834, cover: 47588, gal: [47829, 47830, 47831, 47832, 47585, 49064], video: 47834 },
      fr: { id: ['Cody Ramsey', 'Esthéticien automobile', 'Lavage · Polissage · Céramique', 'Brillance Auto Spa'], ct: ['+1 418 555-0132', 'rdv@brillanceauto.ca', 'brillanceauto.ca'], wa: true,
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/' },
        about: ['L’atelier', 'Votre véhicule comme sorti du concessionnaire : lavage à la main, décontamination, polissage en plusieurs étapes et protection céramique. Intérieur shampouiné et cuir nourri.'],
        servTitle: 'Forfaits', serv: [['Lavage intérieur et extérieur', 'À la main · 2 h', '149 $'], ['Polissage', 'Correction des micro-rayures', 'dès 399 $'], ['Protection céramique', 'Brillance et protection 3 ans', 'dès 899 $'], ['Traitement antirouille', 'Avant l’hiver', '129 $']],
        tagsTitle: 'Pourquoi nous', tags: 'Produits haut de gamme, Atelier chauffé, Navette offerte, Photos avant et après',
        formTitle: 'Demander une soumission', form: 'Modèle, couleur, état de la peinture : joignez quelques photos de votre véhicule.',
        galTitle: 'Avant et après', gal: ['Polisseuse', 'Correction de la peinture', 'Finition', 'Cuir nettoyé', 'Lavage à la mousse', 'Aspiration de l’habitacle'],
        book: ['square', 'https://book.squareup.com/appointments/brillance-auto', 'Réserver mon lavage', 'Rendez-vous en ligne, voiture prête en fin de journée.'],
        hours: [['Lundi – vendredi', '8 h – 18 h'], ['Samedi', '9 h – 15 h']],
        locTitle: 'L’atelier', loc: ['2995, boulevard Hamel, Québec (Québec) G1P 2J1', 'Atelier chauffé · Navette offerte'], vid: 'Le polissage',
        rev: [['Mathieu G.', 'Protection céramique', 'Ma voiture brille plus qu’à l’achat !'], ['Annie B.', 'Lavage complet', 'Intérieur impeccable, même les poils de chien ont disparu.']] },
      en: { id: ['Cody Ramsey', 'Auto detailer', 'Wash · Polish · Ceramic coating', 'Shine Auto Spa'], ct: ['+1 480 555-0132', 'book@shineautospa.com', 'shineautospa.com'], wa: true,
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/' },
        about: ['The shop', 'Your car like it just left the dealership: hand wash, decontamination, multi-stage polish and ceramic protection. Shampooed interior and conditioned leather.'],
        servTitle: 'Packages', serv: [['Interior & exterior detail', 'By hand · 2 hrs', '$149'], ['Paint correction', 'Swirl and scratch removal', 'from $399'], ['Ceramic coating', 'Gloss and 3-year protection', 'from $899'], ['Headlight restoration', 'Crystal-clear lenses', '$89']],
        tagsTitle: 'Why us', tags: 'Premium products, Indoor shop, Free shuttle, Before & after photos',
        formTitle: 'Request a quote', form: 'Model, color, paint condition: attach a few photos of your car.',
        galTitle: 'Before & after', gal: ['Polisher', 'Paint correction', 'Finishing', 'Leather cleaned', 'Foam wash', 'Interior vacuum'],
        book: ['square', 'https://book.squareup.com/appointments/shine-auto-spa', 'Book my detail', 'Book online, car ready by end of day.'],
        hours: [['Monday – Friday', '8 a.m. – 6 p.m.'], ['Saturday', '9 a.m. – 3 p.m.']],
        locTitle: 'The shop', loc: ['7400 East Greenway Parkway, Scottsdale, AZ 85260', 'Indoor shop · Free shuttle'], vid: 'Polishing',
        rev: [['Matt G.', 'Ceramic coating', 'My car shines more than the day I bought it!'], ['Annie B.', 'Full detail', 'Spotless interior, even the dog hair is gone.']] } },

    { id: 'moto', icon: 'bike', rec: 'd5',
      n: ['Atelier de moto', 'Motorcycle shop'], ex: ['Entretien, réparation, préparation', 'Service, repair, custom builds'],
      pal: [pal('Orange piste', '#c2410c', '#1f2937'), pal('Noir carbone', '#18181b', '#f97316'), pal('Rouge course', '#b91c1c', '#fbbf24'), pal('Gris acier', '#374151', '#facc15'), pal('Vert anglais', '#14532d', '#d4af37'), pal('Bleu nuit', '#1e3a8a', '#f97316')],
      M: { portrait: 41939, cover: 41940, gal: [41928, 41930, 41933, 41935, 41936, 41947], video: 41933 },
      fr: { id: ['Wyatt Crawford', 'Mécanicien moto', 'Entretien · Réparation · Préparation', 'Crawford Moto'], ct: ['+1 450 555-0144', 'atelier@crawfordmoto.ca', 'crawfordmoto.ca'], wa: true,
        so: { instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' },
        about: ['L’atelier', 'Motards nous-mêmes, nous entretenons et réparons toutes les marques : routières, sportives, customs et motocross. Mise en route du printemps, remisage l’hiver et préparation sur mesure.'],
        servTitle: 'Tarifs', serv: [['Mise en route du printemps', 'Batterie, huile, freins, pneus', '189 $'], ['Entretien complet', 'Selon le carnet', 'dès 249 $'], ['Remisage hivernal', 'Entreposage chauffé', '45 $ / mois'], ['Préparation custom', 'Échappement, selle, guidon', 'Sur soumission']],
        tagsTitle: 'L’atelier', tags: 'Toutes marques, Pièces d’origine, Entreposage chauffé, Prêt de casque pour l’essai',
        formTitle: 'Demander une soumission', form: 'Marque, modèle, année et travaux souhaités : joignez des photos de votre moto.',
        galTitle: 'À l’atelier', gal: ['Réglages moteur', 'Réservoir', 'Mécanique', 'Entretien', 'Changement d’huile', 'Nos motos'],
        book: ['shopmonkey', 'https://shopmonkey.io/book/crawford-moto', 'Prendre rendez-vous', 'Réservez tôt pour la mise en route d’avril.'],
        hours: [['Mardi – vendredi', '8 h – 18 h'], ['Samedi', '9 h – 14 h'], ['Novembre – mars', 'Sur rendez-vous']],
        locTitle: 'L’atelier', loc: ['1500, boulevard Curé-Labelle, Blainville (Québec) J7C 2M1', 'Stationnement motos · Café pour les clients'], vid: 'Réparation d’un moteur',
        rev: [['Steve L.', 'Mise en route', 'Ma Harley n’a jamais aussi bien roulé.'], ['Julie R.', 'Remisage', 'Moto rendue propre et prête au printemps.']] },
      en: { id: ['Wyatt Crawford', 'Motorcycle mechanic', 'Service · Repair · Custom builds', 'Crawford Moto'], ct: ['+1 720 555-0144', 'shop@crawfordmoto.com', 'crawfordmoto.com'], wa: true,
        so: { instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' },
        about: ['The shop', 'Riders ourselves, we service and repair every make: touring, sport, custom and dirt bikes. Spring tune-ups, winter storage and custom builds.'],
        servTitle: 'Pricing', serv: [['Spring tune-up', 'Battery, oil, brakes, tires', '$189'], ['Full service', 'Per the manual', 'from $249'], ['Winter storage', 'Heated storage', '$45 / mo'], ['Custom build', 'Exhaust, seat, bars', 'Custom quote']],
        tagsTitle: 'The shop', tags: 'All makes, OEM parts, Heated storage, Loaner helmet for test rides',
        formTitle: 'Request a quote', form: 'Make, model, year and work needed: attach photos of your bike.',
        galTitle: 'In the shop', gal: ['Engine tuning', 'Tank', 'Mechanics', 'Service', 'Oil change', 'Our bikes'],
        book: ['shopmonkey', 'https://shopmonkey.io/book/crawford-moto', 'Book service', 'Book early for April tune-ups.'],
        hours: [['Tuesday – Friday', '8 a.m. – 6 p.m.'], ['Saturday', '9 a.m. – 2 p.m.'], ['November – March', 'By appointment']],
        locTitle: 'The shop', loc: ['2800 Larimer Street, Denver, CO 80205', 'Motorcycle parking · Coffee for customers'], vid: 'Engine repair',
        rev: [['Steve L.', 'Tune-up', 'My Harley has never run better.'], ['Julie R.', 'Storage', 'Bike came back clean and ready for spring.']] } },

    { id: 'luxe', icon: 'gem', rec: 'd5',
      n: ['Voitures de luxe et de sport', 'Luxury & sports cars'], ex: ['Vente, location, essais', 'Sales, rentals, test drives'],
      pal: [pal('Noir & or', '#1c1917', '#c9a227'), pal('Rouge course', '#b91c1c', '#111111'), pal('Bleu nuit', '#1e2a4a', '#d8b46a'), pal('Argent', '#374151', '#e5e7eb'), pal('Vert anglais', '#14532d', '#d4af37'), pal('Violet', '#4c1d95', '#f472b6')],
      M: { portrait: 44560, cover: 35576, gal: [35540, 35205, 49, 50, 35577, 64], cars: [35576, 35577, 35230], video: 35576 },
      fr: { id: ['Victoria Ashford', 'Conseillère prestige', 'Voitures de sport · Luxe · Location', 'Ashford Prestige'], ct: ['+1 514 555-0109', 'prestige@ashford.ca', 'ashfordprestige.ca'],
        so: { instagram: 'https://instagram.com/', linkedin: 'https://linkedin.com/' },
        about: ['La maison', 'Une sélection de voitures de sport et de luxe certifiées, présentées dans notre salle d’exposition privée. Vente, location à la journée et essais sur circuit pour nos clients.'],
        servTitle: 'Services', serv: [['Vente de véhicules certifiés', 'Inspection et historique complets', 'Sur demande'], ['Location à la journée', 'Avec assurance', 'dès 650 $ / jour'], ['Essai sur circuit', 'Accompagné d’un pilote', '890 $'], ['Recherche personnalisée', 'Le modèle exact que vous voulez', 'Sur demande']],
        carsTitle: 'En salle d’exposition', cars: [['Coupé sport V8 · 2023', '8 000 km · Rouge', '189 000 $'], ['Cabriolet grand tourisme · 2022', '12 000 km · Bleu', '164 000 $'], ['Coupé GT · 2021', '19 000 km · Blanc', '138 000 $']],
        tagsTitle: 'L’expérience', tags: 'Salle d’exposition privée, Livraison en plateau fermé, Financement et location, Conciergerie',
        formTitle: 'Demande de rendez-vous privé', form: 'Modèle recherché, budget, date souhaitée : nous préparons votre visite.',
        galTitle: 'La collection', gal: ['Grand tourisme', 'Sur la route', 'Détails', 'Profil', 'Cabriolet', 'Tableau de bord'],
        book: ['calendly', 'https://calendly.com/ashfordprestige/visite-privee', 'Réserver une visite privée', 'Visites en soirée possibles.'],
        hours: [['Lundi – vendredi', '10 h – 19 h'], ['Samedi', '10 h – 16 h']],
        locTitle: 'La salle d’exposition', loc: ['1500, rue Peel, Montréal (Québec) H3A 1S8', 'Centre-ville · Stationnement privé'], vid: 'Présentation en salle',
        rev: [['Philippe D.', 'Achat', 'Service irréprochable, livraison en plateau fermé jusqu’à chez moi.'], ['Sarah K.', 'Essai sur circuit', 'Une journée inoubliable.']] },
      en: { id: ['Victoria Ashford', 'Prestige advisor', 'Sports cars · Luxury · Rentals', 'Ashford Prestige'], ct: ['+1 305 555-0109', 'prestige@ashfordprestige.com', 'ashfordprestige.com'],
        so: { instagram: 'https://instagram.com/', linkedin: 'https://linkedin.com/' },
        about: ['The house', 'A curated selection of certified sports and luxury cars, shown in our private showroom. Sales, daily rentals and track days for our clients.'],
        servTitle: 'Services', serv: [['Certified vehicle sales', 'Full inspection and history', 'On request'], ['Daily rental', 'Insurance included', 'from $650 / day'], ['Track day', 'With a professional driver', '$890'], ['Personal search', 'The exact model you want', 'On request']],
        carsTitle: 'In the showroom', cars: [['V8 sports coupe · 2023', '5,000 mi · Red', '$149,000'], ['Grand touring convertible · 2022', '7,500 mi · Blue', '$129,000'], ['GT coupe · 2021', '12,000 mi · White', '$109,000']],
        tagsTitle: 'The experience', tags: 'Private showroom, Enclosed delivery, Financing & leasing, Concierge service',
        formTitle: 'Request a private appointment', form: 'Model, budget, preferred date: we’ll prepare your visit.',
        galTitle: 'The collection', gal: ['Grand tourer', 'On the road', 'Details', 'Profile', 'Convertible', 'Dashboard'],
        book: ['calendly', 'https://calendly.com/ashfordprestige/private-visit', 'Book a private visit', 'Evening visits available.'],
        hours: [['Monday – Friday', '10 a.m. – 7 p.m.'], ['Saturday', '10 a.m. – 4 p.m.']],
        locTitle: 'The showroom', loc: ['3401 NE 1st Avenue, Miami, FL 33137', 'Design District · Private parking'], vid: 'Showroom reveal',
        rev: [['Phil D.', 'Purchase', 'Flawless service, enclosed delivery right to my door.'], ['Sarah K.', 'Track day', 'An unforgettable day.']] } },

    { id: 'electrique', icon: 'plug-zap', rec: 'd9',
      n: ['Véhicules électriques et recharge', 'EVs & charging'], ex: ['Vente, bornes, entretien VE', 'Sales, chargers, EV service'],
      pal: [pal('Vert électrique', '#047857', '#a7f3d0'), pal('Bleu électrique', '#1d4ed8', '#67e8f9'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Graphite', '#27272a', '#a3e635'), pal('Bleu ciel', '#0284c7', '#bae6fd'), pal('Violet', '#6d28d9', '#c4b5fd')],
      M: { portrait: 22982, cover: 23125, gal: [23126, 52427, 35230, 22982, 23125, 35205], cars: [23126, 35230, 52427], video: 23126 },
      fr: { id: ['Ethan Cole', 'Spécialiste véhicules électriques', 'Vente · Bornes de recharge · Entretien VE', 'Volt Auto'], ct: ['+1 418 555-0187', 'info@voltauto.ca', 'voltauto.ca'],
        about: ['Notre mission', 'Nous accompagnons votre passage à l’électrique : choix du véhicule, subventions Roulez vert, installation de borne à domicile et entretien spécialisé des VE et hybrides.'],
        servTitle: 'Services', serv: [['Installation de borne niveau 2', 'Maison ou condo', 'dès 1 495 $'], ['Entretien VE', 'Freins, batterie 12 V, climatisation', 'dès 129 $'], ['Diagnostic de batterie', 'État de santé complet', '149 $'], ['Aide aux subventions', 'Roulez vert et municipales', 'Gratuit']],
        carsTitle: 'Électriques à vendre', cars: [['Berline électrique · 2023', '22 000 km · autonomie 450 km', '39 900 $'], ['Coupé électrique · 2022', '30 000 km · recharge rapide', '44 500 $'], ['VUS électrique · 2021', '41 000 km · traction intégrale', '36 900 $']],
        tagsTitle: 'Nos engagements', tags: 'Maîtres électriciens certifiés, Subventions incluses dans le prix, Batterie testée, Essai d’une semaine',
        formTitle: 'Soumission pour une borne', form: 'Type de résidence, distance du panneau électrique, véhicule : nous vous rappelons sous 48 h.',
        galTitle: 'Électrique au quotidien', gal: ['À la borne', 'Sur la route', 'Sportive électrique', 'Recharge', 'Station de recharge', 'En voyage'],
        book: ['calendly', 'https://calendly.com/voltauto/rendez-vous', 'Prendre rendez-vous', 'Essai d’un véhicule électrique sur rendez-vous.'],
        hours: [['Lundi – vendredi', '8 h – 18 h'], ['Samedi', '9 h – 15 h']],
        locTitle: 'Nous trouver', loc: ['2475, boulevard Laurier, Québec (Québec) G1V 2L2', 'Bornes de recharge gratuites pour nos clients'], vid: 'Une recharge à la borne',
        rev: [['Marc-Olivier T.', 'Borne à domicile', 'Installation propre en une journée, subvention gérée pour moi.'], ['Isabelle P.', 'Achat VE', 'Ils m’ont tout expliqué sur l’autonomie en hiver.']] },
      en: { id: ['Ethan Cole', 'EV specialist', 'Sales · Home chargers · EV service', 'Volt Auto'], ct: ['+1 503 555-0187', 'info@voltauto.com', 'voltauto.com'],
        about: ['Our mission', 'We help you go electric: choosing the right car, federal and state incentives, home charger installation and specialized EV and hybrid service.'],
        servTitle: 'Services', serv: [['Level 2 charger install', 'House or condo', 'from $1,495'], ['EV service', 'Brakes, 12V battery, A/C', 'from $129'], ['Battery health check', 'Full report', '$149'], ['Incentive help', 'Federal and state rebates', 'Free']],
        carsTitle: 'EVs for sale', cars: [['Electric sedan · 2023', '14,000 mi · 280-mile range', '$33,900'], ['Electric coupe · 2022', '19,000 mi · fast charging', '$37,500'], ['Electric SUV · 2021', '26,000 mi · all-wheel drive', '$30,900']],
        tagsTitle: 'Our promise', tags: 'Licensed electricians, Rebates applied up front, Battery tested, One-week test drive',
        formTitle: 'Charger install quote', form: 'Home type, distance to your panel, vehicle: we’ll call you back within 48 hours.',
        galTitle: 'Everyday electric', gal: ['At the charger', 'On the road', 'Electric sports car', 'Charging', 'Charging station', 'Road trip'],
        book: ['calendly', 'https://calendly.com/voltauto/appointment', 'Book an appointment', 'EV test drives by appointment.'],
        hours: [['Monday – Friday', '8 a.m. – 6 p.m.'], ['Saturday', '9 a.m. – 3 p.m.']],
        locTitle: 'Find us', loc: ['1800 SE Hawthorne Boulevard, Portland, OR 97214', 'Free charging for customers'], vid: 'Charging up',
        rev: [['Mark T.', 'Home charger', 'Clean install in one day, they handled the rebate for me.'], ['Isabel P.', 'EV purchase', 'They explained everything about winter range.']] } },

    { id: 'camion', icon: 'truck', rec: 'd1',
      n: ['Transport et camionnage', 'Trucking & freight'], ex: ['Transport de marchandises, logistique', 'Freight, logistics'],
      pal: [pal('Bleu acier', '#1f3a5f', '#f97316'), pal('Rouge brique', '#9f1239', '#fbbf24'), pal('Vert forêt', '#166534', '#fde047'), pal('Graphite', '#27272a', '#facc15'), pal('Orange sécurité', '#c2410c', '#1f2937'), pal('Bleu marine', '#1e3a8a', '#e5e7eb')],
      M: { portrait: 23852, cover: 45488, gal: [23011, 23174, 26005, 28787, 17228, 41535], video: 28787 },
      fr: { id: ['Dale Hutchins', 'Président', 'Transport routier · Canada – États-Unis', 'Transport Hutchins'], ct: ['+1 819 555-0103', 'repartition@transporthutchins.ca', 'transporthutchins.ca'],
        so: { linkedin: 'https://linkedin.com/', facebook: 'https://facebook.com/' },
        about: ['L’entreprise', 'Entreprise familiale depuis 1992 : 45 camions, transport de charges complètes et partielles au Québec, en Ontario et aux États-Unis. Suivi GPS en temps réel et répartition 24 h sur 24.'],
        servTitle: 'Services', serv: [['Charges complètes (FTL)', 'Québec, Ontario, Nord-Est américain', 'Sur soumission'], ['Charges partielles (LTL)', 'Regroupement de marchandises', 'Sur soumission'], ['Transport réfrigéré', 'Produits frais et congelés', 'Sur soumission'], ['Entreposage', 'Entrepôt de 4 000 m²', 'Au mois']],
        tagsTitle: 'Nos certifications', tags: 'Suivi GPS en temps réel, Transporteur certifié PIP/C-TPAT, Assurance cargo 2 M$, Répartition 24/7',
        formTitle: 'Demande de transport', form: 'Origine, destination, type de marchandise, poids et date : nous vous envoyons un prix sous 2 h.',
        galTitle: 'Sur la route', gal: ['Au quai de chargement', 'Arrivée à l’entrepôt', 'Traversée de la forêt', 'Sur l’autoroute', 'De nuit', 'Grands espaces'],
        book: ['calendly', 'https://calendly.com/transporthutchins/appel', 'Planifier un appel', 'Nos répartiteurs vous rappellent rapidement.'],
        hours: [['Bureau · lundi – vendredi', '7 h – 18 h'], ['Répartition', '24 h sur 24, 7 jours sur 7']],
        locTitle: 'Le terminal', loc: ['2500, rue Dollard, Drummondville (Québec) J2C 4M3', 'Accès autoroute 20 · Stationnement remorques'], vid: 'Sur l’autoroute',
        rev: [['Distribution Lavoie', 'Client depuis 2015', 'Toujours à l’heure, suivi impeccable.'], ['Ferme Bellevue', 'Transport réfrigéré', 'Nos produits arrivent frais à Boston chaque semaine.']] },
      en: { id: ['Dale Hutchins', 'President', 'Trucking · U.S. – Canada', 'Hutchins Freight'], ct: ['+1 614 555-0103', 'dispatch@hutchinsfreight.com', 'hutchinsfreight.com'],
        so: { linkedin: 'https://linkedin.com/', facebook: 'https://facebook.com/' },
        about: ['The company', 'Family-owned since 1992: 45 trucks moving full and partial loads across the Midwest, the Northeast and into Canada. Real-time GPS tracking and 24/7 dispatch.'],
        servTitle: 'Services', serv: [['Full truckload (FTL)', 'Midwest, Northeast, Canada', 'Custom quote'], ['Less than truckload (LTL)', 'Consolidated freight', 'Custom quote'], ['Refrigerated', 'Fresh and frozen goods', 'Custom quote'], ['Warehousing', '43,000 sq ft warehouse', 'Monthly']],
        tagsTitle: 'Certifications', tags: 'Real-time GPS tracking, C-TPAT certified carrier, $2M cargo insurance, 24/7 dispatch',
        formTitle: 'Request a load quote', form: 'Origin, destination, commodity, weight and date: we’ll send a rate within 2 hours.',
        galTitle: 'On the road', gal: ['At the loading dock', 'Arriving at the warehouse', 'Through the forest', 'On the interstate', 'At night', 'Open road'],
        book: ['calendly', 'https://calendly.com/hutchinsfreight/call', 'Schedule a call', 'Our dispatchers call you back fast.'],
        hours: [['Office · Monday – Friday', '7 a.m. – 6 p.m.'], ['Dispatch', '24/7']],
        locTitle: 'The terminal', loc: ['4200 Alum Creek Drive, Columbus, OH 43207', 'I-70 access · Trailer parking'], vid: 'On the interstate',
        rev: [['Lavoie Distribution', 'Customer since 2015', 'Always on time, flawless tracking.'], ['Bellevue Farm', 'Refrigerated', 'Our produce arrives fresh in Boston every week.']] } },

    { id: 'chauffeur', icon: 'steering-wheel', rec: 'd5',
      n: ['Chauffeur privé', 'Private driver'], ex: ['Aéroport, affaires, événements', 'Airport, business, events'],
      pal: [pal('Noir & or', '#1c1917', '#c9a227'), pal('Bleu nuit', '#1e2a4a', '#d8b46a'), pal('Graphite', '#27272a', '#e5e7eb'), pal('Bordeaux', '#6b1d2a', '#e8c39e'), pal('Vert anglais', '#14532d', '#d4af37'), pal('Argent', '#374151', '#cbd5e1')],
      M: { portrait: 72, cover: 17293, gal: [4331, 4338, 45260, 64, 69, 53], video: 17293 },
      fr: { id: ['James Holloway', 'Chauffeur privé', 'Aéroport · Affaires · Événements', 'Holloway Chauffeur'], ct: ['+1 514 555-0192', 'reservation@hollowaychauffeur.ca', 'hollowaychauffeur.ca'], wa: true,
        about: ['Le service', 'Transport privé haut de gamme à Montréal : transferts aéroport, déplacements d’affaires, mariages et soirées. Véhicules récents, eau et Wi-Fi à bord, ponctualité garantie.'],
        servTitle: 'Tarifs', serv: [['Transfert aéroport YUL', 'Centre-ville ↔ aéroport', '95 $'], ['Mise à disposition', 'Minimum 3 heures', '85 $ / h'], ['Mariage', 'Véhicule décoré, 4 heures', '450 $'], ['Montréal ↔ Québec', 'Aller simple', '425 $']],
        tagsTitle: 'Inclus', tags: 'Suivi des vols, Attente gratuite 30 min, Wi-Fi et eau à bord, Facturation entreprise',
        formTitle: 'Demander un tarif', form: 'Date, heure, adresse de départ et d’arrivée, nombre de passagers : réponse rapide.',
        galTitle: 'De jour comme de nuit', gal: ['Sous la pluie', 'Carrefour de nuit', 'Autoroute de nuit', 'Le tableau de bord', 'À votre service', 'Le véhicule'],
        book: ['calendly', 'https://calendly.com/hollowaychauffeur/reservation', 'Réserver un trajet', 'Réservation 24 h à l’avance recommandée.'],
        hours: [['7 jours sur 7', '24 h sur 24']],
        locTitle: 'Zone desservie', loc: ['1000, rue De La Gauchetière Ouest, Montréal (Québec) H3B 4W5', 'Grand Montréal, aéroports YUL et Mirabel'], vid: 'La ville de nuit',
        rev: [['Agence Nordique', 'Client entreprise', 'Ponctuel et discret, nos invités adorent.'], ['Sophie L.', 'Mariage', 'Voiture impeccable, chauffeur attentionné.']] },
      en: { id: ['James Holloway', 'Private chauffeur', 'Airport · Business · Events', 'Holloway Chauffeur'], ct: ['+1 212 555-0192', 'book@hollowaychauffeur.com', 'hollowaychauffeur.com'], wa: true,
        about: ['The service', 'Premium private transportation in New York: airport transfers, business travel, weddings and nights out. Late-model vehicles, water and Wi-Fi on board, guaranteed punctuality.'],
        servTitle: 'Rates', serv: [['JFK / LGA transfer', 'Manhattan ↔ airport', '$135'], ['Hourly service', '3-hour minimum', '$110 / hr'], ['Wedding', 'Decorated car, 4 hours', '$595'], ['NYC ↔ Philadelphia', 'One way', '$395']],
        tagsTitle: 'Included', tags: 'Flight tracking, 30 min free wait, Wi-Fi & water on board, Corporate billing',
        formTitle: 'Get a quote', form: 'Date, time, pickup and drop-off, number of passengers: quick reply.',
        galTitle: 'Day or night', gal: ['In the rain', 'Night intersection', 'Highway at night', 'Dashboard', 'At your service', 'The car'],
        book: ['calendly', 'https://calendly.com/hollowaychauffeur/booking', 'Book a ride', 'Book 24 hours ahead when possible.'],
        hours: [['7 days a week', '24 hours']],
        locTitle: 'Service area', loc: ['350 Fifth Avenue, New York, NY 10118', 'NYC metro, JFK, LGA and Newark'], vid: 'The city at night',
        rev: [['Nordic Agency', 'Corporate client', 'Punctual and discreet, our guests love it.'], ['Sophie L.', 'Wedding', 'Spotless car, attentive driver.']] } },

    { id: 'pneus', icon: 'circle-dot', rec: 'd1',
      n: ['Centre du pneu', 'Tire center'], ex: ['Pneus, alignement, entreposage', 'Tires, alignment, storage'],
      pal: [pal('Jaune pneu', '#a16207', '#111111'), pal('Noir carbone', '#18181b', '#facc15'), pal('Rouge course', '#b91c1c', '#fbbf24'), pal('Bleu roi', '#1d4ed8', '#fde047'), pal('Gris acier', '#374151', '#38bdf8'), pal('Orange', '#ea580c', '#1f2937')],
      M: { portrait: 40065, cover: 47468, gal: [16983, 13260, 41937, 13180, 4716, 13270], video: 16983 },
      fr: { id: ['Travis Boone', 'Propriétaire', 'Pneus · Alignement · Entreposage', 'Centre du pneu Boone'], ct: ['+1 418 555-0165', 'info@pneusboone.ca', 'pneusboone.ca'], wa: true,
        about: ['Le centre', 'Plus de 3 000 pneus en stock, toutes marques. Installation et balancement le jour même, alignement au laser et entreposage de vos pneus d’une saison à l’autre.'],
        servTitle: 'Tarifs', serv: [['Pose de pneus d’hiver', 'Installation et balancement', '89 $ / 4 pneus'], ['Alignement 4 roues', 'Au laser', '119 $'], ['Entreposage', 'Six mois, pneus lavés', '79 $'], ['Réparation de crevaison', 'Pneu de voiture', '35 $']],
        tagsTitle: 'Nos promesses', tags: 'Rendez-vous le jour même, Prix égalé, Pneus d’hiver certifiés, Entreposage inclus la 1re année',
        formTitle: 'Demander un prix', form: 'Dimension de vos pneus (sur le flanc), véhicule et usage : nous vous envoyons 3 options.',
        galTitle: 'À l’atelier', gal: ['Routes difficiles', 'Sous le véhicule', 'Mise à niveau', 'Diagnostic', 'Sous le capot', 'Inspection'],
        book: ['tekmetric', 'https://shop.tekmetric.com/pneus-boone', 'Prendre rendez-vous', 'Réservez tôt pour les poses de novembre.'],
        hours: [['Lundi – vendredi', '7 h 30 – 18 h'], ['Samedi', '8 h – 14 h'], ['Oct. – déc.', 'Ouvert jusqu’à 20 h']],
        locTitle: 'Le centre', loc: ['3200, boulevard Wilfrid-Hamel, Québec (Québec) G1P 2J2', 'Salle d’attente avec Wi-Fi · Navette offerte'], vid: 'Sur la route, avec les bons pneus',
        rev: [['Guy T.', 'Pneus d’hiver', 'Posés en 40 minutes, prix imbattable.'], ['Amélie S.', 'Alignement', 'Fini la voiture qui tire à droite.']] },
      en: { id: ['Travis Boone', 'Owner', 'Tires · Alignment · Storage', 'Boone Tire Center'], ct: ['+1 612 555-0165', 'info@boonetire.com', 'boonetire.com'], wa: true,
        about: ['The center', 'Over 3,000 tires in stock, every brand. Same-day mounting and balancing, laser alignment and seasonal tire storage.'],
        servTitle: 'Pricing', serv: [['Winter tire install', 'Mount and balance', '$89 / 4 tires'], ['4-wheel alignment', 'Laser', '$119'], ['Tire storage', 'Six months, tires cleaned', '$79'], ['Flat repair', 'Passenger tire', '$35']],
        tagsTitle: 'Our promise', tags: 'Same-day appointments, Price match, Certified winter tires, Free storage the first year',
        formTitle: 'Get a price', form: 'Tire size (on the sidewall), vehicle and driving: we’ll send you 3 options.',
        galTitle: 'In the shop', gal: ['Rough roads', 'Under the car', 'Top-up', 'Diagnostics', 'Under the hood', 'Inspection'],
        book: ['tekmetric', 'https://shop.tekmetric.com/boone-tire', 'Book an appointment', 'Book early for November installs.'],
        hours: [['Monday – Friday', '7:30 a.m. – 6 p.m.'], ['Saturday', '8 a.m. – 2 p.m.'], ['Oct – Dec', 'Open until 8 p.m.']],
        locTitle: 'The center', loc: ['2400 University Avenue SE, Minneapolis, MN 55414', 'Wi-Fi lounge · Free shuttle'], vid: 'On the road, with the right tires',
        rev: [['Guy T.', 'Winter tires', 'Installed in 40 minutes, unbeatable price.'], ['Amy S.', 'Alignment', 'No more car pulling to the right.']] } },
  ];

  const auto = NFC.SECTORS.find((s) => s.id === 'auto');
  if (auto && auto.demo) {
    const keepMedia = NFC.MEDIA.auto;
    auto.profiles = AUTO.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: auto.demo, demoEn: auto.demoEn, palettes: auto.palettes, rec: auto.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
        demo: build(auto.demo, p.M, p.fr), demoEn: build(auto.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    auto.ex = 'Garage, voitures de collection, occasion, moto, pneus…';
  }
})();
