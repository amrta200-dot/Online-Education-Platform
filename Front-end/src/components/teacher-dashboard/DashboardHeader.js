import "./teacher-dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function DashboardHeader({ teacher }) {

  const teacherImage = teacher?.image ? teacher.image.startsWith("http") ? teacher.image : `${API_URL}${teacher.image}` : "";

  return (
    <section className="dashboard-header">

      <div className="container-app">

        <div className="dashboard-header__inner">

          {teacherImage ? (
            <img
              src={teacherImage}
              alt={`صورة ${teacher?.name || "المدرس"}`}
              className="dashboard-header__image"
            />
          ) : (
            <div className="dashboard-header__image">
              <i className="fa-solid fa-user"></i>
            </div>
          )}

          <div>

            <p className="dashboard-header__greeting">
              مرحبًا بعودتك 👋
            </p>

            <h1 className="dashboard-header__name">
              {teacher?.name || "المدرس"}
            </h1>

            <p className="dashboard-header__subject">
              {teacher?.subject || ""}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardHeader;
