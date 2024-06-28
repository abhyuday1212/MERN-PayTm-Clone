import { Router } from "express";
// import userMiddleware from "../middleware/user.js"
import jwt from "jsonwebtoken";
import { Users } from "../database/db.js";
import {signupSchema} from "../Types.js"
import dotenv from "dotenv"



const router = Router();
dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY

router.post('/signup', async (req, res) => {

    try {
        const { success } = signupSchema.safeParse(req.body);

        if (!success) {
            return res.json({ msg: "The Entered type of the Data is incorrect" })
        }

        const checkUserExistance = await Users.findOne({ username: req.body.username })

        if (checkUserExistance) {
            return res.status(403).json({
                msg: "User User Already Existed"
            })
        }

        const dbUser = await Users.create(req.body);
        
        const token = jwt.sign({ userId: dbUser._id }, jwtSecret)





        return res.status(200).json({
            message: "User Signup successful",
            token: token
        })

    } catch (error) {
        console.log(error);
        return res.status(200).json({ msg: "User Signup unsuccessful" })

    }

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    // check if this user exists in the database

    try {
        const checkUserExistance = await Users.findOne({ username: username, password: password })

        if (!checkUserExistance) {
            console.log("You are not authorized, input a correct username and password");
            return res.status(403).json({
                msg: "You are not authorized, input a correct username and password"
            })
        }

        if (checkUserExistance) {
            const token = jwt.sign({ username }, jwtSecretKey)

            return res.json({ token })
        }

    }
    catch (error) {
        return res.json({ msg: "Error while sign in, please try again later" })
    }


});



export default router