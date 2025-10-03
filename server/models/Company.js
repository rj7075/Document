import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  companyOwnerName: { type: String, required: true },
  designation: { type: String, required: true },
  dob: { type: String, required: true },
  aadharNo: { type: String, required: true, unique: true, match: /^\d{12}$/ },
  panNo: { type: String, unique: true, match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ },
  fileName: { type: String, required: true },
  leaseFileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Company = mongoose.model("Company", companySchema);
export default Company;
