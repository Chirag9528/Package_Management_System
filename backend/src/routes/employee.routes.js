import {Router} from 'express'
import { loginEmployee, logoutEmployee } from '../controllers/employee.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route("/login").post(loginEmployee);
router.route("/logout").post(verifyJWT , logoutEmployee);

export default router;