import {Router} from 'express'
import { logoutUser, verifyAccessToken } from '../controllers/common.controllers.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router  = Router()

router.route('/logout').post(verifyJWT , logoutUser);
router.route('/verify-accessToken').post(verifyJWT , verifyAccessToken)

export default router;