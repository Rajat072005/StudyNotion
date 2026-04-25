import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";


//resetPasswordToken
export const resetPasswordToken = async (req,res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(401).json({
                success : false,
                message : "please provide your email"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success : false,
                message : "please sign up first"
            })
        }
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
                                        {email} , 
                                        {
                                            token : token,
                                            resetPasswordExpires : Date.now() + 5*60*1000

                                        },
                                        {
                                        new : true   
                                        }       
        )

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email , "Reset Password" , `link : ${url} `);

        return res.status(200).json({
            success : true,
            message : "email sent sucessfully , check it and change password"
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "try again later"
        })
    }
}

export const resetPassword = async (req , res) => {
    try {
        const {password ,confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.status(401).json({
                sucess : false,
                message : "password not matching"
            })
        }
        const userDetails = await User.findOne({token : token});

        if(!userDetails){
            return res.status(401).json({
                success : false,
                message : "invalid token"
            })
        }
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                sucess : false,
                message : "token expired"
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        
        await User.findOneAndUpdate(
            {token : token},
            {password : hashedPassword},
            {new : true}

        )
        return res.status(200).json({
            success : true,
            message : "password reset successfull"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "try again after some time" 
        })
    }
}