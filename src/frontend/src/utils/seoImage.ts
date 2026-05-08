/**
 * SEO Image Utility for Gemora Global
 * Handles automatic renaming and ALT text generation for product/gallery images.
 */

const PRIMARY_KEYWORDS = [
  "jaipur-imitation-jewellery-exporter",
  "imitation-jewellery-manufacturer-india",
  "fashion-jewellery-exporter-india",
  "wholesale-imitation-jewellery-supplier",
  "bridal-imitation-jewellery-wholesale"
];

/**
 * Generates SEO-friendly filename and ALT text based on the provided formula.
 * Formula: main-keyword-folder-name-design-code.jpg
 * ALT Formula: Wholesale [folder name] from Jaipur India for global export
 */
export function getSEOImageData(originalName: string, folderName: string = "") {
  // 1. Detect Product Code (patterns like RJ221, N102, AD550, GG-NK-001)
  // Look for 1-3 letters followed by numbers, or typical SKU patterns
  const codeMatch = originalName.match(/([A-Z]{1,3}[-]?[A-Z]{0,2}[-]?[0-9]{2,5})/i);
  const productCode = codeMatch ? codeMatch[1].toUpperCase() : "";

  // 2. Pick a primary keyword (cycled for variety)
  const hash = originalName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const primaryKeyword = PRIMARY_KEYWORDS[hash % PRIMARY_KEYWORDS.length];
  
  // 3. Clean names for SEO URL
  const cleanFolder = (folderName || "jewellery").toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
    
  // 4. Build SEO Filename
  // Formula: [main-keyword]-[folder-name]-[product-code]
  let seoName = `${primaryKeyword}-${cleanFolder}`;
  
  if (productCode && !seoName.includes(productCode.toLowerCase())) {
    seoName += `-${productCode.toLowerCase()}`;
  }

  // Ensure no duplicate separators and trim
  seoName = seoName.replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  // 5. Build ALT Text
  // Formula: Wholesale [folder name] from Jaipur India for global export
  const displayFolder = folderName || "Imitation Jewellery";
  const altText = `Wholesale ${displayFolder} from Jaipur India for global export`;

  return {
    seoName,
    altText,
    productCode
  };
}
