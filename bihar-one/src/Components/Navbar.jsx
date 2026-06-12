import React, { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

// Helper function to decode a JWT and check if it has expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  // Ensure the token looks like a standard JWT (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false; // Not a JWT, we assume it's valid and let the backend handle it
  }

  try {
    const payloadBase64 = parts[1];
    // Replace URL-safe characters just in case
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(base64);
    const payload = JSON.parse(decodedJson);
    
    // Check if the 'exp' (expiration time) field exists and has passed
    if (payload.exp) {
      // payload.exp is usually in seconds, Date.now() is in milliseconds
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch (error) {
    console.error("Error decoding token for expiration check:", error);
    return false; // If decoding fails, don't blindly log them out
  }
};

function Navbar() {
  const { user, token, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-5 py-2 rounded"
      : "hover:text-blue-700";

  const isLoggedIn = !!token;
  const role = localStorage.getItem("role");

  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Continuously monitor token for expiration or removal
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentStorageToken = localStorage.getItem("token");
      
      // If there is no token in storage OR the token is physically expired
      if (!currentStorageToken || isTokenExpired(currentStorageToken)) {
        // If the Context still thinks we are logged in, force a logout
        if (token) {
          logout();
        }
      }
    };

    // Check every second (catches expiration and same-tab token removal)
    const interval = setInterval(checkAuthStatus, 1000);
    // Check on cross-tab storage changes (catches logout from a different tab)
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [token, logout]);

  // Officer roles list
  const officerRoles = ["DM", "SP", "SDM", "TEHSILDAR", "RO", "BO", "FO"];
  const isOfficer = officerRoles.includes(role);

  return (
    <nav className="bg-white border-b-4 border-blue-700 z-50 print:hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-5">
        {/* Logo */}
        <div>
          <h1 className="text-4xl font-bold">
            <span className="text-orange-500">Bihar</span>
            <span className="text-blue-700">One</span>
          </h1>
          <p className="text-sm text-gray-600">
            One Portal for All Bihar Services
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-10 text-lg font-semibold items-center">
          {/* Citizens */}
          {!isOfficer && (
            <>
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/services" className={navLinkClass}>Services</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </>
          )}

          {/* Officers */}
          {isOfficer && (
            <>
              <NavLink to="/officer-dashboard" className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </>
          )}

          {isLoggedIn ? (
            <div className="relative cursor-pointer">
              <button
                onClick={() => setOpen(!open)}
                className="text-blue-700 text-3xl focus:outline-none cursor-pointer"
              >
                <FaUserCircle />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
                  <p className="text-gray-700 font-semibold">
                    {user?.name || user?.role || "User"}
                  </p>
                  <p className="text-gray-500 text-sm break-words truncate max-w-[180px]">
                    {user?.email || "user@example.com"}
                  </p>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="w-full text-left text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/user-login" className={navLinkClass}>User Login</NavLink>
              <NavLink to="/officer-login" className={navLinkClass}>Officer Login</NavLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;