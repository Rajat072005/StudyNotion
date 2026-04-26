import User from "../models/User.js"
import Profile from "../models/Profile.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";


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

//update profile picture
export const updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const file = req.files.image; // ✅ express-fileupload

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // upload to cloudinary
    const uploadedImage = await uploadImageToCloudinary(
      file,
      "profile_pictures"
    );

    // save URL in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadedImage.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const getUserDetails = async (req,res) => {
    try {
        const UserId = req.user.id;
        const userDetails = await User.findById(UserId).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(404).json({
                sucess : false,
                message : "user not found"
            })
        }
        return res.status(200).json({
            sucess : true,
            message : "user fetched successfully",
            userDetails
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : "could not fetch user details"
        })
    }
}