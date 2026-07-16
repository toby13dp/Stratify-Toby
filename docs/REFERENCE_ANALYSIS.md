# Uitgebreide analyse van de Stratify-referentie

Analysemoment: 15 juli 2026  
Publieke referentie: `https://bootstrapmade.com/content/demo/Stratify/`  
Primaire desktopmeting: 1.363 × 936 px, device-pixel-ratio 1  
Gemeten documenthoogte: circa 9.393 px

## 1. Ontwerpkarakter

De site gebruikt een zakelijke, rustige en lichte visuele taal. De nadruk ligt niet op decoratieve effecten, maar op een duidelijke hiërarchie, royale witruimte, grote fotografie en herhaalbare kaartpatronen. Het accentblauw wordt zeer consequent toegepast voor acties, statusmarkeringen, iconen, categorielabels en dunne randaccenten.

De uitstraling wordt vooral bepaald door:

- een bijna witte koelgrijze sectieachtergrond naast helderwitte secties;
- donker leigrijze Montserrat-koppen;
- lichtere Roboto-bodytekst met ruime regelafstand;
- afgeronde hoeken van meestal 8–18 px;
- zeer subtiele borders en schaduwen;
- compacte, volledig afgeronde labels en knoppen;
- fotografie met neutrale, heldere kantoor- en studiokleuren;
- afzonderlijke blauwe panelen in services en contact voor ritme en contrast.

## 2. Geobserveerde designtokens

| Token | Referentiewaarde | Toepassing in starter |
|---|---:|---|
| Achtergrond | `#FFFFFF` | `--st-background` |
| Zachte achtergrond | circa `#F7F9FE` | `--st-background-soft` |
| Bodytekst | `#73777C` | `--st-text` |
| Koppen | `#2E3C54` | `--st-heading` |
| Accent | `#0754D9` | `--st-primary` |
| Witte surfaces | `#FFFFFF` | `--st-surface` |
| Sterren | warm amber, circa `#F7A819` | `--st-warning` |
| Bodyfont | Roboto | `--st-font-body` |
| Headingfont | Montserrat | `--st-font-heading` |
| Navigatiefont | Poppins | `--st-font-nav` |

De gemeten desktop-body gebruikt 16 px tekst met 24 px regelhoogte. Primaire hero-heading: 44 px, gewicht 700, regelhoogte 55 px. Logo: 30 px Montserrat, gewicht 400. Navigatie: 15 px Poppins. Sectietitels zijn bewust lichter dan de inhoudelijke headings, waardoor “About”, “Services” enzovoort als elegante hoofdstukmarkeringen werken.

## 3. Grid en horizontale maatvoering

Op de gemeten desktopviewport gebruikt de referentie een Bootstrap-container van 1.140 px, gecentreerd met circa 104 px buitenmarge en 12 px interne gutters. Dat sluit rechtstreeks aan op Bootstrap 5.3 `container-xl`.

Terugkerende verhoudingen:

- hero: `col-lg-5` beeld en `col-lg-7` inhoud;
- about: `col-lg-5` beeld en `col-lg-7` inhoud;
- services: twee kaarten per rij, elk `col-lg-6`;
- why-us-intro: `col-lg-5` inhoud en `col-lg-7` beeld;
- why-us-features: vier keer `col-lg-3`, op tablet twee per rij;
- portfolio: drie keer `col-lg-4`, tablet twee, mobiel één;
- team: twee keer `col-lg-6`;
- contactdetails: drie keer `col-md-4`;
- contactkaart: `col-lg-4` intro en `col-lg-8` formulier.

## 4. Verticale ritmes en secties

De site bevat acht hoofdsecties:

| Sectie | Gemeten start | Gemeten hoogte | Kernpatroon |
|---|---:|---:|---|
| Hero | 0 px | 794 px | 5/7 split, floating badge, CTA's, drie metrics |
| About | 794 px | 1.075 px | centrische titel, beeld/badge, tekst en drie tellers |
| Services | 1.869 px | 1.033 px | zachte achtergrond, 2 × 3 servicekaarten |
| Why Us | 2.902 px | 1.194 px | intro split, floating metrics, vier featurekaarten |
| Portfolio | 4.096 px | 1.719 px | filters, 3 × 2 projectkaarten, CTA-banner |
| Team | 5.816 px | 911 px | 2 × 2 horizontale teamkaarten |
| Testimonials | 6.726 px | 724 px | zachte achtergrond, twee kaarten, eigen controls |
| Contact | 7.450 px | 1.081 px | drie strips, grote tweedelige contactkaart |

