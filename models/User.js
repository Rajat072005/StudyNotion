const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");

const UserSchema = new Schema({
    FirstName : {
        type : String ,
        required : true
    },
    LastName : {
        type : String,
        required : true
    },
    
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    accountType : {
        type : String,
        enum : ["Instructor" , "Student" , "Admin"],
        required: true
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true
    },
    token : {
        type : String
    },
    resetPasswordExpires:{
        type : Date
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course"
        }
    ],
    image : {
        type : String,
        required : true 
    },
    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "CourseProgress"
        }
    ]
    // confirm_password : {
    //     type : String,
    //     required : true
    // },
    // mobile_number : {
    //     type : Number,
    //     required : true
    // },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel