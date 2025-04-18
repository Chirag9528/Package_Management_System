import {asyncHandler} from './../utils/asyncHandler.js'
import {ApiError} from './../utils/ApiError.js'
import {ApiResponse} from './../utils/ApiResponse.js'
import {pool} from './../db/index.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerManager = asyncHandler(async (req , res) => {
    const {first_name , last_name , phone_no , email , city , state , pincode , password , experience , warehouse_id} = req.body
    if (
        [first_name , last_name , email , city , state , password].some((field)=> !field || field.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    if (!phone_no || !pincode || !experience || !warehouse_id){
        throw new ApiError(400 , "All fields are required");
    }

    let personResult , managerResult , userResult;

    try {
        await req.dbClient.query('BEGIN');

        const checkQuery = 'SELECT * FROM person WHERE email = $1 OR phone_no = $2';
        const checkResult = await req.dbClient.query(checkQuery, [email, phone_no]);

        if (checkResult.rows.length > 0) {
            throw new ApiError(409, "Manager already exists with this email or phone number.");
        }

        const insertPersonQuery = `
            INSERT INTO person (first_name, last_name, phone_no, email, city, state, pincode)
            VALUES ($1, $2, $3, $4, $5, $6, $7) returning *;
        `;

        personResult = await req.dbClient.query(insertPersonQuery, [
            first_name, last_name, phone_no, email, city, state, pincode
        ]);

        const insertManagerQuery = `
            INSERT INTO manager (person_id , experience , warehouse_id)
            VALUES ($1 , $2 , $3) returning *;  
        `;

        managerResult = await req.dbClient.query(insertManagerQuery , [
            personResult.rows[0].person_id , experience , warehouse_id
        ]);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertUserQuery = `
            INSERT INTO users (email, password, role , user_id)
            VALUES ($1, $2, $3 , $4) RETURNING email , role , user_id;
        `;

        userResult = await req.dbClient.query(insertUserQuery, [
            email, hashedPassword, 'manager' , personResult.rows[0].person_id
        ]);

        await req.dbClient.query('COMMIT');

        return res.status(201).json(new ApiResponse(201, {
            person: personResult.rows[0],
            employee : managerResult.rows[0],
            user: userResult.rows[0]
        }, "Manager registered successfully!"));
    } catch (error) {
        await req.dbClient.query('ROLLBACK');
        throw error;
    } 
})


const loginManager = asyncHandler(async (req , res) => {
    const {email , password} = req.body
    if (!email || !password){
        throw new ApiError(400 , "Email and Password is required");
    }
    let user , managerInfo;

    try {
        await req.dbClient.query('BEGIN');
        const result = await req.dbClient.query('SELECT * FROM users WHERE email = $1', [email])
    
        if (result.rowCount === 0) {
            throw new ApiError(401, "Email Id does not exists")
        }
    
        user = result.rows[0]

        if (!(user.role === "manager")){
            throw new ApiError(401 , "You are not a manager");
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials")
        }

        managerInfo = await req.dbClient.query('Select * from person where email = $1' , [email]);

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
                token,
                managerInfo : managerInfo.rows[0]
            },
            "User logged In Successfully"
        )
    )
})


const registerEmployee = asyncHandler(async (req , res) => {
    const {first_name , last_name , phone_no , email , city , state , pincode , password , shift_schedule , warehouse_id} = req.body
    if (
        [first_name , last_name , email , city , state , password].some((field)=> !field || field.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    if (!phone_no || !pincode || !shift_schedule || !warehouse_id){
        throw new ApiError(400 , "All fields are required");
    }

    let personResult , employeeResult , userResult;
    try {
        await req.dbClient.query('BEGIN');

        const checkQuery = 'SELECT * FROM person WHERE email = $1 OR phone_no = $2';
        const checkResult = await req.dbClient.query(checkQuery, [email, phone_no]);

        if (checkResult.rows.length > 0) {
            throw new ApiError(409, "Employee already exists with this email or phone number.");
        }

        const insertPersonQuery = `
            INSERT INTO person (first_name, last_name, phone_no, email, city, state, pincode)
            VALUES ($1, $2, $3, $4, $5, $6, $7) returning *;
        `;
        personResult = await req.dbClient.query(insertPersonQuery, [
            first_name, last_name, phone_no, email, city, state, pincode
        ]);

        const insertEmployeeQuery = `
            INSERT INTO employee (person_id , shift_schedule , warehouse_id)
            VALUES ($1 , $2 , $3) returning *;  
        `;

        employeeResult = await req.dbClient.query(insertEmployeeQuery , [
            personResult.rows[0].person_id , shift_schedule , warehouse_id
        ]);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertUserQuery = `
            INSERT INTO users (email, password, role , user_id)
            VALUES ($1, $2, $3 , $4) RETURNING email , role , user_id;
        `;
        const userResult = await req.dbClient.query(insertUserQuery, [
            email, hashedPassword, 'employee' , personResult.person_id
        ]);

        await req.dbClient.query('COMMIT');

        return res.status(201).json(new ApiResponse(201, {
            person: personResult.rows[0],
            employee : employeeResult.rows[0],
            user: userResult.rows[0]
        }, "Employee registered successfully!"));
    } catch (error) {
        await req.dbClient.query('ROLLBACK');
        throw error;
    }
})

export {
    registerManager,
    loginManager,
    registerEmployee
}