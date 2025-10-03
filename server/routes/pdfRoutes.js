import express from "express";

import { downloadDocument } from "../controller/nocController.js";

import {
  downloadLease,
  getSubmissions,
  submitCompanyData,
} from "../controller/companyController.js";

const router = express.Router();

// Route to submit NOC form
router.post("/submit", submitCompanyData);
router.get("/submissions", getSubmissions); // ✅ Admin dashboard uses this
router.get("/download/:type/:filename", downloadDocument);

export default router;
