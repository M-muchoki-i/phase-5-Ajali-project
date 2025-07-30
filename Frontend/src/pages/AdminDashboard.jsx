import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const API_BASE_URL = "http://127.0.0.1:5000";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const access_token = localStorage.getItem("access_token");

  // Fetch all reports (admin-only)
  useEffect(() => {
    if (!access_token) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/admin/reports`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch reports. " + error.message);
        toast.error("Failed to fetch reports: " + error.message);
        setLoading(false);
      });
  }, [access_token]);

  // Submit status update for a selected report
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedReportId || !newStatus) return;

    try {
      setError(null);
      await axios.post(
        `${API_BASE_URL}/admin/reports/${selectedReportId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // Update status locally so UI reflects immediately
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReportId ? { ...r, status: newStatus } : r
        )
      );
      setSelectedReportId(null);
      setNewStatus("");
      toast.success("Status updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError("Failed to update status. " + msg);
      toast.error("Failed to update status: " + msg);
    }
  };

  if (!access_token) {
    return <p>Please log in as an admin to access this dashboard.</p>;
  }

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-900 rounded">{error}</div>
      )}

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Incident</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="border p-2">{report.id}</td>
                <td className="border p-2">{report.incident}</td>
                <td className="border p-2">{report.details}</td>
                <td className="border p-2">
                  {report.latitude}, {report.longitude}
                </td>
                <td className="border p-2">{report.status || "N/A"}</td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                    onClick={() => {
                      setSelectedReportId(report.id);
                      setNewStatus(report.status || "");
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedReportId && (
        <form
          onSubmit={handleStatusUpdate}
          className="mt-6 p-4 border rounded max-w-sm"
        >
          <h2 className="text-xl font-semibold mb-4">
            Update Status for Report #{selectedReportId}
          </h2>

          <label htmlFor="status" className="block mb-1 font-medium">
            New Status
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">Select status</option>
            <option value="under investigation">Under Investigation</option>
            <option value="rejected">Rejected</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => setSelectedReportId(null)}
            className="ml-4 py-2 px-4 rounded border border-gray-400 hover:bg-gray-200"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Toast container to display notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
