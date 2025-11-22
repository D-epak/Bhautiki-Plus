import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dbservices from "../services/dbservices";
import { hashPassword, generateOtp, comparePassword } from "../utils/common";
// import { sendEmail } from "../utils/template";
import { generateAuthTokens } from "../config/jwt";

export default class Auth {

    static signup = async (req: Request, res: Response) => {
        try {
            const { email, name, password } = req.body;
            const existing = await dbservices.Auth.getUserByEmail(email)
            //console.log(existing, "...............")
            if (existing.length > 0) {
                throw new Error("User already exists");
            }
            const hashedPassword = await hashPassword(password);
            //console.log(hashedPassword, "/////////")
            const newUser = await dbservices.Auth.createUser({
                name,
                email,
                password: hashedPassword,
            });
            const otp = generateOtp();  // e.g., "325912"
            const token = jwt.sign({ email }, otp, { expiresIn: "5m" });
            // await sendEmail(email, otp)
            res.status(200).json({ status: true, message: "Signup us succcessfully", token: token ,otp:otp });
        } catch (error) {
            //console.log(error.message)
            res.status(500).json({ status: false, message: error.message || "Internal server Error" })
        }
    }


    static resendOtp = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: "Email is required"
                });
            }

            // check if user exists
            const existing = await dbservices.Auth.getUserByEmail(email);

            if (existing.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            if (existing[0].isVerified) {
                return res.status(400).json({
                    status: false,
                    message: "User already verified "
                });
            }

            // generate new OTP
            const otp = generateOtp();

            // create NEW token with OTP as secret
            const token = jwt.sign({ email }, otp, { expiresIn: "5m" });

            // send new OTP email
            // await sendEmail(email, otp);

            return res.status(200).json({
                status: true,
                message: "OTP resent successfully",
                token,
                otp
            });

        } catch (error: any) {
            //console.log(error.message);
            return res.status(500).json({
                status: false,
                message: error.message || "Internal server error"
            });
        }
    };


    static verify = async (req: Request, res: Response) => {
        try {
            const { token, otp } = req.body;

            if (!token || !otp) {
                return res.status(400).json({
                    status: false,
                    message: "Token and OTP are required"
                });
            }

            // 1️⃣ Verify token using OTP as secret
            let decoded: any;
            try {
                decoded = jwt.verify(token, otp);
            } catch (err) {
                return res.status(400).json({ status: false, message: "Invalid OTP or token expired" });
            }

            const email = decoded.email;

            // 2️⃣ Update user isVerified = true
            const updated = await dbservices.Auth.verifyUser(email);

            if (!updated) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            const accesToken = await generateAuthTokens({ userId: updated.id, email: email, role: updated?.role })
            //console.log(accesToken)

            return res.status(200).json({
                status: true,
                message: "OTP Verified Successfully",
                user: updated,
                token: accesToken
            });

        } catch (error: any) {
            //console.log(error.message);
            return res.status(500).json({
                status: false,
                message: error.message || "Internal server error"
            });
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: "Email and password are required"
                });
            }

            // 1️⃣ Check if user exists
            const user = await dbservices.Auth.getUserByEmail(email);

            if (user.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            const userData = user[0];

            // 2️⃣ Check if user is verified
            if (!userData.isVerified) {
                return res.status(400).json({
                    status: false,
                    message: "Email not verified. Please verify OTP."
                });
            }

            // 3️⃣ Verify password
            const isMatch = await comparePassword(password, userData.password);

            if (!isMatch) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid credentials"
                });
            }

            // 4️⃣ Create JWT login token
            const accesToken = await generateAuthTokens({ userId: userData.id, email: email, role: userData?.role })


            return res.status(200).json({
                status: true,
                message: "Login successful",
                user: userData,
                token: accesToken,

            });

        } catch (error: any) {
            //console.log("LOGIN ERROR:", error.message);
            return res.status(500).json({
                status: false,
                message: error.message || "Internal server error"
            });
        }
    };



}