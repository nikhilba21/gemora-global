import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

export default function UAE() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-uae", { replace: true });
  }, [navigate]);
  return null;
}
