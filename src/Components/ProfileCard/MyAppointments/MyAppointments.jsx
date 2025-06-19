import React, { useEffect, useState } from "react";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    fetch("http://localhost:3001/appointments")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((a) => a.email === email);
        setAppointments(filtered);
      });
  }, [email]);

  return (
    <div className="center-wrapper">
      <div className="appointments-container">
        <h2>My Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Speciality</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.doctorName}</td>
                  <td>{appt.doctorSpeciality}</td>
                  <td>
                    {appt.date || new Date(appt.timeSlot).toLocaleDateString()}
                  </td>
                  <td>
                    {appt.selectedSlot ||
                      new Date(appt.timeSlot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </td>
                  <td>{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
