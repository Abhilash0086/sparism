# Sparism Website

A lightweight, mobile-first site: a proper Home/About/Contact around a
product catalog + enquiry form. No cart, no checkout — customers browse
products and submit their details, which get saved straight into a Google
Sheet you control.

## Site map — important: the QR still points at `catalog.html`, not the homepage

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Brand story teaser, promises, bestseller, testimonials |
| **Product Catalog** | **`catalog.html`** | **This is the QR-code target.** Full product grid + enquiry form |
| About Us | `about.html` | Full brand story |
| Contact Us | `contact.html` | Same enquiry form, reachable independently of a product |
| Terms & Conditions | `terms.html` | Same content as your existing Terms page |
| Privacy Policy | `privacy.html` | Adapted for this site specifically (see note below) |

The physical QR sticker should encode `https://yourdomain.com/catalog.html`
(not the bare domain) so scanning it lands straight on the product grid, the
same experience as before. Visitors who find the site another way (search,
a link in bio, a business card) land on `index.html` like a normal website.

**Privacy Policy note:** your existing Privacy Policy (the Google Sites one)
describes the Wix store — Wix hosting, shopping-cart cookies, Razorpay
payments. None of that applies to *this* site, since it's a separate static
site that only takes enquiries (no payments, no cart, no Wix). `privacy.html`
is adapted accordingly — same commitments, corrected specifics. If the two
sites ever diverge further, keep both in sync manually; there's no shared
source file.

## Files

```
website/
  index.html            Home
  catalog.html           Product Catalog — THE QR TARGET
  about.html              About Us
  contact.html             Contact Us
  terms.html                Terms & Conditions
  privacy.html                Privacy Policy
  styles.css           all styling (brand colors, layout, nav, footer)
  script.js              enquiry form + catalog rendering (guards itself so
                           it's safe to include on both catalog.html and
                           contact.html)
  nav.js                mobile hamburger menu toggle, included on every page
  products.js            <- edit this to add/remove/reprice products
  assets/
    logo-new/             the current logo (see "The logo" below)
    favicon-32/192/512.png
    fonts/                Italiana + Jost .ttf, used to build the logo
    build_logo.py          regenerates every logo-new/*.png from the sparkle mark + fonts
    products/            <- drop regenerated product photos here
  apps-script/
    Code.gs             paste into Google Apps Script (Sheet backend)
```

**No templating** — this is plain static HTML, so the header/nav and footer
are duplicated at the top/bottom of all six page files. If you change the
nav (add a page, rename a link), update it in all six. A find-and-replace
across the `website/*.html` files is the fastest way.

## 1. Connect the enquiry form to a Google Sheet

1. Create a new Google Sheet (e.g. "Sparism Enquiries").
2. In the Sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of
   `apps-script/Code.gs`.
