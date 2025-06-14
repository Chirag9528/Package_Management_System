import {Router} from 'express'
import { loginManager, registerEmployee, registerManager, get_all_stocks, get_low_stocks, get_all_availble_stocks_warehouse, place_request , get_all_stocks_pend_request, get_all_stocks_pend_out_request, add_check_list, reject_order, get_all_profile_detail, get_available_transports, transport_item_to_destination_warehouse} from '../controllers/manager.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authRoles.middleware.js';

const router  = Router()

router.route("/register_employee").post(verifyJWT , authorizeRole , registerEmployee);
router.route("/register").post(authorizeRole , registerManager)
router.route("/login").post(authorizeRole , loginManager)
router.route("/get_profile").get(authorizeRole,verifyJWT, get_all_profile_detail)
router.route("/get_all_stocks").get(verifyJWT, authorizeRole, get_all_stocks)      
router.route("/get_low_stocks").get(verifyJWT, authorizeRole, get_low_stocks)
router.route("/get_all_available_searchStocks").get(verifyJWT, authorizeRole, get_all_availble_stocks_warehouse)
router.route("/place_stock_request").get(verifyJWT,authorizeRole,place_request)
router.route("/get_pending_stock_requests").get(verifyJWT,authorizeRole,get_all_stocks_pend_request)
router.route("/get_pending_stock_outrequests").get(verifyJWT,authorizeRole, get_all_stocks_pend_out_request)
router.route("/add_item_to_minStocks").get(verifyJWT,authorizeRole, add_check_list)
router.route("/reject_order_request").get(verifyJWT,authorizeRole, reject_order)
router.route("/get_available_transport").post(verifyJWT , authorizeRole , get_available_transports)
router.route("/transport_item_to_destination_warehouse").post(verifyJWT , authorizeRole , transport_item_to_destination_warehouse)

export default router;