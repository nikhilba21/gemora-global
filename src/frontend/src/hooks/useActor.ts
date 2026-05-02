// useActor.ts — REST API replacement for ICP actor
// Provides same interface as before: { actor, isFetching }

const API_BASE = (import.meta as { env: Record<string, string> }).env?.VITE_API_URL || 'https://gemora-global-2.onrender.com';

function getToken() {
  return sessionStorage.getItem('adminToken') || localStorage.getItem('admin_token') || '';
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// Convert number IDs to bigint for backward compat with existing pages
function toBig(v: number | bigint | string | undefined | null): bigint {
  if (v === undefined || v === null) return BigInt(0);
  return BigInt(v);
}

function fromBig(v: bigint | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return Number(v);
}

// Shape returned product to match old ICP types (bigint ids, optional arrays)
function shapeProduct(p: Record<string, unknown>) {
  return {
    ...p,
    id: toBig(p.id as number),
    categoryId: toBig(p.categoryId as number),
    createdAt: toBig(p.createdAt as number),
    imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
    featured: Boolean(p.featured),
    isNewArrival: Boolean(p.isNewArrival),
  };
}

function shapeCategory(c: Record<string, unknown>) {
  return { ...c, id: toBig(c.id as number), sortOrder: toBig(c.sortOrder as number) };
}

function shapeInquiry(i: Record<string, unknown>) {
  return {
    ...i,
    id: toBig(i.id as number),
    createdAt: toBig(i.createdAt as number),
    productId: i.productId ? [toBig(i.productId as number)] : [],
  };
}

function shapeGallery(g: Record<string, unknown>) {
  return { ...g, id: toBig(g.id as number), sortOrder: toBig(g.sortOrder as number) };
}

function shapeTestimonial(t: Record<string, unknown>) {
  return { ...t, id: toBig(t.id as number), rating: toBig(t.rating as number) };
}

function shapeBlog(b: Record<string, unknown>) {
  return { ...b, id: toBig(b.id as number), createdAt: toBig(b.createdAt as number) };
}

function shapeCatalogue(c: Record<string, unknown>) {
  return { ...c, id: toBig(c.id as number), createdAt: toBig(c.createdAt as number) };
}

function shapeStats(s: Record<string, unknown>) {
  return {
    totalProducts: toBig(s.totalProducts as number),
    totalCategories: toBig(s.totalCategories as number),
    totalInquiries: toBig(s.totalInquiries as number),
    newInquiries: toBig(s.newInquiries as number),
    totalGalleryItems: toBig(s.totalGalleryItems as number),
    totalBlogPosts: toBig(s.totalBlogPosts as number),
    totalCatalogues: toBig(s.totalCatalogues as number),
    totalVisits: toBig((s.totalVisits as number) || 0),
  };
}

// The actor object — same method signatures as old ICP backend
const actor = {
  // ── Auth ──────────────────────────────────────────────────────
  async verifyAdminLogin(username: string, password: string): Promise<boolean> {
    try {
      const res = await apiFetch<{ success: boolean; token: string }>('/api/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password }),
      });
      if (res.success && res.token) {
        sessionStorage.setItem('adminSession', 'true');
        sessionStorage.setItem('adminToken', res.token);
        localStorage.setItem('admin_token', res.token);
        return true;
      }
      return false;
    } catch { return false; }
  },

  async isCallerAdmin(): Promise<boolean> {
    try {
      const token = getToken();
      if (!token) return false;
      await apiFetch('/api/auth/verify');
      return true;
    } catch { return false; }
  },

  async changeAdminCredentials(cu: string, cp: string, nu: string, np: string): Promise<boolean> {
    try {
      const r = await apiFetch<{ success: boolean }>('/api/auth/change-credentials', {
        method: 'POST', body: JSON.stringify({ currentUsername: cu, currentPassword: cp, newUsername: nu, newPassword: np }),
      });
      return r.success;
    } catch { return false; }
  },

  // ── Categories ────────────────────────────────────────────────
  async getCategories() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/categories');
    return data.map(shapeCategory);
  },

  async getCategoryBySlug(slug: string) {
    try {
      const r = await apiFetch<Record<string, unknown>>(`/api/categories/${slug}`);
      return shapeCategory(r);
    } catch { return null; }
  },

  async getCategorySubcategories(categoryId: number | string) {
    try {
      const data = await apiFetch<{ subcategory: string; count: number }[]>(`/api/categories/${categoryId}/subcategories`);
      return data;
    } catch { return []; }
  },

  async createCategory(name: string, description: string, imageUrl: string, sortOrder: bigint): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/categories', {
      method: 'POST', body: JSON.stringify({ name, description, imageUrl, sortOrder: fromBig(sortOrder) }),
    });
    return toBig(r.id);
  },

  async updateCategory(id: bigint, name: string, description: string, imageUrl: string, sortOrder: bigint): Promise<void> {
    await apiFetch(`/api/categories/${fromBig(id)}`, {
      method: 'PUT', body: JSON.stringify({ name, description, imageUrl, sortOrder: fromBig(sortOrder) }),
    });
  },

  async deleteCategory(id: bigint): Promise<void> {
    await apiFetch(`/api/categories/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Products ──────────────────────────────────────────────────
  async getProducts(categoryId: bigint | null) {
    const url = categoryId ? `/api/products?categoryId=${fromBig(categoryId)}` : '/api/products';
    const data = await apiFetch<Record<string, unknown>[]>(url);
    return data.map(shapeProduct);
  },

  async getProductsByCategory(categoryId: bigint) {
    const data = await apiFetch<Record<string, unknown>[]>(`/api/products?categoryId=${fromBig(categoryId)}`);
    return data.map(shapeProduct);
  },

  async getProductsPaginated(categoryId: bigint | null, page: bigint, pageSize: bigint, subcategory?: string) {
    const cid = categoryId ? `&categoryId=${fromBig(categoryId)}` : '';
    const sub = subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : '';
    const r = await apiFetch<{ items: Record<string, unknown>[]; total: number; pages: number }>(
      `/api/products?page=${fromBig(page)}&pageSize=${fromBig(pageSize)}${cid}${sub}`
    );
    return { items: r.items.map(shapeProduct), total: toBig(r.total), pages: toBig(r.pages) };
  },

  async getFeaturedProducts() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/products/featured');
    return data.map(shapeProduct);
  },

  async getNewArrivalProducts() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/products/new-arrivals');
    return data.map(shapeProduct);
  },

  async getProduct(id: bigint) {
    try {
      const r = await apiFetch<Record<string, unknown>>(`/api/products/${fromBig(id)}`);
      return shapeProduct(r);
    } catch { return null; }
  },

  async getProductBySlug(slug: string) {
    try {
      const r = await apiFetch<Record<string, unknown>>(`/api/products/${slug}`);
      return shapeProduct(r);
    } catch { return null; }
  },

  async createProduct(
    categoryId: bigint, name: string, description: string, moq: string,
    imageUrls: string[], featured: boolean, isNewArrival: boolean,
    sku: string | null, subcategory: string | null, color: string | null, keyFeatures: string | null
  ): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/products', {
      method: 'POST',
      body: JSON.stringify({ categoryId: fromBig(categoryId), name, description, moq, imageUrls, featured, isNewArrival, sku, subcategory, color, keyFeatures }),
    });
    return toBig(r.id);
  },

  async updateProduct(
    id: bigint, categoryId: bigint, name: string, description: string, moq: string,
    imageUrls: string[], featured: boolean, isNewArrival: boolean,
    sku: string | null, subcategory: string | null, color: string | null, keyFeatures: string | null
  ): Promise<void> {
    await apiFetch(`/api/products/${fromBig(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ categoryId: fromBig(categoryId), name, description, moq, imageUrls, featured, isNewArrival, sku, subcategory, color, keyFeatures }),
    });
  },

  async deleteProduct(id: bigint): Promise<void> {
    await apiFetch(`/api/products/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Inquiries ─────────────────────────────────────────────────
  async getInquiries() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/inquiries');
    return data.map(shapeInquiry);
  },

  async getInquiriesStats() {
    const data = await apiFetch<{ country: string; count: number }[]>('/api/inquiries/stats');
    return data.map(r => ({ country: r.country, count: toBig(r.count) }));
  },

  async submitInquiry(name: string, country: string, whatsapp: string, requirement: string, productId: bigint | null): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ name, country, whatsapp, requirement, productId: productId ? fromBig(productId) : null }),
    });
    return toBig(r.id);
  },

  async updateInquiryStatus(id: bigint, status: string): Promise<void> {
    await apiFetch(`/api/inquiries/${fromBig(id)}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    });
  },

  // ── Gallery ───────────────────────────────────────────────────
  async getGallery(itemType: string | null) {
    const url = itemType ? `/api/gallery?itemType=${itemType}` : '/api/gallery';
    const data = await apiFetch<Record<string, unknown>[]>(url);
    return data.map(shapeGallery);
  },

  async getGalleryPaginated(itemType: string | null, page: bigint, pageSize: bigint) {
    const it = itemType ? `&itemType=${itemType}` : '';
    const r = await apiFetch<{ items: Record<string, unknown>[]; total: number; pages: number }>(
      `/api/gallery?page=${fromBig(page)}&pageSize=${fromBig(pageSize)}${it}`
    );
    return { items: r.items.map(shapeGallery), total: toBig(r.total), pages: toBig(r.pages) };
  },

  async createGalleryItem(imageUrl: string, caption: string, itemType: string, sortOrder: bigint): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/gallery', {
      method: 'POST', body: JSON.stringify({ imageUrl, caption, itemType, sortOrder: fromBig(sortOrder) }),
    });
    return toBig(r.id);
  },

  async updateGalleryItem(id: bigint, imageUrl: string, caption: string, itemType: string, sortOrder: bigint): Promise<void> {
    await apiFetch(`/api/gallery/${fromBig(id)}`, {
      method: 'PUT', body: JSON.stringify({ imageUrl, caption, itemType, sortOrder: fromBig(sortOrder) }),
    });
  },

  async deleteGalleryItem(id: bigint): Promise<void> {
    await apiFetch(`/api/gallery/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Testimonials ──────────────────────────────────────────────
  async getTestimonials() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/testimonials');
    return data.map(shapeTestimonial);
  },

  async createTestimonial(name: string, company: string, country: string, text: string, rating: bigint, active: boolean): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/testimonials', {
      method: 'POST', body: JSON.stringify({ name, company, country, text, rating: fromBig(rating), active }),
    });
    return toBig(r.id);
  },

  async updateTestimonial(id: bigint, name: string, company: string, country: string, text: string, rating: bigint, active: boolean): Promise<void> {
    await apiFetch(`/api/testimonials/${fromBig(id)}`, {
      method: 'PUT', body: JSON.stringify({ name, company, country, text, rating: fromBig(rating), active }),
    });
  },

  async deleteTestimonial(id: bigint): Promise<void> {
    await apiFetch(`/api/testimonials/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Blog ──────────────────────────────────────────────────────
  async getBlogPosts(status: string | null) {
    // Fetch up to 500 posts for admin panel
    const s = status ? `&status=${status}` : '';
    const r = await apiFetch<{ items: Record<string, unknown>[]; total: number; pages: number }>(
      `/api/blog?page=0&pageSize=500${s}`
    );
    // Handle both paginated and array responses
    const items = Array.isArray(r) ? r : (r.items || []);
    return items.map(shapeBlog);
  },

  async getBlogPostsPaginated(status: string | null, page: bigint, pageSize: bigint) {
    const s = status ? `&status=${status}` : '';
    const r = await apiFetch<{ items: Record<string, unknown>[]; total: number; pages: number }>(
      `/api/blog?page=${fromBig(page)}&pageSize=${fromBig(pageSize)}${s}`
    );
    return { items: r.items.map(shapeBlog), total: toBig(r.total), pages: toBig(r.pages) };
  },

  async getBlogPost(slug: string) {
    try {
      const r = await apiFetch<Record<string, unknown>>(`/api/blog/${slug}`);
      return shapeBlog(r);
    } catch { return null; }
  },

  async createBlogPost(slug: string, title: string, category: string, excerpt: string, author: string, date: string, readTime: string, status: string, image: string, content: string): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/blog', {
      method: 'POST', body: JSON.stringify({ slug, title, category, excerpt, author, date, readTime, status, image, content }),
    });
    return toBig(r.id);
  },

  async updateBlogPost(id: bigint, slug: string, title: string, category: string, excerpt: string, author: string, date: string, readTime: string, status: string, image: string, content: string): Promise<void> {
    await apiFetch(`/api/blog/${fromBig(id)}`, {
      method: 'PUT', body: JSON.stringify({ slug, title, category, excerpt, author, date, readTime, status, image, content }),
    });
  },

  async deleteBlogPost(id: bigint): Promise<void> {
    await apiFetch(`/api/blog/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Catalogues ────────────────────────────────────────────────
  async getCatalogues() {
    const data = await apiFetch<Record<string, unknown>[]>('/api/catalogues');
    return data.map(shapeCatalogue);
  },

  async createCatalogue(title: string, description: string, fileUrl: string, fileName: string, uploadedAt: string): Promise<bigint> {
    const r = await apiFetch<{ id: number }>('/api/catalogues', {
      method: 'POST', body: JSON.stringify({ title, description, fileUrl, fileName, uploadedAt }),
    });
    return toBig(r.id);
  },

  async deleteCatalogue(id: bigint): Promise<void> {
    await apiFetch(`/api/catalogues/${fromBig(id)}`, { method: 'DELETE' });
  },

  // ── Content / CMS ─────────────────────────────────────────────
  async getContent(key: string): Promise<string | null> {
    try {
      const r = await apiFetch<{ value: string | null }>(`/api/content/${key}`);
      return r.value;
    } catch { return null; }
  },

  async setContent(key: string, value: string): Promise<void> {
    await apiFetch('/api/content', { method: 'POST', body: JSON.stringify({ key, value }) });
  },

  async getPageContent(pageId: string): Promise<[string, string][]> {
    try {
      return await apiFetch<[string, string][]>(`/api/content/page/${pageId}`);
    } catch { return []; }
  },

  async setPageContent(pageId: string, fields: [string, string][]): Promise<void> {
    await apiFetch('/api/content/page', { method: 'POST', body: JSON.stringify({ pageId, fields }) });
  },

  // ── Dashboard ─────────────────────────────────────────────────
  async getDashboardStats() {
    const r = await apiFetch<Record<string, unknown>>('/api/dashboard/stats');
    return shapeStats(r);
  },

  // ── Misc (no-ops for compatibility) ───────────────────────────
  async recordVisit(): Promise<void> {
    try { await apiFetch('/api/visit', { method: 'POST' }); } catch { /* ignore */ }
  },

  async getCallerUserRole() { return 'admin'; },
  async isCallerAdmin() { return !!getToken(); },
  async getCallerUserProfile() { return null; },
  async saveCallerUserProfile() {},
  async getUserProfile() { return null; },
  async assignCallerUserRole() {},
  async _initializeAccessControl() {},
};

export type BackendActor = typeof actor;

// Hook — same signature as before: { actor, isFetching }
export function useActor(): { actor: typeof actor; isFetching: boolean } {
  return { actor, isFetching: false };
}
