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

const get_all_pending_requests = asyncHandler(async (req , res) => {
    const role = req.user.role;
    const email = req.user.email;

    const empQuery = `SELECT person_id FROM person WHERE email = $1`;
    const empResult = await pool.query(empQuery, [email]);

    if (empResult.rows.length === 0) {
        throw new ApiError(404, "Employee not found");
    }

    await pool.query('SET ROLE employees;')
    
    const requestQuery = `SELECT * FROM get_pending_requests($1)`;
    const requestResult = await pool.query(requestQuery, [empResult.rows[0].person_id]);

    await pool.query('RESET ROLE');

    return res
    .status(200)
    .json(
        new ApiResponse(200 , requestResult.rows , "Pending requests fetched Successfully")
    )
})

export {
    loginEmployee,
    logoutEmployee,
    get_all_pending_requests
}