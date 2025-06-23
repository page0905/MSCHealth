import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import "./HealthTips.css";

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/healthtips`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch health tips.");
        return res.json();
      })
      .then((data) => {
        setTips(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load health tips. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );

  return (
    <Container className="pt-navbar">
      <h2 className="text-center mb-4">Health Tips & Guide</h2>
      <Row>
        {tips.map((tip, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <Card className="healthtip-card h-100">
              <Card.Body>
                <Card.Title>{tip.title}</Card.Title>
                <Card.Text>{tip.content}</Card.Text>
              </Card.Body>
              {tip.source && (
                <Card.Footer className="text-muted text-end">
                  <a
                    href={tip.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HealthTips;
