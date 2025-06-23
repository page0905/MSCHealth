import React, { useEffect, useState } from "react";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/appointments`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments.");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter((a) => a.email === email);
        setAppointments(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch appointments:", err);
        setLoading(false);
      });
  }, [email]);

  return (
    <div className="center-wrapper">
      <div className="appointments-container">
        <h2>My Appointments</h2>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : appointments.length === 0 ? (
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
