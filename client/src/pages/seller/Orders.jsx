import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");
      console.log("Orders API Response:", data); // Debug log
       
      if (data.success) {
        // Ensure we always set an array
        const ordersData = data.orders || data.order || data.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        toast.error(data.message);
        setOrders([]);
      }
    } catch (error) {
      console.log("Orders fetch error:", error); // Debug log
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
        <div className="md:p-10 p-4 space-y-4">
          <h2 className="text-lg font-medium">Orders List</h2>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  // Ensure orders is always an array
  const ordersToDisplay = Array.isArray(orders) ? orders : [];

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        
        {ordersToDisplay.length === 0 ? (
          <div>
            <p className="text-gray-500 mb-4">No orders found.</p>
            {/* Temporary: Use dummy data for testing */}
            <button 
              onClick={() => setOrders(dummyOrders || [])}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
            >
              Load Dummy Orders (for testing)
            </button>
          </div>
        ) : (
          ordersToDisplay.map((order, index) => (
            <div
              key={order._id || index}
              className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
            >
              <div className="flex gap-5 max-w-80">
                <img
                  className="w-12 h-12 object-cover"
                  src={assets.box_icon}
                  alt="boxIcon"
                />
                <div>
                  {Array.isArray(order.items) && order.items.map((item, itemIndex) => (
                    <div key={item._id || itemIndex} className="flex flex-col">
                      <p className="font-medium">
                        {item.product?.name || 'Unknown Product'}{" "}
                        <span className="text-primary">x {item.quantity || 1}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm md:text-base text-black/60">
                <p className="text-black/80">
                  {order.address?.firstName || ''} {order.address?.lastName || ''}
                </p>
                <p>
                  {order.address?.street || ''}, {order.address?.city || ''}
                </p>
                <p>
                  {order.address?.state || ''}, {order.address?.zipcode || ''} {order.address?.country || ''}
                </p>
                <p>{order.address?.phone || ''}</p>
              </div>

              <p className="font-medium text-lg my-auto">
                {currency}
                {order.amount || 0}
              </p>

              <div className="flex flex-col text-sm md:text-base text-black/60">
                <p>Method: {order.paymentType || 'N/A'}</p>
                <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;