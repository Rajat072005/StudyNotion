import mongoose from "mongoose";
const { Schema, model } = mongoose;

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

const Profile = model("Profile", ProfileSchema);
export default  Profile;