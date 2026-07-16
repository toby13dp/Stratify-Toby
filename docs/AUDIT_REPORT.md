# Technical audit report

Auditdatum: 16 juli 2026  
Projectversie na herwerking: 1.1.1

## Samenvatting

De aangeleverde versie bevatte meerdere blokkerende structurele fouten. De eigen projectcheck meldde ten onrechte succes, terwijl de GSAP-test en Vite-productiebuild faalden. De theme is hersteld, inhoudelijk geprofessionaliseerd, technisch uitgebreid en voorzien van strengere regressiecontroles.

## Kritieke bevindingen in de aangeleverde versie

1. De header bevatte een beschadigde extra `<a>`-tag met een ongeldig `chreffid`-attribuut.
2. `assets/css/theme.css` bevatte een lege selector en de beschadigde declaratie `content: 100ppak:`.
3. `npm run build` faalde door ongeldige CSS.
4. `npm test` faalde doordat de GSAP-test geen `matchMedia`-ondersteuning simuleerde.
5. De code gebruikte een showcasebreedte van 1000 px terwijl de vereiste begin- en eindbreedte 570 px was.
6. De showcaseafbeelding was in HTML als 1024 × 1024 gedeclareerd terwijl het bestand 1535 × 1024 was.
7. De enige lokale contentafbeelding was een PNG van circa 3 MB zonder responsive varianten.
8. Lichte en donkere secties waren inconsistent benoemd en toegepast; de scrolled header en footer hadden onvoldoende contrast.
9. De pagina bevatte veel niet-professionele placeholdertekst.
10. De carousel roteerde automatisch zonder expliciete pauze/hervatten-bediening.
11. Het contactformulier had geen honeypot, request-time-out of maximale veldlengtes.
12. De oorspronkelijke projectcheck detecteerde beschadigde markup, kapotte lokale referenties en ontbrekende componenten niet.

## Uitgevoerde verbeteringen

### Structuur en styling

- beschadigde HTML en CSS volledig hersteld;
- hero- en sectieclassificatie gecorrigeerd;
- consistente lichte, donkere en footercontrasten ingevoerd;
- dropdown-hover- en focusstijlen hersteld;
- nieuwe FAQ-sectie met vijf toegankelijke accordion-items toegevoegd;
- alle resterende lorem-ipsum- en pseudo-Latijnse content vervangen door professionele voorbeeldcopy;
- voorbeeldcontactgegevens tussen contactsectie en footer gelijkgetrokken.

### Showcase en performance

- begin- en eindbreedte ingesteld op 570 px;
- intrinsieke beeldverhouding gecorrigeerd naar 1535 × 1024;
- PNG vervangen door WebP-varianten van 768, 1200 en 1535 px;
- grootste variant teruggebracht tot circa 445 KB;
- `srcset`, `sizes`, preload, `fetchpriority` en `decoding` toegevoegd;
- statische mobiele en reduced-motionfallback behouden.

### Interactie en toegankelijkheid

- geneste dropdown uitgebreid met Escape-, ArrowLeft- en ArrowRight-bediening;
- testimonialslides voorzien van semantische slide-informatie;
- expliciete pauze/hervatten-knop aan de carousel toegevoegd;
- automatische rotatie uitgeschakeld bij reduced motion;
- dynamisch copyrightjaar toegevoegd;
- bestaande focus-, skip-link- en statusmeldingstructuur behouden en aangevuld.

### Contactformulier

- veldlimieten toegevoegd;
- onzichtbare honeypot toegevoegd;
- request-time-out van 12 seconden via `AbortController` toegevoegd;
- `aria-busy` tijdens verzending toegevoegd;
- veilige JSON-responsemelding ondersteund;
- honeypotveld uitgesloten van de verzonden payload;
- demo- en endpointmodus behouden.

### Tooling en documentatie

- projectversie verhoogd naar 1.1.1;
- `html-validate` toegevoegd;
- `npm run quality` toegevoegd;
- projectcheck uitgebreid met DOM-parsing, lokale assetcontrole, interne linkcontrole, afbeeldingsmetadata, verdachte corruptiepatronen en componentvereisten;
- smoke tests uitgebreid voor FAQ, WebP-showcase en carouselpauzering;
- GSAP-configuratietest hersteld;
- `README.md`, customization-, production- en changelogdocumentatie uitgebreid;
- `.editorconfig` toegevoegd;
- Vite-waarschuwingen voor bewust klassieke scripts onderdrukt met `vite-ignore`.

### Correctie 1.1.1 — horizontale overflow

- horizontale overflow op mobiele en tabletviewports verwijderd;
- `g-5`-rijgoten op compacte schermen afgestemd op de containerpadding;
- horizontale reveal-animaties onder 992 px vervangen door verticale beweging;
- `html` en `body` voorzien van robuuste horizontale overflow-containment;
- layoutmetingen uitgevoerd op 320, 360, 375, 390, 412, 768, 1024 en 1440 px; op alle breedtes is `scrollWidth` gelijk aan de viewportbreedte.

## Verificatie

De volgende opdrachten slagen:

```bash
npm run check
npm run validate:html
npm test
npm run build
npm run quality
npm audit --audit-level=high
```

Resultaten:

- 17 vereiste kernbestanden gecontroleerd;
- 40 unieke HTML-id's gecontroleerd;
- interne sectielinks en lokale assets gecontroleerd;
- HTML-validatie zonder fouten;
- DOM-smoketest geslaagd;
- GSAP-fasegrenzen geslaagd;
- Vite-productiebuild geslaagd;
- npm-audit: 0 bekende kwetsbaarheden.

## Bekende productiepunten

- De about-, portfolio-, team- en testimonialbeelden zijn nog externe demonstratiebeelden. Vervang ze vóór echte publicatie door eigen lokale assets.
- Het contactformulier verzendt pas echt wanneer een veilig server-side endpoint via `data-endpoint` is ingesteld.
- Google Fonts en de YouTube privacy-enhanced embed zijn externe diensten; pas privacybeleid, consent en Content Security Policy aan de uiteindelijke implementatie aan.
- Voer vóór definitieve klantpublicatie een handmatige browser- en apparaattest uit met de uiteindelijke content, afbeeldingen, domeinconfiguratie en backend.
