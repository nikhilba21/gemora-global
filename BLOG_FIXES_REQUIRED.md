# Blog Pages - Critical Issues & Fixes Required

## Issue 1: Broken Image Links
**Problem:** Many blog posts reference images that don't exist:
- `/assets/generated/blog-trends-2026.dim_800x500.jpg`
- `/assets/generated/blog-wholesale-import.dim_800x500.jpg`
- `/assets/generated/blog-global-markets.dim_800x500.jpg`
- etc.

**Impact:** Blog pages appear broken/incomplete without featured images

**Solution:**
1. Generate or source high-quality images for all blog posts
2. Use Unsplash fallback images (already used in some posts)
3. Update blogStore.ts with proper image URLs
4. Implement image lazy-loading with fallback

---

## Issue 2: Missing Internal Linking & Cross-References
**Problem:** Blog posts don't link to related content
- No "Related Posts" optimization
- No internal keyword linking
- No cross-category linking

**Solution:**
1. Add internal links within blog content HTML
2. Implement "Related Posts" section showing 3-5 similar articles
3. Link to product pages where relevant
4. Link between export guides, buyer guides, market trends

---

## Issue 3: Keyword Coverage Gaps
**Missing keyword-focused blogs:**
- "bulk jewellery orders"
- "custom jewellery manufacturing"
- "jewellery wholesale pricing India"
- "imitation jewellery compliance"
- "jewelry export licenses India"
- "gemora global reviews"
- "best jewellery suppliers Jaipur"

**Solution:** Create 10-15 additional blog posts targeting these keywords

---

## Issue 4: Admin Blank Screen
**Error:** `(i ?? []).slice is not a function`

**Location:** `src/frontend/src/pages/admin/AdminCMS.tsx`

**Fix:**
```typescript
// Add defensive type checking before .slice()
if (Array.isArray(data)) {
  // process array
} else if (data && typeof data === 'object') {
  // handle object case
}
```

---

## Issue 5: Blog Individual Page Blank
**Problem:** `/blog/:slug` routes showing blank pages

**Likely causes:**
1. API response type mismatch (returning object instead of array)
2. Missing slug in database
3. Incomplete blog post data

**Check files:**
- `src/frontend/src/pages/BlogPost.tsx` - Line 50-67
- Backend API response format in `backend-node/src/routes/blog.js`

---

## Issue 6: Product Detail Page Error
**Error:** "product not found"

**Solution:**
1. Verify product slugs in database
2. Check product route matching logic
3. Add fallback product listing

---

## Priority Fixes (In Order)

### High Priority (Fix Today)
- [ ] Fix admin blank screen issue (type guard on array slice)
- [ ] Fix blog individual page blank (API response format)
- [ ] Fix product detail 404 (verify slugs/routes)

### Medium Priority (Fix This Week)
- [ ] Replace all broken image links with working URLs
- [ ] Add internal linking between blog posts
- [ ] Implement "Related Posts" widget

### Low Priority (Ongoing)
- [ ] Create 10-15 new keyword-focused blog posts
- [ ] Optimize existing blog content for SEO
- [ ] Add blog categories/tags system

---

## Blog Images Needed

Create/source images for:
1. blog-trends-2026 (imitation jewellery trends)
2. blog-wholesale-import (wholesale sourcing)
3. blog-global-markets (global market trends)
4. blog-bridal-collections (bridal jewellery)
5. blog-moq-guide (MOQ explanation)
6. blog-anti-tarnish (anti-tarnish technology)
7. blog-usa-boutiques (US market)
8. blog-private-label (private label)

**Recommendation:** Use Unsplash CC0 images or generate with AI

---

## Internal Linking Strategy

### Blog Post Categories to Link:
- **Export Guides** → **Buyer Guides** → **Product Guides**
- **Market Trends** → **Country Strategy**
- **Pricing** → **Supplier Info**
- **Quality** → **Packaging**
- **Online Selling** → **Product Guides**

### Example Internal Links to Add:
```html
<p>
  Learn more about <a href="/blog/moq-explained-wholesale-jewellery-buyers">MOQ pricing</a>
  and <a href="/blog/how-to-choose-right-imitation-jewellery-supplier">supplier selection</a>.
</p>
```

---

## Next Steps

1. **Immediate:** Fix admin/blog blank screen issues
2. **This week:** Source/create missing images
3. **Next week:** Add internal linking to all blog posts
4. **Ongoing:** Create 2-3 new blog posts weekly targeting keywords

