import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/forgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL;
function ForgotPassword() {

    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);



const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) {
        newErrors.email = "من فضلك أدخل البريد الإلكتروني";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "من فضلك أدخل البريد الإلكتروني صحيحًا ";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
    return;
    }
    setIsLoading(true);

    try {
    const response = await fetch(`${API_URL}/api/auth/forgotpassword`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.trim(),
        }),
        }
    );
    const data = await response.json();

    if (!response.ok) {
        setErrors({
        general:
            response.status === 404 || response.status === 401
            ? "البريد الإلكتروني غير مسجل لدينا"
            : data.message || "حدث خطأ أثناء إرسال كود التحقق",
        });
        return;
    }
    
    navigate("/verify-code", {
        state: {
        email: email.trim(),
        purpose: "forgotpassword",
    },
    });
    } catch (error) {
    console.error("ForgotPassword error:", error);
    setErrors({
        general: "تعذر الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.",
    });
    } finally {
    setIsLoading(false);
    }
};
    return (
    <section className="forgot-password-page">
        <div className="container">
        <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-9 col-lg-6 col-xl-5">
            <div className="forgot-password-card">
              {/* Header */}
                <div className="forgot-password-header">
                <div className="forgot-password-icon">
                    <i
                    className="fa-solid fa-key"
                    aria-hidden="true"
                    ></i>
                </div>
                <h1 className="forgot-password-title">
                    نسيت كلمة المرور؟
                </h1>
                <p className="forgot-password-description">
                  أدخل بريدك الإلكتروني وسنرسل لك كودًا
                  لإعادة تعيين كلمة المرور
                </p>
                </div>
                
              {/* Form */}
                <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4 forgot-password-field">
                    <label
                    htmlFor="forgotPasswordEmail"
                    className="form-label"
                    >
                    البريد الإلكتروني
                    </label>
                    
                    <div className="input-group">
                    <input
                        type="email"
                        autoComplete="email"
                        id="forgotPasswordEmail"
                        className={`form-control ${ errors.email ? "loginfieldinput" : ""}`}
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({
                            ...prev,
                            email:"",
                            }));
                        }}
                    />
                    </div>
                    {errors.email && (
                        <span className="alert alert-danger mb-3" style={{display:"block"}}>
                        {errors.email}
                        </span>
                    )}
                    {errors.general && (
                        <span className="alert alert-danger mb-3" style={{display:"block"}}>
                        {errors.general}
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn register-button w-100 btn-primary"  disabled={isLoading} >
                    {isLoading ? (
                    <>
                    <span
                        className="spinner-border spinner-border-sm ms-2"
                        aria-hidden="true"
                    ></span>
                     جاري  إرسال كود التحقق ...
                    </>
                    ) : (
                        <>
                        <span className="GDG">
                        <i className="fa-solid fa-paper-plane ms-2"></i>
                        <span>إرسال كود التحقق</span>
                        </span>
                    </>
                    )}
                </button>
                </form>
              {/* Back to Login */}
                <div className="forgot-password-footer">
                    <i className="fa-solid fa-arrow-right ms-2"></i>
                <Link to="/login">
                  العودة إلى تسجيل الدخول
                </Link>
                </div>
            </div>
            </div>
        </div>
        </div>
    </section>
    );
}

export default ForgotPassword;
