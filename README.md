# Hari ❤ Varshini — Telugu Wedding Invitation

A premium, mobile-first, one-page digital wedding invitation for a traditional South Indian Telugu Hindu wedding.
Fully static HTML/CSS/JS — deploy anywhere (GitHub Pages, Netlify, Vercel).

## ✨ Features

- Cinematic **welcome overlay** with Ganesha invocation and animated names
- **Hero section** with animated countdown, falling multi-colour petals (rose, jasmine, marigold, lotus, gold), soft glowing particles, mango-leaf toranam
- **Bride & Groom** portraits with luxury gold frames and hover-zoom
- **Invitation message** card with vine and corner ornaments
- **Event cards** with brass-deepam motif for Reception and Wedding Muhurtham
- **Venue** section with embedded Google Map, Get Directions, Open in Maps, and Copy Address
- **Gallery** with 6 lazy-loaded photos and a keyboard-navigable lightbox
- **RSVP form** wired to Google Sheets via Google Apps Script
- **Floating music player** (play/pause, progress, volume) — off until user starts
- Sticky nav, back-to-top, WhatsApp share, copy link, Google Calendar link, `.ics` download
- Light / dark mode toggle (persisted in localStorage)
- Full accessibility: ARIA labels, keyboard-friendly, respects `prefers-reduced-motion`

## 📁 Project structure

```
/
├── index.html         Markup for the entire site
├── style.css          All styles + tokens (light/dark themes)
├── script.js          Interactive behaviour (petals, countdown, RSVP, music, lightbox, …)
├── Code.gs            Google Apps Script backend (deploy separately)
├── README.md          This file
├── images/            Replace these placeholders with your own photos
│   ├── hero.jpg
│   ├── bride.jpg
│   ├── groom.jpg
│   ├── couple.jpg
│   ├── gallery1.jpg … gallery6.jpg
│   ├── venue.jpg
│   └── family.jpg
└── music/
    └── wedding.mp3    Replace with your background music track
```

## 🛠 Customization

Nearly everything you'll want to change is at the top of a file and clearly commented.

### 1 · Names, families, dates, addresses

Open `index.html` — every string is inline. Search-and-replace is your friend:

- `Hari` / `Varshini`
- `Botta` / `Kosuri`
- Dates: `20 August 2026`, `21 August 2026`, `3:56 AM`, `7:00 PM`
- Full address in the `.venue__addr` block

### 2 · Countdown target

In **`script.js`** (top of file):

```js
const WEDDING_ISO   = '2026-08-21T03:56:00+05:30';  // wedding muhurtham
const RECEPTION_ISO = '2026-08-20T19:00:00+05:30';  // reception
```

### 3 · Colours & fonts

All design tokens live in `:root` at the top of **`style.css`** — `--maroon`, `--gold`, `--emerald`, `--lotus`, and so on. Dark-mode overrides sit right below in `[data-theme="dark"]`.

Fonts are loaded from Google Fonts: Cormorant Garamond (display), Cinzel (small caps), Noto Sans Telugu (Sanskrit), Great Vibes (script).

### 4 · Photos

Drop your own JPGs into `images/` using the same filenames listed above. The frames automatically letterbox images to the correct aspect ratio.

### 5 · Music

Replace `music/wedding.mp3` with your track. Music stays off until the visitor presses play.

## 📝 RSVP — Google Sheets setup

1. Create a new Google Sheet.
2. In that sheet: **Extensions → Apps Script**.
3. Delete the starter code and paste the contents of `Code.gs`.
4. Save, then **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the "Web app URL".
6. Open `script.js` and set:

   ```js
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/…/exec';
   ```

Done — RSVPs will append rows into an "RSVPs" tab in your sheet. Until this URL is set, the form runs in demo mode and logs submissions to the browser console.

## 🚀 Deploying

**GitHub Pages** — push this folder to a repo → Settings → Pages → source: `main` branch → Save.

**Netlify** — drag & drop the folder onto https://app.netlify.com/drop.

**Vercel** — `vercel --prod` from this folder, or Import in the dashboard.

No build step required — this is a purely static site.

## ♿ Accessibility

- Semantic landmarks (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Every icon-only button has `aria-label`
- `prefers-reduced-motion` disables petals + reveal animations
- Colour contrast targets WCAG AA in both themes

## 📄 License

Free to use and adapt for your own personal wedding invitation. Please do not resell or redistribute as a template product.

— With love, for Hari & Varshini · Botta ❤ Kosuri
