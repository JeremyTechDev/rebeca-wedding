(function () {
  'use strict';

  var site = window.WeddingSite;
  var form = document.querySelector('[data-rsvp]');
  if (!form || !site) return;

  var guestList = form.querySelector('[data-guests]');
  var addBtn = form.querySelector('[data-add-guest]');
  var note = form.querySelector('[data-note]');
  var reactions = {
    yes: form.querySelector('[data-reaction="yes"]'),
    no: form.querySelector('[data-reaction="no"]')
  };

  /* ── Guest rows ── */
  var guestCount = 0;

  function addGuest() {
    guestCount += 1;
    var id = 'guest-' + guestCount;
    var row = document.createElement('div');
    row.className = 'guest';
    row.innerHTML =
      '<label class="visually-hidden" for="' + id + '" data-i18n="rsvp.guestPlaceholder"></label>' +
      '<input id="' + id + '" name="guests[]" type="text" autocomplete="off" data-i18n-attr="placeholder:rsvp.guestPlaceholder">' +
      '<button type="button" class="link-btn link-btn--del" data-remove>' +
      '<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg><span data-i18n="rsvp.delete"></span></button>';
    row.querySelector('label').textContent = site.t('rsvp.guestPlaceholder');
    row.querySelector('input').placeholder = site.t('rsvp.guestPlaceholder');
    row.querySelector('[data-i18n="rsvp.delete"]').textContent = site.t('rsvp.delete');
    guestList.appendChild(row);
    row.querySelector('input').focus();
  }

  addBtn.addEventListener('click', addGuest);
  guestList.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-remove]');
    if (!btn) return;
    var row = btn.closest('.guest');
    var prevInput = row.previousElementSibling && row.previousElementSibling.querySelector('input');
    row.remove();
    if (prevInput) prevInput.focus();
  });

  /* ── Yes / No reaction ── */
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'attending') return;
    var v = e.target.value;
    form.classList.add('has-choice');
    reactions.yes.classList.toggle('is-shown', v === 'yes');
    reactions.no.classList.toggle('is-shown', v === 'no');
    if (v === 'no') { escapesLeft = 0; tx = ty = 0; noLabel.style.transform = ''; }   // caught it: slide home
    setNote(null);
  });

  /* ── The "No" button runs away 2–3 times (designer's note), then gives up ── */
  var noLabel = form.querySelector('.choice--no');
  var yesLabel = form.querySelector('.choice:not(.choice--no)');
  var card = form.closest('.rsvp-card') || form;
  var escapesLeft = 2 + Math.round(Math.random());   // 2 or 3
  var tx = 0, ty = 0;

  function escape() {
    if (escapesLeft <= 0) return false;
    escapesLeft -= 1;
    var c = card.getBoundingClientRect();
    var r = noLabel.getBoundingClientRect();
    var baseLeft = r.left - tx, baseTop = r.top - ty;
    // Stay inside the card, at or below the button row (never over the heading), clear of "Yes".
    var minX = c.left + 16 - baseLeft, maxX = c.right - 16 - r.width - baseLeft;
    var minY = 0, maxY = Math.max(0, Math.min(c.bottom - 16 - r.height - baseTop, 60));
    var y0 = yesLabel.getBoundingClientRect();
    var best = [tx, ty], bestDist = -1;
    for (var i = 0; i < 24; i++) {
      var x = minX + Math.random() * (maxX - minX);
      var y = minY + Math.random() * (maxY - minY);
      var left = baseLeft + x, top = baseTop + y;
      var hitsYes = left < y0.right + 12 && left + r.width > y0.left - 12 && top < y0.bottom + 8 && top + r.height > y0.top - 8;
      if (hitsYes) continue;
      var d = Math.hypot(x - tx, y - ty);
      if (d > bestDist) { bestDist = d; best = [x, y]; }
    }
    tx = Math.round(best[0]); ty = Math.round(best[1]);
    // Rects are in screen pixels; translate() is in CSS pixels, which differ when the page is zoomed.
    var z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1;
    noLabel.style.transform = 'translate(' + (tx / z) + 'px,' + (ty / z) + 'px)';
    return true;
  }

  // Mouse: dodge as the cursor arrives. Touch/pen: dodge on the first taps.
  noLabel.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse') escape();
  });
  noLabel.addEventListener('click', function (e) {
    // e.detail === 0 means keyboard activation: never block keyboard users.
    if (e.detail > 0 && escapesLeft > 0) {
      e.preventDefault();
      escape();
    }
  });

  /* ── Submit (not connected yet) ── */
  function setNote(key) {
    if (!key) { note.textContent = ''; note.removeAttribute('data-i18n'); return; }
    note.setAttribute('data-i18n', key);
    note.textContent = site.t(key);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('#name');
    var choice = form.querySelector('input[name="attending"]:checked');
    name.removeAttribute('aria-invalid');
    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      name.focus();
      setNote('rsvp.needName');
      return;
    }
    if (!choice) { setNote('rsvp.needChoice'); return; }

    // TODO: endpoint — RSVPs aren't connected yet. When a form service is chosen
    // (Formspree, Tally, Google Apps Script…), POST new FormData(form) here.
    setNote('rsvp.notOpen');
  });
})();
