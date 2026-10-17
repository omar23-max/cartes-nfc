/* NexTap Studio – Stores : « Producteurs et commerces alimentaires » (11 commerces venus du studio Cartes, js/profiles-prod.js).
   Un seul type de boutique, avec le choix du commerce (ferme, épicerie bio, vignoble…). Les produits de chaque commerce
   deviennent une boutique en ligne (catalogue, panier, cueillette ou livraison) ; il garde ses photos, arrivages, horaires et vidéo.
   Photos et vidéos : Mixkit (licence gratuite usage commercial), dossiers media/prod et media/producteurs. Chargé après stores-resto.js. */
(function () {
  'use strict';
  const P = NFC.PROD_SECTOR;
  if (!P || !P.profiles) return;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  /* Les pages Stores sont dans stores/ : les médias du site sont un dossier plus haut */
  const up = (o) => (typeof o === 'string' ? (/^media\//.test(o) ? '../' + o : o) : Array.isArray(o) ? o.map(up) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, up(v)])) : o);
  const num = (p) => { const m = String(p || '').replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/); return m ? m[1].replace(',', '.') : ''; };

  /* Les produits (avec un prix) deviennent le catalogue, chacun avec une photo du commerce */
  function shopOf(d, en) {
    const list = (d.blocks.produits || {}).items || [];
    const pics = ((d.blocks.gallery || {}).images || []).map((x) => x.src).filter((s) => s && !/^ph:/.test(s));
    const cat = en ? 'Products' : 'Produits';
    const items = list.filter((it) => num(it.p)).map((it, k) => ({ t: it.t, d: it.d || '', l: '', p: num(it.p), sp: '', b: '', img: pics.length ? pics[k % pics.length] : '', cat, o: '', on: true, tx: '' }));
    const email = (d.contact || {}).email || '';
    return {
      on: true, label: '', text: en ? 'Order online: pick up at the farm or local delivery.' : 'Commandez en ligne : cueillette sur place ou livraison locale.',
      cats: cat, items,
      order: 'sms', phone: '', wa: '', email: '', payUrl: '',
      pay: en ? { cash: true, card: true, zelle: true } : { cash: true, card: true, interac: true, etr: true }, payLinks: {}, payInfo: en ? { zelle: email } : { interac: email },
      dinein: false, food: true, pickup: true, delivery: true, fee: '5', freeFrom: '75', zone: '', tax: en ? 'us' : 'qc', rate: en ? '6' : '',
    };
  }
  function demoOf(src, en) {
    const d = up(clone(src));
    d.blocks.shop = shopOf(d, en);
    if (d.blocks.produits) d.blocks.produits.on = false;
    if (d.blocks.order) d.blocks.order.on = false;
    d.primary = 'shop';
    const ord = d.order || [];
    d.order = ['b:shop'].concat(ord.filter((x) => x !== 'b:produits' && x !== 'b:order' && x !== 'b:shop'));
    return d;
  }

  const blocks = [{ key: 'shop', type: 'shop', title: 'Notre boutique', cta: 'Commander', help: 'Vos produits, prix et la façon de commander' }]
    .concat(P.blocks.filter((b) => b.key !== 'produits' && b.key !== 'order'));
  const profiles = P.profiles.map((p) => ({
    id: p.id, icon: p.icon, n: p.n, ex: p.ex, rec: p.rec || P.rec, palettes: p.palettes || P.palettes,
    tile: up(p.tile || (p.media && p.media.cover) || ''), media: up(p.media || {}),
    demo: demoOf(p.demo, false), demoEn: demoOf(p.demoEn, true),
  }));
  const T = {
    id: 'prod', code: 'B27', name: 'Producteurs et commerces alimentaires', nameEn: 'Farms & food shops', icon: 'wheat',
    ex: 'Ferme, épicerie bio, vignoble, œufs, fromagerie, miel…', exEn: 'Farm, organic grocery, winery, eggs, cheese, honey…',
    active: true, establishment: true, rec: P.rec, palettes: P.palettes, blocks, tile: '../media/tiles/producteurs.jpg',
    demo: profiles[0].demo, demoEn: profiles[0].demoEn, profiles,
    kw: 'producteur ferme farm epicerie bio vin vignoble oeufs charcuterie boucherie biere brasserie boulangerie pain fromage miel marche kiosque',
  };
  /* Juste après « Supermarché et épicerie » */
  const at = NFC.SECTORS.findIndex((s) => s.id === 'epicerie');
  NFC.SECTORS.splice(at < 0 ? NFC.SECTORS.length : at + 1, 0, T);

  /* Miniatures choisies pour les types de boutique (media/tiles/b-<id>.jpg) */
  ['mode', 'friperie', 'bijoux', 'fleuriste', 'deco', 'librairie', 'cadeaux', 'velos', 'cosmetiques', 'telephones', 'epicerie', 'animalerie', 'coiffure', 'esthetique', 'r-sushi', 'r-pizzeria', 'r-steak', 'r-cafe', 'r-brasserie'].forEach((id) => { const t = NFC.SECTORS.find((s) => s.id === id); if (t) t.tile = '../media/tiles/b-' + id + '.jpg'; });

  const EN = { [T.name]: T.nameEn, [T.ex]: T.exEn, 'Vos produits, prix et la façon de commander': 'Your products, prices and how customers order', 'Notre boutique': 'Our shop' };
  Object.assign(window.NFC_EN_APP || (window.NFC_EN_APP = {}), EN);
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), EN);
})();
