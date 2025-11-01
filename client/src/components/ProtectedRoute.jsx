import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    alert("⚠️ Please log in to access this page!");
    return <Navigate to="/login" replace />;
  }

  return children;
}
