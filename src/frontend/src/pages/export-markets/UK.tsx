import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UK() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-supplier-uk", { replace: true });
  }, [navigate]);
  return null;
}
