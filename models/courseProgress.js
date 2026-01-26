const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");

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

const CourseProgressModel = model("CourseProgress", CourseProgressSchema);

module.exports = CourseProgressModel