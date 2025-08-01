import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

export default function UserDashboard({ id }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");

    const makeReport = () => {
        navigate('/map');
    };

    const viewReportDetails = (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    const deleteReport = async (reportId) => {
        try {
            const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the reports list after deletion
            fetchReports();
        } catch (error) {
            setError("Failed to delete report.");
        }
    };

    const fetchReports = async () => {
        if (!access_token) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/${id}/reports`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setReports(data);
        } catch (error) {
            setError("Failed to fetch reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [access_token]);

    if (!access_token) {
        return <p>Please log in to view reports</p>;
    }

    if (loading) return <p>Loading reports...</p>;

    return (
        <main className="dashboard-container">
            {/* Navigation Section */}
            <div className="dashboard-nav">
                <h2>My Reports Dashboard</h2>
                <nav>
                    <button
                        onClick={makeReport}
                        className="nav-button create-report"
                    >
                        + Create New Report
                    </button>
                </nav>
            </div>

            {/* Reports Display Section */}
            <div className="reports-grid">
                {error && <p className="error-message">{error}</p>}

                {reports.length === 0 ? (
                    <p>No reports found. Create your first report!</p>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="report-card">
                            <h4>{report.title || "Untitled Report"}</h4>
                            <p className="report-date">
                                {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                            <p className="report-snippet">
                                {report.description?.substring(0, 100) || "No description provided"}...
                            </p>
                            <div className="card-actions">
                                <button
                                    onClick={() => viewReportDetails(report.id)}
                                    className="action-button view"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => deleteReport(report.id)}
                                    className="action-button delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
};