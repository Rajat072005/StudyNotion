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

        
        

    } catch (error) {
        console.log(error.message);
    }
}