import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Container } from "react-bootstrap";
import "./SelfCheckup.css";

const questions = [
  { id: 1, text: "Do you feel fatigued frequently?" },
  {
    id: 2,
    text: "Have you had a persistent cough or fever for more than 3 days?",
  },
  { id: 3, text: "Do you experience frequent headaches?" },
  {
    id: 4,
    text: "Do you have a known history of high blood pressure or diabetes?",
  },
  {
    id: 5,
    text: "Do you often feel shortness of breath during normal activity?",
  },
  {
    id: 6,
    text: "Have you experienced recent unintentional weight loss or gain?",
  },
];

const SelfCheckup = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!age || !gender || Object.keys(answers).length < questions.length) {
      alert("Please answer all questions and provide your age and gender.");
      return;
    }

    const score = Object.values(answers).filter((v) => v === "yes").length;
    if (score >= 4) setResult("high");
    else if (score >= 2) setResult("medium");
    else setResult("low");
  };

  const getResultMessage = () => {
    switch (result) {
      case "high":
        return "⚠️ You may need to consult a doctor as soon as possible. Please consider booking an appointment.";
      case "medium":
        return "⚠️ Monitor your symptoms. If they persist or worsen, a medical consultation is recommended.";
      case "low":
        return "✅ Your responses suggest that your current health status is stable. Stay healthy!";
      default:
        return "";
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="selfcheckup-card w-100" style={{ maxWidth: "700px" }}>
        <h3 className="mb-4 text-center"> Self Health Checkup</h3>

        <div className="d-flex gap-3 mb-3 flex-wrap flex-md-nowrap">
          <Form.Group style={{ flex: "0 0 180px" }}>
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </Form.Group>
          <Form.Group className="flex-fill" style={{ maxWidth: "180px" }}>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
        </div>

        {questions.map((q) => (
          <Form.Group key={q.id} className="selfcheckup-question">
            <Form.Label>{q.text}</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                name={`q${q.id}`}
                label="Yes"
                onChange={() => handleChange(q.id, "yes")}
                checked={answers[q.id] === "yes"}
              />
              <Form.Check
                inline
                type="radio"
                name={`q${q.id}`}
                label="No"
                onChange={() => handleChange(q.id, "no")}
                checked={answers[q.id] === "no"}
              />
            </div>
          </Form.Group>
        ))}

        <div className="text-center mt-4">
          <Button className="selfcheckup-btn" onClick={handleSubmit}>
            Submit
          </Button>
        </div>

        {result && (
          <Card className="selfcheckup-result mt-4">
            <h5 className="text-center">Checkup Result</h5>
            <p className="text-center">{getResultMessage()}</p>

            {result === "low" && (
              <>
                <p className="text-center text-muted">
                  "You're doing great! Want to keep it that way? Tap here for
                  some quick health tips"
                </p>
                <div className="text-center">
                  <Button className="result-btn" href="/health-tips">
                    View Health Tips
                  </Button>
                </div>
              </>
            )}

            {(result === "high" || result === "medium") && (
              <div className="text-center">
                <Button className="result-btn" href="/instant-consultation">
                  Book an Appointment
                </Button>
              </div>
            )}
          </Card>
        )}
      </Card>
    </Container>
  );
};

export default SelfCheckup;
