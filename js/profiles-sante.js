/* Métiers du secteur « Santé et consultations » (10 métiers). Même principe que profiles.js.
   Les avis restent désactivés par défaut (règles déontologiques des ordres professionnels).
   Photos et vidéos : Mixkit, licence gratuite usage commercial. */
(function () {
  'use strict';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hx = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const pal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87) });
  const F = 'media/sante/';
  const im = (id) => F + id + '.jpg';

  function build(base, M, L) {
    const d = clone(base);
    const [name, role, specialty, company] = L.id;
    Object.assign(d.identity, { name, role, specialty, company, photo: im(M.portrait), cover: im(M.cover), logo: '' });
    const [phone, email, website] = L.ct;
    Object.assign(d.contact, { phone, whatsapp: '', email, website });
    d.socials = Object.assign({ linkedin: '', instagram: '', facebook: '', tiktok: '', youtube: '' }, L.so || { linkedin: 'https://linkedin.com/', facebook: 'https://facebook.com/' });
    const b = d.blocks;
    Object.assign(b.about, { on: true, title: L.about[0], text: L.about[1] });
    Object.assign(b.services, { on: true, title: L.servTitle || '', items: L.serv.map(([t, dd]) => ({ t, d: dd, p: '' })) });
    const [provider, url, label, text] = L.book;
    Object.assign(b.booking, { on: true, mode: 'tool', provider, url, label, text, email });
    Object.assign(b.location, { on: true, title: L.locTitle || '', address: L.loc[0], access: L.loc[1] });
    Object.assign(b.hours, { on: true, rows: L.hours.map(([dd, h]) => ({ d: dd, h })), note: L.hoursNote || '' });
    Object.assign(b.gallery, { on: true, title: L.galTitle || '', images: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })) });
    Object.assign(b.languages, { on: true, tags: L.langs, text: '' });
    Object.assign(b.docs, { on: !!L.docs, title: L.docsTitle || '', items: (L.docs || []).map((label) => ({ label, url: 'https://example.com' })) });
    Object.assign(b.video, { on: true, url: '', src: F + 'v' + M.video + '.mp4', cover: im(M.video), cap: L.vid });
    Object.assign(b.reviews, { on: false, items: L.rev.map(([n, r, t]) => ({ n, r, t, s: 5 })) });
    if (b.contact) b.contact.email = email;
    return d;
  }
  const mediaOf = (M, L) => ({
    portrait: im(M.portrait), cover: im(M.cover),
    gallery: M.gal.map((id, i) => ({ src: im(id), cap: L.gal[i] })), cards: M.gal.slice(0, 2).map(im),
    video: { src: F + 'v' + M.video + '.mp4', poster: im(M.video), cap: L.vid },
  });

  const HEALTH = [
    { id: 'dentiste', icon: 'smile', keep: true, n: ['Dentiste', 'Dentist'], ex: ['Soins dentaires, esthétique, enfants', 'Dental care, cosmetic, kids'] },

    { id: 'physio', icon: 'activity', rec: 'd1',
      n: ['Kinésithérapie et physiothérapie', 'Physical therapy'], ex: ['Rééducation, blessures sportives, dos', 'Rehab, sports injuries, back pain'],
      pal: [pal('Bleu clinique', '#0369a1', '#38bdf8'), pal('Menthe', '#0f766e', '#5eead4'), pal('Bleu nuit', '#1e3a8a', '#93c5fd'), pal('Vert sauge', '#3f6b5a', '#a7d3c0'), pal('Graphite', '#27272a', '#a1a1aa'), pal('Corail', '#c2410c', '#fdba74')],
      M: { portrait: 36393, cover: 49541, gal: [13039, 49150, 27698, 13059, 49539, 13041], video: 36393 },
      fr: { id: ['Owen Mitchell', 'Physiothérapeute', 'Rééducation · Sport · Douleurs du dos', 'Clinique Mouvement'], ct: ['+1 514 555-0119', 'info@cliniquemouvement.ca', 'cliniquemouvement.ca'],
        about: ['Présentation', 'Membre de l’Ordre professionnel de la physiothérapie du Québec, je traite les douleurs de dos et de cou, les blessures sportives et la rééducation après chirurgie. Chaque plan de traitement combine thérapie manuelle et exercices à faire à la maison.'],
        servTitle: 'Traitements', serv: [['Évaluation initiale', 'Bilan complet · 60 min'], ['Rééducation post-opératoire', 'Genou, épaule, hanche'], ['Blessures sportives', 'Entorses, tendinites, retour au jeu'], ['Douleurs du dos et du cou', 'Thérapie manuelle et exercices']],
        book: ['jane', 'https://cliniquemouvement.janeapp.com', 'Prendre rendez-vous', 'Reçus pour vos assurances remis à chaque visite.'],
        locTitle: 'La clinique', loc: ['2950, rue Masson, Montréal (Québec) H1Y 1X5', 'Rosemont · Métro D’Iberville · Accès fauteuil roulant'],
        hours: [['Lundi – jeudi', '7 h – 20 h'], ['Vendredi', '7 h – 17 h'], ['Samedi', '8 h – 13 h']],
        gal: ['Thérapie manuelle', 'Rééducation à l’effort', 'Physiothérapie pédiatrique', 'Traitement du dos', 'Mobilisation du cou', 'Exercices guidés'],
        langs: 'Français, Anglais', docs: ['Formulaire de première visite', 'Programme d’exercices à la maison'], docsTitle: 'Avant votre visite', vid: 'Une évaluation à la clinique',
        rev: [['Marie P.', 'Patiente', 'Mon épaule a retrouvé toute sa mobilité en 6 semaines.'], ['Luc D.', 'Patient', 'Exercices clairs et suivi très sérieux.']] },
      en: { id: ['Owen Mitchell', 'Physical therapist', 'Rehab · Sports · Back pain', 'Movement Clinic'], ct: ['+1 312 555-0119', 'info@movementclinic.com', 'movementclinic.com'],
        about: ['About', 'A licensed physical therapist (DPT), I treat back and neck pain, sports injuries and post-surgery rehab. Every treatment plan combines manual therapy with exercises to do at home.'],
        servTitle: 'Treatments', serv: [['Initial evaluation', 'Full assessment · 60 min'], ['Post-surgical rehab', 'Knee, shoulder, hip'], ['Sports injuries', 'Sprains, tendinitis, return to play'], ['Back & neck pain', 'Manual therapy and exercise']],
        book: ['jane', 'https://movementclinic.janeapp.com', 'Book an appointment', 'In-network with most major insurance plans.'],
        locTitle: 'The clinic', loc: ['1550 North Damen Avenue, Chicago, IL 60622', 'Wicker Park · Blue Line Damen · Wheelchair accessible'],
        hours: [['Monday – Thursday', '7 a.m. – 8 p.m.'], ['Friday', '7 a.m. – 5 p.m.'], ['Saturday', '8 a.m. – 1 p.m.']],
        gal: ['Manual therapy', 'Strength rehab', 'Pediatric PT', 'Back treatment', 'Neck mobilization', 'Guided exercise'],
        langs: 'English, Spanish', docs: ['New patient form', 'Home exercise program'], docsTitle: 'Before your visit', vid: 'An evaluation at the clinic',
        rev: [['Mary P.', 'Patient', 'My shoulder got its full range back in 6 weeks.'], ['Luke D.', 'Patient', 'Clear exercises and very thorough follow-up.']] } },

    { id: 'naturel', icon: 'leaf', rec: 'd4',
      n: ['Clinique de soins naturels', 'Natural health clinic'], ex: ['Naturopathie, herboristerie, massothérapie', 'Naturopathy, herbalism, massage'],
      pal: [pal('Vert sauge', '#4f6b58', '#c9d6c3'), pal('Olivier', '#5b6b2f', '#d9c27a'), pal('Terre', '#7c4a24', '#e9b872'), pal('Miel', '#a16207', '#fde68a'), pal('Lin', '#57534e', '#d6cfc2'), pal('Eucalyptus', '#4b6b5d', '#cfe0d6')],
      M: { portrait: 33000, cover: 994, gal: [22670, 36241, 32859, 33002, 49545, 4575], video: 22670 },
      fr: { id: ['Grace Whitfield', 'Naturopathe', 'Naturopathie · Herboristerie · Massothérapie', 'Clinique Racines'], ct: ['+1 450 555-0183', 'bonjour@cliniqueracines.ca', 'cliniqueracines.ca'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['Notre approche', 'Une clinique de santé globale qui réunit naturopathie, herboristerie et massothérapie. Nous cherchons la cause de vos inconforts (digestion, sommeil, stress) et vous proposons un plan simple, en complément de votre suivi médical.'],
        servTitle: 'Nos soins', serv: [['Consultation en naturopathie', 'Bilan de santé global · 75 min'], ['Herboristerie', 'Tisanes et teintures sur mesure'], ['Massothérapie', 'Détente ou thérapeutique · 60 min'], ['Réflexologie', 'Pieds et mains · 45 min']],
        book: ['jane', 'https://cliniqueracines.janeapp.com', 'Prendre rendez-vous', 'Reçus pour assurances disponibles.'],
        locTitle: 'La clinique', loc: ['255, rue De Martigny Ouest, Saint-Jérôme (Québec) J7Y 2G4', 'Stationnement gratuit · Près de la gare'],
        hours: [['Mardi – vendredi', '9 h – 19 h'], ['Samedi', '9 h – 15 h']],
        gal: ['Tisanes maison', 'Plantes médicinales', 'Réflexologie', 'Massage abdominal', 'Huiles de massage', 'Consultation'],
        langs: 'Français, Anglais', docs: ['Questionnaire de santé', 'Conseils alimentaires'], docsTitle: 'Avant votre consultation', vid: 'Préparation d’une tisane',
        rev: [['Sylvie M.', 'Cliente', 'Enfin des réponses pour ma digestion, avec des solutions simples.'], ['Nathalie G.', 'Massothérapie', 'Un moment de détente profonde, je reviens chaque mois.']] },
      en: { id: ['Grace Whitfield', 'Naturopathic doctor', 'Naturopathy · Herbalism · Massage therapy', 'Roots Wellness Clinic'], ct: ['+1 828 555-0183', 'hello@rootswellness.com', 'rootswellness.com'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['Our approach', 'A whole-health clinic bringing together naturopathy, herbalism and massage therapy. We look for the root of your concerns (digestion, sleep, stress) and give you a simple plan alongside your medical care.'],
        servTitle: 'Our care', serv: [['Naturopathic consultation', 'Whole-health assessment · 75 min'], ['Herbal medicine', 'Custom teas and tinctures'], ['Massage therapy', 'Relaxing or therapeutic · 60 min'], ['Reflexology', 'Feet and hands · 45 min']],
        book: ['jane', 'https://rootswellness.janeapp.com', 'Book an appointment', 'HSA/FSA cards accepted.'],
        locTitle: 'The clinic', loc: ['65 Haywood Street, Asheville, NC 28801', 'Downtown · Free parking behind the building'],
        hours: [['Tuesday – Friday', '9 a.m. – 7 p.m.'], ['Saturday', '9 a.m. – 3 p.m.']],
        gal: ['House-blend teas', 'Medicinal herbs', 'Reflexology', 'Abdominal massage', 'Massage oils', 'Consultation'],
        langs: 'English, Spanish', docs: ['Health questionnaire', 'Nutrition tips'], docsTitle: 'Before your visit', vid: 'Making an herbal tea',
        rev: [['Sylvia M.', 'Client', 'Finally answers about my digestion, with simple solutions.'], ['Natalie G.', 'Massage therapy', 'Deep relaxation, I come back every month.']] } },

    { id: 'medecin', icon: 'stethoscope', rec: 'd1',
      n: ['Médecin de famille', 'Family doctor'], ex: ['Suivi, prévention, enfants', 'Check-ups, prevention, pediatrics'],
      pal: [pal('Bleu clinique', '#0369a1', '#38bdf8'), pal('Bleu nuit', '#1e3a8a', '#93c5fd'), pal('Menthe', '#0f766e', '#5eead4'), pal('Ardoise', '#334155', '#94a3b8'), pal('Vert sapin', '#1f4d3a', '#86efac'), pal('Indigo', '#3730a3', '#a5b4fc')],
      M: { portrait: 6604, cover: 4766, gal: [6562, 28149, 17475, 4753, 5550, 48385], video: 6562 },
      fr: { id: ['Dr Richard Palmer', 'Médecin de famille', 'Suivi de santé · Prévention · Pédiatrie', 'Clinique médicale du Parc'], ct: ['+1 418 555-0141', 'info@cliniqueduparc.ca', 'cliniqueduparc.ca'],
        about: ['Présentation', 'Médecin de famille depuis 18 ans, je suis les patients de tous âges : examens périodiques, maladies chroniques, santé des enfants et vaccination. La clinique accepte de nouveaux patients inscrits au Guichet d’accès.'],
        servTitle: 'Services', serv: [['Examen médical périodique', 'Bilan complet et analyses'], ['Suivi des maladies chroniques', 'Diabète, hypertension, asthme'], ['Santé des enfants', 'Suivi de croissance et vaccins'], ['Sans rendez-vous', 'Du lundi au vendredi matin']],
        book: ['zocdoc', 'https://www.zocdoc.com/clinique-du-parc', 'Prendre rendez-vous', 'Apportez votre carte d’assurance maladie.'],
        locTitle: 'La clinique', loc: ['1050, chemin Sainte-Foy, Québec (Québec) G1S 4L8', 'Stationnement payant · Accès fauteuil roulant'],
        hours: [['Lundi – vendredi', '8 h – 20 h'], ['Samedi – dimanche', '9 h – 12 h · sans rendez-vous']],
        gal: ['Consultation', 'Prise de tension', 'Ordonnance', 'Pédiatrie', 'Suivi des patients', 'Dossier médical'],
        langs: 'Français, Anglais', docs: ['Formulaire d’inscription', 'Préparer votre examen'], docsTitle: 'Préparer votre visite', vid: 'Une consultation à la clinique',
        rev: [['Diane L.', 'Patiente', 'Médecin à l’écoute qui prend le temps d’expliquer.'], ['Paul T.', 'Patient', 'Clinique bien organisée, peu d’attente.']] },
      en: { id: ['Dr. Richard Palmer', 'Family physician', 'Primary care · Prevention · Pediatrics', 'Parkside Family Medicine'], ct: ['+1 614 555-0141', 'info@parksidefamily.com', 'parksidefamily.com'],
        about: ['About', 'A board-certified family physician for 18 years, I care for patients of all ages: annual physicals, chronic conditions, children’s health and vaccines. Now accepting new patients and most insurance plans.'],
        servTitle: 'Services', serv: [['Annual physical', 'Full check-up and labs'], ['Chronic care', 'Diabetes, hypertension, asthma'], ['Pediatrics', 'Growth checks and vaccines'], ['Same-day visits', 'Monday to Friday mornings']],
        book: ['zocdoc', 'https://www.zocdoc.com/parkside-family-medicine', 'Book an appointment', 'Please bring your insurance card.'],
        locTitle: 'The office', loc: ['3700 North High Street, Columbus, OH 43214', 'Free parking · Wheelchair accessible'],
        hours: [['Monday – Friday', '8 a.m. – 8 p.m.'], ['Saturday – Sunday', '9 a.m. – noon · walk-in']],
        gal: ['Consultation', 'Blood pressure check', 'Prescription', 'Pediatrics', 'Patient follow-up', 'Medical records'],
        langs: 'English, Spanish', docs: ['New patient form', 'Prepare for your physical'], docsTitle: 'Before your visit', vid: 'A visit at the office',
        rev: [['Diane L.', 'Patient', 'A doctor who listens and takes time to explain.'], ['Paul T.', 'Patient', 'Well-run office, short waits.']] } },

    { id: 'chiro', icon: 'bone', rec: 'd2',
      n: ['Chiropraticien', 'Chiropractor'], ex: ['Dos, cou, posture', 'Back, neck, posture'],
      pal: [pal('Bleu ardoise', '#1e3a5f', '#e0a458'), pal('Vert sauge', '#3f6b5a', '#a7d3c0'), pal('Bleu clinique', '#0369a1', '#7dd3fc'), pal('Terracotta', '#a4512e', '#f0c29e'), pal('Graphite', '#27272a', '#38bdf8'), pal('Prune', '#5b2150', '#e9a8d9')],
      M: { portrait: 13164, cover: 13042, gal: [46426, 18254, 18255, 49151, 49149, 49542], video: 49148 },
      fr: { id: ['Dr Adam Fletcher', 'Chiropraticien', 'Dos · Cou · Posture', 'Clinique chiropratique Fletcher'], ct: ['+1 450 555-0126', 'info@chirofletcher.ca', 'chirofletcher.ca'],
        about: ['Présentation', 'Docteur en chiropratique, je soulage les maux de dos, de cou et de tête par des ajustements doux et précis. Bilan postural complet à la première visite, radiographie sur place si nécessaire.'],
        servTitle: 'Soins', serv: [['Première consultation', 'Bilan postural · 45 min'], ['Ajustement chiropratique', 'Colonne, bassin, cou'], ['Chiropratique sportive', 'Prévention et récupération'], ['Femmes enceintes et enfants', 'Techniques douces adaptées']],
        book: ['jane', 'https://chirofletcher.janeapp.com', 'Prendre rendez-vous', 'Reçus pour vos assurances à chaque visite.'],
        locTitle: 'La clinique', loc: ['1800, boulevard Saint-Martin Ouest, Laval (Québec) H7S 1N2', 'Stationnement gratuit · Accès fauteuil roulant'],
        hours: [['Lundi, mercredi, vendredi', '8 h – 19 h'], ['Mardi, jeudi', '12 h – 20 h'], ['Samedi', '9 h – 12 h']],
        gal: ['Bilan postural', 'Ajustement du cou', 'Ajustement du dos', 'Mobilisation', 'Soins des jeunes', 'Thérapie manuelle'],
        langs: 'Français, Anglais', vid: 'Un traitement chiropratique',
        rev: [['Jean-François R.', 'Patient', 'Fini les maux de dos du matin.'], ['Annie V.', 'Patiente enceinte', 'Douceur et explications claires.']] },
      en: { id: ['Dr. Adam Fletcher', 'Chiropractor', 'Back · Neck · Posture', 'Fletcher Chiropractic'], ct: ['+1 813 555-0126', 'info@fletcherchiro.com', 'fletcherchiro.com'],
        about: ['About', 'A doctor of chiropractic, I relieve back, neck and headache pain with gentle, precise adjustments. Full posture assessment on your first visit, on-site X-rays if needed.'],
        servTitle: 'Care', serv: [['First visit', 'Posture assessment · 45 min'], ['Chiropractic adjustment', 'Spine, pelvis, neck'], ['Sports chiropractic', 'Prevention and recovery'], ['Prenatal & pediatric', 'Gentle techniques']],
        book: ['jane', 'https://fletcherchiro.janeapp.com', 'Book an appointment', 'Most insurance plans accepted.'],
        locTitle: 'The clinic', loc: ['3401 West Kennedy Boulevard, Tampa, FL 33609', 'Free parking · Wheelchair accessible'],
        hours: [['Mon, Wed, Fri', '8 a.m. – 7 p.m.'], ['Tue, Thu', 'noon – 8 p.m.'], ['Saturday', '9 a.m. – noon']],
        gal: ['Posture assessment', 'Neck adjustment', 'Back adjustment', 'Mobilization', 'Kids care', 'Manual therapy'],
        langs: 'English, Spanish', vid: 'A chiropractic treatment',
        rev: [['John R.', 'Patient', 'No more morning back pain.'], ['Annie V.', 'Prenatal patient', 'Gentle care and clear explanations.']] } },

    { id: 'osteo', icon: 'hand-heart', rec: 'd4',
      n: ['Ostéopathe', 'Osteopath'], ex: ['Douleurs, mobilité, nourrissons', 'Pain, mobility, infants'],
      pal: [pal('Sauge', '#52705f', '#cfe0cf'), pal('Bleu lac', '#155e75', '#a5f3fc'), pal('Pierre', '#8a7560', '#e6d5bf'), pal('Bleu nuit', '#1e3a8a', '#c7d2fe'), pal('Terracotta', '#a0522d', '#f4c7a1'), pal('Lavande', '#6b5b95', '#ddd2f0')],
      M: { portrait: 49540, cover: 13063, gal: [11539, 49543, 32858, 49148, 49545, 18254], video: 49543 },
      fr: { id: ['Liam Spencer', 'Ostéopathe', 'Douleurs · Mobilité · Nourrissons', 'Ostéo Spencer'], ct: ['+1 819 555-0168', 'bonjour@osteospencer.ca', 'osteospencer.ca'],
        about: ['Mon approche', 'Ostéopathe diplômé (D.O.), j’évalue le corps dans son ensemble pour soulager douleurs articulaires, migraines et tensions. Je reçois aussi les nourrissons et les femmes enceintes, avec des techniques très douces.'],
        servTitle: 'Consultations', serv: [['Adulte', '60 min · évaluation et traitement'], ['Nourrisson', 'Coliques, torticolis, sommeil'], ['Femme enceinte', 'Dos, bassin, préparation'], ['Sportif', 'Récupération et prévention']],
        book: ['jane', 'https://osteospencer.janeapp.com', 'Prendre rendez-vous', 'Reçus pour assurances remis après chaque séance.'],
        locTitle: 'Le cabinet', loc: ['180, boulevard Saint-Raymond, Gatineau (Québec) J8Y 1S9', 'Stationnement gratuit · Rez-de-chaussée'],
        hours: [['Lundi – jeudi', '9 h – 20 h'], ['Vendredi', '9 h – 15 h']],
        gal: ['Traitement du dos', 'Libération du cou', 'Détente musculaire', 'Mobilisation', 'Thérapie douce', 'Traitement du bassin'],
        langs: 'Français, Anglais', vid: 'Une séance d’ostéopathie',
        rev: [['Caroline B.', 'Maman de Léo', 'Mon bébé dort enfin mieux après deux séances.'], ['Stéphane P.', 'Patient', 'Mes migraines ont nettement diminué.']] },
      en: { id: ['Liam Spencer', 'Osteopathic manual practitioner', 'Pain · Mobility · Infants', 'Spencer Osteopathy'], ct: ['+1 612 555-0168', 'hello@spencerosteo.com', 'spencerosteo.com'],
        about: ['My approach', 'An osteopathic manual practitioner, I look at the whole body to relieve joint pain, migraines and tension. I also see infants and expecting mothers, with very gentle techniques.'],
        servTitle: 'Sessions', serv: [['Adult', '60 min · assessment and treatment'], ['Infant', 'Colic, torticollis, sleep'], ['Prenatal', 'Back, pelvis, preparation'], ['Athlete', 'Recovery and prevention']],
        book: ['jane', 'https://spencerosteo.janeapp.com', 'Book an appointment', 'HSA/FSA receipts after every session.'],
        locTitle: 'The office', loc: ['2828 Hennepin Avenue, Minneapolis, MN 55408', 'Uptown · Free parking · Ground floor'],
        hours: [['Monday – Thursday', '9 a.m. – 8 p.m.'], ['Friday', '9 a.m. – 3 p.m.']],
        gal: ['Back treatment', 'Neck release', 'Muscle relaxation', 'Mobilization', 'Gentle therapy', 'Pelvis treatment'],
        langs: 'English', vid: 'An osteopathy session',
        rev: [['Caroline B.', 'Mom of Leo', 'My baby finally sleeps better after two sessions.'], ['Steve P.', 'Patient', 'My migraines have really eased.']] } },

    { id: 'psy', icon: 'brain', rec: 'd10',
      n: ['Psychologue', 'Psychologist'], ex: ['Anxiété, couple, adolescents', 'Anxiety, couples, teens'],
      pal: [pal('Lavande', '#6b5b95', '#ddd2f0'), pal('Sauge', '#52705f', '#cfe0cf'), pal('Bleu nuit', '#1e2a4a', '#d8b46a'), pal('Sable', '#7a5c3e', '#e6d3b3'), pal('Bleu lac', '#155e75', '#a5f3fc'), pal('Rose poudré', '#9d4b62', '#f3c4cf')],
      M: { portrait: 15766, cover: 28957, gal: [6045, 15765, 32065, 32066, 6144, 48667], video: 32065 },
      fr: { id: ['Dre Sarah Whitman', 'Psychologue', 'Anxiété · Couple · Adolescents', 'Cabinet Whitman'], ct: ['+1 514 555-0144', 'info@psywhitman.ca', 'psywhitman.ca'],
        about: ['Présentation', 'Psychologue membre de l’Ordre des psychologues du Québec, j’accompagne adultes, couples et adolescents : anxiété, épuisement, deuil, difficultés relationnelles. Approche bienveillante, en cabinet ou en téléconsultation.'],
        servTitle: 'Accompagnement', serv: [['Thérapie individuelle', '50 min · en cabinet ou en ligne'], ['Thérapie de couple', '75 min'], ['Adolescents', '12 à 17 ans'], ['Groupes de soutien', 'Gestion du stress · 8 rencontres']],
        book: ['simplepractice', 'https://whitman.clientsecure.me', 'Demander un premier rendez-vous', 'Reçus pour assurances. Confidentialité garantie.'],
        locTitle: 'Le cabinet', loc: ['4150, rue Sainte-Catherine Ouest, bureau 300, Westmount (Québec) H3Z 2Y5', 'Métro Atwater · Téléconsultation possible'],
        hours: [['Lundi – jeudi', '9 h – 20 h'], ['Vendredi', '9 h – 13 h']], hoursNote: 'En cas d’urgence, composez le 811 ou le 911.',
        gal: ['En consultation', 'Écoute', 'Échange', 'Accompagnement', 'Un espace calme', 'Groupe de soutien'],
        langs: 'Français, Anglais', vid: 'Le cabinet',
        rev: [['Patiente', 'Thérapie individuelle', 'Je me suis sentie écoutée dès la première séance.'], ['Patient', 'Thérapie de couple', 'Des outils concrets qui nous ont vraiment aidés.']] },
      en: { id: ['Dr. Sarah Whitman', 'Licensed psychologist', 'Anxiety · Couples · Teens', 'Whitman Psychology'], ct: ['+1 212 555-0144', 'info@whitmanpsychology.com', 'whitmanpsychology.com'],
        about: ['About', 'A licensed clinical psychologist (PsyD), I support adults, couples and teens through anxiety, burnout, grief and relationship challenges. A caring approach, in office or via telehealth.'],
        servTitle: 'Services', serv: [['Individual therapy', '50 min · in office or online'], ['Couples therapy', '75 min'], ['Teens', 'Ages 12 to 17'], ['Support groups', 'Stress management · 8 sessions']],
        book: ['simplepractice', 'https://whitman.clientsecure.me', 'Request a first appointment', 'Superbills provided. Confidentiality guaranteed.'],
        locTitle: 'The office', loc: ['211 West 56th Street, Suite 300, New York, NY 10019', 'Midtown · Telehealth available'],
        hours: [['Monday – Thursday', '9 a.m. – 8 p.m.'], ['Friday', '9 a.m. – 1 p.m.']], hoursNote: 'In a crisis, call or text 988.',
        gal: ['In session', 'Listening', 'Conversation', 'Support', 'A calm space', 'Support group'],
        langs: 'English', vid: 'The office',
        rev: [['Client', 'Individual therapy', 'I felt heard from the very first session.'], ['Client', 'Couples therapy', 'Practical tools that really helped us.']] } },

    { id: 'nutri', icon: 'apple', rec: 'd9',
      n: ['Nutritionniste', 'Dietitian'], ex: ['Alimentation, poids, sport', 'Nutrition, weight, sports'],
      pal: [pal('Vert pomme', '#4d7c0f', '#d9f99d'), pal('Corail', '#c2410c', '#fed7aa'), pal('Menthe', '#0f766e', '#99f6e4'), pal('Miel', '#a16207', '#fde68a'), pal('Framboise', '#be123c', '#fecdd3'), pal('Bleu ciel', '#0284c7', '#bae6fd')],
      M: { portrait: 4575, cover: 15926, gal: [12460, 40531, 43923, 43905, 993, 14002], video: 4575 },
      fr: { id: ['Kelsey Ward', 'Nutritionniste-diététiste', 'Perte de poids · Sport · Santé digestive', 'Nutrition Kelsey Ward'], ct: ['+1 450 555-0152', 'bonjour@nutritionkw.ca', 'nutritionkw.ca'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['Mon approche', 'Membre de l’Ordre des diététistes-nutritionnistes du Québec, je vous aide à mieux manger sans régime strict : plan alimentaire réaliste, recettes simples et suivi régulier, en cabinet ou en ligne.'],
        servTitle: 'Consultations', serv: [['Première consultation', 'Bilan et objectifs · 60 min'], ['Suivi', '30 min · ajustements du plan'], ['Nutrition sportive', 'Performance et récupération'], ['Santé digestive', 'Intolérances, syndrome de l’intestin irritable']],
        book: ['simplepractice', 'https://nutritionkw.clientsecure.me', 'Prendre rendez-vous', 'Reçus pour assurances remis à chaque séance.'],
        locTitle: 'Le bureau', loc: ['825, rue Saint-Laurent Ouest, Longueuil (Québec) J4K 2V1', 'Métro Longueuil · Consultations en ligne'],
        hours: [['Lundi – jeudi', '9 h – 19 h'], ['Vendredi', '9 h – 13 h']],
        gal: ['Bilan nutritionnel', 'Salade complète', 'Déjeuner équilibré', 'Smoothie maison', 'Au marché', 'Objectifs'],
        langs: 'Français, Anglais', docs: ['Journal alimentaire', 'Recettes de la semaine'], docsTitle: 'Ressources', vid: 'Une consultation en cuisine',
        rev: [['Émilie T.', 'Perte de poids', '-12 kg en 6 mois sans me priver. Merci !'], ['Marc O.', 'Nutrition sportive', 'Plus d’énergie pour mes entraînements.']] },
      en: { id: ['Kelsey Ward', 'Registered dietitian', 'Weight loss · Sports · Gut health', 'Kelsey Ward Nutrition'], ct: ['+1 919 555-0152', 'hello@kelseywardnutrition.com', 'kelseywardnutrition.com'],
        so: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
        about: ['My approach', 'A registered dietitian (RDN), I help you eat better without strict diets: a realistic meal plan, simple recipes and regular check-ins, in office or online.'],
        servTitle: 'Sessions', serv: [['Initial consultation', 'Assessment and goals · 60 min'], ['Follow-up', '30 min · plan adjustments'], ['Sports nutrition', 'Performance and recovery'], ['Gut health', 'Intolerances, IBS']],
        book: ['simplepractice', 'https://kelseyward.clientsecure.me', 'Book an appointment', 'Many insurance plans cover dietitian visits.'],
        locTitle: 'The office', loc: ['400 Glenwood Avenue, Raleigh, NC 27603', 'Glenwood South · Virtual visits available'],
        hours: [['Monday – Thursday', '9 a.m. – 7 p.m.'], ['Friday', '9 a.m. – 1 p.m.']],
        gal: ['Nutrition assessment', 'Balanced salad', 'Healthy breakfast', 'Homemade smoothie', 'At the market', 'Goals'],
        langs: 'English, Spanish', docs: ['Food journal', 'Weekly recipes'], docsTitle: 'Resources', vid: 'A kitchen consultation',
        rev: [['Emily T.', 'Weight loss', '-26 lb in 6 months without feeling deprived. Thank you!'], ['Mark O.', 'Sports nutrition', 'More energy for my workouts.']] } },

    { id: 'opto', icon: 'eye', rec: 'd6',
      n: ['Optométriste', 'Optometrist'], ex: ['Examen de la vue, lunettes, lentilles', 'Eye exams, glasses, contacts'],
      pal: [pal('Bleu roi', '#1d3fa8', '#7aa2ff'), pal('Graphite', '#27272a', '#a1a1aa'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Bordeaux', '#7f1d1d', '#fca5a5'), pal('Noir chic', '#1a1a1a', '#c5a572'), pal('Bleu ciel', '#0284c7', '#bae6fd')],
      M: { portrait: 36722, cover: 36420, gal: [36703, 36705, 13072, 13073, 36652, 39486], video: 36678 },
      fr: { id: ['Dr Brian Kelly', 'Optométriste', 'Examen de la vue · Lunettes · Lentilles', 'Clinique visuelle Kelly'], ct: ['+1 418 555-0175', 'info@visionkelly.ca', 'visionkelly.ca'],
        about: ['Présentation', 'Optométriste depuis 15 ans, j’examine la santé de vos yeux avec des appareils de dernière génération : rétinographie, tomographie et dépistage du glaucome. Grand choix de montures et lentilles cornéennes sur place.'],
        servTitle: 'Services', serv: [['Examen complet de la vue', 'Adultes et enfants · 45 min'], ['Lentilles cornéennes', 'Ajustement et suivi'], ['Dépistage', 'Glaucome, cataracte, DMLA'], ['Lunetterie', 'Montures et verres sur mesure']],
        book: ['zocdoc', 'https://www.zocdoc.com/vision-kelly', 'Prendre rendez-vous', 'Examen couvert par la RAMQ pour les moins de 18 ans et les 65 ans et plus.'],
        locTitle: 'La clinique', loc: ['5401, boulevard Guillaume-Couture, Lévis (Québec) G6V 4Z2', 'Stationnement gratuit · Accès fauteuil roulant'],
        hours: [['Lundi – mercredi', '9 h – 17 h'], ['Jeudi – vendredi', '9 h – 21 h'], ['Samedi', '9 h – 16 h']],
        gal: ['Test de vision', 'Examen de la rétine', 'Lecture des lettres', 'Appareil de mesure', 'Ajustement', 'Examen d’un enfant'],
        langs: 'Français, Anglais', vid: 'Un examen de la vue',
        rev: [['Ginette R.', 'Patiente', 'Examen très complet, tout est expliqué.'], ['Olivier F.', 'Papa', 'Mon fils de 6 ans a adoré son examen.']] },
      en: { id: ['Dr. Brian Kelly', 'Optometrist (OD)', 'Eye exams · Glasses · Contacts', 'Kelly Vision Center'], ct: ['+1 816 555-0175', 'info@kellyvision.com', 'kellyvision.com'],
        about: ['About', 'An optometrist for 15 years, I check your eye health with the latest equipment: retinal imaging, OCT and glaucoma screening. A wide selection of frames and contact lenses on site.'],
        servTitle: 'Services', serv: [['Comprehensive eye exam', 'Adults and kids · 45 min'], ['Contact lenses', 'Fitting and follow-up'], ['Screening', 'Glaucoma, cataracts, macular degeneration'], ['Optical shop', 'Frames and custom lenses']],
        book: ['zocdoc', 'https://www.zocdoc.com/kelly-vision-center', 'Book an eye exam', 'We accept VSP, EyeMed and most vision plans.'],
        locTitle: 'The clinic', loc: ['4750 Broadway Boulevard, Kansas City, MO 64112', 'Country Club Plaza · Free parking'],
        hours: [['Monday – Wednesday', '9 a.m. – 5 p.m.'], ['Thursday – Friday', '9 a.m. – 9 p.m.'], ['Saturday', '9 a.m. – 4 p.m.']],
        gal: ['Vision test', 'Retina exam', 'Eye chart', 'Measuring device', 'Fitting', 'Pediatric exam'],
        langs: 'English, Spanish', vid: 'An eye exam',
        rev: [['Ginny R.', 'Patient', 'Very thorough exam, everything explained.'], ['Oliver F.', 'Dad', 'My 6-year-old loved his exam.']] } },

    { id: 'infirmiere', icon: 'home', rec: 'd4',
      n: ['Soins infirmiers à domicile', 'Home health nurse'], ex: ['Soins, prises de sang, suivi', 'Care, blood draws, follow-up'],
      pal: [pal('Bleu clinique', '#0369a1', '#7dd3fc'), pal('Turquoise', '#0f766e', '#99f6e4'), pal('Lavande', '#6d28d9', '#ddd6fe'), pal('Corail', '#c2410c', '#fed7aa'), pal('Bleu nuit', '#1e3a8a', '#c7d2fe'), pal('Sauge', '#52705f', '#cfe0cf')],
      M: { portrait: 5561, cover: 4582, gal: [5414, 4554, 5493, 32176, 38529, 4795], video: 4582 },
      fr: { id: ['Nicole Harper', 'Infirmière clinicienne', 'Soins à domicile · Prélèvements · Suivi', 'Soins Harper à domicile'], ct: ['+1 819 555-0133', 'info@soinsharper.ca', 'soinsharper.ca'],
        about: ['Présentation', 'Infirmière clinicienne membre de l’OIIQ, je me déplace chez vous pour les soins qui vous évitent la clinique : prises de sang, pansements, injections, suivi après hospitalisation et accompagnement des aînés.'],
        servTitle: 'Soins à domicile', serv: [['Prise de sang', 'À domicile · résultats à votre médecin'], ['Soins de plaies', 'Pansements et suivi'], ['Injections et vaccins', 'Sur ordonnance'], ['Suivi des aînés', 'Visites régulières et conseils aux familles']],
        book: ['calendly', 'https://calendly.com/soinsharper/visite', 'Planifier une visite', 'Visites 7 jours sur 7, tôt le matin pour les prises de sang.'],
        locTitle: 'Secteur desservi', loc: ['Trois-Rivières (Québec) G9A 5H7', 'Trois-Rivières, Cap-de-la-Madeleine, Bécancour'],
        hours: [['Lundi – vendredi', '6 h 30 – 19 h'], ['Samedi – dimanche', '7 h – 12 h']],
        gal: ['Visite à domicile', 'Consultation en famille', 'Exercices avec un aîné', 'Préparation', 'Dossier de soins', 'Écoute du cœur'],
        langs: 'Français, Anglais', vid: 'Une visite à domicile',
        rev: [['Famille Tremblay', 'Suivi de notre mère', 'Rassurante et toujours ponctuelle.'], ['Gilles M.', 'Prises de sang', 'Plus besoin de faire la file à la clinique.']] },
      en: { id: ['Nicole Harper', 'Registered nurse (RN)', 'Home care · Blood draws · Follow-up', 'Harper Home Health'], ct: ['+1 412 555-0133', 'info@harperhomehealth.com', 'harperhomehealth.com'],
        about: ['About', 'A registered nurse, I come to your home for care that saves you a trip to the clinic: blood draws, wound care, injections, post-hospital follow-up and support for seniors.'],
        servTitle: 'Home care', serv: [['Blood draw', 'At home · results sent to your doctor'], ['Wound care', 'Dressings and follow-up'], ['Injections & vaccines', 'With a prescription'], ['Senior care', 'Regular visits and family guidance']],
        book: ['calendly', 'https://calendly.com/harperhomehealth/visit', 'Schedule a visit', 'Visits 7 days a week, early mornings for blood draws.'],
        locTitle: 'Service area', loc: ['Pittsburgh, PA 15213', 'Pittsburgh, Mt. Lebanon, Bethel Park'],
        hours: [['Monday – Friday', '6:30 a.m. – 7 p.m.'], ['Saturday – Sunday', '7 a.m. – noon']],
        gal: ['Home visit', 'Family consultation', 'Exercises with a senior', 'Preparation', 'Care notes', 'Heart check'],
        langs: 'English', vid: 'A home visit',
        rev: [['The Turner family', 'Care for our mother', 'Reassuring and always on time.'], ['Gil M.', 'Blood draws', 'No more waiting in line at the clinic.']] } },
  ];

  const sante = NFC.SECTORS.find((s) => s.id === 'sante');
  if (sante && sante.demo) {
    const keepMedia = NFC.MEDIA.sante;
    sante.profiles = HEALTH.map((p) => {
      if (p.keep) return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, demo: sante.demo, demoEn: sante.demoEn, palettes: sante.palettes, rec: sante.rec, media: keepMedia };
      return { id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec, palettes: p.pal,
        demo: build(sante.demo, p.M, p.fr), demoEn: build(sante.demoEn, p.M, p.en), media: mediaOf(p.M, p.fr) };
    });
    sante.ex = 'Médecin, dentiste, kiné, psychologue, soins naturels…';
  }
})();
