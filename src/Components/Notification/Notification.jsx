import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Notification.css";

const Notification = () => {
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/appointments`
        );
        const data = await res.json();

        const userAppointments = data.filter(
          (appt) =>
            appt.email?.toLowerCase() === storedEmail.toLowerCase() &&
            appt.status !== "completed"
        );

        setAppointments(userAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  const formatAppointmentTime = (appt) => {
    if (appt.type === "normal" && appt.date && appt.selectedSlot) {
      return `${appt.date}, ${appt.selectedSlot}`;
    } else if (appt.timeSlot) {
      const date = new Date(appt.timeSlot);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours;
      const hh = String(hours).padStart(2, "0");

      return `${yyyy}-${mm}-${dd}, ${hh}:${minutes} ${ampm}`;
    }
    return "-";
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleViewAll = () => {
    navigate("/my-appointments");
  };

  return (
    <div className="floating-container" ref={popupRef}>
      <div
        className="floating-dot"
        title="View Appointments"
        onClick={handleToggle}
      ></div>

      {isOpen && (
        <div className="popup-notification">
          <h4>Upcoming Appointments</h4>
          {appointments.length === 0 ? (
            <p className="no-appointments">
              You have no upcoming appointments.
            </p>
          ) : (
            <>
              {appointments.slice(0, 2).map((appt, index) => (
                <div className="appointment-item" key={index}>
                  <p>
                    <strong>Doctor:</strong> {appt.doctorName}
                  </p>
                  <p>
                    <strong>Speciality:</strong> {appt.doctorSpeciality}
                  </p>
                  <p>
                    <strong>Name:</strong> {appt.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {appt.phoneNumber}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatAppointmentTime(appt)}
                  </p>
                  {index < Math.min(1, appointments.length - 1) && <hr />}
                </div>
              ))}
              {appointments.length > 2 && (
                <div className="view-more">
                  <button className="view-all-btn" onClick={handleViewAll}>
                    View All
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
