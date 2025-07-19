import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import connectCloudinary from "./configs/cloudinary.js"

const app = express();
const port = process.env.PORT || 3000;

await connectCloudinary()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://grocery-website-frontend-h5p9.onrender.com'
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Cookies:', req.cookies);
  next();
});


// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: "API is working",
    allowedOrigins: allowedOrigins
  });
});

// Import routes one by one to identify the problematic one
try {
  console.log("Loading userRouter...");
  const userRouter = (await import('./routes/userRoute.js')).default;
  app.use('/api/user', userRouter);
  console.log("✅ userRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading userRouter:", error.message);
}

try {
  console.log("Loading sellerRouter...");
  const sellerRouter = (await import('./routes/sellerRoute.js')).default;
  app.use('/api/seller', sellerRouter);
  console.log("✅ sellerRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading sellerRouter:", error.message);
}

try {
  console.log("Loading productRouter...");
  const productRouter = (await import('./routes/productRoute.js')).default;
  app.use('/api/product', productRouter);
  console.log("✅ productRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading productRouter:", error.message);
}

try {
  console.log("Loading cartRouter...");
  const cartRouter = (await import('./routes/cartRoute.js')).default;
  app.use('/api/cart', cartRouter);
  console.log("✅ cartRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading cartRouter:", error.message);
}

try {
  console.log("Loading addressRouter...");
  const addressRouter = (await import('./routes/addressRoute.js')).default;
  app.use('/api/address', addressRouter);
  console.log("✅ addressRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading addressRouter:", error.message);
}

try {
  console.log("Loading orderRouter...");
  const orderRouter = (await import('./routes/orderRoute.js')).default;
  app.use('/api/order', orderRouter);
  console.log("✅ orderRouter loaded successfully");
} catch (error) {
  console.error("❌ Error loading orderRouter:", error.message);
}

// Start server after DB connects
(async () => {
  await connectDB();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
})();
