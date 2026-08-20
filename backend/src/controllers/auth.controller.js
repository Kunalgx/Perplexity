import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

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
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    const verificationLink = `http://localhost:3000/api/auth/verify-email/${token}`;

    const text = `Hello ${username},

Thank you for registering at Perplexity.

Please verify your email by clicking this link:

${verificationLink}

This link will expire in 5 days.

Best regards,
The Perplexity Team`;

    const html = `
      <h2>Hello ${username}!</h2>
      <p>Thank you for registering at Perplexity.</p>
      <p>Please verify your email by clicking the button below:</p>
      <p>
        <a href="${verificationLink}" target="_blank">
          Verify Your Email
        </a>
      </p>
      <p>This verification link will expire in 5 days.</p>
      <p>Best regards,<br>The Perplexity Team</p>
    `;

    await sendEmail(user.email, "Verify your email - Perplexity", text, html);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified
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
export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      email: decoded.email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    if (user.verified === true) {
      return res.status(200).send(`
        <h2>Email Already Verified ✅</h2>
        <p>Your email is already verified.</p>
      `);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { verified: true },
      { returnDocument: "after" }
    );

    if (!updatedUser || updatedUser.verified !== true) {
      return res.status(500).json({
        message: "Unable to verify email",
        success: false
      });
    }

    return res.status(200).send(`
      <h2>Email Verified Successfully! ✅</h2>
      <p>Your email has been verified.</p>
      
    `);
  } catch (error) {
    console.error("Verification error:", error.name);

    return res.status(400).json({
      message: "Invalid or expired verification link",
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
    const isPasswordMatch= await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(401).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        });
    }
    if (!user.verified) {
        return res.status(403).json({
            message: "Email not verified. Please verify your email before logging in.",
            success: false,
            err: "Email not verified"
        });
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
    );
   res.cookie("token", token)
   res.status(200).json({
        message: "Login successful",
       user:{
        id: user._id,
        username: user.username,
        email: user.email,
       
       }
    })
}
export async function getMe(req, res) {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password"); // Exclude password from the response

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
