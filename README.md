# Heloisa & Rebeca — wedding site

Static site built from the Figma file `wedding-website` (desktop EN/PT + mobile frames). No build step.

```
index.html         redirects "/" to /home (GitHub Pages serves .html files extension-less)
home.html           /home
eventdetails.html   /eventdetails
travelandstay.html  /travelandstay
rsvp.html           /rsvp
faq.html            /faq
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
Note: the clean URLs (`/home`, `/eventdetails`, …) rely on GitHub Pages' extension-less
serving — a plain local server (like the one above) needs the `.html` suffix instead.

## Still to do
- **RSVP isn't connected yet.** It POSTs to a Google Apps Script Web App when `ENDPOINT_URL`
  is set in `js/rsvp.js` (falls back to a "not open yet" note until then) — see the setup
  steps shared alongside that change for creating the Sheet + Apps Script deployment.
- **"View Hotel" links** point to Google Maps searches — swap in each hotel's real page (`travelandstay.html`).
- **Pássaro Marron link** goes to passaromarron.com.br — confirm it's the right page.
- **FAQ answers 2–8** were written by Claude from details elsewhere on the site (only the adults-only answer was in the design). Please review in `js/i18n.js` — especially rain plans, plus-ones and the contact answer.
