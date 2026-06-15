import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What is Bihar One?",
    answer:
      "Bihar One is a digital platform that provides various government certificate and service applications online.",
  },
  {
    question: "How can I apply for a certificate?",
    answer:
      "Select the desired service, fill out the application form, upload required documents, and submit the application.",
  },
  {
    question: "How can I track my application?",
    answer:
      "You can track your application using the Application ID provided after successful submission.",
  },
  {
    question: "Is there any application fee?",
    answer:
      "Application fees depend on the selected service and government regulations.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Approval time varies depending on the service and verification process.",
  },
  {
    question: "How can I apply for a Residence Certificate online?",
    answer:
      "You can apply by logging into the BiharOne portal, selecting 'Residence Certificate' under services, and filling out the online form with required documents.",
  },
  {
    question: "Is there any fee for applying through BiharOne?",
    answer:
      "Most services are free of charge, but some certificates may require a nominal application fee. The fee details are shown before submission.",
  },
  {
    question: "How do I track my application status?",
    answer:
      "Use the 'Track Status' option on the portal and enter your application ID to view the current progress.",
  },
  {
    question: "What documents are required for a Caste Certificate?",
    answer:
      "You need proof of identity, proof of residence, and supporting caste documents. The exact list is displayed when you start the application.",
  },
  {
    question: "Can I edit my application after submission?",
    answer:
      "No, once submitted you cannot edit the application. However, you can reapply with correct details if needed.",
  },
  {
    question: "How will I receive my certificate?",
    answer:
      "Certificates are issued digitally and can be downloaded directly from the portal once approved.",
  },
  {
    question: "What should I do if I forget my login password?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your registered mobile number or email, and follow the reset instructions.",
  },
  {
    question: "Can I update my mobile number or email ID after registration?",
    answer:
      "Yes, you can update your contact details by going to 'Profile Settings' in your account dashboard.",
  },
  {
    question: "Which browsers are supported for BiharOne portal?",
    answer:
      "The portal works best on modern browsers like Google Chrome, Microsoft Edge, and Firefox.",
  },
  {
    question: "Where can I get help if I face issues during application?",
    answer:
      "You can contact the BiharOne helpline at 18003456200 or email support at support@biharonline.gov.in.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

   useEffect(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth" 
        });
    }, []);

  return (
    <section className="bg-gray-50 py-10 px-2">
      <div className="max-w-md mx-auto">
        {" "}
        {/* narrower width */}
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Quick answers about Bihar One services.
          </p>
        </div>
        {/* FAQ Cards */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-800 leading-snug">
                  {faq.question}
                </span>

                {activeIndex === index ? (
                  <FaChevronUp className="text-blue-600 text-sm" />
                ) : (
                  <FaChevronDown className="text-gray-500 text-sm" />
                )}
              </button>

              {activeIndex === index && (
                <div className="px-4 pb-3 text-gray-600 border-t">
                  <p className="pt-2 text-xs leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;