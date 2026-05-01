import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

export default function Singapore() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-singapore", { replace: true });
  }, [navigate]);
  return null;
}
