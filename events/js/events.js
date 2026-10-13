/* NexTap Studio – Événements : affichage des invitations (modèles e1 à e5, sections événement, compte à rebours,
   RSVP, musique) et enveloppe animée sur la page publique. Chargé après js/render.js. */
(function () {
  'use strict';
  const V = window.VC;
  if (!V) return;
  const L2 = (fr, en) => V.L2(fr, en), esc = V.esc, ic = V.ic;
  const en = () => V.lg() === 'en';
  const SVG = {
    play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    note: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    dress: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
  };

  /* ---------- Outils ---------- */
  const blockOf = (m, type) => { const d = m.sec.blocks.find((x) => x.type === type); return d && m.card.blocks[d.key] && m.card.blocks[d.key].on ? { def: d, b: m.card.blocks[d.key] } : null; };
  const when = (b) => (b && b.date ? new Date(`${b.date}T${b.time || '12:00'}:00`) : null);
  function dateTxt(b, long = true) {
    const d = when(b);
    if (!d || isNaN(d)) return '';
    const day = d.toLocaleDateString(en() ? 'en-US' : 'fr-CA', long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long', year: 'numeric' });
    if (!b.time) return day;
    const t = en() ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : `${d.getHours()} h${d.getMinutes() ? ' ' + String(d.getMinutes()).padStart(2, '0') : ''}`;
    return `${day} · ${t}`;
  }
  const mapsUrl = (b) => (b && (b.address || b.place) ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([b.place, b.address].filter(Boolean).join(', ')) : '');
  function calUrl(m, b) {
    const d = when(b);
    if (!d || isNaN(d)) return '';
    const z = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(d.getTime() + 3 * 3600 * 1000);
    const title = (m.card.identity || {}).name || '';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${z(d)}/${z(end)}&location=${encodeURIComponent([b.place, b.address].filter(Boolean).join(', '))}`;
  }
  const photoOf = (m) => V.img((m.card.identity || {}).photo || (m.card.identity || {}).cover || 'ph:cover|', m);

  /* ---------- En-têtes des 5 modèles ---------- */
  function parts(m) {
    const id = m.card.identity || {}, D = (blockOf(m, 'event') || {}).b || {};
    return { title: esc(id.name || ''), sub: id.role ? esc(id.role) : '', date: esc(dateTxt(D)), place: esc(D.place || ''), D, pic: photoOf(m) };
  }
  V.HEADERS = {
    e1(m) {
      const p = parts(m);
      return `<header class="hd"><div class="e1-paper"><div class="e1-arch"><img src="${p.pic}" alt=""></div><h1>${p.title}</h1>${p.sub ? `<p class="role">${p.sub}</p>` : ''}<p class="e1-orn" aria-hidden="true"><i></i>✦<i></i></p>${p.date ? `<p class="e1-date">${p.date}</p>` : ''}${p.place ? `<p class="e1-place">${p.place}</p>` : ''}</div></header>`;
    },
    e2(m) {
      const p = parts(m);
      return `<header class="hd"><div class="e2-ph"><img src="${p.pic}" alt=""><div class="e2-sh"></div><div class="e2-id"><h1>${p.title}</h1>${p.sub ? `<p class="role">${p.sub}</p>` : ''}</div></div>${p.date || p.place ? `<div class="e2-meta">${p.date ? `<span>${ic('cal', 16)}${p.date}</span>` : ''}${p.place ? `<span>${ic('pin', 16)}${p.place}</span>` : ''}</div>` : ''}</header>`;
    },
    e3(m) {
      const p = parts(m), d = when(p.D);
      const big = d && !isNaN(d) ? `<div class="e3-big"><b>${d.getDate()}</b><span>${esc(d.toLocaleDateString(en() ? 'en-US' : 'fr-CA', { month: 'long', year: 'numeric' }))}</span></div>` : '';
      return `<header class="hd">${p.sub ? `<p class="e3-k">${p.sub}</p>` : ''}<h1>${p.title}</h1><span class="e3-line" aria-hidden="true"></span>${big}${p.place ? `<p class="e3-place">${p.place}</p>` : ''}<div class="e3-ph"><img src="${p.pic}" alt=""></div></header>`;
    },
    e4(m) {
      const p = parts(m);
      return `<header class="hd"><div class="e4-glow" aria-hidden="true"></div><div class="e4-av"><img src="${p.pic}" alt=""></div><h1>${p.title}</h1>${p.sub ? `<p class="role">${p.sub}</p>` : ''}${p.date ? `<p class="e4-date">${p.date}</p>` : ''}${p.place ? `<p class="e4-place">${p.place}</p>` : ''}</header>`;
    },
    e5(m) {
      const p = parts(m);
      return `<header class="hd"><div class="e5-conf" aria-hidden="true"></div><div class="e5-ph"><img src="${p.pic}" alt=""></div><h1>${p.title}</h1>${p.sub ? `<p class="role">${p.sub}</p>` : ''}${p.date ? `<p class="e5-date">${ic('cal', 15)}${p.date}</p>` : ''}${p.place ? `<p class="e5-place">${ic('pin', 15)}${p.place}</p>` : ''}</header>`;
    },
  };

  /* ---------- Boutons d’action d’une invitation ---------- */
  V.quickX = (m) => {
    if (!m.sec.event) return null;
    const D = (blockOf(m, 'event') || {}).b, R = blockOf(m, 'rsvp');
    const items = [];
    if (R) items.push(`<a class="qa-i" href="#" data-vc="scroll" data-to="${R.def.key}"><span class="qa-ic">${ic('send')}</span><span class="qa-l">RSVP</span></a>`);
    if (mapsUrl(D)) items.push(`<a class="qa-i" href="${mapsUrl(D)}" target="_blank" rel="noopener"><span class="qa-ic">${ic('pin')}</span><span class="qa-l">${L2('Le lieu', 'Venue')}</span></a>`);
    if (calUrl(m, D || {})) items.push(`<a class="qa-i" href="${calUrl(m, D)}" target="_blank" rel="noopener"><span class="qa-ic">${ic('cal')}</span><span class="qa-l">${L2('Agenda', 'Calendar')}</span></a>`);
    items.push(`<a class="qa-i" href="#" data-vc="share"><span class="qa-ic">${ic('share')}</span><span class="qa-l">${L2('Partager', 'Share')}</span></a>`);
    return `<nav class="qa" style="--qn:${items.length}">${items.join('')}</nav>`;
  };
  V.primaryX = (m) => {
    if (!m.sec.event) return null;
    const D = (blockOf(m, 'event') || {}).b, R = blockOf(m, 'rsvp'), mp = mapsUrl(D);
    const second = mp ? `<a class="btn-ic" href="${mp}" target="_blank" rel="noopener" aria-label="${L2('Itinéraire', 'Directions')}">${ic('pin')}</a>` : '';
    if (R) return { l: L2('Répondre à l’invitation', 'RSVP now'), i: 'send', attrs: `href="#" data-vc="scroll" data-to="${R.def.key}"`, second };
    return { l: L2('Partager', 'Share'), i: 'share', attrs: 'href="#" data-vc="share"', second };
  };
  /* Mention en bas des invitations : réglable dans l’admin (Marque NexTap), masquée pour certains forfaits */
  const cfg = (k, d) => (NFC.cfg ? NFC.cfg.get(k, d) : d);
  const foot = () => (cfg('brand.hideFoot', []).includes(cfg('planSim', 'premium')) ? '' : `<p class="ft-c">${esc(cfg('brand.footEvents', '') || L2('Invitation créée avec NexTap', 'Invitation made with NexTap'))}</p>`);
  V.footerX = (m) => (m.sec.event ? `<footer class="ft ev-ft"><div class="ft-btns"><a class="btn ghost" href="#" data-vc="share">${ic('share', 18)}<span>${L2('Partager', 'Share')}</span></a>${calUrl(m, (blockOf(m, 'event') || {}).b || {}) ? `<a class="btn ghost" href="${calUrl(m, blockOf(m, 'event').b)}" target="_blank" rel="noopener">${ic('cal', 18)}<span>${L2('Ajouter à l’agenda', 'Add to calendar')}</span></a>` : ''}</div>${foot()}</footer>` : null);

  /* ---------- Sections propres aux événements ---------- */
  V.S.envelope = () => '';
  V.S.event = (def, b) => {
    const rows = [];
    if (b.date) rows.push(`<div class="ev-r">${ic('cal', 18)}<div><b>${esc(dateTxt(b))}</b></div></div>`);
    if (b.place || b.address) rows.push(`<div class="ev-r">${ic('pin', 18)}<div><b>${esc(b.place || '')}</b>${b.address ? `<span>${esc(b.address)}</span>` : ''}${mapsUrl(b) ? `<a href="${mapsUrl(b)}" target="_blank" rel="noopener">${L2('Itinéraire', 'Get directions')} →</a>` : ''}</div></div>`);
    if (b.dress) rows.push(`<div class="ev-r">${SVG.dress}<div><b>${L2('Code vestimentaire', 'Dress code')}</b><span>${esc(b.dress)}</span></div></div>`);
    if (b.note) rows.push(`<div class="ev-r">${ic('star', 18)}<div><span>${esc(b.note)}</span></div></div>`);
    return rows.length ? `<div class="ev-det">${rows.join('')}</div>` : '';
  };
  const cdVals = (iso) => {
    const ms = Math.max(0, new Date(iso) - Date.now());
    return [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];
  };
  V.S.countdown = (def, b, m) => {
    const D = (blockOf(m, 'event') || {}).b, d = when(D);
    if (!d || isNaN(d)) return '';
    const iso = d.toISOString(), v = cdVals(iso);
    const lab = en() ? ['days', 'hours', 'min', 'sec'] : ['jours', 'heures', 'min', 'sec'];
    return `<div class="ev-cd" data-cd="${iso}">${v.map((x, i) => `<div><b>${x}</b><span>${lab[i]}</span></div>`).join('')}</div>`;
  };
  V.S.rsvp = (def, b) => {
    const meals = String(b.meals || '').split(',').map((x) => x.trim()).filter(Boolean);
    const n = Math.max(1, Math.min(10, +b.guests || 1));
    return `<form class="ev-rsvp" novalidate>
      ${b.text ? `<p class="ev-rt">${esc(b.text)}</p>` : ''}${b.deadline ? `<p class="ev-dl">${L2('Réponse souhaitée avant le', 'Please reply by')} <b>${esc(b.deadline)}</b></p>` : ''}
      <label class="ev-f"><span>${L2('Votre nom', 'Your name')}</span><input name="nom" autocomplete="name" required></label>
      <div class="ev-yn"><label><input type="radio" name="yes" value="1"><span>${L2('Avec plaisir, je serai là', 'Joyfully accepts')}</span></label><label><input type="radio" name="yes" value="0"><span>${L2('Désolé, je ne pourrai pas', 'Regretfully declines')}</span></label></div>
      ${n > 1 ? `<label class="ev-f"><span>${L2('Nombre de personnes', 'Number of guests')}</span><select name="n">${Array.from({ length: n }, (_, i) => `<option>${i + 1}</option>`).join('')}</select></label>` : ''}
      ${meals.length ? `<label class="ev-f"><span>${L2('Choix du repas', 'Meal choice')}</span><select name="meal">${meals.map((x) => `<option>${esc(x)}</option>`).join('')}</select></label>` : ''}
      <label class="ev-f"><span>${L2('Un petit mot (facultatif)', 'A little note (optional)')}</span><textarea name="msg" rows="2"></textarea></label>
      <p class="ev-err" hidden>${L2('Indiquez votre nom et votre réponse.', 'Please enter your name and your answer.')}</p>
      <button type="button" class="btn" data-vc="ev-rsvp">${ic('send', 18)}<span>${L2('Envoyer ma réponse', 'Send my reply')}</span></button>
    </form>`;
  };
  V.S.music = (def, b) => (b.src ? `<div class="ev-mus"><button type="button" class="ev-play" data-vc="ev-music" aria-label="${L2('Lire la musique', 'Play music')}">${SVG.play}</button><div><b>${esc(b.title || L2('Musique', 'Music'))}</b><small>${L2('Musique de l’invitation', 'Invitation music')}</small></div>${SVG.note}<audio src="${esc(b.src)}" preload="none" loop></audio></div>` : '');

  /* ---------- Actions : RSVP, musique ---------- */
  function setPlaying(btn, on) { if (btn) { btn.innerHTML = on ? SVG.pause : SVG.play; btn.classList.toggle('on', on); } }
  const prev = V.onAct;
  V.onAct = (a, t, e, m) => {
    if (a === 'ev-music') {
      e.preventDefault();
      const box = t.closest('.ev-mus'), au = box && box.querySelector('audio');
      if (!au) return true;
      if (au.paused) au.play().then(() => setPlaying(t, true)).catch(() => {}); else { au.pause(); setPlaying(t, false); }
      return true;
    }
    if (a === 'ev-rsvp') {
      e.preventDefault();
      const f = t.closest('form'), fd = new FormData(f), err = f.querySelector('.ev-err');
      const nom = String(fd.get('nom') || '').trim(), yes = fd.get('yes');
      if (!nom || yes == null) { err.hidden = false; return true; }
      const rec = { date: new Date().toISOString(), ev: (m.card.identity || {}).name || '', nom, yes: yes === '1', n: +(fd.get('n') || 1), meal: fd.get('meal') || '', msg: String(fd.get('msg') || '').trim() };
      try { const L = JSON.parse(localStorage.getItem('nfc-rsvp') || '[]'); L.unshift(rec); localStorage.setItem('nfc-rsvp', JSON.stringify(L.slice(0, 500))); } catch (x) { /* rien */ }
      f.innerHTML = `<div class="ev-ok">${ic('check', 26)}<b>${rec.yes ? L2('Merci, à très bientôt !', 'Thank you, see you soon!') : L2('Merci pour votre réponse.', 'Thank you for letting us know.')}</b><span>${L2('Votre réponse a bien été transmise.', 'Your reply has been sent.')}</span></div>`;
      return true;
    }
    return prev ? prev(a, t, e, m) : false;
  };

  /* Compte à rebours : mise à jour chaque seconde */
  setInterval(() => {
    document.querySelectorAll('.ev-cd[data-cd]').forEach((el) => {
      const v = cdVals(el.dataset.cd);
      el.querySelectorAll('b').forEach((b, i) => { b.textContent = v[i]; });
    });
  }, 1000);

  /* ---------- Enveloppe plein écran : 4 modèles (ruban, sceau doré, sauge gaufrée, blanc gaufré) ---------- */
  const ENV_STYLES = ['ruban', 'or', 'sauge', 'blanc'];
  NFC.EV_ENVS = [['ruban', 'Ruban', 'Ribbon'], ['or', 'Sceau doré', 'Gold seal'], ['sauge', 'Sauge', 'Sage'], ['blanc', 'Blanc', 'White']];
  /* Couleurs du sceau : clair, base, foncé */
  const WAX = { or: ['#f6dc95', '#c9973c', '#7d5a1c'], sauge: ['#fbf1d9', '#dcc79c', '#9c8459'], blanc: ['#ffffff', '#eceae4', '#b4b0a6'] };
  /* Brin de feuillage (gravé dans le sceau et gaufré dans le papier) */
  function sprig(x, y, s, rot) {
    const leaf = (lx, ly, a) => `<path d="M0 0C${4 * s} ${-4.5 * s} ${11 * s} ${-4.5 * s} ${15 * s} 0C${11 * s} ${4.5 * s} ${4 * s} ${4.5 * s} 0 0Z" transform="translate(${lx} ${ly}) rotate(${a})"/>`;
    let p = `<path d="M0 ${30 * s}C${2 * s} ${10 * s} 0 ${-12 * s} ${-2 * s} ${-30 * s}" fill="none"/>`;
    for (let i = 0; i < 4; i++) { const yy = (20 - i * 14) * s; p += leaf(0, yy, -40 - i * 4) + leaf(0, yy - 5 * s, -140 + i * 4); }
    p += leaf(-2 * s, -30 * s, -95);
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${p}</g>`;
  }
  /* Motif gaufré : reflet clair en haut à gauche, ombre en bas à droite */
  const EMB = {};
  function emboss(style) {
    if (EMB[style]) return EMB[style];
    const art = sprig(40, 45, 1.1, -25) + sprig(112, 108, 0.9, 30) + sprig(118, 28, 0.6, 70) + sprig(30, 125, 0.65, -60)
      + [[78, 70], [140, 72], [8, 88], [75, 140]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-4" rx="2.4" ry="4" transform="rotate(${a})"/>`).join('')}</g>`).join('');
    const hi = style === 'sauge' ? 'rgba(255,255,255,.26)' : 'rgba(255,255,255,.95)', lo = style === 'sauge' ? 'rgba(40,50,30,.22)' : 'rgba(90,80,60,.13)';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><g fill="none" stroke-width="1.1" stroke-linejoin="round"><g stroke="${hi}" transform="translate(-.7 -.7)">${art}</g><g stroke="${lo}" transform="translate(.7 .7)">${art}</g></g></svg>`;
    return (EMB[style] = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  }
  /* Sceau de cire au bord irrégulier, initiales ou brin gravés */
  function waxSeal(style, txt) {
    const [li, ba, da] = WAX[style] || WAX.or, id = 'evw-' + style;
    const pts = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, r = 54 + Math.sin(i * 2.7) * 2.6 + Math.cos(i * 1.3) * 1.8; pts.push(`${(60 + Math.cos(a) * r).toFixed(1)} ${(60 + Math.sin(a) * r).toFixed(1)}`); }
    const t = String(txt || '').trim().slice(0, 4), fs = t.length > 2 ? 22 : t.length > 1 ? 28 : 34;
    const mark = t ? `<text x="60" y="${60 + fs * 0.35}" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="${fs}" font-weight="600">${esc(t)}</text>` : sprig(60, 62, 0.9, 0);
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="${id}" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="${li}"/><stop offset=".45" stop-color="${ba}"/><stop offset="1" stop-color="${da}"/></radialGradient>
      <radialGradient id="${id}i" cx="62%" cy="66%" r="70%"><stop offset="0" stop-color="${li}"/><stop offset=".5" stop-color="${ba}"/><stop offset="1" stop-color="${da}"/></radialGradient></defs>
      <path d="M${pts.join('L')}Z" fill="url(#${id})"/>
      <circle cx="60" cy="60" r="39" fill="url(#${id}i)"/>
      <circle cx="60" cy="60" r="39" fill="none" stroke="${da}" stroke-opacity=".55" stroke-width="2"/>
      <circle cx="59.3" cy="59.3" r="39" fill="none" stroke="${li}" stroke-opacity=".7" stroke-width=".9"/>
      <g fill="${da}" stroke="${da}" stroke-width="${t ? 0 : 1.6}" fill-opacity="${t ? 0.85 : 0}" opacity=".9">${mark}</g>
      <g fill="${li}" stroke="${li}" stroke-width="${t ? 0 : 0.8}" fill-opacity="${t ? 0.5 : 0}" opacity=".7" transform="translate(-.8 -.8)">${mark}</g></svg>`;
  }
  /* Nœud de ruban noir satiné */
  const BOW = `<svg viewBox="0 0 240 170" aria-hidden="true"><defs><linearGradient id="evbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".35" stop-color="#050505"/><stop offset=".6" stop-color="#2a2a2a"/><stop offset="1" stop-color="#000"/></linearGradient></defs>
    <g fill="none" stroke="url(#evbow)" stroke-linecap="round" stroke-linejoin="round">
      <path stroke-width="7" d="M120 62C95 20 48 8 44 34C40 58 86 66 120 62"/>
      <path stroke-width="7" d="M120 62C146 22 194 12 197 38C200 62 154 68 120 62"/>
      <path stroke-width="6.5" d="M116 66C104 92 86 118 62 160"/>
      <path stroke-width="6.5" d="M124 66C140 96 158 120 190 152"/>
    </g><ellipse cx="120" cy="63" rx="9" ry="8" fill="#0b0b0b"/><ellipse cx="117" cy="60" rx="3.5" ry="2.5" fill="#4a4a4a" opacity=".7"/></svg>`;
  NFC.evEnvHTML = (style, b, lang) => {
    const st = ENV_STYLES.includes(style) ? style : 'or';
    const emb = st === 'sauge' || st === 'blanc' ? ` style="--emb:${emboss(st).replace(/"/g, '&quot;')}"` : '';
    const fl = '<span class="ev-bk"></span>' + ['t', 'b', 'l', 'r'].map((k) => `<span class="ev-fl ev-fl-${k}"><i></i></span>`).join('');
    const mid = st === 'ruban' ? `<span class="ev-band"></span><span class="ev-bow">${BOW}</span>` : `<span class="ev-seal">${waxSeal(st, b && b.seal)}</span>`;
    return `<div class="ev-env st-${st}"${emb}><button type="button" class="ev-stage" aria-label="${lang ? 'Open the invitation' : 'Ouvrir l’invitation'}">${fl}${mid}
      ${b && b.text ? `<p class="ev-env-t">${esc(b.text)}</p>` : ''}<p class="ev-env-h">${lang ? 'Tap to open' : 'Touchez pour ouvrir'}</p></button></div>`;
  };

  /* ---------- Page publique : enveloppe plein écran, puis invitation (et musique) ---------- */
  NFC.evMount = (app, m) => {
    const E = blockOf(m, 'envelope');
    if (!E || m.thumb) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = NFC.evEnvHTML(E.b.style || (NFC.EV_ENV_OF || {})[m.sec.id] || 'or', E.b, m.lang === 'en');
    const ov = wrap.firstElementChild;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    ov.querySelector('.ev-stage').addEventListener('click', () => {
      if (ov.classList.contains('open')) return;
      ov.classList.add('open');
      /* La musique démarre au geste de l’invité (les navigateurs l’exigent) */
      const btn = app.querySelector('.ev-play'), au = btn && btn.parentElement.querySelector('audio');
      if (au) au.play().then(() => setPlaying(btn, true)).catch(() => {});
      setTimeout(() => { ov.classList.add('gone'); document.body.style.overflow = ''; }, 2100);
      setTimeout(() => ov.remove(), 2800);
    });
  };
  /* Photo d’exemple par modèle : tant que l’invitation garde la photo de démonstration */
  const R0 = V.render;
  V.render = (m) => {
    const F = m && m.sec && (NFC.EV_FACE || {})[m.sec.id], f = F && F[m.d || m.sec.rec];
    const id = (m && m.card && m.card.identity) || {}, demo = 'media/' + (m && m.sec && m.sec.id) + '-1.jpg';
    if (!f || (id.photo && id.photo !== demo)) return R0(m);
    const n = typeof f === 'object' ? f.n : f, src = 'media/' + m.sec.id + '-' + n + '.jpg';
    const ni = Object.assign({}, id, { photo: src, cover: !id.cover || id.cover === demo ? src : id.cover });
    let card = Object.assign({}, m.card, { identity: ni });
    /* Démo : nom, dates et texte de la personne de la photo, seulement s’ils sont encore ceux de la démo */
    const W = f.who && (NFC.EV_WHO || {})[f.who], d0 = m.sec.demo, d1 = m.sec.demoEn;
    const L = W && (id.name === d0.identity.name ? 'fr' : d1 && id.name === d1.identity.name ? 'en' : '');
    if (L) {
      const [t, sub, intro] = W[L], dd = L === 'fr' ? d0 : d1;
      ni.name = t; if (id.role === dd.identity.role) ni.role = sub;
      const b = card.blocks || {};
      if (b.intro && b.intro.text === dd.blocks.intro.text) card = Object.assign({}, card, { blocks: Object.assign({}, b, { intro: Object.assign({}, b.intro, { text: intro }) }) });
    }
    return R0(Object.assign({}, m, { card }));
  };
})();
