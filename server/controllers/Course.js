import Course from "../models/Course.js";
import User from "../models/User.js";
import Category from "../models/Category.js"; 
import {uploadImageToCloudinary} from "../utils/imageUploader.js";
import dotenv, { populate } from "dotenv";
dotenv.config(); 

export const createCourse = async (req,res) => {
    try {
        //fetch data
        const {courseName , courseDescription ,  whatYouWillLearn , price , category , tag} = req.body;


        //thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(401).json({
                success : false,
                message : "all fields are required"
            })
        }

        //instructor or not
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructor details : " , instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "instructor details not found"
            })
        }

        //tag validation
        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                sucess : false,
                message : "category details not found"
            })
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);
        

        //entry for new course

        const newCourse = await Course.create({
            courseName : courseName,
            courseDescription : courseDescription,
            whatYouWillLearn : whatYouWillLearn,
            instructor : instructorDetails._id,
            price : price,
            thumbnail : thumbnailImage.secure_url,
            category: categoryDetails._id,
            tag : tag

        })

        //add new course entry in user schema

        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push : {
                    courses : newCourse._id
                }
            },
            {
                new : true
            }
        )

        //update tag schema

        await Category.findByIdAndUpdate(
            {_id : categoryDetails._id},
            {
                $push : {
                    course : newCourse._id
                }
            },
            {
                new : true
            }
        )

        return res.status(200).json({
            success : true,
            message : "course created successfully",
            data : newCourse
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "error while creating course"
        })
    }
};

//get all courses
export const getAllCourses = async (req,res) => {
    try {
        const allCourses = await Course.find({} , {courseName : true , 
                                            price : true,
                                            thumbnail : true,
                                            instructor : true,
                                            ratingAndReview : true,
                                            studentsEnrolled : true

                                        })
                                        .populate("instructor")
                                        .exec();
        return res.status(200).json({
            success : true,
            message: "all courses returned successfully",
            allCourses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "could not fetch all courses"
        })
    }
};

// get course details
export const getCourseDetails = async (req,res) => {
    try {
        const {courseId} = req.body;
        
        const courseDetails = await Course.findById(courseId)
                                        .populate({
                                            path : "instructor",
                                            populate : [
                                                {
                                                    path : "additionalDetails"
                                                },
                                                {
                                                    path : "courses",
                                                    populate:{
                                                        path : "courseContent"
                                                    }
                                                }
                                            ]
                                        })

                                        .populate(
                                            {
                                                path : "ratingAndReview",
                                            }
                                        )
                                        .populate(
                                            {
                                                path : "category",
                                                select : "name description"

                                            }
                                        )
                                        .populate(
                                            {
                                                path : "courseContent",
                                                populate : {
                                                    path : "subSection",

                                                }
                                            }
                                        )
                                        .populate(
                                            {
                                                path : "studentsEnrolled",
                                                populate :
                                                    {
                                                        path : "additionalDetails",
                                                    }
                                            }
                                        )
                                        .exec();
        if(!courseDetails){
            return res.status(400).json({
                success : false,
                message :  `could not fetch course with id : ${courseId}`,
            })
        }
        return res.status(200).json({
            success : true,
            message : "course details fetched successfully",
            data : courseDetails
        })
                    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}