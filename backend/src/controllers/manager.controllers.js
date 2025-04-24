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

const get_all_stocks = asyncHandler( async(req, res) => {
        const managerId = req.query.managerId;
        if (!managerId) {
            throw new ApiError(400, "Manager ID is required in query params.");
        }

        // const r = await req.dbClient.query(
        //     `SELECT current_user;`
        // );   
        // console.log("current user ",r.rows[0])
        const result = await req.dbClient.query(
            `SELECT warehouse_id FROM manager WHERE person_id = $1`, [managerId]
        );        
          
        const w_id = result.rows[0]?.warehouse_id;
      
        if (!w_id) {
        throw new ApiError(404, "Manager is not associated with any warehouse");
        }
          
        const data = await req.dbClient.query(`
            SELECT * FROM warehouse AS w
            JOIN contain AS c ON c.w_house_id = w.warehouse_id
            JOIN item AS i ON i.item_id = c.item_id
            WHERE w.warehouse_id = $1
        `, [w_id]);
        

        return res
        .status(200)
        .json(
            new ApiResponse(200 , data.rows , "All stocks fetched Successfully")
        )
    }
)

const get_low_stocks = asyncHandler( async(req,res)=>{
    const managerId = req.query.managerId;
    if(!managerId){
        throw new ApiError(400, "Manager ID is required in query params.");
    }
    const data = await req.dbClient.query(`SELECT * FROM check_low_stock($1)`,[managerId])
   
    return res
        .status(200)
        .json(
            new ApiResponse(200 , data.rows , "All stocks fetched Successfully")
    )
})

const get_all_availble_stocks_warehouse = asyncHandler( async (req,res)=>{
    const managerId = req.query.managerId;
    const item_id = req.query.itemId;
   
    if(!managerId || !item_id){
        throw new ApiError(400, "Manager ID is required in query params.");
    }
    const result = await req.dbClient.query(
        `SELECT warehouse_id FROM manager WHERE person_id = $1;`, [managerId]
    );        
      
    const w_id = result.rows[0]?.warehouse_id;

    const data = await req.dbClient.query(
        `SELECT * FROM search_warehouse_with_available_stocks($1,$2);`,[item_id,w_id]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,data.rows,"All available warehouse for stock fetched")
        )

})

const place_request = asyncHandler( async(req,res)=>{
    const managerId = req.query.managerId;
    const item_id = req.query.itemId;
    const fromW_id = req.query.w_id;

    if(!managerId || !item_id || !fromW_id){
        throw new ApiError(400, "Manager ID is required in query params.");
    }

    await req.dbClient.query(
        `CALL create_pending_stock_request($1, $2, $3);`, [managerId,item_id,fromW_id]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,"All available warehouse for stock fetched")
        )

})

const get_all_stocks_pend_request = asyncHandler(async (req,res) =>{
    const managerId = req.query.managerId;

    if(!managerId ){
        throw new ApiError(400, "Manager ID is required in query params.");
    }

    const data = await req.dbClient.query(
        `SELECT * FROM get_pending_requests_by_manager($1);`,[managerId]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,data.rows,"All available warehouse for stock fetched")
        )

})

const get_all_stocks_pend_out_request = asyncHandler(async(req,res)=>{
    const managerId = req.query.managerId;

    if(!managerId ){
        throw new ApiError(400, "Manager ID is required in query params.");
    }
    const data = await req.dbClient.query(
        `SELECT * FROM get_pending_outrequests_by_manager($1);`,[managerId]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,data.rows,"All available warehouse for stock fetched")
        )
})

const add_check_list = asyncHandler(async(req,res)=>{
    const managerId = req.query.managerId;
    const item_id = req.query.itemId;

    if(!managerId ){
        throw new ApiError(400, "Manager ID is required in query params.");
    }
    const result = await req.dbClient.query(
        `SELECT warehouse_id FROM manager WHERE person_id = $1;`, [managerId]
    );        
      
    const w_id = result.rows[0]?.warehouse_id;

    const data = await req.dbClient.query(
        `UPDATE contain SET min_stock = curr_stock+1 WHERE item_id = $1 AND w_house_id = $2`,[item_id,w_id]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,data.rows,"Manager added the stock to min stock")
        )
})

const reject_order = asyncHandler(async(req,res)=>{
    const managerId = req.query.managerId;
    const fwid = req.query.fwid;
    const item_id = req.query.itemId;

    if(!managerId ){
        throw new ApiError(400, "Manager ID is required in query params.");
    }

    const data = await req.dbClient.query(
        `SELECT from_contain_id FROM pending_stock_request AS pd
        JOIN contain AS c 
        ON c.contain_id = pd.from_contain_id
        WHERE c.w_house_id = $1 AND pd.item_id = $2;`,[fwid,item_id]
    )

    const fcd = data.rows[0];
    if(!fcd){
        console.log("no from contain id found\n");
    }

    const result = await req.dbClient.query(
        `UPDATE pending_stock_request SET status = 'rejected' WHERE item_id = $1 AND from_contain_id = $2`,[item_id,fcd?.from_contain_id]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,result.rows,"Manager rejected stock to min stock")
        )
})

const get_all_profile_detail = asyncHandler(async(req,res)=>{
    const managerId = req.query.id;
    
    if(!managerId ){
        throw new ApiError(400, "Manager ID is required in query params.");
    }

    const data = await req.dbClient.query(
        `SELECT * FROM person AS p
            JOIN manager AS m ON m.person_id = p.person_id
            WHERE p.person_id = $1;`,[managerId]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200,data.rows,"all profile")
        )
})


const get_available_transports = asyncHandler(async (req , res)=>{
    const {w_house_id} = req.body

    const manager_id = req.user.id

    const transport_option = `SELECT * from search_available_transport($1 , $2);`;
    const result = await req.dbClient.query(transport_option , [manager_id , w_house_id]);

    return res
        .status(200)
        .json(
            new ApiResponse(200 , result.rows , "Transport options fetched successfully")
        )
})


const transport_item_to_destination_warehouse = asyncHandler(async (req , res) => {
    const {transport_id , item_qty , item_id , dest_warehouse_id} = req.body;
    const manager_id = req.user.id;

    const transport_item = `select * from transport_item_to_destination_warehouse($1,$2,$3,$4,$5);`
    const result = await req.dbClient.query(transport_item , 
        [transport_id , item_qty , item_id , manager_id , dest_warehouse_id])
    
    if (!result){
        throw new ApiError(500 , "Internal Server Error");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200 , result.rows[0] , "Item Shipped Successfully to other warehouse")
        )
})

export {
    registerManager,
    loginManager,
    registerEmployee,
    get_all_stocks,
    get_low_stocks,
    get_all_availble_stocks_warehouse,
    place_request,
    get_all_stocks_pend_request,
    get_all_stocks_pend_out_request,
    add_check_list,
    reject_order,
    get_all_profile_detail,
    get_available_transports,
    transport_item_to_destination_warehouse
}