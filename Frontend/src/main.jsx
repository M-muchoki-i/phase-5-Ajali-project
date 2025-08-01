// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import {createBrowserRouter,RouterProvider,} from "react-router-dom";
// import './index.css'
// import App from './App.jsx'
// import LocationPage from './components/locationMap.jsx';
// import EmergencyContact from './pages/emergencycontacts.jsx';
// import { User } from './pages/User.jsx';
// import { Login } from './pages/Login.jsx';
//import ReportForm from './pages/report-form.jsx';
//import App from "./App.jsx";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./components/AuthContext.jsx";
// pages imports
import Index from './pages/Home.jsx';
import MapPage from "./components/MapPage.jsx";
import { UpdateReportStatus } from "./pages/status_update.jsx";
import LocationPage from "./components/locationMap.jsx";
import EmergencyContact from "./pages/emergencycontacts.jsx";
import { User } from "./pages/User.jsx";
import { Login } from "./pages/Login.jsx";
import ReportForm from "./pages/report-form.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MainLayout from "./MainLayout.jsx"; // ensures the pages are wrapped  to include the fixed footer and bottom padding.
import UserDashboard from "./pages/UserDash.jsx";
import ReportDetailPage from "./pages/details.jsx";



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
    element: <Login />,
  },
  {
    path: "/AdminDashboard",
    element: (
      <MainLayout>
        <AdminDashboard />
      </MainLayout>
    ),
  },
  {
    path: "/share-location",
    element: (
      <MainLayout>
        <LocationPage />
      </MainLayout>
    ),
  },
  // {
  //   path: "/user",
  //   element: <User />,
  // },
  {
    path: "/UpdateReportStatus",
    element: (
      <MainLayout>
        <UpdateReportStatus />
      </MainLayout>
    ),
  },
  {
    path: "/",
    element: <Index />,
    // element: (
    //   <MainLayout>
    //     <Login />
    //   </MainLayout>
    // ),
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
    path: "/signup",
    element: (
      <MainLayout>
        <User />
      </MainLayout>
    ),
  },
  {
    path: "/map",
    element: (
      <MainLayout>
        <MapPage />
      </MainLayout>
    ),
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />
  },
  {
    path: "/details-page",
    element: <ReportDetailPage/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
