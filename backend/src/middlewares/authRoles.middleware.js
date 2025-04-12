import { ApiError } from "../utils/ApiError.js";

export function authorizeRole(role){
    return (req , res , next) => {
        if (req.user.role !== role){
            return res
                .status(403)
                .json(
                    new ApiError(403 , "Access Denied")
                )
        }
        next();
    }
}