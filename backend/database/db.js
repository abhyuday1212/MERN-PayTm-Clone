import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const DB_URI = process.env.DB_URI

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(DB_URI);
        console.log("Connected to main database successfully");

        return { connection }
    } catch (error) {
        console.log("Something went wrong while connecting to DB.\n", error);
    }

}

connectDB()

// -------------------------------------------------

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength:12
    },
    password: {
        type: String,
        required: true,
        minLength: 9

    },
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    }
})

const Users = mongoose.model('Users', userSchema)

export { Users }