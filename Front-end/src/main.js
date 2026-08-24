import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import { AuthProvider } from "./context/AuthContext.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Bootstrap 5 — نسخة RTL + الجافاسكريبت الخاص بالعناصر التفاعلية (offcanvas...)
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// نظام التصميم الخاص بـ فصلي (يُحمَّل بعد بوتستراب ليتمكن من تخصيصه)
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>
);