import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function registerController(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email is already registered",
        success: false
      });
    }


    const user = new userModel({
      username,
      email,
      password
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.name);

    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export async function loginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) { 
        return res.status(404).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        });
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        });
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

export async function logoutController(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
        message: "Logged out successfully",
        success: true,
    });
}

export async function getMe(req, res) {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    });
}
