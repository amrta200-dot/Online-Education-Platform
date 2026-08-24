import { howItWorksSteps } from "../data/mockData";
import "../styles/home.css";

function HowItWorks() {
  return (
    <section className="section">
      <div className="container-app">
        <div className="text-center mx-auto" style={{ maxWidth: 480 }}>
          <span className="section-eyebrow">كيف تعمل المنصة</span>
          <h2 className="section-title">ثلاث خطوات بسيطة</h2>
        </div>

        <div className="how-it-works-steps mt-3">
          {howItWorksSteps.map((step, index) => (
            <div className="how-step" key={step.id}>
              <div className="how-step__marker">
                <span className="how-step__number">{step.number}</span>
                <i className={`fa-solid ${step.icon}`} aria-hidden="true"></i>
              </div>
              <div className="how-step__body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < howItWorksSteps.length - 1 && (
                <div className="how-step__connector" aria-hidden="true"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
