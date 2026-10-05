/* Métiers du secteur « Coaching, sport et formation » (10 métiers). Même principe que profiles.js.
   Chaque métier : exemple FR (Québec) et EN (États-Unis), couleurs, photos, vidéo de couverture et carrousel vidéo.
   Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/coaching/';
  const im = (id) => F + id + '.jpg';
  const vd = (id) => F + 'v' + id + '.mp4';

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: im(M.portrait), cover: im(M.cover), logo: '', coverType: 'video', coverVideo: vd(M.vids[0]) });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: L.wa ? phone : '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, L.so || { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.programmes, { on: true, title: L.progTitle || '', items: L.prog.map(([t, dd, p]) => ({ t, d: dd, p })) });
    Object.assign(b.methode, { on: !!L.method, title: L.method ? L.method[0] : '', items: L.method ? L.method[1].map(([t, dd]) => ({ t, d: dd, p: '' })) : [] });
    Object.assign(b.planning, { on: true, title: L.plan[0], rows: L.plan[1].map(([dd, h]) => ({ d: dd, h })), note: L.plan[2] || '' });
    const [provider, url, label, text] = L.book;
    Object.assign(b.booking, { on: true, mode: 'tool', provider, url, label, text, email });
    Object.assign(b.stats, { on: true, items: L.stats.map(([v, l]) => ({ v, l })) });
    Object.assign(b.gallery, { on: true, title: L.galTitle || '', images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    Object.assign(b.location, { on: true, title: L.locTitle || '', address: L.loc[0], access: L.loc[1] });
    const v2 = M.vids[1] || M.vids[0];
    Object.assign(b.video, { on: false, url: '', src: vd(v2), cover: im(v2), cap: L.vids[1] || L.vids[0] });
    Object.assign(b.reviews, { on: true, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    /* Carrousel vidéo (et carrousel photo pour les salles) */
    d.custom = [{ cid: 'coachvid', type: 'vidcar', title: L.vidTitle, on: true, videos: M.vids.map((id, i) => ({ url: '', src: vd(id), cover: im(id), cap: L.vids[i] })) }];
    if (M.car) d.custom.push({ cid: 'coachimg', type: 'imgcar', title: L.carTitle, on: true, images: M.car.map((id, i) => ({ src: im(id), cap: L.car[i] })) });
    d.order = (base.order || []).filter((k) => k !== 'c:coachimg' || M.car);
    return d;
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.gal.slice(0, 2).map(im),
    video: { src: vd(M.vids[0]), poster: im(M.vids[0]), cap: L.vids[0] },
  });

  const SPORT = [
    { id: 'coach', icon: 'dumbbell', keep: true, n: ['Coach sportif personnel', 'Personal trainer'], ex: ['Remise en forme, perte de poids', 'Fitness, weight loss'] },

    { id: 'muscu', icon: 'biceps-flexed', rec: 'd5',
      n: ['Salle de musculation', 'Strength gym'], ex: ['Haltères, force, préparation physique', 'Free weights, strength, conditioning'],
      pal: [pal('Noir et orange', '#111111', '#fb923c'), pal('Violet néon', '#4c1d95', '#a78bfa'), pal('Acier', '#374151', '#cbd5e1'), pal('Noir et violet', '#0a0a0a', '#8b5cf6'), pal('Orange brûlé', '#c2410c', '#fdba74'), pal('Titane', '#1f2937', '#d4af37')],
      M: { portrait: 52084, cover: 52079, gal: [52082, 47889, 52108, 23460, 52100, 44414], vids: [52088, 52316, 52112, 52317], car: [52099, 52106, 36692, 23141] },
      fr: { id: ['Marcus Reed', 'Propriétaire et préparateur physique', 'Force · Hypertrophie · Powerlifting', 'Iron Forge Gym'], ct: ['+1 514 555-0177', 'info@ironforgegym.ca', 'ironforgegym.ca'],
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', youtube: 'https://youtube.com/' },
        about: ['La salle', '1 200 m² dédiés à la force : racks de squat, plateformes d’haltérophilie, haltères jusqu’à 70 kg et zone de conditionnement. Ouvert 24 h sur 24 avec carte d’accès, coachs sur place tous les soirs.'],
        progTitle: 'Abonnements', prog: [['Mensuel', 'Accès 24 h/24 · sans engagement', '59 $ / mois'], ['Annuel', 'Accès 24 h/24 · 2 mois offerts', '590 $'], ['Coaching force', '12 semaines · programme et suivi', '399 $'], ['Séance d’essai', 'Visite + entraînement guidé', 'Gratuit']],
        method: ['Notre méthode', [['Évaluation de départ', 'Force, mobilité, objectifs'], ['Programme périodisé', 'Cycles de 4 semaines'], ['Suivi des charges', 'Application et bilans mensuels']]],
        plan: ['Cours en groupe', [['Lundi et mercredi', 'Powerlifting · 19 h'], ['Mardi et jeudi', 'Conditionnement · 18 h'], ['Samedi', 'Haltérophilie · 10 h']], '10 athlètes maximum par cours'],
        book: ['glofox', 'https://app.glofox.com/portal/#/branch/ironforgegym', 'Réserver ma séance d’essai', 'Séance d’essai gratuite, sans engagement.'],
        stats: [['24/7', 'accès à la salle'], ['70 kg', 'haltères les plus lourds'], ['800+', 'membres actifs']],
        gal: ['Développé épaules', 'Développé couché', 'Soulevé de terre', 'Charges libres', 'Préparation', 'Haltérophilie'],
        vidTitle: 'Dans la salle en vidéo', vids: ['Cordes ondulatoires', 'Séance de force', 'Gainage', 'Circuit intense'],
        carTitle: 'Nos athlètes', car: ['Épaules', 'Renforcement', 'Haltères', 'Cordes'],
        locTitle: 'La salle', loc: ['9100, boulevard Saint-Laurent, Montréal (Québec) H2N 1M9', 'Stationnement gratuit · Métro Crémazie'],
        rev: [['Kevin D.', 'Membre depuis 2023', 'Le meilleur matériel en ville et une vraie ambiance de travail.'], ['Sarah L.', 'Coaching force', '+40 kg au soulevé de terre en 12 semaines. Coachs au top.']] },
      en: { id: ['Marcus Reed', 'Owner & strength coach', 'Strength · Hypertrophy · Powerlifting', 'Iron Forge Gym'], ct: ['+1 713 555-0177', 'info@ironforgegym.com', 'ironforgegym.com'],
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', youtube: 'https://youtube.com/' },
        about: ['The gym', '13,000 sq ft built for strength: squat racks, Olympic lifting platforms, dumbbells up to 150 lb and a conditioning zone. Open 24/7 with key-card access, coaches on the floor every evening.'],
        progTitle: 'Memberships', prog: [['Monthly', '24/7 access · no contract', '$49 / mo'], ['Annual', '24/7 access · 2 months free', '$490'], ['Strength coaching', '12 weeks · program + check-ins', '$349'], ['Trial session', 'Tour + guided workout', 'Free']],
        method: ['Our method', [['Starting assessment', 'Strength, mobility, goals'], ['Periodized program', '4-week blocks'], ['Load tracking', 'App + monthly reviews']]],
        plan: ['Group classes', [['Monday & Wednesday', 'Powerlifting · 7 p.m.'], ['Tuesday & Thursday', 'Conditioning · 6 p.m.'], ['Saturday', 'Olympic lifting · 10 a.m.']], 'Max 10 athletes per class'],
        book: ['glofox', 'https://app.glofox.com/portal/#/branch/ironforgegym', 'Book my free trial', 'Free trial session, no commitment.'],
        stats: [['24/7', 'gym access'], ['150 lb', 'heaviest dumbbells'], ['800+', 'active members']],
        gal: ['Shoulder press', 'Bench press', 'Deadlift', 'Free weights', 'Getting ready', 'Olympic lifting'],
        vidTitle: 'Inside the gym', vids: ['Battle ropes', 'Strength session', 'Core work', 'High-intensity circuit'],
        carTitle: 'Our athletes', car: ['Shoulders', 'Strength', 'Dumbbells', 'Ropes'],
        locTitle: 'The gym', loc: ['2401 Navigation Boulevard, Houston, TX 77003', 'Free parking · EaDo'],
        rev: [['Kevin D.', 'Member since 2023', 'Best equipment in town and a real work-hard vibe.'], ['Sarah L.', 'Strength coaching', '+90 lb on my deadlift in 12 weeks. Amazing coaches.']] } },

    { id: 'fitness', icon: 'heart-pulse', rec: 'd9',
      n: ['Salle de fitness', 'Fitness studio'], ex: ['Cours collectifs, cardio, zumba', 'Group classes, cardio, Zumba'],
      pal: [pal('Corail', '#e11d48', '#fda4af'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Violet', '#7c3aed', '#c4b5fd'), pal('Énergie', '#dc2626', '#fbbf24'), pal('Bleu électrique', '#1d4ed8', '#67e8f9'), pal('Noir', '#111111', '#f472b6')],
      M: { portrait: 48553, cover: 47878, gal: [16116, 48556, 49276, 48561, 47877, 23416], vids: [16117, 48548] },
      fr: { id: ['Tiffany Moore', 'Directrice et instructrice', 'Cours collectifs · Cardio · Zumba', 'Pulse Fitness'], ct: ['+1 450 555-0148', 'bonjour@pulsefitness.ca', 'pulsefitness.ca'],
        about: ['Le studio', 'Plus de 40 cours par semaine dans une ambiance qui donne envie de revenir : zumba, cardio, pilates, step et renforcement. Tous niveaux, coachs certifiés, vestiaires avec douches.'],
        progTitle: 'Formules', prog: [['Illimité', 'Tous les cours · sans engagement', '69 $ / mois'], ['Carte 10 cours', 'Valide 3 mois', '150 $'], ['Cours à l’unité', 'Réservation en ligne', '18 $'], ['Premier cours', 'Pour essayer', 'Gratuit']],
        method: null,
        plan: ['Cours populaires', [['Lundi', 'Zumba · 18 h 30'], ['Mardi', 'Pilates · 12 h 10'], ['Jeudi', 'Cardio intense · 18 h'], ['Samedi', 'Step · 10 h']], 'Horaire complet dans l’application'],
        book: ['mindbody', 'https://www.mindbodyonline.com/explore/locations/pulse-fitness-laval', 'Réserver un cours', 'Premier cours gratuit.'],
        stats: [['40+', 'cours par semaine'], ['12', 'instructeurs certifiés'], ['4,9/5', 'note de nos membres']],
        gal: ['Zumba', 'Cours en groupe', 'Cardio', 'Échauffement', 'Tapis de course', 'Aérobie'],
        vidTitle: 'L’ambiance en vidéo', vids: ['Cours de zumba', 'Cours avec instructrice'],
        locTitle: 'Le studio', loc: ['3030, boulevard Le Carrefour, Laval (Québec) H7T 2P5', 'Stationnement gratuit · Métro Montmorency à 5 min'],
        rev: [['Nadia R.', 'Membre illimitée', 'Je n’ai jamais été aussi régulière. Les cours de zumba sont une fête !'], ['Julie B.', 'Pilates', 'Instructrices attentives, petits groupes, je recommande.']] },
      en: { id: ['Tiffany Moore', 'Studio director & instructor', 'Group classes · Cardio · Zumba', 'Pulse Fitness'], ct: ['+1 602 555-0148', 'hello@pulsefitness.com', 'pulsefitness.com'],
        about: ['The studio', '40+ classes a week in a vibe that makes you want to come back: Zumba, cardio, Pilates, step and strength. All levels, certified coaches, locker rooms with showers.'],
        progTitle: 'Plans', prog: [['Unlimited', 'All classes · no contract', '$59 / mo'], ['10-class pack', 'Valid 3 months', '$140'], ['Drop-in class', 'Book online', '$18'], ['First class', 'Try it out', 'Free']],
        method: null,
        plan: ['Popular classes', [['Monday', 'Zumba · 6:30 p.m.'], ['Tuesday', 'Pilates · 12:10 p.m.'], ['Thursday', 'HIIT cardio · 6 p.m.'], ['Saturday', 'Step · 10 a.m.']], 'Full schedule in the app'],
        book: ['mindbody', 'https://www.mindbodyonline.com/explore/locations/pulse-fitness-phoenix', 'Book a class', 'Your first class is free.'],
        stats: [['40+', 'classes a week'], ['12', 'certified instructors'], ['4.9/5', 'member rating']],
        gal: ['Zumba', 'Group class', 'Cardio', 'Warm-up', 'Treadmills', 'Aerobics'],
        vidTitle: 'Feel the vibe', vids: ['Zumba class', 'Class with our instructor'],
        locTitle: 'The studio', loc: ['4400 North Central Avenue, Phoenix, AZ 85012', 'Free parking · Light rail at Indian School'],
        rev: [['Nadia R.', 'Unlimited member', 'I’ve never been this consistent. Zumba class is a party!'], ['Julie B.', 'Pilates', 'Attentive instructors, small groups, highly recommend.']] } },

    { id: 'soccer', icon: 'volleyball', rec: 'd3',
      n: ['Coach de soccer', 'Soccer coach'], ex: ['Équipes, académie, cours privés', 'Teams, academy, private lessons'],
      pal: [pal('Vert terrain', '#166534', '#bef264'), pal('Bleu marine', '#1e3a8a', '#fbbf24'), pal('Rouge club', '#b91c1c', '#fde68a'), pal('Noir et blanc', '#111111', '#e5e7eb'), pal('Orange', '#ea580c', '#fed7aa'), pal('Ciel', '#0284c7', '#bae6fd')],
      M: { portrait: 43490, cover: 41372, gal: [43486, 43499, 43491, 43479, 9362, 43494], vids: [43482, 43501] },
      fr: { id: ['Connor Davies', 'Entraîneur de soccer certifié', 'Académie jeunesse · Cours privés', 'Académie Davies Soccer'], ct: ['+1 418 555-0123', 'info@daviessoccer.ca', 'daviessoccer.ca'], wa: true,
        about: ['Qui suis-je ?', 'Ancien joueur semi-professionnel, entraîneur certifié de Soccer Québec. J’accompagne les joueurs de 6 à 18 ans : technique, vision du jeu et confiance, en équipe ou en cours privé.'],
        progTitle: 'Programmes et tarifs', prog: [['Académie U8 à U12', 'Saison de 12 semaines · 2 séances par semaine', '320 $'], ['Académie U13 à U18', 'Saison de 12 semaines · 3 séances par semaine', '420 $'], ['Cours privé', '1 h · technique individuelle', '70 $'], ['Camp d’été', '5 jours · 9 h à 15 h', '275 $']],
        method: ['Ma méthode', [['Technique', 'Contrôle, passes, frappes'], ['Tactique', 'Placement et lecture du jeu'], ['Mental', 'Confiance et esprit d’équipe']]],
        plan: ['Entraînements', [['Mardi et jeudi', 'U8 à U12 · 17 h 30'], ['Lundi, mercredi, vendredi', 'U13 à U18 · 18 h 30'], ['Samedi', 'Matchs amicaux · 10 h']], 'Terrain synthétique éclairé'],
        book: ['calendly', 'https://calendly.com/daviessoccer/essai', 'Réserver une séance d’essai', 'Première séance d’essai offerte.'],
        stats: [['15 ans', 'd’expérience'], ['300+', 'jeunes formés'], ['3', 'titres régionaux']],
        gal: ['Passes en mouvement', 'Match amical', 'Jeu de pieds', 'Esprit d’équipe', 'Tactique', 'Tirs au but'],
        vidTitle: 'Sur le terrain', vids: ['Match de l’académie', 'Jonglage et technique'],
        locTitle: 'Le terrain', loc: ['Stade Chauveau, 3000, rue Rodolphe-Forget, Québec (Québec) G1C 0K7', 'Stationnement gratuit · Vestiaires sur place'],
        rev: [['Marc-André P.', 'Parent U10', 'Mon fils a gagné énormément en confiance. Coach patient et exigeant.'], ['Laurie S.', 'Joueuse U16', 'Les meilleurs entraînements techniques que j’ai eus.']] },
      en: { id: ['Connor Davies', 'Licensed soccer coach', 'Youth academy · Private lessons', 'Davies Soccer Academy'], ct: ['+1 206 555-0123', 'info@daviessoccer.com', 'daviessoccer.com'], wa: true,
        about: ['About me', 'A former semi-pro player with a USSF coaching license, I coach players ages 6 to 18: technique, game vision and confidence, in teams or private lessons.'],
        progTitle: 'Programs & pricing', prog: [['Academy U8–U12', '12-week season · 2 sessions a week', '$320'], ['Academy U13–U18', '12-week season · 3 sessions a week', '$420'], ['Private lesson', '1 hr · individual technique', '$75'], ['Summer camp', '5 days · 9 a.m. – 3 p.m.', '$275']],
        method: ['My method', [['Technique', 'First touch, passing, shooting'], ['Tactics', 'Positioning and reading the game'], ['Mindset', 'Confidence and team spirit']]],
        plan: ['Practice schedule', [['Tuesday & Thursday', 'U8–U12 · 5:30 p.m.'], ['Mon, Wed, Fri', 'U13–U18 · 6:30 p.m.'], ['Saturday', 'Scrimmages · 10 a.m.']], 'Lit turf field'],
        book: ['calendly', 'https://calendly.com/daviessoccer/trial', 'Book a trial session', 'Your first trial session is free.'],
        stats: [['15 yrs', 'of experience'], ['300+', 'players trained'], ['3', 'regional titles']],
        gal: ['Passing drills', 'Scrimmage', 'Footwork', 'Team spirit', 'Tactics', 'Shooting'],
        vidTitle: 'On the field', vids: ['Academy match', 'Juggling & technique'],
        locTitle: 'The field', loc: ['Starfire Sports, 14800 Starfire Way, Tukwila, WA 98188', 'Free parking · Locker rooms on site'],
        rev: [['Mark P.', 'U10 parent', 'My son gained so much confidence. Patient and demanding coach.'], ['Lauren S.', 'U16 player', 'The best technical training I’ve ever had.']] } },

    { id: 'baseball', icon: 'trophy', rec: 'd8',
      n: ['Coach de baseball', 'Baseball coach'], ex: ['Frappe, lancer, camps', 'Hitting, pitching, camps'],
      pal: [pal('Bleu marine', '#1e3a8a', '#ef4444'), pal('Rouge', '#b91c1c', '#f8fafc'), pal('Terre battue', '#9a3412', '#fed7aa'), pal('Vert foncé', '#14532d', '#fde68a'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Gris acier', '#374151', '#38bdf8')],
      M: { portrait: 23452, cover: 24176, gal: [856, 858, 23099, 23462, 853, 28454], vids: [23462, 853] },
      fr: { id: ['Jake Sullivan', 'Entraîneur de baseball', 'Frappe · Lancer · Camps', 'Sullivan Baseball'], ct: ['+1 819 555-0164', 'info@sullivanbaseball.ca', 'sullivanbaseball.ca'],
        about: ['Qui suis-je ?', 'Ancien receveur en ligue junior élite, j’entraîne depuis 12 ans. Cours privés de frappe et de lancer, analyse vidéo de l’élan et camps pendant la relâche et l’été.'],
        progTitle: 'Cours et camps', prog: [['Cours privé de frappe', '1 h · analyse vidéo', '75 $'], ['Cours de lancer', '1 h · mécanique et contrôle', '75 $'], ['Petit groupe', '4 joueurs · 1 h 30', '35 $ / joueur'], ['Camp de la relâche', '5 jours · 9 ans et plus', '295 $']],
        method: ['Ma méthode', [['Analyse vidéo', 'Élan et lancer au ralenti'], ['Exercices ciblés', 'Corrections une à une'], ['Mise en situation', 'Matchs simulés']]],
        plan: ['Disponibilités', [['Lundi au jeudi', '16 h – 20 h'], ['Samedi', '9 h – 15 h'], ['Été', 'Camps du lundi au vendredi']], 'Cage intérieure l’hiver'],
        book: ['calendly', 'https://calendly.com/sullivanbaseball/cours', 'Réserver un cours', 'Choisissez votre créneau en ligne.'],
        stats: [['12 ans', 'd’entraînement'], ['40+', 'joueurs en ligue élite'], ['+15 %', 'vitesse de frappe moyenne']],
        gal: ['Au monticule', 'Attraper et relancer', 'Gant et balle', 'Pratique au parc', 'Au bâton', 'Le matériel'],
        vidTitle: 'À l’entraînement', vids: ['Pratique au parc', 'Frappe au bâton'],
        locTitle: 'Le terrain', loc: ['Stade Quillorama, 1760, avenue Gilles-Villeneuve, Trois-Rivières (Québec) G9A 5K8', 'Cage intérieure en hiver · Stationnement gratuit'],
        rev: [['Stéphane G.', 'Parent', 'Mon fils frappe la balle avec beaucoup plus d’assurance.'], ['Mathis L.', 'Lanceur, 15 ans', 'Ma vitesse a augmenté et mon contrôle aussi.']] },
      en: { id: ['Jake Sullivan', 'Baseball coach', 'Hitting · Pitching · Camps', 'Sullivan Baseball'], ct: ['+1 314 555-0164', 'info@sullivanbaseball.com', 'sullivanbaseball.com'],
        about: ['About me', 'A former college catcher, I’ve coached for 12 years. Private hitting and pitching lessons, video swing analysis, and spring-break and summer camps.'],
        progTitle: 'Lessons & camps', prog: [['Private hitting lesson', '1 hr · video analysis', '$80'], ['Pitching lesson', '1 hr · mechanics & control', '$80'], ['Small group', '4 players · 90 min', '$35 / player'], ['Spring-break camp', '5 days · ages 9+', '$295']],
        method: ['My method', [['Video analysis', 'Swing and delivery in slow motion'], ['Targeted drills', 'One fix at a time'], ['Game situations', 'Live at-bats']]],
        plan: ['Availability', [['Monday – Thursday', '4 p.m. – 8 p.m.'], ['Saturday', '9 a.m. – 3 p.m.'], ['Summer', 'Camps Monday to Friday']], 'Indoor cages in winter'],
        book: ['calendly', 'https://calendly.com/sullivanbaseball/lesson', 'Book a lesson', 'Pick your time online.'],
        stats: [['12 yrs', 'coaching'], ['40+', 'players in college ball'], ['+15%', 'average exit velocity']],
        gal: ['On the mound', 'Catch & throw', 'Glove & ball', 'Practice at the park', 'At bat', 'The gear'],
        vidTitle: 'At practice', vids: ['Practice at the park', 'Hitting session'],
        locTitle: 'The field', loc: ['Heine Meine Field, 2000 Gravois Road, St. Louis, MO 63129', 'Indoor cages in winter · Free parking'],
        rev: [['Steve G.', 'Parent', 'My son swings with so much more confidence now.'], ['Mason L.', 'Pitcher, 15', 'My velocity went up and so did my control.']] } },

    { id: 'football', icon: 'shield', rec: 'd5',
      n: ['Coach de football américain', 'Football coach'], ex: ['Équipes, positions, préparation', 'Teams, positions, conditioning'],
      pal: [pal('Vert et or', '#14532d', '#eab308'), pal('Bleu nuit', '#1e3a8a', '#e5e7eb'), pal('Bordeaux', '#7f1d1d', '#fbbf24'), pal('Noir', '#111111', '#22c55e'), pal('Orange', '#c2410c', '#1f2937'), pal('Violet', '#4c1d95', '#fbbf24')],
      M: { portrait: 42566, cover: 42558, gal: [42549, 42556, 42548, 42554, 23636, 22812], vids: [42550, 42561] },
      fr: { id: ['Derek Holloway', 'Entraîneur de football', 'Quarts-arrières · Receveurs · Préparation', 'Holloway Football'], ct: ['+1 819 555-0139', 'info@hollowayfootball.ca', 'hollowayfootball.ca'],
        about: ['Qui suis-je ?', 'Ancien quart-arrière universitaire, j’entraîne les joueurs du secondaire et du cégep par position : lecture de jeu, précision des passes, routes de course et préparation physique.'],
        progTitle: 'Programmes', prog: [['Clinique quarts-arrières', '8 semaines · 2 séances par semaine', '360 $'], ['Clinique receveurs', '8 semaines · routes et réceptions', '320 $'], ['Cours privé', '1 h · par position', '80 $'], ['Préparation physique', 'Vitesse, agilité, force', '45 $ / séance']],
        method: ['Ma méthode', [['Fondamentaux', 'Posture, pas, mécanique'], ['Lecture du jeu', 'Analyse vidéo des matchs'], ['Préparation', 'Vitesse et explosivité']]],
        plan: ['Entraînements', [['Mardi et jeudi', 'Cliniques · 18 h'], ['Samedi', 'Préparation physique · 9 h']], 'Terrain synthétique éclairé'],
        book: ['calendly', 'https://calendly.com/hollowayfootball/clinique', 'Réserver ma place', 'Places limitées à 16 joueurs par clinique.'],
        stats: [['10 ans', 'd’entraînement'], ['25', 'joueurs au niveau universitaire'], ['16', 'joueurs max par clinique']],
        gal: ['Passe en mouvement', 'Réception', 'Échauffement', 'Lancer de précision', 'Tactique', 'L’équipement'],
        vidTitle: 'Sur le terrain', vids: ['Passes à l’entraînement', 'Mise en situation'],
        locTitle: 'Le terrain', loc: ['Stade de l’Université de Sherbrooke, 2500, boulevard de l’Université, Sherbrooke (Québec) J1K 2R1', 'Stationnement P-8 · Vestiaires sur place'],
        rev: [['William T.', 'Quart-arrière, 17 ans', 'Ma précision a changé du tout au tout en une saison.'], ['Isabelle M.', 'Parent', 'Encadrement sérieux, mon fils adore.']] },
      en: { id: ['Derek Holloway', 'Football coach', 'Quarterbacks · Receivers · Conditioning', 'Holloway Football'], ct: ['+1 214 555-0139', 'info@hollowayfootball.com', 'hollowayfootball.com'],
        about: ['About me', 'A former college quarterback, I train high school players by position: reading defenses, passing accuracy, route running and conditioning.'],
        progTitle: 'Programs', prog: [['QB clinic', '8 weeks · 2 sessions a week', '$380'], ['WR clinic', '8 weeks · routes and catching', '$340'], ['Private lesson', '1 hr · by position', '$90'], ['Speed & conditioning', 'Speed, agility, strength', '$45 / session']],
        method: ['My method', [['Fundamentals', 'Stance, footwork, mechanics'], ['Reading the game', 'Film study'], ['Conditioning', 'Speed and explosiveness']]],
        plan: ['Practice schedule', [['Tuesday & Thursday', 'Clinics · 6 p.m.'], ['Saturday', 'Speed & conditioning · 9 a.m.']], 'Lit turf field'],
        book: ['calendly', 'https://calendly.com/hollowayfootball/clinic', 'Reserve my spot', 'Limited to 16 players per clinic.'],
        stats: [['10 yrs', 'coaching'], ['25', 'players now in college'], ['16', 'players max per clinic']],
        gal: ['Throw on the run', 'The catch', 'Warm-up', 'Accuracy drill', 'Tactics', 'The gear'],
        vidTitle: 'On the field', vids: ['Passing drills', 'Live reps'],
        locTitle: 'The field', loc: ['Kincaide Stadium, 4900 Mesquite Avenue, Dallas, TX 75229', 'Free parking · Locker rooms on site'],
        rev: [['William T.', 'QB, 17', 'My accuracy completely changed in one season.'], ['Lisa M.', 'Parent', 'Serious coaching, my son loves it.']] } },

    { id: 'yoga', icon: 'flower', rec: 'd4',
      n: ['Monitrice de yoga', 'Yoga instructor'], ex: ['Hatha, vinyasa, méditation', 'Hatha, vinyasa, meditation'],
      pal: [pal('Sauge', '#52705f', '#cfe0cf'), pal('Lavande', '#6b5b95', '#ddd2f0'), pal('Terracotta', '#a0522d', '#f4c7a1'), pal('Sable', '#7a5c3e', '#e6d3b3'), pal('Bleu océan', '#0e7490', '#a5f3fc'), pal('Rose poudré', '#9d4b62', '#f3c4cf')],
      M: { portrait: 892, cover: 43736, gal: [43737, 1053, 5057, 32631, 4420, 43736], vids: [43737, 45764] },
      fr: { id: ['Sienna Hart', 'Professeure de yoga certifiée', 'Hatha · Vinyasa · Méditation', 'Studio Prana'], ct: ['+1 514 555-0186', 'bonjour@studioprana.ca', 'studioprana.ca'],
        about: ['Mon approche', 'Certifiée 500 h, j’enseigne un yoga accessible et profond : respiration, alignement et lâcher-prise. Des cours en petits groupes pour progresser à votre rythme, débutants bienvenus.'],
        progTitle: 'Cours et forfaits', prog: [['Cours à l’unité', '75 min · tapis fournis', '22 $'], ['Carte 10 cours', 'Valide 4 mois', '190 $'], ['Illimité', 'Tous les cours', '119 $ / mois'], ['Cours privé', '60 min · chez vous ou au studio', '90 $']],
        method: null,
        plan: ['Horaire', [['Lundi', 'Hatha doux · 18 h'], ['Mercredi', 'Vinyasa · 7 h et 18 h 30'], ['Samedi', 'Yoga et méditation · 9 h 30']], '12 personnes maximum par cours'],
        book: ['momence', 'https://momence.com/studio-prana', 'Réserver un cours', 'Premier cours à 10 $ pour les nouveaux.'],
        stats: [['500 h', 'de formation'], ['12', 'personnes max par cours'], ['9 ans', 'd’enseignement']],
        gal: ['Cours en groupe', 'Sur la terrasse', 'Équilibre', 'Méditation', 'Au coucher du soleil', 'Le studio'],
        vidTitle: 'Un cours en vidéo', vids: ['Cours en groupe', 'Pilates et étirements'],
        locTitle: 'Le studio', loc: ['4350, rue Saint-Denis, Montréal (Québec) H2J 2K9', 'Métro Mont-Royal · Tapis et accessoires fournis'],
        rev: [['Catherine B.', 'Membre illimitée', 'Mon heure préférée de la semaine. Sienna explique tout avec douceur.'], ['Mathieu D.', 'Débutant', 'Je n’avais jamais fait de yoga, je me suis senti à l’aise dès le premier cours.']] },
      en: { id: ['Sienna Hart', 'Certified yoga teacher', 'Hatha · Vinyasa · Meditation', 'Prana Studio'], ct: ['+1 310 555-0186', 'hello@pranastudio.com', 'pranastudio.com'],
        about: ['My approach', 'E-RYT 500, I teach yoga that is accessible yet deep: breath, alignment and letting go. Small classes so you progress at your own pace, beginners welcome.'],
        progTitle: 'Classes & passes', prog: [['Drop-in class', '75 min · mats provided', '$25'], ['10-class pack', 'Valid 4 months', '$210'], ['Unlimited', 'All classes', '$139 / mo'], ['Private session', '60 min · at home or in studio', '$110']],
        method: null,
        plan: ['Schedule', [['Monday', 'Gentle hatha · 6 p.m.'], ['Wednesday', 'Vinyasa · 7 a.m. & 6:30 p.m.'], ['Saturday', 'Yoga & meditation · 9:30 a.m.']], 'Max 12 people per class'],
        book: ['momence', 'https://momence.com/prana-studio', 'Book a class', 'First class $10 for new students.'],
        stats: [['500 hrs', 'of training'], ['12', 'people max per class'], ['9 yrs', 'teaching']],
        gal: ['Group class', 'On the deck', 'Balance', 'Meditation', 'At sunset', 'The studio'],
        vidTitle: 'A class on video', vids: ['Group class', 'Pilates & stretching'],
        locTitle: 'The studio', loc: ['1450 Ocean Avenue, Santa Monica, CA 90401', 'Street parking · Mats and props provided'],
        rev: [['Catherine B.', 'Unlimited member', 'My favorite hour of the week. Sienna explains everything so gently.'], ['Matt D.', 'Beginner', 'I’d never done yoga and felt at ease from the very first class.']] } },

    { id: 'musique', icon: 'music', rec: 'd10',
      n: ['Professeur de musique', 'Music teacher'], ex: ['Piano, violon, guitare', 'Piano, violin, guitar'],
      pal: [pal('Bleu minuit', '#1e2a4a', '#d8b46a'), pal('Bordeaux', '#6b1d2a', '#e8c39e'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Vert sapin', '#1f4d3a', '#e6d3a3'), pal('Encre', '#1f2937', '#fbbf24'), pal('Prune', '#5b2150', '#e9a8d9')],
      M: { portrait: 41704, cover: 43770, gal: [41683, 41678, 42834, 44161, 51843, 43775], vids: [41667, 41703] },
      fr: { id: ['Oliver Grayson', 'Professeur de musique', 'Piano · Violon · Guitare', 'École de musique Grayson'], ct: ['+1 514 555-0131', 'bonjour@musiquegrayson.ca', 'musiquegrayson.ca'],
        about: ['Qui suis-je ?', 'Diplômé du Conservatoire, j’enseigne le piano, le violon et la guitare aux enfants dès 5 ans et aux adultes. Cours adaptés à vos goûts, du classique à la pop, avec préparation aux examens.'],
        progTitle: 'Cours et tarifs', prog: [['Cours individuel', '30 min · enfants', '35 $'], ['Cours individuel', '60 min · ados et adultes', '65 $'], ['Session de 10 cours', 'Paiement en 2 versements', '590 $'], ['Cours d’essai', '30 min · rencontre et évaluation', 'Gratuit']],
        method: ['Ma méthode', [['Les bases', 'Lecture, rythme, posture'], ['Le répertoire', 'Les morceaux que vous aimez'], ['La scène', 'Récital de fin d’année']]],
        plan: ['Disponibilités', [['Lundi au vendredi', '15 h – 21 h'], ['Samedi', '9 h – 16 h']], 'Cours en ligne possibles'],
        book: ['acuity', 'https://musiquegrayson.as.me', 'Réserver un cours d’essai', 'Le premier cours d’essai est offert.'],
        stats: [['20 ans', 'd’enseignement'], ['3', 'instruments'], ['1', 'récital par année']],
        gal: ['Au piano', 'Partitions', 'Accords de guitare', 'Guitare classique', 'Batterie au studio', 'Le piano à queue'],
        vidTitle: 'En musique', vids: ['Au piano', 'Duo de violons'],
        locTitle: 'Le studio', loc: ['1155, avenue Bernard Ouest, Montréal (Québec) H2V 1V5', 'Outremont · Métro Outremont'],
        rev: [['Valérie C.', 'Maman d’Emma, 8 ans', 'Emma attend ses cours avec impatience. Patient et passionné.'], ['François G.', 'Adulte débutant', 'J’ai enfin réalisé mon rêve de jouer du piano.']] },
      en: { id: ['Oliver Grayson', 'Music teacher', 'Piano · Violin · Guitar', 'Grayson Music School'], ct: ['+1 617 555-0131', 'hello@graysonmusic.com', 'graysonmusic.com'],
        about: ['About me', 'A conservatory graduate, I teach piano, violin and guitar to kids from age 5 and to adults. Lessons tailored to your taste, from classical to pop, with exam preparation.'],
        progTitle: 'Lessons & pricing', prog: [['Private lesson', '30 min · kids', '$40'], ['Private lesson', '60 min · teens & adults', '$75'], ['10-lesson package', 'Pay in 2 installments', '$680'], ['Trial lesson', '30 min · meet & assess', 'Free']],
        method: ['My method', [['The basics', 'Reading, rhythm, posture'], ['The repertoire', 'Songs you love'], ['The stage', 'Year-end recital']]],
        plan: ['Availability', [['Monday – Friday', '3 p.m. – 9 p.m.'], ['Saturday', '9 a.m. – 4 p.m.']], 'Online lessons available'],
        book: ['acuity', 'https://graysonmusic.as.me', 'Book a trial lesson', 'Your first trial lesson is free.'],
        stats: [['20 yrs', 'teaching'], ['3', 'instruments'], ['1', 'recital every year']],
        gal: ['At the piano', 'Sheet music', 'Guitar chords', 'Classical guitar', 'Drums in the studio', 'The grand piano'],
        vidTitle: 'In music', vids: ['At the piano', 'Violin duet'],
        locTitle: 'The studio', loc: ['1280 Massachusetts Avenue, Cambridge, MA 02138', 'Harvard Square · Red Line'],
        rev: [['Valerie C.', 'Mom of Emma, 8', 'Emma can’t wait for her lessons. Patient and passionate.'], ['Frank G.', 'Adult beginner', 'I finally made my dream of playing piano come true.']] } },

    { id: 'theatre', icon: 'drama', rec: 'd5',
      n: ['Professeure de théâtre', 'Drama teacher'], ex: ['Ateliers, jeu, prise de parole', 'Workshops, acting, public speaking'],
      pal: [pal('Rouge velours', '#9f1239', '#fda4af'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Bleu nuit', '#1e3a8a', '#fbbf24'), pal('Prune', '#5b2150', '#e9a8d9'), pal('Encre', '#1f2937', '#f472b6'), pal('Émeraude', '#065f46', '#6ee7b7')],
      M: { portrait: 43400, cover: 26786, gal: [24140, 43407, 47045, 20769, 37046, 22522], vids: [43400, 47045] },
      fr: { id: ['Abigail Lawson', 'Professeure de théâtre', 'Jeu · Improvisation · Prise de parole', 'Atelier Scène Lawson'], ct: ['+1 418 555-0157', 'bonjour@scenelawson.ca', 'scenelawson.ca'],
        about: ['Qui suis-je ?', 'Comédienne diplômée du Conservatoire d’art dramatique de Québec, j’enseigne le jeu aux enfants, aux ados et aux adultes. Improvisation, travail de texte et confiance en soi, avec une pièce présentée en fin de session.'],
        progTitle: 'Ateliers', prog: [['Atelier jeunes (8 à 12 ans)', '12 semaines · 1 h 30 par semaine', '260 $'], ['Atelier ados', '12 semaines · pièce de fin de session', '290 $'], ['Atelier adultes', '10 semaines · jeu et improvisation', '320 $'], ['Prise de parole', 'Cours privé · 1 h', '85 $']],
        method: ['Ma méthode', [['Le corps et la voix', 'Échauffements, diction'], ['L’improvisation', 'Écoute et spontanéité'], ['La scène', 'Une pièce devant public']]],
        plan: ['Horaire des ateliers', [['Mardi', 'Ados · 18 h'], ['Mercredi', 'Adultes · 19 h'], ['Samedi', 'Jeunes · 10 h']], 'Session d’automne et d’hiver'],
        book: ['acuity', 'https://scenelawson.as.me', 'Réserver ma place', 'Places limitées à 12 participants.'],
        stats: [['15 ans', 'sur scène'], ['12', 'participants max'], ['2', 'pièces par année']],
        gal: ['Répétition au miroir', 'Jeu masqué', 'Sur scène', 'Les coulisses', 'Lecture du texte', 'Les projecteurs'],
        vidTitle: 'En répétition', vids: ['Répétition à deux', 'Sur scène'],
        locTitle: 'La salle', loc: ['Salle Albert-Rousseau, 2410, chemin Sainte-Foy, Québec (Québec) G1V 1T3', 'Stationnement gratuit · Accès fauteuil roulant'],
        rev: [['Chantal R.', 'Maman de Léa, 10 ans', 'Ma fille si timide a joué devant 200 personnes. Merci !'], ['Patrick N.', 'Atelier adultes', 'Le meilleur moment de ma semaine, et j’ose enfin parler en public.']] },
      en: { id: ['Abigail Lawson', 'Drama teacher', 'Acting · Improv · Public speaking', 'Lawson Stage Workshop'], ct: ['+1 312 555-0157', 'hello@lawsonstage.com', 'lawsonstage.com'],
        about: ['About me', 'A trained actor with a BFA in theatre, I teach acting to kids, teens and adults. Improv, scene work and self-confidence, with a play performed at the end of each session.'],
        progTitle: 'Workshops', prog: [['Kids workshop (8–12)', '12 weeks · 90 min a week', '$280'], ['Teen workshop', '12 weeks · end-of-session play', '$310'], ['Adult workshop', '10 weeks · acting & improv', '$340'], ['Public speaking', 'Private lesson · 1 hr', '$95']],
        method: ['My method', [['Body & voice', 'Warm-ups, diction'], ['Improv', 'Listening and spontaneity'], ['The stage', 'A play in front of an audience']]],
        plan: ['Workshop schedule', [['Tuesday', 'Teens · 6 p.m.'], ['Wednesday', 'Adults · 7 p.m.'], ['Saturday', 'Kids · 10 a.m.']], 'Fall and winter sessions'],
        book: ['acuity', 'https://lawsonstage.as.me', 'Reserve my spot', 'Limited to 12 participants.'],
        stats: [['15 yrs', 'on stage'], ['12', 'participants max'], ['2', 'plays a year']],
        gal: ['Mirror rehearsal', 'Mask work', 'On stage', 'Backstage', 'Script reading', 'Stage lights'],
        vidTitle: 'In rehearsal', vids: ['Two-person rehearsal', 'On stage'],
        locTitle: 'The theater', loc: ['Den Theatre, 1331 North Milwaukee Avenue, Chicago, IL 60622', 'Wicker Park · Blue Line Division'],
        rev: [['Chantal R.', 'Mom of Lea, 10', 'My shy daughter performed in front of 200 people. Thank you!'], ['Patrick N.', 'Adult workshop', 'The best part of my week, and I finally dare to speak in public.']] } },

    { id: 'boxe', icon: 'swords', rec: 'd5',
      n: ['Coach de boxe et kickboxing', 'Boxing & kickboxing coach'], ex: ['Technique, cardio, combat', 'Technique, cardio, sparring'],
      pal: [pal('Rouge combat', '#b91c1c', '#111111'), pal('Noir & or', '#1c1917', '#c9a227'), pal('Noir et rouge', '#0a0a0a', '#ef4444'), pal('Bleu acier', '#1f3a5f', '#f97316'), pal('Gris béton', '#3f3f46', '#facc15'), pal('Violet', '#4c1d95', '#f472b6')],
      M: { portrait: 40971, cover: 45874, gal: [40257, 40950, 4596, 40276, 47759, 23929], vids: [40258, 23929] },
      fr: { id: ['Shane Porter', 'Coach de boxe et kickboxing', 'Technique · Cardio · Combat', 'Porter Boxing Club'], ct: ['+1 450 555-0172', 'info@porterboxing.ca', 'porterboxing.ca'],
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', facebook: 'https://facebook.com/' },
        about: ['Qui suis-je ?', 'Ancien boxeur amateur médaillé, j’enseigne la boxe et le kickboxing à tous les niveaux : remise en forme, technique ou préparation au combat. Ambiance respectueuse, aucun contact sans votre accord.'],
        progTitle: 'Cours et abonnements', prog: [['Illimité', 'Tous les cours de groupe', '89 $ / mois'], ['Cours privé', '1 h · mitaines et sac', '70 $'], ['Boxe cardio', 'Cours à l’unité · 50 min', '20 $'], ['Initiation', '4 cours pour débutants', '60 $']],
        method: ['Ma méthode', [['Les bases', 'Garde, déplacements, coups'], ['Le cardio', 'Sac, corde, circuits'], ['Le combat', 'Assauts encadrés, sur demande']]],
        plan: ['Cours de groupe', [['Lundi et mercredi', 'Boxe technique · 18 h 30'], ['Mardi et jeudi', 'Kickboxing · 18 h 30'], ['Samedi', 'Boxe cardio · 10 h']], 'Gants de prêt pour le premier cours'],
        book: ['glofox', 'https://app.glofox.com/portal/#/branch/porterboxing', 'Réserver mon initiation', 'Gants et bandages prêtés au premier cours.'],
        stats: [['18 ans', 'de boxe'], ['250+', 'membres'], ['6', 'cours par semaine']],
        gal: ['Avec le coach', 'Travail aux mitaines', 'Bandages', 'Au sac', 'Kickboxing', 'Dans le ring'],
        vidTitle: 'À l’entraînement', vids: ['Kickboxing avec le coach', 'Sac de frappe'],
        locTitle: 'Le club', loc: ['1250, chemin de Chambly, Longueuil (Québec) J4J 3X1', 'Stationnement gratuit · Vestiaires avec douches'],
        rev: [['Mélissa T.', 'Kickboxing', 'Je me défoule et je me sens plus forte chaque semaine.'], ['Alex B.', 'Boxe technique', 'Coach exigeant mais bienveillant, progrès rapides.']] },
      en: { id: ['Shane Porter', 'Boxing & kickboxing coach', 'Technique · Cardio · Sparring', 'Porter Boxing Club'], ct: ['+1 215 555-0172', 'info@porterboxing.com', 'porterboxing.com'],
        so: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/', facebook: 'https://facebook.com/' },
        about: ['About me', 'A former Golden Gloves boxer, I teach boxing and kickboxing at every level: fitness, technique or fight prep. Respectful vibe, no contact unless you want it.'],
        progTitle: 'Classes & memberships', prog: [['Unlimited', 'All group classes', '$99 / mo'], ['Private session', '1 hr · mitts and bag', '$75'], ['Cardio boxing', 'Drop-in · 50 min', '$22'], ['Intro pack', '4 beginner classes', '$60']],
        method: ['My method', [['The basics', 'Guard, footwork, punches'], ['Conditioning', 'Bag, rope, circuits'], ['Sparring', 'Supervised, on request']]],
        plan: ['Group classes', [['Monday & Wednesday', 'Boxing technique · 6:30 p.m.'], ['Tuesday & Thursday', 'Kickboxing · 6:30 p.m.'], ['Saturday', 'Cardio boxing · 10 a.m.']], 'Loaner gloves for your first class'],
        book: ['glofox', 'https://app.glofox.com/portal/#/branch/porterboxing', 'Book my intro class', 'Gloves and wraps provided at your first class.'],
        stats: [['18 yrs', 'boxing'], ['250+', 'members'], ['6', 'classes a week']],
        gal: ['With the coach', 'Mitt work', 'Hand wraps', 'On the bag', 'Kickboxing', 'In the ring'],
        vidTitle: 'At training', vids: ['Kickboxing with the coach', 'Heavy bag'],
        locTitle: 'The club', loc: ['2100 East Allegheny Avenue, Philadelphia, PA 19134', 'Free parking · Locker rooms with showers'],
        rev: [['Melissa T.', 'Kickboxing', 'I blow off steam and feel stronger every week.'], ['Alex B.', 'Boxing technique', 'Demanding but caring coach, fast progress.']] } },
  ];

  const coaching = NFC.SECTORS.find((s) => s.id === 'coaching');
  if (coaching && coaching.demo) {
    const keepMedia = NFC.MEDIA.coaching;
    coaching.profiles = SPORT.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: coaching.demo, demoEn: coaching.demoEn, palettes: coaching.palettes, rec: coaching.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
        demo: build(coaching.demo, p.M, p.fr), demoEn: build(coaching.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    coaching.ex = 'Coach, salle de sport, soccer, yoga, musique, théâtre…';
  }
})();
