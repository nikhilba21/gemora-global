// Central API client — direct fetch, no ICP/actor dependency
const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
  || 'https://gemora-global-2.onrender.com';

function getToken() {
  return sessionStorage.getItem('adminToken') || localStorage.getItem('admin_token') || '';
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (u: string, p: string) => apiFetch<{ success: boolean; token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) }),
  verify: () => apiFetch('/api/auth/verify'),
  changeCredentials: (cu: string, cp: string, nu: string, np: string) =>
    apiFetch('/api/auth/change-credentials', { method: 'POST', body: JSON.stringify({ currentUsername: cu, currentPassword: cp, newUsername: nu, newPassword: np }) }),

  // Categories
  getCategories: () => apiFetch<Category[]>('/api/categories'),
  getCategory: (id: string | number) => apiFetch<Category>(`/api/categories/${id}`),
  getCategorySubcategories: (id: string | number) => apiFetch<{ subcategory: string; count: number }[]>(`/api/categories/${id}/subcategories`),
  createCategory: (data: Partial<Category>) => apiFetch<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: Partial<Category>) => apiFetch<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) => apiFetch(`/api/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params?: Record<string, string | number>) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiFetch<{ items: Product[]; total: number; pages: number }>(`/api/products${q}`);
  },
  getFeatured: () => apiFetch<Product[]>('/api/products/featured'),
  getNewArrivals: () => apiFetch<Product[]>('/api/products/new-arrivals'),
  getProduct: (id: string | number) => apiFetch<Product>(`/api/products/${id}`),
  createProduct: (data: Partial<Product>) => apiFetch<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Partial<Product>) => apiFetch<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: number) => apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
  bulkProducts: (products: Partial<Product>[]) => apiFetch('/api/products/bulk', { method: 'POST', body: JSON.stringify({ products }) }),

  // Inquiries
  submitInquiry: (data: Record<string, unknown>) => apiFetch('/api/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  getInquiries: () => apiFetch<Inquiry[]>('/api/inquiries'),
  updateInquiryStatus: (id: number, status: string) => apiFetch(`/api/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteInquiry: (id: number) => apiFetch(`/api/inquiries/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: (itemType?: string) => apiFetch<GalleryItem[]>(`/api/gallery${itemType ? `?itemType=${itemType}` : ''}`),
  getGalleryPaginated: (p: Record<string, string | number>) => apiFetch<{ items: GalleryItem[]; total: number; pages: number }>('/api/gallery?' + new URLSearchParams(p as Record<string, string>)),
  createGalleryItem: (data: Partial<GalleryItem>) => apiFetch<GalleryItem>('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id: number, data: Partial<GalleryItem>) => apiFetch<GalleryItem>(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id: number) => apiFetch(`/api/gallery/${id}`, { method: 'DELETE' }),

  // Gallery Folders
  getGalleryFolders: () => apiFetch<GalleryFolder[]>('/api/gallery-folders'),
  getGalleryFolderImages: (id: number) => apiFetch<{ folder: GalleryFolder; images: GalleryItem[] }>(`/api/gallery-folders/${id}/images`),
  createGalleryFolder: (data: { name: string; description: string; sortOrder: number }) => apiFetch<GalleryFolder>('/api/gallery-folders', { method: 'POST', body: JSON.stringify(data) }),
  addImagesToFolder: (id: number, images: { imageUrl: string; caption: string; sortOrder: number }[]) => apiFetch(`/api/gallery-folders/${id}/images`, { method: 'POST', body: JSON.stringify({ images }) }),
  updateGalleryFolder: (id: number, data: Partial<GalleryFolder>) => apiFetch(`/api/gallery-folders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFolderImage: (folderId: number, imgId: number) => apiFetch(`/api/gallery-folders/${folderId}/images/${imgId}`, { method: 'DELETE' }),
  deleteGalleryFolder: (id: number) => apiFetch(`/api/gallery-folders/${id}`, { method: 'DELETE' }),

  // Blog
  getBlogPosts: (params?: Record<string, string | number>) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiFetch<{ items: BlogPost[]; total: number; pages: number }>(`/api/blog${q}`);
  },
  getBlogPost: (slug: string) => apiFetch<BlogPost>(`/api/blog/${slug}`),
  createBlogPost: (data: Partial<BlogPost>) => apiFetch<BlogPost>('/api/blog', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id: number, data: Partial<BlogPost>) => apiFetch<BlogPost>(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlogPost: (id: number) => apiFetch(`/api/blog/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => apiFetch<Testimonial[]>('/api/testimonials'),
  getAllTestimonials: () => apiFetch<Testimonial[]>('/api/testimonials/all'),
  createTestimonial: (data: Partial<Testimonial>) => apiFetch<Testimonial>('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id: number, data: Partial<Testimonial>) => apiFetch<Testimonial>(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id: number) => apiFetch(`/api/testimonials/${id}`, { method: 'DELETE' }),

  // Catalogues
  getCatalogues: () => apiFetch<Catalogue[]>('/api/catalogues'),
  createCatalogue: (data: Partial<Catalogue>) => apiFetch<Catalogue>('/api/catalogues', { method: 'POST', body: JSON.stringify(data) }),
  deleteCatalogue: (id: number) => apiFetch(`/api/catalogues/${id}`, { method: 'DELETE' }),

  // Content / CMS
  getContent: (key: string) => apiFetch<{ value: string | null }>(`/api/content/${key}`),
  getPageContent: (pageId: string) => apiFetch<[string, string][]>(`/api/content/page/${pageId}`),
  setContent: (key: string, value: string) => apiFetch('/api/content', { method: 'POST', body: JSON.stringify({ key, value }) }),
  setPageContent: (pageId: string, fields: [string, string][]) => apiFetch('/api/content/page', { method: 'POST', body: JSON.stringify({ pageId, fields }) }),

  // Dashboard
  getStats: () => apiFetch<DashboardStats>('/api/dashboard/stats'),

  // Contacts
  getContacts: (params?: Record<string, string | number>) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiFetch<{ items: Contact[]; total: number; pages: number }>(`/api/contacts${q}`);
  },
  getContactStats: () => apiFetch('/api/contacts/stats'),
  bulkContacts: (contacts: Partial<Contact>[]) => apiFetch('/api/contacts/bulk', { method: 'POST', body: JSON.stringify({ contacts }) }),
};

// Types
export interface Category { id: number; name: string; slug: string; description: string; imageUrl: string; sortOrder: number; }
export interface Product { id: number; categoryId: number; name: string; description: string; moq: string; imageUrls: string[]; featured: boolean; isNewArrival: boolean; sku?: string; subcategory?: string; color?: string; keyFeatures?: string; createdAt?: number; }
export interface GalleryItem { id: number; imageUrl: string; caption: string; itemType: string; sortOrder: number; }
export interface GalleryFolder { id: number; name: string; description: string; thumbnailUrl: string; sortOrder: number; imageCount: number; }
export interface BlogPost { id: number; slug: string; title: string; category: string; excerpt: string; author: string; date: string; readTime: string; status: string; image: string; content: string; createdAt?: number; }
export interface Testimonial { id: number; name: string; company: string; country: string; text: string; rating: number; active: boolean; }
export interface Catalogue { id: number; title: string; description: string; fileUrl: string; fileName: string; uploadedAt: string; }
export interface Inquiry { id: number; name: string; country: string; whatsapp: string; requirement: string; productId?: number; status: string; createdAt?: number; }
export interface Contact { id: number; name: string; company: string; email: string; phone: string; country: string; productInterest: string; source: string; tags: string; }
export interface DashboardStats { totalProducts: number; totalCategories: number; totalInquiries: number; newInquiries: number; totalGalleryItems: number; totalBlogPosts: number; totalCatalogues: number; totalVisits: number; }

export default api;
