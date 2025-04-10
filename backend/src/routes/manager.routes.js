import {Router} from 'express'
import { loginManager, logoutManager, registerEmployee, registerManager } from '../controllers/manager.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route("/register_employee").post(verifyJWT , registerEmployee);
router.route("/register").post(registerManager)
router.route("/login").post(loginManager)
router.route("/logout").post(verifyJWT , logoutManager)


export default router;