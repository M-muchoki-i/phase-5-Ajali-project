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

const router = createBrowserRouter([
  {
    path: "/report",
    element: <ReportForm />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/emergency-contact",
    element: <EmergencyContact />
  },
  {
    path: "/home",
    element: <LocationPage />
  },
  {
    path: "/user",
    element:<User />
  },
  {
    path: "/",
    element: <h1>Welcome to Ajali</h1>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
