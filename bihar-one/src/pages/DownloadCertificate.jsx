import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaDownload, FaFilePdf, FaSearch } from "react-icons/fa";

const DownloadCertificatePage = () => {
  const [applicationId, setApplicationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    // Prevent default form submission to allow "Enter" key presses
    e.preventDefault(); 
    
    if (!applicationId.trim()) {
      setError("Please enter a valid Application ID.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.get(
        `${backendUrl}/residence/certificate/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      navigate(`/certificate/${applicationId}`);
    } catch (error) {
      setError("Certificate not found or not issued yet. Please check your ID and try again.");
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth" 
        });
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="max-w-3xl w-full text-center mb-10 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Download Your Certificate
        </h1>
        <p className="text-lg text-gray-600">
          Enter your Application ID below to securely retrieve your digitally verified certificate.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 border border-gray-200 mb-16">
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div>
            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
              Application ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                id="applicationId"
                type="text"
                placeholder="e.g. RES-17804598101.."
                value={applicationId}
                onChange={(e) => {
                  setApplicationId(e.target.value);
                  if (error) setError("");
                }}
                className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder-gray-400 transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center cursor-pointer gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 font-medium text-lg transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FaDownload />
                Download Certificate
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Features Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center transition-shadow hover:shadow-md">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <FaShieldAlt className="text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified & Secure</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Digitally signed certificates ensuring absolute authenticity and tampering protection.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center transition-shadow hover:shadow-md">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <FaDownload className="text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Available for download 24/7 the moment your application is approved by officials.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center transition-shadow hover:shadow-md">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <FaFilePdf className="text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Universal Format</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Download in standard PDF format, easily shareable and widely accepted by all institutions.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default DownloadCertificatePage;