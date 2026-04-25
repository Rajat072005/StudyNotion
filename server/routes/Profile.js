import express from "express";
const router = express.Router();

import { auth } from "../middlewares/auth";
import { UpdateProfile , deleteAccount} from "../controllers/Profile";

router.post("/updateProfile" ,auth, UpdateProfile);
router.delete("/deleteAccount" , auth , deleteAccount);

export default  router;