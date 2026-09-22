/* Exemples en anglais (Amérique du Nord) : chaque secteur reçoit une version anglaise de sa carte d’exemple (s.demoEn).
   Traduction texte par texte ; les noms propres (personnes, entreprises) restent identiques. */
(function () {
  'use strict';

  const T = {
    /* ---- Santé ---- */
    'Chirurgien-dentiste': 'Dentist', 'Implantologie · Soins esthétiques': 'Implants · Cosmetic dentistry', 'Clinique dentaire des Érables': 'Maple Dental Clinic',
    'Diplômée de l’Université de Montréal, j’exerce depuis 2011 une dentisterie douce et attentive.\nLa clinique est équipée d’une radiologie numérique et accueille adultes et enfants. Chaque plan de traitement vous est expliqué, avec une estimation détaillée pour votre assurance, avant de commencer.':
      'A graduate of the Université de Montréal, I have practiced gentle, attentive dentistry since 2011.\nOur clinic has digital X-rays and welcomes adults and children. Every treatment plan is explained to you, with a detailed estimate for your insurance, before we begin.',
    'Soins conservateurs': 'General dentistry', 'Caries, dévitalisations, détartrage': 'Fillings, root canals, cleanings', 'Implantologie': 'Dental implants',
    'Pose et suivi d’implants dentaires': 'Placement and follow-up', 'Esthétique du sourire': 'Smile makeover', 'Blanchiment, facettes': 'Whitening, veneers',
    'Soins des enfants': 'Kids’ dentistry', 'Accueil dès 3 ans, prévention': 'From age 3, prevention first',
    'Réservation en ligne 24h/24. En cas d’urgence, appelez le cabinet.': 'Book online 24/7. For emergencies, please call the clinic.',
    'Métro Mont-Royal · Stationnement sur rue · Accès fauteuil roulant': 'Mont-Royal metro · Street parking · Wheelchair accessible',
    'Lundi – vendredi': 'Monday – Friday', 'Samedi': 'Saturday', 'Dimanche': 'Sunday', 'Fermé': 'Closed', 'L’accueil': 'Reception', 'Salle de soins': 'Treatment room',
    'Radiologie numérique': 'Digital X-ray', 'Français, Anglais, Arabe, Espagnol': 'French, English, Arabic, Spanish', 'Le cabinet en vidéo': 'Tour the clinic',
    'Patiente': 'Patient', 'Patient': 'Patient', 'Très à l’écoute, les soins sont expliqués pas à pas. Je recommande.': 'A great listener — every step is explained. Highly recommend.',
    'Clinique moderne, rendez-vous rapide et facturation directe à mon assurance.': 'Modern clinic, quick appointments and direct billing to my insurance.',
    'Une question ? Écrivez-moi, je vous réponds rapidement.': 'Have a question? Send me a message and I’ll get back to you quickly.',
    'Une question ? Écrivez-nous, nous répondons rapidement.': 'Have a question? Send us a message and we’ll get back to you quickly.',

    /* ---- Droit, finance et conseil ---- */
    'Attaché commercial': 'Financial advisor', 'Gestion de patrimoine': 'Wealth management',
    'J’accompagne les particuliers et les propriétaires d’entreprise dans la construction et la protection de leur patrimoine.\nREER, CELI, placements, préparation de la retraite ou planification successorale : nous définissons ensemble une stratégie claire, adaptée à vos objectifs et à votre horizon.':
      'I help individuals and business owners build and protect their wealth.\nRRSPs, TFSAs, investments, retirement or estate planning: together we set a clear strategy that fits your goals and your timeline.',
    'Épargne et placements': 'Savings & investments', 'REER, CELI, fonds communs, CPG': 'RRSP, TFSA, mutual funds, GICs', 'Préparation de la retraite': 'Retirement planning',
    'Décaissement REER / FERR, rentes': 'RRSP / RRIF withdrawals, annuities', 'Planification successorale': 'Estate planning', 'Testament, fiducie, protection du conjoint': 'Wills, trusts, spousal protection',
    'Financement immobilier': 'Home financing', 'Hypothèque, CELIAPP pour premier achat': 'Mortgages, FHSA for first-time buyers',
    '15 ans': '15 years', 'd’expérience en gestion privée': 'in private wealth management', 'familles accompagnées': 'families advised', 'pour un premier rendez-vous': 'to get a first meeting',
    'Banque Horizon · depuis 2019': 'Banque Horizon · since 2019', 'Conseiller en gestion de patrimoine': 'Wealth management advisor', 'Caisse régionale · 2011 – 2019': 'Regional credit union · 2011 – 2019',
    'Conseiller aux entreprises': 'Business advisor', 'Planificateur financier (Pl. Fin.)': 'Certified Financial Planner', 'HEC Montréal · IQPF': 'HEC Montréal · FP Canada',
    'Premier entretien de 45 minutes, en agence ou en visioconférence.': 'A 45-minute first meeting, at our office or by video call.',
    'Métro Bonaventure · Stationnement intérieur · Accès PMR': 'Bonaventure metro · Indoor parking · Wheelchair accessible',
    'Le premier rendez-vous est-il facturé ?': 'Is the first meeting free?', 'Non, le premier bilan financier est offert.': 'Yes, your first financial review is on us.',
    'Faut-il être client de la banque ?': 'Do I need to bank with you?', 'Non, je rencontre aussi des personnes non clientes.': 'No, I also meet with people who aren’t clients.',
    'Présentation de l’agence': 'About our office', 'Clients depuis 2021': 'Clients since 2021', 'Un vrai plan clair pour notre retraite, et un suivi régulier de nos REER.': 'A truly clear retirement plan, with regular reviews of our RRSPs.',
    'Propriétaire d’entreprise': 'Business owner', 'Réactif et pédagogue, il a simplifié le transfert de mon entreprise.': 'Responsive and a great teacher — he made selling my business simple.',

    /* ---- Carte pro ---- */
    'Directrice commerciale': 'Sales Director', 'Solutions logistiques B2B · Canada – États-Unis': 'B2B logistics · Canada – U.S.',
    'J’accompagne les distributeurs et les commerçants en ligne dans l’optimisation de leur chaîne logistique entre le Canada et les États-Unis : entreposage, transport transfrontalier et préparation de commandes.':
      'I help distributors and online retailers streamline their supply chain between Canada and the U.S.: warehousing, cross-border shipping and order fulfillment.',
    'Choisissez un créneau de 30 minutes.': 'Pick a 30-minute slot.', 'Nordlink en 30 secondes': 'Nordlink in 30 seconds', 'Directeur des opérations': 'Operations Director',
    'Un interlocuteur fiable qui tient ses délais, même à la frontière.': 'A reliable partner who meets deadlines, even at the border.', 'Commerce en ligne': 'E-commerce',
    'Nos coûts logistiques ont baissé de 18 % en six mois.': 'Our logistics costs dropped 18% in six months.',

    /* ---- Freelance ---- */
    'Développeuse web freelance': 'Freelance web developer', 'React · Next.js · Accessibilité': 'React · Next.js · Accessibility',
    'Développeuse front-end depuis 8 ans, je conçois des sites et applications web rapides, accessibles et faciles à faire évoluer.\nJ’interviens à contrat ou au forfait, de la maquette à la mise en ligne, pour des jeunes pousses comme pour des PME, au Québec et aux États-Unis.':
      'A front-end developer for 8 years, I build fast, accessible websites and web apps that are easy to grow.\nI work on contract or fixed-price projects, from mockup to launch, for startups and small businesses in Quebec and the U.S.',
    'Site vitrine sur mesure': 'Custom business website', 'Design, développement, mise en ligne': 'Design, development, launch', 'dès 3 500 $': 'from $3,500', 'Application web': 'Web app',
    'React / Next.js, API, tableau de bord': 'React / Next.js, API, dashboard', 'Sur soumission': 'Custom quote', 'Audit d’accessibilité': 'Accessibility audit',
    'Rapport WCAG 2.2 et plan d’action': 'WCAG 2.2 report and action plan', '1 200 $': '$1,200', 'Contrat longue durée': 'Long-term contract', 'Intégrée à votre équipe': 'Embedded in your team',
    '95 $ / h': '$95 / hr', 'Plateforme de réservation': 'Booking platform', 'Next.js · 40 000 utilisateurs': 'Next.js · 40,000 users', 'Site e-commerce': 'E-commerce site',
    'Refonte et SEO · +35 % de ventes': 'Redesign and SEO · +35% sales', 'Tableau de bord RH': 'HR dashboard', 'React · Données en temps réel': 'React · Real-time data',
    'React, Next.js, TypeScript, Accessibilité, Figma, Node.js': 'React, Next.js, TypeScript, Accessibility, Figma, Node.js',
    'Disponible à partir du 1er novembre, 3 jours par semaine. Fuseau horaire de l’Est.': 'Available from November 1, 3 days a week. Eastern Time.',
    '20 minutes pour parler de votre projet, sans engagement.': '20 minutes to talk about your project, no commitment.',
    'Décrivez votre projet, votre budget et vos délais : réponse sous 48 h ouvrables.': 'Tell me about your project, budget and timeline — I reply within 2 business days.',
    'Démonstration d’un projet': 'Project demo', 'CEO, startup SaaS': 'CEO, SaaS startup', 'Code propre, livré en avance, et une vraie force de proposition.': 'Clean code, delivered early, and full of great ideas.',
    'Directeur marketing': 'Marketing Director', 'Notre nouveau site est deux fois plus rapide. Merci Léa !': 'Our new site is twice as fast. Thanks, Léa!',
    'Mon CV (PDF)': 'My resume (PDF)', 'Profil Upwork': 'Upwork profile',

    /* ---- Immobilier ---- */
    'Courtière immobilière résidentielle': 'Residential real estate broker', 'Plateau-Mont-Royal · Ventes et évaluations': 'Plateau-Mont-Royal · Sales & home valuations',
    'Installée sur le Plateau depuis 10 ans, je connais chaque rue, chaque copropriété et les prix réels du quartier.\nJe vous accompagne de l’évaluation jusqu’à la signature chez le notaire, avec une seule interlocutrice du début à la fin.':
      'Based in the Plateau for 10 years, I know every street, every condo building and what homes really sell for.\nI’m with you from the valuation to the closing, as your one point of contact from start to finish.',
    'Condo 5 ½ · 1 100 pi²': '2-bedroom condo · 1,100 sq ft', 'Plateau-Mont-Royal · Balcon · 3e étage': 'Plateau-Mont-Royal · Balcony · 3rd floor', '589 000 $': '$589,000',
    'Maison unifamiliale · 4 chambres': 'Single-family home · 4 bedrooms', 'Laval · Terrain de 6 000 pi²': 'Laval · 6,000 sq ft lot', '849 000 $': '$849,000',
    'Condo 3 ½ · 650 pi²': '1-bedroom condo · 650 sq ft', 'Centre-ville · Idéal investisseur': 'Downtown · Great for investors', '329 000 $': '$329,000',
    'propriétés vendues en 2025': 'homes sold in 2025', '21 j': '21 days', 'délai moyen de vente': 'average time to sell', '99 %': '99%', 'du prix demandé obtenu': 'of asking price achieved',
    'Évaluation gratuite de votre propriété sous 48 h.': 'Free home valuation within 48 hours.', 'Évaluation gratuite': 'Free home valuation',
    'Analyse comparative du marché sous 48 h': 'Comparative market analysis within 48 h', 'Vente de votre propriété': 'Selling your home',
    'Photos professionnelles, visites libres, négociation': 'Professional photos, open houses, negotiation', 'Recherche sur mesure': 'Personalized home search',
    'Pour les acheteurs pressés': 'For buyers on a tight timeline',
    'Indiquez l’adresse et la superficie de votre propriété : je vous rappelle pour fixer un rendez-vous d’évaluation.': 'Share your home’s address and size — I’ll call you back to set up a valuation.',
    'Visites du lundi au samedi.': 'Viewings Monday to Saturday.', 'Visite d’un appartement': 'Condo tour', 'Famille Durand': 'The Durand family', 'Vendeurs sur le Plateau': 'Sellers in the Plateau',
    'Condo vendu en 3 semaines au prix demandé.': 'Condo sold in 3 weeks at asking price.', 'Premier achat': 'First-time buyer',
    'Disponible, honnête, et de très bon conseil pour le CELIAPP.': 'Available, honest, and great advice on the FHSA.',

    /* ---- Architecture ---- */
    'Architecte d’intérieur': 'Interior designer', 'Rénovation de maisons et de plex centenaires': 'Renovating century-old homes and plexes',
    'Nous redonnons vie aux plex et aux maisons anciennes de Montréal en respectant leur caractère : boiseries, moulures et volumes, avec des matériaux durables et un confort d’aujourd’hui.':
      'We bring Montreal’s old plexes and houses back to life while respecting their character — woodwork, moldings and volumes — with durable materials and modern comfort.',
    'Triplex centenaire': 'Century-old triplex', 'Plateau-Mont-Royal · 1 800 pi² · Rénovation complète': 'Plateau-Mont-Royal · 1,800 sq ft · Full renovation', 'Maison de ville': 'Townhouse',
    'Westmount · Agrandissement et cuisine': 'Westmount · Addition and kitchen', 'Loft industriel': 'Industrial loft', 'Griffintown · Mezzanine sur mesure': 'Griffintown · Custom mezzanine',
    'Visite et écoute': 'Site visit', 'Nous découvrons votre lieu et vos envies': 'We get to know your space and your wishes', 'Esquisses et plans 3D': 'Sketches and 3D plans',
    'Vous visualisez le projet avant les travaux': 'See the project before work begins', 'Suivi de chantier': 'Construction management', 'Coordination des artisans jusqu’à la livraison': 'We coordinate the trades through to handover',
    'Plans à la main': 'Hand-drawn plans', 'Recherche d’inspiration': 'Inspiration', 'Planches de tendances': 'Mood boards', 'Maquette': 'Scale model', 'Consultation déco': 'Design consultation',
    'Visite de 2 h et recommandations': '2-hour visit and recommendations', '350 $': '$350', 'Plans et rendus 3D': 'Plans and 3D renderings', 'Aménagement complet': 'Complete layout',
    'dès 2 500 $': 'from $2,500', 'Projet clé en main': 'Turnkey project', 'Conception et suivi de chantier': 'Design and construction management',
    'Superficie, budget indicatif, échéancier : décrivez votre projet et joignez quelques photos.': 'Square footage, rough budget, timeline: tell us about your project and attach a few photos.',
    'L’atelier au travail': 'The studio at work', 'Rénovation d’un duplex': 'Duplex renovation', 'Le rendu 3D était fidèle au résultat final. Superbe travail.': 'The 3D rendering matched the final result. Beautiful work.',
    'Maison à Westmount': 'Westmount home', 'Chantier livré dans les délais et le budget.': 'Delivered on time and on budget.',

    /* ---- Artisans ---- */
    'Plombier chauffagiste': 'Plumbing & heating contractor', 'Urgence 24/7 · Rénovation de salles de bain': '24/7 emergency · Bathroom renovations', 'Plomberie Morel': 'Morel Plumbing',
    'Maître plombier depuis 12 ans, j’interviens rapidement pour vos fuites, débouchages et chauffe-eau.\nJe réalise aussi vos rénovations de salles de bain, de la conception à la pose. Estimation gratuite, travail soigné et chantier laissé propre.':
      'A master plumber for 12 years, I respond fast to leaks, clogged drains and water heaters.\nI also renovate bathrooms from design to installation. Free estimates, careful work, and a clean site when I leave.',
    'Urgence et recherche de fuite': 'Emergency & leak detection', 'Intervention en moins de 2 h, 24/7': 'On site in under 2 hours, 24/7', 'dès 129 $': 'from $129', 'Débouchage de drains': 'Drain cleaning',
    'Évier, toilette, colonne ; inspection par caméra': 'Sink, toilet, main line; camera inspection', 'dès 175 $': 'from $175', 'Chauffe-eau': 'Water heaters',
    'Remplacement, entretien, mise en service': 'Replacement, maintenance, installation', 'Rénovation de salle de bain': 'Bathroom renovation',
    'Douche en céramique, accès universel, clé en main': 'Tile showers, accessible design, turnkey', 'Montréal, Laval, Longueuil, Brossard, Boucherville': 'Montreal, Laval, Longueuil, Brossard, Boucherville',
    'Déplacement gratuit sur l’île de Montréal.': 'Free service calls on the island of Montreal.', 'Robinetterie posée': 'Fixture installation', 'Évacuation débouchée': 'Drain unclogged',
    'Chape béton': 'Concrete screed', 'Outillage professionnel': 'Pro-grade tools', 'Chantier neuf': 'New construction', 'Recherche de fuite': 'Leak detection',
    'Décrivez votre besoin : je vous rappelle sous 24 h avec une soumission gratuite.': 'Tell me what you need — I’ll call you back within 24 hours with a free quote.',
    'Urgences seulement': 'Emergencies only', 'Service d’urgence 24/7': '24/7 emergency service', 'Licence RBQ, Membre CMMTQ, Assurance responsabilité, Estimation gratuite': 'Licensed (RBQ), CMMTQ member, Fully insured, Free estimates',
    'Présentation en vidéo': 'Video intro', 'Venu un dimanche pour une fuite, rapide et propre.': 'Came on a Sunday for a leak — fast and tidy.',
    'Salle de bain refaite à neuf, travail soigné et soumission respectée.': 'Bathroom completely redone, careful work, right on quote.',
    'Choisissez un jour et un moment : je vous confirme le passage pour la visite technique.': 'Pick a day and a time of day — I’ll confirm my visit for the on-site assessment.',

    /* ---- Beauté ---- */
    'Barbier coiffeur': 'Barber', 'Coupe · Barbe · Rasage à l’ancienne': 'Cuts · Beards · Hot-towel shaves',
    'Un barbershop à l’ancienne où l’on prend le temps : diagnostic, coupe aux ciseaux ou à la tondeuse, taille de barbe et serviette chaude.': 'An old-school barbershop where we take our time: consultation, scissor or clipper cut, beard trim and hot towel.',
    'Coupe homme': 'Men’s haircut', '30 min': '30 min', '35 $': '$35', 'Taille de barbe': 'Beard trim', '20 min · serviette chaude': '20 min · hot towel', '25 $': '$25',
    'Coupe + barbe': 'Cut + beard', '45 min': '45 min', '55 $': '$55', 'Rasage à l’ancienne': 'Hot-towel shave', '30 min · au coupe-chou': '30 min · straight razor', '45 $': '$45',
    'Coupe tendance': 'Modern cut', 'Contours précis': 'Crisp lineup', 'Le résultat': 'The result', 'Nos outils': 'Our tools', 'Dégradé': 'Fade',
    'Réservation en ligne 24h/24.': 'Book online 24/7.', 'Barbier · fondateur': 'Barber · founder', 'Coiffeur · coloriste': 'Stylist · colorist',
    'Valide un an sur tous les services.': 'Valid for one year on all services.', 'Mardi – vendredi': 'Tuesday – Friday', 'Dimanche – lundi': 'Sunday – Monday',
    'Métro Square-Victoria · Vieux-Montréal': 'Square-Victoria metro · Old Montreal', 'Une coupe au salon': 'A cut at the shop', 'Client régulier': 'Regular client', 'Client': 'Client',
    'Le meilleur dégradé en ville, et toujours à l’heure.': 'The best fade in town, and always on time.', 'Rasage à l’ancienne au top, ambiance très sympa.': 'Amazing hot-towel shave, great vibe.',

    /* ---- Coaching ---- */
    'Entraîneur personnel certifié': 'Certified personal trainer', 'Perte de poids · Remise en forme': 'Weight loss · Getting back in shape',
    'Ancien athlète, j’entraîne depuis 9 ans des personnes qui veulent reprendre le sport sans se blesser.\nChaque programme part de votre niveau réel, de votre horaire et de vos objectifs : perte de poids, renforcement ou préparation d’un marathon.':
      'A former athlete, I’ve spent 9 years training people who want to get back into fitness without getting hurt.\nEvery program starts from your real level, your schedule and your goals: weight loss, strength or marathon prep.',
    'Séance individuelle': 'Private session', '1 h · à domicile ou au gym': '1 hr · at home or at the gym', '75 $': '$75', 'Forfait 10 séances': '10-session package',
    'Suivi nutrition inclus': 'Nutrition coaching included', '690 $': '$690', 'Petit groupe': 'Small group', '4 personnes maximum': 'Up to 4 people', '30 $ / pers.': '$30 / person',
    'Programme en ligne': 'Online program', '12 semaines · application + visio': '12 weeks · app + video calls', '199 $': '$199', 'Bilan de forme': 'Fitness assessment',
    'Mesures, mobilité, objectifs': 'Measurements, mobility, goals', 'Programme personnalisé': 'Personalized program', 'Adapté à votre semaine': 'Built around your week',
    'Suivi et ajustements': 'Check-ins and adjustments', 'Point chaque mois': 'Monthly review', 'Lundi': 'Monday', 'Cross-training · 18 h 30': 'Cross-training · 6:30 p.m.',
    'Mercredi': 'Wednesday', 'Renforcement · 12 h 15': 'Strength · 12:15 p.m.', 'Course au parc · 9 h': 'Park run · 9 a.m.', '8 places par cours': '8 spots per class',
    'Première séance offerte, sans engagement.': 'First session free, no commitment.', '250+': '250+', 'clients accompagnés': 'clients coached', '-15 lb': '-15 lb', 'en moyenne sur 3 mois': 'on average over 3 months',
    'Échauffement': 'Warm-up', 'Coaching individuel': 'One-on-one coaching', 'Cross-training': 'Cross-training', 'Renforcement': 'Strength', 'Boxe': 'Boxing', 'Mobilité': 'Mobility',
    'Musculation': 'Weight training', 'Circuit training': 'Circuit training', 'Récupération': 'Recovery', 'Rendez-vous au chalet du parc, côté rue Sherbrooke': 'Meet at the park chalet, Sherbrooke Street side',
    'Extrait de séance': 'Session highlights', '-20 lb en 4 mois': '-20 lb in 4 months', 'Des séances variées et un vrai suivi. Je n’ai jamais été aussi motivée.': 'Varied sessions and real follow-up. I’ve never been so motivated.',
    'Marathon de Montréal': 'Montreal Marathon', 'Premier marathon terminé sans blessure grâce à Thomas.': 'Finished my first marathon injury-free thanks to Thomas.',
    'Mes séances en vidéo': 'My sessions on video', 'Séance individuelle ': 'Private session', 'Entraînement en salle': 'Gym workout', 'Boxe fitness': 'Boxing fitness', 'Étirements guidés': 'Guided stretching',
    'Dans la salle': 'At the gym', 'Préparation': 'Getting ready', 'Gainage': 'Core work', 'Cardio': 'Cardio', 'Plateau musculation': 'Weight room', 'Suivi personnalisé': 'Personal coaching',

    /* ---- Restaurant ---- */
    'Bistrot · Cuisine du marché': 'Bistro · Market-fresh cooking', 'Fait maison, produits de saison': 'Made from scratch, seasonal produce',
    'Une cuisine de bistro généreuse, pensée chaque matin selon le marché Jean-Talon. Midi et soir, dans une salle chaleureuse de 40 places et sur notre terrasse l’été.':
      'Generous bistro cooking, planned every morning around the Jean-Talon Market. Lunch and dinner in a cozy 40-seat dining room, and on our patio in summer.',
    'Entrées': 'Starters', 'Œuf parfait': 'Slow-cooked egg', 'Crème de champignons, croûtons': 'Mushroom cream, croutons', '14 $': '$14', 'Velouté de courge': 'Squash soup',
    'Noisettes grillées': 'Toasted hazelnuts', '12 $': '$12', 'Burrata crémeuse': 'Creamy burrata', 'Tomates du Québec, basilic': 'Quebec tomatoes, basil', '19 $': '$19',
    'Plats': 'Mains', 'Joue de bœuf braisée': 'Braised beef cheek', 'Purée maison, jus corsé': 'House mash, rich jus', '34 $': '$34', 'Omble chevalier': 'Arctic char',
    'Légumes de saison, beurre citronné': 'Seasonal vegetables, lemon butter', '36 $': '$36', 'Risotto aux champignons sauvages': 'Wild mushroom risotto', 'Parmesan 24 mois': '24-month Parmesan',
    '29 $': '$29', 'Desserts': 'Desserts', 'Tarte fine aux pommes': 'Thin apple tart', 'Crème glacée à l’érable': 'Maple ice cream', 'Mousse au chocolat noir': 'Dark chocolate mousse',
    '11 $': '$11', 'Pouding chômeur': 'Pouding chômeur', 'Sirop d’érable': 'Maple syrup', 'La terrasse': 'The patio', 'Dessert du jour': 'Dessert of the day', 'Le bar': 'The bar',
    'Entrée du jour': 'Starter of the day', 'La salle': 'The dining room', 'Réservation en ligne ou par téléphone. Groupes jusqu’à 20 personnes.': 'Book online or by phone. Groups of up to 20.',
    'Commandes pour emporter du mardi au samedi.': 'Takeout orders Tuesday to Saturday.', 'Mardi – vendredi ': 'Tuesday – Friday', '11 h 30 – 14 h 30 · 17 h 30 – 22 h 30': '11:30 a.m. – 2:30 p.m. · 5:30 – 10:30 p.m.',
    '17 h – 23 h': '5 – 11 p.m.', 'Brunch · 10 h – 15 h': 'Brunch · 10 a.m. – 3 p.m.', 'Terrasse · Accès fauteuil roulant · Métro Mont-Royal': 'Patio · Wheelchair accessible · Mont-Royal metro',
    'En cuisine': 'In the kitchen', 'Dîner d’affaires': 'Business lunch', 'Cuisine généreuse, service attentionné. La joue de bœuf est parfaite.': 'Generous cooking, attentive service. The beef cheek is perfect.',
    'Souper en terrasse': 'Dinner on the patio', 'Une adresse qu’on garde précieusement.': 'A spot we keep close to our hearts.',

    /* ---- Producteurs ---- */
    'Maraîchers bio': 'Organic vegetable farm', 'Légumes de saison · Paniers bio hebdomadaires': 'Seasonal vegetables · Weekly organic baskets', 'Famille Roche': 'The Roche family',
    'Sur 8 acres à l’Île d’Orléans, nous cultivons plus de 40 variétés de légumes certifiés biologiques.\nRécoltés la veille, vendus en direct : c’est notre promesse.':
      'On 8 acres on Île d’Orléans, we grow more than 40 varieties of certified organic vegetables.\nPicked the day before, sold direct: that’s our promise.',
    'Panier découverte': 'Starter basket', '4 à 5 légumes de saison': '4 to 5 seasonal vegetables', 'Panier famille': 'Family basket', '7 à 8 légumes + œufs': '7 to 8 vegetables + eggs',
    '40 $': '$40', 'Œufs de poules en liberté': 'Free-range eggs', 'Douzaine': 'One dozen', '7 $': '$7', 'Confitures maison': 'Homemade jams', 'Pot de 250 ml': '250 ml jar', '8 $': '$8',
    'Courges, Poireaux, Choux, Pommes, Maïs sucré': 'Squash, Leeks, Cabbage, Apples, Sweet corn', 'Liste mise à jour chaque semaine.': 'List updated every week.',
    'Mardi': 'Tuesday', 'Marché Jean-Talon · 8 h – 14 h': 'Jean-Talon Market · 8 a.m. – 2 p.m.', 'Vendredi': 'Friday', 'Kiosque à la ferme · 14 h – 18 h': 'Farm stand · 2 – 6 p.m.',
    'Marché du Vieux-Port de Québec · 9 h – 15 h': 'Old Port Market, Quebec City · 9 a.m. – 3 p.m.', 'Commandez avant jeudi midi, cueillette le vendredi à la ferme.': 'Order by Thursday noon, pick up Friday at the farm.',
    'Les semis': 'Seedlings', 'Notre stand au marché': 'Our market stand', 'Paniers de saison': 'Seasonal baskets', 'Récolte du jour': 'Today’s harvest', 'Les champs': 'The fields',
    'Cueillette': 'Picking', 'Stationnement gratuit à la ferme': 'Free parking at the farm', 'Au marché': 'At the market', 'Abonnée aux paniers': 'Basket subscriber',
    'Des légumes qui ont du goût, et on sait d’où ils viennent.': 'Vegetables that taste like something, and we know where they come from.', 'Client du marché': 'Market regular',
    'Toujours souriants et de bon conseil pour cuisiner.': 'Always smiling, with great cooking tips.',

    /* ---- Événementiel ---- */
    'Planificatrice de mariages': 'Wedding planner', 'Mariages sur mesure dans les Laurentides': 'Custom weddings in the Laurentians',
    'Je conçois des mariages qui vous ressemblent, du choix du lieu jusqu’au dernier slow.\nVous profitez de chaque étape ; je m’occupe des prestataires, du budget et du rétroplanning.':
      'I design weddings that feel like you, from choosing the venue to the very last dance.\nYou enjoy every step; I handle the vendors, the budget and the timeline.',
    'Cérémonie au jardin': 'Garden ceremony', 'Table d’honneur': 'Head table', 'Décor floral': 'Floral design', 'Salle de réception': 'Reception hall', 'Les mariés': 'The newlyweds',
    'Bougies et roses': 'Candles and roses', 'Coordination du jour J': 'Day-of coordination', 'Présence de 10 h à minuit': 'On site from 10 a.m. to midnight', 'dès 1 800 $': 'from $1,800',
    'Organisation partielle': 'Partial planning', 'Lieu, traiteur et décor': 'Venue, catering and decor', 'dès 4 500 $': 'from $4,500', 'Organisation complète': 'Full planning',
    'De A à Z, sur 12 mois': 'A to Z, over 12 months', 'Rendez-vous découverte': 'Discovery meeting', 'Vos envies, votre budget, vos invités': 'Your wishes, your budget, your guests',
    'Proposition sur mesure': 'Custom proposal', 'Univers, prestataires, planning': 'Style, vendors, timeline', 'Le grand jour': 'The big day', 'Je coordonne, vous profitez': 'I coordinate, you celebrate',
    'Indiquez la date, le lieu envisagé, le nombre d’invités et votre budget : je vous confirme ma disponibilité sous 48 h.': 'Share your date, venue idea, guest count and budget — I’ll confirm my availability within 48 hours.',
    '30 minutes en visio, sans engagement.': '30 minutes by video call, no commitment.', 'mariages organisés': 'weddings planned', '8 ans': '8 years', 'd’expérience': 'of experience',
    'Film d’un mariage': 'Wedding film', 'Mariage à Mont-Tremblant': 'Wedding in Mont-Tremblant', 'Nous avons profité de chaque minute. Tout était parfait.': 'We enjoyed every minute. Everything was perfect.',
    'Mariage au domaine': 'Estate wedding', 'Camille a géré chaque imprévu sans que nous le voyions.': 'Camille handled every surprise without us ever noticing.',

    /* ---- Portfolio ---- */
    'Photographe': 'Photographer', 'Portrait · Mariage · Entreprise': 'Portraits · Weddings · Corporate', 'Portrait': 'Portrait', 'Mariage': 'Wedding', 'Mode': 'Fashion',
    'Coulisses': 'Behind the scenes', 'Beauté': 'Beauty', 'Produit': 'Product',
    'Je photographie les gens tels qu’ils sont, en lumière naturelle, sans poses figées. Des images sincères, pensées pour durer.': 'I photograph people as they are, in natural light, with no stiff poses. Honest images made to last.',
    'Portraits d’artisans': 'Makers’ portraits', 'Série personnelle · 2025': 'Personal series · 2025', 'Mariages': 'Weddings', 'Reportages complets': 'Full-day coverage',
    'Entreprises': 'Corporate', 'Équipes et locaux': 'Teams and workplaces', 'Séance portrait': 'Portrait session', '1 h · 10 photos retouchées': '1 hr · 10 edited photos', '250 $': '$250',
    'Photos d’équipe': 'Team photos', 'Demi-journée sur place': 'Half day on site', '950 $': '$950', 'Reportage de mariage': 'Wedding coverage', 'Journée complète': 'Full day', 'dès 2 900 $': 'from $2,900',
    'Parlez-moi de votre projet : type de séance, date, lieu.': 'Tell me about your project: type of shoot, date, location.', 'Showreel': 'Showreel',
    'Des photos naturelles, je me suis enfin trouvée belle.': 'Natural photos — I finally felt beautiful.', 'Professionnelle, rapide et discrète dans nos bureaux.': 'Professional, fast and discreet in our office.',
    'Portfolio complet': 'Full portfolio',

    /* ---- Musique ---- */
    'Jazz · Soul · Pop': 'Jazz · Soul · Pop', 'Concerts, mariages et événements privés': 'Concerts, weddings and private events',
    'Voix, piano et contrebasse : Nova Trio revisite les standards du jazz et de la soul, de Nina Simone à Amy Winehouse.\nUn répertoire qui s’adapte à votre soirée, du cocktail feutré à la piste de danse.':
      'Voice, piano and upright bass: Nova Trio reimagines jazz and soul standards, from Nina Simone to Amy Winehouse.\nA repertoire that fits your evening, from a cozy cocktail hour to a packed dance floor.',
    'Live au Petit Salon · 2025': 'Live at Le Petit Salon · 2025', '12 oct.': 'Oct 12', '25 oct.': 'Oct 25', '8 nov.': 'Nov 8', 'Le Grand Théâtre, Québec': 'Le Grand Théâtre, Quebec City',
    'Cocktail': 'Cocktail hour', '2 sets de 45 min · acoustique': '2 × 45-min sets · acoustic', 'Soirée complète': 'Full evening', 'Sono + DJ en fin de soirée': 'Sound system + late-night DJ',
    'dès 3 500 $': 'from $3,500', 'Date, lieu, type d’événement et nombre d’invités : nous revenons vers vous sous 48 h.': 'Date, venue, type of event and guest count — we’ll get back to you within 48 hours.',
    'La voix': 'The voice', 'Saxophone': 'Saxophone', 'Au piano': 'On piano', 'Soirée de gala': 'Gala evening', 'Le trio a sublimé notre soirée, nos invités en parlent encore.': 'The trio made our evening — our guests are still talking about it.',
    'Un répertoire parfait, du cocktail à la piste de danse.': 'A perfect set list, from cocktails to the dance floor.', 'Écouter sur Spotify': 'Listen on Spotify', 'Écouter sur Deezer': 'Listen on Deezer',
    'Dossier artistique (PDF)': 'Press kit (PDF)', 'Fiche technique (PDF)': 'Tech rider (PDF)',

    /* ---- Influence ---- */
    'Créatrice de contenu': 'Content creator', 'Food & voyages': 'Food & travel',
    'Je partage des recettes simples et des carnets de voyage gourmands avec une communauté de passionnés de cuisine du quotidien, au Québec et partout en Amérique du Nord.':
      'I share easy recipes and foodie travel diaries with a community of everyday home cooks, in Quebec and across North America.',
    '180 k': '180K', 'abonnés TikTok': 'TikTok followers', '95 k': '95K', 'abonnés Instagram': 'Instagram followers', '6,2 %': '6.2%', 'taux d’engagement': 'engagement rate',
    '64 %': '64%', 'audience au Canada': 'audience in Canada', 'Pâtes en 10 minutes': '10-minute pasta', '2,4 M de vues': '2.4M views', '24 h à Lisbonne': '24 hours in Lisbon',
    '850 k vues': '850K views', 'Le meilleur couscous': 'The best couscous', '1,1 M de vues': '1.1M views', 'Vidéo TikTok dédiée': 'Dedicated TikTok video', 'Création + publication': 'Creation + posting',
    'dès 1 200 $': 'from $1,200', 'Story Instagram': 'Instagram Stories', 'Série de 3 stories': 'Set of 3 stories', 'dès 500 $': 'from $500', 'Contenu UGC': 'UGC content',
    'Vidéo livrée, non publiée': 'Video delivered, not posted', 'dès 450 $': 'from $450', 'Présentez votre marque, votre produit et votre calendrier.': 'Tell me about your brand, your product and your timeline.',
    'Ma dernière recette': 'My latest recipe', 'Marque d’ustensiles': 'Cookware brand', 'Campagne TikTok': 'TikTok campaign',
    'Plus de 2 millions de vues et des ventes en hausse la semaine suivante.': 'Over 2 million views and a sales bump the following week.', 'Tourisme Québec': 'Tourisme Québec', 'Série voyage': 'Travel series',
    'Un contenu authentique qui a parlé à notre public.': 'Authentic content that really spoke to our audience.', 'Télécharger mon kit média (PDF)': 'Download my media kit (PDF)',

    /* ---- Hébergement ---- */
    'Gîte · 5 chambres': 'Bed & breakfast · 5 rooms', 'Au cœur des Cantons-de-l’Est': 'In the heart of the Eastern Townships', 'Chambre Érable': 'Maple Room', 'Petit-déjeuner': 'Breakfast',
    'Suite du Lac': 'Lake Suite', 'Espace détente': 'Relaxation area', 'Chambre Forêt': 'Forest Room',
    'Une maison victorienne de 1890 restaurée, entourée d’érables centenaires, à 5 minutes du lac Massawippi.\nDéjeuner maison servi sur la galerie, spa extérieur et calme absolu.':
      'A restored 1890 Victorian home surrounded by century-old maples, 5 minutes from Lake Massawippi.\nHomemade breakfast on the porch, outdoor hot tub and total peace and quiet.',
    '2 pers. · vue sur le jardin': '2 guests · garden view', 'dès 189 $ / nuit': 'from $189 / night', '4 pers. · balcon privé': '4 guests · private balcony', 'dès 289 $ / nuit': 'from $289 / night',
    '2 pers. · rez-de-jardin': '2 guests · garden level', 'dès 169 $ / nuit': 'from $169 / night', 'Spa extérieur, Déjeuner inclus, Wi-Fi, Stationnement gratuit, Borne de recharge': 'Outdoor hot tub, Breakfast included, Wi-Fi, Free parking, EV charger',
    'Réservation directe au meilleur prix.': 'Book direct for the best rate.', 'Arrivée': 'Check-in', '16 h – 20 h': '4 – 8 p.m.', 'Départ': 'Check-out', 'Avant 11 h': 'By 11 a.m.',
    'Ouverture': 'Open', 'À l’année': 'Year-round', 'À 1 h 30 de Montréal · 20 min de Sherbrooke': '1 hr 30 from Montreal · 20 min from Sherbrooke', 'Visite du mas': 'Tour the inn',
    'Séjour en octobre': 'Stay in October', 'Les couleurs de l’automne et un déjeuner mémorable.': 'Fall colors and a memorable breakfast.',
    'Accueil chaleureux, spa et calme absolu. On reviendra !': 'Warm welcome, hot tub and total calm. We’ll be back!', 'Famille Martin': 'The Martin family',

    /* ---- Tourisme ---- */
    'Guide touristique': 'Tour guide', 'Québec, Charlevoix et le Saint-Laurent': 'Quebec City, Charlevoix & the St. Lawrence',
    'Née à Québec, je vous fais découvrir ma région autrement : ruelles du Vieux-Québec, baleines du Saint-Laurent et paysages de Charlevoix.':
      'Born in Quebec City, I show you my region differently: the lanes of Old Quebec, the whales of the St. Lawrence and the landscapes of Charlevoix.',
    'Croisière aux baleines': 'Whale-watching cruise', '3 h · Tadoussac · dès 8 ans': '3 hrs · Tadoussac · ages 8+', '99 $': '$99', 'Le Vieux-Québec gourmand': 'Old Quebec food tour',
    '2 h 30 · dégustations': '2 hrs 30 · tastings', '69 $': '$69', 'Randonnée à Charlevoix': 'Charlevoix hike', '4 h · niveau intermédiaire': '4 hrs · intermediate level', '59 $': '$59',
    'Groupes de 12 personnes maximum.': 'Groups of up to 12 people.', 'Tous les jours': 'Every day', 'Baleines · 9 h et 14 h': 'Whales · 9 a.m. and 2 p.m.', 'Mar., jeu., sam.': 'Tue, Thu, Sat',
    'Vieux-Québec · 10 h': 'Old Quebec · 10 a.m.', 'Guide diplômée': 'Certified guide', 'Dégustations': 'Tastings', 'Pour la visite gourmande': 'On the food tour',
    'Photos souvenir': 'Souvenir photos', 'Envoyées après l’activité': 'Sent after the tour', 'Français, Anglais, Espagnol, Arabe': 'French, English, Spanish, Arabic', 'Le port': 'The harbor',
    'Le ponton': 'The dock', 'Coucher de soleil': 'Sunset', 'En mer': 'On the water', 'Groupe, séminaire ou séjour de plusieurs jours : décrivez votre projet.': 'Group, corporate retreat or multi-day trip? Tell me about your plans.',
    'Sortie en mer': 'Out on the water', 'Nadia connaît chaque recoin du fleuve, une matinée inoubliable.': 'Nadia knows every corner of the river — an unforgettable morning.',
    'Visite du Vieux-Québec': 'Old Quebec tour', 'Passionnant et gourmand, on a découvert Québec autrement.': 'Fascinating and delicious — we saw Quebec City in a whole new way.',

    /* ---- Animaux ---- */
    'Toiletteuse canin et félin': 'Dog & cat groomer', 'Salon & toilettage à domicile': 'Salon & mobile grooming',
    'Toiletteuse diplômée, je prends le temps d’habituer chaque animal : pas de cage, pas de précipitation, et des produits doux adaptés à chaque pelage.': 'A certified groomer, I take time to help every pet feel at ease: no cages, no rushing, and gentle products for every coat.',
    'Bain + séchage': 'Bath + dry', 'Petit chien': 'Small dog', 'dès 45 $': 'from $45', 'Toilettage complet': 'Full groom', 'Coupe aux ciseaux, griffes, oreilles': 'Scissor cut, nails, ears',
    'dès 75 $': 'from $75', 'Chat': 'Cat', 'Bain et démêlage': 'Bath and dematting', 'dès 85 $': 'from $85', 'Toilettage à domicile': 'Mobile grooming', 'Camion équipé': 'Fully equipped van',
    '+20 $': '+$20', 'Coupe aux ciseaux': 'Scissor cut', 'Après toilettage': 'After grooming', 'Brossage': 'Brushing', 'Soin des griffes': 'Nail care', 'Client satisfait': 'Happy client',
    'Chats bienvenus': 'Cats welcome', 'Créneaux disponibles en ligne.': 'Open slots available online.', 'Chiens toutes tailles, Chats, Lapins': 'Dogs of all sizes, Cats, Rabbits',
    'Montréal, Laval, Longueuil, Brossard': 'Montreal, Laval, Longueuil, Brossard', 'Toilettage à domicile dans un rayon de 25 km.': 'Mobile grooming within 25 km (15 miles).',
    'Mardi – samedi': 'Tuesday – Saturday', 'Vaccins à jour': 'Up-to-date vaccines', 'Carnet demandé au premier rendez-vous': 'Records required at the first visit', 'Durée': 'How long',
    'Comptez 1 h 30 à 3 h selon la race': 'Plan on 1.5 to 3 hours depending on the breed', 'Au salon': 'At the salon', 'Caniche': 'Poodle', 'Golden retriever': 'Golden retriever',
    'Filou ressort toujours détendu et magnifique.': 'Filou always comes home relaxed and gorgeous.', 'Très douce avec les chiens anxieux. Merci Chloé !': 'So gentle with anxious dogs. Thank you, Chloé!',

    /* ---- Boutiques ---- */
    'Bijoux faits main': 'Handmade jewelry', 'Argent recyclé · Pièces uniques · Fait à Montréal': 'Recycled silver · One-of-a-kind · Made in Montreal',
    'Des bijoux sobres et durables, façonnés un à un dans mon atelier du Mile End à partir d’argent 100 % recyclé.': 'Simple, lasting jewelry, handmade one piece at a time in my Mile End studio from 100% recycled silver.',
    'Bague Onde': 'Wave Ring', 'Argent sterling recyclé': 'Recycled sterling silver', '95 $': '$95', 'Anneaux Lune': 'Moon Hoops', 'Martelés à la main': 'Hand-hammered', '120 $': '$120',
    'Collier Galet': 'Pebble Necklace', 'Pièce unique': 'One of a kind', '165 $': '$165',
    'Chaque pièce est sciée, soudée et polie à la main. Comptez 2 à 4 heures de travail par bijou.': 'Every piece is sawed, soldered and polished by hand — 2 to 4 hours of work per piece.',
    'Livraison gratuite au Canada et aux États-Unis dès 100 $.': 'Free shipping in Canada and the U.S. on orders over $100.', 'Alliances, cadeaux, gravures : décrivez la pièce dont vous rêvez.': 'Wedding bands, gifts, engravings: describe the piece you’re dreaming of.',
    'Bracelet': 'Bracelet', 'Écrin': 'Gift box', 'Portés': 'Worn', 'À l’atelier': 'In the studio', 'Atelier-boutique dans le Mile End': 'Studio-shop in the Mile End',
    'Mercredi – samedi': 'Wednesday – Saturday', 'Dimanche – mardi': 'Sunday – Tuesday', 'Sur rendez-vous': 'By appointment', 'Fabrication': 'How it’s made',
    'Un bijou délicat et un emballage superbe. Parfait pour offrir.': 'A delicate piece and gorgeous packaging. Perfect as a gift.', 'Pièce sur mesure': 'Custom piece',
    'Solène a créé exactement l’alliance dont je rêvais.': 'Solène made exactly the wedding band I was dreaming of.',

    /* ---- Automobile ---- */
    'Garagiste': 'Auto repair', 'Entretien toutes marques · Carrosserie · Pneus': 'All makes & models · Body work · Tires',
    'Garage indépendant depuis 1998, nous entretenons et réparons toutes les marques avec des pièces d’origine ou équivalentes, au juste prix.': 'An independent shop since 1998, we service and repair all makes with OEM or equivalent parts, at a fair price.',
    'Changement d’huile + filtre': 'Oil + filter change', 'Selon le carnet du fabricant': 'Per the manufacturer’s schedule', 'dès 89 $': 'from $89', 'Diagnostic électronique': 'Computer diagnostics',
    'Lecture et effacement des codes': 'Read and clear codes', '99 $': '$99', 'Pose de pneus d’hiver': 'Winter tire changeover', 'Installation et balancement': 'Mounting and balancing',
    'dès 25 $ / pneu': 'from $25 / tire', 'Carrosserie': 'Body work', 'Égratignures, bosses, peinture': 'Scratches, dents, paint', 'Véhicule de prêt sur réservation.': 'Loaner car available on request.',
    'Indiquez votre véhicule, son immatriculation et la réparation souhaitée.': 'Tell us your vehicle, plate number and the repair you need.', 'Honda Civic · 2021': '2021 Honda Civic',
    '45 000 km · Essence': '45,000 km (28,000 mi) · Gas', '22 900 $': '$22,900', 'Toyota RAV4 · 2020': '2020 Toyota RAV4', '58 000 km · Hybride': '58,000 km (36,000 mi) · Hybrid', '29 500 $': '$29,500',
    'Pièces garanties 2 ans, Estimation gratuite, Voiture de courtoisie': '2-year parts warranty, Free estimates, Courtesy car', 'Stationnement clients devant le garage': 'Customer parking in front of the shop',
    'Sous le véhicule': 'Under the vehicle', 'Vidange': 'Oil change', 'Diagnostic': 'Diagnostics', 'Changement d’huile + pneus': 'Oil change + tires',
    'Honnête et rapide, prix annoncé respecté.': 'Honest and fast, the quoted price was the price.', 'Égratignure disparue, voiture rendue lavée. Au top.': 'Scratch gone, car returned washed. Top notch.',

    /* ---- Libellés de liens ---- */
    'Questionnaire médical': 'Medical history form', 'Consignes après une extraction': 'After-extraction care instructions',
    'Plaquette gestion de patrimoine (PDF)': 'Wealth management brochure (PDF)', 'Brochure Nordlink (PDF)': 'Nordlink brochure (PDF)',
    'Nos références clients': 'Client references', 'Écouter sur Spotify ': 'Listen on Spotify',

    /* ---- Heures (formats) et adresses ---- */
    '8 h – 19 h': '8 a.m. – 7 p.m.', '9 h – 13 h': '9 a.m. – 1 p.m.', '7 h – 19 h': '7 a.m. – 7 p.m.', '8 h – 13 h': '8 a.m. – 1 p.m.', '9 h 30 – 19 h': '9:30 a.m. – 7 p.m.',
    '9 h – 18 h': '9 a.m. – 6 p.m.', '11 h – 19 h': '11 a.m. – 7 p.m.', '7 h 30 – 17 h 30': '7:30 a.m. – 5:30 p.m.', '8 h – 12 h': '8 a.m. – 12 p.m.',
    '4210, rue Saint-Denis, Montréal (Québec) H2J 2K8': '4210 Saint-Denis Street, Montreal, QC H2J 2K8',
    '1000, rue De La Gauchetière Ouest, bureau 2400, Montréal (Québec) H3B 4W5': '1000 De La Gauchetière Street West, Suite 2400, Montreal, QC H3B 4W5',
    '200 Bay Street, Suite 1800, Toronto (Ontario) M5J 2J2': '200 Bay Street, Suite 1800, Toronto, ON M5J 2J2',
    '312, rue Saint-Paul Ouest, Montréal (Québec) H2Y 2A3': '312 Saint-Paul Street West, Montreal, QC H2Y 2A3',
    'Parc La Fontaine, Montréal (Québec) H2L 3M9': 'La Fontaine Park, Montreal, QC H2L 3M9',
    '4521, boul. Saint-Laurent, Montréal (Québec) H2T 1R2': '4521 Saint-Laurent Boulevard, Montreal, QC H2T 1R2',
    '1234, chemin Royal, Saint-Laurent-de-l’Île-d’Orléans (Québec) G0A 3Z0': '1234 Chemin Royal, Saint-Laurent-de-l’Île-d’Orléans, QC G0A 3Z0',
    '45, chemin du Lac, North Hatley (Québec) J0B 2C0': '45 Chemin du Lac, North Hatley, QC J0B 2C0',
    '5334, boul. Saint-Laurent, Montréal (Québec) H2T 1S1': '5334 Saint-Laurent Boulevard, Montreal, QC H2T 1S1',
    '1800, chemin de Chambly, Longueuil (Québec) J4J 3X9': '1800 Chemin de Chambly, Longueuil, QC J4J 3X9',
    'Upstairs Jazz Bar, Montréal': 'Upstairs Jazz Bar, Montreal', 'Laval': 'Laval', 'Rosemont': 'Rosemont',
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const tr = (v) => {
    if (typeof v === 'string') return T[v] !== undefined ? T[v] : v;
    if (Array.isArray(v)) return v.map(tr);
    if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = /^(src|img|url|cover|coverVideo|photo|logo|email|website|phone|whatsapp|provider|mode|cid|type)$/.test(k) ? v[k] : tr(v[k]); return o; }
    return v;
  };

  NFC.SECTORS.forEach((s) => {
    if (!s.demo) return;
    const en = tr(clone(s.demo));
    /* Boutons, messages SMS et listes de choix : on laisse les valeurs par défaut, traduites automatiquement */
    Object.values(en.blocks || {}).forEach((b) => { if (b && typeof b === 'object') { if ('label' in b) b.label = ''; if ('smsLabel' in b) b.smsLabel = ''; if ('tpl' in b) b.tpl = ''; } });
    s.demoEn = en;
  });
  NFC.EN_CONTENT = T;
})();
