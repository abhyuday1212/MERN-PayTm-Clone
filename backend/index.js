import express from "express";
import dotenv from "dotenv" 
import mainRouterV1 from "./routes/mainRouter.js"
import cors from "cors"


const app = express();
dotenv.config();


const PORT = process.env.PORT

app.use(express.json);
app.use(express.urlencoded);
app.use(cors())

app.use("/api/v1", mainRouterV1);
 
app.listen(PORT, () => {
    console.log("App is listening on the Port ", PORT);
})