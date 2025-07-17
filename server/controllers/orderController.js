import Order from "../models/Order.js";
import Product from "../models/Product.js";

//place order cod: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: true, message: "Invalid data" });
    }

    //calculate amount using item
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    //add tax change(2%)
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//get orders by user id: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    // Get userId from the authenticated user (set by authUser middleware)
    const userId = req.userId;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address") // Fixed typo: "prodcut" -> "product"
      .sort({ createdAt: -1 }); // Fixed typo: "createAt" -> "createdAt"
    res.json({ success: true, order: orders });
  } catch (error) {
    res.json({ success: false, message: error.message }); 
  }
};

//get all orders (for seller / admin): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address") // Fixed: "prodcut" -> "product"
      .sort({ createdAt: -1 }); // Fixed: "createAt" -> "createdAt" if needed
    
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
