/* Secteurs, types de boutique et métiers ajoutés par l’administrateur (admin > Catalogue).
   Chaque ajout part d’un modèle existant (« basé sur ») : mêmes sections, modèles et couleurs,
   puis le nom, les exemples, les mots-clés, les photos et la personne d’exemple sont remplacés.
   Site test : réglages gardés dans ce navigateur (NFC.cfg). Sur GoBiz : enregistrés en base. */
(function () {
  'use strict';
  if (!window.NFC || !NFC.cfg || !NFC.SECTORS) return;
  const me = document.currentScript, kind = (me && me.dataset.kind) || 'cards';
  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
  const EN = (window.NFC_EN_UI = window.NFC_EN_UI || {});
  const okUrl = (u) => typeof u === 'string' && /^https:\/\//.test(u.trim());

  /* Remplace, dans un exemple de carte, la personne, la présentation et les photos */
  function patchDemo(d, x, photos) {
    if (!d) return d;
    const c = clone(d), id = c.identity || (c.identity = {});
    if (x) {
      if (x.name) id.name = x.name;
      if (x.role) id.role = x.role;
      if (x.specialty != null) id.specialty = x.specialty;
      /* Nouvelle personne d’exemple : l’entreprise du modèle de départ ne lui correspond plus */
      if (x.name) id.company = x.company || '';
    }
    if (photos[0]) id.photo = photos[0];
    if (photos[1] || photos[0]) id.cover = photos[1] || photos[0];
    Object.values(c.blocks || {}).forEach((b) => {
      if (!b || typeof b !== 'object') return;
      if (x && x.about && 'text' in b && b === (c.blocks.about || null)) b.text = x.about;
      if (Array.isArray(b.images) && photos.length) b.images = photos.slice(0, 6).map((src, i) => ({ src, cap: (b.images[i] || {}).cap || '' }));
    });
    if (x && x.about && !c.blocks.about) {
      const t = Object.values(c.blocks).find((b) => b && 'text' in b && !('items' in b));
      if (t) t.text = x.about;
    }
    return c;
  }
  const mediaOf = (photos, base) => (photos.length
    ? { portrait: photos[0], cover: photos[1] || photos[0], gallery: photos.map((src) => ({ src, cap: '' })), cards: photos.slice() }
    : clone(base || {}));

  /* ---------- Secteurs / types de boutique ajoutés ---------- */
  const secAdd = (NFC.cfg.get('secAdd', []) || []).filter((x) => (x.kind || 'cards') === kind);
  secAdd.forEach((x, n) => {
    if (NFC.SECTORS.some((s) => s.id === x.id)) return;
    const base = NFC.SECTORS.find((s) => s.id === x.base) || NFC.SECTORS[0];
    if (!base) return;
    const photos = (x.photos || []).filter(okUrl).map((u) => u.trim());
    const prof = base.profiles ? base.profiles[0] : null;
    const s = Object.assign({}, base, {
      id: x.id,
      code: (kind === 'stores' ? 'B' : 'F') + String(60 + n),
      name: x.name,
      ex: x.ex || base.ex,
      kw: x.kw || '',
      active: true,
      custom: true,
      palettes: clone((prof && prof.palettes) || base.palettes),
      rec: (prof && prof.rec) || base.rec,
      demo: patchDemo((prof && prof.demo) || base.demo, x.fr, photos),
      demoEn: patchDemo((prof && prof.demoEn) || base.demoEn || base.demo, x.en, photos),
    });
    delete s.profiles;
    NFC.SECTORS.push(s);
    if (NFC.MEDIA) NFC.MEDIA[x.id] = mediaOf(photos, NFC.MEDIA[base.id] || (prof && prof.media));
    if (x.nameEn) EN[x.name] = x.nameEn;
    if (x.exEn && x.ex) EN[x.ex] = x.exEn;
  });

  /* ---------- Métiers ajoutés ---------- */
  if (kind === 'cards') {
    const profAdd = NFC.cfg.get('profAdd', {}) || {};
    Object.entries(profAdd).forEach(([sid, list]) => {
      const s = NFC.SECTORS.find((z) => z.id === sid);
      if (!s || !Array.isArray(list) || !list.length) return;
      /* Secteur sans métiers : son exemple actuel devient le premier métier (« général ») */
      if (!s.profiles) {
        s.profiles = [{ id: 'general', icon: s.icon, n: [((s.demo || {}).identity || {}).role || 'Général', ((s.demoEn || {}).identity || {}).role || 'General'], ex: [s.ex || '', EN[s.ex] || s.ex || ''], rec: s.rec, palettes: s.palettes, demo: s.demo, demoEn: s.demoEn || s.demo, media: (NFC.MEDIA || {})[s.id] }];
      }
      list.forEach((x) => {
        if (s.profiles.some((p) => p.id === x.id)) return;
        const bp = s.profiles.find((p) => p.id === x.base) || s.profiles[0];
        const photos = (x.photos || []).filter(okUrl).map((u) => u.trim());
        s.profiles.push({
          id: x.id, icon: bp.icon, custom: true,
          n: [x.name, x.nameEn || x.name],
          ex: [x.kw || '', x.kw || ''],
          rec: bp.rec, palettes: clone(bp.palettes || s.palettes),
          demo: patchDemo(bp.demo || s.demo, x.fr, photos),
          demoEn: patchDemo(bp.demoEn || bp.demo || s.demoEn || s.demo, x.en, photos),
          media: mediaOf(photos, bp.media || (NFC.MEDIA || {})[s.id]),
        });
      });
    });
  }
})();
