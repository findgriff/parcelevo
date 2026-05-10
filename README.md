# Parcel Evo — website

Premium bespoke courier service. Static one-page site, no build step.

> The previous SaaS-platform code is preserved at the
> [`archive/saas-platform-2026-01`](https://github.com/findgriff/parcelevo/tree/archive/saas-platform-2026-01)
> tag if you ever want to revisit it.

## Files

```
index.html          # full landing page, all sections
styles.css          # design system + responsive layout
script.js           # nav, scroll reveal, quote-form submission
assets/
  favicon.svg       # placeholder mark — replace with brand version
  logo.png          # ⚠ drop your real logo here (see below)
```

## Local preview

Any static file server works. Easiest:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html`.

## Things to do before going live

### 1. Drop in the real logo

Save your brand logo as **`assets/logo.png`** (transparent background, ~600px wide
is plenty). The site falls back to a styled wordmark if the file is missing,
so it won't break — but the PNG looks better.

If you prefer SVG, save it as `assets/logo.svg` and update the `<img src>` in
`index.html` (one place near the top of `<header>`).

### 2. Replace contact placeholders

Search-and-replace these across `index.html`:

| Placeholder | Replace with |
|---|---|
| `+44 0000 000 000` | your phone number |
| `+440000000000` | same number, no spaces (used in `tel:` links) |
| `hello@parcelevo.co.uk` | your email |

### 3. Wire up the quote form (1 minute)

The form currently shows a friendly fallback message until you connect it.
Cheapest option: [Formspree](https://formspree.io) — free tier covers 50
submissions/month.

1. Sign up at formspree.io with the address you want quote requests sent to
2. Create a new form, copy the form ID (looks like `xqkzwerp`)
3. In `index.html`, find this line:

   ```html
   <form ... data-formspree-id="REPLACE_WITH_FORMSPREE_ID" ...>
   ```

   Replace `REPLACE_WITH_FORMSPREE_ID` with your form ID.
4. Submit a test quote — confirm it lands in your inbox.

Alternatives: [Web3Forms](https://web3forms.com) (also free) or a serverless
function on Cloudflare Pages / Netlify if you want to self-host it.

### 4. Deploy

**Cloudflare Pages (recommended, free, fast):**

1. Push this repo to GitHub (already done if you're reading this)
2. Cloudflare dashboard → Workers & Pages → Create → Connect to Git
3. Pick `findgriff/parcelevo`, build command **none**, output dir **/**
4. Deploy. Add your custom domain (`parcelevo.co.uk`) in the Pages settings.

**Netlify (alternative):**

1. netlify.com → Add new site → Import from Git → pick this repo
2. Build command **(none)**, publish directory **`.`**
3. Deploy and add the custom domain.

**Drag-and-drop (no Git needed):**

Zip the folder, drag it onto netlify.com or cloudflare's pages dashboard.
Done.

## Design notes

- **Brand colours:** black (`#0A0A0A`) + Parcel Evo red (`#E63329`). Pulled
  from the logo. Defined as CSS variables at the top of `styles.css` —
  change in one place if you want to tweak.
- **Type:** Inter (body) + Space Grotesk (display headings), via Google Fonts.
- **No build step.** Edit HTML/CSS/JS directly — no npm, no bundler, no waiting.
- **Accessibility:** skip link, focus-visible styles, semantic landmarks,
  reduced-motion support, form labels and `aria-live` status.

## Future ideas (when you're ready)

- Add a `/services/` page if you want to break out specific verticals
  (antiques, art, marketplace) for SEO
- Add testimonials / case studies once you have customers happy to be quoted
- Add structured-data review snippets to the schema.org block in `<head>`
- Swap to an Astro project if you want to grow it into a multi-page site
  with a blog — current structure ports cleanly
