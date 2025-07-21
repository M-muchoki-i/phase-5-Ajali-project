import { useState, useRef } from "react";
import axios from "axios";
import getCurrentPosition from "../components/locationMap"; // Ensure this is a function that returns coords

const backendURL = "http://localhost:5000";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    incident: "",
    details: "",
    media: [],
  });

  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const position = await getCurrentPosition();

      const dataToSend = new FormData();
      dataToSend.append("incident", formData.incident);
      dataToSend.append("details", formData.details);
      dataToSend.append("latitude", position?.coords?.latitude || "");
      dataToSend.append("longitude", position?.coords?.longitude || "");

      formData.media.forEach((file, index) => {
        dataToSend.append(`media[${index}]`, file);
      });

      const response = await axios.post(
        `${backendURL}/user/reports`,
        dataToSend
      );
      console.log(response.data);

      // Reset form
      setFormData({
        incident: "",
        details: "",
        media: [],
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding incident:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-100 bg-opacity-80 backdrop-blur-sm">
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-2xl border border-red-100 shadow-lg">
        <h2 className="text-3xl font-bold text-red-800 mb-6 ml-12">
          Report an emergency
        </h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-red-700 mb-1">Incident</h3>
          <input
            type="text"
            name="incident"
            placeholder="e.g. Fire, motor accident, workplace accident etc."
            value={formData.incident}
            onChange={handleTextChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
          />

          <h3 className="text-xl font-bold text-red-700 mb-1">Details</h3>
          <input
            type="text"
            name="details"
            placeholder="e.g. Accident on Alali Rd involving two vehicles, Fire at Mjengo Apartments etc."
            value={formData.details}
            onChange={handleTextChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
          />

          <h3 className="text-xl font-bold text-red-700 mb-1">
            Attach image/video
          </h3>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            multiple
            ref={fileInputRef}
            onChange={handleMediaChange}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-300 transition-colors bg-gray-50 w-full"
          />

          {formData.media.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-1">
                Selected Files:
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
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-all"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
