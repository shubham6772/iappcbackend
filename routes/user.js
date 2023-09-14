import express from "express";
import { ChangePassword, SignUp, UpdateProfile, forgetPassword, getExistingUser, getMyProfile, logOut, login, resetPassword } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/new", SignUp);

router.get("/me", isAuthenticated,  getMyProfile)
router.get("/logout", isAuthenticated,  logOut)

router.put("/updateprofile", isAuthenticated, UpdateProfile )
router.put("/changepassword", isAuthenticated, ChangePassword)

router.route("/forgetpassword").post(forgetPassword).put(resetPassword)
router.get("/existing", getExistingUser)

export default router;