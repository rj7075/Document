import express from "express";
import { register, login } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register); // endpoint to create admin/user
router.post("/login", login); // endpoint to login and get JWT

export default router;
