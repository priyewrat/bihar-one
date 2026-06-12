import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

function VerifyOtp() {
  const { backendUrl } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const phoneNumber =
    location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${backendUrl}/citizens/verify-otp`, null, {
        params: { phoneNumber, enteredOtp: otp },
      });
      setMessage(res.data);

      if (res.data.toLowerCase().includes("success")) {
        setIsSuccess(true);
        // show success message for 2s before redirect
        setTimeout(() => navigate("/user-login"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data || "Verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-50">
      <div className="bg-white w-full max-w-md border rounded-2xl shadow-lg p-10 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-8">OTP Verification</h2>

        {!isSuccess && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            <button
              onClick={handleVerify}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-3 rounded-lg shadow transition cursor-pointer"
            >
              Verify OTP
            </button>
          </>
        )}

        {message && (
          <p
            className={`mt-6 text-lg font-semibold ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Show login button if OTP invalid */}
        {!isSuccess && message && !message.toLowerCase().includes("success") && (
          <div className="mt-6">
            <button
              onClick={() => navigate("/user-login")}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold py-3 rounded-lg shadow transition cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyOtp;
