import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import OfficerLogin from "./pages/OfficerLogin";
import RegisterForm from "./pages/RegisterForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

import ResidenceCertificateForm from "./pages/ResidenceCertificateForm";
import CasteCertificateForm from "./pages/CasteCertificateForm";
import IncomeCertificateFrom from "./pages/IncomeCertificateFrom";
import CharacterCertificate from "./pages/CharacterCertificate";
import BirthCertificateForm from "./pages/BirthCertificateForm";

import TrackApplication from "./pages/TrackApplication";
import DownloadCertificate from "./pages/DownloadCertificate";
import VerifyOtpForm from "./pages/VerifyOtpForm";
import CertificatePage from "./Components/CertificatePage";
import ExecutiveDashboard from "./pages/officer-dashboard/ExecutiveDashboard";
import FieldOfficerDashboard from "./pages/officer-dashboard/FieldOfficerDashboard";
import RODashboard from "./pages/officer-dashboard/RODashboard";
import FAQs from "./pages/FAQs";

// Officer Roles
const officerRoles = ["DM", "SP", "SDM", "TEHSILDAR", "RO", "BO", "FO"];

// ---------------- USER ROUTE ----------------
function UserProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/user-login", { replace: true });
      } else if (officerRoles.includes(role)) {
        navigate("/officer-dashboard", { replace: true });
      }
    };

    // Check token every 1 second (detects expiration or removal in the same tab)
    const interval = setInterval(checkAuth, 1000);
    // Listen for storage events (detects logout from a different tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Initial render check
  if (!token) return <Navigate to="/user-login" replace />;
  if (officerRoles.includes(role)) return <Navigate to="/officer-dashboard" replace />;

  return children;
}

// ---------------- OFFICER ROUTE ----------------
function OfficerProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/officer-login", { replace: true });
      } else if (!officerRoles.includes(role)) {
        navigate("/", { replace: true });
      }
    };

    // Check token every 1 second (detects expiration or removal in the same tab)
    const interval = setInterval(checkAuth, 1000);
    // Listen for storage events (detects logout from a different tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Initial render check
  if (!token) return <Navigate to="/officer-login" replace />;
  if (!officerRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
}

// ---------------- ROLE-BASED DASHBOARD ----------------
function RoleBasedDashboard() {
  const role = localStorage.getItem("role");

  switch (role) {
    case "BO":
      return <ExecutiveDashboard />;
    case "FO":
      return <FieldOfficerDashboard />;
    case "RO":
      return <RODashboard />;
    default:
      // Fallback for other roles like DM, SP, SDM, TEHSILDAR
      return <OfficerDashboard />;
  }
}

function App() {
  // Use state to keep the Navbar dynamically updated
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Keep the Navbar synced if the token changes
    const interval = setInterval(checkAuthStatus, 1000);
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="min-h-screen">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/officer-login" element={<OfficerLogin />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/verify-otp" element={<VerifyOtpForm />} />

          {/* OFFICER DASHBOARD */}
          <Route
            path="/officer-dashboard"
            element={
              <OfficerProtectedRoute>
                <RoleBasedDashboard />
              </OfficerProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/residence-certificate"
            element={
              <UserProtectedRoute>
                <ResidenceCertificateForm />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/caste-certificate"
            element={
              <UserProtectedRoute>
                <CasteCertificateForm />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/income-certificate"
            element={
              <UserProtectedRoute>
                <IncomeCertificateFrom />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/character-certificate"
            element={
              <UserProtectedRoute>
                <CharacterCertificate />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/birth-certificate"
            element={
              <UserProtectedRoute>
                <BirthCertificateForm />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/track-application"
            element={
              <UserProtectedRoute>
                <TrackApplication />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/download-certificate"
            element={
              <UserProtectedRoute>
                <DownloadCertificate />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/certificate/:applicationId"
            element={
              <UserProtectedRoute>
                <CertificatePage />
              </UserProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;