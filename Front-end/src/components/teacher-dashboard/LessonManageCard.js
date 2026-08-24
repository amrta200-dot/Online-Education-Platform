import "./teacher-dashboard.css";
import { Link } from "react-router-dom";

const statusConfig = {
  upcoming: { label: "قادم", pillClass: "pill", dotClass: "td-status-dot--upcoming" },
  live: { label: "مباشر الآن", pillClass: "pill td-pill--live", dotClass: "td-status-dot--live" },
  completed: {
    label: "منتهٍ",
    pillClass: "pill td-pill--completed",
    dotClass: "td-status-dot--completed",
  },
};
const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
function LessonManageCard({ lesson, onManage }) {
  const { id , title, number ,date, time, status, passwordProtected, studentsJoined } = lesson;
  const formattedDate = dateFormatter.format(new Date(`${date}T00:00:00`));
  const config = statusConfig[status] || statusConfig.upcoming;
  const isCompleted = status === "completed";
  const isLive = status === "live";

  return (
    <div className="mlesson-card surface-card">
      <div className="mlesson-card__status-row">
        <span className={config.pillClass}>
          <span className={`td-status-dot ${config.dotClass}`} aria-hidden="true"></span>
          {config.label}
        </span>
        {passwordProtected && (
          <span className="pill td-pill--completed" title="محمي بكلمة مرور">
            <i className="fa-solid fa-lock" aria-hidden="true"></i> محمي
          </span>
        )}
      </div>
      <div className="tit-num-div"> 
        <h3 className="mlesson-card__title">{title}</h3>
        <p className="tit-num"> رقم الدرس : {number}</p>
      </div>
      <div className="mlesson-card__meta">
        <span>
          <i className="fa-regular fa-calendar" aria-hidden="true"></i> {formattedDate}
        </span>
        <span>
          <i className="fa-regular fa-clock" aria-hidden="true"></i> {time}
        </span>
      </div>

      <div className="mlesson-card__footer">
        <span className="mlesson-card__students">
          <i className="fa-regular fa-user" aria-hidden="true"></i> {studentsJoined} طالب
        </span>

        <div className="mlesson-card__actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#manageLessonModal"
            onClick={() => onManage(lesson)}
          >
            إدارة الدرس
          </button>

          {!isCompleted && (
            <Link to={`/live-class/${id}`} className="btn btn-primary btn-sm" >
              <i className="fa-solid fa-video" aria-hidden="true"></i>{" "}
              {isLive ? "دخول الدرس المباشر" : "بدء الدرس المباشر"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonManageCard;


