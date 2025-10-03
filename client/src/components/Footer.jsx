import React from "react";

const Footer = () => {
  return (
    <div className="bg-white text-center py-6 shadow mt-auto">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Ranjeet Yadav. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
