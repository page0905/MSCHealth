import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const location = useLocation();
  const dropdownRef = useRef(null);
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    setIsLoggedIn(!!token);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("email");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <header
      id="header"
      className="navbar fixed-top d-flex align-items-center px-4"
    >
      <Link to="/" className="logo d-flex align-items-center">
        <span>MSCHealth</span>
        <img src="/asset/image/logo.png" alt="logo" />
      </Link>

      <div
        className="hamburger"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <nav id="navbar" className={showMobileMenu ? "active" : ""}>
        <ul className="d-flex list-unstyled align-items-center mb-0">
          <li>
            <Link
              className="nav-link"
              to="/service"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="nav-link"
              to="/appointment"
              onClick={() => setShowMobileMenu(false)}
            >
              Appointments
            </Link>
          </li>
          <li>
            <Link
              className="nav-link"
              to="/healthblog"
              onClick={() => setShowMobileMenu(false)}
            >
              Health Blog
            </Link>
          </li>
          <li>
            <Link
              className="nav-link"
              to="/reviews"
              onClick={() => setShowMobileMenu(false)}
            >
              Reviews
            </Link>
          </li>
        </ul>
      </nav>

      <div className={`button-a ${showMobileMenu ? "active" : ""}`}>
        {isLoggedIn ? (
          <div className="user-info" ref={dropdownRef}>
            <span
              className="welcome-text"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Welcome, {email?.split("@")[0]}{" "}
              <FaChevronDown
                className={`dropdown-icon ${showDropdown ? "rotated" : ""}`}
              />
            </span>

            {showDropdown && (
              <div className="dropdown-menu show animated-dropdown">
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Your Profile
                </Link>
                <Link
                  to="/my-appointments"
                  onClick={() => setShowDropdown(false)}
                >
                  Appointments
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signup"
              className="sign-up-btn"
              onClick={() => setShowMobileMenu(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="login-btn"
              onClick={() => setShowMobileMenu(false)}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