Footer start rond 8.531 px en is ongeveer 792 px hoog. De hero gebruikt meer bovenruimte vanwege de overlappende vaste header. Reguliere secties gebruiken ongeveer 100 px boven- en onderruimte. Sectietitels reserveren circa 60 px onderruimte vóór de eigenlijke sectie-inhoud.

## 5. Header en navigatie

- vaste header van ongeveer 78 px hoog;
- transparant/zeer licht boven de hero, vervolgens helderwit met subtiele onderrand;
- logo links, navigatie rechts;
- actieve link wordt blauw en krijgt een kleine blauwe cirkel onder het begin van de tekst;
- desktopdropdown: circa 220 px breed, 20 px padding, sterke maar diffuse schaduw;
- dropdownlinks schuiven bij hover enkele pixels naar rechts en krijgen een korte blauwe lijn;
- mobiele navigatie activeert onder ongeveer 1.200 px;
- mobiele links worden groter, staan verticaal en krijgen dunne scheidingslijnen;
- geneste dropdowns worden op mobiel ingesprongen met een blauwe verticale markering.

## 6. Hero

De hero heeft een zachte koelgrijze achtergrond en een gemeten padding van ongeveer 140 px boven en 100 px onder.

### Beeldkolom

- vierkant beeld van circa 411 × 411 px;
- radius circa 18–20 px;
- floating blauwe groeibadge rechtsboven;
- badge bevat een cirkelicoon, klein label en opvallende `+62%` waarde;
- badge gebruikt een uitgesproken blauwe schaduw.

### Inhoudskolom

- klein afgerond uppercase label boven de heading;
- heading over drie regels op desktop;
- introductietekst maximaal circa 540 px breed, 16,8 px en ongeveer 1,8 regelafstand;
- primaire knop: vol blauw, capsulevorm, circa 49 px hoog;
- secundaire knop: transparant, 2 px blauwe rand, play-icoon;
- drie metriekkaarten van circa 190 × 86 px, 14 px radius en subtiele border.

## 7. About

De beeldcompositie gebruikt een portretfoto met een zachtblauw achtervlak dat linksboven uitsteekt. Onderaan overlapt een blauwe “Industry Leaders”-badge. De inhoud rechts heeft:

- een overline met korte blauwe lijn;
- inhoudelijke heading van circa 36 px en gewicht 700;
- een iets grotere introparagraaf;
- twee normale paragrafen;
- drie lichte tellerkaarten met een blauwe linkerrand;
- een minimalistische tekstlink met pijl en dunne onderlijn.

De starter telt de waarden op zodra de kaarten zichtbaar worden en respecteert `prefers-reduced-motion`.

## 8. Services

Elke kaart combineert een verticaal blauw icoonpaneel van ongeveer 114 px breed met een wit tekstdeel. De kaart is ongeveer 216 px hoog.

- nummer boven icoon;
- wit lijnicoon;
- heading van circa 19 px;
- compacte paragraaf met lichte tekst;
- grijze “Discover More”-link die blauw wordt bij hover;
- subtiele verticale lift en iets sterkere schaduw bij hover.

Op kleine telefoons wordt het blauwe paneel een horizontale balk van circa 88 px hoog boven de tekst.

## 9. Why Us

Het introblok combineert een tekstkolom met een breed beeld. Het woord “Strategic” is blauw en cursief, wat als enige uitgesproken typografische variatie dient. Het beeld heeft:

- een lichte hoekdecoratie;
- een witte `15+ Years Experience` badge bovenaan;
- een blauwe `98% Client Satisfaction` badge onderaan;
- een zachte, brede beeldschaduw.

Daaronder staan vier witte featurekaarten van circa 261 × 312 px. Elke kaart bevat een lichtblauwe icooncirkel, een subtiel groot volgnummer, heading en tekst. Hover activeert de blauwe onderrand.

## 10. Portfolio

De filterbalk staat centraal en eindigt met een dunne horizontale lijn. De actieve filter is volledig blauw; inactieve filters zijn bijna witgrijs.

Projectkaarten:

