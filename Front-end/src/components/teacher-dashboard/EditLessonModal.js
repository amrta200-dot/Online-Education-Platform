import { useEffect, useState } from "react";
import "./teacher-dashboard.css";


const API_URL = import.meta.env.VITE_API_URL;

function EditLessonModal({ lesson, onUpdated }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    password: "",
    number: "",
  });

  const [error, setError] = useState("");
  const [submitState, setSubmitState] = useState("idle");

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title || "",
        date: lesson.date || "",
        time: lesson.time || "",
        number: lesson.number || "",
        password: "",
      });
      setError("");
      setSubmitState("idle");
    }
  }, [lesson]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("يرجى إدخال اسم الدرس");
      return;
    }

    if (!form.date) {
      setError("يرجى اختيار تاريخ الدرس");
      return;
    }
    if (!form.number) {
      setError("يرجى تحديد رقم الدرس");
      return;
    }

    if (!form.time) {
      setError("يرجى اختيار وقت الدرس");
      return;
    }

    setSubmitState("saving");

    try {
      const response = await fetch(
        `${API_URL}/api/lessons/${lesson.id}`,
        {
          method: "PUT",
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
          data.message || "حدث خطأ أثناء تعديل الدرس"
        );
      }

      // نرجع الدرس الجديد للأب
      onUpdated(data.lesson);

      setSubmitState("success");

      // نقفل الـ modal بعد نجاح التعديل
      setTimeout(() => {
        const modalElement = document.getElementById(
          "editLessonModal"
        );

        if (modalElement) {
          const modal =
            window.bootstrap?.Modal.getInstance(modalElement);

          modal?.hide();
        }

        setSubmitState("idle");
      }, 700);
    } catch (error) {
      console.error("Update lesson error:", error);
      setError(error.message);
      setSubmitState("idle");
    }
  };

  return (
    <div
      className="modal fade faslay-modal"
      id="editLessonModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h2 className="modal-title">
                تعديل الدرس
              </h2>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="إغلاق"
              ></button>
            </div>

            <div className="modal-body">

              {error && (
                <div className="td-field__error mb-3">
                  {error}
                </div>
              )}
            <div className="row">
              <div className="col-8">
                <div className="td-field">
                  <label htmlFor="editLessonTitle">
                    اسم الدرس
                  </label>

                  <input
                    type="text"
                    id="editLessonTitle"
                    value={form.title}
                    onChange={updateField("title")}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="td-field">
                  <label htmlFor="editLessonnumber">رقم الدرس</label>
                  <input
                    type="number"
                    id="editLessonnumber"
                    placeholder="مثال : 1"
                    value={form.number}
                    onChange={updateField("number")}
                  />
                </div>
              </div>
            </div>
              <div className="row g-3">
                <div className="col-6">
                  <div className="td-field">
                    <label htmlFor="editLessonDate">
                      التاريخ
                    </label>

                    <input
                      type="date"
                      id="editLessonDate"
                      value={form.date}
                      onChange={updateField("date")}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="td-field">
                    <label htmlFor="editLessonTime">
                      الوقت
                    </label>

                    <input
                      type="time"
                      id="editLessonTime"
                      value={form.time}
                      onChange={updateField("time")}
                    />
                  </div>
                </div>
              </div>

              <div className="td-field">
                <label htmlFor="editLessonPassword">
                  كلمة مرور جديدة
                </label>

                <input
                  type="password"
                  id="editLessonPassword"
                  placeholder="اتركها فارغة إذا لم ترد تغييرها"
                  value={form.password}
                  onChange={updateField("password")}
                />
              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-outline btn-sm"
                data-bs-dismiss="modal"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitState === "saving"}
              >
                {submitState === "saving" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                    جارٍ الحفظ...
                  </>
                ) : submitState === "success" ? (
                  <>
                    <i className="fa-solid fa-check"></i>{" "}
                    تم الحفظ
                  </>
                ) : (
                  "حفظ التعديلات"
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditLessonModal;