
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

  /* ---------- HERO: settled split layout (no scroll theater) ---------- */
  var scribble = document.getElementById('scribble');
  if (scribble) scribble.classList.add('drawn');

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
