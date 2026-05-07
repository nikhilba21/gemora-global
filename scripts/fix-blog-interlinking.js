#!/usr/bin/env node
/**
 * Blog Post Fixer Script
 * Fixes:
 * 1. Images - Replaces unsplash URLs with proper product/category images
 * 2. Internal Linking - Adds links to product pages and other blogs
 * 3. Content Enhancement - Improves SEO and user experience
 */

const fs = require('fs');
const path = require('path');

// Image mapping by category
const imageMap = {
  'Trends': '/assets/generated/blog-trends-2026.dim_800x500.jpg',
  'Export Guides': '/assets/generated/blog-export-guide.dim_800x500.jpg',
  'Business Guide': '/assets/generated/blog-business-guide.dim_800x500.jpg',
  'Market Trends': '/assets/generated/blog-market-trends.dim_800x500.jpg',
  'Country Guide': '/assets/generated/blog-country-guide.dim_800x500.jpg',
  'Buyer Guides': '/assets/generated/blog-buyer-guide.dim_800x500.jpg',
  'Export Tips': '/assets/generated/blog-export-tips.dim_800x500.jpg',
  'Country Strategy': '/assets/generated/blog-country-strategy.dim_800x500.jpg',
  'Product Guide': '/assets/generated/blog-product-guide.dim_800x500.jpg',
  'Pricing': '/assets/generated/blog-pricing-guide.dim_800x500.jpg',
  'Supplier Info': '/assets/generated/blog-supplier-info.dim_800x500.jpg',
  'Quality': '/assets/generated/blog-quality-guide.dim_800x500.jpg',
  'Packaging': '/assets/generated/blog-packaging.dim_800x500.jpg',
  'Online Selling': '/assets/generated/blog-online-selling.dim_800x500.jpg',
  'Collections': '/assets/generated/blog-collections.dim_800x500.jpg',
  'Education': '/assets/generated/blog-education.dim_800x500.jpg',
  'Gifting': '/assets/generated/blog-gifting.dim_800x500.jpg',
  'Diamonds': '/assets/generated/blog-diamonds.dim_800x500.jpg',
  'Care': '/assets/generated/blog-care.dim_800x500.jpg',
  'Manufacturing': '/assets/generated/blog-manufacturing.dim_800x500.jpg',
  'Product Care': '/assets/generated/blog-product-care.dim_800x500.jpg',
  'Industry Insights': '/assets/generated/blog-insights.dim_800x500.jpg',
  'Industry Trends': '/assets/generated/blog-industry-trends.dim_800x500.jpg',
  'Export News': '/assets/generated/blog-export-news.dim_800x500.jpg',
};

// Internal linking patterns by keyword
const internalLinkPatterns = [
  {
    keywords: ['kundan', 'kundan jewellery'],
    link: '/products?category=kundan',
    text: 'Kundan Jewellery Collection',
  },
  {
    keywords: ['oxidized', 'oxidised', 'antique jewellery'],
    link: '/products?category=oxidized',
    text: 'Oxidized Jewellery',
  },
  {
    keywords: ['american diamond', 'cz', 'cubic zirconia'],
    link: '/products?category=american-diamond',
    text: 'American Diamond Jewellery',
  },
  {
    keywords: ['meenakari', 'enamel'],
    link: '/products?category=meenakari',
    text: 'Meenakari Jewellery',
  },
  {
    keywords: ['temple jewellery'],
    link: '/products?category=temple',
    text: 'Temple Jewellery',
  },
  {
    keywords: ['bridal', 'wedding'],
    link: '/products?category=bridal',
    text: 'Bridal Jewellery Collections',
  },
  {
    keywords: ['earring', 'earrings'],
    link: '/products?category=earrings',
    text: 'Earrings Collection',
  },
  {
    keywords: ['necklace', 'pendant'],
    link: '/products?category=necklaces',
    text: 'Necklace Sets',
  },
  {
    keywords: ['bangle', 'bracelet'],
    link: '/products?category=bangles',
    text: 'Bangles & Bracelets',
  },
  {
    keywords: ['export', 'wholesale', 'supplier'],
    link: '/export-markets',
    text: 'Export & Wholesale',
  },
  {
    keywords: ['jaipur', 'manufacturer'],
    link: '/about',
    text: 'About Gemora Global',
  },
  {
    keywords: ['usa', 'america', 'american'],
    link: '/export-markets/usa',
    text: 'USA Export Guide',
  },
  {
    keywords: ['uk', 'united kingdom', 'britain'],
    link: '/export-markets/uk',
    text: 'UK Export Guide',
  },
  {
    keywords: ['uae', 'dubai', 'gulf'],
    link: '/export-markets/uae',
    text: 'UAE Export Guide',
  },
  {
    keywords: ['australia', 'sydney'],
    link: '/export-markets/australia',
    text: 'Australia Export Guide',
  },
  {
    keywords: ['europe', 'germany', 'france'],
    link: '/export-markets/eu',
    text: 'EU Export Guide',
  },
  {
    keywords: ['africa', 'nigeria', 'south africa'],
    link: '/export-markets/africa',
    text: 'African Markets',
  },
  {
    keywords: ['bulk', 'moq', 'minimum order'],
    link: '/wholesale',
    text: 'Wholesale Pricing',
  },
  {
    keywords: ['compliance', 'cpsc', 'reach', 'lead-free', 'nickel-free'],
    link: '/compliance',
    text: 'Compliance & Standards',
  },
];

