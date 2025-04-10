import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiError} from './../utils/ApiError.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import {pool} from './../db/index.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerCustomer = asyncHandler(async (req , res) => {
    const {first_name , last_name , phone_no , email , city , state , pincode , password} = req.body
    if (
        [first_name , last_name , email , city , state , password].some((field)=> !field || field.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    if (!phone_no || !pincode){
        throw new ApiError(400 , "All fields are required");
    }

    const client = await pool.connect(); // get dedicated client
    try {
        await client.query('BEGIN');

        // Check if customer already exists
        const checkQuery = 'SELECT * FROM customer WHERE email = $1 OR phone_no = $2';
        const checkResult = await client.query(checkQuery, [email, phone_no]);

        if (checkResult.rows.length > 0) {
            throw new ApiError(409, "Customer already exists with this email or phone number.");
        }

        // Set role to customers
        await client.query(`SET ROLE customers;`);

        // Insert into customer table
        const insertCustomerQuery = `
            INSERT INTO customer (first_name, last_name, phone_no, email, city, state, pincode)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        await client.query(insertCustomerQuery, [
            first_name, last_name, phone_no, email, city, state, pincode
        ]);

        await client.query(`RESET ROLE;`); // setting role to app_admin again
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const customerResult = await client.query(`select * from customer where email = $1` , [email]);
        
        const insertUserQuery = `
            INSERT INTO users (email, password, role)
            VALUES ($1, $2, $3) RETURNING email , role;
        `;
        const userResult = await client.query(insertUserQuery, [
            email, hashedPassword, 'customer'
        ]);

        await client.query('COMMIT');

        return res.status(201).json(new ApiResponse(201, {
            customer: customerResult.rows[0],
            user: userResult.rows[0]
        }, "Customer registered successfully!"));
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
})


const loginCustomer = asyncHandler(async (req , res) => {
    const {email , password} = req.body

    if (!email || !password){
        throw new ApiError(400 , "Email and Password is required");
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rowCount === 0) {
        throw new ApiError(401, "Email Id does not exists")
    }

    const user = result.rows[0]
    if (!(user.role === "customer")){
        throw new ApiError(401 , "You are not a customer");
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


const logoutCustomer = asyncHandler(async (req , res) => {
    const options = {
        httpOnly : true,
        secure : true
    }

    if (!(req.user.role === "customer")){
        throw new ApiError(401 , "Invalid AccessToken")
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .json(new ApiResponse(200 , {} , "User Logged Out"))
})


const fetch_all_items = asyncHandler(async (req , res) => {
    await pool.query('SET ROLE TO customers');
    const result = await pool.query('select * from item;')
    await pool.query('RESET ROLE;')
    return res
    .status(200)
    .json (
            new ApiResponse (
                200 , 
                result.rows,
                "All items fetched successfully"
            )
        )
})

export {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    fetch_all_items
}