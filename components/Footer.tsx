export default function Footer() {
  return (
    <footer className="w-full bg-black/20 backdrop-blur-xl text-gray-300 py-8">
      <div className="max-w-7xl text-sm lg:text-md mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-sm opacity-50">
          &copy; {new Date().getFullYear()} DesignToCode. All rights reserved.
        </p>
        <nav className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
