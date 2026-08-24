import { aboutPoints } from "../data/mockData";
import "../styles/home.css";


function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container-app">
        <div className="about-header">
          <span className="section-eyebrow">عن المنصة</span>
          <h2 className="section-title">تعلم من أي مكان</h2>
        </div>

        <div className="row g-3 mt-2">
          {aboutPoints.map((point) => (
            <div className="col-12 col-md-4" key={point.id}>
              <div className="about-card surface-card h-100">
                <span className="about-card__icon">
                  <i className={`fa-solid ${point.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="about-card__title">{point.title}</h3>
                <p>{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
