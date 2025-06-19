import React, { useState } from "react";
import "./AppointmentForm.css";

const AppointmentForm = ({ isInstant = false, onSubmit }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = { name, phoneNumber };
    if (!isInstant) {
      data.date = date;
      data.selectedSlot = selectedSlot;
    }

    onSubmit(data);

    setName("");
    setPhoneNumber("");
    setDate("");
    setSelectedSlot("");
  };

  return (
    <form onSubmit={handleFormSubmit} className="appointment-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      {!isInstant && (
        <>
          <div className="form-group">
            <label htmlFor="date">Date of Appointment:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeSlot">Book Time Slot:</label>
            <select
              id="timeSlot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
            </select>
          </div>
        </>
      )}

      <button type="submit">Book Now</button>
    </form>
  );
};

export default AppointmentForm;
