import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiResponse} from './../utils/ApiResponse.js'

const logoutUser = asyncHandler(async (req , res) => {
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .json(new ApiResponse(200 , {} , "User Logged Out"))
})

const verifyAccessToken = asyncHandler(async (req , res) => {
    return res
    .status(200)
    .json(new ApiResponse(200 , {email: req.user.email} , "User is Valid"))
})

export {
    logoutUser,
    verifyAccessToken
}