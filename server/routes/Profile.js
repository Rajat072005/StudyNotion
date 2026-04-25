import express from "express";
const router = express.Router();

import { auth } from "../middlewares/auth.js";
import { UpdateProfile , deleteAccount} from "../controllers/Profile.js";

router.post("/updateProfile" ,auth, UpdateProfile);
router.delete("/deleteAccount" , auth , deleteAccount);

export default  router;