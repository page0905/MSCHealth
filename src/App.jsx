import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/landing_page/LandingPage";
import Login from "./Components/login/Login";
import SignUp from "./Components/sign_up/Sign_Up";
import Service from "./Components/service/Service";
import InstantConsultation from "./Components/InstantConsultationBooking/InstantConsultation";
import BookingConsultation from "./Components/Appointment/BookingConsultation";
import Notification from "./Components/Notification/Notification";
import ReviewForm from "./Components/ReviewForm/ReviewForm";
import ProfileCard from "./Components/ProfileCard/MyProfile/Profile";
import MyAppointments from "./Components/ProfileCard/MyAppointments/MyAppointments";
import HealthBlog from "./Components/HealthBlog/HealthBlog";
import HealthBlogDetail from "./Components/HealthBlog/HealthBlogDetail";
import SelfCheckup from "./Components/SelfCheckup/SelfCheckup";
import HealthTips from "./Components/HealthTips/HealthTips";
import Footer from "./Components/Footer/Footer";
function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Notification />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/service" element={<Service />} />
            <Route
              path="/instant-consultation"
              element={<InstantConsultation />}
            />
            <Route path="/appointment" element={<BookingConsultation />} />
            <Route path="/healthblog" element={<HealthBlog />} />
            <Route path="/healthblog/:id" element={<HealthBlogDetail />} />
            <Route path="/self-checkup" element={<SelfCheckup />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/reviews" element={<ReviewForm />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
