import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // 👈 add this

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://document-85hq.onrender.com/api/auth/login",
        formData
      );

      if (res.data.success) {
        const token = res.data.token;

        // ✅ Save JWT
        localStorage.setItem("token", token);

        // ✅ Decode role from token
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // { userId, role, iat, exp }
        localStorage.setItem("role", decoded.role);

        toast.success("Login successful!");
        setMessage("Login successful!");

        // ✅ Redirect based on role
        if (decoded.role === "admin") {
          navigate("/AdminDashBoard");
        } else {
          navigate("/");
        }
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <span className="text-blue-500 underline">
            <a href="/register"> Register</a>
          </span>
        </p>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
