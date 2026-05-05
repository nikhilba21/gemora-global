// 🔥 ONLY IMPORTANT PART SHOWN (बाकी UI same रहेगा)

// ❌ REMOVE THIS
// const { data: backendCategories } = useQuery(... enabled: !!actor)

// ✅ FIXED
const { data: backendCategories } = useQuery<Category[]>({
  queryKey: ["categories"],
  queryFn: () => api.getCategories(),
});

// ✅ REMOVE THIS BLOCK COMPLETELY (WRONG)
// const product: NormalizedProduct | null = (() => {
//   if (backendProduct) { ... }
// })();


// ✅ FINAL NORMALIZATION (CORRECT)
const normalizedProduct: NormalizedProduct | null = (() => {
  if (product) {
    return {
      id: BigInt(product.id),
      name: cleanProductText(product.name),
      description: cleanProductText(product.description || ""),
      categoryId: BigInt(product.categoryId || 1),
      imageUrls: product.imageUrls || [],
      moq: product.moq || "50 pcs",
      featured: product.featured || false,
      metal: "Gold-plated",
      occasion: "Festive",
      style: "Traditional",
      priceRange: "Mid-range",
      material: "Brass with gold plating",
      finish: "Anti-tarnish polish",
      packaging: "Individual velvet pouch",
      shipping: "Worldwide — 7–14 days",
    };
  }

  return SAMPLE_PRODUCTS.find((p) => String(p.id) === id) ?? null;
})();
