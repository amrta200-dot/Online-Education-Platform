import { Link } from "react-router-dom";
import "../styles/home.css";


function Hero() {
  return (
    <section className="hero">
      <div className="container-app hero__inner">
        <div className="hero__content">
          <h1 className="hero__headline">
            مرحبًا بك في منصتك التعليمية
          </h1>

          <p className="hero__description">
            منصة تساعدك على حضور دروسك أونلاين مع مدرسك بكل بساطة،
            من أي مكان وفي أي وقت.
          </p>

          <div className="hero__actions">
            <Link
              to="/teachers"
              className="btn btn-primary btn-lg btn-block"
            >
              تعرف على المدرس
            </Link>
          </div>
        </div>

        <div className="hero__media">
          <img 
          src="https://img.pikbest.com/backgrounds/20251225/young-student-learning-online-with-laptop-and-books_13830099.jpg!w700wp" 
          alt="طالب يحضر درسًا أونلاين عبر الحاسوب" 
          className="hero__media-image" 
          fetchpriority="high"
          width="540"
          height="405"
        />
        </div>
      </div>
    </section>
  );
}

export default Hero;