- 3 kolommen op desktop;
- beeldhoogte circa 240 px;
- categoriebadge linksboven;
- hoveroverlay met twee ronde actieknoppen;
- cliënt en jaar als kleine metadata;
- compacte heading en beschrijving;
- tags in zeer lichtblauwe pills;
- border en radius van circa 12 px.

De starter implementeert filtering zonder Isotope-dependency. Verborgen kaarten krijgen eerst een korte fade/scale-transitie en worden daarna met het HTML `hidden`-attribuut verwijderd uit de layout en toegankelijkheidsboom.

## 11. Team

Elke teamkaart is horizontaal: ongeveer 42% foto en 58% tekst. Op desktop is de kaart circa 546 × 282 px. Het functielabel is een lichte blauwe capsule. Sociale iconen verschijnen via een gradientoverlay op hover/focus. Op telefoon stapelt de foto boven de tekst en blijven de sociale knoppen zichtbaar, zodat touchgebruikers geen informatie missen.

## 12. Testimonials

De referentie toont twee kaarten naast elkaar en gebruikt:

- een blauwe linkerrand;
- witte kaart op zachte sectieachtergrond;
- vijf amberkleurige sterren;
- groot lichtblauw quote-icoon;
- cursieve quote;
- avatar, naam en rol onder een scheidingslijn;
- vierkante pijlknoppen en lijnvormige paginatie.

De starter gebruikt een dependency-vrije carousel met toetsenbordpijlen, autoplay, pauze bij hover/focus, aria-status en één kaart per scherm onder 768 px.

## 13. Contact

Drie detailstrips gebruiken een blauwe linkerrand, licht icoonvlak en zeer compacte uppercase labels. De grote contactkaart heeft een blauwe linkerintro van circa een derde van de breedte en een wit formulierdeel van circa twee derde.

Formuliervelden zijn minimalistisch: zichtbare uppercase labels en alleen een onderrand. De actieknop is rechthoekiger dan de pill-CTA's. De starter voegt HTML5-validatie, foutfeedback, loading state, succes-/foutstatus en optionele JSON-endpointkoppeling toe.

## 14. Footer

De footer gebruikt dezelfde zachte achtergrond als hero, services en testimonials. Desktopopbouw:

- brede merk/contactkolom links;
- vier compacte navigatiekolommen rechts;
- tweede rij met nieuwsbriefintro links en sociallinks rechts;
- onderste rij met copyright links en juridische links rechts.

Alle scheidingen zijn uiterst dun en laag in contrast. Op mobiel wordt de merksectie gecentreerd, blijven navigatiekolommen links uitgelijnd en centreren socials en legal links.

## 15. Responsive gedrag

Geobserveerde hoofdgrenzen in de referentie:

- `max-width: 1199px`: mobiele navigatie en aangepaste scrollmargin;
- `max-width: 992px`: hero minder hoog, split-layouts stapelen, contactpanelen krijgen minder padding;
- `max-width: 768px`: sectietitels kleiner, portfoliofoto's lager, testimonialpadding compacter, footer gecentreerd;
- `max-width: 576px`: CTA's, hero metrics en portfolio-actions stapelen; service-icoonpaneel wordt horizontaal; contact- en footerpadding wordt compacter.

De starter gebruikt equivalente Bootstrap-intervallen (`xl`, `lg`, `md`, `sm`) en extra CSS alleen waar het referentiegedrag niet met utilities alleen kan worden gereproduceerd.

## 16. Interacties in de starter

- actieve navlink via `IntersectionObserver`;
- header- en back-to-topstatus via passieve scrolllistener;
- mobiele Bootstrap-collapse;
- geneste dropdownondersteuning voor touch;
- eenmalige revealanimaties;
- count-upstatistieken;
- portfoliofilter;
- responsive testimonialcarousel;
- deferred privacy-enhanced YouTube-embed;
- gevalideerde contactflow met optioneel endpoint;
- reduced-motion fallback en printmodus.

## 17. Clean-room-afbakening

De starter is opnieuw opgebouwd vanuit visuele observaties, gemeten layoutwaarden en publiek zichtbare inhoudspatronen. Er is geen originele commerciële templatebroncode in het pakket opgenomen. Externe voorbeeldfoto's worden slechts via hun publieke URL gerefereerd en moeten voor productie door eigen of correct gelicentieerde beelden worden vervangen.

