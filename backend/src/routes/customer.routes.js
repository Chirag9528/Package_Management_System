import {Router} from 'express'
import { registerCustomer , loginCustomer , fetch_all_items, logoutCustomer, place_orders} from '../controllers/customer.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer)
router.route("/logout").post(verifyJWT , logoutCustomer)
router.route("/get_all_items/").get(fetch_all_items)
router.route("/place_orders").post(place_orders)

export default router;