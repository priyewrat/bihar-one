import React, { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function IncomeCertificateFrom() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional: gives a nice smooth scrolling effect
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertTriangle size={90} className="text-yellow-500" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Service Not Available
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          This service is currently unavailable. Please try again later or
          contact the concerned department for assistance.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <Home size={20} />
            Go To Home
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          We apologize for the inconvenience.
        </div>
      </div>
    </div>
  );
}

export default IncomeCertificateFrom;
