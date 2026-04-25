import express from "express";
const router = express.Router();

import { auth , isStudent , isAdmin , isInstructor } from "../middlewares/auth";
import { login , sendOTP , signup ,  } from "../controllers/Auth";
import { resetPassword , resetPasswordToken } from "../controllers/ResetPassword";

router.post("/login" , login);
router.post("/signUp" ,signup);
router.post("/sendOTP" , sendOTP);
router.post("/reset-Password-Token" , resetPasswordToken);
router.post("/reset-Password" , resetPassword);

export default router;