import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import "./HealthTips.css";

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/healthtips")
      .then((res) => res.json())
      .then((data) => {
        setTips(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Container className=" pt-navbar">
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
