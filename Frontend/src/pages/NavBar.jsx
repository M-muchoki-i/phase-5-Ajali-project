
import  { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  // Optional: add state to toggle mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="relative z-10 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand + Links */}
          <div className="flex items-center space-x-6">
            <span className="text-2xl font-extrabold text-red-400 drop-shadow-lg">
              Ajali!
            </span>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/report"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Report
              </Link>
              <Link
                to="/map"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                map
              </Link>
              <Link
                to="/emergency-contact"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                EmergencyContact
              </Link>
              <Link
                to="/UpdateReportStatus"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                UpdateReportStatus
              </Link>
              <Link
                to="/media"
                className="hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Media
              </Link>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="Login">
              <button className="hover:bg-white hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </button>
            </Link>
            <button className="bg-white text-red-600 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              className="text-white text-xl"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        id="mobile-menu"
        className={`md:hidden px-4 pb-4 ${mobileMenuOpen ? "" : "hidden"}`}
      >
        <Link to="/" className="block py-2">
          Home
        </Link>
        <Link to="/report" className="block py-2">
          Report
        </Link>
        <Link to="/location" className="block py-2">
          Location
        </Link>
        <Link to="/emergency-contacts" className="block py-2">
          Emergency Contacts
        </Link>
        <Link to="/status-updates" className="block py-2">
          UpdateReportStatus
        </Link>
        <Link to="/media" className="block py-2">
          Media
        </Link>
        <Link to="Login" className="block py-2">
          Login
        </Link>
        <button className="block py-2 text-left w-full">Logout</button>
      </div>
    </nav>
  );
};

export default NavBar;
