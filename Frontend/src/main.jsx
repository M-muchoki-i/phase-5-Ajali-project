import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import LocationPage from "./components/locationMap.jsx";
import EmergencyContact from "./pages/emergencycontacts.jsx";
import { User } from "./pages/User.jsx";
import { Login } from "./pages/Login.jsx";
import ReportForm from "./pages/report-form.jsx";
import MainLayout from "./pages/MainLayout.jsx"; // ensures the pages are wrapped  to include the fixed footer and bottom padding.

const router = createBrowserRouter([
  {
    path: "/report",
    element: (
      <MainLayout>
        <ReportForm />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <MainLayout>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/emergency-contact",
    element: (
      <MainLayout>
        <EmergencyContact />
      </MainLayout>
    ),
  },
  {
    path: "/home",
    element: (
      <MainLayout>
        <LocationPage />
      </MainLayout>
    ),
  },
  {
    path: "/user",
    element: (
      <MainLayout>
        <User />
      </MainLayout>
    ),
  },
  {
    path: "/",
    element: (
      <MainLayout>
        <h1 className="text-center text-2xl mt-10">Welcome to Ajali</h1>
      </MainLayout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
