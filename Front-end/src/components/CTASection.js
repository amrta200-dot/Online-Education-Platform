import { Link } from "react-router-dom";
import "../styles/home.css";


function CTASection() {
  return (
    <section className="section">
      <div className="container-app">
        <div className="cta-box">
          <h2>جاهز لبدء رحلتك التعليمية؟</h2>

          <p>
            انضم الآن وابدأ التعلم مع مدرسك على منصة فصلي.
          </p>

          <Link to="/teachers" className="btn btn-primary btn-lg">
            ابدأ الآن
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;