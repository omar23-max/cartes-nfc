/* Pack d’exemples Amérique du Nord (Québec / Canada / États-Unis).
   Remplace les données d’exemple françaises : villes, adresses, numéros +1, montants en $, termes locaux.
   Retirer ce fichier des pages suffit pour revenir aux exemples d’origine. */
(function () {
  'use strict';

  const L = (rows) => rows.map(([t, d = '', p = '']) => ({ t, d, p }));
  const H = (rows) => rows.map(([d, h]) => ({ d, h }));
  const R = (rows) => rows.map(([n, r, t, s = 5]) => ({ n, r, t, s }));
  const ST = (rows) => rows.map(([v, l]) => ({ v, l }));

  const PACK = {
    sante: {
      'identity.company': 'Clinique dentaire des Érables',
      'contact.phone': '+1 514 555-0142', 'contact.email': 'info@cliniquedeserables.ca', 'contact.website': 'cliniquedeserables.ca',
      'blocks.about.text': 'Diplômée de l’Université de Montréal, j’exerce depuis 2011 une dentisterie douce et attentive.\nLa clinique est équipée d’une radiologie numérique et accueille adultes et enfants. Chaque plan de traitement vous est expliqué, avec une estimation détaillée pour votre assurance, avant de commencer.',
      'blocks.location.address': '4210, rue Saint-Denis, Montréal (Québec) H2J 2K8',
      'blocks.location.access': 'Métro Mont-Royal · Stationnement sur rue · Accès fauteuil roulant',
      'blocks.hours.rows': H([['Lundi – vendredi', '8 h – 19 h'], ['Samedi', '9 h – 13 h'], ['Dimanche', 'Fermé']]),
      'blocks.languages.tags': 'Français, Anglais, Arabe, Espagnol',
      'blocks.booking.url': 'https://cliniquedeserables.janeapp.com/',
      'blocks.reviews.items': R([['Nadia B.', 'Patiente', 'Très à l’écoute, les soins sont expliqués pas à pas. Je recommande.'], ['Olivier M.', 'Patient', 'Clinique moderne, rendez-vous rapide et facturation directe à mon assurance.']]),
    },
    conseil: {
      'identity.company': 'Banque Horizon',
      'contact.phone': '+1 514 555-0118', 'contact.email': 'k.bennani@banquehorizon.ca', 'contact.website': 'banquehorizon.ca',
      'blocks.about.text': 'J’accompagne les particuliers et les propriétaires d’entreprise dans la construction et la protection de leur patrimoine.\nREER, CELI, placements, préparation de la retraite ou planification successorale : nous définissons ensemble une stratégie claire, adaptée à vos objectifs et à votre horizon.',
      'blocks.expertises.items': L([['Épargne et placements', 'REER, CELI, fonds communs, CPG'], ['Préparation de la retraite', 'Décaissement REER / FERR, rentes'], ['Planification successorale', 'Testament, fiducie, protection du conjoint'], ['Financement immobilier', 'Hypothèque, CELIAPP pour premier achat']]),
      'blocks.stats.items': ST([['15 ans', 'd’expérience en gestion privée'], ['350', 'familles accompagnées'], ['48 h', 'pour un premier rendez-vous']]),
      'blocks.parcours.items': L([['Banque Horizon · depuis 2019', 'Conseiller en gestion de patrimoine'], ['Caisse régionale · 2011 – 2019', 'Conseiller aux entreprises'], ['Planificateur financier (Pl. Fin.)', 'HEC Montréal · IQPF']]),
      'blocks.location.address': '1000, rue De La Gauchetière Ouest, bureau 2400, Montréal (Québec) H3B 4W5',
      'blocks.location.access': 'Métro Bonaventure · Stationnement intérieur · Accès PMR',
      'blocks.faq.items': L([['Le premier rendez-vous est-il facturé ?', 'Non, le premier bilan financier est offert.'], ['Faut-il être client de la banque ?', 'Non, je rencontre aussi des personnes non clientes.']]),
      'blocks.reviews.items': R([['Sophie & Marc T.', 'Clients depuis 2021', 'Un vrai plan clair pour notre retraite, et un suivi régulier de nos REER.'], ['Julien R.', 'Propriétaire d’entreprise', 'Réactif et pédagogue, il a simplifié le transfert de mon entreprise.']]),
    },
    pro: {
      'identity.specialty': 'Solutions logistiques B2B · Canada – États-Unis',
      'contact.phone': '+1 416 555-0176', 'contact.email': 's.laurent@nordlink.com', 'contact.website': 'nordlink.com',
      'blocks.about.text': 'J’accompagne les distributeurs et les commerçants en ligne dans l’optimisation de leur chaîne logistique entre le Canada et les États-Unis : entreposage, transport transfrontalier et préparation de commandes.',
      'blocks.location.address': '200 Bay Street, Suite 1800, Toronto (Ontario) M5J 2J2',
      'blocks.reviews.items': R([['Thomas G.', 'Directeur des opérations', 'Un interlocuteur fiable qui tient ses délais, même à la frontière.'], ['Claire D.', 'Commerce en ligne', 'Nos coûts logistiques ont baissé de 18 % en six mois.', 4]]),
    },
    freelance: {
      'identity.company': 'Studio Garnier',
      'contact.phone': '+1 438 555-0133', 'contact.email': 'hello@leagarnier.dev', 'contact.website': 'leagarnier.dev',
      'blocks.about.text': 'Développeuse front-end depuis 8 ans, je conçois des sites et applications web rapides, accessibles et faciles à faire évoluer.\nJ’interviens à contrat ou au forfait, de la maquette à la mise en ligne, pour des jeunes pousses comme pour des PME, au Québec et aux États-Unis.',
      'blocks.services.items': L([['Site vitrine sur mesure', 'Design, développement, mise en ligne', 'dès 3 500 $'], ['Application web', 'React / Next.js, API, tableau de bord', 'Sur soumission'], ['Audit d’accessibilité', 'Rapport WCAG 2.2 et plan d’action', '1 200 $'], ['Contrat longue durée', 'Intégrée à votre équipe', '95 $ / h']]),
      'blocks.skills.text': 'Disponible à partir du 1er novembre, 3 jours par semaine. Fuseau horaire de l’Est.',
      'blocks.links.items': [{ label: 'Mon CV (PDF)', url: 'https://example.com' }, { label: 'GitHub', url: 'https://github.com/' }, { label: 'Profil Upwork', url: 'https://www.upwork.com/' }],
      'blocks.brief.text': 'Décrivez votre projet, votre budget et vos délais : réponse sous 48 h ouvrables.',
    },
    immobilier: {
      'identity.role': 'Courtière immobilière résidentielle',
      'identity.specialty': 'Plateau-Mont-Royal · Ventes et évaluations',
      'identity.company': 'Fontaine Immobilier',
      'contact.phone': '+1 514 555-0167', 'contact.whatsapp': '+1 514 555-0167', 'contact.email': 'julie@fontaineimmo.ca', 'contact.website': 'fontaineimmo.ca',
      'blocks.about.text': 'Installée sur le Plateau depuis 10 ans, je connais chaque rue, chaque copropriété et les prix réels du quartier.\nJe vous accompagne de l’évaluation jusqu’à la signature chez le notaire, avec une seule interlocutrice du début à la fin.',
      'blocks.biens.items': [
        { t: 'Condo 5 ½ · 1 100 pi²', d: 'Plateau-Mont-Royal · Balcon · 3e étage', p: '589 000 $', img: 'media/immobilier/15851.jpg', url: '' },
        { t: 'Maison unifamiliale · 4 chambres', d: 'Laval · Terrain de 6 000 pi²', p: '849 000 $', img: 'media/immobilier/27543.jpg', url: '' },
        { t: 'Condo 3 ½ · 650 pi²', d: 'Centre-ville · Idéal investisseur', p: '329 000 $', img: 'media/immobilier/13126.jpg', url: '' },
      ],
      'blocks.stats.items': ST([['48', 'propriétés vendues en 2025'], ['21 j', 'délai moyen de vente'], ['99 %', 'du prix demandé obtenu']]),
      'blocks.secteur.tags': 'Plateau-Mont-Royal, Mile End, Rosemont, Outremont',
      'blocks.secteur.text': 'Évaluation gratuite de votre propriété sous 48 h.',
      'blocks.services.items': L([['Évaluation gratuite', 'Analyse comparative du marché sous 48 h'], ['Vente de votre propriété', 'Photos professionnelles, visites libres, négociation'], ['Recherche sur mesure', 'Pour les acheteurs pressés']]),
      'blocks.estimation.text': 'Indiquez l’adresse et la superficie de votre propriété : je vous rappelle pour fixer un rendez-vous d’évaluation.',
      'blocks.reviews.items': R([['Famille Durand', 'Vendeurs sur le Plateau', 'Condo vendu en 3 semaines au prix demandé.'], ['Amine K.', 'Premier achat', 'Disponible, honnête, et de très bon conseil pour le CELIAPP.']]),
    },
    archi: {
      'identity.specialty': 'Rénovation de maisons et de plex centenaires',
      'contact.phone': '+1 514 555-0189', 'contact.email': 'bonjour@ateliermarchand.ca', 'contact.website': 'ateliermarchand.ca',
      'blocks.about.text': 'Nous redonnons vie aux plex et aux maisons anciennes de Montréal en respectant leur caractère : boiseries, moulures et volumes, avec des matériaux durables et un confort d’aujourd’hui.',
      'blocks.projets.items': [
        { t: 'Triplex centenaire', d: 'Plateau-Mont-Royal · 1 800 pi² · Rénovation complète', p: '', img: 'media/archi/4030.jpg', url: '' },
        { t: 'Maison de ville', d: 'Westmount · Agrandissement et cuisine', p: '', img: 'media/archi/4047.jpg', url: '' },
        { t: 'Loft industriel', d: 'Griffintown · Mezzanine sur mesure', p: '', img: 'media/archi/35798.jpg', url: '' },
      ],
      'blocks.services.items': L([['Consultation déco', 'Visite de 2 h et recommandations', '350 $'], ['Plans et rendus 3D', 'Aménagement complet', 'dès 2 500 $'], ['Projet clé en main', 'Conception et suivi de chantier', 'Sur soumission']]),
      'blocks.projet.text': 'Superficie, budget indicatif, échéancier : décrivez votre projet et joignez quelques photos.',
      'blocks.reviews.items': R([['Céline & Paul', 'Rénovation d’un duplex', 'Le rendu 3D était fidèle au résultat final. Superbe travail.'], ['Isabelle F.', 'Maison à Westmount', 'Chantier livré dans les délais et le budget.']]),
    },
    artisans: {
      'identity.specialty': 'Urgence 24/7 · Rénovation de salles de bain',
      'identity.company': 'Plomberie Morel',
      'contact.phone': '+1 514 555-0124', 'contact.whatsapp': '+1 514 555-0124', 'contact.email': 'info@plomberiemorel.ca', 'contact.website': 'plomberiemorel.ca',
      'blocks.about.text': 'Maître plombier depuis 12 ans, j’interviens rapidement pour vos fuites, débouchages et chauffe-eau.\nJe réalise aussi vos rénovations de salles de bain, de la conception à la pose. Estimation gratuite, travail soigné et chantier laissé propre.',
      'blocks.services.items': L([['Urgence et recherche de fuite', 'Intervention en moins de 2 h, 24/7', 'dès 129 $'], ['Débouchage de drains', 'Évier, toilette, colonne ; inspection par caméra', 'dès 175 $'], ['Chauffe-eau', 'Remplacement, entretien, mise en service', 'Sur soumission'], ['Rénovation de salle de bain', 'Douche en céramique, accès universel, clé en main', 'Sur soumission']]),
      'blocks.zone.tags': 'Montréal, Laval, Longueuil, Brossard, Boucherville',
      'blocks.zone.text': 'Déplacement gratuit sur l’île de Montréal.',
      'blocks.quote.text': 'Décrivez votre besoin : je vous rappelle sous 24 h avec une soumission gratuite.',
      'blocks.hours.rows': H([['Lundi – vendredi', '7 h – 19 h'], ['Samedi', '8 h – 13 h'], ['Dimanche', 'Urgences seulement']]),
      'blocks.hours.note': 'Service d’urgence 24/7',
      'blocks.qualif.tags': 'Licence RBQ, Membre CMMTQ, Assurance responsabilité, Estimation gratuite',
      'blocks.reviews.items': R([['Martine L.', 'Laval', 'Venu un dimanche pour une fuite, rapide et propre.'], ['Karim S.', 'Rosemont', 'Salle de bain refaite à neuf, travail soigné et soumission respectée.']]),
    },
    beaute: {
      'contact.phone': '+1 514 555-0158', 'contact.whatsapp': '+1 514 555-0158', 'contact.email': 'bonjour@maisonhaddad.ca', 'contact.website': 'maisonhaddad.ca',
      'blocks.prestations.items': L([['Coupe homme', '30 min', '35 $'], ['Taille de barbe', '20 min · serviette chaude', '25 $'], ['Coupe + barbe', '45 min', '55 $'], ['Rasage à l’ancienne', '30 min · au coupe-chou', '45 $']]),
      'blocks.gift.text': 'Valide un an sur tous les services.',
      'blocks.hours.rows': H([['Mardi – vendredi', '9 h 30 – 19 h'], ['Samedi', '9 h – 18 h'], ['Dimanche – lundi', 'Fermé']]),
      'blocks.location.address': '312, rue Saint-Paul Ouest, Montréal (Québec) H2Y 2A3',
      'blocks.location.access': 'Métro Square-Victoria · Vieux-Montréal',
      'blocks.reviews.items': R([['Yanis D.', 'Client régulier', 'Le meilleur dégradé en ville, et toujours à l’heure.'], ['Mehdi A.', 'Client', 'Rasage à l’ancienne au top, ambiance très sympa.']]),
    },
    coaching: {
      'identity.role': 'Entraîneur personnel certifié',
      'identity.specialty': 'Perte de poids · Remise en forme',
      'contact.phone': '+1 514 555-0107', 'contact.whatsapp': '+1 514 555-0107', 'contact.email': 'thomas@leroycoaching.ca', 'contact.website': 'leroycoaching.ca',
      'blocks.about.text': 'Ancien athlète, j’entraîne depuis 9 ans des personnes qui veulent reprendre le sport sans se blesser.\nChaque programme part de votre niveau réel, de votre horaire et de vos objectifs : perte de poids, renforcement ou préparation d’un marathon.',
      'blocks.programmes.items': L([['Séance individuelle', '1 h · à domicile ou au gym', '75 $'], ['Forfait 10 séances', 'Suivi nutrition inclus', '690 $'], ['Petit groupe', '4 personnes maximum', '30 $ / pers.'], ['Programme en ligne', '12 semaines · application + visio', '199 $']]),
      'blocks.planning.rows': H([['Lundi', 'Cross-training · 18 h 30'], ['Mercredi', 'Renforcement · 12 h 15'], ['Samedi', 'Course au parc · 9 h']]),
      'blocks.stats.items': ST([['250+', 'clients accompagnés'], ['-15 lb', 'en moyenne sur 3 mois']]),
      'blocks.location.address': 'Parc La Fontaine, Montréal (Québec) H2L 3M9',
      'blocks.location.access': 'Rendez-vous au chalet du parc, côté rue Sherbrooke',
      'blocks.reviews.items': R([['Laura P.', '-20 lb en 4 mois', 'Des séances variées et un vrai suivi. Je n’ai jamais été aussi motivée.'], ['Franck M.', 'Marathon de Montréal', 'Premier marathon terminé sans blessure grâce à Thomas.']]),
    },
    restaurant: {
      'contact.phone': '+1 514 555-0199', 'contact.email': 'bonjour@comptoirdeshalles.ca', 'contact.website': 'comptoirdeshalles.ca',
      'blocks.about.text': 'Une cuisine de bistro généreuse, pensée chaque matin selon le marché Jean-Talon. Midi et soir, dans une salle chaleureuse de 40 places et sur notre terrasse l’été.',
      'blocks.menu.cats': [
        { name: 'Entrées', items: L([['Œuf parfait', 'Crème de champignons, croûtons', '14 $'], ['Velouté de courge', 'Noisettes grillées', '12 $'], ['Burrata crémeuse', 'Tomates du Québec, basilic', '19 $']]) },
        { name: 'Plats', items: L([['Joue de bœuf braisée', 'Purée maison, jus corsé', '34 $'], ['Omble chevalier', 'Légumes de saison, beurre citronné', '36 $'], ['Risotto aux champignons sauvages', 'Parmesan 24 mois', '29 $']]) },
        { name: 'Desserts', items: L([['Tarte fine aux pommes', 'Crème glacée à l’érable', '12 $'], ['Mousse au chocolat noir', '', '11 $'], ['Pouding chômeur', 'Sirop d’érable', '12 $']]) },
      ],
      'blocks.booking.text': 'Réservation en ligne ou par téléphone. Groupes jusqu’à 20 personnes.',
      'blocks.booking.url': 'https://www.opentable.ca/r/le-comptoir-des-halles-montreal',
      'blocks.order.text': 'Commandes pour emporter du mardi au samedi.',
      'blocks.hours.rows': H([['Lundi', 'Fermé'], ['Mardi – vendredi', '11 h 30 – 14 h 30 · 17 h 30 – 22 h 30'], ['Samedi', '17 h – 23 h'], ['Dimanche', 'Brunch · 10 h – 15 h']]),
      'blocks.location.address': '4521, boul. Saint-Laurent, Montréal (Québec) H2T 1R2',
      'blocks.location.access': 'Terrasse · Accès fauteuil roulant · Métro Mont-Royal',
      'blocks.reviews.items': R([['Camille R.', 'Dîner d’affaires', 'Cuisine généreuse, service attentionné. La joue de bœuf est parfaite.'], ['Antoine V.', 'Souper en terrasse', 'Une adresse qu’on garde précieusement.']]),
    },
    producteurs: {
      'identity.company': 'Famille Roche',
      'identity.specialty': 'Légumes de saison · Paniers bio hebdomadaires',
      'contact.phone': '+1 418 555-0145', 'contact.email': 'ferme@quatresaisons.ca', 'contact.website': 'quatresaisons.ca',
      'blocks.about.text': 'Sur 8 acres à l’Île d’Orléans, nous cultivons plus de 40 variétés de légumes certifiés biologiques.\nRécoltés la veille, vendus en direct : c’est notre promesse.',
      'blocks.produits.items': L([['Panier découverte', '4 à 5 légumes de saison', '25 $'], ['Panier famille', '7 à 8 légumes + œufs', '40 $'], ['Œufs de poules en liberté', 'Douzaine', '7 $'], ['Confitures maison', 'Pot de 250 ml', '8 $']]),
      'blocks.saison.tags': 'Courges, Poireaux, Choux, Pommes, Maïs sucré',
      'blocks.marches.rows': H([['Mardi', 'Marché Jean-Talon · 8 h – 14 h'], ['Vendredi', 'Kiosque à la ferme · 14 h – 18 h'], ['Samedi', 'Marché du Vieux-Port de Québec · 9 h – 15 h']]),
      'blocks.order.text': 'Commandez avant jeudi midi, cueillette le vendredi à la ferme.',
      'blocks.location.address': '1234, chemin Royal, Saint-Laurent-de-l’Île-d’Orléans (Québec) G0A 3Z0',
      'blocks.location.access': 'Stationnement gratuit à la ferme',
      'blocks.reviews.items': R([['Sandrine F.', 'Abonnée aux paniers', 'Des légumes qui ont du goût, et on sait d’où ils viennent.'], ['Luc B.', 'Client du marché', 'Toujours souriants et de bon conseil pour cuisiner.']]),
    },
    evenementiel: {
      'identity.role': 'Planificatrice de mariages',
      'identity.specialty': 'Mariages sur mesure dans les Laurentides',
      'contact.phone': '+1 450 555-0163', 'contact.whatsapp': '+1 450 555-0163', 'contact.email': 'camille@duboisevents.ca', 'contact.website': 'duboisevents.ca',
      'blocks.formules.items': L([['Coordination du jour J', 'Présence de 10 h à minuit', 'dès 1 800 $'], ['Organisation partielle', 'Lieu, traiteur et décor', 'dès 4 500 $'], ['Organisation complète', 'De A à Z, sur 12 mois', 'Sur soumission']]),
      'blocks.dispo.text': 'Indiquez la date, le lieu envisagé, le nombre d’invités et votre budget : je vous confirme ma disponibilité sous 48 h.',
      'blocks.reviews.items': R([['Emma & Lucas', 'Mariage à Mont-Tremblant', 'Nous avons profité de chaque minute. Tout était parfait.'], ['Sarah & Nicolas', 'Mariage au domaine', 'Camille a géré chaque imprévu sans que nous le voyions.']]),
    },
    portfolio: {
      'contact.phone': '+1 514 555-0181', 'contact.email': 'studio@elisemoreau.ca', 'contact.website': 'elisemoreau.ca',
      'blocks.offres.items': L([['Séance portrait', '1 h · 10 photos retouchées', '250 $'], ['Photos d’équipe', 'Demi-journée sur place', '950 $'], ['Reportage de mariage', 'Journée complète', 'dès 2 900 $']]),
      'blocks.reviews.items': R([['Aurélie M.', 'Séance portrait', 'Des photos naturelles, je me suis enfin trouvée belle.'], ['Studio Kappa', 'Photos d’équipe', 'Professionnelle, rapide et discrète dans nos bureaux.']]),
    },
    musique: {
      'contact.phone': '+1 514 555-0150', 'contact.email': 'booking@novatrio.ca', 'contact.website': 'novatrio.ca',
      'blocks.dates.rows': H([['12 oct.', 'Upstairs Jazz Bar, Montréal'], ['25 oct.', 'Le Grand Théâtre, Québec'], ['8 nov.', 'Blue Note, New York']]),
      'blocks.formules.items': L([['Cocktail', '2 sets de 45 min · acoustique', 'dès 1 800 $'], ['Soirée complète', 'Sono + DJ en fin de soirée', 'dès 3 500 $']]),
      'blocks.reviews.items': R([['Hôtel Le Germain', 'Soirée de gala', 'Le trio a sublimé notre soirée, nos invités en parlent encore.'], ['Julie & Marc', 'Mariage', 'Un répertoire parfait, du cocktail à la piste de danse.']]),
    },
    influence: {
      'contact.email': 'collab@sarahkem.com', 'contact.website': 'sarahkem.com',
      'blocks.about.text': 'Je partage des recettes simples et des carnets de voyage gourmands avec une communauté de passionnés de cuisine du quotidien, au Québec et partout en Amérique du Nord.',
      'blocks.stats.items': ST([['180 k', 'abonnés TikTok'], ['95 k', 'abonnés Instagram'], ['6,2 %', 'taux d’engagement'], ['64 %', 'audience au Canada']]),
      'blocks.collabs.items': L([['Vidéo TikTok dédiée', 'Création + publication', 'dès 1 200 $'], ['Story Instagram', 'Série de 3 stories', 'dès 500 $'], ['Contenu UGC', 'Vidéo livrée, non publiée', 'dès 450 $']]),
      'blocks.marques.tags': 'IGA, Air Canada, Le Creuset, HelloFresh',
      'blocks.reviews.items': R([['Marque d’ustensiles', 'Campagne TikTok', 'Plus de 2 millions de vues et des ventes en hausse la semaine suivante.'], ['Tourisme Québec', 'Série voyage', 'Un contenu authentique qui a parlé à notre public.']]),
    },
    hebergement: {
      'identity.name': 'Auberge des Érables',
      'identity.role': 'Gîte · 5 chambres',
      'identity.specialty': 'Au cœur des Cantons-de-l’Est',
      'contact.phone': '+1 819 555-0112', 'contact.whatsapp': '+1 819 555-0112', 'contact.email': 'bonjour@aubergedeserables.ca', 'contact.website': 'aubergedeserables.ca',
      'blocks.about.text': 'Une maison victorienne de 1890 restaurée, entourée d’érables centenaires, à 5 minutes du lac Massawippi.\nDéjeuner maison servi sur la galerie, spa extérieur et calme absolu.',
      'blocks.chambres.items': [
        { t: 'Chambre Érable', d: '2 pers. · vue sur le jardin', p: 'dès 189 $ / nuit', img: 'media/hebergement/4046.jpg', url: '' },
        { t: 'Suite du Lac', d: '4 pers. · balcon privé', p: 'dès 289 $ / nuit', img: 'media/hebergement/4030.jpg', url: '' },
        { t: 'Chambre Forêt', d: '2 pers. · rez-de-jardin', p: 'dès 169 $ / nuit', img: 'media/hebergement/4488.jpg', url: '' },
      ],
      'blocks.booking.url': 'https://www.airbnb.ca/rooms/auberge-des-erables',
      'blocks.equipements.tags': 'Spa extérieur, Déjeuner inclus, Wi-Fi, Stationnement gratuit, Borne de recharge',
      'blocks.infos.rows': H([['Arrivée', '16 h – 20 h'], ['Départ', 'Avant 11 h'], ['Ouverture', 'À l’année']]),
      'blocks.location.address': '45, chemin du Lac, North Hatley (Québec) J0B 2C0',
      'blocks.location.access': 'À 1 h 30 de Montréal · 20 min de Sherbrooke',
      'blocks.reviews.items': R([['Anne & Pierre', 'Séjour en octobre', 'Les couleurs de l’automne et un déjeuner mémorable.'], ['Famille Martin', 'Suite du Lac', 'Accueil chaleureux, spa et calme absolu. On reviendra !']]),
    },
    tourisme: {
      'identity.role': 'Guide touristique',
      'identity.specialty': 'Québec, Charlevoix et le Saint-Laurent',
      'identity.company': 'Fleuve Découvertes',
      'contact.phone': '+1 418 555-0171', 'contact.whatsapp': '+1 418 555-0171', 'contact.email': 'nadia@fleuvedecouvertes.ca', 'contact.website': 'fleuvedecouvertes.ca',
      'blocks.about.text': 'Née à Québec, je vous fais découvrir ma région autrement : ruelles du Vieux-Québec, baleines du Saint-Laurent et paysages de Charlevoix.',
      'blocks.experiences.items': [
        { t: 'Croisière aux baleines', d: '3 h · Tadoussac · dès 8 ans', p: '99 $', img: 'media/tourisme/8680.jpg', url: '' },
        { t: 'Le Vieux-Québec gourmand', d: '2 h 30 · dégustations', p: '69 $', img: 'media/tourisme/3428.jpg', url: '' },
        { t: 'Randonnée à Charlevoix', d: '4 h · niveau intermédiaire', p: '59 $', img: 'media/tourisme/4371.jpg', url: '' },
      ],
      'blocks.booking.text': 'Groupes de 12 personnes maximum.',
      'blocks.planning.rows': H([['Tous les jours', 'Baleines · 9 h et 14 h'], ['Mar., jeu., sam.', 'Vieux-Québec · 10 h']]),
      'blocks.surmesure.text': 'Groupe, séminaire ou séjour de plusieurs jours : décrivez votre projet.',
      'blocks.reviews.items': R([['Clara V.', 'Croisière aux baleines', 'Nadia connaît chaque recoin du fleuve, une matinée inoubliable.'], ['Tom & Jess', 'Visite du Vieux-Québec', 'Passionnant et gourmand, on a découvert Québec autrement.']]),
    },
    animaux: {
      'identity.role': 'Toiletteuse canin et félin',
      'contact.phone': '+1 514 555-0136', 'contact.whatsapp': '+1 514 555-0136', 'contact.email': 'bonjour@poilsetpattes.ca', 'contact.website': 'poilsetpattes.ca',
      'blocks.services.items': L([['Bain + séchage', 'Petit chien', 'dès 45 $'], ['Toilettage complet', 'Coupe aux ciseaux, griffes, oreilles', 'dès 75 $'], ['Chat', 'Bain et démêlage', 'dès 85 $'], ['Toilettage à domicile', 'Camion équipé', '+20 $']]),
      'blocks.zone.tags': 'Montréal, Laval, Longueuil, Brossard',
      'blocks.zone.text': 'Toilettage à domicile dans un rayon de 25 km.',
      'blocks.hours.rows': H([['Mardi – samedi', '9 h – 18 h'], ['Dimanche – lundi', 'Fermé']]),
      'blocks.conditions.items': L([['Vaccins à jour', 'Carnet demandé au premier rendez-vous'], ['Durée', 'Comptez 1 h 30 à 3 h selon la race']]),
      'blocks.reviews.items': R([['Julie & Filou', 'Caniche', 'Filou ressort toujours détendu et magnifique.'], ['Marc & Oscar', 'Golden retriever', 'Très douce avec les chiens anxieux. Merci Chloé !']]),
    },
    boutiques: {
      'identity.specialty': 'Argent recyclé · Pièces uniques · Fait à Montréal',
      'contact.phone': '+1 514 555-0192', 'contact.email': 'hello@ateliersolene.ca', 'contact.website': 'ateliersolene.ca',
      'blocks.about.text': 'Des bijoux sobres et durables, façonnés un à un dans mon atelier du Mile End à partir d’argent 100 % recyclé.',
      'blocks.collection.items': [
        { t: 'Bague Onde', d: 'Argent sterling recyclé', p: '95 $', img: 'media/boutiques/20877.jpg', url: '' },
        { t: 'Anneaux Lune', d: 'Martelés à la main', p: '120 $', img: 'media/boutiques/2865.jpg', url: '' },
        { t: 'Collier Galet', d: 'Pièce unique', p: '165 $', img: 'media/boutiques/51649.jpg', url: '' },
      ],
      'blocks.shop.text': 'Livraison gratuite au Canada et aux États-Unis dès 100 $.',
      'blocks.location.address': '5334, boul. Saint-Laurent, Montréal (Québec) H2T 1S1',
      'blocks.location.access': 'Atelier-boutique dans le Mile End',
      'blocks.hours.rows': H([['Mercredi – samedi', '11 h – 19 h'], ['Dimanche – mardi', 'Sur rendez-vous']]),
      'blocks.reviews.items': R([['Léa G.', 'Bague Onde', 'Un bijou délicat et un emballage superbe. Parfait pour offrir.'], ['Hélène R.', 'Pièce sur mesure', 'Solène a créé exactement l’alliance dont je rêvais.']]),
    },
    auto: {
      'identity.company': 'Garage Lopez',
      'identity.specialty': 'Entretien toutes marques · Carrosserie · Pneus',
      'contact.phone': '+1 450 555-0128', 'contact.whatsapp': '+1 450 555-0128', 'contact.email': 'atelier@garagelopez.ca', 'contact.website': 'garagelopez.ca',
      'blocks.about.text': 'Garage indépendant depuis 1998, nous entretenons et réparons toutes les marques avec des pièces d’origine ou équivalentes, au juste prix.',
      'blocks.services.items': L([['Changement d’huile + filtre', 'Selon le carnet du fabricant', 'dès 89 $'], ['Diagnostic électronique', 'Lecture et effacement des codes', '99 $'], ['Pose de pneus d’hiver', 'Installation et balancement', 'dès 25 $ / pneu'], ['Carrosserie', 'Égratignures, bosses, peinture', 'Sur soumission']]),
      'blocks.vehicules.items': [
        { t: 'Honda Civic · 2021', d: '45 000 km · Essence', p: '22 900 $', img: 'ph:photo|Honda Civic', url: '' },
        { t: 'Toyota RAV4 · 2020', d: '58 000 km · Hybride', p: '29 500 $', img: 'ph:photo|Toyota RAV4', url: '' },
      ],
      'blocks.garanties.tags': 'Pièces garanties 2 ans, Estimation gratuite, Voiture de courtoisie',
      'blocks.hours.rows': H([['Lundi – vendredi', '7 h 30 – 17 h 30'], ['Samedi', '8 h – 12 h']]),
      'blocks.location.address': '1800, chemin de Chambly, Longueuil (Québec) J4J 3X9',
      'blocks.location.access': 'Stationnement clients devant le garage',
      'blocks.reviews.items': R([['Patrick D.', 'Changement d’huile + pneus', 'Honnête et rapide, prix annoncé respecté.'], ['Nora S.', 'Carrosserie', 'Égratignure disparue, voiture rendue lavée. Au top.']]),
    },
  };

  /* Légendes de photos à adapter */
  const CAPS = { hebergement: { 'Chambre Lavande': 'Chambre Érable', 'Suite Olivier': 'Suite du Lac', 'Chambre Garrigue': 'Chambre Forêt' } };

  const setP = (o, path, v) => {
    const ks = path.split('.'), last = ks.pop();
    const target = ks.reduce((a, k) => (a == null ? a : a[k]), o);
    if (target == null || !(last in target)) return false;
    target[last] = v;
    return true;
  };

  NFC.SECTORS.forEach((s) => {
    const p = PACK[s.id];
    if (!p || !s.demo) return;
    Object.entries(p).forEach(([path, v]) => { if (!setP(s.demo, path, v) && window.console) console.warn('[locale-na] champ absent :', s.id, path); });
    const caps = CAPS[s.id];
    if (caps) Object.values(s.demo.blocks).forEach((b) => (b.images || []).forEach((im) => { if (caps[im.cap]) im.cap = caps[im.cap]; }));
    /* Formulaire de contact : même adresse que la carte */
    if (s.demo.blocks.contact && s.demo.contact.email) s.demo.blocks.contact.email = s.demo.contact.email;
    s.blocks.forEach((def) => { const b = s.demo.blocks[def.key]; if (b && (def.type === 'form' || def.type === 'booking') && 'email' in b) b.email = s.demo.contact.email; });
  });
  NFC.LOCALE = 'na';
})();
