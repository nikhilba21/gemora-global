// src/frontend/src/api.ts
// Drop-in replacement for the old ICP/Motoko backend
// Now calls our Node.js REST API on Render

const API_BASE = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  moq: string;
  imageUrls: string[];
  featured: boolean;
  isNewArrival: boolean;
  sku?: string;
  subcategory?: string;
  color?: string;
  keyFeatures?: string;
  createdAt: number;
}

export interface Inquiry {
  id: number;
  name: string;
  country: string;
  whatsapp: string;
  requirement: string;
  productId?: number;
  status: string;
  createdAt: number;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
  itemType: string;
  sortOrder: number;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  country: string;
  text: string;
  rating: number;
  active: boolean;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  status: string;
  image: string;
  content: string;
  createdAt: number;
}

export interface Catalogue {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  createdAt: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  pages: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  newInquiries: number;
  totalGalleryItems: number;
  totalBlogPosts: number;
  totalCatalogues: number;
  totalVisits: number;
}

// ─── HTTP helpers ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  login: (username: string, password: string) =>
    apiFetch<{ success: boolean; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verify: () => apiFetch<{ success: boolean }>('/api/auth/verify'),

  changeCredentials: (currentUsername: string, currentPassword: string, newUsername: string, newPassword: string) =>
    apiFetch<{ success: boolean }>('/api/auth/change-credentials', {
      method: 'POST',
      body: JSON.stringify({ currentUsername, currentPassword, newUsername, newPassword }),
    }),

  // For backward compat with old Motoko verifyAdminLogin
  verifyAdminLogin: async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await auth.login(username, password);
      if (res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = {
  getAll: () => apiFetch<Category[]>('/api/categories'),
  getById: (id: number) => apiFetch<Category>(`/api/categories/${id}`),
  create: (data: Omit<Category, 'id'>) =>
    apiFetch<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Category>) =>
    apiFetch<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/categories/${id}`, { method: 'DELETE' }),
};

// ─── Products ────────────────────────────────────────────────────────────────

export const products = {
  getAll: (categoryId?: number) =>
    apiFetch<Product[]>(`/api/products${categoryId ? `?categoryId=${categoryId}` : ''}`),

  getPaginated: (categoryId: number | null, page: number, pageSize: number) =>
    apiFetch<PaginatedResult<Product>>(`/api/products?page=${page}&pageSize=${pageSize}${categoryId ? `&categoryId=${categoryId}` : ''}`),

  getFeatured: () => apiFetch<Product[]>('/api/products/featured'),
  getNewArrivals: () => apiFetch<Product[]>('/api/products/new-arrivals'),
  getById: (id: number) => apiFetch<Product>(`/api/products/${id}`),
  getBySlug: (slug: string) => apiFetch<Product>(`/api/products/${slug}`),
  getByCategory: (categoryId: number) => apiFetch<Product[]>(`/api/products?categoryId=${categoryId}`),

  create: (data: Omit<Product, 'id' | 'createdAt'>) =>
    apiFetch<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Product>) =>
    apiFetch<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/products/${id}`, { method: 'DELETE' }),
};

// ─── Inquiries ───────────────────────────────────────────────────────────────

export const inquiries = {
  submit: (name: string, country: string, whatsapp: string, requirement: string, productId?: number) =>
    apiFetch<{ id: number; success: boolean }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ name, country, whatsapp, requirement, productId }),
    }),
  getAll: () => apiFetch<Inquiry[]>('/api/inquiries'),
  getStats: () => apiFetch<{ country: string; count: number }[]>('/api/inquiries/stats'),
  updateStatus: (id: number, status: string) =>
    apiFetch<{ success: boolean }>(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/inquiries/${id}`, { method: 'DELETE' }),
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const gallery = {
  getAll: (itemType?: string) =>
    apiFetch<GalleryItem[]>(`/api/gallery${itemType ? `?itemType=${itemType}` : ''}`),
  getPaginated: (itemType: string | null, page: number, pageSize: number) =>
    apiFetch<PaginatedResult<GalleryItem>>(`/api/gallery?page=${page}&pageSize=${pageSize}${itemType ? `&itemType=${itemType}` : ''}`),
  create: (data: Omit<GalleryItem, 'id'>) =>
    apiFetch<GalleryItem>('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<GalleryItem>) =>
    apiFetch<GalleryItem>(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/gallery/${id}`, { method: 'DELETE' }),
};

// ─── Testimonials ────────────────────────────────────────────────────────────

export const testimonials = {
  getAll: () => apiFetch<Testimonial[]>('/api/testimonials'),
  getAllAdmin: () => apiFetch<Testimonial[]>('/api/testimonials/all'),
  create: (data: Omit<Testimonial, 'id'>) =>
    apiFetch<Testimonial>('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Testimonial>) =>
    apiFetch<Testimonial>(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/testimonials/${id}`, { method: 'DELETE' }),
};

// ─── Blog ────────────────────────────────────────────────────────────────────

export const blog = {
  getAll: (status?: string) =>
    apiFetch<BlogPost[]>(`/api/blog${status ? `?status=${status}` : ''}`),
  getPaginated: (status: string | null, page: number, pageSize: number) =>
    apiFetch<PaginatedResult<BlogPost>>(`/api/blog?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`),
  getBySlug: (slug: string) => apiFetch<BlogPost>(`/api/blog/${slug}`),
  create: (data: Omit<BlogPost, 'id' | 'createdAt'>) =>
    apiFetch<BlogPost>('/api/blog', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<BlogPost>) =>
    apiFetch<BlogPost>(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/blog/${id}`, { method: 'DELETE' }),
};

// ─── Catalogues ──────────────────────────────────────────────────────────────

export const catalogues = {
  getAll: () => apiFetch<Catalogue[]>('/api/catalogues'),
  create: (data: Omit<Catalogue, 'id' | 'createdAt'>) =>
    apiFetch<Catalogue>('/api/catalogues', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/catalogues/${id}`, { method: 'DELETE' }),
};

// ─── Content ─────────────────────────────────────────────────────────────────

export const content = {
  get: (key: string) => apiFetch<{ value: string | null }>(`/api/content/${key}`),
  getPage: (pageId: string) => apiFetch<[string, string][]>(`/api/content/page/${pageId}`),
  set: (key: string, value: string) =>
    apiFetch<{ success: boolean }>('/api/content', { method: 'POST', body: JSON.stringify({ key, value }) }),
  setPage: (pageId: string, fields: [string, string][]) =>
    apiFetch<{ success: boolean }>('/api/content/page', { method: 'POST', body: JSON.stringify({ pageId, fields }) }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboard = {
  getStats: () => apiFetch<DashboardStats>('/api/dashboard/stats'),
};

// ─── Default export (backward compat) ────────────────────────────────────────

const api = { auth, categories, products, inquiries, gallery, testimonials, blog, catalogues, content, dashboard };
export default api;
