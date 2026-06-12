import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import addressData from "../addressData/address.json";

const initialFormData = {
  fullName: "",
  gender: "",
  fatherName: "",
  motherName: "",
  aadhaar: "",
  phone: "",
  email: "",

  state: "Bihar",
  district: "",
  subdivision: "",
  block: "",
  village: "",
  postOffice: "",
  policeStation: "",
  pinCode: "",

  password: "",
  confirmPassword: "",

  otp: "",
};

const stepMeta = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Address Details" },
  { id: 3, title: "Security Setup" },
  { id: 4, title: "OTP Verification" },
];

const inputClassName =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100";

function RegisterForm({ goToLogin }) {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState("");

  const [formData, setFormData] = useState(initialFormData);
  const districts = addressData.districts || [];

  const selectedDistrict =
    districts.find((item) => item.district === formData.district) || null;

  const subdivisions = selectedDistrict?.subdivisions || [];

  const selectedSubdivision =
    subdivisions.find((item) => item.subdivision === formData.subdivision) || null;

  const blocks = selectedSubdivision?.blocks || [];

  const selectedBlock =
    blocks.find((item) => item.block === formData.block) || null;

  const policeStations = selectedBlock?.policeStations || [];

  const setFieldValue = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // ONLY LETTERS
    if (
      ["fullName", "fatherName", "motherName", "village", "postOffice"].includes(
        name
      )
    ) {
      const filteredValue = value
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      setFieldValue(name, filteredValue);
      return;
    }

    // ONLY NUMBERS
    if (["aadhaar", "phone", "pinCode", "otp"].includes(name)) {
      setFieldValue(name, value.replace(/\D/g, ""));
      return;
    }

    // RESET DISTRICT DATA
    if (name === "district") {
      setFormData((currentData) => ({
        ...currentData,
        district: value,
        subdivision: "",
        block: "",
        policeStation: "",
      }));
      return;
    }

    if (name === "subdivision") {
      setFormData((currentData) => ({
        ...currentData,
        subdivision: value,
        block: "",
        policeStation: "",
      }));
      return;
    }

    if (name === "block") {
      setFormData((currentData) => ({
        ...currentData,
        block: value,
        policeStation: "",
      }));
      return;
    }

    setFieldValue(name, value);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    // STEP 1
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!/^[A-Za-z\s]+$/.test(formData.fullName)) newErrors.fullName = "Only letters allowed";
      if (!formData.gender) newErrors.gender = "Please select gender";
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
      if (!/^[A-Za-z\s]+$/.test(formData.fatherName)) newErrors.fatherName = "Only letters allowed";
      if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required";
      if (!/^[A-Za-z\s]+$/.test(formData.motherName)) newErrors.motherName = "Only letters allowed";
      if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = "Aadhaar must be 12 digits";
      if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Mobile number must be 10 digits";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email";
    }

    // STEP 2
    if (currentStep === 2) {
      if (!formData.district) newErrors.district = "Select district";
      if (!formData.subdivision) newErrors.subdivision = "Select subdivision";
      if (!formData.block) newErrors.block = "Select block";
      if (!formData.village.trim()) newErrors.village = "Village is required";
      if (!/^[A-Za-z\s]+$/.test(formData.village)) newErrors.village = "Only letters allowed";
      if (!formData.postOffice.trim()) newErrors.postOffice = "Post office is required";
      if (!/^[A-Za-z\s]+$/.test(formData.postOffice)) newErrors.postOffice = "Only letters allowed";
      if (!formData.policeStation) newErrors.policeStation = "Select police station";
      if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = "Pin code must be 6 digits";
    }

    // STEP 3
    if (currentStep === 3) {
      if (formData.password.length < 8) newErrors.password = "Password minimum 8 characters";
      if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    }

    // STEP 4
    if (currentStep === 4) {
      if (!formData.otp || formData.otp.length !== 6) {
        newErrors.otp = "OTP must be 6 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setBackendError("");
      setStep((currentStep) => currentStep + 1);
    }
  };

  const prevStep = () => {
    setBackendError("");
    setStep((currentStep) => currentStep - 1);
  };

  const renderError = (fieldName) => {
    if (!errors[fieldName]) return null;
    return <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>;
  };

  return (
   <main className="flex flex-col items-center py-14 px-4">
     <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-400 bg-white">
        {/* HEADER */}
        <div className="bg-blue-900 px-6 py-8 text-center text-white">
          <h1 className="text-4xl font-bold">New User Registration</h1>
          <p className="mt-3 text-blue-100">Create your Bihar One account</p>
        </div>

        {/* SUCCESS */}
        {showSuccess ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-3xl font-bold text-white">
              ✓
            </div>
            <h2 className="mt-6 text-4xl font-bold text-green-700">
              Registration Successful
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Your account has been created successfully.
            </p>
            <button
              onClick={() => navigate("/user-login")}
              className="cursor-pointer mt-8 rounded-lg bg-blue-800 px-10 py-3 text-lg font-semibold text-white hover:bg-blue-900"
            >
              Go To Login
            </button>
          </div>
        ) : (
          <>
            {/* STEP INDICATOR */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {stepMeta.map((item) => {
                  const isActive = step === item.id;
                  const isComplete = step > item.id;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border px-4 py-3 text-sm transition
                      ${
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

            <div className="px-6 py-8">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="mx-auto max-w-5xl">
                  <h2 className="text-3xl font-bold text-blue-900">
                    Basic Details
                  </h2>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter full name"
                      />
                      {renderError("fullName")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Gender *</label>
                      <div className="flex gap-4 rounded-lg border border-slate-300 p-3">
                        {["Male", "Female", "Other"].map((gender) => (
                          <label key={gender} className="flex items-center gap-2">
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
                      <label className="mb-2 block font-semibold">Father's Name *</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter father's name"
                      />
                      {renderError("fatherName")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Mother's Name *</label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter mother's name"
                      />
                      {renderError("motherName")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Aadhaar Number *</label>
                      <input
                        type="text"
                        name="aadhaar"
                        maxLength="12"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter Aadhaar Number"
                      />
                      {renderError("aadhaar")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Mobile Number *</label>
                      <input
                        type="text"
                        name="phone"
                        maxLength="10"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter mobile number"
                      />
                      {renderError("phone")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter email address"
                      />
                      {renderError("email")}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="cursor-pointer rounded-lg bg-blue-800 px-10 py-3 font-semibold text-white hover:bg-blue-900"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="mx-auto max-w-6xl">
                  <h2 className="text-3xl font-bold text-blue-900">
                    Address Details
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Enter your residential address details.
                  </p>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        readOnly
                        className={`${inputClassName} bg-slate-100 text-slate-600`}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">District *</label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district.district} value={district.district}>
                            {district.district}
                          </option>
                        ))}
                      </select>
                      {renderError("district")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Subdivision *</label>
                      <select
                        name="subdivision"
                        value={formData.subdivision}
                        onChange={handleChange}
                        className={inputClassName}
                        disabled={!formData.district}
                      >
                        <option value="">Select Subdivision</option>
                        {subdivisions.map((item) => (
                          <option key={item.subdivision} value={item.subdivision}>
                            {item.subdivision}
                          </option>
                        ))}
                      </select>
                      {renderError("subdivision")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Block *</label>
                      <select
                        name="block"
                        value={formData.block}
                        onChange={handleChange}
                        className={inputClassName}
                        disabled={!formData.subdivision}
                      >
                        <option value="">Select Block</option>
                        {blocks.map((item) => (
                          <option key={item.block} value={item.block}>
                            {item.block}
                          </option>
                        ))}
                      </select>
                      {renderError("block")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Village / Mohalla *</label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter village / mohalla"
                      />
                      {renderError("village")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Post Office *</label>
                      <input
                        type="text"
                        name="postOffice"
                        value={formData.postOffice}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter post office"
                      />
                      {renderError("postOffice")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Police Station *</label>
                      <select
                        name="policeStation"
                        value={formData.policeStation}
                        onChange={handleChange}
                        className={inputClassName}
                        disabled={!formData.block}
                      >
                        <option value="">Select Police Station</option>
                        {policeStations.map((station) => (
                          <option key={station} value={station}>
                            {station}
                          </option>
                        ))}
                      </select>
                      {renderError("policeStation")}
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Pin Code *</label>
                      <input
                        type="text"
                        name="pinCode"
                        maxLength="6"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className={inputClassName}
                        placeholder="Enter pin code"
                      />
                      {renderError("pinCode")}
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
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

              {/* STEP 3 */}
              {step === 3 && (
                <div className="mx-auto max-w-6xl">
                  <h2 className="text-3xl font-bold text-blue-900">
                    Security Setup
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Create a secure password for your Bihar One account.
                  </p>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={inputClassName}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                        >
                          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      {renderError("password")}
                      <p className="mt-2 text-sm text-slate-500">
                        Password must contain at least 8 characters.
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={inputClassName}
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      {renderError("confirmPassword")}
                    </div>
                  </div>
                  <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-sm text-blue-900">
                    Use a strong password containing uppercase letters, lowercase
                    letters, numbers, and special characters for better account security.
                  </div>

                  {backendError && (
                    <div className="mt-4 text-center font-semibold text-red-600">
                      {backendError}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        if (validateStep(3)) {
                          setIsSubmitting(true);
                          setBackendError("");
                          try {
                            const payload = {
                              name: formData.fullName,
                              email: formData.email,
                              password: formData.password,
                              aadharNumber: formData.aadhaar,
                              phoneNumber: formData.phone,
                              fatherName: formData.fatherName,
                              motherName: formData.motherName,
                              gender: formData.gender,
                              state: formData.state,
                              district: formData.district,
                              subdivision: formData.subdivision,
                              block: formData.block,
                              village: formData.village,
                              postOffice: formData.postOffice,
                              policeStation: formData.policeStation,
                              pincode: formData.pinCode // Matches the backend requirement exactly
                            };
                            
                            await axios.post(`${backendUrl}/citizens/register`, payload);
                            setStep(4);
                          } catch (err) {
                            setBackendError(
                              typeof err.response?.data === "string"
                                ? err.response?.data
                                : "Registration failed"
                            );
                          } finally {
                            setIsSubmitting(false);
                          }
                        }
                      }}
                      className={`cursor-pointer rounded-lg px-10 py-3 font-semibold text-white transition ${
                        isSubmitting ? "bg-slate-400" : "bg-blue-800 hover:bg-blue-900"
                      }`}
                    >
                      {isSubmitting ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="mx-auto max-w-4xl">
                  <h2 className="text-3xl font-bold text-blue-900">
                    OTP Verification
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Enter the OTP sent to your registered mobile number to complete registration.
                  </p>
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                        🔐
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Verify OTP
                        </h3>
                        <p className="text-sm text-slate-500">
                          Please enter the 6-digit OTP
                        </p>
                      </div>
                    </div>
                    <div className="mt-8">
                      <label className="mb-2 block font-semibold">Enter OTP *</label>
                      <input
                        type="text"
                        name="otp"
                        maxLength="6"
                        value={formData.otp}
                        onChange={handleChange}
                        className={`${inputClassName} text-center text-2xl tracking-[10px]`}
                        placeholder="------"
                      />
                      {renderError("otp")}
                    </div>
                    <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                      OTP has been sent to:
                      <span className="ml-1 font-semibold">{formData.email}</span>
                    </div>
                    <div className="mt-5 text-sm text-slate-600">
                      Didn’t receive OTP?
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await axios.post(`${backendUrl}/citizens/resend-otp`, null, {
                              params: { phoneNumber: formData.phone }
                            });
                            alert(`OTP resent successfully to ${formData.email}`);
                          } catch (err) {
                            alert(
                              typeof err.response?.data === "string"
                                ? err.response?.data
                                : "Failed to resend OTP"
                            );
                          }
                        }}
                        className="ml-2 font-semibold text-blue-700 hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  {backendError && (
                    <div className="mt-4 text-center font-semibold text-red-600">
                      {backendError}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cursor-pointer rounded-lg border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        if (validateStep(4)) {
                          setIsSubmitting(true);
                          setBackendError("");
                          try {
                            await axios.post(`${backendUrl}/citizens/verify-otp`, null, {
                              params: { phoneNumber: formData.phone, enteredOtp: formData.otp }
                            });
                            setShowSuccess(true);
                          } catch (err) {
                            setBackendError(
                              typeof err.response?.data === "string"
                                ? err.response?.data
                                : "OTP verification failed"
                            );
                            navigate('/register');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }
                      }}
                      className={`cursor-pointer rounded-lg px-10 py-3 font-semibold text-white transition ${
                        isSubmitting ? "bg-slate-400" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isSubmitting ? "Verifying..." : "Final Submit"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
   </main>
  );
}

export default RegisterForm;
