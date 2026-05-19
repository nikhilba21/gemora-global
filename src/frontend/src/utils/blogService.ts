import { BlogPost } from "../types/blog";
import { BLOG_BATCHES } from "./blogStore";

/**
 * Service to handle blog data loading and search.
 * This will eventually fetch from a JSON file or API to reduce bundle size and IDE lag.
 */
class BlogService {
  private static instance: BlogService;
  private allPosts: BlogPost[] = [];

  private constructor() {
    // Initially populate from static batches
    this.allPosts = Object.values(BLOG_BATCHES).flat();
  }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  /**
   * Get all blog posts.
   */
  public getAllPosts(): BlogPost[] {
    return this.allPosts;
  }

  /**
   * Loads posts from a JSON file.
   */
  public async loadBatchFromJson(batchId: number): Promise<void> {
    try {
      const response = await fetch(`/data/blogData${batchId}.json`);
      if (!response.ok) throw new Error(`Failed to load batch ${batchId}`);
      const data: BlogPost[] = await response.json();
      
      // Merge with existing posts, avoiding duplicates
      const existingIds = new Set(this.allPosts.map(p => p.id));
      const newPosts = data.filter(p => !existingIds.has(p.id));
      this.allPosts = [...this.allPosts, ...newPosts];
    } catch (error) {
      console.error(`Error loading blog batch ${batchId}:`, error);
    }
  }

  /**
   * Get a post by its slug (now async to support on-demand loading).
   */
  public async getPostBySlugAsync(slug: string): Promise<BlogPost | undefined> {
    let post = this.allPosts.find((p) => p.slug === slug);
    if (!post) {
      // Try to find which batch it might belong to and load it
      // For now, we manually trigger a load if it's missing
      // In a full implementation, we'd have a slug-to-batch mapping
      await this.loadBatchFromJson(62); 
      post = this.allPosts.find((p) => p.slug === slug);
    }
    return post;
  }

  /**
   * Get posts by category.
   */
  public getPostsByCategory(category: string): BlogPost[] {
    return this.allPosts.filter((post) => post.category === category);
  }

  /**
   * Search posts by title or content.
   */
  public searchPosts(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return this.allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery)
    );
  }
}

export const blogService = BlogService.getInstance();

/**
 * Deterministically retrieves a highly relevant, high-resolution, non-broken
 * jewellery image based on the post category, title, or tags to prevent broken/repeated images.
 */
export function getSafeBlogImage(post: { id: number; slug: string; title: string; category?: string } | undefined): string {
  if (!post) {
    return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
  }

  // Curated list of premium, verified, fast-loading Unsplash jewelry & trade photos
  const images = {
    kundan: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80", // Gold kundan/polki bridal set
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80", // Traditional Indian red/gold necklace
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80", // Close-up details of gold plating
    ],
    oxidised: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80", // Gorgeous silver oxidized jhumkas & rings
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80", // Handcrafted rustic neckpiece
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80", // Fine details of vintage silver finish
    ],
    diamond: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80", // Sparkling CZ diamond bracelets & earrings
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80", // Luxury modern gold and stone settings
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80", // Premium crystals on black satin
    ],
    business: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", // Upscale jewelry showroom layout
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", // Logistics center / B2B global building
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", // Wholesale planning / premium trade operations
    ],
    packaging: [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80", // Premium branded gift box opening
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", // Beautiful jewelry box packaging and display
    ]
  };

  const titleLower = post.title.toLowerCase();
  const categoryLower = (post.category || "").toLowerCase();

  let chosenList = images.diamond; // default modern fashion jewellery look

  // Categorize based on keywords
  if (
    titleLower.includes("kundan") ||
    titleLower.includes("bridal") ||
    titleLower.includes("wedding") ||
    titleLower.includes("temple") ||
    titleLower.includes("meenakari") ||
    titleLower.includes("traditional") ||
    categoryLower.includes("bridal")
  ) {
    chosenList = images.kundan;
  } else if (
    titleLower.includes("oxidised") ||
    titleLower.includes("oxidized") ||
    titleLower.includes("silver") ||
    titleLower.includes("jhumka") ||
    titleLower.includes("boho") ||
    titleLower.includes("antique")
  ) {
    chosenList = images.oxidised;
  } else if (
    titleLower.includes("packaging") ||
    titleLower.includes("care") ||
    titleLower.includes("quality") ||
    titleLower.includes("box")
  ) {
    chosenList = images.packaging;
  } else if (
    titleLower.includes("export") ||
    titleLower.includes("import") ||
    titleLower.includes("wholesale") ||
    titleLower.includes("business") ||
    titleLower.includes("market") ||
    titleLower.includes("supplier") ||
    titleLower.includes("manufacturer") ||
    titleLower.includes("country") ||
    categoryLower.includes("export") ||
    categoryLower.includes("wholesale") ||
    categoryLower.includes("business") ||
    categoryLower.includes("manufacturing")
  ) {
    chosenList = images.business;
  }

  // Generate a deterministic integer hash from the unique slug to prevent adjacent duplicates
  const key = post.slug || post.title;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % chosenList.length;

  return chosenList[index];
}
