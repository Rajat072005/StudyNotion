import {instance} from "../config/razorpay";
import User from "../models/User";
import Course from "../models/Course";
import mailSender from "../utils/mailSender";
import mongoose from "mongoose";

//capture payment and initialize razorpay 
export const CapturePayment = async (req,res) => {
    try {
        const {CourseId} = req.body;
        const UserId = req.user.id;

        if(!CourseId){
            return res.status(401).json({
                success : false,
                message : "provide valid course id"
            })
        }

        let course;
        try {
            course = await Course.findById(CourseId);
            if(!course){
                return res.json({
                    success : false,
                    message : "cousre not found"
                })
            }
            const uid = new mongoose.Types.ObjectId(UserId);
            if(course.studentsEnrolled.includes(uid)){
                return res.json({
                    success : false,
                    message : "user has already purchased this course"
                })
            }
        } catch (error) {
            console.log(error.message)
        }


    } catch (error) {
        console.log(error.message);
    }
}