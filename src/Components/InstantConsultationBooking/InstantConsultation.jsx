import React from "react";
import Consultation from "../Consultations/Consultation";
import AppointmentForm from "../Appointment/AppointmentForm/AppointmentForm";
import FindDoctorSearch from "../Appointment/FindDoctorSearch/FindDoctorSearch";
import DoctorCard from "../Appointment/DoctorCard/DoctorCard";

const InstantConsultation = () => (
  <Consultation
    title="Instant Consultation"
    SearchComponent={FindDoctorSearch}
    DoctorCardComponent={(props) => (
      <DoctorCard {...props} FormComponent={AppointmentForm} />
    )}
    isInstant={true}
  />
);

export default InstantConsultation;
