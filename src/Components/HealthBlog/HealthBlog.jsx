import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Container, Form, Badge } from "react-bootstrap";
import "./HealthBlog.css";

const HealthBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/healthblogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="health-blog">
      <h2 className="text-center mb-4">Health Blog</h2>
      <Form.Control
        type="text"
        placeholder="Search blog posts..."
        className="mb-4 search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Row className="gy-4">
        {filteredBlogs.map((blog) => (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={blog.id}
            className="d-flex justify-content-center"
          >
            <Card className="blog-card-container">
              <div className="blog-card-thumbnail">
                <img
                  src={`asset/image/healthBlog/${blog.thumbnail}`}
                  alt={blog.title}
                />
              </div>
              <div className="blog-card-body">
                <h5 className="blog-card-title">{blog.title}</h5>
                <Badge bg="light" text="dark" className="mb-2">
                  By {blog.author}
                </Badge>
                <p className="blog-card-summary">{blog.summary}</p>
                <Link to={`/healthblog/${blog.id}`} className="blog-card-link">
                  Read more →
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HealthBlog;
