import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/resetPassword.css";
import "../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
    const [formdata, setFormdata] = useState({ password: "", confirmPassword: "", });
    const [showPassword, setShowPassword] = useState(true);
    const [showcPassword, setShowcPassword] = useState(true);
    const [errors, setErrors] = useState({ password: "", confirmPassword: "", general: "", });
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const resetToken = location.state?.resetToken;

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async function (e) {
        e.preventDefault();

        const newErrors = {};

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
    const response = await fetch( `${API_URL}/api/auth/resetpassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resetToken,
            password: formdata.password,
        }),
    }
);

    const data = await response.json();
    if (!response.ok) {
    setErrors({
        ...errors,
        general: data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
    return;
    }
    navigate("/");
    } catch (error) {
    console.error("Reset password error:", error);
    setErrors({
        general: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
    } finally {
    setIsLoading(false);
    }
};
    return (
    <section className="reset-password-page">
        <div className="container">
        <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-9 col-lg-6 col-xl-5">

            <div className="reset-password-card">

              {/* Header */}
                <div className="reset-password-header">

                <div className="reset-password-icon">
                    <i
                    className="fa-solid fa-lock"
                    aria-hidden="true"></i>
                </div>

                <h1 className="reset-password-title">
                  إعادة تعيين كلمة المرور
                </h1>

                <p className="reset-password-description">
                  أدخل كلمة المرور الجديدة لحسابك
                </p>

                </div>

              {/* Form */}
                <form onSubmit={handleSubmit}>

                {/* New Password */}
                <div className="mb-3 reset-password-field">

                    <label
                    htmlFor="newPassword"
                    className="form-label">
                    كلمة المرور الجديدة
                    </label>

                    <div className="input-group">

                    <input type={showPassword? "password" : "text"} id="newPassword" className={`form-control ${errors.password? "login-field--invalid": ""}`}
                        placeholder="8 أحرف على الأقل"
                        autoComplete="new-password"
                        dir="ltr"
                        value={formdata.password}
                        onChange={(e) => {
                            setFormdata({...formdata, password: e.target.value,});
                        }}
                    />
                    <button type="button" className="Gumpdg" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                    </button>
                    </div>

                    {errors.password && (
                    <span
                        className="alert alert-danger mb-3"
                        style={{ display: "block" }}
                    >
                        {errors.password}
                        </span>
                    )}

                </div>

                {/* Confirm Password */}
                <div className="mb-4 reset-password-field">

                    <label
                    htmlFor="confirmPassword"
                    className="form-label"
                    >
                    تأكيد كلمة المرور
                    </label>

                    <div className="input-group">

                    <input type={showcPassword? "password" : "text"} id="confirmPassword" className={`form-control ${ errors.confirmPassword ? "login-field--invalid" : ""}`}
                        placeholder="أعد كتابة كلمة المرور"
                        autoComplete="new-password"
                        dir="ltr"
                        value={formdata.confirmPassword}
                        onChange={(e) => {
                            setFormdata({...formdata, confirmPassword: e.target.value,});
                        }}
                    />
                    <button type="button" className="Gumpdg" onClick={() => setShowcPassword((v) => !v)} aria-label={showcPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                        <i className={`fa-solid ${showcPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                    </button>
                        </div>

                    {errors.confirmPassword && (
                    <span
                        className="alert alert-danger mb-3"
                        style={{ display: "block" }}
                    >
                        {errors.confirmPassword}
                    </span>
                    )}

                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn reset-password-button w-100 btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <>
                        <span
                        className="spinner-border spinner-border-sm ms-2"
                        aria-hidden="true"
                        ></span>

                     جاري تغيير كلمة المرور...
                    </>
                    ) : (
                    <>
                        <span className="GDG">

                        <i className="fa-solid fa-key ms-2"></i>

                        <span>
                          تغيير كلمة المرور
                        </span>

                        </span>
                    </>
                    )}
                </button>

                </form>

              {/* Footer */}
                <div className="reset-password-footer">

                <i className="fa-solid fa-arrow-right ms-2"></i>

                <a href="/login">
                  العودة إلى تسجيل الدخول
                </a>

                </div>

            </div>

            </div>
        </div>
        </div>
    </section>
    );
}

export default ResetPassword;