4. Click **Deploy → New deployment**, choose type **Web app**, set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize when prompted, then copy the **Web app URL** it gives you.
6. Open `script.js` and paste that URL into:
   ```js
   const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
7. Open the site, submit a test enquiry, and confirm a new row appears in
   the Sheet (columns: Timestamp, Name, Phone, Address, Email, Product,
   Message).

If you ever change the script logic, you must **Deploy → Manage deployments
→ Edit → New version** for changes to go live — editing the code alone does
not update the existing deployment.

## 2. The logo

The site uses a redesigned logo built from a hand-picked AI-generated
sparkle mark (`assets/logo-new/sparkle-mark.png`) paired with the real
**Italiana** typeface for "SPARISM" and **Jost** for the tagline — not
AI-generated text, so it stays perfectly crisp at any size, including
printed small on a jar lid.

Available versions in `assets/logo-new/`:

| File | Use |
|---|---|
| `logo-navbar.png` | Website header/footer — mark + wordmark, no tagline |
| `lockup-primary.png` | Full lockup, cream bg, plum ink — packaging, print |
| `lockup-reversed.png` | Full lockup, plum bg, white ink — dark surfaces |
| `lockup-print-black.png` | Full lockup, single black ink — small-size label printing |
| `icon-mark.png` | Mark only, transparent — also the source for the favicon |

To tweak spacing/size/colors later, edit `assets/build_logo.py` and rerun
`python build_logo.py` from inside `assets/` — it regenerates every file
above from the same sparkle mark + fonts, so everything stays consistent.

## 3. Add product photos

Once you've regenerated the product images (prompts provided separately),
save each one into `assets/products/` using the **exact filename** referenced
in `products.js`, for example:

```
assets/products/body-butter-rose-geranium.jpg
assets/products/root-revival-hair-mask.jpg
assets/products/dewdrop-hydrator.jpg
assets/products/peppermint-frost-bath-salt.jpg
assets/products/minty-lavender-foot-butter.jpg
assets/products/lip-balm-scarlet-glow.jpg
assets/products/lip-balm-sweet-orange.jpg
assets/products/lip-balm-choco.jpg
assets/products/deo-shot-calm-citrus.jpg
assets/products/deo-shot-rose-silk.jpg
assets/products/rosy-earth-clay-mask.jpg
assets/products/essentials-facial-oil.jpg
```

Until a photo exists, that product card automatically shows a clean branded
placeholder — nothing breaks, no code changes needed.

Square images (1:1) work best since cards are cropped square. 1200×1200px is
a good target size.

## 4. Update prices / add or remove products

Everything shown on the site is driven by `products.js`. Each entry looks
like:

```js
{
  id: "body-butter-rose-geranium",
  name: "Body Butter — Rose & Geranium",
  category: "Body",       // Face | Body | Hair | Lips — powers the filter chips
  price: 300,               // set to null to show "On enquiry"
  size: "90g",
  tag: "Bestseller",        // optional badge, omit to hide
  image: "assets/products/body-butter-rose-geranium.jpg",
  description: "...",
}
```

Products with a `variants` array (Lip Balm, Deo Shot) show clickable scent
chips that swap the photo and pre-fill the enquiry form's product field.

`Rosy Earth Clay Mask` and `Sparism Essentials` currently have `price: null`
since they aren't listed on the existing Wix store yet — set a price once
confirmed.

## 5. Host the site

Any static host works since there's no server code to run. Easiest options:

- **GitHub Pages**: push the `website/` folder contents to a repo, enable
  Pages on the `main` branch.
- **Netlify / Vercel**: drag-and-drop the `website/` folder in their
  dashboard, or connect the repo — both give you a free HTTPS URL instantly.

Once live, note the final URL (e.g. `https://sparism-menu.netlify.app`) —
the homepage. Append `/catalog.html` to get the QR target, e.g.
`https://sparism-menu.netlify.app/catalog.html`.

**Also do a find-and-replace** for `YOUR-DOMAIN-HERE` across all six HTML
files, swapping in your real hosted domain — this is used in each page's
Open Graph tags (`og:url`, `og:image`) so links look right with a preview
image/title when shared on WhatsApp, Instagram, etc. Until you do this,
shared links will point at a placeholder image that doesn't exist.

## 6. Generate the QR code

Use any free QR generator (e.g. Google's "QR Code Generator", qr-code-
generator.com, or the QR tool built into Canva) and point it at your hosted
**`catalog.html`** URL specifically — not the bare domain, or it'll land on
the Home page instead of the product grid. Test-scan it with a phone before
printing.

## Notes

- The enquiry form uses a `no-cors` fetch to the Apps Script Web App. This
  is the standard pattern for static-site-to-Apps-Script submissions — the
  browser can't read the response, so the site optimistically shows a
  success message once the request is sent without a network error. Your
  Sheet is the source of truth for whether an enquiry actually landed.
- Phone number field requires 10–13 digits; adjust the `pattern` in
  `catalog.html` / `contact.html` and `isValidIndianPhone()` in `script.js`
  if you want stricter validation.
- The contact number shown across the site (`+91 94878 87871`) is taken
  from the existing Wix "Contact Us" page — it appears in all six HTML
  files, so update it everywhere if it changes.
