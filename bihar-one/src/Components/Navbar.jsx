import React, { useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // FIX APPLIED HERE: Consistent px-4 py-2 across both active and inactive states
  // Removed md:p-0 from the inactive state to fix the vertical misalignment
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-700 text-white px-4 py-2 rounded-md block text-center md:text-left transition-colors"
      : "hover:bg-blue-50 text-gray-800 hover:text-blue-700 px-4 py-2 rounded-md block text-center md:text-left transition-colors";

  const isLoggedIn = !!token;
  const role = localStorage.getItem("role");

  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  // Continuously monitor token for expiration or removal
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentStorageToken = localStorage.getItem("token");
      
      if (!currentStorageToken || isTokenExpired(currentStorageToken)) {
        if (token) {
          logout();
        }
      }
    };

    const interval = setInterval(checkAuthStatus, 1000);
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [token, logout]);

  // Officer roles list
  const officerRoles = ["DM", "SP", "SDM", "TEHSILDAR", "RO", "BO", "FO"];
  const isOfficer = officerRoles.includes(role);

  // Reusable component for links to avoid duplication
  const NavLinks = () => (
    <>
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
    </>
  );

  return (
    <nav className="bg-white border-b-4 border-blue-700 z-50 print:hidden relative shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 md:px-10 py-5">
        {/* Logo */}
        <div className="flex-shrink-0 z-50 bg-white">
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-orange-500">Bihar</span>
            <span className="text-blue-700">One</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            One Portal for All Bihar Services
          </p>
        </div>

        {/* Desktop Navigation Links */}
        {/* FIX APPLIED HERE: Changed gap-10 to gap-4 to compensate for the new padding on items */}
        <ul className="hidden md:flex gap-4 text-lg font-semibold items-center z-50">
          <NavLinks />

          {isLoggedIn ? (
            <div className="relative cursor-pointer ml-4">
              <button
                onClick={() => setOpen(!open)}
                className="text-blue-700 text-3xl focus:outline-none cursor-pointer"
              >
                <FaUserCircle />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100">
                  <p className="text-gray-700 font-semibold truncate">
                    {user?.name || user?.role || "User"}
                  </p>
                  <p className="text-gray-500 text-sm break-words truncate max-w-[180px]">
                    {user?.email || "user@example.com"}
                  </p>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={logout}
                    className="w-full text-left text-red-600 hover:text-red-800 cursor-pointer font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 ml-4">
              <NavLink to="/user-login" className={navLinkClass}>User Login</NavLink>
              <NavLink to="/officer-login" className={navLinkClass}>Officer Login</NavLink>
            </div>
          )}
        </ul>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-blue-700 text-3xl focus:outline-none cursor-pointer transition-transform duration-300"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t-2 border-blue-100 flex flex-col items-center py-6 gap-4 text-lg font-semibold z-40 transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none hidden"
        }`}
      >
        <NavLinks />
        
        {isLoggedIn ? (
          <div className="flex flex-col items-center mt-4 border-t border-gray-200 w-full pt-6 px-4">
            <div className="flex items-center gap-3 mb-4">
              <FaUserCircle className="text-blue-700 text-4xl" />
              <div className="text-center">
                <p className="text-gray-700 font-bold">
                  {user?.name || user?.role || "User"}
                </p>
                <p className="text-gray-500 text-sm truncate max-w-[200px]">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-colors duration-300 cursor-pointer px-8 py-2 w-full max-w-[200px] font-bold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-2 border-t border-gray-200 w-full pt-6">
            <NavLink to="/user-login" className={navLinkClass}>User Login</NavLink>
            <NavLink to="/officer-login" className={navLinkClass}>Officer Login</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;