import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  price?: number;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id as string),
    enabled: !!id,
  });

  const product: Product | null = data || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-4 text-blue-500">
          Go back
        </Link>
      </div>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-10 grid md:grid-cols-2 gap-10">
        
        {/* IMAGES */}
        <div>
          <img
            src={images[activeImg]}
            className="w-full h-96 object-cover rounded"
          />

          <div className="flex gap-2 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 object-cover cursor-pointer border ${
                  i === activeImg ? "border-black" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-3">
            {product.name}
          </h1>

          <p className="text-muted-foreground mb-4">
            {product.description}
          </p>

          {product.price && (
            <p className="text-xl font-semibold mb-4">
              ₹ {product.price}
            </p>
          )}

          <a
            href={`https://wa.me/917976341419?text=Hi, I'm interested in ${product.name}`}
            target="_blank"
            className="bg-green-500 text-white px-6 py-3 rounded"
          >
            WhatsApp Inquiry
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
