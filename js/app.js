/* Assistant : Secteur → Modèle → Couleurs → Contenu → Publication */
(function () {
  'use strict';

  const { SECTORS, DESIGNS, OTHER } = NFC;
  const { ic, esc } = VC;
  const $ = (s, r = document) => r.querySelector(s);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  /* Un autre produit (ex. Stores) peut changer la clé d’enregistrement, les étapes et les textes d’accueil */
  const X = window.NFC_APP || {};
  /* Services activés par l’administrateur (js/services.js) ; tout est activé si le registre est absent */
  const svcOn = (id) => !NFC.svc || NFC.svc.on(id);
  /* Réglages de l’administrateur (js/services.js, NFC.cfg) et forfait du client */
  const cfg = (p, d) => (NFC.cfg ? NFC.cfg.get(p, d) : d);
  const plan = () => Object.assign({ docs: 5, size: 10 }, NFC.cfg ? NFC.cfg.plan() : { sections: 99, photos: 99, products: 999, bili: true, video: true, shop: true, online: true, ai: true });
  const isStores = !!X.key && X.key !== 'nfc-studio-v6';
  /* Secteurs (ou types de boutique) : masqués, « Bientôt », ordre */
  const ADM = () => !!(NFC.isAdmin && NFC.isAdmin());
  const secDel = (s) => cfg('sectors.del', []).includes(s.id);
  const secOff = (s) => cfg('sectors.off', []).includes(s.id) || secDel(s);
  const secSoon = (s) => !s.active || cfg('sectors.soon', []).includes(s.id);
  const secList = () => {
    const ord = cfg('sectors.order', []), pos = (s) => { const i = ord.indexOf(s.id); return i < 0 ? 999 : i; };
    /* L’administrateur voit aussi les secteurs désactivés (grisés), jamais les supprimés */
    return SECTORS.filter((s) => (ADM() ? !secDel(s) : !secOff(s))).map((s, i) => [s, i]).sort((a, b) => (pos(a[0]) - pos(b[0])) || (a[1] - b[1])).map((x) => x[0]);
  };
  const profDel = (s, p) => cfg('profDel', []).includes(s.id + '~' + p.id);
  const profOk = (s, p) => !cfg('profOff', []).includes(s.id + '~' + p.id) && !profDel(s, p);
  const recOf = (s) => cfg('rec', {})[s.id] || s.rec;
  const KEY = X.key || 'nfc-studio-v6';
  const STEPS = X.steps || ['Secteur', 'Modèle', 'Couleurs', 'Contenu', 'Publication'];

  const fresh = () => ({ v: 1, step: 1, sectorId: null, design: null, palette: 0, cards: {}, id: rid() });
  let S = load();
  /* Tous les panneaux de l’étape Contenu arrivent fermés : le client ouvre celui qu’il veut modifier */
  const openGroups = new Set();
  let mobileTab = 'edit';
  let pvTimer = null;

  function rid() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = '';
    for (let i = 0; i < 6; i++) r += c[Math.floor(Math.random() * c.length)];
    return r;
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      /* Ancienne palette créée par l’IA : on revient à une palette du secteur */
      if (s && typeof s.palette !== 'number') { s.palette = 0; delete s.ai; }
      if (s && s.v === 1) return s;
    } catch (e) { /* stockage indisponible */ }
    return fresh();
  }
  function save() {
    syncMedia();
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { toast('Stockage du navigateur plein : retirez quelques photos.'); }
  }

  /* Secteur choisi, vu à travers le métier choisi (exemple, couleurs et photos du métier) */
  const baseSec = () => SECTORS.find((s) => s.id === S.sectorId);
  const prof = () => NFC.profileOf(baseSec(), S.prof);
  const sec = () => { const b = baseSec(), p = prof(); return p ? NFC.withProfile(b, p) : b; };
  /* Clé des cartes enregistrées : secteur + métier (chaque métier garde sa propre carte) */
  const kid = () => { const p = prof(); return S.sectorId + (p ? '~' + p.id : ''); };
  const mediaNow = () => { const p = prof(); return (p && p.media) || (NFC.MEDIA || {})[S.sectorId] || {}; };
  const profName = (p) => (p ? p.n[ui() === 'en' ? 1 : 0] : '');
  /* Langue de la carte : celle choisie, sinon celle du site */
  /* Langue de la carte : celle du site, sauf carte bilingue où l’on choisit la version à modifier */
  const lang = () => (bili() && (S.lang === 'en' || S.lang === 'fr') ? S.lang : ui());
  const ckey = (id = kid()) => (lang() === 'en' ? id + ':en' : id);
  const demoOf = (s) => (lang() === 'en' && s.demoEn ? s.demoEn : s.demo);
  const card = () => S.cards[ckey()];
  const bili = () => !!(S.bili && S.bili[S.sectorId]);
  /* Réseaux sociaux : chaque champ est prérempli avec l’adresse du réseau ; une case l’affiche ou le masque.
     Par défaut, sont cochés les réseaux déjà présents dans la carte (ceux proposés pour le secteur). */
  const SOC_DEFAULT = ['instagram', 'linkedin', 'facebook'];
  function normSocials(c) {
    if (!c) return;
    const s = c.socials || (c.socials = {});
    /* Cochés au départ : Instagram, LinkedIn et Facebook. Un réseau dont l’adresse a été complétée reste coché. */
    const reset = c.socDef !== 2;
    if (!c.socialsOn || reset) c.socialsOn = reset ? {} : c.socialsOn;
    VC.SOC.forEach(([k]) => {
      /* Vide ou simple nom de domaine (https://facebook.com/) : adresse de départ complète */
      if (!s[k] || /^https?:\/\/(www\.)?[^/]+\/?$/i.test(s[k])) s[k] = VC.SOC_BASE[k];
      if (c.socialsOn[k] === undefined) c.socialsOn[k] = SOC_DEFAULT.includes(k) || s[k] !== VC.SOC_BASE[k];
    });
    c.socDef = 2;
  }
  const ensureCard = () => {
    const s = sec();
    if (S.cards[ckey()]) normSocials(S.cards[ckey()]);
    if (!s || S.cards[ckey()]) return;
    S.cards[ckey()] = clone(demoOf(s));
    /* La nouvelle version reprend les photos et vidéos de l’autre */
    const other = S.cards[lang() === 'en' ? kid() : kid() + ':en'];
    if (other) mirrorMedia(other, S.cards[ckey()], lang() === 'en');
    normSocials(S.cards[ckey()]);
    stripOff(S.cards[ckey()], s);
  };
  /* Nouvelle carte : les services désactivés par l’administrateur ne sont pas repris de l’exemple.
     Les cartes déjà créées ne sont pas touchées. */
  function stripOff(c, s) {
    VC.SOC.forEach(([k]) => { if (!svcOn('soc:' + k) && c.socialsOn) c.socialsOn[k] = false; });
    s.blocks.forEach((def) => {
      const b = c.blocks[def.key];
      if (!b) return;
      if (def.type === 'location' && !svcOn('google:maps')) b.map = false;
      if (def.type === 'greviews' && !svcOn('google:reviews')) b.on = false;
      if (def.type === 'booking') { const P = VC.providerOf(b); if (P && !svcOn('book:' + P.id)) { b.mode = 'request'; b.url = ''; b.provider = ''; } }
      if (X.strip) X.strip(def, b, svcOn);
    });
  }

  /* ---------- Photos et vidéos communes aux versions française et anglaise ----------
     Seuls les médias sont recopiés ; les textes de chaque version restent indépendants. */
  const ID_MEDIA = ['photo', 'logo', 'cover', 'coverType', 'coverVideo', 'coverVideoFile', 'coverVideoUrl'];
  const ITEM_MEDIA = ['img', 'src', 'poster', 'photo'];
  const MEDIA_SECS = ['gallery', 'imgcar', 'vidcar'];
  const isMediaList = (arr) => Array.isArray(arr) && arr.length && arr.every((x) => x && typeof x === 'object' && ('src' in x) && !('title' in x && 'desc' in x));
  function mirrorList(a, b, withUrl) {
    /* Galeries et carrousels : même liste de médias, légendes de la version cible conservées */
    return a.map((x, i) => {
      const y = b[i];
      const keep = y && y.src === x.src ? y : null;
      const r = Object.assign({}, x, keep ? { cap: keep.cap, title: keep.title } : {});
      if (!withUrl && keep && 'url' in keep) r.url = keep.url;
      Object.keys(r).forEach((k) => r[k] === undefined && delete r[k]);
      return r;
    });
  }
  function mirrorObj(a, b, video) {
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return;
    ITEM_MEDIA.concat(video ? ['url'] : []).forEach((k) => { if (k in a) b[k] = a[k]; else if (k in b && k !== 'url') delete b[k]; });
    Object.keys(a).forEach((k) => {
      const x = a[k], y = b[k];
      if (isMediaList(x) || (Array.isArray(x) && !x.length && isMediaList(y))) b[k] = mirrorList(x, Array.isArray(y) ? y : [], video);
      else if (Array.isArray(x) && Array.isArray(y)) x.forEach((it, i) => { if (y[i]) mirrorObj(it, y[i], video); });
      else if (x && typeof x === 'object' && y && typeof y === 'object' && !Array.isArray(x)) mirrorObj(x, y, video);
    });
  }
  let FR_OF = null;
  /* Titre d’une section copiée dans l’autre langue */
  function titleIn(t, en) {
    const U = window.NFC_EN_UI || {};
    if (en) return U[t] || t;
    if (!FR_OF) { FR_OF = {}; Object.entries(U).forEach(([f, e]) => { if (!(e in FR_OF)) FR_OF[e] = f; }); }
    return FR_OF[t] || t;
  }
  function mirrorMedia(a, b, toEn) {
    if (!a || !b) return;
    a.identity = a.identity || {}; b.identity = b.identity || {};
    ID_MEDIA.forEach((k) => { if (a.identity[k] !== undefined) b.identity[k] = a.identity[k]; else delete b.identity[k]; });
    const s = sec();
    Object.keys(a.blocks || {}).forEach((k) => {
      if (!b.blocks || !b.blocks[k]) return;
      const def = s && s.blocks.find((x) => x.key === k);
      mirrorObj(a.blocks[k], b.blocks[k], def && def.type === 'video');
    });
    /* Sections personnalisées de photos / vidéos : ajoutées, retirées et mises à jour ensemble */
    const ac = a.custom || [], bc = b.custom || (b.custom = []);
    const aMedia = ac.filter((c) => MEDIA_SECS.includes(c.type) && c.cid);
    for (let i = bc.length - 1; i >= 0; i--) {
      const c = bc[i];
      if (MEDIA_SECS.includes(c.type) && c.cid && !aMedia.some((x) => x.cid === c.cid)) {
        bc.splice(i, 1);
        if (b.order) b.order = b.order.filter((k) => k !== 'c:' + c.cid);
      }
    }
    aMedia.forEach((c) => {
      const y = bc.find((x) => x.cid === c.cid);
      if (!y) {
        const n = clone(c);
        if (n.title) n.title = titleIn(n.title, toEn);
        bc.push(n);
        if (b.order && !b.order.includes('c:' + c.cid)) b.order.push('c:' + c.cid);
      } else {
        y.type = c.type; if (c.layout) y.layout = c.layout;
        y.images = mirrorList(c.images || [], y.images || [], c.type === 'vidcar');
        if (c.videos) y.videos = mirrorList(c.videos, y.videos || [], true);
      }
    });
    ac.filter((c) => c.type === 'block' && c.cid).forEach((c) => {
      const y = bc.find((x) => x.cid === c.cid);
      if (y && y.data) mirrorObj(c.data, y.data, c.def && c.def.type === 'video');
    });
  }
  function syncMedia() {
    const s = sec();
    if (!s) return;
    const a = S.cards[ckey()], b = S.cards[lang() === 'en' ? kid() : kid() + ':en'];
    if (a && b) mirrorMedia(a, b, lang() !== 'en');
  }
  /* Textes par défaut proposés dans l’éditeur, dans la langue de la carte */
  const uiLang = (x) => (lang() === 'en' && window.NFC_EN_UI && window.NFC_EN_UI[x]) || x;
  const QR_BASE = cfg('brand.linkBase', '') || 'https://votre-site.com/c/';
  /* hasQR() : la carte NFC a été reçue avec un QR code et un lien déjà imprimés */
  const hasQR = () => !!(S.qr && S.qr.url);
  const link = () => (hasQR() ? S.qr.url : QR_BASE + S.id);

  /* ---------- Langue du site (menus, étapes, éditeur) ----------
     Indépendante de la langue de la carte. Les textes de l’interface sont traduits à l’affichage :
     tout ce qui est rendu hors de la carte (.vc) passe par T(). */
  const ui = () => (S.ui === 'en' ? 'en' : 'fr');
  const APP = window.NFC_EN_APP || {}, CUI = window.NFC_EN_UI || {}, RX = window.NFC_EN_APP_RX || [];
  const tword = (k) => (APP[k] != null ? APP[k] : CUI[k] != null ? CUI[k] : null);
  /* Texte entier : dictionnaire, puis textes composés */
  function tfull(k) {
    let r = tword(k);
    if (r != null) return r;
    if (/^https?:\/\//.test(k) && /votre-|ma-video/.test(k)) return k.replace(/votre-/g, 'your-').replace(/ma-video/g, 'my-video');
    for (const [re, rep] of RX) {
      const mm = k.match(re);
      if (mm) return rep.replace(/\$(\d)/g, (_, n) => tpart(mm[+n] || ''));
    }
    return null;
  }
  /* Morceau de texte : entier, sinon découpé sur « · » puis sur les virgules */
  function tpart(x) {
    if (x == null) return '';
    const k = x.trim(), lead = x.match(/^\s*/)[0], trail = x.match(/\s*$/)[0];
    if (!k) return x;
    let r = tfull(k);
    if (r == null && k.startsWith('· ')) { const w = tpart(k.slice(2)); if (w !== k.slice(2)) r = '· ' + w; }
    if (r == null && k.includes(' · ')) { const p = k.split(' · ').map(tpart).join(' · '); if (p !== k) r = p; }
    if (r == null && k.includes(', ')) { const p = k.split(', ').map((q) => (tword(q) != null ? tword(q) : q)).join(', '); if (p !== k) r = p; }
    return r == null ? x : lead + r + trail;
  }
  function T(s) {
    if (ui() !== 'en' || s == null) return s;
    const str = String(s), k = str.replace(/\s+/g, ' ').trim();
    if (!k) return s;
    const r = tpart(k);
    if (r === k) return s;
    return str.match(/^\s*/)[0] + r + str.match(/\s*$/)[0];
  }
  const SKIP = '.vc, textarea, script, style, svg, code, .chip-e, .no-tr';
  const TR_ATTRS = ['placeholder', 'title', 'aria-label'];
  function trText(n) {
    const v = n.nodeValue;
    if (!/[A-Za-zÀ-ÿ]/.test(v) || (n.parentElement && n.parentElement.closest(SKIP))) return;
    const r = T(v);
    if (r !== v) { if (n.__fr == null) n.__fr = v; n.nodeValue = r; }
  }
  function trEl(el) {
    TR_ATTRS.forEach((a) => {
      const v = el.getAttribute(a);
      if (!v) return;
      const r = T(v);
      if (r !== v) { el.__fra = el.__fra || {}; if (el.__fra[a] == null) el.__fra[a] = v; el.setAttribute(a, r); }
    });
  }
  function translateTree(root) {
    if (ui() !== 'en' || !root) return;
    if (root.nodeType === 3) { trText(root); return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    trEl(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      { acceptNode: (n) => (n.nodeType === 1 && n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    let n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) trText(n); else trEl(n); }
  }
  function untranslate() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (n.__fr != null) { n.nodeValue = n.__fr; n.__fr = null; } }
      else if (n.__fra) { Object.entries(n.__fra).forEach(([a, v]) => n.setAttribute(a, v)); n.__fra = null; }
    }
  }
  new MutationObserver((ms) => {
    if (ui() !== 'en') return;
    ms.forEach((m) => {
      if (m.type === 'childList') m.addedNodes.forEach(translateTree);
      else if (m.type === 'characterData') trText(m.target);
      else if (m.target.nodeType === 1 && !m.target.closest(SKIP)) trEl(m.target);
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TR_ATTRS });
  const ask = (msg) => confirm(T(msg));
  const uiSwitch = () => `<div class="seg ui-sw" role="group" aria-label="${ui() === 'en' ? 'Site language' : 'Langue du site'}">${ic('globe', 15)}<button type="button" class="${ui() === 'fr' ? 'on' : ''}" data-act="ui" data-v="fr" lang="fr" title="Site en français">FR</button><button type="button" class="${ui() === 'en' ? 'on' : ''}" data-act="ui" data-v="en" lang="en" title="Site in English">EN</button></div>`;
  const mdl = (d = S.design, p = S.palette) => {
    const s = sec();
    const ps = NFC.palsOf ? NFC.palsOf(s) : s.palettes;
    return { card: card() || demoOf(s), sec: s, d: d || s.rec, pal: ps[p] || ps[0], link: link(), lang: lang(), bilingual: bili() };
  };
  const designOf = (id) => (NFC.DESIGNS_ALL || DESIGNS).find((d) => d.id === id) || DESIGNS[0];
  /* Mises en page proposées : les 10 communes + celles propres au secteur (ex. beauté) */
  const designsNow = () => {
    const all = DESIGNS.concat((sec() && sec().designs) || []), off = cfg('designsOff', []), del = cfg('designsDel', []);
    const on = all.filter((d) => (ADM() ? !del.includes(d.id) : (!off.includes(d.id) && !del.includes(d.id))) || d.id === S.design);
    return on.length ? on : all;
  };
  const code = (d = S.design) => `${sec().code}-${String(d || sec().rec).toUpperCase()}`;

  const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
  const setP = (o, path, v) => { const ks = path.split('.'), last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const g = (p) => getP(card(), p);

  function maxStep() { return !S.sectorId ? 1 : !S.design ? 2 : 5; }
  function go(n) { S.step = Math.max(1, Math.min(n, maxStep())); save(); render(); window.scrollTo(0, 0); }

  /* ---------- Réception des contacts (coordonnées laissées par les interlocuteurs) ----------
     Le titulaire choisit comment il les reçoit. L’envoi réel (courriel, Google Sheets, CRM) se fait sur le serveur. */
  const LEAD_CRM = [['hubspot', 'HubSpot'], ['ghl', 'GoHighLevel'], ['zoho', 'Zoho CRM'], ['pipedrive', 'Pipedrive']];
  function leadsEd() {
    const c = card();
    if (!c.leads) c.leads = { email: true, emailTo: '', phone: true, mini: true, excel: true, sheets: false, crm: false, crmTool: '' };
    const L = c.leads, ce = (c.contact || {}).email || '';
    /* L’échange n’est qu’un des chemins : formulaires, rendez-vous et commandes envoient aussi des contacts */
    const exOff = c.exchange === false;
    const FORMS = ['form', 'booking', 'contact', 'shop'];
    const hasForms = sec().blocks.some((d) => FORMS.includes(d.type) && (c.blocks[d.key] || {}).on) || (c.custom || []).some((x) => x.on !== false && FORMS.includes(x.type === 'block' ? (x.def || {}).type : x.type));
    const opt = (svc, key, title, desc, extra = '') => (!svcOn('crm:' + svc) && !L[key] ? '' : `<div class="ld-o">
        <label class="ck"><input type="checkbox" data-path="leads.${key}" ${L[key] ? 'checked' : ''}><span><b>${title}</b><small>${desc}</small></span></label>${extra ? `<div class="ld-x">${extra}</div>` : ''}</div>`);
    const tools = LEAD_CRM.filter(([k]) => svcOn('crm:' + k) || L.crmTool === k);
    const connect = (what) => `<button type="button" class="b sm" data-act="leadconnect" data-v="${what}">${ic('link', 15)}Connecter ${what}</button>`;
    const sendWays = [svcOn('crm:sendmail') ? 'courriel' : '', svcOn('crm:sendsms') ? 'texto' : ''].filter(Boolean).join(' et ');
    return `<p class="f-l ld-t ld-t0">Ce que reçoit la personne rencontrée</p>
      <div class="ld">
        <div class="ld-o ld-fix"><span class="ld-ic">${ic('userplus', 18)}</span><span><b>Vos coordonnées dans ses contacts</b><small>« Enregistrer le contact » ajoute votre nom, téléphone, courriel et adresse à son téléphone, avec un lien cliquable vers votre carte digitale.</small></span><span class="ld-on">Toujours</span></div>
        ${sendWays ? `<div class="ld-o ld-fix"><span class="ld-ic">${ic('send', 18)}</span><span><b>Votre carte envoyée par ${sendWays}</b><small>Dès qu’elle vous laisse ses coordonnées, elle reçoit automatiquement le lien de votre carte et votre photo, pour la retrouver facilement.</small></span><span class="ld-on">Toujours</span></div>
        ${area('Petit mot ajouté à l’envoi (facultatif)', 'leads.thanks', { rows: 2, ph: 'Merci pour notre rencontre ! Voici ma carte, n’hésitez pas à me contacter.' })}` : ''}
        ${svcOn('share:qrbtn') || c.qrBtn === true ? `<div class="ld-o"><label class="ck"><input type="checkbox" data-path="qrBtn" ${c.qrBtn !== false ? 'checked' : ''}><span><b>Bouton « Mon QR code » sur la carte</b><small>Un toucher affiche votre QR code en grand, à faire scanner par la personne en face de vous.</small></span></label></div>` : ''}
        <div class="ld-o ld-fix"><span class="ld-ic">${ic('qr', 18)}</span><span><b>Votre QR code</b><small>Pour vos cartes, flyers, vitrine ou signature courriel.</small></span><span class="qr-dl">${qrDl()}</span></div>
        ${svcOn('crm:home') || c.homeScreen === true ? `<div class="ld-o"><label class="ck"><input type="checkbox" data-path="homeScreen" ${c.homeScreen !== false ? 'checked' : ''}><span><b>Proposer « Ajouter à l’écran d’accueil »</b><small>Votre carte devient une icône sur son téléphone, comme une application.</small></span></label></div>` : ''}
      </div>
      <p class="f-l ld-t">Ce que vous recevez</p>
      <label class="ck ld-ex"><input type="checkbox" data-path="exchange" data-struct="re" ${c.exchange !== false ? 'checked' : ''}><span><b>Proposer l’échange de coordonnées</b><small>Après « Enregistrer le contact », la personne rencontrée peut vous laisser les siennes (ou scanner sa carte papier).</small></span></label>
      ${exOff ? (hasForms ? `<p class="ld-note">${ic('check', 15)}<span>Échange désactivé : vous recevrez seulement les demandes de vos formulaires, rendez-vous et commandes.</span></p>` : `<p class="ld-note warn">${ic('shield', 15)}<span><b>Attention :</b> aucun visiteur ne pourra vous laisser ses coordonnées. Réactivez l’échange ou ajoutez un formulaire de demande.</span></p>`) : ''}
      <p class="f-l ld-t">Comment voulez-vous recevoir ces coordonnées ?</p>
      <p class="f-h ld-h">Ces choix valent pour tous les contacts reçus : échange de coordonnées, formulaires, rendez-vous et commandes.</p>
      <div class="ld${exOff && !hasForms ? ' ld-dim' : ''}">
        ${opt('email', 'email', 'Courriel à chaque nouveau contact', '« Nouveau contact : Julie Tremblay, 514… » dans votre boîte.', inp('Adresse qui reçoit les contacts', 'leads.emailTo', { type: 'email', ph: ce, hint: 'Vide = votre courriel.' }))}
        ${opt('phone', 'phone', '« Ajouter à mes contacts »', 'Un bouton sur chaque contact reçu l’enregistre dans votre téléphone, comme un contact normal.')}
        ${opt('mini', 'mini', 'Mini-CRM NexTap', 'Une liste claire de vos contacts : statut (nouveau, rappelé, client), notes et recherche.')}
        ${opt('excel', 'excel', '« Télécharger en Excel »', 'Un vrai fichier Excel qui s’ouvre proprement, accents et téléphones intacts.')}
        ${opt('sheets', 'sheets', '« Envoyer vers Google Sheets »', 'Vos contacts s’ajoutent tout seuls dans une feuille Google.', connect('Google Sheets'))}
        ${tools.length ? `<div class="ld-o"><label class="ck"><input type="checkbox" data-path="leads.crm" ${L.crm ? 'checked' : ''}><span><b>« Connecter mon CRM »</b><small>Chaque contact part automatiquement dans votre CRM. Vous autorisez une seule fois.</small></span></label>
          <div class="ld-x"><label class="f"><span class="f-l">Votre CRM</span><select data-path="leads.crmTool"><option value="">Choisir…</option>${tools.map(([k, n]) => `<option value="${k}" ${L.crmTool === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>${connect(((tools.find(([k]) => k === L.crmTool) || [])[1]) || 'mon CRM')}</div></div>` : ''}
      </div>
      <p class="f-h">Vous recevez les contacts dès que votre carte est en ligne ; vous pouvez changer ces choix à tout moment.</p>`;
  }

  /* Boutons de téléchargement du QR code de la carte */
  const qrDl = () => `<button type="button" class="b xs" data-act="qrdl" data-v="png">${ic('download', 14)}PNG</button><button type="button" class="b xs" data-act="qrdl" data-v="svg">${ic('download', 14)}SVG</button><button type="button" class="b xs" data-act="poster">${ic('qr', 14)}Affiche à imprimer</button>`;

  /* ---------- Affiche à imprimer : QR code + nom + « Scannez pour voir ma carte » ---------- */
  const POSTER_LINES = isStores
    ? [['Scannez pour voir notre boutique', 'Scan to see our store'], ['Scannez pour commander', 'Scan to order'], ['Scannez pour voir nos produits', 'Scan to see our products']]
    : [['Scannez pour voir ma carte', 'Scan to see my profile'], ['Scannez pour enregistrer mes coordonnées', 'Scan to save my contact'], ['Scannez pour prendre rendez-vous', 'Scan to book an appointment']];
  function posterOpts() {
    const f = $('[data-poster]'), s = sec(), pal = (NFC.palsOf ? NFC.palsOf(s) : s.palettes)[S.palette] || s.palettes[0], id = (card() || {}).identity || {};
    return { url: link(), fmt: f ? f.fmt.value : 'a5', name: f ? f.n.value : id.name, sub: f ? f.s.value : id.role || '', line: f ? f.l.value : '', p: pal.p, a: pal.a };
  }
  function openPoster() {
    const id = (card() || {}).identity || {}, en = lang() === 'en';
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md md-poster" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
        <h2 id="md-t">Affiche à imprimer</h2>
        <p>Pour un comptoir, une vitrine ou un présentoir : vos clients scannent le code avec l’appareil photo de leur téléphone.</p>
        <form class="poster-f" data-poster>
          <div class="poster-pv" data-poster-pv></div>
          <div class="poster-o">
            <label class="f"><span class="f-l">Nom</span><input name="n" maxlength="40" value="${esc(id.name || '')}"></label>
            <label class="f"><span class="f-l">Sous-titre (facultatif)</span><input name="s" maxlength="50" value="${esc(id.role || '')}"></label>
            <label class="f"><span class="f-l">Phrase d’appel</span><select name="l">${POSTER_LINES.map(([fr, eng]) => `<option value="${esc(en ? eng : fr)}">${esc(en ? eng : fr)}</option>`).join('')}</select></label>
            <label class="f"><span class="f-l">Format</span><select name="fmt"><option value="a6">A6 · 10,5 × 14,8 cm (comptoir)</option><option value="a5" selected>A5 · 14,8 × 21 cm (présentoir)</option><option value="letter">Lettre · 8,5 × 11 po (vitrine)</option></select></label>
            <p class="f-h">Aux couleurs de votre palette. Le lien imprimé ne change jamais, même si vous modifiez votre carte.</p>
            <div class="btns"><button type="button" class="b pri" data-act="poster-print">${ic('file', 15)}Imprimer</button><button type="button" class="b" data-act="poster-png">${ic('download', 15)}Télécharger PNG</button></div>
          </div>
        </form>
      </div>`;
    $('#modal').classList.add('on');
    const f = $('[data-poster]'), draw = () => { $('[data-poster-pv]').innerHTML = VC.posterSvg(posterOpts()) || '<p class="muted small">Aperçu indisponible hors ligne.</p>'; };
    f.addEventListener('input', draw);
    f.addEventListener('change', draw);
    draw();
  }

  /* ---------- Mode administrateur dans le studio ----------
     Boutons « Désactiver / Activer » et « Supprimer » sur les secteurs, métiers, modèles et palettes,
     et « Ajouter une palette ». Visibles seulement en mode administrateur (sur GoBiz : administrateur connecté). */
  const admBar = () => (ADM() ? `<div class="adm-bar">${ic('shield', 16)}<span><b>Mode administrateur</b> · vos clients ne voient pas ces boutons. Désactivé = caché aux clients (grisé pour vous) ; supprimé = retiré, à restaurer depuis la page admin.</span><a class="linkish" href="${isStores ? '../' : ''}admin.html#cat">Page admin</a><button type="button" class="linkish" data-act="adm" data-op="quit">Quitter le mode admin</button></div>` : '');
  function admTools(kind, id, state, soon, rec) {
    const b = (op, label, cls = '') => `<button type="button" class="adm-t ${cls}" data-act="adm" data-kind="${kind}" data-id="${esc(id)}" data-op="${op}">${label}</button>`;
    return `<div class="adm-tb">${state === 'on' || state === 'soon' ? b('off', 'Désactiver') : b('on', 'Activer', 'pri')}${soon ? (state === 'soon' ? b('on', 'Ouvrir') : state === 'on' ? b('soon', 'Bientôt') : '') : ''}${kind === 'des' ? (rec ? '<span class="adm-t on">Recommandé</span>' : b('rec', 'Recommander')) : ''}${b('del', 'Supprimer', 'danger')}</div>`;
  }
  const admWrap = (html, kind, id, state, soon) => (ADM() ? `<div class="adm-w">${html}${admTools(kind, id, state, soon)}</div>` : html);
  const addTo = (path, v) => { const a = cfg(path, []).filter((x) => x !== v); a.push(v); return a; };
  const rmFrom = (path, v) => cfg(path, []).filter((x) => x !== v);
  function admAct(t) {
    if (!NFC.cfg || !ADM()) return;
    const C = NFC.cfg, { kind, id, op } = t.dataset;
    const name = kind === 'sec' ? ((SECTORS.find((x) => x.id === id) || {}).name || id) : kind === 'des' ? designOf(id).name : kind === 'prof' ? id : 'palette ' + id;
    if (op === 'quit') { C.set('adminMode', false, 'Mode administrateur désactivé'); toast('Mode administrateur quitté.'); render(); return; }
    if (op === 'paladd') { openPalAdd(); return; }
    if (op === 'del' && !confirm(`Supprimer « ${name} » ? Vos clients ne le verront plus. Vous pourrez le restaurer depuis la page admin.`)) return;
    if (kind === 'sec') {
      if (op === 'off') C.set('sectors.off', addTo('sectors.off', id), `Secteur ${name} : désactivé`);
      if (op === 'on') { C.set('sectors.off', rmFrom('sectors.off', id)); C.set('sectors.soon', rmFrom('sectors.soon', id), `Secteur ${name} : activé`); }
      if (op === 'soon') C.set('sectors.soon', addTo('sectors.soon', id), `Secteur ${name} : Bientôt`);
      if (op === 'del') { C.set('sectors.del', addTo('sectors.del', id), `Secteur ${name} : supprimé`); if (S.sectorId === id) { S.sectorId = null; S.design = null; } }
    } else if (kind === 'prof') {
      if (op === 'off') C.set('profOff', addTo('profOff', id), `Métier ${id} : désactivé`);
      if (op === 'on') C.set('profOff', rmFrom('profOff', id), `Métier ${id} : activé`);
      if (op === 'del') C.set('profDel', addTo('profDel', id), `Métier ${id} : supprimé`);
    } else if (kind === 'des') {
      if (op === 'off') C.set('designsOff', addTo('designsOff', id), `Modèle ${name} : désactivé`);
      if (op === 'on') C.set('designsOff', rmFrom('designsOff', id), `Modèle ${name} : activé`);
      if (op === 'del') { C.set('designsDel', addTo('designsDel', id), `Modèle ${name} : supprimé`); if (S.design === id) S.design = null; }
      if (op === 'rec') { const r = cfg('rec', {}); r[S.sectorId] = id; C.set('rec', r, `Modèle recommandé ${sec().name} : ${name}`); }
    } else if (kind === 'pal') {
      const k = NFC.palKey(sec()), i = +id, map = (p) => Object.assign({}, cfg(p, {}));
      const off = map('palOff'), del = map('palDel');
      off[k] = (off[k] || []).filter((x) => x !== i); del[k] = (del[k] || []).filter((x) => x !== i);
      if (op === 'off') off[k].push(i);
      if (op === 'del') del[k].push(i);
      C.set('palOff', off); C.set('palDel', del, `Palette ${(NFC.palsOf(sec())[i] || {}).name} (${sec().name}) : ${op === 'on' ? 'activée' : op === 'off' ? 'désactivée' : 'supprimée'}`);
    }
    save(); render();
    toast(op === 'del' ? 'Supprimé. Restaurable depuis la page admin.' : op === 'off' ? 'Désactivé : caché à vos clients.' : op === 'soon' ? 'Affiché « Bientôt » à vos clients.' : op === 'rec' ? 'Modèle recommandé changé.' : 'Activé : visible par vos clients.');
  }
  /* Ajouter une palette : nom, couleur principale, couleur d’accent ; aperçu immédiat */
  function openPalAdd() {
    const s = sec(), base = (NFC.palsOf(s)[S.palette] || s.palettes[0]);
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
        <h2 id="md-t">Ajouter une palette</h2>
        <p>Pour <b>${esc(s.profile ? profName(s.profile) : s.name)}</b>. Les teintes de fond, de texte et de bordure sont calculées automatiquement.</p>
        <form class="pal-form" data-paladd>
          <label class="f"><span class="f-l">Nom de la palette</span><input name="n" required maxlength="30" placeholder="Ex. Bleu NexTap"></label>
          <div class="row2"><label class="f"><span class="f-l">Couleur principale</span><input type="color" name="p" value="${base.p}"></label><label class="f"><span class="f-l">Couleur d’accent</span><input type="color" name="a" value="${base.a}"></label></div>
          <div class="pal-pv"><span class="sw"><i data-pv="p" style="background:${base.p}"></i><i data-pv="a" style="background:${base.a}"></i><i data-pv="bg" style="background:${base.bg}"></i></span><span>Aperçu</span></div>
          <div class="btns"><button type="submit" class="b pri">Ajouter la palette</button><button type="button" class="b" data-act="modal-close">Annuler</button></div>
        </form>
      </div>`;
    $('#modal').classList.add('on');
    const f = $('[data-paladd]');
    f.addEventListener('input', () => {
      const P = NFC.fullPal('', f.p.value, f.a.value);
      f.querySelector('[data-pv="p"]').style.background = P.p; f.querySelector('[data-pv="a"]').style.background = P.a; f.querySelector('[data-pv="bg"]').style.background = P.bg;
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = f.n.value.trim();
      if (!n) return;
      const k = NFC.palKey(s), add = Object.assign({}, cfg('palAdd', {}));
      add[k] = (add[k] || []).concat([{ name: n, p: f.p.value, a: f.a.value }]);
      NFC.cfg.set('palAdd', add, `Palette ajoutée : ${n} (${s.name})`);
      S.palette = NFC.palsOf(s).length - 1;
      save(); closeModal(); render(); toast('Palette ajoutée et appliquée à l’aperçu.');
    });
  }

  /* ---------- Rendu global ---------- */
  function render() {
    if (S.sectorId && !sec()) S.sectorId = null;
    if (S.sectorId) ensureCard();
    if (S.step > maxStep()) S.step = maxStep();
    $('#steps').innerHTML = STEPS.map((t, i) => {
      const n = i + 1, m = maxStep();
      const cls = n === S.step ? 'cur' : n < S.step ? 'done' : '';
      return `<button class="st ${cls}" data-act="go" data-n="${n}" ${n > m ? 'disabled' : ''}><span class="st-n">${n < S.step ? ic('check', 13) : n}</span><span class="st-t">${t}</span></button>`;
    }).join('');
    $('.reset').innerHTML = `${ic('reset', 16)}<span>Recommencer</span>`;
    const us = $('#uisw'); if (us) us.innerHTML = uiSwitch();
    document.documentElement.lang = ui();
    document.title = X.title ? X.title[ui() === 'en' ? 1 : 0] : 'NexTap Studio';
    const main = $('#main');
    main.innerHTML = [step1, step2, step3, step4, step5][S.step - 1]();
    main.dataset.step = S.step;
    icons();
    if (S.step === 5) drawQR();
    translateTree(document.body);
    reword(document.body);
    const bn = $('.brand-n'), bt = cfg(isStores ? 'brand.stores' : 'brand.studio', '');
    if (bn && bt) { bn.textContent = bt; document.title = bt; }
    fitPreview();
  }
  /* Vocabulaire propre à un autre produit (ex. « ma boutique » au lieu de « ma carte »), hors aperçu de la carte */
  function reword(root) {
    /* Textes remplacés par l’administrateur (en français) */
    const list = ((X.reword && X.reword[ui()]) || []).concat(ui() === 'fr' ? cfg('lang.reword', []).filter((r) => r && r[0]) : []);
    if (!list.length || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest('.vc, script, style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      let t = n.nodeValue;
      list.forEach(([a, b]) => { if (t.includes(a)) t = t.split(a).join(b); });
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }
  /* Téléphone, onglet Aperçu : la carte s’affiche en plein écran, seule la barre Modifier / Aperçu / Publier reste */
  function fitPreview() {
    const full = S.step === 4 && mobileTab === 'view' && window.innerWidth <= 900;
    document.body.classList.toggle('pv-full', full);
    const bar = $('.mbar');
    if (bar) document.body.style.setProperty('--mbar-h', bar.getBoundingClientRect().height + 'px');
  }
  window.addEventListener('resize', () => { clearTimeout(fitPreview.t); fitPreview.t = setTimeout(fitPreview, 150); });
  const icons = () => { if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } }); };

  function renderPreview() {
    const pv = $('#pv');
    if (!pv) return;
    const st = pv.scrollTop;
    pv.innerHTML = VC.render(mdl());
    pv.scrollTop = st;
  }
  const schedulePv = () => { clearTimeout(pvTimer); pvTimer = setTimeout(renderPreview, 120); };

  /* Langue de la carte : « Carte en français | Carte en anglais » et « Bilingue », libellés dans la langue du site */
  const langSwitch = () => {
    const en = ui() === 'en', bi = bili(), fr = lang() === 'fr';
    /* Carte bilingue : les deux boutons choisissent la version à modifier, et un message permanent l’explique */
    const lab = bi ? (en ? ['French version', 'English version'] : ['Version française', 'Version anglaise']) : (en ? ['French card', 'English card'] : ['Carte en français', 'Carte en anglais']);
    /* Hors carte bilingue, seule la version dans la langue du site est accessible */
    const off = en ? 'Tick “Bilingual” to add the French version' : 'Cochez « Bilingue » pour ajouter la version anglaise';
    const note = !bi ? '' : en
      ? `<p class="bili-note">${ic('globe', 15)}<span><b>Bilingual profile:</b> visitors tap FR or EN on your profile to pick their language. Make sure to fill in both versions.</span></p>`
      : `<p class="bili-note">${ic('globe', 15)}<span><b>Carte bilingue :</b> sur votre carte, le visiteur touche FR ou EN pour choisir sa langue. Il faut veiller à renseigner les deux versions.</span></p>`;
    return `<div class="lang-sw"><div class="seg" role="group" aria-label="${bi ? (en ? 'Version to edit' : 'Version à modifier') : (en ? 'Card language' : 'Langue de la carte')}">
      <button type="button" class="${fr ? 'on' : ''}" data-act="lang" data-v="fr" ${!bi && !fr ? `disabled title="${off}"` : ''}>${lab[0]}</button><button type="button" class="${!fr ? 'on' : ''}" data-act="lang" data-v="en" ${!bi && fr ? `disabled title="${off}"` : ''}>${lab[1]}</button></div>
      ${!cfg('lang.bili', true) || !plan().bili ? '' : `<label class="ck bili-ck" title="${en ? 'Adds an FR | EN button to the card: visitors choose their language' : 'Affiche un bouton FR | EN sur la carte : le visiteur choisit sa langue'}"><input type="checkbox" data-act="bili" ${bi ? 'checked' : ''}><span>${en ? 'Bilingual' : 'Bilingue'}</span></label>`}${note}</div>`;
  };
  const head = (t, p) => `<div class="sh"><h1>${t}</h1>${p ? `<p>${p}</p>` : ''}</div>`;
  const back = (n, label) => `<button class="back" data-act="go" data-n="${n}">${ic('arrowl', 16)}${label}</button>`;
  const phone = () => `<div class="phone live"><div class="phone-screen" id="pv" data-vc-scroll>${VC.render(mdl())}</div></div>`;

  /* ---------- Étape 1 : secteur ---------- */
  /* ---------- Avant l’étape 1 : avez-vous déjà un QR code ? ---------- */
  function step0() {
    return `<section class="wrap start">
      ${head('Avez-vous déjà un QR code ?', 'Si votre carte NFC vous a été livrée avec un QR code et un lien déjà imprimés, votre nouvelle carte de visite sera reliée à ce lien.')}
      <div class="qa">
        <button class="qa-o" data-act="hasqr" data-v="yes">
          <span class="qa-ic">${ic('qr', 26)}</span>
          <span class="qa-t">Oui, j’ai déjà un QR code</span>
          <span class="qa-d">Je le scanne, puis je crée ma carte. Rien à réimprimer.</span>
          <span class="qa-go">Scanner mon QR code ${ic('arrow', 16)}</span>
        </button>
        <button class="qa-o" data-act="hasqr" data-v="no">
          <span class="qa-ic alt">${ic('plus', 26)}</span>
          <span class="qa-t">Non, pas encore</span>
          <span class="qa-d">Je crée ma carte d’abord : le lien et le QR code seront créés à la fin.</span>
          <span class="qa-go">Créer ma carte ${ic('arrow', 16)}</span>
        </button>
      </div>
    </section>`;
  }
  const qrNote = () => (hasQR()
    ? `<div class="qr-note on">${ic('check', 16)}<span>Carte reliée à votre QR code : <code>${esc(S.qr.url)}</code></span><button type="button" class="linkish" data-act="qrreset">Changer</button></div>`
    : `<div class="qr-note">${ic('qr', 16)}<span>Pas encore de QR code : il sera créé à la fin, avec votre lien.</span><button type="button" class="linkish" data-act="hasqr" data-v="yes">J’ai déjà un QR code</button></div>`);

  /* Photo d’arrière-plan de chaque secteur : la couverture de sa carte d’exemple */
  const bgOf = (s) => ((NFC.MEDIA || {})[s.id] || {}).cover || (s.demo && s.demo.identity && s.demo.identity.cover) || '';

  /* ---------- Étape 1 bis : le métier, pour les secteurs qui en proposent plusieurs ---------- */
  let profPick = false;
  function stepProf() {
    const b = baseSec(), cur = prof(), en = ui() === 'en';
    const tiles = b.profiles.filter((p) => (ADM() ? !profDel(b, p) : profOk(b, p))).map((p) => admWrap(`
      <button class="tile has-bg ${cur && cur.id === p.id && S.design ? 'sel' : ''} ${ADM() && !profOk(b, p) ? 'adm-off' : ''}" data-act="profile" data-id="${p.id}" style="background-image:url('${(p.media && p.media.cover) || ''}')">
        <span class="tile-top"><span class="tile-ic"><i data-lucide="${p.icon}"></i></span></span>
        <span class="tile-n">${p.n[en ? 1 : 0]}</span>
        <span class="tile-ex">${p.ex[en ? 1 : 0]}</span>
      </button>`, 'prof', b.id + '~' + p.id, profOk(b, p) ? 'on' : 'off')).join('');
    return `<section class="wrap">${admBar()}
      <button class="back" data-act="profback">${ic('arrowl', 16)}${en ? 'Change industry' : 'Changer de secteur'}</button>
      ${head(en ? 'What is your profession?' : 'Quel est votre métier ?', en ? `${b.profiles.length} profiles for <b>${b.name}</b>, each with its own example, colors and photos. Everything stays customizable.` : `${b.profiles.length} métiers pour <b>${b.name}</b>, chacun avec son exemple, ses couleurs et ses photos. Tout reste personnalisable.`)}
      <div class="tiles">${tiles}</div>
    </section>`;
  }
  function pickProfile(pid) {
    const b = baseSec();
    S.prof = S.prof || {};
    if ((S.prof[b.id] || b.profiles[0].id) !== pid) S.design = null;
    S.prof[b.id] = pid;
    profPick = false;
    S.palette = 0;
    ensureCard();
    go(2);
  }

  function step1() {
    if (S.qr === undefined) return step0();
    if (profPick && baseSec() && baseSec().profiles) return stepProf();
    const tiles = secList().map((s) => admWrap(`
      <button class="tile ${secSoon(s) ? 'soon' : ''} ${ADM() && secOff(s) ? 'adm-off' : ''} ${S.sectorId === s.id ? 'sel' : ''} ${bgOf(s) ? 'has-bg' : ''}" data-act="sector" data-id="${s.id}"${bgOf(s) ? ` style="background-image:url('${bgOf(s)}')"` : ''}>
        <span class="tile-top"><span class="tile-ic"><i data-lucide="${s.icon}"></i></span><span class="tile-code">${s.code}</span>${secSoon(s) ? '<span class="tile-b">Bientôt</span>' : ''}</span>
        <span class="tile-n">${s.name}</span>
        <span class="tile-ex">${s.ex}</span>
      </button>`, 'sec', s.id, secOff(s) ? 'off' : cfg('sectors.soon', []).includes(s.id) ? 'soon' : 'on', true)).join('');
    return `<section class="wrap">${admBar()}
      ${X.pick ? head(...X.pick) : head('Quel est votre secteur d’activité ?', 'Choisissez le secteur le plus proche de votre activité. Votre fonction, vos textes et vos blocs restent entièrement personnalisables ensuite.')}
      <div class="sq">
        <label class="sq-f"><i data-lucide="search"></i><input type="search" id="secq" autocomplete="off" spellcheck="false" placeholder="${X.searchPh || 'Cherchez votre métier ou votre secteur (ex. médecin, ingénieur, avocat)'}" aria-label="${X.searchPh || 'Cherchez votre métier ou votre secteur'}"></label>
        <div class="sq-r" id="secqr"></div>
        <p class="sq-none" id="secqn" hidden>Aucun résultat. Essayez un autre mot, ou choisissez le secteur le plus proche ci-dessous.</p>
      </div>
      <div class="tiles">${tiles}
      </div>
    </section>`;
  }

  /* ---------- Recherche du secteur (et du métier) ---------- */
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const enOf = (t) => (window.NFC_EN_APP || {})[t] || (window.NFC_EN_UI || {})[t] || '';
  /* Mots fréquents qui ne figurent pas dans le nom du secteur */
  const KW = {
    sante: 'medecin docteur dentiste infirmiere physiotherapeute kinesitherapeute psychologue chiropraticien osteopathe optometriste nutritionniste clinique doctor nurse therapist',
    conseil: 'avocat notaire comptable fiscaliste conseiller financier banquier assureur courtier lawyer accountant advisor insurance',
    pro: 'representant vendeur directeur gestionnaire entrepreneur cadre sales manager networking',
    freelance: 'ingenieur engineer developpeur programmeur informaticien consultant designer redacteur traducteur developer programmer it',
    immobilier: 'courtier immobilier agent immobilier realtor broker',
    archi: 'ingenieur engineer architecte decorateur designer interieur paysagiste architect interior',
    artisans: 'electricien plombier menuisier charpentier couvreur peintre macon renovation entrepreneur construction handyman contractor electrician plumber',
    beaute: 'coiffeur coiffeuse barbier estheticienne manucure ongles spa massage maquilleuse hairdresser barber nails',
    coaching: 'entraineur coach sportif yoga pilates professeur musique formateur trainer fitness',
    restaurant: 'restaurateur chef cuisinier cafe bar pizzeria boulangerie cook',
    producteurs: 'agriculteur fermier maraicher boulanger fromager vigneron farmer baker',
    evenementiel: 'photographe mariage traiteur dj planner wedding',
    portfolio: 'photographe graphiste illustrateur tatoueur artiste photographer artist',
    musique: 'musicien chanteur dj comedien artiste musician singer',
    influence: 'influenceur youtubeur createur contenu tiktok instagram creator',
    hebergement: 'hotel gite chalet airbnb location salle',
    tourisme: 'guide voyage excursion tour',
    animaux: 'veterinaire toiletteur educateur canin promeneur chien chat vet groomer dog',
    boutiques: 'commerce magasin vendeur artisan createur shop store',
    auto: 'mecanicien garagiste carrossier chauffeur taxi vtc concessionnaire mechanic driver',
    education: 'eleve etudiante orientation orthopedagogue directrice principal enseignement formation formatrice charge de cours conferencier enseignant enseignante professeure prof tuteur tutrice stage educatrice garderie cpe ecole universite cegep college teacher tutor school',
  };
  /* Liste de métiers sans carte propre (js/jobs.js) : chacun renvoie vers son secteur */
  const JOBS = [].concat(...Object.entries(NFC.JOBS || {}).map(([sid, list]) => list.split('|').map((n) => ({ n, sid, h: norm(n) }))))
    .concat(cfg('jobs', []).filter((j) => j && j[0] && j[1]).map(([n, sid]) => ({ n, sid, h: norm(n) })));
  const secHay = (s) => norm([s.name, s.ex, enOf(s.name), enOf(s.ex), s.kw || '', KW[s.id] || '', (NFC.JOBS || {})[s.id] || ''].concat(...(s.profiles || []).map((p) => p.n.concat(p.ex))).join(' '));
  function filterSectors(q) {
    const words = norm(q).split(/\s+/).filter(Boolean), en = ui() === 'en';
    /* Un mot tapé doit être le début d’un mot du métier ou du secteur (« data » ne trouve pas « mandataire ») */
    const hit = (h) => { const toks = h.split(/[^a-z0-9]+/); return words.every((w) => { const st = w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w; return toks.some((t) => t.startsWith(st)); }); };
    let n = 0;
    document.querySelectorAll('.tiles [data-act="sector"]').forEach((el) => {
      const s = SECTORS.find((x) => x.id === el.dataset.id), ok = !words.length || (s && hit(secHay(s)));
      (el.closest('.adm-w') || el).hidden = !ok;
      if (ok) n++;
    });
    /* Métiers correspondants : un clic ouvre directement le bon exemple */
    const profs = !words.length ? [] : [].concat(...secList().filter((s) => !secSoon(s) && s.profiles)
      .map((s) => s.profiles.filter((p) => profOk(s, p) && hit(norm(p.n.concat(p.ex).join(' ')))).map((p) => ({ s, p })))).slice(0, 8);
    /* Puis les métiers de la liste, ceux qui commencent par le mot tapé en premier */
    const seen = new Set(profs.map(({ p }) => norm(p.n[0])));
    const jobs = !words.length ? [] : JOBS.filter((j) => hit(j.h) && !seen.has(j.h) && secList().some((s) => s.id === j.sid))
      .sort((a, b) => (b.h.startsWith(words[0]) - a.h.startsWith(words[0])) || a.h.length - b.h.length).slice(0, Math.max(0, 8 - profs.length));
    const secName = (sid) => { const s = SECTORS.find((x) => x.id === sid); return s ? (en ? enOf(s.name) || s.name : s.name) : ''; };
    const icOf = (sid) => (SECTORS.find((x) => x.id === sid) || {}).icon || 'briefcase';
    const box = $('#secqr'), none = $('#secqn');
    if (box) box.innerHTML = profs.length || jobs.length ? `<span class="sq-l">${en ? 'Matching professions' : 'Métiers trouvés'}</span><div class="sq-ps">${profs.map(({ s, p }) => `<button type="button" class="sq-p" data-act="profgo" data-s="${s.id}" data-p="${p.id}"><i data-lucide="${p.icon}"></i><b>${esc(p.n[en ? 1 : 0])}</b><span>${esc(secName(s.id))}</span></button>`).join('')}${jobs.map((j) => `<button type="button" class="sq-p" data-act="sector" data-id="${j.sid}"><i data-lucide="${icOf(j.sid)}"></i><b>${esc(j.n)}</b><span>${esc(secName(j.sid))}</span></button>`).join('')}</div>` : '';
    if (none) none.hidden = n > 0 || profs.length > 0 || jobs.length > 0;
    icons();
  }
  document.addEventListener('input', (e) => { if (e.target.id === 'secq') filterSectors(e.target.value); });
  document.addEventListener('keydown', (e) => {
    if (e.target.id !== 'secq' || e.key !== 'Enter') return;
    e.preventDefault();
    const first = document.querySelector('.sq-p, .tiles [data-act="sector"]:not([hidden])');
    if (first) first.click();
  });

  function pickSector(id, fromOther) {
    const s = SECTORS.find((x) => x.id === id);
    if (secSoon(s) || secOff(s)) {
      toast(`« ${s.name} » arrive bientôt.`);
      return;
    }
    if (S.sectorId !== id) { S.sectorId = id; S.design = null; }
    if (s.profiles && !fromOther) { profPick = true; S.step = 1; save(); render(); window.scrollTo(0, 0); return; }
    ensureCard();
    if (fromOther) toast(`Nous vous proposons « ${s.name} ». Tout reste personnalisable.`);
    go(2);
  }

  function openOther() {
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
        <h2 id="md-t">Que doivent faire vos visiteurs en priorité ?</h2>
        <p>Nous choisirons la structure la plus adaptée. Vous pourrez ensuite tout modifier.</p>
        <div class="opts">${OTHER.map((o) => `<button class="opt" data-act="other-pick" data-id="${o.sector}"><i data-lucide="${o.icon}"></i><span>${o.label}</span>${ic('arrow', 16)}</button>`).join('')}</div>
      </div>`;
    $('#modal').classList.add('on');
    icons();
  }
  const closeModal = () => { stopCam(); $('#modal').classList.remove('on'); $('#modal').innerHTML = ''; };

  /* ---------- Scan du QR code déjà imprimé sur la carte ----------
     Caméra (BarcodeDetector, sinon jsQR), photo du QR code, ou saisie du lien imprimé. */
  let scanStream = null, scanRAF = 0, pendingQR = null;
  function parseQR(txt) {
    const t = String(txt || '').trim();
    if (!t) return null;
    if (/^https?:\/\//i.test(t)) {
      try {
        const u = new URL(t), segs = u.pathname.split('/').filter(Boolean);
        return { url: t, id: String(u.searchParams.get('id') || segs[segs.length - 1] || u.hostname).slice(0, 40) };
      } catch (e) { return null; }
    }
    if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(t)) return parseQR('https://' + t);
    if (/^[A-Za-z0-9-]{4,24}$/.test(t)) return { url: QR_BASE + t.toUpperCase(), id: t.toUpperCase() };
    return null;
  }
  function openScan() {
    pendingQR = null;
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md scan-md" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
        <h2 id="md-t">Scannez le QR code de votre carte</h2>
        <p>Placez le QR code imprimé sur votre carte NFC dans le cadre.</p>
        <div class="scan-v" id="scanv"><video id="scanvid" playsinline muted></video><span class="scan-fr"></span></div>
        <p class="scan-st" id="scanst" role="status">Ouverture de la caméra…</p>
        <div class="scan-alt">
          <label class="b">${ic('camera', 16)}Prendre ou importer une photo du QR code<input type="file" accept="image/*" capture="environment" hidden data-qrimg></label>
          <form class="f scan-man" data-qrform novalidate>
            <label class="f-l" for="qrman">Ou saisissez le lien imprimé sous le QR code</label>
            <div class="linkrow"><input id="qrman" type="text" inputmode="url" autocomplete="off" spellcheck="false" placeholder="votre-site.com/c/K7M4QX"><button class="b pri sm" type="submit">Valider</button></div>
          </form>
        </div>
      </div>`;
    $('#modal').classList.add('on');
    startCam();
  }
  const scanMsg = (m, bad) => { const st = $('#scanst'); if (st) { st.textContent = m; st.classList.toggle('bad', !!bad); } };
  function stopCam() {
    cancelAnimationFrame(scanRAF);
    if (scanStream) scanStream.getTracks().forEach((t) => t.stop());
    scanStream = null;
  }
  const detector = () => { try { return 'BarcodeDetector' in window ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null; } catch (e) { return null; } };
  const qrCanvas = document.createElement('canvas');
  async function decodeQR(src, w, h, det) {
    if (det) { try { const r = await det.detect(src); return r[0] ? r[0].rawValue : null; } catch (e) { /* on passe à jsQR */ } }
    if (!window.jsQR || !w || !h) return null;
    const k = Math.min(1, 900 / Math.max(w, h)), c = qrCanvas;
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(src, 0, 0, c.width, c.height);
    const r = window.jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: 'attemptBoth' });
    return r ? r.data : null;
  }
  async function startCam() {
    const v = $('#scanvid'), box = $('#scanv');
    const off = () => { if (box) box.classList.add('off'); scanMsg('Caméra indisponible ici : prenez une photo du QR code ou saisissez le lien imprimé.'); };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return off();
    try { scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); }
    catch (e) { return off(); }
    if (!$('#scanvid')) { stopCam(); return; }
    v.srcObject = scanStream;
    try { await v.play(); } catch (e) { /* lecture automatique refusée */ }
    scanMsg('Recherche du QR code…');
    const det = detector();
    let last = 0;
    const tick = async (ts) => {
      if (!scanStream) return;
      if (ts - last > 180 && v.readyState >= 2) {
        last = ts;
        const txt = await decodeQR(v, v.videoWidth, v.videoHeight, det);
        if (txt && gotQR(txt)) return;
      }
      scanRAF = requestAnimationFrame(tick);
    };
    scanRAF = requestAnimationFrame(tick);
  }
  function gotQR(txt) {
    const p = parseQR(txt);
    if (!p) { scanMsg('Ce QR code ne contient pas de lien de carte. Essayez celui imprimé sur votre carte NFC.', true); return false; }
    stopCam();
    pendingQR = p;
    const md = $('.scan-md');
    if (md) md.innerHTML = `<button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
      <span class="scan-ok">${ic('check', 24)}</span>
      <h2 id="md-t">QR code reconnu</h2>
      <p>Votre nouvelle carte de visite sera reliée à ce lien. Le QR code et la puce NFC de votre carte n’auront pas besoin d’être changés.</p>
      <div class="linkrow"><code>${esc(p.url)}</code></div>
      <div class="btns scan-btns"><button class="b pri" data-act="qrstart">Commencer à créer ma carte ${ic('arrow', 16)}</button><button class="b" data-act="hasqr" data-v="yes">Scanner un autre QR code</button></div>`;
    return true;
  }

  /* ---------- Étape 2 : modèle ---------- */
  function step2() {
    const s = sec();
    const dOff = (d) => cfg('designsOff', []).includes(d.id);
    const cards = designsNow().map((d) => `
      <div class="tpl ${S.design === d.id ? 'sel' : ''} ${ADM() && dOff(d) ? 'adm-off' : ''}" role="button" tabindex="0" aria-label="Choisir le modèle ${d.name}" data-act="design" data-id="${d.id}">
        <div class="tpl-view"><div class="thumb" aria-hidden="true"><div class="phone"><div class="phone-screen">${VC.render(Object.assign(mdl(d.id), { thumb: true }))}</div></div></div>
          <button type="button" class="tpl-zoom" data-act="fullpreview" data-id="${d.id}" aria-label="Aperçu plein écran du modèle ${d.name}">${ic('eye', 15)}Aperçu</button></div>
        <div class="tpl-meta">
          <div class="tpl-top"><span class="tpl-n">${d.name}</span>${recOf(s) === d.id ? '<span class="rec">Recommandé</span>' : ''}</div>
          <p>${d.desc}</p>
          <div class="tpl-foot"><span class="tpl-code">${s.code}-${d.id.toUpperCase()}</span><span class="tpl-go">Choisir ${ic('arrow', 14)}</span></div>
          ${ADM() ? admTools('des', d.id, dOff(d) ? 'off' : 'on', false, recOf(s) === d.id) : ''}
        </div>
      </div>`).join('');
    return `<section class="wrap">${admBar()}
      ${back(1, X.backTo || 'Changer de secteur')}${s.profiles ? `<button class="back" data-act="profpick">${ic('arrowl', 16)}${ui() === 'en' ? 'Change profession' : 'Changer de métier'}</button>` : ''}
      ${langSwitch()}
      ${head('Choisissez votre modèle', `${designsNow().length} mises en page pour <b>${s.profile ? profName(s.profile) : s.name}</b>. Cliquez pour choisir, vous pourrez en changer à tout moment sans perdre vos informations. Les couleurs viennent à la page suivante.`)}
      <div class="tpls">${cards}</div>
    </section>`;
  }

  /* ---------- Étape 3 : couleurs ---------- */
  function step3() {
    const s = sec();
    const PS = NFC.palsOf ? NFC.palsOf(s) : s.palettes;
    const pst = (i) => (NFC.palState ? NFC.palState(s, i) : 'on');
    const nPal = PS.filter((x, i) => pst(i) === 'on').length;
    /* Clients : palettes actives seulement (la palette déjà choisie reste affichée) ; administrateur : aussi les désactivées */
    const pals = PS.map((p, i) => [p, i]).filter(([, i]) => i === S.palette || (ADM() ? pst(i) !== 'del' : pst(i) === 'on')).map(([p, i]) => admWrap(`
      <button class="pal ${S.palette === i ? 'sel' : ''} ${ADM() && pst(i) !== 'on' ? 'adm-off' : ''}" data-act="palette" data-i="${i}">
        <span class="sw"><i style="background:${p.p}"></i><i style="background:${p.a}"></i><i style="background:${p.bg}"></i></span>
        <span class="pal-n">${esc(p.name)}</span>
        <span class="pal-ck">${ic('check', 16)}</span>
      </button>`, 'pal', String(i), pst(i) === 'on' ? 'on' : 'off')).join('') + (ADM() ? `<button type="button" class="pal pal-add" data-act="adm" data-op="paladd">${ic('plus', 16)}<span class="pal-n">Ajouter une palette</span></button>` : '');
    /* Titre dans la colonne de gauche : sur ordinateur, l’aperçu remonte en haut, à côté du titre */
    return `<section class="wrap s3w">${admBar()}
      <div class="split s3">
        <div class="side">
          ${back(2, 'Changer de modèle')}
          ${head('Choisissez vos couleurs', `Modèle <b>${designOf(S.design).name}</b> · ${nPal === 6 ? '6 palettes pensées pour votre secteur.' : ui() === 'en' ? `${nPal} palettes designed for your industry.` : `${nPal} palettes pensées pour votre secteur.`}`)}
          <div class="pals">${pals}</div>
          <p class="muted small">Une couleur personnalisée ou extraite de votre logo pourra être ajoutée plus tard.</p>
          <button class="b pri lg" data-act="go" data-n="4">Remplir mes informations ${ic('arrow', 18)}</button>
        </div>
        <div class="pv-col">${phone()}</div>
      </div>
    </section>`;
  }

  /* ---------- Étape 4 : contenu ---------- */
  function step4() {
    const s = sec(), p = (NFC.palsOf ? NFC.palsOf(s) : s.palettes)[S.palette] || s.palettes[0];
    return `<section class="wrap wide">
      <div class="ed-bar">
        <div class="ed-info"><span class="code">${code()}${lang() === 'en' ? ' · EN' : ''}</span><span>${s.profile ? profName(s.profile) : s.name} · ${designOf(S.design).name} · ${p.name}</span></div>
        <div class="ed-links">
          ${langSwitch()}
          ${svcOn('ai:edit') && plan().ai ? '<button class="b sm ai-b" data-act="aiedit"><i data-lucide="sparkles"></i>Éditer avec l’IA</button>' : ''}
          <button class="b sm" data-act="go" data-n="2"><i data-lucide="layout-template"></i><span class="lbl-l">Changer de modèle</span><span class="lbl-s">Modèle</span></button>
          <button class="b sm" data-act="go" data-n="3"><i data-lucide="palette"></i><span class="lbl-l">Changer de couleurs</span><span class="lbl-s">Couleurs</span></button>
        </div>
      </div>
      <div class="mtabs">
        <button class="${mobileTab === 'edit' ? 'on' : ''}" data-act="mtab" data-t="edit">Modifier</button>
        <button class="${mobileTab === 'view' ? 'on' : ''}" data-act="mtab" data-t="view">Aperçu</button>
      </div>
      <div class="mbar">
        <div class="seg mbar-seg" role="group" aria-label="Modifier ou aperçu">
          <button type="button" class="${mobileTab === 'edit' ? 'on' : ''}" data-act="mtab" data-t="edit">${ic('file', 15)}Modifier</button>
          <button type="button" class="${mobileTab === 'view' ? 'on' : ''}" data-act="mtab" data-t="view">${ic('eye', 15)}Aperçu</button>
        </div>
        <button class="b pri sm" data-act="go" data-n="5">${ic('nfc', 15)}Publier</button>
      </div>
      <div class="ed-grid tab-${mobileTab}">
        <div class="ed" id="ed">${editor()}</div>
        <div class="pv-col stick">${phone()}<p class="pv-hint">Aperçu en direct · cliquez sur une section pour la modifier</p></div>
      </div>
      <div class="ed-foot"><button class="b pri lg" data-act="go" data-n="5">Publier ma carte ${ic('arrow', 18)}</button></div>
    </section>`;
  }

  const inp = (label, path, o = {}) => `<label class="f"><span class="f-l">${label}</span><input type="${o.type || 'text'}" data-path="${path}" value="${esc(g(path))}" placeholder="${esc(o.ph || '')}"${o.attrs || ''}>${o.hint ? `<span class="f-h">${o.hint}</span>` : ''}</label>`;
  const area = (label, path, o = {}) => `<label class="f"><span class="f-l">${label}</span><textarea rows="${o.rows || 4}" data-path="${path}" placeholder="${esc(o.ph || '')}">${esc(g(path))}</textarea>${o.hint ? `<span class="f-h">${o.hint}</span>` : ''}</label>`;
  const mini = (path, ph, cls = '') => `<input class="mini ${cls}" data-path="${path}" value="${esc(g(path))}" placeholder="${esc(ph)}">`;
  const del = (path, i, label = 'Supprimer') => `<button class="ib" data-act="del" data-path="${path}" data-i="${i}" aria-label="${label}" title="${label}">${ic('trash', 16)}</button>`;
  const add = (path, tpl, label) => `<button class="add" data-act="add" data-path="${path}" data-tpl="${tpl}">${ic('plus', 16)}${label}</button>`;
  const thumbF = (path) => {
    const v = g(path);
    return `<label class="thf" title="${v ? 'Changer la photo' : 'Ajouter une photo'}">${v ? `<img src="${VC.img(v, mdl())}" alt="">` : ic('image', 18)}<input type="file" accept="image/*" hidden data-img="${path}"></label>`;
  };
  function imgF(label, path) {
    const v = g(path);
    return `<div class="f"><span class="f-l">${label}</span><div class="imgf">
      ${v ? `<img src="${VC.img(v, mdl())}" alt="">` : `<span class="imgf-e">${ic('image', 20)}</span>`}
      <div class="imgf-a"><label class="b xs">${v ? 'Changer' : 'Ajouter'}<input type="file" accept="image/*" hidden data-img="${path}"></label>${v ? `<button class="b xs ghost" data-act="imgdel" data-path="${path}">Retirer</button>` : ''}</div>
    </div></div>`;
  }

  function grp(id, title, sub, body, togglePath, ctl = '', key = '', cls = '') {
    const on = togglePath ? !!g(togglePath) : true;
    return `<div class="grp ${cls} ${openGroups.has(id) ? 'open' : ''} ${on ? '' : 'off'}" data-grp="${id}"${key ? ` data-key="${key}"` : ''}>
      <div class="grp-h">
        ${ctl ? `<span class="drag" title="Glisser pour déplacer" aria-hidden="true">${GRIP}</span>` : ''}
        <button type="button" class="grp-tg" data-act="grp" data-id="${id}"><span class="grp-tt"><span class="grp-t">${title}</span>${sub ? `<span class="grp-s">${sub}</span>` : ''}</span>${ic('chevd', 18)}</button>
        ${ctl}
        ${togglePath ? `<label class="sw-t" title="Afficher ce bloc"><input type="checkbox" data-path="${togglePath}" data-struct="toggle" ${on ? 'checked' : ''}><span></span></label>` : ''}
      </div>
      <div class="grp-b">${body}<button type="button" class="b sm done-b" data-act="done" data-id="${id}">${ic('check', 15)}Terminé</button></div>
    </div>`;
  }

  function primaryOptions() {
    const s = sec(), c = card();
    const opts = [['call', 'Appeler'], ['whatsapp', 'Écrire sur WhatsApp'], ['email', 'Envoyer un email'], ['save', 'Enregistrer le contact']];
    s.blocks.filter((b) => b.cta).forEach((b) => opts.splice(0, 0, [b.key, `${b.cta} (bloc « ${b.title} »)`]));
    return opts.map(([k, l]) => `<option value="${k}" ${c.primary === k ? 'selected' : ''}>${l}</option>`).join('');
  }

  function editor() {
    const s = sec();
    const est = !!s.establishment;
    let h = grp('identity', 'Identité', est ? 'Nom, activité, logo' : 'Nom, fonction, photo', `
      ${inp(est ? 'Nom de l’établissement' : 'Nom et prénom', 'identity.name')}
      <div class="row2">${inp(est ? 'Activité' : 'Fonction', 'identity.role', { ph: est ? 'Ex. Bistrot' : 'Ex. Attaché commercial' })}${inp('Entreprise', 'identity.company', { ph: 'Facultatif' })}</div>
      ${inp('Spécialité ou accroche', 'identity.specialty', { ph: 'Ex. Gestion de patrimoine', hint: 'S’affiche sous votre fonction. Facultatif.' })}
      <div class="row3">${imgF(est ? 'Photo / logo principal' : 'Photo de profil', 'identity.photo')}${imgF('Logo', 'identity.logo')}${imgF('Image de couverture', 'identity.cover')}</div>
      ${coverEd()}`);
    h += grp('contact', 'Coordonnées & action principale', 'Téléphone, email, site', `
      <div class="row2">${inp('Téléphone', 'contact.phone', { type: 'tel' })}${inp('WhatsApp', 'contact.whatsapp', { type: 'tel', hint: 'Format international : +33 6…' })}</div>
      <div class="row2">${inp('Email', 'contact.email', { type: 'email' })}${inp('Site web', 'contact.website', { ph: 'monsite.fr' })}</div>
      <label class="f"><span class="f-l">Action principale</span><select data-path="primary">${primaryOptions()}</select><span class="f-h">Le gros bouton toujours visible en bas de la carte.</span></label>`);
    h += grp('leads', 'Échange de contacts', 'Ce que reçoit la personne rencontrée, et comment vous recevez ses coordonnées', leadsEd());
    normSocials(card());
    const socRow = ([k, l]) => { const on = !!(card().socialsOn || {})[k]; return `<div class="soc-f ${on ? 'on' : ''}" data-socf="${k}">
        <label class="soc-ck" title="Afficher ${l} sur la carte"><input type="checkbox" data-path="socialsOn.${k}" data-socck="${k}" ${on ? 'checked' : ''}><span class="soc-lg">${VC.brandIc(k, 18)}</span><span class="soc-n">${l}</span></label>
        <input type="text" data-path="socials.${k}" data-soc="${k}" inputmode="url" spellcheck="false" value="${esc(g('socials.' + k))}" placeholder="${VC.SOC_BASE[k]}…" aria-label="Adresse ${l}">
      </div>`; };
    h += grp('socials', 'Réseaux sociaux', 'Cochez vos réseaux, complétez l’adresse', `<div class="soc-ed">${VC.SOC.filter(([k]) => svcOn('soc:' + k) || (card().socialsOn || {})[k]).map(socRow).join('')}</div>`);
    h += sectionsEd();
    return h;
  }

  function coverEd() {
    const id = card().identity, video = id.coverType === 'video';
    const kind = id.coverVideoFile ? 'Vidéo téléversée' : id.coverVideoUrl ? 'Lien vidéo' : id.coverVideo ? 'Vidéo d’exemple' : '';
    const cur = VC.vsrc(id.coverVideoFile) || id.coverVideoUrl || id.coverVideo;
    return `<div class="f"><span class="f-l">Couverture</span>
        <div class="seg" role="group" aria-label="Type de couverture"><button type="button" class="${video ? '' : 'on'}" data-act="setcover" data-v="image">${ic('image', 15)}Image</button>${plan().video || video ? `<button type="button" class="${video ? 'on' : ''}" data-act="setcover" data-v="video">${ic('play', 13)}Vidéo</button>` : ''}</div></div>
      ${video ? `<div class="cover-vid">
          ${cur ? `<div class="demo-vid"><video src="${esc(cur)}" muted playsinline preload="metadata"></video><div><b>${kind}</b><span>Démarre sans le son et tourne en boucle.</span>${id.coverVideoFile || id.coverVideoUrl ? `<button class="b xs ghost" data-act="coverclear">Retirer ma vidéo</button>` : ''}</div></div>` : ''}
          <div class="f"><span class="f-l">Votre vidéo de couverture</span>
            <div class="vsrc"><label class="b sm pri">${ic('upload', 15)}Téléverser une vidéo<input type="file" accept="video/mp4,video/webm,video/quicktime" hidden data-vid="identity.cover"></label><span class="f-h">MP4, WebM ou MOV, 60 Mo maximum. Idéalement 10 à 30 secondes.</span></div>
          </div>
          ${inp('Ou collez un lien vers la vidéo', 'identity.coverVideoUrl', { ph: 'https://…/ma-video.mp4', hint: 'Lien direct vers un fichier vidéo (.mp4). Les liens YouTube ne peuvent pas servir de couverture.' })}
        </div>` : ''}
      <p class="f-h">La couverture apparaît dans les modèles Showcase, Immersive, Classic, Mosaic et Wave. L’image de couverture sert aussi d’affiche à la vidéo.</p>`;
  }

  const galEd = (path, images, help) => `<div class="gal-ed">${(images || []).map((x, i) => `<div class="gt"><div class="gt-im"><img src="${VC.img(x.src, mdl())}" alt="">${del(path, i, 'Retirer la photo')}</div>${mini(`${path}.${i}.cap`, 'Légende')}</div>`).join('')}
      <label class="gt add-ph">${ic('plus', 22)}<span>Ajouter des photos</span><input type="file" accept="image/*" multiple hidden data-gal="${path}"></label></div>
      <p class="f-h">${help ? help + ' · ' : ''}Les photos d’exemple sont remplacées dès votre premier ajout.</p>`;

  const SEC_TYPES = { text: ['Texte', 'file'], gallery: ['Galerie d’images', 'image'], imgcar: ['Carrousel d’images', 'copy'], vidcar: ['Carrousel de vidéos', 'play'] };

  const GRIP = '<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><circle cx="4" cy="3" r="1.6"/><circle cx="10" cy="3" r="1.6"/><circle cx="4" cy="9" r="1.6"/><circle cx="10" cy="9" r="1.6"/><circle cx="4" cy="15" r="1.6"/><circle cx="10" cy="15" r="1.6"/></svg>';

  function customBody(c, i) {
    const base = `custom.${i}`, label = SEC_TYPES[c.type][0];
    let body = inp('Titre de la section', base + '.title', { ph: label });
    if (c.type === 'text') body += area('Texte', base + '.text', { rows: 5 });
    if (c.type === 'gallery') {
      const n = +c.layout || 2;
      body += `<div class="f"><span class="f-l">Disposition</span><div class="seg">${[1, 2, 4].map((k) => `<button type="button" class="${n === k ? 'on' : ''}" data-act="layout" data-i="${i}" data-v="${k}">${k} image${k > 1 ? 's' : ''}</button>`).join('')}</div><span class="f-h">${n > 1 ? `Les ${n} premières images sont affichées.` : 'La première image est affichée.'}</span></div>${galEd(base + '.images', c.images)}`;
    }
    if (c.type === 'imgcar') body += galEd(base + '.images', c.images, 'Les images défilent horizontalement');
    if (c.type === 'vidcar') {
      body += `<div class="items">${(c.videos || []).map((v, j) => { const p = `${base}.videos.${j}`; return `<div class="it">${thumbF(p + '.cover')}<div class="it-f">${vidSource(p, v.src, v.url)}${mini(p + '.url', 'ou collez un lien (YouTube, Vimeo, .mp4)', 'full')}${mini(p + '.cap', 'Légende', 'full')}</div>${del(base + '.videos', j)}</div>`; }).join('')}</div>${add(base + '.videos', 'vid', 'Ajouter une vidéo')}`;
    }
    return body;
  }

  /* ---------- Catalogue « Ajouter une section » ----------
     Tous les types que la carte sait afficher, quel que soit le secteur. Chaque section arrive pré-remplie d’un exemple
     dans la langue de la carte. g = groupe, n/d = nom et description (fr, en). */
  const CAT_GROUPS = [['content', 'Contenu', 'Content'], ['trust', 'Confiance', 'Trust'], ['actions', 'Actions', 'Actions'], ['media', 'Photos et vidéos', 'Photos & videos']];
  const blk = (type, title, data, extra) => ({ type: 'block', added: true, title: '', def: Object.assign({ type, title }, extra || {}), data: Object.assign({ on: true }, data) });
  const CAT = [
    { id: 'text', g: 'content', ic: 'file-text', n: ['Texte libre', 'Free text'], d: ['Une actualité, votre démarche, une offre du moment.', 'News, your approach, a current offer.'] },
    { id: 'services', g: 'content', ic: 'list', n: ['Services et tarifs', 'Services & pricing'], d: ['Vos prestations avec leurs prix.', 'What you offer, with prices.'],
      make: (en) => blk('list', en ? 'Services & pricing' : 'Services et tarifs', { items: [
        { t: 'Consultation', d: en ? '30 minutes, in person or by video' : '30 minutes, sur place ou en visio', p: en ? '$60' : '60 $' },
        { t: en ? 'Standard package' : 'Forfait essentiel', d: en ? 'Our most popular option' : 'La formule la plus demandée', p: en ? 'from $150' : 'dès 150 $' },
        { t: en ? 'Custom project' : 'Projet sur mesure', d: en ? 'Free quote within 24 hours' : 'Soumission gratuite sous 24 h', p: en ? 'Custom quote' : 'Sur soumission' }] }, { price: true }) },
    { id: 'faq', g: 'content', ic: 'circle-help', n: ['Questions fréquentes', 'FAQ'], d: ['Répondez d’avance aux questions de vos clients.', 'Answer your customers’ questions up front.'],
      make: (en) => blk('list', en ? 'FAQ' : 'Questions fréquentes', { items: en ? [
        { t: 'What are your turnaround times?', d: 'Usually within 48 hours. For emergencies, call me directly.' },
        { t: 'Do you travel to clients?', d: 'Yes, within 15 miles of my shop.' },
        { t: 'Which payment methods do you accept?', d: 'Credit card, Zelle and cash.' }] : [
        { t: 'Quels sont vos délais ?', d: 'En général sous 48 heures. Pour une urgence, appelez-moi directement.' },
        { t: 'Vous déplacez-vous ?', d: 'Oui, dans un rayon de 25 km autour de mon atelier.' },
        { t: 'Quels modes de paiement acceptez-vous ?', d: 'Carte de crédit, virement Interac et comptant.' }] }) },
    { id: 'hours', g: 'content', ic: 'clock', n: ['Horaires', 'Hours'], d: ['Vos jours et heures d’ouverture.', 'Your opening days and hours.'],
      make: (en) => blk('hours', en ? 'Hours' : 'Horaires', { note: '', rows: en
        ? [{ d: 'Monday – Friday', h: '9 a.m. – 5 p.m.' }, { d: 'Saturday', h: '10 a.m. – 2 p.m.' }, { d: 'Sunday', h: 'Closed' }]
        : [{ d: 'Lundi – vendredi', h: '9 h – 17 h' }, { d: 'Samedi', h: '10 h – 14 h' }, { d: 'Dimanche', h: 'Fermé' }] }) },
    { id: 'location', g: 'content', ic: 'map-pin', n: ['Adresse et plan', 'Address & map'], d: ['Votre adresse avec un plan Google Maps.', 'Your address with a Google map.'],
      make: (en) => blk('location', en ? 'Find us' : 'Nous trouver', { map: true,
        address: en ? '123 Main Street, Boston, MA 02108' : '123, rue Principale, Montréal (Québec) H2X 1Y4',
        access: en ? 'Parking nearby · Wheelchair accessible' : 'Stationnement à proximité · Accès fauteuil roulant' }) },
    { id: 'cards', g: 'content', ic: 'layout-grid', n: ['Fiches avec photo', 'Photo cards'], d: ['Équipe, projets ou produits, chacun avec sa photo.', 'Team, projects or products, each with a photo.'],
      make: (en, pics) => blk('cards', en ? 'Our work' : 'Nos réalisations', { items: pics.slice(0, 3).map((x, i) => ({
        t: x.cap || (en ? 'Project ' : 'Réalisation ') + (i + 1), d: en ? 'A short description of this project' : 'Une courte description de ce projet', p: '', img: x.src, url: '' })) }) },
    { id: 'reviews', g: 'trust', ic: 'star', n: ['Avis clients', 'Customer reviews'], d: ['Deux ou trois témoignages pour rassurer.', 'Two or three testimonials that build trust.'],
      make: (en) => blk('reviews', en ? 'Customer reviews' : 'Avis clients', { items: [
        { n: en ? 'Sarah M.' : 'Julie M.', r: en ? 'Customer since 2023' : 'Cliente depuis 2023', t: en ? 'Fast, friendly and professional. Highly recommend!' : 'Rapide, souriant et professionnel. Je recommande sans hésiter !', s: 5 },
        { n: en ? 'David L.' : 'Marc L.', r: en ? 'Verified customer' : 'Client vérifié', t: en ? 'Great value and excellent advice.' : 'Excellent rapport qualité-prix et de très bons conseils.', s: 5 }] }) },
    { id: 'google', g: 'trust', ic: 'star', n: ['Avis Google', 'Google reviews'], d: ['Votre note Google et un bouton « Laisser un avis ».', 'Your Google rating and a “Leave a review” button.'],
      make: (en) => blk('greviews', en ? 'Google reviews' : 'Avis Google', { rating: en ? '4.8' : '4,8', count: '52', reviewUrl: 'https://g.page/r/example/review', mapsUrl: en ? 'https://maps.app.goo.gl/example' : 'https://maps.app.goo.gl/exemple',
        text: en ? 'Your review helps us grow. Thank you!' : 'Votre avis nous aide à grandir. Merci !' }) },
    { id: 'stats', g: 'trust', ic: 'trending-up', n: ['Chiffres clés', 'Key figures'], d: ['Années d’expérience, clients, note moyenne…', 'Years of experience, customers, rating…'],
      make: (en) => blk('stats', en ? 'Key figures' : 'En quelques chiffres', { items: [
        { v: en ? '12 yrs' : '12 ans', l: en ? 'of experience' : 'd’expérience' }, { v: '500+', l: en ? 'happy customers' : 'clients satisfaits' }, { v: en ? '4.9/5' : '4,9/5', l: en ? 'average rating' : 'note moyenne' }] }) },
    { id: 'tags', g: 'trust', ic: 'badge-check', n: ['Engagements', 'Guarantees'], d: ['Garanties, certifications, langues parlées…', 'Warranties, certifications, languages…'],
      make: (en) => blk('tags', en ? 'Why choose us' : 'Nos engagements', { text: '',
        tags: en ? 'Free quote, Licensed & insured, 1-year warranty, On-time guarantee' : 'Soumission gratuite, Entièrement assuré, Garantie 1 an, Service bilingue' }, { icon: 'check' }) },
    { id: 'booking', g: 'actions', ic: 'calendar-check', n: ['Prise de rendez-vous', 'Appointment booking'], d: ['Votre outil de réservation ou une demande de créneau.', 'Your booking tool or a time slot request.'],
      make: (en, pics, c) => blk('booking', en ? 'Book an appointment' : 'Prendre rendez-vous', { mode: 'request', email: (c.contact || {}).email || '',
        text: en ? 'Pick a day and a time, and I’ll confirm by email.' : 'Choisissez un jour et un moment, je vous confirme par courriel.' }, { cta: en ? 'Book an appointment' : 'Prendre rendez-vous', icon: 'cal' }) },
    { id: 'form', g: 'actions', ic: 'send', n: ['Formulaire de demande', 'Request form'], d: ['Devis, réservation ou question : vous recevez un email.', 'Quotes, bookings or questions, sent to your inbox.'],
      make: (en, pics, c) => blk('form', en ? 'Request a quote' : 'Demande de soumission', { email: (c.contact || {}).email || '', files: true,
        text: en ? 'Tell me what you need, and I’ll get back to you within 24 hours.' : 'Décrivez votre besoin, je vous réponds sous 24 h.' }) },
    { id: 'products', g: 'actions', ic: 'shopping-bag', n: ['Produits', 'Products'], d: ['Photo, prix et bouton Commander par SMS ou email.', 'Photo, price and an Order button by text or email.'],
      make: (en, pics) => blk('products', en ? 'Shop' : 'Nos produits', { order: 'sms', phone: '', email: '', shopUrl: '', text: '',
        items: pics.slice(0, 4).map((x, i) => ({
          t: (en ? ['Signature item', 'Gift box', 'New arrival', 'Best seller'] : ['Produit vedette', 'Coffret cadeau', 'Nouveauté', 'Meilleure vente'])[i],
          d: en ? 'A short product description' : 'Une courte description du produit',
          p: (en ? ['$35', '$59', '$24', '$42'] : ['35 $', '59 $', '24 $', '42 $'])[i], img: x.src, url: '' })) }) },
    { id: 'action', g: 'actions', ic: 'external-link', n: ['Bouton vers un lien', 'Link button'], d: ['Boutique en ligne, bon cadeau, promotion…', 'Online shop, gift card, promotion…'],
      make: (en) => blk('action', en ? 'Online shop' : 'Boutique en ligne', { label: '', url: 'https://example.com',
        text: en ? 'Order online and pick up in store.' : 'Commandez en ligne et récupérez en boutique.' }, { cta: en ? 'Visit the shop' : 'Voir la boutique', icon: 'bag' }) },
    { id: 'links', g: 'actions', ic: 'link', n: ['Liens et documents', 'Links & documents'], d: ['Brochure, grille tarifaire, portfolio…', 'Brochure, price list, portfolio…'],
      make: (en) => blk('links', en ? 'Links & documents' : 'Liens et documents', { items: [
        { label: en ? 'Brochure (PDF)' : 'Brochure (PDF)', url: 'https://example.com' }, { label: en ? 'Price list' : 'Grille tarifaire', url: 'https://example.com' }] }) },
    { id: 'gallery', g: 'media', ic: 'images', n: ['Galerie photos', 'Photo gallery'], d: ['1, 2 ou 4 photos côte à côte.', '1, 2 or 4 photos side by side.'] },
    { id: 'imgcar', g: 'media', ic: 'gallery-horizontal', n: ['Carrousel de photos', 'Photo carousel'], d: ['Des photos qui défilent sur le côté.', 'Photos that scroll sideways.'] },
    { id: 'vidcar', g: 'media', ic: 'clapperboard', n: ['Carrousel de vidéos', 'Video carousel'], d: ['Plusieurs vidéos à faire défiler.', 'Several videos to scroll through.'] },
  ];
  const catOf = (id) => CAT.find((x) => x.id === id);
  /* Une section du catalogue est-elle déjà visible sur la carte ? */
  function catPresent(id) {
    const s = sec(), c = card(), defs = s.blocks.filter((b) => (c.blocks[b.key] || {}).on).map((b) => b)
      .concat((c.custom || []).filter((x) => x.on !== false).map((x) => (x.type === 'block' ? x.def : { type: x.type })));
    return defs.some((d) => {
      if (id === 'faq') return d.type === 'list' && /question|faq/i.test(d.title || '');
      if (id === 'services') return (d.type === 'list' && d.price) || d.type === 'menu';
      if (id === 'text') return false;
      if (id === 'google') return d.type === 'greviews' || s.blocks.some((b) => b.type === 'greviews');
      if (id === 'gallery' || id === 'imgcar') return d.type === id || d.type === 'gallery';
      return d.type === id;
    });
  }
  const CAT_SUGGEST_BY = { boutiques: ['products'], producteurs: ['products'], restaurant: ['products'], influence: ['products'], coaching: ['products'] };
  const CAT_SUGGEST = ['google', 'reviews', 'faq', 'hours', 'stats', 'services', 'booking', 'location', 'tags', 'cards', 'links', 'gallery'];
  const catOn = (x) => x && (x.id !== 'google' || svcOn('google:reviews')) && !cfg('catOff', []).includes(x.id);
  const catTile = (x, en) => `<button type="button" class="as-t" data-act="addsec" data-t="${x.id}"><span class="as-ic"><i data-lucide="${x.ic}"></i></span><span class="as-n">${x.n[en ? 1 : 0]}</span><span class="as-d">${x.d[en ? 1 : 0]}</span></button>`;
  function catGroups(en) {
    return CAT_GROUPS.map(([g, fr, eng]) => `<div class="as-g"><span class="as-h">${en ? eng : fr}</span><div class="as-grid">${CAT.filter((x) => x.g === g && catOn(x)).map((x) => catTile(x, en)).join('')}</div></div>`).join('');
  }
  function addSecHTML() {
    const en = ui() === 'en';
    const sug = (CAT_SUGGEST_BY[S.sectorId] || []).concat(CAT_SUGGEST).filter((id) => !catPresent(id) && catOn(catOf(id))).slice(0, 3).map(catOf);
    return `<div class="add-sec">
      <span class="f-l">${ic('plus', 15)}${en ? 'Add a section' : 'Ajouter une section'}</span>
      ${sug.length ? `<div class="as-g as-sug"><span class="as-h">${en ? 'Suggested for you' : 'Suggérées pour vous'}</span><div class="as-grid">${sug.map((x) => catTile(x, en)).join('')}</div></div>` : ''}
      <div class="as-all">${catGroups(en)}</div>
      <button type="button" class="b as-more" data-act="addcat">${ic('plus', 16)}${en ? `See all sections (${CAT.length})` : `Voir toutes les sections (${CAT.length})`}</button>
    </div>`;
  }
  /* Éditer avec l’IA : maquette de l’assistant (activé plus tard côté serveur, la clé IA ne doit jamais être dans le navigateur) */
  function openAI() {
    const en = ui() === 'en';
    const chips = en
      ? ['Rewrite my bio', 'Translate my card into French', 'Create a FAQ', 'Shorten my texts', 'Suggest colors from my logo']
      : ['Réécrire ma présentation', 'Traduire ma carte en anglais', 'Créer une FAQ', 'Raccourcir mes textes', 'Proposer des couleurs depuis mon logo'];
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md ai-md" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="${en ? 'Close' : 'Fermer'}">${ic('x')}</button>
        <h2 id="md-t"><span class="ai-badge"><i data-lucide="sparkles"></i></span>${en ? 'Edit with AI' : 'Éditer avec l’IA'}</h2>
        <p>${en ? 'Describe what you want to change, and the assistant updates your card for you.' : 'Décrivez ce que vous voulez changer : l’assistant modifie votre carte pour vous.'}</p>
        <div class="ai-chips">${chips.map((c) => `<button type="button" class="ai-chip" data-act="aichip" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <textarea class="ai-in" rows="3" placeholder="${en ? 'E.g. Add a section with my prices for haircuts and beard trims' : 'Ex. : Ajoute une section avec mes tarifs coupe homme et barbe'}"></textarea>
        <div class="ai-foot"><span class="ai-soon">${ic('clock', 14)}${en ? 'Coming soon: the AI assistant will be enabled with the online version.' : 'Bientôt disponible : l’assistant sera activé avec la version en ligne.'}</span>
          <button class="b pri" type="button" disabled>${ic('send', 16)}${en ? 'Send' : 'Envoyer'}</button></div>
      </div>`;
    $('#modal').classList.add('on');
    icons();
  }
  /* Téléphone : le catalogue complet s’ouvre dans un panneau qui monte du bas */
  function openCatalog() {
    const en = ui() === 'en';
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="md sheet" role="dialog" aria-modal="true" aria-labelledby="md-t">
        <button class="md-x" data-act="modal-close" aria-label="${en ? 'Close' : 'Fermer'}">${ic('x')}</button>
        <h2 id="md-t">${en ? 'Add a section' : 'Ajouter une section'}</h2>
        <p>${en ? 'It arrives filled with an example: just replace the text.' : 'Elle arrive remplie d’un exemple : il suffit de remplacer le texte.'}</p>
        <div class="sheet-b">${catGroups(en)}</div>
      </div>`;
    $('#modal').classList.add('on');
    icons();
  }

  /* Toutes les sections (blocs du secteur + sections ajoutées), dans l’ordre choisi, déplaçables */
  function sectionsEd() {
    const s = sec(), c = card(), cs = c.custom || (c.custom = []);
    const order = VC.sectionOrder(c, s, S.design);
    let h = `<h3 class="ed-sub">Sections de votre carte<span>Activez ou masquez chaque section, et réorganisez-les : glissez-les par la poignée ou utilisez les flèches.</span></h3><div class="sec-list">`;
    order.forEach((k, idx) => {
      if (k.startsWith('b:') && !svcOn('google:reviews')) {
        const d0 = s.blocks.find((b) => b.key === k.slice(2));
        if (d0 && d0.type === 'greviews' && !(c.blocks[d0.key] || {}).on) return;
      }
      /* Modifier (crayon), déplacer (flèches groupées), dupliquer : trois rôles bien distincts */
      const mv = (gid) => `<div class="cs-ctl">
          <button class="ib edit-b" data-act="grp" data-id="${gid}" aria-label="Modifier la section" title="Modifier la section">${ic('pen', 15)}</button>
          <span class="mv-g" role="group" aria-label="Déplacer la section">
            <button class="ib" data-act="omove" data-k="${k}" data-d="-1" aria-label="Monter" title="Monter" ${idx === 0 ? 'disabled' : ''}>${ic('arrowup', 15)}</button>
            <button class="ib" data-act="omove" data-k="${k}" data-d="1" aria-label="Descendre" title="Descendre" ${idx === order.length - 1 ? 'disabled' : ''}>${ic('arrowdown', 15)}</button>
          </span>
          <button class="ib dup" data-act="dup" data-k="${k}" aria-label="Dupliquer la section" title="Dupliquer la section">${ic('copy', 15)}</button>`;
      if (k.startsWith('b:')) {
        const def = s.blocks.find((b) => b.key === k.slice(2)), bt = (c.blocks[def.key] || {}).title;
        const titleF = inp('Titre de la section', `blocks.${def.key}.title`, { ph: def.title, hint: 'Laissez vide pour garder le titre proposé.' });
        h += grp('b-' + def.key, esc(bt || def.title), def.help || '', titleF + blockEd(def), `blocks.${def.key}.on`, mv('b-' + def.key) + '</div>', k);
      } else {
        const i = cs.findIndex((x, j) => (x.cid || 'i' + j) === k.slice(2));
        if (i < 0) return;
        const cc = cs[i];
        if (cc.on === undefined) cc.on = true;
        const label = cc.type === 'block' ? cc.def.title : SEC_TYPES[cc.type][0];
        const body = cc.type === 'block'
          ? inp('Titre de la section', `custom.${i}.title`, { ph: cc.def.title }) + blockEd(cc.def, `custom.${i}.data`)
          : customBody(cc, i);
        h += grp('c-' + (cc.cid || i), esc(cc.title || label), cc.type === 'block' ? (cc.added ? `Section ajoutée · ${esc(cc.def.title)}` : `Copie · ${esc(cc.def.title)}`) : `Section ajoutée · ${label}`, body, `custom.${i}.on`, mv('c-' + (cc.cid || i)) + del('custom', i, 'Supprimer la section') + '</div>', k, 'cgrp');
      }
    });
    h += '</div>' + addSecHTML();
    return h;
  }

  /* Source d’une vidéo : fichier téléversé, exemple ou lien */
  function vidSource(path, src, link) {
    const kind = link ? '' : /^idb:/.test(src || '') ? 'Vidéo téléversée' : src ? 'Vidéo d’exemple' : '';
    return `<div class="vsrc full">${kind ? `<span class="demo-tag">${kind}</span>` : ''}<label class="b xs">${ic('upload', 14)}Téléverser une vidéo<input type="file" accept="video/mp4,video/webm,video/quicktime" hidden data-vid="${path}"></label>${src ? `<button class="b xs ghost" data-act="imgdel" data-path="${path}.src">Retirer</button>` : ''}</div>`;
  }

  /* Nouvelle section pré-remplie avec des médias d’exemple, pour voir tout de suite le rendu */
  function newSection(t) {
    const m = mediaNow();
    const pics = (m.gallery || []).map((x) => ({ src: x.src, cap: x.cap }))
      .concat((m.cards || []).map((src) => ({ src, cap: '' })));
    if (!pics.length && m.cover) pics.push({ src: m.cover, cap: '' });
    const en = lang() === 'en';
    if (t === 'text') return { type: 'text', title: en ? 'New section' : 'Nouvelle section', text: en ? 'Replace this text with anything you’d like to share: news, your approach, a current offer…' : 'Remplacez ce texte par ce que vous souhaitez présenter : une actualité, votre démarche, une offre du moment…' };
    if (t === 'gallery') return { type: 'gallery', title: en ? 'Gallery' : 'Galerie', layout: 2, images: pics.slice(0, 4) };
    if (t === 'imgcar') return { type: 'imgcar', title: en ? 'In pictures' : 'En images', images: pics.slice(0, 6) };
    const others = Object.keys(NFC.MEDIA || {}).filter((k) => k !== S.sectorId);
    const vids = [m.video, (NFC.MEDIA[others[(others.indexOf(S.sectorId) + 3 + others.length) % others.length]] || {}).video].filter(Boolean);
    return { type: 'vidcar', title: lang() === 'en' ? 'Videos' : 'Vidéos', videos: vids.map((v) => ({ url: '', src: v.src, cover: v.poster, cap: v.cap })) };
  }

  /* Avis Google : la note vient de la fiche Google reliée ; le propriétaire ne peut pas la fixer lui-même */
  function gSync(b) {
    const ok = VC.gLinked(b.mapsUrl), en = ui() === 'en';
    const n = ok && b.rating ? ` · ${esc(b.rating)} ★${b.count ? (en ? `, ${esc(b.count)} reviews` : `, ${esc(b.count)} avis`) : ''}` : '';
    const txt = ok
      ? (en ? `<b>Google listing connected${n}</b>Your official rating shows on your profile and updates by itself. It can’t be edited by hand.`
        : `<b>Fiche Google reliée${n}</b>Votre note officielle s’affiche sur la carte et se met à jour toute seule. Elle ne se modifie pas à la main.`)
      : (en ? 'Paste your Google listing link: your real Google rating will show on your profile automatically.'
        : 'Collez le lien de votre fiche Google : votre vraie note Google s’affichera automatiquement sur la carte.');
    const test = en ? 'Test site: the rating shown is a sample. On the live site, it is read directly from Google.' : 'Site test : la note affichée est un exemple. Sur le site final, elle sera lue directement chez Google.';
    return `<div class="g-sync${ok ? ' on' : ''}">${ic(ok ? 'check' : 'star', 16)}<span>${txt}${ok ? `<i>${test}</i>` : ''}</span></div>`;
  }
  function blockEd(def, base = `blocks.${def.key}`) {
    const b = g(base);
    switch (def.type) {
      case 'text':
        return area('Texte', base + '.text', { rows: 6, hint: def.help });
      case 'list':
        return `<div class="items">${(b.items || []).map((x, i) => `<div class="it"><div class="it-f">${mini(`${base}.items.${i}.t`, 'Intitulé', 'strong')}${mini(`${base}.items.${i}.d`, 'Détail (facultatif)', def.price ? '' : 'full')}${def.price ? mini(`${base}.items.${i}.p`, 'Prix (ex. dès 89 €)', 'price') : ''}</div>${del(base + '.items', i)}</div>`).join('')}</div>${add(base + '.items', 'item', 'Ajouter une ligne')}`;
      case 'cards':
        return `<div class="items">${(b.items || []).map((x, i) => { const p = `${base}.items.${i}`; return `<div class="it">${thumbF(p + '.img')}<div class="it-f">${mini(p + '.t', 'Titre', 'strong')}${mini(p + '.d', 'Description', def.price ? '' : 'full')}${def.price ? mini(p + '.p', 'Prix', 'price') : ''}${mini(p + '.url', 'Lien (facultatif)', 'full')}</div>${del(base + '.items', i)}</div>`; }).join('')}</div>${add(base + '.items', 'card', 'Ajouter une fiche')}`;
      case 'stats':
        return `<div class="items">${(b.items || []).map((x, i) => `<div class="it"><div class="it-f stat-f">${mini(`${base}.items.${i}.v`, 'Chiffre (ex. 48)', 'strong')}${mini(`${base}.items.${i}.l`, 'Libellé (ex. biens vendus en 2025)')}</div>${del(base + '.items', i)}</div>`).join('')}</div>${add(base + '.items', 'stat', 'Ajouter un chiffre')}`;
      case 'menu':
        return `${(b.cats || []).map((c, ci) => `<div class="cat"><div class="cat-h">${mini(`${base}.cats.${ci}.name`, 'Nom de la rubrique', 'strong')}${del(base + '.cats', ci, 'Supprimer la rubrique')}</div>
          ${mini(`${base}.cats.${ci}.desc`, 'Sous-titre de la rubrique (facultatif)', 'full')}
          <div class="items">${(c.items || []).map((x, i) => `<div class="it"><div class="it-f">${mini(`${base}.cats.${ci}.items.${i}.t`, 'Plat', 'strong')}${mini(`${base}.cats.${ci}.items.${i}.d`, 'Description')}${mini(`${base}.cats.${ci}.items.${i}.p`, 'Prix', 'price')}${mini(`${base}.cats.${ci}.items.${i}.b`, 'Mention (Signature, Végé…)')}</div>${del(`${base}.cats.${ci}.items`, i)}</div>`).join('')}</div>
          ${add(`${base}.cats.${ci}.items`, 'item', 'Ajouter un plat')}</div>`).join('')}${add(base + '.cats', 'cat', 'Ajouter une rubrique')}
          ${area('Note en bas de la carte', base + '.note', { rows: 2, ph: 'Allergies, taxes, provenance des produits…' })}`;
      case 'greviews':
        return `${inp('Lien de votre fiche Google', base + '.mapsUrl', { ph: 'https://maps.app.goo.gl/…', hint: 'Cherchez votre commerce sur Google Maps, puis « Partager » et « Copier le lien ».' })}
          ${gSync(b)}
          ${inp('Lien « Laisser un avis »', base + '.reviewUrl', { ph: 'https://g.page/r/…/review', hint: 'Dans votre profil d’entreprise Google : « Demander des avis », puis copiez le lien.' })}
          ${area('Petit mot pour vos clients', base + '.text', { rows: 2, ph: 'Votre avis nous aide à grandir. Merci !' })}`;
      case 'chef':
        return `<div class="it">${thumbF(base + '.photo')}<div class="it-f">${mini(base + '.name', 'Nom du chef', 'strong')}${mini(base + '.role', 'Titre (ex. Chef propriétaire)', 'full')}</div></div>
          ${area('Présentation', base + '.text', { rows: 4 })}
          <div class="f"><span class="f-l">Parcours</span></div>
          <div class="items">${(b.items || []).map((x, i) => `<div class="it"><div class="it-f">${mini(`${base}.items.${i}.t`, 'Année ou étape', 'strong')}${mini(`${base}.items.${i}.d`, 'Restaurant, distinction, formation', 'full')}</div>${del(base + '.items', i)}</div>`).join('')}</div>${add(base + '.items', 'item', 'Ajouter une étape')}`;
      case 'gallery':
        return galEd(base + '.images', b.images, def.help);
      case 'booking': {
        const mode = b.mode || 'tool';
        const modes = [['tool', 'Mon outil de réservation'], ['request', 'Demande de créneau'], ['sms', 'SMS pré-rempli']];
        let body = `<div class="f"><span class="f-l">Comment vos clients réservent-ils ?</span><div class="seg bk-seg">${modes.map(([v, l]) => `<button type="button" class="${mode === v ? 'on' : ''}" data-act="bkmode" data-path="${base}.mode" data-v="${v}">${l}</button>`).join('')}</div>
          <span class="f-h">${mode === 'tool' ? 'Le client réserve directement dans votre outil (Calendly, Jane, Vagaro, OpenTable…).' : mode === 'request' ? 'Sans outil : le client propose un jour et un moment, vous confirmez ensuite.' : 'Sans outil : le client choisit, et un SMS déjà rédigé s’ouvre sur son téléphone.'}</span></div>`;
        if (mode === 'tool') {
          const reco = NFC.BOOK_RECO[S.sectorId] || [], P = VC.providerOf(b);
          const cur = P ? P.id : (b.provider === undefined ? reco[0] || '' : b.provider);
          const byId = (id) => VC.PROVIDERS.find((x) => x.id === id);
          const opt = (x, tag = '') => `<option value="${x.id}" ${cur === x.id ? 'selected' : ''}>${x.name}${tag}${x.embed ? ' · intégrable' : ''}</option>`;
          /* Outils désactivés par l’administrateur : retirés de la liste (sauf celui déjà choisi par le client) */
          const ok = (x) => x && (svcOn('book:' + x.id) || x.id === cur);
          const top = [byId(reco[0])].filter(ok)[0], recoP = reco.slice(1).map(byId).filter(ok);
          const others = VC.PROVIDERS.filter((x) => !reco.includes(x.id) && ok(x)).sort((x, y) => x.name.localeCompare(y.name));
          body += `<label class="f"><span class="f-l">Votre outil de réservation</span><select data-path="${base}.provider" data-struct="re">
              ${top ? `<optgroup label="Le plus utilisé dans votre profession">${opt(top, ' (par défaut)')}</optgroup>` : ''}
              ${recoP.length ? `<optgroup label="Autres outils courants dans votre profession">${recoP.map((x) => opt(x)).join('')}</optgroup>` : ''}
              <optgroup label="Tous les autres outils">${others.map((x) => opt(x)).join('')}</optgroup>
              <option value="" ${cur === '' ? 'selected' : ''}>Autre outil (reconnu d’après le lien)</option>
            </select></label>`;
          const T = byId(cur);
          body += inp('Lien de votre page de réservation', base + '.url', {
            ph: BOOK_EX[cur] || 'https://…', attrs: ' data-rechange="1"',
            hint: P ? `Outil reconnu : <b>${esc(P.name)}</b>${P.embed ? ' · peut s’afficher dans la carte' : ''}` : T ? `Collez le lien de votre page ${esc(T.name)}, au format ${esc(BOOK_EX[cur] || '')}.` : 'Collez le lien fourni par votre outil : il est reconnu automatiquement.',
          });
          if (!b.url) body += `<p class="bk-note">${ic('clock', 15)}<span>Tant que le lien n’est pas renseigné, vos clients voient une <b>demande de créneau</b> : le bouton « ${esc(def.cta || 'Prendre rendez-vous')} » reste actif. Ses menus se règlent ci-dessous.</span></p>${slotChips(base, b)}${motifChips(base, b)}`;
          body += inp('Texte du bouton', base + '.label', { ph: def.cta || (P && P.cta) || 'Prendre rendez-vous' });
          const canEmbed = !P || !!P.embed;
          body += `<label class="ck"><input type="checkbox" data-path="${base}.embed" ${b.embed && canEmbed ? 'checked' : ''} ${canEmbed ? '' : 'disabled'}><span>Afficher l’agenda directement dans la carte${canEmbed ? '' : ` : non proposé par ${esc(P.name)}, un bouton ouvre l’outil`}</span></label>`;
          if (!P || P.embed) body += `<p class="f-h">Agenda intégrable avec Calendly, Cal.com, Acuity, Google Agenda, Microsoft Bookings, Setmore et SimplyBook.me.</p>`;
        }
        if (mode === 'request') {
          body += inp('Adresse de réception des demandes', base + '.email', { type: 'email', ph: card().contact.email || '' });
          body += slotChips(base, b) + motifChips(base, b);
        }
        if (mode === 'sms') {
          if (!(b.phone || card().contact.phone)) body += `<p class="bk-note">${ic('clock', 15)}<span>Aucun numéro renseigné : vos clients voient une <b>demande de créneau</b> en attendant.</span></p>`;
          body += `<div class="row2">${inp('Numéro qui reçoit les SMS', base + '.phone', { type: 'tel', ph: card().contact.phone || '', hint: 'Vide = votre téléphone.' })}${inp('Texte du bouton', base + '.smsLabel', { ph: 'Réserver par SMS' })}</div>`;
          body += motifChips(base, b) + dayChips(base, b);
          body += area('Message pré-rempli', base + '.tpl', { rows: 2, ph: 'Bonjour, je souhaite prendre rendez-vous{motif}, {jour}. Merci !', hint: '{motif} et {jour} sont remplacés par les choix du client. Un bouton WhatsApp s’ajoute si vous avez renseigné WhatsApp.' });
        }
        return body + area('Texte d’accompagnement', base + '.text', { rows: 2 });
      }
      case 'reviews':
        return `<div class="items">${(b.items || []).map((x, i) => { const p = `${base}.items.${i}`; return `<div class="it"><div class="it-f rev-f">${mini(p + '.n', 'Nom du client', 'strong')}${mini(p + '.r', 'Contexte (ex. Client depuis 2021)')}<select class="mini" data-path="${p}.s" aria-label="Note">${[5, 4, 3, 2, 1].map((n) => `<option value="${n}" ${+x.s === n ? 'selected' : ''}>${'★'.repeat(n)}</option>`).join('')}</select><textarea class="mini full" rows="2" data-path="${p}.t" placeholder="Son avis">${esc(x.t)}</textarea></div>${del(base + '.items', i)}</div>`; }).join('')}</div>${add(base + '.items', 'rev', 'Ajouter un avis')}`;
      case 'contact':
        return `${inp('Adresse de réception des messages', base + '.email', { type: 'email' })}${area('Texte d’introduction', base + '.text', { rows: 2 })}
          <label class="ck"><input type="checkbox" data-path="${base}.files" ${b.files ? 'checked' : ''}><span>Permettre au visiteur de joindre des fichiers (PDF, JPG, PNG)</span></label>`;
      case 'hours':
        return `<div class="items">${(b.rows || []).map((r, i) => `<div class="it"><div class="it-f two">${mini(`${base}.rows.${i}.d`, 'Jour(s)')}${mini(`${base}.rows.${i}.h`, 'Horaires')}</div>${del(base + '.rows', i)}</div>`).join('')}</div>${add(base + '.rows', 'hour', 'Ajouter une ligne')}${inp('Mention spéciale', base + '.note', { ph: 'Ex. Urgences 24h/24' })}`;
      case 'location':
        return `${inp('Adresse', base + '.address', { ph: 'Numéro, rue, code postal, ville' })}${inp('Accès et informations pratiques', base + '.access', { ph: 'Métro, parking, accès PMR…' })}
          ${svcOn('google:maps') || b.map !== false ? `<label class="ck"><input type="checkbox" data-path="${base}.map" ${b.map !== false ? 'checked' : ''}><span>Afficher le plan Google Maps</span></label>` : ''}`;
      case 'action':
        return `<div class="row2">${inp('Texte du bouton', base + '.label', { ph: def.cta })}${inp('Lien de réservation', base + '.url', { ph: 'https://…' })}</div>${area('Texte d’accompagnement', base + '.text', { rows: 2 })}`;
      case 'form':
        return `${inp('Adresse de réception des demandes', base + '.email', { type: 'email' })}${area('Texte d’introduction', base + '.text', { rows: 2 })}
          <label class="ck"><input type="checkbox" data-path="${base}.files" ${b.files || b.photos ? 'checked' : ''}><span>Permettre au visiteur de joindre des fichiers (PDF, JPG, PNG)</span></label>`;
      case 'tags':
        return `${inp('Éléments', base + '.tags', { hint: 'Séparez-les par des virgules.' })}${def.withText ? inp('Précision', base + '.text') : ''}`;
      case 'products': {
        const mode = b.order === 'email' ? 'email' : 'sms';
        return `<div class="items">${(b.items || []).map((x, i) => { const p = `${base}.items.${i}`; return `<div class="it">${thumbF(p + '.img')}<div class="it-f">${mini(p + '.t', 'Nom du produit', 'strong')}${mini(p + '.d', 'Description courte')}${mini(p + '.p', 'Prix (ex. 35 $)', 'price')}</div>${del(base + '.items', i)}</div>`; }).join('')}</div>${add(base + '.items', 'card', 'Ajouter un produit')}
          <div class="f"><span class="f-l">Comment vos clients commandent-ils ?</span><div class="seg">${[['sms', 'Par SMS'], ['email', 'Par email']].map(([v, l]) => `<button type="button" class="${mode === v ? 'on' : ''}" data-act="bkmode" data-path="${base}.order" data-v="${v}">${l}</button>`).join('')}</div>
          <span class="f-h">Le bouton « Commander » ouvre un message déjà rédigé avec le nom et le prix du produit. Le paiement en ligne arrivera avec la boutique.</span></div>
          ${mode === 'sms' ? inp('Numéro qui reçoit les commandes', base + '.phone', { type: 'tel', ph: card().contact.phone || '', hint: 'Vide = votre téléphone.' }) : inp('Adresse qui reçoit les commandes', base + '.email', { type: 'email', ph: card().contact.email || '', hint: 'Vide = votre email.' })}
          ${inp('Lien vers votre boutique complète (facultatif)', base + '.shopUrl', { ph: 'https://…', hint: 'Ajoute un bouton « Voir toute la boutique » sous les produits.' })}
          ${area('Texte d’accompagnement', base + '.text', { rows: 2 })}`;
      }
      case 'links': {
        /* Lien collé, ou PDF téléversé (gardé dans le navigateur sur le site test, sur le serveur avec GoBiz) */
        const items = b.items || [], nPdf = items.filter((x) => x.file).length, P = plan();
        return `<div class="items">${items.map((x, i) => `<div class="it"><div class="it-f two">${mini(`${base}.items.${i}.label`, 'Intitulé', 'strong')}${x.file
          ? `<span class="pdf-chip">${ic('file', 15)}<span>${esc(x.name || 'document.pdf')}</span><small>PDF · ${fmtSize(x.size)}</small></span>`
          : mini(`${base}.items.${i}.url`, 'Lien https://…')}</div>${del(base + '.items', i)}</div>`).join('')}</div>
          <div class="btns pdf-btns">${add(base + '.items', 'link', 'Ajouter un lien')}<label class="add pdf-add">${ic('upload', 16)}Ajouter un PDF<input type="file" accept="application/pdf,.pdf" hidden data-pdf="${base}.items"></label></div>
          <p class="f-h">PDF de ${P.size} Mo maximum · ${nPdf} / ${P.docs} document${P.docs > 1 ? 's' : ''} téléversé${P.docs > 1 ? 's' : ''} avec votre forfait. Le visiteur l’ouvre ou le télécharge d’un toucher.</p>`;
      }
      case 'video':
        return `${b.src && VC.vsrc(b.src) ? `<div class="demo-vid"><video src="${esc(VC.vsrc(b.src))}" muted playsinline preload="metadata"></video><div><b>${/^idb:/.test(b.src) ? 'Vidéo téléversée' : 'Vidéo d’exemple'}</b><span>${b.url ? 'Votre lien ci-dessous est prioritaire.' : 'Téléversez la vôtre ou collez un lien.'}</span></div></div>` : ''}
          ${vidSource(base, b.src, '')}
          ${inp('Ou lien de votre vidéo', base + '.url', { ph: 'YouTube, Vimeo, Instagram…', hint: 'La vidéo se lance au clic, pour garder une carte légère.' })}${inp('Légende', base + '.cap')}${imgF('Image de couverture', base + '.cover')}`;
      default:
        /* Sections propres à un autre produit (ex. boutique en ligne de Stores) */
        return X.editors && X.editors[def.type] ? X.editors[def.type](b, base, { inp, area, mini, add, del, thumbF, g, card, esc, ic, lang: lang() }) : '';
    }
  }

  /* Format de lien habituel de chaque outil de réservation (affiché en exemple) */
  const BOOK_EX = {
    calendly: 'https://calendly.com/votre-nom', calcom: 'https://cal.com/votre-nom', acuity: 'https://votre-nom.as.me',
    google: 'https://calendar.app.google/…', msbookings: 'https://outlook.office365.com/book/…', setmore: 'https://votre-nom.setmore.com',
    simplybook: 'https://votre-nom.simplybook.me', square: 'https://book.squareup.com/appointments/…', hubspot: 'https://meetings.hubspot.com/votre-nom',
    jane: 'https://votre-clinique.janeapp.com', zocdoc: 'https://www.zocdoc.com/doctor/…', simplepractice: 'https://votre-cabinet.clientsecure.me',
    cliniko: 'https://votre-clinique.cliniko.com/bookings', nexhealth: 'https://app.nexhealth.com/appt/votre-cabinet',
    vagaro: 'https://www.vagaro.com/votre-salon', fresha: 'https://www.fresha.com/a/votre-salon', booksy: 'https://booksy.com/en-us/…',
    glossgenius: 'https://votre-nom.glossgenius.com', boulevard: 'https://www.joinblvd.com/b/votre-salon',
    mindbody: 'https://www.mindbodyonline.com/explore/locations/…', momence: 'https://momence.com/votre-studio', glofox: 'https://app.glofox.com/portal/…',
    opentable: 'https://www.opentable.com/r/votre-restaurant', resy: 'https://resy.com/cities/…/venues/votre-restaurant', tock: 'https://www.exploretock.com/votre-restaurant',
    sevenrooms: 'https://www.sevenrooms.com/reservations/votre-restaurant', libro: 'https://libroreserve.com/votre-restaurant',
    jobber: 'https://clienthub.getjobber.com/…', housecall: 'https://book.housecallpro.com/…', showingtime: 'https://…showingtime.com/…',
    clio: 'https://…clio.com/…', honeybook: 'https://votre-studio.hbportal.co/…', dubsado: 'https://portal.dubsado.com/…',
    pixieset: 'https://votre-nom.pixieset.com/booking', fareharbor: 'https://fareharbor.com/embeds/book/votre-entreprise/', peek: 'https://book.peek.com/s/…',
    bokun: 'https://…bokun.io/…', rezdy: 'https://votre-entreprise.rezdy.com', airbnb: 'https://www.airbnb.com/rooms/…', bookingcom: 'https://www.booking.com/hotel/…',
    vrbo: 'https://www.vrbo.com/…', cloudbeds: 'https://hotels.cloudbeds.com/reservation/…', lodgify: 'https://votre-lieu.lodgify.com',
    moego: 'https://booking.moego.pet/ol/votre-salon', gingr: 'https://votre-pension.portal.gingrapp.com', timetopet: 'https://www.timetopet.com/portal/votre-entreprise',
    tekmetric: 'https://…tekmetric.com/…', shopmonkey: 'https://app.shopmonkey.io/…', xtime: 'https://consumer.xtime.com/…',
  };

  /* Liste d’options à étiquettes (motifs, moments) : on retire d’un clic, on ajoute avec Entrée */
  function chipEd(base, field, label, list, isDefault, defLabel) {
    return `<div class="f chips-f"><span class="f-l">${label}</span>
      <div class="chips-ed">${list.map((x, i) => `<span class="chip-e">${esc(x)}<button type="button" data-act="chipdel" data-base="${base}" data-field="${field}" data-i="${i}" aria-label="Retirer ${esc(x)}">${ic('x', 12)}</button></span>`).join('')}
        <input class="chip-in" data-chipadd="${base}" data-field="${field}" placeholder="${list.length ? 'Ajouter…' : 'Ajoutez un choix puis Entrée'}" aria-label="Ajouter un choix">
      </div>
      <span class="f-h">${isDefault ? `Par défaut : ${defLabel}. ` : ''}Tapez un choix puis <b>Entrée</b> pour l’ajouter, cliquez sur × pour le retirer.${isDefault ? '' : ` <button type="button" class="linkish" data-act="chipreset" data-base="${base}" data-field="${field}">Revenir à la liste par défaut</button>`}</span></div>`;
  }
  function slotChips(base, b) {
    const custom = !!b.slotsCustom;
    return chipEd(base, 'slots', 'Moments proposés', chipList(base, 'slots'), !custom && !b.slots, uiLang('Matin') + ', ' + uiLang('Midi') + ', ' + uiLang('Après-midi') + ', ' + uiLang('Soir'));
  }
  function dayChips(base, b) {
    const custom = !!b.daysCustom;
    return chipEd(base, 'days', 'Choix « Quand »', chipList(base, 'days'), !custom && !String(b.days || '').trim(), 'Aujourd’hui, Demain, Cette semaine, La semaine prochaine');
  }
  function motifChips(base, b) {
    const list = VC.motifsOf(b, mdl());
    return chipEd(base, 'motifs', 'Motifs proposés', list, !b.motifsCustom && !String(b.motifs || '').trim(), 'vos prestations');
  }
  const splitCsv = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
  function chipList(base, field) {
    const b = g(base);
    if (field === 'motifs') return VC.motifsOf(b, mdl());
    if (field === 'days') return b.daysCustom ? splitCsv(b.days) : (splitCsv(b.days).length ? splitCsv(b.days) : VC.DAYS.map(uiLang));
    return b.slotsCustom ? splitCsv(b.slots) : (b.slots ? splitCsv(b.slots) : splitCsv(VC.SLOTS).map(uiLang));
  }
  function chipSet(base, field, list) {
    const b = g(base);
    b[field] = list.join(', ');
    b[field + 'Custom'] = true;
    structChanged();
    const inp = document.querySelector(`[data-chipadd="${base}"][data-field="${field}"]`);
    if (inp) inp.focus();
  }

  const TPL = X.tpl || {};
  Object.assign(TPL, { rev: { n: '', r: '', t: '', s: 5 }, vid: { url: '', src: '', cover: '', cap: '' }, item: { t: '', d: '', p: '' }, card: { t: '', d: '', p: '', img: '', url: '' }, stat: { v: '', l: '' }, cat: { name: '', items: [{ t: '', d: '', p: '' }] }, hour: { d: '', h: '' }, link: { label: '', url: '' } }, X.tpl || {});

  function structChanged() {
    save();
    const ed = $('#ed');
    if (ed) ed.innerHTML = editor();
    renderPreview();
  }

  function blank(v, k) {
    if (k === 'on' || k === 'photos') return v;
    if (typeof v === 'string') return '';
    if (Array.isArray(v)) return [];
    if (v && typeof v === 'object') { const o = {}; for (const kk in v) o[kk] = blank(v[kk], kk); return o; }
    return v;
  }
  function clearCard() {
    const c = card(), n = blank(c);
    n.primary = c.primary;
    n.socials = {}; n.socialsOn = Object.assign({}, c.socialsOn); n.socDef = 2; normSocials(n);
    Object.keys(c.blocks).forEach((k) => { if (c.blocks[k].rows) n.blocks[k].rows = c.blocks[k].rows.map((r) => ({ d: r.d, h: '' })); });
    S.cards[ckey()] = n;
  }

  function readImg(file, max, keepPng) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => {
          const r = Math.min(1, max / Math.max(im.width, im.height));
          const cv = document.createElement('canvas');
          cv.width = Math.round(im.width * r); cv.height = Math.round(im.height * r);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          res(keepPng ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.82));
        };
        im.onerror = rej;
        im.src = fr.result;
      };
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  /* ---------- Étape 5 : publication ---------- */
  function step5() {
    return `<section class="wrap">
      ${back(4, 'Modifier ma carte')}
      ${head('Votre carte est prête', hasQR()
        ? 'Elle est reliée au lien et au QR code déjà imprimés sur votre carte NFC : scannez-les, votre nouvelle carte s’affiche.'
        : 'Voici le lien permanent de votre carte. C’est lui qui est programmé dans votre carte NFC et encodé dans votre QR code.')}
      <div class="split">
        <div class="side pub">
          <div class="box">
            <span class="box-l">${hasQR() ? 'Lien de votre carte · déjà imprimé' : `Lien permanent · modèle ${code()}`}</span>
            <div class="linkrow"><code>${esc(link())}</code><button class="b sm" data-act="copy">${ic('copy', 15)}Copier</button></div>
            <p class="muted small">${hasQR() ? 'Rien à réimprimer ni à reprogrammer : ce lien affiche maintenant votre nouvelle carte.' : 'Lien simulé pour le site test : il deviendra actif une fois le site en ligne.'}</p>
          </div>
          <div class="box qrbox">
            <div id="qr" class="qr"></div>
            <div><span class="box-l">QR code</span><p>${hasQR() ? 'Le même QR code que celui imprimé sur votre carte. Réutilisez-le sur une vitrine, un flyer ou une signature email.' : 'À imprimer au dos de la carte NFC, sur une vitrine, un flyer ou une signature email.'}</p><div class="qr-dl">${qrDl()}</div></div>
          </div>
          <div class="box">
            <span class="box-l">Recevoir le lien et le QR code par email</span>
            <form class="linkrow mailrow" data-mailform novalidate>
              <input id="sendto" type="email" autocomplete="email" placeholder="nom@exemple.com" aria-label="Adresse email du destinataire" value="${esc(S.sendTo || '')}">
              <button class="b pri sm" type="submit">${ic('send', 15)}Envoyer</button>
            </form>
            <p class="muted small">À l’adresse de votre choix : la vôtre, celle de votre graphiste ou de votre imprimeur.</p>
            ${(S.sent || []).length ? `<ul class="sent">${S.sent.slice(0, 3).map((x) => `<li>${ic('check', 13)}<span>Envoyé à <b>${esc(x)}</b></span></li>`).join('')}</ul>` : ''}
          </div>
          <div class="box">
            <span class="box-l">Comment ça marche</span>
            <ol class="how">
              <li>${hasQR() ? '<b>Votre puce NFC et votre QR code pointent déjà</b> vers ce lien.' : '<b>La puce NFC est programmée une seule fois</b> avec ce lien.'}</li>
              <li><b>Vous modifiez votre carte quand vous voulez</b> : textes, photos, modèle, couleurs. La puce n’a jamais besoin d’être reprogrammée.</li>
              <li><b>Vos contacts approchent leur téléphone</b> et votre carte s’ouvre, sans application.</li>
            </ol>
          </div>
          ${leadsBox()}
          <div class="btns">
            <button class="b pri" data-act="full">${ic('eye', 17)}Voir en plein écran</button>
            <button class="b" data-act="vcf">${ic('userplus', 17)}Fiche contact (.vcf)</button>
            <button class="b" data-act="json">${ic('download', 17)}Exporter la configuration</button>
          </div>
        </div>
        <div class="pv-col">${phone()}</div>
      </div>
    </section>`;
  }

  function leadsBox() {
    let leads = [];
    try { leads = JSON.parse(localStorage.getItem('nfc-leads') || '[]'); } catch (e) { /* stockage indisponible */ }
    const rows = leads.slice(0, 5).map((l) => `<li><b>${esc([l.prenom, l.nom].filter(Boolean).join(' '))}</b>${l.entreprise ? ` · ${esc(l.entreprise)}` : ''}${l.rdv ? ` · RDV : ${esc(l.rdv)}` : ''}${l.fichiers && l.fichiers.length ? ` · ${l.fichiers.length} pièce${l.fichiers.length > 1 ? 's' : ''} jointe${l.fichiers.length > 1 ? 's' : ''}` : ''}<span>${esc([l.tel, l.email].filter(Boolean).join(' · '))}</span></li>`).join('');
    return `<div class="box">
      <span class="box-l">Contacts reçus${leads.length ? ` · ${leads.length}` : ''}</span>
      ${rows ? `<ul class="leads">${rows}</ul>` : '<p>Quand un visiteur enregistre votre contact, il peut vous laisser ses coordonnées. Testez-le : cliquez sur « Enregistrer » dans l’aperçu.</p>'}
    </div>`;
  }

  function drawQR() {
    const el = $('#qr');
    if (!el) return;
    if (!window.QRCode) { el.innerHTML = '<span class="muted small">QR code indisponible hors ligne</span>'; return; }
    el.innerHTML = '';
    new window.QRCode(el, { text: link(), width: 132, height: 132, colorDark: '#15151a', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
  }

  function openFull(d) {
    const pick = d && d !== S.design ? `<button class="b pri full-pick" data-act="design" data-id="${d}">Choisir le modèle ${designOf(d).name} ${ic('arrow', 16)}</button>` : '';
    $('#modal').innerHTML = `<div class="mb" data-act="modal-close"></div>
      <div class="full-wrap">
        <div class="fullview" role="dialog" aria-modal="true" aria-label="Carte en plein écran">
          <button class="md-x" data-act="modal-close" aria-label="Fermer">${ic('x')}</button>
          <div class="full-screen" data-vc-scroll>${VC.render(mdl(d))}</div>
        </div>${pick}
      </div>`;
    $('#modal').classList.add('on');
  }

  function exportJSON() {
    if (window.NFC_SANDBOX) { toast('Aperçu en ligne : l’export sera disponible sur la version finale.'); return; }
    const data = { modele: code(), secteur: sec().name, design: designOf(S.design).name, palette: (NFC.palsOf ? NFC.palsOf(sec()) : sec().palettes)[S.palette], lien: link(), carte: card() };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `carte-${code()}-${S.id}.json`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), 3600);
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const a = t.dataset.act;
    switch (a) {
      case 'go': go(+t.dataset.n); break;
      case 'sector': pickSector(t.dataset.id); break;
      case 'profile': pickProfile(t.dataset.id); break;
      case 'profgo': {
        /* Résultat de recherche : secteur + métier en un clic */
        const s = SECTORS.find((x) => x.id === t.dataset.s);
        if (!s) break;
        if (S.sectorId !== s.id) { S.sectorId = s.id; S.design = null; }
        pickProfile(t.dataset.p);
        break;
      }
      case 'profpick': profPick = true; go(1); break;
      case 'profback': profPick = false; render(); window.scrollTo(0, 0); break;
      case 'other': openOther(); break;
      case 'hasqr':
        if (t.dataset.v === 'yes') openScan();
        else { if (hasQR()) S.id = rid(); S.qr = null; save(); render(); window.scrollTo(0, 0); }
        break;
      case 'qrstart':
        if (!pendingQR) break;
        S.qr = pendingQR; S.id = pendingQR.id;
        closeModal(); save(); render(); window.scrollTo(0, 0);
        toast('Carte reliée à votre QR code. Créez maintenant votre carte : elle s’affichera à ce lien.');
        break;
      case 'qrreset': if (hasQR()) S.id = rid(); delete S.qr; go(1); break;
      case 'other-pick': closeModal(); pickSector(t.dataset.id, true); break;
      case 'modal-close': closeModal(); break;
      case 'design': closeModal(); S.design = t.dataset.id; go(3); break;
      case 'adm': admAct(t); break;
      case 'poster': openPoster(); break;
      case 'poster-print':
        if (!VC.posterPrint(posterOpts())) toast(window.NFC_SANDBOX ? 'Impression bloquée dans cet aperçu : ouvrez le site test pour imprimer.' : 'Autorisez les fenêtres pop-up pour imprimer l’affiche.');
        break;
      case 'poster-png':
        VC.posterDownload(posterOpts(), (ok) => toast(ok ? 'Affiche téléchargée (PNG haute définition).' : window.NFC_SANDBOX ? 'Téléchargement bloqué dans cet aperçu : ouvrez le site test pour télécharger.' : 'Affiche indisponible hors ligne.'));
        break;
      case 'qrdl': {
        const ok = VC.qrDownload(link(), t.dataset.v, ((card() || {}).identity || {}).name);
        toast(ok ? `QR code téléchargé (${t.dataset.v.toUpperCase()}).` : window.NFC_SANDBOX ? 'Téléchargement bloqué dans cet aperçu : ouvrez le site test pour télécharger.' : 'QR code indisponible hors ligne.');
        break;
      }
      case 'leadconnect': toast(`La connexion à ${t.dataset.v} se fera depuis votre espace NexTap, une fois votre carte en ligne.`); break;
      case 'palette': {
        S.palette = +t.dataset.i; save();
        /* Seul l’aperçu est redessiné : il garde sa position de défilement, on voit l’effet sur la section regardée */
        document.querySelectorAll('.pal').forEach((b) => b.classList.toggle('sel', b === t));
        renderPreview();
        break;
      }
      case 'grp': {
        const el = t.closest('.grp'), id = t.dataset.id;
        el.classList.toggle('open');
        if (el.classList.contains('open')) { openGroups.add(id); showInPreview(id); } else openGroups.delete(id);
        break;
      }
      case 'add':
        if (t.dataset.tpl === 'prod' && g(t.dataset.path).length >= plan().products) { toast(`Votre forfait permet ${plan().products} produits. Passez au forfait supérieur pour en ajouter d’autres.`); break; }
        g(t.dataset.path).push(clone(TPL[t.dataset.tpl])); structChanged(); break;
      case 'dup': {
        const c = card(), cs = c.custom || (c.custom = []), k = t.dataset.k;
        const order = VC.sectionOrder(c, sec(), S.design);
        let copy;
        if (k.startsWith('b:')) {
          const def = sec().blocks.find((b) => b.key === k.slice(2)), b = c.blocks[def.key];
          const { type, title, price, icon, cta, withText, help } = def;
          copy = { type: 'block', title: `${b.title || uiLang(def.title)} (copie)`, def: { type, title, price, icon, cta, withText, help }, data: Object.assign(clone(b), { on: true, title: '' }) };
        } else {
          const src = cs.find((x, j) => (x.cid || 'i' + j) === k.slice(2));
          if (!src) break;
          copy = clone(src);
          copy.title = `${src.title || (src.type === 'block' ? uiLang(src.def.title) : SEC_TYPES[src.type][0])} (copie)`;
        }
        /* Titre : « (copie) », puis « (copie 2) », « (copie 3) »… */
        const cw = lang() === 'en' ? 'copy' : 'copie';
        const root = String(copy.title).replace(/ \((copie|copy)( \d+)?\)( \((copie|copy)( \d+)?\))*$/, '');
        const n = cs.filter((x) => String(x.title || '').startsWith(root + ' (' + cw)).length;
        copy.title = n ? `${root} (${cw} ${n + 1})` : `${root} (${cw})`;
        copy.cid = rid();
        copy.on = true;
        cs.push(copy);
        order.splice(order.indexOf(k) + 1, 0, 'c:' + copy.cid);
        c.order = order;
        openGroups.add('c-' + copy.cid);
        structChanged();
        toast('Section dupliquée juste en dessous : modifiez-la librement.');
        break;
      }
      case 'chipdel': { const l = chipList(t.dataset.base, t.dataset.field); l.splice(+t.dataset.i, 1); chipSet(t.dataset.base, t.dataset.field, l); break; }
      case 'chipreset': { const b = g(t.dataset.base); b[t.dataset.field] = ''; b[t.dataset.field + 'Custom'] = false; structChanged(); break; }
      case 'bili': {
        S.bili = S.bili || {};
        S.bili[S.sectorId] = t.checked;
        if (t.checked) {
          /* Les deux versions doivent exister */
          ['fr', 'en'].forEach((l) => { S.lang = l; ensureCard(); }); S.lang = ui();
          toast(ui() === 'en' ? 'Bilingual profile on: fill in the French and the English version.' : 'Carte bilingue activée : remplissez la version française et la version anglaise.');
        } else S.lang = ui();
        save();
        const pvB = $('#pv'), stB = pvB ? pvB.scrollTop : 0;
        render();
        const nB = $('#pv'); if (nB) nB.scrollTop = stB;
        break;
      }
      case 'ui': {
        if (t.dataset.v === ui()) break;
        if (t.dataset.v === 'fr') untranslate();
        S.ui = t.dataset.v;
        /* La carte (modèles, couleurs, contenu) passe dans la même langue que le site ; on peut ensuite la changer à part */
        S.lang = t.dataset.v;
        if (S.sectorId) ensureCard();
        save();
        const pvU = $('#pv'), stU = pvU ? pvU.scrollTop : 0;
        render();
        const nU = $('#pv'); if (nU) nU.scrollTop = stU;
        toast(ui() === 'en' ? 'Site and card in English. For a card in both languages, tick “Bilingual”.' : 'Site et carte en français. Pour une carte dans les deux langues, cochez « Bilingue ».');
        break;
      }
      case 'lang': {
        if (t.dataset.v === lang() || !bili()) break;
        S.lang = t.dataset.v;
        ensureCard();
        save();
        const pvEl = $('#pv'), st = pvEl ? pvEl.scrollTop : 0;
        render();
        const n = $('#pv'); if (n) n.scrollTop = st;
        toast(lang() === 'en' ? 'Version anglaise de la carte : vos textes en français sont conservés à part.' : 'Version française de la carte.');
        break;
      }
      case 'bkmode': setP(card(), t.dataset.path, t.dataset.v); structChanged(); break;
      case 'setcover': card().identity.coverType = t.dataset.v; structChanged(); break;
      case 'layout': card().custom[+t.dataset.i].layout = +t.dataset.v; structChanged(); break;
      case 'addsec': {
        const cs = card().custom || (card().custom = []), item = catOf(t.dataset.t);
        if (!item) break;
        if (cs.length >= plan().sections) { closeModal(); toast(`Votre forfait permet ${plan().sections} sections ajoutées. Passez au forfait supérieur pour en ajouter d’autres.`); break; }
        const m = mediaNow();
        const pics = (m.gallery || []).map((x) => ({ src: x.src, cap: x.cap })).concat((m.cards || []).map((src) => ({ src, cap: '' })));
        const ns = Object.assign(item.make ? item.make(lang() === 'en', pics, card()) : newSection(t.dataset.t), { cid: rid(), on: true });
        cs.push(ns);
        openGroups.add('c-' + ns.cid);
        closeModal();
        structChanged();
        toast(`Section « ${item.n[ui() === 'en' ? 1 : 0]} » ajoutée en bas de la carte.`);
        /* On montre la nouvelle section, ouverte, dans l’éditeur */
        setTimeout(() => { const el = document.querySelector(`[data-grp="c-${ns.cid}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); const pv = $('#pv'); if (pv) pv.scrollTop = pv.scrollHeight; }, 60);
        break;
      }
      case 'addcat': openCatalog(); break;
      case 'aiedit': openAI(); break;
      case 'aichip': { const ta = $('.ai-in'); if (ta) { ta.value = t.dataset.v; ta.focus(); } break; }
      case 'omove': {
        const o = VC.sectionOrder(card(), sec(), S.design), i = o.indexOf(t.dataset.k), j = i + +t.dataset.d;
        if (i < 0 || j < 0 || j >= o.length) break;
        [o[i], o[j]] = [o[j], o[i]];
        card().order = o;
        structChanged();
        break;
      }
      case 'coverclear': { const id = card().identity; id.coverVideoFile = ''; id.coverVideoUrl = ''; structChanged(); break; }
      case 'fullpreview': openFull(t.dataset.id); break;
      case 'del': g(t.dataset.path).splice(+t.dataset.i, 1); structChanged(); break;
      case 'imgdel': setP(card(), t.dataset.path, ''); structChanged(); break;
      case 'clear':
        if (ask('Vider tous les textes et photos d’exemple ? La structure et vos choix de blocs sont conservés.')) { clearCard(); structChanged(); toast('Exemples vidés : à vous de jouer.'); }
        break;
      case 'mtab': mobileTab = t.dataset.t; window.scrollTo(0, 0); render(); break;
      case 'done': {
        /* Referme le panneau et montre le résultat sur la carte */
        const gEl = t.closest('.grp');
        gEl.classList.remove('open');
        openGroups.delete(t.dataset.id);
        mobileTab = 'view';
        render();
        window.scrollTo(0, 0);
        showInPreview(t.dataset.id);
        break;
      }
      case 'copy':
        if (navigator.clipboard) navigator.clipboard.writeText(link()).then(() => toast('Lien copié'));
        break;
      case 'vcf': VC.downloadVCard(card(), link(), lang()); break;
      case 'json': exportJSON(); break;
      case 'full': openFull(); break;
      case 'reset':
        if (ask('Tout recommencer ? Vos cartes en cours seront effacées.')) { const u = S.ui; S = fresh(); S.ui = u; save(); go(1); }
        break;
    }
  });

  document.addEventListener('keydown', (e) => {
    const ci = e.target.closest && e.target.closest('[data-chipadd]');
    if (ci && (e.key === 'Enter' || e.key === ',')) {
      e.preventDefault();
      const v = ci.value.replace(/,/g, ' ').trim();
      if (!v) return;
      const l = chipList(ci.dataset.chipadd, ci.dataset.field);
      if (!l.includes(v)) l.push(v);
      chipSet(ci.dataset.chipadd, ci.dataset.field, l);
      return;
    }
    if (ci && e.key === 'Backspace' && !ci.value) {
      const l = chipList(ci.dataset.chipadd, ci.dataset.field);
      if (l.length) { l.pop(); chipSet(ci.dataset.chipadd, ci.dataset.field, l); }
      return;
    }
    if (e.key === 'Escape' && $('#modal').classList.contains('on')) closeModal();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    const ed = $('#ed');
    if (!t.dataset.path || !ed || !ed.contains(t)) return;
    setP(card(), t.dataset.path, t.type === 'checkbox' ? t.checked : t.value);
    save();
    /* Le titre d’une section se met aussi à jour dans l’en-tête de son panneau */
    if (/^(blocks\.[^.]+|custom\.\d+)\.title$/.test(t.dataset.path)) {
      const h = t.closest('.grp') && t.closest('.grp').querySelector('.grp-t');
      if (h) h.textContent = t.value || t.placeholder;
    }
    /* Lien de la fiche Google : l’encadré « fiche reliée » suit la saisie */
    if (/\.mapsUrl$/.test(t.dataset.path)) {
      const box = t.closest('.grp') && t.closest('.grp').querySelector('.g-sync');
      if (box) { box.outerHTML = gSync(g(t.dataset.path.replace(/\.mapsUrl$/, ''))); icons(); }
    }
    if (t.dataset.struct === 're') {
      /* Changement d’outil : on retire le lien d’un autre outil, pour saisir le bon */
      if (/\.provider$/.test(t.dataset.path)) {
        const bb = g(t.dataset.path.replace(/\.provider$/, ''));
        const d = bb && bb.url && VC.PROVIDERS.find((x) => x.re.test(bb.url));
        if (d && d.id !== t.value) { bb.url = ''; save(); }
      }
      structChanged();
      return;
    }
    if (t.dataset.struct === 'toggle') {
      t.closest('.grp').classList.toggle('off', !t.checked); renderPreview();
      /* Une section affichée ou masquée peut changer les messages du panneau « Échange de contacts » */
      const lb = document.querySelector('[data-grp="leads"] .grp-b');
      if (lb) { lb.innerHTML = leadsEd() + `<button type="button" class="b sm done-b" data-act="done" data-id="leads">${ic('check', 15)}Terminé</button>`; translateTree(lb); }
    }
    else if (t.type === 'checkbox' || t.tagName === 'SELECT') renderPreview();
    else schedulePv();
  });

  /* ---------- Aperçu ⇄ éditeur : cliquer une section de la carte ouvre son panneau ---------- */
  let pvLinkTip = false;
  function groupOf(el) {
    const s = el.closest('[data-sec]');
    if (s) {
      const k = s.dataset.sec;
      if (k.startsWith('custom-')) { const i = +k.slice(7), c = (card().custom || [])[i]; return c ? 'c-' + (c.cid || i) : null; }
      return 'b-' + k;
    }
    if (el.closest('.soc')) return 'socials';
    if (el.closest('.qa, .qa-list, .sticky')) return 'contact';
    if (el.closest('.hd')) return 'identity';
    return null;
  }
  function previewOf(id) {
    const pv = $('#pv');
    if (!pv) return null;
    if (id === 'identity') return pv.querySelector('.hd');
    if (id === 'contact') return pv.querySelector('.qa, .qa-list');
    if (id === 'socials') return pv.querySelector('.soc-top') || pv.querySelector('.soc');
    if (id === 'leads') return pv.querySelector('.ft');
    if (id.startsWith('b-')) return pv.querySelector(`[data-sec="${id.slice(2)}"]`);
    if (id.startsWith('c-')) {
      const i = (card().custom || []).findIndex((c, j) => (c.cid || String(j)) === id.slice(2));
      return i < 0 ? null : pv.querySelector(`[data-sec="custom-${i}"]`);
    }
    return null;
  }
  const flash = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); clearTimeout(el._fl); el._fl = setTimeout(() => el.classList.remove(cls), 2400); };
  function focusGroup(id) {
    const gEl = document.querySelector(`#ed [data-grp="${id}"]`);
    if (!gEl) return;
    if (!gEl.classList.contains('open')) { gEl.classList.add('open'); openGroups.add(id); }
    gEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    flash(gEl, 'glow');
    flash(previewOf(id), 'pv-sel');
  }
  /* Travailler dans un panneau ouvert (champ, bouton) fait aussi suivre l’aperçu, une fois par panneau */
  let followId = '';
  const follow = (e) => {
    const gEl = e.target.closest && e.target.closest('#ed .grp[data-grp]');
    if (!gEl || !gEl.classList.contains('open') || gEl.dataset.grp === followId || e.target.closest('.grp-h')) return;
    followId = gEl.dataset.grp;
    showInPreview(followId);
  };
  document.addEventListener('focusin', follow);
  document.addEventListener('pointerdown', follow);
  function showInPreview(id) {
    followId = id;
    const el = previewOf(id), pv = $('#pv');
    if (!el || !pv) return;
    const top = el.getBoundingClientRect().top - pv.getBoundingClientRect().top + pv.scrollTop - 12;
    pv.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    flash(el, 'pv-sel');
  }
  document.addEventListener('click', (e) => {
    const pv = e.target.closest('#pv');
    if (!pv || !$('#ed') || e.target.closest('.vc-ov, .vc-lb')) return;
    /* Dans l’aperçu de l’éditeur, un clic sert à modifier : on n’ouvre ni le téléphone, ni la messagerie, ni un autre site */
    const a = e.target.closest('a[href]');
    if (a && !a.dataset.vc && !/^#/.test(a.getAttribute('href'))) {
      e.preventDefault();
      if (!pvLinkTip) { pvLinkTip = true; toast('Aperçu : un clic ouvre la modification. Pour tester les boutons (appel, email, liens), ouvrez « Voir en plein écran » à l’étape Publication.'); }
    }
    const id = groupOf(e.target);
    if (!id) return;
    if (mobileTab === 'view' && window.matchMedia('(max-width: 900px)').matches) {
      mobileTab = 'edit';
      $('.ed-grid').classList.replace('tab-view', 'tab-edit');
      document.querySelectorAll('.mtabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === 'edit'));
    }
    focusGroup(id);
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t.dataset || !card()) return;
    const k = t.dataset.soc || t.dataset.socck;
    if (!k) return;
    const c = card(), row = t.closest('.soc-f');
    c.socialsOn = c.socialsOn || {};
    if (t.dataset.soc && t.value.trim() && t.value.trim() !== VC.SOC_BASE[k] && !c.socialsOn[k]) {
      c.socialsOn[k] = true;
      const ck = row && row.querySelector('[data-socck]'); if (ck) ck.checked = true;
      save(); renderPreview();
    }
    if (row) row.classList.toggle('on', !!c.socialsOn[k]);
  });

  /* Réseaux sociaux : un lien collé dans le mauvais champ est rangé sous le bon réseau */
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!t.dataset || !t.dataset.soc || !card()) return;
    const v = t.value.trim(), k = VC.socOf(v), c = card();
    c.socials = c.socials || {};
    /* Champ vidé : on remet l’adresse de départ */
    if (!v) { c.socials[t.dataset.soc] = VC.SOC_BASE[t.dataset.soc]; t.value = c.socials[t.dataset.soc]; save(); return; }
    if (!k || k === t.dataset.soc) return;
    const from = t.dataset.soc;
    c.socials[k] = v;
    c.socials[from] = VC.SOC_BASE[from];
    c.socialsOn = c.socialsOn || {};
    c.socialsOn[k] = true;
    c.socialsOn[from] = false;
    structChanged();
    const name = (VC.SOC.find((x) => x[0] === k) || [])[1] || k;
    toast(ui() === 'en' ? `${name} link detected: moved to the ${name} field.` : `Lien ${name} reconnu : rangé dans le champ ${name}.`);
  });

  /* Lien de réservation : l’outil est reconnu quand on quitte le champ */
  document.addEventListener('change', (e) => { if (e.target.dataset && e.target.dataset.rechange && $('#ed') && $('#ed').contains(e.target)) structChanged(); });

  /* Téléversement de vidéos (couverture, bloc vidéo, carrousel) */
  /* Taille lisible d’un fichier */
  function fmtSize(n) {
    n = +n || 0;
    if (n < 1024 * 1024) return Math.max(1, Math.round(n / 1024)) + ' Ko';
    return (n / 1024 / 1024).toFixed(1).replace('.', ui() === 'en' ? '.' : ',') + ' Mo';
  }
  /* PDF téléversé dans « Liens et documents » */
  document.addEventListener('change', async (e) => {
    const t = e.target;
    if (t.type !== 'file' || !t.dataset.pdf) return;
    const f = t.files[0];
    t.value = '';
    if (!f) return;
    const P = plan(), arr = g(t.dataset.pdf) || [];
    if (!(f.type === 'application/pdf' || /\.pdf$/i.test(f.name))) { toast('Choisissez un fichier PDF.'); return; }
    if (f.size > P.size * 1024 * 1024) { toast(`PDF trop lourd : ${P.size} Mo maximum avec votre forfait.`); return; }
    if (arr.filter((x) => x.file).length >= P.docs) { toast(`Votre forfait permet ${P.docs} document${P.docs > 1 ? 's' : ''} PDF. Passez au forfait supérieur pour en ajouter d’autres.`); return; }
    try {
      toast('Téléversement du PDF…');
      const ref = await VC.idb.put('p' + Date.now().toString(36) + rid(), f);
      arr.push({ label: f.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim(), url: '', file: ref, name: f.name, size: f.size });
      setP(card(), t.dataset.pdf, arr);
      structChanged();
      toast('PDF ajouté. Vous pouvez modifier son intitulé.');
    } catch (err) {
      toast('Le PDF n’a pas pu être enregistré dans ce navigateur.');
    }
  });

  document.addEventListener('change', async (e) => {
    const t = e.target;
    if (t.type !== 'file' || !t.dataset.vid) return;
    const f = t.files[0];
    if (!f) return;
    if (!/^video\//.test(f.type)) { toast('Choisissez un fichier vidéo (MP4, WebM ou MOV).'); return; }
    if (f.size > 60 * 1024 * 1024) { toast('Vidéo trop lourde : 60 Mo maximum.'); return; }
    try {
      toast('Téléversement de la vidéo…');
      const ref = await VC.idb.put('v' + Date.now().toString(36) + rid(), f);
      const path = t.dataset.vid;
      if (path === 'identity.cover') { const id = card().identity; id.coverVideoFile = ref; id.coverType = 'video'; }
      else { setP(card(), path + '.src', ref); if (g(path + '.url') !== undefined) setP(card(), path + '.url', ''); }
      structChanged();
      toast('Vidéo ajoutée.');
    } catch (err) {
      toast('La vidéo n’a pas pu être enregistrée dans ce navigateur.');
    }
  });

  /* Glisser-déposer des sections par leur poignée */
  let dragKey = null;
  document.addEventListener('mousedown', (e) => { const h = e.target.closest('.sec-list .drag'); if (h) h.closest('.grp').setAttribute('draggable', 'true'); });
  document.addEventListener('dragstart', (e) => {
    const gEl = e.target.closest && e.target.closest('.sec-list .grp[draggable="true"]');
    if (!gEl) return;
    dragKey = gEl.dataset.key;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragKey);
    gEl.classList.add('dragging');
  });
  document.addEventListener('dragover', (e) => {
    if (!dragKey) return;
    const over = e.target.closest && e.target.closest('.sec-list .grp');
    document.querySelectorAll('.drop-before, .drop-after').forEach((x) => x.classList.remove('drop-before', 'drop-after'));
    if (!over || over.dataset.key === dragKey) return;
    e.preventDefault();
    const r = over.getBoundingClientRect();
    over.classList.add(e.clientY < r.top + r.height / 2 ? 'drop-before' : 'drop-after');
  });
  document.addEventListener('drop', (e) => {
    if (!dragKey) return;
    const over = e.target.closest && e.target.closest('.sec-list .grp');
    if (!over || over.dataset.key === dragKey) return;
    e.preventDefault();
    const after = over.classList.contains('drop-after');
    const o = VC.sectionOrder(card(), sec(), S.design).filter((k) => k !== dragKey);
    o.splice(o.indexOf(over.dataset.key) + (after ? 1 : 0), 0, dragKey);
    card().order = o;
    dragKey = null;
    structChanged();
  });
  document.addEventListener('dragend', () => {
    dragKey = null;
    document.querySelectorAll('.sec-list .grp').forEach((x) => { x.removeAttribute('draggable'); x.classList.remove('dragging', 'drop-before', 'drop-after'); });
  });

  document.addEventListener('change', async (e) => {
    const t = e.target;
    if (t.type !== 'file' || !(t.dataset.img || t.dataset.gal)) return;
    try {
      if (t.dataset.img) {
        const f = t.files[0];
        if (!f) return;
        const logo = /logo/.test(t.dataset.img);
        setP(card(), t.dataset.img, await readImg(f, logo ? 600 : 1200, logo && f.type === 'image/png'));
      } else {
        const arr = g(t.dataset.gal);
        if (arr.length && arr.every((x) => NFC.isDemoMedia(x.src))) { arr.length = 0; toast('Les photos d’exemple ont été remplacées par les vôtres.'); }
        const room = Math.max(0, plan().photos - arr.length), files = [...t.files].slice(0, room);
        if (files.length < t.files.length) toast(`Votre forfait permet ${plan().photos} photos par galerie.`);
        for (const f of files) arr.push({ src: await readImg(f, 1200), cap: '' });
      }
      structChanged();
    } catch (err) {
      toast('Cette image n’a pas pu être lue.');
    }
  });

  /* Saisie du lien imprimé, envoi du lien et du QR code par email */
  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f.matches('[data-qrform]')) {
      e.preventDefault();
      const v = $('#qrman').value;
      if (!gotQR(v)) scanMsg('Lien non reconnu. Recopiez l’adresse imprimée sous le QR code, par exemple votre-site.com/c/K7M4QX.', true);
    } else if (f.matches('[data-mailform]')) {
      e.preventDefault();
      const to = $('#sendto').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) { toast('Adresse email invalide : vérifiez-la, par exemple nom@exemple.com.'); $('#sendto').focus(); return; }
      const en = ui() === 'en', name = (card() && card().identity.name) || '';
      const subject = en ? 'Your NFC business card: link and QR code' : 'Votre carte de visite NFC : lien et QR code';
      const body = en
        ? `Hello,\n\nHere is the link to the digital business card${name ? ' of ' + name : ''}:\n${link()}\n\nThe QR code and the NFC chip open this same link. Tap the card on a phone or scan the QR code to see it.\n`
        : `Bonjour,\n\nVoici le lien de la carte de visite numérique${name ? ' de ' + name : ''} :\n${link()}\n\nLe QR code et la puce NFC ouvrent ce même lien. Approchez la carte d’un téléphone ou scannez le QR code pour l’afficher.\n`;
      const a = document.createElement('a');
      a.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      S.sendTo = to;
      S.sent = [to].concat((S.sent || []).filter((x) => x !== to)).slice(0, 5);
      save(); render();
      toast(`Envoi simulé à ${to} : votre messagerie s’ouvre avec le lien. Sur le site final, l’email partira directement avec le QR code en pièce jointe.`);
    }
  });
  document.addEventListener('change', async (e) => {
    const t = e.target;
    if (!t.matches || !t.matches('[data-qrimg]') || !t.files[0]) return;
    scanMsg('Lecture de la photo…');
    try {
      const url = URL.createObjectURL(t.files[0]);
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = url; });
      const txt = await decodeQR(img, img.naturalWidth, img.naturalHeight, detector());
      URL.revokeObjectURL(url);
      if (!txt) scanMsg('Aucun QR code trouvé sur cette photo. Cadrez-le de plus près, bien à plat, et réessayez.', true);
      else gotQR(txt);
    } catch (err) {
      scanMsg('Cette photo n’a pas pu être lue. Essayez avec une autre image.', true);
    }
    t.value = '';
  });

  VC.notify = toast;
  /* Bouton FR | EN de la carte dans l’aperçu : change aussi la version modifiée */
  VC.onLangSwitch = (v) => {
    if (!$('#pv') || v === lang() || !bili()) return;
    S.lang = v; ensureCard(); save();
    const pvL = $('#pv'), st = pvL ? pvL.scrollTop : 0;
    render();
    const n = $('#pv'); if (n) n.scrollTop = st;
    toast(v === 'en' ? 'Version anglaise' : 'Version française');
  };
  VC.onLead = (l) => {
    toast(`Nouveau contact reçu : ${[l.prenom, l.nom].filter(Boolean).join(' ')}`);
    if (S.step === 5) setTimeout(() => { const pv = $('#pv'), st = pv ? pv.scrollTop : 0; render(); const n = $('#pv'); if (n) n.scrollTop = st; }, 1800);
  };
  VC.bind(document, () => mdl());
  render();
  VC.idb.loadAll().then(() => { if (Object.keys(window.NFC_BLOBS).length && S.step > 1) render(); });
})();
