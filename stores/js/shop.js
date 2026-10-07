/* NFC Card Studio – Stores : la section « Boutique » (catalogue, fiche produit, panier, commande).
   Le propriétaire choisit comment il reçoit les commandes : SMS, WhatsApp, courriel, ou paiement en ligne
   (son propre lien Stripe, Square, PayPal…). Branché sur le moteur du studio par VC.S et NFC_APP.editors. */
(function () {
  'use strict';

  const { ic, esc } = VC;
  const L2 = VC.L2, lg = () => VC.lg();

  /* ---------- Prix et taxes ---------- */
  const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, '')); return isFinite(n) ? n : 0; };
  const money = (n) => { const o = { minimumFractionDigits: 2, maximumFractionDigits: 2 }; return lg() === 'en' ? '$' + n.toLocaleString('en-US', o) : n.toLocaleString('fr-CA', o) + ' $'; };
  const priceOf = (x) => (num(x.sp) > 0 && num(x.sp) < num(x.p) ? num(x.sp) : num(x.p));
  /* Régime de taxes de la boutique : [code, libellé fr, libellé en, taux] */
  const TAX = {
    qc: () => [['tps', 'TPS (5 %)', 'GST (5%)', 0.05], ['tvq', 'TVQ (9,975 %)', 'QST (9.975%)', 0.09975]],
    on: () => [['tvh', 'TVH (13 %)', 'HST (13%)', 0.13]],
    tps: () => [['tps', 'TPS (5 %)', 'GST (5%)', 0.05]],
    us: (b) => (num(b.rate) > 0 ? [['us', `Taxe de vente (${b.rate} %)`, `Sales tax (${b.rate}%)`, num(b.rate) / 100]] : []),
    none: () => [],
  };
  /* Taxe propre à un produit : '' = taxable, 'tps' = TPS seulement (ex. livres au Québec), 'none' = non taxé (ex. aliments de base) */
  const TX_OPT = {
    qc: [['', 'Taxable (TPS + TVQ)', 'Taxable (GST + QST)'], ['tps', 'TPS seulement (ex. livres)', 'GST only (e.g. books)'], ['none', 'Non taxé (ex. aliments de base)', 'Tax-free (e.g. basic groceries)']],
    on: [['', 'Taxable (TVH)', 'Taxable (HST)'], ['none', 'Non taxé', 'Tax-free']],
    tps: [['', 'Taxable (TPS)', 'Taxable (GST)'], ['none', 'Non taxé', 'Tax-free']],
    us: [['', 'Taxable', 'Taxable'], ['none', 'Non taxé', 'Tax-free']],
  };
  const taxedBy = (b, x, code) => (x.tx === 'none' ? false : x.tx === 'tps' && b.tax === 'qc' ? code === 'tps' : true);
  const taxNote = (b, x) => (!b.tax || b.tax === 'none' ? '' : x.tx === 'none' ? L2('Non taxé', 'Tax-free') : x.tx === 'tps' && b.tax === 'qc' ? L2('TPS seulement', 'GST only') : '');
  const cats = (b) => String(b.cats || '').split(',').map((c) => c.trim()).filter(Boolean);
  const opts = (x) => String(x.o || '').split(',').map((c) => c.trim()).filter(Boolean);
  const items = (b) => (b.items || []).filter((x) => x.t);
  const digits = (p) => String(p || '').replace(/\D/g, '');

  /* ---------- Moyens de paiement ----------
     À la réception (paiement à la livraison ou au ramassage) : comptant, carte, virement Interac.
     En ligne : Stripe et PayPal (lien de paiement du commerçant), virement Interac envoyé avant la réception. */
  const PAY_OFF = [
    ['cash', 'Comptant à la réception', 'Cash on pickup or delivery', 'Comptant', 'Cash'],
    ['card', 'Carte de débit ou de crédit à la réception', 'Debit or credit card on pickup or delivery', 'Carte', 'Card'],
    ['interac', 'Virement Interac à la réception', 'Interac e-Transfer on pickup or delivery', 'Interac', 'Interac'],
  ];
  const PAY_ON = [['stripe', 'Stripe', 'https://buy.stripe.com/…'], ['paypal', 'PayPal', 'https://paypal.me/…']];
  /* Moyens proposés au client : cochés par le commerçant (Stripe et PayPal seulement avec leur lien) */
  function payOf(b) {
    const p = b.pay || { cash: true, card: true }, links = b.payLinks || {}, info = b.payInfo || {};
    const list = PAY_OFF.filter(([k]) => p[k]).map(([k, fr, en, sf, se]) => ({ k, l: L2(fr, en), s: L2(sf, se) }))
      .concat(PAY_ON.filter(([k]) => p[k] && links[k]).map(([k, n]) => ({ k, l: L2(`${n} · paiement en ligne`, `${n} · online payment`), s: n, url: links[k] })));
    if (p.zelle && info.zelle) list.push({ k: 'zelle', l: L2('Zelle, avant la réception', 'Zelle, before pickup or delivery'), s: 'Zelle', info: info.zelle });
    if (p.etr && info.interac) list.push({ k: 'etr', l: L2('Virement Interac en ligne, avant la réception', 'Interac e-Transfer online, before pickup or delivery'), s: 'Interac', info: info.interac });
    /* Ancienne option « Paiement en ligne » avec un seul lien */
    if (b.order === 'online' && b.payUrl && !list.some((x) => x.url)) list.push({ k: 'link', l: L2('Paiement en ligne', 'Online payment'), s: L2('En ligne', 'Online'), url: b.payUrl });
    return list;
  }
  const payShort = (b) => [...new Set(payOf(b).map((x) => x.s))].join(' · ');

  /* ---------- Réception : sur place, à emporter (ou ramassage en boutique), livraison ---------- */
  const pickL = (b) => (b.food ? L2('À emporter', 'Takeout') : L2('Ramassage en boutique', 'In-store pickup'));
  function recvModes(b) {
    const r = [];
    if (b.dinein) r.push(['dine', L2('Sur place', 'Dine in'), L2('Commande servie à table', 'Served at your table')]);
    if (b.pickup !== false) r.push(['pick', pickL(b), L2('Gratuit', 'Free')]);
    if (b.delivery) r.push(['ship', L2('Livraison', 'Delivery'), num(b.fee) ? money(num(b.fee)) + (num(b.freeFrom) ? L2(` · gratuite dès ${money(num(b.freeFrom))}`, ` · free over ${money(num(b.freeFrom))}`) : '') : L2('Gratuite', 'Free')]);
    return r.length ? r : [['pick', pickL(b), L2('Gratuit', 'Free')]];
  }

  /* ---------- Panier (gardé le temps de la visite) ---------- */
  let CART = [];
  try { CART = JSON.parse(sessionStorage.getItem('nfc-cart') || '[]'); } catch (e) { /* stockage indisponible */ }
  const keep = () => { try { sessionStorage.setItem('nfc-cart', JSON.stringify(CART)); } catch (e) { /* rien */ } };

  /* Retrouve la section boutique de la carte affichée */
  function shopOf(m) {
    const def = m.sec.blocks.find((d) => d.type === 'shop');
    return def ? { def, b: m.card.blocks[def.key] || {} } : null;
  }
  /* Ligne de panier → produit actuel (le nom sert de repère si l’ordre des produits change) */
  const lineItem = (b, l) => items(b).find((x) => x.t === l.t);
  /* Chaque boutique ne compte que ses propres articles */
  const count = (b) => CART.filter((l) => lineItem(b, l)).reduce((a, l) => a + l.q, 0);
  const refreshBadges = (root, b) => (root || document).querySelectorAll('.shp-n').forEach((n) => { n.textContent = count(b); n.hidden = !count(b); });

  /* ---------- Rendu dans la carte ---------- */
  VC.S.shop = function (def, b, m) {
    const list = items(b);
    if (!list.length) return '';
    const cs = cats(b).filter((c) => list.some((x) => x.cat === c));
    const chips = cs.length > 1 ? `<div class="shp-cats" role="tablist"><button type="button" class="on" data-vc="shcat" data-c="">${L2('Tout', 'All')}</button>${cs.map((c) => `<button type="button" data-vc="shcat" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : '<span></span>';
    const tile = (x) => {
      const i = (b.items || []).indexOf(x), sale = priceOf(x) < num(x.p);
      return `<button type="button" class="shp-it" data-vc="prod" data-i="${i}" data-cat="${esc(x.cat || '')}">
        <span class="shp-im">${x.img ? `<img src="${VC.img(x.img, m)}" alt="" loading="lazy">` : ''}${x.b ? `<span class="shp-b${sale ? ' sale' : ''}">${esc(x.b)}</span>` : ''}</span>
        <span class="shp-t">${esc(x.t)}</span>${x.d ? `<span class="shp-d">${esc(x.d)}</span>` : ''}
        <span class="shp-p">${num(x.p) ? `${sale ? `<s>${money(num(x.p))}</s>` : ''}<b>${money(priceOf(x))}</b>` : ''}</span></button>`;
    };
    const how = recvModes(b).map((x) => x[1]).join(' · ');
    return `<div class="shp" data-k="${def.key}">${b.text ? `<p class="txt">${VC.nl(b.text)}</p>` : ''}
      <div class="shp-bar">${chips}<button type="button" class="shp-cart" data-vc="cart" aria-label="${L2('Panier', 'Cart')}">${ic('bag', 18)}<span class="shp-n"${count(b) ? '' : ' hidden'}>${count(b)}</span></button></div>
      <div class="shp-grid">${list.map(tile).join('')}</div>
      ${how ? `<p class="shp-how">${ic('check', 14)}<span>${how}</span></p>` : ''}${payOf(b).length ? `<p class="shp-how">${ic('bag', 14)}<span>${L2('Paiement :', 'Payment:')} ${esc(payShort(b))}</span></p>` : ''}</div>`;
  };

  /* ---------- Fenêtres : fiche produit et panier ---------- */
  function sheet(from, html, cls) {
    const o = VC.overlay(from, 'ov-shop ' + (cls || ''));
    o.ov.innerHTML = `<div class="vc-ov-in"><div class="shs">${html}</div></div>`;
    return o;
  }

  function openProduct(t, m) {
    const sh = shopOf(m);
    if (!sh) return;
    const { b } = sh, x = (b.items || [])[+t.dataset.i];
    if (!x) return;
    const os = opts(x), sale = priceOf(x) < num(x.p);
    let o = os.length === 1 ? os[0] : '', q = 1;
    const { ov, close } = sheet(t, `<button type="button" class="ov-x shs-x" aria-label="${L2('Fermer', 'Close')}">${ic('x', 18)}</button>
      ${x.img ? `<div class="shs-im"><img src="${VC.img(x.img, m)}" alt="">${x.b ? `<span class="shp-b${sale ? ' sale' : ''}">${esc(x.b)}</span>` : ''}</div>` : ''}
      <div class="shs-b">
        ${x.cat ? `<p class="shs-cat">${esc(x.cat)}</p>` : ''}
        <h3>${esc(x.t)}</h3>
        <p class="shs-p">${sale ? `<s>${money(num(x.p))}</s>` : ''}<b>${money(priceOf(x))}</b>${taxNote(b, x) ? `<span class="shs-tx">${taxNote(b, x)}</span>` : ''}</p>
        ${x.l || x.d ? `<p class="shs-l">${VC.nl(x.l || x.d)}</p>` : ''}
        ${os.length ? `<p class="shs-lb">${L2('Choisissez', 'Choose')}</p><div class="shs-o">${os.map((v) => `<button type="button" data-o="${esc(v)}" class="${o === v ? 'on' : ''}">${esc(v)}</button>`).join('')}</div>` : ''}
        <div class="shs-row"><div class="qty"><button type="button" data-q="-1" aria-label="${L2('Moins', 'Less')}">−</button><span>1</span><button type="button" data-q="1" aria-label="${L2('Plus', 'More')}">+</button></div>
          <button type="button" class="btn shs-add">${ic('bag', 18)}<span>${L2('Ajouter au panier', 'Add to cart')}</span></button></div>
        <p class="shs-msg" role="status"></p>
      </div>`, 'ov-prod');
    ov.addEventListener('click', (e) => {
      const ob = e.target.closest('[data-o]'), qb = e.target.closest('[data-q]');
      if (ob) { o = ob.dataset.o; ov.querySelectorAll('[data-o]').forEach((z) => z.classList.toggle('on', z === ob)); ov.querySelector('.shs-msg').textContent = ''; }
      else if (qb) { q = Math.max(1, Math.min(20, q + +qb.dataset.q)); ov.querySelector('.qty span').textContent = q; }
      else if (e.target.closest('.shs-add')) {
        if (os.length && !o) { ov.querySelector('.shs-msg').textContent = L2('Choisissez d’abord une option.', 'Please choose an option first.'); return; }
        const same = CART.find((l) => l.t === x.t && l.o === o);
        if (same) same.q += q; else CART.push({ t: x.t, o, q });
        keep();
        refreshBadges(t.closest('.vc'), b);
        close();
        toastIn(t.closest('.vc'), L2('Ajouté au panier', 'Added to cart'));
      }
    });
  }

  function toastIn(vc, msg) {
    if (!vc) return;
    const el = document.createElement('div');
    el.className = 'shp-toast';
    el.innerHTML = `${ic('check', 16)}<span>${esc(msg)}</span>`;
    const sc = vc.closest('[data-vc-scroll]');
    el.style.top = sc ? sc.scrollTop + 14 + 'px' : '';
    if (!sc) el.style.position = 'fixed';
    vc.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  function openCart(t, m) {
    const sh = shopOf(m);
    if (!sh) return;
    const { b } = sh, shopName = String((m.card.identity || {}).name || '').trim();
    const c = m.card.contact || {};
    const MODES = recvModes(b);
    let mode = MODES[0][0];
    const pays = payOf(b);
    let pay = pays[0] ? pays[0].k : '';
    const payNow = () => pays.find((x) => x.k === pay);
    const way = b.order === 'wa' ? 'wa' : b.order === 'email' ? 'email' : 'sms';
    const { ov, close } = sheet(t, '', 'ov-cart');
    const box = ov.querySelector('.shs');

    const totals = () => {
      const lines = CART.map((l) => ({ l, x: lineItem(b, l) })).filter((r) => r.x);
      const sub = lines.reduce((a, r) => a + priceOf(r.x) * r.l.q, 0);
      const fee = mode === 'ship' && !(num(b.freeFrom) && sub >= num(b.freeFrom)) ? num(b.fee) : 0;
      /* Chaque taxe porte seulement sur les produits concernés (et sur la livraison) */
      const taxes = (TAX[b.tax] || TAX.none)(b).map(([code, fr, en, r]) => [L2(fr, en), (lines.filter((rr) => taxedBy(b, rr.x, code)).reduce((a, rr) => a + priceOf(rr.x) * rr.l.q, 0) + fee) * r]).filter((t) => t[1] > 0);
      return { lines, sub, fee, taxes, total: sub + fee + taxes.reduce((a, x) => a + x[1], 0) };
    };
    const draw = () => {
      const T = totals();
      if (!T.lines.length) {
        box.innerHTML = `<button type="button" class="ov-x shs-x" aria-label="${L2('Fermer', 'Close')}">${ic('x', 18)}</button><div class="shs-b shc-empty">${ic('bag', 30)}<h3>${L2('Votre panier est vide', 'Your cart is empty')}</h3><p>${L2('Touchez un produit pour l’ajouter.', 'Tap a product to add it.')}</p><button type="button" class="btn ov-x">${L2('Voir les produits', 'Browse products')}</button></div>`;
        return;
      }
      const f = (k) => { const el = box.querySelector(`[name=${k}]`); return el ? el.value : ''; };
      const keepVals = { nom: f('nom'), tel: f('tel'), adr: f('adr'), note: f('note') };
      const row = (l, v, cls = '') => `<div class="shc-t ${cls}"><span>${l}</span><span>${v}</span></div>`;
      const P = payNow(), online = !!(P && P.url);
      const sendL = online ? L2(`Payer ${money(T.total)} en ligne`, `Pay ${money(T.total)} online`) : { sms: L2('Envoyer ma commande par texto', 'Send my order by text'), wa: L2('Envoyer ma commande sur WhatsApp', 'Send my order on WhatsApp'), email: L2('Envoyer ma commande par courriel', 'Send my order by email') }[way];
      const sendI = online ? 'bag' : { sms: 'sms', wa: 'wa', email: 'mail' }[way];
      box.innerHTML = `<button type="button" class="ov-x shs-x" aria-label="${L2('Fermer', 'Close')}">${ic('x', 18)}</button>
        <div class="shs-b"><h3>${L2('Mon panier', 'My cart')}</h3>
        <div class="shc-l">${T.lines.map(({ l, x }, k) => `<div class="shc-i">${x.img ? `<img src="${VC.img(x.img, m)}" alt="">` : '<span></span>'}<div class="shc-m"><b>${esc(x.t)}</b>${l.o ? `<span>${esc(l.o)}</span>` : ''}<span>${money(priceOf(x))}</span></div>
          <div class="qty sm"><button type="button" data-lq="-1" data-k="${k}" aria-label="${L2('Moins', 'Less')}">−</button><span>${l.q}</span><button type="button" data-lq="1" data-k="${k}" aria-label="${L2('Plus', 'More')}">+</button></div></div>`).join('')}</div>
        ${MODES.length > 1 ? `<div class="shc-mode n${MODES.length}" role="group">${MODES.map(([v, l, d]) => `<button type="button" data-mode="${v}" class="${mode === v ? 'on' : ''}"><b>${l}</b><span>${d}</span></button>`).join('')}</div>` : ''}
        ${mode === 'ship' && b.zone ? `<p class="shc-z">${ic('pin', 14)}<span>${L2('Zone de livraison', 'Delivery area')} : ${esc(b.zone)}</span></p>` : ''}
        <div class="shc-f">
          <input name="nom" placeholder="${L2('Votre nom', 'Your name')}" value="${esc(keepVals.nom)}" autocomplete="name">
          <input name="tel" type="tel" placeholder="${L2('Votre téléphone', 'Your phone')}" value="${esc(keepVals.tel)}" autocomplete="tel">
          ${mode === 'ship' ? `<input name="adr" placeholder="${L2('Adresse de livraison', 'Delivery address')}" value="${esc(keepVals.adr)}" autocomplete="street-address">` : ''}
          <input name="note" placeholder="${L2('Une précision ? (facultatif)', 'Anything to add? (optional)')}" value="${esc(keepVals.note)}">
        </div>
        ${pays.length ? `<p class="shc-lb">${L2('Paiement', 'Payment')}</p><div class="shc-pay" role="radiogroup">${pays.map((x) => `<button type="button" role="radio" aria-checked="${pay === x.k}" data-pay="${x.k}" class="${pay === x.k ? 'on' : ''}">${esc(x.l)}</button>`).join('')}</div>` : ''}
        <div class="shc-tot">${row(L2('Sous-total', 'Subtotal'), money(T.sub))}${mode === 'ship' ? row(L2('Livraison', 'Delivery'), T.fee ? money(T.fee) : L2('Gratuite', 'Free')) : ''}${T.taxes.map(([l, v]) => row(l, money(v))).join('')}${row('Total', money(T.total), 'big')}</div>
        <button type="button" class="btn shc-go">${ic(sendI, 18)}<span>${sendL}</span></button>
        <p class="shs-msg" role="status"></p>
        <p class="shc-h">${online ? L2('Le paiement s’ouvre dans une page sécurisée.', 'Payment opens on a secure page.') : L2(`Un message déjà rédigé s’ouvre : il ne reste qu’à l’envoyer. ${esc(shopName)} vous confirme la commande et le paiement.`, `A ready-made message opens: just hit send. ${esc(shopName)} will confirm your order and payment.`)}</p></div>`;
    };
    const message = (T, v) => {
      const lines = T.lines.map(({ l, x }) => `• ${l.q} × ${x.t}${l.o ? ` (${l.o})` : ''} : ${money(priceOf(x) * l.q)}`);
      return [L2(`Bonjour ${shopName}, voici ma commande :`, `Hi ${shopName}, here is my order:`), ...lines, '',
        `${L2('Sous-total', 'Subtotal')} : ${money(T.sub)}`, ...(mode === 'ship' ? [`${L2('Livraison', 'Delivery')} : ${money(T.fee)}`] : []),
        ...T.taxes.map(([l, x]) => `${l} : ${money(x)}`), `Total : ${money(T.total)}`, '',
        mode === 'ship' ? `${L2('Livraison à', 'Deliver to')} : ${v.adr}` : mode === 'dine' ? L2('Sur place', 'Dine in') : pickL(b),
        ...(payNow() ? [`${L2('Paiement', 'Payment')} : ${payNow().l}`] : []),
        `${L2('Nom', 'Name')} : ${v.nom}`, `${L2('Téléphone', 'Phone')} : ${v.tel}`, ...(v.note ? [`${L2('Note', 'Note')} : ${v.note}`] : [])].join('\n');
    };
    /* Ouvre le message de commande déjà rédigé (texto, WhatsApp ou courriel) */
    let lastV = null;
    const send = (v) => {
      if (!v) return;
      const txt = message(totals(), v), E = encodeURIComponent;
      const phone = String(b.phone || c.phone || '').replace(/[^\d+]/g, ''), wa = digits(b.wa || c.whatsapp || c.phone), email = b.email || c.email;
      const mail = () => { location.href = `mailto:${email}?subject=${E(L2('Commande', 'Order') + ' – ' + v.nom)}&body=${E(txt)}`; };
      if (way === 'wa' && wa) window.open(`https://wa.me/${wa}?text=${E(txt)}`, '_blank', 'noopener');
      else if (way === 'email' && email) mail();
      else if (phone) location.href = `sms:${phone}?&body=${E(txt)}`;
      else if (email) mail();
    };
    draw();
    ov.addEventListener('click', (e) => {
      const lq = e.target.closest('[data-lq]'), md = e.target.closest('[data-mode]');
      if (lq) {
        const T = totals(), r = T.lines[+lq.dataset.k];
        if (r) { r.l.q += +lq.dataset.lq; if (r.l.q <= 0) CART.splice(CART.indexOf(r.l), 1); keep(); refreshBadges(t.closest('.vc'), b); draw(); }
      } else if (md) { mode = md.dataset.mode; draw(); }
      else if (e.target.closest('[data-pay]')) { pay = e.target.closest('[data-pay]').dataset.pay; draw(); }
      else if (e.target.closest('[data-send]')) send(lastV);
      else if (e.target.closest('.shc-go')) {
        const v = {}; ['nom', 'tel', 'adr', 'note'].forEach((k) => { const el = box.querySelector(`[name=${k}]`); v[k] = el ? el.value.trim() : ''; });
        const msgEl = box.querySelector('.shs-msg');
        if (!v.nom || !v.tel || (mode === 'ship' && !v.adr)) { msgEl.textContent = L2('Indiquez votre nom, votre téléphone' + (mode === 'ship' ? ' et votre adresse.' : '.'), 'Please enter your name, phone' + (mode === 'ship' ? ' and address.' : '.')); return; }
        const T = totals(), P = payNow();
        lastV = v;
        if (P && P.url) {
          let u = VC.url(P.url);
          if (/paypal\.me\//i.test(u)) u = u.replace(/\/+$/, '') + '/' + T.total.toFixed(2);
          window.open(u, '_blank', 'noopener');
        } else send(v);
        const sendL = { sms: L2('Envoyer le détail par texto', 'Send the details by text'), wa: L2('Envoyer le détail sur WhatsApp', 'Send the details on WhatsApp'), email: L2('Envoyer le détail par courriel', 'Send the details by email') }[way];
        const transfer = P && P.info ? `<p class="shc-tr">${L2(`Envoyez votre virement de <b>${money(T.total)}</b> à <b>${esc(P.info)}</b>.`, `Send your <b>${money(T.total)}</b> transfer to <b>${esc(P.info)}</b>.`)}</p>` : '';
        box.innerHTML = `<button type="button" class="ov-x shs-x" aria-label="${L2('Fermer', 'Close')}">${ic('x', 18)}</button><div class="shs-b shc-empty"><span class="shc-ok">${ic('check', 28)}</span><h3>${L2('Merci !', 'Thank you!')}</h3>
          <p>${P && P.url ? L2('Terminez le paiement dans la page qui vient de s’ouvrir, puis envoyez-nous le détail de votre commande.', 'Complete your payment on the page that just opened, then send us your order details.') : L2('Votre message est prêt : envoyez-le pour confirmer la commande.', 'Your message is ready: send it to confirm your order.')}</p>${transfer}
          ${P && P.url ? `<button type="button" class="btn" data-send>${ic({ sms: 'sms', wa: 'wa', email: 'mail' }[way], 18)}<span>${sendL}</span></button>` : ''}
          <button type="button" class="btn${P && P.url ? ' ghost' : ''}" data-clear>${L2('Terminer', 'Done')}</button></div>`;
      } else if (e.target.closest('[data-clear]')) { CART = CART.filter((l) => !lineItem(b, l)); keep(); refreshBadges(t.closest('.vc'), b); close(); }
    });
  }

  /* Actions des visiteurs dans la carte */
  VC.onAct = function (a, t, e, m) {
    if (a === 'shcat') {
      const shp = t.closest('.shp'), c = t.dataset.c;
      shp.querySelectorAll('.shp-cats button').forEach((x) => x.classList.toggle('on', x === t));
      shp.querySelectorAll('.shp-it').forEach((x) => { x.hidden = !!c && x.dataset.cat !== c; });
      return true;
    }
    if (a === 'prod') { openProduct(t, m); return true; }
    if (a === 'cart') { openCart(t, m); return true; }
    return false;
  };
  VC.brand = ['Boutique NFC', 'NFC store'];

  /* ---------- Éditeur de la section ---------- */
  const app = window.NFC_APP || (window.NFC_APP = {});
  /* Nouvelle boutique : moyens de paiement et canaux désactivés par l’administrateur retirés de l’exemple */
  app.strip = (def, b, on) => {
    if (def.type !== 'shop') return;
    /* Valeurs par défaut choisies par l’administrateur (taxes, livraison, réception) */
    const D = NFC.cfg ? NFC.cfg.get('storeDef', {}) : {};
    if (D.tax) b.tax = D.tax;
    if (D.fee !== '' && D.fee != null) b.fee = String(D.fee);
    if (D.freeFrom !== '' && D.freeFrom != null) b.freeFrom = String(D.freeFrom);
    if (NFC.cfg) { b.dinein = !!(b.dinein && D.dine !== false) || !!(D.dine && b.food); b.pickup = D.pick !== false; b.delivery = D.ship !== false && !!b.delivery; }
    const online = !NFC.cfg || NFC.cfg.plan().online;
    if (b.pay) Object.keys(b.pay).forEach((k) => { if (!on('pay:' + k) || (!online && /^(stripe|paypal|etr|zelle)$/.test(k))) b.pay[k] = false; });
    if (!on('order:' + (b.order || 'sms'))) b.order = ['sms', 'wa', 'email'].find((v) => on('order:' + v)) || b.order;
  };
  app.tpl = Object.assign(app.tpl || {}, { prod: { t: '', d: '', l: '', p: '', sp: '', b: '', img: '', cat: '', o: '', tx: '' } });
  app.editors = Object.assign(app.editors || {}, {
    shop(b, base, h) {
      const { inp, area, mini, add, del, thumbF } = h;
      const cs = cats(b), mode = ['sms', 'wa', 'email'].includes(b.order) ? b.order : 'sms', c = h.card().contact || {};
      /* Moyens de paiement : cases à cocher (anciennes boutiques : comptant et carte cochés) */
      if (!b.pay) b.pay = { cash: true, card: true };
      if (!b.payLinks) b.payLinks = {};
      if (!b.payInfo) b.payInfo = {};
      if (b.order === 'online') { if (b.payUrl && !Object.values(b.payLinks).some(Boolean)) { b.payLinks.stripe = b.payUrl; b.pay.stripe = true; } b.order = 'sms'; }
      const pl = NFC.cfg ? NFC.cfg.plan() : { online: true };
      /* Paiement en ligne réservé aux forfaits qui l’incluent */
      const sv = (id) => (!NFC.svc || NFC.svc.on(id)) && (pl.online || !/^pay:(stripe|paypal|etr|zelle)$/.test(id));
      const pk = (k, label, extra = '') => !sv('pay:' + k) && !b.pay[k] ? '' : `<div class="pay-row"><label class="ck"><input type="checkbox" data-path="${base}.pay.${k}" ${b.pay[k] ? 'checked' : ''}><span>${label}</span></label>${extra ? `<div class="pay-x">${extra}</div>` : ''}</div>`;
      const lk = (k, ph) => `<input class="mini" data-path="${base}.payLinks.${k}" value="${esc(b.payLinks[k] || '')}" placeholder="${esc(ph)}">`;
      const off = [['cash', 'Comptant'], ['card', 'Carte de débit ou de crédit'], ['interac', 'Virement Interac']].map(([k, l]) => pk(k, l)).join('');
      const on = PAY_ON.map(([k, n, ph]) => pk(k, n, lk(k, ph))).join('')
        + pk('etr', 'Virement Interac', `<input class="mini" data-path="${base}.payInfo.interac" value="${esc(b.payInfo.interac || '')}" placeholder="${esc('Courriel qui reçoit les virements')}">`)
        /* Zelle : version anglaise seulement (marché américain) */
        + (h.lang === 'en' ? pk('zelle', 'Zelle', `<input class="mini" data-path="${base}.payInfo.zelle" value="${esc(b.payInfo.zelle || '')}" placeholder="${esc('Courriel ou numéro Zelle')}">`) : '');
      const catSel = (p, v) => `<select class="mini" data-path="${p}"><option value="">${'Sans catégorie'}</option>${cs.map((x) => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
      const prods = (b.items || []).map((x, i) => {
        const p = `${base}.items.${i}`;
        return `<div class="it shop-it">${thumbF(p + '.img')}<div class="it-f">${mini(p + '.t', 'Nom du produit', 'strong')}${mini(p + '.d', 'Description courte')}
          <span class="shop-lb">Prix · Prix soldé · Badge</span>
          <div class="shop-row">${mini(p + '.p', 'Prix (ex. 89)', 'price')}${mini(p + '.sp', 'Prix soldé', 'price')}${mini(p + '.b', 'Badge (Nouveau…)')}</div>
          <span class="shop-lb">Catégorie · Tailles ou options</span>
          <div class="shop-row two">${catSel(p + '.cat', x.cat)}${mini(p + '.o', 'Tailles ou options : S, M, L')}</div>
          ${TX_OPT[b.tax] ? `<span class="shop-lb">Taxe</span><select class="mini" data-path="${p}.tx">${TX_OPT[b.tax].map(([v, fr]) => `<option value="${v}" ${(x.tx || '') === v || (v === '' && x.tx === 'tps' && b.tax !== 'qc') ? 'selected' : ''}>${fr}</option>`).join('')}</select>` : ''}
          ${mini(p + '.l', 'Description complète (fiche produit)')}</div>${del(base + '.items', i, 'Supprimer le produit')}</div>`;
      }).join('');
      const seg = (path, cur, list) => `<div class="seg wrap">${list.map(([v, l]) => `<button type="button" class="${cur === v ? 'on' : ''}" data-act="bkmode" data-path="${path}" data-v="${v}">${l}</button>`).join('')}</div>`;
      const recv = {
        sms: inp('Numéro qui reçoit les commandes', base + '.phone', { type: 'tel', ph: c.phone || '', hint: 'Vide = votre téléphone. Le client envoie un texto déjà rédigé avec sa commande et le total.' }),
        wa: inp('Numéro WhatsApp qui reçoit les commandes', base + '.wa', { type: 'tel', ph: c.whatsapp || c.phone || '', hint: 'Vide = votre numéro WhatsApp. Le client envoie la commande dans WhatsApp.' }),
        email: inp('Adresse qui reçoit les commandes', base + '.email', { type: 'email', ph: c.email || '', hint: 'Vide = votre courriel.' }),
      }[mode];
      return `<p class="f-l">Produits</p><div class="items">${prods}</div>${add(base + '.items', 'prod', 'Ajouter un produit')}
        ${inp('Catégories', base + '.cats', { ph: 'Femme, Homme, Accessoires', hint: 'Séparez-les par des virgules, puis choisissez la catégorie de chaque produit.' })}
        <div class="f"><span class="f-l">Comment recevez-vous les commandes ?</span>${seg(base + '.order', mode, [['sms', 'Texto'], ['wa', 'WhatsApp'], ['email', 'Courriel']].filter(([v]) => sv('order:' + v) || v === mode))}</div>
        ${recv}
        <div class="f pay-f"><span class="f-l">Paiements acceptés</span><span class="f-h">Cochez tous ceux que vous acceptez : le client choisit au moment de commander.</span>
          <p class="pay-g">À la réception (paiement à la livraison ou au ramassage)</p>${off}
          <p class="pay-g">En ligne</p>${on}
          <span class="f-h">Stripe et PayPal : créez un lien de paiement chez le prestataire, puis collez-le sous sa case. Avec PayPal.me, le montant du panier est ajouté automatiquement. Virement Interac : le client voit votre courriel et le montant à envoyer.</span></div>
        <div class="f"><span class="f-l">Le client choisit entre</span><span class="f-h">Cochez selon votre commerce : sur place pour un restaurant ou un café, à emporter ou ramassage, livraison.</span>
          <label class="ck"><input type="checkbox" data-path="${base}.dinein" ${b.dinein ? 'checked' : ''}><span>Sur place</span></label>
          <label class="ck"><input type="checkbox" data-path="${base}.pickup" ${b.pickup !== false ? 'checked' : ''}><span>${b.food ? 'À emporter' : 'À emporter (ramassage en boutique)'}</span></label>
          <label class="ck"><input type="checkbox" data-path="${base}.delivery" ${b.delivery ? 'checked' : ''}><span>Livraison</span></label></div>
        <div class="row2">${inp('Frais de livraison ($)', base + '.fee', { ph: '10' })}${inp('Livraison gratuite dès ($)', base + '.freeFrom', { ph: '150' })}</div>
        ${inp('Zone de livraison', base + '.zone', { ph: 'Montréal et Laval' })}
        <label class="f"><span class="f-l">Taxes ajoutées au total</span><select data-path="${base}.tax" data-struct="re">${[['qc', 'Québec : TPS 5 % + TVQ 9,975 %'], ['on', 'Ontario : TVH 13 %'], ['tps', 'TPS 5 % seulement'], ['us', 'États-Unis : taxe de vente (taux à saisir)'], ['none', 'Aucune (prix taxes incluses)']].map(([v, l]) => `<option value="${v}" ${(b.tax || 'none') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        ${b.tax === 'us' ? inp('Taux de taxe de vente (%)', base + '.rate', { ph: '8.25', hint: 'Taux de votre ville ou de votre État.' }) : ''}
        ${b.tax && b.tax !== 'none' ? '<p class="f-h">Le régime de la boutique s’applique à chaque produit, sauf choix contraire dans le produit (« Taxe »).</p>' : ''}
        ${area('Texte d’accueil de la boutique', base + '.text', { rows: 2 })}
        ${inp('Texte du gros bouton', base + '.label', { ph: 'Voir la boutique' })}`;
    },
  });

  /* Textes fixes de l’éditeur en anglais */
  Object.assign(window.NFC_EN_APP || (window.NFC_EN_APP = {}), {
    'Comment recevez-vous les commandes ?': 'How do you receive orders?', 'Paiements acceptés': 'Accepted payments',
    'Cochez tous ceux que vous acceptez : le client choisit au moment de commander.': 'Tick all the ones you accept: customers choose when they order.',
    'À la réception': 'On pickup or delivery', 'En ligne': 'Online', 'Comptant à la réception': 'Cash on pickup or delivery', 'Carte de débit ou de crédit à la réception': 'Debit or credit card on pickup or delivery',
    'Virement Interac': 'Interac e-Transfer', 'Courriel ou numéro Zelle': 'Zelle email or phone number', 'Courriel qui reçoit les virements': 'Email that receives transfers', 'Comptant': 'Cash', 'Carte de débit ou de crédit': 'Debit or credit card',
    'À la réception (paiement à la livraison ou au ramassage)': 'On pickup or delivery (cash on delivery)',
    'Stripe et PayPal : créez un lien de paiement chez le prestataire, puis collez-le sous sa case. Avec PayPal.me, le montant du panier est ajouté automatiquement. Virement Interac : le client voit votre courriel et le montant à envoyer.': 'Stripe and PayPal: create a payment link with the provider, then paste it under its box. With PayPal.me, the cart amount is added automatically. Interac e-Transfer: customers see your email and the amount to send.',
    'Le client choisit entre': 'Customers choose between', 'Cochez selon votre commerce : sur place pour un restaurant ou un café, à emporter ou ramassage, livraison.': 'Tick what fits your business: dine in for a restaurant or café, takeout or pickup, delivery.',
    'Sur place': 'Dine in', 'À emporter': 'Takeout', 'À emporter (ramassage en boutique)': 'Takeout (in-store pickup)',
    'Produits': 'Products', 'Taxe': 'Tax', 'Taxable (TPS + TVQ)': 'Taxable (GST + QST)', 'TPS seulement (ex. livres)': 'GST only (e.g. books)', 'Non taxé (ex. aliments de base)': 'Tax-free (e.g. basic groceries)',
    'Taxable (TVH)': 'Taxable (HST)', 'Taxable (TPS)': 'Taxable (GST)', 'Non taxé': 'Tax-free', 'Taxable': 'Taxable',
    'Le régime de la boutique s’applique à chaque produit, sauf choix contraire dans le produit (« Taxe »).': 'The store’s tax regime applies to every product, unless set otherwise in the product (“Tax”).', 'Prix · Prix soldé · Badge': 'Price · Sale price · Badge', 'Catégorie · Tailles ou options': 'Category · Sizes or options', 'Nom du produit': 'Product name', 'Description courte': 'Short description', 'Prix (ex. 89)': 'Price (e.g. 89)', 'Prix soldé': 'Sale price',
    'Badge (Nouveau…)': 'Badge (New…)', 'Sans catégorie': 'No category', 'Tailles ou options : S, M, L': 'Sizes or options: S, M, L', 'Description complète (fiche produit)': 'Full description (product page)',
    'Supprimer le produit': 'Delete product', 'Ajouter un produit': 'Add a product', 'Catégories': 'Categories',
    'Séparez-les par des virgules, puis choisissez la catégorie de chaque produit.': 'Separate them with commas, then pick each product’s category.',
    'Comment vos clients commandent et paient ?': 'How do customers order and pay?', 'Texto': 'Text', 'Courriel': 'Email', 'Paiement en ligne': 'Online payment',
    'Numéro qui reçoit les commandes': 'Number that receives orders', 'Numéro WhatsApp qui reçoit les commandes': 'WhatsApp number that receives orders', 'Adresse qui reçoit les commandes': 'Address that receives orders',
    'Vide = votre téléphone. Le client envoie un texto déjà rédigé avec sa commande et le total.': 'Empty = your phone. Customers send a ready-made text with their order and total.',
    'Vide = votre numéro WhatsApp. Le client envoie la commande dans WhatsApp.': 'Empty = your WhatsApp number. Customers send their order in WhatsApp.', 'Vide = votre courriel.': 'Empty = your email.',
    'Votre lien de paiement': 'Your payment link', 'Créez un lien de paiement chez Stripe, Square ou PayPal, puis collez-le ici. Avec PayPal.me, le montant du panier est ajouté automatiquement.': 'Create a payment link with Stripe, Square or PayPal, then paste it here. With PayPal.me, the cart amount is added automatically.',
    'Réception de la commande': 'Order fulfillment', 'Ramassage en boutique': 'In-store pickup', 'Livraison': 'Delivery', 'Frais de livraison ($)': 'Delivery fee ($)', 'Livraison gratuite dès ($)': 'Free delivery over ($)',
    'Zone de livraison': 'Delivery area', 'Taxes ajoutées au total': 'Taxes added to the total', 'Québec : TPS 5 % + TVQ 9,975 %': 'Quebec: GST 5% + QST 9.975%', 'Ontario : TVH 13 %': 'Ontario: HST 13%',
    'TPS 5 % seulement': 'GST 5% only', 'États-Unis : taxe de vente (taux à saisir)': 'United States: sales tax (enter rate)', 'Aucune (prix taxes incluses)': 'None (prices include tax)',
    'Taux de taxe de vente (%)': 'Sales tax rate (%)', 'Taux de votre ville ou de votre État.': 'Your city or state rate.', 'Texte d’accueil de la boutique': 'Shop welcome text', 'Texte du gros bouton': 'Main button text',
  });
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), {
    'La boutique': 'The shop', 'Voir la boutique': 'Shop now', 'Notre histoire': 'Our story', 'En boutique': 'In store', 'Heures d’ouverture': 'Opening hours',
    'Nous trouver': 'Find us', 'Ce que disent nos clients': 'What our customers say', 'Livraison, échanges et retours': 'Delivery, exchanges & returns',
  });
})();
