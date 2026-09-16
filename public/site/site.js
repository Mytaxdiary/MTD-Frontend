/* ==========================================================================
   My Tax Diary — shared behaviour
   Loaded by every page. Each block checks for its own markup first, so the
   same file is safe on pages that do not use a given feature.
   ========================================================================== */
(function () {
  'use strict';

  var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp    = function (v) { return v < 0 ? 0 : (v > 1 ? 1 : v); };
  var easeOut  = function (t) { return 1 - Math.pow(1 - t, 3); };
  var hasIO    = 'IntersectionObserver' in window;
  var $        = function (s, c) { return (c || document).querySelector(s); };
  var $$       = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------- HEADER --- */
  var hdr = $('.site-header');
  if (hdr) {
    var onScrollHdr = function () {
      hdr.classList.toggle('stuck', window.scrollY > 8);
    };
    onScrollHdr();
    window.addEventListener('scroll', onScrollHdr, { passive: true });
  }

  var burger = $('.burger');
  var mobileMenu = $('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------- SCROLL REVEALS --- */
  var revealItems = $$('.reveal, .reveal-l, .reveal-r');
  if (reduced || !hasIO) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------- HOME: HERO --- */
  var heroScroll = $('#heroScroll');
  if (heroScroll) {
    var visual = $('#heroVisual');
    var copy   = $('#heroCopy');
    var cue    = $('#cue');
    var scribble = $('#scribble');
    var greet  = $('#greet');
    var floatBadge = $('.mock-float');
    var items  = $$('[data-anim]', copy);

    var HDR = 74;
    var desktop = function () {
      return window.matchMedia('(min-width:1041px)').matches && !reduced;
    };
    var shiftX = 0, openScale = 1, openShiftY = 0;
    var lastP = -1, ticking = false, heroDone = false;

    var measure = function () {
      if (!desktop()) {
        visual.style.transform = '';
        items.forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
        floatBadge.style.opacity = ''; floatBadge.style.transform = '';
        return;
      }
      var prev = visual.style.transform;
      visual.style.transform = 'none';
      var r = visual.getBoundingClientRect();

      /* Distance from the card's resting centre to the centre of the viewport */
      shiftX = (window.innerWidth / 2) - (r.left + r.width / 2);

      /* How wide the dashboard can open on entry. The floating HMRC badge is
         held back until the card settles, so only the card itself must fit
         the band between the header and the scroll cue. */
      var bandTop    = HDR + 20;
      var bandBottom = window.innerHeight - 88;
      var bandH      = bandBottom - bandTop;
      var bandCy     = (bandTop + bandBottom) / 2;
      var availW     = Math.min(window.innerWidth - 72, 1380);

      openScale = Math.min(availW / r.width, bandH / r.height, 2.1);
      if (!isFinite(openScale) || openScale < 1) openScale = 1;

      /* Scaling pivots on the card's own centre, so nudge it back onto the
         centre of that band once enlarged. */
      openShiftY = bandCy - ((r.top + r.bottom) / 2);

      visual.style.transform = prev;
      lastP = -1;
      render();
    };

    var render = function () {
      if (!desktop()) return;
      var total = heroScroll.offsetHeight - window.innerHeight;
      var p = total > 0 ? clamp(-heroScroll.getBoundingClientRect().top / total) : 1;
      if (Math.abs(p - lastP) < 0.0008) return;
      lastP = p;

      var e = easeOut(p), inv = 1 - e;

      /* Wide, centred and face-on at p=0 → right-hand column, resting size
         and tilted at p=1. */
      visual.style.transform =
        'translate3d(' + (shiftX * inv).toFixed(2) + 'px,' + (openShiftY * inv).toFixed(2) + 'px,0)' +
        ' scale(' + (1 + (openScale - 1) * inv).toFixed(4) + ')' +
        ' rotateY(' + (10 * e).toFixed(2) + 'deg)' +
        ' rotateX(' + (2.5 * e).toFixed(2) + 'deg)' +
        ' rotateZ(' + (-0.9 * e).toFixed(2) + 'deg)';

      /* Copy: staggered fade + slide in from the left */
      items.forEach(function (el, i) {
        var s = 0.30 + i * 0.065, en = s + 0.30;
        var t = easeOut(clamp((p - s) / (en - s)));
        el.style.opacity = t;
        el.style.transform = 'translate3d(' + ((t - 1) * 42).toFixed(2) + 'px,' + ((1 - t) * 14).toFixed(2) + 'px,0)';
      });

      /* The HMRC badge arrives once the dashboard is on its way to resting */
      var bt = easeOut(clamp((p - 0.52) / 0.34));
      floatBadge.style.opacity = bt;
      floatBadge.style.transform =
        'translate3d(' + ((1 - bt) * -18).toFixed(2) + 'px,' + ((1 - bt) * 16).toFixed(2) + 'px,0)' +
        ' scale(' + (0.9 + 0.1 * bt).toFixed(3) + ')';

      cue.style.opacity = clamp(1 - p * 4);

      if (p > 0.92 && !heroDone) { heroDone = true; scribble.classList.add('drawn'); }
      if (p < 0.85) heroDone = false;
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { render(); ticking = false; });
    };

    if (!reduced) {
      if (desktop()) {
        items.forEach(function (el) { el.style.opacity = 0; });
        floatBadge.style.opacity = 0;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', measure);
      window.addEventListener('load', measure);
      measure();
    } else {
      scribble.classList.add('drawn');
    }
  }

  /* --------------------------------------------------- HOME: STEPS --- */
  var steps = $('#steps');
  if (steps) {
    var spark = $('#spark');
    var sizeSpark = function () {
      if (spark) spark.style.setProperty('--run', (steps.offsetWidth * 0.75) + 'px');
    };
    sizeSpark();
    window.addEventListener('resize', sizeSpark);

    var lightSteps = function () {
      steps.classList.add('lit');
      $$('.step', steps).forEach(function (st, i) {
        setTimeout(function () { st.classList.add('on'); }, 200 + i * 420);
      });
    };

    if (!reduced && hasIO) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          sizeSpark();
          lightSteps();
          sio.disconnect();
        });
      }, { threshold: 0.3 });
      sio.observe(steps);
    } else {
      steps.classList.add('lit');
      $$('.step', steps).forEach(function (st) { st.classList.add('on'); });
    }
  }

  /* ------------------------------------------------------- COUNTERS --- */
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec    = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var sep    = el.getAttribute('data-sep') === '1';
    var dur    = 1500, start = null;

    var fmt = function (v) {
      var s = v.toFixed(dec);
      if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return s + suffix;
    };
    if (reduced) { el.textContent = fmt(target); return; }

    var tick = function (ts) {
      if (start === null) start = ts;
      var t = clamp((ts - start) / dur);
      el.textContent = fmt(target * easeOut(t));
      if (t < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!hasIO) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          runCount(en.target);
          var g = $('#greet');
          if (g && en.target.closest('.mock-main')) g.classList.add('waving');
          cio.unobserve(en.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------------- BENEFIT TICKS --- */
  var benefits = $$('.benefit');
  if (benefits.length) {
    if (!reduced && hasIO) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          bio.unobserve(en.target);
        });
      }, { threshold: 0.5 });
      benefits.forEach(function (el) { bio.observe(el); });
    } else {
      benefits.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ------------------------------------------ PRICING: TABLE ROWS --- */
  var cmp = $('table.cmp');
  if (cmp) {
    var rows = $$('tbody tr', cmp);
    if (reduced || !hasIO) {
      rows.forEach(function (r) { r.classList.add('in'); });
    } else {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          rows.forEach(function (r, i) {
            setTimeout(function () { r.classList.add('in'); }, i * 70);
          });
          tio.disconnect();
        });
      }, { threshold: 0.15 });
      tio.observe(cmp);
    }
  }

  /* --------------------------------------- PRICING: BILLING TOGGLE --- */
  var toggle = $('#billingToggle');
  if (toggle) {
    var setCycle = function (cycle) {
      $$('button', toggle).forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-cycle') === cycle);
        b.setAttribute('aria-pressed', b.getAttribute('data-cycle') === cycle ? 'true' : 'false');
      });
      $$('.plan').forEach(function (plan) {
        var amount = $('.amount', plan);
        var period = $('.period', plan);
        if (!amount) return;
        var next = plan.getAttribute('data-' + cycle);
        if (!next) return;
        plan.classList.add('swapping');
        setTimeout(function () {
          amount.textContent = '£' + next;
          if (period) period.textContent = cycle === 'annual' ? '/month, billed annually' : '/month, billed monthly';
          plan.classList.remove('swapping');
        }, reduced ? 0 : 180);
      });
    };
    $$('button', toggle).forEach(function (b) {
      b.addEventListener('click', function () { setCycle(b.getAttribute('data-cycle')); });
    });
  }

  /* ----------------------------------------------- FORM VALIDATION --- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };

  var showError = function (field, message) {
    field.classList.add('bad');
    var err = $('.err', field);
    if (err) err.textContent = message;
  };
  var clearError = function (field) { field.classList.remove('bad'); };

  $$('form[data-validate]').forEach(function (form) {
    var card = form.closest('.form-card, .auth-card');

    /* Clear a field's error as soon as the visitor starts fixing it */
    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        var f = input.closest('.field');
        if (f) clearError(f);
      });
    });

    form.addEventListener('submit', function (ev) {
      var firstBad = null;

      $$('.field', form).forEach(function (field) {
        var input = $('input, select, textarea', field);
        if (!input) return;
        clearError(field);

        var value    = (input.type === 'checkbox') ? (input.checked ? 'on' : '') : input.value.trim();
        var required = input.hasAttribute('required');
        var label    = (($('label', field) || {}).textContent || 'This field').replace('(optional)', '').trim();

        if (required && !value) {
          showError(field, input.type === 'checkbox' ? 'Please confirm you are not a robot.' : label + ' is required.');
          firstBad = firstBad || field;
          return;
        }
        if (value && input.type === 'email' && !emailOk(value)) {
          showError(field, 'Enter a valid email address, for example name@firm.co.uk.');
          firstBad = firstBad || field;
          return;
        }
        if (value && input.type === 'password' && input.hasAttribute('data-min')) {
          var min = parseInt(input.getAttribute('data-min'), 10);
          if (value.length < min) {
            showError(field, 'Use at least ' + min + ' characters.');
            firstBad = firstBad || field;
          }
        }
      });

      if (firstBad) {
        ev.preventDefault();
        var focusable = $('input, select, textarea', firstBad);
        if (focusable) focusable.focus();
        firstBad.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        return;
      }

      /* No endpoint wired up yet: show the success panel instead of posting.
         Delete this block once form.action points at a real endpoint. */
      if (form.getAttribute('action') === 'REPLACE_WITH_YOUR_ENDPOINT') {
        ev.preventDefault();
        if (card && $('.form-done', card)) {
          card.classList.add('sent');
          card.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        }
      }
    });
  });

  /* Contact form: keep a mailto fallback in step with what has been typed */
  var mailFallback = $('#mailFallback');
  var contactForm  = $('#contactForm');
  if (mailFallback && contactForm) {
    contactForm.addEventListener('input', function () {
      var name = ($('#c-name', contactForm) || {}).value || '';
      var firm = ($('#c-firm', contactForm) || {}).value || '';
      var msg  = ($('#c-message', contactForm) || {}).value || '';
      var body = 'Name: ' + name + '\nFirm: ' + firm + '\n\n' + msg;
      mailFallback.href = 'mailto:info@mytaxdiary.co.uk'
        + '?subject=' + encodeURIComponent('My Tax Diary enquiry')
        + '&body=' + encodeURIComponent(body);
    });
  }
})();
