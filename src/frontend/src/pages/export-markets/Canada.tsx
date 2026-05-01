import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

export default function Canada() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-canada", { replace: true });
  }, [navigate]);
  return null;
}
