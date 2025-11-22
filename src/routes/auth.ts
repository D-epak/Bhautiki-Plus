import express from "express"
import controllers from "../controllers"

const router=express.Router()

router.post('/signup' , controllers.Auth.signup)
router.post('/verify' , controllers.Auth.verify)
router.post('/resendOtp' , controllers.Auth.resendOtp)
router.post('/login' ,controllers.Auth.login)

export default router