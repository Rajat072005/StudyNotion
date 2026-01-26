import Section from "../models/Section.js";
import SubSection from "../models/SubSection.js";
import {uploadImageToCloudinary} from "../utils/imageUploader.js";
import dotenv from "dotenv";
dotenv.config();

//create Sub section
export const CreateSubSection = async (req,res) => {
    try {
        const {title , timeDuration , description  , SectionId} = req.body;
        const video = req.files.videoFile;
        if(!title || !timeDuration || !description || !video || !SectionId){
            return res.status(422).json({
                success : false,
                message:"required fields"
            })
        }
        const uploadDetails = await uploadImageToCloudinary(video ,process.env.FOLDER_NAME )
        const newSubSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl : uploadDetails.secure_url
        })

        const UpdatedSectionDetails = await Section.findByIdAndUpdate(SectionId , 
            {
                $push:{
                    subSection : newSubSection._id
                }
            },
            {new : true}, 
        )

        return res.status(200).json({
            success : true,
            message : "Subsection created succcessfully",
            UpdatedSectionDetails
        })

    } catch (error) {
        console.log(error.message);
        return  res.status(500).json({
            success:false,
            message:"error while creating Subsection"
        })
    }
}

//update subsection
export const UpdateSubSection = async (req,res) => {
    try {
        const {updatedTitle ,updatedTimeDuration,updatedDescription, SubSectionId} = req.body;
        const video = req.files.videoFile;
        if(!updatedTitle || !updatedTimeDuration || !updatedDescription|| !video || !SubSectionId){
            return res.status(422).json({
                success : false,
                message:"required fields"
            })
        }
        const uploadDetails = await uploadImageToCloudinary(video ,process.env.FOLDER_NAME )

        const UpdatedSubSectionDetails = await SubSection.findByIdAndUpdate(SubSectionId , 
            {title : updatedTitle,
            timeDuration : updatedTimeDuration,
            description:updatedDescription,
            videoUrl : uploadDetails.secure_url
            },
            {new : true},
        )

        return res.status(200).json({
            success : true,
            message : "Subsection updated successfully",
            UpdatedSubSectionDetails
        })

        

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message:"error while updating Subsection"
        })
        
    }
}


// delete subsection
export const DeleteSubSection = async (req,res) => {
    try {
        const {SubSectionId} = req.params;
        const {SectionId} = req.body;
        if(!SubSectionId || !SectionId){
            return res.status(422).json({
                success : false,
                message:"required field"
            })
        }
        await Section.findByIdAndUpdate(SectionId , {
            $pull : {
                subSection : SubSectionId
            }
        })
        await SubSection.findByIdAndDelete(SubSectionId);
        return res.status(200).json({
            success : true,
            message:"Subsection deleted successfully"
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message:"error while deleting Subsection"
        })
    }
}