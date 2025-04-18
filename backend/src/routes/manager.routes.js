import {Router} from 'express'
import { loginManager, registerEmployee, registerManager } from '../controllers/manager.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/register_employee").post(verifyJWT , authorizeRole , registerEmployee);
router.route("/register").post(authorizeRole , registerManager)
router.route("/login").post(authorizeRole , loginManager)


export default router;