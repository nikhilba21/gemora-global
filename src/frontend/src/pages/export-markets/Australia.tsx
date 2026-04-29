import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Australia() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-exporter-australia", { replace: true });
  }, [navigate]);
  return null;
}
