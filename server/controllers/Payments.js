import {instance} from "../config/razorpay";
import User, { findByIdAndUpdate } from "../models/User";
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
        //order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount : amount * 100,
            currency,
            receipt : Math.random(Date.now()).toString(),
            notes : {
                courseId : CourseId,
                userId : UserId,
            }
        }
        //initiate payment using razorpay
        try {
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success: true,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail : course.thumbnail,
                orderId : paymentResponse.id,
                amount : paymentResponse.amount

            })
        } catch (error) {
            console.log(error.message);
            return res.json({
                success : false,
                message : "could not initiate payment"
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}

//verify signature
export const verifysignature = async (req , res) => {
    const webhookSecret = "123456";
    const signature = req.headers["x-razorpay-signature"];


    const shasum = crypto.createHmac("sha256" , webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(webhookSecret === signature){
        console.log("payment is authorised");

        const {courseId , userId} = req.body.payload.entity.notes;

        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                                            {_id : courseId},
                                            {$push : {studentsEnrolled : userId}},
                                            {new : true},
            )
            if(!enrolledCourse){
                return res.stauts(500).json({
                    success : true,
                    message : "course not found"
                })
            }
            console.log(enrolledCourse);

            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id : userId},
                                            {$push : {courses : courseId}},
                                            {new : true},
            )
            console.log(enrolledStudent);

            const emailResponse = await mailSender(
                                           enrolledStudent.email,
                                           "Congratulations from code help",
                                           "You have successfully purchased the course" 
            )
            console.log(emailResponse);
            return res.status(200).json({
                success : true,
                message : "course purchased successfully",
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success : false,
                message : error.message,
            })
        }
    }
    else{
        return res.status(400).json({
            success : false,
            message : "Invalid request",
        })
    }
}