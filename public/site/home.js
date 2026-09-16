
(function(){
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); };
  var easeOut = function(t){ return 1 - Math.pow(1 - t, 3); };

  /* ---------- MOBILE NAVIGATION ---------- */
  var burger = document.querySelector('.burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu){
    burger.addEventListener('click', function(){
      var open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function(link){
      link.addEventListener('click', function(){
        mobileMenu.classList.remove('open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 1040){
        mobileMenu.classList.remove('open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---------- HEADER SHADOW ---------- */
  var hdr = document.getElementById('hdr');
  var onScrollHdr = function(){
    if (window.scrollY > 8) hdr.classList.add('stuck'); else hdr.classList.remove('stuck');
  };
  onScrollHdr();
  window.addEventListener('scroll', onScrollHdr, {passive:true});

  /* ---------- HERO: scroll-driven dashboard ---------- */
  var heroScroll = document.getElementById('heroScroll');
  var visual     = document.getElementById('heroVisual');
  var copy       = document.getElementById('heroCopy');
  var cue        = document.getElementById('cue');
  var scribble   = document.getElementById('scribble');
  var greet      = document.getElementById('greet');
  var items      = Array.prototype.slice.call(copy.querySelectorAll('[data-anim]'));
  var floatBadge = document.querySelector('.mock-float');

  var desktop = function(){ return window.matchMedia('(min-width:1041px)').matches && !reduced; };
  var HDR = 74;
  var shiftX = 0, openScale = 1, openShiftY = 0, lastP = -1, ticking = false, heroDone = false;

  function measure(){
    if (!desktop()){
      visual.style.transform = '';
      items.forEach(function(el){ el.style.opacity = ''; el.style.transform = ''; });
      floatBadge.style.opacity = ''; floatBadge.style.transform = '';
      return;
    }
    var prev = visual.style.transform;
    visual.style.transform = 'none';
    var r = visual.getBoundingClientRect();

    /* Distance from the card's resting centre to the centre of the viewport */
    shiftX = (window.innerWidth / 2) - (r.left + r.width / 2);

    /* How far the dashboard opens on entry. The floating HMRC badge is held
       back until the card settles, so only the card itself has to fit: the
       usable band runs from just under the header to above the scroll cue. */
    var bandTop    = HDR + 20;
    var bandBottom = window.innerHeight - 88;
    var bandH      = bandBottom - bandTop;
    var bandCy     = (bandTop + bandBottom) / 2;
    var availW     = Math.min(window.innerWidth - 72, 1380);

    openScale = Math.min(availW / r.width, bandH / r.height, 2.1);
    if (!isFinite(openScale) || openScale < 1) openScale = 1;

    /* Scaling pivots on the card's own centre, so nudge it back onto the
       centre of that band once enlarged. */
    var cy = (r.top + r.bottom) / 2;
    openShiftY = bandCy - cy;

    visual.style.transform = prev;
    lastP = -1;
    render();
  }

  function render(){
    if (!desktop()) return;
    var total = heroScroll.offsetHeight - window.innerHeight;
    var p = total > 0 ? clamp(-heroScroll.getBoundingClientRect().top / total) : 1;
    if (Math.abs(p - lastP) < 0.0008) return;
    lastP = p;

    /* Dashboard: wide, centred and face-on at p=0 â†’ right, resting size and tilted at p=1 */
    var e = easeOut(p);
    var inv = 1 - e;
    visual.style.transform =
      'translate3d(' + (shiftX * inv).toFixed(2) + 'px,' + (openShiftY * inv).toFixed(2) + 'px,0)' +
      ' scale(' + (1 + (openScale - 1) * inv).toFixed(4) + ')' +
      ' rotateY(' + (10 * e).toFixed(2) + 'deg)' +
      ' rotateX(' + (2.5 * e).toFixed(2) + 'deg)' +
      ' rotateZ(' + (-0.9 * e).toFixed(2) + 'deg)';

    /* Copy: staggered fade + slide in from the left, once the card starts moving */
    items.forEach(function(el, i){
      var s = 0.30 + i * 0.065, en = s + 0.30;
      var t = easeOut(clamp((p - s) / (en - s)));
      el.style.opacity = t;
      el.style.transform = 'translate3d(' + ((t - 1) * 42).toFixed(2) + 'px,' + ((1 - t) * 14).toFixed(2) + 'px,0)';
    });

    /* The HMRC badge arrives once the dashboard is on its way to resting */
    var bt = easeOut(clamp((p - 0.52) / 0.34));
    floatBadge.style.opacity = bt;
    floatBadge.style.transform = 'translate3d(' + ((1 - bt) * -18).toFixed(2) + 'px,' + ((1 - bt) * 16).toFixed(2) + 'px,0) scale(' + (0.9 + 0.1 * bt).toFixed(3) + ')';

    cue.style.opacity = clamp(1 - p * 4);

    if (p > 0.92 && !heroDone){ heroDone = true; scribble.classList.add('drawn'); }
    if (p < 0.85) heroDone = false;
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){ render(); ticking = false; });
  }

  if (!reduced){
    /* Hide the copy before first paint so it does not flash in */
    if (desktop()){ items.forEach(function(el){ el.style.opacity = 0; }); floatBadge.style.opacity = 0; }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();
  } else {
    scribble.classList.add('drawn');
  }

  /* ---------- SCROLL REVEALS ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)){
    Array.prototype.forEach.call(revealItems, function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
    Array.prototype.forEach.call(revealItems, function(el){ io.observe(el); });
  }

  /* ---------- STEP LINE + NUMBERS ---------- */
  var steps = document.getElementById('steps');
  var spark = document.getElementById('spark');

  function sizeSpark(){
    if (!steps || !spark) return;
    /* The glow runs the same 75% span as the connector line */
    spark.style.setProperty('--run', (steps.offsetWidth * 0.75) + 'px');
  }
  sizeSpark();
  window.addEventListener('resize', sizeSpark);

  function lightSteps(){
    steps.classList.add('lit');
    Array.prototype.forEach.call(steps.querySelectorAll('.step'), function(st, i){
      setTimeout(function(){ st.classList.add('on'); }, 200 + i * 420);
    });
  }

  if (steps && !reduced && 'IntersectionObserver' in window){
    var sio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        sizeSpark();
        lightSteps();
        sio.disconnect();
      });
    }, {threshold:0.3});
    sio.observe(steps);
  } else if (steps){
    steps.classList.add('lit');
    Array.prototype.forEach.call(steps.querySelectorAll('.step'), function(st){ st.classList.add('on'); });
  }

  /* ---------- COUNTERS ---------- */
  function runCount(el){
    var target  = parseFloat(el.getAttribute('data-count'));
    var dec     = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    var sep     = el.getAttribute('data-sep') === '1';
    var dur     = 1500, start = null;

    function fmt(v){
      var s = v.toFixed(dec);
      if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return s + suffix;
    }
    if (reduced){ el.textContent = fmt(target); return; }

    function tick(ts){
      if (start === null) start = ts;
      var t = clamp((ts - start) / dur);
      el.textContent = fmt(target * easeOut(t));
      if (t < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)){
    Array.prototype.forEach.call(counters, runCount);
  } else {
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        runCount(en.target);
        if (en.target.closest('.mock-greet, .mock-main')) greet.classList.add('waving');
        cio.unobserve(en.target);
      });
    }, {threshold:0.5});
    Array.prototype.forEach.call(counters, function(el){ cio.observe(el); });
  }

  /* ---------- BENEFIT TICKS ---------- */
  var benefits = document.querySelectorAll('.benefit');
  if (!reduced && 'IntersectionObserver' in window){
    var bio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        bio.unobserve(en.target);
      });
    }, {threshold:0.5});
    Array.prototype.forEach.call(benefits, function(el){ bio.observe(el); });
  } else {
    Array.prototype.forEach.call(benefits, function(el){ el.classList.add('in'); });
  }

})();
