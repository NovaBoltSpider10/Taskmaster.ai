import { Router } from "express";
import { authUser, resetPassword } from "../controllers/authController.js";

const router = Router();

router.post("/", authUser); // Login
router.post("/reset-password", resetPassword); // New route

export default router;
