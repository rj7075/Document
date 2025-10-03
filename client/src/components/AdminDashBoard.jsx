import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/pdf/submissions"
        );
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading submissions...</p>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center text-indigo-700 py-4">
        Admin Dashboard
      </h1>

      {/* Table Container */}
      <div className="flex-1 px-4 pb-4 flex flex-col">
        <div className="bg-white shadow-md rounded-lg flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Table */}
          <div className="overflow-auto flex-1">
            <table className="w-full min-w-max border-collapse">
              <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Designation</th>
                  <th className="py-3 px-4 text-left">Aadhar</th>
                  <th className="py-3 px-4 text-left">PAN</th>
                  <th className="py-3 px-4 text-left">DOB</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-center text-gray-500">
                      No submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">{item.companyName}</td>
                      <td className="py-3 px-4">{item.designation}</td>
                      <td className="py-3 px-4">{item.aadharNo}</td>
                      <td className="py-3 px-4">{item.panNo}</td>
                      <td className="py-3 px-4">
                        {new Date(item.dob).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-4 flex gap-2 whitespace-nowrap">
                        <a
                          href={`http://localhost:4000/api/pdf/download/noc/${item.fileName}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
                        >
                          Download NOC
                        </a>
                        <a
                          href={`http://localhost:4000/api/pdf/download/lease/${item.leaseFileName}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                        >
                          Download Lease
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
