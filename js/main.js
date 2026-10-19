(function () {
  'use strict';

  /* ── Icons (Tabler-style line icons), injected once so pages can <use href="#i-name"> ── */
  var ICONS = {
    'external': '<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/>',
    'calendar': '<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M16 3v4M8 3v4M4 11h16"/><path d="M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01" stroke-width="2.4"/>',
    'pin-heart': '<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M15 19.3l-1.6 1.6a2 2 0 0 1 -2.8 0l-4.3 -4.2a8 8 0 1 1 13.6 -4.7"/><path d="M18 22l3.4 -3.3a2.1 2.1 0 0 0 0 -3.1a2.2 2.2 0 0 0 -3.1 0l-.3 .3l-.2 -.3a2.2 2.2 0 0 0 -3.1 0a2.1 2.1 0 0 0 0 3.1z"/>',
    'plane': '<path d="M15.2 11.8l4.8 1.3a2 2 0 1 1 -1 3.9l-14.5 -3.9l-1.3 -6.6l2.9 .8l1.4 2.4l2.9 .8l-.1 -7.3l2.9 .8z"/><path d="M3 21h18"/>',
    'pin': '<circle cx="12" cy="7" r="3"/><path d="M12 10v11"/>',
    'car': '<circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>',
    'building': '<path d="M3 21h18"/><path d="M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    'sparkles': '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'x': '<path d="M18 6l-12 12M6 6l12 12"/>',
    'chevron-down': '<path d="M6 9l6 6l6 -6"/>',
    'chevron-left': '<path d="M15 6l-6 6l6 6"/>',
    'chevron-right': '<path d="M9 6l6 6l-6 6"/>'
  };

  function injectIcons() {
    var symbols = Object.keys(ICONS).map(function (id) {
      return '<symbol id="i-' + id + '" viewBox="0 0 24 24">' + ICONS[id] + '</symbol>';
    }).join('');
    var holder = document.createElement('div');
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' + symbols + '</svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  /* ── Language ── */
  var STORAGE_KEY = 'hr-wedding-lang';
  var dict = window.I18N || { en: {} };

  function storedLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode etc. */ }
  }
  function initialLang() {
    var saved = storedLang();
    if (saved && dict[saved]) return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^pt/i.test(nav) ? 'pt' : 'en';
  }

  function t(key, vars, lang) {
    var table = dict[lang || current] || dict.en;
    var str = table[key] != null ? table[key] : (dict.en[key] != null ? dict.en[key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) { str = str.split('{' + k + '}').join(vars[k]); });
    }
    return str;
  }

  function varsOf(el) {
    var raw = el.getAttribute('data-i18n-vars');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  var current = 'en';

  function applyLang(lang) {
    current = dict[lang] ? lang : 'en';
    document.documentElement.lang = current === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'), varsOf(el));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'), varsOf(el));
    });
    // data-i18n-attr="placeholder:rsvp.placeholder; aria-label:nav.label"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });

    var titleKey = document.body.getAttribute('data-title');
    if (titleKey) document.title = t(titleKey);

    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === current));
    });

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  function initLangToggle() {
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        storeLang(lang);
        applyLang(lang);
      });
    });
  }

  /* ── Countdown to 1 May 2027, 15:30 BRT (UTC−3) ── */
  var WEDDING = new Date('2027-05-01T15:30:00-03:00').getTime();

  function initCountdown() {
    var root = document.querySelector('[data-countdown]');
    if (!root) return;
    var out = {
      d: root.querySelector('[data-cd="d"]'),
      h: root.querySelector('[data-cd="h"]'),
      m: root.querySelector('[data-cd="m"]'),
      s: root.querySelector('[data-cd="s"]')
    };
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function tick() {
      var left = Math.max(0, WEDDING - Date.now());
      var sec = Math.floor(left / 1000);
      out.d.textContent = pad(Math.floor(sec / 86400));
      out.h.textContent = pad(Math.floor(sec % 86400 / 3600));
      out.m.textContent = pad(Math.floor(sec % 3600 / 60));
      out.s.textContent = pad(sec % 60);
      if (left > 0) setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    tick();
  }

  /* ── Hotel carousel (mobile only; on desktop the list is a plain column) ── */
  function initCarousel() {
    var list = document.querySelector('[data-carousel]');
    if (!list) return;
    var items = Array.prototype.slice.call(list.children);
    var dots = document.querySelector('[data-carousel-dots]');
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');
    if (!dots || !prev || !next) return;

    dots.innerHTML = items.map(function () { return '<span></span>'; }).join('');
    var dotEls = dots.children;

    function index() {
      var x = list.scrollLeft, best = 0, bestDist = Infinity;
      items.forEach(function (it, i) {
        var d = Math.abs(it.offsetLeft - list.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft) - x);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    function update() {
      var i = index();
      Array.prototype.forEach.call(dotEls, function (d, j) { d.classList.toggle('is-active', i === j); });
      prev.disabled = i === 0;
      next.disabled = i === items.length - 1;
    }
    function go(delta) {
      var i = Math.min(items.length - 1, Math.max(0, index() + delta));
      list.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    list.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  window.WeddingSite = { t: function (key, vars) { return t(key, vars); }, lang: function () { return current; } };

  document.addEventListener('DOMContentLoaded', function () {
    injectIcons();
    initLangToggle();
    applyLang(initialLang());
    initCountdown();
    initCarousel();
  });
})();
