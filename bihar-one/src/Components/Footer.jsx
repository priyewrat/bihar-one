function Footer() {
  return (
    <footer className="bg-white border-t py-5 px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-base md:text-xl print:hidden">
      <div className="text-center md:text-left text-gray-700">
        Developed by <span className="text-blue-700 font-bold">Solution Sneekers</span>
      </div>

      <div className="text-blue-700 text-center md:text-right font-medium">
        <span className="cursor-pointer hover:underline">Disclaimer</span> 
        <span className="mx-2 text-gray-400">|</span> 
        <span>Hosted On Vercel</span>
      </div>
    </footer>
  );
}

export default Footer;