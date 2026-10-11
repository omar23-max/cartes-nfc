/* Assistant d’aide (maquette, site test) : bulle « Besoin d’aide ? » dans les deux studios.
   Réponses simulées tirées d’une petite base de questions-réponses ; sur la vraie plateforme,
   l’API Claude répondra côté serveur à partir de la même base, avec relais vers un humain.
   Jamais sur les cartes publiques. Aucune donnée n’est envoyée nulle part sur le site test. */
(function () {
  'use strict';
  const stores = /\/stores\//.test(location.pathname);
  const en = () => {
    try { return (JSON.parse(localStorage.getItem(stores ? 'nfc-stores-v1' : 'nfc-studio-v6') || '{}').ui) === 'en'; } catch (e) { return false; }
  };
  const T = (fr, eng) => (en() ? eng : fr);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* Base de questions-réponses : mots-clés (sans accents) → réponse FR / EN */
  const KB = [
    { k: ['version', 'nouvelle version', 'plusieurs', 'profil'], q: ['Comment ajouter une version ?', 'How do I add a version?'],
      a: ['Dans l’éditeur, touchez « Versions », puis « Nouvelle version ». Donnez-lui un nom (ex. « Été ») et choisissez carte de visite ou boutique. Votre carte garde le même lien et le même QR code : vous choisissez ensuite quelle version elle affiche.',
        'In the editor, tap “Versions”, then “New version”. Name it (e.g. “Summer”) and choose business card or store. Your card keeps the same link and QR code: you then choose which version it shows.'] },
    { k: ['active', 'activer', 'afficher', 'publier', 'en ligne', 'live'], q: ['Quelle version voient mes clients ?', 'Which version do my clients see?'],
      a: ['Vos clients voient la version active (pastille verte « Active »). Quand vous touchez « Publier » sur une version, elle devient active. Vous pouvez aussi changer de version active à tout moment, d’un toucher, à l’étape Publication ou dans la barre du titulaire.',
        'Your clients see the active version (green “Active” badge). When you tap “Publish” on a version, it becomes active. You can also switch the active version anytime, with one tap, at the Publish step or in the owner bar.'] },
    { k: ['ecran', 'accueil', 'raccourci', 'home', 'shortcut', 'titulaire', 'owner'], q: ['Comment mettre ma carte sur mon écran d’accueil ?', 'How do I add my card to my home screen?'],
      a: ['Après le paiement, à l’étape Publication, touchez « Mettre sur mon écran d’accueil ». Sur Android : menu ⋮ de Chrome → « Ajouter à l’écran d’accueil » ou « Installer et créer un raccourci » → « Créer un raccourci ». Sur iPhone : bouton Partager de Safari → « Sur l’écran d’accueil ». Une seule fois suffit : vos nouvelles versions y apparaissent automatiquement.',
        'After payment, at the Publish step, tap “Add to my home screen”. On Android: Chrome ⋮ menu → “Add to Home screen” or “Install and create shortcut” → “Create shortcut”. On iPhone: Safari Share button → “Add to Home Screen”. Once is enough: your new versions show up there automatically.'] },
    { k: ['masque', 'flou', 'lien', 'qr', 'apercu', 'link', 'blur', 'hidden'], q: ['Pourquoi mon lien et mon QR code sont masqués ?', 'Why are my link and QR code hidden?'],
      a: ['Avant le paiement, le lien et le QR code sont masqués pour qu’ils ne circulent pas avant l’activation de la carte. Dès le paiement, ils se débloquent et vous sont envoyés par courriel, avec l’affiche à imprimer.',
        'Before payment, the link and QR code are hidden so they don’t circulate before the card is activated. As soon as you pay, they unlock and are emailed to you, along with the printable poster.'] },
    { k: ['commande', 'commander', 'payer', 'paiement', 'prix', 'forfait', 'order', 'pay', 'plan', 'price'], q: ['Comment commander ma carte NFC ?', 'How do I order my NFC card?'],
      a: ['À l’étape Publication, choisissez un forfait puis touchez « Commander ma carte NFC ». Vous payez sur notre boutique Shopify, en toute sécurité. Votre carte est enregistrée : vous la retrouvez telle quelle après le paiement.',
        'At the Publish step, choose a plan and tap “Order my NFC card”. You pay securely on our Shopify store. Your card is saved: you’ll find it unchanged after payment.'] },
    { k: ['livraison', 'delai', 'expedition', 'recu', 'ou en est', 'shipping', 'delivery', 'track'], q: ['Où en est ma commande ?', 'Where is my order?'],
      a: ['Sur la vraie plateforme, je consulterai le statut de votre commande dans Shopify (en fabrication, expédiée, livrée). Sur le site test, les commandes sont simulées.',
        'On the real platform, I’ll check your order status in Shopify (in production, shipped, delivered). On the test site, orders are simulated.'] },
    { k: ['reprogrammer', 'modifier', 'changer', 'puce', 'nfc', 'edit', 'change', 'chip'], q: ['Faut-il reprogrammer la carte si je la modifie ?', 'Do I need to reprogram the card if I edit it?'],
      a: ['Non. La puce NFC est programmée une seule fois avec votre lien. Vous modifiez votre carte quand vous voulez (textes, photos, modèle, couleurs, versions) : le lien et le QR code restent les mêmes.',
        'No. The NFC chip is programmed only once with your link. Edit your card anytime (texts, photos, template, colors, versions): the link and QR code stay the same.'] },
    { k: ['iphone', 'android', 'compatible', 'telephone', 'phone'], q: ['Ça marche avec tous les téléphones ?', 'Does it work with all phones?'],
      a: ['Oui : la plupart des iPhone récents et des téléphones Android lisent la puce NFC d’un simple toucher. Sinon, votre contact scanne le QR code avec son appareil photo. Aucune application n’est nécessaire.',
        'Yes: most recent iPhones and Android phones read the NFC chip with a simple tap. Otherwise, your contact scans the QR code with their camera. No app needed.'] },
    { k: ['contact', 'coordonnees', 'leads', 'crm', 'recevoir'], q: ['Comment je reçois les contacts ?', 'How do I receive contacts?'],
      a: ['Quand un visiteur enregistre votre contact, il peut vous laisser ses coordonnées. Vous les recevez comme vous l’avez choisi dans « Échange de contacts » : courriel, mini-CRM, Excel, Google Sheets ou votre CRM.',
        'When a visitor saves your contact, they can leave you their details. You receive them the way you chose in “Contact exchange”: email, mini-CRM, Excel, Google Sheets or your CRM.'] },
  ];
  const SUGG = [0, 2, 3, 4];

  let open = false, step = 'chat', log = [];
  const box = document.createElement('div');
  box.className = 'hb no-tr no-rw';
  document.body.appendChild(box);

  function answer(text) {
    const t = norm(text);
    let best = null, score = 0;
    KB.forEach((x) => { const s = x.k.filter((w) => t.includes(norm(w))).length; if (s > score) { score = s; best = x; } });
    return best;
  }
  function say(who, html) { log.push({ who, html }); }
  function ask(text) {
    if (!text.trim()) return;
    say('me', esc(text));
    const b = answer(text);
    if (b) say('bot', esc(en() ? b.a[1] : b.a[0]) + `<div class="hb-more"><button type="button" data-hb="human">${T('Parler à un humain', 'Talk to a person')}</button></div>`);
    else say('bot', esc(T('Je ne suis pas sûr de bien comprendre. Je peux transmettre votre question à notre équipe.', 'I’m not sure I understand. I can pass your question on to our team.')) + `<div class="hb-more"><button type="button" data-hb="human">${T('Parler à un humain', 'Talk to a person')}</button></div>`);
    draw();
  }

  function draw() {
    if (!open) {
      box.innerHTML = `<button type="button" class="hb-fab" data-hb="open" aria-label="${T('Besoin d’aide ?', 'Need help?')}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>${T('Aide', 'Help')}</span></button>`;
      return;
    }
    const msgs = log.map((m) => `<div class="hb-m ${m.who}">${m.html}</div>`).join('');
    const body = step === 'human'
      ? `<form class="hb-h" data-hb-form>
          <p>${T('Laissez votre courriel et votre question : notre équipe vous répond, en général dans la journée.', 'Leave your email and your question: our team replies, usually within the day.')}</p>
          <input name="e" type="email" required autocomplete="email" placeholder="${T('nom@exemple.com', 'name@example.com')}">
          <textarea name="q" rows="3" required placeholder="${T('Votre question', 'Your question')}"></textarea>
          <div class="hb-hb"><button type="submit" class="hb-send">${T('Envoyer', 'Send')}</button><button type="button" data-hb="back">${T('Retour', 'Back')}</button></div>
          <small>${T('Site test : rien n’est envoyé. Sur la vraie plateforme, votre demande et cette conversation iront à notre équipe (mode assistance de l’admin).', 'Test site: nothing is sent. On the real platform, your request and this conversation will go to our team (admin assistance mode).')}</small>
        </form>`
      : `<div class="hb-s">${SUGG.map((i) => `<button type="button" data-hb-q="${i}">${esc(en() ? KB[i].q[1] : KB[i].q[0])}</button>`).join('')}</div>
        <form class="hb-in" data-hb-ask><input name="t" autocomplete="off" placeholder="${T('Posez votre question…', 'Ask your question…')}" aria-label="${T('Votre question', 'Your question')}"><button type="submit" aria-label="${T('Envoyer', 'Send')}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button></form>`;
    box.innerHTML = `<div class="hb-p" role="dialog" aria-label="${T('Aide NexTap', 'NexTap help')}">
      <div class="hb-top"><div><b>${T('Aide NexTap', 'NexTap help')}</b><small>${T('Assistant automatique · simulé sur le site test', 'Automated assistant · simulated on the test site')}</small></div><button type="button" class="hb-x" data-hb="close" aria-label="${T('Fermer', 'Close')}">×</button></div>
      <div class="hb-log">${msgs || `<div class="hb-m bot">${esc(T('Bonjour ! Je réponds aux questions sur NexTap Studio : versions, publication, écran d’accueil, commande… Choisissez une question ou écrivez la vôtre.', 'Hi! I answer questions about NexTap Studio: versions, publishing, home screen, ordering… Pick a question or type your own.'))}</div>`}</div>
      ${body}
    </div>`;
    const lg = box.querySelector('.hb-log'); if (lg) lg.scrollTop = lg.scrollHeight;
    const inp = box.querySelector('[data-hb-ask] input, [data-hb-form] input'); if (inp && !matchMedia('(pointer: coarse)').matches) inp.focus({ preventScroll: true }); /* pas de clavier qui surgit sur téléphone */
  }

  box.addEventListener('click', (e) => {
    const t = e.target.closest('[data-hb], [data-hb-q]');
    if (!t) return;
    if (t.dataset.hbQ !== undefined) { const x = KB[+t.dataset.hbQ]; ask(en() ? x.q[1] : x.q[0]); return; }
    const a = t.dataset.hb;
    if (a === 'open') { open = true; step = 'chat'; }
    else if (a === 'close') open = false;
    else if (a === 'human') step = 'human';
    else if (a === 'back') step = 'chat';
    draw();
  });
  box.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.matches('[data-hb-ask]')) { const v = f.t.value; f.t.value = ''; ask(v); return; }
    if (f.matches('[data-hb-form]')) {
      if (!f.e.checkValidity() || !f.q.value.trim()) { f.reportValidity(); return; }
      step = 'chat';
      say('bot', esc(T('Merci ! Votre demande est transmise à notre équipe (simulé sur le site test). Vous recevrez la réponse par courriel.', 'Thanks! Your request has been passed on to our team (simulated on the test site). You’ll get the answer by email.')));
      draw();
    }
  });
  /* Changement de langue du studio : la bulle suit */
  document.addEventListener('click', (e) => { if (e.target.closest('[data-act="ui"]')) setTimeout(draw, 0); });
  draw();
})();
