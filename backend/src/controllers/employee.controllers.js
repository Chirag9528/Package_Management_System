import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiError} from './../utils/ApiError.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import {pool} from './../db/index.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const loginEmployee = asyncHandler(async (req , res) => {
    const {email , password} = req.body

    if (!email || !password){
        throw new ApiError(400 , "Email and Password is required");
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rowCount === 0) {
        throw new ApiError(401, "Email Id does not exists")
    }

    const user = result.rows[0]
    if (!(user.role === "employee")){
        throw new ApiError(401 , "You are not an employee");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const token = jwt.sign(
        {
            email: user.email,
            role: user.role
        },
        process.env.ACCESSTOKENSECRET,
        {
            expiresIn : process.env.ACCESSTOKENEXPIRY
        }
    )
    
    const options = { // backend can edit cookie only
        httpOnly: true,
        secure: true,
        sameSite: "None"      // required for cross origin cookies
    }

    return res
    .status(200)
    .cookie("accessToken" , token , options)
    .json(
        new ApiResponse(
            200,
            {
                token
            },
            "User logged In Successfully"
        )
    )
})

const logoutEmployee = asyncHandler(async (req , res) => {
    const options = {
        httpOnly : true,
        secure : true
    }

    if (!(req.user.role === "employee")){
        throw new ApiError(401 , "Invalid AccessToken")
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .json(new ApiResponse(200 , {} , "User Logged Out"))
})

export {
    loginEmployee,
    logoutEmployee
}