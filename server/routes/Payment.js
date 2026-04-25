import express from "express";
const router = express.Router;

import { CapturePayment , verifysignature} from "../controllers/Payments";
import { auth , isStudent , isAdmin } from "../middlewares/auth";

router.post("/capturePayment" , auth , isStudent , CapturePayment);
router.post("verifySignature" , verifysignature);

export default router;