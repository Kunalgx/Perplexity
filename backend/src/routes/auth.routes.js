import { Router } from "express";
import { registerController, verifyEmail , loginController, getMe} from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validater/auth.validation.js";
import authUser from "../middleware/auth.middleware.js";
const authRouter = Router();

authRouter.post("/register",registerValidation,registerController);

authRouter.get("/verify-email/:token",verifyEmail);

authRouter.post("/login",loginValidation,loginController);

authRouter.get("/get-me",authUser,getMe);


export default authRouter;