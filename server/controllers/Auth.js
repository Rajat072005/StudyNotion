import User from "../models/User.js";
import OTP from "../models/OTP.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//send OTP

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "user already exists",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp : ", otp);

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (error) {
    console.log("error while generating otp : ", error);
    res.status(500).json({
      success: false,
      message: "try again later",
    });
  }
};
 
//signup

export const signup = async (req, res) => {
  try {
    //fetch
    const {
      FirstName,
      LastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
      image
    } = req.body;

    if (
      !FirstName ||
      !LastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword does not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "user already exists",
      });
    }
    //find most recent otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    //validate otp
    if (recentOtp.length == 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if (otp != recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "incorrect otp",
      });
    }

    //hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in db
    // null profile for user

    const profileDetails = await Profile.create({
      Gender : null , 
      DateOfBirth : null,
      About : null,
      MobileNumber : null
    })

    const user = await User.create({
      FirstName,
      LastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails : profileDetails._id,
      image : `https://api.dicebear.com/5.x/initials/svg?seed=${FirstName} ${LastName}`,
    });


    return res.status(200).json({
      success : true , 
      message : "user registered successfully",
      user
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success : false,
      message : "try again later"
    })
  }
};


//login

export const login = async (req , res) => {
  try {
    //fetch data 
    const {email , password} = req.body

    //validation

    if(!email || !password){
      return res.status(403).json({
        success : false,
        message : "all fields required"
      })
    }

    //existing user

    const user = await User.findOne({email}).populate("additionalDetails");

    if(!user){
      return res.status(400).json({
        success : false , 
        message : "user does not exist"
      })
    }

    if(await bcrypt.compare(password , user.password)){
      const payload = {
        email : user.email,
        id : user._id,
        accountType : user.accountType
      }
      const token = jwt.sign(payload , process.env.JWT_SECRET , {
        expiresIn : "2h"
      })
      user.token = token;
      user.password = undefined;

      const options =  {
        expiresIn : new Date(Date.now() + 3*24*60*60*1000),
        httpOnly : true
      }

      res.cookie("token" , token , options).status(200).json({
        success : true,
        token,
        user,
        message : "logged in successfully"
      })
    }
    else{
      return res.status(401).json({
        success : false,
        message : "wrong password"
      })
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success : false,
      message : "try again later"
    })
  }
}