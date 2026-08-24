import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import "../styles/navbar.css";

/**
 * شريط التنقل العلوي — عرض فقط.
 * قائمة الموبايل مربوطة بمكوّن Offcanvas الخاص ببوتستراب عبر data-attributes،
 * بدون أي منطق React إضافي.
 */
function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAboutClick = (e) => {
  e.preventDefault();
  setIsMobileMenuOpen(false);
  if (window.location.pathname !== "/") {
    navigate("/#about");
    return;
  }
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
const handleHomeClick = (e) => {
  e.preventDefault();

  setIsMobileMenuOpen(false);

  if (window.location.pathname !== "/") {
    navigate("/");
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  const handleLogout = async () => {
    setIsLoggingOut(true);
  
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };
  const navLinks = [
    { label: "الرئيسية", to: "/" },
    { label: "المدرس", to: "/teachers" },
    { label: "عن المنصة", to: "/#about" },
  ];
  return (
    <header className="faslay-navbar">
      <nav className="container-app faslay-navbar__inner" aria-label="التنقل الرئيسي">
        <Link to="/" className="faslay-navbar__brand" aria-label="الصفحة الرئيسية لمنصة فصلي">
          <span className="faslay-navbar__brand-mark">
            <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
          </span>
          فصلي
        </Link>

        {/* روابط سطح المكتب */}
        <ul className="faslay-navbar__links d-none d-lg-flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={(e) => {
                  if (link.label === "الرئيسية") {
                    handleHomeClick(e);
                  } else if (link.label === "عن المنصة") {
                    handleAboutClick(e);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="faslay-navbar__actions d-none d-lg-flex">
          {isLoggedIn ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm ms-2"
                    aria-hidden="true"
                  ></span>
                  جاري تسجيل الخروج...
                </>
              ) : (
                "تسجيل الخروج"
              )}
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* زر فتح القائمة على الموبايل */}
        <button
          className="faslay-navbar__toggle d-lg-none"
          type="button"
          aria-label="فتح القائمة"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <i className="fa-solid fa-bars" aria-hidden="true"></i>
        </button>
      </nav>
              {/* قائمة الموبايل */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu__header">
            <span className="faslay-navbar__brand">
              <span className="faslay-navbar__brand-mark">
                <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
              </span>
              فصلي
            </span>

              <button
                type="button"
                className="mobile-menu__close"
                aria-label="إغلاق القائمة"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
          </div>

            <ul className="mobile-menu__links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      if (link.label === "الرئيسية") {
                        handleHomeClick(e);
                      } else if (link.label === "عن المنصة") {
                        handleAboutClick(e);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          
          <div className="mobile-menu__actions">
            {isLoggedIn ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm ms-2"
                    aria-hidden="true"
                  ></span>
                  جاري تسجيل الخروج...
                </>
              ) : (
                "تسجيل الخروج"
              )}
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
            >
              تسجيل الدخول
            </Link>
          )}
          </div>
        </div>
    </header>
  );
}

export default Navbar;







