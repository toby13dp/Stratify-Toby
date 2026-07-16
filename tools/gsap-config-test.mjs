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
let tween;
const rendered = {};
const section = window.document.getElementById('image-section');
const image = window.document.getElementById('animated-image');

// Use a portrait 4:5 image so width and height cannot be confused.
image.setAttribute('width', '4');
image.setAttribute('height', '5');

Object.defineProperties(section, {
  clientWidth: { configurable: true, value: 1200 },
  clientHeight: { configurable: true, value: 1500 }
});
Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
section.getBoundingClientRect = () => ({ top: 600, right: 1200, bottom: 2100, left: 0, width: 1200, height: 1500 });

window.matchMedia = (query) => ({
  matches: query.includes('min-width: 992px'),
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return true; }
});
window.scrollTo = () => {};
window.bootstrap = { Collapse: { getOrCreateInstance: () => ({ hide() {} }) } };
window.ScrollTrigger = { refresh() {} };
window.gsap = {
  registerPlugin() {},
  matchMedia() {
    return {
      add(_query, callback) {
        callback();
        return this;
      }
    };
  },
  quickSetter: (_element, property) => (value) => { rendered[property] = value; },
  to(target, config) {
    tween = { target, config, scrollTrigger: { progress: 0 } };
    return tween;
  },
  utils: {
    clamp: (min, max, value) => Math.min(max, Math.max(min, value)),
    interpolate: (start, end, progress) => start + (end - start) * progress
  }
};

window.eval(script);

const trigger = tween.config.scrollTrigger;
assert.equal(trigger.start(), 0, 'An initially visible section should start zooming at scroll position 0.');
assert.equal(trigger.end(), 2100, 'The animation should end when the final small image bottom reaches the viewport top.');
assert.equal(trigger.pin, undefined, 'The dynamic-height section should scroll naturally without pinning.');
assert.equal(trigger.scrub, true, 'Image geometry should remain exactly coupled to the scroll position.');

tween.target.progress = 0;
tween.config.onUpdate();
assert.equal(rendered.width, 570, 'The initial image width should be 570px.');
assert.equal(rendered.y, 0, 'The initial image should align to the section top.');

// Full image top = viewport top: scroll equals the section document top (600).
tween.target.progress = 600 / 2100;
tween.config.onUpdate();
assert.equal(rendered.width, 1200, 'The image should be full width when its top reaches the viewport top.');
assert.equal(600 - 600 + rendered.y, 0, 'The full image top should align with the viewport top.');

// Phase two begins immediately after the full-image alignment point.
tween.target.progress = 1000 / 2100;
tween.config.onUpdate();
assert.ok(rendered.width < 1200, 'The image should start shrinking immediately after reaching full width.');
assert.ok(rendered.width > 570, 'The image should remain between its full and final widths during phase two.');

// Small image bottom = viewport top + its 712.5px height.
tween.target.progress = 1387.5 / 2100;
tween.config.onUpdate();
assert.equal(rendered.width, 570, 'The image should return to 570px at the requested image-bottom offset.');
assert.equal(rendered.height, 712.5, 'The 570px-wide portrait image should retain its automatic 4:5 height.');
assert.equal(rendered.y, 787.5, 'The final image should align to the section bottom.');
assert.equal(600 + rendered.y + rendered.height - 1387.5, rendered.height, 'The small image bottom should equal viewport top plus its rendered height.');

// Phase three holds 570px until the image bottom reaches the viewport top.
tween.target.progress = 1700 / 2100;
tween.config.onUpdate();
assert.equal(rendered.width, 570, 'The image should remain 570px wide throughout phase three.');
assert.equal(rendered.y, 787.5, 'The phase-three image should remain aligned to the section bottom.');

tween.target.progress = 1;
tween.config.onUpdate();
assert.equal(600 + rendered.y + rendered.height - 2100, 0, 'The final small image bottom should align with the viewport top.');

console.log('GSAP configuration test passed: image-top, small-height offset and image-bottom boundaries are correct.');
dom.window.close();
