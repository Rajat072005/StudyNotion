import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CourseProgressSchema = new Schema({
    courseID : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Course"
    },
    completedVideos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "SubSection"
        }
    ]
    
});

const CourseProgress = model("CourseProgress", CourseProgressSchema);

export default CourseProgress;