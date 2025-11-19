import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        {/* Toast Message */}
        {showToast && (
          <div className="protected-toast fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg glass-toast">
            <span className="text-sm font-medium">
              ⚠️ Login required to access this page
            </span>
          </div>
        )}
        <Navigate to="/login" replace />
      </>
    );
  }

  return children;
}
