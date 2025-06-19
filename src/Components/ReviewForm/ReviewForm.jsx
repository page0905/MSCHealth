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

  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
      return;
    }

    const email = sessionStorage.getItem("email");
    setUserEmail(email);

    fetch("http://localhost:3001/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:3001/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error(err));
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
      ? `http://localhost:3001/reviews/${editingReviewId}`
      : "http://localhost:3001/reviews";

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
    if (appt.type === "normal" && appt.date && appt.selectedSlot) {
      return `${appt.date} ${appt.selectedSlot}`;
    } else if (appt.timeSlot) {
      return new Date(appt.timeSlot).toLocaleString();
    }
    return "-";
  };

  return (
    <div className="review-form-container">
      <h2>Reviews</h2>

      {filteredAppointments.length === 0 ? (
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
