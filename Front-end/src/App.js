
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// كل الصفحات بقت lazy عشان كل صفحة تتحمل بس وقت ما المستخدم يزورها
const Home = lazy(() => import("./pages/Home"));
const Teachers = lazy(() => import("./pages/Teachers"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyCode = lazy(() => import("./pages/VerifyCode"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const LiveClass = lazy(() => import("./pages/LiveClass"));

function App() {
  return (
    <Suspense fallback={<div className="page-loading">جاري التحميل...</div>}>
      <Routes>
        {/* صفحات الموقع العادية */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teacher/:id" element={<TeacherProfile />} />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* صفحات تسجيل الدخول و اللايف */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/register" element={<Register />} />
        <Route path="/live-class/:id" element={<LiveClass />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
}
export default App;