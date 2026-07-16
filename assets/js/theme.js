(() => {
  'use strict';

  const documentElement = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const backToTop = document.querySelector('[data-back-to-top]');

  const initialiseImageShowcase = () => {
    const section = document.getElementById('image-section');
    const frame = document.getElementById('image-frame');
    const image = document.getElementById('animated-image');
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (!section || !frame || !image) return;

    const SMALL_WIDTH = 570;
    const SIDE_GUTTER = 16;
    let imageRatio = image.naturalHeight && image.naturalWidth
      ? image.naturalHeight / image.naturalWidth
      : Number(image.getAttribute('height')) / Number(image.getAttribute('width')) || 1;

    const syncAspectRatio = (width, height) => {
      if (!(width > 0 && height > 0)) return;
      imageRatio = height / width;
      const cssRatio = `${width} / ${height}`;
      section.style.setProperty('--showcase-aspect-ratio', cssRatio);
      frame.style.setProperty('--showcase-aspect-ratio', cssRatio);
    };

    syncAspectRatio(
      image.naturalWidth || Number(image.getAttribute('width')),
      image.naturalHeight || Number(image.getAttribute('height'))
    );

    if (reducedMotion.matches) return;

    if (!gsap || !ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger could not be loaded; the static showcase fallback is active.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const measurements = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;
      const smallWidth = Math.min(SMALL_WIDTH, Math.max(0, width - SIDE_GUTTER * 2));
      const smallHeight = smallWidth * imageRatio;

      return {
        width,
        height,
        smallWidth,
        smallHeight,
        centerX: (width - smallWidth) / 2,
        bottomY: height - smallHeight
      };
    };

    const state = { progress: 0 };
    const setWidth = gsap.quickSetter(frame, 'width', 'px');
    const setHeight = gsap.quickSetter(frame, 'height', 'px');
    const setX = gsap.quickSetter(frame, 'x', 'px');
    const setY = gsap.quickSetter(frame, 'y', 'px');

    const scrollMeasurements = (layout = measurements()) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.clientHeight;
      const start = Math.max(0, sectionTop - window.innerHeight);
      const fullscreenAt = Math.max(start, sectionTop);
      const smallAt = Math.max(
        fullscreenAt,
        sectionTop + sectionHeight - layout.smallHeight
      );
      const end = Math.max(smallAt, sectionTop + sectionHeight);
      const distance = Math.max(1, end - start);

      return {
        start,
        end,
        fullscreenProgress: gsap.utils.clamp(0, 1, (fullscreenAt - start) / distance),
        smallProgress: gsap.utils.clamp(0, 1, (smallAt - start) / distance)
      };
    };

    const render = (progress = state.progress) => {
      const m = measurements();
      const scroll = scrollMeasurements(m);
      const p = gsap.utils.clamp(0, 1, progress);
      let width;
      let x;
      let y;

      if (p <= scroll.fullscreenProgress && scroll.fullscreenProgress > 0) {
        const local = p / scroll.fullscreenProgress;
        width = gsap.utils.interpolate(m.smallWidth, m.width, local);
        x = gsap.utils.interpolate(m.centerX, 0, local);
        y = 0;
      } else if (p <= scroll.smallProgress) {
        const phaseDistance = Math.max(0.0001, scroll.smallProgress - scroll.fullscreenProgress);
        const local = gsap.utils.clamp(0, 1, (p - scroll.fullscreenProgress) / phaseDistance);
        width = gsap.utils.interpolate(m.width, m.smallWidth, local);
        x = gsap.utils.interpolate(0, m.centerX, local);
        y = gsap.utils.interpolate(0, m.bottomY, local);
      } else {
        width = m.smallWidth;
        x = m.centerX;
        y = m.bottomY;
      }

      const height = width * imageRatio;

      setWidth(width);
      setHeight(height);
      setX(x);
      setY(y);
    };

    const createTrigger = () => {
      const animation = gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: section,
          start: () => scrollMeasurements().start,
          end: () => scrollMeasurements().end,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            state.progress = self.progress;
            render(self.progress);
          }
        }
      });

      render(animation.scrollTrigger?.progress || 0);
      return animation;
    };

    let animation = null;

    const enableAnimation = () => {
      section.classList.add('is-animated');
      state.progress = 0;
      animation = createTrigger();

      return () => {
        animation?.kill?.();
        animation = null;
        state.progress = 0;
        section.classList.remove('is-animated');
        frame.style.removeProperty('width');
        frame.style.removeProperty('height');
        frame.style.removeProperty('transform');
      };
    };

    if (typeof gsap.matchMedia === 'function') {
      gsap.matchMedia().add('(min-width: 992px)', enableAnimation);
    } else if (window.matchMedia('(min-width: 992px)').matches) {
      enableAnimation();
    }

    if (image.complete && image.naturalWidth) {
      syncAspectRatio(image.naturalWidth, image.naturalHeight);
      if (animation) {
        render();
        ScrollTrigger.refresh();
      }
    } else {
      image.addEventListener('load', () => {
        syncAspectRatio(image.naturalWidth, image.naturalHeight);
        if (animation) ScrollTrigger.refresh();
      }, { once: true });

      image.addEventListener('error', () => {
        console.error('The animated showcase image could not be loaded:', image.currentSrc || image.src);
      }, { once: true });
    }
  };

  const debounce = (callback, wait = 150) => {
    let timeout;
    return (...args) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => callback(...args), wait);
    };
  };

  const updatePageChrome = () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle('is-scrolled', scrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  };

  updatePageChrome();
  initialiseImageShowcase();
  window.addEventListener('scroll', updatePageChrome, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });

  // Close the Bootstrap mobile navigation after choosing an in-page link.
  const navigation = document.getElementById('primaryNavigation');
  navigation?.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth >= 1200 || !navigation.classList.contains('show')) return;
      const instance = window.bootstrap?.Collapse.getOrCreateInstance(navigation, { toggle: false });
      instance?.hide();
    });
  });

  // Support the nested demo dropdown on touch and compact layouts.
  document.querySelectorAll('.dropdown-submenu > .dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const menu = toggle.nextElementSibling;
      if (!(menu instanceof HTMLElement)) return;

      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    toggle.addEventListener('keydown', (event) => {
      const menu = toggle.nextElementSibling;
      if (!(menu instanceof HTMLElement)) return;

      if (event.key === 'Escape' || event.key === 'ArrowLeft') {
        event.preventDefault();
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }

      if (event.key === 'ArrowRight' && !menu.classList.contains('show')) {
        event.preventDefault();
        menu.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
        menu.querySelector('a, button')?.focus();
      }
    });
  });

  document.querySelectorAll('.nav-item.dropdown').forEach((dropdown) => {
    dropdown.addEventListener('hidden.bs.dropdown', () => {
      dropdown.querySelectorAll('.dropdown-submenu > .dropdown-menu.show').forEach((menu) => menu.classList.remove('show'));
      dropdown.querySelectorAll('.dropdown-submenu > .dropdown-toggle').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
    });
  });

  // Scrollspy-like active navigation without depending on Bootstrap's body spy.
  const primaryLinks = [...document.querySelectorAll('#primaryNavigation .nav-link[href^="#"]')]
    .filter((link) => link.getAttribute('href') !== '#');
  const linkedSections = primaryLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && linkedSections.length) {
    const activateLink = (sectionId) => {
      primaryLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateLink(visible.target.id);
    }, {
      rootMargin: '-28% 0px -58% 0px',
      threshold: [0.01, 0.2, 0.5]
    });

    linkedSections.forEach((section) => sectionObserver.observe(section));
  }

  // Lightweight reveal system.
  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  revealElements.forEach((element) => {
    const delay = Number.parseInt(element.dataset.revealDelay || '0', 10);
    if (delay > 0) element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Count-up statistics once they become visible.
  const counters = [...document.querySelectorAll('[data-counter]')];

  const animateCounter = (element) => {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';

    const target = Number.parseInt(element.dataset.counter || '0', 10);
    if (reducedMotion.matches || !Number.isFinite(target)) {
      element.textContent = target.toLocaleString('en-US');
      return;
    }

    const start = performance.now();
    const duration = 1250;

    const frame = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (progress < 1) window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Accessible, animated portfolio filter.
  const filterRoot = document.querySelector('[data-portfolio-filter]');
  const portfolioItems = [...document.querySelectorAll('[data-portfolio-grid] .portfolio-item')];
  let filterRevision = 0;

  filterRoot?.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      filterRevision += 1;
      const revision = filterRevision;
      const selected = button.dataset.filter;

      filterRoot.querySelectorAll('[data-filter]').forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });

      portfolioItems.forEach((item) => {
        const matches = selected === 'all' || item.dataset.category === selected;

        if (matches) {
          item.hidden = false;
          window.requestAnimationFrame(() => item.classList.remove('is-filtering-out'));
          return;
        }

        item.classList.add('is-filtering-out');
        window.setTimeout(() => {
          if (revision === filterRevision && item.classList.contains('is-filtering-out')) item.hidden = true;
        }, 220);
      });

      const label = button.textContent.trim();
      filterRoot.dispatchEvent(new CustomEvent('stratify:portfolio-filter', { detail: { filter: selected, label } }));
    });
  });

  // Responsive two-up/one-up testimonial carousel.
  class TestimonialCarousel {
    constructor(root) {
      this.root = root;
      this.track = root.querySelector('.testimonial-track');
      this.slides = [...root.querySelectorAll('[data-testimonial-slide]')];
      this.previousButton = root.querySelector('[data-carousel-prev]');
      this.nextButton = root.querySelector('[data-carousel-next]');
      this.toggleButton = root.querySelector('[data-carousel-toggle]');
      this.dotsRoot = root.querySelector('[data-carousel-dots]');
      this.status = root.querySelector('[data-carousel-status]');
      this.index = 0;
      this.timer = null;
      this.pageCount = 1;
      this.userPaused = reducedMotion.matches;

      if (!this.track || !this.slides.length) return;

      this.previousButton?.addEventListener('click', () => this.goTo(this.index - 1, true));
      this.nextButton?.addEventListener('click', () => this.goTo(this.index + 1, true));
      this.toggleButton?.addEventListener('click', () => this.toggleAutoplay());

      this.root.addEventListener('mouseenter', () => this.stop());
      this.root.addEventListener('mouseleave', () => this.start());
      this.root.addEventListener('focusin', () => this.stop());
      this.root.addEventListener('focusout', (event) => {
        if (!this.root.contains(event.relatedTarget)) this.start();
      });

      this.root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') this.goTo(this.index - 1, true);
        if (event.key === 'ArrowRight') this.goTo(this.index + 1, true);
      });

      window.addEventListener('resize', debounce(() => this.refresh(), 120));
      document.addEventListener('visibilitychange', () => document.hidden ? this.stop() : this.start());

      this.refresh();
      this.updateToggleButton();
      this.start();
    }

    get perView() {
      return window.matchMedia('(max-width: 767.98px)').matches ? 1 : 2;
    }

    refresh() {
      this.pageCount = Math.max(1, this.slides.length - this.perView + 1);
      this.index = Math.min(this.index, this.pageCount - 1);
      this.slides.forEach((slide, slideIndex) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${slideIndex + 1} of ${this.slides.length}`);
      });
      this.renderDots();
      this.render(false);
    }

    renderDots() {
      if (!this.dotsRoot) return;
      this.dotsRoot.replaceChildren();

      for (let dotIndex = 0; dotIndex < this.pageCount; dotIndex += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Show testimonial page ${dotIndex + 1} of ${this.pageCount}`);
        button.addEventListener('click', () => this.goTo(dotIndex, true));
        this.dotsRoot.append(button);
      }
    }

    goTo(index, restart = false) {
      this.index = (index + this.pageCount) % this.pageCount;
      this.render(true);
      if (restart) {
        this.stop();
        this.start();
      }
    }

    render(announce = true) {
      const firstSlide = this.slides[0];
      if (!firstSlide) return;

      const gap = Number.parseFloat(window.getComputedStyle(this.track).columnGap || '0');
      const offset = this.index * (firstSlide.getBoundingClientRect().width + gap);
      this.track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      [...(this.dotsRoot?.children || [])].forEach((dot, dotIndex) => {
        const active = dotIndex === this.index;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });

      this.slides.forEach((slide, slideIndex) => {
        const visible = slideIndex >= this.index && slideIndex < this.index + this.perView;
        slide.setAttribute('aria-hidden', String(!visible));
      });

      if (announce && this.status) this.status.textContent = `Showing testimonial page ${this.index + 1} of ${this.pageCount}.`;
    }

    toggleAutoplay() {
      this.userPaused = !this.userPaused;
      if (this.userPaused) this.stop();
      else this.start();
      this.updateToggleButton();
    }

    updateToggleButton() {
      if (!this.toggleButton) return;
      const paused = this.userPaused || reducedMotion.matches;
      this.toggleButton.setAttribute('aria-pressed', String(paused));
      this.toggleButton.setAttribute('aria-label', paused
        ? 'Resume automatic testimonial rotation'
        : 'Pause automatic testimonial rotation');
      this.toggleButton.innerHTML = paused
        ? '<i class="bi bi-play-fill" aria-hidden="true"></i>'
        : '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
      this.toggleButton.disabled = this.pageCount < 2;
    }

    start() {
      if (reducedMotion.matches || this.userPaused || document.hidden || this.pageCount < 2 || this.timer) return;
      this.timer = window.setInterval(() => this.goTo(this.index + 1), 5500);
    }

    stop() {
      if (!this.timer) return;
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  document.querySelectorAll('[data-testimonial-carousel]').forEach((root) => new TestimonialCarousel(root));

  // Contact form: validates locally and optionally posts JSON to data-endpoint.
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        form.querySelector(':invalid')?.focus();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[data-form-status]');
      const honeypot = form.querySelector('[name="website"]');
      const endpoint = form.dataset.endpoint?.trim();
      const originalButton = button?.innerHTML;

      if (honeypot?.value) {
        form.reset();
        return;
      }

      if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span>Sending…</span>';
      }

      if (status) {
        status.className = 'form-status mt-3 is-loading';
        status.textContent = 'Validating and preparing your message…';
      }

      form.setAttribute('aria-busy', 'true');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);

      try {
        const payload = Object.fromEntries(
          [...new FormData(form).entries()].filter(([key]) => key !== 'website')
        );
        let responseMessage = '';

        if (endpoint) {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          const responseBody = await response.json().catch(() => null);
          if (!response.ok) throw new Error(responseBody?.message || `Request failed with status ${response.status}`);
          if (typeof responseBody?.message === 'string') responseMessage = responseBody.message;
        } else {
          await new Promise((resolve) => window.setTimeout(resolve, 650));
          console.info('Stratify demo form payload:', payload);
        }

        if (status) {
          status.className = 'form-status mt-3 is-success';
          status.textContent = endpoint
            ? (responseMessage || 'Your message was sent successfully. Thank you!')
            : 'Demo complete: validation succeeded. Add a data-endpoint value to send this form to your own backend.';
        }

        form.reset();
        form.classList.remove('was-validated');
      } catch (error) {
        console.error(error);
        if (status) {
          status.className = 'form-status mt-3 text-danger';
          status.textContent = error?.name === 'AbortError'
            ? 'The request timed out. Please try again or use the email address above.'
            : 'The message could not be sent. Please try again or use the email address above.';
        }
      } finally {
        window.clearTimeout(timeout);
        form.removeAttribute('aria-busy');
        if (button) {
          button.disabled = false;
          button.innerHTML = originalButton;
        }
      }
    });
  });

  // Load the privacy-enhanced YouTube player only when the modal is opened.
  const videoModal = document.getElementById('videoModal');
  const videoFrame = videoModal?.querySelector('[data-video-frame]');
  const videoPlaceholder = videoFrame?.innerHTML;

  videoModal?.addEventListener('shown.bs.modal', () => {
    if (!videoFrame || videoFrame.querySelector('iframe')) return;
    const iframe = document.createElement('iframe');
    iframe.src = videoFrame.dataset.videoSrc;
    iframe.title = 'Stratify introduction video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    videoFrame.replaceChildren(iframe);
  });

  videoModal?.addEventListener('hidden.bs.modal', () => {
    if (videoFrame) videoFrame.innerHTML = videoPlaceholder;
  });

  // Placeholder links are intentionally inert in the starter demo.
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  // Keep scroll padding in sync with the real header height.
  const syncHeaderHeight = () => {
    if (!header) return;
    documentElement.style.setProperty('--st-header-height', `${Math.round(header.getBoundingClientRect().height)}px`);
  };

  syncHeaderHeight();
  window.addEventListener('resize', debounce(syncHeaderHeight, 120));

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
