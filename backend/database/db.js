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


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        //! This is done to establish a similar relation of primary key and foreign key, basically agr kisi jgh "ref" use krte h to "ref" wla table primary table hoga means ref wale table me correspondin user exist krna chaiye uska corresponding balance exist krne k liye

        ref: 'Users',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Users = mongoose.model('Users', userSchema)
const Account = mongoose.model('Account', accountSchema);

export { Users, Account }