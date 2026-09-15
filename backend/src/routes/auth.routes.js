import { Router } from "express";
import { registerController, loginController, logoutController, getMe } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validater/auth.validation.js";
import authUser from "../middleware/auth.middleware.js";

const authRouter = Router();

// Register route
authRouter.post("/register", registerValidation, registerController);
// Login route
authRouter.post("/login", loginValidation, loginController);
// Logout route
authRouter.post("/logout", authUser, logoutController);
// Get current user route
authRouter.get("/get-me", authUser, getMe);

export default authRouter;