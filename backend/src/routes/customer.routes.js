import {Router} from 'express'
import { registerCustomer , loginCustomer , fetch_all_items, place_orders} from '../controllers/customer.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/register").post(authorizeRole ,  registerCustomer);
router.route("/login").post(authorizeRole , loginCustomer)
router.route("/get_all_items/").get(authorizeRole , fetch_all_items)
router.route("/place_orders").post(verifyJWT , authorizeRole , place_orders)

export default router;