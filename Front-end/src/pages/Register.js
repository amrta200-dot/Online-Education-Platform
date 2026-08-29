import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/register.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {

  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(true);
  const [showcPassword, setShowcPassword] = useState(true);
  const [formdata, setFormdata] = useState({ name: "", email: "", password: "", confirmPassword: "",});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const name = formdata.name.trim();
    if (!name) {
      newErrors.name = "يرجى كتابة اسمك";
    } else if (name.length < 3) {
      newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    } else if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
      newErrors.name = "يرجى كتابة اسم صحيح";
    }
    const email = formdata.email.trim();
    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }
    if (!formdata.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formdata.password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!formdata.confirmPassword) {
      newErrors.confirmPassword =
        "يرجى تأكيد كلمة المرور";
    } else if (
      formdata.password !== formdata.confirmPassword
    ) {
      newErrors.confirmPassword =
        "كلمتا المرور غير متطابقتين";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password: formdata.password,
            role: "student",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setErrors({
          general:
            data.message ||
            "حدث خطأ أثناء إنشاء الحساب",
        });
        return;
      }
      navigate("/verify-code", {
        state: {
          email: data.email,
          purpose: "register",
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      setErrors({
        general:
          "تعذر الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-6 col-xl-5">
            <div className="register-card">

              {/* Header */}

              <div className="register-header">

                <div className="register-icon">
                  <i
                    className="fa-solid fa-user-plus"
                    aria-hidden="true"
                  ></i>
                </div>

                <h1 className="register-title">
                  إنشاء حساب جديد
                </h1>

                <p className="register-description">
                  أنشئ حسابك وابدأ التعلم معنا
                </p>

              </div>

              {/* General Error */}

              {errors.general && (
                <div
                  className="alert alert-danger mb-3"
                  role="alert"
                >
                  {errors.general}
                </div>
              )}

              {/* Register Form */}

              <form onSubmit={handleSubmit} noValidate>

                {/* =========================
                    NAME
                ========================= */}

                <div className="mb-3 register-field">

                  <label
                    htmlFor="registerName"
                    className="form-label"
                  >
                    الاسم
                  </label>

                  <div className="input-group">

                    <input
                      type="text"
                      id="registerName"
                      name="name"
                      placeholder="اكتب اسمك"
                      autoComplete="name"
                      className={`form-control ${
                        errors.name
                          ? "loginfieldinput"
                          : ""
                      }`}
                      value={formdata.name}
                      onChange={handleChange}
                    />

                  </div>

                  {errors.name && (
                    <div
                      className="alert alert-danger mb-3"
                      style={{ display: "block" }}
                    >
                      {errors.name}
                    </div>
                  )}

                </div>

                {/* =========================
                    EMAIL
                ========================= */}

                <div className="mb-3 register-field">

                  <label
                    htmlFor="registerEmail"
                    className="form-label"
                  >
                    البريد الإلكتروني
                  </label>

                  <div className="input-group">

                    <input
                      type="email"
                      id="registerEmail"
                      name="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      className={`form-control ${
                        errors.email
                          ? "loginfieldinput"
                          : ""
                      }`}
                      value={formdata.email}
                      onChange={handleChange}
                    />

                  </div>

                  {errors.email && (
                    <div
                      className="alert alert-danger mb-3"
                      style={{ display: "block" }}
                    >
                      {errors.email}
                    </div>
                  )}

                </div>

                {/* =========================
                    PASSWORD
                ========================= */}

                <div className="mb-3 register-field">

                  <label
                    htmlFor="registerPassword"
                    className="form-label"
                  >
                    كلمة المرور
                  </label>

                  <div className="input-group">

                    <input
                      type={showPassword ? "password" : "text"}
                      id="registerPassword"
                      name="password"
                      placeholder="8 أحرف على الأقل"
                      autoComplete="new-password"
                      dir="ltr"
                      className={`form-control ${
                        errors.password
                          ? "loginfieldinput"
                          : ""
                      }`}
                      value={formdata.password}
                      onChange={handleChange}
                    />
                <button type="button" className="td-field__toggle-visibility" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                </button>
                  </div>

                  {errors.password && (
                    <div
                      className="alert alert-danger mb-3"
                      style={{ display: "block" }}
                    >
                      {errors.password}
                    </div>
                  )}

                </div>

                {/* =========================
                    CONFIRM PASSWORD
                ========================= */}

                <div className="mb-4 register-field">

                  <label
                    htmlFor="confirmPassword"
                    className="form-label"
                  >
                    تأكيد كلمة المرور
                  </label>

                  <div className="input-group">

                    <input
                      type={showcPassword ? "password" : "text"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="أعد كتابة كلمة المرور"
                      autoComplete="new-password"
                      className={`form-control ${ errors.confirmPassword ? "loginfieldinput" : ""}`}
                      value={formdata.confirmPassword}
                      onChange={handleChange}
                    />
                <button type="button" className="td-field__toggle-visibility" onClick={() => setShowcPassword((v) => !v)} aria-label={showcPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                  <i className={`fa-solid ${showcPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                </button>
                  </div>

                  {errors.confirmPassword && (
                    <div
                      className="alert alert-danger mb-3"
                      style={{ display: "block" }}
                    >
                      {errors.confirmPassword}
                    </div>
                  )}

                </div>

                {/* =========================
                    SUBMIT
                ========================= */}

                <button
                  type="submit"
                  className="btn register-button w-100 btn-primary"
                  disabled={isLoading}
                >

                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm ms-2"
                        aria-hidden="true"
                      ></span>

                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <span className="GDG">

                      <i className="fa-solid fa-user-plus ms-2"></i>

                      <span>
                        إنشاء الحساب
                      </span>

                    </span>
                  )}

                </button>

              </form>

              {/* Footer */}

              <div className="register-footer">

                <span>
                  لديك حساب بالفعل؟
                </span>

                <Link to="/login">
                  تسجيل الدخول
                </Link>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;