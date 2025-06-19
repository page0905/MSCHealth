import React, { useEffect, useState } from "react";
import "./FindDoctorSearch.css";

const FindDoctorSearch = ({ onSearch, isInstant }) => {
  const [searchText, setSearchText] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/doctors")
      .then((res) => res.json())
      .then((data) => {
        const uniqueSpecialities = [
          ...new Set(data.map((doc) => doc.speciality)),
        ];
        setSpecialities(uniqueSpecialities);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    onSearch({
      searchText,
      selectedSpeciality,
      selectedRating,
    });
  }, [searchText, selectedSpeciality, selectedRating, onSearch]);

  return (
    <div className="find-doctor-search">
      <h2>
        {isInstant
          ? "Find Doctor for Instant Consultation"
          : "Find & Book Doctor"}
      </h2>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Search by name or speciality..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
        >
          <option value="">Specialities</option>
          {specialities.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Ratings</option>
          <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</option>
          <option value="⭐⭐⭐⭐">⭐⭐⭐⭐</option>
          <option value="⭐⭐⭐">⭐⭐⭐</option>
          <option value="⭐⭐">⭐⭐</option>
          <option value="⭐">⭐</option>
        </select>
      </div>
    </div>
  );
};

export default FindDoctorSearch;
