import { asyncError } from "../middlewares/error.js";
import { User } from "../models/SignUp.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail, sendToken } from "../utils/features.js";
import { cookieOption } from "../utils/features.js";
import jwt from "jsonwebtoken";

export const login = asyncError(async (req, res, next) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Email not found", 404));
    }

    if (!password) {
        return next(new ErrorHandler("Please Enter Password", 400));
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
        return next(new ErrorHandler("Invalid Password", 400));
    }

    sendToken(user, res, "Login Sucessfull", 200);
});



export const SignUp = asyncError(async (req, res, next) => {
    const { name, email, password, address, city, country, pincode, role, Number } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("Email ALready Exists", 207))
    }
    user = await User.create({
        name, email, password, address, city, country, pincode, role, Number
    })

    sendToken(user, res, "Registered Successfully", 201)
});


export const getMyProfile = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
})


export const logOut = asyncError(async (req, res, next) => {

    res.status(200).cookie("token", "", {
        ...cookieOption
    }).json({
        success: true,
        message: "Logged out Successfully",
    });
})

export const UpdateProfile = asyncError(async (req, res, next) => {
    const { name, email, address, city, country, pincode, role, number } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (pincode) user.pincode = pincode;
    if (role) user.role = role;
    if (number) user.Number = number;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    });
})


export const ChangePassword = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please Fill All Fields", 400))
    }


    const isMatch = await user.comparePassword(oldPassword)

    if (!isMatch) {
        return next(new ErrorHandler("Incorrect Old Password", 400))
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully"
    });
})


export const forgetPassword = asyncError(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("Email Not Exist", 404));
    }

    const randomNum = Math.random() * (999999 - 100000) + 100000;
    const OTP = Math.floor(randomNum);

    const OTP_expires = 2 * 60 * 100000

    user.otp = OTP;
    user.otp_expire = new Date(Date.now() + OTP_expires)

    await user.save();

    const message = `Your OTP for reset password is ${OTP}, Please Ignore if have not request this.`;

    try {
        await sendEmail("IAPPC PASSWORD RESET OTP", user.email, message)
    } catch (error) {
        user.otp = null;
        user.otp_expire = null;
        await user.save();
        return next(error);
    }

    res.status(200).json({
        success: true,
        message: `Email Sent to ${user.email}`,
    });
})

export const resetPassword = asyncError(async (req, res, next) => {

    const { otp, password } = req.body;

    const user = await User.findOne({
        otp,
        otp_expire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler("Incorrect OTP or has been expired", 400))
    }

    if (!password) {
        return next(new ErrorHandler("Please Provide Password", 400))
    }


    user.password = password;
    user.otp = undefined;
    user.otp_expire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully, You can Login Now",
    });
})


export const getExistingUser = asyncError(async (req, res, next) => {

    const {token}  = req.body
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedData._id);

     if(!user) {
        return next(new ErrorHandler("Not a Existing User", 404));
     } 

     res.status(200).json({
        success: true,
        user,
     })
     
})