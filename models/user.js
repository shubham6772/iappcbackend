import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Please enter a Email"],
        unique: [true, "Email Already Exist"],
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid Email'
        }
    },

    password: {
        type: String,
        required: [true, "Please enter a Password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    }


});

export const UserModal = mongoose.model('UserModal', schema);