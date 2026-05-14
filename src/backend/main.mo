import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";



actor {
  type Category = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    sortOrder : Int;
  };

  module Category {
    public func compare(a : Category, b : Category) : Order.Order {
      Int.compare(a.sortOrder, b.sortOrder);
    };
  };

  type Product = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    moq : Text;
    imageUrls : [Text];
    featured : Bool;
    isNewArrival : Bool;
    createdAt : Int;
    sku : ?Text;
    subcategory : ?Text;
    color : ?Text;
    keyFeatures : ?Text;
  };

  type Inquiry = {
    id : Nat;
    name : Text;
    country : Text;
    whatsapp : Text;
    requirement : Text;
    productId : ?Nat;
    createdAt : Int;
    status : Text; // new, read, replied
    source : ?Text; // Website, WhatsApp, LinkedIn, etc.
    qualified : ?Bool;
    pipelineStage : ?Text; // New, Contacted, Negotiation, etc.
  };

  type Customer = {
    id : Nat;
    name : Text;
    company : Text;
    country : Text;
    email : Text;
    whatsapp : Text;
    businessType : Text;
    creditLimit : Text;
    accountManager : Text;
    notes : Text;
    tags : [Text];
    createdAt : Int;
  };

  type OrderItem = {
    name : Text;
    qty : Text;
    price : Text;
  };

  type Order = {
    id : Nat;
    orderId : Text; // e.g. ORD-001
    buyer : Text;
    company : Text;
    email : Text;
    phone : Text;
    country : Text;
    address : Text;
    amount : Text;
    currency : Text;
    paymentMethod : Text;
    orderType : Text; // B2B or B2C
    status : Text;
    trackingNumber : Text;
    courier : Text;
    items : [OrderItem];
    notes : Text;
    createdAt : Int;
  };

  type GalleryItem = {
    id : Nat;
    imageUrl : Text;
    caption : Text;
    itemType : Text;
    sortOrder : Int;
  };

  module GalleryItem {
    public func compare(a : GalleryItem, b : GalleryItem) : Order.Order {
      Int.compare(a.sortOrder, b.sortOrder);
    };
  };

  type Testimonial = {
    id : Nat;
    name : Text;
    company : Text;
    country : Text;
    text : Text;
    rating : Nat;
    active : Bool;
  };

  module Testimonial {
    public func compareByRating(a : Testimonial, b : Testimonial) : Order.Order {
      Nat.compare(a.rating, b.rating);
    };
  };

  type BlogPost = {
    id : Nat;
    slug : Text;
    title : Text;
    category : Text;
    excerpt : Text;
    author : Text;
    date : Text;
    readTime : Text;
    status : Text;
    image : Text;
    content : Text;
    createdAt : Int;
  };

  module BlogPost {
    public func compareByDate(a : BlogPost, b : BlogPost) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  type Catalogue = {
    id : Nat;
    title : Text;
    description : Text;
    fileUrl : Text;
    fileName : Text;
    uploadedAt : Text;
    createdAt : Int;
  };

  module Catalogue {
    public func compareByDate(a : Catalogue, b : Catalogue) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  public type UserProfile = {
    name : Text;
    company : Text;
    country : Text;
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  include MixinObjectStorage();

  // Admin password-based auth
  var adminUsername : Text = "admin";
  var adminPassword : Text = "Gemora@2024";

  public query func verifyAdminLogin(username : Text, password : Text) : async Bool {
    Text.equal(username, adminUsername) and Text.equal(password, adminPassword);
  };

  public shared func changeAdminCredentials(currentUsername : Text, currentPassword : Text, newUsername : Text, newPassword : Text) : async Bool {
    if (Text.equal(currentUsername, adminUsername) and Text.equal(currentPassword, adminPassword)) {
      adminUsername := newUsername;
      adminPassword := newPassword;
      true;
    } else {
      false;
    };
  };

  // Persistent data structures
  let categoriesMap = Map.empty<Nat, Category>();
  let productsMap = Map.empty<Nat, Product>();
  let inquiriesMap = Map.empty<Nat, Inquiry>();
  let galleryItemsMap = Map.empty<Nat, GalleryItem>();
  let testimonialsMap = Map.empty<Nat, Testimonial>();
  let contentEntries = Map.empty<Text, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let blogPostsMap = Map.empty<Nat, BlogPost>();
  let cataloguesMap = Map.empty<Nat, Catalogue>();
  let customersMap = Map.empty<Nat, Customer>();
  let ordersMap = Map.empty<Nat, Order>();

  var nextCategoryId = 1;
  var nextProductId = 1;
  var nextInquiryId = 1;
  var nextGalleryItemId = 1;
  var nextTestimonialId = 1;
  var nextBlogPostId = 1;
  var nextCatalogueId = 1;
  var nextCustomerId = 1;
  var nextOrderId = 1;
  var categoryMigrationV2Done = false;
  var blogSeedV2Done = false;

  // Category definitions matching the Kanhai seed data categoryId mapping
  let SEED_CATEGORIES = [
    (1, "Ear Chains", "Stunning ear chain collections — American diamond, antique, rhodium, gold plated ear chains", "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg", 1),
    (2, "Earrings", "Exquisite earring collections — jhumkas, jhumkis, studs, chandelier drops, moti earrings, earcuffs", "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg", 2),
    (3, "Bangles & Bracelets", "Elegant gold-plated bangle sets, kada, bracelets and stackable designs", "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg", 3),
    (4, "Rings", "Statement cocktail rings, finger rings, adjustable fashion rings for every occasion", "/assets/generated/jewellery-rings-hd.dim_800x800.jpg", 4),
    (5, "Bridal Jewellery", "Complete bridal jewellery sets — kundan, polki, meenakari bridal sets for weddings", "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg", 5),
    (6, "Minimal Fashion", "Modern minimalist fashion jewellery — layered chains, dainty pieces for western boutiques", "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg", 6),
    (7, "Necklaces & Pendants", "Exquisite handcrafted necklaces — kundan, polki, layered chains, chokers, pendant sets", "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg", 7),
    (8, "Anklets & Waist Chains", "Payal, anklets, hath pan, baju band and body jewellery", "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg", 8),
    (9, "Sets & Collections", "Complete jewellery sets — necklace, earring, maang tikka, bangles combinations", "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg", 9),
  ];

  // Seed initial data if empty
  do {
    if (categoriesMap.size() == 0) {
      // Categories match the categoryId values used in the Kanhai seed data (1-9)
      for ((id, name, desc, img, order) in SEED_CATEGORIES.vals()) {
        categoriesMap.add(id, { id; name; description = desc; imageUrl = img; sortOrder = order });
        if (id >= nextCategoryId) { nextCategoryId := id + 1 };
      };
    };

    // Migration v2: fix category names to match seed data categoryId mapping
    if (not categoryMigrationV2Done) {
      for ((id, name, desc, img, order) in SEED_CATEGORIES.vals()) {
        switch (categoriesMap.get(id)) {
          case (?existing) {
            // Only overwrite if the name doesn't match (i.e., old wrong data)
            if (not Text.equal(existing.name, name)) {
              categoriesMap.add(id, { id; name; description = desc; imageUrl = img; sortOrder = order });
            };
          };
          case null {
            categoriesMap.add(id, { id; name; description = desc; imageUrl = img; sortOrder = order });
            if (id >= nextCategoryId) { nextCategoryId := id + 1 };
          };
        };
      };
      categoryMigrationV2Done := true;
    };

    if (productsMap.size() == 0) {
      // No sample products seeded — admin can add products via the admin panel
      ();
    };

    if (testimonialsMap.size() == 0) {
      let tests = [
        ("Fatima Al-Hassan", "Al-Noor Boutique", "UAE", "Outstanding quality and prompt delivery. Our customers love Gemora's designs!", 5),
        ("Marie Dubois", "Paris Bijoux", "France", "Best imitation jewellery exporter we have worked with. Consistent quality every order.", 5),
        ("Sarah Johnson", "NYC Accessories", "USA", "Gemora's bridal sets are our top sellers. The craftsmanship is exceptional for the price.", 5),
        ("Ahmed Al-Rashidi", "Gulf Wholesale", "Kuwait", "Fast shipping, competitive pricing, professional team. Highly recommended.", 4),
      ];
      for ((name, company, country, text, rating) in tests.vals()) {
        testimonialsMap.add(nextTestimonialId, { id = nextTestimonialId; name; company; country; text; rating; active = true });
        nextTestimonialId += 1;
      };
    };

    if (galleryItemsMap.size() == 0) {
      // No gallery items seeded — admin can add photos via the admin panel
      ();
    };

    if (blogPostsMap.size() == 0) {
      let posts = [
        ("top-imitation-jewellery-trends-2026", "Top Imitation Jewellery Trends to Watch in 2026", "Trends",
          "From bold layered necklaces to minimalist ear cuffs, discover the hottest imitation jewellery styles dominating international markets this year.",
          "Priya Sharma", "March 10, 2026", "5 min read", "Published",
          "/assets/generated/blog-trends-2026.dim_800x500.jpg",
          "The global fashion jewellery market is seeing a dramatic shift in 2026. Consumers are moving away from single-statement pieces toward layered, storytelling looks that blend multiple textures and finishes. Indian manufacturers are at the forefront of this trend, producing collections that fuse traditional craftsmanship with modern silhouettes.\n\nOxidised silver pieces continue to dominate European and Middle Eastern wholesale orders. Their antique finish resonates with buyers seeking authentic, handcrafted aesthetics at accessible price points. Gemora Global's latest oxidised line has seen a 40% surge in international inquiries since its launch.\n\nColour-stone statement earrings are commanding premium shelf space in boutiques across France, the UK, and the UAE. These high-drama pieces photograph beautifully, making them social-media favourites and driving impulse purchases online."),
        ("how-to-start-jewellery-wholesale-import-business", "How to Start a Jewellery Wholesale Import Business", "Business Guide",
          "A step-by-step roadmap for boutique owners and distributors looking to source premium imitation jewellery from India's top manufacturers.",
          "Rahul Mehta", "February 28, 2026", "7 min read", "Published",
          "/assets/generated/blog-wholesale-import.dim_800x500.jpg",
          "Starting a jewellery wholesale import business can be one of the most rewarding ventures in the fashion retail sector. India supplies over 60% of the world's imitation jewellery, offering unmatched variety, quality, and competitive pricing.\n\nThe first step is identifying a reliable manufacturer with verified export credentials. Look for suppliers with GST registration, an IEC (Import Export Code), and a track record of international shipments.\n\nMinimum Order Quantities (MOQs) vary significantly between manufacturers. Most reputable Indian exporters set MOQs between 50 and 200 pieces per design. Negotiate sample orders first — a professional manufacturer will ship samples within 7-10 working days."),
        ("why-indian-imitation-jewellery-dominates-global-markets", "Why Indian Imitation Jewellery Dominates Global Markets", "Industry Insights",
          "Explore why India's imitation jewellery industry has become the go-to source for boutiques and distributors across 50+ countries.",
          "Neha Gupta", "February 14, 2026", "6 min read", "Published",
          "/assets/generated/blog-global-markets.dim_800x500.jpg",
          "India's dominance in the global imitation jewellery market is no accident. It is the result of decades of accumulated craft knowledge, investment in manufacturing infrastructure, and a deep understanding of international buyer preferences.\n\nThe Jaipur cluster alone accounts for over 30% of India's jewellery exports, producing everything from Kundan and Meenakari pieces to contemporary minimalist designs.\n\nFor international buyers, sourcing from India offers a compelling combination: factory-direct pricing, an enormous breadth of designs updated seasonally, and the flexibility to customise pieces for private-label requirements."),
        ("bridal-jewellery-collections-international-buyers", "Bridal Jewellery Collections: What International Buyers Want", "Collections",
          "Discover what wholesale buyers from the UAE, UK, and USA are seeking in bridal jewellery collections for 2026.",
          "Ananya Patel", "January 30, 2026", "5 min read", "Published",
          "/assets/generated/blog-bridal-sets.dim_800x500.jpg",
          "Bridal jewellery remains one of the highest-margin categories in the imitation jewellery segment. International buyers are actively sourcing bridal sets that blend traditional Indian aesthetics with contemporary finishing.\n\nThe most requested pieces include kundan-style choker sets, layered necklaces with matching earrings and maang-tikka, and temple-inspired bangles in gold and pearl finishes.\n\nFor wholesale buyers, the key differentiator is anti-tarnish coating — a non-negotiable requirement for most international markets due to humidity and climate considerations."),
        ("export-jewellery-india-usa-guide", "Export Jewellery from India to USA: Complete Guide", "Export Tips",
          "Everything you need to know about exporting imitation jewellery from India to the United States — regulations, shipping, and finding buyers.",
          "Vikram Singh", "January 15, 2026", "6 min read", "Published",
          "/assets/generated/blog-usa-boutiques.dim_800x500.jpg",
          "The USA is one of the largest importers of Indian imitation jewellery, with demand driven by a diverse consumer base and a thriving boutique retail sector. For Indian exporters, this represents a massive and growing opportunity.\n\nTo export jewellery from India to the USA, you need a valid IEC (Import Export Code), compliance with US Customs and Border Protection regulations, and proper HS code classification for your products.\n\nMost Indian jewellery exports to the USA fall under HS code 7117, which covers imitation jewellery. Duties typically range from 0% to 11% depending on materials and design. Working with a licensed customs broker on the US side is highly recommended for first-time exporters."),
        ("private-label-jewellery-india-guide", "Private Label Jewellery Manufacturing in India", "Business Guide",
          "How boutiques and brands can create their own private label jewellery collections with Indian manufacturers.",
          "Deepika Rao", "December 20, 2025", "5 min read", "Published",
          "/assets/generated/blog-private-label.dim_800x500.jpg",
          "Private label jewellery is one of the fastest-growing segments in the global fashion accessories market. For boutique owners and retailers, having your own branded jewellery collection creates loyalty, higher margins, and a unique market position.\n\nIndia is the world's leading destination for private label jewellery manufacturing. With low MOQs, skilled artisans, and complete customisation capabilities, Indian manufacturers can bring your vision to life at a fraction of the cost of domestic production in Western markets.\n\nGemora Global offers full private label services including custom design, logo engraving, branded packaging, and drop shipping for international clients. Our minimum for private label orders starts at just 100 pieces per design."),
      ];
      for ((slug, title, category, excerpt, author, date, readTime, status, image, content) in posts.vals()) {
        blogPostsMap.add(nextBlogPostId, { id = nextBlogPostId; slug; title; category; excerpt; author; date; readTime; status; image; content; createdAt = 0 });
        nextBlogPostId += 1;
      };
    };

    // Blog seed v2: add all 100 batch blogs (IDs 101–200) that were only in frontend blogStore.ts
    if (not blogSeedV2Done) {
      let batchBlogs = [
        // --- Batch 1: IDs 101–110 ---
        (101, "best-imitation-jewellery-manufacturer-india", "Best Imitation Jewellery Manufacturer in India", "Manufacturing", "India leads global imitation jewellery manufacturing with Jaipur at its heart.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>India: The World's Leading Imitation Jewellery Manufacturer</h2><p>India has long been recognized as the global leader in imitation jewellery manufacturing. With over 400 years of craftsmanship heritage, cities like Jaipur have evolved into world-class production hubs that export to 50+ countries. Indian manufacturers combine traditional artistry with modern manufacturing techniques to produce jewellery that rivals fine jewellery in appearance at a fraction of the cost.</p><h2>Jaipur's Jewellery Manufacturing Legacy</h2><p>Jaipur, known as the Pink City, is the undisputed capital of imitation jewellery in India. The city's artisans specialize in kundan, meenakari, polki, and gold-plated designs that are prized worldwide. With over 5,000 jewellery manufacturing units, Jaipur produces everything from bridal sets to everyday fashion pieces for global retailers and boutiques.</p><h2>Why Choose Gemora Global</h2><p>At Gemora Global, we offer MOQ from just 50 units with anti-tarnish coating on all pieces. Our factory in Jaipur produces 500+ designs across all jewellery categories. Explore our full collection at our products page.</p>"),
        (102, "top-fashion-jewellery-exporter-india", "Top Fashion Jewellery Exporter from India", "Export", "India exports fashion jewellery to 50+ countries, making it the world's top supplier.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>India's Fashion Jewellery Export Industry</h2><p>India's fashion jewellery export industry is valued at over $3 billion annually and growing at 12% year-on-year. The country exports to more than 50 nations, with the UAE, USA, UK, Europe, and Australia being the top destinations. Indian exporters have earned a global reputation for delivering trend-forward, high-quality pieces at competitive wholesale prices.</p><h2>Why Indian Exporters Dominate Global Markets</h2><p>Indian fashion jewellery exporters offer an unbeatable combination of design diversity, skilled craftsmanship, and cost competitiveness. A piece that retails for $30 in the USA can be sourced wholesale from India for $3-$5, giving retailers a 500%+ markup opportunity.</p>"),
        (103, "wholesale-imitation-jewellery-suppliers-jaipur", "Wholesale Imitation Jewellery Suppliers in Jaipur", "Wholesale", "Jaipur is India's jewellery capital with hundreds of wholesale suppliers catering to global buyers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>Jaipur: India's Jewellery Capital</h2><p>Jaipur's Johari Bazaar has been the heart of India's jewellery trade for over 400 years. Today, the city is home to thousands of manufacturers and wholesale suppliers offering every style — from traditional kundan and meenakari to contemporary oxidised and gold-plated fashion jewellery. International buyers from the UAE, UK, USA, and Europe regularly visit Jaipur to source directly from manufacturers.</p><h2>Types of Imitation Jewellery Available Wholesale</h2><ul><li>Kundan Jewellery: Traditional Rajasthani style with glass stones set in gold foil</li><li>Meenakari: Colourful enamel work on brass or silver-toned base metals</li><li>Oxidised Jewellery: Antique-finish silver-toned pieces, hugely popular globally</li><li>Gold Plated: Brass base with thick gold plating for a premium look</li></ul>"),
        (104, "bulk-fashion-jewellery-manufacturer-global-buyers", "Bulk Fashion Jewellery Manufacturer for Global Buyers", "Manufacturing", "Indian bulk manufacturers cater to global buyers with flexible MOQs and competitive pricing tiers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800&h=500&fit=crop", "<h2>What Global Buyers Need from Bulk Manufacturers</h2><p>Global buyers — from boutique owners in Paris to Amazon sellers in New York — share common requirements when sourcing bulk fashion jewellery: consistent quality across large orders, flexible minimum order quantities, ability to customize designs, and reliable shipping timelines. Indian bulk manufacturers, particularly those in Jaipur, have refined their operations over decades to meet exactly these needs.</p><h2>Competitive Pricing Tiers for Bulk Orders</h2><ul><li>50-100 pieces: Standard wholesale price per piece</li><li>101-500 pieces: 10-15% discount on standard price</li><li>501-1,000 pieces: 20-25% discount plus priority production</li><li>1,000+ pieces: Custom pricing plus dedicated account manager</li></ul>"),
        (105, "indian-costume-jewellery-exporter-retailers", "Indian Costume Jewellery Exporter for Retailers", "Export", "Retailers worldwide achieve 200%+ markups by sourcing costume jewellery directly from Indian exporters.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=500&fit=crop", "<h2>Why Retailers Choose Indian Costume Jewellery</h2><p>Retailers across the USA, UK, and Europe are discovering that sourcing costume jewellery directly from Indian exporters is one of the highest-margin retail strategies available. With wholesale prices ranging from $1.50 to $8 per piece and typical retail prices of $15-$50, retailers regularly achieve 200-500% markups. Indian manufacturers produce trend-driven designs that match what consumers are buying in real-time.</p><h2>Popular Categories for Retail Buyers</h2><p>The best-selling categories for international retailers include gold-plated necklace sets, oxidised earrings, kundan bridal sets, and minimalist everyday pieces. Gemora Global updates its collection quarterly with trend-forecasted designs to keep your inventory fresh and your customers returning.</p>"),
        (106, "how-to-import-imitation-jewellery-from-india", "How to Import Imitation Jewellery from India", "Import Guide", "A step-by-step import guide makes sourcing imitation jewellery from India simple and profitable.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&h=500&fit=crop", "<h2>Step-by-Step Guide to Importing Imitation Jewellery from India</h2><p>Importing imitation jewellery from India is straightforward once you understand the process. Thousands of retailers and boutiques worldwide do it profitably every month.</p><ul><li>Step 1 - Find a Verified Supplier: Research manufacturers on IndiaMART, Alibaba, or contact directly via WhatsApp</li><li>Step 2 - Request Samples: Order 5-10 sample pieces to verify quality before committing to bulk</li><li>Step 3 - Negotiate MOQ and Price: Confirm minimum order quantity, pricing tiers, and payment terms</li><li>Step 4 - Place Bulk Order: Pay 30-50% advance to initiate production (typically 2-4 weeks)</li><li>Step 5 - Shipping: Choose air freight (fast, higher cost) or sea freight (economical for large volumes)</li><li>Step 6 - Customs Clearance: File import declaration with correct HS code and pay applicable duties</li></ul>"),
        (107, "why-buy-fashion-jewellery-indian-manufacturers", "Why Buy Fashion Jewellery from Indian Manufacturers", "Buyer Guide", "Indian manufacturers offer unbeatable cost, design variety, and quality that no other country can match.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=500&fit=crop", "<h2>7 Reasons to Source Fashion Jewellery from India</h2><p>Buyers from over 50 countries choose Indian fashion jewellery manufacturers over alternatives in China, Turkey, or Thailand. The combination of price advantage, design heritage, and production flexibility makes India the obvious choice for serious wholesale buyers and boutique owners.</p><ul><li>1. Cost Advantage: Wholesale prices are 60-70% lower than equivalent pieces in Western markets</li><li>2. Design Variety: 500+ designs updated quarterly - ethnic, contemporary, bridal, minimal, and boho</li><li>3. Skilled Craftsmanship: Generations of jewellery-making expertise in cities like Jaipur</li><li>4. Fast Production: Standard orders fulfilled in 2-4 weeks from confirmation</li><li>5. Customization: OEM and private label services for brand-building buyers</li><li>6. Quality Standards: Anti-tarnish coating, nickel-free options, and 3-stage QC</li><li>7. Global Shipping: Experienced export teams handling documentation and customs</li></ul>"),
        (108, "trusted-imitation-jewellery-wholesale-supplier-worldwide", "Trusted Imitation Jewellery Wholesale Supplier Worldwide", "Wholesale", "Finding a trusted wholesale supplier requires careful verification and starting with small trial orders.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=500&fit=crop", "<h2>How to Identify a Trusted Wholesale Supplier</h2><p>With thousands of jewellery suppliers claiming to be the best, identifying truly trustworthy wholesale partners requires due diligence. Experienced buyers look for specific trust signals before placing their first bulk order. The cost of a bad supplier — delayed shipments, poor quality, or outright scams — far outweighs the effort of proper verification.</p><h2>Red Flags to Watch Out For</h2><ul><li>No physical address or factory location listed</li><li>Unwilling to provide samples before bulk order</li><li>Prices suspiciously below market rates</li><li>No export history or references from other buyers</li><li>Demands 100% advance payment with no protections</li></ul>"),
        (109, "oem-fashion-jewellery-manufacturer-india", "OEM Fashion Jewellery Manufacturer in India", "Manufacturing", "OEM manufacturing lets brands produce unique jewellery designs at scale with Indian manufacturers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=500&fit=crop", "<h2>What is OEM Jewellery Manufacturing?</h2><p>OEM (Original Equipment Manufacturer) jewellery manufacturing means the buyer provides the design specifications and the manufacturer produces those exact designs at scale. This is different from buying from a manufacturer's existing catalogue. OEM is ideal for brands, designers, and large retailers who want unique pieces that competitors cannot easily copy.</p><h2>The OEM Process with Indian Manufacturers</h2><p>The OEM process starts with the buyer submitting design files (CAD, sketches, or physical samples). The manufacturer creates a prototype within 7-14 days. After buyer approval, production begins on the agreed quantity. Indian OEM manufacturers typically require MOQ of 500+ units per design, with lead times of 4-8 weeks depending on complexity.</p>"),
        (110, "private-label-imitation-jewellery-exporter", "Private Label Imitation Jewellery Exporter", "Private Label", "Private label jewellery lets boutiques sell under their own brand with Indian manufacturer backing.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>What is Private Label Jewellery?</h2><p>Private label jewellery means selling products manufactured by another company under your own brand name. Instead of creating designs from scratch, you select from an established manufacturer's collection and apply your own branding — logo tags, custom packaging, and brand identity. This gives boutiques and online stores the look of a jewellery brand without the cost of full OEM manufacturing.</p><h2>Build Your Private Label Brand with Gemora Global</h2><p>Gemora Global offers complete private label services including custom logo tags, branded velvet pouches, printed gift boxes, and anti-tarnish packaging. With 500+ designs to choose from and MOQ starting at 500 units, we have helped boutiques in the UK, USA, and UAE build successful private label jewellery brands from scratch.</p>"),
        // --- Batch 2: IDs 111–120 ---
        (111, "wholesale-earrings-supplier-india", "Wholesale Earrings Supplier in India", "Product Categories", "India supplies the world's best variety of wholesale earrings — from jhumkas to minimal studs.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&h=500&fit=crop", "<h2>India's Wholesale Earring Market</h2><p>India is one of the world's largest wholesale earring suppliers, producing millions of pieces annually for export to the USA, UK, UAE, Australia, and beyond. Jaipur, in particular, is a hub for fashion earring manufacturing, combining traditional craftsmanship with modern design sensibilities to serve boutiques and retailers globally.</p><h2>Types of Wholesale Earrings Available</h2><ul><li>Jhumkas and Chandbali — Traditional Indian designs with global appeal</li><li>Studs and Minimal Earrings — CZ, pearl, and geometric styles for everyday wear</li><li>Hoops and Huggies — Gold plated and oxidised, from sleek to statement</li><li>Drop and Dangle Earrings — Perfect for party wear and occasion dressing</li><li>Ear Chains and Ear Cuffs — Trending Gen Z and Korean-inspired styles</li></ul>"),
        (112, "bulk-necklace-sets-manufacturer-india", "Bulk Necklace Sets Manufacturer India", "Product Categories", "Bulk necklace sets from India cover every style — from ethnic kundan to modern minimal designs.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=500&fit=crop", "<h2>India's Bulk Necklace Sets Industry</h2><p>India manufactures an extraordinary range of necklace sets for wholesale buyers worldwide. From intricate ethnic Kundan sets to sleek layered chain necklaces, Indian manufacturers cater to every retail segment — from high-street boutiques in London to ethnic jewellery stores in Dubai and bridal shops across North America.</p><h2>Types of Necklace Sets in Bulk</h2><ul><li>Choker Sets — Velvet, metal, and stone-studded; high demand in UK and USA markets</li><li>Kundan and Polki Sets — Ethnic bridal and festive sets with matching earrings</li><li>Layered Chain Necklaces — Minimal and boho styles popular in Western markets</li><li>Pendant Necklaces — Initial, coin, and charm pendants for gifting segments</li></ul>"),
        (113, "fashion-bangles-exporter-india", "Fashion Bangles Exporter India", "Product Categories", "India exports fashion bangles worldwide, with Jaipur leading production of gold-plated and oxidised sets.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1576022161797-e48b64e6bd1d?w=800&h=500&fit=crop", "<h2>India's Fashion Bangle Export Industry</h2><p>India is the world's leading exporter of fashion bangles, and Jaipur stands at the heart of this industry. With thousands of artisans and manufacturing units producing everything from simple metal kadas to intricate meenakari bangle sets, Indian exporters serve boutiques, ethnic stores, and online retailers across 40+ countries.</p><h2>Types of Fashion Bangles for Export</h2><ul><li>Gold Plated Bangle Sets — Classic 2-8 piece sets, high demand year-round</li><li>Oxidised Silver Bangles — Antique finish, trending in boho and ethnic fashion</li><li>Meenakari Bangles — Colourful enamel work on metal, popular for festive occasions</li><li>Stone-Studded Bangles — CZ, kundan, and glass-embellished for weddings</li></ul>"),
        (114, "imitation-rings-wholesale-supplier", "Imitation Rings Wholesale Supplier", "Product Categories", "Wholesale imitation rings from India offer boutiques 5-10x markup potential on trending styles.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=800&h=500&fit=crop", "<h2>Wholesale Imitation Rings from India</h2><p>The global fashion ring market is booming, and Indian manufacturers are perfectly positioned to serve it. Imitation rings from India are crafted on brass, zinc alloy, and stainless steel bases — offering boutiques and online retailers exceptional margins with wholesale prices typically 80-90% below retail.</p><h2>Popular Styles for Wholesale</h2><ul><li>Cocktail Rings — Bold, oversized CZ and stone-set rings for party wear</li><li>Stackable Rings — Thin bands sold in sets of 3-5, trending on Pinterest and Instagram</li><li>Adjustable Rings — Open-back designs; great for gifting with no sizing issue</li><li>American Diamond (CZ) Rings — Solitaire and cluster designs replicating fine jewellery</li></ul>"),
        (115, "bridal-jewellery-set-manufacturer-india", "Bridal Jewellery Set Manufacturer India", "Bridal", "India's bridal jewellery sets — from full Kundan to American Diamond — serve boutiques worldwide.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=500&fit=crop", "<h2>India's Bridal Jewellery Manufacturing Hub</h2><p>India is the world's largest producer of bridal imitation jewellery, serving wedding markets across the UK, Canada, USA, UAE, and Australia where South Asian diaspora communities spend heavily on bridal occasion wear. Full bridal sets combining necklace, earrings, maang tikka, bangles, and nose ring are the top wholesale category for ethnic bridal boutiques globally.</p><h2>Types of Bridal Sets Available</h2><ul><li>Kundan Bridal Sets — Traditional mirror-and-stone work; top seller for North Indian weddings</li><li>Polki Bridal Sets — Uncut stone-style imitation sets with heavy gold plating</li><li>American Diamond (CZ) Sets — Sparkling white stone sets replicating diamond jewellery</li><li>Gold Plated Bridal Sets — 22K gold-finished sets with stone and enamel accents</li></ul>"),
        (116, "trendy-anklets-supplier-boutiques", "Trendy Anklets Supplier for Boutiques", "Product Categories", "Trendy anklets are a high-margin, fast-moving category that boutiques love to stock.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>Why Anklets Are a Must-Stock Category</h2><p>Anklets have surged in popularity globally, driven by summer fashion trends, beach and boho aesthetics, and Y2K revival styles. For boutiques, anklets offer an excellent entry-level price point with strong impulse-buy potential. Indian manufacturers supply the full range — from delicate gold-plated chains to layered bohemian beaded styles — at wholesale prices that enable attractive retail margins.</p><h2>Types of Wholesale Anklets</h2><ul><li>Minimal Chain Anklets — Delicate gold or silver chains; everyday staple</li><li>Charm Anklets — Evil eye, moon, star, and coin charm designs</li><li>Layered Anklets — 2-3 strand designs for boho and beach fashion</li><li>Beaded Anklets — Colourful handmade-style designs; popular for summer markets</li></ul>"),
        (117, "stainless-steel-jewellery-wholesaler-india", "Stainless Steel Jewellery Wholesaler India", "Materials", "Stainless steel jewellery is growing in demand for its durability, hypoallergenic properties, and tarnish resistance.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>The Rise of Stainless Steel Fashion Jewellery</h2><p>Stainless steel jewellery is one of the fastest-growing segments in the wholesale fashion jewellery market. Buyers in Western markets — particularly the USA, UK, Australia, and Germany — increasingly prefer stainless steel pieces for their durability, tarnish resistance, and hypoallergenic properties.</p><h2>Why Stainless Steel Outperforms Brass and Alloy</h2><ul><li>Tarnish-Free — Does not oxidise or discolour with water, sweat, or humidity</li><li>Hypoallergenic — Safe for sensitive skin; no nickel release concerns with 316L grade</li><li>Durable — Scratch-resistant and long-lasting compared to plated brass</li><li>Water-Resistant — Ideal for waterproof jewellery lines, increasingly popular with buyers</li></ul>"),
        (118, "gold-plated-imitation-jewellery-exporter", "Gold Plated Imitation Jewellery Exporter", "Product Categories", "Gold plated imitation jewellery from India offers the luxury look at a fraction of the cost.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>What Is Gold Plated Imitation Jewellery?</h2><p>Gold plated imitation jewellery is fashion jewellery made from a base metal (typically brass or zinc alloy) that is electroplated with a layer of real gold. This process creates pieces that look visually identical to solid gold jewellery at a fraction of the cost — making it the backbone of the global fashion jewellery industry, with India as one of the largest producers worldwide.</p><h2>Types of Gold Plating Used</h2><ul><li>Standard Gold Plating — Thin layer (0.5-1 micron); affordable for fashion jewellery</li><li>Heavy Gold Plating — 2-5 microns; longer-lasting, higher-end feel</li><li>22K Gold Plating — Warm yellow tone matching traditional Indian gold colour</li><li>Rose Gold Plating — Pink-toned plating; popular in Western and Korean-inspired styles</li></ul>"),
        (119, "pearl-fashion-jewellery-supplier-india", "Pearl Fashion Jewellery Supplier", "Product Categories", "Imitation pearl jewellery from India is in high demand globally, with baroque and layered styles trending.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>Fashion Pearl Jewellery — A Global Bestseller</h2><p>Pearl fashion jewellery has experienced a remarkable renaissance, driven by the old money aesthetic, minimalist fashion, and modest fashion trends across markets from Southeast Asia to the Middle East and Western boutiques. Indian manufacturers produce high-quality imitation pearl jewellery using shell pearls, acrylic, resin, and glass beads that closely replicate the look of natural pearls at wholesale prices accessible to fashion retailers of all sizes.</p><h2>Popular Pearl Jewellery Pieces for Wholesale</h2><p>Top-selling wholesale pearl pieces include multi-strand pearl necklaces, pearl stud earrings, baroque pearl drop earrings, pearl and gold chain mixed necklaces, pearl hair pins and accessories, and layered pearl bracelets.</p>"),
        (120, "custom-charm-bracelets-manufacturer-india", "Custom Charm Bracelets Manufacturer", "Custom Jewellery", "Custom charm bracelets from India are a booming category for gift shops, boutiques, and online stores.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>India's Custom Charm Bracelet Manufacturing Sector</h2><p>Custom charm bracelets are a booming category in fashion accessories, combining personalization appeal with affordable pricing. Indian manufacturers — particularly in Jaipur — have built strong capabilities in producing a wide variety of charm bracelet styles with customization options for overseas buyers, from gift shops and boutiques to online jewellery brands looking to build their own product lines.</p><h2>Types of Charm Bracelets for Wholesale</h2><ul><li>Link Chain Charm Bracelets — Classic gold or silver chains with dangling charms</li><li>Evil Eye Charm Bracelets — Top-selling protection symbol; huge demand in USA, Turkey, Greece markets</li><li>Initial Letter Charms — Personalised alphabet charms for gifting</li><li>Birthstone Charm Bracelets — Monthly birthstone colour accents for gift retail</li></ul>"),
        // --- Batch 3: IDs 121–130 ---
        (121, "imitation-jewellery-supplier-usa-market", "Imitation Jewellery Supplier in USA Market", "Country Guide", "The USA is a massive $35 billion fashion jewellery market — Indian suppliers are its top source.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&h=500&fit=crop", "<h2>The USA Fashion Jewellery Market</h2><p>The United States is the world's largest fashion jewellery market, valued at over $35 billion annually. American consumers spend heavily on affordable, trend-driven accessories — making it a prime destination for Indian imitation jewellery exporters. Indian manufacturers supply a significant portion of the jewellery sold in US boutiques, online stores, and wholesale markets.</p><h2>What American Buyers Look For</h2><p>US buyers prioritise trend-driven designs that align with Instagram and Pinterest aesthetics. The most popular styles include minimal gold jewellery, layered necklaces, hoop earrings in various sizes, and stackable rings. Consistent quality, reliable packaging, and fast shipping are non-negotiable requirements for American retail buyers.</p>"),
        (122, "wholesale-jewellery-exporter-to-uae", "Wholesale Jewellery Exporter to UAE", "Country Guide", "The UAE is a key wholesale jewellery destination — with Dubai's Gold Souk serving as a global trading hub.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop", "<h2>The UAE: A Premium Wholesale Jewellery Market</h2><p>The UAE — particularly Dubai — is one of the most lucrative markets for Indian imitation jewellery exporters. With zero import duty on most fashion jewellery, a high-spending population with a deep cultural love for gold-tone pieces, and a well-established wholesale infrastructure centred on the Gold Souk, Dubai is a natural partner for Jaipur manufacturers. UAE buyers consistently place large orders for bridal sets, Kundan pieces, and American Diamond jewellery for festive and wedding seasons.</p>"),
        (123, "fashion-jewellery-suppliers-uk-retailers", "Fashion Jewellery Suppliers for UK Retailers", "Country Guide", "UK retailers source millions of pounds of Indian fashion jewellery annually — here is how the supply chain works.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>The UK Fashion Jewellery Market</h2><p>The United Kingdom is one of India's top five jewellery export destinations, with demand driven by a large South Asian diaspora, independent boutiques, and online fashion retailers. UK buyers are drawn to Indian jewellery's combination of authentic craftsmanship and competitive wholesale pricing.</p><h2>What UK Retailers Want from Indian Suppliers</h2><ul><li>Nickel-free products complying with UK REACH chemical regulations</li><li>Consistent quality suitable for boutique retail</li><li>Trend-forward designs updated seasonally</li><li>Reliable delivery times of 7-14 days by air freight</li></ul>"),
        (124, "bulk-costume-jewellery-australia-boutiques", "Bulk Costume Jewellery for Australia Boutiques", "Country Guide", "Australian boutiques are growing importers of Indian costume jewellery — particularly oxidised and artisan styles.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>Australia's Growing Demand for Indian Jewellery</h2><p>Australian boutiques — particularly in Sydney, Melbourne, and Brisbane — have developed a strong appetite for handcrafted, artisan-style Indian jewellery. Oxidized silver pieces, boho-inspired designs, and minimalist ethnic styles perform particularly well with Australian buyers who value authenticity and unique craftsmanship. The India-Australia ECTA trade agreement has also reduced import duties, making Indian jewellery even more cost-competitive in the Australian market.</p>"),
        (125, "best-indian-jewellery-exporter-to-canada", "Best Indian Jewellery Exporter to Canada", "Country Guide", "Canada is a strong market for Indian bridal and ethnic jewellery, driven by a large South Asian community.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>Canada: A High-Value Market for Indian Jewellery Exporters</h2><p>Canada has one of the largest South Asian diaspora populations in the world — over 1.8 million people of Indian, Pakistani, and Sri Lankan origin who maintain strong cultural ties to traditional jewellery. This creates consistent, year-round demand for bridal sets, kundan pieces, and festive jewellery from Indian exporters. Toronto, Vancouver, and Mississauga are the key distribution hubs for Indian jewellery in Canada.</p>"),
        (126, "europe-fashion-jewellery-import-india", "Europe Fashion Jewellery Import from India", "Country Guide", "European boutiques import Indian fashion jewellery at scale — here's what they look for.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>European Fashion Jewellery Market Overview</h2><p>Europe is a sophisticated and growing market for Indian imitation jewellery. Germany, France, Netherlands, and Italy are the largest import markets, with buyers drawn to Indian jewellery's combination of handcrafted quality, unique cultural designs, and competitive wholesale pricing. EU REACH compliance is mandatory — all jewellery must meet nickel and lead release limits — but qualified Indian manufacturers like Gemora Global supply the required test certificates as standard.</p>"),
        (127, "jewellery-wholesalers-philippines-market", "Jewellery Wholesalers for Philippines Market", "Country Guide", "The Philippines is a fast-growing market for Indian fashion jewellery, with strong demand for gold-tone pieces.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>Philippines: An Emerging Market for Indian Jewellery</h2><p>The Philippines is one of Southeast Asia's most promising emerging markets for Indian fashion jewellery. Filipino consumers have a deep cultural appreciation for gold-tone jewellery and ornate, colourful pieces — a perfect fit for the Jaipur manufacturing tradition. Demand is growing rapidly through online platforms and small boutique retailers in Manila, Cebu, and Davao.</p>"),
        (128, "dubai-fashion-jewellery-sourcing-guide", "Dubai Fashion Jewellery Sourcing Guide", "Country Guide", "Dubai is Asia's jewellery trading hub — here's how to source Indian fashion jewellery through Dubai channels.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop", "<h2>Dubai as a Global Jewellery Sourcing Hub</h2><p>Dubai's Gold Souk is one of the world's most renowned jewellery trading centres, bringing together buyers and suppliers from across Asia, Africa, the Middle East, and Europe. For international buyers, Dubai offers a convenient gateway to source Indian fashion jewellery — either by meeting Indian suppliers at Dubai trade fairs or through the city's established wholesale importers who stock Jaipur-manufactured pieces year-round.</p>"),
        (129, "saudi-arabia-jewellery-import-supplier-india", "Saudi Arabia Jewellery Import Supplier India", "Country Guide", "Saudi Arabia imports significant volumes of Indian fashion jewellery for its fashion-forward consumer market.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop", "<h2>Saudi Arabia: A Premium Market for Indian Jewellery</h2><p>Saudi Arabia is a rapidly growing market for Indian imitation jewellery, driven by a young, fashion-forward consumer base with high disposable income. The Saudi Vision 2030 reform program has dramatically increased women's participation in fashion and lifestyle spending, creating new demand for affordable, stylish jewellery. Indian manufacturers — particularly in Jaipur — are well-positioned to serve this market with their combination of ornate gold-tone designs and competitive wholesale pricing.</p>"),
        (130, "singapore-fashion-jewellery-wholesale-source", "Singapore Fashion Jewellery Wholesale Source", "Country Guide", "Singapore is a premium gateway to Southeast Asia for Indian fashion jewellery exporters.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&h=500&fit=crop", "<h2>Singapore: Gateway to Southeast Asia for Indian Jewellery</h2><p>Singapore serves as the regional distribution hub for fashion jewellery across Southeast Asia. The city-state's strategic location, zero import duty on jewellery, and world-class logistics infrastructure make it the preferred entry point for Indian jewellery destined for markets across the region. Singapore-based distributors regularly source from Jaipur manufacturers and redistribute to Malaysia, Indonesia, Thailand, and beyond.</p>"),
        // --- Batch 4: IDs 131–140 ---
        (131, "how-imitation-jewellery-manufactured-jaipur", "How Imitation Jewellery is Manufactured in Jaipur", "Manufacturing", "Jaipur's imitation jewellery manufacturing combines 400 years of craftsmanship with modern production techniques.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>The Step-by-Step Jaipur Jewellery Manufacturing Process</h2><p>Jaipur has been a centre of jewellery making for over 400 years. Today, the city's manufacturing clusters combine traditional craftsmanship with modern production technology to produce fashion jewellery for buyers across 50+ countries.</p><h2>From Design to Finished Product</h2><ul><li>Design and CAD: Artisans sketch designs, then convert to CAD files for precision mold creation</li><li>Mold Making: Rubber or silicone molds are made from master models for lost-wax casting</li><li>Casting: Zinc alloy or brass is cast into molds using lost-wax or die-casting techniques</li><li>Filing and Buffing: Rough castings are hand-filed and buffed to remove seams and imperfections</li><li>Stone Setting: Skilled karigar craftsmen set stones by hand — prong, bezel, or pave styles</li><li>Electroplating: Gold, silver, or rhodium plating is applied in controlled electroplating baths</li><li>Anti-Tarnish Treatment: A protective lacquer or e-coat is applied for longevity</li><li>Quality Inspection: Every piece is inspected for defects before packing</li></ul>"),
        (132, "quality-control-fashion-jewellery-export", "Quality Control in Fashion Jewellery Export", "Quality", "Rigorous quality control is what separates reliable Indian jewellery exporters from unreliable ones.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>Why Quality Control Defines Export Success</h2><p>In the competitive world of fashion jewellery export, quality consistency is the single most important factor in building long-term buyer relationships. Buyers who receive inconsistent quality — beautiful samples followed by substandard bulk orders — quickly switch suppliers. Rigorous quality control is what separates reliable Indian exporters from the rest.</p><h2>Stages of Quality Control in Jaipur Manufacturing</h2><ul><li>Incoming material inspection — base metals, stones, plating chemicals checked before production</li><li>In-process quality checks — pieces inspected at casting, filing, stone-setting, and plating stages</li><li>Final inspection — 100% visual check of finished pieces for defects, loose stones, plating issues</li><li>Pre-shipment inspection — random batch sampling before packing and dispatch</li></ul>"),
        (133, "nickel-free-imitation-jewellery-supplier-india", "Nickel-Free Imitation Jewellery Supplier India", "Quality", "Nickel-free jewellery is essential for selling in the EU and USA — Indian suppliers now offer full compliance.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>Why Nickel-Free Jewellery Matters for Global Buyers</h2><p>Nickel allergies affect approximately 10-15% of the global population, making nickel-free jewellery a critical requirement for retail buyers targeting broad consumer markets. The European Union's REACH regulation imposes strict limits on nickel release from skin-contact jewellery — non-compliant products can be seized at customs and result in significant financial penalties for importers.</p><h2>How Indian Manufacturers Achieve Nickel-Free Compliance</h2><ul><li>Use of brass alloys formulated without nickel</li><li>Zinc alloy die-casting with nickel-free base composition</li><li>Rhodium and gold plating processes that create a nickel-barrier coating</li><li>Third-party lab testing (SGS, Intertek) to verify nickel release levels</li></ul>"),
        (134, "anti-tarnish-jewellery-manufacturer-india", "Anti-Tarnish Jewellery Manufacturer India", "Quality", "Anti-tarnish coating is the key technology that makes Indian jewellery competitive in humid global markets.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>What is Anti-Tarnish Coating?</h2><p>Anti-tarnish coating is a transparent protective layer applied to the surface of plated jewellery after the electroplating process. This coating — typically a polymer lacquer or electrochemical e-coat — seals the plating from atmospheric oxidation, moisture, and skin oils that would otherwise cause tarnishing. For jewellery destined for humid markets like the UAE, Southeast Asia, or West Africa, anti-tarnish coating is not optional — it is essential for maintaining retail quality.</p>"),
        (135, "hypoallergenic-fashion-jewellery-wholesale", "Hypoallergenic Fashion Jewellery Wholesale", "Quality", "Hypoallergenic jewellery is a growing category as consumers become more aware of metal sensitivities.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>The Growing Demand for Hypoallergenic Jewellery</h2><p>Consumer awareness of metal allergies has increased significantly over the past decade, driven by social media, dermatology awareness campaigns, and the rise of sensitive skin-focused beauty and fashion brands. Retailers who stock hypoallergenic jewellery are tapping into a growing segment of consumers who specifically seek out skin-safe accessories.</p>"),
        (136, "handmade-vs-machine-made-imitation-jewellery", "Handmade vs Machine Made Imitation Jewellery", "Manufacturing", "Understanding the difference between handmade and machine-made jewellery helps buyers choose the right products.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>Handmade vs Machine Made: Understanding the Difference</h2><p>In the world of imitation jewellery manufacturing, the distinction between handmade and machine-made products has significant implications for quality, price, design uniqueness, and production scalability. Buyers who understand this distinction can make smarter sourcing decisions aligned with their retail strategy.</p><h2>Key Differences</h2><ul><li>Handmade: Higher perceived value, unique variations, traditional techniques (Kundan, Meenakari), higher price point</li><li>Machine-made: Consistent uniformity, faster production, lower cost, ideal for fashion basics and trend-driven pieces</li></ul>"),
        (137, "brass-jewellery-manufacturer-india-guide", "Brass Jewellery Manufacturer in India Guide", "Manufacturing", "Brass is the preferred base metal for Indian fashion jewellery — here is why and what buyers should know.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>Why Brass is the Gold Standard Base Metal</h2><p>Brass — an alloy of copper and zinc — is the preferred base metal for premium Indian fashion jewellery, and for good reason. Its combination of malleability, weight, durability, and excellent plating adhesion makes it the ideal foundation for gold-plated, oxidised, and rhodium-plated jewellery intended for international retail markets.</p>"),
        (138, "zinc-alloy-jewellery-exporter-guide", "Zinc Alloy Jewellery Exporter Guide", "Manufacturing", "Zinc alloy jewellery enables intricate designs at competitive prices — a complete guide for wholesale buyers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>What is Zinc Alloy Jewellery?</h2><p>Zinc alloy (also known as Zamak or die-cast alloy) is a group of metal alloys primarily composed of zinc with small amounts of aluminium, magnesium, and copper. It is the most widely used base metal for fashion jewellery globally, prized for its ability to be die-cast into intricate shapes at high production speeds and low cost.</p>"),
        (139, "premium-finishing-fashion-jewellery-manufacturing", "Premium Finishing in Fashion Jewellery Manufacturing", "Manufacturing", "Premium finishing transforms ordinary fashion jewellery into retail-quality pieces that command higher prices.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>Why Finishing Defines Perceived Quality</h2><p>In fashion jewellery, the final finish is often what separates a $5 wholesale price from a $12 wholesale price for pieces with identical base materials. Premium finishing techniques — multi-layer plating, hand polishing, stone setting precision, and anti-tarnish sealing — transform raw castings into retail-quality pieces that justify higher price points and generate better reviews from end consumers.</p>"),
        (140, "how-to-choose-reliable-jewellery-manufacturer", "How to Choose a Reliable Jewellery Manufacturer", "Buyer Guide", "Choosing the right jewellery manufacturer protects your brand reputation and ensures consistent quality.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>The Most Important Decision in Your Sourcing Journey</h2><p>Choosing the right jewellery manufacturer is the single most impactful decision you will make in your wholesale sourcing journey. A reliable manufacturer becomes a long-term business partner — ensuring consistent quality, on-time delivery, competitive pricing, and design innovation season after season. The wrong choice can cost you clients, damage your brand reputation, and result in significant financial losses.</p>"),
        // --- Batch 5: IDs 141–150 ---
        (141, "minimum-order-quantity-jewellery-export", "Minimum Order Quantity for Jewellery Export", "B2B Guide", "Understanding MOQ is essential for every first-time imitation jewellery buyer from India.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>What Is Minimum Order Quantity (MOQ)?</h2><p>MOQ — Minimum Order Quantity — is the smallest number of units a manufacturer will produce or sell in a single order. For jewellery manufacturers in India, MOQ exists because every production run involves real setup costs: cutting dies, mould preparation, plating bath setup, and material purchasing in bulk. Producing fewer units than the MOQ makes the run economically unviable for the factory.</p><h2>Typical MOQ by Jewellery Type</h2><ul><li>Standard fashion jewellery (catalogue designs): 50-100 pieces per design</li><li>Customised or modified designs: 200-500 pieces per design</li><li>OEM / private label (your own brand): 500-1,000 pieces per design</li></ul>"),
        (142, "how-to-buy-wholesale-jewellery-in-bulk", "How to Buy Wholesale Jewellery in Bulk", "B2B Guide", "Bulk buying from Indian jewellery suppliers requires a systematic approach to maximise value.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>Planning Your Bulk Jewellery Purchase</h2><p>Buying wholesale jewellery in bulk from India is a profitable business strategy, but it requires careful planning to maximise value and minimise risk. First-time bulk buyers who approach the process without a framework often overspend, buy the wrong mix, or receive products that do not sell. This guide walks through the systematic approach that experienced wholesale buyers use.</p>"),
        (143, "best-catalogue-for-jewellery-retailers", "Best Catalogue for Jewellery Retailers", "B2B Guide", "A well-structured jewellery catalogue is the foundation of successful wholesale buying decisions.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>What Makes a Great Jewellery Wholesale Catalogue</h2><p>The difference between a catalogue that converts buyers and one that gets ignored often comes down to five key elements: professional product photography, clear technical specifications, transparent pricing tiers, organized category structure, and regular seasonal updates. Indian manufacturers have significantly improved their catalogue quality in recent years, making the sourcing process more streamlined for international buyers.</p>"),
        (144, "start-jewellery-boutique-wholesale-stock", "Start Your Jewellery Boutique with Wholesale Stock", "B2B Guide", "Starting a jewellery boutique with Indian wholesale stock is one of the most profitable retail strategies.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>Why Indian Wholesale Stock is the Foundation of Successful Jewellery Boutiques</h2><p>Thousands of successful jewellery boutiques worldwide — from boutique stores in London to online shops on Etsy — are built on a foundation of Indian wholesale jewellery. The combination of design variety, competitive pricing, and scalable supply chain makes Indian manufacturers the ideal partner for boutique owners at every stage of growth.</p>"),
        (145, "how-boutiques-source-imitation-jewellery", "How Boutiques Source Imitation Jewellery", "B2B Guide", "A behind-the-scenes look at how fashion boutiques find, evaluate, and order imitation jewellery wholesale.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>The Boutique Sourcing Journey: From Discovery to Delivery</h2><p>Fashion boutiques go through a structured sourcing journey when adding imitation jewellery to their product range. Understanding this journey helps both buyers (to optimise their process) and suppliers (to support buyers better at each stage). Here is how successful boutiques source Indian imitation jewellery from initial discovery to repeat orders.</p>"),
        (146, "dropshipping-fashion-jewellery-supplier-india", "Dropshipping Fashion Jewellery Supplier India", "B2B Guide", "Indian jewellery suppliers now offer dropshipping for online retailers — here is how it works.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>Dropshipping Indian Fashion Jewellery: Is It Viable?</h2><p>Dropshipping — where the supplier ships directly to the end customer on behalf of the retailer — has transformed eCommerce by eliminating the need for inventory investment. Indian fashion jewellery manufacturers have increasingly adapted to serve this model, offering catalogue access, branded packaging, and direct shipping services to online retailers worldwide.</p>"),
        (147, "retail-ready-jewellery-packaging-supplier", "Retail Ready Jewellery Packaging Supplier", "B2B Guide", "Retail-ready packaging from Indian suppliers transforms wholesale jewellery into premium retail products.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>What Is Retail-Ready Jewellery Packaging?</h2><p>Retail-ready packaging means that each jewellery piece arrives from the supplier in packaging that is immediately suitable for display and sale in a retail environment — no additional packaging work required by the buyer. This includes individual boxes or pouches, price tags or labels, barcode stickers, and branded outer packaging that protects pieces during shipping and presents them attractively to consumers.</p>"),
        (148, "jewellery-supplier-for-amazon-sellers", "Jewellery Supplier for Amazon Sellers", "B2B Guide", "Amazon sellers sourcing Indian jewellery wholesale achieve some of the platform's highest jewellery margins.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>Indian Jewellery Wholesale for Amazon FBA Sellers</h2><p>Amazon is one of the largest retail channels for fashion jewellery globally, and Indian jewellery manufacturers are a go-to source for Amazon FBA sellers who want high-margin, unique products that stand out from mass-market competition. Indian jewellery's combination of design variety, competitive pricing, and the ability to brand products creates significant advantages for Amazon sellers looking to build sustainable jewellery businesses.</p>"),
        (149, "wholesale-jewellery-for-instagram-stores", "Wholesale Jewellery for Instagram Stores", "B2B Guide", "Instagram stores selling Indian wholesale jewellery are one of the most profitable social commerce models.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Why Instagram Is Perfect for Selling Indian Jewellery</h2><p>Instagram has emerged as one of the most powerful sales channels for fashion jewellery, particularly for pieces with strong visual appeal. Indian imitation jewellery — with its ornate designs, metallic finishes, and photogenic quality — is perfectly suited to Instagram's visual format. Small business owners running Instagram stores have built six-figure businesses sourcing wholesale jewellery from Indian manufacturers and selling through Instagram Shopping and DM-based orders.</p>"),
        (150, "best-jewellery-supplier-for-resellers", "Best Jewellery Supplier for Resellers", "B2B Guide", "Indian jewellery suppliers offer resellers the ideal combination of variety, quality, and pricing.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=500&fit=crop", "<h2>What Resellers Need from a Jewellery Supplier</h2><p>Jewellery resellers — whether selling on Etsy, Amazon, Instagram, or at physical markets — have specific requirements from their wholesale suppliers that differ from those of boutiques or retailers. Understanding these needs helps resellers identify the right Indian supplier and structure their sourcing for maximum profitability and minimum operational complexity.</p>"),
        // --- Batch 6: IDs 151–160 ---
        (151, "top-fashion-jewellery-trends-2026", "Top Fashion Jewellery Trends 2026", "Trends", "2026 brings exciting new jewellery trends — here's what wholesale buyers should stock up on now.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=500&fit=crop", "<h2>The 10 Biggest Jewellery Trends for 2026</h2><p>The global fashion jewellery market is evolving fast in 2026. For wholesale buyers and boutique owners, staying ahead of trends means stocking the right designs before demand peaks. Here are the 10 most important jewellery trends shaping buying decisions this year.</p><ul><li>Oversized statement earrings — Bold, dramatic pieces making a strong comeback across all markets</li><li>Layered necklace stacking — Multiple chain lengths worn together for an effortless editorial look</li><li>Chunky gold chains — Heavyweight gold-tone chains for wrists and necks</li><li>Y2K revival — Butterfly clips, colourful plastics, and retro motifs back in full force</li><li>Modern pearl reinterpretations — Baroque pearls, asymmetric pearl earrings, and pearl-chain combos</li></ul>"),
        (152, "trending-earrings-styles-worldwide-2026", "Trending Earrings Styles Worldwide 2026", "Trends", "Discover the top earring trends driving wholesale demand globally in 2026.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&h=500&fit=crop", "<h2>Why Earrings Lead the Jewellery Trend Cycle</h2><p>Earrings are the most trend-sensitive jewellery category, with styles turning over faster than any other accessory segment. For wholesale buyers, stocking the right earring trends at the right moment is the difference between fast-selling inventory and clearance stock. In 2026, the earring market is seeing strong demand for oversized hoops, mismatched designs, ear cuffs, and baroque pearl drops.</p>"),
        (153, "minimal-jewellery-trend-for-women", "Minimal Jewellery Trend for Women", "Trends", "Minimalist jewellery is one of the most consistent global trends — and a profitable wholesale category.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>Why Minimalist Jewellery Dominates Western Markets</h2><p>Minimalist jewellery — characterised by clean lines, delicate proportions, and understated elegance — has become one of the most consistent long-term trends in global fashion. Unlike seasonal statement trends, minimalist pieces sell year-round to a broad demographic of consumers who prefer everyday wearability over occasional statement dressing.</p>"),
        (154, "gen-z-jewellery-trends-2026", "Gen Z Jewellery Trends 2026", "Trends", "Gen Z buyers are reshaping the global jewellery market with their distinctive aesthetic preferences.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>Understanding Gen Z's Jewellery Aesthetic</h2><p>Generation Z — born between 1997 and 2012 — is now the most influential consumer demographic in global fashion. As digital natives who grew up with Pinterest, Instagram, and TikTok, Gen Z buyers have developed a distinctive jewellery aesthetic that blends nostalgia, self-expression, and sustainable values in ways that differ fundamentally from previous generations.</p>"),
        (155, "korean-inspired-jewellery-wholesale-supplier", "Korean Inspired Jewellery Wholesale Supplier", "Trends", "K-beauty and K-fashion have made Korean-inspired jewellery one of the fastest-growing wholesale categories.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&h=500&fit=crop", "<h2>The Global Rise of Korean-Inspired Jewellery</h2><p>Korean pop culture — from K-drama to K-pop — has created a global phenomenon that extends far beyond music and entertainment into fashion, beauty, and accessories. Korean-inspired jewellery, characterised by its delicate proportions, layered styling, and blend of minimal and romantic elements, has become one of the fastest-growing wholesale categories in markets from Southeast Asia to Western Europe.</p>"),
        (156, "luxury-look-imitation-jewellery-trends", "Luxury Look Imitation Jewellery Trends", "Trends", "Affordable luxury aesthetic is driving demand for high-quality imitation jewellery globally.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>The Affordable Luxury Trend in Fashion Jewellery</h2><p>One of the most powerful consumer trends in global fashion retail is the pursuit of the luxury aesthetic at non-luxury prices. Consumers across income segments want to look affluent and stylish, and high-quality imitation jewellery — particularly pieces inspired by designer and fine jewellery silhouettes — is meeting this demand with remarkable success.</p>"),
        (157, "office-wear-jewellery-styles-wholesale", "Office Wear Jewellery Styles Wholesale", "Trends", "Professional jewellery for office wear is a stable, year-round wholesale category.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>Why Office Jewellery is a Stable Wholesale Category</h2><p>Office and professional wear jewellery — characterised by understated elegance, minimal size, and versatile styling — is one of the most reliable year-round wholesale categories. Unlike trend-sensitive statement jewellery, office jewellery sees consistent demand regardless of season, making it an essential category for wholesale buyers who want stable inventory turnover.</p>"),
        (158, "boho-jewellery-trends-for-boutiques", "Boho Jewellery Trends for Boutiques", "Trends", "Boho and bohemian jewellery styles remain a perennial bestseller for boutiques worldwide.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>Why Boho Jewellery Never Goes Out of Style</h2><p>Bohemian-inspired jewellery occupies a unique position in the fashion accessories market: it is simultaneously a perennial trend and a timeless aesthetic that appeals to a broad, loyal consumer base. From music festival fashion to everyday casual wear, boho jewellery delivers consistent retail performance season after season — making it one of the safest and most profitable categories for boutique buyers to stock.</p>"),
        (159, "statement-necklace-trends-global-market", "Statement Necklace Trends Global Market", "Trends", "Statement necklaces are experiencing a global resurgence — wholesale buyers need to stock the right styles.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=500&fit=crop", "<h2>The Return of the Statement Necklace</h2><p>After a period dominated by minimal layered necklaces, statement pieces are experiencing a strong global comeback. Driven by a broader fashion move toward maximalism, the desire for conversation-starting accessories, and the influence of celebrity and social media styling, statement necklaces are once again commanding significant wholesale demand from boutiques and retailers worldwide.</p>"),
        (160, "bridal-fashion-jewellery-trends-export", "Bridal Fashion Jewellery Trends Export", "Trends", "Bridal jewellery export trends are shifting — here is what international boutiques want for 2026.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=500&fit=crop", "<h2>Global Bridal Jewellery Trends for 2026</h2><p>Bridal jewellery remains one of the most important and consistent categories in fashion jewellery export. International boutiques catering to South Asian, Middle Eastern, and African diaspora communities are the primary buyers for Indian bridal sets — and their preferences are evolving rapidly in response to social media influence and generational shifts in bridal aesthetics.</p>"),
        // --- Batch 7: IDs 161–170 ---
        (161, "custom-jewellery-boxes-for-export", "Custom Jewellery Boxes for Export", "Packaging", "Custom jewellery boxes transform your wholesale order into a premium retail-ready product.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Why Custom Packaging Matters for Jewellery Export</h2><p>In wholesale jewellery, packaging is not an afterthought — it's a core part of your product offering. Custom jewellery boxes improve brand perception, create a memorable unboxing experience, enhance retail display value, and protect pieces from damage during transit. Buyers in UAE, UK, and USA increasingly expect retail-ready packaging as part of their wholesale order.</p><h2>Types of Custom Jewellery Boxes</h2><ul><li>Magnetic closure gift boxes — premium unboxing, ideal for bridal and high-value sets</li><li>Drawer/slider boxes — popular for earrings, pendants, and gifting collections</li><li>Hinged boxes — classic retail format for rings, bangles, and necklaces</li><li>Window boxes — allows display without opening, great for retail shelf presentation</li></ul>"),
        (162, "best-packaging-imitation-jewellery-shipping", "Best Packaging for Imitation Jewellery Shipping", "Packaging", "Choosing the right packaging for shipping imitation jewellery protects your investment and impresses buyers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Packaging Challenges for International Jewellery Shipping</h2><p>Shipping imitation jewellery internationally presents unique packaging challenges. Delicate pieces must withstand the rigours of air freight handling, customs inspection, and last-mile delivery without tangling, breaking, or losing their finish. Choosing the right combination of inner packaging and outer carton protection is essential for maintaining the quality that buyers expect upon receipt.</p>"),
        (163, "how-to-ship-jewellery-internationally", "How to Ship Jewellery Internationally", "Packaging", "A complete guide to international jewellery shipping options, costs, and best practices.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Choosing the Right International Shipping Method</h2><p>International jewellery shipments have two primary options: air freight and sea freight. Each has distinct advantages, costs, and lead times that make it suitable for different order types and urgency levels. Understanding when to use each method — and how to structure your logistics for maximum efficiency — is a core competency for any jewellery exporter.</p>"),
        (164, "export-documentation-for-jewellery-business", "Export Documentation for Jewellery Business", "Packaging", "Proper export documentation prevents customs delays and ensures smooth jewellery shipments.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop", "<h2>Essential Export Documents for Every Jewellery Shipment</h2><p>Missing or incorrect export documentation is one of the most common causes of customs delays and additional costs for jewellery exporters. Every shipment must be accompanied by a complete, accurate document set that satisfies both Indian export requirements and destination country import requirements. Here is the essential documentation checklist for every international jewellery shipment.</p>"),
        (165, "safe-courier-options-jewellery-export", "Safe Courier Options for Jewellery Export", "Packaging", "Choosing the right courier for jewellery shipments balances speed, security, and cost.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Why Courier Selection Matters for Jewellery</h2><p>Jewellery is a high-value, theft-prone commodity that requires careful courier selection for international shipment. Not all couriers offer the same level of security, insurance coverage, or tracking visibility — and choosing the wrong option can result in loss, damage, or customs complications that cost more than the original shipment value.</p>"),
        (166, "how-to-reduce-shipping-costs-jewellery-export", "How to Reduce Shipping Costs for Jewellery Export", "Packaging", "Shipping costs can erode jewellery export margins — here are proven strategies to reduce them.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Why Shipping Cost Management is Critical for Jewellery Exporters</h2><p>For Indian jewellery exporters, shipping costs represent one of the largest variable expenses in the export chain. At air freight rates of $4-$8 per kg, a 5 kg sample shipment can cost $20-$40 — adding 10-20% to the value of small orders. For buyers receiving regular bulk orders, sea freight optimisation can save tens of thousands of dollars annually.</p>"),
        (167, "eco-friendly-jewellery-packaging-supplier", "Eco-Friendly Jewellery Packaging Supplier", "Packaging", "Sustainable jewellery packaging is growing in demand from eco-conscious buyers globally.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>The Growing Demand for Sustainable Jewellery Packaging</h2><p>Environmental consciousness has moved from niche concern to mainstream consumer expectation in markets across the USA, UK, Europe, and Australia. Boutiques and retailers who stock eco-friendly packaged jewellery are responding to this demand — and differentiating their offering from competitors who still use plastic and non-recyclable materials.</p>"),
        (168, "dust-bags-and-boxes-for-jewellery-brands", "Dust Bags and Boxes for Jewellery Brands", "Packaging", "Branded dust bags and boxes are essential for creating a premium jewellery brand experience.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Why Branded Packaging Creates Premium Brand Value</h2><p>In the jewellery market, packaging is not just functional protection — it is brand communication. A velvet pouch or rigid box with your brand logo transforms an ordinary jewellery purchase into a premium gifting experience. Brands that invest in quality branded packaging consistently achieve higher customer satisfaction ratings, better social media sharing of unboxing experiences, and stronger repeat purchase rates.</p>"),
        (169, "export-customs-guide-for-jewellery", "Export Customs Guide for Jewellery", "Packaging", "Navigating customs for jewellery export requires knowledge of HS codes, duties, and compliance.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop", "<h2>Understanding Jewellery Export Customs Requirements</h2><p>Customs compliance is one of the most technically demanding aspects of jewellery export. Every country has its own import regulations, tariff classifications, duty rates, and compliance requirements. Understanding the customs framework for your key export markets — and ensuring your shipments comply from the first dispatch — prevents costly delays, duties, and legal complications.</p>"),
        (170, "global-delivery-solutions-for-wholesalers", "Global Delivery Solutions for Wholesalers", "Packaging", "Reliable global delivery is the backbone of a successful jewellery wholesale business.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1568944691613-6b09c4ab0e15?w=800&h=500&fit=crop", "<h2>Building a Reliable Global Delivery Infrastructure</h2><p>For Indian jewellery wholesalers and exporters, delivery reliability is a core competitive differentiator. International buyers who receive their orders on time, in perfect condition, and with accurate tracking information become loyal, repeat customers. Those who experience delays, damage, or customs complications — regardless of product quality — often switch to alternative suppliers.</p>"),
        // --- Batch 8: IDs 171–180 ---
        (171, "how-to-start-jewellery-export-business-india", "How to Start Jewellery Export Business in India", "Business Growth", "Starting a jewellery export business from India is more accessible than ever with the right guidance.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>Getting Started with Jewellery Exports from India</h2><p>India is one of the world's largest jewellery exporters, and starting your own export business from Jaipur or any major jewellery hub is more achievable than you might think. The key is following the right sequence of steps from registration to your first shipment.</p><h2>Essential Steps to Launch</h2><ul><li>Register your business — Choose between proprietorship, LLP, or Pvt Ltd based on your scale</li><li>Get IEC (Import Export Code) — Mandatory for all exports, issued by DGFT within 2-3 working days</li><li>Open a current bank account — Must have an AD (Authorised Dealer) bank for export remittances</li><li>Register on GSTN — Required for GST refund and LUT filing on zero-rated exports</li><li>Source your jewellery — Manufacture in-house or source from Jaipur, Moradabad, or Mumbai wholesalers</li></ul>"),
        (172, "grow-wholesale-jewellery-business-globally", "Grow Wholesale Jewellery Business Globally", "Business Growth", "Scaling a wholesale jewellery business globally requires systematic market expansion strategies.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>The Path from Local to Global Wholesale Jewellery Business</h2><p>Many successful wholesale jewellery businesses start by serving their home market before expanding internationally. The transition from domestic to global requires a deliberate, phased approach — identifying the right initial export markets, building the necessary compliance and logistics capabilities, and developing relationships with international buyers through B2B platforms and trade fairs.</p>"),
        (173, "how-to-get-foreign-buyers-for-jewellery", "How to Get Foreign Buyers for Jewellery", "Business Growth", "Attracting foreign buyers for your jewellery export business requires a multi-channel approach.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Finding Your First International Jewellery Buyers</h2><p>For Indian jewellery manufacturers and exporters, finding the first international buyers is both the biggest challenge and the most important milestone. Once you have established your first 3-5 regular foreign buyers, the business model becomes self-reinforcing through referrals, repeat orders, and growing reputation. The challenge is getting those first buyers.</p>"),
        (174, "instagram-leads-for-jewellery-exporters", "Instagram Leads for Jewellery Exporters", "Business Growth", "Instagram is one of the most powerful lead generation channels for Indian jewellery exporters.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Why Instagram Works for Jewellery Lead Generation</h2><p>Instagram is uniquely suited to jewellery marketing because jewellery is a highly visual product category that photographs beautifully and creates strong emotional responses in potential buyers. For Indian jewellery exporters, Instagram offers a direct line to boutique owners, online retailers, and wholesale buyers worldwide who actively discover new suppliers through social media.</p>"),
        (175, "b2b-marketing-for-jewellery-manufacturers", "B2B Marketing for Jewellery Manufacturers", "Business Growth", "Effective B2B marketing helps jewellery manufacturers reach the right wholesale buyers globally.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>The Unique Challenge of B2B Jewellery Marketing</h2><p>Marketing to wholesale buyers is fundamentally different from marketing to end consumers. B2B jewellery buyers are professional purchasers making rational business decisions based on quality, pricing, reliability, and commercial fit — not impulse or emotion. Effective B2B marketing for jewellery manufacturers must address these decision-making criteria while also building the trust and credibility that wholesale relationships require.</p>"),
        (176, "seo-for-imitation-jewellery-website", "SEO for Imitation Jewellery Website", "Business Growth", "SEO is the highest-ROI digital marketing channel for imitation jewellery exporters and manufacturers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Why SEO is Essential for Jewellery Export Businesses</h2><p>Search engine optimisation (SEO) is the practice of improving your website's visibility in Google and other search engines for queries relevant to your business. For Indian jewellery exporters and manufacturers, SEO represents the single highest-ROI digital marketing channel — generating organic traffic from buyers who are actively searching for exactly what you offer.</p>"),
        (177, "google-ranking-tips-for-jewellery-exporter", "Google Ranking Tips for Jewellery Exporter", "Business Growth", "Practical Google ranking tips that will help jewellery exporters attract more international buyers online.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>How Google Search Works for Jewellery Businesses</h2><p>Understanding how Google ranks websites is the foundation of an effective SEO strategy for jewellery exporters. Google's algorithm evaluates hundreds of factors to determine which pages to show for any given search query, but the core principles are consistent: relevance (does your content answer the searcher's question?), authority (do other reputable sites link to yours?), and experience (is your website fast, secure, and user-friendly?).</p>"),
        (178, "linkedin-strategy-wholesale-jewellery-business", "LinkedIn Strategy for Wholesale Jewellery Business", "Business Growth", "LinkedIn is an underutilised but powerful channel for connecting with international jewellery buyers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Why LinkedIn Works for B2B Jewellery Sales</h2><p>While Instagram and Pinterest attract consumer attention, LinkedIn is where professional wholesale jewellery buyers — boutique owners, retail chain buyers, import distributors, and fashion brand sourcing managers — conduct business networking and supplier discovery. A strategic LinkedIn presence positions your jewellery business in front of the right decision-makers at the precise moments when they are looking for new suppliers.</p>"),
        (179, "email-marketing-for-jewellery-buyers", "Email Marketing for Jewellery Buyers", "Business Growth", "Email marketing is one of the most cost-effective ways to keep jewellery buyers engaged and ordering regularly.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop", "<h2>Why Email Marketing Works for Jewellery Wholesale</h2><p>Email marketing remains one of the highest-ROI digital marketing channels for B2B businesses, delivering an average return of $36 for every $1 spent. For jewellery exporters and manufacturers, email is the most direct, personalised, and cost-effective way to maintain relationships with existing buyers, announce new collections, share promotions, and convert prospects into customers.</p>"),
        (180, "how-to-scale-jewellery-exports-fast", "How to Scale Jewellery Exports Fast", "Business Growth", "Scaling jewellery exports fast requires systematic processes, the right market focus, and strong buyer relationships.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop", "<h2>The Fast-Track Approach to Scaling Jewellery Exports</h2><p>Many Indian jewellery manufacturers and exporters reach a revenue plateau after their initial growth phase — they have a handful of regular buyers but struggle to scale beyond $100,000-$500,000 in annual export revenue. Breaking through this plateau requires a systematic approach to market expansion, buyer acquisition, and operational scaling that goes beyond simply working harder.</p>"),
        // --- Batch 9: IDs 181–190 ---
        (181, "why-jaipur-is-hub-of-imitation-jewellery", "Why Jaipur is Hub of Imitation Jewellery", "Industry Insights", "Jaipur's 400-year jewellery heritage makes it the undisputed capital of imitation jewellery manufacturing.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>Jaipur's Royal Jewellery Legacy</h2><p>Jaipur's jewellery tradition stretches back over 400 years, shaped by the patronage of Rajasthan's Maharajas and the artistic influence of the Mughal Empire. These royal courts demanded the finest jewellery, training generations of master craftsmen — or karigars — whose skills have been passed down to this day. This deep cultural and artistic foundation is why Jaipur emerged as India's jewellery capital.</p><h2>Jaipur's Speciality Styles</h2><ul><li>Kundan — intricate stone-setting in pure gold foil, a Jaipur hallmark</li><li>Meenakari — vibrant enamel work fused onto metal</li><li>Polki — uncut diamond look in imitation form</li><li>Oxidised Silver — antique finish pieces popular globally</li></ul>"),
        (182, "best-jewellery-manufacturing-city-india", "Best Jewellery Manufacturing City in India", "Industry Insights", "Jaipur, Mumbai, Moradabad, and Delhi each specialise in different jewellery types — here is the comparison.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop", "<h2>India's Major Jewellery Manufacturing Cities</h2><p>India's jewellery manufacturing industry is not concentrated in a single location — it is distributed across multiple cities, each with its own specialisation, heritage, and competitive advantages. Understanding which city produces which type of jewellery helps international buyers identify the right suppliers for their specific product requirements.</p>"),
        (183, "why-global-buyers-trust-indian-suppliers", "Why Global Buyers Trust Indian Suppliers", "Industry Insights", "Indian jewellery suppliers have earned global trust through decades of quality exports and reliable delivery.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>The Foundation of Global Trust in Indian Jewellery</h2><p>Indian jewellery suppliers have built a global reputation for trustworthiness over decades of consistent export performance. This trust is not based on marketing claims — it is founded on verifiable track records of quality delivery, transparent business practices, and the accumulated experience of serving buyers across 50+ countries with widely varying requirements and standards.</p>"),
        (184, "how-to-verify-jewellery-supplier-india", "How to Verify Jewellery Supplier in India", "Industry Insights", "Verifying an Indian jewellery supplier before placing a large order protects your investment.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>Why Supplier Verification is Non-Negotiable</h2><p>The Indian jewellery export market, like any global industry, includes both highly professional manufacturers and less reliable operators. For international buyers placing orders worth thousands or tens of thousands of dollars, thorough supplier verification before committing to a purchase is not optional — it is essential risk management.</p>"),
        (185, "choosing-certified-export-partner-india", "Choosing Certified Export Partner India", "Industry Insights", "Certified export partners offer international buyers greater reliability, compliance, and peace of mind.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>What Makes an Export Partner Certified and Reliable</h2><p>In India's jewellery export ecosystem, certification and professional membership are indicators of credibility and commitment to quality standards. Buyers who work with certified export partners — companies with verifiable government registrations, industry body memberships, and third-party quality certifications — significantly reduce their sourcing risk compared to working with unverified suppliers.</p>"),
        (186, "top-mistakes-when-importing-jewellery", "Top Mistakes When Importing Jewellery", "Industry Insights", "Avoid these common mistakes when importing jewellery from India to save money and prevent problems.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>Why First-Time Jewellery Importers Make Costly Mistakes</h2><p>Importing jewellery from India for the first time is an exciting opportunity — but it comes with a learning curve that, without proper guidance, can result in significant financial losses. The most common mistakes are predictable and preventable, yet thousands of first-time buyers make them every year. This guide walks through the most costly errors and how to avoid them.</p>"),
        (187, "questions-to-ask-jewellery-manufacturer", "Questions to Ask Jewellery Manufacturer", "Industry Insights", "Asking the right questions before committing to a jewellery manufacturer saves time, money, and stress.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>The Questions That Separate Serious Buyers from Casual Inquirers</h2><p>Experienced wholesale buyers know that the quality of your supplier evaluation questions directly determines the quality of your sourcing decisions. Manufacturers receive hundreds of inquiries from potential buyers — and the buyers who ask informed, specific questions signal that they are serious, capable partners worth investing time in. These questions also surface critical information that protects your business.</p>"),
        (188, "how-to-avoid-scam-wholesale-suppliers", "How to Avoid Scam Wholesale Suppliers", "Industry Insights", "Protecting yourself from jewellery wholesale scams requires specific verification steps before payment.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>The Reality of Scams in Jewellery Wholesale</h2><p>Jewellery wholesale — particularly in the international trade context — attracts fraudulent operators who target inexperienced buyers with promises of exceptionally low prices, fast delivery, and minimal verification requirements. Understanding the common scam patterns and verification steps that expose them is essential for any buyer entering the Indian jewellery wholesale market for the first time.</p>"),
        (189, "long-term-sourcing-partner-benefits-jewellery", "Long-Term Sourcing Partner Benefits for Jewellery", "Industry Insights", "Building a long-term relationship with one reliable jewellery supplier delivers compounding advantages.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=500&fit=crop", "<h2>Why Long-Term Supplier Relationships Outperform Constant Switching</h2><p>A common mistake among jewellery wholesale buyers is constantly switching suppliers in search of marginally better prices or designs. While exploring new suppliers occasionally makes sense, building a deep, long-term relationship with one or two reliable partners typically delivers far greater value over time than a transactional, lowest-price-wins approach.</p>"),
        (190, "why-gemora-global-manufacturers-stand-out", "Why Gemora Global Style Manufacturers Stand Out", "Industry Insights", "Jaipur's leading manufacturers differentiate through craftsmanship, reliability, and global service standards.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>What Differentiates Top-Tier Jaipur Manufacturers</h2><p>Not all Jaipur jewellery manufacturers are equal. While the city has thousands of production units, a smaller tier of well-established manufacturers consistently outperforms the market on quality, reliability, and international service standards. These are the manufacturers that international boutiques and wholesale buyers return to, season after season, for their most important product categories.</p>"),
        // --- Batch 10: IDs 191–200 ---
        (191, "request-wholesale-jewellery-catalogue-india", "Request Wholesale Jewellery Catalogue India", "Commercial", "Requesting a wholesale jewellery catalogue from India is the first step to sourcing your next bestselling collection.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>What a Quality Jewellery Catalogue Should Contain</h2><p>A professional wholesale jewellery catalogue is more than just product photos. Look for SKU codes for every item, material specifications (brass, zinc alloy, steel), pricing tiers by quantity (50, 100, 500+ pieces), MOQ per design, available colors and finishes, and seasonal collection tags. Digital PDF catalogues shared via WhatsApp or email are standard for Indian suppliers.</p><h2>How to Request a Catalogue</h2><p>When requesting a catalogue, provide context to get the most relevant version. Share your business type (retailer, boutique, online store), your target market and country, your preferred product categories, and your approximate annual purchase volume. Contact Gemora Global on WhatsApp for our latest wholesale catalogue.</p>"),
        (192, "bulk-order-fashion-jewellery-supplier", "Bulk Order Fashion Jewellery Supplier", "Commercial", "Placing a bulk order with an Indian fashion jewellery supplier requires proper planning and communication.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>How to Place a Successful Bulk Jewellery Order</h2><p>Placing a bulk fashion jewellery order from an Indian supplier is not simply a matter of choosing products and paying — it requires structured communication, clear specifications, sample approval, and systematic follow-through to ensure you receive exactly what you expect. Here is the step-by-step process that experienced buyers use to place successful bulk orders.</p>"),
        (193, "get-custom-jewellery-quote-india", "Get Custom Jewellery Quote India", "Commercial", "Getting an accurate custom jewellery quote from India requires sharing the right information upfront.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>How to Get an Accurate Custom Jewellery Quote</h2><p>Getting an accurate, comparable quote from Indian jewellery manufacturers requires sharing the right information upfront. Vague inquiries (I want to order some earrings — how much?) generate equally vague responses that are useless for business planning. Specific, detailed inquiries generate precise quotes that allow direct comparison and informed decision-making.</p>"),
        (194, "buy-latest-jewellery-collection-wholesale", "Buy Latest Jewellery Collection Wholesale", "Commercial", "Buying the latest wholesale jewellery collections from India keeps your retail inventory fresh and competitive.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>Why Fresh Collections Drive Retail Sales</h2><p>Fashion retail runs on novelty. Customers who see the same jewellery styles every time they visit a boutique or scroll through an Instagram store quickly lose interest. Keeping your inventory fresh with new designs — aligned with current trends — is one of the most powerful strategies for driving repeat purchases and maintaining customer engagement.</p>"),
        (195, "moq-for-custom-jewellery-manufacturer", "MOQ for Custom Jewellery Manufacturer", "Commercial", "Custom jewellery MOQs are higher than catalogue items — here is what to expect and how to negotiate.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>Why Custom Jewellery Has Higher MOQs</h2><p>Custom jewellery manufacturing requires significantly higher minimum order quantities than ordering from an existing catalogue. This is because custom orders involve unique mold creation, specialized material procurement, dedicated production setup, and quality verification processes that only become cost-effective when spread across a sufficient production volume.</p>"),
        (196, "fast-delivery-wholesale-jewellery-india", "Fast Delivery Wholesale Jewellery India", "Commercial", "Fast delivery from Indian jewellery suppliers is now achievable for wholesale buyers worldwide.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>How Indian Jewellery Suppliers Achieve Fast Delivery</h2><p>Delivery speed has become a competitive differentiator for Indian jewellery exporters serving international wholesale buyers. As eCommerce has accelerated consumer expectations for fast shipping, wholesale buyers face increasing pressure from their retail customers to maintain leaner inventories with more frequent, smaller replenishment orders. Indian manufacturers have responded by developing faster production and shipping capabilities.</p>"),
        (197, "premium-imitation-jewellery-bulk-supplier", "Premium Imitation Jewellery Bulk Supplier", "Commercial", "Premium quality imitation jewellery from India commands higher retail prices and better margins.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1515562153305-24b6c9e35a22?w=800&h=500&fit=crop", "<h2>What Makes Imitation Jewellery Premium Quality</h2><p>Not all imitation jewellery is created equal. The difference between standard fashion jewellery and premium imitation jewellery is significant — in materials, craftsmanship, finishing, and ultimately in retail price and consumer satisfaction. Understanding what defines premium quality helps wholesale buyers make better sourcing decisions and identify suppliers who can deliver products that command higher margins.</p>"),
        (198, "start-private-label-jewellery-brand-today", "Start Private Label Jewellery Brand Today", "Commercial", "Starting a private label jewellery brand with Indian manufacturers is more accessible than ever.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>Why Now is the Best Time to Launch a Private Label Jewellery Brand</h2><p>The barriers to launching a private label jewellery brand have never been lower. Indian manufacturers offer MOQs as low as 500 units with full branding services, eCommerce platforms make direct-to-consumer selling accessible without significant upfront investment, and social media provides affordable marketing channels to build brand awareness. The combination of these factors has created an unprecedented opportunity for aspiring jewellery brand founders.</p>"),
        (199, "contact-trusted-exporter-for-jewellery", "Contact Trusted Exporter for Jewellery", "Commercial", "Finding and contacting a trusted Indian jewellery exporter is the first step to profitable wholesale sourcing.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>How to Find and Contact Reliable Indian Jewellery Exporters</h2><p>Finding a trustworthy Indian jewellery exporter requires more than a Google search. With thousands of manufacturers, traders, and exporters competing for international buyer attention, distinguishing reliable partners from unreliable ones demands a structured discovery and verification process. This guide walks you through the most effective channels and methods for finding and contacting trusted Indian jewellery exporters.</p>"),
        (200, "wholesale-jewellery-inquiry-guide", "Wholesale Jewellery Inquiry Guide", "Commercial", "Making an effective wholesale jewellery inquiry gets you faster responses and better pricing from Indian suppliers.", "Gemora Global Team", "July 15, 2025", "6 min read", "Published", "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800&h=500&fit=crop", "<h2>Why Your Inquiry Quality Determines Your Response Quality</h2><p>Indian jewellery manufacturers and exporters receive hundreds of wholesale inquiries every month. The response you receive — speed, detail, and pricing quality — is directly influenced by the quality of your initial inquiry. Suppliers prioritise serious, well-informed buyers who clearly communicate their requirements and demonstrate knowledge of the wholesale process.</p>"),
      ];
      for ((id, slug, title, category, excerpt, author, date, readTime, status, image, content) in batchBlogs.vals()) {
        if (blogPostsMap.get(id) == null) {
          blogPostsMap.add(id, { id; slug; title; category; excerpt; author; date; readTime; status; image; content; createdAt = Int.abs(Time.now()) });
          if (id >= nextBlogPostId) { nextBlogPostId := id + 1 };
        };
      };
      blogSeedV2Done := true;
    };

    // No Kanhai products seeded — admin can add products via CSV import or admin panel
  };


  // User Profile API

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Public API

  public query func getCategories() : async [Category] {
    categoriesMap.values().toArray().sort();
  };

  public query func getProducts(categoryId : ?Nat) : async [Product] {
    productsMap.values().toArray().filter(
      func(p) {
        switch (categoryId) {
          case (null) { true };
          case (?catId) { p.categoryId == catId };
        };
      }
    );
  };

  public query func getProduct(id : Nat) : async ?Product {
    productsMap.get(id);
  };

  public query func getFeaturedProducts() : async [Product] {
    productsMap.values().toArray().filter(func(p) { p.featured });
  };

  public query func getNewArrivalProducts() : async [Product] {
    let newArrivals = productsMap.values().toArray().filter(func(p) { p.isNewArrival });
    if (newArrivals.size() > 0) {
      newArrivals.sort(func(a : Product, b : Product) : Order.Order { Int.compare(b.createdAt, a.createdAt) });
    } else {
      let all = productsMap.values().toArray().sort(func(a : Product, b : Product) : Order.Order { Int.compare(b.createdAt, a.createdAt) });
      if (all.size() <= 8) { all } else {
        all.sliceToArray(0, 8);
      };
    };
  };

  public query func getGallery(itemType : ?Text) : async [GalleryItem] {
    let filtered = galleryItemsMap.values().toArray().filter(
      func(item) {
        switch (itemType) {
          case (null) { true };
          case (?t) { Text.equal(item.itemType, t) };
        };
      }
    );
    filtered.sort();
  };

  // Paginated queries — page is 0-indexed
  public query func getProductsPaginated(categoryId : ?Nat, page : Nat, pageSize : Nat) : async { items : [Product]; total : Nat; pages : Nat } {
    let all = productsMap.values().toArray().filter(
      func(p : Product) : Bool {
        switch (categoryId) {
          case (null) { true };
          case (?catId) { p.categoryId == catId };
        };
      }
    );
    let total = all.size();
    let safePageSize = if (pageSize == 0) { 20 } else { pageSize };
    let pages = if (total == 0) { 1 } else { (total + safePageSize - 1) / safePageSize };
    let start = page * safePageSize;
    let items = if (start >= total) {
      [] : [Product];
    } else {
      let end = Nat.min(start + safePageSize, total);
      all.sliceToArray(start, end);
    };
    { items; total; pages };
  };

  public query func getGalleryPaginated(itemType : ?Text, page : Nat, pageSize : Nat) : async { items : [GalleryItem]; total : Nat; pages : Nat } {
    let all = galleryItemsMap.values().toArray().filter(
      func(item : GalleryItem) : Bool {
        switch (itemType) {
          case (null) { true };
          case (?t) { Text.equal(item.itemType, t) };
        };
      }
    ).sort();
    let total = all.size();
    let safePageSize = if (pageSize == 0) { 20 } else { pageSize };
    let pages = if (total == 0) { 1 } else { (total + safePageSize - 1) / safePageSize };
    let start = page * safePageSize;
    let items = if (start >= total) {
      [] : [GalleryItem];
    } else {
      let end = Nat.min(start + safePageSize, total);
      all.sliceToArray(start, end);
    };
    { items; total; pages };
  };

  public query func getBlogPostsPaginated(status : ?Text, page : Nat, pageSize : Nat) : async { items : [BlogPost]; total : Nat; pages : Nat } {
    let all = blogPostsMap.values().toArray().filter(
      func(p : BlogPost) : Bool {
        switch (status) {
          case (null) { true };
          case (?s) { Text.equal(p.status, s) };
        };
      }
    ).sort(BlogPost.compareByDate);
    let total = all.size();
    let safePageSize = if (pageSize == 0) { 20 } else { pageSize };
    let pages = if (total == 0) { 1 } else { (total + safePageSize - 1) / safePageSize };
    let start = page * safePageSize;
    let items = if (start >= total) {
      [] : [BlogPost];
    } else {
      let end = Nat.min(start + safePageSize, total);
      all.sliceToArray(start, end);
    };
    { items; total; pages };
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonialsMap.values().toArray().filter(func(t) { t.active })
      .sort(Testimonial.compareByRating);
  };

  public query func getContent(key : Text) : async ?Text {
    contentEntries.get(key);
  };

  public shared func submitInquiry(name : Text, country : Text, whatsapp : Text, requirement : Text, productId : ?Nat) : async Nat {
    let inquiry : Inquiry = {
      id = nextInquiryId;
      name;
      country;
      whatsapp;
      requirement;
      productId;
      createdAt = Int.abs(Time.now());
      status = "new";
      source = ?"Website";
      qualified = ?false;
      pipelineStage = ?"New";
    };
    inquiriesMap.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
    inquiry.id;
  };

  public shared func addCustomer(cust : { name : Text; company : Text; country : Text; email : Text; whatsapp : Text; businessType : Text; creditLimit : Text; accountManager : Text; notes : Text; tags : [Text] }) : async Nat {
    let id = nextCustomerId;
    nextCustomerId += 1;
    let customer : Customer = {
      id;
      name = cust.name;
      company = cust.company;
      country = cust.country;
      email = cust.email;
      whatsapp = cust.whatsapp;
      businessType = cust.businessType;
      creditLimit = cust.creditLimit;
      accountManager = cust.accountManager;
      notes = cust.notes;
      tags = cust.tags;
      createdAt = Int.abs(Time.now());
    };
    customersMap.add(id, customer);
    id;
  };

  public query func getCustomers() : async [Customer] {
    customersMap.values().toArray();
  };

  public shared func updateCustomer(id : Nat, cust : { name : Text; company : Text; country : Text; email : Text; whatsapp : Text; businessType : Text; creditLimit : Text; accountManager : Text; notes : Text; tags : [Text] }) : async () {
    switch (customersMap.get(id)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?existing) {
        customersMap.add(id, {
          id;
          name = cust.name;
          company = cust.company;
          country = cust.country;
          email = cust.email;
          whatsapp = cust.whatsapp;
          businessType = cust.businessType;
          creditLimit = cust.creditLimit;
          accountManager = cust.accountManager;
          notes = cust.notes;
          tags = cust.tags;
          createdAt = existing.createdAt;
        });
      };
    };
  };

  public shared func deleteCustomer(id : Nat) : async () {
    customersMap.remove(id);
  };

  public shared func addOrder(ord : { orderId : Text; buyer : Text; company : Text; email : Text; phone : Text; country : Text; address : Text; amount : Text; currency : Text; paymentMethod : Text; orderType : Text; status : Text; trackingNumber : Text; courier : Text; items : [OrderItem]; notes : Text }) : async Nat {
    let id = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id;
      orderId = ord.orderId;
      buyer = ord.buyer;
      company = ord.company;
      email = ord.email;
      phone = ord.phone;
      country = ord.country;
      address = ord.address;
      amount = ord.amount;
      currency = ord.currency;
      paymentMethod = ord.paymentMethod;
      orderType = ord.orderType;
      status = ord.status;
      trackingNumber = ord.trackingNumber;
      courier = ord.courier;
      items = ord.items;
      notes = ord.notes;
      createdAt = Int.abs(Time.now());
    };
    ordersMap.add(id, order);
    id;
  };

  public query func getOrders() : async [Order] {
    ordersMap.values().toArray();
  };

  public shared func updateOrder(id : Nat, ord : { orderId : Text; buyer : Text; company : Text; email : Text; phone : Text; country : Text; address : Text; amount : Text; currency : Text; paymentMethod : Text; orderType : Text; status : Text; trackingNumber : Text; courier : Text; items : [OrderItem]; notes : Text }) : async () {
    switch (ordersMap.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existing) {
        ordersMap.add(id, {
          id;
          orderId = ord.orderId;
          buyer = ord.buyer;
          company = ord.company;
          email = ord.email;
          phone = ord.phone;
          country = ord.country;
          address = ord.address;
          amount = ord.amount;
          currency = ord.currency;
          paymentMethod = ord.paymentMethod;
          orderType = ord.orderType;
          status = ord.status;
          trackingNumber = ord.trackingNumber;
          courier = ord.courier;
          items = ord.items;
          notes = ord.notes;
          createdAt = existing.createdAt;
        });
      };
    };
  };

  public shared func deleteOrder(id : Nat) : async () {
    ordersMap.remove(id);
  };

  public shared func recordVisit() : async () { () };

  // Blog Post API

  public query func getBlogPosts(status : ?Text) : async [BlogPost] {
    let filtered = blogPostsMap.values().toArray().filter(
      func(p) {
        switch (status) {
          case (null) { true };
          case (?s) { Text.equal(p.status, s) };
        };
      }
    );
    filtered.sort(BlogPost.compareByDate);
  };

  public query func getBlogPost(slug : Text) : async ?BlogPost {
    for (post in blogPostsMap.values()) {
      if (Text.equal(post.slug, slug)) return ?post;
    };
    null;
  };

  public shared func createBlogPost(slug : Text, title : Text, category : Text, excerpt : Text, author : Text, date : Text, readTime : Text, status : Text, image : Text, content : Text) : async Nat {
    let post : BlogPost = {
      id = nextBlogPostId;
      slug;
      title;
      category;
      excerpt;
      author;
      date;
      readTime;
      status;
      image;
      content;
      createdAt = Int.abs(Time.now());
    };
    blogPostsMap.add(nextBlogPostId, post);
    nextBlogPostId += 1;
    post.id;
  };

  public shared func updateBlogPost(id : Nat, slug : Text, title : Text, category : Text, excerpt : Text, author : Text, date : Text, readTime : Text, status : Text, image : Text, content : Text) : async () {
    switch (blogPostsMap.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?existing) {
        blogPostsMap.add(id, { id; slug; title; category; excerpt; author; date; readTime; status; image; content; createdAt = existing.createdAt });
      };
    };
  };

  public shared func deleteBlogPost(id : Nat) : async () {
    blogPostsMap.remove(id);
  };

  // Catalogue API

  public query func getCatalogues() : async [Catalogue] {
    cataloguesMap.values().toArray().sort(Catalogue.compareByDate);
  };

  public shared func createCatalogue(title : Text, description : Text, fileUrl : Text, fileName : Text, uploadedAt : Text) : async Nat {
    let cat : Catalogue = {
      id = nextCatalogueId;
      title;
      description;
      fileUrl;
      fileName;
      uploadedAt;
      createdAt = Int.abs(Time.now());
    };
    cataloguesMap.add(nextCatalogueId, cat);
    nextCatalogueId += 1;
    cat.id;
  };

  public shared func deleteCatalogue(id : Nat) : async () {
    cataloguesMap.remove(id);
  };

  // Admin API (no principal check - protected by frontend password session)

  public shared func createCategory(name : Text, description : Text, imageUrl : Text, sortOrder : Int) : async Nat {
    let category : Category = {
      id = nextCategoryId;
      name;
      description;
      imageUrl;
      sortOrder;
    };
    categoriesMap.add(nextCategoryId, category);
    nextCategoryId += 1;
    category.id;
  };

  public shared func updateCategory(id : Nat, name : Text, description : Text, imageUrl : Text, sortOrder : Int) : async () {
    switch (categoriesMap.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categoriesMap.add(id, { id; name; description; imageUrl; sortOrder });
      };
    };
  };

  public shared func deleteCategory(id : Nat) : async () {
    categoriesMap.remove(id);
  };

  public shared func createProduct(categoryId : Nat, name : Text, description : Text, moq : Text, imageUrls : [Text], featured : Bool, isNewArrival : Bool, sku : ?Text, subcategory : ?Text, color : ?Text, keyFeatures : ?Text) : async Nat {
    let product : Product = {
      id = nextProductId;
      categoryId;
      name;
      description;
      moq;
      imageUrls;
      featured;
      isNewArrival;
      createdAt = Int.abs(Time.now());
      sku;
      subcategory;
      color;
      keyFeatures;
    };
    productsMap.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared func updateProduct(id : Nat, categoryId : Nat, name : Text, description : Text, moq : Text, imageUrls : [Text], featured : Bool, isNewArrival : Bool, sku : ?Text, subcategory : ?Text, color : ?Text, keyFeatures : ?Text) : async () {
    switch (productsMap.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        productsMap.add(id, { id; categoryId; name; description; moq; imageUrls; featured; isNewArrival; createdAt = existing.createdAt; sku; subcategory; color; keyFeatures });
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    productsMap.remove(id);
  };

  public shared func createGalleryItem(imageUrl : Text, caption : Text, itemType : Text, sortOrder : Int) : async Nat {
    let item : GalleryItem = { id = nextGalleryItemId; imageUrl; caption; itemType; sortOrder };
    galleryItemsMap.add(nextGalleryItemId, item);
    nextGalleryItemId += 1;
    item.id;
  };

  public shared func updateGalleryItem(id : Nat, imageUrl : Text, caption : Text, itemType : Text, sortOrder : Int) : async () {
    switch (galleryItemsMap.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?_) {
        galleryItemsMap.add(id, { id; imageUrl; caption; itemType; sortOrder });
      };
    };
  };

  public shared func deleteGalleryItem(id : Nat) : async () {
    galleryItemsMap.remove(id);
  };

  public shared func createTestimonial(name : Text, company : Text, country : Text, text : Text, rating : Nat, active : Bool) : async Nat {
    let testimonial : Testimonial = { id = nextTestimonialId; name; company; country; text; rating; active };
    testimonialsMap.add(nextTestimonialId, testimonial);
    nextTestimonialId += 1;
    testimonial.id;
  };

  public shared func updateTestimonial(id : Nat, name : Text, company : Text, country : Text, text : Text, rating : Nat, active : Bool) : async () {
    switch (testimonialsMap.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (?_) {
        testimonialsMap.add(id, { id; name; company; country; text; rating; active });
      };
    };
  };

  public shared func deleteTestimonial(id : Nat) : async () {
    testimonialsMap.remove(id);
  };

  public shared func setContent(key : Text, value : Text) : async () {
    contentEntries.add(key, value);
  };

  // Bulk page content: set multiple fields for a page at once
  public shared func setPageContent(pageId : Text, fields : [(Text, Text)]) : async () {
    for ((field, value) in fields.vals()) {
      contentEntries.add(pageId # "." # field, value);
    };
  };

  // Get all content fields for a page
  public query func getPageContent(pageId : Text) : async [(Text, Text)] {
    let prefix = pageId # ".";
    contentEntries.entries().toArray().filterMap<(Text, Text), (Text, Text)>(
      func(entry) {
        let k = entry.0;
        let v = entry.1;
        if (k.startsWith(#text prefix)) {
          let fieldName = switch (k.stripStart(#text prefix)) {
            case (?f) { f };
            case null { k };
          };
          ?(fieldName, v)
        } else {
          null
        };
      }
    );
  };

  public query func getInquiries() : async [Inquiry] {
    inquiriesMap.values().toArray();
  };

  public shared func updateInquiryStatus(id : Nat, status : Text) : async () {
    switch (inquiriesMap.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        inquiriesMap.add(id, { inquiry with status });
      };
    };
  };

  public shared func updateInquiryCRM(id : Nat, source : ?Text, qualified : ?Bool, pipelineStage : ?Text) : async () {
    switch (inquiriesMap.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        inquiriesMap.add(id, { inquiry with source; qualified; pipelineStage });
      };
    };
  };

  public shared func deleteInquiry(id : Nat) : async () {
    inquiriesMap.remove(id);
  };

  public query func getDashboardStats() : async {
    totalInquiries : Nat;
    newInquiries : Nat;
    totalProducts : Nat;
    totalCategories : Nat;
    totalVisits : Nat;
    totalGalleryItems : Nat;
    totalBlogPosts : Nat;
    totalCatalogues : Nat;
  } {
    let newInquiriesCount = inquiriesMap.values().toArray().filter(
      func(inq : Inquiry) : Bool { Text.equal(inq.status, "new") }
    ).size();
    {
      totalInquiries = inquiriesMap.size();
      newInquiries = newInquiriesCount;
      totalProducts = productsMap.size();
      totalCategories = categoriesMap.size();
      totalVisits = 0;
      totalGalleryItems = galleryItemsMap.size();
      totalBlogPosts = blogPostsMap.size();
      totalCatalogues = cataloguesMap.size();
    };
  };

  public query func getProductBySlug(slug : Text) : async ?Product {
    for (product in productsMap.values()) {
      // Generate slug from product name: lowercase, spaces to hyphens
      let nameSlug = product.name.toLower().replace(#char ' ', "-");
      if (Text.equal(nameSlug, slug)) return ?product;
    };
    // Also try matching by id if slug is a number
    switch (Nat.fromText(slug)) {
      case (?id) { productsMap.get(id) };
      case null { null };
    };
  };

  public query func getProductsByCategory(categoryId : Nat) : async [Product] {
    productsMap.values().toArray().filter(func(p : Product) : Bool { p.categoryId == categoryId });
  };

  public query func getInquiriesStats() : async [{ country : Text; count : Nat }] {
    let all = inquiriesMap.values().toArray();
    // Collect unique countries
    let seen = Map.empty<Text, Nat>();
    for (inq in all.vals()) {
      let prev = switch (seen.get(inq.country)) {
        case (?n) { n };
        case null { 0 };
      };
      seen.add(inq.country, prev + 1);
    };
    seen.entries().toArray().map<(Text, Nat), { country : Text; count : Nat }>(
      func((country, count)) { { country; count } }
    );
  };
};
