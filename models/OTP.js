const {
  Schema,
  model,
  default: mongoose,
  Types
} = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5*60
    }
});


async function sendVerificationMail (email , otp) {
    try {
        const mailResponse = await mailSender (email , "Verification email From StudyNotion" , otp);
        console.log("mail send successfully" , mailResponse);

    } catch (error) {
        console.log(error.message)
    }
}

OtpSchema.pre('save' , async function (next){
    await sendVerificationMail(this.email , this.otp);
    next();
})

const OtpModel = model("OTP", OtpSchema);

module.exports = OtpModel