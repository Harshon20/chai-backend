import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespose.js";



const registerUser = asyncHandler( async (req, res) => {
    //get user details from frontend
    //validation - everything is not empty
    //check if user already exists: username or email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

     const {fullName, email, username, password}=req.body
     console.log("email:", email);

     if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
     ){
        throw new ApiError(400, "All fields are required");

     }

     const existUser = User.findOne({
        $or: [{email},{username}]
     })

     if(existUser){
        throw new ApiError(409, "User already exists with this email or username");
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError (400, "Avatar file is required");
    }
     
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse( 201,createdUser, "User registered successfully")
    )
   
})

export {registerUser};