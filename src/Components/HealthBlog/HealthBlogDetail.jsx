import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import "./HealthBlog.css";

const HealthBlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/healthblogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog.");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Blog not found or something went wrong.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/healthblog" className="d-inline-block mt-3">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <Container className="health-blog-detail">
      <Link to="/healthblog" className="mb-3 d-inline-block blog-back">
        ← Back to blog
      </Link>

      <h2 className="detail-title mb-2">{blog.title}</h2>
      <p className="text-muted">
        By {blog.author} – {blog.date}
      </p>

      <img
        src={`${process.env.PUBLIC_URL}/asset/image/healthBlog/${blog.thumbnail}`}
        alt={blog.title}
        className="img-fluid rounded mb-4 detail-image"
      />

      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
    </Container>
  );
};

export default HealthBlogDetail;
