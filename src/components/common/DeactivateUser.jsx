import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

function DeactivateUser() {
  const { userData } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userData && userData.isactivate === false) {
      setShowModal(true);
    }
  }, [location.pathname, userData]);

  if (!showModal) return null;

  return (
    <ConfirmModal
      message="비활성화된 계정입니다. 관리자에게 문의하세요."
      onConfirm={() => setShowModal(false)}
    />
  );
}

export default DeactivateUser;
