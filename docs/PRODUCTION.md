# Production guide

## 1. Build en controle

Gebruik vóór elke release:

```bash
npm ci
npm run quality
```

Publiceer uitsluitend de inhoud van `dist/`.

## 2. Eigen beelden en content

Vervang alle externe `bootstrapmade.com`-beeld-URL's door eigen lokale bestanden. Gebruik bij voorkeur AVIF met WebP-fallback of uitsluitend WebP wanneer een eenvoudige integratie belangrijker is.

Aanbevolen richtwaarden:

- hero/showcase: maximaal ongeveer 500 KB voor de grootste variant;
- contentbeelden: doorgaans 120–300 KB;
- team- en testimonialportretten: doorgaans 40–120 KB;
- altijd correcte `width`, `height`, `alt`, `loading` en `decoding` instellen.

## 3. Contactendpoint

Het frontendformulier is geen beveiligingsgrens. De backend moet minstens:

- `Content-Type: application/json` afdwingen;
- naam, e-mail, onderwerp en bericht opnieuw valideren;
- onbekende velden weigeren of negeren;
- invoer normaliseren en header injection blokkeren;
- rate limiting en misbruikdetectie toepassen;
- een maximale requestgrootte instellen;
- secrets uitsluitend via environment variables laden;
- geen gevoelige inhoud onnodig loggen;
- duidelijke 2xx-, 4xx- en 5xx-responses teruggeven.

De frontend beëindigt een request na 12 seconden en toont een neutrale foutmelding.

## 4. Aanbevolen securityheaders

Configureer deze op de webserver of hostinglaag en stem de CSP af op de werkelijk gebruikte externe bronnen:

```text
Content-Security-Policy: default-src 'self'; img-src 'self' https://bootstrapmade.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; frame-src https://www.youtube-nocookie.com; connect-src 'self' https://jouw-api-domein.example; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
```

Verwijder `https://bootstrapmade.com` uit `img-src` nadat alle beelden lokaal staan. Vervang het voorbeeld-API-domein of verwijder het wanneer het formulier niet extern verstuurt.

## 5. Caching

Aanbevolen beleid:

- HTML: korte cache of `no-cache` met revalidatie;
- gehashte Vite-assets: `public, max-age=31536000, immutable`;
- niet-gehashte bronbestanden buiten `dist/`: niet rechtstreeks publiceren.

## 6. Toegankelijkheidscontrole

Test minstens:

- volledige bediening met Tab, Shift+Tab, Enter, Space en Escape;
- mobiel menu en geneste dropdown;
- testimonialcarousel inclusief pauzeknop;
- formulierfouten en statusmeldingen;
- `prefers-reduced-motion: reduce`;
- 200% browserzoom en 320 px viewportbreedte;
- contrast na elke merk- of kleurwijziging.

## 7. Browser- en apparaattest

Controleer actuele versies van:

- Chrome/Chromium op Windows en Android;
- Firefox op Windows of macOS;
- Safari op macOS en iOS;
- ten minste 320, 375, 768, 1024, 1366 en 1920 px breedte.

## 8. Deployment

De Vite-configuratie gebruikt `base: './'`. Daardoor blijven de assetpaden relatief. Upload de volledige inhoud van `dist/` zonder de interne mappenstructuur te wijzigen.
