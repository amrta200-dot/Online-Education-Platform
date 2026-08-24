import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/verifyCode.css";


const API_URL = import.meta.env.VITE_API_URL;

function VerifyCode() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email;
  const purpose = location.state?.purpose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("من فضلك أدخل كود التحقق");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-code`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email,
              code,
              purpose,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "كود التحقق غير صحيح");
        return;
      }

      if (purpose === "forgotpassword") {
        navigate("/resetpassword", {
          state: {
            resetToken: data.resetToken,
          },
        });
      } else {
        login(data.user);
      
        if (data.user.role === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setError("حدث خطأ أثناء التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <section className="verify-page">
    <div className="verify-container">
      <div className="verify-card">

        <div className="verify-icon">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

          <h1 className="verify-title">
              {purpose === "register"
                  ? "تأكيد إنشاء الحساب"
                  : purpose === "forgotpassword"
                  ? "تأكيد إعادة تعيين كلمة المرور"
                  : "تأكيد تسجيل الدخول"}
          </h1>

        <p className="verify-description">
          أرسلنا كود تحقق إلى:
          <span className="verify-email">
            {email}
          </span>
        </p>

        <form className="verify-form" onSubmit={handleSubmit}>

          <input
            className="verify-input"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            maxLength={6}
          />

          {error && (
            <p className="verify-error">
              {error}
            </p>
          )}

          <button
            className="verify-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "جاري التحقق..."
              : "تأكيد الكود"}
          </button>

        </form>

        <p className="verify-hint">
          الكود صالح لمدة 10 دقائق.
        </p>

      </div>
    </div>
  </section>
);
}

export default VerifyCode;