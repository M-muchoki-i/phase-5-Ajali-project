import React from "react";
//import "./App.css";

const LocationPage = () => {
  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = `${position.coords.latitude},${position.coords.longitude}`;
          const destination = "Kenyatta+Hospital+Nairobi";
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
          window.open(googleMapsUrl, "_blank");
        },
        (error) => {
          alert("Unable to get your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="location-page-wrapper">
      <div className="location-page-header">
        <h1>Our Location</h1>
        <p>
          We are based at Kenyatta Hospital, Nairobi – always ready to serve
          you.
        </p>
      </div>

      <div className="location-map-container">
        <div id="canvas-for-googlemap">
          <iframe
            title="Kenyatta Hospital Location"
            className="google-map-iframe"
            frameBorder="0"
            src="https://www.google.com/maps/embed/v1/search?q=kenyatta+hospital+nairobi&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <button className="directions-button" onClick={handleGetDirections}>
        Get Directions from My Location
      </button>
    </div>
  );
};

export default LocationPage;
