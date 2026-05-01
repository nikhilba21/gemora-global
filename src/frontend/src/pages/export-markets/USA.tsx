import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

// Redirect to the existing SEO page for USA
export default function USA() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/imitation-jewellery-supplier-usa", { replace: true });
  }, [navigate]);
  return null;
}
