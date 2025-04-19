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

    let customerResult , userResult;

    try {
        await req.dbClient.query('BEGIN');

        const checkQuery = 'SELECT * FROM customer WHERE email = $1 OR phone_no = $2';
        const checkResult = await req.dbClient.query(checkQuery, [email, phone_no]);

        if (checkResult.rows.length > 0) {
            throw new ApiError(409, "Customer already exists with this email or phone number.");
        }

        const insertCustomerQuery = `
            INSERT INTO customer (first_name, last_name, phone_no, email, city, state, pincode)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;

        customerResult = await req.dbClient.query(insertCustomerQuery, [
            first_name, last_name, phone_no, email, city, state, pincode ]);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertUserQuery = `
            INSERT INTO users (email, password, role , user_id)
            VALUES ($1, $2, $3 , $4) RETURNING email , role , user_id;
        `;
        
        userResult = await req.dbClient.query(insertUserQuery, [
            email, hashedPassword, 'customer' , customerResult.rows[0].customer_id
        ]);

        await req.dbClient.query('COMMIT');
    } catch (error) {
        await req.dbClient.query('ROLLBACK');
        throw error;
    }

    return res.status(201).json(new ApiResponse(201, {
        customer: customerResult.rows[0],
        user: userResult.rows[0]
    }, "Customer registered successfully!"));
})


const loginCustomer = asyncHandler(async (req , res) => {
    const {email , password} = req.body
    if (!email || !password){
        throw new ApiError(400 , "Email and Password is required");
    }
    let user , custInfo;

    try {
        await req.dbClient.query('BEGIN');
        const result = await req.dbClient.query('SELECT * FROM users WHERE email = $1', [email])
    
        if (result.rowCount === 0) {
            throw new ApiError(401, "Email Id does not exists")
        }
    
        user = result.rows[0]

        if (!(user.role === "customer")){
            throw new ApiError(401 , "You are not a customer");
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials")
        }

        custInfo = await req.dbClient.query('Select * from customer where email = $1' , [email]);
        
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
                custInfo : custInfo.rows[0]
            },
            "User logged In Successfully"
        )
    )
})


const fetch_all_items = asyncHandler(async (req , res) => {

    const result = await req.dbClient.query(`
        SELECT item_id , i.name as name, price , i.description , ci.name as category
        FROM item i JOIN category_item ci 
        ON i.category_id = ci.category_id;`)
        
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

const place_orders = asyncHandler(async (req, res) => {
    const {itemId, itemQnty } = req.body;
    const email = req.user.email
    const customerId = req.user.id
    console.log(customerId)

    if (!itemId || !itemQnty || !email) {
        throw new ApiError(400, "Item Id and Item Quantity is required");
    }

    try {
        await req.dbClient.query('BEGIN');
    
        const orderResult = await req.dbClient.query(
            `INSERT INTO orders (customer_id, item_id, status,ordered_qty)
             VALUES ($1, $2, 'pending',  $3);`,
            [customerId, itemId, itemQnty]
        );
        await req.dbClient.query('COMMIT;');
    } catch (error) {
        await req.dbClient.query('ROLLBACK');
        throw error;
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                "Order placed successfully!"
            )
        )
});


const get_my_orders = asyncHandler(async (req , res) => {
    const ordersResult = await req.dbClient.query(`SELECT * FROM get_my_orders(${req.user.id})`)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            ordersResult.rows,
            "My orders fetched successfully"
        )
    ) 
})

export {
    registerCustomer,
    loginCustomer,
    fetch_all_items,
    place_orders,
    get_my_orders
}