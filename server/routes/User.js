import express from "express";
const router = express.Router();
import { auth , isStudent, isAdmin, isInstructor } from "../middlewares/auth.js";
import { login , sendOTP , signup ,  } from "../controllers/Auth.js";
import { resetPassword , resetPasswordToken } from "../controllers/ResetPassword.js";

router.post("/login" , login);
router.post("/signUp" ,signup);
router.post("/sendOTP" , sendOTP);
router.post("/reset-Password-Token" , resetPasswordToken);
router.post("/reset-Password" , resetPassword);

export default router;