import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Canada() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-canada", { replace: true });
  }, [navigate]);
  return null;
}
