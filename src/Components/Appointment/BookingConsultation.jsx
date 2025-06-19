import React from "react";
import Consultation from "../Consultations/Consultation";
import AppointmentForm from "../Appointment/AppointmentForm/AppointmentForm";
import FindDoctorSearch from "../Appointment/FindDoctorSearch/FindDoctorSearch";
import DoctorCard from "./DoctorCard/DoctorCard";

const BookingConsultation = () => (
  <Consultation
    title="Booking Consultation"
    SearchComponent={FindDoctorSearch}
    DoctorCardComponent={(props) => (
      <DoctorCard {...props} FormComponent={AppointmentForm} />
    )}
    isInstant={false}
  />
);

export default BookingConsultation;
