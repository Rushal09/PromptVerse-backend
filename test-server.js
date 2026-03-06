import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.json({
    message: 'Aifule Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: port
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test environment variables
app.get('/test-env', (req, res) => {
  res.json({
    mongodb_configured: !!process.env.MONGODB_URI,
    jwt_configured: !!process.env.JWT_SECRET,
    cloudinary_configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
    port: process.env.PORT || 3004
  });
});

app.listen(port, () => {
  console.log(`✅ Test server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 MongoDB URI configured: ${!!process.env.MONGODB_URI}`);
  console.log(`🔑 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
  console.log(`☁️ Cloudinary configured: ${!!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)}`);
});

export default app;
