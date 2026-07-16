# Changelog

## 1.1.1 — 2026-07-16

### Fixed

- Removed horizontal page overflow on mobile and tablet viewports.
- Matched `g-5` row gutters to full-width container gutters on compact layouts.
- Replaced horizontal reveal movement with vertical movement below 992 px to prevent edge clipping.
- Strengthened root overflow containment with `overflow-x: clip` and a safe fallback.

## 1.1.0 — 2026-07-16

### Hersteld

- beschadigde extra `<a>`-tag in de header verwijderd;
- foutieve hero-classnamen gecorrigeerd;
- ongeldige CSS-selector en beschadigde `content`-declaratie hersteld;
- GSAP-testconfiguratie gerepareerd;
- showcase-breedte op de bedoelde 570 px ingesteld;
- intrinsieke beeldverhouding van 1535 × 1024 gecorrigeerd;
- Vite-productiebuild opnieuw werkend gemaakt.

### Verbeterd

- consistente lichte en donkere sectieachtergronden;
- scrolled header opnieuw leesbaar op lichte achtergrond;
- dropdown-hover-, focus- en toetsenbordgedrag;
- professionele inhoud zonder lorem-ipsumteksten;
- responsieve WebP-afbeeldingen en preload van de hoofdshowcase;
- contactformulier met maxlengths, honeypot, abort-time-out en servermelding;
- testimonialcarousel met expliciete pauze/hervatten;
- semantische slide- en FAQ-structuur;
- consistente voorbeeldcontactgegevens;
- dynamisch copyrightjaar.

### Toegevoegd

- FAQ-sectie met vijf vragen;
- `npm run validate:html` en `npm run quality`;
- uitgebreidere projectintegriteitscontrole;
- `docs/PRODUCTION.md`;
- `.editorconfig`;
- uitgebreidere smoke tests.

## 1.0.0

- eerste Bootstrap 5.3 startertheme.
