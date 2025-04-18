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
    let user , employeeInfo;

    try {
        await req.dbClient.query('BEGIN');
        const result = await req.dbClient.query('SELECT * FROM users WHERE email = $1', [email])
    
        if (result.rowCount === 0) {
            throw new ApiError(401, "Email Id does not exists")
        }
    
        user = result.rows[0]

        if (!(user.role === "employee")){
            throw new ApiError(401 , "You are not a employee");
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials")
        }

        employeeInfo = await req.dbClient.query('Select * from person where email = $1' , [email]);

        await req.dbClient.query('COMMIT;');
    } catch (error) {
        await req.dbClient.query('ROLLBACK');
        throw error;
    }

    const token = jwt.sign(
        {
            email: user.email,
            role: user.role,
            id : user.user_id
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
                token ,
                employeeInfo : employeeInfo.rows[0]
            },
            "User logged In Successfully"
        )
    )
})

const get_all_pending_requests = asyncHandler(async (req , res) => {
    const employeeId = req.user.id;

    const requestQuery = `SELECT * FROM get_pending_requests($1)`;
    const requestResult = await req.dbClient.query(requestQuery, [employeeId]);

    return res
    .status(200)
    .json(
        new ApiResponse(200 , requestResult.rows , "Pending requests fetched Successfully")
    )
})

const get_order_details = asyncHandler(async (req , res) => {
    const orderId = req.params.orderId;
    if (!orderId){
        throw new ApiError(400 , "Order Id is required");
    }

    let orderdetail = await req.dbClient.query(`SELECT * FROM get_order_details(${orderId});`);

    return res.
    status(200)
    .json(
        new ApiResponse(200 , orderdetail.rows[0] , "Order Details Fetched Successfully")
    )
})


export {
    loginEmployee,
    get_all_pending_requests,
    get_order_details
}