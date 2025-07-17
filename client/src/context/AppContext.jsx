import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [serchQuery, setSearchQuery] = useState("");

  //fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch {
      setIsSeller(false);
    }
  };

  //fetch user auth status, user data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        // FIXED: Use cartItems (plural) to match your database field
        setCartItem(data.user.cartItems || {});
      }
    } catch (error) {
      setUser(null);
      setCartItem({});
    }
  };

  //fetch all product
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } 
  };

  // Function to update cart in database
  const updateCartInDB = async (cartData) => {
    if (!user) return;

    try {
      // FIXED: Send as cartItems (plural) to match your database field
      const { data } = await axios.post("/api/cart/update", {
        cartItems: cartData,
      });
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  //add product to cart
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItem || {});
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    
    setCartItem(cartData);
    toast.success("Added to Cart");
    
    // Update database immediately after adding to cart
    if (user) {
      await updateCartInDB(cartData);
    }
  };

  //update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    let cartData = structuredClone(cartItem || {});
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItem(cartData);
    toast.success("Cart Updated");
    
    if (user) {
      await updateCartInDB(cartData);
    }
  };

  //remove product from cart
  const removeFromCart = async (itemId) => {
    let cartData = structuredClone(cartItem || {});
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItem(cartData);
    toast.success("Remove from Cart");
    
    if (user) {
      await updateCartInDB(cartData);
    }
  };

  //get cart item count
  const getCartCount = () => {
    let totalCount = 0;
    if (cartItem) {
      for (const item in cartItem) {
        totalCount += cartItem[item];
      }
    }
    return totalCount;
  };

  //get cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    if (cartItem) {
      for (const items in cartItem) {
        let itemInfo = products.find((product) => product._id === items);
        if (itemInfo && cartItem[items] > 0) {
          totalAmount += itemInfo.offerPrice * cartItem[items];
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItem,
    addToCart,
    updateCartItem,
    removeFromCart,
    serchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItem
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};