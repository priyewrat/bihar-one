// src/pages/Services.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { FaHome, FaMoneyBill, FaUsers, FaBaby } from "react-icons/fa";

import { AppContext } from "../context/AppContext";

const mainServices = [
  {
    title: "Residence Certificate",
    icon: <FaHome className="text-6xl text-blue-700" />,
    path: "/residence-certificate",
  },
  {
    title: "Income Certificate",
    icon: <FaMoneyBill className="text-6xl text-green-600" />,
    path: "/income-certificate",
  },
  {
    title: "Caste Certificate",
    icon: <FaUsers className="text-6xl text-orange-500" />,
    path: "/caste-certificate",
  },
  {
    title: "Birth Certificate",
    icon: <FaBaby className="text-6xl text-pink-500" />,
    path: "/birth-certificate",
  },
];

const otherServices = [
  {
    title: "Character Certificate",
    icon: "📄",
    path: "/character-certificate",
  },
  {
    title: "Labour Registration",
    icon: "🏭",
    path: "https://blrd.skillmissionbihar.org/#/",
    external: true,
  },
  {
    title: "Tourism Services",
    icon: "🧳",
    path: "https://tourism.bihar.gov.in/",
    external: true,
  },
  {
    title: "Revenue & Land Reforms",
    icon: "🌳",
    path: "https://biharbhumi.bihar.gov.in/Biharbhumi/",
    external: true,
  },
];

export default function Services() {
  const navigate = useNavigate();

  // LOGIN CHECK
  const { token } = useContext(AppContext);

  const isLoggedIn = !!token;

  const cardStyle =
    "bg-white shadow-lg rounded-lg p-5 border-b-4 border-orange-500 h-52 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer";

  const buttonStyle =
    "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        {/* SERVICES SECTION */}
        <section className="md:col-span-2">
          {/* GENERAL SERVICES */}
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            General Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {mainServices.map((service) => (
              <div
                key={service.title}
                className={cardStyle}
                onClick={() => navigate(service.path)}
              >
                {/* CENTER CONTENT */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-4 w-full">
                    {/* ICON */}
                    <div className="flex items-center justify-center min-w-[70px]">
                      {service.icon}
                    </div>

                    {/* TEXT */}
                    <h2 className="text-xl font-bold leading-snug">
                      {service.title}
                    </h2>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.path);
                    }}
                    className={buttonStyle}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* OTHER SERVICES */}
          <h2 className="text-2xl font-semibold mt-16 mb-4 text-blue-700">
            Other Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {otherServices.map((service) => (
              <div
                key={service.title}
                className={cardStyle}
                onClick={() => navigate(service.path)}
              >
                {/* CENTER CONTENT */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-4 w-full">
                    {/* ICON */}
                    <div className="flex items-center justify-center min-w-[70px]">
                      <div className="text-6xl">{service.icon}</div>
                    </div>

                    {/* TEXT */}
                    <h2 className="text-xl font-bold leading-snug">
                      {service.title}
                    </h2>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (service.external) {
                        window.open(service.path, "_blank");
                      } else {
                        navigate(service.path);
                      }
                    }}
                    className={buttonStyle}
                  >
                    {service.external ? "Visit Now" : "Apply Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* Citizen Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Citizen Section
            </h2>

            <div className="space-y-3">
              {/* SHOW ONLY WHEN NOT LOGGED IN */}
              {!isLoggedIn && (
                <SidebarItem
                  icon="📝"
                  text="Register Yourself"
                  onClick={() => navigate("/register")}
                />
              )}

              {/* SHOW ONLY WHEN LOGGED IN */}
              {isLoggedIn && (
                <>
                  <SidebarItem
                    icon="🔍"
                    text="Track Application"
                    onClick={() => navigate("/track-application")}
                  />

                  <SidebarItem
                    icon="⬇️"
                    text="Download Certificate"
                    onClick={() => navigate("/download-certificate")}
                  />
                </>
              )}
            </div>
          </div>

          {/* SUPPORT SECTION */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Support Section
            </h2>

            <div className="space-y-3">
              <SidebarItem
                icon="❓"
                text="FAQ"
                onClick={() => navigate("/faqs")}
              />

              <SidebarItem icon="📄" text="SOPs" />

              <SidebarItem
                icon="📞"
                text="Contact Us"
                onClick={() => navigate("/contact")}
              />

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-orange-500 text-lg">📧</span>

                <a
                  href="mailto:serviceonline.bihar@gov.in"
                  className="text-blue-600 hover:underline"
                >
                  serviceonline.bihar@gov.in
                </a>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */

function SidebarItem({ icon, text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition-all duration-300"
    >
      <span className="text-orange-500 text-lg">{icon}</span>

      <span>{text}</span>
    </div>
  );
}
