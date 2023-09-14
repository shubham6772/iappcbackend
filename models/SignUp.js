import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },

    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: [true, "Email already exists"],
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
    },

    address: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    pincode: {
        type: Number,
        required: true,
    },

    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },

    Number: {
        type: Number,
        required: true,
    },

    otp : Number,
    otp_expire : Date,

});

schema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    this.password  = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function(enteredPassword){
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return  isMatch;
}

schema.methods.generateToken = async function() {
    return await jwt.sign({_id : this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn : "15d",
    });
}

export const User = mongoose.model("User", schema);
