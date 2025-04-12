import {Router} from 'express'
import { get_all_pending_requests, loginEmployee, logoutEmployee } from '../controllers/employee.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/login").post(loginEmployee);
router.route("/logout").post(verifyJWT , logoutEmployee);
router.route("/get_all_pending_requests").get(verifyJWT , authorizeRole('employee') , get_all_pending_requests)

export default router;