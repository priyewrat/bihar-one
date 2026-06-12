import { useState, useContext, useEffect } from "react";
import { jsPDF } from "jspdf";
import { AppContext } from "../context/AppContext";
import addressData from "../addressData/address.json";

const initialFormData = {
  applicantName: "",
  fatherName: "",
  motherName: "",
  gender: "",
  aadhaar: "",
  mobile: "",
  email: "",
  state: "Bihar",
  district: "",
  subdivision: "",
  block: "",
  village: "",
  postOffice: "",
  policeStation: "",
  pinCode: "",
  verificationLevel: "",
  photoFile: null,
  aadhaarFile: null,
};

const fieldLabels = {
  applicantName: "Applicant Name",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  gender: "Gender",
  aadhaar: "Aadhaar Number",
  mobile: "Mobile Number",
  email: "Email ID",
  state: "State",
  district: "District",
  subdivision: "Subdivision",
  block: "Block",
  village: "Village / Mohalla",
  postOffice: "Post Office",
  policeStation: "Police Station",
  pinCode: "Pin Code",
  verificationLevel: "Verification Level",
  photoFile: "Photo Document",
  aadhaarFile: "Aadhaar Document",
};

const stepMeta = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Personal Details" },
  { id: 3, title: "Verification Level" },
  { id: 4, title: "Upload Documents" },
  { id: 5, title: "Review & Submit" },
];

function ResidenceCertificateForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  // State to track which fields were auto-filled
  const [autofilledFields, setAutofilledFields] = useState({});

  const { backendUrl, userProfile } = useContext(AppContext);

  const districtOptions = addressData.districts || [];

  const selectedDistrictData =
    districtOptions.find(
      (districtObj) => districtObj.district === formData.district,
    ) || null;

  const selectedSubdivisionData =
    selectedDistrictData?.subdivisions.find(
      (subdivisionObj) => subdivisionObj.subdivision === formData.subdivision,
    ) || null;

  const selectedBlockData =
    selectedSubdivisionData?.blocks.find(
      (blockObj) => blockObj.block === formData.block,
    ) || null;

  // Function to return dynamic classes for inputs (applies background for autofilled fields)
  const getInputClassName = (name) => {
    const base =
      "w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-800";
    if (autofilledFields[name]) {
      return `${base} bg-blue-50 border-blue-300`;
    }
    return `${base} bg-white border-slate-300`;
  };

  const setFieldValue = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // If field was autofilled, remove it from autofilledFields since the user manually modified it
    setAutofilledFields((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (files && files.length > 0) {
      setFieldValue(name, files[0]);
      return;
    }

    if (["aadhaar", "mobile", "pinCode", "wardNo"].includes(name)) {
      setFieldValue(name, value.replace(/\D/g, ""));
      return;
    }

    // Character-only fields (letters + spaces)
    if (["applicantName", "fatherName", "motherName"].includes(name)) {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, ""); // strip non-letters
      setFieldValue(name, onlyLetters);
      return;
    }

    if (name === "district") {
      setFormData((currentData) => ({
        ...currentData,
        district: value,
        subdivision: "",
        block: "",
        policeStation: "",
      }));

      setAutofilledFields((prev) => {
        const next = { ...prev };
        delete next.district;
        delete next.subdivision;
        delete next.block;
        delete next.policeStation;
        return next;
      });

      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors.district;
        delete nextErrors.subdivision;
        delete nextErrors.block;
        delete nextErrors.policeStation;
        return nextErrors;
      });

      return;
    }

    setFieldValue(name, value);
  };

  const validateStep = (currentStep) => {
    const nextErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (currentStep === 1) {
      if (!formData.applicantName.trim()) {
        nextErrors.applicantName = "Applicant name is required.";
      } else if (!nameRegex.test(formData.applicantName)) {
        nextErrors.applicantName = "Applicant name must contain only letters.";
      }

      if (!formData.fatherName.trim()) {
        nextErrors.fatherName = "Father's name is required.";
      } else if (!nameRegex.test(formData.fatherName)) {
        nextErrors.fatherName = "Father's name must contain only letters.";
      }

      if (!formData.motherName.trim()) {
        nextErrors.motherName = "Mother's name is required.";
      } else if (!nameRegex.test(formData.motherName)) {
        nextErrors.motherName = "Mother's name must contain only letters.";
      }

      if (!formData.gender) {
        nextErrors.gender = "Please select a gender.";
      }

      if (!/^\d{12}$/.test(formData.aadhaar)) {
        nextErrors.aadhaar = "Aadhaar must be 12 digits.";
      }

      if (!/^[0-9]{10}$/.test(formData.mobile)) {
        nextErrors.mobile = "Mobile number must be 10 digits.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (currentStep === 2) {
      if (!formData.district) {
        nextErrors.district = "Please select a district.";
      }

      if (!formData.subdivision) {
        nextErrors.subdivision = "Please select a subdivision.";
      }

      if (!formData.block) {
        nextErrors.block = "Please select a block.";
      }

      if (!formData.village.trim()) {
        nextErrors.village = "Village or mohalla is required.";
      }

      if (!formData.postOffice.trim()) {
        nextErrors.postOffice = "Post office is required.";
      }

      if (!formData.policeStation) {
        nextErrors.policeStation = "Please select a police station.";
      }

      if (!/^\d{6}$/.test(formData.pinCode)) {
        nextErrors.pinCode = "Pin code must be 6 digits.";
      }
    }

    if (currentStep === 3) {
      if (!formData.verificationLevel) {
        nextErrors.verificationLevel = "Please select a verification level.";
      }
    }

    if (currentStep === 4) {
      if (!formData.photoFile) {
        nextErrors.photoFile = "Please upload the photo document.";
      }

      if (!formData.aadhaarFile) {
        nextErrors.aadhaarFile = "Please upload the Aadhaar document.";
      }

      if (formData.photoFile && formData.photoFile.type) {
        const allowedPhotoTypes = [
          "image/jpeg",
          "image/png",
          "application/pdf",
        ];
        if (!allowedPhotoTypes.includes(formData.photoFile.type)) {
          nextErrors.photoFile = "Photo must be JPG, PNG, or PDF.";
        }
      }

      if (
        formData.aadhaarFile &&
        formData.aadhaarFile.type !== "application/pdf"
      ) {
        nextErrors.aadhaarFile = "Aadhaar document must be a PDF.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const prevStep = () => {
    setStep((currentStep) => currentStep - 1);
  };

  // Resets the entire form and clears the autofilled records
  const handleClear = () => {
    setFormData(initialFormData);
    setAutofilledFields({});
    setErrors({});
  };

  const getFormattedDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const addWorkingDays = (date, days) => {
    const result = new Date(date);
    let added = 0;

    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        added += 1;
      }
    }

    return result;
  };

  const generateReceiptPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Residence Certificate Receipt", 14, 22);
    doc.setFontSize(12);
    doc.text(`Applicant Name: ${formData.applicantName}`, 14, 40);
    doc.text(`Application No.: ${applicationId}`, 14, 50);
    doc.text(`Applied Date: ${appliedDate}`, 14, 60);
    doc.text(`Expected Delivery Date: ${expectedDeliveryDate}`, 14, 70);
    doc.text(
      "Your certificate is expected within 10 working days from application.",
      14,
      82,
    );
    doc.save(`receipt-${applicationId}.pdf`);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const form = new FormData();

      // text fields
      form.append("applicantName", formData.applicantName);
      form.append("fatherName", formData.fatherName);
      form.append("motherName", formData.motherName);
      form.append("gender", formData.gender);

      // backend field names
      form.append("aadharNumber", formData.aadhaar);
      form.append("mobileNumber", formData.mobile);

      form.append("email", formData.email);
      form.append("state", formData.state);
      form.append("district", formData.district);

      // backend expects subDivision
      form.append("subDivision", formData.subdivision);
      form.append("block", formData.block);

      // backend expects villageOrTown
      form.append("villageOrTown", formData.village);

      form.append("postOffice", formData.postOffice);
      form.append("policeStation", formData.policeStation);
      form.append("pinCode", formData.pinCode);

      // verification mapping
      const verification =
        formData.verificationLevel === "Block Level"
          ? "Block"
          : formData.verificationLevel === "Sub-Division Level"
            ? "Subdivision"
            : "District";

      form.append("verificationLevel", verification);

      // files
      form.append("photo", formData.photoFile);
      form.append("proof", formData.aadhaarFile);

      // API CALL
      const response = await fetch(`${backendUrl}/residence/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      // HANDLE JSON RESPONSE
      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Application Failed");
      }

      // app id from backend
      const match = data.match(/RES-\d+/);
      const appId = match ? match[0] : "N/A";

      const today = new Date();
      const deliveryDate = addWorkingDays(today, 10);

      setApplicationId(appId);
      setAppliedDate(getFormattedDate(today));
      setExpectedDeliveryDate(getFormattedDate(deliveryDate));

      setShowSuccess(true);
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert(error.message);
    }
  };

  const renderError = (fieldName) => {
    if (!errors[fieldName]) {
      return null;
    }

    return <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>;
  };

  useEffect(() => {
    if (!userProfile) return;

    const newAutofilled = {};

    setFormData((prev) => {
      const updated = { ...prev };

      const autofill = (userKey, formKey) => {
        if (userProfile[userKey]) {
          updated[formKey] = userProfile[userKey];
          newAutofilled[formKey] = true;
        }
      };

      autofill("name", "applicantName");
      autofill("fatherName", "fatherName");
      autofill("motherName", "motherName");
      autofill("gender", "gender");
      autofill("aadharNumber", "aadhaar");
      autofill("phoneNumber", "mobile");
      autofill("email", "email");
      autofill("district", "district");
      autofill("block", "block");
      autofill("village", "village");
      autofill("postOffice", "postOffice");
      autofill("policeStation", "policeStation");
      autofill("pincode", "pinCode");

      return updated;
    });

    setAutofilledFields(newAutofilled);
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-blue-900 px-6 py-8 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-100">
            Bihar One
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Residence Certificate Application
          </h1>
          <p className="mt-3 text-sm text-blue-100 md:text-base">
            Fill in your details, review the information, and submit your
            application.
          </p>
        </div>

        {showSuccess ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
              OK
            </div>
            <h2 className="mt-6 text-3xl font-bold text-green-700">
              Application Submitted Successfully
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Your application ID is:
            </p>
            <p className="mt-3 text-3xl font-bold text-blue-900 md:text-4xl">
              {applicationId}
            </p>
            <div className="mt-6 space-y-3 text-slate-700 sm:text-base">
              <p>Applicant Name: {formData.applicantName}</p>
              <p>Applied Date: {appliedDate}</p>
              <p>Expected Delivery Date: {expectedDeliveryDate}</p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={generateReceiptPdf}
                className="cursor-pointer rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Download Receipt (PDF)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setErrors({});
                  setAutofilledFields({});
                  setApplicationId("");
                  setAppliedDate("");
                  setExpectedDeliveryDate("");
                  setShowSuccess(false);
                  setStep(1);
                }}
                className="cursor-pointer rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white transition hover:bg-blue-900"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                {stepMeta.map((item) => {
                  const isActive = step === item.id;
                  const isComplete = step > item.id;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border px-4 py-3 text-sm transition ${
                        isActive
                          ? "border-blue-800 bg-blue-50 text-blue-900"
                          : isComplete
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <p className="font-semibold">Step {item.id}</p>
                      <p className="mt-1">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-8 md:px-8">
              {step === 1 && (
                <div className="mx-auto max-w-5xl">
                  <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                    Basic Information
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Enter the applicant's personal and contact details.
                  </p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Applicant Name *
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleChange}
                        className={getInputClassName("applicantName")}
                        placeholder="Enter full name"
                      />
                      {renderError("applicantName")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className={getInputClassName("fatherName")}
                        placeholder="Enter father's name"
                      />
                      {renderError("fatherName")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Mother's Name *
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className={getInputClassName("motherName")}
                        placeholder="Enter mother's name"
                      />
                      {renderError("motherName")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Gender *
                      </label>
                      <div className={`flex flex-wrap gap-3 rounded-lg border p-3 transition ${autofilledFields.gender ? "border-blue-300 bg-blue-50" : "border-slate-300 bg-white"}`}>
                        {["Male", "Female", "Other"].map((gender) => (
                          <label
                            key={gender}
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={formData.gender === gender}
                              onChange={handleChange}
                            />
                            {gender}
                          </label>
                        ))}
                      </div>
                      {renderError("gender")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        name="aadhaar"
                        maxLength="12"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        className={getInputClassName("aadhaar")}
                        placeholder="12-digit Aadhaar number"
                      />
                      {renderError("aadhaar")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        maxLength="10"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={getInputClassName("mobile")}
                        placeholder="10-digit mobile number"
                      />
                      {renderError("mobile")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={getInputClassName("email")}
                        placeholder="Enter email address"
                      />
                      {renderError("email")}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="cursor-pointer rounded-lg bg-blue-800 px-10 py-3 font-semibold text-white transition hover:bg-blue-900"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto max-w-5xl">
                  <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                    Address Details
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Provide the applicant's residential address information.
                  </p>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        readOnly
                        className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        District *
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={getInputClassName("district")}
                      >
                        <option value="">Select district</option>
                        {districtOptions.map((districtObj) => (
                          <option
                            key={districtObj.district}
                            value={districtObj.district}
                          >
                            {districtObj.district}
                          </option>
                        ))}
                      </select>
                      {renderError("district")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Subdivision *
                      </label>
                      <select
                        name="subdivision"
                        value={formData.subdivision}
                        onChange={handleChange}
                        className={getInputClassName("subdivision")}
                        disabled={!formData.district}
                      >
                        <option value="">Select subdivision</option>
                        {selectedDistrictData?.subdivisions.map(
                          (subdivisionObj) => (
                            <option
                              key={subdivisionObj.subdivision}
                              value={subdivisionObj.subdivision}
                            >
                              {subdivisionObj.subdivision}
                            </option>
                          ),
                        )}
                      </select>
                      {renderError("subdivision")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Block *
                      </label>
                      <select
                        name="block"
                        value={formData.block}
                        onChange={handleChange}
                        className={getInputClassName("block")}
                        disabled={!formData.district}
                      >
                        <option value="">Select block</option>
                        {selectedSubdivisionData?.blocks.map((blockObj) => (
                          <option key={blockObj.block} value={blockObj.block}>
                            {blockObj.block}
                          </option>
                        ))}
                      </select>
                      {renderError("block")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Village / Mohalla *
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        className={getInputClassName("village")}
                        placeholder="Enter village or mohalla"
                      />
                      {renderError("village")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Post Office *
                      </label>
                      <input
                        type="text"
                        name="postOffice"
                        value={formData.postOffice}
                        onChange={handleChange}
                        className={getInputClassName("postOffice")}
                        placeholder="Enter post office"
                      />
                      {renderError("postOffice")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Police Station *
                      </label>
                      <select
                        name="policeStation"
                        value={formData.policeStation}
                        onChange={handleChange}
                        className={getInputClassName("policeStation")}
                        disabled={!formData.district}
                      >
                        <option value="">Select police station</option>
                        {selectedBlockData?.policeStations.map((station) => (
                          <option key={station} value={station}>
                            {station}
                          </option>
                        ))}
                      </select>
                      {renderError("policeStation")}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Pin Code *
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        maxLength="6"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className={getInputClassName("pinCode")}
                        placeholder="Enter 6-digit pin code"
                      />
                      {renderError("pinCode")}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="cursor-pointer rounded-lg bg-blue-800 px-10 py-3 font-semibold text-white transition hover:bg-blue-900"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mx-auto max-w-5xl">
                  <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                    Verification Level
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Select the verification level for this residence
                    certificate.
                  </p>

                  <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <p className="mb-4 text-sm font-semibold text-slate-700">
                      Other Verification Level:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Block Level",
                        "Sub-Division Level",
                        "District Level",
                      ].map((level) => (
                        <label
                          key={level}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 transition hover:border-blue-500"
                        >
                          <input
                            type="radio"
                            name="verificationLevel"
                            value={level}
                            checked={formData.verificationLevel === level}
                            onChange={handleChange}
                            className="h-4 w-4 cursor-pointer accent-blue-700"
                          />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                    {renderError("verificationLevel")}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="cursor-pointer rounded-lg bg-blue-800 px-10 py-3 font-semibold text-white transition hover:bg-blue-900"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="mx-auto max-w-5xl">
                  <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                    Upload Documents
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Upload the applicant photo and Aadhaar document before
                    review.
                  </p>

                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Upload Photo
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Accepts JPG, PNG, or PDF.
                      </p>
                      <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5 text-slate-700 transition hover:border-blue-500">
                        <span>
                          {formData.photoFile
                            ? formData.photoFile.name
                            : "Choose photo file"}
                        </span>
                        <input
                          type="file"
                          name="photoFile"
                          accept="image/jpeg,image/png"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                      {renderError("photoFile")}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Upload Aadhaar
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">PDF only.</p>
                      <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5 text-slate-700 transition hover:border-blue-500">
                        <span>
                          {formData.aadhaarFile
                            ? formData.aadhaarFile.name
                            : "Choose Aadhaar PDF"}
                        </span>
                        <input
                          type="file"
                          name="aadhaarFile"
                          accept="application/pdf"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                      {renderError("aadhaarFile")}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="cursor-pointer rounded-lg bg-blue-800 px-10 py-3 font-semibold text-white transition hover:bg-blue-900"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="mx-auto max-w-6xl">
                  <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                    Review & Submit
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Verify all entered details before submitting the
                    application.
                  </p>

                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    {/* PERSONAL DETAILS */}

                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Personal Details
                      </h3>

                      <div className="mt-4 space-y-4">
                        {[
                          "applicantName",
                          "fatherName",
                          "motherName",
                          "gender",
                          "aadhaar",
                          "mobile",
                          "email",
                        ].map((field) => (
                          <div
                            key={field}
                            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"
                          >
                            <span className="font-medium text-slate-500">
                              {fieldLabels[field]}
                            </span>

                            <span className="text-right font-semibold text-slate-900">
                              {formData[field]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ADDRESS DETAILS */}

                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Address Details
                      </h3>

                      <div className="mt-4 space-y-4">
                        {[
                          "state",
                          "district",
                          "subdivision",
                          "block",
                          "village",
                          "postOffice",
                          "policeStation",
                          "pinCode",
                        ].map((field) => (
                          <div
                            key={field}
                            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"
                          >
                            <span className="font-medium text-slate-500">
                              {fieldLabels[field]}
                            </span>

                            <span className="text-right font-semibold text-slate-900">
                              {formData[field]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VERIFICATION DETAILS */}

                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Verification Details
                      </h3>

                      <div className="mt-4 space-y-4">
                        {["verificationLevel"].map((field) => (
                          <div
                            key={field}
                            className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"
                          >
                            <span className="font-medium text-slate-500">
                              {fieldLabels[field]}
                            </span>

                            <span className="text-right font-semibold text-slate-900">
                              {formData[field]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DOCUMENT DETAILS */}

                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        Uploaded Documents
                      </h3>

                      <div className="mt-4 space-y-4">
                        {["photoFile", "aadhaarFile"].map((field) => (
                          <div
                            key={field}
                            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
                          >
                            <span className="font-medium text-slate-500">
                              {fieldLabels[field]}
                            </span>

                            <div className="flex items-center gap-3">
                              <span className="text-right font-semibold text-slate-900">
                                {formData[field]?.name || "Not Uploaded"}
                              </span>

                              {formData[field] && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const fileURL = URL.createObjectURL(
                                      formData[field],
                                    );

                                    window.open(fileURL, "_blank");
                                  }}
                                  className="cursor-pointer rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition hover:bg-blue-200"
                                >
                                  👁 View
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-sm text-blue-900">
                    Please verify all details carefully before submitting the
                    application. Once submitted, Application ID will be
                    generated automatically.
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="cursor-pointer rounded-lg bg-green-600 px-10 py-3 font-semibold text-white transition hover:bg-green-700"
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ResidenceCertificateForm;
