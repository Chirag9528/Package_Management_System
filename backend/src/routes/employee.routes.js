import {Router} from 'express'
import { get_all_pending_requests, get_available_transport, get_order_details, loginEmployee, process_order } from '../controllers/employee.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/login").post(authorizeRole , loginEmployee);
router.route("/get_all_pending_requests").get(verifyJWT , authorizeRole , get_all_pending_requests)
router.route("/get_order_details/:orderId").get(verifyJWT , authorizeRole , get_order_details)
router.route("/get_available_transport").post(verifyJWT , authorizeRole , get_available_transport)
router.route("/process_order").post(verifyJWT , authorizeRole , process_order)

export default router;