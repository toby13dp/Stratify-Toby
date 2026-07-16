# Stratify Bootstrap 5.3 theme

Stratify is een professionele, responsive one-page corporate starter voor strategie-, design- en technologieteams. De theme combineert Bootstrap 5.3, Bootstrap Icons, GSAP en ScrollTrigger met zelfstandig geschreven HTML, CSS en JavaScript.

**Live demo:** [toby13dp.github.io/Stratify-Toby](https://toby13dp.github.io/Stratify-Toby/)

**Repository:** [github.com/toby13dp/Stratify-Toby](https://github.com/toby13dp/Stratify-Toby)

Versie **1.1.1** herstelt de oorspronkelijke structurele fouten, professionaliseert de inhoud en interacties, optimaliseert de hoofdafbeelding en voegt uitgebreidere kwaliteitscontroles toe.

## Belangrijkste functies

- vaste responsive header met actieve sectienavigatie en geneste dropdown;
- toegankelijke mobiele navigatie met verbeterde toetsenbordbediening;
- gecentreerde hero met primaire CTA en privacyvriendelijke videomodal;
- GSAP-showcase in drie scrollfasen met een vaste begin- en eindbreedte van 570 px;
- correcte reduced-motionfallback zonder scrollanimatie;
- about-, services-, why-us-, portfolio-, team-, testimonials-, FAQ- en contactsecties;
- filterbaar portfolio met geanimeerde statuswissels;
- responsive testimonialcarousel met vorige/volgende, paginadots en pauze/hervatten;
- contactformulier met browservalidatie, honeypot, request-time-out en optioneel JSON-endpoint;
- dynamisch copyrightjaar, skip link, focus states, lazy loading en printregels;
- responsieve WebP-showcasebeelden van 768, 1200 en 1535 px;
- HTML-validatie, projectintegriteitscontrole, DOM-smoketest, GSAP-configuratietest en productiebuild.

## Vereisten

- Node.js 20.19 of nieuwer;
- npm 10 of nieuwer aanbevolen;
- een actuele Chromium-, Firefox- of Safari-browser.

## Installatie

```bash
npm install
npm run vendor
npm run dev
```

Vite toont standaard een lokaal adres zoals `http://localhost:5173`.

## Volledige kwaliteitscontrole

```bash
npm run quality
```

Deze opdracht voert achtereenvolgens uit:

1. project- en assetintegriteitscontrole;
2. semantische HTML-validatie;
3. DOM- en GSAP-tests;
4. geoptimaliseerde Vite-productiebuild.

## Productiebuild

```bash
npm run build
npm run preview
```

De publiceerbare bestanden verschijnen in `dist/`. De build gebruikt relatieve paden en kan daardoor op een domeinroot of in een submap worden geplaatst.

## GitHub Pages-deployment

De workflow in `.github/workflows/deploy-pages.yml` valideert en bouwt de website bij iedere push naar `main` en publiceert daarna uitsluitend de inhoud van `dist/` naar GitHub Pages.

De workflow kan ook handmatig worden gestart via **GitHub → Actions → Build and deploy GitHub Pages → Run workflow**.

Voor de eerste ingebruikname moet bij **Settings → Pages → Build and deployment → Source** de optie **GitHub Actions** geselecteerd zijn. Daarna verlopen nieuwe deployments automatisch.

## Projectstructuur

```text
stratify-bootstrap-theme/
├── index.html
├── package.json
├── vite.config.js
├── .github/
│   └── workflows/deploy-pages.yml
├── assets/
│   ├── css/theme.css
│   ├── img/
│   │   ├── favicon.svg
│   │   ├── showcase-768.webp
│   │   ├── showcase-1200.webp
│   │   └── showcase-1535.webp
│   ├── js/theme.js
│   └── vendor/
├── docs/
│   ├── CUSTOMIZATION.md
│   ├── PRODUCTION.md
│   └── REFERENCE_ANALYSIS.md
├── tools/
│   ├── check-project.mjs
│   ├── gsap-config-test.mjs
│   ├── smoke-test.mjs
│   └── sync-vendor.mjs
├── CHANGELOG.md
├── LICENSE
└── THIRD_PARTY.md
```

## Afbeeldingen

De hoofdshowcase is lokaal en geoptimaliseerd. De overige demonstratiebeelden verwijzen nog naar publieke externe voorbeeldbestanden. Vervang deze voor productie door eigen lokale WebP- of AVIF-bestanden om hotlinking, externe afhankelijkheden en licentie-onduidelijkheid te vermijden.

Alle afbeeldingen moeten een correcte intrinsieke `width` en `height` behouden. Gebruik `loading="lazy"` voor beelden buiten de eerste viewport en concrete altteksten voor inhoudelijke beelden.

## Contactformulier

Zonder `data-endpoint` werkt het formulier in demonstratiemodus. Voeg voor echte verzending een eigen server-side endpoint toe:

```html
<form data-contact-form data-endpoint="/api/contact" novalidate>
```

De client verstuurt JSON met deze velden:

```json
{
  "name": "...",
  "email": "...",
  "subject": "...",
  "message": "..."
}
```

Het endpoint mag bij succes optioneel JSON teruggeven:

```json
{
  "message": "Your message was sent successfully."
}
```

Valideer en ontsmet alle velden opnieuw op de server. Configureer rate limiting, spambeveiliging, veilige logging en mailprovidercredentials via server-side omgevingsvariabelen.

## Documentatie

- `docs/CUSTOMIZATION.md`: kleuren, fonts, content, portfolio, testimonials, FAQ en formulierconfiguratie.
- `docs/PRODUCTION.md`: deployment, securityheaders, caching, performance en browsercontrole.
- `docs/AUDIT_REPORT.md`: oorspronkelijke bevindingen, uitgevoerde correcties, verificatie en resterende productiepunten.
- `CHANGELOG.md`: overzicht van herstellingen en uitbreidingen per versie.

## Licentie

De zelfstandig geschreven themecode valt onder de MIT-licentie in `LICENSE`. Bootstrap, Bootstrap Icons en GSAP behouden hun eigen licenties. Zie `THIRD_PARTY.md` voor externe componenten en demonstratiebeelden.
