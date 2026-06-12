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
    // ✅ Added print:p-0 and print:bg-white
    <div className="min-h-screen bg-gray-200 py-10 px-4 print:p-0 print:bg-white">
      
      {/* Top Action Bar (Print & Back) */}
      <div className="max-w-[210mm] mx-auto flex justify-between items-center mb-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-600 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition cursor-pointer shadow-sm"
        >
          Back
        </button>

        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition cursor-pointer shadow-sm"
        >
          Print Certificate
        </button>
      </div>

      {/* Certificate */}
      {/* ✅ Added print:min-h-[290mm], print:shadow-none, and print:m-0 */}
      <div className="w-[210mm] min-h-[297mm] print:min-h-[290mm] mx-auto bg-white border-2 border-black p-12 font-serif relative shadow-lg print:shadow-none print:m-0">
        
        {/* Faded Watermark at Bottom Center */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <img
            src={biharLogo}
            alt="Watermark"
            className="w-[640px] opacity-[0.14] select-none" 
          />
        </div>

        {/* Header */}
        <div className="text-center relative z-10">
          <img
            src={biharLogo}
            alt="Bihar Government"
            className="w-full max-h-28 object-contain mb-4"
          />

          <h1 className="text-3xl font-bold">Government of Bihar</h1>

          <h2 className="text-lg mt-2">Form - XIII</h2>

          <h3 className="text-3xl font-bold mt-4 underline uppercase">
            Residence Certificate
          </h3>
        </div>

        {/* Certificate Details & Applicant Photo */}
        <div className="mt-10 relative z-10 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex justify-between">
              <p>
                <strong>District :</strong> {data.district}
              </p>
            </div>

            <div className="mt-2 flex justify-between">
              <p>
                <strong>Sub-Division :</strong> {data.subDivision}
              </p>
            </div>

            <div className="mt-2 text-left">
              <p className="mb-4">
                <strong>Block :</strong> {data.block}
              </p>
              <p className="font-bold text-lg">
                Certificate No : {data.certificateNumber}
              </p>
            </div>
          </div>

          {/* Photo Section */}
          <div className="w-28 h-32 border-2 border-gray-400 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0 ml-4">
            {data.photo ? (
              <img
                src={`data:image/png;base64,${data.photo}`}
                alt="Applicant"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">Photo</span>
            )}
          </div>
        </div>

        {/* Certificate Body */}
        <div className="mt-12 text-[22px] leading-[52px] text-justify relative z-10">
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
        <div className="mt-16 relative z-10">
          <p>
            <strong>Place :</strong> {data.block}
          </p>

          <p className="mt-2">
            <strong>Date :</strong> {data.certificateIssuedDate ? new Date(data.certificateIssuedDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }) : currentDate}
          </p>
        </div>

        {/* QR Code and Signature */}
        <div className="flex justify-between items-end mt-16 relative z-10">
          {/* QR */}
          <div className="text-center">
            {data.applicationNumber && (
              <QRCodeSVG 
                value={`Certificate No: ${data.certificateNumber}\nName: ${data.applicantName}\nFather's Name: ${data.fatherName}\nGender: ${data.gender}\nVerification Level: ${data.verificationLevel}`} 
                size={120}
                level="M"
              />
            )}
            <p className="text-sm mt-2">Scan for Verification</p>
          </div>

          {/* Signature */}
          <div className="text-center">
            <h3>Sumit Sekhar(Dummy)</h3>

            <div className="w-72 border-t border-black mt-4 pt-2">
              Revenue Officer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;