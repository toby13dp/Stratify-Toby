import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const script = await readFile(resolve(root, 'assets/js/theme.js'), 'utf8');

const dom = new JSDOM(html, {
  url: 'https://stratify.example/',
  runScripts: 'outside-only',
  pretendToBeVisual: true
});

const { window } = dom;

window.matchMedia = (query) => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return true; }
});

window.scrollTo = () => {};
window.bootstrap = {
  Collapse: {
    getOrCreateInstance: () => ({ hide() {} })
  }
};

window.console.info = () => {};
window.eval(script);

assert.equal(window.document.querySelectorAll('[data-reveal].is-revealed').length, window.document.querySelectorAll('[data-reveal]').length, 'Reduced-motion mode should reveal all content immediately.');
assert.equal(window.document.querySelectorAll('[data-carousel-dots] button').length, 4, 'Desktop carousel should expose four possible two-up positions for five slides.');
assert.equal(window.document.querySelectorAll('#faqAccordion .accordion-item').length, 5, 'FAQ expansion should expose five complete questions.');
assert.match(window.document.getElementById('animated-image').getAttribute('src'), /showcase-1535\.webp$/, 'Showcase should use the optimized WebP asset.');
assert.ok(window.document.querySelector('[data-carousel-toggle]'), 'Carousel should expose a pause/resume control.');
assert.equal(window.document.querySelector('[data-counter="850"]').textContent, '850', 'Counters should resolve to their final values in reduced-motion mode.');
const carouselToggle = window.document.querySelector('[data-carousel-toggle]');
assert.equal(carouselToggle.getAttribute('aria-pressed'), 'true', 'Reduced-motion mode should keep automatic carousel rotation paused.');
assert.equal(window.document.getElementById('image-section').classList.contains('is-animated'), false, 'Reduced-motion mode should keep the showcase static and unpinned.');

const engineeringFilter = window.document.querySelector('[data-filter="engineering"]');
engineeringFilter.click();
await new Promise((resolve) => setTimeout(resolve, 260));

const visiblePortfolioItems = [...window.document.querySelectorAll('.portfolio-item')].filter((item) => !item.hidden);
assert.equal(visiblePortfolioItems.length, 2, 'Engineering filter should leave two cards visible.');
assert.ok(visiblePortfolioItems.every((item) => item.dataset.category === 'engineering'), 'Every visible card should match the active filter.');
assert.equal(engineeringFilter.getAttribute('aria-pressed'), 'true', 'Active filter should expose aria-pressed=true.');

const form = window.document.querySelector('[data-contact-form]');
form.querySelector('[name="name"]').value = 'Toby De Prins';
form.querySelector('[name="email"]').value = 'toby@example.com';
form.querySelector('[name="subject"]').value = 'Theme enquiry';
form.querySelector('[name="message"]').value = 'Please send more information about this starter theme.';
form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
await new Promise((resolve) => setTimeout(resolve, 750));

assert.match(form.querySelector('[data-form-status]').textContent, /Demo complete/i, 'Valid demo form should produce a clear non-transmitting success status.');
assert.equal(form.querySelector('[name="name"]').value, '', 'Successful demo submission should reset the form.');

console.log('DOM smoke test passed: reveals, counters, portfolio filtering, carousel setup and contact validation are operational.');

dom.window.close();
