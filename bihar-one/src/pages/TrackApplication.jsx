import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added useNavigate import
import { FaSearch, FaCheckCircle, FaCircle, FaInfoCircle, FaFileDownload, FaTimesCircle, FaUndo } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

export default function TrackApplication() {
  const [query, setQuery] = useState("");
  const [applicationId, setApplicationId] = useState(null); // ✅ Store the confirmed ID after a successful search
  const [status, setStatus] = useState(null);
  const [verificationLevel, setVerificationLevel] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ Initialize navigate hook

  const handleSearch = async () => {
    if (query.trim() !== "") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus({ text: "Unauthorized: Please log in first", type: "error" });
          return;
        }

        const response = await fetch(`${backendUrl}/residence/${query}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setStatus({ text: "Unauthorized: Please log in again", type: "error" });
          } else if (response.status === 404) {
            setStatus({ text: "Application not found", type: "error" });
          } else {
            setStatus({ text: "Unexpected error occurred", type: "error" });
          }
          setApplicationId(null);
          return;
        }

        const data = await response.json();
        setStatus({ text: data.status, type: "step", remark: data.remark });
        setVerificationLevel(data.verificationLevel);
        setApplicationId(query); // ✅ Save valid query to applicationId state
      } catch (error) {
        setStatus({ text: "Server Error", type: "error" });
        setApplicationId(null);
      }
    }
  };

  // ✅ Clear function to reset the page seamlessly
  const handleClear = () => {
    setQuery("");
    setStatus(null);
    setVerificationLevel(null);
    setApplicationId(null); // ✅ Clear the saved ID
  };

  const stepsMap = {
    BLOCK: ["ASSIGNED_TO_BO", "VERIFIED_BY_BO", "VERIFIED_BY_FO", "APPROVED_BY_RO", "CERTIFICATE_ISSUED"],
    DISTRICT: ["ASSIGNED_TO_BO", "VERIFIED_BY_BO", "VERIFIED_BY_FO", "APPROVED_BY_RO", "APPROVED_BY_DM", "CERTIFICATE_ISSUED"],
    SUB_DIVISION: ["ASSIGNED_TO_BO", "VERIFIED_BY_BO", "VERIFIED_BY_FO", "APPROVED_BY_RO", "APPROVED_BY_SDM", "CERTIFICATE_ISSUED"],
  };

  const renderHorizontalStepper = (currentStatus, verificationLevel) => {
    let steps = stepsMap[verificationLevel?.toUpperCase()] || [];

    if (currentStatus === "REJECTED_BY_RO") {
      steps = steps.map((s) => (s === "APPROVED_BY_RO" ? "REJECTED_BY_RO" : s));
      steps = steps.filter((s) => s !== "CERTIFICATE_ISSUED");
    }
    if (currentStatus === "REJECTED_BY_DM") {
      steps = steps.map((s) => (s === "APPROVED_BY_DM" ? "REJECTED_BY_DM" : s));
      steps = steps.filter((s) => s !== "CERTIFICATE_ISSUED");
    }
    if (currentStatus === "REJECTED_BY_SDM") {
      steps = steps.map((s) => (s === "APPROVED_BY_SDM" ? "REJECTED_BY_SDM" : s));
      steps = steps.filter((s) => s !== "CERTIFICATE_ISSUED");
    }

    const currentIndex = steps.indexOf(currentStatus);

    return (
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-600 rounded-full"></span> Live Lifecycle Progress
        </h3>
        <div className="flex flex-row items-start justify-between relative overflow-x-auto py-4 min-w-[600px]">
          {steps.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isActive = step === currentStatus;
            const isRejected = step.startsWith("REJECTED");

            return (
              <div key={step} className="flex flex-col items-center flex-1 relative px-2 group">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-[50%] right-[-50%] h-[3px] z-0 transition-colors duration-300 ${
                      currentIndex > index ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Node Icon */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {isRejected ? (
                    <FaTimesCircle className="w-9 h-9 text-red-500 bg-white rounded-full" />
                  ) : isCompleted ? (
                    <FaCheckCircle className="w-9 h-9 text-green-500 bg-white rounded-full" />
                  ) : isActive ? (
                    <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                    </div>
                  ) : (
                    <FaCircle className="w-9 h-9 text-gray-200 bg-white rounded-full border-4 border-white shadow-inner" />
                  )}
                </div>

                {/* Step Text Label */}
                <span
                  className={`mt-3 text-xs text-center font-semibold max-w-[110px] tracking-tight ${
                    isRejected
                      ? "text-red-600"
                      : isActive
                      ? "text-blue-700 font-bold"
                      : isCompleted
                      ? "text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.replace(/_/g, " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Contextual / Info Side */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Application Tracking
            </span>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-3 tracking-tight">
              Track Status
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              See the real-time status of your request as it goes through our step-by-step approval process.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Guidelines Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Guidelines</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <p>Enter your full Application Number exactly as shown on your receipt (e.g., <strong>RES-1780459810129</strong>).</p>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <p>Make sure you are logged into your account. For your security, private details will not load if your session expires.</p>
              </div>
            </div>
          </div>

          {/* Helper Alert box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
            <FaInfoCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <p className="leading-relaxed">
              <strong>Need Help?</strong> Rejections or delayed escalations can be checked with your Local Revenue Officer (RO) or Helpdesk.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Search Control & Results Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Search Panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Enter Reference Number</h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors bg-gray-50/50 p-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. RES-17804598101.."
                className="flex-grow px-4 py-3 text-gray-700 font-medium focus:outline-none bg-transparent placeholder-gray-400"
              />
              
              {/* Action Buttons Panel */}
              <div className="flex items-center gap-1.5 p-1 sm:p-0">
                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center font-medium gap-2 cursor-pointer shadow-sm shadow-blue-200 h-full flex-grow sm:flex-initial"
                >
                  <FaSearch className="w-3.5 h-3.5" />
                  <span>Search Status</span>
                </button>

                {/* Clear Button */}
                <button
                  onClick={handleClear}
                  className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 active:scale-95 transition flex items-center justify-center font-medium gap-2 cursor-pointer h-full"
                  title="Clear view"
                >
                  <FaUndo className="w-3 h-3 text-gray-500" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Error Message Layout */}
            {status && status.type === "error" && (
              <div className="mt-4 px-4 py-3 rounded-xl border font-medium flex items-center gap-3 bg-red-50 text-red-700 border-red-200 text-sm">
                <FaTimesCircle className="w-5 h-5 text-red-500" />
                <span>{status.text}</span>
              </div>
            )}
          </div>

          {/* Dynamic Content Rendering Box */}
          {status && status.type === "step" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Stepper Render */}
              {renderHorizontalStepper(status.text, verificationLevel)}

              {/* Resolution / Post Actions Panel */}
              {status?.text === "CERTIFICATE_ISSUED" && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-green-800 text-sm">
                    <FaCheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-base">Process Complete!</h4>
                      <p className="text-green-700/90 mt-0.5">Your official digital document has been verified and securely generated.</p>
                    </div>
                  </div>
                  {/* ✅ Added navigation on click */}
                  <button 
                    onClick={() => navigate(`/certificate/${applicationId}`)}
                    className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-bold text-sm shadow-md shadow-green-100 shrink-0 w-full sm:w-auto justify-center cursor-pointer"
                  >
                    <FaFileDownload className="w-4 h-4" />
                    Download Certificate
                  </button>
                </div>
              )}

              {["REJECTED_BY_RO", "REJECTED_BY_DM", "REJECTED_BY_SDM"].includes(status?.text) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm">
                  <div className="flex items-start gap-3 text-red-800">
                    <FaTimesCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base">Application Declined</h4>
                      <p className="font-semibold text-red-700 mt-0.5">Stage: {status.text.replace(/_/g, " ")}</p>
                      {status.remark && (
                        <div className="mt-3 bg-white/80 border border-red-100 p-3 rounded-xl text-red-900 font-medium">
                          <span className="text-xs text-red-500 font-bold uppercase tracking-wider block mb-1">Official Reason Code</span>
                          "{status.remark}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}