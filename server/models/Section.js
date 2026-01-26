const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");

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

const SectionModel = model("Section", SectionSchema);

module.exports = SectionModel