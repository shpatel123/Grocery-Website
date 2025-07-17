import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      // Back to GET request since backend now gets userId from authUser middleware
      const { data } = await axios.get("/api/order/user");
      
      console.log("API Response:", data);
      
      if (data.success) {
        const orders = data.order || data.orders || data.data || [];
        console.log("Orders found:", orders);
        setMyOrders(Array.isArray(orders) ? orders : []);
      } else {
        console.log("API returned success: false", data);
        setMyOrders([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      console.log("Error response:", error.response?.data);
      setMyOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // Early return if loading
  if (loading) {
    return (
      <div className="mt-16 pb-16">
        <div className="flex flex-col items-end w-max mb-8">
          <p className="text-2xl font-medium uppercase">My Orders</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }

  // Ensure myOrders is always an array before mapping
  const ordersToDisplay = Array.isArray(myOrders) ? myOrders : [];

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      
      {ordersToDisplay.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">No orders found.</p>
          {/* Temporary: Use dummy data for testing */}
          <button 
            onClick={() => setMyOrders(dummyOrders || [])}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Load Dummy Orders (for testing)
          </button>
        </div>
      ) : (
        ordersToDisplay.map((order, index) => (
          <div key={order._id || index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>OrderId : {order._id}</span>
              <span>Payment : {order.paymentType}</span>
              <span>
                Total Amount : {currency}
                {order.amount}
              </span>
            </p>
            {Array.isArray(order.items) && order.items.map((item, itemIndex) => (
              <div
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== itemIndex + 1 && "border-b"
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                key={item._id || itemIndex}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <img
                      src={item.product?.image?.[0] || ''}
                      alt={item.product?.name || 'Product'}
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {item.product?.name || 'Unknown Product'}
                    </h2>
                    <p>Category: {item.product?.category || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                  <p>Quantity: {item.quantity || "1"}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-primary text-lg font-medium">
                  Amount: {currency}
                  {(item.product?.offerPrice || 0) * (item.quantity || 1)}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;