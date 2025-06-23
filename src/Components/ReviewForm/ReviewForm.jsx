import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewForm.css";

const ReviewForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
      return;
    }

    const email = sessionStorage.getItem("email");
    setUserEmail(email);

    const fetchData = async () => {
      try {
        const [appointmentsRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/appointments`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const reviewsData = await reviewsRes.json();

        setAppointments(appointmentsData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching review data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleFeedbackClick = (appt, existingReview = null) => {
    setSelectedAppointment(appt);
    if (existingReview) {
      setFeedback(existingReview.feedback);
      setRating(existingReview.rating);
      setEditingReviewId(existingReview.id);
    } else {
      setFeedback("");
      setRating(0);
      setEditingReviewId(null);
    }
  };

  const handleSubmitReview = () => {
    if (!feedback.trim() || rating === 0)
      return alert("Please enter your feedback and rating");

    const reviewPayload = {
      appointmentId: selectedAppointment.id,
      doctorName: selectedAppointment.doctorName,
      speciality: selectedAppointment.speciality,
      feedback,
      rating,
      time: new Date().toLocaleString(),
    };

    const url = editingReviewId
      ? `${process.env.REACT_APP_API_BASE_URL}/reviews/${editingReviewId}`
      : `${process.env.REACT_APP_API_BASE_URL}/reviews`;

    fetch(url, {
      method: editingReviewId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingReviewId) {
          setReviews(reviews.map((r) => (r.id === editingReviewId ? data : r)));
        } else {
          setReviews([...reviews, data]);
        }
        setSelectedAppointment(null);
        setEditingReviewId(null);
        alert("Review submitted successfully!");
      })
      .catch((err) => console.error(err));
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const filteredAppointments = appointments.filter(
    (appt) => appt.email === userEmail && appt.status === "completed"
  );

  const formatAppointmentTime = (appt) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    if (appt.type === "normal" && appt.date && appt.selectedSlot) {
      try {
        const datePart = new Date(appt.date);
        const [time, period] = appt.selectedSlot.split(" ");
        const [hoursStr, minutesStr] = time.split(":");
        let hours = parseInt(hoursStr);
        const minutes = parseInt(minutesStr);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        datePart.setHours(hours);
        datePart.setMinutes(minutes);
        return datePart.toLocaleString("en-GB", options);
      } catch (err) {
        console.error("Error parsing date:", err);
        return "-";
      }
    } else if (appt.timeSlot) {
      return new Date(appt.timeSlot).toLocaleString("en-GB", options);
    }

    return "-";
  };

  return (
    <div className="review-form-container">
      <h2>Reviews</h2>

      {loading ? (
        <p>Loading...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="no-eligible">
          You have no completed appointments to review.
        </p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Doctor Name</th>
                <th>Speciality</th>
                <th>Time</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt, index) => {
                const review = reviews.find((r) => r.appointmentId === appt.id);
                return (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>{appt.doctorName}</td>
                    <td>{appt.doctorSpeciality || "-"}</td>
                    <td>{formatAppointmentTime(appt)}</td>

                    <td>
                      {review ? (
                        <span className="feedback-content">
                          <i>
                            {review.feedback} ({review.rating}⭐)
                            <br />
                            <small>{review.time}</small>
                          </i>
                          <br />
                          <button
                            className="edit-btn"
                            onClick={() => handleFeedbackClick(appt, review)}
                          >
                            Edit
                          </button>
                        </span>
                      ) : (
                        <button
                          className="feedback-btn"
                          onClick={() => handleFeedbackClick(appt)}
                        >
                          Click Here
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {selectedAppointment && (
            <div className="modal-wrapper">
              <div className="feedback-modal">
                <h3>Provide Feedback for {selectedAppointment.doctorName}</h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                ></textarea>

                <div className="rating-stars">
                  <span>Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? "selected" : ""}`}
                      onClick={() => handleStarClick(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="button-container">
                  <button onClick={handleSubmitReview}>Submit</button>
                  <button onClick={() => setSelectedAppointment(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewForm;
