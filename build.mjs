// Generator static, fără dependențe: node build.mjs
// Citește content/<lang>.json și scrie site-ul în dist/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://rentski.ro';
const ROOT = new URL('.', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const LANGS = readdirSync(join(ROOT, 'content')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
const DEFAULT_LANG = 'ro';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s) => esc(s).replace(/\n/g, '<br>');

// ---------- pictograme (linie, culoare curentă) ----------
const svg = (body, size = 28, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ICONS = {
  train: '<rect x="4" y="4" width="16" height="13" rx="2"></rect><path d="M4 11h16M9 21l1.5-4M15 21l-1.5-4M8 14h.01M16 14h.01"></path>',
  home: '<path d="M3 21V9l9-6 9 6v12"></path><path d="M9 21v-7h6v7"></path>',
  taxi: '<path d="M5 17h14l-1.5-6h-11z"></path><path d="M7 11l2-4h6l2 4"></path><circle cx="7.5" cy="17.5" r="1.5"></circle><circle cx="16.5" cy="17.5" r="1.5"></circle><path d="M9 3h6"></path>',
  gondola: '<path d="M2 6l20 4"></path><path d="M12 8v4"></path><rect x="7" y="12" width="10" height="9" rx="2"></rect><path d="M7 16h10"></path>',
  skier: '<circle cx="15" cy="4" r="2"></circle><path d="M14 7l-4 5 4 3v5"></path><path d="M10 12l-4 2"></path><path d="M14 8l4 2 3-1"></path><path d="M20 9v10"></path><path d="M3 20h17q2 0 2-2"></path>',
  boarder: '<circle cx="9" cy="4" r="2"></circle><path d="M10 7l3 4-3 3 1 4"></path><path d="M13 11l4-2"></path><path d="M10 14l-5 1"></path><path d="M3 18q1 3 5 3l10-2q3-1 3-4"></path>',
  sled: '<path d="M4 11h13q3 0 3-3"></path><path d="M7 11v5M12 11v5M17 11v5"></path><path d="M2 17q0 3 3 3h13q3 0 3-3"></path><path d="M5 20l-1 2M19 20l1 2"></path>',
  helmet: '<path d="M4 13a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"></path><path d="M4 12h16"></path><path d="M9 17v2M15 17v2"></path><path d="M12 5v3"></path>',
  goggles: '<path d="M3 10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3.5L12 14l-2.5 2H6a3 3 0 0 1-3-3z"></path><path d="M3 11H1M21 11h2"></path><path d="M6 10h4"></path>',
  cabin: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M5 9h14"></path><path d="M12 9v12"></path>',
  bag: '<rect x="3" y="8" width="18" height="12" rx="2"></rect><path d="M8 8V6a4 4 0 0 1 8 0v2"></path>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M7 15h4"></path>',
  weather: '<path d="M8 19a5 5 0 0 1-1-9.9A6 6 0 0 1 18.6 10 4 4 0 0 1 18 19z"></path><path d="M8 22l1-2M12 22l1-2M16 22l1-2"></path>',
  school: '<circle cx="7" cy="4.5" r="1.6"></circle><path d="M7 6.5l1.5 5-2.5 3.5"></path><path d="M8.5 11.5l3 1.5"></path><path d="M3 18.5l9-2"></path><circle cx="17" cy="3.5" r="1.6"></circle><path d="M17 5.5l1 5-2 3.5"></path><path d="M18 10.5l3.5 1"></path><path d="M13 20.5l9-2"></path>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path><path d="M9 15l2 2 4-4"></path>',
  voucher: '<path d="M3 11l19-9-9 19-2-8z"></path>',
  no: '<circle cx="12" cy="12" r="9"></circle><path d="M5.6 5.6l12.8 12.8"></path>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"></path><circle cx="12" cy="9" r="2.5"></circle>',
  wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z"></path>',
  bag2: '<path d="M3 11h18v10H3z"></path><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><path d="M12 15v3"></path>',
  check: '<path d="M5 12l5 5L20 7"></path>',
  arrowR: '<path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path>',
  arrowD: '<path d="M12 4v15"></path><path d="M6 13l6 6 6-6"></path>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>'
};
const icon = (name, size = 28, sw = 2) => svg(ICONS[name], size, sw);
const serviceIcons = (name) => name === 'skier' ? icon('skier', 32) + icon('boarder', 32) : name === 'helmet' ? icon('helmet', 32) + icon('goggles', 32) : icon(name, 28);

// ---------- adrese ----------
const langPrefix = (lang) => lang === DEFAULT_LANG ? '' : `/${lang}`;
const url = (lang, slug = '') => {
  if (slug.startsWith('#')) return `${langPrefix(lang)}/${slug}`;
  if (slug.startsWith('/')) return `${langPrefix(lang)}${slug}`;
  return slug ? `${langPrefix(lang)}/${slug}/` : `${langPrefix(lang)}/`;
};
const wa = (number, text) => `https://wa.me/${number}${text ? '?text=' + encodeURIComponent(text) : ''}`;
const LANG_NAMES = { ro: 'RO', en: 'EN', he: 'עב' };

function resolveHref(c, lang, href) {
  if (href.startsWith('google:')) return c.google[href.slice(7)].url;
  if (href.startsWith('link:')) return c.links[href.slice(5)];
  if (href.startsWith('/')) return url(lang, href);
  return href;
}
function button(c, lang, key, cls) {
  const u = c.ui;
  const map = {
    reserve: { href: url(lang, '#rezervare'), label: u.reserve, cls: 'btn-primary' },
    reserveSled: { href: url(lang, '#rezervare'), label: u.reserveSled, cls: 'btn-primary' },
    whatsapp: { href: wa(c.phones.rental.wa), label: u.whatsapp, cls: 'btn-outline', wa: true },
    whatsappSchool: { href: wa(c.phones.school.wa), label: u.whatsappSchool, cls: 'btn-outline', wa: true },
    whatsappSchoolNumber: { href: wa(c.phones.school.wa), label: `${c.phones.school.display} WhatsApp`, cls: 'btn-light', wa: true },
    whatsappWeather: { href: wa(c.phones.rental.wa, c.weatherMessage), label: u.whatsapp, cls: 'btn-outline', wa: true },
    passShop: { href: c.links.passShop, label: c.pages['cartela-ski-sinaia'].stat.link, cls: 'btn-primary', ext: true }
  };
  const b = map[key];
  const ext = b.wa || b.ext ? ' target="_blank" rel="noopener"' : '';
  return `<a class="btn ${cls || b.cls}" href="${b.href}"${ext}>${b.wa ? icon('wa', 20) : ''}${esc(b.label)}</a>`;
}

// ---------- fragmente comune ----------
function head(c, lang, { title, description, path, jsonld }) {
  const canonical = SITE + path;
  const alternates = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${SITE}${path.replace(langPrefix(lang) || '/', langPrefix(l) || '/').replace('//', '/')}">`).join('\n');
  return `<!doctype html>
<html lang="${lang}" dir="${c.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE}${path.replace(langPrefix(lang) || '/', '/').replace('//', '/')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(c.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${c.locale}">
<meta name="theme-color" content="#0E1E33">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/css/site.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">${esc(c.ui.skipToContent)}</a>`;
}

function header(c, lang, current) {
  const nav = c.nav.map(n => `<a href="${url(lang, n.slug)}"${n.slug === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n');
  const langs = LANGS.map(l => `<a href="${url(l, current && !current.startsWith('#') ? current : '')}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${LANG_NAMES[l] || l.toUpperCase()}</a>`).join('');
  return `<header class="site-header">
<div class="wrap">
<a class="brand" href="${url(lang)}" aria-label="${esc(c.brand)}">
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect width="36" height="36" rx="8" fill="#1D5FD1"></rect><path d="M8 26 L17 10 L22 19 L25 15 L30 26 Z" fill="#FFFFFF"></path></svg>
<span>${nl2br(c.brandShort)}</span>
</a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="${esc(c.ui.menu)}">${icon('menu', 24)}</button>
<nav class="nav" id="nav" aria-label="${esc(c.ui.menu)}">
${nav}
</nav>
<div class="lang" aria-label="${esc(c.ui.langLabel)}">${langs}</div>
</div>
</header>
<main id="main">`;
}

function footer(c, lang) {
  const nav = c.nav.filter(n => !n.slug.startsWith('#')).map(n => `<a href="${url(lang, n.slug)}">${esc(n.label)}</a>`).join('\n') + `\n<a href="${url(lang, '#contact')}">Contact</a>`;
  return `</main>
<div class="mobile-bar" aria-label="${esc(c.ui.reserve)} / WhatsApp">
<a class="btn btn-primary" href="${url(lang, '#rezervare')}">${esc(c.ui.reserve)}</a>
<a class="btn btn-wa" href="${wa(c.phones.rental.wa)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('wa', 22)}</a>
</div>
<footer class="site-footer">
<div class="wrap">
<span>${esc(c.brand)}, ${esc(c.legal)}. ${esc(c.addressLine)}.</span>
<nav aria-label="Pagini">${nav}</nav>
<span class="note">${esc(c.ui.footerNote)}</span>
</div>
</footer>
<script src="/js/site.js" defer></script>
</body>
</html>`;
}

function faqBlock(c, items) {
  return `<section class="section faq bg-surface">
<div class="wrap">
<h2>${esc(c.ui.faq)}</h2>
<dl>
${items.map(f => `<div class="qa"><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('\n')}
</dl>
</div>
</section>`;
}

function reviewsBlock(c, lang, items, h2, who) {
  const list = who ? items.filter(r => r.who === who) : items;
  const gbp = (k) => {
    const g = c.google[k];
    return `<div class="gbp">
<div class="info"><span class="name">${esc(g.name)}</span><span class="score"><strong>${g.rating}</strong> / 5 Google, ${g.count} ${esc(c.ui.googleReview)}</span></div>
<div class="actions"><a class="btn btn-sm btn-line" href="${g.url}" target="_blank" rel="noopener">${esc(c.ui.allReviews)}</a><a class="btn btn-sm btn-primary" href="${g.review}" target="_blank" rel="noopener">${esc(c.ui.leaveReview)}</a></div>
</div>`;
  };
  return `<section class="section ${who ? '' : 'bg-surface'}" id="recenzii">
<div class="wrap">
<div class="section-head"><h2>${esc(h2)}</h2>${who ? '' : `<p class="lead">${esc(c.home.reviews.intro)}</p>`}</div>
${who ? '' : `<div class="gbp-grid">${gbp('rental')}${gbp('school')}</div>`}
<div class="reviews-grid">
${list.map(r => `<figure class="review"><span class="stars" aria-label="5/5">★★★★★</span><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join('\n')}
</div>
${who ? `<p style="margin-top:20px"><a class="btn btn-sm btn-line" href="${c.google[who].url}" target="_blank" rel="noopener">${esc(c.ui.allReviews)} (${c.google[who].count})</a></p>` : ''}
</div>
</section>`;
}

function pricingTable(c, p) {
  return `<div class="table-card">
<table>
<thead><tr><th>${esc(p.colItem)}</th><th>${esc(p.colContent)}</th><th class="price">${esc(c.ui.perDay)}</th></tr></thead>
<tbody>
${p.rows.map(r => `<tr><td class="item">${esc(r.item)}</td><td class="content">${esc(r.content)}</td><td class="price">${c.prices[r.key]}</td></tr>`).join('\n')}
</tbody>
</table>
<p class="table-note">${esc(p.guarantee)}</p>
<p class="table-note" style="padding-top:0">${esc(p.note)}</p>
</div>`;
}

function lessonTable(c) {
  const s = c.home.school;
  return `<div class="table-card">
<table>
<thead><tr><th>${esc(s.colLesson)}</th><th class="price">${esc(s.colPrice)}</th></tr></thead>
<tbody>
${s.rows.map(r => `<tr><td class="item">${esc(r.item)}</td><td class="price${r.soft ? ' soft' : ''}">${esc(r.price)}</td></tr>`).join('\n')}
</tbody>
</table>
<p class="table-note">${esc(s.note)}</p>
</div>`;
}

function mapBlock(c) {
  return `<div class="map"><iframe src="${c.links.mapEmbed}" title="Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a href="${c.links.mapOpen}" target="_blank" rel="noopener">${esc(c.ui.openMap)}</a></div>`;
}

function bookingForm(c, lang) {
  const b = c.home.booking, f = b.fields;
  const config = { prices: c.prices, message: b.message, fields: { day: f.day, days: f.days, shoe: f.shoe }, wa: c.phones.rental.wa };
  const sel = (name, label, opts) => `<div class="field"><label for="bk-${name}">${esc(label)}</label><select id="bk-${name}" name="${name}">${opts.map(o => `<option value="${o[0]}">${esc(o[1])}</option>`).join('')}</select></div>`;
  const inp = (name, label, type = 'text', extra = '') => `<div class="field"><label for="bk-${name}">${esc(label)}</label><input id="bk-${name}" name="${name}" type="${type}" ${extra}></div>`;
  return `<section class="section booking" id="rezervare">
<div class="wrap">
<div class="booking-copy">
<h2>${esc(b.h2)}</h2>
<p class="lead">${esc(b.text)}</p>
<p class="muted" style="font-size:14px">${esc(b.note)}</p>
</div>
<form class="form" id="booking-form" data-config='${esc(JSON.stringify(config))}' novalidate>
<div class="grid-2">
${inp('start', f.start, 'date')}
${inp('end', f.end, 'date')}
${sel('kind', f.kind, [['ski', f.ski], ['snowboard', f.snowboard]])}
${sel('level', f.level, [['beginner', f.beginner], ['intermediate', f.intermediate], ['advanced', f.advanced]])}
</div>
<div class="grid-4">
${inp('height', f.height, 'number', 'inputmode="numeric" min="80" max="230"')}
${inp('weight', f.weight, 'number', 'inputmode="numeric" min="10" max="200"')}
${inp('shoe', f.shoe, 'number', 'inputmode="numeric" min="20" max="52"')}
${inp('persons', f.persons, 'number', 'inputmode="numeric" min="1" max="30" value="1"')}
</div>
<div class="checks">
<label class="check"><input type="checkbox" name="helmet">${esc(f.helmet)}</label>
<label class="check"><input type="checkbox" name="goggles">${esc(f.goggles)}</label>
<label class="check">${esc(f.sleds)} <input type="number" name="sleds" inputmode="numeric" min="0" max="30" value="0" aria-label="${esc(f.sleds)}"></label>
</div>
<div class="grid-3">
${inp('name', f.name, 'text', 'autocomplete="name"')}
${inp('phone', f.phone, 'tel', 'autocomplete="tel"')}
${inp('email', f.email, 'email', 'autocomplete="email"')}
</div>
${inp('notes', f.notes, 'text', `placeholder="${esc(f.notesPlaceholder)}"`)}
<div class="total">
<div><div class="label">${esc(f.totalLabel)}, <span id="bk-days">1 ${esc(f.day)}</span></div><div class="sum" id="bk-total">${c.prices.full} lei</div></div>
<a class="btn btn-wa" id="bk-send" href="${wa(c.phones.rental.wa)}" target="_blank" rel="noopener">${icon('wa', 20)}${esc(f.submit)}</a>
</div>
</form>
</div>
</section>`;
}

// ---------- pagina principală ----------
function homePage(c, lang) {
  const h = c.home;
  const path = url(lang);
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: c.google.rental.name,
    description: h.description, url: SITE + path, telephone: c.phones.rental.display,
    address: { '@type': 'PostalAddress', streetAddress: 'Strada Octavian Goga 1', addressLocality: 'Sinaia', addressRegion: 'Prahova', postalCode: '106100', addressCountry: 'RO' },
    geo: { '@type': 'GeoCoordinates', latitude: 45.3526297, longitude: 25.5497807 },
    openingHours: 'Mo-Su 08:00-18:00', priceRange: 'RON 15-60',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: c.google.rental.rating.replace(',', '.'), reviewCount: c.google.rental.count },
    sameAs: [c.google.rental.url]
  };
  const steps = h.route.steps;
  const stepCard = (s, dark) => `<article class="card card-top${dark ? ' card-dark' : ''}"><div class="card-head">${icon(s.icon, 32)}<span class="time">${esc(s.time)}</span></div><h3>${esc(s.h3)}</h3><p>${esc(s.text)}</p></article>`;
  return head(c, lang, { title: h.title, description: h.description, path, jsonld }) + header(c, lang, '') + `
<section class="hero bg-surface" id="top">
<div class="wrap">
<div class="hero-copy">
<span class="eyebrow">${icon('pin', 18)}${esc(h.eyebrow)}</span>
<h1>${esc(h.h1)}</h1>
<p class="lead">${esc(h.lead)}</p>
<p class="price-line">${esc(h.priceLine)}</p>
<div class="btn-row">${button(c, lang, 'reserve')}${button(c, lang, 'whatsapp')}</div>
<p class="hero-small">${esc(h.hoursLine)}</p>
</div>
<aside class="panel" aria-label="${esc(h.panelTitle)}">
<div class="panel-head"><span>${esc(h.panelTitle)}</span><span class="dots" aria-hidden="true"><span style="background:#1D5FD1"></span><span style="background:#D7263D"></span><span style="background:#FFFFFF"></span></span></div>
${h.panel.map(r => `<div class="panel-row${r.strong ? ' strong' : ''}"><span class="t">${esc(r.t)}</span><span>${esc(r.text)}</span></div>`).join('\n')}
</aside>
</div>
</section>

<section class="section" id="drum">
<div class="wrap">
<div class="section-head"><h2>${esc(h.route.h2)}</h2><p class="lead">${esc(h.route.intro)}</p></div>
<div class="route-grid">
${stepCard(steps[0])}
<div class="arrow" aria-hidden="true">${icon('arrowR', 28, 2.5)}</div>
${stepCard(steps[1])}
<div class="arrow" aria-hidden="true">${icon('arrowR', 28, 2.5)}</div>
${stepCard(steps[2])}
<div class="arrow arrow-down" aria-hidden="true">${icon('arrowD', 28, 2.5)}</div>
</div>
<div class="route-full">${stepCard(steps[3], true)}</div>
<p class="disclaimer">${esc(h.route.disclaimer)}</p>
<div class="evening">${icon('bag2', 28)}<div><h3>${esc(h.route.eveningH3)}</h3><p>${esc(h.route.evening)}</p></div></div>
</div>
</section>

<section class="section bg-surface" id="servicii">
<div class="wrap">
<div class="section-head"><h2>${esc(h.services.h2)}</h2><p class="lead">${esc(h.services.intro)}</p></div>
<div class="services-grid">
${h.services.items.map(s => `<div class="service${s.highlight ? ' highlight' : ''}${s.muted ? ' muted-card' : ''}"><div class="icons">${serviceIcons(s.icon)}</div><h3>${esc(s.h3)}</h3><p>${esc(s.text)}</p></div>`).join('\n')}
</div>
</div>
</section>

<section class="section" id="preturi">
<div class="wrap split">
<div class="section-head" style="margin:0"><h2>${esc(h.pricing.h2)}</h2><p class="lead">${esc(h.pricing.intro)}</p></div>
${pricingTable(c, h.pricing)}
</div>
</section>

<section class="section school bg-dark" id="scoala">
<div class="wrap">
<div class="school-copy">
<span class="eyebrow eyebrow-dark">${icon('school', 40, 1.8)}${esc(h.school.eyebrow)}</span>
<h2>${esc(h.school.h2)}</h2>
<p class="lead">${esc(h.school.text)}</p>
<div class="why"><h3>${esc(h.school.whyH3)}</h3><p>${esc(h.school.why)}</p></div>
<div class="btn-row">${button(c, lang, 'whatsappSchool', 'btn-light')}<a class="btn btn-ghost-light" href="${url(lang, 'scoala-ski-sinaia')}">${esc(h.school.more)}</a></div>
</div>
${lessonTable(c)}
</div>
</section>

${reviewsBlock(c, lang, h.reviews.items, h.reviews.h2)}

${bookingForm(c, lang)}

<section class="section contact bg-surface" id="contact">
<div class="wrap">
<div class="contact-copy">
<h2>${esc(h.contact.h2)}</h2>
<p class="lead">${esc(h.contact.intro)}</p>
<div class="kv"><span class="k">${esc(h.contact.addressLabel)}</span><p class="v">${esc(h.contact.addressText)}</p></div>
<div class="kv"><span class="k">${esc(h.contact.hoursLabel)}</span><p class="v">${esc(h.contact.hoursText)}</p></div>
<div class="phones">
<a class="phone" href="${wa(c.phones.rental.wa)}" target="_blank" rel="noopener"><span class="who">${esc(c.phones.rental.who)}</span><span class="person">${esc(c.phones.rental.name)}</span><span class="num">${esc(c.phones.rental.display)}</span><span class="wa">${esc(c.ui.openWhatsapp)}</span></a>
<a class="phone" href="${wa(c.phones.school.wa)}" target="_blank" rel="noopener"><span class="who">${esc(c.phones.school.who)}</span><span class="person">${esc(c.phones.school.name)}</span><span class="num">${esc(c.phones.school.display)}</span><span class="wa">${esc(c.ui.openWhatsapp)}</span></a>
</div>
<div class="review-ask"><h3>${esc(h.contact.reviewH3)}</h3><p>${esc(h.contact.reviewAsk)}</p><div class="btn-row"><a class="btn btn-sm btn-primary" href="${c.google.rental.review}" target="_blank" rel="noopener">${esc(c.ui.reviewRental)}</a><a class="btn btn-sm btn-line" href="${c.google.school.review}" target="_blank" rel="noopener">${esc(c.ui.reviewSchool)}</a></div></div>
</div>
${mapBlock(c)}
</div>
</section>
` + footer(c, lang);
}

// ---------- pagini secundare ----------
function subPage(c, lang, slug) {
  const p = c.pages[slug];
  const path = url(lang, slug);
  const stars = p.stat.stars ? `<span class="stars" aria-label="5/5">★★★★★</span>` : '';
  const jsonld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const sections = p.sections.map(s => {
    switch (s.type) {
      case 'text': { const links = s.links || (s.link ? [s.link] : []); return `<section class="section"><div class="wrap"><div class="text-block"><h2>${esc(s.h2)}</h2><p>${esc(s.text)}</p>${links.length ? `<div class="btn-row">${links.map(l => `<a class="btn btn-sm btn-line" href="${resolveHref(c, lang, l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>` : ''}</div></div></section>`; }
      case 'steps': return `<section class="section bg-surface"><div class="wrap"><div class="section-head"><h2>${esc(s.h2)}</h2></div><ol class="steps">${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ol></div></section>`;
      case 'pricing': return `<section class="section" id="preturi"><div class="wrap split"><div class="section-head" style="margin:0"><h2>${esc(c.home.pricing.h2)}</h2><p class="lead">${esc(c.home.pricing.intro)}</p></div>${pricingTable(c, c.home.pricing)}</div></section>`;
      case 'twoCol': return `<section class="section"><div class="wrap two-col"><div class="box"><h2>${esc(s.left.h2)}</h2>${s.left.paras.map((t, i) => `<p${i === s.left.paras.length - 1 ? ' class="strong"' : ''}>${esc(t)}</p>`).join('')}</div><div class="list"><h2>${esc(s.right.h2)}</h2><ul class="checklist">${s.right.items.map(i => `<li>${icon('check', 22, 2.5)}<span>${esc(i)}</span></li>`).join('')}</ul></div></div></section>`;
      case 'lessonPricing': return `<section class="section bg-surface"><div class="wrap split"><div class="section-head" style="margin:0"><h2>${esc(s.h2)}</h2><p class="lead">${esc(s.intro)}</p></div>${lessonTable(c)}</div></section>`;
      case 'reviews': return reviewsBlock(c, lang, c.home.reviews.items, s.h2, s.who);
      case 'table': return `<section class="section"><div class="wrap"><div class="section-head"><h2>${esc(s.h2)}</h2></div><div class="table-card"><table class="plain-table"><thead><tr>${s.cols.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>`;
      case 'map': return `<section class="section bg-surface"><div class="wrap">${mapBlock(c)}</div></section>`;
      case 'today': return `<section class="section"><div class="wrap"><div class="today"><h2>${esc(c.today.h2)}</h2><p>${esc(c.today.text)}</p><span class="stamp">${esc(c.today.updated)}: —</span></div></div></section>`;
      default: return '';
    }
  }).join('\n');
  const band = p.ctaBand;
  return head(c, lang, { title: p.title, description: p.description, path, jsonld }) + header(c, lang, slug) + `
<section class="hero-sub bg-dark">
<div class="wrap">
<div class="hero-copy">
<nav class="crumbs" aria-label="${esc(c.ui.youAreHere)}"><a href="${url(lang)}">${esc(c.ui.home)}</a><span aria-hidden="true">/</span><span>${esc(p.crumb)}</span></nav>
<span class="eyebrow eyebrow-dark">${icon(p.icon, 40, 1.8)}${esc(p.eyebrow)}</span>
<h1>${esc(p.h1)}</h1>
<p class="lead">${esc(p.lead)}</p>
<div class="btn-row">${button(c, lang, p.cta.primary, p.cta.primary.startsWith('whatsapp') ? 'btn-light' : 'btn-primary')}${button(c, lang, p.cta.secondary, 'btn-ghost-light')}</div>
</div>
<aside class="stat"><span class="big">${esc(p.stat.big)}</span>${stars}<span class="small">${esc(p.stat.small)}</span><a href="${resolveHref(c, lang, p.stat.href)}"${p.stat.href.startsWith('#') || p.stat.href.startsWith('/') ? '' : ' target="_blank" rel="noopener"'}>${esc(p.stat.link)}</a></aside>
</div>
</section>
${sections}
${faqBlock(c, p.faq)}
<section class="cta-band bg-accent">
<div class="wrap">
<div><h2>${esc(band.h2)}</h2><p>${esc(band.text)}</p></div>
${button(c, lang, band.button, band.button.startsWith('whatsapp') ? 'btn-light' : 'btn-light')}
</div>
</section>
` + footer(c, lang);
}

// ---------- scriere ----------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'src/css'), join(DIST, 'css'), { recursive: true });
cpSync(join(ROOT, 'src/js'), join(DIST, 'js'), { recursive: true });
if (existsSync(join(ROOT, 'src/img'))) cpSync(join(ROOT, 'src/img'), join(DIST, 'img'), { recursive: true });
writeFileSync(join(DIST, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><rect width="36" height="36" rx="8" fill="#1D5FD1"/><path d="M8 26 L17 10 L22 19 L25 15 L30 26 Z" fill="#fff"/></svg>');

const urls = [];
for (const lang of LANGS) {
  const c = JSON.parse(readFileSync(join(ROOT, 'content', `${lang}.json`), 'utf8'));
  const write = (p, html) => {
    const dir = join(DIST, p); mkdirSync(dir, { recursive: true });
    if (process.env.PREVIEW) {
      // adrese relative, cu index.html explicit, pentru previzualizare pe un alt host
      const depth = p.split('/').filter(Boolean).length;
      const up = '../'.repeat(depth) || './';
      html = html.replace(/(href|src)="\/([^"#]*)(#[^"]*)?"/g, (m, attr, path, hash) => {
        if (/^(css|js|img)\//.test(path) || path === 'favicon.svg') return `${attr}="${up}${path}"`;
        const file = path === '' ? 'index.html' : (path.endsWith('/') ? path + 'index.html' : path);
        return `${attr}="${up}${file}${hash || ''}"`;
      });
    }
    writeFileSync(join(dir, 'index.html'), html); urls.push(SITE + p);
  };
  write(url(lang), homePage(c, lang));
  for (const slug of Object.keys(c.pages)) write(url(lang, slug), subPage(c, lang, slug));
}
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(DIST, '.htaccess'), `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\nRewriteCond %{HTTP_HOST} ^www\\. [NC]\nRewriteRule ^ https://rentski.ro%{REQUEST_URI} [L,R=301]\nErrorDocument 404 /index.html\n# vechile adrese WordPress\nRedirect 301 /ro/ /\nRedirect 301 /ro/prices/ /#preturi\nRedirect 301 /ro/about/ /\nRedirect 301 /ro/contact-us/ /#contact\nRedirect 301 /ro/sports-equipments/ /inchirieri-ski-snowboard-sinaia/\nRedirect 301 /en/ /\n<IfModule mod_expires.c>\nExpiresActive On\nExpiresByType text/css "access plus 7 days"\nExpiresByType application/javascript "access plus 7 days"\nExpiresByType image/svg+xml "access plus 30 days"\n</IfModule>\n`);
console.log(`Scris ${urls.length} pagini în dist/ (${LANGS.join(', ')}).`);
