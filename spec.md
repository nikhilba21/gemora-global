# Gemora Global

## Current State
A full B2B jewellery export website with 9 public pages (Home, About, Products, Wholesale, Why Choose Us, Global Markets, Gallery, Blog, Contact) and an admin panel. SEO meta tags, JSON-LD schema, sitemap, and robots.txt are in place. The site uses React SPA with react-router-dom.

## Requested Changes (Diff)

### Add
- CSP meta tag in index.html (permissive policy allowing required external sources: Google Analytics, Tawk.to, Google Fonts, self)
- `twitter:site` meta tag to complete Twitter Cards
- `width` and `height` attributes on all `<img>` tags across all pages to prevent CLS
- `loading="lazy"` on all below-fold images (everything except hero/first image)
- More contextual internal links between pages (each page should link to at least 3-4 other internal pages in body copy)
- Blog, Gallery, Why Choose Us, Global Markets pages should have more internal links pointing TO them from other pages
- SEO-rich footer links section with links to all 9 pages

### Modify
- Fix any duplicate H1/H2/H3 headings within pages (ensure all heading text is unique on each page)
- Ensure the 404 page component returns correct 404 status behavior — add a `<meta name="robots" content="noindex">` to the 404 page
- index.html: improve page load performance — defer Google Analytics script (already async, keep as-is but move Tawk.to to load after page interactive using setTimeout)
- All pages: ensure each page has exactly one H1 tag
- Navbar: ensure all 9 nav links are present and crawlable
- Footer: add a comprehensive site links section with all 9 pages for better crawlability and internal link equity
- Homepage: wrap stats section numbers in proper semantic markup; add `<Link>` from Blog section to /blog page; add link from Why Choose Us section to /why-choose-us
- Products page: add contextual links to /wholesale, /contact, /why-choose-us in body text
- Wholesale page: add contextual links to /products, /gallery, /contact
- Why Choose Us page: add contextual links to /products, /wholesale, /contact
- Global Markets page: add contextual links to /wholesale, /products, /contact
- Gallery page: add contextual links to /products, /contact
- About page: add contextual links to /products, /wholesale, /why-choose-us
- Blog page: add contextual links to /products, /wholesale, /contact within blog listing intro
- Contact page: add contextual links to /products, /gallery, /wholesale

### Remove
- None

## Implementation Plan
1. Update `index.html` — add CSP meta tag, complete twitter:site, delay Tawk.to with setTimeout for performance
2. Update `Footer.tsx` — add a site links grid at bottom with all 9 pages for internal link equity
3. Update all 9 page files — fix duplicate headings, add lazy loading + width/height to images, add 3+ contextual internal links per page
4. Update `NotFound.tsx` (404 page) — add noindex meta tag
5. Validate build
