import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();
console.log(process.env.CORS_ORIGIN)
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true // will allow to send and receive cookies to cross origin
    }
))

// Security practices
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import customerRouter from './routes/customer.routes.js'
import employeeRouter from './routes/employee.routes.js'
import managerRouter from './routes/manager.routes.js'
import userRouter from './routes/common.routes.js'

// routes declaration
app.use("/api/c" , customerRouter)
app.use("/api/e" , employeeRouter)
app.use("/api/m" , managerRouter)
app.use("/api/u", userRouter)

export default app;