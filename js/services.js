/* Services et applications activables par l’administrateur (page admin.html).
   Un service désactivé n’est plus proposé aux clients dans l’éditeur ; les cartes déjà publiées le gardent.
   Maquette : la liste des services désactivés est gardée dans le navigateur (localStorage).
   Sur GoBiz, elle sera enregistrée en base et réservée à l’administrateur connecté. */
window.NFC = window.NFC || {};
(function () {
  'use strict';

  const KEY = 'nextap-admin-services';
  let off = new Set();
  try { off = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { /* stockage indisponible : tout est activé */ }

  /* Catégories et services (les outils de réservation sont ajoutés depuis VC.PROVIDERS) */
  const CATS = [
    { id: 'book', n: ['Outils de réservation', 'Booking tools'], d: ['Proposés dans la section « Prise de rendez-vous ».', 'Offered in the “Appointment booking” section.'], items: [] },
    { id: 'pay', n: ['Paiement (boutiques)', 'Payment (stores)'], d: ['Moyens que le commerçant peut cocher dans sa boutique.', 'Methods merchants can tick in their store.'], items: [
      ['cash', 'Comptant à la réception', 'Cash on pickup or delivery'], ['card', 'Carte de débit ou de crédit à la réception', 'Debit or credit card on pickup or delivery'],
      ['interac', 'Virement Interac à la réception', 'Interac e-Transfer on pickup or delivery'], ['etr', 'Virement Interac en ligne', 'Interac e-Transfer online'],
      ['stripe', 'Stripe (lien de paiement)', 'Stripe (payment link)'], ['paypal', 'PayPal (lien de paiement)', 'PayPal (payment link)'], ['zelle', 'Zelle (version anglaise)', 'Zelle (English version)'] ] },
    { id: 'order', n: ['Réception des commandes (boutiques)', 'Order channels (stores)'], d: ['Comment le commerçant reçoit les commandes.', 'How merchants receive orders.'], items: [
      ['sms', 'Texto (SMS)', 'Text message (SMS)'], ['wa', 'WhatsApp', 'WhatsApp'], ['email', 'Courriel', 'Email'] ] },
    { id: 'soc', n: ['Réseaux sociaux', 'Social networks'], d: ['Proposés dans « Réseaux sociaux » de l’éditeur.', 'Offered in the editor’s “Social networks”.'], items: [
      ['linkedin', 'LinkedIn'], ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['x', 'X (Twitter)'], ['threads', 'Threads'], ['pinterest', 'Pinterest'], ['snapchat', 'Snapchat'] ] },
    { id: 'share', n: ['Partage de la carte (visiteurs)', 'Profile sharing (visitors)'], d: ['Options du bouton « Partager » sur les cartes.', 'Options of the “Share” button on profiles.'], items: [
      ['wa', 'WhatsApp'], ['sms', 'SMS'], ['mail', 'Courriel', 'Email'], ['qr', 'QR code'], ['qrbtn', 'Bouton « Mon QR code » en bas de la carte', '“My QR code” button at the bottom of the profile'], ['copy', 'Copier le lien', 'Copy link'], ['linkedin', 'LinkedIn'], ['facebook', 'Facebook'], ['telegram', 'Telegram'], ['native', 'Partage du téléphone (« Plus… »)', 'Phone share sheet (“More…”)'] ] },
    { id: 'crm', n: ['Échange de contacts', 'Contact exchange'], d: ['Ce que reçoit la personne rencontrée, et les choix proposés au titulaire pour recevoir ses coordonnées. Le texto a un coût par message.', 'What the person met receives, and the options offered to card owners. Text messages cost per message.'], items: [
      ['sendmail', 'Envoi automatique de la carte par courriel à la personne rencontrée', 'Automatic profile email to the person met'], ['sendsms', 'Envoi automatique de la carte par texto à la personne rencontrée', 'Automatic profile text to the person met'], ['home', '« Ajouter à l’écran d’accueil »', '“Add to home screen”'],
      ['email', 'Courriel à chaque nouveau contact', 'Email for each new contact'], ['phone', '« Ajouter à mes contacts »', '“Add to my contacts”'], ['mini', 'Mini-CRM NexTap', 'NexTap mini-CRM'],
      ['excel', 'Télécharger en Excel', 'Download as Excel'], ['sheets', 'Google Sheets', 'Google Sheets'], ['hubspot', 'HubSpot', 'HubSpot'], ['ghl', 'GoHighLevel', 'GoHighLevel'], ['zoho', 'Zoho CRM', 'Zoho CRM'], ['pipedrive', 'Pipedrive', 'Pipedrive'] ] },
    { id: 'google', n: ['Google', 'Google'], d: ['Services Google affichés sur les cartes.', 'Google services shown on profiles.'], items: [
      ['maps', 'Google Maps (plan intégré)', 'Google Maps (embedded map)'], ['reviews', 'Avis Google (section)', 'Google reviews (section)'], ['remind', 'Rappel « Laissez-nous un avis » (courriel ou texto, après un délai)', '“Leave us a review” reminder (email or text, after a delay)'] ] },
    { id: 'ai', n: ['Intelligence artificielle', 'Artificial intelligence'], d: ['Fonctions qui utilisent l’IA.', 'Features that use AI.'], items: [
      ['edit', 'Bouton « Éditer avec l’IA »', '“Edit with AI” button'], ['scan', 'Scan d’une carte de visite papier', 'Paper business card scan'] ] },
  ];

  NFC.svc = {
    KEY, CATS,
    /* Le service est-il proposé ? (identifiant « catégorie:service », ex. « book:calendly ») */
    on: (id) => !off.has(id),
    set(id, isOn) { if (isOn) off.delete(id); else off.add(id); this.save(); },
    save() { try { localStorage.setItem(KEY, JSON.stringify([...off])); } catch (e) { /* rien */ } },
    offList: () => [...off],
    /* Liste complète, avec les outils de réservation du moteur de cartes */
    all() {
      const book = (window.VC && VC.PROVIDERS ? VC.PROVIDERS : []).map((p) => [p.id, p.name]);
      return CATS.map((c) => Object.assign({}, c, { items: c.id === 'book' ? book : c.items }));
    },
  };
})();

/* ---------- Autres réglages de l’administrateur (NFC.cfg) ----------
   Un seul objet enregistré ; chaque valeur a une valeur par défaut. Les modifications sont journalisées. */
(function () {
  'use strict';
  const KEY = 'nextap-admin-config';
  const plan = (sections, photos, products, o) => Object.assign({ sections, photos, products, profiles: 5, docs: 5, bili: true, video: true, shop: true, online: true, ai: true, domain: false, size: 10 }, o || {});
  const DEF = {
    sectors: { off: [], soon: [], order: [] },
    profOff: [],
    designsOff: [], rec: {},
    catOff: [],
    jobs: [],
    plans: {
      gratuit: plan(2, 4, 5, { docs: 1, bili: false, video: false, online: false, ai: false, size: 5 }),
      pro: plan(6, 12, 30, { ai: false }),
      premium: plan(20, 40, 200, { docs: 20, domain: true, size: 25 }),
    },
    planSim: 'premium',
    brand: { studio: '', stores: '', footCards: '', footStores: '', hideFoot: [], linkBase: '' },
    shop: { url: '', var: { gratuit: '', pro: '', premium: '' } },
    storeDef: { tax: '', currency: 'CAD', fee: '', freeFrom: '', maxCats: '', dine: false, pick: true, ship: true },
    lang: { bili: true, market: 'auto', reword: [] },
    ai: { quota: 20 },
    privacy: { consent: false, mapClick: false, policyUrl: '', retention: 24 },
    suspended: [],
    log: [],
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let C = {};
  try { C = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { C = {}; }
  const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
  NFC.cfg = {
    KEY, DEF,
    get(path, d) {
      const v = getP(C, path);
      if (v !== undefined) return v;
      const dv = getP(DEF, path);
      return dv !== undefined ? clone(dv) : d;
    },
    set(path, v, label) {
      const ks = path.split('.'), last = ks.pop();
      let o = C;
      ks.forEach((k) => { if (o[k] == null || typeof o[k] !== 'object') o[k] = clone(getP(DEF, ks.slice(0, ks.indexOf(k) + 1).join('.')) || {}); o = o[k]; });
      o[last] = v;
      if (label) { C.log = (C.log || []).slice(-199); C.log.push({ t: new Date().toISOString(), w: label }); }
      try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) { /* rien */ }
    },
    reset() { C = {}; try { localStorage.removeItem(KEY); } catch (e) { /* rien */ } },
    /* Forfait utilisé pour l’aperçu (sur GoBiz : le forfait réel du client) */
    plan() { const p = this.get('plans'), k = this.get('planSim'); return p[k] || p.premium; },
  };
  /* Le service « book:… », « pay:… » est aussi soumis au forfait pour le paiement en ligne */
})();

/* ---------- Palettes de couleurs ajoutées par l’administrateur ----------
   Liste d’une carte = palettes d’origine + palettes ajoutées (dans cet ordre, sans jamais rien retirer),
   pour que le numéro de palette d’une carte existante reste toujours le même.
   Désactiver ou supprimer une palette la retire seulement du choix proposé aux clients. */
(function () {
  'use strict';
  const hx = (h) => [0, 2, 4].map((i) => parseInt(String(h).slice(1).substr(i, 2), 16) || 0);
  const mix = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  NFC.fullPal = (name, p, a) => ({ name, p, a, bg: mix(p, '#ffffff', 0.955), sf: '#ffffff', tx: mix(p, '#0b0b0f', 0.86), mu: mix(p, '#6b6b72', 0.8), ln: mix(p, '#ffffff', 0.87), added: true });
  NFC.palKey = (s) => (s ? s.id + (s.profile ? '~' + s.profile.id : '') : '');
  NFC.palsOf = (s) => {
    if (!s) return [];
    const add = NFC.cfg ? (NFC.cfg.get('palAdd', {})[NFC.palKey(s)] || []) : [];
    return (s.palettes || []).concat(add.map((x) => NFC.fullPal(x.name, x.p, x.a)));
  };
  /* État d’une palette pour le choix : 'on', 'off' (désactivée) ou 'del' (supprimée) */
  NFC.palState = (s, i) => {
    if (!NFC.cfg) return 'on';
    const k = NFC.palKey(s);
    if ((NFC.cfg.get('palDel', {})[k] || []).includes(i)) return 'del';
    if ((NFC.cfg.get('palOff', {})[k] || []).includes(i)) return 'off';
    return 'on';
  };
  /* Mode administrateur dans les studios : boutons de gestion visibles (jamais pour les clients sur GoBiz) */
  try {
    const q = new URLSearchParams(location.search).get('admin');
    if (q === '1' || q === '0') NFC.cfg.set('adminMode', q === '1', q === '1' ? 'Mode administrateur activé' : 'Mode administrateur désactivé');
  } catch (e) { /* rien */ }
  NFC.isAdmin = () => !!(NFC.cfg && NFC.cfg.get('adminMode', false));
  /* Onglets des produits NexTap en haut de page : cartes | boutiques (| admin, pour l’administrateur seulement).
     Libellés courts sur téléphone : Cartes / Boutiques / Admin. */
  NFC.prodTabs = (cur, root) => {
    const g = (p, d) => NFC.cfg.get(p, '') || d;
    const T = [['cards', root || './', g('brand.studio', 'NexTap Studio'), 'Cartes'], ['stores', (root || '') + 'stores/', g('brand.stores', 'NexTap Studio – Stores'), 'Boutiques']];
    /* Visible pour l’administrateur : mode administrateur actif, ou admin déjà ouverte dans ce navigateur (sur GoBiz : administrateur connecté) */
    if (cur === 'admin' || NFC.isAdmin() || NFC.cfg.get('admTab', false)) T.push(['admin', (root || '') + 'admin.html', 'Admin NexTap Studio', 'Admin']);
    return `<nav class="ptabs" aria-label="Produits NexTap">${T.map(([k, h, l, s]) => `<a href="${h}" class="${k === cur ? 'on' : ''}${k === 'admin' ? ' adm' : ''}" ${k === cur ? 'aria-current="page"' : ''} data-ptab="${k}"><span class="pt-l">${l}</span><span class="pt-s">${s}</span></a>`).join('')}</nav>`;
  };
})();
