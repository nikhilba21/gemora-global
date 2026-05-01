import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCanonical } from '../../hooks/useCanonical';

export default function UK() {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/jewellery-supplier-uk", { replace: true });
  }, [navigate]);
  return null;
}
