const {
  Schema,
  model,
  default: mongoose
} = require("mongoose");

const ProfileSchema = new Schema({
    Gender : {
        type : String ,
    },
    DateOfBirth : {
        type : String ,
    },
    About : {
        type : String ,
        trim : true
    },
    MobileNumber : {
        type : Number ,
        trim : true
    },
    
});

const ProfileModel = model("Profile", ProfileSchema);

module.exports = ProfileModel