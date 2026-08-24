import { useEffect, useState } from "react";
import TeacherCard from "../components/TeacherCard";

const API_URL = import.meta.env.VITE_API_URL;

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { const getTeachers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/teachers`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "حدث خطأ أثناء جلب المدرسين"
          );
        }
        setTeachers(data);
      } catch (error) {
        console.error("Get teachers error:", error);
        setError("تعذر تحميل بيانات المدرسين");
      } finally {
        setIsLoading(false);
      }
    };
    getTeachers();
  }, []);
  if (isLoading) {
    return <p>جاري تحميل المدرسين...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <section className="teachers-header">
        <div className="container-app">
          <span className="section-eyebrow">مدرس المنصة</span>
          <h1 className="section-title">تعرف على مدرسك</h1>
          <p className="section-subtitle">تعرف على مدرسك وابدأ رحلتك التعليمية معه.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-app">
          <div className="row g-3">
            {teachers.map((teacher) => (
              <div
                className="col-6 col-md-3"
                key={teacher.id}
              >
                <TeacherCard teacher={teacher} />
              </div>
            ))}
          </div>
        </div>
    </section>
    </>
  );
}

export default Teachers;










