import register from '../../controller/AUTH/auth.js';
import login from '../../controller/AUTH/login.js';
//const {logout} = require('../../controller/AUTH/auth');
import {verifyToken , protectedRoute} from '../../middlewares/refresh.js';
import express from 'express';

const router = express.Router();

router.post('/signup' , register , login)
router.post('/signin' , login)
//router.post('/signout' , register)
router.get('/refresh' , verifyToken, protectedRoute) 

export default router;