import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized - No Token" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
       req.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not Authorized - Invalid Token" });
    }
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.json({ success: false, message: "Not Authorized - Token Verification Failed" });
  }
};

export default authUser;
