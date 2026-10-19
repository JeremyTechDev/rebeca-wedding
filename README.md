# Heloisa & Rebeca — wedding site

Static site built from the Figma file `wedding-website` (desktop EN/PT + mobile frames). No build step.

```
index.html  details.html  travel.html  rsvp.html  faq.html
css/styles.css   all styles (desktop, tablet ≤1100px, mobile ≤700px)
js/i18n.js       every EN + PT string — edit copy here
js/main.js       EN/PT toggle (remembered per browser), countdown, icons, hotel carousel
js/rsvp.js       RSVP form behaviour
assets/          web-ready images (photos resized to 900px)
_source/         full-size originals — not needed online
_unused/         Figma exports the site doesn't use — not needed online
```

Preview locally: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.
To publish, upload everything except `_source/` and `_unused/` (Netlify drop, GitHub Pages, etc.).

## Still to do
- **RSVP isn't connected.** Submitting shows a "not open yet" note. Hook up a form service at the `TODO: endpoint` in `js/rsvp.js`.
- **"View Hotel" links** point to Google Maps searches — swap in each hotel's real page (`travel.html`).
- **Pássaro Marron link** goes to passaromarron.com.br — confirm it's the right page.
- **FAQ answers 2–8** were written by Claude from details elsewhere on the site (only the adults-only answer was in the design). Please review in `js/i18n.js` — especially rain plans, plus-ones and the contact answer.
