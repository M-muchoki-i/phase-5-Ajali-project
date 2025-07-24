import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import LocationPage from './components/locationMap.jsx';
import EmergencyContact from './pages/emergencycontacts.jsx';
import { User } from './pages/User.jsx';
import { Login } from './pages/Login.jsx';
import ReportForm from './pages/report-form.jsx';
import StatusUpdate from './pages/status_update.jsx';
import Index from './pages/Home.jsx';

const router = createBrowserRouter([
  {
    path: "/report",
    element: <ReportForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/emergency-contact",
    element: <EmergencyContact />,
  },
  {
    path: "/location",
    element: <LocationPage />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/status-update",
    element: <StatusUpdate />,
  },
  {
    path: "/",
    element: <Index/>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
