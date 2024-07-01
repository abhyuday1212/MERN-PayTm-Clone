import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function userAuthMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        const tokenWords = token.split(" ");

        const jwtToken = tokenWords[1];
 
        const decodedValue = jwt.verify(jwtToken, jwtSecretKey)

        // if you want to include the type of the user then use
        /*
        if(decodedValue.username && decodedValue.type === 'user'){
        next()
        }
        */
        if (decodedValue.username) {
            //* This passes the username value in req object in subsequent requests
            req.userId = decodedValue.userId;
            req.username = decodedValue.username;
            req.randomData = "Mera Data Passed by middleware";
            next()
        }
        else {
            return res.status(403).json({ msg: "You are not authenticated" })
        }
    } catch (error) {
        return res.json({ msg: "Something went wrong with the userAuthentication" })
    }
}




export default userAuthMiddleware;