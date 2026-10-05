/* Blocs communs ajoutés à tous les secteurs : avis clients et formulaire de contact.
   Couverture vidéo par défaut pour les secteurs où l’ambiance compte le plus. */
(function () {
  'use strict';

  const R = (n, r, t, s = 5) => ({ n, r, t, s });
  const REVIEWS = {
    sante: [R('Jennifer B.', 'Patiente', 'Très à l’écoute, les soins sont expliqués pas à pas. Je recommande.'), R('Brian M.', 'Patient', 'Cabinet moderne, rendez-vous rapide et aucune douleur.')],
    conseil: [R('Linda & Mark T.', 'Clients depuis 2021', 'Un vrai plan clair pour notre retraite, et un suivi régulier.'), R('Steven R.', 'Chef d’entreprise', 'Réactif et pédagogue, il a simplifié la transmission de ma société.')],
    pro: [R('Andrew G.', 'Responsable supply chain', 'Un interlocuteur fiable qui tient ses délais.'), R('Nicole D.', 'E-commerçante', 'Nos coûts logistiques ont baissé de 18 % en six mois.', 4)],
    freelance: [R('Amanda L.', 'CEO, startup SaaS', 'Code propre, livré en avance, et une vraie force de proposition.'), R('Justin P.', 'Directeur marketing', 'Notre nouveau site est deux fois plus rapide. Merci Emma !')],
    immobilier: [R('Famille Wilson', 'Vendeurs à Lyon 6e', 'Appartement vendu en 3 semaines au prix demandé.'), R('Adam K.', 'Acquéreur', 'Disponible, honnête et de très bon conseil.')],
    archi: [R('Rebecca & Paul', 'Rénovation d’un T4', 'Le rendu 3D était fidèle au résultat final. Superbe travail.'), R('Heather F.', 'Maison de ville', 'Chantier tenu dans les délais et le budget.')],
    artisans: [R('Karen L.', 'Villeurbanne', 'Intervenu un dimanche pour une fuite, rapide et propre.'), R('Chris S.', 'Lyon 3e', 'Salle de bain refaite à neuf, travail soigné et devis respecté.')],
    beaute: [R('Tyler D.', 'Client régulier', 'Le meilleur dégradé de Lyon, et toujours à l’heure.'), R('Brandon A.', 'Client', 'Rasage à l’ancienne au top, ambiance très sympa.')],
    coaching: [R('Melissa P.', '-9 kg en 4 mois', 'Des séances variées et un vrai suivi. Je n’ai jamais été aussi motivée.'), R('Greg M.', 'Préparation marathon', 'Premier marathon bouclé sans blessure grâce à Kevin.')],
    restaurant: [R('Lauren R.', 'Déjeuner d’affaires', 'Cuisine généreuse, service attentionné. La joue de bœuf est parfaite.'), R('Matthew V.', 'Dîner en terrasse', 'Une adresse qu’on garde précieusement.')],
    producteurs: [R('Stephanie F.', 'Abonnée aux paniers', 'Des légumes qui ont du goût, et on sait d’où ils viennent.'), R('Luke B.', 'Client du marché', 'Toujours souriants et de bon conseil pour cuisiner.')],
    evenementiel: [R('Emma & Liam', 'Mariage en Provence', 'Nous avons profité de chaque minute. Tout était parfait.'), R('Sarah & Nathan', 'Mariage au domaine', 'Ashley a géré chaque imprévu sans que nous le voyions.')],
    portfolio: [R('Kimberly M.', 'Séance portrait', 'Des photos naturelles, je me suis enfin trouvée belle.'), R('Studio Kappa', 'Photos d’équipe', 'Professionnelle, rapide et discrète dans nos locaux.')],
    musique: [R('Domaine des Tilleuls', 'Soirée de gala', 'Le trio a sublimé notre soirée, nos invités en parlent encore.'), R('Julia & Mark', 'Mariage', 'Un répertoire parfait, du cocktail à la piste de danse.')],
    influence: [R('Marque de cuisine', 'Campagne TikTok', 'Plus de 2 millions de vues et des ventes en hausse la semaine suivante.'), R('Office de tourisme', 'Série voyage', 'Un contenu authentique qui a parlé à notre cible.')],
    hebergement: [R('Anne & Peter', 'Séjour en juillet', 'Un havre de paix, le petit-déjeuner est un régal.'), R('Famille Miller', 'Suite Olivier', 'Accueil chaleureux, piscine et calme absolu. On reviendra !')],
    tourisme: [R('Natalie V.', 'Calanques en bateau', 'Laura connaît chaque crique, une matinée inoubliable.'), R('Tom & Jess', 'Visite du Panier', 'Passionnant et gourmand, on a découvert Marseille autrement.')],
    animaux: [R('Julia & Filou', 'Caniche', 'Filou ressort toujours détendu et magnifique.'), R('Mark & Oscar', 'Golden retriever', 'Très douce avec les chiens anxieux. Merci Rachel !')],
    boutiques: [R('Amy G.', 'Bague Onde', 'Un bijou délicat et un emballage superbe. Parfait pour offrir.'), R('Helen R.', 'Pièce sur mesure', 'Grace a créé exactement l’alliance dont je rêvais.')],
    auto: [R('Patrick D.', 'Vidange + pneus', 'Honnête et rapide, prix annoncé respecté.'), R('Nora S.', 'Carrosserie', 'Rayure disparue, voiture rendue lavée. Au top.')],
  };
  /* Professions encadrées : pas d’avis affichés par défaut (règles déontologiques) */
  const REVIEWS_OFF = ['sante', 'conseil'];
  const COVER_VIDEO = ['restaurant', 'animaux', 'coaching'];

  NFC.SECTORS.forEach((s) => {
    if (!s.demo) return;
    const d = s.demo;
    const at = (keys) => { const i = s.blocks.findIndex((b) => keys.includes(b.key)); return i < 0 ? s.blocks.length : i; };

    if (!s.blocks.some((b) => b.type === 'reviews')) {
      const help = REVIEWS_OFF.includes(s.id) ? 'Vérifiez les règles de votre ordre professionnel avant d’afficher des avis.' : 'Avis de vos clients, avec leur accord';
      s.blocks.splice(at(['location', 'hours', 'video']), 0, { key: 'reviews', type: 'reviews', title: 'Avis clients', help });
      d.blocks.reviews = { on: !REVIEWS_OFF.includes(s.id), items: (REVIEWS[s.id] || []).map((x) => Object.assign({}, x)) };
    }
    if (!s.blocks.some((b) => b.type === 'contact')) {
      const hasForm = s.blocks.some((b) => b.type === 'form' && d.blocks[b.key] && d.blocks[b.key].on);
      s.blocks.push({ key: 'contact', type: 'contact', title: 'Me contacter', cta: 'Envoyer un message', help: 'Les messages arrivent dans votre espace' });
      d.blocks.contact = { on: !hasForm, email: d.contact.email || '', text: s.establishment ? 'Une question ? Écrivez-nous, nous répondons rapidement.' : 'Une question ? Écrivez-moi, je vous réponds rapidement.' };
    }
    d.custom = d.custom || [];
    if (COVER_VIDEO.includes(s.id) && NFC.MEDIA && NFC.MEDIA[s.id]) {
      d.identity.coverType = 'video';
      d.identity.coverVideo = NFC.MEDIA[s.id].video.src;
    }
  });

  /* Coaching : métier visuel, beaucoup plus de photos et de vidéos d’exemple */
  const coaching = NFC.SECTORS.find((s) => s.id === 'coaching');
  if (coaching) {
    coaching.rec = 'd5';
    const P = (id, cap) => ({ src: `media/coaching/${id}.jpg`, cap });
    const V = (id, cap) => ({ url: '', src: `media/coaching/v${id}.mp4`, cover: `media/coaching/${id}.jpg`, cap });
    const d = coaching.demo;
    d.blocks.gallery = {
      on: true,
      images: [P(47417, 'Échauffement'), P(13102, 'Coaching individuel'), P(40246, 'Cross-training'), P(36831, 'Renforcement'),
        P(40270, 'Boxe'), P(36826, 'Mobilité'), P(47485, 'Musculation'), P(52114, 'Circuit training'), P(21397, 'Récupération')],
    };
    d.custom = [
      { cid: 'coachvid', type: 'vidcar', title: 'Mes séances en vidéo', videos: [V(47462, 'Séance individuelle'), V(36716, 'Entraînement en salle'), V(40270, 'Boxe fitness'), V(47417, 'Étirements guidés')] },
      { cid: 'coachimg', type: 'imgcar', title: 'Dans la salle', images: [P(36949, 'Préparation'), P(52106, 'Gainage'), P(606, 'Cardio'), P(36716, 'Plateau musculation'), P(47462, 'Suivi personnalisé')] },
    ];
    d.order = ['b:about', 'c:coachvid', 'b:programmes', 'b:gallery', 'b:methode', 'c:coachimg', 'b:planning', 'b:booking', 'b:stats', 'b:reviews', 'b:location', 'b:video', 'b:contact'];
    d.blocks.stats.on = true;
  }

  /* ---------- Bloc « Réservation » universel (outils Canada / États-Unis) ----------
     Outils conseillés par secteur (affichés en premier dans la liste) et lien d’exemple. */
  const BOOK = {
    sante: [['jane', 'zocdoc', 'simplepractice', 'cliniko', 'nexhealth'], 'https://cliniquetilleuls.janeapp.com/'],
    conseil: [['calendly', 'clio', 'acuity', 'msbookings', 'hubspot'], 'https://calendly.com/m-bennett/bilan'],
    pro: [['calendly', 'calcom', 'google', 'msbookings', 'hubspot'], 'https://calendly.com/j-hughes/30min'],
    freelance: [['calendly', 'calcom', 'acuity', 'google'], 'https://cal.com/emma-turner/decouverte'],
    immobilier: [['showingtime', 'calendly', 'acuity'], 'https://calendly.com/olivia-parker/visite'],
    archi: [['calendly', 'honeybook', 'acuity'], ''],
    artisans: [['jobber', 'housecall', 'square', 'calendly'], ''],
    beaute: [['vagaro', 'fresha', 'booksy', 'glossgenius', 'boulevard', 'square'], 'https://booksy.com/en-us/maison-reid'],
    coaching: [['mindbody', 'momence', 'glofox', 'acuity', 'calendly'], 'https://momence.com/kevin-murphy-coaching'],
    restaurant: [['opentable', 'resy', 'tock', 'sevenrooms', 'libro'], 'https://www.opentable.com/r/le-comptoir-des-halles'],
    producteurs: [['square', 'calendly'], ''],
    evenementiel: [['honeybook', 'dubsado', 'calendly'], 'https://calendly.com/collins-events/decouverte'],
    portfolio: [['honeybook', 'pixieset', 'calendly', 'acuity'], 'https://calendly.com/hannah-scott/seance'],
    musique: [['honeybook', 'calendly'], ''],
    influence: [['calendly', 'calcom'], ''],
    hebergement: [['airbnb', 'bookingcom', 'vrbo', 'cloudbeds', 'lodgify'], 'https://www.airbnb.com/rooms/mas-des-oliviers'],
    tourisme: [['fareharbor', 'peek', 'bokun', 'rezdy'], 'https://fareharbor.com/embeds/book/azurdecouvertes/'],
    animaux: [['moego', 'gingr', 'timetopet', 'square'], 'https://booking.moego.pet/ol/poils-et-pattes'],
    boutiques: [['square', 'calendly'], ''],
    auto: [['tekmetric', 'shopmonkey', 'xtime', 'square'], 'https://shopmonkey.io/book/garage-thompson'],
  };
  NFC.BOOK_RECO = {};
  NFC.SECTORS.forEach((s) => {
    if (!s.demo) return;
    const [reco, demoUrl] = BOOK[s.id] || [[], ''];
    NFC.BOOK_RECO[s.id] = reco;
    /* Les anciens blocs « Rendez-vous » deviennent des blocs Réservation */
    const keys = s.id === 'immobilier' ? ['booking', 'visite'] : ['booking'];
    s.blocks.forEach((def) => {
      if (!keys.includes(def.key) || def.type !== 'action') return;
      def.type = 'booking';
      def.help = 'Votre outil de réservation, une demande de créneau ou un SMS pré-rempli';
      const b = s.demo.blocks[def.key];
      Object.assign(b, { mode: 'tool', provider: reco[0] || '', embed: false, email: s.demo.contact.email || '', slots: '', motifs: '', phone: '', tpl: '' });
      if (demoUrl && (!b.url || /doctolib|thefork|planity|booking\.com|calendly\.com\/?$|example\.com/.test(b.url))) b.url = demoUrl;
    });
    /* Secteurs sans agenda : un bloc Réservation en « demande de créneau », à activer */
    if (!s.blocks.some((d) => d.type === 'booking')) {
      const i = s.blocks.findIndex((d) => ['hours', 'location', 'reviews', 'video'].includes(d.key));
      const bk = s.blocks.some((d) => d.key === 'booking') ? 'rdv' : 'booking';
      s.blocks.splice(i < 0 ? s.blocks.length : i, 0, { key: bk, type: 'booking', title: 'Prendre rendez-vous', cta: 'Demander un rendez-vous', icon: 'cal', help: 'Votre outil de réservation, une demande de créneau ou un SMS pré-rempli' });
      s.demo.blocks[bk] = { on: s.id === 'artisans', mode: 'request', provider: reco[0] || '', url: demoUrl, label: '', embed: false, email: s.demo.contact.email || '', slots: '', motifs: '', phone: '', tpl: '', text: s.id === 'artisans' ? 'Choisissez un jour et un moment : je vous confirme le passage pour la visite technique.' : '' };
      if (s.demo.order && s.demo.order.length) s.demo.order.push('b:' + bk);
    }
  });

  /* Pièces jointes (PDF, JPG, PNG) autorisées par défaut dans tous les formulaires */
  NFC.SECTORS.forEach((s) => {
    if (!s.demo) return;
    s.blocks.forEach((b) => { if ((b.type === 'form' || b.type === 'contact') && s.demo.blocks[b.key]) s.demo.blocks[b.key].files = true; });
  });
})();
