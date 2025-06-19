import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./HealthBlog.css";

const HealthBlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/healthblogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }, [id]);

  if (!blog) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="health-blog-detail">
      <Link to="/healthblog" className="mb-3 d-inline-block blog-back">
        ← Back to blog
      </Link>
      <h2 className="detail-title mb-2">{blog.title}</h2>
      <p className="text-muted">
        By {blog.author} - {blog.date}
      </p>
      <img
        src={`asset/image/healthBlog/${blog.thumbnail}`}
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
