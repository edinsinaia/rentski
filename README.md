# rentski.ro - site-ul Centrului de închirieri Ski & Snowboard Sinaia

Site static, fără WordPress și fără bază de date. Textele stau în `content/`, designul în `src/`, iar `build.mjs` le combină în pagini HTML gata de urcat pe orice server (`dist/`).

## Cum e organizat

| Unde | Ce e |
| --- | --- |
| `content/ro.json` | Toate textele în română: prețuri, program, telefoane, pagini, întrebări frecvente |
| `content/en.json`, `content/he.json` | Aceleași texte în engleză și ebraică (se adaugă după aprobarea versiunii române) |
| `src/css/site.css` | Stilurile (culori, fonturi, așezare) |
| `src/js/site.js` | Meniul de pe telefon și formularul de rezervare (totalul + mesajul WhatsApp) |
| `build.mjs` | Scriptul care generează site-ul |
| `dist/` | Site-ul gata de publicat; se regenerează la fiecare `npm run build`, nu se editează de mână |

## Cum schimbi un preț sau un text

1. Deschizi `content/ro.json` și modifici valoarea. Prețurile sunt într-un singur loc, la `prices`:
   `"full": 60, "skis": 40, "boots": 40, "poles": 20, "helmet": 15, "goggles": 15, "sled": 40`.
   Formularul de rezervare și tarifarul citesc de aici, deci se schimbă peste tot deodată.
2. Rulezi `npm run build` (sau îi ceri lui Claude Code să o facă).
3. Urci conținutul folderului `dist/` pe server (vezi mai jos).

Același lucru pentru program, telefoane, întrebări frecvente și textul "Azi pe pârtie" din pagina Vremea.

## Cum vezi site-ul local

```
npm run preview
```
apoi deschizi http://localhost:8123 în browser.

## Cum publici pe Romarg (hosting plătit până pe 28 aug 2027)

1. Intri în cPanel din contul Romarg al hostingului (yeti.romarg.com → Gazduire → Acces cPanel).
2. File Manager → `public_html`.
3. Prima dată: muți tot conținutul vechi (WordPress) într-un folder `_vechi-wordpress`, ca backup. Nu îl ștergi.
4. Urci conținutul folderului `dist/` în `public_html` (inclusiv fișierul ascuns `.htaccess`, care face redirecturile de la vechile adrese WordPress către noile pagini).
5. Deschizi https://rentski.ro și verifici.

La o modificare ulterioară: refaci pasul 4 doar cu fișierele schimbate (de regulă `index.html` sau o pagină).

## Dacă mutăm site-ul în altă parte (ex. Vercel, din aug 2027)

Site-ul nu depinde de Romarg: `dist/` merge pe orice server. Pe Vercel: conectezi acest repo, build command `npm run build`, output directory `dist`, apoi în Romarg (contul cu domeniul) schimbi nameserverele către cele date de Vercel.

## Lucruri de ținut minte

- Domeniul rentski.ro e în alt cont Romarg decât hostingul, plătit până pe 2 oct 2028. Email de contact pe domeniu: eduardgfratila@gmail.com.
- DNS-ul e la Cloudflare, într-un cont al unui prieten; nu se atinge până nu mutăm hostingul.
- Textele marcate `[De completat de Edi ...]` în `content/ro.json` sunt locuri unde lipsesc încă informații; se văd și pe site până sunt completate.
- Prețurile pe componente (schiuri 40 / clăpari 40 / bețe 20) au fost spuse din memorie; de confirmat la centru înainte de publicare.
