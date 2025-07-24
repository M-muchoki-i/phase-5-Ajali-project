
import React, { useState, useEffect } from "react";
import axios from "axios";

function StatusUpdate({ reportId, currentUser }) {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get("/status_updates")
      .then((res) => {
        const filtered = res.data.filter((update) => update.report_id === reportId);
        setStatusUpdates(filtered);
      })
      .catch((err) => setError(err.message));
  }, [reportId, refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      report_id: reportId,
      updated_by: currentUser, // Must be passed in from parent
      status: newStatus,
    };

    axios
      .post("/status_updates", payload)
      .then(() => {
        setNewStatus("");
        setRefresh(!refresh); // trigger re-fetch
      })
      .catch((err) => setError(err.response?.data?.error || "Submission failed"));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Status Updates</h2>

      {statusUpdates.length === 0 ? (
        <p>No status updates yet.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {statusUpdates.map((update) => (
            <li
              key={update.id}
              className="border-b pb-1 text-sm text-gray-700"
            >
              <strong>Status:</strong> {update.status} <br />
              <strong>Updated By:</strong> {update.updated_by} <br />
              <strong>Time:</strong>{" "}
              {new Date(update.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      {/* Only show form if user is admin */}
      {currentUser === "admin" && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            placeholder="Enter new status"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default StatusUpdate;
