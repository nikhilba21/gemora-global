import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  products: "Wholesale Jewellery",
  collections: "Collections",
  blog: "Jewellery Blog",
  about: "About Us",
  contact: "Contact",
  wholesale: "Wholesale Export",
  gallery: "Design Gallery",
  export: "Global Markets",
  "export-markets": "Export Markets",
  "kundan-jewellery-wholesale": "Kundan Jewellery",
  "bridal-jewellery-wholesale": "Bridal Jewellery",
  "fashion-jewellery-exporter": "Fashion Jewellery",
  "oxidised-jewellery-wholesale": "Oxidised Jewellery",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="container px-4 py-3 sm:py-4 flex items-center text-xs sm:text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      <ol className="flex items-center gap-2">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center hover:text-[#1A237E] transition-colors"
            aria-label="Home"
          >
            <Home size={14} className="mr-1" />
            <span>Home</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          
          // Try to get a clean label
          let label = routeLabels[value] || value.replace(/-/g, " ");
          
          // Capitalize if it's not in the map
          if (!routeLabels[value]) {
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }

          return (
            <li key={to} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              {last ? (
                <span className="font-semibold text-[#1A237E] truncate max-w-[200px]" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-[#1A237E] transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
