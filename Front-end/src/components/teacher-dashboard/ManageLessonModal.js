import { useState } from "react";
import "./teacher-dashboard.css";

const statusLabels = { upcoming: "قادم", live: "مباشر الآن", completed: "منتهٍ" };

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const API_URL = import.meta.env.VITE_API_URL;
// /**
//  * نافذة إدارة الدرس — تفاصيل الدرس، الطلاب المنضمّون (بيانات وهمية)،
//  * وإجراءات التعديل/الحذف/بدء أو دخول البث المباشر (واجهة فقط).
//  * @param {object|null} lesson - الدرس المختار حاليًا
//  * @param {function} onDelete - يُستدعى بمعرّف الدرس عند تأكيد الحذف
//  */
function ManageLessonModal({lesson,onDelete,onEdit,}) {
    const [deleteState, setDeleteState] = useState("idle");
  const [error, setError] = useState("");
const handleDelete = async () => {
  if (!lesson) return;
  const confirmed = window.confirm(
    `هل أنت متأكد من حذف الدرس "${lesson.title}"؟`
  );
  if (!confirmed) return;
  try {
    const response = await fetch(`${API_URL}/api/lessons/${lesson.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "حدث خطأ أثناء حذف الدرس"
      );
    }
    // 1️⃣ نحذف الدرس من قائمة الدروس
    onDelete(lesson.id);
    // 2️⃣ نقفل نافذة إدارة الدرس
    const modalElement =
      document.getElementById("manageLessonModal");
    if (modalElement && window.bootstrap) {
      const modal =
        window.bootstrap.Modal.getOrCreateInstance(
          modalElement
        );
      modal.hide();
    }
  } catch (error) {
    console.error("Delete lesson error:", error);
    alert(
      error.message || "حدث خطأ أثناء حذف الدرس"
    );
  }
};  
return (
    <div
      className="modal fade faslay-modal"
      id="manageLessonModal"
      tabIndex="-1"
      aria-labelledby="manageLessonModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {lesson && (
            <>
              <div className="modal-header">
                <h2 className="modal-title" id="manageLessonModalLabel">
                  {lesson.title}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="إغلاق"
                ></button>
              </div>

              <div className="modal-body">
                <div className="manage-lesson__info-list">
                  <div className="manage-lesson__info-row">
                    <span>التاريخ</span>
                    <span>{dateFormatter.format(new Date(`${lesson.date}T00:00:00`))}</span>
                  </div>
                  <div className="manage-lesson__info-row">
                    <span>الوقت</span>
                    <span>{lesson.time}</span>
                  </div>
                  <div className="manage-lesson__info-row">
                    <span>الحالة</span>
                    <span>{statusLabels[lesson.status]}</span>
                  </div>
                  <div className="manage-lesson__info-row">
                    <span>كلمة المرور</span>
                    <span>
                      {lesson.passwordProtected ? (
                        <>
                          <i className="fa-solid fa-lock" aria-hidden="true"></i> مفعّلة
                        </>
                      ) : (
                        "غير مفعّلة"
                      )}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: "0.95rem", marginBottom: 10 }}>
                  الطلاب المنضمّون ({lesson.studentsJoined})
                </h3>

                {lesson.studentsJoined > 0 ? (
                  <div className="manage-lesson__students">
                    {mockJoinedStudents.slice(0, lesson.studentsJoined).map((student) => (
                      <div className="manage-lesson__student" key={student.id}>
                        <img src={student.image} alt={`صورة ${student.name}`} />
                        <span>{student.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-3">لم ينضم أي طالب لهذا الدرس بعد.</p>
                )}
                <div className="manage-lesson__actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#editLessonModal"
                  onClick={() => onEdit(lesson)}
                >
                  <i className="fa-solid fa-pen" aria-hidden="true"></i>{" "}
                  تعديل الدرس
                </button>
                  {error && (
                    <p className="td-field__error mt-3">
                      {error}
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={handleDelete}
                    disabled={deleteState === "deleting"}
                  >
                    {deleteState === "deleting" ? (
                      <>
                        <i
                          className="fa-solid fa-spinner fa-spin"
                          aria-hidden="true"
                        ></i>{" "}
                        جارٍ الحذف...
                      </>
                    ) : (
                      <>
                        <i
                          className="fa-solid fa-trash"
                          aria-hidden="true"
                        ></i>{" "}
                        حذف الدرس
                      </>
                    )}
                  </button>
                  {error && (
                    <p className="td-field__error mt-3">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageLessonModal;
