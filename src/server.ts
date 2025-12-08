import app from './app';
import mongoose from 'mongoose'
import './cron/orderStatusCron';

// Kết nối đến MongoDB
mongoose
.connect(process.env.MONGODB_URI_DEPLOY as string)
.then(() => {
  console.log('Connected to MongoDB successfully');
  // Khởi động server
  app.listen(process.env.PORT as string, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});