import fs from "fs";
import path from "path";
import Company from "../models/Company.js";
import { generateNOCPDF } from "../pdfservice/noc.js";
import { generateLeaseAgreementPDF } from "../pdfservice/lease.js";

const nocDir = path.join(process.cwd(), "downloads/noc");
if (!fs.existsSync(nocDir)) fs.mkdirSync(nocDir, { recursive: true });

const leaseDir = path.join(process.cwd(), "downloads/lease");
if (!fs.existsSync(leaseDir)) fs.mkdirSync(leaseDir, { recursive: true });

// Submit Form and Generate Both PDFs
export const submitCompanyData = async (req, res) => {
  try {
    const {
      name,
      address,
      companyName,
      companyAddress,
      companyOwnerName,
      designation,
      dob,
      aadharNo,
      panNo,
    } = req.body;

    if (
      !name ||
      !address ||
      !companyName ||
      !companyAddress ||
      !companyOwnerName ||
      !designation ||
      !dob ||
      !aadharNo ||
      !panNo
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const timestamp = Date.now();

    // NOC
    const nocFileName = `NOC_${name.replace(/\s+/g, "_")}_${timestamp}.pdf`;
    const nocPath = path.join(nocDir, nocFileName);
    const nocBytes = await generateNOCPDF({
      name,
      address,
      companyName,
      dob,
      aadharNo,
      panNo,
    });
    fs.writeFileSync(nocPath, nocBytes);

    // Lease
    const leaseFileName = `Lease_${name.replace(/\s+/g, "_")}_${timestamp}.pdf`;
    const leasePath = path.join(leaseDir, leaseFileName);
    const leaseBytes = await generateLeaseAgreementPDF({
      name,
      address,
      companyName,
      companyAddress,
      companyOwnerName,
      designation,
      dob,
      aadharNo,
      panNo,
    });
    fs.writeFileSync(leasePath, leaseBytes);

    // Save DB
    const company = new Company({
      name,
      address,
      companyName,
      companyAddress,
      companyOwnerName,
      designation,
      dob,
      aadharNo,
      panNo,
      fileName: nocFileName,
      leaseFileName,
    });
    await company.save();

    res.json({
      success: true,
      nocDownloadUrl: `/api/noc/download/${nocFileName}`,
      leaseDownloadUrl: `/api/lease/download/${leaseFileName}`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error generating documents" });
  }
};

// Download Lease
export const downloadLease = (req, res) => {
  const leaseDir = path.join(process.cwd(), "downloads/lease");
  const filePath = path.join(leaseDir, req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ message: "Lease file not found" });
};

// ✅ Get all submissions
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Company.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};
