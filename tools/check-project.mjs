import { access, readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'index.html',
  'assets/css/theme.css',
  'assets/js/theme.js',
  'assets/img/favicon.svg',
  'assets/img/showcase-768.webp',
  'assets/img/showcase-1200.webp',
  'assets/img/showcase-1535.webp',
  'assets/vendor/bootstrap/css/bootstrap.min.css',
  'assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  'assets/vendor/bootstrap-icons/font/bootstrap-icons.min.css',
  'assets/vendor/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
  'assets/vendor/gsap/gsap.min.js',
  'assets/vendor/gsap/ScrollTrigger.min.js',
  'docs/CUSTOMIZATION.md',
  'docs/PRODUCTION.md',
  'docs/AUDIT_REPORT.md',
  'README.md',
  'CHANGELOG.md'
];

const failures = [];
const warnings = [];

for (const file of required) {
  try {
    await access(resolve(root, file));
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'assets/css/theme.css'), 'utf8');
const script = await readFile(resolve(root, 'assets/js/theme.js'), 'utf8');
const dom = new JSDOM(html, { url: 'https://stratify.example/' });
const { document } = dom.window;

for (const [label, pattern] of [
  ['damaged chreffid attribute', /\bchreffid\b/i],
  ['invalid 100ppak token', /100ppak/i],
  ['corrupted hero class', /(?:afftintro|sm-section-light)/i],
  ['obsolete uploaded-image filename', /file_0{5,}/i],
  ['empty CSS selector', /,\s*\}/m]
]) {
  if (pattern.test(`${html}\n${css}`)) failures.push(`Detected ${label}.`);
}

try {
  // Syntax-only evaluation; the DOM smoke test covers runtime behaviour.
  new Function(script);
} catch (error) {
  failures.push(`JavaScript syntax error: ${error.message}`);
}

const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) failures.push(`Duplicate HTML ids: ${[...new Set(duplicates)].join(', ')}`);

for (const anchor of ['hero', 'image-section', 'about', 'services', 'why-us', 'portfolio', 'team', 'testimonials', 'faq', 'contact', 'footer']) {
  if (!document.getElementById(anchor)) failures.push(`Missing section anchor: #${anchor}`);
}

for (const link of document.querySelectorAll('a[href^="#"]')) {
  const href = link.getAttribute('href');
  if (!href || href === '#') continue;
  if (!document.querySelector(href)) failures.push(`Broken in-page link target: ${href}`);
}

for (const image of document.images) {
  if (!image.hasAttribute('alt')) failures.push(`Image without alt attribute: ${image.getAttribute('src') || '(unknown source)'}`);
  if (!image.hasAttribute('width') || !image.hasAttribute('height')) {
    failures.push(`Image without intrinsic width/height: ${image.getAttribute('src') || '(unknown source)'}`);
  }
}

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  if (!rel.has('noreferrer') && !rel.has('noopener')) {
    failures.push(`External target="_blank" link lacks noreferrer/noopener: ${link.getAttribute('href')}`);
  }
}

const localReferences = new Set();
const collectReference = (value) => {
  if (!value || /^(?:https?:|mailto:|tel:|data:|#)/i.test(value)) return;
  localReferences.add(value.split(/[?#]/, 1)[0].replace(/^\.\//, ''));
};

for (const element of document.querySelectorAll('[src], [href]')) {
  collectReference(element.getAttribute('src'));
  collectReference(element.getAttribute('href'));
}
for (const source of document.querySelectorAll('[srcset]')) {
  for (const candidate of source.getAttribute('srcset').split(',')) {
    collectReference(candidate.trim().split(/\s+/, 1)[0]);
  }
}

for (const file of localReferences) {
  if (!file || extname(file) === '') continue;
  try {
    await access(resolve(root, file));
  } catch {
    failures.push(`Broken local asset reference: ${file}`);
  }
}

const showcase = document.getElementById('animated-image');
if (!showcase) {
  failures.push('Animated showcase image is missing.');
} else {
  if (showcase.getAttribute('width') !== '1535' || showcase.getAttribute('height') !== '1024') {
    failures.push('Showcase image intrinsic dimensions must remain 1535 × 1024.');
  }
  if (!showcase.getAttribute('src')?.endsWith('.webp')) failures.push('Showcase image should use the optimized WebP source.');
}

try {
  const showcaseStats = await stat(resolve(root, 'assets/img/showcase-1535.webp'));
  if (showcaseStats.size > 600 * 1024) warnings.push(`showcase-1535.webp is ${Math.round(showcaseStats.size / 1024)} KB; target is under 600 KB.`);
} catch {
  // Already reported by required-file validation.
}

if (!document.querySelector('[data-carousel-toggle]')) failures.push('Testimonial carousel pause/resume control is missing.');
if (!document.querySelector('[data-contact-form] [name="website"]')) failures.push('Contact-form honeypot field is missing.');
if (!document.querySelectorAll('#faqAccordion .accordion-item').length) failures.push('FAQ accordion has no entries.');

// Compact-layout overflow safeguards. These assertions protect against the
// gutter and horizontal reveal regression fixed in version 1.1.1.
if (!/html\s*\{[\s\S]*?overflow-x:\s*clip;/m.test(css)) {
  failures.push('Root overflow containment with overflow-x: clip is missing.');
}
if (!/\.container-xl\s*>\s*\.row\.g-5\s*\{[\s\S]*?--bs-gutter-x:/m.test(css)) {
  failures.push('Responsive g-5 container gutter override is missing.');
}
if (!/@media\s*\(max-width:\s*991\.98px\)[\s\S]*?\[data-reveal="left"\][\s\S]*?translateY\(24px\)/m.test(css)) {
  failures.push('Compact horizontal reveal fallback is missing.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));
console.log(`Project check passed: ${required.length} required files, ${ids.length} unique ids, ${localReferences.size} local asset references, and all core components verified.`);
dom.window.close();
