import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

function FieldOfficerDashboard() {
  const [allData, setAllData] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // Helper function to map backend JSON keys to UI keys
  const formatApplicationData = (app) => {
  
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      // Fallback just in case the date is invalid
      if (isNaN(date)) return dateString; 
      
      // Formats to: "12 Jun 2026, 04:22 PM" (using Indian English format)
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    };

    return {
      ...app,
      id: app.applicationNumber || app.id,
      dbId: app.id, 
      aadhaar: app.aadharNumber,
      mobile: app.mobileNumber,
      subdivision: app.subDivision,
      village: app.villageOrTown,
      applicationDate: formatDate(app.appliedDate), // Uses the new formatter!
      aadhaarDocument: app.proof ? `data:application/pdf;base64,${app.proof}` : app.aadhaarDocument,
      photoDocument: app.photo ? `data:image/jpeg;base64,${app.photo}` : app.photoDocument,
      
      // Map your backend's exact remark fields to the UI:
      fieldOfficerRemarks: app.foRemark || app.fieldOfficerRemarks,
      roRemarks: app.roRemark || app.roRemarks,
      executiveRemarks: app.boRemark || app.executiveRemarks,
      status: app.applicationStatus || app.status,
    };
  };

  // Determines if a status means "Pending" for the Field Officer
  const isPendingStatus = (status) => {
    if (!status) return false;
    const s = status.toUpperCase().replace(/_/g, ' ');
    // Only show applications that have been verified by the BO
    return s === "VERIFIED BY BO"; 
  };

  // Determines if the FO has already processed this application
    // Determines if the FO has already processed this application
  const isProcessedByFO = (app) => {
    if (!app.status) return false;
    const s = app.status.toUpperCase().replace(/_/g, ' ');
    
    // Shows anything that the FO has finished (FO, RO, SDM, DM, Approved, or Certificate Issued)
    return s === "VERIFIED BY FO" || 
           s.includes("FO") || 
           s.includes("RO") || 
           s.includes("SDM") || 
           s.includes("DM") || 
           s.includes("APPROVED") ||
           s.includes("CERTIFICATE") ||
           s.includes("ISSUED");
  };

  // Fetch all applications
  const loadApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/residence`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let applicationsArray = response.data;
      if (!Array.isArray(applicationsArray)) {
         applicationsArray = applicationsArray.data || applicationsArray.content || applicationsArray.applications || [];
      }

      const formattedData = applicationsArray.map(formatApplicationData);
      setAllData(formattedData);

      const pending = formattedData.filter((app) => isPendingStatus(app.status));
      if (pending.length > 0 && !selectedApplicant) {
        handleSelectApplicant(pending[0]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch specific application details when selected
  const handleSelectApplicant = async (app) => {
    try {
      const queryId = app.applicationNumber || app.id;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${backendUrl}/residence/${queryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const formattedDetail = formatApplicationData(response.data);
      
      formattedDetail.status = formattedDetail.status || app.status;
      formattedDetail.fieldOfficerRemarks = formattedDetail.fieldOfficerRemarks || app.fieldOfficerRemarks;
      
      setSelectedApplicant(formattedDetail);
      setRemarks(formattedDetail.fieldOfficerRemarks || "");
    } catch (error) {
      console.error("Error fetching application details:", error);
      setSelectedApplicant(app);
      setRemarks(app.fieldOfficerRemarks || "");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");

    if (!searchQuery.trim()) {
      setSearchError("Please enter an Application ID.");
      return;
    }

    const found = allData.find(
      (app) => app.id.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      handleSelectApplicant(found);
      setSearchQuery("");
    } else {
      setSearchError("No applicant found with this Application ID.");
    }
  };

  // Update application status
  const updateApplicationStatus = async (status, autoRemark = remarks) => {
    if (!selectedApplicant) return;

    try {
      const token = localStorage.getItem("token");
      
      // Formats the data as x-www-form-urlencoded exactly like Postman!
      const formData = new URLSearchParams();
      formData.append("remark", autoRemark);

      await axios.post(
        // 👇 Uses the verify/fo endpoint for Field Officer 👇
        `${backendUrl}/residence/verify/fo/${selectedApplicant.id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded" 
          } 
        }
      );

      const updatedApplications = allData.map((app) =>
        app.id === selectedApplicant.id
          ? { ...app, status, fieldOfficerRemarks: autoRemark, foRemark: autoRemark }
          : app
      );

      setAllData(updatedApplications);
      alert(`Application Verified!`);

      const pendingApplications = updatedApplications.filter((app) => isPendingStatus(app.status));
      if (pendingApplications.length > 0) {
        handleSelectApplicant(pendingApplications[0]);
      } else {
        const updatedCurrent = updatedApplications.find(
          (app) => app.id === selectedApplicant.id
        );
        setSelectedApplicant(updatedCurrent);
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application status. Please try again.");
    }
  };

  // Converts the base64 string to a Blob and opens it in a new tab safely
  const openPdfInNewTab = (dataUri) => {
    try {
      const base64Data = dataUri.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Failed to open the PDF. The file data might be invalid.");
    }
  };

  const pendingApplications = allData.filter((app) => isPendingStatus(app.status));
  const processedApplications = allData.filter((app) => isProcessedByFO(app));

  const pendingCount = pendingApplications.length;
  const processedCount = processedApplications.length;
  // Total assigned shows pending + what FO has already processed
  const totalAssigned = pendingCount + processedCount; 

  const isCompleted = selectedApplicant && !isPendingStatus(selectedApplicant.status);

  const ApplicantListItem = ({ app }) => {
    let badgeClass = "bg-yellow-100 text-yellow-700";
    
    // Automatically converts things like "VERIFIED_BY_FO" to "VERIFIED BY FO"
    let badgeText = app.status ? app.status.replace(/_/g, ' ') : "PENDING";

    const s = app.status ? app.status.toUpperCase() : "";

    // Dynamic coloring based on the actual backend status strings
    if (s.includes("APPROVED") || s.includes("CERTIFICATE") || s.includes("DONE")) {
      badgeClass = "bg-green-100 text-green-700";
    } else if (s.includes("REJECTED")) {
      badgeClass = "bg-red-100 text-red-700";
    } else if (s.includes("VERIFIED") || s.includes("FORWARDED")) {
      badgeClass = "bg-blue-100 text-blue-700";
    }

    return (
      <div
        onClick={() => handleSelectApplicant(app)}
        className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
          selectedApplicant?.id === app.id
            ? "bg-green-50 border-l-4 border-green-700"
            : "border-l-4 border-transparent"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-800">{app.applicantName}</p>
            <p className="text-sm text-gray-500">{app.id}</p>
            <p className="text-xs text-blue-600 mt-1">
              Applied On: {app.applicationDate || "N/A"}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full text-center ${badgeClass}`}>
            {badgeText}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            Field Officer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Bihar One Application Verification Portal
          </p>
        </div>

        {/* Search Box */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 md:w-72">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError("");
                }}
                placeholder="Search by Application ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
          </form>
          {searchError && (
            <p className="text-red-500 text-xs mt-1 pl-1">{searchError}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 text-white rounded-xl p-6 flex items-center justify-between shadow-md">
          <div>
            <h3 className="text-lg font-medium text-blue-100">Total Assigned</h3>
            <p className="text-4xl font-bold mt-1">{totalAssigned}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-yellow-500 text-white rounded-xl p-6 flex items-center justify-between shadow-md">
          <div>
            <h3 className="text-lg font-medium text-yellow-100">
              Pending Verification
            </h3>
            <p className="text-4xl font-bold mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-green-700 text-white rounded-xl p-6 flex items-center justify-between shadow-md">
          <div>
            <h3 className="text-lg font-medium text-green-200">Processed</h3>
            <p className="text-4xl font-bold mt-1">{processedCount}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applicant List */}
        <div className="bg-white rounded-xl shadow-md flex flex-col h-[700px] overflow-hidden">
          <div className="bg-green-700 text-white p-4 shrink-0">
            <h2 className="font-semibold">Application Queue</h2>
          </div>

          <div className="overflow-y-auto flex-1 bg-white">
            <div className="bg-yellow-50 px-4 py-2 sticky top-0 border-b border-yellow-200 font-semibold text-yellow-800 text-sm z-10 shadow-sm">
              Pending Verification ({pendingCount})
            </div>

            {pendingApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending applications
              </div>
            ) : (
              pendingApplications.map((app) => (
                <ApplicantListItem key={app.id} app={app} />
              ))
            )}

            <div className="bg-gray-100 px-4 py-2 sticky top-0 border-y border-gray-200 font-semibold text-gray-600 text-sm z-10 shadow-sm mt-4">
              Processed ({processedCount})
            </div>

            {processedApplications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No processed applications
              </div>
            ) : (
              processedApplications.map((app) => (
                <ApplicantListItem key={app.id} app={app} />
              ))
            )}
          </div>
        </div>

        {/* Applicant Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md h-fit">
          <div className="bg-green-700 text-white p-4 rounded-t-xl">
            <h2 className="font-semibold">Applicant Information</h2>
          </div>

          {selectedApplicant ? (
            <div className="p-6">
              {/* Prior Remarks Grid */}
              <div
                className={`grid ${
                  selectedApplicant.roRemarks ? "md:grid-cols-2" : "md:grid-cols-1"
                } gap-4 mb-6`}
              >
                {/* Executive Remarks */}
                {selectedApplicant.executiveRemarks && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Executive Remarks
                    </h3>
                    <p className="text-yellow-900 text-sm">
                      {selectedApplicant.executiveRemarks}
                    </p>
                  </div>
                )}

                {/* RO Decision Remarks */}
                {selectedApplicant.roRemarks && (
                  <div
                    className={`border rounded-xl p-4 shadow-sm ${
                      selectedApplicant.status.toUpperCase().includes("APPROVED")
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <h3
                      className={`text-sm font-bold mb-2 flex items-center gap-2 ${
                        selectedApplicant.status.toUpperCase().includes("APPROVED")
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      RO Decision ({selectedApplicant.status.replace(/_/g, ' ')})
                    </h3>
                    <p
                      className={`text-sm ${
                        selectedApplicant.status.toUpperCase().includes("APPROVED")
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {selectedApplicant.roRemarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 border rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-green-700 mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailRow label="Application ID" value={selectedApplicant.id} />
                  <DetailRow label="Applicant Name" value={selectedApplicant.applicantName} />
                  <DetailRow label="Father Name" value={selectedApplicant.fatherName} />
                  <DetailRow label="Mother Name" value={selectedApplicant.motherName} />
                  <DetailRow label="Gender" value={selectedApplicant.gender} />
                  <DetailRow label="Aadhaar Number" value={selectedApplicant.aadhaar} />
                  <DetailRow label="Mobile Number" value={selectedApplicant.mobile} />
                  <DetailRow label="Email" value={selectedApplicant.email} />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 border rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-green-700 mb-4">
                  Address Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailRow label="State" value={selectedApplicant.state} />
                  <DetailRow label="District" value={selectedApplicant.district} />
                  <DetailRow label="Subdivision" value={selectedApplicant.subdivision} />
                  <DetailRow label="Block" value={selectedApplicant.block} />
                  <DetailRow label="Village" value={selectedApplicant.village} />
                  <DetailRow label="Post Office" value={selectedApplicant.postOffice} />
                  <DetailRow label="Police Station" value={selectedApplicant.policeStation} />
                  <DetailRow label="Pin Code" value={selectedApplicant.pinCode} />
                  <DetailRow label="Verification Level" value={selectedApplicant.verificationLevel} />
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 border rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-green-700 mb-4">
                  Uploaded Documents
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-semibold mb-3">Applicant Photo</h4>
                    {selectedApplicant.photoDocument ? (
                      <img
                        src={selectedApplicant.photoDocument}
                        alt="Applicant"
                        className="w-56 h-56 object-cover border rounded-lg"
                      />
                    ) : (
                      <p className="text-red-500">No Photo Uploaded</p>
                    )}
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-semibold mb-3">Aadhaar Document</h4>
                    {selectedApplicant.aadhaarDocument ? (
                      <>
                        <iframe
                          src={selectedApplicant.aadhaarDocument}
                          title="Aadhaar PDF"
                          width="100%"
                          height="350"
                          className="border rounded-lg"
                        />
                        <button
                          onClick={() => openPdfInNewTab(selectedApplicant.aadhaarDocument)}
                          className="inline-block mt-3 text-blue-700 font-medium hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
                        >
                          Open Full PDF
                        </button>
                      </>
                    ) : (
                      <p className="text-red-500">No Aadhaar Uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  Field Officer Remarks
                </label>
                <textarea
                  rows="4"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={isCompleted}
                  className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${
                    isCompleted
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                  placeholder="Enter field verification remarks..."
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-8 border-t pt-6">
                <div className="flex gap-3 flex-wrap">
                  <button
                    disabled={isCompleted}
                    onClick={() => {
                      const finalRemark =
                        remarks.trim() !== ""
                          ? remarks
                          : "Field verification completed and forwarded to RO.";
                      // The backend will set the exact status based on the /fo/ verify endpoint
                      updateApplicationStatus("VERIFIED_BY_FO", finalRemark);
                    }}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors shadow-sm ${
                      isCompleted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-800 text-white hover:shadow-md cursor-pointer"
                    }`}
                  >
                    {isCompleted ? "Forwarded To RO" : "Forward To RO"}
                  </button>
                  
                  {/* Note: I removed the Reject Button here because you mentioned not wanting it on the Executive Dashboard. 
                      If the FO is allowed to reject, you can add it back just like we did originally! */}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center h-full">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
              Select an application from the left panel to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex border-b pb-2">
      <span className="w-40 font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900 break-all">: {value || "-"}</span>
    </div>
  );
}

export default FieldOfficerDashboard;