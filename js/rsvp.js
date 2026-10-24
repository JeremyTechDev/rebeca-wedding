(function () {
  'use strict';

  var site = window.WeddingSite;
  var form = document.querySelector('[data-rsvp]');
  if (!form || !site) return;

  // The real RSVP (attending, guest names, etc.) is collected on the wedding
  // planner's own form — this page just captures the first yes/no and routes
  // guests there.
  var EXTERNAL_RSVP_URL = 'https://assessoriavip.com.br/rsvpUnico/208b15b0-59d8-11f1-b9db-85b2b0fdb015';

  var note = form.querySelector('[data-note]');
  var fallbackLink = form.querySelector('[data-fallback-link]');
  var reactions = {
    yes: form.querySelector('[data-reaction="yes"]'),
    no: form.querySelector('[data-reaction="no"]')
  };

  /* ── Yes / No reaction, then redirect to the wedding planner's RSVP form ── */
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'attending') return;
    var v = e.target.value;
    form.classList.add('has-choice');
    reactions.yes.classList.toggle('is-shown', v === 'yes');
    reactions.no.classList.toggle('is-shown', v === 'no');
    if (v === 'no') { escapesLeft = 0; tx = ty = 0; noLabel.style.transform = ''; }   // caught it: slide home
    noLabel.classList.remove('is-catchable');
    form.querySelectorAll('input[name="attending"]').forEach(function (el) { el.disabled = true; });
    startRedirectCountdown();
  });

  function startRedirectCountdown() {
    fallbackLink.hidden = false;
    var count = 3;
    setNoteText(site.t('rsvp.redirecting', { n: count }));
    var timer = setInterval(function () {
      count -= 1;
      if (count > 0) {
        setNoteText(site.t('rsvp.redirecting', { n: count }));
      } else {
        clearInterval(timer);
        setNoteText(site.t('rsvp.redirected'));
        window.open(EXTERNAL_RSVP_URL, '_blank', 'noopener');
      }
    }, 1000);
  }

  function setNoteText(text) {
    note.removeAttribute('data-i18n');
    note.textContent = text;
  }

  /* ── The "No" button runs away 2–3 times (designer's note), then gives up ── */
  var noLabel = form.querySelector('.choice--no');
  var yesLabel = form.querySelector('.choice:not(.choice--no)');
  var header = document.querySelector('.site-header');
  var footer = document.querySelector('.site-footer');
  var escapesLeft = 2 + Math.round(Math.random());   // 2 or 3
  var tx = 0, ty = 0;
  // The label's own un-transformed position, read once up front: re-deriving it later from
  // getBoundingClientRect() would be wrong mid-transition (the rect briefly lags the target
  // while the .28s slide is still playing), which could otherwise send two escapes in quick
  // succession (a fast flick, a tap right after a hover) wildly off target.
  var homeRect = noLabel.getBoundingClientRect();
  var baseLeft = homeRect.left, baseTop = homeRect.top;
  var labelWidth = homeRect.width, labelHeight = homeRect.height;

  function escape() {
    if (escapesLeft <= 0) return false;
    escapesLeft -= 1;
    // Roam anywhere in the CURRENTLY VISIBLE viewport — diagonally, outside the card — but
    // stay clear of the header/footer chrome and never land on top of "Yes". Clamped to
    // window.innerHeight so that on tall, scrollable pages (mobile/tablet) it never picks a
    // spot above or below the fold — same "never needs a scroll to find it" rule as desktop.
    var margin = 16;
    // Extra headroom above: the "you can click it now" tooltip pops up above the button.
    var topBound = Math.max(0, header ? header.getBoundingClientRect().bottom : 0) + margin + 54;
    var bottomBound = Math.min(window.innerHeight, footer ? footer.getBoundingClientRect().top : window.innerHeight) - margin;
    var minX = margin - baseLeft, maxX = window.innerWidth - margin - labelWidth - baseLeft;
    var minY = topBound - baseTop, maxY = Math.max(topBound, bottomBound - labelHeight) - baseTop;
    var y0 = yesLabel.getBoundingClientRect();
    var best = [tx, ty], bestDist = -1;
    for (var i = 0; i < 24; i++) {
      var x = minX + Math.random() * (maxX - minX);
      var y = minY + Math.random() * (maxY - minY);
      var left = baseLeft + x, candidateTop = baseTop + y;
      var hitsYes = left < y0.right + 12 && left + labelWidth > y0.left - 12 && candidateTop < y0.bottom + 8 && candidateTop + labelHeight > y0.top - 8;
      if (hitsYes) continue;
      var d = Math.hypot(x - tx, y - ty);
      if (d > bestDist) { bestDist = d; best = [x, y]; }
    }
    tx = Math.round(best[0]); ty = Math.round(best[1]);
    // Rects are in screen pixels; translate() is in CSS pixels, which differ when the page is zoomed.
    var z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1;
    noLabel.style.transform = 'translate(' + (tx / z) + 'px,' + (ty / z) + 'px)';
    // Last dodge used up: let them know the next click/tap will land.
    if (escapesLeft === 0) noLabel.classList.add('is-catchable');
    return true;
  }

  // Mouse: dodge as the cursor arrives (hover reveals it before the click even happens).
  noLabel.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse') escape();
  });
  // Touch/pen: there's no hover, so dodge right on first contact — preventing the
  // default here stops the compatibility click, same as it looks on desktop (a near-miss).
  noLabel.addEventListener('touchstart', function (e) {
    if (escapesLeft > 0) {
      e.preventDefault();
      escape();
    }
  }, { passive: false });
  noLabel.addEventListener('click', function (e) {
    // e.detail === 0 means keyboard activation: never block keyboard users.
    if (e.detail > 0 && escapesLeft > 0) {
      e.preventDefault();
      escape();
    }
  });
})();
