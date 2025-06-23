import React, { useEffect, useState } from "react";
import "./FindDoctorSearch.css";

const FindDoctorSearch = ({ onSearch, isInstant, setSearchLoading }) => {
  const [searchText, setSearchText] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setSearchLoading?.(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors!");
        return res.json();
      })
      .then((data) => {
        const uniqueSpecialities = [
          ...new Set(data.map((doc) => doc.speciality)),
        ];
        setSpecialities(uniqueSpecialities);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load specialities!");
      })
      .finally(() => {
        setLoading(false);
        setSearchLoading?.(false);
      });
  }, []);

  const handleInputChange = (text) => {
    setSearchText(text);
    onSearch({
      searchText: text,
      selectedSpeciality,
      selectedRating,
    });
  };

  const handleSpecialityChange = (value) => {
    setSelectedSpeciality(value);
    onSearch({
      searchText,
      selectedSpeciality: value,
      selectedRating,
    });
  };

  const handleRatingChange = (value) => {
    setSelectedRating(value);
    onSearch({
      searchText,
      selectedSpeciality,
      selectedRating: value,
    });
  };

  return (
    <div className="find-doctor-search">
      <h2>
        {isInstant
          ? "Find Doctor for Instant Consultation"
          : "Find & Book Doctor"}
      </h2>

      {loading ? (
        <div className="loading-container">
          <img
            src="/assets/loading.gif"
            alt="Loading..."
            className="loading-gif"
          />
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Search by name or speciality..."
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <select
            value={selectedSpeciality}
            onChange={(e) => handleSpecialityChange(e.target.value)}
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
            onChange={(e) => handleRatingChange(e.target.value)}
          >
            <option value="">Ratings</option>
            <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</option>
            <option value="⭐⭐⭐⭐">⭐⭐⭐⭐</option>
            <option value="⭐⭐⭐">⭐⭐⭐</option>
            <option value="⭐⭐">⭐⭐</option>
            <option value="⭐">⭐</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default FindDoctorSearch;
