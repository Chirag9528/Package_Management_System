import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req , _ , next) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" ,  "");
        // console.log(token)
        if (!token){
            throw new ApiError(401 , "Unauthorized request");
        }
        const decodedToken = jwt.verify(token , process.env.ACCESSTOKENSECRET);
        
        if (!decodedToken){
            throw new ApiError(401 , "Invalid Access Token");
        }

        const email = decodedToken.email
        const role = decodedToken.role
        const id = decodedToken.id
        console.log(req.body)
        if(req.body.role !== role){
            throw new ApiError(401 , "You have no access to this role");
        }
        
        req.user = {email , role , id};
        
        next();
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid access token")
    }
})