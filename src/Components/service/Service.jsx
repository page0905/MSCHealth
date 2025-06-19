import { Link } from "react-router-dom";
import "./Service.css";

const Service = () => {
  const services = [
    {
      title: "Instant Consultation",
      img: "/asset/image/service/instant_consultation.jpg",
      link: "/instant-consultation",
    },
    {
      title: "Book an Appointment",
      img: "/asset/image/service/book_appointment.jpg",
      link: "/appointment",
    },
    {
      title: "Self Checkup",
      img: "/asset/image/service/self_check.jpg",
      link: "/self-checkup",
    },
    {
      title: "Health Tips and Guidance",
      img: "/asset/image/service/tips.jpg",
      link: "/health-tips",
    },
  ];

  return (
    <section className="service-section container">
      <h2>Best Services</h2>
      <p>Take care of your body. It’s the only place you have to live.</p>
      <div className="row justify-content-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="col-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
          >
            <Link to={service.link} className="service-card">
              <img src={service.img} alt={service.title} />
              <div className="card-body">
                <h5>{service.title}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Service;
