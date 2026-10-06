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
      ['wa', 'WhatsApp'], ['sms', 'SMS'], ['mail', 'Courriel', 'Email'], ['qr', 'QR code'], ['copy', 'Copier le lien', 'Copy link'], ['linkedin', 'LinkedIn'], ['facebook', 'Facebook'], ['telegram', 'Telegram'], ['native', 'Partage du téléphone (« Plus… »)', 'Phone share sheet (“More…”)'] ] },
    { id: 'google', n: ['Google', 'Google'], d: ['Services Google affichés sur les cartes.', 'Google services shown on profiles.'], items: [
      ['maps', 'Google Maps (plan intégré)', 'Google Maps (embedded map)'], ['reviews', 'Avis Google (section)', 'Google reviews (section)'] ] },
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
