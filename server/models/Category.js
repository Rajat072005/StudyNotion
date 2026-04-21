const {
  Schema,
  model,
  default: mongoose,
  Types
} = require("mongoose");

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

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel