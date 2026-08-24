import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teachers.css";

const API_URL = import.meta.env.VITE_API_URL;


function LessonCard({ lesson }) {
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const { id, title, date, time, status,number } = lesson;


const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const formattedDate = date
  ? dateFormatter.format(new Date(`${date}T00:00:00`))
  : "";
  const handleOpenPasswordModal = () => {
    setPassword("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    if (isCheckingPassword) return;

    setPassword("");
    setPasswordError("");
    setShowPasswordModal(false);
  };

  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      setPasswordError("اكتب كود الدخول أولًا");
      return;
    }
    setPasswordError("");
    setIsCheckingPassword(true);
    try {
      const response = await fetch(`${API_URL}/api/lessons/${id}/verify-password`,{
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "كود الدخول غير صحيح"
        );
      }
      // كلمة المرور صحيحة
      setShowPasswordModal(false);
      setPassword("");
      // الدخول إلى صفحة البث
      navigate(`/live-class/${id}`);
    } catch (error) {
      console.error("Verify password error:", error);
      setPasswordError(
        error.message || "حدث خطأ أثناء التحقق"
      );
    } finally {
      setIsCheckingPassword(false);
    }
  };
  return (
    <>
      <div className="lesson-card surface-card">
        {/* أيقونة الدرس */}
        <span className="lesson-card__icon">
          <i
            className="fa-solid fa-video"
            aria-hidden="true"
          ></i>
        </span>
        {/* بيانات الدرس */}
        <div className="lesson-card__info">
          <h3 className="lesson-card__title">
            {title}
          </h3>
          <div className="lesson-card__meta">
            <span>
              <i className="fa-regular fa-calendar" aria-hidden="true"></i>
              {formattedDate}
            </span>

            <span>
              <i className="fa-regular fa-clock" aria-hidden="true"></i>
              {time}
            </span>

            <span style={{color:"black"}}>
              <i className="fa-solid fa-hashtag" style={{color:"black"}} aria-hidden="true"></i>
              {number}
            </span>
          </div>
          <span className="pill lesson-card__status">
            <span
              className="status-dot status-dot--upcoming"
              aria-hidden="true"
            ></span>
            {status === "live" ? "مباشر الآن" : status === "completed" ? "منتهٍ" : "قادم"}
          </span>
        </div>
        {/* زر الدخول */}
        <div className="lesson-card__action">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleOpenPasswordModal}
          >
            دخول إلى الدرس
          </button>
        </div>
      </div>
      {/* ========================= */}
      {/* Password Modal */}
      {/* ========================= */}
      {showPasswordModal && (
        <div className="lesson-password-overlay">
          <div className="lesson-password-modal">
            {/* زر الإغلاق */}
            <button
              type="button"
              className="lesson-password-close"
              onClick={handleClosePasswordModal}
              disabled={isCheckingPassword}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="lesson-password-icon">
              🔐
            </div>
            <h3>
              دخول إلى الدرس
            </h3>
            <p>
              اكتب كود الدخول الخاص بهذا الدرس
            </p>
            {/* Password */}
            <input
              type="password"
              placeholder="اكتب كود الدخول"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleVerifyPassword();
                }
              }}
              autoFocus
            />

            {/* Error */}
            {passwordError && (
              <p className="lesson-password-error">
                {passwordError}
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleVerifyPassword}
              disabled={isCheckingPassword}
            >
              {isCheckingPassword ? (
                <>
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    aria-hidden="true"
                  ></i>{" "}
                  جاري التحقق...
                </>
              ) : (
                "دخول إلى الدرس"
              )}
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default LessonCard;