/**
 * Replace image URL with category-appropriate image
 */
function fixImageUrl(category) {
  return imageMap[category] || '/assets/generated/blog-default.dim_800x500.jpg';
}

/**
 * Add internal links to content based on keywords
 */
function addInternalLinks(content, title, category) {
  if (!content) return content;

  let enhanced = content;
  const titleLower = title.toLowerCase();
  const contentLower = enhanced.toLowerCase();

  // Track which patterns have been added to avoid duplicates
  const addedLinks = new Set();

  for (const pattern of internalLinkPatterns) {
    // Check if any keyword matches title or early content
    const hasKeyword = pattern.keywords.some(
      (kw) => titleLower.includes(kw) || contentLower.substring(0, 500).includes(kw)
    );

    if (hasKeyword && !addedLinks.has(pattern.link)) {
      // Check if link already exists in content
      if (!enhanced.includes(`href="${pattern.link}"`)) {
        // Add link once in first relevant paragraph
        const linkHtml = `<a href="${pattern.link}">${pattern.text}</a>`;

        // Insert after first <h2> or at start if no h2
        const h2Index = enhanced.indexOf('<h2>');
        if (h2Index > -1) {
          const h2EndIndex = enhanced.indexOf('</h2>', h2Index) + 5;
          const nextParagraph = enhanced.indexOf('<p>', h2EndIndex);
          if (nextParagraph > -1) {
            const nextP EndIndex = enhanced.indexOf('</p>', nextParagraph);
            enhanced = 
              enhanced.substring(0, nextPEndIndex) +
              ` ${linkHtml}` +
              enhanced.substring(nextPEndIndex);
            addedLinks.add(pattern.link);
          }
        }
      }
    }
  }

  return enhanced;
}

/**
 * Add related blog suggestions at end of content
 */
function addRelatedBlogsSection(content, category) {
  const relatedBlogsHtml = `
    <hr style="margin: 40px 0; border: none; border-top: 2px solid #e0e0e0;">
    <h2>Related Blog Posts</h2>
    <p>Explore more insights from our blog:</p>
    <ul style="margin-left: 20px;">
      <li><a href="/blog?category=${encodeURIComponent(category)}">More ${category} Posts</a></li>
      <li><a href="/blog">View All Blog Posts</a></li>
    </ul>
  `;
  return content + relatedBlogsHtml;
}

/**
 * Main function to fix a blog post
 */
function fixBlogPost(post) {
  const fixed = { ...post };

  // 1. Fix image URL
  if (!fixed.image || fixed.image.includes('unsplash') || fixed.image.includes('images.unsplash')) {
    fixed.image = fixImageUrl(fixed.category);
  }

  // 2. Add internal links to content
  if (fixed.content) {
    fixed.content = addInternalLinks(fixed.content, fixed.title, fixed.category);
    
    // 3. Add related blogs section
    fixed.content = addRelatedBlogsSection(fixed.content, fixed.category);
  }

  return fixed;
}

/**
 * Read all blog batch files and apply fixes
 */
function fixAllBlogs() {
  const utilsDir = path.join(__dirname, '../src/frontend/src/utils');
  const files = fs.readdirSync(utilsDir).filter((f) => f.match(/blogBatch\d+\.ts$/));

  console.log(`Found ${files.length} blog batch files to process...`);

  let totalFixed = 0;
  const errors = [];

  for (const file of files) {
    try {
      const filePath = path.join(utilsDir, file);
      let content = fs.readFileSync(filePath, 'utf-8');

      // Parse the export statement - simplified approach
      // This is a basic regex that extracts blog posts
      const regex = /export const (BLOG_BATCH_\d+)[^=]*=\s*\[([\s\S]*?)\];/;
      const match = content.match(regex);

      if (match) {
        // Count posts in this batch (rough estimate)
        const batchContent = match[2];
        const postCount = (batchContent.match(/id:/g) || []).length;
        
        console.log(`  ${file}: ~${postCount} posts`);
        totalFixed += postCount;
      }
    } catch (error) {
      errors.push({ file, error: error.message });
    }
  }

  console.log(`\n✅ Total blog posts to fix: ${totalFixed}`);
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors encountered:`);
    errors.forEach((e) => console.log(`  - ${e.file}: ${e.error}`));
  }

  console.log(`\nNext steps:`);
  console.log(`1. Manually review and update image URLs in /public/assets/generated/`);
  console.log(`2. Run this fixer programmatically in your build process`);
  console.log(`3. Update blog content generation to use this fixer`);
}

// Run the fixer
fixAllBlogs();

module.exports = { fixBlogPost, fixImageUrl, addInternalLinks };
