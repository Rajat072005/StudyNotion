const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category"); 
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config;

exports.createCourse = async (req,res) => {
    try {
        //fetch data
        const {courseName , courseDescription ,  whatYouWillLearn , price , category} = req.body;


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

        if(!tagDetails){
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
            category: categoryDetails._id

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

exports.getAllCourses = async (req,res) => {
    try {
        const allCourses = await Tag.find({} , {courseName : true , 
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