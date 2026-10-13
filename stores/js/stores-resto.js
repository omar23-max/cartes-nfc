/* NexTap Studio – Stores : les 10 restaurants, cafés et bars (venus du studio Cartes, où le secteur est retiré).
   Chaque métier de js/profiles-resto.js devient un type de boutique : sa carte devient un menu avec commande en ligne
   (sur place, à emporter, livraison), il garde le chef, les photos, les soirées, la réservation, l’équipe et les vidéos.
   Photos et vidéos : Mixkit (licence gratuite usage commercial), dossier media/restaurant. Chargé après stores-types-2.js. */
(function () {
  'use strict';
  const R = NFC.RESTO_SECTOR;
  if (!R || !R.profiles) return;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  /* Les pages Stores sont dans stores/ : les médias du site sont un dossier plus haut */
  const up = (o) => (typeof o === 'string' ? (/^media\//.test(o) ? '../' + o : o) : Array.isArray(o) ? o.map(up) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, up(v)])) : o);
  const num = (p) => { const m = String(p || '').replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/); return m ? m[1].replace(',', '.') : ''; };

  /* La carte (menu) devient la boutique : un plat = un produit, avec une photo du restaurant */
  function shopOf(d, en) {
    const menu = d.blocks.menu || { cats: [] };
    const pics = ((d.blocks.gallery || {}).images || []).map((x) => x.src).filter((s) => s && !/^ph:/.test(s));
    let k = 0;
    const items = [];
    (menu.cats || []).forEach((c) => (c.items || []).forEach((it) => {
      items.push({ t: it.t, d: it.d || '', l: '', p: num(it.p), sp: '', b: it.b || '', img: pics.length ? pics[k++ % pics.length] : '', cat: c.name, o: '', on: true, tx: '' });
    }));
    const email = (d.contact || {}).email || '';
    return {
      on: true, label: '', text: en ? 'Order here: dine in, takeout or delivery.' : 'Commandez ici : sur place, à emporter ou en livraison.',
      cats: (menu.cats || []).map((c) => c.name).join(', '), items,
      order: 'sms', phone: '', wa: '', email: '', payUrl: '',
      pay: en ? { cash: true, card: true, zelle: true } : { cash: true, card: true, interac: true, etr: true }, payLinks: {}, payInfo: en ? { zelle: email } : { interac: email },
      dinein: true, food: true, pickup: true, delivery: true, fee: '5', freeFrom: '40', zone: '', tax: en ? 'us' : 'qc', rate: en ? '8.875' : '',
    };
  }
  function demoOf(src, en) {
    const d = up(clone(src));
    d.blocks.shop = shopOf(d, en);
    delete d.blocks.menu;
    if (d.blocks.order) d.blocks.order.on = false;
    d.primary = 'shop';
    const ord = d.order || [];
    d.order = ['b:shop'].concat(ord.filter((x) => x !== 'b:menu' && x !== 'b:order' && x !== 'b:shop'));
    return d;
  }

  const RENAME = { bistro: ['Bistro', 'Bistro'] };
  const TYPES = R.profiles.map((p, i) => {
    const blocks = [{ key: 'shop', type: 'shop', title: 'Notre menu', cta: 'Commander', help: 'Vos plats, catégories, prix et la façon de commander' }]
      .concat(R.blocks.filter((b) => b.key !== 'menu' && b.key !== 'order'));
    const n = RENAME[p.id] || p.n;
    return {
      id: 'r-' + p.id, code: 'B' + (17 + i), name: n[0], nameEn: n[1], icon: p.icon, ex: p.ex[0], exEn: p.ex[1], active: true, establishment: true,
      rec: p.rec || R.rec, palettes: p.palettes || R.palettes, blocks,
      demo: demoOf(p.demo, false), demoEn: demoOf(p.demoEn, true),
      kw: 'restaurant resto cafe bar ' + n.join(' ').toLowerCase() + ' ' + p.ex.join(' ').toLowerCase(),
    };
  });
  /* Juste après « Restaurant (pour emporter) » */
  const at = NFC.SECTORS.findIndex((s) => s.id === 'resto');
  NFC.SECTORS.splice(at < 0 ? NFC.SECTORS.length : at + 1, 0, ...TYPES);

  const EN = {};
  TYPES.forEach((t) => { EN[t.name] = t.nameEn; EN[t.ex] = t.exEn; });
  Object.assign(EN, { 'Vos plats, catégories, prix et la façon de commander': 'Your dishes, categories, prices and how customers order', 'Notre menu': 'Our menu', 'Commander': 'Order now' });
  Object.assign(window.NFC_EN_APP || (window.NFC_EN_APP = {}), EN);
  Object.assign(window.NFC_EN_UI || (window.NFC_EN_UI = {}), EN);
})();
