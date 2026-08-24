import { useEffect, useState } from "react";
import "./teacher-dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function DashboardStats() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    upcomingLessons: 0,
    liveLessons: 0,
    totalStudents: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/api/teachers/dashboard/stats`,{
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "تعذر تحميل إحصائيات لوحة التحكم"
          );
        }

        setStats({
          totalLessons: data.totalLessons ?? 0,
          upcomingLessons: data.upcomingLessons ?? 0,
          liveLessons: data.liveLessons ?? 0,
          totalStudents: data.totalStudents ?? 0,
        });

      } catch (error) {
        console.error(
          "Get dashboard stats error:",
          error
        );

        setError(
          error.message ||
          "حدث خطأ أثناء تحميل الإحصائيات"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardStats();
  }, []);

  const dashboardQuickStats = [
    {
      id: 1,
      icon: "fa-video",
      label: "إجمالي الدروس",
      value: stats.totalLessons,
    },
    {
      id: 2,
      icon: "fa-calendar-check",
      label: "دروس قادمة",
      value: stats.upcomingLessons,
    },
    {
      id: 3,
      icon: "fa-tower-broadcast",
      label: "دروس مباشرة الآن",
      value: stats.liveLessons,
    },
    {
      id: 4,
      icon: "fa-user-graduate",
      label: "عدد الطلاب",
      value: stats.totalStudents,
    },
  ];

  if (isLoading) {
    return (
      <div className="row g-3">
        <div className="col-12">
          <p>جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row g-3">
        <div className="col-12">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {dashboardQuickStats.map((s) => (
        <div
          className="col-6 col-lg-3"
          key={s.id}
        >
          <div className="stat-card surface-card">
            <span className="stat-card__icon">
              <i
                className={`fa-solid ${s.icon}`}
                aria-hidden="true"
              ></i>
            </span>

            <div>
              <div className="stat-card__value">
                {s.value}
              </div>

              <div className="stat-card__label">
                {s.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
