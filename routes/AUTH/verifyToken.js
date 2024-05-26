import { protectedRoute , verifyToken } from "../../middlewares/refresh";
import express from "express";

const router = express.Router()

router.get('/protected', verifyToken, protectedRoute)

export default router