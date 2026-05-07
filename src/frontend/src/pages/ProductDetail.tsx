import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

type Product = {
  id: string | number;
  name: string;
  description: string;
  imageUrls: string[];
  price?: number;
  sku?: string;
  moq?: string;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => id ? api.getProduct(id) : Promise.reject(new Error('No product ID')),
    enabled: !!id,
  });

  // ✅ Safe product converter
  function safeProduct(p: any): Product | null {
    if (!p) return null;
    try {
      const imageUrls = Array.isArray(p.imageUrls)
        ? p.imageUrls.map(String)
        : typeof p.imageUrls === 'string'
        ? JSON.parse(p.imageUrls).map(String)
        : [];
      
      return {
        id: p.id || '',
        name: String(p.name || 'Product'),
        description: String(p.description || ''),
        imageUrls: imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"],
        price: Number(p.price) || undefined,
        sku: String(p.sku || ''),
        moq: String(p.moq || ''),
      };
    } catch (err) {
      console.error('Error converting product:', err);
      return null;
    }
  }

  const product: Product | null = data ? safeProduct(data) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            {error ? error.message : 'The product you\'re looking for doesn\'t exist.'}
          </p>
          <Link to="/products" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded hover:opacity-90">
            Go back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-10 grid md:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div>
          {images[activeImg] && (
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-96 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          )}

          <div className="flex gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 object-cover cursor-pointer border rounded overflow-hidden ${
                  i === activeImg ? "border-black" : "border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-muted-foreground mb-4">{product.description}</p>

          {product.price && (
            <p className="text-xl font-semibold mb-4">₹ {product.price.toLocaleString('en-IN')}</p>
          )}

          {product.moq && (
            <p className="text-sm text-muted-foreground mb-2">MOQ: {product.moq}</p>
          )}

          {product.sku && (
            <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
          )}

          <a
            href={`https://wa.me/917976341419?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            WhatsApp Inquiry
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
