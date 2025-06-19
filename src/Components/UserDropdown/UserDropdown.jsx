import React, { useState } from "react";
import "./UserDropdown.css";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const username = sessionStorage.getItem("email");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/"; // hoặc dùng navigate nếu dùng React Router
  };

  return (
    <div className="user-dropdown-wrapper" onClick={() => setOpen(!open)}>
      <span className="username">{username}</span>
      <div className={`dropdown-menu ${open ? "show" : ""}`}>
        <a href="/profile">Profile</a>
        <a href="/appointments">Appointments</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserDropdown;
