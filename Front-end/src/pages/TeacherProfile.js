import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import "../styles/teacher-profile.css";


const API_URL = import.meta.env.VITE_API_URL;

function TeacherProfile() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTeacherData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // جلب بيانات المدرس
        const teacherResponse = await fetch(`${API_URL}/api/teachers/${id}`);

        const teacherData = await teacherResponse.json();

        if (!teacherResponse.ok) {
          throw new Error(
            teacherData.message || "تعذر تحميل بيانات المدرس"
          );
        }

        setTeacher(teacherData);

        // جلب دروس المدرس
        const lessonsResponse = await fetch(`${API_URL}/api/lessons/teacher/${id}`);
        const lessonsData = await lessonsResponse.json();
        if (!lessonsResponse.ok) {
          throw new Error(
            lessonsData.message || "تعذر تحميل دروس المدرس"
          );
        }
        setLessons(lessonsData);
      } catch (error) {
        console.error("Get teacher data error:", error);

        setError(
          error.message || "حدث خطأ أثناء تحميل البيانات"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getTeacherData();
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-app">
          <p>جاري تحميل بيانات المدرس...</p>
        </div>
      </section>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <section className="section">
        <div className="container-app">
          <p>{error}</p>

          <Link
            to="/teachers"
            className="btn btn-outline"
          >
            العودة للمدرسين
          </Link>
        </div>
      </section>
    );
  }

  if (!teacher) {
    return null;
  }

  // =========================
  // صورة المدرس
  // =========================

  const teacherImage = teacher.image
    ? teacher.image.startsWith("http")
      ? teacher.image
      : `${API_URL}${teacher.image}`
    : "";

  return (
    <>
      <section className="teacher-profile-header">
        <div className="container-app">
          <div className="teacher-profile-header__inner">
            <img
              src={teacherImage}
              alt={`صورة ${teacher.name}`}
              className="teacher-profile-header__image"
            />
            <div>
              <h1 className="teacher-profile-header__name">
                الأستاذ :  {teacher.name} 
              </h1>
              <p className="teacher-profile-header__subject">
                <span style={{color:"black",fontSize:18}}> مدرس : </span> {teacher.subject}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-app">
          <h2 className="section-title mb-3">
            الدروس القادمة
          </h2>
          {lessons.length > 0 ? (
            <div className="teacher-lessons-list">
              {lessons.map((lesson) => (
                <LessonCard lesson={lesson} key={lesson.id} />
              ))}
            </div>
          ) : (
            <div className="teacher-empty-state surface-card">
              <i
                className="fa-regular fa-calendar"
                aria-hidden="true"
              ></i>
              <p>
                لا توجد دروس قادمة لهذا المدرس حاليًا.
              </p>
              <Link
                to="/teachers"
                className="btn btn-outline btn-sm mt-2"
              >
                تصفح مدرسين آخرين
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TeacherProfile;