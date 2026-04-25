import express from "express";
const router = express.Router();

import { CapturePayment , verifysignature} from "../controllers/Payments.js";
import { auth , isStudent , isAdmin } from "../middlewares/auth.js";

router.post("/capturePayment" , auth , isStudent , CapturePayment);
router.post("/verifySignature" , verifysignature);

export default router;