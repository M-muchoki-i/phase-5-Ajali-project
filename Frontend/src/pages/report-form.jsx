
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { UpdateReportStatus } from "./status_update";

export default function ReportForm() {
  const [searchParams] = useSearchParams();
  const API_BASE_URL = "http://127.0.0.1:5000";

  const [formData, setFormData] = useState({
    incident: "",
    details: "",
    latitude: searchParams.get("lat") || "",
    longitude: searchParams.get("lng") || "",
    media: [],
    user_id: "default_user_id", // Replace with actual user ID logic
  });
  
  const [reportId, setReportId] = useState(null); // State for report ID
  const [submittedReport, setSubmittedReport] = useState(null);
   const fileInputRef = useRef(null);

 

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...validFiles],
    }));
  };

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        incident: formData.incident,
        details: formData.details,
        latitude: formData.latitude,
        longitude: formData.longitude,
        user_id: formData.user_id,
      };

      const response = await axios.post(`${API_BASE_URL}/reports`, dataToSend);

      console.log(response.data);
       setSubmittedReport({
         incident: dataToSend.incident,
         details: dataToSend.details,
         latitude: dataToSend.latitude,
         longitude: dataToSend.longitude
       });
      setSubmittedReport(response.data);
      setReportId(response.data.id);

      // Reset form
      setFormData({
        incident: "",
        details: "",
        latitude: "",
        longitude: "",
        media: [],
        // user_id: "default_user_id", // Reset user ID
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding incident", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error("Could not get location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-6 bg-red-50/60 rounded-2xl border border-red-100 shadow-lg">
        <h2 className="text-3xl font-bold text-red-800 mb-6 ml-12">
          Report an emergency
        </h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-red-700 mb-1">Incident</h3>
          <select
            name="incident"
            value={formData.incident}
            onChange={handleTextChange}
            className="w-full text-black p-3 border-2 border-gray-200 rounded-full bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer hover:border-red-300"
            required
          >
            <option value="">Select an incident</option>
            <option value="Fire">🔥 Fire</option>
            <option value="Traffic accident">🚦 Traffic</option>
            <option value="Infrastructure accident">🏗️ Infrastructure</option>
            <option value="Workplace">🏢 Workplace</option>
          </select>

          <h3 className="text-xl font-bold text-red-700 mb-1 mt-4">Details</h3>
          <input
            type="text"
            placeholder="e.g. Accident on 42nd Avenue involving two vehicles, Fire at Mjengo Apartments etc."
            name="details"
            value={formData.details}
            onChange={handleTextChange}
            required
            className="w-full p-3 border text-black border-gray-300 rounded-full bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
          />

          <h4 className="text-xl font-bold text-red-700 mb-1 mt-4">Location</h4>
          <div className="flex flex-row w-full items-center">
            <div className="flex flex-1 text-black rounded-full border-2 border-gray-300 overflow-hidden hover:border-red-300 transition-colors bg-gray-50">
              <input
                type="text"
                name="longitude"
                className="flex-1 min-w-0 p-4 text-center focus:outline-none border-none bg-transparent"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleLocationChange}
                required
              />
              <div className="border-l border-gray-300 h-8 self-center"></div>
              <input
                type="text"
                name="latitude"
                className="flex-1 min-w-0 p-4 text-center focus:outline-none border-none bg-transparent"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div className="w-4"></div>
            <button
              type="button"
              className="shrink-0 py-3 px-6 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all"
              onClick={getCurrentLocation}
            >
              Get location
            </button>
          </div>

          <h3 className="text-xl mt-4 font-bold text-red-700 mb-2">
            Attach image or video
          </h3>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            ref={fileInputRef}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-black hover:border-red-300 transition-colors bg-gray-50 w-full"
          />

          {formData.media.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-bold text-red-700 mb-1">
                Selected Media:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                <ul>
                  {formData.media.map((file, index) => (
                    <li key={index}>
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            className="w-full mt-4 py-3 px-4 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all"
            type="submit"
          >
            Submit Report
          </button>
        </form>
      </div>
      {reportId && (
        <UpdateReportStatus
          reportId={reportId}
          access_token={localStorage.getItem("access_token")}
          reportDetails={submittedReport} // Pass the report details if necessary
        />
      )}
    </div>
  );
}
