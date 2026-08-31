import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

function getRequestBaseUrl(req) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host") || "localhost:3000";
  return `${protocol.split(",")[0]}://${host}`;
}

function isLocalUrl(url) {
  return /localhost|127\.0\.0\.1/.test(url);
}

function getBackendBaseUrl(req) {
  const configuredUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;

  if (configuredUrl && (process.env.NODE_ENV !== "production" || !isLocalUrl(configuredUrl))) {
    return configuredUrl;
  }

  return getRequestBaseUrl(req);
}

function getFrontendBaseUrl(req) {
  if (process.env.FRONTEND_URL && (process.env.NODE_ENV !== "production" || !isLocalUrl(process.env.FRONTEND_URL))) {
    return process.env.FRONTEND_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return getBackendBaseUrl(req);
  }

  return process.env.CLIENT_URL || "http://localhost:5173";
}

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

    const verificationLink = `${getBackendBaseUrl(req)}/api/auth/verify-email/${token}`;

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
    const frontendBaseUrl = getFrontendBaseUrl(req);

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?verified=0&message=${encodeURIComponent("Verification token is missing")}`);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      email: decoded.email
    });

    if (!user) {
      return res.redirect(`${frontendBaseUrl}/login?verified=0&message=${encodeURIComponent("User not found")}`);
    }

    if (user.verified === true) {
      return res.redirect(`${frontendBaseUrl}/login?verified=1&message=${encodeURIComponent("Email already verified. Please sign in.")}`);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { verified: true },
      { returnDocument: "after" }
    );

    if (!updatedUser || updatedUser.verified !== true) {
      return res.redirect(`${frontendBaseUrl}/login?verified=0&message=${encodeURIComponent("Unable to verify email")}`);
    }

    return res.redirect(`${frontendBaseUrl}/login?verified=1&message=${encodeURIComponent("Email verified successfully. Please sign in.")}`);
  } catch (error) {
    console.error("Verification error:", error.name);

    return res.redirect(`${frontendBaseUrl}/login?verified=0&message=${encodeURIComponent("Invalid or expired verification link")}`);
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
