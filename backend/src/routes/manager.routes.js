import {Router} from 'express'
import { loginManager, registerEmployee, registerManager } from '../controllers/manager.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route("/register_employee").post(verifyJWT , registerEmployee);
router.route("/register").post(registerManager)
router.route("/login").post(loginManager)


export default router;