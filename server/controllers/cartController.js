import User from "../models/User.js";

//update user cartdata: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    // FIXED: Use cartItems (plural) to match your database field
    const { cartItems } = req.body;
    
    if (!userId) {
      return res.json({ success: false, message: "User ID not found" });
    }
    
    if (cartItems === undefined || cartItems === null) {
      return res.json({ success: false, message: "CartItems is required" });
    }
    
    // FIXED: Update cartItems (plural) field in database
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};