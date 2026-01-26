const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");

const SubSectionSchema = new Schema({
    title : {
        type : String
    },
    timeDuration : {
        type : String
    },
    description : {
        type : String
    },
    videoUrl : {
        type : String
    }
});

const SubSectionModel = model("SubSection", SubSectionSchema);

module.exports = SubSectionModel