import Category from "../models/Category.js";
import Course from "../models/Course.js";

//create category
export const createCategory = async (req,res) => {
    try {
        const {name} = req.body;

        if(!name){
            return res.status(400).json({
                success : false,
                message : "all fields are required"
            })
        }

        const categoryDetails = await Category.create({
            name : name,
        });
        return res.status(200).json({
            success : true,
            message : "category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
};

//show all category
export const getAllCategory = async (req,res) => {
    try {
        const allCategory = await Category.find({} , {name : true});
        return res.status(200).json({
            success : true,
            message: "all Category returned successfully",
            allCategory
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
};

// categoryPageDetails
export const categoryPageDetails = async (req,res) => {
    try {
        const {categoryId} = req.body;
        const categoryCourses = await Category.findOne(
                                            {
                                                _id : categoryId,

                                            
                                            })
                                            .populate({
                                                path : "course",
                                                select : "courseName courseDescription whatYouWillLearn price thumbnail"
                                            }
                                            ).exec();

        if(!categoryCourses){
            return res.status(404).json({
                sucess : false,
                message : "no courses for this category"
            });
        }

        //different category courses
        const differentCategory = await Category.find({
                                            _id : {$ne : categoryId},
                                        })
                                        .populate("course")
                                        .exec();

        return res.status(200).json({
            success  : true,
            data : {
                categoryCourses,
                differentCategory
            }
        });

        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess : false,
            message : "could not find courses for speciied category"
        });
    }
    
}