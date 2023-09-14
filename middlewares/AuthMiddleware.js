import { User } from "../models/SignUp.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    const {token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Not Logged in", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedData._id);

     next()
} 