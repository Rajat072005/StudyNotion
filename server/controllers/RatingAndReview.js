import User from "../models/User.js";
import Course from "../models/Course.js";
import RatingAndReview from "../models/RatingAndReview.js";
import mongoose from "mongoose";

//create rating 
export const createRating = async (req,res) => {
    try {
        const {rating , review , courseId} = req.body;
        const userId= req.user.id;

        const courseDetails = await Course.findOne(
                                        {
                                            _id : courseId,
                                            studentsEnrolled : userId,
                                        }
        )
        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "student not enrolled in this course",
            });
        }
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user : userId,
                                                course : courseId
                                            });
        if(alreadyReviewed){
            return res.status(401).json({
                sucess : false,
                message : "user has already reviewed this course"
            })
        }

        const ratingAndreview = await RatingAndReview.create(
                                                {
                                                    user : userId,
                                                    rating : rating,
                                                    review : review,
                                                    course : courseId
                                                
                                                });
        await Course.findByIdAndUpdate(
            {
                _id : courseId
            },
            {
                $push : {
                    ratingAndReview : ratingAndreview._id,
                }
            },
            {
                new : true,
            }
        );

        return res.status(200).json({
            success : true,
            message : "rating and review posted successfully",
            ratingAndreview
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            mesaage : "unable to post rating and review"
        }); 
    }
}

// get average rating
export const getAverageRating = async (req,res) => {
    try {
        const {courseId} = req.body;
        const result  = await RatingAndReview.aggregate(
                                    [
                                        {
                                            $match : {
                                                course : new mongoose.Types.ObjectId(courseId),
                                            }
                                        },
                                        {
                                            $group : {
                                                _id : null,
                                                averageRating : {$avg : "$rating"}
                                            }
                                        }
                                    ]);

        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,
            });
        }
        return res.status(200).json({
            success : true,
            message : "course has no rating yet",
            averageRating : 0,
        });
                                        
    } catch (error) {
        console.log(error.mesaage);
        return res.status(500).json({
            success : false,
            message : "unable to fetch average rating",
        });
    }
}

//get all rating and review
export const getAllRating = async (req,res) => {
    try {
        //const {courseId} = req.body;
        const allReviews = await RatingAndReview.find({})
                                            .sort({rating : "desc"})
                                            .populate({
                                                path : "user",
                                                select : "FirstName LastName email image"
                                            })
                                            .populate({
                                                path : "course",
                                                select : "courseName"
                                            })
                                            .exec();

        if(!allReviews){
            return res.status(200).json({
                success : true,
                message : "no reviews found"
            });

        }
        return res.status(200).json({
            success : true,
            message : "all reviews fetched",
            allReviews
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message: "unable to fetch all rating"
        });
    }
    
}