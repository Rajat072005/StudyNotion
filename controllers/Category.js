const Category = require("../models/Category");

//create category
exports.createCategory = async (req,res) => {
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
exports.getAllCategory = async (req,res) => {
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