import {Router} from 'express'
import { registerCustomer , loginCustomer , fetch_all_items, logoutCustomer} from '../controllers/customer.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer)
router.route("/logout").post(verifyJWT , logoutCustomer)
router.route("/get_all_items/").get(fetch_all_items)

export default router;