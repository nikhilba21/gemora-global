import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

export default function Australia() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-australia", { replace: true });
  }, [navigate]);
  return null;
}
