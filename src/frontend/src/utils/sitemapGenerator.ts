/**
 * Image Sitemap Generator Utility
 */
import api from '../lib/api';

export async function generateImageSitemap() {
  try {
    // 1. Fetch all products
    const productsRes = await api.getProducts({ page: '0', pageSize: '5000' });
    const products = productsRes?.items || [];

    // 2. Fetch all gallery folders
    const folders = await api.getGalleryFolders() as any[];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add Products
    for (const p of products) {
      if (p.imageUrls && p.imageUrls.length > 0) {
        xml += `  <url>
    <loc>https://www.gemoraglobal.co/products/item/${p.id}</loc>
`;
        for (const url of p.imageUrls) {
          xml += `    <image:image>
      <image:loc>${url}</image:loc>
      <image:title>${p.name}</image:title>
      <image:caption>Wholesale ${p.name} from Jaipur India for global export</image:caption>
    </image:image>
`;
        }
        xml += `  </url>\n`;
      }
    }

    // Add Gallery Folders
    for (const f of folders) {
      const folderData = await api.getGalleryFolderImages(f.id);
      const images = (folderData?.images as any[]) || [];
      if (images.length > 0) {
        xml += `  <url>
    <loc>https://www.gemoraglobal.co/gallery</loc>
`;
        for (const img of images) {
          xml += `    <image:image>
      <image:loc>${img.imageUrl}</image:loc>
      <image:title>${f.name}</image:title>
      <image:caption>${img.caption || `Wholesale ${f.name} from Jaipur India for global export`}</image:caption>
    </image:image>
`;
        }
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;
    return xml;
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    throw error;
  }
}
