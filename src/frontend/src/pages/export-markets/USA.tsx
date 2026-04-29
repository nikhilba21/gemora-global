import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to the existing SEO page for USA
export default function USA() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/imitation-jewellery-supplier-usa", { replace: true });
  }, [navigate]);
  return null;
}
