import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Consultation.css";

const Consultation = ({
  title,
  SearchComponent,
  DoctorCardComponent,
  isInstant = false,
}) => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
      return;
    }

    setLoadingDoctors(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/doctors`)
      .then((res) => res.json())
      .then((data) => {
        const typeFilter = isInstant ? "instant" : "normal";
        const filteredByType = data.filter(
          (doctor) => doctor.type === typeFilter
        );

        setDoctors(filteredByType);

        const speciality = searchParams.get("speciality");
        if (speciality) {
          const filtered = filteredByType.filter((doctor) =>
            doctor.speciality.toLowerCase().includes(speciality.toLowerCase())
          );
          setFilteredDoctors(filtered);
          setSearchText(speciality);
        } else {
          setFilteredDoctors(filteredByType);
        }
      })
      .catch((err) => console.error("Error fetching doctors:", err))
      .finally(() => setLoadingDoctors(false));
  }, [searchParams, navigate, isInstant]);

  const handleSearch = ({ searchText, selectedSpeciality, selectedRating }) => {
    let filtered = doctors;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(lowerSearch) ||
          doctor.speciality.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedSpeciality) {
      filtered = filtered.filter(
        (doctor) => doctor.speciality === selectedSpeciality
      );
    }

    if (selectedRating) {
      filtered = filtered.filter((doctor) => doctor.ratings === selectedRating);
    }

    setFilteredDoctors(filtered);
    setSearchText(searchText);
  };

  return (
    <div className="container-fluid py-4 custom-padding-mobile">
      <SearchComponent
        isInstant={isInstant}
        onSearch={handleSearch}
        setSearchLoading={setLoadingSearch}
      />

      <div className="text-center">
        <h2>{filteredDoctors.length} doctors available</h2>
        <h5 className="text-muted">
          Book appointments with minimum wait-time & verified doctor details
        </h5>
      </div>

      {loadingDoctors || loadingSearch ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="row">
          {filteredDoctors.map((doctor) => (
            <div
              className="col-6 col-sm-4 col-md-3 mb-4"
              key={doctor.id || doctor.name}
            >
              <DoctorCardComponent
                {...doctor}
                highlight={searchText}
                isInstant={isInstant}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-danger">No doctors found.</p>
        </div>
      )}
    </div>
  );
};

export default Consultation;
