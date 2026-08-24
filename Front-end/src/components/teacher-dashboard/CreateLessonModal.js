import { useState } from "react";
import "./teacher-dashboard.css";
const emptyForm = { title: "", date: "", time: "", password: "",number:"" };

const API_URL = import.meta.env.VITE_API_URL;

function CreateLessonModal({ onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [submitState, setSubmitState] = useState("idle"); // idle | saving | success

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "يرجى إدخال اسم الدرس";
    if (!form.date) nextErrors.date = "يرجى اختيار تاريخ الدرس";
    if (!form.time) nextErrors.time = "يرجى اختيار وقت الدرس";
    if (!form.number) nextErrors.number = "يرجى تحديد رقم الدرس";
    if (!form.password || form.password.length < 4)
      nextErrors.password = "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
    return nextErrors;
  };
const handleSubmit = async (event) => {
  event.preventDefault();
  const nextErrors = validate();
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) {
    return;
  }
  setSubmitState("saving");
  try {
    const response = await fetch(`${API_URL}/api/lessons`,{
        method: "POST",
        credentials: "include",        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          date: form.date,
          time: form.time,
          password: form.password,
          number: form.number,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "حدث خطأ أثناء إنشاء الدرس"
      );
    }
    // الدرس الحقيقي اللي رجع من MongoDB
    onCreate(data.lesson);
    setSubmitState("success");
    // تنظيف الفورم
    setForm(emptyForm);
    setErrors({});
    } catch (error) {
    console.error("Create lesson error:", error);
    setErrors({
      general: error.message,
    });
    setSubmitState("idle");
  }
};
  return (
    <div
      className="modal fade faslay-modal"
      id="createLessonModal"
      tabIndex="-1"
      aria-labelledby="createLessonModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h2 className="modal-title" id="createLessonModalLabel">
                إنشاء درس مباشر جديد
              </h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-8">
                  <div className={`td-field ${errors.title ? "td-field--invalid" : ""}`}>
                    <label htmlFor="lessonTitle">اسم الدرس</label>
                      <input
                        type="text"
                        id="lessonTitle"
                        placeholder="مثال : مقدمة في الوحده الأولي"
                        value={form.title}
                        onChange={updateField("title")}
                      />
                      <span className="td-field__error">{errors.title}</span>
                    </div>
                </div>
                <div className="col-4">
                <div className={`td-field ${errors.number ? "td-field--invalid" : ""}`}>
                  <label htmlFor="lessonnumber">رقم الدرس</label>
                  <input type="number" id="lessonnumber" placeholder="مثال : 1" value={form.number} onChange={updateField("number")} />
                  <span className="td-field__error">{errors.number}</span>
                </div>
                </div>
              </div>

                {errors.general && (
                  <p className="td-field__error mb-3">
                    {errors.general}
                  </p>
                )}
              <div className="row g-3">
                <div className="col-6">
                  <div className={`td-field ${errors.date ? "td-field--invalid" : ""}`}>
                    <label htmlFor="lessonDate">التاريخ</label>
                    <input type="date" id="lessonDate" value={form.date} onChange={updateField("date")} />
                    <span className="td-field__error">{errors.date}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className={`td-field ${errors.time ? "td-field--invalid" : ""}`}>
                    <label htmlFor="lessonTime">الوقت</label>
                    <input type="time" id="lessonTime" value={form.time} onChange={updateField("time")} />
                    <span className="td-field__error">{errors.time}</span>
                  </div>
                </div>
              </div>
              <div className={`td-field td-field--password ${errors.password ? "td-field--invalid" : ""}`}>
                <label htmlFor="lessonPassword">كلمة مرور الدرس</label>
                <input
                  type={showPassword ? "password" : "text"}
                  id="lessonPassword"
                  placeholder="••••••"
                  value={form.password}
                  onChange={updateField("password")}
                />
                <button type="button" className="tdcoaskof" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                </button>
                <span className="td-field__error">{errors.password}</span>
                <p className="td-field__hint">
                  لن يتمكن من الانضمام إلى هذا الدرس سوى الطلاب الذين لديهم كلمة المرور.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              {submitState === "success" && (
                <span className="td-success-message me-auto">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i> تم إنشاء الدرس بنجاح
                </span>
              )}
              <button type="button" className="btn btn-outline btn-sm" data-bs-dismiss="modal">
                إلغاء
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitState === "saving"}>
                {submitState === "saving" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> جارٍ الإنشاء...
                  </>
                ) : (
                  "إنشاء الدرس المباشر"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLessonModal;














