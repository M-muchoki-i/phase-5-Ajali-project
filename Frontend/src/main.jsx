import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import LocationPage from './components/locationMap.jsx';
import EmergencyContact from './pages/emergencycontacts.jsx';
import { User } from './pages/User.jsx';
import { LoginForm } from './Pages/Login.jsx';
import ReportForm from './pages/report-form.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ReportForm />,
  },
  {
    path: "/login",
    element: <LoginForm />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
