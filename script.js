/* Parcel Evo — site interactions */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav: shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Quote form ---------- */
  const form = document.getElementById('quote-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.classList.remove('is-success', 'is-error');
    if (kind) status.classList.add(`is-${kind}`);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const formspreeId = form.dataset.formspreeId;
    const isConfigured = formspreeId && formspreeId !== 'REPLACE_WITH_FORMSPREE_ID';

    if (!isConfigured) {
      setStatus(
        "Quote form isn't connected yet — please call or email us directly using the contact details above. We'll get back to you the same day.",
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      return;
    }

    try {
      const data = new FormData(form);
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        setStatus(
          "Thanks — we've got your details. We'll come back to you with a quote shortly. For anything urgent, please call us directly.",
          'success'
        );
      } else {
        const body = await res.json().catch(() => ({}));
        const err =
          (body.errors && body.errors.map((x) => x.message).join(', ')) ||
          'Something went wrong. Please call or email us instead.';
        setStatus(err, 'error');
      }
    } catch (err) {
      setStatus(
        "Couldn't send the form — please check your connection and try again, or call us directly.",
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();
