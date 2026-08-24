import { useEffect, useState } from "react";
import DashboardHeader from "../components/teacher-dashboard/DashboardHeader";
import DashboardStats from "../components/teacher-dashboard/DashboardStats";
import TeacherProfileCard from "../components/teacher-dashboard/TeacherProfileCard";
import CreateLessons from "../components/teacher-dashboard/CreateLessons";
import "../components/teacher-dashboard/teacher-dashboard.css";


const API_URL = import.meta.env.VITE_API_URL;
function TeacherDashboard() {  
  // بيانات المدرس الحقيقية
  const [teacher, setTeacher] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(true);
  // جلب بيانات المدرس من الـ Backend
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`${API_URL}/api/teachers/me`,{
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        const data = await response.json();
        setTeacher(data);
      } catch (error) {
        console.error("Get teacher error:", error);
      } finally {
        setTeacherLoading(false);
      }
    };
    fetchTeacher();
  }, []);
  if (teacherLoading) {
    return (
      <div className="dashboard-page">
        <div className="container-app">
          <div className="surface-card">
            <p>جاري تحميل البيانات ...</p>
          </div>
        </div>
      </div>
    );
  }
  // لو فشل جلب المدرس
  if (!teacher) {
    return (
      <div className="dashboard-page">
        <div className="container-app">
          <div className="surface-card">
            <p>تعذر تحميل بيانات المدرس.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-page">
      <DashboardHeader teacher={teacher} />
      <section className="dashboard-section">
        <div className="container-app">
          <DashboardStats />
        </div>
      </section>
      <section className="dashboard-section">
        <div className="container-app">
          <TeacherProfileCard
            teacher={teacher}
            onTeacherUpdated={setTeacher}/>
        </div>
      </section>
        <CreateLessons/>
    </div>
  );
}

export default TeacherDashboard;

