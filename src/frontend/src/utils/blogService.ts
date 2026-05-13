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
