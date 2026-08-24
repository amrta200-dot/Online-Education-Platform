import { Link } from "react-router-dom";
import "../styles/home.css";

function Footer() {
  return (
    <footer className="faslay-footer">
      <div className="container-app">
        <div className="faslay-footer__top">
          <Link to="/" className="faslay-navbar__brand faslay-footer__brand">
            <span className="faslay-navbar__brand-mark">
              <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
            </span>
            فصلي
          </Link>
          <p className="faslay-footer__desc">
          منصتك التعليمية لحضور الدروس أونلاين والتعلم مع مدرسك بسهولة.
          </p>

          <ul className="faslay-footer__links">
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/teachers">المدرس</Link>
            </li>
            <li>
              <Link to="/#about">عن المنصة</Link>
            </li>
            <li>
              <Link to="/login">دخول</Link>
            </li>
          </ul>
        </div>

        <div className="faslay-footer__bottom">
          <p>© {new Date().getFullYear()} فصلي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
