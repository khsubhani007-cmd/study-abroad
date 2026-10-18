# Study Abroad By SiU — website

Static website (HTML/CSS/JS). No build step. Ready for GitHub Pages.

## Pages
- `index.html` — home (boarding-pass hero, departures board, bento features, destinations, journey, lead form, guides, FAQ)
- `study-in-italy.html`, `study-in-uk.html`, `study-in-ireland.html`, `study-in-hungary.html`, `study-in-cyprus.html` — destination landing pages (use these for Google Ads)
- `articles.html` + 5 guide pages — SEO content
- `contact.html`, `privacy-policy.html`, `404.html`

## Domain — IMPORTANT
The site is set up for **studyabroadbytrc.com** (see the `CNAME` file). DNS records at your registrar:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | khsubhani007-cmd.github.io. |

## Lead form
The form opens WhatsApp to **0301 9510101** with the student's details pre-filled. Change `WA` at the top of `assets/js/siu.js` and in the HTML links if the number changes.

## Google Ads tracking
Paste your Google Ads / GA4 tag where `<!-- Google Ads / GA4 ... -->` appears in each page's `<head>`. The site pushes these events:
`generate_lead` (form submit), `whatsapp_click`, `phone_click`.

## SEO included
Unique titles/descriptions per page, canonical URLs, Open Graph share images per page, JSON-LD (EducationalOrganization, Service, Article, FAQPage, BreadcrumbList), sitemap.xml, robots.txt.
