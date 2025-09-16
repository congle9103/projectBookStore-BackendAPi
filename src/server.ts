import app from './app';
import mongoose from 'mongoose'

// Kết nối đến MongoDB
mongoose
.connect('mongodb://localhost:27017/dbBookStore')
.then(() => {
  console.log('Connected to MongoDB successfully');
  // Khởi động server
  app.listen(8080, () => {
    console.log(`Server is running on http://localhost:8080`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});