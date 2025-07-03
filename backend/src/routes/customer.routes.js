import {Router} from 'express'
import { registerCustomer , loginCustomer , fetch_all_items, place_orders, get_my_orders, get_all_profile_detail, fetch_all_searching} from '../controllers/customer.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/register").post(authorizeRole ,  registerCustomer);
router.route("/login").post(authorizeRole, loginCustomer)
router.route("/get_profile").post(verifyJWT, authorizeRole, get_all_profile_detail)
router.route("/get_all_items/").get(authorizeRole , fetch_all_items)
router.route("/place_orders").post(verifyJWT , authorizeRole , place_orders)
router.route("/get_my_orders").post(verifyJWT , authorizeRole , get_my_orders)
router.route("/get_all_searching/").get(authorizeRole , fetch_all_searching)

export default router;