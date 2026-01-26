const {
  Schema,
  model,
  default: mongoose,
  Types
} = require("mongoose");

const CategorySchema = new Schema({
    name : {
        type : String
    },
    // description : {
    //     type : String
    // },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }

});

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel