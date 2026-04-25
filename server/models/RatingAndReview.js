import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ratingAndReviewSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    rating : {
        type : Number
    },
    review : {
        type: String
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
        required : true,
        index : true,
    }
});

const ratingAndReview = model("RatingAndReview", ratingAndReviewSchema);
export default  ratingAndReview;