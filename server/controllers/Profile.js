import User from "../models/User"
import Profile from "../models/Profile"


//Update profile
export const UpdateProfile = async (req,res) => {
    try {
        const {Gender , DateOfBirth , About , MobileNumber} = req.body;
        const UserId = req.user.id;

        if(!Gender || !DateOfBirth || !About || !MobileNumber || !UserId){
            return res.status(422).json({
                success : false,
                message : "required fields"
            })
        }
        const userDetails = await User.findById(UserId);
        const ProfileId = userDetails.additionalDetails;

        const UpdatedProfileDetails = await Profile.findByIdAndUpdate(ProfileId , 
            {
                Gender,
                DateOfBirth,
                About,
                MobileNumber
            },
            {new : true}
        )
        return res.status(200).json({
            success : true,
            message : "profile updated successfully",
            UpdatedProfileDetails
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

//delete Account
export const deleteAccount = async (req,res) => {
    try {
        const UserId = req.user.id;
        const userDetails = await User.findById(UserId);
        if(!userDetails){
            return res.status(400).json({
                success : false,
                message : "user not found"
            });
        }
        await Profile.findByIdAndDelete(userDetails.additionalDetails);
        await User.findByIdAndDelete(UserId);

        return res.status(200).json({
            success : true,
            message : "user removed successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        });
    }
}