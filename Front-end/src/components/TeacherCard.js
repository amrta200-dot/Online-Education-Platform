import { Link } from "react-router-dom";
import "../styles/teachers.css";


const API_URL = import.meta.env.VITE_API_URL;
/**
 * بطاقة مدرس مبسّطة — الصورة، الاسم، المادة، وزر "عرض المدرس" فقط.
 * @param {object} teacher - عنصر من data/mockData.js `teachers`
 */
function TeacherCard({ teacher }) {
  const { id } = teacher;

  const teacherImage = teacher?.image ? teacher.image.startsWith("http") ? teacher.image : `${API_URL}${teacher.image}` : "";

  return (
    <article className="teacher-card surface-card h-100">
      <div className="teacher-card__image-wrap">
        <img src={teacherImage} alt={`صورة ${teacher?.name || "المدرس"}`} className="teacher-card__image" />
      </div>

      <div className="teacher-card__body">
        <h3 className="teacher-card__name">{teacher?.name || "المدرس"}</h3>
        <p className="teacher-card__subject">{teacher?.subject || "المدرس"}</p>

        <Link to={`/teacher/${id}`} className="btn btn-outline btn-sm btn-block">
          عرض المدرس
        </Link>
      </div>
    </article>
  );
}

export default TeacherCard;
