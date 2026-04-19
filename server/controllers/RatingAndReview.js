import User from "../models/User";
import Course from "../models/Course";
import RatingAndReview from "../models/RatingAndReview";

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