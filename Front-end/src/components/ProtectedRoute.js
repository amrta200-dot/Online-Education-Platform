import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children, allowedRole }) {
  const { isLoggedIn, user, isLoading } = useAuth();

  // لسه بنتأكد من الـ Cookie
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  // بعد انتهاء التحقق، لو مش مسجل دخول
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // مسجل دخول لكن الـ role غير مسموح
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;