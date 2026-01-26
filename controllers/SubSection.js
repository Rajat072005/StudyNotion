import Section from "../models/Section.js";
import SubSection from "../models/SubSection.js";
import {uploadImageToCloudinary} from "../utils/imageUploader.js";
import dotenv from "dotenv";
dotenv.config();
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

