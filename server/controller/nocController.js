import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Company from "../models/Company.js";
import { generateNOCPDF } from "../pdfservice/noc.js";
// Your pdf-lib generator

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(__dirname, "../downloads");

// Ensure downloads folder exists
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// ----------------- Submit NOC -----------------
// export const submitNOC = async (req, res) => {
//   try {
//     const {
//       name,
//       address,
//       panNo,
//       aadharNo,
//       companyName,
//       companyAddress,
//       companyOwnerName,
//       designation,
//       dob,
//     } = req.body;

//     // Validate required fields
//     if (
//       !name ||
//       !address ||
//       !panNo ||
//       !aadharNo ||
//       !companyName ||
//       !companyAddress ||
//       !companyOwnerName ||
//       !designation ||
//       !dob
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }

//     const timestamp = Date.now();

//     // ----- Generate NOC PDF -----
//     const nocFileName = `NOC_${name.replace(/\s+/g, "_")}_${timestamp}.pdf`;
//     const nocFilePath = path.join(downloadsDir, nocFileName);

//     const nocPdfBytes = await generateNOCPDF({
//       name,
//       address,
//       panNo,
//       aadharNo,
//       companyName,
//       companyAddress,
//       companyOwnerName,
//       designation,
//       dob,
//     });

//     fs.writeFileSync(nocFilePath, nocPdfBytes);

//     // Save company record in DB
//     const company = new Company({
//       name,
//       address,
//       panNo,
//       aadharNo,
//       companyName,
//       companyAddress,
//       companyOwnerName,
//       designation,
//       dob,
//       fileName: nocFileName,
//     });

//     await company.save();

//     res.json({
//       success: true,
//       message: "NOC PDF generated successfully",
//       nocDownloadUrl: `/api/download/${nocFileName}`,
//       companyId: company._id,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error generating NOC PDF" });
//   }
// };

// ✅ Download NOC
// export const downloadDocument = (req, res) => {
//   const filePath = path.join(downloadsDir, req.params.filename);

//   if (fs.existsSync(filePath)) {
//     res.download(filePath, (err) => {
//       if (err) {
//         console.error("Download error:", err);
//         res.status(500).json({ message: "Error downloading file" });
//       }
//     });
//   } else {
//     res.status(404).json({ message: "File not found" });
//   }
// };
// import fs from "fs";
// import path from "path";

const nocDir = path.join(process.cwd(), "downloads/noc");
const leaseDir = path.join(process.cwd(), "downloads/lease");

export const downloadDocument = (req, res) => {
  const { type, filename } = req.params; // type can be 'noc' or 'lease'

  let folderPath;
  if (type === "noc") folderPath = nocDir;
  else if (type === "lease") folderPath = leaseDir;
  else return res.status(400).json({ message: "Invalid document type" });

  const filePath = path.join(folderPath, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
};
