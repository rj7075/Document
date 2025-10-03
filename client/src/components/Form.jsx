import { useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    companyName: "",
    companyAddress: "",
    companyOwnerName: "",
    designation: "",
    dob: "",
    aadharNo: "",
    panNo: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/pdf/submit",
        formData
      );
      toast.success("Form Submitted Successfully")
      // setMessage(
      //   `NOC generated successfully! Download here: ${res.data.nocDownloadUrl}`
      // );
      setFormData({
        name: "",
        address: "",
        companyName: "",
        companyAddress: "",
        companyOwnerName: "",
        designation: "",
        dob: "",
        aadharNo: "",
        panNo: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Error generating NOC PDF. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <form
        className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Virtual Office Registration
        </h2>

        {message && (
          <p className="text-center text-green-600 font-medium">{message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="companyAddress"
            placeholder="Company Address"
            value={formData.companyAddress}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="companyOwnerName"
            placeholder="Company Owner Name"
            value={formData.companyOwnerName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="aadharNo"
            placeholder="Aadhar No (12 digits)"
            value={formData.aadharNo}
            onChange={handleChange}
            required
            pattern="\d{12}"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="panNo"
            placeholder="PAN No"
            value={formData.panNo}
            onChange={handleChange}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105"
        >
          Register Virtual Office
        </button>
      </form>
    </div>
  );
}
