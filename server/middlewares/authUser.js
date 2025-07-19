import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  console.log("🔐 Auth middleware triggered");
  console.log("📋 All cookies:", req.cookies);
  console.log("🎫 Token from cookies:", req.cookies.token);
  
  const { token } = req.cookies;

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.json({ success: false, message: "Not Authorized - No Token" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", tokenDecode);
    
    if (tokenDecode.id) {
       req.userId = tokenDecode.id;
       console.log("👤 User ID set:", req.userId);
       next();
    } else {
      console.log("❌ No user ID in token");
      return res.json({ success: false, message: "Not Authorized - Invalid Token" });
    }
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.json({ success: false, message: "Not Authorized - Token Verification Failed" });
  }
};

export default authUser;
