import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SectionSchema = new Schema({
    sectionName : {
        type : String,
        required : true
    },
    subSection : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "SubSection"
        }
    ]
});

const Section = model("Section", SectionSchema);

export default Section;