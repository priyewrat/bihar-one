import React, {useEffect} from 'react'

function IncomeCertificateFrom() {
  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth" // Optional: gives a nice smooth scrolling effect
      });
    }, []);
  
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 mt-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          {/* Alert Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <svg
              className="h-10 w-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
  
          {/* Heading */}
          <h2 className="mb-3 text-2xl font-bold text-slate-800 md:text-3xl">
            Service Unavailable
          </h2>
  
          {/* Description */}
          <p className="text-slate-500">
            The Income Certificate Application service is currently undergoing
            maintenance or is unavailable. Please check back later.
          </p>
        </div>
      </div>
    );
}

export default IncomeCertificateFrom
