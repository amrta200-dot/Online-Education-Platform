import "./teacher-dashboard.css";
import LessonsList from "./LessonsList";
import { useEffect, useState } from "react";
import ManageLessonModal from "./ManageLessonModal";
import CreateLessonModal from "./CreateLessonModal";
import EditLessonModal from "./EditLessonModal";

const API_URL = import.meta.env.VITE_API_URL;

function CreateLessons() {
  // الدروس الحقيقية القادمة من MongoDB
    const [lessonToEdit, setLessonToEdit] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const handleUpdateLesson = (updatedLesson) => {
    setLessons((prev) =>
    prev.map((lesson) =>
        String(lesson.id) === String(updatedLesson.id)
        ? updatedLesson
        : lesson
    )
    );

    setLessonToEdit(null);
    };
    useEffect(() => {const getLessons = async () => {
    try {
        const response = await fetch(`${API_URL}/api/lessons/my`,{
            method: "GET",
            credentials: "include",
        }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(
            data.message || "حدث خطأ أثناء جلب الدروس"
            );
        }
        setLessons(data);
        } catch (error) {
        console.error("Get lessons error:", error);
        setError(
            error.message || "تعذر تحميل الدروس"
        );
        } finally {
        setIsLoading(false);
        }
    };
    getLessons();
    }, []);
    const handleCreateLesson = (newLesson) => {
        setLessons((prev) => [newLesson, ...prev]);
    };
    const handleDeleteLesson = (lessonId) => {
        setLessons((prev) =>
        prev.filter( (lesson) => lesson.id !== lessonId)
    );
    };
    return (
    <section className="dashboard-section">
        <div className="container-app">
        {/* إنشاء درس */}
        <div className="create-lesson-cta surface-card mb-4">
          <div className="create-lesson-cta__text">

            <h3>
              جاهز لبدء درس جديد؟
            </h3>

            <p>
              أنشئ درسًا مباشرًا جديدًا وشارك موعده
              وكلمة المرور مع طلابك.
            </p>

          </div>

          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#createLessonModal"
          >
            <i
              className="fa-solid fa-plus"
              aria-hidden="true"
            ></i>

            {" "}
            إنشاء درس جديد
          </button>

        </div>

        {/* عنوان الدروس */}

        <div className="dashboard-section__head">

          <div>

            <span className="section-eyebrow">
              دروسي
            </span>

            <h2
              className="section-title"
              style={{ marginBottom: 0 }}
            >
              الدروس المباشرة
            </h2>

          </div>

        </div>

        {/* Loading */}

        {isLoading && (
          <div className="dashboard-empty-state surface-card">
            <i className="fa-solid fa-spinner fa-spin"></i>

            <p>
              جارٍ تحميل الدروس...
            </p>
          </div>
        )}

        {/* Error */}

        {!isLoading && error && (
          <div className="dashboard-empty-state surface-card">

            <i className="fa-solid fa-circle-exclamation"></i>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* الدروس */}

        {!isLoading && !error && (
          <LessonsList
            lessons={lessons}
            onManage={setSelectedLesson}
          />
        )}

        {/* Modals */}

        <CreateLessonModal
          onCreate={handleCreateLesson}
        />

<ManageLessonModal
  lesson={selectedLesson}
  onDelete={handleDeleteLesson}
  onEdit={setLessonToEdit}
/>
        <EditLessonModal
  lesson={lessonToEdit}
  onUpdated={handleUpdateLesson}
/>  
      </div>
    </section>
  );
}

export default CreateLessons;
