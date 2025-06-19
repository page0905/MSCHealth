import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./DoctorCard.css";
import { v4 as uuidv4 } from "uuid";
import AppointmentStatusUpdater from "../AppointmentStatusUpdater";

const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const DoctorCard = ({
  name,
  speciality,
  experience,
  ratings,
  isInstant = false,
  FormComponent,
  highlight = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const storedEmail = sessionStorage.getItem("email");

  useEffect(() => {
    if (!storedEmail) return;

    const type = isInstant ? "instant" : "normal";
    const url = `http://localhost:3001/appointments?doctorName=${encodeURIComponent(
      name
    )}&doctorSpeciality=${encodeURIComponent(
      speciality
    )}&email=${storedEmail}&type=${type}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [name, speciality, storedEmail, isInstant]);

  const handleBooking = (appointmentData) => {
    if (!storedEmail) {
      alert("Please log in to book an appointment.");
      return;
    }

    const {
      name: patientName,
      phoneNumber,
      date,
      selectedSlot,
    } = appointmentData;

    const newAppointment = {
      id: uuidv4(),
      doctorName: name,
      doctorSpeciality: speciality,
      name: patientName,
      phoneNumber,
      email: storedEmail,
      type: isInstant ? "instant" : "normal",
      timeSlot: new Date().toISOString(),
      status: "booked",
    };

    if (!isInstant) {
      newAppointment.date = date;
      newAppointment.selectedSlot = selectedSlot;
    }

    fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAppointment),
    })
      .then((res) => res.json())
      .then(() => {
        setAppointments((prev) => [...prev, newAppointment]);
        alert("Appointment booked successfully!");
        setShowModal(false);
      })
      .catch((err) => console.error("Booking failed:", err));
  };

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    fetch(`http://localhost:3001/appointments/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        alert("Appointment cancelled successfully!");
      })
      .catch((err) => console.error("Cancellation failed:", err));
  };

  return (
    <div className={`doctor-card-container ${isInstant ? "instant" : ""}`}>
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">
            {highlightText(name, highlight)}
          </div>
          <div className="doctor-card-detail-speciality">
            {highlightText(speciality, highlight)}
          </div>
          <div className="doctor-card-detail-experience">
            {experience} years experience
          </div>
          <div className="doctor-card-detail-consultationfees">
            Ratings: {ratings}
          </div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        <Popup
          trigger={
            <button
              className={`book-appointment-btn ${
                appointments.some((a) => a.status !== "completed")
                  ? "cancel-appointment"
                  : ""
              }`}
              onClick={() => setShowModal(true)}
            >
              {appointments.some((a) => a.status !== "completed")
                ? "Cancel Appointment"
                : "Book Appointment"}
            </button>
          }
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="doctorbg">
            <div className="doctor-card-profile-image-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            </div>
            <div className="doctor-card-details">
              <div className="doctor-card-detail-name">{name}</div>
              <div className="doctor-card-detail-speciality">{speciality}</div>
              <div className="doctor-card-detail-experience">
                {experience} years experience
              </div>
              <div className="doctor-card-detail-consultationfees">
                Ratings: {ratings}
              </div>
            </div>

            <AppointmentStatusUpdater
              appointments={appointments}
              setAppointments={setAppointments}
            />

            {appointments.some((a) => a.status !== "completed") ? (
              <>
                <h3 style={{ textAlign: "center" }}>Appointment Booked</h3>
                {appointments.map((appt) => {
                  const canCancel = (() => {
                    if (isInstant || !appt.date || !appt.selectedSlot)
                      return true;

                    const [startTimeStr] = appt.selectedSlot.split(" - ");
                    const appointmentDateTime = new Date(
                      `${appt.date} ${startTimeStr}`
                    );
                    const now = new Date();
                    const diffInMinutes =
                      (appointmentDateTime - now) / (1000 * 60);
                    return diffInMinutes >= 60;
                  })();

                  return (
                    <div className="bookedInfo" key={appt.id}>
                      <p>Name: {appt.name}</p>
                      <p>Phone: {appt.phoneNumber}</p>
                      <p>
                        Booked At:{" "}
                        {new Date(appt.timeSlot).toLocaleString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      {!isInstant && (
                        <>
                          <p>Date: {appt.date}</p>
                          <p>Slot: {appt.selectedSlot}</p>
                        </>
                      )}
                      {appt.status === "completed" ? (
                        <p style={{ color: "green" }}>Appointment completed</p>
                      ) : canCancel ? (
                        <button onClick={() => handleCancel(appt.id)}>
                          Cancel Appointment
                        </button>
                      ) : (
                        <p style={{ color: "red" }}>
                          Cannot cancel: Appointment is within 1 hour.
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <h3 style={{ textAlign: "center" }}>Book New Appointment</h3>
                <FormComponent isInstant={isInstant} onSubmit={handleBooking} />
              </>
            )}
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default DoctorCard;
