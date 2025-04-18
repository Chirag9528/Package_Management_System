import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pool } from "../db/index.js";

export const authorizeRole = asyncHandler(async (req, _ , next) => {
    const client = await pool.connect();
    req.dbClient = client;
    try {
        if (req.user){
            switch (req.user.role){
                case "manager":
                    await client.query('SET ROLE managers;');
                    break;
                case "employee":
                    await client.query('SET ROLE employees;');
                    break;
                case "customer":
                    await client.query('SET ROLE customers;');
                    break; 
                default:
                    break;
            }
        }
        await next();
    } finally {
        await client.query('RESET ROLE;');
        client.release();
    }
  });
