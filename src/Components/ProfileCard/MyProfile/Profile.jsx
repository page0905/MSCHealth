import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    setLoading(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((u) => u.email === email);
        if (found) setUser(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [email, navigate]);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then(() => {
        setEditing(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  if (loading || !user) return <p className="loading">Loading...</p>;

  return (
    <div className="center-wrapper">
      <div className="profile-container">
        <h2>My Profile</h2>

        <div className="profile-info">
          <label>
            Name:
            {editing ? (
              <input
                name="name"
                value={user.name}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user.name}</span>
            )}
          </label>
          <label>
            Email:
            <span>{user.email}</span>
          </label>
          <label>
            Phone:
            {editing ? (
              <input
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
              />
            ) : (
              <span>{user.phone}</span>
            )}
          </label>

          <div className="profile-buttons">
            {editing ? (
              <>
                <button onClick={saveChanges}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
