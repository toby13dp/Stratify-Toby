# Customization guide

## 1. Merkfundament wijzigen

Open `assets/css/theme.css` en wijzig de variabelen in `:root`.

```css
:root {
  --st-primary: #0754d9;
  --st-primary-bright: #0a63ee;
  --st-heading: #2e3c54;
  --st-text: #73777c;
  --st-background-soft: #f7f9fe;
}
```

Gebruik voor een volledige recolor minstens een primaire kleur, een helderdere hovervariant en een zachte achtergrond die samen voldoende WCAG-contrast behouden.

## 2. Lettertypes wijzigen

1. Vervang de Google Fonts-link in `index.html`.
2. Pas `--st-font-body`, `--st-font-heading` en `--st-font-nav` aan.
3. Controleer daarna de headerbreedte, hero-regelafbreking en teamkaarthoogtes.

## 3. Navigatie en secties

Een primaire link moet verwijzen naar een bestaande sectie-id:

```html
<a class="nav-link" href="#services">Services</a>
<section id="services">…</section>
```

De actieve status wordt automatisch bepaald door `assets/js/theme.js`.

## 4. Portfolio-item toevoegen

Kopieer één `.portfolio-item` en geef deze exact één categorie:

```html
<div class="col-md-6 col-lg-4 portfolio-item" data-category="engineering">
  …
</div>
```

Voeg zo nodig een filterknop toe:

```html
<button type="button" data-filter="engineering" aria-pressed="false">Engineering</button>
```

De waarden van `data-filter` en `data-category` moeten exact overeenkomen.

## 5. Testimonial toevoegen

Kopieer een volledig element met `data-testimonial-slide` binnen `.testimonial-track`. De carousel berekent na laden en bij resizen automatisch het aantal pagina's. De centrale pauzeknop blijft beschikbaar voor bezoekers die automatische rotatie willen uitschakelen.

## 6. Contactendpoint

Voeg `data-endpoint` aan het formulier toe. Het endpoint moet JSON accepteren, server-side valideren en een 2xx-status teruggeven bij succes.

```html
<form data-contact-form data-endpoint="/api/contact" novalidate>
```

Aanbevolen backendcontroles:

- maximale lengtes per veld;
- valide e-mailnormalisatie;
- HTML en header-injection blokkeren;
- rate limiting per IP en fingerprint;
- honeypot of privacyvriendelijke spamdetectie;
- time-outs en beperkte retries naar de mailprovider;
- log geen volledige berichtinhoud tenzij dit noodzakelijk en toegestaan is;
- API-sleutels uitsluitend via server-side environment variables.

## 7. Externe beelden lokaal maken

1. Plaats eigen bestanden in `assets/img/`.
2. Vervang de externe `src` door een relatief pad.
3. Vul juiste intrinsieke `width` en `height` in.
4. Behoud `loading="lazy"` behalve bij het hero-beeld.
5. Schrijf concrete altteksten; gebruik `alt=""` alleen voor puur decoratieve beelden.

## 8. Productiecontrole

Voer voor deployment uit:

```bash
npm run quality
```

Controleer vervolgens minstens:

- 320, 375, 768, 1024, 1366 en 1920 px breedte;
- toetsenbordnavigatie en focusvolgorde;
- mobiel menu en beide dropdownniveaus;
- alle portfoliofilters;
- carousel op desktop en mobiel;
- formulierfouten, succes en echte endpointfouten;
- alle afbeeldingen en externe links;
- de geautomatiseerde DOM-smoketest via `npm test`;
- Lighthouse Performance, Accessibility, Best Practices en SEO;
- Firefox, Safari en een Android Chromium-browser.


## 9. GSAP-showcase aanpassen

De begin- en eindbreedte staat in `assets/js/theme.js` als `SMALL_WIDTH = 570`. Houd dezelfde waarde aan in de CSS-fallback van `.image-frame`.

De hoofdafbeelding gebruikt drie WebP-varianten:

- `assets/img/showcase-768.webp`;
- `assets/img/showcase-1200.webp`;
- `assets/img/showcase-1535.webp`.

Werk bij vervanging ook `src`, `srcset`, `width`, `height` en de fallbackverhouding in `assets/css/theme.css` bij. Voer daarna `npm run quality` uit.

## 10. FAQ aanpassen

Elke vraag is een Bootstrap accordion-item binnen `#faqAccordion`. Zorg dat iedere collapse-id uniek is en dat `data-bs-target` en `aria-controls` exact naar die id verwijzen.
