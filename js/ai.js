/* Création d’un modèle sur mesure : l’IA choisit la mise en page, la palette, la typographie
   et rédige les textes. Sans IA (site statique), un générateur local propose des thèmes variés. */
(function () {
  'use strict';

  const TYPOS = ['moderne', 'serif', 'editorial', 'mono'];
  const DENS = ['compacte', 'standard', 'aeree'];
  const MOODS = [
    ['chaleureux', 'Chaleureux', 'Warm'],
    ['sobre', 'Sobre et pro', 'Clean & pro'],
    ['luxe', 'Haut de gamme', 'Upscale'],
    ['energique', 'Énergique', 'Energetic'],
    ['naturel', 'Naturel', 'Natural'],
    ['creatif', 'Créatif', 'Creative'],
  ];

  /* ---------- Couleurs : conversions et contraste ---------- */
  const hex = (x) => {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(x || '').trim());
    if (!m) return null;
    const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
    return '#' + h.toLowerCase();
  };
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (h) => {
    const c = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (h, target, k) => { const a = rgb(h), b = rgb(target); return toHex(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k); };
  /* Assombrit ou éclaircit jusqu’à obtenir un contraste lisible */
  function fix(color, against, min, dark) {
    let c = color;
    for (let i = 0; i < 24 && ratio(c, against) < min; i++) c = mix(c, dark ? '#000000' : '#ffffff', 0.06);
    return c;
  }
  const hsl = (h) => {
    const [r, g, b] = rgb(h).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let hh = 0;
    if (d) hh = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [hh * 60, mx ? d / mx : 0, (mx + mn) / 2];
  };
  const fromHsl = (h, s, l) => {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return toHex((t[0] + m) * 255, (t[1] + m) * 255, (t[2] + m) * 255);
  };

  /* Une palette toujours lisible : texte sur fond, blanc sur couleur principale */
  function safePal(p) {
    const g = (v, d) => hex(v) || d;
    const o = {
      name: String(p.name || 'Palette sur mesure').slice(0, 30),
      p: g(p.p, '#1e3a8a'), a: g(p.a, '#3b82f6'), bg: g(p.bg, '#f5f5f2'),
      sf: g(p.sf, '#ffffff'), tx: g(p.tx, '#15151a'), mu: g(p.mu, '#6b6a70'), ln: g(p.ln, '#e4e2dc'),
    };
    if (lum(o.bg) < 0.5) { o.bg = mix(o.bg, '#ffffff', 0.86); o.sf = '#ffffff'; }
    o.tx = fix(o.tx, o.bg, 8, true);
    o.p = fix(o.p, o.sf, 4.5, true);
    o.mu = fix(o.mu, o.bg, 3.4, true);
    if (ratio(o.a, o.sf) < 1.6) o.a = mix(o.a, o.p, 0.5);
    return o;
  }

  /* ---------- Générateur local, utilisé quand l’IA n’est pas disponible ---------- */
  const MOOD_CFG = {
    chaleureux: { h: 24, s: 0.62, l: 0.36, typo: 'serif', dens: 'standard', r: 18, d: ['d4', 'd1', 'd9'] },
    sobre: { h: 218, s: 0.58, l: 0.34, typo: 'moderne', dens: 'standard', r: 12, d: ['d1', 'd7', 'd2'] },
    luxe: { h: 42, s: 0.42, l: 0.3, typo: 'serif', dens: 'aeree', r: 6, d: ['d10', 'd2', 'd6'] },
    energique: { h: 350, s: 0.72, l: 0.46, typo: 'moderne', dens: 'compacte', r: 22, d: ['d9', 'd3', 'd8'] },
    naturel: { h: 142, s: 0.4, l: 0.3, typo: 'editorial', dens: 'aeree', r: 16, d: ['d3', 'd4', 'd6'] },
    creatif: { h: 276, s: 0.6, l: 0.45, typo: 'editorial', dens: 'standard', r: 20, d: ['d8', 'd5', 'd9'] },
  };
  function localTheme(ans, i) {
    const cfg = MOOD_CFG[ans.mood] || MOOD_CFG.sobre;
    const base = hex(ans.color);
    const h = base ? hsl(base)[0] : cfg.h + i * 14;
    const s = base ? Math.max(0.3, hsl(base)[1]) : cfg.s;
    const p = base && i === 0 ? base : fromHsl(h + (i - 1) * 8, s, cfg.l + i * 0.04);
    return {
      name: ['Sur mesure', 'Variante claire', 'Variante contrastée'][i] || 'Sur mesure',
      design: cfg.d[i % cfg.d.length],
      typo: i === 2 ? TYPOS[(TYPOS.indexOf(cfg.typo) + 1) % TYPOS.length] : cfg.typo,
      density: i === 1 ? 'standard' : cfg.dens,
      radius: [cfg.r, Math.max(0, cfg.r - 10), cfg.r + 6][i % 3],
      why: 'Proposition locale : couleur, typographie et mise en page choisies d’après votre ambiance.',
      pal: safePal({
        name: ['Sur mesure', 'Variante claire', 'Variante contrastée'][i] || 'Sur mesure',
        p, a: fromHsl(h + 28, Math.min(0.9, s + 0.12), Math.min(0.7, cfg.l + 0.28)),
        bg: fromHsl(h, 0.16, 0.965), sf: '#ffffff',
        tx: fromHsl(h, 0.24, 0.1), mu: fromHsl(h, 0.1, 0.42), ln: fromHsl(h, 0.16, 0.9),
      }),
    };
  }

  /* ---------- Appel à l’IA ---------- */
  const DESIGN_LIST = () => (NFC.DESIGNS || []).map((d) => `${d.id} = ${d.name} : ${d.desc}`).join('\n');

  function prompt(sec, ans, lang, prev, feedback) {
    const moods = MOODS.map((m) => m[0]).join(', ');
    return `Tu conçois des cartes de visite numériques. Réponds UNIQUEMENT en JSON valide.

Métier du client : ${sec.name}. Description donnée par le client : « ${ans.job || sec.ex} ».
Ambiance souhaitée : ${ans.mood || 'sobre'} (parmi : ${moods}).
Couleur imposée : ${ans.color || 'aucune, choisis librement'}.
${feedback ? `Le client a vu ces propositions et demande : « ${feedback} ». Garde ce qui marchait, applique sa demande.` : ''}
${prev ? `Propositions précédentes (à faire évoluer) : ${JSON.stringify(prev)}` : ''}

Mises en page disponibles :
${DESIGN_LIST()}

Donne 3 propositions VRAIMENT différentes (mise en page, couleurs et typographie distinctes).
Chaque palette doit être lisible : fond très clair, texte presque noir, couleur principale foncée car du texte blanc s’affiche dessus.
${ans.content ? `Rédige aussi les textes, en français ET en anglais, à la première personne, concrets, sans superlatifs creux. Marché : Canada et États-Unis, prix en dollars.` : 'Ne rédige aucun texte : omets la clé "content".'}

Format exact :
{"props":[{
  "nom": "nom court de l’ambiance, 2 ou 3 mots",
  "design": "d1 à d10",
  "typo": "moderne | serif | editorial | mono",
  "density": "compacte | standard | aeree",
  "radius": 0 à 24,
  "why": "une phrase expliquant le choix, en français",
  "pal": {"name":"nom de la palette","p":"#hex","a":"#hex","bg":"#hex","sf":"#hex","tx":"#hex","mu":"#hex","ln":"#hex"}${ans.content ? `,
  "content": {
    "fr": {"role":"fonction, 2 à 4 mots","specialty":"accroche, moins de 60 caractères","about":"2 courts paragraphes séparés par \\n","services":[{"t":"titre","d":"détail en une ligne","p":"prix ou Sur devis"}],"tags":"5 mots-clés séparés par des virgules"},
    "en": {"role":"...","specialty":"...","about":"...","services":[{"t":"","d":"","p":""}],"tags":"..."}
  }` : ''}
}]}`;
  }

  async function ask(sec, ans, prev, feedback) {
    const sample = window.claude && window.claude.use ? await window.claude.use('sample') : null;
    if (!sample) return null;
    const out = await sample.json(prompt(sec, ans, 'fr', prev, feedback), { modelTier: 'default' });
    const props = (out && out.props) || [];
    if (!props.length) return null;
    return props.slice(0, 3).map((t) => ({
      name: String(t.nom || t.name || 'Sur mesure').slice(0, 40),
      design: (NFC.DESIGNS || []).some((d) => d.id === t.design) ? t.design : sec.rec,
      typo: TYPOS.includes(t.typo) ? t.typo : 'moderne',
      density: DENS.includes(t.density) ? t.density : 'standard',
      radius: Math.max(0, Math.min(26, +t.radius || 14)),
      why: String(t.why || '').slice(0, 220),
      pal: safePal(t.pal || {}),
      content: t.content || null,
    }));
  }

  window.NFC_AI = { MOODS, TYPOS, DENS, ask, localTheme, safePal, hasAI: () => !!(window.claude && window.claude.use) };
})();
