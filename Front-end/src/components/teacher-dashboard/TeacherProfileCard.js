import { useRef, useState } from "react";
import { subjectOptions } from "./teacherDashboardMockData";
import "./teacher-dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;
function TeacherProfileCard({teacher,onTeacherUpdated,}) {
  // بيانات المدرس
  const [name, setName] = useState(
    teacher?.name || ""
  );
  const [subject, setSubject] = useState(
    teacher?.subject || ""
  );
  const [imagePreview, setImagePreview] = useState(
    teacher?.image || ""
  );
  // الصورة الجديدة التي اختارها المستخدم
  const [selectedImage, setSelectedImage] = useState(null);
  // حالات الفورم
  const [nameError, setNameError] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  // تجهيز رابط الصورة
  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }
    if (image.startsWith("http")) {
      return image;
    }
    return `${API_URL}${image}`;
  };
  // اختيار صورة جديدة
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    // التأكد أن الملف صورة
    if (!file.type.startsWith("image/")) {
      setErrorMessage("يرجى اختيار ملف صورة فقط");
      setSaveState("error");
      return;
    }
    // التأكد من حجم الصورة
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "حجم الصورة يجب ألا يتجاوز 5 ميجابايت"
      );
      setSaveState("error");
      return;
    }
    // حفظ الملف نفسه لإرساله إلى Backend
    setSelectedImage(file);
    setErrorMessage("");
    setSaveState("idle");
    // إنشاء Preview للصورة
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // حفظ بيانات المدرس
  const handleSave = async (event) => {
    event.preventDefault();
    // Validation
    if (!name.trim()) {
      setNameError(
        "يرجى إدخال اسم المدرس"
      );
      return;
    }
    if (!subject.trim()) {
      setErrorMessage(
        "يرجى اختيار المادة الدراسية"
      );

      setSaveState("error");

      return;
    }

    setNameError("");
    setErrorMessage("");
    setSaveState("saving");

    try {
      // إنشاء FormData
      const formData = new FormData();
      formData.append(
        "name",
        name.trim()
      );
      formData.append(
        "subject",
        subject
      );
      // إضافة الصورة فقط لو المستخدم اختار صورة جديدة
      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }
      // إرسال الطلب
      const response = await fetch(`${API_URL}/api/teachers/me`, {
          method: "PUT",
          // مهم جدًا لأن الـ Token موجود في Cookie
          credentials: "include",
          // لا نكتب Content-Type هنا
          // المتصفح سيضع multipart/form-data تلقائيًا
          body: formData,
        }
      );
      const data = await response.json();
      // التعامل مع الخطأ
      if (!response.ok) {
        throw new Error(
          data.message ||
          "حدث خطأ أثناء تحديث بيانات المدرس"
        );
      }
      // البيانات الجديدة من Backend
      const updatedTeacher = data.teacher;
      // تحديث البيانات داخل الـ ProfileCard
      setName(updatedTeacher.name || "");
      setSubject(updatedTeacher.subject || "");
      // تحديث الصورة
      if (updatedTeacher.image) {
        setImagePreview(
          getImageUrl(updatedTeacher.image)
        );
      }
      // لم نعد نحتاج الملف بعد الحفظ
      setSelectedImage(null);
      // أهم سطر في الموضوع كله
      // نرسل المدرس الجديد إلى TeacherDashboard
      onTeacherUpdated(updatedTeacher);
      // Success
      setSaveState("success");
    } catch (error) {
      console.error(
        "Update teacher profile error:",
        error
      );
      setErrorMessage(
        error.message ||
        "حدث خطأ أثناء حفظ البيانات"
      );
      setSaveState("error");
    }
  };
  // رابط الصورة المعروض
  const imageSrc = imagePreview ? getImageUrl(imagePreview) : "";
  // UI
  return (
    <div className="profile-card surface-card">
      {/* =========================
          Title
      ========================== */}

      <h2
        className="section-title"
        style={{ fontSize: "1.1rem" }}
      >
        الملف الشخصي
      </h2>

      <p className="mb-3">
        عدّل بياناتك وصورتك الشخصية الظاهرة للطلاب.
      </p>

      {/* =========================
          Form
      ========================== */}

      <form
        onSubmit={handleSave}
        noValidate
      >

        {/* =========================
            Image
        ========================== */}

        <div className="profile-card__avatar-row">

          <div className="profile-card__avatar-wrap">

            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`صورة ${teacher?.name || "المدرس"}`}
                className="profile-card__avatar"
              />
            ) : (
              <div className="profile-card__avatar">
                <i className="fa-solid fa-user"></i>
              </div>
            )}

            <button
              type="button"
              className="profile-card__avatar-edit"
              aria-label="تغيير الصورة الشخصية"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <i
                className="fa-solid fa-camera"
                aria-hidden="true"
              ></i>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="visually-hidden"
              aria-hidden="true"
              tabIndex="-1"
            />

          </div>

          <p className="profile-card__avatar-hint">
            اضغط على أيقونة الكاميرا لرفع صورة جديدة.
            يفضّل استخدام صورة مربعة وواضحة.
          </p>

        </div>

        {/* =========================
            Form Fields
        ========================== */}

        <div className="profile-card__form">

          {/* Name */}

          <div
            className={`td-field ${
              nameError
                ? "td-field--invalid"
                : ""
            }`}
          >

            <label htmlFor="teacherName">
              اسم المدرس
            </label>

            <input
              type="text"
              id="teacherName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
                setSaveState("idle");
              }}
              placeholder="مثال: أحمد محمد"
            />

            <span className="td-field__error">
              {nameError}
            </span>

          </div>

          {/* Subject */}

          <div className="td-field">

            <label htmlFor="teacherSubject">
              المادة الدراسية
            </label>

            <select
              id="teacherSubject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrorMessage("");
                setSaveState("idle");
              }}
            >

              {subjectOptions.map((option) => (
                <option
                  value={option}
                  key={option}
                >
                  {option}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* =========================
            Actions
        ========================== */}

        <div className="profile-card__actions">

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saveState === "saving"}
          >

            {saveState === "saving" ? (
              <>
                <i
                  className="fa-solid fa-spinner fa-spin"
                  aria-hidden="true"
                ></i>

                {" "}
                جارٍ الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}

          </button>

          {/* Success */}

          {saveState === "success" && (
            <span className="td-success-message">

              <i
                className="fa-solid fa-circle-check"
                aria-hidden="true"
              ></i>

              {" "}
              تم حفظ التغييرات

            </span>
          )}

          {/* Error */}

          {saveState === "error" && (
            <span className="td-field__error">
              {errorMessage}
            </span>
          )}

        </div>

      </form>

    </div>
  );
}

export default TeacherProfileCard;