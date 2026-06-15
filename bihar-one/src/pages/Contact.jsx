// Contact.jsx
import React, {useEffect} from "react";

export default function Contact() {
   useEffect(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth" 
        });
      }, []);
  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="rounded-lg p-10 shadow-lg mb-10">
        <h1 className="text-4xl text-white-500 font-bold mb-4">Contact Us</h1>
        <p className="text-lg">
          Have questions or need assistance? We’re here to help you every step
          of the way.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">
            📍 Address
          </h2>
          <p>Government Service Center</p>
          <p>Patna, Bihar, India</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">📞 Phone</h2>
          <p>
            Helpline:{" "}
            <a href="tel:+911234567890" className="text-blue-600 underline">
              +91 12345 67890
            </a>
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">✉️ Email</h2>
          <p>
            <a
              href="mailto:support@biharone.gov.in"
              className="text-blue-600 underline"
            >
              support@biharone.gov.in
            </a>
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">
            🕒 Working Hours
          </h2>
          <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
          <p>Saturday: 10:00 AM – 2:00 PM</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-blue-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Send us a message
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
