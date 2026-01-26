import Section from "../models/Section.js";
import Course from "../models/Course.js";

//create section
export const CreateSection = async (req,res) => {
    try {
        const {sectionName , courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(422).json({
                success : false,
                message:"required fields"
            })
        }
        const newSection = await Section.create({
            sectionName
        })

        const UpdatedCourseDetails = await Course.findByIdAndUpdate(courseId , 
            {
                $push:{
                    courseContent : newSection._id
                }
            },
            {new : true}, 
        )

        return res.status(200).json({
            success : true,
            message : "section created succcessfully",
            UpdatedCourseDetails
        })

    } catch (error) {
        console.log(error.message);
        return  res.status(500).json({
            success:false,
            message:"error while creating section"
        })
    }
}

export const UpdateSection = async (req,res) => {
    try {
        const {updatedSectionName , SectionId} = req.body;
        if(!updatedSectionName || !SectionId){
            return res.status(422).json({
                success : false,
                message:"required fields"
            })
        }

        const UpdatedSectionDetails = await Section.findByIdAndUpdate(SectionId , 
            {sectionName : updatedSectionName},
            {new : true},
        )

        return res.status(200).json({
            success : true,
            message : "section updated successfully",
            UpdatedSectionDetails
        })

        

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message:"error while updating section"
        })
        
    }
}

export const DeleteSection = async (req,res) => {
    try {
        const {SectionId} = req.params;
        if(!SectionId){
            return res.status(422).json({
                success : false,
                message:"required field"
            })
        }
        await Section.findByIdAndDelete(SectionId);
        return res.status(200).json({
            success : true,
            message:"section deleted successfully"
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message:"error while deleting section"
        })
    }
}