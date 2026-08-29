import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { useState } from "react";
import "../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};
  if (!email.trim()) {
    newErrors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }
  if (!password.trim()) {
    newErrors.password = "كلمة المرور مطلوبة";
  }
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) {
    return;
  }
  setIsLoading(true);
  try {
    const response = await fetch( `${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }
);
  const data = await response.json();
  if (!response.ok) {
    setErrors({
      email: data.message || "Invalid email or password",
    });
    return;
  }
    navigate("/verify-code", {
      state: {
        email: email,
        purpose: "login",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    setErrors({
      general: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
  } finally {
    setIsLoading(false);
  }
};
  return (
    <section className="login-page">
      <div className="container-app">
        <div className="login-box surface-card">
          <div className="login-box__header">
            <span className="login-box__icon">
              <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
            </span>
            <h1 className="login-box__title">تسجيل الدخول</h1>
            <p>سجّل الدخول للوصول إلى دروسك</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={`login-field ${errors.email ? "login-field--invalid" : ""}`}>
              <label htmlFor="loginEmail">البريد الإلكتروني</label>
              <input
                type="email"
                id="loginEmail"
                placeholder="example@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({...prev, email: "", }));
                }}
                className={errors.email ? "login-field--invalid" : ""}
              />
              {errors.email && (
                <div className="alert alert-danger mb-3">
                  {errors.email}
                </div>
              )}
            </div>
            <div className={`login-field ${errors.password ? "login-field--invalid" : ""}`}>
              <label htmlFor="loginPassword">كلمة المرور</label>
              <input
                type={showPassword ? "password" : "text"}
                id="loginPassword"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }}
                className={errors.password ? "login-field--invalid" : ""}
              />
                <button type="button" className="Gdgtak" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                </button>
                {errors.password && (
                  <div className="alert alert-danger mb-3">
                    {errors.password}
                  </div>
                )}
            </div>

            <div className="login-options">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  تذكرني
                </label>
              </div>
              <Link to="/ForgotPassword">نسيت كلمة المرور؟</Link>
            </div>

          <button
            type="submit"
            className="btn btn-primary btn-block "
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm ms-2"
                  aria-hidden="true"
                ></span>
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
          </form>

          <p className="login-box__footer">
            ليس لديك حساب؟ <Link to="/Register">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
