// About.jsx
import React from "react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Hero Section */}
      <div className="rounded-lg p-10 shadow-lg mb-10">
        <h1 className="text-blue-600 text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg">
          Welcome to <span className="font-semibold">BiharOne Dashboard</span> —
          One Portal For All Bihar Services. Our mission is to make government
          services simple, transparent, and accessible to every citizen.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Our Mission
        </h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Provide quick and easy access to essential certificates</li>
          <li>Ensure transparency with real-time application tracking</li>
          <li>Promote digital governance and reduce paperwork</li>
          <li>Deliver citizen-centric services with reliability</li>
        </ul>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">
            Convenience
          </h3>
          <p>
            Apply for Residence, Income, and Caste certificates online from the
            comfort of your home.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">
            Transparency
          </h3>
          <p>
            Track your application status in real-time and stay updated on
            approvals or pending requests.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Support</h3>
          <p>
            Access FAQs, contact support, and get help whenever you need it.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">
            Digital Governance
          </h3>
          <p>
            Empowering citizens with secure, user-friendly services that bring
            administration closer to the people.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Contact Us
        </h2>
        <p className="text-lg mb-2">
          Have questions or need assistance? Visit our{" "}
          <a href="/contact" className="text-blue-600 underline">
            Contact page
          </a>
          .
        </p>
        <p className="text-lg">We’re here to help you every step of the way.</p>
      </div>
    </div>
  );
}
