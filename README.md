# Arpit Yadav — Video Editor Portfolio

A complete, ready-to-host portfolio website with a built-in admin dashboard.

## What's inside
- `index.html` — the public site (hero with photo, about, work gallery with
  category filters, pricing, contact form).
- `admin.html` — password-protected dashboard to manage everything: profile
  info, categories, videos, pricing, and settings.
- `css/`, `js/`, `images/` — styles, logic, and the profile photo.

## How to open it
Double-click `index.html` to preview it locally, or upload the whole folder
to any static host (Netlify, Vercel, GitHub Pages, Hostinger, etc. — no
server or database setup needed).

## Logging into the admin
Go to `admin.html` (there's also a small "Admin login" link in the site
footer). Default password:

```
arpit123
```

Change it right away from **Settings** inside the dashboard.

From the dashboard you can:
- **Profile & about** — edit name, tagline, bio, software used, experience,
  contact details, social links, homepage stats, and swap the photo.
- **Categories** — add, rename, or delete the categories used to filter the
  work section.
- **Videos** — add a title, category, description, thumbnail image, and a
  video link (YouTube/Vimeo embed link or a direct `.mp4` URL), then it
  appears instantly in the gallery with a click-to-play popup.
- **Pricing** — edit the three plans (or add/remove plans), their price,
  features, and which one is marked "Most booked".
- **Settings** — change the admin password, export/import a JSON backup of
  all content, or reset everything back to the demo defaults.

## ⚠️ Important: how the content is stored
This site has **no backend or database** — it's pure HTML/CSS/JS, which is
why it works instantly with zero setup. All content edited in the admin
dashboard is saved in the browser's local storage.

That means:
- Changes you make are saved **on the device/browser you made them in**.
- If you edit content on your laptop, visitors on their own phones/laptops
  will still see the **original demo content**, not your edits — because
  their browser has its own separate storage.
- This setup is great for previewing changes, running the site with content
  you set once and rarely change, or for hosting where you're comfortable
  editing directly in the site's files.

**If you need edits made in the admin panel to show up for every visitor
immediately** (a true multi-user CMS), that requires a small backend and
database (e.g. Firebase, Supabase, or a custom Node.js + database setup) to
store the content centrally instead of per-browser. Happy to build that
version if you'd like — just ask.

### The easy workaround for now
1. Set up all your content once in the admin dashboard (in your own
   browser).
2. Go to **Settings → Export backup** to download a `portfolio-data-backup.json`.
3. Open `js/data.js` and paste your content into the `DEFAULT_DATA` object
   (matching the existing structure) — this bakes your content into the
   site's source files, so every visitor sees it, no matter their browser.
4. Re-upload the updated files to your host.

## Contact form
The contact form opens the visitor's email app with a pre-filled message
addressed to the email set in **Profile & about** — no third-party form
service or backend required. This works everywhere but does depend on the
visitor having an email app configured on their device.

## Customizing further
- Fonts: Space Grotesk (headings/body) + JetBrains Mono (timecodes/labels),
  loaded from Google Fonts in `css/style.css`.
- Colors, spacing, etc. are defined as CSS variables at the top of
  `css/style.css` under `:root`.
