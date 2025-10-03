import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setHasToken(false);
    toast.success("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false); // close menu on logout
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // close menu after click
  };

  return (
    <div className="sticky top-0 z-50 shadow bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          My Application
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => handleNavigate("/")}
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => handleNavigate("/register")}
            className="text-gray-700 hover:text-blue-600"
          >
            Register
          </button>

          {role === "admin" && (
            <button
              onClick={() => handleNavigate("/AdminDashBoard")}
              className="bg-gray-500 text-white px-5 py-2 rounded-xl hover:bg-gray-600 font-semibold"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={hasToken ? handleLogout : () => handleNavigate("/login")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {hasToken ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-4">
          <button
            onClick={() => handleNavigate("/")}
            className="block w-full text-left text-gray-700 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate("/register")}
            className="block w-full text-left text-gray-700 hover:text-blue-600"
          >
            Register
          </button>
          {role === "admin" && (
            <button
              onClick={() => handleNavigate("/AdminDashBoard")}
              className="block w-full text-left bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={hasToken ? handleLogout : () => handleNavigate("/login")}
            className="block w-full text-left bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {hasToken ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
