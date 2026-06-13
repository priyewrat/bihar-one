import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import biharLogo from "../assets/bihar-govt-logo.png";
import { QRCodeSVG } from "qrcode.react";
import { AppContext } from "../context/AppContext";

const CertificatePage = () => {
  const { applicationId } = useParams(); 
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backendUrl}/residence/certificate/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    if (applicationId) {
      fetchCertificate();
    }
  }, [applicationId, backendUrl]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center text-red-500 font-semibold text-xl">
        Certificate not found.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xl">
        Loading Certificate...
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-200 py-6 sm:py-10 px-3 sm:px-4 print:p-0 print:bg-white flex flex-col items-center">
      
      {/* Top Action Bar (Print & Back) */}
      <div className="w-full max-w-[210mm] flex justify-between items-center mb-4 print:hidden gap-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md hover:bg-slate-700 transition cursor-pointer shadow-sm text-sm sm:text-base font-medium"
        >
          Back
        </button>

        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md hover:bg-green-700 transition cursor-pointer shadow-sm text-sm sm:text-base font-medium"
        >
          Print Certificate
        </button>
      </div>

      {/* Certificate Container */}
      <div className="w-full max-w-[210mm] min-h-auto sm:min-h-[297mm] print:w-[210mm] print:min-h-[290mm] bg-white border-2 border-black p-6 sm:p-10 md:p-12 print:p-12 font-serif relative shadow-lg print:shadow-none print:m-0 print:border-none">
        
        {/* Faded Watermark at Bottom Center */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none overflow-hidden">
          <img
            src={biharLogo}
            alt="Watermark"
            className="w-[280px] sm:w-[400px] md:w-[640px] print:w-[640px] opacity-[0.14] select-none" 
          />
        </div>

        {/* Header */}
        <div className="text-center relative z-10">
          <img
            src={biharLogo}
            alt="Bihar Government"
            className="w-full max-h-20 sm:max-h-24 md:max-h-28 print:max-h-28 object-contain mb-3 sm:mb-4"
          />

          <h1 className="text-xl sm:text-2xl md:text-3xl print:text-3xl font-bold">Government of Bihar</h1>

          <h2 className="text-sm sm:text-base md:text-lg print:text-lg mt-1 sm:mt-2">Form - XIII</h2>

          <h3 className="text-lg sm:text-xl md:text-3xl print:text-3xl font-bold mt-2 sm:mt-4 underline uppercase">
            Residence Certificate
          </h3>
        </div>

        {/* Certificate Details & Applicant Photo */}
        <div className="mt-6 sm:mt-8 md:mt-10 print:mt-10 relative z-10 flex flex-col-reverse sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-0">
          <div className="flex-1 w-full pr-0 sm:pr-4 text-xs sm:text-sm md:text-base print:text-base">
            <div className="flex justify-between">
              <p>
                <strong>District :</strong> {data.district}
              </p>
            </div>

            <div className="mt-1 sm:mt-2 flex justify-between">
              <p>
                <strong>Sub-Division :</strong> {data.subDivision}
              </p>
            </div>

            <div className="mt-1 sm:mt-2 text-left">
              <p className="mb-2 sm:mb-4">
                <strong>Block :</strong> {data.block}
              </p>
              <p className="font-bold text-sm sm:text-base md:text-lg print:text-lg">
                Certificate No : {data.certificateNumber}
              </p>
            </div>
          </div>

          {/* Photo Section */}
          <div className="w-24 h-28 sm:w-28 sm:h-32 print:w-28 print:h-32 border-2 border-gray-400 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0 sm:ml-4">
            {data.photo ? (
              <img
                src={`data:image/png;base64,${data.photo}`}
                alt="Applicant"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs sm:text-sm text-gray-400">Photo</span>
            )}
          </div>
        </div>

        {/* Certificate Body */}
        <div className="mt-6 sm:mt-8 md:mt-12 print:mt-12 text-sm sm:text-base md:text-[22px] print:text-[22px] leading-relaxed sm:leading-8 md:leading-[52px] print:leading-[52px] text-justify relative z-10">
          This is to certify that <strong>{data.applicantName}</strong>, son of{" "}
          <strong>{data.fatherName}</strong> and <strong>{data.motherName}</strong>,
          resident of <strong>{data.villageOrTown}</strong>,
          Post Office <strong>{data.postOffice}</strong>, Pincode <strong>{data.pinCode}</strong>,
          Police Station <strong>{data.policeStation}</strong>, Block <strong>{data.block}</strong>,
          Sub-Division <strong>{data.subDivision}</strong>, District{" "}
          <strong>{data.district}</strong>, State <strong>{data.state}</strong>, is a permanent
          resident of {data.state}.
        </div>

        {/* Place and Date */}
        <div className="mt-8 sm:mt-12 md:mt-16 print:mt-16 relative z-10 text-xs sm:text-sm md:text-base print:text-base">
          <p>
            <strong>Place :</strong> {data.block}
          </p>

          <p className="mt-1 sm:mt-2">
            <strong>Date :</strong> {data.certificateIssuedDate ? new Date(data.certificateIssuedDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }) : currentDate}
          </p>
        </div>

        {/* QR Code and Signature */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-10 sm:mt-12 md:mt-16 print:mt-16 relative z-10 gap-8 sm:gap-0">
          {/* QR */}
          <div className="text-center">
            {data.applicationNumber && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] print:w-[120px] print:h-[120px] mx-auto">
                <QRCodeSVG 
                  value={`Certificate No: ${data.certificateNumber}\nName: ${data.applicantName}\nFather's Name: ${data.fatherName}\nGender: ${data.gender}\nVerification Level: ${data.verificationLevel}`} 
                  style={{ width: "100%", height: "100%" }}
                  level="M"
                />
              </div>
            )}
            <p className="text-xs sm:text-sm mt-2">Scan for Verification</p>
          </div>

          {/* Signature */}
          <div className="text-center text-sm sm:text-base print:text-base">
            <h3 className="font-semibold">Sumit Sekhar (Dummy)</h3>

            <div className="w-48 sm:w-56 md:w-72 print:w-72 border-t border-black mt-2 sm:mt-4 pt-2">
              Revenue Officer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;