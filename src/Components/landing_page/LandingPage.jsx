import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <section className="hero-section">
      <div>
        <div data-aos="fade-up" className="flex-hero">
          <h1>
            Your Health
            <br />
            <span className="text-gradient"> Our Responsibility </span>
          </h1>
          <div className="blob-cont">
            <div className="blue blob"></div>
          </div>
          <div className="blob-cont">
            <div className="blue1 blob"></div>
          </div>
          <h4>
            Your trusted healthcare partner, providing quality medical care and
            seamless appointment booking.
          </h4>
          <div className="button-container">
            <Link to="/service" className="button">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LandingPage;
