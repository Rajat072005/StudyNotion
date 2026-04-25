import express from "express";
const router = express.Router();

import { auth , isAdmin , isInstructor , isStudent } from "../middlewares/auth";
import { createCourse , getAllCourses , getCourseDetails } from "../controllers/Course";
import { createCategory , getAllCategory , categoryPageDetails } from "../controllers/Category";
import { createRating , getAverageRating , getAllRating } from "../controllers/RatingAndReview";
import { CreateSection , UpdateSection , DeleteSection } from "../controllers/Section";
import { CreateSubSection , UpdateSubSection , DeleteSubSection } from "../controllers/SubSection";


router.post("/createCourse" , auth , isAdmin , createCourse);
router.post("/createCategory" , auth , isAdmin , createCategory);
router.post("createRating" , auth , isStudent , createRating);
router.post("createSection" , auth , isAdmin , CreateSection);
router.post("createSubSection" , auth , isAdmin , CreateSubSection);

export default router;

