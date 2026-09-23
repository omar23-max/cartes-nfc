/* Assistant : Secteur → Modèle → Couleurs → Contenu → Publication */
(function () {
  'use strict';

  const { SECTORS, DESIGNS, OTHER } = NFC;
  const { ic, esc } = VC;
  const $ = (s, r = document) => r.querySelector(s);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const KEY = 'nfc-studio-v6';
  const STEPS = ['Secteur', 'Modèle', 'Couleurs', 'Contenu', 'Publication'];

  const fresh = () => ({ v: 1, step: 1, sectorId: null, design: null, palette: 0, cards: {}, id: rid() });
  let S = load();
  const openGroups = new Set(['identity']);
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

  const sec = () => SECTORS.find((s) => s.id === S.sectorId);
  /* Langue de la carte : celle choisie, sinon celle du site */
  const lang = () => (S.lang === 'en' || S.lang === 'fr' ? S.lang : S.ui === 'en' ? 'en' : 'fr');
  const ckey = (id = S.sectorId) => (lang() === 'en' ? id + ':en' : id);
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
    const other = S.cards[lang() === 'en' ? s.id : s.id + ':en'];
    if (other) mirrorMedia(other, S.cards[ckey()], lang() === 'en');
    normSocials(S.cards[ckey()]);
  };

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
    const a = S.cards[ckey()], b = S.cards[lang() === 'en' ? s.id : s.id + ':en'];
    if (a && b) mirrorMedia(a, b, lang() !== 'en');
  }
  /* Textes par défaut proposés dans l’éditeur, dans la langue de la carte */
  const uiLang = (x) => (lang() === 'en' && window.NFC_EN_UI && window.NFC_EN_UI[x]) || x;
  const QR_BASE = 'https://votre-site.com/c/';
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
    return { card: card() || demoOf(s), sec: s, d: d || s.rec, pal: s.palettes[p] || s.palettes[0], link: link(), lang: lang(), bilingual: bili() };
  };
  const designOf = (id) => DESIGNS.find((d) => d.id === id);
  const code = (d = S.design) => `${sec().code}-${String(d || sec().rec).toUpperCase()}`;

  const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
  const setP = (o, path, v) => { const ks = path.split('.'), last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const g = (p) => getP(card(), p);

  function maxStep() { return !S.sectorId ? 1 : !S.design ? 2 : 5; }
  function go(n) { S.step = Math.max(1, Math.min(n, maxStep())); save(); render(); window.scrollTo(0, 0); }

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
    document.title = ui() === 'en' ? 'NFC Card Studio' : 'Studio Carte NFC';
    const main = $('#main');
    main.innerHTML = [step1, step2, step3, step4, step5][S.step - 1]();
    main.dataset.step = S.step;
    icons();
    if (S.step === 5) drawQR();
    translateTree(document.body);
  }
  const icons = () => { if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } }); };

  function renderPreview() {
    const pv = $('#pv');
    if (!pv) return;
    const st = pv.scrollTop;
    pv.innerHTML = VC.render(mdl());
    pv.scrollTop = st;
  }
  const schedulePv = () => { clearTimeout(pvTimer); pvTimer = setTimeout(renderPreview, 120); };

  const langSwitch = () => `<div class="lang-sw"><span>${bili() ? 'Version à modifier' : 'Langue de la carte'}</span><div class="seg" role="group" aria-label="Langue de la carte">
      <button type="button" class="${lang() === 'fr' ? 'on' : ''}" data-act="lang" data-v="fr">Français</button><button type="button" class="${lang() === 'en' ? 'on' : ''}" data-act="lang" data-v="en">English</button></div>
      <label class="ck bili-ck" title="Affiche un bouton FR | EN sur la carte : le visiteur choisit sa langue"><input type="checkbox" data-act="bili" ${bili() ? 'checked' : ''}><span>Carte bilingue</span></label></div>`;
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

  function step1() {
    if (S.qr === undefined) return step0();
    const tiles = SECTORS.map((s) => `
      <button class="tile ${s.active ? '' : 'soon'} ${S.sectorId === s.id ? 'sel' : ''} ${bgOf(s) ? 'has-bg' : ''}" data-act="sector" data-id="${s.id}"${bgOf(s) ? ` style="background-image:url('${bgOf(s)}')"` : ''}>
        <span class="tile-top"><span class="tile-ic"><i data-lucide="${s.icon}"></i></span><span class="tile-code">${s.code}</span>${s.active ? '' : '<span class="tile-b">Bientôt</span>'}</span>
        <span class="tile-n">${s.name}</span>
        <span class="tile-ex">${s.ex}</span>
      </button>`).join('');
    return `<section class="wrap">
      ${head('Quel est votre secteur d’activité ?', 'Choisissez le secteur le plus proche de votre activité. Votre fonction, vos textes et vos blocs restent entièrement personnalisables ensuite.')}
      ${qrNote()}
      <div class="tiles">${tiles}
        <button class="tile other" data-act="other">
          <span class="tile-top"><span class="tile-ic"><i data-lucide="circle-help"></i></span></span>
          <span class="tile-n">Je ne trouve pas mon secteur</span>
          <span class="tile-ex">Répondez à une question, nous vous orientons vers le bon modèle.</span>
        </button>
      </div>
    </section>`;
  }

  function pickSector(id, fromOther) {
    const s = SECTORS.find((x) => x.id === id);
    if (!s.active) {
      toast(`« ${s.name} » arrive bientôt.`);
      return;
    }
    if (S.sectorId !== id) { S.sectorId = id; S.design = null; }
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
    const cards = DESIGNS.map((d) => `
      <div class="tpl ${S.design === d.id ? 'sel' : ''}" role="button" tabindex="0" aria-label="Choisir le modèle ${d.name}" data-act="design" data-id="${d.id}">
        <div class="tpl-view"><div class="thumb" aria-hidden="true"><div class="phone"><div class="phone-screen">${VC.render(Object.assign(mdl(d.id), { thumb: true }))}</div></div></div>
          <button type="button" class="tpl-zoom" data-act="fullpreview" data-id="${d.id}" aria-label="Aperçu plein écran du modèle ${d.name}">${ic('eye', 15)}Aperçu</button></div>
        <div class="tpl-meta">
          <div class="tpl-top"><span class="tpl-n">${d.name}</span>${s.rec === d.id ? '<span class="rec">Recommandé</span>' : ''}</div>
          <p>${d.desc}</p>
          <div class="tpl-foot"><span class="tpl-code">${s.code}-${d.id.toUpperCase()}</span><span class="tpl-go">Choisir ${ic('arrow', 14)}</span></div>
        </div>
      </div>`).join('');
    return `<section class="wrap">
      ${back(1, 'Changer de secteur')}
      ${langSwitch()}
      ${head('Choisissez votre modèle', `${DESIGNS.length} mises en page pour <b>${s.name}</b>. Faites défiler chaque miniature pour voir toute la carte, puis cliquez pour la choisir. Vous pourrez en changer à tout moment sans perdre vos informations.`)}
      <div class="tpls">${cards}</div>
    </section>`;
  }

  /* ---------- Étape 3 : couleurs ---------- */
  function step3() {
    const s = sec();
    const pals = s.palettes.map((p, i) => `
      <button class="pal ${S.palette === i ? 'sel' : ''}" data-act="palette" data-i="${i}">
        <span class="sw"><i style="background:${p.p}"></i><i style="background:${p.a}"></i><i style="background:${p.bg}"></i></span>
        <span class="pal-n">${p.name}</span>
        <span class="pal-ck">${ic('check', 16)}</span>
      </button>`).join('');
    return `<section class="wrap">
      ${back(2, 'Changer de modèle')}
      ${head('Choisissez vos couleurs', `Modèle <b>${designOf(S.design).name}</b> · 5 palettes pensées pour votre secteur.`)}
      <div class="split">
        <div class="side">
          <div class="pals">${pals}</div>
          <p class="muted small">Une couleur personnalisée ou extraite de votre logo pourra être ajoutée plus tard.</p>
          <button class="b pri lg" data-act="go" data-n="4">Remplir ma carte ${ic('arrow', 18)}</button>
        </div>
        <div class="pv-col">${phone()}</div>
      </div>
    </section>`;
  }

  /* ---------- Étape 4 : contenu ---------- */
  function step4() {
    const s = sec(), p = s.palettes[S.palette];
    return `<section class="wrap wide">
      <div class="ed-bar">
        <div class="ed-info"><span class="code">${code()}${lang() === 'en' ? ' · EN' : ''}</span><span>${s.name} · ${designOf(S.design).name} · ${p.name}</span></div>
        <div class="ed-links">
          ${langSwitch()}
          <button class="b sm" data-act="go" data-n="2">Changer de modèle</button>
          <button class="b sm" data-act="go" data-n="3">Changer de couleurs</button>
          <button class="b sm ghost" data-act="clear">Vider les exemples</button>
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
      <label class="f"><span class="f-l">Action principale</span><select data-path="primary">${primaryOptions()}</select><span class="f-h">Le gros bouton toujours visible en bas de la carte.</span></label>
      <label class="ck"><input type="checkbox" data-path="exchange" ${card().exchange !== false ? 'checked' : ''}><span>Après « Enregistrer le contact », proposer au visiteur de me laisser ses coordonnées</span></label>`);
    normSocials(card());
    const socRow = ([k, l]) => { const on = !!(card().socialsOn || {})[k]; return `<div class="soc-f ${on ? 'on' : ''}" data-socf="${k}">
        <label class="soc-ck" title="Afficher ${l} sur la carte"><input type="checkbox" data-path="socialsOn.${k}" data-socck="${k}" ${on ? 'checked' : ''}><span class="soc-lg">${VC.brandIc(k, 18)}</span><span class="soc-n">${l}</span></label>
        <input type="text" data-path="socials.${k}" data-soc="${k}" inputmode="url" spellcheck="false" value="${esc(g('socials.' + k))}" placeholder="${VC.SOC_BASE[k]}…" aria-label="Adresse ${l}">
      </div>`; };
    h += grp('socials', 'Réseaux sociaux', 'Cochez vos réseaux, complétez l’adresse', `<div class="soc-ed">${VC.SOC.map(socRow).join('')}</div>`);
    h += sectionsEd();
    return h;
  }

  function coverEd() {
    const id = card().identity, video = id.coverType === 'video';
    const kind = id.coverVideoFile ? 'Vidéo téléversée' : id.coverVideoUrl ? 'Lien vidéo' : id.coverVideo ? 'Vidéo d’exemple' : '';
    const cur = VC.vsrc(id.coverVideoFile) || id.coverVideoUrl || id.coverVideo;
    return `<div class="f"><span class="f-l">Couverture</span>
        <div class="seg" role="group" aria-label="Type de couverture"><button type="button" class="${video ? '' : 'on'}" data-act="setcover" data-v="image">${ic('image', 15)}Image</button><button type="button" class="${video ? 'on' : ''}" data-act="setcover" data-v="video">${ic('play', 13)}Vidéo</button></div></div>
      ${video ? `<div class="cover-vid">
          ${cur ? `<div class="demo-vid"><video src="${esc(cur)}" muted playsinline preload="metadata"></video><div><b>${kind}</b><span>Démarre sans le son et tourne en boucle.</span>${id.coverVideoFile || id.coverVideoUrl ? `<button class="b xs ghost" data-act="coverclear">Retirer ma vidéo</button>` : ''}</div></div>` : ''}
          <div class="f"><span class="f-l">Votre vidéo de couverture</span>
            <div class="vsrc"><label class="b sm pri">${ic('upload', 15)}Téléverser une vidéo<input type="file" accept="video/mp4,video/webm,video/quicktime" hidden data-vid="identity.cover"></label><span class="f-h">MP4, WebM ou MOV, 60 Mo maximum. Idéalement 10 à 30 secondes.</span></div>
          </div>
          ${inp('Ou collez un lien vers la vidéo', 'identity.coverVideoUrl', { ph: 'https://…/ma-video.mp4', hint: 'Lien direct vers un fichier vidéo (.mp4). Les liens YouTube ne peuvent pas servir de couverture.' })}
        </div>` : ''}
      <p class="f-h">La couverture apparaît dans les modèles Visuel, Immersif, Carte, Mosaïque et Vague. L’image de couverture sert aussi d’affiche à la vidéo.</p>`;
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

  /* Toutes les sections (blocs du secteur + sections ajoutées), dans l’ordre choisi, déplaçables */
  function sectionsEd() {
    const s = sec(), c = card(), cs = c.custom || (c.custom = []);
    const order = VC.sectionOrder(c, s, S.design);
    let h = `<h3 class="ed-sub">Sections de votre carte<span>Activez ou masquez chaque section, et réorganisez-les : glissez-les par la poignée ou utilisez les flèches.</span></h3><div class="sec-list">`;
    order.forEach((k, idx) => {
      const mv = `<div class="cs-ctl">
          <button class="ib" data-act="omove" data-k="${k}" data-d="-1" aria-label="Monter" title="Monter" ${idx === 0 ? 'disabled' : ''}><span class="up">${ic('chevd', 16)}</span></button>
          <button class="ib" data-act="omove" data-k="${k}" data-d="1" aria-label="Descendre" title="Descendre" ${idx === order.length - 1 ? 'disabled' : ''}>${ic('chevd', 16)}</button>
          <button class="ib dup" data-act="dup" data-k="${k}" aria-label="Dupliquer la section" title="Dupliquer la section">${ic('copy', 15)}</button>`;
      if (k.startsWith('b:')) {
        const def = s.blocks.find((b) => b.key === k.slice(2)), bt = (c.blocks[def.key] || {}).title;
        const titleF = inp('Titre de la section', `blocks.${def.key}.title`, { ph: def.title, hint: 'Laissez vide pour garder le titre proposé.' });
        h += grp('b-' + def.key, esc(bt || def.title), def.help || '', titleF + blockEd(def), `blocks.${def.key}.on`, mv + '</div>', k);
      } else {
        const i = cs.findIndex((x, j) => (x.cid || 'i' + j) === k.slice(2));
        if (i < 0) return;
        const cc = cs[i];
        const label = cc.type === 'block' ? cc.def.title : SEC_TYPES[cc.type][0];
        const body = cc.type === 'block'
          ? inp('Titre de la section', `custom.${i}.title`, { ph: cc.def.title }) + blockEd(cc.def, `custom.${i}.data`)
          : customBody(cc, i);
        h += grp('c-' + (cc.cid || i), esc(cc.title || label), cc.type === 'block' ? `Copie · ${esc(cc.def.title)}` : `Section ajoutée · ${label}`, body, '', mv + del('custom', i, 'Supprimer la section') + '</div>', k, 'cgrp');
      }
    });
    h += `</div><div class="add-sec"><span class="f-l">${ic('plus', 15)}Ajouter une section</span><div class="add-sec-b">${Object.entries(SEC_TYPES).map(([t, [l, i]]) => `<button type="button" class="b sm" data-act="addsec" data-t="${t}">${ic(i, 15)}${l}</button>`).join('')}</div></div>`;
    return h;
  }

  /* Source d’une vidéo : fichier téléversé, exemple ou lien */
  function vidSource(path, src, link) {
    const kind = link ? '' : /^idb:/.test(src || '') ? 'Vidéo téléversée' : src ? 'Vidéo d’exemple' : '';
    return `<div class="vsrc full">${kind ? `<span class="demo-tag">${kind}</span>` : ''}<label class="b xs">${ic('upload', 14)}Téléverser une vidéo<input type="file" accept="video/mp4,video/webm,video/quicktime" hidden data-vid="${path}"></label>${src ? `<button class="b xs ghost" data-act="imgdel" data-path="${path}.src">Retirer</button>` : ''}</div>`;
  }

  /* Nouvelle section pré-remplie avec des médias d’exemple, pour voir tout de suite le rendu */
  function newSection(t) {
    const m = (NFC.MEDIA || {})[S.sectorId] || {};
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
          <div class="items">${(c.items || []).map((x, i) => `<div class="it"><div class="it-f">${mini(`${base}.cats.${ci}.items.${i}.t`, 'Plat', 'strong')}${mini(`${base}.cats.${ci}.items.${i}.d`, 'Description')}${mini(`${base}.cats.${ci}.items.${i}.p`, 'Prix', 'price')}</div>${del(`${base}.cats.${ci}.items`, i)}</div>`).join('')}</div>
          ${add(`${base}.cats.${ci}.items`, 'item', 'Ajouter un plat')}</div>`).join('')}${add(base + '.cats', 'cat', 'Ajouter une rubrique')}`;
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
          const top = byId(reco[0]), recoP = reco.slice(1).map(byId).filter(Boolean);
          const others = VC.PROVIDERS.filter((x) => !reco.includes(x.id)).sort((x, y) => x.name.localeCompare(y.name));
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
          <label class="ck"><input type="checkbox" data-path="${base}.map" ${b.map !== false ? 'checked' : ''}><span>Afficher le plan Google Maps</span></label>`;
      case 'action':
        return `<div class="row2">${inp('Texte du bouton', base + '.label', { ph: def.cta })}${inp('Lien de réservation', base + '.url', { ph: 'https://…' })}</div>${area('Texte d’accompagnement', base + '.text', { rows: 2 })}`;
      case 'form':
        return `${inp('Adresse de réception des demandes', base + '.email', { type: 'email' })}${area('Texte d’introduction', base + '.text', { rows: 2 })}
          <label class="ck"><input type="checkbox" data-path="${base}.files" ${b.files || b.photos ? 'checked' : ''}><span>Permettre au visiteur de joindre des fichiers (PDF, JPG, PNG)</span></label>`;
      case 'tags':
        return `${inp('Éléments', base + '.tags', { hint: 'Séparez-les par des virgules.' })}${def.withText ? inp('Précision', base + '.text') : ''}`;
      case 'links':
        return `<div class="items">${(b.items || []).map((x, i) => `<div class="it"><div class="it-f two">${mini(`${base}.items.${i}.label`, 'Intitulé', 'strong')}${mini(`${base}.items.${i}.url`, 'Lien https://…')}</div>${del(base + '.items', i)}</div>`).join('')}</div>${add(base + '.items', 'link', 'Ajouter un lien')}`;
      case 'video':
        return `${b.src && VC.vsrc(b.src) ? `<div class="demo-vid"><video src="${esc(VC.vsrc(b.src))}" muted playsinline preload="metadata"></video><div><b>${/^idb:/.test(b.src) ? 'Vidéo téléversée' : 'Vidéo d’exemple'}</b><span>${b.url ? 'Votre lien ci-dessous est prioritaire.' : 'Téléversez la vôtre ou collez un lien.'}</span></div></div>` : ''}
          ${vidSource(base, b.src, '')}
          ${inp('Ou lien de votre vidéo', base + '.url', { ph: 'YouTube, Vimeo, Instagram…', hint: 'La vidéo se lance au clic, pour garder une carte légère.' })}${inp('Légende', base + '.cap')}${imgF('Image de couverture', base + '.cover')}`;
      default:
        return '';
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

  const TPL = { rev: { n: '', r: '', t: '', s: 5 }, vid: { url: '', src: '', cover: '', cap: '' }, item: { t: '', d: '', p: '' }, card: { t: '', d: '', p: '', img: '', url: '' }, stat: { v: '', l: '' }, cat: { name: '', items: [{ t: '', d: '', p: '' }] }, hour: { d: '', h: '' }, link: { label: '', url: '' } };

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
            <div><span class="box-l">QR code</span><p>${hasQR() ? 'Le même QR code que celui imprimé sur votre carte. Réutilisez-le sur une vitrine, un flyer ou une signature email.' : 'À imprimer au dos de la carte NFC, sur une vitrine, un flyer ou une signature email.'}</p></div>
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
    const data = { modele: code(), secteur: sec().name, design: designOf(S.design).name, palette: sec().palettes[S.palette], lien: link(), carte: card() };
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
      case 'palette': S.palette = +t.dataset.i; save(); render(); break;
      case 'grp': {
        const el = t.closest('.grp'), id = t.dataset.id;
        el.classList.toggle('open');
        if (el.classList.contains('open')) { openGroups.add(id); showInPreview(id); } else openGroups.delete(id);
        break;
      }
      case 'add': g(t.dataset.path).push(clone(TPL[t.dataset.tpl])); structChanged(); break;
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
          const cur = S.lang; ['fr', 'en'].forEach((l) => { S.lang = l; ensureCard(); }); S.lang = cur;
          toast('Carte bilingue : vos visiteurs choisissent FR ou EN. Pensez à remplir les deux versions.');
        }
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
        toast(ui() === 'en' ? 'Site and card in English. You can pick another card language above the preview.' : 'Site et carte en français. Vous pouvez choisir une autre langue pour la carte au-dessus de l’aperçu.');
        break;
      }
      case 'lang': {
        if (t.dataset.v === lang()) break;
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
        const cs = card().custom || (card().custom = []);
        const ns = Object.assign(newSection(t.dataset.t), { cid: rid() });
        cs.push(ns);
        openGroups.add('c-' + ns.cid);
        structChanged();
        toast(`Section « ${SEC_TYPES[t.dataset.t][0]} » ajoutée en bas de la carte.`);
        const pv = $('#pv'); if (pv) setTimeout(() => { pv.scrollTop = pv.scrollHeight; }, 50);
        break;
      }
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
      case 'mtab': mobileTab = t.dataset.t; render(); window.scrollTo(0, 0); break;
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
      case 'vcf': VC.downloadVCard(card()); break;
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
    if (t.dataset.struct === 'toggle') { t.closest('.grp').classList.toggle('off', !t.checked); renderPreview(); }
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
  function showInPreview(id) {
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
        for (const f of t.files) arr.push({ src: await readImg(f, 1200), cap: '' });
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
    if (!$('#pv') || v === lang()) return;
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
