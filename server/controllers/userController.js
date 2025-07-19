import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // PRODUCTION COOKIE SETTINGS FOR CROSS-ORIGIN
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for HTTPS (Render uses HTTPS)
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("✅ User registered, cookie set");
    res.json({ 
      success: true, 
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.log("❌ Register error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    // PRODUCTION COOKIE SETTINGS FOR CROSS-ORIGIN
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for HTTPS (Render uses HTTPS)
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("✅ User logged in, cookie set");
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log("❌ Login error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    console.log("✅ Auth check successful for user:", user.email);
    return res.json({ success: true, user });
  } catch (error) {
    console.log("❌ IsAuth error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    console.log("✅ User logged out, cookie cleared");
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log("❌ Logout error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
