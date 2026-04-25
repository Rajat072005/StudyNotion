import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
    name : {
        type : String,
        required : true,

    },
    description : {
        type : String
    },
    course : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Course"
        }
    ]

});

const Category = model("Category", CategorySchema);

export default  Category