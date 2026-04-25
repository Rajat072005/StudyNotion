import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
import User from "../models/User.js";

//auth

export const auth = async (req, res, next) => {

    try {
        const token = req.body || req.cookies.token || req.header("Authorisation").replace("Bearer " , "");

        if(!token){
            return res.status(401).json({
                success : false,
                message : "missing token"
            })
        }

        try {
            const decode = jwt.verify(token , JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                success : false,
                message : "invalid token"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message: "try again later"
        })
    }
};

//isStudent

export const isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success : false,
                message : "this page only for students"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "try again after some time"
        })
    }
}

//isAdmin
export const isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success : false,
                message : "this page only for admins"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "try again after some time"
        })
    }
}


//isInstructor
export const isInstructor = async (req,res,next) => {    
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success : false,
                message : "this page only for Instructor"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "try again after some time"
        })
    }
}