import {Router} from 'express'
import { loginManager, registerEmployee, registerManager, get_all_stocks, get_low_stocks, get_all_availble_stocks_warehouse } from '../controllers/manager.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/register_employee").post(verifyJWT , authorizeRole , registerEmployee);
router.route("/register").post(authorizeRole , registerManager)
router.route("/login").post(authorizeRole , loginManager)
router.route("/get_all_stocks").get(verifyJWT, authorizeRole, get_all_stocks)
router.route("/get_low_stocks").get(verifyJWT, authorizeRole, get_low_stocks)
router.route("/get_all_available_searchStocks").get(verifyJWT, authorizeRole, get_all_availble_stocks_warehouse)

export default router;