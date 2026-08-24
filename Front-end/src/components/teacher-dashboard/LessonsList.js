import LessonManageCard from "./LessonManageCard";
import "./teacher-dashboard.css";

/**
 * قائمة "دروسي" — شبكة بطاقات بيانات وهمية، مع حالة فارغة بسيطة.
 * @param {array} lessons
 * @param {function} onManage
 */
function LessonsList({ lessons, onManage }) {
  if (lessons.length === 0) {
    return (
      <div className="dashboard-empty-state surface-card">
        <i className="fa-regular fa-calendar-plus" aria-hidden="true"></i>
        <p>لم تُنشئ أي دروس بعد. ابدأ بإنشاء أول درس مباشر لك.</p>
      </div>
    );
  }

  return (
    <div className="lessons-grid">
      {lessons.map((lesson) => (
        <LessonManageCard lesson={lesson} onManage={onManage} key={lesson.id} />
      ))}
    </div>
  );
}

export default LessonsList;
