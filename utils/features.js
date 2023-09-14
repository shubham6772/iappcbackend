import { createTransport } from "nodemailer";

export const sendToken = async (user, res, message, statusCode) => {

  const token = await user.generateToken();

  res.status(statusCode).cookie("token", token, {
    ...cookieOption,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    message: message,
    name: user.name,
    role: user.role,
    token,
  });

}


export const cookieOption = {
  secure: process.env.NODE_ENV == "development" ? false : true,
  httpOnly: process.env.NODE_ENV == "development" ? false : true,
  sameSite: process.env.NODE_ENV == "development" ? false : "none",
}


export const sendEmail = async (subject, to, text) => {
  const Transporter = createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });



  await Transporter.sendMail({
    to,
    subject,
    text,
  })
}