import express from "express";
const router = express.Router();

import { auth , isAdmin , isInstructor , isStudent } from "../middlewares/auth.js";
import { createCourse , getAllCourses , getCourseDetails } from "../controllers/Course.js";
import { createCategory , getAllCategory , categoryPageDetails } from "../controllers/Category.js";
import { createRating , getAverageRating , getAllRating } from "../controllers/RatingAndReview.js";
import { CreateSection , UpdateSection , DeleteSection } from "../controllers/Section.js";
import { CreateSubSection , UpdateSubSection , DeleteSubSection } from "../controllers/SubSection.js";


router.post("/createCourse" , auth , isInstructor , createCourse);
router.get("/getAllCourses"   , getAllCourses);
router.get("/getCourseDetails"   , getCourseDetails);
router.post("/createCategory" , auth , isAdmin , createCategory);
router.get("/getAllCategory" , getAllCategory);
router.post("/createRating" , auth , isStudent , createRating);
router.post("/createSection" , auth , isInstructor , CreateSection);
router.put("/updateSection" , auth , isInstructor , UpdateSection);
router.delete("/deleteSection/:SectionId" , auth , isInstructor , DeleteSection);
router.post("/createSubSection" , auth , isInstructor , CreateSubSection);
router.put("/updateSubSection" , auth , isInstructor , UpdateSubSection);
router.delete("/deleteSubSection/:SubSectionId" , auth , isInstructor , DeleteSubSection);

export default router;

