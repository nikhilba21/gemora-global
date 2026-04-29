import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UAE() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-uae", { replace: true });
  }, [navigate]);
  return null;
}
