import express from "express";
const router = express.Router();

import { auth } from "../middlewares/auth.js";
import { UpdateProfile , deleteAccount, updateDisplayPicture , getUserDetails} from "../controllers/Profile.js";

router.put("/updateProfile" , auth, UpdateProfile);
router.delete("/deleteAccount" , auth , deleteAccount);
router.put("/updateDisplayPicture" ,auth, updateDisplayPicture);
router.get("/getUserDetails" , auth , getUserDetails);

export default  router;