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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-3 sm:p-4 md:p-8">
      {/* HERO SECTION */}
      <div className="relative max-w-7xl mx-auto mb-8 md:mb-10 overflow-hidden rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl">
        <img
          src={budha}
          alt="Budha"
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 flex flex-col justify-center px-6 sm:px-10 md:px-14">
          <div className="max-w-2xl text-white text-center md:text-left mx-auto md:mx-0">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-3 md:mb-5 drop-shadow-md">
              Welcome to BiharOne
            </h1>

            <p className="text-base sm:text-lg md:text-2xl text-gray-100 mb-6 md:mb-8 leading-relaxed drop-shadow-md">
              One Digital Portal for Bihar Government Services & Citizen
              Assistance
            </p>

            <button
              onClick={() => navigate("/services")}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold shadow-lg text-sm md:text-base w-full sm:w-auto cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* LEFT SECTION */}
        <div className="flex-1">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8 md:mb-10">
            {/* Card 1 */}
            <div
              className="bg-white shadow-md hover:shadow-2xl rounded-xl p-4 md:p-5 border-b-4 border-blue-500 cursor-pointer 
              hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out"
              onClick={() => navigate("/residence-certificate")}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <FaHome className="text-4xl md:text-5xl xl:text-6xl text-blue-700 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Residence Certificate
                </h2>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white shadow-md hover:shadow-2xl rounded-xl p-4 md:p-5 border-b-4 border-green-500 cursor-pointer 
              hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out"
              onClick={() => navigate("/income-certificate")}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <FaMoneyBill className="text-4xl md:text-5xl xl:text-6xl text-green-600 transition-transform duration-300 flex-shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Income Certificate
                </h2>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="bg-white shadow-md hover:shadow-2xl rounded-xl p-4 md:p-5 border-b-4 border-orange-500 cursor-pointer 
              hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out"
              onClick={() => navigate("/caste-certificate")}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <FaUsers className="text-4xl md:text-5xl xl:text-6xl text-orange-500 transition-transform duration-300 flex-shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Caste Certificate
                </h2>
              </div>
            </div>

            {/* Card 4 */}
            <div
              className="bg-white shadow-md hover:shadow-2xl rounded-xl p-4 md:p-5 border-b-4 border-blue-500 cursor-pointer 
              hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out"
              onClick={() => navigate("/track-application")}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <FaSearch className="text-4xl md:text-5xl xl:text-6xl text-blue-700 transition-transform duration-300 flex-shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Track Application Status
                </h2>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className={`${cardStyle} p-5 md:p-8 mb-8 md:mb-10`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-8 text-center sm:text-left">
              Quick Links
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* LINK ITEM */}
              <div
                onClick={() => window.open("https://myaadhaar.uidai.gov.in/genricDownloadAadhaar/en", "_blank")}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center"
              >
                <FaIdCard className="text-3xl md:text-5xl text-orange-500 mb-2 md:mb-4" />
                <p className="font-semibold text-gray-700 text-sm md:text-base">Aadhaar Services</p>
              </div>

              <div
                onClick={() => window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/", "_blank")}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center"
              >
                <FaHome className="text-3xl md:text-5xl text-orange-400 mb-2 md:mb-4" />
                <p className="font-semibold text-gray-700 text-sm md:text-base">Land Records</p>
              </div>

              <div
                onClick={() => window.open("https://www.myscheme.gov.in/search/state/Bihar", "_blank")}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center"
              >
                <RiGovernmentLine className="text-3xl md:text-5xl text-green-500 mb-2 md:mb-4" />
                <p className="font-semibold text-gray-700 text-sm md:text-base">Schemes</p>
              </div>

              <div
                onClick={() => navigate("/contact")}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center"
              >
                <FaHeadphones className="text-3xl md:text-5xl text-blue-700 mb-2 md:mb-4" />
                <p className="font-semibold text-gray-700 text-sm md:text-base">Support Center</p>
              </div>
            </div>
          </div>

          {/* POPULAR SERVICES */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-6 text-center sm:text-left">
              Popular Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {/* SERVICE CARD */}
              <div className={`${cardStyle} p-6 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[240px]`}>
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <FaFileInvoice className="text-4xl md:text-5xl text-blue-700 flex-shrink-0" />
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                      e-Challan
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-500 mb-5 md:mb-6">
                    Pay traffic challans online quickly and securely.
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base cursor-pointer"
                  onClick={() => window.open("https://echallan.parivahan.gov.in/index/accused-challan", "_blank")}
                >
                  Visit Now
                </button>
              </div>

              {/* SERVICE CARD */}
              <div className={`${cardStyle} p-6 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[240px]`}>
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <FaIdCard className="text-4xl md:text-5xl text-green-600 flex-shrink-0" />
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                      Ration Card
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-500 mb-5 md:mb-6">
                    Access ration card related services and updates.
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base cursor-pointer"
                  onClick={() => window.open("https://rconline.bihar.gov.in/", "_blank")}
                >
                  Visit Now
                </button>
              </div>

              {/* SERVICE CARD */}
              <div className={`${cardStyle} p-6 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[240px]`}>
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <FaBuilding className="text-4xl md:text-5xl text-blue-700 flex-shrink-0" />
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                      Download Certificate
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-500 mb-5 md:mb-6">
                    Download approved certificates anytime online.
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base cursor-pointer"
                  onClick={() => navigate("/download-certificate")}
                >
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[300px] xl:w-[360px] space-y-6 md:space-y-8 mt-6 lg:mt-0">
          {/* ANNOUNCEMENTS */}
          <div className={`${cardStyle} overflow-hidden`}>
            <div className="bg-blue-700 text-white px-5 md:px-6 py-4 md:py-5 text-center lg:text-left">
              <h2 className="text-lg md:text-xl font-bold">Announcements</h2>
            </div>
            <div className="p-5 md:p-6 space-y-4 md:space-y-5">
              {[
                "New guidelines for certificate applications",
                "Portal maintenance on 25th June",
                "Support hours extended from 9 AM to 9 PM",
                "Aadhaar integration enabled for faster verification",
                "Updated helpline numbers for citizens",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HELP BOX */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden text-white relative">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between mb-5 md:mb-6 gap-4">
                <div className="text-center sm:text-left lg:text-center xl:text-left z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Need Help?</h2>
                  <p className="text-blue-100 text-sm md:text-base">
                    Our support team is here for you.
                  </p>
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt="Support"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
                />
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 md:gap-4 z-10 relative">
                <button
                  onClick={() => navigate("/faqs")}
                  className="flex-1 w-full bg-white text-blue-700 py-2 md:py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-md cursor-pointer text-sm md:text-base"
                >
                  FAQs
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="flex-1 w-full bg-blue-900 text-white py-2 md:py-3 rounded-xl font-bold hover:bg-blue-950 transition-all duration-300 shadow-md cursor-pointer text-sm md:text-base"
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