import {
  FaHome,
  FaMoneyBill,
  FaUsers,
  FaSearch,
  FaIdCard,
  FaBuilding,
  FaHeadphones,
  FaFileInvoice,
} from "react-icons/fa";

import { RiGovernmentLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import budha from "../assets/budha_image.png";

function Home() {
  const navigate = useNavigate();

  const cardStyle =
    "bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      {/* HERO SECTION */}

      <div className="relative max-w-7xl mx-auto mb-10 overflow-hidden rounded-3xl shadow-2xl">
        <img
          src={budha}
          alt="Budha"
          className="w-full h-[500px] object-cover"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="px-6 md:px-14 max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              Welcome to BiharOne
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed">
              One Digital Portal for Bihar Government Services & Citizen
              Assistance
            </p>

            <button
              onClick={() => navigate("/services")}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-4 rounded-xl font-semibold shadow-lg"
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
        {/* LEFT SECTION */}

        <div className="flex-1">
          {/* TOP CARDS */}

          {/* Top Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {/* Card 1 */}

            <div
              className="bg-white shadow-lg rounded-lg p-5 border-b-4 border-blue-500 cursor-pointer 
              hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300 ease-in-out"
              onClick={() => navigate("/residence-certificate")}
            >
              <div className="flex items-center gap-4">
                <FaHome className="text-6xl text-blue-700 transition-transform duration-300 group-hover:scale-110" />

                <h2 className="text-lg font-bold text-gray-800">
                  Residence Certificate
                </h2>
              </div>
            </div>

            {/* Card 2 */}

            <div
              className="bg-white shadow-lg rounded-lg p-5 border-b-4 border-green-500 cursor-pointer 
              hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300 ease-in-out"
              onClick={() => navigate("/income-certificate")}
            >
              <div className="flex items-center gap-4">
                <FaMoneyBill className="text-6xl text-green-600 transition-transform duration-300" />

                <h2 className="text-lg font-bold text-gray-800">
                  Income Certificate
                </h2>
              </div>
            </div>

            {/* Card 3 */}

            <div
              className="bg-white shadow-lg rounded-lg p-5 border-b-4 border-orange-500 cursor-pointer 
              hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300 ease-in-out"
              onClick={() => navigate("/caste-certificate")}
            >
              <div className="flex items-center gap-4">
                <FaUsers className="text-6xl text-orange-500 transition-transform duration-300" />

                <h2 className="text-lg font-bold text-gray-800">
                  Caste Certificate
                </h2>
              </div>
            </div>

            {/* Card 4 */}

            <div
              className="bg-white shadow-lg rounded-lg p-5 border-b-4 border-blue-500 cursor-pointer 
              hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
             transition-all duration-300 ease-in-out"
              onClick={() => navigate("/track-application")}
            >
              <div className="flex items-center gap-4">
                <FaSearch className="text-6xl text-blue-700 transition-transform duration-300" />

                <h2 className="text-lg font-bold text-gray-800">
                  Track Application Status
                </h2>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}

          <div className={`${cardStyle} p-8 mb-10`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Quick Links
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* LINK ITEM */}

              <div
                onClick={() =>
                  window.open(
                    "https://myaadhaar.uidai.gov.in/genricDownloadAadhaar/en",
                    "_blank",
                  )
                }
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <FaIdCard className="text-5xl text-orange-500 mx-auto mb-4" />

                <p className="font-semibold text-gray-700">Aadhaar Services</p>
              </div>

              <div
                onClick={() =>
                  window.open(
                    "https://biharbhumi.bihar.gov.in/Biharbhumi/",
                    "_blank",
                  )
                }
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <FaHome className="text-5xl text-orange-400 mx-auto mb-4" />

                <p className="font-semibold text-gray-700">Land Records</p>
              </div>

              <div
                onClick={() =>
                  window.open(
                    "https://www.myscheme.gov.in/search/state/Bihar",
                    "_blank",
                  )
                }
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <RiGovernmentLine className="text-5xl text-green-500 mx-auto mb-4" />

                <p className="font-semibold text-gray-700">Schemes</p>
              </div>

              <div
                onClick={() => navigate("/contact")}
                className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <FaHeadphones className="text-5xl text-blue-700 mx-auto mb-4" />

                <p className="font-semibold text-gray-700">Support Center</p>
              </div>
            </div>
          </div>

          {/* POPULAR SERVICES */}

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Popular Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* SERVICE CARD */}

              <div
                className={`${cardStyle} p-8 flex flex-col justify-between min-h-[240px]`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <FaFileInvoice className="text-5xl text-blue-700" />

                    <h2 className="text-2xl font-bold text-gray-800">
                      e-Challan
                    </h2>
                  </div>

                  <p className="text-gray-500 mb-6">
                    Pay traffic challans online quickly and securely.
                  </p>
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold"
                  onClick={() =>
                    window.open(
                      "https://echallan.parivahan.gov.in/index/accused-challan",
                      "_blank",
                    )
                  }
                >
                  Visit Now
                </button>
              </div>

              {/* SERVICE CARD */}

              <div
                className={`${cardStyle} p-8 flex flex-col justify-between min-h-[240px]`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <FaIdCard className="text-5xl text-green-600" />

                    <h2 className="text-2xl font-bold text-gray-800">
                      Ration Card
                    </h2>
                  </div>

                  <p className="text-gray-500 mb-6">
                    Access ration card related services and updates.
                  </p>
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold"
                  onClick={() =>
                    window.open("https://rconline.bihar.gov.in/", "_blank")
                  }
                >
                  Visit Now
                </button>
              </div>

              {/* SERVICE CARD */}

              <div
                className={`${cardStyle} p-8 flex flex-col justify-between min-h-[240px]`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <FaBuilding className="text-5xl text-blue-700" />

                    <h2 className="text-2xl font-bold text-gray-800">
                      Download Certificate
                    </h2>
                  </div>

                  <p className="text-gray-500 mb-6">
                    Download approved certificates anytime online.
                  </p>
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold"
                  onClick={() => navigate("/download-certificate")}
                >
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="w-full xl:w-[360px] space-y-8">
          {/* ANNOUNCEMENTS */}

          <div className={`${cardStyle} overflow-hidden`}>
            <div className="bg-blue-700 text-white px-6 py-5">
              <h2 className="text-xl font-bold">Announcements</h2>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-gray-700 leading-relaxed">
                • New guidelines for certificate applications
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Portal maintenance on 25th June
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Support hours extended from 9 AM to 9 PM
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Aadhaar integration enabled for faster verification
              </p>

              <p className="text-gray-700 leading-relaxed">
                • Updated helpline numbers for citizens
              </p>
            </div>
          </div>

          {/* HELP BOX */}

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Need Help?</h2>

                  <p className="text-blue-100">
                    Our support team is here for you.
                  </p>
                </div>

                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt=""
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/faqs")}
                  className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                >
                  FAQs
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="flex-1 bg-blue-900 py-3 rounded-xl font-semibold hover:bg-blue-950 transition-all duration-300"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
