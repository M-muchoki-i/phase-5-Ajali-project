
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ReportForm({ report, user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!report) {
      toast.error("No report data found. Redirecting...");
      navigate("/reports");
    }
  }, [report, navigate]);

  const formik = useFormik({
    initialValues: {
      incident: report?.incident || "",
      message: report?.message || "",
      user_id: user?.id || "",
      report_id: report?.id || "",
      status: "pending", // example additional status field if needed
    },
    validationSchema: Yup.object({
      user_id: Yup.number().required("User ID is required"),
      report_id: Yup.number().required("Report ID is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(
          `/"http://localhost:5000"/status_updates/${values.report_id}/status_updates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const data = await res.json();

        if (res.ok) {
          toast.success("Status update submitted!");
          resetForm();
          navigate("/reports");
        } else {
          toast.error(`Failed: ${data.message || "Unknown error"}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error. Please try again.");
      }
    },
  });

  if (!report || !user) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        Report Status Update
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Readonly Incident */}
        <div>
          <label className="block mb-1 font-semibold">Incident</label>
          <input
            type="text"
            value={formik.values.incident}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Readonly Message */}
        <div>
          <label className="block mb-1 font-semibold">Message</label>
          <textarea
            value={formik.values.message}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Hidden fields for submission */}
        <input type="hidden" name="user_id" value={formik.values.user_id} />
        <input type="hidden" name="report_id" value={formik.values.report_id} />
        <input type="hidden" name="status" value={formik.values.status} />

        {/* Example status input (if user can update status, else prefilled hidden) */}
        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <input
            type="text"
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.status && formik.errors.status ? (
            <div className="text-red-600 text-sm">{formik.errors.status}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit StatusUpdate
        </button>
      </form>

      {/* Back Button */}
      <div className="pt-4 text-center">
        <button
          onClick={() => navigate("/report")}
          className="text-sm text-gray-600 underline hover:text-blue-700"
        >
          Back to report
        </button>
      </div>
    </div>
  );
}

export default ReportForm;
