import { Router } from "express";
import jwt from "jsonwebtoken";
import { Account, Users } from "../database/db.js";
import { signupSchema, updateUser } from "../Types.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
// ---------------------------
import userAuthMiddleware from "../middleware/user.js"



const router = Router();
dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY


router.post('/signup', async (req, res) => {
    try {
        const { success, error } = signupSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({ msg: "The Entered type of the Data is incorrect", error });
        }

        const checkUserExistance = await Users.findOne({ username: req.body.username });

        if (checkUserExistance) {
            return res.status(403).json({ msg: "User Already Existed" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const dbUser = await Users.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const token = jwt.sign({
            userId: dbUser._id,
            username: dbUser.username
        }, jwtSecret);


        await Account.create({
            userId: dbUser._id,
            balance: 1 + Math.random() * 1000
        });

        return res.status(201).json({ message: "User Signup successful", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "User Signup unsuccessful" });
    }
});


router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const { username, password } = req.body;

    try {
        const checkUserExistance = await Users.findOne({ username: req.body.username })

        if (!checkUserExistance) {
            console.log("You are not authorized, input a correct username and password");
            return res.status(403).json({
                msg: "You are not authorized, input a correct username and password"
            })
        }


        const isPasswordValid = await bcrypt.compare(password, checkUserExistance.password);

        if (!isPasswordValid) {
            return res.status(403).json({ msg: "You are not authorized, input a correct username and password" });
        }

        if (checkUserExistance) {
            const token = jwt.sign({
                userId: checkUserExistance._id,
                username: username
            }, jwtSecret);

            return res.json({ token })
        }

    }
    catch (error) {
        return res.json({ msg: "Error while sign in, please try again later" })
    }


});

// ------------------ updating the user input

router.put("/update", userAuthMiddleware, async (req, res) => {
    const { success } = updateUser.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    try {
        await Users.updateOne({ _id: req.userId }, req.body);
    } catch (error) {
        console.log(error);
        return res.json({ error })
    }

    return res.status(200).json({
        msg: "Updated successfully"
    })


})
// ----------
// Route to get users from the backend, filterable via firstName/lastName

router.get("/bulk", userAuthMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await Users.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    return res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.get("/allusers", userAuthMiddleware, async (req, res) => {
    try {
        const allUsers = await Users.find({}, 'username');

        const allUsernamesWithIndices = allUsers.map((user, index) => ({
            index: index + 1,
            username: user.username
        }));

        return res.json(allUsernamesWithIndices);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
})

export default router