import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherCard from "./TeacherCard";
import "../styles/home.css";


const API_URL = import.meta.env.VITE_API_URL;
function TeacherSection() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const getTeachers = async () => {
      try {
        const response = await fetch( `${API_URL}/api/teachers` );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "تعذر تحميل بيانات المدرسين"
          );
        }
        setTeachers(data);
      } catch (error) {
        console.error("Get teachers error:", error);
        setError(
          "تعذر تحميل المدرسين حاليًا"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getTeachers();
  }, []);
  return (
    <section className="section section--muted">
      <div className="container-app">
        <div className="text-center mx-auto" style={{ maxWidth: 480 }}>
          <span className="section-eyebrow">
            مدرس المنصة
          </span>
          <h2 className="section-title">
            تعرف على مدرسك وابدأ رحلة التعلم
          </h2>
        </div>
        {/* Loading */}
        {isLoading && (
          <div className="text-center mt-4">
            <p>جاري تحميل المدرسين...</p>
          </div>
        )}
        {/* Error */}
        {!isLoading && error && (
          <div className="text-center mt-4">
            <p>{error}</p>
          </div>
        )}
        {/* Teachers */}
        {!isLoading && !error && (
          <div className="row g-3 mt-3">
            {teachers.slice(0, 4).map((teacher) => (
                <div className="col-6 col-md-3" key={teacher.id}>
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link
            to="/teachers"
            className="btn btn-outline"
          >
           التعرف على المدرس  
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TeacherSection;
