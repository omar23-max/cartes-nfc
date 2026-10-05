/* Métiers par secteur : chaque secteur peut proposer plusieurs profils (exemple complet, couleurs, photos, vidéo).
   Le client choisit son métier juste après le secteur. Les blocs du secteur restent les mêmes ; seul le contenu d’exemple change.
   Pour l’instant : Beauté et bien-être (10 métiers). Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const B = 'media/beaute/';
  const im = (id) => B + id + '.jpg';

  /* Construit les deux exemples (fr, en) d’un métier à partir de l’exemple du secteur */
  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: im(M.portrait), cover: im(M.cover), logo: '' });
    delete d.identity.coverType; delete d.identity.coverVideo;
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: L.wa ? phone : '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, L.so || { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.prestations, { on: true, title: L.prestTitle || '', items: L.prest.map(([t, dd, p]) => ({ t, d: dd, p })) });
    Object.assign(b.gallery, { on: true, title: L.galTitle || '', images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    const [provider, url, label, text] = L.book;
    Object.assign(b.booking, { on: true, mode: 'tool', provider, url, label, text, email });
    Object.assign(b.team, { on: !!L.teamOn, items: M.team.map((id, i) => ({ t: L.team[i][0], d: L.team[i][1], p: '', img: im(id), url: '' })) });
    Object.assign(b.gift, { on: !!L.giftOn, text: L.gift });
    Object.assign(b.hours, { on: true, rows: L.hours.map(([dd, h]) => ({ d: dd, h })), note: '' });
    Object.assign(b.location, { on: true, title: L.locTitle || '', address: L.loc[0], access: L.loc[1] });
    Object.assign(b.video, { on: true, url: '', src: B + 'v' + M.video + '.mp4', cover: im(M.video), cap: L.vid });
    Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    return d;
  }
  /* Photos et vidéos d’un métier, au format de NFC.MEDIA (utilisé par « Ajouter une section ») */
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.team.map(im),
    video: { src: B + 'v' + M.video + '.mp4', poster: im(M.video), cap: L.vid },
  });

  const BEAUTY = [
    { id: 'coiffure', icon: 'scissors', rec: 'd3',
      n: ['Salon de coiffure', 'Hair salon'], ex: ['Coupe, couleur, brushing, coiffage', 'Cuts, color, blowouts, styling'],
      pal: [pal('Rose poudré', '#9d4b62', '#f3c4cf'), pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Prune', '#5b2150', '#e9a8d9'), pal('Nude', '#8a6752', '#e8cfc0'), pal('Bordeaux', '#7f1d1d', '#f4b6b6')],
      M: { portrait: 33257, cover: 49556, gal: [16031, 16044, 16167, 17009, 36381, 42019], team: [16031, 17009], video: 49556 },
      fr: { id: ['Madison Clarke', 'Coiffeuse coloriste', 'Coupe · Couleur · Balayage', 'Salon Madison'], ct: ['+1 514 555-0171', 'bonjour@salonmadison.ca', 'salonmadison.ca'], wa: true,
        about: ['Le salon', 'Un salon lumineux du Plateau où l’on prend le temps de vous écouter. Diagnostic offert, coupes sur mesure, balayages naturels et soins profonds avec des produits sans sulfates.'],
        prest: [['Coupe et brushing', 'Diagnostic, shampoing, coupe, coiffage', '75 $'], ['Balayage', 'Éclaircissement naturel + patine', 'dès 180 $'], ['Couleur racines', 'Retouche + brushing', '95 $'], ['Soin profond', 'Masque réparateur · 20 min', '35 $']],
        gal: ['Coupe et coiffage', 'Boucles au fer', 'Mise en plis', 'Chignon', 'Coloration', 'Coiffure de soirée'],
        book: ['fresha', 'https://www.fresha.com/a/salon-madison-montreal', 'Réserver un rendez-vous', 'Réservation en ligne 24 h sur 24, confirmation par texto.'],
        team: [['Madison', 'Coiffeuse coloriste · fondatrice'], ['Chloe', 'Coiffeuse · spécialiste des boucles']], teamOn: true,
        gift: 'Valide un an sur tous les services du salon.', giftOn: true,
        hours: [['Mardi – mercredi', '10 h – 18 h'], ['Jeudi – vendredi', '10 h – 20 h'], ['Samedi', '9 h – 17 h'], ['Dimanche – lundi', 'Fermé']],
        loc: ['4321, rue Saint-Denis, Montréal (Québec) H2J 2L1', 'Métro Mont-Royal · Stationnement sur rue'], vid: 'Un brushing au salon',
        rev: [['Sophie L.', 'Cliente depuis 2022', 'Enfin un balayage naturel ! Madison écoute vraiment ce qu’on veut.'], ['Julie R.', 'Coupe et soin', 'Salon chaleureux, conseils précieux, je ressors toujours ravie.']] },
      en: { id: ['Madison Clarke', 'Hair stylist & colorist', 'Cuts · Color · Balayage', 'Salon Madison'], ct: ['+1 305 555-0171', 'hello@salonmadison.com', 'salonmadison.com'], wa: true,
        about: ['The salon', 'A bright Wynwood salon where we take the time to listen. Free consultation, tailored cuts, natural-looking balayage and deep treatments with sulfate-free products.'],
        prest: [['Cut & blowout', 'Consultation, wash, cut and style', '$85'], ['Balayage', 'Natural lightening + gloss', 'from $210'], ['Root color', 'Touch-up + blowout', '$110'], ['Deep treatment', 'Repair mask · 20 min', '$40']],
        gal: ['Cut & style', 'Curling iron waves', 'Set & style', 'Updo', 'Color work', 'Evening style'],
        book: ['fresha', 'https://www.fresha.com/a/salon-madison-miami', 'Book an appointment', 'Book online 24/7, confirmation by text.'],
        team: [['Madison', 'Stylist & colorist · owner'], ['Chloe', 'Stylist · curl specialist']], teamOn: true,
        gift: 'Valid for one year on all salon services.', giftOn: true,
        hours: [['Tuesday – Wednesday', '10 a.m. – 6 p.m.'], ['Thursday – Friday', '10 a.m. – 8 p.m.'], ['Saturday', '9 a.m. – 5 p.m.'], ['Sunday – Monday', 'Closed']],
        loc: ['2450 NW 2nd Avenue, Miami, FL 33127', 'Wynwood · Street parking'], vid: 'A blowout at the salon',
        rev: [['Sarah L.', 'Client since 2022', 'Finally a natural balayage! Madison really listens to what you want.'], ['Jenna R.', 'Cut & treatment', 'Warm salon, great advice. I always leave thrilled.']] } },

    { id: 'barbier', icon: 'scissors-line-dashed', keep: true,
      n: ['Barbier · salon pour homme', 'Barbershop'], ex: ['Coupe homme, barbe, rasage', 'Men’s cuts, beards, shaves'] },

    { id: 'spa', icon: 'flower-2', rec: 'd5',
      n: ['Spa', 'Spa'], ex: ['Soins du visage, massages, rituels', 'Facials, massages, rituals'],
      pal: [pal('Eucalyptus', '#4b6b5d', '#cfe0d6'), pal('Sable', '#7a5c3e', '#e6d3b3'), pal('Sauge', '#52705f', '#dfe8dc'), pal('Pierre', '#6b6259', '#e3dacd'), pal('Lavande', '#6b5b95', '#ddd2f0'), pal('Bleu lac', '#155e75', '#cdeaf0')],
      M: { portrait: 52142, cover: 52143, gal: [52151, 52163, 52169, 52147, 27918, 52165], team: [52161, 52168], video: 52144 },
      fr: { id: ['Natalie Hayes', 'Directrice du spa', 'Soins du visage · Massages · Rituels', 'Spa Sérénité'], ct: ['+1 418 555-0142', 'bonjour@spaserenite.ca', 'spaserenite.ca'],
        about: ['Le spa', 'Un refuge au cœur du Vieux-Québec : cabines feutrées, huiles chaudes, thé offert. Nos esthéticiennes composent chaque soin selon votre peau et votre humeur du jour.'],
        prest: [['Soin du visage signature', '75 min · nettoyage, masque, massage', '145 $'], ['Massage relaxant', '60 min · huiles chaudes', '120 $'], ['Rituel duo', '90 min · deux cabines côte à côte', '290 $'], ['Luminothérapie LED', '30 min · éclat et fermeté', '65 $']],
        prestTitle: 'Soins et rituels', gal: ['Massage du visage', 'Masque LED', 'Soin hydratant', 'Huiles essentielles', 'Massage du corps', 'Soin éclat'],
        book: ['mindbody', 'https://www.mindbodyonline.com/explore/locations/spa-serenite-quebec', 'Réserver un soin', 'Disponibilités en temps réel, rappel la veille.'],
        team: [['Natalie', 'Directrice · esthéticienne'], ['Emma', 'Massothérapeute agréée']], teamOn: true,
        gift: 'Offrez un moment de détente : cartes-cadeaux de 50 $ à 500 $.', giftOn: true,
        hours: [['Lundi – vendredi', '9 h – 21 h'], ['Samedi – dimanche', '9 h – 18 h']],
        locTitle: 'Le spa', loc: ['45, rue Saint-Louis, Québec (Québec) G1R 3Z2', 'Vieux-Québec · Stationnement Hôtel-de-Ville à 2 min'], vid: 'Un soin du visage au spa',
        rev: [['Marie-Ève T.', 'Rituel duo', 'Une parenthèse hors du temps, l’équipe est aux petits soins.'], ['Isabelle G.', 'Soin signature', 'Ma peau n’a jamais été aussi lumineuse. Je reviens chaque mois.']] },
      en: { id: ['Natalie Hayes', 'Spa director', 'Facials · Massages · Rituals', 'Serenity Spa'], ct: ['+1 206 555-0142', 'hello@serenityspa.com', 'serenityspa.com'],
        about: ['The spa', 'A calm retreat in downtown Seattle: soft-lit treatment rooms, warm oils and complimentary tea. Our estheticians tailor every treatment to your skin and your mood.'],
        prest: [['Signature facial', '75 min · cleanse, mask, massage', '$165'], ['Relaxing massage', '60 min · warm oils', '$135'], ['Couples ritual', '90 min · side-by-side rooms', '$320'], ['LED light therapy', '30 min · glow and firmness', '$75']],
        prestTitle: 'Treatments & rituals', gal: ['Facial massage', 'LED mask', 'Hydrating facial', 'Essential oils', 'Body massage', 'Glow treatment'],
        book: ['mindbody', 'https://www.mindbodyonline.com/explore/locations/serenity-spa-seattle', 'Book a treatment', 'Real-time availability, reminder the day before.'],
        team: [['Natalie', 'Director · esthetician'], ['Emma', 'Licensed massage therapist']], teamOn: true,
        gift: 'Give the gift of calm: gift cards from $50 to $500.', giftOn: true,
        hours: [['Monday – Friday', '9 a.m. – 9 p.m.'], ['Saturday – Sunday', '9 a.m. – 6 p.m.']],
        locTitle: 'The spa', loc: ['1520 4th Avenue, Seattle, WA 98101', 'Downtown · Validated garage parking'], vid: 'A facial at the spa',
        rev: [['Megan T.', 'Couples ritual', 'A true escape. The team takes care of every detail.'], ['Ashley G.', 'Signature facial', 'My skin has never looked this good. I come back every month.']] } },

    { id: 'ongles', icon: 'hand', rec: 'd8',
      n: ['Esthétique et ongles', 'Nails & esthetics'], ex: ['Manucure, pose de gel, nail art', 'Manicures, gel, nail art'],
      pal: [pal('Rose fluo', '#db2777', '#fbcfe8'), pal('Corail', '#c2410c', '#fed7aa'), pal('Lilas', '#7e5a9b', '#e9d5f5'), pal('Nude', '#8a6752', '#e8cfc0'), pal('Bordeaux', '#7f1d1d', '#f4b6b6'), pal('Menthe', '#0f766e', '#99f6e4')],
      M: { portrait: 36905, cover: 15806, gal: [13087, 23384, 7167, 15804, 13083, 24761], team: [13082, 24701], video: 15125 },
      fr: { id: ['Brittany Cole', 'Prothésiste ongulaire et esthéticienne', 'Gel · Nail art · Soins du visage', 'Studio Ongles B.'], ct: ['+1 450 555-0163', 'bonjour@studioonglesb.ca', 'studioonglesb.ca'], wa: true,
        about: ['Le studio', 'Un petit studio à Laval pour des ongles impeccables qui tiennent. Pose de gel, biab, nail art dessiné à la main et soins du visage express, dans une ambiance détendue.'],
        prest: [['Manucure gel', 'Préparation, couleur, finition · 60 min', '55 $'], ['Pose complète', 'Extensions gel · 90 min', '85 $'], ['Nail art', 'Par ongle · dessiné à la main', 'dès 5 $'], ['Soin du visage express', 'Nettoyage + hydratation · 30 min', '60 $']],
        gal: ['Nail art', 'Séchage UV', 'Vernis rouge', 'Limage', 'Pose de gel', 'Manucure'],
        book: ['glossgenius', 'https://studioonglesb.glossgenius.com', 'Réserver ma pose', 'Choisissez votre créneau et votre style en ligne.'],
        team: [['Brittany', 'Prothésiste ongulaire · fondatrice'], ['Zoe', 'Esthéticienne']], teamOn: false,
        gift: 'Carte-cadeau valide un an, idéale pour un anniversaire.', giftOn: true,
        hours: [['Mardi – vendredi', '10 h – 20 h'], ['Samedi', '9 h – 16 h'], ['Dimanche – lundi', 'Fermé']],
        locTitle: 'Le studio', loc: ['1650, boulevard Le Corbusier, Laval (Québec) H7S 1Z2', 'Stationnement gratuit · Près du Carrefour Laval'], vid: 'Pose de vernis au studio',
        rev: [['Jade M.', 'Pose complète', 'Mes ongles tiennent trois semaines sans un éclat. Bravo !'], ['Camille P.', 'Nail art', 'Des motifs magnifiques, exactement l’image que j’avais envoyée.']] },
      en: { id: ['Brittany Cole', 'Nail artist & esthetician', 'Gel · Nail art · Facials', 'Studio Nails B.'], ct: ['+1 512 555-0163', 'hello@studionailsb.com', 'studionailsb.com'], wa: true,
        about: ['The studio', 'A cozy Austin studio for flawless nails that last. Gel manicures, builder gel, hand-painted nail art and express facials in a laid-back setting.'],
        prest: [['Gel manicure', 'Prep, color, finish · 60 min', '$50'], ['Full set', 'Gel extensions · 90 min', '$80'], ['Nail art', 'Per nail · hand-painted', 'from $5'], ['Express facial', 'Cleanse + hydrate · 30 min', '$55']],
        gal: ['Nail art', 'UV curing', 'Red polish', 'Filing', 'Gel application', 'Manicure'],
        book: ['glossgenius', 'https://studionailsb.glossgenius.com', 'Book my set', 'Pick your time and your style online.'],
        team: [['Brittany', 'Nail artist · owner'], ['Zoe', 'Esthetician']], teamOn: false,
        gift: 'Gift card valid for one year, perfect for birthdays.', giftOn: true,
        hours: [['Tuesday – Friday', '10 a.m. – 8 p.m.'], ['Saturday', '9 a.m. – 4 p.m.'], ['Sunday – Monday', 'Closed']],
        locTitle: 'The studio', loc: ['1100 South Lamar Boulevard, Austin, TX 78704', 'Free parking · South Lamar'], vid: 'Polish at the studio',
        rev: [['Kaylee M.', 'Full set', 'My nails last three weeks without a single chip. Amazing!'], ['Hannah P.', 'Nail art', 'Gorgeous designs, exactly like the picture I sent.']] } },

    { id: 'naturel', icon: 'leaf', rec: 'd4',
      n: ['Soins naturels', 'Natural skincare'], ex: ['Soins bio, gua sha, plantes', 'Organic facials, gua sha, botanicals'],
      pal: [pal('Vert sauge', '#4f6b58', '#c9d6c3'), pal('Olivier', '#5b6b2f', '#d9c27a'), pal('Terre', '#7c4a24', '#e9b872'), pal('Lin', '#57534e', '#d6cfc2'), pal('Miel', '#a16207', '#fde68a'), pal('Eucalyptus', '#4b6b5d', '#cfe0d6')],
      M: { portrait: 51186, cover: 36241, gal: [51170, 45160, 24600, 52147, 24739, 33201], team: [51183, 52159], video: 52158 },
      fr: { id: ['Hailey Morris', 'Esthéticienne en soins naturels', 'Soins bio · Gua sha · Aromathérapie', 'Atelier Botanique'], ct: ['+1 819 555-0188', 'bonjour@atelierbotanique.ca', 'atelierbotanique.ca'],
        about: ['Mon approche', 'Des soins du visage 100 % naturels, préparés avec des plantes, des argiles et des huiles locales. Je prends le temps de comprendre votre peau pour la rééquilibrer en douceur, sans produits agressifs.'],
        prest: [['Soin botanique', '60 min · argile, huiles, massage', '95 $'], ['Gua sha sculptant', '45 min · drainage et éclat', '80 $'], ['Soin peau sensible', '50 min · apaisant, sans parfum', '85 $'], ['Atelier routine maison', '90 min · en petit groupe', '45 $']],
        gal: ['Gua sha', 'Crèmes maison', 'Masque à l’argile', 'Huiles essentielles', 'Soin du corps', 'Peau nette'],
        book: ['square', 'https://book.squareup.com/appointments/atelier-botanique-sherbrooke', 'Réserver un soin', 'Premier soin : un bilan de peau offert.'],
        team: [['Hailey', 'Esthéticienne · herboriste'], ['Rose', 'Aromathérapeute']], teamOn: false,
        gift: 'Un coffret soin + carte-cadeau, emballé sans plastique.', giftOn: true,
        hours: [['Mercredi – vendredi', '10 h – 19 h'], ['Samedi', '10 h – 16 h'], ['Dimanche – mardi', 'Fermé']],
        locTitle: 'L’atelier', loc: ['118, rue Wellington Nord, Sherbrooke (Québec) J1H 5B7', 'Centre-ville · Stationnement Wellington'], vid: 'Un soin naturel du visage',
        rev: [['Audrey B.', 'Soin botanique', 'Ma peau sensible est enfin apaisée, et tout sent si bon.'], ['Nathalie C.', 'Gua sha', 'Un moment de pure détente, résultat visible tout de suite.']] },
      en: { id: ['Hailey Morris', 'Natural skincare esthetician', 'Organic facials · Gua sha · Aromatherapy', 'Botanical Studio'], ct: ['+1 503 555-0188', 'hello@botanicalstudio.com', 'botanicalstudio.com'],
        about: ['My approach', '100% natural facials made with plants, clays and locally sourced oils. I take the time to understand your skin and gently rebalance it, without harsh products.'],
        prest: [['Botanical facial', '60 min · clay, oils, massage', '$110'], ['Sculpting gua sha', '45 min · drainage and glow', '$90'], ['Sensitive skin facial', '50 min · soothing, fragrance-free', '$95'], ['At-home routine workshop', '90 min · small group', '$50']],
        gal: ['Gua sha', 'Handmade creams', 'Clay mask', 'Essential oils', 'Body treatment', 'Clear skin'],
        book: ['square', 'https://book.squareup.com/appointments/botanical-studio-portland', 'Book a treatment', 'First visit includes a free skin assessment.'],
        team: [['Hailey', 'Esthetician · herbalist'], ['Rose', 'Aromatherapist']], teamOn: false,
        gift: 'A care kit + gift card, wrapped plastic-free.', giftOn: true,
        hours: [['Wednesday – Friday', '10 a.m. – 7 p.m.'], ['Saturday', '10 a.m. – 4 p.m.'], ['Sunday – Tuesday', 'Closed']],
        locTitle: 'The studio', loc: ['2310 NE Alberta Street, Portland, OR 97211', 'Alberta Arts District · Street parking'], vid: 'A natural facial',
        rev: [['Olivia B.', 'Botanical facial', 'My sensitive skin is finally calm, and everything smells amazing.'], ['Natalie C.', 'Gua sha', 'Pure relaxation, with results you see right away.']] } },

    { id: 'maquillage', icon: 'brush', rec: 'd10',
      n: ['Maquilleuse', 'Makeup artist'], ex: ['Mariages, événements, shootings', 'Weddings, events, photo shoots'],
      pal: [pal('Noir & or', '#1c1917', '#c9a227'), pal('Prune', '#5b2150', '#e9a8d9'), pal('Rose poudré', '#9d4b62', '#f3c4cf'), pal('Rouge velours', '#9f1239', '#fda4af'), pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Bleu minuit', '#1e2a4a', '#d8b46a')],
      M: { portrait: 52042, cover: 52030, gal: [52046, 52055, 50622, 40541, 39910, 40540], team: [40558, 39911], video: 40541 },
      fr: { id: ['Taylor Quinn', 'Maquilleuse professionnelle', 'Mariages · Événements · Shootings', 'Taylor Quinn Makeup'], ct: ['+1 514 555-0129', 'bonjour@taylorquinnmakeup.ca', 'taylorquinnmakeup.ca'], wa: true,
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', facebook: 'https://facebook.com/' },
        about: ['À propos', 'Maquilleuse depuis 10 ans, je sublime sans masquer : un teint lumineux qui tient toute la journée, sur toutes les carnations. Je me déplace à domicile, en studio ou sur le lieu de votre événement.'],
        prest: [['Maquillage événement', 'Soirée, gala, remise de diplôme', '95 $'], ['Maquillage mariée', 'Essai + jour J', '350 $'], ['Shooting photo', 'Maquillage HD · retouches sur place', '150 $'], ['Cours d’auto-maquillage', '2 h · votre trousse', '120 $']],
        gal: ['Teint parfait', 'Maquillage des yeux', 'Lèvres', 'Le résultat', 'Mes pinceaux', 'En studio'],
        book: ['glossgenius', 'https://taylorquinnmakeup.glossgenius.com', 'Réserver une date', 'Les samedis de mai à octobre partent vite : réservez tôt.'],
        team: [['Taylor', 'Maquilleuse · fondatrice'], ['Ava', 'Coiffeuse événementielle']], teamOn: false,
        gift: 'Carte-cadeau pour un cours ou une mise en beauté.', giftOn: false,
        hours: [['Mardi – vendredi', 'Sur rendez-vous'], ['Samedi – dimanche', 'Événements et mariages']],
        locTitle: 'Le studio', loc: ['5445, avenue de Gaspé, Montréal (Québec) H2T 3B2', 'Mile End · Déplacements dans tout le Grand Montréal'], vid: 'Mise en beauté en studio',
        rev: [['Laurence D.', 'Mariée 2025', 'Maquillage parfait du matin au dernier slow, et tellement naturel.'], ['Studio Lumen', 'Shooting mode', 'Professionnelle, rapide, un teint impeccable à l’écran.']] },
      en: { id: ['Taylor Quinn', 'Professional makeup artist', 'Weddings · Events · Photo shoots', 'Taylor Quinn Makeup'], ct: ['+1 615 555-0129', 'hello@taylorquinnmakeup.com', 'taylorquinnmakeup.com'], wa: true,
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', facebook: 'https://facebook.com/' },
        about: ['About me', 'A makeup artist for 10 years, I enhance without masking: a radiant complexion that lasts all day, on every skin tone. I travel to your home, my studio or your event venue.'],
        prest: [['Event makeup', 'Galas, parties, graduations', '$110'], ['Bridal makeup', 'Trial + wedding day', '$395'], ['Photo shoot', 'HD makeup · on-set touch-ups', '$175'], ['Self-makeup lesson', '2 hrs · with your own kit', '$130']],
        gal: ['Flawless complexion', 'Eye makeup', 'Lips', 'The result', 'My brushes', 'In the studio'],
        book: ['glossgenius', 'https://taylorquinnmakeup.glossgenius.com', 'Book a date', 'Saturdays from May to October go fast: book early.'],
        team: [['Taylor', 'Makeup artist · owner'], ['Ava', 'Event hairstylist']], teamOn: false,
        gift: 'Gift card for a lesson or a glam session.', giftOn: false,
        hours: [['Tuesday – Friday', 'By appointment'], ['Saturday – Sunday', 'Events & weddings']],
        locTitle: 'The studio', loc: ['1200 Clinton Street, Nashville, TN 37203', 'Marathon Village · Travel across Middle Tennessee'], vid: 'Glam session in the studio',
        rev: [['Lauren D.', 'Bride 2025', 'Perfect makeup from morning to the last dance, and so natural.'], ['Lumen Studio', 'Fashion shoot', 'Professional, fast, flawless skin on camera.']] } },

    { id: 'cils', icon: 'eye', rec: 'd9',
      n: ['Cils et sourcils', 'Lashes & brows'], ex: ['Extensions, rehaussement, microblading', 'Extensions, lifts, microblading'],
      pal: [pal('Nude', '#8a6752', '#e8cfc0'), pal('Noir chic', '#1a1a1a', '#c5a572'), pal('Blush', '#a8556b', '#f5d0d8'), pal('Lilas', '#7e5a9b', '#e9d5f5'), pal('Taupe', '#6b5d52', '#ddd0c4'), pal('Or rose', '#9f5f5f', '#f1c6b8')],
      M: { portrait: 49014, cover: 4718, gal: [16151, 52052, 49013, 47582, 48361, 24748], team: [13721, 50619], video: 52059 },
      fr: { id: ['Lindsay Ellis', 'Technicienne cils et sourcils', 'Extensions · Rehaussement · Microblading', 'Studio Regard'], ct: ['+1 819 555-0154', 'bonjour@studioregard.ca', 'studioregard.ca'], wa: true,
        about: ['Le studio', 'Un regard intense et naturel, sans maquillage le matin. Extensions cil à cil ou volume russe, rehaussement kératine et microblading, réalisés avec des produits hypoallergéniques.'],
        prest: [['Extensions cil à cil', 'Pose complète · 2 h', '160 $'], ['Remplissage', 'Toutes les 3 semaines · 1 h', '75 $'], ['Rehaussement de cils', 'Kératine + teinture · 1 h', '95 $'], ['Microblading', 'Séance + retouche à 6 semaines', '450 $']],
        gal: ['Extensions de cils', 'Rehaussement', 'Microblading', 'Restructuration', 'Teinture des sourcils', 'Soin des cils'],
        book: ['vagaro', 'https://www.vagaro.com/studioregard', 'Réserver ma séance', 'Venez sans mascara, le reste on s’en occupe.'],
        team: [['Lindsay', 'Technicienne · fondatrice'], ['Mia', 'Spécialiste microblading']], teamOn: true,
        gift: 'Offrez un rehaussement : carte-cadeau valide un an.', giftOn: false,
        hours: [['Lundi – jeudi', '9 h – 19 h'], ['Vendredi', '9 h – 17 h'], ['Samedi', '9 h – 14 h']],
        locTitle: 'Le studio', loc: ['230, boulevard Saint-Joseph, Gatineau (Québec) J8Y 3X4', 'Stationnement gratuit à l’arrière'], vid: 'Retouches des cils',
        rev: [['Émilie V.', 'Extensions', 'Résultat naturel et confortable, je ne m’en passe plus.'], ['Karine L.', 'Microblading', 'Des sourcils parfaits, Lindsay est d’une précision incroyable.']] },
      en: { id: ['Lindsay Ellis', 'Lash & brow artist', 'Extensions · Lifts · Microblading', 'Studio Gaze'], ct: ['+1 720 555-0154', 'hello@studiogaze.com', 'studiogaze.com'], wa: true,
        about: ['The studio', 'Bold yet natural eyes, with no makeup in the morning. Classic or Russian volume extensions, keratin lifts and microblading, all with hypoallergenic products.'],
        prest: [['Classic lash extensions', 'Full set · 2 hrs', '$175'], ['Fill', 'Every 3 weeks · 1 hr', '$80'], ['Lash lift', 'Keratin + tint · 1 hr', '$100'], ['Microblading', 'Session + 6-week touch-up', '$495']],
        gal: ['Lash extensions', 'Lash lift', 'Microblading', 'Brow shaping', 'Brow tint', 'Lash care'],
        book: ['vagaro', 'https://www.vagaro.com/studiogaze', 'Book my session', 'Come without mascara, we take care of the rest.'],
        team: [['Lindsay', 'Lash artist · owner'], ['Mia', 'Microblading specialist']], teamOn: true,
        gift: 'Give a lash lift: gift card valid for one year.', giftOn: false,
        hours: [['Monday – Thursday', '9 a.m. – 7 p.m.'], ['Friday', '9 a.m. – 5 p.m.'], ['Saturday', '9 a.m. – 2 p.m.']],
        locTitle: 'The studio', loc: ['1550 Platte Street, Denver, CO 80202', 'LoHi · Free parking in the back'], vid: 'Lash touch-ups',
        rev: [['Emily V.', 'Extensions', 'Natural and comfortable, I can’t go without them now.'], ['Kristen L.', 'Microblading', 'Perfect brows, Lindsay is incredibly precise.']] } },

    { id: 'massage', icon: 'hand-heart', rec: 'd4',
      n: ['Massothérapeute', 'Massage therapist'], ex: ['Massage suédois, thérapeutique, sportif', 'Swedish, deep tissue, sports massage'],
      pal: [pal('Sauge', '#52705f', '#cfe0cf'), pal('Pierre', '#8a7560', '#e6d5bf'), pal('Terracotta', '#a0522d', '#f4c7a1'), pal('Bleu nuit', '#1e3a8a', '#c7d2fe'), pal('Sable', '#7a5c3e', '#e6d3b3'), pal('Eucalyptus', '#4b6b5d', '#cfe0d6')],
      M: { portrait: 20904, cover: 32862, gal: [24136, 14781, 36710, 49453, 49539, 14626], team: [24871, 52167], video: 4744 },
      fr: { id: ['Chelsea Foster', 'Massothérapeute agréée', 'Suédois · Thérapeutique · Sportif', 'Clinique Équilibre'], ct: ['+1 450 555-0137', 'bonjour@cliniqueequilibre.ca', 'cliniqueequilibre.ca'],
        about: ['Mon approche', 'Membre d’une association reconnue, je soulage tensions, maux de dos et récupération sportive. Reçus pour assurances à chaque séance, techniques adaptées après un court bilan.'],
        prest: [['Massage suédois', '60 min · détente profonde', '95 $'], ['Massage thérapeutique', '60 min · tensions ciblées', '105 $'], ['Massage sportif', '75 min · récupération', '125 $'], ['Massage femme enceinte', '60 min · coussins adaptés', '100 $']],
        gal: ['Massage suédois', 'Massage aux huiles', 'Jambes légères', 'Réflexologie', 'Nuque et épaules', 'Massage des mains'],
        book: ['jane', 'https://cliniqueequilibre.janeapp.com', 'Prendre rendez-vous', 'Reçu d’assurance remis après chaque séance.'],
        team: [['Chelsea', 'Massothérapeute · fondatrice'], ['Noah', 'Kinésithérapeute du sport']], teamOn: false,
        gift: 'Offrez un massage : carte-cadeau de 60 ou 90 minutes.', giftOn: true,
        hours: [['Lundi – vendredi', '8 h – 20 h'], ['Samedi', '9 h – 15 h']],
        locTitle: 'La clinique', loc: ['600, boulevard Marie-Victorin, Longueuil (Québec) J4G 1A3', 'Stationnement gratuit · Accès fauteuil roulant'], vid: 'Un massage en cabine',
        rev: [['Patrick R.', 'Massage sportif', 'Mon dos me remercie. Récupération bien plus rapide après mes courses.'], ['Geneviève S.', 'Femme enceinte', 'Douce, attentive, un vrai soulagement en fin de grossesse.']] },
      en: { id: ['Chelsea Foster', 'Licensed massage therapist', 'Swedish · Deep tissue · Sports', 'Balance Massage Clinic'], ct: ['+1 619 555-0137', 'hello@balancemassage.com', 'balancemassage.com'],
        about: ['My approach', 'A licensed therapist, I relieve tension, back pain and help with sports recovery. HSA/FSA receipts on request, techniques tailored after a short assessment.'],
        prest: [['Swedish massage', '60 min · deep relaxation', '$105'], ['Deep tissue massage', '60 min · targeted tension', '$115'], ['Sports massage', '75 min · recovery', '$135'], ['Prenatal massage', '60 min · supportive cushions', '$110']],
        gal: ['Swedish massage', 'Oil massage', 'Leg relief', 'Reflexology', 'Neck & shoulders', 'Hand massage'],
        book: ['jane', 'https://balancemassage.janeapp.com', 'Book an appointment', 'HSA/FSA receipt after every session.'],
        team: [['Chelsea', 'Massage therapist · owner'], ['Noah', 'Sports therapist']], teamOn: false,
        gift: 'Give a massage: 60- or 90-minute gift card.', giftOn: true,
        hours: [['Monday – Friday', '8 a.m. – 8 p.m.'], ['Saturday', '9 a.m. – 3 p.m.']],
        locTitle: 'The clinic', loc: ['3900 Fifth Avenue, San Diego, CA 92103', 'Hillcrest · Free parking · Wheelchair accessible'], vid: 'A massage session',
        rev: [['Patrick R.', 'Sports massage', 'My back thanks me. Much faster recovery after my runs.'], ['Jessica S.', 'Prenatal', 'Gentle, attentive, real relief late in pregnancy.']] } },

    { id: 'mariee', icon: 'heart', rec: 'd10',
      n: ['Coiffure et maquillage de mariée', 'Bridal hair & makeup'], ex: ['Le jour J, à domicile', 'Wedding day, on location'],
      pal: [pal('Champagne', '#8c6a3f', '#e8d5b0'), pal('Blush', '#a8556b', '#f5d0d8'), pal('Ivoire', '#7a6a4f', '#efe6d2'), pal('Sauge', '#52705f', '#cfe0cf'), pal('Bleu minuit', '#1e2a4a', '#d8b46a'), pal('Or rose', '#9f5f5f', '#f1c6b8')],
      M: { portrait: 40583, cover: 40586, gal: [40592, 40556, 40598, 40597, 40589, 51230], team: [40560, 40559], video: 40589 },
      fr: { id: ['Amber Stewart', 'Coiffeuse et maquilleuse de mariée', 'Le jour J, à domicile', 'Amber Mariées'], ct: ['+1 418 555-0196', 'bonjour@ambermariees.ca', 'ambermariees.ca'], wa: true,
        about: ['À propos', 'Je prépare les mariées et leur cortège là où vous vous préparez : maison, hôtel ou domaine. Essai coiffure et maquillage, planning minuté le jour J et retouches jusqu’à la cérémonie.'],
        prest: [['Forfait mariée', 'Essai + coiffure et maquillage du jour J', '595 $'], ['Demoiselle d’honneur', 'Coiffure ou maquillage', '120 $'], ['Mère de la mariée', 'Coiffure + maquillage', '180 $'], ['Retouches cérémonie', 'Présence jusqu’à 2 h', '150 $']],
        prestTitle: 'Forfaits', gal: ['Coiffure de mariée', 'Teint lumineux', 'Retouches', 'Le jour J', 'Les préparatifs', 'La robe'],
        book: ['honeybook', 'https://amber.hbportal.co/public/ambermariees', 'Vérifier ma date', 'Réservez 6 à 12 mois à l’avance pour l’été.'],
        team: [['Amber', 'Coiffeuse et maquilleuse'], ['Léa', 'Assistante coiffure']], teamOn: false,
        gift: 'Offrez l’essai coiffure et maquillage à une future mariée.', giftOn: false,
        hours: [['Lundi – vendredi', 'Essais sur rendez-vous'], ['Samedi – dimanche', 'Mariages']],
        locTitle: 'Zone de déplacement', loc: ['2200, chemin Sainte-Foy, Québec (Québec) G1V 1S3', 'Déplacements à Québec, Charlevoix et sur la Côte-de-Beaupré'], vid: 'Préparatifs de la mariée',
        rev: [['Andréanne et Maxime', 'Mariage à Charlevoix', 'Amber a gardé tout le monde calme et magnifique. Coiffure intacte jusqu’au bout.'], ['Valérie T.', 'Cortège de 5', 'Ponctuelle, organisée, et chaque demoiselle se sentait belle.']] },
      en: { id: ['Amber Stewart', 'Bridal hair & makeup artist', 'Wedding day, on location', 'Amber Bridal'], ct: ['+1 404 555-0196', 'hello@amberbridal.com', 'amberbridal.com'], wa: true,
        about: ['About me', 'I get brides and their wedding party ready wherever you are: home, hotel or venue. Hair and makeup trial, a timed schedule on the big day, and touch-ups until the ceremony.'],
        prest: [['Bridal package', 'Trial + wedding-day hair & makeup', '$650'], ['Bridesmaid', 'Hair or makeup', '$130'], ['Mother of the bride', 'Hair + makeup', '$195'], ['Ceremony touch-ups', 'On site up to 2 hrs', '$160']],
        prestTitle: 'Packages', gal: ['Bridal hair', 'Glowing complexion', 'Touch-ups', 'The big day', 'Getting ready', 'The dress'],
        book: ['honeybook', 'https://amber.hbportal.co/public/amberbridal', 'Check my date', 'Book 6 to 12 months ahead for summer.'],
        team: [['Amber', 'Hair & makeup artist'], ['Leah', 'Hair assistant']], teamOn: false,
        gift: 'Give a bride-to-be her hair and makeup trial.', giftOn: false,
        hours: [['Monday – Friday', 'Trials by appointment'], ['Saturday – Sunday', 'Weddings']],
        locTitle: 'Service area', loc: ['675 Ponce de Leon Avenue NE, Atlanta, GA 30308', 'Travel across Atlanta and North Georgia'], vid: 'Bride getting ready',
        rev: [['Andrea & Max', 'Wedding in the mountains', 'Amber kept everyone calm and gorgeous. Hair held until the very end.'], ['Valerie T.', 'Party of 5', 'On time, organized, and every bridesmaid felt beautiful.']] } },

    { id: 'laser', icon: 'sparkles', rec: 'd1',
      n: ['Épilation et soins au laser', 'Laser & waxing'], ex: ['Épilation, laser, LED, soins avancés', 'Waxing, laser, LED, advanced facials'],
      pal: [pal('Bleu clinique', '#0369a1', '#bae6fd'), pal('Menthe', '#0f766e', '#99f6e4'), pal('Graphite', '#27272a', '#a1a1aa'), pal('Lavande', '#6d28d9', '#ddd6fe'), pal('Argent', '#374151', '#cbd5e1'), pal('Rose poudré', '#9d4b62', '#f3c4cf')],
      M: { portrait: 52154, cover: 52141, gal: [52153, 24657, 24673, 52163, 24857, 52171], team: [24701, 52142], video: 52153 },
      fr: { id: ['Kayla Grant', 'Esthéticienne en soins avancés', 'Épilation laser · LED · Soins du visage', 'Clinique Éclat'], ct: ['+1 819 555-0115', 'bonjour@cliniqueeclat.ca', 'cliniqueeclat.ca'],
        about: ['La clinique', 'Une clinique d’esthétique avancée à Trois-Rivières : épilation laser pour tous les phototypes, luminothérapie LED et soins anti-âge. Chaque traitement commence par une consultation et un test de peau.'],
        prest: [['Épilation laser', 'Aisselles · par séance', '79 $'], ['Épilation laser', 'Jambes complètes · par séance', '249 $'], ['Épilation à la cire', 'Sourcils, lèvre, bikini', 'dès 18 $'], ['Soin LED anti-âge', '45 min · fermeté et éclat', '95 $']],
        gal: ['Laser visage', 'Épilation à la cire', 'Épilation de la lèvre', 'Masque LED', 'Épilation des bras', 'Soin raffermissant'],
        book: ['boulevard', 'https://www.joinblvd.com/b/clinique-eclat', 'Réserver une consultation', 'Consultation et test de peau offerts.'],
        team: [['Kayla', 'Esthéticienne · laser'], ['Sarah', 'Infirmière clinicienne']], teamOn: true,
        gift: 'Forfaits 6 séances : jusqu’à 20 % d’économie.', giftOn: false,
        hours: [['Lundi – jeudi', '9 h – 20 h'], ['Vendredi', '9 h – 17 h'], ['Samedi', '9 h – 13 h']],
        locTitle: 'La clinique', loc: ['4520, boulevard des Forges, Trois-Rivières (Québec) G8Y 1W3', 'Stationnement gratuit · Accès fauteuil roulant'], vid: 'Un soin au laser',
        rev: [['Mélanie F.', 'Laser jambes', 'Après 6 séances, je ne me rase plus. Équipe très rassurante.'], ['Stéphanie D.', 'Soin LED', 'Peau plus ferme dès la troisième séance, je recommande.']] },
      en: { id: ['Kayla Grant', 'Advanced esthetician', 'Laser hair removal · LED · Facials', 'Glow Clinic'], ct: ['+1 480 555-0115', 'hello@glowclinic.com', 'glowclinic.com'],
        about: ['The clinic', 'An advanced esthetics clinic in Scottsdale: laser hair removal for every skin type, LED light therapy and anti-aging facials. Every treatment starts with a consultation and a patch test.'],
        prest: [['Laser hair removal', 'Underarms · per session', '$89'], ['Laser hair removal', 'Full legs · per session', '$279'], ['Waxing', 'Brows, lip, bikini', 'from $20'], ['Anti-aging LED facial', '45 min · firmness and glow', '$110']],
        gal: ['Facial laser', 'Waxing', 'Lip waxing', 'LED mask', 'Arm waxing', 'Firming treatment'],
        book: ['boulevard', 'https://www.joinblvd.com/b/glow-clinic', 'Book a consultation', 'Free consultation and patch test.'],
        team: [['Kayla', 'Esthetician · laser'], ['Sarah', 'Registered nurse']], teamOn: true,
        gift: '6-session packages: save up to 20%.', giftOn: false,
        hours: [['Monday – Thursday', '9 a.m. – 8 p.m.'], ['Friday', '9 a.m. – 5 p.m.'], ['Saturday', '9 a.m. – 1 p.m.']],
        locTitle: 'The clinic', loc: ['7014 East Camelback Road, Scottsdale, AZ 85251', 'Free parking · Wheelchair accessible'], vid: 'A laser treatment',
        rev: [['Melanie F.', 'Laser legs', 'After 6 sessions I don’t shave anymore. Very reassuring team.'], ['Stephanie D.', 'LED facial', 'Firmer skin by the third session, highly recommend.']] } },
  ];

  /* ---------- 5 mises en page supplémentaires, réservées à la beauté mais passe-partout ---------- */
  const BEAUTY_DESIGNS = [
    { id: 'd11', name: 'Silk', desc: 'Couverture arrondie, portrait cerclé, typographie fine : doux et élégant.' },
    { id: 'd12', name: 'Pearl', desc: 'Fond nacré, portrait ovale et titres en italique : raffiné et lumineux.' },
    { id: 'd13', name: 'Bloom', desc: 'Grande photo verticale à côté du nom : visuel et moderne.' },
    { id: 'd14', name: 'Velvet', desc: 'Fond profond, accents dorés, portrait mis en valeur : luxe et soirée.' },
    { id: 'd15', name: 'Glow', desc: 'Halo de couleurs et carte translucide : frais et tendance.' },
  ];

  const beaute = NFC.SECTORS.find((s) => s.id === 'beaute');
  if (beaute && beaute.demo) {
    const keepMedia = NFC.MEDIA.beaute;
    beaute.profiles = BEAUTY.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: beaute.demo, demoEn: beaute.demoEn, palettes: beaute.palettes, rec: beaute.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
        demo: build(beaute.demo, p.M, p.fr), demoEn: build(beaute.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    beaute.designs = BEAUTY_DESIGNS;
    /* La tuile du secteur et les exemples par défaut montrent désormais le salon de coiffure */
    NFC.MEDIA.beaute = beaute.profiles[0].media;
    beaute.ex = 'Coiffure, spa, ongles, maquillage, cils, massage…';
  }

  /* Secteur vu à travers le métier choisi : même blocs, exemple, couleurs et mise en page conseillée du métier */
  NFC.withProfile = (s, p) => {
    if (!s || !p) return s;
    if (!p._sec || p._base !== s) { p._base = s; p._sec = Object.assign({}, s, { demo: p.demo, demoEn: p.demoEn, palettes: p.palettes || s.palettes, rec: p.rec || s.rec, profile: p }); }
    return p._sec;
  };
  NFC.profileOf = (s, profs) => (s && s.profiles ? (s.profiles.find((p) => p.id === (profs || {})[s.id]) || s.profiles[0]) : null);
  NFC.DESIGNS_ALL = NFC.DESIGNS.concat(BEAUTY_DESIGNS);
})();
