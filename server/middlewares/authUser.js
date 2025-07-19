import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  console.log("Auth middleware triggered");
  console.log("All cookies:", req.cookies);
  console.log("Headers:", req.headers.cookie);
  
  const { token } = req.cookies;

  if (!token) {
    console.log("No token found in cookies");
    return res.json({ success: false, message: "Not Authorized - No Token" });
  }

  try {
    console.log("Token found:", token);
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", tokenDecode);
    
    if (tokenDecode.id) {
       req.userId = tokenDecode.id;
       console.log("User ID set:", req.userId);
    } else {
      console.log("No user ID in token");
      return res.json({ success: false, message: "Not Authorized - Invalid Token" });
    }
    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.json({ success: false, message: "Not Authorized - Token Verification Failed" });
  }
};

export default authUser;
