const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");


const CourseSchema = new Schema({
    courseName : {
        type : String,
        required : true,
        trim : true
    },
    courseDescription : {
        type : String,
        required : true , 
        trim : true
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    whatYouWillLearn : {
        type : String,
        trim : true
    },
    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Section"
        }
    ],
    ratingAndReview : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "RatingAndReview"
        }
    ],
    price : {
        type : String,
    },
    thumbnail : {
        type : String
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    studentsEnrolled : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
});

const CourseModel = model("Course", CourseSchema);

module.exports = CourseModel